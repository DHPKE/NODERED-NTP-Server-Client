module.exports = function(RED) {
    const dgram = require('dgram');
    
    function NTPClientNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Get NTP server from config or use default
        node.ntpServer = config.ntpServer || 'pool.ntp.org';
        node.port = parseInt(config.port) || 123;
        node.timeout = parseInt(config.timeout) || 5000;
        
        node.on('input', function(msg) {
            // Allow dynamic override of NTP server
            const server = msg.ntpServer || node.ntpServer;
            const port = msg.ntpPort || node.port;
            
            node.status({fill: "blue", shape: "dot", text: "querying..."});
            
            queryNTP(server, port, node.timeout)
                .then(result => {
                    msg.payload = {
                        timestamp: result.timestamp,
                        date: result.date,
                        iso: result.iso,
                        unixTime: result.unixTime,
                        server: server,
                        roundTripDelay: result.roundTripDelay
                    };
                    node.status({fill: "green", shape: "dot", text: "success"});
                    node.send(msg);
                })
                .catch(err => {
                    node.status({fill: "red", shape: "ring", text: "error"});
                    node.error("NTP query failed: " + err.message, msg);
                });
        });
        
        node.on('close', function() {
            node.status({});
        });
    }
    
    function queryNTP(server, port, timeout) {
        return new Promise((resolve, reject) => {
            const client = dgram.createSocket('udp4');
            const ntpData = Buffer.alloc(48);
            
            // Set LI, Version, Mode fields
            // LI = 0 (no warning), VN = 3 (IPv4), Mode = 3 (client)
            ntpData[0] = 0x1B;
            
            const t1 = Date.now();
            
            // Set timeout
            const timeoutHandle = setTimeout(() => {
                client.close();
                reject(new Error(`Timeout after ${timeout}ms`));
            }, timeout);
            
            client.on('error', (err) => {
                clearTimeout(timeoutHandle);
                client.close();
                reject(err);
            });
            
            client.on('message', (msg) => {
                clearTimeout(timeoutHandle);
                const t4 = Date.now();
                
                try {
                    // Extract the Transmit Timestamp (bytes 40-47)
                    const intPart = msg.readUInt32BE(40);
                    const fracPart = msg.readUInt32BE(44);
                    
                    // NTP epoch is 1900-01-01, Unix epoch is 1970-01-01
                    // Difference in seconds: 2208988800
                    const ntpEpochOffset = 2208988800;
                    
                    // Convert to Unix timestamp
                    const seconds = intPart - ntpEpochOffset;
                    const milliseconds = (fracPart / 0x100000000) * 1000;
                    const unixTime = (seconds * 1000) + milliseconds;
                    
                    const date = new Date(unixTime);
                    
                    resolve({
                        timestamp: unixTime,
                        date: date.toString(),
                        iso: date.toISOString(),
                        unixTime: Math.floor(unixTime / 1000),
                        roundTripDelay: t4 - t1
                    });
                } catch (err) {
                    reject(new Error("Failed to parse NTP response: " + err.message));
                } finally {
                    client.close();
                }
            });
            
            client.send(ntpData, 0, ntpData.length, port, server, (err) => {
                if (err) {
                    clearTimeout(timeoutHandle);
                    client.close();
                    reject(err);
                }
            });
        });
    }
    
    RED.nodes.registerType("ntp-client", NTPClientNode);
}

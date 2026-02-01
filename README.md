# Node-RED NTP Client

A Node-RED node that queries NTP (Network Time Protocol) servers to get the current time. Supports both internet-based and local NTP servers.

## Features

- ✅ Configurable NTP server (editable in node config)
- ✅ Works with public internet NTP servers
- ✅ Works with local/private NTP servers
- ✅ Configurable port and timeout
- ✅ Dynamic server override via message properties
- ✅ Multiple time format outputs (ISO, Unix, human-readable)
- ✅ Network latency measurement (round-trip delay)
- ✅ Visual status indicators (querying/success/error)

## Installation

### From Node-RED

1. Go to Menu → Manage palette → Install
2. Search for `node-red-contrib-ntp-client`
3. Click Install

### Manual Installation

Navigate to your Node-RED user directory (usually `~/.node-red`):

```bash
cd ~/.node-red
npm install node-red-contrib-ntp-client
```

### Development Installation

Clone this repository and install locally:

```bash
git clone https://github.com/DHPKE/NODERED-NTP-Server-Client.git
cd NODERED-NTP-Server-Client
npm install
cd ~/.node-red
npm install /path/to/NODERED-NTP-Server-Client
```

Then restart Node-RED.

## Usage

1. Drag the **ntp-client** node from the function category into your flow
2. Double-click to configure the NTP server (default: `pool.ntp.org`)
3. Wire an inject node (or any trigger) to the input
4. Wire the output to a debug node to see the results

## Configuration

- **Name**: Optional name for the node
- **NTP Server**: Hostname or IP address of the NTP server
  - **Public servers**: `pool.ntp.org`, `time.google.com`, `time.cloudflare.com`, `time.apple.com`
  - **Local server**: e.g., `192.168.1.1`, `10.0.0.1`, or your router's IP
- **Port**: UDP port (default: 123)
- **Timeout**: Maximum wait time in milliseconds (default: 5000)

## Input

The node accepts any message as a trigger. You can optionally override settings:

- `msg.ntpServer` - Use a different NTP server for this request
- `msg.ntpPort` - Use a different port for this request

## Output

The node outputs `msg.payload` with the following properties:

```javascript
{
  timestamp: 1706799600000,      // Unix timestamp in milliseconds
  date: "Thu Feb 01 2024...",    // Human-readable date string
  iso: "2024-02-01T14:00:00.000Z", // ISO 8601 format
  unixTime: 1706799600,          // Unix timestamp in seconds
  server: "pool.ntp.org",        // NTP server that was queried
  roundTripDelay: 45             // Network latency in milliseconds
}
```

## Example Flow

```json
[
    {
        "id": "inject1",
        "type": "inject",
        "name": "Get Time",
        "props": [],
        "repeat": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 100,
        "y": 100,
        "wires": [["ntp1"]]
    },
    {
        "id": "ntp1",
        "type": "ntp-client",
        "name": "NTP Time",
        "ntpServer": "pool.ntp.org",
        "port": 123,
        "timeout": 5000,
        "x": 300,
        "y": 100,
        "wires": [["debug1"]]
    },
    {
        "id": "debug1",
        "type": "debug",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "x": 500,
        "y": 100,
        "wires": []
    }
]
```

## Popular NTP Servers

### Public Internet Servers

- `pool.ntp.org` - NTP Pool Project (default, recommended)
- `time.google.com` - Google Public NTP
- `time.cloudflare.com` - Cloudflare NTP
- `time.apple.com` - Apple NTP
- `time.windows.com` - Microsoft NTP
- `time.nist.gov` - NIST Internet Time Service

### Local Network

- Your router's IP address (many routers have built-in NTP servers)
- Local time server (e.g., `192.168.1.1`, `10.0.0.1`)
- Private NTP server on your network

## Use Cases

- Synchronize timestamps across your flows
- Time-based automation and scheduling
- Data logging with accurate timestamps
- Network time monitoring
- Offline/local network time synchronization

## Technical Details

This node implements the NTP protocol (RFC 5905) using UDP datagrams. It:

1. Sends an NTP request packet to the configured server
2. Receives the response with the current time
3. Calculates the network round-trip delay
4. Converts NTP timestamps (epoch 1900-01-01) to Unix timestamps (epoch 1970-01-01)
5. Provides multiple output formats for convenience

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

DHPKE

## Repository

https://github.com/DHPKE/NODERED-NTP-Server-Client

## Issues

Report issues at: https://github.com/DHPKE/NODERED-NTP-Server-Client/issues

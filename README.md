# Node-RED NTP Client

A Node-RED node that queries NTP (Network Time Protocol) servers to get the current time. Supports both internet-based and local NTP servers with automatic interval polling and flexible output formatting.

## Features

- ✅ **Automatic interval polling** - No need to trigger manually
- ✅ **Configurable intervals** - milliseconds, seconds, minutes, or hours
- ✅ **Flexible output formats** - Object or formatted string
- ✅ **Multiple date formats** - ISO, locale, date-only, time-only, Unix timestamps
- ✅ **Works with public internet NTP servers**
- ✅ **Works with local/private NTP servers**
- ✅ **Configurable port and timeout**
- ✅ **Dynamic server override via message properties**
- ✅ **Network latency measurement** (round-trip delay)
- ✅ **Visual status indicators** (querying/success/error)
- ✅ **Manual trigger mode** (set interval to 0)

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

### Automatic Mode (No Trigger Needed)

1. Drag the **ntp-client** node into your flow
2. Double-click to configure:
   - Set NTP server (default: `pool.ntp.org`)
   - Set interval (e.g., `30` seconds)
   - Choose output format
3. Wire the output to your destination (debug, function, etc.)
4. Deploy - the node will automatically send time updates at the configured interval!

### Manual Mode (Trigger Required)

1. Set interval to `0` in the node configuration
2. Wire an inject node (or any trigger) to the input
3. The node will only query when triggered

## Configuration

### Basic Settings

- **Name**: Optional name for the node
- **NTP Server**: Hostname or IP address of the NTP server
  - **Public servers**: `pool.ntp.org`, `time.google.com`, `time.cloudflare.com`, `time.apple.com`
  - **Local server**: e.g., `192.168.1.1`, `10.0.0.1`, or your router's IP
- **Port**: UDP port (default: 123)
- **Timeout**: Maximum wait time in milliseconds (default: 5000)

### Interval Settings

- **Interval**: How often to query the NTP server
  - Set to `0` to disable automatic polling (manual trigger only)
  - Choose units: milliseconds, seconds, minutes, or hours
  - Example: `30 seconds` = query every 30 seconds

### Output Settings

- **Output Format**:
  - **Object** (default): Returns all time formats in a single object
  - **String**: Returns a single formatted string

- **Date Format** (when String output is selected):
  - **ISO 8601**: `2024-02-01T14:00:00.000Z`
  - **Locale String**: `2/1/2024, 2:00:00 PM`
  - **Date Only**: `2/1/2024`
  - **Time Only**: `2:00:00 PM`
  - **Unix Timestamp**: `1706799600` (seconds)
  - **Timestamp**: `1706799600000` (milliseconds)

## Input

The node accepts any message as a trigger (when in manual mode or to override automatic polling). You can optionally override settings:

- `msg.ntpServer` - Use a different NTP server for this request
- `msg.ntpPort` - Use a different port for this request

## Output

### Object Format (default)

```javascript
{
  timestamp: 1706799600000,      // Unix timestamp in milliseconds
  date: "Thu Feb 01 2024...",    // Human-readable date string
  iso: "2024-02-01T14:00:00.000Z", // ISO 8601 format
  locale: "2/1/2024, 2:00:00 PM",  // Locale-formatted string
  unixTime: 1706799600,          // Unix timestamp in seconds
  server: "pool.ntp.org",        // NTP server that was queried
  roundTripDelay: 45             // Network latency in milliseconds
}
```

### String Format

Returns a single string in the selected format:
- ISO: `"2024-02-01T14:00:00.000Z"`
- Locale: `"2/1/2024, 2:00:00 PM"`
- Date: `"2/1/2024"`
- Time: `"2:00:00 PM"`
- Unix: `"1706799600"`
- Timestamp: `"1706799600000"`

## Example Flows

### Example 1: Automatic Time Updates Every Minute

```json
[
    {
        "id": "ntp1",
        "type": "ntp-client",
        "name": "Time Every Minute",
        "ntpServer": "pool.ntp.org",
        "port": 123,
        "timeout": 5000,
        "interval": 1,
        "intervalUnit": "minutes",
        "outputFormat": "string",
        "dateFormat": "locale",
        "x": 300,
        "y": 100,
        "wires": [["debug1"]]
    },
    {
        "id": "debug1",
        "type": "debug",
        "name": "",
        "active": true,
        "x": 500,
        "y": 100,
        "wires": []
    }
]
```

### Example 2: Manual Trigger with Full Object Output

```json
[
    {
        "id": "inject1",
        "type": "inject",
        "name": "Get Time",
        "props": [],
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
        "interval": 0,
        "intervalUnit": "seconds",
        "outputFormat": "object",
        "x": 300,
        "y": 100,
        "wires": [["debug1"]]
    },
    {
        "id": "debug1",
        "type": "debug",
        "name": "",
        "active": true,
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

- **Automatic time synchronization** - Keep your flows synchronized with accurate time
- **Periodic timestamp logging** - Log data with precise timestamps
- **Time-based automation** - Trigger actions based on network time
- **Network time monitoring** - Track time server availability and latency
- **Offline/local network time** - Use local NTP servers when internet is unavailable
- **Clock displays** - Update dashboard clocks automatically
- **Scheduled tasks** - Coordinate actions across multiple systems

## Technical Details

This node implements the NTP protocol (RFC 5905) using UDP datagrams. It:

1. Sends an NTP request packet to the configured server
2. Receives the response with the current time
3. Calculates the network round-trip delay
4. Converts NTP timestamps (epoch 1900-01-01) to Unix timestamps (epoch 1970-01-01)
5. Provides multiple output formats for convenience
6. Optionally repeats at a configured interval

## Version History

- **1.1.0** - Added automatic interval polling and flexible output formats
- **1.0.0** - Initial release with manual trigger mode

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

DHPKE

## Repository

https://github.com/DHPKE/NODERED-NTP-Server-Client

## Issues

Report issues at: https://github.com/DHPKE/NODERED-NTP-Server-Client/issues

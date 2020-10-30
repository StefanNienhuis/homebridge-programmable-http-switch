<span align="center">

# Programmable HTTP Switch

[![Downloads](https://img.shields.io/npm/dt/homebridge-programmable-http-switch)](https://www.npmjs.com/package/homebridge-programmable-http-switch)
[![Version](https://img.shields.io/npm/v/homebridge-programmable-http-switch)](https://www.npmjs.com/package/homebridge-programmable-http-switch)
<br/>
[![Issues](https://img.shields.io/github/issues/StefanNienhuis/homebridge-programmable-http-switch)](https://github.com/StefanNienhuis/homebridge-programmable-http-switch/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/StefanNienhuis/homebridge-programmable-http-switch)](https://github.com/StefanNienhuis/homebridge-programmable-http-switch/pulls)

This [Homebridge](https://homebridge.io) plugin allows users to create Stateless Programmable Switches which can be controlled using a HTTP API.

</span>

## Installation
First, install Homebridge<br/>
`npm install --global homebridge`

Then, install the Programmable HTTP Switch plugin<br/>
`npm install --global homebridge-programmable-http-switch`

## Configuration
### Platform configuration
An example configuration can be found in the [config.example.json](config.example.json) file.

| Property      | Type          | Details                                                                        |
| ------------- | ------------- | ------------------------------------------------------------------------------ |
| `platform`    | `string`      | **Required**<br/>Must always be `ProgrammableHTTPSwitch`.                      |
| `accessories` | `Accessory[]` | **Required**<br/>List of [accessory configurations](#accessory-configuration). |
| `port`        | `number`      | Optional, default: `3000`<br/>The port that the HTTP server should listen on.  |

### Accessory configuration
| Property     | Type       | Details                                                                  |
| ------------ | ---------- | ------------------------------------------------------------------------ |
| `name`       | `string`   | **Required**<br/>The name of the accessory.                              |
| `identifier` | `string`   | **Required**<br/>The identifier used in the API.                         |
| `buttons`    | `Button[]` | **Required**<br/>List of [button configurations](#button-configuration). |

### Button configuration
| Property           | Type       | Details                                                                                                                                                      |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`             | `string`   | **Required**<br/>The name of the button.<br/> *Note:* Not shown in Apple's Home app.                                                                         |
| `identifier`       | `string`   | **Required**<br/>The identifier used in the API.                                                                                                             |
| `supportedActions` | `string[]` | Optional, default: all<br/>List of actions that this button supports.<br/>*Supported values:* `singlePress` (`0`), `doublePress` (`1`) and `longPress` (`2`) |

## API endpoints

### `GET /accessories`
**Description**<br/>
Returns all the currently configured accessoires.

### `GET /accessories/:accessoryIdentifier`
**Description**<br/>
Returns an accessory with a specific identifier.

### `GET /accessories/:accessoryIdentifier/buttons`
**Description**<br/>
Returns all buttons for an accessory with a specific identifier.

### `GET /accessories/:accessoryIdentifier/buttons/:buttonIdentifier`
**Description**<br/>
Returns a button with a specific identifier for an accessory with a specific identifier.

### `PUT /accessories/:accessoryIdentifier/buttons/:buttonIdentifier`
**Description**<br/>
Sets the state of a specific button on a specific accessory.

**Body**<br/>
```json
{
    "action": "singlePress"
}
```

*Note:* Action must be one of the supported actions configured for the specific button.
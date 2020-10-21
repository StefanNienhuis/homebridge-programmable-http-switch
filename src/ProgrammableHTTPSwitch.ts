import { HAP, StaticPlatformPlugin, PlatformConfig, AccessoryPlugin, API, Logging } from 'homebridge';
import ProgrammableHTTPSwitchAccessory from './ProgrammableHTTPSwitchAccessory';

import { Config } from './types';

export default class ProgrammableHTTPSwitch implements StaticPlatformPlugin {
    
    private config: Config;
    private log: Logging;
    private hap: HAP;

    constructor(log: Logging, config: PlatformConfig, api: API) {
        this.config = config as Config;
        this.log = log;
        this.hap = api.hap;

        this.log.info('Successfully initialized ProgrammableHTTPSwitch');
    }

    accessories = (callback: (accessories: AccessoryPlugin[]) => void): void => {
        callback(this.config.accessories.map((accessoryConfig) => new ProgrammableHTTPSwitchAccessory(this.log, accessoryConfig, this.hap)));
    }

}
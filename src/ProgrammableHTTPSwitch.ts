import { HAP, StaticPlatformPlugin, PlatformConfig, AccessoryPlugin, API, Logging } from 'homebridge';
import Server from './Server';
import ProgrammableHTTPSwitchAccessory from './ProgrammableHTTPSwitchAccessory';

import { Config } from './types';

export default class ProgrammableHTTPSwitch implements StaticPlatformPlugin {
    
    private config: Config;
    private log: Logging;
    private hap: HAP;

    private server: Server;

    constructor(log: Logging, config: PlatformConfig, api: API) {
        this.config = config as Config;
        this.log = log;
        this.hap = api.hap;

        this.server = new Server(this.log, this.config);

        this.log.info('Successfully initialized ProgrammableHTTPSwitch');
    }

    accessories = (callback: (accessories: AccessoryPlugin[]) => void): void => {
        let accessories: {[key: string]: ProgrammableHTTPSwitchAccessory} = {};

        for (let accessory of this.config.accessories) {
            accessories[accessory.identifier] = new ProgrammableHTTPSwitchAccessory(this.log, accessory, this.hap);
        }

        this.server.setAccessories(accessories);
        this.server.start();

        callback(Object.values(accessories));
    }

}
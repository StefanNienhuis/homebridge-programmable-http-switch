import { HAP, AccessoryPlugin, Service, Logging } from 'homebridge';

import { AccessoryConfig, ButtonConfig, Action } from './types';
import { VERSION } from './const';

export default class ProgrammableHTTPSwitchAccessory implements AccessoryPlugin {

    name: string;

    private config: AccessoryConfig;
    private log: Logging;
    private hap: HAP;
    
    private programmableSwitchServices: {[key: string]: Service} = {};
    private informationService: Service;

    constructor(log: Logging, config: AccessoryConfig, hap: HAP) {
        this.config = config as AccessoryConfig;
        this.log = log;
        this.hap = hap;

        this.name = this.config.name;

        for (let [indexString, button] of Object.entries(this.config.buttons)) {
            let index = Number(indexString);
            this.programmableSwitchServices[button.identifier] = this.createService(button, index);
        }
        
        this.informationService = new this.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Homebridge')
            .setCharacteristic(this.hap.Characteristic.SerialNumber, this.config.identifier)
            .setCharacteristic(this.hap.Characteristic.Model, 'Programmable HTTP Switch')
            .setCharacteristic(this.hap.Characteristic.FirmwareRevision, VERSION);

        this.log.info(`Successfully initialized ProgrammableHTTPSwitch accessory '${this.config.name}'`);
    }

    getServices = (): Service[] => {
        return [
            ...Object.values(this.programmableSwitchServices),
            this.informationService
        ];
    }

    identify = (): void => {
        this.log.info(`Identify triggered for accessory '${this.name}'`);
    }

    createService = (button: ButtonConfig, index: number): Service => {
        let service = new this.hap.Service.StatelessProgrammableSwitch(button.name, button.identifier);
        
        service.getCharacteristic(this.hap.Characteristic.ProgrammableSwitchEvent)
               .setProps({
                   validValues: button.supportedActions?.map((action: string | number) => typeof action != 'number' ? Action[action as keyof typeof Action] : action) || [0, 1, 2]
               });

        service.setCharacteristic(this.hap.Characteristic.ServiceLabelIndex, index + 1);

        return service;
    }

    setState = (buttonIdentifier: string, action: Action): void => {
        this.programmableSwitchServices[buttonIdentifier]
            .setCharacteristic(this.hap.Characteristic.ProgrammableSwitchEvent, action);
    }
}
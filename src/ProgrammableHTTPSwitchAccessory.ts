import { HAP, Service, Logging } from 'homebridge';

import { AccessoryConfig, SingleButtonAccessoryConfig, MultipleButtonsAccessoryConfig, Action } from './types';
import { VERSION } from './const';

export default class ProgrammableHTTPSwitchAccessory {

    private config: AccessoryConfig;
    private log: Logging;
    private hap: HAP;

    name: string;
    
    private programmableSwitchServices: Service[] = [];
    private informationService: Service;

    constructor(log: Logging, config: AccessoryConfig, hap: HAP) {
        this.config = config as AccessoryConfig;
        this.log = log;
        this.hap = hap;

        this.name = this.config.name;

        if (this.hasMultipleButtons()) {
            this.programmableSwitchServices.push(...(this.config as MultipleButtonsAccessoryConfig).buttons.map(this.createService));
        } else {
            this.programmableSwitchServices = [this.createService(this.config as SingleButtonAccessoryConfig)];
        }

        this.informationService = new this.hap.Service.AccessoryInformation()
            .setCharacteristic(this.hap.Characteristic.Manufacturer, 'Homebridge')
            .setCharacteristic(this.hap.Characteristic.SerialNumber, this.config.identifier)
            .setCharacteristic(this.hap.Characteristic.Model, 'Programmable HTTP Switch')
            .setCharacteristic(this.hap.Characteristic.FirmwareRevision, VERSION);

        this.log.info(`Successfully initialized ProgrammableHTTPSwitch accessory '${this.config.name}'`);
    }

    createService = (button: SingleButtonAccessoryConfig): Service => {
        let service = new this.hap.Service.StatelessProgrammableSwitch(button.name, button.identifier);
        
        service
            .getCharacteristic(this.hap.Characteristic.ProgrammableSwitchEvent)
            .setProps({
                validValues: button.supportedActions?.map((action: string | number) => typeof action != 'number' ? Action[action as keyof typeof Action] : action) || [0, 1, 2]
            });

        return service;
    }

    getServices = (): Service[] => {
        return [
            ...this.programmableSwitchServices,
            this.informationService
        ];
    }

    hasMultipleButtons = (config: AccessoryConfig = this.config): boolean => {
        return Object.prototype.hasOwnProperty.call(config, 'buttons');
    }
}
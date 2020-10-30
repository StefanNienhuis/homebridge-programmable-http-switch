import { PlatformConfig } from 'homebridge';
import { Action } from '.';

export interface Config extends PlatformConfig {
    accessories: AccessoryConfig[];
    port: number;
}

export interface AccessoryConfig {
    name: string;
    identifier: string;
    buttons: ButtonConfig[];
}

export interface ButtonConfig {
    name: string;
    identifier: string;
    supportedActions: Action[];
}
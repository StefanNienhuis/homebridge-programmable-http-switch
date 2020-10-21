import { PlatformConfig } from 'homebridge';
import { Action } from '.';

export interface Config extends PlatformConfig {
    accessories: AccessoryConfig[];
}

export type AccessoryConfig = SingleButtonAccessoryConfig | MultipleButtonsAccessoryConfig;

export interface SingleButtonAccessoryConfig {
    name: string;
    identifier: string;
    supportedActions?: Action[];
}

export interface MultipleButtonsAccessoryConfig {
    name: string;
    identifier: string;
    buttons: SingleButtonAccessoryConfig[];
}


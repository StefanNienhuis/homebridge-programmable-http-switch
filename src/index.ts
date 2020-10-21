import { API } from 'homebridge';
import ProgrammableHTTPSwitch from './ProgrammableHTTPSwitch';

import { PLATFORM_NAME } from './const';

export default (api: API): void => {
    api.registerPlatform(PLATFORM_NAME, ProgrammableHTTPSwitch);
};
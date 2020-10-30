import { Logging } from 'homebridge';
import Express from 'express';
import ProgrammableHTTPSwitchAccessory from './ProgrammableHTTPSwitchAccessory';
import { Config, AccessoryConfig, ButtonConfig, Action } from './types';

export default class Server {

    private log: Logging;
    private config: Config;
    private server: Express.Express;

    private accessories: {[key: string]: ProgrammableHTTPSwitchAccessory} = {};

    constructor(log: Logging, config: Config) {
        this.log = log;
        this.config = config;
        this.server = Express();

        this.server.use(Express.json());

        this.server.get('/accessories', this.getAccessories);
        this.server.get('/accessories/:accessoryIdentifier', this.getAccessory);
        this.server.get('/accessories/:accessoryIdentifier/buttons', this.getButtons);
        this.server.get('/accessories/:accessoryIdentifier/buttons/:buttonIdentifier', this.getButton);
        this.server.put('/accessories/:accessoryIdentifier/buttons/:buttonIdentifier', this.putButton);
    }

    start = (): void => {
        this.server.listen(this.config.port, () => {
            this.log.info(`Started listening on port ${this.config.port}`);
        });
    }

    setAccessories = (accessories: {[key: string]: ProgrammableHTTPSwitchAccessory}): void => {
        this.accessories = accessories;
    }

    setState = (accessoryIdentifier: string, buttonIdentifier: string, action: Action): void => {
        this.accessories[accessoryIdentifier].setState(buttonIdentifier, action);
    }

    // Accessories

    private accessory = (identifier: string): AccessoryConfig | undefined => {
        return this.config.accessories.find((accessory) => accessory.identifier == identifier);
    }

    private getAccessories: Express.RequestHandler = (request, response) => {
        response.json({
            success: true,
            data: this.config.accessories
        });
    }

    private getAccessory: Express.RequestHandler = (request, response) => {
        let accessoryIdentifier = request.params.accessoryIdentifier;

        if (accessoryIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'accessoryIdentifier'."
                }
            });

            return;
        }

        let accessory = this.accessory(accessoryIdentifier);

        if (accessory == null) {
            response.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: `Couldn't find accessory with identifier '${accessoryIdentifier}'.`
                }
            });

            return;
        }

        response.json({
            success: true,
            data: accessory
        });
    }

    // Buttons

    private buttons = (accessoryIdentifier: string): ButtonConfig[] | undefined => {
        return this.accessory(accessoryIdentifier)?.buttons;
    }

    private button = (accessoryIdentifier: string, buttonIdentifier: string): ButtonConfig | undefined => {
        return this.buttons(accessoryIdentifier)?.find((button) => button.identifier == buttonIdentifier);
    }

    private getButtons: Express.RequestHandler = (request, response) => {
        let accessoryIdentifier = request.params.accessoryIdentifier;

        if (accessoryIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'accessoryIdentifier'."
                }
            });

            return;
        }

        let buttons = this.buttons(accessoryIdentifier);

        if (buttons == null) {
            response.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: `Couldn't find accessory with identifier '${accessoryIdentifier}'.`
                }
            });

            return;
        }

        response.json({
            success: true,
            data: buttons
        });
    }

    private getButton: Express.RequestHandler = (request, response) => {
        let accessoryIdentifier = request.params.accessoryIdentifier;
        let buttonIdentifier = request.params.buttonIdentifier;

        if (accessoryIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'accessoryIdentifier'."
                }
            });

            return;
        }

        if (buttonIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'buttonIdentifier'."
                }
            });

            return;
        }

        let button = this.button(accessoryIdentifier, buttonIdentifier);

        if (button == null) {
            response.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: `Couldn't find button with identifier '${accessoryIdentifier}' for accessory with identifier '${accessoryIdentifier}'.`
                }
            });

            return;
        }

        response.json({
            success: true,
            data: button
        });
    }

    private putButton: Express.RequestHandler = (request, response) => {
        let accessoryIdentifier = request.params.accessoryIdentifier;
        let buttonIdentifier = request.params.buttonIdentifier;

        let rawAction = request.body.action;

        if (accessoryIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'accessoryIdentifier'."
                }
            });

            return;
        }

        if (buttonIdentifier == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required parameter 'buttonIdentifier'."
                }
            });

            return;
        }

        if (rawAction == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: "Missing required property 'action'."
                }
            });

            return;
        }

        let button = this.button(accessoryIdentifier, buttonIdentifier);

        if (button == null) {
            response.status(404).json({
                success: false,
                error: {
                    code: 404,
                    message: `Couldn't find button with identifier '${accessoryIdentifier}' for accessory with identifier '${accessoryIdentifier}'.`
                }
            });

            return;
        }

        let action = this.action(rawAction);

        if (action == null) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: `Invalid action '${action}'.`
                }
            });

            return;
        }

        if (!button.supportedActions.map(this.action).includes(action)) {
            response.status(400).json({
                success: false,
                error: {
                    code: 400,
                    message: `Button with identifier '${buttonIdentifier}' does not support action '${Action[action]}'.`
                }
            });

            return;
        }

        this.setState(accessoryIdentifier, buttonIdentifier, action);

        response.json({
            success: true
        });
    }

    action = (action: string | number): Action | undefined => {
        if (typeof action == 'string') {
            return Action[action as keyof typeof Action];
        } else {
            return action;
        }
    }

}
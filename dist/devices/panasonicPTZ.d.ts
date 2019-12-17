import { DeviceWithState, DeviceStatus, IDevice } from './device';
import { DeviceType, TimelineContentTypePanasonicPtz, PanasonicPTZOptions, DeviceOptionsPanasonicPTZ } from '../types/src';
import { TimelineState } from 'superfly-timeline';
export interface DeviceOptionsPanasonicPTZInternal extends DeviceOptionsPanasonicPTZ {
    options: (DeviceOptionsPanasonicPTZ['options'] & {
        commandReceiver?: CommandReceiver;
    });
}
export declare type CommandReceiver = (time: number, cmd: PanasonicPtzCommand, context: CommandContext, timelineObjId: string) => Promise<any>;
export interface PanasonicPtzState {
    speed?: {
        value: number;
        timelineObjId: string;
    };
    preset?: {
        value: number;
        timelineObjId: string;
    };
    zoomSpeed?: {
        value: number;
        timelineObjId: string;
    };
    zoom?: {
        value: number;
        timelineObjId: string;
    };
}
export interface PanasonicPtzCommand {
    type: TimelineContentTypePanasonicPtz;
    speed?: number;
    preset?: number;
    zoomSpeed?: number;
    zoom?: number;
}
export interface PanasonicPtzCommandWithContext {
    command: PanasonicPtzCommand;
    context: CommandContext;
    timelineObjId: string;
}
declare type CommandContext = any;
/**
 * A wrapper for panasonic ptz cameras. Maps timeline states to device states and
 * executes commands to achieve such states. Depends on PanasonicPTZAPI class for
 * connection with the physical device.
 */
export declare class PanasonicPtzDevice extends DeviceWithState<TimelineState> implements IDevice {
    private _doOnTime;
    private _device;
    private _connected;
    private _commandReceiver;
    constructor(deviceId: string, deviceOptions: DeviceOptionsPanasonicPTZInternal, options: any);
    /**
     * Initiates the device: set up ping for connection logic.
     */
    init(_initOptions: PanasonicPTZOptions): Promise<boolean>;
    /**
     * Converts a timeline state into a device state.
     * @param state
     */
    convertStateToPtz(state: TimelineState): PanasonicPtzState;
    /** Called by the Conductor a bit before a .handleState is called */
    prepareForHandleState(newStateTime: number): void;
    /**
     * Handles a new state such that the device will be in that state at a specific point
     * in time.
     * @param newState
     */
    handleState(newState: TimelineState): void;
    clearFuture(clearAfterTime: number): void;
    terminate(): Promise<boolean>;
    getStatus(): DeviceStatus;
    private _getDefaultState;
    private _defaultCommandReceiver;
    /**
     * Add commands to queue, to be executed at the right time
     */
    private _addToQueue;
    /**
     * Compares the new timeline-state with the old one, and generates commands to account for the difference
     */
    private _diffStates;
    readonly canConnect: boolean;
    readonly connected: boolean;
    readonly deviceType: DeviceType;
    readonly deviceName: string;
    readonly queue: {
        id: string;
        queueId: string;
        time: number;
        args: any[];
    }[];
    private _setConnected;
    private _connectionChanged;
    private getValue;
}
export {};
import { DeviceWithState, DeviceStatus, IDevice } from './device';
import { DeviceType, DeviceOptionsSisyfos, Mappings } from '../types/src';
import { TimelineState } from 'superfly-timeline';
import { SisyfosOptions } from '../types/src/sisyfos';
import { SisyfosCommand, SisyfosState, SisyfosChannel } from './sisyfosAPI';
export interface DeviceOptionsSisyfosInternal extends DeviceOptionsSisyfos {
    options: (DeviceOptionsSisyfos['options'] & {
        commandReceiver?: CommandReceiver;
    });
}
export declare type CommandReceiver = (time: number, cmd: SisyfosCommand, context: CommandContext, timelineObjId: string) => Promise<any>;
declare type CommandContext = string;
/**
 * This is a generic wrapper for any osc-enabled device.
 */
export declare class SisyfosMessageDevice extends DeviceWithState<SisyfosState> implements IDevice {
    private _doOnTime;
    private _sisyfos;
    private _commandReceiver;
    private _resyncing;
    constructor(deviceId: string, deviceOptions: DeviceOptionsSisyfosInternal, options: any);
    init(initOptions: SisyfosOptions): Promise<boolean>;
    /** Called by the Conductor a bit before a .handleState is called */
    prepareForHandleState(newStateTime: number): void;
    /**
     * Handles a new state such that the device will be in that state at a specific point
     * in time.
     * @param newState
     */
    handleState(newState: TimelineState, newMappings: Mappings): void;
    private _handleStateInner;
    /**
     * Clear any scheduled commands after this time
     * @param clearAfterTime
     */
    clearFuture(clearAfterTime: number): void;
    terminate(): Promise<boolean>;
    getStatus(): DeviceStatus;
    makeReady(okToDestroyStuff?: boolean): Promise<void>;
    private _makeReadyInner;
    get canConnect(): boolean;
    get connected(): boolean;
    getDeviceState(isDefaultState?: boolean): SisyfosState;
    getDefaultStateChannel(): SisyfosChannel;
    /**
     * Transform the timeline state into a device state, which is in this case also
     * a timeline state.
     * @param state
     */
    convertStateToSisyfosState(state: TimelineState, mappings: Mappings): SisyfosState;
    get deviceType(): DeviceType;
    get deviceName(): string;
    get queue(): {
        id: string;
        queueId: string;
        time: number;
        args: any[];
    }[];
    /**
     * add the new commands to the queue:
     * @param commandsToAchieveState
     * @param time
     */
    private _addToQueue;
    /**
     * Compares the new timeline-state with the old one, and generates commands to account for the difference
     */
    private _diffStates;
    private _defaultCommandReceiver;
    private _connectionChanged;
}
export {};

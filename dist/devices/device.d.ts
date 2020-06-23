/// <reference types="node" />
import { TimelineState } from 'superfly-timeline';
import { Mappings, DeviceType, ExpectedPlayoutItemContent } from '../types/src';
import { EventEmitter } from 'events';
import { CommandReport, DoOnTime } from '../doOnTime';
import { DeviceInitOptions, DeviceOptionsAny } from '../types/src/device';
export interface DeviceCommand {
    time: number;
    deviceId: string;
    command: any;
}
export interface DeviceCommandContainer {
    deviceId: string;
    commands: Array<DeviceCommand>;
}
export interface CommandWithContext {
    context: any;
    timelineObjId: string;
    command: any;
}
export declare enum StatusCode {
    UNKNOWN = 0,
    GOOD = 1,
    WARNING_MINOR = 2,
    WARNING_MAJOR = 3,
    BAD = 4,
    FATAL = 5
}
export interface DeviceStatus {
    statusCode: StatusCode;
    messages?: Array<string>;
}
export declare function literal<T>(o: T): T;
export interface IDevice {
    init: (initOptions: DeviceInitOptions) => Promise<boolean>;
    getCurrentTime: () => number;
    prepareForHandleState: (newStateTime: number) => void;
    handleState: (newState: TimelineState) => void;
    clearFuture: (clearAfterTime: number) => void;
    canConnect: boolean;
    connected: boolean;
    makeReady: (_okToDestroyStuff?: boolean, activeRundownId?: string) => Promise<void>;
    standDown: (_okToDestroyStuff?: boolean) => Promise<void>;
    getStatus: () => DeviceStatus;
    getMapping: () => Mappings;
    setMapping: (mappings: Mappings) => void;
    deviceId: string;
    deviceName: string;
    deviceType: DeviceType;
    deviceOptions: DeviceOptionsAny;
    instanceId: number;
    startTime: number;
}
/**
 * Base class for all Devices to inherit from. Defines the API that the conductor
 * class will use.
 */
export declare abstract class Device extends EventEmitter implements IDevice {
    private _getCurrentTime;
    private _deviceId;
    private _mappings;
    private _currentTimeDiff;
    private _currentTimeUpdated;
    private _instanceId;
    private _startTime;
    useDirectTime: boolean;
    protected _deviceOptions: DeviceOptionsAny;
    protected _reportAllCommands: boolean;
    constructor(deviceId: string, deviceOptions: DeviceOptionsAny, getCurrentTime: () => Promise<number>);
    /**
     * Connect to the device, resolve the promise when ready.
     * @param initOptions Device-specific options
     */
    abstract init(initOptions: DeviceInitOptions): Promise<boolean>;
    terminate(): Promise<boolean>;
    getCurrentTime(): number;
    /** Called from Conductor when a new state is about to be handled soon */
    abstract prepareForHandleState(newStateTime: number): any;
    /** Called from Conductor when a new state is to be handled */
    abstract handleState(newState: TimelineState): any;
    /**
     * Clear any scheduled commands after this time
     * @param clearAfterTime
     */
    abstract clearFuture(clearAfterTime: number): any;
    abstract readonly canConnect: boolean;
    abstract readonly connected: boolean;
    /**
     * The makeReady method could be triggered at a time before broadcast
     * Whenever we know that the user want's to make sure things are ready for broadcast
     * The exact implementation differ between different devices
     * @param okToDestroyStuff If true, the device may do things that might affect the output (temporarily)
     */
    makeReady(_okToDestroyStuff?: boolean, _activeRundownId?: string): Promise<void>;
    /**
     * The standDown event could be triggered at a time after broadcast
     * The exact implementation differ between different devices
     * @param okToDestroyStuff If true, the device may do things that might affect the output (temporarily)
     */
    standDown(_okToDestroyStuff?: boolean): Promise<void>;
    abstract getStatus(): DeviceStatus;
    getMapping(): Mappings;
    setMapping(mappings: Mappings): void;
    readonly deviceId: string;
    /**
     * A human-readable name for this device
     */
    abstract readonly deviceName: string;
    abstract readonly deviceType: DeviceType;
    readonly deviceOptions: DeviceOptionsAny;
    readonly supportsExpectedPlayoutItems: boolean;
    handleExpectedPlayoutItems(_expectedPlayoutItems: Array<ExpectedPlayoutItemContent>): void;
    private _updateCurrentTime;
    on: ((event: 'info', listener: (info: string) => void) => this) & ((event: 'warning', listener: (warning: string) => void) => this) & ((event: 'error', listener: (context: string, err: Error) => void) => this) & ((event: 'debug', listener: (...debug: any[]) => void) => this) & 
    /** The connection status has changed */
    ((event: 'connectionChanged', listener: (status: DeviceStatus) => void) => this) & 
    /** A message to the resolver that something has happened that warrants a reset of the resolver (to re-run it again) */
    ((event: 'resetResolver', listener: () => void) => this) & 
    /** A report that a command was sent too late */
    ((event: 'slowCommand', listener: (commandInfo: string) => void) => this) & 
    /** Something went wrong when executing a command  */
    ((event: 'commandError', listener: (error: Error, context: CommandWithContext) => void) => this);
    emit: ((event: 'info', info: string) => boolean) & ((event: 'warning', warning: string) => boolean) & ((event: 'error', context: string, err: Error) => boolean) & ((event: 'debug', ...debug: any[]) => boolean) & ((event: 'connectionChanged', status: DeviceStatus) => boolean) & ((event: 'resetResolver') => boolean) & ((event: 'slowCommand', commandInfo: string) => boolean) & ((event: 'commandReport', commandReport: CommandReport) => boolean) & ((event: 'commandError', error: Error, context: CommandWithContext) => boolean);
    readonly instanceId: number;
    readonly startTime: number;
    protected handleDoOnTime(doOnTime: DoOnTime, deviceType: string): void;
}
/**
 * Basic class that devices with state tracking can inherit from. Defines some
 * extra convenience methods for tracking state while inheriting all other methods
 * from the Device class.
 */
export declare abstract class DeviceWithState<T> extends Device {
    private _states;
    private _setStateCount;
    /**
     * Get the last known state before a point time. Useful for creating device
     * diffs.
     * @param time
     */
    protected getStateBefore(time: number): {
        state: T;
        time: number;
    } | null;
    /**
     * Get the last known state at a point in time. Useful for creating device
     * diffs.
     *
     * @todo is this literally the same as "getStateBefore(time + 1)"?
     *
     * @param time
     */
    protected getState(time?: number): {
        state: T;
        time: number;
    } | null;
    /**
     * Saves a state on a certain time point. Overwrites any previous state
     * saved at the same time. Removes any state after this time point.
     * @param state
     * @param time
     */
    protected setState(state: T, time: number): void;
    /**
     * Sets a windows outside of which all states will be removed.
     * @param removeBeforeTime
     * @param removeAfterTime
     */
    protected cleanUpStates(removeBeforeTime: number, removeAfterTime: number): void;
    /**
     * Removes all states
     */
    protected clearStates(): void;
}

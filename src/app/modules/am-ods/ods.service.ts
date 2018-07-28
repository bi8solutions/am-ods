import {Subject} from "rxjs/Subject";

import {Observable, Subscription} from 'rxjs';
import {debounceTime, filter, map, switchMap, takeWhile, tap} from 'rxjs/operators';
import {OperatorFunction} from "rxjs/interfaces";
import {Injectable} from '@angular/core';


@Injectable({providedIn: 'root'})
export class OdsService {
  constructor() {}
}

export interface DSObservableFn {
  (value?: any): Observable<any>;
}

export interface DSOperator {
  operator: OperatorFunction<any, any>,
  id: any
}

export interface DSInputOptions {
}

export interface DSOutputOptions {
}

export interface DSInputEvent {
  id: any;
  options?: DSInputOptions,
  value?: any
}

export interface DSEvent {
  input: DSInputEvent,
  output: any;
}

/*
addPipe(obs: Observable<any>, key: any, ...operators: OperatorFunction<any, any>[]): void {
  obs.pipe(...operators).subscribe((value)=>{
    this.next(key, value);
  })
}
 */
export class DSPipe {

  private sub: Subscription;
  constructor(private ds: IObservableDS,
              private key: any,
              private obs: Observable<any>,
              private ops: OperatorFunction<any, any>[],
              private enabled: boolean = true){
    this.connect();
  }

  isConnected() : boolean {
    return !(!this.sub);
  }

  connect(){
    if (this.isConnected()) return;

    this.sub = this.obs.pipe(...this.ops).subscribe((value)=>{
      this.ds.next(this.key, value);
    })
  }

  disconnect(){
    if (!this.isConnected()) return;
    this.sub.unsubscribe();
  }

  setOperators(...ops: OperatorFunction<any, any>[]){
    this.disconnect();
    this.ops = ops;
    this.connect();
  }

  enable(){
    this.enabled = true;
  }

  disable(){
    this.enabled = false;
  }
}

export interface IObservableDS {
  connect() : void;
  isConnected() : boolean;
  addObservable(key: any, os: DSObservableFn | Observable<any>) : void;
  next(key: any, value: any, options?: DSInputOptions) : void;
  observe(key: any, options?: DSOutputOptions) : Observable<any>;
  disconnect() : void;
  //setOperators(operators: DSOperator[], key?: any) : void;
  //clearOperators(...id) : void;
  //clearAllOperators() : void;
  addPipe(obs: Observable<any>, key: any, ...operators: OperatorFunction<any, any>[]): DSPipe;
  asObservable() : Observable<any>;
  destroy();
  clearPipes(...pipes: DSPipe[]);
  clearAllPipes();
  getPipes() : DSPipe[];
  //clone() : IObservableDS;
}

export class ObservableDS implements IObservableDS {
  private connected = false;
  private fnMap = new Map<any, DSObservableFn>();
  private subjectMap = new Map<any, Subject<any>>();
  private input$ = new Subject<DSInputEvent>();
  private inputSub: Subscription = null;
  private events$ = new Subject<DSEvent>();
  private pipes: DSPipe[] = [];

  constructor(autoconnect: boolean = true){
    if (autoconnect) this.connect();
  }

  isConnected() {
    return !(!this.inputSub);
  }

  connect(): void {
    if (this.isConnected()) return;

    this.inputSub = this.input$.pipe(
      filter((input: DSInputEvent)=> {
        if (this.fnMap.has(input.id)) return true;
        console.error(`[obs] observable with id '${input.id}' not found`);
        return false;
      }),
      map((input: DSInputEvent)=> {
        let obsFn = this.fnMap.get(input.id);
        return { event: input, fn: obsFn(input.value), sub: this.subjectMap.get(input.id) }
      }))
      .subscribe((input)=>{ this.relay(input.event, input.fn, input.sub)});

    this.connected = true;
  }

  protected relay(event: DSInputEvent, obs: Observable<any>, subject: Subject<any>){
    obs.pipe(
      takeWhile(()=> this.connected),
      tap((response) => subject.next(response)),
      tap((response) => this.emit({input: event, output: response}))
    ).subscribe();
  }

  protected emit(event: DSEvent){
    this.events$.next(event);
  }

  asObservable() : Observable<any> {
    return this.events$.asObservable();
  }

  disconnect(): void {
    if (!this.isConnected()) return;
    this.inputSub.unsubscribe();
  }

  next(key: any, value: any, options?: DSInputOptions): void {
    if (!this.connected) return;
    this.input$.next({id: key, options: options, value: value});
  }

  addPipe(obs: Observable<any>, key: any, ...operators: OperatorFunction<any, any>[]): DSPipe {
    let pipe = new DSPipe(this, key, obs, operators);
    this.pipes.push(pipe);
    return pipe;
  }

  clearPipes(...pipes: DSPipe[]){
    pipes.forEach((pipe, index)=>{
      pipe.disconnect();
      pipes = pipes.splice(index, 1);
    });
  }

  clearAllPipes(){
    this.clearPipes(...this.pipes);
  }

  getPipes() : DSPipe[] {
    return this.pipes;
  }

  observe(key: any, options?: DSOutputOptions): Observable<any> {
    let subject = this.subjectMap.get(key);
    return subject.asObservable();
  }

  addObservable(key: any, obs: DSObservableFn | Observable<any>): void {
    this.fnMap.set(key, obs instanceof Observable ? ()=> obs : obs);
    this.subjectMap.set(key, new Subject());
  }

  destroy(){
  }
}
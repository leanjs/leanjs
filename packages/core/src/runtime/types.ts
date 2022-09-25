import { Cleanup } from "..";

export type Key = string | symbol;
export type BaseShape = Record<Key, any>;
export type KeyOf<Shape extends BaseShape> = Exclude<keyof Shape, number>;

export type Subscriber<Value> = (
  value: Value,
  loading: boolean,
  error?: string
) => void;

export type Cookies = Record<string, string>;

export interface Request {
  url?: string;
  cookies?: Cookies;
}

export type Unsubscribe = () => void;

export interface RuntimeApi<
  State extends BaseShape,
  Prop extends KeyOf<State>
> {
  isBrowser: boolean;
  loader: Record<Prop, LoaderState>;
  load: <P extends Prop>(
    prop: P,
    loader: () => Promise<State[P]> | State[P]
  ) => Promise<State[P]>;
  loaded: <P extends Prop>(prop: P) => Promise<State[P]>;
  getState: (prop: Prop) => State[Prop];
  setState: (prop: Prop, state: State[Prop]) => void;
  request: Request;
  onCleanup: (cleanup: Cleanup) => void;
  cleanup: () => void;
}

type ApiFactoryFunction<State extends BaseShape, Prop extends KeyOf<State>> =
  | ((args: RuntimeApi<State, Prop>) => Promise<any>)
  | ((args: RuntimeApi<State, Prop>) => any);

export type BaseApiFactory<
  State extends BaseShape,
  Prop extends KeyOf<State>
> = Record<Key, ApiFactoryFunction<State, Prop> | undefined>;

export type PartialApiFactory<
  PartialState extends BaseShape,
  PartialProp extends KeyOf<PartialState>,
  ApiFactory extends BaseApiFactory<any, any>
> = {
  [P in keyof ApiFactory]?: (
    args: RuntimeApi<PartialState, PartialProp>
  ) => ApiFactory[P] extends ApiFactoryFunction<any, any>
    ? ReturnType<ApiFactory[P]>
    : undefined;
};

export type ValuesFromApiFactory<ApiFactory extends BaseShape> = {
  [P in KeyOf<ApiFactory>]: ValueFromApiFactory<ApiFactory, P>;
};

export type ValueFromApiFactorySync<
  ApiFactory extends BaseShape,
  Prop extends KeyOf<ApiFactory>
> = ApiFactory[Prop] extends (...args: never[]) => Promise<infer Return>
  ? Return
  : ApiFactory[Prop] extends (...args: never[]) => infer Return
  ? Return
  : unknown;

export type ValueFromApiFactory<
  ApiFactory extends BaseShape,
  Prop extends KeyOf<ApiFactory>
> = ApiFactory[Prop] extends (...args: never[]) => Promise<infer Return>
  ? Promise<Return>
  : ApiFactory[Prop] extends (...args: never[]) => infer Return
  ? Return
  : unknown;

export type OffCallback = () => void;

export type OnCallback<
  ApiFactory extends BaseShape,
  ApiProp extends KeyOf<ApiFactory>,
  State extends BaseShape,
  Prop extends KeyOf<State>
> = (
  apiItem: ValueFromApiFactorySync<ApiFactory, ApiProp>,
  {
    getState,
    setState,
  }: {
    getState: <P extends Prop>(prop: P) => State[P];
    setState: <P extends Prop>(prop: P, state: State[P]) => void;
  }
) => OffCallback;

export interface ConfigureRuntimeOptions<
  State extends BaseShape,
  Prop extends KeyOf<State>,
  ApiFactory extends BaseApiFactory<State, Prop>
> {
  onError: OnError;
  apiFactory?: ApiFactory;
}

export interface Runtime<
  State extends BaseShape = BaseShape,
  Prop extends KeyOf<State> = KeyOf<State>,
  ApiFactory extends BaseApiFactory<State, Prop> = BaseApiFactory<State, Prop>,
  ApiProp extends KeyOf<ApiFactory> = KeyOf<ApiFactory>
> {
  getState: <P extends Prop>(prop: P) => State[P];
  setState: <P extends Prop>(prop: P, state: State[P]) => void;
  subscribe: <P extends Prop>(
    prop: P,
    subscriber: Subscriber<State[P]>
  ) => Unsubscribe;
  loader: Record<Prop, LoaderState>;
  booted: () => Promise<boolean>;
  api: ValuesFromApiFactory<ApiFactory>;
  on: <P extends ApiProp>(
    prop: P,
    callback: OnCallback<ApiFactory, P, State, Prop>
  ) => OffCallback;
  load<P extends Prop>(
    prop: P,
    loader: () => Promise<State[P]> | State[P]
  ): Promise<State[P]>;
  loaded(): Promise<State>;
  loaded<P extends Prop>(prop: P): Promise<State[P]>;
  logError: LogAnyError;
  cleanup(): void;
  cleanup<P extends ApiProp>(prop: P): void;
}

export type StateType<T extends Runtime> = T extends {
  loaded(): Promise<infer State>;
  loaded<P extends string>(prop: P): Promise<any>;
}
  ? State
  : any;

export type LogAnyError = (error: any, options?: OnErrorOptions) => void;

export interface LoaderState {
  loading: boolean;
  error?: string;
}

export interface InternalLoaderState extends LoaderState {
  promise?: Promise<unknown>;
  done?: boolean;
}

type PartialApi<
  ApiFactory extends Record<
    Key,
    ApiFactoryFunction<any, any> | undefined
  > = Record<Key, ApiFactoryFunction<any, any>>
> = {
  [Prop in KeyOf<ApiFactory>]?: (
    arg: any
  ) => ApiFactory[Prop] extends ApiFactoryFunction<any, any>
    ? ReturnType<ApiFactory[Prop]>
    : unknown;
};

export interface CreateRuntimeArgs<
  State extends BaseShape,
  Prop extends KeyOf<State>,
  ApiFactory extends BaseApiFactory<State, Prop>,
  PartialApiFactory extends PartialApi<ApiFactory> = PartialApi<ApiFactory>,
  PartialState extends Partial<State> = Partial<State>
> {
  initialState?: State;
  request?: Request;
  runtime?: Runtime<
    PartialState,
    any,
    PartialApiFactory,
    KeyOf<PartialApiFactory>
  >;
}

export type CreateRuntime<MyRuntime extends Runtime = Runtime> = {
  (args?: CreateRuntimeArgs<any, any, any>): MyRuntime;
};

export type GetRuntime<MyCreateRuntime extends CreateRuntime> =
  ReturnType<MyCreateRuntime>;

export interface OnErrorOptions {
  scope?: string;
}

export type OnError = (error: Error, options?: OnErrorOptions) => void;

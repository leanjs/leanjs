export type Key = string | symbol;
export type BaseShape = Record<Key, any>;
export type KeyOf<Shape extends BaseShape> = Exclude<keyof Shape, number>;

export type Subscriber<Value> = (value: Value, error?: Error | string) => void;

export type Cookies = Record<string, string>;

export interface Request {
  url?: string;
  cookies?: Cookies;
}

export type Unsubscribe = () => void;

export interface StoreRuntime<State, Prop extends KeyOf<State>> {
  isBrowser: boolean;
  loader: Record<Prop, LoaderState>;
  load: <P extends Prop>(
    prop: P,
    loader: () => Promise<State[P]> | State[P]
  ) => Promise<State[P]>;
  loaded: <P extends Prop>(prop: P) => Promise<State[P]>;
  state: State;
  request: Request;
}

export type BaseCtxFactory<State, Prop extends KeyOf<State>> = Record<
  Key,
  | ((args: StoreRuntime<State, Prop>) => Promise<any>)
  | ((args: StoreRuntime<State, Prop>) => any)
  | Promise<any>
  | Record<any, any>
>;

export type ValuesFromCtxFactory<
  CtxFactory extends BaseShape,
  Prop extends KeyOf<CtxFactory>
> = {
  [P in Prop]: ValueFromCtxFactory<CtxFactory, P>;
};

export type ValueFromCtxFactorySync<
  CtxFactory extends BaseShape,
  Prop extends KeyOf<CtxFactory>
> = CtxFactory[Prop] extends (...args: never[]) => Promise<infer Return>
  ? Return
  : CtxFactory[Prop] extends (...args: never[]) => infer Return
  ? Return
  : CtxFactory[Prop] extends Promise<infer Return>
  ? Return
  : CtxFactory[Prop];

export type ValueFromCtxFactory<
  CtxFactory extends BaseShape,
  Prop extends KeyOf<CtxFactory>
> = CtxFactory[Prop] extends (...args: never[]) => Promise<infer Return>
  ? Promise<Return>
  : CtxFactory[Prop] extends (...args: never[]) => infer Return
  ? Return
  : CtxFactory[Prop] extends Promise<infer Return>
  ? Promise<Return>
  : CtxFactory[Prop];

export type OffCallback = () => void;

export type OnCallback<CtxFactory, Prop extends KeyOf<CtxFactory>, State> = (
  ctxItem: ValueFromCtxFactorySync<CtxFactory, Prop>,
  state: State
) => OffCallback;

export interface ConfigureStoreOptions<
  State,
  Prop extends KeyOf<State>,
  CtxFactory extends BaseCtxFactory<State, Prop>
> {
  onError: (error: any) => void;
  context?: CtxFactory;
  request?: Request;
}

export interface Store<
  State extends BaseShape,
  Prop extends KeyOf<State>,
  CtxFactory extends BaseCtxFactory<State, Prop>,
  CtxProp extends KeyOf<CtxFactory>
> {
  state: State;
  subscribe: (prop: Prop, subscriber: Subscriber<State[Prop]>) => Unsubscribe;
  loader: Record<Prop, LoaderState>;
  booted: () => Promise<boolean>;
  context: ValuesFromCtxFactory<CtxFactory, CtxProp>;
  on: <P extends CtxProp>(
    key: P,
    callback: OnCallback<CtxFactory, P, State>
  ) => OffCallback;
  load<P extends Prop>(
    prop: P,
    loader: () => Promise<State[P]> | State[P]
  ): Promise<State[P]>;
  loaded(): Promise<void>;
  loaded<P extends Prop>(prop: P): Promise<State[P]>;
}

export interface LoaderState {
  loading: boolean;
  error?: string;
}

export interface InternalLoaderState extends LoaderState {
  promise?: Promise<unknown>;
  done?: boolean;
}

export interface CreateStore<State extends BaseShape> {
  initialState?: State;
  request?: Request;
}

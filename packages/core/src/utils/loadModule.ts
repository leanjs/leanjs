export async function loadModule(scope: string, module = ".") {
  const container = (window as Record<string, any>)?.[scope];
  if (container?.init && container?.get) {
    await __webpack_init_sharing__("default");
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);

    return factory();
  }

  return undefined;
}

declare const __webpack_init_sharing__: (arg: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: string };

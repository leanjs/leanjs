import * as runtimeBindings from "./createRuntimeBindings";
import VueMount from "./Mount.vue";

// Types are fine because tsc, not webpack handles these exports
export * as types from "./types";

// We have to do this because webpack can't properly handle re-exports
export const Mount = VueMount;

export const createRuntimeBindings = runtimeBindings.createRuntimeBindings;
export const isPropObj = runtimeBindings.isPropObj;

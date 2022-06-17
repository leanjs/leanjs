import { combineReducers, createStore } from "redux";
import { notificationsReducer, NotificationsState } from "./notifications";
import { settingsReducer, SettingsState } from "./settings";

interface State {
  settings: SettingsState;
  notifications: NotificationsState;
}

export function configureStore(initialState: State) {
  return createStore(
    combineReducers({
      settings: settingsReducer,
      notifications: notificationsReducer,
    }),
    initialState
  );
}

export type Store = ReturnType<typeof configureStore>;

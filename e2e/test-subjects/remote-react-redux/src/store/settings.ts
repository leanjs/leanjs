// IT CONTAINS SHARED STATE

export interface SettingsAction {
  type: "UPDATE_LOCALE";
  payload: string;
}

export interface SettingsState {
  locale: string;
}

export function settingsReducer(
  state: SettingsState = { locale: "EN" },
  action: SettingsAction
) {
  switch (action.type) {
    case "UPDATE_LOCALE":
      return { ...(state || {}), locale: action.payload };
    default:
      return state;
  }
}

// IT ONLY CONTAINS STATE USED WITHIN THE BOUNDARIES OF THIS REMOTE APP

export interface NotificationsAction {
  type: "UPDATE_NOTIFICATIONS";
  payload: string;
}

export interface NotificationsState {
  sendToEmail?: string; // TODO fetch initial data from an API
}

export function notificationsReducer(
  state: NotificationsState = {},
  action: NotificationsAction
) {
  switch (action.type) {
    case "UPDATE_NOTIFICATIONS":
      return { ...state, sendToEmail: action.payload };
    default:
      return state;
  }
}

export const initialState = {
  user: null,
  currentChatId: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  SET_CHAT: "SET_CHAT",
};
const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.SET_CHAT:
      return {
        ...state,
        currentChatId: action.currentChatId,
      };
    default:
      return state;
  }
};

export default reducer;

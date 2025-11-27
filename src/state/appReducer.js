// state/appReducer.js
export const initialState = {
  variables: [],
  formulas: [],
};

export function appReducer(state, action) {
  switch (action.type) {
    case "ADD_VARIABLE":
      if (
        state.variables.some(
          (v) => v.name.toUpperCase() === action.payload.name.toUpperCase()
        )
      ) {
        alert("Variable name already exists");
        return state;
      }
      return {
        ...state,
        variables: [...state.variables, action.payload],
      };

    case "DELETE_VARIABLE":
      return {
        ...state,
        variables: state.variables.filter((v) => v.id !== action.id),
      };

    case "ADD_FORMULA":
      return {
        ...state,
        formulas: [...state.formulas, action.payload],
      };

    case "DELETE_FORMULA":
      return {
        ...state,
        formulas: state.formulas.filter((f) => f.id !== action.id),
      };

    case "LOAD_STATE":
      return action.payload;

    default:
      return state;
  }
}

import {
  ADD_ARTICLE,
  UPDATE_SEARCH_QUERY,
  ADD_FORMAT,
  REMOVE_FORMAT,
} from "../constants/action-types";

const initialState = {
  articles: [],
  query: "",
  format: [],
  filterState: false,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ARTICLE: {
      return { ...state, articles: state.articles.concat(action.payload) };
    }
    case UPDATE_SEARCH_QUERY: {
      return {
        ...state,
        query: action.payload,
        filterState: action.payload !== "",
      };
    }
    case ADD_FORMAT: {
      return { ...state, format: state.format.concat(action.payload) };
    }
    case REMOVE_FORMAT: {
      return { ...state, format: state.format.concat(action.payload) };
    }
    default:
      return state;
  }
}

export default rootReducer;

import {
  UPDATE_SEARCH_QUERY,
  ADD_STATE,
  REMOVE_STATE,
  UPDATE_FILTER_STATE,
  RESET_FILTER_STATE,
  RESET_QUERY_STATE,
  RESET_ALL_FILTER_STATES,
} from "../constants/action-types";
import FILTER_DIMENSIONS from "../../constants/filterDimensions";

const initialState = {
  query: "",
  status: [],
  format: [],
  categories: [],
  genre: [],
  sport: [],
  geography: [],
  period: [],
  language: [],
  tags: [],
  filterState: false,
  lastDimension: "",
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SEARCH_QUERY: {
      return {
        ...state,
        query: action.payload,
      };
    }
    case ADD_STATE: {
      return {
        ...state,
        [action.payload.dimension]: state[action.payload.dimension].concat(
          action.payload.currentValue
        ),
        lastDimension: action.payload.dimension,
      };
    }
    case REMOVE_STATE: {
      return {
        ...state,
        [action.payload.dimension]: state[action.payload.dimension].filter(
          (value) => value !== action.payload.currentValue
        ),
      };
    }
    case UPDATE_FILTER_STATE: {
      return {
        ...state,
        filterState:
          state.query.length > 0 ||
          FILTER_DIMENSIONS.filter(
            (dimension) => state[dimension.dimension].length > 0
          ).length > 0,
      };
    }
    case RESET_FILTER_STATE: {
      return {
        ...state,
        [action.payload]: [],
      };
    }
    case RESET_QUERY_STATE: {
      return {
        ...state,
        query: "",
      };
    }
    case RESET_ALL_FILTER_STATES: {
      return {
        ...state,
        ...initialState,
        filterState: true,
      };
    }
    default:
      return state;
  }
}

export default rootReducer;

import {
  ADD_ARTICLE,
  UPDATE_SEARCH_QUERY,
  ADD_FORMAT,
  REMOVE_FORMAT,
} from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function updateSearchQuery(payload) {
  return { type: UPDATE_SEARCH_QUERY, payload };
}

export function addFormat(payload) {
  return { type: ADD_FORMAT, payload };
}

export function removeFormat(payload) {
  return { type: REMOVE_FORMAT, payload };
}

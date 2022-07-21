/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
// import { useState } from "react";
import _ from "lodash";
import deepmerge from "deepmerge";
import { useDispatch, useSelector } from "react-redux";
import {
  updateFilterState,
  updateSearchQuery,
  addState,
  removeState,
  resetFilterState,
  resetQueryState,
  resetAllFilterStates,
  toggleFilterState,
  toggleFilterSectionState,
} from "../redux/actions/actions";
import FILTER_DIMENSIONS from "../constants/filterDimensions";

const useFilter = (data) => {
  // state management
  const searchQuery = useSelector((state) => state.query);
  const allStates = useSelector((state) => state);
  const isFilterOn = useSelector((state) => state.filterState);
  const dispatch = useDispatch();
  const updateSearch = (query) => dispatch(updateSearchQuery(query));
  const add = (stateData) => dispatch(addState(stateData));
  const remove = (stateData) => dispatch(removeState(stateData));
  const setFilterState = () => dispatch(updateFilterState());
  const resetFilter = (dimension) => dispatch(resetFilterState(dimension));
  const resetQuery = () => dispatch(resetQueryState());
  const resetAllFilters = () => dispatch(resetAllFilterStates());
  const toggleFilter = () => dispatch(toggleFilterState());
  const toggleFilterSection = (dimension) =>
    dispatch(toggleFilterSectionState(dimension));

  // change handlers
  const handleInputChange = (event) => {
    updateSearch(event.target.value);
    setFilterState();
  };
  const handleCheckboxChange = (event) => {
    const { dimension } = event.target.dataset;
    const currentValue = event.target.value;
    event.target.checked
      ? add({ dimension, currentValue })
      : remove({ dimension, currentValue });
    setFilterState();
  };
  const handleFilterReset = (dimension) => {
    resetFilter(dimension);
    setFilterState();
  };
  const handleResetAllFilters = () => {
    resetAllFilters();
  };
  const handleQueryReset = () => {
    resetQuery();
    setFilterState();
  };

  // input data
  // const postEdges = data.allBooks.edges;

  // transform data to more suitable structure
  // sort and count metadata
  const normalizePosts = (inputData) => {
    const posts = [];
    inputData.forEach((post) => {
      posts.push({
        slug: post.slug,
        title: post.title,
        subtitle: post.subtitle,
        queue: post.queue ? post.queue : null,
        sources: post.sources ? post.sources : null,
        type: post.type ? post.type : null,
        wishlist: post.wishlist ? post.wishlist : null,
        taste: post.taste ? post.taste : null,
        mainIngredience: post.mainIngredience ? post.mainIngredience : null,
        stock: post.stock ? post.stock : null,
        season: post.season ? post.season : null,
        difficulty: post.difficulty ? post.difficulty : null,
        activeCookingTime: post.activeCookingTime
          ? post.activeCookingTime
          : null,
        totalCookingTime: post.totalCookingTime ? post.totalCookingTime : null,
        process: post.process ? post.process : null,
        servingTemp: post.servingTemp ? post.servingTemp : null,
        categories: post.categories ? post.categories : null,
        cuisine: post.cuisine ? post.cuisine : null,
        price: post.price ? post.price : null,
        tags: post.tags ? post.tags : null,
        cover: post.cover,
        match: post.match,
        extraLabels: post.extraLabels,
      });
    });
    return posts;
  };

  // pick all occurences of given dimension (e.g. status)
  const groupValues = (input) => {
    const groupedValues = {};
    FILTER_DIMENSIONS.forEach((dimension) => {
      const aaa = input.reduce((acc, post) => {
        if (post[dimension.dimension] !== null) {
          if (post[dimension.dimension].length) {
            post[dimension.dimension].forEach((item) => {
              acc.push(item);
            });
          }
        }
        return acc;
      }, []);
      groupedValues[dimension.dimension] = aaa;
    });
    return groupedValues;
  };

  // sort and count occurences (e.g. {unread: 16, read: 12})
  const countMetadata = (input) => {
    const countedMetadata = {};
    FILTER_DIMENSIONS.forEach((dimension) => {
      const bbb = input[dimension.dimension].reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});
      countedMetadata[dimension.dimension] = bbb;
    });
    return countedMetadata;
  };

  // transform the array to this format [{value: 'read', count: 8}, {...} ]
  const formatMetadata = (input) => {
    const formatedMetadata = {};
    FILTER_DIMENSIONS.forEach((dimension) => {
      const tmp = [];
      Object.entries(input[dimension.dimension]).forEach((item) => {
        if (item[0]) {
          const obj = {
            value: item[0],
            count: item[1],
          };
          tmp.push(obj);
        }
      });
      formatedMetadata[dimension.dimension] = JSON.parse(JSON.stringify(tmp));
    });
    return formatedMetadata;
  };

  // const sortMetadataDesc = (input) =>
  //   FILTER_DIMENSIONS.map((dimension) =>
  //     input[dimension.dimension].sort((a, b) => (a.count < b.count ? 1 : -1))
  //   );

  const resetMetadataAmount = (input) => {
    // clone object to avoid mutability
    const resetedObject = JSON.parse(JSON.stringify(input));
    Object.keys(resetedObject).map((nested) =>
      Object.keys(resetedObject[nested]).map(
        (value) => (resetedObject[nested][value] = 0)
      )
    );
    return resetedObject;
  };

  // mark posts whether they fit search parameters or not
  const markFilteredData = (input) =>
    input.map((post) => {
      const extraLabels = [];
      post.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searchQuery
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) &&
      // post.author
      // .join("")
      // .toLowerCase()
      // .normalize("NFD")
      // .replace(/[\u0300-\u036f]/g, "")
      // .includes(
      //   searchQuery
      //     .toLowerCase()
      //     .normalize("NFD")
      //     .replace(/[\u0300-\u036f]/g, "")
      // ) &&
      (allStates.type.length > 0
        ? post.type != null
          ? post.type.some(
              (element) =>
                allStates.type.indexOf(`type-${_.kebabCase(element)}`) >= 0
            )
          : null // extraLabels.push("Nespecifikováný typ")
        : true) &&
      (allStates.wishlist.length > 0
        ? post.wishlist != null
          ? post.wishlist.some(
              (element) =>
                allStates.wishlist.indexOf(
                  `wishlist-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.taste.length > 0
        ? post.taste != null
          ? post.taste.some(
              (element) =>
                allStates.taste.indexOf(`taste-${`${_.kebabCase(element)}`}`) >=
                0
            )
          : null
        : true) &&
      (allStates.mainIngredience.length > 0
        ? post.mainIngredience != null
          ? post.mainIngredience.some(
              (element) =>
                allStates.mainIngredience.indexOf(
                  `mainIngredience-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.stock.length > 0
        ? post.stock != null
          ? post.stock.some(
              (element) =>
                allStates.stock.indexOf(`stock-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      (allStates.season.length > 0
        ? post.season != null
          ? post.season.some(
              (element) =>
                allStates.season.indexOf(`season-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      (allStates.difficulty.length > 0
        ? post.difficulty != null
          ? post.difficulty.some(
              (element) =>
                allStates.difficulty.indexOf(
                  `difficulty-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.activeCookingTime.length > 0
        ? post.activeCookingTime != null
          ? post.activeCookingTime.some(
              (element) =>
                allStates.activeCookingTime.indexOf(
                  `activeCookingTime-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.totalCookingTime.length > 0
        ? post.totalCookingTime != null
          ? post.totalCookingTime.some(
              (element) =>
                allStates.totalCookingTime.indexOf(
                  `totalCookingTime-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.process.length > 0
        ? post.process != null
          ? post.process.some(
              (element) =>
                allStates.process.indexOf(`process-${_.kebabCase(element)}`) >=
                0
            )
          : null
        : true) &&
      (allStates.servingTemp.length > 0
        ? post.servingTemp != null
          ? post.servingTemp.some(
              (element) =>
                allStates.servingTemp.indexOf(
                  `servingTemp-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.categories.length > 0
        ? post.categories != null
          ? post.categories.some(
              (element) =>
                allStates.categories.indexOf(
                  `categories-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.cuisine.length > 0
        ? post.cuisine != null
          ? post.cuisine.some(
              (element) =>
                allStates.cuisine.indexOf(`cuisine-${_.kebabCase(element)}`) >=
                0
            )
          : null
        : true) &&
      (allStates.price.length > 0
        ? post.price != null
          ? post.price.some(
              (element) =>
                allStates.price.indexOf(`price-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      // eslint-disable-next-line no-nested-ternary
      (allStates.tags.length > 0
        ? post.tags != null
          ? post.tags.some(
              (element) =>
                allStates.tags.indexOf(`tags-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true)
        ? (post.match = true)
        : (post.match = false);
      post.extraLabels = extraLabels;
      return post;
    });
  //
  //
  //
  //
  //
  //
  //
  // all posts marked whether they fit search parameters or not
  console.log(data, "<<<");
  const markedPosts = markFilteredData(data.recipes);

  // get only posts which fit search parameters. Search results is generated from this.
  const matchingPosts = normalizePosts(
    markedPosts.filter((item) => item.match === true)
  );
  // get filter metadata for matching posts (this will be shown in filter counts)
  const realMetadata = countMetadata(groupValues(matchingPosts));

  // prepare base for complete list of options (with count 0). It is needed to keep checkboxes in the same order.
  // ----------
  // get the list of dimensions with amounts
  const resetedList = resetMetadataAmount(
    countMetadata(groupValues(normalizePosts(markedPosts)))
  );

  // combine list of all tags, override those which are really available
  const filterMetadata = formatMetadata(deepmerge(resetedList, realMetadata));

  // default listings
  // const readingList = postEdges.filter(
  //   (post) =>
  //     post.status !== null &&
  //     post.status[0] === "Rozečtené"
  // );
  // const lastReadList = postEdges.filter(
  //   (post) =>
  //     post.status !== null &&
  //     post.status[0] === "Přečtené"
  // );
  // const wishList = postEdges.filter(
  //   (post) =>
  //     post.status !== null &&
  //     post.status[0] === "Wishlist"
  // );
  // const garbageList = postEdges.filter(
  //   (post) =>
  //     post.status !== null &&
  //     post.status[0] === "Odpad"
  // );

  return {
    allStates,
    isFilterOn,
    //
    // readingList,
    // lastReadList,
    // wishList,
    // garbageList,
    // postEdges,
    //
    matchingPosts,
    filterMetadata,
    //
    handleInputChange,
    handleCheckboxChange,
    handleFilterReset,
    handleQueryReset,
    handleResetAllFilters,

    toggleFilter,
    toggleFilterSection,
  };
};

export default useFilter;

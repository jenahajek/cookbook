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
  const postEdges = data.allBooks.edges;

  // transform data to more suitable structure
  // sort and count metadata
  const normalizePosts = (inputData) => {
    const posts = [];
    inputData.forEach((post) => {
      posts.push({
        slug: post.node.fields.slug,
        title: post.node.frontmatter.title,
        subtitle: post.node.frontmatter.subtitle,
        queue: post.node.frontmatter.queue ? post.node.frontmatter.queue : null,
        sources: post.node.frontmatter.sources
          ? post.node.frontmatter.sources
          : null,
        type: post.node.frontmatter.type ? post.node.frontmatter.type : null,
        tried: post.node.frontmatter.tried ? post.node.frontmatter.tried : null,
        taste: post.node.frontmatter.taste ? post.node.frontmatter.taste : null,
        mainIngredience: post.node.frontmatter.mainIngredience
          ? post.node.frontmatter.mainIngredience
          : null,
        stock: post.node.frontmatter.stock ? post.node.frontmatter.stock : null,
        season: post.node.frontmatter.season
          ? post.node.frontmatter.season
          : null,
        difficulty: post.node.frontmatter.difficulty
          ? post.node.frontmatter.difficulty
          : null,
        prepTime: post.node.frontmatter.prepTime
          ? post.node.frontmatter.prepTime
          : null,
        cookingTime: post.node.frontmatter.cookingTime
          ? post.node.frontmatter.cookingTime
          : null,
        process: post.node.frontmatter.process
          ? post.node.frontmatter.process
          : null,
        servingTemp: post.node.frontmatter.servingTemp
          ? post.node.frontmatter.servingTemp
          : null,
        categories: post.node.frontmatter.categories
          ? post.node.frontmatter.categories
          : null,
        geography: post.node.frontmatter.geography
          ? post.node.frontmatter.geography
          : null,
        price: post.node.frontmatter.price ? post.node.frontmatter.price : null,
        tags: post.node.frontmatter.tags ? post.node.frontmatter.tags : null,
        cover: post.node.frontmatter.cover,
        match: post.node.frontmatter.match,
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
          post[dimension.dimension].forEach((item) => {
            acc.push(item);
          });
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
      post.node.frontmatter.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searchQuery
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) &&
      // post.node.frontmatter.author
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
        ? post.node.frontmatter.type != null
          ? post.node.frontmatter.type.some(
              (element) =>
                allStates.type.indexOf(`type-${_.kebabCase(element)}`) >= 0
            )
          : null // extraLabels.push("Nespecifikováný typ")
        : true) &&
      (allStates.tried.length > 0
        ? post.node.frontmatter.tried != null
          ? post.node.frontmatter.tried.some(
              (element) =>
                allStates.tried.indexOf(`tried-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      (allStates.taste.length > 0
        ? post.node.frontmatter.taste != null
          ? post.node.frontmatter.taste.some(
              (element) =>
                allStates.taste.indexOf(`taste-${`${_.kebabCase(element)}`}`) >=
                0
            )
          : null
        : true) &&
      (allStates.mainIngredience.length > 0
        ? post.node.frontmatter.mainIngredience != null
          ? post.node.frontmatter.mainIngredience.some(
              (element) =>
                allStates.mainIngredience.indexOf(
                  `mainIngredience-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.stock.length > 0
        ? post.node.frontmatter.stock != null
          ? post.node.frontmatter.stock.some(
              (element) =>
                allStates.stock.indexOf(`stock-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      (allStates.season.length > 0
        ? post.node.frontmatter.season != null
          ? post.node.frontmatter.season.some(
              (element) =>
                allStates.season.indexOf(`season-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      (allStates.difficulty.length > 0
        ? post.node.frontmatter.difficulty != null
          ? post.node.frontmatter.difficulty.some(
              (element) =>
                allStates.difficulty.indexOf(
                  `difficulty-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.prepTime.length > 0
        ? post.node.frontmatter.prepTime != null
          ? post.node.frontmatter.prepTime.some(
              (element) =>
                allStates.prepTime.indexOf(
                  `prepTime-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.cookingTime.length > 0
        ? post.node.frontmatter.cookingTime != null
          ? post.node.frontmatter.cookingTime.some(
              (element) =>
                allStates.cookingTime.indexOf(
                  `cookingTime-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.process.length > 0
        ? post.node.frontmatter.process != null
          ? post.node.frontmatter.process.some(
              (element) =>
                allStates.process.indexOf(`process-${_.kebabCase(element)}`) >=
                0
            )
          : null
        : true) &&
      (allStates.servingTemp.length > 0
        ? post.node.frontmatter.servingTemp != null
          ? post.node.frontmatter.servingTemp.some(
              (element) =>
                allStates.servingTemp.indexOf(
                  `servingTemp-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.categories.length > 0
        ? post.node.frontmatter.categories != null
          ? post.node.frontmatter.categories.some(
              (element) =>
                allStates.categories.indexOf(
                  `categories-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.geography.length > 0
        ? post.node.frontmatter.geography != null
          ? post.node.frontmatter.geography.some(
              (element) =>
                allStates.geography.indexOf(
                  `geography-${_.kebabCase(element)}`
                ) >= 0
            )
          : null
        : true) &&
      (allStates.price.length > 0
        ? post.node.frontmatter.price != null
          ? post.node.frontmatter.price.some(
              (element) =>
                allStates.price.indexOf(`price-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true) &&
      // eslint-disable-next-line no-nested-ternary
      (allStates.tags.length > 0
        ? post.node.frontmatter.tags != null
          ? post.node.frontmatter.tags.some(
              (element) =>
                allStates.tags.indexOf(`tags-${_.kebabCase(element)}`) >= 0
            )
          : null
        : true)
        ? (post.node.frontmatter.match = true)
        : (post.node.frontmatter.match = false);
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
  const markedPosts = markFilteredData(postEdges);

  // get only posts which fit search parameters. Search results is generated from this.
  const matchingPosts = normalizePosts(
    markedPosts.filter((item) => item.node.frontmatter.match === true)
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
  //     post.node.frontmatter.status !== null &&
  //     post.node.frontmatter.status[0] === "Rozečtené"
  // );
  // const lastReadList = postEdges.filter(
  //   (post) =>
  //     post.node.frontmatter.status !== null &&
  //     post.node.frontmatter.status[0] === "Přečtené"
  // );
  // const wishList = postEdges.filter(
  //   (post) =>
  //     post.node.frontmatter.status !== null &&
  //     post.node.frontmatter.status[0] === "Wishlist"
  // );
  // const garbageList = postEdges.filter(
  //   (post) =>
  //     post.node.frontmatter.status !== null &&
  //     post.node.frontmatter.status[0] === "Odpad"
  // );

  return {
    allStates,
    isFilterOn,
    //
    // readingList,
    // lastReadList,
    // wishList,
    // garbageList,
    postEdges,
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

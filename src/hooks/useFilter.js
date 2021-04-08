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
} from "../redux/actions/index";
import FILTER_DIMENSIONS from "../contants/filterDimensions";

const useFilter = (data) => {
  // gather metadata about filtered results, so filter can show current state of options
  // filter will be rendered in this order

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
  };
  const handleQueryReset = () => {
    resetQuery();
  };

  // input data
  const postEdges = data.allBooks.edges;

  // transform data to more suitable structure
  // sort and count metadata
  const normalizePosts = (inputData) => {
    const posts = [];
    inputData.reduce((output, post) => {
      posts.push({
        slug: post.node.fields.slug,
        title: post.node.frontmatter.title,
        author: post.node.frontmatter.author,
        status: post.node.frontmatter.status,
        format: post.node.frontmatter.format,
        categories: post.node.frontmatter.categories,
        genre: post.node.frontmatter.genre,
        sport: post.node.frontmatter.sport,
        geography: post.node.frontmatter.geography,
        period: post.node.frontmatter.period,
        language: post.node.frontmatter.language,
        tags: post.node.frontmatter.tags,
        cover: post.node.frontmatter.cover,
        match: post.node.frontmatter.match,
        extraLabels: post.extraLabels,
      });
    }, []);

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

  const sortMetadataDesc = (input) =>
    FILTER_DIMENSIONS.map((dimension) =>
      input[dimension.dimension].sort((a, b) => (a.count < b.count ? 1 : -1))
    );

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

  // // TODO: refactor and move to utilities
  // const deepmerge = (target, source) => {
  //   for (const key of Object.keys(source)) {
  //     if (source[key] instanceof Object)
  //       Object.assign(source[key], deepmerge(target[key], source[key]));
  //   }

  //   Object.assign(target || {}, source);
  //   return target;
  // };

  // mark posts whether they fit search parameters or not
  const markFilteredData = (input) =>
    input.map((post) => {
      (post.node.frontmatter.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(
          searchQuery
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        ) ||
        post.node.frontmatter.author
          .join("")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(
            searchQuery
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
          )) &&
      (allStates.status.length > 0
        ? post.node.frontmatter.status != null
          ? post.node.frontmatter.status.some(
              (element) => allStates.status.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný status"])
        : true) &&
      (allStates.format.length > 0
        ? post.node.frontmatter.format != null
          ? post.node.frontmatter.format.some(
              (element) => allStates.format.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný formát"])
        : true) &&
      (allStates.categories.length > 0
        ? post.node.frontmatter.categories != null
          ? post.node.frontmatter.categories.some(
              (element) =>
                allStates.categories.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (allStates.genre.length > 0
        ? post.node.frontmatter.genre != null
          ? post.node.frontmatter.genre.some(
              (element) => allStates.genre.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (allStates.sport.length > 0
        ? post.node.frontmatter.sport != null
          ? post.node.frontmatter.sport.some(
              (element) => allStates.sport.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (allStates.geography.length > 0
        ? post.node.frontmatter.geography != null
          ? post.node.frontmatter.geography.some(
              (element) =>
                allStates.geography.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (allStates.period.length > 0
        ? post.node.frontmatter.period != null
          ? post.node.frontmatter.period.some(
              (element) => allStates.period.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (allStates.tags.length > 0
        ? post.node.frontmatter.tags != null
          ? post.node.frontmatter.tags.some(
              (element) => allStates.tags.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      // eslint-disable-next-line no-nested-ternary
      (allStates.language.length > 0
        ? post.node.frontmatter.language != null
          ? post.node.frontmatter.language.some(
              (element) => allStates.language.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný jazyk"])
        : true)
        ? (post.node.frontmatter.match = true)
        : (post.node.frontmatter.match = false);
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
  const readingList = postEdges.filter(
    (post) =>
      post.node.frontmatter.status !== null &&
      post.node.frontmatter.status[0] === "Rozečtené"
  );
  const lastReadList = postEdges.filter(
    (post) =>
      post.node.frontmatter.status !== null &&
      post.node.frontmatter.status[0] === "Přečtené"
  );
  const wishList = postEdges.filter(
    (post) =>
      post.node.frontmatter.status !== null &&
      post.node.frontmatter.status[0] === "Wishlist"
  );
  const garbageList = postEdges.filter(
    (post) =>
      post.node.frontmatter.status !== null &&
      post.node.frontmatter.status[0] === "Odpad"
  );

  return {
    allStates,
    isFilterOn,
    //
    readingList,
    lastReadList,
    wishList,
    garbageList,
    //
    matchingPosts,
    filterMetadata,
    //
    handleInputChange,
    handleCheckboxChange,
    handleFilterReset,
    handleQueryReset,
    resetAllFilters,
  };
};

export default useFilter;

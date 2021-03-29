// import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSearchQuery } from "../redux/actions/index";

const useFilterHook = () => {
  const searchQuery = useSelector((state) => state.query);
  const filterState = useSelector((state) => state.filterState);
  const dispatch = useDispatch();
  const updateSearch = (query) => dispatch(updateSearchQuery(query));
  //   const [titleState, setTitleState] = useState("");

  //   function handleChange(event) {
  // setTitleState(event.target.value);
  //   }

  const handleInputChange = (event) => {
    // console.log(event, "event");
    // setQuery(event.target.value);
    // event.target.value !== "" ? setFilterState(1) : setFilterState(0);
    // setLastFilter("fulltext");
    updateSearch(event.target.value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    // updateArticle({ title: titleState });
    // setTitleState("");
  }

  return { handleSubmit, handleInputChange, searchQuery, filterState };
};

export default useFilterHook;

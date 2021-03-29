import React from "react";
import useFilterHook from "../hooks/filter";
// import { useSelector } from "react-redux";
// const searchQuery = useSelector((state) => state.query);

const SearchInput = () => {
  const { handleInputChange } = useFilterHook();
  return (
    <div>
      <input
        type="text"
        aria-label="Search"
        placeholder="Název/autor&hellip;"
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchInput;

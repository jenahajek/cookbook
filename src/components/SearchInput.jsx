import React from "react";

const SearchInput = ({ onChange, value }) => (
  // const { handleInputChange } = useFilter();
  <div>
    <input
      type="text"
      aria-label="Search"
      placeholder="Název/autor&hellip;"
      value={value}
      onChange={onChange}
    />
  </div>
);
export default SearchInput;

import React from "react";

const SearchInput = ({ onChange, value, ariaLabel, placeholder, type }) => (
  <input
    type={type || "text"}
    aria-label={ariaLabel}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);
export default SearchInput;

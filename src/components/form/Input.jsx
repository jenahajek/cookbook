import React from "react";

const SearchInput = ({ onChange, value, ariaLabel, placeholder, type }) => (
  <div>
    <input
      type={type || "text"}
      aria-label={ariaLabel}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);
export default SearchInput;

import React from "react";

const searchInput = ({ handler }) => (
  <div>
    <input
      type="text"
      aria-label="Search"
      placeholder="Název/autor&hellip;"
      onChange={handler}
    />
  </div>
);

export default searchInput;

import React from "react";

const BookCoverFallback = ({ title }) => (
  <div>
    <h2>
      <mark>{title}</mark>
    </h2>
  </div>
);

export default BookCoverFallback;

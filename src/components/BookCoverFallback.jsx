import React from "react";
import Heading from "./Heading";

const BookCoverFallback = ({ title }) => (
  <div>
    <Heading level="3">
      <mark>fallback! {title}</mark>
    </Heading>
  </div>
);

export default BookCoverFallback;

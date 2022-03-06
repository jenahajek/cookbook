import React from "react";
import Heading from "./Heading";

const BookCoverFallback = ({ title, className }) => (
  <div className={`${className} fallback-cover`}>
    <Heading level="3">Obrázek chybí</Heading>
  </div>
);

export default BookCoverFallback;

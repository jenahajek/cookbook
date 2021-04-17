import React from "react";

function Heading({ level, children }) {
  const H = `h${level}`;

  return <H>{children}</H>;
}

export default Heading;

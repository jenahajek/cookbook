import React from "react";

function Heading({ level, children, className }) {
  const H = `h${level}`;

  return <H className={className}>{children}</H>;
}

export default Heading;

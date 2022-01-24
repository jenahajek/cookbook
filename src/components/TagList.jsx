import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function TagList({ className, slug, items }) {
  return (
    <>
      {items ? (
        <ul className={className}>
          {items.map((item) => (
            <li key={_.kebabCase(item)}>
              <Link
                style={{ textDecoration: "none" }}
                to={`/${slug}/${_.kebabCase(item)}`}>
                {item}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export default TagList;

import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function TagList({ slug, items }) {
  return (
    <ul>
      {items &&
        items.map((item) => (
          <li key={_.kebabCase(item)}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${slug}/${_.kebabCase(item)}`}>
              {item}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default TagList;

import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function AuthorList({ items }) {
  return (
    <ul>
      {items &&
        items.map((item) => (
          <li key={_.kebabCase(item)}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/autor/${_.kebabCase(item)}`}>
              {item}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default AuthorList;

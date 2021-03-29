import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function CategoryList({ items }) {
  return (
    <ul>
      {items &&
        items.map((item) => (
          <li>
            <Link
              key={item}
              style={{ textDecoration: "none" }}
              to={`/kategorie/${_.kebabCase(item)}`}>
              {item}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default CategoryList;

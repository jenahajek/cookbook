import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function FormatList({ items }) {
  return (
    <ul>
      {items &&
        items.map((item) => (
          <li>
            <Link
              key={item}
              style={{ textDecoration: "none" }}
              to={`/format/${_.kebabCase(item)}`}>
              {item}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default FormatList;

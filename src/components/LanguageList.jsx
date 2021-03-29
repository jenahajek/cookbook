import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function LanguageList({ items }) {
  return (
    <ul>
      {items &&
        items.map((item) => (
          <li>
            <Link
              key={item}
              style={{ textDecoration: "none" }}
              to={`/jazyk/${_.kebabCase(item)}`}>
              {item}
            </Link>
          </li>
        ))}
    </ul>
  );
}

export default LanguageList;

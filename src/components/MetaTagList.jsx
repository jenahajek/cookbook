import React from "react";
import _ from "lodash";
import { Link } from "gatsby";

function TagList({ className, slug, caption, items }) {
  return (
    <>
      <div className="meta">
        <p className="meta__caption">{caption}</p>
        <ul className={`${className} meta-taglist`}>
          {items
            ? items.map((item) => (
                <li key={_.kebabCase(item)}>
                  <Link to={`/${slug}/${_.kebabCase(item)}`}>{item}</Link>
                </li>
              ))
            : "--"}
        </ul>
      </div>
    </>
  );
}

export default TagList;

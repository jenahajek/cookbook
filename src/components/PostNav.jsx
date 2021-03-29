import React from "react";
import { Link } from "gatsby";

const PostNav = ({
  forwardsUrl,
  forwardsTitle,
  backTitle,
  backUrl,
  backwardTitle,
  backwardsUrl,
}) => (
  <nav className="post-nav">
    <ul>
      {forwardsUrl != null ? (
        <li>
          <Link
            to={`${forwardsUrl}`}
            data-key="37"
            className="post-nav__link post-nav__link--next">
            {forwardsTitle}
          </Link>
        </li>
      ) : null}
      <li>
        <Link to={`${backUrl}`} className="post-nav__link post-nav__link--back">
          {backTitle}
        </Link>
      </li>
      {backwardsUrl != null ? (
        <li>
          <Link
            to={`${backwardsUrl}`}
            data-key="39"
            className="post-nav__link post-nav__link--prev">
            {backwardTitle}
          </Link>
        </li>
      ) : null}
    </ul>
  </nav>
);

export default PostNav;

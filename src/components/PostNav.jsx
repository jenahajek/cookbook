import React from "react";
import { Link } from "gatsby";

const PostNav = ({
  forwardsUrl,
  forwardsTitle,
  backTitle,
  backUrl,
  backwardTitle,
  backwardsUrl,
  className,
}) => (
  <nav className={`${className} post-nav`}>
    <ul>
      {forwardsUrl != null ? (
        <li>
          <Link to={`${forwardsUrl}`}>{forwardsTitle}</Link>
        </li>
      ) : null}
      <li>
        <Link to={`${backUrl}`}>{backTitle}</Link>
      </li>
      {backwardsUrl != null ? (
        <li>
          <Link to={`${backwardsUrl}`}>{backwardTitle}</Link>
        </li>
      ) : null}
    </ul>
  </nav>
);

export default PostNav;

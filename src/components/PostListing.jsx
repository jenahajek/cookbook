import React from "react";
import BookThumbnail from "./BookThumbnail";

function PostListing({ postEdges }) {
  return (
    <div className="post-listing">
      {postEdges.map(({ node: post }) => (
        <BookThumbnail post={post} />
      ))}
    </div>
  );
}

export default PostListing;

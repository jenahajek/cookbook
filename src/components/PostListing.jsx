import React from "react";
import BookThumbnail from "./BookThumbnail";

function PostListing({ postEdges }) {
  return (
    <>
      {postEdges.map(({ node: post }) => (
        <BookThumbnail post={post} />
      ))}
    </>
  );
}

export default PostListing;

import React from "react";
import BookThumbnail from "../BookThumbnail";

function PostListing({ postEdges }) {
  // const postList = [];
  // postEdges.forEach((postEdge) => {
  //   postList.push({
  //     path: postEdge.node.fields.slug,
  //     tags: postEdge.node.frontmatter.tags,
  //     cover: postEdge.node.frontmatter.cover,
  //     title: postEdge.node.frontmatter.title,
  //     author: postEdge.node.frontmatter.author,
  //     date: postEdge.node.fields.date,
  //     excerpt: postEdge.node.excerpt,
  //     timeToRead: postEdge.node.timeToRead,
  //   });
  // });

  return (
    <>
      {postEdges.map(({ node: post }) => (
        <BookThumbnail post={post} />
      ))}
    </>
  );
}

export default PostListing;

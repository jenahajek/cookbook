import React from "react";
import { Link } from "gatsby";
import Image from "gatsby-image";
import BookCoverFallback from "./BookCoverFallback";

const SearchResult = ({ post }) => (
  <article>
    <Link to={post.slug} key={post.title}>
      <h2>{post.title}</h2>
    </Link>
    {post.extraLabels ? (
      <p>
        <mark>{post.extraLabels}</mark>
      </p>
    ) : null}
    {post.cover != null ? (
      <Image
        fluid={post.cover.sharp.fluid}
        alt={post.title}
        className="book-detail__cover"
      />
    ) : (
      <BookCoverFallback title={post.title} />
    )}
    {post.author !== undefined ? (
      <>
        <p>{post.author.join(", ")}</p>
      </>
    ) : null}
  </article>
);

export default SearchResult;

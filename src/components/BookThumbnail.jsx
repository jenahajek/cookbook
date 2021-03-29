import React from "react";
import { Link } from "gatsby";
import Image from "gatsby-image";
import BookCoverFallback from "./BookCoverFallback";
import AuthorList from "./AuthorList";

const BookThumbnail = ({ post }) => (
  <article>
    <Link to={post.fields.slug} key={post.frontmatter.title}>
      <h2>{post.frontmatter.title}</h2>
    </Link>
    {post.frontmatter.cover != null ? (
      <Image
        fluid={post.frontmatter.cover.sharp.fluid}
        alt={post.frontmatter.title}
        className="book-detail__cover"
      />
    ) : (
      <BookCoverFallback title={post.frontmatter.title} />
    )}

    {post.frontmatter.author !== undefined ? (
      <AuthorList items={post.frontmatter.author} />
    ) : (
      <p>Autor neznámý</p>
    )}
  </article>
);

export default BookThumbnail;

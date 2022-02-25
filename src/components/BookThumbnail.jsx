import React from "react";
import { Link } from "gatsby";
import Image from "gatsby-image";
import BookCoverFallback from "./BookCoverFallback";
import TagList from "./TagList";
import Heading from "./Heading";

const BookThumbnail = ({ post }) => (
  <article className="book-thumbnail">
    <Link to={post.fields.slug} key={post.frontmatter.title}>
      {post.frontmatter.cover != null ? (
        <Image
          fluid={post.frontmatter.cover.sharp.fluid}
          alt={post.frontmatter.title}
          className="book-detail__cover"
        />
      ) : (
        <BookCoverFallback title={post.frontmatter.title} />
      )}
    </Link>
    <div className="book-thumbnail__info">
      <Heading level="3" className="book-thumbnail__title">
        <Link
          to={post.fields.slug}
          key={`${post.frontmatter.title}-title`}
          className="book-thumbnail__title-link">
          {post.frontmatter.title}
        </Link>
      </Heading>

      {post.frontmatter.subtitle !== null ? (
        <p>{post.frontmatter.subtitle}</p>
      ) : null}
    </div>
  </article>
);

export default BookThumbnail;

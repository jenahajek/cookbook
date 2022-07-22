import React from "react";
import { Link } from "gatsby";
import BookCoverFallback from "./BookCoverFallback";
import Heading from "./Heading";
import CloudinaryImage from "./CloudinaryImage";

const BookThumbnail = ({ recipe }) => (
  <article className="book-thumbnail">
    <Link to={`../${recipe.slug}`} key={recipe.title}>
      {recipe.cover != null ? (
        <div className="book-detail__cover">
          <CloudinaryImage name={recipe.cover} />
        </div>
      ) : (
        <BookCoverFallback title={recipe.title} />
      )}
    </Link>
    <div className="book-thumbnail__info">
      <Heading level="3" className="book-thumbnail__title">
        <Link
          to={recipe.slug}
          key={`${recipe.title}-title`}
          className="book-thumbnail__title-link">
          {recipe.title}
        </Link>
      </Heading>

      {recipe.subtitle !== null ? <p>{recipe.subtitle}</p> : null}
    </div>
  </article>
);

export default BookThumbnail;

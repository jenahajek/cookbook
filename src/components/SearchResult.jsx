import React from "react";
import { Link } from "gatsby";
import Image from "gatsby-image";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import BookCoverFallback from "./BookCoverFallback";
import markMatch from "../hooks/markMatch";
import Heading from "./Heading";
import ExtraLabel from "./ExtraLabel";
import CloudinaryImage from "./CloudinaryImage";

import { closeFilterState } from "../redux/actions/actions";

const SearchResult = ({ post }) => {
  const dispatch = useDispatch();
  const closeFilter = () => dispatch(closeFilterState());

  const allStates = useSelector((state) => state);

  const match =
    post.author !== undefined && allStates.query.length > 0
      ? post.author.find((element) =>
          element
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .includes(
              allStates.query
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
            )
        )
      : undefined;

  return (
    <article className="book-thumbnail">
      <Link
        to={post.slug}
        key={post.title}
        className="search-result__link"
        onClick={closeFilter}>
        {post.cover != null ? (
          <div className="book-detail__cover">
            <CloudinaryImage name={post.cover} />
          </div>
        ) : (
          <BookCoverFallback title={post.title} />
        )}
      </Link>
      <div className="book-thumbnail__info">
        <Link to={post.slug} key={`${post.title}-title`} onClick={closeFilter}>
          <Heading level="3" className="book-thumbnail__title">
            {allStates.query.length > 0 &&
            post.title
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .includes(
                allStates.query
                  .toLowerCase()
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
              ) ? (
              <span
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: markMatch(post.title, allStates.query),
                }}
              />
            ) : (
              post.title
            )}
          </Heading>
        </Link>
        {post.author !== undefined ? (
          <p className="typo-author">
            <Link
              to={`/autor/${_.kebabCase(post.author)}`}
              key={_.kebabCase(post.author)}>
              {match !== undefined ? (
                <span
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{
                    __html: markMatch(post.author.join(", "), allStates.query),
                  }}
                />
              ) : (
                <span>
                  {post.author !== null && post.author.length > 0
                    ? post.author.join(", ")
                    : null}
                </span>
              )}
            </Link>
          </p>
        ) : null}
        {post.extraLabels ? <ExtraLabel>{post.extraLabels}</ExtraLabel> : null}
      </div>{" "}
    </article>
  );
};

export default SearchResult;

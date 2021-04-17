import React from "react";
import { Link } from "gatsby";
import Image from "gatsby-image";
import { useSelector } from "react-redux";
import BookCoverFallback from "./BookCoverFallback";
import markMatch from "../hooks/markMatch";
import Heading from "./Heading";
import ExtraLabel from "./ExtraLabel";

const SearchResult = ({ post }) => {
  const allStates = useSelector((state) => state);

  return (
    <article>
      <Link to={post.slug} key={post.title}>
        <Heading level="3">
          {allStates.query.length > 0 ? (
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
      {post.extraLabels ? <ExtraLabel>{post.extraLabels}</ExtraLabel> : null}
      {post.cover != null ? (
        <Image fluid={post.cover.sharp.fluid} alt={post.title} />
      ) : (
        <BookCoverFallback title={post.title} />
      )}
      {post.author !== undefined ? (
        <p>
          {allStates.query.length > 0 ? (
            <span
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: markMatch(post.author.join(", "), allStates.query),
              }}
            />
          ) : (
            post.author.join(", ")
          )}
        </p>
      ) : null}
    </article>
  );
};

export default SearchResult;

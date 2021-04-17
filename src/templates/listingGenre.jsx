import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import Heading from "../components/Heading";

export default function GenreTemplate({ pageContext, data }) {
  const { genre } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <Helmet title={`Žánr: ${genre} | ${config.siteTitle}`} />
      <Heading level="1">Žánr: {genre}</Heading>
      <PostListing postEdges={postEdges} />
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query genrePage($genre: String) {
    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { genre: { in: [$genre] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            date
          }
          excerpt
          frontmatter {
            title
            genre
            author
            cover {
              sharp: childImageSharp {
                fluid(maxHeight: 300) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            date
          }
        }
      }
    }
  }
`;

import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import Heading from "../components/Heading";

export default function FormatTemplate({ pageContext, data }) {
  const { format } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <Helmet title={`Formát: ${format} | ${config.siteTitle}`} />
      <Heading level="1">Formát: {format}</Heading>
      <PostListing postEdges={postEdges} />
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query formatPage($format: String) {
    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { format: { in: [$format] } } }
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
            author
            format
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

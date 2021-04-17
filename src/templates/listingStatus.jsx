import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import Heading from "../components/Heading";

export default function StatusTemplate({ pageContext, data }) {
  const { status } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <Helmet title={`Status: ${status} | ${config.siteTitle}`} />
      <Heading level="1">Status: {status}</Heading>
      <PostListing postEdges={postEdges} />
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query statusPage($status: String) {
    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { status: { in: [$status] } } }
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
            status
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

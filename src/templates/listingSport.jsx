import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import Heading from "../components/Heading";

export default function TagTemplate({ pageContext, data }) {
  const { sport } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <Helmet title={`Posts tagged as "${sport}" | ${config.siteTitle}`} />
      <Heading level="1" className="section-title">
        Sport: <span>{sport}</span>
      </Heading>
      <PostListing postEdges={postEdges} />
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query SportPage($sport: String) {
    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { sport: { in: [$sport] } } }
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
            sport
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

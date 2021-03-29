import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing/PostListing";
import config from "../../data/SiteConfig";

export default function TagTemplate({ pageContext, data }) {
  const { language } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <div className="tag-container">
        <Helmet title={`Knihy v jazyce: ${language} | ${config.siteTitle}`} />
        <h1>Jazyk: {language}</h1>
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query languagePage($language: String) {
    allMdx(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { language: { in: [$language] } } }
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
            language
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

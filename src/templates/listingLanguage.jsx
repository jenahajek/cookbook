import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../layout";
import PostListing from "../components/PostListing";
import config from "../../data/SiteConfig";
import Heading from "../components/Heading";

export default function LanguageTemplate({ pageContext, data }) {
  const { language } = pageContext;
  const postEdges = data.allMdx.edges;
  return (
    <Layout>
      <Helmet title={`Knihy v jazyce: ${language} | ${config.siteTitle}`} />
      <Heading level="1">Jazyk: {language}</Heading>
      <PostListing postEdges={postEdges} />
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

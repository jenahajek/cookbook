import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";
import Layout from "../layout";
import config from "../../data/SiteConfig";
import BookThumbnail from "../components/BookThumbnail";
import useFilter from "../hooks/useFilter";
import Heading from "../components/Heading";
import IconArrowRight from "../../assets/arrow-right.inline.svg";
import BookCoverFallback from "../components/BookCoverFallback";

const _ = require("lodash");

const Index = ({ data }) => {
  const {
    readingList,
    lastReadList,
    wishList,
    garbageList,
    postEdges,
  } = useFilter(data);

  const biographyPosts = postEdges.filter(
    (post) =>
      post.node.frontmatter.categories !== null &&
      post.node.frontmatter.categories.includes("Biografie")
  );
  const professionalPosts = postEdges.filter(
    (post) =>
      post.node.frontmatter.categories !== null &&
      post.node.frontmatter.categories.includes("Odborná")
  );

  return (
    <Layout>
      <div>
        <Helmet title={`Index | ${config.siteTitle}`} />

        <p hidden>
          Tohle je moje... soukromá databáze knih / půjčovna / diskuzní
          podněcovač / studnice doporučení / úložna poznámek / stroj na výběr
          příštího čtení
        </p>

        <h1 hidden>Oblasti knih</h1>
        <section className="layout-group">
          <Heading level="2" className="layout-group__title">
            Rozečtené
          </Heading>
          {readingList.map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
        </section>
        <section className="layout-group">
          <Heading level="2" className="layout-group__title">
            Poslední přečtené
          </Heading>
          {lastReadList.slice(0, 4).map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}

          <Link to="status/prectene" className="big-link">
            <span>
              Všechny přečtené
              <IconArrowRight />
            </span>
          </Link>
        </section>

        <Heading level="2" className="layout-group__title">
          Oblíbené kategorie
        </Heading>
        <div className="category__wrapper">
          <div className="category__group">
            <div className="category__items">
              {_.sampleSize(biographyPosts, 5).map(({ node: post }) => (
                // <BookThumbnail post={post} />

                <Link to={post.fields.slug} key={post.frontmatter.title}>
                  {post.frontmatter.cover != null ? (
                    <Image
                      fluid={post.frontmatter.cover.sharp.fluid}
                      alt={post.frontmatter.title}
                      className=""
                    />
                  ) : (
                    <BookCoverFallback title={post.frontmatter.title} />
                  )}
                </Link>
              ))}
            </div>
            <Link to="kategorie/biografie">
              Biografie <IconArrowRight />
            </Link>
          </div>
          <div className="category__group">
            <div className="category__items">
              {_.sampleSize(professionalPosts, 5).map(({ node: post }) => (
                // <BookThumbnail post={post} />

                <Link to={post.fields.slug} key={post.frontmatter.title}>
                  {post.frontmatter.cover != null ? (
                    <Image
                      fluid={post.frontmatter.cover.sharp.fluid}
                      alt={post.frontmatter.title}
                      className=""
                    />
                  ) : (
                    <BookCoverFallback title={post.frontmatter.title} />
                  )}
                </Link>
              ))}
            </div>
            <Link to="kategorie/odborna">
              Odborná literatura <IconArrowRight />
            </Link>
          </div>
        </div>
        <section className="layout-group">
          <Heading level="2" className="layout-group__title">
            Wishlist
          </Heading>
          {_.sampleSize(wishList, 4).map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
          <Link to="status/wishlist" className="big-link">
            <span>
              Vše na wishlistu
              <IconArrowRight />
            </span>
          </Link>
        </section>

        {/* <div hidden>
          <Heading level="2">Garbage</Heading>
          <ul>
            {_.sampleSize(garbageList, 5).map(({ node: post }) => (
              <li key={post.id}>
                <Link to={`${post.fields.slug}`}>{post.frontmatter.title}</Link>
              </li>
            ))}
          </ul>
        </div> */}
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query index {
    allBooks: allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            status
            format
            categories
            genre
            sport
            geography
            period
            language
            tags
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
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default Index;

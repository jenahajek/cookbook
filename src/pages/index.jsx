import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Image from "gatsby-image";
import { StaticImage } from "gatsby-plugin-image";
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
    // readingList,
    // lastReadList,
    // wishList,
    // garbageList,
    postEdges,
  } = useFilter(data);

  return (
    <Layout>
      <div>
        <Helmet title={`Index | ${config.siteTitle}`} />

        <div className="intro">
          <div className="intro__inner container">
            <div className="intro__text">
              <Heading level="1" className="main-title">
                Naše recepty
              </Heading>
              <div className="perex">
                <p>
                  Osobní sbírka receptů, které jsme vyzkoušeli, nebo nás lákají.
                </p>
                <p>
                  Tento seznam nám pomáhá při vybírání nejen víkendových obědů,
                  ale poslouží i pro vytipování svačiny na výlet nebo třeba
                  zákusku na oslavu kamaráda, který nemůže lepek.
                </p>
                <p>
                  A v neposlední řadě pomůže sdílet prověřené recepty a rady s
                  vámi. :)
                </p>
              </div>
            </div>
          </div>
          {/* <div className="intro__img">
            <StaticImage src="../../assets/FullSizeRender.jpeg" alt=" " />
          </div> */}
        </div>

        {/* <section className="layout-group">
          <Heading level="2" className="layout-group__title">
            Aktuálně rozečtené
          </Heading>
          {readingList.map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
        </section> */}
        <div className="container">
          <section className="layout-group">
            <Heading level="2" className="layout-group__title">
              Oblíbené
            </Heading>
            {postEdges.map(({ node: post }) => (
              <BookThumbnail post={post} />
            ))}

            {/* <Link to="status/prectene" className="big-link">
            <span>
              Všechny přečtené
              <IconArrowRight />
            </span>
          </Link> */}
          </section>
        </div>

        {/* <Heading level="2" className="layout-group__title">
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
          {_.sampleSize(wishList, 5).map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
          <Link to="status/wishlist" className="big-link">
            <span>
              Vše na wishlistu
              <IconArrowRight />
            </span>
          </Link>
        </section> */}

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
    allBooks: allMdx(sort: { fields: [frontmatter___dateAdded], order: DESC }) {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            subtitle
            cover {
              sharp: childImageSharp {
                fluid(maxHeight: 1300) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
            dateAdded
            tags
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

import React from "react";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Layout from "../layout";
import config from "../../data/SiteConfig";
import BookThumbnail from "../components/BookThumbnail";
import useFilter from "../hooks/useFilter";
import Heading from "../components/Heading";
import IconArrowRight from "../../assets/arrow-right.inline.svg";
import BookCoverFallback from "../components/BookCoverFallback";

const _ = require("lodash");

const Index = ({ data }) => {
  const { postEdges } = useFilter(data);

  const favoriteRecipes = postEdges.filter(
    (post) => post.node.frontmatter.favorite[0] === "ano"
  );
  const pastaRecipes = postEdges.filter(
    (post) =>
      post.node.frontmatter.mainIngredience &&
      post.node.frontmatter.mainIngredience.includes("těstoviny")
  );
  const vegetarianRecipes = postEdges.filter(
    (post) =>
      post.node.frontmatter.categories &&
      post.node.frontmatter.categories.includes("vegetariánské") &&
      post.node.frontmatter.type &&
      post.node.frontmatter.type.includes("obědy a večeře")
  );
  const wishlistRecipes = postEdges.filter(
    (post) =>
      post.node.frontmatter.tried && post.node.frontmatter.tried.includes("ne")
  );

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
        </div>

        <div className="container">
          <section className="layout-group">
            <Heading level="2" className="layout-group__title">
              Oblíbené
            </Heading>
            {favoriteRecipes.map(({ node: post }) => (
              <BookThumbnail post={post} />
            ))}

            <Heading level="2" className="layout-group__subtitle">
              Těstoviny
            </Heading>
            <div className="category__wrapper">
              <div className="category__group">
                <div className="category__items">
                  {pastaRecipes.map(({ node: post }) => (
                    <Link to={post.fields.slug} key={post.frontmatter.title}>
                      <BookThumbnail post={post} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Heading level="2" className="layout-group__subtitle">
              Bezmasá
            </Heading>
            <div className="category__wrapper">
              <div className="category__group">
                <div className="category__items">
                  {vegetarianRecipes.map(({ node: post }) => (
                    <Link to={post.fields.slug} key={post.frontmatter.title}>
                      <BookThumbnail post={post} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Heading level="2" className="layout-group__subtitle">
              Nevyzkoušené
            </Heading>
            <div className="category__wrapper">
              <div className="category__group">
                <div className="category__items">
                  {wishlistRecipes.map(({ node: post }) => (
                    <Link to={post.fields.slug} key={post.frontmatter.title}>
                      <BookThumbnail post={post} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

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
            favorite
            mainIngredience
            categories
            type
            tags
            tried
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

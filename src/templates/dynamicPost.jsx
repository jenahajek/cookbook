import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import CloudinaryImage from "../components/CloudinaryImage";
import BookCoverFallback from "../components/BookCoverFallback";
import Layout from "../layout";
import TagList from "../components/TagList";
import MetaTagList from "../components/MetaTagList";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import PostNav from "../components/PostNav";

// const FIND_RECIPE = gql`
//   query FindRecipe($id: ID!) {
//     recipes(where: { id: 336336886256632006 }) {
//       id
//       title
//       subtitle
//       sourceUrl
//       sourceName
//       slug
//       cover
//       content
//       wishlist
//       queue
//       favorite
//       type
//       categories
//       taste
//       mainIngredience
//       ingrediences
//       stock
//       season
//       difficulty
//       ingrediencesPrepTime
//       activeCookingTime
//       totalCookingTime
//       process
//       servingTemp
//       cuisine
//       price
//     }
//   }
// `;

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      subtitle
      sourceUrl
      sourceName
      slug
      cover
      content
      wishlist
      queue
      favorite
      type
      categories
      taste
      mainIngredience
      ingrediences
      stock
      season
      difficulty
      ingrediencesPrepTime
      activeCookingTime
      totalCookingTime
      process
      servingTemp
      cuisine
      price
    }
  }
`;

export default function DynamicPostTemplate({ id, slug }) {
  const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
  });

  let post;

  if (!loading && !error && data) {
    post = data.recipes.filter((recipe) => recipe.slug === slug)[0];
  }

  console.log(post);

  return (
    // <Layout>
    <>
      {error ? <p>error {console.log(error)}</p> : null}
      {loading ? <p>loading</p> : null}
      {/* 336336886256632006 */}
      {/* 337733047688364237 */}
      {!loading && !error && data && (
        <>
          <Helmet>
            <title>{`${post.title} | ${config.siteTitle}`}</title>
          </Helmet>
          {/* {post.cover != null ? (
            <SEO postPath={post.slug} postNode={post} postSEO />
          ) : null} */}
          <article className="layout-detail bg-black-100">
            <div className="layout-detail__header">
              <div className="container">
                <div className="layout-detail__titles">
                  <h1 className="layout-detail__title h1 font-size-xl">
                    {post.title}
                  </h1>
                  {post.subtitle ? (
                    <p className="layout-detail__subtitle">{post.subtitle}</p>
                  ) : null}
                </div>
              </div>
              {post.cover != null ? (
                <div className="layout-detail__cover">
                  <CloudinaryImage name={post.cover} className="post-cover" />
                </div>
              ) : (
                <BookCoverFallback
                  title={post.title}
                  className=" layout-detail__cover"
                />
              )}
            </div>
            <div className="container layout-detail__content">
              <div className="layout-detail__body">
                {/* <MDXRenderer>{postNode.body}</MDXRenderer> */}
                <p>
                  <strong>
                    Tady jsme zatím nic nevyplnili, čas teprve nadejde. Ale v
                    těchto místech bude seznam surovin a postup.
                  </strong>
                </p>
              </div>
              <aside className="layout-detail__meta">
                {post.sourceUrl ? (
                  <div className="meta">
                    <p className="meta__caption">Zdroj</p>
                    <a
                      href={post.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener">
                      {post.sourceName ? post.sourceName : "Odkaz"}
                    </a>
                  </div>
                ) : (
                  ""
                )}
                <MetaTagList
                  items={post.categories}
                  slug="kategorie"
                  caption="Kategorie"
                />
                {post.type && post.type.length > 0 ? (
                  <MetaTagList
                    items={post.type}
                    slug="typ"
                    caption="Typ pokrmu"
                  />
                ) : null}
                {post.categories && post.categories.length > 0 ? (
                  <MetaTagList
                    items={post.categories}
                    slug="kategorie"
                    caption="Kategorie"
                  />
                ) : null}
                {post.taste && post.taste.length > 0 ? (
                  <MetaTagList items={post.taste} slug="chut" caption="Chuť" />
                ) : null}
                {post.stock && post.stock.length > 0 ? (
                  <MetaTagList
                    items={post.stock}
                    slug="dostupnost-surovin"
                    caption="Dostupnost surovin"
                  />
                ) : null}
                {post.season && post.season.length > 0 ? (
                  <MetaTagList
                    items={post.season}
                    slug="sezona"
                    caption="Sezóna"
                  />
                ) : null}
                {post.difficulty ? (
                  <MetaTagList
                    items={post.difficulty}
                    slug="obtiznost"
                    caption="Obtížnost"
                  />
                ) : null}
                {post.activeCookingTime && post.activeCookingTime.length > 0 ? (
                  <MetaTagList
                    items={post.activeCookingTime}
                    slug="aktivni-doba-vareni"
                    caption="Aktivní doba vaření"
                  />
                ) : null}
                {post.totalCookingTime && post.totalCookingTime.length > 0 ? (
                  <MetaTagList
                    items={post.totalCookingTime}
                    slug="celkova-doba-vareni"
                    caption="Celkova doba vaření"
                  />
                ) : null}
                {post.process && post.process.length > 0 ? (
                  <MetaTagList
                    items={post.process}
                    slug="proces"
                    caption="Proces"
                  />
                ) : null}
                {post.servingTemp && post.servingTemp.length > 0 ? (
                  <MetaTagList
                    items={post.servingTemp}
                    slug="servirovci-teplota"
                    caption="Servírovací teplota"
                  />
                ) : null}
                {post.cuisine && post.cuisine.length > 0 ? (
                  <MetaTagList
                    items={post.cuisine}
                    slug="kuchyne"
                    caption="Kuchyně"
                  />
                ) : null}
                {post.price && post.price.length > 0 ? (
                  <MetaTagList items={post.price} slug="cena" caption="Cena" />
                ) : null}
                {post.tags && post.tags.length > 0 ? (
                  <MetaTagList
                    items={post.tags}
                    slug="stitky"
                    caption="Štítky"
                  />
                ) : null}{" "}
              </aside>
            </div>
          </article>
          <div className="container">
            <PostNav
              className="layout-detail__nav"
              forwardsUrl="pageContext.nextslug"
              forwardsTitle={<>pageContext.nexttitle &rarr;</>}
              backUrl="/"
              backTitle="Zpět na výpis"
              backwardTitle={<>&larr; pageContext.prevtitle</>}
              backwardsUrl="pageContext.prevslug"
            />
          </div>
        </>
      )}
    </>
    // </Layout>
  );
}

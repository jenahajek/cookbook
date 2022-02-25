import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Image from "gatsby-image";
import BookCoverFallback from "../components/BookCoverFallback";
import Layout from "../layout";
import TagList from "../components/TagList";
import MetaTagList from "../components/MetaTagList";
import SEO from "../components/SEO";
import config from "../../data/SiteConfig";
import PostNav from "../components/PostNav";

export default function PostTemplate({ data, pageContext }) {
  const { slug } = pageContext;
  const postNode = data.mdx;
  const post = postNode.frontmatter;
  if (!post.id) {
    post.id = slug;
  }

  return (
    <Layout>
      <Helmet>
        <title>{`${post.title} | ${config.siteTitle}`}</title>
      </Helmet>
      {post.cover != null ? (
        <SEO postPath={slug} postNode={postNode} postSEO />
      ) : null}
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
          {/* {post.author != null ? (
          <TagList
            className="layout-detail__author"
            items={post.author}
            slug="autor"
          />
        ) : (
          <p className="layout-detail__author">Autor neznámý</p>
        )} */}
          {post.cover != null ? (
            <Image
              fluid={post.cover.sharp.fluid}
              alt={post.title}
              className="book-detail__cover layout-detail__cover"
            />
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
                Tady jsme zatím nic nevyplnili, čas teprve nadejde. Ale v těchto
                místech bude seznam surovin a postup.
              </strong>
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              laudantium facere, exercitationem vitae similique sequi quam
              perferendis provident natus omnis quod ex nulla, recusandae
              reiciendis eveniet eum consequatur repellendus commodi fuga
              dolores, sunt suscipit illo. Autem accusantium explicabo quas
              blanditiis commodi ut consequatur, fugiat repudiandae id dolor
              veniam iste porro repellat recusandae tempore temporibus deleniti
              eveniet alias. Ut, itaque. Ratione officiis cupiditate debitis
              aliquam, sapiente modi, incidunt, itaque dignissimos est
              consequatur doloribus ut laboriosam reprehenderit voluptatum qui
              exercitationem. Voluptas, cumque nulla? Assumenda odio id nesciunt
              fuga, mollitia labore animi officiis minima officia voluptatem
              facere maiores, non placeat, corporis quidem! Tenetur.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              laudantium facere, exercitationem vitae similique sequi quam
              perferendis provident natus omnis quod ex nulla, recusandae
              reiciendis eveniet eum consequatur repellendus commodi fuga
              dolores, sunt suscipit illo. Autem accusantium explicabo quas
              blanditiis commodi ut consequatur, fugiat repudiandae id dolor
              veniam iste porro repellat recusandae tempore temporibus deleniti
              eveniet alias. Ut, itaque. Ratione officiis cupiditate debitis
              aliquam, sapiente modi, incidunt, itaque dignissimos est
              consequatur doloribus ut laboriosam reprehenderit voluptatum qui
              exercitationem. Voluptas, cumque nulla? Assumenda odio id nesciunt
              fuga, mollitia labore animi officiis minima officia voluptatem
              facere maiores, non placeat, corporis quidem! Tenetur.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas
              laudantium facere, exercitationem vitae similique sequi quam
              perferendis provident natus omnis quod ex nulla, recusandae
              reiciendis eveniet eum consequatur repellendus commodi fuga
              dolores, sunt suscipit illo. Autem accusantium explicabo quas
              blanditiis commodi ut consequatur, fugiat repudiandae id dolor
              veniam iste porro repellat recusandae tempore temporibus deleniti
              eveniet alias. Ut, itaque. Ratione officiis cupiditate debitis
              aliquam, sapiente modi, incidunt, itaque dignissimos est
              consequatur doloribus ut laboriosam reprehenderit voluptatum qui
              exercitationem. Voluptas, cumque nulla? Assumenda odio id nesciunt
              fuga, mollitia labore animi officiis minima officia voluptatem
              facere maiores, non placeat, corporis quidem! Tenetur.
            </p>
          </div>
          <aside className="layout-detail__meta">
            <MetaTagList
              items={post.categories}
              slug="kategorie"
              caption="Kategorie"
            />
            {post.type ? (
              <MetaTagList items={post.type} slug="typ" caption="Typ pokrmu" />
            ) : null}
            {post.categories ? (
              <MetaTagList
                items={post.categories}
                slug="kategorie"
                caption="Kategorie"
              />
            ) : null}
            {post.taste ? (
              <MetaTagList items={post.taste} slug="chut" caption="Chuť" />
            ) : null}
            {post.stock ? (
              <MetaTagList
                items={post.stock}
                slug="dostupnost-surovin"
                caption="Dostupnost surovin"
              />
            ) : null}
            {post.season ? (
              <MetaTagList items={post.season} slug="sezona" caption="Sezóna" />
            ) : null}
            {post.difficulty ? (
              <MetaTagList
                items={post.difficulty}
                slug="obtiznost"
                caption="Obtížnost"
              />
            ) : null}
            {post.prepTime ? (
              <MetaTagList
                items={post.prepTime}
                slug="doba-pripravy"
                caption="Doba přípravy"
              />
            ) : null}
            {post.cookingTime ? (
              <MetaTagList
                items={post.cookingTime}
                slug="doba-vareni"
                caption="Doba vaření"
              />
            ) : null}
            {post.process ? (
              <MetaTagList
                items={post.process}
                slug="proces"
                caption="Proces"
              />
            ) : null}
            {post.servingTemp ? (
              <MetaTagList
                items={post.servingTemp}
                slug="servirovci-teplota"
                caption="Servírovací teplota"
              />
            ) : null}
            {post.geography ? (
              <MetaTagList
                items={post.geography}
                slug="zeme-puvodu"
                caption="Země původu"
              />
            ) : null}
            {post.price ? (
              <MetaTagList items={post.price} slug="cena" caption="Cena" />
            ) : null}
            {post.tags ? (
              <MetaTagList items={post.tags} slug="stitky" caption="Štítky" />
            ) : null}
          </aside>
        </div>
      </article>
      <div className="container">
        <PostNav
          className="layout-detail__nav"
          forwardsUrl={pageContext.nextslug}
          forwardsTitle={<>{pageContext.nexttitle} &rarr;</>}
          backUrl="/"
          backTitle="Zpět na výpis"
          backwardTitle={<>&larr; {pageContext.prevtitle}</>}
          backwardsUrl={pageContext.prevslug}
        />
      </div>
    </Layout>
  );
}

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      excerpt
      frontmatter {
        title
        subtitle
        cover {
          sharp: childImageSharp {
            fluid(maxHeight: 600) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
        dateAdded
        type
        tried
        taste
        mainIngredience
        stock
        season
        difficulty
        prepTime
        cookingTime
        process
        servingTemp
        categories
        geography
        price
        tags
      }
      body
      fields {
        slug
      }
    }
  }
`;

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
  console.log("sfsf", data);
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
        <h1 className="layout-detail__title h1 font-size-xl">{post.title}</h1>
        {post.subtitle != null ? (
          <h2 className="layout-detail__subtitle">{post.subtitle}</h2>
        ) : null}
        {post.author != null ? (
          <TagList
            className="layout-detail__author"
            items={post.author}
            slug="autor"
          />
        ) : (
          <p className="layout-detail__author">Autor neznámý</p>
        )}

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
        <div className="layout-detail__body">
          <MDXRenderer>{postNode.body}</MDXRenderer>
        </div>
        <aside className="layout-detail__meta">
          <MetaTagList
            items={post.categories}
            slug="kategorie"
            caption="Kategorie"
          />
          <MetaTagList items={post.tags} slug="stitky" caption="Štítky" />
          <MetaTagList items={post.language} slug="jazyk" caption="Psané" />
          <MetaTagList items={post.format} slug="format" caption="Formát" />
          <MetaTagList items={post.genre} slug="zanr" caption="Žánr" />
          <p className="meta__duration">
            <span className="meta__caption">Délka</span>
            {post.pageCount != null ? (
              <span>{post.pageCount} stránek</span>
            ) : null}
            {post.duration != null ? (
              <span>
                {Math.trunc(post.duration / 60)}h {post.duration % 60}min
              </span>
            ) : null}
            {post.pageCount == null && post.duration == null ? <>--</> : null}
          </p>
          <MetaTagList items={post.status} slug="status" caption="Status" />
        </aside>
      </article>
      <PostNav
        className="layout-detail__nav"
        forwardsUrl={pageContext.nextslug}
        forwardsTitle={<>&larr; {pageContext.nexttitle}</>}
        backUrl="/"
        backTitle="Zpět na výpis"
        backwardTitle={<>{pageContext.prevtitle} &rarr;</>}
        backwardsUrl={pageContext.prevslug}
      />
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
        author
        date
        categories
        tags
        format
        genre
        status
        language
        pageCount
        duration
      }
      body
      fields {
        slug
        date
      }
    }
  }
`;

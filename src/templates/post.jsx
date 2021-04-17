import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Image from "gatsby-image";
import BookCoverFallback from "../components/BookCoverFallback";
import Layout from "../layout";
import TagList from "../components/TagList";
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
      <SEO postPath={slug} postNode={postNode} postSEO />
      <article>
        <header>
          <h1>{post.title}</h1>
          {post.subtitle != null ? <h2>{post.subtitle}</h2> : null}
        </header>
        {post.author != null ? (
          <TagList items={post.author} slug="autor" />
        ) : (
          <p>Autor neznámý</p>
        )}

        {post.cover != null ? (
          <Image
            fluid={post.cover.sharp.fluid}
            alt={post.title}
            className="book-detail__cover"
          />
        ) : (
          <BookCoverFallback title={post.title} />
        )}
        <MDXRenderer>{postNode.body}</MDXRenderer>
        <aside>
          <div className="post-meta">
            <TagList items={post.tags} slug="stitky" />
            <TagList items={post.categories} slug="kategorie" />
            <TagList items={post.language} slug="jazyk" />
            <TagList items={post.format} slug="format" />
            <TagList items={post.genre} slug="zanr" />
            {post.pageCount != null ? <p>{post.pageCount} stránek</p> : null}
            {post.duration != null ? (
              <p>
                {Math.trunc(post.duration / 60)}h {post.duration % 60}min
              </p>
            ) : null}
          </div>
        </aside>
        <PostNav
          forwardsUrl={pageContext.nextslug}
          forwardsTitle={<>&larr; {pageContext.nexttitle}</>}
          backUrl="/"
          backTitle="Zpět na výpis"
          backwardTitle={<>{pageContext.prevtitle} &rarr;</>}
          backwardsUrl={pageContext.prevslug}
        />
      </article>
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

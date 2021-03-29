import React from "react";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Image from "gatsby-image";
import BookCoverFallback from "../components/BookCoverFallback";
import Layout from "../layout";
import TagList from "../components/TagList";
import CategoryList from "../components/CategoryList";
import AuthorList from "../components/AuthorList";
import FormatList from "../components/FormatList";
import LanguageList from "../components/LanguageList";
import GenreList from "../components/GenreList";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.css";
import "./post.css";
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
      {/* <SEO postPath={slug} postNode={postNode} postSEO /> */}
      <article>
        <header>
          <h1>{post.title}</h1>
          {post.subtitle != null ? <h2>{post.subtitle}</h2> : null}
        </header>
        {post.author != null ? (
          <AuthorList items={post.author} />
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
            <TagList items={post.tags} />
            <CategoryList items={post.categories} />
            <LanguageList items={post.language} />
            <FormatList items={post.format} />
            <GenreList items={post.genre} />
            {/* <PostTags tags={post.language} /> */}
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

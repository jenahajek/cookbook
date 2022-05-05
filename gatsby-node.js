/* eslint "no-console": "off" */

const path = require("path");
const _ = require("lodash");
const moment = require("moment");
const siteConfig = require("./data/SiteConfig");

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  let slug;
  if (node.internal.type === "Mdx") {
    const fileNode = getNode(node.parent);
    const parsedFilePath = path.parse(fileNode.relativePath);
    if (
      Object.prototype.hasOwnProperty.call(node, "frontmatter") &&
      Object.prototype.hasOwnProperty.call(node.frontmatter, "title")
    ) {
      slug = `/${_.kebabCase(node.frontmatter.title)}`;
    } else if (parsedFilePath.name !== "index" && parsedFilePath.dir !== "") {
      slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
    } else if (parsedFilePath.dir === "") {
      slug = `/${parsedFilePath.name}/`;
    } else {
      slug = `/${parsedFilePath.dir}/`;
    }

    if (Object.prototype.hasOwnProperty.call(node, "frontmatter")) {
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "slug"))
        slug = `/${_.kebabCase(node.frontmatter.slug)}`;
      if (Object.prototype.hasOwnProperty.call(node.frontmatter, "date")) {
        const date = moment(node.frontmatter.date, siteConfig.dateFromFormat);
        if (!date.isValid)
          console.warn(`WARNING: Invalid date.`, node.frontmatter);

        createNodeField({ node, name: "date", value: date.toISOString() });
      }
    }
    createNodeField({ node, name: "slug", value: slug });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type allMdx {
      edges: [MdxEdge!]!
    }
    type edges {
      node: Mdx!
    }
    type node {
      frontmatter: MdxFrontmatter
    }
    type frontmatter {
      title: String!
      subtitle: String
      slug: String
      version: Int
      queue: [String]
      cover: File
      sourceName: [String]
      sourceHref: [String]
      favorite: [String]
      tried: [String]
      type: [String]
      categories: [String]
      taste: [String]
      mainIngredience: [String]
      stock: [String]
      season: [String]
      difficulty: [String]
      prepTime: [String]
      cookingTime: [String]
      process: [String]
      servingTemp: [String]
      healthiness: [String]
      geography: [String]
      price: [String]
      tags: [String]
    }
  `;
  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postPage = path.resolve("src/templates/post.jsx");
  const tagPage = path.resolve("src/templates/listingTag.jsx");

  // Get a full list of markdown posts
  const markdownQueryResult = await graphql(`
    {
      allMdx(sort: { fields: [frontmatter___dateAdded], order: DESC }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              subtitle
              queue
              sourceName
              sourceHref
              cover {
                childImageSharp {
                  id
                  fluid {
                    originalImg
                  }
                }
              }
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
              dateAdded
            }
          }
        }
      }
    }
  `);

  if (markdownQueryResult.errors) {
    console.error(markdownQueryResult.errors);
    throw markdownQueryResult.errors;
  }

  const tagSet = new Set();

  const postsEdges = markdownQueryResult.data.allMdx.edges;

  // Sort posts
  postsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.frontmatter.dateAdded,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.frontmatter.dateAdded,
      siteConfig.dateFromFormat
    );

    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;

    return 0;
  });

  // Paging
  // const { postsPerPage } = siteConfig;
  // if (postsPerPage) {
  //   const pageCount = Math.ceil(postsEdges.length / postsPerPage);

  //   [...Array(pageCount)].forEach((_val, pageNum) => {
  //     createPage({
  //       path: pageNum === 0 ? `/` : `/${pageNum + 1}/`,
  //       component: listingPage,
  //       context: {
  //         limit: postsPerPage,
  //         skip: pageNum * postsPerPage,
  //         pageCount,
  //         currentPageNum: pageNum + 1,
  //       },
  //     });
  //   });
  // } else {
  //   // Load the landing page instead
  //   createPage({
  //     path: `/`,
  //     component: landingPage,
  //   });
  // }

  // Post page creating
  postsEdges.forEach((edge, index) => {
    // Generate a list of tags
    if (edge.node.frontmatter.tags) {
      edge.node.frontmatter.tags.forEach((tag) => {
        tagSet.add(tag);
      });
    }

    // Create post pages
    const nextID = index + 1 < postsEdges.length ? index + 1 : 0;
    const prevID = index - 1 >= 0 ? index - 1 : postsEdges.length - 1;
    const nextEdge = postsEdges[nextID];
    const prevEdge = postsEdges[prevID];

    createPage({
      path: edge.node.fields.slug,
      component: postPage,
      context: {
        slug: edge.node.fields.slug,
        nexttitle: nextEdge.node.frontmatter.title,
        nextslug: nextEdge.node.fields.slug,
        prevtitle: prevEdge.node.frontmatter.title,
        prevslug: prevEdge.node.fields.slug,
      },
    });
  });

  //  Create tag pages
  tagSet.forEach((tag) => {
    createPage({
      path: `/stitky/${_.kebabCase(tag)}/`,
      component: tagPage,
      context: { tag },
    });
  });
};

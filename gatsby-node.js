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

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const postPage = path.resolve("src/templates/post.jsx");
  const tagPage = path.resolve("src/templates/listingTag.jsx");
  const categoryPage = path.resolve("src/templates/listingCategory.jsx");
  const languagePage = path.resolve("src/templates/listingLanguage.jsx");
  const statusPage = path.resolve("src/templates/listingStatus.jsx");
  const formatPage = path.resolve("src/templates/listingFormat.jsx");
  const authorPage = path.resolve("src/templates/listingAuthor.jsx");
  const genrePage = path.resolve("src/templates/listingGenre.jsx");
  const sportPage = path.resolve("src/templates/listingSport.jsx");
  // const listingPage = path.resolve("./src/templates/listing.jsx");
  // const landingPage = path.resolve("./src/templates/landing.jsx");

  // Get a full list of markdown posts
  const markdownQueryResult = await graphql(`
    {
      allMdx(sort: { fields: [frontmatter___date], order: DESC }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              author
              tags
              categories
              duration
              pageCount
              genre
              language
              status
              format
              date
              sport
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
  const categorySet = new Set();
  const languageSet = new Set();
  const statusSet = new Set();
  const formatSet = new Set();
  const authorSet = new Set();
  const genreSet = new Set();
  const sportSet = new Set();

  const postsEdges = markdownQueryResult.data.allMdx.edges;

  // Sort posts
  postsEdges.sort((postA, postB) => {
    const dateA = moment(
      postA.node.frontmatter.date,
      siteConfig.dateFromFormat
    );

    const dateB = moment(
      postB.node.frontmatter.date,
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

    // Generate a list of categories
    if (edge.node.frontmatter.categories) {
      edge.node.frontmatter.categories.forEach((category) => {
        categorySet.add(category);
      });
    }

    // Generate a list of languages
    if (edge.node.frontmatter.language) {
      edge.node.frontmatter.language.forEach((language) => {
        languageSet.add(language);
      });
    }

    // Generate a list of statuses
    if (edge.node.frontmatter.status) {
      edge.node.frontmatter.status.forEach((status) => {
        statusSet.add(status);
      });
    }

    // Generate a list of formats
    if (edge.node.frontmatter.format) {
      edge.node.frontmatter.format.forEach((format) => {
        formatSet.add(format);
      });
    }

    // Generate a list of authors
    if (edge.node.frontmatter.author) {
      edge.node.frontmatter.author.forEach((author) => {
        authorSet.add(author);
      });
    }

    // Generate a list of genres
    if (edge.node.frontmatter.genre) {
      edge.node.frontmatter.genre.forEach((genre) => {
        genreSet.add(genre);
      });
    }

    // Generate a list of sports
    if (edge.node.frontmatter.sport) {
      edge.node.frontmatter.sport.forEach((sport) => {
        sportSet.add(sport);
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

  // Create category pages
  categorySet.forEach((category) => {
    createPage({
      path: `/kategorie/${_.kebabCase(category)}/`,
      component: categoryPage,
      context: { category },
    });
  });

  // Create language pages
  languageSet.forEach((language) => {
    createPage({
      path: `/jazyk/${_.kebabCase(language)}/`,
      component: languagePage,
      context: { language },
    });
  });

  // Create statue pages
  statusSet.forEach((status) => {
    createPage({
      path: `/status/${_.kebabCase(status)}/`,
      component: statusPage,
      context: { status },
    });
  });

  // Create format pages
  formatSet.forEach((format) => {
    createPage({
      path: `/format/${_.kebabCase(format)}/`,
      component: formatPage,
      context: { format },
    });
  });

  // Create author pages
  authorSet.forEach((author) => {
    createPage({
      path: `/autor/${_.kebabCase(author)}/`,
      component: authorPage,
      context: { author },
    });
  });

  // Create genre pages
  genreSet.forEach((genre) => {
    createPage({
      path: `/zanr/${_.kebabCase(genre)}/`,
      component: genrePage,
      context: { genre },
    });
  });

  // Create sport pages
  sportSet.forEach((sport) => {
    createPage({
      path: `/sport/${_.kebabCase(sport)}/`,
      component: sportPage,
      context: { sport },
    });
  });
};

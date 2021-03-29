/* eslint-disable no-unused-expressions */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
import React, { useState } from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Layout from "../layout";
import config from "../../data/SiteConfig";
import BookThumbnail from "../components/BookThumbnail";
import SearchInput from "../components/SearchInput";
import SearchResult from "../components/SearchResult";
import FormCheckbox from "../components/FormCheckbox";
import useFilterHook from "../hooks/filter";

const Index = ({ data }) => {
  // states
  const { searchQuery, filterState } = useFilterHook();

  const [formatItems, setFormatItems] = useState([]);
  const [statusItems, setStatusItems] = useState([]);
  const [tagItems, setTagItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [languageItems, setLanguageItems] = useState([]);
  const [lastFilter, setLastFilter] = useState(""); // last filter rule applied. Needed to prevent hiding options in given group

  // state handling
  const handleFormatChange = (event) => {
    setFormatItems(
      event.target.checked
        ? formatItems.concat([event.target.value])
        : formatItems.filter((value) => value !== event.target.value)
    );
    // formatItems ? setFilterState(1) : setFilterState(0);
    setLastFilter("format");
  };
  const handleStatusChange = (event) => {
    setStatusItems(
      event.target.checked
        ? statusItems.concat([event.target.value])
        : statusItems.filter((value) => value !== event.target.value)
    );
    // statusItems ? setFilterState(1) : setFilterState(0);
    setLastFilter("status");
  };
  const handleCategoryChange = (event) => {
    setCategoryItems(
      event.target.checked
        ? categoryItems.concat([event.target.value])
        : categoryItems.filter((value) => value !== event.target.value)
    );
    // // categoryItems ? setFilterState(1) : setFilterState(0);
    setLastFilter("categories");
  };
  const handleLanguageChange = (event) => {
    setLanguageItems(
      event.target.checked
        ? languageItems.concat([event.target.value])
        : languageItems.filter((value) => value !== event.target.value)
    );
    // // languageItems ? setFilterState(1) : setFilterState(0);
    setLastFilter("language");
  };
  const handleTagChange = (event) => {
    setTagItems(
      event.target.checked
        ? tagItems.concat([event.target.value])
        : tagItems.filter((value) => value !== event.target.value)
    );
    // // tagItems ? setFilterState(1) : setFilterState(0);
    setLastFilter("tags");
  };

  // data
  const postEdges = data.allBooks.edges;

  // default listings
  const readingList = postEdges.filter(
    (post) => post.node.frontmatter.status[0] === "Rozečtené"
  );
  const lastReadList = postEdges.filter(
    (post) => post.node.frontmatter.status[0] === "Přečtené"
  );
  const wishList = postEdges.filter(
    (post) => post.node.frontmatter.status[0] === "Wishlist"
  );
  const garbageList = postEdges.filter(
    (post) => post.node.frontmatter.status[0] === "Odpad"
  );

  // all posts that suit filter parameters
  const filteredRawData = postEdges.filter(
    (post) =>
      (post.node.frontmatter.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(searchQuery.toLowerCase()) ||
        post.node.frontmatter.author
          .join("")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .includes(searchQuery.toLowerCase())) &&
      (formatItems.length > 0
        ? post.node.frontmatter.format != null
          ? post.node.frontmatter.format.some(
              (element) => formatItems.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný formát"])
        : true) &&
      (statusItems.length > 0
        ? post.node.frontmatter.status != null
          ? post.node.frontmatter.status.some(
              (element) => statusItems.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný status"])
        : true) &&
      (tagItems.length > 0
        ? post.node.frontmatter.tags != null
          ? post.node.frontmatter.tags.some(
              (element) => tagItems.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      (categoryItems.length > 0
        ? post.node.frontmatter.categories != null
          ? post.node.frontmatter.categories.some(
              (element) => categoryItems.indexOf(_.kebabCase(element)) >= 0
            )
          : null
        : true) &&
      // eslint-disable-next-line no-nested-ternary
      (languageItems.length > 0
        ? post.node.frontmatter.language != null
          ? post.node.frontmatter.language.some(
              (element) => languageItems.indexOf(_.kebabCase(element)) >= 0
            )
          : (post.extraLabels = ["Nespecifikováný jazyk"])
        : true)
  );

  // transform filter results so it is easier to use it later
  const filteredPosts = [];
  filteredRawData.reduce((output, post) => {
    filteredPosts.push({
      slug: post.node.fields.slug,
      title: post.node.frontmatter.title,
      tags: post.node.frontmatter.tags,
      cover: post.node.frontmatter.cover,
      author: post.node.frontmatter.author,
      extraLabels: post.extraLabels,
    });
  }, []);

  // gather metadata about filtered results, so filter can show current state of options
  // filter will be rendered in this order
  const filterDimensions = [
    {
      dimension: "status",
      state: statusItems,
      stateHandler: handleStatusChange,
      label: "Status",
    },
    {
      dimension: "format",
      state: formatItems,
      stateHandler: handleFormatChange,
      label: "Formát",
    },
    {
      dimension: "categories",
      state: categoryItems,
      stateHandler: handleCategoryChange,
      label: "Kategorie",
    },
    {
      dimension: "tags",
      state: tagItems,
      stateHandler: handleTagChange,
      label: "Štítky",
    },
    {
      dimension: "language",
      state: languageItems,
      stateHandler: handleLanguageChange,
      label: "Jazyk",
    },
  ];

  // pick all occurences of given dimension (e.g. status)
  const yyy = {};
  filterDimensions.forEach((dimension) => {
    const aaa = filteredRawData.reduce((acc, post) => {
      if (post.node.frontmatter[dimension.dimension] !== null) {
        post.node.frontmatter[dimension.dimension].forEach((item) => {
          acc.push(item);
        });
      }
      return acc;
    }, []);
    yyy[dimension.dimension] = aaa;
  });

  // sort and count occurences (e.g. {unread: 16, read: 12})
  const zzz = {};
  filterDimensions.forEach((dimension) => {
    const bbb = yyy[dimension.dimension].reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
    zzz[dimension.dimension] = bbb;
  });

  // transform the array to this format [{value: 'read', count: 8}, {...} ]
  const relevantXXX = {};
  filterDimensions.forEach((dimension) => {
    const tmp = [];
    Object.entries(zzz[dimension.dimension]).forEach((item) => {
      if (item[0]) {
        const obj = {
          value: item[0],
          count: item[1],
        };
        tmp.push(obj);
      }
    });
    relevantXXX[dimension.dimension] = JSON.parse(JSON.stringify(tmp));
  });

  const filteredData = {
    posts: filteredPosts,
    ...relevantXXX,
  };

  return (
    <Layout>
      <div className="about-container">
        <Helmet title={`Index | ${config.siteTitle}`} />

        <p>
          Tohle je moje... soukromá databáze knih / půjčovna / diskuzní
          podněcovač / studnice doporučení / úložna poznámek / stroj na výběr
          příštího čtení
        </p>

        <SearchInput />

        {filterDimensions.map((dimension) => (
          <>
            <h4>{dimension.label}</h4>
            {filteredData[dimension.dimension].map((item) => (
              <FormCheckbox
                key={item}
                count={item.count}
                value={_.kebabCase(item.value)}
                label={item.value}
                onChange={dimension.stateHandler}
                checked={dimension.state.includes(_.kebabCase(item.value))}
              />
            ))}
            <br />
            <hr />
          </>
        ))}

        {filterState ? (
          <>
            <h1>výsledky hledání</h1>
            {filteredData.posts.map((post) => (
              <SearchResult post={post} />
            ))}
          </>
        ) : null}

        <br />
        <br />
        <hr />
        <br />
        <br />

        <h1>homepage</h1>
        <section>
          <h2>Rozečtené</h2>
          {readingList.map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
        </section>
        <section>
          <h2>Poslední přečtené</h2>
          {lastReadList.slice(0, 5).map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
        </section>
        <h2>Kategorie</h2>
        <ul>
          <li>
            <Link to="category/biography">Biography</Link>
          </li>
          <li>
            <Link to="category/professional">Professional</Link>
          </li>
          {/* <li>
              <Link to="category">Seznam kategorií</Link>
            </li> */}
        </ul>
        <section>
          <h2>wishlist</h2>
          {wishList.slice(0, 5).map(({ node: post }) => (
            <BookThumbnail post={post} />
          ))}
        </section>
        <h2>Garbage</h2>
        <ul>
          {garbageList.slice(0, 5).map(({ node: post }) => (
            <li key={post.id}>
              <Link to={`${post.fields.slug}`}>{post.frontmatter.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query index {
    allBooks: allMdx {
      edges {
        node {
          id
          excerpt
          frontmatter {
            title
            status
            format
            tags
            categories
            language
            author
            cover {
              sharp: childImageSharp {
                fluid(maxHeight: 300) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
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

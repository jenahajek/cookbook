import React from "react";
import _ from "lodash";
import { Helmet } from "react-helmet";
import { Link, graphql } from "gatsby";
import Layout from "../layout";
import config from "../../data/SiteConfig";
import BookThumbnail from "../components/BookThumbnail";
import SearchInput from "../components/SearchInput";
import SearchResult from "../components/SearchResult";
import FormCheckbox from "../components/FormCheckbox";
import useFilter from "../hooks/useFilter";
import FILTER_DIMENSIONS from "../contants/filterDimensions";

const Index = ({ data }) => {
  const {
    allStates,
    isFilterOn,
    //
    readingList,
    lastReadList,
    wishList,
    garbageList,
    //
    matchingPosts,
    filterMetadata,
    //
    handleCheckboxChange,
    handleInputChange,
    handleFilterReset,
    handleQueryReset,
    resetAllFilters,
  } = useFilter(data);

  return (
    <Layout>
      <div className="about-container">
        <Helmet title={`Index | ${config.siteTitle}`} />

        <p>
          Tohle je moje... soukromá databáze knih / půjčovna / diskuzní
          podněcovač / studnice doporučení / úložna poznámek / stroj na výběr
          příštího čtení
        </p>

        <SearchInput onChange={handleInputChange} value={allStates.query} />
        <button type="button" onClick={handleQueryReset}>
          Reset
        </button>

        <div className="temp-filter-wrapper">
          {FILTER_DIMENSIONS.map((dimension) => (
            <div className="temp-filter">
              <h4>{dimension.label}</h4>
              {filterMetadata[dimension.dimension].map((item) => (
                <>
                  <FormCheckbox
                    key={item}
                    count={
                      item.count === 0 &&
                      allStates.lastDimension === dimension.dimension
                        ? "?"
                        : item.count
                    }
                    value={_.kebabCase(item.value)}
                    label={item.value}
                    dimension={dimension.dimension}
                    checked={allStates[dimension.dimension].includes(
                      _.kebabCase(item.value)
                    )}
                    disabled={
                      item.count === 0 &&
                      allStates.lastDimension !== dimension.dimension &&
                      !allStates[dimension.dimension].includes(
                        _.kebabCase(item.value)
                      )
                    }
                    onChange={handleCheckboxChange}
                  />
                </>
              ))}
              <button
                type="button"
                onClick={() => handleFilterReset(dimension.dimension)}>
                Reset
              </button>
              <br />
              <hr />
            </div>
          ))}
        </div>
        <button type="button" onClick={resetAllFilters}>
          Reset All
        </button>

        {isFilterOn ? (
          <div className="temp-serp">
            <h1>výsledky hledání pro:</h1>
            {allStates.query.length > 0 ? (
              <div className="temp-result-tag-group">
                {allStates.query.length ? `Výraz "${allStates.query}"` : ""}
              </div>
            ) : null}
            {FILTER_DIMENSIONS.map((dimension) =>
              allStates[dimension.dimension].length > 0 ? (
                <div
                  className={`temp-result-tag-group${
                    allStates[dimension.dimension].length > 1
                      ? " temp-group"
                      : ""
                  }`}>
                  {filterMetadata[dimension.dimension].map((item) =>
                    allStates[dimension.dimension].includes(
                      _.kebabCase(item.value)
                    ) ? (
                      <div className="temp-result-tag">
                        <FormCheckbox
                          key={item}
                          value={_.kebabCase(item.value)}
                          label={item.value}
                          dimension={dimension.dimension}
                          checked={allStates[dimension.dimension].includes(
                            _.kebabCase(item.value)
                          )}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    ) : null
                  )}
                </div>
              ) : null
            )}

            {matchingPosts.map((post) =>
              post.match ? <SearchResult post={post} /> : null
            )}
          </div>
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
            categories
            genre
            sport
            geography
            period
            language
            tags
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

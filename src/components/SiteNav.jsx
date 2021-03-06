import React, { useContext } from "react";
import _ from "lodash";
import { Link, useStaticQuery, graphql } from "gatsby";
import Typewriter from "typewriter-effect";
import Input from "./form/Input";
import SearchResult from "./SearchResult";
import Checkbox from "./form/Checkbox";
import FILTER_DIMENSIONS from "../constants/filterDimensions";
import useFilter from "../hooks/useFilter";
import Heading from "./Heading";
import IconClose from "../../assets/close.inline.svg";
import IconSearch from "../../assets/search.inline.svg";
import { IdentityContext } from "../../identity-context";

const SiteNav = () => {
  const data = useStaticQuery(graphql`
    query SiteNav {
      allBooks: allMdx {
        edges {
          node {
            id
            frontmatter {
              title
              cover {
                sharp: childImageSharp {
                  fluid(maxHeight: 300) {
                    ...GatsbyImageSharpFluid_withWebp
                  }
                }
              }
              queue
              sourceName
              sourceHref
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
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const { user, identity: netlifyIdentity } = useContext(IdentityContext);

  const {
    allStates,
    //
    postEdges,
    matchingPosts,
    filterMetadata,
    //
    handleCheckboxChange,
    handleInputChange,
    handleFilterReset,
    handleQueryReset,
    handleResetAllFilters,

    closeFilter,
    toggleFilter,
    toggleFilterSection,
  } = useFilter(data);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";

  return (
    <header className="site-nav">
      <div className="container">
        <div className="site-nav__inner">
          <div className="site-nav__inner-logo">
            <Link to="/" className="logo" onClick={closeFilter}>
              J????i a Dii kucha??ka
              {/* {postEdges.length} */}
            </Link>
            {/* {pathname === "/" ? (
              <Typewriter
                className="typewriter"
                options={{
                  strings: [
                    "je moje soukrom?? datab??ze recept??",
                    "je stroj na v??b??r dal????ho j??dla",
                    "je seznam recept?? pro inspiraci",
                    "je rozdm??ch??va?? ??ivota v kuchyni",
                    "je diskuzn?? podn??cova??",
                    "je studnice doporu??en??",
                    "je m?? ??lo??na pozn??mek",
                    "je usnad??ova?? ??ivota v kuchyni",
                  ],
                  autoStart: true,
                  loop: true,
                  deleteSpeed: 30,
                }}
              />
            ) : null} */}
          </div>

          <button
            className="site-login"
            type="button"
            onClick={() => {
              netlifyIdentity.open();
            }}>
            {(user && user.user_metadata && user.user_metadata.full_name) ||
              "P??ihl??sit se"}
          </button>

          <button type="button" onClick={toggleFilter} className="site-search">
            <span>Najdi recept</span>
            <IconSearch />
          </button>
        </div>
      </div>

      <div hidden={!allStates.filterVisibility} className="filter__container">
        <div className="filter__controls">
          <div className="filter-input">
            <Input
              onChange={handleInputChange}
              value={allStates.query}
              type="search"
              ariaLabel="Hledej recept"
              placeholder="Hledej recept"
            />
            <button type="button" onClick={handleQueryReset}>
              Smazat
            </button>
          </div>

          <div className="temp-filter-wrapper">
            {FILTER_DIMENSIONS.map((dimension) => (
              <div className="temp-filter" key={dimension}>
                <h4 className="filter-section-toggle">
                  <button
                    type="button"
                    aria-expanded={
                      allStates.filterSections[dimension.dimension]
                    }
                    onClick={() => toggleFilterSection(dimension.dimension)}>
                    {dimension.label}
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false">
                      <path
                        d="M17,7H7C6.6,7,6.3,7.2,6.1,7.5c-0.2,0.3-0.2,0.7,0,1l5,8c0.2,0.3,0.5,0.5,0.8,0.5s0.7-0.2,0.8-0.5l5-8c0.2-0.3,0.2-0.7,0-1
	C17.7,7.2,17.4,7,17,7z"
                      />
                    </svg>
                  </button>
                </h4>
                <div
                  className="temp-filter__section"
                  hidden={!allStates.filterSections[dimension.dimension]}>
                  {filterMetadata[dimension.dimension].map((item) => (
                    <Checkbox
                      key={item}
                      count={
                        item.count === 0 &&
                        allStates.lastDimension === dimension.dimension
                          ? "+"
                          : item.count
                      }
                      value={`${dimension.dimension}-${_.kebabCase(
                        item.value
                      )}`}
                      label={item.value}
                      dimension={dimension.dimension}
                      checked={allStates[dimension.dimension].includes(
                        `${dimension.dimension}-${_.kebabCase(item.value)}`
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
                  ))}
                  {allStates[dimension.dimension].length ? (
                    <button
                      type="button"
                      className="reset-btn"
                      onClick={() => handleFilterReset(dimension.dimension)}>
                      Zru??it
                      <IconClose />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="temp-serp-container">
          {allStates.filterState ? (
            <div className="temp-serp">
              <div className="temp-serp__header">
                <Heading level="2">
                  {matchingPosts.length > 4 ? (
                    <p>
                      Nalezeno <strong>{matchingPosts.length}</strong> v??sledk??
                      odpov??daj??c??ch kombinaci{" "}
                    </p>
                  ) : matchingPosts.length === 1 ? (
                    <p>
                      Nalezen <strong>1</strong> v??sledek pro kombinaci
                    </p>
                  ) : matchingPosts.length === 0 ? (
                    <p>Nic nenalezeno pro kombinaci</p>
                  ) : (
                    <p>
                      Nalezeny <strong>{matchingPosts.length}</strong> v??sledky
                      pro kombinaci{" "}
                    </p>
                  )}
                </Heading>
                {allStates.query.length > 0 ? (
                  <div className="temp-result-tag-group">
                    {allStates.query.length ? `V??raz "${allStates.query}"` : ""}
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
                          `${dimension.dimension}-${_.kebabCase(item.value)}`
                        ) ? (
                          <div className="temp-result-tag">
                            <Checkbox
                              key={item}
                              value={_.kebabCase(item.value)}
                              label={item.value}
                              dimension={dimension.dimension}
                              checked={allStates[dimension.dimension].includes(
                                `${dimension.dimension}-${_.kebabCase(
                                  item.value
                                )}`
                              )}
                              iconAfter={<IconClose />}
                              onChange={handleCheckboxChange}
                            />
                          </div>
                        ) : null
                      )}
                    </div>
                  ) : null
                )}

                <button
                  type="button"
                  onClick={handleResetAllFilters}
                  className="reset-btn">
                  Smazat v??e
                  <IconClose />
                </button>
              </div>
              {matchingPosts.length > 0 ? (
                <div className="post-listing">
                  {matchingPosts.map((post) =>
                    post.match ? <SearchResult post={post} /> : <p>nic</p>
                  )}
                </div>
              ) : (
                <p className="empty-serp">
                  T??hle kombinaci nic nevyhovuje. Sorry jako.
                  <span aria-hidden="true">??\_(???)_/??</span>
                </p>
              )}
            </div>
          ) : (
            "Jen do toho! :)"
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteNav;

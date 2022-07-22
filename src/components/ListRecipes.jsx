import React, { useContext } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IdentityContext } from "../../identity-context";
import RecipeThumbnail from "./RecipeThumbnail";
import Heading from "./Heading";

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
const ListRecipes = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
  });

  return (
    <div className="container">
      {/* Dash {user && user.user_metadata.full_name}
      <button
        className="site-login"
        type="button"
        onClick={() => {
          netlifyIdentity.open();
        }}>
        {(user && user.user_metadata && user.user_metadata.full_name) ||
          "Přihlásit se"}
      </button> */}
      {/* <a href="/app/pridej-recept">Přidat recept</a> */}
      <Heading level="2" className="layout-group__title">
        Oblíbené z databaze
      </Heading>
      <div>
        <div className="category__wrapper">
          <div className="category__group">
            <div className="category__items">
              {!loading &&
                !error &&
                data.recipes.slice(-5).map((recipe) => (
                  <div key={recipe.id}>
                    <RecipeThumbnail recipe={recipe} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRecipes;

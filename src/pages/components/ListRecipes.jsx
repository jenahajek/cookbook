import React, { useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { IdentityContext } from "../../../identity-context";
import RecipeThumbnail from "../../components/RecipeThumbnail";
import Heading from "../../components/Heading";

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      subtitle
      url
      slug
      cover
      content
    }
  }
`;

const ListRecipe = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);

  const { loading, error, data } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
  });

  return (
    <div className="container">
      Dash {user && user.user_metadata.full_name}
      <button
        className="site-login"
        type="button"
        onClick={() => {
          netlifyIdentity.open();
        }}>
        {(user && user.user_metadata && user.user_metadata.full_name) ||
          "Přihlásit se"}
      </button>
      <a href="./pridej-recept">Přidat recept</a>
      <Heading level="2" className="layout-group__title">
        Oblíbené z databaze
      </Heading>
      <div>
        {loading ? <div>loading...</div> : null}
        {error ? <div>error: {error.message}</div> : null}
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

export default ListRecipe;

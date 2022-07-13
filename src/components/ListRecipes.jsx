import React, { useContext } from "react";
import { IdentityContext } from "../../identity-context";
import RecipeTable from "./RecipeTable";
import Heading from "./Heading";

const ListRecipe = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
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
      <a href="/app/pridej-recept">Přidat recept</a>
      <Heading level="2" className="layout-group__title">
        Oblíbené z databaze
      </Heading>
      <div>
        <RecipeTable />

        <div className="category__wrapper">
          <div className="category__group">
            <div className="category__items">
              {/* {!loading &&
                !error &&
                data.recipes.slice(-5).map((recipe) => (
                  <div key={recipe.id}>
                    <RecipeThumbnail recipe={recipe} />
                  </div>
                ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRecipe;

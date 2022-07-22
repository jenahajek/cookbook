import React, { useContext } from "react";
import { IdentityContext } from "../../identity-context";
import RecipeTable from "./RecipeTable";
import Heading from "./Heading";

const EditRecipes = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
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
        <RecipeTable />
      </div>
    </div>
  );
};

export default EditRecipes;

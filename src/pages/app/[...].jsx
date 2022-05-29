import React, { useContext, useRef } from "react";
import { Router } from "@reach/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IdentityContext } from "../../../identity-context";

const ADD_RECIPE = gql`
  mutation AddRecipe($title: String!) {
    addRecipe(title: $title) {
      id
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!) {
    updateRecipe(id: $id) {
      title
    }
  }
`;

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
    }
  }
`;

const Dash = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const titleRef = useRef();
  const urlRef = useRef();
  const [addRecipe] = useMutation(ADD_RECIPE);
  const [updateRecipe] = useMutation(UPDATE_RECIPE);
  const { loading, error, data, refetch } = useQuery(GET_RECIPES);

  return (
    <div>
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
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addRecipe({
            variables: {
              title: titleRef.current.value,
              url: urlRef.current.value,
            },
          });
          titleRef.current.value = "";
          urlRef.current.value = "";
          await refetch();
        }}>
        <div className="input">
          <label className="label" htmlFor="name">
            <span className="label__text">Název jídla</span>
          </label>
          <input
            type="text"
            ref={titleRef}
            className="input__field"
            id="name"
            name="name"
            placeholder="Lohikeitto"
          />
        </div>
        <div className="input">
          <label className="label" htmlFor="source-url">
            <span className="label__text">Webová adresa zdroje</span>
          </label>
          <span id="description-source-url" className="label-description">
            Uveď odkaz, pokud je to recept z internetu.
          </span>
          <input
            type="url"
            className="input__field"
            ref={urlRef}
            id="source-url"
            name="source-url"
            placeholder="https://www.kucharkaprodceru.cz/gratinovane-brambory/"
            aria-describedby="description-source-url"
            noValidate
          />
        </div>
        <div className="u-mb-md">
          <button type="submit" className="btn">
            Uložit recept
          </button>
        </div>
      </form>
      <div>
        {loading ? <div>loading...</div> : null}
        {error ? <div>error: {error.message}</div> : null}
        {!loading &&
          !error &&
          data.recipes.map((recipe) => (
            <div key={recipe.id}>{recipe.title}</div>
          ))}
      </div>
    </div>
  );
};
const App = (props) => (
  <Router>
    <Dash path="/app" />
  </Router>
);

export default App;

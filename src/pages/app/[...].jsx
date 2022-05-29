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
  const titleInputRef = useRef();
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
            variables: { title: titleInputRef.current.value },
          });
          titleInputRef.current.value = "";
          await refetch();
        }}>
        <label htmlFor="shutuplinter">
          Název
          <input ref={titleInputRef} type="text" id="shutuplinter" />
        </label>
        <button type="submit">Submit</button>
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

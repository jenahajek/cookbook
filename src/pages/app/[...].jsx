import React, { useContext, useRef } from "react";
import { Router } from "@reach/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IdentityContext } from "../../../identity-context";

const ADD_RECIPE = gql`
  mutation AddRecipe($text: String!) {
    addRecipe(text: $text) {
      id
    }
  }
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!) {
    updateRecipe(id: $id) {
      text
      done
    }
  }
`;

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      text
      done
    }
  }
`;

const Dash = () => {
  const { user } = useContext(IdentityContext);
  const inputRef = useRef();
  const [addRecipe] = useMutation(ADD_RECIPE);
  const [updateRecipe] = useMutation(UPDATE_RECIPE);
  const { loading, error, data, refetch } = useQuery(GET_RECIPES);

  return (
    <div>
      Dash {user && user.user_metadata.full_name}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await addRecipe({ variables: { text: inputRef.current.value } });
          inputRef.current.value = "";
          await refetch();
        }}>
        <label htmlFor="shutuplinter">
          jmeno
          <input ref={inputRef} type="text" id="shutuplinter" />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        {loading ? <div>loading...</div> : null}
        {error ? <div>{error.message}</div> : null}
        {!loading &&
          !error &&
          data.recipes.map((recipe) => (
            <div key={recipe.id}>{recipe.text}</div>
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

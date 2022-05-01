import React, { useContext, useRef, useReducer } from "react";
import { Router } from "@reach/router";
import { IdentityContext } from "../../identity-context";

const recipesReducer = (state, action) => {
  switch (action.type) {
    case "addRecipe":
      return [{ done: false, value: action.payload }, ...state];
    default:
      throw new Error();
  }
};

const Dash = () => {
  const { user } = useContext(IdentityContext);
  const [recipes, dispatch] = useReducer(recipesReducer, []);
  const inputRef = useRef();

  return (
    <div>
      Dash {user && user.user_metadata.full_name}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          dispatch({ type: "addRecipe", payload: inputRef.current.value });
          inputRef.current.value = "";
        }}>
        <label>
          jmeno
          <input ref={inputRef} type="text" />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        {recipes.map((recipe, index) => (
          <div key={index}>{recipe.value}</div>
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

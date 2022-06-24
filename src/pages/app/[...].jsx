import React, { useContext, useRef } from "react";
import { Router } from "@reach/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { IdentityContext } from "../../../identity-context";
import RecipeThumbnail from "../../components/RecipeThumbnail";
import Heading from "../../components/Heading";
import AddRecipe from "../components/AddRecipe";
import ListRecipes from "../components/ListRecipes";

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

const App = (props) => (
  <Router basepath="/app">
    <AddRecipe path="/pridej-recept" />
    <ListRecipes path="/" />
  </Router>
);

export default App;

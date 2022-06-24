import React from "react";
import { Router } from "@reach/router";
import AddRecipe from "../../components/AddRecipe";
import ListRecipes from "../../components/ListRecipes";

const App = () => (
  <Router basepath="/app">
    <AddRecipe path="/pridej-recept" />
    <ListRecipes path="/" />
  </Router>
);

export default App;

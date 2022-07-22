import React from "react";
import { Router } from "@reach/router";
import AddRecipe from "../../components/AddRecipe";
import ListRecipes from "../../components/ListRecipes";
import EditRecipes from "../../components/EditRecipes";
import DynamicPostTemplate from "../../templates/dynamicPost";

// const SomeSubPage = (props) => <div>Hi from SubPage with id: {props.id}</div>;

const App = () => (
  <>
    <div className="app-menu">
      <a href="/app/vypis-receptu">Výpis receptů</a>
      <a href="/app/pridej-recept">Přidej recept</a>
      <a href="/app">Editace receptů</a>
    </div>

    <Router basepath="/app">
      <ListRecipes path="/vypis-receptu" />
      <AddRecipe path="/pridej-recept" />
      <EditRecipes path="/" />
      <DynamicPostTemplate path="/:slug" />
    </Router>
  </>
);

export default App;

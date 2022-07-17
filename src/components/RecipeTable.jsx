import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "gatsby";
import BookCoverFallback from "./BookCoverFallback";
import Heading from "./Heading";
import CloudinaryImage from "./CloudinaryImage";
import {
  TYPES,
  CATEGORIES,
  TASTE,
  STOCK,
  SEASON,
  DIFFICULTY,
  INGREDIENCES_PREP_TIME,
  ACTIVE_COOKING_TIME,
  TOTAL_COOKING_TIME,
  PROCESS,
  SERVING_TEMP,
  CUISINE,
  PRICE,
} from "../constants/recipeOptions";

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $id: ID!
    $title: String
    $subtitle: String
    $sourceUrl: String
    $sourceName: String
    $slug: String
    $cover: String
    $content: String
    $wishlist: Boolean
    $queue: Boolean
    $favorite: Boolean
    $type: [String]
    $categories: [String]
    $taste: [String]
    $mainIngredience: [String]
    $ingrediences: [String]
    $stock: [String]
    $season: [String]
    $difficulty: [String]
    $ingrediencesPrepTime: [String]
    $activeCookingTime: [String]
    $totalCookingTime: [String]
    $process: [String]
    $servingTemp: [String]
    $cuisine: [String]
    $price: [String]
  ) {
    updateRecipe(
      id: $id
      title: $title
      subtitle: $subtitle
      sourceUrl: $sourceUrl
      sourceName: $sourceName
      slug: $slug
      cover: $cover
      content: $content
      wishlist: $wishlist
      queue: $queue
      favorite: $favorite
      type: $type
      categories: $categories
      taste: $taste
      mainIngredience: $mainIngredience
      ingrediences: $ingrediences
      stock: $stock
      season: $season
      difficulty: $difficulty
      ingrediencesPrepTime: $ingrediencesPrepTime
      activeCookingTime: $activeCookingTime
      totalCookingTime: $totalCookingTime
      process: $process
      servingTemp: $servingTemp
      cuisine: $cuisine
      price: $price
    ) {
      id
      title
      subtitle
      sourceUrl
      sourceName
      slug
      cover
      content
      wishlist
      queue
      favorite
      type
      categories
      taste
      mainIngredience
      ingrediences
      stock
      season
      difficulty
      ingrediencesPrepTime
      activeCookingTime
      totalCookingTime
      process
      servingTemp
      cuisine
      price
      owner
    }
  }
`;

const GET_RECIPES = gql`
  query GetRecipes {
    recipes {
      id
      title
      subtitle
      sourceUrl
      sourceName
      slug
      cover
      content
      wishlist
      queue
      favorite
      type
      categories
      taste
      mainIngredience
      ingrediences
      stock
      season
      difficulty
      ingrediencesPrepTime
      activeCookingTime
      totalCookingTime
      process
      servingTemp
      cuisine
      price
    }
  }
`;

const RecipeTable = () => {
  const [updateRecipe] = useMutation(UPDATE_RECIPE);
  const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
  });

  const handleImageUpload = async (event) => {
    const url = `https://api.cloudinary.com/v1_1/cookbookjenahajek/upload`;

    async function getCoverImageUrl(formData) {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const responseObject = await response.json();
      return responseObject.public_id;
    }

    const { files } = event.target;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "upload_from_browser");

    const newCoverUrl = await getCoverImageUrl(formData);

    event.target
      .closest("tr")
      .querySelector("td:nth-child(2) input").value = newCoverUrl;
  };

  return (
    <>
      {loading ? <div>loading...</div> : null}
      {error ? <div>error: {error.message}</div> : null}
      {!loading && !error && data && (
        <form
          className="recipe-table-form"
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();

            const allRows = Array.from(document.querySelectorAll("tr"));

            const editedRows = allRows.slice(1);

            editedRows.forEach(async (row) => {
              const selectedTypes = [];
              Array.from(
                row.querySelector("[data-type='type']").selectedOptions
              ).forEach((item) => selectedTypes.push(item.value));

              const selectedCategories = [];
              Array.from(
                row.querySelector("[data-type='categories']").selectedOptions
              ).forEach((item) => selectedCategories.push(item.value));

              const selectedTaste = [];
              Array.from(
                row.querySelector("[data-type='taste']").selectedOptions
              ).forEach((item) => selectedTaste.push(item.value));

              const selectedStock = [];
              Array.from(
                row.querySelector("[data-type='stock']").selectedOptions
              ).forEach((item) => selectedStock.push(item.value));

              const selectedSeason = [];
              Array.from(
                row.querySelector("[data-type='season']").selectedOptions
              ).forEach((item) => selectedSeason.push(item.value));

              const selectedDifficulty = [];
              Array.from(
                row.querySelector("[data-type='difficulty']").selectedOptions
              ).forEach((item) => selectedDifficulty.push(item.value));

              const selectedIngrediencesPrepTime = [];
              Array.from(
                row.querySelector("[data-type='ingrediencesPrepTime']")
                  .selectedOptions
              ).forEach((item) =>
                selectedIngrediencesPrepTime.push(item.value)
              );

              const selectedactiveCookingTime = [];
              Array.from(
                row.querySelector("[data-type='activeCookingTime']")
                  .selectedOptions
              ).forEach((item) => selectedactiveCookingTime.push(item.value));

              const selectedCookingTime = [];
              Array.from(
                row.querySelector("[data-type='totalCookingTime']")
                  .selectedOptions
              ).forEach((item) => selectedCookingTime.push(item.value));

              const selectedProcess = [];
              Array.from(
                row.querySelector("[data-type='process']").selectedOptions
              ).forEach((item) => selectedProcess.push(item.value));

              const selectedServingTemp = [];
              Array.from(
                row.querySelector("[data-type='servingTemp']").selectedOptions
              ).forEach((item) => selectedServingTemp.push(item.value));

              const selectedCuisine = [];
              Array.from(
                row.querySelector("[data-type='cuisine']").selectedOptions
              ).forEach((item) => selectedCuisine.push(item.value));

              const selectedPrice = [];
              Array.from(
                row.querySelector("[data-type='price']").selectedOptions
              ).forEach((item) => selectedPrice.push(item.value));

              await updateRecipe({
                variables: {
                  id: row.id,
                  title: row.querySelector("input[data-type='title']").value,
                  subtitle: row.querySelector("input[data-type='subtitle']")
                    .value,
                  sourceUrl: row.querySelector("input[data-type='sourceUrl']")
                    .value,
                  sourceName: row.querySelector("input[data-type='sourceName']")
                    .value,
                  slug: row.querySelector("input[data-type='slug']").value,
                  cover:
                    row.querySelector("input[data-type='cover']").value || null,
                  wishlist: row.querySelector("input[data-type='wishlist']")
                    .checked,
                  queue: row.querySelector("input[data-type='queue']").checked,
                  favorite: row.querySelector("input[data-type='favorite']")
                    .checked,
                  type: selectedTypes,
                  categories: selectedCategories,
                  taste: selectedTaste,
                  // mainIngredience:
                  //   row.querySelector("input[data-type='mainIngredience']")
                  //     .value || null,
                  // ingrediences:
                  //   row.querySelector("input[data-type='ingrediences']")
                  //     .value || null,
                  stock: selectedStock,
                  season: selectedSeason,
                  difficulty: selectedDifficulty,
                  ingrediencesPrepTime: selectedIngrediencesPrepTime,
                  activeCookingTime: selectedactiveCookingTime,
                  totalCookingTime: selectedCookingTime,
                  process: selectedProcess,
                  servingTemp: selectedServingTemp,
                  cuisine: selectedCuisine,
                  price: selectedPrice,
                },
              });
            });

            e.target.reset();
            await refetch();
          }}>
          <button type="submit" className="btn">
            Uložit recept
          </button>
          <table className="recipe-table">
            <tr>
              <th>cover</th>
              <th>cover url</th>
              <th>slug</th>
              <th>source url</th>
              <th>source name</th>
              <th>title</th>
              <th>subtitle</th>
              <th>wishlist</th>
              <th>queue</th>
              <th>favorite</th>
              <th>type</th>
              <th>categories</th>
              <th>taste</th>
              {/* <th>mainIngredience</th>
              <th>ingrediences</th> */}
              <th>stock</th>
              <th>season</th>
              <th>difficulty</th>
              <th>ingrediencesPrepTime</th>
              <th>activeCookingTime</th>
              <th>totalCookingTime</th>
              <th>process</th>
              <th>servingTemp</th>
              <th>cuisine</th>
              <th>price</th>
            </tr>
            {data.recipes
              ? data.recipes
                  .slice(0)
                  .reverse()
                  .map((recipe) => (
                    <tr className="" id={recipe.id} key={recipe.id}>
                      <td className="recipe-table__cover">
                        {recipe.cover != null ? (
                          <div className="book-detail__cover">
                            <CloudinaryImage name={recipe.cover} />
                          </div>
                        ) : (
                          <input
                            type="file"
                            name="files[]"
                            multiple
                            onChange={(e) => handleImageUpload(e)}
                            id={`cover-${recipe.slug}`}
                          />
                        )}
                      </td>
                      <td>
                        <label>
                          cover
                          <input
                            type="text"
                            defaultValue={recipe.cover}
                            data-type="cover"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          slug
                          <input
                            type="text"
                            defaultValue={recipe.slug}
                            data-type="slug"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          source url
                          <input
                            type="text"
                            defaultValue={recipe.sourceUrl}
                            data-type="sourceUrl"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          source name
                          <input
                            type="text"
                            defaultValue={recipe.sourceName}
                            data-type="sourceName"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          title
                          <input
                            type="text"
                            defaultValue={recipe.title}
                            data-type="title"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          subtitle
                          <input
                            type="text"
                            defaultValue={recipe.subtitle}
                            data-type="subtitle"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          wishlist
                          <input
                            type="checkbox"
                            defaultChecked={recipe.wishlist}
                            data-type="wishlist"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          queue
                          <input
                            type="checkbox"
                            defaultChecked={recipe.queue}
                            data-type="queue"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          favorite
                          <input
                            type="checkbox"
                            defaultChecked={recipe.favorite}
                            data-type="favorite"
                          />
                        </label>
                      </td>

                      <td>
                        <label>
                          type
                          <select multiple data-type="type">
                            {TYPES &&
                              TYPES.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.type && recipe.type.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>

                      <td>
                        <label>
                          Categories
                          <select multiple data-type="categories">
                            {CATEGORIES &&
                              CATEGORIES.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.categories &&
                                    recipe.categories.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          Taste
                          <select multiple data-type="taste">
                            {TASTE &&
                              TASTE.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.taste && recipe.taste.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      {/* <td>
                        <label>
                          mainIngredience
                          <input
                            type="text"
                            defaultValue={recipe.mainIngredience}
                            data-type="mainIngredience"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          ingrediences
                          <input
                            type="text"
                            defaultValue={recipe.ingrediences}
                            data-type="ingrediences"
                          />
                        </label>
                      </td> */}
                      <td>
                        <label>
                          Stock
                          <select multiple data-type="stock">
                            {STOCK &&
                              STOCK.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.stock && recipe.stock.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          season
                          <select multiple data-type="season">
                            {SEASON &&
                              SEASON.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.season &&
                                    recipe.season.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          difficulty
                          <select multiple data-type="difficulty">
                            {DIFFICULTY &&
                              DIFFICULTY.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.difficulty &&
                                    recipe.difficulty.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          ingrediencesPrepTime
                          <select multiple data-type="ingrediencesPrepTime">
                            {INGREDIENCES_PREP_TIME &&
                              INGREDIENCES_PREP_TIME.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.ingrediencesPrepTime &&
                                    recipe.ingrediencesPrepTime.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          active cooking time
                          <select multiple data-type="activeCookingTime">
                            {ACTIVE_COOKING_TIME &&
                              ACTIVE_COOKING_TIME.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.activeCookingTime &&
                                    recipe.activeCookingTime.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          total cooking time
                          <select multiple data-type="totalCookingTime">
                            {TOTAL_COOKING_TIME &&
                              TOTAL_COOKING_TIME.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.totalCookingTime &&
                                    recipe.totalCookingTime.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          způsob přípravy
                          <select multiple data-type="process">
                            {PROCESS &&
                              PROCESS.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.process &&
                                    recipe.process.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          serving temp
                          <select multiple data-type="servingTemp">
                            {SERVING_TEMP &&
                              SERVING_TEMP.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.servingTemp &&
                                    recipe.servingTemp.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          cuisine
                          <select multiple data-type="cuisine">
                            {CUISINE &&
                              CUISINE.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.cuisine &&
                                    recipe.cuisine.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          cena
                          <select data-type="price">
                            {PRICE &&
                              PRICE.map((item) => (
                                <option
                                  value={item}
                                  selected={
                                    recipe.price && recipe.price.includes(item)
                                  }>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                    </tr>
                  ))
              : "-"}
          </table>
        </form>
      )}
    </>
  );
};

export default RecipeTable;

import React from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Link } from "gatsby";
import BookCoverFallback from "./BookCoverFallback";
import Heading from "./Heading";
import CloudinaryImage from "./CloudinaryImage";

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
    $ingredientsPrepTime: [String]
    $prepTime: [String]
    $cookingTime: [String]
    $process: [String]
    $servingTemp: [String]
    $cuisine: [String]
    $price: String
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
      ingredientsPrepTime: $ingredientsPrepTime
      prepTime: $prepTime
      cookingTime: $cookingTime
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
      ingredientsPrepTime
      prepTime
      cookingTime
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
      ingredientsPrepTime
      prepTime
      cookingTime
      process
      servingTemp
      cuisine
      price
    }
  }
`;

const TYPES = [
  "nevím",
  "snídaně a svačiny",
  "polévky a vývary",
  "obědy a večeře",
  "omáčky a dresinky",
  "přílohy",
  "saláty",
  "předkrmy a chuťovky",
  "pomazánky",
  "přísady a zavařeniny",
  "dezerty, dorty, zákusky a koláče",
  "pití",
];

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
              <th>mainIngredience</th>
              <th>ingrediences</th>
              <th>stock</th>
              <th>season</th>
              <th>difficulty</th>
              <th>ingredientsPrepTime</th>
              <th>prepTime</th>
              <th>cookingTime</th>
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
                          <select
                            name="cars"
                            id="cars"
                            multiple
                            data-type="type">
                            {TYPES &&
                              TYPES.map((item) => (
                                <option
                                  value={item}
                                  selected={recipe.type.includes(item)}>
                                  {item}
                                </option>
                              ))}
                          </select>
                        </label>
                      </td>
                      <td>
                        <label>
                          categories
                          <input
                            type="text"
                            defaultValue={recipe.categories}
                            data-type="categories"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          taste
                          <input
                            type="text"
                            defaultValue={recipe.taste}
                            data-type="taste"
                          />
                        </label>
                      </td>
                      <td>
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
                      </td>
                      <td>
                        <label>
                          stock
                          <input
                            type="text"
                            defaultValue={recipe.stock}
                            data-type="stock"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          season
                          <input
                            type="text"
                            defaultValue={recipe.season}
                            data-type="season"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          difficulty
                          <input
                            type="text"
                            defaultValue={recipe.difficulty}
                            data-type="difficulty"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          ingredientsPrepTime
                          <input
                            type="text"
                            defaultValue={recipe.ingredientsPrepTime}
                            data-type="ingredientsPrepTime"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          prepTime
                          <input
                            type="text"
                            defaultValue={recipe.prepTime}
                            data-type="prepTime"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          cookingTime
                          <input
                            type="text"
                            defaultValue={recipe.cookingTime}
                            data-type="cookingTime"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          process
                          <input
                            type="text"
                            defaultValue={recipe.process}
                            data-type="process"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          servingTemp
                          <input
                            type="text"
                            defaultValue={recipe.servingTemp}
                            data-type="servingTemp"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          cuisine
                          <input
                            type="text"
                            defaultValue={recipe.cuisine}
                            data-type="cuisine"
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          price
                          <input
                            type="text"
                            defaultValue={recipe.price}
                            data-type="price"
                          />
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

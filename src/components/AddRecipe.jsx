import React, { useContext, useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatISO } from "date-fns";
import { IdentityContext } from "../../identity-context";
import RecipeThumbnail from "./RecipeThumbnail";
import Heading from "./Heading";
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

const ADD_RECIPE = gql`
  mutation AddRecipe(
    $title: String!
    $subtitle: String
    $sourceUrl: String
    $sourceName: String
    $slug: String
    $cover: String
    $content: String
    $dateAdded: String!
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
    addRecipe(
      title: $title
      subtitle: $subtitle
      sourceUrl: $sourceUrl
      sourceName: $sourceName
      slug: $slug
      cover: $cover
      content: $content
      dateAdded: $dateAdded
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

const AddRecipe = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const titleRef = useRef();
  const sourceUrlRef = useRef();
  const sourceNameRef = useRef();
  const subtitleRef = useRef();
  const contentRef = useRef();
  const wishlistRef = useRef();
  const queueRef = useRef();
  const favoriteRef = useRef();
  const typeRef = useRef();
  const categoriesRef = useRef();
  const tasteRef = useRef();
  // const mainIngredienceRef = useRef();
  // const ingrediencesRef = useRef();
  const stockRef = useRef();
  const seasonRef = useRef();
  const difficultyRef = useRef();
  const ingrediencesPrepTimeRef = useRef();
  const activeCookingTimeRef = useRef();
  const totalCookingTimeRef = useRef();
  const processRef = useRef();
  const servingTempRef = useRef();
  const cuisineRef = useRef();
  const priceRef = useRef();

  const [addRecipe] = useMutation(ADD_RECIPE);
  const { loading, error, data, refetch } = useQuery(GET_RECIPES, {
    fetchPolicy: "no-cache",
  });

  const slugify = (input) =>
    input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ +/g, "-");

  return (
    <div className="container">
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
      <a href="/app/">Výpis receptů</a>
      <form
        method="post"
        encType="multipart/form-data"
        className="input-form"
        onSubmit={async (e) => {
          e.preventDefault();

          const url = `https://api.cloudinary.com/v1_1/cookbookjenahajek/upload`;

          const { files } = document.querySelector("[type=file]");
          const formData = new FormData();

          const file = files[0];
          formData.append("file", file);
          formData.append("upload_preset", "upload_from_browser");
          formData.append("public_id", `${slugify(titleRef.current.value)}`);

          async function getCoverImageUrl() {
            const response = await fetch(url, {
              method: "POST",
              body: formData,
            });

            const responseObject = await response.json();
            return responseObject.public_id;
          }

          const coverUrl = await getCoverImageUrl();

          const typeValues = [...typeRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const categoriesValues = [...categoriesRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const tasteValues = [...tasteRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const stockValues = [...stockRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const seasonValues = [...seasonRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const difficultyValues = [...difficultyRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const ingrediencesPrepTimeValues = [
            ...ingrediencesPrepTimeRef.current.options,
          ]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const activeCookingTimeValues = [
            ...activeCookingTimeRef.current.options,
          ]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const totalCookingTimeValues = [
            ...totalCookingTimeRef.current.options,
          ]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const processValues = [...processRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const servingTempValues = [...servingTempRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const cuisineValues = [...cuisineRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          const priceValues = [...priceRef.current.options]
            .filter((x) => x.selected)
            .map((x) => x.value);

          await addRecipe({
            variables: {
              title: titleRef.current.value,
              subtitle: subtitleRef.current.value,
              sourceUrl: sourceUrlRef.current.value,
              sourceName: sourceNameRef.current.value,
              slug: slugify(titleRef.current.value),
              cover: coverUrl,
              content: contentRef.current.value,
              wishlist: wishlistRef.current.checked,
              queue: queueRef.current.checked,
              favorite: favoriteRef.current.checked,
              type: typeValues,
              categories: categoriesValues,
              taste: tasteValues,
              stock: stockValues,
              season: seasonValues,
              difficulty: difficultyValues,
              ingrediencesPrepTime: ingrediencesPrepTimeValues,
              activeCookingTime: activeCookingTimeValues,
              totalCookingTime: totalCookingTimeValues,
              process: processValues,
              servingTemp: servingTempValues,
              cuisine: cuisineValues,
              price: priceValues,
              dateAdded: formatISO(new Date()),
            },
          });
          e.target.reset();
          await refetch();
        }}>
        <div className="input">
          <label className="label" htmlFor="name">
            <span className="label__text">Název jídla</span>
          </label>
          <input
            type="text"
            required
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
            ref={sourceUrlRef}
            id="source-url"
            name="source-url"
            placeholder="https://www.kucharkaprodceru.cz/gratinovane-brambory/"
            aria-describedby="description-source-url"
            noValidate
          />
        </div>

        <div className="input">
          <label className="label" htmlFor="source-name">
            <span className="label__text">Jméno zdroje</span>
          </label>
          <span id="description-source-name" className="label-description">
            Jméno pro hezčí odkazy
          </span>
          <input
            type="text"
            className="input__field"
            ref={sourceNameRef}
            id="source-name"
            name="source-name"
            placeholder="Kuchařka pro dceru"
            aria-describedby="description-source-name"
            noValidate
          />
        </div>

        <div>
          <button type="submit" className="btn">
            Uložit recept
          </button>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="subtitle">
            <span className="label__text">Podnadpis</span>
          </label>
          <span id="description-subtitle" className="label-description">
            Krátce popiš, o co se jedná, hlavně pokud to není jasné z názvu.
            Podnadpis se zobrazuje ve výpisech.
          </span>
          <input
            type="text"
            className="input__field"
            id="subtitle"
            name="subtitle"
            ref={subtitleRef}
            placeholder="Finská lososová polévka"
            aria-describedby="description-subtitle"
          />
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="wishlist">
            <span className="label__text">Vyzkoušené</span>
          </label>
          <span id="description-wishlist" className="label-description">
            Už jsme to někdy zkusili připravit?
          </span>
          <input
            type="checkbox"
            className="input__field"
            id="wishlist"
            name="wishlist"
            ref={wishlistRef}
            aria-describedby="description-wishlist"
          />
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="queue">
            <span className="label__text">Ve frontě</span>
          </label>
          <span id="description-queue" className="label-description">
            Označ recepty, které se chystáš dělat v blízké budoucnosti
          </span>
          <input
            type="checkbox"
            className="input__field"
            id="queue"
            name="queue"
            ref={queueRef}
            aria-describedby="description-queue"
          />
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="favorite">
            <span className="label__text">Oblíbené</span>
          </label>
          <span id="description-favorite" className="label-description">
            Připravujeme to často a přesto se neomrzí?
          </span>
          <input
            type="checkbox"
            className="input__field"
            id="favorite"
            name="favorite"
            ref={favoriteRef}
            aria-describedby="description-favorite"
          />
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="content">
            <span className="label__text">Obsah</span>
          </label>
          <span id="description-content" className="label-description">
            Krátce popiš, o co se jedná, hlavně pokud to není jasné z názvu.
            Podnadpis se zobrazuje ve výpisech.
          </span>
          <textarea
            type="text"
            className="input__field"
            id="content"
            name="content"
            ref={contentRef}
            aria-describedby="description-content"
          />
        </div>
        <br />
        <input type="file" name="files[]" multiple id="cover-upload" />

        <br />
        <div className="input">
          <label className="label" htmlFor="type">
            <span className="label__text">Typ pokrmu</span>
          </label>
          <select
            ref={typeRef}
            className="input__field"
            id="type"
            name="type"
            multiple>
            {TYPES.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="categories">
            <span className="label__text">Kategorie (štítky?)</span>
          </label>
          <select
            ref={categoriesRef}
            className="input__field"
            id="categories"
            name="categories"
            multiple>
            {CATEGORIES.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="taste">
            <span className="label__text">Chuť</span>
          </label>
          <select
            ref={tasteRef}
            className="input__field"
            id="taste"
            name="taste"
            multiple>
            {TASTE.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="stock">
            <span className="label__text">Stock</span>
          </label>
          <select
            ref={stockRef}
            className="input__field"
            id="stock"
            name="stock"
            multiple>
            {STOCK.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="season">
            <span className="label__text">Sezóna</span>
          </label>
          <select
            ref={seasonRef}
            className="input__field"
            id="season"
            name="season"
            multiple>
            {SEASON.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="difficulty">
            <span className="label__text">Obtížnost</span>
          </label>
          <select
            ref={difficultyRef}
            className="input__field"
            id="difficulty"
            name="difficulty"
            multiple>
            {DIFFICULTY.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="ingrediencesPrepTime">
            <span className="label__text">Příprava před vařením</span>
          </label>
          <select
            ref={ingrediencesPrepTimeRef}
            className="input__field"
            id="ingrediencesPrepTime"
            name="ingrediencesPrepTime"
            multiple>
            {INGREDIENCES_PREP_TIME.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="activeCookingTime">
            <span className="label__text">Aktivní čas vaření</span>
          </label>
          <select
            ref={activeCookingTimeRef}
            className="input__field"
            id="activeCookingTime"
            name="activeCookingTime"
            multiple>
            {ACTIVE_COOKING_TIME.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="totalCookingTime">
            <span className="label__text">Celkový čas přípravy</span>
          </label>
          <select
            ref={totalCookingTimeRef}
            className="input__field"
            id="totalCookingTime"
            name="totalCookingTime"
            multiple>
            {TOTAL_COOKING_TIME.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="process">
            <span className="label__text">Způsob přípravy</span>
          </label>
          <select
            ref={processRef}
            className="input__field"
            id="process"
            name="process"
            multiple>
            {PROCESS.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="servingTemp">
            <span className="label__text">Teplota při podávání</span>
          </label>
          <select
            ref={servingTempRef}
            className="input__field"
            id="servingTemp"
            name="servingTemp"
            multiple>
            {SERVING_TEMP.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="cuisine">
            <span className="label__text">Kuchyně</span>
          </label>
          <select
            ref={cuisineRef}
            className="input__field"
            id="cuisine"
            name="cuisine"
            multiple>
            {CUISINE.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <br />
        <div className="input">
          <label className="label" htmlFor="price">
            <span className="label__text">Cena</span>
          </label>
          <select
            ref={priceRef}
            className="input__field"
            id="price"
            name="price"
            multiple>
            {PRICE.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <button type="submit" className="btn">
            Uložit recept
          </button>
        </div>
      </form>
      <div>
        {loading ? <div>loading...</div> : null}
        {error ? <div>error: {error.message}</div> : null}
        <Heading level="2" className="layout-group__subtitle">
          Posledně přidané
        </Heading>
        <div className="category__wrapper">
          <div className="category__group">
            <div className="category__items">
              {!loading &&
                !error &&
                data.recipes.slice(-3).map((recipe) => (
                  <div key={recipe.id}>
                    <RecipeThumbnail recipe={recipe} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipe;

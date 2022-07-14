import React, { useContext, useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { formatISO } from "date-fns";
import { IdentityContext } from "../../identity-context";
import RecipeThumbnail from "./RecipeThumbnail";
import Heading from "./Heading";

const ADD_RECIPE = gql`
  mutation AddRecipe(
    $title: String!
    $subtitle: String
    $url: String
    $slug: String
    $cover: String
    $content: String
    $dateAdded: String!
    $wishlist: Boolean
    $queue: Boolean
    $favorite: Boolean
  ) {
    addRecipe(
      title: $title
      subtitle: $subtitle
      url: $url
      slug: $slug
      cover: $cover
      content: $content
      dateAdded: $dateAdded
      wishlist: $wishlist
      queue: $queue
      favorite: $favorite
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
      url
      slug
      cover
      content
      wishlist
      queue
      favorite
    }
  }
`;

const AddRecipe = () => {
  const { user, identity: netlifyIdentity } = useContext(IdentityContext);
  const titleRef = useRef();
  const urlRef = useRef();
  const subtitleRef = useRef();
  const contentRef = useRef();
  const wishlistRef = useRef();
  const queueRef = useRef();
  const favoriteRef = useRef();

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

          async function getCoverImageUrl() {
            const response = await fetch(url, {
              method: "POST",
              body: formData,
            });

            const responseObject = await response.json();
            return responseObject.public_id;
          }

          const coverUrl = await getCoverImageUrl();

          await addRecipe({
            variables: {
              title: titleRef.current.value,
              subtitle: subtitleRef.current.value,
              url: urlRef.current.value,
              slug: slugify(titleRef.current.value),
              cover: coverUrl,
              content: contentRef.current.value,
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
        {/* <div class="input">
					<label class="label" for="source-name">
						<span class="label__text">Název zdroje</span>
					</label>
					<input type="text" class="input__field" id="source-name" name="source-name" placeholder="Kuchařka pro dceru" />
				</div> */}

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

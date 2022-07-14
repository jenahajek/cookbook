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

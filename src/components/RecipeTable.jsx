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
    $url: String
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
      url: $url
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
      url
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
              const coverUrl =
                row.querySelector("td:nth-child(2) input").value || null;

              await updateRecipe({
                variables: {
                  id: row.id,
                  title: row.querySelector("td:nth-child(5) input").value,
                  subtitle: row.querySelector("td:nth-child(6) input").value,
                  url: row.querySelector("td:nth-child(4) input").value,
                  slug: row.querySelector("td:nth-child(3) input").value,
                  cover: coverUrl,
                  wishlist: row.querySelector("td:nth-child(7) input").value,
                  queue: row.querySelector("td:nth-child(8) input").value,
                  favorite: row.querySelector("td:nth-child(9) input").value,
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
              <th>url zdroj</th>
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
                          <input type="text" defaultValue={recipe.cover} />
                        </label>
                      </td>
                      <td>
                        <label>
                          slug
                          <input type="text" defaultValue={recipe.slug} />
                        </label>
                      </td>
                      <td>
                        <label>
                          url
                          <input type="text" defaultValue={recipe.url} />
                        </label>
                      </td>
                      <td>
                        <label>
                          title
                          <input type="text" defaultValue={recipe.title} />
                        </label>
                      </td>
                      <td>
                        <label>
                          subtitle
                          <input type="text" defaultValue={recipe.subtitle} />
                        </label>
                      </td>
                      <td>
                        <label>
                          wishlist
                          <input
                            type="checkbox"
                            defaultValue={recipe.wishlist}
                          />
                        </label>
                      </td>
                      <td>
                        <label>
                          queue
                          <input type="checkbox" defaultValue={recipe.queue} />
                        </label>
                      </td>
                      <td>
                        <label>
                          favorite
                          <input
                            type="checkbox"
                            defaultValue={recipe.favorite}
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

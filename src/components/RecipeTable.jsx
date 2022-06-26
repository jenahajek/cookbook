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
  ) {
    updateRecipe(
      id: $id
      title: $title
      subtitle: $subtitle
      url: $url
      slug: $slug
      cover: $cover
      content: $content
    ) {
      title
      subtitle
      url
      slug
      cover
      content
    }
  }
`;

const RecipeTable = ({ recipes }) => {
  const [updateRecipe] = useMutation(UPDATE_RECIPE);

  return (
    <form
      method="post"
      onSubmit={async (e) => {
        e.preventDefault();

        // const url = `https://api.cloudinary.com/v1_1/cookbookjenahajek/upload`;

        // const { files } = document.querySelector("[type=file]");
        // const formData = new FormData();

        // const file = files[0];
        // formData.append("file", file);
        // formData.append("upload_preset", "upload_from_browser");

        // async function getCoverImageUrl() {
        //   const response = await fetch(url, {
        //     method: "POST",
        //     body: formData,
        //   });

        //   const responseObject = await response.json();
        //   return responseObject.public_id;
        // }

        // const coverUrl = await getCoverImageUrl();

        // console.log(coverUrl);

        await updateRecipe({
          variables: {
            //   title: titleRef.current.value,
            //   subtitle: subtitleRef.current.value,
            //   url: urlRef.current.value,
            //   slug: slugify(titleRef.current.value),
            id: 335377518750073030,
            title: "ENDLICH!",
            // cover: coverUrl,
            //   content: contentRef.current.value,
          },
        });

        e.target.reset();
        // await refetch();
      }}>
      <button type="submit" className="btn">
        Uložit recept
      </button>
      <table className="recipe-table">
        <tr>
          <th>ID</th>
          <th>cover</th>
          <th>cover url</th>
          <th>slug</th>
          <th>url zdroj</th>
          <th>title</th>
          <th>subtitle</th>
          <th>content</th>
        </tr>
        {recipes
          ? recipes.map((recipe) => (
              <tr className="">
                <td>{recipe.id}</td>
                {/* <Link to={recipe.slug} key={recipe.title}> */}
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
                      id={`cover-${recipe.slug}`}
                    />
                  )}
                </td>
                {/* </Link> */}
                <td>{recipe.cover}</td>
                <td>{recipe.slug}</td>
                <td>{recipe.url}</td>
                <td>{recipe.title}</td>
                <td>{recipe.subtitle}</td>
                <td>{recipe.content}</td>
              </tr>
            ))
          : "-"}
      </table>

      <button type="submit" className="btn">
        Uložit recept
      </button>
    </form>
  );
};

export default RecipeTable;

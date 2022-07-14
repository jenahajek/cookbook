//  PROBLEM tkvi v predavani contextu a useru do graphql.
// nevim, jak to debuggovat, mozna zkusit nahradit uri za loaklni?

// import { useContext } from "react";
// import { IdentityContext } from "../../identity-context";

const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");

// const { user } = useContext(IdentityContext);

const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA,
  domain: "db.eu.fauna.com", // Adjust if you are using Region Groups
});

// construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    recipes: [Recipe]!
  }
  type Recipe {
    id: ID!
    title: String!
    subtitle: String
    sourceUrl: String
    sourceName: String
    slug: String
    cover: String
    content: String
    owner: String!
    dateAdded: String!
    wishlist: Boolean
    queue: Boolean
    favorite: Boolean
    type: [String]
    categories: [String]
    taste: [String]
    mainIngredience: [String]
    ingrediences: [String]
    stock: [String]
    season: [String]
    difficulty: [String]
    ingredientsPrepTime: [String]
    prepTime: [String]
    cookingTime: [String]
    process: [String]
    servingTemp: [String]
    cuisine: [String]
    price: String
  }
  type Mutation {
    addRecipe(
      title: String!
      subtitle: String
      sourceUrl: String
      sourceName: String
      slug: String
      cover: String
      content: String
      dateAdded: String!
      wishlist: Boolean
      queue: Boolean
      favorite: Boolean
      type: [String]
      categories: [String]
      taste: [String]
      mainIngredience: [String]
      ingrediences: [String]
      stock: [String]
      season: [String]
      difficulty: [String]
      ingredientsPrepTime: [String]
      prepTime: [String]
      cookingTime: [String]
      process: [String]
      servingTemp: [String]
      cuisine: [String]
      price: String
    ): Recipe
    updateRecipe(
      id: ID!
      title: String
      subtitle: String
      sourceUrl: String
      sourceName: String
      slug: String
      cover: String
      content: String
      wishlist: Boolean
      queue: Boolean
      favorite: Boolean
      type: [String]
      categories: [String]
      taste: [String]
      mainIngredience: [String]
      ingrediences: [String]
      stock: [String]
      season: [String]
      difficulty: [String]
      ingredientsPrepTime: [String]
      prepTime: [String]
      cookingTime: [String]
      process: [String]
      servingTemp: [String]
      cuisine: [String]
      price: String
    ): Recipe
  }
`;
// to mutation types i should add code of the response, success field and a message

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    recipes: async (parent, args, { user = "public" }) => {
      // if (!user) {
      //   return "public";
      // }
      const results = await client.query(
        q.Paginate(q.Match(q.Index("recipes_by_user_updated"), user))
      );
      // todo error handling
      return results.data.map(
        ([
          ref,
          title,
          subtitle,
          sourceUrl,
          sourceName,
          slug,
          cover,
          content,
          dateAdded,
          wishlist,
          queue,
          favorite,
          type,
          categories,
          taste,
          mainIngredience,
          ingrediences,
          stock,
          season,
          difficulty,
          ingredientsPrepTime,
          prepTime,
          cookingTime,
          process,
          servingTemp,
          cuisine,
          price,
        ]) => ({
          id: ref.id,
          title,
          subtitle,
          sourceUrl,
          sourceName,
          slug,
          cover,
          content,
          dateAdded,
          wishlist,
          queue,
          favorite,
          type,
          categories,
          taste,
          mainIngredience,
          ingrediences,
          stock,
          season,
          difficulty,
          ingredientsPrepTime,
          prepTime,
          cookingTime,
          process,
          servingTemp,
          cuisine,
          price,
        })
      );
    },
  },
  Mutation: {
    addRecipe: async (
      _,
      {
        title,
        subtitle,
        sourceUrl,
        sourceName,
        slug,
        cover,
        content,
        dateAdded,
        wishlist,
        queue,
        favorite,
        type,
        categories,
        taste,
        mainIngredience,
        ingrediences,
        stock,
        season,
        difficulty,
        ingredientsPrepTime,
        prepTime,
        cookingTime,
        process,
        servingTemp,
        cuisine,
        price,
      },
      { user = "public" }
    ) => {
      // if (!user) {
      //   // throw new Error("User needs to be logged in");
      // }
      const results = await client.query(
        q.Create(q.Collection("recipes"), {
          data: {
            title,
            subtitle,
            sourceUrl,
            sourceName,
            slug,
            cover,
            content,
            dateAdded,
            wishlist,
            queue,
            favorite,
            type,
            categories,
            taste,
            mainIngredience,
            ingrediences,
            stock,
            season,
            difficulty,
            ingredientsPrepTime,
            prepTime,
            cookingTime,
            process,
            servingTemp,
            cuisine,
            price,
            owner: user,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
    updateRecipe: async (
      _,
      {
        id,
        title,
        subtitle,
        sourceUrl,
        sourceName,
        slug,
        cover,
        content,
        wishlist,
        queue,
        favorite,
        type,
        categories,
        taste,
        mainIngredience,
        ingrediences,
        stock,
        season,
        difficulty,
        ingredientsPrepTime,
        prepTime,
        cookingTime,
        process,
        servingTemp,
        cuisine,
        price,
      },
      { user = "public" }
    ) => {
      // if (!user) {
      //   throw new Error("User needs to be logged in");
      // }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("recipes"), id), {
          data: {
            title,
            subtitle,
            sourceUrl,
            sourceName,
            slug,
            cover,
            content,
            wishlist,
            queue,
            favorite,
            type,
            categories,
            taste,
            mainIngredience,
            ingrediences,
            stock,
            season,
            difficulty,
            ingredientsPrepTime,
            prepTime,
            cookingTime,
            process,
            servingTemp,
            cuisine,
            price,
            owner: user,
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) =>
    // if (context.clientContext.user) {
    //   return { user: context.clientContext.user.sub };
    // }
    ({ user: "public" }),
  playground: true,
  introspection: true,
  // csrfPrevention: true,
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

const { ApolloServer, gql } = require("apollo-server-lambda");

// construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    recipes: [Recipe]!
  }
  type Recipe {
    id: ID!
    text: String!
    done: Boolean!
  }
  type Mutation {
    addRecipe(text: String!): Recipe
    updateRecipe(id: ID!): Recipe
  }
`;
// to mutation types i should add code of the response, success field and a message

const recipes = {};
let recipeIndex = 0;
// Provide resolver functions for yoru schema fields
const resolvers = {
  Query: {
    recipes: (parent, args, { user }) => {
      if (!user) {
        return [];
      }
      return Object.values(recipes);
    },
  },
  Mutation: {
    addRecipe: (_, { text }) => {
      recipeIndex++;
      const id = `key-${recipeIndex}`;
      recipes[id] = { id, text, done: false };
      return recipes[id];
    },
    updateRecipe: (_, { id }) => {
      recipes[id].done = true;
      return recipes[id];
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ context }) => {
    if (context.clientContext.user) {
      return { user: context.clientContext.user.sub };
    }
    return {};
  },
  playground: true,
  introspection: true,
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});

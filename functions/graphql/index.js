const { ApolloServer, gql } = require("apollo-server-lambda");
const faunadb = require("faunadb");

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
    text: String!
    done: Boolean!
  }
  type Mutation {
    addRecipe(text: String!): Recipe
    updateRecipe(id: ID!): Recipe
  }
`;
// to mutation types i should add code of the response, success field and a message

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    recipes: async (parent, args, { user }) => {
      console.log("caution", user);
      if (!user) {
        return [];
      }
      const results = await client.query(
        q.Paginate(q.Match(q.Index("recipes_by_user"), user))
      );
      // todo error handling
      return results.data.map(([ref, text, done]) => ({
        id: ref.id,
        text,
        done,
      }));
    },
  },
  Mutation: {
    addRecipe: async (_, { text, user }) => {
      console.log(text, "text", user, "user add");
      // if (!user) {
      //   throw new Error("User needs to be logged in");
      // }
      const results = await client.query(
        q.Create(q.Collection("recipes"), {
          data: {
            text,
            done: "false",
            owner: "user",
          },
        })
      );
      return {
        ...results.data,
        id: results.ref.id,
      };
    },
    updateRecipe: async (_, { id }, { user }) => {
      console.log(user, "user update");
      if (!user) {
        throw new Error("User needs to be logged in");
      }
      const results = await client.query(
        q.Update(q.Ref(q.Collection("recipes"), id), {
          data: {
            done: "true",
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
  context: ({ context }) => {
    console.log(context, "context!");
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

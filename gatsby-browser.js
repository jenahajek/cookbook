/* eslint-disable import/prefer-default-export */
import React from "react";
import wrapWithProvider from "./wrap-with-provider";
import "./src/styles/global.scss";

const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require("@apollo/client");

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "https://kucharka.jenahajek.com/.netlify/functions/graphql",
  }),
});

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    {wrapWithProvider({ element })}
  </ApolloProvider>
);

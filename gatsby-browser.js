/* eslint-disable import/prefer-default-export */
import React from "react";
import wrapWithProvider from "./wrap-with-provider";
import "./src/styles/global.scss";

const { setContext } = require('apollo-link-context');
const netlifyIdentity = require('netlify-identity-widget');

const {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
} = require("@apollo/client");

const authLink = sedtContext((_, {headers})=>{
  const user = netlifyIdentity.currentUser();
  const token = user.token.access_token;

  return {
    headers: {
      ...headers,
      Autorization: token ? `Bearer ${token}`:"";
    }};});

const httpLink = new HttpLink({
  uri: "https://kucharka.jenahajek.com/.netlify/functions/graphql",
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
});

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    {wrapWithProvider({ element })}
  </ApolloProvider>
);

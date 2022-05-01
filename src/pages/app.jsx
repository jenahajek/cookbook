import React, { useContext } from "react";
import { Router } from "@reach/router";
import { IdentityContext } from "../../identity-context";

const Dash = () => {
  const { user } = useContext(IdentityContext);

  return <div>Dash {user && user.user_metadata.full_name}</div>;
};

const App = (props) => (
  <Router>
    <Dash path="/app" />
  </Router>
);

export default App;

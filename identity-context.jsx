import React, { useEffect, useState } from "react";

const netlifyIdentity = require("netlify-identity-widget");

export const IdentityContext = React.createContext({});

const Provider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    netlifyIdentity.init({});
  });

  netlifyIdentity.on("login", (user) => {
    netlifyIdentity.close();
    setUser(user);
  });

  netlifyIdentity.on("logout", () => {
    netlifyIdentity.close();
    setUser();
  });

  return (
    <IdentityContext.Provider value={{ identity: netlifyIdentity, user }}>
      {children}
    </IdentityContext.Provider>
  );
};

export default Provider;

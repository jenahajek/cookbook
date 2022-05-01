import React from "react";
import { Provider } from "react-redux";
import store from "./src/redux/store/store";
import IdentityProvider from "./identity-context";

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => (
  // Instantiating store in `wrapRootElement` handler ensures:
  //  - there is fresh store for each SSR page
  //  - it will be called only once in browser, when React mounts
  <IdentityProvider>
    <Provider store={store}>{element}</Provider>
  </IdentityProvider>
);

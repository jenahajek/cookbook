import React from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import config from "../../data/SiteConfig";
import useFilter from "../hooks/useFilter";

export default function MainLayout({ children }) {
  const allStates = useSelector((state) => state);

  return (
    <div
      className={`layout-container ${
        allStates.filterVisibility ? "filter-open" : ""
      }`}>
      <Helmet>
        <meta name="description" content={config.siteDescription} />
        <html lang="cs" />
      </Helmet>
      <SiteNav />
      {children}

      <SiteFooter />
    </div>
  );
}

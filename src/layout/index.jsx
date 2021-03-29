import React from "react";
import { Helmet } from "react-helmet";
import SiteNav from "../components/SiteNav";
import config from "../../data/SiteConfig";
import "./index.css";

export default function MainLayout({ children }) {
  return (
    <>
      <Helmet>
        <meta name="description" content={config.siteDescription} />
        <html lang="cs" />
      </Helmet>
      <SiteNav />
      {children}
    </>
  );
}

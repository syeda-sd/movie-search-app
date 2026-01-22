import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./styles/Home.css";  

const isGitHub = window.location.hostname.includes("github.io");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter basename={isGitHub ? "/movie-search-app" : "/"}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

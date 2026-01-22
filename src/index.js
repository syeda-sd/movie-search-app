import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import "./styles/Home.css";  // Tumhara CSS

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* HashRouter makes GitHub Pages routing safe */}
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

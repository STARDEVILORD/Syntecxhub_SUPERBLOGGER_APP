import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("findDOMNode")) {
    return; 
  }
  originalError(...args);
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

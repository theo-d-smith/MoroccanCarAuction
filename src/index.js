import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // if you have global styles / tailwind already loaded in index.html

const root = createRoot(document.getElementById("root"));
root.render(<App />);

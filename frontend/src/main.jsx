import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AnalyzerPage } from "./pages/AnalyzerPage";

// import App from './App.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AnalyzerPage></AnalyzerPage>
  </StrictMode>,
);

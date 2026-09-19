import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AnalysisHistoryProvider } from "./context/AnalysisHistory";
import "./styles/global.css";
import "./styles/components.css";
import "./styles/dashboard.css";
import "./styles/analysis.css";
import "./styles/about.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnalysisHistoryProvider>
        <App />
      </AnalysisHistoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import React from "react";
// import Router
import { BrowserRouter } from "react-router-dom";
// import component "Provider"
import { Provider } from "react-redux";

import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.scss";
import { ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>

      {/* utilisation du Router sur notre appli */}
      <BrowserRouter>

        <Provider store={store}>
          <App />
        </Provider>
        
      </BrowserRouter>
    
    </ThemeProvider>
  </>
);
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "./fonts/ANGSA.ttf";
import "./fonts/angsab.ttf";
import "./fonts/CORDIA.ttf";
import "./fonts/cordiaub.ttf";
import "./fonts/CordiaNewBold.ttf";
import "./fonts/angsab.ttf"
import "./fonts/Arial-bold.ttf"
// import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter basename={"/report/discharge"}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,

  document.getElementById("root")
);

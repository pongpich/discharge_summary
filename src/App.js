import "./App.css";
import React from "react";
import Report from "./Component/report";
import { Routes, Route, Navigate } from "react-router-dom";
import Notfound from "./Component/404Notfound";
import { Buffer } from "buffer";

global.Buffer = Buffer;
class App extends React.Component {
  render() {
    return (
      <>
        <Routes>
          <Route
            path="/ocmnum/:ocmnum/user/:user"
            element={<Report />}
          />
          <Route path="/" element={<Navigate to="/report/ocmnum/" />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </>
    );
  }
}

export default App;
// render(<App />, document.getElementById("root"));

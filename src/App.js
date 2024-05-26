import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Grommet } from "grommet";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [token, setToken] = useState("");

  return (
    <Grommet>
      <Router>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Grommet>
  );
};

export default App;

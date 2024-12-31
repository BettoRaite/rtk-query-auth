import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { PrivateRoute } from "@/lib/helpers/PrivateRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route index path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;

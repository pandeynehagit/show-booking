import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Pages/Home";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Provider } from "react-redux";
import ProtectedRoute from "./Components/ProtectedRoute";
import Admin from "./Pages/Admin";
import store from "./redux/Store";
import Partner from "./Pages/Partner";
import Profile from "./Pages/User";
import SingleMovie from "./Pages/Home/SingleMovie";
import Forgot from "./Pages/User/Forgot";
import { useEffect } from "react";
import BookShow from "./Components/BookShow";
import Reset from "./Pages/User/Reset"

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter>
         
          <Routes>
          
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
             <Route path="/Forgot" element={<Forgot />} />
             <Route path="/Reset" element={<Reset/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/partner"
              element={
                <ProtectedRoute>
                  <Partner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/movie/:id" element={<SingleMovie />} />
            <Route
              path="/book-show/:id"
              element={
                <ProtectedRoute>
                  <BookShow/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;

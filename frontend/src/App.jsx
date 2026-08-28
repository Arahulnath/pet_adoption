import React from "react";
import { Routes, Route } from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import StaffLayout from "./components/layout/StaffLayout";
import ProtectedRoute from "./components/routes/ProtectedRoute";

import Home from "./pages/Public/Home";
import PetCatalog from "./pages/Public/PetCatalog";
import PetDetail from "./pages/Public/PetDetail";
import Shelter from "./pages/Public/Shelter";
import Donate from "./pages/Public/Donate";
import NotFound from "./pages/Public/NotFound";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import StaffLogin from "./pages/Auth/StaffLogin";

import Favorites from "./pages/User/Favorites";
import MyRequests from "./pages/User/MyRequests";

import Dashboard from "./pages/Staff/Dashboard";
import PetsList from "./pages/Staff/PetsList";
import RequestsList from "./pages/Staff/RequestsList";
import ShelterSettings from "./pages/Staff/ShelterSettings";

export default function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pets" element={<PetCatalog />} />
        <Route path="/pets/:id" element={<PetDetail />} />
        <Route path="/shelter" element={<Shelter />} />
        <Route path="/donate" element={<Donate />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/staff/login" element={<StaffLogin />} />

        {/* Registered-user-only */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute role="user">
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute role="user">
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Staff console */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pets" element={<PetsList />} />
        <Route path="requests" element={<RequestsList />} />
        <Route path="shelter" element={<ShelterSettings />} />
      </Route>
    </Routes>
  );
}

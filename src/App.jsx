import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginScreen from "./views/Login";
import SignupScreen from "./views/Signup";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "./views/Dashboard/Dashboard";
import RequireAuth from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import ContentListPage from "./views/Dashboard/ContentListPage";
import ContentPage from "./views/Dashboard/ContentPage";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route path="home" element={<Dashboard />} />
          <Route
            path="content"
          >
              <Route path="" element={<ContentListPage />} />
              <Route path=":contentId" element={<ContentPage />} />
          </Route>
          <Route path="settings" element={<h1>Dashboard Settings</h1>} />
          <Route path="profile" element={<h1>Dashboard Profile</h1>} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

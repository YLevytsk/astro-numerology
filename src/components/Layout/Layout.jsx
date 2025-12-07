import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Consultations from "./pages/Consultations";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/consultations"
        element={
          <Layout>
            <Consultations />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
    </Routes>
  );
}


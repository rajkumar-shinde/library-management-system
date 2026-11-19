import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthWatcher from "./components/AuthWatcher";

function App() {
  return (
    <BrowserRouter>
      <AuthWatcher />

      <Navbar />

      <main className="page-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books" element={<Books />} />

          {/* Student Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Add Book */}
          <Route
            path="/admin/add-book"
            element={
              <ProtectedRoute adminOnly>
                <AddBook />
              </ProtectedRoute>
            }
          />

          {/* Edit Book */}
          <Route
            path="/admin/edit-book/:id"
            element={
              <ProtectedRoute adminOnly>
                <EditBook />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminLogin } from './pages/admin/Login';
import { EmployeePortal } from './pages/employee/Portal';
import { AdminRoute } from './components/AdminRoute';
import { ToastContainer } from './components/ui/feedback';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<EmployeePortal />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
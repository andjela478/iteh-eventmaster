import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import EventDetails from './pages/EventDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events/:id" element={<EventDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

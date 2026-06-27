import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Button from './Button';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to={isAuthenticated ? "/home" : "/"} className="navbar-brand">
          EventMaster
        </Link>

        <div className="d-flex align-items-center gap-3">
          {isAuthenticated && (
            <Link to="/home" className="text-white text-decoration-none">
              Događaji
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="text-white">
                Zdravo, {user?.name} ({user?.role})
              </span>
              <Button text="Odjavi se" onClick={handleLogout} variant="secondary" />
            </>
          ) : (
            <Link to="/">
              <Button text="Prijavi se" variant="secondary" />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

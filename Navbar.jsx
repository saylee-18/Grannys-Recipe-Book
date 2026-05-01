import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiPlus, FiBookmark, FiBook, FiLogOut, FiUser } from 'react-icons/fi';

const categories = [
  { name: 'Desserts', slug: 'desserts', emoji: '🍰' },
  { name: 'Breakfast', slug: 'breakfast', emoji: '🥞' },
  { name: 'Lunch', slug: 'lunch', emoji: '🍲' },
  { name: 'Healthy', slug: 'healthy', emoji: '🥗' },
  { name: 'Fast Food', slug: 'fast food', emoji: '🍔' },
  { name: 'Italian', slug: 'italian', emoji: '🍝' },
  { name: 'Chinese', slug: 'chinese', emoji: '🥡' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🍪</span>
          <span className="brand-text">Granny's Recipe Book</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <div className="nav-dropdown" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="nav-link dropdown-trigger" onClick={() => setCatOpen(!catOpen)}>
              Categories
              <span className={`dropdown-arrow ${catOpen ? 'open' : ''}`}>▾</span>
            </button>
            {catOpen && (
              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="dropdown-item"
                    onClick={() => { setCatOpen(false); setMenuOpen(false); }}
                  >
                    <span>{cat.emoji}</span> {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <>
              <Link to="/add-recipe" className="nav-link" onClick={() => setMenuOpen(false)}>
                <FiPlus /> Add Recipe
              </Link>
              <Link to="/my-recipes" className="nav-link" onClick={() => setMenuOpen(false)}>
                <FiBook /> My Recipes
              </Link>
              <Link to="/saved" className="nav-link" onClick={() => setMenuOpen(false)}>
                <FiBookmark /> Saved
              </Link>
              <div className="nav-user">
                <span className="user-greeting">
                  <FiUser /> {user.username}
                </span>
                <button className="btn-logout" onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn-nav-login" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-register" onClick={() => setMenuOpen(false)}>
                Join Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

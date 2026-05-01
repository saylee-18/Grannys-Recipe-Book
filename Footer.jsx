import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🍪</span>
          <h3>Granny's Recipe Book</h3>
          <p>Preserving family recipes, one dish at a time.</p>
        </div>
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/category/desserts">Desserts</Link>
          <Link to="/category/breakfast">Breakfast</Link>
          <Link to="/category/italian">Italian</Link>
          <Link to="/category/healthy">Healthy</Link>
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/category/lunch">Lunch</Link>
          <Link to="/category/chinese">Chinese</Link>
          <Link to="/category/fast food">Fast Food</Link>
          <Link to="/add-recipe">Add Recipe</Link>
        </div>
        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Join Us</Link>
          <Link to="/saved">Saved Recipes</Link>
          <Link to="/my-recipes">My Recipes</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Made with ❤️ and a pinch of cinnamon — © 2026 Granny's Recipe Book</p>
      </div>
    </footer>
  );
}

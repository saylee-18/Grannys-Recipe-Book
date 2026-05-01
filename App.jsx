import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import EditRecipe from './pages/EditRecipe';
import SavedRecipes from './pages/SavedRecipes';
import MyRecipes from './pages/MyRecipes';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<EditRecipe />} />
          <Route path="/saved" element={<SavedRecipes />} />
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

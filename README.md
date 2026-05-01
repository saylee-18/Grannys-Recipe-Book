# 🍪 Granny's Recipe Book

A full-stack recipe sharing web application where users can browse, create, and interact with family recipes passed down through generations.

## Features

- 🔐 **Authentication** — Register/Login with JWT tokens
- 📖 **10 Default Recipes** — Pre-loaded across categories (desserts, breakfast, lunch, healthy, fast food, Italian, Chinese)
- ➕ **Create Recipes** — Add your own with ingredients, step-by-step instructions, and a secret tip
- ✏️ **Edit/Delete** — Manage your own recipes
- ❤️ **Like** — Show appreciation for great recipes
- 💬 **Comment** — Share your thoughts and tips
- 🔖 **Save/Bookmark** — Build your personal collection
- 🔗 **Share** — Copy recipe links or use native sharing
- 🔍 **Search** — Find recipes by title, description, or category
- 📂 **Browse by Category** — Desserts, Breakfast, Lunch, Healthy, Fast Food, Italian, Chinese

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React 18, Vite, React Router, Axios |
| Backend  | Node.js, Express |
| Database | SQLite (via Sequelize ORM) |
| Auth     | JWT + bcryptjs |

## Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The API will be running at **http://localhost:5000**

### 2. Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at **http://localhost:3000**

### 3. Open the App

Visit **http://localhost:3000** in your browser!

## Project Structure

```
grannys-recipe-book/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Sequelize models (User, Recipe, Comment, Like, Save)
│   ├── routes/           # API routes (auth, recipes, interactions)
│   ├── seeders/          # Default recipe data
│   ├── server.js         # Express server entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, RecipeCard, Footer
│   │   ├── context/      # AuthContext
│   │   ├── pages/        # All page components
│   │   ├── services/     # API service layer
│   │   ├── index.css     # Complete design system
│   │   ├── App.jsx       # Router setup
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Default Recipes

The app comes pre-loaded with 10 recipes:

1. 🥧 Granny's Classic Apple Pie (Desserts)
2. 🥞 Fluffy Buttermilk Pancakes (Breakfast)
3. 🍛 Creamy Chicken Tikka Masala (Lunch)
4. 🥗 Mediterranean Quinoa Bowl (Healthy)
5. 🍝 Nonna's Spaghetti Carbonara (Italian)
6. 🍗 Kung Pao Chicken (Chinese)
7. 🍔 Classic Smash Burger (Fast Food)
8. 🍞 Banana Bread with Walnuts (Desserts)
9. 🥑 Avocado Toast Supreme (Breakfast)
10. 🍪 Double Chocolate Chip Cookies (Desserts)

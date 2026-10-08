# PixelForge AI — Full-Stack AI Image Generator

A modern, production-grade AI Image Generation platform built with **React 19**, **Vite**, **Tailwind CSS**, **Express.js**, **MongoDB / Mongoose**, and a modular **Multi-Provider AI Service Layer**.

![PixelForge AI Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

- 🎨 **Multi-Provider AI Architecture**: Modular service abstraction supporting **Flux.1 Schnell**, **Flux.1 Dev**, **SDXL Turbo**, **Anime Diffusion**, and **OpenAI DALL-E 3 / DALL-E 2**.
- ⚡ **Zero-Barrier Out-of-the-Box Generation**: Includes out-of-the-box real AI image synthesis via Pollinations (Flux, SDXL Turbo, Anime) with zero initial API key friction, plus full support for OpenAI keys.
- 📐 **Dynamic Aspect Ratio & Quality**: Support for 1:1, 16:9 widescreen, 9:16 portrait, 4:3 standard, and 3:4 vertical formats with automatic resolution calculation.
- 💾 **Persistent Image Storage Abstraction**: Automatic download and storage of generated images into permanent local static storage (`/uploads/`) or Cloudinary/S3, eliminating broken temporary URLs.
- 🔐 **Robust JWT Authentication**: Secure signup and login with bcrypt password hashing, token expiration handling, and protected REST routes.
- 🖼️ **Personal Generation Gallery**: Browse history with keyword search, model filtering, full-screen lightbox preview, and one-click downloads with formatted filenames (`pixelforge-concept-YYYY-MM-DD.png`).
- 🗑️ **Permanent Deletion**: Delete records from MongoDB and simultaneously clean up stored image files.
- 🌓 **Complete Dark / Light Mode**: Theme toggle with Framer Motion animations, system-preference detection, and `localStorage` persistence.
- 📱 **100% Responsive Design**: Tailored experiences for mobile (slide-out menu), tablet (2-column layout), and desktop (multi-column gallery).
- 🎲 **Creative Inspiration**: Built-in "Inspire Me" random prompt generator, character counters, and negative prompt controls for models that support it.

---

## 🛠️ Technology Stack

### Frontend
- **React 19** + **Vite 6**
- **Tailwind CSS** (Custom dark palette & glassmorphism)
- **Framer Motion** (Fluid animations, transitions, modals)
- **Lucide React** (Clean modern icon set)
- **Axios** (Centralized instance with JWT interceptors)
- **React Router 7** (Protected routes and navigation)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (With automatic in-memory MongoDB fallback)
- **JWT (jsonwebtoken)** & **bcryptjs**
- **Axios** (Binary stream processing)
- **CORS** & **dotenv**

---

## 📂 Project Structure

```text
ai-image-generator/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Centralized Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive header with theme toggle & user menu
│   │   │   ├── Footer.jsx           # Modern SaaS footer
│   │   │   ├── ProtectedRoute.jsx   # Route guard for authenticated views
│   │   │   ├── ImageModal.jsx       # Lightbox preview modal with download & copy
│   │   │   ├── DeleteConfirmModal.jsx # Confirmation dialog
│   │   │   └── SkeletonCard.jsx     # Shimmer skeleton loader
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication state and tokens
│   │   │   ├── ThemeContext.jsx     # Dark/light theme persistence
│   │   │   └── ToastContext.jsx     # Toast notification system
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page with hero visual & features
│   │   │   ├── Login.jsx            # Sign-in page
│   │   │   ├── Signup.jsx           # Registration page
│   │   │   ├── Generate.jsx         # AI Studio generation interface
│   │   │   ├── History.jsx          # User generation gallery
│   │   │   ├── Profile.jsx          # Account stats and settings
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── imageService.js
│   │   │   └── modelService.js
│   │   ├── App.jsx                  # Main application routing
│   │   ├── index.css                # Tailwind directives & glass styles
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                    # Database connection with in-memory fallback
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, logout, me
│   │   ├── userController.js        # Profile and account updates
│   │   ├── modelController.js       # Models catalog
│   │   └── imageController.js       # Generation, history, delete
│   ├── middleware/
│   │   ├── auth.js                  # JWT validation middleware
│   │   └── errorHandler.js          # Centralized error handler
│   ├── models/
│   │   ├── User.js                  # Mongoose user schema
│   │   └── Generation.js            # Generation metadata & image references
│   ├── public/
│   │   └── uploads/                 # Permanent local image storage
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── modelRoutes.js
│   │   └── imageRoutes.js
│   ├── services/
│   │   ├── imageGeneration/
│   │   │   ├── index.js             # Facade for generation
│   │   │   ├── provider.js          # Base provider & Pollinations/OpenAI implementations
│   │   │   └── models.js            # Central model catalog & capabilities
│   │   └── storage/
│   │       ├── index.js             # Storage facade
│   │       └── provider.js          # Local disk storage & Cloudinary/S3
│   ├── server.js                    # Express server entry point
│   ├── package.json
│   └── .env                         # Server environment variables
│
├── .env.example
├── .gitignore
├── package.json                     # Orchestration scripts (concurrent dev)
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **yarn**
- **MongoDB** (Optional: local MongoDB, MongoDB Atlas URI, or zero-config in-memory fallback)

### 2. Installation

Clone the repository and install all dependencies:

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

Or run the root orchestration script:
```bash
npm run install:all
```

---

## ⚙️ Environment Variables

Create `.env` inside `server/` (or copy from `.env.example`):

```bash
cp .env.example server/.env
```

### Configuration Options:

```env
# Server Port
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Leave empty in development to automatically run the embedded in-memory MongoDB!
# Or provide your MongoDB Atlas or local connection string:
MONGODB_URI=mongodb://localhost:27017/pixelforge_ai

# JWT Authentication Secret
JWT_SECRET=super_secret_jwt_key_pixelforge_2026_change_in_production
JWT_EXPIRES_IN=7d

# AI Provider Configuration
# Supported providers: pollinations, openai, huggingface
AI_PROVIDER=pollinations
AI_API_KEY=

# Optional: If you want to use OpenAI DALL-E 3 models
OPENAI_API_KEY=

# Storage Provider Configuration
# Supported: local (default, stores in server/public/uploads), cloudinary
STORAGE_PROVIDER=local

# Optional Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🏃 Running the Application

### Option A: Run Both Frontend and Backend Concurrently (Recommended)

From the project root:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Static Uploads**: [http://localhost:5000/uploads](http://localhost:5000/uploads)

### Option B: Run Individually

**Terminal 1 — Backend:**
```bash
cd server
npm start
# or for hot reloading:
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

---

## 🤖 AI Models Supported

| Model ID | Model Name | Provider | Quality Tier | Speed | Negative Prompt | Aspect Ratios |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `flux-schnell` | Flux.1 Schnell | Pollinations | High | ~2s | No | 1:1, 16:9, 9:16, 4:3, 3:4 |
| `flux-dev` | Flux.1 Dev | Pollinations | Ultra HD | ~5s | No | 1:1, 16:9, 9:16, 4:3, 3:4 |
| `turbo` | SDXL Turbo | Pollinations | Standard | ~1s | Yes | 1:1, 16:9, 9:16 |
| `anime` | Anime Diffusion | Pollinations | High | ~3s | Yes | 1:1, 16:9, 9:16, 3:4 |
| `dall-e-3` | OpenAI DALL-E 3 | OpenAI | HD | ~8s | No | 1:1, 16:9, 9:16 |
| `dall-e-2` | OpenAI DALL-E 2 | OpenAI | Standard | ~4s | No | 1:1 |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/signup`: Create a new user account.
  - Body: `{ name, email, password, confirmPassword }`
- `POST /api/auth/login`: Authenticate and receive JWT token.
  - Body: `{ email, password }`
- `POST /api/auth/logout`: Log out user.
- `GET /api/auth/me`: Get current authenticated user profile (`Bearer <token>`).

### User Profile (`/api/users`)
- `GET /api/users/me`: Get user profile with total generation counts and favorite models.
- `PUT /api/users/me`: Update display name or change password.

### Models (`/api/models`)
- `GET /api/models`: Fetch all available AI models and their capabilities (aspect ratios, speeds, quality tiers).

### Image Generation (`/api/images`)
- `POST /api/images/generate`: Generate an image with the selected model.
  - Body: `{ prompt, negativePrompt, model, aspectRatio, quality, seed }`
- `GET /api/images`: Retrieve user's generation history with pagination and search.
  - Query: `?page=1&limit=24&model=flux-schnell&q=cyberpunk`
- `GET /api/images/:id`: Retrieve single generation details.
- `DELETE /api/images/:id`: Delete generation record and remove stored image from disk.

---

## 🔒 Security Best Practices Implemented

1. **Passwords**: Hashed with `bcryptjs` and 10 salt rounds before database persistence. Never stored or returned in plaintext.
2. **Tokens**: Signed using secret keys via `jsonwebtoken` with 7-day expiration.
3. **Secrets Isolation**: `AI_API_KEY`, `OPENAI_API_KEY`, and `JWT_SECRET` are strictly kept server-side in `.env` and never leaked to Vite or the browser client.
4. **Input Validation**: Text prompts, email formats, and parameter ranges are sanitized and validated.
5. **Ownership Authorization**: Users can only inspect, view, or delete their own generations.

---

## 🌐 Production Deployment

### Build the Frontend:
```bash
cd client
npm run build
```
This generates the optimized production bundle inside `client/dist`.

### Production Server:
Configure `NODE_ENV=production` and your MongoDB Atlas connection string in `server/.env`. You can serve `client/dist` directly through Express or host the client on Vercel/Netlify while hosting the Node.js API on Render, Railway, or AWS.

---

## 📄 License
This project is licensed under the MIT License.


# EngComic - E-Learning Platform 🚀

> Nền tảng học tiếng Anh sáng tạo kết hợp truyện tranh, gamification và AI-powered learning

[![React](https://img.shields.io/badge/React-17.0.2-blue.svg)](https://reactjs.org/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-1.7.2-purple.svg)](https://redux-toolkit.js.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.6.8-orange.svg)](https://firebase.google.com/)

## 🎯 Highlights

**EngComic** là một full-stack web application độc đáo, biến việc học tiếng Anh thành trải nghiệm giải trí tương tác thông qua truyện tranh và game mechanics.

### 💡 Điểm nổi bật

- **🎮 Gamification System** - Gacha mechanics, deck building, và fighting game với sprite animation
- **📚 Content Management** - CMS hoàn chỉnh với CKEditor, upload hình ảnh qua Firebase Storage
- **🔐 JWT Authentication** - Bảo mật với access/refresh token và auto-renewal
- **🌐 Internationalization** - Hỗ trợ đa ngôn ngữ (vi/en) với Redux i18n
- **📊 Real-time Analytics** - XP system, streak tracking, leaderboard và user statistics
- **🎨 Modern UI/UX** - Responsive design với GSAP animations, Lottie effects, và Tailwind CSS
- **⚡ Performance Optimized** - Code splitting, lazy loading, và Redux Persist

## 🛠️ Tech Stack

**Frontend Architecture:**

- React 17 + React Router 6 (SPA with dynamic routing)
- Redux Toolkit + Redux Persist (centralized state management)
- SCSS/Sass + Tailwind CSS (modular styling system)

**Advanced Features:**

- GSAP + Lottie (complex animations & micro-interactions)
- Firebase Storage (cloud file management)
- Axios Interceptors (JWT refresh & error handling)
- Canvas API + HTML2Canvas (screenshot & image generation)
- Swiper.js (touch-enabled carousels)

**Development:**

- CKEditor5 (WYSIWYG content editor)
- React Toastify (notification system)
- date-fns (date utilities)
- Lodash (functional programming utilities)

## 🚀 Quick Start

```bash
# Clone & Install
git clone https://github.com/cuong28022003/EngComic_frontend.git
cd EngComic_frontend
npm install

# Configure environment
echo "REACT_APP_BASE_URL_API=http://localhost:8080/api" > .env

# Run development server
npm start
```

**Production Build:**

```bash
npm run build
npm run deploy  # Deploy to GitHub Pages
```

## 📦 Key Features

| Module              | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| **Comic Reader**    | Multi-chapter reading system với progress tracking, bookmarks, ratings & comments |
| **Gacha System**    | Probability-based character collection với rarity tiers & animations              |
| **Fighting Game**   | Canvas-based mini-game với sprite sheets & collision detection                    |
| **Deck Builder**    | Strategic card management system                                                  |
| **Leaderboard**     | Real-time ranking system với filtered views                                       |
| **Admin Dashboard** | Full CRUD operations cho comics, chapters, users & reports                        |
| **Payment System**  | Diamond topup integration                                                         |
| **User Profile**    | Customizable avatars với frames, stats tracking & achievement system              |

## 🏗️ Architecture Patterns

- **Component-Based Architecture** - Reusable components với props drilling prevention
- **Redux Slices** - Modular state management (auth, language, modal, messages)
- **Custom Hooks** - `useAdultMode`, business logic abstraction
- **Layout System** - MainLayout & AuthLayout cho consistent UI
- **API Layer** - Centralized API services với error handling
- **Route Protection** - PrivateRoute component cho authentication guards

## 🎓 Professional Skills Demonstrated

✅ **Frontend Development** - Modern React patterns, hooks, lifecycle management  
✅ **State Management** - Redux architecture, normalized state, optimistic updates  
✅ **API Integration** - RESTful APIs, JWT authentication, interceptors  
✅ **UI/UX Design** - Responsive layouts, animations, accessibility  
✅ **Performance** - Code optimization, lazy loading, bundle size reduction  
✅ **Cloud Services** - Firebase integration, storage management  
✅ **Version Control** - Git workflow, branch management  
✅ **Problem Solving** - Complex business logic implementation

## 📞 Contact

**GitHub:** [@cuong28022003](https://github.com/cuong28022003)  
**Repository:** [EngComic Frontend](https://github.com/cuong28022003/EngComic_frontend)

---

⭐ _Built with modern web technologies and best practices_

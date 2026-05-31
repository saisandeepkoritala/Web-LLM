# AI Chat Assistant - Frontend

The user interface for the AI-Powered Chat Assistant, built using **React**, **TypeScript**, and styled with **Tailwind CSS**. It manages secure user sessions via **Firebase Authentication** and connects to the Node.js backend for streaming AI chat queries.

---

## ✨ Features Implemented

- **Firebase Authentication:** Clean UI wrappers for Email/Password registration, Login, and Google OAuth single sign-on.
- **Dynamic Chat Workspace:** An intuitive interface utilizing state management to stream or render real-time LLM chat conversations and past history logs.
- **Protected Routing:** Strict route protection preventing unauthorized users from accessing the chat dashboard without active authentication.
- **Responsive Layout:** Mobile-first layout optimized with a collapsible sidebar and clean input controls.

## 🛠️ Tech Stack & Libraries

- **Core:** React.js, TypeScript (or JavaScript)
- **Styling:** Tailwind CSS, shadcn/ui (if applicable)
- **Auth Provider:** Firebase Client SDK
- **Data Fetching / State:** Axios / TanStack Query (or standard React Hooks)

## 📦 Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Env Variables
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:5000

### 1. Installation
Navigate to the client directory and install the packages:
```bash
cd client
npm install

npm run dev

# 🛍️ VisionShop AI

## A Multimodal AI Platform for Visual Product Search, Intelligent Recommendations, and Conversational Shopping Assistance

---

## 📖 Overview

VisionShop AI is an AI-powered e-commerce platform designed to simplify online shopping by combining visual product search, intelligent recommendations, product comparison, and conversational AI into a single, seamless experience.

Unlike traditional e-commerce platforms that rely primarily on keyword searches, VisionShop AI enables users to discover products through images, natural language queries, and AI-assisted recommendations.

---

## 🚀 Problem Statement

Customers spend a significant amount of time searching for products, comparing options, and reading numerous customer reviews before making a purchase decision. Existing e-commerce platforms often require users to perform these tasks separately, resulting in a time-consuming and inefficient shopping experience.

VisionShop AI addresses this challenge by integrating visual product search, semantic search, conversational AI, and intelligent recommendations into a unified platform, making product discovery faster, smarter, and more personalized.

---

# ✨ Features

* 🔍 Intelligent Product Search
* 📷 Visual Product Search (Image-Based Search)
* 🤖 Conversational AI Shopping Assistant
* 🎯 Personalized Product Recommendations
* 📊 AI-Based Product Comparison
* ⭐ Customer Review Summarization
* 📱 Responsive Modern UI
* ⚡ Fast REST API Backend

---

# 🏗️ System Architecture

```text
                User
                  │
                  ▼
        React Frontend (Vite)
                  │
          REST API Requests
                  │
                  ▼
      Express.js Backend (Node.js)
          │        │         │
          │        │         │
      MongoDB   Gemini AI   CLIP
          │                  │
          └──────ChromaDB────┘
                  │
                  ▼
            Product Results
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* TypeScript
* Axios

## Backend

* Node.js
* Express.js
* REST APIs
* CORS
* Nodemon
* dotenv

## Database

* MongoDB
* Mongoose

## Artificial Intelligence

* Google Gemini (Large Language Model)
* CLIP (Visual Product Search)
* ChromaDB (Vector Database)
* Embedding Models

---

# 📂 Project Structure

```
visionshop/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── data/
│   ├── uploads/
│   ├── index.js
│   ├── package.json
│   └── .env
│
└── README.md
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/your-username/visionshop.git
cd visionshop
```

---

## Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

---

## Install Backend Dependencies

```bash
cd ../backend
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_google_gemini_api_key
```

---

# 📡 API Endpoints

| Method | Endpoint            | Description           |
| ------ | ------------------- | --------------------- |
| GET    | `/api/products`     | Get all products      |
| GET    | `/api/products/:id` | Get product details   |
| GET    | `/api/search?q=`    | Search products       |
| POST   | `/api/chat`         | AI Shopping Assistant |
| POST   | `/api/search/image` | Visual Product Search |
| POST   | `/api/compare`      | Product Comparison    |

---

# 🤖 AI Workflow

### Visual Search

```
User Uploads Image
        │
        ▼
CLIP Model
        │
        ▼
Generate Image Embeddings
        │
        ▼
ChromaDB Similarity Search
        │
        ▼
Retrieve Product Details
        │
        ▼
Display Matching Products
```

### Conversational Shopping

```
User Query
      │
      ▼
Google Gemini
      │
      ▼
Understand User Intent
      │
      ▼
Generate Intelligent Recommendations
      │
      ▼
Return Personalized Response
```

---

# 🎯 Future Enhancements

* Voice-Based Product Search
* OCR-Based Product Recognition
* Multilingual Shopping Assistant
* Real-Time Price Comparison
* Wishlist & User Authentication
* Payment Gateway Integration
* Recommendation Personalization
* AI Review Sentiment Analysis

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Product Listing
* Product Details
* Visual Search
* AI Chat Assistant
* Product Comparison

---

# 👨‍💻 Author

SWETHA V

Project

VisionShop AI

---

# 📄 License

This project is developed for educational and research purposes.


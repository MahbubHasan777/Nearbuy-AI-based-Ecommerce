# NearBuy - AI-Powered Hyperlocal E-commerce Platform

**NearBuy** is a cutting-edge hyperlocal e-commerce platform that connects customers with nearby physical shops. It utilizes geolocation, intelligent search algorithms, and a hybrid database architecture to deliver a seamless shopping experience. Customers can discover products within a specific radius, add them to wishlists, and purchase from local vendors, bridging the gap between online convenience and offline retail.

---

## 🎯 Project Objective
The primary objective of NearBuy is to empower local businesses by giving them a digital presence and to provide customers with an efficient way to find and purchase products available in their immediate vicinity. By focusing on "hyperlocal" commerce, the platform reduces delivery times, supports local economies, and offers a highly personalized shopping experience based on the user's geographic location.

## 📖 Project Overview
NearBuy operates on a multi-vendor model with dedicated portals for Customers, Shops, and Administrators. 
- **Customers** can set their location, define a search radius, browse nearby shops, search for products using fuzzy and keyword matching, and manage wishlists. 
- **Shops** can register, manage their inventory, approve wishlist requests, and track analytics. 
- **Admins & Moderators** oversee the platform, approving shop registrations and ensuring quality control.

The system uses a sophisticated search mechanism that calculates distances using the Haversine formula and scores search results based on exact matches, fuzzy logic (Levenshtein distance), and keyword associations.

---

## 💻 Tech Stack

### Frontend
* **Framework:** Next.js (React 19)
* **Styling:** Tailwind CSS V4
* **Mapping:** React Leaflet (for geolocation and map visualization)
* **PWA:** next-pwa (Progressive Web App support)
* **Icons:** Lucide React

### Backend
* **Framework:** NestJS
* **Language:** TypeScript
* **ORM / ODM:** Prisma (for SQL) & Mongoose (for NoSQL)
* **Queueing & Caching:** BullMQ & Redis (Memurai on Windows)
* **Authentication:** JWT, bcrypt
* **File Uploads:** Multer & Sharp (for image compression)
* **Emails:** Nodemailer (Mailtrap/Ethereal for dev)

### Python Services (Machine Learning & Vector Search)
* **Framework:** FastAPI, Uvicorn
* **Vector Database:** ChromaDB
* **Embeddings:** Sentence-Transformers
* **Scheduler:** APScheduler (for syncing MongoDB data to ChromaDB)

---

## 🏗️ Architecture & Database Choice

NearBuy employs a **Polyglot Persistence Architecture**, leveraging the strengths of both Relational (SQL) and NoSQL databases to handle different types of data efficiently.

### 1. MySQL (Relational Database) - Managed via Prisma
Used for structured, highly relational data where ACID compliance and strict schemas are crucial.
* **Entities:** Users (Admin, Moderator, Shop, Customer), Authentication Tokens, OTPs, Geolocation Data (Lat/Lng), Order History, Favourite Shops, Recent Shops.
* **Why?** Perfect for handling user relationships, financial transactions, and ensuring data integrity across interconnected entities.

### 2. MongoDB (NoSQL Database) - Managed via Mongoose
Used for unstructured or semi-structured data that requires high read/write throughput and flexible schemas.
* **Entities:** Products, Categories, Brands, Wishlists, Reviews.
* **Why?** Products have highly variable attributes (specifications, multiple images, dynamic keywords). MongoDB allows for fast querying and easy schema evolution without complex migrations.

---

## 🗄️ Detailed Database Schema

NearBuy uses a hybrid approach. Below are the detailed schemas for both databases.

### 1. Relational Database (MySQL - Prisma)

#### `Customer` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (UUID)` | Primary key. |
| `username` | `String` | Unique username. |
| `email` | `String` | Unique email address. |
| `fullName` | `String` | Full name of the customer. |
| `lat` / `lng` | `Float` | Last known geographic coordinates. |
| `radiusMeters`| `Int` | Preferred search radius (Default: 5000m). |
| `isActive` | `Boolean` | Account status. |

#### `Shop` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (UUID)` | Primary key. |
| `shopName` | `String` | Unique shop name. |
| `ownerEmail` | `String` | Unique owner email. |
| `lat` / `lng` | `Float` | Fixed geographic coordinates of the shop. |
| `status` | `Enum` | `PENDING`, `APPROVED`, or `REJECTED`. |
| `bannerMsg` | `String` | Promotional message shown to customers. |

#### `OrderHistory` Table
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `String (UUID)` | Primary key. |
| `customerId` | `String` | Reference to the customer. |
| `productId` | `String` | ID of the purchased product. |
| `productName` | `String` | Snapshot of the product name at purchase. |
| `price` | `Float` | Price paid for the product. |
| `markedAt` | `DateTime` | Timestamp when the order was fulfilled. |

#### `AuthToken` & `OTP` Tables
| Entity | Key Fields | Description |
| :--- | :--- | :--- |
| `AuthToken` | `token`, `userId`, `userType` | Manages secure sessions for all user types. |
| `OTP` | `email`, `otp`, `expiresAt` | Used for email verification and password resets. |

---

### 2. NoSQL Database (MongoDB - Mongoose)

#### `Product` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `shopId` | `String` | ID of the owning shop. |
| `name` | `String` | Name of the product. |
| `brandId` / `categoryId` | `String` | References to shop-specific classifications. |
| `price` | `Number` | Original price. |
| `discountPrice`| `Number` | Price after discount. |
| `images` | `Array<String>` | List of image file paths. |
| `imageKeywords`| `Array<String>` | AI-generated keywords for better search. |
| `totalSold` | `Number` | Total units sold via the platform. |

#### `Category` & `Brand` Collections
| Entity | Key Fields | Description |
| :--- | :--- | :--- |
| `Category` | `shopId`, `name` | Custom product categories managed by shops. |
| `Brand` | `shopId`, `name` | Custom brands managed by shops. |

#### `Wishlist` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `customerId` | `String` | Reference to the customer. |
| `productId` | `String` | Reference to the product. |
| `shopId` | `String` | Reference to the shop. |
| `status` | `Enum` | `PENDING`, `REJECTED`, or `FULFILLED`. |

#### `Review` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `customerId` | `String` | The customer who wrote the review. |
| `productId` | `String` | The product being reviewed. |
| `rating` | `Number` | Rating from 1 to 5. |
| `comment` | `String` | Text content of the review. |

#### `Notification` Collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `recipientId` | `String` | ID of the user (Shop/Customer). |
| `recipientRole`| `String` | Either `SHOP` or `CUSTOMER`. |
| `title` | `String` | Short notification title. |
| `message` | `String` | Full notification body. |
| `isRead` | `Boolean` | Read/unread status. |

---

## ⚙️ Core Mechanisms & Processes

### 1. Request Handling & Workflow
* **Client Request:** Frontend Next.js app sends REST API requests to the NestJS backend.
* **Controllers & Services:** NestJS handles routing, validation (DTOs), and business logic.
* **Hybrid Data Fetching:** A typical request might involve fetching the user's location from MySQL (Prisma), calculating nearby shops, and then fetching products from those specific shops using MongoDB (Mongoose).

### 2. Geolocation & Radius Filtering
The system uses the **Haversine Formula** (`geo.service.ts`) to calculate the great-circle distance between two points on a sphere (the Earth).
* When a customer searches for a product, the system first retrieves all active shops.
* It calculates the distance between the customer and each shop.
* It filters out shops that fall outside the customer's specified `radiusMeters`.

### 3. Search Algorithm & Fuzzy Logic
The search functionality (`search.service.ts`) is highly optimized to return relevant results even with typos or incomplete queries. Results are scored and categorized into four match types:
1. **Exact Match:** The query perfectly matches the product name.
2. **Prefix Match:** Query tokens match the beginning of product name tokens.
3. **Fuzzy Match (Levenshtein Distance):** Calculates the minimum number of single-character edits required to change one word into another. If the similarity score is `>= 0.6`, it's considered a fuzzy match.
4. **Keyword Match:** Checks if the query matches any of the AI-generated `imageKeywords` associated with the product.

### 4. Machine Learning & Vector Search (Python Service)
A dedicated Python microservice runs in the background to enable semantic search capabilities:
* **Syncing:** A background scheduler syncs product data (name, description, keywords) from MongoDB to ChromaDB every hour.
* **Embeddings:** Uses `sentence-transformers` to convert product text into vector embeddings.
* **Semantic Querying:** Allows finding products based on contextual meaning rather than just exact string matches. *(Note: Currently disabled in main search flow but infrastructure is ready).*

### 5. Wishlist & Order Workflow
1. Customer adds a product to their Wishlist (`PENDING` state).
2. The Shop sees the request in their dashboard.
3. If the shop has the item, they mark it as `FULFILLED`.
4. This triggers an `OrderHistory` creation, increments the product's `totalSold` count, and sends a notification to the customer.

---

## 🔑 Environment Variables (.env)

The `backend/.env` file is the configuration bible for the server. Here are the essential keys:

| Key | Description | Example Value |
| :--- | :--- | :--- |
| `DATABASE_URL` | MySQL connection string for Prisma | `mysql://root:@localhost:3306/nearbuy` |
| `MONGODB_URI` | MongoDB connection string for Mongoose | `mongodb://localhost:27017/nearbuy` |
| `MEMURAI_URL` | Redis URL for BullMQ (queue processing) | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key for signing Auth tokens | `your_jwt_secret` |
| `COOKIE_SECRET` | Secret key for signing cookies | `nearbuy_cookie_secret_2024` |
| `SMTP_HOST` | Email server host (e.g., Ethereal/Mailtrap) | `smtp.ethereal.email` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_USER` | Email authentication username | `brooks50@ethereal.email` |
| `SMTP_PASS` | Email authentication password | `***` |
| `UPLOAD_DIR` | Directory to store uploaded images | `uploads` |
| `PORT` | The port the NestJS server runs on | `3001` |
| `CHROMA_URL` | URL for the Python Vector DB service | `http://localhost:8000` |
| `OLLAMA_URL` | URL for local LLM models (if used) | `http://localhost:11434` |

---

## 🚀 API Endpoints Overview (High-Level)

* **Auth (`/auth`):** Login, Register (Customer/Shop), Verify OTP, Password Reset.
* **Customer (`/customer`):** Manage profile, update location, get nearby shops, manage favourite/recent shops, view order history.
* **Shop (`/shop`):** Manage shop profile, handle public profiles, upload banners/logos.
* **Product (`/product`):** CRUD operations for products, upload images, manage categories/brands.
* **Search (`/search`):** Global search across nearby shops, shop-specific search, filtering (price, rating).
* **Wishlist (`/wishlist`):** Add/remove wishlist items, shop fulfilling/rejecting requests.
* **Notification (`/notification`):** Push notifications and in-app alerts.

---

## 🛠️ How to Run the Project Locally

1. **Start Databases:** Ensure MySQL, MongoDB, and Redis (Memurai) are running.
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run start:dev
   ```
3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
4. **Python ML Service (Optional):**
   ```bash
   cd python-services
   pip install -r requirements.txt
   uvicorn chroma_server:app --host 0.0.0.0 --port 8000
   ```

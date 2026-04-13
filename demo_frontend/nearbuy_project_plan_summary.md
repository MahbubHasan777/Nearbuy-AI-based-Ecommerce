# NearBuy — Full Project Plan
> Hyperlocal E-Commerce Platform | NestJS + NextJS + MariaDB + MongoDB + ChromaDB

---

## 1. Project Overview
**NearBuy** is a hyperlocal e-commerce platform where customers discover nearby shops within a selected radius, browse products, add to wishlist, and mark purchases. Shops manage their own inventory. Admins and Moderators govern the platform.

### Roles
- **Admin**: Full platform control, creates Moderators.
- **Moderator**: Approves shops, manages users/products.
- **Shop**: Lists products, manages inventory and orders.
- **Customer**: Discovers nearby shops, wishlists, rates products.

---

## 2. Tech Stack
- **Backend**: NestJS (Node.js)
- **Frontend**: NextJS
- **Databases**: MariaDB (Prisma), MongoDB (Mongoose), ChromaDB (Semantic Search)
- **AI/ML**: MiniLM-L6-v2 (Embeddings), Ollama + moondream (Image Analysis)
- **Infrastructure**: Redis (BullMQ), Sharp (Image Processing)

---

## 3. UI/UX Requirements (NextJS Frontend)
Based on your plan, I will design the following core screens:

### Customer Flow
1. **Customer Home (Discovery)**: Interactive map (OpenStreetMap) with a radius slider and a list of nearby shops.
2. **Search Results**: Global search results with advanced filters (price, rating, category) and semantic "Stage 5" ranking.
3. **Shop Public Profile**: Shop details, banner message, popular products, and top-rated items.
4. **Product Detail**: High-res images, AI-generated keywords/tags, and ratings/reviews.
5. **Wishlist & Order History**: Managing active wishlist items and reviewing past purchases.

### Shop Owner Flow
6. **Shop Dashboard**: Overview of performance, active wishlist requests, and stock status.
7. **Inventory Management**: CRUD interface for Categories, Brands, and Products (with 3-image upload).
8. **Wishlist Requests**: Handling customer requests (Mark as Done / Reject).

### Admin/Moderator Flow
9. **Admin Dashboard**: Platform-wide statistics and management.
10. **Approval Queue**: Reviewing pending shop registrations.
11. **User Management**: Managing shops, customers, and moderators.

---

## 4. Search Pipeline (The "Secret Sauce")
The UI will support a 5-stage ranking system:
- Exact/Partial/Fuzzy matches.
- AI Image Keyword bonus.
- Semantic semantic similarity (Vector search).

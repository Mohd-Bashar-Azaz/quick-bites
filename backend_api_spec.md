# Backend Setup & API Specification

To transform this frontend prototype into a production-ready application, you will need a robust backend. Below is a detailed breakdown of the setup and the exact REST APIs required, derived directly from your current data models (`src/types/index.ts` and `src/data/mockData.ts`).

## 1. Suggested Backend Setup (JavaScript/Node.js)

- **Runtime**: Node.js
- **Framework**: Express.js or Fastify (Express is standard and easy to set up).
- **Database**: MongoDB (Mongoose) or PostgreSQL (Prisma). Given the document-like nature of your mock data (arrays of strings for tags/categories, nested order items), **MongoDB** is highly recommended.
- **Real-Time Communication**: `Socket.io` (for live order status tracking and group orders).
- **Authentication**: JWT (JSON Web Tokens) with a library like `passport.js` or `firebase-admin`.
- **Payment Gateway**: Stripe or Razorpay SDK.

---

## 2. API Endpoints Specification

*Note: All endpoints should require an `Authorization: Bearer <token>` header except for public ones.*

### A. Authentication & User Profile
Since you currently have a hardcoded `UserProfile`, you need APIs to manage users.

| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/auth/register` | Create a new user account. |
| **POST** | `/api/auth/login` | Authenticate user & return JWT. |
| **GET** | `/api/users/profile` | Get the logged-in user's profile. |

**`GET /api/users/profile` Response:**
```json
{
  "name": "Haris Khan",
  "email": "haris@campus.edu",
  "phone": "+91 98765 43210",
  "walletBalance": 120,
  "streakDays": 7,
  "totalOrders": 23,
  "totalSaved": 340
}
```

### B. Canteens
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/canteens` | Get all available canteens. |
| **GET** | `/api/canteens/:id` | Get details of a specific canteen. |

**`GET /api/canteens` Response `Canteen[]`:**
```json
[
  {
    "id": "c1",
    "name": "Main Canteen",
    "rating": 4.5,
    "ratingCount": "1.2k",
    "tags": ["Fast", "Popular"],
    "rushLevel": "low",
    "avgWaitTime": "5 min",
    "bannerImage": "https://...",
    "categories": ["All", "Beverages", "Snacks"]
  }
]
```

### C. Menu Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/canteens/:canteenId/menu` | Get all menu items for a specific canteen. |
| **GET** | `/api/menu/trending` | Get global trending items (Home Screen). |
| **GET** | `/api/menu/fast` | Get fastest prep items (Home Screen). |

**`GET /api/canteens/:canteenId/menu` Response `MenuItem[]`:**
```json
[
  {
    "id": "m1",
    "canteenId": "c1",
    "category": "Meals",
    "name": "Cheese Burger",
    "description": "Juicy beef patty...",
    "price": 120,
    "prepTime": "10 min",
    "image": "https://...",
    "isVeg": false,
    "inStock": true,
    "isTrending": true,
    "isFast": false
  }
]
```

### D. Offers & Combos
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/offers` | Get active banners/offers. |
| **GET** | `/api/coupons` | Get available discount coupons. |
| **GET** | `/api/combos` | Get suggested combos (Cart Screen). |

### E. Orders & Checkout (Consumer Side)
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/api/orders` | Place a new order. |
| **GET** | `/api/orders` | Get user's past/active orders. |
| **GET** | `/api/orders/:id` | Get order details by ID (Tracking screen). |

**`POST /api/orders` Payload (Request Body):**
```json
{
  "canteenId": "c1",
  "items": [
    {
      "id": "m1",
      "quantity": 2,
      "customizations": ["No onions"],
      "spiceLevel": "medium"
    }
  ],
  "paymentMethod": "UPI",
  "couponCode": "WELCOME50" // Optional
}
```

**`POST /api/orders` Response:**
Returns the created `Order` object including the generated `token` (e.g., "A-038") and initial `status: "received"`.

### F. Vendor Dashboard (Canteen Admin)
APIs used by the canteen staff to view and update incoming orders.

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/vendor/orders` | Get all active orders for the vendor's canteen (`DashboardOrder[]`). |
| **PUT** | `/api/vendor/orders/:id/status` | Update the status of an order. |

**`PUT /api/vendor/orders/:id/status` Payload:**
```json
{
  "status": "preparing" // or 'ready', 'completed'
}
```

### G. System Admin
APIs for the overarching administration panel.

| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/api/admin/stats` | Get KPI stats (Revenue, Orders, Trends). |
| **GET** | `/api/admin/activity` | Get recent activity feed. |

---

## 3. WebSockets (Crucial for Real-Time)
Instead of using `setInterval` polling for the **Order Tracking Screen** and the **Vendor Dashboard**, you should implement WebSockets (`Socket.io`). 

**Events:**
- Server -> Client: `orderStatusUpdated` (Sent when vendor clicks "Mark as Ready"). The consumer app listens and triggers the UI animation/toast.
- Server -> Client: `newOrderReceived` (Sent when a consumer places an order). The vendor dashboard listens and flashes the "New Order Arrival" animation.
- Client <-> Server: `groupCartUpdated` (For syncing items when multiple users add to a shared Group Order).

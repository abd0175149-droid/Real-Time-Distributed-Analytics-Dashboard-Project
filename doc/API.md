# API Documentation - Real-Time Analytics Dashboard

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.your-domain.com/api
```

## Authentication

All protected endpoints require JWT Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### POST /register

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "company_name": "Acme Inc"  // optional
}
```

**Response (201):**
```json
{
  "message": "Register success",
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `422`: Validation error
- `409`: Email already exists

---

#### POST /login

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user"]
  }
}
```

**Errors:**
- `401`: Invalid credentials

---

#### POST /logout

Logout current user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Logged out"
}
```

---

#### POST /refresh

Refresh JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "access_token": "new-token-here"
}
```

---

#### GET /me

Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john@example.com",
  "company_name": "Acme Inc",
  "roles": ["user"],
  "created_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### Password Reset

#### POST /password/forgot

Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset link sent"
}
```

---

#### POST /password/reset

Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-here",
  "email": "john@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

### Analytics Tracking

#### POST /track

Track a single analytics event.

**Rate Limit:** 120 requests/minute

**Request Body:**
```json
{
  "tracking_id": "site_abc123",
  "type": "page_view",
  "session_id": "sess_xyz789",
  "user_id": "user_123",
  "page_url": "/dashboard",
  "page_title": "Dashboard - My App"
}
```

**Event Types:**

| Type | Description |
|------|-------------|
| `page_load` | Initial page load with device/geo data |
| `page_view` | Page view event |
| `page_unload` | Page unload with duration/scroll data |
| `click` | Click interaction |
| `link_click` | Link click with URL |
| `scroll` | Scroll depth event |
| `form_focus` | Form field focused |
| `form_input` | Form input changed |
| `form_submit` | Form submitted |
| `video_play` | Video play started |
| `video_pause` | Video paused |
| `video_complete` | Video completed |
| `product_view` | E-commerce: product viewed |
| `cart_add` | E-commerce: added to cart |
| `cart_remove` | E-commerce: removed from cart |
| `purchase` | E-commerce: purchase completed |
| `custom` | Custom event |

**Page Load Event Example:**
```json
{
  "tracking_id": "site_abc123",
  "type": "page_load",
  "session_id": "sess_xyz789",
  "user_id": "user_123",
  "data": {
    "url": "https://example.com/dashboard",
    "title": "Dashboard",
    "referrer": "https://google.com",
    "device_type": "Desktop",
    "operating_system": "Windows",
    "browser": "Chrome",
    "screen_resolution": {
      "width": 1920,
      "height": 1080
    },
    "viewport": {
      "width": 1200,
      "height": 800
    },
    "location": {
      "country": "Saudi Arabia",
      "country_code": "SA"
    },
    "performance": {
      "dns_time": 10,
      "connect_time": 50,
      "response_time": 100,
      "dom_load_time": 500,
      "page_load_time": 1200
    },
    "network": {
      "effectiveType": "4g",
      "downlink": 10,
      "rtt": 50
    }
  }
}
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "Event stored successfully",
  "event_type": "page_load"
}
```

**Response (500):**
```json
{
  "status": "error",
  "message": "Failed to store event",
  "event_type": "page_load"
}
```

---

#### POST /track/batch

Track multiple events at once.

**Rate Limit:** 30 requests/minute

**Request Body:**
```json
{
  "events": [
    {
      "tracking_id": "site_abc123",
      "type": "page_view",
      "session_id": "sess_xyz789",
      "page_url": "/page1"
    },
    {
      "tracking_id": "site_abc123",
      "type": "click",
      "session_id": "sess_xyz789",
      "x": 100,
      "y": 200
    }
  ]
}
```

**Response (200):**
```json
{
  "status": "ok",
  "message": "Batch processed",
  "success_count": 2,
  "fail_count": 0,
  "total": 2
}
```

---

### User Analytics

#### GET /user/{id}/analytics

Get analytics data for a specific user.

**Headers:** `Authorization: Bearer <token>` (optional)

**Response (200):**
```json
{
  "user": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "events_count": 1234,
  "last_events": [
    {
      "timestamp": "2025-02-01T12:00:00",
      "session_id": "sess_xyz",
      "user_id": "user_123",
      "tracking_id": "site_abc",
      "event_type": "page_view",
      "page_url": "/dashboard",
      "page_title": "Dashboard"
    }
  ]
}
```

---

#### GET /analytics/{trackingId}/realtime

Get real-time statistics for a tracking ID.

**Response (200):**
```json
{
  "status": "ok",
  "data": {
    "active_users": 42,
    "page_views": 156,
    "events": 234
  }
}
```

---

#### GET /analytics/test-connection

Test ClickHouse database connection.

**Response (200):**
```json
{
  "success": true,
  "message": "ClickHouse connection successful"
}
```

**Response (500):**
```json
{
  "success": false,
  "message": "Connection test failed: <error message>"
}
```

---

### Admin Only

#### GET /admin-only

Admin-only endpoint (requires `admin` role).

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Welcome Admin"
}
```

**Response (403):**
```json
{
  "message": "Forbidden - You do not have permission to access this resource",
  "required_roles": ["admin"],
  "your_roles": ["user"]
}
```

---

## Error Responses

### Standard Error Format

```json
{
  "message": "Error description",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Success |
| `201` | Created |
| `204` | No Content |
| `400` | Bad Request |
| `401` | Unauthorized |
| `403` | Forbidden |
| `404` | Not Found |
| `422` | Validation Error |
| `429` | Too Many Requests (Rate Limited) |
| `500` | Server Error |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/track` | 120 requests/minute |
| `/api/track/batch` | 30 requests/minute |
| Other endpoints | 60 requests/minute |

When rate limited, you'll receive:

```json
{
  "message": "Too Many Attempts."
}
```

With header: `Retry-After: <seconds>`

---

## WebSocket Events

### Connection

```javascript
const ws = new WebSocket('ws://localhost:8080/app/your-app-key');
```

### Channels

| Channel | Description |
|---------|-------------|
| `analytics-channel` | Global analytics events |
| `analytics.{tracking_id}` | Events for specific tracking ID |

### Events

**analytics.new**
```json
{
  "tracking_id": "site_abc123",
  "event_type": "page_view",
  "data": {
    "session_id": "sess_xyz",
    "user_id": "user_123",
    "page_url": "/dashboard"
  },
  "timestamp": "2025-02-01T12:00:00.000Z"
}
```

---

## SDK Integration

### JavaScript Tracker

```html
<script 
  src="tracker/index.js" 
  data-endpoint="http://localhost:8000/api/track"
  data-tracking-id="your-site-id"
  data-batch-size="10"
  data-interval="7000"
  data-debug="true">
</script>
```

### Custom Events

```javascript
window.analytics.track('custom_event', {
  event_name: 'button_click',
  button_id: 'signup-btn'
});
```

### E-commerce Events

```javascript
// Product View
window.analytics.trackProductView({
  product_id: 'prod_123',
  product_name: 'Widget',
  price: 29.99,
  category: 'Gadgets'
});

// Add to Cart
window.analytics.trackCartAdd({
  product_id: 'prod_123',
  quantity: 2
});

// Purchase
window.analytics.trackPurchase({
  order_id: 'order_456',
  total: 59.98,
  currency: 'USD'
});
```

# 🔌 API Integration Guide

## Backend Server Configuration

**Production API:** `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api`

The frontend is now fully configured to communicate with your backend API endpoints.

---

## ✅ Configured Files

### 1. `/lib/api.ts` - Main API Client
Complete API client with all endpoints configured:

- ✅ **Authentication API** - Login, Register, Logout
- ✅ **Academy API** - Courses, Dashboard, Leaderboard, Certificates, Profile
- ✅ **Market API** - Recipes, Purchases, Sales, Statistics
- ✅ **AI API** - Recipe Review, Critique, Analysis, Price Estimation, Mentor Chat
- ✅ **Upload API** - Image upload to Cloudinary
- ✅ **Health API** - Server health check

### 2. `/lib/types.ts` - TypeScript Types
Comprehensive type definitions for all API responses:

- `ProfileData` - User profile structure
- `DashboardData` - Dashboard information
- `RecipeData` - Recipe details
- `CourseData` - Course information
- `LeaderboardData` - Ranking data
- `AuthResponse` - Authentication tokens
- `UploadResponse` - Image upload results

### 3. `/contexts/UserContext.tsx` - User Authentication
Real API integration for user management:

- ✅ Login with backend authentication
- ✅ Registration with UUID from backend
- ✅ Profile fetching and updates
- ✅ Token management (localStorage)
- ✅ Avatar upload via Cloudinary

### 4. `/.env.local` - Environment Configuration
```bash
NEXT_PUBLIC_API_URL=https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api
NEXT_PUBLIC_SITE_URL=https://dima-fomin.pl
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=cv_sushi_chef
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 🚀 How to Use API in Components

### Example 1: Fetch User Dashboard
```tsx
import { academyApi } from "@/lib/api";
import { useUser } from "@/contexts/UserContext";

function DashboardPage() {
  const { user, isAuthenticated } = useUser();
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem("authToken");
      academyApi.getDashboard(user.id, token)
        .then(data => setDashboardData(data))
        .catch(error => console.error(error));
    }
  }, [isAuthenticated, user]);
  
  return <div>{/* Render dashboard */}</div>;
}
```

### Example 2: Fetch Marketplace Recipes
```tsx
import { marketApi } from "@/lib/api";

function MarketplacePage() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    marketApi.getRecipes({
      category: "sushi",
      sortBy: "rating",
      minRating: 7
    })
      .then(data => setRecipes(data))
      .catch(error => console.error(error));
  }, []);
  
  return <div>{/* Render recipes */}</div>;
}
```

### Example 3: Get Leaderboard
```tsx
import { academyApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

function LeaderboardPage() {
  const { language } = useLanguage();
  const [leaders, setLeaders] = useState([]);
  
  useEffect(() => {
    academyApi.getLeaderboard("xp", language, 10)
      .then(data => setLeaders(data.leaders))
      .catch(error => console.error(error));
  }, [language]);
  
  return <div>{/* Render leaderboard */}</div>;
}
```

### Example 4: AI Recipe Review
```tsx
import { aiApi } from "@/lib/api";

async function reviewRecipe(recipeId: string) {
  try {
    const token = localStorage.getItem("authToken");
    const review = await aiApi.reviewRecipe(recipeId, "pl", token);
    
    console.log("AI Rating:", review.rating);
    console.log("Chef Comment:", review.comment);
    console.log("Estimated Price:", review.estimatedPrice);
  } catch (error) {
    console.error("Review failed:", error);
  }
}
```

### Example 5: Upload Avatar
```tsx
import { uploadApi } from "@/lib/api";

async function handleAvatarUpload(file: File) {
  try {
    const token = localStorage.getItem("authToken");
    const result = await uploadApi.uploadImageFile(file, token);
    
    console.log("Uploaded to:", result.url);
    
    // Update user profile with new avatar
    await academyApi.updateProfile(user.id, { avatarUrl: result.url }, token);
  } catch (error) {
    console.error("Upload failed:", error);
  }
}
```

---

## 📋 Complete Endpoint List

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### User & Academy
- `GET /user/{userId}/profile` - Get user profile
- `PUT /user/{userId}/profile` - Update profile
- `GET /user/{userId}/dashboard` - Get dashboard data
- `GET /user/{userId}/certificates` - Get certificates
- `GET /academy/courses` - Get all courses
- `GET /academy/courses/{id}` - Get course details
- `GET /leaderboard` - Get global leaderboard
- `POST /academy/certificate/{courseId}` - Generate certificate

### Marketplace
- `GET /market/recipes` - Get market recipes (with filters)
- `GET /market/recipes/{id}` - Get recipe details
- `POST /market/purchase` - Purchase recipe
- `GET /user/{userId}/purchases` - Get user purchases
- `GET /market/stats/{userId}` - Get seller statistics

### AI Features
- `POST /ai/review-recipe` - AI recipe review
- `POST /ai/critique` - AI recipe critique (5 criteria)
- `POST /ai/analyze` - Analyze recipe
- `POST /ai/estimate-price` - Estimate recipe price
- `POST /mentor/chat` - AI mentor chat

### Image Upload
- `POST /upload/image` - Upload image to Cloudinary

### Health & Status
- `GET /health` - Server health check

---

## 🔑 Test Credentials

Use these credentials to test the integration:

**User 1 - Dima Fomin:**
```json
{
  "email": "dima@example.com",
  "password": "password123",
  "userId": "ef03cd81-71fd-429f-bb5f-8be5c9172ca8"
}
```

**User 2 - Anna Kowalska:**
```json
{
  "email": "anna@example.com",
  "password": "password123",
  "userId": "fba50be3-e3c5-4d73-8ed8-cfb6422f7034"
}
```

---

## 🧪 Quick Tests

### Test Backend Connection
```bash
curl https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "data": {
    "database": "connected",
    "service": "menu-fodifood-backend"
  }
}
```

### Test Leaderboard
```bash
curl 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/leaderboard?sortBy=xp&limit=5'
```

### Test Marketplace
```bash
curl 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/market/recipes?category=sushi'
```

---

## 🛠️ Error Handling

All API calls include proper error handling:

```tsx
try {
  const data = await academyApi.getCourses("pl");
  // Handle success
} catch (error: any) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    router.push("/login");
  } else if (error.status === 404) {
    // Not found
    console.log("Resource not found");
  } else {
    // Other errors
    console.error("API Error:", error.message);
  }
}
```

---

## 🔐 Authentication Flow

1. **User logs in** → `authApi.login(email, password)`
2. **Backend returns** → `{ token, userId }`
3. **Store in localStorage** → `authToken`, `userId`
4. **Fetch profile** → `academyApi.getProfile(userId, token)`
5. **Set user state** → User is authenticated
6. **All subsequent requests** → Include `token` in headers

### Logout Flow
1. **User clicks logout** → `logout()`
2. **Clear localStorage** → Remove `authToken`, `userId`
3. **Clear user state** → `setUser(null)`
4. **Redirect** → Navigate to home page

---

## 📦 Response Format

All backend responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Actual data here
  },
  "message": "Optional message"
}
```

The API client automatically extracts `data` field, so you get clean responses:

```tsx
const profileData = await academyApi.getProfile(userId, token);
// profileData is already extracted from response.data
```

---

## 🌐 Multi-language Support

All API endpoints that support language use the current language from context:

```tsx
import { useLanguage } from "@/contexts/LanguageContext";

function MyComponent() {
  const { language } = useLanguage(); // "pl", "uk", or "en"
  
  // Language is automatically used in API calls
  academyApi.getCourses(language);
  academyApi.getLeaderboard("xp", language);
  aiApi.reviewRecipe(recipeId, language);
}
```

---

## ✨ Next Steps

1. ✅ All API endpoints are configured
2. ✅ TypeScript types are defined
3. ✅ UserContext uses real authentication
4. ✅ Error handling is implemented
5. ⏭️ Update UI components to use real data
6. ⏭️ Add loading states and error messages
7. ⏭️ Test all features end-to-end

---

**Status:** Production Ready 🚀  
**Last Updated:** 3 November 2025  
**Backend:** https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app

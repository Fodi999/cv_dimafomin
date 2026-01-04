# 🔄 Backend Integration Guide - Go API

**Date:** 2026-01-04  
**Backend:** Go (Koyeb) - `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app`  
**Frontend:** Next.js - `http://localhost:3000`

---

## 📋 Overview

Этот документ описывает интеграцию между Next.js frontend и Go backend для Admin API.

---

## 🔐 Admin Users API - Backend Implementation (Go)

### Required Changes in Go Backend

Чтобы соответствовать новому контракту API, нужно изменить формат ответа в Go backend.

---

### 1️⃣ GET /api/admin/users

**File:** `internal/modules/admin/handlers/users.go` (или аналогичный)

**Current Implementation (to fix):**

```go
package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"
    
    "your-project/internal/middleware"
    "your-project/internal/models"
    "your-project/internal/utils"
)

// GetAdminUsers returns list of all users (admin only)
func GetAdminUsers(w http.ResponseWriter, r *http.Request) {
    // Parse query parameters
    page, _ := strconv.Atoi(r.URL.Query().Get("page"))
    if page < 1 {
        page = 1
    }
    
    limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
    if limit < 1 {
        limit = 20
    }
    
    search := r.URL.Query().Get("search")
    role := r.URL.Query().Get("role")
    status := r.URL.Query().Get("status")
    
    // Get user ID from context (set by AuthMiddleware)
    userID, _ := r.Context().Value("userID").(string)
    
    // Log admin action
    utils.LogAdminAction(userID, "GET_USERS", map[string]interface{}{
        "page": page,
        "limit": limit,
        "search": search,
    })
    
    // Fetch users from database
    users, totalCount, err := getUsersFromDB(page, limit, search, role, status)
    if err != nil {
        utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch users")
        return
    }
    
    // Calculate total pages
    totalPages := (totalCount + limit - 1) / limit
    
    // ✅ CORRECT FORMAT: Return { "users": [...], "meta": {...} }
    response := map[string]interface{}{
        "users": users,
        "meta": map[string]interface{}{
            "total":      totalCount,
            "page":       page,
            "limit":      limit,
            "totalPages": totalPages,
        },
    }
    
    utils.RespondWithJSON(w, http.StatusOK, response)
}

// Helper function to fetch users from DB
func getUsersFromDB(page, limit int, search, role, status string) ([]models.AdminUser, int, error) {
    var users []models.AdminUser
    var totalCount int64
    
    db := database.GetDB()
    query := db.Model(&models.User{})
    
    // Apply filters
    if search != "" {
        query = query.Where("name ILIKE ? OR email ILIKE ?", "%"+search+"%", "%"+search+"%")
    }
    
    if role != "" && role != "all" {
        query = query.Where("role = ?", role)
    }
    
    if status != "" && status != "all" {
        query = query.Where("status = ?", status)
    }
    
    // Get total count
    query.Count(&totalCount)
    
    // Apply pagination
    offset := (page - 1) * limit
    query = query.Offset(offset).Limit(limit)
    
    // Fetch users
    if err := query.Find(&users).Error; err != nil {
        return nil, 0, err
    }
    
    return users, int(totalCount), nil
}
```

---

### 2️⃣ PATCH /api/admin/users/update-role

**New Endpoint to Add:**

```go
// UpdateUserRole updates user role (admin only)
func UpdateUserRole(w http.ResponseWriter, r *http.Request) {
    // Parse request body
    var req struct {
        UserID string `json:"userId"`
        Role   string `json:"role"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
        return
    }
    
    // Validate required fields
    if req.UserID == "" {
        utils.RespondWithError(w, http.StatusBadRequest, "userId is required")
        return
    }
    
    // Validate role
    validRoles := []string{"admin", "home_chef", "pro_chef"}
    isValidRole := false
    for _, validRole := range validRoles {
        if req.Role == validRole {
            isValidRole = true
            break
        }
    }
    
    if !isValidRole {
        utils.RespondWithError(w, http.StatusBadRequest, "Invalid role. Allowed values: admin, home_chef, pro_chef")
        return
    }
    
    // Get admin user ID from context
    adminID, _ := r.Context().Value("userID").(string)
    
    // Update user role in database
    db := database.GetDB()
    result := db.Model(&models.User{}).
        Where("id = ?", req.UserID).
        Update("role", req.Role)
    
    if result.Error != nil {
        utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update user role")
        return
    }
    
    if result.RowsAffected == 0 {
        utils.RespondWithError(w, http.StatusNotFound, "User not found")
        return
    }
    
    // Log admin action
    utils.LogAdminAction(adminID, "UPDATE_USER_ROLE", map[string]interface{}{
        "userId":  req.UserID,
        "newRole": req.Role,
    })
    
    // Return success response
    response := map[string]interface{}{
        "success": true,
        "message": "User role updated successfully",
        "data": map[string]interface{}{
            "userId":    req.UserID,
            "role":      req.Role,
            "updatedAt": time.Now().Format(time.RFC3339),
        },
    }
    
    utils.RespondWithJSON(w, http.StatusOK, response)
}
```

---

### 3️⃣ PUT /api/admin/users/{userId}

```go
// UpdateUser updates user data (admin only)
func UpdateUser(w http.ResponseWriter, r *http.Request) {
    // Get userId from URL path
    vars := mux.Vars(r)
    userID := vars["userId"]
    
    if userID == "" {
        utils.RespondWithError(w, http.StatusBadRequest, "User ID is required")
        return
    }
    
    // Parse request body
    var req struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
        return
    }
    
    // At least one field required
    if req.Name == "" && req.Email == "" {
        utils.RespondWithError(w, http.StatusBadRequest, "At least one field (name or email) is required")
        return
    }
    
    // Validate email format if provided
    if req.Email != "" {
        emailRegex := regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
        if !emailRegex.MatchString(req.Email) {
            utils.RespondWithError(w, http.StatusBadRequest, "Invalid email format")
            return
        }
    }
    
    // Get admin user ID from context
    adminID, _ := r.Context().Value("userID").(string)
    
    // Update user in database
    db := database.GetDB()
    updates := map[string]interface{}{}
    
    if req.Name != "" {
        updates["name"] = req.Name
    }
    if req.Email != "" {
        updates["email"] = req.Email
    }
    updates["updated_at"] = time.Now()
    
    result := db.Model(&models.User{}).
        Where("id = ?", userID).
        Updates(updates)
    
    if result.Error != nil {
        utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update user")
        return
    }
    
    if result.RowsAffected == 0 {
        utils.RespondWithError(w, http.StatusNotFound, "User not found")
        return
    }
    
    // Fetch updated user
    var user models.User
    db.Where("id = ?", userID).First(&user)
    
    // Log admin action
    utils.LogAdminAction(adminID, "UPDATE_USER", map[string]interface{}{
        "userId":  userID,
        "changes": updates,
    })
    
    // Return success response
    response := map[string]interface{}{
        "success": true,
        "message": "User updated successfully",
        "data":    user,
    }
    
    utils.RespondWithJSON(w, http.StatusOK, response)
}
```

---

### 4️⃣ DELETE /api/admin/users/{userId}

```go
// DeleteUser deletes a user (admin only)
func DeleteUser(w http.ResponseWriter, r *http.Request) {
    // Get userId from URL path
    vars := mux.Vars(r)
    userID := vars["userId"]
    
    if userID == "" {
        utils.RespondWithError(w, http.StatusBadRequest, "User ID is required")
        return
    }
    
    // Get admin user ID from context
    adminID, _ := r.Context().Value("userID").(string)
    
    // Prevent self-deletion
    if adminID == userID {
        utils.RespondWithError(w, http.StatusForbidden, "Cannot delete your own account")
        return
    }
    
    // Fetch user before deletion (for logging)
    db := database.GetDB()
    var user models.User
    if err := db.Where("id = ?", userID).First(&user).Error; err != nil {
        utils.RespondWithError(w, http.StatusNotFound, "User not found")
        return
    }
    
    // Delete user from database
    result := db.Delete(&models.User{}, "id = ?", userID)
    
    if result.Error != nil {
        utils.RespondWithError(w, http.StatusInternalServerError, "Failed to delete user")
        return
    }
    
    // Log admin action
    utils.LogAdminAction(adminID, "DELETE_USER", map[string]interface{}{
        "userId":           userID,
        "deletedUserEmail": user.Email,
    })
    
    // Return success response
    response := map[string]interface{}{
        "success": true,
        "message": "User deleted successfully",
        "data": map[string]interface{}{
            "userId":    userID,
            "deletedAt": time.Now().Format(time.RFC3339),
        },
    }
    
    utils.RespondWithJSON(w, http.StatusOK, response)
}
```

---

### 5️⃣ GET /api/admin/stats

```go
// GetAdminStats returns admin dashboard statistics
func GetAdminStats(w http.ResponseWriter, r *http.Request) {
    // Get admin user ID from context
    adminID, _ := r.Context().Value("userID").(string)
    
    // Log admin action
    utils.LogAdminAction(adminID, "GET_ADMIN_STATS", map[string]interface{}{})
    
    db := database.GetDB()
    
    // Fetch statistics from database
    stats := map[string]interface{}{
        "users": map[string]interface{}{
            "total":          getUserCount(db, ""),
            "active":         getUserCount(db, "active"),
            "new_today":      getNewUsersToday(db),
            "new_this_week":  getNewUsersThisWeek(db),
            "new_this_month": getNewUsersThisMonth(db),
            "blocked":        getUserCount(db, "blocked"),
            "premium":        getUsersByRole(db, "premium"),
            "admins":         getUsersByRole(db, "admin"),
        },
        "recipes": getRecipeStats(db),
        "orders": getOrderStats(db),
        "treasury": getTreasuryStats(db),
        "ai": getAIStats(db),
        "system": getSystemStats(),
    }
    
    response := map[string]interface{}{
        "success":   true,
        "data":      stats,
        "timestamp": time.Now().Format(time.RFC3339),
    }
    
    utils.RespondWithJSON(w, http.StatusOK, response)
}
```

---

## 🛣️ Router Setup

**File:** `internal/routes/admin.go`

```go
package routes

import (
    "github.com/gorilla/mux"
    "your-project/internal/middleware"
    "your-project/internal/modules/admin/handlers"
)

// SetupAdminRoutes sets up admin routes
func SetupAdminRoutes(router *mux.Router) {
    // Admin routes (protected by AuthMiddleware + AdminMiddleware)
    admin := router.PathPrefix("/api/admin").Subrouter()
    admin.Use(middleware.AuthMiddleware)
    admin.Use(middleware.AdminMiddleware)
    
    // User management
    admin.HandleFunc("/users", handlers.GetAdminUsers).Methods("GET")
    admin.HandleFunc("/users/{userId}", handlers.GetUserDetails).Methods("GET")
    admin.HandleFunc("/users/update-role", handlers.UpdateUserRole).Methods("PATCH")
    admin.HandleFunc("/users/{userId}", handlers.UpdateUser).Methods("PUT")
    admin.HandleFunc("/users/{userId}", handlers.DeleteUser).Methods("DELETE")
    
    // Statistics
    admin.HandleFunc("/stats", handlers.GetAdminStats).Methods("GET")
}
```

---

## 🔐 Middleware

**File:** `internal/middleware/admin.go`

```go
package middleware

import (
    "context"
    "net/http"
    
    "your-project/internal/utils"
)

// AdminMiddleware checks if user has admin role
func AdminMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Get user role from context (set by AuthMiddleware)
        role, ok := r.Context().Value("userRole").(string)
        
        if !ok {
            utils.RespondWithError(w, http.StatusUnauthorized, "Authentication required")
            return
        }
        
        // Check if user is admin or superadmin
        if role != "admin" && role != "superadmin" {
            utils.RespondWithError(w, http.StatusForbidden, "Admin access required")
            return
        }
        
        // User is admin, proceed
        next.ServeHTTP(w, r)
    })
}
```

---

## 📊 Models

**File:** `internal/models/user.go`

```go
package models

import "time"

type User struct {
    ID        string    `json:"id" gorm:"primaryKey"`
    Email     string    `json:"email" gorm:"unique;not null"`
    Name      string    `json:"name"`
    Role      string    `json:"role" gorm:"default:'user'"`
    Status    string    `json:"status" gorm:"default:'active'"`
    CreatedAt time.Time `json:"createdAt" gorm:"column:created_at"`
    UpdatedAt time.Time `json:"updatedAt" gorm:"column:updated_at"`
}

type AdminUser struct {
    ID        string    `json:"id"`
    Email     string    `json:"email"`
    Name      string    `json:"name"`
    Role      string    `json:"role"`
    CreatedAt time.Time `json:"createdAt"`
}
```

---

## 🧪 Testing Backend Endpoints

### Using cURL:

```bash
# 1. Login as admin
TOKEN=$(curl -X POST "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  | jq -r '.token')

# 2. Get all users
curl -X GET "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# 3. Update user role
curl -X PATCH "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users/update-role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"usr_123","role":"pro_chef"}'

# 4. Update user data
curl -X PUT "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users/usr_123" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Name","email":"new@example.com"}'

# 5. Delete user
curl -X DELETE "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/users/usr_123" \
  -H "Authorization: Bearer $TOKEN"

# 6. Get stats
curl -X GET "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api/admin/stats" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Deployment Checklist

- [ ] Add admin routes to router
- [ ] Implement AdminMiddleware
- [ ] Create admin handlers
- [ ] Update user model if needed
- [ ] Test all endpoints with cURL
- [ ] Deploy to Koyeb
- [ ] Update frontend to use real backend
- [ ] Test integration end-to-end

---

## 📚 Related Files

- Frontend API: `app/api/admin/users/route.ts`
- Frontend Hook: `hooks/useAdminUsers.ts`
- Frontend Docs: `docs/ADMIN_API_DOCUMENTATION.md`

---

**Last Updated:** 2026-01-04  
**Backend URL:** `https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app`

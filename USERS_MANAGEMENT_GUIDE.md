# 👥 Users Management Guide

## Overview

The Users Management page (`/app/admin/users/page.tsx`) provides comprehensive user administration capabilities for the admin panel. It integrates with the centralized `adminApi` client for all backend communications.

## Features

### ✅ Core Functionality

1. **User Listing**
   - Display all users with real API data
   - Mock data fallback if API fails
   - Search filtering by name or email
   - Responsive table layout

2. **Role Management**
   - Dropdown select for role changes
   - Three roles: Student (👤), Instructor (👨‍🏫), Admin (👑)
   - Color-coded role badges:
     - Student: Gray
     - Instructor: Blue
     - Admin: Red
   - Real-time API updates

3. **User Deletion**
   - Confirmation dialog before deletion
   - Confirmation shows user name
   - Two-parameter function: `handleDeleteUser(userId, userName)`
   - Proper error handling and user feedback

4. **Statistics Dashboard**
   - Three stat cards showing distribution:
     - Total Students count + percentage
     - Total Instructors count + percentage
     - Total Admins count + percentage
   - Auto-calculated percentages

5. **Search & Filtering**
   - Search input with icon
   - Filters by name or email (case-insensitive)
   - Shows count of filtered results
   - Empty state message

## Data Structure

### AdminUser Interface

```typescript
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  level?: number;      // User's achievement level
  xp?: number;         // Experience points
  chefTokens?: number; // In-game currency
  createdAt?: string;  // ISO date string
}
```

## UI Components

### Header Section
- Gradient background (slate-800 to slate-900)
- Title with emoji (👥)
- User count statistics
- "Add User" button (placeholder)

### Error Alert
- Red alert banner when API fails
- Shows error message
- Notes that mock data is being used
- Auto-dismissal possible (add state if needed)

### Search Bar
- Full-width input with search icon
- Placeholder: "Поиск по имени или email..."
- Real-time filtering

### Users Table
- **Columns:**
  - 👤 Name (text)
  - 📧 Email (text)
  - 👑 Role (dropdown select)
  - 📊 Status (badge)
  - 📅 Registration (formatted date)
  - ⚙️ Actions (delete button)

- **Row Interactions:**
  - Hover: Light gray background
  - Role select: Color-coded, disabled during action
  - Delete: Red button, disabled during action

### Statistics Cards
- Grid layout (1 col mobile, 3 cols desktop)
- White background with border
- Large bold numbers
- Calculated percentages
- Emoji indicators

## API Integration

### Endpoints Used

```typescript
// Get all users
const data = await adminApi.getUsers();

// Update user role
await adminApi.updateUserRole(userId, newRole);

// Delete user
await adminApi.deleteUser(userId);
```

### Error Handling

- Try/catch blocks on all API calls
- Fallback to mock data if API fails
- User alerts for errors
- Console logging with `[UsersPage]` prefix
- Action in progress state prevents duplicate requests

## State Management

```typescript
const [users, setUsers] = useState<AdminUser[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [actionInProgress, setActionInProgress] = useState(false);
```

### State Details

- **users**: Array of AdminUser objects
- **loading**: true during initial data fetch
- **error**: Error message string or null
- **searchTerm**: Current search query
- **actionInProgress**: Prevents duplicate actions (delete, role update)

## Logging

All actions are logged with `[UsersPage]` prefix for debugging:

```typescript
console.log('[UsersPage] 📥 Загрузка пользователей...');
console.log('[UsersPage] ✅ Получены пользователи:', data);
console.log('[UsersPage] 🗑️  Удаление пользователя:', userId);
console.log('[UsersPage] 🔄 Обновление роли:', userId, role);
```

## TypeScript Fixes Applied

### Fixed Issues:

1. **Role Select Type Casting**
   ```typescript
   // Before: onChange={(e) => handleUpdateRole(u.id, e.target.value)}
   // After:
   onChange={(e) => handleUpdateRole(u.id, e.target.value as 'student' | 'instructor' | 'admin')}
   ```

2. **Removed Non-existent Properties**
   ```typescript
   // Before: {u.active ? "Активен" : "Неактивен"}
   // After:
   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
     ✅ Активен
   </span>
   ```

3. **Safe Optional Date Handling**
   ```typescript
   // Before: {new Date(u.createdAt).toLocaleDateString("uk-UA")}
   // After:
   {u.createdAt ? new Date(u.createdAt).toLocaleDateString("uk-UA") : "—"}
   ```

4. **Function Parameter Update**
   ```typescript
   // Before: onClick={() => handleDeleteUser(u.id)}
   // After:
   onClick={() => handleDeleteUser(u.id, u.name)}
   ```

## Performance Considerations

- Data loaded once on component mount via useEffect
- Filtered list computed per render (light operation)
- Mock data provides immediate fallback
- Action in progress state prevents rapid requests
- Proper loading and error states

## Future Enhancements

1. **Modal Dialogs**
   - User detail/edit modal
   - Bulk actions modal
   - Role change confirmation modal

2. **Sorting**
   - Click column headers to sort
   - Show sort direction indicators
   - Multiple sort columns

3. **Pagination**
   - Limit table to 10-20 rows per page
   - Navigate between pages
   - Show total pages

4. **Batch Operations**
   - Select multiple users
   - Bulk delete with confirmation
   - Bulk role change

5. **Export**
   - Export users to CSV
   - Export to PDF report
   - Filter export data

6. **Real-time Updates**
   - Refresh data periodically
   - WebSocket integration
   - Show update notifications

## Testing

### Manual Testing Steps

1. **Load Users**
   - Navigate to `/admin/users`
   - Check if users table loads
   - Verify loading spinner appears
   - Check mock data loads if API fails

2. **Search Functionality**
   - Type in search box
   - Verify results filter in real-time
   - Check case-insensitive search
   - Verify count updates

3. **Role Management**
   - Click role dropdown
   - Select new role
   - Verify color changes
   - Check API call succeeds
   - Verify table updates

4. **User Deletion**
   - Click delete button
   - Confirm in dialog
   - Verify user removed from table
   - Check error handling

5. **Statistics**
   - Verify counts match table
   - Check percentages calculate correctly
   - Verify updates when roles change

## Dependencies

- **React 18**: Component framework
- **lucide-react**: Icons (Search, Trash2, Eye, AlertCircle, UserPlus)
- **Tailwind CSS**: Styling
- **@/contexts/UserContext**: User context hook
- **@/src/lib/admin-api**: Admin API client

## File Path

```
/app/admin/users/page.tsx
├─ Interfaces: AdminUser
├─ Component: UsersPage (export default)
├─ Hooks: useEffect, useState, useUser
└─ Utilities: getRoleColor, getRoleEmoji
```

## Related Files

- `/src/lib/admin-api.ts` - API client
- `/app/admin/layout.tsx` - Admin navigation
- `/app/admin/page.tsx` - Admin dashboard
- `/contexts/UserContext.tsx` - User context

## Version History

- **v1.0** (2024): Initial implementation
  - User listing with API integration
  - Role management dropdown
  - User deletion with confirmation
  - Statistics cards
  - Search and filtering
  - Error handling with mock fallback
  - TypeScript strict mode compatibility
  - Comprehensive logging

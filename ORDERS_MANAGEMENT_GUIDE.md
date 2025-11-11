# 📦 Orders Management Guide

## Overview

The Orders Management page (`/app/admin/orders/page.tsx`) provides comprehensive order administration for the admin panel. It integrates with the centralized `adminApi` client and displays orders with status management capabilities.

## Features

### ✅ Core Functionality

1. **Order Listing**
   - Display all orders with real API data
   - Mock data fallback if API fails
   - Search filtering by customer, email, recipe, or order ID
   - Status filtering (All, Pending, Completed, Cancelled)
   - Responsive table layout

2. **Status Management**
   - Dropdown select for status changes
   - Three statuses: Pending (⏳), Completed (✅), Cancelled (❌)
   - Color-coded status badges:
     - Pending: Yellow
     - Completed: Green
     - Cancelled: Red
   - Real-time API updates

3. **Order Deletion**
   - Confirmation dialog before deletion
   - Confirmation shows order number
   - Two-parameter function: `handleDeleteOrder(orderId, orderNumber)`
   - Proper error handling and user feedback

4. **Statistics Dashboard**
   - Four stat cards showing:
     - Total orders count
     - Pending orders count (requires action)
     - Completed orders count + percentage
     - Total revenue (sum of all order amounts)

5. **Search & Filtering**
   - Search input with icon
   - Multi-field search (customer name, email, recipe, order ID)
   - Status filter dropdown
   - Shows count of filtered results
   - Empty state message

## Data Structure

### AdminOrder Interface

```typescript
interface AdminOrder {
  id: string;
  orderId?: string;           // Display-friendly order number (e.g., "ORD-001")
  customerId: string;         // Reference to user
  customerName: string;       // User's name
  customerEmail?: string;     // User's email
  recipeId: string;           // Reference to recipe
  recipeName: string;         // Recipe title
  status: 'pending' | 'completed' | 'cancelled';
  totalAmount?: number;       // Order total price
  items?: Array<{             // Order line items
    recipeId: string;
    quantity: number;
    price: number;
  }>;
  createdAt?: string;         // ISO date string
  updatedAt?: string;         // ISO date string (last status change)
}
```

## UI Components

### Header Section
- Gradient background (slate-800 to slate-900)
- Title with emoji (📦)
- Order count statistics
- "Refresh" button to reload data

### Error Alert
- Red alert banner when API fails
- Shows error message
- Notes that mock data is being used
- Auto-dismissal possible (add state if needed)

### Search & Filter Bar
- Full-width search input with search icon
- Status filter dropdown
- Multi-field search across:
  - Customer name
  - Customer email
  - Recipe name
  - Order ID

### Orders Table
- **Columns:**
  - 📋 Order Number (orderId or id)
  - 👤 Customer (name + email)
  - 🍜 Recipe (recipe name)
  - 💰 Amount (formatted to 2 decimals)
  - 📊 Status (dropdown with color)
  - 📅 Date (formatted Ukrainian)
  - ⚙️ Actions (delete button)

- **Row Interactions:**
  - Hover: Light gray background
  - Status select: Color-coded, disabled during action
  - Delete: Red button, disabled during action

### Statistics Cards
- Grid layout (1 col mobile, 4 cols desktop)
- White background with border
- Large bold numbers
- Meaningful subtext
- Emoji indicators

**Cards:**
1. **Total Orders**: Count of all orders
2. **Pending**: Orders awaiting action
3. **Completed**: Count + percentage
4. **Revenue**: Sum of all totalAmount values

## API Integration

### Endpoints Used

```typescript
// Get recent orders (last 10-20)
const data = await adminApi.getRecentOrders();

// Update order status
await adminApi.updateOrderStatus(orderId, newStatus);

// Future endpoints (to implement)
// await adminApi.deleteOrder(orderId);
// await adminApi.getOrders();  // Get all orders with pagination
```

### Error Handling

- Try/catch blocks on all API calls
- Fallback to mock data if API fails
- User alerts for errors
- Console logging with `[OrdersPage]` prefix
- Action in progress state prevents duplicate requests

## State Management

```typescript
const [orders, setOrders] = useState<AdminOrder[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');
const [actionInProgress, setActionInProgress] = useState(false);
```

### State Details

- **orders**: Array of AdminOrder objects
- **loading**: true during initial data fetch
- **error**: Error message string or null
- **searchTerm**: Current search query
- **statusFilter**: Currently selected status filter
- **actionInProgress**: Prevents duplicate actions (delete, status update)

## Logging

All actions are logged with `[OrdersPage]` prefix for debugging:

```typescript
console.log('[OrdersPage] 📥 Загрузка заказов...');
console.log('[OrdersPage] ✅ Получены заказы:', data);
console.log('[OrdersPage] 🗑️  Удаление заказа:', orderId);
console.log('[OrdersPage] 🔄 Обновление статуса:', orderId, status);
```

## Features Summary

### ✅ Implemented

- [x] Order listing with API integration
- [x] Status management dropdown with color coding
- [x] Order deletion with confirmation
- [x] Statistics dashboard (4 cards)
- [x] Search filtering (multi-field)
- [x] Status filtering
- [x] Error handling with mock fallback
- [x] Loading states
- [x] Empty state message
- [x] Responsive design (mobile, tablet, desktop)
- [x] Comprehensive logging

### ⏳ Not Yet Implemented

- [ ] Order detail modal
- [ ] Payment status display
- [ ] Invoice generation
- [ ] Bulk status updates
- [ ] Export orders to CSV
- [ ] Pagination for large datasets
- [ ] Real-time order updates
- [ ] Order search by date range
- [ ] Customer profile link

## Performance Considerations

- Data loaded once on component mount via useEffect
- Filtered list computed per render (light operation)
- Mock data provides immediate fallback
- Action in progress state prevents rapid requests
- Proper loading and error states

## Future Enhancements

### Priority 1: Order Detail Modal
- Display full order information
- Show all order items
- Display customer details
- Edit order notes
- View payment status

### Priority 2: Bulk Operations
- Select multiple orders
- Bulk status change
- Bulk delete with confirmation
- Bulk export

### Priority 3: Advanced Filtering
- Date range picker
- Amount range filter
- Customer filter (dropdown)
- Multiple status select

### Priority 4: Real-time Features
- Refresh data periodically
- WebSocket for live updates
- Order status notifications
- New order alerts

### Priority 5: Reporting
- Export to CSV
- Export to PDF
- Monthly revenue report
- Order statistics chart

## Testing

### Manual Testing Steps

1. **Load Orders**
   - Navigate to `/admin/orders`
   - Check if orders table loads
   - Verify loading spinner appears
   - Check mock data loads if API fails

2. **Search Functionality**
   - Type customer name
   - Type email address
   - Type recipe name
   - Type order ID
   - Verify results filter in real-time

3. **Status Filtering**
   - Click status dropdown
   - Select "All" - shows all orders
   - Select "Pending" - shows only pending
   - Select "Completed" - shows only completed
   - Select "Cancelled" - shows only cancelled

4. **Status Management**
   - Click status dropdown on order row
   - Select new status
   - Verify color changes
   - Check API call succeeds
   - Verify table updates
   - Check updatedAt timestamp changes

5. **Order Deletion**
   - Click delete button
   - Verify confirmation dialog shows
   - Click cancel - order stays
   - Click delete button again
   - Click confirm - order removed from table
   - Verify count updates

6. **Statistics Verification**
   - Count pending orders manually
   - Verify stat card matches
   - Count completed orders
   - Verify percentage calculation
   - Sum all amounts
   - Verify revenue calculation

## Dependencies

- **React 18**: Component framework
- **lucide-react**: Icons (Search, Trash2, Eye, AlertCircle, RefreshCw)
- **Tailwind CSS**: Styling
- **@/src/lib/admin-api**: Admin API client

## File Path

```
/app/admin/orders/page.tsx
├─ Interfaces: AdminOrder
├─ Component: OrdersPage (export default)
├─ Hooks: useEffect, useState
└─ Utilities: getStatusColor, filteredOrders logic
```

## Related Files

- `/src/lib/admin-api.ts` - API client with methods
- `/app/admin/layout.tsx` - Admin navigation
- `/app/admin/page.tsx` - Admin dashboard
- `/app/admin/users/page.tsx` - Users management (similar pattern)

## Styling Guidelines

### Color Scheme
- Primary: `bg-purple-600` / `text-purple-700`
- Pending: `bg-yellow-100 text-yellow-700`
- Completed: `bg-green-100 text-green-700`
- Cancelled: `bg-red-100 text-red-700`
- Success: `bg-green-100 text-green-700`
- Error: `bg-red-100 text-red-700`

### Component Layout
- Header: Gradient background, emoji + title
- Filters: Search + dropdown on same row
- Table: Scrollable with hover effects
- Stats: 4-column grid (responsive)
- Empty state: Centered icon + text

## Version History

- **v1.0** (2024): Initial implementation
  - Order listing with API integration
  - Status management dropdown
  - Order deletion with confirmation
  - Statistics cards
  - Search and filtering
  - Error handling with mock fallback
  - TypeScript strict mode compatibility
  - Comprehensive logging

## Known Limitations

- No pagination (shows all/filtered orders)
- No order detail view
- Delete endpoint not implemented in API
- No real-time updates
- No date range filtering
- No export functionality

## Integration Checklist

- [x] API client has `getRecentOrders()` method
- [x] API client has `updateOrderStatus(id, status)` method
- [ ] API client needs `deleteOrder(id)` method
- [ ] API client should have `getOrders(page, limit)` for pagination
- [ ] Sidebar navigation includes Orders link
- [ ] Page has proper role-based access control
- [x] Logging is comprehensive
- [ ] Error boundaries implemented

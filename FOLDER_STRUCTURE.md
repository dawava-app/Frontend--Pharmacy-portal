# Pharmacy Portal - Folder Structure Documentation

## Project Overview
A comprehensive pharmacy management dashboard with role-based access for Admins, Staff, and Managers to manage inventory, sales, orders, and operations.

---

## 📁 Root Structure

```
PharmacyPortal/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── shared/                  # Shared components, directives, pipes
│   │   ├── app.config.ts           # Application configuration
│   │   ├── app.routes.ts           # Main routing configuration
│   │   └── app.ts                  # Root component
│   ├── assets/                      # Static assets
│   ├── environments/                # Environment configurations
│   └── styles.scss                 # Global styles
├── public/                          # Public static files
└── package.json                     # Dependencies
```

---

## 📂 Detailed Structure

### `/src/app/core/` - Core Module (Singleton Services)

```
core/
├── guards/
│   ├── auth.guard.ts              # Protect routes from unauthorized access
│   ├── role.guard.ts              # Role-based route protection (admin/staff/manager)
│   └── .gitkeep
├── interceptors/
│   ├── auth.interceptor.ts        # Add JWT token to requests
│   ├── error.interceptor.ts       # Global error handling
│   ├── loading.interceptor.ts     # Show/hide loading spinner
│   └── .gitkeep
├── services/
│   ├── auth.service.ts            # Authentication & authorization
│   ├── user.service.ts            # User management
│   ├── notification.service.ts    # Toast notifications
│   ├── storage.service.ts         # LocalStorage/SessionStorage wrapper
│   └── .gitkeep
└── models/
    ├── user.model.ts              # User interface/class
    └── role.enum.ts               # User roles (Admin, Staff, Manager)
```

### `/src/app/features/` - Feature Modules

```
features/
├── auth/
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   ├── register/
│   │   ├── register.component.ts
│   │   ├── register.component.html
│   │   └── register.component.scss
│   ├── forgot-password/
│   │   ├── forgot-password.component.ts
│   │   ├── forgot-password.component.html
│   │   └── forgot-password.component.scss
│   ├── reset-password/
│   │   ├── reset-password.component.ts
│   │   ├── reset-password.component.html
│   │   └── reset-password.component.scss
│   └── .gitkeep
│
├── dashboard/
│   ├── admin-dashboard/           # Dashboard for Admin users
│   │   ├── admin-dashboard.component.ts
│   │   ├── admin-dashboard.component.html
│   │   └── admin-dashboard.component.scss
│   ├── staff-dashboard/           # Dashboard for Staff users
│   │   ├── staff-dashboard.component.ts
│   │   ├── staff-dashboard.component.html
│   │   └── staff-dashboard.component.scss
│   ├── manager-dashboard/         # Dashboard for Manager users
│   │   ├── manager-dashboard.component.ts
│   │   ├── manager-dashboard.component.html
│   │   └── manager-dashboard.component.scss
│   ├── widgets/                   # Dashboard widgets
│   │   ├── stats-card/
│   │   ├── sales-chart/
│   │   ├── recent-orders/
│   │   └── low-stock-alert/
│   └── .gitkeep
│
├── inventory/                     # Stock/Inventory Management
│   ├── product-list/
│   │   ├── product-list.component.ts
│   │   ├── product-list.component.html
│   │   └── product-list.component.scss
│   ├── product-detail/
│   │   ├── product-detail.component.ts
│   │   ├── product-detail.component.html
│   │   └── product-detail.component.scss
│   ├── add-product/
│   │   ├── add-product.component.ts
│   │   ├── add-product.component.html
│   │   └── add-product.component.scss
│   ├── edit-product/
│   │   ├── edit-product.component.ts
│   │   ├── edit-product.component.html
│   │   └── edit-product.component.scss
│   ├── stock-alerts/              # Low stock & expiry alerts
│   │   ├── stock-alerts.component.ts
│   │   ├── stock-alerts.component.html
│   │   └── stock-alerts.component.scss
│   ├── services/
│   │   ├── inventory.service.ts
│   │   └── product.service.ts
│   └── models/
│       ├── product.model.ts
│       └── stock.model.ts
│
├── orders/                        # Order Management
│   ├── order-list/
│   │   ├── order-list.component.ts
│   │   ├── order-list.component.html
│   │   └── order-list.component.scss
│   ├── order-detail/
│   │   ├── order-detail.component.ts
│   │   ├── order-detail.component.html
│   │   └── order-detail.component.scss
│   ├── create-order/
│   │   ├── create-order.component.ts
│   │   ├── create-order.component.html
│   │   └── create-order.component.scss
│   ├── services/
│   │   └── order.service.ts
│   └── models/
│       └── order.model.ts
│
├── sales/                         # Sales Management
│   ├── sales-overview/
│   │   ├── sales-overview.component.ts
│   │   ├── sales-overview.component.html
│   │   └── sales-overview.component.scss
│   ├── daily-sales/
│   │   ├── daily-sales.component.ts
│   │   ├── daily-sales.component.html
│   │   └── daily-sales.component.scss
│   ├── pos/                       # Point of Sale
│   │   ├── pos.component.ts
│   │   ├── pos.component.html
│   │   └── pos.component.scss
│   ├── services/
│   │   └── sales.service.ts
│   └── models/
│       └── sale.model.ts
│
├── users/                         # User Management (Admin only)
│   ├── user-list/
│   │   ├── user-list.component.ts
│   │   ├── user-list.component.html
│   │   └── user-list.component.scss
│   ├── user-detail/
│   │   ├── user-detail.component.ts
│   │   ├── user-detail.component.html
│   │   └── user-detail.component.scss
│   ├── add-user/
│   │   ├── add-user.component.ts
│   │   ├── add-user.component.html
│   │   └── add-user.component.scss
│   └── edit-user/
│       ├── edit-user.component.ts
│       ├── edit-user.component.html
│       └── edit-user.component.scss
│
├── suppliers/                     # Supplier Management
│   ├── supplier-list/
│   │   ├── supplier-list.component.ts
│   │   ├── supplier-list.component.html
│   │   └── supplier-list.component.scss
│   ├── supplier-detail/
│   │   ├── supplier-detail.component.ts
│   │   ├── supplier-detail.component.html
│   │   └── supplier-detail.component.scss
│   ├── add-supplier/
│   │   ├── add-supplier.component.ts
│   │   ├── add-supplier.component.html
│   │   └── add-supplier.component.scss
│   ├── services/
│   │   └── supplier.service.ts
│   └── models/
│       └── supplier.model.ts
│
├── reports/                       # Reports & Analytics
│   ├── sales-reports/
│   │   ├── sales-reports.component.ts
│   │   ├── sales-reports.component.html
│   │   └── sales-reports.component.scss
│   ├── inventory-reports/
│   │   ├── inventory-reports.component.ts
│   │   ├── inventory-reports.component.html
│   │   └── inventory-reports.component.scss
│   ├── profit-loss/
│   │   ├── profit-loss.component.ts
│   │   ├── profit-loss.component.html
│   │   └── profit-loss.component.scss
│   ├── expiry-reports/
│   │   ├── expiry-reports.component.ts
│   │   ├── expiry-reports.component.html
│   │   └── expiry-reports.component.scss
│   └── services/
│       └── report.service.ts
│
├── settings/                      # System Settings
│   ├── profile/
│   │   ├── profile.component.ts
│   │   ├── profile.component.html
│   │   └── profile.component.scss
│   ├── change-password/
│   │   ├── change-password.component.ts
│   │   ├── change-password.component.html
│   │   └── change-password.component.scss
│   ├── system-settings/           # Admin only
│   │   ├── system-settings.component.ts
│   │   ├── system-settings.component.html
│   │   └── system-settings.component.scss
│   └── pharmacy-info/
│       ├── pharmacy-info.component.ts
│       ├── pharmacy-info.component.html
│       └── pharmacy-info.component.scss
│
└── notifications/                 # Notification Center
    ├── notification-list/
    │   ├── notification-list.component.ts
    │   ├── notification-list.component.html
    │   └── notification-list.component.scss
    └── services/
        └── notification.service.ts
```

### `/src/app/shared/` - Shared Module

```
shared/
├── components/
│   ├── navbar/
│   │   ├── navbar.component.ts
│   │   ├── navbar.component.html
│   │   └── navbar.component.scss
│   ├── sidebar/
│   │   ├── sidebar.component.ts
│   │   ├── sidebar.component.html
│   │   └── sidebar.component.scss
│   ├── footer/
│   │   ├── footer.component.ts
│   │   ├── footer.component.html
│   │   └── footer.component.scss
│   ├── loading-spinner/
│   │   ├── loading-spinner.component.ts
│   │   ├── loading-spinner.component.html
│   │   └── loading-spinner.component.scss
│   ├── confirmation-dialog/
│   │   ├── confirmation-dialog.component.ts
│   │   ├── confirmation-dialog.component.html
│   │   └── confirmation-dialog.component.scss
│   ├── table/                     # Reusable data table
│   │   ├── table.component.ts
│   │   ├── table.component.html
│   │   └── table.component.scss
│   ├── breadcrumb/
│   │   ├── breadcrumb.component.ts
│   │   ├── breadcrumb.component.html
│   │   └── breadcrumb.component.scss
│   └── .gitkeep
│
├── directives/
│   ├── has-role.directive.ts      # Show/hide elements based on user role
│   ├── tooltip.directive.ts
│   ├── number-only.directive.ts
│   └── .gitkeep
│
├── pipes/
│   ├── currency-format.pipe.ts
│   ├── date-format.pipe.ts
│   ├── search-filter.pipe.ts
│   ├── status-badge.pipe.ts
│   └── .gitkeep
│
└── interfaces/
    ├── api-response.interface.ts
    ├── pagination.interface.ts
    └── .gitkeep
```

### `/src/assets/` - Static Assets

```
assets/
├── images/
│   ├── logo.png
│   ├── user-placeholder.png
│   └── product-placeholder.png
├── icons/
│   └── (SVG icons)
├── fonts/
│   └── (Custom fonts if needed)
└── data/
    └── (Mock data for development)
```

---

## 🎯 User Roles & Permissions

### **Admin**
- Full access to all features
- User management (create, edit, delete users)
- System settings configuration
- View all reports and analytics
- Manage inventory, orders, sales
- Supplier management

### **Manager**
- View and manage inventory
- Generate reports
- View sales analytics
- Manage orders
- View stock alerts
- Limited user management (view only)

### **Staff**
- Point of Sale (POS) operations
- Create and view orders
- View inventory
- Limited reports access
- Cannot modify system settings
- Cannot manage users

---

## 🔐 Authentication Flow

1. User lands on login page
2. Enters credentials
3. Backend validates and returns JWT token + user role
4. Token stored in localStorage
5. User redirected to role-specific dashboard:
   - Admin → Admin Dashboard
   - Manager → Manager Dashboard
   - Staff → Staff Dashboard
6. Guards protect routes based on authentication & roles

---

## 📊 Key Features by Module

### **Inventory Module**
- Add/Edit/Delete products
- Track stock levels
- Low stock alerts
- Expiry date tracking
- Batch/Lot number management
- Barcode scanning support

### **Orders Module**
- Create new orders
- Edit pending orders
- View order history
- Order status tracking (Pending, Processing, Completed, Cancelled)
- Print invoices

### **Sales Module**
- Point of Sale (POS) interface
- Daily sales tracking
- Sales by product/category
- Revenue analytics
- Return/Refund management

### **Reports Module**
- Sales reports (daily, weekly, monthly)
- Inventory reports
- Profit & Loss statements
- Expiring products report
- Best-selling products
- Export to PDF/Excel

### **User Management**
- Add/Edit/Delete users
- Assign roles
- Activate/Deactivate accounts
- User activity logs

---

## 🛠️ Technical Stack

- **Framework:** Angular (latest version)
- **UI Components:** Custom + Angular Material (optional)
- **State Management:** Angular Services + RxJS
- **Routing:** Angular Router with lazy loading
- **HTTP:** HttpClient with Interceptors
- **Forms:** Reactive Forms
- **Authentication:** JWT tokens
- **Charts:** Chart.js or ng2-charts (for analytics)

---

## 📝 Naming Conventions

- **Components:** `kebab-case` (e.g., `product-list.component.ts`)
- **Services:** `PascalCase` + Service suffix (e.g., `InventoryService`)
- **Interfaces:** `PascalCase` + Interface suffix (e.g., `ProductInterface`)
- **Enums:** `PascalCase` (e.g., `UserRole`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 🚀 Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Configure environment variables in `src/environments/`
4. Run `npm start` to start the development server
5. Navigate to `http://localhost:4200`

---

## 📦 Future Enhancements

- Mobile app (Progressive Web App - PWA)
- Multi-pharmacy support
- Online ordering for customers
- Prescription management
- Insurance claim processing
- SMS/Email notifications
- Barcode/QR code generation
- Integration with pharmacy suppliers APIs

---

**Last Updated:** March 10, 2026

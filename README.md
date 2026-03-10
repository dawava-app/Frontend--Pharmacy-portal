# 💊 Pharmacy Portal Dashboard

A comprehensive pharmacy management system built with Angular 21 and Tailwind CSS. This application provides role-based access control for Admins, Managers, and Staff to manage inventory, sales, orders, suppliers, and generate analytics reports.

## 🎯 Project Overview

The Pharmacy Portal is a full-featured dashboard designed to streamline pharmacy operations with:

- **Inventory Management** - Track products, stock levels, and expiry dates
- **Sales & POS** - Point of Sale interface with daily sales tracking
- **Order Management** - Create and manage customer orders
- **User Management** - Role-based user administration (Admin only)
- **Reports & Analytics** - Sales, inventory, and profit & loss reports
- **Supplier Management** - Manage supplier information and orders
- **Real-time Alerts** - Low stock and expiry date notifications
- **Role-based Dashboards** - Customized views for Admin, Manager, and Staff

## 👥 User Roles & Permissions

### **Admin**
- Full system access
- User management (create, edit, delete)
- System configuration & settings
- View all analytics and reports
- Manage suppliers and inventory

### **Manager**
- Inventory and order management
- View analytics and reports
- Staff activity monitoring
- Supplier management
- No user administration access

### **Staff**
- Point of Sale (POS) operations
- Create and view orders
- View inventory and stock levels
- Limited report access
- No system settings or user management

## 🛠️ Tech Stack

- **Framework:** Angular 21.2.2
- **Styling:** Tailwind CSS 4
- **Routing:** Angular Router with lazy loading
- **State Management:** RxJS & Angular Services
- **Forms:** Reactive Forms
- **Authentication:** JWT Token-based
- **HTTP:** HttpClient with Interceptors
- **Type Safety:** TypeScript 5.6

## 📋 Prerequisites

- Node.js 18+ and npm 9+
- Angular CLI 21+
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PharmacyPortal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development Server

Start the development server:
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application automatically reloads when you modify source files.

### 4. Access the Application

Default demo credentials (if seed data is provided):
- **Admin:** admin@pharmacy.com / password
- **Manager:** manager@pharmacy.com / password
- **Staff:** staff@pharmacy.com / password

## 📁 Project Structure

Detailed folder structure documentation is available in [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md). 

Key directories:
```
src/app/
├── core/           # Singleton services, guards, interceptors
├── features/       # Feature modules (lazy-loaded)
│   ├── auth/
│   ├── dashboard/
│   ├── inventory/
│   ├── orders/
│   ├── sales/
│   ├── users/
│   ├── suppliers/
│   ├── reports/
│   └── settings/
└── shared/         # Reusable components, directives, pipes
```

## 🔧 Development

### Generate a Component
```bash
ng generate component features/dashboard/components/stats-card
```

### Generate a Service
```bash
ng generate service core/services/inventory
```

### Generate a Guard
```bash
ng generate guard core/guards/auth
```

### Generate an Interceptor
```bash
ng generate interceptor core/interceptors/auth
```

For all available schematics:
```bash
ng generate --help
```

## 🏗️ Building

### Production Build
```bash
ng build
```

Build artifacts are stored in the `dist/` directory.

### Production Build with Optimization
```bash
ng build --configuration production
```

## ✅ Testing

### Unit Tests
```bash
npm test
# or
ng test
```

Runs tests via Karma test runner.

### End-to-End Tests
```bash
ng e2e
```

## 📊 Key Features

### Dashboard Module
- Role-specific dashboards with key metrics
- Real-time statistics cards
- Sales charts and trends
- Recent orders widget
- Low stock alerts

### Inventory Module
- Product CRUD operations
- Stock level tracking
- Barcode support (future)
- Expiry date management
- Batch/Lot tracking
- Low stock alerts

### Sales Module
- Point of Sale (POS) interface
- Daily sales tracking
- Sales analytics
- Return/Refund management
- Invoice printing

### Order Management
- Create and manage orders
- Order status tracking (Pending, Processing, Completed, Cancelled)
- Invoice generation
- Order history

### Reports
- Sales reports (daily, weekly, monthly)
- Inventory reports
- Profit & Loss statements
- Expiring products report
- Export to PDF/Excel (future)

### User Management (Admin Only)
- User CRUD operations
- Role assignment
- Account activation/deactivation
- Activity logging

## 🔐 Authentication & Security

- JWT token-based authentication
- Role-based access control (RBAC)
- Route guards for protected pages
- HTTP interceptors for token management
- Unauthorized access handling

## 🧪 API Integration

The application communicates with a backend API. Configure the API endpoint in:
```
src/environments/environment.ts
```

**Example:**
```typescript
export const environment = {
  apiUrl: 'http://localhost:3000/api'
};
```

## 📦 Dependencies

Key packages:
- `@angular/core` - Angular framework
- `@angular/router` - Routing
- `@angular/forms` - Form handling
- `@angular/common/http` - HTTP client
- `rxjs` - Reactive programming
- `tailwindcss` - CSS framework

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## 📝 Code Standards

- **Component naming:** `kebab-case` (e.g., `product-list.component.ts`)
- **Service naming:** `PascalCase` + Service (e.g., `InventoryService`)
- **Interface naming:** `PascalCase` + Interface (e.g., `ProductInterface`)
- **Variables:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

## 🐛 Known Issues & Limitations

- @hugeicons/angular uses Angular <21 peer dependencies (use `--legacy-peer-deps` if reinstalling)
- Mobile responsiveness work in progress
- Offline mode not yet implemented

## 📚 Resources

- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [RxJS Guide](https://rxjs.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

## 🚧 Roadmap

- [ ] Mobile app (PWA)
- [ ] Multi-pharmacy support
- [ ] Online customer ordering
- [ ] Prescription management
- [ ] SMS/Email notifications
- [ ] Barcode/QR code generation
- [ ] Supplier API integration
- [ ] Advanced analytics dashboard

## 📄 License

This project is part of a graduation project. All rights reserved.

## 👨‍💼 Support & Contact

For issues, questions, or suggestions, please create an GitHub issue or contact the development team.

---

**Last Updated:** March 10, 2026  
**Angular Version:** 21.2.2  
**Node Version:** 18+

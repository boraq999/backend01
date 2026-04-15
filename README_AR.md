# Hatim ERP - Standalone Branch System (المرحلة 1)

نظام ERP/POS لإدارة فرع تجزئة مستقل - Offline-First

## المميزات

- ✅ إدارة المنتجات (Products)
- ✅ إدارة المخزون Event-Based (Inventory)
- ✅ المشتريات (Purchases)
- ✅ المبيعات (Sales)
- ✅ المصروفات (Expenses)
- ✅ العملاء والموردين (Customers & Suppliers)
- ✅ المحاسبة الأساسية (Basic Accounting)
- ✅ نظام المستخدمين (Auth)

## التقنيات المستخدمة

- **Backend**: NestJS + TypeORM + MySQL
- **UUID**: UUIDv7 (BINARY(16))
- **Architecture**: Modular Monolith + Event-Based Inventory

## التثبيت والتشغيل

### 1. تثبيت الحزم
```bash
pnpm install
```

### 2. إعداد قاعدة البيانات
- أنشئ قاعدة بيانات MySQL باسم `hatim_branch_erp`
- تأكد من إعدادات الاتصال في ملف `.env`

### 3. تشغيل المشروع
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

## API Endpoints

### Auth
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول

### Products
- `GET /api/products` - قائمة المنتجات
- `POST /api/products` - إضافة منتج
- `PUT /api/products/:id` - تعديل منتج
- `DELETE /api/products/:id` - حذف منتج

### Inventory
- `GET /api/inventory/stock` - المخزون الكامل
- `GET /api/inventory/stock/:productId` - مخزون منتج
- `GET /api/inventory/history/:productId` - تاريخ حركة منتج

### Purchases
- `POST /api/purchases` - إنشاء فاتورة شراء
- `GET /api/purchases` - قائمة المشتريات
- `PUT /api/purchases/:id/receive` - استلام البضاعة
- `PUT /api/purchases/:id/post` - ترحيل للمخزون

### Sales
- `POST /api/sales` - إنشاء فاتورة بيع
- `GET /api/sales` - قائمة المبيعات
- `PUT /api/sales/:id/close` - إغلاق فاتورة

### Expenses
- `POST /api/expenses` - تسجيل مصروف
- `GET /api/expenses` - قائمة المصروفات

### Customers & Suppliers
- `GET/POST /api/customers` - إدارة العملاء
- `GET/POST /api/suppliers` - إدارة الموردين

### Accounting
- `GET/POST /api/cash-accounts` - الصناديق النقدية
- `GET/POST /api/payment-transactions` - حركات الدفع والقبض

## هيكل قاعدة البيانات

### الجداول الرئيسية
- `products` - المنتجات
- `inventory_events` - حركات المخزون (Event-Based)
- `purchases` + `purchase_items` - المشتريات
- `sales` + `sale_items` - المبيعات
- `expenses` - المصروفات
- `customers` - العملاء
- `suppliers` - الموردين
- `cash_accounts` - الصناديق
- `payment_transactions` - حركات الدفع
- `users` - المستخدمين
- `outbox` - للمزامنة المستقبلية

## المراحل القادمة

### المرحلة 2
- إضافة Sync Engine
- Outbox Pattern Worker
- ربط بالنظام المركزي

### المرحلة 3
- التحويلات بين الفروع عبر المركز
- النظام المحاسبي الكامل
- التقارير المتقدمة

## الملاحظات

- النظام يعمل حاليًا كفرع مستقل تمامًا
- جميع العمليات محلية بدون اتصال بالمركز
- المخزون يُدار عبر Events فقط (لا يوجد عمود stock)
- جاهز للتوسع والربط بالمركز لاحقًا

## المطور

تم التطوير بناءً على الوثيقة الهندسية المعتمدة

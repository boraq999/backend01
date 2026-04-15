# دليل البدء السريع - Hatim ERP

## الخطوات الأساسية

### 1. تثبيت المتطلبات
- Node.js (v18+)
- MySQL (v8+)
- pnpm

### 2. إعداد قاعدة البيانات
```sql
CREATE DATABASE hatim_branch_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. تثبيت الحزم
```bash
cd backend
pnpm install
```

### 4. إعداد ملف .env
انسخ `.env.example` إلى `.env` وعدّل الإعدادات:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=hatim_branch_erp
```

### 5. تشغيل المشروع
```bash
# Development mode
pnpm start:dev

# Production mode
pnpm build
pnpm start:prod
```

### 6. اختبار API
افتح المتصفح على: `http://localhost:3000/api`

## أول خطوات الاستخدام

### 1. تسجيل مستخدم
```bash
POST http://localhost:3000/api/auth/register
{
  "username": "admin",
  "password": "admin123",
  "fullName": "المدير",
  "role": "admin"
}
```

### 2. تسجيل الدخول
```bash
POST http://localhost:3000/api/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

### 3. إضافة منتج
```bash
POST http://localhost:3000/api/products
{
  "name": "منتج تجريبي",
  "sku": "PROD001",
  "purchasePrice": 100,
  "salePrice": 150,
  "unit": "قطعة"
}
```

### 4. إضافة مورد
```bash
POST http://localhost:3000/api/suppliers
{
  "name": "مورد تجريبي",
  "phone": "0123456789"
}
```

### 5. إنشاء فاتورة شراء
```bash
POST http://localhost:3000/api/purchases
{
  "supplierId": "supplier-uuid-here",
  "items": [
    {
      "productId": "product-uuid-here",
      "quantity": 10,
      "unitPrice": 100
    }
  ]
}
```

### 6. استلام وترحيل الشراء
```bash
# استلام البضاعة
PUT http://localhost:3000/api/purchases/{id}/receive

# ترحيل للمخزون
PUT http://localhost:3000/api/purchases/{id}/post
```

### 7. إنشاء فاتورة بيع
```bash
POST http://localhost:3000/api/sales
{
  "items": [
    {
      "productId": "product-uuid-here",
      "quantity": 2,
      "unitPrice": 150
    }
  ],
  "paidAmount": 300
}
```

### 8. عرض المخزون
```bash
GET http://localhost:3000/api/inventory/stock
```

## الملاحظات المهمة

- جميع الـ IDs هي UUIDv7
- المخزون يُدار عبر Events فقط
- النظام يعمل Offline-First
- synchronize: true في Development فقط (يُنشئ الجداول تلقائيًا)

## المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات
- تأكد من تشغيل MySQL
- تأكد من صحة بيانات الاتصال في `.env`
- تأكد من إنشاء قاعدة البيانات

### Port 3000 مستخدم
غيّر PORT في ملف `.env`:
```env
PORT=3001
```

## الدعم
راجع ملف `README_AR.md` للمزيد من التفاصيل

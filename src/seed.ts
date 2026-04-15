import { DataSource } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';
import * as bcrypt from 'bcrypt';

// Helper function to convert UUID to binary
function toBinary(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

// Generate realistic product data
const categories = [
  { name: 'أجهزة إلكترونية', items: ['هاتف', 'لابتوب', 'تابلت', 'ساعة ذكية', 'سماعات', 'شاحن', 'كيبل', 'باور بانك'] },
  { name: 'ملابس رجالية', items: ['قميص', 'بنطلون', 'جاكيت', 'حذاء', 'حزام', 'جوارب', 'تيشيرت', 'بدلة'] },
  { name: 'ملابس نسائية', items: ['فستان', 'بلوزة', 'تنورة', 'حذاء', 'حقيبة', 'وشاح', 'عباية', 'جاكيت'] },
  { name: 'أدوات منزلية', items: ['طقم أواني', 'مكنسة', 'مكواة', 'خلاط', 'محمصة', 'غلاية', 'مقلاة', 'طنجرة ضغط'] },
  { name: 'مواد غذائية', items: ['أرز', 'سكر', 'زيت', 'طحين', 'معكرونة', 'شاي', 'قهوة', 'حليب'] },
  { name: 'مستحضرات تجميل', items: ['عطر', 'كريم', 'شامبو', 'صابون', 'مكياج', 'مزيل عرق', 'معجون أسنان', 'غسول'] },
  { name: 'ألعاب أطفال', items: ['دمية', 'سيارة', 'مكعبات', 'لعبة تركيب', 'كرة', 'دراجة', 'لوح رسم', 'ألعاب تعليمية'] },
  { name: 'قرطاسية', items: ['دفتر', 'قلم', 'مسطرة', 'ممحاة', 'مقص', 'دباسة', 'ملفات', 'آلة حاسبة'] },
  { name: 'رياضة', items: ['كرة قدم', 'حبل قفز', 'دمبل', 'سجادة يوغا', 'حذاء رياضي', 'ملابس رياضية', 'زجاجة ماء', 'حقيبة رياضية'] },
  { name: 'كتب', items: ['رواية', 'كتاب ديني', 'كتاب علمي', 'قصص أطفال', 'كتاب طبخ', 'كتاب تاريخ', 'مجلة', 'كتاب تطوير ذات'] },
];

const brands = ['سامسونج', 'أبل', 'هواوي', 'شاومي', 'إل جي', 'سوني', 'نايكي', 'أديداس', 'زارا', 'H&M'];

// Generate 500 products
function generateProducts() {
  const products = [];
  let skuCounter = 1000;

  for (let i = 0; i < 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const item = category.items[Math.floor(Math.random() * category.items.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const purchasePrice = Math.floor(Math.random() * 900) + 100; // 100-1000
    const salePrice = purchasePrice + Math.floor(purchasePrice * (0.2 + Math.random() * 0.5)); // 20-70% profit

    products.push({
      id: uuidv7(),
      name: `${brand} ${item} ${Math.floor(Math.random() * 100)}`,
      sku: `SKU-${skuCounter++}`,
      barcode: `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
      description: `${item} من ${brand} - جودة عالية`,
      purchasePrice,
      salePrice,
      status: 'ACTIVE',
      category: category.name,
      unit: ['قطعة', 'كيلو', 'لتر', 'علبة', 'حبة'][Math.floor(Math.random() * 5)],
    });
  }

  return products;
}

// Generate suppliers
function generateSuppliers() {
  const supplierNames = [
    'شركة النور للتجارة',
    'مؤسسة الأمل التجارية',
    'شركة الفجر للاستيراد',
    'مؤسسة البركة',
    'شركة الرواد للتوريدات',
    'مؤسسة النجاح التجارية',
    'شركة الأفق للتجارة',
    'مؤسسة الإخلاص',
    'شركة المستقبل للاستيراد',
    'مؤسسة الثقة التجارية',
  ];

  return supplierNames.map(name => ({
    id: uuidv7(),
    name,
    phone: `05${Math.floor(Math.random() * 90000000) + 10000000}`,
    email: `${name.replace(/\s/g, '').toLowerCase()}@example.com`,
    address: `الرياض - حي ${['النخيل', 'الملز', 'العليا', 'السليمانية', 'الربوة'][Math.floor(Math.random() * 5)]}`,
    balance: 0,
    notes: `مورد موثوق - ${name}`,
  }));
}

// Generate customers
function generateCustomers() {
  const firstNames = ['محمد', 'أحمد', 'عبدالله', 'خالد', 'سعد', 'فهد', 'عمر', 'علي', 'يوسف', 'إبراهيم'];
  const lastNames = ['العتيبي', 'الدوسري', 'القحطاني', 'الشمري', 'المطيري', 'العنزي', 'الحربي', 'الزهراني', 'الغامدي', 'السبيعي'];
  
  const customers = [];
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    customers.push({
      id: uuidv7(),
      name: `${firstName} ${lastName}`,
      phone: `05${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: Math.random() > 0.5 ? `${firstName.toLowerCase()}${i}@example.com` : null,
      address: Math.random() > 0.3 ? `الرياض - حي ${['النخيل', 'الملز', 'العليا', 'السليمانية', 'الربوة'][Math.floor(Math.random() * 5)]}` : null,
      balance: 0,
      notes: Math.random() > 0.7 ? 'عميل مميز' : null,
    });
  }

  return customers;
}

// Generate users
async function generateUsers() {
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  return [
    {
      id: uuidv7(),
      username: 'admin',
      password: hashedPassword,
      fullName: 'مدير النظام',
      role: 'ADMIN',
      isActive: true,
    },
    {
      id: uuidv7(),
      username: 'cashier1',
      password: hashedPassword,
      fullName: 'كاشير 1',
      role: 'CASHIER',
      isActive: true,
    },
    {
      id: uuidv7(),
      username: 'cashier2',
      password: hashedPassword,
      fullName: 'كاشير 2',
      role: 'CASHIER',
      isActive: true,
    },
    {
      id: uuidv7(),
      username: 'manager',
      password: hashedPassword,
      fullName: 'مدير الفرع',
      role: 'MANAGER',
      isActive: true,
    },
  ];
}

// Generate cash accounts
function generateCashAccounts() {
  return [
    {
      id: uuidv7(),
      name: 'الصندوق الرئيسي',
      balance: 50000,
      isActive: true,
      description: 'الصندوق الرئيسي للفرع',
    },
    {
      id: uuidv7(),
      name: 'صندوق الكاشير 1',
      balance: 10000,
      isActive: true,
      description: 'صندوق الكاشير الأول',
    },
    {
      id: uuidv7(),
      name: 'صندوق الكاشير 2',
      balance: 10000,
      isActive: true,
      description: 'صندوق الكاشير الثاني',
    },
  ];
}

// Main seed function
async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12255',
    database: 'hatim_erp',
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('✅ Connected to database');

  const branchId = toBinary('branch-001');
  const now = new Date();

  try {
    // 1. Insert Users
    console.log('📝 Inserting users...');
    const users = await generateUsers();
    for (const user of users) {
      await dataSource.query(
        `INSERT INTO users (id, username, password, fullName, role, is_active, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [toBinary(user.id), user.username, user.password, user.fullName, user.role, user.isActive, now, now]
      );
    }
    console.log(`✅ Inserted ${users.length} users`);

    // 2. Insert Products
    console.log('📝 Inserting products...');
    const products = generateProducts();
    for (const product of products) {
      await dataSource.query(
        `INSERT INTO products (id, name, sku, barcode, description, purchase_price, sale_price, status, category, unit, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(product.id),
          product.name,
          product.sku,
          product.barcode,
          product.description,
          product.purchasePrice,
          product.salePrice,
          product.status,
          product.category,
          product.unit,
          now,
          now,
        ]
      );
    }
    console.log(`✅ Inserted ${products.length} products`);

    // 3. Insert Suppliers
    console.log('📝 Inserting suppliers...');
    const suppliers = generateSuppliers();
    for (const supplier of suppliers) {
      await dataSource.query(
        `INSERT INTO suppliers (id, name, phone, email, address, balance, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(supplier.id),
          supplier.name,
          supplier.phone,
          supplier.email,
          supplier.address,
          supplier.balance,
          supplier.notes,
          now,
          now,
        ]
      );
    }
    console.log(`✅ Inserted ${suppliers.length} suppliers`);

    // 4. Insert Customers
    console.log('📝 Inserting customers...');
    const customers = generateCustomers();
    for (const customer of customers) {
      await dataSource.query(
        `INSERT INTO customers (id, name, phone, email, address, balance, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(customer.id),
          customer.name,
          customer.phone,
          customer.email,
          customer.address,
          customer.balance,
          customer.notes,
          now,
          now,
        ]
      );
    }
    console.log(`✅ Inserted ${customers.length} customers`);

    // 5. Insert Cash Accounts
    console.log('📝 Inserting cash accounts...');
    const cashAccounts = generateCashAccounts();
    for (const account of cashAccounts) {
      await dataSource.query(
        `INSERT INTO cash_accounts (id, name, balance, is_active, description, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(account.id),
          account.name,
          account.balance,
          account.isActive,
          account.description,
          now,
          now,
        ]
      );
    }
    console.log(`✅ Inserted ${cashAccounts.length} cash accounts`);

    // 6. Generate Purchases (50 purchase orders)
    console.log('📝 Generating purchases...');
    let purchaseCount = 0;
    let inventoryEventCount = 0;

    for (let i = 0; i < 50; i++) {
      const purchaseId = uuidv7();
      const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      const purchaseDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
      
      // Select 5-15 random products for this purchase
      const numItems = Math.floor(Math.random() * 11) + 5;
      const selectedProducts = [];
      const usedIndices = new Set();
      
      while (selectedProducts.length < numItems) {
        const idx = Math.floor(Math.random() * products.length);
        if (!usedIndices.has(idx)) {
          usedIndices.add(idx);
          selectedProducts.push(products[idx]);
        }
      }

      let totalAmount = 0;
      const items = [];

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 50) + 10; // 10-60 units
        const unitPrice = product.purchasePrice;
        const totalPrice = quantity * unitPrice;
        totalAmount += totalPrice;

        items.push({
          id: uuidv7(),
          purchaseId,
          productId: product.id,
          quantity,
          unitPrice,
          totalPrice,
        });
      }

      // Insert purchase
      await dataSource.query(
        `INSERT INTO purchases (id, supplier_id, total_amount, status, source_type, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(purchaseId),
          toBinary(supplier.id),
          totalAmount,
          'POSTED',
          'EXTERNAL_SUPPLIER',
          `فاتورة شراء رقم ${i + 1}`,
          purchaseDate,
          purchaseDate,
        ]
      );

      // Insert purchase items
      for (const item of items) {
        await dataSource.query(
          `INSERT INTO purchase_items (id, purchase_id, product_id, quantity, unit_price, total_price, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            toBinary(item.id),
            toBinary(item.purchaseId),
            toBinary(item.productId),
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            purchaseDate,
            purchaseDate,
          ]
        );

        // Insert inventory event (STOCK_IN)
        const eventId = uuidv7();
        await dataSource.query(
          `INSERT INTO inventory_events (id, branch_id, event_type, product_id, quantity, reference_id, reference_type, notes, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            toBinary(eventId),
            branchId,
            'STOCK_IN',
            toBinary(item.productId),
            item.quantity,
            toBinary(purchaseId),
            'PURCHASE',
            `شراء من ${supplier.name}`,
            purchaseDate,
            purchaseDate,
          ]
        );
        inventoryEventCount++;
      }

      // Update supplier balance
      await dataSource.query(
        `UPDATE suppliers SET balance = balance + ? WHERE id = ?`,
        [totalAmount, toBinary(supplier.id)]
      );

      purchaseCount++;
    }
    console.log(`✅ Generated ${purchaseCount} purchases with ${inventoryEventCount} inventory events`);

    // 7. Generate Sales (200 sales)
    console.log('📝 Generating sales...');
    let salesCount = 0;
    let saleInventoryEvents = 0;

    for (let i = 0; i < 200; i++) {
      const saleId = uuidv7();
      const customer = Math.random() > 0.3 ? customers[Math.floor(Math.random() * customers.length)] : null;
      const saleDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000); // Last 60 days
      
      // Select 1-8 random products for this sale
      const numItems = Math.floor(Math.random() * 8) + 1;
      const selectedProducts = [];
      const usedIndices = new Set();
      
      while (selectedProducts.length < numItems) {
        const idx = Math.floor(Math.random() * products.length);
        if (!usedIndices.has(idx)) {
          usedIndices.add(idx);
          selectedProducts.push(products[idx]);
        }
      }

      let totalAmount = 0;
      const items = [];

      for (const product of selectedProducts) {
        const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 units
        const unitPrice = product.salePrice;
        const totalPrice = quantity * unitPrice;
        totalAmount += totalPrice;

        items.push({
          id: uuidv7(),
          saleId,
          productId: product.id,
          quantity,
          unitPrice,
          totalPrice,
        });
      }

      const paidAmount = Math.random() > 0.2 ? totalAmount : Math.floor(totalAmount * (0.5 + Math.random() * 0.5));
      const status = paidAmount >= totalAmount ? 'PAID' : 'DRAFT';

      // Insert sale
      await dataSource.query(
        `INSERT INTO sales (id, customer_id, total_amount, paid_amount, status, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(saleId),
          customer ? toBinary(customer.id) : null,
          totalAmount,
          paidAmount,
          status,
          `فاتورة بيع رقم ${i + 1}`,
          saleDate,
          saleDate,
        ]
      );

      // Insert sale items
      for (const item of items) {
        await dataSource.query(
          `INSERT INTO sale_items (id, sale_id, product_id, quantity, unit_price, total_price, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            toBinary(item.id),
            toBinary(item.saleId),
            toBinary(item.productId),
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            saleDate,
            saleDate,
          ]
        );

        // Insert inventory event (SALE_DEDUCT)
        const eventId = uuidv7();
        await dataSource.query(
          `INSERT INTO inventory_events (id, branch_id, event_type, product_id, quantity, reference_id, reference_type, notes, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            toBinary(eventId),
            branchId,
            'SALE_DEDUCT',
            toBinary(item.productId),
            -item.quantity,
            toBinary(saleId),
            'SALE',
            `بيع للعميل`,
            saleDate,
            saleDate,
          ]
        );
        saleInventoryEvents++;
      }

      // Update customer balance if credit sale
      if (customer && paidAmount < totalAmount) {
        await dataSource.query(
          `UPDATE customers SET balance = balance + ? WHERE id = ?`,
          [totalAmount - paidAmount, toBinary(customer.id)]
        );
      }

      salesCount++;
    }
    console.log(`✅ Generated ${salesCount} sales with ${saleInventoryEvents} inventory events`);

    // 8. Generate Damages (30 damage events)
    console.log('📝 Generating damage events...');
    let damageCount = 0;

    for (let i = 0; i < 30; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const damageDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
      const quantity = Math.floor(Math.random() * 5) + 1;

      const eventId = uuidv7();
      await dataSource.query(
        `INSERT INTO inventory_events (id, branch_id, event_type, product_id, quantity, reference_id, reference_type, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(eventId),
          branchId,
          'DAMAGE',
          toBinary(product.id),
          -quantity,
          null,
          'DAMAGE',
          `تلف في المخزن - ${['انتهاء صلاحية', 'كسر', 'تلف أثناء النقل', 'عيب مصنعي'][Math.floor(Math.random() * 4)]}`,
          damageDate,
          damageDate,
        ]
      );
      damageCount++;
    }
    console.log(`✅ Generated ${damageCount} damage events`);

    // 9. Generate Adjustments (20 adjustment events)
    console.log('📝 Generating adjustment events...');
    let adjustmentCount = 0;

    for (let i = 0; i < 20; i++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const adjustmentDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const quantity = Math.floor(Math.random() * 20) - 10; // -10 to +10

      const eventId = uuidv7();
      await dataSource.query(
        `INSERT INTO inventory_events (id, branch_id, event_type, product_id, quantity, reference_id, reference_type, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(eventId),
          branchId,
          'ADJUSTMENT',
          toBinary(product.id),
          quantity,
          null,
          'ADJUSTMENT',
          `تسوية جرد - ${quantity > 0 ? 'زيادة' : 'نقص'} في المخزون`,
          adjustmentDate,
          adjustmentDate,
        ]
      );
      adjustmentCount++;
    }
    console.log(`✅ Generated ${adjustmentCount} adjustment events`);

    // 10. Generate Expenses (50 expenses)
    console.log('📝 Generating expenses...');
    const expenseCategories = ['رواتب', 'إيجار', 'كهرباء', 'ماء', 'صيانة', 'نظافة', 'مواصلات', 'اتصالات', 'قرطاسية', 'متنوعة'];
    let expenseCount = 0;

    for (let i = 0; i < 50; i++) {
      const expenseId = uuidv7();
      const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
      const amount = Math.floor(Math.random() * 5000) + 500;
      const expenseDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);

      await dataSource.query(
        `INSERT INTO expenses (id, description, amount, category, notes, expense_date, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(expenseId),
          `مصروف ${category} - ${i + 1}`,
          amount,
          category,
          `تفاصيل المصروف`,
          expenseDate,
          expenseDate,
          expenseDate,
        ]
      );
      expenseCount++;
    }
    console.log(`✅ Generated ${expenseCount} expenses`);

    // 11. Generate Payment Transactions (100 transactions)
    console.log('📝 Generating payment transactions...');
    let transactionCount = 0;

    for (let i = 0; i < 100; i++) {
      const transactionId = uuidv7();
      const cashAccount = cashAccounts[Math.floor(Math.random() * cashAccounts.length)];
      const transactionTypes = ['SALE_PAYMENT', 'CUSTOMER_PAYMENT', 'PURCHASE_PAYMENT', 'SUPPLIER_PAYMENT', 'EXPENSE', 'CASH_IN', 'CASH_OUT'];
      const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 10000) + 500;
      const paymentMethods = ['CASH', 'CARD', 'BANK_TRANSFER'];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const transactionDate = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);

      await dataSource.query(
        `INSERT INTO payment_transactions (id, cash_account_id, transaction_type, amount, payment_method, reference_id, reference_type, notes, transaction_date, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(transactionId),
          toBinary(cashAccount.id),
          transactionType,
          amount,
          paymentMethod,
          null,
          transactionType,
          `حركة ${transactionType}`,
          transactionDate,
          transactionDate,
          transactionDate,
        ]
      );
      transactionCount++;
    }
    console.log(`✅ Generated ${transactionCount} payment transactions`);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Suppliers: ${suppliers.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Cash Accounts: ${cashAccounts.length}`);
    console.log(`   - Purchases: ${purchaseCount}`);
    console.log(`   - Sales: ${salesCount}`);
    console.log(`   - Inventory Events: ${inventoryEventCount + saleInventoryEvents + damageCount + adjustmentCount}`);
    console.log(`   - Expenses: ${expenseCount}`);
    console.log(`   - Payment Transactions: ${transactionCount}`);
    console.log('\n🔑 Login credentials:');
    console.log('   Username: admin | Password: 123456');
    console.log('   Username: cashier1 | Password: 123456');
    console.log('   Username: manager | Password: 123456');

  } catch (error) {
    console.error('❌ Error during seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();

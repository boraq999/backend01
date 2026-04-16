import { DataSource } from 'typeorm';
import { v7 as uuidv7 } from 'uuid';

// Helper function to convert UUID to binary
function toBinary(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

// Add inventory for existing products
async function addInventory() {
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
    // Get all products
    const products = await dataSource.query('SELECT * FROM products');
    console.log(`📦 Found ${products.length} products`);

    // Clear existing inventory events
    await dataSource.query('DELETE FROM inventory_events');
    console.log('🗑️ Cleared existing inventory events');

    // Add initial stock for each product
    let inventoryEventCount = 0;
    
    for (const product of products) {
      const initialStock = Math.floor(Math.random() * 100) + 50; // 50-150 units
      
      await dataSource.query(
        `INSERT INTO inventory_events (id, branch_id, event_type, product_id, quantity, reference_type, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          toBinary(uuidv7()),
          branchId,
          'STOCK_IN',
          product.id,
          initialStock,
          'INITIAL_STOCK',
          'مخزون ابتدائي',
          now,
          now,
        ]
      );
      inventoryEventCount++;
    }
    
    console.log(`✅ Added initial stock for ${inventoryEventCount} products`);
    console.log('🎉 Inventory setup completed successfully!');

  } catch (error) {
    console.error('❌ Error during inventory setup:', error);
  } finally {
    await dataSource.destroy();
  }
}

addInventory();
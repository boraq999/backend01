import { DataSource } from 'typeorm';

async function checkTables() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '12255',
    database: 'hatim_erp',
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Get all tables
    const tables = await dataSource.query('SHOW TABLES');
    
    console.log('\n📋 Tables in hatim_erp database:');
    console.log('================================');
    
    if (tables.length === 0) {
      console.log('❌ No tables found in database!');
      console.log('\n💡 You need to run the application first to create tables:');
      console.log('   cd backend && pnpm start:dev');
      console.log('   (Wait for it to start, then press Ctrl+C)');
    } else {
      tables.forEach((table, index) => {
        const tableName = table[`Tables_in_hatim_erp`];
        console.log(`${index + 1}. ${tableName}`);
      });
      
      console.log(`\n✅ Total tables found: ${tables.length}`);
      
      // Check if all expected tables exist
      const expectedTables = [
        'users', 'products', 'inventory_events', 'purchases', 'purchase_items',
        'sales', 'sale_items', 'customers', 'suppliers', 'expenses',
        'cash_accounts', 'payment_transactions', 'outbox'
      ];
      
      const existingTables = tables.map(t => t[`Tables_in_hatim_erp`]);
      const missingTables = expectedTables.filter(t => !existingTables.includes(t));
      
      if (missingTables.length > 0) {
        console.log('\n⚠️  Missing tables:');
        missingTables.forEach(table => console.log(`   - ${table}`));
      } else {
        console.log('\n🎉 All expected tables are present!');
      }
    }

  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   - MySQL is running');
    console.log('   - Database "hatim_erp" exists');
    console.log('   - Credentials are correct in .env file');
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

checkTables();
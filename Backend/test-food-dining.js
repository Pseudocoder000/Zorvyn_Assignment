import dotenv from 'dotenv'
import parseWithGemini from './utils/geminiParser.js'

dotenv.config()

const testFoodDiningCategory = async () => {
  console.log('🧪 Testing "Food & Dining" Category Normalization\n')

  // This CSV has "Food & Dining" which should be normalized to "Groceries"
  const testCSV = `Date,Description,Debit,Credit
2024-04-03,Salary Credited,,50000
2024-04-05,Restaurant Dinner,1200,
2024-04-07,Grocery Shopping,800,
2024-04-09,Food & Dining Expense,500,
2024-04-11,Netflix,-499,
2024-04-13,Medical Checkup,-2500,`

  console.log('Input CSV (with Food & Dining):')
  console.log('─'.repeat(60))
  console.log(testCSV.split('\n').slice(0, 4).join('\n'))
  console.log('...\n')

  try {
    const transactions = await parseWithGemini(testCSV)
    
    if (transactions.length > 0) {
      console.log(`\n✅ Parsed ${transactions.length} transactions\n`)
      console.log('Validation Results:')
      console.log('─'.repeat(100))
      
      let allValid = true;
      transactions.forEach((tx, i) => {
        const validCategories = ["Shopping", "Education", "Healthcare", "Groceries", "Entertainment", "Transport", "Utilities", "Investment", "Salary", "Other"];
        const isCategoryValid = validCategories.includes(tx.category);
        const hasName = !!tx.name;
        
        if (!isCategoryValid || !hasName) {
          allValid = false;
        }
        
        const nameStatus = hasName ? '✓' : '✗';
        const categoryStatus = isCategoryValid ? `✓ (${tx.category})` : `✗ (${tx.category})`;
        
        console.log(`${i + 1}. "${tx.description}"`);
        console.log(`   name: ${nameStatus} | category: ${categoryStatus} | type: ${tx.type}`);
      })
      
      console.log('\n' + '═'.repeat(100))
      if (allValid) {
        console.log('✅ ALL TRANSACTIONS VALID - Ready for database save!');
      } else {
        console.log('❌ SOME TRANSACTIONS INVALID - Check categories above');
      }
    } else {
      console.log('⚠️ No transactions extracted')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testFoodDiningCategory().catch(console.error)

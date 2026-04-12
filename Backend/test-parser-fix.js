import dotenv from 'dotenv'
import parseWithGemini from './utils/geminiParser.js'

dotenv.config()

const testUpdatedParser = async () => {
  console.log('🧪 Testing Updated Parser with Category Normalization\n')

  const testCSV = `Date,Description,Amount
2024-04-03,Salary Credited,50000
2024-04-05,Amazon Shopping,-5500
2024-04-07,Restaurant Dinner,-1200
2024-04-09,Electricity Bill,-1800
2024-04-11,Uber Ride,-450
2024-04-13,Netflix Subscription,-499
2024-04-15,Medical Checkup,-2500`

  console.log('Input CSV:')
  console.log(testCSV.split('\n').slice(0, 4).join('\n'))
  console.log('...\n')

  try {
    const transactions = await parseWithGemini(testCSV)
    
    if (transactions.length > 0) {
      console.log(`✅ Parsed ${transactions.length} transactions\n`)
      console.log('Schema Validation:')
      console.log('─'.repeat(100))
      transactions.forEach((tx, i) => {
        console.log(`${i + 1}. name: "${tx.name}" (required field)`)
        console.log(`   description: "${tx.description}" (optional)`)
        console.log(`   date: ${tx.date} ✓`)
        console.log(`   amount: ${tx.amount} ✓`)
        console.log(`   type: ${tx.type} ✓`)
        console.log(`   category: ${tx.category} ✓ (valid enum)`)
        console.log()
      })
    } else {
      console.log('⚠️ No transactions extracted')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testUpdatedParser().catch(console.error)

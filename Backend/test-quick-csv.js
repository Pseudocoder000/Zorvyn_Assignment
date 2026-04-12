import dotenv from 'dotenv'
import parseWithGemini from './utils/geminiParser.js'

dotenv.config()

const testQuickCSVFormats = async () => {
  console.log('🧪 Quick CSV Flexibility Test\n')

  const csv1 = `Date,Description,Amount
2024-01-15,Salary Credited,50000
2024-01-16,Amazon Purchase,-1500`

  const csv2 = `Date | Description | Debit | Credit
15-01-2024 | Salary | | 50000
16-01-2024 | Amazon | 1500 |`

  const tests = [
    { name: 'Standard CSV', data: csv1 },
    { name: 'Pipe-Separated', data: csv2 }
  ]

  for (const test of tests) {
    console.log(`✓ ${test.name}`)
    const result = await parseWithGemini(test.data)
    if (result && result.length > 0) {
      console.log(`  ✅ Extracted ${result.length} transactions`)
      console.log(`  Sample: ${result[0].description} (${result[0].type})`)
    } else {
      console.log(`  ⚠️ No transactions`)
    }
    console.log()
  }
}

testQuickCSVFormats().catch(console.error)

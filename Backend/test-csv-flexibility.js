import dotenv from 'dotenv'
import parseWithGemini from './utils/geminiParser.js'

dotenv.config()

const testCSVFormats = async () => {
  console.log('🧪 Testing CSV Flexibility with Different Formats\n')

  // Format 1: Standard format
  const csv1 = `Date,Description,Amount
2024-01-15,Salary Credited,50000
2024-01-16,Amazon Purchase,-1500
2024-01-17,Coffee,-200`

  // Format 2: Different column headers and order
  const csv2 = `Transaction Date | Narrative | Debit Amount | Credit Amount
15-01-2024 | Salary Credited | | 50000.00
16-01-2024 | Amazon Purchase | 1500.00 |
17-01-2024 | Coffee | 200 |`

  // Format 3: Pipe-separated with no headers
  const csv3 = `2024-01-15 | Salary | 50000 | IN
2024-01-16 | Amazon | 1500 | OUT
2024-01-17 | Coffee | 200 | OUT`

  // Format 4: Space-separated (messy)
  const csv4 = `Date        Description          Debit    Credit
15-01-2024  Salary Credited                   50000
16-01-2024  Amazon Purchase       1500        
17-01-2024  Coffee                200`

  const formats = [
    { name: 'Standard CSV', data: csv1 },
    { name: 'Pipe-separated with Headers', data: csv2 },
    { name: 'Pipe-separated No Headers', data: csv3 },
    { name: 'Space-separated Messy', data: csv4 }
  ]

  for (const format of formats) {
    console.log(`\n📝 Testing: ${format.name}`)
    console.log('━'.repeat(60))
    console.log('Input:\n', format.data.substring(0, 150) + '...\n')

    try {
      const result = await parseWithGemini(format.data)
      if (result && result.length > 0) {
        console.log(`✅ SUCCESS: Extracted ${result.length} transactions`)
        console.log('Sample:', JSON.stringify(result[0], null, 2))
      } else {
        console.log('⚠️ No transactions extracted')
      }
    } catch (error) {
      console.log('❌ Error:', error.message)
    }

    // Add delay between API calls
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n' + '═'.repeat(60))
  console.log('✨ CSV Flexibility Test Complete!')
}

testCSVFormats().catch(console.error)

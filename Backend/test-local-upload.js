import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const testUploadLocal = async () => {
  console.log('📤 Testing CSV Upload Locally\n')

  const testFile = path.join(__dirname, '..', '..', 'test-statements', 'standard-format.csv')

  if (!fs.existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`)
    return
  }

  console.log(`✓ Test File: ${testFile}`)
  console.log(`   Size: ${(fs.statSync(testFile).size / 1024).toFixed(2)} KB\n`)

  // Read the file content
  const fileContent = fs.readFileSync(testFile, 'utf-8')
  console.log('File Content Sample:')
  console.log(fileContent.split('\n').slice(0, 5).join('\n'))
  console.log('...\n')

  // Test parsing with our Gemini parser
  try {
    const { default: parseWithGemini } = await import('./utils/geminiParser.js')
    
    console.log('🤖 Sending to Gemini AI Parser...\n')
    const transactions = await parseWithGemini(fileContent)

    if (transactions && transactions.length > 0) {
      console.log(`✅ SUCCESS: Extracted ${transactions.length} transactions\n`)
      console.log('Parsed Transactions:')
      console.log('━'.repeat(80))
      transactions.slice(0, 5).forEach((tx, i) => {
        console.log(`${i + 1}. ${tx.date} | ${tx.description.padEnd(30)} | ₹${String(tx.amount).padEnd(8)} | ${tx.type.padEnd(7)} | ${tx.category}`)
      })
      if (transactions.length > 5) {
        console.log(`... and ${transactions.length - 5} more transactions`)
      }
    } else {
      console.log('⚠️ No transactions extracted')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testUploadLocal().catch(console.error)

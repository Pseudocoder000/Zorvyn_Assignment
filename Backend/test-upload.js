import fs from 'fs'
import fetch from 'node-fetch'
import FormData from 'form-data'

const testUploadCSVs = async () => {
  console.log('📤 Testing CSV Upload Flexibility via API\n')

  // Note: You'll need to replace this with a valid JWT token from your backend
  const token = process.env.JWT_TOKEN || 'test-token'

  const testFiles = [
    { name: 'Standard Format', file: 'test-statements/standard-format.csv' },
    { name: 'Pipe-Separated', file: 'test-statements/pipe-format.csv' },
    { name: 'Tab-Separated', file: 'test-statements/tab-separated.csv' }
  ]

  for (const test of testFiles) {
    console.log(`\n✓ Testing: ${test.name}`)
    console.log('━'.repeat(60))

    try {
      // Read file
      if (!fs.existsSync(test.file)) {
        console.log(`⚠️ File not found: ${test.file}`)
        continue
      }

      const fileStream = fs.createReadStream(test.file)
      const form = new FormData()
      form.append('file', fileStream)

      // Upload via API
      const response = await fetch('http://localhost:5000/api/transactions/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      })

      const data = await response.json()

      if (data.success) {
        console.log(`✅ SUCCESS: Uploaded ${data.count} transactions`)
        console.log(`   Format: ${data.format.toUpperCase()}`)
        console.log(`   Message: ${data.message}`)
        if (data.transactions && data.transactions.length > 0) {
          const tx = data.transactions[0]
          console.log(`   Sample: ${tx.date} | ${tx.description} | ₹${tx.amount} (${tx.type})`)
        }
      } else {
        console.log(`❌ Error: ${data.message}`)
      }
    } catch (error) {
      console.log(`❌ Request Error: ${error.message}`)
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log('\n' + '═'.repeat(60))
  console.log('✨ Upload Test Complete!')
  console.log('\nNote: To run this with authentication:')
  console.log('SET JWT_TOKEN=your_token && node test-upload.js')
}

testUploadCSVs().catch(console.error)

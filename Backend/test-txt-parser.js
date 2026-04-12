import fs from 'fs'
import { parseTxtBankStatement, validateTxtContent } from './utils/txtParser.js'

async function testTxtParser() {
  try {
    console.log('\n' + '═'.repeat(70))
    console.log('🧪 TXT BANK STATEMENT PARSER - TEST')
    console.log('═'.repeat(70) + '\n')

    const txtPath = './sample-bank-statement.txt'
    
    if (!fs.existsSync(txtPath)) {
      console.error('❌ Sample TXT file not found')
      return
    }

    const txtContent = fs.readFileSync(txtPath, 'utf-8')

    console.log('📄 File: sample-bank-statement.txt')
    console.log(`📊 Content size: ${(txtContent.length / 1024).toFixed(2)} KB`)
    console.log('')

    // Validate content
    console.log('🔍 Validating TXT content...')
    const validation = validateTxtContent(txtContent)
    
    if (!validation.valid) {
      console.error('❌ Validation failed:', validation.error)
      return
    }
    console.log('✅ Validation passed\n')

    // Parse transactions
    console.log('🔄 Parsing bank statement...')
    const transactions = await parseTxtBankStatement(txtContent)

    if (!transactions || transactions.length === 0) {
      console.error('❌ No transactions parsed')
      return
    }

    console.log(`✅ Parsed ${transactions.length} transactions\n`)

    // Display results
    console.log('📋 TRANSACTION SUMMARY:')
    console.log('─'.repeat(70))
    console.log(`${'Date'.padEnd(12)} | ${'Description'.padEnd(30)} | ${'Amount'.padEnd(12)} | Category`)
    console.log('─'.repeat(70))

    let totalIncome = 0
    let totalExpenses = 0

    transactions.forEach(tx => {
      const dateStr = new Date(tx.date).toLocaleDateString('en-IN')
      const desc = tx.description.substring(0, 28).padEnd(30)
      const amountStr = tx.amount.toFixed(2).padEnd(12)
      
      if (tx.amount > 0) {
        totalIncome += tx.amount
      } else {
        totalExpenses += Math.abs(tx.amount)
      }

      console.log(`${dateStr.padEnd(12)} | ${desc} | ₹${amountStr} | ${tx.category}`)
    })

    console.log('─'.repeat(70))
    console.log(`\n💰 TOTALS:`)
    console.log(`   Income:    ₹${totalIncome.toFixed(2)}`)
    console.log(`   Expenses:  ₹${totalExpenses.toFixed(2)}`)
    console.log(`   Net:       ₹${(totalIncome - totalExpenses).toFixed(2)}`)
    console.log('')

    // Category breakdown
    const categories = {}
    transactions.forEach(tx => {
      categories[tx.category] = (categories[tx.category] || 0) + Math.abs(tx.amount)
    })

    console.log('📊 CATEGORIES:')
    Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .forEach(([cat, amount]) => {
        console.log(`   ${cat.padEnd(20)} ₹${amount.toFixed(2)}`)
      })

    console.log('')
    console.log('═'.repeat(70))
    console.log('✨ TXT Parser Test Completed Successfully!')
    console.log('═'.repeat(70) + '\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error.stack)
  }
}

testTxtParser()

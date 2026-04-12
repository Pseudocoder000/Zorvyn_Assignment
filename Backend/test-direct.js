import fs from 'fs'
import { parseTxtBankStatement, validateTxtContent } from './utils/txtParser.js'

async function testDirect() {
  try {
    const txtContent = fs.readFileSync('./sample-bank-statement.txt', 'utf-8');
    const lines = txtContent.split('\n').map(line => line.trim()).filter(line => line);

    console.log(`\n📝 Total lines: ${lines.length}`)
    console.log(`📝 First date line: ${lines.find(l => /\d{2}\/\d{2}\/\d{4}/.test(l))}`)

    // Check what tryTableFormat would find
    console.log('\n🔍 Looking for date pattern:')
    const datePatternTest = /^\d{2}\/\d{2}\/\d{4}\s*\|/;
    const dateLines = lines.filter(l => datePatternTest.test(l));
    console.log(`  Found ${dateLines.length} lines matching date pattern`)
    if (dateLines.length > 0) {
      console.log(`  First: ${dateLines[0]}`)
    }

    // Now test the actual parser
    console.log('\n🚀 Testing parseTxtBankStatement...')
    const result = await parseTxtBankStatement(txtContent);
    console.log(`  Result type: ${typeof result}`)
    console.log(`  Result is array: ${Array.isArray(result)}`)
    console.log(`  Result length: ${result ? result.length : 'null'}`)
    
    if (result && result.length > 0) {
      console.log(`  First transaction:`, result[0])
    } else {
      console.log('  ❌ No transactions found')
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testDirect();

import fs from 'fs'

async function debugTxtParser() {
  try {
    const txtPath = './sample-bank-statement.txt'
    const txtContent = fs.readFileSync(txtPath, 'utf-8')
    const lines = txtContent.split('\n').map(line => line.trim()).filter(line => line)

    console.log('\n📋 FIRST 20 LINES OF TXT FILE:')
    lines.slice(0, 20).forEach((line, i) => {
      console.log(`${i}: ${line}`)
    })

    console.log('\n🔍 ANALYZING FORMAT:')
    
    // Check for date patterns
    const datePattern = /(\d{2}\/\d{2}\/\d{4})/
    const linesWithDates = lines.filter(line => datePattern.test(line))
    console.log(`\n✓ Lines with dates (DD/MM/YYYY): ${linesWithDates.length}`)
    if (linesWithDates.length > 0) {
      console.log(`  Example: ${linesWithDates[0]}`)
    }

    // Check for pipe separators
    const pipeLines = lines.filter(line => line.includes('|'))
    console.log(`✓ Lines with pipes (|): ${pipeLines.length}`)
    if (pipeLines.length > 0) {
      console.log(`  Example: ${pipeLines[0]}`)
    }

    // Check for amount patterns
    const amountPattern = /(\d+[.,]\d{2}|\d{2,})/
    const amountLines = lines.filter(line => amountPattern.test(line))
    console.log(`✓ Lines with amounts: ${amountLines.length}`)

    // Test parsing individual line
    console.log('\n📊 TESTING LINE PARSING:')
    const testLine = '03/04/2026 | FDL/000152/NEWTOWN/FOOD SERVICE | 148.00 | | 363,520.00'
    console.log(`Line: ${testLine}`)
    
    const parts = testLine.split('|').map(p => p.trim())
    console.log(`Parts: ${parts.length}`)
    parts.forEach((part, i) => console.log(`  [${i}]: ${part}`))

  } catch (error) {
    console.error('Error:', error.message)
  }
}

debugTxtParser()

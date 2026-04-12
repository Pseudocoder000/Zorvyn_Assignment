import fs from 'fs'

// Simple test of the parsing logic
function parseTableFormattedLine(line) {
  console.log(`\n📝 Parsing: "${line}"`)
  
  if (!line || line.length < 10) {
    console.log('  ❌ Line too short')
    return null;
  }
  
  // Skip separator lines
  if (line.match(/^[=\-\s|]+$/)) {
    console.log('  ❌ Separator line')
    return null;
  }

  // Split by pipe
  let parts = line.split('|').map(p => p.trim());
  console.log(`  Parts: ${parts.length}`, parts)
  
  if (parts.length < 2) {
    console.log('  ❌ Fewer than 2 parts')
    return null;
  }

  let dateStr = parts[0];
  let description = parts[1];

  console.log(`  Date: "${dateStr}", Desc: "${description}"`)

  // Check if first part is a valid date
  const dateRegex = /\d{2}[\/\-]\d{2}[\/\-]\d{4}|\d{2}[\/\-]\d{2}[\/\-]\d{2}|\d{4}[\/\-]\d{2}[\/\-]\d{2}/
  const isDate = dateRegex.test(dateStr);
  console.log(`  Is date? ${isDate}`)

  if (!isDate) {
    console.log('  ❌ Not a date')
    return null;
  }

  if (!dateStr || !description) {
    console.log('  ❌ Missing date or description')
    return null;
  }

  // Parse amounts
  let debit = 0;
  let credit = 0;

  if (parts.length >= 4) {
    const debitStr = parts[2];
    const creditStr = parts[3];
    
    debit = parseAmount(debitStr);
    credit = parseAmount(creditStr);
    console.log(`  Debit: ${debit}, Credit: ${credit}`)
  } else if (parts.length === 3) {
    const amountStr = parts[2];
    const amount = parseAmount(amountStr);
    if (amount >= 0) credit = amount;
    else debit = Math.abs(amount);
    console.log(`  Amount: ${amount}`)
  } else {
    console.log('  ❌ Not enough parts')
    return null;
  }

  // Must have at least one amount
  if (debit === 0 && credit === 0) {
    console.log('  ❌ No amounts')
    return null;
  }

  const amount = credit > 0 ? credit : -debit;
  console.log(`  ✅ Final amount: ${amount}`)

  return {
    date: new Date(dateStr),
    description,
    amount
  };
}

function parseAmount(amountStr) {
  if (!amountStr || !amountStr.trim()) return 0;

  amountStr = amountStr.trim().toUpperCase();
  if (!amountStr) return 0;

  let numStr = amountStr.replace(/[A-Z\s]/g, '');
  numStr = numStr.replace(/,/g, '');
  numStr = numStr.trim();
  
  if (!numStr || numStr === '-') return 0;

  const amount = parseFloat(numStr);
  return isNaN(amount) ? 0 : Math.abs(amount);
}

// Load and parse
const txtContent = fs.readFileSync('./sample-bank-statement.txt', 'utf-8');
const lines = txtContent.split('\n').map(line => line.trim()).filter(line => line);

console.log('\n🔍 Testing individual lines:\n');

// Test a few specific lines
const testLines = [
  '03/04/2026 | FDL/000152/NEWTOWN/FOOD SERVICE | 148.00 | | 363,520.00',
  '05/04/2026 | SRI/000005812/GOPA GANGULY | | 500.00 | 363,663.00',
  'Date | Description | Debit Amount | Credit Amount | Balance',
  '-------|---------------------------|--------------|--------------|----------'
];

const results = [];
testLines.forEach(testLine => {
  const result = parseTableFormattedLine(testLine);
  if (result) {
    results.push(result);
  }
});

console.log(`\n\n✅ Successfully parsed ${results.length} out of ${testLines.length} test lines`);

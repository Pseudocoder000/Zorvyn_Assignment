import PDFDocument from 'pdfkit';
import fs from 'fs';

// Create a sample PDF with transaction data
const doc = new PDFDocument();
const filename = 'sample-bank-statement.pdf';

// Write to file
doc.pipe(fs.createWriteStream(filename));

// Add title
doc.fontSize(20).text('Bank Statement - January 2024', 100, 50);
doc.fontSize(12).text('Account Number: 123456789', 100, 100);
doc.text('Statement Period: 01/01/2024 - 31/01/2024', 100, 120);

// Add spacing
doc.moveDown();

// Add header for transactions
doc.fontSize(11);
doc.text('Date'.padEnd(15) + 'Description'.padEnd(30) + 'Amount', 100, 160);
doc.moveTo(100, 175).lineTo(550, 175).stroke();

// Add sample transactions
const transactions = [
  { date: '01/01/2024', desc: 'Opening Balance', amount: '50000.00' },
  { date: '02/01/2024', desc: 'Salary Credited', amount: '50000.00' },
  { date: '03/01/2024', desc: 'Amazon Purchase', amount: '-1500.00' },
  { date: '04/01/2024', desc: 'Coffee Shop', amount: '-250.00' },
  { date: '05/01/2024', desc: 'Electricity Bill', amount: '-1200.00' },
  { date: '06/01/2024', desc: 'Medical Store', amount: '-800.00' },
  { date: '07/01/2024', desc: 'Grocery Shopping', amount: '-2000.00' },
  { date: '08/01/2024', desc: 'Uber Ride', amount: '-350.00' },
  { date: '09/01/2024', desc: 'Netflix Subscription', amount: '-499.00' },
  { date: '10/01/2024', desc: 'Freelance Income', amount: '15000.00' },
  { date: '11/01/2024', desc: 'Restaurant Dinner', amount: '-1500.00' },
  { date: '12/01/2024', desc: 'Phone Bill', amount: '-599.00' },
  { date: '13/01/2024', desc: 'ATM Withdrawal', amount: '-5000.00' },
  { date: '14/01/2024', desc: 'Transfer to Savings', amount: '-10000.00' },
  { date: '15/01/2024', desc: 'Refund Credit', amount: '500.00' }
];

let yPosition = 190;
doc.fontSize(10);

transactions.forEach(txn => {
  const line = txn.date.padEnd(15) + txn.desc.padEnd(30) + txn.amount;
  doc.text(line, 100, yPosition);
  yPosition += 20;
  
  // Add page break if needed
  if (yPosition > 700) {
    doc.addPage();
    yPosition = 50;
  }
});

// Finalize PDF
doc.end();

console.log(`✅ Sample PDF created: ${filename}`);
console.log('📄 Transactions added:');
transactions.forEach(txn => {
  console.log(`   ${txn.date} | ${txn.desc.padEnd(25)} | ${txn.amount}`);
});

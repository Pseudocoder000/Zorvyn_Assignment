// Comprehensive List of Famous Indian Banks
export const INDIAN_BANKS = [
  // Private Sector Banks
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'IndusInd Bank',
  'YES Bank',
  'RBL Bank',
  'IDFC First Bank',
  'Federal Bank',
  'Bandhan Bank',
  'Aurora Mobile Payments Bank',
  'TIMESBANK',
  'HSBC Bank India',
  'Standard Chartered Bank',
  'DBS Bank India',
  'Citibank India',
  'Deutsche Bank India',
  'American Express Bank',
  'ICICI Bank Smart',
  'ICICI Prudential',
  
  // Public Sector Banks
  'State Bank of India (SBI)',
  'Bank of India',
  'Bank of Baroda',
  'Punjab National Bank',
  'Canara Bank',
  'Union Bank of India',
  'Central Bank of India',
  'Indian Bank',
  'Indian Overseas Bank',
  'Allahabad Bank',
  'Syndicate Bank',
  'IDBI Bank',
  
  // Small Finance Banks
  'AU Small Finance Bank',
  'Ujjivan Small Finance Bank',
  'RBL Bank',
  'South Indian Bank',
  'Airtel Payments Bank',
  'ICICI Bank',
  'Shivalik Small Finance Bank',
  'Suryoday Small Finance Bank',
  
  // Digital/Payments Banks
  'Google Pay',
  'PhonePe',
  'Paytm Payments Bank',
  'Amazon Pay',
  'WhatsApp Pay',
  
  // NRI Centric
  'Bajaj Finance',
  'Mahindra Finance',
  'HDB Financial',
  'L&T Finance',
  'Cholamandalam Investment',
]

// Bank Validation Function
export const isValidBank = (bankName) => {
  if (!bankName) return false
  return INDIAN_BANKS.some(bank => 
    bank.toLowerCase() === bankName.toLowerCase()
  )
}

export const ACCOUNT_VALIDATION_RULES = {
  minLength: 8,
  maxLength: 20,
  pattern: /^[0-9]+$/, // Only digits
}

export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return ''
  const str = accountNumber.toString().trim()
  if (str.length <= 4) return str
  const visibleLength = 4
  const maskedLength = str.length - visibleLength
  return '*'.repeat(maskedLength) + str.slice(-visibleLength)
}

export const optimizeImage = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Compress if larger than 800x800
        if (width > 800 || height > 800) {
          const ratio = Math.min(800 / width, 800 / height)
          width *= ratio
          height *= ratio
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to webp with quality 0.8
        canvas.toBlob(
          (blob) => {
            const reader2 = new FileReader()
            reader2.onload = (e) => resolve(e.target.result)
            reader2.readAsDataURL(blob)
          },
          'image/webp',
          0.8
        )
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  })
}

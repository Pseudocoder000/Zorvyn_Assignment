import dotenv from 'dotenv'
import User from './models/User.js'
import connectDB from './config/db.js'

dotenv.config()

const testLogin = async () => {
  try {
    await connectDB()
    console.log('✅ Connected to MongoDB\n')

    // Check if test user exists
    const testEmail = 'test@example.com'
    let testUser = await User.findOne({ email: testEmail })

    if (!testUser) {
      console.log('📝 Creating test user...')
      testUser = await User.create({
        name: 'Test User',
        email: testEmail,
        password: 'test1234', // Will be hashed
        initialBalance: 50000,
      })
      console.log('✅ Test user created!')
    } else {
      console.log('✅ Test user already exists')
    }

    console.log('\n🧪 Test Login Credentials:')
    console.log('─'.repeat(50))
    console.log(`Email: ${testEmail}`)
    console.log(`Password: test1234`)
    console.log('─'.repeat(50))

    console.log('\n📋 User Data:')
    console.log(`Name: ${testUser.name}`)
    console.log(`Email: ${testUser.email}`)
    console.log(`Initial Balance: ₹${testUser.initialBalance}`)

    // Test password matching
    console.log('\n🔐 Testing password match...')
    const isMatch = await testUser.matchPassword('test1234')
    if (isMatch) {
      console.log('✅ Password matches correctly!')
    } else {
      console.log('❌ Password does not match')
    }

    console.log('\n📱 Now try logging in with:')
    console.log(`  Email: ${testEmail}`)
    console.log(`  Password: test1234`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

testLogin()

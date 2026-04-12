const testLoginAPI = async () => {
  console.log('🧪 Testing Login API\n')

  const email = 'test@example.com'
  const password = 'test1234'
  const apiUrl = 'http://localhost:5000/api/auth/login'

  console.log('POST Request:')
  console.log(`URL: ${apiUrl}`)
  console.log(`Body: { email: "${email}", password: "${password}" }`)
  console.log('─'.repeat(70))

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    console.log(`\nStatus: ${response.status}`)
    console.log(`Status Text: ${response.statusText}\n`)

    if (response.ok) {
      console.log('✅ LOGIN SUCCESSFUL!\n')
      console.log('Response Data:')
      console.log('─'.repeat(70))
      console.log(`success: ${data.success}`)
      console.log(`token: ${data.token.substring(0, 20)}...`)
      console.log(`user.id: ${data.user._id}`)
      console.log(`user.name: ${data.user.name}`)
      console.log(`user.email: ${data.user.email}`)
      console.log(`user.initialBalance: ${data.user.initialBalance}`)
      console.log('─'.repeat(70))

      console.log('\n💾 Save this token for testing:')
      console.log(`Authorization: Bearer ${data.token}`)

      console.log('\n✨ Login is working properly!')
      console.log('Check your browser console for any errors.')
    } else {
      console.log('❌ LOGIN FAILED!\n')
      console.log('Response Error:')
      console.log(data)
    }
  } catch (error) {
    console.error('❌ API Request Error:')
    console.error(error.message)
    console.log('\n⚠️ Check:')
    console.log('1. Is the backend running on http://localhost:5000/api?')
    console.log('2. Is MongoDB connected?')
    console.log('3. Does the test user exist?')
  }
}

testLoginAPI()

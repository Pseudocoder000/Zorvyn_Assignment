import dotenv from 'dotenv'

dotenv.config()

const checkAvailableModels = async () => {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env')
    return
  }

  console.log('🔍 Checking available Gemini models...\n')
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('❌ API Error:', error)
      return
    }

    const data = await response.json()
    
    console.log('✅ Available Models:\n')
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        const displayName = model.displayName || model.name
        const supported = model.supportedGenerationMethods || []
        console.log(`📦 ${displayName}`)
        console.log(`   Name: ${model.name}`)
        console.log(`   Supported Methods: ${supported.join(', ')}`)
        console.log()
      })
    } else {
      console.log('No models found')
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

checkAvailableModels()

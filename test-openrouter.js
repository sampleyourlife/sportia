// Using native fetch in Node.js 18+

async function testOpenRouter() {
  const apiKey = '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';
  
  try {
    console.log('Testing OpenRouter API...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3001',
        'X-Title': 'StrategIA Test'
      },
      body: JSON.stringify({
        model: 'qwen/qwen3-14b:free',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message'
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    
    const data = await response.text();
    console.log('Response body:', data);
    
    if (response.ok) {
      const jsonData = JSON.parse(data);
      console.log('AI Response:', jsonData.choices?.[0]?.message?.content);
    } else {
      console.error('API Error:', response.status, data);
    }
    
  } catch (error) {
    console.error('Network Error:', error.message);
  }
}

testOpenRouter();
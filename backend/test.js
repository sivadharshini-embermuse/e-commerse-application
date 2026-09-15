async function testRateLimit() {
  let count = 0;
  let passed = false;
  try {
    for (let i = 0; i < 25; i++) {
      count++;
      const res = await fetch('http://localhost:8000/api/v1/login', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@test.com', password: 'test' })
      });
      
      if (res.status === 429) {
        const data = await res.json();
        console.log(`PASS: Rate limit triggered at request ${count}. Status: 429. Message: ${data.message}`);
        passed = true;
        break;
      }
    }
  } catch (error) {
    console.log(`FAIL: Error - ${error.message}`);
  }
  if (!passed && count === 25) {
    console.log("FAIL: Rate limit was not triggered after 25 requests.");
  }
}

testRateLimit();
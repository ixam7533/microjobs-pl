// Test subscription status endpoint
console.log('Testing subscription status...')

fetch('/api/subscriptions/status', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Response status:', response.status)
  return response.json()
})
.then(data => {
  console.log('Subscription data:', data)
  if (data.subscription && data.subscription.isActive) {
    console.log('✅ User has active subscription:', data.subscription.type)
    console.log('✅ Ads should be hidden')
  } else {
    console.log('❌ User has no active subscription')
    console.log('❌ Ads should be shown')
  }
})
.catch(error => {
  console.error('Error:', error)
})

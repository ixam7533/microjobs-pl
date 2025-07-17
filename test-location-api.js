// test-location-api.js
// Testowy skrypt aby sprawdzić czy API filtrowania będzie działać

const testCases = [
  {
    name: 'Test 1: Filtrowanie po województwie mazowieckim',
    query: 'province=mazowieckie',
    shouldFind: ['Warzenko', 'Warszawa']
  },
  {
    name: 'Test 2: Filtrowanie po mieście Warszawa',
    query: 'city=Warszawa',
    shouldFind: ['Warzenko', 'Warszawa']
  },
  {
    name: 'Test 3: Filtrowanie po mieście Warzenko',
    query: 'city=Warzenko',
    shouldFind: ['Warzenko']
  }
]

console.log('=== Testy API filtrowania ===')

testCases.forEach(test => {
  console.log(`\n${test.name}`)
  console.log(`Query: ${test.query}`)
  console.log(`Powinno znaleźć: ${test.shouldFind.join(', ')}`)
  console.log(`URL do testowania: http://localhost:3000/api/offers?${test.query}`)
})

console.log('\n=== Instrukcje testowania ===')
console.log('1. Uruchom "npm run dev"')
console.log('2. Otwórz strona główną')
console.log('3. Wybierz województwo "mazowieckie"')
console.log('4. Powinno pokazać ogłoszenie "koszenie trawy" z lokalizacją "Warzenko"')
console.log('5. Lub wpisz "Warzenko" w polu miasto')
console.log('6. Powinno też pokazać to samo ogłoszenie')

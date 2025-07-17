// test-location-filter.js
const { normalizujNazweMiasta, alternatywneNazwyMiast } = require('./lib/locations.ts')

// Test normalizacji nazw miast
console.log('=== Test normalizacji nazw miast ===')
console.log('Warzenko ->', normalizujNazweMiasta('Warzenko'))
console.log('Warszawa ->', normalizujNazweMiasta('Warszawa'))
console.log('Katowice ->', normalizujNazweMiasta('Katowice'))

// Test alternatywnych nazw
console.log('\n=== Test alternatywnych nazw ===')
console.log('Alternatywy dla Warszawy:', alternatywneNazwyMiast['Warszawa'])

// Test sprawdzenia czy "Warzenko" powinno pasować do "mazowieckie"
console.log('\n=== Test logiki filtrowania ===')
const location = 'Warzenko'
const province = 'mazowieckie'

// Sprawdź czy Warszawa jest w mazowieckim
const { getMiastaForWojewodztwo } = require('./lib/locations.ts')
const miastaMazowieckie = getMiastaForWojewodztwo(province)
console.log('Czy Warszawa jest w mazowieckim?', miastaMazowieckie.includes('Warszawa'))

// Sprawdź alternatywy
const alternativy = alternatywneNazwyMiast['Warszawa'] || []
console.log('Czy "Warzenko" jest alternatywą dla Warszawy?', alternativy.includes('Warzenko'))

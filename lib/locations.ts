// lib/locations.ts

export const wojewodztwa = [
  'dolnośląskie','kujawsko-pomorskie','lubelskie','lubuskie',
  'łódzkie','małopolskie','mazowieckie','opolskie',
  'podkarpackie','podlaskie','pomorskie','śląskie',
  'świętokrzyskie','warmińsko-mazurskie','wielkopolskie','zachodniopomorskie'
]

export const wojewodztwoMiasta: Record<string, string[]> = {
  'dolnośląskie': [
    'Wrocław', 'Wałbrzych', 'Legnica', 'Jelenia Góra', 'Lubin', 'Głogów', 
    'Świdnica', 'Bolesławiec', 'Oleśnica', 'Dzierżoniów', 'Zgorzelec', 
    'Bielawa', 'Oława', 'Kłodzko', 'Środa Śląska', 'Trzebnica', 'Ząbkowice Śląskie',
    'Jawor', 'Polkowice', 'Góra', 'Złotoryja', 'Nowa Ruda', 'Gryfów Śląski',
    'Kąty Wrocławskie', 'Syców', 'Strzelin', 'Milicz', 'Żmigród', 'Lwówek Śląski'
  ],
  'kujawsko-pomorskie': [
    'Bydgoszcz', 'Toruń', 'Włocławek', 'Grudziądz', 'Inowrocław', 'Brodnica',
    'Żnin', 'Świecie', 'Chełmno', 'Golub-Dobrzyń', 'Wąbrzeźno', 'Rypin',
    'Lipno', 'Nakło nad Notecią', 'Tuchola', 'Koronowo', 'Solec Kujawski',
    'Ciechocinek', 'Aleksandrów Kujawski', 'Kruszwica', 'Mogilno', 'Strzelno'
  ],
  'lubelskie': [
    'Lublin', 'Chełm', 'Zamość', 'Biała Podlaska', 'Puławy', 'Świdnik',
    'Kraśnik', 'Łuków', 'Tomaszów Lubelski', 'Hrubieszów', 'Łęczna', 'Dęblin',
    'Parczew', 'Krasnystaw', 'Międzyrzec Podlaski', 'Radzyń Podlaski', 'Lubartów',
    'Włodawa', 'Janów Lubelski', 'Rejowiec Fabryczny', 'Kazimierz Dolny',
    'Nałęczów', 'Annopol', 'Opole Lubelskie', 'Poniatowa', 'Terespol'
  ],
  'lubuskie': [
    'Gorzów Wielkopolski', 'Zielona Góra', 'Żary', 'Żagań', 'Nowa Sól',
    'Świebodzin', 'Sulechów', 'Międzyrzecz', 'Gubinów', 'Słubice', 'Kostrzyn nad Odrą',
    'Krosno Odrzańskie', 'Szprotawa', 'Wschowa', 'Żukowo', 'Cybinka', 'Rzepin',
    'Lubniewice', 'Strzelce Krajeńskie', 'Witnicy', 'Drezdenko', 'Sulęcin'
  ],
  'łódzkie': [
    'Łódź', 'Piotrków Trybunalski', 'Pabianice', 'Tomaszów Mazowiecki', 'Bełchatów',
    'Zgierz', 'Radomsko', 'Sieradz', 'Skierniewice', 'Kutno', 'Łask', 'Ozorków',
    'Zduńska Wola', 'Wieluń', 'Pajęczno', 'Łowicz', 'Aleksandrów Łódzki',
    'Konstantynów Łódzki', 'Głowno', 'Brzeziny', 'Koluszki', 'Opoczno',
    'Rawa Mazowiecka', 'Wieruszów', 'Poddębice', 'Łęczyca', 'Stryków'
  ],
  'małopolskie': [
    'Kraków', 'Tarnów', 'Nowy Sącz', 'Oświęcim', 'Chrzanów', 'Olkusz', 'Zakopane',
    'Nowy Targ', 'Gorlice', 'Brzesko', 'Wadowice', 'Myślenice', 'Andrychów',
    'Kęty', 'Skawina', 'Wieliczka', 'Niepołomice', 'Limanowa', 'Muszyna',
    'Rabka-Zdrój', 'Sucha Beskidzka', 'Krynica-Zdrój', 'Jordanów', 'Bochnia',
    'Dąbrowa Tarnowska', 'Brzeszcze', 'Kalwaria Zebrzydowska', 'Proszowice'
  ],
  'mazowieckie': [
    'Warszawa', 'Radom', 'Płock', 'Siedlce', 'Pruszków', 'Legionowo', 'Ostrołęka',
    'Żyrardów', 'Ciechanów', 'Mińsk Mazowiecki', 'Otwock', 'Piaseczno', 'Grodzisk Mazowiecki',
    'Wołomin', 'Marki', 'Ząbki', 'Kobyłka', 'Sulejówek', 'Milanówek', 'Piastów',
    'Łomianki', 'Konstancin-Jeziorna', 'Józefów', 'Halinów', 'Wiązowna', 'Karczew',
    'Góra Kalwaria', 'Tłuszcz', 'Serock', 'Nasielsk', 'Pułtusk', 'Mława',
    'Maków', 'Przasnysz', 'Żuromin', 'Różan', 'Wyszków', 'Sokołów Podlaski',
    'Węgrów', 'Łosice', 'Garwolin', 'Pilawa', 'Kozienice', 'Zwoleń', 'Lipsko',
    'Szydłowiec', 'Skarżysko-Kamienna', 'Starachowice', 'Ostrowiec Świętokrzyski'
  ],
  'opolskie': [
    'Opole', 'Kędzierzyn-Koźle', 'Nysa', 'Kluczbork', 'Prudnik', 'Brzeg',
    'Strzelce Opolskie', 'Krapkowice', 'Głubczyce', 'Zdziszowice', 'Lewin Brzeski',
    'Niemodlin', 'Grodków', 'Paczków', 'Namysłów', 'Praszka', 'Zawadzkie',
    'Gogolin', 'Ozimek', 'Baborów', 'Biała', 'Dobrodzień', 'Głogówek'
  ],
  'podkarpackie': [
    'Rzeszów', 'Przemyśl', 'Stalowa Wola', 'Mielec', 'Tarnobrzeg', 'Krosno',
    'Jarosław', 'Sanok', 'Jasło', 'Dębica', 'Łańcut', 'Ropczyce', 'Strzyżów',
    'Brzozów', 'Leżajsk', 'Przeworsk', 'Kolbuszowa', 'Nisko', 'Rudnik nad Sanem',
    'Ustrzyki Dolne', 'Lubaczów', 'Rymanów', 'Iwonicz-Zdrój', 'Pilzno', 'Boguchwała'
  ],
  'podlaskie': [
    'Białystok', 'Suwałki', 'Łomża', 'Augustów', 'Bielsk Podlaski', 'Grajewo',
    'Zambrów', 'Hajnówka', 'Sokółka', 'Mońki', 'Wysokie Mazowieckie', 'Siemiatycze',
    'Drohiczyn', 'Sejny', 'Krynki', 'Wasilków', 'Czarna Białostocka', 'Suraż',
    'Tykocin', 'Knyszyn', 'Jedwabne', 'Rajgród', 'Stawiski', 'Bargłów Kościelny'
  ],
  'pomorskie': [
    'Gdańsk', 'Gdynia', 'Sopot', 'Słupsk', 'Tczew', 'Starogard Gdański',
    'Wejherowo', 'Rumia', 'Reda', 'Pruszcz Gdański', 'Żukowo', 'Kartuzy',
    'Kościerzyna', 'Chojnice', 'Malbork', 'Sztum', 'Nowy Dwór Gdański',
    'Puck', 'Hel', 'Władysławowo', 'Łeba', 'Ustka', 'Człuchów', 'Bytów',
    'Lębork', 'Kwidzyń', 'Gniew', 'Skórcz', 'Pszczółki', 'Banino'
  ],
  'śląskie': [
    'Katowice', 'Częstochowa', 'Sosnowiec', 'Gliwice', 'Zabrze', 'Bytom',
    'Bielsko-Biała', 'Ruda Śląska', 'Rybnik', 'Tychy', 'Dąbrowa Górnicza',
    'Chorzów', 'Jaworzno', 'Jastrzębie-Zdrój', 'Mysłowice', 'Siemianowice Śląskie',
    'Żory', 'Świętochłowice', 'Piekary Śląskie', 'Będzin', 'Czeladź', 'Tarnowskie Góry',
    'Racibórz', 'Wodzisław Śląski', 'Żywiec', 'Cieszyn', 'Ustroń', 'Wisła',
    'Pszczyna', 'Mikołów', 'Czerwionka-Leszczyny', 'Knurów', 'Łaziska Górne',
    'Orzesze', 'Radlin', 'Rydułtowy', 'Wojkowice', 'Sławków', 'Imielin',
    'Lędziny', 'Bieruń', 'Czechowice-Dziedzice', 'Skoczów', 'Strumień'
  ],
  'świętokrzyskie': [
    'Kielce', 'Ostrowiec Świętokrzyski', 'Starachowice', 'Skarżysko-Kamienna',
    'Końskie', 'Busko-Zdrój', 'Jędrzejów', 'Pińczów', 'Kazimierza Wielka',
    'Sandomierz', 'Staszów', 'Włoszczowa', 'Suchedniów', 'Działoszyce',
    'Chmielnik', 'Kunów', 'Małogoszcz', 'Chęciny', 'Daleszyce', 'Bodzentyn',
    'Połaniec', 'Koprzywnica', 'Klimontów', 'Opatów', 'Ożarów'
  ],
  'warmińsko-mazurskie': [
    'Olsztyn', 'Elbląg', 'Ełk', 'Ostróda', 'Iława', 'Giżycko', 'Kętrzyn',
    'Szczytno', 'Mrągowo', 'Bartoszyce', 'Pisz', 'Lidzbark Warmiński', 'Węgorzewo',
    'Gołdap', 'Braniewo', 'Nowe Miasto Lubawskie', 'Działdowo', 'Nidzica',
    'Pasłęk', 'Orneta', 'Górowo Iławeckie', 'Frombork', 'Tolkmicko', 'Dobre Miasto',
    'Jeziorany', 'Korsze', 'Reszel', 'Ryn', 'Mikołajki', 'Biała Piska'
  ],
  'wielkopolskie': [
    'Poznań', 'Kalisz', 'Konin', 'Piła', 'Ostrów Wielkopolski', 'Gniezno',
    'Leszno', 'Śrem', 'Września', 'Turek', 'Krotoszyn', 'Jarocin', 'Pleszew',
    'Kościan', 'Środa Wielkopolska', 'Swarzędz', 'Luboń', 'Mosina', 'Puszczykowo',
    'Czerwonak', 'Murowana Goślina', 'Kostrzyn', 'Pobiedziska', 'Kórnik',
    'Tarnowo Podgórne', 'Dopiewo', 'Rokietnica', 'Stęszew', 'Buk', 'Grodzisk Wielkopolski',
    'Opalenica', 'Nowy Tomyśl', 'Wolsztyn', 'Zbąszynek', 'Trzcianka', 'Chodzież',
    'Wągrowiec', 'Rogoźno', 'Obrzycko', 'Szamotuły', 'Pniewy', 'Lwówek'
  ],
  'zachodniopomorskie': [
    'Szczecin', 'Koszalin', 'Stargard', 'Świnoujście', 'Wałcz',
    'Kołobrzeg', 'Szczecinek', 'Białogard', 'Gryfino', 'Goleniów', 'Pyrzyce',
    'Myślibórz', 'Dębno', 'Choszczno', 'Łobez', 'Drawsko Pomorskie', 'Świdwin',
    'Połczyn-Zdrój', 'Złocieniec', 'Borne Sulinowo', 'Sławno', 'Darłowo',
    'Miastko', 'Trzebiatów', 'Rewal', 'Międzyzdroje',
    'Kamień Pomorski', 'Wolin', 'Dziwnów', 'Nowogard', 'Gryfice', 'Płoty'
  ]
}

// Mapowanie alternatywnych nazw miast
export const alternatywneNazwyMiast: Record<string, string[]> = {
  'Warszawa': ['Warzenko', 'Wawa', 'Stołeczne', 'Mazowieckie', 'Warsaw'],
  'Kraków': ['Cracow', 'Krakow', 'Małopolskie'],
  'Gdańsk': ['Trojmiasto', 'Trójmiasto', 'Pomorskie'],
  'Wrocław': ['Dolnośląskie', 'Wroclaw'],
  'Poznań': ['Poznan', 'Wielkopolskie'],
  'Łódź': ['Lodz', 'Łódzkie'],
  'Katowice': ['Śląskie', 'Slask', 'Śląsk', 'Katowice Śląskie'],
  'Lublin': ['Lubelskie'],
  'Białystok': ['Podlaskie'],
  'Szczecin': ['Zachodniopomorskie'],
  'Bydgoszcz': ['Kujawsko-Pomorskie'],
  'Olsztyn': ['Warmińsko-Mazurskie'],
  'Rzeszów': ['Podkarpackie'],
  'Kielce': ['Świętokrzyskie'],
  'Gorzów Wielkopolski': ['Lubuskie'],
  'Opole': ['Opolskie']
}

// Dodatkowe alternatywy dla często używanych nazw
export const popularneSktoty: Record<string, string[]> = {
  'Warzenko': ['Warszawa'],
  'Kato': ['Katowice'],
  'Krakus': ['Kraków'],
  'Trojmiasto': ['Gdańsk', 'Gdynia', 'Sopot'],
  'Slask': ['Katowice', 'Zabrze', 'Gliwice', 'Bytom'],
  'Stolica': ['Warszawa']
}

// Funkcja do znalezienia właściwej nazwy miasta na podstawie alternatywnych nazw
export function normalizujNazweMiasta(nazwaWejsciowa: string): string {
  const nazwaLower = nazwaWejsciowa.toLowerCase()
  
  // Sprawdź alternatywne nazwy
  for (const [prawdziwaNazwa, alternatywy] of Object.entries(alternatywneNazwyMiast)) {
    if (prawdziwaNazwa.toLowerCase() === nazwaLower) {
      return prawdziwaNazwa
    }
    
    if (alternatywy.some(alt => alt.toLowerCase() === nazwaLower)) {
      return prawdziwaNazwa
    }
  }
  
  return nazwaWejsciowa // Zwróć oryginalną nazwę jeśli nie znaleziono
}

// Rozszerzona funkcja normalizacji
export function rozszerzoneWyszukiwanie(nazwaWejsciowa: string): string[] {
  const nazwaLower = nazwaWejsciowa.toLowerCase()
  const wyniki: string[] = []
  
  // Dodaj oryginalną nazwę
  wyniki.push(nazwaWejsciowa)
  
  // Sprawdź popularne skróty
  for (const [skrot, miasta] of Object.entries(popularneSktoty)) {
    if (skrot.toLowerCase() === nazwaLower) {
      wyniki.push(...miasta)
    }
  }
  
  // Sprawdź alternatywne nazwy
  for (const [prawdziwaNazwa, alternatywy] of Object.entries(alternatywneNazwyMiast)) {
    if (prawdziwaNazwa.toLowerCase() === nazwaLower) {
      wyniki.push(...alternatywy)
    }
    
    if (alternatywy.some(alt => alt.toLowerCase() === nazwaLower)) {
      wyniki.push(prawdziwaNazwa)
    }
  }
  
  return [...new Set(wyniki)] // Usuń duplikaty
}

// Funkcja do wyszukiwania wojewódta dla miasta
export function getWojewodztwoForCity(city: string): string | null {
  const cityLower = city.toLowerCase()
  
  for (const [wojewodztwo, miasta] of Object.entries(wojewodztwoMiasta)) {
    if (miasta.some(miasto => miasto.toLowerCase().includes(cityLower))) {
      return wojewodztwo
    }
  }
  
  return null
}

// Funkcja do pobierania miast dla województwa
export function getMiastaForWojewodztwo(wojewodztwo: string): string[] {
  return wojewodztwoMiasta[wojewodztwo] || []
}

// Funkcja do sprawdzania czy lokalizacja pasuje do filtrów
export function matchesLocationFilter(location: string, province?: string, city?: string): boolean {
  const locationLower = location.toLowerCase()
  
  // Jeśli podano tylko województwo
  if (province && !city) {
    // Sprawdź czy w lokalizacji jest nazwa województwa
    if (locationLower.includes(province.toLowerCase())) {
      return true
    }
    
    // Sprawdź czy w lokalizacji jest jakieś miasto z tego województwa
    const miasta = getMiastaForWojewodztwo(province)
    const matchesCity = miasta.some(miasto => locationLower.includes(miasto.toLowerCase()))
    
    if (matchesCity) return true
    
    // Sprawdź alternatywne nazwy miast
    for (const miasto of miasta) {
      const alternatywy = alternatywneNazwyMiast[miasto] || []
      if (alternatywy.some(alt => locationLower.includes(alt.toLowerCase()))) {
        return true
      }
    }
    
    return false
  }
  
  // Jeśli podano tylko miasto
  if (city && !province) {
    // Sprawdź bezpośrednie dopasowanie
    if (locationLower.includes(city.toLowerCase())) {
      return true
    }
    
    // Sprawdź czy to alternatywna nazwa
    const normalizedCity = normalizujNazweMiasta(city)
    if (locationLower.includes(normalizedCity.toLowerCase())) {
      return true
    }
    
    // Sprawdź czy podane miasto ma alternatywy które pasują do lokalizacji
    const alternatywy = alternatywneNazwyMiast[normalizedCity] || []
    if (alternatywy.some(alt => locationLower.includes(alt.toLowerCase()))) {
      return true
    }
    
    return false
  }
  
  // Jeśli podano i województwo i miasto
  if (province && city) {
    const cityLower = city.toLowerCase()
    const miasta = getMiastaForWojewodztwo(province)
    
    // Sprawdź czy miasto należy do tego województwa (z alternatywami)
    const normalizedCity = normalizujNazweMiasta(city)
    const cityInProvince = miasta.some(miasto => 
      miasto.toLowerCase().includes(cityLower) || 
      miasto.toLowerCase() === normalizedCity.toLowerCase()
    )
    
    if (cityInProvince) {
      return locationLower.includes(cityLower) || locationLower.includes(normalizedCity.toLowerCase())
    }
    
    return false
  }
  
  return true
}

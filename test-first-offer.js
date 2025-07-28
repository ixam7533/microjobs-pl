// Test pierwszego darmowego ogłoszenia
const baseUrl = 'http://localhost:3000';

async function testFirstOffer() {
    console.log('🔍 Testowanie systemu pierwszego darmowego ogłoszenia...');
    
    const testUser = {
        email: `newuser${Date.now()}@test.com`,
        password: 'test123456'
    };
    
    console.log(`🔍 Test user: ${testUser.email}`);
    
    try {
        // 1. Rejestracja
        console.log('1️⃣ Rejestracja...');
        const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        const registerData = await registerResponse.json();
        console.log('📋 Register response:', registerData);
        
        if (!registerResponse.ok || !registerData.confirmLink) {
            throw new Error('Rejestracja nie powiodła się');
        }
        
        // 2. Potwierdzenie
        console.log('2️⃣ Potwierdzanie konta...');
        const confirmToken = registerData.confirmLink.split('token=')[1];
        const confirmResponse = await fetch(`${baseUrl}/api/auth/confirm?token=${confirmToken}`, {
            method: 'GET',
            redirect: 'manual'
        });
        console.log('✅ Konto potwierdzone');
        
        // 3. Logowanie
        console.log('3️⃣ Logowanie...');
        const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser),
            credentials: 'include'
        });
        
        const loginData = await loginResponse.json();
        console.log('📋 Login response:', loginData);
        
        if (!loginResponse.ok) {
            throw new Error('Logowanie nie powiodło się');
        }
        
        // Pobierz cookie z odpowiedzi
        const setCookieHeader = loginResponse.headers.get('set-cookie');
        const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
        const tokenValue = tokenMatch ? tokenMatch[1] : null;
        
        if (!tokenValue) {
            throw new Error('Nie otrzymano tokenu JWT');
        }
        
        console.log('🔑 Token otrzymany');
        
        // 4. Sprawdzenie profilu użytkownika
        console.log('4️⃣ Sprawdzanie profilu...');
        const meResponse = await fetch(`${baseUrl}/api/auth/me`, {
            headers: {
                'Cookie': `token=${tokenValue}`
            }
        });
        
        const meData = await meResponse.json();
        console.log('📋 Profile data:', meData);
        
        // 5. Sprawdzenie ofert użytkownika
        console.log('5️⃣ Sprawdzanie ofert użytkownika...');
        const offersResponse = await fetch(`${baseUrl}/api/auth/my-offers`, {
            headers: {
                'Cookie': `token=${tokenValue}`
            }
        });
        
        const offersData = await offersResponse.json();
        console.log('📋 Offers data:', offersData);
        
        const isFirstOffer = (offersData.offers || []).length === 0;
        console.log(`🔍 Jest pierwszym ogłoszeniem: ${isFirstOffer}`);
        
        if (isFirstOffer) {
            console.log('✅ System pierwszego darmowego ogłoszenia działa poprawnie!');
        } else {
            console.log('❌ Problem: użytkownik nie jest wykrywany jako nowy');
        }
        
    } catch (error) {
        console.error('❌ Błąd testu:', error.message);
    }
}

testFirstOffer();

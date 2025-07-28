// Stwórz testowego użytkownika dla demo w przeglądarce
const baseUrl = 'http://localhost:3000';

async function createTestUser() {
    const testUser = {
        email: 'demo@microjobs.com',
        password: 'demo123'
    };
    
    console.log('🔍 Tworzenie demo użytkownika...');
    
    try {
        // Rejestracja
        const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        
        const registerData = await registerResponse.json();
        console.log('📋 Register response:', registerData);
        
        if (registerData.confirmLink) {
            // Potwierdzenie
            const confirmToken = registerData.confirmLink.split('token=')[1];
            await fetch(`${baseUrl}/api/auth/confirm?token=${confirmToken}`);
            console.log('✅ Demo user created and confirmed');
            console.log('📧 Email: demo@microjobs.com');
            console.log('🔐 Password: demo123');
            console.log('🎯 Ten użytkownik ma 0 ofert, więc powinien mieć darmowe ogłoszenie!');
        }
        
    } catch (error) {
        if (error.message.includes('zarejestrowany')) {
            console.log('ℹ️ Demo user już istnieje');
            console.log('📧 Email: demo@microjobs.com');
            console.log('🔐 Password: demo123');
        } else {
            console.error('❌ Błąd:', error.message);
        }
    }
}

createTestUser();

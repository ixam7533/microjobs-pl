#!/usr/bin/env node

/**
 * Skrypt do naprawy problemów z autentykacją - usuwa próby ręcznego pobierania
 * tokenu z document.cookie i zamienia na credentials: 'include'
 */

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/PromotionCounter.tsx',
  'components/SubscriptionManager.tsx', 
  'components/AdBlocker.tsx',
  'components/AccountSettings.tsx',
  'pages/pro.tsx',
  'pages/profile.tsx'
];

const workspaceRoot = '/Users/admin/Documents/Aplikacje IOS/microjobs';

console.log('🔧 Naprawiam problemy z autoryzacją...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Plik nie istnieje: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    // Pattern 1: Usuń pobieranie tokenu z document.cookie dla requestów z Authorization header
    const tokenPattern = /const token = document\.cookie\.split\(';'\)\.find\(row => row\.startsWith\('token='\)\)\?\.split\('='\)\[1\]/g;
    
    // Pattern 2: Usuń sprawdzanie tokenu przed requestem  
    const tokenCheckPattern = /if \(!token\) {\s*(?:alert\([^}]+\);\s*)?(?:window\.location\.href = [^;]+;\s*)?return;\s*}/g;
    
    // Pattern 3: Zamień nagłówek Authorization na credentials
    const authHeaderPattern = /'Authorization': `Bearer \$\{token\}`/g;
    const authHeaderPattern2 = /"Authorization": `Bearer \$\{token\}`/g;
    
    // Usuń niepotrzebne linie pobierania tokenu
    if (content.match(tokenPattern)) {
      // Sprawdź czy to jest używane tylko do Authorization header (nie do localStorage czy innych celów)
      const lines = content.split('\n');
      const newLines = [];
      let skipNext = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Jeśli linia zawiera pobieranie tokenu i następne linie to sprawdzenie lub użycie w Authorization
        if (line.match(tokenPattern)) {
          // Sprawdź następne linie czy to Authorization pattern
          let j = i + 1;
          let isAuthPattern = false;
          
          // Pomiń puste linie i sprawdź dalej
          while (j < lines.length && j < i + 10) {
            const nextLine = lines[j].trim();
            if (nextLine.includes('Authorization') || nextLine.includes('Bearer')) {
              isAuthPattern = true;
              break;
            }
            if (nextLine && !nextLine.includes('if (!token)') && !nextLine.includes('return')) {
              break;
            }
            j++;
          }
          
          if (isAuthPattern) {
            // Pomiń tę linię - nie dodawaj do newLines
            hasChanges = true;
            continue;
          }
        }
        
        // Pomiń sprawdzenie tokenu
        if (line.match(tokenCheckPattern)) {
          hasChanges = true;
          continue;
        }
        
        newLines.push(line);
      }
      
      content = newLines.join('\n');
    }
    
    // Zamień Authorization header na credentials
    if (content.match(authHeaderPattern) || content.match(authHeaderPattern2)) {
      content = content.replace(authHeaderPattern, "'Content-Type': 'application/json'");
      content = content.replace(authHeaderPattern2, '"Content-Type": "application/json"');
      
      // Dodaj credentials: 'include' jeśli nie ma
      content = content.replace(
        /(headers:\s*{\s*[^}]+})/g, 
        (match) => {
          if (!match.includes("credentials")) {
            return match.replace('}', "},\n        credentials: 'include'");
          }
          return match;
        }
      );
      
      hasChanges = true;
    }
    
    if (hasChanges) {
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Naprawiono: ${filePath}`);
    } else {
      console.log(`ℹ️  Bez zmian: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`❌ Błąd w pliku ${filePath}:`, error.message);
  }
});

console.log('\n🎉 Skrypt zakończony!');
console.log('💡 Wszystkie komponenty powinny teraz używać httpOnly cookies zamiast Authorization headers.');

#!/usr/bin/env node

/**
 * Skrypt v2 - Usuwa wszystkie document.cookie tokeny używane z Authorization headers
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

console.log('🔧 Naprawiam problemy z autoryzacją v2...\n');

filesToFix.forEach(filePath => {
  const fullPath = path.join(workspaceRoot, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Plik nie istnieje: ${filePath}`);
    return;
  }
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let hasChanges = false;
    
    console.log(`🔍 Sprawdzam: ${filePath}`);
    
    // 1. Znajdź wszystkie bloki kodu z document.cookie i Authorization
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Jeśli linia zawiera pobieranie tokenu z document.cookie
      if (line.includes('document.cookie.split') && line.includes('token=')) {
        console.log(`   Znaleziono token w linii ${i + 1}: ${line.trim()}`);
        
        // Sprawdź czy w kolejnych liniach jest sprawdzenie tokenu lub Authorization
        let j = i + 1;
        let foundAuth = false;
        let linesToSkip = 0;
        
        // Sprawdź następne 15 linii
        while (j < lines.length && j < i + 15) {
          const nextLine = lines[j];
          
          if (nextLine.includes('Authorization') && nextLine.includes('Bearer')) {
            foundAuth = true;
            console.log(`   Znaleziono Authorization w linii ${j + 1}`);
            break;
          }
          
          // Sprawdź czy to sprawdzenie tokenu do pominięcia
          if (nextLine.includes('if (!token)') || 
              (nextLine.includes('if') && nextLine.includes('token') && nextLine.includes('!'))) {
            linesToSkip++;
            
            // Poszukaj zamknięcia tego if-a
            let k = j + 1;
            let braceCount = 0;
            while (k < lines.length && k < j + 10) {
              if (lines[k].includes('{')) braceCount++;
              if (lines[k].includes('}')) {
                braceCount--;
                if (braceCount <= 0) {
                  linesToSkip = k - j + 1;
                  break;
                }
              }
              k++;
            }
          }
          
          j++;
        }
        
        if (foundAuth) {
          console.log(`   Pomijam token i ${linesToSkip} linii sprawdzenia`);
          hasChanges = true;
          // Pomiń linię z tokenem
          // Pomiń linie sprawdzenia tokenu
          i += linesToSkip;
          continue;
        }
      }
      
      // Sprawdź czy to linia z Authorization Bearer
      if ((line.includes("'Authorization'") || line.includes('"Authorization"')) && 
          line.includes('Bearer') && line.includes('token')) {
        console.log(`   Usuwam Authorization w linii ${i + 1}: ${line.trim()}`);
        hasChanges = true;
        continue; // Pomiń tę linię
      }
      
      newLines.push(line);
    }
    
    if (hasChanges) {
      let newContent = newLines.join('\n');
      
      // 2. Dodaj credentials: 'include' do fetch gdzie potrzeba
      newContent = newContent.replace(
        /(fetch\([^,]+,\s*{\s*method:\s*['"][^'"]+['"],?\s*headers:\s*{\s*['"]Content-Type['"]:\s*['"]application\/json['"][^}]*})/g,
        (match) => {
          if (!match.includes('credentials')) {
            return match + ",\n        credentials: 'include'";
          }
          return match;
        }
      );
      
      // 3. Dla fetch bez headers ale z methodą
      newContent = newContent.replace(
        /(fetch\([^,]+,\s*{\s*method:\s*['"][^'"]+['"])(\s*})/g,
        (match, start, end) => {
          if (!match.includes('credentials')) {
            return start + ",\n        credentials: 'include'" + end;
          }
          return match;
        }
      );
      
      fs.writeFileSync(fullPath, newContent);
      console.log(`✅ Naprawiono: ${filePath}\n`);
    } else {
      console.log(`ℹ️  Bez zmian: ${filePath}\n`);
    }
    
  } catch (error) {
    console.error(`❌ Błąd w pliku ${filePath}:`, error.message);
  }
});

console.log('🎉 Skrypt v2 zakończony!');

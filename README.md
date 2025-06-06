# 🎉 JEToP Mobile Dev Challenge 2025 

## 🚀 Tech Stack

- **Framework:** React Native + Expo SDK 53
- **Autenticazione:** Clerk (OAuth Google)
- **Backend Database:** Supabase (PostgreSQL in cloud)
- **AI Integration:** Ollama con modelli open-source via server Node.js
- **Geolocalizzazione:** `expo-location`
- **QR Code:** `react-native-qrcode-svg`
- **Navigation:** `expo-router`

---


## ▶️ Come eseguire il progetto

### 📱 App Mobile (React Native + Expo)

1. **Clona la repository:**
2. **Installa le dipendenze con il comando `npm install` **
3. **Esegui con il comando `npx expo start` **

Nota: L'app è accessibile solo da dispositivi mobili (Android/iOS) tramite il QR code generato da Metro.
Assicurati che lo smartphone sia connesso alla stessa rete locale del computer.

### 🚀 Server Ollama 
1. Posizionati nella cartella /api.
2. **Installa le dipendenze con il comando `npm install` **
3. Esegui lo script con index.js
4. Il server sarà in ascolto e pronto a ricevere richieste.

🌐 Per funzionare da mobile, inserisci nel codice l’indirizzo IP locale del tuo computer
(esempio: http://192.168.X.X:3000) così il dispositivo mobile potrà comunicare con il server.

## 🔐 Autenticazione

L'app utilizza **Clerk** per la gestione degli utenti e l'autenticazione tramite Google. Può accedere chiunque abbia una mail registrata su Google.

---

## 🧭 Navigazione

L'app è divisa in **3 tab principali**:

### 📅 Eventi

- Consulta tutti gli eventi disponibili (prenotabili e non).
- Visualizza dettagli e distanza dall’utente.
- Prenotazione con limite massimo di posti.
- Gli utenti autenticati possono **aggiungere un nuovo evento**.

### 🎟 Prenotazioni

- Visualizza tutti gli eventi prenotati (futuri).
- Ogni evento ha un QR code associato.
- Visualizza **eventi passati** a cui si è partecipato.

### 🧰 Utils

Tre strumenti utili:

- `NicknameGenerator.tsx`: genera nickname tramite chiamata AI ad Ollama.
- `GroupRandomizer.tsx`: randomizza una lista di nomi in gruppi.
- `DiceGameAccordion.tsx`: mini-gioco di dadi configurabili, con lancio casuale.

### ✨ Features “Nice to Have” (facoltative)

- Impostazioni profilo (nome, foto)
- Geolocalizzazione per calcolo distanza evento
- Generazione QR code per eventi prenotati.

# 📊 HC/PG SA Daily Report System

A Firebase-based reporting system with daily tracking, monthly totals, and bonus calculator integration.

---

## 🚀 Features

- 📅 Daily entry per store
- ✏️ Edit existing records
- 📊 Auto monthly totals computation
- 📦 Grouped monthly summary with subtotal per month
- 💰 Bonus calculator modal (embedded)
- 📱 Mobile-friendly PWA
- 🔄 Real-time Firestore sync

---

## 🧠 Key Fixes Included

- Fixed monthly totals not loading
- Fixed Firestore listener issues
- Fixed edit/update inconsistencies
- Stabilized recomputation logic
- Prevented UI breaking from undefined values

---

## 💰 Bonus Calculator

Integrated via modal:
- Opens inside app (no tab switching)
- Uses external system:
  https://yuilovemiyu.github.io/Bonus-Calculator/

---

## 📦 Installation

1. Upload files to hosting (Firebase Hosting recommended)
2. Include:
   - index.html
   - app.js
   - manifest.json
   - sw.js (optional PWA)
   - /icons/

---

## 🔥 Firebase Setup

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "..."
};

# ⚡ NutriScan

**Skannaa. Tiedä. Syö turvallisesti.**

NutriScan on mobiili-first verkkosovellus, joka auttaa tunnistamaan elintarvikkeiden allergeenit, E-koodit ja ravintosisällön — ja ehdottaa vähähiilihydraattisia reseptejä skannattujen tuotteiden perusteella.

![Lisenssi](https://img.shields.io/badge/lisenssi-MIT-green)
![Kielet](https://img.shields.io/badge/kielet-suomi%20%7C%20englanti-blue)
![Alusta](https://img.shields.io/badge/alusta-mobiili--first%20PWA-orange)

---

## ✨ Ominaisuudet

### 🔍 Tuotteiden tunnistus (4 tapaa)
| Menetelmä | Kuvaus |
|---|---|
| 📷 **Kamera** | Ota kuva tuotteesta — AI-tunnistaa tuotteen |
| 📤 **Lataa kuva** | Pudota tai valitse kuva galleriasta |
| 📱 **Viivakoodi** | Syötä viivakoodinumero tai skannaa kameralla |
| ⌨️ **Käsin** | Syötä tuotteen tiedot itse |

### ⚠️ Allergeenipankki
- **12 allergeenia** kattavilla tiedoilla: oireet (lievät/kohtalaiset/vakavat), tyypillinen alkamisaika, ristireaktiivisuus, yleiset esiintymislähteet
- Tunnistaa allergeenit sekä **suomen- että englanninkielisistä** ainesosaluetteloista
- Jokaisella allergeenilla oma tietosivu

### 🧪 E-kooditietokanta
- **40+ E-koodia** jaoteltu riskitason mukaan: ⚠️ Korkea / Kohtalainen / ✓ Turvallinen
- Sisältää: kategoria, alkuperä, käyttötarkoitus, mahdolliset haitat, yleiset esiintymislähteet
- Tuntemattomat E-koodit tunnistetaan ja merkitään

### 🍳 Reseptipankki
- **32 vähähiilihydraattista reseptiä** (1–10g hiilihydraattia / annos)
- Kategoriat: Pizza, Keitot, Liha, Kana, Kala, Pataruoat, Aamiaiset, Salaatit, Aasialainen, Kasvis, Välipalat, Jälkiruoat
- **Allergeenivaroitukset** jokaisessa reseptissä
- **Korvaavien ainesosien ehdotukset** — klikkaa ⚠️-kuvaketta ja vaihda allergeeni turvalliseen vaihtoehtoon
- Pikahaku ja suodatus (kasvis, vegaani, gluteeniton, maidoton, sokeriton, pähkinätön)

### 📊 Tuoteanalyysi
- Ravintosisältö: kalorit, proteiini, hiilihydraatit, rasva
- Tunnistetut allergeenit ja E-numerot omilla välilehdillään
- Reseptiehdotukset suoraan tuotesivulla
- Ristilinkitys allergeeni- ja reseptipankkeihin

---

## 🛠️ Tekninen arkkitehtuuri

```
web/
├── index.html              # Single-page sovellus (HTML + CSS + vanilla JS)
├── js/
│   ├── allergenDatabase.js # Allergeenitietokanta (12 allergeenia, oireet, ristireaktiivisuus)
│   ├── eCodeDatabase.js    # E-kooditietokanta (40+ lisäainetta, riskitasot)
│   ├── localProductDatabase.js  # Paikallinen tuotetietokanta + Open Food Facts -integraatio
│   ├── recipeAdapter.js    # Reseptiadapteri (paikallinen + Spoonacular + K-Ruoka + Edamam jne.)
│   ├── aiImageRecognition.js    # AI-pohjainen kuvantunnistus
│   ├── i18n.js             # Monikielisyys (suomi / englanti, oletus: selaimen kieli)
│   └── recipes.json        # 32 vähähiilihydraattista reseptiä (suomeksi)
```

### Teknologiat
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript (ES6+)
- **CSS:** Custom Properties -dark theme, mobiili-first (max-width: 480px), `100dvh`
- **Tietokannat:** Open Food Facts API (4M+ tuotetta, ei API-avainta), localStorage-välimuisti
- **Reseptilähteet:** Paikallinen JSON, Spoonacular API, K-Ruoka, Pirkka, Valio, Edamam
- **Lokalisointi:** Suomi (oletus), Englanti — selaimen `navigator.language` -tunnistus

### Design-periaatteet
- 📱 **Mobiili-first:** 480px maksimileveys, `100dvh` korkeus, touch-ystävälliset kontrollit
- 🌙 **Dark theme:** CSS custom properties, korkea kontrasti
- ⚡ **Ei riippuvuuksia:** Puhdas vanilla JS, ei frameworkeja
- 🔌 **Offline-tuki:** localStorage-pohjainen välimuisti tuotteille
- ♿ **Saavutettavuus:** Semanttinen HTML, ARIA-labelit

---

## 🚀 Käynnistä paikallisesti

```bash
# Kloonaa repo
git clone https://github.com/SamppaFIN/NutriScan.git
cd NutriScan

# Käynnistä paikallinen palvelin (valitse yksi)
npx serve web          # Node.js
python -m http.server  # Python
```

Avaa selaimessa: **http://localhost:3000**

---

## 📸 Käyttöliittymä

```
┌──────────────────────────────┐
│ ☰          ⚡ NutriScan      │
├──────────────────────────────┤
│  ┌──────────────────────┐    │
│  │  📷 KAMERA-ETSIN     │    │  ← Dynaaminen kontrollialue
│  │  Aloita napauttamalla │    │    Vaihtuu välilehden mukaan
│  └──────────────────────┘    │
│  Kamera │ Lataa │Viivak.│Käsin│ ← Metodivalitsin
│  🛡️ Allergeenipankki         │  ← Pikalinkit
│  🍳 Reseptipankki            │
└──────────────────────────────┘
```

---

## 📦 Riippuvuudet

- **Font Awesome 5** (CDN) — ikonit
- **Open Food Facts API** — tuotetietokanta (ilmainen, ei vaadi avainta)
- **Spoonacular / Edamam** — reseptirajapinnat (valinnainen, vaatii API-avaimen)

---

## 🤝 Kontribuointi

1. Forkkaa repo
2. Luo feature-branch (`git checkout -b feature/uusi-ominaisuus`)
3. Committaa muutokset (`git commit -m 'Lisää uusi ominaisuus'`)
4. Puske branchiin (`git push origin feature/uusi-ominaisuus`)
5. Avaa Pull Request

---

## 📄 Lisenssi

MIT © 2026 SamppaFIN

---

## 🔗 Linkit

- [Open Food Facts](https://world.openfoodfacts.org/)
- [Spoonacular API](https://spoonacular.com/food-api)
- [Edamam API](https://developer.edamam.com/)

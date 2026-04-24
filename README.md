# Meeting@FlexWork – Golf Turnier App

Eine Progressive Web App (PWA) zur Verwaltung und Auswertung des jährlichen Meeting@FlexWork Golf-Turniers.

---

## 🚀 Live-URL

**https://thorsten1708.github.io/flexwork2026/**

---

## 📱 Features (v3.5)

### Turnier-Tab
- **Gesamtergebnis** – Live-Rangliste mit Netto & Brutto, automatisch berechnet
- **Qualifikationsrunde** – 8 Runden, Streicher-Regel (schlechteste Runde wird gestrichen), Ersatz-Werte bei Abwesenheit
- **Endrunde Race4Munich** – 4 Runden in Bad Griesbach, Faktor ×2 in Gesamtwertung
- **Verlaufsdiagramm** – Kumulierte Netto-Punkte über die Qualirunden (Chart.js)
- **PDF-Export** – Druckoptimierte Ansicht via Browser-Print
- **Live-Sync** – Echtzeit-Synchronisation über Firebase Firestore
- **In-App Update-Banner** – Benachrichtigung wenn ein anderes Gerät Daten ändert
- **PIN-Schutz** – Eingaben nur nach PIN-Eingabe möglich (PIN: 2026)
- **PWA** – Installierbar auf iOS & Android, offline-fähig via Service Worker

### Statistik-Tab
- **Hall of Fame** – Saison-Ranglisten 2022–2026, Gesamtbilanz aller Siege
- **Spieler-Profile** – Ø Netto, beste/schlechteste Runde, Saison-Siege, Verlaufschart
- **Direktvergleich** – Rundensiege aller Spieler über alle Saisons
- **Platzkönige** – Bester Durchschnitt auf Plätzen die mehrfach gespielt wurden

---

## 🏗️ Architektur

### Tech Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (Single Page App)
- **Datenbank**: Firebase Firestore (Realtime)
- **Hosting**: GitHub Pages
- **Charts**: Chart.js 4.4
- **PWA**: Service Worker + Web App Manifest

### Firestore-Struktur

```
# Aktuelle Saison 2026 (Legacy-Pfad)
tournaments/
  mfw2026/
    qualiRounds: [...]
    finalRounds: [...]

# Historische Saisons (neuer Pfad)
seasons/
  2025/
    tournaments/
      mfw2025/
        qualiRounds: [...]
        finalRounds: [...]
  2024/
    tournaments/
      mfw2024/ ...
  2023/
    tournaments/
      mfw2023/ ...
  2022/
    tournaments/
      mfw2022/ ...
```

### Datenstruktur pro Saison

```json
{
  "qualiRounds": [
    {
      "name": "Bad Griesbach - Uttlau",
      "date": "14.09.25",
      "fixed": true,
      "netto": [22, 23, 26, 23],
      "brutto": [13, 8, 11, 9]
    }
  ],
  "finalRounds": [
    {
      "name": "Bad Griesbach I (Do) – Sagmühle",
      "date": "10.09.26",
      "netto": [0, 0, 0, 0],
      "brutto": [0, 0, 0, 0]
    }
  ]
}
```

Spieler-Reihenfolge in Arrays: `[Lutz, Markus, Henrick, Thorsten]`

---

## 📅 Neue Saison anlegen

### 1. Saison in `index.html` registrieren

In der `SEASONS`-Konstante einen neuen Eintrag hinzufügen:

```javascript
const SEASONS = {
  '2026': { label: 'Saison 2026', legacy: true, legacyDoc: 'mfw2026' },
  '2027': { label: 'Saison 2027', legacy: false, tournamentId: 'mfw2027' }, // NEU
  ...
};
```

### 2. Seed-Script erstellen

Eine neue `seed-2027.html` nach dem Muster der bestehenden Scripts anlegen (siehe `seed-2025.html` als Vorlage). Plätze und Daten eintragen, dann im Browser öffnen und Button klicken.

### 3. Versionsnummer erhöhen

```javascript
const APP_VERSION = '4.0'; // z.B.
```

### 4. Pushen

```bash
git add index.html seed-2027.html
git commit -m "v4.0: Saison 2027 hinzugefügt"
git push
```

---

## 🌱 Historische Daten einspielen (Seed-Scripts)

Für jede Saison gibt es ein Seed-Script das die Daten einmalig in Firestore schreibt:

| Script | URL |
|--------|-----|
| `seed-2025.html` | https://thorsten1708.github.io/flexwork2026/seed-2025.html |
| `seed-2024.html` | https://thorsten1708.github.io/flexwork2026/seed-2024.html |
| `seed-2023.html` | https://thorsten1708.github.io/flexwork2026/seed-2023.html |
| `seed-2022.html` | https://thorsten1708.github.io/flexwork2026/seed-2022.html |

Einfach URL öffnen → Button klicken → fertig. Kann jederzeit wiederholt werden (überschreibt).

---

## 🔥 Firebase Konfiguration

### Projekt
- **Project ID**: `flexwork2026`
- **Console**: https://console.firebase.google.com/project/flexwork2026

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Legacy 2026
    match /tournaments/{doc} {
      allow read, write: if true;
    }
    // Neue Saisons
    match /seasons/{season}/tournaments/{doc} {
      allow read, write: if true;
    }
  }
}
```

> **Hinweis**: `if true` ist für eine private App mit PIN-Schutz ausreichend. Für erhöhte Sicherheit kann Firebase Authentication ergänzt werden.

---

## 🚢 Deployment

Die App wird automatisch über **GitHub Pages** deployed:
- Jeder Push auf `main` → automatisches Deployment
- URL: https://thorsten1708.github.io/flexwork2026/
- Deployment-Dauer: ca. 1–2 Minuten nach Push

### Manueller Push
```bash
cd meeting-flexwork-2026
git add .
git commit -m "v3.x: Beschreibung"
git push
```

---

## 🎮 Spielregeln (implementiert)

### Qualifikationsrunde
- Jeder Spieler spielt alle Runden
- **Streicher-Regel**: Die schlechteste Netto-Runde wird gestrichen
- **Ersatz-Wert**: Fehlt ein Spieler, bekommt er den schlechtesten Wert der anderen Spieler dieser Runde
- Streicher bei Ersatz-Runden: Der schlechteste Ersatz-Wert wird gestrichen

### Endrunde
- 4 Runden in Bad Griesbach
- Kein Streicher
- Faktor **×2** in der Gesamtwertung

### Gesamtwertung
```
Gesamt Netto = Quali Netto gewertet + (Endrunde Netto × 2)
Gesamt Brutto = Quali Brutto gewertet + (Endrunde Brutto × 2)
```

---

## 📋 Versionshistorie

| Version | Änderungen |
|---------|-----------|
| v1.x | Grundversion mit Firestore |
| v2.1 | PIN/Lock, Ersatz-Werte, Streicher-Logik |
| v3.0 | Toast, Live-Berechnung, Chart, PDF, Multi-Saison, Update-Banner |
| v3.1 | Fokus-Fix, Mobile Header, Collapse-Hint |
| v3.2 | Saison 2025 + Seed-Script |
| v3.3 | Saison 2024 + Seed-Script |
| v3.4 | Saison 2023 + 2022 + Seed-Scripts |
| v3.5 | Statistik-Tab: Hall of Fame, Spieler-Profile, Direktvergleich, Platzkönige |

---

## 👥 Spieler

| Index | Name |
|-------|------|
| 0 | Lutz |
| 1 | Markus |
| 2 | Henrick |
| 3 | Thorsten |

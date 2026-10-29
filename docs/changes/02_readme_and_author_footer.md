# Dokumentacja Zmiany: Dodanie README.md oraz informacji o autorze i licencji MIT

## 1. Cel Zmiany
Stworzenie pełnej dokumentacji projektu w pliku `README.md` oraz umieszczenie informacji o autorze `@kubbot35-alt` i licencji MIT w stopce projektu.

## 2. Wprowadzone Modyfikacje
1. **Utworzenie pliku `README.md`:**
   - Prezentacja założeń psychometrycznych testu IQ (inteligencja płynna $g_f$, matryce Ravena, skala Wechslera WAIS-IV).
   - Precyzyjna matematyczna specyfikacja algorytmu uwzględniającego czas reakcji ($S_i$, parametry $\lambda=0.25$, $\beta=0.50$, $\delta=0.30$) oraz normalizacji Gaussa ($\mu=100, \sigma=15$).
   - Opis architektury Clean Architecture z podziałem na warstwy: `src/core`, `src/graphics`, `src/visualizer` oraz `src/ui`.
   - Wyszczególnienie stosu technologicznego (TypeScript, React 19, Three.js, Canvas 2D, Tailwind CSS, Lucide).
   - Instrukcja instalacji i uruchomienia (`npm install`, `npm run dev`, `npm run build`).
   - Stopka dokumentu z autorem: **@kubbot35-alt** oraz licencją **MIT**.

2. **Aktualizacja stopki UI aplikacji (`src/App.tsx`):**
   - Dodanie w stopce aplikacji widocznej dla użytkownika informacji:
     `IQube Psychometric Engine · Autor: @kubbot35-alt · Licencja MIT`.

## 3. Zgodność z Zasadami Architektury
- Kod w pełni otypowany w TypeScript (zero `any`).
- Architektura domenowa pozostała całkowicie odizolowana od zmian widokowych i tekstowych.

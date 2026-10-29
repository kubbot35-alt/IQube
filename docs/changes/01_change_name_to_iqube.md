# Dokumentacja Zmiany: Zmiana Nazwy Aplikacji na IQube

## 1. Cel Zmiany
Aktualizacja nazwy brandu aplikacji z wcześniejszej nazwy roboczej na nową, docelową nazwę **IQube**, zgodnie ze wskazaniem elementu w UI (nagłówek główny `<h1>`).

## 2. Zakres Zmian
Zmiana została wprowadzona spójnie w całej warstwie prezentacji i eksportu, przy zachowaniu nienaruszalności logiki domenowej:

1. **Warstwa Prezentacji UI (`src/ui/components/StartScreen.tsx`):**
   - Zmiana nagłówka głównego `<h1>` wskazanego przez selektor CSS na `IQube`.

2. **Główny pasek nawigacyjny (`src/ui/components/Header.tsx`):**
   - Aktualizacja logotypu tekstowego (wordmark) w strefie 1 na `IQube`.

3. **Okno Metodologii Psychometrycznej (`src/ui/components/MethodologyModal.tsx`):**
   - Zmiana nagłówka modala na `Metodologia Psychometryczna IQube`.

4. **Eksporter Certyfikatu PNG (`src/visualizer/three/ResultCardExporter.ts`):**
   - Aktualizacja nagłówka certyfikatu graficznego na `IQUBE PSYCHOMETRIC ASSESSMENT`.
   - Aktualizacja stopki autoryzacyjnej na `ZWERYFIKOWANO PRZEZ IQUBE RUNTIME v1.0`.
   - Zmiana domyślnej nazwy pobieranego pliku na `iqube-iq-[testId].png`.

5. **Stopka Aplikacji (`src/App.tsx`):**
   - Zmiana podpisu silnika na `IQube Psychometric Engine`.

6. **Metadane HTML (`index.html`):**
   - Tytuł strony (`<title>`) oraz tagi OpenGraph zaktualizowane do `IQube - Test Psychometryczny IQ`.

## 3. Zgodność z Zasadami Architektury
- Zmiana nie narusza warstwy domenowej ani modeli matematycznych (`src/core/*`).
- Wszystkie komponenty zachowują pojedynczą odpowiedzialność (SRP) oraz rygorystyczne typowanie TypeScript bez użycia typu `any`.

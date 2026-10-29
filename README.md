# IQube — Psychometryczny Test Inteligencji Płynnej (Raven Progressive Matrices)

Zaawansowana, produkcyjna aplikacja testu inteligencji płynnej (g_f) oparta na matrycach progresywnych Ravena oraz skali Wechslera (WAIS-IV). Aplikacja implementuje autorski, matematyczny model estymacji automatyzmu poznawczego, uwzględniający rzeczywisty czas reakcji badanego, oraz trójwymiarową wizualizację wyników w Three.js.

---

## 🚀 Główne Funkcjonalności

1. **20 Zadań Matrycowych (Raven-Style):**
   - 3 poziomy trudności: **Łatwe** (D = 1, T_base = 20s), **Średnie** (D = 2, T_base = 40s) oraz **Trudne** (D = 3, T_base = 70s).
   - Bogata typologia zagadek: rotacje wektorowe (90° i 45°), operacje logiczne XOR/OR, progresje ilościowe, kwadraty łacińskie, symetrie osiowe i inwersje centralne.

2. **Adaptacyjny Model Czasu Reakcji (Cognitive Latency Model):**
   - Różnicuje automatyzm poznawczy od przypadkowego zgadywania.
   - Formuła obliczania punktacji dla pojedynczego zadania:

```text
S_i = 0                                                gdy odpowiedź jest błędna
S_i = D_i × [1 + λ × (T_base,i - t_i) / T_base,i]       gdy poprawna i t_i ≤ T_base,i
S_i = D_i × max[δ, 1 - β × (t_i - T_base,i) / T_base,i] gdy poprawna i t_i > T_base,i
```

   - Parametry kalibracyjne:
     - λ = 0.25 (maksymalna premia do +25% za błyskawiczną poprawną odpowiedź)
     - β = 0.50 (współczynnik stopniowej degradacji punktów za przekroczenie czasu referencyjnego)
     - δ = 0.30 (podłoga punktowa chroniąca przed wyzerowaniem trafnego, lecz powolnego wyniku)

3. **Normalizacja do Rozkładu Gaussa (μ = 100, σ = 15):**
   - Wynik surowy S_total jest mapowany na krzywą dzwonową w standardzie Wechslera:

```text
Z = (S_total - μ_expected) / σ_expected
IQ = 100 + (15 × Z)
Przedział wynikowy: 60 ≤ IQ ≤ 160
```

   - Obliczanie centyla populacyjnego za pomocą numerycznej aproksymacji funkcji błędu Gaussa erf(x):

```text
Centyl = 50 × [1 + erf(Z / √2)]
```

4. **Wektorowy Silnik Graficzny Canvas 2D:**
   - Pełne wsparcie dla ekranów Retina / HiDPI (dynamiczne skalowanie devicePixelRatio).
   - Precyzyjne kształty wektorowe: okręgi, pierścienie, kwadraty, trójkąty, romby, wielokąty, gwiazdy, strzałki, krzyże oraz zróżnicowane style wypełnień (paskowane, pełne, półprzezroczyste, konturowe).

5. **Trójwymiarowa Scena Wyniku Three.js:**
   - Przestrzenna powierzchnia parametryczna krzywej Gaussa z naniesionym słupem świetlnym i markerem IQ użytkownika.
   - Konstelacja 85 cząsteczek sieci neuronowej połączonych synapsami w czasie rzeczywistym.
   - Obsługa Software WebGL Guard (automatyczna detekcja SwiftShader/llvmpipe i ochrona wydajności) oraz pełne zwalnianie pamięci GPU (geometry.dispose(), material.dispose()).

6. **Eksport Certyfikatu PNG w Wysokiej Rozdzielczości:**
   - Natywne generowanie oficjalnego certyfikatu psychometrycznego (1200 × 675 px) z unikalnym kodem weryfikacyjnym ID, mini-wykresem Gaussa i pełnym rozbiciem statystycznym.

7. **Ergonomia i Dostępność:**
   - Błyskawiczna obsługa za pomocą skrótów klawiaturowych: klawisze A, B, C, D lub 1, 2, 3, 4.

---

## 🏛️ Architektura (Clean Architecture & SOLID)

Struktura projektu gwarantuje pełną izolację logiki domenowej od bibliotek renderujących i drzewa DOM:

```
src/
├── core/                       # Domena (Zero zależności od UI / Canvas / Three.js)
│   ├── models/                 # Typy: Question, AnswerOption, UserAnswer, IQScoreResult
│   ├── interfaces/             # Interfejsy: IIQCalculator, IQuizEngine
│   └── services/               # IQCalculatorService, QuizEngine
├── ui/                         # Prezentacja HTML5 / CSS3 / React
│   ├── interfaces/             # IQuizViewProps, QuizViewHandlers
│   └── components/             # Header, StartScreen, QuizView, TimerComponent, ProgressBar, ResultScreen, MethodologyModal
├── graphics/                   # Wektorowy silnik zadań matrycowych (Canvas 2D)
│   ├── models/                 # MatrixPattern, ShapeDescriptor, MatrixCell
│   ├── interfaces/             # IQuestionRenderer
│   ├── renderers/              # CanvasMatrixRenderer
│   └── data/                   # questionBank.ts (20 procedur logicznych)
└── visualizer/                 # Finałowa prezentacja 3D + Eksport
    ├── interfaces/             # IResultVisualizer, IResultExporter
    └── three/                  # ThreeJsResultVisualizer, ResultCardExporter
```

---

## 🛠️ Technologie

- **Język:** TypeScript (Strict Typing, zero typów any)
- **Framework UI:** React 19 + Vite
- **Grafika 3D:** Three.js (PBR, ACESFilmicToneMapping, SRGBColorSpace)
- **Grafika 2D:** HTML5 Canvas API (HiDPI / Retina)
- **Stylizacja:** Tailwind CSS
- **Ikony:** Lucide React

---

## 📦 Uruchomienie Projektu

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Zbudowanie wersji produkcyjnej
npm run build
```

---

## 👤 Autor

Projekt stworzony i rozwijany przez: **[@kubbot35-alt](https://github.com/kubbot35-alt)**

---

## 📄 Licencja

Projekt udostępniany na zasadach licencji [MIT](https://opensource.org/licenses/MIT).
Copyright (c) 2026 @kubbot35-alt.

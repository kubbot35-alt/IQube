# IQube — Psychometryczny Test Inteligencji Płynnej (Raven Progressive Matrices)

Zaawansowana, produkcyjna aplikacja testu inteligencji płynnej ($g_f$) oparta na matrycach progresywnych Ravena oraz skali Wechslera (WAIS-IV). Aplikacja implementuje autorski, matematyczny model estymacji automatyzmu poznawczego, uwzględniający rzeczywisty czas reakcji badanego, oraz trójwymiarową wizualizację wyników w Three.js.

---

## 🚀 Główne Funkcjonalności

1. **20 Zadań Matrycowych (Raven-Style):**
   - 3 poziomy trudności: **Łatwe** ($D=1, T_{\text{base}}=20\text{s}$), **Średnie** ($D=2, T_{\text{base}}=40\text{s}$) oraz **Trudne** ($D=3, T_{\text{base}}=70\text{s}$).
   - Bogata typologia zagadek: rotacje wektorowe (90° i 45°), operacje logiczne XOR/OR, progresje ilościowe, kwadraty łacińskie, symetrie osiowe i inwersje centralne.

2. **Adaptacyjny Model Czasu Reakcji (Cognitive Latency Model):**
   - Różnicuje automatyzm poznawczy od przypadkowego zgadywania.
   - Formuła punktacji:
     $$S_i = \begin{cases} 
     0 & \text{dla odpowiedzi błędnej} \\ 
     D_i \cdot \left(1 + \lambda \cdot \frac{T_{\text{base}, i} - t_i}{T_{\text{base}, i}}\right) & \text{dla poprawnej, gdy } t_i \le T_{\text{base}, i} \\
     D_i \cdot \max\left(\delta, 1 - \beta \cdot \frac{t_i - T_{\text{base}, i}}{T_{\text{base}, i}}\right) & \text{dla poprawnej, gdy } t_i > T_{\text{base}, i}
     \end{cases}$$
   - Parametry kalibracyjne: $\lambda = 0.25$ (premia do $+25\%$ za szybkość), $\beta = 0.50$ (stopniowa degradacja za przekroczenie czasu), $\delta = 0.30$ (podłoga punktowa chroniąca przed wyzerowaniem trafnego wyniku).

3. **Normalizacja do Rozkładu Gaussa (μ = 100, σ = 15):**
   - Wynik surowy $S_{\text{total}}$ jest mapowany na krzywą dzwonową Wechslera w przedziale $60 \le \text{IQ} \le 160$.
   - Precyzyjne wyliczanie centyla populacyjnego za pomocą numerycznej aproksymacji funkcji błędu Gaussa ($\text{erf}$).

4. **Wektorowy Silnik Graficzny Canvas 2D:**
   - Pełne wsparcie dla ekranów Retina / HiDPI (dynamiczne skalowanie `devicePixelRatio`).
   - Czyste geometryczne kształty wektorowe: okręgi, pierścienie, wielokąty, gwiazdy, strzałki, zróżnicowane style wypełnień (paskowane, pełne, półprzezroczyste, konturowe).

5. **Trójwymiarowa Scena Wyniku Three.js:**
   - Przestrzenna, dynamiczna powierzchnia krzywej Gaussa z naniesionym słupem świetlnym i markerem IQ użytkownika.
   - Konstelacja 85 cząsteczek sieci neuronowej połączonych synapsami w czasie rzeczywistym.
   - Pełna obsługa Software WebGL Guard (bezpieczne tempo klatek bez obciążania GPU) oraz zwalnianie pamięci GPU (`geometry.dispose()`, `material.dispose()`).

6. **Eksport Certyfikatu PNG w Wysokiej Rozdzielczości:**
   - Natywne generowanie oficjalnego certyfikatu psychometrycznego (1200x675 px) z kodem weryfikacyjnym, wykresami i pełnym rozbiciem analitycznym.

7. **Ergonomia i Dostępność:**
   - Obsługa skrótów klawiaturowych: klawisze `A`, `B`, `C`, `D` lub `1`, `2`, `3`, `4`.

---

## 🏛️ Architektura (Clean Architecture & SOLID)

Struktura projektu gwarantuje 100% separację logiki biznesowej od bibliotek renderujących i DOM:

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

- **Język:** TypeScript (Strict Typing, zero `any`)
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

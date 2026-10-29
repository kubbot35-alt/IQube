# Specyfikacja i Plan Implementacji: Aplikacja Testu IQ (TypeScript / Three.js / Canvas)

Dokument zawiera wytyczne architektoniczne, model psychometryczny (w tym matematyczny algorytm oceny uwzględniający czas reakcji) oraz gotowy zestaw promptów podzielonych na 4 bezpieczne dla limitu tokenów iteracje w AI Studio (free tier).

---

## 1. Założenia Psychometryczne i Liczba Pytań

### 1.1. Optymalna liczba pytań
* **Rekomendacja:** **20 do 24 zadań**.
* **Uzasadnienie:**
  * W standardowych testach psychometrycznych (np. *Raven Progressive Matrices*, *WAIS*) 20–24 pytania matrycowe są wystarczające do rzetelnej oceny inteligencji płynnej (rzetelność $\alpha$ Cronbacha na poziomie $> 0.85$).
  * Utrzymuje czas sesji w granicach 12–18 minut, eliminując błąd poznawczy wynikający ze znużenia użytkownika i spadku uwagi.

### 1.2. Mechanika oceny z uwzględnieniem czasu reakcji
Tradycyjne podejście mierzy jedynie binarną poprawność ($0$ lub $1$). Wprowadzenie zmiennej czasu ($t$) pozwala rozróżnić automatyzm poznawczy od losowego zgadywania.

Każde pytanie $i$ posiada:
* Trudność bazową: $D_i \in \{1, 2, 3\}$ (Łatwe, Średnie, Trudne).
* Czas oczekiwany (referencyjny): $T_{\text{base}, i}$ (np. 20s dla $D=1$, 40s dla $D=2$, 70s dla $D=3$).
* Rzeczywisty czas odpowiedzi użytkownika: $t_i$.

#### Algorytm punktacji pytania:
$$S_i = \begin{cases} 
0 & \text{jeśli odpowiedź jest błędna} \\ 
D_i \cdot \left(1 + \lambda \cdot \frac{T_{\text{base}, i} - t_i}{T_{\text{base}, i}}\right) & \text{jeśli poprawna i } t_i \le T_{\text{base}, i} \\
D_i \cdot \max\left(\delta, 1 - \beta \cdot \frac{t_i - T_{\text{base}, i}}{T_{\text{base}, i}}\right) & \text{jeśli poprawna i } t_i > T_{\text{base}, i}
\end{cases}$$

*Gdzie domyślne parametry:*
* $\lambda = 0.25$ (maksymalny bonus $+25\%$ za błyskawiczną poprawną odpowiedź),
* $\beta = 0.50$ (stopniowa degradacja punktów za przekroczenie czasu),
* $\delta = 0.30$ (podłoga punktowa za poprawną, lecz wolną odpowiedź — chroni przed zerowaniem trafnego wyniku).

#### Normalizacja do skali IQ (Rozkład Gaussa):
Uzyskany wynik surowy $S_{\text{total}} = \sum S_i$ jest mapowany na rozkład normalny o parametrach $\mu = 100$ i $\sigma = 15$:
$$\text{IQ} = 100 + 15 \cdot \left(\frac{S_{\text{total}} - \mu_{\text{expected}}}{\sigma_{\text{expected}}}\right)$$
Przedział wynikowy w UI: $60 \le \text{IQ} \le 160$.

---

## 2. Architektura Systemu (Clean Architecture / SOLID)

Struktura projektu gwarantuje pełną izolację logiki od bibliotek graficznych (Three.js, Canvas 2D) oraz DOM:

```
src/
├── core/                       # Domena (Zero zależności od UI / Canvas / Three.js)
│   ├── models/                 # Typy: Question, Option, Answer, IQResult
│   ├── interfaces/             # Interfejsy: IIQCalculator, IQuizEngine
│   └── services/               # QuizEngine, IQCalculatorService
├── ui/                         # Prezentacja HTML5 / CSS3
│   ├── interfaces/             # IQuizView
│   └── components/             # QuizView, TimerComponent, ProgressBar
├── graphics/                   # Silnik zadań matrycowych (Canvas 2D)
│   ├── interfaces/             # IQuestionRenderer
│   └── renderers/              # CanvasMatrixRenderer
└── visualizer/                 # Finałowa prezentacja 3D + Eksport
    ├── interfaces/             # IResultVisualizer, IResultExporter
    └── three/                  # ThreeJsResultVisualizer, ResultCardExporter
```

---

## 3. Sekwencja Wdrożenia w AI Studio (4 Prompty)

Dzięki podziałowi na iteracje eliminujemy przekroczenie limitu tokenów oraz zjawisko „God Class”.

### Krok 1: Rdzeń Domenowy i Kalkulator Psychometryczny
```text
Działasz jako elitarny architekt oprogramowania TypeScript zgodnie z poniższymi zasadami:
1. Absolutny zakaz mieszania logiki z widokiem (Headless Architecture).
2. SRP oraz limit do 200-250 linii kodu wykonawczego na moduł.
3. Interface-Driven Development i Dependency Injection.
4. Rygorystyczne typowanie (zero 'any').
5. Obowiązkowy protokół odpowiedzi: [SOLID CHECK], [INTERFACE SUMMARY], [SOURCE CODE], [REFACTORING ALERT].

Zaprojektuj rdzeń domenowy dla aplikacji testu IQ (20 pytań matrycowych, wybór A, B, C, D).
Wymagania dla KROKU 1:
1. Zdefiniuj wszystkie niezbędne typy i interfejsy: Question, AnswerOption, UserAnswer, DifficultyLevel, IQScoreResult, IIQCalculator, IQuizEngine.
2. Zaimplementuj czystą klasę IQCalculatorService implementującą IIQCalculator:
   - Obliczanie wyniku bazuje na poprawności, wadze trudności oraz czasie odpowiedzi (bonus za czas poniżej bazowego t_base, redukcja za przekroczenie).
   - Normalizacja wyniku do skali IQ (średnia 100, odchylenie standardowe 15, zakres 60-160).
3. Zaimplementuj silnik QuizEngine implementujący IQuizEngine zarządzający stanem testu (start, submitAnswer, nextQuestion, finish).
Pamiętaj: Klasy te nie mogą importować DOM, HTML, Canvas ani Three.js.
```

---

### Krok 2: Warstwa UI i Formularz (HTML5 + CSS 3.0)
```text
Kontynuujemy projekt testu IQ w TypeScript zgodnie z zasadami czystej architektury i protokołem odpowiedzi:
[SOLID CHECK], [INTERFACE SUMMARY], [SOURCE CODE], [REFACTORING ALERT].

Mając zdefiniowany silnik IQuizEngine z Kroku 1, stwórz warstwę prezentacji UI formularza:
1. Zdefiniuj interfejs IQuizView.
2. Zaimplementuj klasę QuizView (HTML5 + CSS 3.0):
   - Dynamiczne renderowanie aktualnego pytania i opcji A, B, C, D w responsywnym kontenerze.
   - Płynny pasek postępu (CSS) oraz dynamiczny timer odliczający czas dla danego zadania.
   - Obsługa zdarzeń wyboru opcji bez bezpośredniej modyfikacji logiki biznesowej (komunikacja przez callbacki/eventy wstrzyknięte do widoku).
3. Dołącz kompletne style CSS 3.0 (nowoczesny, minimalistyczny dark theme, Flexbox/Grid, animacje przejścia między pytaniami).
```

---

### Krok 3: Proceduralne Zadania Matrycowe (Canvas 2D)
```text
Kontynuujemy projekt testu IQ w TypeScript zgodnie z zasadami czystej architektury i protokołem odpowiedzi:
[SOLID CHECK], [INTERFACE SUMMARY], [SOURCE CODE], [REFACTORING ALERT].

Zbuduj moduł renderowania zadań graficznych (zagadek logicznych/matrycowych typu Raven) na Canvas 2D:
1. Zdefiniuj interfejs IQuestionRenderer oraz typ MatrixPattern (siatka 3x3 z brakującym 9. polem oraz 4 warianty odpowiedzi A, B, C, D).
2. Zaimplementuj CanvasMatrixRenderer, który:
   - Czysto rysuje geometryczne kształty wektorowe na Canvas HTML5 (linie, rotacje, wypełnienia, relacje przestrzenne).
   - Izoluje operacje czyszczenia i skalowania (HiDPI / Retina display support).
3. Przygotuj strukturę danych dla 3 przykładowych pytań matrycowych o zróżnicowanej trudności (np. rotacja figur, progresja liczby elementów, operacje logiczne XOR/AND na kształtach).
```

---

### Krok 4: Scena Wyniku Three.js i Eksport Certyfikatu
```text
Kontynuujemy projekt testu IQ w TypeScript zgodnie z zasadami czystej architektury i protokołem odpowiedzi:
[SOLID CHECK], [INTERFACE SUMMARY], [SOURCE CODE], [REFACTORING ALERT].

Zrealizuj finałową prezentację wyników testu:
1. Zdefiniuj interfejs IResultVisualizer.
2. Zaimplementuj ThreeJsResultVisualizer wykorzystujący Three.js:
   - Trójwymiarowa, interaktywna reprezentacja wyniku IQ (sieć neuronowa z cząsteczek/particles lub przestrzenny model krzywej Gaussa z zaznaczonym wynikiem gracza).
   - Prawidłowa obsługa resize okna, pętli renderowania (requestAnimationFrame) oraz czyszczenia pamięci GPU (dispose geometrii i materiałów).
3. Zaimplementuj ResultCardExporter generujący estetyczną, płaską grafikę (PNG z poziomu Canvas) z finalnym wynikiem IQ, percentylem oraz czasem do pobrania przez użytkownika.
```
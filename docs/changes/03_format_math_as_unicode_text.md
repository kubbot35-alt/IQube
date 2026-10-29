# Dokumentacja Zmiany: Formatowanie Matematyki i Wzorów jako Czysty Tekst i Unicode

## 1. Cel Zmiany
Całkowite wyeliminowanie składni LaTeX ze wszystkich plików dokumentacyjnych i prezentacyjnych projektu, zastępując ją standardowym tekstem Markdown, symbolami Unicode (², ³, √, ±, ×, ÷, μ, σ, α, λ, β, δ, ≤, ≥) oraz wieloliniowymi blokami kodu tekstowego typu `text`.

## 2. Wprowadzone Modyfikacje
1. **Plik `README.md`:**
   - Zastąpienie symboli LaTeX `($g_f$)` zapisem `(g_f)`.
   - Zastąpienie poziomów trudności `($D=1, T_{\text{base}}=20\text{s}$)` czytelnym formatem `(D = 1, T_base = 20s)`.
   - Zastąpienie wzoru matematycznego LaTeX wieloliniowym, czytelnym blokiem kodu tekstowego:
     ```text
     S_i = 0                                                gdy odpowiedź jest błędna
     S_i = D_i × [1 + λ × (T_base,i - t_i) / T_base,i]       gdy poprawna i t_i ≤ T_base,i
     S_i = D_i × max[δ, 1 - β × (t_i - T_base,i) / T_base,i] gdy poprawna i t_i > T_base,i
     ```
   - Zastąpienie równań normalizacji Gaussa blokami tekstowymi z symbolami Unicode (Z, μ, σ, √2, Centyl).

2. **Komponent UI `src/ui/components/MethodologyModal.tsx`:**
   - Zamiana `($g_f$)` na `(g_f)`.

## 3. Zgodność z Zasadami Architektury
- Kod i dokumentacja są w 100% czytelne na dowolnym czytniku tekstu bez konieczności parsowania bibliotekami KaTeX/MathJax.

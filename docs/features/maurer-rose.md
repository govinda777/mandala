# 🌹 Rosa de Maurer (Maurer Rose Overlay)

A **Rosa de Maurer** é um conceito da geometria polar introduzido pelo matemático Peter M. Maurer em 1987. Ela consiste na união de 361 linhas de segmento conectando pontos consecutivos sobre uma Rosa Polar de equação $r = R \sin(n \theta)$, onde a amostragem angular salta em passos discretos de $d$ graus ($\theta = k \cdot d^\circ$ para $k = 0, 1, 2, \dots, 360$).

---

## 📊 Análise

- **Objetivo**: Renderizar uma sobreposição geométrica elegante baseada na Rosa de Maurer sobre a mandala base.
- **Impacto Visual**: Linhas retas entrelaçadas formando padrões geométricos complexos de teia/grade polar com efeito brilhante (glow).
- **Complexidade**: Média.
- **Dependências**: Funções puras de coordenadas polares para cartesianas em `src/lib/mandala-math.ts`.

---

## 🧮 Fundamento Matemático

Dado o número de pétalas $n$ e o ângulo de salto $d$ (em graus):

1. Para cada $k \in [0, 360]$:
   $$\theta_k = (k \cdot d) \cdot \frac{\pi}{180}$$
2. O raio polar $r_k$ é determinado por:
   $$r_k = R \cdot \sin(n \cdot \theta_k)$$
3. As coordenadas cartesianas $(x_k, y_k)$ relativas ao centro são:
   $$x_k = r_k \cdot \cos(\theta_k)$$
   $$y_k = r_k \cdot \sin(\theta_k)$$
4. Os 361 pontos são conectados sequencialmente por linhas de segmento no Canvas.

---

## ✅ Critérios de Aceitação (BDD)

- [x] Testes unitários criados em `src/test/maurer-rose.test.ts` e passando.
- [x] Função pura `calculateMaurerRosePoints(n, d, radius)` implementada em `mandala-math.ts`.
- [x] Função de renderização Canvas `drawMaurerRoseOverlay` implementada em `mandala-renderer.ts`.
- [x] Controles UI (toggle checkbox, slider de $n$ e slider de $d$) integrados no painel "Geometria & Fractais".
- [x] Atualização da pontuação de raridade, metadados NFT e estado de compartilhamento por URL.
- [x] Testes passando no ambiente Vitest.

---

## 🧪 Testes Implementados

1. Retorna exatamente 361 pontos para $k \in [0, 360]$.
2. Ponto inicial $k=0$ possui $r=0$ e resulta em $(0,0)$.
3. Todos os pontos permanecem dentro da distância limitada pelo raio $R$.

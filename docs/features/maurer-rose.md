## 🚧 Tarefa: Rosa de Maurer (Maurer Rose)

### 📊 Análise
- **Objetivo**: Adicionar sobreposição de treliça polar baseada no algoritmo da Rosa de Maurer (Maurer Rose).
- **Impacto Visual**: Linhas intrincadas conectando pontos de uma rosa polar em incrementos de ângulo salto $d^\circ$, criando teias e polígonos estelares sagrados sobrepostos à mandala.
- **Complexidade**: Média. Requer cálculo de pontos polares $r = R \cdot \sin(n \theta)$ para $\theta_k = k \cdot d$ ($k = 0 \dots 360$).
- **Dependências**: Matemática nativa do JS (`Math.sin`, `Math.cos`).

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: A Rosa de Maurer é definida ligando 360 pontos consecutivos calculados pela equação polar de uma rosa:
  $$\theta_k = k \cdot d \quad (k = 0, 1, 2, \dots, 360)$$
  $$r_k = R \cdot \sin(n \cdot \theta_k)$$
  $$x_k = r_k \cdot \cos(\theta_k)$$
  $$y_k = r_k \cdot \sin(\theta_k)$$
  Onde:
  - $n$: número de pétalas/fator de frequência.
  - $d$: ângulo de salto em graus.
  - $R$: raio máximo.
- **Referência**: Peter M. Maurer (1987), "A Rose for Peter".

### ✅ Critérios de Aceitação (BDD)
- [ ] Documentação criada em `docs/features/maurer-rose.md`.
- [ ] Testes unitários para `calculateMaurerRosePoints` em `src/test/maurer-rose.test.ts`.
- [ ] Função matemática implementada em `src/lib/mandala-math.ts`.
- [ ] Suporte a raridade, exportação de NFT e link de compartilhamento na URL.
- [ ] Renderização Canvas implementada em `src/lib/mandala-renderer.ts`.
- [ ] Controles de UI adicionados em `src/components/MandalaGenerator.tsx` (toggle, slider $n$, slider $d$).
- [ ] Testes passando e validação de compilação TypeScript sem erros.

### 🧪 Testes a Implementar
1. Testar geração de exatamente 361 pontos para parâmetros válidos ($n$, $d$, $R$).
2. Testar casos limite (raio zero ou negativo retorna lista vazia).
3. Testar valores específicos de coordenadas para $k=0$ (origem $(0,0)$).

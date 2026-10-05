## 🚧 Tarefa: Rosa de Maurer (Maurer Rose Lattice)

### 📊 Análise
- **Objetivo**: Adicionar sobreposição de treliça curva da Rosa de Maurer (Maurer Rose), criada ao interconectar pontos calculados a partir da equação polar da rosa $r = R \sin(n \cdot \theta)$ com um salto angular em graus $d$.
- **Impacto Visual**: Uma intrincada rede geométrica/treliça com fios matemáticos entrelaçados sobre a mandala, gerando padrões estéticos de alta complexidade.
- **Complexidade**: Média. O cálculo conecta 361 pontos gerados a partir de passos angulares discretos $k \cdot d$ graus.
- **Dependências**: Funções trigonométricas nativas do JavaScript (`Math.sin`, `Math.cos`).

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  Para $k \in [0, 360]$:
  $$\theta_k = (k \cdot d) \times \frac{\pi}{180}$$
  $$r_k = R \cdot \sin(n \cdot \theta_k)$$
  $$x_k = r_k \cdot \cos(\theta_k)$$
  $$y_k = r_k \cdot \sin(\theta_k)$$
  Onde:
  - $n$: parâmetro de frequência/número de pétalas da rosa polar.
  - $d$: ângulo de salto em graus (p. ex. 29°, 71°, 137°).
  - $R$: raio máximo da rosa.
- **Referência**: Peter M. Maurer (1987), "A Rose by Any Other Name", *The American Mathematical Monthly*.

### ✅ Critérios de Aceitação (BDD)
- [x] Documentação criada em `docs/features/maurer-rose.md`.
- [ ] Testes unitários para `calculateMaurerRosePoints` em `src/test/maurer-rose.test.ts`.
- [ ] Função matemática implementada em `src/lib/mandala-math.ts`.
- [ ] Desenho no canvas implementado em `src/lib/mandala-renderer.ts`.
- [ ] Controles na UI do React para ativar e ajustar $n$ e $d$ em `src/components/MandalaGenerator.tsx`.
- [ ] Suporte a compartilhamento por URL, raridade e exportação de metadados NFT.

### 🧪 Testes a Implementar
1. Teste de `calculateMaurerRosePoints`: deve retornar exatamente 361 pontos ($k = 0$ a $360$).
2. Teste com $n = 2, d = 29$: deve calcular coordenadas coerentes dentro do raio limite $[-R, R]$.
3. Teste de raio $0$ ou negativo: deve retornar array de pontos zerados de forma segura.

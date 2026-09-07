## 🚧 Tarefa: Rosa de Maurer (Maurer Rose)

### 📊 Análise
- **Objetivo**: Renderizar uma rede geométrica intrincada baseada na Rosa de Maurer, conectando pontos de uma curva polar $r = \sin(n \cdot \theta)$ com saltos angulares discretos $d$ em graus.
- **Impacto Visual**: Padrões de teia e treliças geométricas simétricas sobrepostas à mandala, criando formas fascinantes e complexas.
- **Complexidade**: Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  Para $k \in [0, 360]$:
  $$\theta_k = k \cdot d \cdot \frac{\pi}{180}$$
  $$r_k = R \cdot \sin(n \cdot \theta_k)$$
  $$x_k = r_k \cdot \cos(\theta_k)$$
  $$y_k = r_k \cdot \sin(\theta_k)$$
- **Referência**: Introduzido por Peter M. Maurer em 1987 ("A Rose is a Rose", The American Mathematical Monthly).
- **Exemplo**: Para $n=6$ e $d=71^\circ$, a sequência gera 361 vértices interconectados que formam uma estrela/teia perfeita de 6 pétalas.

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando
- [ ] Função matemática `calculateMaurerRosePoints` implementada em `mandala-math.ts`
- [ ] Renderização implementada em `mandala-renderer.ts`
- [ ] Controle de UI adicionado no `MandalaGenerator.tsx` (Toggle + sliders $n$ e $d$)
- [ ] Documentação e BACKLOG atualizados
- [ ] Mudança visível no gerador de mandalas

### 🧪 Testes Implementados
1. Teste de geração dos 361 pontos da Rosa de Maurer.
2. Teste de limites de raio e valores de coordenadas.
3. Teste de caso limite (raio nulo ou $n=0$).

### 🎨 Implementação
A função matemática pura `calculateMaurerRosePoints(n, d, radius)` calcula 361 pontos no plano cartesiano. O renderizador Canvas desenha um caminho contínuo interconectando estes 361 pontos com traços finos e elegantes sobre a mandala.

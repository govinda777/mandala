## 🚧 Tarefa: Rosa de Maurer (Maurer Rose Overlay)

### 📊 Análise
- **Objetivo**: Renderizar uma curva polar Rosa de Maurer como sobreposição geométrica treliçada na mandala.
- **Impacto Visual**: Cria uma teia geométrica fascinante de linhas conectadas entre os pontos da rosa polar $r = R \sin(n \theta)$, permitindo visuais complexos de geometria sagrada.
- **Complexidade**: Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: A Rosa de Maurer é definida ligando 361 pontos dados pelas equações em coordenadas polares:
  - $k = i \cdot d$ (onde $i = 0, 1, 2, \dots, 360$)
  - $r = R \cdot \sin(n \cdot k)$
  - $x = r \cdot \cos(k)$
  - $y = r \cdot \sin(k)$
  - O parâmetro $n$ determina o número de pétalas e $d$ (em graus) determina o ângulo de rotação entre pontos consecutivos ligados por segmentos de reta.
- **Referência**: Peter M. Maurer (1987), "A Rose by Any Other Name".
- **Exemplo**: Entrada ($n=6, d=29$, raio=100) -> Saída: Array de 361 coordenadas $(x, y)$ formando um polígono estelar de 361 linhas.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando
- [x] Função matemática `calculateMaurerRosePoints` implementada em `mandala-math.ts`
- [x] Renderização `drawMaurerRoseOverlay` implementada em `mandala-renderer.ts`
- [x] Controle de UI (checkbox "Rosa de Maurer", sliders $n$ e $d$) adicionado no `MandalaGenerator.tsx`
- [x] Documentação e BACKLOG atualizados
- [x] Suporte a raridade e exportação de metadados NFT

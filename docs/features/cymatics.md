## 🚧 Tarefa: Cimática - Padrões de Chladni

### 📊 Análise
- **Objetivo**: Implementar a visualização de padrões de Cimática (Chladni figures) como uma sobreposição na mandala.
- **Impacto Visual**: Alto. Desenha padrões complexos de pontos, similares a areia se acomodando nas linhas nodais de uma placa vibratória.
- **Complexidade**: Alta (Matemática complexa de ondas estacionárias em 2D).
- **Dependências**: Matemática de ondas trigonométricas (`Math.cos`, `Math.PI`) e renderização massiva de pontos no Canvas.

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: A equação que descreve as figuras de Chladni em uma placa quadrada plana é `u(x, y) = cos(nπx)cos(mπy) - cos(mπx)cos(nπy) = 0`, onde x e y são coordenadas normalizadas de -1 a 1, e n, m são as frequências (modos de vibração).
- **Referência**: Ernst Chladni e sua técnica para visualizar vibrações acústicas. Esses padrões ocorrem onde a amplitude da onda é zero (nodos).
- **Exemplo**: Para n=3, m=5, forma-se um padrão geométrico altamente simétrico e entrelaçado.

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando (`src/test/cymatics.test.ts`)
- [ ] Função matemática implementada em `mandala-math.ts` (`calculateChladniNodes`)
- [ ] Renderização implementada em `mandala-renderer.ts` (`drawChladniPattern`)
- [ ] Controles de UI adicionados no componente React (Checkbox "Cimática", Sliders "Frequência N" e "Frequência M")
- [ ] Documentação atualizada (BACKLOG e este documento)
- [ ] Pipeline de deploy bem-sucedida
- [ ] Mudança visível e performática

### 🧪 Testes Implementados
1. Teste de cálculo de nós para a equação de Chladni (verificar se `u(x,y)` está próximo de zero para os pontos gerados).
2. Validação da renderização através de BDD implícito (Snapshot com Playwright).

### 🎨 Implementação
- **Math**: `calculateChladniNodes` irá percorrer um grid 2D, avaliando a função de Chladni. Se o valor for próximo de zero (dentro de uma tolerância), o ponto será retornado.
- **Renderer**: `drawChladniPattern` desenhará cada nó como um pequeno ponto (`ctx.fillRect`), simulando grãos de areia.
- **State**: Flags e valores `cymaticsMode`, `cymaticsN`, e `cymaticsM` atrelados à interface.

### 📸 Resultado
Pendente de screenshot após a implementação.
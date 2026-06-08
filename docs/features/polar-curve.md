## 🚧 Tarefa: Curva Polar das Pétalas (Smooth/Sharp)

### 📊 Análise
- **Objetivo**: Substituir a geração cartesiana legada (Bezier) por silhuetas baseadas na equação da Rosa Polar.
- **Impacto Visual**: Pétalas perfeitamente simétricas com opções suaves e afiadas, com silhuetas mais precisas.
- **Complexidade**: Baixa-Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: Rosa Polar $r(\theta) = R + A \cdot \sin(k \cdot \theta)$. Para a curva "suave", usamos o seno normal normalizado por pétala. Para a curva "afiada", usamos potências do seno ($\sin^4$) para espremer o cume da onda.
- **Referência**: Curvas Polares e Rosa de Maurer.
- **Exemplo**: Entrada (raio=100, k=12, curveType='smooth') -> Saída: Array de pontos x,y distribuídos ao longo da curva com base em um seno.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando
- [x] Função matemática implementada em `mandala-math.ts`
- [x] Renderização implementada em `mandala-renderer.ts`
- [x] Controle de UI adicionado no `MandalaGenerator.tsx`
- [x] Documentação atualizada
- [x] Mudança visível no site (via captura de tela)

### 🧪 Testes Implementados
1. Teste da lógica matemática validando número de pontos.
2. Teste garantindo o crescimento do raio (maxDist > baseRadius).

### 🎨 Implementação
A nova função `calculatePolarPetalPoints` no `mandala-math.ts` gera pontos contínuos. A renderização é alterada de `bezierCurveTo` iterativo para um conjunto contínuo de `lineTo` que desenha as coordenadas (x,y) polares geradas, e em seguida espelha as pétalas ao longo do eixo Y iterando em reverso sobre as posições Y invertidas.

### 📸 Resultado
Duas capturas visuais confirmam a presença do controle de UI "Formato da Pétala" e as diferenças geométricas de "Suave" para "Afiado".

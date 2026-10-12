## 🚧 Tarefa: Cubo de Metatron (Metatron's Cube Overlay)

### 📊 Análise
- **Objetivo**: Implementar o sobreposição do Cubo de Metatron (uma das figuras fundamentais da Geometria Sagrada) derivada do Fruto da Vida (13 círculos interconectados por 78 linhas).
- **Impacto Visual**: Alto. Desenha uma matriz geométrica dourada/brilhante sobre a mandala, revelando a projeção 2D de todos os 5 Sólidos Platônicos.
- **Complexidade**: Média (Geometria polar e conectividade combinatória $13 \times 12 / 2 = 78$ segmentos de reta).
- **Dependências**: Matemática pura (funções trigonométricas) para posições dos 13 centros e geração dos 78 segmentos de linha, e Canvas API para renderização das linhas e círculos.

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  1. Os 13 centros do Fruto da Vida são distribuídos com simetria hexagonal:
     - 1 centro na origem $(0, 0)$.
     - 6 centros no anel interno no raio $R$, em ângulos $\theta_k = k \cdot \frac{\pi}{3}$ ($k = 0..5$).
     - 6 centros no anel externo no raio $2R$, em ângulos $\theta_k = k \cdot \frac{\pi}{3}$ ($k = 0..5$).
  2. Conectividade: Conecta cada um dos 13 centros a todos os outros 12 centros, produzindo $\binom{13}{2} = \frac{13 \times 12}{2} = 78$ segmentos de reta.
- **Referência**: Geometria Sagrada / Cubo de Metatron. Na tradição da geometria sagrada, o Cubo de Metatron contém os 5 Sólidos Platônicos (Tetraedro, Cubo, Octaedro, Dodecaedro e Icosaedro).
- **Exemplo**: Entrada de raio base $R \implies 13$ pontos ordenados e 78 pares de pontos conectados.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando (`src/test/metatron-cube.test.ts`)
- [x] Funções matemáticas implementadas em `mandala-math.ts` (`calculateMetatronCenters` e `calculateMetatronLines`)
- [x] Renderização implementada em `mandala-renderer.ts` (`drawMetatronCubeOverlay`)
- [x] Controle de UI adicionado no componente React (Checkbox "Cubo de Metatron")
- [x] Documentação atualizada (BACKLOG e este documento)
- [x] Pipeline de deploy bem-sucedida
- [x] Mudança visível no site hospedado

### 🧪 Testes a Implementar
1. Teste de cálculo dos 13 centros do Fruto da Vida.
2. Teste de geração das 78 linhas de conexão do Cubo de Metatron.
3. Teste da ordenação e simetria dos pontos em relação à origem $(0,0)$.
4. Teste de integração do atributo de raridade e serialização do estado no `mandala-math.ts`.

### 🎨 Implementação
- **Math**: `calculateMetatronCenters` e `calculateMetatronLines` em `src/lib/mandala-math.ts`.
- **Renderer**: `drawMetatronCubeOverlay` em `src/lib/mandala-renderer.ts` desenhando os 13 círculos e 78 segmentos de linha com efeito de brilho em Canvas.
- **State & UI**: `metatronCube` adicionado ao `SharedMandalaConfig` e ao painel de controle React na seção "📐 Geometria & Fractais".

### 📸 Resultado
Matriz geométrica composta por 13 esferas e 78 linhas douradas de luz sobreposta no centro da mandala.

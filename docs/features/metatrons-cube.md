## 🚧 Tarefa: Geometria Sagrada - Cubo de Metatron (Metatron's Cube)

### 📊 Análise
- **Objetivo**: Implementar o Cubo de Metatron como uma sobreposição opcional de geometria sagrada na mandala.
- **Impacto Visual**: Alto. Desenha uma figura geométrica clássica composta por 13 círculos (Fruto da Vida) e 78 linhas retas que conectam o centro de cada círculo a todos os outros centros, projetando no plano 2D as estruturas fundamentais dos 5 Sólidos Platônicos.
- **Complexidade**: Média (cálculo de coordenadas polares de anéis concêntricos hexagonais e combinação de todos os pares únicos de vértices).
- **Dependências**: Funções trigonométricas puras do TypeScript e Canvas 2D API (`arc`, `moveTo`, `lineTo`, `stroke`).

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  - **13 Centros do Fruto da Vida**:
    - 1 centro na origem: $(0, 0)$.
    - 6 círculos internos no raio $R_1 = 2 \cdot r$, com ângulos $\theta_i = i \cdot \frac{\pi}{3}$ para $i \in \{0, 1, 2, 3, 4, 5\}$.
    - 6 círculos externos no raio $R_2 = 4 \cdot r$, com os mesmos ângulos $\theta_i$.
  - **78 Linhas de Conexão**:
    - O número total de linhas conectando todos os pares de vértices é o coeficiente binomial $\binom{13}{2} = \frac{13 \times 12}{2} = 78$ segmentos de reta.
- **Referência**: Geometria Sagrada, Fruto da Vida e Cubo de Metatron. Na tradição mística e matemática pitagórica, o Cubo de Metatron contém os padrões de projeção dos 5 Sólidos Platônicos (tetraedro, cubo/hexaedro, octaedro, dodecaedro e icosaedro).
- **Exemplo**: Para um raio de círculo base $r$, os 13 pontos são distribuídos com simetria hexagonal perfeita em torno do centro, gerando 78 conexões lineares simétricas.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando (`src/test/metatrons-cube.test.ts`)
- [x] Função matemática implementada em `mandala-math.ts` (`calculateMetatronCenters` e `calculateMetatronLines`)
- [x] Renderização implementada em `mandala-renderer.ts` (`drawMetatronCubeOverlay`)
- [x] Controle de UI adicionado no componente React (Checkbox "Cubo de Metatron" no accordion de geometria)
- [x] Suporte a metadados de NFT e serialização de URL com estado persistente
- [x] Documentação atualizada (README e BACKLOG)
- [x] Mudança visível e verificável na interface

### 🧪 Testes Implementados
1. Cálculo correto de exatamente 13 centros com distribuição radial proporcional.
2. Cálculo de exatamente 78 linhas entre todos os pares distintos de centros sem repetições.
3. Tratamento de raio zero ou negativo.
4. Integração correta com o cálculo de raridade de NFT e decodificação/codificação de URL.

### 🎨 Implementação
- **Math**: Funções puras `calculateMetatronCenters` e `calculateMetatronLines` em `src/lib/mandala-math.ts`.
- **Renderer**: Função `drawMetatronCubeOverlay` em `src/lib/mandala-renderer.ts` renderizando as 78 linhas de conexão com cor harmônica semitransparente e nós circulares brilhantes.
- **UI**: Checkbox "Cubo de Metatron" em `src/components/MandalaGenerator.tsx` na seção "📐 Geometria & Fractais".

### 📸 Resultado
Funcionalidade validada com sucesso via Playwright (`ui-verification-metatron.png`). Os 13 centros do Fruto da Vida com nós brancos brilhantes e as 78 linhas de conexão geométrica foram renderizados harmoniosamente sobre a mandala.

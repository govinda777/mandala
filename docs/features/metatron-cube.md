# Cubo de Metatron (Metatron's Cube Overlay)

## 🚧 Tarefa: Geometria Sagrada - Cubo de Metatron

### 📊 Análise
- **Objetivo**: Implementar a sobreposição do Cubo de Metatron, um dos símbolos centrais da Geometria Sagrada derivado do Fruto da Vida (Fruit of Life).
- **Impacto Visual**: Exibe 13 círculos tangentes dispostos radialmente (1 centro, 6 anel interno, 6 anel externo) e 78 linhas de conexão que ligam todos os centros entre si, formando os 5 Sólidos Platônicos.
- **Complexidade**: Média.
- **Dependências**: `src/lib/mandala-math.ts`, `src/lib/mandala-renderer.ts`, `src/components/MandalaGenerator.tsx`.

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  1. **Centros da Fruta da Vida**:
     - Centro $(0, 0)$
     - Anel Interno (6 círculos a uma distância $d = 2r$ nos ângulos $k \cdot \pi / 3$)
     - Anel Externo (6 círculos a uma distância $d = 4r$ nos ângulos $k \cdot \pi / 3$)
  2. **Linhas de Interconexão**:
     - Combinação de todos os pares de centros únicos: $\binom{13}{2} = \frac{13 \times 12}{2} = 78$ segmentos de reta.
- **Exemplo**:
  - Para um raio $R$, os 13 centros são gerados precisamente e conectados por exatamente 78 linhas.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários para cálculo dos 13 centros e 78 linhas.
- [x] Função matemática puras em `mandala-math.ts`.
- [x] Renderização canvas em `mandala-renderer.ts`.
- [x] Controle UI na aba Geometria do `MandalaGenerator.tsx`.
- [x] Suporte no compartilhamento via URL e metadados de NFT.

### 🧪 Testes a Implementar
1. `calculateMetatronCenters(radius)` deve retornar exatamente 13 pontos organizados no padrão Fruto da Vida.
2. `calculateMetatronLines(centers)` deve retornar exatamente 78 linhas unindo todos os pares de pontos sem repetição.

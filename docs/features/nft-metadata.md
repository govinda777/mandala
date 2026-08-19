## 🚧 Tarefa: Exportação de Metadados de NFT (NFT Metadata Export)

### 📊 Análise
- **Objetivo**: Implementar a geração e exportação de metadados em formato JSON compatível com os padrões OpenSea / ERC-721 / ERC-1155. O arquivo incluirá nome, descrição, atributos visuais/numéricos e um algoritmo de cálculo de pontuação de raridade (Rarity Score) baseado nos recursos ativos da mandala.
- **Impacto Visual**: O usuário terá um botão na Floating Action Bar ("💎 Exportar NFT JSON") para fazer o download direto do arquivo de metadados JSON configurado exatamente com as características da mandala atual.
- **Complexidade**: Baixa-Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Algoritmo de Raridade (Rarity Score)**:
  - Cada recurso ativado ou valor extremo aumenta a pontuação de raridade da mandala.
  - Pontuação base de complexidade e simetria:
    $$\text{Score}_{\text{base}} = \text{numPetalas} + (\text{numCamadas} \times 5) + (\text{complexidade} \times 10)$$
  - Multiplicadores/Acréscimos por recursos especiais ativados:
    - Flor da Vida: +25
    - Espiral Áurea: +30
    - Grade Hexagonal: +20
    - Modo Fibonacci (Pétalas ou Raio): +35
    - Bioluminescência: +40
    - Cimática (Chladni): +45
    - Mapa Astral: +50
  - Categoria de Raridade (Rarity Tier):
    - Score < 80: **Comum**
    - 80 <= Score < 140: **Incomum**
    - 140 <= Score < 200: **Raro**
    - Score >= 200: **Lendário**

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando para cálculo de raridade e geração de metadados JSON.
- [ ] Funções matemáticas puras implementadas em `src/lib/mandala-math.ts` (`calculateMandalaRarity`, `generateNFTMetadata`).
- [ ] Função de download de JSON implementada em `src/lib/mandala-export.ts`.
- [ ] Botão de exportação adicionado na UI em `src/components/MandalaGenerator.tsx`.
- [ ] Documentação e BACKLOG atualizados.

### 🧪 Testes a Implementar
1. `calculateMandalaRarity` deve retornar um objeto com pontuação numérica e o nível de raridade apropriado.
2. `generateNFTMetadata` deve retornar uma estrutura JSON bem formatada e aderente aos padrões OpenSea (com campos `name`, `description`, `attributes`).
3. Verificar se os atributos do JSON refletem fielmente as configurações passadas.

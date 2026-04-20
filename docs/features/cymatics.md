## 🚧 Tarefa: Padrões de Cimática (Chladni)

### 📊 Análise
- **Objetivo**: Implementar simulação visual dos Padrões de Chladni (Cimática) para gerar formas baseadas em vibrações acústicas.
- **Impacto Visual**: Pontos que se acumulam nas linhas nodais para formar padrões complexos e hipnotizantes sob a mandala.
- **Complexidade**: Alta
- **Dependências**: Matemática de renderização (`src/lib/mandala-math.ts`).

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: A equação das linhas nodais em uma placa quadrada vibrante, dada por:
  `cos(n * π * x / L) * cos(m * π * y / L) - cos(m * π * x / L) * cos(n * π * y / L) = 0`
- **Referência**: Ernst Chladni e sua descoberta na física acústica (placas de Chladni).
- **Exemplo**: Diferentes valores de N e M produzem matrizes diferentes de "areia".

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando
- [x] Função matemática implementada em `mandala-math.ts`
- [x] Renderização implementada em `mandala-renderer.ts`
- [x] Controle de UI adicionado (se aplicável)
- [x] Documentação atualizada (README ou BACKLOG)
- [ ] Pipeline de deploy bem-sucedida
- [ ] Mudança visível no site hospedado

### 🧪 Testes a Implementar
1. [x] Teste garantindo que pontos são computados e arrays não são vazios
2. [x] Teste garantindo limites e variações com diferentes valores de N e M.

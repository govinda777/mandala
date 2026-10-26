## 🚧 Tarefa: Geometria Sagrada - Cubo de Metatron (Metatron's Cube)

### 📊 Análise
- **Objetivo**: Implementar o Cubo de Metatron (Metatron's Cube) como uma sobreposição sagrada geométrica na mandala.
- **Impacto Visual**: Alto. Desenha os 13 círculos do Fruto da Vida (Fruit of Life) interconectados por 78 linhas douradas de conexão, revelando as projeções 2D de todos os 5 Sólidos Platônicos.
- **Complexidade**: Média (geometria polar e malha combinatória de linhas).
- **Dependências**: Funções trigonométricas puras para posições dos centros e iteração combinatória para par de pontos de linhas.

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  1. Os 13 círculos possuem raio $R$. O centro está em $(0,0)$. A 1ª camada contém 6 círculos a uma distância $2R$ em ângulos $k \cdot \frac{\pi}{3}$ ($k \in [0..5]$). A 2ª camada contém 6 círculos a uma distância $4R$ nos mesmos ângulos $k \cdot \frac{\pi}{3}$.
  2. As 78 linhas conectam cada um dos 13 centros de círculos a todos os outros 12 centros ($\frac{13 \times 12}{2} = 78$ linhas).
- **Referência**: Geometria Sagrada / Cubo de Metatron e o Fruto da Vida. Representa os blocos geométricos fundamentais do universo.
- **Exemplo**: Entrada: $R = 50$. Saída: 13 pontos centrais e 78 pares de segmentos de reta interconectados.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando (`src/test/metatron-cube.test.ts`)
- [x] Função matemática implementada em `mandala-math.ts` (`calculateMetatronCenters` e `calculateMetatronLines`)
- [x] Renderização implementada em `mandala-renderer.ts` (`drawMetatronCubeOverlay`)
- [x] Controle de UI adicionado no componente React (Checkbox "Cubo de Metatron")
- [x] Documentação atualizada (BACKLOG e este documento)
- [x] Pipeline de deploy e build validados
- [x] Mudança visível no site hospedado

### 🧪 Testes Implementados
1. Teste de cálculo dos 13 centros do Cubo de Metatron.
2. Teste de geração das 78 linhas de conexão entre todos os pares de centros.
3. Teste de atualização de score de raridade e metadados de NFT quando `metatronCube` é ativado.
4. Teste de codificação e decodificação na URL da configuração com `metatronCube`.

### 🎨 Implementação
- **Math**: `calculateMetatronCenters` e `calculateMetatronLines` em `src/lib/mandala-math.ts`.
- **Renderer**: `drawMetatronCubeOverlay` em `src/lib/mandala-renderer.ts`.
- **State & UI**: Estado `metatronCube` adicionado a `MandalaGenerator.tsx` e `SharedMandalaConfig`.

### 📸 Resultado
Captura visual gerada via script de teste Playwright para demonstração e verificação do overlay.

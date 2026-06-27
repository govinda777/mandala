# Backlog do Projeto Mandala

Este documento rastreia as ideias e funcionalidades planejadas para evoluir o gerador de mandalas, focando em ciência, cosmologia, matemática, geometria e NFTs.

## 🚀 Em Progresso
- [ ] **Curva Polar das Pétalas (Smooth/Sharp)**: Substituir geração cartesiana legada por silhueta matemática baseada em equações polares.
  - [ ] Atualizar documentação e backlog.
  - [ ] Implementar testes unitários para `calculatePolarPetalPoints`.
  - [ ] Implementar matemática da Rosa Polar em `mandala-math.ts`.
  - [ ] Implementar renderização contínua com `lineTo` em `mandala-renderer.ts`.
  - [ ] Adicionar controle UI (Generativo, Suave, Afiado) em `MandalaGenerator.tsx`.

## ✅ Concluído

- [x] **Bioluminescência**: Paletas de cores e brilhos inspirados em organismos bioluminescentes.
  - [x] Atualizar documentação e backlog.
  - [x] Implementar testes unitários para cálculo de intensidade luminosa.
  - [x] Implementar a lógica matemática de decaimento de luz ($1/r^2$).
  - [x] Implementar a renderização com glow effect no Canvas.
  - [x] Adicionar controle UI para o modo Bioluminescência.

- [x] **Cimática (Padrões de Chladni)**: Simular padrões de interferência e frequências ressonantes em modos de vibração 2D.
  - [x] Atualizar documentação e backlog.
  - [x] Implementar testes unitários para a geração do padrão Chladni.
  - [x] Implementar a lógica matemática.
  - [x] Implementar o renderizador Canvas para a visualização dos pontos nodais de Chladni.
  - [x] Adicionar controles UI para ativar o modo cimática e controlar as frequências `n` e `m`.

## ✅ Concluído

- [x] **Bioluminescência**: Paletas de cores e brilhos inspirados em organismos bioluminescentes.
  - [x] Atualizar documentação e backlog.
  - [x] Implementar testes unitários para cálculo de intensidade luminosa.
  - [x] Implementar a lógica matemática de decaimento de luz ($1/r^2$).
  - [x] Implementar a renderização com glow effect no Canvas.
  - [x] Adicionar controle UI para o modo Bioluminescência.

- [x] **Modo Fibonacci Avançado**
  - [x] Testes unitários criados e passando
  - [x] Função matemática implementada em `mandala-math.ts` (`calculateFibonacciRadius`)
  - [x] Renderização implementada em `mandala-renderer.ts`
  - [x] Controle de UI adicionado no `MandalaGenerator.tsx`
  - [x] Documentação atualizada no BACKLOG.md

- [x] **Geometria Sagrada - Proporção Áurea**: Adicionar sobreposição de espiral áurea.
  - [x] Implementar lógica matemática (`calculateGoldenSpiral`).
  - [x] Adicionar testes unitários.
  - [x] Implementar renderização no Canvas (`drawGoldenSpiral`).
  - [x] Adicionar controle na UI (`showGoldenSpiral`).

- [x] **Fases da Lua**: Influenciar a luminosidade ou "abertura" da mandala baseado na fase lunar atual.
  - [x] Criar testes unitários para cálculo da fase lunar.
  - [x] Implementar lógica matemática (`calculateMoonPhase`, `getMoonIllumination`).
  - [x] Implementar ajuste de luminosidade e "abertura" das pétalas no Canvas (`mandala-renderer.ts`).
  - [x] Adicionar controle na UI para fase da lua e botão "Fase de Hoje".

- [x] **Tesselação de Padrões**: Adicionar sobreposição de grade hexagonal (tesselação).
  - [x] Criar testes unitários para cálculo da grade.
  - [x] Implementar lógica matemática (`calculateHexagonGrid`).
  - [x] Implementar renderização no Canvas.
  - [x] Adicionar controle na UI.

- [x] **Exportação PNG de Alta Resolução**: Adicionar funcionalidade para baixar a mandala em alta resolução.
  - [x] Criar função de geração de imagem.
  - [x] Adicionar botão de download na UI.
  - [x] Testar geração de imagem.

- [x] **Frequências Planetárias**: Adicionar seleção de planetas para configurar cores e frequências de pulsação.
  - [x] Criar testes unitários para configuração planetária.
  - [x] Implementar mapa de cores e frequências.
  - [x] Adicionar controle na UI.

- [x] **Modo Fractal**: Adicionar modo de círculos recursivos.
  - [x] Implementar lógica matemática (`calculateFractalCircles`).
  - [x] Adicionar testes unitários.
  - [x] Implementar renderização no Canvas.
  - [x] Adicionar controle na UI.

- [x] **Geometria Sagrada**: Adicionar sobreposição da "Flor da Vida".
  - [x] Implementar lógica matemática (`calculateFlowerOfLifeCenters`).
  - [x] Adicionar testes unitários.
  - [x] Implementar renderização no Canvas.
  - [x] Adicionar controle na UI.

- [x] **Refatoração Inicial**: Separar lógica de desenho (Canvas) da lógica de estado (React).
    - [x] Criar `src/lib/mandala-math.ts` para lógica matemática.
    - [x] Criar `src/lib/mandala-renderer.ts` para lógica de renderização.
    - [x] Adicionar testes unitários para a lógica matemática.
- [x] **Modo Fibonacci**: Implementar opção para restringir o número de pétalas à sequência de Fibonacci (3, 5, 8, 13, 21...).
- [x] **Configuração do Ambiente**: Configurar Vite, TypeScript, React e testes (Vitest).
- [x] **Animação**: Adicionar modo de "Respiração/Pulsação".
  - [x] Implementar lógica matemática (`calculatePulseScale`).
  - [x] Adicionar testes unitários.
  - [x] Implementar renderização no Canvas (ajuste de escala).
  - [x] Adicionar controle na UI (checkbox e slider de frequência).
- [x] **Animação Rotacional**: Fazer a mandala girar contínuamente.
  - [x] Implementar lógica matemática (`calculateAutoRotation`).
  - [x] Adicionar testes unitários.
  - [x] Implementar loop de animação no React (ajuste do ângulo com RequestAnimationFrame).
  - [x] Adicionar controle na UI (checkbox e slider de RPM).
- [x] **Simetria Personalizada**: Adicionar suporte a simetria de espelhamento (caleidoscópio).

## 📋 Próximos Passos (Curto Prazo)

## 🌟 Funcionalidades Futuras (Médio/Longo Prazo)

### 📐 Matemática e Geometria

### 🌌 Cosmologia e Astrologia
- **Mapa Astral**: Gerar mandalas baseadas na posição dos planetas em uma data/hora específica (Astrologia).

### 🔬 Ciência e Natureza

### 💎 Web3 e NFT
- **Exportação de Metadados**: Gerar JSON com os atributos da mandala (raridade baseada na complexidade, cores, etc).
- **Minting**: Integração simples para transformar a mandala gerada em um NFT (ex: na rede Polygon ou Ethereum).

### 🛠️ Melhorias Técnicas
- **Alta Resolução**: Exportar em PNG/SVG de alta qualidade para impressão.
- **Compartilhamento**: Gerar link único com os parâmetros da mandala.

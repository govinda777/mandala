# Backlog do Projeto Mandala

Este documento rastreia as ideias e funcionalidades planejadas para evoluir o gerador de mandalas, focando em ciência, cosmologia, matemática, geometria e NFTs.

## 🚀 Em Progresso

## ✅ Concluído

- [x] **Animação de Respiração/Pulsação**: Adicionar efeito de pulsação suave à mandala.
  - [x] Implementar função matemática de pulsação (`calculatePulseScale`).
  - [x] Adicionar suporte a escala na renderização (`drawMandala`).
  - [x] Implementar loop de animação (`requestAnimationFrame`) no componente React.
  - [x] Adicionar controle de UI para ativar/desativar animação.

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

- [x] **Geometria Sagrada - Proporção Áurea**: Adicionar sobreposição de espiral áurea.
  - [x] Implementar lógica matemática (`calculateGoldenSpiral`).
  - [x] Adicionar testes unitários.
  - [x] Implementar renderização no Canvas.
  - [x] Adicionar controle na UI.

- [x] **Refatoração Inicial**: Separar lógica de desenho (Canvas) da lógica de estado (React).
    - [x] Criar `src/lib/mandala-math.ts` para lógica matemática.
    - [x] Criar `src/lib/mandala-renderer.ts` para lógica de renderização.
    - [x] Adicionar testes unitários para a lógica matemática.
- [x] **Modo Fibonacci**: Implementar opção para restringir o número de pétalas à sequência de Fibonacci (3, 5, 8, 13, 21...).
- [x] **Configuração do Ambiente**: Configurar Vite, TypeScript, React e testes (Vitest).

## 📋 Próximos Passos (Curto Prazo)


## 🌟 Funcionalidades Futuras (Médio/Longo Prazo)

### 📐 Matemática e Geometria
- **Simetria Personalizada**: Permitir simetrias não radiais ou simetrias baseadas em grupos cristalográficos.
- **Tesselação**: Criar padrões que se repetem infinitamente sem lacunas.

### 🌌 Cosmologia e Astrologia
- **Mapa Astral**: Gerar mandalas baseadas na posição dos planetas em uma data/hora específica (Astrologia).
- **Frequências Planetárias**: Ajustar cores e formas baseadas em "frequências" associadas a planetas (ex: Kepler's Harmonies).
- **Fases da Lua**: Influenciar a luminosidade ou "abertura" da mandala baseado na fase lunar atual.

### 🔬 Ciência e Natureza
- **Cimática**: Simular padrões de Chladni (areia em prato vibratório) baseados em input de som ou frequência.
- **Bioluminescência**: Paletas de cores inspiradas em organismos bioluminescentes.

### 💎 Web3 e NFT
- **Exportação de Metadados**: Gerar JSON com os atributos da mandala (raridade baseada na complexidade, cores, etc).
- **Minting**: Integração simples para transformar a mandala gerada em um NFT (ex: na rede Polygon ou Ethereum).

### 🛠️ Melhorias Técnicas
- **Alta Resolução**: Exportar em PNG/SVG de alta qualidade para impressão.
- **Animação**: Fazer a mandala girar ou "respirar" (pulsar camadas).
- **Compartilhamento**: Gerar link único com os parâmetros da mandala.

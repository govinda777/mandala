## 🚧 Tarefa: Cimática (Padrões de Chladni)

### 📊 Análise
- **Objetivo**: Adicionar sobreposição de padrões de Chladni, simulando os efeitos da cimática (areia em prato vibratório).
- **Impacto Visual**: Pontos que se organizam em nós de interferência destrutiva, criando padrões geométricos belos, frequentemente vistos em vídeos de areia sobre placas metálicas vibrantes.
- **Complexidade**: Média. O algoritmo de renderização exige verificar e desenhar milhares de pontos baseados em uma equação trigonométrica.
- **Dependências**: Matemática nativa do JS.

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: A função de onda para modos de vibração em uma placa retangular fina é descrita como:
  `C(x,y) = cos(n * pi * x/L) * cos(m * pi * y/L) - cos(m * pi * x/L) * cos(n * pi * y/L)`
  Onde os nós (onde a areia se acumula) são as posições onde `C(x,y) ≈ 0`.
- **Referência**: Padrões de Chladni, Ernst Chladni.

### ✅ Critérios de Aceitação (BDD)
- [x] Documentação atualizada (README ou BACKLOG)
- [x] Testes unitários para a nova fórmula e lógica de pontos.
- [x] Função matemática implementada em `mandala-math.ts`.
- [x] Renderização implementada em `mandala-renderer.ts` (pontos/areia em canvas).
- [x] Controle de UI no `MandalaGenerator.tsx` (modos e propriedades N/M).
- [x] O projeto deve ser compilado e rodar com o novo código.
- [x] Visualização das mudanças.

### 🧪 Testes a Implementar
1. Teste da lógica matemática: a função retorna array de pontos e tem mais de um elemento.
2. Teste da lógica matemática: com n e m dados, garante a restrição da equação.

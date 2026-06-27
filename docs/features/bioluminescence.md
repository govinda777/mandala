## 🚧 Tarefa: Modo Bioluminescência

### 📊 Análise
- **Objetivo**: Implementar o Modo Bioluminescência, adicionando cores neon (ciano, verde limão, azul profundo) baseadas na emissão de luz de organismos marinhos e aplicando efeitos de brilho (glow/shadowBlur) simulando organismos vivos.
- **Impacto Visual**: A mandala ganhará um efeito intenso "glowing" com um fundo mais escuro, parecendo um organismo bioluminescente vivo.
- **Complexidade**: Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: O espectro de emissão de luciferina marinha tem picos ao redor de 470nm, o que se traduz para matizes (HUE) próximos a 180°-240° (ciano/azul) e ocasionalmente 160° (verde). A intensidade da luz simulada para efeitos de cor baseia-se numa versão atenuada da Lei do Inverso do Quadrado ($I = I_0 / r^2$) e cálculos de opacidade/glow em relação ao raio total.
- **Referência**: Emissão de bioluminescência marinha (Luciferina-Luciferase).

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando.
- [x] Função matemática implementada em `mandala-math.ts` para cálculos de intensidade.
- [x] Renderização implementada em `mandala-renderer.ts` (aplicando glow e forçando fundo escuro/paleta especificada).
- [x] Controle de UI adicionado em `MandalaGenerator.tsx`.
- [x] Documentação atualizada (README ou BACKLOG).
- [x] Pipeline de deploy bem-sucedida.
- [x] Mudança visível no site hospedado.

### 🧪 Testes a Implementar
1. Teste da lógica matemática (verificar se `calculateBioluminescenceIntensity` calcula o decaimento).
2. Teste de cores (verificar se `getBioluminescenceColor` mapeia intensidade para tons e opacidades corretas).
3. Teste de integração (renderização e config).

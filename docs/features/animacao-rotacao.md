## 🚧 Tarefa: Animação Rotacional (Girar)

### 📊 Análise
- **Objetivo**: Implementar uma funcionalidade que permite à mandala girar continuamente no seu próprio eixo com base numa velocidade pré-definida.
- **Impacto Visual**: Alto. Transforma uma imagem estática em uma experiência hipnótica e imersiva.
- **Complexidade**: Baixa-Média
- **Dependências**: `requestAnimationFrame`, `React.useState`, `React.useEffect`

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: O cálculo baseia-se em converter RPM (Revoluções Por Minuto) para graus por milissegundo e multiplicar isso pelo tempo decorrido.
- **Referência**: Mecânica clássica de velocidade angular ($ \omega $). Uma rotação completa é 360°. Em 1 RPM, roda 360° a cada 60.000 ms.
- **Exemplo**: A 1 RPM, em 30.000ms a rotação atingirá 180°. A 2 RPM, em 15.000ms a rotação atingirá 180°.

### ✅ Critérios de Aceitação (BDD)
- [x] Testes unitários criados e passando
- [x] Função matemática implementada em `mandala-math.ts`
- [x] Renderização implementada em `MandalaGenerator.tsx` via `requestAnimationFrame` em um hook.
- [x] Controle de UI adicionado (Checkbox para 'Animação de Rotação (Girar)' e Slider de velocidade em RPM).
- [x] Documentação atualizada (BACKLOG e esse arquivo).

### 🧪 Testes Implementados
1. Teste de calculo 0 de rotação no tempo inicial 0s.
2. Teste de 180 graus (meia rotação) para meio minuto a 1 RPM.
3. Teste de 360 graus para um minuto completo a 1 RPM.
4. Teste de rotações com valor negativo (direção oposta).

### 🎨 Implementação
Foi adicionado o hook de animação para gerenciar o ângulo `currentAutoRotation` com base no tempo calculado entre os frames, que é então adicionado ao ângulo inicial de `rotacao` na hora da chamada do `drawMandala`.

### 📸 Resultado
A UI ganhou um checkbox de "Animação de Rotação (Girar)". Ao habilitá-lo, é possível configurar o RPM de -10 a 10 no slider. O resultado é a mandala girando na tela uniformemente.
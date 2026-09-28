# 🚧 Tarefa: Rosa de Maurer (Maurer Rose Pattern)

### 📊 Análise
- **Objetivo**: Renderizar o padrão rendilhado geométrico da Rosa de Maurer (Maurer Rose) sobreposto à mandala.
- **Impacto Visual**: Padrões de treliça/manta rendilhada interconectando pontos polares com ângulos de salto personalizáveis ($d$) e número de pétalas ($n$).
- **Complexidade**: Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  Uma Rosa de Maurer consiste em 361 pontos dados por coordenadas polares:
  $$\theta_k = k \cdot d \cdot \frac{\pi}{180} \quad \text{para } k = 0, 1, 2, \dots, 360$$
  $$r_k = R \cdot \sin(n \cdot \theta_k)$$
  $$x_k = r_k \cdot \cos(\theta_k), \quad y_k = r_k \cdot \sin(\theta_k)$$
  Conectando os 361 pontos sequencialmente com linhas contínuas, é formada uma treliça rendilhada harmônica.
- **Referência**: Introduced by Peter M. Maurer (1987).
- **Exemplo**: Entrada ($n=6, d=71, R=100$) -> Saída: 361 coordenadas $(x,y)$ conectadas em sequência.

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando
- [ ] Função matemática `calculateMaurerRosePoints` em `mandala-math.ts`
- [ ] Renderização `drawMaurerRoseOverlay` em `mandala-renderer.ts`
- [ ] Controle de UI adicionado no `MandalaGenerator.tsx` (Toggle, Slider $n$, Slider $d$)
- [ ] Documentação atualizada
- [ ] Mudança visível no site

### 🧪 Testes a Implementar
1. Validação de geração dos 361 pontos polares para valores válidos de $n$ e $d$.
2. Verificação de cálculo do ponto inicial e final.
3. Tratamento de limites (raio = 0, $n=0$, $d=0$).

### 🎨 Implementação
Implementação da função pura `calculateMaurerRosePoints` em `mandala-math.ts` e renderizador `drawMaurerRoseOverlay` em `mandala-renderer.ts`, integrada às opções de configuração e UI do componente React.

## 🚧 Tarefa: Mapa Astral (Astrological Chart Overlay)

### 📊 Análise
- **Objetivo**: Implementar uma sobreposição de mapa astral (Astrological Chart Overlay) que renderiza de forma elegante as posições planetárias relativas e os aspectos geométricos formados em uma determinada data e hora.
- **Impacto Visual**: Exibição de órbitas concêntricas de planetas (Sol, Lua, Mercúrio, Vênus, Marte, Júpiter, Saturno), representados por símbolos ou círculos brilhantes coloridos posicionados em ângulos astrológicos precisos. Linhas geométricas brilhantes de aspectos conectam os corpos celestes correspondentes (conjunção, quadratura, oposição, trígono) no centro da mandala. Um anel externo mostrando as subdivisões e glifos/nomes dos 12 signos do zodíaco envolve os elementos celestes.
- **Complexidade**: Média-Alta
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**:
  - **Posicionamento Planetário**: Para fins estéticos e funcionais sem inflar a aplicação com efemérides pesadas, modelamos o movimento orbital heliocêntrico aproximado dos corpos celestes projetados na eclíptica geocêntrica. Usaremos períodos sinódicos/siderais aproximados a partir de uma época astrológica conhecida (Época J2000.0, 1 de Janeiro de 2000 às 12:00 UTC) para derivar a longitude eclíptica angular:
    $$\theta = (\theta_{epoch} + \frac{360 \times \Delta t}{T_{period}}) \pmod{360}$$
  - **Aspectos Astrológicos**: Identificamos quando dois planetas formam ângulos harmonicamente significativos:
    - Conjunção (0°, tolerância $\pm 6^\circ$)
    - Quadratura (90°, tolerância $\pm 6^\circ$)
    - Trígono (120°, tolerância $\pm 6^\circ$)
    - Oposição (180°, tolerância $\pm 6^\circ$)
- **Exemplo**: Entrada `new Date('2020-01-01')` -> Retorna as posições angulares de cada planeta e os aspectos que se formam entre eles.

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando para cálculo de posições planetárias e identificação de aspectos.
- [ ] Funções matemáticas implementadas em `src/lib/mandala-math.ts` (`calculatePlanetaryPositions`, `calculateAstrologicalAspects`).
- [ ] Renderização de órbitas, planetas, linhas de aspectos e anel do zodíaco implementada em `src/lib/mandala-renderer.ts`.
- [ ] Controles na UI adicionados para ativar o recurso, escolher data/hora livremente ou selecionar eventos históricos (Nascimento do Bitcoin, Chegada do Homem à Lua, Momento Atual).
- [ ] Documentação atualizada.

### 🧪 Testes a Implementar
1. `calculatePlanetaryPositions` deve retornar as posições de 7 corpos celestes básicos em graus (0-360) baseados em uma data de entrada.
2. `calculateAstrologicalAspects` deve identificar corretamente conjunções, oposições, trígonos e quadraturas com base na tolerância definida.
3. Testar a resiliência a datas inválidas, retornando posições padrão para evitar quebras.

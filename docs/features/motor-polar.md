# Feature: Motor Matemático Baseado em Coordenadas Polares

## Análise e Objetivo
O motor original renderizava a mandala através da instância rígida de formas geométricas, utilizando coordenadas cartesianas e algoritmos para limitar a colisão através do cálculo de Curvas de Bézier. Esse formato dificultava a escalabilidade do código e engessava a fluidez e a natureza puramente orgânica das mandalas.
Esta atualização refatora a fundação do aplicativo, movendo a base da geração para **Coordenadas Polares**. Isso proporciona um desenho contínuo e controlável das ondas da mandala, facilitando integrações futuras como a geração de um hash único que pode reproduzir deterministicamente a renderização.

## Fundamentação Matemática (Equação da Rosa Polar)
Toda a geração da estrutura visual agora segue o conceito da curva conhecida como **Rosa Polar**. A equação original ($r(\theta) = a \cdot \cos(k\theta)$) foi adaptada para permitir que as camadas possuam um raio interno e uma altura variável da pétala:

$$ r(\theta) = R + A \cdot \sin(k \cdot \theta) $$

*Onde:*
- **$r$** é a distância radial do centro em um determinado ângulo.
- **$\theta$** é o ângulo rotacional contínuo (resolução dinâmica baseada no tamanho da mandala).
- **$R$** é o raio base (centro daquela camada específica).
- **$A$** é a amplitude da pétala (altura/flutuação máxima imposta pelo fator de complexidade).
- **$k$** é o fator de frequência, diretamente atrelado ao número de pétalas (`numPetalas`) inserido pelo usuário.

**Conversão Cartesiana (Canvas):**
Para que o `CanvasRenderingContext2D` possa desenhar o caminho orgânico, o renderizador executa iterativamente:
$x = r \cdot \cos(\theta)$
$y = r \cdot \sin(\theta)$

**Formas (Smooth vs Sharp):**
A implementação possui um fator variável (controlável pela interface) para permitir que a mandala alterne entre traços arredondados e pontiagudos.
- **Pétala Fluida (Smooth):** Utiliza a equação polar original ($R + A \cdot \sin(k \cdot \theta)$).
- **Pétala Geométrica/Pontuda (Sharp):** Utiliza o valor absoluto do seno para criar pontos rígidos na amplitude zero ($R + A \cdot |\sin(k \cdot \theta)|$).

## Critérios de Aceite (BDD)
- **Dado** que o renderizador solicita os pontos de uma camada,
- **Quando** a engine matemática processar as variáveis,
- **Então** ela deve retornar um array limpo de coordenadas sem contato com a estilização.

- **Dado** que o usuário altera a interface para "Seno Absoluto",
- **Quando** o desenho for gerado,
- **Então** as pontas da forma devem se cruzar de forma afiada, alterando a curva fluida do seno.

## Implementação
- **Limpeza de Código:** Remoção das funções `generateGenerativeLayers`, `calculatePolygonRadiusMultiplier` e `calculateFractalCircles` do `mandala-math.ts`. O multiplicador poligonal legada e as restrições por bounding/caixa sumiram.
- **`generatePolarLayers` e `evaluatePolarEquation`:** Novas funções puras em `mandala-math.ts` para instanciar as camadas e resolver o cálculo Trigonométrico. A resolução angular é dinâmica (proporcional ao raio R da camada) para manter a performance.
- **Renderizador (`mandala-renderer.ts`):** Foi completamente adaptado para receber as coordenadas polares transformadas e percorrer um caminho contínuo, utilizando `beginPath`, iterando sobre os pontos com `lineTo` e finalizando com `closePath`. Todas as propriedades de simetria espelhada (`simetriaPersonalizada`) e os traçados do preenchimento/estilo são preservados.
- **UI:** A opção visual legado "Forma Base" foi substituída pelo controle "Forma da Curva Polar", e a opção "Modo Fractal" foi deletada.

## Resultado
A arquitetura do motor de rendering agora obedece o *Single Source of Truth* matemático de geração de mandalas, resultando num processamento ágil (dispensa cálculos complexos de tangentes ou interações espaciais) e uma renderização visualmente orgânica.
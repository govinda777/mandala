## 🚧 Tarefa: Compartilhamento via URL (Share Link)

### 📊 Análise
- **Objetivo**: Implementar uma funcionalidade para serializar a configuração atual da mandala em um parâmetro codificado na URL (por exemplo, `?state=...` ou via parâmetros individuais) permitindo que o estado exato seja carregado e compartilhado através de um link.
- **Impacto Visual**: Um novo botão "🔗 Compartilhar" na barra flutuante que copia o link único gerado para a área de transferência do usuário e exibe um feedback visual de "Link Copiado!".
- **Complexidade**: Média
- **Dependências**: Nenhuma

### 🧮 Fundamento Matemático/Científico
- **Fórmula/Algoritmo**: Serialização determinística de parâmetros. Para manter o link curto e seguro para URL, as propriedades da mandala são compactadas em um formato de chave/valor mapeado ou JSON codificado em Base64 com substituições seguras para caracteres especiais (`+` por `-`, `/` por `_`, e removendo padding `=`).
- **Exemplo**: Entrada `{ numPetalas: 12, numCamadas: 5, corBase: 180, ... }` -> Serializado: `eyJudW1QZXRhbGFzIjoxMiwibnVtQ2FtYWRhcyI6NSwiY29yQmFzZSI6MTgwfQ` (exemplo ilustrativo de Base64).

### ✅ Critérios de Aceitação (BDD)
- [ ] Testes unitários criados e passando para codificação e decodificação do estado da mandala.
- [ ] Função matemática implementada em `mandala-math.ts` (`encodeMandalaConfig` e `decodeMandalaConfig`).
- [ ] Estado da UI em `MandalaGenerator.tsx` lê os parâmetros da URL no carregamento do componente.
- [ ] Botão de Compartilhar adicionado na UI com feedback visual "Copiado!" temporário.
- [ ] Documentação atualizada no `BACKLOG.md`.
- [ ] Deploy automático bem-sucedido e funcionamento correto verificado.

### 🧪 Testes a Implementar
1. `encodeMandalaConfig` deve serializar um objeto de configuração em uma string segura para URL.
2. `decodeMandalaConfig` deve restaurar corretamente o objeto a partir da string serializada.
3. Testar a resiliência a strings inválidas, retornando valores padrão para evitar quebras de página.

### 🎨 Implementação
As novas funções `encodeMandalaConfig` e `decodeMandalaConfig` serão adicionadas à biblioteca `src/lib/mandala-math.ts`. No componente React, utilizaremos `useEffect` no carregamento inicial para ler a URL atual e aplicar os parâmetros do estado codificado.

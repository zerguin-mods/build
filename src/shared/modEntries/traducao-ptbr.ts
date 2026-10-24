import type { ModDef } from '../mods'
import { EN_OPTION, IDIOMA_GROUP, PT_BR_OPTION, TRADUCAO_PTBR } from '../traducaoPtbr'

const mod: ModDef = {
  id: TRADUCAO_PTBR,
  name: 'Tradução PT-BR',
  author: 'Zerguin-Mods',
  version: '0.1.0',
  scope: 'anytime',
  // Off until the player turns it on, as every new mod in the build ships.
  defaultOn: false,
  blurb:
    'A IA do jogo passa a escrever em português brasileiro: cenas, DMs, posts, memórias e personagens novas. A interface do jogo continua em inglês.',
  offNote:
    'Nada é apagado nem reescrito: o que já saiu em português fica como está, e a IA volta a escrever em inglês.',
  options: [
    {
      id: PT_BR_OPTION,
      label: 'Português (Brasil)',
      hint: 'Toda a prosa nova — cenas, DMs, posts, memórias — sai em português brasileiro natural. Nomes, chaves e tags de aparência ficam em inglês, como o jogo espera.',
      default: true,
      group: IDIOMA_GROUP
    },
    {
      id: EN_OPTION,
      label: 'English',
      hint: 'A IA escreve em inglês, como o jogo faz sem o mod.',
      default: false,
      group: IDIOMA_GROUP
    }
  ],
  optionGroups: [
    {
      id: IDIOMA_GROUP,
      label: 'Idioma',
      hint: 'A língua em que a IA escreve o conteúdo novo.'
    }
  ]
}
export default mod

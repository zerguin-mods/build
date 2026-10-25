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
    'Tudo o que o jogo escreve passa ao português brasileiro: a prosa da IA — cenas, DMs, posts, memórias, personagens — e a própria interface, pelo catálogo que o mod traz.',
  offNote:
    'Nada é apagado nem reescrito: o que já saiu em português fica como está, e o jogo volta ao inglês.',
  options: [
    {
      id: PT_BR_OPTION,
      label: 'Português (Brasil)',
      hint: 'A prosa nova da IA e a interface do jogo saem em português brasileiro natural. Nomes, chaves e tags de aparência ficam em inglês, como o jogo espera.',
      default: true,
      group: IDIOMA_GROUP
    },
    {
      id: EN_OPTION,
      label: 'English',
      hint: 'Tudo volta ao inglês — a prosa da IA e a interface — como o jogo é sem o mod.',
      default: false,
      group: IDIOMA_GROUP
    }
  ],
  optionGroups: [
    {
      id: IDIOMA_GROUP,
      label: 'Idioma',
      hint: 'A língua em que o jogo se escreve: a prosa da IA e a interface.'
    }
  ]
}
export default mod

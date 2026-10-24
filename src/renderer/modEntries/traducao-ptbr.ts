import { optionOn } from '@shared/mods'
import { PT_BR_OPTION, TRADUCAO_PTBR, type GameLanguage } from '@shared/traducaoPtbr'
import { useModsStore } from '../stores/modsStore'
import { registerHooks } from '../mods/hooks'
import {
  characterLanguageLines,
  withLedgerLanguage,
  withProseLanguage
} from '../prompts/languageDirective'

/**
 * The PT-BR translation, plugged into the game through its hooks. Every call the build hands
 * to its mods is told the player's language at the end of its system, where VenusTraining had
 * the wording ride; the game only asks, and the mods store skips this mod while it is off. What
 * the build hands to no mod keeps writing in English, as `docs/mods/traducao-ptbr.md` lists.
 */

/** The language picked on the Mods screen, read as each hook is asked. */
function language(): GameLanguage {
  return optionOn(useModsStore.getState().switches, TRADUCAO_PTBR, PT_BR_OPTION)
    ? 'pt-br'
    : 'en'
}

registerHooks(TRADUCAO_PTBR, {
  requests: {
    // The prose calls: a scene with a cast or alone, its continuation and its closing.
    scene: (request) => withProseLanguage(request, language()),
    // Her reply in a DM thread, a regenerated one by the same builder.
    dm: (request) => withProseLanguage(request, language()),
    // The slot's opening: its narration, the status posts and the girls texting first, one call.
    'slot-intro': (request) => withProseLanguage(request, language()),
    // The ledger: memories and plans, kept in the shape the reader's voice can rewrite.
    ledger: (request) => withLedgerLanguage(request, language())
  },
  // Character generation hands its mods lines only, so its wording rides in the user block,
  // above the pose and expression enums the lines hold to the schema's own tokens.
  prompts: {
    character: { lines: () => characterLanguageLines(language()) }
  }
})

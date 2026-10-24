/**
 * The PT-BR translation mod's identity: the ids its entry, its hooks and its options are found
 * by, in the one place. Every id here is written to disk in `data/mods.json`
 * (`traducao-ptbr:<option>`), so none of it changes once shipped.
 *
 * A leaf, importing nothing: the entry that names these is glob-loaded by `mods.ts`, which
 * nothing it loads may circle back into. Reading the picked language is the renderer's, where
 * the switches are (`modsStore`).
 */

/** The mod's id, and the name of both its entry files. */
export const TRADUCAO_PTBR = 'traducao-ptbr'

/** The languages the mod can have the game write in. The player's choice is a group of options. */
export type GameLanguage = 'pt-br' | 'en'

/** The group the language choice is shown as, one box on the mod's page of the Mods screen. */
export const IDIOMA_GROUP = 'idioma'

/** Brazilian Portuguese, the group's default: picked until the player picks English. */
export const PT_BR_OPTION = 'pt-br'

/** English, the game's own writing: the language lines are simply not sent. */
export const EN_OPTION = 'en'

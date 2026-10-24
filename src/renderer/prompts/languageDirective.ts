import type { GameLanguage } from '@shared/traducaoPtbr'
import type { StructuredRequest } from '@shared/types'

/**
 * The lines a call is told which language to write in, and the request wrappers that carry
 * them. English, the language the game itself is written in, is told nothing, and its requests
 * pass through untouched.
 *
 * The wording is VenusTraining's (v0.4.0), tested in game, preserved byte for byte in the
 * ptbr-pack this mod comes from. What carried it there is not ported: the wrappers became this
 * build's hooks, the `local` flag belonged to the managed llama.cpp writer this build has not,
 * and character generation, handed to mods as lines only, takes its wording through
 * `characterLanguageLines` in the user block instead of a request of its own.
 */

const PT_LINES = [
  'You write in Brazilian Portuguese: every line of narration, dialogue, text, post and summary you write is natural, idiomatic Brazilian Portuguese, the way a native writer writes it.',
  'Where another instruction tells you to call him "the reader", call him "o leitor" instead. Every name, charKey, place, emotion and tag stays exactly as the prompt gives it, in English.'
]

/** The lines every prose-writing call carries. */
export function proseLanguageLines(language: GameLanguage): readonly string[] {
  return language === 'en' ? [] : PT_LINES
}

/** The prose lines, with the shape a memory is kept in so the reader's voice can rewrite it. */
export function ledgerLanguageLines(language: GameLanguage): readonly string[] {
  if (language === 'en') return []
  return [
    ...PT_LINES,
    'Every memory refers to the reader in the third person as "o leitor" — never "você" — and his things are "seu" and "sua".'
  ]
}

/** The prose lines, with what character generation keeps English for the renderer under it. */
export function characterLanguageLines(language: GameLanguage): readonly string[] {
  if (language === 'en') return []
  return [
    ...PT_LINES,
    'The names are still names common in the USA, in plain Latin letters; the appearance and outfit fields are still danbooru tags in English; every enum value is still the exact token the schema shows.'
  ]
}

/** The request a call sends, its system carrying `lines`; a language with none passes through. */
function withLines(request: StructuredRequest, lines: readonly string[]): StructuredRequest {
  if (lines.length === 0) return request
  return { ...request, system: `${request.system}\n\n${lines.join('\n')}` }
}

/** A prose call's request, told to write in the player's language. */
export function withProseLanguage(
  request: StructuredRequest,
  language: GameLanguage
): StructuredRequest {
  return withLines(request, proseLanguageLines(language))
}

/** A ledger call's request, told the memory shape on top of the prose lines. */
export function withLedgerLanguage(
  request: StructuredRequest,
  language: GameLanguage
): StructuredRequest {
  return withLines(request, ledgerLanguageLines(language))
}

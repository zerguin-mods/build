import { describe, expect, it } from 'vitest'
import { EN_OPTION, IDIOMA_GROUP, PT_BR_OPTION, TRADUCAO_PTBR } from '@shared/traducaoPtbr'
import { MODS } from '@shared/mods'
import type { StructuredRequest } from '@shared/types'
import {
  characterLanguageLines,
  ledgerLanguageLines,
  proseLanguageLines,
  withLedgerLanguage,
  withProseLanguage
} from '../src/renderer/prompts/languageDirective'

/**
 * The PT-BR translation: one choice of language on the Mods screen, and the wording it sends —
 * which is VenusTraining's, and is held here exactly as the ptbr-pack preserves it.
 */

const PT_LINES = [
  'You write in Brazilian Portuguese: every line of narration, dialogue, text, post and summary you write is natural, idiomatic Brazilian Portuguese, the way a native writer writes it.',
  'Where another instruction tells you to call him "the reader", call him "o leitor" instead. Every name, charKey, place, emotion and tag stays exactly as the prompt gives it, in English.'
]
const LEDGER_LINE =
  'Every memory refers to the reader in the third person as "o leitor" — never "você" — and his things are "seu" and "sua".'
const CHARACTER_LINE =
  'The names are still names common in the USA, in plain Latin letters; the appearance and outfit fields are still danbooru tags in English; every enum value is still the exact token the schema shows.'

const request: StructuredRequest = {
  system: 'RITA',
  user: 'READER',
  schema: { name: 'scene', schema: { type: 'object' } }
}

describe('the shipped list', () => {
  const mod = MODS.find((entry) => entry.id === TRADUCAO_PTBR)

  it('ships the translation off, for any moment of a playthrough', () => {
    expect(mod).toMatchObject({ scope: 'anytime', defaultOn: false })
  })

  it('shows the language as one choice, Portuguese picked', () => {
    expect(mod?.options?.map((option) => option.id)).toEqual([PT_BR_OPTION, EN_OPTION])
    expect(mod?.options?.every((option) => option.group === IDIOMA_GROUP)).toBe(true)
    expect(mod?.optionGroups?.map((group) => group.id)).toEqual([IDIOMA_GROUP])
    const picked = Object.fromEntries(
      (mod?.options ?? []).map((option) => [option.id, option.default])
    )
    expect(picked).toMatchObject({ [PT_BR_OPTION]: true, [EN_OPTION]: false })
  })
})

describe('the language lines', () => {
  it('tell an English call nothing', () => {
    expect(proseLanguageLines('en')).toEqual([])
    expect(ledgerLanguageLines('en')).toEqual([])
    expect(characterLanguageLines('en')).toEqual([])
  })

  it('carry the wording VenusTraining tested in game', () => {
    expect(proseLanguageLines('pt-br')).toEqual(PT_LINES)
    expect(ledgerLanguageLines('pt-br')).toEqual([...PT_LINES, LEDGER_LINE])
    expect(characterLanguageLines('pt-br')).toEqual([...PT_LINES, CHARACTER_LINE])
  })
})

describe('the request wrappers', () => {
  it('pass a request through for a language with no lines', () => {
    expect(withProseLanguage(request, 'en')).toBe(request)
    expect(withLedgerLanguage(request, 'en')).toBe(request)
  })

  it('ride the wording at the end of the system, the user untouched', () => {
    const told = withProseLanguage(request, 'pt-br')
    expect(told.system).toBe(`RITA\n\n${PT_LINES.join('\n')}`)
    expect(told.user).toBe(request.user)
    expect(withLedgerLanguage(request, 'pt-br').system).toBe(
      `RITA\n\n${[...PT_LINES, LEDGER_LINE].join('\n')}`
    )
  })
})

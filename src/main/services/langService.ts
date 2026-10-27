import { readFileSync } from 'fs'
import { mkdir, readFile, writeFile } from 'fs/promises'
import { dirname } from 'path'
import { appError, messageOf } from '@shared/errors'
import { isLanguageCode, LANG_PACK_MAX_BYTES, parseLangPack } from '@shared/langPack'
import { getActiveLangPath, getLangPackPath, getShippedLangPackPath } from '../paths'

/**
 * The translation packs: one file per language, either the one a build ships under
 * `assets/lang`, or the one a player or a mod has put under `/data/lang`, which wins. Read
 * here and nowhere else; the app never writes one — the only thing it writes is the one-word
 * file naming the language a boot reads, so the boot's own read can be synchronous.
 */

/**
 * A pack's bytes as its record of translated lines, or the error that says why they are not:
 * a size a swapped-in file cannot balloon the read past, then JSON, then the shape `t()` reads.
 */
function parsePackBytes(bytes: Buffer, path: string): Record<string, string> {
  if (bytes.byteLength > LANG_PACK_MAX_BYTES) {
    throw appError(
      'LANG_PACK_TOO_LARGE',
      'The language pack is too large to read.',
      `${path} spans ${bytes.byteLength} bytes`
    )
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(bytes.toString('utf8'))
  } catch (err) {
    throw appError(
      'LANG_PACK_MALFORMED',
      'The language pack is not valid JSON.',
      `${path}: ${messageOf(err)}`
    )
  }
  const pack = parseLangPack(parsed)
  if (pack === null) {
    throw appError(
      'LANG_PACK_MALFORMED',
      'The language pack is not a record of translated lines.',
      path
    )
  }
  return pack
}

/**
 * `lang:read` — the pack for `code`, or null where none is installed. A file that cannot be
 * read, or is not a record of translated lines, is an error the caller warns over and
 * continues past in English, not one the boot dies on; a language with no pack at all is
 * untranslated, not broken.
 */
export async function readLangPack(code: string): Promise<Record<string, string> | null> {
  if (!isLanguageCode(code)) {
    throw appError('LANG_PACK_CODE_INVALID', 'That language is not one this build knows.', code)
  }
  for (const path of [getLangPackPath(code), getShippedLangPackPath(code)]) {
    let bytes: Buffer
    try {
      bytes = await readFile(path)
    } catch (err) {
      const errno = (err as NodeJS.ErrnoException).code
      // A root holding no pack for it is the next root's to answer, not a failure.
      if (errno === 'ENOENT' || errno === 'ENOTDIR') continue
      throw appError(
        'LANG_PACK_UNREADABLE',
        'Could not read the language pack.',
        `${path}: ${messageOf(err)}`
      )
    }
    return parsePackBytes(bytes, path)
  }
  // No pack anywhere: the English the game is written in shows through every line of it.
  return null
}

/**
 * `lang:use` — remembers `code` as the language the next boot reads its pack from. The
 * renderer writes it whenever a choice moves; the boot's synchronous read, below, answers it.
 */
export async function writeActiveLang(code: string): Promise<void> {
  if (!isLanguageCode(code)) {
    throw appError('LANG_PACK_CODE_INVALID', 'That language is not one this build knows.', code)
  }
  await mkdir(dirname(getActiveLangPath()), { recursive: true })
  await writeFile(getActiveLangPath(), `${code}\n`)
}

/**
 * `lang:bootSync` — the pack behind the language the last session named, or null where none
 * was named or nothing could be read. The one synchronous call in the app: it answers before
 * any screen's module evaluates — the label tables and the authored content's constants are
 * module-level, and what `t()` reads at import time is what they keep — so nothing here is
 * allowed to throw: a boot continues in English, with a word in the log.
 */
export function readBootPack(): Record<string, string> | null {
  let code: string
  try {
    code = readFileSync(getActiveLangPath(), 'utf8').trim()
  } catch {
    // Nothing named: the game's own English, the state it ships in.
    return null
  }
  if (!isLanguageCode(code)) return null
  try {
    for (const path of [getLangPackPath(code), getShippedLangPackPath(code)]) {
      let bytes: Buffer
      try {
        bytes = readFileSync(path)
      } catch (err) {
        const errno = (err as NodeJS.ErrnoException).code
        if (errno === 'ENOENT' || errno === 'ENOTDIR') continue
        throw err
      }
      return parsePackBytes(bytes, path)
    }
  } catch (err) {
    console.warn('[lang] the boot pack could not be read; the app starts in English.', err)
  }
  return null
}

# Tradução PT-BR

An independent, anytime mod, off until the player turns it on. On, and Portuguese picked, it
tells the model, in Brazilian Portuguese wording tested in game by the **VenusTraining** project
(v0.4.0), to write every line of the game's generated prose as natural, idiomatic Brazilian
Portuguese: scenes, DMs, status posts, the girls texting first, the ledger's memories and plans,
and character generation. Names, charKeys, places, emotions, danbooru tags and enum tokens stay
exactly as the prompt gives them, in English — the values the schema and the code depend on are
never translated.

The language is the mod's own choice on the **Mods** screen: an option group, **Idioma**, with
**Português (Brasil)** picked and **English** beside it. English is told nothing — the requests
pass through as the game wrote them, as they also do while the mod is off. The choice is read
as each hook is asked, so the next generation follows a change at once.

## Where the wording rides

Every call the build hands to its mods is told the language at the **end of its system**, where
VenusTraining had the wording ride and a cloud model holds it:

- `requests.scene` — a scene with a cast or alone, its continuation and its closing.
- `requests.dm` — her reply in a DM thread, a regenerated one by the same builder.
- `requests['slot-intro']` — the slot's opening: its narration, the status posts and the girls
  texting first, one call.
- `requests.ledger` — the ledger, with the memory shape: every memory calls the reader "o
  leitor" in the third person, never "você", and his things are "seu" and "sua".

Character generation hands its mods lines only, so its wording rides in the **user block**
(`prompts.character`), above the pose and expression enums the lines hold to the schema's own
tokens.

Lines and fields from other mods sum into the same requests, so content other mods add to
these calls comes out in Portuguese too.

## What stays English

The mod translates what the build hands over; the rest keeps writing in English until hooks
exist for it (new hooks go into `core`, beside the old ones, as `MODDING.md` says):

- The **text ledger** after a day of texting: the memories a thread leaves her, and the events.
- **Secrets** a girl tells, **occasions**, **quizzes**, **class factoids**, the girls'
  **profiles**, and the **meet-up classifier** that judges a thread's exchanges.
- **Bunnybot**, **graduation**, the stranger posts and **ending posts**, cold tips and the
  spring-break and feed randoms.
- The game's own writing around the model: the **interface** (this mod translates no UI), the
  **first day's script**, the **lorebook** and the other author-led blocks that feed the model.
- The player's **custom persona**, if he wrote one, feeds the model as he wrote it.

Nothing is rewritten retroactively: a memory, post or scene saved in one language stays in it,
and the model follows the new language for what it writes next. Switching the mod off (or the
language to English) leaves every save as it is.

## Implementation map

- `src/shared/traducaoPtbr.ts`: the mod's ids — the switch, the option group and its two
  languages — and `languageOf`, the one rule that reads the picked language off the switches.
- `src/shared/modEntries/traducao-ptbr.ts`: the mod definition, its texts written for the
  players it is for, in Portuguese.
- `src/renderer/prompts/languageDirective.ts`: the language lines, preserved byte for byte from
  VenusTraining, and the request wrappers that carry them at the end of a system.
- `src/renderer/modEntries/traducao-ptbr.ts`: the hooks — the four request spots, and
  character generation's lines.
- `test/traducaoPtbr.test.ts`: the shipped shape, the choice and its default, the exact wording,
  and the pass-through for English.

## Verification

`npm run typecheck` and `npm test` cover the above. What they cannot: the prose itself — that
takes a live model (`npm run dev`, an API key in `data/settings.json`), reading a scene, a DM
thread, the slot's opening and the ledger's memories in Portuguese while the names, keys and
tags stay English, and the same in English with the language picked back.

## Registration on core 0.5.0

- `src/shared/modEntries/traducao-ptbr.ts` supplies the mod definition.
- `src/renderer/modEntries/traducao-ptbr.ts` loads the hooks automatically at boot.

The stable ids (`traducao-ptbr`, `idioma`, `pt-br`, `en`) are written to `data/mods.json` and
never change once shipped. Merge framework updates from `core` into this mod branch; resolve
conflicts with `main` on a separate `integrate/traducao-ptbr` branch.

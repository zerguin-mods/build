# Tradução PT-BR

An independent, anytime mod, off until the player turns it on. On, and Portuguese picked, it
tells the model, in Brazilian Portuguese wording tested in game by the **VenusTraining** project
(v0.4.0), to write every line of the game's generated prose as natural, idiomatic Brazilian
Portuguese: scenes, DMs, status posts, the girls texting first, the ledger's memories and plans,
and character generation. The same choice draws the app itself: the PT-BR pack this build ships
under `assets/lang` is read in behind the mod's switch, so the interface follows the prose.
Names, charKeys, places, emotions, danbooru tags and enum tokens stay exactly as the prompt
gives them, in English — the values the schema and the code depend on are never translated.

The language is the mod's own choice on the **Mods** screen: an option group, **Idioma**, with
**Português (Brasil)** picked and **English** beside it. English is told nothing — the requests
pass through as the game wrote them, and the app draws in its own English, as they also do
while the mod is off. The choice is read as each hook is asked, and the app remounts onto the
pack behind a change, so the next generation and the standing screen both follow at once.

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

## The interface

The game's own translation framework wraps every player-read line at build time in a `t()`
call whose key is the English line itself, and reads packs from `assets/lang` (what a build
ships) and `data/lang` (what a player or a mod puts there, which wins). This mod ships the
pack and wires the choice: its entry, loaded at boot, follows the mods store and switches the
lang store to the picked language, and the store's version remounts the app so a standing
screen redresses. A line with no pack entry reads as it always has, so a missing or stale
translation falls back to English, never breaks. The catalog itself — 1843 lines, VenusTraining's
proven 1676 plus this build's new screens, the authored opening and the feed's stranger
posts — lives in and is maintained from the **ptbr-pack**; this copy is synced from it.

What the framework leaves English on purpose: the browser build hosts no packs; an error code
shown raw; a few code-shaped labels (key names, element names) the transform wraps but a
translation must not answer; and the date spliced into the authored opening's first line,
which is formatted English — everything else of that line translates around it.

The module-level constants — the views' label tables, the welcome lines, the stranger
posts — cannot wait for a pack an asynchronous read brings: they evaluate `t()` once, at
import. The boot answers this: `main.tsx` makes one synchronous call before any screen's
module is imported, against the one-word language `lang:use` writes under
`/data/lang/active`, so every constant evaluates in the language the last session chose. A
language change mid-session redresses the screens at once and is remembered for the next
boot; the constants take the new language when the app next launches.

## What stays English

The mod translates what the build hands over; the rest keeps writing in English until hooks
exist for it (new hooks go into `core`, beside the old ones, as `MODDING.md` says):

- The **text ledger** after a day of texting: the memories a thread leaves her, and the events.
- **Secrets** a girl tells, **occasions**, **quizzes**, **class factoids**, the girls'
  **profiles**, and the **meet-up classifier** that judges a thread's exchanges.
- **Bunnybot**, **graduation**, the stranger posts' neighbours among the authored blocks, and
  the **ending posts**.
- The game's own writing that feeds the model: the **lorebook**, the lines a prompt is told
  (a cold, the orientation premise) and the other author-led blocks — English feeding the
  model is by design, and the prose still comes out in Portuguese.
- The player's **custom persona**, if he wrote one, feeds the model as he wrote it.

Nothing is rewritten retroactively: a memory, post or scene saved in one language stays in it,
and the model follows the new language for what it writes next. Switching the mod off (or the
language to English) leaves every save as it is.

## Implementation map

- `src/shared/traducaoPtbr.ts`: the mod's ids — the switch, the option group and its two
  languages — kept a leaf, so the entry that names it can be glob-loaded by `mods.ts`.
- `src/shared/modEntries/traducao-ptbr.ts`: the mod definition, its texts written for the
  players it is for, in Portuguese.
- `src/renderer/prompts/languageDirective.ts`: the language lines, preserved byte for byte from
  VenusTraining, and the request wrappers that carry them at the end of a system.
- `src/renderer/modEntries/traducao-ptbr.ts`: the hooks — the four request spots and
  character generation's lines — and the boot wiring that follows the mods store into the
  lang store, the interface onto the picked pack.
- `assets/lang/pt-BR.json`: the catalog this build ships, synced from the ptbr-pack.
- `test/traducaoPtbr.test.ts`: the shipped shape, the choice and its default, the exact wording,
  and the pass-through for English.

## Verification

`npm run typecheck` and `npm test` cover the above. What they cannot: the prose itself — that
takes a live model (`npm run dev`, an API key in `data/settings.json`), reading a scene, a DM
thread, the slot's opening and the ledger's memories in Portuguese while the names, keys and
tags stay English, and the same in English with the language picked back.

## Registration on core 0.5.0

- `src/shared/modEntries/traducao-ptbr.ts` supplies the mod definition.
- `src/renderer/modEntries/traducao-ptbr.ts` loads the hooks and the interface wiring
  automatically at boot.
- The interface half rides on the **i18n framework** (`framework/i18n`: the `t()` transform,
  the pack read, the remount) — that has to be in `core` before this mod's pull request can
  carry its wiring; the prose half needs nothing but the hooks `core` has always had.

The stable ids (`traducao-ptbr`, `idioma`, `pt-br`, `en`) are written to `data/mods.json` and
never change once shipped. Merge framework updates from `core` into this mod branch; resolve
conflicts with `main` on a separate `integrate/traducao-ptbr` branch.

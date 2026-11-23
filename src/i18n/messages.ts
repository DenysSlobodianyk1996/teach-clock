import uk from './uk.ts'
import en from './en.ts'
import de from './de.ts'
import type { Locale } from './locales.ts'

export type MessageSchema = typeof uk

/** The interface text of every language on the list; a listed language without text fails to build. */
export const MESSAGES: Record<Locale, MessageSchema> = { en, uk, de }

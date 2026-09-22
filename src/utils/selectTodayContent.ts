import { TODAY_AFFIRMATIONS, TODAY_MICRO_ACTIONS } from '@/data/todayContent';
import type { CurrentNeed, Mood, SupportTone, UserGoal } from '@/types';

export interface TodaySelectionParams {
  goals: UserGoal[];
  currentNeed: CurrentNeed | null;
  tone: SupportTone | null;
  mood: Mood;
}

interface Taggable {
  text: string;
  goals: UserGoal[];
  needs: CurrentNeed[];
  tones: SupportTone[];
  moods: Mood[];
}

/**
 * Puntaje simple, no una coincidencia perfecta: cada criterio suma como mucho una vez,
 * así ningún ítem queda afuera solo por no calzar en todas las etiquetas a la vez.
 */
function scoreItem(item: Taggable, params: TodaySelectionParams): number {
  let score = 0;
  if (params.goals.some((goal) => item.goals.includes(goal))) score += 3;
  if (params.currentNeed && item.needs.includes(params.currentNeed)) score += 3;
  if (params.tone && item.tones.includes(params.tone)) score += 2;
  if (item.moods.includes(params.mood)) score += 2;
  return score;
}

/**
 * Entre los de mejor puntaje, elige al azar (evita mostrar siempre lo mismo). `exclude` saca
 * del pool los textos ya usados; si eso deja el pool vacío (se agotaron las alternativas),
 * se cae de vuelta a considerar todos, así nunca devuelve nada. Nunca vacío.
 */
function pickBestScored<T extends Taggable>(items: T[], params: TodaySelectionParams, exclude: string[] = []): T {
  const pool = exclude.length > 0 ? items.filter((item) => !exclude.includes(item.text)) : items;
  const candidates = pool.length > 0 ? pool : items;

  const scored = candidates.map((item) => ({ item, score: scoreItem(item, params) }));
  const bestScore = Math.max(...scored.map((entry) => entry.score));
  const best = scored.filter((entry) => entry.score === bestScore).map((entry) => entry.item);

  return best[Math.floor(Math.random() * best.length)];
}

export function selectAffirmation(params: TodaySelectionParams) {
  return pickBestScored(TODAY_AFFIRMATIONS, params);
}

/** `excludeTexts` evita repetir microacciones ya mostradas hoy al pedir "Otro paso", mientras haya alternativas. */
export function selectMicroAction(params: TodaySelectionParams, excludeTexts: string[] = []) {
  return pickBestScored(TODAY_MICRO_ACTIONS, params, excludeTexts);
}

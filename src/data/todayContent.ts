import type { Category, CurrentNeed, Mood, SupportTone, UserGoal } from '@/types';

export interface TodayAffirmation {
  text: string;
  goals: UserGoal[];
  needs: CurrentNeed[];
  tones: SupportTone[];
  moods: Mood[];
}

export interface TodayMicroAction {
  text: string;
  goals: UserGoal[];
  needs: CurrentNeed[];
  tones: SupportTone[];
  moods: Mood[];
}

/**
 * Para poder reusar "guardar" (favoritos) y "compartir" tal como ya funcionan hoy, cada
 * afirmación V2 necesita una Category del sistema original. Se deriva del primer goal de
 * cada afirmación a través de este mapa, en vez de tipearla a mano en cada entrada.
 */
export const GOAL_TO_CATEGORY: Record<UserGoal, Category> = {
  amor_propio: 'amor',
  relaciones: 'amor',
  disfrutar: 'amor',
  confianza: 'proposito',
  disciplina: 'proposito',
  proposito: 'proposito',
  estudio_carrera: 'proposito',
  finanzas: 'dinero',
  bienestar_movimiento: 'salud',
  calma: 'calma',
};

export function categoryForAffirmation(affirmation: TodayAffirmation): Category {
  return GOAL_TO_CATEGORY[affirmation.goals[0]] ?? 'calma';
}

/**
 * DailyEntry solo guarda el texto de la afirmación (no el objeto completo), así que para
 * favoritear/compartir la entrada de un día ya guardado hace falta volver a encontrar su
 * categoría buscando el texto en la biblioteca V2.
 */
export function findAffirmationCategory(text: string): Category {
  const match = TODAY_AFFIRMATIONS.find((item) => item.text === text);
  return match ? categoryForAffirmation(match) : 'calma';
}

export const TODAY_AFFIRMATIONS: TodayAffirmation[] = [
  {
    text: 'No necesitás sentirte segura para empezar. La confianza también se construye haciendo.',
    goals: ['confianza'],
    needs: ['confianza', 'motivacion'],
    tones: ['directa', 'positiva'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Podés dudar y avanzar igual. Una cosa no cancela la otra.',
    goals: ['confianza'],
    needs: ['confianza'],
    tones: ['reflexiva', 'suave'],
    moods: ['low', 'very_low'],
  },
  {
    text: 'Cada vez que hacés algo incómodo, tu confianza se entera de que puede confiar en vos.',
    goals: ['confianza', 'disciplina'],
    needs: ['confianza', 'motivacion'],
    tones: ['positiva', 'directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'No hace falta sentirte lista. Hace falta empezar.',
    goals: ['confianza', 'disciplina'],
    needs: ['motivacion'],
    tones: ['directa'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'La constancia no es hacer mucho un día. Es no abandonar los días comunes.',
    goals: ['disciplina'],
    needs: ['constancia'],
    tones: ['reflexiva', 'directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'No necesitás tener ganas para empezar. Las ganas casi siempre aparecen después.',
    goals: ['disciplina'],
    needs: ['motivacion', 'constancia'],
    tones: ['directa'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Un día salteado no borra el camino que ya recorriste.',
    goals: ['disciplina'],
    needs: ['constancia', 'contencion'],
    tones: ['suave', 'reflexiva'],
    moods: ['low', 'very_low'],
  },
  {
    text: 'Elegir lo mismo otra vez, aunque no tengas ganas, es la disciplina real.',
    goals: ['disciplina'],
    needs: ['constancia'],
    tones: ['directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'No todo necesita resolverse hoy. Podés soltar un poco y seguir respirando.',
    goals: ['calma'],
    needs: ['tranquilidad', 'contencion'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Tu calma no depende de que todo esté en orden a tu alrededor.',
    goals: ['calma'],
    needs: ['tranquilidad'],
    tones: ['reflexiva', 'suave'],
    moods: ['neutral'],
  },
  {
    text: 'Podés estar bien aunque no tengas todas las respuestas todavía.',
    goals: ['calma', 'proposito'],
    needs: ['tranquilidad', 'claridad'],
    tones: ['suave', 'reflexiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Respirar más lento no resuelve todo, pero te devuelve un poco de espacio.',
    goals: ['calma'],
    needs: ['tranquilidad'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Te podés hablar con la misma paciencia que le tenés a alguien que querés.',
    goals: ['amor_propio'],
    needs: ['contencion'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'No tenés que ganarte el descanso. Ya lo merecés por existir, no por producir.',
    goals: ['amor_propio'],
    needs: ['contencion', 'tranquilidad'],
    tones: ['suave', 'reflexiva'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Equivocarte no te saca del lugar de alguien que lo está intentando.',
    goals: ['amor_propio', 'disciplina'],
    needs: ['contencion'],
    tones: ['suave'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Cuidarte no es egoísmo. Es lo que te permite seguir sosteniendo lo demás.',
    goals: ['amor_propio'],
    needs: ['contencion', 'tranquilidad'],
    tones: ['reflexiva', 'suave'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'No necesitás tener todo resuelto para dar el próximo paso.',
    goals: ['proposito'],
    needs: ['claridad', 'motivacion'],
    tones: ['directa', 'reflexiva'],
    moods: ['neutral', 'low'],
  },
  {
    text: 'Tu propósito no tiene que ser gigante hoy. Alcanza con que sea honesto.',
    goals: ['proposito'],
    needs: ['claridad'],
    tones: ['reflexiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Podés cambiar de rumbo sin que eso signifique que fallaste.',
    goals: ['proposito'],
    needs: ['claridad', 'contencion'],
    tones: ['suave', 'reflexiva'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Lo que hacés hoy, aunque parezca chico, también es parte del camino.',
    goals: ['proposito', 'disciplina'],
    needs: ['motivacion', 'constancia'],
    tones: ['positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'No hace falta tener ganas todo el tiempo. Alcanza con elegir una vez más.',
    goals: ['disciplina', 'proposito'],
    needs: ['motivacion'],
    tones: ['directa'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'La energía vuelve más rápido cuando dejás de exigirte tenerla todo el tiempo.',
    goals: ['bienestar_movimiento', 'calma'],
    needs: ['energia', 'tranquilidad'],
    tones: ['suave', 'reflexiva'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'A veces avanzar es simplemente dejar de darle vueltas a lo mismo.',
    goals: ['proposito', 'disciplina'],
    needs: ['claridad'],
    tones: ['directa', 'reflexiva'],
    moods: ['neutral'],
  },
  {
    text: 'No tenés que saber todo el camino, solo el próximo paso concreto.',
    goals: ['estudio_carrera', 'proposito'],
    needs: ['claridad', 'motivacion'],
    tones: ['directa'],
    moods: ['neutral', 'low'],
  },
  {
    text: 'Cada decisión pequeña con tu plata también construye tu tranquilidad futura.',
    goals: ['finanzas'],
    needs: ['tranquilidad', 'constancia'],
    tones: ['reflexiva', 'positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Mover el cuerpo, aunque sea un poco, también es una forma de cuidarte.',
    goals: ['bienestar_movimiento'],
    needs: ['energia'],
    tones: ['positiva', 'directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Pedir ayuda no te hace menos capaz. Te hace menos sola.',
    goals: ['relaciones', 'amor_propio'],
    needs: ['contencion'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'También merecés disfrutar lo que ya construiste, no solo perseguir lo que falta.',
    goals: ['disfrutar', 'amor_propio'],
    needs: ['tranquilidad'],
    tones: ['reflexiva', 'positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Este buen momento también cuenta. No hace falta esperar una crisis para reconocerte.',
    goals: ['amor_propio', 'disfrutar'],
    needs: ['general'],
    tones: ['positiva'],
    moods: ['good', 'great'],
  },
  {
    text: 'Cuando las cosas fluyen, también vale la pena notarlo y disfrutarlo.',
    goals: ['disfrutar'],
    needs: ['general'],
    tones: ['positiva'],
    moods: ['good', 'great'],
  },
  {
    text: 'Hoy no hace falta que estés bien. Alcanza con que estés acá.',
    goals: ['calma', 'amor_propio'],
    needs: ['contencion'],
    tones: ['suave'],
    moods: ['very_low'],
  },
  {
    text: 'Los días difíciles también pasan, aunque ahora no lo parezca.',
    goals: ['calma', 'amor_propio'],
    needs: ['contencion', 'tranquilidad'],
    tones: ['suave', 'reflexiva'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'No te compares con quien fuiste ayer con más energía. Hoy jugás con lo que tenés hoy.',
    goals: ['amor_propio', 'disciplina'],
    needs: ['contencion', 'constancia'],
    tones: ['directa', 'suave'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Un paso chico hoy sigue siendo un paso. Eso ya es avanzar.',
    goals: ['disciplina', 'proposito'],
    needs: ['motivacion', 'constancia', 'general'],
    tones: ['directa', 'positiva'],
    moods: ['neutral', 'good', 'low'],
  },
];

export const TODAY_MICRO_ACTIONS: TodayMicroAction[] = [
  {
    text: 'Hacé durante 10 minutos eso que venís postergando.',
    goals: ['disciplina', 'proposito'],
    needs: ['motivacion', 'constancia'],
    tones: ['directa'],
    moods: ['neutral', 'low', 'good'],
  },
  {
    text: 'Escribí en una frase qué es lo único que necesitás hoy.',
    goals: ['proposito', 'calma'],
    needs: ['claridad'],
    tones: ['reflexiva'],
    moods: ['neutral', 'low'],
  },
  {
    text: 'Tomá agua y quedate 2 minutos sin hacer nada más.',
    goals: ['calma', 'bienestar_movimiento'],
    needs: ['tranquilidad', 'energia'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Mandale un mensaje a alguien que te hace bien, aunque sea corto.',
    goals: ['relaciones', 'amor_propio'],
    needs: ['contencion'],
    tones: ['suave', 'positiva'],
    moods: ['very_low', 'low', 'neutral'],
  },
  {
    text: 'Ordená un solo rincón chico de tu espacio, nada más.',
    goals: ['disciplina', 'calma'],
    needs: ['claridad', 'tranquilidad'],
    tones: ['directa', 'suave'],
    moods: ['neutral', 'low'],
  },
  {
    text: 'Anotá 3 cosas que ya hiciste bien esta semana, por chicas que sean.',
    goals: ['amor_propio', 'confianza'],
    needs: ['confianza', 'contencion'],
    tones: ['positiva', 'reflexiva'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Salí a caminar 10 minutos sin el celular.',
    goals: ['bienestar_movimiento', 'calma'],
    needs: ['energia', 'tranquilidad'],
    tones: ['suave', 'directa'],
    moods: ['neutral', 'low', 'good'],
  },
  {
    text: 'Elegí una sola tarea pendiente y hacé el primer paso, nada más.',
    goals: ['disciplina', 'proposito'],
    needs: ['claridad', 'motivacion'],
    tones: ['directa'],
    moods: ['neutral', 'low'],
  },
  {
    text: 'Respirá hondo 5 veces, contando hasta 4 al inhalar y al exhalar.',
    goals: ['calma'],
    needs: ['tranquilidad'],
    tones: ['suave'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Revisá un gasto chico que podrías ajustar esta semana.',
    goals: ['finanzas'],
    needs: ['claridad', 'constancia'],
    tones: ['directa', 'reflexiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Decile a alguien, con honestidad, cómo estás hoy.',
    goals: ['relaciones', 'amor_propio'],
    needs: ['contencion'],
    tones: ['reflexiva', 'suave'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Guardá 5 minutos para no hacer nada productivo, a propósito.',
    goals: ['calma', 'disfrutar'],
    needs: ['tranquilidad'],
    tones: ['suave', 'positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Repasá 10 minutos de eso que estás estudiando o aprendiendo.',
    goals: ['estudio_carrera'],
    needs: ['constancia', 'motivacion'],
    tones: ['directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Armá una lista de 3 pasos para lo que te preocupa, sin resolverlo todavía.',
    goals: ['proposito', 'calma'],
    needs: ['claridad', 'tranquilidad'],
    tones: ['reflexiva'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Estirate 5 minutos, despacio, prestando atención al cuerpo.',
    goals: ['bienestar_movimiento', 'calma'],
    needs: ['energia', 'tranquilidad'],
    tones: ['suave'],
    moods: ['very_low', 'low', 'neutral'],
  },
  {
    text: 'Elegí un límite chico que podés poner hoy, y sostenelo.',
    goals: ['amor_propio', 'confianza'],
    needs: ['confianza'],
    tones: ['directa'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Hacé algo que disfrutes, aunque sean 10 minutos, sin culpa.',
    goals: ['disfrutar', 'amor_propio'],
    needs: ['tranquilidad', 'general'],
    tones: ['positiva', 'suave'],
    moods: ['neutral', 'good', 'great'],
  },
  {
    text: 'Escribí una sola cosa por la que hoy estás agradecida.',
    goals: ['amor_propio', 'disfrutar'],
    needs: ['general'],
    tones: ['positiva', 'reflexiva'],
    moods: ['neutral', 'good', 'great'],
  },
  {
    text: 'Definí a qué hora vas a parar de trabajar hoy, y avisá si hace falta.',
    goals: ['disciplina', 'calma'],
    needs: ['tranquilidad', 'constancia'],
    tones: ['directa'],
    moods: ['neutral'],
  },
  {
    text: 'Llamá o escribile a alguien de tu familia solo para saludar.',
    goals: ['relaciones'],
    needs: ['contencion'],
    tones: ['suave', 'positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Elegí una sola cosa de tu lista y tachá el resto por hoy.',
    goals: ['disciplina', 'calma'],
    needs: ['claridad', 'tranquilidad'],
    tones: ['directa'],
    moods: ['low', 'neutral'],
  },
  {
    text: 'Prendé música que te guste y quedate 3 minutos solo escuchando.',
    goals: ['disfrutar', 'calma'],
    needs: ['tranquilidad', 'energia'],
    tones: ['suave', 'positiva'],
    moods: ['very_low', 'low', 'neutral'],
  },
  {
    text: 'Revisá tu agenda de mañana y elegí una sola prioridad.',
    goals: ['disciplina', 'proposito'],
    needs: ['claridad', 'constancia'],
    tones: ['directa', 'reflexiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Hacé 5 minutos de esa rutina de movimiento que te gusta.',
    goals: ['bienestar_movimiento'],
    needs: ['energia', 'constancia'],
    tones: ['directa', 'positiva'],
    moods: ['neutral', 'good'],
  },
  {
    text: 'Mirate al espejo y decite algo que le dirías a una amiga hoy.',
    goals: ['amor_propio'],
    needs: ['contencion'],
    tones: ['suave', 'reflexiva'],
    moods: ['very_low', 'low'],
  },
  {
    text: 'Guardá el celular 15 minutos y hacé algo con las manos.',
    goals: ['calma', 'disfrutar'],
    needs: ['tranquilidad'],
    tones: ['suave'],
    moods: ['neutral', 'low'],
  },
];

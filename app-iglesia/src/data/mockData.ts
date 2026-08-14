export interface ServiceSchedule {
  id: string;
  name: string;
  day: string;
  time: string;
  description?: string;
  iconName?: 'book' | 'church' | 'flame' | 'heart';
}

export interface MaterialMock {
  id: string;
  title: string;
  category: string;
  fileType: string;
  size: string;
  date: string;
  author: string;
  downloads: number;
}

export interface BibleCourse {
  id: string;
  title: string;
  description: string;
  lessons: string;
  level: string;
  badge: string;
  icon: string;
}

export interface HymnMock {
  number: number;
  title: string;
  category: string;
  key: string;
  lyrics: string;
}

export interface LessonDay {
  day: string;
  topic: string;
  content: string;
}

export interface SabbathLesson {
  quarter: string;
  lessonNumber: number;
  title: string;
  memoryVerse: string;
  days: LessonDay[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'Especial' | 'Clubes' | 'Espiritual' | 'Cumpleaños' | string;
  time: string;
}

// ----------------------------------------------------------------------
// 1. HORARIOS DE SERVICIOS SINCRONIZADOS (Home, Footer y Boletín)
// ----------------------------------------------------------------------
export const SERVICE_SCHEDULES: ServiceSchedule[] = [
  {
    id: 'escuela-sabatica',
    name: 'Escuela Sabática',
    day: 'Sábados',
    time: '09:30',
    description: 'Estudio interactivo de la lección y confraternización.',
    iconName: 'book',
  },
  {
    id: 'culto-divino',
    name: 'Culto Divino',
    day: 'Sábados',
    time: '11:00',
    description: 'Momento central de adoración, alabanza y sermón bíblico.',
    iconName: 'church',
  },
  {
    id: 'sociedad-jovenes',
    name: 'Sociedad de Jóvenes (JA)',
    day: 'Sábados',
    time: '18:00',
    description: 'Espacio dinámico de alabanza y testimonio juvenil.',
    iconName: 'flame',
  },
  {
    id: 'culto-oracion',
    name: 'Culto de Oración',
    day: 'Miércoles',
    time: '19:30',
    description: 'Intercesión por familias, necesidades y estudio de la Palabra.',
    iconName: 'heart',
  },
];

// ----------------------------------------------------------------------
// 2. MATERIALES INICIALES
// ----------------------------------------------------------------------
export const INITIAL_MATERIALS: MaterialMock[] = [
  {
    id: 'm1',
    title: 'Guía de Escuela Sabática Adultos - 3er Trimestre',
    category: 'Escuela Sabática',
    fileType: 'PDF',
    size: '4.2 MB',
    date: '10 Ago 2026',
    author: 'Ministerio de Escuela Sabática',
    downloads: 142,
  },
  {
    id: 'm2',
    title: 'Boletín Informativo y Anuncios Semanales',
    category: 'Boletines',
    fileType: 'PDF',
    size: '1.1 MB',
    date: '22 Ago 2026',
    author: 'Secretaría de Iglesia',
    downloads: 89,
  },
];

// ----------------------------------------------------------------------
// 3. CURSOS BÍBLICOS
// ----------------------------------------------------------------------
export const BIBLE_COURSES: BibleCourse[] = [
  {
    id: 'c1',
    title: 'La Fe de Jesús',
    description: 'Estudio profundo de las 20 verdades fundamentales de la Biblia.',
    lessons: '20 Lecciones',
    level: 'Principiante / Intermedio',
    badge: 'Popular',
    icon: '📖',
  },
  {
    id: 'c2',
    title: 'Profecías de Daniel y Apocalipsis',
    description: 'Símbolos proféticos del tiempo del fin y la gloriosa esperanza.',
    lessons: '24 Lecciones',
    level: 'Avanzado',
    badge: 'Profundo',
    icon: '🛡️',
  },
];

// ----------------------------------------------------------------------
// 4. HIMNARIO
// ----------------------------------------------------------------------
export const INITIAL_HYMNS: HymnMock[] = [
  {
    number: 1,
    title: 'Cantad al Señor',
    category: 'Alabanza y Adoración',
    key: 'Do Mayor',
    lyrics: `Cantad al Señor un cántico nuevo,\nCantad al Señor toda la tierra.`,
  },
  {
    number: 186,
    title: 'Amanece el Santo Sábado',
    category: 'El Sábado',
    key: 'Fa Mayor',
    lyrics: `Amanece el santo Sábado de Dios,\nLleno de paz, de luz y celestial amor.`,
  },
];

// ----------------------------------------------------------------------
// 5. LECCIÓN DE ESCUELA SABÁTICA
// ----------------------------------------------------------------------
export const SABBATH_LESSON_WEEK: SabbathLesson = {
  quarter: '3er Trimestre 2026',
  lessonNumber: 8,
  title: 'La Fe que Vence al Mundo y Permanecer en Cristo',
  memoryVerse:
    '"Porque todo lo que es nacido de Dios vence al mundo; y esta es la victoria que ha vencido al mundo, nuestra fe." 1 Juan 5:4',
  days: [
    {
      day: 'Sábado',
      topic: 'Introducción a la lección semanal',
      content:
        'La fe verdadera es un principio activo fundado en las promesas de Dios.',
    },
    {
      day: 'Domingo',
      topic: 'Venciendo el Temor y la Incertidumbre',
      content:
        'Encontrando en la oración el valor para sostenerse en medio de las pruebas.',
    },
  ],
};

// ----------------------------------------------------------------------
// 6. CALENDARIO DE EVENTOS
// ----------------------------------------------------------------------
export const CHURCH_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev1',
    title: 'Sábado de Visita e Impacto Comunitario',
    date: '2026-08-22',
    type: 'Especial',
    time: '11:30 AM',
  },
  {
    id: 'ev2',
    title: 'Camporí de Conquistadores Hualqui',
    date: '2026-08-28',
    type: 'Clubes',
    time: 'Todo el día',
  },
  {
    id: 'ev3',
    title: 'Semana de Oración de la Mujer',
    date: '2026-09-05',
    type: 'Espiritual',
    time: '19:30 PM',
  },
  {
    id: 'ev4',
    title: 'Cumpleaños Hna. Carmen Reyes',
    date: '2026-08-25',
    type: 'Cumpleaños',
    time: 'Día Completo',
  },
  {
    id: 'ev5',
    title: 'Cumpleaños Pr. Alejandro Silva',
    date: '2026-08-30',
    type: 'Cumpleaños',
    time: 'Día Completo',
  },
];
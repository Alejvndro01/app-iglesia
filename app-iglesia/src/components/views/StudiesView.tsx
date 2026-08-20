'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  BookOpen, 
  CheckCircle2, 
  ShieldCheck, 
  Send, 
  RotateCcw, 
  Sparkles, 
  GraduationCap, 
  Phone, 
  MapPin, 
  Search,
  Check,
  Clock,
  Heart,
  Eye,
  X,
  Compass,
  Flame,
  Award
} from 'lucide-react';

export interface BibleCourseItem {
  id: string;
  title: string;
  badge: string;
  category: 'fundamentos' | 'profecia' | 'familia' | 'jovenes';
  level: string;
  lessons: string;
  duration: string;
  icon: string;
  description: string;
  syllabus: string[];
}

const EXTENDED_BIBLE_COURSES: BibleCourseItem[] = [
  {
    id: 'la-fe-de-jesus',
    title: 'La Fe de Jesús',
    badge: 'Fundamental',
    category: 'fundamentos',
    level: 'Iniciación a Intermedio',
    lessons: '20 Lecciones',
    duration: '10 Semanas',
    icon: '📖',
    description: 'El curso doctrinal clásico y completo. Aborda las grandes verdades de las Sagradas Escrituras: la salvación en Cristo, el perdón y el plan de redención.',
    syllabus: [
      'Lo que la Biblia enseña acerca de Dios',
      'Las Sagradas Escrituras como revelación divina',
      'El origen del pecado y la salvación por la fe',
      'La segunda venida de Cristo y las señales del fin',
      'El Santo Sábado bíblico y la ley moral'
    ]
  },
  {
    id: 'esperanza-viva',
    title: 'Esperanza Viva',
    badge: 'Contemporáneo',
    category: 'fundamentos',
    level: 'Básico',
    lessons: '14 Lecciones',
    duration: '7 Semanas',
    icon: '✨',
    description: 'Respuestas bíblicas directas y prácticas para las preguntas más profundas del ser humano en tiempos de crisis e incertidumbre.',
    syllabus: [
      '¿Por qué permite Dios el sufrimiento humano?',
      'Paz interior en medio de la ansiedad moderna',
      'La oración que transforma realidades',
      'La promesa de un nuevo amanecer para la humanidad'
    ]
  },
  {
    id: 'revelaciones-apocalipsis',
    title: 'Apocalipsis: Revelaciones de Esperanza',
    badge: 'Profecía',
    category: 'profecia',
    level: 'Avanzado',
    lessons: '24 Lecciones',
    duration: '12 Semanas',
    icon: '👑',
    description: 'Descifra los símbolos proféticos del último libro de la Biblia. Un mensaje de victoria final centrado en Jesucristo y el triunfo de su reino.',
    syllabus: [
      'Las 7 Iglesias y el mensaje para el tiempo del fin',
      'Los 7 Sellos y las 7 Trompetas históricas',
      'El conflicto entre el bien y el mal en Apocalipsis 12',
      'El mensaje de los tres ángeles (Apoc. 14)',
      'La Nueva Jerusalén y la restauración eterna'
    ]
  },
  {
    id: 'daniel-profecias',
    title: 'Daniel: El Futuro Revelado',
    badge: 'Profecía',
    category: 'profecia',
    level: 'Intermedio a Avanzado',
    lessons: '12 Lecciones',
    duration: '6 Semanas',
    icon: '🏛️',
    description: 'Estudio de las profecías de tiempo de Daniel: las grandes potencias mundiales, la estatua de Nabucodonosor y la purificación del santuario.',
    syllabus: [
      'La prueba de la fidelidad en Babilonia',
      'La estatua de Daniel 2 y los imperios universales',
      'El juicio investigador y el Santuario celestial',
      'Las 70 semanas y la profecía mesiánica'
    ]
  },
  {
    id: 'hogar-y-felicidad',
    title: 'Hogar y Matrimonio en Paz',
    badge: 'Familia',
    category: 'familia',
    level: 'Práctico Familiar',
    lessons: '8 Lecciones',
    duration: '4 Semanas',
    icon: '🏡',
    description: 'Principios bíblicos y herramientas emocionales para fortalecer los lazos de pareja, resolver desacuerdos y orientar la crianza con amor.',
    syllabus: [
      'El diseño original del matrimonio cristiano',
      'Comunicación efectiva y resolución sin rencor',
      'Crianza bíblica en tiempos hiperconectados',
      'El culto familiar como refugio del hogar'
    ]
  },
  {
    id: 'salud-y-bienestar',
    title: 'Salud Integral: Los 8 Remedios',
    badge: 'Estilo de Vida',
    category: 'familia',
    level: 'Salud y Prevención',
    lessons: '8 Lecciones',
    duration: '4 Semanas',
    icon: '🌿',
    description: 'Aprende los principios naturales de prevención y vitalidad que promueve la Biblia para cuidar la mente y el templo del cuerpo.',
    syllabus: [
      'Nutrición vegetariana y balanceada',
      'El poder restaurador del agua y el aire puro',
      'El descanso sabático y el sueño reparador',
      'La confianza en Dios y la salud emocional'
    ]
  },
  {
    id: 'fe-juvenil',
    title: 'Conexión Joven: Fe sin Filtros',
    badge: 'Juventud',
    category: 'jovenes',
    level: 'Juvenil / Universitario',
    lessons: '10 Lecciones',
    duration: '5 Semanas',
    icon: '🔥',
    description: 'Diseñado especialmente para adolescentes y universitarios. Diálogos abiertos sobre ciencia, identidad, propósito y toma de decisiones.',
    syllabus: [
      'Ciencia, creación y la existencia de Dios',
      'Encontrar mi propósito y vocación en la vida',
      'Relaciones de pareja, pureza y decisiones afectivas',
      'Cómo liderar e impactar mi entorno social'
    ]
  },
  {
    id: 'primeros-pasos-fe',
    title: 'Primeros Pasos con Jesús',
    badge: 'Iniciación',
    category: 'fundamentos',
    level: 'Básico',
    lessons: '6 Lecciones',
    duration: '3 Semanas',
    icon: '🌱',
    description: 'Guía introductoria y amigable para quienes nunca han leído la Biblia y desean aprender a orar y conocer el mensaje de los evangelios.',
    syllabus: [
      '¿Cómo empezar a leer la Biblia?',
      'Cómo hablar con Dios mediante la oración',
      'Jesús: El amigo que nunca falla',
      'Cómo formar parte de una comunidad de fe'
    ]
  }
];

interface StudiesViewProps {
  showToast: (msg: string) => void;
}

export function EstudiosBiblicosPageView({ showToast }: StudiesViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<BibleCourseItem>(EXTENDED_BIBLE_COURSES[0]);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewCourse, setPreviewCourse] = useState<BibleCourseItem | null>(null);
  
  // Campos del formulario
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+569');
  const [address, setAddress] = useState('');
  const [modality, setModality] = useState('Presencial en Templo');
  
  // Estados de verificación OTP
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Sanitizado estricto del prefijo chileno (+569XXXXXXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '');
    if (!val.startsWith('+569')) {
      val = '+569' + val.replace(/^\+?56?9?/, '');
    }
    if (val.length <= 12) {
      setPhone(val);
      setIsPhoneVerified(false);
      setOtpSent(false);
    }
  };

  // 1. Enviar código OTP por WhatsApp
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\+569\d{8}$/.test(cleanPhone)) {
      showToast('Ingresa un número válido con el formato +569XXXXXXXX');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar código OTP');

      setOtpSent(true);
      showToast('¡Código de verificación enviado por WhatsApp!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al solicitar el código');
    } finally {
      setOtpLoading(false);
    }
  };

  // 2. Verificar código y Registrar Solicitud
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      showToast('Por favor selecciona un curso bíblico de la lista.');
      return;
    }

    if (!fullName.trim()) {
      showToast('Ingresa tu nombre completo.');
      return;
    }

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      showToast('Ingresa el código de verificación de 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\s+/g, '');

      // Validación OTP en el backend
      if (!isPhoneVerified) {
        const verifyRes = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefono: cleanPhone, code: otpCode.trim() }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || 'El código ingresado es incorrecto o ha expirado');
        }
        setIsPhoneVerified(true);
      }

      // Guardar la solicitud del curso
      const payload = {
        curso: selectedCourse.title,
        nombre: fullName.trim(),
        telefono: cleanPhone,
        direccion: address.trim() || 'No especificada',
        modalidad: modality,
      };

      await apiClient.createSolicitudCurso(payload);

      setSubmitted(true);
      showToast('¡Solicitud verificada y guardada correctamente!');

      // Reset de campos
      setFullName('');
      setPhone('+569');
      setAddress('');
      setOtpCode('');
      setOtpSent(false);
      setIsPhoneVerified(false);
      setModality('Presencial en Templo');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = EXTENDED_BIBLE_COURSES.filter((c) => {
    const matchesFilter = 
      activeFilter === 'todos' || 
      c.category === activeFilter ||
      c.level.toLowerCase().includes(activeFilter.toLowerCase()) || 
      c.badge.toLowerCase().includes(activeFilter.toLowerCase());

    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. ENCABEZADO TIPO ACADEMY CON STATS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2DEC9] dark:border-slate-800 pb-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-[#C5D8CC]/60 dark:border-slate-700">
            <GraduationCap className="w-3.5 h-3.5" /> Escuela Bíblica Digital & Presencial Hualqui
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
            Descubre las verdades de la <span className="text-[#E0A96D] italic">Biblia</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
            Cursos 100% gratuitos, guiados a tu propio ritmo con acompañamiento de instructores bíblicos y envío de material impreso o digital.
          </p>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="flex flex-col gap-2 self-start md:self-auto w-full md:w-auto">
          {/* Buscador */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7C9885]" />
            <input
              type="text"
              placeholder="Buscar curso o tema..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#E8F0EA]/70 dark:bg-slate-800/80 rounded-2xl border border-[#C5D8CC]/60 dark:border-slate-700 overflow-x-auto max-w-full">
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'fundamentos', label: 'Fundamentos' },
              { id: 'profecia', label: 'Profecías' },
              { id: 'familia', label: 'Familia & Salud' },
              { id: 'jovenes', label: 'Jóvenes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#7C9885] text-white shadow-xs'
                    : 'text-[#526157] dark:text-slate-300 hover:text-[#2D3831]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT: CATÁLOGO ASIMÉTRICO (IZQUIERDA) & PANEL DE REGISTRO (DERECHA) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Catálogo de Cursos (Columna Izquierda - 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              1. Selecciona tu Curso
            </span>
            <span className="text-xs text-[#66756C] dark:text-slate-400 font-medium">
              {filteredCourses.length} cursos disponibles
            </span>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="py-16 text-center bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 p-8 space-y-2">
              <BookOpen className="w-8 h-8 text-[#7C9885] mx-auto opacity-50" />
              <p className="text-xs font-bold text-[#2D3831] dark:text-slate-200">No se encontraron cursos con ese filtro.</p>
              <button
                onClick={() => { setActiveFilter('todos'); setSearchQuery(''); }}
                className="text-xs font-semibold text-[#7C9885] dark:text-emerald-400 underline cursor-pointer"
              >
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredCourses.map((course) => {
                const isSelected = selectedCourse?.id === course.id;
                return (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourse(course)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 relative ${
                      isSelected
                        ? 'bg-white dark:bg-slate-800 border-[#7C9885] ring-2 ring-[#7C9885]/30 shadow-md scale-[1.01]'
                        : 'bg-[#FAF8F3] dark:bg-slate-900/60 border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885]/60 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl p-2 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC]/40 dark:border-slate-700">
                          {course.icon}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewCourse(course);
                            }}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] transition-colors"
                            title="Ver temario del curso"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-[#7C9885] text-white'
                                : 'bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300'
                            }`}
                          >
                            {course.badge}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-base text-[#2D3831] dark:text-slate-100 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8E4D5] dark:border-slate-700/80 flex items-center justify-between text-[11px] font-semibold text-[#66756C] dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-[#7C9885]" /> {course.lessons}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E0A96D]" /> {course.duration}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel de Inscripción & Validación OTP (Columna Derecha - 5 Cols) */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            
            {/* Cabecera del Panel */}
            <div className="border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
                2. Completa tu Solicitud
              </span>
              <h3 className="text-lg font-serif font-bold text-[#2D3831] dark:text-emerald-100 mt-0.5">
                {selectedCourse ? selectedCourse.title : 'Selecciona un curso'}
              </h3>
              <p className="text-[11px] text-[#526157] dark:text-slate-400">
                Acompañamiento personalizado sin costo alguno.
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F0EA] dark:bg-emerald-950/60 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-lg text-[#2D3831] dark:text-slate-100">
                  ¡Inscripción Confirmada!
                </h4>
                <p className="text-xs text-[#526157] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Tu número ha sido verificado. Un instructor de la iglesia se comunicará contigo vía WhatsApp para coordinar la primera lección.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Inscribir a otra persona
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                {/* Nombre */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#66756C] dark:text-slate-400">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                  />
                </div>

                {/* Teléfono + Envío OTP */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#66756C] dark:text-slate-400">
                    WhatsApp / Teléfono (+569) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="+56912345678"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors font-mono"
                    />
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading || phone.length !== 12}
                        className="whitespace-nowrap px-4 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                      >
                        {otpLoading ? 'Enviando...' : 'Código'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Input OTP si ya fue enviado */}
                {otpSent && (
                  <div className="p-3.5 bg-[#E8F0EA]/70 dark:bg-slate-800/80 rounded-2xl border border-[#C5D8CC] dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[11px] text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#7C9885]" /> Código OTP (6 dígitos) *
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpLoading}
                        className="text-[10px] text-[#7C9885] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        Reenviar
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.trim())}
                      className="w-full bg-white dark:bg-slate-950 text-center font-mono text-base tracking-widest py-2 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                    />
                  </div>
                )}

                {/* Modalidad */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#66756C] dark:text-slate-400">
                    Modalidad de Estudio
                  </label>
                  <select
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                  >
                    <option value="Presencial en Templo">Presencial en Templo Central (La Concepción 450)</option>
                    <option value="A Domicilio">A Domicilio en Hualqui</option>
                    <option value="Virtual (Zoom / WhatsApp)">Virtual (Zoom / Meet / WhatsApp)</option>
                  </select>
                </div>

                {/* Dirección Opcional */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[10px] text-[#66756C] dark:text-slate-400">
                    Dirección en Hualqui (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Calle Bulnes #123"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                  />
                </div>

                {/* Botón Submit con validación reactiva */}
                <button
                  type="submit"
                  disabled={!selectedCourse || !otpSent || loading}
                  className="w-full py-3 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    'Verificando y Guardando...'
                  ) : !otpSent ? (
                    'Solicita el código por WhatsApp primero'
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Confirmar e Inscribirme
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>

      {/* 3. MODAL DE PREVISUALIZACIÓN DE TEMARIO */}
      {previewCourse && (
        <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150">
          <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#E2DEC9] dark:border-slate-800 flex flex-col max-h-[80vh]">
            
            {/* Header Modal */}
            <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-5 border-b border-[#6B8774] dark:border-slate-800 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-white/20">{previewCourse.icon}</span>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">{previewCourse.badge}</span>
                  <h3 className="text-lg font-serif font-bold text-white leading-tight mt-0.5">{previewCourse.title}</h3>
                </div>
              </div>
              <button
                onClick={() => setPreviewCourse(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Temario */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-xs text-[#526157] dark:text-slate-300 leading-relaxed">
                {previewCourse.description}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
                  Temas Principales del Curso ({previewCourse.lessons}):
                </h4>
                <div className="space-y-1.5">
                  {previewCourse.syllabus.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#2D3831] dark:text-slate-200 p-2 rounded-xl bg-white dark:bg-slate-800/60 border border-[#E8E4D5] dark:border-slate-700/60">
                      <span className="w-5 h-5 rounded-full bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885] dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Modal con Acción de Selección */}
            <div className="p-4 bg-[#FAF8F3] dark:bg-slate-900 border-t border-[#E2DEC9] dark:border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setPreviewCourse(null)}
                className="px-4 py-2 text-xs font-semibold text-[#66756C] dark:text-slate-400 hover:underline"
              >
                Cerrar
              </button>

              <button
                onClick={() => {
                  setSelectedCourse(previewCourse);
                  setPreviewCourse(null);
                }}
                className="px-5 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Seleccionar este Curso
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
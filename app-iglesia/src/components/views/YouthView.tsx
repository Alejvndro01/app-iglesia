'use client';

import React, { useState } from 'react';
import {
  Flame,
  Calendar,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Send,
  Compass,
  Award,
  ExternalLink
} from 'lucide-react';

interface CalebFormData {
  name: string;
  phone: string;
  age: string;
}

export default function YouthView() {
  const [activeTab, setActiveTab] = useState<'eventos' | 'desafio'>('eventos');
  const [joinedCaleb, setJoinedCaleb] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [calebForm, setCalebForm] = useState<CalebFormData>({ name: '', phone: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upcomingEvents = [
    {
      id: 1,
      title: 'Sociedad JA: "Raíces Fuertes"',
      category: 'Culto Joven',
      date: 'Este Sábado',
      time: '18:00 hrs',
      location: 'Templo Central Hualqui',
      description: 'Un espacio de alabanza, dinámicas y estudio dedicado a consolidar nuestra fe.',
      badge: 'Próxima Reunión',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
    },
    {
      id: 2,
      title: 'Proyecto Misión Caleb 2026',
      category: 'Evangelismo Voluntario',
      date: '15 - 24 Enero, 2026',
      time: 'Todo el día',
      location: 'Sector La Concepción, Hualqui',
      description: 'Ayuda social, refacción comunitaria y brigadas de esperanza.',
      badge: 'Inscripciones Abiertas',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300'
    },
    {
      id: 3,
      title: 'GP Joven & Noche Social',
      category: 'Comunión',
      date: 'Viernes',
      time: '20:00 hrs',
      location: 'Hogar Familia Morales',
      description: 'Cena compartida, dinámicas, fogata y recepción del Sábado.',
      badge: 'Semanal',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
    }
  ];

  const youthGroups = [
    {
      name: 'GP Maranatha',
      leader: 'Claudio Morales',
      ageGroup: '15 - 21 años',
      schedule: 'Viernes 20:00 hrs',
      location: 'La Concepción #450'
    },
    {
      name: 'GP Josué',
      leader: 'Priscila & Dilan',
      ageGroup: '22 - 30+ años',
      schedule: 'Jueves 20:30 hrs',
      location: 'Sector Templo'
    }
  ];

  const handleCalebSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!calebForm.name.trim() || !calebForm.phone.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock de persistencia / llamada a Endpoint API
      await new Promise((resolve) => setTimeout(resolve, 600));
      setJoinedCaleb(true);
    } catch (err) {
      console.error('Error al registrarse en Caleb:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-12">
      {/* ================= HERO SECTION ================= */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950/40 dark:border-orange-500/20 dark:text-orange-300">
          <Flame className="w-3.5 h-3.5 fill-current" />
          SOCIEDAD DE JÓVENES ADVENTISTAS (JA)
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Salvar del pecado y guiar en el <span className="text-emerald-600 dark:text-emerald-400">Servicio</span>.
        </h1>

        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
          Comunidad juvenil de la Iglesia Adventista Central de Hualqui. Un lugar para crecer espiritualmente, crear lazos y transformar vidas.
        </p>

        {/* Versículo / Lema */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-center shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Nuestro Lema 2026</p>
          <p className="italic font-serif text-base sm:text-lg text-neutral-800 dark:text-neutral-200">
            &ldquo;El amor de Cristo nos motiva a ser la luz de Hualqui.&rdquo;
          </p>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 block">— 2 Corintios 5:14</span>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#culto-joven"
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Sociedad JA Sábado
          </a>
          <a
            href="https://chat.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl border bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            Comunidad WhatsApp
          </a>
        </div>
      </section>

      {/* ================= CULTO JA DESTACADO ================= */}
      <section id="culto-joven" className="rounded-3xl p-6 sm:p-8 border bg-linear-to-br from-emerald-50 to-neutral-100 dark:from-emerald-950/20 dark:to-neutral-900 border-emerald-200 dark:border-emerald-900/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
                SÁBADOS • 18:00 HRS
              </span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> En vivo en el Templo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">Sociedad de Jóvenes</h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl">
              Alabanza en vivo, paneles de discusión bíblica, testimonios y proyectos sociales.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>La Concepción #450, Hualqui</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Adolescentes, Jóvenes y Universitarios</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex flex-col justify-center items-center text-center min-w-[200px]">
            <Flame className="w-10 h-10 text-orange-500 mb-2" />
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Próximo Tema</span>
            <span className="font-bold text-base mt-1 text-neutral-900 dark:text-white">&ldquo;Firmeza en la Fe&rdquo;</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Dirige: Directiva JA</span>
          </div>
        </div>
      </section>

      {/* ================= RECURSOS RÁPIDOS ================= */}
      <section>
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Recursos JA</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            { title: 'Matutina Joven', desc: 'Lectura diaria', icon: BookOpen, url: 'https://matsab.org' },
            { title: 'Grupos Pequeños', desc: 'Comunión semanal', icon: Users, url: '#grupos-pequenos' },
            { title: 'Misión Caleb', desc: 'Voluntariado 2026', icon: Compass, url: '#caleb' },
            { title: 'Himnario Joven', desc: 'Música & Recursos', icon: Sparkles, url: 'https://himnarioadventista.org' }
          ].map((res, i) => (
            <a
              key={i}
              href={res.url}
              target={res.url.startsWith('http') ? '_blank' : '_self'}
              rel="noreferrer"
              className="p-4 rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all shadow-2xs group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                <res.icon className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1">
                {res.title}
                {res.url.startsWith('http') && <ExternalLink className="w-3 h-3 text-neutral-400" />}
              </h4>
              <p className="text-xs text-neutral-500">{res.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ================= ACTIVIDADES & DESAFÍO ================= */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Planificación</span>
            <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Actividades & Retos</h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('eventos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'eventos'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Eventos
            </button>
            <button
              onClick={() => setActiveTab('desafio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'desafio'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              Desafío Semanal
            </button>
          </div>
        </div>

        {activeTab === 'eventos' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {upcomingEvents.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl p-5 border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                    <span className="text-xs text-neutral-500 font-medium">{item.category}</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 leading-snug text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{item.date} • {item.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl p-6 sm:p-8 border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
                <Award className="w-4 h-4" />
                Reto JA de la Semana
              </div>
              <h4 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-white">&ldquo;Un mensaje para un amigo&rdquo;</h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                Esta semana, envía un versículo o audio de ánimo a 3 amigos que no hayan asistido últimamente a la iglesia o que estén pasando por momentos difíciles.
              </p>
              <button
                onClick={() => setChallengeDone(!challengeDone)}
                className={`px-5 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 ${
                  challengeDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {challengeDone ? '¡Desafío Cumplido! 🎉' : 'Marcar como Completado'}
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ================= PROYECTO MISIÓN CALEB ================= */}
      <section id="caleb" className="rounded-3xl p-6 sm:p-8 border bg-linear-to-br from-orange-50/50 via-neutral-50 to-neutral-100 dark:from-orange-950/20 dark:via-neutral-900 dark:to-neutral-900 border-orange-200/60 dark:border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-orange-600 text-white">
              <Compass className="w-3.5 h-3.5" /> Voluntariado Juvenil
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white leading-tight">
              Proyecto Misión Caleb Hualqui
            </h3>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Dedica parte de tus vacaciones para servir a la comunidad: remodelación de espacios públicos, asistencia social y evangelismo dinámico.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl border bg-white/70 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                📍 Sector La Concepción
              </div>
              <div className="p-3 rounded-2xl border bg-white/70 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                📅 Enero 2026
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 shadow-sm">
              {joinedCaleb ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg text-neutral-900 dark:text-white">¡Inscripción Exitosa!</h4>
                  <p className="text-xs text-neutral-500">
                    El equipo de líderes se comunicará contigo para coordinar la entrega de materiales.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCalebSubmit} className="space-y-3">
                  <h4 className="font-bold text-base text-neutral-900 dark:text-white">Únete a la Misión</h4>
                  <p className="text-xs text-neutral-500 mb-3">Completa tus datos para coordinar el voluntariado.</p>

                  <input
                    type="text"
                    placeholder="Nombre Completo *"
                    required
                    value={calebForm.name}
                    onChange={(e) => setCalebForm({ ...calebForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl text-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="WhatsApp *"
                      required
                      value={calebForm.phone}
                      onChange={(e) => setCalebForm({ ...calebForm, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Edad"
                      value={calebForm.age}
                      onChange={(e) => setCalebForm({ ...calebForm, age: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-xs border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Registrando...' : 'Inscribirme en Caleb 2026'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= GRUPOS PEQUEÑOS ================= */}
      <section id="grupos-pequenos" className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Comunión & Crecimiento</span>
          <h3 className="text-2xl font-bold text-neutral-900 dark:text-white">Grupos Pequeños de Jóvenes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {youthGroups.map((gp, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 flex justify-between items-start"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{gp.ageGroup}</span>
                </div>
                <h4 className="font-bold text-xl text-neutral-900 dark:text-white">{gp.name}</h4>
                <p className="text-xs text-neutral-500">Líder: <span className="text-neutral-800 dark:text-neutral-200 font-medium">{gp.leader}</span></p>

                <div className="pt-2 space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{gp.schedule}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{gp.location}</span>
                  </div>
                </div>
              </div>

              <a
                href="https://chat.whatsapp.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-emerald-600 dark:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
                title="Unirme al GP"
              >
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
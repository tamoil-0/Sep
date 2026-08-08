-- ═══════════════════════════════════════════════════════════
-- SEP · seed — datos reales extraídos de los decks, la web
--              y los mockups UX de SEP.
-- Idempotente: se puede correr varias veces.
-- ═══════════════════════════════════════════════════════════

-- ── TIPOS DE CERTIFICADO (§10.1 — confirmados) ────────────
insert into certificate_types (kind, name, issuer, price_cents, description) values
  ('sep', 'Certificado SEP', 'Semillero de Emprendedores Perú', 3000,
   'Aval de Semillero de Emprendedores Perú, organización reconocida por SENAJU. Válido para voluntariado, portafolio y postulaciones nacionales.'),
  ('internacional', 'Certificado Internacional', 'Instituto Internacional de Ingeniería', 5000,
   'Aval del Instituto Internacional de Ingeniería. Mayor peso en tu CV y en aplicaciones internacionales.'),
  ('voluntariado', 'Certificado de Voluntariado SEP', 'Semillero de Emprendedores Perú', 0,
   'Acredita formalmente tu rol como voluntario de SEP ante universidades y empleadores.'),
  ('speaker', 'Constancia de Speaker SEP', 'Semillero de Emprendedores Perú', 0,
   'Constancia de participación como speaker invitado en los programas de SEP.'),
  ('participacion', 'Constancia de Participación', 'Semillero de Emprendedores Perú', 0,
   'Constancia para estudiantes de secundaria que completan un taller de la red de colegios.')
on conflict do nothing;

-- ── PLANES DE MEMBRESÍA (§10.4) ───────────────────────────
insert into membership_plans (slug, name, duration_months, price_cents, benefits, order_index) values
  ('semilla', 'Semilla', 0, 0,
   '["Todos los cursos del catálogo","Acceso a la comunidad SEP","Newsletter quincenal","Eventos abiertos y Demo Days"]'::jsonb, 0),
  ('raiz', 'Raíz', 3, 4500,
   '["Todo lo de Semilla","1 certificado SEP incluido","Mentoría grupal mensual","Acceso anticipado a nuevas cohortes"]'::jsonb, 1),
  ('tronco', 'Tronco', 6, 8000,
   '["Todo lo de Raíz","2 certificados SEP incluidos","1 mentoría 1:1 al mes","Prioridad para presentar en Demo Day"]'::jsonb, 2),
  ('bosque', 'Bosque', 12, 14000,
   '["Todo lo de Tronco","1 certificado Internacional incluido","SILP con 30% de descuento","Badge de miembro fundador"]'::jsonb, 3),
  ('voluntario', 'Voluntario SEP', 12, 0,
   '["Todo lo de Bosque sin costo","Canal privado de voluntarios","Formación continua gratuita"]'::jsonb, 4)
on conflict (slug) do nothing;

-- ── CURSOS (§1.8) ─────────────────────────────────────────
insert into courses
  (slug, title, subtitle, description, audience, status, category,
   total_hours, sessions_count, weeks, frequency, is_free, order_index, published_at)
values
  ('design-thinking-aplicado', 'Design Thinking aplicado',
   'Tu primera experiencia en Design Thinking',
   'Empatía, ideación y prototipado para el cambio social. Aprende el método completo resolviendo un problema real de tu comunidad.',
   'universitario', 'disponible', 'Metodologías ágiles', 8, 6, 2, 'Interdiario', true, 0, now()),

  ('scrum-proyectos-sociales', 'Scrum para proyectos sociales',
   'Gestión ágil de proyectos de impacto regional',
   'Organiza equipos y entrega valor en ciclos cortos. Scrum llevado al terreno de la innovación social en regiones.',
   'universitario', 'proximamente', 'Metodologías ágiles', 8, 6, 2, 'Interdiario', true, 1, null),

  ('liderazgo-impacto-regional', 'Liderazgo e impacto regional',
   'Desarrolla tu perfil de líder desde tu región',
   'Oratoria, toma de decisiones y liderazgo de equipos. Construye tu voz sin salir de tu región.',
   'universitario', 'proximamente', 'Liderazgo', 8, 6, 2, 'Interdiario', true, 2, null),

  ('metodologias-agiles-en-el-aula', 'Metodologías ágiles en el aula',
   'DT y Scrum aplicados al entorno escolar',
   'Para docentes que quieren innovar en su clase. Diseña sesiones activas con Design Thinking y Scrum.',
   'docente', 'proximamente', 'Para docentes', 8, 6, 2, 'Interdiario', true, 3, null),

  ('silp', 'Social Impact Leadership Program',
   'SILP — Programa insignia de SEP',
   'Seis semanas de formación completa en liderazgo social. Diseñas y ejecutas un proyecto de impacto real en tu región, con acompañamiento de mentores.',
   'universitario', 'disponible', 'SILP', 36, 18, 6, 'Interdiario', false, 4, now())
on conflict (slug) do nothing;

update courses set price_cents = 20000 where slug = 'silp';

-- ── SESIONES DEL CURSO 1 (§1.8, malla del deck) ───────────
insert into course_sessions (course_id, number, week, title, subtitle, description)
select c.id, s.number, s.week, s.title, s.subtitle, s.description
from courses c,
(values
  (1, 1, '¿Qué es Design Thinking?', 'Introducción · casos en América Latina',
   'Introducción al método, casos de éxito en América Latina y diferencia frente al pensamiento tradicional.'),
  (2, 1, 'Empatía — Conoce a tu usuario', 'Entrevistas · mapa de empatía',
   'Técnicas de observación, entrevistas de usuario y mapa de empatía. Ejercicio práctico en vivo.'),
  (3, 1, 'Definición del problema (POV)', 'Point of View · ¿Cómo podríamos...?',
   'Cómo sintetizar hallazgos en un "Point of View" potente. Redacción del enunciado "¿Cómo podríamos…?".'),
  (4, 2, 'Ideación — Brainstorming sin límites', 'SCAMPER · Crazy 8s · selección de ideas',
   'Técnicas: SCAMPER, mapa mental y Crazy 8s. Reglas del brainstorming efectivo y selección de ideas.'),
  (5, 2, 'Prototipado rápido', 'Prototipo en papel · fallar rápido',
   'Cómo crear un prototipo en papel en menos de 30 minutos. Principio "fallar rápido para aprender rápido".'),
  (6, 2, 'Testeo + Presentación de proyectos', 'Feedback real · mini-pitch final',
   'Feedback de usuarios reales, iteración del prototipo y mini-pitch de cada proyecto ante el grupo.')
) as s(number, week, title, subtitle, description)
where c.slug = 'design-thinking-aplicado'
on conflict (course_id, number) do nothing;

-- ── ROLES DE VOLUNTARIADO (§1.9) ──────────────────────────
insert into volunteer_roles
  (slug, name, type, description, requirements, benefits, hours_per_week, open_positions)
values
  ('mentor', 'Mentor SEP', 'mentor_junior',
   'Acompañas a jóvenes universitarios en el diseño de sus proyectos de innovación social. Guías, retroalimentas y celebras sus logros.',
   '["Egresado del SILP o 1 curso SEP completado","Disponibilidad de 4 h/semana","Interés genuino en el impacto regional"]'::jsonb,
   '["Certificado Mentor Junior SEP","Carta de recomendación institucional","Acceso al canal privado de mentores","Prioridad para ascender a Mentor Senior","Facilitador oficial en Demo Days","Acceso gratuito a todos los cursos SEP"]'::jsonb,
   4, 2),

  ('community-manager', 'Community Manager', 'community_manager',
   'Gestionas la voz digital de SEP: redes sociales, grupos de WhatsApp, foro de la plataforma y el tono de comunicación con los jóvenes.',
   '["Manejo de Instagram, TikTok y LinkedIn","Habilidad para crear contenido en Canva","Disponibilidad de 5 h/semana"]'::jsonb,
   '["Portafolio digital certificado por SEP","Reconocimiento público como co-creador","Formación en marketing digital social","Acceso a métricas y analítica SEP","Mentoría en comunicación estratégica","Acceso gratuito a todos los cursos SEP"]'::jsonb,
   5, 1),

  ('organizador-eventos', 'Organizador de eventos', 'event_organizer',
   'Coordinas la logística de Demo Days, ferias, talleres y workshops. Eres el motor que hace que SEP llegue a más espacios y personas.',
   '["Experiencia organizando actividades estudiantiles","Proactividad y atención al detalle","Disponibilidad de 6 h/semana"]'::jsonb,
   '["Certificado en gestión de eventos SEP","Mención oficial en cada evento","Red de contactos con organizaciones aliadas","Experiencia real en logística de alto impacto","Acceso a speakers y líderes de Latam","Acceso gratuito a todos los cursos SEP"]'::jsonb,
   6, 1)
on conflict (slug) do nothing;

-- ── ALIADOS (§1.7) ────────────────────────────────────────
insert into partners (name, category, order_index) values
  ('SENAJU', 'red', 0),
  ('Proa', 'red', 1),
  ('CONEII', 'alianza', 2),
  ('CODE — Congreso de Desarrollo Emprendedor', 'alianza', 3),
  ('Innovation Challenge PUCP', 'alianza', 4),
  ('Start Lima', 'alianza', 5),
  ('Hult Prize Perú', 'mentoria', 6),
  ('UTP — Universidad Tecnológica del Perú', 'mentoria', 7),
  ('Universidad Científica del Sur', 'mentoria', 8),
  ('UPN — Universidad Privada del Norte', 'mentoria', 9),
  ('Huánuco Innova', 'mentoria', 10),
  ('SpinOut Awards 2025', 'premio', 11),
  ('Instituto Internacional de Ingeniería', 'aval', 12)
on conflict do nothing;

-- ── COLEGIOS DE LA RED (§1.10) ────────────────────────────
insert into institutions (name, type, region, province, is_verified) values
  ('I.E. San Bartolomé',   'colegio', 'Áncash', 'Casma',    true),
  ('I.E. República de Perú','colegio', 'Áncash', 'Santa',    true)
on conflict do nothing;

-- ═══════════════════════════════════════════════════════════
-- DIAGNÓSTICO — 45 preguntas (15 × 3 perfiles) §1.13
-- Extraídas literalmente de data/sep_diagnostico_final.html
-- ═══════════════════════════════════════════════════════════

-- ── PERFIL: UNIVERSITARIO ─────────────────────────────────
insert into survey_questions (profile, block, block_title, number, question, input_type, options, validates, tag, is_key) values
('universitario', 1, '¿Quién eres?', 1, '¿De qué región del Perú eres? (o si eres de otro país, indícalo)', 'single',
 '["Áncash","Cusco","Arequipa","La Libertad","Piura","Junín","Puno","Lima","Huánuco","Otro departamento del Perú","Soy de otro país"]'::jsonb,
 'distribución geográfica — confirma que la demanda existe fuera de Lima', null, false),

('universitario', 1, '¿Quién eres?', 2, '¿Cuál es tu situación actual?', 'single',
 '["Universitario (1er al 3er ciclo)","Universitario (4to ciclo en adelante)","Egresado reciente (menos de 2 años)","Emprendedor","Trabajo y estudio a la vez","Otro"]'::jsonb,
 'perfil predominante — define en qué ciclo concentrar el piloto', null, false),

('universitario', 1, '¿Quién eres?', 3, '¿Cuántas horas libres tienes a la semana fuera de clases o trabajo?', 'single',
 '["Menos de 2 horas","Entre 2 y 4 horas","Entre 4 y 6 horas","Más de 6 horas"]'::jsonb,
 'viabilidad del formato de 2h por sesión interdiario', null, false),

('universitario', 2, 'El dolor', 4, '¿Qué tan fácil es acceder a formación en liderazgo e innovación desde donde vives?', 'scale_1_5',
 '["1 — Casi imposible","2","3","4","5 — Muy accesible"]'::jsonb,
 'brecha de acceso geográfico — hipótesis central de SEP', null, true),

('universitario', 2, 'El dolor', 5, '¿Cuál es el mayor obstáculo que sientes para crecer profesionalmente hoy?', 'single',
 '["Vivo lejos de Lima y hay pocas oportunidades","Los programas de calidad son muy caros","Mi universidad no me prepara para la realidad","No tengo red de contactos","No sé por dónde empezar","Miedo a hablar o destacar en público","Otro"]'::jsonb,
 'cuál barrera domina — define el argumento principal del copy de SEP', null, true),

('universitario', 2, 'El dolor', 6, '¿Sientes que tu universidad te está preparando para el mundo laboral que viene?', 'scale_1_5',
 '["1 — Para nada","2","3","4","5 — Totalmente"]'::jsonb,
 'brecha universidad–mercado como argumento de entrada al programa', null, false),

('universitario', 2, 'El dolor', 7, '¿Cuánto gastas actualmente en cursos, talleres o formación adicional por mes?', 'single',
 '["Nada, no puedo pagar","Menos de S/50","Entre S/50 y S/150","Entre S/150 y S/300","Más de S/300"]'::jsonb,
 'capacidad de pago real — calibra el precio del certificado y el SILP', 'Presupuesto', false),

('universitario', 3, 'Aspiraciones y demanda de contenido', 8, '¿Cuál es tu mayor meta personal o profesional en los próximos 2 a 3 años?', 'single',
 '["Conseguir un buen trabajo o prácticas","Emprender mi propio proyecto","Generar impacto en mi comunidad o región","Seguir estudios de posgrado o especializarme","Desarrollar habilidades de liderazgo","Ser referente o speaker en mi campo","Otro"]'::jsonb,
 'si las aspiraciones se alinean con lo que SEP ofrece', null, true),

('universitario', 3, 'Aspiraciones y demanda de contenido', 9, '¿Qué habilidades sientes que te hacen más falta hoy?', 'multiple',
 '["Liderazgo y toma de decisiones","Hablar en público y presentar ideas","Gestión de proyectos","Pensamiento creativo e innovación","Emprendimiento social","Red de contactos y visibilidad","Otra"]'::jsonb,
 'demanda específica de habilidades — prioridad del catálogo de cursos SEP', null, false),

('universitario', 3, 'Aspiraciones y demanda de contenido', 10, '¿Qué cursos te gustaría tomar si los tuvieras disponibles ahora mismo?', 'multiple',
 '["Design Thinking","Scrum y gestión ágil","Lean Startup","Liderazgo e impacto social","Oratoria y comunicación","Gestión de proyectos sociales","Emprendimiento desde cero","Cómo dictar talleres y capacitar","Otro"]'::jsonb,
 'qué cursos lanzar primero y en qué orden — define el roadmap del catálogo', 'Demanda de cursos', false),

('universitario', 3, 'Aspiraciones y demanda de contenido', 11, 'Si completaras un curso en línea, ¿cuánto estarías dispuesto a pagar por un certificado que valide tu aprendizaje?', 'single',
 '["Nada, no pagaría por un certificado","Hasta S/20","Entre S/20 y S/40","Entre S/40 y S/60","Entre S/60 y S/100","Más de S/100 si el aval es reconocido"]'::jsonb,
 'precio óptimo para el certificado — confirma o ajusta el S/30 y S/50 de SEP', 'Willingness to pay', true),

('universitario', 4, 'Experiencia previa', 12, '¿Has dado charlas, talleres o presentaciones frente a otras personas?', 'single',
 '["Nunca, y me da mucho miedo","Nunca, pero quiero empezar","Sí, una o dos veces","Sí, varias veces","Es algo habitual en mí"]'::jsonb,
 'nivel de experiencia en oratoria — calibra el punto de partida del programa', null, false),

('universitario', 4, 'Experiencia previa', 13, '¿Has participado en proyectos de voluntariado o iniciativas de impacto social?', 'single',
 '["Sí, tengo experiencia activa","Sí, participé alguna vez","No, pero me interesa mucho","No lo he considerado"]'::jsonb,
 'sensibilidad al impacto social como motivador de inscripción', null, false),

('universitario', 5, 'Disposición', 14, 'Si aprendieras metodologías de innovación, ¿estarías dispuesto a enseñárselas a jóvenes de tu comunidad o colegio?', 'single',
 '["Sí, es exactamente lo que quiero hacer","Me gustaría intentarlo cuando me sienta listo","No lo había pensado, pero me parece interesante","Prefiero solo formarme a mí mismo por ahora"]'::jsonb,
 'disposición al efecto multiplicador — auto-selección natural para el SILP', 'Filtro SILP', true),

('universitario', 5, 'Disposición', 15, '¿Qué tan comprometido estás con generar un cambio real en tu entorno, aunque nadie te lo pida?', 'scale_1_5',
 '["1 — Aún no lo veo claro","2","3","4","5 — Es una prioridad para mí"]'::jsonb,
 'motivación intrínseca — predice adherencia y completación del programa', null, false)
on conflict (profile, number) do nothing;

-- ── PERFIL: DOCENTE ───────────────────────────────────────
insert into survey_questions (profile, block, block_title, number, question, input_type, options, validates, tag, is_key) values
('docente', 1, '¿Quién eres?', 1, '¿En qué región y nivel educativo enseñas?', 'single',
 '["Secundaria — Región fuera de Lima","Secundaria — Lima","Primaria — Región fuera de Lima","Primaria — Lima","Instituto o educación superior","Otro"]'::jsonb,
 'perfil geográfico y nivel — confirma foco en secundaria de regiones', null, false),

('docente', 1, '¿Quién eres?', 2, '¿Cuántos estudiantes tienes aproximadamente a tu cargo?', 'single',
 '["Menos de 30","Entre 30 y 60","Entre 60 y 100","Más de 100"]'::jsonb,
 'tamaño del impacto indirecto por docente formado', null, false),

('docente', 1, '¿Quién eres?', 3, '¿Cuántas horas a la semana podrías dedicar a tu propia formación?', 'single',
 '["Menos de 2 horas","2 a 4 horas","4 a 6 horas","Más de 6 horas"]'::jsonb,
 'viabilidad del formato de 8h total del programa docente', null, false),

('docente', 2, 'El dolor', 4, '¿Qué tan accesible es la formación docente en metodologías innovadoras desde tu región?', 'scale_1_5',
 '["1 — Casi no existe","2","3","4","5 — Muy accesible"]'::jsonb,
 'brecha de acceso docente a innovación pedagógica', null, false),

('docente', 2, 'El dolor', 5, '¿Cuál es el mayor obstáculo para innovar en tu aula hoy?', 'single',
 '["No conozco metodologías nuevas","No tengo tiempo para formarme","Las capacitaciones disponibles son muy caras","No sé cómo aplicarlas en mi clase","Mi institución no apoya la innovación","No tengo materiales ni recursos","Otro"]'::jsonb,
 'tipo de barrera dominante — define el ángulo del programa docente SEP', null, true),

('docente', 2, 'El dolor', 6, '¿Tus estudiantes te piden formas de aprender más dinámicas o prácticas?', 'single',
 '["Sí, constantemente","A veces","Rara vez","No lo manifiestan"]'::jsonb,
 'presión desde el estudiante como motivador del docente', null, false),

('docente', 2, 'El dolor', 7, '¿Cuánto inviertes en tu formación docente continua al año?', 'single',
 '["Nada, no tengo presupuesto para eso","Menos de S/100 al año","Entre S/100 y S/300","Entre S/300 y S/600","Más de S/600"]'::jsonb,
 'capacidad de inversión en formación — calibra el precio del programa docente', 'Presupuesto', false),

('docente', 3, 'Aspiraciones y cursos deseados', 8, '¿Qué cursos o formaciones te gustaría tomar para mejorar tu práctica docente?', 'multiple',
 '["Design Thinking aplicado al aula","Aprendizaje basado en proyectos (ABP)","Scrum para gestión de clases","Liderazgo estudiantil","Evaluación por competencias","Herramientas digitales educativas","Cómo motivar a estudiantes en regiones","Otro"]'::jsonb,
 'qué módulos priorizar en el programa docente SEP', 'Demanda de cursos', false),

('docente', 3, 'Aspiraciones y cursos deseados', 9, '¿Qué tanto mejoraría tu posición institucional obtener un certificado en metodologías innovadoras?', 'scale_1_5',
 '["1 — No cambia nada","2","3","4","5 — Me abre puertas importantes"]'::jsonb,
 'valor percibido del certificado — argumento de conversión', null, false),

('docente', 3, 'Aspiraciones y cursos deseados', 10, '¿Cuánto pagarías por ese certificado si el programa es virtual, práctico y con aval reconocido?', 'single',
 '["Nada, debería ser gratuito","Hasta S/30","Entre S/30 y S/60","Entre S/60 y S/100","Más de S/100 si el aval es sólido"]'::jsonb,
 'precio óptimo del certificado docente — ¿supera el S/50 o se queda en S/30?', 'Willingness to pay', true),

('docente', 3, 'Aspiraciones y cursos deseados', 11, '¿Qué habilidades priorizarías desarrollar este año como docente?', 'multiple',
 '["Metodologías activas e innovadoras","Gestión emocional del aula","Liderazgo y motivación de grupos","Tecnología educativa","Comunicación efectiva","Otra"]'::jsonb,
 'demanda específica de contenido — complementa el catálogo de cursos SEP', null, false),

('docente', 4, 'Experiencia', 12, '¿Has recibido formación docente en metodologías innovadoras en los últimos 2 años?', 'single',
 '["Sí, frecuentemente","Sí, alguna vez","No, no tuve acceso","No, no lo prioricé"]'::jsonb,
 'qué tan activo es el docente en su formación continua', null, false),

('docente', 4, 'Experiencia', 13, '¿Qué tan familiarizado estás con metodologías como Design Thinking o aprendizaje basado en proyectos?', 'scale_1_5',
 '["1 — No las conozco","2 — Las he escuchado","3 — Las entiendo básicamente","4 — Las aplico a veces","5 — Las uso regularmente"]'::jsonb,
 'nivel de conocimiento previo — calibra nivel de inicio del programa', null, false),

('docente', 5, 'Disposición', 14, '¿Aceptarías que universitarios formados en innovación social dicten talleres gratuitos en tu colegio?', 'single',
 '["Sí, sería excelente para mis estudiantes","Sí, si tienen respaldo institucional","Lo evaluaría según el tema del taller","Necesitaría aprobación de la dirección","No por ahora"]'::jsonb,
 'apertura al modelo de red de colegios — escalabilidad del programa', 'Red de colegios', true),

('docente', 5, 'Disposición', 15, 'Si el programa fuera 100% virtual, con sesiones de 2 horas los martes o jueves, ¿lo tomarías?', 'single',
 '["Sí, encaja con mi horario","Sí, si puedo recuperar sesiones que pierda","Depende de la carga del programa","Prefiero fines de semana","No puedo comprometer ese horario"]'::jsonb,
 'viabilidad del formato horario para docentes — informa el calendario del programa', 'Validación de formato', false)
on conflict (profile, number) do nothing;

-- ── PERFIL: EMPRESA ───────────────────────────────────────
insert into survey_questions (profile, block, block_title, number, question, input_type, options, validates, tag, is_key) values
('empresa', 1, '¿Quién eres?', 1, '¿En qué sector opera tu empresa u organización?', 'single',
 '["Minería o energía","Educación","Tecnología","Servicios o consultoría","ONG o fundación","Sector público","Retail o consumo masivo","Otro"]'::jsonb,
 'qué sectores muestran mayor afinidad con el modelo de impacto de SEP', null, false),

('empresa', 1, '¿Quién eres?', 2, '¿En qué regiones del Perú tienen presencia o interés de impacto social?', 'multiple',
 '["Áncash","Cusco","Arequipa","La Libertad","Piura","Junín","Solo Lima","A nivel nacional","Otra región"]'::jsonb,
 'alineación geográfica con el alcance de SEP', null, false),

('empresa', 1, '¿Quién eres?', 3, '¿Tu empresa tiene actualmente un programa de responsabilidad social activo?', 'single',
 '["Sí, robusto y con presupuesto definido","Sí, pero limitado o informal","Estamos construyéndolo este año","No tenemos aún"]'::jsonb,
 'madurez de RSE — define si son leads inmediatos o a mediano plazo', null, false),

('empresa', 2, 'El dolor', 4, '¿Cuál es el mayor desafío al ejecutar programas de impacto social en regiones?', 'single',
 '["Encontrar aliados confiables fuera de Lima","Medir el impacto real generado","Llegar a los jóvenes correctos","Justificar la inversión internamente","Escalar sin perder calidad","No tenemos experiencia en esto","Otro"]'::jsonb,
 'dolor principal — define cómo SEP se posiciona como solución', null, true),

('empresa', 2, 'El dolor', 5, '¿Qué tan satisfechos están con los resultados de sus iniciativas de impacto social actuales?', 'scale_1_5',
 '["1 — Muy insatisfechos","2","3","4","5 — Muy satisfechos"]'::jsonb,
 'nivel de frustración con el status quo — apertura a nuevos modelos como SEP', null, false),

('empresa', 2, 'El dolor', 6, '¿Han tenido dificultades para encontrar jóvenes talentosos de regiones para sus programas?', 'single',
 '["Sí, es un problema constante","A veces","No lo hemos intentado aún","No aplica a nuestro modelo"]'::jsonb,
 'SEP como pipeline de talento regional — argumento adicional de valor', null, false),

('empresa', 2, 'El dolor', 7, '¿Cuánto presupuesto destinan anualmente a iniciativas de RSE o inversión social?', 'single',
 '["Menos de S/10,000","Entre S/10,000 y S/50,000","Entre S/50,000 y S/200,000","Más de S/200,000","No tenemos presupuesto definido"]'::jsonb,
 'capacidad financiera real — segmenta leads y define el modelo de precios de alianza', 'Presupuesto', false),

('empresa', 3, 'Aspiraciones', 8, '¿Qué tipo de impacto social quisieran demostrar en los próximos 2 años?', 'multiple',
 '["Jóvenes capacitados en habilidades del futuro","Reducir brechas educativas en regiones","Crear oportunidades para talentos fuera de Lima","Apoyar el emprendimiento juvenil regional","Alinearse con los ODS de la ONU","Mejorar su imagen ante stakeholders","Otro"]'::jsonb,
 'si la visión de impacto de la empresa se alinea con lo que SEP ejecuta', null, true),

('empresa', 3, 'Aspiraciones', 9, '¿Qué valoran más en un aliado de impacto social?', 'multiple',
 '["Trayectoria y acreditaciones","Alcance geográfico en regiones","Métricas e indicadores de impacto claros","Alineación con los ODS","Transparencia en el uso de fondos","Acceso a talento joven formado","Co-branding y visibilidad de la empresa"]'::jsonb,
 'criterios de selección de aliados — informa el pitch de SEP a empresas', null, false),

('empresa', 3, 'Aspiraciones', 10, '¿Qué tan importante es para su organización poder reportar el impacto social a directivos o accionistas?', 'scale_1_5',
 '["1 — No es relevante","2","3","4","5 — Es crítico para nuestra estrategia"]'::jsonb,
 'necesidad de reportes de impacto — informa los KPIs que SEP debe ofrecer', null, false),

('empresa', 4, 'Experiencia', 11, '¿Han trabajado antes con organizaciones juveniles o educativas en regiones del Perú?', 'single',
 '["Sí, con buena experiencia","Sí, con resultados mixtos","No, pero lo hemos evaluado","No, es territorio nuevo para nosotros"]'::jsonb,
 'experiencia previa — madurez como aliado potencial de SEP', null, false),

('empresa', 4, 'Experiencia', 12, '¿Qué formatos de inversión social han usado hasta ahora?', 'multiple',
 '["Donaciones directas a ONGs","Programas propios de RSE","Voluntariado corporativo","Becas o financiamiento educativo","Patrocinio de eventos","Ninguno aún"]'::jsonb,
 'modelos ya conocidos — facilita la propuesta de alianza de SEP', null, false),

('empresa', 5, 'Disposición', 13, 'Si existiera un programa que forma a 100 jóvenes por año en regiones con métricas claras, ¿lo co-financiarían?', 'single',
 '["Sí, definitivamente","Probablemente sí","Necesitaríamos ver resultados primero","No es prioridad este año","No se alinea con nuestra estrategia"]'::jsonb,
 'intención de compra real — diferencia leads tibios de aliados potenciales', 'Intención de alianza', true),

('empresa', 5, 'Disposición', 14, '¿Qué formato de alianza les resultaría más natural con una organización juvenil?', 'multiple',
 '["Patrocinio económico de cohortes con co-branding","Financiamiento de becas para jóvenes de su región","Voluntariado corporativo en talleres SEP","Prácticas o empleo para egresados SEP","Donación de herramientas o licencias","Otro formato"]'::jsonb,
 'menú de alianzas que SEP debe ofertar — informa la propuesta comercial', 'Modelo de colaboración', false),

('empresa', 5, 'Disposición', 15, '¿En qué plazo estarían en posición de concretar una alianza?', 'single',
 '["Este mes, estamos listos","En los próximos 3 meses","En 6 meses o más","Dependemos de la aprobación de un área","Primero necesitamos conocer más"]'::jsonb,
 'urgencia y ciclo de venta — define con quién hacer seguimiento inmediato', 'Urgencia', false)
on conflict (profile, number) do nothing;

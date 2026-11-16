-- ════════════════════════════════════════════════════════════════
-- 0016 · Sesiones del SILP
--
-- El curso `silp` existía con 18 sesiones declaradas (6 semanas,
-- interdiario, 36 h) pero sin filas en `course_sessions`: su aula se veía
-- vacía. Se cargan desde docs/SILP_Programa_y_Cronograma.xlsx (hoja
-- «Programa SILP»): cada semana reparte su «Qué se aprenderá» en 3 sesiones
-- de 2 horas. Idempotente: no toca sesiones que ya existan.
-- ════════════════════════════════════════════════════════════════

insert into course_sessions (course_id, number, week, title, subtitle, description, duration_min)
select c.id, s.number, s.week, s.title, s.subtitle, s.description, 120
from courses c,
(values
  -- Semana 1 · Propósito y visión de liderazgo
  (1, 1, 'Tus fortalezas y valores', 'Test de liderazgo · rueda de valores',
   'Reconoce tus fortalezas, valores y motivaciones con el test de liderazgo y la rueda de valores.'),
  (2, 1, 'Tu propósito personal', 'Canvas de propósito',
   'Define un propósito personal con el canvas de propósito y conéctalo con una causa social.'),
  (3, 1, 'Liderazgo desde el servicio', 'Entregable: declaración de propósito',
   'Comprende el liderazgo desde el servicio y escribe tu declaración de propósito (1 página).'),
  -- Semana 2 · Identificación de una causa y problemática social
  (4, 2, 'Necesidad real o idea personal', 'Ficha de diagnóstico comunitario',
   'Aprende a diferenciar una necesidad real de una idea personal con la ficha de diagnóstico comunitario.'),
  (5, 2, 'Tu comunidad y sus actores', 'Matriz de actores',
   'Identifica a la comunidad que quieres impactar y a los actores relacionados con el problema.'),
  (6, 2, 'Valida tu causa', 'Entregable: canvas de causa',
   'Valida una problemática de tu comunidad con observación y conversaciones, y completa tu canvas de causa.'),
  -- Semana 3 · Diseño de soluciones con AI Design Thinking
  (7, 3, 'Comprende a tu audiencia', 'Mapa de empatía',
   'Conoce a tu audiencia e identifica sus necesidades con el mapa de empatía.'),
  (8, 3, 'Formula el problema', 'Tarjetas «¿Cómo podríamos…?»',
   'Formula el problema y abre posibilidades con las tarjetas «¿Cómo podríamos…?».'),
  (9, 3, 'Idea y prototipa', 'Entregable: prototipo de iniciativa',
   'Genera y selecciona soluciones con el canvas de ideación y diseña un prototipo inicial de tu iniciativa.'),
  -- Semana 4 · Formulación del proyecto o iniciativa
  (10, 4, 'Objetivos SMART', 'Plantilla de proyecto',
   'Define objetivos SMART para tu iniciativa con la plantilla de proyecto.'),
  (11, 4, 'Actividades, tiempos y materiales', 'Guía de planificación',
   'Organiza actividades y tiempos y selecciona los materiales con la guía de planificación.'),
  (12, 4, 'Indicadores de impacto', 'Entregable: diseño de la iniciativa',
   'Establece indicadores de impacto con la matriz de métricas y entrega el diseño completo de tu iniciativa (2–3 páginas).'),
  -- Semana 5 · Redes de apoyo y mapeo de stakeholders
  (13, 5, 'Factores clave de tu iniciativa', 'Redes de apoyo',
   'Identifica los factores clave que harán posible tu iniciativa.'),
  (14, 5, 'Mapea aliados y beneficiarios', 'Plantilla de mapeo de stakeholders',
   'Mapea aliados y beneficiarios con la plantilla de mapeo de stakeholders.'),
  (15, 5, 'Estrategias de acercamiento', 'Entregable: mapa de stakeholders',
   'Diseña estrategias de acercamiento y colaboración con los actores clave y entrega tu mapa de stakeholders.'),
  -- Semana 6 · Comunicación, storytelling y speech
  (16, 6, 'Estructura tu speech', 'Guía de speech',
   'Estructura un speech claro sobre tu iniciativa con la guía de speech.'),
  (17, 6, 'Cuenta tu historia', 'Plantilla de storytelling · voz y presencia',
   'Cuenta una historia que conecte y mejora tu voz, lenguaje corporal y presencia.'),
  (18, 6, 'Feedback y entrega final', 'Entregable: video del speech',
   'Recibe y aplica feedback, graba tu speech y entrega los materiales base de tu futura sesión de facilitación.')
) as s(number, week, title, subtitle, description)
where c.slug = 'silp'
on conflict (course_id, number) do nothing;

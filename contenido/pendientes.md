# Pendientes para el equipo SEP

Ordenados por urgencia. Ninguno se resuelve inventando: si no hay respuesta, la web omite el dato.

## Alta — afecta la confianza o la exactitud de lo publicado hoy

1. **Testimonios ficticios publicados como reales.** `src/app/(marketing)/testimonios/page.tsx:26-69` muestra 6 citas
   bajo el texto «Sin retoques ni testimonios de stock. Personas reales de regiones reales.» Cinco nombres son personajes
   del seed de demo (`supabase/seeds/demo.sql`: Andrea Núñez, Valeria Ríos, Kevin Quispe, Rosa Chávez, Diego Paredes) y
   «Jorge Medina» no aparece en ninguna fuente. **Propuesta:** retirar las citas y dejar solo los proyectos reales de la
   base hasta tener testimonios con permiso. ¿Lo aprueban?
2. **«10+ regiones»** aparece en 9 lugares; la fuente dice «6–10 regiones activas» [plan §1.5]. ¿Cuántas regiones
   activas hay hoy, con nombre? (Mientras tanto: «presencia en regiones del Perú», sin número.)
3. **«Comunidad de 75+ jóvenes formados»** (login) contradice «+135 jóvenes formados» (home). La fuente dice +135
   capacitados en Áncash [pitch] y 75+ *miembros de comunidad* [plan]. ¿Cuál es la cifra vigente de cada cosa?
4. **«5 colegios aliados»**: el pitch dice 5 colegios *impactados*; el plan nombra solo 2 activos (San Bartolomé y
   República de Perú). ¿Cuáles son los 5 y cuáles siguen activos?

## Media — cifras sin fuente primaria (se pueden mantener si las confirman)

5. 18 talleres realizados y 48 speakers en la red: ¿fecha de corte y fuente?
6. 1,200+ suscriptores y 89–94 % de apertura del newsletter; 1,000+ jóvenes de alcance para speakers; 300+ escolares
   (el pitch da 5 × 15 = 75).
7. Duración de los cursos: «6 sesiones de 2 h» suman 12 h, pero se publica «8 h». ¿Cuál es la correcta?
8. SILP: ¿18 sesiones en vivo? (solo está en el código). ¿Tarifa comercial S/ 350 confirmada?
9. Equipo: ¿son 9 personas incluyendo al CTO (Jhon Aracayo)? El pitch muestra 8 nombres.

## Baja — material que mejoraría el rediseño

10. **Fotos:** hay 10 fotos reales en `public/img/`. Para el rediseño hacen falta: 1 foto horizontal fuerte para el hero
    (grupo en acción, buena luz), 2–3 retratos de mentores/universitarios en taller, 1 foto de colegio. Con permiso de uso.
11. **Logos de aliados:** ¿hay autorización escrita para mostrar logos (SENAJU, CONEII, Hult Prize, UTP…)? Sin eso, se
    listan como texto, no como cinta de logos.
12. Misión y visión: vienen de la web anterior; ¿siguen vigentes?
13. Testimonios reales: 3–5 citas con nombre, región, rol y permiso firmado.
14. Certificado internacional (S/ 50, Instituto Internacional de Ingeniería): ¿convenio firmado? Hasta entonces sigue «En trámite».

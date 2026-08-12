# Lanzamiento SEO de SEP

El código deja preparado el SEO técnico, pero la indexación empieza recién
cuando se despliega y se registra el dominio oficial en los buscadores.

## 1. Elegir una sola URL oficial

Usar un dominio propio estable es preferible a cambiar de subdominio de Vercel
más adelante. Si todavía no existe, se puede comenzar con:

```text
https://sep-drab.vercel.app
```

En Vercel → Settings → Environment Variables, configurar exactamente:

```text
NEXT_PUBLIC_SITE_URL=https://sep-drab.vercel.app
```

Sin `/` al final. Si después se compra un dominio, cambiar esta variable,
configurar una redirección 301 desde el dominio anterior y volver a enviar el
sitemap. No publicar `sep.edu.pe` hasta que realmente sea propiedad de SEP.

## 2. Google Search Console

1. Entrar a <https://search.google.com/search-console/>.
2. Agregar una propiedad de tipo **Prefijo de URL** con la URL oficial completa.
3. Elegir verificación mediante **Etiqueta HTML**.
4. Copiar solamente el valor de `content`, no toda la etiqueta.
5. Guardarlo en Vercel como:

   ```text
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=valor_entregado_por_google
   ```

6. Volver a desplegar y pulsar **Verificar** en Search Console.
7. En **Sitemaps**, enviar `sitemap.xml`.
8. En **Inspección de URLs**, solicitar indexación inicialmente para:

   - `/`
   - `/nosotros`
   - `/cursos`
   - `/voluntariado`
   - `/convocatorias`
   - `/blog`

No es necesario solicitar todas las URLs: el sitemap y los enlaces internos
permiten que Google descubra el resto.

## 3. Bing y buscadores relacionados

1. Entrar a <https://www.bing.com/webmasters/>.
2. Importar la propiedad desde Google Search Console o agregarla manualmente.
3. Si se usa metaetiqueta, guardar su valor en Vercel:

   ```text
   NEXT_PUBLIC_BING_SITE_VERIFICATION=valor_entregado_por_bing
   ```

4. Volver a desplegar y enviar también `sitemap.xml`.

Brave Search mantiene un índice independiente y actualmente no ofrece un panel
equivalente para solicitar posiciones. Debe poder rastrear las mismas páginas
públicas que Google: sin `noindex`, sin bloqueo en `robots.txt`, con sitemap,
enlaces internos y enlaces legítimos desde otros sitios.

## 4. Autoridad real de la marca

Para ganar la búsqueda de marca “SEP” y “Semillero de Emprendedores Perú”:

- colocar la URL oficial en LinkedIn, Instagram, Facebook y TikTok;
- pedir a SENAJU, universidades, colegios y aliados que enlacen la web de SEP
  desde las páginas donde ya mencionan a la organización;
- usar siempre el mismo nombre: **Semillero de Emprendedores Perú (SEP)**;
- publicar notas propias sobre programas, resultados, eventos y alianzas;
- enlazar cada nota hacia cursos, voluntariado, colegios o convocatorias según
  corresponda.

No comprar enlaces, no repetir palabras clave artificialmente y no copiar
artículos de otras webs. Eso puede perjudicar el posicionamiento.

## 5. Contenido recomendado

Publicar por lo menos dos piezas útiles al mes alrededor de búsquedas concretas:

- “Cursos gratuitos de emprendimiento para jóvenes en Perú”;
- “Qué es Design Thinking y cómo aplicarlo a un emprendimiento”;
- “Voluntariado para universitarios en Perú: cómo empezar”;
- “Programas de liderazgo juvenil en regiones del Perú”;
- crónicas de talleres y resultados por región, colegio o universidad;
- perfiles de proyectos y jóvenes formados por SEP.

Cada artículo necesita título descriptivo, introducción clara, autor, fecha,
fuentes confiables, imágenes propias con texto alternativo y enlaces internos.

## 6. Seguimiento mensual

En Search Console revisar:

- consultas que muestran la página;
- impresiones, clics, CTR y posición promedio;
- páginas indexadas y motivos de exclusión;
- experiencia y Core Web Vitals;
- crecimiento de consultas de marca y consultas no relacionadas con la marca.

El comando `site:dominio` sirve como comprobación rápida, pero la Inspección de
URLs de Search Console es la fuente confiable para saber si una página está
indexada.


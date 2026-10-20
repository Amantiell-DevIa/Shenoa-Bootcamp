Abraham, aquí tienes la **V2 5/5** convertida en un **plano de ejecución directo para Qwen AI**.

Este documento está pensado para que lo copies y lo pegues como instrucción técnica.  
La regla principal es simple:

> **No se cambia el copy existente.**  
> Solo se agrega copy estrictamente funcional cuando una función técnica lo requiera, y queda marcado como `COPY_FUNCIONAL`.

---

# PROMPT MAESTRO PARA QWEN AI — IMPLEMENTACIÓN V2 5/5 LANDING “CÍRCULO GOLD”

## 0. ROL Y OBJETIVO

Actúa como un desarrollador frontend senior especializado en landing pages premium de alta conversión, performance, accesibilidad y SEO técnico.

Tu objetivo es construir una landing page production-ready para **“Círculo Gold”**, un programa de formación sobre inversión en joyería, oro, piedras preciosas y relojes.

Debes generar una implementación completa, limpia, modular, rápida y lista para producción, respetando de forma absoluta el copy proporcionado.

No debes reescribir, mejorar, corregir ni adaptar el copy existente.  
El copy actual es un requisito funcional y de negocio.

---

## 1. REGLAS INNNEGOCIABLES

### 1.1 Copy bloqueado

No modificar ninguna cadena textual visible incluida en el `COPY_LOCK`.

Esto incluye:

- mayúsculas,
- minúsculas,
- acentos,
- errores ortográficos si existen,
- signos de puntuación,
- emojis,
- símbolos monetarios,
- flechas `↓` y `→`,
- puntos,
- comas,
- frases coloquiales,
- tono colombiano funcional.

No corregir expresiones como:

- `plata`,
- `cuentos`,
- `jugárte la plata a ciegas`,
- `Encaminate`,
- `JOYERIA`,
- `NO QUEDARA UNA DUDA SUELTA.`

El copy se mantiene exactamente como está.

---

### 1.2 Estructura bloqueada

Mantener las 14 secciones en este orden exacto:

1. `#inicio`
2. `#dudas`
3. `#seguridad`
4. `#posibilidad`
5. `#circulo-gold`
6. `#comunidad`
7. `#incluye-gold`
8. `#testimonios`
9. `#transformacion`
10. `#precio-gold`
11. `#empezar-hoy`
12. `#circulo-acero`
13. `#preguntas-frecuentes`
14. `#cierre`

No eliminar secciones.  
No reordenar secciones.  
No fusionar secciones.

---

### 1.3 No inventar contenido

No inventar:

- testimonios,
- cifras de alumnos,
- número de piezas revisadas,
- garantías no declaradas,
- resultados financieros,
- urgencias falsas,
- contadores falsos,
- descuentos no indicados,
- claims de rentabilidad.

Si una sección indica que algo está pendiente, se mantiene pendiente.

---

### 1.4 Copy nuevo permitido

Solo se permite agregar copy nuevo cuando sea estrictamente funcional o técnico.

Ejemplos permitidos:

- textos `aria-label`,
- skip link,
- alt técnico de imágenes decorativas,
- estado de carga,
- cierre de modal,
- año dinámico en footer,
- labels de botones de accesibilidad.

Todo copy nuevo debe provenir únicamente de la sección llamada `COPY_FUNCIONAL`.

---

### 1.5 Estilo visual

La landing debe sentirse:

- premium,
- sobria,
- dorada,
- oscura,
- elegante,
- clara,
- confiable,
- mobile-first.

Estética recomendada:

- fondo oscuro profundo,
- detalles dorados,
- textos claros,
- cards con bordes sutiles,
- sombras suaves,
- animaciones elegantes,
- nada de estilo agresivo tipo casino,
- nada de gradientes excesivos,
- nada de efectos baratos.

---

### 1.6 Entrega esperada

Debes entregar una solución completa con:

- HTML final,
- bloques HTML modulares,
- CSS organizado,
- JavaScript modular,
- configuración JSON,
- schema JSON-LD,
- instrucciones de build,
- checklist de QA.

No entregues solo explicaciones.

Entrega código.

---

# 2. ARQUITECTURA TÉCNICA

## 2.1 Estructura de archivos recomendada

Genera esta estructura:

```txt
/circulo-gold/
  index.html
  preview.html

  /src/
    /templates/
      index.template.html

    /blocks/
      block-01.html
      block-02.html
      block-03.html
      block-04.html
      block-05.html
      block-06.html
      block-07.html
      block-08.html
      block-09.html
      block-10.html
      block-11.html
      block-12.html
      block-13.html
      block-14.html

    /css/
      base.css
      theme.css
      layout.css
      components.css
      blocks.css

    /js/
      main.js
      config.js
      analytics.js
      reveal.js
      accordion.js
      chat-simulation.js
      sticky-cta.js
      checkout-links.js
      theme-toggle.js
      magnetic-button.js
      utils.js

    /data/
      config.json

    /assets/
      /img/
      /fonts/

  /scripts/
    build.js

  /dist/
```

---

## 2.2 Filosofía de construcción

El sitio debe funcionar como un sistema modular.

Cada sección debe existir como bloque independiente:

```txt
block-01.html
block-02.html
...
block-14.html
```

El archivo `index.template.html` debe contener marcadores como:

```html
<!-- BLOCK:01 -->
<!-- BLOCK:02 -->
<!-- BLOCK:03 -->
<!-- BLOCK:04 -->
<!-- BLOCK:05 -->
<!-- BLOCK:06 -->
<!-- BLOCK:07 -->
<!-- BLOCK:08 -->
<!-- BLOCK:09 -->
<!-- BLOCK:10 -->
<!-- BLOCK:11 -->
<!-- BLOCK:12 -->
<!-- BLOCK:13 -->
<!-- BLOCK:14 -->
```

El script `scripts/build.js` debe inyectar los bloques en orden y generar `dist/index.html`.

El archivo `preview.html` puede existir solo para desarrollo, pero producción debe usar `dist/index.html`.

---

## 2.3 Sin frameworks pesados

No usar React, Vue, Angular, Svelte ni Next.js.

Usar:

- HTML semántico,
- CSS moderno,
- JavaScript vanilla ES Modules.

No usar jQuery.

No usar librerías externas salvo que sea estrictamente necesario.

Si se usa alguna librería de animación, debe cargarse de forma diferida y solo bajo feature flag.

Prioridad absoluta:

> rendimiento, claridad, mantenibilidad y conversión.

---

# 3. CONFIGURACIÓN GLOBAL

Crear `/src/data/config.json`.

Contenido mínimo:

```json
{
  "site": {
    "name": "Círculo Gold",
    "yearSelector": "[data-year]"
  },
  "checkout": {
    "gold": "",
    "acero": ""
  },
  "features": {
    "stickyCta": true,
    "chatAnimation": true,
    "revealAnimations": true,
    "magneticButtons": true,
    "exitIntent": false,
    "themeToggle": false,
    "premiumAnimations": false
  },
  "analytics": {
    "enabled": true,
    "dataLayerName": "dataLayer"
  },
  "fallbackAnchors": {
    "gold": "#precio-gold",
    "acero": "#circulo-acero"
  }
}
```

---

## 3.1 Comportamiento de checkout

Los botones de compra deben usar la URL definida en `config.checkout`.

Botones de compra Gold:

- sección 07: `QUIERO ENTRAR A CÍRCULO GOLD — $297 →`
- sección 10: `QUIERO ENTRAR A CÍRCULO GOLD — $297 →`
- sección 11: `QUIERO EMPEZAR CON CÍRCULO GOLD →`
- sección 14: `QUIERO ENTRAR A CÍRCULO GOLD →`

Botones de compra Acero:

- sección 12: `EMPEZAR CON CÍRCULO ACERO — $97 →`
- sección 14: `CÍRCULO ACERO — $97`

Si `checkout.gold` o `checkout.acero` están vacíos:

1. El botón no debe quedar roto.
2. Debe usar el fallback correspondiente:
   - Gold: `#precio-gold`
   - Acero: `#circulo-acero`
3. Debe disparar el evento:

```js
checkout_url_missing
```

Propiedades:

```js
{
  plan: 'gold' | 'acero',
  section: 'block-07' | 'block-10' | etc.
}
```

---

# 4. ESPECIFICACIÓN BLOQUE POR BLOQUE

Cada bloque debe cumplir:

- tener una etiqueta `<section>`,
- tener el ID exacto indicado,
- tener `data-block`,
- tener `data-analytics-block`,
- usar el copy exacto del `COPY_LOCK`,
- ser responsive,
- tener animación de aparición suave si `features.revealAnimations` está activo,
- respetar `prefers-reduced-motion`.

Estructura base recomendada:

```html
<section id="inicio" class="block block-01" data-block="01" data-analytics-block="hero">
  ...
</section>
```

---

## BLOQUE 01 — HERO / CURIOSIDAD

ID:

```txt
#inicio
```

Objetivo:

- capturar atención,
- presentar promesa principal,
- generar identificación,
- llevar a descubrir Círculo Gold.

Componentes:

- eyebrow,
- H1,
- subtítulo,
- barra de etiquetas,
- cuerpo corto,
- CTA principal,
- microcopy.

CTA:

```txt
DESCUBRIR CÍRCULO GOLD ↓
```

Comportamiento del CTA:

- debe ser un ancla hacia `#circulo-gold`,
- scroll suave,
- tracking:

```js
cta_click
```

Propiedades:

```js
{
  cta: 'discover_gold',
  plan: 'gold',
  section: 'block-01',
  destination: '#circulo-gold'
}
```

Animaciones:

- entrada escalonada de eyebrow, H1, subtítulo, tags, cuerpo, CTA y microcopy,
- sutil gold shine en el H1, solo si `premiumAnimations` está activo,
- CTA con efecto hover premium.

Accesibilidad:

- H1 único de la página,
- CTA con foco visible.

---

## BLOQUE 02 — OBJECIONES E IDENTIFICACIÓN

ID:

```txt
#dudas
```

Objetivo:

- reflejar miedos reales,
- generar identificación,
- reducir fricción.

Componentes:

- eyebrow,
- H2,
- 3 tarjetas de objeción,
- cierre.

Cada objeción debe mostrarse como card interactiva o acordeón ligero.

Si se usa acordeón:

- cada pregunta debe ser un botón,
- debe tener `aria-expanded`,
- debe funcionar con teclado,
- la respuesta debe estar en un panel asociado.

Animaciones:

- entrada stagger de las objeciones,
- apertura suave si se usa acordeón.

Tracking:

```js
faq_objection_toggle
```

Propiedades:

```js
{
  section: 'block-02',
  objection_id: '01' | '02' | '03',
  state: 'open' | 'closed'
}
```

---

## BLOQUE 03 — SEGURIDAD Y TRANSPARENCIA

ID:

```txt
#seguridad
```

Objetivo:

- bajar la presión de venta,
- aumentar credibilidad,
- dejar claro que no hay promesas de dinero fácil.

Componentes:

- eyebrow,
- H2,
- cuerpo,
- frase destacada.

Diseño:

- card sobrio,
- borde suave,
- fondo ligeramente distinto,
- frase destacada en estilo quote o highlight dorado.

Animación:

- reveal suave,
- frase destacada con fade-in retardado.

No agregar CTA.

---

## BLOQUE 04 — POSIBILIDAD Y MERCADOS

ID:

```txt
#posibilidad
```

Objetivo:

- mostrar los 4 mercados.

Componentes:

- H2,
- subtítulo,
- 4 tarjetas,
- cierre.

Tarjetas:

1. ORO
2. JOYAS
3. PIEDRAS PRECIOSAS
4. RELOJES

Diseño:

- grid responsive,
- cards con hover sutil,
- numeración visible,
- micro-interacción al hover.

Animaciones:

- entrada stagger,
- elevación sutil en hover.

No agregar botones de compra en este bloque.

---

## BLOQUE 05 — PRESENTACIÓN CÍRCULO GOLD

ID:

```txt
#circulo-gold
```

Objetivo:

- presentar formalmente el programa.

Componentes:

- eyebrow,
- H2,
- cuerpo,
- lista de pilares,
- CTA secundario.

Pilares:

```txt
APRENDER · PREGUNTAR · ENCONTRAR · VENDER
```

CTA:

```txt
VER TODO LO QUE HAY DENTRO ↓
```

Comportamiento:

- ancla hacia `#incluye-gold`,
- scroll suave.

Tracking:

```js
cta_click
```

Propiedades:

```js
{
  cta: 'view_inside',
  plan: 'gold',
  section: 'block-05',
  destination: '#incluye-gold'
}
```

Diseño:

- sección con sensación de revelación,
- pilares como chips o mini cards.

---

## BLOQUE 06 — COMUNIDAD Y MENTORÍAS EN VIVO

ID:

```txt
#comunidad
```

Objetivo:

- mostrar acompañamiento,
- reducir miedo a estar solo,
- simular visualmente una mentoría activa.

Componentes:

- interfaz tipo chat,
- cabecera de comunidad,
- mensajes alumno/mentor,
- H2,
- texto,
- cierre.

Importante:

No agregar un input real de mensaje.  
No simular que el usuario puede escribir aquí.  
Es una muestra visual.

Estructura del chat:

```txt
Comunidad Privada Círculo Gold — Mentoría Activa • En línea
```

Mensajes:

- alumno,
- mentor,
- alumno,
- mentor.

Animación:

- los mensajes deben aparecer progresivamente cuando el bloque entra en viewport,
- se puede mostrar un indicador visual de “escribiendo” sin texto,
- si `prefers-reduced-motion`, mostrar mensajes estáticos.

Accesibilidad:

- usar `role="log"` o `aria-live="polite"` con cuidado,
- no anunciar constantemente.

Tracking:

```js
chat_view
```

Propiedades:

```js
{
  section: 'block-06'
}
```

Diseño:

- estilo mensajería premium,
- burbujas diferenciadas alumno/mentor,
- estado “En línea” con punto verde sutil.

---

## BLOQUE 07 — TODO LO QUE INCLUYE GOLD

ID:

```txt
#incluye-gold
```

Objetivo:

- aumentar percepción de valor,
- mostrar stack del programa,
- generar primer CTA fuerte de compra.

Componentes:

- eyebrow,
- H2,
- estadísticas,
- píldoras de características,
- banner de precio,
- CTA de compra.

Estadísticas:

```txt
60 DÍAS
6 MÓDULOS
1 / SEMANA
24/7
```

Comportamiento:

- los números pueden tener count-up suave,
- el texto final debe permanecer idéntico,
- si `prefers-reduced-motion`, mostrar números estáticos.

Píldoras:

- cards pequeñas,
- layout fluido,
- destacar las que dicen `EXTRA:`.

Banner de precio:

```txt
ACCESO COMPLETO A CÍRCULO GOLD — $297 USD
```

CTA:

```txt
QUIERO ENTRAR A CÍRCULO GOLD — $297 →
```

Comportamiento:

- botón de checkout Gold,
- usar `checkout.gold`,
- fallback si está vacío,
- tracking `checkout_click`.

Propiedades:

```js
{
  cta: 'buy_gold',
  plan: 'gold',
  section: 'block-07',
  price: 297,
  currency: 'USD'
}
```

Diseño:

- este bloque debe sentirse como offer stack premium,
- jerarquía clara,
- precio destacado,
- CTA visible sin exceso de ruido.

---

## BLOQUE 08 — PRUEBA SOCIAL / TESTIMONIOS

ID:

```txt
#testimonios
```

Objetivo:

- espacio para prueba social real,
- mantener transparencia.

Estado actual:

- testimonios pendientes.

Regla crítica:

No inventar testimonios.

Componentes:

- eyebrow,
- H2,
- subtítulo,
- nota de transparencia.

Nota visible exacta:

```txt
Testimonios pendientes — se publican solo cuando sean reales y verificables.
```

Implementación:

Crear un contenedor dinámico:

```html
<div data-slot="testimonials"></div>
```

Si `testimonials` está vacío:

- mostrar la nota de transparencia,
- no mostrar carousel,
- no mostrar cards vacías falsas.

Si en el futuro hay testimonios, el componente debe soportar:

- nombre,
- texto,
- país,
- imagen opcional,
- video opcional,
- badge de verificación opcional.

Pero no debes generar datos ficticios.

Tracking:

```js
testimonials_view
```

Propiedades:

```js
{
  section: 'block-08',
  has_testimonials: false
}
```

---

## BLOQUE 09 — TRANSFORMACIÓN / FUTURE PACING

ID:

```txt
#transformacion
```

Objetivo:

- mostrar el antes y el después mental del usuario.

Componentes:

- eyebrow,
- H2,
- tarjeta ANTES,
- tarjeta AHORA CON GOLD.

Diseño:

- layout comparativo,
- tarjeta ANTES más opaca o gris,
- tarjeta AHORA con acento dorado,
- animación de contraste al entrar en viewport.

Interacción opcional:

- en mobile, toggle o swipe entre antes/después,
- en desktop, cards lado a lado.

No cambiar textos.

Tracking:

```js
transformation_view
```

Propiedades:

```js
{
  section: 'block-09'
}
```

---

## BLOQUE 10 — OFERTA PRINCIPAL GOLD

ID:

```txt
#precio-gold
```

Objetivo:

- conversión principal.

Componentes:

- eyebrow,
- H2,
- precio,
- argumento,
- CTA.

Precio:

```txt
$297
```

CTA:

```txt
QUIERO ENTRAR A CÍRCULO GOLD — $297 →
```

Comportamiento:

- checkout Gold,
- fallback si no hay URL,
- tracking.

Propiedades:

```js
{
  cta: 'buy_gold',
  plan: 'gold',
  section: 'block-10',
  price: 297,
  currency: 'USD'
}
```

Diseño:

- card principal premium,
- precio grande,
- botón de alta jerarquía,
- foco visual claro.

No agregar garantía inventada.

No agregar bullets nuevos.

---

## BLOQUE 11 — DECISIÓN Y URGENCIA / FOMO

ID:

```txt
#empezar-hoy
```

Objetivo:

- impulsar acción sin recurrir a escasez falsa.

Componentes:

- insignia,
- H2,
- cuerpo,
- frase de cierre,
- CTA.

Insignia:

```txt
🔴 CUPOS LIMITADOS
```

CTA:

```txt
QUIERO EMPEZAR CON CÍRCULO GOLD →
```

Comportamiento:

- checkout Gold,
- fallback si no hay URL,
- tracking.

Propiedades:

```js
{
  cta: 'buy_gold_urgency',
  plan: 'gold',
  section: 'block-11',
  price: 297,
  currency: 'USD'
}
```

Diseño:

- badge con pulso muy sutil,
- sección emocional,
- CTA fuerte.

No agregar contador si no hay fecha real configurada.

---

## BLOQUE 12 — OFERTA ACCESIBLE ACERO

ID:

```txt
#circulo-acero
```

Objetivo:

- downsell / opción de entrada.

Componentes:

- eyebrow,
- H2,
- subtítulo,
- estadísticas,
- píldoras,
- precio,
- CTA.

Precio:

```txt
ACCESO COMPLETO A CÍRCULO ACERO — $97 USD
```

CTA:

```txt
EMPEZAR CON CÍRCULO ACERO — $97 →
```

Comportamiento:

- checkout Acero,
- fallback si no hay URL,
- tracking.

Propiedades:

```js
{
  cta: 'buy_acero',
  plan: 'acero',
  section: 'block-12',
  price: 97,
  currency: 'USD'
}
```

Diseño:

- card más ligera visualmente que Gold,
- color acero/gris,
- jerarquía menor que Gold pero clara.

---

## BLOQUE 13 — PREGUNTAS FRECUENTES

ID:

```txt
#preguntas-frecuentes
```

Objetivo:

- resolver objeciones finales.

Componentes:

- eyebrow,
- H2,
- acordeón FAQ.

Requisitos del acordeón:

- cada pregunta debe ser un botón,
- cada respuesta debe ser un panel,
- debe funcionar con teclado,
- debe tener `aria-expanded`,
- debe tener `aria-controls`,
- debe animar apertura/cierre con altura,
- debe respetar `prefers-reduced-motion`.

Preguntas pendientes:

Las preguntas 7 y 8 tienen respuestas pendientes.

No ocultarlas.

Deben verse.

Agregar clase:

```css
.is-pending
```

No agregar texto visible nuevo salvo si se usa `COPY_FUNCIONAL`.

Tracking:

```js
faq_toggle
```

Propiedades:

```js
{
  section: 'block-13',
  question_id: 'faq-01',
  state: 'open' | 'closed'
}
```

Schema:

- generar `FAQPage` JSON-LD,
- excluir del schema las preguntas marcadas como pendientes si se considera riesgoso para rich results,
- pero mantenerlas visibles en HTML.

---

## BLOQUE 14 — CIERRE FINAL Y FOOTER

ID:

```txt
#cierre
```

Objetivo:

- cierre final,
- última oportunidad de conversión,
- footer legal.

Componentes:

- H2,
- palabras clave,
- frase de cierre,
- opción Gold,
- opción Acero,
- footer.

CTA Gold:

```txt
QUIERO ENTRAR A CÍRCULO GOLD →
```

CTA Acero:

```txt
CÍRCULO ACERO — $97
```

Comportamiento:

- Gold usa checkout Gold,
- Acero usa checkout Acero,
- fallbacks si están vacíos,
- tracking.

Footer:

```txt
Círculo Gold
Términos y condiciones
© [Año Actual] Círculo Gold.
```

El placeholder `[Año Actual]` debe reemplazarse dinámicamente por el año actual mediante JavaScript.

Ejemplo:

```html
<span data-year></span>
```

Tracking:

```js
cta_click
```

Para Gold:

```js
{
  cta: 'final_buy_gold',
  plan: 'gold',
  section: 'block-14',
  price: 297,
  currency: 'USD'
}
```

Para Acero:

```js
{
  cta: 'final_buy_acero',
  plan: 'acero',
  section: 'block-14',
  price: 97,
  currency: 'USD'
}
```

---

# 5. COMPONENTES GLOBALES

## 5.1 Sticky CTA móvil

Crear una barra inferior fija para móvil.

Debe activarse si:

```json
features.stickyCta = true
```

Comportamiento:

- aparece después de que el usuario pasa el bloque 01,
- se oculta cuando `#precio-gold`, `#circulo-acero` o `#cierre` están mayormente visibles,
- debe ser touch-friendly,
- debe tener alto contraste,
- no debe tapar contenido crítico,
- debe incluir safe-area insets.

Botón principal:

```txt
QUIERO ENTRAR A CÍRCULO GOLD — $297 →
```

Acción:

- checkout Gold,
- fallback si no hay URL.

Tracking:

```js
sticky_cta_view
sticky_cta_click
```

Propiedades:

```js
{
  cta: 'sticky_buy_gold',
  plan: 'gold',
  section: 'global',
  price: 297,
  currency: 'USD'
}
```

No agregar copy nuevo visible salvo el CTA existente.

---

## 5.2 Scroll progress bar

Agregar una barra superior delgada de progreso de scroll.

Sin texto.

Características:

- altura 2px o 3px,
- color dorado,
- opaca pero elegante,
- animación con `transform: scaleX()`,
- no debe causar layout shift.

---

## 5.3 Botón magnético

Aplicar solo si:

```json
features.magneticButtons = true
```

Aplicar solo a:

- CTA principal del hero,
- CTA principal de compra Gold.

Comportamiento:

- efecto magnético suave en desktop,
- desplazamiento máximo de 6px a 10px,
- desactivar en móvil,
- desactivar con `prefers-reduced-motion`.

No cambiar texto.

---

## 5.4 Revelado al scroll

Crear módulo `reveal.js`.

Debe usar IntersectionObserver.

Clases:

```css
[data-reveal]
[data-reveal].is-revealed
```

Variantes:

```css
[data-reveal="fade"]
[data-reveal="up"]
[data-reveal="left"]
[data-reveal="right"]
[data-reveal="stagger"]
```

Reglas:

- animar solo `opacity` y `transform`,
- duración entre 400ms y 800ms,
- easing suave,
- desactivar si `prefers-reduced-motion`,
- no animar elementos críticos antes de que sean visibles.

---

## 5.5 Exit intent opcional

Crear módulo `exit-intent.js`.

Debe estar desactivado por defecto:

```json
features.exitIntent: false
```

Si se activa:

- solo desktop,
- una sola vez por sesión,
- no invasivo,
- debe poder cerrarse fácilmente,
- debe usar únicamente copy de `COPY_FUNCIONAL`.

Tracking:

```js
exit_intent_view
exit_intent_cta_click
exit_intent_close
```

---

# 6. SISTEMA DE DISEÑO CSS

## 6.1 Variables CSS

Si el proyecto ya usa variables como `--color-primary` o `--spacing-lg`, respetarlas.

Si no existen, crear un sistema base:

```css
:root {
  --color-bg: #080705;
  --color-bg-alt: #0e0c08;
  --color-surface: #141109;
  --color-surface-alt: #1b170d;

  --color-primary: #d4af37;
  --color-primary-soft: #e8cf8a;
  --color-primary-dark: #9c7c1e;

  --color-text: #f6f1e7;
  --color-text-muted: rgba(246, 241, 231, 0.72);
  --color-text-soft: rgba(246, 241, 231, 0.56);

  --color-border: rgba(212, 175, 55, 0.18);
  --color-border-strong: rgba(212, 175, 55, 0.38);

  --color-success: #39d98a;
  --color-warning: #ffb020;
  --color-error: #ff6b6b;

  --font-display: "Playfair Display", "Georgia", serif;
  --font-body: "Inter", "Helvetica Neue", Arial, sans-serif;

  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 999px;

  --spacing-xs: 8px;
  --spacing-sm: 12px;
  --spacing-md: 20px;
  --spacing-lg: 32px;
  --spacing-xl: 56px;
  --spacing-2xl: 88px;

  --shadow-soft: 0 10px 30px rgba(0, 0, 0, 0.25);
  --shadow-gold: 0 0 0 1px rgba(212, 175, 55, 0.14), 0 18px 60px rgba(0, 0, 0, 0.35);

  --transition-fast: 180ms ease;
  --transition-base: 320ms cubic-bezier(0.22, 1, 0.36, 1);
  --transition-slow: 600ms cubic-bezier(0.22, 1, 0.36, 1);

  --z-header: 50;
  --z-sticky: 70;
  --z-modal: 100;
  --z-progress: 120;
}
```

---

## 6.2 Dark / Light mode

Si el proyecto ya tiene `data-theme`, respetarlo.

Si no, preparar soporte:

```css
[data-theme="light"] {
  --color-bg: #f7f3ea;
  --color-bg-alt: #efe8da;
  --color-surface: #fffdf8;
  --color-text: #171309;
  --color-text-muted: rgba(23, 19, 9, 0.72);
  --color-border: rgba(120, 90, 10, 0.16);
}
```

No agregar botón de theme toggle si no existe en el diseño actual, salvo que:

```json
features.themeToggle = true
```

---

## 6.3 Botones

Crear clases:

```css
.btn
.btn-primary
.btn-secondary
.btn-ghost
.btn-block
.btn-gold-shine
```

Estado obligatorio:

```css
.btn:hover
.btn:focus-visible
.btn:active
.btn[aria-disabled="true"]
```

Botón primario:

- fondo dorado,
- texto oscuro,
- radius pill o medio,
- hover con brillo sutil,
- foco visible accesible.

Botón secundario:

- borde dorado,
- fondo transparente,
- texto claro.

---

## 6.4 Cards

Crear clases:

```css
.card
.card-muted
.card-gold
.card-acero
.card-pending
```

Estados:

```css
.card:hover
.card:focus-within
```

---

## 6.5 Estados pendientes

Para testimonios y FAQ pendientes:

```css
.is-pending {
  border-style: dashed;
  opacity: 0.92;
}
```

No ocultar contenido pendiente.

---

# 7. JAVASCRIPT

## 7.1 Módulos obligatorios

Crear:

```txt
main.js
config.js
analytics.js
reveal.js
accordion.js
chat-simulation.js
sticky-cta.js
checkout-links.js
theme-toggle.js
magnetic-button.js
utils.js
```

`main.js` debe inicializar todo según `features`.

Ejemplo:

```js
import { loadConfig } from './config.js';
import { initAnalytics } from './analytics.js';
import { initReveal } from './reveal.js';
import { initAccordions } from './accordion.js';
import { initChatSimulation } from './chat-simulation.js';
import { initStickyCta } from './sticky-cta.js';
import { initCheckoutLinks } from './checkout-links.js';
import { initMagneticButtons } from './magnetic-button.js';
import { initThemeToggle } from './theme-toggle.js';
import { initFooterYear } from './utils.js';

async function init() {
  const config = await loadConfig();

  initAnalytics(config);
  initFooterYear();

  if (config.features.revealAnimations) initReveal();
  if (config.features.stickyCta) initStickyCta(config);
  if (config.features.chatAnimation) initChatSimulation();
  if (config.features.magneticButtons) initMagneticButtons();
  if (config.features.themeToggle) initThemeToggle();

  initAccordions();
  initCheckoutLinks(config);
}

init();
```

---

## 7.2 Analytics

Crear cola compatible con dataLayer:

```js
window.dataLayer = window.dataLayer || [];

export function track(event, props = {}) {
  window.dataLayer.push({
    event,
    ...props,
    timestamp: Date.now(),
    path: window.location.pathname,
    url: window.location.href
  });
}
```

Si existe `gtag`, enviar también a GA4.

Eventos obligatorios:

```txt
page_ready
block_view
cta_click
checkout_click
checkout_url_missing
faq_toggle
faq_objection_toggle
chat_view
sticky_cta_view
sticky_cta_click
transformation_view
testimonials_view
exit_intent_view
exit_intent_cta_click
exit_intent_close
```

---

## 7.3 Block view

Usar IntersectionObserver para disparar:

```js
block_view
```

Propiedades:

```js
{
  block_id: 'block-01',
  section_id: 'inicio'
}
```

Disparar una sola vez por bloque.

---

## 7.4 Checkout links

Todos los CTAs de compra deben tener atributos:

```html
data-checkout-plan="gold"
data-checkout-section="block-10"
data-price="297"
data-currency="USD"
```

El módulo `checkout-links.js` debe:

1. leer config,
2. asignar `href`,
3. interceptar clic para tracking,
4. permitir navegación normal si hay URL externa.

Ejemplo:

```html
<a
  class="btn btn-primary"
  data-checkout-plan="gold"
  data-checkout-section="block-10"
  data-price="297"
  data-currency="USD"
>
  QUIERO ENTRAR A CÍRCULO GOLD — $297 →
</a>
```

---

# 8. SEO Y SCHEMA

## 8.1 Meta tags básicas

Usar título derivado del copy existente:

```html
<title>Círculo Gold — APRENDE A GANAR DINERO EXTRA CON LA JOYERIA</title>
```

Meta description derivada:

```txt
No se trata de la pieza. Se trata de qué haces con ella. Sin aparentar. Sin comerte cuentos. Sin jugarte la plata a ciegas.
```

Esto se considera derivado técnico del copy existente, no copy nuevo de marketing.

Agregar:

```html
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

---

## 8.2 JSON-LD obligatorio

Generar un `@graph` con:

1. `Organization`
2. `Person` para Shenoa / ElReydel18K
3. `Person` para BlingBling
4. `Course` para Círculo Gold
5. `Course` para Círculo Acero
6. `Offer` para Gold
7. `Offer` para Acero
8. `FAQPage`

No usar `AggregateRating`.

No inventar reviews.

---

## 8.3 Course schema — Círculo Gold

Datos:

```txt
name: Círculo Gold
description: No se trata de la pieza. Se trata de qué haces con ella.
price: 297
priceCurrency: USD
```

No agregar fechas si no existen.

No agregar URL de checkout si está vacía.

---

## 8.4 Course schema — Círculo Acero

Datos:

```txt
name: Círculo Acero
description: UNA FORMA MÁS LIGERA DE EMPEZAR
price: 97
priceCurrency: USD
```

---

## 8.5 FAQ schema

Generar FAQPage a partir de las preguntas del bloque 13.

Excluir opcionalmente del schema las preguntas con clase `.is-pending` si se desea maximizar calidad de rich results.

Pero las preguntas pendientes sí deben estar visibles en HTML.

---

# 9. PERFORMANCE

## 9.1 Objetivos

La landing debe apuntar a:

- LCP menor a 2.0s en móvil,
- CLS menor a 0.1,
- INP menor a 200ms,
- TBT bajo,
- JavaScript inicial mínimo,
- CSS crítico optimizado.

---

## 9.2 CSS

- Extraer critical CSS para above-the-fold.
- Cargar CSS no crítico de forma diferida.
- Eliminar selectores no usados.
- No cargar librerías CSS pesadas.

---

## 9.3 JavaScript

- Usar `type="module"`.
- Cargar `main.js` con `defer`.
- No bloquear render.
- Usar dynamic imports solo para funciones opcionales pesadas.
- No cargar animaciones pesadas si no son necesarias.

---

## 9.4 Imágenes

Si se usan imágenes:

- entregar versiones AVIF y WebP,
- usar `<picture>`,
- usar `srcset` si aplica,
- usar `loading="lazy"` para imágenes below-the-fold,
- usar `fetchpriority="high"` para imagen hero si existe,
- definir `width` y `height` para evitar CLS.

Si no hay imágenes reales:

- usar fondos CSS elegantes,
- gradientes dorados sutiles,
- texturas ligeras,
- no usar imágenes placeholder falsas.

---

## 9.5 Fuentes

Si se usan fuentes externas:

- preload de la fuente crítica,
- `font-display: swap`,
- subset latino,
- máximo 2 familias,
- máximo 3-4 pesos.

---

# 10. ACCESIBILIDAD

## 10.1 Requisitos generales

- HTML semántico,
- un solo H1,
- jerarquía correcta de headings,
- foco visible,
- contraste suficiente,
- botones accesibles,
- navegación por teclado,
- skip link.

---

## 10.2 Skip link

Agregar al inicio del body:

```html
<a class="skip-link" href="#contenido-principal">Saltar al contenido</a>
```

Este texto proviene de `COPY_FUNCIONAL`.

El main debe tener:

```html
<main id="contenido-principal">
```

---

## 10.3 FAQ accesible

Cada FAQ debe funcionar con:

- Tab,
- Enter,
- Space,
- flechas si se implementa navegación entre preguntas.

Cada botón debe tener:

```html
aria-expanded="false"
aria-controls="faq-panel-01"
```

Cada panel debe tener:

```html
id="faq-panel-01"
role="region"
aria-labelledby="faq-question-01"
```

---

## 10.4 Reduced motion

Respetar:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Además, JS debe detectar:

```js
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Si está activo:

- no count-up,
- no chat typing,
- no magnetic buttons,
- no parallax,
- reveal instantáneo.

---

# 11. TRACKING Y CRO

## 11.1 Atributos recomendados

Agregar atributos para testing futuro:

```html
data-ab-slot="hero-title"
data-ab-slot="hero-cta"
data-ab-slot="gold-offer"
data-ab-slot="acero-offer"
data-ab-slot="faq"
```

No modificar texto.

Solo preparar capacidad de experimentación.

---

## 11.2 Eventos mínimos por bloque

### Block 01

```txt
block_view
cta_click
```

### Block 02

```txt
block_view
faq_objection_toggle
```

### Block 03

```txt
block_view
```

### Block 04

```txt
block_view
```

### Block 05

```txt
block_view
cta_click
```

### Block 06

```txt
block_view
chat_view
```

### Block 07

```txt
block_view
checkout_click
```

### Block 08

```txt
block_view
testimonials_view
```

### Block 09

```txt
block_view
transformation_view
```

### Block 10

```txt
block_view
checkout_click
```

### Block 11

```txt
block_view
checkout_click
```

### Block 12

```txt
block_view
checkout_click
```

### Block 13

```txt
block_view
faq_toggle
```

### Block 14

```txt
block_view
checkout_click
```

---

# 12. QA CHECKLIST OBLIGATORIO

Antes de entregar, validar:

## Copy

- [ ] Ningún texto del `COPY_LOCK` fue modificado.
- [ ] Los símbolos `↓`, `→`, `·`, `🔴`, `$`, `€` se mantienen.
- [ ] El footer reemplaza `[Año Actual]` dinámicamente.
- [ ] No se corrigió lenguaje coloquial.
- [ ] No se agregaron testimonios falsos.
- [ ] No se agregaron garantías inventadas.
- [ ] No se agregaron contadores falsos.

---

## Estructura

- [ ] Las 14 secciones están presentes.
- [ ] El orden es exacto.
- [ ] Los IDs son exactos.
- [ ] Solo hay un H1.
- [ ] Los headings mantienen jerarquía correcta.

---

## Funcionalidad

- [ ] Los CTAs de descubrimiento hacen scroll correcto.
- [ ] Los CTAs de compra usan checkout config.
- [ ] Si checkout está vacío, usan fallback.
- [ ] FAQ abre y cierra correctamente.
- [ ] FAQ funciona con teclado.
- [ ] Sticky CTA aparece y desaparece correctamente.
- [ ] Chat simulation no genera errores.
- [ ] El año del footer se actualiza.
- [ ] No hay errores en consola.

---

## Performance

- [ ] No hay layout shift visible.
- [ ] Las animaciones solo usan opacity/transform.
- [ ] JS no bloquea render.
- [ ] CSS crítico está optimizado.
- [ ] Imágenes tienen dimensiones definidas.
- [ ] Lazy loading aplicado correctamente.

---

## SEO

- [ ] Title existe.
- [ ] Meta description existe.
- [ ] Open Graph existe.
- [ ] JSON-LD no contiene datos falsos.
- [ ] FAQ schema está implementado.
- [ ] Course schema está implementado.
- [ ] No hay AggregateRating inventado.

---

## Accesibilidad

- [ ] Skip link funciona.
- [ ] Foco visible funciona.
- [ ] Botones accesibles.
- [ ] Acordeones accesibles.
- [ ] Contraste suficiente.
- [ ] `prefers-reduced-motion` respetado.

---

# 13. COPY_LOCK — TEXTO EXACTO DE LA LANDING

Este bloque es la fuente de verdad.

No modificar ninguna cadena.

```txt
SECCIÓN 01: CURIOSIDAD / HERO (#inicio)

Eyebrow:
PARA TI QUE SABES QUE TU PLATA PUEDE HACER MÁS QUE QUEDARSE QUIETA.

Titular Principal (H1):
APRENDE A GANAR DINERO EXTRA CON LA JOYERIA

Subtitular:
No se trata de la pieza. Se trata de qué haces con ella

Etiquetas de la Barra:
VALOR · DEMANDA · OPORTUNIDAD · MARGEN

Cuerpo de Texto:
Encaminate al rubro de la joyeria con el pie derecho
Eso es Círculo Gold.

Botón Principal (CTA):
DESCUBRIR CÍRCULO GOLD ↓

Microcopy:
Sin aparentar. Sin comerte cuentos. Sin jugarte la plata a ciegas.


SECCIÓN 02: OBJECIONES E IDENTIFICACIÓN (#dudas)

Eyebrow:
ANTES DE MOVER LA PLATA

Titular (H2):
¿TIENES DUDAS?. TRANQUILO, NADIE QUIERE JUGÁRSELA A CIEGAS.

Objeción 01 Pregunta:
01 ¿Y SI COMPRO MAL?

Objeción 01 Respuesta:
Cuando no tienes conocimientos, te pueden ver la cara.

Objeción 02 Pregunta:
02 ¿Y SI ME METEN UN CUENTO?

Objeción 02 Respuesta:
Pilas. Preguntar y comparar con conocimiento te ahorra más de un dolor de cabeza.

Objeción 03 Pregunta:
03 ¿Y DESPUÉS A QUIÉN LE VENDO?

Objeción 03 Respuesta:
Comprar sin pensar en la venta es empezar por la mitad.

Conclusión de Sección:
No tienes que resolver esto solo. Nosotros te enseñamos a resolverlo.


SECCIÓN 03: SEGURIDAD Y TRANSPARENCIA (#seguridad)

Eyebrow:
PRIMERO ENTIENDES. DESPUÉS DECIDES.

Titular (H2):
NADIE TE VA A APURAR A COMPRAR NADA.

Cuerpo de Texto:
Si algo no te cuadra, paras y preguntas.
Círculo Gold no promete ganancias — y desconfía de quien sí te las prometa. Tus resultados dependen de tus decisiones, tu capital y el mercado. Lo que sí te damos es con qué decidir mejor, antes de mover un peso.

Frase Destacada:
Saber cuándo esperar también es parte del negocio.


SECCIÓN 04: POSIBILIDAD Y MERCADOS (#posibilidad)

Titular (H2):
ESTO TAMBIÉN PUEDE SER PARA TI.

Subtítulo:
No necesitas ser “el que sabe de negocios”.

Tarjeta 01 Título:
01 ORO

Tarjeta 01 Texto:
El estándar refugio con demanda infinita y liquidez inmediata.

Tarjeta 02 Título:
02 JOYAS

Tarjeta 02 Texto:
Valor multiplicador por diseño y manufactura, más allá del simple peso.

Tarjeta 03 Título:
03 PIEDRAS PRECIOSAS

Tarjeta 03 Texto:
Los mayores márgenes del mercado si desarrollas el ojo para distinguir calidades.

Tarjeta 04 Título:
04 RELOJES

Tarjeta 04 Texto:
Alta relojería: piezas de ingeniería que se revalorizan con el tiempo.

Cierre de Sección:
Cuatro mundos que empiezas a leer distinto en cuanto sabes qué preguntar.


SECCIÓN 05: PRESENTACIÓN CÍRCULO GOLD (#circulo-gold)

Eyebrow:
EL CÍRCULO COMPLETO

Titular (H2):
CÍRCULO GOLD

Cuerpo de Texto:
No entras solo a ver clases. Entras a un lugar donde aprendes, preguntas, aprendes de piezas reales y aprendes qué hacer con ellas para ganar dinero.

Lista de Pilares:
APRENDER · PREGUNTAR · ENCONTRAR · VENDER

Botón (CTA):
VER TODO LO QUE HAY DENTRO ↓


SECCIÓN 06: COMUNIDAD Y MENTORÍAS EN VIVO (#comunidad)

Cabecera Chat:
Comunidad Privada Círculo Gold — Mentoría Activa • En línea

Diálogo 1 Alumno:
"Me ofrecen este reloj por 1.200€. ¿El precio tiene sentido?"

Diálogo 1 Mentor:
"Mándame fotos del reverso y la caja. Revisamos referencia, estado y margen real antes de que muevas un euro."

Diálogo 2 Alumno:
"Vi una cadena en un mercadillo. ¿Cómo sé si es oro de ley?"

Diálogo 2 Mentor:
"Te enseño las 3 marcas que tienes que buscar y qué prueba rápida hacer antes de pagar."

Titular (H2):
NO QUEDARA UNA DUDA SUELTA.

Texto:
Cada semana hay mentorías en vivo. Preguntas, comparas, revisas lo que no tienes claro.

Cierre:
No estarás más solo. Eso es el círculo — no solo unos videos.


SECCIÓN 07: TODO LO QUE INCLUYE EL SISTEMA (#incluye-gold)

Eyebrow:
EL SISTEMA COMPLETO

Titular (H2):
TODO ESTO ESTÁ DENTRO DE GOLD

Estadística 01 Número:
60 DÍAS

Estadística 01 Texto:
Paso a paso para tu primera inversión

Estadística 02 Número:
6 MÓDULOS

Estadística 02 Texto:
Módulos grabados paso a paso

Estadística 03 Número:
1 / SEMANA

Estadística 03 Texto:
Mentoría en vivo cada semana

Estadística 04 Número:
24/7

Estadística 04 Texto:
Soporte y acompañamiento continuo

Píldora 01:
Catálogo exclusivo elegido por el equipo

Píldora 02:
Acceso prioritario a drops

Píldora 03:
Compras del catálogo y vendes con margen de ganancia

Píldora 04:
Estrategia de venta directa

Píldora 05:
Cómo crear tu tienda de joyas online

Píldora 06:
EXTRA: MÓDULO: Inversión en piedras preciosas y joyas

Píldora 07:
EXTRA: MÓDULO: Compra y venta de relojes de lujo

Banner de Precio:
ACCESO COMPLETO A CÍRCULO GOLD — $297 USD

CTA:
QUIERO ENTRAR A CÍRCULO GOLD — $297 →


SECCIÓN 08: PRUEBA SOCIAL / TESTIMONIOS (#testimonios)

Eyebrow:
PERSONAS REALES. PUNTOS DE PARTIDA REALES.

Titular (H2):
No necesitas ser experto.

Subtítulo:
Necesitas empezar desde donde estás — como todo el mundo aquí que llegaron tan lejos.

Nota de Transparencia:
Testimonios pendientes — se publican solo cuando sean reales y verificables.


SECCIÓN 09: TRANSFORMACIÓN / FUTURE PACING (#transformacion)

Eyebrow:
LA TRANSFORMACIÓN

Titular (H2):
MISMA JOYA. DIFERENTE MENTALIDAD.

Tarjeta ANTES Badge:
ANTES

Tarjeta ANTES Pensamiento:
"Se ve bien, seguro es cara."

Tarjeta ANTES Acción:
Miras la pieza. No sabes qué preguntar. Pagas lo que te digan.

Tarjeta AHORA Badge:
AHORA CON GOLD

Tarjeta AHORA Pensamiento:
"¿Cómo le puedo sacar beneficio?"

Tarjeta AHORA Acción:
Evalúas quilates, demanda, margen y canal de venta antes de mover un euro.


SECCIÓN 10: OFERTA PRINCIPAL - CÍRCULO GOLD (#precio-gold)

Eyebrow:
EL CÍRCULO COMPLETO

Titular (H2):
CÍRCULO GOLD

Precio:
$297

Argumento de Venta:
No estás pagando por seis videos. Estás pagando por saltarte todos los errores de Shenoa y BlingBling que cometieron al empezar.

Botón (CTA):
QUIERO ENTRAR A CÍRCULO GOLD — $297 →


SECCIÓN 11: DECISIÓN Y URGENCIA / FOMO (#empezar-hoy)

Insignia:
🔴 CUPOS LIMITADOS

Titular (H2):
EL MOMENTO PERFECTO NUNCA AVISA.

Cuerpo:
No tienes que actuar sin pensar. Solo dejar de convertir "algún día" en otros seis meses.

Frase de Cierre:
Persigue tus metas, confía en ti

Botón (CTA):
QUIERO EMPEZAR CON CÍRCULO GOLD →


SECCIÓN 12: OFERTA ACCESIBLE - CÍRCULO ACERO (#circulo-acero)

Eyebrow:
UNA FORMA MÁS LIGERA DE EMPEZAR

Titular (H2):
CÍRCULO ACERO

Subtítulo:
Adquiere todo el conocimiento para saber en qué invertir y rentabilizar tus ahorros

Estadística Acero 01 Número:
4 MÓDULOS

Estadística Acero 01 Texto:
Módulos grabados paso a paso

Estadística Acero 02 Número:
24/7 SOPORTE

Estadística Acero 02 Texto:
Acompañamiento en todo tu proceso

Píldora Acero 01:
Construye tu portafolio de inversión con poco capital

Píldora Acero 02:
Catálogo de productos para empezar con poco capital

Píldora Acero 03:
Guía de primeras inversiones

Píldora Acero 04:
Por qué invertir en oro, relojes y piedras preciosas

Píldora Acero 05:
Cómo los metales preciosos hacen crecer tu patrimonio

Píldora Acero 06:
Estrategia de inversión para ingresos extra

Precio:
ACCESO COMPLETO A CÍRCULO ACERO — $97 USD

Botón:
EMPEZAR CON CÍRCULO ACERO — $97 →


SECCIÓN 13: PREGUNTAS FRECUENTES (#preguntas-frecuentes)

Eyebrow:
FAQ

Titular (H2):
PREGUNTAS FRECUENTES

Pregunta 1:
¿NECESITO MUCHO DINERO PARA COMENZAR?

Respuesta 1:
No. Aprendes a analizar posibilidades acordes con tu punto de partida antes de mover la plata.

Pregunta 2:
¿Y SI NUNCA HE COMPRADO ORO?

Respuesta 2:
No necesitas llegar sabiendo. Empiezas por aprender qué mirar, qué preguntar y qué revisar.

Pregunta 3:
¿CÓMO SÉ QUE NO ME VAN A METER UN CUENTO?

Respuesta 3:
Ninguna formación elimina el riesgo, pero sí puedes aprender qué validar y qué señales revisar.

Pregunta 4:
¿TENGO QUE MONTAR UNA TIENDA DE JOYAS DE UNA?

Respuesta 4:
No. La tienda es una posibilidad dentro de Gold, no una obligación para empezar.

Pregunta 5:
¿CÍRCULO GOLD GARANTIZA QUE VOY A GANAR DINERO?

Respuesta 5:
No. Tus resultados dependen de tus decisiones, tu capital, el mercado y tu ejecución.

Pregunta 6:
¿CUÁL DEBERÍA ELEGIR?

Respuesta 6:
Gold reúne el entorno completo. Acero es una entrada más ligera centrada en las bases.

Pregunta 7:
¿QUÉ INCLUYE EXACTAMENTE EL SOPORTE?

Respuesta 7:
Pendiente de confirmar: aquí se publicarán el canal real y las condiciones del soporte.

Pregunta 8:
¿CUÁNTO TIEMPO TENDRÉ ACCESO?

Respuesta 8:
Pendiente de confirmar: la duración real se indicará antes de abrir inscripciones.


SECCIÓN 14: CIERRE FINAL Y FOOTER (#cierre)

Titular (H2):
HOY VES UNA CADENA. MAÑANA VES TODO LO QUE HAY DETRÁS.

Palabras Clave:
VALOR · DEMANDA · UNA COMPRA · UNA VENTA · UNA DECISIÓN

Frase de Cierre:
No pasa por suerte. Pasa cuando aprendes a hacer mejores preguntas.

Opción Principal Gold Título:
CÍRCULO GOLD — $297

Opción Principal Gold CTA:
QUIERO ENTRAR A CÍRCULO GOLD →

Opción Principal Gold Promesas:
Sin aparentar.
Sin comerte cuentos.
Sin jugarte la plata a ciegas.

Opción Alternativa Acero Texto:
¿Prefieres empezar más ligero?

Opción Alternativa Acero CTA:
CÍRCULO ACERO — $97

Footer Marca:
Círculo Gold

Footer Legal:
Términos y condiciones

Footer Copyright:
© [Año Actual] Círculo Gold.
```

---

# 14. COPY_FUNCIONAL — ÚNICO COPY NUEVO PERMITIDO

Este copy solo puede usarse para elementos técnicos, accesibilidad o estados de interfaz.

No debe usarse para reemplazar, resumir o alterar el copy de las secciones.

```txt
SKIP_LINK:
Saltar al contenido

MAIN_ARIA_LABEL:
Contenido principal

THEME_TOGGLE_ARIA_LABEL:
Cambiar tema

STICKY_CTA_ARIA_LABEL:
Ir a la compra de Círculo Gold

SCROLL_TOP_ARIA_LABEL:
Volver arriba

CHAT_SIMULATION_ARIA_LABEL:
Ejemplo visual de la comunidad y mentoría

FAQ_EXPAND_ARIA_LABEL:
Abrir pregunta

FAQ_COLLAPSE_ARIA_LABEL:
Cerrar pregunta

PENDING_STATE_LABEL:
Pendiente de confirmar

EXIT_INTENT_EYEBROW:
ANTES DE IRTE

EXIT_INTENT_TITLE:
NO TE VAYAS SIN TENER CLARO EL SIGUIENTE PASO.

EXIT_INTENT_BODY:
Revisa qué incluye Círculo Gold o empieza por Círculo Acero si prefieres ir más ligero.

EXIT_INTENT_CTA_GOLD:
VER CÍRCULO GOLD →

EXIT_INTENT_CTA_ACERO:
VER CÍRCULO ACERO →

EXIT_INTENT_CLOSE:
Cerrar

LOADING_TEXT:
Cargando...

ERROR_TEXT:
Algo salió mal. Intenta de nuevo.
```

---

# 15. INSTRUCCIÓN FINAL PARA QWEN AI

Con este documento:

1. Genera la estructura completa de archivos.
2. Genera `index.template.html`.
3. Genera los 14 bloques HTML.
4. Genera el CSS completo.
5. Genera el JavaScript completo.
6. Genera `config.json`.
7. Genera `scripts/build.js`.
8. Genera el JSON-LD final.
9. Entrega el checklist QA validado.
10. No modifiques el `COPY_LOCK`.
11. No inventes contenido.
12. No agregues secciones nuevas salvo componentes globales permitidos.
13. Si necesitas agregar copy visible nuevo, usa exclusivamente `COPY_FUNCIONAL`.
14. Prioriza claridad, performance, accesibilidad y conversión.
15. Entrega código listo para producción.

---

## ORDEN DE ENTREGA RECOMENDADO PARA QWEN AI

Entrégalo en este orden:

1. Árbol de archivos.
2. `/src/data/config.json`.
3. `/src/templates/index.template.html`.
4. `/src/blocks/block-01.html` a `/src/blocks/block-14.html`.
5. `/src/css/base.css`.
6. `/src/css/theme.css`.
7. `/src/css/layout.css`.
8. `/src/css/components.css`.
9. `/src/css/blocks.css`.
10. `/src/js/main.js`.
11. `/src/js/config.js`.
12. `/src/js/analytics.js`.
13. `/src/js/reveal.js`.
14. `/src/js/accordion.js`.
15. `/src/js/chat-simulation.js`.
16. `/src/js/sticky-cta.js`.
17. `/src/js/checkout-links.js`.
18. `/src/js/magnetic-button.js`.
19. `/src/js/theme-toggle.js`.
20. `/src/js/utils.js`.
21. `/scripts/build.js`.
22. JSON-LD final.
23. Checklist QA.

---

# 16. VERSIÓN CORTA PARA EJECUCIÓN RÁPIDA

Si necesitas una versión compacta para pegar directamente como prompt inicial, usa esta:

```txt
Actúa como desarrollador frontend senior especializado en landing pages premium de alta conversión, performance, accesibilidad y SEO técnico.

Construye la landing page production-ready “Círculo Gold” usando exactamente la estructura, secciones y copy del documento adjunto.

Reglas innegociables:
1. No modificar ninguna cadena del COPY_LOCK.
2. No corregir ortografía, tono ni estilo colombiano.
3. Mantener las 14 secciones en el mismo orden.
4. No inventar testimonios, cifras, garantías, urgencia ni resultados.
5. Solo se permite copy nuevo si está en COPY_FUNCIONAL y es estrictamente técnico o de accesibilidad.
6. No usar frameworks pesados. Usar HTML semántico, CSS moderno y JavaScript vanilla ES Modules.
7. Crear arquitectura modular con block-01.html a block-14.html.
8. Crear index.html final mediante build que ensamble los bloques.
9. Crear config.json con URLs de checkout, features y fallbacks.
10. Si checkout.gold o checkout.acero están vacíos, usar fallback interno y disparar evento checkout_url_missing.
11. Implementar reveal animations con IntersectionObserver, respetando prefers-reduced-motion.
12. Implementar FAQ accesible con teclado y ARIA.
13. Implementar chat simulation en sección 06 solo como muestra visual.
14. Implementar sticky CTA móvil usando el CTA existente de Gold.
15. Implementar tracking con dataLayer para block_view, cta_click, checkout_click, faq_toggle, chat_view y sticky_cta_click.
16. Implementar schema JSON-LD con Organization, Person, Course, Offer y FAQPage, sin inventar reviews.
17. Optimizar performance: critical CSS, lazy loading, fuentes con font-display swap, animaciones solo con opacity/transform.
18. Cumplir accesibilidad: skip link, foco visible, jerarquía de headings, contraste y navegación por teclado.
19. Entregar código completo, archivo por archivo, listo para producción.
20. Antes de entregar, validar que el copy visible sea idéntico al COPY_LOCK.
```

---

Con este plano, Qwen AI ya no tiene que interpretar estrategia ni tomar decisiones creativas riesgosas.

Tiene:

- estructura bloqueada,
- copy bloqueado,
- arquitectura técnica,
- comportamiento de checkout,
- componentes,
- tracking,
- SEO,
- performance,
- accesibilidad,
- QA.

Eso es lo que convierte esta versión en una base **5/5 ejecutable**.
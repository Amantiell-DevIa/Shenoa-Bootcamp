# Círculo Gold — Landing Page

Landing page oficial de alta conversión para **Círculo Gold** y **Círculo Acero**, un programa de formación y mentoría en inversión y comercialización de joyería, oro, relojes y piedras preciosas.

---

## 🌟 Características

- **Estructura unificada**: Todo el contenido está consolidado en un único `index.html` optimizado para carga ultra rápida y SEO.
- **Sin dependencias pesadas**: Construida en HTML5 semántico, CSS3 moderno encapsulado (`style.css`) y JavaScript nativo (`script.js`).
- **Diseño responsive de alto impacto**: Optimizado para dispositivos móviles, tablets y monitores de escritorio.
- **Componentes interactivos**:
  - Simulador de conversación estilo WhatsApp en mockup de iPhone.
  - Acordeón interactivo de objeciones y FAQ.
  - Indicador de progreso de lectura (scroll tracker).
  - Efectos visuales de brillo metálico y microanimaciones suaves.
- **Configuración centralizada**: Enlaces de checkout Hotmart/Stripe y datos editables desde `curso-config.js`.
- **Laboratorio visual incluido**: `laboratorio.html` permite previsualizar la landing en diferentes anchos (móvil, tablet, escritorio) y probar variantes cromáticas en tiempo real.

---

## ✨ Capa V4 «La luz del joyero» (Método V4)

El diseño actual es una capa sobre `style.css` que aplica el Método V4 sin cambiar el copy (COPY_LOCK de `instrucciones.md`) ni el orden de las 14 secciones.

- **Tokens**: 7 tamaños de texto + *display*, 3 radios (8 px, 16 px y píldora), espacio en base 8 y movimiento de 100/240/600 ms con una sola curva.
- **Superficies**: todo en oscuro, como la joyería de noche: escena para presentar, terciopelo realzado (un tono más cálido, foco de luz y tarjetas con filo dorado) para leer y comparar (#dudas, #incluye-gold y #preguntas-frecuentes) y **terciopelo esmeralda** para la confianza, la comunidad y el cierre (#seguridad, #comunidad y #cierre). Las secciones esmeralda entran y salen fundiéndose con sus vecinas. La página empieza y termina con oro y esmeralda: en el héroe, oro sobre Shenoa, luz esmeralda baja tras la acción y el punto «en vivo» en esmeralda; en el cierre, oro tras el titular y la oferta (engastada en oro con halo esmeralda) y promesas con gema. Sin superficies claras.
- **Color**: el oro es la luz de la marca y del producto (cifras y palabras clave) y nunca un botón; el marfil es el único color de acción. La **esmeralda** es la gema engastada en ese oro: confianza, crecimiento y comunidad viva. Aparece en sus superficies, en lo verificado (los ticks de #seguridad), en la tarjeta ESMERALDAS y en el bisel del medallón de Círculo Gold. Con la capa FLOW, la luz de la galería toma el color de la gema y un aura verde cruza las secciones esmeralda.
- **Cabecera fija** con una sola acción (escritorio y tablet) y **CTA fijo en móvil** que se oculta cuando hay otro botón de compra a la vista.
- **Transformación**: #transformacion enfrenta las tarjetas «Antes» y «Ahora con Gold» bajo un foco cálido, sin fotografías de fondo (las de `escena/` traían los rótulos incrustados).
- **Imágenes en WebP** (`assets/img/`): la página pasó de 13,4 MB a ~1 MB por visita.

Para volver al diseño anterior basta con quitar `class="v4"` de `<html>` en `index.html`. El concepto, la auditoría y las afirmaciones por confirmar con Shenoa están en `DISEÑOS/concepto-v4.md` (solo en el equipo local).

## 🌊 Capa FLOW «El oro fluye» (fase 1, prototipo)

Movimiento continuo ligado al scroll sobre la V4, para el dinamismo que pidió el cliente. Se activa con `class="flow"` en `<html>`; quitarla la desactiva.

- **Desplazamiento con inercia** (Lenis) con ratón o trackpad; en móvil se respeta el scroll nativo.
- **Héroe**: al bajar, fondo, Shenoa y titular se separan en profundidad (fondo lento, texto rápido).
- **#posibilidad**: la sección se fija y oro, joyas y esmeraldas pasan en horizontal con el scroll; se enciende la tarjeta que cruza el centro.
- **#transformacion**: la sección se fija y el scroll funde el oro con 56 fotogramas sin rótulos de `escena/1zip` (`assets/img/flow/`); «Antes» cede el sitio a «Ahora con Gold».
- **Aurora esmeralda**: las secciones esmeralda (#seguridad, #comunidad y #cierre) tienen de fondo una aurora boreal. Son tres cortinas de luz con rayos (texturas generadas en `assets/img/aurora/`; dos de 800 px en móvil). Cuando la sección entra en vista, las cortinas aparecen desde el lateral izquierdo, escalonadas, y cruzan la sección encendiéndose y apagándose (transparencia) mientras ondulan a ritmos distintos. Solo se anima `transform`/`opacity`, sin repintar. Las texturas se piden al acercarse a la sección y la animación se pausa fuera de la vista. Un velo de lectura deja la aurora viva en los bordes y todo el texto en AA. Con movimiento reducido, quieta.
- **Aro de marca**: «CÍRCULO GOLD» va centrado dentro de un medallón con un aro de oro (SVG), con el rótulo encima, en la presentación (#circulo-gold) y en la oferta (#precio-gold). Se dibuja al aparecer y gira despacio, con las marcas en sentido contrario; el scroll le suma giro. Vive en `v4.css`: con movimiento reducido se queda quieto y sin V4 no se muestra.
- **Peso**: GSAP + ScrollTrigger + Lenis desde jsDelivr (~51 KB comprimidos). La secuencia solo se descarga al acercarse a la sección: 0,9 MB en móvil y 2,4 MB en escritorio.
- **Respaldo**: con movimiento reducido, sin JavaScript o si el CDN falla, queda la V4 estática.

---

## 📁 Estructura del Proyecto

```text
├── index.html                   # Landing page principal unificada (producción)
├── style.css                    # Hoja de estilos heredada (base, depurada: solo reglas en uso)
├── script.js                    # Interactividad, animaciones y comportamiento
├── curso-config.js              # Configuración de URLs de pago y textos dinámicos
├── assets/
│   ├── css/v4.css               # Capa V4: tokens, superficies, acción y secciones
│   ├── css/flow.css             # Capa FLOW: secciones fijadas y escena del oro
│   ├── js/v4.js                 # Cabecera, CTA fijo y destinos de compra
│   ├── js/flow.js               # Capa FLOW: Lenis + GSAP ScrollTrigger (fase 1)
│   ├── js/laboratorio-puente.js # Puente con laboratorio.html (modo vista previa)
│   ├── img/flow/*.webp          # Secuencia del oro fundiéndose (1280 px y 540 px)
│   ├── img/aurora/*.webp        # Cortinas de la aurora esmeralda (1600 px y 800 px)
│   └── img/*.webp               # Imágenes optimizadas que usa la landing
├── laboratorio.html             # Entorno de pruebas y laboratorio visual
├── iniciar-laboratorio.command  # Script macOS para levantar servidor local
├── *.png                        # Originales (index.html ya no los carga)
└── .gitignore                   # Archivos ignorados por Git
```

---

## 🚀 Cómo probar en local

Puedes abrir directamente `index.html` en tu navegador favorito haciendo doble clic, o mediante un servidor HTTP local:

```bash
# Iniciar servidor local en el puerto 8767
python3 -m http.server 8767
```

Luego abre en tu navegador:
- **Landing en vivo**: [http://localhost:8767/index.html](http://localhost:8767/index.html)
- **Laboratorio interactivo**: [http://localhost:8767/laboratorio.html](http://localhost:8767/laboratorio.html)

---

## ⚙️ Configurar enlaces de compra (Checkouts)

Edita el archivo `curso-config.js` para conectar tus pasarelas de pago reales:

```javascript
window.CIRCULO_GOLD_CONFIG = {
  goldCheckoutUrl: 'https://tu-enlace-de-pago-gold.com',
  steelCheckoutUrl: 'https://tu-enlace-de-pago-acero.com',
  support: {
    gold: 'Soporte personalizado vía canal privado',
    steel: 'Soporte por correo electrónico'
  },
  accessDuration: 'Acceso ilimitado por 1 año',
  testimonials: []
};
```

*Nota: Mientras las URLs de checkout estén vacías, los botones de compra se mantendrán seguros en modo de espera sin enlaces rotos.*

*Con la capa V4, esos botones se muestran con borde discontinuo mientras no haya checkout. La cabecera y el CTA fijo de móvil nunca quedan desactivados: llevan al checkout si existe y, si no, a la oferta (`#precio-gold`).*

---

## 🌐 Despliegue en GitHub Pages

1. Sube este repositorio a tu cuenta de GitHub. Si lo actualizas desde la web («Add files via upload»), sube también la carpeta `assets/` completa junto con `index.html` y `script.js`.
2. En tu repositorio, entra a **Settings** > **Pages**.
3. En **Build and deployment** > **Branch**, selecciona `main` y la carpeta `/(root)`.
4. Haz clic en **Save**. En pocos segundos tu landing estará online con HTTPS gratuito.

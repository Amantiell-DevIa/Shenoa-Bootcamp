# Círculo Gold · landing modular para Elementor

Landing concisa organizada en 13 bloques, una FAQ puente y archivos separados de CSS, configuración y JavaScript. La base visual conserva el sistema de Landing Bootcamp y añade una capa propia `cg-*` encapsulada.

## Laboratorio local

Haz doble clic en `iniciar-laboratorio.command` o ejecuta:

```bash
cd "/Users/kaykostar/Documents/ESMERALDA/pagina WORK/Landing Curso Bootcamp AGY"
python3 -m http.server 8767 --bind 127.0.0.1
```

Abre:

`http://127.0.0.1:8767/index.html` (Lienzo limpio / producción)
`http://127.0.0.1:8767/laboratorio.html` (Laboratorio interactivo)

`index.html` es el lienzo limpio ensamblado (la página principal para Vercel y producción). `laboratorio.html` es el laboratorio para cambiar el ancho entre 320 y 1920 px, probar paletas y saltar a cada bloque.

## Orden de los bloques HTML en Elementor

1. `<!-- 01 CURIOSIDAD -->.html`
2. `<!-- 02 IDENTIFICACION -->.html`
3. `<!-- 04 SEGURIDAD -->.html`
4. `<!-- 05 POSIBILIDAD -->.html`
5. `<!-- 06 DESEO -->.html`
6. `<!-- 07 PERTENENCIA -->.html`
7. `<!-- 08 VALOR -->.html`
8. `<!-- 09 PRUEBA -->.html`
9. `<!-- 10 FUTURO -->.html`
10. `<!-- 11 OFERTA GOLD -->.html`
11. `<!-- 12 FOMO -->.html`
12. `<!-- 13 OFERTA ACERO -->.html`
13. `<!-- FAQ PUENTE -->.html`
14. `<!-- 14 CIERRE GOLD -->.html`

El antiguo bloque `<!-- 03 ALIVIO -->.html` fue retirado en la versión concisa. Elimina ese widget de Elementor en lugar de volver a pegarlo.

## Cómo copiar a WordPress

1. En una página Elementor Canvas, añade un widget HTML al inicio y pega una sola vez todo `<style>.css`, incluidos `<style>` y `</style>`.
2. Añade un widget HTML por cada bloque, respetando el orden anterior.
3. Antes del script final, añade un widget HTML y pega `curso-config.js` dentro de etiquetas `<script>...</script>`.
4. En el último widget HTML pega `<script>.js`, que ya incluye sus etiquetas `<script>`.
5. Publica, vacía la caché de Elementor/LiteSpeed y prueba en incógnito.

## Datos que deben confirmarse antes de publicar

Edita únicamente `curso-config.js`:

```js
window.CIRCULO_GOLD_CONFIG = {
  goldCheckoutUrl: 'https://URL-REAL-GOLD',
  steelCheckoutUrl: 'https://URL-REAL-ACERO',
  support: {
    gold: 'Descripción real del soporte Gold.',
    steel: 'Descripción real del soporte Acero.'
  },
  accessDuration: 'Condiciones reales y duración del acceso.',
  testimonials: [
    {
      name: 'Identidad verificable',
      before: 'Situación real.',
      learned: 'Habilidad concreta.',
      changed: 'Cambio verificable.'
    }
  ]
};
```

- Solo se aceptan enlaces de checkout con `https://`.
- Mientras falte un checkout, sus botones permanecen visibles pero desactivados.
- Soporte y duración de acceso permanecen señalados como pendientes hasta confirmarlos; no se inventan condiciones.
- La sección de prueba muestra un aviso editorial y no publica testimonios hasta que sean reales y verificables.
- Los enlaces de checkout continúan desactivados mientras no exista una URL real y segura.

## Fuentes

La landing utiliza la familia `Satoshi` ya instalada en WordPress, con `Inter` y fuentes del sistema como respaldo. Si Elementor sustituye la tipografía, desactiva sus fuentes globales para la página o confirma que el nombre CSS registrado sea exactamente `Satoshi`.

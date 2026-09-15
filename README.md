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

## 📁 Estructura del Proyecto

```text
├── index.html                   # Landing page principal unificada (producción)
├── style.css                    # Hoja de estilos principal y sistema de diseño
├── script.js                     # Interactividad, animaciones y comportamiento
├── curso-config.js              # Configuración de URLs de pago y textos dinámicos
├── laboratorio.html             # Entorno de pruebas y laboratorio visual
├── iniciar-laboratorio.command  # Script macOS para levantar servidor local
├── *.png                        # Recursos visuales e imágenes optimizadas
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

---

## 🌐 Despliegue en GitHub Pages

1. Sube este repositorio a tu cuenta de GitHub.
2. En tu repositorio, entra a **Settings** > **Pages**.
3. En **Build and deployment** > **Branch**, selecciona `main` y la carpeta `/(root)`.
4. Haz clic en **Save**. En pocos segundos tu landing estará online con HTTPS gratuito.

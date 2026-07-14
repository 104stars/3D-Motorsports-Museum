# Motorsports Museum

Museo virtual 3D e interactivo dedicado a la historia del automovilismo. Construido con **Next.js** y **Three.js / React Three Fiber**, permite recorrer a pie un espacio tridimensional con física real y descubrir ocho vehículos legendarios de la Fórmula 1, el Rally Mundial y las carreras de resistencia (Le Mans), con reseñas históricas, fichas técnicas, galerías multimedia y modelos 3D inspeccionables en detalle.

Repositorio: [github.com/104stars/3D-Motorsports-Museum](https://github.com/104stars/3D-Motorsports-Museum)

## Tabla de contenidos

- [Características](#características)
- [Colección de vehículos](#colección-de-vehículos)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Primeros pasos](#primeros-pasos)
- [Scripts disponibles](#scripts-disponibles)
- [Controles del recorrido](#controles-del-recorrido)
- [Despliegue](#despliegue)

## Características

### Experiencia del museo

- **Dos modos de recorrido**, a elegir al entrar:
  - **Recorrido narrado**: itinerario guiado por los 8 vehículos con narración y datos curiosos; es el camino pensado para navegación accesible por teclado.
  - **Modo libre**: exploración a pie por las tres plantas del museo (Resistencia, Rally y Fórmula 1), con física real de colisiones y gravedad.
- **Paneles de información por vehículo**: historia, ficha técnica (motor, potencia, par, peso, tracción, transmisión, velocidad máxima, aceleración 0-100), datos curiosos y galería de imágenes/vídeo.
- **Visor 3D detallado** por vehículo, con iluminación de estudio y post-procesado (bloom, viñeta, grano de película, corrección de brillo/contraste, SMAA) para rotar, desplazar y hacer zoom sobre cada modelo.
- **Carga adaptativa de modelos**: cada coche tiene versiones `.glb` en tres calidades (`low`, `mid`, `og`), y los modelos de alta calidad se sirven desde un bucket de Supabase Storage para optimizar tiempos de carga.
- **Landing page** con hero animado, exhibiciones destacadas, invitación a explorar y sección "Sobre la app" que explica el funcionamiento del recorrido.

### Cuentas de usuario

- Registro e inicio de sesión con **Supabase Auth** (email + contraseña, con confirmación por correo).
- Selección de avatar entre 5 modelos predefinidos (pensados también para un futuro modo multijugador/tercera persona).
- Sesión persistente vía cookies, validada en servidor (SSR-safe con `@supabase/ssr`) y menú de usuario con cierre de sesión.

### Accesibilidad (a11y)

- Roles y regiones ARIA en vivo para lectores de pantalla, con anuncios de estado de carga y narración.
- Lista de exhibiciones navegable por teclado, como alternativa accesible al modo libre (que requiere ratón y bloqueo de puntero).
- Gestión de foco (*focus trap*) en modales, onboarding y paneles de información.
- Soporte de `prefers-reduced-motion` en todas las animaciones.
- Onboarding guiado paso a paso y modal de ayuda de controles siempre disponible desde el menú de pausa.

### Internacionalización

- Español (idioma por defecto) e inglés, mediante `next-intl`.
- Todo el contenido narrativo de los vehículos, la interfaz y los mensajes de accesibilidad están traducidos (`messages/es.json`, `messages/en.json`, `content/cars.es.js`, `content/cars.en.js`).

## Colección de vehículos

| Vehículo | Categoría | Año | Planta |
|---|---|---|---|
| Audi Quattro | Rally | 1980–1991 | Rally |
| Toyota Celica GT-Four | Rally Mundial | 1988–1999 | Rally |
| Toyota Yaris WRC | Rally Mundial | 2020–presente | Rally |
| Mazda 787B | Resistencia (Le Mans) | 1991 | Resistencia |
| Porsche 917 | Prototipo deportivo | 1969–1973 | Resistencia |
| Ferrari 499P | Hypercar / Resistencia | 2023 | Resistencia |
| McLaren MP4/5 | Fórmula 1 | 1989 | Fórmula 1 |
| Red Bull RB9 | Fórmula 1 | 2013 | Fórmula 1 |

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui + Radix UI |
| 3D / WebGL | Three.js, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` |
| Física y control de personaje | `@react-three/rapier`, `ecctrl` |
| Animación | `motion` (Framer Motion) |
| Backend / Auth / Storage | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| Internacionalización | `next-intl` |
| Iconos | `lucide-react` |
| Gestor de paquetes | Bun |
| Linting | ESLint 9 (`eslint-config-next`) |

## Estructura del proyecto

```
app/
  [locale]/                   Páginas localizadas: landing, login/registro, tour
  api/auth/                   Rutas de callback y signout de Supabase
components/
  tour/                       Lógica y UI del recorrido 3D (HUD, paneles, onboarding, a11y)
  tour/DetailedCarViewer/     Visor 3D detallado con post-procesado
  auth/                       Contexto de autenticación
  ui/                         Componentes de interfaz reutilizables (shadcn/Radix)
content/                      Contenido narrativo de cada vehículo (ES/EN)
lib/
  tour/                       Configuración de coches, cámara, rutas de narración
  supabase/                   Clientes de Supabase (browser/server/middleware) y storage
  avatars/                    Catálogo de avatares
i18n/                         Configuración de next-intl (rutas, locales)
messages/                    Diccionarios de traducción (en.json, es.json)
public/models/                Modelos 3D (.glb) en calidades low/mid/og
public/media/cars/            Imágenes por vehículo
```

## Primeros pasos

### Requisitos previos

- [Bun](https://bun.sh) (gestor de paquetes del proyecto; también funciona con npm/yarn/pnpm)
- Un proyecto de [Supabase](https://supabase.com) con Auth y Storage habilitados

### Instalación

```bash
bun install
```

### Variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima/pública de Supabase |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (usada en el callback de auth y en el signout) |
| `NEXT_PUBLIC_GALLERY_MODEL_URL` | Opcional. URL alternativa para el modelo 3D de la galería del museo; si no se define, se resuelve desde Supabase Storage |

### Ejecutar en desarrollo

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `bun dev` | Servidor de desarrollo con Turbopack |
| `bun run build` | Compilación de producción con Turbopack |
| `bun run start` | Sirve la build de producción |
| `bun run lint` | Ejecuta ESLint |

## Controles del recorrido

### Modo libre

| Acción | Tecla |
|---|---|
| Moverse | WASD / flechas |
| Correr | Shift |
| Saltar | Espacio |
| Reiniciar posición | R |
| Abrir panel de un vehículo | Clic, cuando el icono de ojo está activo |
| Menú de pausa | Esc o P |

### Visor 3D detallado

| Acción | Control |
|---|---|
| Rotar | Arrastrar con clic izquierdo |
| Desplazar (pan) | Arrastrar con clic derecho |
| Zoom | Rueda del ratón |
| Cerrar | Esc |

## Despliegue

El proyecto está preparado para desplegarse en [Vercel](https://vercel.com), aunque cualquier proveedor compatible con Next.js 16 funciona igual de bien. Recuerda configurar las variables de entorno anteriores en el entorno de despliegue.

# BUSINESS_LOGIC.md - Orbita Z

> Versión simple de Orbita: una sola pantalla de clientes, sin agenda, caja ni planes.


## 1. Problema de Negocio
**Dolor:** Una persona que maneja una cartera chica de clientes (asesor, vendedor, freelancer) tiene los datos repartidos entre la agenda del celular, chats y mails, y se olvida de hacer seguimiento.
**Costo actual:** Clientes que se enfrían por falta de contacto y tiempo perdido buscando teléfono, mail o lo último que se habló.

## 2. Solucion
**Propuesta de valor:** Un CRM sencillo que junta los clientes en un solo lugar y permite escribirles por WhatsApp o mail con un toque, sabiendo a quién contactar hoy.

**Flujo principal (Happy Path):**
1. Carga un cliente (nombre, teléfono, mail, empresa, estado, etiquetas).
2. Ve en el inicio a quién le toca seguimiento hoy o está atrasado.
3. Le escribe por WhatsApp o mail con un toque, anota qué habló y agenda el próximo seguimiento.
4. Si necesita algo más, toca "¿Necesitás algo más?" y le pide la mejora al desarrollador.

## 3. Usuario Objetivo
**Rol:** Profesional independiente con una cartera de decenas a un par de cientos de clientes.
**Contexto:** No es técnico; lo usa desde el celular o la compu entre reuniones. Todo tiene que ser simple.

## 4. Arquitectura de Datos
**Input:** Datos del cliente, notas, fechas de seguimiento.

**Output:** Lista filtrable, seguimientos de hoy/atrasados, enlaces de WhatsApp (`wa.me`) y mail (`mailto:`).

**Storage (fase 1: navegador con Zustand; fase 2: Supabase):**
- `clients`: nombre, teléfono, email, empresa, estado (activo/potencial/inactivo), etiquetas, último contacto, próximo seguimiento
- `notes`: notas por cliente con fecha
Todas con `owner_id` y RLS en fase 2.

## 5. KPI de Exito
**Metrica principal:** Cargar un cliente y escribirle por WhatsApp en menos de 1 minuto, sin ayuda.

## 6. Especificacion Tecnica (Para el Agente)

### Features a Implementar (Feature-First)
```
src/features/
└── clients/      # Lista, ficha, notas, seguimiento, WhatsApp y mail
src/shared/
└── components/   # Modal y botón "¿Necesitás algo más?"
```

### Stack Confirmado
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4
- **Datos (fase 1):** Zustand persistido en el navegador
- **Backend (fase 2):** Supabase (Auth + Database + RLS)
- **Validacion:** Zod

### Proximos Pasos
1. [x] Setup proyecto base
2. [x] Clientes, notas, seguimiento, WhatsApp y mail
3. [ ] Configurar el WhatsApp del desarrollador (botón de mejoras)
4. [x] Supabase + login (Email/Password, cuentas confirmadas vía service role, tabla `oz_clients` con RLS)
5. [x] Deploy Vercel: https://orbita-z.vercel.app
6. [ ] Resend para recuperar contraseña por mail

# Orbita Z · CRM simple para tu cartera de clientes

La versión simple de Orbita: una sola pantalla de clientes, pensada para asesores, vendedores y freelancers. Junta los clientes en un solo lugar, muestra a quién contactar hoy y permite escribirle por WhatsApp o mail con un toque.

## Funciones

- **Clientes**: nombre, teléfono, mail, empresa, estado (activo, potencial o inactivo) y etiquetas.
- **Seguimientos**: los de hoy y los atrasados aparecen en el inicio.
- **Contacto de un toque**: enlaces a WhatsApp (`wa.me`) y a mail (`mailto:`).
- **Notas por cliente** con fecha, y agenda del próximo seguimiento.
- **Lista filtrable** y búsqueda.
- Botón **"¿Necesitás algo más?"** para pedir mejoras.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Zustand · Zod · Supabase (fase 2)

## Desarrollo

```bash
cp .env.local.example .env.local   # completá tus valores
npm install
npm run dev
```

La lógica de negocio completa está en [`BUSINESS_LOGIC.md`](BUSINESS_LOGIC.md).

---

by **GC**

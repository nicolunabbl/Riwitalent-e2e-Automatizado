import { test, expect } from '@playwright/test';
import usuariosBase from '../usersJoin.json' with { type: 'json' };

// ── Configuración: todos los tests corren en paralelo ─────────────────────────
test.describe.configure({ mode: 'parallel' });

// ── Mapeos ────────────────────────────────────────────────────────────────────

function convertirFecha(fecha: string): string {
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

const mapDepartamento: Record<string, string> = {
  'Antioquia': 'ANTIOQUIA',
  'Atlántico': 'ATLÁNTICO',
  'Cundinamarca': 'CUNDINAMARCA',
  'Valle del Cauca': 'VALLE DEL CAUCA',
  'Bolívar': 'BOLÍVAR',
  'Santander': 'SANTANDER',
  'Risaralda': 'RISARALDA',
  'BOGOTÁ, D.C.': 'BOGOTÁ, D.C.',
};

/** Municipio (texto JSON) → valor del <select id="city"> */
const mapMunicipio: Record<string, string> = {
  'Medellín': 'MEDELLÍN',
  'Bello': 'BELLO',
  'Envigado': 'ENVIGADO',
  'Itagüí': 'ITAGÜÍ',
  'Sabaneta': 'SABANETA',
  'Rionegro': 'RIONEGRO',
  'La Estrella': 'LA ESTRELLA',
  'Copacabana': 'COPACABANA',
  'Girardota': 'GIRARDOTA',
  'Caldas': 'CALDAS',
  'Barranquilla': 'BARRANQUILLA',
  'Soledad': 'SOLEDAD',
  'Malambo': 'MALAMBO',
  'Puerto Colombia': 'PUERTO COLOMBIA',
  'Galapa': 'GALAPA',
  'Baranoa': 'BARANOA',
  'Sabanalarga': 'SABANALARGA',
  'Santo Tomás': 'SANTO TOMÁS',
  'Bogotá': 'BOGOTÁ',
  'Soacha': 'SOACHA',
  'Cali': 'CALI',
  'Palmira': 'PALMIRA',
  'Cartagena': 'CARTAGENA',
  'Bucaramanga': 'BUCARAMANGA',
  'Pereira': 'PEREIRA',
  'BOGOTÁ, D.C.': 'BOGOTÁ, D.C.',
  'SANTIAGO DE CALI': 'SANTIAGO DE CALI',
  'CARTAGENA DE INDIAS': 'CARTAGENA DE INDIAS',
};

const mapHorario: Record<string, string> = {
  'Mañana (6:00 AM - 2:00 PM)': 'Morning',
  'Tarde (2:00 PM - 10:00 PM)': 'Afternoon',
  'Noche (6:00 PM - 10:00 PM)': 'Night',
};

const mapMedioComunicacion: Record<string, string> = {
  'WhatsApp': 'WhatsApp',
  'Correo electrónico': 'Correo electrónico',
  'Llamada telefónica': 'Llamada telefónica',
};

const mapNivelEducativo: Record<string, string> = {
  'Bachiller': 'Bachelor',
  'Técnico': 'Technician',
  'Tecnólogo': 'Technologist',
  'Profesional': 'Professional',
  'Especialización': 'Specialization',
  'Maestría': 'Master',
  'Doctorado': 'Doctorate',
};

const mapConocimientos: Record<string, string> = {
  'Ninguno': 'None',
  'Básico': 'Basic',
  'Intermedio': 'Intermediate',
  'Avanzado': 'Advanced',
};

const mapOcupacion: Record<string, string> = {
  'Empleado': 'Employee',
  'Estudiante': 'Student',
  'Desempleado': 'Unemployed',
  'Independiente / Freelance': 'Freelancer',
};

// ── Generación de 150 usuarios únicos ─────────────────────────────────────────
// Cicla sobre los 40 usuarios base creando variantes con email y documento únicos

const TOTAL_USUARIOS = 150;
const base = usuariosBase.usuarios;

interface UsuarioCarga {
  nombre: string;
  apellido: string;
  correo_electronico: string;
  usuario_discord: string;
  contrasena: string;
  telefono: string;
  fecha_nacimiento: string;
  tipo_documento: string;
  numero_documento: string;
  genero: string;
  tipo_convenio: string;
  departamento: string;
  municipio: string;
  sede_interes: string;
  estrato: string;
  horario_estudio: string;
  medio_comunicacion: string;
  nivel_educativo: string;
  titulo: string;
  conocimientos_programacion: string;
  ocupacion: string;
}

const usuarios150: UsuarioCarga[] = Array.from({ length: TOTAL_USUARIOS }, (_, i) => {
  const src = base[i % base.length];
  const lote = Math.floor(i / base.length) + 1; // distingue ciclo: 1, 2, 3...

  // Email único: agrega +loadN antes del @
  const [local, domain] = src.pagina1_datos.correo_electronico.split('@');
  const correo = `${local}+load${i + 1}@${domain}`;

  // Documento único: suma el índice para que no haya colisiones
  const docBase = parseInt(src.pagina1_datos.numero_documento, 10);
  const documento = String(docBase + i * 1000);

  return {
    nombre: src.pagina1_datos.nombre,
    apellido: src.pagina1_datos.apellido,
    correo_electronico: correo,
    usuario_discord: src.pagina1_datos.usuario_discord
      ? `${src.pagina1_datos.usuario_discord.split('#')[0]}L${lote}#${String(i).padStart(4, '0')}`
      : '',
    contrasena: src.pagina1_datos.contrasena,
    telefono: src.pagina1_datos.telefono,
    fecha_nacimiento: src.pagina1_datos.fecha_nacimiento,
    tipo_documento: src.pagina1_datos.tipo_documento,
    numero_documento: documento,
    genero: src.pagina1_datos.genero,
    tipo_convenio: src.pagina1_datos.tipo_convenio,
    departamento: src.pagina2_ubicacion.departamento,
    municipio: src.pagina2_ubicacion.municipio,
    sede_interes: src.pagina2_ubicacion.sede_interes,
    estrato: src.pagina2_ubicacion.estrato,
    horario_estudio: src.pagina2_ubicacion.horario_estudio,
    medio_comunicacion: src.pagina2_ubicacion.medio_comunicacion,
    nivel_educativo: src.pagina3_formacion.nivel_educativo,
    titulo: src.pagina3_formacion.titulo,
    conocimientos_programacion: src.pagina3_formacion.conocimientos_programacion,
    ocupacion: src.pagina3_formacion.ocupacion,
  };
});

// ── Tests de Rendimiento ──────────────────────────────────────────────────────

test.describe('Prueba de Rendimiento — 150 usuarios concurrentes', () => {

  for (let i = 0; i < usuarios150.length; i++) {
    const u = usuarios150[i];
    const testNum = String(i + 1).padStart(3, '0');

    test(`[${testNum}] Registro de carga: ${u.nombre} ${u.apellido}`, async ({ page }) => {
      const inicio = Date.now();

      // ── Página 1: Datos personales ────────────────────────────────────────
      await page.goto('https://join.riwi.io/register');

      await page.getByRole('textbox', { name: 'Introduce tu nombre' }).fill(u.nombre);
      await page.getByRole('textbox', { name: 'Introduce tu apellido' }).fill(u.apellido);
      await page.getByRole('textbox', { name: 'ejemplo@correo.com' }).fill(u.correo_electronico);

      if (u.usuario_discord) {
        await page.getByRole('textbox', { name: 'usuario#' }).fill(u.usuario_discord);
      }

      await page.getByRole('textbox', { name: 'Min. 8 caracteres' }).fill(u.contrasena);
      await page.getByRole('textbox', { name: '3208753487' }).fill(u.telefono);
      await page.getByPlaceholder('DD/MM/AAAA').fill(convertirFecha(u.fecha_nacimiento));
      await page.locator('#idType').selectOption(u.tipo_documento);
      await page.getByRole('textbox', { name: '1234567890' }).fill(u.numero_documento);
      await page.locator('#gender').selectOption(u.genero);
      await page.locator('#conventionType').selectOption(u.tipo_convenio);

      await page.getByRole('button', { name: 'Siguiente' }).click();

      // ── Página 2: Ubicación ───────────────────────────────────────────────
      await page.locator('#district').selectOption(mapDepartamento[u.departamento] ?? u.departamento);

      // Esperar a que las opciones de municipio se carguen dinámicamente
      await page.waitForFunction(
        () => (document.querySelector('#city') as HTMLSelectElement)?.options.length > 1,
        { timeout: 15_000 }
      );

      await page.locator('#city').selectOption(mapMunicipio[u.municipio] ?? u.municipio);
      await page.locator('#site').selectOption(u.sede_interes);
      await page.locator('#socialStatus').selectOption(u.estrato);
      await page.locator('#schedule').selectOption(mapHorario[u.horario_estudio] ?? u.horario_estudio);
      await page.locator('#bestContact').selectOption(mapMedioComunicacion[u.medio_comunicacion] ?? u.medio_comunicacion);

      await page.getByRole('button', { name: 'Siguiente' }).click();

      // ── Página 3: Formación ───────────────────────────────────────────────
      await page.locator('#degree').selectOption(mapNivelEducativo[u.nivel_educativo] ?? u.nivel_educativo);

      if (u.titulo) {
        await page.getByRole('textbox', { name: 'Bachiller' }).fill(u.titulo);
      }

      await page.locator('#programmingLevel').selectOption(mapConocimientos[u.conocimientos_programacion] ?? u.conocimientos_programacion);
      await page.locator('#occupation').selectOption(mapOcupacion[u.ocupacion] ?? u.ocupacion);

      await page.getByRole('checkbox', { name: 'He leído y acepto la Política' }).check();
      await page.getByRole('checkbox', { name: 'Acepto los Términos de uso' }).check();

      // ── Guardar y medir tiempo de respuesta del servidor ──────────────────
      const inicioGuardado = Date.now();
      await page.getByRole('button', { name: 'Guardar' }).click();

      // Espera la redirección al dashboard (hasta 60s bajo carga)
      await page.waitForURL('**/userDashboard', { timeout: 60_000 });

      const tiempoRespuesta = Date.now() - inicioGuardado;
      const tiempoTotal = Date.now() - inicio;

      console.log(
        `[${testNum}] ✅ ${u.nombre} ${u.apellido} | ` +
        `Respuesta servidor: ${tiempoRespuesta}ms | Total: ${tiempoTotal}ms`
      );

      // Verificar que llegamos al dashboard
      expect(page.url()).toContain('userDashboard');
    });
  }
});

import { test } from '@playwright/test';
import usuarios from '../usersJoin.json' with { type: 'json' };

// ── Mapeos de valores JSON → valores del formulario ──────────────────────────

/** Convierte "DD/MM/AAAA" → "YYYY-MM-DD" para el input type="date" */
function convertirFecha(fecha: string): string {
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes}-${dia}`;
}

/** Departamento (texto JSON) → valor del <select id="district"> */
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

/** Horario → valor del <select id="schedule"> */
const mapHorario: Record<string, string> = {
  'Mañana (6:00 AM - 2:00 PM)': 'Morning',
  'Tarde (2:00 PM - 10:00 PM)': 'Afternoon',
  'Noche (6:00 PM - 10:00 PM)': 'Night',
};

/** Medio de comunicación → valor del <select id="bestContact"> */
const mapMedioComunicacion: Record<string, string> = {
  'WhatsApp': 'WhatsApp',
  'Correo electrónico': 'Correo electrónico',
  'Llamada telefónica': 'Llamada telefónica',
};

/** Nivel educativo → valor del <select id="degree"> */
const mapNivelEducativo: Record<string, string> = {
  'Bachiller': 'Bachelor',
  'Técnico': 'Technician',
  'Tecnólogo': 'Technologist',
  'Profesional': 'Professional',
  'Especialización': 'Specialization',
  'Maestría': 'Master',
  'Doctorado': 'Doctorate',
};

/** Conocimientos en programación → valor del <select id="programmingLevel"> */
const mapConocimientos: Record<string, string> = {
  'Ninguno': 'None',
  'Básico': 'Basic',
  'Intermedio': 'Intermediate',
  'Avanzado': 'Advanced',
};

/** Ocupación → valor del <select id="occupation"> */
const mapOcupacion: Record<string, string> = {
  'Empleado': 'Employee',
  'Estudiante': 'Student',
  'Desempleado': 'Unemployed',
  'Independiente / Freelance': 'Freelancer',
};

// ── Tests ─────────────────────────────────────────────────────────────────────

for (const usuario of usuarios.usuarios) {
  const p1 = usuario.pagina1_datos;
  const p2 = usuario.pagina2_ubicacion;
  const p3 = usuario.pagina3_formacion;

  test(`Registrar usuario: ${p1.nombre} ${p1.apellido}`, async ({ page }) => {

    // ── Página 1: Datos personales ──────────────────────────────────────────
    await page.goto('https://join.riwi.io/register');

    // Nombre
    await page.getByRole('textbox', { name: 'Introduce tu nombre' }).fill(p1.nombre);

    // Apellido
    await page.getByRole('textbox', { name: 'Introduce tu apellido' }).fill(p1.apellido);

    // Correo electrónico
    await page.getByRole('textbox', { name: 'ejemplo@correo.com' }).fill(p1.correo_electronico);

    // Discord (opcional)
    if (p1.usuario_discord) {
      await page.getByRole('textbox', { name: 'usuario#' }).fill(p1.usuario_discord);
    }

    // Contraseña
    await page.getByRole('textbox', { name: 'Min. 8 caracteres' }).fill(p1.contrasena);

    // Teléfono
    await page.getByRole('textbox', { name: '3208753487' }).fill(p1.telefono);

    // Fecha de nacimiento (DD/MM/AAAA → YYYY-MM-DD)
    await page.getByPlaceholder('DD/MM/AAAA').fill(convertirFecha(p1.fecha_nacimiento));

    // Tipo de documento
    await page.locator('#idType').selectOption(p1.tipo_documento);

    // Número de documento
    await page.getByRole('textbox', { name: '1234567890' }).fill(p1.numero_documento);

    // Género
    await page.locator('#gender').selectOption(p1.genero);

    // Tipo de convenio
    await page.locator('#conventionType').selectOption(p1.tipo_convenio);

    // Siguiente → Página 2
    await page.getByRole('button', { name: 'Siguiente' }).click();

    // ── Página 2: Ubicación ─────────────────────────────────────────────────
    // Departamento
    await page.locator('#district').selectOption(mapDepartamento[p2.departamento] ?? p2.departamento);

    // Esperar a que las opciones de municipio se carguen dinámicamente
    await page.waitForFunction(
      () => (document.querySelector('#city') as HTMLSelectElement)?.options.length > 1,
      { timeout: 15_000 }
    );

    // Municipio
    await page.locator('#city').selectOption(mapMunicipio[p2.municipio] ?? p2.municipio);

    // Sede de interés
    await page.locator('#site').selectOption(p2.sede_interes);

    // Estrato socioeconómico
    await page.locator('#socialStatus').selectOption(p2.estrato);

    // Horario
    await page.locator('#schedule').selectOption(mapHorario[p2.horario_estudio] ?? p2.horario_estudio);

    // Medio de comunicación
    await page.locator('#bestContact').selectOption(mapMedioComunicacion[p2.medio_comunicacion] ?? p2.medio_comunicacion);

    // Siguiente → Página 3
    await page.getByRole('button', { name: 'Siguiente' }).click();

    // ── Página 3: Formación ─────────────────────────────────────────────────
    // Nivel educativo
    await page.locator('#degree').selectOption(mapNivelEducativo[p3.nivel_educativo] ?? p3.nivel_educativo);

    // Título (opcional si está vacío)
    if (p3.titulo) {
      await page.getByRole('textbox', { name: 'Bachiller' }).fill(p3.titulo);
    }

    // Conocimientos en programación
    await page.locator('#programmingLevel').selectOption(mapConocimientos[p3.conocimientos_programacion] ?? p3.conocimientos_programacion);

    // Ocupación
    await page.locator('#occupation').selectOption(mapOcupacion[p3.ocupacion] ?? p3.ocupacion);

    // Aceptar política de datos
    if (p3.acepta_politica_datos) {
      await page.getByRole('checkbox', { name: 'He leído y acepto la Política' }).check();
    }

    // Aceptar términos de uso / chatbot
    if (p3.acepta_terminos_chatbot) {
      await page.getByRole('checkbox', { name: 'Acepto los Términos de uso' }).check();
    }

    // Guardar y esperar redirección automática al dashboard
    await page.getByRole('button', { name: 'Guardar' }).click();

    // Espera a que el servidor procese el registro y redirija al dashboard
    await page.waitForURL('**/userDashboard', { timeout: 30_000 });
  });


}

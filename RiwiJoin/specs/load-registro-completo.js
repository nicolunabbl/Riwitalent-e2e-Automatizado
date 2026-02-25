import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";

// ── Métricas personalizadas ───────────────────────────────────────────────────
const registrosExitosos = new Counter("registros_exitosos");
const registrosFallidos = new Counter("registros_fallidos");
const tiempoRegistro = new Trend("tiempo_registro_ms");

// ── Configuración: ramp-up gradual para no explotar ni PC ni servidor ─────────
export const options = {
    stages: [
        { duration: "15s", target: 50 },   // subir a 50 VUs en 15s
        { duration: "15s", target: 100 },   // subir a 100 VUs en 15s
        { duration: "30s", target: 200 },   // subir a 200 VUs en 30s (pico máximo)
        { duration: "30s", target: 200 },   // mantener 200 VUs durante 30s
        { duration: "10s", target: 0 },     // bajar a 0 (cool-down)
    ],
    thresholds: {
        http_req_duration: ["p(95)<10000"],  // 95% de peticiones < 10 segundos
        registros_exitosos: ["count>50"],     // al menos 50 registros exitosos
    },
};

// ── Datos base para generar usuarios únicos ───────────────────────────────────
const nombres = [
    "Juan", "María", "Andrés", "Valentina", "Camilo", "Sofía", "Daniel",
    "Laura", "Sebastián", "Natalia", "Carlos", "Daniela", "Felipe", "Paula",
    "Julián", "Sara", "Óscar", "Manuela", "Esteban", "Carolina",
];

const apellidos = [
    "Gómez", "Rodríguez", "Restrepo", "Ospina", "Cárdenas", "Álvarez",
    "Quintero", "Patiño", "Arboleda", "Zapata", "Vargas", "Torres",
    "Suárez", "Herrera", "Rojas", "Mendoza", "Medina", "Jiménez",
    "Duque", "Montoya",
];

const departamentos = [
    { district: "ANTIOQUIA", cities: ["MEDELLÍN", "BELLO", "ENVIGADO", "ITAGÜÍ", "SABANETA", "RIONEGRO"] },
    { district: "ATLÁNTICO", cities: ["BARRANQUILLA", "SOLEDAD", "MALAMBO", "GALAPA"] },
    { district: "VALLE DEL CAUCA", cities: ["SANTIAGO DE CALI", "PALMIRA"] },
    { district: "CUNDINAMARCA", cities: ["SOACHA"] },
    { district: "BOGOTÁ, D.C.", cities: ["BOGOTÁ, D.C."] },
    { district: "BOLÍVAR", cities: ["CARTAGENA DE INDIAS"] },
    { district: "SANTANDER", cities: ["BUCARAMANGA"] },
];

const grados = ["Bachelor", "Technician", "Technologist", "Professional"];
const niveles = ["None", "Basic", "Intermediate", "Advanced"];
const ocupaciones = ["Employee", "Student", "Unemployed", "Freelancer"];
const horarios = ["Morning", "Afternoon", "Night"];
const contactos = ["WhatsApp", "Correo electrónico", "Llamada telefónica"];
const generos = ["Masculino", "Femenino"];
const convenios = ["Ninguno", "Crack the Code"];
const sedes = ["Medellín", "Barranquilla"];
const documentos = ["Cédula de ciudadanía", "Tarjeta de identidad"];

// ── Utilidades ────────────────────────────────────────────────────────────────
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomDigits(n) {
    let s = "";
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
    return s;
}

function randomDate() {
    const year = 1995 + Math.floor(Math.random() * 12); // 1995–2006
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, "0");
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function generarUsuario(vuId, iter) {
    const nombre = pick(nombres);
    const apellido = pick(apellidos);
    const ubicacion = pick(departamentos);
    const city = pick(ubicacion.cities);
    const uid = `${vuId}_${iter}_${Date.now()}`;

    return {
        firstName: nombre,
        lastName: apellido,
        discordUser: "",
        email: `loadtest+${uid}@testmail.com`,
        phone: `+5731${randomDigits(8)}`,
        birthDate: randomDate(),
        idType: pick(documentos),
        idNumber: randomDigits(10),
        gender: pick(generos),
        conventionType: pick(convenios),
        password: `RiwiLoad${randomDigits(2)}!`,
        degree: pick(grados),
        degreeTitle: "Bachiller",
        programmingLevel: pick(niveles),
        occupation: pick(ocupaciones),
        schedule: pick(horarios),
        bestContact: pick(contactos),
        district: ubicacion.district,
        city: city,
        socialStatus: String(1 + Math.floor(Math.random() * 6)),
        site: pick(sedes),
        privacyPolicyAccepted: true,
        chatbotTermsAccepted: true,
    };
}

// ── Test principal ────────────────────────────────────────────────────────────
export default function () {
    const usuario = generarUsuario(__VU, __ITER);

    const payload = JSON.stringify([usuario]);

    const headers = {
        "accept": "text/x-component",
        "content-type": "text/plain;charset=UTF-8",
        "next-action": "40ccc6ba78b82e69d8933af70a97b631fd2e0cb267",
        "next-router-state-tree":
            "%5B%22%22%2C%7B%22children%22%3A%5B%22(auth)%22%2C%7B%22children%22%3A%5B%22register%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
        "origin": "https://join.riwi.io",
        "referer": "https://join.riwi.io/register",
    };

    const res = http.post("https://join.riwi.io/register", payload, {
        headers: headers,
        timeout: "30s",
    });

    const exito = check(res, {
        "status 200 o 303": (r) => r.status === 200 || r.status === 303,
        "respuesta < 10s": (r) => r.timings.duration < 10000,
    });

    tiempoRegistro.add(res.timings.duration);

    if (exito) {
        registrosExitosos.add(1);
    } else {
        registrosFallidos.add(1);
        // Log de errores para debugging
        if (__ITER < 3) {
            console.log(
                `[VU${__VU}] ❌ Status: ${res.status} | ` +
                `Duración: ${res.timings.duration}ms | ` +
                `Body: ${res.body ? res.body.substring(0, 200) : "vacío"}`
            );
        }
    }

    // Think time: simula que un usuario real tarda ~2-5s entre acciones
    sleep(2 + Math.random() * 3);
}

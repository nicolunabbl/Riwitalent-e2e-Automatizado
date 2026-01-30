---
description: Guía paso a paso para crear una nueva prueba E2E en el proyecto
---

Sigue este flujo de trabajo para asegurar que la nueva prueba cumpla con la arquitectura del proyecto (POM + Flows + Specs).

### 1. Preparación de la Interfaz (Page Objects)
Antes de escribir el test, los elementos de la UI deben estar mapeados.
- Revisa `tests-e2e/pages/` para ver si la página o componentes ya existen.
- Si no existen, crea un nuevo archivo (ej. `mi-pagina.page.ts`) y define los locators usando `page.getByTestId()`.

### 2. Gestión de Datos (Fixtures)
- Revisa `tests-e2e/fixtures/users.json` si necesitas usuarios específicos.
- Si necesitas datos de prueba dinámicos o estáticos, agrégalos a un archivo JSON en esta carpeta.

### 3. Abstracción de Procesos (Flows) - Opcional
- Si la prueba requiere una secuencia compleja de pasos que podría repetirse en otros tests (ej. "Crear una solicitud completa"), crea un archivo en `tests-e2e/flows/`.
- Esto mantiene tus archivos `.spec` limpios y enfocados en la aserción.

### 4. Creación del Test (Spec)
- Crea el archivo en `tests-e2e/specs/[feature]/[nombre].spec.ts`.
- Estructura básica:
    1. Importar `test`, `expect`, `Page Objects` y `Fixtures`.
    2. Usar `test.describe` para agrupar.
    3. Usar `test.step` para documentar los pasos dentro de la prueba.

### 5. Validación
Ejecuta la prueba localmente para confirmar que es estable:
```powershell
npx playwright test tests-e2e/specs/[camino-al-test].spec.ts --ui
```

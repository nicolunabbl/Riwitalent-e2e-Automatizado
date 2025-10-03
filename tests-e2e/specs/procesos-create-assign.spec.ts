import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { Sidebar } from '../pages/sidebar.page';
// import { EmpresasPage } from '../pages/empresas.page';
// import { TalentoPage } from '../pages/talento.page';
import { ProcesosPage } from '../pages/procesos.page';
import { buildEmpresa, buildTalento, unique } from '../utils/builders';


const admin = require('../fixtures/users.json').find((u:any)=>u.role==='admin');


// Flujo 100% UI: crear Empresa, crear Talento, crear Proceso y asignar Talento


test('@smoke @procesos Crear proceso (UI) y asignar talento a empresa (UI)', async ({ page }) => {
// Login
const login = new LoginPage(page);
await login.goto();
await login.login(admin.email, admin.pass);


const nav = new Sidebar(page);
await nav.dashboardVisible();


// // 1) Crear Empresa por UI
// await nav.gotoEmpresas();
// const empresas = new EmpresasPage(page);
// const empresaData = buildEmpresa();
// await empresas.create(empresaData.name);
// await empresas.searchBy(empresaData.name);


// // 2) Crear Talento por UI (mínimo)
// await nav.gotoTalento();
// const talento = new TalentoPage(page);
// const talentoNombre = unique('Auto Test');
// await talento.create(talentoNombre, 'JavaScript');


// 3) Crear Proceso y asignar talento a la empresa por UI
await nav.gotoProcesos();
const procesos = new ProcesosPage(page);
const procesoNombre = unique('Proceso');
await procesos.createProcessUI({
name: procesoNombre,
companyName: empresaData.name,
description: 'Proceso auto e2e',
vacancies: 1,
typeContract: 'FULL_TIME',
workMode: 'REMOTE',
});


await procesos.assignTalentByName(talentoNombre);


// Verificación mínima: el proceso aparece en la lista
await expect(page.getByTestId('proceso-row').filter({ hasText: procesoNombre })).toBeVisible();
});
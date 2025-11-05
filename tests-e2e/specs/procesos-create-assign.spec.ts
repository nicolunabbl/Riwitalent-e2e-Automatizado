import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { Sidebar } from '../pages/sidebar.page';
import { ProcesosPage } from '../pages/procesos.page';
import { buildProcesoUI } from '../utils/builders';
import { resolveCreds } from '../utils/creds';

// Usuario admin desde fixtures
import users from '../fixtures/users.json' with { type: "json" };
const admin = users.find((u: any) => u.role === 'admin');

test('@smoke @procesos Crear proceso con datos aleatorios', async ({ page }) => {
  // Login
  const adminCreds = resolveCreds(admin);
  const login = new LoginPage(page);
  await login.goto();
  await login.login(adminCreds.email, adminCreds.pass);

  // Navegar a Procesos
  const nav = new Sidebar(page);
  await nav.dashboardVisible();
  await nav.gotoProcesos();

  // Generar datos aleatorios para el proceso
  const procesoData = buildProcesoUI();

  const procesos = new ProcesosPage(page);
  await procesos.createProcessUI({
    companyName: 'Blackbird Labs', 
    ...procesoData
  });

});

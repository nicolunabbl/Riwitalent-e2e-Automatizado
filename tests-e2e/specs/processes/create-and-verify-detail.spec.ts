import { test } from '@playwright/test';

import { createProcessFlow } from '../../flows/procesos/create-process.flow';
import { verifyProcessDetailFlow } from '../../flows/procesos/verify-process-detail.flow';
import { buildProcesoUI } from '../../utils/builders';
import users from '../../fixtures/users.json' with { type: 'json' };
import { resolveCreds } from '../../utils/creds';
import { LoginPage } from '../../pages/login/login.page';
import { Sidebar } from '../../pages/home/sidebar.page';

const admin = users.find((u: any) => u.role === 'admin');

test('@smoke @procesos Crear y verificar detalle', async ({ page }) => {
  // Login
  const creds = resolveCreds(admin);
  const login = new LoginPage(page);
  await login.goto();
  await login.login(creds.email, creds.pass);

  // Navegar a Procesos
  const nav = new Sidebar(page);
  await nav.dashboardVisible();
  await nav.gotoProcesos();

  // Crear y luego verificar detalle
  const data = { companyName: 'Blackbird Labs', ...buildProcesoUI() };
  await createProcessFlow(page, data);
  await verifyProcessDetailFlow(page, data);
});

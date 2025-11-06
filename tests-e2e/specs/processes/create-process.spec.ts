import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login/login.page';
import { Sidebar } from '../../pages/home/sidebar.page';
import { createProcessFlow } from '../../flows/procesos/create-process.flow';
import { buildProcesoUI } from '../../utils/builders';
import users from '../../fixtures/users.json' with { type: 'json' };
import { resolveCreds } from '../../utils/creds';

const admin = users.find((u: any) => u.role === 'admin');

test('@smoke @procesos Crear proceso con datos aleatorios', async ({ page }) => {
  const adminCreds = resolveCreds(admin);
  const login = new LoginPage(page);
  await login.goto();
  await login.login(adminCreds.email, adminCreds.pass);

  const nav = new Sidebar(page);
  await nav.dashboardVisible();
  await nav.gotoProcesos();

  await createProcessFlow(page, { companyName: 'Blackbird Labs', ...buildProcesoUI() });
});

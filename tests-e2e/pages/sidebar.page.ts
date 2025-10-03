import { Page, expect } from '@playwright/test';
export class Sidebar {
constructor(private page: Page) {}
async dashboardVisible(){ await expect(this.page.getByTestId('dashboard-root')).toBeVisible(); }
gotoEmpresas(){ return this.page.getByTestId('nav-empresas').click(); }
gotoTalento(){ return this.page.getByTestId('nav-talento').click(); }
gotoProcesos(){ return this.page.getByTestId('nav-procesos').click(); }
gotoSolicitudes(){ return this.page.getByTestId('nav-solicitudes').click(); }
}
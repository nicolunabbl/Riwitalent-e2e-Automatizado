import { Page, expect } from '@playwright/test';
export class Sidebar {
constructor(private page: Page) {}
async dashboardVisible(){ await expect(this.page.getByRole('link', { name: 'Panel' })).toBeVisible(); }
gotoEmpresas(){ return this.page.getByRole('link', { name: 'Empresas' }).click(); }
gotoTalento(){ return this.page.getByRole('link', { name: 'Talento' }).click(); }
gotoProcesos(){ return this.page.getByRole('link', { name: 'Procesos' }).click(); }
gotoSolicitudes(){ return this.page.getByRole('link', { name: 'Solicitudes' }).click(); }
}
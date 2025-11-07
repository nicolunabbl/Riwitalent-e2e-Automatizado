import { Page, expect } from '@playwright/test';

export class ProcesosListPage {
  constructor(private page: Page) {}
  searchInput = this.page.getByPlaceholder(/Buscar proceso/i);
  heading     = this.page.getByRole('heading', { name: /Procesos encontrados/i });
private esc(s:string){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

rowLinkByName = (name: string) =>
  this.page.getByRole('link', { name: new RegExp(this.esc(name), 'i') }).first();

  async goto(){ await this.page.goto('/es/processes'); await expect(this.heading).toBeVisible(); }
  async openCreateModal(){ await this.page.getByRole('button', { name: 'Crear proceso' }).click(); }
async search(name: string, requiresEnter = true) {
  await this.searchInput.fill(name);
  if (requiresEnter) await this.page.keyboard.press('Enter');

  const rx = new RegExp(this.esc(name), 'i');
  await expect
    .poll(async () => await this.page.getByRole('link', { name: rx }).count(), {
      timeout: 10000,
      message: 'Esperando a que la lista muestre el proceso filtrado',
    })
    .toBeGreaterThan(0);
}

  async expectRowVisible(name: string){ await expect(this.rowLinkByName(name)).toBeVisible({ timeout: 15000 }); }

  // contenedor de la fila por nombre (card/row)
rowContainerByName = (name: string) =>
  this.rowLinkByName(name).locator('xpath=ancestor::*[self::tr or contains(@class,"gap-")][1]');

// click al "ojo" (icon button) dentro de la fila
// click al "ojo" (icon button) dentro de la fila
async openDetailByEye(name: string) {
  const row = this.rowContainerByName(name);
  await expect(row).toBeVisible({ timeout: 15000 });
  await row.scrollIntoViewIfNeeded();
  await row.hover();

  // Intento 1: botón accesible con nombre típico en la última celda (Acciones)
  let eye = row.locator('td').last().getByRole('button', { name: /ver|detalle|visualizar|eye/i }).first();

  // Intento 2: si no hay nombre accesible, toma el primer botón visible de Acciones
  if (!(await eye.count())) {
    eye = row.locator('td').last().getByRole('button').first();
  }

  // Intento 3: si la tabla no usa <td> (card/grid), cae a cualquier botón dentro de la fila
  if (!(await eye.count())) {
    eye = row.getByRole('button', { name: /ver|detalle|visualizar|eye/i }).first();
    if (!(await eye.count())) eye = row.getByRole('button').first();
  }

  await eye.waitFor({ state: 'visible' });
  await eye.click();

  // Espera navegación o señal de detalle (SPA)
  const urlRx = /\/(?:es\/)?processes\/[a-f0-9-]+/i;
  try {
    await Promise.race([
      this.page.waitForURL(urlRx, { timeout: 8000 }),
      this.page.getByRole('heading', { name: /Talento en el Proceso/i }).waitFor({ state: 'visible', timeout: 8000 })
    ]);
  } catch {
    // Fallback: click al link del nombre (más confiable)
    await this.rowLinkByName(name).click();
    await Promise.race([
      this.page.waitForURL(urlRx, { timeout: 10000 }),
      this.page.getByRole('heading', { name: /Talento en el Proceso/i }).waitFor({ state: 'visible', timeout: 10000 })
    ]);
  }
}


}

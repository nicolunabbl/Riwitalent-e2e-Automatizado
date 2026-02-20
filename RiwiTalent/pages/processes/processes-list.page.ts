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
}

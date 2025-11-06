import { Page, expect } from '@playwright/test';
export class Toast {
  constructor(private page: Page) {}
  private esc(s:string){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
  async expectSuccessSoft(msg: string) {
    const ex = new RegExp(`^\\s*¡?${this.esc(msg)}\\s+ha sido creado exitosamente!?\\s*$`, 'i');
    const toast = this.page.locator(
      '[data-testid="toast-success"],[data-sonner-toast][data-type="success"],[role="status"] li,[role="alert"] li,li'
    ).filter({ hasText: ex }).first();
    await expect.soft(toast).toBeVisible({ timeout: 7000 });
  }
}

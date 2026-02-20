import { Page, Locator, expect } from '@playwright/test';

export class Combobox {
  constructor(private page: Page, private trigger: Locator, private content?: Locator) {}
  private esc(s: string){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  async open() {
    console.log('Abriendo combobox...');
    await this.trigger.waitFor({ state: 'visible' });
    
    const clickAndVerify = async () => {
        await this.trigger.click({ force: true });
        const scope = this.content ?? this.page.locator('[role="listbox"],[role="menu"],[role="dialog"],[data-slot="popover-content"], .radix-popover-content, .radix-select-content').first();
        try {
            await scope.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch (e) {
            return false;
        }
    };

    if (!(await clickAndVerify())) {
        console.warn('Primer click no abrió el combo, re-intentando...');
        await this.page.waitForTimeout(500);
        await clickAndVerify();
    }
    console.log('Proceso de apertura finalizado (con o sin detección de scope).');
  }

  async selectExact(label: string) {
    const ex = new RegExp(`^${this.esc(label)}$`, 'i');
    const scope = this.content ?? this.page;
    
    console.log(`Buscando opción: ${label}`);
    let option = scope.getByRole('option', { name: ex }).first();
    if (!(await option.count())) option = scope.getByRole('menuitem', { name: ex }).first();
    if (!(await option.count())) option = scope.getByText(ex).first();
    
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();
    console.log('Opción clickeada.');

    // Ensure it closes
    await this.page.waitForTimeout(500);
    if (await option.isVisible()) {
        console.log('La opción sigue visible, presionando Escape para asegurar cierre del combo.');
        await this.page.keyboard.press('Escape');
    }
  }

  async searchAndSelect(label: string) {
    await this.open();
    const scope = this.content ?? this.page;
    const input = scope.locator('input[placeholder*="skill" i], [placeholder*="skill" i]').first();
    if (await input.count()) await input.fill(label);
    await this.selectExact(label);
  }
}

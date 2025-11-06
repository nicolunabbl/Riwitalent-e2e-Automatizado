import { Page, Locator, expect } from '@playwright/test';

export class Combobox {
  constructor(private page: Page, private trigger: Locator, private content?: Locator) {}
  private esc(s: string){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  async open() {
    await this.trigger.waitFor({ state: 'visible' });
    await this.trigger.click();
    const scope = this.content ?? this.page.locator('[role="listbox"],[role="menu"],[role="dialog"],[data-slot="popover-content"]').first();
    await scope.waitFor({ state: 'visible', timeout: 15000 });
  }

  async selectExact(label: string) {
    const ex = new RegExp(`^${this.esc(label)}$`, 'i');
    const scope = this.content ?? this.page;
    let option = scope.getByRole('option', { name: ex }).first();
    if (!(await option.count())) option = scope.getByRole('menuitem', { name: ex }).first();
    if (!(await option.count())) option = scope.getByText(ex).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async searchAndSelect(label: string) {
    await this.open();
    const scope = this.content ?? this.page;
    const input = scope.locator('input[placeholder*="skill" i], [placeholder*="skill" i]').first();
    if (await input.count()) await input.fill(label);
    await this.selectExact(label);
  }
}

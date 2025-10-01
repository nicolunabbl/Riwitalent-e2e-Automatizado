import { Page, expect } from '@playwright/test';

export class ProcesosPage {
constructor(private page: Page) {}
createBtn = this.page.getByTestId('proceso-create-button');
saveBtn = this.page.getByTestId('proceso-save-button');
stateSel = this.page.getByTestId('proceso-state-select');
assignBtn = this.page.getByTestId('proceso-assign-talento-button');


async create(name: string){
await this.createBtn.click();
await this.page.fill('[data-testid="proceso-name-input"]', name);
await this.saveBtn.click();
await expect(this.page.getByTestId('toast-success')).toBeVisible();
}
}
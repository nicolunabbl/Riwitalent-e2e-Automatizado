// /pages/procesos.page.ts
import { Page, expect } from '@playwright/test';
export class ProcesosPage {
constructor(private page: Page) {}
// Buttons / actions
createBtn = this.page.getByTestId('proceso-create-button');
saveBtn = this.page.getByTestId('proceso-save-button');
assignBtn = this.page.getByTestId('proceso-assign-talento-button');
stateSel = this.page.getByTestId('proceso-state-select');


// Form fields (asumidos por data-testid; ajustar a la UI real)
nameInput = this.page.getByTestId('proceso-name-input');
descriptionInput = this.page.getByTestId('proceso-description-input');
vacanciesInput = this.page.getByTestId('proceso-vacancies-input');
typeContractSel = this.page.getByTestId('proceso-typeContract-select');
workModeSel = this.page.getByTestId('proceso-workMode-select');
companySel = this.page.getByTestId('proceso-company-select');


// Assign talent modal/dialog
studentSearch = this.page.getByTestId('proceso-student-search-input');
studentRowByName = (name: string) => this.page.getByTestId('proceso-student-row').filter({ hasText: name });
confirmAssignBtn = this.page.getByTestId('proceso-assign-confirm');


rowByName = (name: string) => this.page.getByTestId('proceso-row').filter({ hasText: name });


async createProcessUI(data: {
name: string;
companyName: string;
description?: string;
vacancies?: number;
typeContract?: string; // FULL_TIME, PART_TIME, etc.
workMode?: string; // REMOTE, HYBRID, ONSITE
}) {
await this.createBtn.click();
await this.nameInput.fill(data.name);
if (data.description) await this.descriptionInput.fill(data.description);
if (data.vacancies) await this.vacanciesInput.fill(String(data.vacancies));


// Select company
await this.companySel.click();
await this.page.getByRole('option', { name: data.companyName }).click();


// Optional selects
if (data.typeContract) {
await this.typeContractSel.click();
await this.page.getByRole('option', { name: data.typeContract }).click();
}
if (data.workMode) {
await this.workModeSel.click();
await this.page.getByRole('option', { name: data.workMode }).click();
}


await this.saveBtn.click();
await expect(this.page.getByTestId('toast-success')).toBeVisible();
await expect(this.rowByName(data.name)).toBeVisible();
}


async assignTalentByName(talentName: string) {
}
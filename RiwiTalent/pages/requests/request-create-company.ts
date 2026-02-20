import { Page, expect } from '@playwright/test';

export interface CompanyData {
    name: string;
    serviceEmail: string;
    commercialEmail?: string;
    adminEmail?: string;
    phone: string;
    nit: string;
    industry: string;
    description?: string;
}

export class CreateCompany {
    constructor(private page: Page) {}

    // Flexible locators according to recording labels
    nameInput = this.page.getByRole('textbox', { name: /Nombre de la empresa/i });
    serviceEmailInput = this.page.getByRole('textbox', { name: /Email de servicio/i });
    commercialEmailInput = this.page.getByRole('textbox', { name: /Email comercial/i });
    adminEmailInput = this.page.getByRole('textbox', { name: /Email administrativo/i });
    phoneInput = this.page.getByRole('textbox', { name: /3152345678|Telefóno/i }); 
    nitInput = this.page.getByRole('textbox', { name: /NIT \(Id empresa\)/i });
    industryTrigger = this.page.getByRole('combobox').filter({ hasText: /Seleccionar industria\.\.\./i });
    descriptionInput = this.page.getByRole('textbox', { name: /Descripci.n de la empresa/i });
        
    async fillForm(data: CompanyData) { 
        console.log('--- Llenando formulario de nueva empresa ---');
        await this.nameInput.waitFor({ state: 'visible' });
        await this.nameInput.fill(data.name);
        await this.serviceEmailInput.fill(data.serviceEmail);
        
        if (data.commercialEmail) {
            await this.commercialEmailInput.fill(data.commercialEmail);
        }
        
        if (data.adminEmail) {
            await this.adminEmailInput.fill(data.adminEmail);
        }

        await this.phoneInput.fill(data.phone);
        await this.nitInput.fill(data.nit);
        
        // Select Industry
        console.log(`Seleccionando industria: ${data.industry}`);
        await this.industryTrigger.click();
        
        // Wait for options and click
        const industryOption = this.page.getByRole('option', { name: new RegExp(data.industry, 'i') }).first();
        await industryOption.waitFor({ state: 'visible' });
        await industryOption.click();

        if (data.description) {
            await this.descriptionInput.fill(data.description);
        }
        
        console.log('Continuando flujo de solicitud...');
    }
}

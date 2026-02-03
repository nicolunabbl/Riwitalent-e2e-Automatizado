import { Page, expect } from '@playwright/test';
import { Combobox } from '../components/combobox.component';

export class CreateRequest {
    constructor(private page: Page) {}

    // Locators
    titleInput = this.page.getByLabel(/T.tulo del cargo/i);
    descriptionInput = this.page.getByLabel(/Descripci.n del cargo/i);
    salaryInput = this.page.getByLabel(/Salario talento/i);
    vacanciesInput = this.page.getByLabel(/N.mero de vacantes/i);
    
    purposeInput = this.page.getByLabel(/Prop.sito del rol/i);
    relationsInput = this.page.getByLabel(/Relaciones laborales/i);
    responsibilitiesInput = this.page.getByLabel(/Responsabilidades principales/i);

    // Skills
    skillsSearchTrigger = this.page.getByText(/Buscar skills\.\.\./i);
    skillsLevelTrigger = this.page.getByRole('combobox').filter({ hasText: /Avanzado|Intermedio|B.sico/i });
    skillsSearchInput = this.page.getByRole('textbox', { name: /Buscar skills\.\.\./i });

    // Triggers
    seniorityTrigger = this.page.locator('div').filter({ hasText: /^Seniority/i }).locator('button').first();
    companyTrigger = this.page.locator('button').filter({ hasText: /Selecciona/i }).first();
    contractTrigger = this.page.locator('div').filter({ hasText: /^Tipo de contrato/i }).locator('button').first();
    modalityTrigger = this.page.locator('div').filter({ hasText: /^Modalidad de trabajo/i }).locator('button').first();
    englishTrigger = this.page.locator('div').filter({ hasText: /^Nivel de ingl.s/i }).locator('button').first();

    sendRequestButton = this.page.getByRole('button', { name: /Enviar solicitud/i });

    // Actions
    async fillTitle(title: string) {
        await this.titleInput.fill(title);
    }

    async fillDescription(description: string) {
        await this.descriptionInput.fill(description);
    }

    async selectSeniority(seniority: string) {
        const combo = new Combobox(this.page, this.seniorityTrigger);
        await combo.open();
        await this.selectOptionRobustly(seniority);
    }

    async selectCompany(company: string) {
        const combo = new Combobox(this.page, this.companyTrigger);
        await combo.open();
        await this.selectOptionRobustly(company);
    }

    async selectContractType(contract: string) {
        const combo = new Combobox(this.page, this.contractTrigger);
        await combo.open();
        await this.selectOptionRobustly(contract);
    }

    async selectWorkModality(modality: string) {
        const combo = new Combobox(this.page, this.modalityTrigger);
        await combo.open();
        await this.selectOptionRobustly(modality);
    }

    async selectEnglishLevel(level: string) {
        const combo = new Combobox(this.page, this.englishTrigger);
        await combo.open();
        await this.selectOptionRobustly(level);
    }

    async fillSalary(salary: string | number) {
        await this.salaryInput.fill(salary.toString());
    }

    async fillVacancies(vacancies: string | number) {
        await this.vacanciesInput.fill(vacancies.toString());
    }

    async fillPurpose(purpose: string) {
        await this.purposeInput.fill(purpose);
    }

    async fillLabRelational(relations: string) {
        await this.relationsInput.fill(relations);
    }

    async fillMainResponsibilities(responsibilities: string) {
        await this.responsibilitiesInput.fill(responsibilities);
    }

    async selectSkillLevel(level: string) {
        console.log(`Selecting skills level: ${level}`);
        try {
            await this.skillsLevelTrigger.first().click();
            await this.page.waitForTimeout(1000);
            const levelOption = this.page.getByRole('option', { name: new RegExp(`^${level}$`, 'i') }).first();
            await levelOption.click();
        } catch (e) {
            console.warn(`Could not select skill level: ${level}.`);
        }
    }

    async addSkillName(skill: string) {
        console.log(`--- Registering Skill: ${skill} ---`);
        
        // 1. Click Search Trigger (The text/button "Buscar skills...")
        await this.skillsSearchTrigger.first().click();
        
        // 2. Fill the specific textbox that says "Buscar skills..."
        await this.skillsSearchInput.first().waitFor({ state: 'visible' });
        await this.skillsSearchInput.first().fill(skill);
        
        // 3. Wait for results. According to recording, results are buttons.
        await this.page.waitForTimeout(1500); 
        
        const skillButton = this.page.getByRole('button', { name: new RegExp(`^${skill}$`, 'i') }).first();
        const fallbackButton = this.page.getByRole('button', { name: new RegExp(skill, 'i') }).first();

        try {
            if (await skillButton.isVisible()) {
                await skillButton.click();
                console.log(`Successfully Clicked Skill Button (Exact): ${skill}`);
            } else if (await fallbackButton.isVisible()) {
                await fallbackButton.click();
                console.log(`Successfully Clicked Skill Button (Partial): ${skill}`);
            } else {
                console.warn(`No button found for "${skill}", trying Enter fallback.`);
                await this.page.keyboard.press('Enter');
            }
        } catch (e) {
            console.error(`Error clicking skill "${skill}", using Enter as fallback.`);
            await this.page.keyboard.press('Enter');
        }
        
        await this.page.waitForTimeout(1000);
    }

    async send() {
        await this.sendRequestButton.click();
    }

    private async selectOptionRobustly(value: string) {
        const ex = new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`, 'i');
        // Wait for any option to be visible to ensure the list is open
        await this.page.getByRole('option').first().waitFor({ state: 'visible', timeout: 5000 });
        
        let option = this.page.getByRole('option', { name: ex }).first();
        if (!(await option.count())) {
            option = this.page.getByRole('option', { name: new RegExp(value, 'i') }).first();
        }

        if (await option.count()) {
            await option.scrollIntoViewIfNeeded();
            await option.click();
        } else {
            throw new Error(`Could not find option with label: ${value}`);
        }
    }
}
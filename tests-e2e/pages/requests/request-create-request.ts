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
    englishTrigger = this.page.locator('div,label').filter({ hasText: /Nivel de ingl.s|Ingl.s|English/i }).locator('button').first();

    sendRequestButton = this.page.getByRole('button', { name: /Enviar solicitud/i });
    createNewCompanyButton = this.page.getByRole('button', { name: /Crear nueva empresa/i });


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
        console.log(`Abriendo selector de nivel de inglés para: ${level}`);
        
        // Check if there is a native select nearby
        const nativeSelect = this.page.locator('select').filter({ has: this.page.locator('option', { hasText: new RegExp(level, 'i') }) }).first();
        
        if (await nativeSelect.count() > 0) {
            console.log('Detectado select nativo para Inglés, seleccionando directamente...');
            await nativeSelect.selectOption({ label: level });
        } else {
            const combo = new Combobox(this.page, this.englishTrigger);
            await combo.open();
            console.log('Combo de inglés abierto, buscando opción...');
            await this.selectOptionRobustly(level);
        }
        console.log(`Nivel de inglés ${level} procesado.`);
    }

    async fillSalary(salary: string | number) {
        console.log(`Filling salary: ${salary}`);
        await this.salaryInput.first().scrollIntoViewIfNeeded();
        await this.salaryInput.first().click({ force: true }); // Click to focus
        await this.salaryInput.first().fill(salary.toString());
        await this.salaryInput.first().press('Tab'); // Settle
    }

    async fillVacancies(vacancies: string | number) {
        await this.vacanciesInput.first().fill(vacancies.toString());
    }

    async fillPurpose(purpose: string) {
        console.log('Filling role purpose...');
        // Some fields might be in an accordion named "Información adicional"
        const accordion = this.page.getByText(/Información adicional/i);
        if (await accordion.isVisible() && !(await this.purposeInput.isVisible())) {
            await accordion.click();
            await this.page.waitForTimeout(500);
        }
        await this.purposeInput.first().fill(purpose);
    }

    async fillLabRelational(relations: string) {
        await this.relationsInput.first().fill(relations);
    }

    async fillMainResponsibilities(responsibilities: string) {
        await this.responsibilitiesInput.first().fill(responsibilities);
    }

    async selectSkillLevel(level: string) {
        console.log(`Selecting skills level: ${level}`);
        try {
            await this.skillsLevelTrigger.first().click({ force: true });
            await this.selectOptionRobustly(level);
        } catch (e) {
            console.warn(`Could not select skill level: ${level}.`);
        }
    }

    async addSkillName(skill: string) {
        console.log(`--- Registering Skill: ${skill} ---`);
        
        // 1. Click Search Trigger
        await this.skillsSearchTrigger.first().click({ force: true });
        
        // 2. Fill search
        await this.skillsSearchInput.first().waitFor({ state: 'visible', timeout: 5000 });
        await this.skillsSearchInput.first().fill(skill);
        await this.page.waitForTimeout(1000); 

        // 3. Select from results
        // Many systems use a specific list for search results
        const resultItem = this.page.locator('[role="option"], [role="button"], .command-item').filter({ hasText: new RegExp(`^${skill}$`, 'i') }).first();
        const fallbackItem = this.page.getByText(skill, { exact: true }).first();

        try {
            if (await resultItem.isVisible()) {
                await resultItem.click({ force: true });
            } else if (await fallbackItem.isVisible()) {
                await fallbackItem.click({ force: true });
            } else {
                await this.page.keyboard.press('Enter');
            }
        } catch (e) {
            await this.page.keyboard.press('Enter');
        }
        
        // 4. IMPORTANT: Ensure it was added. Usually a chip appears.
        // If it doesn't appear, try Enter.
        await this.page.waitForTimeout(500);
        await this.page.keyboard.press('Enter'); 
        
        console.log(`Skill ${skill} registration attempt finished.`);
    }

    private async selectOptionRobustly(value: string) {
        console.log(`Intentando seleccionar opción robustamente: ${value}`);
        const ex = new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`, 'i');
        
        // Wait for list to be ready
        await this.page.waitForTimeout(500);
        
        let option = this.page.getByRole('option', { name: ex }).first();
        if (!(await option.count())) {
            option = this.page.getByRole('option', { name: new RegExp(value, 'i') }).first();
        }
        if (!(await option.count())) {
            option = this.page.getByText(ex).first();
        }

        if (await option.count() > 0) {
            const tagName = await option.evaluate(el => el.tagName.toLowerCase());
            
            if (tagName === 'option') {
                console.log('Detectado elemento <option> nativo, buscando su contenedor <select>...');
                // Try to find the closest select element to this option
                const selectElement = option.locator('xpath=./ancestor::select');
                const value = await option.getAttribute('value') || await option.innerText();
                if (await selectElement.count() > 0) {
                    await selectElement.selectOption({ value: value });
                } else {
                    // Fallback to page level if parent find fails
                    await this.page.selectOption('select', { value: value }); 
                }
            } else {
                try {
                    await option.scrollIntoViewIfNeeded({ timeout: 2000 });
                } catch (e) {
                    console.warn(`No se pudo hacer scroll a la opción ${value}, intentando click forzado.`);
                }
                await option.click({ force: true });
            }
            console.log(`Opción ${value} procesada.`);
        } else {
            console.warn(`No se encontró la opción ${value} con localizadores estándar, intentando búsqueda por texto simple...`);
            const fallback = this.page.locator(`text=${value}`).first();
            if (await fallback.count() > 0) {
                await fallback.click({ force: true });
            } else {
                // Last ditch effort: ArrowDown + Enter
                console.warn('Intentando seleccionar mediante teclado (ArrowDown + Enter)...');
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('Enter');
            }
        }
        
        await this.page.waitForTimeout(500); // Settle time after selection
    }
    
    async send() {
        await this.sendRequestButton.click();
    }

}
import { Locator, Page } from '@playwright/test';
import { Combobox } from '../components/combobox.component';
import { Toast } from '../components/toast.component';

export class ProcesoCreateModal {
  constructor(private page: Page) {}

  saveBtn     = this.page.getByRole('button', { name: 'Crear' });
  companySel  = this.page.getByText('Selecciona una compañía...');
  nameInput   = this.page.getByRole('textbox', { name: 'Nombre del proceso' });
  descInput   = this.page.getByRole('textbox', { name: 'Descripción profesional' });
  workModeSel = this.page.getByRole('combobox').filter({ hasText: 'Modo de trabajo' });
  lineSel     = this.page.getByRole('combobox').filter({ hasText: 'Linea de negocio' });
  vacInput    = this.page.getByRole('spinbutton', { name: 'Número de vacantes' });
  englishSel  = this.page.getByRole('combobox').filter({ hasText: 'Selecciona el nivel de ingles' });
  skillsTrigger = this.page.locator('button[data-slot="popover-trigger"]').filter({ hasText: /skill/i });

    private async readComboValue(container: Locator) {
    const input = container.locator('xpath=.//input[1]');
    if (await input.count()) return await input.inputValue();
    return (await container.innerText()).trim();
  }

  async fillGeneral(data: {
    companyName: string; 
    name: string; 
    description: string;
    workMode: string; 
    businessLine: string; 
    vacancies: number; 
    englishLevel?: string;
  }) {
    await this.companySel.click();
    await this.page.getByRole('option', { name: data.companyName }).click();
    await this.nameInput.fill(data.name);
    await this.descInput.fill(data.description);
    await this.workModeSel.click();
    await this.page.getByRole('option', { name: data.workMode }).click();
    await this.lineSel.click();
    await this.page.getByRole('option', { name: data.businessLine }).click();
    await this.vacInput.fill(String(data.vacancies));
    if (data.englishLevel) {
      await this.englishSel.click();
      await this.page.getByRole('option', { name: data.englishLevel }).click();
    }
  }

  async addSkills(skills: string[]) {
    const combo = new Combobox(this.page, this.skillsTrigger);
    for (const s of skills) await combo.searchAndSelect(s);
  }

  async submitWithToastSoft(name: string) {
    await this.saveBtn.click();
    await new Toast(this.page).expectSuccessSoft(name);
  }
}

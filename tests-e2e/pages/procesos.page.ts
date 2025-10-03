import { Page, expect } from "@playwright/test";

export class ProcesosPage {
  constructor(private page: Page) {}

  createBtn = this.page.getByRole('button', { name: 'Crear proceso' });
  saveBtn = this.page.getByRole('button', { name: 'Crear' });
  companySel = this.page.getByText('Selecciona una compañía...');
  nameInput = this.page.getByRole('textbox', { name: 'Nombre del proceso' });
  descriptionInput = this.page.getByRole('textbox', { name: 'Descripción profesional' });
  workModeSel = this.page.getByRole('combobox').filter({ hasText: 'Modo de trabajo' });
  businessLineSel = this.page.getByRole('combobox').filter({ hasText: 'Linea de negocio' });
  vacanciesInput = this.page.getByRole('spinbutton', { name: 'Número de vacantes' });
  englishLevelSel = this.page.getByRole('combobox').filter({ hasText: 'Seleccionar nivel de inglés' });
  skillsSearch = this.page.getByText('Buscar skill...10');
  rowByName = (name: string) =>
  this.page.getByText(new RegExp(name, 'i'), { exact: false });

  async createProcessUI(data: {
    companyName: string;
    name: string;
    description: string;
    workMode: string;
    businessLine: string;
    vacancies: number;
    englishLevel?: string;
    skills?: string[];
  }) {
    await this.createBtn.click();

    await this.companySel.click();
    await this.page.getByRole("option", { name: data.companyName }).click();

    await this.nameInput.fill(data.name);
    await this.descriptionInput.fill(data.description);

    await this.workModeSel.click();
    await this.page.getByRole("option", { name: data.workMode }).click();

    await this.businessLineSel.click();
    await this.page.getByRole("option", { name: data.businessLine }).click();

    await this.vacanciesInput.fill(String(data.vacancies));

    if (data.englishLevel) {
      await this.englishLevelSel.click();
      await this.page.getByRole("option", { name: data.englishLevel }).click();
    }
//Aqui esta la falla
    if (data.skills) {
      for (const skill of data.skills) {
        await this.skillsSearch.fill(skill);
        await this.page.getByRole("option", { name: skill }).click();
      }
    }

    await this.saveBtn.click();
    await expect(this.page.getByTestId("toast-success")).toBeVisible();
    await expect(this.rowByName(data.name)).toBeVisible();
  }
}

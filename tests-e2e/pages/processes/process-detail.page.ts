import { Page, expect } from '@playwright/test';

export class ProcesoDetallePage {
  constructor(private page: Page) {}

  private esc(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  async expectLoaded(name: string) {
    // Encabezado con el nombre clicable
    await expect(
      this.page.getByRole('link', { name: new RegExp(`^${this.esc(name)}$`, 'i') })
    ).toBeVisible({ timeout: 15000 });
  }

  // Helpers por etiqueta -> valor (inputs/readonly en el panel izquierdo)
  async expectInputValue(label: RegExp, expected: string | RegExp) {
    const rx = expected instanceof RegExp ? expected : new RegExp(`^\\s*${this.esc(expected)}\\s*$`, 'i');
    await expect(this.page.getByLabel(label)).toHaveValue(rx);
  }

  async expectTextareaValue(label: RegExp, expected: string | RegExp) {
    const rx = expected instanceof RegExp ? expected : new RegExp(`^\\s*${this.esc(expected)}\\s*$`, 'i');
    await expect(this.page.getByRole('textbox', { name: label })).toHaveValue(rx);
  }

  async expectChip(text: string) {
    const rx = new RegExp(`^${this.esc(text)}$`, 'i');
    await expect(this.page.getByRole('button', { name: rx })).toBeVisible();
  }

  async expectVacancies(vacancies: number) {
    // Carta "Vacantes Disponibles" que muestra: "<N> Vacantes"
    const rx = new RegExp(`\\b${vacancies}\\b\\s*Vacantes`, 'i');
    await expect(this.page.getByText(rx)).toBeVisible();
  }

  // Validación de todos los campos que sí cargamos en la creación
  async expectDetailsMatch(data: {
    name: string;
    description: string;
    workMode: string;          // "Modalidad de Trabajo"
    businessLine: string;      // "Tipo de Contrato"
    vacancies: number;
    englishLevel?: string;     // "Nivel de Inglés"
    skills?: string[];
  }) {
    await this.expectLoaded(data.name);

    await this.expectInputValue(/Nombre/i, data.name);
    await this.expectTextareaValue(/Descripción/i, data.description);

    await this.expectInputValue(/Modalidad de Trabajo/i, data.workMode);
    await this.expectInputValue(/Tipo de Contrato/i, data.businessLine);
    if (data.englishLevel) {
      await this.expectInputValue(/Nivel de Ingl/i, data.englishLevel); // tolerante a acentos
    }

    if (data.skills?.length) {
      for (const s of data.skills) await this.expectChip(s);
    }

    await this.expectVacancies(data.vacancies);
  }
}

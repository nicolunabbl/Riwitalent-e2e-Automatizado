import { Page, expect } from '@playwright/test';
import { Toast } from '../components/toast.component';

export class ProcesoCreateModal {
  constructor(private page: Page) {}

  modal = this.page.getByTestId('create-process-modal');
  form = this.page.getByTestId('create-process-form');

  companyTrigger = this.page.getByTestId('create-process-company-selector');
  companySearch = this.page.getByTestId('create-process-company-search');
  companyReadonly = this.page.getByTestId('create-process-company-readonly');
  companyOptionById = (id: string | number) =>
    this.page.getByTestId(`create-process-company-option-${id}`);

  nameInput = this.page.getByTestId('create-process-name-input');
  descInput = this.page.getByTestId('create-process-description-input');

  seniorityTrigger = this.page.getByTestId('create-process-seniority-select');
  seniorityOption = (value: string | number) =>
    this.page.getByTestId(`create-process-seniority-option-${value}`);

  workModeTrigger = this.page.getByTestId('create-process-work-mode-select');
  workModeOption = (value: string | number) =>
    this.page.getByTestId(`create-process-work-mode-option-${value}`);

  hiringTrigger = this.page.getByTestId('create-process-hiring-type-select');
  hiringOption = (value: string) =>
    this.page.getByTestId(`create-process-hiring-type-option-${value}`);

  vacanciesInput = this.page.getByTestId('create-process-vacancies-input');

  englishTrigger = this.page.getByTestId('create-process-english-level-select');
  englishOption = (value: string | number) =>
    this.page.getByTestId(`create-process-english-level-option-${value}`);

  skillsTrigger = this.page.getByTestId('create-process-skill-combobox');
  skillsSearch = this.page.getByTestId('create-process-skill-search');
  skillOption = (id: string | number) =>
    this.page.getByTestId(`create-process-skill-option-${id}`);

  submitBtn = this.page.getByTestId('create-process-submit-button');
  cancelBtn = this.page.getByTestId('create-process-cancel-button');

  private mapWorkMode(label: string) {
    const map: Record<string, string> = {
      Remoto: '1',
      Remote: '1',
      Hibrido: '2',
      Híbrido: '2',
      Hybrid: '2',
      Presencial: '3',
      OnSite: '3',
    };
    return map[label.trim()] ?? '';
  }

  private mapHiring(label: string) {
    const map: Record<string, string> = {
      Staffing: 'Staff',
      Staff: 'Staff',
      'Direct hiring': 'Direct hiring',
      'Contratacion Directa': 'Direct hiring',
      'Contratación Directa': 'Direct hiring',
    };
    return map[label.trim()] ?? '';
  }

  private mapEnglish(label: string) {
    const first = label.split(' ')[0];
    const map: Record<string, string> = {
      Nativo: 'Native',
      Native: 'Native',
    };
    return map[first] ?? first;
  }

  async waitForOpen() {
    if (await this.modal.count()) {
      await expect(this.modal).toBeVisible({ timeout: 15000 });
    } else {
      await expect(this.form).toBeVisible({ timeout: 15000 });
    }
  }

  async selectCompany(name: string) {
    if (await this.companyReadonly.isVisible({ timeout: 1000 }).catch(() => false)) {
      return;
    }

    await this.companyTrigger.click();
    if (await this.companySearch.count()) {
      await this.companySearch.fill(name);
    }

    const optionById = this.page
      .locator('[data-test-id^="create-process-company-option-"]')
      .filter({ hasText: name })
      .first();

    if ((await optionById.count()) > 0) {
      await optionById.click();
      return;
    }

    await this.page.getByRole('option', { name }).first().click();
  }

  async fillGeneral(data: {
    companyName: string;
    name: string;
    description: string;
    workMode: string;
    businessLine: string;
    vacancies: number;
    englishLevel?: string;
    seniorityValue?: string | number;
    workModeId?: string | number;
    businessLineId?: string;
    englishCode?: string;
  }) {
    await this.waitForOpen();
    await this.selectCompany(data.companyName);

    await this.nameInput.fill(data.name);
    await this.descInput.fill(data.description);

    const seniorityValue = data.seniorityValue ?? 2;
    await this.seniorityTrigger.click();
    await this.seniorityOption(seniorityValue).click();

    await this.workModeTrigger.click();
    const workModeId = data.workModeId ?? this.mapWorkMode(data.workMode);
    if (workModeId) {
      await this.workModeOption(workModeId).click();
    } else {
      await this.page.getByRole('option', { name: data.workMode }).first().click();
    }

    await this.hiringTrigger.click();
    const hiringId = data.businessLineId ?? this.mapHiring(data.businessLine);
    if (hiringId) {
      await this.hiringOption(hiringId).click();
    } else {
      await this.page.getByRole('option', { name: data.businessLine }).first().click();
    }

    await this.vacanciesInput.fill(String(data.vacancies));

    if (data.englishLevel || data.englishCode) {
      await this.englishTrigger.click();
      const code = data.englishCode ?? this.mapEnglish(data.englishLevel as string);
      if (await this.englishOption(code).count()) {
        await this.englishOption(code).click();
      } else if (data.englishLevel) {
        await this.page.getByRole('option', { name: data.englishLevel }).first().click();
      }
    }
  }

  async addSkills(skills: string[]) {
    for (const skill of skills) {
      await this.skillsTrigger.click();
      await this.skillsSearch.fill(skill);

      const optionById = this.page
        .locator('[data-test-id^="create-process-skill-option-"]')
        .filter({ hasText: skill })
        .first();

      if ((await optionById.count()) > 0) {
        await optionById.click();
        continue;
      }

      await this.page.getByRole('button', { name: skill }).first().click();
    }
  }

  async submitWithToastSoft(name: string) {
    await this.submitBtn.click();
    // Wait for modal to close (indicates successful submission)
    await this.form.waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
    // Also try to catch the toast
    await new Toast(this.page).expectSuccessSoft(name).catch(() => {});
  }
}

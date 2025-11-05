import { Page, expect, Locator } from "@playwright/test";

export class ProcesosPage {
  constructor(private page: Page) {}

  createBtn   = this.page.getByRole("button", { name: "Crear proceso" });
  saveBtn     = this.page.getByRole("button", { name: "Crear" });
  companySel  = this.page.getByText("Selecciona una compañía...");
  nameInput   = this.page.getByRole("textbox", { name: "Nombre del proceso" });
  descriptionInput = this.page.getByRole("textbox", { name: "Descripción profesional" });
  workModeSel     = this.page.getByRole("combobox").filter({ hasText: "Modo de trabajo" });
  businessLineSel = this.page.getByRole("combobox").filter({ hasText: "Linea de negocio" });
  vacanciesInput  = this.page.getByRole("spinbutton", { name: "Número de vacantes" });
  englishLevelSel = this.page.getByRole("combobox").filter({ hasText: "Seleccionar nivel de inglés" });

  // Trigger del popover de skills
  skillsTrigger: Locator = this.page
    .locator('button[data-slot="popover-trigger"]')
    .filter({ hasText: /skill/i });

// Buscar proceso en la lista
searchInput = this.page.getByPlaceholder(/Buscar proceso/i);

// Link de la fila por nombre (más estable que proceso-row)
rowLinkByName = (name: string) =>
  this.page.getByRole('link', { name: new RegExp(`^${this.escapeRegex(name)}$`, 'i') });

private escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

private async assertToastSoft(name: string) {
  const msg = new RegExp(
    `^\\s*¡?${this.escapeRegex(name)}\\s+ha sido creado exitosamente!?\\s*$`,
    "i"
  );

  const toast = this.page
    .locator([
      '[data-testid="toast-success"]',               // si lo agregan en Front
      '[data-sonner-toast][data-type="success"]',    // sonner/shadcn
      '[role="status"] li',                          // aria-live
      '[role="alert"] li',
      'li'                                           // tu caso actual
    ].join(', '))
    .filter({ hasText: msg })
    .first();

  await expect.soft(toast).toBeVisible({ timeout: 7000 });
}

// Confirma que el proceso aparece en la lista (URL, filtro y link visible)
async verifyProcessInList(name: string) {
  await expect(this.page).toHaveURL(/\/es\/processes/);
  await expect(this.page.getByRole('heading', { name: /Procesos encontrados/i }))
    .toBeVisible({ timeout: 15000 });

  await this.searchInput.click();
  await this.searchInput.fill(name);
  // Si tu búsqueda requiere Enter, deja la línea; si no, elimínala:
  await this.page.keyboard.press('Enter');
  await this.page.waitForLoadState('networkidle');

  await expect(this.rowLinkByName(name)).toBeVisible({ timeout: 15000 });
}


// Abre el popover y devuelve su contenedor real
private async getSkillsPopover() {
  await this.skillsTrigger.waitFor({ state: "visible" });
  await this.skillsTrigger.click();

  // Contenedores típicos en libs de popover/autocomplete:
  const popover = this.page
    .locator(
      [
        '[data-slot="popover-content"]', // shadcn/Radix style
        '[role="dialog"]',               // fallback frecuente
        '[role="menu"]',                 // algunas libs usan "menu"
        '[role="listbox"]'               // si sí existe, mejor
      ].join(', ')
    )
    // Nos aseguramos que sea el popover de skills: que contenga el input “skill”
    .filter({ has: this.page.locator('input[placeholder*="skill" i], [placeholder*="skill" i]') })
    .first();

  await popover.waitFor({ state: "visible", timeout: 15000 });
  return popover;
}

private async selectSkill(skill: string) {
  const exact = new RegExp(`^${this.escapeRegex(skill.trim())}$`, "i");
  const popover = await this.getSkillsPopover();

  // Buscar el input DENTRO del popover y escribir
  const searchInput = popover.locator('input[placeholder*="skill" i], [placeholder*="skill" i]').first();
  if (await searchInput.count()) {
    await searchInput.fill(skill.trim());
  }

  // Localizar la opción dentro del popover (no en toda la página)
  let option = popover.getByRole("option", { name: exact }).first();
  if (!(await option.count())) {
    option = popover.getByRole("menuitem", { name: exact }).first(); // fallback
  }
  if (!(await option.count())) {
    option = popover.getByText(exact).first(); // último fallback por texto
  }

  await option.scrollIntoViewIfNeeded();
  await expect(option).toBeVisible();
  await option.click();

  // Validar que quedó como chip/píldora seleccionada (no volver a hacer click)
  await this.page.getByRole("button", { name: exact }).waitFor({ state: "visible" });
}

// Llama esto desde createProcessUI
private async selectSkills(skills: string[]) {
  for (const s of skills) {
    await this.selectSkill(s);
    // Si el popover NO se cierra tras seleccionar (multi-select),
    // puedes cerrarlo para evitar superposiciones:
    // await this.page.keyboard.press('Escape');
  }
}


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

if (data.skills?.length) {
  await this.selectSkills(data.skills);
}
// --- al final de createProcessUI ---
await this.saveBtn.click();
await this.verifyProcessInList(data.name);  // evidencia persistente (tabla)
await this.assertToastSoft(data.name);      // toast opcional (no rompe test)

  }
}

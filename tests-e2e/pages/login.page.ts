import { Page, expect, test } from "@playwright/test";

/**
 * Página de Login
 * 
 * @author Nicolás Luna Romero
 */

export class LoginPage {
  constructor(private page: Page) {}
  // Locators que funcionan en múltiples idiomas
  email = this.page.getByRole("textbox", {
    name: /correo electrónico|email|e-mail/i,
  });
  pass = this.page.getByRole("textbox", { name: /contraseña|password/i });
  submit = this.page.getByRole("button", { name: /^(continuar|continue)$/i });

  // Locators para el cambio de idioma
  languageCombobox = this.page.getByRole("combobox");
  spanishFlag = this.page.getByRole("img", { name: "es" });
  spanishOption = this.page
    .locator("div")
    .filter({ hasText: /^(Spanish|Español)$/ });
  englishOption = this.page
    .locator("div")
    .filter({ hasText: /^(English|Inglés)$/ });

  async goto() {
    await test.step("Navegar a la página de login", async () => {
      await this.page.goto("/es/login");
      await expect(this.email).toBeVisible();
    });
  }

  async changeLanguageToEnglish() {
    await test.step("Cambiar idioma de español a inglés", async () => {
      await test.step("Hacer clic en el selector de idioma", async () => {
        await this.languageCombobox.click();
      });

      await test.step("Seleccionar inglés", async () => {
        await this.englishOption.click();
      });

      await test.step("Esperar a que la página se recargue en inglés", async () => {
        await this.page.waitForURL("**/en/login");
        // Esperar a que los elementos se recarguen con el nuevo idioma
        await this.page.waitForTimeout(1000);
      });
    });
  }

  // Método para obtener locators dinámicos según el idioma detectado
  private async getEmailField() {
    // Intentar encontrar el campo por diferentes nombres
    const possibleSelectors = [
      this.page.getByRole("textbox", { name: /correo electrónico/i }),
      this.page.getByRole("textbox", { name: /email/i }),
      this.page.getByRole("textbox", { name: /e-mail/i }),
      this.page.getByPlaceholder(/correo|email/i),
      this.page.locator('input[type="email"]').first(),
    ];

    for (const selector of possibleSelectors) {
      if (await selector.isVisible()) {
        return selector;
      }
    }
    return this.email; // fallback
  }

  private async getPasswordField() {
    const possibleSelectors = [
      this.page.getByRole("textbox", { name: /contraseña/i }),
      this.page.getByRole("textbox", { name: /password/i }),
      this.page.getByPlaceholder(/contraseña|password/i),
      this.page.locator('input[type="password"]').first(),
    ];

    for (const selector of possibleSelectors) {
      if (await selector.isVisible()) {
        return selector;
      }
    }
    return this.pass; // fallback
  }

  private async getSubmitButton() {
    // Intentar encontrar el botón principal de submit, excluyendo botones de SSO
    const possibleSelectors = [
      this.page.getByRole("button", { name: /^continuar$/i }),
      this.page.getByRole("button", { name: /^continue$/i }),
      this.page
        .locator('button[type="submit"]')
        .filter({ hasNotText: /microsoft|google|facebook|sso/i })
        .first(),
      this.page.locator('form button[type="submit"]').first(),
    ];

    for (const selector of possibleSelectors) {
      if (await selector.isVisible()) {
        return selector;
      }
    }
    return this.submit; // fallback
  }

  async login(e: string, p: string) {
    await test.step(`Iniciar sesión con usuario: ${e}`, async () => {
      await test.step("Ingresar correo electrónico", async () => {
        const emailField = await this.getEmailField();
        await emailField.fill(e);
      });

      await test.step("Ingresar contraseña", async () => {
        const passwordField = await this.getPasswordField();
        await passwordField.fill(p);
      });

      await test.step("Hacer clic en el botón Continuar", async () => {
        const submitButton = await this.getSubmitButton();
        await submitButton.click();
      });
    });
  }
}

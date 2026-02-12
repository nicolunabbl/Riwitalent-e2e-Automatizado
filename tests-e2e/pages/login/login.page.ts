/**
 * Página de Login
 *
 * @author Nicolás Luna Romero
 */

import { Page, expect, test } from "@playwright/test";
export class LoginPage {
  constructor(private page: Page) {}

  // Contenedores principales
  card = this.page.getByTestId("login-card-container");
  form = this.page.getByTestId("login-form");

  // Campos del formulario
  email = this.page.getByTestId("login-input-email");
  password = this.page.getByTestId("login-input-password");
  submit = this.page.getByTestId("login-button-submit");
  passwordToggle = this.page.getByTestId("login-button-toggle-password-visibility");

  // Feedback
  errorAlert = this.page.getByTestId("login-alert-error");

  // Selector de idioma
  languageButton = this.page.getByTestId("select-language-button");
  englishOption = this.page.getByTestId("select-language-option-en");

  // Modal de términos
  termsOverlay = this.page.getByTestId("login-modal-terms-overlay");
  termsModal = this.page.getByTestId("login-modal-terms");
  termsCloseButton = this.page.getByTestId("login-button-close-terms-modal");
  termsViewLink = this.page.getByTestId("login-link-view-terms");
  termsCancelButton = this.page.getByTestId("login-button-cancel-terms");
  termsAcceptButton = this.page.getByTestId("login-button-accept-terms");

  async goto() {
    await test.step("Navegar a la página de login", async () => {
      await this.page.goto("/es/login");
      await expect(this.card).toBeVisible();
      await expect(this.form).toBeVisible();
      await expect(this.email).toBeVisible();
    });
  }

  async changeLanguageToEnglish() {
    await test.step("Cambiar idioma de español a inglés", async () => {
      await test.step("Abrir selector de idioma", async () => {
        await this.languageButton.click();
      });

      await test.step("Seleccionar inglés", async () => {
        await this.englishOption.click();
      });

      await test.step("Esperar recarga en inglés", async () => {
        await this.page.waitForURL("**/en/login");
        await expect(this.form).toBeVisible();
      });
    });
  }

  async login(email: string, password: string) {
    await test.step(`Iniciar sesión con usuario: ${email}`, async () => {
      await this.email.fill(email);
      await this.password.fill(password);
      await this.submit.click();
    });
  }

  async togglePasswordVisibility() {
    await test.step("Mostrar/Ocultar contraseña", async () => {
      await this.passwordToggle.click();
    });
  }

  async waitForTermsModal() {
    await test.step("Esperar modal de términos", async () => {
      await expect(this.termsOverlay).toBeVisible();
      await expect(this.termsModal).toBeVisible();
    });
  }

  async acceptTerms() {
    await test.step("Aceptar términos", async () => {
      await this.waitForTermsModal();
      await this.termsAcceptButton.click();
      await expect(this.termsModal).toBeHidden();
    });
  }

  async cancelTermsModal() {
    await test.step("Cancelar modal de términos", async () => {
      await this.waitForTermsModal();
      await this.termsCancelButton.click();
      await expect(this.termsModal).toBeHidden();
    });
  }

  async closeTermsModal() {
    await test.step("Cerrar modal de términos", async () => {
      await this.waitForTermsModal();
      await this.termsCloseButton.click();
      await expect(this.termsModal).toBeHidden();
    });
  }

  async openTermsLink() {
    await test.step("Abrir enlace de términos", async () => {
      await this.waitForTermsModal();
      await this.termsViewLink.click();
    });
  }

  async expectErrorMessage(message: string | RegExp) {
    await test.step("Validar mensaje de error en login", async () => {
      await expect(this.errorAlert).toBeVisible();
      await expect(this.errorAlert).toContainText(message);
    });
  }
}

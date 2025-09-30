import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import users from "../fixtures/users.json" with { type: "json" };
import { resolveCreds } from "../utils/creds";

/**
 * Tests de autenticación y login para diferentes roles de usuario
 * 
 * @author Nicolás Luna Romero
 * @description Pruebas E2E para validar el proceso de login con diferentes usuarios
 * @tags smoke, auth, i18n
 * @since 2025-09-30
 */
test.describe("@smoke @auth", () => {
  for (const raw of users) {
    const u = resolveCreds(raw as any);
    test(`Login ${u.role} muestra Dashboard`, async ({ page }) => {
      const login = new LoginPage(page);

      await test.step("Configuración inicial y navegación", async () => {
        await login.goto();
      });

      await test.step(`Proceso de autenticación para usuario ${u.role}`, async () => {
        await login.login(u.email, u.pass);
      });

      await test.step(`Verificar acceso exitoso al dashboard para rol ${u.role}`, async () => {
        // Esperar a que la navegación se complete según el rol
        if (u.role === "admin") {
          await test.step("Verificar redirección a página de métricas (admin)", async () => {
            await page.waitForURL("**/metrics");
            await expect(
              page.locator('h1, [data-testid*="metrics"], main')
            ).toBeVisible();
          });
        } else if (u.role === "comercial") {
          await test.step("Verificar redirección a página de solicitudes (comercial)", async () => {
            await page.waitForURL("**/requests");
            await expect(
              page.locator('h1, [data-testid*="requests"], main')
            ).toBeVisible();
          });
        }
      });
    });
  }
});

test.describe("@smoke @auth @i18n", () => {
   for (const raw of users) {
    const u = resolveCreds(raw as any);
    test(`Login ${u.role} con cambio de idioma ES->EN muestra Dashboard`, async ({
      page,
    }) => {
      const login = new LoginPage(page);

      await test.step("Configuración inicial y navegación", async () => {
        await login.goto();
      });

      await test.step("Cambiar idioma de español a inglés", async () => {
        await login.changeLanguageToEnglish();
      });

      await test.step(`Proceso de autenticación en inglés para usuario ${u.role}`, async () => {
        await login.login(u.email, u.pass);
      });

      await test.step(`Verificar acceso exitoso al dashboard para rol ${u.role} (en inglés)`, async () => {
        // Esperar a que la navegación se complete según el rol
        if (u.role === "admin") {
          await test.step("Verificar redirección a página de métricas (admin)", async () => {
            await page.waitForURL("**/metrics");
            await expect(
              page.locator('h1, [data-testid*="metrics"], main')
            ).toBeVisible();
          });
        } else if (u.role === "comercial") {
          await test.step("Verificar redirección a página de solicitudes (comercial)", async () => {
            await page.waitForURL("**/requests");
            await expect(
              page.locator('h1, [data-testid*="requests"], main')
            ).toBeVisible();
          });
        }
      });
    });
  }
});

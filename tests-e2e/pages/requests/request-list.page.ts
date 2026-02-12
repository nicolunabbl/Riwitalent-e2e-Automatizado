import { Page, expect } from '@playwright/test';

export class RequestListPage {
    constructor(private page: Page) {}

    newRequestButton = this.page.getByRole('button', { name: "Nueva solicitud" });
    heading = this.page.getByRole('heading', { name: "Solicitudes" });

    async clickNewRequest() {
        await this.newRequestButton.click();
    }
}

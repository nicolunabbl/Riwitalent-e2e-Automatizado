import { Page, expect } from '@playwright/test';

export class CreateRequest {
    constructor(private page: Page) {}

    putTitleofRequest = this.page.getByPlaceholder('Ej: Desarrollador Full Stack Senior');
    heading = this.page.getByRole('heading', { name: "Título del cargo" });
    scanSendRequest = this.page.getByRole('button', { name: 'Enviar Solicitud' });

    async putTitle(title: string) {
        await this.putTitleofRequest.fill(title);
    }

    async sendRequest() {
        await this.scanSendRequest.click();
    }
}
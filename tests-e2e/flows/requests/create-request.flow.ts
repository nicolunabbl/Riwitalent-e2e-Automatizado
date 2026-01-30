import { Page } from '@playwright/test';
import { RequestListPage } from '../../pages/requests/request-list.page';
import { CreateRequest } from '../../pages/requests/request-create-request';

export async function CreateRequestFlow(page: Page, data: { title: string }) {
    const requesList = new RequestListPage(page);
    const requestCreate = new CreateRequest(page);

    await requesList.clickNewRequest();
    await requestCreate.putTitle(data.title);
    await requestCreate.sendRequest();
}

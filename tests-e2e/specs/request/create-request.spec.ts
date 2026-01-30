import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/login.page';
import users from '../../fixtures/users.json' with { type: 'json'};
import { RequestListPage } from '../../pages/requests/request-list.page';
import { CreateRequest } from '../../pages/requests/request-create-request';
import { faker } from '@faker-js/faker'
import { resolveCreds } from '../../utils/creds';
import { Page } from 'playwright';
import { CreateRequestFlow } from '../../flows/requests/create-request.flow';

const Rawcomercial = users.find((u: any) => u.role === "comercial");
if (!Rawcomercial) throw new Error("No se encontró ningun usuario comercial en users.json")
const comercial = resolveCreds(Rawcomercial) 


test('Debe de crear una solicitud con el nombre del cargo aleatorio', async ({ page }) => {
    const dataTest = {
        title: faker.person.jobTitle()
};

    const login = new LoginPage(page);       
    await login.goto();
    await login.login(comercial.email, comercial.pass)

    await CreateRequestFlow(page, {title: dataTest.title})

        console.log(`\n  \n \n \n 🐼 Logeado con rol: ${comercial.role} \n y email: ${comercial.email} \n y el siguiente titulo ingresado: ${dataTest.title}, exitosamente \n \n \n`);

        await page.pause(); 

    }); 






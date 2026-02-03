import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/login.page';
import users from '../../fixtures/users.json' with { type: 'json'};
import { resolveCreds } from '../../utils/creds';
import { CreateRequestFlow, RequestData } from '../../flows/requests/create-request.flow';
import { faker } from '@faker-js/faker';

import { Toast } from '../../pages/components/toast.component';

const Rawcomercial = users.find((u: any) => u.role === "comercial");
if (!Rawcomercial) throw new Error("No se encontró ningun usuario comercial en users.json")
const comercial = resolveCreds(Rawcomercial) 

test('Debe de crear una solicitud con el nombre del cargo aleatorio y campos completos', async ({ page }) => {
    const dataTest: RequestData = {
        title: faker.person.jobTitle(),
        seniority: faker.helpers.arrayElement(['Trainee', 'Junior', 'Junior Advanced', 'Mid', 'Mid Advanced', 'Senior']),
        description: faker.lorem.paragraph(),
        company: faker.helpers.arrayElement(['Riwi S.A.S (software)', 'Amazon (staffing)', 'American Tech Corp (fintech)']),
        contractType: faker.helpers.arrayElement(['Staffing', 'Contratación directa']),
        modality: faker.helpers.arrayElement(['Remoto', 'Híbrido', 'Presencial']),
        englishLevel: faker.helpers.arrayElement(['A1 - Principiante', 'A2 - Básico', 'B1 - Intermedio', 'B2 - Intermedio Alto', 'C1 - Avanzado', 'C2 - Dominio', 'Nativo']),
        salary: faker.number.int({ min: 2000000, max: 20000000 }).toString(),
        vacancies: faker.number.int({ min: 1, max: 10 }).toString(),
        purpose: faker.lorem.sentence(),
        labRelations: faker.lorem.sentence(),
        mainResponsibilities: faker.lorem.paragraphs(2),
        skills: faker.helpers.arrayElements([
            { name: 'React', level: 'Avanzado' },
            { name: 'Node.js', level: 'Intermedio' },
            { name: 'JavaScript', level: 'Avanzado' },
            { name: 'TypeScript', level: 'Avanzado' },
            { name: 'Python', level: 'Básico' },
            { name: 'SQL', level: 'Intermedio' },
            { name: 'Docker', level: 'Avanzado' }
        ], { min: 2, max: 3 })
    };

    const login = new LoginPage(page);       
    await login.goto();
    await login.login(comercial.email, comercial.pass)

    await test.step('Ejecutar flujo de creación de solicitud', async () => {
        await CreateRequestFlow(page, dataTest);
    });

    await test.step('Validar éxito de la creación', async () => {
        const toast = new Toast(page);
        await toast.expectSuccessSoft(dataTest.title);
        
        console.log(`\n  \n \n \n 🐼 Logeado con rol: ${comercial.role} \n y email: ${comercial.email} \n y el siguiente titulo ingresado: ${dataTest.title}, exitosamente \n \n \n`);

        // Tomar captura para evidenciar el éxito
        await page.screenshot({ path: `tests-e2e/reports/screenshots/request_success_${Date.now()}.png` });
    });
});

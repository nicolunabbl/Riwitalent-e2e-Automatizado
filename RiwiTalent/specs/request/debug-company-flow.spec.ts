import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/login.page';
import users from '../../fixtures/users.json' with { type: 'json'};
import { resolveCreds } from '../../utils/creds';
import { CreateRequestWithCompanyFlow, RequestWithCompanyData } from '../../flows/requests/create-request-with-company.flow';
import { faker } from '@faker-js/faker';

const Rawcomercial = users.find((u: any) => u.role === "comercial");
if (!Rawcomercial) throw new Error("No se encontró usuario comercial");
const comercial = resolveCreds(Rawcomercial);

test('Debug: Crear solicitud con empresa nueva', async ({ page }) => {
    test.setTimeout(120000); // Extended timeout for full form
    
    // Generate full random data using Faker
    const dataTest: RequestWithCompanyData = {
        title: faker.person.jobTitle() + ' - ' + faker.string.alphanumeric(4), // Random Job Title
        seniority: 'Mid',
        description: faker.lorem.paragraphs(2), // Random long description
        contractType: 'Staffing',
        modality: 'Remoto',
        englishLevel: 'B2 - Intermedio Alto',
        salary: faker.number.int({ min: 5000000, max: 15000000 }), // Random salary
        vacancies: faker.number.int({ min: 1, max: 10 }), // Random vacancies
        purpose: faker.lorem.sentence(),
        labRelations: faker.lorem.sentence(),
        mainResponsibilities: faker.lorem.sentences(3),
        skills: [
            { name: 'React', level: 'Avanzado' },
            { name: 'Node.js', level: 'Intermedio' }
        ],
        company: {
            name: 'FakerCorp ' + faker.company.name(),
            serviceEmail: faker.internet.email(),
            commercialEmail: faker.internet.email(),
            adminEmail: faker.internet.email(),
            phone: '315' + faker.string.numeric(7),
            nit: faker.string.numeric(10),
            industry: 'Software',
            description: faker.company.catchPhrase() + '. ' + faker.lorem.sentence()
        }
    };

    console.log(`--- Login como Comercial: ${comercial.email} ---`);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(comercial.email, comercial.pass);

    console.log('--- Iniciando Flujo de Creación ---');
    await CreateRequestWithCompanyFlow(page, dataTest);
    
    // Verificación final
    const successToast = page.getByText(/Solicitud creada exitosamente/i);
    await expect(successToast).toBeVisible({ timeout: 15000 });
});

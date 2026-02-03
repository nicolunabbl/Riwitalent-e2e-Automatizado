import { Page } from '@playwright/test';
import { RequestListPage } from '../../pages/requests/request-list.page';
import { CreateRequest } from '../../pages/requests/request-create-request';

export interface RequestData {
    title: string;
    seniority: string;
    description: string;
    company: string;
    contractType?: string;
    modality?: string;
    englishLevel?: string;
    salary?: string | number;
    vacancies?: string | number;
    purpose?: string;
    labRelations?: string;
    mainResponsibilities?: string;
    skills?: { name: string, level?: string }[];
}

export async function CreateRequestFlow(page: Page, data: RequestData) {
    const requestList = new RequestListPage(page);
    const createRequest = new CreateRequest(page);

    await requestList.clickNewRequest();

    // Basic Info
    await createRequest.fillTitle(data.title);
    await createRequest.selectSeniority(data.seniority);
    await createRequest.fillDescription(data.description);

    // Company Info
    await createRequest.selectCompany(data.company);

    // Process Details
    if (data.contractType) await createRequest.selectContractType(data.contractType);
    if (data.modality) await createRequest.selectWorkModality(data.modality);
    if (data.englishLevel) await createRequest.selectEnglishLevel(data.englishLevel);
    
    // Skills
    if (data.skills && data.skills.length > 0) {
        // Seleccionamos el nivel una sola vez (del primer skill o por defecto)
        const commonLevel = data.skills[0].level || 'Avanzado';
        await createRequest.selectSkillLevel(commonLevel);
        
        for (const skill of data.skills) {
            await createRequest.addSkillName(skill.name);
        }
    }

    // Numbers
    if (data.salary) await createRequest.fillSalary(data.salary);
    if (data.vacancies) await createRequest.fillVacancies(data.vacancies);

    // Optional Additional Info
    if (data.purpose) await createRequest.fillPurpose(data.purpose);
    if (data.labRelations) await createRequest.fillLabRelational(data.labRelations);
    if (data.mainResponsibilities) await createRequest.fillMainResponsibilities(data.mainResponsibilities);

    await createRequest.send();
}

import { Page } from '@playwright/test';
import { RequestListPage } from '../../pages/requests/request-list.page';
import { CreateRequest } from '../../pages/requests/request-create-request';
import { CreateCompany, CompanyData } from '../../pages/requests/request-create-company';
import { RequestData } from './create-request.flow';

export interface RequestWithCompanyData extends Omit<RequestData, 'company'> {
    company: CompanyData;
}

export async function CreateRequestWithCompanyFlow(page: Page, data: RequestWithCompanyData) {
    const requestList = new RequestListPage(page);
    const createRequest = new CreateRequest(page);
    const createCompany = new CreateCompany(page);

    await requestList.clickNewRequest();

    // 1. Basic Info
    await createRequest.fillTitle(data.title);
    await createRequest.selectSeniority(data.seniority);
    await createRequest.fillDescription(data.description);

    // 2. Process Details (Moved here to avoid modal interference later)
    if (data.contractType) await createRequest.selectContractType(data.contractType);
    if (data.modality) await createRequest.selectWorkModality(data.modality);
    if (data.englishLevel) await createRequest.selectEnglishLevel(data.englishLevel);

    // 3. Integration: Create New Company from Request Page
    await createRequest.createNewCompanyButton.click();
    await createCompany.fillForm(data.company);
    
    // 4. Skills
    if (data.skills && data.skills.length > 0) {
        const commonLevel = data.skills[0].level || 'Avanzado';
        await createRequest.selectSkillLevel(commonLevel);
        
        for (const skill of data.skills) {
            await createRequest.addSkillName(skill.name);
        }
    }

    // 5. Numbers
    if (data.salary) await createRequest.fillSalary(data.salary);
    if (data.vacancies) await createRequest.fillVacancies(data.vacancies);

    // 6. Optional Additional Info
    if (data.purpose) await createRequest.fillPurpose(data.purpose);
    if (data.labRelations) await createRequest.fillLabRelational(data.labRelations);
    if (data.mainResponsibilities) await createRequest.fillMainResponsibilities(data.mainResponsibilities);

    await createRequest.send();
}

import { Page } from '@playwright/test';
import { ProcesosListPage } from '../../pages/processes/processes-list.page';
import { ProcesoCreateModal } from '../../pages/processes/process-create.modal';

export async function createProcessFlow(page: Page, data: {
  companyName: string; 
  name: string; 
  description: string;
  workMode: string; 
  businessLine: string; 
  vacancies: number; 
  englishLevel?: string; 
  skills?: string[];
}) {
  const list = new ProcesosListPage(page);
  const modal = new ProcesoCreateModal(page);

  await list.goto();
  await list.openCreateModal();
  await modal.fillGeneral(data);
  if (data.skills?.length) await modal.addSkills(data.skills);
  await modal.submitWithToastSoft(data.name);  

  await list.search(data.name);
  await list.expectRowVisible(data.name);      
}

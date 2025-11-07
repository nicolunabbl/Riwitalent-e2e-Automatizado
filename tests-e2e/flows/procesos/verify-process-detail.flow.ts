import { Page } from '@playwright/test';
import { ProcesosListPage } from '../../pages/processes/processes-list.page';
import { ProcesoDetallePage } from '../../pages/processes/process-detail.page';

export async function verifyProcessDetailFlow(page: Page, data: {
  name: string;
  description: string;
  workMode: string;
  businessLine: string;
  vacancies: number;
  englishLevel?: string;
  skills?: string[];
}) {
  const list = new ProcesosListPage(page);
  const detail = new ProcesoDetallePage(page);

  // Si no estás ya en la lista, podrías forzar:
  // await list.goto();

  await list.search(data.name);
  await list.expectRowVisible(data.name);
  await list.openDetailByEye(data.name);  // ← abrir con el “ojo”
  await detail.expectDetailsMatch(data);
}

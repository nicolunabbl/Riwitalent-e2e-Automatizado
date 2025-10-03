import { request, APIRequestContext, expect } from '@playwright/test';


type Ctx = { baseURL: string; token?: string };


export async function apiContext(ctx: Ctx): Promise<APIRequestContext> {
return await request.newContext({
baseURL: ctx.baseURL,
extraHTTPHeaders: ctx.token ? { Authorization: `Bearer ${ctx.token}` } : {}
});
}


export async function createEmpresa(api: APIRequestContext, payload: any) {
const res = await api.post('/api/v1/companies', { data: payload });
expect(res.ok()).toBeTruthy();
return await res.json();
}
export async function deleteEmpresa(api: APIRequestContext, id: number) {
const res = await api.delete(`/api/v1/companies/${id}`);
expect(res.ok()).toBeTruthy();
}


export async function createTalento(api: APIRequestContext, payload: any) {
const res = await api.post('/api/v1/students', { data: payload });
expect(res.ok()).toBeTruthy();
return await res.json();
}
export async function deleteTalento(api: APIRequestContext, id: number) {
const res = await api.delete(`/api/v1/students/${id}`);
expect(res.ok()).toBeTruthy();
}


export async function createProceso(api: APIRequestContext, payload: any) {
const res = await api.post('/api/v1/processes', { data: payload });
expect(res.ok()).toBeTruthy();
return await res.json();
}
export async function deleteProceso(api: APIRequestContext, id: number) {
const res = await api.delete(`/api/v1/processes/${id}`);
expect(res.ok()).toBeTruthy();
}


export async function addTalentoToProceso(api: APIRequestContext, body: { processId: number; studentId: number }) {
const res = await api.post('/api/v1/processes/students', { data: body });
expect(res.ok()).toBeTruthy();
}
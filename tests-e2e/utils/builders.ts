export const unique = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random()*1000)}`;


export const buildEmpresa = () => ({
name: unique('Empresa'),
email: `${unique('empresa')}@example.com`,
phone: `3${Math.floor(100000000 + Math.random()*899999999)}`,
nit: `${Math.floor(10_000_000 + Math.random()*89_999_999)}`,
industry: 'Tecnologia'
});


export const buildTalento = () => ({
firstName: 'Auto',
firstLastName: 'Test',
profile: 'Frontend',
email: `${unique('talento')}@example.com`,
phone: `3${Math.floor(100000000 + Math.random()*899999999)}`,
gender: 'OTRO',
identityDocument: `${Math.floor(1_000_000 + Math.random()*9_000_000)}`,
clanId: 1,
skills: ['JavaScript'],
languages: ['ES'],
links: ['https://example.com'],
media: ['https://example.com/cv.pdf']
});


export const buildProceso = (companyId: number) => ({
companyId,
name: unique('Proceso'),
description: 'Proceso auto e2e',
vacancies: 1,
typeContract: 'FULL_TIME',
workMode: 'REMOTE'
});
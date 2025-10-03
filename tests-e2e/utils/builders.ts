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

export const buildProcesoUI = () => {
  const workModes     = ['Remoto', 'Hibrido', 'Presencial'];
  const businessLines = ['Staffing', 'Contratacion Directa'];
  const englishLevels = [
    'A1 - Principiante',
    'A2 - Elemental',
    'B1 - Intermedio',
    'B2 - Intermedio Alto',
    'C1 - Avanzado',
    'C2 - Competencia',
    'Nativo - Hablante Nativo'
  ];
  const skillsPool = ['Playwright', 'REST', 'DotNet Core', 'PostgreSQL', 'RSpec', 'Delphi', 'Appium'];

  return {
    name: unique('Proceso'),
    description: `Proceso auto e2e ${Date.now()}`,
    workMode: workModes[Math.floor(Math.random() * workModes.length)],
    businessLine: businessLines[Math.floor(Math.random() * businessLines.length)],
    vacancies: 1,
    englishLevel: englishLevels[Math.floor(Math.random() * englishLevels.length)],
    skills: [skillsPool[Math.floor(Math.random() * skillsPool.length)]]
  };
};
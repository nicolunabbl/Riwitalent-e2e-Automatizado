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
  const workModes = [
    { label: 'Remoto', id: '1' },
    { label: 'Hibrido', id: '2' },
    { label: 'Presencial', id: '3' },
  ];
  const businessLines = [
    { label: 'Staffing', id: 'Staff' },
    { label: 'Contratacion Directa', id: 'Direct hiring' },
  ];
  const englishLevels = [
    { label: 'A1 - Principiante', code: 'A1' },
    { label: 'A2 - Elemental', code: 'A2' },
    { label: 'B1 - Intermedio', code: 'B1' },
    { label: 'B2 - Intermedio Alto', code: 'B2' },
    { label: 'C1 - Avanzado', code: 'C1' },
    { label: 'C2 - Maestría', code: 'C2' },
    { label: 'Nativo', code: 'Native' },
  ];
  const skillsPool = ['Playwright', 'REST', 'DotNet Core', 'PostgreSQL', 'RSpec', 'Delphi', 'Appium'];

  const workMode = workModes[Math.floor(Math.random() * workModes.length)];
  const businessLine = businessLines[Math.floor(Math.random() * businessLines.length)];
  const englishLevel = englishLevels[Math.floor(Math.random() * englishLevels.length)];

  return {
    name: unique('Proceso'),
    description: `Proceso auto e2e ${Date.now()}`,
    workMode: workMode.label,
    workModeId: workMode.id,
    businessLine: businessLine.label,
    businessLineId: businessLine.id,
    vacancies: Math.floor(Math.random() * 30) + 1,
    englishLevel: englishLevel.label,
    englishCode: englishLevel.code,
    skills: [skillsPool[Math.floor(Math.random() * skillsPool.length)]]
  };
};

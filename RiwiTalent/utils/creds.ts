import 'dotenv/config';

type RoleEntry = { role: string; envEmail: string; envPass: string };

export function resolveCreds(u: RoleEntry) {
  const email = process.env[u.envEmail];
  const pass  = process.env[u.envPass];
  if (!email || !pass) {
    throw new Error(`Faltan variables de entorno: ${u.envEmail} / ${u.envPass}`);
  }
  return { ...u, email, pass };
}

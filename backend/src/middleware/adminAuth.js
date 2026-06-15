// Middleware de autenticación simple para el admin
// Espera el header: Authorization: Bearer <password>
export function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ ok: false, message: 'No autorizado' });
  }
  next();
}

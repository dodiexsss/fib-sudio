import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB, disconnectDB } from './db.js';

const port = Number(process.env.PORT) || 3000;

try {
  await connectDB();

  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`[web] FibStudio en http://localhost:${port}`);
    console.log(`[web] Panel privado en http://localhost:${port}/admin`);
  });

  const cerrar = async (senal) => {
    console.log(`\n[web] ${senal} recibido, cerrando…`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => cerrar('SIGINT'));
  process.on('SIGTERM', () => cerrar('SIGTERM'));
} catch (error) {
  console.error('[startup] No se pudo iniciar el servidor:', error.message);
  process.exit(1);
}

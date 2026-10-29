import 'dotenv/config';
import { connectDB, disconnectDB } from './db.js';
import { Proyecto } from './models/Proyecto.js';
import { proyectosIniciales } from './data/proyectos.js';

/**
 * Carga (o actualiza) el portafolio inicial. Es idempotente: puedes correrlo
 * varias veces sin duplicar documentos porque hace upsert por título.
 */
try {
  await connectDB();

  for (const proyecto of proyectosIniciales) {
    await Proyecto.updateOne(
      { titulo: proyecto.titulo },
      { $set: proyecto },
      { upsert: true, runValidators: true }
    );
    console.log(`[seed] ${proyecto.titulo}`);
  }

  const total = await Proyecto.countDocuments();
  console.log(`[seed] Listo. Proyectos en la base: ${total}`);
} catch (error) {
  console.error('[seed] Error:', error.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}

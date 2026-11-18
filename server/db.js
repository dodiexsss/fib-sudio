import mongoose from 'mongoose';

/**
 * Conecta a MongoDB usando MONGODB_URI.
 * Mongoose mantiene un pool de conexiones reutilizable; se llama una sola vez al arrancar.
 */
export async function connectDB(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error(
      'Falta la variable MONGODB_URI. Copia .env.example a .env y completa la cadena de conexión.'
    );
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  const { host, name } = mongoose.connection;
  console.log(`[db] MongoDB conectado a ${host}/${name}`);

  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.connection.close();
}

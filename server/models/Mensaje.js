import mongoose from 'mongoose';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const mensajeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [120, 'El nombre es demasiado largo'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      maxlength: [200, 'El correo es demasiado largo'],
      match: [emailRegex, 'El correo no tiene un formato válido'],
    },
    servicio: {
      type: String,
      required: [true, 'El tipo de servicio es obligatorio'],
      enum: {
        values: ['evento', 'sesion', 'otro'],
        message: 'El servicio debe ser evento, sesion u otro',
      },
    },
    mensaje: {
      type: String,
      required: [true, 'El mensaje es obligatorio'],
      trim: true,
      minlength: [10, 'Cuéntanos un poco más (mínimo 10 caracteres)'],
      maxlength: [4000, 'El mensaje es demasiado largo'],
    },
    estado: {
      type: String,
      enum: ['nuevo', 'leido', 'respondido'],
      default: 'nuevo',
      index: true,
    },
    origen: {
      type: String,
      default: 'web',
      enum: ['web', 'manual', 'importado'],
    },
    ip: { type: String, select: false },
    userAgent: { type: String, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

mensajeSchema.index({ createdAt: -1 });

export const Mensaje = mongoose.model('Mensaje', mensajeSchema);

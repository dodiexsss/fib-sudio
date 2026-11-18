import mongoose from 'mongoose';

const proyectoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: 120,
    },
    categoria: {
      type: String,
      required: true,
      enum: ['eventos', 'sesiones'],
      index: true,
    },
    imagen: {
      type: String,
      required: [true, 'La imagen es obligatoria'],
      trim: true,
    },
    alt: {
      type: String,
      required: [true, 'El texto alternativo es obligatorio'],
      trim: true,
      maxlength: 200,
    },
    historia: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1200,
    },
    span2: {
      type: Boolean,
      default: false,
    },
    orden: {
      type: Number,
      default: 0,
    },
    activo: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

proyectoSchema.index({ activo: 1, orden: 1 });

export const Proyecto = mongoose.model('Proyecto', proyectoSchema);

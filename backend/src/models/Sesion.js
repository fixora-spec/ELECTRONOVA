import { Schema, model } from "mongoose";

// Esquema de Sesión para control de Refresh Tokens
const SesionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    refreshToken: { type: String, required: true, index: true },
    browser: { type: String, default: "" },
    ip: { type: String, default: "" },
    isRevoked: { type: Boolean, default: false },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

SesionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Sesion = model("Sesion", SesionSchema);

export { Sesion };

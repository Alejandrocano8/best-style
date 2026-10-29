import type { PrototypeData } from "@/domain/entities/prototype-data";

export interface PrototypeRepository {
  getData(): Promise<PrototypeData>;
}

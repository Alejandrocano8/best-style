import type { PrototypeRepository } from "@/domain/repositories/prototype-repository";

export class GetPrototypeData {
  constructor(private readonly repository: PrototypeRepository) {}

  execute() {
    return this.repository.getData();
  }
}

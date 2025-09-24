import { Injectable, NotFoundException } from "@nestjs/common";

import { FirebaseAdminService } from "../../config/firebase.service";
import { FirestoreRepository } from "../../common/repositories/firestore.repository";
import type { Apprenticeship } from "./apprenticeships.types";
import { CreateApprenticeshipDto } from "./dto/create-apprenticeship.dto";
import { UpdateApprenticeshipDto } from "./dto/update-apprenticeship.dto";

@Injectable()
export class ApprenticeshipsService {
  private readonly repository: FirestoreRepository<Apprenticeship>;

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {
    this.repository = new FirestoreRepository<Apprenticeship>(
      this.firebaseAdmin.firestore,
      "apprenticeships"
    );
  }

  findAll(filters: Partial<Apprenticeship> = {}) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string) {
    const apprenticeship = await this.repository.findById(id);
    if (!apprenticeship) {
      throw new NotFoundException(`Apprenticeship ${id} not found`);
    }
    return apprenticeship;
  }

  async create(dto: CreateApprenticeshipDto) {
    return this.repository.create(dto as Apprenticeship);
  }

  async update(id: string, dto: UpdateApprenticeshipDto) {
    await this.repository.update(id, dto as Partial<Apprenticeship>);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repository.delete(id);
  }
}

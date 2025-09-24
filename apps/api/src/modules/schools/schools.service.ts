import { Injectable, NotFoundException } from "@nestjs/common";

import { FirebaseAdminService } from "../../config/firebase.service";
import { FirestoreRepository } from "../../common/repositories/firestore.repository";
import type { School } from "./schools.types";
import { CreateSchoolDto } from "./dto/create-school.dto";
import { UpdateSchoolDto } from "./dto/update-school.dto";

@Injectable()
export class SchoolsService {
  private readonly repository: FirestoreRepository<School>;

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {
    this.repository = new FirestoreRepository<School>(this.firebaseAdmin.firestore, "schools");
  }

  findAll(filters: Partial<School> = {}) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string) {
    const school = await this.repository.findById(id);
    if (!school) {
      throw new NotFoundException(`School ${id} not found`);
    }
    return school;
  }

  create(dto: CreateSchoolDto) {
    return this.repository.create(dto as School);
  }

  async update(id: string, dto: UpdateSchoolDto) {
    await this.repository.update(id, dto as Partial<School>);
    return this.findOne(id);
  }
}

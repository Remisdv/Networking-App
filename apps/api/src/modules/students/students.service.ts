import { Injectable, NotFoundException } from "@nestjs/common";

import { FirebaseAdminService } from "../../config/firebase.service";
import { FirestoreRepository } from "../../common/repositories/firestore.repository";
import type { IDataStore } from "../../common/interfaces/data-store.interface";
import type { Student } from "./students.types";
import { CreateStudentDto } from "./dto/create-student.dto";
import { UpdateStudentDto } from "./dto/update-student.dto";

@Injectable()
export class StudentsService {
  private readonly repository: IDataStore<Student>;

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {
    this.repository = new FirestoreRepository<Student>(this.firebaseAdmin.firestore, "students");
  }

  async search(filters: Partial<Student>) {
    return this.repository.findAll(filters);
  }

  async findOne(id: string) {
    const student = await this.repository.findById(id);
    if (!student) {
      throw new NotFoundException(`Student ${id} not found`);
    }
    return student;
  }

  async create(dto: CreateStudentDto) {
    return this.repository.create({ ...dto, id: dto.id ?? undefined } as Student);
  }

  async update(id: string, dto: UpdateStudentDto) {
    await this.repository.update(id, dto as Partial<Student>);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.repository.delete(id);
  }
}

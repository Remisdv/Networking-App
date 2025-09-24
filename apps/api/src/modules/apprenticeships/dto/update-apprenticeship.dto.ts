import { PartialType } from "@nestjs/swagger";

import { CreateApprenticeshipDto } from "./create-apprenticeship.dto";

export class UpdateApprenticeshipDto extends PartialType(CreateApprenticeshipDto) {}

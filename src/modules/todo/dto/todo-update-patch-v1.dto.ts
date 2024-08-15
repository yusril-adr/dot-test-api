import { PartialType } from '@nestjs/mapped-types';
import { TodoCreateV1Dto } from './todo-create-v1.dto';

export class TodoUpdatePatchV1Dto extends PartialType(TodoCreateV1Dto) {}

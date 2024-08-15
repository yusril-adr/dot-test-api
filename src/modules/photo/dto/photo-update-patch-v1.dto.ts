import { PartialType } from '@nestjs/mapped-types';
import { PhotoCreateV1Dto } from './photo-create-v1.dto';

export class PhotoUpdatePatchV1Dto extends PartialType(PhotoCreateV1Dto) {}

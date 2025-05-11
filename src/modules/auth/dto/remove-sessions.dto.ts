import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class RemoveSessionsValidator {
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @ArrayNotEmpty()
  ids: string[];
}

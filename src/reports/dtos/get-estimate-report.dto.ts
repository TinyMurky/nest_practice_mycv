import { Transform } from 'class-transformer';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetEstimateReport {
  @IsString()
  make: string; // Which brand of this car was made

  @IsString()
  model: string; //which model of car

  @IsLongitude()
  lng: number; // longitude of car when sell

  @IsLatitude()
  lat: number; // latitude of car when sell

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  @Max(10 ** 8)
  mileage: number; // how many miles has this car been driven

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Max(2050)
  @Min(1930)
  year: number;
}

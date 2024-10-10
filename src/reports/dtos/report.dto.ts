import { Expose, Transform } from 'class-transformer';
// import { User } from '@/users/users.entity';

export class ReportDto {
  @Expose()
  price: number;

  @Expose()
  make: string; // Which brand of this car was made

  @Expose()
  model: string; //which model of car

  @Expose()
  lng: number; // longitude of car when sell

  @Expose()
  lat: number; // latitude of car when sell

  @Expose()
  mileage: number; // how many miles has this car been driven

  @Expose()
  year: number;

  // @Transform(({ value, key, obj, type }) => value)
  // value	-The property value before the transformation.
  // key	-The name of the transformed property.
  // obj	-The transformation source object.
  // type	-The transformation type.
  // options	-The options object passed to the transformation method.
  // change user id to only user
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}

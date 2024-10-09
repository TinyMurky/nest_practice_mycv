import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

import { Report } from '@/reports/reports.entity';

console.log('Report in user Entity:', Report); // print: [class Report]

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude 搭配 controller上面放   @UseInterceptors(ClassSerializerInterceptor)
  // 但是客製化程度不夠，改使用plainToClass 搭配 plainToClass + dto
  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('User has been created, id: ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('User has been updated, id: ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('User has been removed, id: ', this.id);
  }
}

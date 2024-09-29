import { Exclude } from 'class-transformer';
import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Exclude() // Info: (20240928 - Murky) 搭配 controller上面放   @UseInterceptors(ClassSerializerInterceptor)
  @Column()
  password: string;

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

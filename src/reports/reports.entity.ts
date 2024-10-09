import { User } from '@/users/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

// 下面這個會是Undefined, 因為Report會比User更先建立
console.log('User in Report Entity: ', User);

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string; // Which brand of this car was made

  @Column()
  model: string; //which model of car

  @Column()
  lng: number; // longitude of car when sell

  @Column()
  lat: number; // latitude of car when sell

  @Column()
  mileage: number; // how many miles has this car been driven

  @Column()
  year: number;

  // 由於Report和user會循環report，為了解決這個點才使用 () => User
  // 這樣可以確保先load report 和 User 之後，用Function直接回一個User Entity告訴Report 應該要去關聯誰
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}

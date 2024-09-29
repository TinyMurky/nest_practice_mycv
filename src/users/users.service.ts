import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    // Info: (20240928 - Murky) 需要使用Inject Repository 是因為 dependency Injection 不能很好的支援 範行
    @InjectRepository(User) private _repo: Repository<User>,
  ) {}

  public create(email: string, password: string) {
    // Info: (20240928 - Murky) Create 不是指 save 到db而是而是單純create 一個instance, 要save才能存進去
    // 也可以 const user = new User(), user.email = email ...
    const user = this._repo.create({
      email,
      password,
    });

    // Info: (20240928 - Murky) save是insert + update, promise
    // 也可以直接 this._repo.save({email, password}), 但是就不會觸發像是 AfterInsert的hook
    // 用insert(), update(), delete()會有一樣的狀況, instance + save, remove比較好
    return this._repo.save(user);
  }

  public findOneById(id: number) {
    return this._repo.findOneBy({
      id: id,
    });
  }

  public findByEmail(email: string) {
    return this._repo.find({
      where: {
        email: email,
      },
    });
  }

  public async update(id: number, attrs: Partial<User>) {
    // Info: (20240928 - Murky) Partial 可以讓update的時候不用全部的值都需要提供
    // Info: (20240928 - Murky) 也可以直接用update, 舊部需要find了，但是就沒有hook通知
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User is not exist, id: ${id}`);
    }

    // Info: (20240928 - Murky) Object assign 會附蓋掉 attrs裡有的值
    Object.assign(user, attrs);
    return this._repo.save(user);
  }

  public async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User is not exist, id: ${id}`);
    }
    return this._repo.remove(user);
  }
}

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';
@Injectable()
export class AuthService {
  private _hashBufferLength: number = 32;
  private _saltBufferLength: number = 32;

  constructor(private _usersService: UsersService) {}

  private _script = promisify(scrypt);

  private _concatSaltAndHash(hash: string, salt: string) {
    const hashedPassword = hash + '.' + salt;
    return hashedPassword;
  }

  private _getSaltAndHashFromPassword(password: string) {
    const [hash, salt] = password.split('.');
    if (!hash || !salt) {
      throw new InternalServerErrorException('Password has no salt');
    }

    return {
      hash,
      salt,
    };
  }

  public async signUp({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // Info: (20240929 - Murky) Find if email is used
    const [user] = await this._usersService.findByEmail(email);
    if (user) {
      throw new ConflictException(`Email ${email} already Used`);
    }

    // Info: (20240929 - Murky) Generate salt and hash
    const saltBuffer: Buffer = randomBytes(this._saltBufferLength);
    const salt = saltBuffer.toString('hex');
    const hashBuffer = (await this._script(
      password,
      salt,
      this._hashBufferLength,
    )) as Buffer;
    const hash = hashBuffer.toString('hex');

    // Info: (20240929 - Murky) Create user
    const passwordConcat = this._concatSaltAndHash(hash, salt);
    const userCreated = this._usersService.create(email, passwordConcat);

    if (!userCreated) {
      throw new InternalServerErrorException(
        `User Create failed, Email: ${email}`,
      );
    }

    return userCreated;
  }

  public async signIn({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    // Info: (20240929 - Murky) Find user first
    const [user] = await this._usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException(`Email ${email} is not found`);
    }

    // rehash password
    const { hash: storedHash, salt } = this._getSaltAndHashFromPassword(
      user.password,
    );
    const hashBuffer = (await this._script(
      password,
      salt,
      this._hashBufferLength,
    )) as Buffer;
    const hashFromInput = hashBuffer.toString('hex');

    if (storedHash !== hashFromInput) {
      throw new ForbiddenException('Password is not correct!');
    }

    return user;
  }
}

import { Test } from '@nestjs/testing';
import { doesNotMatch } from 'assert';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with salted and hashed password', async () => {
    const user = await service.signup('yusoff@gmail.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('thorws an error if user sign up with email that is in use', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('asdf@gmail.com', 'asdf');
    } catch (err) {
      console.log('here');
      done();
    }
  });

  it('throw an error if signed with email not used', async (done) => {
    try {
      await service.signup('asdf@gmail.com', 'asdf');
    } catch (err) {
      done();
    }
  });

  it('throws if an invalid password is provided', async (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    try {
      await service.signup('asdf@gmail.com', 'asdf');
    } catch (err) {
      done();
    }
  });

  it('return a user if correct password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'a@a.com', password: '12345678' } as User,
      ]);
    const user = await service.sigin('a@a.com', '12345678');
    expect(user).toBeDefined();
  });
});

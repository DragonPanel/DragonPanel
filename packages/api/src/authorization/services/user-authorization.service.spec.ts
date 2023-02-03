import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthorizationService } from './user-authorization.service';

describe('UserAuthorizationService', () => {
  let service: UserAuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAuthorizationService],
    }).compile();

    service = module.get<UserAuthorizationService>(UserAuthorizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

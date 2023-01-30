import { User } from "@prisma/client";
import { Exclude, Expose, plainToInstance } from "class-transformer";

export default class UserDto implements User {
  @Expose({ groups: [ "admin", "toClass" ]})
  id: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Expose({ groups: [ "admin", "toClass" ] })
  superadmin: boolean | null;
  
  @Expose()
  createdAt: Date;

  @Expose({ groups: ["admin", "toClass"] })
  updatedAt: Date;

  public static fromPlain(plain: any) {
    return plainToInstance(UserDto, plain, { groups: ["toClass"], excludeExtraneousValues: true });
  }
}

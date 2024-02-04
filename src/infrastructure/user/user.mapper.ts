import { singleton } from "tsyringe";
import User from "../../domain/user/user";
import UserSchema from "./user.schema";

@singleton()
export default class UserMapper {
  schemaToEntity(user: UserSchema) {
    return new User({ id: user.id, username: user.username, passwordHash: user.password_hash });
  }

  entityToSchema(user: User): UserSchema {
    return {
      id: user.getId(),
      username: user.getUsername(),
      password_hash: user.getPasswordHash()
    };
  }
}

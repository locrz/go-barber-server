import { compare, hash } from "bcryptjs";

import IHashProvider from "../models/IHashProvider";

class BCryptHashProvider implements IHashProvider {
  public async compareHash(payload: string, hashed: string) {
    return compare(payload, hashed);
  }

  public async generateHash(payload: string) {
    return hash(payload, 8);
  }
}

export default BCryptHashProvider;

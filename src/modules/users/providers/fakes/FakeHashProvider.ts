import IHashProvider from "../models/IHashProvider";

class FakeHashProvider implements IHashProvider {
  public async compareHash(payload: string, hashed: string) {
    return payload === hashed;
  }

  public async generateHash(payload: string) {
    return payload;
  }
}

export default FakeHashProvider;

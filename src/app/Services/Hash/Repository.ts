import Hash, { IHash } from './Model';

class HashData {
  protected model = Hash;

  async getHashById(id: string) {
    return this.model.findOne({ _id: id });
  }

  async getHashByHash(hash: string, type: string) {
    return this.model.findOne({
      hash,
      // @ts-ignore
      type,
    });
  }

  async createOne(data: IHash) {
    return this.model.create(data);
  }

  async deleteHashByUserIdAndType(
    user: string,
    type: 'CONFIRM_EMAIL' | 'CHANGE_PASSWORD'
  ) {
    return this.model.findOneAndDelete({ user, type });
  }
}

export default new HashData();

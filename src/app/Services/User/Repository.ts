import User, { IUser } from './Model';

class UserData {
  protected model = User;

  async getUserById(id: string) {
    return this.model.findOne({ _id: id });
  }

  async getUserByUsernameAndKey(username: string, key: string) {
    return this.model.findOne({ username, streamKey: key });
  }

  async getStreamByUsername(username: string) {
    return this.model.findOne({ username });
  }

  async getAllInLive() {
    return this.model.find({ inLive: true });
  }

  async getUserByEmail(email: string) {
    return this.model.findOne({
      email,
    });
  }

  async createOne(data: IUser) {
    return this.model.create(data);
  }

  async updateOne(data: Partial<IUser>, id: string) {
    return this.model.findByIdAndUpdate(id, data);
  }

  async changeLiveStatus(username: string, inLive: boolean) {
    return this.model.findOneAndUpdate({ username }, { inLive });
  }
}

export default new UserData();

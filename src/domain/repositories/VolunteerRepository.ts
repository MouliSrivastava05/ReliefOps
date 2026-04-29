import { VolunteerModel } from "../models/VolunteerModel";

export type VolunteerRecord = {
  _id: { toString(): string };
  userId: string;
  email?: string;
  skills: string[];
  lat: number;
  lng: number;
  available: boolean;
};

export class VolunteerRepository {
  async findAvailable(): Promise<VolunteerRecord[]> {
    const docs = await VolunteerModel.find({ available: true }).lean().exec();
    return docs.map((d: any) => ({
      _id: d._id,
      userId: d.userId,
      skills: d.skills,
      lat: d.lat,
      lng: d.lng,
      available: d.available,
    }));
  }

  async reserveOne(id: string): Promise<boolean> {
    const res = await VolunteerModel.findOneAndUpdate(
      { _id: id, available: true },
      { $set: { available: false } },
      { new: true }
    ).exec();
    return !!res;
  }

  async releaseOne(id: string): Promise<void> {
    await VolunteerModel.updateOne(
      { _id: id },
      { $set: { available: true } }
    ).exec();
  }
}

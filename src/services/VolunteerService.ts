import { UserModel } from "@/domain/models/UserModel";
import { VolunteerModel } from "@/domain/models/VolunteerModel";

export class VolunteerService {
  async listWithUsers() {
    const vols = await VolunteerModel.find().lean().exec();
    const out = [];
    for (const v of vols) {
      const u = await UserModel.findById(v.userId).lean().exec();
      out.push({
        id: (v as { _id: { toString(): string } })._id.toString(),
        userId: String(v.userId),
        email: u ? String((u as { email?: string }).email) : "",
        skills: (v as { skills?: string[] }).skills ?? [],
        lat: Number((v as { lat?: number }).lat ?? 0),
        lng: Number((v as { lng?: number }).lng ?? 0),
        available: Boolean((v as { available?: boolean }).available),
      });
    }
    return out;
  }
}

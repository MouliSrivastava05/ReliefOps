import { User } from "./User";

export class Citizen extends User {
  constructor(id: string, email: string) {
    super(id, email, "citizen");
  }
}

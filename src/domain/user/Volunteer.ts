import { User } from "./User";

export class Volunteer extends User {
  constructor(id: string, email: string) {
    super(id, email, "volunteer");
  }
}

import { User } from "./User";

export class Admin extends User {
  constructor(id: string, email: string) {
    super(id, email, "admin");
  }
}

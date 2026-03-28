export class AuthService {
  async validateSession(_token: string): Promise<boolean> {
    return false;
  }
}

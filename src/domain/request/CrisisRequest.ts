export abstract class CrisisRequest {
  constructor(
    public readonly id: string,
    public readonly citizenId: string,
  ) {}
}

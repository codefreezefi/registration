export class InternalError extends Error {
  constructor() {
    super("Internal Error");
    this.name = "InternalError";
  }
}

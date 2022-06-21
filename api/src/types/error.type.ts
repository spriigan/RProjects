export class GeneralError extends Error {
  protected statusCode = 500;
  constructor(message: string) {
    super(message);
  }

  public get status(): number {
    return this.statusCode;
  }
}
export class NotFound extends GeneralError {
  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}
export class BadRequest extends GeneralError {
  constructor(message: string) {
    super(message);
    this.statusCode = 400;
  }
}

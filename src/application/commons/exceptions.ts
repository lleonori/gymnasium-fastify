export class NotFoundException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

export class ConflictException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}

export class BadRequestException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestException.prototype);
  }
}

export class InternalServerError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

export class TooManyRequestsException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, TooManyRequestsException.prototype);
  }
}

export class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ForbiddenException.prototype);
  }
}

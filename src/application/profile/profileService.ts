import { ManagementApiError, ManagementClient } from "auth0";
import {
  BadRequestException,
  ForbiddenException,
  InternalServerError,
  TooManyRequestsException,
  UnauthorizedException,
} from "../commons/exceptions";
import { Profile } from "./models";

export class ProfileService {
  private managementClient: ManagementClient;

  constructor() {
    this.managementClient = new ManagementClient({
      domain: process.env.DOMAIN_AUTH0,
      clientId: process.env.CLIENT_ID_AUTH0,
      clientSecret: process.env.CLIENT_SECRET_AUTH0,
    });
  }

  async delete(userId: Profile["userId"]): Promise<void> {
    if (!userId) {
      throw new BadRequestException("User ID obbligatorio");
    }

    try {
      await this.managementClient.users.delete({ id: userId });
    } catch (error) {
      if (error instanceof ManagementApiError) {
        this.handleAuthError(error);
      }

      // Log dell'errore non gestito
      console.error(
        "Errore imprevisto durante l'eliminazione dell'utente:",
        error,
      );
      throw new InternalServerError(
        "Si è verificato un errore imprevisto durante l'eliminazione dell'utente",
      );
    }
  }

  private handleAuthError(error: ManagementApiError): never {
    const errorMessages: Record<number, string> = {
      400: "Invalido ID utente o formato della richiesta",
      401: "Autenticazione fallita",
      403: "Permessi insufficienti",
      429: "Limite di richiesta superato",
    };

    const message = errorMessages[error.statusCode] || "Unknown Auth0 error";

    switch (error.statusCode) {
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException(message);
      case 403:
        throw new ForbiddenException(message);
      case 429:
        throw new TooManyRequestsException(message);
      default:
        throw new InternalServerError(message);
    }
  }
}

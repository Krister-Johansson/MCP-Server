import { UserInputError } from '@nestjs/apollo';
import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GqlArgumentsHost, type GqlExceptionFilter } from '@nestjs/graphql';
import { type Request, type Response } from 'express';
import { type GraphQLResolveInfo } from 'graphql';

@Catch()
export class GlobalExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): unknown {
    switch (host.getType() as unknown as string) {
      case 'graphql':
        return this.handleGqlException(exception, host);
      case 'http':
        this.handleHttpException(exception, host);
        break;
      default:
        this.logger.error(exception);
        break;
    }
  }

  handleHttpException(exception: unknown, host: ArgumentsHost): void {
    this.logger.error(exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Thrown by the health check, ignore these.
    if (exception instanceof ServiceUnavailableException) {
      response.status(exception.getStatus()).send(exception.getResponse());
      return;
    }

    if (exception instanceof UserInputError) {
      const error = {
        path: request.url,
        method: request.method,
        message: exception.message,
      };
      response.status(400).send(error);
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error = {
      path: request.url,
      method: request.method,
      exception,
    };

    response.status(status).send(error);
  }

  handleGqlException(exception: unknown, host: ArgumentsHost): unknown {
    const gqlHost = GqlArgumentsHost.create(host);
    const info = gqlHost.getInfo<GraphQLResolveInfo>();

    const gqlPath = info
      ? `${info.parentType.toString()} ${info.fieldName}`
      : 'unknown path';

    const message =
      exception instanceof Error
        ? `${exception.message} [${gqlPath}]`
        : gqlPath;

    this.logger.error(exception, message);

    return exception;
  }
}

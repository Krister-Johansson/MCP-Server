import { Catch, HttpException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch(HttpException)
export class GraphQLExceptionFilter implements GqlExceptionFilter {
  catch(exception: HttpException) {
    const response = exception.getResponse();
    const status = exception.getStatus();

    if (typeof response === 'string') {
      return {
        message: response,
        statusCode: status,
      };
    }

    return {
      ...response,
      statusCode: status,
    };
  }
}

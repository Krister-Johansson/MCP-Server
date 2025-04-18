import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  private readonly logger = new Logger(PrismaExceptionFilter.name);
  catch(exception: Prisma.PrismaClientKnownRequestError) {
    this.logger.error(exception.message);
    switch (exception.code) {
      case 'P2000':
      case 'P2005':
      case 'P2006':
      case 'P2007':
      case 'P2008':
      case 'P2011':
      case 'P2012':
      case 'P2013':
      case 'P2014':
      case 'P2016':
        throw new BadRequestException(exception.message);

      case 'P2001':
      case 'P2015':
      case 'P2025':
        throw new NotFoundException(exception.message);

      case 'P2002':
        throw new ConflictException('Duplicate entry');

      case 'P2003':
        throw new BadRequestException('Invalid relation or foreign key');

      case 'P2004':
        throw new BadRequestException('Constraint failed on the database');

      case 'P2010':
        throw new InternalServerErrorException('Raw query failed');

      default:
        throw new InternalServerErrorException(exception.message);
    }
  }
}

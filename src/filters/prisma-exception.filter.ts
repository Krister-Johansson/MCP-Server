import {
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError) {
    switch (exception.code) {
      case 'P2002':
        this.logger.error(exception.meta?.cause);
        throw new ConflictException(exception.meta?.cause as string);
      case 'P2025':
        this.logger.error(exception.meta?.cause);
        throw new NotFoundException(exception.meta?.cause as string);
      case 'P2003':
        this.logger.error(exception.meta?.cause);
        throw new BadRequestException(exception.meta?.cause as string);
      case 'P2004':
        this.logger.error(exception.meta?.cause);
        throw new BadRequestException(exception.meta?.cause as string);
      default:
        this.logger.error(exception.meta?.cause);
        throw new InternalServerErrorException(exception.meta?.cause as string);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DatabaseRepository } from 'src/repository/database.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuctionRepository extends DatabaseRepository {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager);
  }
}

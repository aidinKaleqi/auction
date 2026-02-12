import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindOneOptions,
  ObjectLiteral,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CustomError } from '../filter/custom.error';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class DatabaseRepository {
  constructor(
    @InjectEntityManager()
    readonly entityManager: EntityManager,
  ) {}

  async insert<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<{
    body: T;
    exists: boolean;
  }> {
    try {
      const result = await this.entityManager.insert(entityObject, data);
      return {
        exists: true,
        body: result.raw[0],
      };
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async findOne<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    options: FindOneOptions<T>,
  ): Promise<{
    body: T | null;
    exists: boolean;
  }> {
    try {
      const result = await this.entityManager.findOne(entityObject, options);
      return {
        exists: !!result,
        body: result,
      };
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async findAll<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    options?: FindManyOptions<T>,
  ): Promise<{
    body: T[];
    exists: boolean;
  }> {
    try {
      const result = await this.entityManager.find(entityObject, options);
      return {
        exists: result.length > 0,
        body: result,
      };
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async update<T extends ObjectLiteral>(
    entity: EntityTarget<T>,
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<{
    updated: boolean;
    affected: number;
  }> {
    try {
      const result = await this.entityManager.update(entity, where, data);
      return {
        updated: result.affected !== undefined && result.affected > 0,
        affected: result.affected ?? 0,
      };
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async remove<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    where: FindOptionsWhere<T>,
  ): Promise<{
    deleted: boolean;
  }> {
    try {
      const result = await this.entityManager.delete(entityObject, where);
      return {
        deleted: result.affected !== undefined && result.affected > 0,
      };
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async save<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    data: T,
  ): Promise<T> {
    try {
      return await this.entityManager.save(entityObject, data);
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }

  async exists<T extends ObjectLiteral>(
    entityObject: EntityTarget<T>,
    options: FindManyOptions,
  ): Promise<boolean> {
    try {
      const result = await this.entityManager.exists(entityObject, options);
      return !!result;
    } catch (error) {
      throw new CustomError('databaseError', 500, error);
    }
  }
}

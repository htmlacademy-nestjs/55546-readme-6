import { Entity, EntityFactory, StorableEntity } from "@project/shared/core";
import { Repository } from "./repository.interface";
import { randomUUID } from "crypto";
import { NotFoundException } from "@nestjs/common";

const NOT_FOUND_MESSAGE = 'Entity not found';

export abstract class BaseMemoryRepository<T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>> implements Repository<T> {
  protected entities: Map<T['id'], ReturnType<T['toPOJO']>> = new Map();

  constructor(protected entityFactory: EntityFactory<T>) { }

  public async findById(id: T['id']): Promise<T> {
    const foundEntity = this.entities.get(id) || null;
    if (!foundEntity) {
      return null;
    }

    return this.entityFactory.create(foundEntity);
  }

  public async save(entity: T): Promise<void> {
    if (!entity.id) {
      entity.id = randomUUID();
    }

    this.entities.set(entity.id, entity.toPOJO());
  }

  public async update(entity: T): Promise<void> {
    if (!this.entities.has(entity.id)) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }

    this.entities.set(entity.id, entity.toPOJO());
  }

  public async deleteById(id: T["id"]): Promise<void> {
    if (!this.entities.has(id)) {
      throw new NotFoundException(NOT_FOUND_MESSAGE);
    }

    this.entities.delete(id);
  }
}

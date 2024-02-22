import { v4 as uuid } from 'uuid'
type SetEntityIdOptions = { overwrite?: boolean }

/**
 * Set entity id if it doesn't exist
 * @param entity    
 * @param options 
 * @returns T - entity with id
 */
export function setEntityId<T extends { id: string }>(entity: T, options?: SetEntityIdOptions): T {
    const id = uuid()
    if (options?.overwrite) {
        entity.id = id
    }

    if (entity && !entity.id) entity.id = id;
    return entity
}
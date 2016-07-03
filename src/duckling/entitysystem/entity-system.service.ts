import {Injectable, EventEmitter} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {StoreService, clearUndoHistoryAction} from '../state';
import {EntitySystem, Entity, EntityKey, createEntitySystem} from './entity';
import {updateEntityAction, replaceSystemAction, deleteEntityAction} from './entity-system.reducer';

/**
 * The EntitySystemService is used to provide convinient access to the EntitySystem.
 */
@Injectable()
export class EntitySystemService {
    private _nextKey = 0;
    entitySystem : BehaviorSubject<EntitySystem>;

    constructor(private _storeService : StoreService) {
        this.entitySystem = new BehaviorSubject(this._system);
        this._storeService.state.subscribe((state) => {
            this.entitySystem.next(state.entitySystem);
        });
    }

    /**
     * Retrieve a single entity.
     * @param  key Key of the entitity to retrieve.
     * @return The entity.
     */
    getEntity(key : EntityKey) : Entity {
        return this._system.get(key);
    }

    /**
     * Update the entity. Can be used to create new entities.
     * @param  key    Key of the entity to update.
     * @param  entity Entity that will be stored with the key.
     * @param  mergeKey Used to merge updates.
     */
    updateEntity(key : EntityKey, entity : Entity, mergeKey? : any) {
        this._storeService.dispatch(updateEntityAction(entity, key), mergeKey);
    }

    /**
     * Add a new entity to the entity system.
     * @param  entity The entity that is being added to the system.
     * @param  mergeKey Used to merge updates.
     * @return The key of the newly created entity.
     */
    addNewEntity(entity : Entity, mergeKey? : any) : EntityKey {
        var key = this.nextKey();
        this.updateEntity(key, entity, mergeKey);
        return key;
    }

    /**
     * Delete the entity.
     * @param  entityKey Key of the entity to delete.
     * @param  mergeKey  Used to merge updates.
     */
    deleteEntity(entityKey : EntityKey, mergeKey? : any) {
        this._storeService.dispatch(deleteEntityAction(entityKey), mergeKey);
    }

    /**
     * Load the system stored in the file.
     * @param  path The path the system is stored in.
     */
    replaceSystem(entitySystem : EntitySystem) {
        this._storeService.dispatch(replaceSystemAction(entitySystem));
    }

    private get _system() : EntitySystem {
        var state = this._storeService.getState();
        if (state && state.entitySystem) {
            return state.entitySystem;
        } else {
            return createEntitySystem();
        }
    }

    private nextKey() : string {
        var next = this._nextKey++;
        while (this._system.get(String(next), null)) {
            next = this._nextKey++;
        }
        return String(next);
    }

    private fromJson(object : any) : EntitySystem {
        return createEntitySystem().withMutations(system => {
            for (var key in object) {
                system.set(key,object[key]);
            }
        });
    }
};

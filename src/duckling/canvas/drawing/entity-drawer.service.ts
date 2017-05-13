import {Component, Injectable} from '@angular/core';
import {Container, DisplayObject} from 'pixi.js';

import {BaseAttributeService} from '../../entitysystem/base-attribute.service';
import {AssetService} from '../../project';
import {Entity, EntitySystem, Attribute, AttributeKey, EntityPositionService, EntitySystemService} from '../../entitysystem';
import {drawMissingAsset} from '../../canvas/drawing/util';
import {EntityLayerService} from '../../entitysystem/services/entity-layer.service';

import {RenderPriorityService} from './render-priority.service';
import {DrawnConstruct, setConstructPosition} from './drawn-construct';

/**
 * Function type used to draw attributes.
 */
export type AttributeDrawer<T> = (attribute : T, assetService? : any) => DrawnConstruct;

type EntityCache = {[key:string]:EntityCacheEntry};


interface EntityCacheEntry {
    entity : Entity,
    renderedEntity : DrawnConstruct []
}

/**
 * The AttributeComponentService is used to find and instantiate a component class
 * for an attribute.
 */
@Injectable()
export class EntityDrawerService extends BaseAttributeService<AttributeDrawer<Attribute>> {
    private _cache : EntityCache = {};

    constructor(private _assets : AssetService,
                private _renderPriority : RenderPriorityService,
                private _entityPosition : EntityPositionService,
                private _entitySystem : EntitySystemService,
                private _layers : EntityLayerService) {
        super();
        _assets.assetLoaded.subscribe(() => this._clearCache());
        _assets.preloadImagesLoaded.subscribe(() => this._clearCache());
        _layers.hiddenLayers.subscribe(() => this._clearCache());
    }



    /**
     * Get a DisplayObject for the attribute.
     * @param key Attribute key of the attribute that should be drawn.
     * @param attribute Attribute that needs to be drawn.
     * @return A DrawnConstruct that describes how an entity is drawn.
     */
    drawAttribute(key : AttributeKey, entity : Entity) : DrawnConstruct {
        let drawer = this.getImplementation(key);
        if (drawer) {
            let drawnConstruct : DrawnConstruct;
            if (this._assets.areAssetsLoaded(entity, key)) {
                drawnConstruct = drawer(entity[key], this._assets);
            } else {
                drawnConstruct = drawMissingAsset(this._assets);
            }

            if (drawnConstruct) {
                setConstructPosition(
                    drawnConstruct,
                    this._entityPosition.getPosition(entity));
            }
            return drawnConstruct;
        }
        return null;
    }


    /**
     * Get a DisplayObject for the entity.
     * @param entity Entity that needs to be drawn.
     * @return A DisplayObject for the entity.
     */
    drawEntity(entity : Entity) : DrawnConstruct[] {
        let drawnConstructs : DrawnConstruct[] = [];
        for (let key in entity) {
            if (!this._layers.isEntityAttributeVisible(entity, key)) {
                continue;
            }
            let drawableConstruct = this.drawAttribute(key, entity);
            if (drawableConstruct) {
                drawnConstructs.push(drawableConstruct);
            }
        }
        return drawnConstructs;
    }

    /**
     * Get a function that can map the entitySystem stream into a stage stream.
     * @return A function that can be applied to map the system manager.
     */
    getSystemMapper() {
        return (entitySystem : EntitySystem) : DrawnConstruct[] => {
            let drawnConstructs : DrawnConstruct[] = [];
            let newCache : EntityCache = {};
            this._renderPriority.sortEntities(entitySystem).forEach(entity => {
                let entry = this._cache[entity.key];
                if (!entry || entry.entity !== entity.entity) {
                    entry = {
                        entity : entity.entity,
                        renderedEntity : this.drawEntity(entity.entity)
                    }
                }
                for (let construct of entry.renderedEntity) {
                    drawnConstructs.push(construct);
                }
                newCache[entity.key] = entry;
            });
            this._cache = newCache;
            return drawnConstructs;
        }
    }

    private _clearCache() {
        this._cache = {};
    }
}

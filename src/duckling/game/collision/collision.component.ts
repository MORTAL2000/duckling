import {
    Component,
    Input,
    Output,
    EventEmitter
} from 'angular2/core';

import {VectorInput, FormLabel} from '../../controls';
import {EnumSelect} from '../../controls/enum-select.component';
import {Vector} from '../../math/vector';
import {immutableAssign} from '../../util/model';
import {CollisionAttribute, BodyType, CollisionType} from './collision-attribute';

/**
 * Implementation that will be registered with the AttributeComponentService.
 * @see AttributeComponentService
 * @see AttributeComponent
 */
@Component({
    selector: "dk-collision-component",
    directives: [VectorInput, EnumSelect, FormLabel],
    styleUrls: ['./duckling/game/collision/collision.component.css'],
    template: `
        <dk-form-label title="Dimension"></dk-form-label>
        <dk-vector-input
            xLabel="Width"
            yLabel="Height"
            [value]="attribute.dimension.dimension"
            (validInput)="onDimensionInput($event)">
        </dk-vector-input>
        <dk-form-label title="One Way Normal"></dk-form-label>
        <dk-vector-input
            [value]="attribute.oneWayNormal"
            (validInput)="onOneWayNormalInput($event)">
        </dk-vector-input>

        <div class="form-label">Body Type</div>
        <dk-enum-select
            [value]="attribute.bodyType"
            [enum]="bodyTypes"
            (selection)="onBodyTypeInput($event)">
        </dk-enum-select>

        <div class="form-label">Collision Type</div>
        <dk-enum-select
            [value]="attribute.collisionType"
            [enum]="collisionType"
            (selection)="onCollisionTypeInput($event)">
        </dk-enum-select>
    `
})
export class CollisionComponent {
    @Input() attribute : CollisionAttribute;
    @Output() attributeChanged: EventEmitter<CollisionAttribute> = new EventEmitter();

    bodyTypes = BodyType;
    collisionType = CollisionType;

    onOneWayNormalInput(oneWayNormal : Vector) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {oneWayNormal}));
    }

    onDimensionInput(dimension : Vector) {
        var newBox = immutableAssign(this.attribute.dimension, {dimension});
        this.attributeChanged.emit(immutableAssign(this.attribute, {dimension: newBox}));
    }

    onBodyTypeInput(bodyType : BodyType) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {bodyType}));
    }

    onCollisionTypeInput(collisionType : CollisionType) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {collisionType}));
    }
}
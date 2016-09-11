import {immutableAssign} from '../../util';

import {Drawable, DrawableType, defaultDrawable} from './drawable';

export interface AnimatedDrawable extends Drawable {
    duration: number;
    frames : Drawable[];
}

export var defaultAnimatedDrawable : AnimatedDrawable = immutableAssign(defaultDrawable as AnimatedDrawable, {
    __cpp_type: "ild::AnimatedDrawable",
    key: "AnimatedDrawable",
    duration: 0,
    frames: [
    ]
});
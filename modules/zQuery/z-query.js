
export { z, Z } from './modules/core.js';

import { sliding } from "./modules/sliding.js";
import { events } from "./modules/events.js";
import { style } from "./modules/style.js";

export const zQuery = {
    sliding: sliding,
    events: events,
    style: style,
    init(options) { options.forEach( option => zQuery[option]() ) }
}


import { z, Z, zQuery } from '../z-query.js';
zQuery.init(['sliding', 'events']);

Z('button').on( 'click', () => z('.toggly').slideToggle() );
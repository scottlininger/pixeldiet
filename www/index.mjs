/**
 * @fileoverview Loads all of the necessary modules for the site.
 */
import Site from './mjs/PixelDiet.mjs';

/**
 * A global pointer to the site. Useful for console debugging.
 */
window.addEventListener('load', e => {
  window.site = new Site();
});

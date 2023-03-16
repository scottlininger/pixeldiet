/**
 * @fileoverview Top level manager class for the PixelDiet site.
 */
import Site from './Site.mjs';
import parseHash from './parseHash.mjs';

/**
 * Top level class for the HiveSite site.
 */
export default class PixelDiet extends Site {

  constructor () {
    super();
    
    /**
     * A panel to draw top level navigation. Gets styled with the CSS 'hs-panel'.
     * @type {HTMLElement}
     */
    this.panel = document.createElement('div');
    this.panel.className = 'pd-panel';
    this.panel.innerHTML = 'Hello world';
    document.body.append(this.panel);
    alert(1);

  }

  /**
   * Handler for the window's hashchange event. When this triggers, navigate to other
   * games or pages.
   * @param {Event} e The event.
   */
  async onHashChange (e) {
    this.hash = parseHash(window.location.hash);
  }
}
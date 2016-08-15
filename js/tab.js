"use strict";

class Tab
{
    /**
     * Tab Module Constructor
     * @param {String} scope DOM Selector
     * @param {Object} parameter module options
     */
    constructor({scope, parameter}) {
        this.scope  = scope;
        this.option = parameter;
        this.state  = {
            item  : {
                all : null,
                DOM : null,
                ID  : 0
            },
            panel : {
                parent : null,
                DOM : null
            }
        };

        this.initialize();
    }

    /**
     * Set state item and panel
     * @returns {undefined}
     */
    setState() {
        this.state.item.DOM  = this.scope.querySelector('.tab__item--active');
        this.state.panel.DOM = this.scope.querySelector('.tab__panel--active');

        return undefined;
    }

    /**
     * Actions Handler
     * @returns {{_onClick: (function(*))}} handler exposed functions
     */
    actionHandler() {
        /**
         * OnClick action
         * @param {Element} element DOM trigger
         * @returns {false | undefined} false if item has a statut active else undefined
         * @private
         */
        const _onClick = (element) => {
            if(typeof this.option.onClick === 'function') {
                this.option.onClick();
            }

            const link   = element.querySelector('a'),
                  parent = link.parentNode,
                  href   = link.getAttribute('href').replace('#',''),
                  panel  = document.getElementById(href);

            if(parent.classList.value.indexOf('--active') !== -1){
                return false;
            }

            jQuery(this.state.item.DOM).removeClass('tab__item--active');
            jQuery(parent).addClass('tab__item--active');
            jQuery(this.state.panel.DOM).removeClass('tab__panel--active');
            jQuery(panel).addClass('tab__panel--active');

            this.setState();
            if(this.option.effect === "switch") {
                this.animationHandler().switchEffect();
            }
            this.animationHandler().markerEffect();

            return undefined;
        };

        return {
            _onClick : _onClick
        };
    }

    /**
     * Insert width inline-style on items
     * @returns {undefined}
     */
    insertWidth() {
        const widthValue = 100 / this.state.item.all.length;
        for(let i =0; i < this.state.item.all.length; i++) {
            this.state.item.all[i].style.width = widthValue + "%";
        }

        return undefined;
    }

    /**
     * Tab module animations
     * @returns {{switchEffect: (function()), markerEffect: (function())}} handler exposed functions
     */
    animationHandler() {

        const switchEffect = () => {
            jQuery(this.state.panel.parent).animate({
                value : this.state.item.ID * 100
            }, {
                step: function (now) {
                    jQuery(this).css({"transform": "translate3d(-" + now + "%, 0px, 0px)"});
                },
                duration: 500,
                easing: 'linear',
                queue: false
            }, 'linear');
        };

        const markerEffect = () => {
            const widthValue   = 100 / this.state.item.all.length,
                  leftValue = widthValue + (widthValue * (this.state.item.ID - 1)),
                  markerBarDOM = this.scope.querySelector('.tab__item-marker__bar');

            markerBarDOM.style.width = widthValue + "%";
            markerBarDOM.style.left  = leftValue + "%";
        };

        return {
            switchEffect : switchEffect,
            markerEffect : markerEffect
        };
    }

    clickHandler() {
        const itemDOM    = this.state.item.all,
              itemLength = itemDOM.length;

        for(let i = 0; i < itemLength; i++) {
            itemDOM[i].addEventListener('click', (event) => {
                event.preventDefault();
                this.state.item.ID = i;
                this.actionHandler()._onClick(itemDOM[i]);
            });
        }
    }

    initialize() {
        this.scope = document.querySelector(this.scope);
        if (this.scope === null) {
            throw new Error('Tabmodule : DOM argument is not present');
        }

        this.setState();
        this.state.item.all = this.scope.querySelectorAll('.tab__item');
        this.state.panel.parent = this.state.panel.DOM.parentNode;
        this.state.panel.parent.style.transform = "translate3d("+ (this.state.item.ID * 100 ) + "%, 0px, 0px)";
        this.insertWidth();
        this.animationHandler().markerEffect();

        this.clickHandler();
    }
}

export default Tab;
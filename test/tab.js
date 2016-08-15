import jsdom from 'mocha-jsdom';
import TabModule from './../js/tab';
import {assert, expect} from 'chai';

describe('#TabModule', () =>
{
    let jQuery,
        tab;

    jsdom();

    before(() => {
        jQuery = require('jquery');
        global.jQuery = jQuery;

        //__HTMLDOM Mock
        document.body.innerHTML =
            `<div id="tabs">
                <div class="tab__nav">
                    <div class="tab__item tab__item--active">
                        <a href="#tab_one" class="tab__item-link">Title 1</a>
                    </div>
                    <div class="tab__item">
                        <a href="#tab_two" class="tab__item-link">Title 2</a>
                    </div>
                    <div class="tab__item-marker">
                        <div class="tab__item-marker__bar"></div>
                    </div>
                </div>
                <div class="tab__content">
                    <div class="tab__panel tab__panel--active" id="tab_one">Onglet 1</div>
                    <div class="tab__panel" id="tab_two">Onglet 2</div>
                </div>
            </div>`
        ;

        tab = new TabModule({
            scope : "#tabs",
            parameter : {
                onClick : () => {
                    return 'hello';
                },
                effect : "switch"
            }
        });
    });

    it('jQuery loaded and HTML Mocked', () => {
        assert.equal(jQuery(".tab__content div").first().html(), 'Onglet 1');
    });

    describe("#constructor", () => {
        it("should have a scope and options", () => {
            assert.equal(typeof tab.scope, 'object' );
            assert.equal(typeof tab.option, 'object');
        });
    });

    describe("#initialize", () => {
        it("should be throw Error if DOM not present in document", () => {
            try {
                new TabModule({
                    scope : "#tab",
                }).initialize();
            }
            catch(err) {
                expect(err).to.eql(new Error('Tabmodule : DOM argument is not present'));
            }
        });
    });

    describe("#actionHandler", () => {
        describe("#_onClick", () => {
            it("should have a _onClick function return", () => {
                assert.equal(typeof tab.actionHandler()._onClick, 'function');
            });

            it("should have a Callback if onClick option is defined with a function", () => {
                assert.equal(typeof tab.option.onClick, 'function');
                assert.equal(tab.option.onClick(), 'hello');
            });

            it("Have a class changed on item", () => {
                const itemMock  = document.querySelectorAll('.tab__item'),
                      panelMock = document.querySelectorAll('.tab__panel');

                assert.equal(itemMock[1].classList[1], null);
                assert.equal(panelMock[1].classList[1], null);

                tab.actionHandler()._onClick(itemMock[1]);

                assert.equal(itemMock[1].classList[1], 'tab__item--active');
                assert.equal(panelMock[1].classList[1], 'tab__panel--active');
                assert.notEqual(itemMock[0].classList[1], 'tab__item--active');
                assert.notEqual(panelMock[0].classList[1], 'tab__panel--active');
            });

            it("Should be return false if item is already active", () => {
                const itemMock = document.querySelectorAll('.tab__item')[1];

                assert.equal(tab.actionHandler()._onClick(itemMock), false);
            });
        });
    });

    describe("#clickHandler", () => {
        it("Should be return item active", () => {
            const itemMock = document.querySelectorAll('.tab__item')[0];

            itemMock.click();
            assert.equal(itemMock.classList[1], 'tab__item--active');
        });
    });

});
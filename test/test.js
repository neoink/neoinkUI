import assert from 'assert';
import jsdom from 'mocha-jsdom';
import TabModule from './../js/tab';
const expect = require('chai').expect;

describe('TabModule', () =>
{
    let jQuery,
        tab;

    jsdom();

    before(() => {
        document.body.innerHTML =
            '<div id="tabs">' +
                '<div class="tab__nav">' +
                    '<div class="tab__item tab__item--active">' +
                        '<a href="#tab_one" class="tab__item-link">Title 1</a>' +
                    '</div>' +
                    '<div class="tab__item">' +
                        '<a href="#tab_two" class="tab__item-link">Title 2</a>' +
                    '</div>' +
                    '<div class="tab__item-marker">' +
                        '<div class="tab__item-marker__bar"></div>' +
                    '</div>' +
                '</div>' +
                '<div class="tab__content">' +
                    '<div class="tab__panel tab__panel--active" id="tab_one">' +
                        'Onglet 1' +
                    '</div>' +
                    '<div class="tab__panel" id="tab_two">' +
                        'Onglet 2' +
                    '</div>' +
                '</div>' +
            '</div>'
        ;

        jQuery = require('jquery');
        global.jQuery = jQuery;
        tab = new TabModule({
            scope : "#tabs",
            parameter : {
                onClick : () => {
                    return 'hello';
                }
            }
        });
    });

    it('jQuery loaded and HTML Mocked', () => {
        expect(jQuery(".tab__content div").first().html()).eql('Onglet 1');
    });

    describe("constructor", () => {
        it("should have a scope and options", () => {
            assert.equal(typeof tab.scope, 'object' );
            assert.equal(typeof tab.option, 'object');
        });
    });

    describe("actionHandler", () => {

        it("should have a _onClick function return", () => {
            expect(typeof tab.actionHandler()._onClick).eql('function');
        });

        it("should have a Callback if onClick option is defined with a function", () => {
            expect(typeof tab.option.onClick).eql('function');
            expect(tab.option.onClick()).eql('hello');
        });

        it("should have a Callback if onClick option is defined with a function", () => {
            const itemMock = document.querySelectorAll('.tab__item')[1];
            assert.equal(itemMock.classList[1], null);
            tab.actionHandler()._onClick(itemMock);
            assert.equal(itemMock.classList[1], 'tab__item--active');
        });
    });
});
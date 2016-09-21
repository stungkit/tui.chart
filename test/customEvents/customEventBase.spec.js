/**
 * @fileoverview Test for CustomEventBase.
 * @author NHN Ent.
 *         FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var CustomEventBase = require('../../src/js/customEvents/customEventBase');
var chartConst = require('../../src/js/const');

describe('Test for CustomEventBase', function() {
    var customEventBase;

    beforeEach(function() {
        customEventBase = new CustomEventBase({});
    });

    describe('_isChangedSelectData()', function() {
        it('찾아낸 data가 없으면 true를 반환합니다..', function() {
            var actual = customEventBase._isChangedSelectData({
                    chartType: 'column'
                }, null),
                expected = true;
            expect(actual).toBe(expected);
        });

        it('이전 data가 없으면 true를 반환합니다..', function() {
            var actual = customEventBase._isChangedSelectData(null, {
                    chartType: 'line'
                }),
                expected = true;
            expect(actual).toBe(expected);
        });

        it('찾아낸 data가 이전 data와 chartType이 다르면 true를 반환합니다..', function() {
            var actual = customEventBase._isChangedSelectData({
                    chartType: 'column'
                }, {
                    chartType: 'line'
                }),
                expected = true;
            expect(actual).toBe(expected);
        });

        it('찾아낸 data가 이전 data와 groupIndex가 다르면 true를 반환합니다..', function() {
            var actual = customEventBase._isChangedSelectData({
                    indexes: {
                        groupIndex: 0
                    }
                }, {
                    indexes: {
                        groupIndex: 1
                    }
                }),
                expected = true;
            expect(actual).toBe(expected);
        });

        it('찾아낸 data가 이전 data와 index 다르면 true를 반환합니다..', function() {
            var actual = customEventBase._isChangedSelectData({
                    indexes: {
                        index: 0
                    }
                }, {
                    indexes: {
                        index: 1
                    }
                }),
                expected = true;
            expect(actual).toBe(expected);
        });
    });

    describe('_calculateLayerPosition()', function() {
        it('clientX에 SERIES_EXPAND_SIZE와 container의 left정보를 감하여 layerX를 구합니다.', function() {
            var actual;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450
            });

            actual = customEventBase._calculateLayerPosition(150);

            expect(actual.x).toBe(100);
        });

        it('전달하는 clientX가 container의 bound.left 보다 작을 경우의 x는 -10(확장 크기)만큼을 반환합니다.', function() {
            var actual;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450
            });
            customEventBase.expandSize = chartConst.SERIES_EXPAND_SIZE;

            actual = customEventBase._calculateLayerPosition(30);

            expect(actual.x).toBe(-10);
        });

        it('세번째 인자인 checkLimit에 false를 전달하면 clientX가 container의 x가 bound.left 보다 작더라도 그대로 반환합니다.', function() {
            var clientX = 30;
            var checkLimit = false;
            var actual, clientY;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450
            });

            actual = customEventBase._calculateLayerPosition(clientX, clientY, checkLimit);

            expect(actual.x).toBe(-20);
        });

        it('전달하는 clientX가 container의 bound.right 보다 클 경우의 x를 구합니다.', function() {
            var actual;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450
            });
            customEventBase.expandSize = chartConst.SERIES_EXPAND_SIZE;

            actual = customEventBase._calculateLayerPosition(480);

            expect(actual.x).toBe(410);
        });

        it('세번째 인자인 checkLimit에 false를 전달하면 clientX가 container의 x가 bound.left 보다 크더라도 그대로 반환합니다.', function() {
            var clientX = 480;
            var checkLimit = false;
            var actual, clientY;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450
            });

            actual = customEventBase._calculateLayerPosition(clientX, clientY, checkLimit);

            expect(actual.x).toBe(430);
        });

        it('clientY값이 있는 경우 y값을 계산하여 반환합니다.', function() {
            var actual;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450,
                top: 50
            });

            actual = customEventBase._calculateLayerPosition(150, 150);

            expect(actual.y).toBe(100);
        });

        it('clientY값이 없는 경우 y값은 반환하지 않습니다.', function() {
            var actual;

            spyOn(customEventBase, '_getContainerBound').and.returnValue({
                left: 50,
                right: 450,
                top: 50
            });

            actual = customEventBase._calculateLayerPosition(150);

            expect(actual.y).toBeUndefined();
        });
    });
});
/**
 * Константы необходимые для работы игры
 * @module Константы
 * @class Constants
 * @type {string}
 **/
/**
 * Базовый путь
 * @property BASEPATH
 * @type {string}
 **/
var BASEPATH   = 'Content/';
/**
 * @property DIV
 * @type {string}
 **/
var DIV        = '<div />';
/**
 * @property CLS_FIGURE
 * @type {string}
 **/
var CLS_FIGURE = 'figure';
/**
 * @property CLS_MATTER
 * @type {string}
 */
var CLS_MATTER = 'matter';
/**
 * Направления марио
 * @property directions
 * @type {{none: number, left: number, up: number, right: number, down: number}}
 * @param none {number} нет направления
 * @param left {number} влево
 * @param up {number} вверх
 * @param right {number} вправо
 * @param down {number} вниз
 */
var directions = {
    none  : 0,
    left  : 1,
    up    : 2,
    right : 3,
    down  : 4
};

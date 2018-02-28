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
/**
 * Состояния марио обычное/гриб или после цветка
 * @property mario_states
 * @type {{normal: number, fire: number}}
 * @param normal {number} нормальное состояние марио
 * @param fire {number} состояние стреляющего марио
 */
var mario_states = {
    normal : 0,
    fire  : 1
};
/**
 * Размер марио под грибом и без него
 * @property size_states
 * @type {{small: number, big: number}}
 * @param small {number} маленький марио
 * @param big {number} большой марио
 */
var size_states = {
    small : 1,
    big   : 2
};
/**
 * Блоки
 * @property ground_blocking
 * @type {{none: number, left: number, top: number, right: number, bottom: number, all: number}}
 * @param none {number} нет направления
 * @param left {number} влево блок
 * @param top {number} вверх блок
 * @param right {number} вправо блок
 * @param bottom {number} вниз блок
 * @param all {number} блок везде
 */
var ground_blocking = {
    none   : 0,
    left   : 1,
    top    : 2,
    right  : 4,
    bottom : 8,
    all    : 15
};
/**
 * Виды смертей (100% смерть и просто понижение лвла)
 * @property death_modes
 * @type {{normal: number, shell: number}}
 * @param normal {number} обычная смерть
 * @param shell {number} сброс мощности марио
 */
var death_modes = {
    normal : 0,
    shell  : 1
};
/**
 * Пути к файлам со спрайтами
 * @property images
 * @type {{enemies: string, sprites: string, objects: string, peach: string}}
 * @param enemies {string} Путь к изображениям с врагами
 * @param sprites {string} Путь к изображениям с марио
 * @param objects {string} Путь к изображениям с объектами
 * @param peach {string} Путь к изображениям с принцессой
 */
var images = {
    enemies : BASEPATH + 'mario-enemies.png',
    sprites : BASEPATH + 'mario-sprites.png',
    objects : BASEPATH + 'mario-objects.png',
    peach   : BASEPATH + 'mario-peach.png'
};
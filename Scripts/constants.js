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
/**
 * Различные константы, названия говорят сами о себе
 * @property constants
 * @type {{interval: number, bounce: number, cooldown: number, gravity: number, start_lives: number, max_width: number, max_height: number, jumping_v: number, walking_v: number, mushroom_v: number, ballmonster_v: number, spiked_turtle_v: number, small_turtle_v: number, big_turtle_v: number, shell_v: number, shell_wait: number, star_vx: number, star_vy: number, bullet_v: number, max_coins: number, pipeplant_count: number, pipeplant_v: number, invincible: number, invulnerable: number, blinkfactor: number}}
 */
var constants = {
    interval        : 20,
    bounce          : 15,
    cooldown        : 20,
    gravity         : 2,
    start_lives     : 3,
    max_width       : 400,
    max_height      : 15,
    jumping_v       : 27,
    walking_v       : 5,
    mushroom_v      : 3,
    ballmonster_v   : 2,
    spiked_turtle_v : 1.5,
    small_turtle_v  : 3,
    big_turtle_v    : 2,
    shell_v         : 10,
    shell_wait      : 25,
    star_vx         : 4,
    star_vy         : 16,
    bullet_v        : 12,
    max_coins       : 100,
    pipeplant_count : 150,
    pipeplant_v     : 1,
    invincible      : 11000,
    invulnerable    : 1000,
    blinkfactor     : 5
};
/**
 * Гриб или цветок если гриб уже съели
 * @property mushroom_mode
 * @type {{mushroom: number, plant: number}}
 * @param mushroom {number} Гриб
 * @param plant {number} Цветок
 */
var mushroom_mode = {
    mushroom : 0,
    plant    : 1
};
/**
 * @method c2u
 * @param s
 * @returns {string}
 */
var c2u = function(s) {
    return 'url(' + s + ')';
};
/**
 * @method q2q
 * @param figure
 * @param opponent
 * @returns {boolean}
 */
var q2q = function(figure, opponent) {
    if(figure.x > opponent.x + 16)
        return false;
    else if(figure.x + 16 < opponent.x)
        return false;
    else if(figure.y + figure.state * 32 - 4 < opponent.y)
        return false;
    else if(figure.y + 4 > opponent.y + opponent.state * 32)
        return false;
        
    return true;
};
/**
 * @method sign
 * @param x
 * @returns {number}
 */
Math.sign = function(x) {
    if(x > 0)
        return 1;
    else if(x < 0)
        return -1;
    return 0;
};
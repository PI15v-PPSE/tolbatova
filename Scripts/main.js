/**
 * Базовый класс, позволяет инициализировать объекты,
 * устанавливать и получать позицию,
 * устанавливать и получать изображение и размер,
 * содержит всю работу с экраном.
 *
 * @module Основные классы
 * @class Base
 * @extends Class
 */
var Base = Class.extend({
    /**
     * Инициализация
     * @method init
     * @param x {number} X координата
     * @param y {number} Y координата
    */
    init: function(x, y) {
        this.setPosition(x || 0, y || 0);
        this.clearFrames();
        this.frameCount = 0;
    },
    /**
     * Установка позиции объекта
     * @method setPosition
     * @param x {number} X координата
     * @param y {number} Y координата
     */
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * Получение позиции объекта
     * @method getPosition
     * @return {number, number} координаты объекта
     */
    getPosition: function() {
        return { x : this.x, y : this.y };
    },
    /**
     * Установка изображения
     * @method setImage
     * @param img {String} путь к изображению
     * @param x {number} X координата
     * @param y {number} Y координата
     */
    setImage: function(img, x, y) {
        this.image = {
            path : img,
            x : x,
            y : y
        };
    },
    /**
     * Установка размера изображения
     * @method setSize
     * @param width {number} ширина изображения
     * @param height {number} высота изображения
     */
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
    },
    /**
     * Получение размера изображения
     * @method getSize
     * @return {number, number} ширина и высота изображения
     */
    getSize: function() {
        return { width: this.width, height: this.height };
    },
    /**
     * Установки для экрана(работа с кадрами)
     * @method setupFrames
     * @param fps {number} кадры в секунду
     * @param frames {number} кадры
     * @param rewind {number} ускорение
     * @param id {number} ID
     */
    setupFrames: function(fps, frames, rewind, id) {
        if(id) {
            if(this.frameID === id)
                return true;
            this.frameID = id;
        }
        
        this.currentFrame = 0;
        this.frameTick = frames ? (1000 / fps / constants.interval) : 0;
        this.frames = frames;
        this.rewindFrames = rewind;
        return false;
    },
    /**
     * Установки для экрана(обнуление кадров)
     * @method clearFrames
     */
    clearFrames: function() {
        this.frameID = undefined;
        this.frames = 0;
        this.currentFrame = 0;
        this.frameTick = 0;
    },
    /**
     * Проигрывание и движение экрана
     * @method playFrame
     */
    playFrame: function() {
        if(this.frameTick && this.view) {
            this.frameCount++;
            
            if(this.frameCount >= this.frameTick) {            
                this.frameCount = 0;
                
                if(this.currentFrame === this.frames)
                    this.currentFrame = 0;
                    
                var $el = this.view;
                $el.css('background-position', '-' + (this.image.x + this.width *
                    ((this.rewindFrames ? this.frames - 1 : 0) - this.currentFrame)) + 'px -' + this.image.y + 'px');
                this.currentFrame++;
            }
        }
    }
});

/**
 * Класс отвечающий за калибровку изображения заднего фона
 * @class Gauge
 * @extends Base
 */
var Gauge = Base.extend({
    /**
     * Инициализация
     * @method init
     * @param id {number} ID
     * @param startImgX {number} стартовое значение координаты по X
     * @param startImgY {number} стартовое значение координаты по Y
     * @param fps {number} кадры в секунду
     * @param frames {number} кадры
     * @param rewind {number} ускорение
     */
    init: function(id, startImgX, startImgY, fps, frames, rewind) {
        this._super(0, 0);
        this.view = $('#' + id);
        this.setSize(this.view.width(), this.view.height());
        this.setImage(this.view.css('background-image'), startImgX, startImgY);
        this.setupFrames(fps, frames, rewind);
    }
});

/**
 * Класс описывающий уровень
 * @class Level
 * @extends Base
 */
var Level = Base.extend({
    /**
     * Инициализация уровня
     * @method init
     * @param id {number} ID
     */
    init: function(id) {
        this.world = $('#' + id);
        this.nextCycles = 0;
        this._super(0, 0);
        this.active = false;
        this.figures = [];
        this.obstacles = [];
        this.decorations = [];
        this.items = [];
        this.coinGauge = new Gauge('coin', 0, 0, 10, 4, true);
        this.liveGauge = new Gauge('live', 0, 430, 6, 6, true);
    },
    /**
     * Перезагрузка уровня
     * @method reload
     */
    reload: function() {
        var settings = {};
        this.pause();

        for(var i = this.figures.length; i--; ) {
            if(this.figures[i] instanceof Mario) {
                settings.lifes = this.figures[i].lifes - 1;
                settings.coins = this.figures[i].coins;
                break;
            }
        }

        this.reset();

        if(settings.lifes < 0) {
            this.load(definedLevels[0]);
        } else {
            this.load(this.raw);

            for(var i = this.figures.length; i--; ) {
                if(this.figures[i] instanceof Mario) {
                    this.figures[i].setLifes(settings.lifes || 0);
                    this.figures[i].setCoins(settings.coins || 0);
                    break;
                }
            }
        }

        this.start();
    },
    /**
     * Загрузка уровня
     * @mathod load
     * @param level
     */
    load: function(level) {
        if(this.active) {
            if(this.loop)
                this.pause();

            this.reset();
        }

        this.setPosition(0, 0);
        this.setSize(level.width * 32, level.height * 32);
        this.setImage(level.background);
        this.raw = level;
        this.id = level.id;
        this.active = true;
        var data = level.data;

        for(var i = 0; i < level.width; i++) {
            var t = [];

            for(var j = 0; j < level.height; j++) {
                t.push('');
            }

            this.obstacles.push(t);
        }

        for(var i = 0, width = data.length; i < width; i++) {
            var col = data[i];

            for(var j = 0, height = col.length; j < height; j++) {
                if(reflection[col[j]])
                    new (reflection[col[j]])(i * 32, (height - j - 1) * 32, this);
            }
        }
    },
    /**
     * Переключение на следующий уровень
     * @method next
     */
    next: function() {
        this.nextCycles = Math.floor(7000 / constants.interval);
    },
    /**
     * Следующий уровень
     * @method nextLoad
     */
    nextLoad: function() {
        if(this.nextCycles)
            return;

        var settings = {};
        this.pause();

        for(var i = this.figures.length; i--; ) {
            if(this.figures[i] instanceof Mario) {
                settings.lifes = this.figures[i].lifes;
                settings.coins = this.figures[i].coins;
                settings.state = this.figures[i].state;
                settings.marioState = this.figures[i].marioState;
                break;
            }
        }

        this.reset();
        this.load(definedLevels[this.id + 1]);

        for(var i = this.figures.length; i--; ) {
            if(this.figures[i] instanceof Mario) {
                this.figures[i].setLifes(settings.lifes || 0);
                this.figures[i].setCoins(settings.coins || 0);
                this.figures[i].setState(settings.state || size_states.small);
                this.figures[i].setMarioState(settings.marioState || mario_states.normal);
                break;
            }
        }

        this.start();
    },
    /**
     * @method getGridWidth
     * @returns {*}
     */
    getGridWidth: function() {
        return this.raw.width;
    },
    /**
     * @method getGridHeight
     * @returns {*|number}
     */
    getGridHeight: function() {
        return this.raw.height;
    },
    /**
     * Сброс параметров уровня
     * @method reset
     */
    reset: function() {
        this.active = false;
        this.world.empty();
        this.figures = [];
        this.obstacles = [];
        this.items = [];
        this.decorations = [];
    },
    /**
     * Запуск
     * @method tick
     * @returns {*}
     */
    tick: function() {
        if(this.nextCycles) {
            this.nextCycles--;
            this.nextLoad();
            return;
        }

        var i = 0, j = 0, figure, opponent;

        for(i = this.figures.length; i--; ) {
            figure = this.figures[i];

            if(figure.dead) {
                if(!figure.death()) {
                    if(figure instanceof Mario)
                        return this.reload();

                    figure.view.remove();
                    this.figures.splice(i, 1);
                } else
                    figure.playFrame();
            } else {
                if(i) {
                    for(j = i; j--; ) {
                        if(figure.dead)
                            break;

                        opponent = this.figures[j];

                        if(!opponent.dead && q2q(figure, opponent)) {
                            figure.hit(opponent);
                            opponent.hit(figure);
                        }
                    }
                }
            }

            if(!figure.dead) {
                figure.move();
                figure.playFrame();
            }
        }

        for(i = this.items.length; i--; )
            this.items[i].playFrame();

        this.coinGauge.playFrame();
        this.liveGauge.playFrame();
    },
    /**
     * Старт игры
     * @method start
     */
    start: function() {
        var me = this;
        me.loop = setInterval(function() {
            me.tick.apply(me);
        }, constants.interval);
    },
    /**
     * Пауза в игре
     * @method pause
     */
    pause: function() {
        clearInterval(this.loop);
        this.loop = undefined;
    },
    /**
     * @method setPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setPosition: function(x, y) {
        this._super(x, y);
        this.world.css('left', -x);
    },
    /**
     * @method setImage
     * @param index {number} индекс
     */
    setImage: function(index) {
        var img = BASEPATH + 'backgrounds/' + ((index < 10 ? '0' : '') + index) + '.png';
        this.world.parent().css({
            backgroundImage : c2u(img),
            backgroundPosition : '0 -380px'
        });
        this._super(img, 0, 0);
    },
    /**
     * @method setSize
     * @param width {number} ширина
     * @param height {number} высота
     */
    setSize: function(width, height) {
        this._super(width, height);
    },
    /**
     * @method setParallax
     * @param x
     */
    setParallax: function(x) {
        this.setPosition(x, this.y);
        this.world.parent().css('background-position', '-' + Math.floor(x / 3) + 'px -380px');
    }
});

/**
 * Класс отвечающий за всех персонажей, монстров, etc.
 * @class Figure
 * @extends Base
 */
var Figure = Base.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this.view = $(DIV).addClass(CLS_FIGURE).appendTo(level.world);
        this.dx = 0;
        this.dy = 0;
        this.dead = false;
        this.onground = true;
        this.setState(size_states.small);
        this.setVelocity(0, 0);
        this.direction = directions.none;
        this.level = level;
        this._super(x, y);
        level.figures.push(this);
    },
    /**
     * @method setState
     * @param state
     */
    setState: function(state) {
        this.state = state;
    },
    /**
     * @method setImage
     * @param img {string} путь к изображению
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setImage: function(img, x, y) {
        this.view.css({
            backgroundImage : img ? c2u(img) : 'none',
            backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px'
        });
        this._super(img, x, y);
    },
    /**
     * @method setOffset
     * @param dx {number} координата X
     * @param dy {number} координата Y
     */
    setOffset: function(dx, dy) {
        this.dx = dx;
        this.dy = dy;
        this.setPosition(this.x, this.y);
    },
    /**
     * @method setPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setPosition: function(x, y) {
        this.view.css({
            left: x,
            bottom: y,
            marginLeft: this.dx,
            marginBottom: this.dy
        });
        this._super(x, y);
        this.setGridPosition(x, y);
    },
    /**
     * @method setSize
     * @param width {number} ширина
     * @param height {number} высота
     */
    setSize: function(width, height) {
        this.view.css({
            width: width,
            height: height
        });
        this._super(width, height);
    },
    /**
     * @method setGridPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setGridPosition: function(x, y) {
        this.i = Math.floor((x + 16) / 32);
        this.j = Math.ceil(this.level.getGridHeight() - 1 - y / 32);
        
        if(this.j > this.level.getGridHeight())
            this.die();
    },
    /**
     * @method setVelocity
     * @param vx {number} координата X
     * @param vy {number} координата Y
     */
    setVelocity: function(vx, vy) {
        this.vx = vx;
        this.vy = vy;
        
        if(vx > 0)
            this.direction = directions.right;
        else if(vx < 0)
            this.direction = directions.left;
    },
    /**
     * @method hit
     * @param opponent
     */
    hit: function(opponent) {
        
    },
    /**
     * Метод просчитывающий столкновения объектов
     * @method collides
     * @param is
     * @param ie
     * @param js
     * @param je
     * @param blocking
     * @returns {boolean}
     */
    collides: function(is, ie, js, je, blocking) {
        var isHero = this instanceof Hero;
        
        if(is < 0 || ie >= this.level.obstacles.length)
            return true;
            
        if(js < 0 || je >= this.level.getGridHeight())
            return false;
            
        for(var i = is; i <= ie; i++) {
            for(var j = je; j >= js; j--) {
                var obj = this.level.obstacles[i][j];
                
                if(obj) {
                    if(obj instanceof Item && isHero && (blocking === ground_blocking.bottom || obj.blocking === ground_blocking.none))
                        obj.activate(this);
                    
                    if((obj.blocking & blocking) === blocking)
                        return true;
                }
            }
        }
        
        return false;
    },
    /**
     * Метод отвечающий за просчитывание движения объектов
     * @method move
     */
    move: function() {
        var vx = this.vx;
        var vy = this.vy - constants.gravity;
        
        var s = this.state;
        
        var x = this.x;
        var y = this.y;
        
        var dx = Math.sign(vx);
        var dy = Math.sign(vy);
        
        var is = this.i;
        var ie = is;
        
        var js = Math.ceil(this.level.getGridHeight() - s - (y + 31) / 32);
        var je = this.j;
        
        var d = 0, b = ground_blocking.none;
        var onground = false;
        var t = Math.floor((x + 16 + vx) / 32);
        
        if(dx > 0) {
            d = t - ie;
            t = ie;
            b = ground_blocking.left;
        } else if(dx < 0) {
            d = is - t;
            t = is;
            b = ground_blocking.right;
        }
        
        x += vx;
        
        for(var i = 0; i < d; i++) {
            if(this.collides(t + dx, t + dx, js, je, b)) {
                vx = 0;
                x = t * 32 + 15 * dx;
                break;
            }
            
            t += dx;
            is += dx;
            ie += dx;
        }
        
        if(dy > 0) {
            t = Math.ceil(this.level.getGridHeight() - s - (y + 31 + vy) / 32);
            d = js - t;
            t = js;
            b = ground_blocking.bottom;
        } else if(dy < 0) {
            t = Math.ceil(this.level.getGridHeight() - 1 - (y + vy) / 32);
            d = t - je;
            t = je;
            b = ground_blocking.top;
        } else
            d = 0;
        
        y += vy;
        
        for(var i = 0; i < d; i++) {
            if(this.collides(is, ie, t - dy, t - dy, b)) {
                onground = dy < 0;
                vy = 0;
                y = this.level.height - (t + 1) * 32 - (dy > 0 ? (s - 1) * 32 : 0);
                break;
            }
            
            t -= dy;
        }
        
        this.onground = onground;
        this.setVelocity(vx, vy);
        this.setPosition(x, y);
    },
    /**
     * @method death
     * @returns {boolean}
     */
    death: function() {
        return false;
    },
    /**
     * @method die
     */
    die: function() {
        this.dead = true;
    }
});

/**
 * Класс отвечающий за все материалы в игре (блоки, etc)
 * @class Matter
 * @extends Base
 */
var Matter = Base.extend({
    /**
     * Инициализирует объект 32х32 пикселя
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param blocking {number} блок или украшение и тд
     * @param level уровень
     */
    init: function(x, y, blocking, level) {
        this.blocking = blocking;
        this.view = $(DIV).addClass(CLS_MATTER).appendTo(level.world);
        this.level = level;
        this._super(x, y);
        this.setSize(32, 32);
        this.addToGrid(level);
    },
    /**
     * @method addToGrid
     * @param level уровень
     */
    addToGrid: function(level) {
        level.obstacles[this.x / 32][this.level.getGridHeight() - 1 - this.y / 32] = this;
    },
    /**
     * @method setImage
     * @param img {string} путь к изображению
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setImage: function(img, x, y) {
        this.view.css({
            backgroundImage : img ? c2u(img) : 'none',
            backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px'
        });
        this._super(img, x, y);
    },
    /**
     * @method setPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setPosition: function(x, y) {
        this.view.css({
            left: x,
            bottom: y
        });
        this._super(x, y);
    }
});

/**
 * Класс описывающий блоки
 * @class ground
 * @extends Matter
 */
var Ground = Matter.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param blocking {number} блок или украшение и тд
     * @param level
     */
    init: function(x, y, blocking, level) {
        this._super(x, y, blocking, level);
    }
});

/**
 * Блок описывающий блок с травой сверху
 * @class TopGrass
 * @extends Ground
 */
var TopGrass = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.top;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 888, 404);
    }
}, 'grass_top');

/**
 * Класс описывающий блок из камня
 * @class Stone
 * @extends Ground
 */
var Stone = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.all;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 550, 160);
    }
}, 'stone');

/**
 * Класс описывающий обычный блок
 * @class BrownBlock
 * @extends Ground
 **/
var BrownBlock = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.all;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 514, 194);
    }
}, 'brown_block');

/**
 * Класс описывающий кусок трубы
 * @class RightTopPipe
 * @extends Ground
 **/
var RightTopPipe = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.all;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 36, 358);
    }
}, 'pipe_top_right');
/**
 * Класс описывающий кусок трубы
 * @class LeftTopPipe
 * @extends Ground
 **/
var LeftTopPipe = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.all;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 2, 358);
    }
}, 'pipe_top_left');
/**
 * Класс описывающий кусок трубы
 * @class RightPipe
 * @extends Ground
 **/
var RightPipe = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.right + ground_blocking.bottom;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 36, 390);
    }
}, 'pipe_right');
/**
 * Класс описывающий кусок трубы
 * @class LeftPipe
 * @extends Ground
 **/
var LeftPipe = Ground.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        var blocking = ground_blocking.left + ground_blocking.bottom;
        this._super(x, y, blocking, level);
        this.setImage(images.objects, 2, 390);
    }
}, 'pipe_left');

/**
 * Декорации
 * @class Decoration
 * @extends Matter
 **/
var Decoration = Matter.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, ground_blocking.none, level);
        level.decorations.push(this);
    },
    /**
     * @method setImage
     * @param img {string}  путь к изображению
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setImage: function(img, x, y) {
        this.view.css({
            backgroundImage : img ? c2u(img) : 'none',
            backgroundPosition : '-' + (x || 0) + 'px -' + (y || 0) + 'px'
        });
        this._super(img, x, y);
    },
    /**
     * @method setPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setPosition: function(x, y) {
        this.view.css({
            left: x,
            bottom: y
        });
        this._super(x, y);
    }
});

/**
 * Обычная земля
 * @class Soil
 * @extends Decoration
 **/
var Soil = Decoration.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, level);
        this.setImage(images.objects, 888, 438);
    }
}, 'soil');

/**
 * Класс отвечающий за различные предметы
 * @class Item
 * @extends Matter
 **/
var Item = Matter.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param isBlocking Блок или нет
     * @param level
     */
    init: function(x, y, isBlocking, level) {
        this.isBouncing = false;
        this.bounceCount = 0;
        this.bounceFrames = Math.floor(50 / constants.interval);
        this.bounceStep = Math.ceil(10 / this.bounceFrames);
        this.bounceDir = 1;
        this.isBlocking = isBlocking;
        this._super(x, y, isBlocking ? ground_blocking.all : ground_blocking.none, level);
        this.activated = false;
        this.addToLevel(level);
    },
    /**
     * Добавить в уровень
     * @method addToLevel
     * @param level
     */
    addToLevel: function(level) {
        level.items.push(this);
    },
    /**
     * @method activate
     * @param from
     */
    activate: function(from) {
        this.activated = true;
    },
    /**
     * Движение
     * @method bounce
     */
    bounce: function() {
        this.isBouncing = true;
        
        for(var i = this.level.figures.length; i--; ) {
            var fig = this.level.figures[i];
            
            if(fig.y === this.y + 32 && fig.x >= this.x - 16 && fig.x <= this.x + 16) {
                if(fig instanceof ItemFigure)
                    fig.setVelocity(fig.vx, constants.bounce);
                else
                    fig.die();
            }
        }
    },
    /**
     * Запуск проигрывания
     * @method playFrame
     */
    playFrame: function() {
        if(this.isBouncing) {
            this.view.css({ 'bottom' : (this.bounceDir > 0 ? '+' : '-') + '=' + this.bounceStep + 'px' });
            this.bounceCount += this.bounceDir;
            
            if(this.bounceCount === this.bounceFrames)
                this.bounceDir = -1;
            else if(this.bounceCount === 0) {
                this.bounceDir = 1;
                this.isBouncing = false;
            }
        }
        
        this._super();
    }
});

/**
 * Класс описывающий монетку
 * @class Coin
 * @extends Item
 **/
var Coin = Item.extend({
    /**
     * @method init
     * @param x {number} координата по X
     * @param y {number} координата по Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, false, level);
        this.setImage(images.objects, 0, 0);
        this.setupFrames(10, 4, true);
    },
    /**
     * @method activate
     * @param from
     */
    activate: function(from) {
        if(!this.activated) {
            from.addCoin();
            this.remove();
        }
        this._super(from);
    },
    /**
     * Убрать из видимости
     * @method remove
     */
    remove: function() {
        this.view.remove();
    }
}, 'coin');
/**
 * Блок с монетками, общий класс
 * @class CoinBoxCoin
 * @extends Coin
 **/
var CoinBoxCoin = Coin.extend({
    /**
     * @method init
     * @param x {number} координата по X
     * @param y {number} координата по Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, level);
        this.setImage(images.objects, 96, 0);
        this.clearFrames();
        this.view.hide();
        this.count = 0;
        this.frames = Math.floor(150 / constants.interval);
        this.step = Math.ceil(30 / this.frames);
    },
    /**
     * @method remove
     */
    remove: function() { },
    /**
     * @method addToGrid
     */
    addToGrid: function() { },
    /**
     * @method addToLevel
     */
    addToLevel: function() { },
    /**
     * @method activate
     * @param from
     */
    activate: function(from) {
        this._super(from);
        this.view.show().css({ 'bottom' : '+=8px' });
    },
    /**
     * @method act
     * @returns {boolean}
     */
     act: function() {
        this.view.css({ 'bottom' : '+=' + this.step + 'px' });
        this.count++;
        return (this.count === this.frames);
    }
});
/**
 * Блок с монетками обычный
 * @class CoinBox
 * @extends Item
 **/
var CoinBox = Item.extend({
    /**
     * @method init
     * @param x {number} координата по X
     * @param y {number} координата по Y
     * @param level
     * @param amount {number} количество монет
     */
    init: function(x, y, level, amount) {
        this._super(x, y, true, level);
        this.setImage(images.objects, 346, 328);
        this.setAmount(amount || 1);
    },
    /**
     * @method setAmount
     * @param amount
     */
    setAmount: function(amount) {
        this.items = [];
        this.actors = [];
        
        for(var i = 0; i < amount; i++)
            this.items.push(new CoinBoxCoin(this.x, this.y, this.level));
    },
    /**
     * @method activate
     * @param from
     */
    activate: function(from) {
        if(!this.isBouncing) {
            if(this.items.length) {
                this.bounce();
                var coin = this.items.pop();
                coin.activate(from);
                this.actors.push(coin);
                
                if(!this.items.length)
                    this.setImage(images.objects, 514, 194);
            }
        }
            
        this._super(from);
    },
    /**
     * @method playFrame
     */
    playFrame: function() {
        for(var i = this.actors.length; i--; ) {
            if(this.actors[i].act()) {
                this.actors[i].view.remove();
                this.actors.splice(i, 1);
            }
        }
        
        this._super();
    }
}, 'coinbox');

/**
 * class ItemFigure
 *
 * @class ItemFigure
 * @extends Figure
 **/
var ItemFigure = Figure.extend({
    init: function(x, y, level) {
        this._super(x, y, level);
    }
});

/**
 * Класс описывающий блок с грибом
 * @class MushroomBox
 * @extends Item
 * @type {*}
 */
var MushroomBox = Item.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, true, level);
        this.setImage(images.objects, 96, 33);
        this.max_mode = mushroom_mode.plant;
        this.mushroom = new Mushroom(x, y, level);
        this.setupFrames(8, 4, false);
    },
    /**
     * @method activate
     * @param from
     */
    activate: function(from) {
        if(!this.activated) {
            if(from.state === size_states.small || this.max_mode === mushroom_mode.mushroom)
                this.mushroom.release(mushroom_mode.mushroom);
            else
                this.mushroom.release(mushroom_mode.plant);
            
            this.clearFrames();
            this.bounce();
            this.setImage(images.objects, 514, 194);
        }
            
        this._super(from);
    }
}, 'mushroombox');
/**
 * Класс описывающий гриб
 * @class Mushroom
 * @extends ItemFigure
 * @type {*}
 */
var Mushroom = ItemFigure.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, level);
        this.active = false;
        this.setSize(32, 32);
        this.setImage(images.objects, 582, 60);
        this.released = 0;
        this.view.css('z-index', 94).hide();
    },
    /**
     * Изображение гриба показывается
     * @method release
     * @param mode
     */
    release: function(mode) {
        this.released = 4;
        
        if(mode === mushroom_mode.plant)
            this.setImage(images.objects, 548, 60);
            
        this.mode = mode;
        this.view.show();
    },
    /**
     * Дживение гриба по карте
     * @method move
     */
    move: function() {
        if(this.active) {
            this._super();
        
            if(this.mode === mushroom_mode.mushroom && this.vx === 0)
                this.setVelocity(this.direction === directions.right ? -constants.mushroom_v : constants.mushroom_v, this.vy);
        } else if(this.released) {
            this.released--;
            this.setPosition(this.x, this.y + 8);
            
            if(!this.released) {
                this.active = true;
                this.view.css('z-index', 99);
                
                if(this.mode === mushroom_mode.mushroom)
                    this.setVelocity(constants.mushroom_v, constants.gravity);
            }
        }
    },
    /**
     * При столкновении с марио в зависимости от его размера он либо ростет либо стреляет
     * @method hit
     * @param opponent
     */
    hit: function(opponent) {
        if(this.active && opponent instanceof Mario) {
            if(this.mode === mushroom_mode.mushroom)
                opponent.grow();
            else if(this.mode === mushroom_mode.plant)
                opponent.shooter();
                
            this.die();
        }
    }
});

/**
 * Класс описывающий снаряды которыми стреляет марио
 * @class Bullet
 * @extends Figure
 * @type {*}
 */
var Bullet = Figure.extend({
    /**
     * @method init
     * @param parent
     */
    init: function(parent) {
        this._super(parent.x + 31, parent.y + 14, parent.level);
        this.parent = parent;
        this.setImage(images.sprites, 191, 366);
        this.setSize(16, 16);
        this.direction = parent.direction;
        this.vy = 0;
        this.life = Math.ceil(2000 / constants.interval);
        this.speed = constants.bullet_v;
        this.vx = this.direction === directions.right ? this.speed : -this.speed;
    },
    /**
     * @method setVelocity
     * @param vx {number} координата X
     * @param vy {number} координата Y
     */
    setVelocity: function(vx, vy) {
        this._super(vx, vy);
    
        if(this.vx === 0) {
            var s = this.speed * Math.sign(this.speed);
            this.vx = this.direction === directions.right ? -s : s;
        }
        
        if(this.onground)
            this.vy = constants.bounce;
    },
    /**
     * Движение снаряда
     * @method move
     */
    move: function() {
        if(--this.life)
            this._super();
        else
            this.die();
    },
    /**
     * Столкновение с врагом
     * @method hit
     * @param opponent
     */
    hit: function(opponent) {
        if(!(opponent instanceof Mario)) {
            opponent.die();
            this.die();
        }
    }
});

/**
 * Описывает героя
 * @class Hero
 * @extends Figure
 * @type {*}
 */
var Hero = Figure.extend({
    init: function(x, y, level) {
        this._super(x, y, level);
    }
});

/**
 * Класс создающий и описывающий марио
 * @class Mario
 * @extends Hero
 * @type {*}
 */
var Mario = Hero.extend({
    /**
     * @method init
     * @param x {number}  координата X
     * @param y {number}  координата Y
     * @param level
     */
    init: function(x, y, level) {
        this.standSprites = [
            [[{ x : 0, y : 81},{ x: 481, y : 83}],[{ x : 81, y : 0},{ x: 561, y : 83}]],
            [[{ x : 0, y : 162},{ x: 481, y : 247}],[{ x : 81, y : 243},{ x: 561, y : 247}]]
        ];
        this.crouchSprites = [
            [{ x : 241, y : 0},{ x: 161, y : 0}],
            [{ x : 241, y : 162},{ x: 241, y : 243}]
        ];
        this.deadly = 0;
        this.invulnerable = 0;
        this.width = 80;
        this._super(x, y, level);
        this.blinking = 0;
        this.setOffset(-24, 0);
        this.setSize(80, 80);
        this.cooldown = 0;
        this.setMarioState(mario_states.normal);
        this.setLifes(constants.start_lives);
        this.setCoins(0);
        this.deathBeginWait = Math.floor(700 / constants.interval);
        this.deathEndWait = 0;
        this.deathFrames = Math.floor(600 / constants.interval);
        this.deathStepUp = Math.ceil(200 / this.deathFrames);
        this.deathDir = 1;
        this.deathCount = 0;
        this.direction = directions.right;
        this.setImage(images.sprites, 81, 0);
        this.crouching = false;
        this.fast = false;
    },
    /**
     * @method setMarioState
     * @param state
     */
    setMarioState: function(state) {
        this.marioState = state;
    },
    /**
     * @method setState
     * @param state
     */
    setState: function(state) {
        if(state !== this.state) {
            this.setMarioState(mario_states.normal);
            this._super(state);
        }
    },
    /**
     * @method setPosition
     * @param x {number} координата X
     * @param y {number} координата Y
     */
    setPosition: function(x, y) {
        this._super(x, y);
        var r = this.level.width - 640;
        var w = (this.x <= 210) ? 0 : ((this.x >= this.level.width - 230) ? r : r / (this.level.width - 440) * (this.x - 210));        
        this.level.setParallax(w);

        if(this.onground && this.x >= this.level.width - 128)
            this.victory();
    },
    /**
     * Обработка нажатий кнопок на клавиатуре и соответствующие движения марио
     * @method input
     * @param keys
     */
    input: function(keys) {
        this.fast = keys.accelerate;
        this.crouching = keys.down;
        
        if(!this.crouching) {
            if(this.onground && keys.up)
                this.jump();
                
            if(keys.accelerate && this.marioState === mario_states.fire)
                this.shoot();
                
            if(keys.right || keys.left)
                this.walk(keys.left, keys.accelerate);
            else
                this.vx = 0;
        }
    },
    /**
     * Описание победы
     * @method victory
     */
    victory: function() {
        this.clearFrames();
        this.view.show();
        this.setImage(images.sprites, this.state === size_states.small ? 241 : 161, 81);
        this.level.next();
    },
    /**
     * Стрельба и CD
     * @method shoot
     */
    shoot: function() {
        if(!this.cooldown) {
            this.cooldown = constants.cooldown;
            new Bullet(this);
        }
    },
    /**
     * @method setVelocity
     * @param vx {number} координата X
     * @param vy {number} координата Y
     */
    setVelocity: function(vx, vy) {
        if(this.crouching) {
            vx = 0;
            this.crouch();
        } else {
            if(this.onground && vx > 0)
                this.walkRight();
            else if(this.onground && vx < 0)
                this.walkLeft();
            else
                this.stand();
        }
    
        this._super(vx, vy);
    },
    /**
     * Марио больше
     * @method grow
     */
    grow: function() {
        if(this.state === size_states.small) {
            this.setState(size_states.big);
        }
    },
    /**
     * Стрелок
     * @method shooter
     */
    shooter: function() {
        if(this.state === size_states.small)
            this.grow();
            
        this.setMarioState(mario_states.fire);
    },
    /**
     * @method walk
     * @param reverse
     * @param fast
     */
    walk: function(reverse, fast) {
        this.vx = constants.walking_v * (fast ? 2 : 1) * (reverse ? - 1 : 1);
    },
    /**
     * @method walkRight
     */
    walkRight: function() {
        if(this.state === size_states.small) {
            if(!this.setupFrames(8, 2, true, 'WalkRightSmall'))
                this.setImage(images.sprites, 0, 0);
        } else {
            if(!this.setupFrames(9, 2, true, 'WalkRightBig'))
                this.setImage(images.sprites, 0, 243);
        }
    },
    /**
     * @method walkLeft
     */
    walkLeft: function() {
        if(this.state === size_states.small) {
            if(!this.setupFrames(8, 2, false, 'WalkLeftSmall'))
                this.setImage(images.sprites, 80, 81);
        } else {
            if(!this.setupFrames(9, 2, false, 'WalkLeftBig'))
                this.setImage(images.sprites, 81, 162);
        }
    },
    /**
     * @method stand
     */
    stand: function() {
        var coords = this.standSprites[this.state - 1][this.direction === directions.left ? 0 : 1][this.onground ? 0 : 1];
        this.setImage(images.sprites, coords.x, coords.y);
        this.clearFrames();
    },
    /**
     * @method crouch
     */
    crouch: function() {
        var coords = this.crouchSprites[this.state - 1][this.direction === directions.left ? 0 : 1];
        this.setImage(images.sprites, coords.x, coords.y);
        this.clearFrames();
    },
    /**
     * @method jump
     */
    jump: function() {
        this.vy = constants.jumping_v;
    },
    /**
     * @method move
     */
    move: function() {
        this.input(keys);        
        this._super();
    },
    /**
     * Увеличениее счетчика монет
     * @method addCoin
     */
    addCoin: function() {
        this.setCoins(this.coins + 1);
    },
    /**
     * @method playFrame
     */
    playFrame: function() {        
        if(this.blinking) {
            if(this.blinking % constants.blinkfactor === 0)
                this.view.toggle();
            this.blinking--;
        }
        
        if(this.cooldown)
            this.cooldown--;
        
        if(this.deadly)
            this.deadly--;
        
        if(this.invulnerable)
            this.invulnerable--;
        this._super();
    },
    /**
     * @method setCoins
     * @param coins
     */
    setCoins: function(coins) {
        this.coins = coins;
        
        if(this.coins >= constants.max_coins) {
            this.addLife()
            this.coins -= constants.max_coins;
        }
                
        this.level.world.parent().children('#coinNumber').text(this.coins);
    },
    /**
     * Добавление жизни
     * @method addLife
     */
    addLife: function() {
        this.setLifes(this.lifes + 1);
    },
    /**
     * @method setLifes
     * @param lifes
     */
    setLifes : function(lifes) {
        this.lifes = lifes;
        this.level.world.parent().children('#liveNumber').text(this.lifes);
    },
    /**
     * Не окончательная смерть
     * @method death
     * @returns {*}
     */
    death: function() {
        if(this.deathBeginWait) {
            this.deathBeginWait--;
            return true;
        }
        
        if(this.deathEndWait)
            return --this.deathEndWait;
        
        this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + (this.deathDir > 0 ? this.deathStepUp : this.deathStepDown) + 'px' });
        this.deathCount += this.deathDir;
        
        if(this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if(this.deathCount === 0)
            this.deathEndWait = Math.floor(1800 / constants.interval);
            
        return true;
    },
    /**
     * Окончательная смерть
     * @method die
     */
    die: function() {
        this.setMarioState(mario_states.normal);
        this.deathStepDown = Math.ceil(240 / this.deathFrames);
        this.setupFrames(9, 2, false);
        this.setImage(images.sprites, 81, 324);;
        this._super();
    },
    /**
     * Ранение, сброс бонусов
     * @method hurt
     * @param from
     */
    hurt: function(from) {
        if(this.deadly)
            from.die();
        else if(this.invulnerable)
            return;
        else if(this.state === size_states.small) {
            this.die();
        } else {
            this.invulnerable = Math.floor(constants.invulnerable / constants.interval);
            this.blink(Math.ceil(this.invulnerable / (2 * constants.blinkfactor)));
            this.setState(size_states.small);
        }
    }
}, 'mario');

/**
 * @class Enemy
 * @extends Figure
 * @type {*}
 */
var Enemy = Figure.extend({
    /**
     * @method init
     * @param x {number} координата X
     * @param y {number} координата Y
     * @param level
     */
    init: function(x, y, level) {
        this._super(x, y, level);
        this.speed = 0;
    },
    /**
     * @method hide
     */
    hide: function() {
        this.invisible = true;
        this.view.hide();
    },
    /**
     * @method show
     */
    show: function() {    
        this.invisible = false;
        this.view.show();
    },
    /**
     * @method move
     */
    move: function() {
        if(!this.invisible) {
            this._super();
        
            if(this.vx === 0) {
                var s = this.speed * Math.sign(this.speed);
                this.setVelocity(this.direction === directions.right ? -s : s, this.vy);
            }
        }
    },
    /**
     * Просчет столкновений
     * @method collides
     * @param is
     * @param ie
     * @param js
     * @param je
     * @param blocking
     * @returns {*}
     */
    collides: function(is, ie, js, je, blocking) {
        if(this.j + 1 < this.level.getGridHeight()) {
            for(var i = is; i <= ie; i++) {
                if(i < 0 || i >= this.level.getGridWidth())
                    return true;
                    
                var obj = this.level.obstacles[i][this.j + 1];
                
                if(!obj || (obj.blocking & ground_blocking.top) !== ground_blocking.top)
                    return true;
            }
        }
        
        return this._super(is, ie, js, je, blocking);
    },
    /**
     * @method setSpeed
     * @param v
     */
    setSpeed: function(v) {
        this.speed = v;
        this.setVelocity(-v, 0);
    },
    /**
     * Смерть
     * @method hurt
     * @param from
     */
    hurt: function(from) {
        this.die();
    },
    /**
     * Урон
     * @method hit
     * @param opponent
     */
    hit: function(opponent) {
        if(this.invisible)
            return;
            
        if(opponent instanceof Mario) {
            if(opponent.vy < 0 && opponent.y - opponent.vy >= this.y + this.state * 32) {
                opponent.setVelocity(opponent.vx, constants.bounce);
                this.hurt(opponent);
            } else {
                opponent.hurt(this);
            }
        }
    }
});

/**
 * Первоначальный враг
 * @class Gumpa
 * @extends Enemy
 * @type {*}
 */
var Gumpa = Enemy.extend({
    init: function(x, y, level) {
        this._super(x, y, level);
        this.setSize(34, 32);
        this.setSpeed(constants.ballmonster_v);
        this.death_mode = death_modes.normal;
        this.deathCount = 0;
    },
    /**
     * @method setVelocity
     * @param vx {number} координата X
     * @param vy {number} координата Y
     */
    setVelocity: function(vx, vy) {
        this._super(vx, vy);
        
        if(this.direction === directions.left) {
            if(!this.setupFrames(6, 2, false, 'LeftWalk'))
                this.setImage(images.enemies, 34, 188);
        } else {
            if(!this.setupFrames(6, 2, true, 'RightWalk'))
                this.setImage(images.enemies, 0, 228);
        }
    },
    /**
     * @method death
     * @returns {*}
     */
    death: function() {
        if(this.death_mode === death_modes.normal)
            return --this.deathCount;
        
        this.view.css({ 'bottom' : (this.deathDir > 0 ? '+' : '-') + '=' + this.deathStep + 'px' });
        this.deathCount += this.deathDir;
        
        if(this.deathCount === this.deathFrames)
            this.deathDir = -1;
        else if(this.deathCount === 0)
            return false;
            
        return true;
    },
    /**
     * @method die
     */
    die: function() {
        this.clearFrames();
        
        if(this.death_mode === death_modes.normal) {
            this.setImage(images.enemies, 102, 228);
            this.deathCount = Math.ceil(600 / constants.interval);
        } else if(this.death_mode === death_modes.shell) {
            this.setImage(images.enemies, 68, this.direction === directions.right ? 228 : 188);
            this.deathFrames = Math.floor(250 / constants.interval);
            this.deathDir = 1;
            this.deathStep = Math.ceil(150 / this.deathFrames);
        }
        
        this._super();
    }
}, 'ballmonster');

/**
 * Запуск всего и всея
 * @module Start
 */
$(document).ready(function() {
    var level = new Level('world');
    level.load(definedLevels[0]);
    level.start();
    keys.bind();
});
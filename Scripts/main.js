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
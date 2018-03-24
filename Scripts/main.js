/**
 * ������� �����, ��������� ���������������� �������,
 * ������������� � �������� �������,
 * ������������� � �������� ����������� � ������,
 * �������� ��� ������ � �������.
 *
 * @module �������� ������
 * @class Base
 * @extends Class
 */
 var Base = Class.extend({
    /**
     * �������������
     * @method init
     * @param x {number} X ����������
     * @param y {number} Y ����������
    */
    init: function(x, y) {
        this.setPosition(x || 0, y || 0);
        this.clearFrames();
        this.frameCount = 0;
    },
    /**
     * ��������� ������� �������
     * @method setPosition
     * @param x {number} X ����������
     * @param y {number} Y ����������
     */
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },
    /**
     * ��������� ������� �������
     * @method getPosition
     * @return {number, number} ���������� �������
     */
    getPosition: function() {
        return { x : this.x, y : this.y };
    },
    /**
     * ��������� �����������
     * @method setImage
     * @param img {String} ���� � �����������
     * @param x {number} X ����������
     * @param y {number} Y ����������
     */
    setImage: function(img, x, y) {
        this.image = {
            path : img,
            x : x,
            y : y
        };
    },
    /**
     * ��������� ������� �����������
     * @method setSize
     * @param width {number} ������ �����������
     * @param height {number} ������ �����������
     */
    setSize: function(width, height) {
        this.width = width;
        this.height = height;
    },
    /**
     * ��������� ������� �����������
     * @method getSize
     * @return {number, number} ������ � ������ �����������
     */
    getSize: function() {
        return { width: this.width, height: this.height };
    },
    /**
     * ��������� ��� ������(������ � �������)
     * @method setupFrames
     * @param fps {number} ����� � �������
     * @param frames {number} �����
     * @param rewind {number} ���������
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
     * ��������� ��� ������(��������� ������)
     * @method clearFrames
     */
    clearFrames: function() {
        this.frameID = undefined;
        this.frames = 0;
        this.currentFrame = 0;
        this.frameTick = 0;
    },
    /**
     * ������������ � �������� ������
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
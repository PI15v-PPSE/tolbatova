/**
 * ��������� ����������
 * @module ����������
 * @type {{bind: Function, reset: Function, unbind: Function, handler: Function, accelerate: boolean, left: boolean, up: boolean, right: boolean, down: boolean}}
 * @class keys
 */
var keys = {
    /**
     * ����� � �����������
     * @method bind
     * @return {handler} ���������� ��� ����������
     */
    bind : function() {
        $(document).on('keydown', function(event) {
            return keys.handler(event, true);
        });
        $(document).on('keyup', function(event) {
            return keys.handler(event, false);
        });
    },
    /**
     * ����� ������� ������
     * @method reset
     */
    reset : function() {
        keys.left = false;
        keys.right = false;
        keys.accelerate = false;
        keys.up = false;
        keys.down = false;
    },
    /**
     * ������� ������
     * @method unbind
     */
    unbind : function() {
        $(document).off('keydown');
        $(document).off('keyup');
    },
    /**
     * ���������� ��� ����������, ��������� ������
     * @method handler
     * @param event �������
     * @param status ������ �������
     * @returns {boolean}
     */
    handler : function(event, status) {
        switch(event.keyCode) {
            case 17://CTRL
                keys.accelerate = status;
                break;
            case 40://DOWN ARROW
                keys.down = status;
                break;
            case 39://RIGHT ARROW
                keys.right = status;
                break;
            case 37://LEFT ARROW
                keys.left = status;
                break;
            case 38://UP ARROW
                keys.up = status;
                break;
            default:
                return true;
        }
            
        event.preventDefault();
        return false;
    },
    accelerate : false,
    left : false,
    up : false,
    right : false,
    down : false
};
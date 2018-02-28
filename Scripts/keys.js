/**
 * ��������� ����������
 * @module ����������
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
    accelerate : false,
    left : false,
    up : false,
    right : false,
    down : false
};
/**
 * Обработка клавиатуры
 * @module Клавиатура
 * @class keys
 */
 var keys = {
    /**
     * Связь с клавиатурой
     * @method bind
     * @return {handler} обработчик для клавиатуры
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
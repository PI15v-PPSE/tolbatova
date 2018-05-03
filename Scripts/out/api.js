YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Base",
        "BrownBlock",
        "Bullet",
        "Class",
        "Coin",
        "CoinBox",
        "CoinBoxCoin",
        "Constants",
        "Decoration",
        "Enemy",
        "Figure",
        "Gauge",
        "Gumpa",
        "Hero",
        "Item",
        "ItemFigure",
        "LeftPipe",
        "LeftTopPipe",
        "Level",
        "Levels",
        "Mario",
        "Matter",
        "Mushroom",
        "MushroomBox",
        "RightPipe",
        "RightTopPipe",
        "Soil",
        "Stone",
        "TopGrass",
        "ground",
        "keys"
    ],
    "modules": [
        "Start",
        "Клавиатура",
        "Константы",
        "ООП",
        "Основные классы",
        "Уровни"
    ],
    "allModules": [
        {
            "displayName": "Start",
            "name": "Start",
            "description": "Запуск всего и всея"
        },
        {
            "displayName": "Клавиатура",
            "name": "Клавиатура",
            "description": "Обработка клавиатуры"
        },
        {
            "displayName": "Константы",
            "name": "Константы",
            "description": "Константы необходимые для работы игры"
        },
        {
            "displayName": "ООП",
            "name": "ООП",
            "description": "Реализация удобного ООП для JS"
        },
        {
            "displayName": "Основные классы",
            "name": "Основные классы",
            "description": "Базовый класс, позволяет инициализировать объекты,\nустанавливать и получать позицию,\nустанавливать и получать изображение и размер,\nсодержит всю работу с экраном."
        },
        {
            "displayName": "Уровни",
            "name": "Уровни",
            "description": "Структура объекта содержащего все необходимое для конструирования уровня\nFORMAT OF A LEVEL FOR JSON SERIALIZATION:\n{\nheight: int,\nwidth: int,\nid: int,\nbackground: int,\ndata: array[array]\n}"
        }
    ]
} };
});
// Original JavaScript code by Chirp Internet: www.chirp.com.au
// Please acknowledge use of this code by including this header.
var CardGame = function (targetId) {
    // private variables

    var cards = []; // 前 8 張是題目卡，後 8 張是答案卡
    var cards_num = 8;
    var is_deal = false;
    var card_value = [];
    var question1 = ["1C", "2C", "3C", "4C", "5C", "6C", "7C", "8C"]
    var answer1 = ["1H", "2H", "3H", "4H", "5H", "6H", "7H", "8H"]
    var question2 = ["9C", "10C", "11C", "12C", "13C", "14C", "15C", "16C"]
    var answer2 = ["9H", "10H", "11H", "12H", "13H", "14H", "15H", "16H"]

    var matches_found = 0;
    var card1 = false,
        card2 = false;
    var clickable = [];

    //隱藏卡片
    var hideCard = function (id) // turn card face down
    {
        setTimeout(function () {
            clickable.pop(id);
        }, 500);
        if (id < cards_num)
            cards[id].firstChild.src = "./images/back.png";
        else
            cards[id].firstChild.src = "./images/back.png";
        with (cards[id].style) {
            WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(0deg)";
        }
    };

    var moveToPack = function (id) // move card to pack
    {
        hideCard(id);
        cards[id].clicked = true;
        if (id < cards_num)
            with (cards[id].style) {
                zIndex = "1000";
                top = "15px";
                left = "15px";
                WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
                zIndex = "0";
            }
        else
            with (cards[id].style) {
                zIndex = "1000";
                top = "15px";
                left = 15 + window.innerWidth / 4 + "px";
                WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
                zIndex = "0";
            }
    };


    var moveToPlace = function (id) // deal card
    {
        setTimeout(function () {
            clickable.push(id);
        }, 500);

        cards[id].clicked = false;
        with (cards[id].style) {
            zIndex = "1000";
            top = cards[id].fromtop + "px";
            left = cards[id].fromleft + "px";
            WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
            zIndex = "0";
        }
    };
    //dolist:點擊之後
    var showCard = function (id) // turn card face up, check for match
    {
        clickable.splice($.inArray(id, clickable), 1);
        if (id === card1) return;
        if (cards[id].clicked) return;
        cards[id].className = "game-card";
        cards[id].firstChild.src = "./images/" + card_value[id] + ".png";

        if (card1 !== false) {
            card2 = id;
            for (i = 0; i < cards_num; i++) {
                if (i == card2)
                    continue
                (function (idx) {
                    setTimeout(function () {
                        moveToPack(idx + cards_num);
                    }, idx * 100);
                })(i);
            }
            console.log(parseInt(card_value[card1]));
            console.log(parseInt(card_value[card2]));
            if (parseInt(card_value[card1]) == parseInt(card_value[card2])) { // match found

                if (++matches_found == 2) { // game over, reset
                    matches_found = 0;
                    is_deal = true;
                    for (i = 0; i < cards_num; i++) {
                        (function (idx) {
                            setTimeout(function () {
                                moveToPack(idx);
                            }, idx * 100);
                        })(i);
                    }
                    setTimeout(function () {
                        is_deal = false;
                    }, i * 100);
                    setTimeout(function () {
                        alertify.confirm('保留這個畫面來兌換獎品吧！').set({
                            title: '恭喜完成闖關',
                            labels: { ok: '重新開始', cancel: '查看解析' },
                            closable: false,
                            onok: function (event) {
                                card1 = card2 = false;
                                cards_num = 8;
                                startCard();
                                deal();
                            },
                            oncancel: function (event) {
                                window.location = './explain.html';
                            }

                        });
                    }, cards_num * 100);
                }
                else {
                    alertify.alert('繼續挑戰下一關吧').set({
                        title: '恭喜！答對了',
                        label: '下一關',
                        closable: false,
                        onok: function (event) {
                            moveToPack(card1);
                            moveToPack(card2);
                            card1 = card2 = false;
                            startCard();
                            deal();

                        },
                    });
                }
            } else { // no match
                alertify.alert('再重新抽一次題目吧').set({
                    title: '哎呀！答錯了',
                    label: '重新開始',
                    closable: false,
                    onok: function (event) {
                        moveToPack(card1);
                        moveToPack(card2);
                        card1 = card2 = false;
                        //startCard();
                        setTimeout(function () {
                            deal();
                        }, 500);
                    },
                });
            }
        } else { // first card turned over
            card1 = id;
            is_deal = true;
            for (i = 0; i < cards_num; i++) {
                if (i == id) {
                    continue;
                }
                (function (idx) {
                    setTimeout(function () {
                        moveToPack(idx);
                    }, idx * 100);
                })(i);
            }
            setTimeout(function () {
                is_deal = false;
            }, i * 100);
            with (cards[id].style) {
                //WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.8)";
                top = "15px";
                left = 15 + window.innerWidth / 4 * 2 + "px";
            }
            setTimeout(function () {
                deal_answer();
            }, (cards_num + 1) * 100);

        }
    };

    //點擊第一張之後亂數決定卡片位置
    var cardClick = function (id) {
        //防止連點或動畫中點擊
        if (is_deal) return;
        if ($.inArray(id, clickable) === -1) return;
        showCard(id);
    };

    //發題目牌
    var deal = function () {
        // shuffle and deal cards
        sort_tmp = []
        if (matches_found == 0)
            sort_tmp = question1;
        else
            sort_tmp = question2;
        sort_tmp.sort(function () {
            return Math.round(Math.random()) - 0.5;
        });
        card_value = sort_tmp;
        is_deal = true;
        for (i = 0; i < cards_num; i++) {
            (function (idx) {
                setTimeout(function () {
                    moveToPlace(idx);
                }, idx * 100);
            })(i);
        }
        setTimeout(function () {
            is_deal = false;
        }, i * 100);

    };

    //發答案牌
    var deal_answer = function () {
        // shuffle and deal cards
        sort_tmp = []
        if (matches_found == 0)
            sort_tmp = answer1;
        else
            sort_tmp = answer2;
        sort_tmp.sort(function () {
            return Math.round(Math.random()) - 0.5;
        });
        card_value = card_value.concat(sort_tmp);
        is_deal = true;
        for (i = 0; i < cards_num; i++) {
            (function (idx) {
                setTimeout(function () {
                    moveToPlace(idx + cards_num);
                    cards[idx + cards_num].firstChild.src = "./images/" + card_value[idx + cards_num] + ".png";
                }, idx * 100);
            })(i);
        }
        setTimeout(function () {
            is_deal = false;
        }, i * 100);
    };

    // initialise 初始化
    var startCard = function () {
        cards = [];
        card_value = []
        $('.card').remove();

        // template for card
        var card = document.createElement("div");
        card.innerHTML = "<img src=\"./images/back.png\">";
        card.className = "game-card";

        // 題目卡
        for (var i = 0; i < cards_num; i++) {
            var newCard = card.cloneNode(true);
            newCard.className = "game-card";
            newCard.fromtop = 15 + window.innerHeight / 4 + window.innerHeight / 4 * Math.floor(i / 4);
            newCard.fromleft = 15 + (window.innerWidth - 30) / 4 * (i % 4);
            (function (idx) {
                newCard.addEventListener("click", function () {
                    cardClick(idx);
                }, false);
            })(i);

            document.body.appendChild(newCard);
            cards.push(newCard);
        }

        // 答案卡
        card.innerHTML = "<img src=\"./images/back.png\">";
        for (var i = 0; i < cards_num; i++) {
            var newCard = card.cloneNode(true);
            newCard.className = "game-card";
            with (newCard.style) {
                left = 15 + window.innerWidth / 4 + "px";
            }
            newCard.fromtop = 15 + window.innerHeight / 4 + window.innerHeight / 4 * Math.floor(i / 4);
            newCard.fromleft = 15 + (window.innerWidth - 30) / 4 * (i % 4);
            (function (idx) {
                newCard.addEventListener("click", function () {
                    cardClick(idx + cards_num);
                }, false);
            })(i);

            document.body.appendChild(newCard);
            cards.push(newCard);
        }

    };

    alertify.alert('駭，你好！', '<div>請根據卡牌上的題目找到相對應的答案！</br>遊玩說明：</br>先抽一張題目卡，再找出對應的答案卡</br></br> <img style="height:20vh;" src="images/back.png"> <img style="height:20vh;" src="images/front.png"> </div>').set({
        label: '開始',
        closable: false,
        onok: function (closeEvent) {
            deal();
        }
    });

    startCard();
};
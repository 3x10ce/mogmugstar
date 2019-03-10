
// タイトルシーン
const scenes = {
    title: function () {
        const scene = new Scene();

        // ダミーラベル　一度ラベルテキストを表示しないとフォントが読み込まれないため
        const dummylabel = createLabel('.', -30, 0);

        const bgstars = new Group();
        const logo = sprites.title_logo();
        const logo_posY = logo.y;
        logo.y = -60;
        logo.tl.moveY(logo_posY, sec(1.5), enchant.Easing.QUART_EASEOUT);
        
        const startLabel = createCLabel('[ START ]', 250);
        startLabel.setFontsize(18);
        startLabel.x = 30;
        startLabel.width = 120;
        startLabel.addEventListener('touchstart', function() {
            game.replaceScene(scenes.game());
        })
        
        const manualLabel = createLabel('ゲーム説明', 20, game.height - 30);
        manualLabel.width = game.width / 2 - 20;
        manualLabel.addEventListener('touchstart', function() {
            scene.addChild(groups.manualScreen());
        })
        const creditLabel = createLabel('クレジット', game.width / 2, game.height - 30);
        creditLabel.width = game.width / 2 - 20;
        creditLabel.textAlign = 'right';
        creditLabel.addEventListener('touchstart', function() {
            scene.addChild(groups.creditScreen());
        })
        
        scene.addChild(dummylabel);
        scene.addChild(bgstars);
        scene.addChild(sprites.tsumugu_title());
        scene.addChild(logo);
        scene.addChild(startLabel);
        scene.addChild(manualLabel);
        scene.addChild(creditLabel);
        scene.backgroundColor = '#a3a7f7';
        
        scene.addEventListener('enterframe', function() {
            if (this.age % 5 == 0) bgstars.addChild(sprites.star());
        });

        return scene;
    },

    game: function() {
        const scene = new Scene;
        const tsumugu = sprites.tsumugu_player();
        let stars = [];
        const starGrp = new Group();
        const scoreLabel = createLabel('SCORE:', 8, 8);
        const timeLabel = createLabel('TIME:', 8, 20);
        scene.timeRemain = sec(30) - 1;

        scene.orient = {X: 0, Y: 0, Z: 0};
        scene.orient_origin = {X: 0, Y: 0, Z: 0};
        scene.calibrated = false;
        scene.gameEnded = false;

        scene.backgroundColor = '#a3a7f7';
        scene.addChild(tsumugu);
        scene.addChild(starGrp);
        scene.addChild(scoreLabel);
        scene.addChild(timeLabel);
        scene.addChild(groups.calibrater());

        scene.score = 0;
        scene.combo = 0;
        scene.comboTime = 0;

        const backToTitle = function() {
            if (game.assets['./assets/game.mp3']._state) {
                game.assets['./assets/game.mp3'].stop();
            }
            game.replaceScene(scenes.title());
            window.removeEventListener('deviceorientation', onDeviceOrientation);
        };

        scene.addEventListener('enterframe', function() {
            scoreLabel.text = `SCORE: ${this.score}`;
            timeLabel.text = `TIME: ${Math.floor(this.timeRemain / game.fps) + 1}`

            // キャリブレーション後、ゲーム開始
            if (this.calibrated ) {

                // スターを湧かせる
                if (this.age % 5 == 0) {
                    const star = sprites.star();
                    starGrp.addChild(star);
                    stars.push(star);
                }
                
                if (this.gameEnded) return;

                // 時間切れで終了
                if (this.timeRemain < 0) {
                    this.gameEnded = true;
                    this.addChild(groups.resultScreen(this.score));

                } else {
                    this.timeRemain--;
                    this.comboTime--;
                    if (this.comboTime === 0) this.combo = 0;

                    // つむぐとスターの当たり判定チェック
                    const _scene = this;
                    tsumugu.mouthOpened = false;
                    stars = stars.reduce(function(p, c) {
                        
                        // スターが死んでたら何もしない
                        if (c.dead) return p;

                        // もぐむぐできるスターを消し、スコア処理
                        if (tsumugu.isMogmogable(c)) {
                            game.assets['./assets/mog.mp3'].clone().play();
                            c.dead = 1;
                            starGrp.removeChild(c);
                            let addScore = 100;
                            if (c.age < sec(2)) {
                                addScore += Math.floor(100 * (sec(2) - c.age) / sec(2));
                            }
                            addScore *= ++_scene.combo;
                            _scene.comboTime = sec(1);

                            _scene.score += addScore;
                            return p;
                        } else if (tsumugu.isWillBeMogmogable(c)) {
                            tsumugu.mouthOpened = true;
                        }

                        // 何にもなかったスターは生きながらえる
                        return p.concat(c);
                    }, []);
                }
            }
        });

        // デバイスの傾きを取得
        const onDeviceOrientation = function(event) {
            // orient:
            // X : 前後方向の傾き 前に倒すと＋　後ろに倒すとー
            // Y : 左右方向の傾き　右に倒すと＋　左に倒すとー
            // Z : 回転方向
            scene.orient_origin = {
                X: Math.floor(event.beta * 100) / 100,
                Y: Math.floor(event.gamma * 100) / 100,
                Z: Math.floor(event.alpha * 100) / 100
            };

            if (scene.calibrated) {
                scene.orient = scene.orient_origin;
            }
        };

        window.addEventListener('deviceorientation', onDeviceOrientation);

        // タッチでゲームタイトルに戻る
        // scene.addEventListener('touchstart', backToTitle);



        return scene;
    }
}
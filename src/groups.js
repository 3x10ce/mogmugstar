
const groups = {
    // まにゅある
    manualScreen: function () {
        const grp = new Group();
        const bg = sprites.bgBlack();
        bg.opacity = 0.5;

        const captionLabel = createCLabel('操作説明', 16, '#fff');
        const descriptionLabel = createLabel(
            '端末を傾けることで、つむぐちゃんが上下左右に移動します。うまく動かして、たくさんのスターを食べさせましょう。'
        , 12, 40, '#fff');
        descriptionLabel.width = game.width;

        grp.addChild(bg);
        grp.addChild(captionLabel);
        grp.addChild(descriptionLabel);

        // 推奨環境表示
        grp.addChild(createLabel('推奨環境', 12, 140, '#fff'));
        grp.addChild(createLabel('iOS 12.0 以上 の Safari', 24, 156, '#fff'));
        grp.addChild(createLabel('Android 5.0 以上の Chrome', 24, 172, '#fff'));

        // 諸注意
        grp.addChild(createLabel('* PCには対応していないよ', 16, 220, '#fff'));
        grp.addChild(createLabel('* 縦画面に向きを固定してね', 16, 236, '#fff'));
        grp.addChild(createLabel('* 音が出るので注意してね', 16, 252, '#fff'));

        // もどる
        grp.addChild(createCLabel('タップしてもどる', 280, '#fff'));

        // タップで消える
        grp.addEventListener('touchstart', function () {
            this.parentNode.removeChild(this);
        });
        return grp;
    },
    // くれぢっと
    creditScreen: function () {
        const grp = new Group();
        const bg = sprites.bgBlack();
        bg.opacity = 0.5;

        grp.addChild(bg);

        // クレジット
        grp.addChild(createCLabel('クレジット', 16, '#fff'));

        grp.addChild(createLabel('プログラム', 8, 40, '#fff'));
        grp.addChild(createLabel('うむー(@umux_24)', 24, 56, '#fff'));
        grp.addChild(createLabel('ドット絵', 8, 80, '#fff'));
        grp.addChild(createLabel('うむー(@umux_24)', 24, 96, '#fff'));
        grp.addChild(createLabel('音楽', 8, 120, '#fff'));
        grp.addChild(createLabel('甘茶の音楽工房 さま', 24, 136, '#fff'));
        grp.addChild(createLabel('効果音', 8, 160, '#fff'));
        grp.addChild(createLabel('効果音ラボ さま', 24, 176, '#fff'));

        // ゲームのことはいいからつむぐちゃんをすこって
        const tsumuguwosukore = function () {
            location.href = 'https://twitter.com/KakuriyoTsumugu';
        }
        grp.addChild(createLabel('SpecialThanks', 8, 220, '#fff'));
        const tsumuguLabel = createLabel('幽世つむぐ さま', 24, 236, '#fff');
        const tsumuguTwitter = createLabel('(@KakuriyoTsumugu)', 24, 252, '#fff');
        tsumuguLabel.addEventListener('touchstart', tsumuguwosukore);
        tsumuguTwitter.addEventListener('touchstart', tsumuguwosukore);
        grp.addChild(tsumuguLabel);
        grp.addChild(tsumuguTwitter);
        

        // もどる
        grp.addChild(createCLabel('タップしてもどる', 280, '#fff'));

        // タップで消える
        grp.addEventListener('touchstart', function () {
            this.parentNode.removeChild(this);
        });
        return grp;

    },

    // キャリブレーションするUIと機能を実装
    calibrater: function () {
        const label = createCLabel("キャリブレーション", 40);
        label.color = '#fff';
        const description = createCLabel("端末を地面に対し 水平な姿勢にしてください", 80);
        description.color = '#fff';
        const progress = createCLabel("0 ％", 220);
        progress.color = '#888';
        const bg = sprites.bgBlack();
        bg.opacity = 0.5;

        const grp = new Group();
        grp.addChild(bg);
        grp.addChild(label);
        grp.addChild(description);
        grp.addChild(progress);
        
        // 水平近辺を維持できたTick数と、キャリブレーション成功とする目標Tick数
        let keepTicks = 0;
        const calibrateTicks = sec(3);

        // progress表示用Ticks keepTicksがこれを超えたら 表示するパーセンテージが変動し始める
        const progressStartTicks = calibrateTicks / 2;

        grp.addEventListener('enterframe', function () {
            const _grp = this;

            // 表示する進捗割合
            let progressTicks = 
                keepTicks > progressStartTicks
                     ? Math.floor(100 * (keepTicks - progressStartTicks) / (calibrateTicks - progressStartTicks))
                     : 0;

            // キャリブレーション
            // なんとなくの実装
            // X=0, Y=0 近辺が一定秒数保たれればOKとする
            if (!this.parentNode.calibrated) {
                const differences = [
                    Math.abs(this.parentNode.orient_origin.X),
                    Math.abs(this.parentNode.orient_origin.Y)
                ];
                
                const overSloped = differences.some(function(c) { return c > 5 })

                keepTicks = overSloped ? 0 : keepTicks + 1;
                
                progress.text = 
                    progressTicks === 0 ? 'KEEP IT' : `${progressTicks} ％`;
                progress.color = 
                    overSloped ? '#888' : '#fff';

                if ( keepTicks > calibrateTicks) {

                    if (!game.assets['./assets/game.mp3']._state) {
                        game.assets['./assets/game.mp3'].play();
                    }

                    game.assets['./assets/game.mp3'].src.loop = true;

                    this.parentNode.calibrated = true;

                    this.childNodes.map( (function(e) {
                        e.tl.fadeOut(game.fps, enchant.Easing.QUAD_EASEIN)
                        .then(function() {
                            e.parentNode.removeChild(e);
                        })
                    }))
                }
            } else {
                progress.text = this.age % 4 < 2 ? "OK !" : "";
            }
        });

        return grp;
    },

    resultScreen: function (sc) {
        const grp = new Group();

        // Finishキャプション
        const label = createCLabel('Finish', 124, '#fff');
        label.opacity = 0;
        const bg = sprites.bgBlack();
        bg.y = 130;
        bg.scaleY = 10;
        bg.opacity = 0;
        grp.addChild(bg);
        grp.addChild(label);

        label.tl.fadeIn(sec(1), enchant.Easing.QUAD_EASEOUT)
            .and().moveY(24, sec(1), enchant.Easing.QUAD_EASEOUT);
        bg.tl.fadeTo(0.5, sec(1), enchant.Easing.QUAD_EASEOUT)
            .and().moveY(30, sec(1), enchant.Easing.QUAD_EASEOUT)
            .delay(sec(0.5))
                .scaleTo(bg.scaleX / 2, game.height / 2, sec(0.5), enchant.Easing.QUAD_EASEOUT)
                .and().moveY(game.height / 2, sec(0.5), enchant.Easing.QUAD_EASEOUT);

        // スコア表示
        const scoreLabel = createLabel('SCORE', -60, 65, '#fff');
        grp.addChild(scoreLabel);
        const score = createLabel('0', game.width, 80, '#fff');
        score.textAlign = 'right';
        score.width = 80;
        grp.addChild(score)
        scoreLabel.tl
            .delay(sec(1.5))
                .moveX(32, sec(0.5), enchant.Easing.QUAD_EASEOUT);

        score.tl
            .delay(sec(1.8))
                .moveX(64, sec(0.5), enchant.Easing.QUAD_EASEOUT)
                .repeat(function() {
                    score.text = `${Math.floor(sc * (1 - Math.sqrt(1 - (score.age - sec(2.3)) / sec(1))))}`;
                }, sec(1));
        
        const tsmgCommentLabel = createLabel('幽世からのささやき', -120, 110, '#fff');
        grp.addChild(tsmgCommentLabel);
        const tsmgComment = createLabel(`${getResultComment()}`, 15, 130, '#fff');
        tsmgComment.width = 155;
        tsmgComment.opacity = 0;
        grp.addChild(tsmgComment);

        tsmgCommentLabel.tl
            .delay(sec(3))
                .moveX(32, sec(0.5), enchant.Easing.QUAD_EASEOUT);
        tsmgComment.tl
            .delay(sec(3.5))
                .fadeIn(sec(0.5), enchant.Easing.QUAD_EASEOUT);
        
        // リトライ/タイトル
        const retryLabel = createLabel("もう1回", 20, 270, '#fff');
        retryLabel.width = 70;
        retryLabel.opacity = 0;
        grp.addChild(retryLabel);
        const titleLabel = createLabel("タイトルへ", 90, 270, '#fff');
        titleLabel.width = 70;
        titleLabel.opacity = 0;
        titleLabel.textAlign = 'right';
        grp.addChild(titleLabel);
        const tweetLabel = createCLabel("スコアをツイート", 240, '#fff');
        tweetLabel.width = 100;
        tweetLabel.x = 40;
        tweetLabel.opacity = 0;
        grp.addChild(tweetLabel);

        retryLabel.addEventListener('touchstart', function () {
            game.replaceScene(scenes.game());
        });
        titleLabel.addEventListener('touchstart', function () {
            if (game.assets['./assets/game.mp3']._state) {
                game.assets['./assets/game.mp3'].stop();
            }
            game.replaceScene(scenes.title());

        });

        tweetLabel.addEventListener('touchstart', function () {
            const twitter_url = 'https://twitter.com/share';
            const site_url = encodeURI('https://mogmug.umuxim.net');
            const hashtag= encodeURI('もぐむぐスター');
            const text = encodeURI(`もぐむぐ... ${sc} ポイント分のスターを贈りました。`);
            const tweet_href = `${twitter_url}?text=${text}&hashtags=${hashtag}&url=${site_url}`;
            
            // window.openがMobile Safariで使えないため、
            // iOS 勢は新規タブでツイート画面がひらけないごめんね…
            if(!window.open(tweet_href, "_blank")){
              window.location.href = tweet_href;
            }
        });

        retryLabel.tl
            .delay(sec(3.5))
                .fadeIn(sec(0.5), enchant.Easing.QUAD_EASEOUT);
        titleLabel.tl
            .delay(sec(3.5))
                .fadeIn(sec(0.5), enchant.Easing.QUAD_EASEOUT);
        tweetLabel.tl
            .delay(sec(3.5))
                .fadeIn(sec(0.5), enchant.Easing.QUAD_EASEOUT);

        return grp;
    }
}
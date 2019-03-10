
const sprites = {

    // 黒背景兄貴
    bgBlack: function() {
        const bg = new Sprite(2, 2);
        bg.image = game.assets['./assets/b1p.png'];
        bg.scaleX = game.width;
        bg.scaleY = game.height;
        bg.x = game.width / 2;
        bg.y = game.height / 2;
        bg.backgroundColor = '#000';

        return bg;
    },

    // つむぐちゃんしゅき・・・・・・・・・・・・・・・・・・
    tsumugu: function () {
        const tsumugu = new Sprite(48, 64);
        tsumugu.image = game.assets['./assets/tsumugu.png'];
        tsumugu.x = 0;
        tsumugu.y = 0;

        // つむぐのおくちはこのあたり…？
        tsumugu.mouthPos = function () {
            return {
                x: 22 + tsumugu.x,
                y: 30 + tsumugu.y,
                width: 4,
                height: 2
            };
        };

        // もぐもぐチェック（当たり判定処理）
        tsumugu.isMogmogable = function (object) {
            const mouthPos = tsumugu.mouthPos();
            
            return intersect(mouthPos, object);
        }

        tsumugu.isWillBeMogmogable = function(object) {
            const mouthNearPos = tsumugu.mouthPos();
            mouthNearPos.x -= 16; mouthNearPos.y -= 24;
            mouthNearPos.width += 32; mouthNearPos.height += 56;
            
            return intersect(mouthNearPos, object)
        }
        
        
        tsumugu.mouthOpened = false;
        tsumugu.addEventListener('enterframe', function () {
            this.frame = (this.age / 4) % 4 + (this.mouthOpened ? 4 : 0);
        });
        
        return tsumugu;
    },

    // つむぐ　（タイトルシーン表示用）
    tsumugu_title: function() {

        const tsumugu = sprites.tsumugu();
        tsumugu.x = (game.width - tsumugu.width) / 2;
        tsumugu.y = 160;

        tsumugu.addEventListener('enterframe', function () {
            this.y = Math.floor(160 + (Math.sin(this.age / 15.0 ) * 8));
        });
        
        return tsumugu;
    },

    // つむぐ　(ゲーム画面)
    tsumugu_player: function() {
        const tsumugu = sprites.tsumugu();
        const SPEED = 1;
        tsumugu.x = (game.width - tsumugu.width) / 2;
        tsumugu.y = (game.height - tsumugu.height) / 2;

        tsumugu.vector = {
            x: 0,
            y: 0
        };

        tsumugu.addEventListener('enterframe', function () {

            // 端末角度に応じて移動する
            if (this.parentNode.orient) {
                const orientX = this.parentNode.orient.X;
                const orientY = this.parentNode.orient.Y;

                // 端末が下を向いているかどうか
                const isUpset = Math.abs(orientX) > 90;

                // Xの移動量計算
                const movesX = Math.sin(orientY * Math.PI / 180) * SPEED * (isUpset ? -1 : 1);
                // Yの移動量計算
                const movesY = Math.sin(orientX * Math.PI / 180) * SPEED;
                
                // 移動方向を決定
                this.vector.x = this.vector.x * 0.99 + movesX;
                this.vector.y = this.vector.y * 0.99 + movesY;
                this.x += this.vector.x;
                this.y += this.vector.y;

                // 境界にぶつかったときのスピード制御
                if ( this.x < 0 ) {
                    this.x = 0;
                    this.vector.x = 0;
                } else if (this.x + this.width > game.width) {
                    this.x = game.width - this.width;
                    this.vector.x = 0;
                }
                
                if ( this.y < 0 ) {
                    this.y = 0;
                    this.vector.y = 0;
                } else if (this.y + this.height > game.height) {
                    this.y = game.height - this.height;
                    this.vector.y = 0;
                }
            }
        });

        return tsumugu;
    },

    // タイトルロゴ
    title_logo: function () {
        const logo = new Sprite(137, 71);
        logo.image = game.assets['./assets/logo.png'];
        logo.x = 21;
        logo.y = 50;

        return logo;
    },

    // スター
    star_base: function(type) {
        const TYPESNUM = 6;

        const star = new Sprite(32, 32);
        star.image = game.assets['./assets/stars.png']
        star.x = 0;
        star.y = 0;
        
        if (typeof type !== 'number' || type < 0 || type >= TYPESNUM) {
            star.frame = Math.floor(Math.random() * TYPESNUM);
        } else {
            star.frame = type;
        }
        
        return star;
    },

    // スターの効果のやつ
    star_particle: function(type) {
        const TYPESNUM = 6;
        const TILLTIME = 20;
        const star = new Sprite(32, 32);
        star.image = game.assets['./assets/stars.png']
        star.x = 0;
        star.y = 0;
        star.scaleX = 0;
        star.scakeY = 0;
        star.speed = Math.random() * 0.4 + 0.5;
        star.angle = Math.random() * Math.PI * 2;

        if (typeof type !== 'number' || type < 0 || type >= TYPESNUM) {
            star.frame = TYPESNUM + Math.floor(Math.random() * TYPESNUM);
        } else {
            star.frame = TYPESNUM + type;
        }

        star.addEventListener('enterframe', function() {
            this.x += this.speed * Math.sin(this.angle);
            this.y += this.speed * Math.cos(this.angle);

            const scale = Math.sin(this.age * Math.PI / TILLTIME) * 0.15;
            this.scaleX = scale;
            this.scaleY = scale;

            if (this.age > TILLTIME) {
                this.parentNode.removeChild(this);
            }
        });

        return star;
    },

    // スター
    star: function(type) {
        const star = sprites.star_base(type);
        star.x = Math.random() * 196 - 16;
        star.y = 360;
        star.rotation = Math.random() * 360;
        star.speed = 3.0 + Math.random();
        star.rotationSpeed = Math.random() * 8.0 - 4.0;
        star.angle = (260 + Math.random() * 20) * Math.PI / 180;

        star.addEventListener('enterframe', function () {
            this.x += this.speed * Math.cos(this.angle);
            this.y += this.speed * Math.sin(this.angle);
            star.rotation += this.rotationSpeed;

            if (this.age % 2 === 0) {
                const starParticle = sprites.star_particle(this.frame);
                starParticle.x = this.x;
                starParticle.y = this.y;
                this.parentNode.addChild(starParticle);
            }

            if (this.y < -40) {
                this.dead = true;
                this.parentNode.removeChild(this);
            }
        });

        return star;
    }
}



// import './lib/enchant';

enchant();
enchant.Sound.enabledInMobileSafari = true;

// import title from './scenes/title.js';
// import tsumugu from './sprites/tsumugu';
let game;
// UserAgentチェック
const ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
    window.onload = function () {
        console.log('hello world');
    
        game = new Game(180, 320);
        game.fps = 30;
        game.preload([
            './assets/tsumugu.png',
            './assets/logo.png',
            './assets/stars.png',
            './assets/b1p.png',
            
            './assets/game.mp3',
            './assets/mog.mp3']);
    
        const left = ( window.innerWidth - ( game.width * game.scale ) ) / 2;
        const top = ( window.innerHeight - ( game.height * game.scale ) ) / 2;
        const stageElm = document.getElementById('enchant-stage');
        stageElm.style.left = `${left}px`;
        stageElm.style.top = `${top}px`;
            
        game.onload = function () {
            game.replaceScene(scenes.title());
            // game.rootScene.addChild(tsumugu());
            // game.rootScene.backgroundColor = '#7ecef4';
     
        }
        game.start();
    };
} else {
    window.onload = function () {
        document.getElementById('for_no_support_device').classList.remove('hidden');
    }
}


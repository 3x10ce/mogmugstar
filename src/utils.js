

// ラベルを作る
// 即席で作ったとはいえ、もうすこしインターフェースは考えるべきだった…かくちょうしづらい。
const createLabel = function(text, x, y, color) {
    const label = new Label(text);

    label.setFontsize = function(px) {
        this.font = `${px}px PixelMplus10`
    }
    label.color = color ? color : "#000";
    label.setFontsize(12);
    label.x = x || 0;
    label.y = y || 0;

    return label;
}

// 中央よせラベルをつくる
const createCLabel = function(text, y, color) {
    const label = createLabel(text, 16, y, color);
    label.width = game.width - 32;
    label.textAlign = 'center';
    return label;
}

// 2オブジェクトの衝突判定
// enchant.Entity.intersectがうまく動かなかったので自前で実装
const intersect = function(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width
        && obj1.y < obj2.y + obj2.height
        && obj1.x + obj1.width > obj2.x
        && obj1.y + obj1.height > obj2.y;
}

// 秒をフレーム数に変換
const sec = function(s) { return s * game.fps};

// リザルトに出す一言セリフ
// ツイッターから発言引っ張ってきたが恥ずかしがりながらカクリヨパンチされそうなのでやめとく・・・
const getTsumuguComment = function() {
    const comments = [
        '今夜はゆったりと夜を過ごせそうなのです',
        'う…また床でいつの間にか眠っていたのです',
        '調べ物しながら寝て過ごしたのです…とても幸せ',
        '今夜は配信出来ると良いのだけれど…'
    ];

    return comments[Math.floor(Math.random() * comments.length)];
}

// リザルトにだすコメント
const getResultComment = function () {
    const comments = [
        '現世に存在するため「依代」の身を借りているらしい。',
        'ファンレターは、送り主とつむぐの間の「秘め事」として、大事にしまっているらしい。',
        '「#カクリヨTips」というTwitterハッシュタグがあるらしい。',
        '意外と大声を出すことができるらしい。',
        '普段は隠れているつむぐの目。もし目が合ってしまうと……',
        'タンクトップとビニール袋を見間違えてしまうらしい。',
        'ラムをまるごと煮たスープが好きらしい。',
        'イベントごとには本気で作戦を立てているらしい。',
        '腐っても鯛という言葉を体感すべく、腐った鯛を食べたことがあるらしい。',
        'つむぐに魅入られた者達は「贄」と呼ばれているらしい。',
        '贄たちは「#贄友ねっとわーく」でよく交流をするらしい。',
        'アニメソングから演歌まで歌いこなすらしい。',
        'サインが達筆すぎて読むのが困難らしい。',
        '現世で使用している配信環境は非常に「つよつよ」らしい。',
    ];

    return comments[Math.floor(Math.random() * comments.length)];

}
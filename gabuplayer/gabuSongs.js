function fetchDataFromGoogleSheet() {
    const url = "https://docs.google.com/spreadsheets/d/1oe7Yt4X2gIz-owElxPFIt5FCulF_Vpx8NnSbaqhk0pg/gviz/tq?tqx=out:csv&sheet=%E3%82%B7%E3%83%BC%E3%83%881";

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvData => {
            //console.log(csvData); // Print the CSV data to the console
            processCSVData(csvData)
            // Process the CSV data as needed
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// Call the function to fetch data
//fetchDataFromGoogleSheet();

function processCSVData(csvData) {
    // Add your data processing logic here
    console.log("Processing CSV data...");
    var songList = {}
    // Example: parse CSV data and convert it to JSON
    const lines = csvData.split('\n');
    lines.forEach(line => {
        row = line.split(',')
        if (row[0].indexOf("曲名") === -1) {
            songList[row[0]] = row[1]
        }
    });
    console.log(songList); // Print the processed data to the console
}

var singerData =
{
    "熱愛105℃の君へ": "早稻叽",
    "わたしの一番かわいいところ": "FRUITS ZIPPER",
    "可愛くてごめん": "HoneyWorks",
    "カブトムシ": "aiko",
    "ドライフラワー": "優里",
    "ヒッチコック": "ヨルシカ",
    "花に亡霊": "ヨルシカ",
    "残響散歌": "Aimer",
    "となりのトトロ": "井上あずみ",
    "打上花火": "Daoko",
    "10月無口な君を忘れる": "あたらよ",
    "水平線": "back number",
    "マリーゴールド": "あいみょん",
    "高嶺の花子さん": "back number",
    "小さな恋のうた": "MONGOL800",
    "風になる": "つじあやの",
    "Pretender": "Official髭男dism",
    "ただ君に晴れ": "ヨルシカ",
    "点描の唄": "Mrs.GREEN APPLE",
    "YUME日和": "島谷ひとみ",
    "テルーの唄": "手嶌葵",
    "カタオモイ": "Aimer",
    "斜陽": "ヨルシカ",
    "秒針を噛む": "ずっと真夜中でいいのに。",
    "夏色": "ゆず",
    "千本桜": "黒うさP",
    "God knows...": "涼宮ハルヒ",
    "残酷な天使のテーゼ": "高橋洋子",
    "言って。": "ヨルシカ",
    "たばこ": "コレサワ",
    "シャッター": "優里",
    "ひまわりの約束": "秦基博",
    "粉雪": "レミオロメン",
    "夏祭り": "Whiteberry",
    "いかないで": "想太",
    "さくらんぼ": "大塚愛",
    "キセキ": "GReeeeN",
    "CHE.R.RY": "YUI",
    "糸": "中島みゆき",
    "Butterfly": "木村カエラ",
    "勇気100%": "菅野穣",
    "群青": "YOASOBI",
    "ハナミズキ": "一青窈",
    "secret base～君がくれたもの～": "ZONE",
    "星座になれたら": "結束バンド",
    "変わらないもの": "奥華子",
    "アイドル": "YOASOBI",
    "惑星ループ": "Eve",
    "君の知らない物語": "supercell",
    "恋愛サーキュレーション": "花澤香菜",
    "365日の紙飛行機": "AKB48",
    "強風オールバック": "歌愛ユキ",
    "ちゅ、多様性": "ano",
    "花束": "back number",
    "やさしさに包まれたなら": "荒井由実",
    "少女レイ": "みきとP",
    "クリスマスソング": "back number",
    "魔法の絨毯": "川崎鷹也",
    "つばめ": "YOASOBI",
    "サターン": "ずっと真夜中でいいのに。",
    "アンパンマンのマーチ": "ドリーミング",
    "again": "YUI",
    "dont cry anymore": "miwa",
    "粛聖!! ロリ神レクイエム☆": "しぐれうい",
    "夜明けと蛍": "初音ミク",
    "さようなら、花泥棒さん": "メル feat. 初音ミク",
    "ファンサ": "HoneyWorks",
    "茜さす": "Aimer",
    "さくら(独唱)": "森山直太朗",
    "怪獣の花唄": "Vaundy",
    "いのちの名前": "平原綾香",
    "別の人の彼女になったよ": "wacci",
    "崖の上のポニョ": "藤岡藤巻と大橋のぞみ",
    "隅田川": "amazarashi",
    "月とあたしと冷蔵庫": "いきものがかり",
    "夢をかなえてドラえもん": "mao",
    "世界に一つだけの花": "SMAP",
    "赤い糸": "新垣結衣(コブクロ)",
    "青空": "THE BLUE HEARTS",
    "すずめ feat.十明": "RADWIMPS",
    "虹": "菅田将暉",
    "W/X/Y": "Tani Yuuki",
    "晩餐歌": "Tuki.",
    "好きだから。": "ユイカ",
    "猫": "DISH//",
    "シル・ヴ・プレジデント": "P丸様。"
}

function partFindArtist(str){
    for (const name in singerData) {
        //console.log(name); // Output: key1, key2, key3
        if (name.trim().slice(0,3) == str.slice(0,3)){
            return singerData[name]
        }
    }
}
function partFindKey(str){
    for (const name in singerData) {
        //console.log(name); // Output: key1, key2, key3
        if (str.length > 5) {
            // Check if the first five characters of name match the first five characters of str
            if (name.trim().slice(0, 5) === str.slice(0, 5)) {
                return name;
            }
        } else {
            // Check if the first characters of name match the characters of str up to the length of str
            if (name.trim().slice(0, str.length) === str) {
                return name;
            }
        }
        
    }
    return str
}


songDateBase = {}

function storeSong(title, youtubeID){
    if(!(title in songDateBase)){
        songDateBase[title] = {
            "time":1,
            "id":[youtubeID]
        }
    }
    else{
        songDateBase[title]["time"]++
        songDateBase[title]["id"].push(youtubeID)
    }
    
}


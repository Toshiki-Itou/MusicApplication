var String;

var SoundOfn = new Array(14);

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}


BufferLoader.prototype.loadBuffer = function (url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function () {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function (buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function (error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function () {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function () {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}

window.onload = init;
var context;
var bufferLoader;

function init() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
        context, [
      'se/bassdrum1.wav',
      'se/bassdrum2.wav',
      'se/cymbal1.wav',
      'se/cymbal2.wav',
      'se/hat1.wav',
      'se/hat2.wav',
      'se/snare1.wav',
      'se/snare2.wav',
      'se/tom1.wav',
      'se/tom2.wav',
      'se/tom3.wav'
    ],
        finishedLoading
    );

    bufferLoader.load();
}

function PlaySound(n) { //n番目の音を鳴らす
    SoundOfn[n] = context.createBufferSource();
    SoundOfn[n].gainNode = context.createGain();
    SoundOfn[n].connect(SoundOfn[n].gainNode);
    SoundOfn[n].buffer = bufferLoader.bufferList[n];
    SoundOfn[n].gainNode.connect(context.destination);
    SoundOfn[n].playing = Boolean(true);
    console.log("play:" + n)
    SoundOfn[n].start(0);
}

function StopSound(n) {　//n番目の音を止める
    if (SoundOfn[n].playing == true) {
        SoundOfn[n].endTime = context.currentTime + 0.1;
        console.log("stop" + n);
        SoundOfn[n].gainNode.gain.linearRampToValueAtTime(0, SoundOfn[n].endTime);
        SoundOfn[n].playing = false;
    }
}

function playinit() {
    this.playing = Boolean(false);
}


function finishedLoading(bufferList) {
    // Create two sources and play them both together
}

$(function () {
    for (var i = 0; i < 11; i++) {
        SoundOfn[i] = new playinit;
    }
    $("#template").click(function(){    //テンプレート作成
        for(var y=1;y<12;y++){
            for(var x=2;x<34;x+=2){
                $(".mainpanel div:nth-child(" + y + ") input:nth-child(" + x + ") ").prop("checked",false);
            }
        }
        $(".mainpanel div:nth-child(1) input:nth-child(2) ").prop("checked",true);
        $(".mainpanel div:nth-child(1) input:nth-child(6) ").prop("checked",true);
        $(".mainpanel div:nth-child(1) input:nth-child(22) ").prop("checked",true);
        for(var i=0;i<4;i++){
            $(".mainpanel div:nth-child(5) input:nth-child(" + (2+i*4) + ") ").prop("checked",true);
        }
        for(var i=0;i<3;i++){
            $(".mainpanel div:nth-child(5) input:nth-child(" + (22+i*4) + ") ").prop("checked",true);
        }
        $(".mainpanel div:nth-child(8) input:nth-child(10) ").prop("checked",true);
        $(".mainpanel div:nth-child(8) input:nth-child(16) ").prop("checked",true);
        $(".mainpanel div:nth-child(8) input:nth-child(20) ").prop("checked",true);
        $(".mainpanel div:nth-child(8) input:nth-child(26) ").prop("checked",true);
        $("#bpmnumber").val("89");
    })
    $(".container img").click(function(){   //サウンド再生画像をクリックした場合
        PlaySound(parseInt($(this).attr("id")));    //idを取得し対応する音を鳴らす
    })
    $("#start").click(function () {         //再生ボタンを押した場合
        if($(this).prop("checked")){        //もし再生なら
            var currentColumn = 2;
            var currentRow = 1;
            var tempo = 60000 / $("#bpmnumber").val() / 4;
            console.log(tempo);
            String = setInterval(function () {
                for (var i = 0; i <11; i++) {   //１つ１つのチェックボックスを確認してチッェクされていたなら音を再生する
                    if ($(".mainpanel div:nth-child(" + currentRow + ") input:nth-child(" + currentColumn + ") ").prop("checked")) {
                        StopSound(currentRow-1);
                        PlaySound(currentRow-1);
                    }
                    currentRow++;
                    if(currentRow==12){
                        currentRow = 1;
                    }
                }
                console.log(currentColumn);
                currentColumn += 2;
                if(currentColumn==34){
                    currentColumn=2;
                }
            }, tempo)
        }else{      //停止ボタンなら
            clearInterval(String);
        }
    })
})

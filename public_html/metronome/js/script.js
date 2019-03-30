var timer;  //タイマー機能用
var metronorm;
var animation;
$(function(){
   // アニメーションリスタート用　－＞うまくいかない
//    animation = setInterval(function(){
//        for(var i=0;i<$(".snow").length;i++){
//            console.log($("#snow"+(i+1)).offset().top)
//            if($("#snow"+(i+1)).offset().top>1500){
//                var el = $(this),  
//                newone = el.clone(true);
//                el.before(newone);
//                $("." + el.attr("class") + ":last").remove();   
//            }
//        }
//    },1000)
	$(document).on("click", "#bpmimage div", function(){  //強い音を鳴らすか弱い音を鳴らすか切り替える
		$(this).toggleClass("strong");                    //strongクラスの有り無しによって
		console.log($(this).index())
		if($(this).hasClass("strong")){
			$(this).css({
				"background-color":"darkred"
			});
		}else{
			$(this).css({
				"background-color":"darkblue"
			});
		}
	});
	$(".plus input").click(function(){     //＋ボタン
		stock = parseInt($("p.bpm").text())+parseInt($(this).val());　//押したボタンの値を加算
		if(stock > 255){                  //２５５以上にならないように
			$("p.bpm").text("255")
		}else{
			$("p.bpm").text(stock);
		}
	});
	$(".minus input").click(function(){    //－ボタン
		stock = parseInt($("p.bpm").text())+parseInt($(this).val());　//押したボタンの値を減算
		if(stock < 50){                   //５０以上にならないように
			$("p.bpm").text("50")
		}else{
			$("p.bpm").text(stock);
		}
	});
	$("#bpbbutton input").click(function(){    //拍　調整ボタンを押した場合
		stock = parseInt($("#bpbbox span").text());  
		if($(this).val()=="+1"){                         //＋ボタン
			if(parseInt($("#bpbbox span").text())<16){   //拍数が15以下なら
				$("#bpbbox span").text(stock+1)
				$("#bpmimage").append("<div></div>");   //divを追加し視覚的に拍を増やす
			}
		}
		else if($(this).val()=="-1"){                    //－ボタン
			if(parseInt($("#bpbbox span").text())>1){    //拍数が２以上なら
				$("#bpbbox span").text(stock-1)
				$("#bpmimage div:last-child").remove(); //divを削除し視覚的に拍を減らす
			}
		}
		
	})
	$("input#bpmstart").click(function(){      //再生ボタンを押したら
		if($(this).val()=="再生"){
			$("input#bpmstart").css({
				"border-color":"darkblue",
				"background-color":"darkred"
			});
			var sec = parseInt($("#sec").val());　//タイマー用　秒
			var min = parseInt($("#min").val());　//          分
			var haku = 1;                        //拍カウント用
			var bpb = parseInt($("#bpbbox span").text());    //拍数
			var bpm = 60000 / parseInt($("p.bpm").text());   //テンポ
			$(this).val("停止");   //停止ボタンにして
			if(sec == 0 && min == 0){    //タイマーが設定されていなければなにもしない
			}else{                       //されていたらタイマーを起動する
				timer = setInterval(function(){
					if(sec == 0){
						min = parseInt($("#min").val());
						if(min == 0){     //時間になったら停止する
							reset();
						}else{
							sec=59
							min--;
							$("#min").val(min)
						}
					}else{
						sec--;
					}
					$("#sec").val(sec)
				},1000)
			}
			metronorm = setInterval(function(){
				for(var i = 0;i<bpb;i++){               //背景色を替えて簡単なアニメーションをさせる
                                                                       //消灯処理
					if($("#bpmimage div").eq(i).hasClass("strong")){   //strongクラスを持っていたなら
						$("#bpmimage div").eq(i).css({
							"background-color":"darkred",
							"border-color":"#888"
						});
					}else{                                             //持っていなければ
						$("#bpmimage div").eq(i).css({
							"background-color":"darkblue",
							"border-color":"#888"
						});
					}
				}
                                                                       //点灯処理
				if($("#bpmimage div").eq(haku-1).hasClass("strong")){　//strongクラスを持っていたなら
					$("#sound_s").get(0).play();
					$("#bpmimage div").eq(haku-1).css({
						"background-color":"red",
						"border-color":"#fff"
					});
				}else{                                                 //持っていなければ
					$("#sound_w").get(0).play();
					$("#bpmimage div").eq(haku-1).css({
						"background-color":"blue",
						"border-color":"#fff"
					});
				}
				if(haku == bpb){
					haku = 1;
				}else{
					haku++;
				}
			}, bpm);
		}else if($(this).val()=="停止"){    //停止ボタンならリセットを呼び出し停止
			reset();
		}
	})
})
function reset(){   //プログラム停止用関数
	var bpb = parseInt($("#bpbbox span").text());
	clearInterval(metronorm);  //タイマー、メトロノームを停止
	clearInterval(timer);
	$("input#bpmstart").val("再生");
	for(var i = 0;i<bpb;i++){
		if($("#bpmimage div").eq(i).hasClass("strong")){  //すべて消灯
			$("#bpmimage div").eq(i).css({
				"background-color":"darkred",
				"border-color":"#888"
			});
		}else{
			$("#bpmimage div").eq(i).css({
				"background-color":"darkblue",
				"border-color":"#888"
			});
		}
	}
	$("input#bpmstart").css({
		"border-color":"blue",
		"background-color":"red"
	});
}
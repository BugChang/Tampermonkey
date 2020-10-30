// ==UserScript==
// @name         石油大学答题助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  中国石油大学（北京）网络教育在线刷题助手!
// @author       BugChang
// @match        http://www.cupde.cn/learning/entity/function/homework/homeworkPaperList_toHomework.action?*
// @match        http://www.cupde.cn/learning/CourseImports/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var html=`
<style>
#bc-sumbit {
position: fixed;
top: 10px;
left: 10px;
}
</style>
<input type="button" value="一键完成" id="bc-sumbit"/>`;

    $("body").prepend(html);
    $("#bc-sumbit").click(function(){
        var url=location.href;
        if(url.indexOf("homeworkPaperList_toHomework")!==-1){
            getRightAnwser();
        }else{
            completeVideo();
        }
    });

    //获取正确答案
    function getRightAnwser(){
        var homeworkInfoId=getQueryString("homeworkInfo.id");
        var url=`http://www.cupde.cn/learning/entity/function/homework/homeworkPaperList_showAnswer.action?homeworkInfo.id=${homeworkInfoId}&homeworkInfo.type=0&homeworkInfo.title=`
        $.get(url,function(html){
            var htmlObj=$(html);
            htmlObj.find("div[name^='tm'] .answer_key span[style]").each(function(i){
                var answer=$(this).html().replace("<!--","").replace("-->","");
                var answerObj=$(answer);
                //var rightAnswer= answerObj.find(".zdh_right_answer");
                var rightAnswer= $.trim($(answerObj[1]).text());
                rightAnswer=rightAnswer=="正确"?"1":rightAnswer=="错误"?"0":rightAnswer;
                console.log($(`#tm${i+1} input[value='${rightAnswer}']`));
                $(`#tm${i+1} input[value='${rightAnswer}']`).attr("checked","checked");
                //console.log($(answerObj[1]).text());

            })

        });
    }

    //完成视频
    function completeVideo(){
        var url="http://www.cupde.cn/learning/entity/scorm/lmsScorm_doPost.action?dmeID=cmi.core.lesson_status&dmeValue=completed";
        var endPosition= jwplayer('flash_player').getDuration();
        jwplayer('flash_player').seek(endPosition-10);
        doLMSSetValue( "cmi.core.total_time", "01:30:00" );
        doLMSCommit();
    }

    //获取URL参数
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
})();
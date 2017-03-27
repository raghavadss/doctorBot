
'use strict';
$(function (){
    $('#messageBar').focus();

    var doctorBot = new DoctorBot();
    var chatStream = new Array();
    var userInput = '';
    var botOutput = 'Doctor:  Hello! I\'m glad to meet you. Please start describing your symptoms.';

    if(!$('#chatWindow').val()){
        chatStream.push(botOutput);
        $('#chatWindow').val(chatStream.join('\n'));
    }

    $('#messageBar').keydown(function(event){
        if(event.keyCode==13){
            $('#submit').trigger('click');
        }
    });

    $("#submit").click(function() {
        var message = $('#messageBar').val();
        if(message) {
            userInput = 'You:     ' + message;
            chatStream.push(userInput);
            botOutput = 'Doctor:  '+ doctorBot.getBotResponse(message);
            chatStream.push(botOutput);

            $('#chatWindow').val(chatStream.join('\n'));

            var psconsole = $('#chatWindow');
            if(psconsole.length)
                psconsole.scrollTop(psconsole[0].scrollHeight - psconsole.height());

            $('#messageBar').val("");
        }
    });

    $('#reset').click(function () {
        doctorBot = new DoctorBot();
        chatStream = new Array();
        userInput = '';
        botOutput = 'Doctor:  Hello! I\'m glad to meet you. Please start describing your foundSymptoms.';
        chatStream.push(botOutput);
        $('#chatWindow').val(chatStream.join('\n'));
        $('#messageBar').val("");
        $('#messageBar').focus();
    })
});
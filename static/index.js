var date = new Date()
let display_date = "Date:" + date.toLocaleDateString()
let predicted_emotion;
$(document).ready(function () {
    $("#display_date").html(display_date)
    $('#save_button').prop('disabled', true);
    displayBot()
})
$(function () {
    $("#predict_button").click(function () {
        let input_data = {
            "text": $("#text").val()
        }
        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                predicted_emotion = result.data.predicted_emotion
                emotion_img_url=result.data.predicted_emotion_img_url
                //Send the predicted emotion and image url to HTML
                $("#prediction").html(predicted_emotion)
                $("#emo_img_url").attr('src', emotion_img_url);
                //Set the display 
                $('#prediction').css("display", "");
                $('#emo_img_url').css("display", "");
               //Enable the Save Button
                $('#save_button').prop('disabled', false);
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });
    });

    $("#save_button").click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion
        }
        $.ajax({
            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alert("Your entry has been saved successfully!")
                window.location.reload()
            },
            error: function (result) {
                alert(result.responseJSON.message)
            }
        });

    });
})
function displayBot() {
    $('.chatbox__button').click(function () {
        $('.chatbox__chat').toggle()
    });
    askBot()
}
function askBot(){
    $("#send_button").click(function(){
        var user_input=$("#bot_input_text").val()
        if (user_input!=" "){
            $("#chat_messages").append(
                '<div class="user_messages">'+user_input+'</div>'
            )
            $("#bot_input_text").val('')
            var chat_input_data={
                "user_input":user_input
            }
            $.ajax({
                type:"POST",
                url:"/bot-response",
                data:JSON.stringify(chat_input_data),
                dataType:"json",
                contentType:"application/json",
                success:function(result){
                    console.log(result.bot_response)
                    $("#chat_messages").append(
                        '<div class="bot_messages">'+result.bot_response+'</div>'
                    )
                    $(".chatbox_messages_container").animate({
                        scollTop:$('.chatbox__messages__cotainer')[0].scollHeight
                    },1000)
                },
                error:function(result){
                    alert(result.responseJSON.message)
                }
            });
        }
        else{
            alert("Kindly enter your message")
        }
    })
    $("#bot_input_text").keypress(function(e){
        if(e.which===13){
            $("#send_button").click()
        }
    })
}
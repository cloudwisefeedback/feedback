$(function () {

    $('#singin').click(function () {

        var user = {
            username: $.trim($('#username').val()),
            password: $.trim($('#password').val())
        };

        $.ajax({
            url: '/api/user/login',
            method: 'POST',
            dataType: 'json',
            data: user,
            success: function (result) {
                if (result.status == 'error') {
                    $('#tip').text(result.msg).show();
                } else {
                    window.location.href = '/list';
                }
            }
        });


        return false;
    });

    function keyLogin(event) {
        if (event.keyCode == 13) {
            $('#singin').trigger('click');
        }
    }

    $('#login').keydown(keyLogin);

});
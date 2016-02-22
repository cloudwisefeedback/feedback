$(function () {

    // 查询所有分类
    $.ajax({
        url: '/api/category/find',
        method: 'get',
        dataType: 'json',
        success: function (result) {
            if (result.status == 'success') {
                var counts=0;
                var lables='';
                lables += '<a id="all" class="active" href="#" data-id="">全部（<span>0</span>）</a>';
                $.each(result.data, function (i, dt) {
                    lables += '<a href="#" data-id="' + dt._id + '">' + dt.name + '('+dt.feedback_count+')</a>';
                    counts += dt.feedback_count;
                });
                lables += '<span href="#" class="Popup" id="add">添加分类</span>';
                $('#labels').append(lables).find('#all>span').text(counts);


            }
        }
    });

// 添加分类
    $('#add_category').click(function () {
        var name = $('#category').val();
        var self = $(this);
        $.post('/api/category/add', {name: name}, function (result) {
            if(result.status == 'success'){
                self.closest('.modal').hide();
                $('.bg-black').hide();
                $('#labels>span').before('<a href="#">'+name+'(0)</a>');
                $('#category').val('');
            }else{
                $('#tip').text(result.msg);
            }
        });
    });



    $(document).on('click','#exit',function(){
        $.get('/api/user/exit',function(result){
            if(result.status == 'success'){
                window.location.href='/singin';
            }
        });
    });
    $(document).on('click','.filter a',function(){
        $(this).addClass('active').siblings().removeClass('active');
    });

    $(document).on('click', '.Popup', function (e) {
        var c = $(this).attr('id');
        var f = c + 1;
        $('.bg-black').show();
        $('#' + f).removeClass('fadeOut').addClass('fadeIn').show();
        e.preventDefault();
    });
    $(document).on('click', '.disappear', function (e) {
        $('#category').val('');
        $('#tip').empty();
        $('.bg-black').hide();
        $('.modal').addClass('fadeOut').removeClass('fadeIn').hide();
        e.preventDefault();
    })

    //显示插叙结果
    function showFeedback(data) {
        var trs = '';
        $.each(data, function (i, dt) {
            var tr = '<tr>';
            tr += '<td>' + (i + 1) + '</td>';
            tr += '<td>' + dt.text + '</td>'
            //tr += '<td>' + dt.ip + '</td>'
            tr += '<td>' + new Date(dt.create_date).toLocaleString() + '</td>';
            tr += '</tr>';

            trs += tr;
        });
        $('#feedback_table').html(trs);
    }

    //查询所有反馈意见
    function queryAll() {
        $.get('/api/feedback/find', function (result) {
            showFeedback(result.data);
        });
    }

    queryAll();

    // 根据分类查询意见反馈
    $('#labels').on('click', '[data-id]', function (e) {
        e.preventDefault();
        var category = $(this).attr('data-id');
        if (category == '') {
            queryAll();
        } else {
            $.get('/api/feedback/findByCategory?category=' + category, function (result) {
                showFeedback(result.data);
            });
        }
    });


});
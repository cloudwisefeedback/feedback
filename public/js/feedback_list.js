$(function () {

    var userInfo = JSON.parse($.cookie('cloudwise-user-info'));

    // 查询所有分类
    $.ajax({
        url: '/api/category/find',
        method: 'GET',
        dataType: 'json',
        success: function (result) {
            if (result.status == 'success') {
                var counts = 0;
                var lables = '';
                lables += '<a id="all" class="active" href="#" data-id="">全部（<span>0</span>）</a>';
                $.each(result.data, function (i, dt) {
                    lables += '<a href="#" data-id="' + dt._id + '">' + dt.name + '(' + dt.feedback_count + ')</a>';
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
            if (result.status == 'success') {
                self.closest('.modal').hide();
                $('.bg-black').hide();
                $('#labels>span').before('<a href="#">' + name + '(0)</a>');
                $('#category').val('');
            } else {
                $('#tip').text(result.msg);
            }
        });
    });

    //添加用户
    $('#add_user').click(function () {
        var username = $('#name').val();
        var level = $('#level').find('a.active').attr('level');

        var self = $(this);
        $.post('/api/user/add', {username: username, level: level}, function (result) {

            if (result.status == 'success') {

                var tr = '<tr>';
                tr += '<td>' + username + '</td>';
                tr += '<td>' + '<div class="filter sm group">';
                if (result.data.level == 'admin') {
                    tr += '<a class="active" href="javascript:void(0);" level-id="' + result.data._id + '" level="admin">管理员' + '</a>';
                    tr += '<a href="javascript:void(0);" level-id="' + result.data._id + '" level="normal">普通用户' + '</a>';
                } else {
                    tr += '<a href="javascript:void(0);" level-id="' + result.data._id + '" level="admin">管理员' + '</a>';
                    tr += '<a class="active" href="javascript:void(0);" level-id="' + result.data._id + '" level="normal">普通用户' + '</a>';
                }
                tr += '</div></td>';
                tr += '<td>' + '<a  data-id="' + result.data._id + '">' + '&times' + '</a></td>';
                tr += '</tr>';

                $('#feed_user').append(tr);


                self.closest('.modal').hide();
                $('.bg-black').hide();
                $('#name').val('');
            } else {
                $('#tip1').text(result.msg);
            }
        });
    });


    $(document).on('click', '#exit', function () {
        $.get('/api/user/exit', function (result) {
            if (result.status == 'success') {
                window.location.href = '/singin';
            }
        });
    });
    $(document).on('click', '.filter a', function () {
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
        $('#name').val('');
        $('#tip').empty();
        $('#tip1').empty();
        $('#tip2').empty();
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
    $('#labels').on('click', '[id]', function (e) {
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


    function userAll() {
        $.get('/api/user/find', function (result) {
            showuserback(result.data);
        });
    }

    userAll();


//用户管理
    function showuserback(data) {
        var trs = '';
        console.log(data);
        $.each(data, function (i, dt) {
            var tr = '<tr>';
            tr += '<td>' + dt.username + '</td>';
            //tr += '<td>' + dt.level + '</td>'
            //tr += '<td>' + dt.ip + '</td>'

            tr += '<td>' + '<div class="filter sm group">';

            if (dt.level == 'admin') {
                tr += '<a class="active" href="javascript:void(0);" level-id="' + dt._id + '" level="admin">管理员' + '</a>';
                tr += '<a href="javascript:void(0);" level-id="' + dt._id + '" level="normal">普通用户' + '</a>';
            } else {
                tr += '<a href="javascript:void(0);" level-id="' + dt._id + '" level="admin">管理员' + '</a>';
                tr += '<a class="active" href="javascript:void(0);" level-id="' + dt._id + '" level="normal">普通用户' + '</a>';
            }

            tr += '</div></td>';
            if (userInfo.username == dt.username) {
                tr += '<td>&nbsp;</td>';
            }else{
                tr += '<td>' + '<a  data-id="' + dt._id + '">' + '&times' + '</a></td>';
            }



            tr += '</tr>';

            trs += tr;


        });

        $('#feed_user').html(trs);
        //var name =
        //
        //$.get('/api/user/current_user', function (result) {
        //    if(result.data.username==name){
        //        $(this).off('click');
        //    }
        //});
    }

    $('#feed_user').on('click', '[level-id]', function (e) {
        e.preventDefault();
        var category = $(this).attr('level-id');
        var level = $(this).attr('level');
        $.post('/api/user/updateLevel', {id: category, level: level}, function (result) {
            if (result.status == 'success') {
                return;
            }
        })
    })


    $('#feed_user').on('click', '[data-id]', function (e) {
        e.preventDefault();
        var category = $(this).attr('data-id');
        var tr = $(this).parents('tr');

        var name = tr.find('td:first-child').text();


        if (category == '') {
            userAll();
        } else {

            $.get('/api/user/delete', {id: category}, function () {
                tr.fadeOut(5000).remove();

            });
        }
    });


    if (userInfo.level == 'normal') {
        $('#user').remove();
        $('#modal').remove();
    }


});
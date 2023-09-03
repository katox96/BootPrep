$(document).ready(function() {
    $('#show-small-menu').click(function() {
        $('#show-small-menu').hide();
        $('#close-small-menu').show();
        $('#small-menu').show();
        $('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
    });

    $('#close-small-menu').click(function() {
        $('#show-small-menu').show();
        $('#close-small-menu').hide();
        $('#small-menu').hide();
        $('html, body').css({
            overflow: 'auto',
            height: 'auto'
        });
    });

    $('#menu-list').click(function() {
        $('#close-small-menu').click();
    });
});
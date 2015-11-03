// main

require.config({
    paths: {
        "dialog": "../static/dialog/dialog",
        "jquery": "http://libs.baidu.com/jquery/2.0.0/jquery"
    }
});

require(["dialog"], function (dialog) {
    var myDialog = new dialog();
    // myDialog.show();
    myDialog.register();
    console.log(window.alert);
});

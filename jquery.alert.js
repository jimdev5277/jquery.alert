(function ($) {

    var panelManager = new function () {
        this.sort = function () {
            var list = new Array();

            // get all panels
            $("." + settings.className).each(function () {
                list.push($(this));
            });

            // sort via time attribute
            list.sort(function (a, b) {
                return a.data("time") - b.data("time");
            });

            var top = 0;

            // ordner panels
            for (var i in list) {
                var l = list[i];

                l.css("top", top + "px");
                top += l.height();
            }
        }
    };

    // 默认设置
    var settings = {
            className: "alert",
            duration: 7000,
            fadeSpeed: 500,
            css: {
                width: "50%",
                lineHeight: "50px",
                fontSize: "24px",
                position: "fixed",
                top: "100px",
                left: "25%",
                textAlign: "center",
                display: "none",
                zIndex: 99999
            }
        },
        previous_type = '',
        previous_messgae = '';

    // style for the individual types (error, success, ...)
    var individualCss = {
        error: {
            classname: "alert-danger"
        },
        success: {
            classname: "alert-success"
        },
        warning: {
            classname: "alert-warning"
        }
    };

    // the panel
    var panel = null;

    // all needed methods
    var methods = {

        // create the panel
        create: function (type, msg, customSettings) {
            // create the panel
            panel = $(document.createElement("div"));
            panel.data("time", new Date().getTime());

            // add css properties
            for (var c in customSettings.css) {
                panel.css(c, customSettings.css[c]);
            }

            // current top position
            var top = 0;

            // check for existing panels and update top position
            $("." + customSettings.className).each(function () {
                top += $(this).height();
            });

            // update top
            panel.css("top", top + "px");

            // add class to identify the panel
            panel.addClass(customSettings.className);

            // individual css
            if (individualCss[type]) {
                panel.addClass(individualCss[type].classname);
            } else {
                panel.addClass('alert-info');
            }

            // set html content
            panel.html(msg);

            // create a close button
            var close = $('<button type="button" class="close"><span>&times;</span></button>');

            // add close function to onclick event
            close.click(function () {
                $(this).parent().remove();
                panelManager.sort();
            });

            // add the close button to the panel
            panel.append(close);

            // add panel to dom
            $("body").append(panel);

        },

        // show the panel
        show: function (type, msg, customSettings) {

            // if there are no custom settings, use the default
            if (typeof customSettings === "undefined" || typeof customSettings !== "object")
                customSettings = settings;

            // create a new panel
            if (type == previous_type && msg == previous_messgae) {
            } else {
                methods.create(type, msg, customSettings);
                previous_type = type;
                previous_messgae = msg;
            }
            // slide panel, wait, slide again and remove
            panel.slideToggle(customSettings.fadeSpeed);

            // trigger the moveFinished event
            panel.queue(function () {
                panelManager.sort();
                $(this).dequeue();
            });

            // show the panel X seconds
            if (customSettings.duration > 0) {
                panel.delay(customSettings.duration);

                // hide and trigger moveFinished event
                panel.slideToggle(customSettings.fadeSpeed, function () {
                    $(this).remove();
                    panelManager.sort();
                });
            }

        },
    };

    // plugin itself
    $.alert = function (arg) {
        if (arguments.length === 2) {
            return methods.show(arguments[0], arguments[1]);
        } else if (typeof arg === "object") {
            var customSettings = {};
            $.extend(true, customSettings, settings, arg.settings);

            return methods.show(arg.type, arg.message, customSettings);
        }
    }

})(jQuery);
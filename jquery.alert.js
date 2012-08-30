(function($) {
		
	var panelManager = new function() {		
		this.sort = function() {
			var list = new Array();
			
			// get all panels
			$("."+settings.className).each(function() {
				list.push( $(this) );
			});
			
			// sort via time attribute
			list.sort(function(a, b) { 
				return a.attr("data-time") - b.attr("data-time"); 
			});
			
			var top = 0;
			
			// ordner panels
			for (var i in list) {
				var l = list[i];
				
				l.css("top", top+"px");
				top += l.height();
			}
		}
	};
	
	// default settings
	var settings = {
		className: "alert_identify",
		duration: 7000,
		fadeSpeed: 500,
		css: {				
			width: "100%",
			lineHeight: "50px",
			fontSize: "24px",
			fontFamily: "Tahoma, Arial",
			position: "fixed",
			top: "0px",
			left: "0px",
			textAlign: "center",
			color: "#333",
			display: "none",
			zIndex: 99999
		}
	};
	
	// style for the individual types (error, success, ...)
	var individualCss = {
		error: {
			backgroundColor: "rgba(200, 50, 50, 0.95)",
			borderBottom: "1px solid",
			borderColor: "rgb(150, 0, 0)"
		},
		success: {
			backgroundColor: "rgba(50, 200, 50, 0.95)",
			borderBottom: "1px solid",
			borderColor: "rgb(0, 150, 0)"
		}
	};
	
	// the panel
	var panel = null;
		
	// all needed methods
	var methods = {
		
		// create the panel
		create: function(type, msg, customSettings) {
			// create the panel
			panel = $(document.createElement("div"));
			panel.attr("data-time", new Date().getTime());
			
			// add css properties
			for (var c in customSettings.css) {
				panel.css(c, customSettings.css[c]);
			}

			// current top position
			var top = 0;

			// check for existing panels and update top position
			$("."+customSettings.className).each(function() {						
				top += $(this).height();
			});
			
			// update top
			panel.css("top", top + "px");
			
			// add class to identify the panel
			panel.addClass(customSettings.className);					
			
			// individual css
			if (individualCss[type]) {
				for (var c in individualCss[type]) {
					panel.css(c, individualCss[type][c]);
				}
			}
		
			// set html content
			panel.html(msg);
			
			// create a close button
			var close = this.createBox(customSettings, type);
			close.html("<span>x</span>");
			
			// add close function to onclick event
			close.click(function() {
				$(this).parent().remove();
				panelManager.sort();
			});
			
			// add the close button to the panel
			panel.append(close);
			
			// add panel to dom
			$("body").append(panel);

		},
		
		// show the panel
		show: function(type, msg, customSettings) {
		
			// if there are no custom settings, use the default
			if (typeof customSettings === "undefined" || typeof customSettings !== "object")
				customSettings = settings;
								
			// create a new panel
			methods.create(type, msg, customSettings);
								
			// slide panel, wait, slide again and remove
			panel.slideToggle(customSettings.fadeSpeed);
			
			// trigger the moveFinished event
			panel.queue(function() {
				panelManager.sort();
				$(this).dequeue();
			});
			
			// show the panel X seconds
			panel.delay(customSettings.duration);
			
			// hide and trigger moveFinished event
			panel.slideToggle(customSettings.fadeSpeed, function() { 
				$(this).remove(); 
				panelManager.sort();
			});
		},
		
		createBox: function(customSettings, type) {
			var box = $(document.createElement("div"));
			var borderColor = individualCss[type] ? individualCss[type].borderColor : customSettings.css.color;
			box.css("border", "2px solid "+borderColor);
			box.css("float", "right");
			box.css("display", "block");
			box.css("margin-right", "10px");
			box.css("margin-top", "10px");
			box.css("line-height", "20px");
			box.css("height", "25px");
			box.css("width", "25px");
			box.css("cursor", "pointer");
			
			return box;
		}
	};
		
	// plugin itself
	$.alert = function(arg) {
		if (arguments.length === 2) {
			return methods.show(arguments[0], arguments[1]);
		} else if (typeof arg === "object") {
			var customSettings = {};					
			$.extend(true, customSettings, settings, arg.settings);
			
			return methods.show(arg.type, arg.message, customSettings);
		}
	}
	
})(jQuery);
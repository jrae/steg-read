let console = (Cu.import("resource://gre/modules/devtools/Console.jsm", {})).console;

var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

/**
 * StegRead namespace.
 */
if ("undefined" == typeof(StegRead)) {
  var StegRead = {};
};

StegRead.current_image_src = null;

StegRead.BrowserOverlay = {

		init : function () {
			console.log("init");
			var autoRun = prefManager.getBoolPref("extensions.steg-read.autorun");
			console.log(prefManager.getBoolPref("extensions.steg-read.autorun"));
			gBrowser.addEventListener("load", function (event) {
				var autoRun = prefManager.getBoolPref("extensions.steg-read.autorun");
				if (autoRun) {
					console.log("running after load")
					StegRead.BrowserOverlay.run(event);
				}
			}, false);
		},

		run : function (event) {

			var head = content.document.getElementsByTagName("head")[0],
				style = content.document.getElementById("steg-read-style"),
				// need to consider background-url images
				allImages = content.document.getElementsByTagName("img"),
				foundImages = allImages.length;

			if (!style) {
				style = content.document.createElement("link");
				style.id = "steg-read-style";
				style.type = "text/css";
				style.rel = "stylesheet";
				style.href = "chrome://steg-read/skin/skin.css";
				head.appendChild(style);
			}

			for (var i=0, il=foundImages; i<il; i++) {
				elm = allImages[i];
				// console.log(elm.getAttribute("id"));
				elm.className += ((elm.className.length > 0)? " " : "") + "steg-read-selected";
				elm.addEventListener("contextmenu", function(aEvent) {
						StegRead.current_image_src = aEvent.target.getAttribute("src");
				 }, false);
			}
			if (foundImages === 0) {
				alert("No images found");
			}
			else {
				alert("Found " + foundImages + " images with <img> tags");
			}
		},

		find : function (event) {
			console.log(StegRead.current_image_src);
		}
};
window.addEventListener("load", StegRead.BrowserOverlay.init(), false);
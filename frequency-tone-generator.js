"use strict";

const DEFAULT_VOLUME = 0.75;

var FADE_TIME = 0.25;

const FADE_SET_TARGET_TIME_CONSTANT = 0.05,
    MIN_FREQ = 1,
    MAX_FREQ = 20154,
    MIN_PIANO_KEY = 1,
    MAX_PIANO_KEY = 99,
    FIRST_C = 4,
    NOTE_NAMES = ";A0 Dbl Pedal A;A\u266f0\u2009/\u2009B\u266d0;B0;C1 Pedal C;C\u266f1\u2009/\u2009D\u266d1;D1;D\u266f1\u2009/\u2009E\u266d1;E1;F1;F\u266f1\u2009/\u2009G\u266d1;G1;G\u266f1\u2009/\u2009A\u266d1;A1;A\u266f1\u2009/\u2009B\u266d1;B1;C2 Deep C;C\u266f2\u2009/\u2009D\u266d2;D2;D\u266f2\u2009/\u2009E\u266d2;E2;F2;F\u266f2\u2009/\u2009G\u266d2;G2;G\u266f2\u2009/\u2009A\u266d2;A2;A\u266f2\u2009/\u2009B\u266d2;B2;C3 Tenor C;C\u266f3\u2009/\u2009D\u266d3;D3;D\u266f3\u2009/\u2009E\u266d3;E3;F3;F\u266f3\u2009/\u2009G\u266d3;G3;G\u266f3\u2009/\u2009A\u266d3;A3;A\u266f3\u2009/\u2009B\u266d3;B3;C4 Middle C;C\u266f4\u2009/\u2009D\u266d4;D4;D\u266f4\u2009/\u2009E\u266d4;E4;F4;F\u266f4\u2009/\u2009G\u266d4;G4;G\u266f4\u2009/\u2009A\u266d4;A4;A\u266f4\u2009/\u2009B\u266d4;B4;C5;C\u266f5\u2009/\u2009D\u266d5;D5;D\u266f5\u2009/\u2009E\u266d5;E5;F5;F\u266f5\u2009/\u2009G\u266d5;G5;G\u266f5\u2009/\u2009A\u266d5;A5;A\u266f5\u2009/\u2009B\u266d5;B5;C6 Soprano C;C\u266f6\u2009/\u2009D\u266d6;D6;D\u266f6\u2009/\u2009E\u266d6;E6;F6;F\u266f6\u2009/\u2009G\u266d6;G6;G\u266f6\u2009/\u2009A\u266d6;A6;A\u266f6\u2009/\u2009B\u266d6;B6;C7 Dbl high C;C\u266f7\u2009/\u2009D\u266d7;D7;D\u266f7\u2009/\u2009E\u266d7;E7;F7;F\u266f7\u2009/\u2009G\u266d7;G7;G\u266f7\u2009/\u2009A\u266d7;A7;A\u266f7\u2009/\u2009B\u266d7;B7;C8;C\u266f8\u2009/\u2009D\u266d8;D8;D\u266f8\u2009/\u2009E\u266d8;E8;F8;F\u266f8\u2009/\u2009G\u266d8;G8;G\u266f8\u2009/\u2009A\u266d8;A8;A\u266f8\u2009/\u2009B\u266d8;B8".split(
        ";"
    );

function reflow() {}

var BrowserDetect = {
    init: function () {
        this.identifyBrowser();
        if ("Explorer" == this.browser) {
            if (((this.IE = !0), 8 >= this.majorVersion || 8 === document.documentMode)) this.IE8 = !0;
        } else
            "Firefox" == this.browser
                ? (this.Firefox = !0)
                : "Chrome" == this.browser
                ? (this.Chrome = !0)
                : "Safari" == this.browser
                ? (this.Safari = !0)
                : "Edge" == this.browser
                ? (this.Edge = !0)
                : "Opera" == this.browser && (this.Opera = !0);
        this.supportsClipboardWriting = document.queryCommandSupported("copy");
        this.identifyOS();
        "Windows" == this.OS ? (this.Windows = !0) : "iOS" == this.OS ? (this.iOS = !0) : "MacOS" == this.OS && (this.MacOS = !0);
    },
    identifyBrowser: function () {
        for (var a = 0; a < this.dataBrowser.length; a++) {
            var c = this.dataBrowser[a];
            if (-1 != (c.string || navigator.userAgent).indexOf(c.subString)) {
                this.browser = c.identity;
                a = c.versionSearch || c.subString;
                (c = this.searchVersion(navigator.userAgent, a))
                    ? ((this.version = c), (this.majorVersion = Math.floor(c)))
                    : (c = this.searchVersion(navigator.appVersion, a))
                    ? ((this.version = c), (this.majorVersion = Math.floor(c)))
                    : (this.majorVersion = this.version = "Unknown");
                return;
            }
        }
        this.version = this.browser = "Unknown";
    },
    identifyOS: function () {
        for (var a = 0; a < this.dataOS.length; a++)
            if (-1 != this.dataOS[a].string.indexOf(this.dataOS[a].subString)) {
                this.OS = this.dataOS[a].identity;
                return;
            }
        this.OS = "Unknown";
    },
    searchVersion: function (a, c) {
        var b;
        return -1 != (b = a.indexOf(c)) ? parseFloat(a.substring(b + c.length + 1)) : null;
    },
    dataBrowser: [
        { subString: "Opera", identity: "Opera" },
        { subString: "OPR", identity: "Opera" },
        { subString: "Edge", identity: "Edge" },
        { subString: "MSIE", identity: "Explorer" },
        { subString: "Trident", identity: "Explorer", versionSearch: "rv" },
        { subString: "Firefox", identity: "Firefox" },
        { subString: "Chrome", identity: "Chrome" },
        { string: navigator.vendor, subString: "Apple", identity: "Safari", versionSearch: "Version" },
        { subString: "Apple", identity: "Safari", versionSearch: "Version" },
    ],
    dataOS: [
        { string: navigator.platform, subString: "Mac", identity: "MacOS" },
        { string: navigator.platform, subString: "iPad", identity: "iOS" },
        { string: navigator.platform, subString: "iPhone", identity: "iOS" },
        { string: navigator.platform, subString: "iPod", identity: "iOS" },
        { string: navigator.userAgent, subString: "Android", identity: "Android" },
        { string: navigator.userAgent, subString: "android", identity: "Android" },
        { string: navigator.platform, subString: "Linux", identity: "Linux" },
        { string: navigator.platform, subString: "Win", identity: "Windows" },
    ],
};
BrowserDetect.init();

function DocumentClickTracker() {
    var a = this;
    a.mouseDownTarget = null;
    a.touchStartData = { id: null, target: null };
    a.callback = null;
    a.captureEsc = !0;
    a.start = function (c, b, d) {
        if (null !== a.callback) throw "Cannot execute DocumentClickTracker.start(): already started.";
        a.captureEsc = void 0 !== d ? d : !0;
        a.callback = c;
        a.ignoredElement = b;
        document.addEventListener("mousedown", a.onMouseDown, !0);
        a.captureEsc && document.addEventListener("keydown", a.onKeyDown, !0);
        void 0 !== document.ontouchstart && (document.addEventListener("touchstart", a.onTouchStart, !0), document.addEventListener("touchmove", a.onTouchMove, !0), document.addEventListener("touchend", a.onTouchEnd, !0));
    };
    a.stop = function () {
        null !== a.callback &&
            ((a.callback = null),
            document.removeEventListener("mousedown", a.onMouseDown, !0),
            a.captureEsc && document.removeEventListener("keydown", a.onKeyDown, !0),
            void 0 !== document.ontouchstart && (document.removeEventListener("touchstart", a.onTouchStart, !0), document.removeEventListener("touchmove", a.onTouchMove, !0), document.removeEventListener("touchend", a.onTouchEnd, !0)));
    };
    a.reset = function () {
        a.mouseDownTarget = null;
        a.touchStartData.id = null;
    };
    a.onMouseDown = function (c) {
        0 !== c.button || (a.ignoredElement && a.ignoredElement.contains(c.target)) || a.callback(c.target);
    };
    a.onTouchStart = function (c) {
        1 != c.touches.length || c.altKey || c.shiftKey || c.ctrlKey || c.metaKey
            ? null !== a.touchStartData.id && (a.touchStartData.id = null)
            : ((a.touchStartData.id = c.changedTouches[0].identifier), (a.touchStartData.target = c.target));
    };
    a.onTouchMove = function (c) {
        null !== a.touchStartData.id && 1 == c.changedTouches.length && (a.touchStartData.id = null);
    };
    a.onTouchEnd = function (c) {
        0 != c.touches.length ||
            c.altKey ||
            c.shiftKey ||
            c.ctrlKey ||
            c.metaKey ||
            c.changedTouches[0].identifier != a.touchStartData.id ||
            (a.ignoredElement && a.ignoredElement.contains(c.target)) ||
            (a.callback(a.touchStartData.target), (a.touchStartData.id = null));
    };
    a.onKeyDown = function (c) {
        27 != c.keyCode || c.shiftKey || c.altKey || c.ctrlKey || c.metaKey || a.callback(document);
    };
}

function getViewportHeight() {
    return window.innerHeight ? window.innerHeight : 0 < document.documentElement.clientHeight ? document.documentElement.clientHeight : 0 < document.body.clientHeight ? document.body.clientHeight : !1;
}

function getViewportWidth() {
    return window.innerWidth ? window.innerWidth : 0 < document.documentElement.clientWidth ? document.documentElement.clientWidth : 0 < document.body.clientWidth ? document.body.clientWidth : !1;
}

function PlayIndicator(a) {
    var c = this;
    c.div = a;
    c.update = function () {
        c.div.className = tones.playing ? "playing " + window.waveType : "stopped " + window.waveType;
    };
}

function onPlayButtonClick() {
    tones.playing ? ((window.playButton.innerHTML = "Play"), tones.stop()) : ((window.playButton.innerHTML = "Stop"), tones.play(window.sliderFreq, window.waveType));
    window.playIndicator.update();
}

function formatNumber(a) {
    a = a.toString().split(".");
    if (1 == a.length) return a[0].toLocaleString("en-US", { style: "currency", useGrouping: !0 }) + " <small>Hz</small>";
    if (2 == a.length) return 2 >= a[1].length ? a[0].toLocaleString("en-US") + "<small>." + a[1] + " Hz</small>" : "<small>~&thinsp;</small>" + a[0].toLocaleString("en-US") + "<small>." + a[1].slice(0, 2) + " Hz</small>";
}

function separateThousands(a) {
    a = a.toString();
    for (var c = "", b = a.length - 1 - 2; 0 < b; b -= 3) c = "," + a.substr(b, 3) + c;
    return (c = a.slice(0, b + 3) + c);
}

function formatHertz(a) {
    a = a.toString().split(".");
    if (1 == a.length) return separateThousands(a[0]) + " <small>Hz</small>";
    if (2 == a.length) {
        if (2 >= a[1].length) return separateThousands(a[0]) + "<small>." + a[1] + " Hz</small>";
        var c = "5" <= a[1].charAt(2) ? parseInt(a[1].slice(0, 2)) + 1 : a[1].slice(0, 2);
        return "<small>~&thinsp;</small>" + separateThousands(a[0]) + "<small>." + c + " Hz</small>";
    }
}

function setFreq(a) {
    if (a < MIN_FREQ || a > MAX_FREQ) return !1;
    if (a == window.sliderFreq) return !0;
    window.slider_jq.slider("value", freqToSliderPos(a));
    window.sliderFreq = a;
    window.freqReadout.update();
    updateAriaValue();
    window.noteSelector.updateFromFreq();
    tones.current.setFreq(window.sliderFreq);
}

function setKey(a) {
    if (a < MIN_PIANO_KEY || a > MAX_PIANO_KEY) return !1;
    window.sliderFreq = 440 * Math.pow(2, (a - 49) / 12);
    window.slider_jq.slider("value", freqToSliderPos(window.sliderFreq));
    window.freqReadout.update();
    updateAriaValue();
    window.noteSelector.displayKey(a);
    tones.current.setFreq(window.sliderFreq);
}

function setVolume(a) {
    if (0 > a || 1 < a) return !1;
    window.volume = a;
    tones.current.setVolume(window.volume);
    $(window.volSlider).slider("value", 100 * a);
    $("#volume-readout").html(formatPercent(window.volume));
}

function setWaveType(a) {
    window.waveType = a;
    window.waveSelector.update();
    tones.playing && window.playIndicator.update();
    tones.current.setType(a);
}

function setBalance(a, c) {
    void 0 === c && (c = !0);
    if (-1 > a || 1 < a) return !1;
    window.balance = a;
    tones.current.setBalance(a);
    window.balanceControl.update(c);
}

function moveSliderBy(a) {
    a = window.slider_jq.slider("value") + a;
    window.slider_jq.slider("option", "value", a);
    window.sliderFreq = sliderPosToFreq(a);
    window.freqReadout.update();
    updateAriaValue();
    window.noteSelector.updateFromFreq();
    tones.current.setFreq(window.sliderFreq);
}

function formatPercent(a) {
    return Math.round(100 * a).toString() + "%";
}

function sliderPosToFreq(a) {
    return Math.round(20 * Math.pow(1.0025, a) - 19);
}

function freqToSliderPos(a) {
    return Math.round(Math.log((a + 19) / 20) / Math.log(1.0025));
}

function changeFreqBy1Hz(a) {
    1 == a ? window.setFreq(Math.floor(window.sliderFreq) + a) : -1 == a && window.setFreq(Math.ceil(window.sliderFreq) + a);
}

function changeFreqByHundredthHz(a) {
    1 == a ? window.setFreq((Math.floor(100 * (window.sliderFreq + 1e-7)) + a) / 100) : -1 == a && window.setFreq((Math.ceil(100 * (window.sliderFreq - 1e-7)) + a) / 100);
}

function changeFreqByThousandthHz(a) {
    1 == a ? window.setFreq((Math.floor(1e3 * (window.sliderFreq + 1e-7)) + a) / 1e3) : -1 == a && window.setFreq((Math.ceil(1e3 * (window.sliderFreq - 1e-7)) + a) / 1e3);
}

function FrequencyReadout(a) {
    var c = this,
        b = document.querySelector(a),
        d,
        e;
    if (!b) throw "Cannot find element " + a;
    a = document.createElement("small");
    var g = document.createTextNode(""),
        f = document.createTextNode(""),
        h = document.createTextNode(""),
        k = document.createElement("small"),
        l = document.createTextNode(" Hz");
    a.appendChild(g);
    k.appendChild(h);
    k.appendChild(l);
    b.appendChild(a);
    b.appendChild(f);
    b.appendChild(k);
    c.tildeOn = !1;
    c.fractionOn = !1;
    c.update = function (a) {
        a || (a = 3);
        var b = Math.floor(window.sliderFreq);
        0 < window.sliderFreq - b
            ? window.sliderFreq.toString().length <= b.toString().length + a + 1
                ? ((a = b.toString()), (f.nodeValue = separateThousands(a)), (h.nodeValue = window.sliderFreq.toString().slice(a.length)), (c.fractionOn = !0), (g.nodeValue = ""))
                : ((b = Math.round(window.sliderFreq * Math.pow(10, a)) / Math.pow(10, a)),
                  (f.nodeValue = separateThousands(Math.floor(b).toString())),
                  (h.nodeValue = b.toFixed(a).slice(-(a + 1))),
                  (c.fractionOn = !0),
                  (g.nodeValue = "~\u2009"),
                  (c.tildeOn = !0))
            : ((f.nodeValue = separateThousands(b.toString())), c.fractionOn && (h.nodeValue = ""), c.tildeOn && (g.nodeValue = ""));
    };
    var n = function () {
            isNaN(parseFloat(d.value)) || window.setFreq(parseFloat(d.value));
        },
        p = function (a) {
            isNaN(parseFloat(d.value)) || window.setFreq(parseFloat(d.value));
            c.closeEdit();
        },
        m = function (a) {
            if (!(a.shiftKey || a.ctrlKey || a.altKey || a.metaKey))
                switch (a.keyCode) {
                    case 13:
                        c.edit(), a.stopPropagation(), a.preventDefault();
                }
        },
        q = function (a) {
            n();
            c.closeEdit();
        },
        r = function (a) {
            if (!(a.shiftKey || a.ctrlKey || a.altKey || a.metaKey))
                switch (a.keyCode) {
                    case 13:
                        n();
                        break;
                    case 27:
                        c.closeEdit();
                }
        };
    c.edit = function () {
        d && c.destroyEdit();
        b.classList.add("editing");
        d = document.createElement("input");
        d.type = "number";
        d.value = window.sliderFreq.toString();
        b.onclick = null;
        b.removeEventListener("keydown", m, !0);
        b.appendChild(d);
        d.onchange = n;
        d.onkeydown = r;
        d.onblur = q;
        d.style.opacity = "0";
        d.style.transition = "opacity 0.1s linear";
        reflow(d.clientHeight);
        d.tabIndex = b.tabIndex;
        b.tabIndex = "";
        d.focus();
        d.style.opacity = "1";
        e = new DocumentClickTracker();
        e.start(p, b, !1);
    };
    c.closeEdit = function () {
        if (!d) return !1;
        b.tabIndex = d.tabIndex;
        d.style.opacity = "0";
        d.addEventListener("transitionend", function (a) {
            "opacity" == a.propertyName && c.destroyEdit();
        });
    };
    c.destroyEdit = function () {
        if (!d) return !1;
        b.classList.remove("editing");
        b.removeChild(d);
        d = null;
        b.onclick = c.edit;
        b.addEventListener("keydown", m, !0);
        b.focus();
        e.stop();
    };
    b.onclick = c.edit;
    b.addEventListener("keydown", m, !0);
}

function Dialog(a) {
    var c = this;
    if (document.getElementById(a)) return !1;
    c.show = function (b, d, e) {
        c.div = document.createElement("div");
        c.div.id = a;
        var g = c.div.style;
        g.position = "fixed";
        g.visibility = "hidden";
        g.opacity = "0";
        if (d.closeButton) {
            var f = document.createElement("button");
            f.className = "close-button";
            f.appendChild(document.createTextNode("\u00d7"));
            f.onclick = c.hide;
            c.div.appendChild(f);
        }
        c.div.appendChild(b);
        document.body.appendChild(c.div);
        if (d.fullscreen)
            if (((b = c.div.getBoundingClientRect()), (g.left = Math.round((getViewportWidth() - b.width) / 2) + "px"), void 0 === d.fullscreenVertPoint || isNaN(d.fullscreenVertPoint)))
                g.top = Math.round((getViewportHeight() - b.height) / 2) + "px";
            else {
                f = getViewportHeight();
                const a = Math.min(b.height / 2 / f, 0.5);
                g.top = Math.round(f * Math.min(Math.max(d.fullscreenVertPoint, a), 1 - a) - b.height / 2) + "px";
            }
        reflow(c.div.clientHeight);
        d.closeOnDocumentClick && ((c.tracker = new DocumentClickTracker()), c.tracker.start(c.hide, c.div));
        g.transition = "opacity 0.1s linear";
        g.visibility = "";
        g.opacity = "";
        c.callback = e;
    };
    c.hide = function () {
        if (!c.div) return !1;
        c.div.addEventListener("transitionend", function (a) {
            "opacity" == a.propertyName && c.destroy();
        });
        c.div.style.transition = "opacity 0.1s linear, visibility 0s linear 0.1s";
        c.div.style.opacity = "0";
        c.div.style.visibility = "hidden";
        c.tracker && c.tracker.stop();
        c.callback && c.callback(Dialog.DIALOG_CLOSE);
    };
    c.destroy = function () {
        document.body.removeChild(c.div);
        c.div = null;
    };
}

Dialog.DIALOG_CLOSE = 0;

var noteSelectorWindow = {
    panel: null,
    dialog: null,
    selectedButton: null,
    buttonArray: [],
    callback4NoteSelect: null,
    callback4WindowClose: null,
    prepare: function () {
        var a = document.createElement("table"),
            c = 1 < FIRST_C ? FIRST_C - 12 : 1,
            b = FIRST_C - 12;
        do {
            var d = document.createElement("tr");
            b += 12;
            for (c; c < b && c <= MAX_PIANO_KEY; c++) {
                var e = document.createElement("td"),
                    g = (c - FIRST_C + 12) % 12;
                if (1 == g || 3 == g || 6 == g || 8 == g || 10 == g) e.className = "halftone";
                1 <= c && e.appendChild(noteSelectorWindow.createButton(c));
                d.appendChild(e);
            }
            a.appendChild(d);
        } while (c <= MAX_PIANO_KEY);
        noteSelectorWindow.panel = a;
    },
    createButton: function (a) {
        var c = document.createElement("button"),
            b = 440 * Math.pow(2, (a - 49) / 12);
        c.value = a;
        var d = NOTE_NAMES[a].indexOf(" "),
            e = NOTE_NAMES[a].indexOf("\u2009/");
        -1 == d && (d = NOTE_NAMES[a].length);
        -1 == e && (e = NOTE_NAMES[a].length);
        d = NOTE_NAMES[a].slice(0, Math.min(d, e));
        b = (b !== Math.floor(b) ? "~" : "") + b.toFixed(0);
        c.innerHTML = d + "<small>" + b + "</small>";
        c.title = NOTE_NAMES[a] + " (" + b + " Hz)";
        c.onclick = noteSelectorWindow.onButtonClick;
        return (this.buttonArray[a] = c);
    },
    onButtonClick: function (a) {
        noteSelectorWindow.selectedButton && noteSelectorWindow.selectedButton.classList.remove("selected");
        this.classList.add("selected");
        noteSelectorWindow.selectedButton = this;
        noteSelectorWindow.callback4NoteSelect(this.value);
    },
    onDialogOutput: function (a) {
        a === Dialog.DIALOG_CLOSE && noteSelectorWindow.callback4WindowClose();
    },
    show: function (a, c) {
        noteSelectorWindow.dialog = new Dialog("note-selector-panel");
        noteSelectorWindow.dialog.show &&
            (null == noteSelectorWindow.panel && noteSelectorWindow.prepare(),
            noteSelectorWindow.dialog.show(noteSelectorWindow.panel, { closeButton: !0 }, noteSelectorWindow.onDialogOutput),
            (noteSelectorWindow.callback4NoteSelect = a),
            (noteSelectorWindow.callback4WindowClose = c),
            noteSelectorWindow.panel.querySelector("button").focus());
    },
    highlightButton: function (a) {
        noteSelectorWindow.selectedButton && noteSelectorWindow.selectedButton.classList.remove("selected");
        -1 != a && (a = noteSelectorWindow.buttonArray[a]) && (a.classList.add("selected"), (noteSelectorWindow.selectedButton = a));
    },
}

function NoteSelector(a, c) {
    var b = this;
    b.button = a;
    b.windowShown = !1;
    b.tilde = document.createTextNode("");
    b.button.appendChild(b.tilde);
    b.buttonText = document.createTextNode("");
    b.button.appendChild(b.buttonText);
    b.button.onclick = function (a) {
        noteSelectorWindow.show(c, function () {
            b.windowShown = !1;
            b.button.classList.remove("window-shown");
        });
        b.windowShown = !0;
        b.button.classList.add("window-shown");
        b.updateFromFreq();
    };
    b.updateFromFreq = function () {
        var a = 12 * Math.log2(window.sliderFreq / 440) + 49,
            c = Math.round(a);
        c < MIN_PIANO_KEY
            ? ((b.buttonText.nodeValue = "below A0"), (b.tilde.nodeValue = ""))
            : c > MAX_PIANO_KEY
            ? ((b.buttonText.nodeValue = "above " + NOTE_NAMES[MAX_PIANO_KEY]), (b.tilde.nodeValue = ""))
            : ((b.buttonText.nodeValue = NOTE_NAMES[c]), (b.tilde.nodeValue = a == c ? "" : "~ "), b.windowShown && noteSelectorWindow.highlightButton(a == c ? a : -1));
    };
    b.displayKey = function (a) {
        b.buttonText.nodeValue = NOTE_NAMES[a];
        b.tilde.nodeValue = "";
    };
}

function DropDown(a) {
    var c = this;
    if (document.getElementById(a)) return !1;
    c.show = function (b, d, e) {
        c.div && c.destroy();
        c.srcElement = d;
        c.div = document.createElement("div");
        c.div.className = "drop-down-menu";
        c.div.id = a;
        var g = document.createElement("div");
        g.className = "tail";
        c.div.appendChild(g);
        var f = d.getBoundingClientRect();
        d = Math.round((f.left + f.right) / 2);
        var h = c.div.style;
        h.position = "fixed";
        h.visibility = "hidden";
        h.opacity = "0";
        document.body.appendChild(c.div);
        c.div.appendChild(b);
        var k = c.div.getBoundingClientRect(),
            l = getViewportWidth();
        b = Math.round((f.left + f.right - k.width) / 2);
        5 > b && (b = 5);
        b + k.width > l - 20 && (b = l - k.width - 20);
        f = Math.round(f.bottom + 25);
        h.left = b + "px";
        h.top = f + "px";
        g.style.left = d - b + "px";
        h.transition = "opacity 0.1s linear";
        h.visibility = "";
        h.opacity = "";
        c.callback = e;
        c.tracker = new DocumentClickTracker();
        c.tracker.start(c.onDocumentClick, c.div);
        adUnits.disable();
    };
    c.onDocumentClick = function (a) {
        c.hide();
    };
    c.hide = function () {
        if (!c.div) return !1;
        c.tracker.stop();
        c.srcElement.focus();
        c.div.addEventListener("transitionend", function (a) {
            "opacity" == a.propertyName && c.destroy();
        });
        c.div.style.transition = "opacity 0.1s linear, visibility 0s linear 0.1s";
        c.div.style.opacity = "0";
        c.div.style.visibility = "hidden";
        adUnits.enable();
        c.callback && c.callback(DropDown.DROPDOWN_CLOSE);
    };
    c.destroy = function () {
        document.body.removeChild(c.div);
        c.div = null;
        c.callback = null;
        c.tracker.stop();
    };
}

DropDown.DROPDOWN_CLOSE = {};

function DropDownMenu(a) {
    var c = this;
    c.dropDown = new DropDown(a);
    if (!c.dropDown.show) return !1;
    c.show = function (a, d, e, g) {
        for (var b = document.createDocumentFragment(), h = 0; h < a.length; h++) {
            var k = a[h];
            k.onclick = c.onOptionClick;
            k.value == d && (k.classList.add("selected"), (c.selectedButton = k));
            b.appendChild(k);
        }
        c.callback = g;
        c.dropDown.show(b, e, g);
        c.dropDown.div.querySelector("button").focus();
    };
    c.onOptionClick = function (a) {
        c.selectedButton && c.selectedButton.classList.remove("selected");
        c.selectedButton = this;
        c.selectedButton.classList.add("selected");
        c.callback(this.value);
    };
}

function WaveSelector(a, c) {
    var b = this;
    b.value = "";
    b.button = a;
    b.menuShown = !1;
    var d = document.createElement("span");
    d.className = "image-" + b.value;
    b.button.appendChild(d);
    var e = [];
    a = document.createElement("button");
    a.value = "sine";
    a.tabIndex = b.button.tabIndex + 1;
    var g = document.createElement("span");
    g.className = "image-" + a.value;
    a.appendChild(g);
    a.appendChild(document.createTextNode("sine"));
    e.push(a);
    a = document.createElement("button");
    a.value = "square";
    a.tabIndex = b.button.tabIndex + 2;
    g = document.createElement("span");
    g.className = "image-" + a.value;
    a.appendChild(g);
    a.appendChild(document.createTextNode("square"));
    e.push(a);
    a = document.createElement("button");
    a.value = "triangle";
    a.tabIndex = b.button.tabIndex + 3;
    g = document.createElement("span");
    g.className = "image-" + a.value;
    a.appendChild(g);
    a.appendChild(document.createTextNode("triangle"));
    e.push(a);
    a = document.createElement("button");
    a.value = "sawtooth";
    a.tabIndex = b.button.tabIndex + 4;
    g = document.createElement("span");
    g.className = "image-" + a.value;
    a.appendChild(g);
    a.appendChild(document.createTextNode("sawtooth"));
    e.push(a);
    b.onMenuOutput = function (a) {
        a === DropDown.DROPDOWN_CLOSE ? (b.button.classList.remove("control-shown"), (b.menuShown = !1)) : c(a);
    };
    b.update = function () {
        b.value = window.waveType;
        d.className = "image-" + b.value;
    };
    b.button.onclick = function (a) {
        if (b.menuShown) return !1;
        a = new DropDownMenu("wave-selector-menu");
        a.show && (a.show(e, b.value, this, b.onMenuOutput), b.button.classList.add("control-shown"), (b.menuShown = !0));
    };
}

function BalanceControl(a, c) {
    var b = this;
    b.sliderContainer = null;
    b.readoutLeftVal = b.readoutRightVal = null;
    b.button = a;
    b.shown = !1;
    b.LspeakerIcon = document.getElementById("balance-control-L-speaker-icon");
    b.RspeakerIcon = document.getElementById("balance-control-R-speaker-icon");
    b.onDropDownAction = function (a) {
        a === DropDown.DROPDOWN_CLOSE ? (b.button.classList.remove("control-shown"), (b.shown = !1)) : c(a);
    };
    b.update = function (a) {
        void 0 === a && (a = !0);
        var c = Math.min(1, 1 - window.balance),
            d = Math.min(1, 1 + window.balance);
        b.LspeakerIcon && (b.LspeakerIcon.style.opacity = Math.round(100 * c) / 100);
        b.RspeakerIcon && (b.RspeakerIcon.style.opacity = Math.round(100 * d) / 100);
        b.shown && ((b.readoutLeftVal.nodeValue = Math.round(100 * c) + "%"), (b.readoutRightVal.nodeValue = Math.round(100 * d) + "%"), a && $(b.sliderContainer).slider("value", window.balance));
    };
    b.button.onclick = function (a) {
        if (b.shown) return !1;
        b.dropDown = new DropDown("balance-control-popup");
        if (!b.dropDown.show) return !1;
        a = document.createDocumentFragment();
        var c = document.createElement("div");
        c.className = "balance-button-section";
        var d = document.createElement("button");
        d.className = "small-button";
        var f = d.cloneNode(!0),
            h = d.cloneNode(!0);
        d.innerHTML = "L";
        d.value = "L";
        d.title = "Left";
        d.tabIndex = b.button.tabIndex + 1;
        f.innerHTML = "C";
        f.value = "C";
        f.title = "Center";
        f.tabIndex = b.button.tabIndex + 2;
        h.innerHTML = "R";
        h.value = "R";
        h.title = "Right";
        h.tabIndex = b.button.tabIndex + 3;
        d.onclick = f.onclick = h.onclick = b.onLCRButtonClick;
        c.appendChild(d);
        c.appendChild(f);
        c.appendChild(h);
        a.appendChild(c);
        c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        c.setAttribute("class", "speaker-icon");
        c.id = "left-speaker-icon";
        d = document.createElementNS("http://www.w3.org/2000/svg", "use");
        d.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#svg-Lspeaker-icon");
        c.appendChild(d);
        a.appendChild(c);
        b.sliderContainer = document.createElement("span");
        b.sliderContainer.className = "balance-slider";
        a.appendChild(b.sliderContainer);
        c = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        c.setAttribute("class", "speaker-icon");
        c.id = "right-speaker-icon";
        d = document.createElementNS("http://www.w3.org/2000/svg", "use");
        d.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#svg-Rspeaker-icon");
        c.appendChild(d);
        a.appendChild(c);
        c = document.createElement("div");
        c.className = "balance-readout";
        d = document.createElement("div");
        f = document.createElement("span");
        b.readoutLeftVal = document.createTextNode("");
        f.appendChild(b.readoutLeftVal);
        d.appendChild(document.createTextNode("L: "));
        d.appendChild(f);
        f = document.createElement("div");
        h = document.createElement("span");
        b.readoutRightVal = document.createTextNode("");
        h.appendChild(b.readoutRightVal);
        f.appendChild(document.createTextNode("R: "));
        f.appendChild(h);
        c.appendChild(d);
        c.appendChild(f);
        a.appendChild(c);
        $(b.sliderContainer).slider({
            orientation: "horizontal",
            range: "min",
            min: -1,
            max: 1,
            value: 0,
            step: 0.01,
            slide: function (a, b) {
                window.setBalance(b.value, !1);
            },
            stop: function (a, b) {},
        });
        b.sliderContainer.querySelector(".ui-slider-handle").tabIndex = b.button.tabIndex + 4;
        b.shown = !0;
        b.update();
        b.dropDown.show(a, this, b.onDropDownAction);
        b.dropDown.div.querySelector("button").focus();
        b.button.classList.add("control-shown");
    };
    b.onLCRButtonClick = function (a) {
        switch (a.target.value) {
            case "L":
                window.setBalance(-1);
                break;
            case "C":
                window.setBalance(0);
                break;
            case "R":
                window.setBalance(1);
        }
    };
}

function handleKeyDown(a) {
    if (!a.altKey && !a.metaKey)
        switch (a.keyCode) {
            case 37:
                if (a.target != document.body && "BUTTON" != a.target.nodeName && a.target.parentNode != window.slider) break;
                a.preventDefault();
                a.stopPropagation();
                a.shiftKey ? (a.ctrlKey ? window.changeFreqByThousandthHz(-1) : window.changeFreqBy1Hz(-1)) : a.ctrlKey ? window.changeFreqByHundredthHz(-1) : window.moveSliderBy(-1);
                break;
            case 39:
                if (a.target != document.body && "BUTTON" != a.target.nodeName && a.target.parentNode != window.slider) break;
                a.preventDefault();
                a.stopPropagation();
                a.shiftKey ? (a.ctrlKey ? window.changeFreqByThousandthHz(1) : window.changeFreqBy1Hz(1)) : a.ctrlKey ? window.changeFreqByHundredthHz(1) : window.moveSliderBy(1);
                break;
            case 32:
                a.preventDefault(), onPlayButtonClick();
        }
}

function blockSpaceKeyUp(a) {
    a.ctrlKey || a.altKey || a.metaKey || 32 != a.keyCode || (a.preventDefault(), a.stopPropagation());
}

function UpDownButton(a, c) {
    this.button = document.getElementById(a);
    if (!this.button) return !1;
    this.intervalID = this.timeoutID = null;
    this.action = c;
    var b = this;
    this.startRepeatPress = function () {
        b.action();
        b.intervalID = setInterval(b.action, 80);
    };
    this.button.onmousedown = function (a) {
        b.timeoutID || b.intervalID || (b.action(), (b.timeoutID = setTimeout(b.startRepeatPress, 500)), window.addEventListener("mouseup", b.onMouseUp, !0));
    };
    this.onMouseUp = function (a) {
        b.timeoutID && (clearTimeout(b.timeoutID), (b.timeoutID = null));
        b.intervalID && (clearInterval(b.intervalID), (b.intervalID = null));
        window.removeEventListener("mouseup", b.onMouseUp);
    };
    this.button.ontouchstart = function (a) {
        b.timeoutID || b.intervalID || (a.preventDefault(), b.action(), (b.timeoutID = setTimeout(b.startRepeatPress, 500)));
    };
    this.button.ontouchend = function (a) {
        b.timeoutID && (clearTimeout(b.timeoutID), (b.timeoutID = null));
        b.intervalID && (clearInterval(b.intervalID), (b.intervalID = null));
        a.preventDefault();
    };
    this.button.onkeydown = function (a) {
        if (!(b.timeoutID || b.intervalID || a.shiftKey || a.ctrlKey || a.altKey || a.metaKey))
            switch (a.keyCode) {
                case 13:
                    b.action(), a.preventDefault(), a.stopPropagation();
            }
    };
}

function parseHash(a) {
    var c, b, d;
    if ("" != a) {
        a = a.split(",");
        for (let h of a)
            if (/^\d+\.?\d*$/.test(h) && void 0 === e && void 0 === g) var e = parseFloat(h);
            else if (/^[A-G]s?\d$/.test(h) && void 0 === g && void 0 === e) {
                h = h.replace("s", "\u266f");
                var g = NOTE_NAMES.findIndex(function (a) {
                    return h == a.substr(0, h.length);
                });
            } else if (void 0 === f && (d = /^(squ|saw|tri|sin)/.exec(h)))
                switch (d[0]) {
                    case "squ":
                        var f = "square";
                        break;
                    case "saw":
                        f = "sawtooth";
                        break;
                    case "tri":
                        f = "triangle";
                        break;
                    case "sin":
                        f = "sine";
                }
            else void 0 === c && /^v\d\.?\d*$/.test(h) ? (c = parseFloat(h.substr(1))) : void 0 === b && /^b-?\d\.?\d*$/.test(h) && (b = parseFloat(h.substr(1)));
    }
    if (void 0 === e) e = void 0 !== g && -1 != g ? 440 * Math.pow(2, (g - 49) / 12) : 440;
    else if (e < MIN_FREQ || e > MAX_FREQ) e = 440;
    void 0 === f && (f = "sine");
    if (void 0 === c || 0 > c || 1 < c) c = DEFAULT_VOLUME;
    if (void 0 === b || -1 > b || 1 < b) b = 0;
    return { freq: e, type: f, vol: c, bal: b };
}

function getShortURL() {
    var a = "www." == window.location.hostname.slice(0, 4) ? window.location.hostname.slice(4) : window.location.hostname;
    return window.location.protocol + "//" + a + "/tone#" + constructHash();
}

function constructHash() {
    var a = 12 * Math.log2(window.sliderFreq / 440) + 49;
    0 == a % 1 && a >= MIN_PIANO_KEY && a <= MAX_PIANO_KEY ? ((a = /^\w\u266f?\d/.exec(NOTE_NAMES[a])), (a = null !== a ? a[0].replace("\u266f", "s") : window.sliderFreq)) : (a = window.sliderFreq);
    "sine" != window.waveType && (a += "," + window.waveType.slice(0, 3));
    a += ",v" + window.volume;
    0 != window.balance && (a += ",b" + window.balance);
    return a;
}

function setTonePropertiesFromHash(a) {
    a = a ? parseHash(a) : parseHash(window.location.hash.substr(1));
    window.setFreq(a.freq);
    window.setWaveType(a.type);
    window.setVolume(a.vol);
    window.setBalance(a.bal);
}

function Tone(a, c) {
    var b = this;
    b.channels = 1 !== c ? 2 : 1;
    b.playing = !1;
    b.volume = 1;
    b.balance = 0;
    b.freq = 440;
    b.type = "sine";
    b.oscillator = b.gainNode = b.fadeGainNode = b.mergerNode = b.leftGainNode = b.rightGainNode = null;
    b.oscillatorStopTimeoutID = null;
    b.fadeStartTime = 0;
    b.init = function (c, e, g, f) {
        b.gainNode = a.createGain();
        b.fadeGainNode = a.createGain();
        2 == b.channels &&
            ((b.mergerNode = a.createChannelMerger(2)),
            (b.leftGainNode = a.createGain()),
            (b.rightGainNode = a.createGain()),
            b.leftGainNode.connect(b.mergerNode, 0, 0),
            b.rightGainNode.connect(b.mergerNode, 0, 1),
            b.mergerNode.connect(b.gainNode));
        b.gainNode.connect(b.fadeGainNode);
        b.fadeGainNode.connect(a.destination);
        b.freq = c || 440;
        b.type = e || "sine";
        b.volume = g || 1;
        b.balance = f || 0;
        2 == b.channels && ((b.leftGainNode.gain.value = Math.min(1, 1 - b.balance)), (b.rightGainNode.gain.value = Math.min(1, 1 + b.balance)));
        b.gainNode.gain.value = b.volume;
        b.fadeGainNode.gain.value = 0;
    };
    b.initOscillator = function () {
        b.oscillator = a.createOscillator();
        2 == b.channels ? (b.oscillator.connect(b.leftGainNode), b.oscillator.connect(b.rightGainNode)) : b.oscillator.connect(b.gainNode);
        b.oscillator.frequency.value = b.freq;
        b.oscillator.type = b.type;
    };
    b.play = function (c) {
        void 0 === c && (c = a.currentTime);
        if (b.oscillatorStopTimeoutID) clearTimeout(b.oscillatorStopTimeoutID), (b.oscillatorStopTimeoutID = null);
        else {
            if (b.playing) return !1;
            b.initOscillator();
            b.oscillator.start(c);
        }
        BrowserDetect.Firefox
            ? b.fadeGainNode.gain.setTargetAtTime(1, c, FADE_SET_TARGET_TIME_CONSTANT)
            : (b.fadeGainNode.gain.cancelScheduledValues(c), b.fadeGainNode.gain.setValueAtTime(b.fadeGainNode.gain.value, c), b.fadeGainNode.gain.linearRampToValueAtTime(1, c + FADE_TIME * (1 - b.fadeGainNode.gain.value)));
        b.playing = !0;
    };
    b.stop = function (c) {
        if (!b.playing) return !1;
        void 0 === c && (c = a.currentTime);
        if (BrowserDetect.Firefox) b.fadeGainNode.gain.setTargetAtTime(0, c, FADE_SET_TARGET_TIME_CONSTANT), (c = 1e3 * (c - a.currentTime + 8 * FADE_SET_TARGET_TIME_CONSTANT));
        else {
            b.fadeGainNode.gain.cancelScheduledValues(c);
            b.fadeGainNode.gain.setValueAtTime(b.fadeGainNode.gain.value, c);
            var d = FADE_TIME * b.fadeGainNode.gain.value;
            b.fadeGainNode.gain.linearRampToValueAtTime(0, c + d);
            c = 1e3 * (c - a.currentTime + d + 0.5);
        }
        b.oscillatorStopTimeoutID = setTimeout(function () {
            b.oscillator.stop();
            b.oscillatorStopTimeoutID = null;
            b.playing = !1;
        }, c);
    };
    b.setFreq = function (c) {
        b.freq = c;
        b.playing && b.oscillator.frequency.setTargetAtTime(c, a.currentTime, 0.03);
    };
    b.setType = function (a) {
        b.type = a;
        b.playing && (b.oscillator.type = a);
    };
    b.setBalance = function (c) {
        if (2 !== b.channels) return !1;
        b.balance = c;
        b.playing
            ? (b.leftGainNode.gain.setTargetAtTime(Math.min(1, 1 - c), a.currentTime, FADE_SET_TARGET_TIME_CONSTANT), b.rightGainNode.gain.setTargetAtTime(Math.min(1, 1 + c), a.currentTime, FADE_SET_TARGET_TIME_CONSTANT))
            : (b.leftGainNode.gain.setValueAtTime(Math.min(1, 1 - c), a.currentTime), b.rightGainNode.gain.setValueAtTime(Math.min(1, 1 + c), a.currentTime));
    };
    b.setVolume = function (c) {
        b.playing ? b.gainNode.gain.setTargetAtTime(c, a.currentTime, FADE_SET_TARGET_TIME_CONSTANT) : b.gainNode.gain.setValueAtTime(c, a.currentTime);
        b.volume = c;
    };
}

var tones = {
    array: [],
    current: null,
    playing: !1,
    init: function () {
        if (window.AudioContext) tones.context = new AudioContext();
        else if (window.webkitAudioContext) tones.context = new webkitAudioContext();
        else throw "Cannot initialize AudioContext";
    },
    add: function () {
        tones.current = new Tone(tones.context);
        tones.current.init();
        tones.array.push(tones.current);
    },
    remove: function (a) {
        if (!tones.array[a]) return !1;
        for (a += 1; a < tones.array[length]; a++) tones.array[a - 1] = tones.array[a];
        --tones.array.length;
    },
    select: function (a) {
        if (!tones.array[a]) return !1;
        tones.current = tones.array[a];
    },
    play: function () {
        tones.playing = !0;
        "suspended" == tones.context.state && tones.context.resume();
        for (var a = 0; a < tones.array.length; a++) tones.array[a].play();
    },
    stop: function () {
        tones.playing = !1;
        for (var a = 0; a < tones.array.length; a++) tones.array[a].stop();
    },
}

function updateAriaValue() {
    window.sliderHandle.setAttribute("aria-valuenow", window.sliderFreq);
}

document.addEventListener ? document.addEventListener("DOMContentLoaded", init, !1) : (window.onload = init);

function init() {
    if ((void 0 === window.AudioContext && void 0 === window.webkitAudioContext) || void 0 === Math.log2) {
        var a = document.createElement("div");
        a.id = "browser-warning";
        a.innerHTML = "The Online Tone Generator won\u2019t work because your browser does not fully support the Web Audio API. You can use the Online Tone Generator if you install a recent version of Firefox, Chrome or Safari.";
        document.body.appendChild(a);
    }
    document.addEventListener("keydown", handleKeyDown, !0);
    window.slider = document.getElementById("slider");
    window.volSlider = document.getElementById("volume-slider");
    $("#slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 2770,
        value: 440,
        step: 1,
        slide: function (a, c) {
            window.sliderFreq = sliderPosToFreq(c.value);
            window.freqReadout.update();
            updateAriaValue();
            window.noteSelector.updateFromFreq();
            tones.current.setFreq(window.sliderFreq);
        },
        stop: function (a, c) {},
    });
    $("#volume-slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 100,
        step: 1,
        slide: function (a, c) {
            window.volume = c.value / 100;
            $("#volume-readout").html(formatPercent(window.volume));
            tones.current.setVolume(window.volume);
        },
        stop: function (a, c) {},
    });
    window.sliderHandle = document.querySelector("#slider .ui-slider-handle");
    sliderHandle && ((sliderHandle.tabIndex = 20), sliderHandle.setAttribute("role", "slider"));
    if ((a = document.querySelector("#volume-slider .ui-slider-handle"))) a.tabIndex = 30;
    window.playButton = document.getElementById("play-button");
    window.playButton.onclick = onPlayButtonClick;
    new UpDownButton("freq-up-button", function () {
        window.changeFreqBy1Hz(1);
    });
    new UpDownButton("freq-down-button", function () {
        window.changeFreqBy1Hz(-1);
    });
    a = document.getElementById("octave-up-button");
    var c = document.getElementById("octave-down-button");
    a.onclick = function () {
        window.setFreq(2 * window.sliderFreq);
    };
    c.onclick = function () {
        window.setFreq(window.sliderFreq / 2);
    };
    window.slider_jq = $("#slider");
    window.freqReadout = new FrequencyReadout("#freq-readout");
    window.playIndicator = new PlayIndicator(document.getElementById("play-indicator"));
    window.balanceControl = new BalanceControl(document.getElementById("balance-control"), window.setBalance);
    window.noteSelector = new NoteSelector(document.getElementById("note-selector"), window.setKey);
    window.waveSelector = new WaveSelector(document.getElementById("wave-selector"), window.setWaveType);
    window.getLinkButton = document.getElementById("get-link");
    window.getLinkButton.onclick = function () {
        var a = new DropDown("notice");
        navigator.clipboard.writeText(getShortURL()).then(
            function () {
                a.show(document.createTextNode("Link to current tone copied"), window.getLinkButton);
            },
            function () {
                a.show(document.createTextNode("Error: Could not copy link to clipboard"), window.getLinkButton);
            }
        );
    };
    tones.init();
    tones.add();
    setTonePropertiesFromHash();
    window.playButton = document.getElementById("play-button");
    window.playButton.addEventListener("keyup", blockSpaceKeyUp);
}

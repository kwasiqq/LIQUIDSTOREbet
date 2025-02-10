$.suggest = function(e, r) {
    var a = $(e).attr("autocomplete", "off"),
        n = $(document.createElement("ul")),
        t = !0,
        s = 0,
        l = [],
        i = 0;
    n.addClass(r.resultsClass).appendTo(a.parent()), c(), $(window).resize(c), a.blur(function() {
        setTimeout(function() {
            n.hide()
        }, 200)
    }), a.focus(function() {
        c()
    });
    try {
        n.bgiframe()
    } catch (e) {}

    function c() {
        var e = a.top + 2,
            t = a.left,
            s = a.outerWidth();
        n.css({
            top: e + "px",
            left: t + "px",
            width: s + "px"
        })
    }

    function u() {
        var s = $.trim(a.val()),
            e = $.trim($("#qtype").val());
        s.length >= r.minchars ? (cached = function(e) {
            for (var t = 0; t < l.length; t++)
                if (l[t].q == e) return l.unshift(l.splice(t, 1)[0]), l[0];
            return !1
        }(s), cached ? o(cached.items) : $.post(r.source, {
            query: s,
            type: e
        }, function(e) {
            n.hide();
            var t = function(e, t) {
                for (var s = [], a = e.split(r.delimiter), n = 0; n < a.length; n++) {
                    var l = $.trim(a[n]);
                    l && ((l = (l = l.replace(new RegExp(t, "ig"), function(e) {
                        return '<span class="' + r.matchClass + '">' + e + "</span>"
                    })).split("|"))[1] ? s[s.length] = "<span style='float:right'>" + l[1] + "</span><span class='tagname'>" + l[0] + "</span>" : s[s.length] = "<span class='tagname'>" + l[0] + "</span>")
                }
                return s
            }(e, s);
            o(t),
                function(e, t, s) {
                    for (; l.length && i + s > r.maxCacheSize;) {
                        var a = l.pop();
                        i -= a.size
                    }
                    l.push({
                        q: e,
                        size: s,
                        items: t
                    }), i += s
                }(s, t, e.length)
        })) : n.hide()
    }

    function o(e) {
        if (e)
            if (e.length) {
                for (var t = "", s = 0; s < e.length; s++) t += "<li>" + e[s] + "</li>";
                n.html(t).show(), $(".comboTreeDropDownContainer").hide(), n.children("li").mouseover(function() {
                    n.children("li").removeClass(r.selectClass), $(this).addClass(r.selectClass)
                }).click(function(e) {
                    e.preventDefault(), e.stopPropagation(), d()
                })
            } else n.hide()
    }

    function h() {
        if (!n.is(":visible")) return !1;
        var e = n.children("li." + r.selectClass);
        return e.length || (e = !1), e
    }

    function d() {
        $currentResult = h(), $currentResult && (a.val($currentResult.find(".tagname").text()), n.hide(), a.focus(), addrinfo(a[0]))
    }
    a.unbind('keydown');
    a.keydown(function(e) {
        if (/27$|38$|40$/.test(e.keyCode) && n.is(":visible") || /^13$|^9$/.test(e.keyCode) && h()) switch (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, e.keyCode) {
            case 38:
                $currentResult = h(), ($currentResult ? $currentResult.removeClass(r.selectClass).prev() : n.children("li:last-child")).addClass(r.selectClass), !void(($currentResult = h()) && a.val($currentResult.find(".tagname").text()));
                break;
            case 40:
                $currentResult = h(), ($currentResult ? $currentResult.removeClass(r.selectClass).next() : n.children("li:first-child")).addClass(r.selectClass), !void(($currentResult = h()) && a.val($currentResult.find(".tagname").text()));
                break;
            case 9:
            case 13:
                d();
                break;
            case 27:
                n.hide()
        } else a.val().length != s && (t && clearTimeout(t), t = setTimeout(u, r.delay), s = a.val().length)
    })
}, $.fn.suggest = function(e, t) {
    if (e) return (t = t || {}).source = e, t.delay = t.delay || 250, t.resultsClass = t.resultsClass || "ac_results", t.selectClass = t.selectClass || "ac_over", t.matchClass = t.matchClass || "ac_match", t.minchars = t.minchars || 2, t.delimiter = t.delimiter || "\n", t.maxCacheSize = t.maxCacheSize || 65536, this.each(function() {
        new $.suggest(this, t)
    }), this
};
$.cdek = function(e, a) {
    var l = $(e).attr("autocomplete", "off"),
        c = $(document.createElement("ul")),
        t = !0,
        s = 0,
        n = [],
        i = 0;
    c.addClass(a.resultsClass).appendTo(l.parent()), r(), $(window).resize(r), l.blur(function() {
        setTimeout(function() {
            c.hide()
        }, 200)
    }), l.focus(function() {
        r()
    });
    try {
        c.bgiframe()
    } catch (e) {}

    function r() {
        var e = l.top + 2,
            t = l.left,
            s = l.outerWidth();
        c.css({
            top: e + "px",
            left: t + "px",
            width: s + "px"
        })
    }

    function u() {
        var s = $.trim(l.val());
        s.length >= a.minchars ? (cached = function(e) {
            for (var t = 0; t < n.length; t++)
                if (n[t].q == e) return n.unshift(n.splice(t, 1)[0]), n[0];
            return !1
        }(s), cached ? o(cached.items) : $.post(a.source, {
            query: s
        }, function(e) {
            c.hide();
            var t = function(e, t) {
                for (var s = [], l = e.split(a.delimiter), c = 0; c < l.length; c++) {
                    var n = $.trim(l[c]);
                    n && ((n = n.split("|"))[0] = n[0].replace(new RegExp(t, "ig"), function(e) {
                        return '<span class="' + a.matchClass + '">' + e + "</span>"
                    }), s[s.length] = '<span class="cdekitem" cdek="' + n[1] + '" code="' + n[2] + '">' + n[0] + "</span>")
                }
                return s
            }(e, s);
            o(t),
                function(e, t, s) {
                    for (; n.length && i + s > a.maxCacheSize;) {
                        var l = n.pop();
                        i -= l.size
                    }
                    n.push({
                        q: e,
                        size: s,
                        items: t
                    }), i += s
                }(s, t, e.length)
        })) : c.hide()
    }

    function o(e) {
        if (e)
            if (e.length) {
                for (var t = "", s = 0; s < e.length; s++) t += "<li>" + e[s] + "</li>";
                c.html(t).show(), c.children("li").mouseover(function() {
                    c.children("li").removeClass(a.selectClass), $(this).addClass(a.selectClass)
                }).click(function(e) {
                    e.preventDefault(), e.stopPropagation(), h()
                })
            } else c.hide()
    }

    function d() {
        if (!c.is(":visible")) return !1;
        var e = c.children("li." + a.selectClass);
        return e.length || (e = !1), e
    }

    function h() {
        $currentResult = d(), $currentResult && (l.val(""), $("#cdek_btn").html($currentResult.find(".cdekitem").text()), $("#cdek_addr").val($currentResult.find(".cdekitem").text()), $("#cdek_code").val($currentResult.find(".cdekitem").attr("code")), $("#cdek_point").val($currentResult.find(".cdekitem").attr("cdek")), c.hide(), cdekinfo())
    }
    l.keydown(function(e) {
        if (/27$|38$|40$/.test(e.keyCode) && c.is(":visible") || /^13$|^9$/.test(e.keyCode) && d()) switch (e.preventDefault && e.preventDefault(), e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0, e.returnValue = !1, e.keyCode) {
            case 38:
                $currentResult = d(), ($currentResult ? $currentResult.removeClass(a.selectClass).prev() : c.children("li:last-child")).addClass(a.selectClass);
                break;
            case 40:
                $currentResult = d(), ($currentResult ? $currentResult.removeClass(a.selectClass).next() : c.children("li:first-child")).addClass(a.selectClass);
                break;
            case 9:
            case 13:
                h();
                break;
            case 27:
                c.hide()
        } else l.val().length != s && (t && clearTimeout(t), t = setTimeout(u, a.delay), s = l.val().length)
    })
}, $.fn.cdek = function(e, t) {
    if (e) return (t = t || {}).source = e, t.delay = t.delay || 250, t.resultsClass = t.resultsClass || "ac_results", t.selectClass = t.selectClass || "ac_over", t.matchClass = t.matchClass || "ac_match", t.minchars = t.minchars || 2, t.delimiter = t.delimiter || "\n", t.maxCacheSize = t.maxCacheSize || 65536, this.each(function() {
        new $.cdek(this, t)
    }), this
};
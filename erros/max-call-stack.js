if (typeof scriptletGlobals === 'undefined') {
    var scriptletGlobals = {};
}
;function safeSelf() {
    if (scriptletGlobals.safeSelf)
        return scriptletGlobals.safeSelf;
    const e = globalThis;
    const t = {
        Array_from: Array.from,
        Error: e.Error,
        Function_toStringFn: e.Function.prototype.toString,
        Function_toString: e => t.Function_toStringFn.call(e),
        Math_floor: Math.floor,
        Math_max: Math.max,
        Math_min: Math.min,
        Math_random: Math.random,
        Object: Object,
        Object_defineProperty: Object.defineProperty.bind(Object),
        Object_defineProperties: Object.defineProperties.bind(Object),
        Object_fromEntries: Object.fromEntries.bind(Object),
        Object_getOwnPropertyDescriptor: Object.getOwnPropertyDescriptor.bind(Object),
        Object_hasOwn: Object.hasOwn.bind(Object),
        Object_toString: Object.prototype.toString,
        RegExp: e.RegExp,
        RegExp_test: e.RegExp.prototype.test,
        RegExp_exec: e.RegExp.prototype.exec,
        Request_clone: e.Request.prototype.clone,
        String: e.String,
        String_fromCharCode: String.fromCharCode,
        String_split: String.prototype.split,
        XMLHttpRequest: e.XMLHttpRequest,
        addEventListener: e.EventTarget.prototype.addEventListener,
        removeEventListener: e.EventTarget.prototype.removeEventListener,
        fetch: e.fetch,
        JSON: e.JSON,
        JSON_parseFn: e.JSON.parse,
        JSON_stringifyFn: e.JSON.stringify,
        JSON_parse: (...e) => t.JSON_parseFn.call(t.JSON, ...e),
        JSON_stringify: (...e) => t.JSON_stringifyFn.call(t.JSON, ...e),
        log: console.log.bind(console),
        logLevel: 0,
        makeLogPrefix(...e) {
            return this.sendToLogger && `[${e.join(" \u205d ")}]` || ""
        },
        uboLog(...e) {
            if (this.sendToLogger === void 0)
                return;
            if (e === void 0 || e[0] === "")
                return;
            return this.sendToLogger("info", ...e)
        },
        uboErr(...e) {
            if (this.sendToLogger === void 0)
                return;
            if (e === void 0 || e[0] === "")
                return;
            return this.sendToLogger("error", ...e)
        },
        escapeRegexChars(e) {
            return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        },
        initPattern(e, t={}) {
            if (e === "")
                return {
                    matchAll: true,
                    expect: true
                };
            const r = t.canNegate !== true || e.startsWith("!") === false;
            if (r === false)
                e = e.slice(1);
            const n = /^\/(.+)\/([gimsu]*)$/.exec(e);
            if (n !== null)
                return {
                    re: new this.RegExp(n[1],n[2] || t.flags),
                    expect: r
                };
            if (t.flags !== void 0)
                return {
                    re: new this.RegExp(this.escapeRegexChars(e),t.flags),
                    expect: r
                };
            return {
                pattern: e,
                expect: r
            }
        },
        testPattern(e, t) {
            if (e.matchAll)
                return true;
            if (e.re)
                return this.RegExp_test.call(e.re, t) === e.expect;
            return t.includes(e.pattern) === e.expect
        },
        patternToRegex(e, t=void 0, r=false) {
            if (e === "")
                return /^/;
            const n = /^\/(.+)\/([gimsu]*)$/.exec(e);
            if (n === null) {
                const n = this.escapeRegexChars(e);
                return new RegExp(r ? `^${n}$` : n,t)
            }
            try {
                return new RegExp(n[1],n[2] || void 0)
            } catch {}
            return /^/
        },
        getExtraArgs(e, t=0) {
            const r = e.slice(t).reduce(( (e, t, r, n) => {
                if ((r & 1) === 0) {
                    const t = n[r + 1];
                    const o = /^\d+$/.test(t) ? parseInt(t, 10) : t;
                    e.push([n[r], o])
                }
                return e
            }
            ), []);
            return this.Object_fromEntries(r)
        },
        onIdle(t, r) {
            if (e.requestIdleCallback)
                return e.requestIdleCallback(t, r);
            return e.requestAnimationFrame(t)
        },
        offIdle(t) {
            if (e.requestIdleCallback)
                return e.cancelIdleCallback(t);
            return e.cancelAnimationFrame(t)
        }
    };
    scriptletGlobals.safeSelf = t;
    if (scriptletGlobals.bcSecret === void 0)
        return t;
    t.logLevel = scriptletGlobals.logLevel || 1;
    let r = "";
    let n = "";
    let o = 0;
    t.toLogText = (e, ...t) => {
        if (t.length === 0)
            return;
        const s = `[${document.location.hostname || document.location.href}]${t.join(" ")}`;
        if (s === n && e === r)
            if (Date.now() - o < 5e3)
                return;
        r = e;
        n = s;
        o = Date.now();
        return s
    }
    ;
    try {
        const r = new e.BroadcastChannel(scriptletGlobals.bcSecret);
        let n = [];
        t.sendToLogger = (e, ...o) => {
            const s = t.toLogText(e, ...o);
            if (s === void 0)
                return;
            if (n === void 0)
                return r.postMessage({
                    what: "messageToLogger",
                    type: e,
                    text: s
                });
            n.push({
                type: e,
                text: s
            })
        }
        ;
        r.onmessage = e => {
            const o = e.data;
            switch (o) {
            case "iamready!":
                if (n === void 0)
                    break;
                n.forEach(( ({type: e, text: t}) => r.postMessage({
                    what: "messageToLogger",
                    type: e,
                    text: t
                })));
                n = void 0;
                break;
            case "setScriptletLogLevelToOne":
                t.logLevel = 1;
                break;
            case "setScriptletLogLevelToTwo":
                t.logLevel = 2;
                break
            }
        }
        ;
        r.postMessage("areyouready?")
    } catch {
        t.sendToLogger = (e, ...r) => {
            const n = t.toLogText(e, ...r);
            if (n === void 0)
                return;
            t.log(`uBO ${n}`)
        }
    }
    return t
}
;function proxyApplyFn(t="", p="") {
    let o = globalThis;
    let n = t;
    for (; ; ) {
        const t = n.indexOf(".");
        if (t === -1)
            break;
        o = o[n.slice(0, t)];
        if (o instanceof Object === false)
            return;
        n = n.slice(t + 1)
    }
    const r = o[n];
    if (typeof r !== "function")
        return;
    if (proxyApplyFn.CtorContext === void 0) {
        proxyApplyFn.ctorContexts = [];
        proxyApplyFn.CtorContext = class {
            constructor(...t) {
                this.init(...t)
            }
            init(t, p) {
                this.callFn = t;
                this.callArgs = p;
                return this
            }
            reflect() {
                const t = Reflect.construct(this.callFn, this.callArgs);
                this.callFn = this.callArgs = this.private = void 0;
                proxyApplyFn.ctorContexts.push(this);
                return t
            }
            static factory(...t) {
                return proxyApplyFn.ctorContexts.length !== 0 ? proxyApplyFn.ctorContexts.pop().init(...t) : new proxyApplyFn.CtorContext(...t)
            }
        }
        ;
        proxyApplyFn.applyContexts = [];
        proxyApplyFn.ApplyContext = class {
            constructor(...t) {
                this.init(...t)
            }
            init(t, p, o) {
                this.callFn = t;
                this.thisArg = p;
                this.callArgs = o;
                return this
            }
            reflect() {
                const t = Reflect.apply(this.callFn, this.thisArg, this.callArgs);
                this.callFn = this.thisArg = this.callArgs = this.private = void 0;
                proxyApplyFn.applyContexts.push(this);
                return t
            }
            static factory(...t) {
                return proxyApplyFn.applyContexts.length !== 0 ? proxyApplyFn.applyContexts.pop().init(...t) : new proxyApplyFn.ApplyContext(...t)
            }
        }
        ;
        proxyApplyFn.isCtor = new Map;
        proxyApplyFn.proxies = new WeakMap;
        proxyApplyFn.nativeToString = Function.prototype.toString;
        const t = new Proxy(Function.prototype.toString,{
            apply(t, p) {
                let o = p;
                for (; ; ) {
                    const t = proxyApplyFn.proxies.get(o);
                    if (t === void 0)
                        break;
                    o = t
                }
                return proxyApplyFn.nativeToString.call(o)
            }
        });
        proxyApplyFn.proxies.set(t, proxyApplyFn.nativeToString);
        Function.prototype.toString = t
    }
    if (proxyApplyFn.isCtor.has(t) === false)
        proxyApplyFn.isCtor.set(t, r.prototype?.constructor === r);
    const i = {
        apply(t, o, n) {
            return p(proxyApplyFn.ApplyContext.factory(t, o, n))
        }
    };
    if (proxyApplyFn.isCtor.get(t))
        i.construct = function(t, o) {
            return p(proxyApplyFn.CtorContext.factory(t, o))
        }
        ;
    const l = new Proxy(r,i);
    proxyApplyFn.proxies.set(l, r);
    o[n] = l
}
;(function trustedPreventDomBypass(e="", n="") {
    if (e === "")
        return;
    const t = safeSelf();
    const o = t.makeLogPrefix("trusted-prevent-dom-bypass", e, n);
    proxyApplyFn(e, (function(e) {
        const c = new Set(e.callArgs.filter((e => e instanceof HTMLElement)));
        const i = e.reflect();
        if (c.length === 0)
            return i;
        for (const e of c)
            try {
                if (`${e.contentWindow}` !== "[object Window]")
                    continue;
                if (e.contentWindow.location.href !== "about:blank")
                    if (e.contentWindow.location.href !== self.location.href)
                        continue;
                if (n !== "") {
                    let t = self
                      , o = e.contentWindow;
                    let c = n;
                    for (; ; ) {
                        const e = c.indexOf(".");
                        if (e === -1)
                            break;
                        const n = c.slice(0, e);
                        t = t[n];
                        o = o[n];
                        c = c.slice(e + 1)
                    }
                    o[c] = t[c]
                } else
                    Object.defineProperty(e, "contentWindow", {
                        value: self
                    });
                t.uboLog(o, "Bypass prevented")
            } catch {}
        return i
    }
    ))
}
)(...[`Node\.prototype\.appendChild`, `JSON\.parse`, `{{3}}`, `{{4}}`, `{{5}}`, `{{6}}`, `{{7}}`, `{{8}}`, `{{9}}`, `{{10}}`].filter( (a, i) => a !== '{{' + (i + 1) + '}}').map( (a) => decodeURIComponent(a)))

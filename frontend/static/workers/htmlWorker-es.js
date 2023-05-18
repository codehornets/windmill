var ta = Object.defineProperty;
var na = (e, t, n) => t in e ? ta(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ye = (e, t, n) => (na(e, typeof t != "symbol" ? t + "" : t, n), n);
class ra {
  constructor() {
    this.listeners = [], this.unexpectedErrorHandler = function(t) {
      setTimeout(() => {
        throw t.stack ? Qe.isErrorNoTelemetry(t) ? new Qe(t.message + `

` + t.stack) : new Error(t.message + `

` + t.stack) : t;
      }, 0);
    };
  }
  emit(t) {
    this.listeners.forEach((n) => {
      n(t);
    });
  }
  onUnexpectedError(t) {
    this.unexpectedErrorHandler(t), this.emit(t);
  }
  onUnexpectedExternalError(t) {
    this.unexpectedErrorHandler(t);
  }
}
const ia = new ra();
function aa(e) {
  sa(e) || ia.onUnexpectedError(e);
}
function Dn(e) {
  if (e instanceof Error) {
    const { name: t, message: n } = e, r = e.stacktrace || e.stack;
    return {
      $isError: !0,
      name: t,
      message: n,
      stack: r,
      noTelemetry: Qe.isErrorNoTelemetry(e)
    };
  }
  return e;
}
const jt = "Canceled";
function sa(e) {
  return e instanceof oa ? !0 : e instanceof Error && e.name === jt && e.message === jt;
}
class oa extends Error {
  constructor() {
    super(jt), this.name = this.message;
  }
}
class Qe extends Error {
  constructor(t) {
    super(t), this.name = "ErrorNoTelemetry";
  }
  static fromError(t) {
    if (t instanceof Qe)
      return t;
    const n = new Qe();
    return n.message = t.message, n.stack = t.stack, n;
  }
  static isErrorNoTelemetry(t) {
    return t.name === "ErrorNoTelemetry";
  }
}
function la(e) {
  const t = this;
  let n = !1, r;
  return function() {
    return n || (n = !0, r = e.apply(t, arguments)), r;
  };
}
var wt;
(function(e) {
  function t(M) {
    return M && typeof M == "object" && typeof M[Symbol.iterator] == "function";
  }
  e.is = t;
  const n = Object.freeze([]);
  function r() {
    return n;
  }
  e.empty = r;
  function* i(M) {
    yield M;
  }
  e.single = i;
  function s(M) {
    return M || n;
  }
  e.from = s;
  function l(M) {
    return !M || M[Symbol.iterator]().next().done === !0;
  }
  e.isEmpty = l;
  function u(M) {
    return M[Symbol.iterator]().next().value;
  }
  e.first = u;
  function o(M, z) {
    for (const D of M)
      if (z(D))
        return !0;
    return !1;
  }
  e.some = o;
  function c(M, z) {
    for (const D of M)
      if (z(D))
        return D;
  }
  e.find = c;
  function* h(M, z) {
    for (const D of M)
      z(D) && (yield D);
  }
  e.filter = h;
  function* d(M, z) {
    let D = 0;
    for (const p of M)
      yield z(p, D++);
  }
  e.map = d;
  function* f(...M) {
    for (const z of M)
      for (const D of z)
        yield D;
  }
  e.concat = f;
  function* g(M) {
    for (const z of M)
      for (const D of z)
        yield D;
  }
  e.concatNested = g;
  function _(M, z, D) {
    let p = D;
    for (const m of M)
      p = z(p, m);
    return p;
  }
  e.reduce = _;
  function w(M, z) {
    let D = 0;
    for (const p of M)
      z(p, D++);
  }
  e.forEach = w;
  function* y(M, z, D = M.length) {
    for (z < 0 && (z += M.length), D < 0 ? D += M.length : D > M.length && (D = M.length); z < D; z++)
      yield M[z];
  }
  e.slice = y;
  function k(M, z = Number.POSITIVE_INFINITY) {
    const D = [];
    if (z === 0)
      return [D, M];
    const p = M[Symbol.iterator]();
    for (let m = 0; m < z; m++) {
      const b = p.next();
      if (b.done)
        return [D, e.empty()];
      D.push(b.value);
    }
    return [D, { [Symbol.iterator]() {
      return p;
    } }];
  }
  e.consume = k;
  function v(M) {
    return k(M)[0];
  }
  e.collect = v;
  function L(M, z, D = (p, m) => p === m) {
    const p = M[Symbol.iterator](), m = z[Symbol.iterator]();
    for (; ; ) {
      const b = p.next(), I = m.next();
      if (b.done !== I.done)
        return !1;
      if (b.done)
        return !0;
      if (!D(b.value, I.value))
        return !1;
    }
  }
  e.equals = L;
})(wt || (wt = {}));
class ua extends Error {
  constructor(t) {
    super(`Encountered errors while disposing of store. Errors: [${t.join(", ")}]`), this.errors = t;
  }
}
function Mi(e) {
  if (wt.is(e)) {
    const t = [];
    for (const n of e)
      if (n)
        try {
          n.dispose();
        } catch (r) {
          t.push(r);
        }
    if (t.length === 1)
      throw t[0];
    if (t.length > 1)
      throw new ua(t);
    return Array.isArray(e) ? [] : e;
  } else if (e)
    return e.dispose(), e;
}
function ca(...e) {
  return _t(() => Mi(e));
}
function _t(e) {
  return {
    dispose: la(() => {
      e();
    })
  };
}
class Pe {
  constructor() {
    this._toDispose = /* @__PURE__ */ new Set(), this._isDisposed = !1;
  }
  dispose() {
    this._isDisposed || (this._isDisposed = !0, this.clear());
  }
  get isDisposed() {
    return this._isDisposed;
  }
  clear() {
    try {
      Mi(this._toDispose.values());
    } finally {
      this._toDispose.clear();
    }
  }
  add(t) {
    if (!t)
      return t;
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._isDisposed ? Pe.DISABLE_DISPOSED_WARNING || console.warn(new Error("Trying to add a disposable to a DisposableStore that has already been disposed of. The added object will be leaked!").stack) : this._toDispose.add(t), t;
  }
}
Pe.DISABLE_DISPOSED_WARNING = !1;
class Tn {
  constructor() {
    this._store = new Pe(), this._store;
  }
  dispose() {
    this._store.dispose();
  }
  _register(t) {
    if (t === this)
      throw new Error("Cannot register a disposable on itself!");
    return this._store.add(t);
  }
}
Tn.None = Object.freeze({ dispose() {
} });
class ha {
  constructor() {
    this.dispose = () => {
    }, this.unset = () => {
    }, this.isset = () => !1;
  }
  set(t) {
    let n = t;
    return this.unset = () => n = void 0, this.isset = () => n !== void 0, this.dispose = () => {
      n && (n(), n = void 0);
    }, this;
  }
}
let Y = class {
  constructor(t) {
    this.element = t, this.next = Y.Undefined, this.prev = Y.Undefined;
  }
};
Y.Undefined = new Y(void 0);
class vt {
  constructor() {
    this._first = Y.Undefined, this._last = Y.Undefined, this._size = 0;
  }
  get size() {
    return this._size;
  }
  isEmpty() {
    return this._first === Y.Undefined;
  }
  clear() {
    let t = this._first;
    for (; t !== Y.Undefined; ) {
      const n = t.next;
      t.prev = Y.Undefined, t.next = Y.Undefined, t = n;
    }
    this._first = Y.Undefined, this._last = Y.Undefined, this._size = 0;
  }
  unshift(t) {
    return this._insert(t, !1);
  }
  push(t) {
    return this._insert(t, !0);
  }
  _insert(t, n) {
    const r = new Y(t);
    if (this._first === Y.Undefined)
      this._first = r, this._last = r;
    else if (n) {
      const s = this._last;
      this._last = r, r.prev = s, s.next = r;
    } else {
      const s = this._first;
      this._first = r, r.next = s, s.prev = r;
    }
    this._size += 1;
    let i = !1;
    return () => {
      i || (i = !0, this._remove(r));
    };
  }
  shift() {
    if (this._first !== Y.Undefined) {
      const t = this._first.element;
      return this._remove(this._first), t;
    }
  }
  pop() {
    if (this._last !== Y.Undefined) {
      const t = this._last.element;
      return this._remove(this._last), t;
    }
  }
  _remove(t) {
    if (t.prev !== Y.Undefined && t.next !== Y.Undefined) {
      const n = t.prev;
      n.next = t.next, t.next.prev = n;
    } else
      t.prev === Y.Undefined && t.next === Y.Undefined ? (this._first = Y.Undefined, this._last = Y.Undefined) : t.next === Y.Undefined ? (this._last = this._last.prev, this._last.next = Y.Undefined) : t.prev === Y.Undefined && (this._first = this._first.next, this._first.prev = Y.Undefined);
    this._size -= 1;
  }
  *[Symbol.iterator]() {
    let t = this._first;
    for (; t !== Y.Undefined; )
      yield t.element, t = t.next;
  }
}
globalThis && globalThis.__awaiter;
let da = typeof document < "u" && document.location && document.location.hash.indexOf("pseudo=true") >= 0;
function fa(e, t) {
  let n;
  return t.length === 0 ? n = e : n = e.replace(/\{(\d+)\}/g, (r, i) => {
    const s = i[0], l = t[s];
    let u = r;
    return typeof l == "string" ? u = l : (typeof l == "number" || typeof l == "boolean" || l === void 0 || l === null) && (u = String(l)), u;
  }), da && (n = "［" + n.replace(/[aouei]/g, "$&$&") + "］"), n;
}
function ma(e, t, ...n) {
  return fa(t, n);
}
var Ft;
const Ke = "en";
let Gt = !1, $t = !1, Pt = !1, Di = !1, dt, Bt = Ke, pa, Ee;
const ie = typeof self == "object" ? self : typeof global == "object" ? global : {};
let re;
typeof ie.vscode < "u" && typeof ie.vscode.process < "u" ? re = ie.vscode.process : typeof process < "u" && (re = process);
const ga = typeof ((Ft = re == null ? void 0 : re.versions) === null || Ft === void 0 ? void 0 : Ft.electron) == "string", ba = ga && (re == null ? void 0 : re.type) === "renderer";
if (typeof navigator == "object" && !ba)
  Ee = navigator.userAgent, Gt = Ee.indexOf("Windows") >= 0, $t = Ee.indexOf("Macintosh") >= 0, (Ee.indexOf("Macintosh") >= 0 || Ee.indexOf("iPad") >= 0 || Ee.indexOf("iPhone") >= 0) && navigator.maxTouchPoints && navigator.maxTouchPoints > 0, Pt = Ee.indexOf("Linux") >= 0, Di = !0, ma({ key: "ensureLoaderPluginIsLoaded", comment: ["{Locked}"] }, "_"), dt = Ke, Bt = dt;
else if (typeof re == "object") {
  Gt = re.platform === "win32", $t = re.platform === "darwin", Pt = re.platform === "linux", Pt && re.env.SNAP && re.env.SNAP_REVISION, re.env.CI || re.env.BUILD_ARTIFACTSTAGINGDIRECTORY, dt = Ke, Bt = Ke;
  const e = re.env.VSCODE_NLS_CONFIG;
  if (e)
    try {
      const t = JSON.parse(e), n = t.availableLanguages["*"];
      dt = t.locale, Bt = n || Ke, pa = t._translationsConfigFile;
    } catch {
    }
} else
  console.error("Unable to resolve platform.");
const it = Gt, wa = $t;
Di && ie.importScripts;
const Ae = Ee, _a = typeof ie.postMessage == "function" && !ie.importScripts;
(() => {
  if (_a) {
    const e = [];
    ie.addEventListener("message", (n) => {
      if (n.data && n.data.vscodeScheduleAsyncWork)
        for (let r = 0, i = e.length; r < i; r++) {
          const s = e[r];
          if (s.id === n.data.vscodeScheduleAsyncWork) {
            e.splice(r, 1), s.callback();
            return;
          }
        }
    });
    let t = 0;
    return (n) => {
      const r = ++t;
      e.push({
        id: r,
        callback: n
      }), ie.postMessage({ vscodeScheduleAsyncWork: r }, "*");
    };
  }
  return (e) => setTimeout(e);
})();
const va = !!(Ae && Ae.indexOf("Chrome") >= 0);
Ae && Ae.indexOf("Firefox") >= 0;
!va && Ae && Ae.indexOf("Safari") >= 0;
Ae && Ae.indexOf("Edg/") >= 0;
Ae && Ae.indexOf("Android") >= 0;
const ya = ie.performance && typeof ie.performance.now == "function";
class zt {
  constructor(t) {
    this._highResolution = ya && t, this._startTime = this._now(), this._stopTime = -1;
  }
  static create(t = !0) {
    return new zt(t);
  }
  stop() {
    this._stopTime = this._now();
  }
  elapsed() {
    return this._stopTime !== -1 ? this._stopTime - this._startTime : this._now() - this._startTime;
  }
  _now() {
    return this._highResolution ? ie.performance.now() : Date.now();
  }
}
var Xt;
(function(e) {
  e.None = () => Tn.None;
  function t(D) {
    return (p, m = null, b) => {
      let I = !1, C;
      return C = D((x) => {
        if (!I)
          return C ? C.dispose() : I = !0, p.call(m, x);
      }, null, b), I && C.dispose(), C;
    };
  }
  e.once = t;
  function n(D, p, m) {
    return o((b, I = null, C) => D((x) => b.call(I, p(x)), null, C), m);
  }
  e.map = n;
  function r(D, p, m) {
    return o((b, I = null, C) => D((x) => {
      p(x), b.call(I, x);
    }, null, C), m);
  }
  e.forEach = r;
  function i(D, p, m) {
    return o((b, I = null, C) => D((x) => p(x) && b.call(I, x), null, C), m);
  }
  e.filter = i;
  function s(D) {
    return D;
  }
  e.signal = s;
  function l(...D) {
    return (p, m = null, b) => ca(...D.map((I) => I((C) => p.call(m, C), null, b)));
  }
  e.any = l;
  function u(D, p, m, b) {
    let I = m;
    return n(D, (C) => (I = p(I, C), I), b);
  }
  e.reduce = u;
  function o(D, p) {
    let m;
    const b = {
      onFirstListenerAdd() {
        m = D(I.fire, I);
      },
      onLastListenerRemove() {
        m == null || m.dispose();
      }
    }, I = new ke(b);
    return p == null || p.add(I), I.event;
  }
  function c(D, p, m = 100, b = !1, I, C) {
    let x, W, P, B = 0;
    const q = {
      leakWarningThreshold: I,
      onFirstListenerAdd() {
        x = D((T) => {
          B++, W = p(W, T), b && !P && (S.fire(W), W = void 0), clearTimeout(P), P = setTimeout(() => {
            const E = W;
            W = void 0, P = void 0, (!b || B > 1) && S.fire(E), B = 0;
          }, m);
        });
      },
      onLastListenerRemove() {
        x.dispose();
      }
    }, S = new ke(q);
    return C == null || C.add(S), S.event;
  }
  e.debounce = c;
  function h(D, p = (b, I) => b === I, m) {
    let b = !0, I;
    return i(D, (C) => {
      const x = b || !p(C, I);
      return b = !1, I = C, x;
    }, m);
  }
  e.latch = h;
  function d(D, p, m) {
    return [
      e.filter(D, p, m),
      e.filter(D, (b) => !p(b), m)
    ];
  }
  e.split = d;
  function f(D, p = !1, m = []) {
    let b = m.slice(), I = D((W) => {
      b ? b.push(W) : x.fire(W);
    });
    const C = () => {
      b == null || b.forEach((W) => x.fire(W)), b = null;
    }, x = new ke({
      onFirstListenerAdd() {
        I || (I = D((W) => x.fire(W)));
      },
      onFirstListenerDidAdd() {
        b && (p ? setTimeout(C) : C());
      },
      onLastListenerRemove() {
        I && I.dispose(), I = null;
      }
    });
    return x.event;
  }
  e.buffer = f;
  class g {
    constructor(p) {
      this.event = p, this.disposables = new Pe();
    }
    map(p) {
      return new g(n(this.event, p, this.disposables));
    }
    forEach(p) {
      return new g(r(this.event, p, this.disposables));
    }
    filter(p) {
      return new g(i(this.event, p, this.disposables));
    }
    reduce(p, m) {
      return new g(u(this.event, p, m, this.disposables));
    }
    latch() {
      return new g(h(this.event, void 0, this.disposables));
    }
    debounce(p, m = 100, b = !1, I) {
      return new g(c(this.event, p, m, b, I, this.disposables));
    }
    on(p, m, b) {
      return this.event(p, m, b);
    }
    once(p, m, b) {
      return t(this.event)(p, m, b);
    }
    dispose() {
      this.disposables.dispose();
    }
  }
  function _(D) {
    return new g(D);
  }
  e.chain = _;
  function w(D, p, m = (b) => b) {
    const b = (...W) => x.fire(m(...W)), I = () => D.on(p, b), C = () => D.removeListener(p, b), x = new ke({ onFirstListenerAdd: I, onLastListenerRemove: C });
    return x.event;
  }
  e.fromNodeEventEmitter = w;
  function y(D, p, m = (b) => b) {
    const b = (...W) => x.fire(m(...W)), I = () => D.addEventListener(p, b), C = () => D.removeEventListener(p, b), x = new ke({ onFirstListenerAdd: I, onLastListenerRemove: C });
    return x.event;
  }
  e.fromDOMEventEmitter = y;
  function k(D) {
    return new Promise((p) => t(D)(p));
  }
  e.toPromise = k;
  function v(D, p) {
    return p(void 0), D((m) => p(m));
  }
  e.runAndSubscribe = v;
  function L(D, p) {
    let m = null;
    function b(C) {
      m == null || m.dispose(), m = new Pe(), p(C, m);
    }
    b(void 0);
    const I = D((C) => b(C));
    return _t(() => {
      I.dispose(), m == null || m.dispose();
    });
  }
  e.runAndSubscribeWithStore = L;
  class M {
    constructor(p, m) {
      this.obs = p, this._counter = 0, this._hasChanged = !1;
      const b = {
        onFirstListenerAdd: () => {
          p.addObserver(this);
        },
        onLastListenerRemove: () => {
          p.removeObserver(this);
        }
      };
      this.emitter = new ke(b), m && m.add(this.emitter);
    }
    beginUpdate(p) {
      this._counter++;
    }
    handleChange(p, m) {
      this._hasChanged = !0;
    }
    endUpdate(p) {
      --this._counter === 0 && this._hasChanged && (this._hasChanged = !1, this.emitter.fire(this.obs.get()));
    }
  }
  function z(D, p) {
    return new M(D, p).emitter.event;
  }
  e.fromObservable = z;
})(Xt || (Xt = {}));
class Wt {
  constructor(t) {
    this._listenerCount = 0, this._invocationCount = 0, this._elapsedOverall = 0, this._name = `${t}_${Wt._idPool++}`;
  }
  start(t) {
    this._stopWatch = new zt(!0), this._listenerCount = t;
  }
  stop() {
    if (this._stopWatch) {
      const t = this._stopWatch.elapsed();
      this._elapsedOverall += t, this._invocationCount += 1, console.info(`did FIRE ${this._name}: elapsed_ms: ${t.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`), this._stopWatch = void 0;
    }
  }
}
Wt._idPool = 0;
class kn {
  constructor(t) {
    this.value = t;
  }
  static create() {
    var t;
    return new kn((t = new Error().stack) !== null && t !== void 0 ? t : "");
  }
  print() {
    console.warn(this.value.split(`
`).slice(2).join(`
`));
  }
}
class Ta {
  constructor(t, n, r) {
    this.callback = t, this.callbackThis = n, this.stack = r, this.subscription = new ha();
  }
  invoke(t) {
    this.callback.call(this.callbackThis, t);
  }
}
class ke {
  constructor(t) {
    var n, r;
    this._disposed = !1, this._options = t, this._leakageMon = void 0, this._perfMon = !((n = this._options) === null || n === void 0) && n._profName ? new Wt(this._options._profName) : void 0, this._deliveryQueue = (r = this._options) === null || r === void 0 ? void 0 : r.deliveryQueue;
  }
  dispose() {
    var t, n, r, i;
    this._disposed || (this._disposed = !0, this._listeners && this._listeners.clear(), (t = this._deliveryQueue) === null || t === void 0 || t.clear(this), (r = (n = this._options) === null || n === void 0 ? void 0 : n.onLastListenerRemove) === null || r === void 0 || r.call(n), (i = this._leakageMon) === null || i === void 0 || i.dispose());
  }
  get event() {
    return this._event || (this._event = (t, n, r) => {
      var i, s, l;
      this._listeners || (this._listeners = new vt());
      const u = this._listeners.isEmpty();
      u && (!((i = this._options) === null || i === void 0) && i.onFirstListenerAdd) && this._options.onFirstListenerAdd(this);
      let o, c;
      this._leakageMon && this._listeners.size >= 30 && (c = kn.create(), o = this._leakageMon.check(c, this._listeners.size + 1));
      const h = new Ta(t, n, c), d = this._listeners.push(h);
      u && (!((s = this._options) === null || s === void 0) && s.onFirstListenerDidAdd) && this._options.onFirstListenerDidAdd(this), !((l = this._options) === null || l === void 0) && l.onListenerDidAdd && this._options.onListenerDidAdd(this, t, n);
      const f = h.subscription.set(() => {
        o == null || o(), this._disposed || (d(), this._options && this._options.onLastListenerRemove && (this._listeners && !this._listeners.isEmpty() || this._options.onLastListenerRemove(this)));
      });
      return r instanceof Pe ? r.add(f) : Array.isArray(r) && r.push(f), f;
    }), this._event;
  }
  fire(t) {
    var n, r;
    if (this._listeners) {
      this._deliveryQueue || (this._deliveryQueue = new Aa());
      for (const i of this._listeners)
        this._deliveryQueue.push(this, i, t);
      (n = this._perfMon) === null || n === void 0 || n.start(this._deliveryQueue.size), this._deliveryQueue.deliver(), (r = this._perfMon) === null || r === void 0 || r.stop();
    }
  }
}
class ka {
  constructor() {
    this._queue = new vt();
  }
  get size() {
    return this._queue.size;
  }
  push(t, n, r) {
    this._queue.push(new Ca(t, n, r));
  }
  clear(t) {
    const n = new vt();
    for (const r of this._queue)
      r.emitter !== t && n.push(r);
    this._queue = n;
  }
  deliver() {
    for (; this._queue.size > 0; ) {
      const t = this._queue.shift();
      try {
        t.listener.invoke(t.event);
      } catch (n) {
        aa(n);
      }
    }
  }
}
class Aa extends ka {
  clear(t) {
    this._queue.clear();
  }
}
class Ca {
  constructor(t, n, r) {
    this.emitter = t, this.listener = n, this.event = r;
  }
}
function Sa(e) {
  let t = [], n = Object.getPrototypeOf(e);
  for (; Object.prototype !== n; )
    t = t.concat(Object.getOwnPropertyNames(n)), n = Object.getPrototypeOf(n);
  return t;
}
function Jt(e) {
  const t = [];
  for (const n of Sa(e))
    typeof e[n] == "function" && t.push(n);
  return t;
}
function xa(e, t) {
  const n = (i) => function() {
    const s = Array.prototype.slice.call(arguments, 0);
    return t(i, s);
  }, r = {};
  for (const i of e)
    r[i] = n(i);
  return r;
}
function La(e, t = "Unreachable") {
  throw new Error(t);
}
class Ea {
  constructor(t) {
    this.fn = t, this.lastCache = void 0, this.lastArgKey = void 0;
  }
  get(t) {
    const n = JSON.stringify(t);
    return this.lastArgKey !== n && (this.lastArgKey = n, this.lastCache = this.fn(t)), this.lastCache;
  }
}
class Ri {
  constructor(t) {
    this.executor = t, this._didRun = !1;
  }
  hasValue() {
    return this._didRun;
  }
  getValue() {
    if (!this._didRun)
      try {
        this._value = this.executor();
      } catch (t) {
        this._error = t;
      } finally {
        this._didRun = !0;
      }
    if (this._error)
      throw this._error;
    return this._value;
  }
  get rawValue() {
    return this._value;
  }
}
var Ni;
function Ma(e) {
  return e.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, "\\$&");
}
function Da(e) {
  return e.split(/\r\n|\r|\n/);
}
function Ra(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    const r = e.charCodeAt(t);
    if (r !== 32 && r !== 9)
      return t;
  }
  return -1;
}
function Na(e, t = e.length - 1) {
  for (let n = t; n >= 0; n--) {
    const r = e.charCodeAt(n);
    if (r !== 32 && r !== 9)
      return n;
  }
  return -1;
}
function Ui(e) {
  return e >= 65 && e <= 90;
}
function Qt(e) {
  return 55296 <= e && e <= 56319;
}
function Ua(e) {
  return 56320 <= e && e <= 57343;
}
function Ia(e, t) {
  return (e - 55296 << 10) + (t - 56320) + 65536;
}
function Ha(e, t, n) {
  const r = e.charCodeAt(n);
  if (Qt(r) && n + 1 < t) {
    const i = e.charCodeAt(n + 1);
    if (Ua(i))
      return Ia(r, i);
  }
  return r;
}
const za = /^[\t\n\r\x20-\x7E]*$/;
function Wa(e) {
  return za.test(e);
}
class ge {
  constructor(t) {
    this.confusableDictionary = t;
  }
  static getInstance(t) {
    return ge.cache.get(Array.from(t));
  }
  static getLocales() {
    return ge._locales.getValue();
  }
  isAmbiguous(t) {
    return this.confusableDictionary.has(t);
  }
  getPrimaryConfusable(t) {
    return this.confusableDictionary.get(t);
  }
  getConfusableCodePoints() {
    return new Set(this.confusableDictionary.keys());
  }
}
Ni = ge;
ge.ambiguousCharacterData = new Ri(() => JSON.parse('{"_common":[8232,32,8233,32,5760,32,8192,32,8193,32,8194,32,8195,32,8196,32,8197,32,8198,32,8200,32,8201,32,8202,32,8287,32,8199,32,8239,32,2042,95,65101,95,65102,95,65103,95,8208,45,8209,45,8210,45,65112,45,1748,45,8259,45,727,45,8722,45,10134,45,11450,45,1549,44,1643,44,8218,44,184,44,42233,44,894,59,2307,58,2691,58,1417,58,1795,58,1796,58,5868,58,65072,58,6147,58,6153,58,8282,58,1475,58,760,58,42889,58,8758,58,720,58,42237,58,451,33,11601,33,660,63,577,63,2429,63,5038,63,42731,63,119149,46,8228,46,1793,46,1794,46,42510,46,68176,46,1632,46,1776,46,42232,46,1373,96,65287,96,8219,96,8242,96,1370,96,1523,96,8175,96,65344,96,900,96,8189,96,8125,96,8127,96,8190,96,697,96,884,96,712,96,714,96,715,96,756,96,699,96,701,96,700,96,702,96,42892,96,1497,96,2036,96,2037,96,5194,96,5836,96,94033,96,94034,96,65339,91,10088,40,10098,40,12308,40,64830,40,65341,93,10089,41,10099,41,12309,41,64831,41,10100,123,119060,123,10101,125,65342,94,8270,42,1645,42,8727,42,66335,42,5941,47,8257,47,8725,47,8260,47,9585,47,10187,47,10744,47,119354,47,12755,47,12339,47,11462,47,20031,47,12035,47,65340,92,65128,92,8726,92,10189,92,10741,92,10745,92,119311,92,119355,92,12756,92,20022,92,12034,92,42872,38,708,94,710,94,5869,43,10133,43,66203,43,8249,60,10094,60,706,60,119350,60,5176,60,5810,60,5120,61,11840,61,12448,61,42239,61,8250,62,10095,62,707,62,119351,62,5171,62,94015,62,8275,126,732,126,8128,126,8764,126,65372,124,65293,45,120784,50,120794,50,120804,50,120814,50,120824,50,130034,50,42842,50,423,50,1000,50,42564,50,5311,50,42735,50,119302,51,120785,51,120795,51,120805,51,120815,51,120825,51,130035,51,42923,51,540,51,439,51,42858,51,11468,51,1248,51,94011,51,71882,51,120786,52,120796,52,120806,52,120816,52,120826,52,130036,52,5070,52,71855,52,120787,53,120797,53,120807,53,120817,53,120827,53,130037,53,444,53,71867,53,120788,54,120798,54,120808,54,120818,54,120828,54,130038,54,11474,54,5102,54,71893,54,119314,55,120789,55,120799,55,120809,55,120819,55,120829,55,130039,55,66770,55,71878,55,2819,56,2538,56,2666,56,125131,56,120790,56,120800,56,120810,56,120820,56,120830,56,130040,56,547,56,546,56,66330,56,2663,57,2920,57,2541,57,3437,57,120791,57,120801,57,120811,57,120821,57,120831,57,130041,57,42862,57,11466,57,71884,57,71852,57,71894,57,9082,97,65345,97,119834,97,119886,97,119938,97,119990,97,120042,97,120094,97,120146,97,120198,97,120250,97,120302,97,120354,97,120406,97,120458,97,593,97,945,97,120514,97,120572,97,120630,97,120688,97,120746,97,65313,65,119808,65,119860,65,119912,65,119964,65,120016,65,120068,65,120120,65,120172,65,120224,65,120276,65,120328,65,120380,65,120432,65,913,65,120488,65,120546,65,120604,65,120662,65,120720,65,5034,65,5573,65,42222,65,94016,65,66208,65,119835,98,119887,98,119939,98,119991,98,120043,98,120095,98,120147,98,120199,98,120251,98,120303,98,120355,98,120407,98,120459,98,388,98,5071,98,5234,98,5551,98,65314,66,8492,66,119809,66,119861,66,119913,66,120017,66,120069,66,120121,66,120173,66,120225,66,120277,66,120329,66,120381,66,120433,66,42932,66,914,66,120489,66,120547,66,120605,66,120663,66,120721,66,5108,66,5623,66,42192,66,66178,66,66209,66,66305,66,65347,99,8573,99,119836,99,119888,99,119940,99,119992,99,120044,99,120096,99,120148,99,120200,99,120252,99,120304,99,120356,99,120408,99,120460,99,7428,99,1010,99,11429,99,43951,99,66621,99,128844,67,71922,67,71913,67,65315,67,8557,67,8450,67,8493,67,119810,67,119862,67,119914,67,119966,67,120018,67,120174,67,120226,67,120278,67,120330,67,120382,67,120434,67,1017,67,11428,67,5087,67,42202,67,66210,67,66306,67,66581,67,66844,67,8574,100,8518,100,119837,100,119889,100,119941,100,119993,100,120045,100,120097,100,120149,100,120201,100,120253,100,120305,100,120357,100,120409,100,120461,100,1281,100,5095,100,5231,100,42194,100,8558,68,8517,68,119811,68,119863,68,119915,68,119967,68,120019,68,120071,68,120123,68,120175,68,120227,68,120279,68,120331,68,120383,68,120435,68,5024,68,5598,68,5610,68,42195,68,8494,101,65349,101,8495,101,8519,101,119838,101,119890,101,119942,101,120046,101,120098,101,120150,101,120202,101,120254,101,120306,101,120358,101,120410,101,120462,101,43826,101,1213,101,8959,69,65317,69,8496,69,119812,69,119864,69,119916,69,120020,69,120072,69,120124,69,120176,69,120228,69,120280,69,120332,69,120384,69,120436,69,917,69,120492,69,120550,69,120608,69,120666,69,120724,69,11577,69,5036,69,42224,69,71846,69,71854,69,66182,69,119839,102,119891,102,119943,102,119995,102,120047,102,120099,102,120151,102,120203,102,120255,102,120307,102,120359,102,120411,102,120463,102,43829,102,42905,102,383,102,7837,102,1412,102,119315,70,8497,70,119813,70,119865,70,119917,70,120021,70,120073,70,120125,70,120177,70,120229,70,120281,70,120333,70,120385,70,120437,70,42904,70,988,70,120778,70,5556,70,42205,70,71874,70,71842,70,66183,70,66213,70,66853,70,65351,103,8458,103,119840,103,119892,103,119944,103,120048,103,120100,103,120152,103,120204,103,120256,103,120308,103,120360,103,120412,103,120464,103,609,103,7555,103,397,103,1409,103,119814,71,119866,71,119918,71,119970,71,120022,71,120074,71,120126,71,120178,71,120230,71,120282,71,120334,71,120386,71,120438,71,1292,71,5056,71,5107,71,42198,71,65352,104,8462,104,119841,104,119945,104,119997,104,120049,104,120101,104,120153,104,120205,104,120257,104,120309,104,120361,104,120413,104,120465,104,1211,104,1392,104,5058,104,65320,72,8459,72,8460,72,8461,72,119815,72,119867,72,119919,72,120023,72,120179,72,120231,72,120283,72,120335,72,120387,72,120439,72,919,72,120494,72,120552,72,120610,72,120668,72,120726,72,11406,72,5051,72,5500,72,42215,72,66255,72,731,105,9075,105,65353,105,8560,105,8505,105,8520,105,119842,105,119894,105,119946,105,119998,105,120050,105,120102,105,120154,105,120206,105,120258,105,120310,105,120362,105,120414,105,120466,105,120484,105,618,105,617,105,953,105,8126,105,890,105,120522,105,120580,105,120638,105,120696,105,120754,105,1110,105,42567,105,1231,105,43893,105,5029,105,71875,105,65354,106,8521,106,119843,106,119895,106,119947,106,119999,106,120051,106,120103,106,120155,106,120207,106,120259,106,120311,106,120363,106,120415,106,120467,106,1011,106,1112,106,65322,74,119817,74,119869,74,119921,74,119973,74,120025,74,120077,74,120129,74,120181,74,120233,74,120285,74,120337,74,120389,74,120441,74,42930,74,895,74,1032,74,5035,74,5261,74,42201,74,119844,107,119896,107,119948,107,120000,107,120052,107,120104,107,120156,107,120208,107,120260,107,120312,107,120364,107,120416,107,120468,107,8490,75,65323,75,119818,75,119870,75,119922,75,119974,75,120026,75,120078,75,120130,75,120182,75,120234,75,120286,75,120338,75,120390,75,120442,75,922,75,120497,75,120555,75,120613,75,120671,75,120729,75,11412,75,5094,75,5845,75,42199,75,66840,75,1472,108,8739,73,9213,73,65512,73,1633,108,1777,73,66336,108,125127,108,120783,73,120793,73,120803,73,120813,73,120823,73,130033,73,65321,73,8544,73,8464,73,8465,73,119816,73,119868,73,119920,73,120024,73,120128,73,120180,73,120232,73,120284,73,120336,73,120388,73,120440,73,65356,108,8572,73,8467,108,119845,108,119897,108,119949,108,120001,108,120053,108,120105,73,120157,73,120209,73,120261,73,120313,73,120365,73,120417,73,120469,73,448,73,120496,73,120554,73,120612,73,120670,73,120728,73,11410,73,1030,73,1216,73,1493,108,1503,108,1575,108,126464,108,126592,108,65166,108,65165,108,1994,108,11599,73,5825,73,42226,73,93992,73,66186,124,66313,124,119338,76,8556,76,8466,76,119819,76,119871,76,119923,76,120027,76,120079,76,120131,76,120183,76,120235,76,120287,76,120339,76,120391,76,120443,76,11472,76,5086,76,5290,76,42209,76,93974,76,71843,76,71858,76,66587,76,66854,76,65325,77,8559,77,8499,77,119820,77,119872,77,119924,77,120028,77,120080,77,120132,77,120184,77,120236,77,120288,77,120340,77,120392,77,120444,77,924,77,120499,77,120557,77,120615,77,120673,77,120731,77,1018,77,11416,77,5047,77,5616,77,5846,77,42207,77,66224,77,66321,77,119847,110,119899,110,119951,110,120003,110,120055,110,120107,110,120159,110,120211,110,120263,110,120315,110,120367,110,120419,110,120471,110,1400,110,1404,110,65326,78,8469,78,119821,78,119873,78,119925,78,119977,78,120029,78,120081,78,120185,78,120237,78,120289,78,120341,78,120393,78,120445,78,925,78,120500,78,120558,78,120616,78,120674,78,120732,78,11418,78,42208,78,66835,78,3074,111,3202,111,3330,111,3458,111,2406,111,2662,111,2790,111,3046,111,3174,111,3302,111,3430,111,3664,111,3792,111,4160,111,1637,111,1781,111,65359,111,8500,111,119848,111,119900,111,119952,111,120056,111,120108,111,120160,111,120212,111,120264,111,120316,111,120368,111,120420,111,120472,111,7439,111,7441,111,43837,111,959,111,120528,111,120586,111,120644,111,120702,111,120760,111,963,111,120532,111,120590,111,120648,111,120706,111,120764,111,11423,111,4351,111,1413,111,1505,111,1607,111,126500,111,126564,111,126596,111,65259,111,65260,111,65258,111,65257,111,1726,111,64428,111,64429,111,64427,111,64426,111,1729,111,64424,111,64425,111,64423,111,64422,111,1749,111,3360,111,4125,111,66794,111,71880,111,71895,111,66604,111,1984,79,2534,79,2918,79,12295,79,70864,79,71904,79,120782,79,120792,79,120802,79,120812,79,120822,79,130032,79,65327,79,119822,79,119874,79,119926,79,119978,79,120030,79,120082,79,120134,79,120186,79,120238,79,120290,79,120342,79,120394,79,120446,79,927,79,120502,79,120560,79,120618,79,120676,79,120734,79,11422,79,1365,79,11604,79,4816,79,2848,79,66754,79,42227,79,71861,79,66194,79,66219,79,66564,79,66838,79,9076,112,65360,112,119849,112,119901,112,119953,112,120005,112,120057,112,120109,112,120161,112,120213,112,120265,112,120317,112,120369,112,120421,112,120473,112,961,112,120530,112,120544,112,120588,112,120602,112,120646,112,120660,112,120704,112,120718,112,120762,112,120776,112,11427,112,65328,80,8473,80,119823,80,119875,80,119927,80,119979,80,120031,80,120083,80,120187,80,120239,80,120291,80,120343,80,120395,80,120447,80,929,80,120504,80,120562,80,120620,80,120678,80,120736,80,11426,80,5090,80,5229,80,42193,80,66197,80,119850,113,119902,113,119954,113,120006,113,120058,113,120110,113,120162,113,120214,113,120266,113,120318,113,120370,113,120422,113,120474,113,1307,113,1379,113,1382,113,8474,81,119824,81,119876,81,119928,81,119980,81,120032,81,120084,81,120188,81,120240,81,120292,81,120344,81,120396,81,120448,81,11605,81,119851,114,119903,114,119955,114,120007,114,120059,114,120111,114,120163,114,120215,114,120267,114,120319,114,120371,114,120423,114,120475,114,43847,114,43848,114,7462,114,11397,114,43905,114,119318,82,8475,82,8476,82,8477,82,119825,82,119877,82,119929,82,120033,82,120189,82,120241,82,120293,82,120345,82,120397,82,120449,82,422,82,5025,82,5074,82,66740,82,5511,82,42211,82,94005,82,65363,115,119852,115,119904,115,119956,115,120008,115,120060,115,120112,115,120164,115,120216,115,120268,115,120320,115,120372,115,120424,115,120476,115,42801,115,445,115,1109,115,43946,115,71873,115,66632,115,65331,83,119826,83,119878,83,119930,83,119982,83,120034,83,120086,83,120138,83,120190,83,120242,83,120294,83,120346,83,120398,83,120450,83,1029,83,1359,83,5077,83,5082,83,42210,83,94010,83,66198,83,66592,83,119853,116,119905,116,119957,116,120009,116,120061,116,120113,116,120165,116,120217,116,120269,116,120321,116,120373,116,120425,116,120477,116,8868,84,10201,84,128872,84,65332,84,119827,84,119879,84,119931,84,119983,84,120035,84,120087,84,120139,84,120191,84,120243,84,120295,84,120347,84,120399,84,120451,84,932,84,120507,84,120565,84,120623,84,120681,84,120739,84,11430,84,5026,84,42196,84,93962,84,71868,84,66199,84,66225,84,66325,84,119854,117,119906,117,119958,117,120010,117,120062,117,120114,117,120166,117,120218,117,120270,117,120322,117,120374,117,120426,117,120478,117,42911,117,7452,117,43854,117,43858,117,651,117,965,117,120534,117,120592,117,120650,117,120708,117,120766,117,1405,117,66806,117,71896,117,8746,85,8899,85,119828,85,119880,85,119932,85,119984,85,120036,85,120088,85,120140,85,120192,85,120244,85,120296,85,120348,85,120400,85,120452,85,1357,85,4608,85,66766,85,5196,85,42228,85,94018,85,71864,85,8744,118,8897,118,65366,118,8564,118,119855,118,119907,118,119959,118,120011,118,120063,118,120115,118,120167,118,120219,118,120271,118,120323,118,120375,118,120427,118,120479,118,7456,118,957,118,120526,118,120584,118,120642,118,120700,118,120758,118,1141,118,1496,118,71430,118,43945,118,71872,118,119309,86,1639,86,1783,86,8548,86,119829,86,119881,86,119933,86,119985,86,120037,86,120089,86,120141,86,120193,86,120245,86,120297,86,120349,86,120401,86,120453,86,1140,86,11576,86,5081,86,5167,86,42719,86,42214,86,93960,86,71840,86,66845,86,623,119,119856,119,119908,119,119960,119,120012,119,120064,119,120116,119,120168,119,120220,119,120272,119,120324,119,120376,119,120428,119,120480,119,7457,119,1121,119,1309,119,1377,119,71434,119,71438,119,71439,119,43907,119,71919,87,71910,87,119830,87,119882,87,119934,87,119986,87,120038,87,120090,87,120142,87,120194,87,120246,87,120298,87,120350,87,120402,87,120454,87,1308,87,5043,87,5076,87,42218,87,5742,120,10539,120,10540,120,10799,120,65368,120,8569,120,119857,120,119909,120,119961,120,120013,120,120065,120,120117,120,120169,120,120221,120,120273,120,120325,120,120377,120,120429,120,120481,120,5441,120,5501,120,5741,88,9587,88,66338,88,71916,88,65336,88,8553,88,119831,88,119883,88,119935,88,119987,88,120039,88,120091,88,120143,88,120195,88,120247,88,120299,88,120351,88,120403,88,120455,88,42931,88,935,88,120510,88,120568,88,120626,88,120684,88,120742,88,11436,88,11613,88,5815,88,42219,88,66192,88,66228,88,66327,88,66855,88,611,121,7564,121,65369,121,119858,121,119910,121,119962,121,120014,121,120066,121,120118,121,120170,121,120222,121,120274,121,120326,121,120378,121,120430,121,120482,121,655,121,7935,121,43866,121,947,121,8509,121,120516,121,120574,121,120632,121,120690,121,120748,121,1199,121,4327,121,71900,121,65337,89,119832,89,119884,89,119936,89,119988,89,120040,89,120092,89,120144,89,120196,89,120248,89,120300,89,120352,89,120404,89,120456,89,933,89,978,89,120508,89,120566,89,120624,89,120682,89,120740,89,11432,89,1198,89,5033,89,5053,89,42220,89,94019,89,71844,89,66226,89,119859,122,119911,122,119963,122,120015,122,120067,122,120119,122,120171,122,120223,122,120275,122,120327,122,120379,122,120431,122,120483,122,7458,122,43923,122,71876,122,66293,90,71909,90,65338,90,8484,90,8488,90,119833,90,119885,90,119937,90,119989,90,120041,90,120197,90,120249,90,120301,90,120353,90,120405,90,120457,90,918,90,120493,90,120551,90,120609,90,120667,90,120725,90,5059,90,42204,90,71849,90,65282,34,65284,36,65285,37,65286,38,65290,42,65291,43,65294,46,65295,47,65296,48,65297,49,65298,50,65299,51,65300,52,65301,53,65302,54,65303,55,65304,56,65305,57,65308,60,65309,61,65310,62,65312,64,65316,68,65318,70,65319,71,65324,76,65329,81,65330,82,65333,85,65334,86,65335,87,65343,95,65346,98,65348,100,65350,102,65355,107,65357,109,65358,110,65361,113,65362,114,65364,116,65365,117,65367,119,65370,122,65371,123,65373,125],"_default":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"cs":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"de":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"es":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"fr":[65374,126,65306,58,65281,33,8216,96,8245,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"it":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ja":[8211,45,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65292,44,65307,59],"ko":[8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pl":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"pt-BR":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"qps-ploc":[160,32,8211,45,65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"ru":[65374,126,65306,58,65281,33,8216,96,8217,96,8245,96,180,96,12494,47,305,105,921,73,1009,112,215,120,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"tr":[160,32,8211,45,65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65288,40,65289,41,65292,44,65307,59,65311,63],"zh-hans":[65374,126,65306,58,65281,33,8245,96,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65288,40,65289,41],"zh-hant":[8211,45,65374,126,180,96,12494,47,1047,51,1073,54,1072,97,1040,65,1068,98,1042,66,1089,99,1057,67,1077,101,1045,69,1053,72,305,105,1050,75,921,73,1052,77,1086,111,1054,79,1009,112,1088,112,1056,80,1075,114,1058,84,215,120,1093,120,1061,88,1091,121,1059,89,65283,35,65307,59]}'));
ge.cache = new Ea((e) => {
  function t(c) {
    const h = /* @__PURE__ */ new Map();
    for (let d = 0; d < c.length; d += 2)
      h.set(c[d], c[d + 1]);
    return h;
  }
  function n(c, h) {
    const d = new Map(c);
    for (const [f, g] of h)
      d.set(f, g);
    return d;
  }
  function r(c, h) {
    if (!c)
      return h;
    const d = /* @__PURE__ */ new Map();
    for (const [f, g] of c)
      h.has(f) && d.set(f, g);
    return d;
  }
  const i = Ni.ambiguousCharacterData.getValue();
  let s = e.filter((c) => !c.startsWith("_") && c in i);
  s.length === 0 && (s = ["_default"]);
  let l;
  for (const c of s) {
    const h = t(i[c]);
    l = r(l, h);
  }
  const u = t(i._common), o = n(u, l);
  return new ge(o);
});
ge._locales = new Ri(() => Object.keys(ge.ambiguousCharacterData.getValue()).filter((e) => !e.startsWith("_")));
class Ne {
  static getRawData() {
    return JSON.parse("[9,10,11,12,13,32,127,160,173,847,1564,4447,4448,6068,6069,6155,6156,6157,6158,7355,7356,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8203,8204,8205,8206,8207,8234,8235,8236,8237,8238,8239,8287,8288,8289,8290,8291,8292,8293,8294,8295,8296,8297,8298,8299,8300,8301,8302,8303,10240,12288,12644,65024,65025,65026,65027,65028,65029,65030,65031,65032,65033,65034,65035,65036,65037,65038,65039,65279,65440,65520,65521,65522,65523,65524,65525,65526,65527,65528,65532,78844,119155,119156,119157,119158,119159,119160,119161,119162,917504,917505,917506,917507,917508,917509,917510,917511,917512,917513,917514,917515,917516,917517,917518,917519,917520,917521,917522,917523,917524,917525,917526,917527,917528,917529,917530,917531,917532,917533,917534,917535,917536,917537,917538,917539,917540,917541,917542,917543,917544,917545,917546,917547,917548,917549,917550,917551,917552,917553,917554,917555,917556,917557,917558,917559,917560,917561,917562,917563,917564,917565,917566,917567,917568,917569,917570,917571,917572,917573,917574,917575,917576,917577,917578,917579,917580,917581,917582,917583,917584,917585,917586,917587,917588,917589,917590,917591,917592,917593,917594,917595,917596,917597,917598,917599,917600,917601,917602,917603,917604,917605,917606,917607,917608,917609,917610,917611,917612,917613,917614,917615,917616,917617,917618,917619,917620,917621,917622,917623,917624,917625,917626,917627,917628,917629,917630,917631,917760,917761,917762,917763,917764,917765,917766,917767,917768,917769,917770,917771,917772,917773,917774,917775,917776,917777,917778,917779,917780,917781,917782,917783,917784,917785,917786,917787,917788,917789,917790,917791,917792,917793,917794,917795,917796,917797,917798,917799,917800,917801,917802,917803,917804,917805,917806,917807,917808,917809,917810,917811,917812,917813,917814,917815,917816,917817,917818,917819,917820,917821,917822,917823,917824,917825,917826,917827,917828,917829,917830,917831,917832,917833,917834,917835,917836,917837,917838,917839,917840,917841,917842,917843,917844,917845,917846,917847,917848,917849,917850,917851,917852,917853,917854,917855,917856,917857,917858,917859,917860,917861,917862,917863,917864,917865,917866,917867,917868,917869,917870,917871,917872,917873,917874,917875,917876,917877,917878,917879,917880,917881,917882,917883,917884,917885,917886,917887,917888,917889,917890,917891,917892,917893,917894,917895,917896,917897,917898,917899,917900,917901,917902,917903,917904,917905,917906,917907,917908,917909,917910,917911,917912,917913,917914,917915,917916,917917,917918,917919,917920,917921,917922,917923,917924,917925,917926,917927,917928,917929,917930,917931,917932,917933,917934,917935,917936,917937,917938,917939,917940,917941,917942,917943,917944,917945,917946,917947,917948,917949,917950,917951,917952,917953,917954,917955,917956,917957,917958,917959,917960,917961,917962,917963,917964,917965,917966,917967,917968,917969,917970,917971,917972,917973,917974,917975,917976,917977,917978,917979,917980,917981,917982,917983,917984,917985,917986,917987,917988,917989,917990,917991,917992,917993,917994,917995,917996,917997,917998,917999]");
  }
  static getData() {
    return this._data || (this._data = new Set(Ne.getRawData())), this._data;
  }
  static isInvisibleCharacter(t) {
    return Ne.getData().has(t);
  }
  static get codePoints() {
    return Ne.getData();
  }
}
Ne._data = void 0;
const Fa = "$initialize";
class Pa {
  constructor(t, n, r, i) {
    this.vsWorker = t, this.req = n, this.method = r, this.args = i, this.type = 0;
  }
}
class Rn {
  constructor(t, n, r, i) {
    this.vsWorker = t, this.seq = n, this.res = r, this.err = i, this.type = 1;
  }
}
class Ba {
  constructor(t, n, r, i) {
    this.vsWorker = t, this.req = n, this.eventName = r, this.arg = i, this.type = 2;
  }
}
class qa {
  constructor(t, n, r) {
    this.vsWorker = t, this.req = n, this.event = r, this.type = 3;
  }
}
class Oa {
  constructor(t, n) {
    this.vsWorker = t, this.req = n, this.type = 4;
  }
}
class Va {
  constructor(t) {
    this._workerId = -1, this._handler = t, this._lastSentReq = 0, this._pendingReplies = /* @__PURE__ */ Object.create(null), this._pendingEmitters = /* @__PURE__ */ new Map(), this._pendingEvents = /* @__PURE__ */ new Map();
  }
  setWorkerId(t) {
    this._workerId = t;
  }
  sendMessage(t, n) {
    const r = String(++this._lastSentReq);
    return new Promise((i, s) => {
      this._pendingReplies[r] = {
        resolve: i,
        reject: s
      }, this._send(new Pa(this._workerId, r, t, n));
    });
  }
  listen(t, n) {
    let r = null;
    const i = new ke({
      onFirstListenerAdd: () => {
        r = String(++this._lastSentReq), this._pendingEmitters.set(r, i), this._send(new Ba(this._workerId, r, t, n));
      },
      onLastListenerRemove: () => {
        this._pendingEmitters.delete(r), this._send(new Oa(this._workerId, r)), r = null;
      }
    });
    return i.event;
  }
  handleMessage(t) {
    !t || !t.vsWorker || this._workerId !== -1 && t.vsWorker !== this._workerId || this._handleMessage(t);
  }
  _handleMessage(t) {
    switch (t.type) {
      case 1:
        return this._handleReplyMessage(t);
      case 0:
        return this._handleRequestMessage(t);
      case 2:
        return this._handleSubscribeEventMessage(t);
      case 3:
        return this._handleEventMessage(t);
      case 4:
        return this._handleUnsubscribeEventMessage(t);
    }
  }
  _handleReplyMessage(t) {
    if (!this._pendingReplies[t.seq]) {
      console.warn("Got reply to unknown seq");
      return;
    }
    const n = this._pendingReplies[t.seq];
    if (delete this._pendingReplies[t.seq], t.err) {
      let r = t.err;
      t.err.$isError && (r = new Error(), r.name = t.err.name, r.message = t.err.message, r.stack = t.err.stack), n.reject(r);
      return;
    }
    n.resolve(t.res);
  }
  _handleRequestMessage(t) {
    const n = t.req;
    this._handler.handleMessage(t.method, t.args).then((i) => {
      this._send(new Rn(this._workerId, n, i, void 0));
    }, (i) => {
      i.detail instanceof Error && (i.detail = Dn(i.detail)), this._send(new Rn(this._workerId, n, void 0, Dn(i)));
    });
  }
  _handleSubscribeEventMessage(t) {
    const n = t.req, r = this._handler.handleEvent(t.eventName, t.arg)((i) => {
      this._send(new qa(this._workerId, n, i));
    });
    this._pendingEvents.set(n, r);
  }
  _handleEventMessage(t) {
    if (!this._pendingEmitters.has(t.req)) {
      console.warn("Got event for unknown req");
      return;
    }
    this._pendingEmitters.get(t.req).fire(t.event);
  }
  _handleUnsubscribeEventMessage(t) {
    if (!this._pendingEvents.has(t.req)) {
      console.warn("Got unsubscribe for unknown req");
      return;
    }
    this._pendingEvents.get(t.req).dispose(), this._pendingEvents.delete(t.req);
  }
  _send(t) {
    const n = [];
    if (t.type === 0)
      for (let r = 0; r < t.args.length; r++)
        t.args[r] instanceof ArrayBuffer && n.push(t.args[r]);
    else
      t.type === 1 && t.res instanceof ArrayBuffer && n.push(t.res);
    this._handler.sendMessage(t, n);
  }
}
function Ii(e) {
  return e[0] === "o" && e[1] === "n" && Ui(e.charCodeAt(2));
}
function Hi(e) {
  return /^onDynamic/.test(e) && Ui(e.charCodeAt(9));
}
function ja(e, t, n) {
  const r = (l) => function() {
    const u = Array.prototype.slice.call(arguments, 0);
    return t(l, u);
  }, i = (l) => function(u) {
    return n(l, u);
  }, s = {};
  for (const l of e) {
    if (Hi(l)) {
      s[l] = i(l);
      continue;
    }
    if (Ii(l)) {
      s[l] = n(l, void 0);
      continue;
    }
    s[l] = r(l);
  }
  return s;
}
class Ga {
  constructor(t, n) {
    this._requestHandlerFactory = n, this._requestHandler = null, this._protocol = new Va({
      sendMessage: (r, i) => {
        t(r, i);
      },
      handleMessage: (r, i) => this._handleMessage(r, i),
      handleEvent: (r, i) => this._handleEvent(r, i)
    });
  }
  onmessage(t) {
    this._protocol.handleMessage(t);
  }
  _handleMessage(t, n) {
    if (t === Fa)
      return this.initialize(n[0], n[1], n[2], n[3]);
    if (!this._requestHandler || typeof this._requestHandler[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._requestHandler[t].apply(this._requestHandler, n));
    } catch (r) {
      return Promise.reject(r);
    }
  }
  _handleEvent(t, n) {
    if (!this._requestHandler)
      throw new Error("Missing requestHandler");
    if (Hi(t)) {
      const r = this._requestHandler[t].call(this._requestHandler, n);
      if (typeof r != "function")
        throw new Error(`Missing dynamic event ${t} on request handler.`);
      return r;
    }
    if (Ii(t)) {
      const r = this._requestHandler[t];
      if (typeof r != "function")
        throw new Error(`Missing event ${t} on request handler.`);
      return r;
    }
    throw new Error(`Malformed event name ${t}`);
  }
  initialize(t, n, r, i) {
    this._protocol.setWorkerId(t);
    const u = ja(i, (o, c) => this._protocol.sendMessage(o, c), (o, c) => this._protocol.listen(o, c));
    return this._requestHandlerFactory ? (this._requestHandler = this._requestHandlerFactory(u), Promise.resolve(Jt(this._requestHandler))) : (n && (typeof n.baseUrl < "u" && delete n.baseUrl, typeof n.paths < "u" && typeof n.paths.vs < "u" && delete n.paths.vs, typeof n.trustedTypesPolicy !== void 0 && delete n.trustedTypesPolicy, n.catchError = !0, ie.require.config(n)), new Promise((o, c) => {
      const h = ie.require;
      h([r], (d) => {
        if (this._requestHandler = d.create(u), !this._requestHandler) {
          c(new Error("No RequestHandler!"));
          return;
        }
        o(Jt(this._requestHandler));
      }, c);
    }));
  }
}
class Me {
  constructor(t, n, r, i) {
    this.originalStart = t, this.originalLength = n, this.modifiedStart = r, this.modifiedLength = i;
  }
  getOriginalEnd() {
    return this.originalStart + this.originalLength;
  }
  getModifiedEnd() {
    return this.modifiedStart + this.modifiedLength;
  }
}
function Nn(e, t) {
  return (t << 5) - t + e | 0;
}
function $a(e, t) {
  t = Nn(149417, t);
  for (let n = 0, r = e.length; n < r; n++)
    t = Nn(e.charCodeAt(n), t);
  return t;
}
class Un {
  constructor(t) {
    this.source = t;
  }
  getElements() {
    const t = this.source, n = new Int32Array(t.length);
    for (let r = 0, i = t.length; r < i; r++)
      n[r] = t.charCodeAt(r);
    return n;
  }
}
function Xa(e, t, n) {
  return new Re(new Un(e), new Un(t)).ComputeDiff(n).changes;
}
class qe {
  static Assert(t, n) {
    if (!t)
      throw new Error(n);
  }
}
class Oe {
  static Copy(t, n, r, i, s) {
    for (let l = 0; l < s; l++)
      r[i + l] = t[n + l];
  }
  static Copy2(t, n, r, i, s) {
    for (let l = 0; l < s; l++)
      r[i + l] = t[n + l];
  }
}
class In {
  constructor() {
    this.m_changes = [], this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824, this.m_originalCount = 0, this.m_modifiedCount = 0;
  }
  MarkNextChange() {
    (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.m_changes.push(new Me(this.m_originalStart, this.m_originalCount, this.m_modifiedStart, this.m_modifiedCount)), this.m_originalCount = 0, this.m_modifiedCount = 0, this.m_originalStart = 1073741824, this.m_modifiedStart = 1073741824;
  }
  AddOriginalElement(t, n) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, n), this.m_originalCount++;
  }
  AddModifiedElement(t, n) {
    this.m_originalStart = Math.min(this.m_originalStart, t), this.m_modifiedStart = Math.min(this.m_modifiedStart, n), this.m_modifiedCount++;
  }
  getChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes;
  }
  getReverseChanges() {
    return (this.m_originalCount > 0 || this.m_modifiedCount > 0) && this.MarkNextChange(), this.m_changes.reverse(), this.m_changes;
  }
}
class Re {
  constructor(t, n, r = null) {
    this.ContinueProcessingPredicate = r, this._originalSequence = t, this._modifiedSequence = n;
    const [i, s, l] = Re._getElements(t), [u, o, c] = Re._getElements(n);
    this._hasStrings = l && c, this._originalStringElements = i, this._originalElementsOrHash = s, this._modifiedStringElements = u, this._modifiedElementsOrHash = o, this.m_forwardHistory = [], this.m_reverseHistory = [];
  }
  static _isStringArray(t) {
    return t.length > 0 && typeof t[0] == "string";
  }
  static _getElements(t) {
    const n = t.getElements();
    if (Re._isStringArray(n)) {
      const r = new Int32Array(n.length);
      for (let i = 0, s = n.length; i < s; i++)
        r[i] = $a(n[i], 0);
      return [n, r, !0];
    }
    return n instanceof Int32Array ? [[], n, !1] : [[], new Int32Array(n), !1];
  }
  ElementsAreEqual(t, n) {
    return this._originalElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._modifiedStringElements[n] : !0;
  }
  ElementsAreStrictEqual(t, n) {
    if (!this.ElementsAreEqual(t, n))
      return !1;
    const r = Re._getStrictElement(this._originalSequence, t), i = Re._getStrictElement(this._modifiedSequence, n);
    return r === i;
  }
  static _getStrictElement(t, n) {
    return typeof t.getStrictElement == "function" ? t.getStrictElement(n) : null;
  }
  OriginalElementsAreEqual(t, n) {
    return this._originalElementsOrHash[t] !== this._originalElementsOrHash[n] ? !1 : this._hasStrings ? this._originalStringElements[t] === this._originalStringElements[n] : !0;
  }
  ModifiedElementsAreEqual(t, n) {
    return this._modifiedElementsOrHash[t] !== this._modifiedElementsOrHash[n] ? !1 : this._hasStrings ? this._modifiedStringElements[t] === this._modifiedStringElements[n] : !0;
  }
  ComputeDiff(t) {
    return this._ComputeDiff(0, this._originalElementsOrHash.length - 1, 0, this._modifiedElementsOrHash.length - 1, t);
  }
  _ComputeDiff(t, n, r, i, s) {
    const l = [!1];
    let u = this.ComputeDiffRecursive(t, n, r, i, l);
    return s && (u = this.PrettifyChanges(u)), {
      quitEarly: l[0],
      changes: u
    };
  }
  ComputeDiffRecursive(t, n, r, i, s) {
    for (s[0] = !1; t <= n && r <= i && this.ElementsAreEqual(t, r); )
      t++, r++;
    for (; n >= t && i >= r && this.ElementsAreEqual(n, i); )
      n--, i--;
    if (t > n || r > i) {
      let d;
      return r <= i ? (qe.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), d = [
        new Me(t, 0, r, i - r + 1)
      ]) : t <= n ? (qe.Assert(r === i + 1, "modifiedStart should only be one more than modifiedEnd"), d = [
        new Me(t, n - t + 1, r, 0)
      ]) : (qe.Assert(t === n + 1, "originalStart should only be one more than originalEnd"), qe.Assert(r === i + 1, "modifiedStart should only be one more than modifiedEnd"), d = []), d;
    }
    const l = [0], u = [0], o = this.ComputeRecursionPoint(t, n, r, i, l, u, s), c = l[0], h = u[0];
    if (o !== null)
      return o;
    if (!s[0]) {
      const d = this.ComputeDiffRecursive(t, c, r, h, s);
      let f = [];
      return s[0] ? f = [
        new Me(c + 1, n - (c + 1) + 1, h + 1, i - (h + 1) + 1)
      ] : f = this.ComputeDiffRecursive(c + 1, n, h + 1, i, s), this.ConcatenateChanges(d, f);
    }
    return [
      new Me(t, n - t + 1, r, i - r + 1)
    ];
  }
  WALKTRACE(t, n, r, i, s, l, u, o, c, h, d, f, g, _, w, y, k, v) {
    let L = null, M = null, z = new In(), D = n, p = r, m = g[0] - y[0] - i, b = -1073741824, I = this.m_forwardHistory.length - 1;
    do {
      const C = m + t;
      C === D || C < p && c[C - 1] < c[C + 1] ? (d = c[C + 1], _ = d - m - i, d < b && z.MarkNextChange(), b = d, z.AddModifiedElement(d + 1, _), m = C + 1 - t) : (d = c[C - 1] + 1, _ = d - m - i, d < b && z.MarkNextChange(), b = d - 1, z.AddOriginalElement(d, _ + 1), m = C - 1 - t), I >= 0 && (c = this.m_forwardHistory[I], t = c[0], D = 1, p = c.length - 1);
    } while (--I >= -1);
    if (L = z.getReverseChanges(), v[0]) {
      let C = g[0] + 1, x = y[0] + 1;
      if (L !== null && L.length > 0) {
        const W = L[L.length - 1];
        C = Math.max(C, W.getOriginalEnd()), x = Math.max(x, W.getModifiedEnd());
      }
      M = [
        new Me(C, f - C + 1, x, w - x + 1)
      ];
    } else {
      z = new In(), D = l, p = u, m = g[0] - y[0] - o, b = 1073741824, I = k ? this.m_reverseHistory.length - 1 : this.m_reverseHistory.length - 2;
      do {
        const C = m + s;
        C === D || C < p && h[C - 1] >= h[C + 1] ? (d = h[C + 1] - 1, _ = d - m - o, d > b && z.MarkNextChange(), b = d + 1, z.AddOriginalElement(d + 1, _ + 1), m = C + 1 - s) : (d = h[C - 1], _ = d - m - o, d > b && z.MarkNextChange(), b = d, z.AddModifiedElement(d + 1, _ + 1), m = C - 1 - s), I >= 0 && (h = this.m_reverseHistory[I], s = h[0], D = 1, p = h.length - 1);
      } while (--I >= -1);
      M = z.getChanges();
    }
    return this.ConcatenateChanges(L, M);
  }
  ComputeRecursionPoint(t, n, r, i, s, l, u) {
    let o = 0, c = 0, h = 0, d = 0, f = 0, g = 0;
    t--, r--, s[0] = 0, l[0] = 0, this.m_forwardHistory = [], this.m_reverseHistory = [];
    const _ = n - t + (i - r), w = _ + 1, y = new Int32Array(w), k = new Int32Array(w), v = i - r, L = n - t, M = t - r, z = n - i, p = (L - v) % 2 === 0;
    y[v] = t, k[L] = n, u[0] = !1;
    for (let m = 1; m <= _ / 2 + 1; m++) {
      let b = 0, I = 0;
      h = this.ClipDiagonalBound(v - m, m, v, w), d = this.ClipDiagonalBound(v + m, m, v, w);
      for (let x = h; x <= d; x += 2) {
        x === h || x < d && y[x - 1] < y[x + 1] ? o = y[x + 1] : o = y[x - 1] + 1, c = o - (x - v) - M;
        const W = o;
        for (; o < n && c < i && this.ElementsAreEqual(o + 1, c + 1); )
          o++, c++;
        if (y[x] = o, o + c > b + I && (b = o, I = c), !p && Math.abs(x - L) <= m - 1 && o >= k[x])
          return s[0] = o, l[0] = c, W <= k[x] && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(v, h, d, M, L, f, g, z, y, k, o, n, s, c, i, l, p, u) : null;
      }
      const C = (b - t + (I - r) - m) / 2;
      if (this.ContinueProcessingPredicate !== null && !this.ContinueProcessingPredicate(b, C))
        return u[0] = !0, s[0] = b, l[0] = I, C > 0 && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(v, h, d, M, L, f, g, z, y, k, o, n, s, c, i, l, p, u) : (t++, r++, [
          new Me(t, n - t + 1, r, i - r + 1)
        ]);
      f = this.ClipDiagonalBound(L - m, m, L, w), g = this.ClipDiagonalBound(L + m, m, L, w);
      for (let x = f; x <= g; x += 2) {
        x === f || x < g && k[x - 1] >= k[x + 1] ? o = k[x + 1] - 1 : o = k[x - 1], c = o - (x - L) - z;
        const W = o;
        for (; o > t && c > r && this.ElementsAreEqual(o, c); )
          o--, c--;
        if (k[x] = o, p && Math.abs(x - v) <= m && o <= y[x])
          return s[0] = o, l[0] = c, W >= y[x] && 1447 > 0 && m <= 1447 + 1 ? this.WALKTRACE(v, h, d, M, L, f, g, z, y, k, o, n, s, c, i, l, p, u) : null;
      }
      if (m <= 1447) {
        let x = new Int32Array(d - h + 2);
        x[0] = v - h + 1, Oe.Copy2(y, h, x, 1, d - h + 1), this.m_forwardHistory.push(x), x = new Int32Array(g - f + 2), x[0] = L - f + 1, Oe.Copy2(k, f, x, 1, g - f + 1), this.m_reverseHistory.push(x);
      }
    }
    return this.WALKTRACE(v, h, d, M, L, f, g, z, y, k, o, n, s, c, i, l, p, u);
  }
  PrettifyChanges(t) {
    for (let n = 0; n < t.length; n++) {
      const r = t[n], i = n < t.length - 1 ? t[n + 1].originalStart : this._originalElementsOrHash.length, s = n < t.length - 1 ? t[n + 1].modifiedStart : this._modifiedElementsOrHash.length, l = r.originalLength > 0, u = r.modifiedLength > 0;
      for (; r.originalStart + r.originalLength < i && r.modifiedStart + r.modifiedLength < s && (!l || this.OriginalElementsAreEqual(r.originalStart, r.originalStart + r.originalLength)) && (!u || this.ModifiedElementsAreEqual(r.modifiedStart, r.modifiedStart + r.modifiedLength)); ) {
        const c = this.ElementsAreStrictEqual(r.originalStart, r.modifiedStart);
        if (this.ElementsAreStrictEqual(r.originalStart + r.originalLength, r.modifiedStart + r.modifiedLength) && !c)
          break;
        r.originalStart++, r.modifiedStart++;
      }
      const o = [null];
      if (n < t.length - 1 && this.ChangesOverlap(t[n], t[n + 1], o)) {
        t[n] = o[0], t.splice(n + 1, 1), n--;
        continue;
      }
    }
    for (let n = t.length - 1; n >= 0; n--) {
      const r = t[n];
      let i = 0, s = 0;
      if (n > 0) {
        const d = t[n - 1];
        i = d.originalStart + d.originalLength, s = d.modifiedStart + d.modifiedLength;
      }
      const l = r.originalLength > 0, u = r.modifiedLength > 0;
      let o = 0, c = this._boundaryScore(r.originalStart, r.originalLength, r.modifiedStart, r.modifiedLength);
      for (let d = 1; ; d++) {
        const f = r.originalStart - d, g = r.modifiedStart - d;
        if (f < i || g < s || l && !this.OriginalElementsAreEqual(f, f + r.originalLength) || u && !this.ModifiedElementsAreEqual(g, g + r.modifiedLength))
          break;
        const w = (f === i && g === s ? 5 : 0) + this._boundaryScore(f, r.originalLength, g, r.modifiedLength);
        w > c && (c = w, o = d);
      }
      r.originalStart -= o, r.modifiedStart -= o;
      const h = [null];
      if (n > 0 && this.ChangesOverlap(t[n - 1], t[n], h)) {
        t[n - 1] = h[0], t.splice(n, 1), n++;
        continue;
      }
    }
    if (this._hasStrings)
      for (let n = 1, r = t.length; n < r; n++) {
        const i = t[n - 1], s = t[n], l = s.originalStart - i.originalStart - i.originalLength, u = i.originalStart, o = s.originalStart + s.originalLength, c = o - u, h = i.modifiedStart, d = s.modifiedStart + s.modifiedLength, f = d - h;
        if (l < 5 && c < 20 && f < 20) {
          const g = this._findBetterContiguousSequence(u, c, h, f, l);
          if (g) {
            const [_, w] = g;
            (_ !== i.originalStart + i.originalLength || w !== i.modifiedStart + i.modifiedLength) && (i.originalLength = _ - i.originalStart, i.modifiedLength = w - i.modifiedStart, s.originalStart = _ + l, s.modifiedStart = w + l, s.originalLength = o - s.originalStart, s.modifiedLength = d - s.modifiedStart);
          }
        }
      }
    return t;
  }
  _findBetterContiguousSequence(t, n, r, i, s) {
    if (n < s || i < s)
      return null;
    const l = t + n - s + 1, u = r + i - s + 1;
    let o = 0, c = 0, h = 0;
    for (let d = t; d < l; d++)
      for (let f = r; f < u; f++) {
        const g = this._contiguousSequenceScore(d, f, s);
        g > 0 && g > o && (o = g, c = d, h = f);
      }
    return o > 0 ? [c, h] : null;
  }
  _contiguousSequenceScore(t, n, r) {
    let i = 0;
    for (let s = 0; s < r; s++) {
      if (!this.ElementsAreEqual(t + s, n + s))
        return 0;
      i += this._originalStringElements[t + s].length;
    }
    return i;
  }
  _OriginalIsBoundary(t) {
    return t <= 0 || t >= this._originalElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._originalStringElements[t]);
  }
  _OriginalRegionIsBoundary(t, n) {
    if (this._OriginalIsBoundary(t) || this._OriginalIsBoundary(t - 1))
      return !0;
    if (n > 0) {
      const r = t + n;
      if (this._OriginalIsBoundary(r - 1) || this._OriginalIsBoundary(r))
        return !0;
    }
    return !1;
  }
  _ModifiedIsBoundary(t) {
    return t <= 0 || t >= this._modifiedElementsOrHash.length - 1 ? !0 : this._hasStrings && /^\s*$/.test(this._modifiedStringElements[t]);
  }
  _ModifiedRegionIsBoundary(t, n) {
    if (this._ModifiedIsBoundary(t) || this._ModifiedIsBoundary(t - 1))
      return !0;
    if (n > 0) {
      const r = t + n;
      if (this._ModifiedIsBoundary(r - 1) || this._ModifiedIsBoundary(r))
        return !0;
    }
    return !1;
  }
  _boundaryScore(t, n, r, i) {
    const s = this._OriginalRegionIsBoundary(t, n) ? 1 : 0, l = this._ModifiedRegionIsBoundary(r, i) ? 1 : 0;
    return s + l;
  }
  ConcatenateChanges(t, n) {
    const r = [];
    if (t.length === 0 || n.length === 0)
      return n.length > 0 ? n : t;
    if (this.ChangesOverlap(t[t.length - 1], n[0], r)) {
      const i = new Array(t.length + n.length - 1);
      return Oe.Copy(t, 0, i, 0, t.length - 1), i[t.length - 1] = r[0], Oe.Copy(n, 1, i, t.length, n.length - 1), i;
    } else {
      const i = new Array(t.length + n.length);
      return Oe.Copy(t, 0, i, 0, t.length), Oe.Copy(n, 0, i, t.length, n.length), i;
    }
  }
  ChangesOverlap(t, n, r) {
    if (qe.Assert(t.originalStart <= n.originalStart, "Left change is not less than or equal to right change"), qe.Assert(t.modifiedStart <= n.modifiedStart, "Left change is not less than or equal to right change"), t.originalStart + t.originalLength >= n.originalStart || t.modifiedStart + t.modifiedLength >= n.modifiedStart) {
      const i = t.originalStart;
      let s = t.originalLength;
      const l = t.modifiedStart;
      let u = t.modifiedLength;
      return t.originalStart + t.originalLength >= n.originalStart && (s = n.originalStart + n.originalLength - t.originalStart), t.modifiedStart + t.modifiedLength >= n.modifiedStart && (u = n.modifiedStart + n.modifiedLength - t.modifiedStart), r[0] = new Me(i, s, l, u), !0;
    } else
      return r[0] = null, !1;
  }
  ClipDiagonalBound(t, n, r, i) {
    if (t >= 0 && t < i)
      return t;
    const s = r, l = i - r - 1, u = n % 2 === 0;
    if (t < 0) {
      const o = s % 2 === 0;
      return u === o ? 0 : 1;
    } else {
      const o = l % 2 === 0;
      return u === o ? i - 1 : i - 2;
    }
  }
}
let $e;
if (typeof ie.vscode < "u" && typeof ie.vscode.process < "u") {
  const e = ie.vscode.process;
  $e = {
    get platform() {
      return e.platform;
    },
    get arch() {
      return e.arch;
    },
    get env() {
      return e.env;
    },
    cwd() {
      return e.cwd();
    }
  };
} else
  typeof process < "u" ? $e = {
    get platform() {
      return process.platform;
    },
    get arch() {
      return process.arch;
    },
    get env() {
      return process.env;
    },
    cwd() {
      return process.env.VSCODE_CWD || process.cwd();
    }
  } : $e = {
    get platform() {
      return it ? "win32" : wa ? "darwin" : "linux";
    },
    get arch() {
    },
    get env() {
      return {};
    },
    cwd() {
      return "/";
    }
  };
const Yt = $e.cwd, Ja = $e.env, Be = $e.platform, Qa = 65, Ya = 97, Za = 90, Ka = 122, Ue = 46, te = 47, le = 92, Se = 58, es = 63;
class zi extends Error {
  constructor(t, n, r) {
    let i;
    typeof n == "string" && n.indexOf("not ") === 0 ? (i = "must not be", n = n.replace(/^not /, "")) : i = "must be";
    const s = t.indexOf(".") !== -1 ? "property" : "argument";
    let l = `The "${t}" ${s} ${i} of type ${n}`;
    l += `. Received type ${typeof r}`, super(l), this.code = "ERR_INVALID_ARG_TYPE";
  }
}
function K(e, t) {
  if (typeof e != "string")
    throw new zi(t, "string", e);
}
function V(e) {
  return e === te || e === le;
}
function Zt(e) {
  return e === te;
}
function xe(e) {
  return e >= Qa && e <= Za || e >= Ya && e <= Ka;
}
function yt(e, t, n, r) {
  let i = "", s = 0, l = -1, u = 0, o = 0;
  for (let c = 0; c <= e.length; ++c) {
    if (c < e.length)
      o = e.charCodeAt(c);
    else {
      if (r(o))
        break;
      o = te;
    }
    if (r(o)) {
      if (!(l === c - 1 || u === 1))
        if (u === 2) {
          if (i.length < 2 || s !== 2 || i.charCodeAt(i.length - 1) !== Ue || i.charCodeAt(i.length - 2) !== Ue) {
            if (i.length > 2) {
              const h = i.lastIndexOf(n);
              h === -1 ? (i = "", s = 0) : (i = i.slice(0, h), s = i.length - 1 - i.lastIndexOf(n)), l = c, u = 0;
              continue;
            } else if (i.length !== 0) {
              i = "", s = 0, l = c, u = 0;
              continue;
            }
          }
          t && (i += i.length > 0 ? `${n}..` : "..", s = 2);
        } else
          i.length > 0 ? i += `${n}${e.slice(l + 1, c)}` : i = e.slice(l + 1, c), s = c - l - 1;
      l = c, u = 0;
    } else
      o === Ue && u !== -1 ? ++u : u = -1;
  }
  return i;
}
function Wi(e, t) {
  if (t === null || typeof t != "object")
    throw new zi("pathObject", "Object", t);
  const n = t.dir || t.root, r = t.base || `${t.name || ""}${t.ext || ""}`;
  return n ? n === t.root ? `${n}${r}` : `${n}${e}${r}` : r;
}
const oe = {
  resolve(...e) {
    let t = "", n = "", r = !1;
    for (let i = e.length - 1; i >= -1; i--) {
      let s;
      if (i >= 0) {
        if (s = e[i], K(s, "path"), s.length === 0)
          continue;
      } else
        t.length === 0 ? s = Yt() : (s = Ja[`=${t}`] || Yt(), (s === void 0 || s.slice(0, 2).toLowerCase() !== t.toLowerCase() && s.charCodeAt(2) === le) && (s = `${t}\\`));
      const l = s.length;
      let u = 0, o = "", c = !1;
      const h = s.charCodeAt(0);
      if (l === 1)
        V(h) && (u = 1, c = !0);
      else if (V(h))
        if (c = !0, V(s.charCodeAt(1))) {
          let d = 2, f = d;
          for (; d < l && !V(s.charCodeAt(d)); )
            d++;
          if (d < l && d !== f) {
            const g = s.slice(f, d);
            for (f = d; d < l && V(s.charCodeAt(d)); )
              d++;
            if (d < l && d !== f) {
              for (f = d; d < l && !V(s.charCodeAt(d)); )
                d++;
              (d === l || d !== f) && (o = `\\\\${g}\\${s.slice(f, d)}`, u = d);
            }
          }
        } else
          u = 1;
      else
        xe(h) && s.charCodeAt(1) === Se && (o = s.slice(0, 2), u = 2, l > 2 && V(s.charCodeAt(2)) && (c = !0, u = 3));
      if (o.length > 0)
        if (t.length > 0) {
          if (o.toLowerCase() !== t.toLowerCase())
            continue;
        } else
          t = o;
      if (r) {
        if (t.length > 0)
          break;
      } else if (n = `${s.slice(u)}\\${n}`, r = c, c && t.length > 0)
        break;
    }
    return n = yt(n, !r, "\\", V), r ? `${t}\\${n}` : `${t}${n}` || ".";
  },
  normalize(e) {
    K(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let n = 0, r, i = !1;
    const s = e.charCodeAt(0);
    if (t === 1)
      return Zt(s) ? "\\" : e;
    if (V(s))
      if (i = !0, V(e.charCodeAt(1))) {
        let u = 2, o = u;
        for (; u < t && !V(e.charCodeAt(u)); )
          u++;
        if (u < t && u !== o) {
          const c = e.slice(o, u);
          for (o = u; u < t && V(e.charCodeAt(u)); )
            u++;
          if (u < t && u !== o) {
            for (o = u; u < t && !V(e.charCodeAt(u)); )
              u++;
            if (u === t)
              return `\\\\${c}\\${e.slice(o)}\\`;
            u !== o && (r = `\\\\${c}\\${e.slice(o, u)}`, n = u);
          }
        }
      } else
        n = 1;
    else
      xe(s) && e.charCodeAt(1) === Se && (r = e.slice(0, 2), n = 2, t > 2 && V(e.charCodeAt(2)) && (i = !0, n = 3));
    let l = n < t ? yt(e.slice(n), !i, "\\", V) : "";
    return l.length === 0 && !i && (l = "."), l.length > 0 && V(e.charCodeAt(t - 1)) && (l += "\\"), r === void 0 ? i ? `\\${l}` : l : i ? `${r}\\${l}` : `${r}${l}`;
  },
  isAbsolute(e) {
    K(e, "path");
    const t = e.length;
    if (t === 0)
      return !1;
    const n = e.charCodeAt(0);
    return V(n) || t > 2 && xe(n) && e.charCodeAt(1) === Se && V(e.charCodeAt(2));
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t, n;
    for (let s = 0; s < e.length; ++s) {
      const l = e[s];
      K(l, "path"), l.length > 0 && (t === void 0 ? t = n = l : t += `\\${l}`);
    }
    if (t === void 0)
      return ".";
    let r = !0, i = 0;
    if (typeof n == "string" && V(n.charCodeAt(0))) {
      ++i;
      const s = n.length;
      s > 1 && V(n.charCodeAt(1)) && (++i, s > 2 && (V(n.charCodeAt(2)) ? ++i : r = !1));
    }
    if (r) {
      for (; i < t.length && V(t.charCodeAt(i)); )
        i++;
      i >= 2 && (t = `\\${t.slice(i)}`);
    }
    return oe.normalize(t);
  },
  relative(e, t) {
    if (K(e, "from"), K(t, "to"), e === t)
      return "";
    const n = oe.resolve(e), r = oe.resolve(t);
    if (n === r || (e = n.toLowerCase(), t = r.toLowerCase(), e === t))
      return "";
    let i = 0;
    for (; i < e.length && e.charCodeAt(i) === le; )
      i++;
    let s = e.length;
    for (; s - 1 > i && e.charCodeAt(s - 1) === le; )
      s--;
    const l = s - i;
    let u = 0;
    for (; u < t.length && t.charCodeAt(u) === le; )
      u++;
    let o = t.length;
    for (; o - 1 > u && t.charCodeAt(o - 1) === le; )
      o--;
    const c = o - u, h = l < c ? l : c;
    let d = -1, f = 0;
    for (; f < h; f++) {
      const _ = e.charCodeAt(i + f);
      if (_ !== t.charCodeAt(u + f))
        break;
      _ === le && (d = f);
    }
    if (f !== h) {
      if (d === -1)
        return r;
    } else {
      if (c > h) {
        if (t.charCodeAt(u + f) === le)
          return r.slice(u + f + 1);
        if (f === 2)
          return r.slice(u + f);
      }
      l > h && (e.charCodeAt(i + f) === le ? d = f : f === 2 && (d = 3)), d === -1 && (d = 0);
    }
    let g = "";
    for (f = i + d + 1; f <= s; ++f)
      (f === s || e.charCodeAt(f) === le) && (g += g.length === 0 ? ".." : "\\..");
    return u += d, g.length > 0 ? `${g}${r.slice(u, o)}` : (r.charCodeAt(u) === le && ++u, r.slice(u, o));
  },
  toNamespacedPath(e) {
    if (typeof e != "string")
      return e;
    if (e.length === 0)
      return "";
    const t = oe.resolve(e);
    if (t.length <= 2)
      return e;
    if (t.charCodeAt(0) === le) {
      if (t.charCodeAt(1) === le) {
        const n = t.charCodeAt(2);
        if (n !== es && n !== Ue)
          return `\\\\?\\UNC\\${t.slice(2)}`;
      }
    } else if (xe(t.charCodeAt(0)) && t.charCodeAt(1) === Se && t.charCodeAt(2) === le)
      return `\\\\?\\${t}`;
    return e;
  },
  dirname(e) {
    K(e, "path");
    const t = e.length;
    if (t === 0)
      return ".";
    let n = -1, r = 0;
    const i = e.charCodeAt(0);
    if (t === 1)
      return V(i) ? e : ".";
    if (V(i)) {
      if (n = r = 1, V(e.charCodeAt(1))) {
        let u = 2, o = u;
        for (; u < t && !V(e.charCodeAt(u)); )
          u++;
        if (u < t && u !== o) {
          for (o = u; u < t && V(e.charCodeAt(u)); )
            u++;
          if (u < t && u !== o) {
            for (o = u; u < t && !V(e.charCodeAt(u)); )
              u++;
            if (u === t)
              return e;
            u !== o && (n = r = u + 1);
          }
        }
      }
    } else
      xe(i) && e.charCodeAt(1) === Se && (n = t > 2 && V(e.charCodeAt(2)) ? 3 : 2, r = n);
    let s = -1, l = !0;
    for (let u = t - 1; u >= r; --u)
      if (V(e.charCodeAt(u))) {
        if (!l) {
          s = u;
          break;
        }
      } else
        l = !1;
    if (s === -1) {
      if (n === -1)
        return ".";
      s = n;
    }
    return e.slice(0, s);
  },
  basename(e, t) {
    t !== void 0 && K(t, "ext"), K(e, "path");
    let n = 0, r = -1, i = !0, s;
    if (e.length >= 2 && xe(e.charCodeAt(0)) && e.charCodeAt(1) === Se && (n = 2), t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let l = t.length - 1, u = -1;
      for (s = e.length - 1; s >= n; --s) {
        const o = e.charCodeAt(s);
        if (V(o)) {
          if (!i) {
            n = s + 1;
            break;
          }
        } else
          u === -1 && (i = !1, u = s + 1), l >= 0 && (o === t.charCodeAt(l) ? --l === -1 && (r = s) : (l = -1, r = u));
      }
      return n === r ? r = u : r === -1 && (r = e.length), e.slice(n, r);
    }
    for (s = e.length - 1; s >= n; --s)
      if (V(e.charCodeAt(s))) {
        if (!i) {
          n = s + 1;
          break;
        }
      } else
        r === -1 && (i = !1, r = s + 1);
    return r === -1 ? "" : e.slice(n, r);
  },
  extname(e) {
    K(e, "path");
    let t = 0, n = -1, r = 0, i = -1, s = !0, l = 0;
    e.length >= 2 && e.charCodeAt(1) === Se && xe(e.charCodeAt(0)) && (t = r = 2);
    for (let u = e.length - 1; u >= t; --u) {
      const o = e.charCodeAt(u);
      if (V(o)) {
        if (!s) {
          r = u + 1;
          break;
        }
        continue;
      }
      i === -1 && (s = !1, i = u + 1), o === Ue ? n === -1 ? n = u : l !== 1 && (l = 1) : n !== -1 && (l = -1);
    }
    return n === -1 || i === -1 || l === 0 || l === 1 && n === i - 1 && n === r + 1 ? "" : e.slice(n, i);
  },
  format: Wi.bind(null, "\\"),
  parse(e) {
    K(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const n = e.length;
    let r = 0, i = e.charCodeAt(0);
    if (n === 1)
      return V(i) ? (t.root = t.dir = e, t) : (t.base = t.name = e, t);
    if (V(i)) {
      if (r = 1, V(e.charCodeAt(1))) {
        let d = 2, f = d;
        for (; d < n && !V(e.charCodeAt(d)); )
          d++;
        if (d < n && d !== f) {
          for (f = d; d < n && V(e.charCodeAt(d)); )
            d++;
          if (d < n && d !== f) {
            for (f = d; d < n && !V(e.charCodeAt(d)); )
              d++;
            d === n ? r = d : d !== f && (r = d + 1);
          }
        }
      }
    } else if (xe(i) && e.charCodeAt(1) === Se) {
      if (n <= 2)
        return t.root = t.dir = e, t;
      if (r = 2, V(e.charCodeAt(2))) {
        if (n === 3)
          return t.root = t.dir = e, t;
        r = 3;
      }
    }
    r > 0 && (t.root = e.slice(0, r));
    let s = -1, l = r, u = -1, o = !0, c = e.length - 1, h = 0;
    for (; c >= r; --c) {
      if (i = e.charCodeAt(c), V(i)) {
        if (!o) {
          l = c + 1;
          break;
        }
        continue;
      }
      u === -1 && (o = !1, u = c + 1), i === Ue ? s === -1 ? s = c : h !== 1 && (h = 1) : s !== -1 && (h = -1);
    }
    return u !== -1 && (s === -1 || h === 0 || h === 1 && s === u - 1 && s === l + 1 ? t.base = t.name = e.slice(l, u) : (t.name = e.slice(l, s), t.base = e.slice(l, u), t.ext = e.slice(s, u))), l > 0 && l !== r ? t.dir = e.slice(0, l - 1) : t.dir = t.root, t;
  },
  sep: "\\",
  delimiter: ";",
  win32: null,
  posix: null
}, ce = {
  resolve(...e) {
    let t = "", n = !1;
    for (let r = e.length - 1; r >= -1 && !n; r--) {
      const i = r >= 0 ? e[r] : Yt();
      K(i, "path"), i.length !== 0 && (t = `${i}/${t}`, n = i.charCodeAt(0) === te);
    }
    return t = yt(t, !n, "/", Zt), n ? `/${t}` : t.length > 0 ? t : ".";
  },
  normalize(e) {
    if (K(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === te, n = e.charCodeAt(e.length - 1) === te;
    return e = yt(e, !t, "/", Zt), e.length === 0 ? t ? "/" : n ? "./" : "." : (n && (e += "/"), t ? `/${e}` : e);
  },
  isAbsolute(e) {
    return K(e, "path"), e.length > 0 && e.charCodeAt(0) === te;
  },
  join(...e) {
    if (e.length === 0)
      return ".";
    let t;
    for (let n = 0; n < e.length; ++n) {
      const r = e[n];
      K(r, "path"), r.length > 0 && (t === void 0 ? t = r : t += `/${r}`);
    }
    return t === void 0 ? "." : ce.normalize(t);
  },
  relative(e, t) {
    if (K(e, "from"), K(t, "to"), e === t || (e = ce.resolve(e), t = ce.resolve(t), e === t))
      return "";
    const n = 1, r = e.length, i = r - n, s = 1, l = t.length - s, u = i < l ? i : l;
    let o = -1, c = 0;
    for (; c < u; c++) {
      const d = e.charCodeAt(n + c);
      if (d !== t.charCodeAt(s + c))
        break;
      d === te && (o = c);
    }
    if (c === u)
      if (l > u) {
        if (t.charCodeAt(s + c) === te)
          return t.slice(s + c + 1);
        if (c === 0)
          return t.slice(s + c);
      } else
        i > u && (e.charCodeAt(n + c) === te ? o = c : c === 0 && (o = 0));
    let h = "";
    for (c = n + o + 1; c <= r; ++c)
      (c === r || e.charCodeAt(c) === te) && (h += h.length === 0 ? ".." : "/..");
    return `${h}${t.slice(s + o)}`;
  },
  toNamespacedPath(e) {
    return e;
  },
  dirname(e) {
    if (K(e, "path"), e.length === 0)
      return ".";
    const t = e.charCodeAt(0) === te;
    let n = -1, r = !0;
    for (let i = e.length - 1; i >= 1; --i)
      if (e.charCodeAt(i) === te) {
        if (!r) {
          n = i;
          break;
        }
      } else
        r = !1;
    return n === -1 ? t ? "/" : "." : t && n === 1 ? "//" : e.slice(0, n);
  },
  basename(e, t) {
    t !== void 0 && K(t, "ext"), K(e, "path");
    let n = 0, r = -1, i = !0, s;
    if (t !== void 0 && t.length > 0 && t.length <= e.length) {
      if (t === e)
        return "";
      let l = t.length - 1, u = -1;
      for (s = e.length - 1; s >= 0; --s) {
        const o = e.charCodeAt(s);
        if (o === te) {
          if (!i) {
            n = s + 1;
            break;
          }
        } else
          u === -1 && (i = !1, u = s + 1), l >= 0 && (o === t.charCodeAt(l) ? --l === -1 && (r = s) : (l = -1, r = u));
      }
      return n === r ? r = u : r === -1 && (r = e.length), e.slice(n, r);
    }
    for (s = e.length - 1; s >= 0; --s)
      if (e.charCodeAt(s) === te) {
        if (!i) {
          n = s + 1;
          break;
        }
      } else
        r === -1 && (i = !1, r = s + 1);
    return r === -1 ? "" : e.slice(n, r);
  },
  extname(e) {
    K(e, "path");
    let t = -1, n = 0, r = -1, i = !0, s = 0;
    for (let l = e.length - 1; l >= 0; --l) {
      const u = e.charCodeAt(l);
      if (u === te) {
        if (!i) {
          n = l + 1;
          break;
        }
        continue;
      }
      r === -1 && (i = !1, r = l + 1), u === Ue ? t === -1 ? t = l : s !== 1 && (s = 1) : t !== -1 && (s = -1);
    }
    return t === -1 || r === -1 || s === 0 || s === 1 && t === r - 1 && t === n + 1 ? "" : e.slice(t, r);
  },
  format: Wi.bind(null, "/"),
  parse(e) {
    K(e, "path");
    const t = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return t;
    const n = e.charCodeAt(0) === te;
    let r;
    n ? (t.root = "/", r = 1) : r = 0;
    let i = -1, s = 0, l = -1, u = !0, o = e.length - 1, c = 0;
    for (; o >= r; --o) {
      const h = e.charCodeAt(o);
      if (h === te) {
        if (!u) {
          s = o + 1;
          break;
        }
        continue;
      }
      l === -1 && (u = !1, l = o + 1), h === Ue ? i === -1 ? i = o : c !== 1 && (c = 1) : i !== -1 && (c = -1);
    }
    if (l !== -1) {
      const h = s === 0 && n ? 1 : s;
      i === -1 || c === 0 || c === 1 && i === l - 1 && i === s + 1 ? t.base = t.name = e.slice(h, l) : (t.name = e.slice(h, i), t.base = e.slice(h, l), t.ext = e.slice(i, l));
    }
    return s > 0 ? t.dir = e.slice(0, s - 1) : n && (t.dir = "/"), t;
  },
  sep: "/",
  delimiter: ":",
  win32: null,
  posix: null
};
ce.win32 = oe.win32 = oe;
ce.posix = oe.posix = ce;
Be === "win32" ? oe.normalize : ce.normalize;
Be === "win32" ? oe.resolve : ce.resolve;
Be === "win32" ? oe.relative : ce.relative;
Be === "win32" ? oe.dirname : ce.dirname;
Be === "win32" ? oe.basename : ce.basename;
Be === "win32" ? oe.extname : ce.extname;
Be === "win32" ? oe.sep : ce.sep;
const ts = /^\w[\w\d+.-]*$/, ns = /^\//, rs = /^\/\//;
function Hn(e, t) {
  if (!e.scheme && t)
    throw new Error(`[UriError]: Scheme is missing: {scheme: "", authority: "${e.authority}", path: "${e.path}", query: "${e.query}", fragment: "${e.fragment}"}`);
  if (e.scheme && !ts.test(e.scheme))
    throw new Error("[UriError]: Scheme contains illegal characters.");
  if (e.path) {
    if (e.authority) {
      if (!ns.test(e.path))
        throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
    } else if (rs.test(e.path))
      throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
  }
}
function is(e, t) {
  return !e && !t ? "file" : e;
}
function as(e, t) {
  switch (e) {
    case "https":
    case "http":
    case "file":
      t ? t[0] !== _e && (t = _e + t) : t = _e;
      break;
  }
  return t;
}
const Q = "", _e = "/", ss = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/;
let Xe = class {
  constructor(t, n, r, i, s, l = !1) {
    typeof t == "object" ? (this.scheme = t.scheme || Q, this.authority = t.authority || Q, this.path = t.path || Q, this.query = t.query || Q, this.fragment = t.fragment || Q) : (this.scheme = is(t, l), this.authority = n || Q, this.path = as(this.scheme, r || Q), this.query = i || Q, this.fragment = s || Q, Hn(this, l));
  }
  static isUri(t) {
    return t instanceof Xe ? !0 : t ? typeof t.authority == "string" && typeof t.fragment == "string" && typeof t.path == "string" && typeof t.query == "string" && typeof t.scheme == "string" && typeof t.fsPath == "string" && typeof t.with == "function" && typeof t.toString == "function" : !1;
  }
  get fsPath() {
    return Kt(this, !1);
  }
  with(t) {
    if (!t)
      return this;
    let { scheme: n, authority: r, path: i, query: s, fragment: l } = t;
    return n === void 0 ? n = this.scheme : n === null && (n = Q), r === void 0 ? r = this.authority : r === null && (r = Q), i === void 0 ? i = this.path : i === null && (i = Q), s === void 0 ? s = this.query : s === null && (s = Q), l === void 0 ? l = this.fragment : l === null && (l = Q), n === this.scheme && r === this.authority && i === this.path && s === this.query && l === this.fragment ? this : new Ve(n, r, i, s, l);
  }
  static parse(t, n = !1) {
    const r = ss.exec(t);
    return r ? new Ve(r[2] || Q, ft(r[4] || Q), ft(r[5] || Q), ft(r[7] || Q), ft(r[9] || Q), n) : new Ve(Q, Q, Q, Q, Q);
  }
  static file(t) {
    let n = Q;
    if (it && (t = t.replace(/\\/g, _e)), t[0] === _e && t[1] === _e) {
      const r = t.indexOf(_e, 2);
      r === -1 ? (n = t.substring(2), t = _e) : (n = t.substring(2, r), t = t.substring(r) || _e);
    }
    return new Ve("file", n, t, Q, Q);
  }
  static from(t) {
    const n = new Ve(t.scheme, t.authority, t.path, t.query, t.fragment);
    return Hn(n, !0), n;
  }
  static joinPath(t, ...n) {
    if (!t.path)
      throw new Error("[UriError]: cannot call joinPath on URI without path");
    let r;
    return it && t.scheme === "file" ? r = Xe.file(oe.join(Kt(t, !0), ...n)).path : r = ce.join(t.path, ...n), t.with({ path: r });
  }
  toString(t = !1) {
    return en(this, t);
  }
  toJSON() {
    return this;
  }
  static revive(t) {
    if (t) {
      if (t instanceof Xe)
        return t;
      {
        const n = new Ve(t);
        return n._formatted = t.external, n._fsPath = t._sep === Fi ? t.fsPath : null, n;
      }
    } else
      return t;
  }
};
const Fi = it ? 1 : void 0;
class Ve extends Xe {
  constructor() {
    super(...arguments), this._formatted = null, this._fsPath = null;
  }
  get fsPath() {
    return this._fsPath || (this._fsPath = Kt(this, !1)), this._fsPath;
  }
  toString(t = !1) {
    return t ? en(this, !0) : (this._formatted || (this._formatted = en(this, !1)), this._formatted);
  }
  toJSON() {
    const t = {
      $mid: 1
    };
    return this._fsPath && (t.fsPath = this._fsPath, t._sep = Fi), this._formatted && (t.external = this._formatted), this.path && (t.path = this.path), this.scheme && (t.scheme = this.scheme), this.authority && (t.authority = this.authority), this.query && (t.query = this.query), this.fragment && (t.fragment = this.fragment), t;
  }
}
const Pi = {
  [58]: "%3A",
  [47]: "%2F",
  [63]: "%3F",
  [35]: "%23",
  [91]: "%5B",
  [93]: "%5D",
  [64]: "%40",
  [33]: "%21",
  [36]: "%24",
  [38]: "%26",
  [39]: "%27",
  [40]: "%28",
  [41]: "%29",
  [42]: "%2A",
  [43]: "%2B",
  [44]: "%2C",
  [59]: "%3B",
  [61]: "%3D",
  [32]: "%20"
};
function zn(e, t) {
  let n, r = -1;
  for (let i = 0; i < e.length; i++) {
    const s = e.charCodeAt(i);
    if (s >= 97 && s <= 122 || s >= 65 && s <= 90 || s >= 48 && s <= 57 || s === 45 || s === 46 || s === 95 || s === 126 || t && s === 47)
      r !== -1 && (n += encodeURIComponent(e.substring(r, i)), r = -1), n !== void 0 && (n += e.charAt(i));
    else {
      n === void 0 && (n = e.substr(0, i));
      const l = Pi[s];
      l !== void 0 ? (r !== -1 && (n += encodeURIComponent(e.substring(r, i)), r = -1), n += l) : r === -1 && (r = i);
    }
  }
  return r !== -1 && (n += encodeURIComponent(e.substring(r))), n !== void 0 ? n : e;
}
function os(e) {
  let t;
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n);
    r === 35 || r === 63 ? (t === void 0 && (t = e.substr(0, n)), t += Pi[r]) : t !== void 0 && (t += e[n]);
  }
  return t !== void 0 ? t : e;
}
function Kt(e, t) {
  let n;
  return e.authority && e.path.length > 1 && e.scheme === "file" ? n = `//${e.authority}${e.path}` : e.path.charCodeAt(0) === 47 && (e.path.charCodeAt(1) >= 65 && e.path.charCodeAt(1) <= 90 || e.path.charCodeAt(1) >= 97 && e.path.charCodeAt(1) <= 122) && e.path.charCodeAt(2) === 58 ? t ? n = e.path.substr(1) : n = e.path[1].toLowerCase() + e.path.substr(2) : n = e.path, it && (n = n.replace(/\//g, "\\")), n;
}
function en(e, t) {
  const n = t ? os : zn;
  let r = "", { scheme: i, authority: s, path: l, query: u, fragment: o } = e;
  if (i && (r += i, r += ":"), (s || i === "file") && (r += _e, r += _e), s) {
    let c = s.indexOf("@");
    if (c !== -1) {
      const h = s.substr(0, c);
      s = s.substr(c + 1), c = h.indexOf(":"), c === -1 ? r += n(h, !1) : (r += n(h.substr(0, c), !1), r += ":", r += n(h.substr(c + 1), !1)), r += "@";
    }
    s = s.toLowerCase(), c = s.indexOf(":"), c === -1 ? r += n(s, !1) : (r += n(s.substr(0, c), !1), r += s.substr(c));
  }
  if (l) {
    if (l.length >= 3 && l.charCodeAt(0) === 47 && l.charCodeAt(2) === 58) {
      const c = l.charCodeAt(1);
      c >= 65 && c <= 90 && (l = `/${String.fromCharCode(c + 32)}:${l.substr(3)}`);
    } else if (l.length >= 2 && l.charCodeAt(1) === 58) {
      const c = l.charCodeAt(0);
      c >= 65 && c <= 90 && (l = `${String.fromCharCode(c + 32)}:${l.substr(2)}`);
    }
    r += n(l, !0);
  }
  return u && (r += "?", r += n(u, !1)), o && (r += "#", r += t ? o : zn(o, !1)), r;
}
function Bi(e) {
  try {
    return decodeURIComponent(e);
  } catch {
    return e.length > 3 ? e.substr(0, 3) + Bi(e.substr(3)) : e;
  }
}
const Wn = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
function ft(e) {
  return e.match(Wn) ? e.replace(Wn, (t) => Bi(t)) : e;
}
let me = class {
  constructor(t, n) {
    this.lineNumber = t, this.column = n;
  }
  with(t = this.lineNumber, n = this.column) {
    return t === this.lineNumber && n === this.column ? this : new me(t, n);
  }
  delta(t = 0, n = 0) {
    return this.with(this.lineNumber + t, this.column + n);
  }
  equals(t) {
    return me.equals(this, t);
  }
  static equals(t, n) {
    return !t && !n ? !0 : !!t && !!n && t.lineNumber === n.lineNumber && t.column === n.column;
  }
  isBefore(t) {
    return me.isBefore(this, t);
  }
  static isBefore(t, n) {
    return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column < n.column;
  }
  isBeforeOrEqual(t) {
    return me.isBeforeOrEqual(this, t);
  }
  static isBeforeOrEqual(t, n) {
    return t.lineNumber < n.lineNumber ? !0 : n.lineNumber < t.lineNumber ? !1 : t.column <= n.column;
  }
  static compare(t, n) {
    const r = t.lineNumber | 0, i = n.lineNumber | 0;
    if (r === i) {
      const s = t.column | 0, l = n.column | 0;
      return s - l;
    }
    return r - i;
  }
  clone() {
    return new me(this.lineNumber, this.column);
  }
  toString() {
    return "(" + this.lineNumber + "," + this.column + ")";
  }
  static lift(t) {
    return new me(t.lineNumber, t.column);
  }
  static isIPosition(t) {
    return t && typeof t.lineNumber == "number" && typeof t.column == "number";
  }
}, Z = class {
  constructor(t, n, r, i) {
    t > r || t === r && n > i ? (this.startLineNumber = r, this.startColumn = i, this.endLineNumber = t, this.endColumn = n) : (this.startLineNumber = t, this.startColumn = n, this.endLineNumber = r, this.endColumn = i);
  }
  isEmpty() {
    return Z.isEmpty(this);
  }
  static isEmpty(t) {
    return t.startLineNumber === t.endLineNumber && t.startColumn === t.endColumn;
  }
  containsPosition(t) {
    return Z.containsPosition(this, t);
  }
  static containsPosition(t, n) {
    return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column < t.startColumn || n.lineNumber === t.endLineNumber && n.column > t.endColumn);
  }
  static strictContainsPosition(t, n) {
    return !(n.lineNumber < t.startLineNumber || n.lineNumber > t.endLineNumber || n.lineNumber === t.startLineNumber && n.column <= t.startColumn || n.lineNumber === t.endLineNumber && n.column >= t.endColumn);
  }
  containsRange(t) {
    return Z.containsRange(this, t);
  }
  static containsRange(t, n) {
    return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn < t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn > t.endColumn);
  }
  strictContainsRange(t) {
    return Z.strictContainsRange(this, t);
  }
  static strictContainsRange(t, n) {
    return !(n.startLineNumber < t.startLineNumber || n.endLineNumber < t.startLineNumber || n.startLineNumber > t.endLineNumber || n.endLineNumber > t.endLineNumber || n.startLineNumber === t.startLineNumber && n.startColumn <= t.startColumn || n.endLineNumber === t.endLineNumber && n.endColumn >= t.endColumn);
  }
  plusRange(t) {
    return Z.plusRange(this, t);
  }
  static plusRange(t, n) {
    let r, i, s, l;
    return n.startLineNumber < t.startLineNumber ? (r = n.startLineNumber, i = n.startColumn) : n.startLineNumber === t.startLineNumber ? (r = n.startLineNumber, i = Math.min(n.startColumn, t.startColumn)) : (r = t.startLineNumber, i = t.startColumn), n.endLineNumber > t.endLineNumber ? (s = n.endLineNumber, l = n.endColumn) : n.endLineNumber === t.endLineNumber ? (s = n.endLineNumber, l = Math.max(n.endColumn, t.endColumn)) : (s = t.endLineNumber, l = t.endColumn), new Z(r, i, s, l);
  }
  intersectRanges(t) {
    return Z.intersectRanges(this, t);
  }
  static intersectRanges(t, n) {
    let r = t.startLineNumber, i = t.startColumn, s = t.endLineNumber, l = t.endColumn;
    const u = n.startLineNumber, o = n.startColumn, c = n.endLineNumber, h = n.endColumn;
    return r < u ? (r = u, i = o) : r === u && (i = Math.max(i, o)), s > c ? (s = c, l = h) : s === c && (l = Math.min(l, h)), r > s || r === s && i > l ? null : new Z(r, i, s, l);
  }
  equalsRange(t) {
    return Z.equalsRange(this, t);
  }
  static equalsRange(t, n) {
    return !!t && !!n && t.startLineNumber === n.startLineNumber && t.startColumn === n.startColumn && t.endLineNumber === n.endLineNumber && t.endColumn === n.endColumn;
  }
  getEndPosition() {
    return Z.getEndPosition(this);
  }
  static getEndPosition(t) {
    return new me(t.endLineNumber, t.endColumn);
  }
  getStartPosition() {
    return Z.getStartPosition(this);
  }
  static getStartPosition(t) {
    return new me(t.startLineNumber, t.startColumn);
  }
  toString() {
    return "[" + this.startLineNumber + "," + this.startColumn + " -> " + this.endLineNumber + "," + this.endColumn + "]";
  }
  setEndPosition(t, n) {
    return new Z(this.startLineNumber, this.startColumn, t, n);
  }
  setStartPosition(t, n) {
    return new Z(t, n, this.endLineNumber, this.endColumn);
  }
  collapseToStart() {
    return Z.collapseToStart(this);
  }
  static collapseToStart(t) {
    return new Z(t.startLineNumber, t.startColumn, t.startLineNumber, t.startColumn);
  }
  static fromPositions(t, n = t) {
    return new Z(t.lineNumber, t.column, n.lineNumber, n.column);
  }
  static lift(t) {
    return t ? new Z(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : null;
  }
  static isIRange(t) {
    return t && typeof t.startLineNumber == "number" && typeof t.startColumn == "number" && typeof t.endLineNumber == "number" && typeof t.endColumn == "number";
  }
  static areIntersectingOrTouching(t, n) {
    return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn < n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn < t.startColumn);
  }
  static areIntersecting(t, n) {
    return !(t.endLineNumber < n.startLineNumber || t.endLineNumber === n.startLineNumber && t.endColumn <= n.startColumn || n.endLineNumber < t.startLineNumber || n.endLineNumber === t.startLineNumber && n.endColumn <= t.startColumn);
  }
  static compareRangesUsingStarts(t, n) {
    if (t && n) {
      const s = t.startLineNumber | 0, l = n.startLineNumber | 0;
      if (s === l) {
        const u = t.startColumn | 0, o = n.startColumn | 0;
        if (u === o) {
          const c = t.endLineNumber | 0, h = n.endLineNumber | 0;
          if (c === h) {
            const d = t.endColumn | 0, f = n.endColumn | 0;
            return d - f;
          }
          return c - h;
        }
        return u - o;
      }
      return s - l;
    }
    return (t ? 1 : 0) - (n ? 1 : 0);
  }
  static compareRangesUsingEnds(t, n) {
    return t.endLineNumber === n.endLineNumber ? t.endColumn === n.endColumn ? t.startLineNumber === n.startLineNumber ? t.startColumn - n.startColumn : t.startLineNumber - n.startLineNumber : t.endColumn - n.endColumn : t.endLineNumber - n.endLineNumber;
  }
  static spansMultipleLines(t) {
    return t.endLineNumber > t.startLineNumber;
  }
  toJSON() {
    return this;
  }
};
const ls = 3;
function qi(e, t, n, r) {
  return new Re(e, t, n).ComputeDiff(r);
}
class Fn {
  constructor(t) {
    const n = [], r = [];
    for (let i = 0, s = t.length; i < s; i++)
      n[i] = tn(t[i], 1), r[i] = nn(t[i], 1);
    this.lines = t, this._startColumns = n, this._endColumns = r;
  }
  getElements() {
    const t = [];
    for (let n = 0, r = this.lines.length; n < r; n++)
      t[n] = this.lines[n].substring(this._startColumns[n] - 1, this._endColumns[n] - 1);
    return t;
  }
  getStrictElement(t) {
    return this.lines[t];
  }
  getStartLineNumber(t) {
    return t + 1;
  }
  getEndLineNumber(t) {
    return t + 1;
  }
  createCharSequence(t, n, r) {
    const i = [], s = [], l = [];
    let u = 0;
    for (let o = n; o <= r; o++) {
      const c = this.lines[o], h = t ? this._startColumns[o] : 1, d = t ? this._endColumns[o] : c.length + 1;
      for (let f = h; f < d; f++)
        i[u] = c.charCodeAt(f - 1), s[u] = o + 1, l[u] = f, u++;
      !t && o < r && (i[u] = 10, s[u] = o + 1, l[u] = c.length + 1, u++);
    }
    return new us(i, s, l);
  }
}
class us {
  constructor(t, n, r) {
    this._charCodes = t, this._lineNumbers = n, this._columns = r;
  }
  toString() {
    return "[" + this._charCodes.map((t, n) => (t === 10 ? "\\n" : String.fromCharCode(t)) + `-(${this._lineNumbers[n]},${this._columns[n]})`).join(", ") + "]";
  }
  _assertIndex(t, n) {
    if (t < 0 || t >= n.length)
      throw new Error("Illegal index");
  }
  getElements() {
    return this._charCodes;
  }
  getStartLineNumber(t) {
    return t > 0 && t === this._lineNumbers.length ? this.getEndLineNumber(t - 1) : (this._assertIndex(t, this._lineNumbers), this._lineNumbers[t]);
  }
  getEndLineNumber(t) {
    return t === -1 ? this.getStartLineNumber(t + 1) : (this._assertIndex(t, this._lineNumbers), this._charCodes[t] === 10 ? this._lineNumbers[t] + 1 : this._lineNumbers[t]);
  }
  getStartColumn(t) {
    return t > 0 && t === this._columns.length ? this.getEndColumn(t - 1) : (this._assertIndex(t, this._columns), this._columns[t]);
  }
  getEndColumn(t) {
    return t === -1 ? this.getStartColumn(t + 1) : (this._assertIndex(t, this._columns), this._charCodes[t] === 10 ? 1 : this._columns[t] + 1);
  }
}
class at {
  constructor(t, n, r, i, s, l, u, o) {
    this.originalStartLineNumber = t, this.originalStartColumn = n, this.originalEndLineNumber = r, this.originalEndColumn = i, this.modifiedStartLineNumber = s, this.modifiedStartColumn = l, this.modifiedEndLineNumber = u, this.modifiedEndColumn = o;
  }
  static createFromDiffChange(t, n, r) {
    const i = n.getStartLineNumber(t.originalStart), s = n.getStartColumn(t.originalStart), l = n.getEndLineNumber(t.originalStart + t.originalLength - 1), u = n.getEndColumn(t.originalStart + t.originalLength - 1), o = r.getStartLineNumber(t.modifiedStart), c = r.getStartColumn(t.modifiedStart), h = r.getEndLineNumber(t.modifiedStart + t.modifiedLength - 1), d = r.getEndColumn(t.modifiedStart + t.modifiedLength - 1);
    return new at(i, s, l, u, o, c, h, d);
  }
}
function cs(e) {
  if (e.length <= 1)
    return e;
  const t = [e[0]];
  let n = t[0];
  for (let r = 1, i = e.length; r < i; r++) {
    const s = e[r], l = s.originalStart - (n.originalStart + n.originalLength), u = s.modifiedStart - (n.modifiedStart + n.modifiedLength);
    Math.min(l, u) < ls ? (n.originalLength = s.originalStart + s.originalLength - n.originalStart, n.modifiedLength = s.modifiedStart + s.modifiedLength - n.modifiedStart) : (t.push(s), n = s);
  }
  return t;
}
class tt {
  constructor(t, n, r, i, s) {
    this.originalStartLineNumber = t, this.originalEndLineNumber = n, this.modifiedStartLineNumber = r, this.modifiedEndLineNumber = i, this.charChanges = s;
  }
  static createFromDiffResult(t, n, r, i, s, l, u) {
    let o, c, h, d, f;
    if (n.originalLength === 0 ? (o = r.getStartLineNumber(n.originalStart) - 1, c = 0) : (o = r.getStartLineNumber(n.originalStart), c = r.getEndLineNumber(n.originalStart + n.originalLength - 1)), n.modifiedLength === 0 ? (h = i.getStartLineNumber(n.modifiedStart) - 1, d = 0) : (h = i.getStartLineNumber(n.modifiedStart), d = i.getEndLineNumber(n.modifiedStart + n.modifiedLength - 1)), l && n.originalLength > 0 && n.originalLength < 20 && n.modifiedLength > 0 && n.modifiedLength < 20 && s()) {
      const g = r.createCharSequence(t, n.originalStart, n.originalStart + n.originalLength - 1), _ = i.createCharSequence(t, n.modifiedStart, n.modifiedStart + n.modifiedLength - 1);
      if (g.getElements().length > 0 && _.getElements().length > 0) {
        let w = qi(g, _, s, !0).changes;
        u && (w = cs(w)), f = [];
        for (let y = 0, k = w.length; y < k; y++)
          f.push(at.createFromDiffChange(w[y], g, _));
      }
    }
    return new tt(o, c, h, d, f);
  }
}
class hs {
  constructor(t, n, r) {
    this.shouldComputeCharChanges = r.shouldComputeCharChanges, this.shouldPostProcessCharChanges = r.shouldPostProcessCharChanges, this.shouldIgnoreTrimWhitespace = r.shouldIgnoreTrimWhitespace, this.shouldMakePrettyDiff = r.shouldMakePrettyDiff, this.originalLines = t, this.modifiedLines = n, this.original = new Fn(t), this.modified = new Fn(n), this.continueLineDiff = Pn(r.maxComputationTime), this.continueCharDiff = Pn(r.maxComputationTime === 0 ? 0 : Math.min(r.maxComputationTime, 5e3));
  }
  computeDiff() {
    if (this.original.lines.length === 1 && this.original.lines[0].length === 0)
      return this.modified.lines.length === 1 && this.modified.lines[0].length === 0 ? {
        quitEarly: !1,
        changes: []
      } : {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: 1,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: this.modified.lines.length,
          charChanges: [{
            modifiedEndColumn: 0,
            modifiedEndLineNumber: 0,
            modifiedStartColumn: 0,
            modifiedStartLineNumber: 0,
            originalEndColumn: 0,
            originalEndLineNumber: 0,
            originalStartColumn: 0,
            originalStartLineNumber: 0
          }]
        }]
      };
    if (this.modified.lines.length === 1 && this.modified.lines[0].length === 0)
      return {
        quitEarly: !1,
        changes: [{
          originalStartLineNumber: 1,
          originalEndLineNumber: this.original.lines.length,
          modifiedStartLineNumber: 1,
          modifiedEndLineNumber: 1,
          charChanges: [{
            modifiedEndColumn: 0,
            modifiedEndLineNumber: 0,
            modifiedStartColumn: 0,
            modifiedStartLineNumber: 0,
            originalEndColumn: 0,
            originalEndLineNumber: 0,
            originalStartColumn: 0,
            originalStartLineNumber: 0
          }]
        }]
      };
    const t = qi(this.original, this.modified, this.continueLineDiff, this.shouldMakePrettyDiff), n = t.changes, r = t.quitEarly;
    if (this.shouldIgnoreTrimWhitespace) {
      const u = [];
      for (let o = 0, c = n.length; o < c; o++)
        u.push(tt.createFromDiffResult(this.shouldIgnoreTrimWhitespace, n[o], this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges));
      return {
        quitEarly: r,
        changes: u
      };
    }
    const i = [];
    let s = 0, l = 0;
    for (let u = -1, o = n.length; u < o; u++) {
      const c = u + 1 < o ? n[u + 1] : null, h = c ? c.originalStart : this.originalLines.length, d = c ? c.modifiedStart : this.modifiedLines.length;
      for (; s < h && l < d; ) {
        const f = this.originalLines[s], g = this.modifiedLines[l];
        if (f !== g) {
          {
            let _ = tn(f, 1), w = tn(g, 1);
            for (; _ > 1 && w > 1; ) {
              const y = f.charCodeAt(_ - 2), k = g.charCodeAt(w - 2);
              if (y !== k)
                break;
              _--, w--;
            }
            (_ > 1 || w > 1) && this._pushTrimWhitespaceCharChange(i, s + 1, 1, _, l + 1, 1, w);
          }
          {
            let _ = nn(f, 1), w = nn(g, 1);
            const y = f.length + 1, k = g.length + 1;
            for (; _ < y && w < k; ) {
              const v = f.charCodeAt(_ - 1), L = f.charCodeAt(w - 1);
              if (v !== L)
                break;
              _++, w++;
            }
            (_ < y || w < k) && this._pushTrimWhitespaceCharChange(i, s + 1, _, y, l + 1, w, k);
          }
        }
        s++, l++;
      }
      c && (i.push(tt.createFromDiffResult(this.shouldIgnoreTrimWhitespace, c, this.original, this.modified, this.continueCharDiff, this.shouldComputeCharChanges, this.shouldPostProcessCharChanges)), s += c.originalLength, l += c.modifiedLength);
    }
    return {
      quitEarly: r,
      changes: i
    };
  }
  _pushTrimWhitespaceCharChange(t, n, r, i, s, l, u) {
    if (this._mergeTrimWhitespaceCharChange(t, n, r, i, s, l, u))
      return;
    let o;
    this.shouldComputeCharChanges && (o = [new at(n, r, n, i, s, l, s, u)]), t.push(new tt(n, n, s, s, o));
  }
  _mergeTrimWhitespaceCharChange(t, n, r, i, s, l, u) {
    const o = t.length;
    if (o === 0)
      return !1;
    const c = t[o - 1];
    return c.originalEndLineNumber === 0 || c.modifiedEndLineNumber === 0 ? !1 : c.originalEndLineNumber + 1 === n && c.modifiedEndLineNumber + 1 === s ? (c.originalEndLineNumber = n, c.modifiedEndLineNumber = s, this.shouldComputeCharChanges && c.charChanges && c.charChanges.push(new at(n, r, n, i, s, l, s, u)), !0) : !1;
  }
}
function tn(e, t) {
  const n = Ra(e);
  return n === -1 ? t : n + 1;
}
function nn(e, t) {
  const n = Na(e);
  return n === -1 ? t : n + 2;
}
function Pn(e) {
  if (e === 0)
    return () => !0;
  const t = Date.now();
  return () => Date.now() - t < e;
}
var Bn;
(function(e) {
  function t(i) {
    return i < 0;
  }
  e.isLessThan = t;
  function n(i) {
    return i > 0;
  }
  e.isGreaterThan = n;
  function r(i) {
    return i === 0;
  }
  e.isNeitherLessOrGreaterThan = r, e.greaterThan = 1, e.lessThan = -1, e.neitherLessOrGreaterThan = 0;
})(Bn || (Bn = {}));
function qn(e) {
  return e < 0 ? 0 : e > 255 ? 255 : e | 0;
}
function je(e) {
  return e < 0 ? 0 : e > 4294967295 ? 4294967295 : e | 0;
}
class ds {
  constructor(t) {
    this.values = t, this.prefixSum = new Uint32Array(t.length), this.prefixSumValidIndex = new Int32Array(1), this.prefixSumValidIndex[0] = -1;
  }
  insertValues(t, n) {
    t = je(t);
    const r = this.values, i = this.prefixSum, s = n.length;
    return s === 0 ? !1 : (this.values = new Uint32Array(r.length + s), this.values.set(r.subarray(0, t), 0), this.values.set(r.subarray(t), t + s), this.values.set(n, t), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSum = new Uint32Array(this.values.length), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  setValue(t, n) {
    return t = je(t), n = je(n), this.values[t] === n ? !1 : (this.values[t] = n, t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), !0);
  }
  removeValues(t, n) {
    t = je(t), n = je(n);
    const r = this.values, i = this.prefixSum;
    if (t >= r.length)
      return !1;
    const s = r.length - t;
    return n >= s && (n = s), n === 0 ? !1 : (this.values = new Uint32Array(r.length - n), this.values.set(r.subarray(0, t), 0), this.values.set(r.subarray(t + n), t), this.prefixSum = new Uint32Array(this.values.length), t - 1 < this.prefixSumValidIndex[0] && (this.prefixSumValidIndex[0] = t - 1), this.prefixSumValidIndex[0] >= 0 && this.prefixSum.set(i.subarray(0, this.prefixSumValidIndex[0] + 1)), !0);
  }
  getTotalSum() {
    return this.values.length === 0 ? 0 : this._getPrefixSum(this.values.length - 1);
  }
  getPrefixSum(t) {
    return t < 0 ? 0 : (t = je(t), this._getPrefixSum(t));
  }
  _getPrefixSum(t) {
    if (t <= this.prefixSumValidIndex[0])
      return this.prefixSum[t];
    let n = this.prefixSumValidIndex[0] + 1;
    n === 0 && (this.prefixSum[0] = this.values[0], n++), t >= this.values.length && (t = this.values.length - 1);
    for (let r = n; r <= t; r++)
      this.prefixSum[r] = this.prefixSum[r - 1] + this.values[r];
    return this.prefixSumValidIndex[0] = Math.max(this.prefixSumValidIndex[0], t), this.prefixSum[t];
  }
  getIndexOf(t) {
    t = Math.floor(t), this.getTotalSum();
    let n = 0, r = this.values.length - 1, i = 0, s = 0, l = 0;
    for (; n <= r; )
      if (i = n + (r - n) / 2 | 0, s = this.prefixSum[i], l = s - this.values[i], t < l)
        r = i - 1;
      else if (t >= s)
        n = i + 1;
      else
        break;
    return new fs(i, t - l);
  }
}
class fs {
  constructor(t, n) {
    this.index = t, this.remainder = n, this._prefixSumIndexOfResultBrand = void 0, this.index = t, this.remainder = n;
  }
}
class ms {
  constructor(t, n, r, i) {
    this._uri = t, this._lines = n, this._eol = r, this._versionId = i, this._lineStarts = null, this._cachedTextValue = null;
  }
  dispose() {
    this._lines.length = 0;
  }
  get version() {
    return this._versionId;
  }
  getText() {
    return this._cachedTextValue === null && (this._cachedTextValue = this._lines.join(this._eol)), this._cachedTextValue;
  }
  onEvents(t) {
    t.eol && t.eol !== this._eol && (this._eol = t.eol, this._lineStarts = null);
    const n = t.changes;
    for (const r of n)
      this._acceptDeleteRange(r.range), this._acceptInsertText(new me(r.range.startLineNumber, r.range.startColumn), r.text);
    this._versionId = t.versionId, this._cachedTextValue = null;
  }
  _ensureLineStarts() {
    if (!this._lineStarts) {
      const t = this._eol.length, n = this._lines.length, r = new Uint32Array(n);
      for (let i = 0; i < n; i++)
        r[i] = this._lines[i].length + t;
      this._lineStarts = new ds(r);
    }
  }
  _setLineText(t, n) {
    this._lines[t] = n, this._lineStarts && this._lineStarts.setValue(t, this._lines[t].length + this._eol.length);
  }
  _acceptDeleteRange(t) {
    if (t.startLineNumber === t.endLineNumber) {
      if (t.startColumn === t.endColumn)
        return;
      this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.startLineNumber - 1].substring(t.endColumn - 1));
      return;
    }
    this._setLineText(t.startLineNumber - 1, this._lines[t.startLineNumber - 1].substring(0, t.startColumn - 1) + this._lines[t.endLineNumber - 1].substring(t.endColumn - 1)), this._lines.splice(t.startLineNumber, t.endLineNumber - t.startLineNumber), this._lineStarts && this._lineStarts.removeValues(t.startLineNumber, t.endLineNumber - t.startLineNumber);
  }
  _acceptInsertText(t, n) {
    if (n.length === 0)
      return;
    const r = Da(n);
    if (r.length === 1) {
      this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + r[0] + this._lines[t.lineNumber - 1].substring(t.column - 1));
      return;
    }
    r[r.length - 1] += this._lines[t.lineNumber - 1].substring(t.column - 1), this._setLineText(t.lineNumber - 1, this._lines[t.lineNumber - 1].substring(0, t.column - 1) + r[0]);
    const i = new Uint32Array(r.length - 1);
    for (let s = 1; s < r.length; s++)
      this._lines.splice(t.lineNumber + s - 1, 0, r[s]), i[s - 1] = r[s].length + this._eol.length;
    this._lineStarts && this._lineStarts.insertValues(t.lineNumber, i);
  }
}
const ps = "`~!@#$%^&*()-=+[{]}\\|;:'\",.<>/?";
function gs(e = "") {
  let t = "(-?\\d*\\.\\d\\w*)|([^";
  for (const n of ps)
    e.indexOf(n) >= 0 || (t += "\\" + n);
  return t += "\\s]+)", new RegExp(t, "g");
}
const Oi = gs();
function bs(e) {
  let t = Oi;
  if (e && e instanceof RegExp)
    if (e.global)
      t = e;
    else {
      let n = "g";
      e.ignoreCase && (n += "i"), e.multiline && (n += "m"), e.unicode && (n += "u"), t = new RegExp(e.source, n);
    }
  return t.lastIndex = 0, t;
}
const Vi = new vt();
Vi.unshift({
  maxLen: 1e3,
  windowSize: 15,
  timeBudget: 150
});
function An(e, t, n, r, i) {
  if (i || (i = wt.first(Vi)), n.length > i.maxLen) {
    let c = e - i.maxLen / 2;
    return c < 0 ? c = 0 : r += c, n = n.substring(c, e + i.maxLen / 2), An(e, t, n, r, i);
  }
  const s = Date.now(), l = e - 1 - r;
  let u = -1, o = null;
  for (let c = 1; !(Date.now() - s >= i.timeBudget); c++) {
    const h = l - i.windowSize * c;
    t.lastIndex = Math.max(0, h);
    const d = ws(t, n, l, u);
    if (!d && o || (o = d, h <= 0))
      break;
    u = h;
  }
  if (o) {
    const c = {
      word: o[0],
      startColumn: r + 1 + o.index,
      endColumn: r + 1 + o.index + o[0].length
    };
    return t.lastIndex = 0, c;
  }
  return null;
}
function ws(e, t, n, r) {
  let i;
  for (; i = e.exec(t); ) {
    const s = i.index || 0;
    if (s <= n && e.lastIndex >= n)
      return i;
    if (r > 0 && s > r)
      return null;
  }
  return null;
}
class Cn {
  constructor(t) {
    const n = qn(t);
    this._defaultValue = n, this._asciiMap = Cn._createAsciiMap(n), this._map = /* @__PURE__ */ new Map();
  }
  static _createAsciiMap(t) {
    const n = new Uint8Array(256);
    for (let r = 0; r < 256; r++)
      n[r] = t;
    return n;
  }
  set(t, n) {
    const r = qn(n);
    t >= 0 && t < 256 ? this._asciiMap[t] = r : this._map.set(t, r);
  }
  get(t) {
    return t >= 0 && t < 256 ? this._asciiMap[t] : this._map.get(t) || this._defaultValue;
  }
}
class _s {
  constructor(t, n, r) {
    const i = new Uint8Array(t * n);
    for (let s = 0, l = t * n; s < l; s++)
      i[s] = r;
    this._data = i, this.rows = t, this.cols = n;
  }
  get(t, n) {
    return this._data[t * this.cols + n];
  }
  set(t, n, r) {
    this._data[t * this.cols + n] = r;
  }
}
class vs {
  constructor(t) {
    let n = 0, r = 0;
    for (let s = 0, l = t.length; s < l; s++) {
      const [u, o, c] = t[s];
      o > n && (n = o), u > r && (r = u), c > r && (r = c);
    }
    n++, r++;
    const i = new _s(r, n, 0);
    for (let s = 0, l = t.length; s < l; s++) {
      const [u, o, c] = t[s];
      i.set(u, o, c);
    }
    this._states = i, this._maxCharCode = n;
  }
  nextState(t, n) {
    return n < 0 || n >= this._maxCharCode ? 0 : this._states.get(t, n);
  }
}
let qt = null;
function ys() {
  return qt === null && (qt = new vs([
    [1, 104, 2],
    [1, 72, 2],
    [1, 102, 6],
    [1, 70, 6],
    [2, 116, 3],
    [2, 84, 3],
    [3, 116, 4],
    [3, 84, 4],
    [4, 112, 5],
    [4, 80, 5],
    [5, 115, 9],
    [5, 83, 9],
    [5, 58, 10],
    [6, 105, 7],
    [6, 73, 7],
    [7, 108, 8],
    [7, 76, 8],
    [8, 101, 9],
    [8, 69, 9],
    [9, 58, 10],
    [10, 47, 11],
    [11, 47, 12]
  ])), qt;
}
let Ze = null;
function Ts() {
  if (Ze === null) {
    Ze = new Cn(0);
    const e = ` 	<>'"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…`;
    for (let n = 0; n < e.length; n++)
      Ze.set(e.charCodeAt(n), 1);
    const t = ".,;:";
    for (let n = 0; n < t.length; n++)
      Ze.set(t.charCodeAt(n), 2);
  }
  return Ze;
}
class Tt {
  static _createLink(t, n, r, i, s) {
    let l = s - 1;
    do {
      const u = n.charCodeAt(l);
      if (t.get(u) !== 2)
        break;
      l--;
    } while (l > i);
    if (i > 0) {
      const u = n.charCodeAt(i - 1), o = n.charCodeAt(l);
      (u === 40 && o === 41 || u === 91 && o === 93 || u === 123 && o === 125) && l--;
    }
    return {
      range: {
        startLineNumber: r,
        startColumn: i + 1,
        endLineNumber: r,
        endColumn: l + 2
      },
      url: n.substring(i, l + 1)
    };
  }
  static computeLinks(t, n = ys()) {
    const r = Ts(), i = [];
    for (let s = 1, l = t.getLineCount(); s <= l; s++) {
      const u = t.getLineContent(s), o = u.length;
      let c = 0, h = 0, d = 0, f = 1, g = !1, _ = !1, w = !1, y = !1;
      for (; c < o; ) {
        let k = !1;
        const v = u.charCodeAt(c);
        if (f === 13) {
          let L;
          switch (v) {
            case 40:
              g = !0, L = 0;
              break;
            case 41:
              L = g ? 0 : 1;
              break;
            case 91:
              w = !0, _ = !0, L = 0;
              break;
            case 93:
              w = !1, L = _ ? 0 : 1;
              break;
            case 123:
              y = !0, L = 0;
              break;
            case 125:
              L = y ? 0 : 1;
              break;
            case 39:
              L = d === 39 ? 1 : 0;
              break;
            case 34:
              L = d === 34 ? 1 : 0;
              break;
            case 96:
              L = d === 96 ? 1 : 0;
              break;
            case 42:
              L = d === 42 ? 1 : 0;
              break;
            case 124:
              L = d === 124 ? 1 : 0;
              break;
            case 32:
              L = w ? 0 : 1;
              break;
            default:
              L = r.get(v);
          }
          L === 1 && (i.push(Tt._createLink(r, u, s, h, c)), k = !0);
        } else if (f === 12) {
          let L;
          v === 91 ? (_ = !0, L = 0) : L = r.get(v), L === 1 ? k = !0 : f = 13;
        } else
          f = n.nextState(f, v), f === 0 && (k = !0);
        k && (f = 1, g = !1, _ = !1, y = !1, h = c + 1, d = v), c++;
      }
      f === 13 && i.push(Tt._createLink(r, u, s, h, o));
    }
    return i;
  }
}
function ks(e) {
  return !e || typeof e.getLineCount != "function" || typeof e.getLineContent != "function" ? [] : Tt.computeLinks(e);
}
class rn {
  constructor() {
    this._defaultValueSet = [
      ["true", "false"],
      ["True", "False"],
      ["Private", "Public", "Friend", "ReadOnly", "Partial", "Protected", "WriteOnly"],
      ["public", "protected", "private"]
    ];
  }
  navigateValueSet(t, n, r, i, s) {
    if (t && n) {
      const l = this.doNavigateValueSet(n, s);
      if (l)
        return {
          range: t,
          value: l
        };
    }
    if (r && i) {
      const l = this.doNavigateValueSet(i, s);
      if (l)
        return {
          range: r,
          value: l
        };
    }
    return null;
  }
  doNavigateValueSet(t, n) {
    const r = this.numberReplace(t, n);
    return r !== null ? r : this.textReplace(t, n);
  }
  numberReplace(t, n) {
    const r = Math.pow(10, t.length - (t.lastIndexOf(".") + 1));
    let i = Number(t);
    const s = parseFloat(t);
    return !isNaN(i) && !isNaN(s) && i === s ? i === 0 && !n ? null : (i = Math.floor(i * r), i += n ? r : -r, String(i / r)) : null;
  }
  textReplace(t, n) {
    return this.valueSetsReplace(this._defaultValueSet, t, n);
  }
  valueSetsReplace(t, n, r) {
    let i = null;
    for (let s = 0, l = t.length; i === null && s < l; s++)
      i = this.valueSetReplace(t[s], n, r);
    return i;
  }
  valueSetReplace(t, n, r) {
    let i = t.indexOf(n);
    return i >= 0 ? (i += r ? 1 : -1, i < 0 ? i = t.length - 1 : i %= t.length, t[i]) : null;
  }
}
rn.INSTANCE = new rn();
const ji = Object.freeze(function(e, t) {
  const n = setTimeout(e.bind(t), 0);
  return { dispose() {
    clearTimeout(n);
  } };
});
var kt;
(function(e) {
  function t(n) {
    return n === e.None || n === e.Cancelled || n instanceof gt ? !0 : !n || typeof n != "object" ? !1 : typeof n.isCancellationRequested == "boolean" && typeof n.onCancellationRequested == "function";
  }
  e.isCancellationToken = t, e.None = Object.freeze({
    isCancellationRequested: !1,
    onCancellationRequested: Xt.None
  }), e.Cancelled = Object.freeze({
    isCancellationRequested: !0,
    onCancellationRequested: ji
  });
})(kt || (kt = {}));
class gt {
  constructor() {
    this._isCancelled = !1, this._emitter = null;
  }
  cancel() {
    this._isCancelled || (this._isCancelled = !0, this._emitter && (this._emitter.fire(void 0), this.dispose()));
  }
  get isCancellationRequested() {
    return this._isCancelled;
  }
  get onCancellationRequested() {
    return this._isCancelled ? ji : (this._emitter || (this._emitter = new ke()), this._emitter.event);
  }
  dispose() {
    this._emitter && (this._emitter.dispose(), this._emitter = null);
  }
}
class As {
  constructor(t) {
    this._token = void 0, this._parentListener = void 0, this._parentListener = t && t.onCancellationRequested(this.cancel, this);
  }
  get token() {
    return this._token || (this._token = new gt()), this._token;
  }
  cancel() {
    this._token ? this._token instanceof gt && this._token.cancel() : this._token = kt.Cancelled;
  }
  dispose(t = !1) {
    t && this.cancel(), this._parentListener && this._parentListener.dispose(), this._token ? this._token instanceof gt && this._token.dispose() : this._token = kt.None;
  }
}
class Sn {
  constructor() {
    this._keyCodeToStr = [], this._strToKeyCode = /* @__PURE__ */ Object.create(null);
  }
  define(t, n) {
    this._keyCodeToStr[t] = n, this._strToKeyCode[n.toLowerCase()] = t;
  }
  keyCodeToStr(t) {
    return this._keyCodeToStr[t];
  }
  strToKeyCode(t) {
    return this._strToKeyCode[t.toLowerCase()] || 0;
  }
}
const bt = new Sn(), an = new Sn(), sn = new Sn(), Cs = new Array(230), Ss = /* @__PURE__ */ Object.create(null), xs = /* @__PURE__ */ Object.create(null);
(function() {
  const e = "", t = [
    [0, 1, 0, "None", 0, "unknown", 0, "VK_UNKNOWN", e, e],
    [0, 1, 1, "Hyper", 0, e, 0, e, e, e],
    [0, 1, 2, "Super", 0, e, 0, e, e, e],
    [0, 1, 3, "Fn", 0, e, 0, e, e, e],
    [0, 1, 4, "FnLock", 0, e, 0, e, e, e],
    [0, 1, 5, "Suspend", 0, e, 0, e, e, e],
    [0, 1, 6, "Resume", 0, e, 0, e, e, e],
    [0, 1, 7, "Turbo", 0, e, 0, e, e, e],
    [0, 1, 8, "Sleep", 0, e, 0, "VK_SLEEP", e, e],
    [0, 1, 9, "WakeUp", 0, e, 0, e, e, e],
    [31, 0, 10, "KeyA", 31, "A", 65, "VK_A", e, e],
    [32, 0, 11, "KeyB", 32, "B", 66, "VK_B", e, e],
    [33, 0, 12, "KeyC", 33, "C", 67, "VK_C", e, e],
    [34, 0, 13, "KeyD", 34, "D", 68, "VK_D", e, e],
    [35, 0, 14, "KeyE", 35, "E", 69, "VK_E", e, e],
    [36, 0, 15, "KeyF", 36, "F", 70, "VK_F", e, e],
    [37, 0, 16, "KeyG", 37, "G", 71, "VK_G", e, e],
    [38, 0, 17, "KeyH", 38, "H", 72, "VK_H", e, e],
    [39, 0, 18, "KeyI", 39, "I", 73, "VK_I", e, e],
    [40, 0, 19, "KeyJ", 40, "J", 74, "VK_J", e, e],
    [41, 0, 20, "KeyK", 41, "K", 75, "VK_K", e, e],
    [42, 0, 21, "KeyL", 42, "L", 76, "VK_L", e, e],
    [43, 0, 22, "KeyM", 43, "M", 77, "VK_M", e, e],
    [44, 0, 23, "KeyN", 44, "N", 78, "VK_N", e, e],
    [45, 0, 24, "KeyO", 45, "O", 79, "VK_O", e, e],
    [46, 0, 25, "KeyP", 46, "P", 80, "VK_P", e, e],
    [47, 0, 26, "KeyQ", 47, "Q", 81, "VK_Q", e, e],
    [48, 0, 27, "KeyR", 48, "R", 82, "VK_R", e, e],
    [49, 0, 28, "KeyS", 49, "S", 83, "VK_S", e, e],
    [50, 0, 29, "KeyT", 50, "T", 84, "VK_T", e, e],
    [51, 0, 30, "KeyU", 51, "U", 85, "VK_U", e, e],
    [52, 0, 31, "KeyV", 52, "V", 86, "VK_V", e, e],
    [53, 0, 32, "KeyW", 53, "W", 87, "VK_W", e, e],
    [54, 0, 33, "KeyX", 54, "X", 88, "VK_X", e, e],
    [55, 0, 34, "KeyY", 55, "Y", 89, "VK_Y", e, e],
    [56, 0, 35, "KeyZ", 56, "Z", 90, "VK_Z", e, e],
    [22, 0, 36, "Digit1", 22, "1", 49, "VK_1", e, e],
    [23, 0, 37, "Digit2", 23, "2", 50, "VK_2", e, e],
    [24, 0, 38, "Digit3", 24, "3", 51, "VK_3", e, e],
    [25, 0, 39, "Digit4", 25, "4", 52, "VK_4", e, e],
    [26, 0, 40, "Digit5", 26, "5", 53, "VK_5", e, e],
    [27, 0, 41, "Digit6", 27, "6", 54, "VK_6", e, e],
    [28, 0, 42, "Digit7", 28, "7", 55, "VK_7", e, e],
    [29, 0, 43, "Digit8", 29, "8", 56, "VK_8", e, e],
    [30, 0, 44, "Digit9", 30, "9", 57, "VK_9", e, e],
    [21, 0, 45, "Digit0", 21, "0", 48, "VK_0", e, e],
    [3, 1, 46, "Enter", 3, "Enter", 13, "VK_RETURN", e, e],
    [9, 1, 47, "Escape", 9, "Escape", 27, "VK_ESCAPE", e, e],
    [1, 1, 48, "Backspace", 1, "Backspace", 8, "VK_BACK", e, e],
    [2, 1, 49, "Tab", 2, "Tab", 9, "VK_TAB", e, e],
    [10, 1, 50, "Space", 10, "Space", 32, "VK_SPACE", e, e],
    [83, 0, 51, "Minus", 83, "-", 189, "VK_OEM_MINUS", "-", "OEM_MINUS"],
    [81, 0, 52, "Equal", 81, "=", 187, "VK_OEM_PLUS", "=", "OEM_PLUS"],
    [87, 0, 53, "BracketLeft", 87, "[", 219, "VK_OEM_4", "[", "OEM_4"],
    [89, 0, 54, "BracketRight", 89, "]", 221, "VK_OEM_6", "]", "OEM_6"],
    [88, 0, 55, "Backslash", 88, "\\", 220, "VK_OEM_5", "\\", "OEM_5"],
    [0, 0, 56, "IntlHash", 0, e, 0, e, e, e],
    [80, 0, 57, "Semicolon", 80, ";", 186, "VK_OEM_1", ";", "OEM_1"],
    [90, 0, 58, "Quote", 90, "'", 222, "VK_OEM_7", "'", "OEM_7"],
    [86, 0, 59, "Backquote", 86, "`", 192, "VK_OEM_3", "`", "OEM_3"],
    [82, 0, 60, "Comma", 82, ",", 188, "VK_OEM_COMMA", ",", "OEM_COMMA"],
    [84, 0, 61, "Period", 84, ".", 190, "VK_OEM_PERIOD", ".", "OEM_PERIOD"],
    [85, 0, 62, "Slash", 85, "/", 191, "VK_OEM_2", "/", "OEM_2"],
    [8, 1, 63, "CapsLock", 8, "CapsLock", 20, "VK_CAPITAL", e, e],
    [59, 1, 64, "F1", 59, "F1", 112, "VK_F1", e, e],
    [60, 1, 65, "F2", 60, "F2", 113, "VK_F2", e, e],
    [61, 1, 66, "F3", 61, "F3", 114, "VK_F3", e, e],
    [62, 1, 67, "F4", 62, "F4", 115, "VK_F4", e, e],
    [63, 1, 68, "F5", 63, "F5", 116, "VK_F5", e, e],
    [64, 1, 69, "F6", 64, "F6", 117, "VK_F6", e, e],
    [65, 1, 70, "F7", 65, "F7", 118, "VK_F7", e, e],
    [66, 1, 71, "F8", 66, "F8", 119, "VK_F8", e, e],
    [67, 1, 72, "F9", 67, "F9", 120, "VK_F9", e, e],
    [68, 1, 73, "F10", 68, "F10", 121, "VK_F10", e, e],
    [69, 1, 74, "F11", 69, "F11", 122, "VK_F11", e, e],
    [70, 1, 75, "F12", 70, "F12", 123, "VK_F12", e, e],
    [0, 1, 76, "PrintScreen", 0, e, 0, e, e, e],
    [79, 1, 77, "ScrollLock", 79, "ScrollLock", 145, "VK_SCROLL", e, e],
    [7, 1, 78, "Pause", 7, "PauseBreak", 19, "VK_PAUSE", e, e],
    [19, 1, 79, "Insert", 19, "Insert", 45, "VK_INSERT", e, e],
    [14, 1, 80, "Home", 14, "Home", 36, "VK_HOME", e, e],
    [11, 1, 81, "PageUp", 11, "PageUp", 33, "VK_PRIOR", e, e],
    [20, 1, 82, "Delete", 20, "Delete", 46, "VK_DELETE", e, e],
    [13, 1, 83, "End", 13, "End", 35, "VK_END", e, e],
    [12, 1, 84, "PageDown", 12, "PageDown", 34, "VK_NEXT", e, e],
    [17, 1, 85, "ArrowRight", 17, "RightArrow", 39, "VK_RIGHT", "Right", e],
    [15, 1, 86, "ArrowLeft", 15, "LeftArrow", 37, "VK_LEFT", "Left", e],
    [18, 1, 87, "ArrowDown", 18, "DownArrow", 40, "VK_DOWN", "Down", e],
    [16, 1, 88, "ArrowUp", 16, "UpArrow", 38, "VK_UP", "Up", e],
    [78, 1, 89, "NumLock", 78, "NumLock", 144, "VK_NUMLOCK", e, e],
    [108, 1, 90, "NumpadDivide", 108, "NumPad_Divide", 111, "VK_DIVIDE", e, e],
    [103, 1, 91, "NumpadMultiply", 103, "NumPad_Multiply", 106, "VK_MULTIPLY", e, e],
    [106, 1, 92, "NumpadSubtract", 106, "NumPad_Subtract", 109, "VK_SUBTRACT", e, e],
    [104, 1, 93, "NumpadAdd", 104, "NumPad_Add", 107, "VK_ADD", e, e],
    [3, 1, 94, "NumpadEnter", 3, e, 0, e, e, e],
    [94, 1, 95, "Numpad1", 94, "NumPad1", 97, "VK_NUMPAD1", e, e],
    [95, 1, 96, "Numpad2", 95, "NumPad2", 98, "VK_NUMPAD2", e, e],
    [96, 1, 97, "Numpad3", 96, "NumPad3", 99, "VK_NUMPAD3", e, e],
    [97, 1, 98, "Numpad4", 97, "NumPad4", 100, "VK_NUMPAD4", e, e],
    [98, 1, 99, "Numpad5", 98, "NumPad5", 101, "VK_NUMPAD5", e, e],
    [99, 1, 100, "Numpad6", 99, "NumPad6", 102, "VK_NUMPAD6", e, e],
    [100, 1, 101, "Numpad7", 100, "NumPad7", 103, "VK_NUMPAD7", e, e],
    [101, 1, 102, "Numpad8", 101, "NumPad8", 104, "VK_NUMPAD8", e, e],
    [102, 1, 103, "Numpad9", 102, "NumPad9", 105, "VK_NUMPAD9", e, e],
    [93, 1, 104, "Numpad0", 93, "NumPad0", 96, "VK_NUMPAD0", e, e],
    [107, 1, 105, "NumpadDecimal", 107, "NumPad_Decimal", 110, "VK_DECIMAL", e, e],
    [92, 0, 106, "IntlBackslash", 92, "OEM_102", 226, "VK_OEM_102", e, e],
    [58, 1, 107, "ContextMenu", 58, "ContextMenu", 93, e, e, e],
    [0, 1, 108, "Power", 0, e, 0, e, e, e],
    [0, 1, 109, "NumpadEqual", 0, e, 0, e, e, e],
    [71, 1, 110, "F13", 71, "F13", 124, "VK_F13", e, e],
    [72, 1, 111, "F14", 72, "F14", 125, "VK_F14", e, e],
    [73, 1, 112, "F15", 73, "F15", 126, "VK_F15", e, e],
    [74, 1, 113, "F16", 74, "F16", 127, "VK_F16", e, e],
    [75, 1, 114, "F17", 75, "F17", 128, "VK_F17", e, e],
    [76, 1, 115, "F18", 76, "F18", 129, "VK_F18", e, e],
    [77, 1, 116, "F19", 77, "F19", 130, "VK_F19", e, e],
    [0, 1, 117, "F20", 0, e, 0, "VK_F20", e, e],
    [0, 1, 118, "F21", 0, e, 0, "VK_F21", e, e],
    [0, 1, 119, "F22", 0, e, 0, "VK_F22", e, e],
    [0, 1, 120, "F23", 0, e, 0, "VK_F23", e, e],
    [0, 1, 121, "F24", 0, e, 0, "VK_F24", e, e],
    [0, 1, 122, "Open", 0, e, 0, e, e, e],
    [0, 1, 123, "Help", 0, e, 0, e, e, e],
    [0, 1, 124, "Select", 0, e, 0, e, e, e],
    [0, 1, 125, "Again", 0, e, 0, e, e, e],
    [0, 1, 126, "Undo", 0, e, 0, e, e, e],
    [0, 1, 127, "Cut", 0, e, 0, e, e, e],
    [0, 1, 128, "Copy", 0, e, 0, e, e, e],
    [0, 1, 129, "Paste", 0, e, 0, e, e, e],
    [0, 1, 130, "Find", 0, e, 0, e, e, e],
    [0, 1, 131, "AudioVolumeMute", 112, "AudioVolumeMute", 173, "VK_VOLUME_MUTE", e, e],
    [0, 1, 132, "AudioVolumeUp", 113, "AudioVolumeUp", 175, "VK_VOLUME_UP", e, e],
    [0, 1, 133, "AudioVolumeDown", 114, "AudioVolumeDown", 174, "VK_VOLUME_DOWN", e, e],
    [105, 1, 134, "NumpadComma", 105, "NumPad_Separator", 108, "VK_SEPARATOR", e, e],
    [110, 0, 135, "IntlRo", 110, "ABNT_C1", 193, "VK_ABNT_C1", e, e],
    [0, 1, 136, "KanaMode", 0, e, 0, e, e, e],
    [0, 0, 137, "IntlYen", 0, e, 0, e, e, e],
    [0, 1, 138, "Convert", 0, e, 0, e, e, e],
    [0, 1, 139, "NonConvert", 0, e, 0, e, e, e],
    [0, 1, 140, "Lang1", 0, e, 0, e, e, e],
    [0, 1, 141, "Lang2", 0, e, 0, e, e, e],
    [0, 1, 142, "Lang3", 0, e, 0, e, e, e],
    [0, 1, 143, "Lang4", 0, e, 0, e, e, e],
    [0, 1, 144, "Lang5", 0, e, 0, e, e, e],
    [0, 1, 145, "Abort", 0, e, 0, e, e, e],
    [0, 1, 146, "Props", 0, e, 0, e, e, e],
    [0, 1, 147, "NumpadParenLeft", 0, e, 0, e, e, e],
    [0, 1, 148, "NumpadParenRight", 0, e, 0, e, e, e],
    [0, 1, 149, "NumpadBackspace", 0, e, 0, e, e, e],
    [0, 1, 150, "NumpadMemoryStore", 0, e, 0, e, e, e],
    [0, 1, 151, "NumpadMemoryRecall", 0, e, 0, e, e, e],
    [0, 1, 152, "NumpadMemoryClear", 0, e, 0, e, e, e],
    [0, 1, 153, "NumpadMemoryAdd", 0, e, 0, e, e, e],
    [0, 1, 154, "NumpadMemorySubtract", 0, e, 0, e, e, e],
    [0, 1, 155, "NumpadClear", 126, "Clear", 12, "VK_CLEAR", e, e],
    [0, 1, 156, "NumpadClearEntry", 0, e, 0, e, e, e],
    [5, 1, 0, e, 5, "Ctrl", 17, "VK_CONTROL", e, e],
    [4, 1, 0, e, 4, "Shift", 16, "VK_SHIFT", e, e],
    [6, 1, 0, e, 6, "Alt", 18, "VK_MENU", e, e],
    [57, 1, 0, e, 57, "Meta", 0, "VK_COMMAND", e, e],
    [5, 1, 157, "ControlLeft", 5, e, 0, "VK_LCONTROL", e, e],
    [4, 1, 158, "ShiftLeft", 4, e, 0, "VK_LSHIFT", e, e],
    [6, 1, 159, "AltLeft", 6, e, 0, "VK_LMENU", e, e],
    [57, 1, 160, "MetaLeft", 57, e, 0, "VK_LWIN", e, e],
    [5, 1, 161, "ControlRight", 5, e, 0, "VK_RCONTROL", e, e],
    [4, 1, 162, "ShiftRight", 4, e, 0, "VK_RSHIFT", e, e],
    [6, 1, 163, "AltRight", 6, e, 0, "VK_RMENU", e, e],
    [57, 1, 164, "MetaRight", 57, e, 0, "VK_RWIN", e, e],
    [0, 1, 165, "BrightnessUp", 0, e, 0, e, e, e],
    [0, 1, 166, "BrightnessDown", 0, e, 0, e, e, e],
    [0, 1, 167, "MediaPlay", 0, e, 0, e, e, e],
    [0, 1, 168, "MediaRecord", 0, e, 0, e, e, e],
    [0, 1, 169, "MediaFastForward", 0, e, 0, e, e, e],
    [0, 1, 170, "MediaRewind", 0, e, 0, e, e, e],
    [114, 1, 171, "MediaTrackNext", 119, "MediaTrackNext", 176, "VK_MEDIA_NEXT_TRACK", e, e],
    [115, 1, 172, "MediaTrackPrevious", 120, "MediaTrackPrevious", 177, "VK_MEDIA_PREV_TRACK", e, e],
    [116, 1, 173, "MediaStop", 121, "MediaStop", 178, "VK_MEDIA_STOP", e, e],
    [0, 1, 174, "Eject", 0, e, 0, e, e, e],
    [117, 1, 175, "MediaPlayPause", 122, "MediaPlayPause", 179, "VK_MEDIA_PLAY_PAUSE", e, e],
    [0, 1, 176, "MediaSelect", 123, "LaunchMediaPlayer", 181, "VK_MEDIA_LAUNCH_MEDIA_SELECT", e, e],
    [0, 1, 177, "LaunchMail", 124, "LaunchMail", 180, "VK_MEDIA_LAUNCH_MAIL", e, e],
    [0, 1, 178, "LaunchApp2", 125, "LaunchApp2", 183, "VK_MEDIA_LAUNCH_APP2", e, e],
    [0, 1, 179, "LaunchApp1", 0, e, 0, "VK_MEDIA_LAUNCH_APP1", e, e],
    [0, 1, 180, "SelectTask", 0, e, 0, e, e, e],
    [0, 1, 181, "LaunchScreenSaver", 0, e, 0, e, e, e],
    [0, 1, 182, "BrowserSearch", 115, "BrowserSearch", 170, "VK_BROWSER_SEARCH", e, e],
    [0, 1, 183, "BrowserHome", 116, "BrowserHome", 172, "VK_BROWSER_HOME", e, e],
    [112, 1, 184, "BrowserBack", 117, "BrowserBack", 166, "VK_BROWSER_BACK", e, e],
    [113, 1, 185, "BrowserForward", 118, "BrowserForward", 167, "VK_BROWSER_FORWARD", e, e],
    [0, 1, 186, "BrowserStop", 0, e, 0, "VK_BROWSER_STOP", e, e],
    [0, 1, 187, "BrowserRefresh", 0, e, 0, "VK_BROWSER_REFRESH", e, e],
    [0, 1, 188, "BrowserFavorites", 0, e, 0, "VK_BROWSER_FAVORITES", e, e],
    [0, 1, 189, "ZoomToggle", 0, e, 0, e, e, e],
    [0, 1, 190, "MailReply", 0, e, 0, e, e, e],
    [0, 1, 191, "MailForward", 0, e, 0, e, e, e],
    [0, 1, 192, "MailSend", 0, e, 0, e, e, e],
    [109, 1, 0, e, 109, "KeyInComposition", 229, e, e, e],
    [111, 1, 0, e, 111, "ABNT_C2", 194, "VK_ABNT_C2", e, e],
    [91, 1, 0, e, 91, "OEM_8", 223, "VK_OEM_8", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_KANA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HANGUL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_JUNJA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_FINAL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HANJA", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_KANJI", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_CONVERT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_NONCONVERT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ACCEPT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_MODECHANGE", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_SELECT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PRINT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EXECUTE", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_SNAPSHOT", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_HELP", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_APPS", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PROCESSKEY", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PACKET", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_DBE_SBCSCHAR", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_DBE_DBCSCHAR", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ATTN", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_CRSEL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EXSEL", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_EREOF", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PLAY", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_ZOOM", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_NONAME", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_PA1", e, e],
    [0, 1, 0, e, 0, e, 0, "VK_OEM_CLEAR", e, e]
  ], n = [], r = [];
  for (const i of t) {
    const [s, l, u, o, c, h, d, f, g, _] = i;
    if (r[u] || (r[u] = !0, Ss[o] = u, xs[o.toLowerCase()] = u), !n[c]) {
      if (n[c] = !0, !h)
        throw new Error(`String representation missing for key code ${c} around scan code ${o}`);
      bt.define(c, h), an.define(c, g || h), sn.define(c, _ || g || h);
    }
    d && (Cs[d] = c);
  }
})();
var On;
(function(e) {
  function t(u) {
    return bt.keyCodeToStr(u);
  }
  e.toString = t;
  function n(u) {
    return bt.strToKeyCode(u);
  }
  e.fromString = n;
  function r(u) {
    return an.keyCodeToStr(u);
  }
  e.toUserSettingsUS = r;
  function i(u) {
    return sn.keyCodeToStr(u);
  }
  e.toUserSettingsGeneral = i;
  function s(u) {
    return an.strToKeyCode(u) || sn.strToKeyCode(u);
  }
  e.fromUserSettings = s;
  function l(u) {
    if (u >= 93 && u <= 108)
      return null;
    switch (u) {
      case 16:
        return "Up";
      case 18:
        return "Down";
      case 15:
        return "Left";
      case 17:
        return "Right";
    }
    return bt.keyCodeToStr(u);
  }
  e.toElectronAccelerator = l;
})(On || (On = {}));
function Ls(e, t) {
  const n = (t & 65535) << 16 >>> 0;
  return (e | n) >>> 0;
}
class de extends Z {
  constructor(t, n, r, i) {
    super(t, n, r, i), this.selectionStartLineNumber = t, this.selectionStartColumn = n, this.positionLineNumber = r, this.positionColumn = i;
  }
  toString() {
    return "[" + this.selectionStartLineNumber + "," + this.selectionStartColumn + " -> " + this.positionLineNumber + "," + this.positionColumn + "]";
  }
  equalsSelection(t) {
    return de.selectionsEqual(this, t);
  }
  static selectionsEqual(t, n) {
    return t.selectionStartLineNumber === n.selectionStartLineNumber && t.selectionStartColumn === n.selectionStartColumn && t.positionLineNumber === n.positionLineNumber && t.positionColumn === n.positionColumn;
  }
  getDirection() {
    return this.selectionStartLineNumber === this.startLineNumber && this.selectionStartColumn === this.startColumn ? 0 : 1;
  }
  setEndPosition(t, n) {
    return this.getDirection() === 0 ? new de(this.startLineNumber, this.startColumn, t, n) : new de(t, n, this.startLineNumber, this.startColumn);
  }
  getPosition() {
    return new me(this.positionLineNumber, this.positionColumn);
  }
  getSelectionStart() {
    return new me(this.selectionStartLineNumber, this.selectionStartColumn);
  }
  setStartPosition(t, n) {
    return this.getDirection() === 0 ? new de(t, n, this.endLineNumber, this.endColumn) : new de(this.endLineNumber, this.endColumn, t, n);
  }
  static fromPositions(t, n = t) {
    return new de(t.lineNumber, t.column, n.lineNumber, n.column);
  }
  static fromRange(t, n) {
    return n === 0 ? new de(t.startLineNumber, t.startColumn, t.endLineNumber, t.endColumn) : new de(t.endLineNumber, t.endColumn, t.startLineNumber, t.startColumn);
  }
  static liftSelection(t) {
    return new de(t.selectionStartLineNumber, t.selectionStartColumn, t.positionLineNumber, t.positionColumn);
  }
  static selectionsArrEqual(t, n) {
    if (t && !n || !t && n)
      return !1;
    if (!t && !n)
      return !0;
    if (t.length !== n.length)
      return !1;
    for (let r = 0, i = t.length; r < i; r++)
      if (!this.selectionsEqual(t[r], n[r]))
        return !1;
    return !0;
  }
  static isISelection(t) {
    return t && typeof t.selectionStartLineNumber == "number" && typeof t.selectionStartColumn == "number" && typeof t.positionLineNumber == "number" && typeof t.positionColumn == "number";
  }
  static createWithDirection(t, n, r, i, s) {
    return s === 0 ? new de(t, n, r, i) : new de(r, i, t, n);
  }
}
class a {
  constructor(t, n, r) {
    this.id = t, this.definition = n, this.description = r, a._allCodicons.push(this);
  }
  get classNames() {
    return "codicon codicon-" + this.id;
  }
  get classNamesArray() {
    return ["codicon", "codicon-" + this.id];
  }
  get cssSelector() {
    return ".codicon.codicon-" + this.id;
  }
  static getAll() {
    return a._allCodicons;
  }
}
a._allCodicons = [];
a.add = new a("add", { fontCharacter: "\\ea60" });
a.plus = new a("plus", a.add.definition);
a.gistNew = new a("gist-new", a.add.definition);
a.repoCreate = new a("repo-create", a.add.definition);
a.lightbulb = new a("lightbulb", { fontCharacter: "\\ea61" });
a.lightBulb = new a("light-bulb", { fontCharacter: "\\ea61" });
a.repo = new a("repo", { fontCharacter: "\\ea62" });
a.repoDelete = new a("repo-delete", { fontCharacter: "\\ea62" });
a.gistFork = new a("gist-fork", { fontCharacter: "\\ea63" });
a.repoForked = new a("repo-forked", { fontCharacter: "\\ea63" });
a.gitPullRequest = new a("git-pull-request", { fontCharacter: "\\ea64" });
a.gitPullRequestAbandoned = new a("git-pull-request-abandoned", { fontCharacter: "\\ea64" });
a.recordKeys = new a("record-keys", { fontCharacter: "\\ea65" });
a.keyboard = new a("keyboard", { fontCharacter: "\\ea65" });
a.tag = new a("tag", { fontCharacter: "\\ea66" });
a.tagAdd = new a("tag-add", { fontCharacter: "\\ea66" });
a.tagRemove = new a("tag-remove", { fontCharacter: "\\ea66" });
a.person = new a("person", { fontCharacter: "\\ea67" });
a.personFollow = new a("person-follow", { fontCharacter: "\\ea67" });
a.personOutline = new a("person-outline", { fontCharacter: "\\ea67" });
a.personFilled = new a("person-filled", { fontCharacter: "\\ea67" });
a.gitBranch = new a("git-branch", { fontCharacter: "\\ea68" });
a.gitBranchCreate = new a("git-branch-create", { fontCharacter: "\\ea68" });
a.gitBranchDelete = new a("git-branch-delete", { fontCharacter: "\\ea68" });
a.sourceControl = new a("source-control", { fontCharacter: "\\ea68" });
a.mirror = new a("mirror", { fontCharacter: "\\ea69" });
a.mirrorPublic = new a("mirror-public", { fontCharacter: "\\ea69" });
a.star = new a("star", { fontCharacter: "\\ea6a" });
a.starAdd = new a("star-add", { fontCharacter: "\\ea6a" });
a.starDelete = new a("star-delete", { fontCharacter: "\\ea6a" });
a.starEmpty = new a("star-empty", { fontCharacter: "\\ea6a" });
a.comment = new a("comment", { fontCharacter: "\\ea6b" });
a.commentAdd = new a("comment-add", { fontCharacter: "\\ea6b" });
a.alert = new a("alert", { fontCharacter: "\\ea6c" });
a.warning = new a("warning", { fontCharacter: "\\ea6c" });
a.search = new a("search", { fontCharacter: "\\ea6d" });
a.searchSave = new a("search-save", { fontCharacter: "\\ea6d" });
a.logOut = new a("log-out", { fontCharacter: "\\ea6e" });
a.signOut = new a("sign-out", { fontCharacter: "\\ea6e" });
a.logIn = new a("log-in", { fontCharacter: "\\ea6f" });
a.signIn = new a("sign-in", { fontCharacter: "\\ea6f" });
a.eye = new a("eye", { fontCharacter: "\\ea70" });
a.eyeUnwatch = new a("eye-unwatch", { fontCharacter: "\\ea70" });
a.eyeWatch = new a("eye-watch", { fontCharacter: "\\ea70" });
a.circleFilled = new a("circle-filled", { fontCharacter: "\\ea71" });
a.primitiveDot = new a("primitive-dot", { fontCharacter: "\\ea71" });
a.closeDirty = new a("close-dirty", { fontCharacter: "\\ea71" });
a.debugBreakpoint = new a("debug-breakpoint", { fontCharacter: "\\ea71" });
a.debugBreakpointDisabled = new a("debug-breakpoint-disabled", { fontCharacter: "\\ea71" });
a.debugHint = new a("debug-hint", { fontCharacter: "\\ea71" });
a.primitiveSquare = new a("primitive-square", { fontCharacter: "\\ea72" });
a.edit = new a("edit", { fontCharacter: "\\ea73" });
a.pencil = new a("pencil", { fontCharacter: "\\ea73" });
a.info = new a("info", { fontCharacter: "\\ea74" });
a.issueOpened = new a("issue-opened", { fontCharacter: "\\ea74" });
a.gistPrivate = new a("gist-private", { fontCharacter: "\\ea75" });
a.gitForkPrivate = new a("git-fork-private", { fontCharacter: "\\ea75" });
a.lock = new a("lock", { fontCharacter: "\\ea75" });
a.mirrorPrivate = new a("mirror-private", { fontCharacter: "\\ea75" });
a.close = new a("close", { fontCharacter: "\\ea76" });
a.removeClose = new a("remove-close", { fontCharacter: "\\ea76" });
a.x = new a("x", { fontCharacter: "\\ea76" });
a.repoSync = new a("repo-sync", { fontCharacter: "\\ea77" });
a.sync = new a("sync", { fontCharacter: "\\ea77" });
a.clone = new a("clone", { fontCharacter: "\\ea78" });
a.desktopDownload = new a("desktop-download", { fontCharacter: "\\ea78" });
a.beaker = new a("beaker", { fontCharacter: "\\ea79" });
a.microscope = new a("microscope", { fontCharacter: "\\ea79" });
a.vm = new a("vm", { fontCharacter: "\\ea7a" });
a.deviceDesktop = new a("device-desktop", { fontCharacter: "\\ea7a" });
a.file = new a("file", { fontCharacter: "\\ea7b" });
a.fileText = new a("file-text", { fontCharacter: "\\ea7b" });
a.more = new a("more", { fontCharacter: "\\ea7c" });
a.ellipsis = new a("ellipsis", { fontCharacter: "\\ea7c" });
a.kebabHorizontal = new a("kebab-horizontal", { fontCharacter: "\\ea7c" });
a.mailReply = new a("mail-reply", { fontCharacter: "\\ea7d" });
a.reply = new a("reply", { fontCharacter: "\\ea7d" });
a.organization = new a("organization", { fontCharacter: "\\ea7e" });
a.organizationFilled = new a("organization-filled", { fontCharacter: "\\ea7e" });
a.organizationOutline = new a("organization-outline", { fontCharacter: "\\ea7e" });
a.newFile = new a("new-file", { fontCharacter: "\\ea7f" });
a.fileAdd = new a("file-add", { fontCharacter: "\\ea7f" });
a.newFolder = new a("new-folder", { fontCharacter: "\\ea80" });
a.fileDirectoryCreate = new a("file-directory-create", { fontCharacter: "\\ea80" });
a.trash = new a("trash", { fontCharacter: "\\ea81" });
a.trashcan = new a("trashcan", { fontCharacter: "\\ea81" });
a.history = new a("history", { fontCharacter: "\\ea82" });
a.clock = new a("clock", { fontCharacter: "\\ea82" });
a.folder = new a("folder", { fontCharacter: "\\ea83" });
a.fileDirectory = new a("file-directory", { fontCharacter: "\\ea83" });
a.symbolFolder = new a("symbol-folder", { fontCharacter: "\\ea83" });
a.logoGithub = new a("logo-github", { fontCharacter: "\\ea84" });
a.markGithub = new a("mark-github", { fontCharacter: "\\ea84" });
a.github = new a("github", { fontCharacter: "\\ea84" });
a.terminal = new a("terminal", { fontCharacter: "\\ea85" });
a.console = new a("console", { fontCharacter: "\\ea85" });
a.repl = new a("repl", { fontCharacter: "\\ea85" });
a.zap = new a("zap", { fontCharacter: "\\ea86" });
a.symbolEvent = new a("symbol-event", { fontCharacter: "\\ea86" });
a.error = new a("error", { fontCharacter: "\\ea87" });
a.stop = new a("stop", { fontCharacter: "\\ea87" });
a.variable = new a("variable", { fontCharacter: "\\ea88" });
a.symbolVariable = new a("symbol-variable", { fontCharacter: "\\ea88" });
a.array = new a("array", { fontCharacter: "\\ea8a" });
a.symbolArray = new a("symbol-array", { fontCharacter: "\\ea8a" });
a.symbolModule = new a("symbol-module", { fontCharacter: "\\ea8b" });
a.symbolPackage = new a("symbol-package", { fontCharacter: "\\ea8b" });
a.symbolNamespace = new a("symbol-namespace", { fontCharacter: "\\ea8b" });
a.symbolObject = new a("symbol-object", { fontCharacter: "\\ea8b" });
a.symbolMethod = new a("symbol-method", { fontCharacter: "\\ea8c" });
a.symbolFunction = new a("symbol-function", { fontCharacter: "\\ea8c" });
a.symbolConstructor = new a("symbol-constructor", { fontCharacter: "\\ea8c" });
a.symbolBoolean = new a("symbol-boolean", { fontCharacter: "\\ea8f" });
a.symbolNull = new a("symbol-null", { fontCharacter: "\\ea8f" });
a.symbolNumeric = new a("symbol-numeric", { fontCharacter: "\\ea90" });
a.symbolNumber = new a("symbol-number", { fontCharacter: "\\ea90" });
a.symbolStructure = new a("symbol-structure", { fontCharacter: "\\ea91" });
a.symbolStruct = new a("symbol-struct", { fontCharacter: "\\ea91" });
a.symbolParameter = new a("symbol-parameter", { fontCharacter: "\\ea92" });
a.symbolTypeParameter = new a("symbol-type-parameter", { fontCharacter: "\\ea92" });
a.symbolKey = new a("symbol-key", { fontCharacter: "\\ea93" });
a.symbolText = new a("symbol-text", { fontCharacter: "\\ea93" });
a.symbolReference = new a("symbol-reference", { fontCharacter: "\\ea94" });
a.goToFile = new a("go-to-file", { fontCharacter: "\\ea94" });
a.symbolEnum = new a("symbol-enum", { fontCharacter: "\\ea95" });
a.symbolValue = new a("symbol-value", { fontCharacter: "\\ea95" });
a.symbolRuler = new a("symbol-ruler", { fontCharacter: "\\ea96" });
a.symbolUnit = new a("symbol-unit", { fontCharacter: "\\ea96" });
a.activateBreakpoints = new a("activate-breakpoints", { fontCharacter: "\\ea97" });
a.archive = new a("archive", { fontCharacter: "\\ea98" });
a.arrowBoth = new a("arrow-both", { fontCharacter: "\\ea99" });
a.arrowDown = new a("arrow-down", { fontCharacter: "\\ea9a" });
a.arrowLeft = new a("arrow-left", { fontCharacter: "\\ea9b" });
a.arrowRight = new a("arrow-right", { fontCharacter: "\\ea9c" });
a.arrowSmallDown = new a("arrow-small-down", { fontCharacter: "\\ea9d" });
a.arrowSmallLeft = new a("arrow-small-left", { fontCharacter: "\\ea9e" });
a.arrowSmallRight = new a("arrow-small-right", { fontCharacter: "\\ea9f" });
a.arrowSmallUp = new a("arrow-small-up", { fontCharacter: "\\eaa0" });
a.arrowUp = new a("arrow-up", { fontCharacter: "\\eaa1" });
a.bell = new a("bell", { fontCharacter: "\\eaa2" });
a.bold = new a("bold", { fontCharacter: "\\eaa3" });
a.book = new a("book", { fontCharacter: "\\eaa4" });
a.bookmark = new a("bookmark", { fontCharacter: "\\eaa5" });
a.debugBreakpointConditionalUnverified = new a("debug-breakpoint-conditional-unverified", { fontCharacter: "\\eaa6" });
a.debugBreakpointConditional = new a("debug-breakpoint-conditional", { fontCharacter: "\\eaa7" });
a.debugBreakpointConditionalDisabled = new a("debug-breakpoint-conditional-disabled", { fontCharacter: "\\eaa7" });
a.debugBreakpointDataUnverified = new a("debug-breakpoint-data-unverified", { fontCharacter: "\\eaa8" });
a.debugBreakpointData = new a("debug-breakpoint-data", { fontCharacter: "\\eaa9" });
a.debugBreakpointDataDisabled = new a("debug-breakpoint-data-disabled", { fontCharacter: "\\eaa9" });
a.debugBreakpointLogUnverified = new a("debug-breakpoint-log-unverified", { fontCharacter: "\\eaaa" });
a.debugBreakpointLog = new a("debug-breakpoint-log", { fontCharacter: "\\eaab" });
a.debugBreakpointLogDisabled = new a("debug-breakpoint-log-disabled", { fontCharacter: "\\eaab" });
a.briefcase = new a("briefcase", { fontCharacter: "\\eaac" });
a.broadcast = new a("broadcast", { fontCharacter: "\\eaad" });
a.browser = new a("browser", { fontCharacter: "\\eaae" });
a.bug = new a("bug", { fontCharacter: "\\eaaf" });
a.calendar = new a("calendar", { fontCharacter: "\\eab0" });
a.caseSensitive = new a("case-sensitive", { fontCharacter: "\\eab1" });
a.check = new a("check", { fontCharacter: "\\eab2" });
a.checklist = new a("checklist", { fontCharacter: "\\eab3" });
a.chevronDown = new a("chevron-down", { fontCharacter: "\\eab4" });
a.dropDownButton = new a("drop-down-button", a.chevronDown.definition);
a.chevronLeft = new a("chevron-left", { fontCharacter: "\\eab5" });
a.chevronRight = new a("chevron-right", { fontCharacter: "\\eab6" });
a.chevronUp = new a("chevron-up", { fontCharacter: "\\eab7" });
a.chromeClose = new a("chrome-close", { fontCharacter: "\\eab8" });
a.chromeMaximize = new a("chrome-maximize", { fontCharacter: "\\eab9" });
a.chromeMinimize = new a("chrome-minimize", { fontCharacter: "\\eaba" });
a.chromeRestore = new a("chrome-restore", { fontCharacter: "\\eabb" });
a.circleOutline = new a("circle-outline", { fontCharacter: "\\eabc" });
a.debugBreakpointUnverified = new a("debug-breakpoint-unverified", { fontCharacter: "\\eabc" });
a.circleSlash = new a("circle-slash", { fontCharacter: "\\eabd" });
a.circuitBoard = new a("circuit-board", { fontCharacter: "\\eabe" });
a.clearAll = new a("clear-all", { fontCharacter: "\\eabf" });
a.clippy = new a("clippy", { fontCharacter: "\\eac0" });
a.closeAll = new a("close-all", { fontCharacter: "\\eac1" });
a.cloudDownload = new a("cloud-download", { fontCharacter: "\\eac2" });
a.cloudUpload = new a("cloud-upload", { fontCharacter: "\\eac3" });
a.code = new a("code", { fontCharacter: "\\eac4" });
a.collapseAll = new a("collapse-all", { fontCharacter: "\\eac5" });
a.colorMode = new a("color-mode", { fontCharacter: "\\eac6" });
a.commentDiscussion = new a("comment-discussion", { fontCharacter: "\\eac7" });
a.compareChanges = new a("compare-changes", { fontCharacter: "\\eafd" });
a.creditCard = new a("credit-card", { fontCharacter: "\\eac9" });
a.dash = new a("dash", { fontCharacter: "\\eacc" });
a.dashboard = new a("dashboard", { fontCharacter: "\\eacd" });
a.database = new a("database", { fontCharacter: "\\eace" });
a.debugContinue = new a("debug-continue", { fontCharacter: "\\eacf" });
a.debugDisconnect = new a("debug-disconnect", { fontCharacter: "\\ead0" });
a.debugPause = new a("debug-pause", { fontCharacter: "\\ead1" });
a.debugRestart = new a("debug-restart", { fontCharacter: "\\ead2" });
a.debugStart = new a("debug-start", { fontCharacter: "\\ead3" });
a.debugStepInto = new a("debug-step-into", { fontCharacter: "\\ead4" });
a.debugStepOut = new a("debug-step-out", { fontCharacter: "\\ead5" });
a.debugStepOver = new a("debug-step-over", { fontCharacter: "\\ead6" });
a.debugStop = new a("debug-stop", { fontCharacter: "\\ead7" });
a.debug = new a("debug", { fontCharacter: "\\ead8" });
a.deviceCameraVideo = new a("device-camera-video", { fontCharacter: "\\ead9" });
a.deviceCamera = new a("device-camera", { fontCharacter: "\\eada" });
a.deviceMobile = new a("device-mobile", { fontCharacter: "\\eadb" });
a.diffAdded = new a("diff-added", { fontCharacter: "\\eadc" });
a.diffIgnored = new a("diff-ignored", { fontCharacter: "\\eadd" });
a.diffModified = new a("diff-modified", { fontCharacter: "\\eade" });
a.diffRemoved = new a("diff-removed", { fontCharacter: "\\eadf" });
a.diffRenamed = new a("diff-renamed", { fontCharacter: "\\eae0" });
a.diff = new a("diff", { fontCharacter: "\\eae1" });
a.discard = new a("discard", { fontCharacter: "\\eae2" });
a.editorLayout = new a("editor-layout", { fontCharacter: "\\eae3" });
a.emptyWindow = new a("empty-window", { fontCharacter: "\\eae4" });
a.exclude = new a("exclude", { fontCharacter: "\\eae5" });
a.extensions = new a("extensions", { fontCharacter: "\\eae6" });
a.eyeClosed = new a("eye-closed", { fontCharacter: "\\eae7" });
a.fileBinary = new a("file-binary", { fontCharacter: "\\eae8" });
a.fileCode = new a("file-code", { fontCharacter: "\\eae9" });
a.fileMedia = new a("file-media", { fontCharacter: "\\eaea" });
a.filePdf = new a("file-pdf", { fontCharacter: "\\eaeb" });
a.fileSubmodule = new a("file-submodule", { fontCharacter: "\\eaec" });
a.fileSymlinkDirectory = new a("file-symlink-directory", { fontCharacter: "\\eaed" });
a.fileSymlinkFile = new a("file-symlink-file", { fontCharacter: "\\eaee" });
a.fileZip = new a("file-zip", { fontCharacter: "\\eaef" });
a.files = new a("files", { fontCharacter: "\\eaf0" });
a.filter = new a("filter", { fontCharacter: "\\eaf1" });
a.flame = new a("flame", { fontCharacter: "\\eaf2" });
a.foldDown = new a("fold-down", { fontCharacter: "\\eaf3" });
a.foldUp = new a("fold-up", { fontCharacter: "\\eaf4" });
a.fold = new a("fold", { fontCharacter: "\\eaf5" });
a.folderActive = new a("folder-active", { fontCharacter: "\\eaf6" });
a.folderOpened = new a("folder-opened", { fontCharacter: "\\eaf7" });
a.gear = new a("gear", { fontCharacter: "\\eaf8" });
a.gift = new a("gift", { fontCharacter: "\\eaf9" });
a.gistSecret = new a("gist-secret", { fontCharacter: "\\eafa" });
a.gist = new a("gist", { fontCharacter: "\\eafb" });
a.gitCommit = new a("git-commit", { fontCharacter: "\\eafc" });
a.gitCompare = new a("git-compare", { fontCharacter: "\\eafd" });
a.gitMerge = new a("git-merge", { fontCharacter: "\\eafe" });
a.githubAction = new a("github-action", { fontCharacter: "\\eaff" });
a.githubAlt = new a("github-alt", { fontCharacter: "\\eb00" });
a.globe = new a("globe", { fontCharacter: "\\eb01" });
a.grabber = new a("grabber", { fontCharacter: "\\eb02" });
a.graph = new a("graph", { fontCharacter: "\\eb03" });
a.gripper = new a("gripper", { fontCharacter: "\\eb04" });
a.heart = new a("heart", { fontCharacter: "\\eb05" });
a.home = new a("home", { fontCharacter: "\\eb06" });
a.horizontalRule = new a("horizontal-rule", { fontCharacter: "\\eb07" });
a.hubot = new a("hubot", { fontCharacter: "\\eb08" });
a.inbox = new a("inbox", { fontCharacter: "\\eb09" });
a.issueClosed = new a("issue-closed", { fontCharacter: "\\eba4" });
a.issueReopened = new a("issue-reopened", { fontCharacter: "\\eb0b" });
a.issues = new a("issues", { fontCharacter: "\\eb0c" });
a.italic = new a("italic", { fontCharacter: "\\eb0d" });
a.jersey = new a("jersey", { fontCharacter: "\\eb0e" });
a.json = new a("json", { fontCharacter: "\\eb0f" });
a.kebabVertical = new a("kebab-vertical", { fontCharacter: "\\eb10" });
a.key = new a("key", { fontCharacter: "\\eb11" });
a.law = new a("law", { fontCharacter: "\\eb12" });
a.lightbulbAutofix = new a("lightbulb-autofix", { fontCharacter: "\\eb13" });
a.linkExternal = new a("link-external", { fontCharacter: "\\eb14" });
a.link = new a("link", { fontCharacter: "\\eb15" });
a.listOrdered = new a("list-ordered", { fontCharacter: "\\eb16" });
a.listUnordered = new a("list-unordered", { fontCharacter: "\\eb17" });
a.liveShare = new a("live-share", { fontCharacter: "\\eb18" });
a.loading = new a("loading", { fontCharacter: "\\eb19" });
a.location = new a("location", { fontCharacter: "\\eb1a" });
a.mailRead = new a("mail-read", { fontCharacter: "\\eb1b" });
a.mail = new a("mail", { fontCharacter: "\\eb1c" });
a.markdown = new a("markdown", { fontCharacter: "\\eb1d" });
a.megaphone = new a("megaphone", { fontCharacter: "\\eb1e" });
a.mention = new a("mention", { fontCharacter: "\\eb1f" });
a.milestone = new a("milestone", { fontCharacter: "\\eb20" });
a.mortarBoard = new a("mortar-board", { fontCharacter: "\\eb21" });
a.move = new a("move", { fontCharacter: "\\eb22" });
a.multipleWindows = new a("multiple-windows", { fontCharacter: "\\eb23" });
a.mute = new a("mute", { fontCharacter: "\\eb24" });
a.noNewline = new a("no-newline", { fontCharacter: "\\eb25" });
a.note = new a("note", { fontCharacter: "\\eb26" });
a.octoface = new a("octoface", { fontCharacter: "\\eb27" });
a.openPreview = new a("open-preview", { fontCharacter: "\\eb28" });
a.package_ = new a("package", { fontCharacter: "\\eb29" });
a.paintcan = new a("paintcan", { fontCharacter: "\\eb2a" });
a.pin = new a("pin", { fontCharacter: "\\eb2b" });
a.play = new a("play", { fontCharacter: "\\eb2c" });
a.run = new a("run", { fontCharacter: "\\eb2c" });
a.plug = new a("plug", { fontCharacter: "\\eb2d" });
a.preserveCase = new a("preserve-case", { fontCharacter: "\\eb2e" });
a.preview = new a("preview", { fontCharacter: "\\eb2f" });
a.project = new a("project", { fontCharacter: "\\eb30" });
a.pulse = new a("pulse", { fontCharacter: "\\eb31" });
a.question = new a("question", { fontCharacter: "\\eb32" });
a.quote = new a("quote", { fontCharacter: "\\eb33" });
a.radioTower = new a("radio-tower", { fontCharacter: "\\eb34" });
a.reactions = new a("reactions", { fontCharacter: "\\eb35" });
a.references = new a("references", { fontCharacter: "\\eb36" });
a.refresh = new a("refresh", { fontCharacter: "\\eb37" });
a.regex = new a("regex", { fontCharacter: "\\eb38" });
a.remoteExplorer = new a("remote-explorer", { fontCharacter: "\\eb39" });
a.remote = new a("remote", { fontCharacter: "\\eb3a" });
a.remove = new a("remove", { fontCharacter: "\\eb3b" });
a.replaceAll = new a("replace-all", { fontCharacter: "\\eb3c" });
a.replace = new a("replace", { fontCharacter: "\\eb3d" });
a.repoClone = new a("repo-clone", { fontCharacter: "\\eb3e" });
a.repoForcePush = new a("repo-force-push", { fontCharacter: "\\eb3f" });
a.repoPull = new a("repo-pull", { fontCharacter: "\\eb40" });
a.repoPush = new a("repo-push", { fontCharacter: "\\eb41" });
a.report = new a("report", { fontCharacter: "\\eb42" });
a.requestChanges = new a("request-changes", { fontCharacter: "\\eb43" });
a.rocket = new a("rocket", { fontCharacter: "\\eb44" });
a.rootFolderOpened = new a("root-folder-opened", { fontCharacter: "\\eb45" });
a.rootFolder = new a("root-folder", { fontCharacter: "\\eb46" });
a.rss = new a("rss", { fontCharacter: "\\eb47" });
a.ruby = new a("ruby", { fontCharacter: "\\eb48" });
a.saveAll = new a("save-all", { fontCharacter: "\\eb49" });
a.saveAs = new a("save-as", { fontCharacter: "\\eb4a" });
a.save = new a("save", { fontCharacter: "\\eb4b" });
a.screenFull = new a("screen-full", { fontCharacter: "\\eb4c" });
a.screenNormal = new a("screen-normal", { fontCharacter: "\\eb4d" });
a.searchStop = new a("search-stop", { fontCharacter: "\\eb4e" });
a.server = new a("server", { fontCharacter: "\\eb50" });
a.settingsGear = new a("settings-gear", { fontCharacter: "\\eb51" });
a.settings = new a("settings", { fontCharacter: "\\eb52" });
a.shield = new a("shield", { fontCharacter: "\\eb53" });
a.smiley = new a("smiley", { fontCharacter: "\\eb54" });
a.sortPrecedence = new a("sort-precedence", { fontCharacter: "\\eb55" });
a.splitHorizontal = new a("split-horizontal", { fontCharacter: "\\eb56" });
a.splitVertical = new a("split-vertical", { fontCharacter: "\\eb57" });
a.squirrel = new a("squirrel", { fontCharacter: "\\eb58" });
a.starFull = new a("star-full", { fontCharacter: "\\eb59" });
a.starHalf = new a("star-half", { fontCharacter: "\\eb5a" });
a.symbolClass = new a("symbol-class", { fontCharacter: "\\eb5b" });
a.symbolColor = new a("symbol-color", { fontCharacter: "\\eb5c" });
a.symbolCustomColor = new a("symbol-customcolor", { fontCharacter: "\\eb5c" });
a.symbolConstant = new a("symbol-constant", { fontCharacter: "\\eb5d" });
a.symbolEnumMember = new a("symbol-enum-member", { fontCharacter: "\\eb5e" });
a.symbolField = new a("symbol-field", { fontCharacter: "\\eb5f" });
a.symbolFile = new a("symbol-file", { fontCharacter: "\\eb60" });
a.symbolInterface = new a("symbol-interface", { fontCharacter: "\\eb61" });
a.symbolKeyword = new a("symbol-keyword", { fontCharacter: "\\eb62" });
a.symbolMisc = new a("symbol-misc", { fontCharacter: "\\eb63" });
a.symbolOperator = new a("symbol-operator", { fontCharacter: "\\eb64" });
a.symbolProperty = new a("symbol-property", { fontCharacter: "\\eb65" });
a.wrench = new a("wrench", { fontCharacter: "\\eb65" });
a.wrenchSubaction = new a("wrench-subaction", { fontCharacter: "\\eb65" });
a.symbolSnippet = new a("symbol-snippet", { fontCharacter: "\\eb66" });
a.tasklist = new a("tasklist", { fontCharacter: "\\eb67" });
a.telescope = new a("telescope", { fontCharacter: "\\eb68" });
a.textSize = new a("text-size", { fontCharacter: "\\eb69" });
a.threeBars = new a("three-bars", { fontCharacter: "\\eb6a" });
a.thumbsdown = new a("thumbsdown", { fontCharacter: "\\eb6b" });
a.thumbsup = new a("thumbsup", { fontCharacter: "\\eb6c" });
a.tools = new a("tools", { fontCharacter: "\\eb6d" });
a.triangleDown = new a("triangle-down", { fontCharacter: "\\eb6e" });
a.triangleLeft = new a("triangle-left", { fontCharacter: "\\eb6f" });
a.triangleRight = new a("triangle-right", { fontCharacter: "\\eb70" });
a.triangleUp = new a("triangle-up", { fontCharacter: "\\eb71" });
a.twitter = new a("twitter", { fontCharacter: "\\eb72" });
a.unfold = new a("unfold", { fontCharacter: "\\eb73" });
a.unlock = new a("unlock", { fontCharacter: "\\eb74" });
a.unmute = new a("unmute", { fontCharacter: "\\eb75" });
a.unverified = new a("unverified", { fontCharacter: "\\eb76" });
a.verified = new a("verified", { fontCharacter: "\\eb77" });
a.versions = new a("versions", { fontCharacter: "\\eb78" });
a.vmActive = new a("vm-active", { fontCharacter: "\\eb79" });
a.vmOutline = new a("vm-outline", { fontCharacter: "\\eb7a" });
a.vmRunning = new a("vm-running", { fontCharacter: "\\eb7b" });
a.watch = new a("watch", { fontCharacter: "\\eb7c" });
a.whitespace = new a("whitespace", { fontCharacter: "\\eb7d" });
a.wholeWord = new a("whole-word", { fontCharacter: "\\eb7e" });
a.window = new a("window", { fontCharacter: "\\eb7f" });
a.wordWrap = new a("word-wrap", { fontCharacter: "\\eb80" });
a.zoomIn = new a("zoom-in", { fontCharacter: "\\eb81" });
a.zoomOut = new a("zoom-out", { fontCharacter: "\\eb82" });
a.listFilter = new a("list-filter", { fontCharacter: "\\eb83" });
a.listFlat = new a("list-flat", { fontCharacter: "\\eb84" });
a.listSelection = new a("list-selection", { fontCharacter: "\\eb85" });
a.selection = new a("selection", { fontCharacter: "\\eb85" });
a.listTree = new a("list-tree", { fontCharacter: "\\eb86" });
a.debugBreakpointFunctionUnverified = new a("debug-breakpoint-function-unverified", { fontCharacter: "\\eb87" });
a.debugBreakpointFunction = new a("debug-breakpoint-function", { fontCharacter: "\\eb88" });
a.debugBreakpointFunctionDisabled = new a("debug-breakpoint-function-disabled", { fontCharacter: "\\eb88" });
a.debugStackframeActive = new a("debug-stackframe-active", { fontCharacter: "\\eb89" });
a.circleSmallFilled = new a("circle-small-filled", { fontCharacter: "\\eb8a" });
a.debugStackframeDot = new a("debug-stackframe-dot", a.circleSmallFilled.definition);
a.debugStackframe = new a("debug-stackframe", { fontCharacter: "\\eb8b" });
a.debugStackframeFocused = new a("debug-stackframe-focused", { fontCharacter: "\\eb8b" });
a.debugBreakpointUnsupported = new a("debug-breakpoint-unsupported", { fontCharacter: "\\eb8c" });
a.symbolString = new a("symbol-string", { fontCharacter: "\\eb8d" });
a.debugReverseContinue = new a("debug-reverse-continue", { fontCharacter: "\\eb8e" });
a.debugStepBack = new a("debug-step-back", { fontCharacter: "\\eb8f" });
a.debugRestartFrame = new a("debug-restart-frame", { fontCharacter: "\\eb90" });
a.callIncoming = new a("call-incoming", { fontCharacter: "\\eb92" });
a.callOutgoing = new a("call-outgoing", { fontCharacter: "\\eb93" });
a.menu = new a("menu", { fontCharacter: "\\eb94" });
a.expandAll = new a("expand-all", { fontCharacter: "\\eb95" });
a.feedback = new a("feedback", { fontCharacter: "\\eb96" });
a.groupByRefType = new a("group-by-ref-type", { fontCharacter: "\\eb97" });
a.ungroupByRefType = new a("ungroup-by-ref-type", { fontCharacter: "\\eb98" });
a.account = new a("account", { fontCharacter: "\\eb99" });
a.bellDot = new a("bell-dot", { fontCharacter: "\\eb9a" });
a.debugConsole = new a("debug-console", { fontCharacter: "\\eb9b" });
a.library = new a("library", { fontCharacter: "\\eb9c" });
a.output = new a("output", { fontCharacter: "\\eb9d" });
a.runAll = new a("run-all", { fontCharacter: "\\eb9e" });
a.syncIgnored = new a("sync-ignored", { fontCharacter: "\\eb9f" });
a.pinned = new a("pinned", { fontCharacter: "\\eba0" });
a.githubInverted = new a("github-inverted", { fontCharacter: "\\eba1" });
a.debugAlt = new a("debug-alt", { fontCharacter: "\\eb91" });
a.serverProcess = new a("server-process", { fontCharacter: "\\eba2" });
a.serverEnvironment = new a("server-environment", { fontCharacter: "\\eba3" });
a.pass = new a("pass", { fontCharacter: "\\eba4" });
a.stopCircle = new a("stop-circle", { fontCharacter: "\\eba5" });
a.playCircle = new a("play-circle", { fontCharacter: "\\eba6" });
a.record = new a("record", { fontCharacter: "\\eba7" });
a.debugAltSmall = new a("debug-alt-small", { fontCharacter: "\\eba8" });
a.vmConnect = new a("vm-connect", { fontCharacter: "\\eba9" });
a.cloud = new a("cloud", { fontCharacter: "\\ebaa" });
a.merge = new a("merge", { fontCharacter: "\\ebab" });
a.exportIcon = new a("export", { fontCharacter: "\\ebac" });
a.graphLeft = new a("graph-left", { fontCharacter: "\\ebad" });
a.magnet = new a("magnet", { fontCharacter: "\\ebae" });
a.notebook = new a("notebook", { fontCharacter: "\\ebaf" });
a.redo = new a("redo", { fontCharacter: "\\ebb0" });
a.checkAll = new a("check-all", { fontCharacter: "\\ebb1" });
a.pinnedDirty = new a("pinned-dirty", { fontCharacter: "\\ebb2" });
a.passFilled = new a("pass-filled", { fontCharacter: "\\ebb3" });
a.circleLargeFilled = new a("circle-large-filled", { fontCharacter: "\\ebb4" });
a.circleLargeOutline = new a("circle-large-outline", { fontCharacter: "\\ebb5" });
a.combine = new a("combine", { fontCharacter: "\\ebb6" });
a.gather = new a("gather", { fontCharacter: "\\ebb6" });
a.table = new a("table", { fontCharacter: "\\ebb7" });
a.variableGroup = new a("variable-group", { fontCharacter: "\\ebb8" });
a.typeHierarchy = new a("type-hierarchy", { fontCharacter: "\\ebb9" });
a.typeHierarchySub = new a("type-hierarchy-sub", { fontCharacter: "\\ebba" });
a.typeHierarchySuper = new a("type-hierarchy-super", { fontCharacter: "\\ebbb" });
a.gitPullRequestCreate = new a("git-pull-request-create", { fontCharacter: "\\ebbc" });
a.runAbove = new a("run-above", { fontCharacter: "\\ebbd" });
a.runBelow = new a("run-below", { fontCharacter: "\\ebbe" });
a.notebookTemplate = new a("notebook-template", { fontCharacter: "\\ebbf" });
a.debugRerun = new a("debug-rerun", { fontCharacter: "\\ebc0" });
a.workspaceTrusted = new a("workspace-trusted", { fontCharacter: "\\ebc1" });
a.workspaceUntrusted = new a("workspace-untrusted", { fontCharacter: "\\ebc2" });
a.workspaceUnspecified = new a("workspace-unspecified", { fontCharacter: "\\ebc3" });
a.terminalCmd = new a("terminal-cmd", { fontCharacter: "\\ebc4" });
a.terminalDebian = new a("terminal-debian", { fontCharacter: "\\ebc5" });
a.terminalLinux = new a("terminal-linux", { fontCharacter: "\\ebc6" });
a.terminalPowershell = new a("terminal-powershell", { fontCharacter: "\\ebc7" });
a.terminalTmux = new a("terminal-tmux", { fontCharacter: "\\ebc8" });
a.terminalUbuntu = new a("terminal-ubuntu", { fontCharacter: "\\ebc9" });
a.terminalBash = new a("terminal-bash", { fontCharacter: "\\ebca" });
a.arrowSwap = new a("arrow-swap", { fontCharacter: "\\ebcb" });
a.copy = new a("copy", { fontCharacter: "\\ebcc" });
a.personAdd = new a("person-add", { fontCharacter: "\\ebcd" });
a.filterFilled = new a("filter-filled", { fontCharacter: "\\ebce" });
a.wand = new a("wand", { fontCharacter: "\\ebcf" });
a.debugLineByLine = new a("debug-line-by-line", { fontCharacter: "\\ebd0" });
a.inspect = new a("inspect", { fontCharacter: "\\ebd1" });
a.layers = new a("layers", { fontCharacter: "\\ebd2" });
a.layersDot = new a("layers-dot", { fontCharacter: "\\ebd3" });
a.layersActive = new a("layers-active", { fontCharacter: "\\ebd4" });
a.compass = new a("compass", { fontCharacter: "\\ebd5" });
a.compassDot = new a("compass-dot", { fontCharacter: "\\ebd6" });
a.compassActive = new a("compass-active", { fontCharacter: "\\ebd7" });
a.azure = new a("azure", { fontCharacter: "\\ebd8" });
a.issueDraft = new a("issue-draft", { fontCharacter: "\\ebd9" });
a.gitPullRequestClosed = new a("git-pull-request-closed", { fontCharacter: "\\ebda" });
a.gitPullRequestDraft = new a("git-pull-request-draft", { fontCharacter: "\\ebdb" });
a.debugAll = new a("debug-all", { fontCharacter: "\\ebdc" });
a.debugCoverage = new a("debug-coverage", { fontCharacter: "\\ebdd" });
a.runErrors = new a("run-errors", { fontCharacter: "\\ebde" });
a.folderLibrary = new a("folder-library", { fontCharacter: "\\ebdf" });
a.debugContinueSmall = new a("debug-continue-small", { fontCharacter: "\\ebe0" });
a.beakerStop = new a("beaker-stop", { fontCharacter: "\\ebe1" });
a.graphLine = new a("graph-line", { fontCharacter: "\\ebe2" });
a.graphScatter = new a("graph-scatter", { fontCharacter: "\\ebe3" });
a.pieChart = new a("pie-chart", { fontCharacter: "\\ebe4" });
a.bracket = new a("bracket", a.json.definition);
a.bracketDot = new a("bracket-dot", { fontCharacter: "\\ebe5" });
a.bracketError = new a("bracket-error", { fontCharacter: "\\ebe6" });
a.lockSmall = new a("lock-small", { fontCharacter: "\\ebe7" });
a.azureDevops = new a("azure-devops", { fontCharacter: "\\ebe8" });
a.verifiedFilled = new a("verified-filled", { fontCharacter: "\\ebe9" });
a.newLine = new a("newline", { fontCharacter: "\\ebea" });
a.layout = new a("layout", { fontCharacter: "\\ebeb" });
a.layoutActivitybarLeft = new a("layout-activitybar-left", { fontCharacter: "\\ebec" });
a.layoutActivitybarRight = new a("layout-activitybar-right", { fontCharacter: "\\ebed" });
a.layoutPanelLeft = new a("layout-panel-left", { fontCharacter: "\\ebee" });
a.layoutPanelCenter = new a("layout-panel-center", { fontCharacter: "\\ebef" });
a.layoutPanelJustify = new a("layout-panel-justify", { fontCharacter: "\\ebf0" });
a.layoutPanelRight = new a("layout-panel-right", { fontCharacter: "\\ebf1" });
a.layoutPanel = new a("layout-panel", { fontCharacter: "\\ebf2" });
a.layoutSidebarLeft = new a("layout-sidebar-left", { fontCharacter: "\\ebf3" });
a.layoutSidebarRight = new a("layout-sidebar-right", { fontCharacter: "\\ebf4" });
a.layoutStatusbar = new a("layout-statusbar", { fontCharacter: "\\ebf5" });
a.layoutMenubar = new a("layout-menubar", { fontCharacter: "\\ebf6" });
a.layoutCentered = new a("layout-centered", { fontCharacter: "\\ebf7" });
a.layoutSidebarRightOff = new a("layout-sidebar-right-off", { fontCharacter: "\\ec00" });
a.layoutPanelOff = new a("layout-panel-off", { fontCharacter: "\\ec01" });
a.layoutSidebarLeftOff = new a("layout-sidebar-left-off", { fontCharacter: "\\ec02" });
a.target = new a("target", { fontCharacter: "\\ebf8" });
a.indent = new a("indent", { fontCharacter: "\\ebf9" });
a.recordSmall = new a("record-small", { fontCharacter: "\\ebfa" });
a.errorSmall = new a("error-small", { fontCharacter: "\\ebfb" });
a.arrowCircleDown = new a("arrow-circle-down", { fontCharacter: "\\ebfc" });
a.arrowCircleLeft = new a("arrow-circle-left", { fontCharacter: "\\ebfd" });
a.arrowCircleRight = new a("arrow-circle-right", { fontCharacter: "\\ebfe" });
a.arrowCircleUp = new a("arrow-circle-up", { fontCharacter: "\\ebff" });
a.heartFilled = new a("heart-filled", { fontCharacter: "\\ec04" });
a.map = new a("map", { fontCharacter: "\\ec05" });
a.mapFilled = new a("map-filled", { fontCharacter: "\\ec06" });
a.circleSmall = new a("circle-small", { fontCharacter: "\\ec07" });
a.bellSlash = new a("bell-slash", { fontCharacter: "\\ec08" });
a.bellSlashDot = new a("bell-slash-dot", { fontCharacter: "\\ec09" });
a.commentUnresolved = new a("comment-unresolved", { fontCharacter: "\\ec0a" });
a.gitPullRequestGoToChanges = new a("git-pull-request-go-to-changes", { fontCharacter: "\\ec0b" });
a.gitPullRequestNewChanges = new a("git-pull-request-new-changes", { fontCharacter: "\\ec0c" });
a.dialogError = new a("dialog-error", a.error.definition);
a.dialogWarning = new a("dialog-warning", a.warning.definition);
a.dialogInfo = new a("dialog-info", a.info.definition);
a.dialogClose = new a("dialog-close", a.close.definition);
a.treeItemExpanded = new a("tree-item-expanded", a.chevronDown.definition);
a.treeFilterOnTypeOn = new a("tree-filter-on-type-on", a.listFilter.definition);
a.treeFilterOnTypeOff = new a("tree-filter-on-type-off", a.listSelection.definition);
a.treeFilterClear = new a("tree-filter-clear", a.close.definition);
a.treeItemLoading = new a("tree-item-loading", a.loading.definition);
a.menuSelection = new a("menu-selection", a.check.definition);
a.menuSubmenu = new a("menu-submenu", a.chevronRight.definition);
a.menuBarMore = new a("menubar-more", a.more.definition);
a.scrollbarButtonLeft = new a("scrollbar-button-left", a.triangleLeft.definition);
a.scrollbarButtonRight = new a("scrollbar-button-right", a.triangleRight.definition);
a.scrollbarButtonUp = new a("scrollbar-button-up", a.triangleUp.definition);
a.scrollbarButtonDown = new a("scrollbar-button-down", a.triangleDown.definition);
a.toolBarMore = new a("toolbar-more", a.more.definition);
a.quickInputBack = new a("quick-input-back", a.arrowLeft.definition);
var Vn;
(function(e) {
  e.iconNameSegment = "[A-Za-z0-9]+", e.iconNameExpression = "[A-Za-z0-9-]+", e.iconModifierExpression = "~[A-Za-z]+", e.iconNameCharacter = "[A-Za-z0-9~-]";
  const t = new RegExp(`^(${e.iconNameExpression})(${e.iconModifierExpression})?$`);
  function n(s) {
    if (s instanceof a)
      return ["codicon", "codicon-" + s.id];
    const l = t.exec(s.id);
    if (!l)
      return n(a.error);
    const [, u, o] = l, c = ["codicon", "codicon-" + u];
    return o && c.push("codicon-modifier-" + o.substr(1)), c;
  }
  e.asClassNameArray = n;
  function r(s) {
    return n(s).join(" ");
  }
  e.asClassName = r;
  function i(s) {
    return "." + n(s).join(".");
  }
  e.asCSSSelector = i;
})(Vn || (Vn = {}));
var on = globalThis && globalThis.__awaiter || function(e, t, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(l) {
      l(s);
    });
  }
  return new (n || (n = Promise))(function(s, l) {
    function u(h) {
      try {
        c(r.next(h));
      } catch (d) {
        l(d);
      }
    }
    function o(h) {
      try {
        c(r.throw(h));
      } catch (d) {
        l(d);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(u, o);
    }
    c((r = r.apply(e, t || [])).next());
  });
};
class Es {
  constructor() {
    this._map = /* @__PURE__ */ new Map(), this._factories = /* @__PURE__ */ new Map(), this._onDidChange = new ke(), this.onDidChange = this._onDidChange.event, this._colorMap = null;
  }
  fire(t) {
    this._onDidChange.fire({
      changedLanguages: t,
      changedColorMap: !1
    });
  }
  register(t, n) {
    return this._map.set(t, n), this.fire([t]), _t(() => {
      this._map.get(t) === n && (this._map.delete(t), this.fire([t]));
    });
  }
  registerFactory(t, n) {
    var r;
    (r = this._factories.get(t)) === null || r === void 0 || r.dispose();
    const i = new Ms(this, t, n);
    return this._factories.set(t, i), _t(() => {
      const s = this._factories.get(t);
      !s || s !== i || (this._factories.delete(t), s.dispose());
    });
  }
  getOrCreate(t) {
    return on(this, void 0, void 0, function* () {
      const n = this.get(t);
      if (n)
        return n;
      const r = this._factories.get(t);
      return !r || r.isResolved ? null : (yield r.resolve(), this.get(t));
    });
  }
  get(t) {
    return this._map.get(t) || null;
  }
  isResolved(t) {
    if (this.get(t))
      return !0;
    const r = this._factories.get(t);
    return !!(!r || r.isResolved);
  }
  setColorMap(t) {
    this._colorMap = t, this._onDidChange.fire({
      changedLanguages: Array.from(this._map.keys()),
      changedColorMap: !0
    });
  }
  getColorMap() {
    return this._colorMap;
  }
  getDefaultBackground() {
    return this._colorMap && this._colorMap.length > 2 ? this._colorMap[2] : null;
  }
}
class Ms extends Tn {
  constructor(t, n, r) {
    super(), this._registry = t, this._languageId = n, this._factory = r, this._isDisposed = !1, this._resolvePromise = null, this._isResolved = !1;
  }
  get isResolved() {
    return this._isResolved;
  }
  dispose() {
    this._isDisposed = !0, super.dispose();
  }
  resolve() {
    return on(this, void 0, void 0, function* () {
      return this._resolvePromise || (this._resolvePromise = this._create()), this._resolvePromise;
    });
  }
  _create() {
    return on(this, void 0, void 0, function* () {
      const t = yield Promise.resolve(this._factory.createTokenizationSupport());
      this._isResolved = !0, t && !this._isDisposed && this._register(this._registry.register(this._languageId, t));
    });
  }
}
class Ds {
  constructor(t, n, r) {
    this._tokenBrand = void 0, this.offset = t, this.type = n, this.language = r;
  }
  toString() {
    return "(" + this.offset + ", " + this.type + ")";
  }
}
var jn;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, a.symbolMethod), t.set(1, a.symbolFunction), t.set(2, a.symbolConstructor), t.set(3, a.symbolField), t.set(4, a.symbolVariable), t.set(5, a.symbolClass), t.set(6, a.symbolStruct), t.set(7, a.symbolInterface), t.set(8, a.symbolModule), t.set(9, a.symbolProperty), t.set(10, a.symbolEvent), t.set(11, a.symbolOperator), t.set(12, a.symbolUnit), t.set(13, a.symbolValue), t.set(15, a.symbolEnum), t.set(14, a.symbolConstant), t.set(15, a.symbolEnum), t.set(16, a.symbolEnumMember), t.set(17, a.symbolKeyword), t.set(27, a.symbolSnippet), t.set(18, a.symbolText), t.set(19, a.symbolColor), t.set(20, a.symbolFile), t.set(21, a.symbolReference), t.set(22, a.symbolCustomColor), t.set(23, a.symbolFolder), t.set(24, a.symbolTypeParameter), t.set(25, a.account), t.set(26, a.issues);
  function n(s) {
    let l = t.get(s);
    return l || (console.info("No codicon found for CompletionItemKind " + s), l = a.symbolProperty), l;
  }
  e.toIcon = n;
  const r = /* @__PURE__ */ new Map();
  r.set("method", 0), r.set("function", 1), r.set("constructor", 2), r.set("field", 3), r.set("variable", 4), r.set("class", 5), r.set("struct", 6), r.set("interface", 7), r.set("module", 8), r.set("property", 9), r.set("event", 10), r.set("operator", 11), r.set("unit", 12), r.set("value", 13), r.set("constant", 14), r.set("enum", 15), r.set("enum-member", 16), r.set("enumMember", 16), r.set("keyword", 17), r.set("snippet", 27), r.set("text", 18), r.set("color", 19), r.set("file", 20), r.set("reference", 21), r.set("customcolor", 22), r.set("folder", 23), r.set("type-parameter", 24), r.set("typeParameter", 24), r.set("account", 25), r.set("issue", 26);
  function i(s, l) {
    let u = r.get(s);
    return typeof u > "u" && !l && (u = 9), u;
  }
  e.fromString = i;
})(jn || (jn = {}));
var Gn;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(Gn || (Gn = {}));
var $n;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})($n || ($n = {}));
var Xn;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(Xn || (Xn = {}));
var Jn;
(function(e) {
  const t = /* @__PURE__ */ new Map();
  t.set(0, a.symbolFile), t.set(1, a.symbolModule), t.set(2, a.symbolNamespace), t.set(3, a.symbolPackage), t.set(4, a.symbolClass), t.set(5, a.symbolMethod), t.set(6, a.symbolProperty), t.set(7, a.symbolField), t.set(8, a.symbolConstructor), t.set(9, a.symbolEnum), t.set(10, a.symbolInterface), t.set(11, a.symbolFunction), t.set(12, a.symbolVariable), t.set(13, a.symbolConstant), t.set(14, a.symbolString), t.set(15, a.symbolNumber), t.set(16, a.symbolBoolean), t.set(17, a.symbolArray), t.set(18, a.symbolObject), t.set(19, a.symbolKey), t.set(20, a.symbolNull), t.set(21, a.symbolEnumMember), t.set(22, a.symbolStruct), t.set(23, a.symbolEvent), t.set(24, a.symbolOperator), t.set(25, a.symbolTypeParameter);
  function n(r) {
    let i = t.get(r);
    return i || (console.info("No codicon found for SymbolKind " + r), i = a.symbolProperty), i;
  }
  e.toIcon = n;
})(Jn || (Jn = {}));
var Qn;
(function(e) {
  function t(n) {
    return !n || typeof n != "object" ? !1 : typeof n.id == "string" && typeof n.title == "string";
  }
  e.is = t;
})(Qn || (Qn = {}));
var Yn;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(Yn || (Yn = {}));
new Es();
var Zn;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.Disabled = 1] = "Disabled", e[e.Enabled = 2] = "Enabled";
})(Zn || (Zn = {}));
var Kn;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.Auto = 2] = "Auto";
})(Kn || (Kn = {}));
var er;
(function(e) {
  e[e.KeepWhitespace = 1] = "KeepWhitespace", e[e.InsertAsSnippet = 4] = "InsertAsSnippet";
})(er || (er = {}));
var tr;
(function(e) {
  e[e.Method = 0] = "Method", e[e.Function = 1] = "Function", e[e.Constructor = 2] = "Constructor", e[e.Field = 3] = "Field", e[e.Variable = 4] = "Variable", e[e.Class = 5] = "Class", e[e.Struct = 6] = "Struct", e[e.Interface = 7] = "Interface", e[e.Module = 8] = "Module", e[e.Property = 9] = "Property", e[e.Event = 10] = "Event", e[e.Operator = 11] = "Operator", e[e.Unit = 12] = "Unit", e[e.Value = 13] = "Value", e[e.Constant = 14] = "Constant", e[e.Enum = 15] = "Enum", e[e.EnumMember = 16] = "EnumMember", e[e.Keyword = 17] = "Keyword", e[e.Text = 18] = "Text", e[e.Color = 19] = "Color", e[e.File = 20] = "File", e[e.Reference = 21] = "Reference", e[e.Customcolor = 22] = "Customcolor", e[e.Folder = 23] = "Folder", e[e.TypeParameter = 24] = "TypeParameter", e[e.User = 25] = "User", e[e.Issue = 26] = "Issue", e[e.Snippet = 27] = "Snippet";
})(tr || (tr = {}));
var nr;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(nr || (nr = {}));
var rr;
(function(e) {
  e[e.Invoke = 0] = "Invoke", e[e.TriggerCharacter = 1] = "TriggerCharacter", e[e.TriggerForIncompleteCompletions = 2] = "TriggerForIncompleteCompletions";
})(rr || (rr = {}));
var ir;
(function(e) {
  e[e.EXACT = 0] = "EXACT", e[e.ABOVE = 1] = "ABOVE", e[e.BELOW = 2] = "BELOW";
})(ir || (ir = {}));
var ar;
(function(e) {
  e[e.NotSet = 0] = "NotSet", e[e.ContentFlush = 1] = "ContentFlush", e[e.RecoverFromMarkers = 2] = "RecoverFromMarkers", e[e.Explicit = 3] = "Explicit", e[e.Paste = 4] = "Paste", e[e.Undo = 5] = "Undo", e[e.Redo = 6] = "Redo";
})(ar || (ar = {}));
var sr;
(function(e) {
  e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(sr || (sr = {}));
var or;
(function(e) {
  e[e.Text = 0] = "Text", e[e.Read = 1] = "Read", e[e.Write = 2] = "Write";
})(or || (or = {}));
var lr;
(function(e) {
  e[e.None = 0] = "None", e[e.Keep = 1] = "Keep", e[e.Brackets = 2] = "Brackets", e[e.Advanced = 3] = "Advanced", e[e.Full = 4] = "Full";
})(lr || (lr = {}));
var ur;
(function(e) {
  e[e.acceptSuggestionOnCommitCharacter = 0] = "acceptSuggestionOnCommitCharacter", e[e.acceptSuggestionOnEnter = 1] = "acceptSuggestionOnEnter", e[e.accessibilitySupport = 2] = "accessibilitySupport", e[e.accessibilityPageSize = 3] = "accessibilityPageSize", e[e.ariaLabel = 4] = "ariaLabel", e[e.autoClosingBrackets = 5] = "autoClosingBrackets", e[e.autoClosingDelete = 6] = "autoClosingDelete", e[e.autoClosingOvertype = 7] = "autoClosingOvertype", e[e.autoClosingQuotes = 8] = "autoClosingQuotes", e[e.autoIndent = 9] = "autoIndent", e[e.automaticLayout = 10] = "automaticLayout", e[e.autoSurround = 11] = "autoSurround", e[e.bracketPairColorization = 12] = "bracketPairColorization", e[e.guides = 13] = "guides", e[e.codeLens = 14] = "codeLens", e[e.codeLensFontFamily = 15] = "codeLensFontFamily", e[e.codeLensFontSize = 16] = "codeLensFontSize", e[e.colorDecorators = 17] = "colorDecorators", e[e.columnSelection = 18] = "columnSelection", e[e.comments = 19] = "comments", e[e.contextmenu = 20] = "contextmenu", e[e.copyWithSyntaxHighlighting = 21] = "copyWithSyntaxHighlighting", e[e.cursorBlinking = 22] = "cursorBlinking", e[e.cursorSmoothCaretAnimation = 23] = "cursorSmoothCaretAnimation", e[e.cursorStyle = 24] = "cursorStyle", e[e.cursorSurroundingLines = 25] = "cursorSurroundingLines", e[e.cursorSurroundingLinesStyle = 26] = "cursorSurroundingLinesStyle", e[e.cursorWidth = 27] = "cursorWidth", e[e.disableLayerHinting = 28] = "disableLayerHinting", e[e.disableMonospaceOptimizations = 29] = "disableMonospaceOptimizations", e[e.domReadOnly = 30] = "domReadOnly", e[e.dragAndDrop = 31] = "dragAndDrop", e[e.dropIntoEditor = 32] = "dropIntoEditor", e[e.emptySelectionClipboard = 33] = "emptySelectionClipboard", e[e.experimental = 34] = "experimental", e[e.extraEditorClassName = 35] = "extraEditorClassName", e[e.fastScrollSensitivity = 36] = "fastScrollSensitivity", e[e.find = 37] = "find", e[e.fixedOverflowWidgets = 38] = "fixedOverflowWidgets", e[e.folding = 39] = "folding", e[e.foldingStrategy = 40] = "foldingStrategy", e[e.foldingHighlight = 41] = "foldingHighlight", e[e.foldingImportsByDefault = 42] = "foldingImportsByDefault", e[e.foldingMaximumRegions = 43] = "foldingMaximumRegions", e[e.unfoldOnClickAfterEndOfLine = 44] = "unfoldOnClickAfterEndOfLine", e[e.fontFamily = 45] = "fontFamily", e[e.fontInfo = 46] = "fontInfo", e[e.fontLigatures = 47] = "fontLigatures", e[e.fontSize = 48] = "fontSize", e[e.fontWeight = 49] = "fontWeight", e[e.formatOnPaste = 50] = "formatOnPaste", e[e.formatOnType = 51] = "formatOnType", e[e.glyphMargin = 52] = "glyphMargin", e[e.gotoLocation = 53] = "gotoLocation", e[e.hideCursorInOverviewRuler = 54] = "hideCursorInOverviewRuler", e[e.hover = 55] = "hover", e[e.inDiffEditor = 56] = "inDiffEditor", e[e.inlineSuggest = 57] = "inlineSuggest", e[e.letterSpacing = 58] = "letterSpacing", e[e.lightbulb = 59] = "lightbulb", e[e.lineDecorationsWidth = 60] = "lineDecorationsWidth", e[e.lineHeight = 61] = "lineHeight", e[e.lineNumbers = 62] = "lineNumbers", e[e.lineNumbersMinChars = 63] = "lineNumbersMinChars", e[e.linkedEditing = 64] = "linkedEditing", e[e.links = 65] = "links", e[e.matchBrackets = 66] = "matchBrackets", e[e.minimap = 67] = "minimap", e[e.mouseStyle = 68] = "mouseStyle", e[e.mouseWheelScrollSensitivity = 69] = "mouseWheelScrollSensitivity", e[e.mouseWheelZoom = 70] = "mouseWheelZoom", e[e.multiCursorMergeOverlapping = 71] = "multiCursorMergeOverlapping", e[e.multiCursorModifier = 72] = "multiCursorModifier", e[e.multiCursorPaste = 73] = "multiCursorPaste", e[e.occurrencesHighlight = 74] = "occurrencesHighlight", e[e.overviewRulerBorder = 75] = "overviewRulerBorder", e[e.overviewRulerLanes = 76] = "overviewRulerLanes", e[e.padding = 77] = "padding", e[e.parameterHints = 78] = "parameterHints", e[e.peekWidgetDefaultFocus = 79] = "peekWidgetDefaultFocus", e[e.definitionLinkOpensInPeek = 80] = "definitionLinkOpensInPeek", e[e.quickSuggestions = 81] = "quickSuggestions", e[e.quickSuggestionsDelay = 82] = "quickSuggestionsDelay", e[e.readOnly = 83] = "readOnly", e[e.renameOnType = 84] = "renameOnType", e[e.renderControlCharacters = 85] = "renderControlCharacters", e[e.renderFinalNewline = 86] = "renderFinalNewline", e[e.renderLineHighlight = 87] = "renderLineHighlight", e[e.renderLineHighlightOnlyWhenFocus = 88] = "renderLineHighlightOnlyWhenFocus", e[e.renderValidationDecorations = 89] = "renderValidationDecorations", e[e.renderWhitespace = 90] = "renderWhitespace", e[e.revealHorizontalRightPadding = 91] = "revealHorizontalRightPadding", e[e.roundedSelection = 92] = "roundedSelection", e[e.rulers = 93] = "rulers", e[e.scrollbar = 94] = "scrollbar", e[e.scrollBeyondLastColumn = 95] = "scrollBeyondLastColumn", e[e.scrollBeyondLastLine = 96] = "scrollBeyondLastLine", e[e.scrollPredominantAxis = 97] = "scrollPredominantAxis", e[e.selectionClipboard = 98] = "selectionClipboard", e[e.selectionHighlight = 99] = "selectionHighlight", e[e.selectOnLineNumbers = 100] = "selectOnLineNumbers", e[e.showFoldingControls = 101] = "showFoldingControls", e[e.showUnused = 102] = "showUnused", e[e.snippetSuggestions = 103] = "snippetSuggestions", e[e.smartSelect = 104] = "smartSelect", e[e.smoothScrolling = 105] = "smoothScrolling", e[e.stickyTabStops = 106] = "stickyTabStops", e[e.stopRenderingLineAfter = 107] = "stopRenderingLineAfter", e[e.suggest = 108] = "suggest", e[e.suggestFontSize = 109] = "suggestFontSize", e[e.suggestLineHeight = 110] = "suggestLineHeight", e[e.suggestOnTriggerCharacters = 111] = "suggestOnTriggerCharacters", e[e.suggestSelection = 112] = "suggestSelection", e[e.tabCompletion = 113] = "tabCompletion", e[e.tabIndex = 114] = "tabIndex", e[e.unicodeHighlighting = 115] = "unicodeHighlighting", e[e.unusualLineTerminators = 116] = "unusualLineTerminators", e[e.useShadowDOM = 117] = "useShadowDOM", e[e.useTabStops = 118] = "useTabStops", e[e.wordSeparators = 119] = "wordSeparators", e[e.wordWrap = 120] = "wordWrap", e[e.wordWrapBreakAfterCharacters = 121] = "wordWrapBreakAfterCharacters", e[e.wordWrapBreakBeforeCharacters = 122] = "wordWrapBreakBeforeCharacters", e[e.wordWrapColumn = 123] = "wordWrapColumn", e[e.wordWrapOverride1 = 124] = "wordWrapOverride1", e[e.wordWrapOverride2 = 125] = "wordWrapOverride2", e[e.wrappingIndent = 126] = "wrappingIndent", e[e.wrappingStrategy = 127] = "wrappingStrategy", e[e.showDeprecated = 128] = "showDeprecated", e[e.inlayHints = 129] = "inlayHints", e[e.editorClassName = 130] = "editorClassName", e[e.pixelRatio = 131] = "pixelRatio", e[e.tabFocusMode = 132] = "tabFocusMode", e[e.layoutInfo = 133] = "layoutInfo", e[e.wrappingInfo = 134] = "wrappingInfo";
})(ur || (ur = {}));
var cr;
(function(e) {
  e[e.TextDefined = 0] = "TextDefined", e[e.LF = 1] = "LF", e[e.CRLF = 2] = "CRLF";
})(cr || (cr = {}));
var hr;
(function(e) {
  e[e.LF = 0] = "LF", e[e.CRLF = 1] = "CRLF";
})(hr || (hr = {}));
var dr;
(function(e) {
  e[e.None = 0] = "None", e[e.Indent = 1] = "Indent", e[e.IndentOutdent = 2] = "IndentOutdent", e[e.Outdent = 3] = "Outdent";
})(dr || (dr = {}));
var fr;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(fr || (fr = {}));
var mr;
(function(e) {
  e[e.Type = 1] = "Type", e[e.Parameter = 2] = "Parameter";
})(mr || (mr = {}));
var pr;
(function(e) {
  e[e.Automatic = 0] = "Automatic", e[e.Explicit = 1] = "Explicit";
})(pr || (pr = {}));
var ln;
(function(e) {
  e[e.DependsOnKbLayout = -1] = "DependsOnKbLayout", e[e.Unknown = 0] = "Unknown", e[e.Backspace = 1] = "Backspace", e[e.Tab = 2] = "Tab", e[e.Enter = 3] = "Enter", e[e.Shift = 4] = "Shift", e[e.Ctrl = 5] = "Ctrl", e[e.Alt = 6] = "Alt", e[e.PauseBreak = 7] = "PauseBreak", e[e.CapsLock = 8] = "CapsLock", e[e.Escape = 9] = "Escape", e[e.Space = 10] = "Space", e[e.PageUp = 11] = "PageUp", e[e.PageDown = 12] = "PageDown", e[e.End = 13] = "End", e[e.Home = 14] = "Home", e[e.LeftArrow = 15] = "LeftArrow", e[e.UpArrow = 16] = "UpArrow", e[e.RightArrow = 17] = "RightArrow", e[e.DownArrow = 18] = "DownArrow", e[e.Insert = 19] = "Insert", e[e.Delete = 20] = "Delete", e[e.Digit0 = 21] = "Digit0", e[e.Digit1 = 22] = "Digit1", e[e.Digit2 = 23] = "Digit2", e[e.Digit3 = 24] = "Digit3", e[e.Digit4 = 25] = "Digit4", e[e.Digit5 = 26] = "Digit5", e[e.Digit6 = 27] = "Digit6", e[e.Digit7 = 28] = "Digit7", e[e.Digit8 = 29] = "Digit8", e[e.Digit9 = 30] = "Digit9", e[e.KeyA = 31] = "KeyA", e[e.KeyB = 32] = "KeyB", e[e.KeyC = 33] = "KeyC", e[e.KeyD = 34] = "KeyD", e[e.KeyE = 35] = "KeyE", e[e.KeyF = 36] = "KeyF", e[e.KeyG = 37] = "KeyG", e[e.KeyH = 38] = "KeyH", e[e.KeyI = 39] = "KeyI", e[e.KeyJ = 40] = "KeyJ", e[e.KeyK = 41] = "KeyK", e[e.KeyL = 42] = "KeyL", e[e.KeyM = 43] = "KeyM", e[e.KeyN = 44] = "KeyN", e[e.KeyO = 45] = "KeyO", e[e.KeyP = 46] = "KeyP", e[e.KeyQ = 47] = "KeyQ", e[e.KeyR = 48] = "KeyR", e[e.KeyS = 49] = "KeyS", e[e.KeyT = 50] = "KeyT", e[e.KeyU = 51] = "KeyU", e[e.KeyV = 52] = "KeyV", e[e.KeyW = 53] = "KeyW", e[e.KeyX = 54] = "KeyX", e[e.KeyY = 55] = "KeyY", e[e.KeyZ = 56] = "KeyZ", e[e.Meta = 57] = "Meta", e[e.ContextMenu = 58] = "ContextMenu", e[e.F1 = 59] = "F1", e[e.F2 = 60] = "F2", e[e.F3 = 61] = "F3", e[e.F4 = 62] = "F4", e[e.F5 = 63] = "F5", e[e.F6 = 64] = "F6", e[e.F7 = 65] = "F7", e[e.F8 = 66] = "F8", e[e.F9 = 67] = "F9", e[e.F10 = 68] = "F10", e[e.F11 = 69] = "F11", e[e.F12 = 70] = "F12", e[e.F13 = 71] = "F13", e[e.F14 = 72] = "F14", e[e.F15 = 73] = "F15", e[e.F16 = 74] = "F16", e[e.F17 = 75] = "F17", e[e.F18 = 76] = "F18", e[e.F19 = 77] = "F19", e[e.NumLock = 78] = "NumLock", e[e.ScrollLock = 79] = "ScrollLock", e[e.Semicolon = 80] = "Semicolon", e[e.Equal = 81] = "Equal", e[e.Comma = 82] = "Comma", e[e.Minus = 83] = "Minus", e[e.Period = 84] = "Period", e[e.Slash = 85] = "Slash", e[e.Backquote = 86] = "Backquote", e[e.BracketLeft = 87] = "BracketLeft", e[e.Backslash = 88] = "Backslash", e[e.BracketRight = 89] = "BracketRight", e[e.Quote = 90] = "Quote", e[e.OEM_8 = 91] = "OEM_8", e[e.IntlBackslash = 92] = "IntlBackslash", e[e.Numpad0 = 93] = "Numpad0", e[e.Numpad1 = 94] = "Numpad1", e[e.Numpad2 = 95] = "Numpad2", e[e.Numpad3 = 96] = "Numpad3", e[e.Numpad4 = 97] = "Numpad4", e[e.Numpad5 = 98] = "Numpad5", e[e.Numpad6 = 99] = "Numpad6", e[e.Numpad7 = 100] = "Numpad7", e[e.Numpad8 = 101] = "Numpad8", e[e.Numpad9 = 102] = "Numpad9", e[e.NumpadMultiply = 103] = "NumpadMultiply", e[e.NumpadAdd = 104] = "NumpadAdd", e[e.NUMPAD_SEPARATOR = 105] = "NUMPAD_SEPARATOR", e[e.NumpadSubtract = 106] = "NumpadSubtract", e[e.NumpadDecimal = 107] = "NumpadDecimal", e[e.NumpadDivide = 108] = "NumpadDivide", e[e.KEY_IN_COMPOSITION = 109] = "KEY_IN_COMPOSITION", e[e.ABNT_C1 = 110] = "ABNT_C1", e[e.ABNT_C2 = 111] = "ABNT_C2", e[e.AudioVolumeMute = 112] = "AudioVolumeMute", e[e.AudioVolumeUp = 113] = "AudioVolumeUp", e[e.AudioVolumeDown = 114] = "AudioVolumeDown", e[e.BrowserSearch = 115] = "BrowserSearch", e[e.BrowserHome = 116] = "BrowserHome", e[e.BrowserBack = 117] = "BrowserBack", e[e.BrowserForward = 118] = "BrowserForward", e[e.MediaTrackNext = 119] = "MediaTrackNext", e[e.MediaTrackPrevious = 120] = "MediaTrackPrevious", e[e.MediaStop = 121] = "MediaStop", e[e.MediaPlayPause = 122] = "MediaPlayPause", e[e.LaunchMediaPlayer = 123] = "LaunchMediaPlayer", e[e.LaunchMail = 124] = "LaunchMail", e[e.LaunchApp2 = 125] = "LaunchApp2", e[e.Clear = 126] = "Clear", e[e.MAX_VALUE = 127] = "MAX_VALUE";
})(ln || (ln = {}));
var un;
(function(e) {
  e[e.Hint = 1] = "Hint", e[e.Info = 2] = "Info", e[e.Warning = 4] = "Warning", e[e.Error = 8] = "Error";
})(un || (un = {}));
var cn;
(function(e) {
  e[e.Unnecessary = 1] = "Unnecessary", e[e.Deprecated = 2] = "Deprecated";
})(cn || (cn = {}));
var gr;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(gr || (gr = {}));
var br;
(function(e) {
  e[e.UNKNOWN = 0] = "UNKNOWN", e[e.TEXTAREA = 1] = "TEXTAREA", e[e.GUTTER_GLYPH_MARGIN = 2] = "GUTTER_GLYPH_MARGIN", e[e.GUTTER_LINE_NUMBERS = 3] = "GUTTER_LINE_NUMBERS", e[e.GUTTER_LINE_DECORATIONS = 4] = "GUTTER_LINE_DECORATIONS", e[e.GUTTER_VIEW_ZONE = 5] = "GUTTER_VIEW_ZONE", e[e.CONTENT_TEXT = 6] = "CONTENT_TEXT", e[e.CONTENT_EMPTY = 7] = "CONTENT_EMPTY", e[e.CONTENT_VIEW_ZONE = 8] = "CONTENT_VIEW_ZONE", e[e.CONTENT_WIDGET = 9] = "CONTENT_WIDGET", e[e.OVERVIEW_RULER = 10] = "OVERVIEW_RULER", e[e.SCROLLBAR = 11] = "SCROLLBAR", e[e.OVERLAY_WIDGET = 12] = "OVERLAY_WIDGET", e[e.OUTSIDE_EDITOR = 13] = "OUTSIDE_EDITOR";
})(br || (br = {}));
var wr;
(function(e) {
  e[e.TOP_RIGHT_CORNER = 0] = "TOP_RIGHT_CORNER", e[e.BOTTOM_RIGHT_CORNER = 1] = "BOTTOM_RIGHT_CORNER", e[e.TOP_CENTER = 2] = "TOP_CENTER";
})(wr || (wr = {}));
var _r;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(_r || (_r = {}));
var vr;
(function(e) {
  e[e.Left = 0] = "Left", e[e.Right = 1] = "Right", e[e.None = 2] = "None", e[e.LeftOfInjectedText = 3] = "LeftOfInjectedText", e[e.RightOfInjectedText = 4] = "RightOfInjectedText";
})(vr || (vr = {}));
var yr;
(function(e) {
  e[e.Off = 0] = "Off", e[e.On = 1] = "On", e[e.Relative = 2] = "Relative", e[e.Interval = 3] = "Interval", e[e.Custom = 4] = "Custom";
})(yr || (yr = {}));
var Tr;
(function(e) {
  e[e.None = 0] = "None", e[e.Text = 1] = "Text", e[e.Blocks = 2] = "Blocks";
})(Tr || (Tr = {}));
var kr;
(function(e) {
  e[e.Smooth = 0] = "Smooth", e[e.Immediate = 1] = "Immediate";
})(kr || (kr = {}));
var Ar;
(function(e) {
  e[e.Auto = 1] = "Auto", e[e.Hidden = 2] = "Hidden", e[e.Visible = 3] = "Visible";
})(Ar || (Ar = {}));
var hn;
(function(e) {
  e[e.LTR = 0] = "LTR", e[e.RTL = 1] = "RTL";
})(hn || (hn = {}));
var Cr;
(function(e) {
  e[e.Invoke = 1] = "Invoke", e[e.TriggerCharacter = 2] = "TriggerCharacter", e[e.ContentChange = 3] = "ContentChange";
})(Cr || (Cr = {}));
var Sr;
(function(e) {
  e[e.File = 0] = "File", e[e.Module = 1] = "Module", e[e.Namespace = 2] = "Namespace", e[e.Package = 3] = "Package", e[e.Class = 4] = "Class", e[e.Method = 5] = "Method", e[e.Property = 6] = "Property", e[e.Field = 7] = "Field", e[e.Constructor = 8] = "Constructor", e[e.Enum = 9] = "Enum", e[e.Interface = 10] = "Interface", e[e.Function = 11] = "Function", e[e.Variable = 12] = "Variable", e[e.Constant = 13] = "Constant", e[e.String = 14] = "String", e[e.Number = 15] = "Number", e[e.Boolean = 16] = "Boolean", e[e.Array = 17] = "Array", e[e.Object = 18] = "Object", e[e.Key = 19] = "Key", e[e.Null = 20] = "Null", e[e.EnumMember = 21] = "EnumMember", e[e.Struct = 22] = "Struct", e[e.Event = 23] = "Event", e[e.Operator = 24] = "Operator", e[e.TypeParameter = 25] = "TypeParameter";
})(Sr || (Sr = {}));
var xr;
(function(e) {
  e[e.Deprecated = 1] = "Deprecated";
})(xr || (xr = {}));
var Lr;
(function(e) {
  e[e.Hidden = 0] = "Hidden", e[e.Blink = 1] = "Blink", e[e.Smooth = 2] = "Smooth", e[e.Phase = 3] = "Phase", e[e.Expand = 4] = "Expand", e[e.Solid = 5] = "Solid";
})(Lr || (Lr = {}));
var Er;
(function(e) {
  e[e.Line = 1] = "Line", e[e.Block = 2] = "Block", e[e.Underline = 3] = "Underline", e[e.LineThin = 4] = "LineThin", e[e.BlockOutline = 5] = "BlockOutline", e[e.UnderlineThin = 6] = "UnderlineThin";
})(Er || (Er = {}));
var Mr;
(function(e) {
  e[e.AlwaysGrowsWhenTypingAtEdges = 0] = "AlwaysGrowsWhenTypingAtEdges", e[e.NeverGrowsWhenTypingAtEdges = 1] = "NeverGrowsWhenTypingAtEdges", e[e.GrowsOnlyWhenTypingBefore = 2] = "GrowsOnlyWhenTypingBefore", e[e.GrowsOnlyWhenTypingAfter = 3] = "GrowsOnlyWhenTypingAfter";
})(Mr || (Mr = {}));
var Dr;
(function(e) {
  e[e.None = 0] = "None", e[e.Same = 1] = "Same", e[e.Indent = 2] = "Indent", e[e.DeepIndent = 3] = "DeepIndent";
})(Dr || (Dr = {}));
class ct {
  static chord(t, n) {
    return Ls(t, n);
  }
}
ct.CtrlCmd = 2048;
ct.Shift = 1024;
ct.Alt = 512;
ct.WinCtrl = 256;
function Rs() {
  return {
    editor: void 0,
    languages: void 0,
    CancellationTokenSource: As,
    Emitter: ke,
    KeyCode: ln,
    KeyMod: ct,
    Position: me,
    Range: Z,
    Selection: de,
    SelectionDirection: hn,
    MarkerSeverity: un,
    MarkerTag: cn,
    Uri: Xe,
    Token: Ds
  };
}
var Rr;
(function(e) {
  e[e.Left = 1] = "Left", e[e.Center = 2] = "Center", e[e.Right = 4] = "Right", e[e.Full = 7] = "Full";
})(Rr || (Rr = {}));
var Nr;
(function(e) {
  e[e.Inline = 1] = "Inline", e[e.Gutter = 2] = "Gutter";
})(Nr || (Nr = {}));
var Ur;
(function(e) {
  e[e.Both = 0] = "Both", e[e.Right = 1] = "Right", e[e.Left = 2] = "Left", e[e.None = 3] = "None";
})(Ur || (Ur = {}));
function Ns(e, t, n, r, i) {
  if (r === 0)
    return !0;
  const s = t.charCodeAt(r - 1);
  if (e.get(s) !== 0 || s === 13 || s === 10)
    return !0;
  if (i > 0) {
    const l = t.charCodeAt(r);
    if (e.get(l) !== 0)
      return !0;
  }
  return !1;
}
function Us(e, t, n, r, i) {
  if (r + i === n)
    return !0;
  const s = t.charCodeAt(r + i);
  if (e.get(s) !== 0 || s === 13 || s === 10)
    return !0;
  if (i > 0) {
    const l = t.charCodeAt(r + i - 1);
    if (e.get(l) !== 0)
      return !0;
  }
  return !1;
}
function Is(e, t, n, r, i) {
  return Ns(e, t, n, r, i) && Us(e, t, n, r, i);
}
class Hs {
  constructor(t, n) {
    this._wordSeparators = t, this._searchRegex = n, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  reset(t) {
    this._searchRegex.lastIndex = t, this._prevMatchStartIndex = -1, this._prevMatchLength = 0;
  }
  next(t) {
    const n = t.length;
    let r;
    do {
      if (this._prevMatchStartIndex + this._prevMatchLength === n || (r = this._searchRegex.exec(t), !r))
        return null;
      const i = r.index, s = r[0].length;
      if (i === this._prevMatchStartIndex && s === this._prevMatchLength) {
        if (s === 0) {
          Ha(t, n, this._searchRegex.lastIndex) > 65535 ? this._searchRegex.lastIndex += 2 : this._searchRegex.lastIndex += 1;
          continue;
        }
        return null;
      }
      if (this._prevMatchStartIndex = i, this._prevMatchLength = s, !this._wordSeparators || Is(this._wordSeparators, t, n, i, s))
        return r;
    } while (r);
    return null;
  }
}
class zs {
  static computeUnicodeHighlights(t, n, r) {
    const i = r ? r.startLineNumber : 1, s = r ? r.endLineNumber : t.getLineCount(), l = new Ir(n), u = l.getCandidateCodePoints();
    let o;
    u === "allNonBasicAscii" ? o = new RegExp("[^\\t\\n\\r\\x20-\\x7E]", "g") : o = new RegExp(`${Ws(Array.from(u))}`, "g");
    const c = new Hs(null, o), h = [];
    let d = !1, f, g = 0, _ = 0, w = 0;
    e:
      for (let y = i, k = s; y <= k; y++) {
        const v = t.getLineContent(y), L = v.length;
        c.reset(0);
        do
          if (f = c.next(v), f) {
            let M = f.index, z = f.index + f[0].length;
            if (M > 0) {
              const b = v.charCodeAt(M - 1);
              Qt(b) && M--;
            }
            if (z + 1 < L) {
              const b = v.charCodeAt(z - 1);
              Qt(b) && z++;
            }
            const D = v.substring(M, z), p = An(M + 1, Oi, v, 0), m = l.shouldHighlightNonBasicASCII(D, p ? p.word : null);
            if (m !== 0) {
              m === 3 ? g++ : m === 2 ? _++ : m === 1 ? w++ : La();
              const b = 1e3;
              if (h.length >= b) {
                d = !0;
                break e;
              }
              h.push(new Z(y, M + 1, y, z + 1));
            }
          }
        while (f);
      }
    return {
      ranges: h,
      hasMore: d,
      ambiguousCharacterCount: g,
      invisibleCharacterCount: _,
      nonBasicAsciiCharacterCount: w
    };
  }
  static computeUnicodeHighlightReason(t, n) {
    const r = new Ir(n);
    switch (r.shouldHighlightNonBasicASCII(t, null)) {
      case 0:
        return null;
      case 2:
        return { kind: 1 };
      case 3: {
        const s = t.codePointAt(0), l = r.ambiguousCharacters.getPrimaryConfusable(s), u = ge.getLocales().filter((o) => !ge.getInstance(/* @__PURE__ */ new Set([...n.allowedLocales, o])).isAmbiguous(s));
        return { kind: 0, confusableWith: String.fromCodePoint(l), notAmbiguousInLocales: u };
      }
      case 1:
        return { kind: 2 };
    }
  }
}
function Ws(e, t) {
  return `[${Ma(e.map((r) => String.fromCodePoint(r)).join(""))}]`;
}
class Ir {
  constructor(t) {
    this.options = t, this.allowedCodePoints = new Set(t.allowedCodePoints), this.ambiguousCharacters = ge.getInstance(new Set(t.allowedLocales));
  }
  getCandidateCodePoints() {
    if (this.options.nonBasicASCII)
      return "allNonBasicAscii";
    const t = /* @__PURE__ */ new Set();
    if (this.options.invisibleCharacters)
      for (const n of Ne.codePoints)
        Hr(String.fromCodePoint(n)) || t.add(n);
    if (this.options.ambiguousCharacters)
      for (const n of this.ambiguousCharacters.getConfusableCodePoints())
        t.add(n);
    for (const n of this.allowedCodePoints)
      t.delete(n);
    return t;
  }
  shouldHighlightNonBasicASCII(t, n) {
    const r = t.codePointAt(0);
    if (this.allowedCodePoints.has(r))
      return 0;
    if (this.options.nonBasicASCII)
      return 1;
    let i = !1, s = !1;
    if (n)
      for (const l of n) {
        const u = l.codePointAt(0), o = Wa(l);
        i = i || o, !o && !this.ambiguousCharacters.isAmbiguous(u) && !Ne.isInvisibleCharacter(u) && (s = !0);
      }
    return !i && s ? 0 : this.options.invisibleCharacters && !Hr(t) && Ne.isInvisibleCharacter(r) ? 2 : this.options.ambiguousCharacters && this.ambiguousCharacters.isAmbiguous(r) ? 3 : 0;
  }
}
function Hr(e) {
  return e === " " || e === `
` || e === "	";
}
var ze = globalThis && globalThis.__awaiter || function(e, t, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(l) {
      l(s);
    });
  }
  return new (n || (n = Promise))(function(s, l) {
    function u(h) {
      try {
        c(r.next(h));
      } catch (d) {
        l(d);
      }
    }
    function o(h) {
      try {
        c(r.throw(h));
      } catch (d) {
        l(d);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(u, o);
    }
    c((r = r.apply(e, t || [])).next());
  });
};
class Fs extends ms {
  get uri() {
    return this._uri;
  }
  get eol() {
    return this._eol;
  }
  getValue() {
    return this.getText();
  }
  getLinesContent() {
    return this._lines.slice(0);
  }
  getLineCount() {
    return this._lines.length;
  }
  getLineContent(t) {
    return this._lines[t - 1];
  }
  getWordAtPosition(t, n) {
    const r = An(t.column, bs(n), this._lines[t.lineNumber - 1], 0);
    return r ? new Z(t.lineNumber, r.startColumn, t.lineNumber, r.endColumn) : null;
  }
  words(t) {
    const n = this._lines, r = this._wordenize.bind(this);
    let i = 0, s = "", l = 0, u = [];
    return {
      *[Symbol.iterator]() {
        for (; ; )
          if (l < u.length) {
            const o = s.substring(u[l].start, u[l].end);
            l += 1, yield o;
          } else if (i < n.length)
            s = n[i], u = r(s, t), l = 0, i += 1;
          else
            break;
      }
    };
  }
  getLineWords(t, n) {
    const r = this._lines[t - 1], i = this._wordenize(r, n), s = [];
    for (const l of i)
      s.push({
        word: r.substring(l.start, l.end),
        startColumn: l.start + 1,
        endColumn: l.end + 1
      });
    return s;
  }
  _wordenize(t, n) {
    const r = [];
    let i;
    for (n.lastIndex = 0; (i = n.exec(t)) && i[0].length !== 0; )
      r.push({ start: i.index, end: i.index + i[0].length });
    return r;
  }
  getValueInRange(t) {
    if (t = this._validateRange(t), t.startLineNumber === t.endLineNumber)
      return this._lines[t.startLineNumber - 1].substring(t.startColumn - 1, t.endColumn - 1);
    const n = this._eol, r = t.startLineNumber - 1, i = t.endLineNumber - 1, s = [];
    s.push(this._lines[r].substring(t.startColumn - 1));
    for (let l = r + 1; l < i; l++)
      s.push(this._lines[l]);
    return s.push(this._lines[i].substring(0, t.endColumn - 1)), s.join(n);
  }
  offsetAt(t) {
    return t = this._validatePosition(t), this._ensureLineStarts(), this._lineStarts.getPrefixSum(t.lineNumber - 2) + (t.column - 1);
  }
  positionAt(t) {
    t = Math.floor(t), t = Math.max(0, t), this._ensureLineStarts();
    const n = this._lineStarts.getIndexOf(t), r = this._lines[n.index].length;
    return {
      lineNumber: 1 + n.index,
      column: 1 + Math.min(n.remainder, r)
    };
  }
  _validateRange(t) {
    const n = this._validatePosition({ lineNumber: t.startLineNumber, column: t.startColumn }), r = this._validatePosition({ lineNumber: t.endLineNumber, column: t.endColumn });
    return n.lineNumber !== t.startLineNumber || n.column !== t.startColumn || r.lineNumber !== t.endLineNumber || r.column !== t.endColumn ? {
      startLineNumber: n.lineNumber,
      startColumn: n.column,
      endLineNumber: r.lineNumber,
      endColumn: r.column
    } : t;
  }
  _validatePosition(t) {
    if (!me.isIPosition(t))
      throw new Error("bad position");
    let { lineNumber: n, column: r } = t, i = !1;
    if (n < 1)
      n = 1, r = 1, i = !0;
    else if (n > this._lines.length)
      n = this._lines.length, r = this._lines[n - 1].length + 1, i = !0;
    else {
      const s = this._lines[n - 1].length + 1;
      r < 1 ? (r = 1, i = !0) : r > s && (r = s, i = !0);
    }
    return i ? { lineNumber: n, column: r } : t;
  }
}
class Fe {
  constructor(t, n) {
    this._host = t, this._models = /* @__PURE__ */ Object.create(null), this._foreignModuleFactory = n, this._foreignModule = null;
  }
  dispose() {
    this._models = /* @__PURE__ */ Object.create(null);
  }
  _getModel(t) {
    return this._models[t];
  }
  _getModels() {
    const t = [];
    return Object.keys(this._models).forEach((n) => t.push(this._models[n])), t;
  }
  acceptNewModel(t) {
    this._models[t.url] = new Fs(Xe.parse(t.url), t.lines, t.EOL, t.versionId);
  }
  acceptModelChanged(t, n) {
    if (!this._models[t])
      return;
    this._models[t].onEvents(n);
  }
  acceptRemovedModel(t) {
    this._models[t] && delete this._models[t];
  }
  computeUnicodeHighlights(t, n, r) {
    return ze(this, void 0, void 0, function* () {
      const i = this._getModel(t);
      return i ? zs.computeUnicodeHighlights(i, n, r) : { ranges: [], hasMore: !1, ambiguousCharacterCount: 0, invisibleCharacterCount: 0, nonBasicAsciiCharacterCount: 0 };
    });
  }
  computeDiff(t, n, r, i) {
    return ze(this, void 0, void 0, function* () {
      const s = this._getModel(t), l = this._getModel(n);
      return !s || !l ? null : Fe.computeDiff(s, l, r, i);
    });
  }
  static computeDiff(t, n, r, i) {
    const s = t.getLinesContent(), l = n.getLinesContent(), o = new hs(s, l, {
      shouldComputeCharChanges: !0,
      shouldPostProcessCharChanges: !0,
      shouldIgnoreTrimWhitespace: r,
      shouldMakePrettyDiff: !0,
      maxComputationTime: i
    }).computeDiff(), c = o.changes.length > 0 ? !1 : this._modelsAreIdentical(t, n);
    return {
      quitEarly: o.quitEarly,
      identical: c,
      changes: o.changes
    };
  }
  static _modelsAreIdentical(t, n) {
    const r = t.getLineCount(), i = n.getLineCount();
    if (r !== i)
      return !1;
    for (let s = 1; s <= r; s++) {
      const l = t.getLineContent(s), u = n.getLineContent(s);
      if (l !== u)
        return !1;
    }
    return !0;
  }
  computeMoreMinimalEdits(t, n) {
    return ze(this, void 0, void 0, function* () {
      const r = this._getModel(t);
      if (!r)
        return n;
      const i = [];
      let s;
      n = n.slice(0).sort((l, u) => {
        if (l.range && u.range)
          return Z.compareRangesUsingStarts(l.range, u.range);
        const o = l.range ? 0 : 1, c = u.range ? 0 : 1;
        return o - c;
      });
      for (let { range: l, text: u, eol: o } of n) {
        if (typeof o == "number" && (s = o), Z.isEmpty(l) && !u)
          continue;
        const c = r.getValueInRange(l);
        if (u = u.replace(/\r\n|\n|\r/g, r.eol), c === u)
          continue;
        if (Math.max(u.length, c.length) > Fe._diffLimit) {
          i.push({ range: l, text: u });
          continue;
        }
        const h = Xa(c, u, !1), d = r.offsetAt(Z.lift(l).getStartPosition());
        for (const f of h) {
          const g = r.positionAt(d + f.originalStart), _ = r.positionAt(d + f.originalStart + f.originalLength), w = {
            text: u.substr(f.modifiedStart, f.modifiedLength),
            range: { startLineNumber: g.lineNumber, startColumn: g.column, endLineNumber: _.lineNumber, endColumn: _.column }
          };
          r.getValueInRange(w.range) !== w.text && i.push(w);
        }
      }
      return typeof s == "number" && i.push({ eol: s, text: "", range: { startLineNumber: 0, startColumn: 0, endLineNumber: 0, endColumn: 0 } }), i;
    });
  }
  computeLinks(t) {
    return ze(this, void 0, void 0, function* () {
      const n = this._getModel(t);
      return n ? ks(n) : null;
    });
  }
  textualSuggest(t, n, r, i) {
    return ze(this, void 0, void 0, function* () {
      const s = new zt(!0), l = new RegExp(r, i), u = /* @__PURE__ */ new Set();
      e:
        for (const o of t) {
          const c = this._getModel(o);
          if (c) {
            for (const h of c.words(l))
              if (!(h === n || !isNaN(Number(h))) && (u.add(h), u.size > Fe._suggestionsLimit))
                break e;
          }
        }
      return { words: Array.from(u), duration: s.elapsed() };
    });
  }
  computeWordRanges(t, n, r, i) {
    return ze(this, void 0, void 0, function* () {
      const s = this._getModel(t);
      if (!s)
        return /* @__PURE__ */ Object.create(null);
      const l = new RegExp(r, i), u = /* @__PURE__ */ Object.create(null);
      for (let o = n.startLineNumber; o < n.endLineNumber; o++) {
        const c = s.getLineWords(o, l);
        for (const h of c) {
          if (!isNaN(Number(h.word)))
            continue;
          let d = u[h.word];
          d || (d = [], u[h.word] = d), d.push({
            startLineNumber: o,
            startColumn: h.startColumn,
            endLineNumber: o,
            endColumn: h.endColumn
          });
        }
      }
      return u;
    });
  }
  navigateValueSet(t, n, r, i, s) {
    return ze(this, void 0, void 0, function* () {
      const l = this._getModel(t);
      if (!l)
        return null;
      const u = new RegExp(i, s);
      n.startColumn === n.endColumn && (n = {
        startLineNumber: n.startLineNumber,
        startColumn: n.startColumn,
        endLineNumber: n.endLineNumber,
        endColumn: n.endColumn + 1
      });
      const o = l.getValueInRange(n), c = l.getWordAtPosition({ lineNumber: n.startLineNumber, column: n.startColumn }, u);
      if (!c)
        return null;
      const h = l.getValueInRange(c);
      return rn.INSTANCE.navigateValueSet(n, o, c, h, r);
    });
  }
  loadForeignModule(t, n, r) {
    const l = {
      host: xa(r, (u, o) => this._host.fhr(u, o)),
      getMirrorModels: () => this._getModels()
    };
    return this._foreignModuleFactory ? (this._foreignModule = this._foreignModuleFactory(l, n), Promise.resolve(Jt(this._foreignModule))) : Promise.reject(new Error("Unexpected usage"));
  }
  fmr(t, n) {
    if (!this._foreignModule || typeof this._foreignModule[t] != "function")
      return Promise.reject(new Error("Missing requestHandler or method: " + t));
    try {
      return Promise.resolve(this._foreignModule[t].apply(this._foreignModule, n));
    } catch (r) {
      return Promise.reject(r);
    }
  }
}
Fe._diffLimit = 1e5;
Fe._suggestionsLimit = 1e4;
typeof importScripts == "function" && (ie.monaco = Rs());
let dn = !1;
function Gi(e) {
  if (dn)
    return;
  dn = !0;
  const t = new Ga((n) => {
    self.postMessage(n);
  }, (n) => new Fe(n, e));
  self.onmessage = (n) => {
    t.onmessage(n.data);
  };
}
self.onmessage = (e) => {
  dn || Gi(null);
};
/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.34.1(547870b6881302c5b4ff32173c16d06009e3588f)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
function Ps(e, t) {
  let n;
  return t.length === 0 ? n = e : n = e.replace(/\{(\d+)\}/g, (r, i) => {
    let s = i[0];
    return typeof t[s] < "u" ? t[s] : r;
  }), n;
}
function Bs(e, t, ...n) {
  return Ps(t, n);
}
function xn(e) {
  return Bs;
}
var zr;
(function(e) {
  e.MIN_VALUE = -2147483648, e.MAX_VALUE = 2147483647;
})(zr || (zr = {}));
var At;
(function(e) {
  e.MIN_VALUE = 0, e.MAX_VALUE = 2147483647;
})(At || (At = {}));
var ne;
(function(e) {
  function t(r, i) {
    return r === Number.MAX_VALUE && (r = At.MAX_VALUE), i === Number.MAX_VALUE && (i = At.MAX_VALUE), { line: r, character: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.objectLiteral(i) && A.uinteger(i.line) && A.uinteger(i.character);
  }
  e.is = n;
})(ne || (ne = {}));
var X;
(function(e) {
  function t(r, i, s, l) {
    if (A.uinteger(r) && A.uinteger(i) && A.uinteger(s) && A.uinteger(l))
      return { start: ne.create(r, i), end: ne.create(s, l) };
    if (ne.is(r) && ne.is(i))
      return { start: r, end: i };
    throw new Error("Range#create called with invalid arguments[" + r + ", " + i + ", " + s + ", " + l + "]");
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.objectLiteral(i) && ne.is(i.start) && ne.is(i.end);
  }
  e.is = n;
})(X || (X = {}));
var Ct;
(function(e) {
  function t(r, i) {
    return { uri: r, range: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && X.is(i.range) && (A.string(i.uri) || A.undefined(i.uri));
  }
  e.is = n;
})(Ct || (Ct = {}));
var Wr;
(function(e) {
  function t(r, i, s, l) {
    return { targetUri: r, targetRange: i, targetSelectionRange: s, originSelectionRange: l };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && X.is(i.targetRange) && A.string(i.targetUri) && (X.is(i.targetSelectionRange) || A.undefined(i.targetSelectionRange)) && (X.is(i.originSelectionRange) || A.undefined(i.originSelectionRange));
  }
  e.is = n;
})(Wr || (Wr = {}));
var fn;
(function(e) {
  function t(r, i, s, l) {
    return {
      red: r,
      green: i,
      blue: s,
      alpha: l
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.numberRange(i.red, 0, 1) && A.numberRange(i.green, 0, 1) && A.numberRange(i.blue, 0, 1) && A.numberRange(i.alpha, 0, 1);
  }
  e.is = n;
})(fn || (fn = {}));
var Fr;
(function(e) {
  function t(r, i) {
    return {
      range: r,
      color: i
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return X.is(i.range) && fn.is(i.color);
  }
  e.is = n;
})(Fr || (Fr = {}));
var Pr;
(function(e) {
  function t(r, i, s) {
    return {
      label: r,
      textEdit: i,
      additionalTextEdits: s
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.string(i.label) && (A.undefined(i.textEdit) || ee.is(i)) && (A.undefined(i.additionalTextEdits) || A.typedArray(i.additionalTextEdits, ee.is));
  }
  e.is = n;
})(Pr || (Pr = {}));
var St;
(function(e) {
  e.Comment = "comment", e.Imports = "imports", e.Region = "region";
})(St || (St = {}));
var Br;
(function(e) {
  function t(r, i, s, l, u) {
    var o = {
      startLine: r,
      endLine: i
    };
    return A.defined(s) && (o.startCharacter = s), A.defined(l) && (o.endCharacter = l), A.defined(u) && (o.kind = u), o;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.uinteger(i.startLine) && A.uinteger(i.startLine) && (A.undefined(i.startCharacter) || A.uinteger(i.startCharacter)) && (A.undefined(i.endCharacter) || A.uinteger(i.endCharacter)) && (A.undefined(i.kind) || A.string(i.kind));
  }
  e.is = n;
})(Br || (Br = {}));
var mn;
(function(e) {
  function t(r, i) {
    return {
      location: r,
      message: i
    };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && Ct.is(i.location) && A.string(i.message);
  }
  e.is = n;
})(mn || (mn = {}));
var qr;
(function(e) {
  e.Error = 1, e.Warning = 2, e.Information = 3, e.Hint = 4;
})(qr || (qr = {}));
var Or;
(function(e) {
  e.Unnecessary = 1, e.Deprecated = 2;
})(Or || (Or = {}));
var Vr;
(function(e) {
  function t(n) {
    var r = n;
    return r != null && A.string(r.href);
  }
  e.is = t;
})(Vr || (Vr = {}));
var xt;
(function(e) {
  function t(r, i, s, l, u, o) {
    var c = { range: r, message: i };
    return A.defined(s) && (c.severity = s), A.defined(l) && (c.code = l), A.defined(u) && (c.source = u), A.defined(o) && (c.relatedInformation = o), c;
  }
  e.create = t;
  function n(r) {
    var i, s = r;
    return A.defined(s) && X.is(s.range) && A.string(s.message) && (A.number(s.severity) || A.undefined(s.severity)) && (A.integer(s.code) || A.string(s.code) || A.undefined(s.code)) && (A.undefined(s.codeDescription) || A.string((i = s.codeDescription) === null || i === void 0 ? void 0 : i.href)) && (A.string(s.source) || A.undefined(s.source)) && (A.undefined(s.relatedInformation) || A.typedArray(s.relatedInformation, mn.is));
  }
  e.is = n;
})(xt || (xt = {}));
var st;
(function(e) {
  function t(r, i) {
    for (var s = [], l = 2; l < arguments.length; l++)
      s[l - 2] = arguments[l];
    var u = { title: r, command: i };
    return A.defined(s) && s.length > 0 && (u.arguments = s), u;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.string(i.title) && A.string(i.command);
  }
  e.is = n;
})(st || (st = {}));
var ee;
(function(e) {
  function t(s, l) {
    return { range: s, newText: l };
  }
  e.replace = t;
  function n(s, l) {
    return { range: { start: s, end: s }, newText: l };
  }
  e.insert = n;
  function r(s) {
    return { range: s, newText: "" };
  }
  e.del = r;
  function i(s) {
    var l = s;
    return A.objectLiteral(l) && A.string(l.newText) && X.is(l.range);
  }
  e.is = i;
})(ee || (ee = {}));
var Je;
(function(e) {
  function t(r, i, s) {
    var l = { label: r };
    return i !== void 0 && (l.needsConfirmation = i), s !== void 0 && (l.description = s), l;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i !== void 0 && A.objectLiteral(i) && A.string(i.label) && (A.boolean(i.needsConfirmation) || i.needsConfirmation === void 0) && (A.string(i.description) || i.description === void 0);
  }
  e.is = n;
})(Je || (Je = {}));
var ae;
(function(e) {
  function t(n) {
    var r = n;
    return typeof r == "string";
  }
  e.is = t;
})(ae || (ae = {}));
var De;
(function(e) {
  function t(s, l, u) {
    return { range: s, newText: l, annotationId: u };
  }
  e.replace = t;
  function n(s, l, u) {
    return { range: { start: s, end: s }, newText: l, annotationId: u };
  }
  e.insert = n;
  function r(s, l) {
    return { range: s, newText: "", annotationId: l };
  }
  e.del = r;
  function i(s) {
    var l = s;
    return ee.is(l) && (Je.is(l.annotationId) || ae.is(l.annotationId));
  }
  e.is = i;
})(De || (De = {}));
var Lt;
(function(e) {
  function t(r, i) {
    return { textDocument: r, edits: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && Et.is(i.textDocument) && Array.isArray(i.edits);
  }
  e.is = n;
})(Lt || (Lt = {}));
var ot;
(function(e) {
  function t(r, i, s) {
    var l = {
      kind: "create",
      uri: r
    };
    return i !== void 0 && (i.overwrite !== void 0 || i.ignoreIfExists !== void 0) && (l.options = i), s !== void 0 && (l.annotationId = s), l;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "create" && A.string(i.uri) && (i.options === void 0 || (i.options.overwrite === void 0 || A.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || A.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ae.is(i.annotationId));
  }
  e.is = n;
})(ot || (ot = {}));
var lt;
(function(e) {
  function t(r, i, s, l) {
    var u = {
      kind: "rename",
      oldUri: r,
      newUri: i
    };
    return s !== void 0 && (s.overwrite !== void 0 || s.ignoreIfExists !== void 0) && (u.options = s), l !== void 0 && (u.annotationId = l), u;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "rename" && A.string(i.oldUri) && A.string(i.newUri) && (i.options === void 0 || (i.options.overwrite === void 0 || A.boolean(i.options.overwrite)) && (i.options.ignoreIfExists === void 0 || A.boolean(i.options.ignoreIfExists))) && (i.annotationId === void 0 || ae.is(i.annotationId));
  }
  e.is = n;
})(lt || (lt = {}));
var ut;
(function(e) {
  function t(r, i, s) {
    var l = {
      kind: "delete",
      uri: r
    };
    return i !== void 0 && (i.recursive !== void 0 || i.ignoreIfNotExists !== void 0) && (l.options = i), s !== void 0 && (l.annotationId = s), l;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && i.kind === "delete" && A.string(i.uri) && (i.options === void 0 || (i.options.recursive === void 0 || A.boolean(i.options.recursive)) && (i.options.ignoreIfNotExists === void 0 || A.boolean(i.options.ignoreIfNotExists))) && (i.annotationId === void 0 || ae.is(i.annotationId));
  }
  e.is = n;
})(ut || (ut = {}));
var pn;
(function(e) {
  function t(n) {
    var r = n;
    return r && (r.changes !== void 0 || r.documentChanges !== void 0) && (r.documentChanges === void 0 || r.documentChanges.every(function(i) {
      return A.string(i.kind) ? ot.is(i) || lt.is(i) || ut.is(i) : Lt.is(i);
    }));
  }
  e.is = t;
})(pn || (pn = {}));
var mt = function() {
  function e(t, n) {
    this.edits = t, this.changeAnnotations = n;
  }
  return e.prototype.insert = function(t, n, r) {
    var i, s;
    if (r === void 0 ? i = ee.insert(t, n) : ae.is(r) ? (s = r, i = De.insert(t, n, r)) : (this.assertChangeAnnotations(this.changeAnnotations), s = this.changeAnnotations.manage(r), i = De.insert(t, n, s)), this.edits.push(i), s !== void 0)
      return s;
  }, e.prototype.replace = function(t, n, r) {
    var i, s;
    if (r === void 0 ? i = ee.replace(t, n) : ae.is(r) ? (s = r, i = De.replace(t, n, r)) : (this.assertChangeAnnotations(this.changeAnnotations), s = this.changeAnnotations.manage(r), i = De.replace(t, n, s)), this.edits.push(i), s !== void 0)
      return s;
  }, e.prototype.delete = function(t, n) {
    var r, i;
    if (n === void 0 ? r = ee.del(t) : ae.is(n) ? (i = n, r = De.del(t, n)) : (this.assertChangeAnnotations(this.changeAnnotations), i = this.changeAnnotations.manage(n), r = De.del(t, i)), this.edits.push(r), i !== void 0)
      return i;
  }, e.prototype.add = function(t) {
    this.edits.push(t);
  }, e.prototype.all = function() {
    return this.edits;
  }, e.prototype.clear = function() {
    this.edits.splice(0, this.edits.length);
  }, e.prototype.assertChangeAnnotations = function(t) {
    if (t === void 0)
      throw new Error("Text edit change is not configured to manage change annotations.");
  }, e;
}(), jr = function() {
  function e(t) {
    this._annotations = t === void 0 ? /* @__PURE__ */ Object.create(null) : t, this._counter = 0, this._size = 0;
  }
  return e.prototype.all = function() {
    return this._annotations;
  }, Object.defineProperty(e.prototype, "size", {
    get: function() {
      return this._size;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.manage = function(t, n) {
    var r;
    if (ae.is(t) ? r = t : (r = this.nextId(), n = t), this._annotations[r] !== void 0)
      throw new Error("Id " + r + " is already in use.");
    if (n === void 0)
      throw new Error("No annotation provided for id " + r);
    return this._annotations[r] = n, this._size++, r;
  }, e.prototype.nextId = function() {
    return this._counter++, this._counter.toString();
  }, e;
}();
(function() {
  function e(t) {
    var n = this;
    this._textEditChanges = /* @__PURE__ */ Object.create(null), t !== void 0 ? (this._workspaceEdit = t, t.documentChanges ? (this._changeAnnotations = new jr(t.changeAnnotations), t.changeAnnotations = this._changeAnnotations.all(), t.documentChanges.forEach(function(r) {
      if (Lt.is(r)) {
        var i = new mt(r.edits, n._changeAnnotations);
        n._textEditChanges[r.textDocument.uri] = i;
      }
    })) : t.changes && Object.keys(t.changes).forEach(function(r) {
      var i = new mt(t.changes[r]);
      n._textEditChanges[r] = i;
    })) : this._workspaceEdit = {};
  }
  return Object.defineProperty(e.prototype, "edit", {
    get: function() {
      return this.initDocumentChanges(), this._changeAnnotations !== void 0 && (this._changeAnnotations.size === 0 ? this._workspaceEdit.changeAnnotations = void 0 : this._workspaceEdit.changeAnnotations = this._changeAnnotations.all()), this._workspaceEdit;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getTextEditChange = function(t) {
    if (Et.is(t)) {
      if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
        throw new Error("Workspace edit is not configured for document changes.");
      var n = { uri: t.uri, version: t.version }, r = this._textEditChanges[n.uri];
      if (!r) {
        var i = [], s = {
          textDocument: n,
          edits: i
        };
        this._workspaceEdit.documentChanges.push(s), r = new mt(i, this._changeAnnotations), this._textEditChanges[n.uri] = r;
      }
      return r;
    } else {
      if (this.initChanges(), this._workspaceEdit.changes === void 0)
        throw new Error("Workspace edit is not configured for normal text edit changes.");
      var r = this._textEditChanges[t];
      if (!r) {
        var i = [];
        this._workspaceEdit.changes[t] = i, r = new mt(i), this._textEditChanges[t] = r;
      }
      return r;
    }
  }, e.prototype.initDocumentChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._changeAnnotations = new jr(), this._workspaceEdit.documentChanges = [], this._workspaceEdit.changeAnnotations = this._changeAnnotations.all());
  }, e.prototype.initChanges = function() {
    this._workspaceEdit.documentChanges === void 0 && this._workspaceEdit.changes === void 0 && (this._workspaceEdit.changes = /* @__PURE__ */ Object.create(null));
  }, e.prototype.createFile = function(t, n, r) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    Je.is(n) || ae.is(n) ? i = n : r = n;
    var s, l;
    if (i === void 0 ? s = ot.create(t, r) : (l = ae.is(i) ? i : this._changeAnnotations.manage(i), s = ot.create(t, r, l)), this._workspaceEdit.documentChanges.push(s), l !== void 0)
      return l;
  }, e.prototype.renameFile = function(t, n, r, i) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var s;
    Je.is(r) || ae.is(r) ? s = r : i = r;
    var l, u;
    if (s === void 0 ? l = lt.create(t, n, i) : (u = ae.is(s) ? s : this._changeAnnotations.manage(s), l = lt.create(t, n, i, u)), this._workspaceEdit.documentChanges.push(l), u !== void 0)
      return u;
  }, e.prototype.deleteFile = function(t, n, r) {
    if (this.initDocumentChanges(), this._workspaceEdit.documentChanges === void 0)
      throw new Error("Workspace edit is not configured for document changes.");
    var i;
    Je.is(n) || ae.is(n) ? i = n : r = n;
    var s, l;
    if (i === void 0 ? s = ut.create(t, r) : (l = ae.is(i) ? i : this._changeAnnotations.manage(i), s = ut.create(t, r, l)), this._workspaceEdit.documentChanges.push(s), l !== void 0)
      return l;
  }, e;
})();
var Gr;
(function(e) {
  function t(r) {
    return { uri: r };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.string(i.uri);
  }
  e.is = n;
})(Gr || (Gr = {}));
var $r;
(function(e) {
  function t(r, i) {
    return { uri: r, version: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.string(i.uri) && A.integer(i.version);
  }
  e.is = n;
})($r || ($r = {}));
var Et;
(function(e) {
  function t(r, i) {
    return { uri: r, version: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.string(i.uri) && (i.version === null || A.integer(i.version));
  }
  e.is = n;
})(Et || (Et = {}));
var Xr;
(function(e) {
  function t(r, i, s, l) {
    return { uri: r, languageId: i, version: s, text: l };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.string(i.uri) && A.string(i.languageId) && A.integer(i.version) && A.string(i.text);
  }
  e.is = n;
})(Xr || (Xr = {}));
var ve;
(function(e) {
  e.PlainText = "plaintext", e.Markdown = "markdown";
})(ve || (ve = {}));
(function(e) {
  function t(n) {
    var r = n;
    return r === e.PlainText || r === e.Markdown;
  }
  e.is = t;
})(ve || (ve = {}));
var gn;
(function(e) {
  function t(n) {
    var r = n;
    return A.objectLiteral(n) && ve.is(r.kind) && A.string(r.value);
  }
  e.is = t;
})(gn || (gn = {}));
var ue;
(function(e) {
  e.Text = 1, e.Method = 2, e.Function = 3, e.Constructor = 4, e.Field = 5, e.Variable = 6, e.Class = 7, e.Interface = 8, e.Module = 9, e.Property = 10, e.Unit = 11, e.Value = 12, e.Enum = 13, e.Keyword = 14, e.Snippet = 15, e.Color = 16, e.File = 17, e.Reference = 18, e.Folder = 19, e.EnumMember = 20, e.Constant = 21, e.Struct = 22, e.Event = 23, e.Operator = 24, e.TypeParameter = 25;
})(ue || (ue = {}));
var we;
(function(e) {
  e.PlainText = 1, e.Snippet = 2;
})(we || (we = {}));
var Jr;
(function(e) {
  e.Deprecated = 1;
})(Jr || (Jr = {}));
var Qr;
(function(e) {
  function t(r, i, s) {
    return { newText: r, insert: i, replace: s };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && A.string(i.newText) && X.is(i.insert) && X.is(i.replace);
  }
  e.is = n;
})(Qr || (Qr = {}));
var Yr;
(function(e) {
  e.asIs = 1, e.adjustIndentation = 2;
})(Yr || (Yr = {}));
var Zr;
(function(e) {
  function t(n) {
    return { label: n };
  }
  e.create = t;
})(Zr || (Zr = {}));
var Kr;
(function(e) {
  function t(n, r) {
    return { items: n || [], isIncomplete: !!r };
  }
  e.create = t;
})(Kr || (Kr = {}));
var Mt;
(function(e) {
  function t(r) {
    return r.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  e.fromPlainText = t;
  function n(r) {
    var i = r;
    return A.string(i) || A.objectLiteral(i) && A.string(i.language) && A.string(i.value);
  }
  e.is = n;
})(Mt || (Mt = {}));
var ei;
(function(e) {
  function t(n) {
    var r = n;
    return !!r && A.objectLiteral(r) && (gn.is(r.contents) || Mt.is(r.contents) || A.typedArray(r.contents, Mt.is)) && (n.range === void 0 || X.is(n.range));
  }
  e.is = t;
})(ei || (ei = {}));
var ti;
(function(e) {
  function t(n, r) {
    return r ? { label: n, documentation: r } : { label: n };
  }
  e.create = t;
})(ti || (ti = {}));
var ni;
(function(e) {
  function t(n, r) {
    for (var i = [], s = 2; s < arguments.length; s++)
      i[s - 2] = arguments[s];
    var l = { label: n };
    return A.defined(r) && (l.documentation = r), A.defined(i) ? l.parameters = i : l.parameters = [], l;
  }
  e.create = t;
})(ni || (ni = {}));
var Dt;
(function(e) {
  e.Text = 1, e.Read = 2, e.Write = 3;
})(Dt || (Dt = {}));
var ri;
(function(e) {
  function t(n, r) {
    var i = { range: n };
    return A.number(r) && (i.kind = r), i;
  }
  e.create = t;
})(ri || (ri = {}));
var bn;
(function(e) {
  e.File = 1, e.Module = 2, e.Namespace = 3, e.Package = 4, e.Class = 5, e.Method = 6, e.Property = 7, e.Field = 8, e.Constructor = 9, e.Enum = 10, e.Interface = 11, e.Function = 12, e.Variable = 13, e.Constant = 14, e.String = 15, e.Number = 16, e.Boolean = 17, e.Array = 18, e.Object = 19, e.Key = 20, e.Null = 21, e.EnumMember = 22, e.Struct = 23, e.Event = 24, e.Operator = 25, e.TypeParameter = 26;
})(bn || (bn = {}));
var ii;
(function(e) {
  e.Deprecated = 1;
})(ii || (ii = {}));
var ai;
(function(e) {
  function t(n, r, i, s, l) {
    var u = {
      name: n,
      kind: r,
      location: { uri: s, range: i }
    };
    return l && (u.containerName = l), u;
  }
  e.create = t;
})(ai || (ai = {}));
var si;
(function(e) {
  function t(r, i, s, l, u, o) {
    var c = {
      name: r,
      detail: i,
      kind: s,
      range: l,
      selectionRange: u
    };
    return o !== void 0 && (c.children = o), c;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && A.string(i.name) && A.number(i.kind) && X.is(i.range) && X.is(i.selectionRange) && (i.detail === void 0 || A.string(i.detail)) && (i.deprecated === void 0 || A.boolean(i.deprecated)) && (i.children === void 0 || Array.isArray(i.children)) && (i.tags === void 0 || Array.isArray(i.tags));
  }
  e.is = n;
})(si || (si = {}));
var oi;
(function(e) {
  e.Empty = "", e.QuickFix = "quickfix", e.Refactor = "refactor", e.RefactorExtract = "refactor.extract", e.RefactorInline = "refactor.inline", e.RefactorRewrite = "refactor.rewrite", e.Source = "source", e.SourceOrganizeImports = "source.organizeImports", e.SourceFixAll = "source.fixAll";
})(oi || (oi = {}));
var li;
(function(e) {
  function t(r, i) {
    var s = { diagnostics: r };
    return i != null && (s.only = i), s;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.typedArray(i.diagnostics, xt.is) && (i.only === void 0 || A.typedArray(i.only, A.string));
  }
  e.is = n;
})(li || (li = {}));
var ui;
(function(e) {
  function t(r, i, s) {
    var l = { title: r }, u = !0;
    return typeof i == "string" ? (u = !1, l.kind = i) : st.is(i) ? l.command = i : l.edit = i, u && s !== void 0 && (l.kind = s), l;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i && A.string(i.title) && (i.diagnostics === void 0 || A.typedArray(i.diagnostics, xt.is)) && (i.kind === void 0 || A.string(i.kind)) && (i.edit !== void 0 || i.command !== void 0) && (i.command === void 0 || st.is(i.command)) && (i.isPreferred === void 0 || A.boolean(i.isPreferred)) && (i.edit === void 0 || pn.is(i.edit));
  }
  e.is = n;
})(ui || (ui = {}));
var ci;
(function(e) {
  function t(r, i) {
    var s = { range: r };
    return A.defined(i) && (s.data = i), s;
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && X.is(i.range) && (A.undefined(i.command) || st.is(i.command));
  }
  e.is = n;
})(ci || (ci = {}));
var hi;
(function(e) {
  function t(r, i) {
    return { tabSize: r, insertSpaces: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && A.uinteger(i.tabSize) && A.boolean(i.insertSpaces);
  }
  e.is = n;
})(hi || (hi = {}));
var di;
(function(e) {
  function t(r, i, s) {
    return { range: r, target: i, data: s };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return A.defined(i) && X.is(i.range) && (A.undefined(i.target) || A.string(i.target));
  }
  e.is = n;
})(di || (di = {}));
var Rt;
(function(e) {
  function t(r, i) {
    return { range: r, parent: i };
  }
  e.create = t;
  function n(r) {
    var i = r;
    return i !== void 0 && X.is(i.range) && (i.parent === void 0 || e.is(i.parent));
  }
  e.is = n;
})(Rt || (Rt = {}));
var fi;
(function(e) {
  function t(s, l, u, o) {
    return new qs(s, l, u, o);
  }
  e.create = t;
  function n(s) {
    var l = s;
    return !!(A.defined(l) && A.string(l.uri) && (A.undefined(l.languageId) || A.string(l.languageId)) && A.uinteger(l.lineCount) && A.func(l.getText) && A.func(l.positionAt) && A.func(l.offsetAt));
  }
  e.is = n;
  function r(s, l) {
    for (var u = s.getText(), o = i(l, function(_, w) {
      var y = _.range.start.line - w.range.start.line;
      return y === 0 ? _.range.start.character - w.range.start.character : y;
    }), c = u.length, h = o.length - 1; h >= 0; h--) {
      var d = o[h], f = s.offsetAt(d.range.start), g = s.offsetAt(d.range.end);
      if (g <= c)
        u = u.substring(0, f) + d.newText + u.substring(g, u.length);
      else
        throw new Error("Overlapping edit");
      c = f;
    }
    return u;
  }
  e.applyEdits = r;
  function i(s, l) {
    if (s.length <= 1)
      return s;
    var u = s.length / 2 | 0, o = s.slice(0, u), c = s.slice(u);
    i(o, l), i(c, l);
    for (var h = 0, d = 0, f = 0; h < o.length && d < c.length; ) {
      var g = l(o[h], c[d]);
      g <= 0 ? s[f++] = o[h++] : s[f++] = c[d++];
    }
    for (; h < o.length; )
      s[f++] = o[h++];
    for (; d < c.length; )
      s[f++] = c[d++];
    return s;
  }
})(fi || (fi = {}));
var qs = function() {
  function e(t, n, r, i) {
    this._uri = t, this._languageId = n, this._version = r, this._content = i, this._lineOffsets = void 0;
  }
  return Object.defineProperty(e.prototype, "uri", {
    get: function() {
      return this._uri;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "languageId", {
    get: function() {
      return this._languageId;
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "version", {
    get: function() {
      return this._version;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.getText = function(t) {
    if (t) {
      var n = this.offsetAt(t.start), r = this.offsetAt(t.end);
      return this._content.substring(n, r);
    }
    return this._content;
  }, e.prototype.update = function(t, n) {
    this._content = t.text, this._version = n, this._lineOffsets = void 0;
  }, e.prototype.getLineOffsets = function() {
    if (this._lineOffsets === void 0) {
      for (var t = [], n = this._content, r = !0, i = 0; i < n.length; i++) {
        r && (t.push(i), r = !1);
        var s = n.charAt(i);
        r = s === "\r" || s === `
`, s === "\r" && i + 1 < n.length && n.charAt(i + 1) === `
` && i++;
      }
      r && n.length > 0 && t.push(n.length), this._lineOffsets = t;
    }
    return this._lineOffsets;
  }, e.prototype.positionAt = function(t) {
    t = Math.max(Math.min(t, this._content.length), 0);
    var n = this.getLineOffsets(), r = 0, i = n.length;
    if (i === 0)
      return ne.create(0, t);
    for (; r < i; ) {
      var s = Math.floor((r + i) / 2);
      n[s] > t ? i = s : r = s + 1;
    }
    var l = r - 1;
    return ne.create(l, t - n[l]);
  }, e.prototype.offsetAt = function(t) {
    var n = this.getLineOffsets();
    if (t.line >= n.length)
      return this._content.length;
    if (t.line < 0)
      return 0;
    var r = n[t.line], i = t.line + 1 < n.length ? n[t.line + 1] : this._content.length;
    return Math.max(Math.min(r + t.character, i), r);
  }, Object.defineProperty(e.prototype, "lineCount", {
    get: function() {
      return this.getLineOffsets().length;
    },
    enumerable: !1,
    configurable: !0
  }), e;
}(), A;
(function(e) {
  var t = Object.prototype.toString;
  function n(g) {
    return typeof g < "u";
  }
  e.defined = n;
  function r(g) {
    return typeof g > "u";
  }
  e.undefined = r;
  function i(g) {
    return g === !0 || g === !1;
  }
  e.boolean = i;
  function s(g) {
    return t.call(g) === "[object String]";
  }
  e.string = s;
  function l(g) {
    return t.call(g) === "[object Number]";
  }
  e.number = l;
  function u(g, _, w) {
    return t.call(g) === "[object Number]" && _ <= g && g <= w;
  }
  e.numberRange = u;
  function o(g) {
    return t.call(g) === "[object Number]" && -2147483648 <= g && g <= 2147483647;
  }
  e.integer = o;
  function c(g) {
    return t.call(g) === "[object Number]" && 0 <= g && g <= 2147483647;
  }
  e.uinteger = c;
  function h(g) {
    return t.call(g) === "[object Function]";
  }
  e.func = h;
  function d(g) {
    return g !== null && typeof g == "object";
  }
  e.objectLiteral = d;
  function f(g, _) {
    return Array.isArray(g) && g.every(_);
  }
  e.typedArray = f;
})(A || (A = {}));
var Nt = class {
  constructor(e, t, n, r) {
    this._uri = e, this._languageId = t, this._version = n, this._content = r, this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(e) {
    if (e) {
      const t = this.offsetAt(e.start), n = this.offsetAt(e.end);
      return this._content.substring(t, n);
    }
    return this._content;
  }
  update(e, t) {
    for (let n of e)
      if (Nt.isIncremental(n)) {
        const r = $i(n.range), i = this.offsetAt(r.start), s = this.offsetAt(r.end);
        this._content = this._content.substring(0, i) + n.text + this._content.substring(s, this._content.length);
        const l = Math.max(r.start.line, 0), u = Math.max(r.end.line, 0);
        let o = this._lineOffsets;
        const c = mi(n.text, !1, i);
        if (u - l === c.length)
          for (let d = 0, f = c.length; d < f; d++)
            o[d + l + 1] = c[d];
        else
          c.length < 1e4 ? o.splice(l + 1, u - l, ...c) : this._lineOffsets = o = o.slice(0, l + 1).concat(c, o.slice(u + 1));
        const h = n.text.length - (s - i);
        if (h !== 0)
          for (let d = l + 1 + c.length, f = o.length; d < f; d++)
            o[d] = o[d] + h;
      } else if (Nt.isFull(n))
        this._content = n.text, this._lineOffsets = void 0;
      else
        throw new Error("Unknown change event received");
    this._version = t;
  }
  getLineOffsets() {
    return this._lineOffsets === void 0 && (this._lineOffsets = mi(this._content, !0)), this._lineOffsets;
  }
  positionAt(e) {
    e = Math.max(Math.min(e, this._content.length), 0);
    let t = this.getLineOffsets(), n = 0, r = t.length;
    if (r === 0)
      return { line: 0, character: e };
    for (; n < r; ) {
      let s = Math.floor((n + r) / 2);
      t[s] > e ? r = s : n = s + 1;
    }
    let i = n - 1;
    return { line: i, character: e - t[i] };
  }
  offsetAt(e) {
    let t = this.getLineOffsets();
    if (e.line >= t.length)
      return this._content.length;
    if (e.line < 0)
      return 0;
    let n = t[e.line], r = e.line + 1 < t.length ? t[e.line + 1] : this._content.length;
    return Math.max(Math.min(n + e.character, r), n);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
  static isIncremental(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range !== void 0 && (t.rangeLength === void 0 || typeof t.rangeLength == "number");
  }
  static isFull(e) {
    let t = e;
    return t != null && typeof t.text == "string" && t.range === void 0 && t.rangeLength === void 0;
  }
}, wn;
(function(e) {
  function t(i, s, l, u) {
    return new Nt(i, s, l, u);
  }
  e.create = t;
  function n(i, s, l) {
    if (i instanceof Nt)
      return i.update(s, l), i;
    throw new Error("TextDocument.update: document must be created by TextDocument.create");
  }
  e.update = n;
  function r(i, s) {
    let l = i.getText(), u = _n(s.map(Os), (h, d) => {
      let f = h.range.start.line - d.range.start.line;
      return f === 0 ? h.range.start.character - d.range.start.character : f;
    }), o = 0;
    const c = [];
    for (const h of u) {
      let d = i.offsetAt(h.range.start);
      if (d < o)
        throw new Error("Overlapping edit");
      d > o && c.push(l.substring(o, d)), h.newText.length && c.push(h.newText), o = i.offsetAt(h.range.end);
    }
    return c.push(l.substr(o)), c.join("");
  }
  e.applyEdits = r;
})(wn || (wn = {}));
function _n(e, t) {
  if (e.length <= 1)
    return e;
  const n = e.length / 2 | 0, r = e.slice(0, n), i = e.slice(n);
  _n(r, t), _n(i, t);
  let s = 0, l = 0, u = 0;
  for (; s < r.length && l < i.length; )
    t(r[s], i[l]) <= 0 ? e[u++] = r[s++] : e[u++] = i[l++];
  for (; s < r.length; )
    e[u++] = r[s++];
  for (; l < i.length; )
    e[u++] = i[l++];
  return e;
}
function mi(e, t, n = 0) {
  const r = t ? [n] : [];
  for (let i = 0; i < e.length; i++) {
    let s = e.charCodeAt(i);
    (s === 13 || s === 10) && (s === 13 && i + 1 < e.length && e.charCodeAt(i + 1) === 10 && i++, r.push(n + i + 1));
  }
  return r;
}
function $i(e) {
  const t = e.start, n = e.end;
  return t.line > n.line || t.line === n.line && t.character > n.character ? { start: n, end: t } : e;
}
function Os(e) {
  const t = $i(e.range);
  return t !== e.range ? { newText: e.newText, range: t } : e;
}
var U;
(function(e) {
  e[e.StartCommentTag = 0] = "StartCommentTag", e[e.Comment = 1] = "Comment", e[e.EndCommentTag = 2] = "EndCommentTag", e[e.StartTagOpen = 3] = "StartTagOpen", e[e.StartTagClose = 4] = "StartTagClose", e[e.StartTagSelfClose = 5] = "StartTagSelfClose", e[e.StartTag = 6] = "StartTag", e[e.EndTagOpen = 7] = "EndTagOpen", e[e.EndTagClose = 8] = "EndTagClose", e[e.EndTag = 9] = "EndTag", e[e.DelimiterAssign = 10] = "DelimiterAssign", e[e.AttributeName = 11] = "AttributeName", e[e.AttributeValue = 12] = "AttributeValue", e[e.StartDoctypeTag = 13] = "StartDoctypeTag", e[e.Doctype = 14] = "Doctype", e[e.EndDoctypeTag = 15] = "EndDoctypeTag", e[e.Content = 16] = "Content", e[e.Whitespace = 17] = "Whitespace", e[e.Unknown = 18] = "Unknown", e[e.Script = 19] = "Script", e[e.Styles = 20] = "Styles", e[e.EOS = 21] = "EOS";
})(U || (U = {}));
var O;
(function(e) {
  e[e.WithinContent = 0] = "WithinContent", e[e.AfterOpeningStartTag = 1] = "AfterOpeningStartTag", e[e.AfterOpeningEndTag = 2] = "AfterOpeningEndTag", e[e.WithinDoctype = 3] = "WithinDoctype", e[e.WithinTag = 4] = "WithinTag", e[e.WithinEndTag = 5] = "WithinEndTag", e[e.WithinComment = 6] = "WithinComment", e[e.WithinScriptContent = 7] = "WithinScriptContent", e[e.WithinStyleContent = 8] = "WithinStyleContent", e[e.AfterAttributeName = 9] = "AfterAttributeName", e[e.BeforeAttributeValue = 10] = "BeforeAttributeValue";
})(O || (O = {}));
var pi;
(function(e) {
  e.LATEST = {
    textDocument: {
      completion: {
        completionItem: {
          documentationFormat: [ve.Markdown, ve.PlainText]
        }
      },
      hover: {
        contentFormat: [ve.Markdown, ve.PlainText]
      }
    }
  };
})(pi || (pi = {}));
var vn;
(function(e) {
  e[e.Unknown = 0] = "Unknown", e[e.File = 1] = "File", e[e.Directory = 2] = "Directory", e[e.SymbolicLink = 64] = "SymbolicLink";
})(vn || (vn = {}));
var Le = xn(), Vs = function() {
  function e(t, n) {
    this.source = t, this.len = t.length, this.position = n;
  }
  return e.prototype.eos = function() {
    return this.len <= this.position;
  }, e.prototype.getSource = function() {
    return this.source;
  }, e.prototype.pos = function() {
    return this.position;
  }, e.prototype.goBackTo = function(t) {
    this.position = t;
  }, e.prototype.goBack = function(t) {
    this.position -= t;
  }, e.prototype.advance = function(t) {
    this.position += t;
  }, e.prototype.goToEnd = function() {
    this.position = this.source.length;
  }, e.prototype.nextChar = function() {
    return this.source.charCodeAt(this.position++) || 0;
  }, e.prototype.peekChar = function(t) {
    return t === void 0 && (t = 0), this.source.charCodeAt(this.position + t) || 0;
  }, e.prototype.advanceIfChar = function(t) {
    return t === this.source.charCodeAt(this.position) ? (this.position++, !0) : !1;
  }, e.prototype.advanceIfChars = function(t) {
    var n;
    if (this.position + t.length > this.source.length)
      return !1;
    for (n = 0; n < t.length; n++)
      if (this.source.charCodeAt(this.position + n) !== t[n])
        return !1;
    return this.advance(n), !0;
  }, e.prototype.advanceIfRegExp = function(t) {
    var n = this.source.substr(this.position), r = n.match(t);
    return r ? (this.position = this.position + r.index + r[0].length, r[0]) : "";
  }, e.prototype.advanceUntilRegExp = function(t) {
    var n = this.source.substr(this.position), r = n.match(t);
    return r ? (this.position = this.position + r.index, r[0]) : (this.goToEnd(), "");
  }, e.prototype.advanceUntilChar = function(t) {
    for (; this.position < this.source.length; ) {
      if (this.source.charCodeAt(this.position) === t)
        return !0;
      this.advance(1);
    }
    return !1;
  }, e.prototype.advanceUntilChars = function(t) {
    for (; this.position + t.length <= this.source.length; ) {
      for (var n = 0; n < t.length && this.source.charCodeAt(this.position + n) === t[n]; n++)
        ;
      if (n === t.length)
        return !0;
      this.advance(1);
    }
    return this.goToEnd(), !1;
  }, e.prototype.skipWhitespace = function() {
    var t = this.advanceWhileChar(function(n) {
      return n === Ys || n === Zs || n === Xs || n === Qs || n === Js;
    });
    return t > 0;
  }, e.prototype.advanceWhileChar = function(t) {
    for (var n = this.position; this.position < this.len && t(this.source.charCodeAt(this.position)); )
      this.position++;
    return this.position - n;
  }, e;
}(), gi = "!".charCodeAt(0), Ge = "-".charCodeAt(0), pt = "<".charCodeAt(0), Te = ">".charCodeAt(0), Ot = "/".charCodeAt(0), js = "=".charCodeAt(0), Gs = '"'.charCodeAt(0), $s = "'".charCodeAt(0), Xs = `
`.charCodeAt(0), Js = "\r".charCodeAt(0), Qs = "\f".charCodeAt(0), Ys = " ".charCodeAt(0), Zs = "	".charCodeAt(0), Ks = {
  "text/x-handlebars-template": !0,
  "text/html": !0
};
function pe(e, t, n, r) {
  t === void 0 && (t = 0), n === void 0 && (n = O.WithinContent), r === void 0 && (r = !1);
  var i = new Vs(e, t), s = n, l = 0, u = U.Unknown, o, c, h, d, f;
  function g() {
    return i.advanceIfRegExp(/^[_:\w][_:\w-.\d]*/).toLowerCase();
  }
  function _() {
    return i.advanceIfRegExp(/^[^\s"'></=\x00-\x0F\x7F\x80-\x9F]*/).toLowerCase();
  }
  function w(v, L, M) {
    return u = L, l = v, o = M, L;
  }
  function y() {
    var v = i.pos(), L = s, M = k();
    return M !== U.EOS && v === i.pos() && !(r && (M === U.StartTagClose || M === U.EndTagClose)) ? (console.log("Scanner.scan has not advanced at offset " + v + ", state before: " + L + " after: " + s), i.advance(1), w(v, U.Unknown)) : M;
  }
  function k() {
    var v = i.pos();
    if (i.eos())
      return w(v, U.EOS);
    var L;
    switch (s) {
      case O.WithinComment:
        return i.advanceIfChars([Ge, Ge, Te]) ? (s = O.WithinContent, w(v, U.EndCommentTag)) : (i.advanceUntilChars([Ge, Ge, Te]), w(v, U.Comment));
      case O.WithinDoctype:
        return i.advanceIfChar(Te) ? (s = O.WithinContent, w(v, U.EndDoctypeTag)) : (i.advanceUntilChar(Te), w(v, U.Doctype));
      case O.WithinContent:
        if (i.advanceIfChar(pt)) {
          if (!i.eos() && i.peekChar() === gi) {
            if (i.advanceIfChars([gi, Ge, Ge]))
              return s = O.WithinComment, w(v, U.StartCommentTag);
            if (i.advanceIfRegExp(/^!doctype/i))
              return s = O.WithinDoctype, w(v, U.StartDoctypeTag);
          }
          return i.advanceIfChar(Ot) ? (s = O.AfterOpeningEndTag, w(v, U.EndTagOpen)) : (s = O.AfterOpeningStartTag, w(v, U.StartTagOpen));
        }
        return i.advanceUntilChar(pt), w(v, U.Content);
      case O.AfterOpeningEndTag:
        var M = g();
        return M.length > 0 ? (s = O.WithinEndTag, w(v, U.EndTag)) : i.skipWhitespace() ? w(v, U.Whitespace, Le("error.unexpectedWhitespace", "Tag name must directly follow the open bracket.")) : (s = O.WithinEndTag, i.advanceUntilChar(Te), v < i.pos() ? w(v, U.Unknown, Le("error.endTagNameExpected", "End tag name expected.")) : k());
      case O.WithinEndTag:
        if (i.skipWhitespace())
          return w(v, U.Whitespace);
        if (i.advanceIfChar(Te))
          return s = O.WithinContent, w(v, U.EndTagClose);
        if (r && i.peekChar() === pt)
          return s = O.WithinContent, w(v, U.EndTagClose, Le("error.closingBracketMissing", "Closing bracket missing."));
        L = Le("error.closingBracketExpected", "Closing bracket expected.");
        break;
      case O.AfterOpeningStartTag:
        return h = g(), f = void 0, d = void 0, h.length > 0 ? (c = !1, s = O.WithinTag, w(v, U.StartTag)) : i.skipWhitespace() ? w(v, U.Whitespace, Le("error.unexpectedWhitespace", "Tag name must directly follow the open bracket.")) : (s = O.WithinTag, i.advanceUntilChar(Te), v < i.pos() ? w(v, U.Unknown, Le("error.startTagNameExpected", "Start tag name expected.")) : k());
      case O.WithinTag:
        return i.skipWhitespace() ? (c = !0, w(v, U.Whitespace)) : c && (d = _(), d.length > 0) ? (s = O.AfterAttributeName, c = !1, w(v, U.AttributeName)) : i.advanceIfChars([Ot, Te]) ? (s = O.WithinContent, w(v, U.StartTagSelfClose)) : i.advanceIfChar(Te) ? (h === "script" ? f && Ks[f] ? s = O.WithinContent : s = O.WithinScriptContent : h === "style" ? s = O.WithinStyleContent : s = O.WithinContent, w(v, U.StartTagClose)) : r && i.peekChar() === pt ? (s = O.WithinContent, w(v, U.StartTagClose, Le("error.closingBracketMissing", "Closing bracket missing."))) : (i.advance(1), w(v, U.Unknown, Le("error.unexpectedCharacterInTag", "Unexpected character in tag.")));
      case O.AfterAttributeName:
        return i.skipWhitespace() ? (c = !0, w(v, U.Whitespace)) : i.advanceIfChar(js) ? (s = O.BeforeAttributeValue, w(v, U.DelimiterAssign)) : (s = O.WithinTag, k());
      case O.BeforeAttributeValue:
        if (i.skipWhitespace())
          return w(v, U.Whitespace);
        var z = i.advanceIfRegExp(/^[^\s"'`=<>]+/);
        if (z.length > 0)
          return i.peekChar() === Te && i.peekChar(-1) === Ot && (i.goBack(1), z = z.substr(0, z.length - 1)), d === "type" && (f = z), s = O.WithinTag, c = !1, w(v, U.AttributeValue);
        var D = i.peekChar();
        return D === $s || D === Gs ? (i.advance(1), i.advanceUntilChar(D) && i.advance(1), d === "type" && (f = i.getSource().substring(v + 1, i.pos() - 1)), s = O.WithinTag, c = !1, w(v, U.AttributeValue)) : (s = O.WithinTag, c = !1, k());
      case O.WithinScriptContent:
        for (var p = 1; !i.eos(); ) {
          var m = i.advanceIfRegExp(/<!--|-->|<\/?script\s*\/?>?/i);
          if (m.length === 0)
            return i.goToEnd(), w(v, U.Script);
          if (m === "<!--")
            p === 1 && (p = 2);
          else if (m === "-->")
            p = 1;
          else if (m[1] !== "/")
            p === 2 && (p = 3);
          else if (p === 3)
            p = 2;
          else {
            i.goBack(m.length);
            break;
          }
        }
        return s = O.WithinContent, v < i.pos() ? w(v, U.Script) : k();
      case O.WithinStyleContent:
        return i.advanceUntilRegExp(/<\/style/i), s = O.WithinContent, v < i.pos() ? w(v, U.Styles) : k();
    }
    return i.advance(1), s = O.WithinContent, w(v, U.Unknown, L);
  }
  return {
    scan: y,
    getTokenType: function() {
      return u;
    },
    getTokenOffset: function() {
      return l;
    },
    getTokenLength: function() {
      return i.pos() - l;
    },
    getTokenEnd: function() {
      return i.pos();
    },
    getTokenText: function() {
      return i.getSource().substring(l, i.pos());
    },
    getScannerState: function() {
      return s;
    },
    getTokenError: function() {
      return o;
    }
  };
}
function bi(e, t) {
  var n = 0, r = e.length;
  if (r === 0)
    return 0;
  for (; n < r; ) {
    var i = Math.floor((n + r) / 2);
    t(e[i]) ? r = i : n = i + 1;
  }
  return n;
}
function eo(e, t, n) {
  for (var r = 0, i = e.length - 1; r <= i; ) {
    var s = (r + i) / 2 | 0, l = n(e[s], t);
    if (l < 0)
      r = s + 1;
    else if (l > 0)
      i = s - 1;
    else
      return s;
  }
  return -(r + 1);
}
var to = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];
function Ut(e) {
  return !!e && eo(to, e.toLowerCase(), function(t, n) {
    return t.localeCompare(n);
  }) >= 0;
}
var wi = function() {
  function e(t, n, r, i) {
    this.start = t, this.end = n, this.children = r, this.parent = i, this.closed = !1;
  }
  return Object.defineProperty(e.prototype, "attributeNames", {
    get: function() {
      return this.attributes ? Object.keys(this.attributes) : [];
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.isSameTag = function(t) {
    return this.tag === void 0 ? t === void 0 : t !== void 0 && this.tag.length === t.length && this.tag.toLowerCase() === t;
  }, Object.defineProperty(e.prototype, "firstChild", {
    get: function() {
      return this.children[0];
    },
    enumerable: !1,
    configurable: !0
  }), Object.defineProperty(e.prototype, "lastChild", {
    get: function() {
      return this.children.length ? this.children[this.children.length - 1] : void 0;
    },
    enumerable: !1,
    configurable: !0
  }), e.prototype.findNodeBefore = function(t) {
    var n = bi(this.children, function(s) {
      return t <= s.start;
    }) - 1;
    if (n >= 0) {
      var r = this.children[n];
      if (t > r.start) {
        if (t < r.end)
          return r.findNodeBefore(t);
        var i = r.lastChild;
        return i && i.end === r.end ? r.findNodeBefore(t) : r;
      }
    }
    return this;
  }, e.prototype.findNodeAt = function(t) {
    var n = bi(this.children, function(i) {
      return t <= i.start;
    }) - 1;
    if (n >= 0) {
      var r = this.children[n];
      if (t > r.start && t <= r.end)
        return r.findNodeAt(t);
    }
    return this;
  }, e;
}();
function Xi(e) {
  for (var t = pe(e, void 0, void 0, !0), n = new wi(0, e.length, [], void 0), r = n, i = -1, s = void 0, l = null, u = t.scan(); u !== U.EOS; ) {
    switch (u) {
      case U.StartTagOpen:
        var o = new wi(t.getTokenOffset(), e.length, [], r);
        r.children.push(o), r = o;
        break;
      case U.StartTag:
        r.tag = t.getTokenText();
        break;
      case U.StartTagClose:
        r.parent && (r.end = t.getTokenEnd(), t.getTokenLength() ? (r.startTagEnd = t.getTokenEnd(), r.tag && Ut(r.tag) && (r.closed = !0, r = r.parent)) : r = r.parent);
        break;
      case U.StartTagSelfClose:
        r.parent && (r.closed = !0, r.end = t.getTokenEnd(), r.startTagEnd = t.getTokenEnd(), r = r.parent);
        break;
      case U.EndTagOpen:
        i = t.getTokenOffset(), s = void 0;
        break;
      case U.EndTag:
        s = t.getTokenText().toLowerCase();
        break;
      case U.EndTagClose:
        for (var c = r; !c.isSameTag(s) && c.parent; )
          c = c.parent;
        if (c.parent) {
          for (; r !== c; )
            r.end = i, r.closed = !1, r = r.parent;
          r.closed = !0, r.endTagStart = i, r.end = t.getTokenEnd(), r = r.parent;
        }
        break;
      case U.AttributeName: {
        l = t.getTokenText();
        var h = r.attributes;
        h || (r.attributes = h = {}), h[l] = null;
        break;
      }
      case U.AttributeValue: {
        var d = t.getTokenText(), h = r.attributes;
        h && l && (h[l] = d, l = null);
        break;
      }
    }
    u = t.scan();
  }
  for (; r.parent; )
    r.end = e.length, r.closed = !1, r = r.parent;
  return {
    roots: n.children,
    findNodeBefore: n.findNodeBefore.bind(n),
    findNodeAt: n.findNodeAt.bind(n)
  };
}
var nt = {
  "Aacute;": "Á",
  Aacute: "Á",
  "aacute;": "á",
  aacute: "á",
  "Abreve;": "Ă",
  "abreve;": "ă",
  "ac;": "∾",
  "acd;": "∿",
  "acE;": "∾̳",
  "Acirc;": "Â",
  Acirc: "Â",
  "acirc;": "â",
  acirc: "â",
  "acute;": "´",
  acute: "´",
  "Acy;": "А",
  "acy;": "а",
  "AElig;": "Æ",
  AElig: "Æ",
  "aelig;": "æ",
  aelig: "æ",
  "af;": "⁡",
  "Afr;": "𝔄",
  "afr;": "𝔞",
  "Agrave;": "À",
  Agrave: "À",
  "agrave;": "à",
  agrave: "à",
  "alefsym;": "ℵ",
  "aleph;": "ℵ",
  "Alpha;": "Α",
  "alpha;": "α",
  "Amacr;": "Ā",
  "amacr;": "ā",
  "amalg;": "⨿",
  "AMP;": "&",
  AMP: "&",
  "amp;": "&",
  amp: "&",
  "And;": "⩓",
  "and;": "∧",
  "andand;": "⩕",
  "andd;": "⩜",
  "andslope;": "⩘",
  "andv;": "⩚",
  "ang;": "∠",
  "ange;": "⦤",
  "angle;": "∠",
  "angmsd;": "∡",
  "angmsdaa;": "⦨",
  "angmsdab;": "⦩",
  "angmsdac;": "⦪",
  "angmsdad;": "⦫",
  "angmsdae;": "⦬",
  "angmsdaf;": "⦭",
  "angmsdag;": "⦮",
  "angmsdah;": "⦯",
  "angrt;": "∟",
  "angrtvb;": "⊾",
  "angrtvbd;": "⦝",
  "angsph;": "∢",
  "angst;": "Å",
  "angzarr;": "⍼",
  "Aogon;": "Ą",
  "aogon;": "ą",
  "Aopf;": "𝔸",
  "aopf;": "𝕒",
  "ap;": "≈",
  "apacir;": "⩯",
  "apE;": "⩰",
  "ape;": "≊",
  "apid;": "≋",
  "apos;": "'",
  "ApplyFunction;": "⁡",
  "approx;": "≈",
  "approxeq;": "≊",
  "Aring;": "Å",
  Aring: "Å",
  "aring;": "å",
  aring: "å",
  "Ascr;": "𝒜",
  "ascr;": "𝒶",
  "Assign;": "≔",
  "ast;": "*",
  "asymp;": "≈",
  "asympeq;": "≍",
  "Atilde;": "Ã",
  Atilde: "Ã",
  "atilde;": "ã",
  atilde: "ã",
  "Auml;": "Ä",
  Auml: "Ä",
  "auml;": "ä",
  auml: "ä",
  "awconint;": "∳",
  "awint;": "⨑",
  "backcong;": "≌",
  "backepsilon;": "϶",
  "backprime;": "‵",
  "backsim;": "∽",
  "backsimeq;": "⋍",
  "Backslash;": "∖",
  "Barv;": "⫧",
  "barvee;": "⊽",
  "Barwed;": "⌆",
  "barwed;": "⌅",
  "barwedge;": "⌅",
  "bbrk;": "⎵",
  "bbrktbrk;": "⎶",
  "bcong;": "≌",
  "Bcy;": "Б",
  "bcy;": "б",
  "bdquo;": "„",
  "becaus;": "∵",
  "Because;": "∵",
  "because;": "∵",
  "bemptyv;": "⦰",
  "bepsi;": "϶",
  "bernou;": "ℬ",
  "Bernoullis;": "ℬ",
  "Beta;": "Β",
  "beta;": "β",
  "beth;": "ℶ",
  "between;": "≬",
  "Bfr;": "𝔅",
  "bfr;": "𝔟",
  "bigcap;": "⋂",
  "bigcirc;": "◯",
  "bigcup;": "⋃",
  "bigodot;": "⨀",
  "bigoplus;": "⨁",
  "bigotimes;": "⨂",
  "bigsqcup;": "⨆",
  "bigstar;": "★",
  "bigtriangledown;": "▽",
  "bigtriangleup;": "△",
  "biguplus;": "⨄",
  "bigvee;": "⋁",
  "bigwedge;": "⋀",
  "bkarow;": "⤍",
  "blacklozenge;": "⧫",
  "blacksquare;": "▪",
  "blacktriangle;": "▴",
  "blacktriangledown;": "▾",
  "blacktriangleleft;": "◂",
  "blacktriangleright;": "▸",
  "blank;": "␣",
  "blk12;": "▒",
  "blk14;": "░",
  "blk34;": "▓",
  "block;": "█",
  "bne;": "=⃥",
  "bnequiv;": "≡⃥",
  "bNot;": "⫭",
  "bnot;": "⌐",
  "Bopf;": "𝔹",
  "bopf;": "𝕓",
  "bot;": "⊥",
  "bottom;": "⊥",
  "bowtie;": "⋈",
  "boxbox;": "⧉",
  "boxDL;": "╗",
  "boxDl;": "╖",
  "boxdL;": "╕",
  "boxdl;": "┐",
  "boxDR;": "╔",
  "boxDr;": "╓",
  "boxdR;": "╒",
  "boxdr;": "┌",
  "boxH;": "═",
  "boxh;": "─",
  "boxHD;": "╦",
  "boxHd;": "╤",
  "boxhD;": "╥",
  "boxhd;": "┬",
  "boxHU;": "╩",
  "boxHu;": "╧",
  "boxhU;": "╨",
  "boxhu;": "┴",
  "boxminus;": "⊟",
  "boxplus;": "⊞",
  "boxtimes;": "⊠",
  "boxUL;": "╝",
  "boxUl;": "╜",
  "boxuL;": "╛",
  "boxul;": "┘",
  "boxUR;": "╚",
  "boxUr;": "╙",
  "boxuR;": "╘",
  "boxur;": "└",
  "boxV;": "║",
  "boxv;": "│",
  "boxVH;": "╬",
  "boxVh;": "╫",
  "boxvH;": "╪",
  "boxvh;": "┼",
  "boxVL;": "╣",
  "boxVl;": "╢",
  "boxvL;": "╡",
  "boxvl;": "┤",
  "boxVR;": "╠",
  "boxVr;": "╟",
  "boxvR;": "╞",
  "boxvr;": "├",
  "bprime;": "‵",
  "Breve;": "˘",
  "breve;": "˘",
  "brvbar;": "¦",
  brvbar: "¦",
  "Bscr;": "ℬ",
  "bscr;": "𝒷",
  "bsemi;": "⁏",
  "bsim;": "∽",
  "bsime;": "⋍",
  "bsol;": "\\",
  "bsolb;": "⧅",
  "bsolhsub;": "⟈",
  "bull;": "•",
  "bullet;": "•",
  "bump;": "≎",
  "bumpE;": "⪮",
  "bumpe;": "≏",
  "Bumpeq;": "≎",
  "bumpeq;": "≏",
  "Cacute;": "Ć",
  "cacute;": "ć",
  "Cap;": "⋒",
  "cap;": "∩",
  "capand;": "⩄",
  "capbrcup;": "⩉",
  "capcap;": "⩋",
  "capcup;": "⩇",
  "capdot;": "⩀",
  "CapitalDifferentialD;": "ⅅ",
  "caps;": "∩︀",
  "caret;": "⁁",
  "caron;": "ˇ",
  "Cayleys;": "ℭ",
  "ccaps;": "⩍",
  "Ccaron;": "Č",
  "ccaron;": "č",
  "Ccedil;": "Ç",
  Ccedil: "Ç",
  "ccedil;": "ç",
  ccedil: "ç",
  "Ccirc;": "Ĉ",
  "ccirc;": "ĉ",
  "Cconint;": "∰",
  "ccups;": "⩌",
  "ccupssm;": "⩐",
  "Cdot;": "Ċ",
  "cdot;": "ċ",
  "cedil;": "¸",
  cedil: "¸",
  "Cedilla;": "¸",
  "cemptyv;": "⦲",
  "cent;": "¢",
  cent: "¢",
  "CenterDot;": "·",
  "centerdot;": "·",
  "Cfr;": "ℭ",
  "cfr;": "𝔠",
  "CHcy;": "Ч",
  "chcy;": "ч",
  "check;": "✓",
  "checkmark;": "✓",
  "Chi;": "Χ",
  "chi;": "χ",
  "cir;": "○",
  "circ;": "ˆ",
  "circeq;": "≗",
  "circlearrowleft;": "↺",
  "circlearrowright;": "↻",
  "circledast;": "⊛",
  "circledcirc;": "⊚",
  "circleddash;": "⊝",
  "CircleDot;": "⊙",
  "circledR;": "®",
  "circledS;": "Ⓢ",
  "CircleMinus;": "⊖",
  "CirclePlus;": "⊕",
  "CircleTimes;": "⊗",
  "cirE;": "⧃",
  "cire;": "≗",
  "cirfnint;": "⨐",
  "cirmid;": "⫯",
  "cirscir;": "⧂",
  "ClockwiseContourIntegral;": "∲",
  "CloseCurlyDoubleQuote;": "”",
  "CloseCurlyQuote;": "’",
  "clubs;": "♣",
  "clubsuit;": "♣",
  "Colon;": "∷",
  "colon;": ":",
  "Colone;": "⩴",
  "colone;": "≔",
  "coloneq;": "≔",
  "comma;": ",",
  "commat;": "@",
  "comp;": "∁",
  "compfn;": "∘",
  "complement;": "∁",
  "complexes;": "ℂ",
  "cong;": "≅",
  "congdot;": "⩭",
  "Congruent;": "≡",
  "Conint;": "∯",
  "conint;": "∮",
  "ContourIntegral;": "∮",
  "Copf;": "ℂ",
  "copf;": "𝕔",
  "coprod;": "∐",
  "Coproduct;": "∐",
  "COPY;": "©",
  COPY: "©",
  "copy;": "©",
  copy: "©",
  "copysr;": "℗",
  "CounterClockwiseContourIntegral;": "∳",
  "crarr;": "↵",
  "Cross;": "⨯",
  "cross;": "✗",
  "Cscr;": "𝒞",
  "cscr;": "𝒸",
  "csub;": "⫏",
  "csube;": "⫑",
  "csup;": "⫐",
  "csupe;": "⫒",
  "ctdot;": "⋯",
  "cudarrl;": "⤸",
  "cudarrr;": "⤵",
  "cuepr;": "⋞",
  "cuesc;": "⋟",
  "cularr;": "↶",
  "cularrp;": "⤽",
  "Cup;": "⋓",
  "cup;": "∪",
  "cupbrcap;": "⩈",
  "CupCap;": "≍",
  "cupcap;": "⩆",
  "cupcup;": "⩊",
  "cupdot;": "⊍",
  "cupor;": "⩅",
  "cups;": "∪︀",
  "curarr;": "↷",
  "curarrm;": "⤼",
  "curlyeqprec;": "⋞",
  "curlyeqsucc;": "⋟",
  "curlyvee;": "⋎",
  "curlywedge;": "⋏",
  "curren;": "¤",
  curren: "¤",
  "curvearrowleft;": "↶",
  "curvearrowright;": "↷",
  "cuvee;": "⋎",
  "cuwed;": "⋏",
  "cwconint;": "∲",
  "cwint;": "∱",
  "cylcty;": "⌭",
  "Dagger;": "‡",
  "dagger;": "†",
  "daleth;": "ℸ",
  "Darr;": "↡",
  "dArr;": "⇓",
  "darr;": "↓",
  "dash;": "‐",
  "Dashv;": "⫤",
  "dashv;": "⊣",
  "dbkarow;": "⤏",
  "dblac;": "˝",
  "Dcaron;": "Ď",
  "dcaron;": "ď",
  "Dcy;": "Д",
  "dcy;": "д",
  "DD;": "ⅅ",
  "dd;": "ⅆ",
  "ddagger;": "‡",
  "ddarr;": "⇊",
  "DDotrahd;": "⤑",
  "ddotseq;": "⩷",
  "deg;": "°",
  deg: "°",
  "Del;": "∇",
  "Delta;": "Δ",
  "delta;": "δ",
  "demptyv;": "⦱",
  "dfisht;": "⥿",
  "Dfr;": "𝔇",
  "dfr;": "𝔡",
  "dHar;": "⥥",
  "dharl;": "⇃",
  "dharr;": "⇂",
  "DiacriticalAcute;": "´",
  "DiacriticalDot;": "˙",
  "DiacriticalDoubleAcute;": "˝",
  "DiacriticalGrave;": "`",
  "DiacriticalTilde;": "˜",
  "diam;": "⋄",
  "Diamond;": "⋄",
  "diamond;": "⋄",
  "diamondsuit;": "♦",
  "diams;": "♦",
  "die;": "¨",
  "DifferentialD;": "ⅆ",
  "digamma;": "ϝ",
  "disin;": "⋲",
  "div;": "÷",
  "divide;": "÷",
  divide: "÷",
  "divideontimes;": "⋇",
  "divonx;": "⋇",
  "DJcy;": "Ђ",
  "djcy;": "ђ",
  "dlcorn;": "⌞",
  "dlcrop;": "⌍",
  "dollar;": "$",
  "Dopf;": "𝔻",
  "dopf;": "𝕕",
  "Dot;": "¨",
  "dot;": "˙",
  "DotDot;": "⃜",
  "doteq;": "≐",
  "doteqdot;": "≑",
  "DotEqual;": "≐",
  "dotminus;": "∸",
  "dotplus;": "∔",
  "dotsquare;": "⊡",
  "doublebarwedge;": "⌆",
  "DoubleContourIntegral;": "∯",
  "DoubleDot;": "¨",
  "DoubleDownArrow;": "⇓",
  "DoubleLeftArrow;": "⇐",
  "DoubleLeftRightArrow;": "⇔",
  "DoubleLeftTee;": "⫤",
  "DoubleLongLeftArrow;": "⟸",
  "DoubleLongLeftRightArrow;": "⟺",
  "DoubleLongRightArrow;": "⟹",
  "DoubleRightArrow;": "⇒",
  "DoubleRightTee;": "⊨",
  "DoubleUpArrow;": "⇑",
  "DoubleUpDownArrow;": "⇕",
  "DoubleVerticalBar;": "∥",
  "DownArrow;": "↓",
  "Downarrow;": "⇓",
  "downarrow;": "↓",
  "DownArrowBar;": "⤓",
  "DownArrowUpArrow;": "⇵",
  "DownBreve;": "̑",
  "downdownarrows;": "⇊",
  "downharpoonleft;": "⇃",
  "downharpoonright;": "⇂",
  "DownLeftRightVector;": "⥐",
  "DownLeftTeeVector;": "⥞",
  "DownLeftVector;": "↽",
  "DownLeftVectorBar;": "⥖",
  "DownRightTeeVector;": "⥟",
  "DownRightVector;": "⇁",
  "DownRightVectorBar;": "⥗",
  "DownTee;": "⊤",
  "DownTeeArrow;": "↧",
  "drbkarow;": "⤐",
  "drcorn;": "⌟",
  "drcrop;": "⌌",
  "Dscr;": "𝒟",
  "dscr;": "𝒹",
  "DScy;": "Ѕ",
  "dscy;": "ѕ",
  "dsol;": "⧶",
  "Dstrok;": "Đ",
  "dstrok;": "đ",
  "dtdot;": "⋱",
  "dtri;": "▿",
  "dtrif;": "▾",
  "duarr;": "⇵",
  "duhar;": "⥯",
  "dwangle;": "⦦",
  "DZcy;": "Џ",
  "dzcy;": "џ",
  "dzigrarr;": "⟿",
  "Eacute;": "É",
  Eacute: "É",
  "eacute;": "é",
  eacute: "é",
  "easter;": "⩮",
  "Ecaron;": "Ě",
  "ecaron;": "ě",
  "ecir;": "≖",
  "Ecirc;": "Ê",
  Ecirc: "Ê",
  "ecirc;": "ê",
  ecirc: "ê",
  "ecolon;": "≕",
  "Ecy;": "Э",
  "ecy;": "э",
  "eDDot;": "⩷",
  "Edot;": "Ė",
  "eDot;": "≑",
  "edot;": "ė",
  "ee;": "ⅇ",
  "efDot;": "≒",
  "Efr;": "𝔈",
  "efr;": "𝔢",
  "eg;": "⪚",
  "Egrave;": "È",
  Egrave: "È",
  "egrave;": "è",
  egrave: "è",
  "egs;": "⪖",
  "egsdot;": "⪘",
  "el;": "⪙",
  "Element;": "∈",
  "elinters;": "⏧",
  "ell;": "ℓ",
  "els;": "⪕",
  "elsdot;": "⪗",
  "Emacr;": "Ē",
  "emacr;": "ē",
  "empty;": "∅",
  "emptyset;": "∅",
  "EmptySmallSquare;": "◻",
  "emptyv;": "∅",
  "EmptyVerySmallSquare;": "▫",
  "emsp;": " ",
  "emsp13;": " ",
  "emsp14;": " ",
  "ENG;": "Ŋ",
  "eng;": "ŋ",
  "ensp;": " ",
  "Eogon;": "Ę",
  "eogon;": "ę",
  "Eopf;": "𝔼",
  "eopf;": "𝕖",
  "epar;": "⋕",
  "eparsl;": "⧣",
  "eplus;": "⩱",
  "epsi;": "ε",
  "Epsilon;": "Ε",
  "epsilon;": "ε",
  "epsiv;": "ϵ",
  "eqcirc;": "≖",
  "eqcolon;": "≕",
  "eqsim;": "≂",
  "eqslantgtr;": "⪖",
  "eqslantless;": "⪕",
  "Equal;": "⩵",
  "equals;": "=",
  "EqualTilde;": "≂",
  "equest;": "≟",
  "Equilibrium;": "⇌",
  "equiv;": "≡",
  "equivDD;": "⩸",
  "eqvparsl;": "⧥",
  "erarr;": "⥱",
  "erDot;": "≓",
  "Escr;": "ℰ",
  "escr;": "ℯ",
  "esdot;": "≐",
  "Esim;": "⩳",
  "esim;": "≂",
  "Eta;": "Η",
  "eta;": "η",
  "ETH;": "Ð",
  ETH: "Ð",
  "eth;": "ð",
  eth: "ð",
  "Euml;": "Ë",
  Euml: "Ë",
  "euml;": "ë",
  euml: "ë",
  "euro;": "€",
  "excl;": "!",
  "exist;": "∃",
  "Exists;": "∃",
  "expectation;": "ℰ",
  "ExponentialE;": "ⅇ",
  "exponentiale;": "ⅇ",
  "fallingdotseq;": "≒",
  "Fcy;": "Ф",
  "fcy;": "ф",
  "female;": "♀",
  "ffilig;": "ﬃ",
  "fflig;": "ﬀ",
  "ffllig;": "ﬄ",
  "Ffr;": "𝔉",
  "ffr;": "𝔣",
  "filig;": "ﬁ",
  "FilledSmallSquare;": "◼",
  "FilledVerySmallSquare;": "▪",
  "fjlig;": "fj",
  "flat;": "♭",
  "fllig;": "ﬂ",
  "fltns;": "▱",
  "fnof;": "ƒ",
  "Fopf;": "𝔽",
  "fopf;": "𝕗",
  "ForAll;": "∀",
  "forall;": "∀",
  "fork;": "⋔",
  "forkv;": "⫙",
  "Fouriertrf;": "ℱ",
  "fpartint;": "⨍",
  "frac12;": "½",
  frac12: "½",
  "frac13;": "⅓",
  "frac14;": "¼",
  frac14: "¼",
  "frac15;": "⅕",
  "frac16;": "⅙",
  "frac18;": "⅛",
  "frac23;": "⅔",
  "frac25;": "⅖",
  "frac34;": "¾",
  frac34: "¾",
  "frac35;": "⅗",
  "frac38;": "⅜",
  "frac45;": "⅘",
  "frac56;": "⅚",
  "frac58;": "⅝",
  "frac78;": "⅞",
  "frasl;": "⁄",
  "frown;": "⌢",
  "Fscr;": "ℱ",
  "fscr;": "𝒻",
  "gacute;": "ǵ",
  "Gamma;": "Γ",
  "gamma;": "γ",
  "Gammad;": "Ϝ",
  "gammad;": "ϝ",
  "gap;": "⪆",
  "Gbreve;": "Ğ",
  "gbreve;": "ğ",
  "Gcedil;": "Ģ",
  "Gcirc;": "Ĝ",
  "gcirc;": "ĝ",
  "Gcy;": "Г",
  "gcy;": "г",
  "Gdot;": "Ġ",
  "gdot;": "ġ",
  "gE;": "≧",
  "ge;": "≥",
  "gEl;": "⪌",
  "gel;": "⋛",
  "geq;": "≥",
  "geqq;": "≧",
  "geqslant;": "⩾",
  "ges;": "⩾",
  "gescc;": "⪩",
  "gesdot;": "⪀",
  "gesdoto;": "⪂",
  "gesdotol;": "⪄",
  "gesl;": "⋛︀",
  "gesles;": "⪔",
  "Gfr;": "𝔊",
  "gfr;": "𝔤",
  "Gg;": "⋙",
  "gg;": "≫",
  "ggg;": "⋙",
  "gimel;": "ℷ",
  "GJcy;": "Ѓ",
  "gjcy;": "ѓ",
  "gl;": "≷",
  "gla;": "⪥",
  "glE;": "⪒",
  "glj;": "⪤",
  "gnap;": "⪊",
  "gnapprox;": "⪊",
  "gnE;": "≩",
  "gne;": "⪈",
  "gneq;": "⪈",
  "gneqq;": "≩",
  "gnsim;": "⋧",
  "Gopf;": "𝔾",
  "gopf;": "𝕘",
  "grave;": "`",
  "GreaterEqual;": "≥",
  "GreaterEqualLess;": "⋛",
  "GreaterFullEqual;": "≧",
  "GreaterGreater;": "⪢",
  "GreaterLess;": "≷",
  "GreaterSlantEqual;": "⩾",
  "GreaterTilde;": "≳",
  "Gscr;": "𝒢",
  "gscr;": "ℊ",
  "gsim;": "≳",
  "gsime;": "⪎",
  "gsiml;": "⪐",
  "GT;": ">",
  GT: ">",
  "Gt;": "≫",
  "gt;": ">",
  gt: ">",
  "gtcc;": "⪧",
  "gtcir;": "⩺",
  "gtdot;": "⋗",
  "gtlPar;": "⦕",
  "gtquest;": "⩼",
  "gtrapprox;": "⪆",
  "gtrarr;": "⥸",
  "gtrdot;": "⋗",
  "gtreqless;": "⋛",
  "gtreqqless;": "⪌",
  "gtrless;": "≷",
  "gtrsim;": "≳",
  "gvertneqq;": "≩︀",
  "gvnE;": "≩︀",
  "Hacek;": "ˇ",
  "hairsp;": " ",
  "half;": "½",
  "hamilt;": "ℋ",
  "HARDcy;": "Ъ",
  "hardcy;": "ъ",
  "hArr;": "⇔",
  "harr;": "↔",
  "harrcir;": "⥈",
  "harrw;": "↭",
  "Hat;": "^",
  "hbar;": "ℏ",
  "Hcirc;": "Ĥ",
  "hcirc;": "ĥ",
  "hearts;": "♥",
  "heartsuit;": "♥",
  "hellip;": "…",
  "hercon;": "⊹",
  "Hfr;": "ℌ",
  "hfr;": "𝔥",
  "HilbertSpace;": "ℋ",
  "hksearow;": "⤥",
  "hkswarow;": "⤦",
  "hoarr;": "⇿",
  "homtht;": "∻",
  "hookleftarrow;": "↩",
  "hookrightarrow;": "↪",
  "Hopf;": "ℍ",
  "hopf;": "𝕙",
  "horbar;": "―",
  "HorizontalLine;": "─",
  "Hscr;": "ℋ",
  "hscr;": "𝒽",
  "hslash;": "ℏ",
  "Hstrok;": "Ħ",
  "hstrok;": "ħ",
  "HumpDownHump;": "≎",
  "HumpEqual;": "≏",
  "hybull;": "⁃",
  "hyphen;": "‐",
  "Iacute;": "Í",
  Iacute: "Í",
  "iacute;": "í",
  iacute: "í",
  "ic;": "⁣",
  "Icirc;": "Î",
  Icirc: "Î",
  "icirc;": "î",
  icirc: "î",
  "Icy;": "И",
  "icy;": "и",
  "Idot;": "İ",
  "IEcy;": "Е",
  "iecy;": "е",
  "iexcl;": "¡",
  iexcl: "¡",
  "iff;": "⇔",
  "Ifr;": "ℑ",
  "ifr;": "𝔦",
  "Igrave;": "Ì",
  Igrave: "Ì",
  "igrave;": "ì",
  igrave: "ì",
  "ii;": "ⅈ",
  "iiiint;": "⨌",
  "iiint;": "∭",
  "iinfin;": "⧜",
  "iiota;": "℩",
  "IJlig;": "Ĳ",
  "ijlig;": "ĳ",
  "Im;": "ℑ",
  "Imacr;": "Ī",
  "imacr;": "ī",
  "image;": "ℑ",
  "ImaginaryI;": "ⅈ",
  "imagline;": "ℐ",
  "imagpart;": "ℑ",
  "imath;": "ı",
  "imof;": "⊷",
  "imped;": "Ƶ",
  "Implies;": "⇒",
  "in;": "∈",
  "incare;": "℅",
  "infin;": "∞",
  "infintie;": "⧝",
  "inodot;": "ı",
  "Int;": "∬",
  "int;": "∫",
  "intcal;": "⊺",
  "integers;": "ℤ",
  "Integral;": "∫",
  "intercal;": "⊺",
  "Intersection;": "⋂",
  "intlarhk;": "⨗",
  "intprod;": "⨼",
  "InvisibleComma;": "⁣",
  "InvisibleTimes;": "⁢",
  "IOcy;": "Ё",
  "iocy;": "ё",
  "Iogon;": "Į",
  "iogon;": "į",
  "Iopf;": "𝕀",
  "iopf;": "𝕚",
  "Iota;": "Ι",
  "iota;": "ι",
  "iprod;": "⨼",
  "iquest;": "¿",
  iquest: "¿",
  "Iscr;": "ℐ",
  "iscr;": "𝒾",
  "isin;": "∈",
  "isindot;": "⋵",
  "isinE;": "⋹",
  "isins;": "⋴",
  "isinsv;": "⋳",
  "isinv;": "∈",
  "it;": "⁢",
  "Itilde;": "Ĩ",
  "itilde;": "ĩ",
  "Iukcy;": "І",
  "iukcy;": "і",
  "Iuml;": "Ï",
  Iuml: "Ï",
  "iuml;": "ï",
  iuml: "ï",
  "Jcirc;": "Ĵ",
  "jcirc;": "ĵ",
  "Jcy;": "Й",
  "jcy;": "й",
  "Jfr;": "𝔍",
  "jfr;": "𝔧",
  "jmath;": "ȷ",
  "Jopf;": "𝕁",
  "jopf;": "𝕛",
  "Jscr;": "𝒥",
  "jscr;": "𝒿",
  "Jsercy;": "Ј",
  "jsercy;": "ј",
  "Jukcy;": "Є",
  "jukcy;": "є",
  "Kappa;": "Κ",
  "kappa;": "κ",
  "kappav;": "ϰ",
  "Kcedil;": "Ķ",
  "kcedil;": "ķ",
  "Kcy;": "К",
  "kcy;": "к",
  "Kfr;": "𝔎",
  "kfr;": "𝔨",
  "kgreen;": "ĸ",
  "KHcy;": "Х",
  "khcy;": "х",
  "KJcy;": "Ќ",
  "kjcy;": "ќ",
  "Kopf;": "𝕂",
  "kopf;": "𝕜",
  "Kscr;": "𝒦",
  "kscr;": "𝓀",
  "lAarr;": "⇚",
  "Lacute;": "Ĺ",
  "lacute;": "ĺ",
  "laemptyv;": "⦴",
  "lagran;": "ℒ",
  "Lambda;": "Λ",
  "lambda;": "λ",
  "Lang;": "⟪",
  "lang;": "⟨",
  "langd;": "⦑",
  "langle;": "⟨",
  "lap;": "⪅",
  "Laplacetrf;": "ℒ",
  "laquo;": "«",
  laquo: "«",
  "Larr;": "↞",
  "lArr;": "⇐",
  "larr;": "←",
  "larrb;": "⇤",
  "larrbfs;": "⤟",
  "larrfs;": "⤝",
  "larrhk;": "↩",
  "larrlp;": "↫",
  "larrpl;": "⤹",
  "larrsim;": "⥳",
  "larrtl;": "↢",
  "lat;": "⪫",
  "lAtail;": "⤛",
  "latail;": "⤙",
  "late;": "⪭",
  "lates;": "⪭︀",
  "lBarr;": "⤎",
  "lbarr;": "⤌",
  "lbbrk;": "❲",
  "lbrace;": "{",
  "lbrack;": "[",
  "lbrke;": "⦋",
  "lbrksld;": "⦏",
  "lbrkslu;": "⦍",
  "Lcaron;": "Ľ",
  "lcaron;": "ľ",
  "Lcedil;": "Ļ",
  "lcedil;": "ļ",
  "lceil;": "⌈",
  "lcub;": "{",
  "Lcy;": "Л",
  "lcy;": "л",
  "ldca;": "⤶",
  "ldquo;": "“",
  "ldquor;": "„",
  "ldrdhar;": "⥧",
  "ldrushar;": "⥋",
  "ldsh;": "↲",
  "lE;": "≦",
  "le;": "≤",
  "LeftAngleBracket;": "⟨",
  "LeftArrow;": "←",
  "Leftarrow;": "⇐",
  "leftarrow;": "←",
  "LeftArrowBar;": "⇤",
  "LeftArrowRightArrow;": "⇆",
  "leftarrowtail;": "↢",
  "LeftCeiling;": "⌈",
  "LeftDoubleBracket;": "⟦",
  "LeftDownTeeVector;": "⥡",
  "LeftDownVector;": "⇃",
  "LeftDownVectorBar;": "⥙",
  "LeftFloor;": "⌊",
  "leftharpoondown;": "↽",
  "leftharpoonup;": "↼",
  "leftleftarrows;": "⇇",
  "LeftRightArrow;": "↔",
  "Leftrightarrow;": "⇔",
  "leftrightarrow;": "↔",
  "leftrightarrows;": "⇆",
  "leftrightharpoons;": "⇋",
  "leftrightsquigarrow;": "↭",
  "LeftRightVector;": "⥎",
  "LeftTee;": "⊣",
  "LeftTeeArrow;": "↤",
  "LeftTeeVector;": "⥚",
  "leftthreetimes;": "⋋",
  "LeftTriangle;": "⊲",
  "LeftTriangleBar;": "⧏",
  "LeftTriangleEqual;": "⊴",
  "LeftUpDownVector;": "⥑",
  "LeftUpTeeVector;": "⥠",
  "LeftUpVector;": "↿",
  "LeftUpVectorBar;": "⥘",
  "LeftVector;": "↼",
  "LeftVectorBar;": "⥒",
  "lEg;": "⪋",
  "leg;": "⋚",
  "leq;": "≤",
  "leqq;": "≦",
  "leqslant;": "⩽",
  "les;": "⩽",
  "lescc;": "⪨",
  "lesdot;": "⩿",
  "lesdoto;": "⪁",
  "lesdotor;": "⪃",
  "lesg;": "⋚︀",
  "lesges;": "⪓",
  "lessapprox;": "⪅",
  "lessdot;": "⋖",
  "lesseqgtr;": "⋚",
  "lesseqqgtr;": "⪋",
  "LessEqualGreater;": "⋚",
  "LessFullEqual;": "≦",
  "LessGreater;": "≶",
  "lessgtr;": "≶",
  "LessLess;": "⪡",
  "lesssim;": "≲",
  "LessSlantEqual;": "⩽",
  "LessTilde;": "≲",
  "lfisht;": "⥼",
  "lfloor;": "⌊",
  "Lfr;": "𝔏",
  "lfr;": "𝔩",
  "lg;": "≶",
  "lgE;": "⪑",
  "lHar;": "⥢",
  "lhard;": "↽",
  "lharu;": "↼",
  "lharul;": "⥪",
  "lhblk;": "▄",
  "LJcy;": "Љ",
  "ljcy;": "љ",
  "Ll;": "⋘",
  "ll;": "≪",
  "llarr;": "⇇",
  "llcorner;": "⌞",
  "Lleftarrow;": "⇚",
  "llhard;": "⥫",
  "lltri;": "◺",
  "Lmidot;": "Ŀ",
  "lmidot;": "ŀ",
  "lmoust;": "⎰",
  "lmoustache;": "⎰",
  "lnap;": "⪉",
  "lnapprox;": "⪉",
  "lnE;": "≨",
  "lne;": "⪇",
  "lneq;": "⪇",
  "lneqq;": "≨",
  "lnsim;": "⋦",
  "loang;": "⟬",
  "loarr;": "⇽",
  "lobrk;": "⟦",
  "LongLeftArrow;": "⟵",
  "Longleftarrow;": "⟸",
  "longleftarrow;": "⟵",
  "LongLeftRightArrow;": "⟷",
  "Longleftrightarrow;": "⟺",
  "longleftrightarrow;": "⟷",
  "longmapsto;": "⟼",
  "LongRightArrow;": "⟶",
  "Longrightarrow;": "⟹",
  "longrightarrow;": "⟶",
  "looparrowleft;": "↫",
  "looparrowright;": "↬",
  "lopar;": "⦅",
  "Lopf;": "𝕃",
  "lopf;": "𝕝",
  "loplus;": "⨭",
  "lotimes;": "⨴",
  "lowast;": "∗",
  "lowbar;": "_",
  "LowerLeftArrow;": "↙",
  "LowerRightArrow;": "↘",
  "loz;": "◊",
  "lozenge;": "◊",
  "lozf;": "⧫",
  "lpar;": "(",
  "lparlt;": "⦓",
  "lrarr;": "⇆",
  "lrcorner;": "⌟",
  "lrhar;": "⇋",
  "lrhard;": "⥭",
  "lrm;": "‎",
  "lrtri;": "⊿",
  "lsaquo;": "‹",
  "Lscr;": "ℒ",
  "lscr;": "𝓁",
  "Lsh;": "↰",
  "lsh;": "↰",
  "lsim;": "≲",
  "lsime;": "⪍",
  "lsimg;": "⪏",
  "lsqb;": "[",
  "lsquo;": "‘",
  "lsquor;": "‚",
  "Lstrok;": "Ł",
  "lstrok;": "ł",
  "LT;": "<",
  LT: "<",
  "Lt;": "≪",
  "lt;": "<",
  lt: "<",
  "ltcc;": "⪦",
  "ltcir;": "⩹",
  "ltdot;": "⋖",
  "lthree;": "⋋",
  "ltimes;": "⋉",
  "ltlarr;": "⥶",
  "ltquest;": "⩻",
  "ltri;": "◃",
  "ltrie;": "⊴",
  "ltrif;": "◂",
  "ltrPar;": "⦖",
  "lurdshar;": "⥊",
  "luruhar;": "⥦",
  "lvertneqq;": "≨︀",
  "lvnE;": "≨︀",
  "macr;": "¯",
  macr: "¯",
  "male;": "♂",
  "malt;": "✠",
  "maltese;": "✠",
  "Map;": "⤅",
  "map;": "↦",
  "mapsto;": "↦",
  "mapstodown;": "↧",
  "mapstoleft;": "↤",
  "mapstoup;": "↥",
  "marker;": "▮",
  "mcomma;": "⨩",
  "Mcy;": "М",
  "mcy;": "м",
  "mdash;": "—",
  "mDDot;": "∺",
  "measuredangle;": "∡",
  "MediumSpace;": " ",
  "Mellintrf;": "ℳ",
  "Mfr;": "𝔐",
  "mfr;": "𝔪",
  "mho;": "℧",
  "micro;": "µ",
  micro: "µ",
  "mid;": "∣",
  "midast;": "*",
  "midcir;": "⫰",
  "middot;": "·",
  middot: "·",
  "minus;": "−",
  "minusb;": "⊟",
  "minusd;": "∸",
  "minusdu;": "⨪",
  "MinusPlus;": "∓",
  "mlcp;": "⫛",
  "mldr;": "…",
  "mnplus;": "∓",
  "models;": "⊧",
  "Mopf;": "𝕄",
  "mopf;": "𝕞",
  "mp;": "∓",
  "Mscr;": "ℳ",
  "mscr;": "𝓂",
  "mstpos;": "∾",
  "Mu;": "Μ",
  "mu;": "μ",
  "multimap;": "⊸",
  "mumap;": "⊸",
  "nabla;": "∇",
  "Nacute;": "Ń",
  "nacute;": "ń",
  "nang;": "∠⃒",
  "nap;": "≉",
  "napE;": "⩰̸",
  "napid;": "≋̸",
  "napos;": "ŉ",
  "napprox;": "≉",
  "natur;": "♮",
  "natural;": "♮",
  "naturals;": "ℕ",
  "nbsp;": " ",
  nbsp: " ",
  "nbump;": "≎̸",
  "nbumpe;": "≏̸",
  "ncap;": "⩃",
  "Ncaron;": "Ň",
  "ncaron;": "ň",
  "Ncedil;": "Ņ",
  "ncedil;": "ņ",
  "ncong;": "≇",
  "ncongdot;": "⩭̸",
  "ncup;": "⩂",
  "Ncy;": "Н",
  "ncy;": "н",
  "ndash;": "–",
  "ne;": "≠",
  "nearhk;": "⤤",
  "neArr;": "⇗",
  "nearr;": "↗",
  "nearrow;": "↗",
  "nedot;": "≐̸",
  "NegativeMediumSpace;": "​",
  "NegativeThickSpace;": "​",
  "NegativeThinSpace;": "​",
  "NegativeVeryThinSpace;": "​",
  "nequiv;": "≢",
  "nesear;": "⤨",
  "nesim;": "≂̸",
  "NestedGreaterGreater;": "≫",
  "NestedLessLess;": "≪",
  "NewLine;": `
`,
  "nexist;": "∄",
  "nexists;": "∄",
  "Nfr;": "𝔑",
  "nfr;": "𝔫",
  "ngE;": "≧̸",
  "nge;": "≱",
  "ngeq;": "≱",
  "ngeqq;": "≧̸",
  "ngeqslant;": "⩾̸",
  "nges;": "⩾̸",
  "nGg;": "⋙̸",
  "ngsim;": "≵",
  "nGt;": "≫⃒",
  "ngt;": "≯",
  "ngtr;": "≯",
  "nGtv;": "≫̸",
  "nhArr;": "⇎",
  "nharr;": "↮",
  "nhpar;": "⫲",
  "ni;": "∋",
  "nis;": "⋼",
  "nisd;": "⋺",
  "niv;": "∋",
  "NJcy;": "Њ",
  "njcy;": "њ",
  "nlArr;": "⇍",
  "nlarr;": "↚",
  "nldr;": "‥",
  "nlE;": "≦̸",
  "nle;": "≰",
  "nLeftarrow;": "⇍",
  "nleftarrow;": "↚",
  "nLeftrightarrow;": "⇎",
  "nleftrightarrow;": "↮",
  "nleq;": "≰",
  "nleqq;": "≦̸",
  "nleqslant;": "⩽̸",
  "nles;": "⩽̸",
  "nless;": "≮",
  "nLl;": "⋘̸",
  "nlsim;": "≴",
  "nLt;": "≪⃒",
  "nlt;": "≮",
  "nltri;": "⋪",
  "nltrie;": "⋬",
  "nLtv;": "≪̸",
  "nmid;": "∤",
  "NoBreak;": "⁠",
  "NonBreakingSpace;": " ",
  "Nopf;": "ℕ",
  "nopf;": "𝕟",
  "Not;": "⫬",
  "not;": "¬",
  not: "¬",
  "NotCongruent;": "≢",
  "NotCupCap;": "≭",
  "NotDoubleVerticalBar;": "∦",
  "NotElement;": "∉",
  "NotEqual;": "≠",
  "NotEqualTilde;": "≂̸",
  "NotExists;": "∄",
  "NotGreater;": "≯",
  "NotGreaterEqual;": "≱",
  "NotGreaterFullEqual;": "≧̸",
  "NotGreaterGreater;": "≫̸",
  "NotGreaterLess;": "≹",
  "NotGreaterSlantEqual;": "⩾̸",
  "NotGreaterTilde;": "≵",
  "NotHumpDownHump;": "≎̸",
  "NotHumpEqual;": "≏̸",
  "notin;": "∉",
  "notindot;": "⋵̸",
  "notinE;": "⋹̸",
  "notinva;": "∉",
  "notinvb;": "⋷",
  "notinvc;": "⋶",
  "NotLeftTriangle;": "⋪",
  "NotLeftTriangleBar;": "⧏̸",
  "NotLeftTriangleEqual;": "⋬",
  "NotLess;": "≮",
  "NotLessEqual;": "≰",
  "NotLessGreater;": "≸",
  "NotLessLess;": "≪̸",
  "NotLessSlantEqual;": "⩽̸",
  "NotLessTilde;": "≴",
  "NotNestedGreaterGreater;": "⪢̸",
  "NotNestedLessLess;": "⪡̸",
  "notni;": "∌",
  "notniva;": "∌",
  "notnivb;": "⋾",
  "notnivc;": "⋽",
  "NotPrecedes;": "⊀",
  "NotPrecedesEqual;": "⪯̸",
  "NotPrecedesSlantEqual;": "⋠",
  "NotReverseElement;": "∌",
  "NotRightTriangle;": "⋫",
  "NotRightTriangleBar;": "⧐̸",
  "NotRightTriangleEqual;": "⋭",
  "NotSquareSubset;": "⊏̸",
  "NotSquareSubsetEqual;": "⋢",
  "NotSquareSuperset;": "⊐̸",
  "NotSquareSupersetEqual;": "⋣",
  "NotSubset;": "⊂⃒",
  "NotSubsetEqual;": "⊈",
  "NotSucceeds;": "⊁",
  "NotSucceedsEqual;": "⪰̸",
  "NotSucceedsSlantEqual;": "⋡",
  "NotSucceedsTilde;": "≿̸",
  "NotSuperset;": "⊃⃒",
  "NotSupersetEqual;": "⊉",
  "NotTilde;": "≁",
  "NotTildeEqual;": "≄",
  "NotTildeFullEqual;": "≇",
  "NotTildeTilde;": "≉",
  "NotVerticalBar;": "∤",
  "npar;": "∦",
  "nparallel;": "∦",
  "nparsl;": "⫽⃥",
  "npart;": "∂̸",
  "npolint;": "⨔",
  "npr;": "⊀",
  "nprcue;": "⋠",
  "npre;": "⪯̸",
  "nprec;": "⊀",
  "npreceq;": "⪯̸",
  "nrArr;": "⇏",
  "nrarr;": "↛",
  "nrarrc;": "⤳̸",
  "nrarrw;": "↝̸",
  "nRightarrow;": "⇏",
  "nrightarrow;": "↛",
  "nrtri;": "⋫",
  "nrtrie;": "⋭",
  "nsc;": "⊁",
  "nsccue;": "⋡",
  "nsce;": "⪰̸",
  "Nscr;": "𝒩",
  "nscr;": "𝓃",
  "nshortmid;": "∤",
  "nshortparallel;": "∦",
  "nsim;": "≁",
  "nsime;": "≄",
  "nsimeq;": "≄",
  "nsmid;": "∤",
  "nspar;": "∦",
  "nsqsube;": "⋢",
  "nsqsupe;": "⋣",
  "nsub;": "⊄",
  "nsubE;": "⫅̸",
  "nsube;": "⊈",
  "nsubset;": "⊂⃒",
  "nsubseteq;": "⊈",
  "nsubseteqq;": "⫅̸",
  "nsucc;": "⊁",
  "nsucceq;": "⪰̸",
  "nsup;": "⊅",
  "nsupE;": "⫆̸",
  "nsupe;": "⊉",
  "nsupset;": "⊃⃒",
  "nsupseteq;": "⊉",
  "nsupseteqq;": "⫆̸",
  "ntgl;": "≹",
  "Ntilde;": "Ñ",
  Ntilde: "Ñ",
  "ntilde;": "ñ",
  ntilde: "ñ",
  "ntlg;": "≸",
  "ntriangleleft;": "⋪",
  "ntrianglelefteq;": "⋬",
  "ntriangleright;": "⋫",
  "ntrianglerighteq;": "⋭",
  "Nu;": "Ν",
  "nu;": "ν",
  "num;": "#",
  "numero;": "№",
  "numsp;": " ",
  "nvap;": "≍⃒",
  "nVDash;": "⊯",
  "nVdash;": "⊮",
  "nvDash;": "⊭",
  "nvdash;": "⊬",
  "nvge;": "≥⃒",
  "nvgt;": ">⃒",
  "nvHarr;": "⤄",
  "nvinfin;": "⧞",
  "nvlArr;": "⤂",
  "nvle;": "≤⃒",
  "nvlt;": "<⃒",
  "nvltrie;": "⊴⃒",
  "nvrArr;": "⤃",
  "nvrtrie;": "⊵⃒",
  "nvsim;": "∼⃒",
  "nwarhk;": "⤣",
  "nwArr;": "⇖",
  "nwarr;": "↖",
  "nwarrow;": "↖",
  "nwnear;": "⤧",
  "Oacute;": "Ó",
  Oacute: "Ó",
  "oacute;": "ó",
  oacute: "ó",
  "oast;": "⊛",
  "ocir;": "⊚",
  "Ocirc;": "Ô",
  Ocirc: "Ô",
  "ocirc;": "ô",
  ocirc: "ô",
  "Ocy;": "О",
  "ocy;": "о",
  "odash;": "⊝",
  "Odblac;": "Ő",
  "odblac;": "ő",
  "odiv;": "⨸",
  "odot;": "⊙",
  "odsold;": "⦼",
  "OElig;": "Œ",
  "oelig;": "œ",
  "ofcir;": "⦿",
  "Ofr;": "𝔒",
  "ofr;": "𝔬",
  "ogon;": "˛",
  "Ograve;": "Ò",
  Ograve: "Ò",
  "ograve;": "ò",
  ograve: "ò",
  "ogt;": "⧁",
  "ohbar;": "⦵",
  "ohm;": "Ω",
  "oint;": "∮",
  "olarr;": "↺",
  "olcir;": "⦾",
  "olcross;": "⦻",
  "oline;": "‾",
  "olt;": "⧀",
  "Omacr;": "Ō",
  "omacr;": "ō",
  "Omega;": "Ω",
  "omega;": "ω",
  "Omicron;": "Ο",
  "omicron;": "ο",
  "omid;": "⦶",
  "ominus;": "⊖",
  "Oopf;": "𝕆",
  "oopf;": "𝕠",
  "opar;": "⦷",
  "OpenCurlyDoubleQuote;": "“",
  "OpenCurlyQuote;": "‘",
  "operp;": "⦹",
  "oplus;": "⊕",
  "Or;": "⩔",
  "or;": "∨",
  "orarr;": "↻",
  "ord;": "⩝",
  "order;": "ℴ",
  "orderof;": "ℴ",
  "ordf;": "ª",
  ordf: "ª",
  "ordm;": "º",
  ordm: "º",
  "origof;": "⊶",
  "oror;": "⩖",
  "orslope;": "⩗",
  "orv;": "⩛",
  "oS;": "Ⓢ",
  "Oscr;": "𝒪",
  "oscr;": "ℴ",
  "Oslash;": "Ø",
  Oslash: "Ø",
  "oslash;": "ø",
  oslash: "ø",
  "osol;": "⊘",
  "Otilde;": "Õ",
  Otilde: "Õ",
  "otilde;": "õ",
  otilde: "õ",
  "Otimes;": "⨷",
  "otimes;": "⊗",
  "otimesas;": "⨶",
  "Ouml;": "Ö",
  Ouml: "Ö",
  "ouml;": "ö",
  ouml: "ö",
  "ovbar;": "⌽",
  "OverBar;": "‾",
  "OverBrace;": "⏞",
  "OverBracket;": "⎴",
  "OverParenthesis;": "⏜",
  "par;": "∥",
  "para;": "¶",
  para: "¶",
  "parallel;": "∥",
  "parsim;": "⫳",
  "parsl;": "⫽",
  "part;": "∂",
  "PartialD;": "∂",
  "Pcy;": "П",
  "pcy;": "п",
  "percnt;": "%",
  "period;": ".",
  "permil;": "‰",
  "perp;": "⊥",
  "pertenk;": "‱",
  "Pfr;": "𝔓",
  "pfr;": "𝔭",
  "Phi;": "Φ",
  "phi;": "φ",
  "phiv;": "ϕ",
  "phmmat;": "ℳ",
  "phone;": "☎",
  "Pi;": "Π",
  "pi;": "π",
  "pitchfork;": "⋔",
  "piv;": "ϖ",
  "planck;": "ℏ",
  "planckh;": "ℎ",
  "plankv;": "ℏ",
  "plus;": "+",
  "plusacir;": "⨣",
  "plusb;": "⊞",
  "pluscir;": "⨢",
  "plusdo;": "∔",
  "plusdu;": "⨥",
  "pluse;": "⩲",
  "PlusMinus;": "±",
  "plusmn;": "±",
  plusmn: "±",
  "plussim;": "⨦",
  "plustwo;": "⨧",
  "pm;": "±",
  "Poincareplane;": "ℌ",
  "pointint;": "⨕",
  "Popf;": "ℙ",
  "popf;": "𝕡",
  "pound;": "£",
  pound: "£",
  "Pr;": "⪻",
  "pr;": "≺",
  "prap;": "⪷",
  "prcue;": "≼",
  "prE;": "⪳",
  "pre;": "⪯",
  "prec;": "≺",
  "precapprox;": "⪷",
  "preccurlyeq;": "≼",
  "Precedes;": "≺",
  "PrecedesEqual;": "⪯",
  "PrecedesSlantEqual;": "≼",
  "PrecedesTilde;": "≾",
  "preceq;": "⪯",
  "precnapprox;": "⪹",
  "precneqq;": "⪵",
  "precnsim;": "⋨",
  "precsim;": "≾",
  "Prime;": "″",
  "prime;": "′",
  "primes;": "ℙ",
  "prnap;": "⪹",
  "prnE;": "⪵",
  "prnsim;": "⋨",
  "prod;": "∏",
  "Product;": "∏",
  "profalar;": "⌮",
  "profline;": "⌒",
  "profsurf;": "⌓",
  "prop;": "∝",
  "Proportion;": "∷",
  "Proportional;": "∝",
  "propto;": "∝",
  "prsim;": "≾",
  "prurel;": "⊰",
  "Pscr;": "𝒫",
  "pscr;": "𝓅",
  "Psi;": "Ψ",
  "psi;": "ψ",
  "puncsp;": " ",
  "Qfr;": "𝔔",
  "qfr;": "𝔮",
  "qint;": "⨌",
  "Qopf;": "ℚ",
  "qopf;": "𝕢",
  "qprime;": "⁗",
  "Qscr;": "𝒬",
  "qscr;": "𝓆",
  "quaternions;": "ℍ",
  "quatint;": "⨖",
  "quest;": "?",
  "questeq;": "≟",
  "QUOT;": '"',
  QUOT: '"',
  "quot;": '"',
  quot: '"',
  "rAarr;": "⇛",
  "race;": "∽̱",
  "Racute;": "Ŕ",
  "racute;": "ŕ",
  "radic;": "√",
  "raemptyv;": "⦳",
  "Rang;": "⟫",
  "rang;": "⟩",
  "rangd;": "⦒",
  "range;": "⦥",
  "rangle;": "⟩",
  "raquo;": "»",
  raquo: "»",
  "Rarr;": "↠",
  "rArr;": "⇒",
  "rarr;": "→",
  "rarrap;": "⥵",
  "rarrb;": "⇥",
  "rarrbfs;": "⤠",
  "rarrc;": "⤳",
  "rarrfs;": "⤞",
  "rarrhk;": "↪",
  "rarrlp;": "↬",
  "rarrpl;": "⥅",
  "rarrsim;": "⥴",
  "Rarrtl;": "⤖",
  "rarrtl;": "↣",
  "rarrw;": "↝",
  "rAtail;": "⤜",
  "ratail;": "⤚",
  "ratio;": "∶",
  "rationals;": "ℚ",
  "RBarr;": "⤐",
  "rBarr;": "⤏",
  "rbarr;": "⤍",
  "rbbrk;": "❳",
  "rbrace;": "}",
  "rbrack;": "]",
  "rbrke;": "⦌",
  "rbrksld;": "⦎",
  "rbrkslu;": "⦐",
  "Rcaron;": "Ř",
  "rcaron;": "ř",
  "Rcedil;": "Ŗ",
  "rcedil;": "ŗ",
  "rceil;": "⌉",
  "rcub;": "}",
  "Rcy;": "Р",
  "rcy;": "р",
  "rdca;": "⤷",
  "rdldhar;": "⥩",
  "rdquo;": "”",
  "rdquor;": "”",
  "rdsh;": "↳",
  "Re;": "ℜ",
  "real;": "ℜ",
  "realine;": "ℛ",
  "realpart;": "ℜ",
  "reals;": "ℝ",
  "rect;": "▭",
  "REG;": "®",
  REG: "®",
  "reg;": "®",
  reg: "®",
  "ReverseElement;": "∋",
  "ReverseEquilibrium;": "⇋",
  "ReverseUpEquilibrium;": "⥯",
  "rfisht;": "⥽",
  "rfloor;": "⌋",
  "Rfr;": "ℜ",
  "rfr;": "𝔯",
  "rHar;": "⥤",
  "rhard;": "⇁",
  "rharu;": "⇀",
  "rharul;": "⥬",
  "Rho;": "Ρ",
  "rho;": "ρ",
  "rhov;": "ϱ",
  "RightAngleBracket;": "⟩",
  "RightArrow;": "→",
  "Rightarrow;": "⇒",
  "rightarrow;": "→",
  "RightArrowBar;": "⇥",
  "RightArrowLeftArrow;": "⇄",
  "rightarrowtail;": "↣",
  "RightCeiling;": "⌉",
  "RightDoubleBracket;": "⟧",
  "RightDownTeeVector;": "⥝",
  "RightDownVector;": "⇂",
  "RightDownVectorBar;": "⥕",
  "RightFloor;": "⌋",
  "rightharpoondown;": "⇁",
  "rightharpoonup;": "⇀",
  "rightleftarrows;": "⇄",
  "rightleftharpoons;": "⇌",
  "rightrightarrows;": "⇉",
  "rightsquigarrow;": "↝",
  "RightTee;": "⊢",
  "RightTeeArrow;": "↦",
  "RightTeeVector;": "⥛",
  "rightthreetimes;": "⋌",
  "RightTriangle;": "⊳",
  "RightTriangleBar;": "⧐",
  "RightTriangleEqual;": "⊵",
  "RightUpDownVector;": "⥏",
  "RightUpTeeVector;": "⥜",
  "RightUpVector;": "↾",
  "RightUpVectorBar;": "⥔",
  "RightVector;": "⇀",
  "RightVectorBar;": "⥓",
  "ring;": "˚",
  "risingdotseq;": "≓",
  "rlarr;": "⇄",
  "rlhar;": "⇌",
  "rlm;": "‏",
  "rmoust;": "⎱",
  "rmoustache;": "⎱",
  "rnmid;": "⫮",
  "roang;": "⟭",
  "roarr;": "⇾",
  "robrk;": "⟧",
  "ropar;": "⦆",
  "Ropf;": "ℝ",
  "ropf;": "𝕣",
  "roplus;": "⨮",
  "rotimes;": "⨵",
  "RoundImplies;": "⥰",
  "rpar;": ")",
  "rpargt;": "⦔",
  "rppolint;": "⨒",
  "rrarr;": "⇉",
  "Rrightarrow;": "⇛",
  "rsaquo;": "›",
  "Rscr;": "ℛ",
  "rscr;": "𝓇",
  "Rsh;": "↱",
  "rsh;": "↱",
  "rsqb;": "]",
  "rsquo;": "’",
  "rsquor;": "’",
  "rthree;": "⋌",
  "rtimes;": "⋊",
  "rtri;": "▹",
  "rtrie;": "⊵",
  "rtrif;": "▸",
  "rtriltri;": "⧎",
  "RuleDelayed;": "⧴",
  "ruluhar;": "⥨",
  "rx;": "℞",
  "Sacute;": "Ś",
  "sacute;": "ś",
  "sbquo;": "‚",
  "Sc;": "⪼",
  "sc;": "≻",
  "scap;": "⪸",
  "Scaron;": "Š",
  "scaron;": "š",
  "sccue;": "≽",
  "scE;": "⪴",
  "sce;": "⪰",
  "Scedil;": "Ş",
  "scedil;": "ş",
  "Scirc;": "Ŝ",
  "scirc;": "ŝ",
  "scnap;": "⪺",
  "scnE;": "⪶",
  "scnsim;": "⋩",
  "scpolint;": "⨓",
  "scsim;": "≿",
  "Scy;": "С",
  "scy;": "с",
  "sdot;": "⋅",
  "sdotb;": "⊡",
  "sdote;": "⩦",
  "searhk;": "⤥",
  "seArr;": "⇘",
  "searr;": "↘",
  "searrow;": "↘",
  "sect;": "§",
  sect: "§",
  "semi;": ";",
  "seswar;": "⤩",
  "setminus;": "∖",
  "setmn;": "∖",
  "sext;": "✶",
  "Sfr;": "𝔖",
  "sfr;": "𝔰",
  "sfrown;": "⌢",
  "sharp;": "♯",
  "SHCHcy;": "Щ",
  "shchcy;": "щ",
  "SHcy;": "Ш",
  "shcy;": "ш",
  "ShortDownArrow;": "↓",
  "ShortLeftArrow;": "←",
  "shortmid;": "∣",
  "shortparallel;": "∥",
  "ShortRightArrow;": "→",
  "ShortUpArrow;": "↑",
  "shy;": "­",
  shy: "­",
  "Sigma;": "Σ",
  "sigma;": "σ",
  "sigmaf;": "ς",
  "sigmav;": "ς",
  "sim;": "∼",
  "simdot;": "⩪",
  "sime;": "≃",
  "simeq;": "≃",
  "simg;": "⪞",
  "simgE;": "⪠",
  "siml;": "⪝",
  "simlE;": "⪟",
  "simne;": "≆",
  "simplus;": "⨤",
  "simrarr;": "⥲",
  "slarr;": "←",
  "SmallCircle;": "∘",
  "smallsetminus;": "∖",
  "smashp;": "⨳",
  "smeparsl;": "⧤",
  "smid;": "∣",
  "smile;": "⌣",
  "smt;": "⪪",
  "smte;": "⪬",
  "smtes;": "⪬︀",
  "SOFTcy;": "Ь",
  "softcy;": "ь",
  "sol;": "/",
  "solb;": "⧄",
  "solbar;": "⌿",
  "Sopf;": "𝕊",
  "sopf;": "𝕤",
  "spades;": "♠",
  "spadesuit;": "♠",
  "spar;": "∥",
  "sqcap;": "⊓",
  "sqcaps;": "⊓︀",
  "sqcup;": "⊔",
  "sqcups;": "⊔︀",
  "Sqrt;": "√",
  "sqsub;": "⊏",
  "sqsube;": "⊑",
  "sqsubset;": "⊏",
  "sqsubseteq;": "⊑",
  "sqsup;": "⊐",
  "sqsupe;": "⊒",
  "sqsupset;": "⊐",
  "sqsupseteq;": "⊒",
  "squ;": "□",
  "Square;": "□",
  "square;": "□",
  "SquareIntersection;": "⊓",
  "SquareSubset;": "⊏",
  "SquareSubsetEqual;": "⊑",
  "SquareSuperset;": "⊐",
  "SquareSupersetEqual;": "⊒",
  "SquareUnion;": "⊔",
  "squarf;": "▪",
  "squf;": "▪",
  "srarr;": "→",
  "Sscr;": "𝒮",
  "sscr;": "𝓈",
  "ssetmn;": "∖",
  "ssmile;": "⌣",
  "sstarf;": "⋆",
  "Star;": "⋆",
  "star;": "☆",
  "starf;": "★",
  "straightepsilon;": "ϵ",
  "straightphi;": "ϕ",
  "strns;": "¯",
  "Sub;": "⋐",
  "sub;": "⊂",
  "subdot;": "⪽",
  "subE;": "⫅",
  "sube;": "⊆",
  "subedot;": "⫃",
  "submult;": "⫁",
  "subnE;": "⫋",
  "subne;": "⊊",
  "subplus;": "⪿",
  "subrarr;": "⥹",
  "Subset;": "⋐",
  "subset;": "⊂",
  "subseteq;": "⊆",
  "subseteqq;": "⫅",
  "SubsetEqual;": "⊆",
  "subsetneq;": "⊊",
  "subsetneqq;": "⫋",
  "subsim;": "⫇",
  "subsub;": "⫕",
  "subsup;": "⫓",
  "succ;": "≻",
  "succapprox;": "⪸",
  "succcurlyeq;": "≽",
  "Succeeds;": "≻",
  "SucceedsEqual;": "⪰",
  "SucceedsSlantEqual;": "≽",
  "SucceedsTilde;": "≿",
  "succeq;": "⪰",
  "succnapprox;": "⪺",
  "succneqq;": "⪶",
  "succnsim;": "⋩",
  "succsim;": "≿",
  "SuchThat;": "∋",
  "Sum;": "∑",
  "sum;": "∑",
  "sung;": "♪",
  "Sup;": "⋑",
  "sup;": "⊃",
  "sup1;": "¹",
  sup1: "¹",
  "sup2;": "²",
  sup2: "²",
  "sup3;": "³",
  sup3: "³",
  "supdot;": "⪾",
  "supdsub;": "⫘",
  "supE;": "⫆",
  "supe;": "⊇",
  "supedot;": "⫄",
  "Superset;": "⊃",
  "SupersetEqual;": "⊇",
  "suphsol;": "⟉",
  "suphsub;": "⫗",
  "suplarr;": "⥻",
  "supmult;": "⫂",
  "supnE;": "⫌",
  "supne;": "⊋",
  "supplus;": "⫀",
  "Supset;": "⋑",
  "supset;": "⊃",
  "supseteq;": "⊇",
  "supseteqq;": "⫆",
  "supsetneq;": "⊋",
  "supsetneqq;": "⫌",
  "supsim;": "⫈",
  "supsub;": "⫔",
  "supsup;": "⫖",
  "swarhk;": "⤦",
  "swArr;": "⇙",
  "swarr;": "↙",
  "swarrow;": "↙",
  "swnwar;": "⤪",
  "szlig;": "ß",
  szlig: "ß",
  "Tab;": "	",
  "target;": "⌖",
  "Tau;": "Τ",
  "tau;": "τ",
  "tbrk;": "⎴",
  "Tcaron;": "Ť",
  "tcaron;": "ť",
  "Tcedil;": "Ţ",
  "tcedil;": "ţ",
  "Tcy;": "Т",
  "tcy;": "т",
  "tdot;": "⃛",
  "telrec;": "⌕",
  "Tfr;": "𝔗",
  "tfr;": "𝔱",
  "there4;": "∴",
  "Therefore;": "∴",
  "therefore;": "∴",
  "Theta;": "Θ",
  "theta;": "θ",
  "thetasym;": "ϑ",
  "thetav;": "ϑ",
  "thickapprox;": "≈",
  "thicksim;": "∼",
  "ThickSpace;": "  ",
  "thinsp;": " ",
  "ThinSpace;": " ",
  "thkap;": "≈",
  "thksim;": "∼",
  "THORN;": "Þ",
  THORN: "Þ",
  "thorn;": "þ",
  thorn: "þ",
  "Tilde;": "∼",
  "tilde;": "˜",
  "TildeEqual;": "≃",
  "TildeFullEqual;": "≅",
  "TildeTilde;": "≈",
  "times;": "×",
  times: "×",
  "timesb;": "⊠",
  "timesbar;": "⨱",
  "timesd;": "⨰",
  "tint;": "∭",
  "toea;": "⤨",
  "top;": "⊤",
  "topbot;": "⌶",
  "topcir;": "⫱",
  "Topf;": "𝕋",
  "topf;": "𝕥",
  "topfork;": "⫚",
  "tosa;": "⤩",
  "tprime;": "‴",
  "TRADE;": "™",
  "trade;": "™",
  "triangle;": "▵",
  "triangledown;": "▿",
  "triangleleft;": "◃",
  "trianglelefteq;": "⊴",
  "triangleq;": "≜",
  "triangleright;": "▹",
  "trianglerighteq;": "⊵",
  "tridot;": "◬",
  "trie;": "≜",
  "triminus;": "⨺",
  "TripleDot;": "⃛",
  "triplus;": "⨹",
  "trisb;": "⧍",
  "tritime;": "⨻",
  "trpezium;": "⏢",
  "Tscr;": "𝒯",
  "tscr;": "𝓉",
  "TScy;": "Ц",
  "tscy;": "ц",
  "TSHcy;": "Ћ",
  "tshcy;": "ћ",
  "Tstrok;": "Ŧ",
  "tstrok;": "ŧ",
  "twixt;": "≬",
  "twoheadleftarrow;": "↞",
  "twoheadrightarrow;": "↠",
  "Uacute;": "Ú",
  Uacute: "Ú",
  "uacute;": "ú",
  uacute: "ú",
  "Uarr;": "↟",
  "uArr;": "⇑",
  "uarr;": "↑",
  "Uarrocir;": "⥉",
  "Ubrcy;": "Ў",
  "ubrcy;": "ў",
  "Ubreve;": "Ŭ",
  "ubreve;": "ŭ",
  "Ucirc;": "Û",
  Ucirc: "Û",
  "ucirc;": "û",
  ucirc: "û",
  "Ucy;": "У",
  "ucy;": "у",
  "udarr;": "⇅",
  "Udblac;": "Ű",
  "udblac;": "ű",
  "udhar;": "⥮",
  "ufisht;": "⥾",
  "Ufr;": "𝔘",
  "ufr;": "𝔲",
  "Ugrave;": "Ù",
  Ugrave: "Ù",
  "ugrave;": "ù",
  ugrave: "ù",
  "uHar;": "⥣",
  "uharl;": "↿",
  "uharr;": "↾",
  "uhblk;": "▀",
  "ulcorn;": "⌜",
  "ulcorner;": "⌜",
  "ulcrop;": "⌏",
  "ultri;": "◸",
  "Umacr;": "Ū",
  "umacr;": "ū",
  "uml;": "¨",
  uml: "¨",
  "UnderBar;": "_",
  "UnderBrace;": "⏟",
  "UnderBracket;": "⎵",
  "UnderParenthesis;": "⏝",
  "Union;": "⋃",
  "UnionPlus;": "⊎",
  "Uogon;": "Ų",
  "uogon;": "ų",
  "Uopf;": "𝕌",
  "uopf;": "𝕦",
  "UpArrow;": "↑",
  "Uparrow;": "⇑",
  "uparrow;": "↑",
  "UpArrowBar;": "⤒",
  "UpArrowDownArrow;": "⇅",
  "UpDownArrow;": "↕",
  "Updownarrow;": "⇕",
  "updownarrow;": "↕",
  "UpEquilibrium;": "⥮",
  "upharpoonleft;": "↿",
  "upharpoonright;": "↾",
  "uplus;": "⊎",
  "UpperLeftArrow;": "↖",
  "UpperRightArrow;": "↗",
  "Upsi;": "ϒ",
  "upsi;": "υ",
  "upsih;": "ϒ",
  "Upsilon;": "Υ",
  "upsilon;": "υ",
  "UpTee;": "⊥",
  "UpTeeArrow;": "↥",
  "upuparrows;": "⇈",
  "urcorn;": "⌝",
  "urcorner;": "⌝",
  "urcrop;": "⌎",
  "Uring;": "Ů",
  "uring;": "ů",
  "urtri;": "◹",
  "Uscr;": "𝒰",
  "uscr;": "𝓊",
  "utdot;": "⋰",
  "Utilde;": "Ũ",
  "utilde;": "ũ",
  "utri;": "▵",
  "utrif;": "▴",
  "uuarr;": "⇈",
  "Uuml;": "Ü",
  Uuml: "Ü",
  "uuml;": "ü",
  uuml: "ü",
  "uwangle;": "⦧",
  "vangrt;": "⦜",
  "varepsilon;": "ϵ",
  "varkappa;": "ϰ",
  "varnothing;": "∅",
  "varphi;": "ϕ",
  "varpi;": "ϖ",
  "varpropto;": "∝",
  "vArr;": "⇕",
  "varr;": "↕",
  "varrho;": "ϱ",
  "varsigma;": "ς",
  "varsubsetneq;": "⊊︀",
  "varsubsetneqq;": "⫋︀",
  "varsupsetneq;": "⊋︀",
  "varsupsetneqq;": "⫌︀",
  "vartheta;": "ϑ",
  "vartriangleleft;": "⊲",
  "vartriangleright;": "⊳",
  "Vbar;": "⫫",
  "vBar;": "⫨",
  "vBarv;": "⫩",
  "Vcy;": "В",
  "vcy;": "в",
  "VDash;": "⊫",
  "Vdash;": "⊩",
  "vDash;": "⊨",
  "vdash;": "⊢",
  "Vdashl;": "⫦",
  "Vee;": "⋁",
  "vee;": "∨",
  "veebar;": "⊻",
  "veeeq;": "≚",
  "vellip;": "⋮",
  "Verbar;": "‖",
  "verbar;": "|",
  "Vert;": "‖",
  "vert;": "|",
  "VerticalBar;": "∣",
  "VerticalLine;": "|",
  "VerticalSeparator;": "❘",
  "VerticalTilde;": "≀",
  "VeryThinSpace;": " ",
  "Vfr;": "𝔙",
  "vfr;": "𝔳",
  "vltri;": "⊲",
  "vnsub;": "⊂⃒",
  "vnsup;": "⊃⃒",
  "Vopf;": "𝕍",
  "vopf;": "𝕧",
  "vprop;": "∝",
  "vrtri;": "⊳",
  "Vscr;": "𝒱",
  "vscr;": "𝓋",
  "vsubnE;": "⫋︀",
  "vsubne;": "⊊︀",
  "vsupnE;": "⫌︀",
  "vsupne;": "⊋︀",
  "Vvdash;": "⊪",
  "vzigzag;": "⦚",
  "Wcirc;": "Ŵ",
  "wcirc;": "ŵ",
  "wedbar;": "⩟",
  "Wedge;": "⋀",
  "wedge;": "∧",
  "wedgeq;": "≙",
  "weierp;": "℘",
  "Wfr;": "𝔚",
  "wfr;": "𝔴",
  "Wopf;": "𝕎",
  "wopf;": "𝕨",
  "wp;": "℘",
  "wr;": "≀",
  "wreath;": "≀",
  "Wscr;": "𝒲",
  "wscr;": "𝓌",
  "xcap;": "⋂",
  "xcirc;": "◯",
  "xcup;": "⋃",
  "xdtri;": "▽",
  "Xfr;": "𝔛",
  "xfr;": "𝔵",
  "xhArr;": "⟺",
  "xharr;": "⟷",
  "Xi;": "Ξ",
  "xi;": "ξ",
  "xlArr;": "⟸",
  "xlarr;": "⟵",
  "xmap;": "⟼",
  "xnis;": "⋻",
  "xodot;": "⨀",
  "Xopf;": "𝕏",
  "xopf;": "𝕩",
  "xoplus;": "⨁",
  "xotime;": "⨂",
  "xrArr;": "⟹",
  "xrarr;": "⟶",
  "Xscr;": "𝒳",
  "xscr;": "𝓍",
  "xsqcup;": "⨆",
  "xuplus;": "⨄",
  "xutri;": "△",
  "xvee;": "⋁",
  "xwedge;": "⋀",
  "Yacute;": "Ý",
  Yacute: "Ý",
  "yacute;": "ý",
  yacute: "ý",
  "YAcy;": "Я",
  "yacy;": "я",
  "Ycirc;": "Ŷ",
  "ycirc;": "ŷ",
  "Ycy;": "Ы",
  "ycy;": "ы",
  "yen;": "¥",
  yen: "¥",
  "Yfr;": "𝔜",
  "yfr;": "𝔶",
  "YIcy;": "Ї",
  "yicy;": "ї",
  "Yopf;": "𝕐",
  "yopf;": "𝕪",
  "Yscr;": "𝒴",
  "yscr;": "𝓎",
  "YUcy;": "Ю",
  "yucy;": "ю",
  "Yuml;": "Ÿ",
  "yuml;": "ÿ",
  yuml: "ÿ",
  "Zacute;": "Ź",
  "zacute;": "ź",
  "Zcaron;": "Ž",
  "zcaron;": "ž",
  "Zcy;": "З",
  "zcy;": "з",
  "Zdot;": "Ż",
  "zdot;": "ż",
  "zeetrf;": "ℨ",
  "ZeroWidthSpace;": "​",
  "Zeta;": "Ζ",
  "zeta;": "ζ",
  "Zfr;": "ℨ",
  "zfr;": "𝔷",
  "ZHcy;": "Ж",
  "zhcy;": "ж",
  "zigrarr;": "⇝",
  "Zopf;": "ℤ",
  "zopf;": "𝕫",
  "Zscr;": "𝒵",
  "zscr;": "𝓏",
  "zwj;": "‍",
  "zwnj;": "‌"
};
function Ie(e, t) {
  if (e.length < t.length)
    return !1;
  for (var n = 0; n < t.length; n++)
    if (e[n] !== t[n])
      return !1;
  return !0;
}
function no(e, t) {
  var n = e.length - t.length;
  return n > 0 ? e.lastIndexOf(t) === n : n === 0 ? e === t : !1;
}
function _i(e, t) {
  for (var n = ""; t > 0; )
    (t & 1) === 1 && (n += e), e += e, t = t >>> 1;
  return n;
}
var ro = "a".charCodeAt(0), io = "z".charCodeAt(0), ao = "A".charCodeAt(0), so = "Z".charCodeAt(0), oo = "0".charCodeAt(0), lo = "9".charCodeAt(0);
function et(e, t) {
  var n = e.charCodeAt(t);
  return ro <= n && n <= io || ao <= n && n <= so || oo <= n && n <= lo;
}
function It(e) {
  return typeof e < "u";
}
function uo(e) {
  if (e)
    return typeof e == "string" ? {
      kind: "markdown",
      value: e
    } : {
      kind: "markdown",
      value: e.value
    };
}
var Ji = function() {
  function e(t, n) {
    var r = this;
    this.id = t, this._tags = [], this._tagMap = {}, this._valueSetMap = {}, this._tags = n.tags || [], this._globalAttributes = n.globalAttributes || [], this._tags.forEach(function(i) {
      r._tagMap[i.name.toLowerCase()] = i;
    }), n.valueSets && n.valueSets.forEach(function(i) {
      r._valueSetMap[i.name] = i.values;
    });
  }
  return e.prototype.isApplicable = function() {
    return !0;
  }, e.prototype.getId = function() {
    return this.id;
  }, e.prototype.provideTags = function() {
    return this._tags;
  }, e.prototype.provideAttributes = function(t) {
    var n = [], r = function(s) {
      n.push(s);
    }, i = this._tagMap[t.toLowerCase()];
    return i && i.attributes.forEach(r), this._globalAttributes.forEach(r), n;
  }, e.prototype.provideValues = function(t, n) {
    var r = this, i = [];
    n = n.toLowerCase();
    var s = function(u) {
      u.forEach(function(o) {
        o.name.toLowerCase() === n && (o.values && o.values.forEach(function(c) {
          i.push(c);
        }), o.valueSet && r._valueSetMap[o.valueSet] && r._valueSetMap[o.valueSet].forEach(function(c) {
          i.push(c);
        }));
      });
    }, l = this._tagMap[t.toLowerCase()];
    return l && s(l.attributes), s(this._globalAttributes), i;
  }, e;
}();
function We(e, t, n) {
  t === void 0 && (t = {});
  var r = {
    kind: n ? "markdown" : "plaintext",
    value: ""
  };
  if (e.description && t.documentation !== !1) {
    var i = uo(e.description);
    i && (r.value += i.value);
  }
  if (e.references && e.references.length > 0 && t.references !== !1 && (r.value.length && (r.value += `

`), n ? r.value += e.references.map(function(s) {
    return "[".concat(s.name, "](").concat(s.url, ")");
  }).join(" | ") : r.value += e.references.map(function(s) {
    return "".concat(s.name, ": ").concat(s.url);
  }).join(`
`)), r.value !== "")
    return r;
}
var vi = function(e, t, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(l) {
      l(s);
    });
  }
  return new (n || (n = Promise))(function(s, l) {
    function u(h) {
      try {
        c(r.next(h));
      } catch (d) {
        l(d);
      }
    }
    function o(h) {
      try {
        c(r.throw(h));
      } catch (d) {
        l(d);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(u, o);
    }
    c((r = r.apply(e, t || [])).next());
  });
}, yi = function(e, t) {
  var n = { label: 0, sent: function() {
    if (s[0] & 1)
      throw s[1];
    return s[1];
  }, trys: [], ops: [] }, r, i, s, l;
  return l = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function u(c) {
    return function(h) {
      return o([c, h]);
    };
  }
  function o(c) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (s = c[0] & 2 ? i.return : c[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, c[1])).done)
          return s;
        switch (i = 0, s && (c = [c[0] & 2, s.value]), c[0]) {
          case 0:
          case 1:
            s = c;
            break;
          case 4:
            return n.label++, { value: c[1], done: !1 };
          case 5:
            n.label++, i = c[1], c = [0];
            continue;
          case 7:
            c = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (s = n.trys, !(s = s.length > 0 && s[s.length - 1]) && (c[0] === 6 || c[0] === 2)) {
              n = 0;
              continue;
            }
            if (c[0] === 3 && (!s || c[1] > s[0] && c[1] < s[3])) {
              n.label = c[1];
              break;
            }
            if (c[0] === 6 && n.label < s[1]) {
              n.label = s[1], s = c;
              break;
            }
            if (s && n.label < s[2]) {
              n.label = s[2], n.ops.push(c);
              break;
            }
            s[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        c = t.call(e, n);
      } catch (h) {
        c = [6, h], i = 0;
      } finally {
        r = s = 0;
      }
    if (c[0] & 5)
      throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}, co = function() {
  function e(t) {
    this.readDirectory = t, this.atributeCompletions = [];
  }
  return e.prototype.onHtmlAttributeValue = function(t) {
    po(t.tag, t.attribute) && this.atributeCompletions.push(t);
  }, e.prototype.computeCompletions = function(t, n) {
    return vi(this, void 0, void 0, function() {
      var r, i, s, l, u, o, c, h, d, f;
      return yi(this, function(g) {
        switch (g.label) {
          case 0:
            r = { items: [], isIncomplete: !1 }, i = 0, s = this.atributeCompletions, g.label = 1;
          case 1:
            return i < s.length ? (l = s[i], u = fo(t.getText(l.range)), mo(u) ? u === "." || u === ".." ? (r.isIncomplete = !0, [3, 4]) : [3, 2] : [3, 4]) : [3, 5];
          case 2:
            return o = go(l.value, u, l.range), [4, this.providePathSuggestions(l.value, o, t, n)];
          case 3:
            for (c = g.sent(), h = 0, d = c; h < d.length; h++)
              f = d[h], r.items.push(f);
            g.label = 4;
          case 4:
            return i++, [3, 1];
          case 5:
            return [2, r];
        }
      });
    });
  }, e.prototype.providePathSuggestions = function(t, n, r, i) {
    return vi(this, void 0, void 0, function() {
      var s, l, u, o, c, h, d, f, g;
      return yi(this, function(_) {
        switch (_.label) {
          case 0:
            if (s = t.substring(0, t.lastIndexOf("/") + 1), l = i.resolveReference(s || ".", r.uri), !l)
              return [3, 4];
            _.label = 1;
          case 1:
            return _.trys.push([1, 3, , 4]), u = [], [4, this.readDirectory(l)];
          case 2:
            for (o = _.sent(), c = 0, h = o; c < h.length; c++)
              d = h[c], f = d[0], g = d[1], f.charCodeAt(0) !== ho && u.push(bo(f, g === vn.Directory, n));
            return [2, u];
          case 3:
            return _.sent(), [3, 4];
          case 4:
            return [2, []];
        }
      });
    });
  }, e;
}(), ho = ".".charCodeAt(0);
function fo(e) {
  return Ie(e, "'") || Ie(e, '"') ? e.slice(1, -1) : e;
}
function mo(e) {
  return !(Ie(e, "http") || Ie(e, "https") || Ie(e, "//"));
}
function po(e, t) {
  if (t === "src" || t === "href")
    return !0;
  var n = _o[e];
  return n ? typeof n == "string" ? n === t : n.indexOf(t) !== -1 : !1;
}
function go(e, t, n) {
  var r, i = e.lastIndexOf("/");
  if (i === -1)
    r = wo(n, 1, -1);
  else {
    var s = t.slice(i + 1), l = rt(n.end, -1 - s.length), u = s.indexOf(" "), o = void 0;
    u !== -1 ? o = rt(l, u) : o = rt(n.end, -1), r = X.create(l, o);
  }
  return r;
}
function bo(e, t, n) {
  return t ? (e = e + "/", {
    label: e,
    kind: ue.Folder,
    textEdit: ee.replace(n, e),
    command: {
      title: "Suggest",
      command: "editor.action.triggerSuggest"
    }
  }) : {
    label: e,
    kind: ue.File,
    textEdit: ee.replace(n, e)
  };
}
function rt(e, t) {
  return ne.create(e.line, e.character + t);
}
function wo(e, t, n) {
  var r = rt(e.start, t), i = rt(e.end, n);
  return X.create(r, i);
}
var _o = {
  a: "href",
  area: "href",
  body: "background",
  del: "cite",
  form: "action",
  frame: ["src", "longdesc"],
  img: ["src", "longdesc"],
  ins: "cite",
  link: "href",
  object: "data",
  q: "cite",
  script: "src",
  audio: "src",
  button: "formaction",
  command: "icon",
  embed: "src",
  html: "manifest",
  input: ["src", "formaction"],
  source: "src",
  track: "src",
  video: ["src", "poster"]
}, vo = function(e, t, n, r) {
  function i(s) {
    return s instanceof n ? s : new n(function(l) {
      l(s);
    });
  }
  return new (n || (n = Promise))(function(s, l) {
    function u(h) {
      try {
        c(r.next(h));
      } catch (d) {
        l(d);
      }
    }
    function o(h) {
      try {
        c(r.throw(h));
      } catch (d) {
        l(d);
      }
    }
    function c(h) {
      h.done ? s(h.value) : i(h.value).then(u, o);
    }
    c((r = r.apply(e, t || [])).next());
  });
}, yo = function(e, t) {
  var n = { label: 0, sent: function() {
    if (s[0] & 1)
      throw s[1];
    return s[1];
  }, trys: [], ops: [] }, r, i, s, l;
  return l = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (l[Symbol.iterator] = function() {
    return this;
  }), l;
  function u(c) {
    return function(h) {
      return o([c, h]);
    };
  }
  function o(c) {
    if (r)
      throw new TypeError("Generator is already executing.");
    for (; n; )
      try {
        if (r = 1, i && (s = c[0] & 2 ? i.return : c[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, c[1])).done)
          return s;
        switch (i = 0, s && (c = [c[0] & 2, s.value]), c[0]) {
          case 0:
          case 1:
            s = c;
            break;
          case 4:
            return n.label++, { value: c[1], done: !1 };
          case 5:
            n.label++, i = c[1], c = [0];
            continue;
          case 7:
            c = n.ops.pop(), n.trys.pop();
            continue;
          default:
            if (s = n.trys, !(s = s.length > 0 && s[s.length - 1]) && (c[0] === 6 || c[0] === 2)) {
              n = 0;
              continue;
            }
            if (c[0] === 3 && (!s || c[1] > s[0] && c[1] < s[3])) {
              n.label = c[1];
              break;
            }
            if (c[0] === 6 && n.label < s[1]) {
              n.label = s[1], s = c;
              break;
            }
            if (s && n.label < s[2]) {
              n.label = s[2], n.ops.push(c);
              break;
            }
            s[2] && n.ops.pop(), n.trys.pop();
            continue;
        }
        c = t.call(e, n);
      } catch (h) {
        c = [6, h], i = 0;
      } finally {
        r = s = 0;
      }
    if (c[0] & 5)
      throw c[1];
    return { value: c[0] ? c[1] : void 0, done: !0 };
  }
}, To = xn(), ko = function() {
  function e(t, n) {
    this.lsOptions = t, this.dataManager = n, this.completionParticipants = [];
  }
  return e.prototype.setCompletionParticipants = function(t) {
    this.completionParticipants = t || [];
  }, e.prototype.doComplete2 = function(t, n, r, i, s) {
    return vo(this, void 0, void 0, function() {
      var l, u, o, c;
      return yo(this, function(h) {
        switch (h.label) {
          case 0:
            if (!this.lsOptions.fileSystemProvider || !this.lsOptions.fileSystemProvider.readDirectory)
              return [2, this.doComplete(t, n, r, s)];
            l = new co(this.lsOptions.fileSystemProvider.readDirectory), u = this.completionParticipants, this.completionParticipants = [l].concat(u), o = this.doComplete(t, n, r, s), h.label = 1;
          case 1:
            return h.trys.push([1, , 3, 4]), [4, l.computeCompletions(t, i)];
          case 2:
            return c = h.sent(), [2, {
              isIncomplete: o.isIncomplete || c.isIncomplete,
              items: c.items.concat(o.items)
            }];
          case 3:
            return this.completionParticipants = u, [7];
          case 4:
            return [2];
        }
      });
    });
  }, e.prototype.doComplete = function(t, n, r, i) {
    var s = this._doComplete(t, n, r, i);
    return this.convertCompletionList(s);
  }, e.prototype._doComplete = function(t, n, r, i) {
    var s = {
      isIncomplete: !1,
      items: []
    }, l = this.completionParticipants, u = this.dataManager.getDataProviders().filter(function(R) {
      return R.isApplicable(t.languageId) && (!i || i[R.getId()] !== !1);
    }), o = this.doesSupportMarkdown(), c = t.getText(), h = t.offsetAt(n), d = r.findNodeBefore(h);
    if (!d)
      return s;
    var f = pe(c, d.start), g = "", _;
    function w(R, N) {
      return N === void 0 && (N = h), R > h && (R = h), { start: t.positionAt(R), end: t.positionAt(N) };
    }
    function y(R, N) {
      var F = w(R, N);
      return u.forEach(function(G) {
        G.provideTags().forEach(function($) {
          s.items.push({
            label: $.name,
            kind: ue.Property,
            documentation: We($, void 0, o),
            textEdit: ee.replace(F, $.name),
            insertTextFormat: we.PlainText
          });
        });
      }), s;
    }
    function k(R) {
      for (var N = R; N > 0; ) {
        var F = c.charAt(N - 1);
        if (`
\r`.indexOf(F) >= 0)
          return c.substring(N, R);
        if (!Ht(F))
          return null;
        N--;
      }
      return c.substring(0, R);
    }
    function v(R, N, F) {
      F === void 0 && (F = h);
      var G = w(R, F), $ = Ti(c, F, O.WithinEndTag, U.EndTagClose) ? "" : ">", j = d;
      for (N && (j = j.parent); j; ) {
        var J = j.tag;
        if (J && (!j.closed || j.endTagStart && j.endTagStart > h)) {
          var se = {
            label: "/" + J,
            kind: ue.Property,
            filterText: "/" + J,
            textEdit: ee.replace(G, "/" + J + $),
            insertTextFormat: we.PlainText
          }, ye = k(j.start), Ce = k(R - 1);
          if (ye !== null && Ce !== null && ye !== Ce) {
            var he = ye + "</" + J + $;
            se.textEdit = ee.replace(w(R - 1 - Ce.length), he), se.filterText = Ce + "</" + J;
          }
          return s.items.push(se), s;
        }
        j = j.parent;
      }
      return N || u.forEach(function(He) {
        He.provideTags().forEach(function(be) {
          s.items.push({
            label: "/" + be.name,
            kind: ue.Property,
            documentation: We(be, void 0, o),
            filterText: "/" + be.name + $,
            textEdit: ee.replace(G, "/" + be.name + $),
            insertTextFormat: we.PlainText
          });
        });
      }), s;
    }
    function L(R, N) {
      if (i && i.hideAutoCompleteProposals)
        return s;
      if (!Ut(N)) {
        var F = t.positionAt(R);
        s.items.push({
          label: "</" + N + ">",
          kind: ue.Property,
          filterText: "</" + N + ">",
          textEdit: ee.insert(F, "$0</" + N + ">"),
          insertTextFormat: we.Snippet
        });
      }
      return s;
    }
    function M(R, N) {
      return y(R, N), v(R, !0, N), s;
    }
    function z() {
      var R = /* @__PURE__ */ Object.create(null);
      return d.attributeNames.forEach(function(N) {
        R[N] = !0;
      }), R;
    }
    function D(R, N) {
      var F;
      N === void 0 && (N = h);
      for (var G = h; G < N && c[G] !== "<"; )
        G++;
      var $ = c.substring(R, N), j = w(R, G), J = "";
      if (!Ti(c, N, O.AfterAttributeName, U.DelimiterAssign)) {
        var se = (F = i == null ? void 0 : i.attributeDefaultValue) !== null && F !== void 0 ? F : "doublequotes";
        se === "empty" ? J = "=$1" : se === "singlequotes" ? J = "='$1'" : J = '="$1"';
      }
      var ye = z();
      return ye[$] = !1, u.forEach(function(Ce) {
        Ce.provideAttributes(g).forEach(function(he) {
          if (!ye[he.name]) {
            ye[he.name] = !0;
            var He = he.name, be;
            he.valueSet !== "v" && J.length && (He = He + J, (he.valueSet || he.name === "style") && (be = {
              title: "Suggest",
              command: "editor.action.triggerSuggest"
            })), s.items.push({
              label: he.name,
              kind: he.valueSet === "handler" ? ue.Function : ue.Value,
              documentation: We(he, void 0, o),
              textEdit: ee.replace(j, He),
              insertTextFormat: we.Snippet,
              command: be
            });
          }
        });
      }), p(j, ye), s;
    }
    function p(R, N) {
      var F = "data-", G = {};
      G[F] = "".concat(F, '$1="$2"');
      function $(j) {
        j.attributeNames.forEach(function(J) {
          Ie(J, F) && !G[J] && !N[J] && (G[J] = J + '="$1"');
        }), j.children.forEach(function(J) {
          return $(J);
        });
      }
      r && r.roots.forEach(function(j) {
        return $(j);
      }), Object.keys(G).forEach(function(j) {
        return s.items.push({
          label: j,
          kind: ue.Value,
          textEdit: ee.replace(R, G[j]),
          insertTextFormat: we.Snippet
        });
      });
    }
    function m(R, N) {
      N === void 0 && (N = h);
      var F, G, $;
      if (h > R && h <= N && Ao(c[R])) {
        var j = R + 1, J = N;
        N > R && c[N - 1] === c[R] && J--;
        var se = Co(c, h, j), ye = So(c, h, J);
        F = w(se, ye), $ = h >= j && h <= J ? c.substring(j, h) : "", G = !1;
      } else
        F = w(R, N), $ = c.substring(R, h), G = !0;
      if (l.length > 0)
        for (var Ce = g.toLowerCase(), he = _.toLowerCase(), He = w(R, N), be = 0, Ln = l; be < Ln.length; be++) {
          var En = Ln[be];
          En.onHtmlAttributeValue && En.onHtmlAttributeValue({ document: t, position: n, tag: Ce, attribute: he, value: $, range: He });
        }
      return u.forEach(function(ea) {
        ea.provideValues(g, _).forEach(function(ht) {
          var Mn = G ? '"' + ht.name + '"' : ht.name;
          s.items.push({
            label: ht.name,
            filterText: Mn,
            kind: ue.Unit,
            documentation: We(ht, void 0, o),
            textEdit: ee.replace(F, Mn),
            insertTextFormat: we.PlainText
          });
        });
      }), C(), s;
    }
    function b(R) {
      return h === f.getTokenEnd() && (W = f.scan(), W === R && f.getTokenOffset() === h) ? f.getTokenEnd() : h;
    }
    function I() {
      for (var R = 0, N = l; R < N.length; R++) {
        var F = N[R];
        F.onHtmlContent && F.onHtmlContent({ document: t, position: n });
      }
      return C();
    }
    function C() {
      for (var R = h - 1, N = n.character; R >= 0 && et(c, R); )
        R--, N--;
      if (R >= 0 && c[R] === "&") {
        var F = X.create(ne.create(n.line, N - 1), n);
        for (var G in nt)
          if (no(G, ";")) {
            var $ = "&" + G;
            s.items.push({
              label: $,
              kind: ue.Keyword,
              documentation: To("entity.propose", "Character entity representing '".concat(nt[G], "'")),
              textEdit: ee.replace(F, $),
              insertTextFormat: we.PlainText
            });
          }
      }
      return s;
    }
    function x(R, N) {
      var F = w(R, N);
      s.items.push({
        label: "!DOCTYPE",
        kind: ue.Property,
        documentation: "A preamble for an HTML document.",
        textEdit: ee.replace(F, "!DOCTYPE html>"),
        insertTextFormat: we.PlainText
      });
    }
    for (var W = f.scan(); W !== U.EOS && f.getTokenOffset() <= h; ) {
      switch (W) {
        case U.StartTagOpen:
          if (f.getTokenEnd() === h) {
            var P = b(U.StartTag);
            return n.line === 0 && x(h, P), M(h, P);
          }
          break;
        case U.StartTag:
          if (f.getTokenOffset() <= h && h <= f.getTokenEnd())
            return y(f.getTokenOffset(), f.getTokenEnd());
          g = f.getTokenText();
          break;
        case U.AttributeName:
          if (f.getTokenOffset() <= h && h <= f.getTokenEnd())
            return D(f.getTokenOffset(), f.getTokenEnd());
          _ = f.getTokenText();
          break;
        case U.DelimiterAssign:
          if (f.getTokenEnd() === h) {
            var P = b(U.AttributeValue);
            return m(h, P);
          }
          break;
        case U.AttributeValue:
          if (f.getTokenOffset() <= h && h <= f.getTokenEnd())
            return m(f.getTokenOffset(), f.getTokenEnd());
          break;
        case U.Whitespace:
          if (h <= f.getTokenEnd())
            switch (f.getScannerState()) {
              case O.AfterOpeningStartTag:
                var B = f.getTokenOffset(), q = b(U.StartTag);
                return M(B, q);
              case O.WithinTag:
              case O.AfterAttributeName:
                return D(f.getTokenEnd());
              case O.BeforeAttributeValue:
                return m(f.getTokenEnd());
              case O.AfterOpeningEndTag:
                return v(f.getTokenOffset() - 1, !1);
              case O.WithinContent:
                return I();
            }
          break;
        case U.EndTagOpen:
          if (h <= f.getTokenEnd()) {
            var S = f.getTokenOffset() + 1, T = b(U.EndTag);
            return v(S, !1, T);
          }
          break;
        case U.EndTag:
          if (h <= f.getTokenEnd())
            for (var E = f.getTokenOffset() - 1; E >= 0; ) {
              var H = c.charAt(E);
              if (H === "/")
                return v(E, !1, f.getTokenEnd());
              if (!Ht(H))
                break;
              E--;
            }
          break;
        case U.StartTagClose:
          if (h <= f.getTokenEnd() && g)
            return L(f.getTokenEnd(), g);
          break;
        case U.Content:
          if (h <= f.getTokenEnd())
            return I();
          break;
        default:
          if (h <= f.getTokenEnd())
            return s;
          break;
      }
      W = f.scan();
    }
    return s;
  }, e.prototype.doQuoteComplete = function(t, n, r, i) {
    var s, l = t.offsetAt(n);
    if (l <= 0)
      return null;
    var u = (s = i == null ? void 0 : i.attributeDefaultValue) !== null && s !== void 0 ? s : "doublequotes";
    if (u === "empty")
      return null;
    var o = t.getText().charAt(l - 1);
    if (o !== "=")
      return null;
    var c = u === "doublequotes" ? '"$1"' : "'$1'", h = r.findNodeBefore(l);
    if (h && h.attributes && h.start < l && (!h.endTagStart || h.endTagStart > l))
      for (var d = pe(t.getText(), h.start), f = d.scan(); f !== U.EOS && d.getTokenEnd() <= l; ) {
        if (f === U.AttributeName && d.getTokenEnd() === l - 1)
          return f = d.scan(), f !== U.DelimiterAssign || (f = d.scan(), f === U.Unknown || f === U.AttributeValue) ? null : c;
        f = d.scan();
      }
    return null;
  }, e.prototype.doTagComplete = function(t, n, r) {
    var i = t.offsetAt(n);
    if (i <= 0)
      return null;
    var s = t.getText().charAt(i - 1);
    if (s === ">") {
      var l = r.findNodeBefore(i);
      if (l && l.tag && !Ut(l.tag) && l.start < i && (!l.endTagStart || l.endTagStart > i))
        for (var u = pe(t.getText(), l.start), o = u.scan(); o !== U.EOS && u.getTokenEnd() <= i; ) {
          if (o === U.StartTagClose && u.getTokenEnd() === i)
            return "$0</".concat(l.tag, ">");
          o = u.scan();
        }
    } else if (s === "/") {
      for (var l = r.findNodeBefore(i); l && l.closed && !(l.endTagStart && l.endTagStart > i); )
        l = l.parent;
      if (l && l.tag)
        for (var u = pe(t.getText(), l.start), o = u.scan(); o !== U.EOS && u.getTokenEnd() <= i; ) {
          if (o === U.EndTagOpen && u.getTokenEnd() === i)
            return "".concat(l.tag, ">");
          o = u.scan();
        }
    }
    return null;
  }, e.prototype.convertCompletionList = function(t) {
    return this.doesSupportMarkdown() || t.items.forEach(function(n) {
      n.documentation && typeof n.documentation != "string" && (n.documentation = {
        kind: "plaintext",
        value: n.documentation.value
      });
    }), t;
  }, e.prototype.doesSupportMarkdown = function() {
    var t, n, r;
    if (!It(this.supportsMarkdown)) {
      if (!It(this.lsOptions.clientCapabilities))
        return this.supportsMarkdown = !0, this.supportsMarkdown;
      var i = (r = (n = (t = this.lsOptions.clientCapabilities.textDocument) === null || t === void 0 ? void 0 : t.completion) === null || n === void 0 ? void 0 : n.completionItem) === null || r === void 0 ? void 0 : r.documentationFormat;
      this.supportsMarkdown = Array.isArray(i) && i.indexOf(ve.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }, e;
}();
function Ao(e) {
  return /^["']*$/.test(e);
}
function Ht(e) {
  return /^\s*$/.test(e);
}
function Ti(e, t, n, r) {
  for (var i = pe(e, t, n), s = i.scan(); s === U.Whitespace; )
    s = i.scan();
  return s === r;
}
function Co(e, t, n) {
  for (; t > n && !Ht(e[t - 1]); )
    t--;
  return t;
}
function So(e, t, n) {
  for (; t < n && !Ht(e[t]); )
    t++;
  return t;
}
var xo = xn(), Lo = function() {
  function e(t, n) {
    this.lsOptions = t, this.dataManager = n;
  }
  return e.prototype.doHover = function(t, n, r, i) {
    var s = this.convertContents.bind(this), l = this.doesSupportMarkdown(), u = t.offsetAt(n), o = r.findNodeAt(u), c = t.getText();
    if (!o || !o.tag)
      return null;
    var h = this.dataManager.getDataProviders().filter(function(x) {
      return x.isApplicable(t.languageId);
    });
    function d(x, W, P) {
      for (var B = function(H) {
        var R = null;
        if (H.provideTags().forEach(function(N) {
          if (N.name.toLowerCase() === x.toLowerCase()) {
            var F = We(N, i, l);
            F || (F = {
              kind: l ? "markdown" : "plaintext",
              value: ""
            }), R = { contents: F, range: W };
          }
        }), R)
          return R.contents = s(R.contents), { value: R };
      }, q = 0, S = h; q < S.length; q++) {
        var T = S[q], E = B(T);
        if (typeof E == "object")
          return E.value;
      }
      return null;
    }
    function f(x, W, P) {
      for (var B = function(H) {
        var R = null;
        if (H.provideAttributes(x).forEach(function(N) {
          if (W === N.name && N.description) {
            var F = We(N, i, l);
            F ? R = { contents: F, range: P } : R = null;
          }
        }), R)
          return R.contents = s(R.contents), { value: R };
      }, q = 0, S = h; q < S.length; q++) {
        var T = S[q], E = B(T);
        if (typeof E == "object")
          return E.value;
      }
      return null;
    }
    function g(x, W, P, B) {
      for (var q = function(R) {
        var N = null;
        if (R.provideValues(x, W).forEach(function(F) {
          if (P === F.name && F.description) {
            var G = We(F, i, l);
            G ? N = { contents: G, range: B } : N = null;
          }
        }), N)
          return N.contents = s(N.contents), { value: N };
      }, S = 0, T = h; S < T.length; S++) {
        var E = T[S], H = q(E);
        if (typeof H == "object")
          return H.value;
      }
      return null;
    }
    function _(x, W) {
      var P = k(x);
      for (var B in nt) {
        var q = null, S = "&" + B;
        if (P === S) {
          var T = nt[B].charCodeAt(0).toString(16).toUpperCase(), E = "U+";
          if (T.length < 4)
            for (var H = 4 - T.length, R = 0; R < H; )
              E += "0", R += 1;
          E += T;
          var N = xo("entity.propose", "Character entity representing '".concat(nt[B], "', unicode equivalent '").concat(E, "'"));
          N ? q = { contents: N, range: W } : q = null;
        }
        if (q)
          return q.contents = s(q.contents), q;
      }
      return null;
    }
    function w(x, W) {
      for (var P = pe(t.getText(), W), B = P.scan(); B !== U.EOS && (P.getTokenEnd() < u || P.getTokenEnd() === u && B !== x); )
        B = P.scan();
      return B === x && u <= P.getTokenEnd() ? { start: t.positionAt(P.getTokenOffset()), end: t.positionAt(P.getTokenEnd()) } : null;
    }
    function y() {
      for (var x = u - 1, W = n.character; x >= 0 && et(c, x); )
        x--, W--;
      for (var P = x + 1, B = W; et(c, P); )
        P++, B++;
      if (x >= 0 && c[x] === "&") {
        var q = null;
        return c[P] === ";" ? q = X.create(ne.create(n.line, W), ne.create(n.line, B + 1)) : q = X.create(ne.create(n.line, W), ne.create(n.line, B)), q;
      }
      return null;
    }
    function k(x) {
      for (var W = u - 1, P = "&"; W >= 0 && et(x, W); )
        W--;
      for (W = W + 1; et(x, W); )
        P += x[W], W += 1;
      return P += ";", P;
    }
    if (o.endTagStart && u >= o.endTagStart) {
      var v = w(U.EndTag, o.endTagStart);
      return v ? d(o.tag, v) : null;
    }
    var L = w(U.StartTag, o.start);
    if (L)
      return d(o.tag, L);
    var M = w(U.AttributeName, o.start);
    if (M) {
      var z = o.tag, D = t.getText(M);
      return f(z, D, M);
    }
    var p = y();
    if (p)
      return _(c, p);
    function m(x, W) {
      for (var P = pe(t.getText(), x), B = P.scan(), q = void 0; B !== U.EOS && P.getTokenEnd() <= W; )
        B = P.scan(), B === U.AttributeName && (q = P.getTokenText());
      return q;
    }
    var b = w(U.AttributeValue, o.start);
    if (b) {
      var z = o.tag, I = Eo(t.getText(b)), C = m(o.start, t.offsetAt(b.start));
      if (C)
        return g(z, C, I, b);
    }
    return null;
  }, e.prototype.convertContents = function(t) {
    if (!this.doesSupportMarkdown()) {
      if (typeof t == "string")
        return t;
      if ("kind" in t)
        return {
          kind: "plaintext",
          value: t.value
        };
      if (Array.isArray(t))
        t.map(function(n) {
          return typeof n == "string" ? n : n.value;
        });
      else
        return t.value;
    }
    return t;
  }, e.prototype.doesSupportMarkdown = function() {
    var t, n, r;
    if (!It(this.supportsMarkdown)) {
      if (!It(this.lsOptions.clientCapabilities))
        return this.supportsMarkdown = !0, this.supportsMarkdown;
      var i = (r = (n = (t = this.lsOptions.clientCapabilities) === null || t === void 0 ? void 0 : t.textDocument) === null || n === void 0 ? void 0 : n.hover) === null || r === void 0 ? void 0 : r.contentFormat;
      this.supportsMarkdown = Array.isArray(i) && i.indexOf(ve.Markdown) !== -1;
    }
    return this.supportsMarkdown;
  }, e;
}();
function Eo(e) {
  return e.length <= 1 ? e.replace(/['"]/, "") : ((e[0] === "'" || e[0] === '"') && (e = e.slice(1)), (e[e.length - 1] === "'" || e[e.length - 1] === '"') && (e = e.slice(0, -1)), e);
}
function Mo(e, t) {
  return e;
}
var Qi;
(function() {
  var e = [
    ,
    ,
    function(i) {
      function s(o) {
        this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
      }
      s.prototype.clone_empty = function() {
        var o = new s(this.__parent);
        return o.set_indent(this.__indent_count, this.__alignment_count), o;
      }, s.prototype.item = function(o) {
        return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
      }, s.prototype.has_match = function(o) {
        for (var c = this.__items.length - 1; c >= 0; c--)
          if (this.__items[c].match(o))
            return !0;
        return !1;
      }, s.prototype.set_indent = function(o, c) {
        this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = c || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
      }, s.prototype._set_wrap_point = function() {
        this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
      }, s.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      }, s.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var o = this.__parent.current_line;
          return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
        }
        return !1;
      }, s.prototype.is_empty = function() {
        return this.__items.length === 0;
      }, s.prototype.last = function() {
        return this.is_empty() ? null : this.__items[this.__items.length - 1];
      }, s.prototype.push = function(o) {
        this.__items.push(o);
        var c = o.lastIndexOf(`
`);
        c !== -1 ? this.__character_count = o.length - c : this.__character_count += o.length;
      }, s.prototype.pop = function() {
        var o = null;
        return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
      }, s.prototype._remove_indent = function() {
        this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
      }, s.prototype._remove_wrap_indent = function() {
        this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
      }, s.prototype.trim = function() {
        for (; this.last() === " "; )
          this.__items.pop(), this.__character_count -= 1;
      }, s.prototype.toString = function() {
        var o = "";
        return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
      };
      function l(o, c) {
        this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), c = c || "", o.indent_level > 0 && (c = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = c, this.__base_string_length = c.length;
      }
      l.prototype.get_indent_size = function(o, c) {
        var h = this.__base_string_length;
        return c = c || 0, o < 0 && (h = 0), h += o * this.__indent_size, h += c, h;
      }, l.prototype.get_indent_string = function(o, c) {
        var h = this.__base_string;
        return c = c || 0, o < 0 && (o = 0, h = ""), c += o * this.__indent_size, this.__ensure_cache(c), h += this.__cache[c], h;
      }, l.prototype.__ensure_cache = function(o) {
        for (; o >= this.__cache.length; )
          this.__add_column();
      }, l.prototype.__add_column = function() {
        var o = this.__cache.length, c = 0, h = "";
        this.__indent_size && o >= this.__indent_size && (c = Math.floor(o / this.__indent_size), o -= c * this.__indent_size, h = new Array(c + 1).join(this.__indent_string)), o && (h += new Array(o + 1).join(" ")), this.__cache.push(h);
      };
      function u(o, c) {
        this.__indent_cache = new l(o, c), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new s(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
      }
      u.prototype.__add_outputline = function() {
        this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
      }, u.prototype.get_line_number = function() {
        return this.__lines.length;
      }, u.prototype.get_indent_string = function(o, c) {
        return this.__indent_cache.get_indent_string(o, c);
      }, u.prototype.get_indent_size = function(o, c) {
        return this.__indent_cache.get_indent_size(o, c);
      }, u.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      }, u.prototype.add_new_line = function(o) {
        return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
      }, u.prototype.get_code = function(o) {
        this.trim(!0);
        var c = this.current_line.pop();
        c && (c[c.length - 1] === `
` && (c = c.replace(/\n+$/g, "")), this.current_line.push(c)), this._end_with_newline && this.__add_outputline();
        var h = this.__lines.join(`
`);
        return o !== `
` && (h = h.replace(/[\n]/g, o)), h;
      }, u.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      }, u.prototype.set_indent = function(o, c) {
        return o = o || 0, c = c || 0, this.next_line.set_indent(o, c), this.__lines.length > 1 ? (this.current_line.set_indent(o, c), !0) : (this.current_line.set_indent(), !1);
      }, u.prototype.add_raw_token = function(o) {
        for (var c = 0; c < o.newlines; c++)
          this.__add_outputline();
        this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
      }, u.prototype.add_token = function(o) {
        this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
      }, u.prototype.__add_space_before_token = function() {
        this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
      }, u.prototype.remove_indent = function(o) {
        for (var c = this.__lines.length; o < c; )
          this.__lines[o]._remove_indent(), o++;
        this.current_line._remove_wrap_indent();
      }, u.prototype.trim = function(o) {
        for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty(); )
          this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      }, u.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      }, u.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      }, u.prototype.ensure_empty_line_above = function(o, c) {
        for (var h = this.__lines.length - 2; h >= 0; ) {
          var d = this.__lines[h];
          if (d.is_empty())
            break;
          if (d.item(0).indexOf(o) !== 0 && d.item(-1) !== c) {
            this.__lines.splice(h + 1, 0, new s(this)), this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          h--;
        }
      }, i.exports.Output = u;
    },
    ,
    ,
    ,
    function(i) {
      function s(o, c) {
        this.raw_options = l(o, c), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      s.prototype._get_array = function(o, c) {
        var h = this.raw_options[o], d = c || [];
        return typeof h == "object" ? h !== null && typeof h.concat == "function" && (d = h.concat()) : typeof h == "string" && (d = h.split(/[^a-zA-Z0-9_\/\-]+/)), d;
      }, s.prototype._get_boolean = function(o, c) {
        var h = this.raw_options[o], d = h === void 0 ? !!c : !!h;
        return d;
      }, s.prototype._get_characters = function(o, c) {
        var h = this.raw_options[o], d = c || "";
        return typeof h == "string" && (d = h.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), d;
      }, s.prototype._get_number = function(o, c) {
        var h = this.raw_options[o];
        c = parseInt(c, 10), isNaN(c) && (c = 0);
        var d = parseInt(h, 10);
        return isNaN(d) && (d = c), d;
      }, s.prototype._get_selection = function(o, c, h) {
        var d = this._get_selection_list(o, c, h);
        if (d.length !== 1)
          throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + c + `
You passed in: '` + this.raw_options[o] + "'");
        return d[0];
      }, s.prototype._get_selection_list = function(o, c, h) {
        if (!c || c.length === 0)
          throw new Error("Selection list cannot be empty.");
        if (h = h || [c[0]], !this._is_valid_selection(h, c))
          throw new Error("Invalid Default Value!");
        var d = this._get_array(o, h);
        if (!this._is_valid_selection(d, c))
          throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + c + `
You passed in: '` + this.raw_options[o] + "'");
        return d;
      }, s.prototype._is_valid_selection = function(o, c) {
        return o.length && c.length && !o.some(function(h) {
          return c.indexOf(h) === -1;
        });
      };
      function l(o, c) {
        var h = {};
        o = u(o);
        var d;
        for (d in o)
          d !== c && (h[d] = o[d]);
        if (c && o[c])
          for (d in o[c])
            h[d] = o[c][d];
        return h;
      }
      function u(o) {
        var c = {}, h;
        for (h in o) {
          var d = h.replace(/-/g, "_");
          c[d] = o[h];
        }
        return c;
      }
      i.exports.Options = s, i.exports.normalizeOpts = u, i.exports.mergeOpts = l;
    },
    ,
    function(i) {
      var s = RegExp.prototype.hasOwnProperty("sticky");
      function l(u) {
        this.__input = u || "", this.__input_length = this.__input.length, this.__position = 0;
      }
      l.prototype.restart = function() {
        this.__position = 0;
      }, l.prototype.back = function() {
        this.__position > 0 && (this.__position -= 1);
      }, l.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      }, l.prototype.next = function() {
        var u = null;
        return this.hasNext() && (u = this.__input.charAt(this.__position), this.__position += 1), u;
      }, l.prototype.peek = function(u) {
        var o = null;
        return u = u || 0, u += this.__position, u >= 0 && u < this.__input_length && (o = this.__input.charAt(u)), o;
      }, l.prototype.__match = function(u, o) {
        u.lastIndex = o;
        var c = u.exec(this.__input);
        return c && !(s && u.sticky) && c.index !== o && (c = null), c;
      }, l.prototype.test = function(u, o) {
        return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(u, o) : !1;
      }, l.prototype.testChar = function(u, o) {
        var c = this.peek(o);
        return u.lastIndex = 0, c !== null && u.test(c);
      }, l.prototype.match = function(u) {
        var o = this.__match(u, this.__position);
        return o ? this.__position += o[0].length : o = null, o;
      }, l.prototype.read = function(u, o, c) {
        var h = "", d;
        return u && (d = this.match(u), d && (h += d[0])), o && (d || !u) && (h += this.readUntil(o, c)), h;
      }, l.prototype.readUntil = function(u, o) {
        var c = "", h = this.__position;
        u.lastIndex = this.__position;
        var d = u.exec(this.__input);
        return d ? (h = d.index, o && (h += d[0].length)) : h = this.__input_length, c = this.__input.substring(this.__position, h), this.__position = h, c;
      }, l.prototype.readUntilAfter = function(u) {
        return this.readUntil(u, !0);
      }, l.prototype.get_regexp = function(u, o) {
        var c = null, h = "g";
        return o && s && (h = "y"), typeof u == "string" && u !== "" ? c = new RegExp(u, h) : u && (c = new RegExp(u.source, h)), c;
      }, l.prototype.get_literal_regexp = function(u) {
        return RegExp(u.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      }, l.prototype.peekUntilAfter = function(u) {
        var o = this.__position, c = this.readUntilAfter(u);
        return this.__position = o, c;
      }, l.prototype.lookBack = function(u) {
        var o = this.__position - 1;
        return o >= u.length && this.__input.substring(o - u.length, o).toLowerCase() === u;
      }, i.exports.InputScanner = l;
    },
    ,
    ,
    ,
    ,
    function(i) {
      function s(l, u) {
        l = typeof l == "string" ? l : l.source, u = typeof u == "string" ? u : u.source, this.__directives_block_pattern = new RegExp(l + / beautify( \w+[:]\w+)+ /.source + u, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(l + /\sbeautify\signore:end\s/.source + u, "g");
      }
      s.prototype.get_directives = function(l) {
        if (!l.match(this.__directives_block_pattern))
          return null;
        var u = {};
        this.__directive_pattern.lastIndex = 0;
        for (var o = this.__directive_pattern.exec(l); o; )
          u[o[1]] = o[2], o = this.__directive_pattern.exec(l);
        return u;
      }, s.prototype.readIgnored = function(l) {
        return l.readUntilAfter(this.__directives_end_ignore_pattern);
      }, i.exports.Directives = s;
    },
    ,
    function(i, s, l) {
      var u = l(16).Beautifier, o = l(17).Options;
      function c(h, d) {
        var f = new u(h, d);
        return f.beautify();
      }
      i.exports = c, i.exports.defaultOptions = function() {
        return new o();
      };
    },
    function(i, s, l) {
      var u = l(17).Options, o = l(2).Output, c = l(8).InputScanner, h = l(13).Directives, d = new h(/\/\*/, /\*\//), f = /\r\n|[\r\n]/, g = /\r\n|[\r\n]/g, _ = /\s/, w = /(?:\s|\n)+/g, y = /\/\*(?:[\s\S]*?)((?:\*\/)|$)/g, k = /\/\/(?:[^\n\r\u2028\u2029]*)/g;
      function v(L, M) {
        this._source_text = L || "", this._options = new u(M), this._ch = null, this._input = null, this.NESTED_AT_RULE = {
          "@page": !0,
          "@font-face": !0,
          "@keyframes": !0,
          "@media": !0,
          "@supports": !0,
          "@document": !0
        }, this.CONDITIONAL_GROUP_RULE = {
          "@media": !0,
          "@supports": !0,
          "@document": !0
        };
      }
      v.prototype.eatString = function(L) {
        var M = "";
        for (this._ch = this._input.next(); this._ch; ) {
          if (M += this._ch, this._ch === "\\")
            M += this._input.next();
          else if (L.indexOf(this._ch) !== -1 || this._ch === `
`)
            break;
          this._ch = this._input.next();
        }
        return M;
      }, v.prototype.eatWhitespace = function(L) {
        for (var M = _.test(this._input.peek()), z = 0; _.test(this._input.peek()); )
          this._ch = this._input.next(), L && this._ch === `
` && (z === 0 || z < this._options.max_preserve_newlines) && (z++, this._output.add_new_line(!0));
        return M;
      }, v.prototype.foundNestedPseudoClass = function() {
        for (var L = 0, M = 1, z = this._input.peek(M); z; ) {
          if (z === "{")
            return !0;
          if (z === "(")
            L += 1;
          else if (z === ")") {
            if (L === 0)
              return !1;
            L -= 1;
          } else if (z === ";" || z === "}")
            return !1;
          M++, z = this._input.peek(M);
        }
        return !1;
      }, v.prototype.print_string = function(L) {
        this._output.set_indent(this._indentLevel), this._output.non_breaking_space = !0, this._output.add_token(L);
      }, v.prototype.preserveSingleSpace = function(L) {
        L && (this._output.space_before_token = !0);
      }, v.prototype.indent = function() {
        this._indentLevel++;
      }, v.prototype.outdent = function() {
        this._indentLevel > 0 && this._indentLevel--;
      }, v.prototype.beautify = function() {
        if (this._options.disabled)
          return this._source_text;
        var L = this._source_text, M = this._options.eol;
        M === "auto" && (M = `
`, L && f.test(L || "") && (M = L.match(f)[0])), L = L.replace(g, `
`);
        var z = L.match(/^[\t ]*/)[0];
        this._output = new o(this._options, z), this._input = new c(L), this._indentLevel = 0, this._nestedLevel = 0, this._ch = null;
        for (var D = 0, p = !1, m = !1, b = !1, I = !1, C = !1, x = this._ch, W, P, B; W = this._input.read(w), P = W !== "", B = x, this._ch = this._input.next(), this._ch === "\\" && this._input.hasNext() && (this._ch += this._input.next()), x = this._ch, this._ch; )
          if (this._ch === "/" && this._input.peek() === "*") {
            this._output.add_new_line(), this._input.back();
            var q = this._input.read(y), S = d.get_directives(q);
            S && S.ignore === "start" && (q += d.readIgnored(this._input)), this.print_string(q), this.eatWhitespace(!0), this._output.add_new_line();
          } else if (this._ch === "/" && this._input.peek() === "/")
            this._output.space_before_token = !0, this._input.back(), this.print_string(this._input.read(k)), this.eatWhitespace(!0);
          else if (this._ch === "@")
            if (this.preserveSingleSpace(P), this._input.peek() === "{")
              this.print_string(this._ch + this.eatString("}"));
            else {
              this.print_string(this._ch);
              var T = this._input.peekUntilAfter(/[: ,;{}()[\]\/='"]/g);
              T.match(/[ :]$/) && (T = this.eatString(": ").replace(/\s$/, ""), this.print_string(T), this._output.space_before_token = !0), T = T.replace(/\s$/, ""), T === "extend" ? I = !0 : T === "import" && (C = !0), T in this.NESTED_AT_RULE ? (this._nestedLevel += 1, T in this.CONDITIONAL_GROUP_RULE && (b = !0)) : !p && D === 0 && T.indexOf(":") !== -1 && (m = !0, this.indent());
            }
          else
            this._ch === "#" && this._input.peek() === "{" ? (this.preserveSingleSpace(P), this.print_string(this._ch + this.eatString("}"))) : this._ch === "{" ? (m && (m = !1, this.outdent()), b ? (b = !1, p = this._indentLevel >= this._nestedLevel) : p = this._indentLevel >= this._nestedLevel - 1, this._options.newline_between_rules && p && this._output.previous_line && this._output.previous_line.item(-1) !== "{" && this._output.ensure_empty_line_above("/", ","), this._output.space_before_token = !0, this._options.brace_style === "expand" ? (this._output.add_new_line(), this.print_string(this._ch), this.indent(), this._output.set_indent(this._indentLevel)) : (this.indent(), this.print_string(this._ch)), this.eatWhitespace(!0), this._output.add_new_line()) : this._ch === "}" ? (this.outdent(), this._output.add_new_line(), B === "{" && this._output.trim(!0), C = !1, I = !1, m && (this.outdent(), m = !1), this.print_string(this._ch), p = !1, this._nestedLevel && this._nestedLevel--, this.eatWhitespace(!0), this._output.add_new_line(), this._options.newline_between_rules && !this._output.just_added_blankline() && this._input.peek() !== "}" && this._output.add_new_line(!0)) : this._ch === ":" ? (p || b) && !(this._input.lookBack("&") || this.foundNestedPseudoClass()) && !this._input.lookBack("(") && !I && D === 0 ? (this.print_string(":"), m || (m = !0, this._output.space_before_token = !0, this.eatWhitespace(!0), this.indent())) : (this._input.lookBack(" ") && (this._output.space_before_token = !0), this._input.peek() === ":" ? (this._ch = this._input.next(), this.print_string("::")) : this.print_string(":")) : this._ch === '"' || this._ch === "'" ? (this.preserveSingleSpace(P), this.print_string(this._ch + this.eatString(this._ch)), this.eatWhitespace(!0)) : this._ch === ";" ? D === 0 ? (m && (this.outdent(), m = !1), I = !1, C = !1, this.print_string(this._ch), this.eatWhitespace(!0), this._input.peek() !== "/" && this._output.add_new_line()) : (this.print_string(this._ch), this.eatWhitespace(!0), this._output.space_before_token = !0) : this._ch === "(" ? this._input.lookBack("url") ? (this.print_string(this._ch), this.eatWhitespace(), D++, this.indent(), this._ch = this._input.next(), this._ch === ")" || this._ch === '"' || this._ch === "'" ? this._input.back() : this._ch && (this.print_string(this._ch + this.eatString(")")), D && (D--, this.outdent()))) : (this.preserveSingleSpace(P), this.print_string(this._ch), this.eatWhitespace(), D++, this.indent()) : this._ch === ")" ? (D && (D--, this.outdent()), this.print_string(this._ch)) : this._ch === "," ? (this.print_string(this._ch), this.eatWhitespace(!0), this._options.selector_separator_newline && !m && D === 0 && !C && !I ? this._output.add_new_line() : this._output.space_before_token = !0) : (this._ch === ">" || this._ch === "+" || this._ch === "~") && !m && D === 0 ? this._options.space_around_combinator ? (this._output.space_before_token = !0, this.print_string(this._ch), this._output.space_before_token = !0) : (this.print_string(this._ch), this.eatWhitespace(), this._ch && _.test(this._ch) && (this._ch = "")) : this._ch === "]" ? this.print_string(this._ch) : this._ch === "[" ? (this.preserveSingleSpace(P), this.print_string(this._ch)) : this._ch === "=" ? (this.eatWhitespace(), this.print_string("="), _.test(this._ch) && (this._ch = "")) : this._ch === "!" && !this._input.lookBack("\\") ? (this.print_string(" "), this.print_string(this._ch)) : (this.preserveSingleSpace(P), this.print_string(this._ch));
        var E = this._output.get_code(M);
        return E;
      }, i.exports.Beautifier = v;
    },
    function(i, s, l) {
      var u = l(6).Options;
      function o(c) {
        u.call(this, c, "css"), this.selector_separator_newline = this._get_boolean("selector_separator_newline", !0), this.newline_between_rules = this._get_boolean("newline_between_rules", !0);
        var h = this._get_boolean("space_around_selector_separator");
        this.space_around_combinator = this._get_boolean("space_around_combinator") || h;
        var d = this._get_selection_list("brace_style", ["collapse", "expand", "end-expand", "none", "preserve-inline"]);
        this.brace_style = "collapse";
        for (var f = 0; f < d.length; f++)
          d[f] !== "expand" ? this.brace_style = "collapse" : this.brace_style = d[f];
      }
      o.prototype = new u(), i.exports.Options = o;
    }
  ], t = {};
  function n(i) {
    var s = t[i];
    if (s !== void 0)
      return s.exports;
    var l = t[i] = {
      exports: {}
    };
    return e[i](l, l.exports, n), l.exports;
  }
  var r = n(15);
  Qi = r;
})();
var Do = Qi, Yi;
(function() {
  var e = [
    ,
    ,
    function(i) {
      function s(o) {
        this.__parent = o, this.__character_count = 0, this.__indent_count = -1, this.__alignment_count = 0, this.__wrap_point_index = 0, this.__wrap_point_character_count = 0, this.__wrap_point_indent_count = -1, this.__wrap_point_alignment_count = 0, this.__items = [];
      }
      s.prototype.clone_empty = function() {
        var o = new s(this.__parent);
        return o.set_indent(this.__indent_count, this.__alignment_count), o;
      }, s.prototype.item = function(o) {
        return o < 0 ? this.__items[this.__items.length + o] : this.__items[o];
      }, s.prototype.has_match = function(o) {
        for (var c = this.__items.length - 1; c >= 0; c--)
          if (this.__items[c].match(o))
            return !0;
        return !1;
      }, s.prototype.set_indent = function(o, c) {
        this.is_empty() && (this.__indent_count = o || 0, this.__alignment_count = c || 0, this.__character_count = this.__parent.get_indent_size(this.__indent_count, this.__alignment_count));
      }, s.prototype._set_wrap_point = function() {
        this.__parent.wrap_line_length && (this.__wrap_point_index = this.__items.length, this.__wrap_point_character_count = this.__character_count, this.__wrap_point_indent_count = this.__parent.next_line.__indent_count, this.__wrap_point_alignment_count = this.__parent.next_line.__alignment_count);
      }, s.prototype._should_wrap = function() {
        return this.__wrap_point_index && this.__character_count > this.__parent.wrap_line_length && this.__wrap_point_character_count > this.__parent.next_line.__character_count;
      }, s.prototype._allow_wrap = function() {
        if (this._should_wrap()) {
          this.__parent.add_new_line();
          var o = this.__parent.current_line;
          return o.set_indent(this.__wrap_point_indent_count, this.__wrap_point_alignment_count), o.__items = this.__items.slice(this.__wrap_point_index), this.__items = this.__items.slice(0, this.__wrap_point_index), o.__character_count += this.__character_count - this.__wrap_point_character_count, this.__character_count = this.__wrap_point_character_count, o.__items[0] === " " && (o.__items.splice(0, 1), o.__character_count -= 1), !0;
        }
        return !1;
      }, s.prototype.is_empty = function() {
        return this.__items.length === 0;
      }, s.prototype.last = function() {
        return this.is_empty() ? null : this.__items[this.__items.length - 1];
      }, s.prototype.push = function(o) {
        this.__items.push(o);
        var c = o.lastIndexOf(`
`);
        c !== -1 ? this.__character_count = o.length - c : this.__character_count += o.length;
      }, s.prototype.pop = function() {
        var o = null;
        return this.is_empty() || (o = this.__items.pop(), this.__character_count -= o.length), o;
      }, s.prototype._remove_indent = function() {
        this.__indent_count > 0 && (this.__indent_count -= 1, this.__character_count -= this.__parent.indent_size);
      }, s.prototype._remove_wrap_indent = function() {
        this.__wrap_point_indent_count > 0 && (this.__wrap_point_indent_count -= 1);
      }, s.prototype.trim = function() {
        for (; this.last() === " "; )
          this.__items.pop(), this.__character_count -= 1;
      }, s.prototype.toString = function() {
        var o = "";
        return this.is_empty() ? this.__parent.indent_empty_lines && (o = this.__parent.get_indent_string(this.__indent_count)) : (o = this.__parent.get_indent_string(this.__indent_count, this.__alignment_count), o += this.__items.join("")), o;
      };
      function l(o, c) {
        this.__cache = [""], this.__indent_size = o.indent_size, this.__indent_string = o.indent_char, o.indent_with_tabs || (this.__indent_string = new Array(o.indent_size + 1).join(o.indent_char)), c = c || "", o.indent_level > 0 && (c = new Array(o.indent_level + 1).join(this.__indent_string)), this.__base_string = c, this.__base_string_length = c.length;
      }
      l.prototype.get_indent_size = function(o, c) {
        var h = this.__base_string_length;
        return c = c || 0, o < 0 && (h = 0), h += o * this.__indent_size, h += c, h;
      }, l.prototype.get_indent_string = function(o, c) {
        var h = this.__base_string;
        return c = c || 0, o < 0 && (o = 0, h = ""), c += o * this.__indent_size, this.__ensure_cache(c), h += this.__cache[c], h;
      }, l.prototype.__ensure_cache = function(o) {
        for (; o >= this.__cache.length; )
          this.__add_column();
      }, l.prototype.__add_column = function() {
        var o = this.__cache.length, c = 0, h = "";
        this.__indent_size && o >= this.__indent_size && (c = Math.floor(o / this.__indent_size), o -= c * this.__indent_size, h = new Array(c + 1).join(this.__indent_string)), o && (h += new Array(o + 1).join(" ")), this.__cache.push(h);
      };
      function u(o, c) {
        this.__indent_cache = new l(o, c), this.raw = !1, this._end_with_newline = o.end_with_newline, this.indent_size = o.indent_size, this.wrap_line_length = o.wrap_line_length, this.indent_empty_lines = o.indent_empty_lines, this.__lines = [], this.previous_line = null, this.current_line = null, this.next_line = new s(this), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1, this.__add_outputline();
      }
      u.prototype.__add_outputline = function() {
        this.previous_line = this.current_line, this.current_line = this.next_line.clone_empty(), this.__lines.push(this.current_line);
      }, u.prototype.get_line_number = function() {
        return this.__lines.length;
      }, u.prototype.get_indent_string = function(o, c) {
        return this.__indent_cache.get_indent_string(o, c);
      }, u.prototype.get_indent_size = function(o, c) {
        return this.__indent_cache.get_indent_size(o, c);
      }, u.prototype.is_empty = function() {
        return !this.previous_line && this.current_line.is_empty();
      }, u.prototype.add_new_line = function(o) {
        return this.is_empty() || !o && this.just_added_newline() ? !1 : (this.raw || this.__add_outputline(), !0);
      }, u.prototype.get_code = function(o) {
        this.trim(!0);
        var c = this.current_line.pop();
        c && (c[c.length - 1] === `
` && (c = c.replace(/\n+$/g, "")), this.current_line.push(c)), this._end_with_newline && this.__add_outputline();
        var h = this.__lines.join(`
`);
        return o !== `
` && (h = h.replace(/[\n]/g, o)), h;
      }, u.prototype.set_wrap_point = function() {
        this.current_line._set_wrap_point();
      }, u.prototype.set_indent = function(o, c) {
        return o = o || 0, c = c || 0, this.next_line.set_indent(o, c), this.__lines.length > 1 ? (this.current_line.set_indent(o, c), !0) : (this.current_line.set_indent(), !1);
      }, u.prototype.add_raw_token = function(o) {
        for (var c = 0; c < o.newlines; c++)
          this.__add_outputline();
        this.current_line.set_indent(-1), this.current_line.push(o.whitespace_before), this.current_line.push(o.text), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = !1;
      }, u.prototype.add_token = function(o) {
        this.__add_space_before_token(), this.current_line.push(o), this.space_before_token = !1, this.non_breaking_space = !1, this.previous_token_wrapped = this.current_line._allow_wrap();
      }, u.prototype.__add_space_before_token = function() {
        this.space_before_token && !this.just_added_newline() && (this.non_breaking_space || this.set_wrap_point(), this.current_line.push(" "));
      }, u.prototype.remove_indent = function(o) {
        for (var c = this.__lines.length; o < c; )
          this.__lines[o]._remove_indent(), o++;
        this.current_line._remove_wrap_indent();
      }, u.prototype.trim = function(o) {
        for (o = o === void 0 ? !1 : o, this.current_line.trim(); o && this.__lines.length > 1 && this.current_line.is_empty(); )
          this.__lines.pop(), this.current_line = this.__lines[this.__lines.length - 1], this.current_line.trim();
        this.previous_line = this.__lines.length > 1 ? this.__lines[this.__lines.length - 2] : null;
      }, u.prototype.just_added_newline = function() {
        return this.current_line.is_empty();
      }, u.prototype.just_added_blankline = function() {
        return this.is_empty() || this.current_line.is_empty() && this.previous_line.is_empty();
      }, u.prototype.ensure_empty_line_above = function(o, c) {
        for (var h = this.__lines.length - 2; h >= 0; ) {
          var d = this.__lines[h];
          if (d.is_empty())
            break;
          if (d.item(0).indexOf(o) !== 0 && d.item(-1) !== c) {
            this.__lines.splice(h + 1, 0, new s(this)), this.previous_line = this.__lines[this.__lines.length - 2];
            break;
          }
          h--;
        }
      }, i.exports.Output = u;
    },
    function(i) {
      function s(l, u, o, c) {
        this.type = l, this.text = u, this.comments_before = null, this.newlines = o || 0, this.whitespace_before = c || "", this.parent = null, this.next = null, this.previous = null, this.opened = null, this.closed = null, this.directives = null;
      }
      i.exports.Token = s;
    },
    ,
    ,
    function(i) {
      function s(o, c) {
        this.raw_options = l(o, c), this.disabled = this._get_boolean("disabled"), this.eol = this._get_characters("eol", "auto"), this.end_with_newline = this._get_boolean("end_with_newline"), this.indent_size = this._get_number("indent_size", 4), this.indent_char = this._get_characters("indent_char", " "), this.indent_level = this._get_number("indent_level"), this.preserve_newlines = this._get_boolean("preserve_newlines", !0), this.max_preserve_newlines = this._get_number("max_preserve_newlines", 32786), this.preserve_newlines || (this.max_preserve_newlines = 0), this.indent_with_tabs = this._get_boolean("indent_with_tabs", this.indent_char === "	"), this.indent_with_tabs && (this.indent_char = "	", this.indent_size === 1 && (this.indent_size = 4)), this.wrap_line_length = this._get_number("wrap_line_length", this._get_number("max_char")), this.indent_empty_lines = this._get_boolean("indent_empty_lines"), this.templating = this._get_selection_list("templating", ["auto", "none", "django", "erb", "handlebars", "php", "smarty"], ["auto"]);
      }
      s.prototype._get_array = function(o, c) {
        var h = this.raw_options[o], d = c || [];
        return typeof h == "object" ? h !== null && typeof h.concat == "function" && (d = h.concat()) : typeof h == "string" && (d = h.split(/[^a-zA-Z0-9_\/\-]+/)), d;
      }, s.prototype._get_boolean = function(o, c) {
        var h = this.raw_options[o], d = h === void 0 ? !!c : !!h;
        return d;
      }, s.prototype._get_characters = function(o, c) {
        var h = this.raw_options[o], d = c || "";
        return typeof h == "string" && (d = h.replace(/\\r/, "\r").replace(/\\n/, `
`).replace(/\\t/, "	")), d;
      }, s.prototype._get_number = function(o, c) {
        var h = this.raw_options[o];
        c = parseInt(c, 10), isNaN(c) && (c = 0);
        var d = parseInt(h, 10);
        return isNaN(d) && (d = c), d;
      }, s.prototype._get_selection = function(o, c, h) {
        var d = this._get_selection_list(o, c, h);
        if (d.length !== 1)
          throw new Error("Invalid Option Value: The option '" + o + `' can only be one of the following values:
` + c + `
You passed in: '` + this.raw_options[o] + "'");
        return d[0];
      }, s.prototype._get_selection_list = function(o, c, h) {
        if (!c || c.length === 0)
          throw new Error("Selection list cannot be empty.");
        if (h = h || [c[0]], !this._is_valid_selection(h, c))
          throw new Error("Invalid Default Value!");
        var d = this._get_array(o, h);
        if (!this._is_valid_selection(d, c))
          throw new Error("Invalid Option Value: The option '" + o + `' can contain only the following values:
` + c + `
You passed in: '` + this.raw_options[o] + "'");
        return d;
      }, s.prototype._is_valid_selection = function(o, c) {
        return o.length && c.length && !o.some(function(h) {
          return c.indexOf(h) === -1;
        });
      };
      function l(o, c) {
        var h = {};
        o = u(o);
        var d;
        for (d in o)
          d !== c && (h[d] = o[d]);
        if (c && o[c])
          for (d in o[c])
            h[d] = o[c][d];
        return h;
      }
      function u(o) {
        var c = {}, h;
        for (h in o) {
          var d = h.replace(/-/g, "_");
          c[d] = o[h];
        }
        return c;
      }
      i.exports.Options = s, i.exports.normalizeOpts = u, i.exports.mergeOpts = l;
    },
    ,
    function(i) {
      var s = RegExp.prototype.hasOwnProperty("sticky");
      function l(u) {
        this.__input = u || "", this.__input_length = this.__input.length, this.__position = 0;
      }
      l.prototype.restart = function() {
        this.__position = 0;
      }, l.prototype.back = function() {
        this.__position > 0 && (this.__position -= 1);
      }, l.prototype.hasNext = function() {
        return this.__position < this.__input_length;
      }, l.prototype.next = function() {
        var u = null;
        return this.hasNext() && (u = this.__input.charAt(this.__position), this.__position += 1), u;
      }, l.prototype.peek = function(u) {
        var o = null;
        return u = u || 0, u += this.__position, u >= 0 && u < this.__input_length && (o = this.__input.charAt(u)), o;
      }, l.prototype.__match = function(u, o) {
        u.lastIndex = o;
        var c = u.exec(this.__input);
        return c && !(s && u.sticky) && c.index !== o && (c = null), c;
      }, l.prototype.test = function(u, o) {
        return o = o || 0, o += this.__position, o >= 0 && o < this.__input_length ? !!this.__match(u, o) : !1;
      }, l.prototype.testChar = function(u, o) {
        var c = this.peek(o);
        return u.lastIndex = 0, c !== null && u.test(c);
      }, l.prototype.match = function(u) {
        var o = this.__match(u, this.__position);
        return o ? this.__position += o[0].length : o = null, o;
      }, l.prototype.read = function(u, o, c) {
        var h = "", d;
        return u && (d = this.match(u), d && (h += d[0])), o && (d || !u) && (h += this.readUntil(o, c)), h;
      }, l.prototype.readUntil = function(u, o) {
        var c = "", h = this.__position;
        u.lastIndex = this.__position;
        var d = u.exec(this.__input);
        return d ? (h = d.index, o && (h += d[0].length)) : h = this.__input_length, c = this.__input.substring(this.__position, h), this.__position = h, c;
      }, l.prototype.readUntilAfter = function(u) {
        return this.readUntil(u, !0);
      }, l.prototype.get_regexp = function(u, o) {
        var c = null, h = "g";
        return o && s && (h = "y"), typeof u == "string" && u !== "" ? c = new RegExp(u, h) : u && (c = new RegExp(u.source, h)), c;
      }, l.prototype.get_literal_regexp = function(u) {
        return RegExp(u.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
      }, l.prototype.peekUntilAfter = function(u) {
        var o = this.__position, c = this.readUntilAfter(u);
        return this.__position = o, c;
      }, l.prototype.lookBack = function(u) {
        var o = this.__position - 1;
        return o >= u.length && this.__input.substring(o - u.length, o).toLowerCase() === u;
      }, i.exports.InputScanner = l;
    },
    function(i, s, l) {
      var u = l(8).InputScanner, o = l(3).Token, c = l(10).TokenStream, h = l(11).WhitespacePattern, d = {
        START: "TK_START",
        RAW: "TK_RAW",
        EOF: "TK_EOF"
      }, f = function(g, _) {
        this._input = new u(g), this._options = _ || {}, this.__tokens = null, this._patterns = {}, this._patterns.whitespace = new h(this._input);
      };
      f.prototype.tokenize = function() {
        this._input.restart(), this.__tokens = new c(), this._reset();
        for (var g, _ = new o(d.START, ""), w = null, y = [], k = new c(); _.type !== d.EOF; ) {
          for (g = this._get_next_token(_, w); this._is_comment(g); )
            k.add(g), g = this._get_next_token(_, w);
          k.isEmpty() || (g.comments_before = k, k = new c()), g.parent = w, this._is_opening(g) ? (y.push(w), w = g) : w && this._is_closing(g, w) && (g.opened = w, w.closed = g, w = y.pop(), g.parent = w), g.previous = _, _.next = g, this.__tokens.add(g), _ = g;
        }
        return this.__tokens;
      }, f.prototype._is_first_token = function() {
        return this.__tokens.isEmpty();
      }, f.prototype._reset = function() {
      }, f.prototype._get_next_token = function(g, _) {
        this._readWhitespace();
        var w = this._input.read(/.+/g);
        return w ? this._create_token(d.RAW, w) : this._create_token(d.EOF, "");
      }, f.prototype._is_comment = function(g) {
        return !1;
      }, f.prototype._is_opening = function(g) {
        return !1;
      }, f.prototype._is_closing = function(g, _) {
        return !1;
      }, f.prototype._create_token = function(g, _) {
        var w = new o(g, _, this._patterns.whitespace.newline_count, this._patterns.whitespace.whitespace_before_token);
        return w;
      }, f.prototype._readWhitespace = function() {
        return this._patterns.whitespace.read();
      }, i.exports.Tokenizer = f, i.exports.TOKEN = d;
    },
    function(i) {
      function s(l) {
        this.__tokens = [], this.__tokens_length = this.__tokens.length, this.__position = 0, this.__parent_token = l;
      }
      s.prototype.restart = function() {
        this.__position = 0;
      }, s.prototype.isEmpty = function() {
        return this.__tokens_length === 0;
      }, s.prototype.hasNext = function() {
        return this.__position < this.__tokens_length;
      }, s.prototype.next = function() {
        var l = null;
        return this.hasNext() && (l = this.__tokens[this.__position], this.__position += 1), l;
      }, s.prototype.peek = function(l) {
        var u = null;
        return l = l || 0, l += this.__position, l >= 0 && l < this.__tokens_length && (u = this.__tokens[l]), u;
      }, s.prototype.add = function(l) {
        this.__parent_token && (l.parent = this.__parent_token), this.__tokens.push(l), this.__tokens_length += 1;
      }, i.exports.TokenStream = s;
    },
    function(i, s, l) {
      var u = l(12).Pattern;
      function o(c, h) {
        u.call(this, c, h), h ? this._line_regexp = this._input.get_regexp(h._line_regexp) : this.__set_whitespace_patterns("", ""), this.newline_count = 0, this.whitespace_before_token = "";
      }
      o.prototype = new u(), o.prototype.__set_whitespace_patterns = function(c, h) {
        c += "\\t ", h += "\\n\\r", this._match_pattern = this._input.get_regexp("[" + c + h + "]+", !0), this._newline_regexp = this._input.get_regexp("\\r\\n|[" + h + "]");
      }, o.prototype.read = function() {
        this.newline_count = 0, this.whitespace_before_token = "";
        var c = this._input.read(this._match_pattern);
        if (c === " ")
          this.whitespace_before_token = " ";
        else if (c) {
          var h = this.__split(this._newline_regexp, c);
          this.newline_count = h.length - 1, this.whitespace_before_token = h[this.newline_count];
        }
        return c;
      }, o.prototype.matching = function(c, h) {
        var d = this._create();
        return d.__set_whitespace_patterns(c, h), d._update(), d;
      }, o.prototype._create = function() {
        return new o(this._input, this);
      }, o.prototype.__split = function(c, h) {
        c.lastIndex = 0;
        for (var d = 0, f = [], g = c.exec(h); g; )
          f.push(h.substring(d, g.index)), d = g.index + g[0].length, g = c.exec(h);
        return d < h.length ? f.push(h.substring(d, h.length)) : f.push(""), f;
      }, i.exports.WhitespacePattern = o;
    },
    function(i) {
      function s(l, u) {
        this._input = l, this._starting_pattern = null, this._match_pattern = null, this._until_pattern = null, this._until_after = !1, u && (this._starting_pattern = this._input.get_regexp(u._starting_pattern, !0), this._match_pattern = this._input.get_regexp(u._match_pattern, !0), this._until_pattern = this._input.get_regexp(u._until_pattern), this._until_after = u._until_after);
      }
      s.prototype.read = function() {
        var l = this._input.read(this._starting_pattern);
        return (!this._starting_pattern || l) && (l += this._input.read(this._match_pattern, this._until_pattern, this._until_after)), l;
      }, s.prototype.read_match = function() {
        return this._input.match(this._match_pattern);
      }, s.prototype.until_after = function(l) {
        var u = this._create();
        return u._until_after = !0, u._until_pattern = this._input.get_regexp(l), u._update(), u;
      }, s.prototype.until = function(l) {
        var u = this._create();
        return u._until_after = !1, u._until_pattern = this._input.get_regexp(l), u._update(), u;
      }, s.prototype.starting_with = function(l) {
        var u = this._create();
        return u._starting_pattern = this._input.get_regexp(l, !0), u._update(), u;
      }, s.prototype.matching = function(l) {
        var u = this._create();
        return u._match_pattern = this._input.get_regexp(l, !0), u._update(), u;
      }, s.prototype._create = function() {
        return new s(this._input, this);
      }, s.prototype._update = function() {
      }, i.exports.Pattern = s;
    },
    function(i) {
      function s(l, u) {
        l = typeof l == "string" ? l : l.source, u = typeof u == "string" ? u : u.source, this.__directives_block_pattern = new RegExp(l + / beautify( \w+[:]\w+)+ /.source + u, "g"), this.__directive_pattern = / (\w+)[:](\w+)/g, this.__directives_end_ignore_pattern = new RegExp(l + /\sbeautify\signore:end\s/.source + u, "g");
      }
      s.prototype.get_directives = function(l) {
        if (!l.match(this.__directives_block_pattern))
          return null;
        var u = {};
        this.__directive_pattern.lastIndex = 0;
        for (var o = this.__directive_pattern.exec(l); o; )
          u[o[1]] = o[2], o = this.__directive_pattern.exec(l);
        return u;
      }, s.prototype.readIgnored = function(l) {
        return l.readUntilAfter(this.__directives_end_ignore_pattern);
      }, i.exports.Directives = s;
    },
    function(i, s, l) {
      var u = l(12).Pattern, o = {
        django: !1,
        erb: !1,
        handlebars: !1,
        php: !1,
        smarty: !1
      };
      function c(h, d) {
        u.call(this, h, d), this.__template_pattern = null, this._disabled = Object.assign({}, o), this._excluded = Object.assign({}, o), d && (this.__template_pattern = this._input.get_regexp(d.__template_pattern), this._excluded = Object.assign(this._excluded, d._excluded), this._disabled = Object.assign(this._disabled, d._disabled));
        var f = new u(h);
        this.__patterns = {
          handlebars_comment: f.starting_with(/{{!--/).until_after(/--}}/),
          handlebars_unescaped: f.starting_with(/{{{/).until_after(/}}}/),
          handlebars: f.starting_with(/{{/).until_after(/}}/),
          php: f.starting_with(/<\?(?:[= ]|php)/).until_after(/\?>/),
          erb: f.starting_with(/<%[^%]/).until_after(/[^%]%>/),
          django: f.starting_with(/{%/).until_after(/%}/),
          django_value: f.starting_with(/{{/).until_after(/}}/),
          django_comment: f.starting_with(/{#/).until_after(/#}/),
          smarty: f.starting_with(/{(?=[^}{\s\n])/).until_after(/[^\s\n]}/),
          smarty_comment: f.starting_with(/{\*/).until_after(/\*}/),
          smarty_literal: f.starting_with(/{literal}/).until_after(/{\/literal}/)
        };
      }
      c.prototype = new u(), c.prototype._create = function() {
        return new c(this._input, this);
      }, c.prototype._update = function() {
        this.__set_templated_pattern();
      }, c.prototype.disable = function(h) {
        var d = this._create();
        return d._disabled[h] = !0, d._update(), d;
      }, c.prototype.read_options = function(h) {
        var d = this._create();
        for (var f in o)
          d._disabled[f] = h.templating.indexOf(f) === -1;
        return d._update(), d;
      }, c.prototype.exclude = function(h) {
        var d = this._create();
        return d._excluded[h] = !0, d._update(), d;
      }, c.prototype.read = function() {
        var h = "";
        this._match_pattern ? h = this._input.read(this._starting_pattern) : h = this._input.read(this._starting_pattern, this.__template_pattern);
        for (var d = this._read_template(); d; )
          this._match_pattern ? d += this._input.read(this._match_pattern) : d += this._input.readUntil(this.__template_pattern), h += d, d = this._read_template();
        return this._until_after && (h += this._input.readUntilAfter(this._until_pattern)), h;
      }, c.prototype.__set_templated_pattern = function() {
        var h = [];
        this._disabled.php || h.push(this.__patterns.php._starting_pattern.source), this._disabled.handlebars || h.push(this.__patterns.handlebars._starting_pattern.source), this._disabled.erb || h.push(this.__patterns.erb._starting_pattern.source), this._disabled.django || (h.push(this.__patterns.django._starting_pattern.source), h.push(this.__patterns.django_value._starting_pattern.source), h.push(this.__patterns.django_comment._starting_pattern.source)), this._disabled.smarty || h.push(this.__patterns.smarty._starting_pattern.source), this._until_pattern && h.push(this._until_pattern.source), this.__template_pattern = this._input.get_regexp("(?:" + h.join("|") + ")");
      }, c.prototype._read_template = function() {
        var h = "", d = this._input.peek();
        if (d === "<") {
          var f = this._input.peek(1);
          !this._disabled.php && !this._excluded.php && f === "?" && (h = h || this.__patterns.php.read()), !this._disabled.erb && !this._excluded.erb && f === "%" && (h = h || this.__patterns.erb.read());
        } else
          d === "{" && (!this._disabled.handlebars && !this._excluded.handlebars && (h = h || this.__patterns.handlebars_comment.read(), h = h || this.__patterns.handlebars_unescaped.read(), h = h || this.__patterns.handlebars.read()), this._disabled.django || (!this._excluded.django && !this._excluded.handlebars && (h = h || this.__patterns.django_value.read()), this._excluded.django || (h = h || this.__patterns.django_comment.read(), h = h || this.__patterns.django.read())), this._disabled.smarty || this._disabled.django && this._disabled.handlebars && (h = h || this.__patterns.smarty_comment.read(), h = h || this.__patterns.smarty_literal.read(), h = h || this.__patterns.smarty.read()));
        return h;
      }, i.exports.TemplatablePattern = c;
    },
    ,
    ,
    ,
    function(i, s, l) {
      var u = l(19).Beautifier, o = l(20).Options;
      function c(h, d, f, g) {
        var _ = new u(h, d, f, g);
        return _.beautify();
      }
      i.exports = c, i.exports.defaultOptions = function() {
        return new o();
      };
    },
    function(i, s, l) {
      var u = l(20).Options, o = l(2).Output, c = l(21).Tokenizer, h = l(21).TOKEN, d = /\r\n|[\r\n]/, f = /\r\n|[\r\n]/g, g = function(p, m) {
        this.indent_level = 0, this.alignment_size = 0, this.max_preserve_newlines = p.max_preserve_newlines, this.preserve_newlines = p.preserve_newlines, this._output = new o(p, m);
      };
      g.prototype.current_line_has_match = function(p) {
        return this._output.current_line.has_match(p);
      }, g.prototype.set_space_before_token = function(p, m) {
        this._output.space_before_token = p, this._output.non_breaking_space = m;
      }, g.prototype.set_wrap_point = function() {
        this._output.set_indent(this.indent_level, this.alignment_size), this._output.set_wrap_point();
      }, g.prototype.add_raw_token = function(p) {
        this._output.add_raw_token(p);
      }, g.prototype.print_preserved_newlines = function(p) {
        var m = 0;
        p.type !== h.TEXT && p.previous.type !== h.TEXT && (m = p.newlines ? 1 : 0), this.preserve_newlines && (m = p.newlines < this.max_preserve_newlines + 1 ? p.newlines : this.max_preserve_newlines + 1);
        for (var b = 0; b < m; b++)
          this.print_newline(b > 0);
        return m !== 0;
      }, g.prototype.traverse_whitespace = function(p) {
        return p.whitespace_before || p.newlines ? (this.print_preserved_newlines(p) || (this._output.space_before_token = !0), !0) : !1;
      }, g.prototype.previous_token_wrapped = function() {
        return this._output.previous_token_wrapped;
      }, g.prototype.print_newline = function(p) {
        this._output.add_new_line(p);
      }, g.prototype.print_token = function(p) {
        p.text && (this._output.set_indent(this.indent_level, this.alignment_size), this._output.add_token(p.text));
      }, g.prototype.indent = function() {
        this.indent_level++;
      }, g.prototype.get_full_indent = function(p) {
        return p = this.indent_level + (p || 0), p < 1 ? "" : this._output.get_indent_string(p);
      };
      var _ = function(p) {
        for (var m = null, b = p.next; b.type !== h.EOF && p.closed !== b; ) {
          if (b.type === h.ATTRIBUTE && b.text === "type") {
            b.next && b.next.type === h.EQUALS && b.next.next && b.next.next.type === h.VALUE && (m = b.next.next.text);
            break;
          }
          b = b.next;
        }
        return m;
      }, w = function(p, m) {
        var b = null, I = null;
        return m.closed ? (p === "script" ? b = "text/javascript" : p === "style" && (b = "text/css"), b = _(m) || b, b.search("text/css") > -1 ? I = "css" : b.search(/module|((text|application|dojo)\/(x-)?(javascript|ecmascript|jscript|livescript|(ld\+)?json|method|aspect))/) > -1 ? I = "javascript" : b.search(/(text|application|dojo)\/(x-)?(html)/) > -1 ? I = "html" : b.search(/test\/null/) > -1 && (I = "null"), I) : null;
      };
      function y(p, m) {
        return m.indexOf(p) !== -1;
      }
      function k(p, m, b) {
        this.parent = p || null, this.tag = m ? m.tag_name : "", this.indent_level = b || 0, this.parser_token = m || null;
      }
      function v(p) {
        this._printer = p, this._current_frame = null;
      }
      v.prototype.get_parser_token = function() {
        return this._current_frame ? this._current_frame.parser_token : null;
      }, v.prototype.record_tag = function(p) {
        var m = new k(this._current_frame, p, this._printer.indent_level);
        this._current_frame = m;
      }, v.prototype._try_pop_frame = function(p) {
        var m = null;
        return p && (m = p.parser_token, this._printer.indent_level = p.indent_level, this._current_frame = p.parent), m;
      }, v.prototype._get_frame = function(p, m) {
        for (var b = this._current_frame; b && p.indexOf(b.tag) === -1; ) {
          if (m && m.indexOf(b.tag) !== -1) {
            b = null;
            break;
          }
          b = b.parent;
        }
        return b;
      }, v.prototype.try_pop = function(p, m) {
        var b = this._get_frame([p], m);
        return this._try_pop_frame(b);
      }, v.prototype.indent_to_tag = function(p) {
        var m = this._get_frame(p);
        m && (this._printer.indent_level = m.indent_level);
      };
      function L(p, m, b, I) {
        this._source_text = p || "", m = m || {}, this._js_beautify = b, this._css_beautify = I, this._tag_stack = null;
        var C = new u(m, "html");
        this._options = C, this._is_wrap_attributes_force = this._options.wrap_attributes.substr(0, 5) === "force", this._is_wrap_attributes_force_expand_multiline = this._options.wrap_attributes === "force-expand-multiline", this._is_wrap_attributes_force_aligned = this._options.wrap_attributes === "force-aligned", this._is_wrap_attributes_aligned_multiple = this._options.wrap_attributes === "aligned-multiple", this._is_wrap_attributes_preserve = this._options.wrap_attributes.substr(0, 8) === "preserve", this._is_wrap_attributes_preserve_aligned = this._options.wrap_attributes === "preserve-aligned";
      }
      L.prototype.beautify = function() {
        if (this._options.disabled)
          return this._source_text;
        var p = this._source_text, m = this._options.eol;
        this._options.eol === "auto" && (m = `
`, p && d.test(p) && (m = p.match(d)[0])), p = p.replace(f, `
`);
        var b = p.match(/^[\t ]*/)[0], I = {
          text: "",
          type: ""
        }, C = new M(), x = new g(this._options, b), W = new c(p, this._options).tokenize();
        this._tag_stack = new v(x);
        for (var P = null, B = W.next(); B.type !== h.EOF; )
          B.type === h.TAG_OPEN || B.type === h.COMMENT ? (P = this._handle_tag_open(x, B, C, I), C = P) : B.type === h.ATTRIBUTE || B.type === h.EQUALS || B.type === h.VALUE || B.type === h.TEXT && !C.tag_complete ? P = this._handle_inside_tag(x, B, C, W) : B.type === h.TAG_CLOSE ? P = this._handle_tag_close(x, B, C) : B.type === h.TEXT ? P = this._handle_text(x, B, C) : x.add_raw_token(B), I = P, B = W.next();
        var q = x._output.get_code(m);
        return q;
      }, L.prototype._handle_tag_close = function(p, m, b) {
        var I = {
          text: m.text,
          type: m.type
        };
        return p.alignment_size = 0, b.tag_complete = !0, p.set_space_before_token(m.newlines || m.whitespace_before !== "", !0), b.is_unformatted ? p.add_raw_token(m) : (b.tag_start_char === "<" && (p.set_space_before_token(m.text[0] === "/", !0), this._is_wrap_attributes_force_expand_multiline && b.has_wrapped_attrs && p.print_newline(!1)), p.print_token(m)), b.indent_content && !(b.is_unformatted || b.is_content_unformatted) && (p.indent(), b.indent_content = !1), !b.is_inline_element && !(b.is_unformatted || b.is_content_unformatted) && p.set_wrap_point(), I;
      }, L.prototype._handle_inside_tag = function(p, m, b, I) {
        var C = b.has_wrapped_attrs, x = {
          text: m.text,
          type: m.type
        };
        if (p.set_space_before_token(m.newlines || m.whitespace_before !== "", !0), b.is_unformatted)
          p.add_raw_token(m);
        else if (b.tag_start_char === "{" && m.type === h.TEXT)
          p.print_preserved_newlines(m) ? (m.newlines = 0, p.add_raw_token(m)) : p.print_token(m);
        else {
          if (m.type === h.ATTRIBUTE ? (p.set_space_before_token(!0), b.attr_count += 1) : (m.type === h.EQUALS || m.type === h.VALUE && m.previous.type === h.EQUALS) && p.set_space_before_token(!1), m.type === h.ATTRIBUTE && b.tag_start_char === "<" && ((this._is_wrap_attributes_preserve || this._is_wrap_attributes_preserve_aligned) && (p.traverse_whitespace(m), C = C || m.newlines !== 0), this._is_wrap_attributes_force)) {
            var W = b.attr_count > 1;
            if (this._is_wrap_attributes_force_expand_multiline && b.attr_count === 1) {
              var P = !0, B = 0, q;
              do {
                if (q = I.peek(B), q.type === h.ATTRIBUTE) {
                  P = !1;
                  break;
                }
                B += 1;
              } while (B < 4 && q.type !== h.EOF && q.type !== h.TAG_CLOSE);
              W = !P;
            }
            W && (p.print_newline(!1), C = !0);
          }
          p.print_token(m), C = C || p.previous_token_wrapped(), b.has_wrapped_attrs = C;
        }
        return x;
      }, L.prototype._handle_text = function(p, m, b) {
        var I = {
          text: m.text,
          type: "TK_CONTENT"
        };
        return b.custom_beautifier_name ? this._print_custom_beatifier_text(p, m, b) : b.is_unformatted || b.is_content_unformatted ? p.add_raw_token(m) : (p.traverse_whitespace(m), p.print_token(m)), I;
      }, L.prototype._print_custom_beatifier_text = function(p, m, b) {
        var I = this;
        if (m.text !== "") {
          var C = m.text, x, W = 1, P = "", B = "";
          b.custom_beautifier_name === "javascript" && typeof this._js_beautify == "function" ? x = this._js_beautify : b.custom_beautifier_name === "css" && typeof this._css_beautify == "function" ? x = this._css_beautify : b.custom_beautifier_name === "html" && (x = function(R, N) {
            var F = new L(R, N, I._js_beautify, I._css_beautify);
            return F.beautify();
          }), this._options.indent_scripts === "keep" ? W = 0 : this._options.indent_scripts === "separate" && (W = -p.indent_level);
          var q = p.get_full_indent(W);
          if (C = C.replace(/\n[ \t]*$/, ""), b.custom_beautifier_name !== "html" && C[0] === "<" && C.match(/^(<!--|<!\[CDATA\[)/)) {
            var S = /^(<!--[^\n]*|<!\[CDATA\[)(\n?)([ \t\n]*)([\s\S]*)(-->|]]>)$/.exec(C);
            if (!S) {
              p.add_raw_token(m);
              return;
            }
            P = q + S[1] + `
`, C = S[4], S[5] && (B = q + S[5]), C = C.replace(/\n[ \t]*$/, ""), (S[2] || S[3].indexOf(`
`) !== -1) && (S = S[3].match(/[ \t]+$/), S && (m.whitespace_before = S[0]));
          }
          if (C)
            if (x) {
              var T = function() {
                this.eol = `
`;
              };
              T.prototype = this._options.raw_options;
              var E = new T();
              C = x(q + C, E);
            } else {
              var H = m.whitespace_before;
              H && (C = C.replace(new RegExp(`
(` + H + ")?", "g"), `
`)), C = q + C.replace(/\n/g, `
` + q);
            }
          P && (C ? C = P + C + `
` + B : C = P + B), p.print_newline(!1), C && (m.text = C, m.whitespace_before = "", m.newlines = 0, p.add_raw_token(m), p.print_newline(!0));
        }
      }, L.prototype._handle_tag_open = function(p, m, b, I) {
        var C = this._get_tag_open_token(m);
        return (b.is_unformatted || b.is_content_unformatted) && !b.is_empty_element && m.type === h.TAG_OPEN && m.text.indexOf("</") === 0 ? (p.add_raw_token(m), C.start_tag_token = this._tag_stack.try_pop(C.tag_name)) : (p.traverse_whitespace(m), this._set_tag_position(p, m, C, b, I), C.is_inline_element || p.set_wrap_point(), p.print_token(m)), (this._is_wrap_attributes_force_aligned || this._is_wrap_attributes_aligned_multiple || this._is_wrap_attributes_preserve_aligned) && (C.alignment_size = m.text.length + 1), !C.tag_complete && !C.is_unformatted && (p.alignment_size = C.alignment_size), C;
      };
      var M = function(p, m) {
        if (this.parent = p || null, this.text = "", this.type = "TK_TAG_OPEN", this.tag_name = "", this.is_inline_element = !1, this.is_unformatted = !1, this.is_content_unformatted = !1, this.is_empty_element = !1, this.is_start_tag = !1, this.is_end_tag = !1, this.indent_content = !1, this.multiline_content = !1, this.custom_beautifier_name = null, this.start_tag_token = null, this.attr_count = 0, this.has_wrapped_attrs = !1, this.alignment_size = 0, this.tag_complete = !1, this.tag_start_char = "", this.tag_check = "", !m)
          this.tag_complete = !0;
        else {
          var b;
          this.tag_start_char = m.text[0], this.text = m.text, this.tag_start_char === "<" ? (b = m.text.match(/^<([^\s>]*)/), this.tag_check = b ? b[1] : "") : (b = m.text.match(/^{{(?:[\^]|#\*?)?([^\s}]+)/), this.tag_check = b ? b[1] : "", m.text === "{{#>" && this.tag_check === ">" && m.next !== null && (this.tag_check = m.next.text)), this.tag_check = this.tag_check.toLowerCase(), m.type === h.COMMENT && (this.tag_complete = !0), this.is_start_tag = this.tag_check.charAt(0) !== "/", this.tag_name = this.is_start_tag ? this.tag_check : this.tag_check.substr(1), this.is_end_tag = !this.is_start_tag || m.closed && m.closed.text === "/>", this.is_end_tag = this.is_end_tag || this.tag_start_char === "{" && (this.text.length < 3 || /[^#\^]/.test(this.text.charAt(2)));
        }
      };
      L.prototype._get_tag_open_token = function(p) {
        var m = new M(this._tag_stack.get_parser_token(), p);
        return m.alignment_size = this._options.wrap_attributes_indent_size, m.is_end_tag = m.is_end_tag || y(m.tag_check, this._options.void_elements), m.is_empty_element = m.tag_complete || m.is_start_tag && m.is_end_tag, m.is_unformatted = !m.tag_complete && y(m.tag_check, this._options.unformatted), m.is_content_unformatted = !m.is_empty_element && y(m.tag_check, this._options.content_unformatted), m.is_inline_element = y(m.tag_name, this._options.inline) || m.tag_start_char === "{", m;
      }, L.prototype._set_tag_position = function(p, m, b, I, C) {
        if (b.is_empty_element || (b.is_end_tag ? b.start_tag_token = this._tag_stack.try_pop(b.tag_name) : (this._do_optional_end_element(b) && (b.is_inline_element || p.print_newline(!1)), this._tag_stack.record_tag(b), (b.tag_name === "script" || b.tag_name === "style") && !(b.is_unformatted || b.is_content_unformatted) && (b.custom_beautifier_name = w(b.tag_check, m)))), y(b.tag_check, this._options.extra_liners) && (p.print_newline(!1), p._output.just_added_blankline() || p.print_newline(!0)), b.is_empty_element) {
          if (b.tag_start_char === "{" && b.tag_check === "else") {
            this._tag_stack.indent_to_tag(["if", "unless", "each"]), b.indent_content = !0;
            var x = p.current_line_has_match(/{{#if/);
            x || p.print_newline(!1);
          }
          b.tag_name === "!--" && C.type === h.TAG_CLOSE && I.is_end_tag && b.text.indexOf(`
`) === -1 || (b.is_inline_element || b.is_unformatted || p.print_newline(!1), this._calcluate_parent_multiline(p, b));
        } else if (b.is_end_tag) {
          var W = !1;
          W = b.start_tag_token && b.start_tag_token.multiline_content, W = W || !b.is_inline_element && !(I.is_inline_element || I.is_unformatted) && !(C.type === h.TAG_CLOSE && b.start_tag_token === I) && C.type !== "TK_CONTENT", (b.is_content_unformatted || b.is_unformatted) && (W = !1), W && p.print_newline(!1);
        } else
          b.indent_content = !b.custom_beautifier_name, b.tag_start_char === "<" && (b.tag_name === "html" ? b.indent_content = this._options.indent_inner_html : b.tag_name === "head" ? b.indent_content = this._options.indent_head_inner_html : b.tag_name === "body" && (b.indent_content = this._options.indent_body_inner_html)), !(b.is_inline_element || b.is_unformatted) && (C.type !== "TK_CONTENT" || b.is_content_unformatted) && p.print_newline(!1), this._calcluate_parent_multiline(p, b);
      }, L.prototype._calcluate_parent_multiline = function(p, m) {
        m.parent && p._output.just_added_newline() && !((m.is_inline_element || m.is_unformatted) && m.parent.is_inline_element) && (m.parent.multiline_content = !0);
      };
      var z = ["address", "article", "aside", "blockquote", "details", "div", "dl", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"], D = ["a", "audio", "del", "ins", "map", "noscript", "video"];
      L.prototype._do_optional_end_element = function(p) {
        var m = null;
        if (!(p.is_empty_element || !p.is_start_tag || !p.parent)) {
          if (p.tag_name === "body")
            m = m || this._tag_stack.try_pop("head");
          else if (p.tag_name === "li")
            m = m || this._tag_stack.try_pop("li", ["ol", "ul"]);
          else if (p.tag_name === "dd" || p.tag_name === "dt")
            m = m || this._tag_stack.try_pop("dt", ["dl"]), m = m || this._tag_stack.try_pop("dd", ["dl"]);
          else if (p.parent.tag_name === "p" && z.indexOf(p.tag_name) !== -1) {
            var b = p.parent.parent;
            (!b || D.indexOf(b.tag_name) === -1) && (m = m || this._tag_stack.try_pop("p"));
          } else
            p.tag_name === "rp" || p.tag_name === "rt" ? (m = m || this._tag_stack.try_pop("rt", ["ruby", "rtc"]), m = m || this._tag_stack.try_pop("rp", ["ruby", "rtc"])) : p.tag_name === "optgroup" ? m = m || this._tag_stack.try_pop("optgroup", ["select"]) : p.tag_name === "option" ? m = m || this._tag_stack.try_pop("option", ["select", "datalist", "optgroup"]) : p.tag_name === "colgroup" ? m = m || this._tag_stack.try_pop("caption", ["table"]) : p.tag_name === "thead" ? (m = m || this._tag_stack.try_pop("caption", ["table"]), m = m || this._tag_stack.try_pop("colgroup", ["table"])) : p.tag_name === "tbody" || p.tag_name === "tfoot" ? (m = m || this._tag_stack.try_pop("caption", ["table"]), m = m || this._tag_stack.try_pop("colgroup", ["table"]), m = m || this._tag_stack.try_pop("thead", ["table"]), m = m || this._tag_stack.try_pop("tbody", ["table"])) : p.tag_name === "tr" ? (m = m || this._tag_stack.try_pop("caption", ["table"]), m = m || this._tag_stack.try_pop("colgroup", ["table"]), m = m || this._tag_stack.try_pop("tr", ["table", "thead", "tbody", "tfoot"])) : (p.tag_name === "th" || p.tag_name === "td") && (m = m || this._tag_stack.try_pop("td", ["table", "thead", "tbody", "tfoot", "tr"]), m = m || this._tag_stack.try_pop("th", ["table", "thead", "tbody", "tfoot", "tr"]));
          return p.parent = this._tag_stack.get_parser_token(), m;
        }
      }, i.exports.Beautifier = L;
    },
    function(i, s, l) {
      var u = l(6).Options;
      function o(c) {
        u.call(this, c, "html"), this.templating.length === 1 && this.templating[0] === "auto" && (this.templating = ["django", "erb", "handlebars", "php"]), this.indent_inner_html = this._get_boolean("indent_inner_html"), this.indent_body_inner_html = this._get_boolean("indent_body_inner_html", !0), this.indent_head_inner_html = this._get_boolean("indent_head_inner_html", !0), this.indent_handlebars = this._get_boolean("indent_handlebars", !0), this.wrap_attributes = this._get_selection("wrap_attributes", ["auto", "force", "force-aligned", "force-expand-multiline", "aligned-multiple", "preserve", "preserve-aligned"]), this.wrap_attributes_indent_size = this._get_number("wrap_attributes_indent_size", this.indent_size), this.extra_liners = this._get_array("extra_liners", ["head", "body", "/html"]), this.inline = this._get_array("inline", [
          "a",
          "abbr",
          "area",
          "audio",
          "b",
          "bdi",
          "bdo",
          "br",
          "button",
          "canvas",
          "cite",
          "code",
          "data",
          "datalist",
          "del",
          "dfn",
          "em",
          "embed",
          "i",
          "iframe",
          "img",
          "input",
          "ins",
          "kbd",
          "keygen",
          "label",
          "map",
          "mark",
          "math",
          "meter",
          "noscript",
          "object",
          "output",
          "progress",
          "q",
          "ruby",
          "s",
          "samp",
          "select",
          "small",
          "span",
          "strong",
          "sub",
          "sup",
          "svg",
          "template",
          "textarea",
          "time",
          "u",
          "var",
          "video",
          "wbr",
          "text",
          "acronym",
          "big",
          "strike",
          "tt"
        ]), this.void_elements = this._get_array("void_elements", [
          "area",
          "base",
          "br",
          "col",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "menuitem",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
          "!doctype",
          "?xml",
          "basefont",
          "isindex"
        ]), this.unformatted = this._get_array("unformatted", []), this.content_unformatted = this._get_array("content_unformatted", [
          "pre",
          "textarea"
        ]), this.unformatted_content_delimiter = this._get_characters("unformatted_content_delimiter"), this.indent_scripts = this._get_selection("indent_scripts", ["normal", "keep", "separate"]);
      }
      o.prototype = new u(), i.exports.Options = o;
    },
    function(i, s, l) {
      var u = l(9).Tokenizer, o = l(9).TOKEN, c = l(13).Directives, h = l(14).TemplatablePattern, d = l(12).Pattern, f = {
        TAG_OPEN: "TK_TAG_OPEN",
        TAG_CLOSE: "TK_TAG_CLOSE",
        ATTRIBUTE: "TK_ATTRIBUTE",
        EQUALS: "TK_EQUALS",
        VALUE: "TK_VALUE",
        COMMENT: "TK_COMMENT",
        TEXT: "TK_TEXT",
        UNKNOWN: "TK_UNKNOWN",
        START: o.START,
        RAW: o.RAW,
        EOF: o.EOF
      }, g = new c(/<\!--/, /-->/), _ = function(w, y) {
        u.call(this, w, y), this._current_tag_name = "";
        var k = new h(this._input).read_options(this._options), v = new d(this._input);
        if (this.__patterns = {
          word: k.until(/[\n\r\t <]/),
          single_quote: k.until_after(/'/),
          double_quote: k.until_after(/"/),
          attribute: k.until(/[\n\r\t =>]|\/>/),
          element_name: k.until(/[\n\r\t >\/]/),
          handlebars_comment: v.starting_with(/{{!--/).until_after(/--}}/),
          handlebars: v.starting_with(/{{/).until_after(/}}/),
          handlebars_open: v.until(/[\n\r\t }]/),
          handlebars_raw_close: v.until(/}}/),
          comment: v.starting_with(/<!--/).until_after(/-->/),
          cdata: v.starting_with(/<!\[CDATA\[/).until_after(/]]>/),
          conditional_comment: v.starting_with(/<!\[/).until_after(/]>/),
          processing: v.starting_with(/<\?/).until_after(/\?>/)
        }, this._options.indent_handlebars && (this.__patterns.word = this.__patterns.word.exclude("handlebars")), this._unformatted_content_delimiter = null, this._options.unformatted_content_delimiter) {
          var L = this._input.get_literal_regexp(this._options.unformatted_content_delimiter);
          this.__patterns.unformatted_content_delimiter = v.matching(L).until_after(L);
        }
      };
      _.prototype = new u(), _.prototype._is_comment = function(w) {
        return !1;
      }, _.prototype._is_opening = function(w) {
        return w.type === f.TAG_OPEN;
      }, _.prototype._is_closing = function(w, y) {
        return w.type === f.TAG_CLOSE && y && ((w.text === ">" || w.text === "/>") && y.text[0] === "<" || w.text === "}}" && y.text[0] === "{" && y.text[1] === "{");
      }, _.prototype._reset = function() {
        this._current_tag_name = "";
      }, _.prototype._get_next_token = function(w, y) {
        var k = null;
        this._readWhitespace();
        var v = this._input.peek();
        return v === null ? this._create_token(f.EOF, "") : (k = k || this._read_open_handlebars(v, y), k = k || this._read_attribute(v, w, y), k = k || this._read_close(v, y), k = k || this._read_raw_content(v, w, y), k = k || this._read_content_word(v), k = k || this._read_comment_or_cdata(v), k = k || this._read_processing(v), k = k || this._read_open(v, y), k = k || this._create_token(f.UNKNOWN, this._input.next()), k);
      }, _.prototype._read_comment_or_cdata = function(w) {
        var y = null, k = null, v = null;
        if (w === "<") {
          var L = this._input.peek(1);
          L === "!" && (k = this.__patterns.comment.read(), k ? (v = g.get_directives(k), v && v.ignore === "start" && (k += g.readIgnored(this._input))) : k = this.__patterns.cdata.read()), k && (y = this._create_token(f.COMMENT, k), y.directives = v);
        }
        return y;
      }, _.prototype._read_processing = function(w) {
        var y = null, k = null, v = null;
        if (w === "<") {
          var L = this._input.peek(1);
          (L === "!" || L === "?") && (k = this.__patterns.conditional_comment.read(), k = k || this.__patterns.processing.read()), k && (y = this._create_token(f.COMMENT, k), y.directives = v);
        }
        return y;
      }, _.prototype._read_open = function(w, y) {
        var k = null, v = null;
        return y || w === "<" && (k = this._input.next(), this._input.peek() === "/" && (k += this._input.next()), k += this.__patterns.element_name.read(), v = this._create_token(f.TAG_OPEN, k)), v;
      }, _.prototype._read_open_handlebars = function(w, y) {
        var k = null, v = null;
        return y || this._options.indent_handlebars && w === "{" && this._input.peek(1) === "{" && (this._input.peek(2) === "!" ? (k = this.__patterns.handlebars_comment.read(), k = k || this.__patterns.handlebars.read(), v = this._create_token(f.COMMENT, k)) : (k = this.__patterns.handlebars_open.read(), v = this._create_token(f.TAG_OPEN, k))), v;
      }, _.prototype._read_close = function(w, y) {
        var k = null, v = null;
        return y && (y.text[0] === "<" && (w === ">" || w === "/" && this._input.peek(1) === ">") ? (k = this._input.next(), w === "/" && (k += this._input.next()), v = this._create_token(f.TAG_CLOSE, k)) : y.text[0] === "{" && w === "}" && this._input.peek(1) === "}" && (this._input.next(), this._input.next(), v = this._create_token(f.TAG_CLOSE, "}}"))), v;
      }, _.prototype._read_attribute = function(w, y, k) {
        var v = null, L = "";
        if (k && k.text[0] === "<")
          if (w === "=")
            v = this._create_token(f.EQUALS, this._input.next());
          else if (w === '"' || w === "'") {
            var M = this._input.next();
            w === '"' ? M += this.__patterns.double_quote.read() : M += this.__patterns.single_quote.read(), v = this._create_token(f.VALUE, M);
          } else
            L = this.__patterns.attribute.read(), L && (y.type === f.EQUALS ? v = this._create_token(f.VALUE, L) : v = this._create_token(f.ATTRIBUTE, L));
        return v;
      }, _.prototype._is_content_unformatted = function(w) {
        return this._options.void_elements.indexOf(w) === -1 && (this._options.content_unformatted.indexOf(w) !== -1 || this._options.unformatted.indexOf(w) !== -1);
      }, _.prototype._read_raw_content = function(w, y, k) {
        var v = "";
        if (k && k.text[0] === "{")
          v = this.__patterns.handlebars_raw_close.read();
        else if (y.type === f.TAG_CLOSE && y.opened.text[0] === "<" && y.text[0] !== "/") {
          var L = y.opened.text.substr(1).toLowerCase();
          if (L === "script" || L === "style") {
            var M = this._read_comment_or_cdata(w);
            if (M)
              return M.type = f.TEXT, M;
            v = this._input.readUntil(new RegExp("</" + L + "[\\n\\r\\t ]*?>", "ig"));
          } else
            this._is_content_unformatted(L) && (v = this._input.readUntil(new RegExp("</" + L + "[\\n\\r\\t ]*?>", "ig")));
        }
        return v ? this._create_token(f.TEXT, v) : null;
      }, _.prototype._read_content_word = function(w) {
        var y = "";
        if (this._options.unformatted_content_delimiter && w === this._options.unformatted_content_delimiter[0] && (y = this.__patterns.unformatted_content_delimiter.read()), y || (y = this.__patterns.word.read()), y)
          return this._create_token(f.TEXT, y);
      }, i.exports.Tokenizer = _, i.exports.TOKEN = f;
    }
  ], t = {};
  function n(i) {
    var s = t[i];
    if (s !== void 0)
      return s.exports;
    var l = t[i] = {
      exports: {}
    };
    return e[i](l, l.exports, n), l.exports;
  }
  var r = n(18);
  Yi = r;
})();
function Ro(e, t) {
  return Yi(e, t, Mo, Do);
}
function No(e, t, n) {
  var r = e.getText(), i = !0, s = 0, l = n.tabSize || 4;
  if (t) {
    for (var u = e.offsetAt(t.start), o = u; o > 0 && Ai(r, o - 1); )
      o--;
    o === 0 || ki(r, o - 1) ? u = o : o < u && (u = o + 1);
    for (var c = e.offsetAt(t.end), h = c; h < r.length && Ai(r, h); )
      h++;
    (h === r.length || ki(r, h)) && (c = h), t = X.create(e.positionAt(u), e.positionAt(c));
    var d = r.substring(0, u);
    if (new RegExp(/.*[<][^>]*$/).test(d))
      return r = r.substring(u, c), [{
        range: t,
        newText: r
      }];
    if (i = c === r.length, r = r.substring(u, c), u !== 0) {
      var f = e.offsetAt(ne.create(t.start.line, 0));
      s = Ho(e.getText(), f, n);
    }
  } else
    t = X.create(ne.create(0, 0), e.positionAt(r.length));
  var g = {
    indent_size: l,
    indent_char: n.insertSpaces ? " " : "	",
    indent_empty_lines: fe(n, "indentEmptyLines", !1),
    wrap_line_length: fe(n, "wrapLineLength", 120),
    unformatted: Vt(n, "unformatted", void 0),
    content_unformatted: Vt(n, "contentUnformatted", void 0),
    indent_inner_html: fe(n, "indentInnerHtml", !1),
    preserve_newlines: fe(n, "preserveNewLines", !0),
    max_preserve_newlines: fe(n, "maxPreserveNewLines", 32786),
    indent_handlebars: fe(n, "indentHandlebars", !1),
    end_with_newline: i && fe(n, "endWithNewline", !1),
    extra_liners: Vt(n, "extraLiners", void 0),
    wrap_attributes: fe(n, "wrapAttributes", "auto"),
    wrap_attributes_indent_size: fe(n, "wrapAttributesIndentSize", void 0),
    eol: `
`,
    indent_scripts: fe(n, "indentScripts", "normal"),
    templating: Io(n, "all"),
    unformatted_content_delimiter: fe(n, "unformattedContentDelimiter", "")
  }, _ = Ro(Uo(r), g);
  if (s > 0) {
    var w = n.insertSpaces ? _i(" ", l * s) : _i("	", s);
    _ = _.split(`
`).join(`
` + w), t.start.character === 0 && (_ = w + _);
  }
  return [{
    range: t,
    newText: _
  }];
}
function Uo(e) {
  return e.replace(/^\s+/, "");
}
function fe(e, t, n) {
  if (e && e.hasOwnProperty(t)) {
    var r = e[t];
    if (r !== null)
      return r;
  }
  return n;
}
function Vt(e, t, n) {
  var r = fe(e, t, null);
  return typeof r == "string" ? r.length > 0 ? r.split(",").map(function(i) {
    return i.trim().toLowerCase();
  }) : [] : n;
}
function Io(e, t) {
  var n = fe(e, "templating", t);
  return n === !0 ? ["auto"] : ["none"];
}
function Ho(e, t, n) {
  for (var r = t, i = 0, s = n.tabSize || 4; r < e.length; ) {
    var l = e.charAt(r);
    if (l === " ")
      i++;
    else if (l === "	")
      i += s;
    else
      break;
    r++;
  }
  return Math.floor(i / s);
}
function ki(e, t) {
  return `\r
`.indexOf(e.charAt(t)) !== -1;
}
function Ai(e, t) {
  return " 	".indexOf(e.charAt(t)) !== -1;
}
var Zi;
Zi = (() => {
  var e = { 470: (r) => {
    function i(u) {
      if (typeof u != "string")
        throw new TypeError("Path must be a string. Received " + JSON.stringify(u));
    }
    function s(u, o) {
      for (var c, h = "", d = 0, f = -1, g = 0, _ = 0; _ <= u.length; ++_) {
        if (_ < u.length)
          c = u.charCodeAt(_);
        else {
          if (c === 47)
            break;
          c = 47;
        }
        if (c === 47) {
          if (!(f === _ - 1 || g === 1))
            if (f !== _ - 1 && g === 2) {
              if (h.length < 2 || d !== 2 || h.charCodeAt(h.length - 1) !== 46 || h.charCodeAt(h.length - 2) !== 46) {
                if (h.length > 2) {
                  var w = h.lastIndexOf("/");
                  if (w !== h.length - 1) {
                    w === -1 ? (h = "", d = 0) : d = (h = h.slice(0, w)).length - 1 - h.lastIndexOf("/"), f = _, g = 0;
                    continue;
                  }
                } else if (h.length === 2 || h.length === 1) {
                  h = "", d = 0, f = _, g = 0;
                  continue;
                }
              }
              o && (h.length > 0 ? h += "/.." : h = "..", d = 2);
            } else
              h.length > 0 ? h += "/" + u.slice(f + 1, _) : h = u.slice(f + 1, _), d = _ - f - 1;
          f = _, g = 0;
        } else
          c === 46 && g !== -1 ? ++g : g = -1;
      }
      return h;
    }
    var l = { resolve: function() {
      for (var u, o = "", c = !1, h = arguments.length - 1; h >= -1 && !c; h--) {
        var d;
        h >= 0 ? d = arguments[h] : (u === void 0 && (u = process.cwd()), d = u), i(d), d.length !== 0 && (o = d + "/" + o, c = d.charCodeAt(0) === 47);
      }
      return o = s(o, !c), c ? o.length > 0 ? "/" + o : "/" : o.length > 0 ? o : ".";
    }, normalize: function(u) {
      if (i(u), u.length === 0)
        return ".";
      var o = u.charCodeAt(0) === 47, c = u.charCodeAt(u.length - 1) === 47;
      return (u = s(u, !o)).length !== 0 || o || (u = "."), u.length > 0 && c && (u += "/"), o ? "/" + u : u;
    }, isAbsolute: function(u) {
      return i(u), u.length > 0 && u.charCodeAt(0) === 47;
    }, join: function() {
      if (arguments.length === 0)
        return ".";
      for (var u, o = 0; o < arguments.length; ++o) {
        var c = arguments[o];
        i(c), c.length > 0 && (u === void 0 ? u = c : u += "/" + c);
      }
      return u === void 0 ? "." : l.normalize(u);
    }, relative: function(u, o) {
      if (i(u), i(o), u === o || (u = l.resolve(u)) === (o = l.resolve(o)))
        return "";
      for (var c = 1; c < u.length && u.charCodeAt(c) === 47; ++c)
        ;
      for (var h = u.length, d = h - c, f = 1; f < o.length && o.charCodeAt(f) === 47; ++f)
        ;
      for (var g = o.length - f, _ = d < g ? d : g, w = -1, y = 0; y <= _; ++y) {
        if (y === _) {
          if (g > _) {
            if (o.charCodeAt(f + y) === 47)
              return o.slice(f + y + 1);
            if (y === 0)
              return o.slice(f + y);
          } else
            d > _ && (u.charCodeAt(c + y) === 47 ? w = y : y === 0 && (w = 0));
          break;
        }
        var k = u.charCodeAt(c + y);
        if (k !== o.charCodeAt(f + y))
          break;
        k === 47 && (w = y);
      }
      var v = "";
      for (y = c + w + 1; y <= h; ++y)
        y !== h && u.charCodeAt(y) !== 47 || (v.length === 0 ? v += ".." : v += "/..");
      return v.length > 0 ? v + o.slice(f + w) : (f += w, o.charCodeAt(f) === 47 && ++f, o.slice(f));
    }, _makeLong: function(u) {
      return u;
    }, dirname: function(u) {
      if (i(u), u.length === 0)
        return ".";
      for (var o = u.charCodeAt(0), c = o === 47, h = -1, d = !0, f = u.length - 1; f >= 1; --f)
        if ((o = u.charCodeAt(f)) === 47) {
          if (!d) {
            h = f;
            break;
          }
        } else
          d = !1;
      return h === -1 ? c ? "/" : "." : c && h === 1 ? "//" : u.slice(0, h);
    }, basename: function(u, o) {
      if (o !== void 0 && typeof o != "string")
        throw new TypeError('"ext" argument must be a string');
      i(u);
      var c, h = 0, d = -1, f = !0;
      if (o !== void 0 && o.length > 0 && o.length <= u.length) {
        if (o.length === u.length && o === u)
          return "";
        var g = o.length - 1, _ = -1;
        for (c = u.length - 1; c >= 0; --c) {
          var w = u.charCodeAt(c);
          if (w === 47) {
            if (!f) {
              h = c + 1;
              break;
            }
          } else
            _ === -1 && (f = !1, _ = c + 1), g >= 0 && (w === o.charCodeAt(g) ? --g == -1 && (d = c) : (g = -1, d = _));
        }
        return h === d ? d = _ : d === -1 && (d = u.length), u.slice(h, d);
      }
      for (c = u.length - 1; c >= 0; --c)
        if (u.charCodeAt(c) === 47) {
          if (!f) {
            h = c + 1;
            break;
          }
        } else
          d === -1 && (f = !1, d = c + 1);
      return d === -1 ? "" : u.slice(h, d);
    }, extname: function(u) {
      i(u);
      for (var o = -1, c = 0, h = -1, d = !0, f = 0, g = u.length - 1; g >= 0; --g) {
        var _ = u.charCodeAt(g);
        if (_ !== 47)
          h === -1 && (d = !1, h = g + 1), _ === 46 ? o === -1 ? o = g : f !== 1 && (f = 1) : o !== -1 && (f = -1);
        else if (!d) {
          c = g + 1;
          break;
        }
      }
      return o === -1 || h === -1 || f === 0 || f === 1 && o === h - 1 && o === c + 1 ? "" : u.slice(o, h);
    }, format: function(u) {
      if (u === null || typeof u != "object")
        throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof u);
      return function(o, c) {
        var h = c.dir || c.root, d = c.base || (c.name || "") + (c.ext || "");
        return h ? h === c.root ? h + d : h + "/" + d : d;
      }(0, u);
    }, parse: function(u) {
      i(u);
      var o = { root: "", dir: "", base: "", ext: "", name: "" };
      if (u.length === 0)
        return o;
      var c, h = u.charCodeAt(0), d = h === 47;
      d ? (o.root = "/", c = 1) : c = 0;
      for (var f = -1, g = 0, _ = -1, w = !0, y = u.length - 1, k = 0; y >= c; --y)
        if ((h = u.charCodeAt(y)) !== 47)
          _ === -1 && (w = !1, _ = y + 1), h === 46 ? f === -1 ? f = y : k !== 1 && (k = 1) : f !== -1 && (k = -1);
        else if (!w) {
          g = y + 1;
          break;
        }
      return f === -1 || _ === -1 || k === 0 || k === 1 && f === _ - 1 && f === g + 1 ? _ !== -1 && (o.base = o.name = g === 0 && d ? u.slice(1, _) : u.slice(g, _)) : (g === 0 && d ? (o.name = u.slice(1, f), o.base = u.slice(1, _)) : (o.name = u.slice(g, f), o.base = u.slice(g, _)), o.ext = u.slice(f, _)), g > 0 ? o.dir = u.slice(0, g - 1) : d && (o.dir = "/"), o;
    }, sep: "/", delimiter: ":", win32: null, posix: null };
    l.posix = l, r.exports = l;
  }, 447: (r, i, s) => {
    var l;
    if (s.r(i), s.d(i, { URI: () => v, Utils: () => W }), typeof process == "object")
      l = process.platform === "win32";
    else if (typeof navigator == "object") {
      var u = navigator.userAgent;
      l = u.indexOf("Windows") >= 0;
    }
    var o, c, h = (o = function(S, T) {
      return (o = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(E, H) {
        E.__proto__ = H;
      } || function(E, H) {
        for (var R in H)
          Object.prototype.hasOwnProperty.call(H, R) && (E[R] = H[R]);
      })(S, T);
    }, function(S, T) {
      if (typeof T != "function" && T !== null)
        throw new TypeError("Class extends value " + String(T) + " is not a constructor or null");
      function E() {
        this.constructor = S;
      }
      o(S, T), S.prototype = T === null ? Object.create(T) : (E.prototype = T.prototype, new E());
    }), d = /^\w[\w\d+.-]*$/, f = /^\//, g = /^\/\//;
    function _(S, T) {
      if (!S.scheme && T)
        throw new Error('[UriError]: Scheme is missing: {scheme: "", authority: "'.concat(S.authority, '", path: "').concat(S.path, '", query: "').concat(S.query, '", fragment: "').concat(S.fragment, '"}'));
      if (S.scheme && !d.test(S.scheme))
        throw new Error("[UriError]: Scheme contains illegal characters.");
      if (S.path) {
        if (S.authority) {
          if (!f.test(S.path))
            throw new Error('[UriError]: If a URI contains an authority component, then the path component must either be empty or begin with a slash ("/") character');
        } else if (g.test(S.path))
          throw new Error('[UriError]: If a URI does not contain an authority component, then the path cannot begin with two slash characters ("//")');
      }
    }
    var w = "", y = "/", k = /^(([^:/?#]+?):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/, v = function() {
      function S(T, E, H, R, N, F) {
        F === void 0 && (F = !1), typeof T == "object" ? (this.scheme = T.scheme || w, this.authority = T.authority || w, this.path = T.path || w, this.query = T.query || w, this.fragment = T.fragment || w) : (this.scheme = function(G, $) {
          return G || $ ? G : "file";
        }(T, F), this.authority = E || w, this.path = function(G, $) {
          switch (G) {
            case "https":
            case "http":
            case "file":
              $ ? $[0] !== y && ($ = y + $) : $ = y;
          }
          return $;
        }(this.scheme, H || w), this.query = R || w, this.fragment = N || w, _(this, F));
      }
      return S.isUri = function(T) {
        return T instanceof S || !!T && typeof T.authority == "string" && typeof T.fragment == "string" && typeof T.path == "string" && typeof T.query == "string" && typeof T.scheme == "string" && typeof T.fsPath == "string" && typeof T.with == "function" && typeof T.toString == "function";
      }, Object.defineProperty(S.prototype, "fsPath", { get: function() {
        return m(this, !1);
      }, enumerable: !1, configurable: !0 }), S.prototype.with = function(T) {
        if (!T)
          return this;
        var E = T.scheme, H = T.authority, R = T.path, N = T.query, F = T.fragment;
        return E === void 0 ? E = this.scheme : E === null && (E = w), H === void 0 ? H = this.authority : H === null && (H = w), R === void 0 ? R = this.path : R === null && (R = w), N === void 0 ? N = this.query : N === null && (N = w), F === void 0 ? F = this.fragment : F === null && (F = w), E === this.scheme && H === this.authority && R === this.path && N === this.query && F === this.fragment ? this : new M(E, H, R, N, F);
      }, S.parse = function(T, E) {
        E === void 0 && (E = !1);
        var H = k.exec(T);
        return H ? new M(H[2] || w, x(H[4] || w), x(H[5] || w), x(H[7] || w), x(H[9] || w), E) : new M(w, w, w, w, w);
      }, S.file = function(T) {
        var E = w;
        if (l && (T = T.replace(/\\/g, y)), T[0] === y && T[1] === y) {
          var H = T.indexOf(y, 2);
          H === -1 ? (E = T.substring(2), T = y) : (E = T.substring(2, H), T = T.substring(H) || y);
        }
        return new M("file", E, T, w, w);
      }, S.from = function(T) {
        var E = new M(T.scheme, T.authority, T.path, T.query, T.fragment);
        return _(E, !0), E;
      }, S.prototype.toString = function(T) {
        return T === void 0 && (T = !1), b(this, T);
      }, S.prototype.toJSON = function() {
        return this;
      }, S.revive = function(T) {
        if (T) {
          if (T instanceof S)
            return T;
          var E = new M(T);
          return E._formatted = T.external, E._fsPath = T._sep === L ? T.fsPath : null, E;
        }
        return T;
      }, S;
    }(), L = l ? 1 : void 0, M = function(S) {
      function T() {
        var E = S !== null && S.apply(this, arguments) || this;
        return E._formatted = null, E._fsPath = null, E;
      }
      return h(T, S), Object.defineProperty(T.prototype, "fsPath", { get: function() {
        return this._fsPath || (this._fsPath = m(this, !1)), this._fsPath;
      }, enumerable: !1, configurable: !0 }), T.prototype.toString = function(E) {
        return E === void 0 && (E = !1), E ? b(this, !0) : (this._formatted || (this._formatted = b(this, !1)), this._formatted);
      }, T.prototype.toJSON = function() {
        var E = { $mid: 1 };
        return this._fsPath && (E.fsPath = this._fsPath, E._sep = L), this._formatted && (E.external = this._formatted), this.path && (E.path = this.path), this.scheme && (E.scheme = this.scheme), this.authority && (E.authority = this.authority), this.query && (E.query = this.query), this.fragment && (E.fragment = this.fragment), E;
      }, T;
    }(v), z = ((c = {})[58] = "%3A", c[47] = "%2F", c[63] = "%3F", c[35] = "%23", c[91] = "%5B", c[93] = "%5D", c[64] = "%40", c[33] = "%21", c[36] = "%24", c[38] = "%26", c[39] = "%27", c[40] = "%28", c[41] = "%29", c[42] = "%2A", c[43] = "%2B", c[44] = "%2C", c[59] = "%3B", c[61] = "%3D", c[32] = "%20", c);
    function D(S, T) {
      for (var E = void 0, H = -1, R = 0; R < S.length; R++) {
        var N = S.charCodeAt(R);
        if (N >= 97 && N <= 122 || N >= 65 && N <= 90 || N >= 48 && N <= 57 || N === 45 || N === 46 || N === 95 || N === 126 || T && N === 47)
          H !== -1 && (E += encodeURIComponent(S.substring(H, R)), H = -1), E !== void 0 && (E += S.charAt(R));
        else {
          E === void 0 && (E = S.substr(0, R));
          var F = z[N];
          F !== void 0 ? (H !== -1 && (E += encodeURIComponent(S.substring(H, R)), H = -1), E += F) : H === -1 && (H = R);
        }
      }
      return H !== -1 && (E += encodeURIComponent(S.substring(H))), E !== void 0 ? E : S;
    }
    function p(S) {
      for (var T = void 0, E = 0; E < S.length; E++) {
        var H = S.charCodeAt(E);
        H === 35 || H === 63 ? (T === void 0 && (T = S.substr(0, E)), T += z[H]) : T !== void 0 && (T += S[E]);
      }
      return T !== void 0 ? T : S;
    }
    function m(S, T) {
      var E;
      return E = S.authority && S.path.length > 1 && S.scheme === "file" ? "//".concat(S.authority).concat(S.path) : S.path.charCodeAt(0) === 47 && (S.path.charCodeAt(1) >= 65 && S.path.charCodeAt(1) <= 90 || S.path.charCodeAt(1) >= 97 && S.path.charCodeAt(1) <= 122) && S.path.charCodeAt(2) === 58 ? T ? S.path.substr(1) : S.path[1].toLowerCase() + S.path.substr(2) : S.path, l && (E = E.replace(/\//g, "\\")), E;
    }
    function b(S, T) {
      var E = T ? p : D, H = "", R = S.scheme, N = S.authority, F = S.path, G = S.query, $ = S.fragment;
      if (R && (H += R, H += ":"), (N || R === "file") && (H += y, H += y), N) {
        var j = N.indexOf("@");
        if (j !== -1) {
          var J = N.substr(0, j);
          N = N.substr(j + 1), (j = J.indexOf(":")) === -1 ? H += E(J, !1) : (H += E(J.substr(0, j), !1), H += ":", H += E(J.substr(j + 1), !1)), H += "@";
        }
        (j = (N = N.toLowerCase()).indexOf(":")) === -1 ? H += E(N, !1) : (H += E(N.substr(0, j), !1), H += N.substr(j));
      }
      if (F) {
        if (F.length >= 3 && F.charCodeAt(0) === 47 && F.charCodeAt(2) === 58)
          (se = F.charCodeAt(1)) >= 65 && se <= 90 && (F = "/".concat(String.fromCharCode(se + 32), ":").concat(F.substr(3)));
        else if (F.length >= 2 && F.charCodeAt(1) === 58) {
          var se;
          (se = F.charCodeAt(0)) >= 65 && se <= 90 && (F = "".concat(String.fromCharCode(se + 32), ":").concat(F.substr(2)));
        }
        H += E(F, !0);
      }
      return G && (H += "?", H += E(G, !1)), $ && (H += "#", H += T ? $ : D($, !1)), H;
    }
    function I(S) {
      try {
        return decodeURIComponent(S);
      } catch {
        return S.length > 3 ? S.substr(0, 3) + I(S.substr(3)) : S;
      }
    }
    var C = /(%[0-9A-Za-z][0-9A-Za-z])+/g;
    function x(S) {
      return S.match(C) ? S.replace(C, function(T) {
        return I(T);
      }) : S;
    }
    var W, P = s(470), B = function(S, T, E) {
      if (E || arguments.length === 2)
        for (var H, R = 0, N = T.length; R < N; R++)
          !H && R in T || (H || (H = Array.prototype.slice.call(T, 0, R)), H[R] = T[R]);
      return S.concat(H || Array.prototype.slice.call(T));
    }, q = P.posix || P;
    (function(S) {
      S.joinPath = function(T) {
        for (var E = [], H = 1; H < arguments.length; H++)
          E[H - 1] = arguments[H];
        return T.with({ path: q.join.apply(q, B([T.path], E, !1)) });
      }, S.resolvePath = function(T) {
        for (var E = [], H = 1; H < arguments.length; H++)
          E[H - 1] = arguments[H];
        var R = T.path || "/";
        return T.with({ path: q.resolve.apply(q, B([R], E, !1)) });
      }, S.dirname = function(T) {
        var E = q.dirname(T.path);
        return E.length === 1 && E.charCodeAt(0) === 46 ? T : T.with({ path: E });
      }, S.basename = function(T) {
        return q.basename(T.path);
      }, S.extname = function(T) {
        return q.extname(T.path);
      };
    })(W || (W = {}));
  } }, t = {};
  function n(r) {
    if (t[r])
      return t[r].exports;
    var i = t[r] = { exports: {} };
    return e[r](i, i.exports, n), i.exports;
  }
  return n.d = (r, i) => {
    for (var s in i)
      n.o(i, s) && !n.o(r, s) && Object.defineProperty(r, s, { enumerable: !0, get: i[s] });
  }, n.o = (r, i) => Object.prototype.hasOwnProperty.call(r, i), n.r = (r) => {
    typeof Symbol < "u" && Symbol.toStringTag && Object.defineProperty(r, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(r, "__esModule", { value: !0 });
  }, n(447);
})();
var { URI: zo, Utils: hl } = Zi;
function yn(e) {
  var t = e[0], n = e[e.length - 1];
  return t === n && (t === "'" || t === '"') && (e = e.substr(1, e.length - 2)), e;
}
function Wo(e, t) {
  return !e.length || t === "handlebars" && /{{|}}/.test(e) ? !1 : /\b(w[\w\d+.-]*:\/\/)?[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/.test(e);
}
function Fo(e, t, n, r) {
  if (!(/^\s*javascript\:/i.test(t) || /[\n\r]/.test(t))) {
    if (t = t.replace(/^\s*/g, ""), /^https?:\/\//i.test(t) || /^file:\/\//i.test(t))
      return t;
    if (/^\#/i.test(t))
      return e + t;
    if (/^\/\//i.test(t)) {
      var i = Ie(e, "https://") ? "https" : "http";
      return i + ":" + t.replace(/^\s*/g, "");
    }
    return n ? n.resolveReference(t, r || e) : t;
  }
}
function Po(e, t, n, r, i, s) {
  var l = yn(n);
  if (Wo(l, e.languageId)) {
    l.length < n.length && (r++, i--);
    var u = Fo(e.uri, l, t, s);
    if (!(!u || !Bo(u)))
      return {
        range: X.create(e.positionAt(r), e.positionAt(i)),
        target: u
      };
  }
}
function Bo(e) {
  try {
    return zo.parse(e), !0;
  } catch {
    return !1;
  }
}
function qo(e, t) {
  for (var n = [], r = pe(e.getText(), 0), i = r.scan(), s = void 0, l = !1, u = void 0, o = {}; i !== U.EOS; ) {
    switch (i) {
      case U.StartTag:
        if (!u) {
          var c = r.getTokenText().toLowerCase();
          l = c === "base";
        }
        break;
      case U.AttributeName:
        s = r.getTokenText().toLowerCase();
        break;
      case U.AttributeValue:
        if (s === "src" || s === "href") {
          var h = r.getTokenText();
          if (!l) {
            var d = Po(e, t, h, r.getTokenOffset(), r.getTokenEnd(), u);
            d && n.push(d);
          }
          l && typeof u > "u" && (u = yn(h), u && t && (u = t.resolveReference(u, e.uri))), l = !1, s = void 0;
        } else if (s === "id") {
          var f = yn(r.getTokenText());
          o[f] = r.getTokenOffset();
        }
        break;
    }
    i = r.scan();
  }
  for (var g = 0, _ = n; g < _.length; g++) {
    var d = _[g], w = e.uri + "#";
    if (d.target && Ie(d.target, w)) {
      var y = d.target.substr(w.length), k = o[y];
      if (k !== void 0) {
        var v = e.positionAt(k);
        d.target = "".concat(w).concat(v.line + 1, ",").concat(v.character + 1);
      }
    }
  }
  return n;
}
function Oo(e, t, n) {
  var r = e.offsetAt(t), i = n.findNodeAt(r);
  if (!i.tag)
    return [];
  var s = [], l = xi(U.StartTag, e, i.start), u = typeof i.endTagStart == "number" && xi(U.EndTag, e, i.endTagStart);
  return (l && Si(l, t) || u && Si(u, t)) && (l && s.push({ kind: Dt.Read, range: l }), u && s.push({ kind: Dt.Read, range: u })), s;
}
function Ci(e, t) {
  return e.line < t.line || e.line === t.line && e.character <= t.character;
}
function Si(e, t) {
  return Ci(e.start, t) && Ci(t, e.end);
}
function xi(e, t, n) {
  for (var r = pe(t.getText(), n), i = r.scan(); i !== U.EOS && i !== e; )
    i = r.scan();
  return i !== U.EOS ? { start: t.positionAt(r.getTokenOffset()), end: t.positionAt(r.getTokenEnd()) } : null;
}
function Vo(e, t) {
  var n = [];
  return t.roots.forEach(function(r) {
    Ki(e, r, "", n);
  }), n;
}
function Ki(e, t, n, r) {
  var i = jo(t), s = Ct.create(e.uri, X.create(e.positionAt(t.start), e.positionAt(t.end))), l = {
    name: i,
    location: s,
    containerName: n,
    kind: bn.Field
  };
  r.push(l), t.children.forEach(function(u) {
    Ki(e, u, i, r);
  });
}
function jo(e) {
  var t = e.tag;
  if (e.attributes) {
    var n = e.attributes.id, r = e.attributes.class;
    n && (t += "#".concat(n.replace(/[\"\']/g, ""))), r && (t += r.replace(/[\"\']/g, "").split(/\s+/).map(function(i) {
      return ".".concat(i);
    }).join(""));
  }
  return t || "?";
}
function Go(e, t, n, r) {
  var i, s = e.offsetAt(t), l = r.findNodeAt(s);
  if (!l.tag || !$o(l, s, l.tag))
    return null;
  var u = [], o = {
    start: e.positionAt(l.start + 1),
    end: e.positionAt(l.start + 1 + l.tag.length)
  };
  if (u.push({
    range: o,
    newText: n
  }), l.endTagStart) {
    var c = {
      start: e.positionAt(l.endTagStart + 2),
      end: e.positionAt(l.endTagStart + 2 + l.tag.length)
    };
    u.push({
      range: c,
      newText: n
    });
  }
  var h = (i = {}, i[e.uri.toString()] = u, i);
  return {
    changes: h
  };
}
function $o(e, t, n) {
  return e.endTagStart && e.endTagStart + 2 <= t && t <= e.endTagStart + 2 + n.length ? !0 : e.start + 1 <= t && t <= e.start + 1 + n.length;
}
function Xo(e, t, n) {
  var r = e.offsetAt(t), i = n.findNodeAt(r);
  if (!i.tag || !i.endTagStart)
    return null;
  if (i.start + 1 <= r && r <= i.start + 1 + i.tag.length) {
    var s = r - 1 - i.start + i.endTagStart + 2;
    return e.positionAt(s);
  }
  if (i.endTagStart + 2 <= r && r <= i.endTagStart + 2 + i.tag.length) {
    var s = r - 2 - i.endTagStart + i.start + 1;
    return e.positionAt(s);
  }
  return null;
}
function Li(e, t, n) {
  var r = e.offsetAt(t), i = n.findNodeAt(r), s = i.tag ? i.tag.length : 0;
  return i.endTagStart && (i.start + 1 <= r && r <= i.start + 1 + s || i.endTagStart + 2 <= r && r <= i.endTagStart + 2 + s) ? [
    X.create(e.positionAt(i.start + 1), e.positionAt(i.start + 1 + s)),
    X.create(e.positionAt(i.endTagStart + 2), e.positionAt(i.endTagStart + 2 + s))
  ] : null;
}
function Jo(e, t) {
  e = e.sort(function(_, w) {
    var y = _.startLine - w.startLine;
    return y === 0 && (y = _.endLine - w.endLine), y;
  });
  for (var n = void 0, r = [], i = [], s = [], l = function(_, w) {
    i[_] = w, w < 30 && (s[w] = (s[w] || 0) + 1);
  }, u = 0; u < e.length; u++) {
    var o = e[u];
    if (!n)
      n = o, l(u, 0);
    else if (o.startLine > n.startLine) {
      if (o.endLine <= n.endLine)
        r.push(n), n = o, l(u, r.length);
      else if (o.startLine > n.endLine) {
        do
          n = r.pop();
        while (n && o.startLine > n.endLine);
        n && r.push(n), n = o, l(u, r.length);
      }
    }
  }
  for (var c = 0, h = 0, u = 0; u < s.length; u++) {
    var d = s[u];
    if (d) {
      if (d + c > t) {
        h = u;
        break;
      }
      c += d;
    }
  }
  for (var f = [], u = 0; u < e.length; u++) {
    var g = i[u];
    typeof g == "number" && (g < h || g === h && c++ < t) && f.push(e[u]);
  }
  return f;
}
function Qo(e, t) {
  var n = pe(e.getText()), r = n.scan(), i = [], s = [], l = null, u = -1;
  function o(v) {
    i.push(v), u = v.startLine;
  }
  for (; r !== U.EOS; ) {
    switch (r) {
      case U.StartTag: {
        var c = n.getTokenText(), h = e.positionAt(n.getTokenOffset()).line;
        s.push({ startLine: h, tagName: c }), l = c;
        break;
      }
      case U.EndTag: {
        l = n.getTokenText();
        break;
      }
      case U.StartTagClose:
        if (!l || !Ut(l))
          break;
      case U.EndTagClose:
      case U.StartTagSelfClose: {
        for (var d = s.length - 1; d >= 0 && s[d].tagName !== l; )
          d--;
        if (d >= 0) {
          var f = s[d];
          s.length = d;
          var g = e.positionAt(n.getTokenOffset()).line, h = f.startLine, _ = g - 1;
          _ > h && u !== h && o({ startLine: h, endLine: _ });
        }
        break;
      }
      case U.Comment: {
        var h = e.positionAt(n.getTokenOffset()).line, w = n.getTokenText(), y = w.match(/^\s*#(region\b)|(endregion\b)/);
        if (y)
          if (y[1])
            s.push({ startLine: h, tagName: "" });
          else {
            for (var d = s.length - 1; d >= 0 && s[d].tagName.length; )
              d--;
            if (d >= 0) {
              var f = s[d];
              s.length = d;
              var _ = h;
              h = f.startLine, _ > h && u !== h && o({ startLine: h, endLine: _, kind: St.Region });
            }
          }
        else {
          var _ = e.positionAt(n.getTokenOffset() + n.getTokenLength()).line;
          h < _ && o({ startLine: h, endLine: _, kind: St.Comment });
        }
        break;
      }
    }
    r = n.scan();
  }
  var k = t && t.rangeLimit || Number.MAX_VALUE;
  return i.length > k ? Jo(i, k) : i;
}
function Yo(e, t) {
  function n(r) {
    for (var i = Zo(e, r), s = void 0, l = void 0, u = i.length - 1; u >= 0; u--) {
      var o = i[u];
      (!s || o[0] !== s[0] || o[1] !== s[1]) && (l = Rt.create(X.create(e.positionAt(i[u][0]), e.positionAt(i[u][1])), l)), s = o;
    }
    return l || (l = Rt.create(X.create(r, r))), l;
  }
  return t.map(n);
}
function Zo(e, t) {
  var n = Xi(e.getText()), r = e.offsetAt(t), i = n.findNodeAt(r), s = Ko(i);
  if (i.startTagEnd && !i.endTagStart) {
    if (i.startTagEnd !== i.end)
      return [[i.start, i.end]];
    var l = X.create(e.positionAt(i.startTagEnd - 2), e.positionAt(i.startTagEnd)), u = e.getText(l);
    u === "/>" ? s.unshift([i.start + 1, i.startTagEnd - 2]) : s.unshift([i.start + 1, i.startTagEnd - 1]);
    var o = Ei(e, i, r);
    return s = o.concat(s), s;
  }
  if (!i.startTagEnd || !i.endTagStart)
    return s;
  if (s.unshift([i.start, i.end]), i.start < r && r < i.startTagEnd) {
    s.unshift([i.start + 1, i.startTagEnd - 1]);
    var o = Ei(e, i, r);
    return s = o.concat(s), s;
  } else
    return i.startTagEnd <= r && r <= i.endTagStart ? (s.unshift([i.startTagEnd, i.endTagStart]), s) : (r >= i.endTagStart + 2 && s.unshift([i.endTagStart + 2, i.end - 1]), s);
}
function Ko(e) {
  for (var t = e, n = function(i) {
    return i.startTagEnd && i.endTagStart && i.startTagEnd < i.endTagStart ? [
      [i.startTagEnd, i.endTagStart],
      [i.start, i.end]
    ] : [
      [i.start, i.end]
    ];
  }, r = []; t.parent; )
    t = t.parent, n(t).forEach(function(i) {
      return r.push(i);
    });
  return r;
}
function Ei(e, t, n) {
  for (var r = X.create(e.positionAt(t.start), e.positionAt(t.end)), i = e.getText(r), s = n - t.start, l = pe(i), u = l.scan(), o = t.start, c = [], h = !1, d = -1; u !== U.EOS; ) {
    switch (u) {
      case U.AttributeName: {
        if (s < l.getTokenOffset()) {
          h = !1;
          break;
        }
        s <= l.getTokenEnd() && c.unshift([l.getTokenOffset(), l.getTokenEnd()]), h = !0, d = l.getTokenOffset();
        break;
      }
      case U.AttributeValue: {
        if (!h)
          break;
        var f = l.getTokenText();
        if (s < l.getTokenOffset()) {
          c.push([d, l.getTokenEnd()]);
          break;
        }
        s >= l.getTokenOffset() && s <= l.getTokenEnd() && (c.unshift([l.getTokenOffset(), l.getTokenEnd()]), (f[0] === '"' && f[f.length - 1] === '"' || f[0] === "'" && f[f.length - 1] === "'") && s >= l.getTokenOffset() + 1 && s <= l.getTokenEnd() - 1 && c.unshift([l.getTokenOffset() + 1, l.getTokenEnd() - 1]), c.push([d, l.getTokenEnd()]));
        break;
      }
    }
    u = l.scan();
  }
  return c.map(function(g) {
    return [g[0] + o, g[1] + o];
  });
}
var el = {
  version: 1.1,
  tags: [
    {
      name: "html",
      description: {
        kind: "markdown",
        value: "The html element represents the root of an HTML document."
      },
      attributes: [
        {
          name: "manifest",
          description: {
            kind: "markdown",
            value: "Specifies the URI of a resource manifest indicating resources that should be cached locally. See [Using the application cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) for details."
          }
        },
        {
          name: "version",
          description: 'Specifies the version of the HTML [Document Type Definition](https://developer.mozilla.org/en-US/docs/Glossary/DTD "Document Type Definition: In HTML, the doctype is the required "<!DOCTYPE html>" preamble found at the top of all documents. Its sole purpose is to prevent a browser from switching into so-called “quirks mode” when rendering a document; that is, the "<!DOCTYPE html>" doctype ensures that the browser makes a best-effort attempt at following the relevant specifications, rather than using a different rendering mode that is incompatible with some specifications.") that governs the current document. This attribute is not needed, because it is redundant with the version information in the document type declaration.'
        },
        {
          name: "xmlns",
          description: 'Specifies the XML Namespace of the document. Default value is `"http://www.w3.org/1999/xhtml"`. This is required in documents parsed with XML parsers, and optional in text/html documents.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/html"
        }
      ]
    },
    {
      name: "head",
      description: {
        kind: "markdown",
        value: "The head element represents a collection of metadata for the Document."
      },
      attributes: [
        {
          name: "profile",
          description: "The URIs of one or more metadata profiles, separated by white space."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/head"
        }
      ]
    },
    {
      name: "title",
      description: {
        kind: "markdown",
        value: "The title element represents the document's title or name. Authors should use titles that identify their documents even when they are used out of context, for example in a user's history or bookmarks, or in search results. The document's title is often different from its first heading, since the first heading does not have to stand alone when taken out of context."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/title"
        }
      ]
    },
    {
      name: "base",
      description: {
        kind: "markdown",
        value: "The base element allows authors to specify the document base URL for the purposes of resolving relative URLs, and the name of the default browsing context for the purposes of following hyperlinks. The element does not represent any content beyond this information."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: "The base URL to be used throughout the document for relative URL addresses. If this attribute is specified, this element must come before any other elements with attributes whose values are URLs. Absolute and relative URLs are allowed."
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: "A name or keyword indicating the default location to display the result when hyperlinks or forms cause navigation, for elements that do not have an explicit target reference. It is a name of, or keyword for, a _browsing context_ (for example: tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the result into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the result into a new unnamed browsing context.\n*   `_parent`: Load the result into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the result into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n\nIf this attribute is specified, this element must come before any other elements with attributes whose values are URLs."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/base"
        }
      ]
    },
    {
      name: "link",
      description: {
        kind: "markdown",
        value: "The link element allows authors to link their document to other resources."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: 'This attribute specifies the [URL](https://developer.mozilla.org/en-US/docs/Glossary/URL "URL: Uniform Resource Locator (URL) is a text string specifying where a resource can be found on the Internet.") of the linked resource. A URL can be absolute or relative.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates whether [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") must be used when fetching the resource. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\n`anonymous`\n\nA cross-origin request (i.e. with an [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin "The Origin request header indicates where a fetch originates from. It doesn\'t include any path information, but only the server name. It is sent with CORS requests, as well as with POST requests. It is similar to the Referer header, but, unlike this header, it doesn\'t disclose the whole path.") HTTP header) is performed, but no credential is sent (i.e. no cookie, X.509 certificate, or HTTP Basic authentication). If the server does not give credentials to the origin site (by not setting the [`Access-Control-Allow-Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin "The Access-Control-Allow-Origin response header indicates whether the response can be shared with requesting code from the given origin.") HTTP header) the image will be tainted and its usage restricted.\n\n`use-credentials`\n\nA cross-origin request (i.e. with an `Origin` HTTP header) is performed along with a credential sent (i.e. a cookie, certificate, and/or HTTP Basic authentication is performed). If the server does not give credentials to the origin site (through [`Access-Control-Allow-Credentials`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials "The Access-Control-Allow-Credentials response header tells browsers whether to expose the response to frontend JavaScript code when the request\'s credentials mode (Request.credentials) is "include".") HTTP header), the resource will be _tainted_ and its usage restricted.\n\nIf the attribute is not present, the resource is fetched without a [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") request (i.e. without sending the `Origin` HTTP header), preventing its non-tainted usage. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for additional information.'
          }
        },
        {
          name: "rel",
          description: {
            kind: "markdown",
            value: "This attribute names a relationship of the linked document to the current document. The attribute must be a space-separated list of the [link types values](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
          }
        },
        {
          name: "media",
          description: {
            kind: "markdown",
            value: "This attribute specifies the media that the linked resource applies to. Its value must be a media type / [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries). This attribute is mainly useful when linking to external stylesheets — it allows the user agent to pick the best adapted one for the device it runs on.\n\n**Notes:**\n\n*   In HTML 4, this can only be a simple white-space-separated list of media description literals, i.e., [media types and groups](https://developer.mozilla.org/en-US/docs/Web/CSS/@media), where defined and allowed as values for this attribute, such as `print`, `screen`, `aural`, `braille`. HTML5 extended this to any kind of [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries), which are a superset of the allowed values of HTML 4.\n*   Browsers not supporting [CSS3 Media Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_queries) won't necessarily recognize the adequate link; do not forget to set fallback links, the restricted set of media queries defined in HTML 4."
          }
        },
        {
          name: "hreflang",
          description: {
            kind: "markdown",
            value: "This attribute indicates the language of the linked resource. It is purely advisory. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt). Use this attribute only if the [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute is present."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'This attribute is used to define the type of the content linked to. The value of the attribute should be a MIME type such as **text/html**, **text/css**, and so on. The common use of this attribute is to define the type of stylesheet being referenced (such as **text/css**), but given that CSS is the only stylesheet language used on the web, not only is it possible to omit the `type` attribute, but is actually now recommended practice. It is also used on `rel="preload"` link types, to make sure the browser only downloads file types that it supports.'
          }
        },
        {
          name: "sizes",
          description: {
            kind: "markdown",
            value: "This attribute defines the sizes of the icons for visual media contained in the resource. It must be present only if the [`rel`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#attr-rel) contains a value of `icon` or a non-standard type such as Apple's `apple-touch-icon`. It may have the following values:\n\n*   `any`, meaning that the icon can be scaled to any size as it is in a vector format, like `image/svg+xml`.\n*   a white-space separated list of sizes, each in the format `_<width in pixels>_x_<height in pixels>_` or `_<width in pixels>_X_<height in pixels>_`. Each of these sizes must be contained in the resource.\n\n**Note:** Most icon formats are only able to store one single icon; therefore most of the time the [`sizes`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-sizes) contains only one entry. MS's ICO format does, as well as Apple's ICNS. ICO is more ubiquitous; you should definitely use it."
          }
        },
        {
          name: "as",
          description: 'This attribute is only used when `rel="preload"` or `rel="prefetch"` has been set on the `<link>` element. It specifies the type of content being loaded by the `<link>`, which is necessary for content prioritization, request matching, application of correct [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP), and setting of correct [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept "The Accept request HTTP header advertises which content types, expressed as MIME types, the client is able to understand. Using content negotiation, the server then selects one of the proposals, uses it and informs the client of its choice with the Content-Type response header. Browsers set adequate values for this header depending on the context where the request is done: when fetching a CSS stylesheet a different value is set for the request than when fetching an image, video or a script.") request header.'
        },
        {
          name: "importance",
          description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
        },
        {
          name: "importance",
          description: '**`auto`**: Indicates **no preference**. The browser may use its own heuristics to decide the priority of the resource.\n\n**`high`**: Indicates to the browser that the resource is of **high** priority.\n\n**`low`**: Indicates to the browser that the resource is of **low** priority.\n\n**Note:** The `importance` attribute may only be used for the `<link>` element if `rel="preload"` or `rel="prefetch"` is present.'
        },
        {
          name: "integrity",
          description: "Contains inline metadata — a base64-encoded cryptographic hash of the resource (file) you’re telling the browser to fetch. The browser can use this to verify that the fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
        },
        {
          name: "referrerpolicy",
          description: 'A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer` means that the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` means that no [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior, if no policy is otherwise specified.\n*   `origin` means that the referrer will be the origin of the page, which is roughly the scheme, the host, and the port.\n*   `origin-when-cross-origin` means that navigating to other origins will be limited to the scheme, the host, and the port, while navigating on the same origin will include the referrer\'s path.\n*   `unsafe-url` means that the referrer will include the origin and the path (but not the fragment, password, or username). This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins.'
        },
        {
          name: "title",
          description: 'The `title` attribute has special semantics on the `<link>` element. When used on a `<link rel="stylesheet">` it defines a [preferred or an alternate stylesheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets). Incorrectly using it may [cause the stylesheet to be ignored](https://developer.mozilla.org/en-US/docs/Correctly_Using_Titles_With_External_Stylesheets).'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/link"
        }
      ]
    },
    {
      name: "meta",
      description: {
        kind: "markdown",
        value: "The meta element represents various kinds of metadata that cannot be expressed using the title, base, link, style, and script elements."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: `This attribute defines the name of a piece of document-level metadata. It should not be set if one of the attributes [\`itemprop\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-itemprop), [\`http-equiv\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [\`charset\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) is also set.

This metadata name is associated with the value contained by the [\`content\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute. The possible values for the name attribute are:

*   \`application-name\` which defines the name of the application running in the web page.
    
    **Note:**
    
    *   Browsers may use this to identify the application. It is different from the [\`<title>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title "The HTML Title element (<title>) defines the document's title that is shown in a browser's title bar or a page's tab.") element, which usually contain the application name, but may also contain information like the document name or a status.
    *   Simple web pages shouldn't define an application-name.
    
*   \`author\` which defines the name of the document's author.
*   \`description\` which contains a short and accurate summary of the content of the page. Several browsers, like Firefox and Opera, use this as the default description of bookmarked pages.
*   \`generator\` which contains the identifier of the software that generated the page.
*   \`keywords\` which contains words relevant to the page's content separated by commas.
*   \`referrer\` which controls the [\`Referer\` HTTP header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) attached to requests sent from the document:
    
    Values for the \`content\` attribute of \`<meta name="referrer">\`
    
    \`no-referrer\`
    
    Do not send a HTTP \`Referrer\` header.
    
    \`origin\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the document.
    
    \`no-referrer-when-downgrade\`
    
    Send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) as a referrer to URLs as secure as the current page, (https→https), but does not send a referrer to less secure URLs (https→http). This is the default behaviour.
    
    \`origin-when-cross-origin\`
    
    Send the full URL (stripped of parameters) for same-origin requests, but only send the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) for other cases.
    
    \`same-origin\`
    
    A referrer will be sent for [same-site origins](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), but cross-origin requests will contain no referrer information.
    
    \`strict-origin\`
    
    Only send the origin of the document as the referrer to a-priori as-much-secure destination (HTTPS->HTTPS), but don't send it to a less secure destination (HTTPS->HTTP).
    
    \`strict-origin-when-cross-origin\`
    
    Send a full URL when performing a same-origin request, only send the origin of the document to a-priori as-much-secure destination (HTTPS->HTTPS), and send no header to a less secure destination (HTTPS->HTTP).
    
    \`unsafe-URL\`
    
    Send the full URL (stripped of parameters) for same-origin or cross-origin requests.
    
    **Notes:**
    
    *   Some browsers support the deprecated values of \`always\`, \`default\`, and \`never\` for referrer.
    *   Dynamically inserting \`<meta name="referrer">\` (with [\`document.write\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write) or [\`appendChild\`](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild)) makes the referrer behaviour unpredictable.
    *   When several conflicting policies are defined, the no-referrer policy is applied.
    

This attribute may also have a value taken from the extended list defined on [WHATWG Wiki MetaExtensions page](https://wiki.whatwg.org/wiki/MetaExtensions). Although none have been formally accepted yet, a few commonly used names are:

*   \`creator\` which defines the name of the creator of the document, such as an organization or institution. If there are more than one, several [\`<meta>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") elements should be used.
*   \`googlebot\`, a synonym of \`robots\`, is only followed by Googlebot (the indexing crawler for Google).
*   \`publisher\` which defines the name of the document's publisher.
*   \`robots\` which defines the behaviour that cooperative crawlers, or "robots", should use with the page. It is a comma-separated list of the values below:
    
    Values for the content of \`<meta name="robots">\`
    
    Value
    
    Description
    
    Used by
    
    \`index\`
    
    Allows the robot to index the page (default).
    
    All
    
    \`noindex\`
    
    Requests the robot to not index the page.
    
    All
    
    \`follow\`
    
    Allows the robot to follow the links on the page (default).
    
    All
    
    \`nofollow\`
    
    Requests the robot to not follow the links on the page.
    
    All
    
    \`none\`
    
    Equivalent to \`noindex, nofollow\`
    
    [Google](https://support.google.com/webmasters/answer/79812)
    
    \`noodp\`
    
    Prevents using the [Open Directory Project](https://www.dmoz.org/) description, if any, as the page description in search engine results.
    
    [Google](https://support.google.com/webmasters/answer/35624#nodmoz), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/meta-tags-robotstxt-yahoo-search-sln2213.html#cont5), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noarchive\`
    
    Requests the search engine not to cache the page content.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Yahoo](https://help.yahoo.com/kb/search-for-desktop/SLN2213.html), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`nosnippet\`
    
    Prevents displaying any description of the page in search engine results.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives), [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    \`noimageindex\`
    
    Requests this page not to appear as the referring page of an indexed image.
    
    [Google](https://developers.google.com/webmasters/control-crawl-index/docs/robots_meta_tag#valid-indexing--serving-directives)
    
    \`nocache\`
    
    Synonym of \`noarchive\`.
    
    [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
    
    **Notes:**
    
    *   Only cooperative robots follow these rules. Do not expect to prevent e-mail harvesters with them.
    *   The robot still needs to access the page in order to read these rules. To prevent bandwidth consumption, use a _[robots.txt](https://developer.mozilla.org/en-US/docs/Glossary/robots.txt "robots.txt: Robots.txt is a file which is usually placed in the root of any website. It decides whether crawlers are permitted or forbidden access to the web site.")_ file.
    *   If you want to remove a page, \`noindex\` will work, but only after the robot visits the page again. Ensure that the \`robots.txt\` file is not preventing revisits.
    *   Some values are mutually exclusive, like \`index\` and \`noindex\`, or \`follow\` and \`nofollow\`. In these cases the robot's behaviour is undefined and may vary between them.
    *   Some crawler robots, like Google, Yahoo and Bing, support the same values for the HTTP header \`X-Robots-Tag\`; this allows non-HTML documents like images to use these rules.
    
*   \`slurp\`, is a synonym of \`robots\`, but only for Slurp - the crawler for Yahoo Search.
*   \`viewport\`, which gives hints about the size of the initial size of the [viewport](https://developer.mozilla.org/en-US/docs/Glossary/viewport "viewport: A viewport represents a polygonal (normally rectangular) area in computer graphics that is currently being viewed. In web browser terms, it refers to the part of the document you're viewing which is currently visible in its window (or the screen, if the document is being viewed in full screen mode). Content outside the viewport is not visible onscreen until scrolled into view."). Used by mobile devices only.
    
    Values for the content of \`<meta name="viewport">\`
    
    Value
    
    Possible subvalues
    
    Description
    
    \`width\`
    
    A positive integer number, or the text \`device-width\`
    
    Defines the pixel width of the viewport that you want the web site to be rendered at.
    
    \`height\`
    
    A positive integer, or the text \`device-height\`
    
    Defines the height of the viewport. Not used by any browser.
    
    \`initial-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the ratio between the device width (\`device-width\` in portrait mode or \`device-height\` in landscape mode) and the viewport size.
    
    \`maximum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the maximum amount to zoom in. It must be greater or equal to the \`minimum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`minimum-scale\`
    
    A positive number between \`0.0\` and \`10.0\`
    
    Defines the minimum zoom level. It must be smaller or equal to the \`maximum-scale\` or the behaviour is undefined. Browser settings can ignore this rule and iOS10+ ignores it by default.
    
    \`user-scalable\`
    
    \`yes\` or \`no\`
    
    If set to \`no\`, the user is not able to zoom in the webpage. The default is \`yes\`. Browser settings can ignore this rule, and iOS10+ ignores it by default.
    
    Specification
    
    Status
    
    Comment
    
    [CSS Device Adaptation  
    The definition of '<meta name="viewport">' in that specification.](https://drafts.csswg.org/css-device-adapt/#viewport-meta)
    
    Working Draft
    
    Non-normatively describes the Viewport META element
    
    See also: [\`@viewport\`](https://developer.mozilla.org/en-US/docs/Web/CSS/@viewport "The @viewport CSS at-rule lets you configure the viewport through which the document is viewed. It's primarily used for mobile devices, but is also used by desktop browsers that support features like "snap to edge" (such as Microsoft Edge).")
    
    **Notes:**
    
    *   Though unstandardized, this declaration is respected by most mobile browsers due to de-facto dominance.
    *   The default values may vary between devices and browsers.
    *   To learn about this declaration in Firefox for Mobile, see [this article](https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag "Mobile/Viewport meta tag").`
          }
        },
        {
          name: "http-equiv",
          description: {
            kind: "markdown",
            value: 'Defines a pragma directive. The attribute is named `**http-equiv**(alent)` because all the allowed values are names of particular HTTP headers:\n\n*   `"content-language"`  \n    Defines the default language of the page. It can be overridden by the [lang](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang) attribute on any element.\n    \n    **Warning:** Do not use this value, as it is obsolete. Prefer the `lang` attribute on the [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html "The HTML <html> element represents the root (top-level element) of an HTML document, so it is also referred to as the root element. All other elements must be descendants of this element.") element.\n    \n*   `"content-security-policy"`  \n    Allows page authors to define a [content policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/CSP_policy_directives) for the current page. Content policies mostly specify allowed server origins and script endpoints which help guard against cross-site scripting attacks.\n*   `"content-type"`  \n    Defines the [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type) of the document, followed by its character encoding. It follows the same syntax as the HTTP `content-type` entity-header field, but as it is inside a HTML page, most values other than `text/html` are impossible. Therefore the valid syntax for its `content` is the string \'`text/html`\' followed by a character set with the following syntax: \'`; charset=_IANAcharset_`\', where `IANAcharset` is the _preferred MIME name_ for a character set as [defined by the IANA.](https://www.iana.org/assignments/character-sets)\n    \n    **Warning:** Do not use this value, as it is obsolete. Use the [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute on the [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element.\n    \n    **Note:** As [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") can\'t change documents\' types in XHTML or HTML5\'s XHTML serialization, never set the MIME type to an XHTML MIME type with `<meta>`.\n    \n*   `"refresh"`  \n    This instruction specifies:\n    *   The number of seconds until the page should be reloaded - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer.\n    *   The number of seconds until the page should redirect to another - only if the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) attribute contains a positive integer followed by the string \'`;url=`\', and a valid URL.\n*   `"set-cookie"`  \n    Defines a [cookie](https://developer.mozilla.org/en-US/docs/cookie) for the page. Its content must follow the syntax defined in the [IETF HTTP Cookie Specification](https://tools.ietf.org/html/draft-ietf-httpstate-cookie-14).\n    \n    **Warning:** Do not use this instruction, as it is obsolete. Use the HTTP header [`Set-Cookie`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie) instead.'
          }
        },
        {
          name: "content",
          description: {
            kind: "markdown",
            value: "This attribute contains the value for the [`http-equiv`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-http-equiv) or [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-name) attribute, depending on which is used."
          }
        },
        {
          name: "charset",
          description: {
            kind: "markdown",
            value: 'This attribute declares the page\'s character encoding. It must contain a [standard IANA MIME name for character encodings](https://www.iana.org/assignments/character-sets). Although the standard doesn\'t request a specific encoding, it suggests:\n\n*   Authors are encouraged to use [`UTF-8`](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8).\n*   Authors should not use ASCII-incompatible encodings to avoid security risk: browsers not supporting them may interpret harmful content as HTML. This happens with the `JIS_C6226-1983`, `JIS_X0212-1990`, `HZ-GB-2312`, `JOHAB`, the ISO-2022 family and the EBCDIC family.\n\n**Note:** ASCII-incompatible encodings are those that don\'t map the 8-bit code points `0x20` to `0x7E` to the `0x0020` to `0x007E` Unicode code points)\n\n*   Authors **must not** use `CESU-8`, `UTF-7`, `BOCU-1` and/or `SCSU` as [cross-site scripting](https://developer.mozilla.org/en-US/docs/Glossary/Cross-site_scripting) attacks with these encodings have been demonstrated.\n*   Authors should not use `UTF-32` because not all HTML5 encoding algorithms can distinguish it from `UTF-16`.\n\n**Notes:**\n\n*   The declared character encoding must match the one the page was saved with to avoid garbled characters and security holes.\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element declaring the encoding must be inside the [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head "The HTML <head> element provides general information (metadata) about the document, including its title and links to its scripts and style sheets.") element and **within the first 1024 bytes** of the HTML as some browsers only look at those bytes before choosing an encoding.\n*   This [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element is only one part of the [algorithm to determine a page\'s character set](https://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html#encoding-sniffing-algorithm "Algorithm charset page"). The [`Content-Type` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) and any [Byte-Order Marks](https://developer.mozilla.org/en-US/docs/Glossary/Byte-Order_Mark "The definition of that term (Byte-Order Marks) has not been written yet; please consider contributing it!") override this element.\n*   It is strongly recommended to define the character encoding. If a page\'s encoding is undefined, cross-scripting techniques are possible, such as the [`UTF-7` fallback cross-scripting technique](https://code.google.com/p/doctype-mirror/wiki/ArticleUtf7).\n*   The [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta "The HTML <meta> element represents metadata that cannot be represented by other HTML meta-related elements, like <base>, <link>, <script>, <style> or <title>.") element with a `charset` attribute is a synonym for the pre-HTML5 `<meta http-equiv="Content-Type" content="text/html; charset=_IANAcharset_">`, where _`IANAcharset`_ contains the value of the equivalent [`charset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-charset) attribute. This syntax is still allowed, although no longer recommended.'
          }
        },
        {
          name: "scheme",
          description: "This attribute defines the scheme in which metadata is described. A scheme is a context leading to the correct interpretations of the [`content`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#attr-content) value, like a format.\n\n**Warning:** Do not use this value, as it is obsolete. There is no replacement as there was no real usage for it."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/meta"
        }
      ]
    },
    {
      name: "style",
      description: {
        kind: "markdown",
        value: "The style element allows authors to embed style information in their documents. The style element is one of several inputs to the styling processing model. The element does not represent content for the user."
      },
      attributes: [
        {
          name: "media",
          description: {
            kind: "markdown",
            value: "This attribute defines which media the style should be applied to. Its value is a [media query](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries), which defaults to `all` if the attribute is missing."
          }
        },
        {
          name: "nonce",
          description: {
            kind: "markdown",
            value: "A cryptographic nonce (number used once) used to whitelist inline styles in a [style-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/style-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource’s policy is otherwise trivial."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "This attribute defines the styling language as a MIME type (charset should not be specified). This attribute is optional and defaults to `text/css` if it is not specified — there is very little reason to include this in modern web documents."
          }
        },
        {
          name: "scoped",
          valueSet: "v"
        },
        {
          name: "title",
          description: "This attribute specifies [alternative style sheet](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets) sets."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/style"
        }
      ]
    },
    {
      name: "body",
      description: {
        kind: "markdown",
        value: "The body element represents the content of the document."
      },
      attributes: [
        {
          name: "onafterprint",
          description: {
            kind: "markdown",
            value: "Function to call after the user has printed the document."
          }
        },
        {
          name: "onbeforeprint",
          description: {
            kind: "markdown",
            value: "Function to call when the user requests printing of the document."
          }
        },
        {
          name: "onbeforeunload",
          description: {
            kind: "markdown",
            value: "Function to call when the document is about to be unloaded."
          }
        },
        {
          name: "onhashchange",
          description: {
            kind: "markdown",
            value: "Function to call when the fragment identifier part (starting with the hash (`'#'`) character) of the document's current address has changed."
          }
        },
        {
          name: "onlanguagechange",
          description: {
            kind: "markdown",
            value: "Function to call when the preferred languages changed."
          }
        },
        {
          name: "onmessage",
          description: {
            kind: "markdown",
            value: "Function to call when the document has received a message."
          }
        },
        {
          name: "onoffline",
          description: {
            kind: "markdown",
            value: "Function to call when network communication has failed."
          }
        },
        {
          name: "ononline",
          description: {
            kind: "markdown",
            value: "Function to call when network communication has been restored."
          }
        },
        {
          name: "onpagehide"
        },
        {
          name: "onpageshow"
        },
        {
          name: "onpopstate",
          description: {
            kind: "markdown",
            value: "Function to call when the user has navigated session history."
          }
        },
        {
          name: "onstorage",
          description: {
            kind: "markdown",
            value: "Function to call when the storage area has changed."
          }
        },
        {
          name: "onunload",
          description: {
            kind: "markdown",
            value: "Function to call when the document is going away."
          }
        },
        {
          name: "alink",
          description: 'Color of text for hyperlinks when selected. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:active`](https://developer.mozilla.org/en-US/docs/Web/CSS/:active "The :active CSS pseudo-class represents an element (such as a button) that is being activated by the user.") pseudo-class instead._'
        },
        {
          name: "background",
          description: 'URI of a image to use as a background. _This method is non-conforming, use CSS [`background`](https://developer.mozilla.org/en-US/docs/Web/CSS/background "The background shorthand CSS property sets all background style properties at once, such as color, image, origin and size, or repeat method.") property on the element instead._'
        },
        {
          name: "bgcolor",
          description: 'Background color for the document. _This method is non-conforming, use CSS [`background-color`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property on the element instead._'
        },
        {
          name: "bottommargin",
          description: 'The margin of the bottom of the body. _This method is non-conforming, use CSS [`margin-bottom`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom "The margin-bottom CSS property sets the margin area on the bottom of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "leftmargin",
          description: 'The margin of the left of the body. _This method is non-conforming, use CSS [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "link",
          description: 'Color of text for unvisited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:link`](https://developer.mozilla.org/en-US/docs/Web/CSS/:link "The :link CSS pseudo-class represents an element that has not yet been visited. It matches every unvisited <a>, <area>, or <link> element that has an href attribute.") pseudo-class instead._'
        },
        {
          name: "onblur",
          description: "Function to call when the document loses focus."
        },
        {
          name: "onerror",
          description: "Function to call when the document fails to load properly."
        },
        {
          name: "onfocus",
          description: "Function to call when the document receives focus."
        },
        {
          name: "onload",
          description: "Function to call when the document has finished loading."
        },
        {
          name: "onredo",
          description: "Function to call when the user has moved forward in undo transaction history."
        },
        {
          name: "onresize",
          description: "Function to call when the document has been resized."
        },
        {
          name: "onundo",
          description: "Function to call when the user has moved backward in undo transaction history."
        },
        {
          name: "rightmargin",
          description: 'The margin of the right of the body. _This method is non-conforming, use CSS [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "text",
          description: 'Foreground color of text. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property on the element instead._'
        },
        {
          name: "topmargin",
          description: 'The margin of the top of the body. _This method is non-conforming, use CSS [`margin-top`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top "The margin-top CSS property sets the margin area on the top of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") property on the element instead._'
        },
        {
          name: "vlink",
          description: 'Color of text for visited hypertext links. _This method is non-conforming, use CSS [`color`](https://developer.mozilla.org/en-US/docs/Web/CSS/color "The color CSS property sets the foreground color value of an element\'s text and text decorations, and sets the currentcolor value.") property in conjunction with the [`:visited`](https://developer.mozilla.org/en-US/docs/Web/CSS/:visited "The :visited CSS pseudo-class represents links that the user has already visited. For privacy reasons, the styles that can be modified using this selector are very limited.") pseudo-class instead._'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/body"
        }
      ]
    },
    {
      name: "article",
      description: {
        kind: "markdown",
        value: "The article element represents a complete, or self-contained, composition in a document, page, application, or site and that is, in principle, independently distributable or reusable, e.g. in syndication. This could be a forum post, a magazine or newspaper article, a blog entry, a user-submitted comment, an interactive widget or gadget, or any other independent item of content. Each article should be identified, typically by including a heading (h1–h6 element) as a child of the article element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/article"
        }
      ]
    },
    {
      name: "section",
      description: {
        kind: "markdown",
        value: "The section element represents a generic section of a document or application. A section, in this context, is a thematic grouping of content. Each section should be identified, typically by including a heading ( h1- h6 element) as a child of the section element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/section"
        }
      ]
    },
    {
      name: "nav",
      description: {
        kind: "markdown",
        value: "The nav element represents a section of a page that links to other pages or to parts within the page: a section with navigation links."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/nav"
        }
      ]
    },
    {
      name: "aside",
      description: {
        kind: "markdown",
        value: "The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/aside"
        }
      ]
    },
    {
      name: "h1",
      description: {
        kind: "markdown",
        value: "The h1 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h2",
      description: {
        kind: "markdown",
        value: "The h2 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h3",
      description: {
        kind: "markdown",
        value: "The h3 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h4",
      description: {
        kind: "markdown",
        value: "The h4 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h5",
      description: {
        kind: "markdown",
        value: "The h5 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "h6",
      description: {
        kind: "markdown",
        value: "The h6 element represents a section heading."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/Heading_Elements"
        }
      ]
    },
    {
      name: "header",
      description: {
        kind: "markdown",
        value: "The header element represents introductory content for its nearest ancestor sectioning content or sectioning root element. A header typically contains a group of introductory or navigational aids. When the nearest ancestor sectioning content or sectioning root element is the body element, then it applies to the whole page."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/header"
        }
      ]
    },
    {
      name: "footer",
      description: {
        kind: "markdown",
        value: "The footer element represents a footer for its nearest ancestor sectioning content or sectioning root element. A footer typically contains information about its section such as who wrote it, links to related documents, copyright data, and the like."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/footer"
        }
      ]
    },
    {
      name: "address",
      description: {
        kind: "markdown",
        value: "The address element represents the contact information for its nearest article or body element ancestor. If that is the body element, then the contact information applies to the document as a whole."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/address"
        }
      ]
    },
    {
      name: "p",
      description: {
        kind: "markdown",
        value: "The p element represents a paragraph."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/p"
        }
      ]
    },
    {
      name: "hr",
      description: {
        kind: "markdown",
        value: "The hr element represents a paragraph-level thematic break, e.g. a scene change in a story, or a transition to another topic within a section of a reference book."
      },
      attributes: [
        {
          name: "align",
          description: "Sets the alignment of the rule on the page. If no value is specified, the default value is `left`."
        },
        {
          name: "color",
          description: "Sets the color of the rule through color name or hexadecimal value."
        },
        {
          name: "noshade",
          description: "Sets the rule to have no shading."
        },
        {
          name: "size",
          description: "Sets the height, in pixels, of the rule."
        },
        {
          name: "width",
          description: "Sets the length of the rule on the page through a pixel or percentage value."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/hr"
        }
      ]
    },
    {
      name: "pre",
      description: {
        kind: "markdown",
        value: "The pre element represents a block of preformatted text, in which structure is represented by typographic conventions rather than by elements."
      },
      attributes: [
        {
          name: "cols",
          description: 'Contains the _preferred_ count of characters that a line should have. It was a non-standard synonym of [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre#attr-width). To achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.'
        },
        {
          name: "width",
          description: 'Contains the _preferred_ count of characters that a line should have. Though technically still implemented, this attribute has no visual effect; to achieve such an effect, use CSS [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width "The width CSS property sets an element\'s width. By default it sets the width of the content area, but if box-sizing is set to border-box, it sets the width of the border area.") instead.'
        },
        {
          name: "wrap",
          description: 'Is a _hint_ indicating how the overflow must happen. In modern browser this hint is ignored and no visual effect results in its present; to achieve such an effect, use CSS [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space "The white-space CSS property sets how white space inside an element is handled.") instead.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/pre"
        }
      ]
    },
    {
      name: "blockquote",
      description: {
        kind: "markdown",
        value: "The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a footer or cite element, and optionally with in-line changes such as annotations and abbreviations."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "A URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/blockquote"
        }
      ]
    },
    {
      name: "ol",
      description: {
        kind: "markdown",
        value: "The ol element represents a list of items, where the items have been intentionally ordered, such that changing the order would change the meaning of the document."
      },
      attributes: [
        {
          name: "reversed",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute specifies that the items of the list are specified in reversed order."
          }
        },
        {
          name: "start",
          description: {
            kind: "markdown",
            value: 'This integer attribute specifies the start value for numbering the individual list items. Although the ordering type of list elements might be Roman numerals, such as XXXI, or letters, the value of start is always represented as a number. To start numbering elements from the letter "C", use `<ol start="3">`.\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.'
          }
        },
        {
          name: "type",
          valueSet: "lt",
          description: {
            kind: "markdown",
            value: "Indicates the numbering type:\n\n*   `'a'` indicates lowercase letters,\n*   `'A'` indicates uppercase letters,\n*   `'i'` indicates lowercase Roman numerals,\n*   `'I'` indicates uppercase Roman numerals,\n*   and `'1'` indicates numbers (default).\n\nThe type set is used for the entire list unless a different [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li#attr-type) attribute is used within an enclosed [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li \"The HTML <li> element is used to represent an item in a list. It must be contained in a parent element: an ordered list (<ol>), an unordered list (<ul>), or a menu (<menu>). In menus and unordered lists, list items are usually displayed using bullet points. In ordered lists, they are usually displayed with an ascending counter on the left, such as a number or letter.\") element.\n\n**Note:** This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\nUnless the value of the list number matters (e.g. in legal or technical documents where items are to be referenced by their number/letter), the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type \"The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.\") property should be used instead."
          }
        },
        {
          name: "compact",
          description: 'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Warning:** Do not use this attribute, as it has been deprecated: the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give an effect similar to the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [`line-height`](https://developer.mozilla.org/en-US/docs/Web/CSS/line-height "The line-height CSS property sets the amount of space used for lines, such as in text. On block-level elements, it specifies the minimum height of line boxes within the element. On non-replaced inline elements, it specifies the height that is used to calculate line box height.") can be used with a value of `80%`.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ol"
        }
      ]
    },
    {
      name: "ul",
      description: {
        kind: "markdown",
        value: "The ul element represents a list of items, where the order of the items is not important — that is, where changing the order would not materially change the meaning of the document."
      },
      attributes: [
        {
          name: "compact",
          description: 'This Boolean attribute hints that the list should be rendered in a compact style. The interpretation of this attribute depends on the user agent and it doesn\'t work in all browsers.\n\n**Usage note: **Do not use this attribute, as it has been deprecated: the [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To give a similar effect as the `compact` attribute, the [CSS](https://developer.mozilla.org/en-US/docs/CSS) property [line-height](https://developer.mozilla.org/en-US/docs/CSS/line-height) can be used with a value of `80%`.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ul"
        }
      ]
    },
    {
      name: "li",
      description: {
        kind: "markdown",
        value: "The li element represents a list item. If its parent element is an ol, ul, or menu element, then the element is an item of the parent element's list, as defined for those elements. Otherwise, the list item has no defined list-related relationship to any other li element."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: 'This integer attribute indicates the current ordinal value of the list item as defined by the [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element. The only allowed value for this attribute is a number, even if the list is displayed with Roman numerals or letters. List items that follow this one continue numbering from the value set. The **value** attribute has no meaning for unordered lists ([`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul "The HTML <ul> element represents an unordered list of items, typically rendered as a bulleted list.")) or for menus ([`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.")).\n\n**Note**: This attribute was deprecated in HTML4, but reintroduced in HTML5.\n\n**Note:** Prior to Gecko 9.0, negative values were incorrectly converted to 0. Starting in Gecko 9.0 all integer values are correctly parsed.'
          }
        },
        {
          name: "type",
          description: 'This character attribute indicates the numbering type:\n\n*   `a`: lowercase letters\n*   `A`: uppercase letters\n*   `i`: lowercase Roman numerals\n*   `I`: uppercase Roman numerals\n*   `1`: numbers\n\nThis type overrides the one used by its parent [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol "The HTML <ol> element represents an ordered list of items, typically rendered as a numbered list.") element, if any.\n\n**Usage note:** This attribute has been deprecated: use the CSS [`list-style-type`](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type "The list-style-type CSS property sets the marker (such as a disc, character, or custom counter style) of a list item element.") property instead.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/li"
        }
      ]
    },
    {
      name: "dl",
      description: {
        kind: "markdown",
        value: "The dl element represents an association list consisting of zero or more name-value groups (a description list). A name-value group consists of one or more names (dt elements) followed by one or more values (dd elements), ignoring any nodes other than dt and dd elements. Within a single dl element, there should not be more than one dt element for each name."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dl"
        }
      ]
    },
    {
      name: "dt",
      description: {
        kind: "markdown",
        value: "The dt element represents the term, or name, part of a term-description group in a description list (dl element)."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dt"
        }
      ]
    },
    {
      name: "dd",
      description: {
        kind: "markdown",
        value: "The dd element represents the description, definition, or value, part of a term-description group in a description list (dl element)."
      },
      attributes: [
        {
          name: "nowrap",
          description: "If the value of this attribute is set to `yes`, the definition text will not wrap. The default value is `no`."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dd"
        }
      ]
    },
    {
      name: "figure",
      description: {
        kind: "markdown",
        value: "The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/figure"
        }
      ]
    },
    {
      name: "figcaption",
      description: {
        kind: "markdown",
        value: "The figcaption element represents a caption or legend for the rest of the contents of the figcaption element's parent figure element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/figcaption"
        }
      ]
    },
    {
      name: "main",
      description: {
        kind: "markdown",
        value: "The main element represents the main content of the body of a document or application. The main content area consists of content that is directly related to or expands upon the central topic of a document or central functionality of an application."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/main"
        }
      ]
    },
    {
      name: "div",
      description: {
        kind: "markdown",
        value: "The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/div"
        }
      ]
    },
    {
      name: "a",
      description: {
        kind: "markdown",
        value: "If the a element has an href attribute, then it represents a hyperlink (a hypertext anchor) labeled by its contents."
      },
      attributes: [
        {
          name: "href",
          description: {
            kind: "markdown",
            value: "Contains a URL or a URL fragment that the hyperlink points to."
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: 'Specifies where to display the linked URL. It is a name of, or keyword for, a _browsing context_: a tab, window, or `<iframe>`. The following keywords have special meanings:\n\n*   `_self`: Load the URL into the same browsing context as the current one. This is the default behavior.\n*   `_blank`: Load the URL into a new browsing context. This is usually a tab, but users can configure browsers to use new windows instead.\n*   `_parent`: Load the URL into the parent browsing context of the current one. If there is no parent, this behaves the same way as `_self`.\n*   `_top`: Load the URL into the top-level browsing context (that is, the "highest" browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this behaves the same way as `_self`.\n\n**Note:** When using `target`, consider adding `rel="noreferrer"` to avoid exploitation of the `window.opener` API.\n\n**Note:** Linking to another page using `target="_blank"` will run the new page on the same process as your page. If the new page is executing expensive JS, your page\'s performance may suffer. To avoid this use `rel="noopener"`.'
          }
        },
        {
          name: "download",
          description: {
            kind: "markdown",
            value: "This attribute instructs browsers to download a URL instead of navigating to it, so the user will be prompted to save it as a local file. If the attribute has a value, it is used as the pre-filled file name in the Save prompt (the user can still change the file name if they want). There are no restrictions on allowed values, though `/` and `\\` are converted to underscores. Most file systems limit some punctuation in file names, and browsers will adjust the suggested name accordingly.\n\n**Notes:**\n\n*   This attribute only works for [same-origin URLs](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy).\n*   Although HTTP(s) URLs need to be in the same-origin, [`blob:` URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL) and [`data:` URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are allowed so that content generated by JavaScript, such as pictures created in an image-editor Web app, can be downloaded.\n*   If the HTTP header [`Content-Disposition:`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition) gives a different filename than this attribute, the HTTP header takes priority over this attribute.\n*   If `Content-Disposition:` is set to `inline`, Firefox prioritizes `Content-Disposition`, like the filename case, while Chrome prioritizes the `download` attribute."
          }
        },
        {
          name: "ping",
          description: {
            kind: "markdown",
            value: 'Contains a space-separated list of URLs to which, when the hyperlink is followed, [`POST`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST "The HTTP POST method sends data to the server. The type of the body of the request is indicated by the Content-Type header.") requests with the body `PING` will be sent by the browser (in the background). Typically used for tracking.'
          }
        },
        {
          name: "rel",
          description: {
            kind: "markdown",
            value: "Specifies the relationship of the target object to the link object. The value is a space-separated list of [link types](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types)."
          }
        },
        {
          name: "hreflang",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the human language of the linked resource. It is purely advisory, with no built-in functionality. Allowed values are determined by [BCP47](https://www.ietf.org/rfc/bcp/bcp47.txt "Tags for Identifying Languages").'
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'Specifies the media type in the form of a [MIME type](https://developer.mozilla.org/en-US/docs/Glossary/MIME_type "MIME type: A MIME type (now properly called "media type", but also sometimes "content type") is a string sent along with a file indicating the type of the file (describing the content format, for example, a sound file might be labeled audio/ogg, or an image file image/png).") for the linked URL. It is purely advisory, with no built-in functionality.'
          }
        },
        {
          name: "referrerpolicy",
          description: "Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) to send when fetching the URL:\n\n*   `'no-referrer'` means the `Referer:` header will not be sent.\n*   `'no-referrer-when-downgrade'` means no `Referer:` header will be sent when navigating to an origin without HTTPS. This is the default behavior.\n*   `'origin'` means the referrer will be the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) of the page, not including information after the domain.\n*   `'origin-when-cross-origin'` meaning that navigations to other origins will be limited to the scheme, the host and the port, while navigations on the same origin will include the referrer's path.\n*   `'strict-origin-when-cross-origin'`\n*   `'unsafe-url'` means the referrer will include the origin and path, but not the fragment, password, or username. This is unsafe because it can leak data from secure URLs to insecure ones."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/a"
        }
      ]
    },
    {
      name: "em",
      description: {
        kind: "markdown",
        value: "The em element represents stress emphasis of its contents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/em"
        }
      ]
    },
    {
      name: "strong",
      description: {
        kind: "markdown",
        value: "The strong element represents strong importance, seriousness, or urgency for its contents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/strong"
        }
      ]
    },
    {
      name: "small",
      description: {
        kind: "markdown",
        value: "The small element represents side comments such as small print."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/small"
        }
      ]
    },
    {
      name: "s",
      description: {
        kind: "markdown",
        value: "The s element represents contents that are no longer accurate or no longer relevant."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/s"
        }
      ]
    },
    {
      name: "cite",
      description: {
        kind: "markdown",
        value: "The cite element represents a reference to a creative work. It must include the title of the work or the name of the author(person, people or organization) or an URL reference, or a reference in abbreviated form as per the conventions used for the addition of citation metadata."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/cite"
        }
      ]
    },
    {
      name: "q",
      description: {
        kind: "markdown",
        value: "The q element represents some phrasing content quoted from another source."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "The value of this attribute is a URL that designates a source document or message for the information quoted. This attribute is intended to point to information explaining the context or the reference for the quote."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/q"
        }
      ]
    },
    {
      name: "dfn",
      description: {
        kind: "markdown",
        value: "The dfn element represents the defining instance of a term. The paragraph, description list group, or section that is the nearest ancestor of the dfn element must also contain the definition(s) for the term given by the dfn element."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dfn"
        }
      ]
    },
    {
      name: "abbr",
      description: {
        kind: "markdown",
        value: "The abbr element represents an abbreviation or acronym, optionally with its expansion. The title attribute may be used to provide an expansion of the abbreviation. The attribute, if specified, must contain an expansion of the abbreviation, and nothing else."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/abbr"
        }
      ]
    },
    {
      name: "ruby",
      description: {
        kind: "markdown",
        value: "The ruby element allows one or more spans of phrasing content to be marked with ruby annotations. Ruby annotations are short runs of text presented alongside base text, primarily used in East Asian typography as a guide for pronunciation or to include other annotations. In Japanese, this form of typography is also known as furigana. Ruby text can appear on either side, and sometimes both sides, of the base text, and it is possible to control its position using CSS. A more complete introduction to ruby can be found in the Use Cases & Exploratory Approaches for Ruby Markup document as well as in CSS Ruby Module Level 1. [RUBY-UC] [CSSRUBY]"
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ruby"
        }
      ]
    },
    {
      name: "rb",
      description: {
        kind: "markdown",
        value: "The rb element marks the base text component of a ruby annotation. When it is the child of a ruby element, it doesn't represent anything itself, but its parent ruby element uses it as part of determining what it represents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rb"
        }
      ]
    },
    {
      name: "rt",
      description: {
        kind: "markdown",
        value: "The rt element marks the ruby text component of a ruby annotation. When it is the child of a ruby element or of an rtc element that is itself the child of a ruby element, it doesn't represent anything itself, but its ancestor ruby element uses it as part of determining what it represents."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rt"
        }
      ]
    },
    {
      name: "rp",
      description: {
        kind: "markdown",
        value: "The rp element is used to provide fallback text to be shown by user agents that don't support ruby annotations. One widespread convention is to provide parentheses around the ruby text component of a ruby annotation."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/rp"
        }
      ]
    },
    {
      name: "time",
      description: {
        kind: "markdown",
        value: "The time element represents its contents, along with a machine-readable form of those contents in the datetime attribute. The kind of content is limited to various kinds of dates, times, time-zone offsets, and durations, as described below."
      },
      attributes: [
        {
          name: "datetime",
          description: {
            kind: "markdown",
            value: "This attribute indicates the time and/or date of the element and must be in one of the formats described below."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/time"
        }
      ]
    },
    {
      name: "code",
      description: {
        kind: "markdown",
        value: "The code element represents a fragment of computer code. This could be an XML element name, a file name, a computer program, or any other string that a computer would recognize."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/code"
        }
      ]
    },
    {
      name: "var",
      description: {
        kind: "markdown",
        value: "The var element represents a variable. This could be an actual variable in a mathematical expression or programming context, an identifier representing a constant, a symbol identifying a physical quantity, a function parameter, or just be a term used as a placeholder in prose."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/var"
        }
      ]
    },
    {
      name: "samp",
      description: {
        kind: "markdown",
        value: "The samp element represents sample or quoted output from another program or computing system."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/samp"
        }
      ]
    },
    {
      name: "kbd",
      description: {
        kind: "markdown",
        value: "The kbd element represents user input (typically keyboard input, although it may also be used to represent other input, such as voice commands)."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/kbd"
        }
      ]
    },
    {
      name: "sub",
      description: {
        kind: "markdown",
        value: "The sub element represents a subscript."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/sub"
        }
      ]
    },
    {
      name: "sup",
      description: {
        kind: "markdown",
        value: "The sup element represents a superscript."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/sup"
        }
      ]
    },
    {
      name: "i",
      description: {
        kind: "markdown",
        value: "The i element represents a span of text in an alternate voice or mood, or otherwise offset from the normal prose in a manner indicating a different quality of text, such as a taxonomic designation, a technical term, an idiomatic phrase from another language, transliteration, a thought, or a ship name in Western texts."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/i"
        }
      ]
    },
    {
      name: "b",
      description: {
        kind: "markdown",
        value: "The b element represents a span of text to which attention is being drawn for utilitarian purposes without conveying any extra importance and with no implication of an alternate voice or mood, such as key words in a document abstract, product names in a review, actionable words in interactive text-driven software, or an article lede."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/b"
        }
      ]
    },
    {
      name: "u",
      description: {
        kind: "markdown",
        value: "The u element represents a span of text with an unarticulated, though explicitly rendered, non-textual annotation, such as labeling the text as being a proper name in Chinese text (a Chinese proper name mark), or labeling the text as being misspelt."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/u"
        }
      ]
    },
    {
      name: "mark",
      description: {
        kind: "markdown",
        value: "The mark element represents a run of text in one document marked or highlighted for reference purposes, due to its relevance in another context. When used in a quotation or other block of text referred to from the prose, it indicates a highlight that was not originally present but which has been added to bring the reader's attention to a part of the text that might not have been considered important by the original author when the block was originally written, but which is now under previously unexpected scrutiny. When used in the main prose of a document, it indicates a part of the document that has been highlighted due to its likely relevance to the user's current activity."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/mark"
        }
      ]
    },
    {
      name: "bdi",
      description: {
        kind: "markdown",
        value: "The bdi element represents a span of text that is to be isolated from its surroundings for the purposes of bidirectional text formatting. [BIDI]"
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdi"
        }
      ]
    },
    {
      name: "bdo",
      description: {
        kind: "markdown",
        value: "The bdo element represents explicit text directionality formatting control for its children. It allows authors to override the Unicode bidirectional algorithm by explicitly specifying a direction override. [BIDI]"
      },
      attributes: [
        {
          name: "dir",
          description: "The direction in which text should be rendered in this element's contents. Possible values are:\n\n*   `ltr`: Indicates that the text should go in a left-to-right direction.\n*   `rtl`: Indicates that the text should go in a right-to-left direction."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/bdo"
        }
      ]
    },
    {
      name: "span",
      description: {
        kind: "markdown",
        value: "The span element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/span"
        }
      ]
    },
    {
      name: "br",
      description: {
        kind: "markdown",
        value: "The br element represents a line break."
      },
      attributes: [
        {
          name: "clear",
          description: "Indicates where to begin the next line after the break."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/br"
        }
      ]
    },
    {
      name: "wbr",
      description: {
        kind: "markdown",
        value: "The wbr element represents a line break opportunity."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/wbr"
        }
      ]
    },
    {
      name: "ins",
      description: {
        kind: "markdown",
        value: "The ins element represents an addition to the document."
      },
      attributes: [
        {
          name: "cite",
          description: "This attribute defines the URI of a resource that explains the change, such as a link to meeting minutes or a ticket in a troubleshooting system."
        },
        {
          name: "datetime",
          description: 'This attribute indicates the time and date of the change and must be a valid date with an optional time string. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/ins"
        }
      ]
    },
    {
      name: "del",
      description: {
        kind: "markdown",
        value: "The del element represents a removal from the document."
      },
      attributes: [
        {
          name: "cite",
          description: {
            kind: "markdown",
            value: "A URI for a resource that explains the change (for example, meeting minutes)."
          }
        },
        {
          name: "datetime",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the time and date of the change and must be a valid date string with an optional time. If the value cannot be parsed as a date with an optional time string, the element does not have an associated time stamp. For the format of the string without a time, see [Format of a valid date string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_date_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article."). The format of the string if it includes both date and time is covered in [Format of a valid local date and time string](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats#Format_of_a_valid_local_date_and_time_string "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.") in [Date and time formats used in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Date_and_time_formats "Certain HTML elements use date and/or time values. The formats of the strings that specify these are described in this article.").'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/del"
        }
      ]
    },
    {
      name: "picture",
      description: {
        kind: "markdown",
        value: "The picture element is a container which provides multiple sources to its contained img element to allow authors to declaratively control or give hints to the user agent about which image resource to use, based on the screen pixel density, viewport size, image format, and other factors. It represents its children."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/picture"
        }
      ]
    },
    {
      name: "img",
      description: {
        kind: "markdown",
        value: "An img element represents an image."
      },
      attributes: [
        {
          name: "alt",
          description: {
            kind: "markdown",
            value: 'This attribute defines an alternative text description of the image.\n\n**Note:** Browsers do not always display the image referenced by the element. This is the case for non-graphical browsers (including those used by people with visual impairments), if the user chooses not to display images, or if the browser cannot display the image because it is invalid or an [unsupported type](#Supported_image_formats). In these cases, the browser may replace the image with the text defined in this element\'s `alt` attribute. You should, for these reasons and others, provide a useful value for `alt` whenever possible.\n\n**Note:** Omitting this attribute altogether indicates that the image is a key part of the content, and no textual equivalent is available. Setting this attribute to an empty string (`alt=""`) indicates that this image is _not_ a key part of the content (decorative), and that non-visual browsers may omit it from rendering.'
          }
        },
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "The image URL. This attribute is mandatory for the `<img>` element. On browsers supporting `srcset`, `src` is treated like a candidate image with a pixel density descriptor `1x` unless an image with this pixel density descriptor is already defined in `srcset,` or unless `srcset` contains '`w`' descriptors."
          }
        },
        {
          name: "srcset",
          description: {
            kind: "markdown",
            value: "A list of one or more strings separated by commas indicating a set of possible image sources for the user agent to use. Each string is composed of:\n\n1.  a URL to an image,\n2.  optionally, whitespace followed by one of:\n    *   A width descriptor, or a positive integer directly followed by '`w`'. The width descriptor is divided by the source size given in the `sizes` attribute to calculate the effective pixel density.\n    *   A pixel density descriptor, which is a positive floating point number directly followed by '`x`'.\n\nIf no descriptor is specified, the source is assigned the default descriptor: `1x`.\n\nIt is incorrect to mix width descriptors and pixel density descriptors in the same `srcset` attribute. Duplicate descriptors (for instance, two sources in the same `srcset` which are both described with '`2x`') are also invalid.\n\nThe user agent selects any one of the available sources at its discretion. This provides them with significant leeway to tailor their selection based on things like user preferences or bandwidth conditions. See our [Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) tutorial for an example."
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates if the fetching of the related image must be done using CORS or not. [CORS-enabled images](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being "[tainted](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image#What_is_a_tainted_canvas)." The allowed values are:'
          }
        },
        {
          name: "usemap",
          description: {
            kind: "markdown",
            value: 'The partial URL (starting with \'#\') of an [image map](https://developer.mozilla.org/en-US/docs/HTML/Element/map) associated with the element.\n\n**Note:** You cannot use this attribute if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") element.'
          }
        },
        {
          name: "ismap",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the image is part of a server-side map. If so, the precise coordinates of a click are sent to the server.\n\n**Note:** This attribute is allowed only if the `<img>` element is a descendant of an [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL.") element with a valid [`href`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-href) attribute.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The intrinsic width of the image in pixels."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The intrinsic height of the image in pixels."
          }
        },
        {
          name: "decoding",
          description: "Provides an image decoding hint to the browser. The allowed values are:"
        },
        {
          name: "decoding",
          description: `\`sync\`

Decode the image synchronously for atomic presentation with other content.

\`async\`

Decode the image asynchronously to reduce delay in presenting other content.

\`auto\`

Default mode, which indicates no preference for the decoding mode. The browser decides what is best for the user.`
        },
        {
          name: "importance",
          description: "Indicates the relative importance of the resource. Priority hints are delegated using the values:"
        },
        {
          name: "importance",
          description: "`auto`: Indicates **no preference**. The browser may use its own heuristics to decide the priority of the image.\n\n`high`: Indicates to the browser that the image is of **high** priority.\n\n`low`: Indicates to the browser that the image is of **low** priority."
        },
        {
          name: "intrinsicsize",
          description: "This attribute tells the browser to ignore the actual intrinsic size of the image and pretend it’s the size specified in the attribute. Specifically, the image would raster at these dimensions and `naturalWidth`/`naturalHeight` on images would return the values specified in this attribute. [Explainer](https://github.com/ojanvafai/intrinsicsize-attribute), [examples](https://googlechrome.github.io/samples/intrinsic-size/index.html)"
        },
        {
          name: "referrerpolicy",
          description: "A string indicating which referrer to use when fetching the resource:\n\n*   `no-referrer:` The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer \"The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.\") header will not be sent.\n*   `no-referrer-when-downgrade:` No `Referer` header will be sent when navigating to an origin without TLS (HTTPS). This is a user agent’s default behavior if no policy is otherwise specified.\n*   `origin:` The `Referer` header will include the page of origin's scheme, the host, and the port.\n*   `origin-when-cross-origin:` Navigating to other origins will limit the included referral data to the scheme, the host and the port, while navigating from the same origin will include the referrer's full path.\n*   `unsafe-url:` The `Referer` header will include the origin and the path, but not the fragment, password, or username. This case is unsafe because it can leak origins and paths from TLS-protected resources to insecure origins."
        },
        {
          name: "sizes",
          description: "A list of one or more strings separated by commas indicating a set of source sizes. Each source size consists of:\n\n1.  a media condition. This must be omitted for the last item.\n2.  a source size value.\n\nSource size values specify the intended display size of the image. User agents use the current source size to select one of the sources supplied by the `srcset` attribute, when those sources are described using width ('`w`') descriptors. The selected source size affects the intrinsic size of the image (the image’s display size if no CSS styling is applied). If the `srcset` attribute is absent, or contains no values with a width (`w`) descriptor, then the `sizes` attribute has no effect."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/img"
        }
      ]
    },
    {
      name: "iframe",
      description: {
        kind: "markdown",
        value: "The iframe element represents a nested browsing context."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'The URL of the page to embed. Use a value of `about:blank` to embed an empty page that conforms to the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy#Inherited_origins). Also note that programatically removing an `<iframe>`\'s src attribute (e.g. via [`Element.removeAttribute()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute "The Element method removeAttribute() removes the attribute with the specified name from the element.")) causes `about:blank` to be loaded in the frame in Firefox (from version 65), Chromium-based browsers, and Safari/iOS.'
          }
        },
        {
          name: "srcdoc",
          description: {
            kind: "markdown",
            value: "Inline HTML to embed, overriding the `src` attribute. If a browser does not support the `srcdoc` attribute, it will fall back to the URL in the `src` attribute."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'A targetable name for the embedded browsing context. This can be used in the `target` attribute of the [`<a>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a "The HTML <a> element (or anchor element) creates a hyperlink to other web pages, files, locations within the same page, email addresses, or any other URL."), [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server."), or [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base "The HTML <base> element specifies the base URL to use for all relative URLs contained within a document. There can be only one <base> element in a document.") elements; the `formtarget` attribute of the [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") or [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") elements; or the `windowName` parameter in the [`window.open()`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open "The Window interface\'s open() method loads the specified resource into the browsing context (window, <iframe> or tab) with the specified name. If the name doesn\'t exist, then a new window is opened and the specified resource is loaded into its browsing context.") method.'
          }
        },
        {
          name: "sandbox",
          valueSet: "sb",
          description: {
            kind: "markdown",
            value: 'Applies extra restrictions to the content in the frame. The value of the attribute can either be empty to apply all restrictions, or space-separated tokens to lift particular restrictions:\n\n*   `allow-forms`: Allows the resource to submit forms. If this keyword is not used, form submission is blocked.\n*   `allow-modals`: Lets the resource [open modal windows](https://html.spec.whatwg.org/multipage/origin.html#sandboxed-modals-flag).\n*   `allow-orientation-lock`: Lets the resource [lock the screen orientation](https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation).\n*   `allow-pointer-lock`: Lets the resource use the [Pointer Lock API](https://developer.mozilla.org/en-US/docs/WebAPI/Pointer_Lock).\n*   `allow-popups`: Allows popups (such as `window.open()`, `target="_blank"`, or `showModalDialog()`). If this keyword is not used, the popup will silently fail to open.\n*   `allow-popups-to-escape-sandbox`: Lets the sandboxed document open new windows without those windows inheriting the sandboxing. For example, this can safely sandbox an advertisement without forcing the same restrictions upon the page the ad links to.\n*   `allow-presentation`: Lets the resource start a [presentation session](https://developer.mozilla.org/en-US/docs/Web/API/PresentationRequest).\n*   `allow-same-origin`: If this token is not used, the resource is treated as being from a special origin that always fails the [same-origin policy](https://developer.mozilla.org/en-US/docs/Glossary/same-origin_policy "same-origin policy: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin.").\n*   `allow-scripts`: Lets the resource run scripts (but not create popup windows).\n*   `allow-storage-access-by-user-activation` : Lets the resource request access to the parent\'s storage capabilities with the [Storage Access API](https://developer.mozilla.org/en-US/docs/Web/API/Storage_Access_API).\n*   `allow-top-navigation`: Lets the resource navigate the top-level browsing context (the one named `_top`).\n*   `allow-top-navigation-by-user-activation`: Lets the resource navigate the top-level browsing context, but only if initiated by a user gesture.\n\n**Notes about sandboxing:**\n\n*   When the embedded document has the same origin as the embedding page, it is **strongly discouraged** to use both `allow-scripts` and `allow-same-origin`, as that lets the embedded document remove the `sandbox` attribute — making it no more secure than not using the `sandbox` attribute at all.\n*   Sandboxing is useless if the attacker can display content outside a sandboxed `iframe` — such as if the viewer opens the frame in a new tab. Such content should be also served from a _separate origin_ to limit potential damage.\n*   The `sandbox` attribute is unsupported in Internet Explorer 9 and earlier.'
          }
        },
        {
          name: "seamless",
          valueSet: "v"
        },
        {
          name: "allowfullscreen",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'Set to `true` if the `<iframe>` can activate fullscreen mode by calling the [`requestFullscreen()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullscreen "The Element.requestFullscreen() method issues an asynchronous request to make the element be displayed in full-screen mode.") method.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the frame in CSS pixels. Default is `300`."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the frame in CSS pixels. Default is `150`."
          }
        },
        {
          name: "allow",
          description: "Specifies a [feature policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Feature_Policy) for the `<iframe>`."
        },
        {
          name: "allowpaymentrequest",
          description: "Set to `true` if a cross-origin `<iframe>` should be allowed to invoke the [Payment Request API](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)."
        },
        {
          name: "allowpaymentrequest",
          description: 'This attribute is considered a legacy attribute and redefined as `allow="payment"`.'
        },
        {
          name: "csp",
          description: 'A [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) enforced for the embedded resource. See [`HTMLIFrameElement.csp`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/csp "The csp property of the HTMLIFrameElement interface specifies the Content Security Policy that an embedded document must agree to enforce upon itself.") for details.'
        },
        {
          name: "importance",
          description: `The download priority of the resource in the \`<iframe>\`'s \`src\` attribute. Allowed values:

\`auto\` (default)

No preference. The browser uses its own heuristics to decide the priority of the resource.

\`high\`

The resource should be downloaded before other lower-priority page resources.

\`low\`

The resource should be downloaded after other higher-priority page resources.`
        },
        {
          name: "referrerpolicy",
          description: 'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the frame\'s resource:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (HTTPS→HTTPS), but don\'t send it to a less secure destination (HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, only send the origin when the protocol security level stays the same (HTTPS→HTTPS), and send no header to a less secure destination (HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/iframe"
        }
      ]
    },
    {
      name: "embed",
      description: {
        kind: "markdown",
        value: "The embed element provides an integration point for an external (typically non-HTML) application or interactive content."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "The URL of the resource being embedded."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The MIME type to use to select the plug-in to instantiate."
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The displayed width of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The displayed height of the resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). This must be an absolute value; percentages are _not_ allowed."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/embed"
        }
      ]
    },
    {
      name: "object",
      description: {
        kind: "markdown",
        value: "The object element can represent an external resource, which, depending on the type of the resource, will either be treated as an image, as a nested browsing context, or as an external resource to be processed by a plugin."
      },
      attributes: [
        {
          name: "data",
          description: {
            kind: "markdown",
            value: "The address of the resource as a valid URL. At least one of **data** and **type** must be defined."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource specified by **data**. At least one of **data** and **type** must be defined."
          }
        },
        {
          name: "typemustmatch",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates if the **type** attribute and the actual [content type](https://developer.mozilla.org/en-US/docs/Glossary/Content_type) of the resource must match to be used."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of valid browsing context (HTML5), or the name of the control (HTML 4)."
          }
        },
        {
          name: "usemap",
          description: {
            kind: "markdown",
            value: "A hash-name reference to a [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map \"The HTML <map> element is used with <area> elements to define an image map (a clickable link area).\") element; that is a '#' followed by the value of a [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map#attr-name) of a map element."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element, if any, that the object element is associated with (its _form owner_). The value of the attribute must be an ID of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document.'
          }
        },
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the display resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the displayed resource, in [CSS pixels](https://drafts.csswg.org/css-values/#px). -- (Absolute values only. [NO percentages](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes))"
          }
        },
        {
          name: "archive",
          description: "A space-separated list of URIs for archives of resources for the object."
        },
        {
          name: "border",
          description: "The width of a border around the control, in pixels."
        },
        {
          name: "classid",
          description: "The URI of the object's implementation. It can be used together with, or in place of, the **data** attribute."
        },
        {
          name: "codebase",
          description: "The base path used to resolve relative URIs specified by **classid**, **data**, or **archive**. If not specified, the default is the base URI of the current document."
        },
        {
          name: "codetype",
          description: "The content type of the data specified by **classid**."
        },
        {
          name: "declare",
          description: "The presence of this Boolean attribute makes this element a declaration only. The object must be instantiated by a subsequent `<object>` element. In HTML5, repeat the <object> element completely each that that the resource is reused."
        },
        {
          name: "standby",
          description: "A message that the browser can show while loading the object's implementation and data."
        },
        {
          name: "tabindex",
          description: "The position of the element in the tabbing navigation order for the current document."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/object"
        }
      ]
    },
    {
      name: "param",
      description: {
        kind: "markdown",
        value: "The param element defines parameters for plugins invoked by object elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "Name of the parameter."
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "Specifies the value of the parameter."
          }
        },
        {
          name: "type",
          description: 'Only used if the `valuetype` is set to "ref". Specifies the MIME type of values found at the URI specified by value.'
        },
        {
          name: "valuetype",
          description: `Specifies the type of the \`value\` attribute. Possible values are:

*   data: Default value. The value is passed to the object's implementation as a string.
*   ref: The value is a URI to a resource where run-time values are stored.
*   object: An ID of another [\`<object>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object "The HTML <object> element represents an external resource, which can be treated as an image, a nested browsing context, or a resource to be handled by a plugin.") in the same document.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/param"
        }
      ]
    },
    {
      name: "video",
      description: {
        kind: "markdown",
        value: "A video element is used for playing videos or movies, and audio files with captions."
      },
      attributes: [
        {
          name: "src"
        },
        {
          name: "crossorigin",
          valueSet: "xo"
        },
        {
          name: "poster"
        },
        {
          name: "preload",
          valueSet: "pl"
        },
        {
          name: "autoplay",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data."
          }
        },
        {
          name: "mediagroup"
        },
        {
          name: "loop",
          valueSet: "v"
        },
        {
          name: "muted",
          valueSet: "v"
        },
        {
          name: "controls",
          valueSet: "v"
        },
        {
          name: "width"
        },
        {
          name: "height"
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/video"
        }
      ]
    },
    {
      name: "audio",
      description: {
        kind: "markdown",
        value: "An audio element represents a sound or audio stream."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'The URL of the audio to embed. This is subject to [HTTP access controls](https://developer.mozilla.org/en-US/docs/HTTP_access_control). This is optional; you may instead use the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element within the audio block to specify the audio to embed.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'This enumerated attribute indicates whether to use CORS to fetch the related image. [CORS-enabled resources](https://developer.mozilla.org/en-US/docs/CORS_Enabled_Image) can be reused in the [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") element without being _tainted_. The allowed values are:\n\nanonymous\n\nSends a cross-origin request without a credential. In other words, it sends the `Origin:` HTTP header without a cookie, X.509 certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (by not setting the `Access-Control-Allow-Origin:` HTTP header), the image will be _tainted_, and its usage restricted.\n\nuse-credentials\n\nSends a cross-origin request with a credential. In other words, it sends the `Origin:` HTTP header with a cookie, a certificate, or performing HTTP Basic authentication. If the server does not give credentials to the origin site (through `Access-Control-Allow-Credentials:` HTTP header), the image will be _tainted_ and its usage restricted.\n\nWhen not present, the resource is fetched without a CORS request (i.e. without sending the `Origin:` HTTP header), preventing its non-tainted used in [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas "Use the HTML <canvas> element with either the canvas scripting API or the WebGL API to draw graphics and animations.") elements. If invalid, it is handled as if the enumerated keyword **anonymous** was used. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/HTML/CORS_settings_attributes) for additional information.'
          }
        },
        {
          name: "preload",
          valueSet: "pl",
          description: {
            kind: "markdown",
            value: "This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:\n\n*   `none`: Indicates that the audio should not be preloaded.\n*   `metadata`: Indicates that only audio metadata (e.g. length) is fetched.\n*   `auto`: Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.\n*   _empty string_: A synonym of the `auto` value.\n\nIf not set, `preload`'s default value is browser-defined (i.e. each browser may have its own default value). The spec advises it to be set to `metadata`.\n\n**Usage notes:**\n\n*   The `autoplay` attribute has precedence over `preload`. If `autoplay` is specified, the browser would obviously need to start downloading the audio for playback.\n*   The browser is not forced by the specification to follow the value of this attribute; it is a mere hint."
          }
        },
        {
          name: "autoplay",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: `A Boolean attribute: if specified, the audio will automatically begin playback as soon as it can do so, without waiting for the entire audio file to finish downloading.

**Note**: Sites that automatically play audio (or videos with an audio track) can be an unpleasant experience for users, so should be avoided when possible. If you must offer autoplay functionality, you should make it opt-in (requiring a user to specifically enable it). However, this can be useful when creating media elements whose source will be set at a later time, under user control.`
          }
        },
        {
          name: "mediagroup"
        },
        {
          name: "loop",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute: if specified, the audio player will automatically seek back to the start upon reaching the end of the audio."
          }
        },
        {
          name: "muted",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute that indicates whether the audio will be initially silenced. Its default value is `false`."
          }
        },
        {
          name: "controls",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this attribute is present, the browser will offer controls to allow the user to control audio playback, including volume, seeking, and pause/resume playback."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/audio"
        }
      ]
    },
    {
      name: "source",
      description: {
        kind: "markdown",
        value: "The source element allows authors to specify multiple alternative media resources for media elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'Required for [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") and [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document."), address of the media resource. The value of this attribute is ignored when the `<source>` element is placed inside a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: "The MIME-type of the resource, optionally with a `codecs` parameter. See [RFC 4281](https://tools.ietf.org/html/rfc4281) for information about how to specify codecs."
          }
        },
        {
          name: "sizes",
          description: 'Is a list of source sizes that describes the final rendered width of the image represented by the source. Each source size consists of a comma-separated list of media condition-length pairs. This information is used by the browser to determine, before laying the page out, which image defined in [`srcset`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source#attr-srcset) to use.  \nThe `sizes` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source "The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
        },
        {
          name: "srcset",
          description: "A list of one or more strings separated by commas indicating a set of possible images represented by the source for the browser to use. Each string is composed of:\n\n1.  one URL to an image,\n2.  a width descriptor, that is a positive integer directly followed by `'w'`. The default value, if missing, is the infinity.\n3.  a pixel density descriptor, that is a positive floating number directly followed by `'x'`. The default value, if missing, is `1x`.\n\nEach string in the list must have at least a width descriptor or a pixel density descriptor to be valid. Among the list, there must be only one string containing the same tuple of width descriptor and pixel density descriptor.  \nThe browser chooses the most adequate image to display at a given point of time.  \nThe `srcset` attribute has an effect only when the [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source \"The HTML <source> element specifies multiple media resources for the <picture>, the <audio> element, or the <video> element.\") element is the direct child of a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture \"The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.\") element."
        },
        {
          name: "media",
          description: '[Media query](https://developer.mozilla.org/en-US/docs/CSS/Media_queries) of the resource\'s intended media; this should be used only in a [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture "The HTML <picture> element contains zero or more <source> elements and one <img> element to provide versions of an image for different display/device scenarios.") element.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/source"
        }
      ]
    },
    {
      name: "track",
      description: {
        kind: "markdown",
        value: "The track element allows authors to specify explicit external timed text tracks for media elements. It does not represent anything on its own."
      },
      attributes: [
        {
          name: "default",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This attribute indicates that the track should be enabled unless the user's preferences indicate that another track is more appropriate. This may only be used on one `track` element per media element."
          }
        },
        {
          name: "kind",
          valueSet: "tk",
          description: {
            kind: "markdown",
            value: "How the text track is meant to be used. If omitted the default kind is `subtitles`. If the attribute is not present, it will use the `subtitles`. If the attribute contains an invalid value, it will use `metadata`. (Versions of Chrome earlier than 52 treated an invalid value as `subtitles`.) The following keywords are allowed:\n\n*   `subtitles`\n    *   Subtitles provide translation of content that cannot be understood by the viewer. For example dialogue or text that is not English in an English language film.\n    *   Subtitles may contain additional content, usually extra background information. For example the text at the beginning of the Star Wars films, or the date, time, and location of a scene.\n*   `captions`\n    *   Closed captions provide a transcription and possibly a translation of audio.\n    *   It may include important non-verbal information such as music cues or sound effects. It may indicate the cue's source (e.g. music, text, character).\n    *   Suitable for users who are deaf or when the sound is muted.\n*   `descriptions`\n    *   Textual description of the video content.\n    *   Suitable for users who are blind or where the video cannot be seen.\n*   `chapters`\n    *   Chapter titles are intended to be used when the user is navigating the media resource.\n*   `metadata`\n    *   Tracks used by scripts. Not visible to the user."
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "A user-readable title of the text track which is used by the browser when listing available text tracks."
          }
        },
        {
          name: "src",
          description: {
            kind: "markdown",
            value: 'Address of the track (`.vtt` file). Must be a valid URL. This attribute must be specified and its URL value must have the same origin as the document — unless the [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio "The HTML <audio> element is used to embed sound content in documents. It may contain one or more audio sources, represented using the src attribute or the <source> element: the browser will choose the most suitable one. It can also be the destination for streamed media, using a MediaStream.") or [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video "The HTML Video element (<video>) embeds a media player which supports video playback into the document.") parent element of the `track` element has a [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) attribute.'
          }
        },
        {
          name: "srclang",
          description: {
            kind: "markdown",
            value: "Language of the track text data. It must be a valid [BCP 47](https://r12a.github.io/app-subtags/) language tag. If the `kind` attribute is set to `subtitles,` then `srclang` must be defined."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/track"
        }
      ]
    },
    {
      name: "map",
      description: {
        kind: "markdown",
        value: "The map element, in conjunction with an img element and any area element descendants, defines an image map. The element represents its children."
      },
      attributes: [
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name attribute gives the map a name so that it can be referenced. The attribute must be present and must have a non-empty value with no space characters. The value of the name attribute must not be a compatibility-caseless match for the value of the name attribute of another map element in the same document. If the id attribute is also specified, both attributes must have the same value."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/map"
        }
      ]
    },
    {
      name: "area",
      description: {
        kind: "markdown",
        value: "The area element represents either a hyperlink with some text and a corresponding area on an image map, or a dead area on an image map."
      },
      attributes: [
        {
          name: "alt"
        },
        {
          name: "coords"
        },
        {
          name: "shape",
          valueSet: "sh"
        },
        {
          name: "href"
        },
        {
          name: "target"
        },
        {
          name: "download"
        },
        {
          name: "ping"
        },
        {
          name: "rel"
        },
        {
          name: "hreflang"
        },
        {
          name: "type"
        },
        {
          name: "accesskey",
          description: "Specifies a keyboard navigation accelerator for the element. Pressing ALT or a similar key in association with the specified character selects the form control correlated with that key sequence. Page designers are forewarned to avoid key sequences already bound to browsers. This attribute is global since HTML5."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/area"
        }
      ]
    },
    {
      name: "table",
      description: {
        kind: "markdown",
        value: "The table element represents data with more than one dimension, in the form of a table."
      },
      attributes: [
        {
          name: "border"
        },
        {
          name: "align",
          description: 'This enumerated attribute indicates how the table must be aligned inside the containing document. It may have the following values:\n\n*   left: the table is displayed on the left side of the document;\n*   center: the table is displayed in the center of the document;\n*   right: the table is displayed on the right side of the document.\n\n**Usage Note**\n\n*   **Do not use this attribute**, as it has been deprecated. The [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table "The HTML <table> element represents tabular data — that is, information presented in a two-dimensional table comprised of rows and columns of cells containing data.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). Set [`margin-left`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left "The margin-left CSS property sets the margin area on the left side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") and [`margin-right`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right "The margin-right CSS property sets the margin area on the right side of an element. A positive value places it farther from its neighbors, while a negative value places it closer.") to `auto` or [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin "The margin CSS property sets the margin area on all four sides of an element. It is a shorthand for margin-top, margin-right, margin-bottom, and margin-left.") to `0 auto` to achieve an effect that is similar to the align attribute.\n*   Prior to Firefox 4, Firefox also supported the `middle`, `absmiddle`, and `abscenter` values as synonyms of `center`, in quirks mode only.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/table"
        }
      ]
    },
    {
      name: "caption",
      description: {
        kind: "markdown",
        value: "The caption element represents the title of the table that is its parent, if it has a parent and that is a table element."
      },
      attributes: [
        {
          name: "align",
          description: `This enumerated attribute indicates how the caption must be aligned with respect to the table. It may have one of the following values:

\`left\`

The caption is displayed to the left of the table.

\`top\`

The caption is displayed above the table.

\`right\`

The caption is displayed to the right of the table.

\`bottom\`

The caption is displayed below the table.

**Usage note:** Do not use this attribute, as it has been deprecated. The [\`<caption>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption "The HTML Table Caption element (<caption>) specifies the caption (or title) of a table, and if used is always the first child of a <table>.") element should be styled using the [CSS](https://developer.mozilla.org/en-US/docs/CSS) properties [\`caption-side\`](https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side "The caption-side CSS property puts the content of a table's <caption> on the specified side. The values are relative to the writing-mode of the table.") and [\`text-align\`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.").`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/caption"
        }
      ]
    },
    {
      name: "colgroup",
      description: {
        kind: "markdown",
        value: "The colgroup element represents a group of one or more columns in the table that is its parent, if it has a parent and that is a table element."
      },
      attributes: [
        {
          name: "span"
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed. The descendant [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") elements may override this value using their own [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-align) attribute.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use one `td:nth-child(an+b)` CSS selector per column, where a is the total number of the columns in the table and b is the ordinal position of this column in the table. Only after this selector the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property can be used.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/colgroup"
        }
      ]
    },
    {
      name: "col",
      description: {
        kind: "markdown",
        value: "If a col element has a parent and that is a colgroup element that itself has a parent that is a table element, then the col element represents one or more columns in the column group represented by that colgroup."
      },
      attributes: [
        {
          name: "span"
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each column cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, its value is inherited from the [`align`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup#attr-align) of the [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup "The HTML <colgroup> element defines a group of columns within a table.") element this `<col>` element belongs too. If there are none, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values:\n    *   Do not try to set the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on a selector giving a [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element. Because [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") elements are not descendant of the [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col "The HTML <col> element defines a column within a table and is used for defining common semantics on all common cells. It is generally found within a <colgroup> element.") element, they won\'t inherit it.\n    *   If the table doesn\'t use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, use the `td:nth-child(an+b)` CSS selector. Set `a` to zero and `b` to the position of the column in the table, e.g. `td:nth-child(2) { text-align: right; }` to right-align the second column.\n    *   If the table does use a [`colspan`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-colspan) attribute, the effect can be achieved by combining adequate CSS attribute selectors like `[colspan=n]`, though this is not trivial.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/col"
        }
      ]
    },
    {
      name: "tbody",
      description: {
        kind: "markdown",
        value: "The tbody element represents a block of rows that consist of a body of data for the parent table element, if the tbody element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes.\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tbody"
        }
      ]
    },
    {
      name: "thead",
      description: {
        kind: "markdown",
        value: "The thead element represents the block of rows that consist of the column labels (headers) for the parent table element, if the thead element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/thead"
        }
      ]
    },
    {
      name: "tfoot",
      description: {
        kind: "markdown",
        value: "The tfoot element represents the block of rows that consist of the column summaries (footers) for the parent table element, if the tfoot element has a parent and it is a table."
      },
      attributes: [
        {
          name: "align",
          description: 'This enumerated attribute specifies how horizontal alignment of each cell content will be handled. Possible values are:\n\n*   `left`, aligning the content to the left of the cell\n*   `center`, centering the content in the cell\n*   `right`, aligning the content to the right of the cell\n*   `justify`, inserting spaces into the textual content so that the content is justified in the cell\n*   `char`, aligning the textual content on a special character with a minimal offset, defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nIf this attribute is not set, the `left` value is assumed.\n\n**Note:** Do not use this attribute as it is obsolete (not supported) in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property on it.\n*   To achieve the same effect as the `char` value, in CSS3, you can use the value of the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot#attr-char) as the value of the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property Unimplemented.'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tfoot"
        }
      ]
    },
    {
      name: "tr",
      description: {
        kind: "markdown",
        value: "The tr element represents a row of cells in a table."
      },
      attributes: [
        {
          name: "align",
          description: 'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") which specifies how the cell\'s context should be aligned horizontally within the cells in the row; this is shorthand for using `align` on every cell in the row individually. Possible values are:\n\n`left`\n\nAlign the content of each cell at its left edge.\n\n`center`\n\nCenter the contents of each cell between their left and right edges.\n\n`right`\n\nAlign the content of each cell at its right edge.\n\n`justify`\n\nWiden whitespaces within the text of each cell so that the text fills the full width of each cell (full justification).\n\n`char`\n\nAlign each cell in the row on a specific character (such that each row in the column that is configured this way will horizontally align its cells on that character). This uses the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attr-charoff) to establish the alignment character (typically "." or "," when aligning numerical data) and the number of characters that should follow the alignment character. This alignment type was never widely supported.\n\nIf no value is expressly set for `align`, the parent node\'s value is inherited.\n\nInstead of using the obsolete `align` attribute, you should instead use the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to establish `left`, `center`, `right`, or `justify` alignment for the row\'s cells. To apply character-based alignment, set the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the alignment character (such as `"."` or `","`).'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/tr"
        }
      ]
    },
    {
      name: "td",
      description: {
        kind: "markdown",
        value: "The td element represents a data cell in a table."
      },
      attributes: [
        {
          name: "colspan"
        },
        {
          name: "rowspan"
        },
        {
          name: "headers"
        },
        {
          name: "abbr",
          description: `This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself.

**Note:** Do not use this attribute as it is obsolete in the latest standard. Alternatively, you can put the abbreviated description inside the cell and place the long content in the **title** attribute.`
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-charoff) attributes Unimplemented (see [bug 2212](https://bugzilla.mozilla.org/show_bug.cgi?id=2212 "character alignment not implemented (align=char, charoff=, text-align:<string>)")).\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attr-char). Unimplemented in CSS3.'
        },
        {
          name: "axis",
          description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard."
        },
        {
          name: "bgcolor",
          description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<td>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td "The HTML <td> element defines a cell of a table that contains data. It participates in the table model.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/CSS) instead.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/td"
        }
      ]
    },
    {
      name: "th",
      description: {
        kind: "markdown",
        value: "The th element represents a header cell in a table."
      },
      attributes: [
        {
          name: "colspan"
        },
        {
          name: "rowspan"
        },
        {
          name: "headers"
        },
        {
          name: "scope",
          valueSet: "s"
        },
        {
          name: "sorted"
        },
        {
          name: "abbr",
          description: {
            kind: "markdown",
            value: "This attribute contains a short abbreviated description of the cell's content. Some user-agents, such as speech readers, may present this description before the content itself."
          }
        },
        {
          name: "align",
          description: 'This enumerated attribute specifies how the cell content\'s horizontal alignment will be handled. Possible values are:\n\n*   `left`: The content is aligned to the left of the cell.\n*   `center`: The content is centered in the cell.\n*   `right`: The content is aligned to the right of the cell.\n*   `justify` (with text only): The content is stretched out inside the cell so that it covers its entire width.\n*   `char` (with text only): The content is aligned to a character inside the `<th>` element with minimal offset. This character is defined by the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char) and [`charoff`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-charoff) attributes.\n\nThe default value when this attribute is not specified is `left`.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard.\n\n*   To achieve the same effect as the `left`, `center`, `right` or `justify` values, apply the CSS [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property to the element.\n*   To achieve the same effect as the `char` value, give the [`text-align`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align "The text-align CSS property sets the horizontal alignment of an inline or table-cell box. This means it works like vertical-align but in the horizontal direction.") property the same value you would use for the [`char`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-char). Unimplemented in CSS3.'
        },
        {
          name: "axis",
          description: "This attribute contains a list of space-separated strings. Each string is the `id` of a group of cells that this header applies to.\n\n**Note:** Do not use this attribute as it is obsolete in the latest standard: use the [`scope`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-scope) attribute instead."
        },
        {
          name: "bgcolor",
          description: `This attribute defines the background color of each cell in a column. It consists of a 6-digit hexadecimal code as defined in [sRGB](https://www.w3.org/Graphics/Color/sRGB) and is prefixed by '#'. This attribute may be used with one of sixteen predefined color strings:

 

\`black\` = "#000000"

 

\`green\` = "#008000"

 

\`silver\` = "#C0C0C0"

 

\`lime\` = "#00FF00"

 

\`gray\` = "#808080"

 

\`olive\` = "#808000"

 

\`white\` = "#FFFFFF"

 

\`yellow\` = "#FFFF00"

 

\`maroon\` = "#800000"

 

\`navy\` = "#000080"

 

\`red\` = "#FF0000"

 

\`blue\` = "#0000FF"

 

\`purple\` = "#800080"

 

\`teal\` = "#008080"

 

\`fuchsia\` = "#FF00FF"

 

\`aqua\` = "#00FFFF"

**Note:** Do not use this attribute, as it is non-standard and only implemented in some versions of Microsoft Internet Explorer: The [\`<th>\`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th "The HTML <th> element defines a cell as header of a group of table cells. The exact nature of this group is defined by the scope and headers attributes.") element should be styled using [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS). To create a similar effect use the [\`background-color\`](https://developer.mozilla.org/en-US/docs/Web/CSS/background-color "The background-color CSS property sets the background color of an element.") property in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) instead.`
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/th"
        }
      ]
    },
    {
      name: "form",
      description: {
        kind: "markdown",
        value: "The form element represents a collection of form-associated elements, some of which can represent editable values that can be submitted to a server for processing."
      },
      attributes: [
        {
          name: "accept-charset",
          description: {
            kind: "markdown",
            value: 'A space- or comma-delimited list of character encodings that the server accepts. The browser uses them in the order in which they are listed. The default value, the reserved string `"UNKNOWN"`, indicates the same encoding as that of the document containing the form element.  \nIn previous versions of HTML, the different character encodings could be delimited by spaces or commas. In HTML5, only spaces are allowed as delimiters.'
          }
        },
        {
          name: "action",
          description: {
            kind: "markdown",
            value: 'The URI of a program that processes the form information. This value can be overridden by a [`formaction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formaction) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "autocomplete",
          valueSet: "o",
          description: {
            kind: "markdown",
            value: "Indicates whether input elements can by default have their values automatically completed by the browser. This setting can be overridden by an `autocomplete` attribute on an element belonging to the form. Possible values are:\n\n*   `off`: The user must explicitly enter a value into each field for every use, or the document provides its own auto-completion method; the browser does not automatically complete entries.\n*   `on`: The browser can automatically complete values based on values that the user has previously entered in the form.\n\nFor most modern browsers (including Firefox 38+, Google Chrome 34+, IE 11+) setting the autocomplete attribute will not prevent a browser's password manager from asking the user if they want to store login fields (username and password), if the user permits the storage the browser will autofill the login the next time the user visits the page. See [The autocomplete attribute and login fields](https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#The_autocomplete_attribute_and_login_fields)."
          }
        },
        {
          name: "enctype",
          valueSet: "et",
          description: {
            kind: "markdown",
            value: 'When the value of the `method` attribute is `post`, enctype is the [MIME type](https://en.wikipedia.org/wiki/Mime_type) of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: The value used for an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the `type` attribute set to "file".\n*   `text/plain`: (HTML5)\n\nThis value can be overridden by a [`formenctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formenctype) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "method",
          valueSet: "m",
          description: {
            kind: "markdown",
            value: 'The [HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) method that the browser uses to submit the form. Possible values are:\n\n*   `post`: Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5) ; form data are included in the body of the form and sent to the server.\n*   `get`: Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a \'?\' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n*   `dialog`: Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog "The HTML <dialog> element represents a dialog box or other interactive component, such as an inspector or window.") element to close the dialog when submitted.\n\nThis value can be overridden by a [`formmethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formmethod) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the form. In HTML 4, its use is deprecated (`id` should be used instead). It must be unique among the forms in a document and not just an empty string in HTML 5."
          }
        },
        {
          name: "novalidate",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the form is not to be validated when submitted. If this attribute is not specified (and therefore the form is validated), this default setting can be overridden by a [`formnovalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formnovalidate) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element belonging to the form.'
          }
        },
        {
          name: "target",
          description: {
            kind: "markdown",
            value: 'A name or keyword indicating where to display the response that is received after submitting the form. In HTML 4, this is the name/keyword for a frame. In HTML5, it is a name/keyword for a _browsing context_ (for example, tab, window, or inline frame). The following keywords have special meanings:\n\n*   `_self`: Load the response into the same HTML 4 frame (or HTML5 browsing context) as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed HTML 4 window or HTML5 browsing context.\n*   `_parent`: Load the response into the HTML 4 frameset parent of the current frame, or HTML5 parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: HTML 4: Load the response into the full original window, and cancel all other frames. HTML5: Load the response into the top-level browsing context (i.e., the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`.\n*   _iframename_: The response is displayed in a named [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe "The HTML Inline Frame element (<iframe>) represents a nested browsing context, embedding another HTML page into the current one.").\n\nHTML5: This value can be overridden by a [`formtarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-formtarget) attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") or [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
          }
        },
        {
          name: "accept",
          description: 'A comma-separated list of content types that the server accepts.\n\n**Usage note:** This attribute has been removed in HTML5 and should no longer be used. Instead, use the [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept) attribute of the specific [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element.'
        },
        {
          name: "autocapitalize",
          description: "This is a nonstandard attribute used by iOS Safari Mobile which controls whether and how the text value for textual form control descendants should be automatically capitalized as it is entered/edited by the user. If the `autocapitalize` attribute is specified on an individual form control descendant, it trumps the form-wide `autocapitalize` setting. The non-deprecated values are available in iOS 5 and later. The default value is `sentences`. Possible values are:\n\n*   `none`: Completely disables automatic capitalization\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/form"
        }
      ]
    },
    {
      name: "label",
      description: {
        kind: "markdown",
        value: "The label element represents a caption in a user interface. The caption can be associated with a specific form control, known as the label element's labeled control, either using the for attribute, or by putting the form control inside the label element itself."
      },
      attributes: [
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element with which the label is associated (its _form owner_). If specified, the value of the attribute is the `id` of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. This lets you place label elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "for",
          description: {
            kind: "markdown",
            value: "The [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id) of a [labelable](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Content_categories#Form_labelable) form-related element in the same document as the `<label>` element. The first element in the document with an `id` matching the value of the `for` attribute is the _labeled control_ for this label element, if it is a labelable element. If it is not labelable then the `for` attribute has no effect. If there are other elements which also match the `id` value, later in the document, they are not considered.\n\n**Note**: A `<label>` element can have both a `for` attribute and a contained control element, as long as the `for` attribute points to the contained control element."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/label"
        }
      ]
    },
    {
      name: "input",
      description: {
        kind: "markdown",
        value: "The input element represents a typed data field, usually with a form control to allow the user to edit the data."
      },
      attributes: [
        {
          name: "accept"
        },
        {
          name: "alt"
        },
        {
          name: "autocomplete",
          valueSet: "inputautocomplete"
        },
        {
          name: "autofocus",
          valueSet: "v"
        },
        {
          name: "checked",
          valueSet: "v"
        },
        {
          name: "dirname"
        },
        {
          name: "disabled",
          valueSet: "v"
        },
        {
          name: "form"
        },
        {
          name: "formaction"
        },
        {
          name: "formenctype",
          valueSet: "et"
        },
        {
          name: "formmethod",
          valueSet: "fm"
        },
        {
          name: "formnovalidate",
          valueSet: "v"
        },
        {
          name: "formtarget"
        },
        {
          name: "height"
        },
        {
          name: "inputmode",
          valueSet: "im"
        },
        {
          name: "list"
        },
        {
          name: "max"
        },
        {
          name: "maxlength"
        },
        {
          name: "min"
        },
        {
          name: "minlength"
        },
        {
          name: "multiple",
          valueSet: "v"
        },
        {
          name: "name"
        },
        {
          name: "pattern"
        },
        {
          name: "placeholder"
        },
        {
          name: "readonly",
          valueSet: "v"
        },
        {
          name: "required",
          valueSet: "v"
        },
        {
          name: "size"
        },
        {
          name: "src"
        },
        {
          name: "step"
        },
        {
          name: "type",
          valueSet: "t"
        },
        {
          name: "value"
        },
        {
          name: "width"
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/input"
        }
      ]
    },
    {
      name: "button",
      description: {
        kind: "markdown",
        value: "The button element represents a button labeled by its contents."
      },
      attributes: [
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that the button should have input focus when the page loads, unless the user overrides it, for example by typing in a different control. Only one form-associated element in a document can have this attribute specified."
          }
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the user cannot interact with the button. If this attribute is not specified, the button inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element with the **disabled** attribute set, then the button is enabled.\n\nFirefox will, unlike other browsers, by default, [persist the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Use the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#attr-autocomplete) attribute to control this feature.'
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element that the button is associated with (its _form owner_). The value of the attribute must be the **id** attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element in the same document. If this attribute is not specified, the `<button>` element will be associated to an ancestor [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element, if one exists. This attribute enables you to associate `<button>` elements to [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements anywhere within a document, not just as descendants of [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") elements.'
          }
        },
        {
          name: "formaction",
          description: {
            kind: "markdown",
            value: "The URI of a program that processes the information submitted by the button. If specified, it overrides the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-action) attribute of the button's form owner."
          }
        },
        {
          name: "formenctype",
          valueSet: "et",
          description: {
            kind: "markdown",
            value: 'If the button is a submit button, this attribute specifies the type of content that is used to submit the form to the server. Possible values are:\n\n*   `application/x-www-form-urlencoded`: The default value if the attribute is not specified.\n*   `multipart/form-data`: Use this value if you are using an [`<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") element with the [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type) attribute set to `file`.\n*   `text/plain`\n\nIf this attribute is specified, it overrides the [`enctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype) attribute of the button\'s form owner.'
          }
        },
        {
          name: "formmethod",
          valueSet: "fm",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this attribute specifies the HTTP method that the browser uses to submit the form. Possible values are:\n\n*   `post`: The data from the form are included in the body of the form and sent to the server.\n*   `get`: The data from the form are appended to the **form** attribute URI, with a '?' as a separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters.\n\nIf specified, this attribute overrides the [`method`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-method) attribute of the button's form owner."
          }
        },
        {
          name: "formnovalidate",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this Boolean attribute specifies that the form is not to be validated when it is submitted. If this attribute is specified, it overrides the [`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-novalidate) attribute of the button's form owner."
          }
        },
        {
          name: "formtarget",
          description: {
            kind: "markdown",
            value: "If the button is a submit button, this attribute is a name or keyword indicating where to display the response that is received after submitting the form. This is a name of, or keyword for, a _browsing context_ (for example, tab, window, or inline frame). If this attribute is specified, it overrides the [`target`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target) attribute of the button's form owner. The following keywords have special meanings:\n\n*   `_self`: Load the response into the same browsing context as the current one. This value is the default if the attribute is not specified.\n*   `_blank`: Load the response into a new unnamed browsing context.\n*   `_parent`: Load the response into the parent browsing context of the current one. If there is no parent, this option behaves the same way as `_self`.\n*   `_top`: Load the response into the top-level browsing context (that is, the browsing context that is an ancestor of the current one, and has no parent). If there is no parent, this option behaves the same way as `_self`."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the button, which is submitted with the form data."
          }
        },
        {
          name: "type",
          valueSet: "bt",
          description: {
            kind: "markdown",
            value: "The type of the button. Possible values are:\n\n*   `submit`: The button submits the form data to the server. This is the default if the attribute is not specified, or if the attribute is dynamically changed to an empty or invalid value.\n*   `reset`: The button resets all the controls to their initial values.\n*   `button`: The button has no default behavior. It can have client-side scripts associated with the element's events, which are triggered when the events occur."
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The initial value of the button. It defines the value associated with the button which is submitted with the form data. This value is passed to the server in params when the form is submitted."
          }
        },
        {
          name: "autocomplete",
          description: 'The use of this attribute on a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") is nonstandard and Firefox-specific. By default, unlike other browsers, [Firefox persists the dynamic disabled state](https://stackoverflow.com/questions/5985839/bug-with-firefox-disabled-attribute-of-input-not-resetting-when-refreshing) of a [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button "The HTML <button> element represents a clickable button, which can be used in forms or anywhere in a document that needs simple, standard button functionality.") across page loads. Setting the value of this attribute to `off` (i.e. `autocomplete="off"`) disables this feature. See [bug 654072](https://bugzilla.mozilla.org/show_bug.cgi?id=654072 "if disabled state is changed with javascript, the normal state doesn\'t return after refreshing the page").'
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/button"
        }
      ]
    },
    {
      name: "select",
      description: {
        kind: "markdown",
        value: "The select element represents a control for selecting amongst a set of options."
      },
      attributes: [
        {
          name: "autocomplete",
          valueSet: "inputautocomplete",
          description: {
            kind: "markdown",
            value: 'A [`DOMString`](https://developer.mozilla.org/en-US/docs/Web/API/DOMString "DOMString is a UTF-16 String. As JavaScript already uses such strings, DOMString is mapped directly to a String.") providing a hint for a [user agent\'s](https://developer.mozilla.org/en-US/docs/Glossary/user_agent "user agent\'s: A user agent is a computer program representing a person, for example, a browser in a Web context.") autocomplete feature. See [The HTML autocomplete attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete) for a complete list of values and details on how to use autocomplete.'
          }
        },
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form element in a document can have the `autofocus` attribute."
          }
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example `fieldset`; if there is no containing element with the `disabled` attribute set, then the control is enabled."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'This attribute lets you specify the form element to which the select element is associated (that is, its "form owner"). If this attribute is specified, its value must be the same as the `id` of a form element in the same document. This enables you to place select elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "multiple",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that multiple options can be selected in the list. If it is not specified, then only one option can be selected at a time. When `multiple` is specified, most browsers will show a scrolling list box instead of a single line dropdown."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "This attribute is used to specify the name of the control."
          }
        },
        {
          name: "required",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "A Boolean attribute indicating that an option with a non-empty string value must be selected."
          }
        },
        {
          name: "size",
          description: {
            kind: "markdown",
            value: "If the control is presented as a scrolling list box (e.g. when `multiple` is specified), this attribute represents the number of rows in the list that should be visible at one time. Browsers are not required to present a select element as a scrolled list box. The default value is 0.\n\n**Note:** According to the HTML5 specification, the default value for size should be 1; however, in practice, this has been found to break some web sites, and no other browser currently does that, so Mozilla has opted to continue to return 0 for the time being with Firefox."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/select"
        }
      ]
    },
    {
      name: "datalist",
      description: {
        kind: "markdown",
        value: "The datalist element represents a set of option elements that represent predefined options for other controls. In the rendering, the datalist element represents nothing and it, along with its children, should be hidden."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/datalist"
        }
      ]
    },
    {
      name: "optgroup",
      description: {
        kind: "markdown",
        value: "The optgroup element represents a group of option elements with a common label."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this Boolean attribute is set, none of the items in this option group is selectable. Often browsers grey out such control and it won't receive any browsing events, like mouse clicks or focus-related ones."
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "The name of the group of options, which the browser can use when labeling the options in the user interface. This attribute is mandatory if this element is used."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/optgroup"
        }
      ]
    },
    {
      name: "option",
      description: {
        kind: "markdown",
        value: "The option element represents an option in a select element or as part of a list of suggestions in a datalist element."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'If this Boolean attribute is set, this option is not checkable. Often browsers grey out such control and it won\'t receive any browsing event, like mouse clicks or focus-related ones. If this attribute is not set, the element can still be disabled if one of its ancestors is a disabled [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup "The HTML <optgroup> element creates a grouping of options within a <select> element.") element.'
          }
        },
        {
          name: "label",
          description: {
            kind: "markdown",
            value: "This attribute is text for the label indicating the meaning of the option. If the `label` attribute isn't defined, its value is that of the element text content."
          }
        },
        {
          name: "selected",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'If present, this Boolean attribute indicates that the option is initially selected. If the `<option>` element is the descendant of a [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element whose [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple) attribute is not set, only one single `<option>` of this [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select "The HTML <select> element represents a control that provides a menu of options") element may have the `selected` attribute.'
          }
        },
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The content of this attribute represents the value to be submitted with the form, should this option be selected. If this attribute is omitted, the value is taken from the text content of the option element."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/option"
        }
      ]
    },
    {
      name: "textarea",
      description: {
        kind: "markdown",
        value: "The textarea element represents a multiline plain text edit control for the element's raw value. The contents of the control represent the control's default value."
      },
      attributes: [
        {
          name: "autocomplete",
          valueSet: "inputautocomplete",
          description: {
            kind: "markdown",
            value: 'This attribute indicates whether the value of the control can be automatically completed by the browser. Possible values are:\n\n*   `off`: The user must explicitly enter a value into this field for every use, or the document provides its own auto-completion method; the browser does not automatically complete the entry.\n*   `on`: The browser can automatically complete the value based on values that the user has entered during previous uses.\n\nIf the `autocomplete` attribute is not specified on a `<textarea>` element, then the browser uses the `autocomplete` attribute value of the `<textarea>` element\'s form owner. The form owner is either the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element that this `<textarea>` element is a descendant of or the form element whose `id` is specified by the `form` attribute of the input element. For more information, see the [`autocomplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-autocomplete) attribute in [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.").'
          }
        },
        {
          name: "autofocus",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute lets you specify that a form control should have input focus when the page loads. Only one form-associated element in a document can have this attribute specified."
          }
        },
        {
          name: "cols",
          description: {
            kind: "markdown",
            value: "The visible width of the text control, in average character widths. If it is specified, it must be a positive integer. If it is not specified, the default value is `20`."
          }
        },
        {
          name: "dirname"
        },
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute indicates that the user cannot interact with the control. If this attribute is not specified, the control inherits its setting from the containing element, for example [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset "The HTML <fieldset> element is used to group several controls as well as labels (<label>) within a web form."); if there is no containing element when the `disabled` attribute is set, the control is enabled.'
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The form element that the `<textarea>` element is associated with (its "form owner"). The value of the attribute must be the `id` of a form element in the same document. If this attribute is not specified, the `<textarea>` element must be a descendant of a form element. This attribute enables you to place `<textarea>` elements anywhere within a document, not just as descendants of form elements.'
          }
        },
        {
          name: "inputmode",
          valueSet: "im"
        },
        {
          name: "maxlength",
          description: {
            kind: "markdown",
            value: "The maximum number of characters (unicode code points) that the user can enter. If this value isn't specified, the user can enter an unlimited number of characters."
          }
        },
        {
          name: "minlength",
          description: {
            kind: "markdown",
            value: "The minimum number of characters (unicode code points) required that the user should enter."
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: "The name of the control."
          }
        },
        {
          name: "placeholder",
          description: {
            kind: "markdown",
            value: 'A hint to the user of what can be entered in the control. Carriage returns or line-feeds within the placeholder text must be treated as line breaks when rendering the hint.\n\n**Note:** Placeholders should only be used to show an example of the type of data that should be entered into a form; they are _not_ a substitute for a proper [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label "The HTML <label> element represents a caption for an item in a user interface.") element tied to the input. See [Labels and placeholders](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Labels_and_placeholders "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") in [<input>: The Input (Form Input) element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") for a full explanation.'
          }
        },
        {
          name: "readonly",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates that the user cannot modify the value of the control. Unlike the `disabled` attribute, the `readonly` attribute does not prevent the user from clicking or selecting in the control. The value of a read-only control is still submitted with the form."
          }
        },
        {
          name: "required",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This attribute specifies that the user must fill in a value before submitting a form."
          }
        },
        {
          name: "rows",
          description: {
            kind: "markdown",
            value: "The number of visible text lines for the control."
          }
        },
        {
          name: "wrap",
          valueSet: "w",
          description: {
            kind: "markdown",
            value: "Indicates how the control wraps text. Possible values are:\n\n*   `hard`: The browser automatically inserts line breaks (CR+LF) so that each line has no more than the width of the control; the `cols` attribute must also be specified for this to take effect.\n*   `soft`: The browser ensures that all line breaks in the value consist of a CR+LF pair, but does not insert any additional line breaks.\n*   `off` : Like `soft` but changes appearance to `white-space: pre` so line segments exceeding `cols` are not wrapped and the `<textarea>` becomes horizontally scrollable.\n\nIf this attribute is not specified, `soft` is its default value."
          }
        },
        {
          name: "autocapitalize",
          description: "This is a non-standard attribute supported by WebKit on iOS (therefore nearly all browsers running on iOS, including Safari, Firefox, and Chrome), which controls whether and how the text value should be automatically capitalized as it is entered/edited by the user. The non-deprecated values are available in iOS 5 and later. Possible values are:\n\n*   `none`: Completely disables automatic capitalization.\n*   `sentences`: Automatically capitalize the first letter of sentences.\n*   `words`: Automatically capitalize the first letter of words.\n*   `characters`: Automatically capitalize all characters.\n*   `on`: Deprecated since iOS 5.\n*   `off`: Deprecated since iOS 5."
        },
        {
          name: "spellcheck",
          description: "Specifies whether the `<textarea>` is subject to spell checking by the underlying browser/OS. the value can be:\n\n*   `true`: Indicates that the element needs to have its spelling and grammar checked.\n*   `default` : Indicates that the element is to act according to a default behavior, possibly based on the parent element's own `spellcheck` value.\n*   `false` : Indicates that the element should not be spell checked."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/textarea"
        }
      ]
    },
    {
      name: "output",
      description: {
        kind: "markdown",
        value: "The output element represents the result of a calculation performed by the application, or the result of a user action."
      },
      attributes: [
        {
          name: "for",
          description: {
            kind: "markdown",
            value: "A space-separated list of other elements’ [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)s, indicating that those elements contributed input values to (or otherwise affected) the calculation."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'The [form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) that this element is associated with (its "form owner"). The value of the attribute must be an `id` of a form element in the same document. If this attribute is not specified, the output element must be a descendant of a form element. This attribute enables you to place output elements anywhere within a document, not just as descendants of their form elements.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'The name of the element, exposed in the [`HTMLFormElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement "The HTMLFormElement interface represents a <form> element in the DOM; it allows access to and in some cases modification of aspects of the form, as well as access to its component elements.") API.'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/output"
        }
      ]
    },
    {
      name: "progress",
      description: {
        kind: "markdown",
        value: "The progress element represents the completion progress of a task. The progress is either indeterminate, indicating that progress is being made but that it is not clear how much more work remains to be done before the task is complete (e.g. because the task is waiting for a remote host to respond), or the progress is a number in the range zero to a maximum, giving the fraction of work that has so far been completed."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "This attribute specifies how much of the task that has been completed. It must be a valid floating point number between 0 and `max`, or between 0 and 1 if `max` is omitted. If there is no `value` attribute, the progress bar is indeterminate; this indicates that an activity is ongoing with no indication of how long it is expected to take."
          }
        },
        {
          name: "max",
          description: {
            kind: "markdown",
            value: "This attribute describes how much work the task indicated by the `progress` element requires. The `max` attribute, if present, must have a value greater than zero and be a valid floating point number. The default value is 1."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/progress"
        }
      ]
    },
    {
      name: "meter",
      description: {
        kind: "markdown",
        value: "The meter element represents a scalar measurement within a known range, or a fractional value; for example disk usage, the relevance of a query result, or the fraction of a voting population to have selected a particular candidate."
      },
      attributes: [
        {
          name: "value",
          description: {
            kind: "markdown",
            value: "The current numeric value. This must be between the minimum and maximum values (`min` attribute and `max` attribute) if they are specified. If unspecified or malformed, the value is 0. If specified, but not within the range given by the `min` attribute and `max` attribute, the value is equal to the nearest end of the range.\n\n**Usage note:** Unless the `value` attribute is between `0` and `1` (inclusive), the `min` and `max` attributes should define the range so that the `value` attribute's value is within it."
          }
        },
        {
          name: "min",
          description: {
            kind: "markdown",
            value: "The lower numeric bound of the measured range. This must be less than the maximum value (`max` attribute), if specified. If unspecified, the minimum value is 0."
          }
        },
        {
          name: "max",
          description: {
            kind: "markdown",
            value: "The upper numeric bound of the measured range. This must be greater than the minimum value (`min` attribute), if specified. If unspecified, the maximum value is 1."
          }
        },
        {
          name: "low",
          description: {
            kind: "markdown",
            value: "The upper numeric bound of the low end of the measured range. This must be greater than the minimum value (`min` attribute), and it also must be less than the high value and maximum value (`high` attribute and `max` attribute, respectively), if any are specified. If unspecified, or if less than the minimum value, the `low` value is equal to the minimum value."
          }
        },
        {
          name: "high",
          description: {
            kind: "markdown",
            value: "The lower numeric bound of the high end of the measured range. This must be less than the maximum value (`max` attribute), and it also must be greater than the low value and minimum value (`low` attribute and **min** attribute, respectively), if any are specified. If unspecified, or if greater than the maximum value, the `high` value is equal to the maximum value."
          }
        },
        {
          name: "optimum",
          description: {
            kind: "markdown",
            value: "This attribute indicates the optimal numeric value. It must be within the range (as defined by the `min` attribute and `max` attribute). When used with the `low` attribute and `high` attribute, it gives an indication where along the range is considered preferable. For example, if it is between the `min` attribute and the `low` attribute, then the lower range is considered preferred."
          }
        },
        {
          name: "form",
          description: "This attribute associates the element with a `form` element that has ownership of the `meter` element. For example, a `meter` might be displaying a range corresponding to an `input` element of `type` _number_. This attribute is only used if the `meter` element is being used as a form-associated element; even then, it may be omitted if the element appears as a descendant of a `form` element."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/meter"
        }
      ]
    },
    {
      name: "fieldset",
      description: {
        kind: "markdown",
        value: "The fieldset element represents a set of form controls optionally grouped under a common name."
      },
      attributes: [
        {
          name: "disabled",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "If this Boolean attribute is set, all form controls that are descendants of the `<fieldset>`, are disabled, meaning they are not editable and won't be submitted along with the `<form>`. They won't receive any browsing events, like mouse clicks or focus-related events. By default browsers display such controls grayed out. Note that form elements inside the [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend \"The HTML <legend> element represents a caption for the content of its parent <fieldset>.\") element won't be disabled."
          }
        },
        {
          name: "form",
          description: {
            kind: "markdown",
            value: 'This attribute takes the value of the `id` attribute of a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form "The HTML <form> element represents a document section that contains interactive controls for submitting information to a web server.") element you want the `<fieldset>` to be part of, even if it is not inside the form.'
          }
        },
        {
          name: "name",
          description: {
            kind: "markdown",
            value: 'The name associated with the group.\n\n**Note**: The caption for the fieldset is given by the first [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend "The HTML <legend> element represents a caption for the content of its parent <fieldset>.") element nested inside it.'
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/fieldset"
        }
      ]
    },
    {
      name: "legend",
      description: {
        kind: "markdown",
        value: "The legend element represents a caption for the rest of the contents of the legend element's parent fieldset element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/legend"
        }
      ]
    },
    {
      name: "details",
      description: {
        kind: "markdown",
        value: "The details element represents a disclosure widget from which the user can obtain additional information or controls."
      },
      attributes: [
        {
          name: "open",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: "This Boolean attribute indicates whether or not the details — that is, the contents of the `<details>` element — are currently visible. The default, `false`, means the details are not visible."
          }
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/details"
        }
      ]
    },
    {
      name: "summary",
      description: {
        kind: "markdown",
        value: "The summary element represents a summary, caption, or legend for the rest of the contents of the summary element's parent details element, if any."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/summary"
        }
      ]
    },
    {
      name: "dialog",
      description: {
        kind: "markdown",
        value: "The dialog element represents a part of an application that a user interacts with to perform a task, for example a dialog box, inspector, or window."
      },
      attributes: [
        {
          name: "open",
          description: "Indicates that the dialog is active and available for interaction. When the `open` attribute is not set, the dialog shouldn't be shown to the user."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/dialog"
        }
      ]
    },
    {
      name: "script",
      description: {
        kind: "markdown",
        value: "The script element allows authors to include dynamic script and data blocks in their documents. The element does not represent content for the user."
      },
      attributes: [
        {
          name: "src",
          description: {
            kind: "markdown",
            value: "This attribute specifies the URI of an external script; this can be used as an alternative to embedding a script directly within a document.\n\nIf a `script` element has a `src` attribute specified, it should not have a script embedded inside its tags."
          }
        },
        {
          name: "type",
          description: {
            kind: "markdown",
            value: 'This attribute indicates the type of script represented. The value of this attribute will be in one of the following categories:\n\n*   **Omitted or a JavaScript MIME type:** For HTML5-compliant browsers this indicates the script is JavaScript. HTML5 specification urges authors to omit the attribute rather than provide a redundant MIME type. In earlier browsers, this identified the scripting language of the embedded or imported (via the `src` attribute) code. JavaScript MIME types are [listed in the specification](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#JavaScript_types).\n*   **`module`:** For HTML5-compliant browsers the code is treated as a JavaScript module. The processing of the script contents is not affected by the `charset` and `defer` attributes. For information on using `module`, see [ES6 in Depth: Modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/). Code may behave differently when the `module` keyword is used.\n*   **Any other value:** The embedded content is treated as a data block which won\'t be processed by the browser. Developers must use a valid MIME type that is not a JavaScript MIME type to denote data blocks. The `src` attribute will be ignored.\n\n**Note:** in Firefox you could specify the version of JavaScript contained in a `<script>` element by including a non-standard `version` parameter inside the `type` attribute — for example `type="text/javascript;version=1.8"`. This has been removed in Firefox 59 (see [bug 1428745](https://bugzilla.mozilla.org/show_bug.cgi?id=1428745 "FIXED: Remove support for version parameter from script loader")).'
          }
        },
        {
          name: "charset"
        },
        {
          name: "async",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: `This is a Boolean attribute indicating that the browser should, if possible, load the script asynchronously.

This attribute must not be used if the \`src\` attribute is absent (i.e. for inline scripts). If it is included in this case it will have no effect.

Browsers usually assume the worst case scenario and load scripts synchronously, (i.e. \`async="false"\`) during HTML parsing.

Dynamically inserted scripts (using [\`document.createElement()\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement "In an HTML document, the document.createElement() method creates the HTML element specified by tagName, or an HTMLUnknownElement if tagName isn't recognized.")) load asynchronously by default, so to turn on synchronous loading (i.e. scripts load in the order they were inserted) set \`async="false"\`.

See [Browser compatibility](#Browser_compatibility) for notes on browser support. See also [Async scripts for asm.js](https://developer.mozilla.org/en-US/docs/Games/Techniques/Async_scripts).`
          }
        },
        {
          name: "defer",
          valueSet: "v",
          description: {
            kind: "markdown",
            value: 'This Boolean attribute is set to indicate to a browser that the script is meant to be executed after the document has been parsed, but before firing [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded "/en-US/docs/Web/Events/DOMContentLoaded").\n\nScripts with the `defer` attribute will prevent the `DOMContentLoaded` event from firing until the script has loaded and finished evaluating.\n\nThis attribute must not be used if the `src` attribute is absent (i.e. for inline scripts), in this case it would have no effect.\n\nTo achieve a similar effect for dynamically inserted scripts use `async="false"` instead. Scripts with the `defer` attribute will execute in the order in which they appear in the document.'
          }
        },
        {
          name: "crossorigin",
          valueSet: "xo",
          description: {
            kind: "markdown",
            value: 'Normal `script` elements pass minimal information to the [`window.onerror`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror "The onerror property of the GlobalEventHandlers mixin is an EventHandler that processes error events.") for scripts which do not pass the standard [CORS](https://developer.mozilla.org/en-US/docs/Glossary/CORS "CORS: CORS (Cross-Origin Resource Sharing) is a system, consisting of transmitting HTTP headers, that determines whether browsers block frontend JavaScript code from accessing responses for cross-origin requests.") checks. To allow error logging for sites which use a separate domain for static media, use this attribute. See [CORS settings attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for a more descriptive explanation of its valid arguments.'
          }
        },
        {
          name: "nonce",
          description: {
            kind: "markdown",
            value: "A cryptographic nonce (number used once) to whitelist inline scripts in a [script-src Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src). The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial."
          }
        },
        {
          name: "integrity",
          description: "This attribute contains inline metadata that a user agent can use to verify that a fetched resource has been delivered free of unexpected manipulation. See [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)."
        },
        {
          name: "nomodule",
          description: "This Boolean attribute is set to indicate that the script should not be executed in browsers that support [ES2015 modules](https://hacks.mozilla.org/2015/08/es6-in-depth-modules/) — in effect, this can be used to serve fallback scripts to older browsers that do not support modular JavaScript code."
        },
        {
          name: "referrerpolicy",
          description: 'Indicates which [referrer](https://developer.mozilla.org/en-US/docs/Web/API/Document/referrer) to send when fetching the script, or resources fetched by the script:\n\n*   `no-referrer`: The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent.\n*   `no-referrer-when-downgrade` (default): The [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer "The Referer request header contains the address of the previous web page from which a link to the currently requested page was followed. The Referer header allows servers to identify where people are visiting them from and may use that data for analytics, logging, or optimized caching, for example.") header will not be sent to [origin](https://developer.mozilla.org/en-US/docs/Glossary/origin "origin: Web content\'s origin is defined by the scheme (protocol), host (domain), and port of the URL used to access it. Two objects have the same origin only when the scheme, host, and port all match.")s without [TLS](https://developer.mozilla.org/en-US/docs/Glossary/TLS "TLS: Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is a protocol used by applications to communicate securely across a network, preventing tampering with and eavesdropping on email, web browsing, messaging, and other protocols.") ([HTTPS](https://developer.mozilla.org/en-US/docs/Glossary/HTTPS "HTTPS: HTTPS (HTTP Secure) is an encrypted version of the HTTP protocol. It usually uses SSL or TLS to encrypt all communication between a client and a server. This secure connection allows clients to safely exchange sensitive data with a server, for example for banking activities or online shopping.")).\n*   `origin`: The sent referrer will be limited to the origin of the referring page: its [scheme](https://developer.mozilla.org/en-US/docs/Archive/Mozilla/URIScheme), [host](https://developer.mozilla.org/en-US/docs/Glossary/host "host: A host is a device connected to the Internet (or a local network). Some hosts called servers offer additional services like serving webpages or storing files and emails."), and [port](https://developer.mozilla.org/en-US/docs/Glossary/port "port: For a computer connected to a network with an IP address, a port is a communication endpoint. Ports are designated by numbers, and below 1024 each port is associated by default with a specific protocol.").\n*   `origin-when-cross-origin`: The referrer sent to other origins will be limited to the scheme, the host, and the port. Navigations on the same origin will still include the path.\n*   `same-origin`: A referrer will be sent for [same origin](https://developer.mozilla.org/en-US/docs/Glossary/Same-origin_policy "same origin: The same-origin policy is a critical security mechanism that restricts how a document or script loaded from one origin can interact with a resource from another origin."), but cross-origin requests will contain no referrer information.\n*   `strict-origin`: Only send the origin of the document as the referrer when the protocol security level stays the same (e.g. HTTPS→HTTPS), but don\'t send it to a less secure destination (e.g. HTTPS→HTTP).\n*   `strict-origin-when-cross-origin`: Send a full URL when performing a same-origin request, but only send the origin when the protocol security level stays the same (e.g.HTTPS→HTTPS), and send no header to a less secure destination (e.g. HTTPS→HTTP).\n*   `unsafe-url`: The referrer will include the origin _and_ the path (but not the [fragment](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash), [password](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/password), or [username](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/username)). **This value is unsafe**, because it leaks origins and paths from TLS-protected resources to insecure origins.\n\n**Note**: An empty string value (`""`) is both the default value, and a fallback value if `referrerpolicy` is not supported. If `referrerpolicy` is not explicitly specified on the `<script>` element, it will adopt a higher-level referrer policy, i.e. one set on the whole document or domain. If a higher-level policy is not available, the empty string is treated as being equivalent to `no-referrer-when-downgrade`.'
        },
        {
          name: "text",
          description: "Like the `textContent` attribute, this attribute sets the text content of the element. Unlike the `textContent` attribute, however, this attribute is evaluated as executable code after the node is inserted into the DOM."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/script"
        }
      ]
    },
    {
      name: "noscript",
      description: {
        kind: "markdown",
        value: "The noscript element represents nothing if scripting is enabled, and represents its children if scripting is disabled. It is used to present different markup to user agents that support scripting and those that don't support scripting, by affecting how the document is parsed."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/noscript"
        }
      ]
    },
    {
      name: "template",
      description: {
        kind: "markdown",
        value: "The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script."
      },
      attributes: [],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/template"
        }
      ]
    },
    {
      name: "canvas",
      description: {
        kind: "markdown",
        value: "The canvas element provides scripts with a resolution-dependent bitmap canvas, which can be used for rendering graphs, game graphics, art, or other visual images on the fly."
      },
      attributes: [
        {
          name: "width",
          description: {
            kind: "markdown",
            value: "The width of the coordinate space in CSS pixels. Defaults to 300."
          }
        },
        {
          name: "height",
          description: {
            kind: "markdown",
            value: "The height of the coordinate space in CSS pixels. Defaults to 150."
          }
        },
        {
          name: "moz-opaque",
          description: "Lets the canvas know whether or not translucency will be a factor. If the canvas knows there's no translucency, painting performance can be optimized. This is only supported by Mozilla-based browsers; use the standardized [`canvas.getContext('2d', { alpha: false })`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext \"The HTMLCanvasElement.getContext() method returns a drawing context on the canvas, or null if the context identifier is not supported.\") instead."
        }
      ],
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Element/canvas"
        }
      ]
    }
  ],
  globalAttributes: [
    {
      name: "accesskey",
      description: {
        kind: "markdown",
        value: "Provides a hint for generating a keyboard shortcut for the current element. This attribute consists of a space-separated list of characters. The browser should use the first one that exists on the computer keyboard layout."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/accesskey"
        }
      ]
    },
    {
      name: "autocapitalize",
      description: {
        kind: "markdown",
        value: "Controls whether and how text input is automatically capitalized as it is entered/edited by the user. It can have the following values:\n\n*   `off` or `none`, no autocapitalization is applied (all letters default to lowercase)\n*   `on` or `sentences`, the first letter of each sentence defaults to a capital letter; all other letters default to lowercase\n*   `words`, the first letter of each word defaults to a capital letter; all other letters default to lowercase\n*   `characters`, all letters should default to uppercase"
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/autocapitalize"
        }
      ]
    },
    {
      name: "class",
      description: {
        kind: "markdown",
        value: 'A space-separated list of the classes of the element. Classes allows CSS and JavaScript to select and access specific elements via the [class selectors](/en-US/docs/Web/CSS/Class_selectors) or functions like the method [`Document.getElementsByClassName()`](/en-US/docs/Web/API/Document/getElementsByClassName "returns an array-like object of all child elements which have all of the given class names.").'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/class"
        }
      ]
    },
    {
      name: "contenteditable",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating if the element should be editable by the user. If so, the browser modifies its widget to allow editing. The attribute must take one of the following values:\n\n*   `true` or the _empty string_, which indicates that the element must be editable;\n*   `false`, which indicates that the element must not be editable."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contenteditable"
        }
      ]
    },
    {
      name: "contextmenu",
      description: {
        kind: "markdown",
        value: 'The `[**id**](#attr-id)` of a [`<menu>`](/en-US/docs/Web/HTML/Element/menu "The HTML <menu> element represents a group of commands that a user can perform or activate. This includes both list menus, which might appear across the top of a screen, as well as context menus, such as those that might appear underneath a button after it has been clicked.") to use as the contextual menu for this element.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/contextmenu"
        }
      ]
    },
    {
      name: "dir",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating the directionality of the element's text. It can have the following values:\n\n*   `ltr`, which means _left to right_ and is to be used for languages that are written from the left to the right (like English);\n*   `rtl`, which means _right to left_ and is to be used for languages that are written from the right to the left (like Arabic);\n*   `auto`, which lets the user agent decide. It uses a basic algorithm as it parses the characters inside the element until it finds a character with a strong directionality, then it applies that directionality to the whole element."
      },
      valueSet: "d",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/dir"
        }
      ]
    },
    {
      name: "draggable",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating whether the element can be dragged, using the [Drag and Drop API](/en-us/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `true`, which indicates that the element may be dragged\n*   `false`, which indicates that the element may not be dragged."
      },
      valueSet: "b",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/draggable"
        }
      ]
    },
    {
      name: "dropzone",
      description: {
        kind: "markdown",
        value: "An enumerated attribute indicating what types of content can be dropped on an element, using the [Drag and Drop API](/en-US/docs/DragDrop/Drag_and_Drop). It can have the following values:\n\n*   `copy`, which indicates that dropping will create a copy of the element that was dragged\n*   `move`, which indicates that the element that was dragged will be moved to this new location.\n*   `link`, will create a link to the dragged data."
      }
    },
    {
      name: "exportparts",
      description: {
        kind: "markdown",
        value: "Used to transitively export shadow parts from a nested shadow tree into a containing light tree."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/exportparts"
        }
      ]
    },
    {
      name: "hidden",
      description: {
        kind: "markdown",
        value: "A Boolean attribute indicates that the element is not yet, or is no longer, _relevant_. For example, it can be used to hide elements of the page that can't be used until the login process has been completed. The browser won't render such elements. This attribute must not be used to hide content that could legitimately be shown."
      },
      valueSet: "v",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/hidden"
        }
      ]
    },
    {
      name: "id",
      description: {
        kind: "markdown",
        value: "Defines a unique identifier (ID) which must be unique in the whole document. Its purpose is to identify the element when linking (using a fragment identifier), scripting, or styling (with CSS)."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/id"
        }
      ]
    },
    {
      name: "inputmode",
      description: {
        kind: "markdown",
        value: 'Provides a hint to browsers as to the type of virtual keyboard configuration to use when editing this element or its contents. Used primarily on [`<input>`](/en-US/docs/Web/HTML/Element/input "The HTML <input> element is used to create interactive controls for web-based forms in order to accept data from the user; a wide variety of types of input data and control widgets are available, depending on the device and user agent.") elements, but is usable on any element while in `[contenteditable](/en-US/docs/Web/HTML/Global_attributes#attr-contenteditable)` mode.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/inputmode"
        }
      ]
    },
    {
      name: "is",
      description: {
        kind: "markdown",
        value: "Allows you to specify that a standard HTML element should behave like a registered custom built-in element (see [Using custom elements](/en-US/docs/Web/Web_Components/Using_custom_elements) for more details)."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/is"
        }
      ]
    },
    {
      name: "itemid",
      description: {
        kind: "markdown",
        value: "The unique, global identifier of an item."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemid"
        }
      ]
    },
    {
      name: "itemprop",
      description: {
        kind: "markdown",
        value: "Used to add properties to an item. Every HTML element may have an `itemprop` attribute specified, where an `itemprop` consists of a name and value pair."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemprop"
        }
      ]
    },
    {
      name: "itemref",
      description: {
        kind: "markdown",
        value: "Properties that are not descendants of an element with the `itemscope` attribute can be associated with the item using an `itemref`. It provides a list of element ids (not `itemid`s) with additional properties elsewhere in the document."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemref"
        }
      ]
    },
    {
      name: "itemscope",
      description: {
        kind: "markdown",
        value: "`itemscope` (usually) works along with `[itemtype](/en-US/docs/Web/HTML/Global_attributes#attr-itemtype)` to specify that the HTML contained in a block is about a particular item. `itemscope` creates the Item and defines the scope of the `itemtype` associated with it. `itemtype` is a valid URL of a vocabulary (such as [schema.org](https://schema.org/)) that describes the item and its properties context."
      },
      valueSet: "v",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemscope"
        }
      ]
    },
    {
      name: "itemtype",
      description: {
        kind: "markdown",
        value: "Specifies the URL of the vocabulary that will be used to define `itemprop`s (item properties) in the data structure. `[itemscope](/en-US/docs/Web/HTML/Global_attributes#attr-itemscope)` is used to set the scope of where in the data structure the vocabulary set by `itemtype` will be active."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/itemtype"
        }
      ]
    },
    {
      name: "lang",
      description: {
        kind: "markdown",
        value: "Helps define the language of an element: the language that non-editable elements are in, or the language that editable elements should be written in by the user. The attribute contains one “language tag” (made of hyphen-separated “language subtags”) in the format defined in [_Tags for Identifying Languages (BCP47)_](https://www.ietf.org/rfc/bcp/bcp47.txt). [**xml:lang**](#attr-xml:lang) has priority over it."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/lang"
        }
      ]
    },
    {
      name: "part",
      description: {
        kind: "markdown",
        value: 'A space-separated list of the part names of the element. Part names allows CSS to select and style specific elements in a shadow tree via the [`::part`](/en-US/docs/Web/CSS/::part "The ::part CSS pseudo-element represents any element within a shadow tree that has a matching part attribute.") pseudo-element.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/part"
        }
      ]
    },
    {
      name: "role",
      valueSet: "roles"
    },
    {
      name: "slot",
      description: {
        kind: "markdown",
        value: "Assigns a slot in a [shadow DOM](/en-US/docs/Web/Web_Components/Shadow_DOM) shadow tree to an element: An element with a `slot` attribute is assigned to the slot created by the [`<slot>`](/en-US/docs/Web/HTML/Element/slot \"The HTML <slot> element—part of the Web Components technology suite—is a placeholder inside a web component that you can fill with your own markup, which lets you create separate DOM trees and present them together.\") element whose `[name](/en-US/docs/Web/HTML/Element/slot#attr-name)` attribute's value matches that `slot` attribute's value."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/slot"
        }
      ]
    },
    {
      name: "spellcheck",
      description: {
        kind: "markdown",
        value: "An enumerated attribute defines whether the element may be checked for spelling errors. It may have the following values:\n\n*   `true`, which indicates that the element should be, if possible, checked for spelling errors;\n*   `false`, which indicates that the element should not be checked for spelling errors."
      },
      valueSet: "b",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/spellcheck"
        }
      ]
    },
    {
      name: "style",
      description: {
        kind: "markdown",
        value: 'Contains [CSS](/en-US/docs/Web/CSS) styling declarations to be applied to the element. Note that it is recommended for styles to be defined in a separate file or files. This attribute and the [`<style>`](/en-US/docs/Web/HTML/Element/style "The HTML <style> element contains style information for a document, or part of a document.") element have mainly the purpose of allowing for quick styling, for example for testing purposes.'
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/style"
        }
      ]
    },
    {
      name: "tabindex",
      description: {
        kind: "markdown",
        value: `An integer attribute indicating if the element can take input focus (is _focusable_), if it should participate to sequential keyboard navigation, and if so, at what position. It can take several values:

*   a _negative value_ means that the element should be focusable, but should not be reachable via sequential keyboard navigation;
*   \`0\` means that the element should be focusable and reachable via sequential keyboard navigation, but its relative order is defined by the platform convention;
*   a _positive value_ means that the element should be focusable and reachable via sequential keyboard navigation; the order in which the elements are focused is the increasing value of the [**tabindex**](#attr-tabindex). If several elements share the same tabindex, their relative order follows their relative positions in the document.`
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/tabindex"
        }
      ]
    },
    {
      name: "title",
      description: {
        kind: "markdown",
        value: "Contains a text representing advisory information related to the element it belongs to. Such information can typically, but not necessarily, be presented to the user as a tooltip."
      },
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/title"
        }
      ]
    },
    {
      name: "translate",
      description: {
        kind: "markdown",
        value: "An enumerated attribute that is used to specify whether an element's attribute values and the values of its [`Text`](/en-US/docs/Web/API/Text \"The Text interface represents the textual content of Element or Attr. If an element has no markup within its content, it has a single child implementing Text that contains the element's text. However, if the element contains markup, it is parsed into information items and Text nodes that form its children.\") node children are to be translated when the page is localized, or whether to leave them unchanged. It can have the following values:\n\n*   empty string and `yes`, which indicates that the element will be translated.\n*   `no`, which indicates that the element will not be translated."
      },
      valueSet: "y",
      references: [
        {
          name: "MDN Reference",
          url: "https://developer.mozilla.org/docs/Web/HTML/Global_attributes/translate"
        }
      ]
    },
    {
      name: "onabort",
      description: {
        kind: "markdown",
        value: "The loading of a resource has been aborted."
      }
    },
    {
      name: "onblur",
      description: {
        kind: "markdown",
        value: "An element has lost focus (does not bubble)."
      }
    },
    {
      name: "oncanplay",
      description: {
        kind: "markdown",
        value: "The user agent can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content."
      }
    },
    {
      name: "oncanplaythrough",
      description: {
        kind: "markdown",
        value: "The user agent can play the media up to its end without having to stop for further buffering of content."
      }
    },
    {
      name: "onchange",
      description: {
        kind: "markdown",
        value: "The change event is fired for <input>, <select>, and <textarea> elements when a change to the element's value is committed by the user."
      }
    },
    {
      name: "onclick",
      description: {
        kind: "markdown",
        value: "A pointing device button has been pressed and released on an element."
      }
    },
    {
      name: "oncontextmenu",
      description: {
        kind: "markdown",
        value: "The right button of the mouse is clicked (before the context menu is displayed)."
      }
    },
    {
      name: "ondblclick",
      description: {
        kind: "markdown",
        value: "A pointing device button is clicked twice on an element."
      }
    },
    {
      name: "ondrag",
      description: {
        kind: "markdown",
        value: "An element or text selection is being dragged (every 350ms)."
      }
    },
    {
      name: "ondragend",
      description: {
        kind: "markdown",
        value: "A drag operation is being ended (by releasing a mouse button or hitting the escape key)."
      }
    },
    {
      name: "ondragenter",
      description: {
        kind: "markdown",
        value: "A dragged element or text selection enters a valid drop target."
      }
    },
    {
      name: "ondragleave",
      description: {
        kind: "markdown",
        value: "A dragged element or text selection leaves a valid drop target."
      }
    },
    {
      name: "ondragover",
      description: {
        kind: "markdown",
        value: "An element or text selection is being dragged over a valid drop target (every 350ms)."
      }
    },
    {
      name: "ondragstart",
      description: {
        kind: "markdown",
        value: "The user starts dragging an element or text selection."
      }
    },
    {
      name: "ondrop",
      description: {
        kind: "markdown",
        value: "An element is dropped on a valid drop target."
      }
    },
    {
      name: "ondurationchange",
      description: {
        kind: "markdown",
        value: "The duration attribute has been updated."
      }
    },
    {
      name: "onemptied",
      description: {
        kind: "markdown",
        value: "The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it."
      }
    },
    {
      name: "onended",
      description: {
        kind: "markdown",
        value: "Playback has stopped because the end of the media was reached."
      }
    },
    {
      name: "onerror",
      description: {
        kind: "markdown",
        value: "A resource failed to load."
      }
    },
    {
      name: "onfocus",
      description: {
        kind: "markdown",
        value: "An element has received focus (does not bubble)."
      }
    },
    {
      name: "onformchange"
    },
    {
      name: "onforminput"
    },
    {
      name: "oninput",
      description: {
        kind: "markdown",
        value: "The value of an element changes or the content of an element with the attribute contenteditable is modified."
      }
    },
    {
      name: "oninvalid",
      description: {
        kind: "markdown",
        value: "A submittable element has been checked and doesn't satisfy its constraints."
      }
    },
    {
      name: "onkeydown",
      description: {
        kind: "markdown",
        value: "A key is pressed down."
      }
    },
    {
      name: "onkeypress",
      description: {
        kind: "markdown",
        value: "A key is pressed down and that key normally produces a character value (use input instead)."
      }
    },
    {
      name: "onkeyup",
      description: {
        kind: "markdown",
        value: "A key is released."
      }
    },
    {
      name: "onload",
      description: {
        kind: "markdown",
        value: "A resource and its dependent resources have finished loading."
      }
    },
    {
      name: "onloadeddata",
      description: {
        kind: "markdown",
        value: "The first frame of the media has finished loading."
      }
    },
    {
      name: "onloadedmetadata",
      description: {
        kind: "markdown",
        value: "The metadata has been loaded."
      }
    },
    {
      name: "onloadstart",
      description: {
        kind: "markdown",
        value: "Progress has begun."
      }
    },
    {
      name: "onmousedown",
      description: {
        kind: "markdown",
        value: "A pointing device button (usually a mouse) is pressed on an element."
      }
    },
    {
      name: "onmousemove",
      description: {
        kind: "markdown",
        value: "A pointing device is moved over an element."
      }
    },
    {
      name: "onmouseout",
      description: {
        kind: "markdown",
        value: "A pointing device is moved off the element that has the listener attached or off one of its children."
      }
    },
    {
      name: "onmouseover",
      description: {
        kind: "markdown",
        value: "A pointing device is moved onto the element that has the listener attached or onto one of its children."
      }
    },
    {
      name: "onmouseup",
      description: {
        kind: "markdown",
        value: "A pointing device button is released over an element."
      }
    },
    {
      name: "onmousewheel"
    },
    {
      name: "onmouseenter",
      description: {
        kind: "markdown",
        value: "A pointing device is moved onto the element that has the listener attached."
      }
    },
    {
      name: "onmouseleave",
      description: {
        kind: "markdown",
        value: "A pointing device is moved off the element that has the listener attached."
      }
    },
    {
      name: "onpause",
      description: {
        kind: "markdown",
        value: "Playback has been paused."
      }
    },
    {
      name: "onplay",
      description: {
        kind: "markdown",
        value: "Playback has begun."
      }
    },
    {
      name: "onplaying",
      description: {
        kind: "markdown",
        value: "Playback is ready to start after having been paused or delayed due to lack of data."
      }
    },
    {
      name: "onprogress",
      description: {
        kind: "markdown",
        value: "In progress."
      }
    },
    {
      name: "onratechange",
      description: {
        kind: "markdown",
        value: "The playback rate has changed."
      }
    },
    {
      name: "onreset",
      description: {
        kind: "markdown",
        value: "A form is reset."
      }
    },
    {
      name: "onresize",
      description: {
        kind: "markdown",
        value: "The document view has been resized."
      }
    },
    {
      name: "onreadystatechange",
      description: {
        kind: "markdown",
        value: "The readyState attribute of a document has changed."
      }
    },
    {
      name: "onscroll",
      description: {
        kind: "markdown",
        value: "The document view or an element has been scrolled."
      }
    },
    {
      name: "onseeked",
      description: {
        kind: "markdown",
        value: "A seek operation completed."
      }
    },
    {
      name: "onseeking",
      description: {
        kind: "markdown",
        value: "A seek operation began."
      }
    },
    {
      name: "onselect",
      description: {
        kind: "markdown",
        value: "Some text is being selected."
      }
    },
    {
      name: "onshow",
      description: {
        kind: "markdown",
        value: "A contextmenu event was fired on/bubbled to an element that has a contextmenu attribute"
      }
    },
    {
      name: "onstalled",
      description: {
        kind: "markdown",
        value: "The user agent is trying to fetch media data, but data is unexpectedly not forthcoming."
      }
    },
    {
      name: "onsubmit",
      description: {
        kind: "markdown",
        value: "A form is submitted."
      }
    },
    {
      name: "onsuspend",
      description: {
        kind: "markdown",
        value: "Media data loading has been suspended."
      }
    },
    {
      name: "ontimeupdate",
      description: {
        kind: "markdown",
        value: "The time indicated by the currentTime attribute has been updated."
      }
    },
    {
      name: "onvolumechange",
      description: {
        kind: "markdown",
        value: "The volume has changed."
      }
    },
    {
      name: "onwaiting",
      description: {
        kind: "markdown",
        value: "Playback has stopped because of a temporary lack of data."
      }
    },
    {
      name: "onpointercancel",
      description: {
        kind: "markdown",
        value: "The pointer is unlikely to produce any more events."
      }
    },
    {
      name: "onpointerdown",
      description: {
        kind: "markdown",
        value: "The pointer enters the active buttons state."
      }
    },
    {
      name: "onpointerenter",
      description: {
        kind: "markdown",
        value: "Pointing device is moved inside the hit-testing boundary."
      }
    },
    {
      name: "onpointerleave",
      description: {
        kind: "markdown",
        value: "Pointing device is moved out of the hit-testing boundary."
      }
    },
    {
      name: "onpointerlockchange",
      description: {
        kind: "markdown",
        value: "The pointer was locked or released."
      }
    },
    {
      name: "onpointerlockerror",
      description: {
        kind: "markdown",
        value: "It was impossible to lock the pointer for technical reasons or because the permission was denied."
      }
    },
    {
      name: "onpointermove",
      description: {
        kind: "markdown",
        value: "The pointer changed coordinates."
      }
    },
    {
      name: "onpointerout",
      description: {
        kind: "markdown",
        value: "The pointing device moved out of hit-testing boundary or leaves detectable hover range."
      }
    },
    {
      name: "onpointerover",
      description: {
        kind: "markdown",
        value: "The pointing device is moved into the hit-testing boundary."
      }
    },
    {
      name: "onpointerup",
      description: {
        kind: "markdown",
        value: "The pointer leaves the active buttons state."
      }
    },
    {
      name: "aria-activedescendant",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the currently active element when DOM focus is on a [`composite`](https://www.w3.org/TR/wai-aria-1.1/#composite) widget, [`textbox`](https://www.w3.org/TR/wai-aria-1.1/#textbox), [`group`](https://www.w3.org/TR/wai-aria-1.1/#group), or [`application`](https://www.w3.org/TR/wai-aria-1.1/#application)."
      }
    },
    {
      name: "aria-atomic",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-atomic"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology) will present all, or only parts of, the changed region based on the change notifications defined by the [`aria-relevant`](https://www.w3.org/TR/wai-aria-1.1/#aria-relevant) attribute."
      }
    },
    {
      name: "aria-autocomplete",
      valueSet: "autocomplete",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be presented if they are made."
      }
    },
    {
      name: "aria-busy",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-busy"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates an element is being modified and that assistive technologies _MAY_ want to wait until the modifications are complete before exposing them to the user."
      }
    },
    {
      name: "aria-checked",
      valueSet: "tristate",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-checked"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "checked" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of checkboxes, radio buttons, and other [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).'
      }
    },
    {
      name: "aria-colcount",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colcount"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the total number of columns in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex)."
      }
    },
    {
      name: "aria-colindex",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colindex"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) column index or position with respect to the total number of columns within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-colcount) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
      }
    },
    {
      name: "aria-colspan",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-colspan"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of columns spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-colindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-colindex) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
      }
    },
    {
      name: "aria-controls",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-controls"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) whose contents or presence are controlled by the current element. See related [`aria-owns`](https://www.w3.org/TR/wai-aria-1.1/#aria-owns)."
      }
    },
    {
      name: "aria-current",
      valueSet: "current",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-current"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that represents the current item within a container or set of related elements."
      }
    },
    {
      name: "aria-describedby",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-describedby"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that describes the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
      }
    },
    {
      name: "aria-disabled",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-disabled"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is [perceivable](https://www.w3.org/TR/wai-aria-1.1/#dfn-perceivable) but disabled, so it is not editable or otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-hidden`](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden) and [`aria-readonly`](https://www.w3.org/TR/wai-aria-1.1/#aria-readonly)."
      }
    },
    {
      name: "aria-dropeffect",
      valueSet: "dropeffect",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-dropeffect"
        }
      ],
      description: {
        kind: "markdown",
        value: "\\[Deprecated in ARIA 1.1\\] Indicates what functions can be performed when a dragged object is released on the drop target."
      }
    },
    {
      name: "aria-errormessage",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides an error message for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-invalid`](https://www.w3.org/TR/wai-aria-1.1/#aria-invalid) and [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-expanded",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-expanded"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed."
      }
    },
    {
      name: "aria-flowto",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-flowto"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the next [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order."
      }
    },
    {
      name: "aria-grabbed",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed"
        }
      ],
      description: {
        kind: "markdown",
        value: `\\[Deprecated in ARIA 1.1\\] Indicates an element's "grabbed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) in a drag-and-drop operation.`
      }
    },
    {
      name: "aria-haspopup",
      valueSet: "haspopup",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
      }
    },
    {
      name: "aria-hidden",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-hidden"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is exposed to an accessibility API. See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
      }
    },
    {
      name: "aria-invalid",
      valueSet: "invalid",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-invalid"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates the entered value does not conform to the format expected by the application. See related [`aria-errormessage`](https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage)."
      }
    },
    {
      name: "aria-label",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-label"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a string value that labels the current element. See related [`aria-labelledby`](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby)."
      }
    },
    {
      name: "aria-labelledby",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) that labels the current element. See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-level",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-level"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the hierarchical level of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) within a structure."
      }
    },
    {
      name: "aria-live",
      valueSet: "live",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-live"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) will be updated, and describes the types of updates the [user agents](https://www.w3.org/TR/wai-aria-1.1/#dfn-user-agent), [assistive technologies](https://www.w3.org/TR/wai-aria-1.1/#dfn-assistive-technology), and user can expect from the [live region](https://www.w3.org/TR/wai-aria-1.1/#dfn-live-region)."
      }
    },
    {
      name: "aria-modal",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-modal"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is modal when displayed."
      }
    },
    {
      name: "aria-multiline",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiline"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether a text box accepts multiple lines of input or only a single line."
      }
    },
    {
      name: "aria-multiselectable",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the user may select more than one item from the current selectable descendants."
      }
    },
    {
      name: "aria-orientation",
      valueSet: "orientation",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-orientation"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous."
      }
    },
    {
      name: "aria-owns",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-owns"
        }
      ],
      description: {
        kind: "markdown",
        value: "Identifies an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) (or elements) in order to define a visual, functional, or contextual parent/child [relationship](https://www.w3.org/TR/wai-aria-1.1/#dfn-relationship) between DOM elements where the DOM hierarchy cannot be used to represent the relationship. See related [`aria-controls`](https://www.w3.org/TR/wai-aria-1.1/#aria-controls)."
      }
    },
    {
      name: "aria-placeholder",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format."
      }
    },
    {
      name: "aria-posinset",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-posinset"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)'s number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-setsize`](https://www.w3.org/TR/wai-aria-1.1/#aria-setsize)."
      }
    },
    {
      name: "aria-pressed",
      valueSet: "tristate",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-pressed"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "pressed" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of toggle buttons. See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-selected`](https://www.w3.org/TR/wai-aria-1.1/#aria-selected).'
      }
    },
    {
      name: "aria-readonly",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-readonly"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) is not editable, but is otherwise [operable](https://www.w3.org/TR/wai-aria-1.1/#dfn-operable). See related [`aria-disabled`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled)."
      }
    },
    {
      name: "aria-relevant",
      valueSet: "relevant",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-relevant"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified. See related [`aria-atomic`](https://www.w3.org/TR/wai-aria-1.1/#aria-atomic)."
      }
    },
    {
      name: "aria-required",
      valueSet: "b",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-required"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates that user input is required on the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) before a form may be submitted."
      }
    },
    {
      name: "aria-roledescription",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines a human-readable, author-localized description for the [role](https://www.w3.org/TR/wai-aria-1.1/#dfn-role) of an [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element)."
      }
    },
    {
      name: "aria-rowcount",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the total number of rows in a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex)."
      }
    },
    {
      name: "aria-rowindex",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines an [element's](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) row index or position with respect to the total number of rows within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowcount`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount) and [`aria-rowspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan)."
      }
    },
    {
      name: "aria-rowspan",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of rows spanned by a cell or gridcell within a [`table`](https://www.w3.org/TR/wai-aria-1.1/#table), [`grid`](https://www.w3.org/TR/wai-aria-1.1/#grid), or [`treegrid`](https://www.w3.org/TR/wai-aria-1.1/#treegrid). See related [`aria-rowindex`](https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex) and [`aria-colspan`](https://www.w3.org/TR/wai-aria-1.1/#aria-colspan)."
      }
    },
    {
      name: "aria-selected",
      valueSet: "u",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-selected"
        }
      ],
      description: {
        kind: "markdown",
        value: 'Indicates the current "selected" [state](https://www.w3.org/TR/wai-aria-1.1/#dfn-state) of various [widgets](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-checked`](https://www.w3.org/TR/wai-aria-1.1/#aria-checked) and [`aria-pressed`](https://www.w3.org/TR/wai-aria-1.1/#aria-pressed).'
      }
    },
    {
      name: "aria-setsize",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-setsize"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM. See related [`aria-posinset`](https://www.w3.org/TR/wai-aria-1.1/#aria-posinset)."
      }
    },
    {
      name: "aria-sort",
      valueSet: "sort",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-sort"
        }
      ],
      description: {
        kind: "markdown",
        value: "Indicates if items in a table or grid are sorted in ascending or descending order."
      }
    },
    {
      name: "aria-valuemax",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the maximum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-valuemin",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the minimum allowed value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-valuenow",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the current value for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget). See related [`aria-valuetext`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext)."
      }
    },
    {
      name: "aria-valuetext",
      references: [
        {
          name: "WAI-ARIA Reference",
          url: "https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext"
        }
      ],
      description: {
        kind: "markdown",
        value: "Defines the human readable text alternative of [`aria-valuenow`](https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow) for a range [widget](https://www.w3.org/TR/wai-aria-1.1/#dfn-widget)."
      }
    },
    {
      name: "aria-details",
      description: {
        kind: "markdown",
        value: "Identifies the [element](https://www.w3.org/TR/wai-aria-1.1/#dfn-element) that provides a detailed, extended description for the [object](https://www.w3.org/TR/wai-aria-1.1/#dfn-object). See related [`aria-describedby`](https://www.w3.org/TR/wai-aria-1.1/#aria-describedby)."
      }
    },
    {
      name: "aria-keyshortcuts",
      description: {
        kind: "markdown",
        value: "Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element."
      }
    }
  ],
  valueSets: [
    {
      name: "b",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        }
      ]
    },
    {
      name: "u",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "o",
      values: [
        {
          name: "on"
        },
        {
          name: "off"
        }
      ]
    },
    {
      name: "y",
      values: [
        {
          name: "yes"
        },
        {
          name: "no"
        }
      ]
    },
    {
      name: "w",
      values: [
        {
          name: "soft"
        },
        {
          name: "hard"
        }
      ]
    },
    {
      name: "d",
      values: [
        {
          name: "ltr"
        },
        {
          name: "rtl"
        },
        {
          name: "auto"
        }
      ]
    },
    {
      name: "m",
      values: [
        {
          name: "get",
          description: {
            kind: "markdown",
            value: "Corresponds to the HTTP [GET method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.3); form data are appended to the `action` attribute URI with a '?' as separator, and the resulting URI is sent to the server. Use this method when the form has no side-effects and contains only ASCII characters."
          }
        },
        {
          name: "post",
          description: {
            kind: "markdown",
            value: "Corresponds to the HTTP [POST method](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.5); form data are included in the body of the form and sent to the server."
          }
        },
        {
          name: "dialog",
          description: {
            kind: "markdown",
            value: "Use when the form is inside a [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) element to close the dialog when submitted."
          }
        }
      ]
    },
    {
      name: "fm",
      values: [
        {
          name: "get"
        },
        {
          name: "post"
        }
      ]
    },
    {
      name: "s",
      values: [
        {
          name: "row"
        },
        {
          name: "col"
        },
        {
          name: "rowgroup"
        },
        {
          name: "colgroup"
        }
      ]
    },
    {
      name: "t",
      values: [
        {
          name: "hidden"
        },
        {
          name: "text"
        },
        {
          name: "search"
        },
        {
          name: "tel"
        },
        {
          name: "url"
        },
        {
          name: "email"
        },
        {
          name: "password"
        },
        {
          name: "datetime"
        },
        {
          name: "date"
        },
        {
          name: "month"
        },
        {
          name: "week"
        },
        {
          name: "time"
        },
        {
          name: "datetime-local"
        },
        {
          name: "number"
        },
        {
          name: "range"
        },
        {
          name: "color"
        },
        {
          name: "checkbox"
        },
        {
          name: "radio"
        },
        {
          name: "file"
        },
        {
          name: "submit"
        },
        {
          name: "image"
        },
        {
          name: "reset"
        },
        {
          name: "button"
        }
      ]
    },
    {
      name: "im",
      values: [
        {
          name: "verbatim"
        },
        {
          name: "latin"
        },
        {
          name: "latin-name"
        },
        {
          name: "latin-prose"
        },
        {
          name: "full-width-latin"
        },
        {
          name: "kana"
        },
        {
          name: "kana-name"
        },
        {
          name: "katakana"
        },
        {
          name: "numeric"
        },
        {
          name: "tel"
        },
        {
          name: "email"
        },
        {
          name: "url"
        }
      ]
    },
    {
      name: "bt",
      values: [
        {
          name: "button"
        },
        {
          name: "submit"
        },
        {
          name: "reset"
        },
        {
          name: "menu"
        }
      ]
    },
    {
      name: "lt",
      values: [
        {
          name: "1"
        },
        {
          name: "a"
        },
        {
          name: "A"
        },
        {
          name: "i"
        },
        {
          name: "I"
        }
      ]
    },
    {
      name: "mt",
      values: [
        {
          name: "context"
        },
        {
          name: "toolbar"
        }
      ]
    },
    {
      name: "mit",
      values: [
        {
          name: "command"
        },
        {
          name: "checkbox"
        },
        {
          name: "radio"
        }
      ]
    },
    {
      name: "et",
      values: [
        {
          name: "application/x-www-form-urlencoded"
        },
        {
          name: "multipart/form-data"
        },
        {
          name: "text/plain"
        }
      ]
    },
    {
      name: "tk",
      values: [
        {
          name: "subtitles"
        },
        {
          name: "captions"
        },
        {
          name: "descriptions"
        },
        {
          name: "chapters"
        },
        {
          name: "metadata"
        }
      ]
    },
    {
      name: "pl",
      values: [
        {
          name: "none"
        },
        {
          name: "metadata"
        },
        {
          name: "auto"
        }
      ]
    },
    {
      name: "sh",
      values: [
        {
          name: "circle"
        },
        {
          name: "default"
        },
        {
          name: "poly"
        },
        {
          name: "rect"
        }
      ]
    },
    {
      name: "xo",
      values: [
        {
          name: "anonymous"
        },
        {
          name: "use-credentials"
        }
      ]
    },
    {
      name: "sb",
      values: [
        {
          name: "allow-forms"
        },
        {
          name: "allow-modals"
        },
        {
          name: "allow-pointer-lock"
        },
        {
          name: "allow-popups"
        },
        {
          name: "allow-popups-to-escape-sandbox"
        },
        {
          name: "allow-same-origin"
        },
        {
          name: "allow-scripts"
        },
        {
          name: "allow-top-navigation"
        }
      ]
    },
    {
      name: "tristate",
      values: [
        {
          name: "true"
        },
        {
          name: "false"
        },
        {
          name: "mixed"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "inputautocomplete",
      values: [
        {
          name: "additional-name"
        },
        {
          name: "address-level1"
        },
        {
          name: "address-level2"
        },
        {
          name: "address-level3"
        },
        {
          name: "address-level4"
        },
        {
          name: "address-line1"
        },
        {
          name: "address-line2"
        },
        {
          name: "address-line3"
        },
        {
          name: "bday"
        },
        {
          name: "bday-year"
        },
        {
          name: "bday-day"
        },
        {
          name: "bday-month"
        },
        {
          name: "billing"
        },
        {
          name: "cc-additional-name"
        },
        {
          name: "cc-csc"
        },
        {
          name: "cc-exp"
        },
        {
          name: "cc-exp-month"
        },
        {
          name: "cc-exp-year"
        },
        {
          name: "cc-family-name"
        },
        {
          name: "cc-given-name"
        },
        {
          name: "cc-name"
        },
        {
          name: "cc-number"
        },
        {
          name: "cc-type"
        },
        {
          name: "country"
        },
        {
          name: "country-name"
        },
        {
          name: "current-password"
        },
        {
          name: "email"
        },
        {
          name: "family-name"
        },
        {
          name: "fax"
        },
        {
          name: "given-name"
        },
        {
          name: "home"
        },
        {
          name: "honorific-prefix"
        },
        {
          name: "honorific-suffix"
        },
        {
          name: "impp"
        },
        {
          name: "language"
        },
        {
          name: "mobile"
        },
        {
          name: "name"
        },
        {
          name: "new-password"
        },
        {
          name: "nickname"
        },
        {
          name: "organization"
        },
        {
          name: "organization-title"
        },
        {
          name: "pager"
        },
        {
          name: "photo"
        },
        {
          name: "postal-code"
        },
        {
          name: "sex"
        },
        {
          name: "shipping"
        },
        {
          name: "street-address"
        },
        {
          name: "tel-area-code"
        },
        {
          name: "tel"
        },
        {
          name: "tel-country-code"
        },
        {
          name: "tel-extension"
        },
        {
          name: "tel-local"
        },
        {
          name: "tel-local-prefix"
        },
        {
          name: "tel-local-suffix"
        },
        {
          name: "tel-national"
        },
        {
          name: "transaction-amount"
        },
        {
          name: "transaction-currency"
        },
        {
          name: "url"
        },
        {
          name: "username"
        },
        {
          name: "work"
        }
      ]
    },
    {
      name: "autocomplete",
      values: [
        {
          name: "inline"
        },
        {
          name: "list"
        },
        {
          name: "both"
        },
        {
          name: "none"
        }
      ]
    },
    {
      name: "current",
      values: [
        {
          name: "page"
        },
        {
          name: "step"
        },
        {
          name: "location"
        },
        {
          name: "date"
        },
        {
          name: "time"
        },
        {
          name: "true"
        },
        {
          name: "false"
        }
      ]
    },
    {
      name: "dropeffect",
      values: [
        {
          name: "copy"
        },
        {
          name: "move"
        },
        {
          name: "link"
        },
        {
          name: "execute"
        },
        {
          name: "popup"
        },
        {
          name: "none"
        }
      ]
    },
    {
      name: "invalid",
      values: [
        {
          name: "grammar"
        },
        {
          name: "false"
        },
        {
          name: "spelling"
        },
        {
          name: "true"
        }
      ]
    },
    {
      name: "live",
      values: [
        {
          name: "off"
        },
        {
          name: "polite"
        },
        {
          name: "assertive"
        }
      ]
    },
    {
      name: "orientation",
      values: [
        {
          name: "vertical"
        },
        {
          name: "horizontal"
        },
        {
          name: "undefined"
        }
      ]
    },
    {
      name: "relevant",
      values: [
        {
          name: "additions"
        },
        {
          name: "removals"
        },
        {
          name: "text"
        },
        {
          name: "all"
        },
        {
          name: "additions text"
        }
      ]
    },
    {
      name: "sort",
      values: [
        {
          name: "ascending"
        },
        {
          name: "descending"
        },
        {
          name: "none"
        },
        {
          name: "other"
        }
      ]
    },
    {
      name: "roles",
      values: [
        {
          name: "alert"
        },
        {
          name: "alertdialog"
        },
        {
          name: "button"
        },
        {
          name: "checkbox"
        },
        {
          name: "dialog"
        },
        {
          name: "gridcell"
        },
        {
          name: "link"
        },
        {
          name: "log"
        },
        {
          name: "marquee"
        },
        {
          name: "menuitem"
        },
        {
          name: "menuitemcheckbox"
        },
        {
          name: "menuitemradio"
        },
        {
          name: "option"
        },
        {
          name: "progressbar"
        },
        {
          name: "radio"
        },
        {
          name: "scrollbar"
        },
        {
          name: "searchbox"
        },
        {
          name: "slider"
        },
        {
          name: "spinbutton"
        },
        {
          name: "status"
        },
        {
          name: "switch"
        },
        {
          name: "tab"
        },
        {
          name: "tabpanel"
        },
        {
          name: "textbox"
        },
        {
          name: "timer"
        },
        {
          name: "tooltip"
        },
        {
          name: "treeitem"
        },
        {
          name: "combobox"
        },
        {
          name: "grid"
        },
        {
          name: "listbox"
        },
        {
          name: "menu"
        },
        {
          name: "menubar"
        },
        {
          name: "radiogroup"
        },
        {
          name: "tablist"
        },
        {
          name: "tree"
        },
        {
          name: "treegrid"
        },
        {
          name: "application"
        },
        {
          name: "article"
        },
        {
          name: "cell"
        },
        {
          name: "columnheader"
        },
        {
          name: "definition"
        },
        {
          name: "directory"
        },
        {
          name: "document"
        },
        {
          name: "feed"
        },
        {
          name: "figure"
        },
        {
          name: "group"
        },
        {
          name: "heading"
        },
        {
          name: "img"
        },
        {
          name: "list"
        },
        {
          name: "listitem"
        },
        {
          name: "math"
        },
        {
          name: "none"
        },
        {
          name: "note"
        },
        {
          name: "presentation"
        },
        {
          name: "region"
        },
        {
          name: "row"
        },
        {
          name: "rowgroup"
        },
        {
          name: "rowheader"
        },
        {
          name: "separator"
        },
        {
          name: "table"
        },
        {
          name: "term"
        },
        {
          name: "text"
        },
        {
          name: "toolbar"
        },
        {
          name: "banner"
        },
        {
          name: "complementary"
        },
        {
          name: "contentinfo"
        },
        {
          name: "form"
        },
        {
          name: "main"
        },
        {
          name: "navigation"
        },
        {
          name: "region"
        },
        {
          name: "search"
        },
        {
          name: "doc-abstract"
        },
        {
          name: "doc-acknowledgments"
        },
        {
          name: "doc-afterword"
        },
        {
          name: "doc-appendix"
        },
        {
          name: "doc-backlink"
        },
        {
          name: "doc-biblioentry"
        },
        {
          name: "doc-bibliography"
        },
        {
          name: "doc-biblioref"
        },
        {
          name: "doc-chapter"
        },
        {
          name: "doc-colophon"
        },
        {
          name: "doc-conclusion"
        },
        {
          name: "doc-cover"
        },
        {
          name: "doc-credit"
        },
        {
          name: "doc-credits"
        },
        {
          name: "doc-dedication"
        },
        {
          name: "doc-endnote"
        },
        {
          name: "doc-endnotes"
        },
        {
          name: "doc-epigraph"
        },
        {
          name: "doc-epilogue"
        },
        {
          name: "doc-errata"
        },
        {
          name: "doc-example"
        },
        {
          name: "doc-footnote"
        },
        {
          name: "doc-foreword"
        },
        {
          name: "doc-glossary"
        },
        {
          name: "doc-glossref"
        },
        {
          name: "doc-index"
        },
        {
          name: "doc-introduction"
        },
        {
          name: "doc-noteref"
        },
        {
          name: "doc-notice"
        },
        {
          name: "doc-pagebreak"
        },
        {
          name: "doc-pagelist"
        },
        {
          name: "doc-part"
        },
        {
          name: "doc-preface"
        },
        {
          name: "doc-prologue"
        },
        {
          name: "doc-pullquote"
        },
        {
          name: "doc-qna"
        },
        {
          name: "doc-subtitle"
        },
        {
          name: "doc-tip"
        },
        {
          name: "doc-toc"
        }
      ]
    },
    {
      name: "metanames",
      values: [
        {
          name: "application-name"
        },
        {
          name: "author"
        },
        {
          name: "description"
        },
        {
          name: "format-detection"
        },
        {
          name: "generator"
        },
        {
          name: "keywords"
        },
        {
          name: "publisher"
        },
        {
          name: "referrer"
        },
        {
          name: "robots"
        },
        {
          name: "theme-color"
        },
        {
          name: "viewport"
        }
      ]
    },
    {
      name: "haspopup",
      values: [
        {
          name: "false",
          description: {
            kind: "markdown",
            value: "(default) Indicates the element does not have a popup."
          }
        },
        {
          name: "true",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a menu."
          }
        },
        {
          name: "menu",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a menu."
          }
        },
        {
          name: "listbox",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a listbox."
          }
        },
        {
          name: "tree",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a tree."
          }
        },
        {
          name: "grid",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a grid."
          }
        },
        {
          name: "dialog",
          description: {
            kind: "markdown",
            value: "Indicates the popup is a dialog."
          }
        }
      ]
    }
  ]
}, tl = function() {
  function e(t) {
    this.dataProviders = [], this.setDataProviders(t.useDefaultDataProvider !== !1, t.customDataProviders || []);
  }
  return e.prototype.setDataProviders = function(t, n) {
    var r;
    this.dataProviders = [], t && this.dataProviders.push(new Ji("html5", el)), (r = this.dataProviders).push.apply(r, n);
  }, e.prototype.getDataProviders = function() {
    return this.dataProviders;
  }, e;
}(), nl = {};
function rl(e) {
  e === void 0 && (e = nl);
  var t = new tl(e), n = new Lo(e, t), r = new ko(e, t);
  return {
    setDataProviders: t.setDataProviders.bind(t),
    createScanner: pe,
    parseHTMLDocument: function(i) {
      return Xi(i.getText());
    },
    doComplete: r.doComplete.bind(r),
    doComplete2: r.doComplete2.bind(r),
    setCompletionParticipants: r.setCompletionParticipants.bind(r),
    doHover: n.doHover.bind(n),
    format: No,
    findDocumentHighlights: Oo,
    findDocumentLinks: qo,
    findDocumentSymbols: Vo,
    getFoldingRanges: Qo,
    getSelectionRanges: Yo,
    doQuoteComplete: r.doQuoteComplete.bind(r),
    doTagComplete: r.doTagComplete.bind(r),
    doRename: Go,
    findMatchingTagPosition: Xo,
    findOnTypeRenameRanges: Li,
    findLinkedEditingRanges: Li
  };
}
function il(e, t) {
  return new Ji(e, t);
}
var al = class {
  constructor(e, t) {
    Ye(this, "_ctx");
    Ye(this, "_languageService");
    Ye(this, "_languageSettings");
    Ye(this, "_languageId");
    this._ctx = e, this._languageSettings = t.languageSettings, this._languageId = t.languageId;
    const n = this._languageSettings.data, r = n == null ? void 0 : n.useDefaultDataProvider, i = [];
    if (n != null && n.dataProviders)
      for (const s in n.dataProviders)
        i.push(il(s, n.dataProviders[s]));
    this._languageService = rl({
      useDefaultDataProvider: r,
      customDataProviders: i
    });
  }
  async doComplete(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return null;
    let r = this._languageService.parseHTMLDocument(n);
    return Promise.resolve(this._languageService.doComplete(n, t, r, this._languageSettings && this._languageSettings.suggest));
  }
  async format(e, t, n) {
    let r = this._getTextDocument(e);
    if (!r)
      return [];
    let i = { ...this._languageSettings.format, ...n }, s = this._languageService.format(r, t, i);
    return Promise.resolve(s);
  }
  async doHover(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return null;
    let r = this._languageService.parseHTMLDocument(n), i = this._languageService.doHover(n, t, r);
    return Promise.resolve(i);
  }
  async findDocumentHighlights(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let r = this._languageService.parseHTMLDocument(n), i = this._languageService.findDocumentHighlights(n, t, r);
    return Promise.resolve(i);
  }
  async findDocumentLinks(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let n = this._languageService.findDocumentLinks(t, null);
    return Promise.resolve(n);
  }
  async findDocumentSymbols(e) {
    let t = this._getTextDocument(e);
    if (!t)
      return [];
    let n = this._languageService.parseHTMLDocument(t), r = this._languageService.findDocumentSymbols(t, n);
    return Promise.resolve(r);
  }
  async getFoldingRanges(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let r = this._languageService.getFoldingRanges(n, t);
    return Promise.resolve(r);
  }
  async getSelectionRanges(e, t) {
    let n = this._getTextDocument(e);
    if (!n)
      return [];
    let r = this._languageService.getSelectionRanges(n, t);
    return Promise.resolve(r);
  }
  async doRename(e, t, n) {
    let r = this._getTextDocument(e);
    if (!r)
      return null;
    let i = this._languageService.parseHTMLDocument(r), s = this._languageService.doRename(r, t, n, i);
    return Promise.resolve(s);
  }
  _getTextDocument(e) {
    let t = this._ctx.getMirrorModels();
    for (let n of t)
      if (n.uri.toString() === e)
        return wn.create(e, this._languageId, n.version, n.getValue());
    return null;
  }
};
self.onmessage = () => {
  Gi((e, t) => new al(e, t));
};

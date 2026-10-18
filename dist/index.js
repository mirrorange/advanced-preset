//#region src/st/host.ts
var e = () => globalThis.SillyTavern.getContext(), t = {}, n = (e) => new URL(e, import.meta.url).href;
async function r() {
	try {
		t = await import(
			/* @vite-ignore */
			n("../../../../openai.js")
);
	} catch (e) {
		console.warn("[AP] openai.js not importable, using built-in stream extraction", e);
	}
}
function i() {
	let e = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
	return e ? decodeURIComponent(e[1]) : "third-party/advanced-preset";
}
var a = () => n("../");
function o(e, n, r) {
	if (t.getStreamingReply) return t.getStreamingReply(e, n, {
		chatCompletionSource: r,
		overrideShowThoughts: !0
	});
	if (r === "claude") return n.reasoning += e?.delta?.thinking ?? "", e?.delta?.text ?? "";
	if (r === "makersuite" || r === "vertexai") {
		let t = e?.candidates?.[0]?.content?.parts ?? [];
		return n.reasoning += t.filter((e) => e.thought).map((e) => e.text).join(""), t.filter((e) => !e.thought).map((e) => e.text ?? "").join("");
	}
	if (r === "cohere") return e?.delta?.message?.content?.text ?? "";
	let i = e?.choices?.[0]?.delta;
	return n.reasoning += i?.reasoning_content ?? i?.reasoning ?? "", i?.content ?? e?.choices?.[0]?.message?.content ?? "";
}
function s(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var c = (...e) => globalThis.fetch(...e), l = (e) => {
	c = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function u(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var d = {}, f = [], p = () => {}, m = () => !1, h = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), g = (e) => e.startsWith("onUpdate:"), _ = Object.assign, v = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, y = Object.prototype.hasOwnProperty, b = (e, t) => y.call(e, t), x = Array.isArray, S = (e) => ie(e) === "[object Map]", C = (e) => ie(e) === "[object Set]", ee = (e) => ie(e) === "[object Date]", te = (e) => ie(e) === "[object RegExp]", w = (e) => typeof e == "function", T = (e) => typeof e == "string", E = (e) => typeof e == "symbol", D = (e) => typeof e == "object" && !!e, ne = (e) => (D(e) || w(e)) && w(e.then) && w(e.catch), re = Object.prototype.toString, ie = (e) => re.call(e), ae = (e) => ie(e).slice(8, -1), oe = (e) => ie(e) === "[object Object]", se = (e) => T(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ce = /* @__PURE__ */ u(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), le = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ue = /-\w/g, de = le((e) => e.replace(ue, (e) => e.slice(1).toUpperCase())), fe = /\B([A-Z])/g, pe = le((e) => e.replace(fe, "-$1").toLowerCase()), me = le((e) => e.charAt(0).toUpperCase() + e.slice(1)), he = le((e) => e ? `on${me(e)}` : ""), ge = (e, t) => !Object.is(e, t), _e = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, ve = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, ye = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, be = (e) => {
	let t = T(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, xe, Se = () => xe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ce(e) {
	if (x(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = T(r) ? De(r) : Ce(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (T(e) || D(e)) return e;
}
var we = /;(?![^(]*\))/g, Te = /:([^]+)/, Ee = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function De(e) {
	let t = {};
	return e.replace(Ee, (e) => e.startsWith("/*") ? "" : e).split(we).forEach((e) => {
		if (e) {
			let n = e.split(Te);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function O(e) {
	let t = "";
	if (T(e)) t = e;
	else if (x(e)) for (let n = 0; n < e.length; n++) {
		let r = O(e[n]);
		r && (t += r + " ");
	}
	else if (D(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Oe = /* @__PURE__ */ u("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function ke(e) {
	return !!e || e === "";
}
function Ae(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Pe(e[i], t[i], n);
	return r;
}
function je(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Pe(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Me(e, t, n) {
	let r = S(e), i = S(t);
	if (r || i || (r = C(e), i = C(t), r || i)) return r && i ? je(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Pe(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ne(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Pe(e, t, n) {
	if (e === t) return !0;
	let r = ee(e), i = ee(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = E(e), i = E(t), r || i ? e === t : (r = x(e), i = x(t), r || i ? r && i ? Ne(e, t, n, Ae) : !1 : (r = D(e), i = D(t), r || i ? !r || !i ? !1 : Ne(e, t, n, Me) : String(e) === String(t))));
}
function Fe(e, t) {
	return e.findIndex((e) => Pe(e, t));
}
var Ie = (e) => !!(e && e.__v_isRef === !0), k = (e) => T(e) ? e : e == null ? "" : x(e) || D(e) && (e.toString === re || !w(e.toString)) ? Ie(e) ? k(e.value) : JSON.stringify(e, Le, 2) : String(e), Le = (e, t) => Ie(t) ? Le(e, t.value) : S(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Re(t, r) + " =>"] = n, e), {}) } : C(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Re(e)) } : E(t) ? Re(t) : D(t) && !x(t) && !oe(t) ? String(t) : t, Re = (e, t = "") => E(e) ? `Symbol(${e.description ?? t})` : e, ze, Be = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && ze && (ze.active ? (this.parent = ze, this.index = (ze.scopes || (ze.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = ze;
			try {
				return ze = this, e();
			} finally {
				ze = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = ze, ze = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (ze === this) ze = this.prevScope;
			else {
				let e = ze;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function Ve() {
	return ze;
}
var A, He = /* @__PURE__ */ new WeakSet(), Ue = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, ze && (ze.active ? ze.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, He.has(this) && (He.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || qe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, ot(this), Xe(this);
		let e = A, t = nt;
		A = this, nt = !0;
		try {
			return this.fn();
		} finally {
			Ze(this), A = e, nt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) et(e);
			this.deps = this.depsTail = void 0, ot(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? He.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Qe(this) && this.run();
	}
	get dirty() {
		return Qe(this);
	}
}, We = 0, Ge, Ke;
function qe(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ke, Ke = e) : (e.next = Ge, Ge = e);
}
function Je() {
	We++;
}
function Ye() {
	if (--We > 0) return;
	if (Ke) {
		let e = Ke;
		for (Ke = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ge;) {
		let t = Ge;
		for (Ge = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Xe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ze(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), et(r), tt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Qe(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && ($e(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function $e(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === st) || (e.globalVersion = st, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Qe(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = A, r = nt;
	A = e, nt = !0;
	try {
		Xe(e);
		let n = e.fn(e._value);
		(t.version === 0 || ge(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		A = n, nt = r, Ze(e), e.flags &= -3;
	}
}
function et(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) et(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function tt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var nt = !0, rt = [];
function it() {
	rt.push(nt), nt = !1;
}
function at() {
	let e = rt.pop();
	nt = e === void 0 || e;
}
function ot(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = A;
		A = void 0;
		try {
			t();
		} finally {
			A = e;
		}
	}
}
var st = 0, ct = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, lt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!A || !nt || A === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== A) t = this.activeLink = new ct(A, this), A.deps ? (t.prevDep = A.depsTail, A.depsTail.nextDep = t, A.depsTail = t) : A.deps = A.depsTail = t, ut(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = A.depsTail, t.nextDep = void 0, A.depsTail.nextDep = t, A.depsTail = t, A.deps === t && (A.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, st++, this.notify(e);
	}
	notify(e) {
		Je();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ye();
		}
	}
};
function ut(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ut(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var dt = /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ Symbol(""), pt = /* @__PURE__ */ Symbol(""), mt = /* @__PURE__ */ Symbol("");
function ht(e, t, n) {
	if (nt && A) {
		let t = dt.get(e);
		t || dt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new lt()), r.map = t, r.key = n), r.track();
	}
}
function gt(e, t, n, r, i, a) {
	let o = dt.get(e);
	if (!o) {
		st++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Je(), t === "clear") o.forEach(s);
	else {
		let i = x(e), a = i && se(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === mt || !E(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(mt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(ft)), S(e) && s(o.get(pt)));
				break;
			case "delete":
				i || (s(o.get(ft)), S(e) && s(o.get(pt)));
				break;
			case "set": S(e) && s(o.get(ft));
		}
	}
	Ye();
}
function _t(e) {
	let t = /* @__PURE__ */ j(e);
	return t === e || (ht(t, "iterate", mt), /* @__PURE__ */ rn(e)) ? t : /* @__PURE__ */ nn(e) ? /* @__PURE__ */ tn(e) ? t.map((e) => cn(sn(e))) : t.map(cn) : t.map(sn);
}
function vt(e) {
	return ht(e = /* @__PURE__ */ j(e), "iterate", mt), e;
}
function yt(e, t) {
	return /* @__PURE__ */ nn(e) ? cn(/* @__PURE__ */ tn(e) ? sn(t) : t) : sn(t);
}
var bt = {
	__proto__: null,
	[Symbol.iterator]() {
		return xt(this, Symbol.iterator, (e) => yt(this, e));
	},
	concat(...e) {
		return _t(this).concat(...e.map((e) => x(e) ? _t(e) : e));
	},
	entries() {
		return xt(this, "entries", (e) => (e[1] = yt(this, e[1]), e));
	},
	every(e, t) {
		return wt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return wt(this, "filter", e, t, (e) => e.map((e) => yt(this, e)), arguments);
	},
	find(e, t) {
		return wt(this, "find", e, t, (e) => yt(this, e), arguments);
	},
	findIndex(e, t) {
		return wt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return wt(this, "findLast", e, t, (e) => yt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return wt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return wt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Et(this, "includes", e);
	},
	indexOf(...e) {
		return Et(this, "indexOf", e);
	},
	join(e) {
		return _t(this).join(e);
	},
	lastIndexOf(...e) {
		return Et(this, "lastIndexOf", e);
	},
	map(e, t) {
		return wt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Dt(this, "pop");
	},
	push(...e) {
		return Dt(this, "push", e);
	},
	reduce(e, ...t) {
		return Tt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Tt(this, "reduceRight", e, t);
	},
	shift() {
		return Dt(this, "shift");
	},
	some(e, t) {
		return wt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Dt(this, "splice", e);
	},
	toReversed() {
		return _t(this).toReversed();
	},
	toSorted(e) {
		return _t(this).toSorted(e);
	},
	toSpliced(...e) {
		return _t(this).toSpliced(...e);
	},
	unshift(...e) {
		return Dt(this, "unshift", e);
	},
	values() {
		return xt(this, "values", (e) => yt(this, e));
	}
};
function xt(e, t, n) {
	let r = vt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ rn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => St(a.next(), n), i !== Ct[t] && Object.defineProperties(e, {
				return: { get() {
					let e = a.return;
					return typeof e == "function" ? e.bind(a) : e;
				} },
				throw: { get() {
					let e = a.throw;
					return typeof e == "function" ? e.bind(a) : e;
				} }
			}), e;
		}
		a._next = a.next, a.next = () => St(a._next(), n);
	}
	return a;
}
function St(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Ct = Array.prototype;
function wt(e, t, n, r, i, a) {
	let o = vt(e), s = o !== e && !/* @__PURE__ */ rn(e), c = o[t];
	if (c !== Ct[t]) {
		let t = c.apply(e, a);
		return s ? sn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, yt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Tt(e, t, n, r) {
	let i = vt(e), a = i !== e && !/* @__PURE__ */ rn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = yt(e, t)), n.call(this, t, yt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? yt(e, c) : c;
}
function Et(e, t, n) {
	let r = /* @__PURE__ */ j(e);
	ht(r, "iterate", mt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ an(n[0]) ? (n[0] = /* @__PURE__ */ j(n[0]), r[t](...n)) : i;
}
function Dt(e, t, n = []) {
	it(), Je();
	let r = (/* @__PURE__ */ j(e))[t].apply(e, n);
	return Ye(), at(), r;
}
var Ot = /* @__PURE__ */ u("__proto__,__v_isRef,__isVue"), kt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(E));
function At(e) {
	E(e) || (e = String(e));
	let t = /* @__PURE__ */ j(this);
	return ht(t, "has", e), t.hasOwnProperty(e);
}
var jt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Yt : Jt : i ? qt : Kt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = x(e);
		if (!r) {
			let e;
			if (a && (e = bt[t])) return e;
			if (t === "hasOwnProperty") return At;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ M(e) ? e : n);
		if ((E(t) ? kt.has(t) : Ot(t)) || (r || ht(e, "get", t), i)) return o;
		if (/* @__PURE__ */ M(o)) {
			let e = a && se(t) ? o : o.value;
			return r && D(e) ? /* @__PURE__ */ $t(e) : e;
		}
		return D(o) ? r ? /* @__PURE__ */ $t(o) : /* @__PURE__ */ Zt(o) : o;
	}
}, Mt = class extends jt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = x(e) && se(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ nn(i);
			if (!/* @__PURE__ */ rn(n) && !/* @__PURE__ */ nn(n) && (i = /* @__PURE__ */ j(i), n = /* @__PURE__ */ j(n)), !a && /* @__PURE__ */ M(i) && !/* @__PURE__ */ M(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : b(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ M(e) ? e : r);
		return e === /* @__PURE__ */ j(r) && s && (o ? ge(n, i) && gt(e, "set", t, n, i) : gt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = b(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && gt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!E(t) || !kt.has(t)) && ht(e, "has", t), n;
	}
	ownKeys(e) {
		return ht(e, "iterate", x(e) ? "length" : ft), Reflect.ownKeys(e);
	}
}, Nt = class extends jt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Pt = /* @__PURE__ */ new Mt(), Ft = /* @__PURE__ */ new Nt(), It = /* @__PURE__ */ new Mt(!0), Lt = (e) => e, Rt = (e) => Reflect.getPrototypeOf(e);
function zt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ j(i), o = S(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Lt : t ? cn : sn;
		return !t && ht(a, "iterate", c ? pt : ft), _(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Bt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Vt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ j(r), a = /* @__PURE__ */ j(n);
			e || (ge(n, a) && ht(i, "get", n), ht(i, "get", a));
			let { has: o } = Rt(i), s = t ? Lt : e ? cn : sn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && ht(/* @__PURE__ */ j(t), "iterate", ft), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ j(n), i = /* @__PURE__ */ j(t);
			return e || (ge(t, i) && ht(r, "has", t), ht(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ j(a), s = t ? Lt : e ? cn : sn;
			return !e && ht(o, "iterate", ft), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return _(n, e ? {
		add: Bt("add"),
		set: Bt("set"),
		delete: Bt("delete"),
		clear: Bt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ j(this), r = Rt(n), i = /* @__PURE__ */ j(e), a = !t && !/* @__PURE__ */ rn(e) && !/* @__PURE__ */ nn(e) ? i : e;
			return r.has.call(n, a) || ge(e, a) && r.has.call(n, e) || ge(i, a) && r.has.call(n, i) || (n.add(a), gt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ rn(n) && !/* @__PURE__ */ nn(n) && (n = /* @__PURE__ */ j(n));
			let r = /* @__PURE__ */ j(this), { has: i, get: a } = Rt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ j(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ge(n, s) && gt(r, "set", e, n, s) : gt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ j(this), { has: n, get: r } = Rt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ j(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && gt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ j(this), t = e.size !== 0, n = e.clear();
			return t && gt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = zt(r, e, t);
	}), n;
}
function Ht(e, t) {
	let n = Vt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(b(n, i) && i in r ? n : r, i, a);
}
var Ut = { get: /* @__PURE__ */ Ht(!1, !1) }, Wt = { get: /* @__PURE__ */ Ht(!1, !0) }, Gt = { get: /* @__PURE__ */ Ht(!0, !1) }, Kt = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap(), Yt = /* @__PURE__ */ new WeakMap();
function Xt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Zt(e) {
	return /* @__PURE__ */ nn(e) ? e : en(e, !1, Pt, Ut, Kt);
}
// @__NO_SIDE_EFFECTS__
function Qt(e) {
	return en(e, !1, It, Wt, qt);
}
// @__NO_SIDE_EFFECTS__
function $t(e) {
	return en(e, !0, Ft, Gt, Jt);
}
function en(e, t, n, r, i) {
	if (!D(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Xt(ae(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	return /* @__PURE__ */ nn(e) ? /* @__PURE__ */ tn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function nn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function an(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function j(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ j(t) : e;
}
function on(e) {
	return !b(e, "__v_skip") && Object.isExtensible(e) && ve(e, "__v_skip", !0), e;
}
var sn = (e) => D(e) ? /* @__PURE__ */ Zt(e) : e, cn = (e) => D(e) ? /* @__PURE__ */ $t(e) : e;
// @__NO_SIDE_EFFECTS__
function M(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return ln(e, !1);
}
function ln(e, t) {
	return /* @__PURE__ */ M(e) ? e : new un(e, t);
}
var un = class {
	constructor(e, t) {
		this.dep = new lt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ j(e), this._value = t ? e : sn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ rn(e) || /* @__PURE__ */ nn(e);
		e = n ? e : /* @__PURE__ */ j(e), ge(e, t) && (this._rawValue = e, this._value = n ? e : sn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ M(e) ? e.value : e;
}
var dn = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ M(i) && !/* @__PURE__ */ M(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function fn(e) {
	return /* @__PURE__ */ tn(e) ? e : new Proxy(e, dn);
}
var pn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new lt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function mn(e) {
	return new pn(e);
}
var hn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new lt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = st - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && A !== this) return qe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return $e(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function gn(e, t, n = !1) {
	let r, i;
	return w(e) ? r = e : (r = e.get, i = e.set), new hn(r, i, n);
}
var _n = {}, vn = /* @__PURE__ */ new WeakMap(), yn = void 0;
function bn(e, t = !1, n = yn) {
	if (n) {
		let t = vn.get(n);
		t || vn.set(n, t = []), t.push(e);
	}
}
function xn(e, t, n = d) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ rn(e) || i === !1 || i === 0 ? Sn(e, 1) : Sn(e), u, f, m, h, g = !1, _ = !1;
	if (/* @__PURE__ */ M(e) ? (f = () => e.value, g = /* @__PURE__ */ rn(e)) : /* @__PURE__ */ tn(e) ? (f = () => l(e), g = !0) : x(e) ? (_ = !0, g = e.some((e) => /* @__PURE__ */ tn(e) || /* @__PURE__ */ rn(e)), f = () => e.map((e) => {
		if (/* @__PURE__ */ M(e)) return e.value;
		if (/* @__PURE__ */ tn(e)) return l(e);
		if (w(e)) return c ? c(e, 2) : e();
	})) : f = w(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (m) {
			it();
			try {
				m();
			} finally {
				at();
			}
		}
		let t = yn;
		yn = u;
		try {
			return c ? c(e, 3, [h]) : e(h);
		} finally {
			yn = t;
		}
	} : p, t && i) {
		let e = f, t = i === !0 ? Infinity : i;
		f = () => Sn(e(), t);
	}
	let y = Ve(), b = () => {
		u.stop(), y && y.active && v(y.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				b();
			}
		};
	}
	let S = _ ? Array(e.length).fill(_n) : _n, C = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || g || (_ ? n.some((e, t) => ge(e, S[t])) : ge(n, S))) {
					let e = yn;
					it();
					try {
						m && m(), yn = u;
						let e = [
							n,
							S === _n ? void 0 : _ && S[0] === _n ? [] : S,
							h
						];
						S = n, c ? c(t, 3, e) : t(...e);
					} finally {
						yn = e, at();
					}
				}
			} else u.run();
		}
	};
	return s && s(C), u = new Ue(f), u.scheduler = o ? () => o(C, !1) : C, h = (e) => bn(e, !1, u), m = u.onStop = () => {
		let e = vn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			vn.delete(u);
		}
	}, t ? r ? C(!0) : S = u.run() : o ? o(C.bind(null, !0), !0) : u.run(), b.pause = u.pause.bind(u), b.resume = u.resume.bind(u), b.stop = b, b;
}
function Sn(e, t = Infinity, n) {
	if (t <= 0 || !D(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ M(e)) Sn(e.value, t, n);
	else if (x(e)) for (let r = 0; r < e.length; r++) Sn(e[r], t, n);
	else if (C(e) || S(e)) e.forEach((e) => {
		Sn(e, t, n);
	});
	else if (oe(e)) {
		for (let r in e) Sn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Sn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Cn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Tn(e, t, n);
	}
}
function wn(e, t, n, r) {
	if (w(e)) {
		let i = Cn(e, t, n, r);
		return i && ne(i) && i.catch((e) => {
			Tn(e, t, n);
		}), i;
	}
	if (x(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(wn(e[a], t, n, r));
		return i;
	}
}
function Tn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || d;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			it(), Cn(a, null, 10, [
				e,
				i,
				o
			]), at();
			return;
		}
	}
	En(e, n, i, r, o);
}
function En(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Dn = [], On = -1, kn = [], An = null, jn = 0, Mn = /* @__PURE__ */ Promise.resolve(), Nn = null;
function Pn(e) {
	let t = Nn || Mn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Fn(e) {
	let t = On + 1, n = Dn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Dn[r], a = Un(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function In(e) {
	if (!(e.flags & 1)) {
		let t = Un(e), n = Dn[Dn.length - 1];
		!n || !(e.flags & 2) && t >= Un(n) ? Dn.push(e) : Dn.splice(Fn(t), 0, e), e.flags |= 1, Ln();
	}
}
function Ln() {
	Nn ||= Mn.then(Wn);
}
function Rn(e) {
	if (!x(e)) An && e.id === -1 ? An.splice(jn + 1, 0, e) : e.flags & 1 || (kn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) kn.push(e[t]);
	Ln();
}
function zn(e, t, n, r = On + 1) {
	for (; r < Dn.length; r++) {
		let n = Dn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Dn.splice(r, 1), r = e ? r - 1 : On, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Bn(e, t, n = 0) {
	if (kn.length) {
		let e = kn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < kn.length; i++) {
				let a = kn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? kn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Un(e) - Un(t));
		if (kn.length = r, An) {
			for (let e = 0; e < i.length; e++) An.push(i[e]);
			return;
		}
		for (An = i, jn = 0; jn < An.length; jn++) {
			let e = An[jn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		An = null, jn = 0;
	}
}
var Vn = !1;
function Hn(e, t) {
	if (Vn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(kn);
	e(), Vn = !0;
	try {
		zn(void 0, t), Bn(void 0, n, t);
	} finally {
		Vn = !1;
	}
}
var Un = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Wn(e) {
	try {
		for (On = 0; On < Dn.length; On++) {
			let e = Dn[On];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Cn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; On < Dn.length; On++) {
			let e = Dn[On];
			e && (e.flags &= -2);
		}
		On = -1, Dn.length = 0, Bn(e), Nn = null, (Dn.length || kn.length) && Wn(e);
	}
}
var Gn = null, Kn = null;
function qn(e) {
	let t = Gn;
	return Gn = e, Kn = e && e.type.__scopeId || null, t;
}
function F(e, t = Gn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Yi(-1);
		let i = qn(t), a = Gi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Gi.length; e > a; e--) qi();
			qn(i), r._d && Yi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Jn(e, t) {
	if (Gn === null) return e;
	let n = Oa(Gn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = d] = t[e];
		i && (w(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Sn(a), r.push({
			dir: i,
			instance: n,
			value: a,
			oldValue: void 0,
			arg: o,
			modifiers: s
		}));
	}
	return e;
}
function Yn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (it(), wn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), at());
	}
}
function Xn(e, t, n = !1) {
	let r = ha();
	if (r || Qr) {
		let i = Qr ? Qr._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && w(t) ? t.call(r && r.proxy) : t;
	}
}
var Zn = /* @__PURE__ */ Symbol.for("v-scx"), Qn = () => Xn(Zn);
function $n(e, t) {
	return nr(e, null, t);
}
function er(e, t) {
	return nr(e, null, { flush: "sync" });
}
function tr(e, t, n) {
	return nr(e, t, n);
}
function nr(e, t, n = d) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = _({}, n), c = t && r || !t && a !== "post", l;
	if (xa) {
		if (a === "sync") {
			let e = Qn();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = p, e.resume = p, e.pause = p, e;
		}
	}
	let u = ma;
	s.call = (e, t, n) => wn(e, u, t, n);
	let f = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, ki(e, u && u.suspense);
	} : a !== "sync" && (f = !0, s.scheduler = (e, t) => {
		t ? e() : In(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), f && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let m = xn(e, t, s);
	return xa && (l ? l.push(m) : c && m()), m;
}
var rr = /* @__PURE__ */ Symbol("_vte"), ir = (e) => e.__isTeleport, ar = /* @__PURE__ */ Symbol("_leaveCb"), or = /* @__PURE__ */ Symbol("_enterCb");
function sr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Nr(() => {
		e.isMounted = !0;
	}), Fr(() => {
		e.isUnmounting = !0;
	}), e;
}
var cr = [Function, Array], lr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: cr,
	onEnter: cr,
	onAfterEnter: cr,
	onEnterCancelled: cr,
	onBeforeLeave: cr,
	onLeave: cr,
	onAfterLeave: cr,
	onLeaveCancelled: cr,
	onBeforeAppear: cr,
	onAppear: cr,
	onAfterAppear: cr,
	onAppearCancelled: cr
}, ur = {
	name: "BaseTransition",
	props: lr,
	setup(e, { slots: t }) {
		let n = ha(), r = sr();
		return () => {
			let i = t.default && vr(t.default(), !0), a = i && i.length ? dr(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ j(e), { mode: s } = o;
			if (r.isLeaving) return hr(a);
			let c = gr(a);
			if (!c) return hr(a);
			let l = mr(c, o, r, n, (e) => l = e);
			c.type !== Ui && _r(c, l);
			let u = n.subTree && gr(n.subTree);
			if (u && u.type !== Ui && !Qi(u, c) && yr(n.subTree)) {
				let e = mr(u, o, r, n);
				if (_r(u, e), s === "out-in" && c.type !== Ui) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, hr(a);
				s === "in-out" && c.type !== Ui ? e.delayLeave = (e, t, n) => {
					let i = pr(r, u);
					i[String(u.key)] = u, e[ar] = () => {
						t(), e[ar] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function dr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ui) {
			t = n;
			break;
		}
	}
	return t;
}
var fr = ur;
function pr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function mr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), S = pr(n, e), C = (e, t) => {
		e && wn(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		C(e, t), x(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, te = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[ar] && t[ar](!0);
			let i = S[b];
			if (i && Qi(e, i)) {
				let e = i.el[ar];
				if (!e) {
					let t = yr(i);
					e = t && t.el[ar];
				}
				e && e();
			}
			C(r, [t]);
		},
		enter(t) {
			if (S[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) {
				if (a) r = _ || l, i = v || u, o = y || d;
				else return;
			}
			let s = !1;
			t[or] = (e) => {
				s || (s = !0, C(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[or] = void 0);
			};
			let c = t[or].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[or] && t[or](!0), n.isUnmounting) return r();
			C(f, [t]);
			let a = !1;
			t[ar] = (n) => {
				a || (a = !0, r(), C(n ? h : m, [t]), t[ar] = void 0, S[i] === e && delete S[i]);
			};
			let o = t[ar].bind(null, !1);
			S[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = mr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return te;
}
function hr(e) {
	if (Er(e)) return e = ra(e), e.children = null, e;
}
function gr(e) {
	if (!Er(e)) return ir(e.type) && e.children ? dr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && w(n.default)) return n.default();
	}
}
function _r(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		_r(ir(n.type) && gr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && x(e.children)) {
		let n = ai(e.children, !1);
		n && _r(n, t);
	}
}
function vr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(vr(o.children, t, s))) : (t || o.type !== Ui) && r.push(s == null ? o : ra(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function yr(e) {
	if (e.component) return yr(e.component.subTree);
	if (e.type === R) {
		let t = x(e.children) && ai(e.children, !1);
		return t ? yr(t) : void 0;
	}
	if (e.type !== Ui) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return w(e) ? /* @__PURE__ */ _({ name: e.name }, t, { setup: e }) : e;
}
function br(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function xr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Sr = /* @__PURE__ */ new WeakMap();
function Cr(e, t, n, r, i = !1) {
	if (x(e)) {
		e.forEach((e, a) => Cr(e, t && (x(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Tr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Cr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Oa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === d ? s.refs = {} : s.refs, f = s.setupState, p = /* @__PURE__ */ j(f), h = f === d ? m : (e) => !xr(u, e) && b(p, e), g = (e, t) => !(t && xr(u, t));
	if (l != null && l !== c) {
		if (wr(t), T(l)) u[l] = null, h(l) && (f[l] = null);
		else if (/* @__PURE__ */ M(l)) {
			let e = t;
			g(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (w(c)) Cn(c, s, 12, [o, u]);
	else {
		let t = T(c), r = /* @__PURE__ */ M(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? h(c) ? f[c] : u[c] : g(c) || !e.k ? c.value : u[e.k];
					if (i) x(n) && v(n, a);
					else if (x(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], h(c) && (f[c] = u[c]);
					else {
						let t = [a];
						g(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, h(c) && (f[c] = o)) : r && (g(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Sr.delete(e);
				};
				t.id = -1, Sr.set(e, t), ki(t, n);
			} else wr(e), s();
		}
	}
}
function wr(e) {
	let t = Sr.get(e);
	t && (t.flags |= 8, Sr.delete(e));
}
Se().requestIdleCallback, Se().cancelIdleCallback;
var Tr = (e) => !!e.type.__asyncLoader, Er = (e) => e.type.__isKeepAlive, Dr = {
	name: "KeepAlive",
	__isKeepAlive: !0,
	props: {
		include: [
			String,
			RegExp,
			Array
		],
		exclude: [
			String,
			RegExp,
			Array
		],
		max: [String, Number]
	},
	setup(e, { slots: t }) {
		let n = ha(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), ki(() => {
				a.isDeactivated = !1, a.a && _e(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && la(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Ri(t.m), Ri(t.a), l(e, f, null, 1, s), ki(() => {
				t.da && _e(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && la(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			kr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = ka(Tr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !Qi(t, o)) ? p(t) : o && (kr(o), t && kr(t)), i.delete(e), a.delete(e);
		}
		tr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Or(e, t)), t && m((e) => !Or(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Bi(n.subTree.type) ? ki(() => {
				let e = Ar(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Ar(n.subTree)));
		};
		return Nr(_), Pr(_), Fr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Ar(t);
				if (e.type === i.type && e.key === i.key) {
					kr(i);
					let e = i.component.da;
					e && ki(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!Zi(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Ar(r);
			if (s.type === Ui) return o = null, s;
			let c = s.type, l = ka(Tr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Or(u, l)) || d && l && Or(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = ra(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && _r(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Bi(r.type) ? r : s;
		};
	}
};
function Or(e, t) {
	return x(e) ? e.some((e) => Or(e, t)) : T(e) ? e.split(",").includes(t) : te(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function kr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Ar(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function jr(e, t, n = ma, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			it();
			let i = va(n), a = wn(t, n, e, r);
			return i(), at(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Mr = (e) => (t, n = ma) => {
	(!xa || e === "sp") && jr(e, (...e) => t(...e), n);
}, Nr = Mr("m"), Pr = Mr("u"), Fr = Mr("bum"), Ir = "components", Lr = /* @__PURE__ */ Symbol.for("v-ndc");
function Rr(e) {
	return T(e) ? zr(Ir, e, !1) || e : e || Lr;
}
function zr(e, t, n = !0, r = !1) {
	let i = Gn || ma;
	if (i) {
		let n = i.type;
		if (e === Ir) {
			let e = ka(n, !1);
			if (e && (e === t || e === de(t) || e === me(de(t)))) return n;
		}
		let a = Br(i[e] || n[e], t) || Br(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Br(e, t) {
	return e && (e[t] || e[de(t)] || e[me(de(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = x(e);
	if (o || T(e)) {
		let n = o && /* @__PURE__ */ tn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ rn(e), s = /* @__PURE__ */ nn(e), e = vt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? cn(sn(e[n])) : sn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (D(e)) {
		if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
		else {
			let n = Object.keys(e);
			i = Array(n.length);
			for (let r = 0, o = n.length; r < o; r++) {
				let o = n[r];
				i[r] = t(e[o], o, r, a && a[r]);
			}
		}
	} else i = [];
	return n && (n[r] = i), i;
}
function Vr(e, t, n, r, i, a) {
	if (n ??= {}, Gn.ce || Gn.parent && Tr(Gn.parent) && Gn.parent.ce) {
		let e = a != null && n.key == null ? _({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Gi.length;
	z();
	let c;
	try {
		let i = o && Hr(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !E(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Gi.length; e > s; e--) qi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Hr(e) {
	return e.some((e) => !Zi(e) || !(e.type === Ui || e.type === R && !Hr(e.children))) ? e : null;
}
var Ur = (e) => e ? ba(e) ? Oa(e) : Ur(e.parent) : null, Wr = /* @__PURE__ */ _(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Ur(e.parent),
	$root: (e) => Ur(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		In(e.update);
	},
	$nextTick: (e) => e.n ||= Pn.bind(e.proxy),
	$watch: (e) => p
}), Gr = (e, t) => e !== d && !e.__isScriptSetup && b(e, t), Kr = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
		if (t[0] !== "$") {
			let e = o[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (Gr(r, t)) return o[t] = 1, r[t];
			else if (b(a, t)) return o[t] = 3, a[t];
			else if (n !== d && b(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Wr[t], u, f;
		if (l) return t === "$attrs" && ht(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== d && b(n, t)) return o[t] = 4, n[t];
		if (f = c.config.globalProperties, b(f, t)) return f[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Gr(i, t) ? (i[t] = n, !0) : b(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Gr(t, s) || b(a, s) || b(r, s) || b(Wr, s) || b(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? b(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function qr(e) {
	return x(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Jr(e, t) {
	return !e || !t ? e || t : x(e) && x(t) ? e.concat(t) : _({}, qr(e), qr(t));
}
function Yr() {
	return {
		app: null,
		config: {
			isNativeTag: m,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Xr = 0;
function Zr(e, t) {
	return function(n, r = null) {
		w(n) || (n = _({}, n)), r != null && !D(r) && (r = null);
		let i = Yr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Xr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ma,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && w(e.install) ? (a.add(e), e.install(c, ...t)) : w(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || U(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Oa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (wn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = Qr;
				Qr = c;
				try {
					return e();
				} finally {
					Qr = t;
				}
			}
		};
		return c;
	};
}
var Qr = null;
function $r(e, t, n = d) {
	let r = ha(), i = de(t), a = pe(t), o = ei(e, i), s = mn((o, s) => {
		let c, l = d, u;
		return er(() => {
			let t = e[i];
			ge(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!ge(o, c) && !(l !== d && ge(e, l))) return;
				let f = r.vnode.props, p = !!(f && (t in f || i in f || a in f) && (`onUpdate:${t}` in f || `onUpdate:${i}` in f || `onUpdate:${a}` in f));
				p || (c = e, s()), r.emit(`update:${t}`, o), ge(e, l) && (ge(e, o) && !ge(o, u) || p && l !== d && !ge(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || d : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var ei = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${de(t)}Modifiers`] || e[`${pe(t)}Modifiers`];
function ti(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || d, i = n, a = t.startsWith("update:"), o = a && ei(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => T(e) ? e.trim() : e)), o.number && (i = i.map(ye)));
	let s, c = r[s = he(t)] || r[s = he(de(t))];
	!c && a && (c = r[s = he(pe(t))]), c && wn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, wn(l, e, 6, i);
	}
}
function ni(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (x(a) ? a.forEach((e) => o[e] = null) : _(o, a), D(e) && r.set(e, o), o) : (D(e) && r.set(e, null), null);
}
function ri(e, t) {
	return !e || !h(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), b(e, t[0].toLowerCase() + t.slice(1)) || b(e, pe(t)) || b(e, t));
}
function ii(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, _ = qn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = aa(l.call(t, e, u, d, p, f, m)), y = s;
		} else {
			let e = t;
			v = aa(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), y = t.props ? s : oi(s);
		}
	} catch (t) {
		Gi.length = 0, Tn(t, e, 1), v = U(Ui);
	}
	let b = v;
	if (y && h !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(g) && (y = si(y, a)), b = ra(b, y, !1, !0));
	}
	return n.dirs && (b = ra(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && _r(ir(b.type) && gr(b) || b, n.transition), v = b, qn(_), v;
}
function ai(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Zi(r)) {
			if (r.type !== Ui || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var oi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || h(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, si = (e, t) => {
	let n = {};
	for (let r in e) (!g(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function ci(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? li(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (ui(o, r, n) && !ri(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || li(r, o, l) : !!o;
	return !1;
}
function li(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!b(e, a) || ui(t, e, a) && !ri(n, a)) return !0;
	}
	return !1;
}
function ui(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && D(r) && D(i) ? !Pe(r, i) : r !== i;
}
function di({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var fi = {}, pi = () => Object.create(fi), mi = (e) => Object.getPrototypeOf(e) === fi;
function hi(e, t, n, r = !1) {
	let i = {}, a = pi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), _i(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ Qt(i) : e.type.props ? i : a, e.attrs = a;
}
function gi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ j(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ri(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (b(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = de(o);
						i[t] = vi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		_i(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !b(t, a) && ((r = pe(a)) === a || !b(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = vi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !b(t, e)) && (delete a[e], l = !0);
	}
	l && gt(e.attrs, "set", "");
}
function _i(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ce(c)) continue;
		let l = t[c], u;
		i && b(i, u = de(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : ri(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ j(n), r = s || d;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = vi(i, t, s, r[s], e, !b(r, s));
		}
	}
	return o;
}
function vi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = b(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && w(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = va(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === pe(n)) && (r = !0));
	}
	return r;
}
function yi(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return D(e) && r.set(e, f), f;
	if (x(a)) for (let e = 0; e < a.length; e++) {
		let t = de(a[e]);
		bi(t) && (o[t] = d);
	}
	else if (a) for (let e in a) {
		let t = de(e);
		if (bi(t)) {
			let n = a[e], r = o[t] = x(n) || w(n) ? { type: n } : _({}, n), i = r.type, c = !1, l = !0;
			if (x(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = w(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = w(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || b(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return D(e) && r.set(e, c), c;
}
function bi(e) {
	return e[0] !== "$" && !ce(e);
}
var xi = (e) => e === "_" || e === "_ctx" || e === "$stable", Si = (e) => x(e) ? e.map(aa) : [aa(e)], Ci = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Si(t(...e)), n);
	return r._c = !1, r;
}, wi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (xi(n)) continue;
		let i = e[n];
		if (w(i)) t[n] = Ci(n, i, r);
		else if (i != null) {
			let e = Si(i);
			t[n] = () => e;
		}
	}
}, Ti = (e, t) => {
	let n = Si(t);
	e.slots.default = () => n;
}, Ei = (e, t, n) => {
	for (let r in t) (n || !xi(r)) && (e[r] = t[r]);
}, Di = (e, t, n) => {
	let r = e.slots = pi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ei(r, t, n), n && ve(r, "_", e, !0)) : wi(t, r);
	} else t && Ti(e, t);
}, Oi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = d;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ei(i, t, n) : (a = !t.$stable, wi(t, i)), o = t;
	} else t && (Ti(e, t), o = { default: 1 });
	if (a) for (let e in i) !xi(e) && o[e] == null && delete i[e];
}, ki = Vi;
function Ai(e) {
	return ji(e);
}
function ji(e, t) {
	let n = Se();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: m, nextSibling: h, setScopeId: g = p, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Qi(e, t) && (r = be(e), me(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === f && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Hi:
				y(e, t, n, r);
				break;
			case Ui:
				b(e, t, n, r);
				break;
			case Wi:
				e ?? x(t, n, r, o);
				break;
			case R:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? ee(e, t, n, r, i, a, o, s, c) : d & 6 ? ie(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, Ce);
		}
		u != null && i ? Cr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Cr(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = h(e), r(e, n, i), e = a;
		r(t, n, i);
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, ee = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), E(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && T(e.children, f, null, i, s, Mi(e, c), l, d), _ && Yn(e, null, i, "created"), w(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ce(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && la(p, i, e);
		}
		_ && Yn(e, null, i, "beforeMount");
		let v = Pi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && ki(() => {
			try {
				p && la(p, i, e), v && g.enter(f), _ && Yn(e, null, i, "mounted");
			} finally {}
		}, s);
	}, w = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Bi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				w(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? oa(e[l]) : aa(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, E = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: f, dirs: p } = t;
		l |= e.patchFlag & 16;
		let m = e.props || d, h = t.props || d, g;
		if (n && Ni(n, !1), (g = h.onVnodeBeforeUpdate) && la(g, n, t, e), p && Yn(t, e, n, "beforeUpdate"), n && Ni(n, !0), f && (!e.dynamicChildren || e.dynamicChildren.length !== f.length) && (l = 0, s = !1, f = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && u(c, ""), f ? D(e.dynamicChildren, f, c, n, r, Mi(t, i), o) : s || ue(e, t, c, null, n, r, Mi(t, i), o, !1), l > 0) {
			if (l & 16) ne(c, m, h, n, i);
			else if (l & 2 && m.class !== h.class && a(c, "class", null, h.class, i), l & 4 && a(c, "style", m.style, h.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = m[r], s = h[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && f == null && ne(c, m, h, n, i);
		((g = h.onVnodeUpdated) || p) && ki(() => {
			g && la(g, n, t, e), p && Yn(t, e, n, "updated");
		}, r);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || zi(c), d = u && (c.type === R || !Qi(c, l) || c.shapeFlag & 198) ? m(u) : n;
			v(c, l, d, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== d) for (let o in t) !ce(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ce(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), T(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Fi(e, t, !0)) : ue(e, t, n, f, a, o, c, l, u);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : oe(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = pa(e, r, i);
		if (Er(e) && (s.ctx.renderer = Ce), Sa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = U(Ui);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (ci(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Li(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							ki(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				Ni(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && _e(n), (d = t.props && t.props.onVnodeBeforeUpdate) && la(d, s, t, c), Ni(e, !0);
				let f = ii(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), be(p), e, i, a), t.el = f.el, u === null && di(e, f.el), r && ki(r, i), (d = t.props && t.props.onVnodeUpdated) && ki(() => la(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Tr(t);
				if (Ni(e, !1), l && _e(l), !m && (o = c && c.onVnodeBeforeMount) && la(o, d, t), Ni(e, !0), s && Te) {
					let t = () => {
						e.subTree = ii(e), Te(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ii(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && ki(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					ki(() => la(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Tr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && ki(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ue(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => In(u), Ni(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, gi(e, t.props, r, n), Oi(e, t.children, n), it(), zn(e), at();
	}, ue = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				fe(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				de(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && ye(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? fe(l, f, n, r, i, a, o, s, c) : ye(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && T(f, n, r, i, a, o, s, c));
	}, de = (e, t, n, r, i, a, o, s, c) => {
		e ||= f, t ||= f;
		let l = e.length, u = t.length, d = Math.min(l, u), p = 0;
		for (; p < d; p++) {
			let r = t[p] = c ? oa(t[p]) : aa(t[p]);
			v(e[p], r, n, null, i, a, o, s, c);
		}
		l > u ? ye(e, i, a, !0, !1, d) : T(t, n, r, i, a, o, s, c, d);
	}, fe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, p = u - 1;
		for (; l <= d && l <= p;) {
			let r = e[l], u = t[l] = c ? oa(t[l]) : aa(t[l]);
			if (Qi(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= p;) {
			let r = e[d], l = t[p] = c ? oa(t[p]) : aa(t[p]);
			if (Qi(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			d--, p--;
		}
		if (l > d) {
			if (l <= p) {
				let e = p + 1, d = e < u ? t[e].el : r;
				for (; l <= p;) v(null, t[l] = c ? oa(t[l]) : aa(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > p) for (; l <= d;) me(e[l], i, a, !0), l++;
		else {
			let m = l, h = l, g = /* @__PURE__ */ new Map();
			for (l = h; l <= p; l++) {
				let e = t[l] = c ? oa(t[l]) : aa(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, y = 0, b = p - h + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = m; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					me(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = h; _ <= p; _++) if (C[_ - h] === 0 && Qi(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? me(r, i, a, !0) : (C[u - h] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let ee = x ? Ii(C) : f;
			for (_ = ee.length - 1, l = b - 1; l >= 0; l--) {
				let e = h + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || zi(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== ee[_] ? pe(d, n, p, 2) : _--);
			}
		}
	}, pe = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) pe(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, Ce);
		else if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) pe(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Wi) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[ar] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), ki(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[ar];
					s._isLeaving && s[ar](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, me = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (it(), Cr(s, null, n, e, !0), at()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Tr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && la(_, t, e), u & 6) ve(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Yn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, Ce, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? ye(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && ye(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && ki(() => {
			_ && la(_, t, e), h && Yn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			ge(n, r);
			return;
		}
		if (t === Wi) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? yr(e) : e, c = () => {
			o ? m(n) && ge(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), i(e), e = n;
		i(t);
	}, ve = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Ri(c), Ri(l), r && _e(r), i.stop(), a ? (a.flags |= 8, me(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, me(o, e, t, n)), s && ki(s, t), ki(() => {
			e.isUnmounted = !0;
		}, t);
	}, ye = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) me(e[o], t, n, r, i);
	}, be = (e) => {
		if (e.shapeFlag & 6) return be(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[rr];
		return n ? h(n) : t;
	}, xe = (e, t, n) => {
		Hn(() => {
			e == null ? t._vnode && me(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : fa());
	}, Ce = {
		p: v,
		um: me,
		m: pe,
		r: he,
		mt: ae,
		mc: T,
		pc: ue,
		pbc: D,
		n: be,
		o: e
	}, we, Te;
	return t && ([we, Te] = t(Ce)), {
		render: xe,
		hydrate: we,
		createApp: Zr(xe, we)
	};
}
function Mi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ni({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Pi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Fi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (x(r) && x(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = oa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Fi(t, a)), a.type === Hi && (a.patchFlag === -1 && (a = i[e] = oa(a)), a.el = t.el), a.type === Ui && !a.el && (a.el = t.el);
	}
}
function Ii(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function Li(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Li(t);
}
function Ri(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function zi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? zi(t.subTree) : null;
}
var Bi = (e) => e.__isSuspense;
function Vi(e, t) {
	t && t.pendingBranch ? x(e) ? t.effects.push(...e) : t.effects.push(e) : Rn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Hi = /* @__PURE__ */ Symbol.for("v-txt"), Ui = /* @__PURE__ */ Symbol.for("v-cmt"), Wi = /* @__PURE__ */ Symbol.for("v-stc"), Gi = [], Ki = null;
function z(e = !1) {
	Gi.push(Ki = e ? null : []);
}
function qi() {
	Gi.pop(), Ki = Gi[Gi.length - 1] || null;
}
var Ji = 1;
function Yi(e, t = !1) {
	Ji += e, e < 0 && Ki && t && (Ki.hasOnce = !0);
}
function Xi(e) {
	return e.dynamicChildren = Ji > 0 ? Ki || f : null, qi(), Ji > 0 && Ki && Ki.push(e), e;
}
function B(e, t, n, r, i, a) {
	return Xi(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return Xi(U(e, t, n, r, i, !0));
}
function Zi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Qi(e, t) {
	return e.type === t.type && e.key === t.key;
}
var $i = ({ key: e }) => e ?? null, ea = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : T(e) || /* @__PURE__ */ M(e) || w(e) ? {
	i: Gn,
	r: e,
	k: t,
	f: !!n
} : e);
function H(e, t = null, n = null, r = 0, i = null, a = e === R ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && $i(t),
		ref: t && ea(t),
		scopeId: Kn,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Gn
	};
	return s ? (sa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= T(n) ? 8 : 16), Ji > 0 && !o && Ki && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Ki.push(c), c;
}
var U = ta;
function ta(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Lr) && (e = Ui), Zi(e)) {
		let r = ra(e, t, !0);
		return n && sa(r, n), Ji > 0 && !a && Ki && (r.shapeFlag & 6 ? Ki[Ki.indexOf(e)] = r : Ki.push(r)), r.patchFlag = -2, r;
	}
	if (Aa(e) && (e = e.__vccOpts), t) {
		t = na(t);
		let { class: e, style: n } = t;
		e && !T(e) && (t.class = O(e)), D(n) && (/* @__PURE__ */ an(n) && !x(n) && (n = _({}, n)), t.style = Ce(n));
	}
	let o = T(e) ? 1 : Bi(e) ? 128 : ir(e) ? 64 : D(e) ? 4 : w(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function na(e) {
	return e ? /* @__PURE__ */ an(e) || mi(e) ? _({}, e) : e : null;
}
function ra(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ca(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && $i(l),
		ref: t && t.ref ? n && a ? x(a) ? a.concat(ea(t)) : [a, ea(t)] : ea(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== R ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ra(e.ssContent),
		ssFallback: e.ssFallback && ra(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && _r(u, c.clone(u)), u;
}
function ia(e = " ", t = 0) {
	return U(Hi, null, e, t);
}
function W(e = "", t = !1) {
	return t ? (z(), V(Ui, null, e)) : U(Ui, null, e);
}
function aa(e) {
	return e == null || typeof e == "boolean" ? U(Ui) : x(e) ? U(R, null, e.slice()) : Zi(e) ? oa(e) : U(Hi, null, String(e));
}
function oa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ra(e);
}
function sa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (x(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), sa(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !mi(t) ? t._ctx = Gn : r === 3 && Gn && (Gn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (w(t)) {
		if (r & 65) {
			sa(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Gn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ia(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ca(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = O([t.class, r.class]));
		else if (e === "style") t.style = Ce([t.style, r.style]);
		else if (h(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(x(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !g(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function la(e, t, n, r = null) {
	wn(e, t, 7, [n, r]);
}
var ua = Yr(), da = 0;
function fa() {
	return da;
}
function pa(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || ua, a = {
		uid: da++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Be(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: yi(r, i),
		emitsOptions: ni(r, i),
		emit: null,
		emitted: null,
		propsDefaults: d,
		inheritAttrs: r.inheritAttrs,
		ctx: d,
		data: d,
		props: d,
		attrs: d,
		slots: d,
		refs: d,
		setupState: d,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ti.bind(null, a), e.ce && e.ce(a), a;
}
var ma = null, ha = () => ma || Gn, ga, _a;
{
	let e = Se(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ga = t("__VUE_INSTANCE_SETTERS__", (e) => ma = e), _a = t("__VUE_SSR_SETTERS__", (e) => xa = e);
}
var va = (e) => {
	let t = ma;
	return ga(e), e.scope.on(), () => {
		e.scope.off(), ga(t);
	};
}, ya = () => {
	ma && ma.scope.off(), ga(null);
};
function ba(e) {
	return e.vnode.shapeFlag & 4;
}
var xa = !1;
function Sa(e, t = !1, n = !1) {
	t && _a(t);
	let { props: r, children: i } = e.vnode, a = ba(e);
	hi(e, r, a, t), Di(e, i, n || t);
	let o = a ? Ca(e, t) : void 0;
	return t && _a(!1), o;
}
function Ca(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Kr);
	let { setup: r } = n;
	if (r) {
		it();
		let n = e.setupContext = r.length > 1 ? Da(e) : null, i = va(e), a = Cn(r, e, 0, [e.props, n]), o = ne(a);
		if (at(), i(), (o || e.sp) && !Tr(e) && br(e), o) {
			if (a.then(ya, ya), t) return a.then((n) => {
				_a(!0);
				try {
					wa(e, n, t);
				} finally {
					_a(!1);
				}
			}).catch((t) => {
				Tn(t, e, 0);
			});
			e.asyncDep = a;
		} else wa(e, a, t);
	} else Ta(e, t);
}
function wa(e, t, n) {
	w(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : D(t) && (e.setupState = fn(t)), Ta(e, n);
}
function Ta(e, t, n) {
	let r = e.type;
	e.render ||= r.render || p;
}
var Ea = { get(e, t) {
	return ht(e, "get", ""), e[t];
} };
function Da(e) {
	return {
		attrs: new Proxy(e.attrs, Ea),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Oa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(fn(on(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Wr) return Wr[n](e);
		},
		has(e, t) {
			return t in e || t in Wr;
		}
	}) : e.proxy;
}
function ka(e, t = !0) {
	return w(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Aa(e) {
	return w(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ gn(e, t, xa);
function ja(e, t, n) {
	try {
		Yi(-1);
		let r = arguments.length;
		return r === 2 ? D(t) && !x(t) ? Zi(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Zi(n) && (n = [n]), U(e, t, n));
	} finally {
		Yi(1);
	}
}
var Ma = "3.5.44", Na = void 0, Pa = typeof window < "u" && window.trustedTypes;
if (Pa) try {
	Na = /* @__PURE__ */ Pa.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Fa = Na ? (e) => Na.createHTML(e) : (e) => e, Ia = "http://www.w3.org/2000/svg", La = "http://www.w3.org/1998/Math/MathML", Ra = typeof document < "u" ? document : null, za = Ra && /* @__PURE__ */ Ra.createElement("template"), Ba = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ra.createElementNS(Ia, e) : t === "mathml" ? Ra.createElementNS(La, e) : n ? Ra.createElement(e, { is: n }) : Ra.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ra.createTextNode(e),
	createComment: (e) => Ra.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ra.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			za.innerHTML = Fa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = za.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Va = "transition", Ha = "animation", Ua = /* @__PURE__ */ Symbol("_vtc"), Wa = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: !0
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
}, Ga = /* @__PURE__ */ _({}, lr, Wa), Ka = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Ga, e))((e, { slots: t }) => ja(fr, Ya(e), t)), qa = (e, t = []) => {
	x(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Ja = (e) => e ? x(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Ya(e) {
	let t = {};
	for (let n in e) n in Wa || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = Xa(i), h = m && m[0], g = m && m[1], { onBeforeEnter: v, onEnter: y, onEnterCancelled: b, onLeave: x, onLeaveCancelled: S, onBeforeAppear: C = v, onAppear: ee = y, onAppearCancelled: te = b } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, $a(e, t ? u : s), $a(e, t ? l : o), n && n();
	}, T = (e, t) => {
		e._isLeaving = !1, $a(e, d), $a(e, p), $a(e, f), t && t();
	}, E = (e) => (t, n) => {
		let i = e ? ee : y, o = () => w(t, e, n);
		qa(i, [t, o]), eo(() => {
			$a(t, e ? c : a), Qa(t, e ? u : s), Ja(i) || no(t, r, h, o);
		});
	};
	return _(t, {
		onBeforeEnter(e) {
			qa(v, [e]), Qa(e, a), Qa(e, o);
		},
		onBeforeAppear(e) {
			qa(C, [e]), Qa(e, c), Qa(e, l);
		},
		onEnter: E(!1),
		onAppear: E(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => T(e, t);
			Qa(e, d), e._enterCancelled ? (Qa(e, f), oo(e)) : (oo(e), Qa(e, f)), eo(() => {
				e._isLeaving && ($a(e, d), Qa(e, p), Ja(x) || no(e, r, g, n));
			}), qa(x, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), qa(b, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), qa(te, [e]);
		},
		onLeaveCancelled(e) {
			T(e), qa(S, [e]);
		}
	});
}
function Xa(e) {
	if (e == null) return null;
	if (D(e)) return [Za(e.enter), Za(e.leave)];
	{
		let t = Za(e);
		return [t, t];
	}
}
function Za(e) {
	return be(e);
}
function Qa(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ua] || (e[Ua] = /* @__PURE__ */ new Set())).add(t);
}
function $a(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ua];
	n && (n.delete(t), n.size || (e[Ua] = void 0));
}
function eo(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var to = 0;
function no(e, t, n, r) {
	let i = e._endId = ++to, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = ro(e, t);
	if (!o) return r();
	let l = o + "end", u = 0, d = () => {
		e.removeEventListener(l, f), a();
	}, f = (t) => {
		t.target === e && ++u >= c && d();
	};
	setTimeout(() => {
		u < c && d();
	}, s + 1), e.addEventListener(l, f);
}
function ro(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Va}Delay`), a = r(`${Va}Duration`), o = io(i, a), s = r(`${Ha}Delay`), c = r(`${Ha}Duration`), l = io(s, c), u = null, d = 0, f = 0;
	t === Va ? o > 0 && (u = Va, d = o, f = a.length) : t === Ha ? l > 0 && (u = Ha, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Va : Ha : null, f = u ? u === Va ? a.length : c.length : 0);
	let p = u === Va && /\b(?:transform|all)(?:,|$)/.test(r(`${Va}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function io(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => ao(t) + ao(e[n])));
}
function ao(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function oo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function so(e, t, n) {
	let r = e[Ua];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var co = /* @__PURE__ */ Symbol("_vod"), lo = /* @__PURE__ */ Symbol("_vsh"), uo = /* @__PURE__ */ Symbol(""), fo = /(?:^|;)\s*display\s*:/;
function po(e, t, n) {
	let r = e.style, i = T(n), a = !1;
	if (n && !i) {
		if (t) {
			if (T(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? ho(r, t, "");
			}
			else for (let e in t) n[e] ?? ho(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? ho(r, i, "") : yo(e, i, !T(t) && t ? t[i] : void 0, o) || ho(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[uo];
			e && (n += ";" + e), r.cssText = n, a = fo.test(n);
		}
	} else t && e.removeAttribute("style");
	co in e && ((!i || t !== n) && (e[co] = a ? r.display : ""), e[lo] && (r.display = "none"));
}
var mo = /\s*!important$/;
function ho(e, t, n) {
	if (x(n)) n.forEach((n) => ho(e, t, n));
	else if (n ??= "", t.startsWith("--")) mo.test(n) ? e.setProperty(t, n.replace(mo, ""), "important") : e.setProperty(t, n);
	else {
		let r = vo(e, t);
		mo.test(n) ? e.setProperty(pe(r), n.replace(mo, ""), "important") : e[r] = n;
	}
}
var go = [
	"Webkit",
	"Moz",
	"ms"
], _o = {};
function vo(e, t) {
	let n = _o[t];
	if (n) return n;
	let r = de(t);
	if (r !== "filter" && r in e) return _o[t] = r;
	r = me(r);
	for (let n = 0; n < go.length; n++) {
		let i = go[n] + r;
		if (i in e) return _o[t] = i;
	}
	return t;
}
function yo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && T(r) && n === r;
}
var bo = "http://www.w3.org/1999/xlink";
function xo(e, t, n, r, i, a = Oe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(bo, t.slice(6, t.length)) : e.setAttributeNS(bo, t, n) : n == null || a && !ke(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : E(n) ? String(n) : n);
}
function So(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Fa(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ke(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Co(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function wo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var To = /* @__PURE__ */ Symbol("_vei");
function Eo(e, t, n, r, i = null) {
	let a = e[To] || (e[To] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ko(t);
		r ? Co(e, n, a[t] = No(r, i), s) : o && (wo(e, n, o, s), a[t] = void 0);
	}
}
var Do = /(Once|Passive|Capture)$/, Oo = /^on:?(?:Once|Passive|Capture)$/;
function ko(e) {
	let t, n;
	for (; (n = e.match(Do)) && !Oo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : pe(e.slice(2)), t];
}
var Ao = 0, jo = /* @__PURE__ */ Promise.resolve(), Mo = () => Ao ||= (jo.then(() => Ao = 0), Date.now());
function No(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (x(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && wn(e, t, 5, a);
			}
		} else wn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Mo(), n;
}
var Po = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Fo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? so(e, r, o) : t === "style" ? po(e, n, r) : h(t) ? g(t) || Eo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Io(e, t, r, o)) ? (So(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && xo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Lo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !T(r))) ? So(e, de(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), xo(e, t, r, o));
};
function Io(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Po(t) && w(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Po(t) && T(n) ? !1 : t in e;
}
function Lo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = de(t);
	return Array.isArray(n) ? n.some((e) => de(e) === r) : Object.keys(n).some((e) => de(e) === r);
}
var Ro = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return x(t) ? (e) => _e(t, e) : t;
};
function zo(e) {
	e.target.composing = !0;
}
function Bo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Vo = /* @__PURE__ */ Symbol("_assign"), Ho = /* @__PURE__ */ Symbol("_initialValue");
function Uo(e, t, n) {
	return t && (e = e.trim()), n && (e = ye(e)), e;
}
var Wo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Ho] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Ho] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Vo] = Ro(i);
		let a = r || i.props && i.props.type === "number";
		Co(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Vo](Uo(e.value, n, a));
		}), (n || a) && Co(e, "change", () => {
			e.value = Uo(e.value, n, a);
		}), t || (Co(e, "compositionstart", zo), Co(e, "compositionend", Bo), Co(e, "change", Bo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Ho];
		delete e[Ho], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Vo](Uo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Vo] = Ro(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? ye(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Go = {
	deep: !0,
	created(e, t, n) {
		e[Vo] = Ro(n), Co(e, "change", () => {
			let t = e._modelValue, n = Xo(e), r = e.checked, i = e[Vo];
			if (x(t)) {
				let e = Fe(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (C(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(Zo(e, r));
		});
	},
	mounted: Ko,
	beforeUpdate(e, t, n) {
		e[Vo] = Ro(n), Ko(e, t, n);
	}
};
function Ko(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (x(t)) i = Fe(t, r.props.value) > -1;
	else if (C(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Pe(t, Zo(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var qo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Co(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? ye(Xo(e)) : Xo(e)), r = e.multiple, i = r ? C(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? x(i) ? t.slice() : t : i];
			try {
				e[Vo](i);
			} finally {
				Pn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Vo] = Ro(r);
	},
	mounted(e, { value: t }) {
		Yo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Vo] = Ro(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Jo(t, n[1], n[0])) && Yo(e, t);
	}
};
function Jo(e, t, n) {
	if (!n || x(e)) return Pe(e, t);
	if (C(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Yo(e, t) {
	let n = e.multiple, r = x(t);
	if (!n || r || C(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = Xo(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Fe(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Pe(Xo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function Xo(e) {
	return "_value" in e ? e._value : e.value;
}
function Zo(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var Qo = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], $o = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, t) => Qo.some((n) => e[`${n}Key`] && !t.includes(n))
}, es = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = $o[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ts = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ns = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = pe(n.key);
		if (t.some((e) => e === r || ts[e] === r)) return e(n);
	}));
}, rs = /* @__PURE__ */ _({ patchProp: Fo }, Ba), is;
function as() {
	return is ||= Ai(rs);
}
var os = ((...e) => {
	let t = as().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = cs(e);
		if (!r) return;
		let i = t._component;
		!w(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ss(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ss(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function cs(e) {
	return T(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var ls = () => ({
	formatVersion: 1,
	enabled: !0,
	presets: {},
	installed: {},
	sources: {},
	ui: { collapseStages: !0 },
	dev: {
		url: "http://localhost:4747",
		enabled: !1
	},
	debug: { keepRequests: 20 }
}), us = null;
function K() {
	if (us) return us;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = ls();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return us = /* @__PURE__ */ Zt(n), us;
}
var q = () => e().saveSettingsDebounced(), ds = "ap_submit_turn", fs = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
];
//#endregion
//#region packages/protocol/src/expr.ts
function ps(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function ms(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => ms(e, t));
		case "var": return t(e.path);
		case "not": return !ms(e.e, t);
		case "bin": {
			if (e.op === "&&") return !!ms(e.l, t) && !!ms(e.r, t);
			if (e.op === "||") return !!ms(e.l, t) || !!ms(e.r, t);
			let n = ms(e.l, t), r = ms(e.r, t);
			switch (e.op) {
				case "==": return ps(n, r);
				case "!=": return !ps(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => ps(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function hs(e, t) {
	return !e || !!ms(e, t);
}
//#endregion
//#region packages/protocol/src/macros.ts
var gs = /\{\{ap::([^{}]*?)\}\}/g;
function _s(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(gs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? _s(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function vs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ys(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function bs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = ys(n[3] ?? n[4] ?? "");
	return t;
}
function xs(e, t) {
	let n = [], r = RegExp(`<${vs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: bs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: bs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Ss(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Cs(e, t) {
	let n = xs(e, t)[0];
	return n ? ys(n.inner).trim() : void 0;
}
function ws(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Ts(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
var Es = (e) => e ? {
	type: "string",
	description: e
} : { type: "string" };
function Ds(e) {
	let t = e.description, n = (e) => t ? {
		...e,
		description: t
	} : e;
	switch (e.kind) {
		case "reply":
		case "impersonate": return n(Es());
		case "recap": return n({ type: ["string", "null"] });
		case "memory": return n({
			type: "array",
			items: {
				type: "object",
				properties: {
					scope: {
						type: "string",
						enum: ["memory", "global_memory"]
					},
					operation: {
						type: "string",
						enum: ["replace", "delete"]
					},
					key: Es(),
					content: { type: ["string", "null"] }
				},
				required: [
					"scope",
					"operation",
					"key",
					"content"
				],
				additionalProperties: !1
			}
		});
		case "synopsis": return n({
			type: "object",
			properties: {
				time: Es(),
				location: Es(),
				event: Es(),
				summary: Es()
			},
			required: [
				"time",
				"location",
				"event",
				"summary"
			],
			additionalProperties: !1
		});
		case "options": return n({
			type: "array",
			items: {
				type: "object",
				properties: {
					label: Es(),
					content: Es()
				},
				required: ["label", "content"],
				additionalProperties: !1
			},
			...e.count ? {
				minItems: e.count,
				maxItems: e.count
			} : {}
		});
		case "custom": return e.shape === "kv" ? n({
			type: "object",
			additionalProperties: { type: "string" }
		}) : n(Es());
	}
}
function Os(e) {
	return e === "memory" || e === "recap";
}
var ks = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function As(e, t, n) {
	if (t !== void 0) switch (e) {
		case "reply":
		case "impersonate": return ks(t).trim() || void 0;
		case "recap": return t === null ? null : ks(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = ks(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : ks(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: ks(e.time),
				location: ks(e.location),
				event: ks(e.event),
				summary: ks(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: ks(e.label ?? e.title).trim(),
			content: ks(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, ks(t)]));
			}
			return ks(t).trim() || void 0;
	}
}
function js(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "reply":
		case "impersonate": return As(e.kind, ys(n.inner));
		case "recap": return As("recap", ys(n.inner));
		case "memory": return As("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Cs(e.inner, "scope"),
			operation: Cs(e.inner, "operation"),
			key: Cs(e.inner, "key"),
			content: Cs(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Cs(n.inner, "time") ?? "",
			location: Cs(n.inner, "location") ?? "",
			event: Cs(n.inner, "event") ?? "",
			summary: Cs(n.inner, "summary") ?? ""
		};
		case "options": return xs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: ys(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = ys(t[2]).trim();
				return e;
			}
			return As("custom", ys(n.inner), e);
	}
}
function Ms(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		let t = xs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = js(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Ss(e, i),
		values: n,
		open: r
	};
}
function Ns(e) {
	return ys(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Ps = {
	type: "array",
	items: {
		type: "object",
		properties: {
			old_string: { type: "string" },
			new_string: { type: "string" }
		},
		required: ["old_string", "new_string"],
		additionalProperties: !1
	}
};
function Fs(e, t) {
	return e.stages.filter((e) => hs(e.when, t));
}
function Is(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function Ls(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = Is(t);
	return n >= 0 ? n : t.length - 1;
}
function Rs(e, t) {
	return `step${e.indexOf(t) + 1}_${t.actor}_${t.id}`;
}
function zs(e, t) {
	return `${e}${t.id}`;
}
function Bs(e, t) {
	let n = e.kind === "patch" ? { ...Ps } : { type: "string" };
	return t ? {
		...n,
		description: t
	} : n;
}
function Vs(e, t, n, r = {}) {
	let i = {}, a = [], o = Ls(e, t), s = () => {
		for (let e of n) i[e.field] = Ds(e), Os(e.kind) || a.push(e.field);
	};
	return t.forEach((e, n) => {
		let c = Rs(t, e);
		i[c] = Bs(e, r.stageDescriptions?.[e.id]), e.optional || a.push(c), n === o && s();
	}), o < 0 && s(), {
		type: "object",
		properties: i,
		required: a,
		additionalProperties: !1
	};
}
function Hs(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			description: t,
			parameters: n
		}
	};
}
function Us(e, t, n, r, i) {
	let a = Ls(e, t);
	return t.map((e, t) => {
		let o = {}, s = [];
		if (e.kind === "patch" ? (o.edits = Ps, s.push("edits")) : (o.content = { type: "string" }, s.push("content")), t === a) for (let e of n) o[e.field] = Ds(e), Os(e.kind) || s.push(e.field);
		return Hs(zs(r, e), i[e.id] ?? e.label, {
			type: "object",
			properties: o,
			required: s,
			additionalProperties: !1
		});
	});
}
function Ws(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function Gs(e) {
	return {
		stages: Object.fromEntries(e.map((e) => [e.id, { status: "pending" }])),
		structures: {},
		current: null,
		content: "",
		contentStarted: !1,
		openStructures: [],
		warnings: []
	};
}
function Ks(e, t, n = !0) {
	t.content = "";
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (r.kind !== "content") continue;
		let i = t.stages[r.id]?.text?.trim();
		if (i) {
			t.content = i;
			break;
		}
	}
	!n && t.content && (t.content = t.content.slice(0, t.content.length - ws(t.content)).trimEnd());
}
function qs(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Js(e) {
	return e.map((e) => ({
		old_string: Cs(e, "old_string") ?? "",
		new_string: Cs(e, "new_string") ?? ""
	}));
}
function Ys(e, t) {
	let n = Gs(t.stages), r = Ts(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${vs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Ms(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = xs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Js(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = ys(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Ss(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = Is(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: vs(t.trimEnd())
		})).filter((e) => e.re), i = e.length ? RegExp(`(^|\\n)[ \\t]*(${e.map((e) => e.re).join("|")})[ \\t]*`, "g") : null, a = [];
		if (i) {
			let t = 0, n = null;
			for (let o of r.matchAll(i)) {
				a.push({
					actor: n,
					text: r.slice(t, o.index)
				});
				let i = o[2];
				n = e.find((e) => RegExp(`^${e.re}$`).test(i))?.id ?? null, t = o.index + o[0].length;
			}
			a.push({
				actor: n,
				text: r.slice(t)
			});
		} else a.push({
			actor: null,
			text: r
		});
		let o = -1, c = !1, f = !1, p = (e, t) => {
			let r = n.stages[e.id];
			r.text = (r.text ? `${r.text}\n\n` : "") + t;
		}, m = (e) => t.contentMarker ? e.indexOf(t.contentMarker) : -1, h = d ? l.filter((e) => t.stages.indexOf(e) > u) : [];
		for (let e of a) {
			let r = e.text;
			if (!r.trim() && e.actor === null) continue;
			if (c) {
				let i = e.actor ? h.find((t) => t.actor === e.actor && l.indexOf(t) > o) : void 0;
				if (!i) {
					p(d, e.actor ? `${t.prefixes[e.actor]}${r}` : r);
					continue;
				}
				c = !1, o = l.indexOf(i), p(i, r), n.current = i.id;
				continue;
			}
			if (e.actor === null) o < 0 && (o = 0);
			else if (o < 0 || l[o].actor !== e.actor) {
				let t = l.findIndex((t, n) => n > o && t.actor === e.actor);
				t >= 0 ? o = t : o < 0 && (o = 0);
			}
			let i = m(r);
			if (i >= 0 && d) {
				r = r.slice(i + t.contentMarker.length), c = !0, o = l.indexOf(d), n.contentStarted = !0, f = !0, n.current = d.id, r.trim() && p(d, r);
				continue;
			}
			let a = l[o];
			a && (r.trim() && p(a, r), n.current = a.id, a === d && (n.contentStarted = !0, c = !0));
		}
		for (let e of l) {
			let t = n.stages[e.id];
			t.text !== void 0 && (t.text = t.text.trim());
		}
		if (t.final && t.contentMarker && !f && d && n.stages[d.id].text && n.warnings.push("content-marker-missing"), t.final && d && !n.stages[d.id].text && !s.has(d.id)) {
			let e = l.filter((e) => e !== d && e.actor === d.actor && n.stages[e.id].text), t = e[e.length - 1];
			if (t) n.stages[d.id].text = n.stages[t.id].text, n.stages[t.id].text = void 0, n.warnings.push("content-marker-missing");
			else if (!l.some((e) => n.stages[e.id].text)) {
				let e = r.trim();
				e && (n.stages[d.id].text = e, n.warnings.push("no-stages-found"));
			}
		}
	} else if (d) {
		let e = r.trim();
		e && !n.stages[d.id].text && (n.stages[d.id].text = e);
	}
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Ks(t.stages, n, t.final), qs(t.stages, n, t.final), n;
}
function Xs(e, t) {
	let n = Gs(t.stages), r = e ?? {}, i = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, a = null;
	for (let e of t.stages) {
		let r = i(Rs(t.stages, e), e);
		r !== void 0 && (a = e.id, e.kind === "patch" ? n.stages[e.id].patches = Zs(r) : n.stages[e.id].text = typeof r == "string" ? r : JSON.stringify(r));
	}
	for (let e of t.structures) {
		let r = i(e.field), a = As(e.kind, r, e);
		a !== void 0 && (n.structures[e.id] = a), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let o = Is(t.stages);
	return t.final || (n.current = t.stages.find((e) => Rs(t.stages, e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : a)), o >= 0 && n.stages[t.stages[o].id].text !== void 0 && (n.contentStarted = !0), Ks(t.stages, n, t.final), qs(t.stages, n, t.final), n;
}
function Zs(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function Qs(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function $s(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = Qs(e, n);
	if (r === 1) return {
		text: e.replace(n, () => t.new_string),
		result: {
			...t,
			status: "applied"
		}
	};
	if (r > 1) return {
		text: e,
		result: {
			...t,
			status: "ambiguous"
		}
	};
	let i = n.trim().split(/\s+/).map(vs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
	if (o.length === 1) {
		let n = o[0];
		return {
			text: e.slice(0, n.index) + t.new_string + e.slice(n.index + n[0].length),
			result: {
				...t,
				status: "applied",
				fuzzy: !0
			}
		};
	}
	return {
		text: e,
		result: {
			...t,
			status: o.length ? "ambiguous" : "not-found"
		}
	};
}
function ec(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = $s(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function tc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(vs(t), "gi"), a = [], o;
	for (; o = i.exec(e);) {
		let t = o.index, r = t + o[0].length;
		if (/[\p{L}\p{N}_]/u.test(e[r] ?? "")) continue;
		let s, c;
		if (n && e[r] === "{") {
			let t = 0, n = r;
			for (; n < e.length; n++) if (e[n] === "{") t++;
			else if (e[n] === "}" && --t === 0) break;
			s = Math.min(n + 1, e.length), c = e.slice(r + 1, n).trim();
		} else {
			let t = /\n\s*\n/g;
			t.lastIndex = r;
			let n = t.exec(e);
			s = n ? n.index : e.length, c = e.slice(r, s).replace(/^[\s,，:：]+/, "").trim();
		}
		a.push({
			start: t,
			end: s,
			text: c
		}), i.lastIndex = s;
	}
	if (!a.length) return r;
	let s = "", c = 0;
	for (let t of a) s += e.slice(c, t.start), c = t.end;
	s += e.slice(c), s = s.replace(/\n{3,}/g, "\n\n").trim();
	let l = s === "";
	return {
		present: !0,
		pure: l,
		mixed: !l,
		segments: a.map((e) => e.text).filter(Boolean),
		stripped: s
	};
}
//#endregion
//#region packages/protocol/src/content.ts
function nc(e, t, n = (e) => e) {
	if (!e) return [];
	let r = [];
	for (let i of e) {
		let e = n(i.pieces.filter((e) => hs(e.when, t)).map((e) => e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && r.push(i.role ? {
			role: i.role,
			text: e
		} : { text: e });
	}
	return r;
}
//#endregion
//#region packages/protocol/src/clone.ts
function rc(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => rc(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = rc(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function ic(e) {
	let t = /^v?(\d+)(?:\.(\d+|x|\*))?(?:\.(\d+|x|\*))?(?:-([0-9A-Za-z.-]+))?/.exec(e.trim());
	if (!t) return [
		0,
		0,
		0,
		""
	];
	let n = (e) => e === void 0 || e === "x" || e === "*" ? 0 : Number(e);
	return [
		n(t[1]),
		n(t[2]),
		n(t[3]),
		t[4] ?? ""
	];
}
function ac(e, t) {
	let n = ic(e), r = ic(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function oc(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = ic(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = ac(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var sc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function cc(e, ...t) {
	let n = rc(e);
	for (let e of t) n = lc(n, e);
	return n;
}
function lc(e, t) {
	if (t === void 0) return e;
	if (!sc(e) || !sc(t)) return rc(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = lc(e[r], i);
	return n;
}
function uc(e, t) {
	if (sc(e) && sc(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = uc(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : rc(e);
}
function dc(e, t, n = "", r = [], i = fc) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? sc(e[a]) && sc(t[a]) && (dc(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var fc = /* @__PURE__ */ new Set(["sampling"]);
function pc(e, t, n) {
	let r = rc(e);
	for (let e of t) if (oc(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && sc(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function mc(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function hc(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function gc(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = [];
	for (let n of e.modules) if (n.toggle === "always" || t.modules[n.id] === !0) {
		if (n.exclusive) {
			if (r.has(n.exclusive)) continue;
			r.add(n.exclusive);
		}
		i.push(n);
	}
	return n ? i.filter((e) => hs(e.when, n)) : i;
}
function _c(e, t) {
	let n = new Set(gc(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function vc(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function yc(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function bc(e, t, n, r) {
	let { preset: i, config: a, vars: o, data: s = {} } = e, c = (e, t = 0) => {
		let n = i.params.find((t) => t.id === e);
		if (!n) return "";
		let r = a.params[e] ?? n.default;
		if (r === "" || r === 0 || r === void 0) {
			if (n.fallback && t < 4) {
				let e = c(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, l = (e) => r.flatMap((t) => t.questions[e]).map((e) => `- ${e.text}`).join("\n"), u = o.style, d = (e) => {
		let [r, o, d] = e;
		switch (r) {
			case "name": return yc(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${yc(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? d === "last" ? s.customLast?.[o] ?? "" : u === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : Ws(t, (e) => yc(i, a, e));
			case "input": return s.metaText ?? "";
			case "memory": return JSON.stringify((o === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "questions": return l(o === "optional" ? "optional" : "mandatory");
			default: return;
		}
	};
	return (e) => _s(e, d);
}
function xc(e, t) {
	if (!t.length) return [];
	if (e.merge === "none") return t.map((t) => ({
		role: t.role ?? e.role,
		content: t.text
	}));
	let n = [], r = [], i = () => {
		if (!r.length) return;
		let t = r.join(e.separator);
		n.push({
			role: e.role,
			content: typeof e.merge == "object" ? `<${e.merge.wrap}>\n${t}\n</${e.merge.wrap}>` : t
		}), r = [];
	};
	for (let e of t) e.role ? (i(), n.push({
		role: e.role,
		content: e.text
	})) : r.push(e.text);
	return i(), n;
}
function Sc(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? zs(e.tools.stagePrefix, t) : Rs(n, t), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", yc(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function Cc(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = hc(i), s = a ? Fs(a, o) : [];
	i.features = {
		...i.features,
		questions: s.some((e) => e.questions === "ask")
	};
	let c = hc(i), l = gc(n, r, c), u = vc(n, l), d = bc({
		...e,
		vars: i
	}, s, a, l), f = new Set(l.map((e) => e.id)), p = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!f.has(e.module) || !hs(e.when, c)) continue;
		let t = p.get(e.region) ?? [];
		t.push(...nc(e.content, c, d)), p.set(e.region, t);
	}
	if (a) {
		let e = p.get(n.workflowRegion) ?? [];
		for (let t of nc(Sc(n, a, s, i.style, i.transport, r), c, d)) {
			let n = e[e.length - 1];
			!t.role && n && !n.role && n.workflow ? n.text += `\n\n${t.text}` : e.push({
				...t,
				workflow: !0
			});
		}
		p.set(n.workflowRegion, e);
	}
	let m = {};
	for (let e of n.regions) e.native || (m[e.id] = xc(e, p.get(e.id) ?? []));
	return {
		vars: i,
		resolve: c,
		modules: l,
		structures: u,
		workflow: a,
		stages: s,
		regions: m,
		expand: d
	};
}
function wc(e, t, n = {}) {
	let r = n.transport ?? t.connection.transport;
	return {
		transport: r,
		style: e.styles[r],
		workflow: t.connection.workflow,
		gen: {
			origin: "story",
			type: "normal",
			callerTools: !1,
			callerSchema: !1
		},
		meta: {
			present: !1,
			pure: !1,
			mixed: !1,
			task: null,
			recent: !1
		},
		modules: _c(e, t),
		params: { ...t.params },
		flags: Object.fromEntries(e.regex.map((e) => [e.id, !1])),
		features: {
			tokenSaving: t.tokenSaving.enabled,
			questions: !1
		},
		chat: { group: !1 },
		memory: {
			hasChat: !1,
			hasGlobal: !1
		},
		recap: { present: !1 },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Tc = /* @__PURE__ */ new Set([
	"type",
	"format",
	"title",
	"description",
	"nullable",
	"enum",
	"maxItems",
	"minItems",
	"properties",
	"required",
	"minProperties",
	"maxProperties",
	"minLength",
	"maxLength",
	"pattern",
	"example",
	"anyOf",
	"propertyOrdering",
	"items",
	"minimum",
	"maximum"
]), Ec = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Dc = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Oc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function kc(e) {
	if (!Oc(e)) return { type: "string" };
	let t = { ...e };
	if (Array.isArray(t.allOf) && t.allOf.length === 1 && Oc(t.allOf[0])) {
		let { allOf: e, ...n } = t;
		return kc({
			...t.allOf[0],
			...n
		});
	}
	Array.isArray(t.oneOf) && !t.anyOf && (t.anyOf = t.oneOf), t.const !== void 0 && t.enum === void 0 && (t.enum = [t.const]);
	let n = {}, r = t.nullable === !0, i = (Array.isArray(t.type) ? t.type : t.type === void 0 ? [] : [t.type]).map(String);
	if (i.includes("null") && (r = !0, i = i.filter((e) => e !== "null")), i = i.filter((e) => Ec.has(e)), Array.isArray(t.anyOf)) {
		let e = t.anyOf.filter(Oc), a = e.filter((e) => e.type !== "null");
		if (a.length < e.length && (r = !0), a.length === 1 && !i.length) return Ac({
			...kc(a[0]),
			...t.description ? { description: t.description } : {}
		}, r);
		a.length && (n.anyOf = a.map((e) => kc(e)));
	}
	if (i.length > 1) {
		let e = {
			...t,
			type: void 0,
			anyOf: void 0,
			oneOf: void 0,
			nullable: void 0
		};
		return Ac({
			anyOf: i.map((t) => kc({
				...e,
				type: t
			})),
			...typeof t.description == "string" ? { description: t.description } : {}
		}, r);
	}
	let a = i[0];
	a && (n.type = a);
	for (let [e, r] of Object.entries(t)) if (r !== void 0 && Tc.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Oc(r) && (n.properties = Object.fromEntries(Object.entries(r).map(([e, t]) => [e, kc(t)])));
			break;
		case "items":
			n.items = kc(Array.isArray(r) ? r[0] : r);
			break;
		case "enum": {
			let e = Array.isArray(r) ? r.filter((e) => e != null).map(String) : [];
			e.length && (!a || a === "string") && (n.enum = e, n.type = "string");
			break;
		}
		case "format":
			a && Dc[a]?.includes(String(r)) && (n.format = r);
			break;
		case "required":
			Array.isArray(r) && (n.required = r.map(String));
			break;
		default: n[e] = r;
	}
	if (n.type === "object" || !n.type && n.properties) {
		let e = Oc(n.properties) ? n.properties : {}, t = Object.keys(e);
		if (!t.length) return Ac({
			type: "string",
			description: `${typeof n.description == "string" ? `${n.description} ` : ""}(JSON object encoded as a string)`.trim()
		}, r);
		n.type = "object", Array.isArray(n.required) && (n.required = n.required.filter((e) => t.includes(e))), n.propertyOrdering = t;
	}
	return n.type === "array" && !n.items && (n.items = { type: "string" }), Ac(n, r);
}
function Ac(e, t) {
	return t && (e.nullable = !0), e;
}
function jc(e) {
	return e.map((e) => {
		let t = e?.function?.parameters;
		if (!Oc(t)) return e;
		let n = Oc(t.properties) ? t.properties : {};
		return Object.keys(n).length ? {
			...e,
			function: {
				...e.function,
				parameters: kc(t)
			}
		} : e;
	});
}
//#endregion
//#region src/store/presets.ts
var Mc = /* @__PURE__ */ Zt(/* @__PURE__ */ new Map()), Nc = /* @__PURE__ */ Zt(/* @__PURE__ */ new Map());
async function Pc() {
	try {
		let e = `${a()}dist/presets/`, t = await (await c(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = await (await c(e + n, { cache: "no-cache" })).json();
			Fc(t) && Mc.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
function Fc(e) {
	let t = e;
	return !!t && typeof t == "object" && t.formatVersion === 1 && typeof t.id == "string" && Array.isArray(t.entries);
}
function Ic() {
	return [.../* @__PURE__ */ new Set([
		...Mc.keys(),
		...Object.keys(K().installed),
		...Nc.keys()
	])].map((e) => Lc(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Lc(e) {
	let t = Nc.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = K().installed[e], r = Mc.get(e);
	if (n && (!r || ac(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Rc = (e) => Lc(e)?.preset;
function zc(e) {
	K().installed[e.id] = e, q();
}
function Bc(e) {
	delete K().installed[e], q();
}
function Vc(e, t) {
	e ? Nc.set(e.id, e) : t ? Nc.delete(t) : Nc.clear();
}
var Hc = (e) => Mc.has(e);
//#endregion
//#region src/store/config.ts
function J(e) {
	let t = K().presets, n = t[e.id];
	return n || (n = t[e.id] = {
		active: {
			ref: {
				kind: "recommended",
				id: e.defaultConfiguration
			},
			diff: {}
		},
		saved: [],
		globalMemory: {
			log: [],
			cursor: 0
		},
		version: e.version,
		hash: e.hash
	}, q()), n;
}
function Uc(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : mc(e, n.id)?.diff;
}
function Wc(e, t = J(e).active.ref) {
	return cc(e.configurationDefaults, Uc(e, J(e), t));
}
function Gc(e) {
	let t = J(e);
	return cc(Wc(e, t.active.ref), t.active.diff);
}
function Kc(e, t) {
	let n = J(e);
	n.active.diff = uc(t, Wc(e, n.active.ref)) ?? {}, q();
}
function qc(e, t) {
	let n = Gc(e);
	return t(n), Kc(e, n), n;
}
function Jc(e, t) {
	let n = J(e);
	n.active = {
		ref: t,
		diff: {}
	}, q();
}
var Yc = (e) => Object.keys(J(e).active.diff ?? {}).length > 0;
function Xc(e) {
	J(e).active.diff = {}, q();
}
function Zc(e, t) {
	let n = J(e), r = Gc(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: uc(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, q(), i;
}
function Qc(e, t) {
	let n = J(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = uc(Gc(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), q());
}
function $c(e, t, n) {
	let r = J(e).saved.find((e) => e.id === t);
	r && (r.name = n, q());
}
function el(e, t) {
	let n = J(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), q();
}
function tl(e) {
	let t = J(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = [], i = e.configurationDefaults, a = (t) => {
		let a = ac(n, e.version) < 0 ? pc(t, e.migrations, n) : rc(t);
		r.push(...dc(a, i));
		let o = a.modules;
		if (o) for (let t of Object.keys(o)) e.modules.some((e) => e.id === t) || (delete o[t], r.push(`modules.${t}`));
		let s = a.params;
		if (s) for (let t of Object.keys(s)) e.params.some((e) => e.id === t) || (delete s[t], r.push(`params.${t}`));
		return a;
	};
	t.active.diff = a(t.active.diff ?? {});
	for (let e of t.saved) e.diff = a(e.diff);
	return t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.version = e.version, t.hash = e.hash, q(), r.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, r), r;
}
//#endregion
//#region i18n/en.json
var nl = {
	"app.name": "Advanced Preset",
	"carrier.reset": "The preset was updated; manual edits in “{name}” were reset.",
	"error.toolsUnsupported": "The current API source or settings do not support tool calling. Switch the transport or pick another recommended configuration.",
	"error.emptyTurn": "The model returned no story content.",
	"update.reloading": "Advanced Preset was updated. Reloading…",
	"update.none": "Already up to date.",
	"update.failed": "Update failed: {error}",
	"common.add": "Add",
	"common.cancel": "Cancel",
	"common.clear": "Clear",
	"common.close": "Close",
	"common.copy": "Copy",
	"common.delete": "Delete",
	"common.edit": "Edit",
	"common.install": "Install",
	"common.none": "None",
	"common.redo": "Redo",
	"common.rename": "Rename",
	"common.reset": "Reset",
	"common.save": "Save",
	"common.undo": "Undo",
	"panel.enabled": "Enabled",
	"panel.open": "Open panel",
	"panel.open.title": "Advanced Preset panel",
	"panel.noPreset": "No Advanced Preset selected",
	"panel.choosePreset": "Choose a preset",
	"settings.enable": "Enable Advanced Preset",
	"settings.preset": "Current preset",
	"settings.inactive": "None. Pick an “AP · …” preset under Chat Completion Presets.",
	"tab.presets": "Presets",
	"tab.config": "Config",
	"tab.modules": "Modules",
	"tab.writing": "Writing",
	"tab.memory": "Memory",
	"tab.debug": "Debug",
	"presets.importFile": "File",
	"presets.importUrl": "URL",
	"presets.checkUpdates": "Check for extension updates",
	"presets.installed": "Preset installed.",
	"presets.updated": "Preset updated.",
	"presets.update": "Update from source",
	"presets.invalid": "Not an Advanced Preset artifact.",
	"presets.tooNew": "This preset needs Advanced Preset {version} or newer.",
	"presets.none": "No presets yet.",
	"presets.source.builtin": "Built-in",
	"presets.source.installed": "Installed",
	"presets.source.dev": "Dev",
	"appearance.title": "Appearance",
	"appearance.colors": "Colours",
	"appearance.colors.hint": "Overrides the preset’s primary and accent colours.",
	"appearance.primary": "Primary",
	"appearance.accent": "Accent",
	"appearance.collapseStages": "Collapse stages after generation",
	"config.configuration": "Configuration",
	"config.recommended": "Recommended",
	"config.saved": "Saved",
	"config.saveAs": "Save as…",
	"config.overwrite": "Save changes",
	"config.reset": "Discard changes",
	"config.name": "Configuration name",
	"config.modified": "Modified",
	"config.connection": "Connection",
	"config.transport": "Transport",
	"config.workflow": "Workflow",
	"config.sampling": "Sampling",
	"config.forceTool": "Force tool call",
	"config.forceTool.hint": "Require the model to call the tool (tool_choice).",
	"config.parallelTools": "Parallel tool calls",
	"config.parallelTools.hint": "Let the model call several stage tools in one response.",
	"config.syntheticTurn": "Synthetic turn",
	"config.syntheticTurn.hint": "A fake earlier tool exchange that shows the model how the tools are used.",
	"config.thoughtSignature": "Thought signature",
	"config.thoughtSignature.hint": "Attach a thought signature to the synthetic turn (Gemini).",
	"config.maxSteps": "Max steps",
	"config.finalFallback": "Plain-text fallback",
	"config.finalFallback.hint": "If no content stage arrives, use the model’s plain text as the reply.",
	"transport.prefill": "Prefill",
	"transport.plaintext": "Plain text",
	"transport.structured": "Structured",
	"transport.tool-single": "Tool",
	"transport.tool-multi": "Multi-tool",
	"transport.prefill.hint": "The whole chat is rendered into one assistant prefill that the model continues.",
	"transport.plaintext.hint": "Stages are written as tagged plain text in one reply.",
	"transport.structured.hint": "The reply is a JSON object (json_schema) with one field per stage.",
	"transport.tool-single.hint": "One tool call carries every stage as arguments.",
	"transport.tool-multi.hint": "One tool per stage, called step by step.",
	"sampling.temperature": "Temperature",
	"sampling.top_p": "Top P",
	"sampling.top_k": "Top K",
	"sampling.min_p": "Min P",
	"sampling.top_a": "Top A",
	"sampling.frequency_penalty": "Frequency penalty",
	"sampling.presence_penalty": "Presence penalty",
	"sampling.repetition_penalty": "Repetition penalty",
	"sampling.openai_max_context": "Context size",
	"sampling.openai_max_tokens": "Max response tokens",
	"sampling.seed": "Seed",
	"sampling.stream_openai": "Streaming",
	"sampling.show_thoughts": "Show reasoning",
	"sampling.reasoning_effort": "Reasoning effort",
	"effort.auto": "Auto",
	"effort.min": "Minimum",
	"effort.low": "Low",
	"effort.medium": "Medium",
	"effort.high": "High",
	"effort.max": "Maximum",
	"modules.other": "Other",
	"modules.none": "This preset has no optional modules.",
	"writing.params": "Parameters",
	"writing.actors": "Names & prefixes",
	"writing.actorName": "Name · {actor}",
	"writing.actorPrefix": "Prefix",
	"writing.tokenSaving": "Token saving",
	"writing.tokenSaving.hint": "Older turns are replaced by their synopsis; long user messages are truncated.",
	"writing.keepFullTurns": "Full turns kept",
	"writing.keepFullTurns.hint": "Most recent assistant turns that stay verbatim.",
	"writing.truncateUserAfter": "Truncate user after",
	"writing.truncateUserAfter.hint": "Characters kept of older user messages (0 = never).",
	"writing.meta": "Meta instructions",
	"writing.recentCount": "Recent meta kept",
	"writing.recentCount.hint": "How many earlier meta instructions stay visible to the model.",
	"memory.chat": "Chat memory",
	"memory.chat.hint": "Lives in this chat; follows deletes and swipes.",
	"memory.global": "Global memory",
	"memory.global.hint": "Shared by every chat using this preset.",
	"memory.recap": "Recap",
	"memory.recap.hint": "Summary that replaces the history it covers.",
	"memory.recap.empty": "No recap yet",
	"memory.key": "Title",
	"memory.content": "Content",
	"memory.empty": "Empty",
	"memory.deleted": "Deleted",
	"memory.noChat": "Open a chat first.",
	"cards.impersonate": "Suggested reply",
	"cards.fillInput": "Use",
	"cards.options": "Options",
	"cards.optionHint": "Click to fill · Ctrl/⌘-click to send",
	"cards.recap": "Recap",
	"stages.requests": "{n} request(s)",
	"stages.revertDraft": "Show draft (before patches)",
	"stages.reapplyPatches": "Re-apply patches",
	"stages.waiting": "Preparing…",
	"stage.pending": "Waiting",
	"stage.streaming": "Writing…",
	"stage.done": "Empty",
	"stage.missing": "Not produced",
	"stage.interrupted": "Interrupted",
	"patch.not-found": "Not found",
	"patch.ambiguous": "Multiple matches",
	"patch.empty": "Empty patch",
	"debug.dev": "Dev source",
	"debug.dev.hint": "Run `ap dev` in a preset repo and enter its URL; the preset reloads on every build.",
	"debug.dev.url": "Server URL",
	"debug.dev.off": "Off",
	"debug.dev.connecting": "Connecting",
	"debug.dev.online": "Online",
	"debug.dev.error": "Unreachable",
	"debug.assembly": "Last assembly",
	"debug.noAssembly": "Nothing assembled yet.",
	"debug.emptyRegion": "Empty",
	"debug.requests": "Requests",
	"debug.noRequests": "No requests yet.",
	"debug.request": "Request",
	"debug.response": "Response",
	"debug.error": "Error",
	"debug.log": "Log",
	"debug.noLog": "Empty"
}, rl = {
	en: nl,
	"zh-cn": {
		"app.name": "Advanced Preset",
		"carrier.reset": "预设已更新，「{name}」中的手动修改已被重置。",
		"error.toolsUnsupported": "当前 API 源或设置不支持工具调用。请切换传输模式或选择其他推荐配置。",
		"error.emptyTurn": "模型没有返回正文。",
		"update.reloading": "Advanced Preset 已更新，正在重新加载…",
		"update.none": "已是最新版本。",
		"update.failed": "更新失败：{error}",
		"common.add": "添加",
		"common.cancel": "取消",
		"common.clear": "清空",
		"common.close": "关闭",
		"common.copy": "复制",
		"common.delete": "删除",
		"common.edit": "编辑",
		"common.install": "安装",
		"common.none": "无",
		"common.redo": "重做",
		"common.rename": "重命名",
		"common.reset": "重置",
		"common.save": "保存",
		"common.undo": "撤销",
		"panel.enabled": "启用",
		"panel.open": "打开面板",
		"panel.open.title": "Advanced Preset 面板",
		"panel.noPreset": "未选择 Advanced Preset 预设",
		"panel.choosePreset": "选择预设",
		"settings.enable": "启用 Advanced Preset",
		"settings.preset": "当前预设",
		"settings.inactive": "未选择。在对话补全预设中选择「AP · …」即可启用。",
		"tab.presets": "预设",
		"tab.config": "配置",
		"tab.modules": "模组",
		"tab.writing": "写作",
		"tab.memory": "记忆",
		"tab.debug": "调试",
		"presets.importFile": "文件",
		"presets.importUrl": "链接",
		"presets.checkUpdates": "检查扩展更新",
		"presets.installed": "预设已安装。",
		"presets.updated": "预设已更新。",
		"presets.update": "从来源更新",
		"presets.invalid": "不是 Advanced Preset 预设文件。",
		"presets.tooNew": "该预设需要 Advanced Preset {version} 或更高版本。",
		"presets.none": "暂无预设。",
		"presets.source.builtin": "内置",
		"presets.source.installed": "已安装",
		"presets.source.dev": "开发",
		"appearance.title": "外观",
		"appearance.colors": "主题色",
		"appearance.colors.hint": "覆盖预设的主色与辅色。",
		"appearance.primary": "主色",
		"appearance.accent": "辅色",
		"appearance.collapseStages": "生成后折叠阶段",
		"config.configuration": "配置",
		"config.recommended": "推荐",
		"config.saved": "已保存",
		"config.saveAs": "另存为…",
		"config.overwrite": "保存修改",
		"config.reset": "放弃修改",
		"config.name": "配置名称",
		"config.modified": "已修改",
		"config.connection": "连接",
		"config.transport": "传输模式",
		"config.workflow": "工作流",
		"config.sampling": "采样",
		"config.forceTool": "强制工具调用",
		"config.forceTool.hint": "要求模型必须调用工具（tool_choice）。",
		"config.parallelTools": "并行工具调用",
		"config.parallelTools.hint": "允许模型在一次响应中调用多个阶段工具。",
		"config.syntheticTurn": "示范轮次",
		"config.syntheticTurn.hint": "预置一轮虚拟的工具调用，向模型示范工具用法。",
		"config.thoughtSignature": "思维签名",
		"config.thoughtSignature.hint": "为示范轮次附加思维签名（Gemini）。",
		"config.maxSteps": "最大步数",
		"config.finalFallback": "纯文本兜底",
		"config.finalFallback.hint": "没有收到正文阶段时，把模型的纯文本当作正文。",
		"transport.prefill": "预填充",
		"transport.plaintext": "纯文本",
		"transport.structured": "结构化",
		"transport.tool-single": "工具",
		"transport.tool-multi": "多工具",
		"transport.prefill.hint": "整段对话渲染为一条助手预填充，由模型续写。",
		"transport.plaintext.hint": "各阶段以带标签的纯文本写在一条回复中。",
		"transport.structured.hint": "回复为 JSON 对象（json_schema），每个阶段一个字段。",
		"transport.tool-single.hint": "一次工具调用，以参数承载全部阶段。",
		"transport.tool-multi.hint": "每个阶段一个工具，逐步调用。",
		"sampling.temperature": "温度",
		"sampling.top_p": "Top P",
		"sampling.top_k": "Top K",
		"sampling.min_p": "Min P",
		"sampling.top_a": "Top A",
		"sampling.frequency_penalty": "频率惩罚",
		"sampling.presence_penalty": "存在惩罚",
		"sampling.repetition_penalty": "重复惩罚",
		"sampling.openai_max_context": "上下文长度",
		"sampling.openai_max_tokens": "最大回复长度",
		"sampling.seed": "种子",
		"sampling.stream_openai": "流式传输",
		"sampling.show_thoughts": "显示思维链",
		"sampling.reasoning_effort": "推理强度",
		"effort.auto": "自动",
		"effort.min": "最低",
		"effort.low": "低",
		"effort.medium": "中",
		"effort.high": "高",
		"effort.max": "最高",
		"modules.other": "其他",
		"modules.none": "该预设没有可选模组。",
		"writing.params": "参数",
		"writing.actors": "名称与前缀",
		"writing.actorName": "名称 · {actor}",
		"writing.actorPrefix": "前缀",
		"writing.tokenSaving": "节省 Token",
		"writing.tokenSaving.hint": "较早的轮次替换为事件摘要，较长的用户消息会被截断。",
		"writing.keepFullTurns": "保留完整轮数",
		"writing.keepFullTurns.hint": "最近若干条助手回复保持原文。",
		"writing.truncateUserAfter": "用户消息截断",
		"writing.truncateUserAfter.hint": "较早用户消息保留的字符数（0 为不截断）。",
		"writing.meta": "元指令",
		"writing.recentCount": "保留近期元指令",
		"writing.recentCount.hint": "模型可见的之前元指令条数。",
		"memory.chat": "聊天记忆",
		"memory.chat.hint": "属于当前聊天，随删除与滑动回滚。",
		"memory.global": "全局记忆",
		"memory.global.hint": "使用该预设的所有聊天共享。",
		"memory.recap": "总结",
		"memory.recap.hint": "替代其覆盖范围内历史的摘要。",
		"memory.recap.empty": "暂无总结",
		"memory.key": "标题",
		"memory.content": "内容",
		"memory.empty": "空",
		"memory.deleted": "已删除",
		"memory.noChat": "请先打开一个聊天。",
		"cards.impersonate": "代写",
		"cards.fillInput": "填入输入框",
		"cards.options": "选项",
		"cards.optionHint": "点击填入 · Ctrl/⌘ 点击直接发送",
		"cards.recap": "总结",
		"stages.requests": "{n} 次请求",
		"stages.revertDraft": "还原草稿（补丁前）",
		"stages.reapplyPatches": "重新应用补丁",
		"stages.waiting": "准备中…",
		"stage.pending": "等待中",
		"stage.streaming": "书写中…",
		"stage.done": "空",
		"stage.missing": "未生成",
		"stage.interrupted": "已中断",
		"patch.not-found": "未找到",
		"patch.ambiguous": "多处匹配",
		"patch.empty": "空补丁",
		"debug.dev": "开发源",
		"debug.dev.hint": "在预设仓库运行 `ap dev` 并填入地址；每次构建后预设自动重载。",
		"debug.dev.url": "服务地址",
		"debug.dev.off": "关闭",
		"debug.dev.connecting": "连接中",
		"debug.dev.online": "在线",
		"debug.dev.error": "无法连接",
		"debug.assembly": "最近组装",
		"debug.noAssembly": "尚未组装。",
		"debug.emptyRegion": "空",
		"debug.requests": "请求",
		"debug.noRequests": "暂无请求。",
		"debug.request": "请求",
		"debug.response": "响应",
		"debug.error": "错误",
		"debug.log": "日志",
		"debug.noLog": "空"
	}
};
function il() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((rl[il()] ?? rl[il().split("-")[0]])?.[e] ?? nl[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function al(e) {
	return e.locales?.[il()] ?? e.locales?.[il().split("-")[0]];
}
function ol(e, t, n, r, i) {
	let a = al(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
//#endregion
//#region src/store/carrier.ts
var sl = "advanced_preset", cl = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, ll = (e) => cl[e] ?? e, ul = () => e().getPresetManager("openai"), dl = (e) => `AP · ${e.name}`;
function fl() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function pl(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function ml(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...rc(t.sampling),
		prompts: rc(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: rc(n)
		})),
		extensions: { [sl]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function hl(e) {
	let t = ul();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function gl(e, t, n) {
	let r = ul();
	if (n) {
		await r.savePreset(e, t);
		return;
	}
	await r.savePreset(e, t, { skipUpdate: !0 });
	let { presets: i, preset_names: a } = r.getPresetList();
	if (a[e] !== void 0) {
		i[a[e]] = t;
		return;
	}
	i.push(t);
	let o = i.length - 1;
	a[e] = o;
	let s = r.select ?? "#settings_preset_openai";
	(typeof s == "string" ? document.querySelector(s) : s[0])?.append(new Option(e, String(o)));
}
async function _l(e, t = {}) {
	let n = ul(), r = J(e), i = hl(e.id), a = i ?? dl(e), o = i ? n.getCompletionPresetByName(i) : void 0, c = o?.extensions?.[sl];
	if (!o || t.force || c?.hash !== e.hash) {
		o && r.carrierHash && pl(o) !== r.carrierHash && s("info", Y("carrier.reset", { name: a }));
		let n = ml(e, Gc(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = pl(n), q(), await gl(a, n, !!t.select);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function vl(e) {
	await _l(e, { select: !0 });
}
async function yl(e) {
	let t = hl(e.id);
	if (!t) return;
	let n = ul(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Gc(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...rc(i)
	}, o = n.getSelectedPresetName() === t;
	bl = !0;
	try {
		await gl(t, a, o);
	} finally {
		bl = !1;
	}
}
var bl = !1;
function xl(t) {
	if (bl || fl() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Gc(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[ll(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = rc(r));
	}
	return Object.keys(i).length ? (qc(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/store/sidecar.ts
var Sl = "advanced_preset";
function Cl(e) {
	let t = e?.extra?.[Sl];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function wl(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Sl] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Sl] = rc(n));
}
//#endregion
//#region src/store/eventlog.ts
var Tl = "advanced_preset";
function El() {
	return e().chatMetadata?.[Tl]?.seedEvents ?? [];
}
function Dl(t = Infinity) {
	let n = El().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of Cl(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function Ol(e = Infinity) {
	let t = {};
	for (let { event: n } of Dl(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function kl(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of Dl(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function Al(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Cl(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Tl] && (e.extra[Tl].events = rc(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Tl] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function jl(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key];
	return t;
}
function Ml(e, t, n, r, i) {
	let a = e.globalMemory, o = jl(e)[n] ?? null;
	return a.log.splice(a.cursor), a.log.push({
		op: t,
		key: n,
		content: r,
		prev: o,
		source: i,
		at: Date.now()
	}), a.cursor = a.log.length, q(), a.cursor - 1;
}
var Nl = (e) => e.globalMemory.cursor > 0, Pl = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Fl(e) {
	Nl(e) && (e.globalMemory.cursor--, q());
}
function Il(e) {
	Pl(e) && (e.globalMemory.cursor++, q());
}
function Ll(e, t) {
	let n = e.globalMemory.log[t];
	n && (n.prev === null ? Ml(e, "delete", n.key, void 0, "undo") : Ml(e, "replace", n.key, n.prev, "undo"));
}
function Rl(e, t) {
	let n = [];
	for (let r of t) if (r.scope === "global_memory") {
		let t = Ml(e, r.operation, r.key, r.content ?? "", "model");
		n.push({
			type: "global.ref",
			index: t
		});
	} else r.operation === "replace" ? n.push({
		type: "memory.replace",
		key: r.key,
		content: r.content ?? "",
		source: "model"
	}) : n.push({
		type: "memory.delete",
		key: r.key,
		source: "model"
	});
	return n;
}
//#endregion
//#region src/core/classify.ts
var zl = null, Bl = (e) => {
	zl = e;
}, Vl = () => {
	let e = zl;
	return zl = null, e;
};
function Hl(t, n) {
	let r = _s(t.meta.trigger, (e) => e[0] === "name" ? yc(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Ul(e, t, n, r, i, a = [], o = !0) {
	let s = tc(n, Hl(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = hc(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && hs(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && hs(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && hs(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? Vl() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Wl(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Gl = 0, Kl = () => `ap-${Date.now().toString(36)}-${(++Gl).toString(36)}`, ql = /* @__PURE__ */ new Map(), Jl = null, Yl = null, Xl = {
	setPending(e) {
		Jl = e;
	},
	takePending() {
		let e = Jl;
		return Jl = null, e;
	},
	peekPending: () => Jl,
	arm(e) {
		Yl = e, ql.set(e.id, e);
	},
	takeArmed() {
		let e = Yl;
		return Yl = null, e;
	},
	get: (e) => ql.get(e),
	release(e) {
		ql.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of ql) t - r.createdAt > e && ql.delete(n);
	}
}, Zl = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, Ql = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function $l(e, t) {
	return e.replace(/\{\{(time|location|event|summary)\}\}/g, (e, n) => t[n] ?? "");
}
function eu(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	if (n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Zl(e);
		if (a && Ql.has(a.turn)) {
			r.add(i);
			for (let e = i - 1; e >= 0; e--) {
				if (n[e].item.is_user) {
					e !== t.currentInput && r.add(e);
					break;
				}
				if (!n[e].item.is_system) break;
			}
		}
	}), n = n.filter((e) => !r.has(e.index)), n = n.map((e) => {
		if (!e.item.is_user || e.index === t.currentInput || !t.trigger) return e;
		let n = tc(e.item.mes, t.trigger, t.wrap);
		return n.present ? {
			...e,
			item: {
				...e.item,
				mes: n.stripped
			}
		} : e;
	}).filter((e) => e.item.mes.trim() !== "" || !e.item.is_user), t.tokenSaving.enabled) {
		let e = 0, r = Array(n.length).fill(0);
		for (let t = n.length - 1; t >= 0; t--) !n[t].item.is_user && !n[t].item.is_system && e++, r[t] = e;
		let i = Math.max(0, t.tokenSaving.keepFullTurns), a = (e) => r[e] <= i, o = t.recap?.coversUpTo ?? -1;
		n = n.flatMap((e, n) => {
			if (a(n) || e.index === t.currentInput) return [e];
			if (o >= 0 && t.realIndex(e.index) <= o) return [];
			if (e.item.is_user) {
				let n = t.tokenSaving.truncateUserAfter;
				return [n > 0 && e.item.mes.length > n ? {
					...e,
					item: {
						...e.item,
						mes: `${e.item.mes.slice(0, n)}…`
					}
				} : e];
			}
			let r = t.synopsisId ? Zl(e.item)?.structures?.[t.synopsisId] : void 0;
			return [r ? {
				...e,
				item: {
					...e.item,
					mes: $l(t.synopsisTemplate, r)
				}
			} : e];
		});
	}
	return n.map((e) => e.item);
}
var tu = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function nu(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function ru(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = nu(e), r = nu(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function iu(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = tu(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = tu(l.text);
			if (c === u || c.includes(u) || ru(c, u) >= n) {
				r[o] = e, i = e - 1, a++;
				break;
			}
		}
	}
	return {
		map: r,
		rate: e.length ? a / e.length : 1
	};
}
//#endregion
//#region src/core/interceptor.ts
async function au(t, n, r, i) {
	if (Xl.setPending(null), !K().enabled) return;
	let a = fl(), o = a ? Rc(a) : void 0;
	if (!o) return;
	let s = Gc(o), c = i || "normal", l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, { meta: d, flags: f, origin: p } = Ul(o, s, u >= 0 ? t[u].mes : "", c, !0, t.slice(-6).map((e) => e.mes)), m = e().chat, h = t.map((e) => m.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), g = eu(t, {
		trigger: Hl(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		synopsisTemplate: o.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(o.structures).find((e) => e.kind === "synopsis")?.id,
		recap: kl(),
		realIndex: (e) => h[e] ?? -1,
		currentInput: u
	});
	t.splice(0, t.length, ...g);
	let _ = {
		id: Kl(),
		preset: o,
		config: s,
		origin: p,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: d,
		flags: f,
		transport: s.connection.transport,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? h[u] ?? m.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		createdAt: Date.now(),
		warnings: []
	};
	Xl.setPending(_);
}
//#endregion
//#region src/core/debug.ts
var ou = /* @__PURE__ */ Zt({
	log: [],
	requests: []
}), su = 50;
function cu(e, t) {
	ou.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), ou.log.length > su && (ou.log.length = su);
}
function lu(e) {
	return ou.requests.unshift(e), ou.requests.length > su && (ou.requests.length = su), ou.requests[0];
}
//#endregion
//#region src/core/assembler.ts
var uu = /⟦ap:region:([\w.-]+)⟧/g, du = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function fu(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(uu)) {
			let a = e.slice(r, i.index).trim();
			a && t.push({
				...n,
				content: a
			}), t.push({
				role: n.role,
				content: "",
				__anchor: i[1]
			}), r = i.index + i[0].length;
		}
		let i = e.slice(r).trim();
		i && t.push({
			...n,
			content: i
		});
	}
	return t;
}
function pu(t, n) {
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = yc(t, n, t.user), s = yc(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Cl(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? Ns(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function mu(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = Cl(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function hu(t, n) {
	let { preset: r, config: i } = t, a = Ol(), o = jl(J(r)), s = kl(), c = pu(r, i), l = t.transport;
	return {
		vars: wc(r, i, {
			transport: l,
			style: r.styles[l],
			workflow: n?.id ?? "",
			gen: {
				origin: t.origin,
				type: t.stType,
				callerTools: !1,
				callerSchema: !1
			},
			meta: {
				present: t.meta.present,
				pure: t.meta.pure,
				mixed: t.meta.mixed,
				task: t.meta.task,
				recent: !!c
			},
			flags: {
				...Object.fromEntries(r.regex.map((e) => [e.id, !1])),
				...t.flags
			},
			chat: { group: !!e().groupId },
			memory: {
				hasChat: Object.keys(a).length > 0,
				hasGlobal: Object.keys(o).length > 0
			},
			recap: { present: !!s }
		}),
		data: {
			metaText: t.meta.segments.join("\n\n"),
			memory: {
				chat: a,
				global: o
			},
			recap: s?.text ?? "",
			recentMeta: c,
			customLast: mu(r)
		}
	};
}
function gu(t, n) {
	let { preset: r, config: i } = t, a = n.findIndex((e) => e.__anchor === r.anchors.historyStart), o = n.findIndex((e) => e.__anchor === r.anchors.historyEnd);
	if (a < 0 || o < 0 || o <= a) {
		t.warnings.push("backfill: semantic anchors missing");
		return;
	}
	let s = n.slice(a + 1, o).map((e, t) => ({
		m: e,
		i: a + 1 + t
	})).filter(({ m: e }) => e.role === "user" || e.role === "assistant"), c = e().chat.map((e, t) => ({
		m: e,
		index: t
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = iu(s.map(({ m: e }) => ({
		role: e.role,
		text: du(e.content)
	})), c.map(({ m: e }) => ({
		role: e.is_user ? "user" : "assistant",
		text: e.mes
	})));
	if (u < .9) {
		t.warnings.push(`backfill: alignment ${Math.round(u * 100)}% < 90%, history left as is`);
		return;
	}
	let d = [];
	l.forEach((e, t) => {
		if (e < 0) return;
		let n = c[e];
		d.push({
			is_user: n.m.is_user,
			mes: du(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = eu(d, {
		trigger: Hl(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		synopsisTemplate: r.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(r.structures).find((e) => e.kind === "synopsis")?.id,
		recap: kl(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1
	}), m = new Map(p.map((e) => [e.__h, e.mes])), h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function _u(t, n) {
	let r = n ? null : Xl.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Gc(t), a = [...e().chat].reverse().find((e) => e.is_user && !e.is_system), { meta: o, flags: s, origin: c } = Ul(t, i, n ? a?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: Kl(),
		preset: t,
		config: i,
		origin: c,
		stType: n ? "normal" : "script",
		interceptorRan: !1,
		dryRun: n,
		meta: o,
		flags: s,
		transport: i.connection.transport,
		stages: [],
		structures: [],
		inputIndex: -1,
		createdAt: Date.now(),
		warnings: []
	};
}
var vu = Symbol("ap-region");
function yu(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => du(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${yc(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = du(t.content);
		if (t[vu] || t.role === "system") return n;
		let r = t.role === "user" ? e().name1 : typeof t.name == "string" && t.name || e().name2, a = t.role === "user" ? l : `${r}: `;
		return i.historyItemTemplate.replaceAll("{{prefix}}", a).replaceAll("{{name}}", r).replaceAll("{{content}}", n);
	}).filter(Boolean), d = [];
	return s && d.push({
		role: "system",
		content: s
	}), d.push({
		role: "user",
		content: o(i.prefillGuide || "<START>")
	}), d.push({
		role: "assistant",
		content: u.join("\n\n").trimEnd()
	}), d;
}
async function bu(t) {
	let { chat: n, dryRun: r } = t;
	if (!K().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		r || (Xl.setPending(null), Xl.takeArmed());
		return;
	}
	let i = fl(), a = i ? Rc(i) : void 0;
	if (!a) {
		let e = fu(n).filter((e) => !e.__anchor);
		n.splice(0, n.length, ...e);
		return;
	}
	let o = _u(a, r), s = fu(n);
	!o.interceptorRan && !r && gu(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : Wl(a, o.config, o.origin), { vars: u, data: d } = hu(o, l), f = Cc({
		preset: a,
		config: o.config,
		vars: u,
		data: d
	}, l);
	o.workflow = l, o.assembly = f, o.stages = f.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : f.structures;
	let p = (t) => e().substituteParams(t), m = [], h = -1, g = {
		genId: o.id,
		at: Date.now(),
		dryRun: r,
		origin: o.origin,
		transport: o.transport,
		workflow: l?.id ?? "",
		modules: f.modules.map((e) => e.id),
		regions: [],
		warnings: o.warnings
	};
	for (let e of s) {
		if (!e.__anchor) {
			m.push(e);
			continue;
		}
		let t = e.__anchor, n = (f.regions[t] ?? []).map((e) => {
			let t = {
				role: e.role,
				content: p(e.content)
			};
			return Object.defineProperty(t, vu, { value: !0 }), t;
		}).filter((e) => du(e.content).trim());
		g.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: du(e.content).length,
				content: du(e.content)
			}))
		}), m.push(...n), t === a.anchors.historyStart && (h = m.length);
	}
	let _ = o.transport === "prefill" && !c && h >= 0 ? yu(o, m, h) : m;
	n.splice(0, n.length, ..._.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), cu("assembly", g), !r && !c && l && Xl.arm(o);
}
//#endregion
//#region src/core/transports/base.ts
var xu = (e) => e.startsWith("ap_");
function Su(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${yc(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Cu(e, t) {
	return e.replaceAll("{{submit}}", ds).replaceAll("{{next}}", t.next ?? "").replaceAll("{{first}}", t.first ?? "");
}
var wu = (e, t) => zs(e.preset.tools.stagePrefix, t);
function Tu(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = (e) => r.assembly ? r.assembly.expand(e) : e;
	return {
		tool: {
			type: "function",
			function: {
				name: o.tool.name,
				description: o.tool.description,
				parameters: {
					type: "object",
					properties: {}
				}
			}
		},
		messages: [
			{
				role: "user",
				content: l(o.user)
			},
			{
				role: "assistant",
				content: "",
				tool_calls: [{
					id: s,
					type: "function",
					function: {
						name: o.tool.name,
						arguments: "{}"
					},
					...c ? { signature: c } : {}
				}]
			},
			{
				role: "tool",
				tool_call_id: s,
				content: Cu(l(o.response[t]), { first: n })
			}
		]
	};
}
function Eu(e) {
	return {
		type: "object",
		properties: {
			thinking: { type: "string" },
			result: e
		},
		required: ["thinking", "result"],
		additionalProperties: !1
	};
}
function Du(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && Ou(n), n;
}
function Ou(e) {
	Array.isArray(e.tools) && (e.tools = jc(e.tools)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: kc(e.json_schema.value)
	});
}
function ku(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/transports/text.ts
var Au = (e) => `After your thinking, output the result as one JSON code block (\`\`\`json … \`\`\`) that matches this JSON Schema:\n\n\`\`\`json\n${JSON.stringify(e, null, 2)}\n\`\`\``;
function ju(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Su(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Ys(e, {
		stages: t.stages,
		prefixes: r,
		user: t.preset.user,
		contentMarker: t.preset.contentMarker,
		structures: t.structures,
		format: n ? "prefix" : t.preset.plaintextFormat,
		final: i
	}), s = [...e.messages];
	if (e.caller.schema) {
		let t = {
			role: "system",
			content: Au(e.caller.schema.value)
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, t) : s.push(t);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Du({
				...e,
				messages: s
			}, r);
		},
		progress: (e, r) => {
			i = e;
			let s = e.text;
			for (let e of n ? t.preset.stop : []) {
				let t = s.indexOf(e);
				t >= 0 && (s = s.slice(0, t));
			}
			return a = o(s, r), a;
		},
		complete: (t) => {
			let n = ku(t, e.caller);
			return {
				done: !0,
				callerToolCalls: n.length ? n : void 0
			};
		},
		result: () => a ?? o(i.text, !0),
		rawText: () => i.text,
		callerResult: () => {
			let e = /```(?:json)?\s*([\s\S]*?)```/i.exec(i.text);
			if (e) try {
				return JSON.parse(e[1]);
			} catch {
				return;
			}
		}
	};
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/utils/JSONRepairError.js
var Mu = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Nu = 32, Pu = 10, Fu = 9, Iu = 13, Lu = 160, Ru = 6158, zu = 8192, Bu = 8203, Vu = 8239, Hu = 8287, Uu = 12288, Wu = 65279;
function Gu(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Ku(e) {
	return e >= "0" && e <= "9";
}
function qu(e) {
	return e >= " ";
}
function Ju(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Yu(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Xu(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Zu = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Qu = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function $u(e) {
	return ",[]/{}\n+".includes(e);
}
function ed(e) {
	return od(e) || td.test(e);
}
var td = /^[[{\w-]$/;
function nd(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function rd(e, t) {
	let n = e.charCodeAt(t);
	return n === Nu || n === Pu || n === Fu || n === Iu;
}
function id(e, t) {
	let n = e.charCodeAt(t);
	return n === Nu || n === Fu || n === Iu;
}
function ad(e, t) {
	let n = e.charCodeAt(t);
	return n === Lu || n === Ru || n >= zu && n <= Bu || n === Vu || n === Hu || n === Uu || n === Wu;
}
function od(e) {
	return sd(e) || ld(e);
}
function sd(e) {
	return e === "\"" || e === "“" || e === "”";
}
function cd(e) {
	return e === "\"";
}
function ld(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function ud(e) {
	return e === "'";
}
function dd(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function fd(e, t) {
	let n = e.length;
	if (!rd(e, n - 1)) return e + t;
	for (; rd(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function pd(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function md(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var hd = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function gd(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = hd[n];
	if (r !== void 0) return {
		char: r,
		length: n.length
	};
	if (e.charAt(1) === "#") {
		let r = e.substring(2, t), i = r.charAt(0) === "x" || r.charAt(0) === "X", a = i ? r.substring(1) : r;
		if (a.length > 0) {
			let e = Number.parseInt(a, i ? 16 : 10);
			if (!Number.isNaN(e) && e >= 0 && e <= 1114111) return {
				char: String.fromCodePoint(e),
				length: n.length
			};
		}
	}
	return null;
}
function _d(e) {
	return e !== null && e.char === "\"";
}
function vd(e) {
	return e !== null && e.char === "'";
}
function yd(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function bd(e, t) {
	switch (t) {
		case ")": return yd(e, "(") > yd(e, ")");
		case "]": return yd(e, "[") > yd(e, "]");
		case "}": return yd(e, "{") > yd(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var xd = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Sd = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Cd(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || D(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), ed(e[t]) && md(n) ? (r || (n = fd(n, ",")), g()) : r && (n = dd(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	E();
	function i() {
		a();
		let e = m() || h() || _() || y() || b() || S(!1) || C();
		return a(), e;
	}
	function a() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !0, n = t, r = o(e);
		do
			r = s(), r &&= o(e);
		while (r);
		return t > n;
	}
	function o(r) {
		let i = r ? rd : id, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (ad(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !wd(e, t);) t++;
			return t += 2, !0;
		}
		if (e[t] === "/" && e[t + 1] === "/") {
			for (; t < e.length && e[t] !== "\n";) t++;
			return !0;
		}
		return !1;
	}
	function c(n) {
		if (l(n)) {
			if (Yu(e[t])) for (; t < e.length && Xu(e[t]);) t++;
			return a(), !0;
		}
		return !1;
	}
	function l(n) {
		o(!0);
		for (let r of n) {
			let n = t + r.length;
			if (e.slice(t, n) === r) return t = n, !0;
		}
		return !1;
	}
	function u(r) {
		return e[t] === r && (n += e[t], t++, !0);
	}
	function d(n) {
		return e[t] === n && (t++, !0);
	}
	function f() {
		return d("\\");
	}
	function p() {
		return a(), e[t] === "." && e[t + 1] === "." && e[t + 2] === "." && (t += 3, a(), d(","), !0);
	}
	function m() {
		if (e[t] === "{") {
			n += "{", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "}";) {
				let o;
				if (r ? o = !0 : (o = u(","), o || (n = fd(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = dd(n, ",")) : ne();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (ed(e[t]) || c ? n = fd(n, ":") : re()), i() || (s || c ? n += "null" : re()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = fd(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = fd(n, ",")), p(), !i()) {
					r || (n = dd(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = fd(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = fd(n, ",")), t = i();
		t || (n = dd(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, od(e[t]) || E());
		let s = e[t] === "&" ? gd(e.slice(t, t + 12)) : null, c = _d(s) || vd(s);
		if (od(e[t]) || c) {
			let l = cd(e[t]) ? cd : ud(e[t]) ? ud : ld(e[t]) ? ld : sd, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = ee(t - 1);
					return !r && Ju(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = fd(p, "\""), n += p, !0);
				}
				if (t === i) return p = fd(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? gd(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Ju(e[t]) && !bd(p, e[t]) || od(e[t]) && !te(t) || Ku(e[t])) return v(), !0;
					e[t] === "\\" && E();
					let s = ee(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Ju(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && $u(e[t])) {
					if (e[t - 1] === ":" && Zu.test(e.substring(u + 1, t + 2))) for (; t < e.length && Qu.test(e[t]);) p += e[t], t++;
					return p = fd(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : nd(e) ? p += xd[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Sd[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Gu(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ie();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : nd(n) ? (p += xd[n], t++) : (qu(n) || T(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = dd(n, "\"", !0);
			let e = n.length;
			n = _() ? pd(n, e, 1) : fd(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Ku(e[t]) && w() && (i += "0")), e[t] === "0" && Ku(e[t + 1]) && (a = !0); Ku(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Ku(e[t]) || (i += "0"); Ku(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Ku(e[t]) || (i += "0"); Ku(e[t]);) i += e[t], t++;
			return w() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Xu(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (Yu(e[t])) {
			for (; t < e.length && Xu(e[t]);) t++;
			let n = t;
			for (; rd(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !$u(e[t]) && !od(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Zu.test(e.substring(a, t + 2))) for (; t < e.length && Qu.test(e[t]);) t++;
		if (t > a) {
			for (; rd(e, t - 1) && t > 0;) t--;
			let r = e.slice(a, t);
			return n += r === "undefined" ? "null" : JSON.stringify(r), e[t] === "\"" && t++, !0;
		}
	}
	function C() {
		if (e[t] === "/") {
			let r = t;
			for (t++; t < e.length && (e[t] !== "/" || e[t - 1] === "\\");) t++;
			return t++, n += JSON.stringify(e.substring(r, t)), !0;
		}
	}
	function ee(t) {
		let n = t;
		for (; n > 0 && rd(e, n);) n--;
		return n;
	}
	function te(t) {
		let n = t + 1;
		for (; n < e.length && rd(e, n);) n++;
		return n >= e.length || Ju(e[n]);
	}
	function w() {
		return t >= e.length || Ju(e[t]) || rd(e, t);
	}
	function T(e) {
		throw new Mu(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function E() {
		throw new Mu(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function D() {
		throw new Mu("Unexpected end of json string", e.length);
	}
	function ne() {
		throw new Mu("Object key expected", t);
	}
	function re() {
		throw new Mu("Colon expected", t);
	}
	function ie() {
		throw new Mu(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function wd(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Td(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Ed(e, t) {
	let n = Td(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Cd(n));
		} catch {
			r = null;
		}
	}
	if (!r || typeof r != "object" || Array.isArray(r)) return { value: null };
	let i = r, a = Object.keys(i);
	return {
		value: i,
		openKey: t ? void 0 : a[a.length - 1]
	};
}
//#endregion
//#region src/core/transports/structured.ts
function Dd(e, t, n) {
	let r = Gs(e.stages), i = e.stages.find((e) => e.kind === "text");
	i && typeof t?.thinking == "string" && (r.stages[i.id] = {
		text: t.thinking,
		status: n ? "done" : "streaming"
	});
	for (let t of e.stages) n && r.stages[t.id].status !== "done" && (r.stages[t.id].status = t.optional ? "pending" : "missing");
	return r.current = n ? null : i?.id ?? null, r;
}
function Od(e) {
	return Vs(e.workflow, e.stages, e.structures, { stageDescriptions: Object.fromEntries(e.stages.map((e) => [e.id, e.label])) });
}
function kd(e) {
	let { ctx: t, caller: n } = e, r = n.schema ? Eu(n.schema.value) : Od(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", s = (e, r) => {
		let i = Ed(o(e), r);
		return a = i.value, n.schema ? Dd(t, i.value, r) : Xs(i.value, {
			stages: t.stages,
			structures: t.structures,
			final: r,
			openKey: i.openKey
		});
	};
	return {
		body: () => Du(e, { json_schema: {
			name: n.schema?.name ?? "ap_turn",
			value: r,
			strict: !1
		} }),
		progress: (e, t) => (i = e, s(e, t)),
		complete: () => ({ done: !0 }),
		result: () => s(i, !0),
		rawText: () => i.text,
		callerResult: () => a?.result
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Ad = (e, t) => ({
	role: "assistant",
	content: e.text || "",
	tool_calls: t.map((e) => ({
		id: e.id,
		type: "function",
		function: {
			name: e.name,
			arguments: e.arguments || "{}"
		},
		...e.signature ? { signature: e.signature } : {}
	}))
});
function jd(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Md(e) {
	let { ctx: t, caller: n } = e, r = n.schema ? Eu(n.schema.value) : Od(t), i = Tu(e, "single", ds), a = [
		...i ? [i.tool] : [],
		Hs(ds, t.preset.tools.submit, r),
		...n.tools
	], o = [...e.messages, ...i?.messages ?? []], s = t.config.connection.forceTool && !n.tools.length, c = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, l = null, u = (e, r) => {
		let i = Ed((e.toolCalls.find((e) => e.name === "ap_submit_turn") ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", r);
		return l = i.value, n.schema ? Dd(t, i.value, r) : Xs(i.value, {
			stages: t.stages,
			structures: t.structures,
			final: r,
			openKey: i.openKey
		});
	};
	return {
		body: () => Du(e, {
			messages: o,
			tools: a,
			tool_choice: s ? {
				type: "function",
				function: { name: ds }
			} : "auto"
		}),
		progress: (e, t) => (c = e, u(e, t)),
		complete: (e) => {
			let t = ku(e, n);
			return {
				done: !0,
				callerToolCalls: t.length ? t : void 0
			};
		},
		result: () => u(c, !0),
		rawText: () => c.text,
		callerResult: () => l?.result
	};
}
function Nd(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Us(t.workflow, r, i, a.tools.stagePrefix, Object.fromEntries(r.map((e) => [e.id, e.label]))), c = s[0]?.function.name ?? "", l = Tu(e, o ? "parallel" : "multi", c), u = [
		...l ? [l.tool] : [],
		...s,
		...n.tools
	], d = [...e.messages, ...l?.messages ?? []], f = Ls(t.workflow, r), p = new Map(r.map((e) => [wu(t, e), e])), m = {}, h = [], g = !1, _ = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, v = () => r.find((e) => !e.optional && m[Rs(r, e)] === void 0), y = () => {
		let e = v();
		return e ? wu(t, e) : "";
	}, b = (e, t, n) => {
		let a = p.get(t.name);
		if (!a) return;
		let o = Ed(t.arguments, n).value ?? {}, s = Rs(r, a), c = a.kind === "patch" ? o.edits : o.content;
		if (c !== void 0 && (e[s] = c), r.indexOf(a) === f) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return s;
	}, x = (e, a, o) => n.schema ? Dd(t, e, a) : Xs(e, {
		stages: r,
		structures: i,
		final: a,
		openKey: o
	});
	return {
		body: () => {
			let r = !t.config.connection.forceTool || n.tools.length ? "auto" : o ? "required" : {
				type: "function",
				function: { name: y() || c }
			};
			return Du({
				...e,
				messages: d
			}, {
				messages: [...d],
				tools: u,
				tool_choice: r
			});
		},
		progress: (e, t) => {
			_ = e;
			let n = { ...m }, r;
			for (let i of e.toolCalls) r = b(n, i, t) ?? r;
			return x(n, t, t ? void 0 : r);
		},
		complete: (e, t) => {
			let r = jd(e.toolCalls.filter((e) => e.name), t), i = ku(e, n);
			if (i.length) return {
				done: !0,
				callerToolCalls: i
			};
			e.text.trim() && h.push(e.text.trim());
			let o = r.filter((e) => p.has(e.name));
			if (o.length) {
				d.push(Ad(e, r));
				for (let e of r) {
					b(m, e, !0);
					let t = p.has(e.name), n = y(), r = t ? n ? Cu(a.tools.stageResult, { next: n }) : "Recorded. The workflow is complete." : `Unknown tool ${e.name}.`;
					d.push({
						role: "tool",
						tool_call_id: e.id,
						content: r
					});
				}
			}
			if (!v()) return { done: !0 };
			if (!o.length) {
				if (g) return { done: !0 };
				g = !0, e.text.trim() && d.push({
					role: "assistant",
					content: e.text
				}), d.push({
					role: "user",
					content: Cu(a.tools.nudge, { next: y() })
				});
			}
			return { done: !1 };
		},
		result: () => x(m, !0),
		rawText: () => h.join("\n\n") || _.text
	};
}
//#endregion
//#region src/core/transports/index.ts
function Pd(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return ju(e);
		case "structured": return kd(e);
		case "tool-single": return Md(e);
		case "tool-multi": return Nd(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Fd(e) {
	switch (e) {
		case "claude": return "claude";
		case "makersuite":
		case "vertexai": return "gemini";
		case "cohere": return "cohere";
		default: return "openai";
	}
}
var Id = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Ld(e) {
	switch (e) {
		case "claude": {
			let e = 1;
			return {
				text: (e) => e ? Id({
					type: "content_block_delta",
					index: 0,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? Id({
					type: "content_block_delta",
					index: 0,
					delta: {
						type: "thinking_delta",
						thinking: e
					}
				}) : "",
				toolCalls: (t) => t.map((t) => {
					let n = e++;
					return Id({
						type: "content_block_start",
						index: n,
						content_block: {
							type: "tool_use",
							id: t.id,
							name: t.name,
							input: {}
						}
					}) + Id({
						type: "content_block_delta",
						index: n,
						delta: {
							type: "input_json_delta",
							partial_json: t.arguments || "{}"
						}
					}) + Id({
						type: "content_block_stop",
						index: n
					});
				}).join(""),
				error: (e) => Id({
					type: "error",
					error: { message: e }
				}),
				end: () => Id({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Id({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Id({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Id({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: Rd(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Id({ error: { message: e } }),
			end: () => ""
		};
		case "cohere": return {
			text: (e) => e ? Id({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Id({
				type: "tool-call-start",
				index: t,
				delta: { message: { tool_calls: {
					id: e.id,
					type: "function",
					function: {
						name: e.name,
						arguments: e.arguments
					}
				} } }
			})).join(""),
			error: (e) => Id({ error: { message: e } }),
			end: () => Id({ type: "message-end" })
		};
		default: return {
			text: (e) => e ? Id({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Id({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Id({ choices: [{
				index: 0,
				delta: { tool_calls: e.map((e, t) => ({
					index: t,
					id: e.id,
					type: "function",
					function: {
						name: e.name,
						arguments: e.arguments
					}
				})) }
			}] }) : "",
			error: (e) => Id({ error: { message: e } }),
			end: () => Id("[DONE]")
		};
	}
}
function Rd(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function zd(e, t) {
	let n = t.toolCalls?.length ? t.toolCalls.map((e) => ({
		id: e.id,
		type: "function",
		function: {
			name: e.name,
			arguments: e.arguments
		},
		...e.signature ? { signature: e.signature } : {}
	})) : void 0, r = { choices: [{
		index: 0,
		message: {
			role: "assistant",
			content: t.content,
			...t.reasoning ? {
				reasoning_content: t.reasoning,
				reasoning: t.reasoning
			} : {},
			...n ? { tool_calls: n } : {}
		},
		finish_reason: n ? "tool_calls" : "stop"
	}] };
	return e === "claude" ? r.content = [
		...t.reasoning ? [{
			type: "thinking",
			thinking: t.reasoning
		}] : [],
		{
			type: "text",
			text: t.content
		},
		...(t.toolCalls ?? []).map((e) => ({
			type: "tool_use",
			id: e.id,
			name: e.name,
			input: Rd(e.arguments)
		}))
	] : e === "gemini" && (r.responseContent = {
		role: "model",
		parts: [
			...t.reasoning ? [{
				text: t.reasoning,
				thought: !0
			}] : [],
			{ text: t.content },
			...(t.toolCalls ?? []).map((e) => ({
				functionCall: {
					name: e.name,
					args: Rd(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Bd(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/reader.ts
var Vd = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Hd(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Ud = class {
	calls = [];
	claudeIndex = /* @__PURE__ */ new Map();
	get list() {
		return this.calls;
	}
	at(e) {
		for (; this.calls.length <= e;) this.calls.push({
			id: "",
			name: "",
			arguments: ""
		});
		return this.calls[e];
	}
	push(e) {
		for (let t of Array.isArray(e?.choices) ? e.choices : []) if ((t?.index ?? 0) === 0) for (let [e, n] of (t?.delta?.tool_calls ?? t?.message?.tool_calls ?? []).entries()) {
			let t = this.at(typeof n?.index == "number" ? n.index : e);
			n?.id && !t.id && (t.id = n.id), n?.function?.name && !t.name && (t.name = n.function.name);
			let r = n?.function?.arguments;
			typeof r == "string" ? t.arguments += r : r && typeof r == "object" && (t.arguments = JSON.stringify(r));
		}
		if (e?.type === "content_block_start" && e?.content_block?.type === "tool_use") {
			let t = this.calls.length;
			this.claudeIndex.set(e.index ?? t, t);
			let n = this.at(t);
			n.id = e.content_block.id ?? "", n.name = e.content_block.name ?? "";
			let r = e.content_block.input;
			r && Object.keys(r).length && (n.arguments = JSON.stringify(r));
		}
		if (e?.type === "content_block_delta" && e?.delta?.type === "input_json_delta") {
			let t = this.claudeIndex.get(e.index ?? 0);
			t !== void 0 && (this.at(t).arguments += e.delta.partial_json ?? "");
		}
		for (let t of e?.candidates?.[0]?.content?.parts ?? []) {
			if (!t?.functionCall) continue;
			let e = this.at(this.calls.length);
			e.id = `call_${Math.random().toString(36).slice(2, 10)}`, e.name = t.functionCall.name ?? "", e.arguments = JSON.stringify(t.functionCall.args ?? {}), t.thoughtSignature && (e.signature = t.thoughtSignature);
		}
		if (["tool-call-start", "tool-call-delta"].includes(e?.type)) {
			let t = e?.delta?.message?.tool_calls, n = this.at(e.index ?? 0);
			t?.id && !n.id && (n.id = t.id), t?.function?.name && !n.name && (n.name = t.function.name), typeof t?.function?.arguments == "string" && (n.arguments += t.function.arguments);
		}
	}
	fromBody(e) {
		let t = e?.responseContent?.parts;
		if (Array.isArray(t)) {
			this.push({ candidates: [{ content: { parts: t } }] });
			return;
		}
		let n = e?.choices?.[0]?.message;
		if (Array.isArray(n?.tool_calls)) n.tool_calls.forEach((e, t) => {
			let n = this.at(t);
			n.id = e.id ?? `call_${t}`, n.name = e.function?.name ?? "";
			let r = e.function?.arguments;
			n.arguments = typeof r == "string" ? r : JSON.stringify(r ?? {}), e.signature && (n.signature = e.signature);
		});
		else if (Array.isArray(e?.content)) {
			for (let t of e.content) if (t?.type === "tool_use") {
				let e = this.at(this.calls.length);
				e.id = t.id, e.name = t.name, e.arguments = JSON.stringify(t.input ?? {});
			}
		}
	}
};
function Wd(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Gd(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* Kd(e, t) {
	let n = e.getReader(), r = new TextDecoder(), i = "", a = () => n.cancel().catch(() => void 0);
	t?.addEventListener("abort", a, { once: !0 });
	try {
		for (;;) {
			let { done: e, value: a } = await n.read();
			if (t?.aborted) throw new DOMException("Aborted", "AbortError");
			if (e) break;
			i += r.decode(a, { stream: !0 }).replace(/\r\n?/g, "\n");
			let o;
			for (; (o = i.indexOf("\n\n")) >= 0;) {
				let e = i.slice(0, o);
				i = i.slice(o + 2);
				let t = e.split("\n").filter((e) => e.startsWith("data:")).map((e) => e.slice(5).replace(/^ /, "")).join("\n");
				t && (yield t);
			}
		}
		let e = i.split("\n").filter((e) => e.startsWith("data:")).map((e) => e.slice(5).trim()).join("\n");
		e && (yield e);
	} finally {
		t?.removeEventListener("abort", a);
	}
}
async function* qd(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Hd(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Vd(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Ud();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Hd(t);
		if (n) throw new Vd(n);
		i.text = Wd(t), i.reasoning = Gd(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = t?.usage ?? t?.usageMetadata, yield i;
		return;
	}
	let s = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of Kd(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Hd(e);
		if (r) throw new Vd(r);
		i.text += o(e, s, t), i.reasoning = s.reasoning, a.push(e), i.toolCalls = a.list, s.signature && (i.signature = s.signature);
		let c = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		c && (i.finishReason = c), (e?.usage || e?.usageMetadata) && (i.usage = e.usage ?? e.usageMetadata), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var Jd = /* @__PURE__ */ Zt({ current: null });
function Yd(e, t) {
	return Jd.current = {
		genId: e.id,
		presetId: e.preset.id,
		transport: e.transport,
		workflow: e.workflow?.id ?? "",
		stages: e.stages.map((e) => ({
			id: e.id,
			actor: e.actor,
			kind: e.kind,
			label: e.label,
			optional: !!e.optional,
			text: "",
			status: "pending"
		})),
		structures: {},
		reasoning: "",
		status: "running",
		streaming: t,
		step: 0,
		startedAt: Date.now(),
		mesId: null
	}, Jd.current;
}
function Xd(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var Zd = "/api/backends/chat-completions/generate", Qd = { pending: null }, $d = (e) => e?.name === "AbortError";
function ef(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Y("error.toolsUnsupported") : null;
}
async function tf(e, t, n) {
	let r = Fd(String(t.chat_completion_source ?? "")), i = !!t.stream, a = ef(e);
	if (a) return s("error", a, "Advanced Preset"), Bd(a, 400);
	let o = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !xu(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = Yd(e, i);
	if (!i) try {
		let i = await af(e, t, o, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(zd(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return rf(c, e);
	}
	let l = Ld(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let r = await af(e, t, o, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			r.content.startsWith(m) && await p(l.text(r.content.slice(m.length))), r.reasoning && await p(l.reasoning(r.reasoning)), r.toolCalls?.length && await p(l.toolCalls(r.toolCalls)), await p(l.end());
		} catch (e) {
			$d(e) || (await p(l.error(nf(e))), rf(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var nf = (e) => e instanceof Error ? e.message : String(e);
function rf(e, t) {
	return e.status = $d(t) ? "aborted" : "error", e.error = nf(t), t instanceof Vd ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Bd(nf(t));
}
async function af(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = Pd({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Fd(s)
	}), u = Is(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, h = Date.now(), g = "", _, v = 0, y = !1, b, x;
	for (let n = 0; n < m; n++) {
		i.step = n;
		let r = l.body(n), u = lu({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		v++;
		let f = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let t = await c(Zd, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), n = 0;
			for await (let e of qd(t, s, !!r.stream, a)) {
				f = e;
				let t = Date.now();
				if (t - n < 50) continue;
				n = t;
				let r = l.progress(e, !1);
				if (Xd(i, r, g + e.reasoning), p && d) {
					let e = r.stages[d]?.text ?? "";
					e && o(e.slice(0, e.length - ws(e)).trimEnd());
				}
			}
			u.response = f.text || JSON.stringify(f.toolCalls), u.durationMs = Date.now() - u.at, u.usage = f.usage;
		} catch (e) {
			if (u.error = nf(e), $d(e) || a?.aborted) {
				y = !0, x = l.progress(f, !1);
				break;
			}
			throw e;
		}
		g += f.reasoning, _ = f.usage ?? _, l.progress(f, !0);
		let m = l.complete(f, n);
		if (m.callerToolCalls) {
			b = m.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (m.done) break;
	}
	let S = x ?? l.result();
	if (y) for (let e of Object.values(S.stages)) e.status === "streaming" && (e.status = "interrupted");
	Xd(i, S, g);
	let C = of(t, S, l.rawText(), l.callerResult?.(), g, {
		usage: _,
		requests: v,
		durationMs: Date.now() - h,
		interrupted: y
	});
	return C.toolCalls = b, b && (C.content = ""), i.status = y ? "aborted" : "done", C;
}
function of(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = ec(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Ts(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g = (e) => Object.values(s.structures).find((t) => t.kind === e), _ = g("reply"), v = _ ? n.structures[_.id] : void 0, y = g("impersonate"), b = g("recap"), x = g("memory"), S = t.meta.mixed ? "meta-mixed" : "story", C = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? C = i === void 0 ? u || Ts(r).trim() : JSON.stringify(i) : u || (S = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", C = v ? Ns(v) : "", !C && y && typeof n.structures[y.id] == "string" && (C = "…"), !C && b && n.structures[b.id] && (C = "…"))), !C && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let ee = [], te = t.interceptorRan && t.stType !== "quiet";
	if (te && x && Array.isArray(n.structures[x.id]) && ee.push(...Rl(J(s), n.structures[x.id])), te && b && typeof n.structures[b.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ee.push({
			type: "recap.set",
			text: n.structures[b.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let w = t.stages.map((e) => {
		let t = n.stages[e.id];
		return {
			id: e.id,
			actor: e.actor,
			kind: e.kind,
			label: e.label,
			...t?.text ? { text: t.text } : {},
			...e.kind === "patch" && (p || t?.patches) ? { patches: p ?? t.patches } : {},
			status: t?.status === "done" ? "done" : t?.status === "interrupted" ? "interrupted" : "missing"
		};
	}), T = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: S,
		stages: w,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
		patchesApplied: d !== void 0,
		structures: n.structures,
		events: ee,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, E = {
		content: C,
		reasoning: a,
		sidecar: T
	};
	return te ? Qd.pending = {
		ctx: t,
		outcome: E,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: T
	}), Jd.current?.genId === t.id && (Jd.current.structures = n.structures), E;
}
//#endregion
//#region src/core/fetch-gate.ts
var sf = "__ap_gen_id";
function cf(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function lf() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	l(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(cf(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[sf], r = typeof t == "string" ? Xl.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[sf], r.claimed = !0;
				try {
					return await tf(r, e, n.signal);
				} finally {
					Xl.release(t);
				}
			}
			e && (delete e[sf], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function uf(e) {
	let t = Xl.takeArmed();
	t && (e[sf] = t.id);
}
//#endregion
//#region src/app/receive.ts
var df = 6e5, ff = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function pf(t, n) {
	let r = Qd.pending;
	if (!r || Date.now() - r.at > df || ff.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Qd.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), wl(t, a.sidecar), Jd.current?.genId === r.ctx.id && (Jd.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/updater.ts
var mf = "advancedPreset.reloadedFor";
async function hf() {
	try {
		let e = await c(`${a()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function gf(e) {
	sessionStorage.setItem(mf, e), s("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function _f() {
	let e = await hf();
	e && e !== "03dc0ffee59cce64" && sessionStorage.getItem(mf) !== e && gf(e);
}
async function vf() {
	await _f();
}
async function yf() {
	let e = i().replace(/^third-party\//, ""), t = await bf(e, !1);
	if (t.status === 404 && (t = await bf(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await hf();
	return r && r !== "03dc0ffee59cce64" ? (gf(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var bf = (t, n) => c("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), X = /* @__PURE__ */ Zt({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), xf = 1500, Sf = null;
async function Cf() {
	let { url: e, enabled: t } = K().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await c(`${n}/`, { cache: "no-store" })).json();
		if (X.status = "online", X.error = e.ok === !1 ? "build failed" : "", X.at = Date.now(), !e.hash || e.hash === X.hash) return;
		let t = await (await c(`${n}/preset`, { cache: "no-store" })).json();
		if (!Fc(t)) throw Error("not an Advanced Preset artifact");
		X.presetId && X.presetId !== t.id && Vc(null, X.presetId), Vc(t), X.presetId = t.id, X.hash = t.hash, tl(t), await _l(t), cu("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		X.status = "error", X.error = e instanceof Error ? e.message : String(e);
	}
}
function wf() {
	if (Sf && clearTimeout(Sf), Sf = null, !K().dev.enabled) {
		X.presetId && Vc(null, X.presetId), Object.assign(X, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	X.status === "off" && (X.status = "connecting");
	let e = async () => {
		await Cf(), K().dev.enabled && (Sf = setTimeout(e, xf));
	};
	e();
}
function Tf() {
	tr(() => [K().dev.enabled, K().dev.url], () => {
		X.hash = "", wf();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var Ef = "#option_impersonate, #mes_impersonate", Df = () => document.querySelector("#send_textarea");
function Of(e, t = !1) {
	let n = Df();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function kf() {
	if (!K().enabled) return null;
	let t = fl(), n = t ? Rc(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Gc(n), i = _s(n.meta.impersonatePrompt, (e) => e[0] === "name" ? yc(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function Af(e) {
	if (!e.target?.closest?.(Ef)) return;
	let t = kf();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Df()?.value.trim();
	Of(n ? `${t}\n${n}` : t, !0);
}
function jf() {
	window.addEventListener("click", Af, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var Mf = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-shadow:0 8px 28px #00000073}", Nf = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", Pf = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}", Ff = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;background:var(--ap-panel-bg);color:var(--ap-text);-webkit-backdrop-filter:blur(var(--SmartThemeBlurStrength,10px));flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fill,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}}", Z = /* @__PURE__ */ Zt({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), If = () => {
	Z.chatRev++;
}, Lf = () => {
	Z.presetId = fl();
}, Rf = G(() => Z.presetId ? Rc(Z.presetId) : void 0), zf = G(() => {
	let e = Rf.value;
	if (!e) return { config: "" };
	let t = J(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : ol(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function Bf(t) {
	return Z.chatRev, e().chat[t];
}
function Vf(e) {
	return Cl(Bf(e));
}
function Hf(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/ui/theme.ts
var Uf = /* @__PURE__ */ Zt({ mode: "light" }), Wf = new CSSStyleSheet();
Wf.replaceSync([
	Mf,
	Nf,
	Pf,
	Ff
].join("\n"));
var Gf = new CSSStyleSheet(), Kf = [Wf, Gf], qf = [
	[50, "white 92%"],
	[100, "white 84%"],
	[200, "white 68%"],
	[300, "white 48%"],
	[400, "white 24%"],
	[600, "black 14%"],
	[700, "black 28%"],
	[800, "black 42%"],
	[900, "black 54%"]
];
function Jf(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of qf) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function Yf(e) {
	let t = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(e);
	if (t) return [
		Number(t[1]),
		Number(t[2]),
		Number(t[3])
	];
	let n = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(e.trim());
	if (!n) return null;
	let r = n[1].length === 3 ? [...n[1]].map((e) => e + e).join("") : n[1];
	return [
		0,
		2,
		4
	].map((e) => parseInt(r.slice(e, e + 2), 16));
}
function Xf() {
	let e = Yf(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var Zf = /* @__PURE__ */ new Set();
function Qf(e) {
	return Zf.add(e), e.dataset.apTheme = Uf.mode, () => Zf.delete(e);
}
function $f() {
	let e = Xf();
	if (e !== Uf.mode) {
		Uf.mode = e;
		for (let t of Zf) t.dataset.apTheme = e;
	}
}
function ep() {
	Uf.mode = Xf();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame($f);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), $n(() => {
		let e = Rf.value?.theme?.[Uf.mode] ?? {}, t = K().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(Jf(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(Jf("primary", t.primary)), t.accent && n.push(Jf("accent", t.accent)), Gf.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function tp(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function np(e, t, n = []) {
	if (customElements.get(e)) return;
	class r extends HTMLElement {
		static observedAttributes = n;
		app = null;
		unregister = null;
		connectedCallback() {
			this.mount();
		}
		disconnectedCallback() {
			this.unmount();
		}
		attributeChangedCallback(e, t, n) {
			this.app && t !== n && (this.unmount(), this.mount());
		}
		mount() {
			if (this.app) return;
			let e = this.shadowRoot ?? this.attachShadow({ mode: "open" });
			e.adoptedStyleSheets = Kf, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = Qf(this), this.app = os(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/mounts.ts
var rp = "ap-hidden", ip = [
	"meta-pure",
	"impersonate",
	"summary"
];
function ap(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function op(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Cl(a), s = Jd.current?.mesId === n, c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = ap("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = ap("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(rp, !!(!s && o && ip.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(rp));
}
function sp(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) op(t);
}
function cp() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var lp = 0, up = /* @__PURE__ */ new Set(), dp = !1;
function fp(e) {
	e ? up.add(e) : dp = !0, !lp && (lp = requestAnimationFrame(() => {
		if (lp = 0, dp) sp();
		else for (let e of up) e.isConnected && op(e);
		up.clear(), dp = !1, cp();
	}));
}
function pp() {
	If(), fp();
}
function mp() {
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.CHAT_CHANGED,
		n.MORE_MESSAGES_LOADED,
		n.MESSAGE_UPDATED,
		n.MESSAGE_EDITED,
		n.MESSAGE_SWIPED,
		n.MESSAGE_DELETED,
		n.CHARACTER_MESSAGE_RENDERED,
		"advanced_preset_message_updated"
	]) e && t.on(e, pp);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && fp(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && fp(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), fp();
	};
	r();
	let i;
	tr(() => Jd.current && Jd.current.status === "running" && Jd.current.streaming && Jd.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = Jd.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), pp());
		}, 100));
	}), tr(() => Jd.current?.status, () => fp());
}
//#endregion
//#region src/ui/entry.ts
var hp = "left-nav-panel", gp = "ap-preset-button";
function _p() {
	return document.getElementById(hp);
}
function vp() {
	let e = _p();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function yp() {
	let e = document.querySelector("#settings_preset_openai")?.nextElementSibling;
	if (!e || e.querySelector(`#${gp}`)) return;
	let t = document.createElement("div");
	t.id = gp, t.className = "menu_button menu_button_icon", t.setAttribute("role", "button"), t.tabIndex = 0, t.title = Y("panel.open.title"), t.setAttribute("aria-label", Y("panel.open.title"));
	let n = document.createElement("i");
	n.className = "fa-fw fa-solid fa-layer-group", t.append(n);
	let r = () => {
		Z.panelOpen = !Z.panelOpen;
	};
	t.addEventListener("click", r), t.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), r());
	}), e.prepend(t), tr(() => Z.panelOpen, (e) => t.classList.toggle("active", e), { immediate: !0 });
}
function bp() {
	let e = _p();
	if (!e) {
		document.querySelector("ap-panel") || document.body.append(document.createElement("ap-panel"));
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function xp() {
	yp(), bp(), tr(() => Z.panelOpen, (e) => {
		e && vp();
	});
	let e = _p();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Sp = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Cp = (e) => e === "", wp = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Tp = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ep = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Dp = (e) => {
	let t = Ep(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Op = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, kp = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = Op.width, color: s = Op.stroke, ...c }, { slots: l }) => ja("svg", {
	...Op,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Cp(n) || Cp(r) || n === !0 || r === !0 ? Number(i || a || Op["stroke-width"]) * 24 / Number(o) : i || a || Op["stroke-width"],
	class: wp("lucide", c.class, ...e ? [`lucide-${Tp(Dp(e))}-icon`, `lucide-${Tp(e)}`] : ["lucide-icon"]),
	...!l.default && !Sp(c) && { "aria-hidden": "true" }
}, [...t.map((e) => ja(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => ja(kp, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Ap = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), jp = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), Mp = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), Np = Q("brain", [
	["path", {
		d: "M12 18V5",
		key: "adv99a"
	}],
	["path", {
		d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4",
		key: "1e3is1"
	}],
	["path", {
		d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5",
		key: "1gqd8o"
	}],
	["path", {
		d: "M17.997 5.125a4 4 0 0 1 2.526 5.77",
		key: "iwvgf7"
	}],
	["path", {
		d: "M18 18a4 4 0 0 0 2-7.464",
		key: "efp6ie"
	}],
	["path", {
		d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517",
		key: "1gq6am"
	}],
	["path", {
		d: "M6 18a4 4 0 0 1-2-7.464",
		key: "k1g0md"
	}],
	["path", {
		d: "M6.003 5.125a4 4 0 0 0-2.526 5.77",
		key: "q97ue3"
	}]
]), Pp = Q("bug", [
	["path", {
		d: "M12 20v-9",
		key: "1qisl0"
	}],
	["path", {
		d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z",
		key: "uouzyp"
	}],
	["path", {
		d: "M14.12 3.88 16 2",
		key: "qol33r"
	}],
	["path", {
		d: "M21 21a4 4 0 0 0-3.81-4",
		key: "1b0z45"
	}],
	["path", {
		d: "M21 5a4 4 0 0 1-3.55 3.97",
		key: "5cxbf6"
	}],
	["path", {
		d: "M22 13h-4",
		key: "1jl80f"
	}],
	["path", {
		d: "M3 21a4 4 0 0 1 3.81-4",
		key: "1fjd4g"
	}],
	["path", {
		d: "M3 5a4 4 0 0 0 3.55 3.97",
		key: "1d7oge"
	}],
	["path", {
		d: "M6 13H2",
		key: "82j7cp"
	}],
	["path", {
		d: "m8 2 1.88 1.88",
		key: "fmnt4t"
	}],
	["path", {
		d: "M9 7.13V6a3 3 0 1 1 6 0v1.13",
		key: "1vgav8"
	}]
]), Fp = Q("cable", [
	["path", {
		d: "M17 19a1 1 0 0 1-1-1v-2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a1 1 0 0 1-1 1z",
		key: "trhst0"
	}],
	["path", {
		d: "M17 21v-2",
		key: "ds4u3f"
	}],
	["path", {
		d: "M19 14V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V10",
		key: "1mo9zo"
	}],
	["path", {
		d: "M21 21v-2",
		key: "eo0ou"
	}],
	["path", {
		d: "M3 5V3",
		key: "1k5hjh"
	}],
	["path", {
		d: "M4 10a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2z",
		key: "1dd30t"
	}],
	["path", {
		d: "M7 5V3",
		key: "1t1388"
	}]
]), Ip = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Lp = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Rp = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), zp = Q("circle-dashed", [
	["path", {
		d: "M10.1 2.182a10 10 0 0 1 3.8 0",
		key: "5ilxe3"
	}],
	["path", {
		d: "M13.9 21.818a10 10 0 0 1-3.8 0",
		key: "11zvb9"
	}],
	["path", {
		d: "M17.609 3.721a10 10 0 0 1 2.69 2.7",
		key: "1iw5b2"
	}],
	["path", {
		d: "M2.182 13.9a10 10 0 0 1 0-3.8",
		key: "c0bmvh"
	}],
	["path", {
		d: "M20.279 17.609a10 10 0 0 1-2.7 2.69",
		key: "1ruxm7"
	}],
	["path", {
		d: "M21.818 10.1a10 10 0 0 1 0 3.8",
		key: "qkgqxc"
	}],
	["path", {
		d: "M3.721 6.391a10 10 0 0 1 2.7-2.69",
		key: "1mcia2"
	}],
	["path", {
		d: "M6.391 20.279a10 10 0 0 1-2.69-2.7",
		key: "1fvljs"
	}]
]), Bp = Q("circle-question-mark", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
		key: "1u773s"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]), Vp = Q("circle-slash", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["line", {
	x1: "9",
	x2: "15",
	y1: "15",
	y2: "9",
	key: "1dfufj"
}]]), Hp = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), Up = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), Wp = Q("coins", [
	["path", {
		d: "M13.744 17.736a6 6 0 1 1-7.48-7.48",
		key: "bq4yh3"
	}],
	["path", {
		d: "M15 6h1v4",
		key: "11y1tn"
	}],
	["path", {
		d: "m6.134 14.768.866-.5 2 3.464",
		key: "17snzx"
	}],
	["circle", {
		cx: "16",
		cy: "8",
		r: "6",
		key: "14bfc9"
	}]
]), Gp = Q("copy", [["rect", {
	width: "14",
	height: "14",
	x: "8",
	y: "8",
	rx: "2",
	ry: "2",
	key: "17jyea"
}], ["path", {
	d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
	key: "zix9uf"
}]]), Kp = Q("download", [
	["path", {
		d: "M12 15V3",
		key: "m9g1x1"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}],
	["path", {
		d: "m7 10 5 5 5-5",
		key: "brsn70"
	}]
]), qp = Q("drama", [
	["path", {
		d: "M10 11h.01",
		key: "d2at3l"
	}],
	["path", {
		d: "M14 6h.01",
		key: "k028ub"
	}],
	["path", {
		d: "M18 6h.01",
		key: "1v4wsw"
	}],
	["path", {
		d: "M6.5 13.1h.01",
		key: "1748ia"
	}],
	["path", {
		d: "M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3",
		key: "172yzv"
	}],
	["path", {
		d: "M17.4 9.9c-.8.8-2 .8-2.8 0",
		key: "1obv0w"
	}],
	["path", {
		d: "M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7",
		key: "rqjl8i"
	}],
	["path", {
		d: "M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4",
		key: "1mr6wy"
	}]
]), Jp = Q("feather", [
	["path", {
		d: "M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z",
		key: "18jl4k"
	}],
	["path", {
		d: "M16 8 2 22",
		key: "vp34q"
	}],
	["path", {
		d: "M17.5 15H9",
		key: "1oz8nu"
	}]
]), Yp = Q("file-stack", [
	["path", {
		d: "M11 21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1",
		key: "likhh7"
	}],
	["path", {
		d: "M16 16a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1",
		key: "17ky3x"
	}],
	["path", {
		d: "M21 6a2 2 0 0 0-.586-1.414l-2-2A2 2 0 0 0 17 2h-3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1z",
		key: "1hyeo0"
	}]
]), Xp = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Zp = Q("git-compare-arrows", [
	["circle", {
		cx: "5",
		cy: "6",
		r: "3",
		key: "1qnov2"
	}],
	["path", {
		d: "M12 6h5a2 2 0 0 1 2 2v7",
		key: "1yj91y"
	}],
	["path", {
		d: "m15 9-3-3 3-3",
		key: "1lwv8l"
	}],
	["circle", {
		cx: "19",
		cy: "18",
		r: "3",
		key: "1qljk2"
	}],
	["path", {
		d: "M12 18H7a2 2 0 0 1-2-2V9",
		key: "16sdep"
	}],
	["path", {
		d: "m9 15 3 3-3 3",
		key: "1m3kbl"
	}]
]), Qp = Q("globe", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
		key: "13o1zl"
	}],
	["path", {
		d: "M2 12h20",
		key: "9i4pu4"
	}]
]), $p = Q("info", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "10",
		key: "1mglay"
	}],
	["path", {
		d: "M12 16v-4",
		key: "1dtifu"
	}],
	["path", {
		d: "M12 8h.01",
		key: "e9boi3"
	}]
]), em = Q("layers", [
	["path", {
		d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
		key: "zw3jo"
	}],
	["path", {
		d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
		key: "1wduqc"
	}],
	["path", {
		d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
		key: "kqbvx6"
	}]
]), tm = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), nm = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), rm = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), im = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), am = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), om = Q("notebook-pen", [
	["path", {
		d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4",
		key: "re6nr2"
	}],
	["path", {
		d: "M2 6h4",
		key: "aawbzj"
	}],
	["path", {
		d: "M2 10h4",
		key: "l0bgd4"
	}],
	["path", {
		d: "M2 14h4",
		key: "1gsvsf"
	}],
	["path", {
		d: "M2 18h4",
		key: "1bu2t1"
	}],
	["path", {
		d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
		key: "pqwjuv"
	}]
]), sm = Q("package", [
	["path", {
		d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
		key: "1a0edw"
	}],
	["path", {
		d: "M12 22V12",
		key: "d0xqtd"
	}],
	["polyline", {
		points: "3.29 7 12 12 20.71 7",
		key: "ousv84"
	}],
	["path", {
		d: "m7.5 4.27 9 5.15",
		key: "1c824w"
	}]
]), cm = Q("palette", [
	["path", {
		d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z",
		key: "e79jfc"
	}],
	["circle", {
		cx: "13.5",
		cy: "6.5",
		r: ".5",
		fill: "currentColor",
		key: "1okk4w"
	}],
	["circle", {
		cx: "17.5",
		cy: "10.5",
		r: ".5",
		fill: "currentColor",
		key: "f64h9f"
	}],
	["circle", {
		cx: "6.5",
		cy: "12.5",
		r: ".5",
		fill: "currentColor",
		key: "qy21gx"
	}],
	["circle", {
		cx: "8.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor",
		key: "fotxhn"
	}]
]), lm = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), um = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), dm = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), fm = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), pm = Q("refresh-cw", [
	["path", {
		d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
		key: "v9h5vc"
	}],
	["path", {
		d: "M21 3v5h-5",
		key: "1q7to0"
	}],
	["path", {
		d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
		key: "3uifl3"
	}],
	["path", {
		d: "M8 16H3v5",
		key: "1cv678"
	}]
]), mm = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), hm = Q("save", [
	["path", {
		d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
		key: "1c8476"
	}],
	["path", {
		d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
		key: "1ydtos"
	}],
	["path", {
		d: "M7 3v4a1 1 0 0 0 1 1h7",
		key: "t51u73"
	}]
]), gm = Q("scroll-text", [
	["path", {
		d: "M15 12h-5",
		key: "r7krc0"
	}],
	["path", {
		d: "M15 8h-5",
		key: "1khuty"
	}],
	["path", {
		d: "M19 17V5a2 2 0 0 0-2-2H4",
		key: "zz82l3"
	}],
	["path", {
		d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
		key: "1ph1d7"
	}]
]), _m = Q("server", [
	["rect", {
		width: "20",
		height: "8",
		x: "2",
		y: "2",
		rx: "2",
		ry: "2",
		key: "ngkwjq"
	}],
	["rect", {
		width: "20",
		height: "8",
		x: "2",
		y: "14",
		rx: "2",
		ry: "2",
		key: "iecqi9"
	}],
	["line", {
		x1: "6",
		x2: "6.01",
		y1: "6",
		y2: "6",
		key: "16zg32"
	}],
	["line", {
		x1: "6",
		x2: "6.01",
		y1: "18",
		y2: "18",
		key: "nzw8ys"
	}]
]), vm = Q("shapes", [
	["path", {
		d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z",
		key: "1bo67w"
	}],
	["rect", {
		x: "3",
		y: "14",
		width: "7",
		height: "7",
		rx: "1",
		key: "1bkyp8"
	}],
	["circle", {
		cx: "17.5",
		cy: "17.5",
		r: "3.5",
		key: "w3z12y"
	}]
]), ym = Q("sliders-horizontal", [
	["path", {
		d: "M10 5H3",
		key: "1qgfaw"
	}],
	["path", {
		d: "M12 19H3",
		key: "yhmn1j"
	}],
	["path", {
		d: "M14 3v4",
		key: "1sua03"
	}],
	["path", {
		d: "M16 17v4",
		key: "1q0r14"
	}],
	["path", {
		d: "M21 12h-9",
		key: "1o4lsq"
	}],
	["path", {
		d: "M21 19h-5",
		key: "1rlt1p"
	}],
	["path", {
		d: "M21 5h-7",
		key: "1oszz2"
	}],
	["path", {
		d: "M8 10v4",
		key: "tgpxqk"
	}],
	["path", {
		d: "M8 12H3",
		key: "a7s4jb"
	}]
]), bm = Q("sliders-vertical", [
	["path", {
		d: "M10 8h4",
		key: "1sr2af"
	}],
	["path", {
		d: "M12 21v-9",
		key: "17s77i"
	}],
	["path", {
		d: "M12 8V3",
		key: "13r4qs"
	}],
	["path", {
		d: "M17 16h4",
		key: "h1uq16"
	}],
	["path", {
		d: "M19 12V3",
		key: "o1uvq1"
	}],
	["path", {
		d: "M19 21v-5",
		key: "qua636"
	}],
	["path", {
		d: "M3 14h4",
		key: "bcjad9"
	}],
	["path", {
		d: "M5 10V3",
		key: "cb8scm"
	}],
	["path", {
		d: "M5 21v-7",
		key: "1w1uti"
	}]
]), xm = Q("text-cursor-input", [
	["path", {
		d: "M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6",
		key: "1528k5"
	}],
	["path", {
		d: "M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7",
		key: "13ksps"
	}],
	["path", {
		d: "M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1",
		key: "1n9rhb"
	}],
	["path", {
		d: "M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1",
		key: "1mj8rg"
	}],
	["path", {
		d: "M9 6v12",
		key: "velyjx"
	}]
]), Sm = Q("trash-2", [
	["path", {
		d: "M10 11v6",
		key: "nco0om"
	}],
	["path", {
		d: "M14 11v6",
		key: "outv1u"
	}],
	["path", {
		d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
		key: "miytrc"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
		key: "e791ji"
	}]
]), Cm = Q("triangle-alert", [
	["path", {
		d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
		key: "wmoenq"
	}],
	["path", {
		d: "M12 9v4",
		key: "juzpu7"
	}],
	["path", {
		d: "M12 17h.01",
		key: "p32p05"
	}]
]), wm = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), Tm = Q("upload", [
	["path", {
		d: "M12 3v12",
		key: "1x0j5s"
	}],
	["path", {
		d: "m17 8-5-5-5 5",
		key: "7q97r8"
	}],
	["path", {
		d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
		key: "ih7n3h"
	}]
]), Em = Q("user-pen", [
	["path", {
		d: "M11.5 15H7a4 4 0 0 0-4 4v2",
		key: "15lzij"
	}],
	["path", {
		d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z",
		key: "1817ys"
	}],
	["circle", {
		cx: "10",
		cy: "7",
		r: "4",
		key: "e45bow"
	}]
]), Dm = Q("workflow", [
	["rect", {
		width: "8",
		height: "8",
		x: "3",
		y: "3",
		rx: "2",
		key: "by2w9f"
	}],
	["path", {
		d: "M7 11v4a2 2 0 0 0 2 2h4",
		key: "xkn7yn"
	}],
	["rect", {
		width: "8",
		height: "8",
		x: "13",
		y: "13",
		rx: "2",
		key: "1cgmvn"
	}]
]), Om = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), km = 6, Am = 8;
function jm(e, t, n, r = "center", i = !1) {
	let a = e.top - km - t.height >= Am, o = e.bottom + km + t.height <= n.height - Am, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - km - t.height : e.bottom + km;
	c = Math.max(Am, Math.min(c, n.height - Am - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(Am, Math.min(l, n.width - Am - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Mm(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = jm(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return tr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Pn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Fr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/components/Tip.vue
var Nm = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Mm(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Vr(t.$slots, "default"), P(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : W("", !0)], 544));
	}
}), Pm = ["disabled", "aria-label"], $ = /* @__PURE__ */ I({
	__name: "IconButton",
	props: {
		icon: {},
		label: {},
		active: { type: Boolean },
		danger: { type: Boolean },
		disabled: { type: Boolean },
		small: { type: Boolean },
		align: {},
		below: { type: Boolean }
	},
	emits: ["click"],
	setup(e) {
		return (t, n) => (z(), V(Nm, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: F(() => [H("button", {
				type: "button",
				class: O(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(z(), V(Rr(e.icon)))], 10, Pm)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), Fm = {
	key: 0,
	class: "patches"
}, Im = { class: "patch-old pre" }, Lm = { class: "patch-new pre" }, Rm = {
	key: 0,
	class: "patch-status xs"
}, zm = {
	key: 2,
	class: "faint small stage-empty"
}, Bm = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		tr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Pn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: Ce({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", Fm, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: O(["patch", { failed: r(e.status) }])
		}, [
			H("div", Im, k(e.old_string), 1),
			U(P(Ap), { class: "patch-arrow" }),
			H("div", Lm, k(e.new_string), 1),
			r(e.status) ? (z(), B("div", Rm, [U(P(jp)), ia(k(P(Y)(`patch.${e.status}`)), 1)])) : W("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, k(e.stage.text), 513)) : (z(), B("div", zm, k(P(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/message/model.ts
function Vm(e, t, n, r) {
	return e && al(e)?.workflows?.[t]?.stages?.[n] || r;
}
function Hm(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return tp(e?.actors[t]?.color, n);
}
function Um(e) {
	return G(() => {
		let t = e(), n = Vf(t), r = Jd.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Rc(r.presetId);
			return {
				live: !0,
				running: r.status === "running",
				genId: r.genId,
				preset: e,
				workflow: r.workflow,
				transport: r.transport,
				error: r.error,
				stages: r.stages.map((t) => ({
					...t,
					label: Vm(e, r.workflow, t.id, t.label),
					color: Hm(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Rc(n.presetId);
		return {
			live: !1,
			running: !1,
			genId: n.genId,
			preset: i,
			workflow: n.workflow,
			transport: n.transport,
			sidecar: n,
			stages: n.stages.map((e) => ({
				id: e.id,
				actor: e.actor,
				kind: e.kind,
				label: Vm(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: Hm(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/actions.ts
async function Wm(t) {
	let n = e().chat[t], r = Cl(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes), wl(t, {
		...r,
		patchesApplied: i
	}), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), If();
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var Gm = { class: "stage-bar" }, Km = ["onClick"], qm = { class: "ellipsis" }, Jm = {
	key: 0,
	class: "chip stage-chip error"
}, Ym = { class: "ellipsis" }, Xm = { class: "badge warn" }, Zm = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, Qm = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Um(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = G(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = G(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = G(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = G(() => o.value.find((e) => e.id === s.value) ?? null);
		tr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = K().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: om,
			content: Jp,
			patch: Zp
		}, d = (e) => e.status === "streaming" ? nm : e.status === "interrupted" ? Vp : e.status === "missing" ? zp : u[e.kind], f = G(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = G(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = G(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (z(), B("div", {
			key: 0,
			class: O(["stages", { live: P(n).running }])
		}, [H("div", Gm, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: O(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ce({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(Rr(d(e)), { class: O({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", qm, k(e.label), 1)], 14, Km))), 128)),
			P(n).error ? (z(), B("span", Jm, [U(P(Cm)), H("span", Ym, k(P(n).error), 1)])) : W("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(Nm, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [H("span", Xm, [U(P(Cm)), ia(k(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : W("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(wm) : P(fm),
				label: p.value.patchesApplied ? P(Y)("stages.revertDraft") : P(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(Wm)(e.mesid)
			}, null, 8, ["icon", "label"])) : W("", !0),
			P(n).running ? W("", !0) : (z(), V(Nm, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [H("span", Zm, [U(P($p))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(Bm, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : W("", !0)], 2)) : W("", !0);
	}
}), $m = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), eh = /* @__PURE__ */ new Set([
	"EM",
	"STRONG",
	"I",
	"B",
	"U",
	"S",
	"DEL",
	"CODE",
	"SPAN",
	"SMALL",
	"MARK"
]), th = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function nh(e) {
	return th(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function rh(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${nh(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${nh(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${nh(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function ih(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = ih(e, t);
			n && i.appendChild(n);
		}
	};
	if (!$m.has(r) && !eh.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = ih(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function ah(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return rh(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", rh(e.textContent));
			continue;
		}
		let t = ih(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var oh = { class: "reply-name xs" }, sh = ["innerHTML"], ch = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = G(() => ah(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: Ce({ "--actor": e.color })
		}, [H("div", oh, k(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, sh)], 4));
	}
}), lh = { class: "card mini-card" }, uh = { class: "card-head" }, dh = { class: "card-title" }, fh = { class: "card-body pre" }, ph = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (z(), B("div", lh, [H("header", uh, [
			U(P(Em), { class: "section-icon" }),
			H("span", dh, k(P(Y)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(Of)(e.text)
			}, [U(P(xm)), ia(k(P(Y)("cards.fillInput")), 1)])
		]), H("div", fh, k(e.text), 1)]));
	}
}), mh = ["aria-label"], hh = ["title", "onClick"], gh = { class: "option-label" }, _h = { class: "option-content small muted" }, vh = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => Of(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (z(), B("div", {
			class: "options-grid",
			role: "list",
			"aria-label": P(Y)("cards.options")
		}, [(z(!0), B(R, null, L(e.options, (e, n) => (z(), B("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: P(Y)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [H("span", gh, k(e.label), 1), H("span", _h, k(e.content), 1)], 8, hh))), 128))], 8, mh));
	}
}), yh = {
	key: 0,
	class: "memory-ops"
}, bh = { class: "ellipsis" }, xh = ["aria-label", "onClick"], Sh = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = G(() => {
			let e = J(t.preset), n = e.globalMemory.log;
			return t.events.flatMap((t) => {
				if (t.type === "memory.replace") return [{
					scope: "chat",
					op: "replace",
					key: t.key,
					content: t.content
				}];
				if (t.type === "memory.delete") return [{
					scope: "chat",
					op: "delete",
					key: t.key
				}];
				if (t.type === "global.ref") {
					let r = n[t.index];
					if (!r) return [];
					let i = n.slice(t.index + 1, e.globalMemory.cursor).some((e) => e.key === r.key && e.source === "undo");
					return [{
						scope: "global",
						op: r.op,
						key: r.key,
						content: r.content,
						index: t.index,
						undone: i
					}];
				}
				return [];
			});
		});
		function r(e) {
			e.index !== void 0 && Ll(J(t.preset), e.index);
		}
		return (e, t) => n.value.length ? (z(), B("div", yh, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(Nm, {
			key: t,
			text: e.op === "delete" ? P(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [H("span", { class: O(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(Rr(e.scope === "global" ? P(Qp) : P(im)), { class: "faint" })),
				H("span", bh, k(e.key), 1),
				(z(), V(Rr(e.op === "delete" ? P(Sm) : P(um)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [U(P(wm))], 8, xh)) : W("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : W("", !0);
	}
}), Ch = ["aria-label"], wh = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Mm(n, () => t);
		return (t, a) => e.text ? (z(), B("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onMouseenter: a[2] ||= (e) => r.value = !0,
			onMouseleave: a[3] ||= (e) => r.value = !1
		}, [H("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: a[0] ||= es((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(P(Bp))], 40, Ch), P(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : W("", !0)], 544)) : W("", !0);
	}
}), Th = { class: "card-title" }, Eh = {
	key: 0,
	class: "card-body"
}, Dh = /* @__PURE__ */ I({
	__name: "Section",
	props: {
		title: {},
		icon: {},
		help: {},
		collapsible: { type: Boolean },
		open: { type: Boolean },
		tone: {}
	},
	setup(e) {
		let t = /* @__PURE__ */ N(e.open ?? !0);
		return (n, r) => (z(), B("section", { class: O(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [H("header", {
			class: O(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (z(), V(Rr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : W("", !0),
			H("span", Th, k(e.title), 1),
			U(wh, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= es(() => {}, ["stop"])
			}, [Vr(n.$slots, "actions")]),
			e.collapsible ? (z(), V(P(Lp), {
				key: 1,
				class: O(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : W("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", Eh, [Vr(n.$slots, "default")])) : W("", !0)], 2));
	}
}), Oh = {
	key: 0,
	class: "badge neutral"
}, kh = { class: "pre small" }, Ah = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(Dh, {
			title: P(Y)("cards.recap"),
			icon: P(gm),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? W("", !0) : (z(), B("span", Oh, "#0–" + k(e.coversUpTo), 1))]),
			default: F(() => [H("div", kh, k(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), jh = { class: "synopsis-line small" }, Mh = {
	key: 0,
	class: "row tight"
}, Nh = {
	key: 1,
	class: "row tight"
}, Ph = { class: "synopsis-event ellipsis" }, Fh = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, Ih = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: { synopsis: {} },
	setup(e) {
		let t = /* @__PURE__ */ N(!1);
		return (n, r) => (z(), B("div", {
			class: O(["synopsis", { open: t.value }]),
			onClick: r[0] ||= (e) => t.value = !t.value
		}, [H("div", jh, [
			e.synopsis.time ? (z(), B("span", Mh, [U(P(Hp), { class: "faint" }), ia(k(e.synopsis.time), 1)])) : W("", !0),
			e.synopsis.location ? (z(), B("span", Nh, [U(P(rm), { class: "faint" }), ia(k(e.synopsis.location), 1)])) : W("", !0),
			H("span", Ph, k(e.synopsis.event), 1)
		]), t.value && e.synopsis.summary ? (z(), B("div", Fh, k(e.synopsis.summary), 1)) : W("", !0)], 2));
	}
}), Lh = ["innerHTML"], Rh = {
	key: 1,
	class: "kv-list small"
}, zh = { class: "pre" }, Bh = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = G(() => typeof t.value == "string" ? ah(t.value) : "");
		return (t, r) => (z(), V(Dh, {
			title: e.title,
			icon: P(vm),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, Lh)) : (z(), B("dl", Rh, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, k(t), 1), H("dd", zh, k(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Vh = {
	key: 0,
	class: "cards"
}, Hh = /* @__PURE__ */ I({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Um(() => t.mesid), r = G(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: yc(r, Gc(r), r.narrator),
				color: Hm(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: o?.type === "recap.set" ? o : null,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: ol(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (e, t) => r.value ? (z(), B("div", Vh, [
			r.value.reply ? (z(), V(ch, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : W("", !0),
			r.value.impersonate ? (z(), V(ph, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : W("", !0),
			r.value.options.length ? (z(), V(vh, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : W("", !0),
			r.value.synopsis ? (z(), V(Ih, {
				key: 3,
				synopsis: r.value.synopsis
			}, null, 8, ["synopsis"])) : W("", !0),
			r.value.memory.length ? (z(), V(Sh, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : W("", !0),
			r.value.recap ? (z(), V(Ah, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : W("", !0),
			(z(!0), B(R, null, L(r.value.custom, (e) => (z(), V(Bh, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : W("", !0);
	}
}), Uh = {
	key: 0,
	class: "dock stages live"
}, Wh = { class: "stage-bar" }, Gh = { class: "ellipsis" }, Kh = {
	key: 0,
	class: "small muted"
}, qh = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = G(() => Jd.current && !Jd.current.streaming && Jd.current.status === "running" ? Jd.current : null), n = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = Rc(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: Vm(n, e.workflow, t.id, t.label),
				color: Hm(n, t.actor)
			}));
		}), r = G(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", Uh, [H("div", Wh, [
			U(P(nm), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: O(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ce({ "--actor": e.color })
			}, [H("span", Gh, k(e.label), 1)], 6))), 128)),
			n.value.length ? W("", !0) : (z(), B("span", Kh, k(P(Y)("stages.waiting")), 1))
		]), r.value ? (z(), V(Bm, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : W("", !0)])) : W("", !0);
	}
}), Jh = ["aria-label"], Yh = ["disabled"], Xh = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ Jr({
		label: {},
		disabled: { type: Boolean }
	}, {
		modelValue: {
			type: Boolean,
			default: !1
		},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = $r(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			Jn(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, Yh), [[Go, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 8, Jh));
	}
});
//#endregion
//#region src/app/install.ts
function Zh(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function Qh(e, t) {
	if (!Fc(e)) throw Error(Y("presets.invalid"));
	if (e.minAdvancedPreset && ac("1.0.1", e.minAdvancedPreset) < 0) throw Error(Y("presets.tooNew", { version: e.minAdvancedPreset }));
	zc(e), t && (K().sources[e.id] = t), q();
	let n = Rc(e.id) ?? e;
	return tl(n), await _l(n), n;
}
async function $h(e) {
	let t = await c(Zh(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return Qh(await t.json(), e.trim());
}
async function eg(e) {
	return Qh(JSON.parse(await e.text()));
}
async function tg(t) {
	if (Bc(t), delete K().sources[t], q(), Hc(t)) {
		let e = Rc(t);
		e && (tl(e), await _l(e));
		return;
	}
	let n = hl(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/components/Field.vue?vue&type=script&setup=true&lang.ts
var ng = { class: "field-label" }, rg = { class: "ellipsis" }, ig = {
	key: 0,
	class: "dot modified"
}, ag = { class: "field-control" }, og = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: O(["field", { inline: e.inline }]) }, [H("div", ng, [
			H("span", rg, k(e.label), 1),
			e.modified ? (z(), B("span", ig)) : W("", !0),
			U(wh, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", ag, [Vr(t.$slots, "default")])], 2));
	}
}), sg = { class: "swatches" }, cg = ["title"], lg = ["title"], ug = /* @__PURE__ */ I({
	__name: "Appearance",
	setup(e) {
		let t = K().ui, n = (e) => G({
			get: () => t[e] ?? "",
			set: (n) => {
				t[e] = n || void 0, q();
			}
		}), r = n("primary"), i = n("accent"), a = G({
			get: () => t.collapseStages,
			set: (e) => {
				t.collapseStages = e, q();
			}
		}), o = () => {
			t.primary = void 0, t.accent = void 0, q();
		};
		return (e, t) => (z(), V(Dh, {
			title: P(Y)("appearance.title"),
			icon: P(cm),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [U(og, {
				label: P(Y)("appearance.colors"),
				help: P(Y)("appearance.colors.hint"),
				inline: ""
			}, {
				default: F(() => [H("div", sg, [
					H("label", {
						class: "swatch",
						style: Ce({ background: P(r) || "var(--ap-primary-500)" }),
						title: P(Y)("appearance.primary")
					}, [Jn(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ M(r) ? r.value = e : null,
						type: "color"
					}, null, 512), [[
						Wo,
						P(r),
						void 0,
						{ lazy: !0 }
					]])], 12, cg),
					H("label", {
						class: "swatch",
						style: Ce({ background: P(i) || "var(--ap-accent-500)" }),
						title: P(Y)("appearance.accent")
					}, [Jn(H("input", {
						"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ M(i) ? i.value = e : null,
						type: "color"
					}, null, 512), [[
						Wo,
						P(i),
						void 0,
						{ lazy: !0 }
					]])], 12, lg),
					U($, {
						icon: P(mm),
						label: P(Y)("common.reset"),
						small: "",
						align: "end",
						disabled: !P(r) && !P(i),
						onClick: o
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				])]),
				_: 1
			}, 8, ["label", "help"]), U(og, {
				label: P(Y)("appearance.collapseStages"),
				inline: ""
			}, {
				default: F(() => [U(Xh, {
					modelValue: a.value,
					"onUpdate:modelValue": t[2] ||= (e) => a.value = e
				}, null, 8, ["modelValue"])]),
				_: 1
			}, 8, ["label"])]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), dg = { class: "toolbar" }, fg = ["disabled"], pg = ["disabled"], mg = { class: "preset-list" }, hg = ["onClick", "onKeydown"], gg = { class: "preset-mark" }, _g = { class: "grow col preset-info" }, vg = { class: "row wrap preset-head" }, yg = { class: "preset-name" }, bg = { class: "badge neutral" }, xg = {
	key: 0,
	class: "xs muted"
}, Sg = {
	key: 1,
	class: "small muted preset-desc"
}, Cg = {
	key: 0,
	class: "empty"
}, wg = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = G(() => Ic()), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N(!1), i = /* @__PURE__ */ N(""), a = /* @__PURE__ */ N(null);
		async function o(e, t, r) {
			n.value = e;
			try {
				await t(), r && s("success", r);
			} catch (e) {
				s("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				n.value = null;
			}
		}
		let c = (e) => o(`select:${e.preset.id}`, async () => {
			await vl(e.preset), Lf();
		}), l = () => o("url", async () => {
			let e = await $h(i.value);
			return i.value = "", r.value = !1, e;
		}, Y("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && o("file", () => eg(t), Y("presets.installed")), e.target.value = "";
		}, d = (e) => o(`update:${e.preset.id}`, () => $h(K().sources[e.preset.id]), Y("presets.updated")), f = (e) => o(`remove:${e.preset.id}`, () => tg(e.preset.id)), p = () => o("ext", async () => s("info", await yf() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, o) => (z(), B(R, null, [
			H("div", dg, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: n.value === "file",
					onClick: o[0] ||= (e) => a.value?.click()
				}, [U(P(Tm)), ia(k(P(Y)("presets.importFile")), 1)], 8, fg),
				H("button", {
					type: "button",
					class: O(["btn", { primary: r.value }]),
					onClick: o[1] ||= (e) => r.value = !r.value
				}, [U(P(tm)), ia(k(P(Y)("presets.importUrl")), 1)], 2),
				o[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: n.value === "ext" ? P(nm) : P(pm),
					label: P(Y)("presets.checkUpdates"),
					align: "end",
					disabled: n.value === "ext",
					onClick: p
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				H("input", {
					ref_key: "fileInput",
					ref: a,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			r.value ? (z(), B("form", {
				key: 0,
				class: "row",
				onSubmit: es(l, ["prevent"])
			}, [Jn(H("input", {
				"onUpdate:modelValue": o[2] ||= (e) => i.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Wo, i.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: n.value === "url"
			}, [n.value === "url" ? (z(), V(P(nm), {
				key: 0,
				class: "spin"
			})) : (z(), V(P(Kp), { key: 1 })), ia(k(P(Y)("common.install")), 1)], 8, pg)], 32)) : W("", !0),
			H("div", mg, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: O(["preset-item", { on: P(Rf)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: ns((t) => c(e), ["enter"])
			}, [
				H("span", gg, [n.value === `select:${e.preset.id}` ? (z(), V(P(nm), {
					key: 0,
					class: "spin"
				})) : P(Rf)?.id === e.preset.id ? (z(), V(P(Ip), { key: 1 })) : W("", !0)]),
				H("div", _g, [
					H("div", vg, [
						H("span", yg, k(e.preset.name), 1),
						H("span", bg, "v" + k(e.preset.version), 1),
						e.source === "builtin" ? W("", !0) : (z(), B("span", {
							key: 0,
							class: O(["badge", { warn: e.source === "dev" }])
						}, k(P(Y)(`presets.source.${e.source}`)), 3))
					]),
					e.preset.author ? (z(), B("span", xg, k(e.preset.author), 1)) : W("", !0),
					e.preset.description ? (z(), B("span", Sg, k(e.preset.description), 1)) : W("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: o[3] ||= es(() => {}, ["stop"])
				}, [e.source === "installed" && P(K)().sources[e.preset.id] ? (z(), V($, {
					key: 0,
					icon: P(pm),
					label: P(Y)("presets.update"),
					align: "end",
					small: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : W("", !0), e.source === "installed" ? (z(), V($, {
					key: 1,
					icon: P(Sm),
					label: P(Y)("common.delete"),
					align: "end",
					small: "",
					danger: "",
					onClick: (t) => f(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : W("", !0)])
			], 42, hg))), 128)), t.value.length ? W("", !0) : (z(), B("div", Cg, k(P(Y)("presets.none")), 1))]),
			U(ug)
		], 64));
	}
}), Tg;
function Eg() {
	let e = Rf, t = G(() => e.value ? Gc(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (qc(r, t), n.sampling && (clearTimeout(Tg), Tg = setTimeout(() => void yl(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Dg = { class: "empty" }, Og = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", Dg, [
			U(P(sm)),
			H("span", null, k(P(Y)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(Z).tab = "presets"
			}, k(P(Y)("panel.choosePreset")), 1)
		]));
	}
}), kg = [
	"aria-checked",
	"title",
	"onClick"
], Ag = { class: "ellipsis" }, jg = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ Jr({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = $r(e, "modelValue");
		return (n, r) => (z(), B("div", {
			class: O(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(z(!0), B(R, null, L(e.options, (e) => (z(), B("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: O({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (z(), V(Rr(e.icon), { key: 0 })) : W("", !0), H("span", Ag, k(e.label), 1)], 10, kg))), 128))], 2));
	}
}), Mg = { class: "col" }, Ng = { class: "row" }, Pg = ["aria-label"], Fg = ["label"], Ig = ["value"], Lg = ["label"], Rg = ["value"], zg = ["placeholder"], Bg = {
	key: 1,
	class: "xs muted row tight"
}, Vg = { value: "" }, Hg = ["value"], Ug = ["value"], Wg = { class: "slider" }, Gg = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], Kg = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], qg = { class: "field-grid" }, Jg = ["value", "onChange"], Yg = ["value"], Xg = ["value"], Zg = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Eg(), i = G(() => t.value ? J(t.value) : null), a = G({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Jc(n, {
					kind: r,
					id: i.join(":")
				}), yl(n);
			}
		}), o = G(() => t.value ? Yc(t.value) : !1), s = G(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ N(null), l = /* @__PURE__ */ N("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? Zc(e, n) : s.value && $c(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (Xc(t.value), yl(t.value));
		}, p = () => {
			t.value && s.value && (el(t.value, s.value), yl(t.value));
		}, m = () => {
			t.value && s.value && Qc(t.value, s.value);
		}, h = G(() => fs.map((e) => ({
			value: e,
			label: Y(`transport.${e}`),
			hint: Y(`transport.${e}.hint`)
		}))), g = G({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), _ = G(() => g.value === "tool-single" || g.value === "tool-multi"), v = G(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = G(() => v.value.map((e) => ({
			value: e.id,
			label: ol(t.value, "workflows", e.id, "name", e.name),
			hint: ol(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), b = G({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), x = G(() => y.value.find((e) => e.value === b.value)?.hint);
		function S(e) {
			return G({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let C = S("forceTool"), ee = S("parallelTools"), te = S("sendThoughtSignature"), w = S("finalFallback"), T = S("maxSteps"), E = G({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), D = [
			{
				key: "temperature",
				min: 0,
				max: 2,
				step: .01
			},
			{
				key: "top_p",
				min: 0,
				max: 1,
				step: .01
			},
			{
				key: "top_k",
				min: 0,
				max: 500,
				step: 1
			},
			{
				key: "min_p",
				min: 0,
				max: 1,
				step: .001
			},
			{
				key: "top_a",
				min: 0,
				max: 1,
				step: .001
			},
			{
				key: "frequency_penalty",
				min: -2,
				max: 2,
				step: .01
			},
			{
				key: "presence_penalty",
				min: -2,
				max: 2,
				step: .01
			},
			{
				key: "repetition_penalty",
				min: 1,
				max: 2,
				step: .01
			}
		], ne = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], re = ["stream_openai", "show_thoughts"], ie = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], ae = G(() => n.value?.sampling ?? {}), oe = (e) => e in ae.value, se = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), ce = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (z(), V(Og, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", Mg, [
				H("div", Ng, [
					Jn(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(Y)("config.configuration")
					}, [H("optgroup", { label: P(Y)("config.recommended") }, [(z(!0), B(R, null, L(P(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, k(P(ol)(P(t), "configurations", e.id, "name", e.name)), 9, Ig))), 128))], 8, Fg), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: P(Y)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, k(e.name), 9, Rg))), 128))], 8, Lg)) : W("", !0)], 8, Pg), [[qo, a.value]]),
					s.value && o.value ? (z(), V($, {
						key: 0,
						icon: P(hm),
						label: P(Y)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: P(dm),
						label: P(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (z(), V($, {
						key: 1,
						icon: P(um),
						label: P(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : W("", !0),
					s.value ? (z(), V($, {
						key: 2,
						icon: P(Sm),
						label: P(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: P(mm),
						label: P(Y)("config.reset"),
						align: "end",
						disabled: !o.value,
						onClick: f
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				c.value ? (z(), B("form", {
					key: 0,
					class: "row",
					onSubmit: es(d, ["prevent"])
				}, [
					Jn(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: P(Y)("config.name"),
						autofocus: ""
					}, null, 8, zg), [[Wo, l.value]]),
					U($, {
						icon: P(Om),
						label: P(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: P(Ip),
						label: P(Y)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : W("", !0),
				o.value ? (z(), B("span", Bg, [r[14] ||= H("span", { class: "dot modified" }, null, -1), ia(k(P(Y)("config.modified")), 1)])) : W("", !0)
			]),
			U(Dh, {
				title: P(Y)("config.connection"),
				icon: P(Fp)
			}, {
				default: F(() => [
					U(og, {
						label: P(Y)("config.transport"),
						help: P(Y)(`transport.${g.value}.hint`)
					}, {
						default: F(() => [U(jg, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (z(), B(R, { key: 0 }, [
						U(og, {
							label: P(Y)("config.forceTool"),
							help: P(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [U(Xh, {
								modelValue: P(C),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ M(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(og, {
							label: P(Y)("config.parallelTools"),
							help: P(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [U(Xh, {
								modelValue: P(ee),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ M(ee) ? ee.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(og, {
							label: P(Y)("config.syntheticTurn"),
							help: P(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [Jn(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => E.value = e,
								class: "input"
							}, [H("option", Vg, k(P(Y)("common.none")), 1), (z(!0), B(R, null, L(P(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, k(e.label), 9, Hg))), 128))], 512), [[qo, E.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(og, {
							label: P(Y)("config.thoughtSignature"),
							help: P(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [U(Xh, {
								modelValue: P(te),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ M(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (z(), V(og, {
							key: 0,
							label: P(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(T),
								onChange: r[10] ||= (e) => T.value = ce(e)
							}, null, 40, Ug)]),
							_: 1
						}, 8, ["label"])) : W("", !0)
					], 64)) : W("", !0),
					U(og, {
						label: P(Y)("config.finalFallback"),
						help: P(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [U(Xh, {
							modelValue: P(w),
							"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ M(w) ? w.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (z(), V(Dh, {
				key: 0,
				title: P(Y)("config.workflow"),
				icon: P(Dm),
				help: x.value
			}, {
				default: F(() => [U(jg, {
					modelValue: b.value,
					"onUpdate:modelValue": r[12] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			U(Dh, {
				title: P(Y)("config.sampling"),
				icon: P(Xp),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(z(), B(R, null, L(D, (e) => (z(), B(R, { key: e.key }, [oe(e.key) ? (z(), V(og, {
						key: 0,
						label: P(Y)(`sampling.${e.key}`)
					}, {
						default: F(() => [H("div", Wg, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: ae.value[e.key],
							onInput: (t) => se(e.key, ce(t))
						}, null, 40, Gg), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: ae.value[e.key],
							onChange: (t) => se(e.key, ce(t))
						}, null, 40, Kg)])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)),
					H("div", qg, [(z(), B(R, null, L(ne, (e) => (z(), B(R, { key: e }, [oe(e) ? (z(), V(og, {
						key: 0,
						label: P(Y)(`sampling.${e}`)
					}, {
						default: F(() => [H("input", {
							class: "input",
							type: "number",
							value: ae.value[e],
							onChange: (t) => se(e, ce(t))
						}, null, 40, Jg)]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)), oe("reasoning_effort") ? (z(), V(og, {
						key: 0,
						label: P(Y)("sampling.reasoning_effort")
					}, {
						default: F(() => [H("select", {
							class: "input",
							value: ae.value.reasoning_effort,
							onChange: r[13] ||= (e) => se("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(ie, (e) => H("option", {
							key: e,
							value: e
						}, k(P(Y)(`effort.${e}`)), 9, Xg)), 64))], 40, Yg)]),
						_: 1
					}, 8, ["label"])) : W("", !0)]),
					(z(), B(R, null, L(re, (e) => (z(), B(R, { key: e }, [oe(e) ? (z(), V(og, {
						key: 0,
						label: P(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [U(Xh, {
							"model-value": !!ae.value[e],
							"onUpdate:modelValue": (t) => se(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), Qg = ["aria-checked", "onClick"], $g = { class: "grow" }, e_ = ["aria-checked", "onClick"], t_ = { class: "grow muted" }, n_ = { class: "grow" }, r_ = { class: "ellipsis" }, i_ = {
	key: 0,
	class: "empty"
}, a_ = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Eg(), i = G(() => t.value && n.value ? _c(t.value, n.value) : {}), a = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))];
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? ol(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && ol(e, "groups", t, "description", r?.description ?? "") || void 0,
					allowNone: !!r?.allowNone,
					choices: a.map((e) => ({
						key: e,
						modules: i.filter((t) => t.exclusive === e)
					})),
					toggles: i.filter((e) => !e.exclusive)
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => ol(t.value, "modules", e.id, "name", e.name), s = (e) => ol(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
		function l(e, t) {
			r((n) => {
				for (let r of e.modules) n.modules[r.id] = r.id === t;
			});
		}
		function u(e, t) {
			r((n) => {
				n.modules[e.id] = t;
			});
		}
		return (e, r) => !P(t) || !P(n) ? (z(), V(Og, { key: 0 })) : (z(), B(R, { key: 1 }, [(z(!0), B(R, null, L(a.value, (e) => (z(), V(Dh, {
			key: e.id,
			title: e.label,
			help: e.help
		}, {
			default: F(() => [(z(!0), B(R, null, L(e.choices, (t) => (z(), B("div", {
				key: t.key,
				class: "choice-list",
				role: "radiogroup"
			}, [(z(!0), B(R, null, L(t.modules, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				role: "radio",
				class: O(["choice", { on: c(t) === e.id }]),
				"aria-checked": c(t) === e.id,
				onClick: (n) => l(t, e.id)
			}, [
				r[0] ||= H("span", { class: "radio" }, null, -1),
				H("span", $g, k(o(e)), 1),
				U(wh, {
					text: s(e),
					align: "end"
				}, null, 8, ["text"])
			], 10, Qg))), 128)), e.allowNone ? (z(), B("button", {
				key: 0,
				type: "button",
				role: "radio",
				class: O(["choice", { on: c(t) === null }]),
				"aria-checked": c(t) === null,
				onClick: (e) => l(t, null)
			}, [r[1] ||= H("span", { class: "radio" }, null, -1), H("span", t_, k(P(Y)("common.none")), 1)], 10, e_)) : W("", !0)]))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
				key: e.id,
				class: "module-row"
			}, [H("span", n_, [H("span", r_, k(o(e)), 1), U(wh, {
				text: s(e),
				align: "start"
			}, null, 8, ["text"])]), U(Xh, {
				"model-value": i.value[e.id],
				label: o(e),
				"onUpdate:modelValue": (t) => u(e, t)
			}, null, 8, [
				"model-value",
				"label",
				"onUpdate:modelValue"
			])]))), 128))]),
			_: 2
		}, 1032, ["title", "help"]))), 128)), a.value.length ? W("", !0) : (z(), B("div", i_, k(P(Y)("modules.none")), 1))], 64));
	}
}), o_ = ["value", "onChange"], s_ = ["value"], c_ = {
	key: 1,
	class: "unit"
}, l_ = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], u_ = {
	key: 0,
	class: "small muted"
}, d_ = [
	"list",
	"value",
	"placeholder",
	"onChange"
], f_ = ["id"], p_ = ["value"], m_ = [
	"value",
	"placeholder",
	"onChange"
], h_ = [
	"value",
	"placeholder",
	"onChange"
], g_ = {
	key: 0,
	class: "field-grid"
}, __ = ["value"], v_ = ["value"], y_ = ["value"], b_ = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Eg(), i = G(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? ol(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && ol(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => ol(t.value, "params", e.id, "label", e.label), o = (e) => ol(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => al(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => n.value?.params[e.id] ?? e.default, l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = G(() => Object.entries(t.value?.actors ?? {})), d = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), f = G({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), p = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), m = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), h = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (z(), V(Og, { key: 0 })) : (z(), B(R, { key: 1 }, [
			(z(!0), B(R, null, L(i.value, (e) => (z(), V(Dh, {
				key: e.id,
				title: e.label,
				help: e.help,
				icon: P(bm)
			}, {
				default: F(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(og, {
					key: e.id,
					label: a(e),
					help: o(e)
				}, {
					default: F(() => [e.type === "select" ? (z(), B("select", {
						key: 0,
						class: "input",
						value: c(e),
						onChange: (t) => l(e, t.target.value)
					}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
						key: String(t.value),
						value: t.value
					}, k(s(e, t.value, t.label)), 9, s_))), 128))], 40, o_)) : e.type === "number" ? (z(), B("div", c_, [H("input", {
						class: "input",
						type: "number",
						min: e.min,
						max: e.max,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, l_), e.unit ? (z(), B("span", u_, k(e.unit), 1)) : W("", !0)])) : (z(), B(R, { key: 2 }, [H("input", {
						class: "input",
						list: e.options?.length ? h(e) : void 0,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, d_), e.options?.length ? (z(), B("datalist", {
						key: 0,
						id: h(e)
					}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
						key: String(t.value),
						value: t.value
					}, k(s(e, t.value, t.label)), 9, p_))), 128))], 8, f_)) : W("", !0)], 64))]),
					_: 2
				}, 1032, ["label", "help"]))), 128))]),
				_: 2
			}, 1032, [
				"title",
				"help",
				"icon"
			]))), 128)),
			U(Dh, {
				title: P(Y)("writing.actors"),
				icon: P(qp),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(z(!0), B(R, null, L(u.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(og, { label: P(Y)("writing.actorName", { actor: e }) }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => d("names", e, t.target.value)
					}, null, 40, m_)]),
					_: 2
				}, 1032, ["label"]), U(og, { label: P(Y)("writing.actorPrefix") }, {
					default: F(() => [H("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => d("prefixes", e, t.target.value)
					}, null, 40, h_)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Dh, {
				title: P(Y)("writing.tokenSaving"),
				icon: P(Wp),
				help: P(Y)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [U(Xh, {
					modelValue: f.value,
					"onUpdate:modelValue": r[0] ||= (e) => f.value = e,
					label: P(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [f.value ? (z(), B("div", g_, [U(og, {
					label: P(Y)("writing.keepFullTurns"),
					help: P(Y)("writing.keepFullTurns.hint")
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).tokenSaving.keepFullTurns,
						onChange: r[1] ||= (e) => p("keepFullTurns", e.target.value)
					}, null, 40, __)]),
					_: 1
				}, 8, ["label", "help"]), U(og, {
					label: P(Y)("writing.truncateUserAfter"),
					help: P(Y)("writing.truncateUserAfter.hint")
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).tokenSaving.truncateUserAfter,
						onChange: r[2] ||= (e) => p("truncateUserAfter", e.target.value)
					}, null, 40, v_)]),
					_: 1
				}, 8, ["label", "help"])])) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Dh, {
				title: P(Y)("writing.meta"),
				icon: P(am)
			}, {
				default: F(() => [U(og, {
					label: P(Y)("writing.recentCount"),
					help: P(Y)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: F(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: P(n).meta.recentCount,
						onChange: r[3] ||= (e) => m(e.target.value)
					}, null, 40, y_)]),
					_: 1
				}, 8, ["label", "help"])]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), x_ = { class: "kv" }, S_ = {
	key: 0,
	class: "kv-row"
}, C_ = { class: "kv-key ellipsis" }, w_ = { class: "kv-value pre small" }, T_ = {
	key: 0,
	class: "kv-actions"
}, E_ = {
	key: 1,
	class: "kv-edit col"
}, D_ = ["placeholder"], O_ = ["placeholder"], k_ = { class: "row end" }, A_ = {
	key: 0,
	class: "kv-edit col"
}, j_ = ["placeholder"], M_ = ["placeholder"], N_ = { class: "row end" }, P_ = {
	key: 1,
	class: "faint small kv-empty"
}, F_ = /* @__PURE__ */ I({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(null), a = /* @__PURE__ */ N(""), o = /* @__PURE__ */ N("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (z(), B("div", x_, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", E_, [
				Jn(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(Y)("memory.key")
				}, null, 8, D_), [[Wo, a.value]]),
				Jn(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(Y)("memory.content")
				}, null, 8, O_), [[Wo, o.value]]),
				H("div", k_, [U($, {
					icon: P(Om),
					label: P(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(Ip),
					label: P(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", S_, [
				H("div", C_, k(l), 1),
				H("div", w_, k(t), 1),
				e.readonly ? W("", !0) : (z(), B("div", T_, [U($, {
					icon: P(um),
					label: P(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: P(Sm),
					label: P(Y)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: (e) => r("remove", String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])]))
			]))], 64))), 128)),
			i.value === "" ? (z(), B("div", A_, [
				Jn(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(Y)("memory.key")
				}, null, 8, j_), [[Wo, a.value]]),
				Jn(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(Y)("memory.content")
				}, null, 8, M_), [[Wo, o.value]]),
				H("div", N_, [U($, {
					icon: P(Om),
					label: P(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: P(Ip),
					label: P(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : W("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", P_, k(P(Y)("memory.empty")), 1)) : W("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(P(dm)), ia(k(P(Y)("common.add")), 1)])) : W("", !0)
		]));
	}
}), I_ = {
	key: 1,
	class: "faint small"
}, L_ = {
	key: 0,
	class: "badge neutral"
}, R_ = ["placeholder"], z_ = {
	key: 1,
	class: "faint small"
}, B_ = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Eg(), r = G(() => n.value ? J(n.value) : null), i = G(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = G(() => (Z.chatRev, i.value ? Ol() : {})), o = G(() => r.value ? jl(r.value) : {}), s = G(() => (Z.chatRev, i.value ? kl() : null));
		async function c(e, t) {
			await Al({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), If();
		}
		async function l(e) {
			await Al({
				type: "memory.delete",
				key: e,
				source: "user"
			}), If();
		}
		let u = (e, t) => r.value && Ml(r.value, "replace", e, t, "user"), d = (e) => r.value && Ml(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ N("");
		tr(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = G(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Al({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), If();
		}
		return (e, t) => !P(n) || !r.value ? (z(), V(Og, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(Dh, {
				title: P(Y)("memory.chat"),
				icon: P(im),
				help: P(Y)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (z(), V(F_, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (z(), B("div", I_, k(P(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Dh, {
				title: P(Y)("memory.global"),
				icon: P(Qp),
				help: P(Y)("memory.global.hint")
			}, {
				actions: F(() => [U($, {
					icon: P(wm),
					label: P(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(Nl)(r.value),
					onClick: t[0] ||= (e) => P(Fl)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: P(fm),
					label: P(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(Pl)(r.value),
					onClick: t[1] ||= (e) => P(Il)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [U(F_, {
					entries: o.value,
					onSet: u,
					onRemove: d
				}, null, 8, ["entries"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Dh, {
				title: P(Y)("memory.recap"),
				icon: P(gm),
				help: P(Y)("memory.recap.hint")
			}, {
				actions: F(() => [s.value ? (z(), B("span", L_, "#0–" + k(s.value.coversUpTo), 1)) : W("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: P(Ip),
					label: P(Y)("common.save"),
					small: "",
					align: "end",
					disabled: !p.value,
					active: "",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : W("", !0)]),
				default: F(() => [i.value ? Jn((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: P(Y)("memory.recap.empty")
				}, null, 8, R_)), [[Wo, f.value]]) : (z(), B("div", z_, k(P(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), V_ = { class: "row tight xs muted" }, H_ = { class: "row" }, U_ = {
	key: 0,
	class: "xs text-danger"
}, W_ = { class: "row wrap xs muted" }, G_ = { class: "badge neutral" }, K_ = {
	key: 0,
	class: "badge neutral"
}, q_ = { class: "badge neutral" }, J_ = {
	key: 1,
	class: "badge warn"
}, Y_ = ["onClick"], X_ = { class: "grow mono" }, Z_ = { class: "xs muted" }, Q_ = { class: "row xs muted" }, $_ = { class: "badge neutral" }, ev = { class: "pre mono scroll" }, tv = {
	key: 0,
	class: "xs faint region-msg"
}, nv = {
	key: 0,
	class: "xs text-warning"
}, rv = {
	key: 1,
	class: "faint small"
}, iv = ["onClick"], av = { class: "mono grow ellipsis" }, ov = {
	key: 0,
	class: "badge warn"
}, sv = { class: "xs muted" }, cv = { class: "xs muted" }, lv = { class: "row xs muted" }, uv = { class: "grow" }, dv = { class: "mono scroll" }, fv = { class: "row xs muted" }, pv = { class: "grow" }, mv = { class: "mono scroll" }, hv = {
	key: 0,
	class: "faint small"
}, gv = { class: "row xs" }, _v = { class: "badge neutral" }, vv = { class: "muted" }, yv = { class: "mono scroll" }, bv = {
	key: 0,
	class: "faint small"
}, xv = { class: "xs faint mono build" }, Sv = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = G(() => ou.log.find((e) => e.kind === "assembly")?.data), r = /* @__PURE__ */ Zt(/* @__PURE__ */ new Set()), i = (e) => r.has(e) ? r.delete(e) : r.add(e), a = /* @__PURE__ */ Zt({});
		tr(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (a[i] === void 0 && r) try {
					a[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let o = /* @__PURE__ */ N(null), s = (e) => typeof e == "string" ? c(e) : JSON.stringify(e, null, 2);
		function c(e) {
			try {
				return JSON.stringify(JSON.parse(e), null, 2);
			} catch {
				return e;
			}
		}
		let l = (e) => new Date(e).toLocaleTimeString(), u = (e) => navigator.clipboard?.writeText(s(e)), d = (e) => {
			let t = e;
			if (!t) return "";
			let n = t.prompt_tokens ?? t.input_tokens ?? t.promptTokenCount, r = t.completion_tokens ?? t.output_tokens ?? t.candidatesTokenCount;
			return n !== void 0 || r !== void 0 ? `${n ?? "?"} → ${r ?? "?"}` : "";
		}, f = G({
			get: () => K().dev.enabled,
			set: (e) => {
				K().dev.enabled = e, q();
			}
		}), p = G({
			get: () => K().dev.url,
			set: (e) => {
				K().dev.url = e.trim(), q();
			}
		}), m = G(() => ou.log.filter((e) => e.kind !== "assembly"));
		return (e, t) => (z(), B(R, null, [
			U(Dh, {
				title: P(Y)("debug.dev"),
				icon: P(_m),
				help: P(Y)("debug.dev.hint")
			}, {
				actions: F(() => [H("span", V_, [H("span", { class: O(["dot status-dot", P(X).status]) }, null, 2), ia(k(P(Y)(`debug.dev.${P(X).status}`)), 1)])]),
				default: F(() => [U(og, { label: P(Y)("debug.dev.url") }, {
					default: F(() => [H("div", H_, [Jn(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => p.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Wo,
						p.value,
						void 0,
						{ lazy: !0 }
					]]), U(Xh, {
						modelValue: f.value,
						"onUpdate:modelValue": t[1] ||= (e) => f.value = e,
						label: P(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(X).error ? (z(), B("span", U_, k(P(X).error), 1)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Dh, {
				title: P(Y)("debug.assembly"),
				icon: P(Yp),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", W_, [
						H("span", G_, k(P(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", K_, k(n.value.workflow), 1)) : W("", !0),
						H("span", q_, k(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", J_, "dry run")) : W("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						ia(k(l(n.value.at)), 1)
					]),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => i(e.id)
					}, [
						U(P(Rp), { class: O(["faint caret", { open: r.has(e.id) }]) }, null, 8, ["class"]),
						H("span", X_, k(e.id), 1),
						H("span", Z_, k(e.messages.length) + " · " + k(a[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + k(a[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, Y_), r.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", Q_, [H("span", $_, k(e.role), 1), ia(k(e.chars) + " ch", 1)]), H("div", ev, k(e.content), 1)]))), 128)), e.messages.length ? W("", !0) : (z(), B("div", tv, k(P(Y)("debug.emptyRegion")), 1))], 64)) : W("", !0)]))), 128))]),
					n.value.warnings.length ? (z(), B("div", nv, k(n.value.warnings.join(" · ")), 1)) : W("", !0)
				], 64)) : (z(), B("div", rv, k(P(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Dh, {
				title: P(Y)("debug.requests"),
				icon: P(Up),
				collapsible: ""
			}, {
				default: F(() => [(z(!0), B(R, null, L(P(ou).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => o.value = o.value === t ? null : t
				}, [
					H("span", av, k(e.genId) + " · #" + k(e.step), 1),
					e.error ? (z(), B("span", ov, k(P(Y)("debug.error")), 1)) : W("", !0),
					H("span", sv, k(d(e.usage)), 1),
					H("span", cv, k(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, iv), o.value === t ? (z(), B(R, { key: 0 }, [
					H("div", lv, [H("span", uv, k(P(Y)("debug.request")), 1), U($, {
						icon: P(Gp),
						label: P(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", dv, k(s(e.request)), 1),
					H("div", fv, [H("span", pv, k(P(Y)("debug.response")), 1), U($, {
						icon: P(Gp),
						label: P(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", mv, k(e.error ?? s(e.response ?? "")), 1)
				], 64)) : W("", !0)]))), 128)), P(ou).requests.length ? W("", !0) : (z(), B("div", hv, k(P(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Dh, {
				title: P(Y)("debug.log"),
				icon: P(gm),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [U($, {
					icon: P(Sm),
					label: P(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(ou).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(z(!0), B(R, null, L(m.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", gv, [
					H("span", _v, k(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", vv, k(l(e.at)), 1)
				]), H("pre", yv, k(s(e.data)), 1)]))), 128)), m.value.length ? W("", !0) : (z(), B("div", bv, k(P(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H("div", xv, "Advanced Preset " + k(P("1.0.1")) + " · " + k(P("03dc0ffee59cce64")), 1)
		], 64));
	}
}), Cv = ["aria-label"], wv = { class: "panel-head" }, Tv = { class: "panel-logo" }, Ev = { class: "grow" }, Dv = { class: "panel-title ellipsis" }, Ov = { class: "panel-sub ellipsis" }, kv = {
	class: "tabs",
	role: "tablist"
}, Av = [
	"title",
	"aria-selected",
	"onClick"
], jv = { class: "panel-body scroll" }, Mv = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: sm,
				view: wg
			},
			{
				id: "config",
				icon: ym,
				view: Zg
			},
			{
				id: "modules",
				icon: Mp,
				view: a_
			},
			{
				id: "writing",
				icon: lm,
				view: b_
			},
			{
				id: "memory",
				icon: Np,
				view: B_
			},
			{
				id: "debug",
				icon: Pp,
				view: Sv
			}
		], n = G(() => t.find((e) => e.id === Z.tab) ?? t[0]), r = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		}), i = G(() => {
			let e = Rf.value;
			return e ? `v${e.version} · ${zf.value.config}` : Y("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return Nr(() => document.addEventListener("keydown", a)), Fr(() => document.removeEventListener("keydown", a)), (e, a) => (z(), V(Ka, { name: "panel" }, {
			default: F(() => [P(Z).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(Y)("app.name")
			}, [
				H("header", wv, [
					H("div", Tv, [U(P(em))]),
					H("div", Ev, [H("div", Dv, k(P(Rf)?.name ?? P(Y)("app.name")), 1), H("div", Ov, k(i.value), 1)]),
					U(Xh, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: P(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: P(Om),
						label: P(Y)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => P(Z).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				H("nav", kv, [(z(), B(R, null, L(t, (e) => H("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: O(["tab", { on: e.id === P(Z).tab }]),
					title: P(Y)(`tab.${e.id}`),
					"aria-selected": e.id === P(Z).tab,
					onClick: (t) => P(Z).tab = e.id
				}, [(z(), V(Rr(e.icon))), H("span", null, k(P(Y)(`tab.${e.id}`)), 1)], 10, Av)), 64))]),
				H("main", jv, [(z(), V(Dr, null, [(z(), V(Rr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, Cv)) : W("", !0)]),
			_: 1
		}));
	}
}), Nv = { class: "inline-drawer" }, Pv = { class: "inline-drawer-toggle inline-drawer-header" }, Fv = { class: "inline-drawer-content" }, Iv = { class: "flex-container alignItemsCenter spaceBetween" }, Lv = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, Rv = { key: 0 }, zv = { class: "text_muted" }, Bv = {
	key: 1,
	class: "text_muted"
}, Vv = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		});
		return (e, n) => (z(), B("div", Nv, [H("div", Pv, [H("b", null, k(P(Y)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", Fv, [
			H("div", Iv, [H("label", Lv, [Jn(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Go, t.value]]), H("span", null, k(P(Y)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(Hf)(),
				onKeydown: n[2] ||= ns((e) => P(Hf)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, k(P(Y)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, k(P(Y)("settings.preset")), 1),
			P(Rf) ? (z(), B("div", Rv, [ia(k(P(Rf).name) + " ", 1), H("span", zv, "v" + k(P(Rf).version) + " · " + k(P(zf).config), 1)])) : (z(), B("i", Bv, k(P(Y)("settings.inactive")), 1))
		])]));
	}
});
//#endregion
//#region src/ui/index.ts
function Hv() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), os(Vv).mount(t);
}
function Uv() {
	np("ap-stages", Qm, ["mesid"]), np("ap-cards", Hh, ["mesid"]), np("ap-dock", qh), np("ap-panel", Mv), ep(), Lf();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, Lf);
	xp(), Hv(), mp();
}
//#endregion
//#region src/index.ts
var Wv = {
	version: "1.0.1",
	buildId: "03dc0ffee59cce64",
	nextGeneration: (e) => Bl(e),
	listPresets: () => Ic().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => fl(),
	update: yf
};
globalThis.advancedPresetInterceptor = au, window.AdvancedPreset = Wv;
function Gv(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function Kv() {
	for (let { preset: e } of Ic()) try {
		await _l(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function qv() {
	let { eventSource: t, eventTypes: n } = e();
	K(), lf(), jf(), await r(), await Pc();
	for (let { preset: e } of Ic()) {
		let t = tl(e);
		t.length && cu("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => bu(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => uf(e)), t.on(n.MESSAGE_RECEIVED, (e, t) => pf(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Xl.setPending(null), Xl.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Xl.sweep());
	let i = Gv(() => {
		let e = fl(), t = e ? Rc(e) : void 0;
		t && xl(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, i), t.on(n.OAI_PRESET_CHANGED_AFTER, i);
	let a = async () => {
		await Kv(), Tf(), _f();
	};
	t.on(n.APP_READY, () => void a()), Uv(), cu("init", {
		version: "1.0.1",
		build: "03dc0ffee59cce64",
		enabled: K().enabled
	});
}
var Jv = vf;
qv().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { Jv as advancedPresetOnUpdate };

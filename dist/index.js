//#region src/st/host.ts
var e = () => globalThis.SillyTavern.getContext(), t = () => typeof globalThis.__TAURITAVERN__ == "object" && globalThis.__TAURITAVERN__ !== null, n = {}, r = (e) => new URL(e, import.meta.url).href;
async function i() {
	try {
		n = await import(
			/* @vite-ignore */
			r("../../../../openai.js")
);
	} catch (e) {
		console.warn("[AP] openai.js not importable, using built-in stream extraction", e);
	}
}
function a() {
	let e = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
	return e ? decodeURIComponent(e[1]) : "third-party/advanced-preset";
}
var o = () => r("../");
function s(e) {
	return {
		chatCompletionSource: String(e.chat_completion_source ?? ""),
		model: e.model ?? null,
		customApiFormat: e.custom_api_format ?? null,
		opencodeApiFormat: e.opencode_api_format ?? null
	};
}
function c(e, t, r) {
	let i = typeof r == "string" ? { chatCompletionSource: r } : r;
	if (n.getStreamingReply) return n.getStreamingReply(e, t, {
		...i,
		overrideShowThoughts: !0
	});
	switch (l(i)) {
		case "claude": return t.reasoning += e?.delta?.thinking ?? "", e?.delta?.text ?? "";
		case "gemini": {
			let n = e?.candidates?.[0]?.content?.parts ?? [];
			return t.reasoning += n.filter((e) => e.thought).map((e) => e.text).join(""), n.filter((e) => !e.thought).map((e) => e.text ?? "").join("");
		}
		case "cohere": return e?.delta?.message?.content?.text ?? "";
		default: {
			let n = e?.choices?.[0]?.delta;
			return t.reasoning += n?.reasoning_content ?? n?.reasoning ?? "", n?.content ?? e?.choices?.[0]?.message?.content ?? "";
		}
	}
}
function l(e) {
	let { chatCompletionSource: t, customApiFormat: n, opencodeApiFormat: r } = e;
	switch (t) {
		case "claude":
		case "aws_bedrock": return "claude";
		case "makersuite": return "gemini";
		case "vertexai": return String(e.model ?? "").trim().toLowerCase().startsWith("claude-") ? "claude" : "gemini";
		case "cohere": return "cohere";
		case "custom": return n === "claude_messages" ? "claude" : n === "gemini_generate_content" ? "gemini" : "openai";
		case "opencode": return r === "claude_messages" ? "claude" : r === "gemini" ? "gemini" : "openai";
		default: return "openai";
	}
}
var u = [
	["claude", {
		type: "content_block_delta",
		index: 0,
		delta: {
			type: "text_delta",
			text: ""
		}
	}],
	["gemini", { candidates: [{
		index: 0,
		content: {
			role: "model",
			parts: [{ text: "" }]
		}
	}] }],
	["cohere", {
		type: "content-delta",
		index: 0,
		delta: { message: { content: { text: "" } } }
	}],
	["openai", { choices: [{
		index: 0,
		delta: { content: "" }
	}] }]
];
function d(e) {
	let t = l(e), r = n.getStreamingReply;
	if (!r) return t;
	let i = (t) => {
		try {
			return r(t, {
				reasoning: "",
				images: [],
				signature: "",
				toolSignatures: {}
			}, {
				...e,
				overrideShowThoughts: !1
			}) === "";
		} catch {
			return !1;
		}
	};
	return [t, ...u.map(([e]) => e).filter((e) => e !== t)].find((e) => i(u.find(([t]) => t === e)[1])) ?? t;
}
function f(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var p = (...e) => globalThis.fetch(...e), m = (e) => {
	p = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function h(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var g = {}, _ = [], v = () => {}, y = () => !1, b = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), x = (e) => e.startsWith("onUpdate:"), S = Object.assign, ee = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, te = Object.prototype.hasOwnProperty, C = (e, t) => te.call(e, t), w = Array.isArray, ne = (e) => le(e) === "[object Map]", re = (e) => le(e) === "[object Set]", ie = (e) => le(e) === "[object Date]", ae = (e) => le(e) === "[object RegExp]", T = (e) => typeof e == "function", E = (e) => typeof e == "string", oe = (e) => typeof e == "symbol", D = (e) => typeof e == "object" && !!e, se = (e) => (D(e) || T(e)) && T(e.then) && T(e.catch), ce = Object.prototype.toString, le = (e) => ce.call(e), ue = (e) => le(e).slice(8, -1), de = (e) => le(e) === "[object Object]", fe = (e) => E(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, pe = /* @__PURE__ */ h(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), me = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, he = /-\w/g, ge = me((e) => e.replace(he, (e) => e.slice(1).toUpperCase())), _e = /\B([A-Z])/g, ve = me((e) => e.replace(_e, "-$1").toLowerCase()), ye = me((e) => e.charAt(0).toUpperCase() + e.slice(1)), be = me((e) => e ? `on${ye(e)}` : ""), xe = (e, t) => !Object.is(e, t), Se = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Ce = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, we = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Te = (e) => {
	let t = E(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Ee, De = () => Ee ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Oe(e) {
	if (w(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = E(r) ? Me(r) : Oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (E(e) || D(e)) return e;
}
var ke = /;(?![^(]*\))/g, Ae = /:([^]+)/, je = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Me(e) {
	let t = {};
	return e.replace(je, (e) => e.startsWith("/*") ? "" : e).split(ke).forEach((e) => {
		if (e) {
			let n = e.split(Ae);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function O(e) {
	let t = "";
	if (E(e)) t = e;
	else if (w(e)) for (let n = 0; n < e.length; n++) {
		let r = O(e[n]);
		r && (t += r + " ");
	}
	else if (D(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ne = /* @__PURE__ */ h("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Pe(e) {
	return !!e || e === "";
}
function Fe(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = ze(e[i], t[i], n);
	return r;
}
function Ie(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && ze(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Le(e, t, n) {
	let r = ne(e), i = ne(t);
	if (r || i || (r = re(e), i = re(t), r || i)) return r && i ? Ie(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !ze(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Re(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function ze(e, t, n) {
	if (e === t) return !0;
	let r = ie(e), i = ie(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = oe(e), i = oe(t), r || i ? e === t : (r = w(e), i = w(t), r || i ? r && i ? Re(e, t, n, Fe) : !1 : (r = D(e), i = D(t), r || i ? !r || !i ? !1 : Re(e, t, n, Le) : String(e) === String(t))));
}
function Be(e, t) {
	return e.findIndex((e) => ze(e, t));
}
var Ve = (e) => !!(e && e.__v_isRef === !0), k = (e) => E(e) ? e : e == null ? "" : w(e) || D(e) && (e.toString === ce || !T(e.toString)) ? Ve(e) ? k(e.value) : JSON.stringify(e, He, 2) : String(e), He = (e, t) => Ve(t) ? He(e, t.value) : ne(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ue(t, r) + " =>"] = n, e), {}) } : re(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ue(e)) } : oe(t) ? Ue(t) : D(t) && !w(t) && !de(t) ? String(t) : t, Ue = (e, t = "") => oe(e) ? `Symbol(${e.description ?? t})` : e, We, Ge = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && We && (We.active ? (this.parent = We, this.index = (We.scopes || (We.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = We;
			try {
				return We = this, e();
			} finally {
				We = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = We, We = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (We === this) We = this.prevScope;
			else {
				let e = We;
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
function Ke() {
	return We;
}
var A, qe = /* @__PURE__ */ new WeakSet(), Je = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, We && (We.active ? We.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, qe.has(this) && (qe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Qe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, dt(this), tt(this);
		let e = A, t = st;
		A = this, st = !0;
		try {
			return this.fn();
		} finally {
			nt(this), A = e, st = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) at(e);
			this.deps = this.depsTail = void 0, dt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? qe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		rt(this) && this.run();
	}
	get dirty() {
		return rt(this);
	}
}, Ye = 0, Xe, Ze;
function Qe(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ze, Ze = e) : (e.next = Xe, Xe = e);
}
function $e() {
	Ye++;
}
function et() {
	if (--Ye > 0) return;
	if (Ze) {
		let e = Ze;
		for (Ze = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Xe;) {
		let t = Xe;
		for (Xe = void 0; t;) {
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
function tt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function nt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), at(r), ot(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function rt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (it(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function it(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ft) || (e.globalVersion = ft, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !rt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = A, r = st;
	A = e, st = !0;
	try {
		tt(e);
		let n = e.fn(e._value);
		(t.version === 0 || xe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		A = n, st = r, nt(e), e.flags &= -3;
	}
}
function at(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) at(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ot(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var st = !0, ct = [];
function lt() {
	ct.push(st), st = !1;
}
function ut() {
	let e = ct.pop();
	st = e === void 0 || e;
}
function dt(e) {
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
var ft = 0, pt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, mt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!A || !st || A === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== A) t = this.activeLink = new pt(A, this), A.deps ? (t.prevDep = A.depsTail, A.depsTail.nextDep = t, A.depsTail = t) : A.deps = A.depsTail = t, ht(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = A.depsTail, t.nextDep = void 0, A.depsTail.nextDep = t, A.depsTail = t, A.deps === t && (A.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, ft++, this.notify(e);
	}
	notify(e) {
		$e();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			et();
		}
	}
};
function ht(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ht(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var gt = /* @__PURE__ */ new WeakMap(), _t = /* @__PURE__ */ Symbol(""), vt = /* @__PURE__ */ Symbol(""), yt = /* @__PURE__ */ Symbol("");
function bt(e, t, n) {
	if (st && A) {
		let t = gt.get(e);
		t || gt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new mt()), r.map = t, r.key = n), r.track();
	}
}
function xt(e, t, n, r, i, a) {
	let o = gt.get(e);
	if (!o) {
		ft++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if ($e(), t === "clear") o.forEach(s);
	else {
		let i = w(e), a = i && fe(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === yt || !oe(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(yt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(_t)), ne(e) && s(o.get(vt)));
				break;
			case "delete":
				i || (s(o.get(_t)), ne(e) && s(o.get(vt)));
				break;
			case "set": ne(e) && s(o.get(_t));
		}
	}
	et();
}
function St(e) {
	let t = /* @__PURE__ */ j(e);
	return t === e || (bt(t, "iterate", yt), /* @__PURE__ */ ln(e)) ? t : /* @__PURE__ */ cn(e) ? /* @__PURE__ */ sn(e) ? t.map((e) => pn(fn(e))) : t.map(pn) : t.map(fn);
}
function Ct(e) {
	return bt(e = /* @__PURE__ */ j(e), "iterate", yt), e;
}
function wt(e, t) {
	return /* @__PURE__ */ cn(e) ? pn(/* @__PURE__ */ sn(e) ? fn(t) : t) : fn(t);
}
var Tt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Et(this, Symbol.iterator, (e) => wt(this, e));
	},
	concat(...e) {
		return St(this).concat(...e.map((e) => w(e) ? St(e) : e));
	},
	entries() {
		return Et(this, "entries", (e) => (e[1] = wt(this, e[1]), e));
	},
	every(e, t) {
		return kt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return kt(this, "filter", e, t, (e) => e.map((e) => wt(this, e)), arguments);
	},
	find(e, t) {
		return kt(this, "find", e, t, (e) => wt(this, e), arguments);
	},
	findIndex(e, t) {
		return kt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return kt(this, "findLast", e, t, (e) => wt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return kt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return kt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return jt(this, "includes", e);
	},
	indexOf(...e) {
		return jt(this, "indexOf", e);
	},
	join(e) {
		return St(this).join(e);
	},
	lastIndexOf(...e) {
		return jt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return kt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Mt(this, "pop");
	},
	push(...e) {
		return Mt(this, "push", e);
	},
	reduce(e, ...t) {
		return At(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return At(this, "reduceRight", e, t);
	},
	shift() {
		return Mt(this, "shift");
	},
	some(e, t) {
		return kt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Mt(this, "splice", e);
	},
	toReversed() {
		return St(this).toReversed();
	},
	toSorted(e) {
		return St(this).toSorted(e);
	},
	toSpliced(...e) {
		return St(this).toSpliced(...e);
	},
	unshift(...e) {
		return Mt(this, "unshift", e);
	},
	values() {
		return Et(this, "values", (e) => wt(this, e));
	}
};
function Et(e, t, n) {
	let r = Ct(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ ln(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Dt(a.next(), n), i !== Ot[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Dt(a._next(), n);
	}
	return a;
}
function Dt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Ot = Array.prototype;
function kt(e, t, n, r, i, a) {
	let o = Ct(e), s = o !== e && !/* @__PURE__ */ ln(e), c = o[t];
	if (c !== Ot[t]) {
		let t = c.apply(e, a);
		return s ? fn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, wt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function At(e, t, n, r) {
	let i = Ct(e), a = i !== e && !/* @__PURE__ */ ln(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = wt(e, t)), n.call(this, t, wt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? wt(e, c) : c;
}
function jt(e, t, n) {
	let r = /* @__PURE__ */ j(e);
	bt(r, "iterate", yt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ un(n[0]) ? (n[0] = /* @__PURE__ */ j(n[0]), r[t](...n)) : i;
}
function Mt(e, t, n = []) {
	lt(), $e();
	let r = (/* @__PURE__ */ j(e))[t].apply(e, n);
	return et(), ut(), r;
}
var Nt = /* @__PURE__ */ h("__proto__,__v_isRef,__isVue"), Pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(oe));
function Ft(e) {
	oe(e) || (e = String(e));
	let t = /* @__PURE__ */ j(this);
	return bt(t, "has", e), t.hasOwnProperty(e);
}
var It = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? en : $t : i ? Qt : Zt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = w(e);
		if (!r) {
			let e;
			if (a && (e = Tt[t])) return e;
			if (t === "hasOwnProperty") return Ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ mn(e) ? e : n);
		if ((oe(t) ? Pt.has(t) : Nt(t)) || (r || bt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ mn(o)) {
			let e = a && fe(t) ? o : o.value;
			return r && D(e) ? /* @__PURE__ */ an(e) : e;
		}
		return D(o) ? r ? /* @__PURE__ */ an(o) : /* @__PURE__ */ nn(o) : o;
	}
}, Lt = class extends It {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = w(e) && fe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ cn(i);
			if (!/* @__PURE__ */ ln(n) && !/* @__PURE__ */ cn(n) && (i = /* @__PURE__ */ j(i), n = /* @__PURE__ */ j(n)), !a && /* @__PURE__ */ mn(i) && !/* @__PURE__ */ mn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : C(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ mn(e) ? e : r);
		return e === /* @__PURE__ */ j(r) && s && (o ? xe(n, i) && xt(e, "set", t, n, i) : xt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = C(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && xt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!oe(t) || !Pt.has(t)) && bt(e, "has", t), n;
	}
	ownKeys(e) {
		return bt(e, "iterate", w(e) ? "length" : _t), Reflect.ownKeys(e);
	}
}, Rt = class extends It {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, zt = /* @__PURE__ */ new Lt(), Bt = /* @__PURE__ */ new Rt(), Vt = /* @__PURE__ */ new Lt(!0), Ht = (e) => e, Ut = (e) => Reflect.getPrototypeOf(e);
function Wt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ j(i), o = ne(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ht : t ? pn : fn;
		return !t && bt(a, "iterate", c ? vt : _t), S(Object.create(l), { next() {
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
function Gt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Kt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ j(r), a = /* @__PURE__ */ j(n);
			e || (xe(n, a) && bt(i, "get", n), bt(i, "get", a));
			let { has: o } = Ut(i), s = t ? Ht : e ? pn : fn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && bt(/* @__PURE__ */ j(t), "iterate", _t), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ j(n), i = /* @__PURE__ */ j(t);
			return e || (xe(t, i) && bt(r, "has", t), bt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ j(a), s = t ? Ht : e ? pn : fn;
			return !e && bt(o, "iterate", _t), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return S(n, e ? {
		add: Gt("add"),
		set: Gt("set"),
		delete: Gt("delete"),
		clear: Gt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ j(this), r = Ut(n), i = /* @__PURE__ */ j(e), a = !t && !/* @__PURE__ */ ln(e) && !/* @__PURE__ */ cn(e) ? i : e;
			return r.has.call(n, a) || xe(e, a) && r.has.call(n, e) || xe(i, a) && r.has.call(n, i) || (n.add(a), xt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ ln(n) && !/* @__PURE__ */ cn(n) && (n = /* @__PURE__ */ j(n));
			let r = /* @__PURE__ */ j(this), { has: i, get: a } = Ut(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ j(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? xe(n, s) && xt(r, "set", e, n, s) : xt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ j(this), { has: n, get: r } = Ut(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ j(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && xt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ j(this), t = e.size !== 0, n = e.clear();
			return t && xt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Wt(r, e, t);
	}), n;
}
function qt(e, t) {
	let n = Kt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(C(n, i) && i in r ? n : r, i, a);
}
var Jt = { get: /* @__PURE__ */ qt(!1, !1) }, Yt = { get: /* @__PURE__ */ qt(!1, !0) }, Xt = { get: /* @__PURE__ */ qt(!0, !1) }, Zt = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap();
function tn(e) {
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
function nn(e) {
	return /* @__PURE__ */ cn(e) ? e : on(e, !1, zt, Jt, Zt);
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
	return on(e, !1, Vt, Yt, Qt);
}
// @__NO_SIDE_EFFECTS__
function an(e) {
	return on(e, !0, Bt, Xt, $t);
}
function on(e, t, n, r, i) {
	if (!D(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = tn(ue(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return /* @__PURE__ */ cn(e) ? /* @__PURE__ */ sn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function ln(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function un(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function j(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ j(t) : e;
}
function dn(e) {
	return !C(e, "__v_skip") && Object.isExtensible(e) && Ce(e, "__v_skip", !0), e;
}
var fn = (e) => D(e) ? /* @__PURE__ */ nn(e) : e, pn = (e) => D(e) ? /* @__PURE__ */ an(e) : e;
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	return hn(e, !1);
}
function hn(e, t) {
	return /* @__PURE__ */ mn(e) ? e : new gn(e, t);
}
var gn = class {
	constructor(e, t) {
		this.dep = new mt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ j(e), this._value = t ? e : fn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ ln(e) || /* @__PURE__ */ cn(e);
		e = n ? e : /* @__PURE__ */ j(e), xe(e, t) && (this._rawValue = e, this._value = n ? e : fn(e), this.dep.trigger());
	}
};
function N(e) {
	return /* @__PURE__ */ mn(e) ? e.value : e;
}
var _n = {
	get: (e, t, n) => t === "__v_raw" ? e : N(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ mn(i) && !/* @__PURE__ */ mn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function vn(e) {
	return /* @__PURE__ */ sn(e) ? e : new Proxy(e, _n);
}
var yn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new mt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function bn(e) {
	return new yn(e);
}
var xn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new mt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ft - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && A !== this) return Qe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return it(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Sn(e, t, n = !1) {
	let r, i;
	return T(e) ? r = e : (r = e.get, i = e.set), new xn(r, i, n);
}
var Cn = {}, wn = /* @__PURE__ */ new WeakMap(), Tn = void 0;
function En(e, t = !1, n = Tn) {
	if (n) {
		let t = wn.get(n);
		t || wn.set(n, t = []), t.push(e);
	}
}
function Dn(e, t, n = g) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ ln(e) || i === !1 || i === 0 ? On(e, 1) : On(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ mn(e) ? (d = () => e.value, m = /* @__PURE__ */ ln(e)) : /* @__PURE__ */ sn(e) ? (d = () => l(e), m = !0) : w(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ sn(e) || /* @__PURE__ */ ln(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ mn(e)) return e.value;
		if (/* @__PURE__ */ sn(e)) return l(e);
		if (T(e)) return c ? c(e, 2) : e();
	})) : d = T(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			lt();
			try {
				f();
			} finally {
				ut();
			}
		}
		let t = Tn;
		Tn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Tn = t;
		}
	} : v, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => On(e(), t);
	}
	let _ = Ke(), y = () => {
		u.stop(), _ && _.active && ee(_.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				y();
			}
		};
	}
	let b = h ? Array(e.length).fill(Cn) : Cn, x = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => xe(e, b[t])) : xe(n, b))) {
					let e = Tn;
					lt();
					try {
						f && f(), Tn = u;
						let e = [
							n,
							b === Cn ? void 0 : h && b[0] === Cn ? [] : b,
							p
						];
						b = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Tn = e, ut();
					}
				}
			} else u.run();
		}
	};
	return s && s(x), u = new Je(d), u.scheduler = o ? () => o(x, !1) : x, p = (e) => En(e, !1, u), f = u.onStop = () => {
		let e = wn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			wn.delete(u);
		}
	}, t ? r ? x(!0) : b = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), y.pause = u.pause.bind(u), y.resume = u.resume.bind(u), y.stop = y, y;
}
function On(e, t = Infinity, n) {
	if (t <= 0 || !D(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ mn(e)) On(e.value, t, n);
	else if (w(e)) for (let r = 0; r < e.length; r++) On(e[r], t, n);
	else if (re(e) || ne(e)) e.forEach((e) => {
		On(e, t, n);
	});
	else if (de(e)) {
		for (let r in e) On(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && On(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function kn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		jn(e, t, n);
	}
}
function An(e, t, n, r) {
	if (T(e)) {
		let i = kn(e, t, n, r);
		return i && se(i) && i.catch((e) => {
			jn(e, t, n);
		}), i;
	}
	if (w(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(An(e[a], t, n, r));
		return i;
	}
}
function jn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || g;
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
			lt(), kn(a, null, 10, [
				e,
				i,
				o
			]), ut();
			return;
		}
	}
	Mn(e, n, i, r, o);
}
function Mn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Nn = [], Pn = -1, Fn = [], In = null, Ln = 0, Rn = /* @__PURE__ */ Promise.resolve(), zn = null;
function Bn(e) {
	let t = zn || Rn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Vn(e) {
	let t = Pn + 1, n = Nn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Nn[r], a = Yn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Hn(e) {
	if (!(e.flags & 1)) {
		let t = Yn(e), n = Nn[Nn.length - 1];
		!n || !(e.flags & 2) && t >= Yn(n) ? Nn.push(e) : Nn.splice(Vn(t), 0, e), e.flags |= 1, Un();
	}
}
function Un() {
	zn ||= Rn.then(Xn);
}
function Wn(e) {
	if (!w(e)) In && e.id === -1 ? In.splice(Ln + 1, 0, e) : e.flags & 1 || (Fn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Fn.push(e[t]);
	Un();
}
function Gn(e, t, n, r = Pn + 1) {
	for (; r < Nn.length; r++) {
		let n = Nn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Nn.splice(r, 1), r = e ? r - 1 : Pn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Kn(e, t, n = 0) {
	if (Fn.length) {
		let e = Fn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Fn.length; i++) {
				let a = Fn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Fn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Yn(e) - Yn(t));
		if (Fn.length = r, In) {
			for (let e = 0; e < i.length; e++) In.push(i[e]);
			return;
		}
		for (In = i, Ln = 0; Ln < In.length; Ln++) {
			let e = In[Ln];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		In = null, Ln = 0;
	}
}
var qn = !1;
function Jn(e, t) {
	if (qn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Fn);
	e(), qn = !0;
	try {
		Gn(void 0, t), Kn(void 0, n, t);
	} finally {
		qn = !1;
	}
}
var Yn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Xn(e) {
	try {
		for (Pn = 0; Pn < Nn.length; Pn++) {
			let e = Nn[Pn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), kn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Pn < Nn.length; Pn++) {
			let e = Nn[Pn];
			e && (e.flags &= -2);
		}
		Pn = -1, Nn.length = 0, Kn(e), zn = null, (Nn.length || Fn.length) && Xn(e);
	}
}
var Zn = null, Qn = null;
function $n(e) {
	let t = Zn;
	return Zn = e, Qn = e && e.type.__scopeId || null, t;
}
function P(e, t = Zn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && ta(-1);
		let i = $n(t), a = Zi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Zi.length; e > a; e--) $i();
			$n(i), r._d && ta(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function F(e, t) {
	if (Zn === null) return e;
	let n = Pa(Zn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = g] = t[e];
		i && (T(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && On(a), r.push({
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
function er(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (lt(), An(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), ut());
	}
}
function tr(e, t, n = !1) {
	let r = xa();
	if (r || ii) {
		let i = ii ? ii._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && T(t) ? t.call(r && r.proxy) : t;
	}
}
var nr = /* @__PURE__ */ Symbol.for("v-scx"), rr = () => tr(nr);
function ir(e, t) {
	return sr(e, null, t);
}
function ar(e, t) {
	return sr(e, null, { flush: "sync" });
}
function or(e, t, n) {
	return sr(e, t, n);
}
function sr(e, t, n = g) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = S({}, n), c = t && r || !t && a !== "post", l;
	if (Da) {
		if (a === "sync") {
			let e = rr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = v, e.resume = v, e.pause = v, e;
		}
	}
	let u = ba;
	s.call = (e, t, n) => An(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Fi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Hn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Dn(e, t, s);
	return Da && (l ? l.push(f) : c && f()), f;
}
var cr = /* @__PURE__ */ Symbol("_vte"), lr = (e) => e.__isTeleport, ur = /* @__PURE__ */ Symbol("_leaveCb"), dr = /* @__PURE__ */ Symbol("_enterCb");
function fr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Rr(() => {
		e.isMounted = !0;
	}), Br(() => {
		e.isUnmounting = !0;
	}), e;
}
var pr = [Function, Array], mr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: pr,
	onEnter: pr,
	onAfterEnter: pr,
	onEnterCancelled: pr,
	onBeforeLeave: pr,
	onLeave: pr,
	onAfterLeave: pr,
	onLeaveCancelled: pr,
	onBeforeAppear: pr,
	onAppear: pr,
	onAfterAppear: pr,
	onAppearCancelled: pr
}, hr = {
	name: "BaseTransition",
	props: mr,
	setup(e, { slots: t }) {
		let n = xa(), r = fr();
		return () => {
			let i = t.default && Cr(t.default(), !0), a = i && i.length ? gr(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ j(e), { mode: s } = o;
			if (r.isLeaving) return br(a);
			let c = xr(a);
			if (!c) return br(a);
			let l = yr(c, o, r, n, (e) => l = e);
			c.type !== Yi && Sr(c, l);
			let u = n.subTree && xr(n.subTree);
			if (u && u.type !== Yi && !ia(u, c) && wr(n.subTree)) {
				let e = yr(u, o, r, n);
				if (Sr(u, e), s === "out-in" && c.type !== Yi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, br(a);
				s === "in-out" && c.type !== Yi ? e.delayLeave = (e, t, n) => {
					let i = vr(r, u);
					i[String(u.key)] = u, e[ur] = () => {
						t(), e[ur] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function gr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Yi) {
			t = n;
			break;
		}
	}
	return t;
}
var _r = hr;
function vr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function yr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = vr(n, e), S = (e, t) => {
		e && An(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		S(e, t), w(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, te = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[ur] && t[ur](!0);
			let i = x[b];
			if (i && ia(e, i)) {
				let e = i.el[ur];
				if (!e) {
					let t = wr(i);
					e = t && t.el[ur];
				}
				e && e();
			}
			S(r, [t]);
		},
		enter(t) {
			if (x[b] === e) return;
			let r = l, i = u, o = d;
			if (!n.isMounted) {
				if (a) r = _ || l, i = v || u, o = y || d;
				else return;
			}
			let s = !1;
			t[dr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), te.delayedLeave && te.delayedLeave(), t[dr] = void 0);
			};
			let c = t[dr].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[dr] && t[dr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[ur] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[ur] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[ur].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = yr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return te;
}
function br(e) {
	if (jr(e)) return e = la(e), e.children = null, e;
}
function xr(e) {
	if (!jr(e)) return lr(e.type) && e.children ? gr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && T(n.default)) return n.default();
	}
}
function Sr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Sr(lr(n.type) && xr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === R && w(e.children)) {
		let n = di(e.children, !1);
		n && Sr(n, t);
	}
}
function Cr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === R ? (o.patchFlag & 128 && i++, r = r.concat(Cr(o.children, t, s))) : (t || o.type !== Yi) && r.push(s == null ? o : la(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function wr(e) {
	if (e.component) return wr(e.component.subTree);
	if (e.type === R) {
		let t = w(e.children) && di(e.children, !1);
		return t ? wr(t) : void 0;
	}
	if (e.type !== Yi) return e;
}
// @__NO_SIDE_EFFECTS__
function I(e, t) {
	return T(e) ? /* @__PURE__ */ S({ name: e.name }, t, { setup: e }) : e;
}
function Tr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Er(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Dr = /* @__PURE__ */ new WeakMap();
function Or(e, t, n, r, i = !1) {
	if (w(e)) {
		e.forEach((e, a) => Or(e, t && (w(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Ar(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Or(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Pa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === g ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ j(d), p = d === g ? y : (e) => !Er(u, e) && C(f, e), m = (e, t) => !(t && Er(u, t));
	if (l != null && l !== c) {
		if (kr(t), E(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ mn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (T(c)) kn(c, s, 12, [o, u]);
	else {
		let t = E(c), r = /* @__PURE__ */ mn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) w(n) && ee(n, a);
					else if (w(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Dr.delete(e);
				};
				t.id = -1, Dr.set(e, t), Fi(t, n);
			} else kr(e), s();
		}
	}
}
function kr(e) {
	let t = Dr.get(e);
	t && (t.flags |= 8, Dr.delete(e));
}
De().requestIdleCallback, De().cancelIdleCallback;
var Ar = (e) => !!e.type.__asyncLoader, jr = (e) => e.type.__isKeepAlive, Mr = {
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
		let n = xa(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Fi(() => {
				a.isDeactivated = !1, a.a && Se(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && ha(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Wi(t.m), Wi(t.a), l(e, f, null, 1, s), Fi(() => {
				t.da && Se(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && ha(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Pr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Fa(Ar(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ia(t, o)) ? p(t) : o && (Pr(o), t && Pr(t)), i.delete(e), a.delete(e);
		}
		or(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Nr(e, t)), t && m((e) => !Nr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Ki(n.subTree.type) ? Fi(() => {
				let e = Fr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Fr(n.subTree)));
		};
		return Rr(_), zr(_), Br(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Fr(t);
				if (e.type === i.type && e.key === i.key) {
					Pr(i);
					let e = i.component.da;
					e && Fi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ra(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Fr(r);
			if (s.type === Yi) return o = null, s;
			let c = s.type, l = Fa(Ar(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Nr(u, l)) || d && l && Nr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = la(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Sr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Ki(r.type) ? r : s;
		};
	}
};
function Nr(e, t) {
	return w(e) ? e.some((e) => Nr(e, t)) : E(e) ? e.split(",").includes(t) : ae(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Pr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Fr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Ir(e, t, n = ba, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			lt();
			let i = wa(n), a = An(t, n, e, r);
			return i(), ut(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Lr = (e) => (t, n = ba) => {
	(!Da || e === "sp") && Ir(e, (...e) => t(...e), n);
}, Rr = Lr("m"), zr = Lr("u"), Br = Lr("bum"), Vr = "components", Hr = /* @__PURE__ */ Symbol.for("v-ndc");
function Ur(e) {
	return E(e) ? Wr(Vr, e, !1) || e : e || Hr;
}
function Wr(e, t, n = !0, r = !1) {
	let i = Zn || ba;
	if (i) {
		let n = i.type;
		if (e === Vr) {
			let e = Fa(n, !1);
			if (e && (e === t || e === ge(t) || e === ye(ge(t)))) return n;
		}
		let a = Gr(i[e] || n[e], t) || Gr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Gr(e, t) {
	return e && (e[t] || e[ge(t)] || e[ye(ge(t))]);
}
function L(e, t, n, r) {
	let i, a = n && n[r], o = w(e);
	if (o || E(e)) {
		let n = o && /* @__PURE__ */ sn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ ln(e), s = /* @__PURE__ */ cn(e), e = Ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? pn(fn(e[n])) : fn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Kr(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (w(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function qr(e, t, n, r, i, a) {
	if (n ??= {}, Zn.ce || Zn.parent && Ar(Zn.parent) && Zn.parent.ce) {
		let e = a != null && n.key == null ? S({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), z(), V(R, null, [U("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Zi.length;
	z();
	let c;
	try {
		let i = o && Jr(o(n)), s = n.key || a || i && i.key;
		c = V(R, { key: (s && !oe(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Zi.length; e > s; e--) $i();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Jr(e) {
	return e.some((e) => !ra(e) || !(e.type === Yi || e.type === R && !Jr(e.children))) ? e : null;
}
var Yr = (e) => e ? Ea(e) ? Pa(e) : Yr(e.parent) : null, Xr = /* @__PURE__ */ S(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Yr(e.parent),
	$root: (e) => Yr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Hn(e.update);
	},
	$nextTick: (e) => e.n ||= Bn.bind(e.proxy),
	$watch: (e) => v
}), Zr = (e, t) => e !== g && !e.__isScriptSetup && C(e, t), Qr = {
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
			else if (Zr(r, t)) return o[t] = 1, r[t];
			else if (C(a, t)) return o[t] = 3, a[t];
			else if (n !== g && C(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Xr[t], u, d;
		if (l) return t === "$attrs" && bt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== g && C(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, C(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Zr(i, t) ? (i[t] = n, !0) : C(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Zr(t, s) || C(a, s) || C(r, s) || C(Xr, s) || C(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? C(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function $r(e) {
	return w(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ei(e, t) {
	return !e || !t ? e || t : w(e) && w(t) ? e.concat(t) : S({}, $r(e), $r(t));
}
function ti() {
	return {
		app: null,
		config: {
			isNativeTag: y,
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
var ni = 0;
function ri(e, t) {
	return function(n, r = null) {
		T(n) || (n = S({}, n)), r != null && !D(r) && (r = null);
		let i = ti(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ni++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ra,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && T(e.install) ? (a.add(e), e.install(c, ...t)) : T(e) && (a.add(e), e(c, ...t))), c;
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Pa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (An(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ii;
				ii = c;
				try {
					return e();
				} finally {
					ii = t;
				}
			}
		};
		return c;
	};
}
var ii = null;
function ai(e, t, n = g) {
	let r = xa(), i = ge(t), a = ve(t), o = oi(e, i), s = bn((o, s) => {
		let c, l = g, u;
		return ar(() => {
			let t = e[i];
			xe(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!xe(o, c) && !(l !== g && xe(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), xe(e, l) && (xe(e, o) && !xe(o, u) || f && l !== g && !xe(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || g : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var oi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ge(t)}Modifiers`] || e[`${ve(t)}Modifiers`];
function si(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || g, i = n, a = t.startsWith("update:"), o = a && oi(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => E(e) ? e.trim() : e)), o.number && (i = i.map(we)));
	let s, c = r[s = be(t)] || r[s = be(ge(t))];
	!c && a && (c = r[s = be(ve(t))]), c && An(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, An(l, e, 6, i);
	}
}
function ci(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (w(a) ? a.forEach((e) => o[e] = null) : S(o, a), D(e) && r.set(e, o), o) : (D(e) && r.set(e, null), null);
}
function li(e, t) {
	return !e || !b(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), C(e, t[0].toLowerCase() + t.slice(1)) || C(e, ve(t)) || C(e, t));
}
function ui(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = $n(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = da(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = da(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : fi(s);
		}
	} catch (t) {
		Zi.length = 0, jn(t, e, 1), _ = U(Yi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(x) && (v = pi(v, a)), y = la(y, v, !1, !0));
	}
	return n.dirs && (y = la(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Sr(lr(y.type) && xr(y) || y, n.transition), _ = y, $n(g), _;
}
function di(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ra(r)) {
			if (r.type !== Yi || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var fi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || b(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, pi = (e, t) => {
	let n = {};
	for (let r in e) (!x(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function mi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? hi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (gi(o, r, n) && !li(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || hi(r, o, l) : !!o;
	return !1;
}
function hi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!C(e, a) || gi(t, e, a) && !li(n, a)) return !0;
	}
	return !1;
}
function gi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && D(r) && D(i) ? !ze(r, i) : r !== i;
}
function _i({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var vi = {}, yi = () => Object.create(vi), bi = (e) => Object.getPrototypeOf(e) === vi;
function xi(e, t, n, r = !1) {
	let i = {}, a = yi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ci(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ rn(i) : e.type.props ? i : a, e.attrs = a;
}
function Si(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ j(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (li(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (C(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ge(o);
						i[t] = wi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ci(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !C(t, a) && ((r = ve(a)) === a || !C(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = wi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !C(t, e)) && (delete a[e], l = !0);
	}
	l && xt(e.attrs, "set", "");
}
function Ci(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (pe(c)) continue;
		let l = t[c], u;
		i && C(i, u = ge(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : li(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ j(n), r = s || g;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = wi(i, t, s, r[s], e, !C(r, s));
		}
	}
	return o;
}
function wi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = C(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && T(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = wa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ve(n)) && (r = !0));
	}
	return r;
}
function Ti(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return D(e) && r.set(e, _), _;
	if (w(a)) for (let e = 0; e < a.length; e++) {
		let t = ge(a[e]);
		Ei(t) && (o[t] = g);
	}
	else if (a) for (let e in a) {
		let t = ge(e);
		if (Ei(t)) {
			let n = a[e], r = o[t] = w(n) || T(n) ? { type: n } : S({}, n), i = r.type, c = !1, l = !0;
			if (w(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = T(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = T(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || C(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return D(e) && r.set(e, c), c;
}
function Ei(e) {
	return e[0] !== "$" && !pe(e);
}
var Di = (e) => e === "_" || e === "_ctx" || e === "$stable", Oi = (e) => w(e) ? e.map(da) : [da(e)], ki = (e, t, n) => {
	if (t._n) return t;
	let r = P((...e) => Oi(t(...e)), n);
	return r._c = !1, r;
}, Ai = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Di(n)) continue;
		let i = e[n];
		if (T(i)) t[n] = ki(n, i, r);
		else if (i != null) {
			let e = Oi(i);
			t[n] = () => e;
		}
	}
}, ji = (e, t) => {
	let n = Oi(t);
	e.slots.default = () => n;
}, Mi = (e, t, n) => {
	for (let r in t) (n || !Di(r)) && (e[r] = t[r]);
}, Ni = (e, t, n) => {
	let r = e.slots = yi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Mi(r, t, n), n && Ce(r, "_", e, !0)) : Ai(t, r);
	} else t && ji(e, t);
}, Pi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = g;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Mi(i, t, n) : (a = !t.$stable, Ai(t, i)), o = t;
	} else t && (ji(e, t), o = { default: 1 });
	if (a) for (let e in i) !Di(e) && o[e] == null && delete i[e];
}, Fi = qi;
function Ii(e) {
	return Li(e);
}
function Li(e, t) {
	let n = De();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = v, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ia(e, t) && (r = ye(e), me(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === _ && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ji:
				y(e, t, n, r);
				break;
			case Yi:
				b(e, t, n, r);
				break;
			case Xi:
				e ?? x(t, n, r, o);
				break;
			case R:
				T(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? te(e, t, n, r, i, a, o, s, c) : d & 6 ? E(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, xe);
		}
		u != null && i ? Or(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Or(e.ref, null, a, e, !0);
	}, y = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, b = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = m(e.children, t, n, r, e.el, e.anchor);
	}, S = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, ee = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, te = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) C(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, C = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && ne(e.children, f, null, i, s, Ri(e, c), l, d), _ && er(e, null, i, "created"), w(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !pe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && ha(p, i, e);
		}
		_ && er(e, null, i, "beforeMount");
		let v = Bi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Fi(() => {
			try {
				p && ha(p, i, e), v && g.enter(f), _ && er(e, null, i, "mounted");
			} finally {}
		}, s);
	}, w = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ki(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				w(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, ne = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? fa(e[l]) : da(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || g, m = t.props || g, h;
		if (n && zi(n, !1), (h = m.onVnodeBeforeUpdate) && ha(h, n, t, e), f && er(t, e, n, "beforeUpdate"), n && zi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ie(e.dynamicChildren, d, c, n, r, Ri(t, i), o) : s || le(e, t, c, null, n, r, Ri(t, i), o, !1), l > 0) {
			if (l & 16) ae(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && ae(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Fi(() => {
			h && ha(h, n, t, e), f && er(t, e, n, "updated");
		}, r);
	}, ie = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Gi(c), f = u && (c.type === R || !ia(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ae = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== g) for (let o in t) !pe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (pe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, T = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), ne(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ie(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Vi(e, t, !0)) : le(e, t, n, f, a, o, c, l, u);
	}, E = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : D(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = ya(e, r, i);
		if (jr(e) && (s.ctx.renderer = xe), Oa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = U(Yi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, D = (e, t, n) => {
		let r = t.component = e.component;
		if (mi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ce(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ui(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							Fi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				zi(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && Se(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ha(f, s, t, c), zi(e, !0);
				let p = ui(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ye(m), e, i, a), t.el = p.el, u === null && _i(e, p.el), r && Fi(r, i), (f = t.props && t.props.onVnodeUpdated) && Fi(() => ha(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ar(t);
				if (zi(e, !1), l && Se(l), !m && (o = c && c.onVnodeBeforeMount) && ha(o, d, t), zi(e, !0), s && we) {
					let t = () => {
						e.subTree = ui(e), we(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ui(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Fi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Fi(() => ha(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Ar(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Fi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Je(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Hn(u), zi(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Si(e, t.props, r, n), Pi(e, t.children, n), lt(), Gn(e), ut();
	}, le = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				de(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				ue(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && ve(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? de(l, f, n, r, i, a, o, s, c) : ve(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && ne(f, n, r, i, a, o, s, c));
	}, ue = (e, t, n, r, i, a, o, s, c) => {
		e ||= _, t ||= _;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? fa(t[f]) : da(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ve(e, i, a, !0, !1, d) : ne(t, n, r, i, a, o, s, c, d);
	}, de = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? fa(t[l]) : da(t[l]);
			if (ia(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? fa(t[f]) : da(t[f]);
			if (ia(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? fa(t[l]) : da(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) me(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? fa(t[l]) : da(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let v, y = 0, b = f - m + 1, x = !1, S = 0, ee = Array(b);
			for (l = 0; l < b; l++) ee[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					me(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (v = m; v <= f; v++) if (ee[v - m] === 0 && ia(r, t[v])) {
					u = v;
					break;
				}
				u === void 0 ? me(r, i, a, !0) : (ee[u - m] = l + 1, u >= S ? S = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let te = x ? Hi(ee) : _;
			for (v = te.length - 1, l = b - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Gi(f) : r;
				ee[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (v < 0 || l !== te[v] ? fe(d, n, p, 2) : v--);
			}
		}
	}, fe = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) fe(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, xe);
		else if (c === R) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) fe(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Xi) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[ur] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Fi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[ur];
					s._isLeaving && s[ur](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, me = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (lt(), Or(s, null, n, e, !0), ut()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ar(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ha(_, t, e), u & 6) _e(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && er(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, xe, r) : l && !l.hasOnce && (a !== R || d > 0 && d & 64) ? ve(l, t, n, !1, !0) : (a === R && d & 384 || !i && u & 16) && ve(c, t, n), r && he(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Fi(() => {
			_ && ha(_, t, e), h && er(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, he = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === R;
		if (o && !a) {
			ge(n, r);
			return;
		}
		if (t === Xi) {
			ee(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? wr(e) : e, c = () => {
			o ? d(n) && ge(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, ge = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, _e = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Wi(c), Wi(l), r && Se(r), i.stop(), a ? (a.flags |= 8, me(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, me(o, e, t, n)), s && Fi(s, t), Fi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ve = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) me(e[o], t, n, r, i);
	}, ye = (e) => {
		if (e.shapeFlag & 6) return ye(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[cr];
		return n ? f(n) : t;
	}, be = (e, t, n) => {
		Jn(() => {
			e == null ? t._vnode && me(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : va());
	}, xe = {
		p: h,
		um: me,
		m: fe,
		r: he,
		mt: oe,
		mc: ne,
		pc: le,
		pbc: ie,
		n: ye,
		o: e
	}, Ce, we;
	return t && ([Ce, we] = t(xe)), {
		render: be,
		hydrate: Ce,
		createApp: ri(be, Ce)
	};
}
function Ri({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function zi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Bi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Vi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (w(r) && w(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = fa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Vi(t, a)), a.type === Ji && (a.patchFlag === -1 && (a = i[e] = fa(a)), a.el = t.el), a.type === Yi && !a.el && (a.el = t.el);
	}
}
function Hi(e) {
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
function Ui(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Ui(t);
}
function Wi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Gi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Gi(t.subTree) : null;
}
var Ki = (e) => e.__isSuspense;
function qi(e, t) {
	t && t.pendingBranch ? w(e) ? t.effects.push(...e) : t.effects.push(e) : Wn(e);
}
var R = /* @__PURE__ */ Symbol.for("v-fgt"), Ji = /* @__PURE__ */ Symbol.for("v-txt"), Yi = /* @__PURE__ */ Symbol.for("v-cmt"), Xi = /* @__PURE__ */ Symbol.for("v-stc"), Zi = [], Qi = null;
function z(e = !1) {
	Zi.push(Qi = e ? null : []);
}
function $i() {
	Zi.pop(), Qi = Zi[Zi.length - 1] || null;
}
var ea = 1;
function ta(e, t = !1) {
	ea += e, e < 0 && Qi && t && (Qi.hasOnce = !0);
}
function na(e) {
	return e.dynamicChildren = ea > 0 ? Qi || _ : null, $i(), ea > 0 && Qi && Qi.push(e), e;
}
function B(e, t, n, r, i, a) {
	return na(H(e, t, n, r, i, a, !0));
}
function V(e, t, n, r, i) {
	return na(U(e, t, n, r, i, !0));
}
function ra(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ia(e, t) {
	return e.type === t.type && e.key === t.key;
}
var aa = ({ key: e }) => e ?? null, oa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : E(e) || /* @__PURE__ */ mn(e) || T(e) ? {
	i: Zn,
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
		key: t && aa(t),
		ref: t && oa(t),
		scopeId: Qn,
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
		ctx: Zn
	};
	return s ? (pa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= E(n) ? 8 : 16), ea > 0 && !o && Qi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Qi.push(c), c;
}
var U = sa;
function sa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Hr) && (e = Yi), ra(e)) {
		let r = la(e, t, !0);
		return n && pa(r, n), ea > 0 && !a && Qi && (r.shapeFlag & 6 ? Qi[Qi.indexOf(e)] = r : Qi.push(r)), r.patchFlag = -2, r;
	}
	if (Ia(e) && (e = e.__vccOpts), t) {
		t = ca(t);
		let { class: e, style: n } = t;
		e && !E(e) && (t.class = O(e)), D(n) && (/* @__PURE__ */ un(n) && !w(n) && (n = S({}, n)), t.style = Oe(n));
	}
	let o = E(e) ? 1 : Ki(e) ? 128 : lr(e) ? 64 : D(e) ? 4 : T(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function ca(e) {
	return e ? /* @__PURE__ */ un(e) || bi(e) ? S({}, e) : e : null;
}
function la(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ma(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && aa(l),
		ref: t && t.ref ? n && a ? w(a) ? a.concat(oa(t)) : [a, oa(t)] : oa(t) : a,
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
		ssContent: e.ssContent && la(e.ssContent),
		ssFallback: e.ssFallback && la(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Sr(u, c.clone(u)), u;
}
function ua(e = " ", t = 0) {
	return U(Ji, null, e, t);
}
function W(e = "", t = !1) {
	return t ? (z(), V(Yi, null, e)) : U(Yi, null, e);
}
function da(e) {
	return e == null || typeof e == "boolean" ? U(Yi) : w(e) ? U(R, null, e.slice()) : ra(e) ? fa(e) : U(Ji, null, String(e));
}
function fa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : la(e);
}
function pa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (w(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), pa(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !bi(t) ? t._ctx = Zn : r === 3 && Zn && (Zn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (T(t)) {
		if (r & 65) {
			pa(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Zn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ua(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ma(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = O([t.class, r.class]));
		else if (e === "style") t.style = Oe([t.style, r.style]);
		else if (b(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(w(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !x(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ha(e, t, n, r = null) {
	An(e, t, 7, [n, r]);
}
var ga = ti(), _a = 0;
function va() {
	return _a;
}
function ya(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || ga, a = {
		uid: _a++,
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
		scope: new Ge(!0),
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
		propsOptions: Ti(r, i),
		emitsOptions: ci(r, i),
		emit: null,
		emitted: null,
		propsDefaults: g,
		inheritAttrs: r.inheritAttrs,
		ctx: g,
		data: g,
		props: g,
		attrs: g,
		slots: g,
		refs: g,
		setupState: g,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = si.bind(null, a), e.ce && e.ce(a), a;
}
var ba = null, xa = () => ba || Zn, Sa, Ca;
{
	let e = De(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Sa = t("__VUE_INSTANCE_SETTERS__", (e) => ba = e), Ca = t("__VUE_SSR_SETTERS__", (e) => Da = e);
}
var wa = (e) => {
	let t = ba;
	return Sa(e), e.scope.on(), () => {
		e.scope.off(), Sa(t);
	};
}, Ta = () => {
	ba && ba.scope.off(), Sa(null);
};
function Ea(e) {
	return e.vnode.shapeFlag & 4;
}
var Da = !1;
function Oa(e, t = !1, n = !1) {
	t && Ca(t);
	let { props: r, children: i } = e.vnode, a = Ea(e);
	xi(e, r, a, t), Ni(e, i, n || t);
	let o = a ? ka(e, t) : void 0;
	return t && Ca(!1), o;
}
function ka(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Qr);
	let { setup: r } = n;
	if (r) {
		lt();
		let n = e.setupContext = r.length > 1 ? Na(e) : null, i = wa(e), a = kn(r, e, 0, [e.props, n]), o = se(a);
		if (ut(), i(), (o || e.sp) && !Ar(e) && Tr(e), o) {
			if (a.then(Ta, Ta), t) return a.then((n) => {
				Ca(!0);
				try {
					Aa(e, n, t);
				} finally {
					Ca(!1);
				}
			}).catch((t) => {
				jn(t, e, 0);
			});
			e.asyncDep = a;
		} else Aa(e, a, t);
	} else ja(e, t);
}
function Aa(e, t, n) {
	T(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : D(t) && (e.setupState = vn(t)), ja(e, n);
}
function ja(e, t, n) {
	let r = e.type;
	e.render ||= r.render || v;
}
var Ma = { get(e, t) {
	return bt(e, "get", ""), e[t];
} };
function Na(e) {
	return {
		attrs: new Proxy(e.attrs, Ma),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Pa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(vn(dn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Xr) return Xr[n](e);
		},
		has(e, t) {
			return t in e || t in Xr;
		}
	}) : e.proxy;
}
function Fa(e, t = !0) {
	return T(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ia(e) {
	return T(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ Sn(e, t, Da);
function La(e, t, n) {
	try {
		ta(-1);
		let r = arguments.length;
		return r === 2 ? D(t) && !w(t) ? ra(t) ? U(e, null, [t]) : U(e, t) : U(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ra(n) && (n = [n]), U(e, t, n));
	} finally {
		ta(1);
	}
}
var Ra = "3.5.44", za = void 0, Ba = typeof window < "u" && window.trustedTypes;
if (Ba) try {
	za = /* @__PURE__ */ Ba.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Va = za ? (e) => za.createHTML(e) : (e) => e, Ha = "http://www.w3.org/2000/svg", Ua = "http://www.w3.org/1998/Math/MathML", Wa = typeof document < "u" ? document : null, Ga = Wa && /* @__PURE__ */ Wa.createElement("template"), Ka = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Wa.createElementNS(Ha, e) : t === "mathml" ? Wa.createElementNS(Ua, e) : n ? Wa.createElement(e, { is: n }) : Wa.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Wa.createTextNode(e),
	createComment: (e) => Wa.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Wa.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ga.innerHTML = Va(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ga.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, qa = "transition", Ja = "animation", Ya = /* @__PURE__ */ Symbol("_vtc"), Xa = {
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
}, Za = /* @__PURE__ */ S({}, mr, Xa), Qa = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Za, e))((e, { slots: t }) => La(_r, to(e), t)), $a = (e, t = []) => {
	w(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, eo = (e) => e ? w(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function to(e) {
	let t = {};
	for (let n in e) n in Xa || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = no(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: ee = _, onAppear: te = v, onAppearCancelled: C = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, ao(e, t ? u : s), ao(e, t ? l : o), n && n();
	}, ne = (e, t) => {
		e._isLeaving = !1, ao(e, d), ao(e, p), ao(e, f), t && t();
	}, re = (e) => (t, n) => {
		let i = e ? te : v, o = () => w(t, e, n);
		$a(i, [t, o]), oo(() => {
			ao(t, e ? c : a), io(t, e ? u : s), eo(i) || co(t, r, h, o);
		});
	};
	return S(t, {
		onBeforeEnter(e) {
			$a(_, [e]), io(e, a), io(e, o);
		},
		onBeforeAppear(e) {
			$a(ee, [e]), io(e, c), io(e, l);
		},
		onEnter: re(!1),
		onAppear: re(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => ne(e, t);
			io(e, d), e._enterCancelled ? (io(e, f), po(e)) : (po(e), io(e, f)), oo(() => {
				e._isLeaving && (ao(e, d), io(e, p), eo(b) || co(e, r, g, n));
			}), $a(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), $a(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), $a(C, [e]);
		},
		onLeaveCancelled(e) {
			ne(e), $a(x, [e]);
		}
	});
}
function no(e) {
	if (e == null) return null;
	if (D(e)) return [ro(e.enter), ro(e.leave)];
	{
		let t = ro(e);
		return [t, t];
	}
}
function ro(e) {
	return Te(e);
}
function io(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ya] || (e[Ya] = /* @__PURE__ */ new Set())).add(t);
}
function ao(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ya];
	n && (n.delete(t), n.size || (e[Ya] = void 0));
}
function oo(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var so = 0;
function co(e, t, n, r) {
	let i = e._endId = ++so, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = lo(e, t);
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
function lo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${qa}Delay`), a = r(`${qa}Duration`), o = uo(i, a), s = r(`${Ja}Delay`), c = r(`${Ja}Duration`), l = uo(s, c), u = null, d = 0, f = 0;
	t === qa ? o > 0 && (u = qa, d = o, f = a.length) : t === Ja ? l > 0 && (u = Ja, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? qa : Ja : null, f = u ? u === qa ? a.length : c.length : 0);
	let p = u === qa && /\b(?:transform|all)(?:,|$)/.test(r(`${qa}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function uo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => fo(t) + fo(e[n])));
}
function fo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function po(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function mo(e, t, n) {
	let r = e[Ya];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var ho = /* @__PURE__ */ Symbol("_vod"), go = /* @__PURE__ */ Symbol("_vsh"), _o = /* @__PURE__ */ Symbol(""), vo = /(?:^|;)\s*display\s*:/;
function yo(e, t, n) {
	let r = e.style, i = E(n), a = !1;
	if (n && !i) {
		if (t) {
			if (E(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? xo(r, t, "");
			}
			else for (let e in t) n[e] ?? xo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? xo(r, i, "") : To(e, i, !E(t) && t ? t[i] : void 0, o) || xo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[_o];
			e && (n += ";" + e), r.cssText = n, a = vo.test(n);
		}
	} else t && e.removeAttribute("style");
	ho in e && ((!i || t !== n) && (e[ho] = a ? r.display : ""), e[go] && (r.display = "none"));
}
var bo = /\s*!important$/;
function xo(e, t, n) {
	if (w(n)) n.forEach((n) => xo(e, t, n));
	else if (n ??= "", t.startsWith("--")) bo.test(n) ? e.setProperty(t, n.replace(bo, ""), "important") : e.setProperty(t, n);
	else {
		let r = wo(e, t);
		bo.test(n) ? e.setProperty(ve(r), n.replace(bo, ""), "important") : e[r] = n;
	}
}
var So = [
	"Webkit",
	"Moz",
	"ms"
], Co = {};
function wo(e, t) {
	let n = Co[t];
	if (n) return n;
	let r = ge(t);
	if (r !== "filter" && r in e) return Co[t] = r;
	r = ye(r);
	for (let n = 0; n < So.length; n++) {
		let i = So[n] + r;
		if (i in e) return Co[t] = i;
	}
	return t;
}
function To(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && E(r) && n === r;
}
var Eo = "http://www.w3.org/1999/xlink";
function Do(e, t, n, r, i, a = Ne(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Eo, t.slice(6, t.length)) : e.setAttributeNS(Eo, t, n) : n == null || a && !Pe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : oe(n) ? String(n) : n);
}
function Oo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Va(n) : n);
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
		r === "boolean" ? n = Pe(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function ko(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ao(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var jo = /* @__PURE__ */ Symbol("_vei");
function Mo(e, t, n, r, i = null) {
	let a = e[jo] || (e[jo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Fo(t);
		r ? ko(e, n, a[t] = zo(r, i), s) : o && (Ao(e, n, o, s), a[t] = void 0);
	}
}
var No = /(Once|Passive|Capture)$/, Po = /^on:?(?:Once|Passive|Capture)$/;
function Fo(e) {
	let t, n;
	for (; (n = e.match(No)) && !Po.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : ve(e.slice(2)), t];
}
var Io = 0, Lo = /* @__PURE__ */ Promise.resolve(), Ro = () => Io ||= (Lo.then(() => Io = 0), Date.now());
function zo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (w(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && An(e, t, 5, a);
			}
		} else An(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ro(), n;
}
var Bo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Vo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? mo(e, r, o) : t === "style" ? yo(e, n, r) : b(t) ? x(t) || Mo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Ho(e, t, r, o)) ? (Oo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Do(e, t, r, o, a, t !== "value")) : e._isVueCE && (Uo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !E(r))) ? Oo(e, ge(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Do(e, t, r, o));
};
function Ho(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Bo(t) && T(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Bo(t) && E(n) ? !1 : t in e;
}
function Uo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ge(t);
	return Array.isArray(n) ? n.some((e) => ge(e) === r) : Object.keys(n).some((e) => ge(e) === r);
}
var Wo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return w(t) ? (e) => Se(t, e) : t;
};
function Go(e) {
	e.target.composing = !0;
}
function Ko(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var qo = /* @__PURE__ */ Symbol("_assign"), Jo = /* @__PURE__ */ Symbol("_initialValue");
function Yo(e, t, n) {
	return t && (e = e.trim()), n && (e = we(e)), e;
}
var Xo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Jo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Jo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[qo] = Wo(i);
		let a = r || i.props && i.props.type === "number";
		ko(e, t ? "change" : "input", (t) => {
			t.target.composing || e[qo](Yo(e.value, n, a));
		}), (n || a) && ko(e, "change", () => {
			e.value = Yo(e.value, n, a);
		}), t || (ko(e, "compositionstart", Go), ko(e, "compositionend", Ko), ko(e, "change", Ko));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Jo];
		delete e[Jo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[qo](Yo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[qo] = Wo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? we(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Zo = {
	deep: !0,
	created(e, t, n) {
		e[qo] = Wo(n), ko(e, "change", () => {
			let t = e._modelValue, n = ns(e), r = e.checked, i = e[qo];
			if (w(t)) {
				let e = Be(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (re(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(rs(e, r));
		});
	},
	mounted: Qo,
	beforeUpdate(e, t, n) {
		e[qo] = Wo(n), Qo(e, t, n);
	}
};
function Qo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (w(t)) i = Be(t, r.props.value) > -1;
	else if (re(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ze(t, rs(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var $o = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, ko(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? we(ns(e)) : ns(e)), r = e.multiple, i = r ? re(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? w(i) ? t.slice() : t : i];
			try {
				e[qo](i);
			} finally {
				Bn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[qo] = Wo(r);
	},
	mounted(e, { value: t }) {
		ts(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[qo] = Wo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !es(t, n[1], n[0])) && ts(e, t);
	}
};
function es(e, t, n) {
	if (!n || w(e)) return ze(e, t);
	if (re(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ts(e, t) {
	let n = e.multiple, r = w(t);
	if (!n || r || re(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = ns(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Be(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ze(ns(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function ns(e) {
	return "_value" in e ? e._value : e.value;
}
function rs(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var is = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], as = {
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
	exact: (e, t) => is.some((n) => e[`${n}Key`] && !t.includes(n))
}, os = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = as[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, ss = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, cs = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = ve(n.key);
		if (t.some((e) => e === r || ss[e] === r)) return e(n);
	}));
}, ls = /* @__PURE__ */ S({ patchProp: Vo }, Ka), us;
function ds() {
	return us ||= Ii(ls);
}
var fs = ((...e) => {
	let t = ds().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ms(e);
		if (!r) return;
		let i = t._component;
		!T(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ps(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ps(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ms(e) {
	return E(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var hs = () => ({
	formatVersion: 1,
	enabled: !0,
	presets: {},
	installed: {},
	sources: {},
	ui: {
		collapseStages: !0,
		annotations: { show: !0 }
	},
	dev: {
		url: "http://localhost:4747",
		enabled: !1
	},
	debug: { keepRequests: 20 }
}), gs = null;
function K() {
	if (gs) return gs;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = hs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return gs = /* @__PURE__ */ nn(n), gs;
}
var q = () => e().saveSettingsDebounced(), _s = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], vs = [
	"auto",
	"on",
	"off"
], ys = ["annotations"], bs = (e) => ys.includes(e.kind), xs = [
	"keep",
	"truncate",
	"remove"
], Ss = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Cs = [
	"==",
	"!=",
	"<=",
	">=",
	"&&",
	"||",
	"<",
	">",
	"!",
	"(",
	")",
	"[",
	"]",
	","
];
function ws(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = e[n];
		if (/\s/.test(r)) {
			n++;
			continue;
		}
		if (r === "\"" || r === "'") {
			let i = n + 1, a = "";
			for (; i < e.length && e[i] !== r;) e[i] === "\\" && i + 1 < e.length ? (a += e[i + 1], i += 2) : a += e[i++];
			if (i >= e.length) throw new Ss("Unterminated string", e, n);
			t.push({
				k: "str",
				v: a,
				pos: n
			}), n = i + 1;
			continue;
		}
		if (/[0-9]/.test(r) || r === "-" && /[0-9]/.test(e[n + 1] ?? "")) {
			let r = /^-?\d+(\.\d+)?/.exec(e.slice(n));
			t.push({
				k: "num",
				v: Number(r[0]),
				pos: n
			}), n += r[0].length;
			continue;
		}
		if (/[A-Za-z_]/.test(r)) {
			let r = /^[A-Za-z_][A-Za-z0-9_-]*(\.[A-Za-z_][A-Za-z0-9_-]*)*/.exec(e.slice(n));
			t.push({
				k: "id",
				v: r[0],
				pos: n
			}), n += r[0].length;
			continue;
		}
		let i = Cs.find((t) => e.startsWith(t, n));
		if (!i) throw new Ss(`Unexpected character '${r}'`, e, n);
		t.push({
			k: "op",
			v: i,
			pos: n
		}), n += i.length;
	}
	return t.push({
		k: "end",
		pos: e.length
	}), t;
}
var Ts = {
	"||": 1,
	"&&": 2,
	"==": 3,
	"!=": 3,
	"<": 4,
	"<=": 4,
	">": 4,
	">=": 4,
	in: 4
};
function Es(e) {
	let t = ws(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Ss(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Ts ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
	function s() {
		let t = i();
		switch (t.k) {
			case "str": return {
				t: "lit",
				v: t.v
			};
			case "num": return {
				t: "lit",
				v: t.v
			};
			case "id": return t.v === "true" ? {
				t: "lit",
				v: !0
			} : t.v === "false" ? {
				t: "lit",
				v: !1
			} : t.v === "null" ? {
				t: "lit",
				v: null
			} : {
				t: "var",
				path: t.v
			};
			case "op":
				if (t.v === "!") return {
					t: "not",
					e: s()
				};
				if (t.v === "(") {
					let e = c(0);
					return a(")"), e;
				}
				if (t.v === "[") {
					let e = [];
					if (r().k !== "op" || r().v !== "]") do
						e.push(c(0));
					while (r().k === "op" && r().v === "," && i());
					return a("]"), {
						t: "arr",
						items: e
					};
				}
				throw new Ss(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Ss("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Ts[n];
			if (a < e) break;
			i();
			let s = c(a + 1);
			t = {
				t: "bin",
				op: n,
				l: t,
				r: s
			};
		}
		return t;
	}
	let l = c(0), u = r();
	if (u.k !== "end") throw new Ss("Unexpected token", e, u.pos);
	return l;
}
function Ds(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function Os(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => Os(e, t));
		case "var": return t(e.path);
		case "not": return !Os(e.e, t);
		case "bin": {
			if (e.op === "&&") return !!Os(e.l, t) && !!Os(e.r, t);
			if (e.op === "||") return !!Os(e.l, t) || !!Os(e.r, t);
			let n = Os(e.l, t), r = Os(e.r, t);
			switch (e.op) {
				case "==": return Ds(n, r);
				case "!=": return !Ds(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Ds(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function ks(e, t) {
	return !e || !!Os(e, t);
}
function As(...e) {
	let t = e.filter((e) => !!e);
	if (t.length) return t.reduce((e, t) => ({
		t: "bin",
		op: "&&",
		l: e,
		r: t
	}));
}
//#endregion
//#region packages/protocol/src/macros.ts
var js = /\{\{ap::([^{}]*?)\}\}/g;
function Ms(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(js, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Ms(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Ns(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Ps(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Fs(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Ps(n[3] ?? n[4] ?? "");
	return t;
}
function Is(e, t) {
	let n = [], r = RegExp(`<${Ns(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Fs(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Fs(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Ls(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Rs(e, t) {
	let n = Is(e, t)[0];
	return n ? Ps(n.inner).trim() : void 0;
}
function zs(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Bs(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
function Vs(e, t = (e) => e) {
	let n = (e) => e && t(e).trim() || void 0, r = (e, t) => {
		let r = n(t);
		return r ? {
			...e,
			description: r
		} : e;
	}, i = (t, n = { type: "string" }) => r(n, e.properties?.[t]), a = (t) => r(t, e.description);
	switch (e.kind) {
		case "reply":
		case "impersonate": return a({ type: "string" });
		case "recap": return a({ type: ["string", "null"] });
		case "memory": return a({
			type: "array",
			items: {
				type: "object",
				properties: {
					scope: i("scope", {
						type: "string",
						enum: ["memory", "global_memory"]
					}),
					operation: i("operation", {
						type: "string",
						enum: ["replace", "delete"]
					}),
					key: i("key"),
					content: i("content", { type: ["string", "null"] })
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
		case "synopsis": return a({
			type: "object",
			properties: {
				time: i("time"),
				location: i("location"),
				event: i("event"),
				summary: i("summary")
			},
			required: [
				"time",
				"location",
				"event",
				"summary"
			],
			additionalProperties: !1
		});
		case "options": return a({
			type: "array",
			items: {
				type: "object",
				properties: {
					label: i("label"),
					content: i("content")
				},
				required: ["label", "content"],
				additionalProperties: !1
			},
			...e.count ? {
				minItems: e.count,
				maxItems: e.count
			} : {}
		});
		case "annotations": return a({ type: "string" });
		case "custom": return e.shape === "kv" ? a({
			type: "object",
			additionalProperties: { type: "string" }
		}) : a({ type: "string" });
	}
}
function Hs(e) {
	return e === "memory" || e === "recap";
}
var Us = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Ws(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Us(t).trim() || void 0;
		case "recap": return t === null ? null : Us(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Us(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Us(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Us(e.time),
				location: Us(e.location),
				event: Us(e.event),
				summary: Us(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Us(e.label ?? e.title).trim(),
			content: Us(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Us(t)]));
			}
			return Us(t).trim() || void 0;
	}
}
function Gs(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Ws(e.kind, Ps(n.inner));
		case "recap": return Ws("recap", Ps(n.inner));
		case "memory": return Ws("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Rs(e.inner, "scope"),
			operation: Rs(e.inner, "operation"),
			key: Rs(e.inner, "key"),
			content: Rs(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Rs(n.inner, "time") ?? "",
			location: Rs(n.inner, "location") ?? "",
			event: Rs(n.inner, "event") ?? "",
			summary: Rs(n.inner, "summary") ?? ""
		};
		case "options": return Is(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Ps(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Ps(t[2]).trim();
				return e;
			}
			return Ws("custom", Ps(n.inner), e);
	}
}
function Ks(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (bs(a)) continue;
		let t = Is(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Gs(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Ls(e, i),
		values: n,
		open: r
	};
}
function qs(e) {
	return Ps(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Js = {
	turn: {
		name: "ap_turn",
		field: "step{{n}}_{{actor}}_{{stage}}",
		fieldDescription: "{{label}}"
	},
	submit: {
		name: "ap_submit_turn",
		description: "Submit the complete workflow for this turn: every stage in order, then the final content and structures."
	},
	stage: {
		name: "ap_stage_{{stage}}",
		description: "{{label}}",
		param: { name: "content" },
		patchParam: { name: "edits" }
	},
	patch: {},
	envelope: {
		thinking: { name: "thinking" },
		result: { name: "result" }
	},
	results: {
		next: "Recorded. Continue with `{{next}}`.",
		done: "Recorded. The workflow is complete.",
		unknown: "Unknown tool {{name}}.",
		nudge: "Continue the workflow: call `{{next}}` now."
	},
	jsonStringHint: "(JSON object encoded as a string)",
	callerSchemaHint: "After your thinking, output the result as one JSON code block (```json … ```) that matches this JSON Schema:\n\n```json\n{{schema}}\n```"
}, Ys = (e) => e;
function Xs(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function Zs(e, t) {
	return e.stages.filter((e) => ks(e.when, t));
}
function Qs(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function $s(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = Qs(t);
	return n >= 0 ? n : t.length - 1;
}
function ec(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function tc(e, t, n = Js) {
	return Xs(t.field?.name ?? n.turn.field, ec(e, t));
}
function nc(e, t, n = Js) {
	return Xs(t.tool?.name ?? n.stage.name, ec(e, t));
}
function rc(e, t = Js) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var ic = (e, t) => t ? {
	...e,
	description: t
} : e;
function ac(e = Js, t = Ys, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return ic({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: ic({ type: "string" }, i(r.old)),
				new_string: ic({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function oc(e, t, n = Js, r = Ys) {
	return e.kind === "patch" ? ac(n, r, t) : ic({ type: "string" }, t);
}
function sc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function cc(e, t, n, r, i = Ys) {
	let a = r.filter((e) => !bs(e)), o = (e, t) => {
		if (e) return i(t ? Xs(e, ec(n, t)) : e).trim() || void 0;
	}, s = $s(t, n), c = (t) => tc(n, t, e), l = (t) => nc(n, t, e), u = (t) => rc(t, e).name, d = (e, t) => {
		for (let n of a) e[n.field] = Vs(n, i), Hs(n.kind) || t.push(n.field);
	}, f = () => {
		let t = {}, r = [];
		return n.forEach((n, a) => {
			let l = c(n);
			t[l] = oc(n, o(n.field?.description ?? e.turn.fieldDescription, n), e, i), n.optional || r.push(l), a === s && d(t, r);
		}), s < 0 && d(t, r), {
			type: "object",
			properties: t,
			required: r,
			additionalProperties: !1
		};
	}, p = () => n.map((t, n) => {
		let r = {}, a = [], c = rc(t, e);
		return r[c.name] = oc(t, o(c.description, t), e, i), a.push(c.name), n === s && d(r, a), sc(l(t), o(t.tool?.description ?? e.stage.description, t), {
			type: "object",
			properties: r,
			required: a,
			additionalProperties: !1
		});
	}), m = {
		thinking: e.envelope.thinking.name,
		result: e.envelope.result.name
	};
	return {
		fieldOf: c,
		toolOf: l,
		paramOf: u,
		stageOfTool: (e) => n.find((t) => l(t) === e),
		schema: () => {
			let t = o(e.turn.description);
			return {
				name: e.turn.name,
				...t ? { description: t } : {},
				value: f()
			};
		},
		turnSchema: f,
		submitTool: (t) => sc(e.submit.name, o(e.submit.description), t ?? f()),
		stageTools: p,
		envelope: (t) => ({
			type: "object",
			properties: {
				[m.thinking]: ic({ type: "string" }, o(e.envelope.thinking.description)),
				[m.result]: ic(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [m.thinking, m.result],
			additionalProperties: !1
		}),
		envelopeKeys: m,
		toolNames: () => [e.submit.name, ...n.map(l)]
	};
}
function lc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function uc(e) {
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
function dc(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - zs(t.content)).trimEnd());
}
function fc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function pc(e) {
	return e.map((e) => ({
		old_string: Rs(e, "old_string") ?? "",
		new_string: Rs(e, "new_string") ?? ""
	}));
}
function mc(e, t) {
	let n = uc(t.stages), r = Bs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Ns(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Ks(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Is(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = pc(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Ps(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Ls(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = Qs(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Ns(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), dc(t.stages, n, t.final), fc(t.stages, n, t.final), n;
}
function hc(e, t) {
	let n = uc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => tc(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (o = e.id, e.kind === "patch" ? n.stages[e.id].patches = gc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (bs(e)) continue;
		let r = a(e.field), i = Ws(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let s = Qs(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : o)), s >= 0 && n.stages[t.stages[s].id].text !== void 0 && (n.contentStarted = !0), dc(t.stages, n, t.final), fc(t.stages, n, t.final), n;
}
function gc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function _c(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function vc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = _c(e, n);
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
	let i = n.trim().split(/\s+/).map(Ns), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function yc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = vc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function bc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Ns(t), "gi"), a = [], o;
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
function xc(e, t, n = (e) => e) {
	if (!e) return [];
	let r = [];
	for (let i of e) {
		let e = n(i.pieces.filter((e) => ks(e.when, t)).map((e) => e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && r.push(i.role ? {
			role: i.role,
			text: e
		} : { text: e });
	}
	return r;
}
//#endregion
//#region packages/protocol/src/clone.ts
function Sc(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => Sc(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = Sc(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function Cc(e) {
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
function wc(e, t) {
	let n = Cc(e), r = Cc(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function Tc(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = Cc(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = wc(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var Ec = (e) => !!e && typeof e == "object" && !Array.isArray(e), Dc = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
};
function Oc(e, ...t) {
	let n = Sc(e);
	for (let e of t) n = kc(n, e);
	return n;
}
function kc(e, t) {
	if (t === void 0) return e;
	if (!Ec(e) || !Ec(t)) return Sc(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = kc(e[r], i);
	return n;
}
function Ac(e, t) {
	if (Ec(e) && Ec(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Ac(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : Sc(e);
}
function jc(e, t, n = "", r = [], i = Mc) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? Ec(e[a]) && Ec(t[a]) && (jc(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Mc = /* @__PURE__ */ new Set(["sampling"]);
function Nc(e, t, n) {
	let r = Sc(e);
	for (let e of t) if (Tc(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && Ec(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Pc(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Fc(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Ic(e, t, n) {
	if (t.type !== n.type) return e;
	switch (t.type) {
		case "string": {
			let r = e;
			return t.text ? r ? r + (n.separator ?? "") + t.text : t.text : r;
		}
		case "list": return [...e, ...t.items];
		case "dict": {
			let n = new Map(e);
			for (let { key: e, value: r } of t.items) r === null ? n.delete(e) : n.set(e, r);
			return n;
		}
	}
}
function Lc(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Fc(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Ic(r[t.var], t, e));
	}
	return r;
}
var Rc = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function zc(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Rc.test(e);
}
function Bc(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return zc(e) ? e : JSON.stringify(e);
}
var Vc = (e) => !e.includes("\n") && zc(e) ? e : JSON.stringify(e);
function Hc(e) {
	return e.map((e) => `- ${Bc(e, "  ")}`).join("\n");
}
function Uc(e) {
	return [...e].map(([e, t]) => `${Vc(e)}: ${Bc(t, "  ")}`).join("\n");
}
function Wc(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Hc(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Uc(e) : t === "keys" ? Hc([...e.keys()]) : t === "values" ? Hc([...e.values()]) : e.get(t) ?? "";
}
//#endregion
//#region packages/protocol/src/assemble.ts
function Gc(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Kc(e, t) {
	return !!e.groups[t]?.allowNone;
}
function qc(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || Kc(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => ks(e.when, n)) : i;
}
function Jc(e, t) {
	let n = new Set(qc(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Yc(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Xc(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Zc(e, t, n, r) {
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
	}, l = 0, u = (e) => l > 4 ? e : Ms(e, p), d = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		l++;
		try {
			return Wc(typeof n == "string" ? u(n) : Array.isArray(n) ? n.map(u) : new Map([...n].map(([e, t]) => [e, u(t)])), t);
		} finally {
			l--;
		}
	}, f = o.style, p = (e) => {
		let [r, o, l] = e;
		switch (r) {
			case "name": return Xc(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${Xc(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? l === "last" ? s.customLast?.[o] ?? "" : f === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : lc(t, (e) => Xc(i, a, e));
			case "input": return s.metaText ?? "";
			case "memory": return JSON.stringify((o === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "var": return d(o, l);
			default: return;
		}
	};
	return (e) => Ms(e, p);
}
function Qc(e, t) {
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
function $c(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? nc(n, t, e.tools) : tc(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Xc(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function el(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = Gc(i), s = a ? Zs(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = Gc(i), l = qc(n, r, c), u = Yc(n, l), d = Lc(n.vars, l), f = Zc({
		...e,
		vars: i
	}, s, a, d), p = new Set(l.map((e) => e.id)), m = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!p.has(e.module) || !ks(e.when, c)) continue;
		let t = m.get(e.region) ?? [];
		t.push(...xc(e.content, c, f)), m.set(e.region, t);
	}
	if (a) {
		let e = m.get(n.workflowRegion) ?? [];
		for (let t of xc($c(n, a, s, i.style, i.transport, r), c, f)) {
			let n = e[e.length - 1];
			!t.role && n && !n.role && n.workflow ? n.text += `\n\n${t.text}` : e.push({
				...t,
				workflow: !0
			});
		}
		m.set(n.workflowRegion, e);
	}
	let h = {};
	for (let e of n.regions) e.native || (h[e.id] = Qc(e, m.get(e.id) ?? []));
	return {
		vars: i,
		resolve: c,
		modules: l,
		structures: u,
		buildVars: d,
		workflow: a,
		stages: s,
		regions: h,
		expand: f
	};
}
function tl(e, t, n = {}) {
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
		modules: Jc(e, t),
		params: { ...t.params },
		flags: Object.fromEntries(e.regex.map((e) => [e.id, !1])),
		features: { tokenSaving: t.tokenSaving.enabled },
		stages: {},
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
var nl = /* @__PURE__ */ new Set([
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
]), rl = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), il = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, al = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function ol(e, t = {}) {
	let n = (e) => ol(e, t);
	if (!al(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && al(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => rl.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(al), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return sl({
			...n(t[0]),
			...r.description ? { description: r.description } : {}
		}, a);
		t.length && (i.anyOf = t.map((e) => n(e)));
	}
	if (o.length > 1) {
		let e = {
			...r,
			type: void 0,
			anyOf: void 0,
			oneOf: void 0,
			nullable: void 0
		};
		return sl({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && nl.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			al(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
			break;
		case "items":
			i.items = n(Array.isArray(t) ? t[0] : t);
			break;
		case "enum": {
			let e = Array.isArray(t) ? t.filter((e) => e != null).map(String) : [];
			e.length && (!s || s === "string") && (i.enum = e, i.type = "string");
			break;
		}
		case "format":
			s && il[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = al(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return sl({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), sl(i, a);
}
function sl(e, t) {
	return t && (e.nullable = !0), e;
}
function cl(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!al(n)) return e;
		let r = al(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: ol(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var ll = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function ul(e) {
	let t = e.configurationDefaults?.connection;
	return !ll(t) || Object.keys(Dc).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...Dc,
				...t
			}
		}
	};
}
function dl(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!ll(t) || "userInput" in t) && (!ll(n) || "userInput" in n)) return e;
	let r = ll(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: ll(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: ll(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function fl(e) {
	let t = dl(ul(e));
	return Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
}
function pl(e) {
	return !ll(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? fl(e) : null;
}
//#endregion
//#region packages/protocol/src/directives.ts
var ml = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, hl = /^\s*(```|~~~)/;
function gl(e) {
	let t = [], n = {};
	for (let r of e.matchAll(/([\w:.-]+)(?:\s*=\s*(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s"']+)))?/g)) {
		let e = r[2] ?? r[3] ?? r[4];
		e === void 0 ? t.push(r[1]) : n[r[1]] = e.replace(/\\(["'\\])/g, "$1");
	}
	return {
		args: t,
		attrs: n
	};
}
function _l(e, t = [], n = 1) {
	let r = [{
		tokens: [],
		line: n
	}], i = (e) => {
		let t = r[r.length - 1].tokens, n = t[t.length - 1];
		e.kind === "text" && n?.kind === "text" ? n.text += e.text : t.push(e);
	}, a = e.replace(/\r\n?/g, "\n").split("\n"), o = !1;
	return a.forEach((e, s) => {
		let c = s < a.length - 1 ? "\n" : "", l = n + s;
		if (hl.test(e) && (o = !o), o || !e.includes("<!--")) return i({
			kind: "text",
			text: e + c
		});
		let u = [...e.matchAll(ml)];
		if (!u.length) return i({
			kind: "text",
			text: e + c
		});
		let d = e.replace(ml, "").trim() === "", f = 0;
		for (let n of u) {
			n.index > f && i({
				kind: "text",
				text: e.slice(f, n.index)
			});
			let a = n[2].trim(), o = {
				name: n[1],
				...gl(a),
				raw: a,
				line: l
			};
			t.includes(o.name) ? r.push({
				head: o,
				tokens: [],
				line: l
			}) : i({
				kind: "directive",
				directive: o
			}), f = n.index + n[0].length;
		}
		d || i({
			kind: "text",
			text: e.slice(f) + c
		});
	}), r;
}
var vl = [
	"system",
	"user",
	"assistant"
], yl = ["dialogue", "imperative"];
function bl(e, t, n) {
	let r = [{ pieces: [] }], i = [], a = () => As(...i.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond));
	for (let o of e) {
		if (o.kind === "text") {
			let e = a();
			r[r.length - 1].pieces.push(e ? {
				text: o.text,
				when: e
			} : { text: o.text });
			continue;
		}
		let e = o.directive;
		switch (e.name) {
			case "as": {
				let n = e.args[0];
				vl.includes(n) || t(`@as expects one of ${vl.join(" | ")}`, e.line), i.length && t("@as cannot be used inside @if / @style", e.line), r.push({
					role: vl.includes(n) ? n : void 0,
					pieces: []
				});
				break;
			}
			case "style": {
				let n = e.args[0];
				if (n === "end") {
					i.pop();
					break;
				}
				if (!n || !yl.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				i.length && i[i.length - 1].style && i.pop(), i.push({
					cond: Es(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Es(e.raw);
					n?.(t, e.line), i.push({
						cond: t,
						line: e.line
					});
				} catch (n) {
					t(n.message, e.line), i.push({
						cond: {
							t: "lit",
							v: !1
						},
						line: e.line
					});
				}
				break;
			case "else": {
				let n = i[i.length - 1];
				!n || n.negated ? t("@else without matching @if", e.line) : n.negated = !0;
				break;
			}
			case "end":
				i.length || t("@end without matching @if / @style", e.line), i.pop();
				break;
			default: t(`unknown directive @${e.name}`, e.line);
		}
	}
	return i.length && t(`unclosed @if / @style (opened at line ${i[i.length - 1].line})`), r.filter((e) => e.pieces.some((e) => e.text.trim()));
}
function xl(e, t) {
	let n = [], [r] = _l(e), i = bl(r.tokens, (e, t) => n.push({
		message: e,
		line: t
	}));
	return t && i[0] && !i[0].role && (i[0] = {
		...i[0],
		role: t
	}), {
		content: i,
		errors: n
	};
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var Sl = "user-", Cl = "advanced-preset.user-modules", wl = (e) => `${Sl}${e}`;
function Tl() {
	return {
		match: "all",
		rules: []
	};
}
var El = ["on", "off"];
function Dl(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? El.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function Ol(e) {
	let t = e.words.map((e) => e.trim()).filter(Boolean);
	if (e.regex) {
		let e = t.flatMap((e) => {
			try {
				return [new RegExp(e, "iu")];
			} catch {
				return [];
			}
		});
		return e.length ? (t) => e.some((e) => e.test(t)) : null;
	}
	let n = t.map((e) => e.toLocaleLowerCase());
	return n.length ? (e) => {
		let t = e.toLocaleLowerCase();
		return n.some((e) => t.includes(e));
	} : null;
}
function kl(e, t) {
	let n = Ol(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var Al = (e) => ({
	t: "lit",
	v: e
});
function jl(e) {
	let t = {
		t: "var",
		path: e.path
	};
	switch (e.op) {
		case "on": return t;
		case "off": return {
			t: "not",
			e: t
		};
		case "in":
		case "notIn": {
			let n = {
				t: "bin",
				op: "in",
				l: t,
				r: {
					t: "arr",
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(Al)
				}
			};
			return e.op === "in" ? n : {
				t: "not",
				e: n
			};
		}
		default: return {
			t: "bin",
			op: e.op,
			l: t,
			r: Al(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function Ml(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(Dl).map((e) => {
		if (e.kind === "keyword") return Al(kl(e, t));
		if (e.kind === "var") return jl(e);
		try {
			return Es(e.source);
		} catch {
			return Al(!1);
		}
	});
	if (!n.length) return;
	let r = e.match === "any" ? "||" : "&&";
	return n.reduce((e, t) => ({
		t: "bin",
		op: r,
		l: e,
		r: t
	}));
}
function Nl(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Es(e.source), null;
		} catch (e) {
			return e.message;
		}
	}
	if (e.kind === "keyword" && e.regex) for (let t of e.words) try {
		new RegExp(t, "iu");
	} catch (e) {
		return e.message;
	}
	return null;
}
function Pl(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Fl(e, t) {
	return t.entries.filter((t) => !Pl(e, t.point));
}
function Il(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function Ll(e, t) {
	return (t.vars ?? []).filter((t) => Il(e, t.var)?.type !== t.type);
}
function Rl(e, t) {
	return [.../* @__PURE__ */ new Set([...Fl(e, t).map((e) => e.point), ...Ll(e, t).map((e) => e.var)])];
}
function zl(e) {
	switch (e.type) {
		case "string": return e.text.trim() ? e : null;
		case "list": {
			let t = e.items.filter((e) => e.trim());
			return t.length ? {
				...e,
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => e.key.trim()).map((e) => ({
				key: e.key.trim(),
				value: e.value?.trim() ? e.value : null
			}));
			return t.length ? {
				...e,
				items: t
			} : null;
		}
	}
}
function Bl(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Vl(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = wl(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: Ml(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => Il(e, t.var)?.type === t.type).map(zl).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = Pl(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Bl(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: xl(n.text, n.role).content
			});
		}
	}
	return {
		preset: {
			...e,
			modules: [...e.modules, ...a],
			entries: o
		},
		skipped: i
	};
}
function Hl(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Ul(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Wl(e, t, n) {
	let r = t.filter((e) => Tc(n, e.from));
	return r.length ? e.map((e) => {
		let t = e.entries, n = e.vars ?? [], i = e.trigger.rules;
		for (let { rename: e } of r) {
			let r = e.insertionPoints;
			r && (t = t.map((e) => r[e.point] ? {
				...e,
				point: r[e.point]
			} : e));
			let a = e.vars;
			a && (n = n.map((e) => a[e.var] ? {
				...e,
				var: a[e.var]
			} : e)), (e.modules || e.params) && (i = i.map((t) => t.kind === "var" ? {
				...t,
				path: Hl(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Ul(t.source, e)
			} : t));
		}
		return {
			...e,
			entries: t,
			vars: n,
			trigger: {
				...e.trigger,
				rules: i
			}
		};
	}) : e;
}
var Gl = (e) => !!e && typeof e == "object" && !Array.isArray(e), Kl = (e, t = "") => typeof e == "string" ? e : t, ql = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Jl = [
	"system",
	"user",
	"assistant"
], Yl = [
	"on",
	"off",
	"==",
	"!=",
	"in",
	"notIn",
	">",
	">=",
	"<",
	"<="
];
function Xl(e) {
	if (!Gl(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Kl(e.source)
	};
	if (e.kind === "keyword") {
		let t = {
			kind: "keyword",
			target: e.target === "recent" ? "recent" : "input",
			words: Array.isArray(e.words) ? e.words.filter((e) => typeof e == "string") : [],
			op: e.op === "none" ? "none" : "any"
		};
		return e.regex === !0 && (t.regex = !0), t.target === "recent" && typeof e.depth == "number" && e.depth >= 1 && (t.depth = Math.floor(e.depth)), t;
	}
	if (e.kind === "var" && typeof e.path == "string" && Yl.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(ql) : ql(e.value) && (t.value = e.value), t;
	}
	return null;
}
function Zl(e) {
	if (!Gl(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Kl(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Gl).map((e) => ({
			key: Kl(e.key),
			value: typeof e.value == "string" ? e.value : null
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t
		}];
	}
	return [];
}
function Ql(e) {
	if (!Gl(e) || !Array.isArray(e.entries)) return null;
	let t = Gl(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Gl(e)) return [];
		let n = {
			id: Kl(e.id) || `e${t + 1}`,
			point: Kl(e.point),
			text: Kl(e.text)
		};
		return Jl.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: Kl(e.id),
		name: Kl(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Zl) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Xl).filter((e) => !!e) : []
		}
	};
}
function $l(e, t) {
	return {
		format: Cl,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function eu(e) {
	if (Gl(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Ql).filter((e) => !!e);
		return {
			preset: Gl(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Kl(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Ql(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var tu = "{==", nu = "==}", ru = "{>>", iu = "<<}", au = /\n[ \t]*\n/g;
function ou(e, t) {
	au.lastIndex = t;
	let n = au.exec(e);
	return n ? n.index : Infinity;
}
function su(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function cu(e, t, n, r) {
	let i = ou(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function lu(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(tu, o)) {
		let t = o + 3, s = cu(e, t, nu, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - su(n, [nu]));
			break;
		}
		if (s < 0) {
			let n = Math.min(ou(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || ru.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(ru, l)) {
			let t = l + 3, s = cu(e, t, iu, n);
			if (s === null) break;
			if (s >= 0) {
				let n = e.slice(t, s).trim();
				c.trim() && n ? i.push({
					start: u,
					end: a.length,
					quote: c,
					comment: n
				}) : r.push("annotations: empty quote or comment ignored"), o = s + 3;
				continue;
			}
		}
		r.push("annotations: highlight without comment"), o = s + 3;
	} else if (e.startsWith(ru, o)) {
		let t = o + 3, i = cu(e, t, iu, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += ru, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (tu.startsWith(t) || ru.startsWith(t))) break scan;
		}
		a += e[o], o++;
	}
	let s = i.map((e, t) => ({
		id: `a${t + 1}`,
		start: e.start,
		end: e.end,
		quote: e.quote,
		prefix: a.slice(Math.max(0, e.start - 32), e.start),
		suffix: a.slice(e.end, e.end + 32),
		comment: e.comment
	}));
	return {
		text: a,
		annotations: s,
		warnings: r
	};
}
function uu(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function du(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function fu(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = uu(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + du(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function pu(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = fu(e, t);
			if (n = !0, r < 0) return t.orphan ? t : {
				...t,
				orphan: !0
			};
			let { orphan: i, ...a } = t, o = r + t.quote.length;
			return {
				...a,
				start: r,
				end: o,
				prefix: e.slice(Math.max(0, r - 32), r),
				suffix: e.slice(o, o + 32)
			};
		}),
		changed: n
	};
}
function mu(e, t) {
	let n = pu(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${tu}${t.quote}${nu}${ru}${t.comment}${iu}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region src/store/presets.ts
var hu = /* @__PURE__ */ nn(/* @__PURE__ */ new Map()), gu = /* @__PURE__ */ nn(/* @__PURE__ */ new Map());
async function _u() {
	try {
		let e = `${o()}dist/presets/`, t = await (await p(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = pl(await (await p(e + n, { cache: "no-cache" })).json());
			t && hu.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var vu = (e) => pl(e);
function yu() {
	return [.../* @__PURE__ */ new Set([
		...hu.keys(),
		...Object.keys(K().installed),
		...gu.keys()
	])].map((e) => bu(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function bu(e) {
	let t = gu.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Su(e), r = hu.get(e);
	if (n && (!r || wc(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var xu = /* @__PURE__ */ new WeakMap();
function Su(e) {
	let t = K().installed[e];
	if (t) return xu.has(t) || xu.set(t, pl(t)), xu.get(t) ?? void 0;
}
var Cu = (e) => bu(e)?.preset;
function wu(e) {
	K().installed[e.id] = e, q();
}
function Tu(e) {
	delete K().installed[e], q();
}
function Eu(e, t) {
	e ? gu.set(e.id, e) : t ? gu.delete(t) : gu.clear();
}
var Du = (e) => hu.has(e), Ou = {
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
	"banner.usesAp": "This preset uses Advanced Preset",
	"panel.enabled": "Enabled",
	"panel.open": "Open panel",
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
	"appearance.annotations": "Show annotations",
	"appearance.annotations.hint": "Dashed underlines on annotated text; hover or tap to read the note.",
	"appearance.annotationColor": "Annotation underline",
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
	"config.streamToolArguments": "Stream tool arguments",
	"config.streamToolArguments.hint": "Gemini's generateContent API returns tool calls whole unless asked to stream their arguments, and only Vertex AI (Gemini 3+) accepts that request. Auto asks on Vertex AI; On also asks on other Gemini-format connections, e.g. a custom endpoint backed by Vertex AI.",
	"config.streamToolArguments.auto": "Auto",
	"config.streamToolArguments.on": "On",
	"config.streamToolArguments.off": "Off",
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
	"writing.tokenSaving.hint": "Older turns are replaced by their synopsis; older user messages are kept, truncated or removed.",
	"writing.keepFullTurns": "Full turns kept",
	"writing.keepFullTurns.hint": "Most recent assistant turns that stay verbatim.",
	"writing.truncateUserAfter": "Truncate user after",
	"writing.truncateUserAfter.hint": "Characters kept of older user messages (0 = never).",
	"writing.userInput": "Older user messages",
	"writing.userInput.hint": "What happens to user messages outside the full turns. Remove suits expansion-style writing, where the story (and its synopsis) already contains the input.",
	"writing.userInput.keep": "Keep",
	"writing.userInput.keep.hint": "Send them unchanged",
	"writing.userInput.truncate": "Truncate",
	"writing.userInput.truncate.hint": "Keep only the first characters",
	"writing.userInput.remove": "Remove",
	"writing.userInput.remove.hint": "Leave them out entirely",
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
	"cards.synopsis.edit": "Edit synopsis",
	"cards.synopsis.time": "Time",
	"cards.synopsis.location": "Location",
	"cards.synopsis.event": "Event",
	"cards.synopsis.summary": "Summary",
	"cards.synopsis.keys": "Ctrl+Enter to save · Esc to cancel",
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
	"debug.noLog": "Empty",
	"debug.annotations": "Orphaned annotations",
	"debug.annotations.hint": "Annotations whose quoted text can no longer be found in the message (after edits). They are kept but not shown.",
	"debug.noOrphans": "None in this chat.",
	"um.title": "My modules",
	"um.help": "Add your own prompts at the insertion points this preset offers. They are stored locally and survive preset updates.",
	"um.noPoints": "This preset offers no insertion points.",
	"um.new": "New module",
	"um.newName": "My module {n}",
	"um.untitled": "Untitled module",
	"um.copyName": "{name} copy",
	"um.import": "Import",
	"um.exportAll": "Export all",
	"um.export": "Export",
	"um.duplicate": "Duplicate",
	"um.confirmDelete": "Confirm delete",
	"um.back": "Back",
	"um.reorder": "Drag to reorder",
	"um.noEntries": "No content",
	"um.name": "Module name",
	"um.imported": "Imported {n} module(s).",
	"um.importedMissing": "Imported {n} modules; {missing} refer to insertion points or variables that no longer exist.",
	"um.importFailed": "Import failed: {error}",
	"um.lostHint": "No longer in the preset: {points}. That part is skipped.",
	"um.lostAfterUpdate": "After the preset update, some insertion points or variables of these modules no longer exist: {names}",
	"um.content": "Content",
	"um.content.help": "Pick an insertion point and write the prompt. {{ap::…}} macros and directives such as <!-- @if condition --> … <!-- @end --> or <!-- @as assistant --> work here. The role follows the point's region unless set.",
	"um.point": "Insertion point",
	"um.pointMissing": "{id} (missing)",
	"um.pointLost": "The preset removed this insertion point; this content is skipped.",
	"um.bv": "Build variables",
	"um.bv.help": "Add to variables the preset reads in its prompts, such as planning points. Text is appended, list items are added and keys are set. Your keys override the preset's; an empty value removes the preset's entry.",
	"um.bv.add": "Update variable",
	"um.bv.lost": "The preset no longer has this variable (or changed its type); this update is skipped.",
	"um.bv.append": "Text to append…",
	"um.bv.item": "Item",
	"um.bv.key": "Key",
	"um.bv.value": "Value",
	"um.bv.removes": "Empty: remove this entry",
	"um.bv.addKey": "Add key",
	"um.bv.addItem": "Add item",
	"um.role": "Role",
	"um.role.merge": "Region role",
	"um.role.system": "System",
	"um.role.user": "User",
	"um.role.assistant": "Assistant",
	"um.removeEntry": "Remove",
	"um.addEntry": "Add insertion point",
	"um.text.placeholder": "Prompt to insert…",
	"um.lineError": "Line {line}: {message}",
	"um.trigger": "Trigger",
	"um.trigger.help": "Without conditions the module is always active. Keyword conditions look at this turn's input or recent messages, ignoring case; regular expressions are supported.",
	"um.always": "Always active",
	"um.addRule": "Add condition",
	"um.removeRule": "Remove condition",
	"um.subject": "Condition",
	"um.match.all": "Match all",
	"um.match.any": "Match any",
	"um.match.allJoin": "and",
	"um.match.anyJoin": "or",
	"um.or": " / ",
	"um.boolDesc": "{label}: {value}",
	"um.op.on": "Yes",
	"um.op.off": "No",
	"um.op.module.on": "On",
	"um.op.module.off": "Off",
	"um.op.in": "is",
	"um.op.notIn": "is not",
	"um.keyword": "Keywords",
	"um.expr": "Expression",
	"um.kw.input": "This input",
	"um.kw.recent": "Recent",
	"um.kw.recentN": "Last {n} messages",
	"um.kw.messages": "messages",
	"um.kw.any": "contains any",
	"um.kw.none": "contains none",
	"um.kw.placeholder": "Type a keyword, press Enter",
	"um.kw.regexPlaceholder": "Type a regular expression, press Enter",
	"um.kw.regex": "Regular expressions",
	"um.group.chat": "Chat",
	"um.group.generation": "This generation",
	"um.group.preset": "Preset & configuration",
	"um.group.advanced": "Advanced",
	"um.var.style": "Prompt style",
	"um.style.dialogue": "Dialogue",
	"um.style.imperative": "Imperative",
	"um.var.origin": "Origin",
	"um.origin.story": "Story",
	"um.origin.task": "Task",
	"um.var.genType": "Generation type",
	"um.genType.normal": "Normal",
	"um.genType.regenerate": "Regenerate",
	"um.genType.swipe": "Swipe",
	"um.genType.continue": "Continue",
	"um.genType.quiet": "Quiet",
	"um.genType.impersonate": "Impersonate",
	"um.var.metaPresent": "Has meta instruction",
	"um.var.metaPure": "Meta instruction only",
	"um.var.group": "Group chat",
	"um.var.hasChat": "Has chat memory",
	"um.var.hasGlobal": "Has global memory",
	"um.var.recap": "Has recap",
	"um.var.module": "Module",
	"um.var.param": "Parameter",
	"um.var.flag": "Regex flag"
}, ku = {
	en: Ou,
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
		"banner.usesAp": "当前预设使用 Advanced Preset",
		"panel.enabled": "启用",
		"panel.open": "打开面板",
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
		"appearance.annotations": "显示批注",
		"appearance.annotations.hint": "被批注的文字显示虚线下划线；悬停或轻点查看批注。",
		"appearance.annotationColor": "批注下划线颜色",
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
		"config.streamToolArguments": "流式工具参数",
		"config.streamToolArguments.hint": "Gemini 的 generateContent 接口默认一次性返回完整的工具调用，需要显式请求才会流式输出参数，且只有 Vertex AI（Gemini 3+）接受该请求。自动：仅在 Vertex AI 上请求；开启：在其他 Gemini 格式的连接上也请求，例如以 Vertex AI 为后端的自定义端点。",
		"config.streamToolArguments.auto": "自动",
		"config.streamToolArguments.on": "开启",
		"config.streamToolArguments.off": "关闭",
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
		"writing.tokenSaving.hint": "较早的轮次替换为事件摘要；较早的用户消息可保留、截断或移除。",
		"writing.keepFullTurns": "保留完整轮数",
		"writing.keepFullTurns.hint": "最近若干条助手回复保持原文。",
		"writing.truncateUserAfter": "用户消息截断",
		"writing.truncateUserAfter.hint": "较早用户消息保留的字符数（0 为不截断）。",
		"writing.userInput": "较早的用户消息",
		"writing.userInput.hint": "完整轮次之外的用户消息如何处理。扩写类写法中，正文（及其事件摘要）已包含用户输入，适合移除。",
		"writing.userInput.keep": "保留",
		"writing.userInput.keep.hint": "原样发送",
		"writing.userInput.truncate": "截断",
		"writing.userInput.truncate.hint": "只保留开头若干字符",
		"writing.userInput.remove": "移除",
		"writing.userInput.remove.hint": "完全不发送",
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
		"cards.synopsis.edit": "编辑事件摘要",
		"cards.synopsis.time": "时间",
		"cards.synopsis.location": "地点",
		"cards.synopsis.event": "事件",
		"cards.synopsis.summary": "概要",
		"cards.synopsis.keys": "Ctrl+Enter 保存 · Esc 取消",
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
		"debug.noLog": "空",
		"debug.annotations": "孤立批注",
		"debug.annotations.hint": "原文被编辑后已找不到所引用文字的批注。它们会被保留，但不会显示。",
		"debug.noOrphans": "当前聊天没有。",
		"um.title": "我的模组",
		"um.help": "在预设开放的插入位置加入你自己的提示词。它们保存在本地，预设更新后仍会保留。",
		"um.noPoints": "此预设没有开放插入位置。",
		"um.new": "新建模组",
		"um.newName": "我的模组 {n}",
		"um.untitled": "未命名模组",
		"um.copyName": "{name} 副本",
		"um.import": "导入",
		"um.exportAll": "全部导出",
		"um.export": "导出",
		"um.duplicate": "创建副本",
		"um.confirmDelete": "确认删除",
		"um.back": "返回",
		"um.reorder": "拖动排序",
		"um.noEntries": "无内容",
		"um.name": "模组名称",
		"um.imported": "已导入 {n} 个模组。",
		"um.importedMissing": "已导入 {n} 个模组，其中 {missing} 个引用了失效的插入位置或变量。",
		"um.importFailed": "导入失败：{error}",
		"um.lostHint": "预设中已不存在：{points}。相关内容不会生效。",
		"um.lostAfterUpdate": "预设更新后，以下模组的部分插入位置或变量已失效：{names}",
		"um.content": "插入内容",
		"um.content.help": "选择预设开放的插入位置并写入提示词。支持 {{ap::…}} 宏，以及 <!-- @if 条件 --> … <!-- @end -->、<!-- @as assistant --> 等指令。角色默认跟随插入位置所在的区域。",
		"um.point": "插入位置",
		"um.pointMissing": "{id}（已失效）",
		"um.pointLost": "该插入位置已被预设移除，这段内容不会生效。",
		"um.bv": "构建变量",
		"um.bv.help": "向预设在提示词中读取的变量（如规划要点）添加内容：文本追加到末尾，列表添加项，字典设置键。与预设同键时以你的为准；值留空即移除预设的该项。",
		"um.bv.add": "更新变量",
		"um.bv.lost": "预设已移除此变量或更改了类型，这项更新不会生效。",
		"um.bv.append": "要追加的内容…",
		"um.bv.item": "项",
		"um.bv.key": "键",
		"um.bv.value": "值",
		"um.bv.removes": "留空即移除此项",
		"um.bv.addKey": "添加键",
		"um.bv.addItem": "添加项",
		"um.role": "角色",
		"um.role.merge": "跟随区域",
		"um.role.system": "系统",
		"um.role.user": "用户",
		"um.role.assistant": "助手",
		"um.removeEntry": "移除",
		"um.addEntry": "添加插入位置",
		"um.text.placeholder": "要插入的提示词…",
		"um.lineError": "第 {line} 行：{message}",
		"um.trigger": "触发条件",
		"um.trigger.help": "没有条件时始终生效。关键词条件检查本轮输入或最近的消息，不区分大小写，也可以使用正则表达式。",
		"um.always": "始终生效",
		"um.addRule": "添加条件",
		"um.removeRule": "移除条件",
		"um.subject": "条件类型",
		"um.match.all": "满足全部",
		"um.match.any": "满足任一",
		"um.match.allJoin": "且",
		"um.match.anyJoin": "或",
		"um.or": "、",
		"um.boolDesc": "{label}：{value}",
		"um.op.on": "是",
		"um.op.off": "否",
		"um.op.module.on": "开启",
		"um.op.module.off": "关闭",
		"um.op.in": "是",
		"um.op.notIn": "不是",
		"um.keyword": "关键词",
		"um.expr": "表达式",
		"um.kw.input": "本轮输入",
		"um.kw.recent": "最近消息",
		"um.kw.recentN": "最近 {n} 条消息",
		"um.kw.messages": "条",
		"um.kw.any": "包含任一",
		"um.kw.none": "均不包含",
		"um.kw.placeholder": "输入关键词，回车添加",
		"um.kw.regexPlaceholder": "输入正则表达式，回车添加",
		"um.kw.regex": "正则表达式",
		"um.group.chat": "聊天",
		"um.group.generation": "本轮生成",
		"um.group.preset": "预设与配置",
		"um.group.advanced": "高级",
		"um.var.style": "提示风格",
		"um.style.dialogue": "对话式",
		"um.style.imperative": "指令式",
		"um.var.origin": "生成来源",
		"um.origin.story": "故事",
		"um.origin.task": "任务",
		"um.var.genType": "生成类型",
		"um.genType.normal": "普通",
		"um.genType.regenerate": "重新生成",
		"um.genType.swipe": "滑动",
		"um.genType.continue": "继续",
		"um.genType.quiet": "静默",
		"um.genType.impersonate": "代写",
		"um.var.metaPresent": "含元指令",
		"um.var.metaPure": "纯元指令",
		"um.var.group": "群聊",
		"um.var.hasChat": "有聊天记忆",
		"um.var.hasGlobal": "有全局记忆",
		"um.var.recap": "有总结",
		"um.var.module": "模组",
		"um.var.param": "参数",
		"um.var.flag": "正则标记"
	}
};
function Au() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function J(e, t = {}) {
	return ((ku[Au()] ?? ku[Au().split("-")[0]])?.[e] ?? Ou[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function ju(e) {
	return e.locales?.[Au()] ?? e.locales?.[Au().split("-")[0]];
}
function Y(e, t, n, r, i) {
	let a = ju(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Mu(e) {
	let t = ju(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Nu(e) {
	let t = ju(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
//#endregion
//#region src/store/config.ts
function Pu(e) {
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
function Fu(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Pc(e, n.id)?.diff;
}
function Iu(e, t = Pu(e).active.ref) {
	return Oc(e.configurationDefaults, Fu(e, Pu(e), t));
}
function Lu(e) {
	let t = Pu(e);
	return Oc(Iu(e, t.active.ref), t.active.diff);
}
function Ru(e, t) {
	let n = Pu(e);
	n.active.diff = Ac(t, Iu(e, n.active.ref)) ?? {}, q();
}
function zu(e, t) {
	let n = Lu(e);
	return t(n), Ru(e, n), n;
}
function Bu(e, t) {
	let n = Pu(e);
	n.active = {
		ref: t,
		diff: {}
	}, q();
}
var Vu = (e) => Object.keys(Pu(e).active.diff ?? {}).length > 0;
function Hu(e) {
	Pu(e).active.diff = {}, q();
}
function Uu(e, t) {
	let n = Pu(e), r = Lu(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Ac(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, q(), i;
}
function Wu(e, t) {
	let n = Pu(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Ac(Lu(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), q());
}
function Gu(e, t, n) {
	let r = Pu(e).saved.find((e) => e.id === t);
	r && (r.name = n, q());
}
function Ku(e, t) {
	let n = Pu(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), q();
}
function qu(e) {
	let t = Pu(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = wc(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Nc(t, e.migrations, n) : Sc(t);
		i.push(...jc(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) e.params.some((e) => e.id === t) || (delete c[t], i.push(`params.${t}`));
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Wl(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && Rl(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, q(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && f("warning", J("um.lostAfterUpdate", { names: s.join(", ") }), Mu(e)), i;
}
//#endregion
//#region src/store/carrier.ts
var Ju = "advanced_preset", Yu = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Xu = (e) => Yu[e] ?? e, Zu = () => e().getPresetManager("openai"), Qu = (e) => `AP · ${e.name}`;
function $u() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function ed(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function td(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...Sc(t.sampling),
		prompts: Sc(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: Sc(n)
		})),
		extensions: { [Ju]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function nd(e) {
	let t = Zu();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function rd(e, t, n) {
	let r = Zu();
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
async function id(e, t = {}) {
	let n = Zu(), r = Pu(e), i = nd(e.id), a = i ?? Qu(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Ju];
	if (!o || t.force || s?.hash !== e.hash) {
		o && r.carrierHash && ed(o) !== r.carrierHash && f("info", J("carrier.reset", { name: a }));
		let n = td(e, Lu(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = ed(n), q(), await rd(a, n, !!t.select);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function ad(e) {
	await id(e, { select: !0 });
}
async function od(e) {
	let t = nd(e.id);
	if (!t) return;
	let n = Zu(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Lu(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...Sc(i)
	}, o = n.getSelectedPresetName() === t;
	sd = !0;
	try {
		await rd(t, a, o);
	} finally {
		sd = !1;
	}
}
var sd = !1;
function cd(t) {
	if (sd || $u() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Lu(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Xu(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = Sc(r));
	}
	return Object.keys(i).length ? (zu(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/store/sidecar.ts
var ld = "advanced_preset";
function ud(e) {
	let t = e?.extra?.[ld];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function dd(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: Sc(n)
		}
	};
}
function fd(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[ld] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[ld] = Sc(n));
}
//#endregion
//#region src/store/eventlog.ts
var pd = "advanced_preset";
function md() {
	return e().chatMetadata?.[pd]?.seedEvents ?? [];
}
function hd(t = Infinity) {
	let n = md().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of ud(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function gd(e = Infinity) {
	let t = {};
	for (let { event: n } of hd(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function _d(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of hd(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function vd(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = ud(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[pd] && (e.extra[pd].events = Sc(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[pd] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function yd(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key];
	return t;
}
function bd(e, t, n, r, i) {
	let a = e.globalMemory, o = yd(e)[n] ?? null;
	return a.log.splice(a.cursor), a.log.push({
		op: t,
		key: n,
		content: r,
		prev: o,
		source: i,
		at: Date.now()
	}), a.cursor = a.log.length, q(), a.cursor - 1;
}
var xd = (e) => e.globalMemory.cursor > 0, Sd = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Cd(e) {
	xd(e) && (e.globalMemory.cursor--, q());
}
function wd(e) {
	Sd(e) && (e.globalMemory.cursor++, q());
}
function Td(e, t) {
	let n = e.globalMemory.log[t];
	n && (n.prev === null ? bd(e, "delete", n.key, void 0, "undo") : bd(e, "replace", n.key, n.prev, "undo"));
}
function Ed(e, t) {
	let n = [];
	for (let r of t) if (r.scope === "global_memory") {
		let t = bd(e, r.operation, r.key, r.content ?? "", "model");
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
var Dd = null, Od = (e) => {
	Dd = e;
}, kd = () => {
	let e = Dd;
	return Dd = null, e;
};
function Ad(t, n) {
	let r = Ms(t.meta.trigger, (e) => e[0] === "name" ? Xc(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function jd(e, t, n, r, i, a = [], o = !0) {
	let s = bc(n, Ad(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = Gc(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && ks(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && ks(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && ks(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? kd() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Md(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Nd = 0, Pd = () => `ap-${Date.now().toString(36)}-${(++Nd).toString(36)}`, Fd = /* @__PURE__ */ new Map(), Id = null, Ld = null, Rd = {
	setPending(e) {
		Id = e;
	},
	takePending() {
		let e = Id;
		return Id = null, e;
	},
	peekPending: () => Id,
	arm(e) {
		Ld = e, Fd.set(e.id, e);
	},
	takeArmed() {
		let e = Ld;
		return Ld = null, e;
	},
	get: (e) => Fd.get(e),
	release(e) {
		Fd.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of Fd) t - r.createdAt > e && Fd.delete(n);
	}
}, zd = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, Bd = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function Vd(e, t, n = "") {
	return e.replace(/\{\{(time|location|event|summary|content)\}\}/g, (e, r) => r === "content" ? n : t[r] ?? "");
}
var Hd = (e, t) => t ? zd(e)?.structures?.[t] : void 0;
function Ud(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	if (n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = zd(e);
		if (a && Bd.has(a.turn)) {
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
		let n = bc(e.item.mes, t.trigger, t.wrap);
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
				let n = t.tokenSaving.userInput ?? "truncate";
				if (n === "remove") return [];
				let r = t.tokenSaving.truncateUserAfter;
				return [n === "truncate" && r > 0 && e.item.mes.length > r ? {
					...e,
					item: {
						...e.item,
						mes: `${e.item.mes.slice(0, r)}…`
					}
				} : e];
			}
			let r = Hd(e.item, t.synopsisId);
			return [r ? {
				...e,
				item: {
					...e.item,
					mes: Vd(t.synopsisTemplate, r)
				}
			} : e];
		});
	}
	let i = n.map((t) => t.item.mes === e[t.index].mes), a = (e) => {
		let t = [];
		for (let r = n.length - 1; r >= 0 && t.length < e; r--) !n[r].item.is_user && !n[r].item.is_system && t.push(r);
		return t;
	};
	for (let e of a(t.annotations?.depth ?? 0)) {
		let t = n[e], r = zd(t.item)?.annotations;
		if (!r?.length || !i[e]) continue;
		let a = mu(t.item.mes, r);
		a !== t.item.mes && (n[e] = {
			...t,
			item: {
				...t.item,
				mes: a
			}
		});
	}
	let o = t.synopsisHistory;
	if (o && t.synopsisId) for (let e of a(o.depth)) {
		let r = n[e], a = i[e] ? Hd(r.item, t.synopsisId) : void 0;
		a && (n[e] = {
			...r,
			item: {
				...r.item,
				mes: Vd(o.template, a, r.item.mes)
			}
		});
	}
	return n.map((e) => e.item);
}
function Wd(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations");
	if (n?.history) return qc(e, t).some((e) => e.structures.includes(n.id)) ? { depth: n.history } : void 0;
}
function Gd(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "synopsis"), r = {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: n?.id
	};
	return n?.history && qc(e, t).some((e) => e.structures.includes(n.id)) && (r.synopsisHistory = {
		depth: n.history,
		template: n.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	}), r;
}
var Kd = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function qd(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Jd(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = qd(e), r = qd(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function Yd(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Kd(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Kd(l.text);
			if (c === u || c.includes(u) || Jd(c, u) >= n) {
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
//#region src/store/user-modules.ts
var Xd = 50;
function Zd(e) {
	let t = Pu(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var Qd = () => Math.random().toString(36).slice(2, 8);
function $d(e) {
	let t = new Set(e), n = Qd();
	for (; t.has(n);) n = Qd();
	return n;
}
function ef(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: $d(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function tf(e, t) {
	let n = Zd(e), r = {
		id: $d(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: Tl()
	};
	return e.insertionPoints.length && r.entries.push(ef(e, r)), n.push(r), q(), n[n.length - 1];
}
function nf(e, t, n) {
	let r = Zd(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...Sc(r[i]),
		id: $d(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), q(), r[i + 1];
}
function rf(e, t) {
	let n = Pu(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), q();
}
function af(e, t, n) {
	let r = Zd(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), q();
}
function of(e, t) {
	return $l(Sc(Zd(e).filter((e) => !t || t.includes(e.id))), e);
}
function sf(e, t) {
	let n = eu(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && wc(n.preset.version, e.version) < 0 && (r = Wl(r, e.migrations, n.preset.version));
	let i = Zd(e), a = r.map((e) => {
		let t = {
			...e,
			id: $d(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return q(), {
		added: a,
		missing: a.filter((t) => Rl(e, t).length).length
	};
}
function cf(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Xd; t--) {
		let r = e[t];
		!r.is_system && r.mes && n.push(r.mes);
	}
	return {
		input: t >= 0 ? e[t]?.mes ?? "" : "",
		recent: n
	};
}
//#endregion
//#region src/core/interceptor.ts
async function lf(t, n, r, i) {
	if (Rd.setPending(null), !K().enabled) return;
	let a = $u(), o = a ? Cu(a) : void 0;
	if (!o) return;
	let s = Lu(o), c = i || "normal", l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = u >= 0 ? t[u].mes : "", f = t.slice(-6).map((e) => e.mes), p = cf(t, u), { meta: m, flags: h, origin: g } = jd(o, s, d, c, !0, f), _ = e().chat, v = t.map((e) => _.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), y = Ud(t, {
		trigger: Ad(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Gd(o, s),
		recap: _d(),
		realIndex: (e) => v[e] ?? -1,
		currentInput: u,
		annotations: Wd(o, s)
	});
	t.splice(0, t.length, ...y);
	let b = {
		id: Pd(),
		preset: o,
		config: s,
		origin: g,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: m,
		flags: h,
		transport: s.connection.transport,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? v[u] ?? _.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		keywords: p,
		createdAt: Date.now(),
		warnings: []
	};
	Rd.setPending(b);
}
//#endregion
//#region src/core/debug.ts
var uf = /* @__PURE__ */ nn({
	log: [],
	requests: []
}), df = 50;
function ff(e, t) {
	uf.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), uf.log.length > df && (uf.log.length = df);
}
function pf(e) {
	return uf.requests.unshift(e), uf.requests.length > df && (uf.requests.length = df), uf.requests[0];
}
//#endregion
//#region src/core/assembler.ts
var mf = /⟦ap:region:([\w.-]+)⟧/g, hf = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function gf(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(mf)) {
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
function _f(t, n) {
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Xc(t, n, t.user), s = Xc(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = ud(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? qs(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function vf(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = ud(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function yf(t, n) {
	let { preset: r, config: i } = t, a = gd(), o = yd(Pu(r)), s = _d(), c = _f(r, i), l = t.transport;
	return {
		vars: tl(r, i, {
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
			customLast: vf(r)
		}
	};
}
function bf(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = Yd(s.map(({ m: e }) => ({
		role: e.role,
		text: hf(e.content)
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
			mes: hf(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = Ud(d, {
		trigger: Ad(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		...Gd(r, i),
		recap: _d(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1,
		annotations: Wd(r, i)
	}), m = new Map(p.map((e) => [e.__h, e.mes])), h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function xf(t, n) {
	let r = n ? null : Rd.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Lu(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = jd(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: Pd(),
		preset: t,
		config: i,
		origin: u,
		stType: n ? "normal" : "script",
		interceptorRan: !1,
		dryRun: n,
		meta: c,
		flags: l,
		transport: i.connection.transport,
		stages: [],
		structures: [],
		inputIndex: -1,
		createdAt: Date.now(),
		warnings: [],
		keywords: cf(a, n ? o : -1)
	};
}
var Sf = Symbol("ap-region");
function Cf(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => hf(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Xc(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = hf(t.content);
		if (t[Sf] || t.role === "system") return n;
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
async function wf(t) {
	let { chat: n, dryRun: r } = t;
	if (!K().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		r || (Rd.setPending(null), Rd.takeArmed());
		return;
	}
	let i = $u(), a = i ? Cu(i) : void 0;
	if (!a) {
		let e = gf(n).filter((e) => !e.__anchor);
		n.splice(0, n.length, ...e);
		return;
	}
	let o = xf(a, r), s = gf(n);
	!o.interceptorRan && !r && bf(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : Md(a, o.config, o.origin), { vars: u, data: d } = yf(o, l), f = Vl(a, Zd(a), o.keywords);
	for (let e of f.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let p = el({
		preset: f.preset,
		config: o.config,
		vars: u,
		data: d
	}, l);
	o.workflow = l, o.assembly = p, o.stages = p.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : p.structures;
	let m = (t) => e().substituteParams(t), h = [], g = -1, _ = {
		genId: o.id,
		at: Date.now(),
		dryRun: r,
		origin: o.origin,
		transport: o.transport,
		workflow: l?.id ?? "",
		modules: p.modules.map((e) => e.id),
		regions: [],
		warnings: o.warnings,
		vars: Object.entries(p.buildVars).map(([e, t]) => ({
			id: e,
			text: Wc(t)
		}))
	};
	for (let e of s) {
		if (!e.__anchor) {
			h.push(e);
			continue;
		}
		let t = e.__anchor, n = (p.regions[t] ?? []).map((e) => {
			let t = {
				role: e.role,
				content: m(e.content)
			};
			return Object.defineProperty(t, Sf, { value: !0 }), t;
		}).filter((e) => hf(e.content).trim());
		_.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: hf(e.content).length,
				content: hf(e.content)
			}))
		}), h.push(...n), t === a.anchors.historyStart && (g = h.length);
	}
	let v = o.transport === "prefill" && !c && g >= 0 ? Cf(o, h, g) : h;
	n.splice(0, n.length, ...v.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), ff("assembly", _), !r && !c && l && Rd.arm(o);
}
//#endregion
//#region src/core/transports/tool-args.ts
var Tf = "stream_function_call_arguments";
function Ef(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function Df(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Of(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Tf] = !0, t() && kf(e));
}
function kf(e) {
	let t = Af(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Df(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Af(e) {
	let t = e;
	if (typeof e == "string") {
		if (!e.trim()) return {};
		try {
			t = JSON.parse(e);
		} catch {
			return null;
		}
	}
	return t == null ? {} : typeof t == "object" && !Array.isArray(t) ? { ...t } : null;
}
//#endregion
//#region src/core/transports/base.ts
function jf(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of cc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Mf(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Nf(e) {
	return cc(e.preset.tools, e.workflow, e.stages, e.structures, Mf(e));
}
function Pf(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Xc(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Ff(e, t, n) {
	let r = Xs(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Mf(e)(r);
}
function If(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Mf(r), u = l(o.tool.description);
	return {
		tool: {
			type: "function",
			function: {
				name: o.tool.name,
				...u ? { description: u } : {},
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
				content: Ff(r, o.response[t], { first: n })
			}
		]
	};
}
function Lf(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && Rf(n, e.ctx.preset.tools.jsonStringHint), Ef(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && Of(n), n;
}
function Rf(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = cl(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: ol(e.json_schema.value, n)
	});
}
function zf(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/transports/text.ts
function Bf(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Pf(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => mc(e, {
		stages: t.stages,
		prefixes: r,
		user: t.preset.user,
		contentMarker: t.preset.contentMarker,
		structures: t.structures,
		format: n ? "prefix" : t.preset.plaintextFormat,
		final: i
	}), s = [...e.messages];
	if (e.caller.schema) {
		let n = {
			role: "system",
			content: Xs(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Lf({
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
			let n = zf(t, e.caller);
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
var Vf = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Hf = 32, Uf = 10, Wf = 9, Gf = 13, Kf = 160, qf = 6158, Jf = 8192, Yf = 8203, Xf = 8239, Zf = 8287, Qf = 12288, $f = 65279;
function ep(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function tp(e) {
	return e >= "0" && e <= "9";
}
function np(e) {
	return e >= " ";
}
function rp(e) {
	return ",:[]/{}()\n+".includes(e);
}
function ip(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function ap(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var op = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, sp = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function cp(e) {
	return ",[]/{}\n+".includes(e);
}
function lp(e) {
	return hp(e) || up.test(e);
}
var up = /^[[{\w-]$/;
function dp(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function fp(e, t) {
	let n = e.charCodeAt(t);
	return n === Hf || n === Uf || n === Wf || n === Gf;
}
function pp(e, t) {
	let n = e.charCodeAt(t);
	return n === Hf || n === Wf || n === Gf;
}
function mp(e, t) {
	let n = e.charCodeAt(t);
	return n === Kf || n === qf || n >= Jf && n <= Yf || n === Xf || n === Zf || n === Qf || n === $f;
}
function hp(e) {
	return gp(e) || vp(e);
}
function gp(e) {
	return e === "\"" || e === "“" || e === "”";
}
function _p(e) {
	return e === "\"";
}
function vp(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function yp(e) {
	return e === "'";
}
function bp(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function xp(e, t) {
	let n = e.length;
	if (!fp(e, n - 1)) return e + t;
	for (; fp(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function Sp(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Cp(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var wp = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Tp(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = wp[n];
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
function Ep(e) {
	return e !== null && e.char === "\"";
}
function Dp(e) {
	return e !== null && e.char === "'";
}
function Op(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function kp(e, t) {
	switch (t) {
		case ")": return Op(e, "(") > Op(e, ")");
		case "]": return Op(e, "[") > Op(e, "]");
		case "}": return Op(e, "{") > Op(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Ap = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, jp = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Mp(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || ie(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), lp(e[t]) && Cp(n) ? (r || (n = xp(n, ",")), g()) : r && (n = bp(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	re();
	function i() {
		a();
		let e = m() || h() || _() || y() || b() || S(!1) || ee();
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
		let i = r ? fp : pp, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (mp(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Np(e, t);) t++;
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
			if (ip(e[t])) for (; t < e.length && ap(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = xp(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = bp(n, ",")) : ae();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (lp(e[t]) || c ? n = xp(n, ":") : T()), i() || (s || c ? n += "null" : T()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = xp(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = xp(n, ",")), p(), !i()) {
					r || (n = bp(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = xp(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = xp(n, ",")), t = i();
		t || (n = bp(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, hp(e[t]) || re());
		let s = e[t] === "&" ? Tp(e.slice(t, t + 12)) : null, c = Ep(s) || Dp(s);
		if (hp(e[t]) || c) {
			let l = _p(e[t]) ? _p : yp(e[t]) ? yp : vp(e[t]) ? vp : gp, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = te(t - 1);
					return !r && rp(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = xp(p, "\""), n += p, !0);
				}
				if (t === i) return p = xp(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Tp(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || rp(e[t]) && !kp(p, e[t]) || hp(e[t]) && !C(t) || tp(e[t])) return v(), !0;
					e[t] === "\\" && re();
					let s = te(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (rp(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && cp(e[t])) {
					if (e[t - 1] === ":" && op.test(e.substring(u + 1, t + 2))) for (; t < e.length && sp.test(e[t]);) p += e[t], t++;
					return p = xp(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : dp(e) ? p += Ap[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (jp[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && ep(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : E();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : dp(n) ? (p += Ap[n], t++) : (np(n) || ne(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = bp(n, "\"", !0);
			let e = n.length;
			n = _() ? Sp(n, e, 1) : xp(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !tp(e[t]) && w() && (i += "0")), e[t] === "0" && tp(e[t + 1]) && (a = !0); tp(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, tp(e[t]) || (i += "0"); tp(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), tp(e[t]) || (i += "0"); tp(e[t]);) i += e[t], t++;
			return w() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !ap(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (ip(e[t])) {
			for (; t < e.length && ap(e[t]);) t++;
			let n = t;
			for (; fp(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !cp(e[t]) && !hp(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && op.test(e.substring(a, t + 2))) for (; t < e.length && sp.test(e[t]);) t++;
		if (t > a) {
			for (; fp(e, t - 1) && t > 0;) t--;
			let r = e.slice(a, t);
			return n += r === "undefined" ? "null" : JSON.stringify(r), e[t] === "\"" && t++, !0;
		}
	}
	function ee() {
		if (e[t] === "/") {
			let r = t;
			for (t++; t < e.length && (e[t] !== "/" || e[t - 1] === "\\");) t++;
			return t++, n += JSON.stringify(e.substring(r, t)), !0;
		}
	}
	function te(t) {
		let n = t;
		for (; n > 0 && fp(e, n);) n--;
		return n;
	}
	function C(t) {
		let n = t + 1;
		for (; n < e.length && fp(e, n);) n++;
		return n >= e.length || rp(e[n]);
	}
	function w() {
		return t >= e.length || rp(e[t]) || fp(e, t);
	}
	function ne(e) {
		throw new Vf(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function re() {
		throw new Vf(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ie() {
		throw new Vf("Unexpected end of json string", e.length);
	}
	function ae() {
		throw new Vf("Object key expected", t);
	}
	function T() {
		throw new Vf("Colon expected", t);
	}
	function E() {
		throw new Vf(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Np(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Pp(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Fp(e, t) {
	let n = Pp(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Mp(n));
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
function Ip(e, t, n, r) {
	let i = uc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function Lp(e) {
	let { ctx: t, caller: n } = e, r = Nf(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = Fp(c(e), i);
		return s = a.value, n.schema ? Ip(t, r, a.value, i) : hc(a.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: a.openKey,
			fieldOf: r.fieldOf
		});
	}, u = n.schema ? {
		name: n.schema.name ?? i.name,
		value: a,
		strict: !1
	} : {
		name: i.name,
		...i.description ? { description: i.description } : {},
		value: a,
		strict: !1
	};
	return {
		body: () => Lf(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Rp = (e, t) => ({
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
function zp(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Bp(e) {
	let { ctx: t, caller: n } = e, r = Nf(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = If(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = Fp((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? Ip(t, r, o.value, i) : hc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => Lf(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = zf(e, n);
			return {
				done: !0,
				callerToolCalls: t.length ? t : void 0
			};
		},
		result: () => f(u, !0),
		rawText: () => u.text,
		callerResult: () => d?.[r.envelopeKeys.result]
	};
}
function Vp(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Nf(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = If(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = $s(t.workflow, r), m = new Map(r.map((e) => [s.toolOf(e), e])), h = {}, g = [], _ = !1, v = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, y = () => r.find((e) => !e.optional && h[s.fieldOf(e)] === void 0), b = () => {
		let e = y();
		return e ? s.toolOf(e) : "";
	}, x = (e, t, n) => {
		let a = m.get(t.name);
		if (!a) return;
		let o = Fp(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? Ip(t, s, e, a) : hc(e, {
		stages: r,
		structures: i,
		final: a,
		openKey: o,
		fieldOf: s.fieldOf
	});
	return {
		body: () => {
			let r = !t.config.connection.forceTool || n.tools.length ? "auto" : o ? "required" : {
				type: "function",
				function: { name: b() || l }
			};
			return Lf({
				...e,
				messages: f
			}, {
				messages: [...f],
				tools: d,
				tool_choice: r
			});
		},
		progress: (e, t) => {
			v = e;
			let n = { ...h }, r;
			for (let i of e.toolCalls) r = x(n, i, t) ?? r;
			return S(n, t, t ? void 0 : r);
		},
		complete: (e, r) => {
			let i = zp(e.toolCalls.filter((e) => e.name), r), o = zf(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(Rp(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = Ff(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
						next: r,
						first: l,
						name: e.name
					});
					f.push({
						role: "tool",
						tool_call_id: e.id,
						content: i
					});
				}
			}
			if (!y()) return { done: !0 };
			if (!s.length) {
				if (_) return { done: !0 };
				_ = !0, e.text.trim() && f.push({
					role: "assistant",
					content: e.text
				}), f.push({
					role: "user",
					content: Ff(t, a.tools.results.nudge, {
						next: b(),
						first: l
					})
				});
			}
			return { done: !1 };
		},
		result: () => S(h, !0),
		rawText: () => g.join("\n\n") || v.text
	};
}
//#endregion
//#region src/core/transports/index.ts
function Hp(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Bf(e);
		case "structured": return Lp(e);
		case "tool-single": return Bp(e);
		case "tool-multi": return Vp(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Up(e, t) {
	let n = t ? s({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? d(n) : l(n);
}
var Wp = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Gp(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Wp({
				type: "message_start",
				message: {
					id: `msg_ap_${Date.now().toString(36)}`,
					type: "message",
					role: "assistant",
					content: [],
					model: "",
					stop_reason: null,
					stop_sequence: null,
					usage: {
						input_tokens: 0,
						output_tokens: 0
					}
				}
			})), a = () => n === null ? "" : (n = null, Wp({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Wp({
					type: "content_block_start",
					index: t,
					content_block: e === "text" ? {
						type: "text",
						text: ""
					} : {
						type: "thinking",
						thinking: "",
						signature: ""
					}
				});
			};
			return {
				text: (e) => e ? o("text") + Wp({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Wp({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "thinking_delta",
						thinking: e
					}
				}) : "",
				toolCalls: (e) => {
					if (!e.length) return "";
					let n = i() + a();
					for (let i of e) t++, r = !0, n += Wp({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Wp({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Wp({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Wp({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: () => i() + a() + Wp({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: { output_tokens: 0 }
				}) + Wp({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Wp({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Wp({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Wp({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: Kp(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Wp({ error: { message: e } }),
			end: () => ""
		};
		case "cohere": return {
			text: (e) => e ? Wp({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Wp({
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
			error: (e) => Wp({ error: { message: e } }),
			end: () => Wp({ type: "message-end" })
		};
		default: return {
			text: (e) => e ? Wp({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Wp({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Wp({ choices: [{
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
			error: (e) => Wp({ error: { message: e } }),
			end: () => Wp("[DONE]")
		};
	}
}
function Kp(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function qp(e, t) {
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
			input: Kp(e.arguments)
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
					args: Kp(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Jp(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function Yp(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Xp(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Zp = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = Yp(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Xp(t);
			if (r) {
				let t = this.open.has(e) ? Qp(this.value, n) : void 0;
				$p(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Qp(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function $p(e, t, n) {
	let r = e;
	t.forEach((e, i) => {
		if (i === t.length - 1) {
			r[e] = n;
			return;
		}
		let a = t[i + 1], o = r[e];
		(typeof a == "number" ? Array.isArray(o) : o && typeof o == "object" && !Array.isArray(o)) || (r[e] = typeof a == "number" ? [] : {}), r = r[e];
	});
}
//#endregion
//#region src/core/reader.ts
var em = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function tm(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var nm = class {
	calls = [];
	claudeIndex = /* @__PURE__ */ new Map();
	geminiOpen = null;
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
		for (let t of e?.candidates?.[0]?.content?.parts ?? []) t?.functionCall && this.pushGemini(t);
		if (["tool-call-start", "tool-call-delta"].includes(e?.type)) {
			let t = e?.delta?.message?.tool_calls, n = this.at(e.index ?? 0);
			t?.id && !n.id && (n.id = t.id), t?.function?.name && !n.name && (n.name = t.function.name), typeof t?.function?.arguments == "string" && (n.arguments += t.function.arguments);
		}
	}
	pushGemini(e) {
		let t = e.functionCall;
		if (t.name) {
			let e = this.at(this.calls.length);
			e.id = t.id || `call_${Math.random().toString(36).slice(2, 10)}`, e.name = t.name, e.arguments = JSON.stringify(t.args ?? {}), this.geminiOpen = {
				call: e,
				args: new Zp()
			};
		}
		let n = this.geminiOpen;
		n && (e.thoughtSignature && (n.call.signature = e.thoughtSignature), Array.isArray(t.partialArgs) && t.partialArgs.length && (n.args.apply(t.partialArgs), n.call.arguments = JSON.stringify(n.args.value)), t.willContinue || (this.geminiOpen = null));
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
function rm(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function im(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* am(e, t) {
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
async function* om(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = tm(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new em(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new nm();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = tm(t);
		if (n) throw new em(n);
		i.text = rm(t), i.reasoning = im(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = t?.usage ?? t?.usageMetadata, yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of am(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = tm(e);
		if (r) throw new em(r);
		i.text += c(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s), (e?.usage || e?.usageMetadata) && (i.usage = e.usage ?? e.usageMetadata), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var sm = /* @__PURE__ */ nn({ current: null });
function cm(e, t) {
	return sm.current = {
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
	}, sm.current;
}
function lm(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var um = "/api/backends/chat-completions/generate", dm = { pending: null }, fm = (e) => e?.name === "AbortError";
function pm(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? J("error.toolsUnsupported") : null;
}
async function mm(e, t, n) {
	let r = Up(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = pm(e);
	if (a) return f("error", a, "Advanced Preset"), Jp(a, 400);
	let o = e.origin === "task" ? jf(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = cm(e, i);
	if (!i) try {
		let i = await _m(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(qp(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return gm(c, e);
	}
	let l = Gp(r), u = new TextEncoder(), d = new TransformStream(), p = d.writable.getWriter(), m = (e) => e ? p.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), h = "";
	return (async () => {
		try {
			let i = await _m(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(h) && e.length > h.length && (m(l.text(e.slice(h.length))), h = e);
			});
			i.content.startsWith(h) && await m(l.text(i.content.slice(h.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await m(l.reasoning(i.reasoning)), i.toolCalls?.length && await m(l.toolCalls(i.toolCalls)), await m(l.end());
		} catch (e) {
			fm(e) || (await m(l.error(hm(e))), gm(c, e));
		} finally {
			await p.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var hm = (e) => e instanceof Error ? e.message : String(e);
function gm(e, t) {
	return e.status = fm(t) ? "aborted" : "error", e.error = hm(t), t instanceof em ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Jp(hm(t));
}
async function _m(t, n, r, i, a, o) {
	let c = String(n.chat_completion_source ?? ""), l = Hp({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Up(c, n)
	}), u = Qs(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), m = t.origin === "story" && !r.schema && !f && d !== null, h = t.structures.some((e) => e.kind === "annotations") ? (e) => lu(e, { final: !1 }).text : (e) => e, g = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, _ = Date.now(), v = "", y, b = 0, x = !1, S, ee;
	for (let n = 0; n < g; n++) {
		i.step = n;
		let r = l.body(n), c = pf({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		b++;
		let u = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let t = await p(um, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), n = 0;
			for await (let e of om(t, s(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - n < 50) continue;
				n = t;
				let r = l.progress(e, !1);
				if (lm(i, r, v + e.reasoning), m && d) {
					let e = r.stages[d]?.text ?? "";
					e && o(h(e.slice(0, e.length - zs(e))).trimEnd());
				}
			}
			c.response = u.text || JSON.stringify(u.toolCalls), c.durationMs = Date.now() - c.at, c.usage = u.usage;
		} catch (e) {
			if (c.error = hm(e), fm(e) || a?.aborted) {
				x = !0, ee = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = u.usage ?? y, l.progress(u, !0);
		let f = l.complete(u, n);
		if (f.callerToolCalls) {
			S = f.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (f.done) break;
	}
	let te = ee ?? l.result();
	if (x) for (let e of Object.values(te.stages)) e.status === "streaming" && (e.status = "interrupted");
	lm(i, te, v);
	let C = vm(t, te, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: x
	});
	return C.toolCalls = S, S && (C.content = ""), i.status = x ? "aborted" : "done", C;
}
function vm(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = yc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Bs(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = lu(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = lu(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), ee = v("memory"), te = t.meta.mixed ? "meta-mixed" : "story", C = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? C = i === void 0 ? u || Bs(r).trim() : JSON.stringify(i) : u || (te = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", C = b ? qs(b) : "", !C && x && typeof n.structures[x.id] == "string" && (C = "…"), !C && S && n.structures[S.id] && (C = "…"))), !C && !o.interrupted) throw Error(J("error.emptyTurn"));
	let w = [], ne = t.interceptorRan && t.stType !== "quiet";
	if (ne && ee && Array.isArray(n.structures[ee.id]) && w.push(...Ed(Pu(s), n.structures[ee.id])), ne && S && typeof n.structures[S.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		w.push({
			type: "recap.set",
			text: n.structures[S.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let re = t.stages.map((e) => {
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
	}), ie = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: te,
		stages: re,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
		...g?.length ? { annotations: g } : {},
		..._ && (_.draft.length || _.patched.length) ? { annotationVersions: _ } : {},
		patchesApplied: d !== void 0,
		structures: n.structures,
		events: w,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, ae = {
		content: C,
		reasoning: a,
		sidecar: ie
	};
	return ne ? dm.pending = {
		ctx: t,
		outcome: ae,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ie
	}), sm.current?.genId === t.id && (sm.current.structures = n.structures), ae;
}
//#endregion
//#region src/core/fetch-gate.ts
var ym = "__ap_gen_id";
function bm(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function xm() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	m(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(bm(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[ym], r = typeof t == "string" ? Rd.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[ym], r.claimed = !0;
				try {
					return await mm(r, e, n.signal);
				} finally {
					Rd.release(t);
				}
			}
			e && (delete e[ym], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Sm(e) {
	let t = Rd.takeArmed();
	t && (e[ym] = t.id);
}
//#endregion
//#region src/app/receive.ts
var Cm = 6e5, wm = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Tm(t, n) {
	let r = dm.pending;
	if (!r || Date.now() - r.at > Cm || wm.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	dm.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), fd(t, a.sidecar), sm.current?.genId === r.ctx.id && (sm.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var Em = /* @__PURE__ */ new Set();
function Dm(e) {
	for (let t of Em) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Om(t) {
	let n = e().chat[t], r = ud(n)?.annotations;
	return !n || !r?.length ? [] : pu(n.mes, r).annotations;
}
function km(t) {
	let n = e().chat[t], r = ud(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = pu(n.mes, r.annotations);
	return i.changed ? (fd(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function Am() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (km(n) && e().saveChat(), Dm(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Dm(Number(e)));
}
var jm = {
	get: (e) => Om(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return Em.add(t), () => Em.delete(t);
	}
}, Mm = "advancedPreset.reloadedFor";
async function Nm() {
	try {
		let e = await p(`${o()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Pm(e) {
	sessionStorage.setItem(Mm, e), f("info", J("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Fm() {
	let e = await Nm();
	e && e !== "e281ea48d45fec07" && sessionStorage.getItem(Mm) !== e && Pm(e);
}
async function Im() {
	await Fm();
}
async function Lm() {
	let e = a().replace(/^third-party\//, ""), t = await Rm(e, !1);
	if (t.status === 404 && (t = await Rm(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Nm();
	return r && r !== "e281ea48d45fec07" ? (Pm(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var Rm = (t, n) => p("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), zm = /* @__PURE__ */ nn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), Bm = 1500, Vm = null;
async function Hm() {
	let { url: e, enabled: t } = K().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await p(`${n}/`, { cache: "no-store" })).json();
		if (zm.status = "online", zm.error = e.ok === !1 ? "build failed" : "", zm.at = Date.now(), !e.hash || e.hash === zm.hash) return;
		let t = vu(await (await p(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		zm.presetId && zm.presetId !== t.id && Eu(null, zm.presetId), Eu(t), zm.presetId = t.id, zm.hash = t.hash, qu(t), await id(t), ff("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		zm.status = "error", zm.error = e instanceof Error ? e.message : String(e);
	}
}
function Um() {
	if (Vm && clearTimeout(Vm), Vm = null, !K().dev.enabled) {
		zm.presetId && Eu(null, zm.presetId), Object.assign(zm, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	zm.status === "off" && (zm.status = "connecting");
	let e = async () => {
		await Hm(), K().dev.enabled && (Vm = setTimeout(e, Bm));
	};
	e();
}
function Wm() {
	or(() => [K().dev.enabled, K().dev.url], () => {
		zm.hash = "", Um();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var Gm = "#option_impersonate, #mes_impersonate", Km = () => document.querySelector("#send_textarea");
function qm(e, t = !1) {
	let n = Km();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function Jm() {
	if (!K().enabled) return null;
	let t = $u(), n = t ? Cu(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Lu(n), i = Ms(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Xc(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function Ym(e) {
	if (!e.target?.closest?.(Gm)) return;
	let t = Jm();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Km()?.value.trim();
	qm(n ? `${t}\n${n}` : t, !0);
}
function Xm() {
	window.addEventListener("click", Ym, !0);
}
//#endregion
//#region src/app/install.ts
function Zm(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function Qm(e, t) {
	let n = vu(e);
	if (!n) throw Error(J("presets.invalid"));
	if (n.minAdvancedPreset && wc("1.6.0", n.minAdvancedPreset) < 0) throw Error(J("presets.tooNew", { version: n.minAdvancedPreset }));
	wu(n), t && (K().sources[n.id] = t), q();
	let r = Cu(n.id) ?? n;
	return qu(r), await id(r), r;
}
async function $m(e) {
	let t = await p(Zm(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return Qm(await t.json(), e.trim());
}
async function eh(e) {
	return Qm(JSON.parse(await e.text()));
}
async function th(t) {
	if (Tu(t), delete K().sources[t], q(), Du(t)) {
		let e = Cu(t);
		e && (qu(e), await id(e));
		return;
	}
	let n = nd(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/download.ts
function nh(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var rh = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled", X = /* @__PURE__ */ nn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), ih = () => {
	X.chatRev++;
}, ah = () => {
	X.presetId = $u();
}, oh = G(() => X.presetId ? Cu(X.presetId) : void 0), sh = G(() => {
	let e = oh.value;
	if (!e) return { config: "" };
	let t = Pu(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Y(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function ch(t) {
	return X.chatRev, e().chat[t];
}
function lh(e) {
	return ud(ch(e));
}
function uh(e) {
	e && (X.tab = e), X.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var dh = "openai_preset_import_file", fh = "export_oai_preset";
function ph(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var mh = /* @__PURE__ */ new WeakSet();
async function hh(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (ph(n)) {
		e.value = "";
		try {
			let e = await Qm(n);
			await ad(e), ah(), f("success", J("presets.installed"), Mu(e)), uh("presets");
		} catch (e) {
			f("error", e instanceof Error ? e.message : String(e), J("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		mh.add(t), e.dispatchEvent(t);
	}
}
function gh() {
	let e = $u(), t = e ? Cu(e) : void 0;
	return t ? (nh(`${rh(t.id)}.apreset.json`, t), !0) : !1;
}
function _h() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== dh || mh.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), hh(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${fh}`) && gh() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var vh = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-shadow:0 8px 28px #00000073}", yh = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", bh = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}", xh = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;background:var(--ap-panel-bg);color:var(--ap-text);-webkit-backdrop-filter:blur(var(--SmartThemeBlurStrength,10px));flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}", Sh = /* @__PURE__ */ nn({ mode: "light" }), Ch = new CSSStyleSheet();
Ch.replaceSync([
	vh,
	yh,
	bh,
	xh
].join("\n"));
var wh = new CSSStyleSheet(), Th = [Ch, wh], Eh = [
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
function Dh(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of Eh) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function Oh(e) {
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
function kh() {
	let e = Oh(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var Ah = /* @__PURE__ */ new Set();
function jh(e) {
	return Ah.add(e), e.dataset.apTheme = Sh.mode, () => Ah.delete(e);
}
function Mh() {
	let e = kh();
	if (e !== Sh.mode) {
		Sh.mode = e;
		for (let t of Ah) t.dataset.apTheme = e;
	}
}
function Nh() {
	Sh.mode = kh();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(Mh);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), ir(() => {
		let e = oh.value?.theme?.[Sh.mode] ?? {}, t = K().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(Dh(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(Dh("primary", t.primary)), t.accent && n.push(Dh("accent", t.accent)), wh.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function Ph(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function Fh(e, t, n = []) {
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
			e.adoptedStyleSheets = Th, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = jh(this), this.app = fs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var Ih = 6, Lh = 8;
function Rh(e, t, n, r = "center", i = !1) {
	let a = e.top - Ih - t.height >= Lh, o = e.bottom + Ih + t.height <= n.height - Lh, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - Ih - t.height : e.bottom + Ih;
	c = Math.max(Lh, Math.min(c, n.height - Lh - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(Lh, Math.min(l, n.width - Lh - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function zh(e, t) {
	let n = /* @__PURE__ */ M(!1), r = /* @__PURE__ */ M(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Rh(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return or(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Bn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Br(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var Bh = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), Vh = /* @__PURE__ */ new Set([
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
]), Hh = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function Uh(e) {
	return Hh(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function Wh(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${Uh(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${Uh(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${Uh(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function Gh(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = Gh(e, t);
			n && i.appendChild(n);
		}
	};
	if (!Bh.has(r) && !Vh.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = Gh(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function Kh(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return Wh(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", Wh(e.textContent));
			continue;
		}
		let t = Gh(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function qh(e, t, n, r) {
	return e && ju(e)?.workflows?.[t]?.stages?.[n] || r;
}
function Jh(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return Ph(e?.actors[t]?.color, n);
}
function Yh(e) {
	return G(() => {
		let t = e(), n = lh(t), r = sm.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Cu(r.presetId);
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
					label: qh(e, r.workflow, t.id, t.label),
					color: Jh(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Cu(n.presetId);
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
				label: qh(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: Jh(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var Z = /* @__PURE__ */ nn({
	open: !1,
	pinned: !1,
	rev: 0,
	key: null,
	author: "",
	color: "",
	html: "",
	rect: {
		left: 0,
		top: 0,
		width: 0,
		height: 0
	}
}), Xh, Zh, Qh = null;
function $h(t) {
	let n = Cu(ud(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Xc(n, Lu(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: Jh(n, n.narrator)
	};
}
function eg(e, t) {
	clearTimeout(Xh), clearTimeout(Zh), Zh = void 0, Qh = null, Z.key !== e.key && Object.assign(Z, $h(e.mesId), { html: Kh(e.ann.comment) }), Object.assign(Z, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), Z.rev++;
}
function tg() {
	clearTimeout(Xh), clearTimeout(Zh), Zh = void 0, Qh = null, Z.open && (Z.open = !1, Z.pinned = !1, Z.key = null);
}
function ng(e) {
	if (!Z.pinned) {
		if (e) {
			if (Z.open && Z.key === e.key) {
				clearTimeout(Zh), Zh = void 0;
				return;
			}
			if (Qh === e.key) return;
			clearTimeout(Xh), Qh = e.key, Xh = setTimeout(() => eg(e, !1), 150);
		} else clearTimeout(Xh), Qh = null, ag();
	}
}
function rg(e) {
	e && !(Z.open && Z.key === e.key) ? eg(e, !0) : tg();
}
function ig() {
	clearTimeout(Zh), Zh = void 0;
}
function ag() {
	!Z.open || Z.pinned || Zh || (Zh = setTimeout(tg, 200));
}
function og(e) {
	Z.key && e.has(Z.key) && tg(), Qh && e.has(Qh) && (clearTimeout(Xh), Qh = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var sg = {
	key: 0,
	class: "anno-author"
}, cg = ["innerHTML"], lg = /* @__PURE__ */ I({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ M(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = Z.rect, a = Rh(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return or(() => Z.open && Z.rev, async (e) => {
			if (!e) return;
			await Bn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Br(() => {
			Z.open = !1;
		}), (e, n) => N(Z).open ? (z(), B("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Oe({ "--actor": N(Z).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => N(ig) && N(ig)(...e),
			onMouseleave: n[1] ||= (...e) => N(ag) && N(ag)(...e)
		}, [N(Z).author ? (z(), B("div", sg, k(N(Z).author), 1)) : W("", !0), H("div", {
			class: "rich anno-text",
			innerHTML: N(Z).html
		}, null, 8, cg)], 36)) : W("", !0);
	}
}), ug = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, dg = /\s/, fg = /[“”„‟〝〞＂「」]/, pg = /[‘’‚‛『』＇]/;
function mg(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!ug.test(i)) {
			if (dg.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else fg.test(i) ? i = "\"" : pg.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var hg = (e) => mg(e).text;
function gg(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function _g(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function vg(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function yg(e, t, n, r = mg(e)) {
	let i = hg(n.quote).trim();
	if (!i) return null;
	let a = gg(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = hg(n.prefix), s = hg(n.suffix), c = 0, l = a.map((t) => {
			let n = _g(e, r.text.slice(Math.max(0, t - e.length), t)) + vg(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = gg(hg(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function bg(e, t, n = !1) {
	let r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i].length;
		if (t < r + a || n && t === r + a) return [i, t - r];
		r += a;
	}
	return [e.length - 1, e[e.length - 1]?.length ?? 0];
}
//#endregion
//#region src/ui/annotations/surface.ts
var xg = /* @__PURE__ */ new Set([
	"SCRIPT",
	"STYLE",
	"TEMPLATE",
	"TEXTAREA",
	"NOSCRIPT",
	"IFRAME",
	"OBJECT",
	"AP-STAGES",
	"AP-CARDS",
	"AP-ANNO-BUBBLE"
]);
function Sg(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (xg.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = Sg(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function Cg(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? xg.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && Sg(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function wg(e, t, n) {
	let r = Cg(e), i = r.map((e) => e.data), a = i.join(""), o = mg(a), s = [];
	for (let e of n) {
		let n = yg(a, t, e, o);
		n && s.push({
			ann: e,
			start: bg(i, n[0]),
			end: bg(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function Tg(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var Eg = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function Dg(e, t) {
	let n = [...e.located].sort((e, t) => Eg(e.start, t.start) ? 1 : Eg(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && Eg(r, i.end))) {
		r = i.start;
		for (let n = i.end[0]; n >= i.start[0]; n--) {
			let r = e.nodes[n], a = n === i.start[0] ? i.start[1] : 0, o = n === i.end[0] ? i.end[1] : r.length;
			if (a >= o || !r.parentNode || r.parentElement?.namespaceURI !== "http://www.w3.org/1999/xhtml") continue;
			o < r.length && r.splitText(o);
			let s = a > 0 ? r.splitText(a) : r, c = r.ownerDocument.createElement("ap-anno");
			s.parentNode.insertBefore(c, s), c.append(s), t(c, i);
		}
	}
}
function Og(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var kg = "ap-anno", Ag = "ap-anno-style", jg = /* @__PURE__ */ new Map(), Mg = 0, Ng = "#a855f7", Pg = () => null;
function Fg(e) {
	Pg = e;
}
function Ig() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${Ng}; }
::highlight(${kg}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function Lg(e) {
	let t = e.getElementById(Ag);
	t || (t = e.createElement("style"), t.id = Ag, (e.head ?? e.documentElement).append(t)), t.textContent !== Ig() && (t.textContent = Ig());
}
function Rg(e) {
	if (e !== Ng) {
		Ng = e;
		for (let e of Gg()) Lg(e.doc);
	}
}
function zg(e, t) {
	let n = e.left, r = e.top, i = t.defaultView;
	for (; i && i !== window;) {
		let e = i.frameElement;
		if (!e) break;
		let t = e.getBoundingClientRect();
		n += t.left + e.clientLeft, r += t.top + e.clientTop, i = e.ownerDocument.defaultView;
	}
	return {
		left: n,
		top: r,
		width: e.width,
		height: e.height
	};
}
var Bg = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function Vg(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => Bg(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: zg(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (Bg(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: zg(n, e.doc)
			};
		}
	}
	return null;
}
function Hg(e) {
	let t = Pg();
	return !!(t && e.composedPath().includes(t));
}
function Ug(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !Hg(r) && ng(Vg(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (Hg(t)) return;
		let n = Vg(e, t);
		i === "mouse" ? n || tg() : rg(n);
	}, c = (e) => {
		Hg(e) || tg();
	}, l = () => ng(null);
	return t.addEventListener("pointermove", a, { passive: !0 }), t.addEventListener("pointerdown", o, {
		passive: !0,
		capture: !0
	}), t.addEventListener("click", s, !0), t.addEventListener("scroll", c, {
		passive: !0,
		capture: !0
	}), t.documentElement.addEventListener("mouseleave", l), () => {
		cancelAnimationFrame(n), t.removeEventListener("pointermove", a), t.removeEventListener("pointerdown", o, !0), t.removeEventListener("click", s, !0), t.removeEventListener("scroll", c, !0), t.documentElement?.removeEventListener("mouseleave", l);
	};
}
function Wg(e) {
	let t = jg.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(kg) ?? new i(), r.set(kg, a)), Lg(e), t = {
		doc: e,
		serial: ++Mg,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = Ug(t), jg.set(e, t), t;
}
function Gg() {
	for (let [e, t] of jg) e.defaultView || (t.detach(), jg.delete(e));
	return [...jg.values()];
}
function Kg(e) {
	Wg(e);
}
function qg(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function Jg(e, t, n, r, i) {
	let a = Yg(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = Wg(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = Tg(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			Dg(r, (t, r) => {
				let i = e.get(r);
				i || (i = {
					key: s(r.ann),
					mesId: n,
					ann: r.ann,
					wraps: []
				}, e.set(r, i), c.push(i)), i.wraps.push(t), o.byWrap.set(t, i);
			});
		}
		c.length && o.owners.set(e, c);
		for (let e of c) a.delete(e.key);
	}
	a.size && og(a);
}
function Yg(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [jg.get(t)].filter((e) => !!e) : Gg()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && Og(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), jg.delete(i.doc));
		}
	}
	return r;
}
function Xg(e, t) {
	let n = Yg(e, t);
	n.size && og(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var Zg = /* @__PURE__ */ new Set();
function Qg(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var $g = () => K().ui.annotations?.show !== !1, e_ = class {
	el;
	fallbackId;
	observer;
	frames = /* @__PURE__ */ new Map();
	timer;
	disposed = !1;
	constructor(e, t) {
		this.el = e, this.fallbackId = t, this.observer = new MutationObserver(() => this.schedule()), this.observer.observe(e, {
			childList: !0,
			subtree: !0,
			characterData: !0
		}), Zg.add(this), this.schedule(0);
	}
	get mesId() {
		let e = this.el.closest(".mes")?.getAttribute("mesid"), t = e == null ? NaN : Number(e);
		return Number.isNaN(t) ? this.fallbackId ?? NaN : t;
	}
	get hasFrames() {
		return this.frames.size > 0;
	}
	schedule(e = 60) {
		this.disposed || (clearTimeout(this.timer), this.timer = setTimeout(() => this.refresh(), e));
	}
	syncFrames() {
		let e = new Set(this.el.querySelectorAll("iframe"));
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && Xg(this, n.doc), this.frames.delete(t));
		for (let t of e) {
			let e = this.frames.get(t);
			e || (e = {
				doc: null,
				observer: null,
				onLoad: () => this.schedule(0)
			}, t.addEventListener("load", e.onLoad), this.frames.set(t, e));
			let n = null;
			try {
				n = t.contentDocument;
			} catch {}
			n !== e.doc && (e.observer?.disconnect(), e.doc && Xg(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
				childList: !0,
				subtree: !0,
				characterData: !0,
				attributes: !0,
				attributeFilter: [
					"class",
					"hidden",
					"data-ap-annotations"
				]
			})));
		}
	}
	refresh() {
		if (this.disposed) return;
		if (!this.el.isConnected) {
			Xg(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = sm.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && $g() ? Om(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		Jg(this, document, t, a.length ? wg(this.el, o, a) : null, !qg(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (Jg(this, n, t, a.length && !Qg(n) ? wg(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), Xg(this), Zg.delete(this);
		}
	}
};
function t_(e, t) {
	for (let n of Zg) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function n_() {
	for (let e of Zg) e.hasFrames && e.schedule(0);
}
function r_() {
	for (let e of Zg) e.el.isConnected || e.dispose();
}
var i_ = /* @__PURE__ */ new WeakMap();
function a_(e) {
	let t = i_.get(e);
	(!t || t.disposed) && i_.set(e, new e_(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var o_ = () => window.__TAURITAVERN__?.api?.chatSurface, s_ = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return o_()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), c_ = !1;
function l_() {
	let t = o_();
	!c_ && t && s_() && (t.protocolVersion === 1 ? (c_ = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new e_(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function u_(e, t) {
	t && !s_() && a_(e);
}
var d_ = null;
function f_() {
	return (!d_ || !d_.isConnected) && (d_ = document.createElement("ap-anno-bubble"), document.body.append(d_)), d_;
}
function p_() {
	Fh("ap-anno-bubble", lg), f_(), Fg(() => d_), Kg(document), ir(() => {
		let e = K().ui, t = oh.value?.theme?.[Sh.mode]?.accent;
		Rg(e.annotations?.color || e.accent || t || (Sh.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), or($g, () => {
		tg(), t_(void 0, 0);
	}), or(() => sm.current?.status, () => t_()), jm.on("change", (e) => t_(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		tg(), r_();
	});
	t.on("message_iframe_render_ended", () => n_()), addEventListener("resize", () => tg());
}
//#endregion
//#region src/ui/mounts.ts
var m_ = "ap-hidden", h_ = [
	"meta-pure",
	"impersonate",
	"summary"
];
function g_(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function __(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = ud(a), s = sm.current?.mesId === n;
	a && !a.is_user && u_(i, !!(o?.annotations?.length || s));
	let c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = g_("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = g_("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(m_, !!(!s && o && h_.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(m_));
}
function v_(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) __(t);
}
function y_() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var b_ = 0, x_ = /* @__PURE__ */ new Set(), S_ = !1;
function C_(e) {
	e ? x_.add(e) : S_ = !0, !b_ && (b_ = requestAnimationFrame(() => {
		if (b_ = 0, S_) v_();
		else for (let e of x_) e.isConnected && __(e);
		x_.clear(), S_ = !1, y_(), r_();
	}));
}
function w_() {
	ih(), C_();
}
function T_() {
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
	]) e && t.on(e, w_);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && C_(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && C_(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), C_();
	};
	r();
	let i;
	or(() => sm.current && sm.current.status === "running" && sm.current.streaming && sm.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = sm.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), w_());
		}, 100));
	}), or(() => sm.current?.status, () => C_());
}
//#endregion
//#region src/ui/entry.ts
var E_ = "left-nav-panel", D_ = "ap-preset-banner";
function O_() {
	return document.getElementById(E_);
}
function k_() {
	let e = O_();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function A_() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== D_ && e.after(document.createElement(D_));
}
var j_ = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function M_() {
	or(() => X.presetId, (e) => {
		for (let t of document.querySelectorAll(j_.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function N_() {
	let e = O_();
	if (!e) {
		document.querySelector("ap-panel") || document.body.append(document.createElement("ap-panel"));
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function P_() {
	A_(), M_(), N_(), or(() => X.panelOpen, (e) => {
		e && k_();
	});
	let e = O_();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (X.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var F_ = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, I_ = (e) => e === "", L_ = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), R_ = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), z_ = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), B_ = (e) => {
	let t = z_(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, V_ = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, H_ = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = V_.width, color: s = V_.stroke, ...c }, { slots: l }) => La("svg", {
	...V_,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": I_(n) || I_(r) || n === !0 || r === !0 ? Number(i || a || V_["stroke-width"]) * 24 / Number(o) : i || a || V_["stroke-width"],
	class: L_("lucide", c.class, ...e ? [`lucide-${R_(B_(e))}-icon`, `lucide-${R_(e)}`] : ["lucide-icon"]),
	...!l.default && !F_(c) && { "aria-hidden": "true" }
}, [...t.map((e) => La(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => La(H_, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), U_ = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), W_ = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), G_ = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), K_ = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), q_ = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), J_ = Q("brain", [
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
]), Y_ = Q("bug", [
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
]), X_ = Q("cable", [
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
]), Z_ = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Q_ = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), $_ = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), ev = Q("circle-dashed", [
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
]), tv = Q("circle-question-mark", [
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
]), nv = Q("circle-slash", [["circle", {
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
}]]), rv = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), iv = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), av = Q("coins", [
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
]), ov = Q("copy-plus", [
	["line", {
		x1: "15",
		x2: "15",
		y1: "12",
		y2: "18",
		key: "1p7wdc"
	}],
	["line", {
		x1: "12",
		x2: "18",
		y1: "15",
		y2: "15",
		key: "1nscbv"
	}],
	["rect", {
		width: "14",
		height: "14",
		x: "8",
		y: "8",
		rx: "2",
		ry: "2",
		key: "17jyea"
	}],
	["path", {
		d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
		key: "zix9uf"
	}]
]), sv = Q("copy", [["rect", {
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
}]]), cv = Q("download", [
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
]), lv = Q("drama", [
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
]), uv = Q("feather", [
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
]), dv = Q("file-stack", [
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
]), fv = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), pv = Q("git-compare-arrows", [
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
]), mv = Q("globe", [
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
]), hv = Q("grip-vertical", [
	["circle", {
		cx: "9",
		cy: "12",
		r: "1",
		key: "1vctgf"
	}],
	["circle", {
		cx: "9",
		cy: "5",
		r: "1",
		key: "hp0tcf"
	}],
	["circle", {
		cx: "9",
		cy: "19",
		r: "1",
		key: "fkjjf6"
	}],
	["circle", {
		cx: "15",
		cy: "12",
		r: "1",
		key: "1tmaij"
	}],
	["circle", {
		cx: "15",
		cy: "5",
		r: "1",
		key: "19l28e"
	}],
	["circle", {
		cx: "15",
		cy: "19",
		r: "1",
		key: "f4zoj3"
	}]
]), gv = Q("info", [
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
]), _v = Q("layers", [
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
]), vv = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), yv = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), bv = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), xv = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Sv = Q("message-square-dashed", [
	["path", {
		d: "M14 3h2",
		key: "1d12a5"
	}],
	["path", {
		d: "M16 19h-2",
		key: "1agirb"
	}],
	["path", {
		d: "M2 12v-2",
		key: "1ey295"
	}],
	["path", {
		d: "M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149",
		key: "120k8q"
	}],
	["path", {
		d: "M20 19a2 2 0 0 0 2-2v-1",
		key: "ior8tn"
	}],
	["path", {
		d: "M22 10v2",
		key: "rmlecy"
	}],
	["path", {
		d: "M22 6V5a2 2 0 0 0-2-2",
		key: "sp3k6r"
	}],
	["path", {
		d: "M4 3a2 2 0 0 0-2 2v1",
		key: "11zt7s"
	}],
	["path", {
		d: "M8 19h2",
		key: "jnunrx"
	}],
	["path", {
		d: "M8 3h2",
		key: "ysbsee"
	}]
]), Cv = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), wv = Q("notebook-pen", [
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
]), Tv = Q("package", [
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
]), Ev = Q("palette", [
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
]), Dv = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), Ov = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), kv = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Av = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), jv = Q("refresh-cw", [
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
]), Mv = Q("regex", [
	["path", {
		d: "M17 3v10",
		key: "15fgeh"
	}],
	["path", {
		d: "m12.67 5.5 8.66 5",
		key: "1gpheq"
	}],
	["path", {
		d: "m12.67 10.5 8.66-5",
		key: "1dkfa6"
	}],
	["path", {
		d: "M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z",
		key: "swwfx4"
	}]
]), Nv = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), Pv = Q("save", [
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
]), Fv = Q("scroll-text", [
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
]), Iv = Q("server", [
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
]), Lv = Q("shapes", [
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
]), Rv = Q("sliders-horizontal", [
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
]), zv = Q("sliders-vertical", [
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
]), Bv = Q("text-cursor-input", [
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
]), Vv = Q("trash-2", [
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
]), Hv = Q("triangle-alert", [
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
]), Uv = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), Wv = Q("upload", [
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
]), Gv = Q("user-pen", [
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
]), Kv = Q("workflow", [
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
]), qv = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Jv = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), Yv = /* @__PURE__ */ I({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null), { open: r, bubble: i } = zh(n, () => t);
		return (t, a) => (z(), B("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [qr(t.$slots, "default"), N(r) && e.text ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : W("", !0)], 544));
	}
}), Xv = ["disabled", "aria-label"], $ = /* @__PURE__ */ I({
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
		return (t, n) => (z(), V(Yv, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: P(() => [H("button", {
				type: "button",
				class: O(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(z(), V(Ur(e.icon)))], 10, Xv)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), Zv = {
	key: 0,
	class: "patches"
}, Qv = { class: "patch-old pre" }, $v = { class: "patch-new pre" }, ey = {
	key: 0,
	class: "patch-status xs"
}, ty = {
	key: 2,
	class: "faint small stage-empty"
}, ny = /* @__PURE__ */ I({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null);
		or(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Bn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (z(), B("div", {
			class: "stage-body",
			style: Oe({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (z(), B("div", Zv, [(z(!0), B(R, null, L(e.stage.patches, (e, t) => (z(), B("div", {
			key: t,
			class: O(["patch", { failed: r(e.status) }])
		}, [
			H("div", Qv, k(e.old_string), 1),
			U(N(U_), { class: "patch-arrow" }),
			H("div", $v, k(e.new_string), 1),
			r(e.status) ? (z(), B("div", ey, [U(N(G_)), ua(k(N(J)(`patch.${e.status}`)), 1)])) : W("", !0)
		], 2))), 128))])) : e.stage.text ? (z(), B("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, k(e.stage.text), 513)) : (z(), B("div", ty, k(N(J)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function ry(t) {
	let n = e().chat[t], r = ud(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), fd(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), ih();
}
async function iy(t, n, r) {
	let i = e().chat[t], a = ud(i);
	return !i || !a ? !1 : (fd(t, dd(a, n, r)), ih(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var ay = { class: "stage-bar" }, oy = ["onClick"], sy = { class: "ellipsis" }, cy = {
	key: 0,
	class: "chip stage-chip error"
}, ly = { class: "ellipsis" }, uy = { class: "badge warn" }, dy = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, fy = /* @__PURE__ */ I({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Yh(() => t.mesid), r = /* @__PURE__ */ M(null), i = /* @__PURE__ */ M(!1), a = G(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = G(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = G(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = G(() => o.value.find((e) => e.id === s.value) ?? null);
		or(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = K().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: wv,
			content: uv,
			patch: pv
		}, d = (e) => e.status === "streaming" ? yv : e.status === "interrupted" ? nv : e.status === "missing" ? ev : u[e.kind], f = G(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = G(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = G(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${J(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(J("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => N(n) && (o.value.length || N(n).error) ? (z(), B("div", {
			key: 0,
			class: O(["stages", { live: N(n).running }])
		}, [H("div", ay, [
			(z(!0), B(R, null, L(o.value, (e) => (z(), B("button", {
				key: e.id,
				type: "button",
				class: O(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Oe({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(z(), V(Ur(d(e)), { class: O({ spin: e.status === "streaming" }) }, null, 8, ["class"])), H("span", sy, k(e.label), 1)], 14, oy))), 128)),
			N(n).error ? (z(), B("span", cy, [U(N(Hv)), H("span", ly, k(N(n).error), 1)])) : W("", !0),
			r[1] ||= H("span", { class: "grow" }, null, -1),
			f.value.length ? (z(), V(Yv, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: P(() => [H("span", uy, [U(N(Hv)), ua(k(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : W("", !0),
			p.value ? (z(), V($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? N(Uv) : N(Av),
				label: p.value.patchesApplied ? N(J)("stages.revertDraft") : N(J)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => N(ry)(e.mesid)
			}, null, 8, ["icon", "label"])) : W("", !0),
			N(n).running ? W("", !0) : (z(), V(Yv, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: P(() => [H("span", dy, [U(N(gv))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (z(), V(ny, {
			key: c.value.id,
			stage: c.value,
			follow: N(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : W("", !0)], 2)) : W("", !0);
	}
}), py = { class: "reply-name xs" }, my = ["innerHTML"], hy = /* @__PURE__ */ I({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = G(() => Kh(t.text));
		return (t, r) => (z(), B("div", {
			class: "reply-card",
			style: Oe({ "--actor": e.color })
		}, [H("div", py, k(e.name), 1), H("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, my)], 4));
	}
}), gy = { class: "card mini-card" }, _y = { class: "card-head" }, vy = { class: "card-title" }, yy = { class: "card-body pre" }, by = /* @__PURE__ */ I({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (z(), B("div", gy, [H("header", _y, [
			U(N(Gv), { class: "section-icon" }),
			H("span", vy, k(N(J)("cards.impersonate")), 1),
			H("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => N(qm)(e.text)
			}, [U(N(Bv)), ua(k(N(J)("cards.fillInput")), 1)])
		]), H("div", yy, k(e.text), 1)]));
	}
}), xy = ["aria-label"], Sy = ["title", "onClick"], Cy = { class: "option-label" }, wy = { class: "option-content small muted" }, Ty = /* @__PURE__ */ I({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => qm(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (z(), B("div", {
			class: "options-grid",
			role: "list",
			"aria-label": N(J)("cards.options")
		}, [(z(!0), B(R, null, L(e.options, (e, n) => (z(), B("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: N(J)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [H("span", Cy, k(e.label), 1), H("span", wy, k(e.content), 1)], 8, Sy))), 128))], 8, xy));
	}
}), Ey = {
	key: 0,
	class: "memory-ops"
}, Dy = { class: "ellipsis" }, Oy = ["aria-label", "onClick"], ky = /* @__PURE__ */ I({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = G(() => {
			let e = Pu(t.preset), n = e.globalMemory.log;
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
			e.index !== void 0 && Td(Pu(t.preset), e.index);
		}
		return (e, t) => n.value.length ? (z(), B("div", Ey, [(z(!0), B(R, null, L(n.value, (e, t) => (z(), V(Yv, {
			key: t,
			text: e.op === "delete" ? N(J)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: P(() => [H("span", { class: O(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(z(), V(Ur(e.scope === "global" ? N(mv) : N(xv)), { class: "faint" })),
				H("span", Dy, k(e.key), 1),
				(z(), V(Ur(e.op === "delete" ? N(Vv) : N(Ov)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": N(J)("common.undo"),
					onClick: (t) => r(e)
				}, [U(N(Uv))], 8, Oy)) : W("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : W("", !0);
	}
}), Ay = ["aria-label"], jy = /* @__PURE__ */ I({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ M(null), { open: r, bubble: i } = zh(n, () => t);
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
			onClick: a[0] ||= os((e) => r.value = !N(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [U(N(tv))], 40, Ay), N(r) ? (z(), B("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, k(e.text), 513)) : W("", !0)], 544)) : W("", !0);
	}
}), My = { class: "card-title" }, Ny = {
	key: 0,
	class: "card-body"
}, Py = /* @__PURE__ */ I({
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
		let t = /* @__PURE__ */ M(e.open ?? !0);
		return (n, r) => (z(), B("section", { class: O(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [H("header", {
			class: O(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (z(), V(Ur(e.icon), {
				key: 0,
				class: "section-icon"
			})) : W("", !0),
			H("span", My, k(e.title), 1),
			U(jy, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			H("span", {
				class: "row",
				onClick: r[0] ||= os(() => {}, ["stop"])
			}, [qr(n.$slots, "actions")]),
			e.collapsible ? (z(), V(N(Q_), {
				key: 1,
				class: O(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : W("", !0)
		], 2), !e.collapsible || t.value ? (z(), B("div", Ny, [qr(n.$slots, "default")])) : W("", !0)], 2));
	}
}), Fy = {
	key: 0,
	class: "badge neutral"
}, Iy = { class: "pre small" }, Ly = /* @__PURE__ */ I({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (z(), V(Py, {
			title: N(J)("cards.recap"),
			icon: N(Fv),
			collapsible: "",
			open: !1
		}, {
			actions: P(() => [e.coversUpTo === void 0 ? W("", !0) : (z(), B("span", Fy, "#0–" + k(e.coversUpTo), 1))]),
			default: P(() => [H("div", Iy, k(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Ry = { class: "synopsis-fields" }, zy = { class: "synopsis-field" }, By = ["placeholder", "aria-label"], Vy = { class: "synopsis-field" }, Hy = ["placeholder", "aria-label"], Uy = ["placeholder", "aria-label"], Wy = ["placeholder", "aria-label"], Gy = { class: "synopsis-actions" }, Ky = { class: "xs faint grow synopsis-keys" }, qy = {
	type: "submit",
	class: "btn primary sm-btn"
}, Jy = { class: "synopsis-head" }, Yy = { class: "synopsis-line small" }, Xy = {
	key: 0,
	class: "row tight"
}, Zy = {
	key: 1,
	class: "row tight"
}, Qy = { class: "synopsis-event ellipsis" }, $y = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, eb = /* @__PURE__ */ I({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ M(!1), a = /* @__PURE__ */ M(!1), o = /* @__PURE__ */ nn({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ M(), c = /* @__PURE__ */ M(), l = [
			"time",
			"location",
			"event",
			"summary"
		], u = () => ({
			time: o.time.trim(),
			location: o.location.trim(),
			event: o.event.trim(),
			summary: o.summary.trim()
		}), d = G(() => l.some((e) => u()[e] !== (n.synopsis[e] ?? "")));
		function f() {
			let e = c.value;
			e && (e.style.height = "auto", e.style.height = `${e.scrollHeight + 2}px`);
		}
		async function p() {
			for (let e of l) o[e] = n.synopsis[e] ?? "";
			a.value = !0, await Bn(), f(), s.value?.focus();
		}
		function m() {
			a.value = !1;
		}
		function h() {
			d.value && r("save", u()), a.value = !1;
		}
		function g(e) {
			e.stopPropagation(), !e.isComposing && (e.key === "Escape" ? (e.preventDefault(), m()) : e.key === "Enter" && (e.ctrlKey || e.metaKey || e.target.tagName === "INPUT") && (e.preventDefault(), h()));
		}
		return (t, n) => a.value ? (z(), B("form", {
			key: 0,
			class: "synopsis-editor",
			onSubmit: os(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= os(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= os(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= os(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= os(() => {}, ["stop"])
		}, [
			H("div", Ry, [H("label", zy, [U(N(rv), { class: "faint" }), F(H("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: N(J)("cards.synopsis.time"),
				"aria-label": N(J)("cards.synopsis.time")
			}, null, 8, By), [[Xo, o.time]])]), H("label", Vy, [U(N(bv), { class: "faint" }), F(H("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: N(J)("cards.synopsis.location"),
				"aria-label": N(J)("cards.synopsis.location")
			}, null, 8, Hy), [[Xo, o.location]])])]),
			F(H("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: N(J)("cards.synopsis.event"),
				"aria-label": N(J)("cards.synopsis.event")
			}, null, 8, Uy), [[Xo, o.event]]),
			F(H("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: N(J)("cards.synopsis.summary"),
				"aria-label": N(J)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, Wy), [[Xo, o.summary]]),
			H("div", Gy, [
				H("span", Ky, k(N(J)("cards.synopsis.keys")), 1),
				H("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, k(N(J)("common.cancel")), 1),
				H("button", qy, [U(N(Z_)), ua(k(N(J)("common.save")), 1)])
			])
		], 32)) : (z(), B("div", {
			key: 1,
			class: O(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [H("div", Jy, [H("div", Yy, [
			e.synopsis.time ? (z(), B("span", Xy, [U(N(rv), { class: "faint" }), ua(k(e.synopsis.time), 1)])) : W("", !0),
			e.synopsis.location ? (z(), B("span", Zy, [U(N(bv), { class: "faint" }), ua(k(e.synopsis.location), 1)])) : W("", !0),
			H("span", Qy, k(e.synopsis.event), 1)
		]), e.editable ? (z(), B("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= os(() => {}, ["stop"])
		}, [U($, {
			icon: N(Ov),
			label: N(J)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : W("", !0)]), i.value && e.synopsis.summary ? (z(), B("div", $y, k(e.synopsis.summary), 1)) : W("", !0)], 2));
	}
}), tb = ["innerHTML"], nb = {
	key: 1,
	class: "kv-list small"
}, rb = { class: "pre" }, ib = /* @__PURE__ */ I({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = G(() => typeof t.value == "string" ? Kh(t.value) : "");
		return (t, r) => (z(), V(Py, {
			title: e.title,
			icon: N(Lv),
			collapsible: "",
			open: !1
		}, {
			default: P(() => [typeof e.value == "string" ? (z(), B("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, tb)) : (z(), B("dl", nb, [(z(!0), B(R, null, L(e.value, (e, t) => (z(), B(R, { key: t }, [H("dt", null, k(t), 1), H("dd", rb, k(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), ab = {
	key: 0,
	class: "cards"
}, ob = /* @__PURE__ */ I({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Yh(() => t.mesid), r = G(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = i.find((e) => e.kind === "synopsis")?.id, s = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Xc(r, Lu(r), r.narrator),
				color: Jh(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: s?.type === "recap.set" ? s : null,
				synopsisId: o,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: Y(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (t, n) => r.value ? (z(), B("div", ab, [
			r.value.reply ? (z(), V(hy, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : W("", !0),
			r.value.impersonate ? (z(), V(by, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : W("", !0),
			r.value.options.length ? (z(), V(Ty, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : W("", !0),
			r.value.synopsis ? (z(), V(eb, {
				key: 3,
				synopsis: r.value.synopsis,
				editable: "",
				onSave: n[0] ||= (t) => r.value?.synopsisId && N(iy)(e.mesid, r.value.synopsisId, t)
			}, null, 8, ["synopsis"])) : W("", !0),
			r.value.memory.length ? (z(), V(ky, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : W("", !0),
			r.value.recap ? (z(), V(Ly, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : W("", !0),
			(z(!0), B(R, null, L(r.value.custom, (e) => (z(), V(ib, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : W("", !0);
	}
}), sb = {
	key: 0,
	class: "dock stages live"
}, cb = { class: "stage-bar" }, lb = { class: "ellipsis" }, ub = {
	key: 0,
	class: "small muted"
}, db = /* @__PURE__ */ I({
	__name: "Dock",
	setup(e) {
		let t = G(() => sm.current && !sm.current.streaming && sm.current.status === "running" ? sm.current : null), n = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = Cu(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: qh(n, e.workflow, t.id, t.label),
				color: Jh(n, t.actor)
			}));
		}), r = G(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (z(), B("div", sb, [H("div", cb, [
			U(N(yv), { class: "spin faint" }),
			(z(!0), B(R, null, L(n.value, (e) => (z(), B("span", {
				key: e.id,
				class: O(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Oe({ "--actor": e.color })
			}, [H("span", lb, k(e.label), 1)], 6))), 128)),
			n.value.length ? W("", !0) : (z(), B("span", ub, k(N(J)("stages.waiting")), 1))
		]), r.value ? (z(), V(ny, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : W("", !0)])) : W("", !0);
	}
}), fb = ["aria-label"], pb = ["disabled"], mb = /* @__PURE__ */ I({
	__name: "Switch",
	props: /*@__PURE__*/ ei({
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
		let t = ai(e, "modelValue");
		return (n, r) => (z(), B("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			F(H("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, pb), [[Zo, t.value]]),
			r[1] ||= H("span", { class: "track" }, null, -1),
			r[2] ||= H("span", { class: "thumb" }, null, -1)
		], 8, fb));
	}
}), hb = { class: "field-label" }, gb = { class: "ellipsis" }, _b = {
	key: 0,
	class: "dot modified"
}, vb = { class: "field-control" }, yb = /* @__PURE__ */ I({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (z(), B("div", { class: O(["field", { inline: e.inline }]) }, [H("div", hb, [
			H("span", gb, k(e.label), 1),
			e.modified ? (z(), B("span", _b)) : W("", !0),
			U(jy, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), H("div", vb, [qr(t.$slots, "default")])], 2));
	}
}), bb = { class: "swatches" }, xb = ["title"], Sb = ["title"], Cb = { class: "swatches" }, wb = ["title"], Tb = /* @__PURE__ */ I({
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
		}, s = () => t.annotations ??= { show: !0 }, c = G({
			get: () => t.annotations?.show !== !1,
			set: (e) => {
				s().show = e, q();
			}
		}), l = G({
			get: () => t.annotations?.color ?? "",
			set: (e) => {
				s().color = e || void 0, q();
			}
		});
		return (e, t) => (z(), V(Py, {
			title: N(J)("appearance.title"),
			icon: N(Ev),
			collapsible: "",
			open: !1
		}, {
			default: P(() => [
				U(yb, {
					label: N(J)("appearance.colors"),
					help: N(J)("appearance.colors.hint"),
					inline: ""
				}, {
					default: P(() => [H("div", bb, [
						H("label", {
							class: "swatch",
							style: Oe({ background: N(r) || "var(--ap-primary-500)" }),
							title: N(J)("appearance.primary")
						}, [F(H("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ mn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							Xo,
							N(r),
							void 0,
							{ lazy: !0 }
						]])], 12, xb),
						H("label", {
							class: "swatch",
							style: Oe({ background: N(i) || "var(--ap-accent-500)" }),
							title: N(J)("appearance.accent")
						}, [F(H("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ mn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							Xo,
							N(i),
							void 0,
							{ lazy: !0 }
						]])], 12, Sb),
						U($, {
							icon: N(Nv),
							label: N(J)("common.reset"),
							small: "",
							align: "end",
							disabled: !N(r) && !N(i),
							onClick: o
						}, null, 8, [
							"icon",
							"label",
							"disabled"
						])
					])]),
					_: 1
				}, 8, ["label", "help"]),
				U(yb, {
					label: N(J)("appearance.collapseStages"),
					inline: ""
				}, {
					default: P(() => [U(mb, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				U(yb, {
					label: N(J)("appearance.annotations"),
					help: N(J)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: P(() => [U(mb, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (z(), V(yb, {
					key: 0,
					label: N(J)("appearance.annotationColor"),
					inline: ""
				}, {
					default: P(() => [H("div", Cb, [H("label", {
						class: "swatch",
						style: Oe({ background: l.value || "var(--ap-accent)" }),
						title: N(J)("appearance.annotationColor")
					}, [F(H("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						Xo,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, wb), U($, {
						icon: N(Nv),
						label: N(J)("common.reset"),
						small: "",
						align: "end",
						disabled: !l.value,
						onClick: t[5] ||= (e) => l.value = ""
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])])]),
					_: 1
				}, 8, ["label"])) : W("", !0)
			]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Eb = { class: "toolbar" }, Db = ["disabled"], Ob = ["disabled"], kb = { class: "preset-list" }, Ab = ["onClick", "onKeydown"], jb = { class: "preset-mark" }, Mb = { class: "grow col preset-info" }, Nb = { class: "row wrap preset-head" }, Pb = { class: "preset-name" }, Fb = { class: "badge neutral" }, Ib = {
	key: 0,
	class: "xs muted"
}, Lb = {
	key: 1,
	class: "small muted preset-desc"
}, Rb = {
	key: 0,
	class: "empty"
}, zb = /* @__PURE__ */ I({
	__name: "PresetsTab",
	setup(e) {
		let t = G(() => yu()), n = /* @__PURE__ */ M(null), r = /* @__PURE__ */ M(!1), i = /* @__PURE__ */ M(""), a = /* @__PURE__ */ M(null);
		async function o(e, t, r) {
			n.value = e;
			try {
				await t(), r && f("success", r);
			} catch (e) {
				f("error", e instanceof Error ? e.message : String(e), J("app.name"));
			} finally {
				n.value = null;
			}
		}
		let s = (e) => o(`select:${e.preset.id}`, async () => {
			await ad(e.preset), ah();
		}), c = () => o("url", async () => {
			let e = await $m(i.value);
			return i.value = "", r.value = !1, e;
		}, J("presets.installed")), l = (e) => {
			let t = e.target.files?.[0];
			t && o("file", () => eh(t), J("presets.installed")), e.target.value = "";
		}, u = (e) => o(`update:${e.preset.id}`, () => $m(K().sources[e.preset.id]), J("presets.updated")), d = (e) => o(`remove:${e.preset.id}`, () => th(e.preset.id)), p = () => o("ext", async () => f("info", await Lm() === "current" ? J("update.none") : J("update.reloading")));
		return (e, o) => (z(), B(R, null, [
			H("div", Eb, [
				H("button", {
					type: "button",
					class: "btn",
					disabled: n.value === "file",
					onClick: o[0] ||= (e) => a.value?.click()
				}, [U(N(Wv)), ua(k(N(J)("presets.importFile")), 1)], 8, Db),
				H("button", {
					type: "button",
					class: O(["btn", { primary: r.value }]),
					onClick: o[1] ||= (e) => r.value = !r.value
				}, [U(N(vv)), ua(k(N(J)("presets.importUrl")), 1)], 2),
				o[4] ||= H("span", { class: "grow" }, null, -1),
				U($, {
					icon: n.value === "ext" ? N(yv) : N(jv),
					label: N(J)("presets.checkUpdates"),
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
					onChange: l
				}, null, 544)
			]),
			r.value ? (z(), B("form", {
				key: 0,
				class: "row",
				onSubmit: os(c, ["prevent"])
			}, [F(H("input", {
				"onUpdate:modelValue": o[2] ||= (e) => i.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Xo, i.value]]), H("button", {
				type: "submit",
				class: "btn primary",
				disabled: n.value === "url"
			}, [n.value === "url" ? (z(), V(N(yv), {
				key: 0,
				class: "spin"
			})) : (z(), V(N(cv), { key: 1 })), ua(k(N(J)("common.install")), 1)], 8, Ob)], 32)) : W("", !0),
			H("div", kb, [(z(!0), B(R, null, L(t.value, (e) => (z(), B("div", {
				key: e.preset.id,
				class: O(["preset-item", { on: N(oh)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => s(e),
				onKeydown: cs((t) => s(e), ["enter"])
			}, [
				H("span", jb, [n.value === `select:${e.preset.id}` ? (z(), V(N(yv), {
					key: 0,
					class: "spin"
				})) : N(oh)?.id === e.preset.id ? (z(), V(N(Z_), { key: 1 })) : W("", !0)]),
				H("div", Mb, [
					H("div", Nb, [
						H("span", Pb, k(N(Mu)(e.preset)), 1),
						H("span", Fb, "v" + k(e.preset.version), 1),
						e.source === "builtin" ? W("", !0) : (z(), B("span", {
							key: 0,
							class: O(["badge", { warn: e.source === "dev" }])
						}, k(N(J)(`presets.source.${e.source}`)), 3))
					]),
					e.preset.author ? (z(), B("span", Ib, k(e.preset.author), 1)) : W("", !0),
					N(Nu)(e.preset) ? (z(), B("span", Lb, k(N(Nu)(e.preset)), 1)) : W("", !0)
				]),
				H("div", {
					class: "row preset-actions",
					onClick: o[3] ||= os(() => {}, ["stop"])
				}, [e.source === "installed" && N(K)().sources[e.preset.id] ? (z(), V($, {
					key: 0,
					icon: N(jv),
					label: N(J)("presets.update"),
					align: "end",
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : W("", !0), e.source === "installed" ? (z(), V($, {
					key: 1,
					icon: N(Vv),
					label: N(J)("common.delete"),
					align: "end",
					small: "",
					danger: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : W("", !0)])
			], 42, Ab))), 128)), t.value.length ? W("", !0) : (z(), B("div", Rb, k(N(J)("presets.none")), 1))]),
			U(Tb)
		], 64));
	}
}), Bb;
function Vb() {
	let e = oh, t = G(() => e.value ? Lu(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (zu(r, t), n.sampling && (clearTimeout(Bb), Bb = setTimeout(() => void od(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Hb = { class: "empty" }, Ub = /* @__PURE__ */ I({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (z(), B("div", Hb, [
			U(N(Tv)),
			H("span", null, k(N(J)("panel.noPreset")), 1),
			H("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => N(X).tab = "presets"
			}, k(N(J)("panel.choosePreset")), 1)
		]));
	}
}), Wb = [
	"aria-checked",
	"title",
	"onClick"
], Gb = { class: "ellipsis" }, Kb = /* @__PURE__ */ I({
	__name: "Segmented",
	props: /*@__PURE__*/ ei({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ai(e, "modelValue");
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
		}, [e.icon ? (z(), V(Ur(e.icon), { key: 0 })) : W("", !0), H("span", Gb, k(e.label), 1)], 10, Wb))), 128))], 2));
	}
}), qb = { class: "col" }, Jb = { class: "row" }, Yb = ["aria-label"], Xb = ["label"], Zb = ["value"], Qb = ["label"], $b = ["value"], ex = ["placeholder"], tx = {
	key: 1,
	class: "xs muted row tight"
}, nx = { value: "" }, rx = ["value"], ix = ["value"], ax = ["value"], ox = { class: "slider" }, sx = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], cx = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], lx = { class: "field-grid" }, ux = ["value", "onChange"], dx = ["value"], fx = ["value"], px = /* @__PURE__ */ I({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Vb(), i = G(() => t.value ? Pu(t.value) : null), a = G({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				Bu(n, {
					kind: r,
					id: i.join(":")
				}), od(n);
			}
		}), o = G(() => t.value ? Vu(t.value) : !1), s = G(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ M(null), l = /* @__PURE__ */ M("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? Uu(e, n) : s.value && Gu(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (Hu(t.value), od(t.value));
		}, p = () => {
			t.value && s.value && (Ku(t.value, s.value), od(t.value));
		}, m = () => {
			t.value && s.value && Wu(t.value, s.value);
		}, h = G(() => _s.map((e) => ({
			value: e,
			label: J(`transport.${e}`),
			hint: J(`transport.${e}.hint`)
		}))), g = G({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), _ = G(() => g.value === "tool-single" || g.value === "tool-multi"), v = G(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = G(() => v.value.map((e) => ({
			value: e.id,
			label: Y(t.value, "workflows", e.id, "name", e.name),
			hint: Y(t.value, "workflows", e.id, "description", e.description ?? "")
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
		let ee = S("forceTool"), te = S("parallelTools"), C = S("sendThoughtSignature"), w = S("streamToolArguments"), ne = S("finalFallback"), re = S("maxSteps"), ie = G({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ae = [
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
		], T = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], E = ["stream_openai", "show_thoughts"], oe = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], D = G(() => n.value?.sampling ?? {}), se = (e) => e in D.value, ce = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), le = (e) => Number(e.target.value);
		return (e, r) => !N(t) || !N(n) || !i.value ? (z(), V(Ub, { key: 0 })) : (z(), B(R, { key: 1 }, [
			H("div", qb, [
				H("div", Jb, [
					F(H("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": N(J)("config.configuration")
					}, [H("optgroup", { label: N(J)("config.recommended") }, [(z(!0), B(R, null, L(N(t).configurations, (e) => (z(), B("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, k(N(Y)(N(t), "configurations", e.id, "name", e.name)), 9, Zb))), 128))], 8, Xb), i.value.saved.length ? (z(), B("optgroup", {
						key: 0,
						label: N(J)("config.saved")
					}, [(z(!0), B(R, null, L(i.value.saved, (e) => (z(), B("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, k(e.name), 9, $b))), 128))], 8, Qb)) : W("", !0)], 8, Yb), [[$o, a.value]]),
					s.value && o.value ? (z(), V($, {
						key: 0,
						icon: N(Pv),
						label: N(J)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: N(kv),
						label: N(J)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (z(), V($, {
						key: 1,
						icon: N(Ov),
						label: N(J)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : W("", !0),
					s.value ? (z(), V($, {
						key: 2,
						icon: N(Vv),
						label: N(J)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : W("", !0),
					U($, {
						icon: N(Nv),
						label: N(J)("config.reset"),
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
					onSubmit: os(d, ["prevent"])
				}, [
					F(H("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: N(J)("config.name"),
						autofocus: ""
					}, null, 8, ex), [[Xo, l.value]]),
					U($, {
						icon: N(qv),
						label: N(J)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					U($, {
						icon: N(Z_),
						label: N(J)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : W("", !0),
				o.value ? (z(), B("span", tx, [r[15] ||= H("span", { class: "dot modified" }, null, -1), ua(k(N(J)("config.modified")), 1)])) : W("", !0)
			]),
			U(Py, {
				title: N(J)("config.connection"),
				icon: N(X_)
			}, {
				default: P(() => [
					U(yb, {
						label: N(J)("config.transport"),
						help: N(J)(`transport.${g.value}.hint`)
					}, {
						default: P(() => [U(Kb, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (z(), B(R, { key: 0 }, [
						U(yb, {
							label: N(J)("config.forceTool"),
							help: N(J)("config.forceTool.hint"),
							inline: ""
						}, {
							default: P(() => [U(mb, {
								modelValue: N(ee),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ mn(ee) ? ee.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(yb, {
							label: N(J)("config.parallelTools"),
							help: N(J)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: P(() => [U(mb, {
								modelValue: N(te),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ mn(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(yb, {
							label: N(J)("config.syntheticTurn"),
							help: N(J)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: P(() => [F(H("select", {
								"onUpdate:modelValue": r[8] ||= (e) => ie.value = e,
								class: "input"
							}, [H("option", nx, k(N(J)("common.none")), 1), (z(!0), B(R, null, L(N(t).syntheticTurns, (e) => (z(), B("option", {
								key: e.id,
								value: e.id
							}, k(e.label), 9, rx))), 128))], 512), [[$o, ie.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						U(yb, {
							label: N(J)("config.thoughtSignature"),
							help: N(J)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: P(() => [U(mb, {
								modelValue: N(C),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ mn(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						U(yb, {
							label: N(J)("config.streamToolArguments"),
							help: N(J)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: P(() => [F(H("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ mn(w) ? w.value = e : null,
								class: "input"
							}, [(z(!0), B(R, null, L(N(vs), (e) => (z(), B("option", {
								key: e,
								value: e
							}, k(N(J)(`config.streamToolArguments.${e}`)), 9, ix))), 128))], 512), [[$o, N(w)]])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (z(), V(yb, {
							key: 0,
							label: N(J)("config.maxSteps"),
							inline: ""
						}, {
							default: P(() => [H("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: N(re),
								onChange: r[11] ||= (e) => re.value = le(e)
							}, null, 40, ax)]),
							_: 1
						}, 8, ["label"])) : W("", !0)
					], 64)) : W("", !0),
					U(yb, {
						label: N(J)("config.finalFallback"),
						help: N(J)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: P(() => [U(mb, {
							modelValue: N(ne),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ mn(ne) ? ne.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (z(), V(Py, {
				key: 0,
				title: N(J)("config.workflow"),
				icon: N(Kv),
				help: x.value
			}, {
				default: P(() => [U(Kb, {
					modelValue: b.value,
					"onUpdate:modelValue": r[13] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			U(Py, {
				title: N(J)("config.sampling"),
				icon: N(fv),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [
					(z(), B(R, null, L(ae, (e) => (z(), B(R, { key: e.key }, [se(e.key) ? (z(), V(yb, {
						key: 0,
						label: N(J)(`sampling.${e.key}`)
					}, {
						default: P(() => [H("div", ox, [H("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: D.value[e.key],
							onInput: (t) => ce(e.key, le(t))
						}, null, 40, sx), H("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: D.value[e.key],
							onChange: (t) => ce(e.key, le(t))
						}, null, 40, cx)])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)),
					H("div", lx, [(z(), B(R, null, L(T, (e) => (z(), B(R, { key: e }, [se(e) ? (z(), V(yb, {
						key: 0,
						label: N(J)(`sampling.${e}`)
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							value: D.value[e],
							onChange: (t) => ce(e, le(t))
						}, null, 40, ux)]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)), se("reasoning_effort") ? (z(), V(yb, {
						key: 0,
						label: N(J)("sampling.reasoning_effort")
					}, {
						default: P(() => [H("select", {
							class: "input",
							value: D.value.reasoning_effort,
							onChange: r[14] ||= (e) => ce("reasoning_effort", e.target.value)
						}, [(z(), B(R, null, L(oe, (e) => H("option", {
							key: e,
							value: e
						}, k(N(J)(`effort.${e}`)), 9, fx)), 64))], 40, dx)]),
						_: 1
					}, 8, ["label"])) : W("", !0)]),
					(z(), B(R, null, L(E, (e) => (z(), B(R, { key: e }, [se(e) ? (z(), V(yb, {
						key: 0,
						label: N(J)(`sampling.${e}`),
						inline: ""
					}, {
						default: P(() => [U(mb, {
							"model-value": !!D.value[e],
							"onUpdate:modelValue": (t) => ce(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), mx = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function hx(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: J("config.transport"),
			options: t([..._s], (e) => J(`transport.${e}`))
		},
		style: {
			kind: "enum",
			label: J("um.var.style"),
			options: t(["dialogue", "imperative"], (e) => J(`um.style.${e}`))
		},
		workflow: {
			kind: "enum",
			label: J("config.workflow"),
			options: e.workflows.map((t) => ({
				value: t.id,
				label: Y(e, "workflows", t.id, "name", t.name)
			}))
		},
		"gen.origin": {
			kind: "enum",
			label: J("um.var.origin"),
			options: t(["story", "task"], (e) => J(`um.origin.${e}`))
		},
		"gen.type": {
			kind: "enum",
			label: J("um.var.genType"),
			options: t(mx, (e) => J(`um.genType.${e}`))
		},
		"meta.present": {
			kind: "bool",
			label: J("um.var.metaPresent")
		},
		"meta.pure": {
			kind: "bool",
			label: J("um.var.metaPure")
		},
		"features.tokenSaving": {
			kind: "bool",
			label: J("writing.tokenSaving")
		},
		"chat.group": {
			kind: "bool",
			label: J("um.var.group")
		},
		"memory.hasChat": {
			kind: "bool",
			label: J("um.var.hasChat")
		},
		"memory.hasGlobal": {
			kind: "bool",
			label: J("um.var.hasGlobal")
		},
		"recap.present": {
			kind: "bool",
			label: J("um.var.recap")
		}
	};
}
var gx = (e) => e.modules.filter((e) => e.toggle === "user");
function _x(e) {
	let t = hx(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return gx(e).length && r.push({
		id: "module",
		label: J("um.var.module")
	}), e.params.length && r.push({
		id: "param",
		label: J("um.var.param")
	}), [
		{
			label: J("um.group.chat"),
			subjects: [{
				id: "keyword",
				label: J("um.keyword")
			}, ...n([
				"chat.group",
				"memory.hasChat",
				"memory.hasGlobal",
				"recap.present"
			])]
		},
		{
			label: J("um.group.generation"),
			subjects: n([
				"gen.type",
				"gen.origin",
				"meta.present",
				"meta.pure"
			])
		},
		{
			label: J("um.group.preset"),
			subjects: [...r, ...n([
				"transport",
				"style",
				"workflow",
				"features.tokenSaving"
			])]
		},
		{
			label: J("um.group.advanced"),
			subjects: [...e.regex.length ? [{
				id: "flag",
				label: J("um.var.flag")
			}] : [], {
				id: "expr",
				label: J("um.expr")
			}]
		}
	].filter((e) => e.subjects.length);
}
function vx(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function yx(e, t) {
	return t === "module" ? gx(e).map((t) => ({
		value: t.id,
		label: Y(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Y(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function bx(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: yx(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Y(e, "params", t.id, "label", t.label) : r;
		if (!t) return {
			kind: "text",
			label: n
		};
		if (t.type === "number") return {
			kind: "number",
			label: n
		};
		let i = (t.options ?? []).map((n) => ({
			value: n.value,
			label: xx(e, t.id, n.value, n.label)
		}));
		return t.type === "select" ? {
			kind: "enum",
			label: n,
			options: i
		} : {
			kind: "text",
			label: n,
			suggestions: i.map((e) => String(e.value))
		};
	}
	return hx(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var xx = (e, t, n, r) => ju(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), Sx = {
	bool: ["on", "off"],
	enum: ["in", "notIn"],
	number: [
		"==",
		"!=",
		">",
		">=",
		"<",
		"<="
	],
	text: ["==", "!="]
};
function Cx(e, t) {
	if (t === "keyword") return {
		kind: "keyword",
		target: "input",
		words: [],
		op: "any"
	};
	if (t === "expr") return {
		kind: "expr",
		source: ""
	};
	if (t === "module" || t === "param" || t === "flag") {
		let n = String(yx(e, t)[0]?.value ?? "");
		return wx(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return wx(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function wx(e, t, n) {
	let r = bx(e, n);
	return t.path && bx(e, t.path).kind === r.kind && Sx[r.kind].includes(t.op) && r.kind !== "enum" ? {
		...t,
		path: n
	} : r.kind === "bool" ? {
		kind: "var",
		path: n,
		op: "on"
	} : r.kind === "enum" ? {
		kind: "var",
		path: n,
		op: "in",
		value: []
	} : r.kind === "number" ? {
		kind: "var",
		path: n,
		op: ">=",
		value: 0
	} : {
		kind: "var",
		path: n,
		op: "==",
		value: ""
	};
}
function Tx(e, t, n = "") {
	return e === "bool" ? J(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "enum" ? J(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var Ex = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(J("um.or")) : t === void 0 ? "" : n(t);
};
function Dx(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? J("um.kw.input") : J("um.kw.recentN", { n: t.depth ?? 3 })} ${J(`um.kw.${t.op}`)} ${t.words.join(J("um.or"))}`;
	let n = bx(e, t.path);
	return n.kind === "bool" ? J("um.boolDesc", {
		label: n.label,
		value: Tx("bool", t.op, t.path)
	}) : `${n.label} ${Tx(n.kind, t.op)} ${Ex(n, t.value)}`;
}
function Ox(e, t) {
	let n = t.rules.filter(Dl);
	return n.length ? n.map((t) => Dx(e, t)).join(t.match === "any" ? `\n${J("um.match.anyJoin")} ` : `\n${J("um.match.allJoin")} `) : J("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var kx = ["data-id"], Ax = ["aria-label", "onPointerdown"], jx = ["onClick"], Mx = { class: "um-row-name ellipsis" }, Nx = { class: "um-row-meta xs muted ellipsis" }, Px = {
	key: 2,
	class: "faint small"
}, Fx = /* @__PURE__ */ I({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => Zd(n.preset)), a = G(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Y(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Y(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => Rl(n.preset, e), u = (e) => J("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(Dl);
		function p(e, t) {
			e.enabled = t, q();
		}
		function m() {
			let e = tf(n.preset, J("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		let h = /* @__PURE__ */ M(null);
		async function g(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let { added: e, missing: t } = sf(n.preset, JSON.parse(await r.text()));
				f(t ? "warning" : "success", t ? J("um.importedMissing", {
					n: e.length,
					missing: t
				}) : J("um.imported", { n: e.length }));
			} catch (e) {
				f("error", J("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let _ = () => nh(`${n.preset.id}.ap-modules.json`, of(n.preset)), v = /* @__PURE__ */ M(null), y = /* @__PURE__ */ M(null);
		function b(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), y.value = t;
		}
		function x(e) {
			let t = y.value;
			if (!t || !v.value) return;
			let r = [...v.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && af(n.preset, t, r);
		}
		let S = () => {
			y.value = null;
		};
		return (t, n) => (z(), V(Py, {
			title: N(J)("um.title"),
			help: N(J)("um.help")
		}, {
			actions: P(() => [
				a.value ? (z(), V($, {
					key: 0,
					icon: N(Wv),
					label: N(J)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => h.value?.click()
				}, null, 8, ["icon", "label"])) : W("", !0),
				i.value.length ? (z(), V($, {
					key: 1,
					icon: N(cv),
					label: N(J)("um.exportAll"),
					small: "",
					align: "end",
					onClick: _
				}, null, 8, ["icon", "label"])) : W("", !0),
				a.value && i.value.length ? (z(), V($, {
					key: 2,
					icon: N(kv),
					label: N(J)("um.new"),
					small: "",
					align: "end",
					onClick: m
				}, null, 8, ["icon", "label"])) : W("", !0)
			]),
			default: P(() => [i.value.length ? (z(), B("div", {
				key: 0,
				ref_key: "listEl",
				ref: v,
				class: "um-list"
			}, [(z(!0), B(R, null, L(i.value, (t) => (z(), B("div", {
				key: t.id,
				class: O(["um-row", {
					off: !t.enabled,
					dragging: y.value === t.id
				}]),
				"data-id": t.id
			}, [
				i.value.length > 1 ? (z(), B("span", {
					key: 0,
					class: "um-grip",
					"aria-label": N(J)("um.reorder"),
					onPointerdown: (e) => b(e, t.id),
					onPointermove: x,
					onPointerup: S,
					onPointercancel: S
				}, [U(N(hv))], 40, Ax)) : W("", !0),
				H("button", {
					type: "button",
					class: "um-open",
					onClick: (e) => r("open", t.id)
				}, [H("span", Mx, k(t.name || N(J)("um.untitled")), 1), H("span", Nx, k(c(t) || N(J)("um.noEntries")), 1)], 8, jx),
				l(t).length ? (z(), V(Yv, {
					key: 1,
					text: u(t),
					align: "end"
				}, {
					default: P(() => [U(N(Hv), {
						class: "text-warning um-flag",
						tabindex: "0"
					})]),
					_: 1
				}, 8, ["text"])) : W("", !0),
				d(t) ? (z(), V(Yv, {
					key: 2,
					text: N(Ox)(e.preset, t.trigger),
					align: "end"
				}, {
					default: P(() => [U(N(Jv), {
						class: "um-flag um-zap",
						tabindex: "0"
					})]),
					_: 1
				}, 8, ["text"])) : W("", !0),
				U(mb, {
					"model-value": t.enabled,
					label: t.name,
					"onUpdate:modelValue": (e) => p(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])
			], 10, kx))), 128))], 512)) : a.value ? (z(), B("button", {
				key: 1,
				type: "button",
				class: "um-new",
				onClick: m
			}, [U(N(kv)), ua(k(N(J)("um.new")), 1)])) : (z(), B("div", Px, k(N(J)("um.noPoints")), 1)), H("input", {
				ref_key: "fileInput",
				ref: h,
				type: "file",
				accept: ".json,application/json",
				hidden: "",
				onChange: g
			}, null, 544)]),
			_: 1
		}, 8, ["title", "help"]));
	}
}), Ix = { class: "ellipsis" }, Lx = ["aria-label", "onClick"], Rx = ["placeholder"], zx = /* @__PURE__ */ I({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ei({
		placeholder: {},
		literal: { type: Boolean },
		mono: { type: Boolean },
		removeLabel: {}
	}, {
		modelValue: { default: () => [] },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ai(e, "modelValue"), n = e, r = /* @__PURE__ */ M(""), i = /* @__PURE__ */ M(null);
		function a(e = r.value) {
			let i = (n.literal ? [e] : e.split(/[,，、\n]/)).map((e) => e.trim()).filter(Boolean);
			r.value = "";
			let a = [...t.value];
			for (let e of i) a.includes(e) || a.push(e);
			a.length !== t.value.length && (t.value = a);
		}
		function o(e) {
			e.isComposing || (e.key === "Enter" || !n.literal && (e.key === "," || e.key === "，") ? (e.preventDefault(), a()) : e.key === "Backspace" && !r.value && t.value.length && (t.value = t.value.slice(0, -1)));
		}
		function s(e) {
			let t = e.clipboardData?.getData("text") ?? "";
			if (!(n.literal ? !t.includes("\n") : !/[,，、\n]/.test(t))) {
				if (e.preventDefault(), n.literal) for (let e of t.split("\n")) a(e);
				else a(r.value + t);
			}
		}
		let c = (e) => {
			t.value = t.value.filter((t, n) => n !== e);
		};
		return (n, l) => (z(), B("div", {
			class: "chips-input input",
			onClick: l[2] ||= (e) => i.value?.focus()
		}, [(z(!0), B(R, null, L(t.value, (t, n) => (z(), B("span", {
			key: t,
			class: O(["chip", { mono: e.mono }])
		}, [H("span", Ix, k(t), 1), H("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: os((e) => c(n), ["stop"])
		}, [U(N(qv))], 8, Lx)], 2))), 128)), F(H("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: O(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, Rx), [[Xo, r.value]])]));
	}
}), Bx = { class: "rule" }, Vx = { class: "rule-head" }, Hx = ["value", "aria-label"], Ux = ["label"], Wx = ["value"], Gx = ["value"], Kx = ["value"], qx = ["value"], Jx = ["value"], Yx = {
	key: 1,
	class: "grow"
}, Xx = {
	key: 0,
	class: "rule-body"
}, Zx = { class: "row wrap" }, Qx = {
	key: 0,
	class: "unit small muted"
}, $x = ["value"], eS = ["value"], tS = { value: "any" }, nS = { value: "none" }, rS = { class: "row kw-words" }, iS = {
	key: 1,
	class: "rule-body"
}, aS = ["value"], oS = {
	key: 2,
	class: "rule-body"
}, sS = ["value"], cS = ["value"], lS = { class: "row wrap option-chips" }, uS = ["aria-pressed", "onClick"], dS = {
	key: 2,
	class: "row"
}, fS = ["value"], pS = ["value"], mS = ["value"], hS = ["list", "value"], gS = ["value"], _S = {
	key: 3,
	class: "rule-error xs"
}, vS = /* @__PURE__ */ I({
	__name: "RuleRow",
	props: /*@__PURE__*/ ei({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ei(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = ai(e, "modelValue"), r = G(() => _x(t.preset)), i = G(() => vx(n.value)), a = G(() => yx(t.preset, i.value)), o = G(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = G(() => n.value.kind === "var" ? bx(t.preset, n.value.path) : null), c = G(() => Nl(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = Cx(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = wx(t.preset, r, `${i}.${e}`);
		}
		let f = (e) => {
			n.value = {
				...n.value,
				...e
			};
		}, p = (e) => {
			n.value = {
				...n.value,
				...e
			};
		}, m = G(() => {
			let e = n.value.value;
			return (Array.isArray(e) ? e : []).map(String);
		});
		function h(e) {
			let t = n.value.value, r = Array.isArray(t) ? [...t] : [], i = r.findIndex((t) => String(t) === String(e));
			i >= 0 ? r.splice(i, 1) : r.push(e), f({ value: r });
		}
		let g = G(() => Sx.bool.map((e) => ({
			value: e,
			label: Tx("bool", e, n.value.path)
		}))), _ = G(() => (s.value ? Sx[s.value.kind] : []).map((e) => ({
			value: e,
			label: Tx(s.value.kind, e)
		}))), v = G({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), y = G(() => [{
			value: "input",
			label: J("um.kw.input")
		}, {
			value: "recent",
			label: J("um.kw.recent")
		}]);
		return (e, t) => (z(), B("div", Bx, [
			H("div", Vx, [
				H("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": N(J)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(z(!0), B(R, null, L(r.value, (e) => (z(), B("optgroup", {
					key: e.label,
					label: e.label
				}, [(z(!0), B(R, null, L(e.subjects, (e) => (z(), B("option", {
					key: e.id,
					value: e.id
				}, k(e.label), 9, Wx))), 128))], 8, Ux))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (z(), B("option", {
					key: 0,
					value: i.value
				}, k(n.value.path), 9, Gx)) : W("", !0)], 40, Hx),
				a.value.length ? (z(), B("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
					key: String(e.value),
					value: e.value
				}, k(e.label), 9, qx))), 128)), a.value.some((e) => String(e.value) === o.value) ? W("", !0) : (z(), B("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, k(o.value), 9, Jx))], 40, Kx)) : (z(), B("span", Yx)),
				U($, {
					icon: N(qv),
					label: N(J)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (z(), B("div", Xx, [H("div", Zx, [
				U(Kb, {
					modelValue: v.value,
					"onUpdate:modelValue": t[3] ||= (e) => v.value = e,
					class: "rule-scope",
					options: y.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (z(), B("label", Qx, [H("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? N(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, $x), ua(" " + k(N(J)("um.kw.messages")), 1)])) : W("", !0),
				H("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [H("option", tS, k(N(J)("um.kw.any")), 1), H("option", nS, k(N(J)("um.kw.none")), 1)], 40, eS)
			]), H("div", rS, [U(zx, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": N(J)("common.delete"),
				placeholder: n.value.regex ? N(J)("um.kw.regexPlaceholder") : N(J)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), U($, {
				icon: N(Mv),
				label: N(J)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (z(), B("div", iS, [H("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, aS)])) : s.value ? (z(), B("div", oS, [s.value.kind === "bool" ? (z(), V(Kb, {
				key: 0,
				"model-value": n.value.op,
				options: g.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (z(), B(R, { key: 1 }, [H("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(_.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, k(e.label), 9, cS))), 128))], 40, sS), H("div", lS, [(z(!0), B(R, null, L(s.value.options, (e) => (z(), B("button", {
				key: String(e.value),
				type: "button",
				class: O(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, k(e.label), 11, uS))), 128))])], 64)) : (z(), B("div", dS, [H("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(z(!0), B(R, null, L(_.value, (e) => (z(), B("option", {
				key: e.value,
				value: e.value
			}, k(e.label), 9, pS))), 128))], 40, fS), s.value.kind === "number" ? (z(), B("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, mS)) : (z(), B(R, { key: 1 }, [H("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, hS), s.value.suggestions?.length ? (z(), B("datalist", {
				key: 0,
				id: l
			}, [(z(!0), B(R, null, L(s.value.suggestions, (e) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, gS))), 128))])) : W("", !0)], 64))]))])) : W("", !0),
			c.value ? (z(), B("div", _S, k(c.value), 1)) : W("", !0)
		]));
	}
}), yS = { class: "trigger" }, bS = {
	key: 1,
	class: "always faint small"
}, xS = {
	key: 0,
	class: "rule-join xs faint"
}, SS = { class: "btn ghost add picker" }, CS = ["aria-label"], wS = ["label"], TS = ["value"], ES = /* @__PURE__ */ I({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ei({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = ai(e, "modelValue"), r = G(() => _x(t.preset)), i = /* @__PURE__ */ M(null), a = G(() => [{
			value: "all",
			label: J("um.match.all")
		}, {
			value: "any",
			label: J("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(Cx(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (z(), B("div", yS, [
			n.value.rules.length > 1 ? (z(), V(Kb, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : W("", !0),
			n.value.rules.length ? W("", !0) : (z(), B("div", bS, k(N(J)("um.always")), 1)),
			(z(!0), B(R, null, L(n.value.rules, (t, r) => (z(), B(R, { key: r }, [r > 0 ? (z(), B("div", xS, k(n.value.match === "any" ? N(J)("um.match.anyJoin") : N(J)("um.match.allJoin")), 1)) : W("", !0), U(vS, {
				"model-value": t,
				preset: e.preset,
				"onUpdate:modelValue": (e) => s(r, e),
				onRemove: (e) => c(r)
			}, null, 8, [
				"model-value",
				"preset",
				"onUpdate:modelValue",
				"onRemove"
			])], 64))), 128)),
			H("label", SS, [
				U(N(kv)),
				ua(k(N(J)("um.addRule")) + " ", 1),
				H("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": N(J)("um.addRule"),
					onChange: l[1] ||= (e) => o(e.target.value)
				}, [l[2] ||= H("option", {
					value: "",
					disabled: "",
					selected: "",
					hidden: ""
				}, null, -1), (z(!0), B(R, null, L(r.value, (e) => (z(), B("optgroup", {
					key: e.label,
					label: e.label
				}, [(z(!0), B(R, null, L(e.subjects, (e) => (z(), B("option", {
					key: e.id,
					value: e.id
				}, k(e.label), 9, TS))), 128))], 8, wS))), 128))], 40, CS)
			])
		]));
	}
}), DS = { class: "um-entry-head" }, OS = { class: "um-var-label grow ellipsis" }, kS = {
	key: 0,
	class: "um-warn xs"
}, AS = ["placeholder"], jS = ["onUpdate:modelValue", "placeholder"], MS = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], NS = [
	"value",
	"placeholder",
	"onInput"
], PS = ["id"], FS = ["value"], IS = /* @__PURE__ */ I({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => Il(n.preset, n.update.var)), a = G(() => i.value?.type !== n.update.type), o = G(() => i.value ? Y(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = G(() => i.value && Y(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = G(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = G(() => `ap-bv-${n.update.var}`);
		function u(e) {
			e.key = e.key.trim();
			let t = c.value.get(e.key);
			t !== void 0 && !e.value && (e.value = t);
		}
		function d() {
			let e = n.update;
			e.type === "list" ? e.items.push("") : e.type === "dict" && e.items.push({
				key: "",
				value: ""
			});
		}
		return (t, n) => (z(), B("div", { class: O(["um-entry", { lost: a.value }]) }, [
			H("div", DS, [
				U(N(q_), { class: "faint" }),
				H("span", OS, k(o.value), 1),
				U(jy, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				U($, {
					icon: N(qv),
					label: N(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (z(), B("div", kS, [U(N(Hv)), ua(k(N(J)("um.bv.lost")), 1)])) : W("", !0),
			e.update.type === "string" ? F((z(), B("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: N(J)("um.bv.append")
			}, null, 8, AS)), [[Xo, e.update.text]]) : e.update.type === "list" ? (z(!0), B(R, { key: 2 }, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: "um-var-row list"
			}, [F(H("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: N(J)("um.bv.item")
			}, null, 8, jS), [[Xo, e.update.items[n]]]), U($, {
				icon: N(qv),
				label: N(J)("um.removeEntry"),
				small: "",
				align: "end",
				onClick: (t) => e.update.items.splice(n, 1)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])]))), 128)) : (z(), B(R, { key: 3 }, [(z(!0), B(R, null, L(e.update.items, (t, n) => (z(), B("div", {
				key: n,
				class: "um-var-row"
			}, [
				F(H("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: N(J)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, MS), [[Xo, t.key]]),
				H("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? N(J)("um.bv.removes") : N(J)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, NS),
				U($, {
					icon: N(qv),
					label: N(J)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]))), 128)), H("datalist", { id: l.value }, [(z(!0), B(R, null, L(c.value, ([e]) => (z(), B("option", {
				key: e,
				value: e
			}, null, 8, FS))), 128))], 8, PS)], 64)),
			e.update.type === "string" ? W("", !0) : (z(), B("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [U(N(kv)), ua(k(e.update.type === "dict" ? N(J)("um.bv.addKey") : N(J)("um.bv.addItem")), 1)]))
		], 2));
	}
}), LS = { class: "um-editor" }, RS = { class: "um-head" }, zS = ["placeholder", "aria-label"], BS = { class: "um-entry-head" }, VS = ["onUpdate:modelValue", "aria-label"], HS = ["value"], US = ["value"], WS = [
	"value",
	"aria-label",
	"onChange"
], GS = ["value"], KS = {
	key: 0,
	class: "um-warn xs"
}, qS = ["onUpdate:modelValue", "placeholder"], JS = {
	key: 1,
	class: "rule-error xs pre"
}, YS = {
	key: 0,
	class: "btn ghost add picker"
}, XS = ["aria-label"], ZS = ["value"], QS = { class: "um-foot" }, $S = ["title"], eC = ["title"], tC = ["title"], nC = /* @__PURE__ */ I({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		or(() => n.module, q, { deep: !0 });
		let i = /* @__PURE__ */ M(null);
		Rr(() => {
			n.module.entries.some((e) => e.text) || Bn(() => i.value?.select());
		});
		let a = G(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Y(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Y(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !Pl(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => xl(e.text).errors, d = (e) => u(e).map((e) => e.line ? J("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = ef(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = G(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Y(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = G(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ M(null);
		function _(e) {
			let t = n.preset.vars.find((t) => t.id === e);
			if (g.value && (g.value.value = ""), !t) return;
			let r = t.type === "string" ? {
				var: e,
				type: "string",
				text: ""
			} : t.type === "list" ? {
				var: e,
				type: "list",
				items: [""]
			} : {
				var: e,
				type: "dict",
				items: [{
					key: "",
					value: ""
				}]
			};
			n.module.vars.push(r);
		}
		let v = /* @__PURE__ */ M(!1);
		function y() {
			v.value ? (rf(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = nf(n.preset, n.module.id, (e) => J("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => nh(`${n.preset.id}.${rh(n.module.name)}.ap-modules.json`, of(n.preset, [n.module.id]));
		return (t, n) => (z(), B("div", LS, [
			H("header", RS, [
				U($, {
					icon: N(W_),
					label: N(J)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				F(H("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: N(J)("um.untitled"),
					"aria-label": N(J)("um.name")
				}, null, 8, zS), [[Xo, e.module.name]]),
				U(mb, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: N(J)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			U(Py, {
				title: N(J)("um.content"),
				help: N(J)("um.content.help")
			}, {
				default: P(() => [(z(!0), B(R, null, L(e.module.entries, (t, n) => (z(), B("div", {
					key: t.id,
					class: O(["um-entry", { lost: s(t) }])
				}, [
					H("div", BS, [
						U(N(bv), { class: "faint" }),
						F(H("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": N(J)("um.point")
						}, [(z(!0), B(R, null, L(a.value, (e) => (z(), B("option", {
							key: e.id,
							value: e.id
						}, k(e.label), 9, HS))), 128)), s(t) ? (z(), B("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, k(N(J)("um.pointMissing", { id: t.point })), 9, US)) : W("", !0)], 8, VS), [[$o, t.point]]),
						U(jy, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						H("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": N(J)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(z(), B(R, null, L(c, (e) => H("option", {
							key: e,
							value: e
						}, k(N(J)(`um.role.${e || "merge"}`)), 9, GS)), 64))], 40, WS),
						e.module.entries.length > 1 || e.module.vars.length ? (z(), V($, {
							key: 0,
							icon: N(qv),
							label: N(J)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : W("", !0)
					]),
					s(t) ? (z(), B("div", KS, [U(N(Hv)), ua(k(N(J)("um.pointLost")), 1)])) : W("", !0),
					F(H("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: N(J)("um.text.placeholder")
					}, null, 8, qS), [[Xo, t.text]]),
					u(t).length ? (z(), B("div", JS, k(d(t)), 1)) : W("", !0)
				], 2))), 128)), a.value.length ? (z(), B("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [U(N(kv)), ua(k(N(J)("um.addEntry")), 1)])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (z(), V(Py, {
				key: 0,
				title: N(J)("um.bv"),
				help: N(J)("um.bv.help")
			}, {
				default: P(() => [(z(!0), B(R, null, L(e.module.vars, (t, n) => (z(), V(IS, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (z(), B("label", YS, [
					U(N(kv)),
					ua(k(N(J)("um.bv.add")) + " ", 1),
					H("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": N(J)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= H("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (z(!0), B(R, null, L(h.value, (e) => (z(), B("option", {
						key: e.id,
						value: e.id
					}, k(e.label), 9, ZS))), 128))], 40, XS)
				])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : W("", !0),
			U(Py, {
				title: N(J)("um.trigger"),
				help: N(J)("um.trigger.help")
			}, {
				default: P(() => [U(ES, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			H("footer", QS, [
				H("button", {
					type: "button",
					class: "btn ghost",
					title: N(J)("um.export"),
					onClick: x
				}, [U(N(cv)), H("span", null, k(N(J)("um.export")), 1)], 8, $S),
				H("button", {
					type: "button",
					class: "btn ghost",
					title: N(J)("um.duplicate"),
					onClick: b
				}, [U(N(ov)), H("span", null, k(N(J)("um.duplicate")), 1)], 8, eC),
				n[6] ||= H("span", { class: "grow" }, null, -1),
				H("button", {
					type: "button",
					class: O(["btn ghost danger", { armed: v.value }]),
					title: N(J)("common.delete"),
					onClick: y
				}, [U(N(Vv)), H("span", null, k(v.value ? N(J)("um.confirmDelete") : N(J)("common.delete")), 1)], 10, tC)
			])
		]));
	}
}), rC = {
	key: 0,
	class: "module-row"
}, iC = { class: "grow" }, aC = { class: "ellipsis" }, oC = ["aria-label"], sC = ["aria-checked", "onClick"], cC = { class: "grow" }, lC = { class: "grow" }, uC = { class: "ellipsis" }, dC = {
	key: 0,
	class: "empty"
}, fC = /* @__PURE__ */ I({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Vb(), i = G(() => t.value && n.value ? Jc(t.value, n.value) : {}), a = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = Kc(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Y(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Y(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Y(e, "groups", t, "label", r?.label ?? t) : J("modules.other"),
					help: t && Y(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Y(t.value, "modules", e.id, "name", e.name), s = (e) => Y(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let d = /* @__PURE__ */ new Map(), f = (e) => `${t.value?.id}:${e.key}`;
		function p(e, t) {
			d.set(f(e), t), l(e, t);
		}
		function m(e, t) {
			let n = c(e);
			if (!t) {
				n && d.set(f(e), n), l(e, null);
				return;
			}
			let r = d.get(f(e)), i = e.modules.find((e) => e.id === r) ?? e.modules.find((e) => e.default) ?? e.modules[0];
			i && l(e, i.id);
		}
		let h = /* @__PURE__ */ M(null), g = /* @__PURE__ */ M(null), _ = G(() => t.value && h.value ? Zd(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Bn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Bn(() => y()?.scrollTo({ top: v }));
		}
		return or(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !N(t) || !N(n) ? (z(), V(Ub, { key: 0 })) : _.value ? (z(), B("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(z(), V(nC, {
			key: _.value.id,
			preset: N(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (z(), B("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			U(Fx, {
				preset: N(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(z(!0), B(R, null, L(a.value, (e) => (z(), V(Py, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Kr({
				default: P(() => [(z(!0), B(R, null, L(e.sets, (t) => (z(), B(R, { key: t.key }, [t.label ? (z(), B("div", rC, [H("span", iC, [H("span", aC, k(t.label), 1), U(jy, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (z(), V(mb, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : W("", !0)])) : W("", !0), !t.optional || c(t) ? (z(), B("div", {
					key: 1,
					class: O(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(z(!0), B(R, null, L(t.modules, (e) => (z(), B("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: O(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= H("span", { class: "radio" }, null, -1),
					H("span", cC, k(o(e)), 1),
					U(jy, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, sC))), 128))], 10, oC)) : W("", !0)], 64))), 128)), (z(!0), B(R, null, L(e.toggles, (e) => (z(), B("div", {
					key: e.id,
					class: "module-row"
				}, [H("span", lC, [H("span", uC, k(o(e)), 1), U(jy, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), U(mb, {
					"model-value": i.value[e.id],
					label: o(e),
					"onUpdate:modelValue": (t) => u(e, t)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])]))), 128))]),
				_: 2
			}, [e.header ? {
				name: "actions",
				fn: P(() => [U(mb, {
					"model-value": c(e.header) !== null,
					label: e.label,
					"onUpdate:modelValue": (t) => m(e.header, t)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])]),
				key: "0"
			} : void 0]), 1032, ["title", "help"]))), 128)),
			a.value.length ? W("", !0) : (z(), B("div", dC, k(N(J)("modules.none")), 1))
		], 512));
	}
}), pC = ["value", "onChange"], mC = ["value"], hC = {
	key: 1,
	class: "unit"
}, gC = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], _C = {
	key: 0,
	class: "small muted"
}, vC = [
	"list",
	"value",
	"placeholder",
	"onChange"
], yC = ["id"], bC = ["value"], xC = [
	"value",
	"placeholder",
	"onChange"
], SC = [
	"value",
	"placeholder",
	"onChange"
], CC = ["value"], wC = ["value"], TC = ["value"], EC = /* @__PURE__ */ I({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Vb(), i = G(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Y(e, "groups", t, "label", e.groups[t]?.label ?? t) : J("writing.params"),
				help: t && Y(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Y(t.value, "params", e.id, "label", e.label), o = (e) => Y(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => ju(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => n.value?.params[e.id] ?? e.default, l = (e, t) => r((n) => {
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
		}), m = G(() => xs.map((e) => ({
			value: e,
			label: J(`writing.userInput.${e}`),
			hint: J(`writing.userInput.${e}.hint`)
		}))), h = G({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), g = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), _ = (e) => `ap-param-${e.id}`;
		return (e, r) => !N(t) || !N(n) ? (z(), V(Ub, { key: 0 })) : (z(), B(R, { key: 1 }, [
			(z(!0), B(R, null, L(i.value, (e) => (z(), V(Py, {
				key: e.id,
				title: e.label,
				help: e.help,
				icon: N(zv)
			}, {
				default: P(() => [(z(!0), B(R, null, L(e.params, (e) => (z(), V(yb, {
					key: e.id,
					label: a(e),
					help: o(e)
				}, {
					default: P(() => [e.type === "select" ? (z(), B("select", {
						key: 0,
						class: "input",
						value: c(e),
						onChange: (t) => l(e, t.target.value)
					}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
						key: String(t.value),
						value: t.value
					}, k(s(e, t.value, t.label)), 9, mC))), 128))], 40, pC)) : e.type === "number" ? (z(), B("div", hC, [H("input", {
						class: "input",
						type: "number",
						min: e.min,
						max: e.max,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, gC), e.unit ? (z(), B("span", _C, k(e.unit), 1)) : W("", !0)])) : (z(), B(R, { key: 2 }, [H("input", {
						class: "input",
						list: e.options?.length ? _(e) : void 0,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, vC), e.options?.length ? (z(), B("datalist", {
						key: 0,
						id: _(e)
					}, [(z(!0), B(R, null, L(e.options, (t) => (z(), B("option", {
						key: String(t.value),
						value: t.value
					}, k(s(e, t.value, t.label)), 9, bC))), 128))], 8, yC)) : W("", !0)], 64))]),
					_: 2
				}, 1032, ["label", "help"]))), 128))]),
				_: 2
			}, 1032, [
				"title",
				"help",
				"icon"
			]))), 128)),
			U(Py, {
				title: N(J)("writing.actors"),
				icon: N(lv),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [(z(!0), B(R, null, L(u.value, ([e, t]) => (z(), B("div", {
					key: e,
					class: "field-grid"
				}, [U(yb, { label: N(J)("writing.actorName", { actor: e }) }, {
					default: P(() => [H("input", {
						class: "input",
						value: N(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => d("names", e, t.target.value)
					}, null, 40, xC)]),
					_: 2
				}, 1032, ["label"]), U(yb, { label: N(J)("writing.actorPrefix") }, {
					default: P(() => [H("input", {
						class: "input",
						value: N(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => d("prefixes", e, t.target.value)
					}, null, 40, SC)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Py, {
				title: N(J)("writing.tokenSaving"),
				icon: N(av),
				help: N(J)("writing.tokenSaving.hint")
			}, {
				actions: P(() => [U(mb, {
					modelValue: f.value,
					"onUpdate:modelValue": r[0] ||= (e) => f.value = e,
					label: N(J)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: P(() => [f.value ? (z(), B(R, { key: 0 }, [
					U(yb, {
						label: N(J)("writing.keepFullTurns"),
						help: N(J)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: N(n).tokenSaving.keepFullTurns,
							onChange: r[1] ||= (e) => p("keepFullTurns", e.target.value)
						}, null, 40, CC)]),
						_: 1
					}, 8, ["label", "help"]),
					U(yb, {
						label: N(J)("writing.userInput"),
						help: N(J)("writing.userInput.hint")
					}, {
						default: P(() => [U(Kb, {
							modelValue: h.value,
							"onUpdate:modelValue": r[2] ||= (e) => h.value = e,
							options: m.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					h.value === "truncate" ? (z(), V(yb, {
						key: 0,
						label: N(J)("writing.truncateUserAfter"),
						help: N(J)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: P(() => [H("input", {
							class: "input",
							type: "number",
							min: "0",
							value: N(n).tokenSaving.truncateUserAfter,
							onChange: r[3] ||= (e) => p("truncateUserAfter", e.target.value)
						}, null, 40, wC)]),
						_: 1
					}, 8, ["label", "help"])) : W("", !0)
				], 64)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Py, {
				title: N(J)("writing.meta"),
				icon: N(Cv)
			}, {
				default: P(() => [U(yb, {
					label: N(J)("writing.recentCount"),
					help: N(J)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: P(() => [H("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: N(n).meta.recentCount,
						onChange: r[4] ||= (e) => g(e.target.value)
					}, null, 40, TC)]),
					_: 1
				}, 8, ["label", "help"])]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), DC = { class: "kv" }, OC = {
	key: 0,
	class: "kv-row"
}, kC = { class: "kv-key ellipsis" }, AC = { class: "kv-value pre small" }, jC = {
	key: 0,
	class: "kv-actions"
}, MC = {
	key: 1,
	class: "kv-edit col"
}, NC = ["placeholder"], PC = ["placeholder"], FC = { class: "row end" }, IC = {
	key: 0,
	class: "kv-edit col"
}, LC = ["placeholder"], RC = ["placeholder"], zC = { class: "row end" }, BC = {
	key: 1,
	class: "faint small kv-empty"
}, VC = /* @__PURE__ */ I({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ M(null), a = /* @__PURE__ */ M(""), o = /* @__PURE__ */ M("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (z(), B("div", DC, [
			(z(!0), B(R, null, L(e.entries, (t, l) => (z(), B(R, { key: l }, [i.value === l ? (z(), B("div", MC, [
				F(H("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: N(J)("memory.key")
				}, null, 8, NC), [[Xo, a.value]]),
				F(H("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: N(J)("memory.content")
				}, null, 8, PC), [[Xo, o.value]]),
				H("div", FC, [U($, {
					icon: N(qv),
					label: N(J)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: N(Z_),
					label: N(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (z(), B("div", OC, [
				H("div", kC, k(l), 1),
				H("div", AC, k(t), 1),
				e.readonly ? W("", !0) : (z(), B("div", jC, [U($, {
					icon: N(Ov),
					label: N(J)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), U($, {
					icon: N(Vv),
					label: N(J)("common.delete"),
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
			i.value === "" ? (z(), B("div", IC, [
				F(H("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: N(J)("memory.key")
				}, null, 8, LC), [[Xo, a.value]]),
				F(H("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: N(J)("memory.content")
				}, null, 8, RC), [[Xo, o.value]]),
				H("div", zC, [U($, {
					icon: N(qv),
					label: N(J)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), U($, {
					icon: N(Z_),
					label: N(J)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : W("", !0),
			!Object.keys(e.entries).length && i.value === null ? (z(), B("div", BC, k(N(J)("memory.empty")), 1)) : W("", !0),
			!e.readonly && i.value === null ? (z(), B("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [U(N(kv)), ua(k(N(J)("common.add")), 1)])) : W("", !0)
		]));
	}
}), HC = {
	key: 1,
	class: "faint small"
}, UC = {
	key: 0,
	class: "badge neutral"
}, WC = ["placeholder"], GC = {
	key: 1,
	class: "faint small"
}, KC = /* @__PURE__ */ I({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Vb(), r = G(() => n.value ? Pu(n.value) : null), i = G(() => (X.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = G(() => (X.chatRev, i.value ? gd() : {})), o = G(() => r.value ? yd(r.value) : {}), s = G(() => (X.chatRev, i.value ? _d() : null));
		async function c(e, t) {
			await vd({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), ih();
		}
		async function l(e) {
			await vd({
				type: "memory.delete",
				key: e,
				source: "user"
			}), ih();
		}
		let u = (e, t) => r.value && bd(r.value, "replace", e, t, "user"), d = (e) => r.value && bd(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ M("");
		or(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = G(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await vd({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), ih();
		}
		return (e, t) => !N(n) || !r.value ? (z(), V(Ub, { key: 0 })) : (z(), B(R, { key: 1 }, [
			U(Py, {
				title: N(J)("memory.chat"),
				icon: N(xv),
				help: N(J)("memory.chat.hint")
			}, {
				default: P(() => [i.value ? (z(), V(VC, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (z(), B("div", HC, k(N(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Py, {
				title: N(J)("memory.global"),
				icon: N(mv),
				help: N(J)("memory.global.hint")
			}, {
				actions: P(() => [U($, {
					icon: N(Uv),
					label: N(J)("common.undo"),
					small: "",
					align: "end",
					disabled: !N(xd)(r.value),
					onClick: t[0] ||= (e) => N(Cd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), U($, {
					icon: N(Av),
					label: N(J)("common.redo"),
					small: "",
					align: "end",
					disabled: !N(Sd)(r.value),
					onClick: t[1] ||= (e) => N(wd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: P(() => [U(VC, {
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
			U(Py, {
				title: N(J)("memory.recap"),
				icon: N(Fv),
				help: N(J)("memory.recap.hint")
			}, {
				actions: P(() => [s.value ? (z(), B("span", UC, "#0–" + k(s.value.coversUpTo), 1)) : W("", !0), i.value ? (z(), V($, {
					key: 1,
					icon: N(Z_),
					label: N(J)("common.save"),
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
				default: P(() => [i.value ? F((z(), B("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: N(J)("memory.recap.empty")
				}, null, 8, WC)), [[Xo, f.value]]) : (z(), B("div", GC, k(N(J)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), qC = { class: "row tight xs muted" }, JC = { class: "row" }, YC = {
	key: 0,
	class: "xs text-danger"
}, XC = { class: "row wrap xs muted" }, ZC = { class: "badge neutral" }, QC = {
	key: 0,
	class: "badge neutral"
}, $C = { class: "badge neutral" }, ew = {
	key: 1,
	class: "badge warn"
}, tw = ["onClick"], nw = { class: "grow mono" }, rw = { class: "xs muted" }, iw = { class: "row xs muted" }, aw = { class: "badge neutral" }, ow = { class: "pre mono scroll" }, sw = {
	key: 0,
	class: "xs faint region-msg"
}, cw = { key: 0 }, lw = ["onClick"], uw = { class: "grow mono" }, dw = { class: "xs muted" }, fw = {
	key: 0,
	class: "region-msg"
}, pw = { class: "pre mono scroll" }, mw = {
	key: 0,
	class: "xs faint"
}, hw = {
	key: 1,
	class: "xs text-warning"
}, gw = {
	key: 1,
	class: "faint small"
}, _w = ["onClick"], vw = { class: "mono grow ellipsis" }, yw = {
	key: 0,
	class: "badge warn"
}, bw = { class: "xs muted" }, xw = { class: "xs muted" }, Sw = { class: "row xs muted" }, Cw = { class: "grow" }, ww = { class: "mono scroll" }, Tw = { class: "row xs muted" }, Ew = { class: "grow" }, Dw = { class: "mono scroll" }, Ow = {
	key: 0,
	class: "faint small"
}, kw = { class: "row xs" }, Aw = { class: "badge neutral" }, jw = { class: "muted" }, Mw = { class: "mono scroll" }, Nw = {
	key: 0,
	class: "faint small"
}, Pw = { class: "row xs" }, Fw = { class: "badge neutral" }, Iw = { class: "grow muted" }, Lw = { class: "small" }, Rw = {
	key: 0,
	class: "faint small"
}, zw = { class: "xs faint mono build" }, Bw = /* @__PURE__ */ I({
	__name: "DebugTab",
	setup(t) {
		let n = G(() => uf.log.find((e) => e.kind === "assembly")?.data), r = /* @__PURE__ */ nn(/* @__PURE__ */ new Set()), i = (e) => r.has(e) ? r.delete(e) : r.add(e), a = /* @__PURE__ */ nn({});
		or(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (a[i] === void 0 && r) try {
					a[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let o = /* @__PURE__ */ M(null), s = (e) => typeof e == "string" ? c(e) : JSON.stringify(e, null, 2);
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
		}), m = G(() => uf.log.filter((e) => e.kind !== "assembly")), h = G(() => {
			X.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of Om(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (z(), B(R, null, [
			U(Py, {
				title: N(J)("debug.dev"),
				icon: N(Iv),
				help: N(J)("debug.dev.hint")
			}, {
				actions: P(() => [H("span", qC, [H("span", { class: O(["dot status-dot", N(zm).status]) }, null, 2), ua(k(N(J)(`debug.dev.${N(zm).status}`)), 1)])]),
				default: P(() => [U(yb, { label: N(J)("debug.dev.url") }, {
					default: P(() => [H("div", JC, [F(H("input", {
						"onUpdate:modelValue": t[0] ||= (e) => p.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Xo,
						p.value,
						void 0,
						{ lazy: !0 }
					]]), U(mb, {
						modelValue: f.value,
						"onUpdate:modelValue": t[1] ||= (e) => f.value = e,
						label: N(J)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), N(zm).error ? (z(), B("span", YC, k(N(zm).error), 1)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U(Py, {
				title: N(J)("debug.assembly"),
				icon: N(dv),
				collapsible: ""
			}, {
				default: P(() => [n.value ? (z(), B(R, { key: 0 }, [
					H("div", XC, [
						H("span", ZC, k(N(J)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (z(), B("span", QC, k(n.value.workflow), 1)) : W("", !0),
						H("span", $C, k(n.value.origin), 1),
						n.value.dryRun ? (z(), B("span", ew, "dry run")) : W("", !0),
						t[3] ||= H("span", { class: "grow" }, null, -1),
						ua(k(l(n.value.at)), 1)
					]),
					H("div", null, [(z(!0), B(R, null, L(n.value.regions, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => i(e.id)
					}, [
						U(N($_), { class: O(["faint caret", { open: r.has(e.id) }]) }, null, 8, ["class"]),
						H("span", nw, k(e.id), 1),
						H("span", rw, k(e.messages.length) + " · " + k(a[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + k(a[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, tw), r.has(e.id) ? (z(), B(R, { key: 0 }, [(z(!0), B(R, null, L(e.messages, (e, t) => (z(), B("div", {
						key: t,
						class: "region-msg"
					}, [H("div", iw, [H("span", aw, k(e.role), 1), ua(k(e.chars) + " ch", 1)]), H("div", ow, k(e.content), 1)]))), 128)), e.messages.length ? W("", !0) : (z(), B("div", sw, k(N(J)("debug.emptyRegion")), 1))], 64)) : W("", !0)]))), 128))]),
					n.value.vars?.length ? (z(), B("div", cw, [(z(!0), B(R, null, L(n.value.vars, (e) => (z(), B("div", {
						key: e.id,
						class: "region"
					}, [H("div", {
						class: "region-head",
						onClick: (t) => i(`var:${e.id}`)
					}, [
						U(N($_), { class: O(["faint caret", { open: r.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						H("span", uw, k(e.id), 1),
						H("span", dw, k(e.text.length) + " ch", 1)
					], 8, lw), r.has(`var:${e.id}`) ? (z(), B("div", fw, [H("div", pw, k(e.text), 1), e.text ? W("", !0) : (z(), B("div", mw, k(N(J)("debug.emptyRegion")), 1))])) : W("", !0)]))), 128))])) : W("", !0),
					n.value.warnings.length ? (z(), B("div", hw, k(n.value.warnings.join(" · ")), 1)) : W("", !0)
				], 64)) : (z(), B("div", gw, k(N(J)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Py, {
				title: N(J)("debug.requests"),
				icon: N(iv),
				collapsible: ""
			}, {
				default: P(() => [(z(!0), B(R, null, L(N(uf).requests, (e, t) => (z(), B("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [H("div", {
					class: "row small clickable",
					onClick: (e) => o.value = o.value === t ? null : t
				}, [
					H("span", vw, k(e.genId) + " · #" + k(e.step), 1),
					e.error ? (z(), B("span", yw, k(N(J)("debug.error")), 1)) : W("", !0),
					H("span", bw, k(d(e.usage)), 1),
					H("span", xw, k(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, _w), o.value === t ? (z(), B(R, { key: 0 }, [
					H("div", Sw, [H("span", Cw, k(N(J)("debug.request")), 1), U($, {
						icon: N(sv),
						label: N(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", ww, k(s(e.request)), 1),
					H("div", Tw, [H("span", Ew, k(N(J)("debug.response")), 1), U($, {
						icon: N(sv),
						label: N(J)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					H("pre", Dw, k(e.error ?? s(e.response ?? "")), 1)
				], 64)) : W("", !0)]))), 128)), N(uf).requests.length ? W("", !0) : (z(), B("div", Ow, k(N(J)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Py, {
				title: N(J)("debug.log"),
				icon: N(Fv),
				collapsible: "",
				open: !1
			}, {
				actions: P(() => [U($, {
					icon: N(Vv),
					label: N(J)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => N(uf).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: P(() => [(z(!0), B(R, null, L(m.value, (e, n) => (z(), B("div", {
					key: n,
					class: "req"
				}, [H("div", kw, [
					H("span", Aw, k(e.kind), 1),
					t[4] ||= H("span", { class: "grow" }, null, -1),
					H("span", jw, k(l(e.at)), 1)
				]), H("pre", Mw, k(s(e.data)), 1)]))), 128)), m.value.length ? W("", !0) : (z(), B("div", Nw, k(N(J)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U(Py, {
				title: N(J)("debug.annotations"),
				icon: N(Sv),
				help: N(J)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: P(() => [(z(!0), B(R, null, L(h.value, (e, t) => (z(), B("div", {
					key: t,
					class: "req"
				}, [H("div", Pw, [H("span", Fw, "#" + k(e.mesId), 1), H("span", Iw, "“" + k(e.quote) + "”", 1)]), H("div", Lw, k(e.comment), 1)]))), 128)), h.value.length ? W("", !0) : (z(), B("div", Rw, k(N(J)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H("div", zw, "Advanced Preset " + k(N("1.6.0")) + " · " + k(N("e281ea48d45fec07")), 1)
		], 64));
	}
}), Vw = ["aria-label"], Hw = { class: "panel-head" }, Uw = { class: "panel-logo" }, Ww = { class: "grow" }, Gw = { class: "panel-title ellipsis" }, Kw = { class: "panel-sub ellipsis" }, qw = {
	class: "tabs",
	role: "tablist"
}, Jw = [
	"title",
	"aria-selected",
	"onClick"
], Yw = { class: "panel-body scroll" }, Xw = /* @__PURE__ */ I({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Tv,
				view: zb
			},
			{
				id: "config",
				icon: Rv,
				view: px
			},
			{
				id: "modules",
				icon: K_,
				view: fC
			},
			{
				id: "writing",
				icon: Dv,
				view: EC
			},
			{
				id: "memory",
				icon: J_,
				view: KC
			},
			{
				id: "debug",
				icon: Y_,
				view: Bw
			}
		], n = G(() => t.find((e) => e.id === X.tab) ?? t[0]), r = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		}), i = G(() => {
			let e = oh.value;
			return e ? `v${e.version} · ${sh.value.config}` : J("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && X.panelOpen && (X.panelOpen = !1);
		};
		return Rr(() => document.addEventListener("keydown", a)), Br(() => document.removeEventListener("keydown", a)), (e, a) => (z(), V(Qa, { name: "panel" }, {
			default: P(() => [N(X).panelOpen ? (z(), B("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": N(J)("app.name")
			}, [
				H("header", Hw, [
					H("div", Uw, [U(N(_v))]),
					H("div", Ww, [H("div", Gw, k(N(oh) ? N(Mu)(N(oh)) : N(J)("app.name")), 1), H("div", Kw, k(i.value), 1)]),
					U(mb, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: N(J)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					U($, {
						icon: N(qv),
						label: N(J)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => N(X).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				H("nav", qw, [(z(), B(R, null, L(t, (e) => H("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: O(["tab", { on: e.id === N(X).tab }]),
					title: N(J)(`tab.${e.id}`),
					"aria-selected": e.id === N(X).tab,
					onClick: (t) => N(X).tab = e.id
				}, [(z(), V(Ur(e.icon))), H("span", null, k(N(J)(`tab.${e.id}`)), 1)], 10, Jw)), 64))]),
				H("main", Yw, [(z(), V(Mr, null, [(z(), V(Ur(n.value.view), { key: n.value.id }))], 1024))])
			], 8, Vw)) : W("", !0)]),
			_: 1
		}));
	}
}), Zw = { class: "inline-drawer" }, Qw = { class: "inline-drawer-toggle inline-drawer-header" }, $w = { class: "inline-drawer-content" }, eT = { class: "flex-container alignItemsCenter spaceBetween" }, tT = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, nT = { key: 0 }, rT = { class: "text_muted" }, iT = {
	key: 1,
	class: "text_muted"
}, aT = /* @__PURE__ */ I({
	__name: "SettingsDrawer",
	setup(e) {
		let t = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		});
		return (e, n) => (z(), B("div", Zw, [H("div", Qw, [H("b", null, k(N(J)("app.name")), 1), n[3] ||= H("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), H("div", $w, [
			H("div", eT, [H("label", tT, [F(H("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Zo, t.value]]), H("span", null, k(N(J)("settings.enable")), 1)]), H("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => N(uh)(),
				onKeydown: n[2] ||= cs((e) => N(uh)(), ["enter"])
			}, [n[4] ||= H("i", { class: "fa-solid fa-layer-group" }, null, -1), H("span", null, k(N(J)("panel.open")), 1)], 32)]),
			n[5] ||= H("hr", null, null, -1),
			H("h4", null, k(N(J)("settings.preset")), 1),
			N(oh) ? (z(), B("div", nT, [ua(k(N(Mu)(N(oh))) + " ", 1), H("span", rT, "v" + k(N(oh).version) + " · " + k(N(sh).config), 1)])) : (z(), B("i", iT, k(N(J)("settings.inactive")), 1))
		])]));
	}
}), oT = {
	key: 0,
	class: "preset-banner"
}, sT = { class: "preset-banner-text" }, cT = /* @__PURE__ */ I({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => N(oh) ? (z(), B("div", oT, [
			U(N(_v), { class: "preset-banner-icon" }),
			H("span", sT, k(N(J)("banner.usesAp")), 1),
			H("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => N(uh)()
			}, k(N(J)("panel.open")), 1)
		])) : W("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function lT() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), fs(aT).mount(t);
}
function uT() {
	Fh("ap-stages", fy, ["mesid"]), Fh("ap-cards", ob, ["mesid"]), Fh("ap-dock", db), Fh("ap-panel", Xw), Fh("ap-preset-banner", cT), Nh(), ah();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, ah);
	P_(), lT(), T_(), p_();
}
//#endregion
//#region src/index.ts
var dT = {
	version: "1.6.0",
	buildId: "e281ea48d45fec07",
	nextGeneration: (e) => Od(e),
	listPresets: () => yu().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => $u(),
	update: Lm,
	togglePanel: (e) => {
		X.panelOpen = e ?? !X.panelOpen;
	},
	annotations: jm
};
globalThis.advancedPresetInterceptor = lf, window.AdvancedPreset = dT;
function fT(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function pT() {
	for (let { preset: e } of yu()) try {
		await id(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function mT() {
	let { eventSource: t, eventTypes: n } = e();
	K(), xm(), Xm(), _h(), Am(), await i(), await _u();
	for (let { preset: e } of yu()) {
		let t = qu(e);
		t.length && ff("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => wf(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Sm(e)), t.on(n.MESSAGE_RECEIVED, (e, t) => Tm(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Rd.setPending(null), Rd.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Rd.sweep());
	let r = fT(() => {
		let e = $u(), t = e ? Cu(e) : void 0;
		t && cd(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await pT(), Wm(), Fm();
	};
	t.on(n.APP_READY, () => void a()), uT(), ff("init", {
		version: "1.6.0",
		build: "e281ea48d45fec07",
		enabled: K().enabled
	});
}
var hT = Im, gT = l_;
mT().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { hT as advancedPresetOnUpdate, gT as advancedPresetRegisterChatSurface };

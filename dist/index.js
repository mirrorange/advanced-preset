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
var g = {}, _ = [], v = () => {}, y = () => !1, b = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), x = (e) => e.startsWith("onUpdate:"), S = Object.assign, C = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ee = Object.prototype.hasOwnProperty, w = (e, t) => ee.call(e, t), T = Array.isArray, te = (e) => ce(e) === "[object Map]", ne = (e) => ce(e) === "[object Set]", re = (e) => ce(e) === "[object Date]", ie = (e) => ce(e) === "[object RegExp]", E = (e) => typeof e == "function", D = (e) => typeof e == "string", ae = (e) => typeof e == "symbol", O = (e) => typeof e == "object" && !!e, oe = (e) => (O(e) || E(e)) && E(e.then) && E(e.catch), se = Object.prototype.toString, ce = (e) => se.call(e), le = (e) => ce(e).slice(8, -1), ue = (e) => ce(e) === "[object Object]", de = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, fe = /* @__PURE__ */ h(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), pe = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, me = /-\w/g, he = pe((e) => e.replace(me, (e) => e.slice(1).toUpperCase())), ge = /\B([A-Z])/g, _e = pe((e) => e.replace(ge, "-$1").toLowerCase()), ve = pe((e) => e.charAt(0).toUpperCase() + e.slice(1)), ye = pe((e) => e ? `on${ve(e)}` : ""), k = (e, t) => !Object.is(e, t), be = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, xe = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Se = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Ce = (e) => {
	let t = D(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, we, Te = () => we ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ee(e) {
	if (T(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = D(r) ? Ae(r) : Ee(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (D(e) || O(e)) return e;
}
var De = /;(?![^(]*\))/g, Oe = /:([^]+)/, ke = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ae(e) {
	let t = {};
	return e.replace(ke, (e) => e.startsWith("/*") ? "" : e).split(De).forEach((e) => {
		if (e) {
			let n = e.split(Oe);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (D(e)) t = e;
	else if (T(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (O(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var je = /* @__PURE__ */ h("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Me(e) {
	return !!e || e === "";
}
function Ne(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Le(e[i], t[i], n);
	return r;
}
function Pe(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Le(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Fe(e, t, n) {
	let r = te(e), i = te(t);
	if (r || i || (r = ne(e), i = ne(t), r || i)) return r && i ? Pe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Le(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ie(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Le(e, t, n) {
	if (e === t) return !0;
	let r = re(e), i = re(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = ae(e), i = ae(t), r || i ? e === t : (r = T(e), i = T(t), r || i ? r && i ? Ie(e, t, n, Ne) : !1 : (r = O(e), i = O(t), r || i ? !r || !i ? !1 : Ie(e, t, n, Fe) : String(e) === String(t))));
}
function Re(e, t) {
	return e.findIndex((e) => Le(e, t));
}
var ze = (e) => !!(e && e.__v_isRef === !0), j = (e) => D(e) ? e : e == null ? "" : T(e) || O(e) && (e.toString === se || !E(e.toString)) ? ze(e) ? j(e.value) : JSON.stringify(e, Be, 2) : String(e), Be = (e, t) => ze(t) ? Be(e, t.value) : te(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ve(t, r) + " =>"] = n, e), {}) } : ne(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ve(e)) } : ae(t) ? Ve(t) : O(t) && !T(t) && !ue(t) ? String(t) : t, Ve = (e, t = "") => ae(e) ? `Symbol(${e.description ?? t})` : e, He, Ue = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && He && (He.active ? (this.parent = He, this.index = (He.scopes || (He.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = He;
			try {
				return He = this, e();
			} finally {
				He = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = He, He = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (He === this) He = this.prevScope;
			else {
				let e = He;
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
function We() {
	return He;
}
var M, Ge = /* @__PURE__ */ new WeakSet(), Ke = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, He && (He.active ? He.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Ge.has(this) && (Ge.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Xe(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, lt(this), $e(this);
		let e = M, t = at;
		M = this, at = !0;
		try {
			return this.fn();
		} finally {
			et(this), M = e, at = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) rt(e);
			this.deps = this.depsTail = void 0, lt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Ge.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		tt(this) && this.run();
	}
	get dirty() {
		return tt(this);
	}
}, qe = 0, Je, Ye;
function Xe(e, t = !1) {
	e.flags |= 8, t ? (e.next = Ye, Ye = e) : (e.next = Je, Je = e);
}
function Ze() {
	qe++;
}
function Qe() {
	if (--qe > 0) return;
	if (Ye) {
		let e = Ye;
		for (Ye = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Je;) {
		let t = Je;
		for (Je = void 0; t;) {
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
function $e(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function et(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), rt(r), it(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function tt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (nt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function nt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === ut) || (e.globalVersion = ut, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !tt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = at;
	M = e, at = !0;
	try {
		$e(e);
		let n = e.fn(e._value);
		(t.version === 0 || k(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, at = r, et(e), e.flags &= -3;
	}
}
function rt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) rt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function it(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var at = !0, ot = [];
function st() {
	ot.push(at), at = !1;
}
function ct() {
	let e = ot.pop();
	at = e === void 0 || e;
}
function lt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = M;
		M = void 0;
		try {
			t();
		} finally {
			M = e;
		}
	}
}
var ut = 0, dt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, ft = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !at || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new dt(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, pt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, ut++, this.notify(e);
	}
	notify(e) {
		Ze();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Qe();
		}
	}
};
function pt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) pt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var mt = /* @__PURE__ */ new WeakMap(), ht = /* @__PURE__ */ Symbol(""), gt = /* @__PURE__ */ Symbol(""), _t = /* @__PURE__ */ Symbol("");
function vt(e, t, n) {
	if (at && M) {
		let t = mt.get(e);
		t || mt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new ft()), r.map = t, r.key = n), r.track();
	}
}
function yt(e, t, n, r, i, a) {
	let o = mt.get(e);
	if (!o) {
		ut++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ze(), t === "clear") o.forEach(s);
	else {
		let i = T(e), a = i && de(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === _t || !ae(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(_t)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(ht)), te(e) && s(o.get(gt)));
				break;
			case "delete":
				i || (s(o.get(ht)), te(e) && s(o.get(gt)));
				break;
			case "set": te(e) && s(o.get(ht));
		}
	}
	Qe();
}
function bt(e) {
	let t = /* @__PURE__ */ N(e);
	return t === e || (vt(t, "iterate", _t), /* @__PURE__ */ sn(e)) ? t : /* @__PURE__ */ on(e) ? /* @__PURE__ */ an(e) ? t.map((e) => dn(un(e))) : t.map(dn) : t.map(un);
}
function xt(e) {
	return vt(e = /* @__PURE__ */ N(e), "iterate", _t), e;
}
function St(e, t) {
	return /* @__PURE__ */ on(e) ? dn(/* @__PURE__ */ an(e) ? un(t) : t) : un(t);
}
var Ct = {
	__proto__: null,
	[Symbol.iterator]() {
		return wt(this, Symbol.iterator, (e) => St(this, e));
	},
	concat(...e) {
		return bt(this).concat(...e.map((e) => T(e) ? bt(e) : e));
	},
	entries() {
		return wt(this, "entries", (e) => (e[1] = St(this, e[1]), e));
	},
	every(e, t) {
		return Dt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Dt(this, "filter", e, t, (e) => e.map((e) => St(this, e)), arguments);
	},
	find(e, t) {
		return Dt(this, "find", e, t, (e) => St(this, e), arguments);
	},
	findIndex(e, t) {
		return Dt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Dt(this, "findLast", e, t, (e) => St(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Dt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Dt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return kt(this, "includes", e);
	},
	indexOf(...e) {
		return kt(this, "indexOf", e);
	},
	join(e) {
		return bt(this).join(e);
	},
	lastIndexOf(...e) {
		return kt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Dt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return At(this, "pop");
	},
	push(...e) {
		return At(this, "push", e);
	},
	reduce(e, ...t) {
		return Ot(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Ot(this, "reduceRight", e, t);
	},
	shift() {
		return At(this, "shift");
	},
	some(e, t) {
		return Dt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return At(this, "splice", e);
	},
	toReversed() {
		return bt(this).toReversed();
	},
	toSorted(e) {
		return bt(this).toSorted(e);
	},
	toSpliced(...e) {
		return bt(this).toSpliced(...e);
	},
	unshift(...e) {
		return At(this, "unshift", e);
	},
	values() {
		return wt(this, "values", (e) => St(this, e));
	}
};
function wt(e, t, n) {
	let r = xt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ sn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Tt(a.next(), n), i !== Et[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Tt(a._next(), n);
	}
	return a;
}
function Tt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Et = Array.prototype;
function Dt(e, t, n, r, i, a) {
	let o = xt(e), s = o !== e && !/* @__PURE__ */ sn(e), c = o[t];
	if (c !== Et[t]) {
		let t = c.apply(e, a);
		return s ? un(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, St(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Ot(e, t, n, r) {
	let i = xt(e), a = i !== e && !/* @__PURE__ */ sn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = St(e, t)), n.call(this, t, St(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? St(e, c) : c;
}
function kt(e, t, n) {
	let r = /* @__PURE__ */ N(e);
	vt(r, "iterate", _t);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ cn(n[0]) ? (n[0] = /* @__PURE__ */ N(n[0]), r[t](...n)) : i;
}
function At(e, t, n = []) {
	st(), Ze();
	let r = (/* @__PURE__ */ N(e))[t].apply(e, n);
	return Qe(), ct(), r;
}
var jt = /* @__PURE__ */ h("__proto__,__v_isRef,__isVue"), Mt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(ae));
function Nt(e) {
	ae(e) || (e = String(e));
	let t = /* @__PURE__ */ N(this);
	return vt(t, "has", e), t.hasOwnProperty(e);
}
var Pt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Qt : Zt : i ? Xt : Yt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = T(e);
		if (!r) {
			let e;
			if (a && (e = Ct[t])) return e;
			if (t === "hasOwnProperty") return Nt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ P(e) ? e : n);
		if ((ae(t) ? Mt.has(t) : jt(t)) || (r || vt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ P(o)) {
			let e = a && de(t) ? o : o.value;
			return r && O(e) ? /* @__PURE__ */ nn(e) : e;
		}
		return O(o) ? r ? /* @__PURE__ */ nn(o) : /* @__PURE__ */ en(o) : o;
	}
}, Ft = class extends Pt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = T(e) && de(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ on(i);
			if (!/* @__PURE__ */ sn(n) && !/* @__PURE__ */ on(n) && (i = /* @__PURE__ */ N(i), n = /* @__PURE__ */ N(n)), !a && /* @__PURE__ */ P(i) && !/* @__PURE__ */ P(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : w(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ P(e) ? e : r);
		return e === /* @__PURE__ */ N(r) && s && (o ? k(n, i) && yt(e, "set", t, n, i) : yt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = w(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && yt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!ae(t) || !Mt.has(t)) && vt(e, "has", t), n;
	}
	ownKeys(e) {
		return vt(e, "iterate", T(e) ? "length" : ht), Reflect.ownKeys(e);
	}
}, It = class extends Pt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Lt = /* @__PURE__ */ new Ft(), Rt = /* @__PURE__ */ new It(), zt = /* @__PURE__ */ new Ft(!0), Bt = (e) => e, Vt = (e) => Reflect.getPrototypeOf(e);
function Ht(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ N(i), o = te(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Bt : t ? dn : un;
		return !t && vt(a, "iterate", c ? gt : ht), S(Object.create(l), { next() {
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
function Ut(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Wt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ N(r), a = /* @__PURE__ */ N(n);
			e || (k(n, a) && vt(i, "get", n), vt(i, "get", a));
			let { has: o } = Vt(i), s = t ? Bt : e ? dn : un;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && vt(/* @__PURE__ */ N(t), "iterate", ht), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ N(n), i = /* @__PURE__ */ N(t);
			return e || (k(t, i) && vt(r, "has", t), vt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ N(a), s = t ? Bt : e ? dn : un;
			return !e && vt(o, "iterate", ht), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return S(n, e ? {
		add: Ut("add"),
		set: Ut("set"),
		delete: Ut("delete"),
		clear: Ut("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ N(this), r = Vt(n), i = /* @__PURE__ */ N(e), a = !t && !/* @__PURE__ */ sn(e) && !/* @__PURE__ */ on(e) ? i : e;
			return r.has.call(n, a) || k(e, a) && r.has.call(n, e) || k(i, a) && r.has.call(n, i) || (n.add(a), yt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ sn(n) && !/* @__PURE__ */ on(n) && (n = /* @__PURE__ */ N(n));
			let r = /* @__PURE__ */ N(this), { has: i, get: a } = Vt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ N(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? k(n, s) && yt(r, "set", e, n, s) : yt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ N(this), { has: n, get: r } = Vt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ N(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && yt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ N(this), t = e.size !== 0, n = e.clear();
			return t && yt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ht(r, e, t);
	}), n;
}
function Gt(e, t) {
	let n = Wt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(w(n, i) && i in r ? n : r, i, a);
}
var Kt = { get: /* @__PURE__ */ Gt(!1, !1) }, qt = { get: /* @__PURE__ */ Gt(!1, !0) }, Jt = { get: /* @__PURE__ */ Gt(!0, !1) }, Yt = /* @__PURE__ */ new WeakMap(), Xt = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap();
function $t(e) {
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
function en(e) {
	return /* @__PURE__ */ on(e) ? e : rn(e, !1, Lt, Kt, Yt);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	return rn(e, !1, zt, qt, Xt);
}
// @__NO_SIDE_EFFECTS__
function nn(e) {
	return rn(e, !0, Rt, Jt, Zt);
}
function rn(e, t, n, r, i) {
	if (!O(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = $t(le(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function an(e) {
	return /* @__PURE__ */ on(e) ? /* @__PURE__ */ an(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function on(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ N(t) : e;
}
function ln(e) {
	return !w(e, "__v_skip") && Object.isExtensible(e) && xe(e, "__v_skip", !0), e;
}
var un = (e) => O(e) ? /* @__PURE__ */ en(e) : e, dn = (e) => O(e) ? /* @__PURE__ */ nn(e) : e;
// @__NO_SIDE_EFFECTS__
function P(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return pn(e, !1);
}
function pn(e, t) {
	return /* @__PURE__ */ P(e) ? e : new mn(e, t);
}
var mn = class {
	constructor(e, t) {
		this.dep = new ft(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ N(e), this._value = t ? e : un(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ sn(e) || /* @__PURE__ */ on(e);
		e = n ? e : /* @__PURE__ */ N(e), k(e, t) && (this._rawValue = e, this._value = n ? e : un(e), this.dep.trigger());
	}
};
function F(e) {
	return /* @__PURE__ */ P(e) ? e.value : e;
}
var hn = {
	get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ P(i) && !/* @__PURE__ */ P(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function gn(e) {
	return /* @__PURE__ */ an(e) ? e : new Proxy(e, hn);
}
var _n = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new ft(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function vn(e) {
	return new _n(e);
}
var yn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new ft(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = ut - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Xe(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return nt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function bn(e, t, n = !1) {
	let r, i;
	return E(e) ? r = e : (r = e.get, i = e.set), new yn(r, i, n);
}
var xn = {}, Sn = /* @__PURE__ */ new WeakMap(), Cn = void 0;
function wn(e, t = !1, n = Cn) {
	if (n) {
		let t = Sn.get(n);
		t || Sn.set(n, t = []), t.push(e);
	}
}
function Tn(e, t, n = g) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ sn(e) || i === !1 || i === 0 ? En(e, 1) : En(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ P(e) ? (d = () => e.value, m = /* @__PURE__ */ sn(e)) : /* @__PURE__ */ an(e) ? (d = () => l(e), m = !0) : T(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ an(e) || /* @__PURE__ */ sn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ P(e)) return e.value;
		if (/* @__PURE__ */ an(e)) return l(e);
		if (E(e)) return c ? c(e, 2) : e();
	})) : d = E(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			st();
			try {
				f();
			} finally {
				ct();
			}
		}
		let t = Cn;
		Cn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Cn = t;
		}
	} : v, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => En(e(), t);
	}
	let _ = We(), y = () => {
		u.stop(), _ && _.active && C(_.effects, u);
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
	let b = h ? Array(e.length).fill(xn) : xn, x = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => k(e, b[t])) : k(n, b))) {
					let e = Cn;
					st();
					try {
						f && f(), Cn = u;
						let e = [
							n,
							b === xn ? void 0 : h && b[0] === xn ? [] : b,
							p
						];
						b = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Cn = e, ct();
					}
				}
			} else u.run();
		}
	};
	return s && s(x), u = new Ke(d), u.scheduler = o ? () => o(x, !1) : x, p = (e) => wn(e, !1, u), f = u.onStop = () => {
		let e = Sn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Sn.delete(u);
		}
	}, t ? r ? x(!0) : b = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), y.pause = u.pause.bind(u), y.resume = u.resume.bind(u), y.stop = y, y;
}
function En(e, t = Infinity, n) {
	if (t <= 0 || !O(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ P(e)) En(e.value, t, n);
	else if (T(e)) for (let r = 0; r < e.length; r++) En(e[r], t, n);
	else if (ne(e) || te(e)) e.forEach((e) => {
		En(e, t, n);
	});
	else if (ue(e)) {
		for (let r in e) En(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && En(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Dn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		kn(e, t, n);
	}
}
function On(e, t, n, r) {
	if (E(e)) {
		let i = Dn(e, t, n, r);
		return i && oe(i) && i.catch((e) => {
			kn(e, t, n);
		}), i;
	}
	if (T(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(On(e[a], t, n, r));
		return i;
	}
}
function kn(e, t, n, r = !0) {
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
			st(), Dn(a, null, 10, [
				e,
				i,
				o
			]), ct();
			return;
		}
	}
	An(e, n, i, r, o);
}
function An(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var jn = [], Mn = -1, Nn = [], Pn = null, Fn = 0, In = /* @__PURE__ */ Promise.resolve(), Ln = null;
function Rn(e) {
	let t = Ln || In;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function zn(e) {
	let t = Mn + 1, n = jn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = jn[r], a = qn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Bn(e) {
	if (!(e.flags & 1)) {
		let t = qn(e), n = jn[jn.length - 1];
		!n || !(e.flags & 2) && t >= qn(n) ? jn.push(e) : jn.splice(zn(t), 0, e), e.flags |= 1, Vn();
	}
}
function Vn() {
	Ln ||= In.then(Jn);
}
function Hn(e) {
	if (!T(e)) Pn && e.id === -1 ? Pn.splice(Fn + 1, 0, e) : e.flags & 1 || (Nn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Nn.push(e[t]);
	Vn();
}
function Un(e, t, n, r = Mn + 1) {
	for (; r < jn.length; r++) {
		let n = jn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			jn.splice(r, 1), r = e ? r - 1 : Mn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Wn(e, t, n = 0) {
	if (Nn.length) {
		let e = Nn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Nn.length; i++) {
				let a = Nn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Nn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => qn(e) - qn(t));
		if (Nn.length = r, Pn) {
			for (let e = 0; e < i.length; e++) Pn.push(i[e]);
			return;
		}
		for (Pn = i, Fn = 0; Fn < Pn.length; Fn++) {
			let e = Pn[Fn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Pn = null, Fn = 0;
	}
}
var Gn = !1;
function Kn(e, t) {
	if (Gn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Nn);
	e(), Gn = !0;
	try {
		Un(void 0, t), Wn(void 0, n, t);
	} finally {
		Gn = !1;
	}
}
var qn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Jn(e) {
	try {
		for (Mn = 0; Mn < jn.length; Mn++) {
			let e = jn[Mn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Dn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Mn < jn.length; Mn++) {
			let e = jn[Mn];
			e && (e.flags &= -2);
		}
		Mn = -1, jn.length = 0, Wn(e), Ln = null, (jn.length || Nn.length) && Jn(e);
	}
}
var Yn = null, Xn = null;
function Zn(e) {
	let t = Yn;
	return Yn = e, Xn = e && e.type.__scopeId || null, t;
}
function I(e, t = Yn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && $i(-1);
		let i = Zn(t), a = Yi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Yi.length; e > a; e--) Zi();
			Zn(i), r._d && $i(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Qn(e, t) {
	if (Yn === null) return e;
	let n = Ma(Yn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = g] = t[e];
		i && (E(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && En(a), r.push({
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
function $n(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (st(), On(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), ct());
	}
}
function er(e, t, n = !1) {
	let r = ya();
	if (r || ni) {
		let i = ni ? ni._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && E(t) ? t.call(r && r.proxy) : t;
	}
}
var tr = /* @__PURE__ */ Symbol.for("v-scx"), nr = () => er(tr);
function rr(e, t) {
	return or(e, null, t);
}
function ir(e, t) {
	return or(e, null, { flush: "sync" });
}
function ar(e, t, n) {
	return or(e, t, n);
}
function or(e, t, n = g) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = S({}, n), c = t && r || !t && a !== "post", l;
	if (Ta) {
		if (a === "sync") {
			let e = nr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = v, e.resume = v, e.pause = v, e;
		}
	}
	let u = va;
	s.call = (e, t, n) => On(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Ni(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Bn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Tn(e, t, s);
	return Ta && (l ? l.push(f) : c && f()), f;
}
var sr = /* @__PURE__ */ Symbol("_vte"), cr = (e) => e.__isTeleport, lr = /* @__PURE__ */ Symbol("_leaveCb"), ur = /* @__PURE__ */ Symbol("_enterCb");
function dr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Lr(() => {
		e.isMounted = !0;
	}), zr(() => {
		e.isUnmounting = !0;
	}), e;
}
var fr = [Function, Array], pr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: fr,
	onEnter: fr,
	onAfterEnter: fr,
	onEnterCancelled: fr,
	onBeforeLeave: fr,
	onLeave: fr,
	onAfterLeave: fr,
	onLeaveCancelled: fr,
	onBeforeAppear: fr,
	onAppear: fr,
	onAfterAppear: fr,
	onAppearCancelled: fr
}, mr = {
	name: "BaseTransition",
	props: pr,
	setup(e, { slots: t }) {
		let n = ya(), r = dr();
		return () => {
			let i = t.default && Sr(t.default(), !0), a = i && i.length ? hr(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ N(e), { mode: s } = o;
			if (r.isLeaving) return yr(a);
			let c = br(a);
			if (!c) return yr(a);
			let l = vr(c, o, r, n, (e) => l = e);
			c.type !== qi && xr(c, l);
			let u = n.subTree && br(n.subTree);
			if (u && u.type !== qi && !na(u, c) && Cr(n.subTree)) {
				let e = vr(u, o, r, n);
				if (xr(u, e), s === "out-in" && c.type !== qi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, yr(a);
				s === "in-out" && c.type !== qi ? e.delayLeave = (e, t, n) => {
					let i = _r(r, u);
					i[String(u.key)] = u, e[lr] = () => {
						t(), e[lr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function hr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== qi) {
			t = n;
			break;
		}
	}
	return t;
}
var gr = mr;
function _r(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function vr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = _r(n, e), S = (e, t) => {
		e && On(e, r, 9, t);
	}, C = (e, t) => {
		let n = t[1];
		S(e, t), T(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, ee = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[lr] && t[lr](!0);
			let i = x[b];
			if (i && na(e, i)) {
				let e = i.el[lr];
				if (!e) {
					let t = Cr(i);
					e = t && t.el[lr];
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
			t[ur] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[ur] = void 0);
			};
			let c = t[ur].bind(null, !1);
			r ? C(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[ur] && t[ur](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[lr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[lr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[lr].bind(null, !1);
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = vr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
}
function yr(e) {
	if (Ar(e)) return e = sa(e), e.children = null, e;
}
function br(e) {
	if (!Ar(e)) return cr(e.type) && e.children ? hr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && E(n.default)) return n.default();
	}
}
function xr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		xr(cr(n.type) && br(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === z && T(e.children)) {
		let n = li(e.children, !1);
		n && xr(n, t);
	}
}
function Sr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === z ? (o.patchFlag & 128 && i++, r = r.concat(Sr(o.children, t, s))) : (t || o.type !== qi) && r.push(s == null ? o : sa(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Cr(e) {
	if (e.component) return Cr(e.component.subTree);
	if (e.type === z) {
		let t = T(e.children) && li(e.children, !1);
		return t ? Cr(t) : void 0;
	}
	if (e.type !== qi) return e;
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return E(e) ? /* @__PURE__ */ S({ name: e.name }, t, { setup: e }) : e;
}
function wr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Tr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Er = /* @__PURE__ */ new WeakMap();
function Dr(e, t, n, r, i = !1) {
	if (T(e)) {
		e.forEach((e, a) => Dr(e, t && (T(t) ? t[a] : t), n, r, i));
		return;
	}
	if (kr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Dr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ma(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === g ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ N(d), p = d === g ? y : (e) => !Tr(u, e) && w(f, e), m = (e, t) => !(t && Tr(u, t));
	if (l != null && l !== c) {
		if (Or(t), D(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ P(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (E(c)) Dn(c, s, 12, [o, u]);
	else {
		let t = D(c), r = /* @__PURE__ */ P(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) T(n) && C(n, a);
					else if (T(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Er.delete(e);
				};
				t.id = -1, Er.set(e, t), Ni(t, n);
			} else Or(e), s();
		}
	}
}
function Or(e) {
	let t = Er.get(e);
	t && (t.flags |= 8, Er.delete(e));
}
Te().requestIdleCallback, Te().cancelIdleCallback;
var kr = (e) => !!e.type.__asyncLoader, Ar = (e) => e.type.__isKeepAlive, jr = {
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
		let n = ya(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Ni(() => {
				a.isDeactivated = !1, a.a && be(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && pa(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Hi(t.m), Hi(t.a), l(e, f, null, 1, s), Ni(() => {
				t.da && be(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && pa(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Nr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Na(kr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !na(t, o)) ? p(t) : o && (Nr(o), t && Nr(t)), i.delete(e), a.delete(e);
		}
		ar(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Mr(e, t)), t && m((e) => !Mr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Wi(n.subTree.type) ? Ni(() => {
				let e = Pr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Pr(n.subTree)));
		};
		return Lr(_), Rr(_), zr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Pr(t);
				if (e.type === i.type && e.key === i.key) {
					Nr(i);
					let e = i.component.da;
					e && Ni(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ta(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Pr(r);
			if (s.type === qi) return o = null, s;
			let c = s.type, l = Na(kr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Mr(u, l)) || d && l && Mr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = sa(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && xr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Wi(r.type) ? r : s;
		};
	}
};
function Mr(e, t) {
	return T(e) ? e.some((e) => Mr(e, t)) : D(e) ? e.split(",").includes(t) : ie(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Nr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Pr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Fr(e, t, n = va, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			st();
			let i = Sa(n), a = On(t, n, e, r);
			return i(), ct(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Ir = (e) => (t, n = va) => {
	(!Ta || e === "sp") && Fr(e, (...e) => t(...e), n);
}, Lr = Ir("m"), Rr = Ir("u"), zr = Ir("bum"), Br = "components", Vr = /* @__PURE__ */ Symbol.for("v-ndc");
function Hr(e) {
	return D(e) ? Ur(Br, e, !1) || e : e || Vr;
}
function Ur(e, t, n = !0, r = !1) {
	let i = Yn || va;
	if (i) {
		let n = i.type;
		if (e === Br) {
			let e = Na(n, !1);
			if (e && (e === t || e === he(t) || e === ve(he(t)))) return n;
		}
		let a = Wr(i[e] || n[e], t) || Wr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Wr(e, t) {
	return e && (e[t] || e[he(t)] || e[ve(he(t))]);
}
function R(e, t, n, r) {
	let i, a = n && n[r], o = T(e);
	if (o || D(e)) {
		let n = o && /* @__PURE__ */ an(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ sn(e), s = /* @__PURE__ */ on(e), e = xt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? dn(un(e[n])) : un(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (O(e)) {
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
function Gr(e, t, n, r, i, a) {
	if (n ??= {}, Yn.ce || Yn.parent && kr(Yn.parent) && Yn.parent.ce) {
		let e = a != null && n.key == null ? S({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), B(), H(z, null, [W("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Yi.length;
	B();
	let c;
	try {
		let i = o && Kr(o(n)), s = n.key || a || i && i.key;
		c = H(z, { key: (s && !ae(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Yi.length; e > s; e--) Zi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Kr(e) {
	return e.some((e) => !ta(e) || !(e.type === qi || e.type === z && !Kr(e.children))) ? e : null;
}
var qr = (e) => e ? wa(e) ? Ma(e) : qr(e.parent) : null, Jr = /* @__PURE__ */ S(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => qr(e.parent),
	$root: (e) => qr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Bn(e.update);
	},
	$nextTick: (e) => e.n ||= Rn.bind(e.proxy),
	$watch: (e) => v
}), Yr = (e, t) => e !== g && !e.__isScriptSetup && w(e, t), Xr = {
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
			else if (Yr(r, t)) return o[t] = 1, r[t];
			else if (w(a, t)) return o[t] = 3, a[t];
			else if (n !== g && w(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Jr[t], u, d;
		if (l) return t === "$attrs" && vt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== g && w(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, w(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Yr(i, t) ? (i[t] = n, !0) : w(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Yr(t, s) || w(a, s) || w(r, s) || w(Jr, s) || w(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? w(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Zr(e) {
	return T(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Qr(e, t) {
	return !e || !t ? e || t : T(e) && T(t) ? e.concat(t) : S({}, Zr(e), Zr(t));
}
function $r() {
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
var ei = 0;
function ti(e, t) {
	return function(n, r = null) {
		E(n) || (n = S({}, n)), r != null && !O(r) && (r = null);
		let i = $r(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ei++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Ia,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && E(e.install) ? (a.add(e), e.install(c, ...t)) : E(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || W(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ma(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (On(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ni;
				ni = c;
				try {
					return e();
				} finally {
					ni = t;
				}
			}
		};
		return c;
	};
}
var ni = null;
function ri(e, t, n = g) {
	let r = ya(), i = he(t), a = _e(t), o = ii(e, i), s = vn((o, s) => {
		let c, l = g, u;
		return ir(() => {
			let t = e[i];
			k(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!k(o, c) && !(l !== g && k(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), k(e, l) && (k(e, o) && !k(o, u) || f && l !== g && !k(o, c)) && s(), l = e, u = o;
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
var ii = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${he(t)}Modifiers`] || e[`${_e(t)}Modifiers`];
function ai(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || g, i = n, a = t.startsWith("update:"), o = a && ii(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => D(e) ? e.trim() : e)), o.number && (i = i.map(Se)));
	let s, c = r[s = ye(t)] || r[s = ye(he(t))];
	!c && a && (c = r[s = ye(_e(t))]), c && On(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, On(l, e, 6, i);
	}
}
function oi(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (T(a) ? a.forEach((e) => o[e] = null) : S(o, a), O(e) && r.set(e, o), o) : (O(e) && r.set(e, null), null);
}
function si(e, t) {
	return !e || !b(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), w(e, t[0].toLowerCase() + t.slice(1)) || w(e, _e(t)) || w(e, t));
}
function ci(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Zn(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = la(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = la(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : ui(s);
		}
	} catch (t) {
		Yi.length = 0, kn(t, e, 1), _ = W(qi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(x) && (v = di(v, a)), y = sa(y, v, !1, !0));
	}
	return n.dirs && (y = sa(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && xr(cr(y.type) && br(y) || y, n.transition), _ = y, Zn(g), _;
}
function li(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ta(r)) {
			if (r.type !== qi || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var ui = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || b(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, di = (e, t) => {
	let n = {};
	for (let r in e) (!x(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function fi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? pi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (mi(o, r, n) && !si(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || pi(r, o, l) : !!o;
	return !1;
}
function pi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!w(e, a) || mi(t, e, a) && !si(n, a)) return !0;
	}
	return !1;
}
function mi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && O(r) && O(i) ? !Le(r, i) : r !== i;
}
function hi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var gi = {}, _i = () => Object.create(gi), vi = (e) => Object.getPrototypeOf(e) === gi;
function yi(e, t, n, r = !1) {
	let i = {}, a = _i();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), xi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ tn(i) : e.type.props ? i : a, e.attrs = a;
}
function bi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ N(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (si(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (w(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = he(o);
						i[t] = Si(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		xi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !w(t, a) && ((r = _e(a)) === a || !w(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Si(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !w(t, e)) && (delete a[e], l = !0);
	}
	l && yt(e.attrs, "set", "");
}
function xi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (fe(c)) continue;
		let l = t[c], u;
		i && w(i, u = he(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : si(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ N(n), r = s || g;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Si(i, t, s, r[s], e, !w(r, s));
		}
	}
	return o;
}
function Si(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = w(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && E(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Sa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === _e(n)) && (r = !0));
	}
	return r;
}
function Ci(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return O(e) && r.set(e, _), _;
	if (T(a)) for (let e = 0; e < a.length; e++) {
		let t = he(a[e]);
		wi(t) && (o[t] = g);
	}
	else if (a) for (let e in a) {
		let t = he(e);
		if (wi(t)) {
			let n = a[e], r = o[t] = T(n) || E(n) ? { type: n } : S({}, n), i = r.type, c = !1, l = !0;
			if (T(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = E(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = E(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || w(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return O(e) && r.set(e, c), c;
}
function wi(e) {
	return e[0] !== "$" && !fe(e);
}
var Ti = (e) => e === "_" || e === "_ctx" || e === "$stable", Ei = (e) => T(e) ? e.map(la) : [la(e)], Di = (e, t, n) => {
	if (t._n) return t;
	let r = I((...e) => Ei(t(...e)), n);
	return r._c = !1, r;
}, Oi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Ti(n)) continue;
		let i = e[n];
		if (E(i)) t[n] = Di(n, i, r);
		else if (i != null) {
			let e = Ei(i);
			t[n] = () => e;
		}
	}
}, ki = (e, t) => {
	let n = Ei(t);
	e.slots.default = () => n;
}, Ai = (e, t, n) => {
	for (let r in t) (n || !Ti(r)) && (e[r] = t[r]);
}, ji = (e, t, n) => {
	let r = e.slots = _i();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ai(r, t, n), n && xe(r, "_", e, !0)) : Oi(t, r);
	} else t && ki(e, t);
}, Mi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = g;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ai(i, t, n) : (a = !t.$stable, Oi(t, i)), o = t;
	} else t && (ki(e, t), o = { default: 1 });
	if (a) for (let e in i) !Ti(e) && o[e] == null && delete i[e];
}, Ni = Gi;
function Pi(e) {
	return Fi(e);
}
function Fi(e, t) {
	let n = Te();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = v, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !na(e, t) && (r = ve(e), pe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === _ && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ki:
				y(e, t, n, r);
				break;
			case qi:
				b(e, t, n, r);
				break;
			case Ji:
				e ?? x(t, n, r, o);
				break;
			case z:
				E(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? ee(e, t, n, r, i, a, o, s, c) : d & 6 ? D(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, k);
		}
		u != null && i ? Dr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Dr(e.ref, null, a, e, !0);
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
	}, C = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, ee = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) w(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, w = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, Ii(e, c), l, d), _ && $n(e, null, i, "created"), T(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !fe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && pa(p, i, e);
		}
		_ && $n(e, null, i, "beforeMount");
		let v = Ri(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Ni(() => {
			try {
				p && pa(p, i, e), v && g.enter(f), _ && $n(e, null, i, "mounted");
			} finally {}
		}, s);
	}, T = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Wi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				T(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? ua(e[l]) : la(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || g, m = t.props || g, h;
		if (n && Li(n, !1), (h = m.onVnodeBeforeUpdate) && pa(h, n, t, e), f && $n(t, e, n, "beforeUpdate"), n && Li(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? re(e.dynamicChildren, d, c, n, r, Ii(t, i), o) : s || ce(e, t, c, null, n, r, Ii(t, i), o, !1), l > 0) {
			if (l & 16) ie(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && ie(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Ni(() => {
			h && pa(h, n, t, e), f && $n(t, e, n, "updated");
		}, r);
	}, re = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Ui(c), f = u && (c.type === z || !na(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ie = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== g) for (let o in t) !fe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (fe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, E = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (re(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && zi(e, t, !0)) : ce(e, t, n, f, a, o, c, l, u);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : O(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = _a(e, r, i);
		if (Ar(e) && (s.ctx.renderer = k), Ea(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, oe, o, a), !e.el) {
				let r = s.subTree = W(qi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else oe(s, e, t, n, i, a, o);
	}, O = (e, t, n) => {
		let r = t.component = e.component;
		if (fi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, se(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, oe = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Vi(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							Ni(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Li(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && be(n), (f = t.props && t.props.onVnodeBeforeUpdate) && pa(f, s, t, c), Li(e, !0);
				let p = ci(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ve(m), e, i, a), t.el = p.el, u === null && hi(e, p.el), r && Ni(r, i), (f = t.props && t.props.onVnodeUpdated) && Ni(() => pa(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = kr(t);
				if (Li(e, !1), l && be(l), !m && (o = c && c.onVnodeBeforeMount) && pa(o, d, t), Li(e, !0), s && Se) {
					let t = () => {
						e.subTree = ci(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = ci(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ni(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ni(() => pa(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && kr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ni(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ke(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Bn(u), Li(e, !0), l();
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, bi(e, t.props, r, n), Mi(e, t.children, n), st(), Un(e), ct();
	}, ce = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ue(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				le(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && _e(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ue(l, f, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, le = (e, t, n, r, i, a, o, s, c) => {
		e ||= _, t ||= _;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? ua(t[f]) : la(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? _e(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, ue = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? ua(t[l]) : la(t[l]);
			if (na(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? ua(t[f]) : la(t[f]);
			if (na(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? ua(t[l]) : la(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) pe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? ua(t[l]) : la(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let v, y = 0, b = f - m + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					pe(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (v = m; v <= f; v++) if (C[v - m] === 0 && na(r, t[v])) {
					u = v;
					break;
				}
				u === void 0 ? pe(r, i, a, !0) : (C[u - m] = l + 1, u >= S ? S = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let ee = x ? Bi(C) : _;
			for (v = ee.length - 1, l = b - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Ui(f) : r;
				C[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (v < 0 || l !== ee[v] ? de(d, n, p, 2) : v--);
			}
		}
	}, de = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, k);
		else if (c === z) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Ji) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[lr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Ni(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[lr];
					s._isLeaving && s[lr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, pe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (st(), Dr(s, null, n, e, !0), ct()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !kr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && pa(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && $n(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, k, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ni(() => {
			_ && pa(_, t, e), h && $n(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === z;
		if (o && !a) {
			he(n, r);
			return;
		}
		if (t === Ji) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Cr(e) : e, c = () => {
			o ? d(n) && he(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, he = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, ge = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Hi(c), Hi(l), r && be(r), i.stop(), a ? (a.flags |= 8, pe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, pe(o, e, t, n)), s && Ni(s, t), Ni(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) pe(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[sr];
		return n ? f(n) : t;
	}, ye = (e, t, n) => {
		Kn(() => {
			e == null ? t._vnode && pe(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ga());
	}, k = {
		p: h,
		um: pe,
		m: de,
		r: me,
		mt: ae,
		mc: te,
		pc: ce,
		pbc: re,
		n: ve,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(k)), {
		render: ye,
		hydrate: xe,
		createApp: ti(ye, xe)
	};
}
function Ii({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Li({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ri(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function zi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (T(r) && T(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = ua(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && zi(t, a)), a.type === Ki && (a.patchFlag === -1 && (a = i[e] = ua(a)), a.el = t.el), a.type === qi && !a.el && (a.el = t.el);
	}
}
function Bi(e) {
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
function Vi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Vi(t);
}
function Hi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ui(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ui(t.subTree) : null;
}
var Wi = (e) => e.__isSuspense;
function Gi(e, t) {
	t && t.pendingBranch ? T(e) ? t.effects.push(...e) : t.effects.push(e) : Hn(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Ki = /* @__PURE__ */ Symbol.for("v-txt"), qi = /* @__PURE__ */ Symbol.for("v-cmt"), Ji = /* @__PURE__ */ Symbol.for("v-stc"), Yi = [], Xi = null;
function B(e = !1) {
	Yi.push(Xi = e ? null : []);
}
function Zi() {
	Yi.pop(), Xi = Yi[Yi.length - 1] || null;
}
var Qi = 1;
function $i(e, t = !1) {
	Qi += e, e < 0 && Xi && t && (Xi.hasOnce = !0);
}
function ea(e) {
	return e.dynamicChildren = Qi > 0 ? Xi || _ : null, Zi(), Qi > 0 && Xi && Xi.push(e), e;
}
function V(e, t, n, r, i, a) {
	return ea(U(e, t, n, r, i, a, !0));
}
function H(e, t, n, r, i) {
	return ea(W(e, t, n, r, i, !0));
}
function ta(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function na(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ra = ({ key: e }) => e ?? null, ia = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : D(e) || /* @__PURE__ */ P(e) || E(e) ? {
	i: Yn,
	r: e,
	k: t,
	f: !!n
} : e);
function U(e, t = null, n = null, r = 0, i = null, a = e === z ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ra(t),
		ref: t && ia(t),
		scopeId: Xn,
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
		ctx: Yn
	};
	return s ? (da(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= D(n) ? 8 : 16), Qi > 0 && !o && Xi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Xi.push(c), c;
}
var W = aa;
function aa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Vr) && (e = qi), ta(e)) {
		let r = sa(e, t, !0);
		return n && da(r, n), Qi > 0 && !a && Xi && (r.shapeFlag & 6 ? Xi[Xi.indexOf(e)] = r : Xi.push(r)), r.patchFlag = -2, r;
	}
	if (Pa(e) && (e = e.__vccOpts), t) {
		t = oa(t);
		let { class: e, style: n } = t;
		e && !D(e) && (t.class = A(e)), O(n) && (/* @__PURE__ */ cn(n) && !T(n) && (n = S({}, n)), t.style = Ee(n));
	}
	let o = D(e) ? 1 : Wi(e) ? 128 : cr(e) ? 64 : O(e) ? 4 : E(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function oa(e) {
	return e ? /* @__PURE__ */ cn(e) || vi(e) ? S({}, e) : e : null;
}
function sa(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? fa(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ra(l),
		ref: t && t.ref ? n && a ? T(a) ? a.concat(ia(t)) : [a, ia(t)] : ia(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== z ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && sa(e.ssContent),
		ssFallback: e.ssFallback && sa(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && xr(u, c.clone(u)), u;
}
function ca(e = " ", t = 0) {
	return W(Ki, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (B(), H(qi, null, e)) : W(qi, null, e);
}
function la(e) {
	return e == null || typeof e == "boolean" ? W(qi) : T(e) ? W(z, null, e.slice()) : ta(e) ? ua(e) : W(Ki, null, String(e));
}
function ua(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : sa(e);
}
function da(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (T(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), da(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !vi(t) ? t._ctx = Yn : r === 3 && Yn && (Yn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (E(t)) {
		if (r & 65) {
			da(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Yn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [ca(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function fa(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = Ee([t.style, r.style]);
		else if (b(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(T(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !x(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function pa(e, t, n, r = null) {
	On(e, t, 7, [n, r]);
}
var ma = $r(), ha = 0;
function ga() {
	return ha;
}
function _a(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || ma, a = {
		uid: ha++,
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
		scope: new Ue(!0),
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
		propsOptions: Ci(r, i),
		emitsOptions: oi(r, i),
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ai.bind(null, a), e.ce && e.ce(a), a;
}
var va = null, ya = () => va || Yn, ba, xa;
{
	let e = Te(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ba = t("__VUE_INSTANCE_SETTERS__", (e) => va = e), xa = t("__VUE_SSR_SETTERS__", (e) => Ta = e);
}
var Sa = (e) => {
	let t = va;
	return ba(e), e.scope.on(), () => {
		e.scope.off(), ba(t);
	};
}, Ca = () => {
	va && va.scope.off(), ba(null);
};
function wa(e) {
	return e.vnode.shapeFlag & 4;
}
var Ta = !1;
function Ea(e, t = !1, n = !1) {
	t && xa(t);
	let { props: r, children: i } = e.vnode, a = wa(e);
	yi(e, r, a, t), ji(e, i, n || t);
	let o = a ? Da(e, t) : void 0;
	return t && xa(!1), o;
}
function Da(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Xr);
	let { setup: r } = n;
	if (r) {
		st();
		let n = e.setupContext = r.length > 1 ? ja(e) : null, i = Sa(e), a = Dn(r, e, 0, [e.props, n]), o = oe(a);
		if (ct(), i(), (o || e.sp) && !kr(e) && wr(e), o) {
			if (a.then(Ca, Ca), t) return a.then((n) => {
				xa(!0);
				try {
					Oa(e, n, t);
				} finally {
					xa(!1);
				}
			}).catch((t) => {
				kn(t, e, 0);
			});
			e.asyncDep = a;
		} else Oa(e, a, t);
	} else ka(e, t);
}
function Oa(e, t, n) {
	E(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : O(t) && (e.setupState = gn(t)), ka(e, n);
}
function ka(e, t, n) {
	let r = e.type;
	e.render ||= r.render || v;
}
var Aa = { get(e, t) {
	return vt(e, "get", ""), e[t];
} };
function ja(e) {
	return {
		attrs: new Proxy(e.attrs, Aa),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ma(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(gn(ln(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Jr) return Jr[n](e);
		},
		has(e, t) {
			return t in e || t in Jr;
		}
	}) : e.proxy;
}
function Na(e, t = !0) {
	return E(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Pa(e) {
	return E(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ bn(e, t, Ta);
function Fa(e, t, n) {
	try {
		$i(-1);
		let r = arguments.length;
		return r === 2 ? O(t) && !T(t) ? ta(t) ? W(e, null, [t]) : W(e, t) : W(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ta(n) && (n = [n]), W(e, t, n));
	} finally {
		$i(1);
	}
}
var Ia = "3.5.44", La = void 0, Ra = typeof window < "u" && window.trustedTypes;
if (Ra) try {
	La = /* @__PURE__ */ Ra.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var za = La ? (e) => La.createHTML(e) : (e) => e, Ba = "http://www.w3.org/2000/svg", Va = "http://www.w3.org/1998/Math/MathML", Ha = typeof document < "u" ? document : null, Ua = Ha && /* @__PURE__ */ Ha.createElement("template"), Wa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ha.createElementNS(Ba, e) : t === "mathml" ? Ha.createElementNS(Va, e) : n ? Ha.createElement(e, { is: n }) : Ha.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ha.createTextNode(e),
	createComment: (e) => Ha.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ha.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ua.innerHTML = za(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ua.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ga = "transition", Ka = "animation", qa = /* @__PURE__ */ Symbol("_vtc"), Ja = {
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
}, Ya = /* @__PURE__ */ S({}, pr, Ja), Xa = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Ya, e))((e, { slots: t }) => Fa(gr, $a(e), t)), Za = (e, t = []) => {
	T(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Qa = (e) => e ? T(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function $a(e) {
	let t = {};
	for (let n in e) n in Ja || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = eo(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: C = _, onAppear: ee = v, onAppearCancelled: w = y } = t, T = (e, t, n, r) => {
		e._enterCancelled = r, ro(e, t ? u : s), ro(e, t ? l : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, ro(e, d), ro(e, p), ro(e, f), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? ee : v, o = () => T(t, e, n);
		Za(i, [t, o]), io(() => {
			ro(t, e ? c : a), no(t, e ? u : s), Qa(i) || oo(t, r, h, o);
		});
	};
	return S(t, {
		onBeforeEnter(e) {
			Za(_, [e]), no(e, a), no(e, o);
		},
		onBeforeAppear(e) {
			Za(C, [e]), no(e, c), no(e, l);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			no(e, d), e._enterCancelled ? (no(e, f), uo(e)) : (uo(e), no(e, f)), io(() => {
				e._isLeaving && (ro(e, d), no(e, p), Qa(b) || oo(e, r, g, n));
			}), Za(b, [e, n]);
		},
		onEnterCancelled(e) {
			T(e, !1, void 0, !0), Za(y, [e]);
		},
		onAppearCancelled(e) {
			T(e, !0, void 0, !0), Za(w, [e]);
		},
		onLeaveCancelled(e) {
			te(e), Za(x, [e]);
		}
	});
}
function eo(e) {
	if (e == null) return null;
	if (O(e)) return [to(e.enter), to(e.leave)];
	{
		let t = to(e);
		return [t, t];
	}
}
function to(e) {
	return Ce(e);
}
function no(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[qa] || (e[qa] = /* @__PURE__ */ new Set())).add(t);
}
function ro(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[qa];
	n && (n.delete(t), n.size || (e[qa] = void 0));
}
function io(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var ao = 0;
function oo(e, t, n, r) {
	let i = e._endId = ++ao, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = so(e, t);
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
function so(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ga}Delay`), a = r(`${Ga}Duration`), o = co(i, a), s = r(`${Ka}Delay`), c = r(`${Ka}Duration`), l = co(s, c), u = null, d = 0, f = 0;
	t === Ga ? o > 0 && (u = Ga, d = o, f = a.length) : t === Ka ? l > 0 && (u = Ka, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ga : Ka : null, f = u ? u === Ga ? a.length : c.length : 0);
	let p = u === Ga && /\b(?:transform|all)(?:,|$)/.test(r(`${Ga}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function co(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => lo(t) + lo(e[n])));
}
function lo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function uo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function fo(e, t, n) {
	let r = e[qa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var po = /* @__PURE__ */ Symbol("_vod"), mo = /* @__PURE__ */ Symbol("_vsh"), ho = /* @__PURE__ */ Symbol(""), go = /(?:^|;)\s*display\s*:/;
function _o(e, t, n) {
	let r = e.style, i = D(n), a = !1;
	if (n && !i) {
		if (t) {
			if (D(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? yo(r, t, "");
			}
			else for (let e in t) n[e] ?? yo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? yo(r, i, "") : Co(e, i, !D(t) && t ? t[i] : void 0, o) || yo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ho];
			e && (n += ";" + e), r.cssText = n, a = go.test(n);
		}
	} else t && e.removeAttribute("style");
	po in e && ((!i || t !== n) && (e[po] = a ? r.display : ""), e[mo] && (r.display = "none"));
}
var vo = /\s*!important$/;
function yo(e, t, n) {
	if (T(n)) n.forEach((n) => yo(e, t, n));
	else if (n ??= "", t.startsWith("--")) vo.test(n) ? e.setProperty(t, n.replace(vo, ""), "important") : e.setProperty(t, n);
	else {
		let r = So(e, t);
		vo.test(n) ? e.setProperty(_e(r), n.replace(vo, ""), "important") : e[r] = n;
	}
}
var bo = [
	"Webkit",
	"Moz",
	"ms"
], xo = {};
function So(e, t) {
	let n = xo[t];
	if (n) return n;
	let r = he(t);
	if (r !== "filter" && r in e) return xo[t] = r;
	r = ve(r);
	for (let n = 0; n < bo.length; n++) {
		let i = bo[n] + r;
		if (i in e) return xo[t] = i;
	}
	return t;
}
function Co(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && D(r) && n === r;
}
var wo = "http://www.w3.org/1999/xlink";
function To(e, t, n, r, i, a = je(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(wo, t.slice(6, t.length)) : e.setAttributeNS(wo, t, n) : n == null || a && !Me(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : ae(n) ? String(n) : n);
}
function Eo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? za(n) : n);
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
		r === "boolean" ? n = Me(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Do(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Oo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var ko = /* @__PURE__ */ Symbol("_vei");
function Ao(e, t, n, r, i = null) {
	let a = e[ko] || (e[ko] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = No(t);
		r ? Do(e, n, a[t] = Lo(r, i), s) : o && (Oo(e, n, o, s), a[t] = void 0);
	}
}
var jo = /(Once|Passive|Capture)$/, Mo = /^on:?(?:Once|Passive|Capture)$/;
function No(e) {
	let t, n;
	for (; (n = e.match(jo)) && !Mo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : _e(e.slice(2)), t];
}
var Po = 0, Fo = /* @__PURE__ */ Promise.resolve(), Io = () => Po ||= (Fo.then(() => Po = 0), Date.now());
function Lo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (T(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && On(e, t, 5, a);
			}
		} else On(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Io(), n;
}
var Ro = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, zo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? fo(e, r, o) : t === "style" ? _o(e, n, r) : b(t) ? x(t) || Ao(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Bo(e, t, r, o)) ? (Eo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && To(e, t, r, o, a, t !== "value")) : e._isVueCE && (Vo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !D(r))) ? Eo(e, he(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), To(e, t, r, o));
};
function Bo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Ro(t) && E(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Ro(t) && D(n) ? !1 : t in e;
}
function Vo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = he(t);
	return Array.isArray(n) ? n.some((e) => he(e) === r) : Object.keys(n).some((e) => he(e) === r);
}
var Ho = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return T(t) ? (e) => be(t, e) : t;
};
function Uo(e) {
	e.target.composing = !0;
}
function Wo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Go = /* @__PURE__ */ Symbol("_assign"), Ko = /* @__PURE__ */ Symbol("_initialValue");
function qo(e, t, n) {
	return t && (e = e.trim()), n && (e = Se(e)), e;
}
var Jo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Ko] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Ko] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Go] = Ho(i);
		let a = r || i.props && i.props.type === "number";
		Do(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Go](qo(e.value, n, a));
		}), (n || a) && Do(e, "change", () => {
			e.value = qo(e.value, n, a);
		}), t || (Do(e, "compositionstart", Uo), Do(e, "compositionend", Wo), Do(e, "change", Wo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Ko];
		delete e[Ko], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Go](qo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Go] = Ho(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Se(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Yo = {
	deep: !0,
	created(e, t, n) {
		e[Go] = Ho(n), Do(e, "change", () => {
			let t = e._modelValue, n = es(e), r = e.checked, i = e[Go];
			if (T(t)) {
				let e = Re(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ne(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(ts(e, r));
		});
	},
	mounted: Xo,
	beforeUpdate(e, t, n) {
		e[Go] = Ho(n), Xo(e, t, n);
	}
};
function Xo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (T(t)) i = Re(t, r.props.value) > -1;
	else if (ne(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Le(t, ts(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Zo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Do(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Se(es(e)) : es(e)), r = e.multiple, i = r ? ne(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? T(i) ? t.slice() : t : i];
			try {
				e[Go](i);
			} finally {
				Rn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Go] = Ho(r);
	},
	mounted(e, { value: t }) {
		$o(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Go] = Ho(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Qo(t, n[1], n[0])) && $o(e, t);
	}
};
function Qo(e, t, n) {
	if (!n || T(e)) return Le(e, t);
	if (ne(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function $o(e, t) {
	let n = e.multiple, r = T(t);
	if (!n || r || ne(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = es(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Re(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Le(es(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function es(e) {
	return "_value" in e ? e._value : e.value;
}
function ts(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ns = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], rs = {
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
	exact: (e, t) => ns.some((n) => e[`${n}Key`] && !t.includes(n))
}, is = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = rs[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, as = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, os = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = _e(n.key);
		if (t.some((e) => e === r || as[e] === r)) return e(n);
	}));
}, ss = /* @__PURE__ */ S({ patchProp: zo }, Wa), cs;
function ls() {
	return cs ||= Pi(ss);
}
var us = ((...e) => {
	let t = ls().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = fs(e);
		if (!r) return;
		let i = t._component;
		!E(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ds(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ds(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function fs(e) {
	return D(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var ps = () => ({
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
}), ms = null;
function q() {
	if (ms) return ms;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = ps();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return ms = /* @__PURE__ */ en(n), ms;
}
var J = () => e().saveSettingsDebounced(), hs = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], gs = [
	"auto",
	"on",
	"off"
];
//#endregion
//#region packages/protocol/src/expr.ts
function _s(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function vs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => vs(e, t));
		case "var": return t(e.path);
		case "not": return !vs(e.e, t);
		case "bin": {
			if (e.op === "&&") return !!vs(e.l, t) && !!vs(e.r, t);
			if (e.op === "||") return !!vs(e.l, t) || !!vs(e.r, t);
			let n = vs(e.l, t), r = vs(e.r, t);
			switch (e.op) {
				case "==": return _s(n, r);
				case "!=": return !_s(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => _s(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function ys(e, t) {
	return !e || !!vs(e, t);
}
//#endregion
//#region packages/protocol/src/macros.ts
var bs = /\{\{ap::([^{}]*?)\}\}/g;
function xs(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(bs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? xs(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Ss(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Cs(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function ws(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Cs(n[3] ?? n[4] ?? "");
	return t;
}
function Ts(e, t) {
	let n = [], r = RegExp(`<${Ss(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: ws(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: ws(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Es(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Ds(e, t) {
	let n = Ts(e, t)[0];
	return n ? Cs(n.inner).trim() : void 0;
}
function Os(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function ks(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
function As(e, t = (e) => e) {
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
		case "custom": return e.shape === "kv" ? a({
			type: "object",
			additionalProperties: { type: "string" }
		}) : a({ type: "string" });
	}
}
function js(e) {
	return e === "memory" || e === "recap";
}
var Ms = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Ns(e, t, n) {
	if (t !== void 0) switch (e) {
		case "reply":
		case "impersonate": return Ms(t).trim() || void 0;
		case "recap": return t === null ? null : Ms(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Ms(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Ms(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Ms(e.time),
				location: Ms(e.location),
				event: Ms(e.event),
				summary: Ms(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Ms(e.label ?? e.title).trim(),
			content: Ms(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Ms(t)]));
			}
			return Ms(t).trim() || void 0;
	}
}
function Ps(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "reply":
		case "impersonate": return Ns(e.kind, Cs(n.inner));
		case "recap": return Ns("recap", Cs(n.inner));
		case "memory": return Ns("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Ds(e.inner, "scope"),
			operation: Ds(e.inner, "operation"),
			key: Ds(e.inner, "key"),
			content: Ds(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Ds(n.inner, "time") ?? "",
			location: Ds(n.inner, "location") ?? "",
			event: Ds(n.inner, "event") ?? "",
			summary: Ds(n.inner, "summary") ?? ""
		};
		case "options": return Ts(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Cs(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Cs(t[2]).trim();
				return e;
			}
			return Ns("custom", Cs(n.inner), e);
	}
}
function Fs(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		let t = Ts(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Ps(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Es(e, i),
		values: n,
		open: r
	};
}
function Is(e) {
	return Cs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Ls = {
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
}, Rs = (e) => e;
function zs(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function Bs(e, t) {
	return e.stages.filter((e) => ys(e.when, t));
}
function Vs(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function Hs(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = Vs(t);
	return n >= 0 ? n : t.length - 1;
}
function Us(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function Ws(e, t, n = Ls) {
	return zs(t.field?.name ?? n.turn.field, Us(e, t));
}
function Gs(e, t, n = Ls) {
	return zs(t.tool?.name ?? n.stage.name, Us(e, t));
}
function Ks(e, t = Ls) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var qs = (e, t) => t ? {
	...e,
	description: t
} : e;
function Js(e = Ls, t = Rs, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return qs({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: qs({ type: "string" }, i(r.old)),
				new_string: qs({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function Ys(e, t, n = Ls, r = Rs) {
	return e.kind === "patch" ? Js(n, r, t) : qs({ type: "string" }, t);
}
function Xs(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function Zs(e, t, n, r, i = Rs) {
	let a = (e, t) => {
		if (e) return i(t ? zs(e, Us(n, t)) : e).trim() || void 0;
	}, o = Hs(t, n), s = (t) => Ws(n, t, e), c = (t) => Gs(n, t, e), l = (t) => Ks(t, e).name, u = (e, t) => {
		for (let n of r) e[n.field] = As(n, i), js(n.kind) || t.push(n.field);
	}, d = () => {
		let t = {}, r = [];
		return n.forEach((n, c) => {
			let l = s(n);
			t[l] = Ys(n, a(n.field?.description ?? e.turn.fieldDescription, n), e, i), n.optional || r.push(l), c === o && u(t, r);
		}), o < 0 && u(t, r), {
			type: "object",
			properties: t,
			required: r,
			additionalProperties: !1
		};
	}, f = () => n.map((t, n) => {
		let r = {}, s = [], l = Ks(t, e);
		return r[l.name] = Ys(t, a(l.description, t), e, i), s.push(l.name), n === o && u(r, s), Xs(c(t), a(t.tool?.description ?? e.stage.description, t), {
			type: "object",
			properties: r,
			required: s,
			additionalProperties: !1
		});
	}), p = {
		thinking: e.envelope.thinking.name,
		result: e.envelope.result.name
	};
	return {
		fieldOf: s,
		toolOf: c,
		paramOf: l,
		stageOfTool: (e) => n.find((t) => c(t) === e),
		schema: () => {
			let t = a(e.turn.description);
			return {
				name: e.turn.name,
				...t ? { description: t } : {},
				value: d()
			};
		},
		turnSchema: d,
		submitTool: (t) => Xs(e.submit.name, a(e.submit.description), t ?? d()),
		stageTools: f,
		envelope: (t) => ({
			type: "object",
			properties: {
				[p.thinking]: qs({ type: "string" }, a(e.envelope.thinking.description)),
				[p.result]: qs(t, a(e.envelope.result.description) ?? t.description)
			},
			required: [p.thinking, p.result],
			additionalProperties: !1
		}),
		envelopeKeys: p,
		toolNames: () => [e.submit.name, ...n.map(c)]
	};
}
function Qs(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function $s(e) {
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
function ec(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Os(t.content)).trimEnd());
}
function tc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function nc(e) {
	return e.map((e) => ({
		old_string: Ds(e, "old_string") ?? "",
		new_string: Ds(e, "new_string") ?? ""
	}));
}
function rc(e, t) {
	let n = $s(t.stages), r = ks(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Ss(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Fs(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Ts(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = nc(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Cs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Es(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = Vs(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Ss(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), ec(t.stages, n, t.final), tc(t.stages, n, t.final), n;
}
function ic(e, t) {
	let n = $s(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => Ws(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (o = e.id, e.kind === "patch" ? n.stages[e.id].patches = ac(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		let r = a(e.field), i = Ns(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let s = Vs(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : o)), s >= 0 && n.stages[t.stages[s].id].text !== void 0 && (n.contentStarted = !0), ec(t.stages, n, t.final), tc(t.stages, n, t.final), n;
}
function ac(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function oc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function sc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = oc(e, n);
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
	let i = n.trim().split(/\s+/).map(Ss), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function cc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = sc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function lc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Ss(t), "gi"), a = [], o;
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
function uc(e, t, n = (e) => e) {
	if (!e) return [];
	let r = [];
	for (let i of e) {
		let e = n(i.pieces.filter((e) => ys(e.when, t)).map((e) => e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && r.push(i.role ? {
			role: i.role,
			text: e
		} : { text: e });
	}
	return r;
}
//#endregion
//#region packages/protocol/src/clone.ts
function dc(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => dc(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = dc(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function fc(e) {
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
function pc(e, t) {
	let n = fc(e), r = fc(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function mc(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = fc(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = pc(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var hc = (e) => !!e && typeof e == "object" && !Array.isArray(e), gc = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
};
function _c(e, ...t) {
	let n = dc(e);
	for (let e of t) n = vc(n, e);
	return n;
}
function vc(e, t) {
	if (t === void 0) return e;
	if (!hc(e) || !hc(t)) return dc(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = vc(e[r], i);
	return n;
}
function yc(e, t) {
	if (hc(e) && hc(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = yc(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : dc(e);
}
function bc(e, t, n = "", r = [], i = xc) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? hc(e[a]) && hc(t[a]) && (bc(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var xc = /* @__PURE__ */ new Set(["sampling"]);
function Sc(e, t, n) {
	let r = dc(e);
	for (let e of t) if (mc(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && hc(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Cc(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function wc(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Tc(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = [];
	for (let n of e.modules) if (n.toggle === "always" || t.modules[n.id] === !0) {
		if (n.exclusive) {
			if (r.has(n.exclusive)) continue;
			r.add(n.exclusive);
		}
		i.push(n);
	}
	return n ? i.filter((e) => ys(e.when, n)) : i;
}
function Ec(e, t) {
	let n = new Set(Tc(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Dc(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Oc(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function kc(e, t, n, r) {
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
			case "name": return Oc(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${Oc(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? d === "last" ? s.customLast?.[o] ?? "" : u === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : Qs(t, (e) => Oc(i, a, e));
			case "input": return s.metaText ?? "";
			case "memory": return JSON.stringify((o === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "questions": return l(o === "optional" ? "optional" : "mandatory");
			default: return;
		}
	};
	return (e) => xs(e, d);
}
function Ac(e, t) {
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
function jc(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? Gs(n, t, e.tools) : Ws(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Oc(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function Mc(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = wc(i), s = a ? Bs(a, o) : [];
	i.features = {
		...i.features,
		questions: s.some((e) => e.questions === "ask")
	};
	let c = wc(i), l = Tc(n, r, c), u = Dc(n, l), d = kc({
		...e,
		vars: i
	}, s, a, l), f = new Set(l.map((e) => e.id)), p = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!f.has(e.module) || !ys(e.when, c)) continue;
		let t = p.get(e.region) ?? [];
		t.push(...uc(e.content, c, d)), p.set(e.region, t);
	}
	if (a) {
		let e = p.get(n.workflowRegion) ?? [];
		for (let t of uc(jc(n, a, s, i.style, i.transport, r), c, d)) {
			let n = e[e.length - 1];
			!t.role && n && !n.role && n.workflow ? n.text += `\n\n${t.text}` : e.push({
				...t,
				workflow: !0
			});
		}
		p.set(n.workflowRegion, e);
	}
	let m = {};
	for (let e of n.regions) e.native || (m[e.id] = Ac(e, p.get(e.id) ?? []));
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
function Nc(e, t, n = {}) {
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
		modules: Ec(e, t),
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
var Pc = /* @__PURE__ */ new Set([
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
]), Fc = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Ic = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Lc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Rc(e, t = {}) {
	let n = (e) => Rc(e, t);
	if (!Lc(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Lc(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Fc.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Lc), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return zc({
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
		return zc({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Pc.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Lc(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Ic[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Lc(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return zc({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), zc(i, a);
}
function zc(e, t) {
	return t && (e.nullable = !0), e;
}
function Bc(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Lc(n)) return e;
		let r = Lc(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Rc(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var Vc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Hc(e) {
	let t = Vc(e) ? e : {}, n = (e, t) => typeof e == "string" ? e : t;
	return {
		...Ls,
		turn: { ...Ls.turn },
		submit: {
			name: "ap_submit_turn",
			description: n(t.submit, Ls.submit.description)
		},
		stage: {
			...Ls.stage,
			name: `${n(t.stagePrefix, "ap_stage_")}{{stage}}`
		},
		results: {
			...Ls.results,
			next: n(t.stageResult, Ls.results.next),
			nudge: n(t.nudge, Ls.results.nudge)
		}
	};
}
function Uc(e) {
	let t = e.configurationDefaults?.connection;
	return !Vc(t) || Object.keys(gc).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...gc,
				...t
			}
		}
	};
}
function Wc(e) {
	return !Vc(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 2 ? Uc(e) : e.formatVersion === 1 ? Uc({
		...e,
		formatVersion: 2,
		tools: Hc(e.tools)
	}) : null;
}
//#endregion
//#region src/store/presets.ts
var Gc = /* @__PURE__ */ en(/* @__PURE__ */ new Map()), Kc = /* @__PURE__ */ en(/* @__PURE__ */ new Map());
async function qc() {
	try {
		let e = `${o()}dist/presets/`, t = await (await p(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = Wc(await (await p(e + n, { cache: "no-cache" })).json());
			t && Gc.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var Jc = (e) => Wc(e);
function Yc() {
	return [.../* @__PURE__ */ new Set([
		...Gc.keys(),
		...Object.keys(q().installed),
		...Kc.keys()
	])].map((e) => Xc(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Xc(e) {
	let t = Kc.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Qc(e), r = Gc.get(e);
	if (n && (!r || pc(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Zc = /* @__PURE__ */ new WeakMap();
function Qc(e) {
	let t = q().installed[e];
	if (t) return Zc.has(t) || Zc.set(t, Wc(t)), Zc.get(t) ?? void 0;
}
var $c = (e) => Xc(e)?.preset;
function el(e) {
	q().installed[e.id] = e, J();
}
function tl(e) {
	delete q().installed[e], J();
}
function nl(e, t) {
	e ? Kc.set(e.id, e) : t ? Kc.delete(t) : Kc.clear();
}
var rl = (e) => Gc.has(e);
//#endregion
//#region src/store/config.ts
function il(e) {
	let t = q().presets, n = t[e.id];
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
	}, J()), n;
}
function al(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Cc(e, n.id)?.diff;
}
function ol(e, t = il(e).active.ref) {
	return _c(e.configurationDefaults, al(e, il(e), t));
}
function sl(e) {
	let t = il(e);
	return _c(ol(e, t.active.ref), t.active.diff);
}
function cl(e, t) {
	let n = il(e);
	n.active.diff = yc(t, ol(e, n.active.ref)) ?? {}, J();
}
function ll(e, t) {
	let n = sl(e);
	return t(n), cl(e, n), n;
}
function ul(e, t) {
	let n = il(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var dl = (e) => Object.keys(il(e).active.diff ?? {}).length > 0;
function fl(e) {
	il(e).active.diff = {}, J();
}
function pl(e, t) {
	let n = il(e), r = sl(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: yc(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function ml(e, t) {
	let n = il(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = yc(sl(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function hl(e, t, n) {
	let r = il(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function gl(e, t) {
	let n = il(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function _l(e) {
	let t = il(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = [], i = e.configurationDefaults, a = (t) => {
		let a = pc(n, e.version) < 0 ? Sc(t, e.migrations, n) : dc(t);
		r.push(...bc(a, i));
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
	}), t.version = e.version, t.hash = e.hash, J(), r.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, r), r;
}
//#endregion
//#region i18n/en.json
var vl = {
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
}, yl = {
	en: vl,
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
function bl() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((yl[bl()] ?? yl[bl().split("-")[0]])?.[e] ?? vl[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function xl(e) {
	return e.locales?.[bl()] ?? e.locales?.[bl().split("-")[0]];
}
function Sl(e, t, n, r, i) {
	let a = xl(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
//#endregion
//#region src/store/carrier.ts
var Cl = "advanced_preset", wl = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Tl = (e) => wl[e] ?? e, El = () => e().getPresetManager("openai"), Dl = (e) => `AP · ${e.name}`;
function Ol() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function kl(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Al(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...dc(t.sampling),
		prompts: dc(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: dc(n)
		})),
		extensions: { [Cl]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function jl(e) {
	let t = El();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Ml(e, t, n) {
	let r = El();
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
async function Nl(e, t = {}) {
	let n = El(), r = il(e), i = jl(e.id), a = i ?? Dl(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Cl];
	if (!o || t.force || s?.hash !== e.hash) {
		o && r.carrierHash && kl(o) !== r.carrierHash && f("info", Y("carrier.reset", { name: a }));
		let n = Al(e, sl(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = kl(n), J(), await Ml(a, n, !!t.select);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function Pl(e) {
	await Nl(e, { select: !0 });
}
async function Fl(e) {
	let t = jl(e.id);
	if (!t) return;
	let n = El(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = sl(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...dc(i)
	}, o = n.getSelectedPresetName() === t;
	Il = !0;
	try {
		await Ml(t, a, o);
	} finally {
		Il = !1;
	}
}
var Il = !1;
function Ll(t) {
	if (Il || Ol() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = sl(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Tl(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = dc(r));
	}
	return Object.keys(i).length ? (ll(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/store/sidecar.ts
var Rl = "advanced_preset";
function zl(e) {
	let t = e?.extra?.[Rl];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function Bl(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Rl] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Rl] = dc(n));
}
//#endregion
//#region src/store/eventlog.ts
var Vl = "advanced_preset";
function Hl() {
	return e().chatMetadata?.[Vl]?.seedEvents ?? [];
}
function Ul(t = Infinity) {
	let n = Hl().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of zl(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function Wl(e = Infinity) {
	let t = {};
	for (let { event: n } of Ul(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function Gl(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of Ul(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function Kl(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = zl(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Vl] && (e.extra[Vl].events = dc(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Vl] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function ql(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key];
	return t;
}
function Jl(e, t, n, r, i) {
	let a = e.globalMemory, o = ql(e)[n] ?? null;
	return a.log.splice(a.cursor), a.log.push({
		op: t,
		key: n,
		content: r,
		prev: o,
		source: i,
		at: Date.now()
	}), a.cursor = a.log.length, J(), a.cursor - 1;
}
var Yl = (e) => e.globalMemory.cursor > 0, Xl = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Zl(e) {
	Yl(e) && (e.globalMemory.cursor--, J());
}
function Ql(e) {
	Xl(e) && (e.globalMemory.cursor++, J());
}
function $l(e, t) {
	let n = e.globalMemory.log[t];
	n && (n.prev === null ? Jl(e, "delete", n.key, void 0, "undo") : Jl(e, "replace", n.key, n.prev, "undo"));
}
function eu(e, t) {
	let n = [];
	for (let r of t) if (r.scope === "global_memory") {
		let t = Jl(e, r.operation, r.key, r.content ?? "", "model");
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
var tu = null, nu = (e) => {
	tu = e;
}, ru = () => {
	let e = tu;
	return tu = null, e;
};
function iu(t, n) {
	let r = xs(t.meta.trigger, (e) => e[0] === "name" ? Oc(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function au(e, t, n, r, i, a = [], o = !0) {
	let s = lc(n, iu(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = wc(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && ys(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && ys(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && ys(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? ru() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function ou(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var su = 0, cu = () => `ap-${Date.now().toString(36)}-${(++su).toString(36)}`, lu = /* @__PURE__ */ new Map(), uu = null, du = null, fu = {
	setPending(e) {
		uu = e;
	},
	takePending() {
		let e = uu;
		return uu = null, e;
	},
	peekPending: () => uu,
	arm(e) {
		du = e, lu.set(e.id, e);
	},
	takeArmed() {
		let e = du;
		return du = null, e;
	},
	get: (e) => lu.get(e),
	release(e) {
		lu.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of lu) t - r.createdAt > e && lu.delete(n);
	}
}, pu = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, mu = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function hu(e, t) {
	return e.replace(/\{\{(time|location|event|summary)\}\}/g, (e, n) => t[n] ?? "");
}
function gu(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	if (n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = pu(e);
		if (a && mu.has(a.turn)) {
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
		let n = lc(e.item.mes, t.trigger, t.wrap);
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
			let r = t.synopsisId ? pu(e.item)?.structures?.[t.synopsisId] : void 0;
			return [r ? {
				...e,
				item: {
					...e.item,
					mes: hu(t.synopsisTemplate, r)
				}
			} : e];
		});
	}
	return n.map((e) => e.item);
}
var _u = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function vu(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function yu(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = vu(e), r = vu(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function bu(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = _u(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = _u(l.text);
			if (c === u || c.includes(u) || yu(c, u) >= n) {
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
async function xu(t, n, r, i) {
	if (fu.setPending(null), !q().enabled) return;
	let a = Ol(), o = a ? $c(a) : void 0;
	if (!o) return;
	let s = sl(o), c = i || "normal", l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, { meta: d, flags: f, origin: p } = au(o, s, u >= 0 ? t[u].mes : "", c, !0, t.slice(-6).map((e) => e.mes)), m = e().chat, h = t.map((e) => m.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), g = gu(t, {
		trigger: iu(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		synopsisTemplate: o.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(o.structures).find((e) => e.kind === "synopsis")?.id,
		recap: Gl(),
		realIndex: (e) => h[e] ?? -1,
		currentInput: u
	});
	t.splice(0, t.length, ...g);
	let _ = {
		id: cu(),
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
	fu.setPending(_);
}
//#endregion
//#region src/core/debug.ts
var Su = /* @__PURE__ */ en({
	log: [],
	requests: []
}), Cu = 50;
function wu(e, t) {
	Su.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Su.log.length > Cu && (Su.log.length = Cu);
}
function Tu(e) {
	return Su.requests.unshift(e), Su.requests.length > Cu && (Su.requests.length = Cu), Su.requests[0];
}
//#endregion
//#region src/core/assembler.ts
var Eu = /⟦ap:region:([\w.-]+)⟧/g, Du = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function Ou(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(Eu)) {
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
function ku(t, n) {
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Oc(t, n, t.user), s = Oc(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = zl(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? Is(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function Au(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = zl(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function ju(t, n) {
	let { preset: r, config: i } = t, a = Wl(), o = ql(il(r)), s = Gl(), c = ku(r, i), l = t.transport;
	return {
		vars: Nc(r, i, {
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
			customLast: Au(r)
		}
	};
}
function Mu(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = bu(s.map(({ m: e }) => ({
		role: e.role,
		text: Du(e.content)
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
			mes: Du(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = gu(d, {
		trigger: iu(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		synopsisTemplate: r.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(r.structures).find((e) => e.kind === "synopsis")?.id,
		recap: Gl(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1
	}), m = new Map(p.map((e) => [e.__h, e.mes])), h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function Nu(t, n) {
	let r = n ? null : fu.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = sl(t), a = [...e().chat].reverse().find((e) => e.is_user && !e.is_system), { meta: o, flags: s, origin: c } = au(t, i, n ? a?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: cu(),
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
var Pu = Symbol("ap-region");
function Fu(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => Du(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Oc(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = Du(t.content);
		if (t[Pu] || t.role === "system") return n;
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
async function Iu(t) {
	let { chat: n, dryRun: r } = t;
	if (!q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		r || (fu.setPending(null), fu.takeArmed());
		return;
	}
	let i = Ol(), a = i ? $c(i) : void 0;
	if (!a) {
		let e = Ou(n).filter((e) => !e.__anchor);
		n.splice(0, n.length, ...e);
		return;
	}
	let o = Nu(a, r), s = Ou(n);
	!o.interceptorRan && !r && Mu(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : ou(a, o.config, o.origin), { vars: u, data: d } = ju(o, l), f = Mc({
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
			return Object.defineProperty(t, Pu, { value: !0 }), t;
		}).filter((e) => Du(e.content).trim());
		g.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: Du(e.content).length,
				content: Du(e.content)
			}))
		}), m.push(...n), t === a.anchors.historyStart && (h = m.length);
	}
	let _ = o.transport === "prefill" && !c && h >= 0 ? Fu(o, m, h) : m;
	n.splice(0, n.length, ..._.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), wu("assembly", g), !r && !c && l && fu.arm(o);
}
//#endregion
//#region src/core/transports/tool-args.ts
var Lu = "stream_function_call_arguments";
function Ru(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function zu(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Bu(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Lu] = !0, t() && Vu(e));
}
function Vu(e) {
	let t = Hu(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...zu(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Hu(e) {
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
function Uu(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of Zs(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Wu(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Gu(e) {
	return Zs(e.preset.tools, e.workflow, e.stages, e.structures, Wu(e));
}
function Ku(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Oc(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function qu(e, t, n) {
	let r = zs(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Wu(e)(r);
}
function Ju(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Wu(r), u = l(o.tool.description);
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
				content: qu(r, o.response[t], { first: n })
			}
		]
	};
}
function Yu(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && Xu(n, e.ctx.preset.tools.jsonStringHint), Ru(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && Bu(n), n;
}
function Xu(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Bc(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Rc(e.json_schema.value, n)
	});
}
function Zu(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/transports/text.ts
function Qu(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Ku(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => rc(e, {
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
			content: zs(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), Yu({
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
			let n = Zu(t, e.caller);
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
var $u = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, ed = 32, td = 10, nd = 9, rd = 13, id = 160, ad = 6158, od = 8192, sd = 8203, cd = 8239, ld = 8287, ud = 12288, dd = 65279;
function fd(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function pd(e) {
	return e >= "0" && e <= "9";
}
function md(e) {
	return e >= " ";
}
function hd(e) {
	return ",:[]/{}()\n+".includes(e);
}
function gd(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function _d(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var vd = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, yd = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function bd(e) {
	return ",[]/{}\n+".includes(e);
}
function xd(e) {
	return Dd(e) || Sd.test(e);
}
var Sd = /^[[{\w-]$/;
function Cd(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function wd(e, t) {
	let n = e.charCodeAt(t);
	return n === ed || n === td || n === nd || n === rd;
}
function Td(e, t) {
	let n = e.charCodeAt(t);
	return n === ed || n === nd || n === rd;
}
function Ed(e, t) {
	let n = e.charCodeAt(t);
	return n === id || n === ad || n >= od && n <= sd || n === cd || n === ld || n === ud || n === dd;
}
function Dd(e) {
	return Od(e) || Ad(e);
}
function Od(e) {
	return e === "\"" || e === "“" || e === "”";
}
function kd(e) {
	return e === "\"";
}
function Ad(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function jd(e) {
	return e === "'";
}
function Md(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Nd(e, t) {
	let n = e.length;
	if (!wd(e, n - 1)) return e + t;
	for (; wd(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function Pd(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Fd(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var Id = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Ld(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = Id[n];
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
function Rd(e) {
	return e !== null && e.char === "\"";
}
function zd(e) {
	return e !== null && e.char === "'";
}
function Bd(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Vd(e, t) {
	switch (t) {
		case ")": return Bd(e, "(") > Bd(e, ")");
		case "]": return Bd(e, "[") > Bd(e, "]");
		case "}": return Bd(e, "{") > Bd(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Hd = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Ud = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Wd(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || re(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), xd(e[t]) && Fd(n) ? (r || (n = Nd(n, ",")), g()) : r && (n = Md(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	ne();
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
		let i = r ? wd : Td, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (Ed(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Gd(e, t);) t++;
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
			if (gd(e[t])) for (; t < e.length && _d(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Nd(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Md(n, ",")) : ie();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (xd(e[t]) || c ? n = Nd(n, ":") : E()), i() || (s || c ? n += "null" : E()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Nd(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Nd(n, ",")), p(), !i()) {
					r || (n = Md(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Nd(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Nd(n, ",")), t = i();
		t || (n = Md(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, Dd(e[t]) || ne());
		let s = e[t] === "&" ? Ld(e.slice(t, t + 12)) : null, c = Rd(s) || zd(s);
		if (Dd(e[t]) || c) {
			let l = kd(e[t]) ? kd : jd(e[t]) ? jd : Ad(e[t]) ? Ad : Od, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = ee(t - 1);
					return !r && hd(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Nd(p, "\""), n += p, !0);
				}
				if (t === i) return p = Nd(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Ld(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || hd(e[t]) && !Vd(p, e[t]) || Dd(e[t]) && !w(t) || pd(e[t])) return v(), !0;
					e[t] === "\\" && ne();
					let s = ee(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (hd(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && bd(e[t])) {
					if (e[t - 1] === ":" && vd.test(e.substring(u + 1, t + 2))) for (; t < e.length && yd.test(e[t]);) p += e[t], t++;
					return p = Nd(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : Cd(e) ? p += Hd[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Ud[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && fd(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : D();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : Cd(n) ? (p += Hd[n], t++) : (md(n) || te(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Md(n, "\"", !0);
			let e = n.length;
			n = _() ? Pd(n, e, 1) : Nd(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !pd(e[t]) && T() && (i += "0")), e[t] === "0" && pd(e[t + 1]) && (a = !0); pd(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, pd(e[t]) || (i += "0"); pd(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), pd(e[t]) || (i += "0"); pd(e[t]);) i += e[t], t++;
			return T() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !_d(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (gd(e[t])) {
			for (; t < e.length && _d(e[t]);) t++;
			let n = t;
			for (; wd(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !bd(e[t]) && !Dd(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && vd.test(e.substring(a, t + 2))) for (; t < e.length && yd.test(e[t]);) t++;
		if (t > a) {
			for (; wd(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && wd(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && wd(e, n);) n++;
		return n >= e.length || hd(e[n]);
	}
	function T() {
		return t >= e.length || hd(e[t]) || wd(e, t);
	}
	function te(e) {
		throw new $u(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ne() {
		throw new $u(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function re() {
		throw new $u("Unexpected end of json string", e.length);
	}
	function ie() {
		throw new $u("Object key expected", t);
	}
	function E() {
		throw new $u("Colon expected", t);
	}
	function D() {
		throw new $u(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Gd(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Kd(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function qd(e, t) {
	let n = Kd(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Wd(n));
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
function Jd(e, t, n, r) {
	let i = $s(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function Yd(e) {
	let { ctx: t, caller: n } = e, r = Gu(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = qd(c(e), i);
		return s = a.value, n.schema ? Jd(t, r, a.value, i) : ic(a.value, {
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
		body: () => Yu(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Xd = (e, t) => ({
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
function Zd(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Qd(e) {
	let { ctx: t, caller: n } = e, r = Gu(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = Ju(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = qd((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? Jd(t, r, o.value, i) : ic(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => Yu(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = Zu(e, n);
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
function $d(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Gu(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Ju(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = Hs(t.workflow, r), m = new Map(r.map((e) => [s.toolOf(e), e])), h = {}, g = [], _ = !1, v = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, y = () => r.find((e) => !e.optional && h[s.fieldOf(e)] === void 0), b = () => {
		let e = y();
		return e ? s.toolOf(e) : "";
	}, x = (e, t, n) => {
		let a = m.get(t.name);
		if (!a) return;
		let o = qd(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? Jd(t, s, e, a) : ic(e, {
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
			return Yu({
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
			let i = Zd(e.toolCalls.filter((e) => e.name), r), o = Zu(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(Xd(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = qu(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: qu(t, a.tools.results.nudge, {
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
function ef(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Qu(e);
		case "structured": return Yd(e);
		case "tool-single": return Qd(e);
		case "tool-multi": return $d(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function tf(e, t) {
	let n = t ? s({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? d(n) : l(n);
}
var X = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function nf(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, X({
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
			})), a = () => n === null ? "" : (n = null, X({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + X({
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
				text: (e) => e ? o("text") + X({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + X({
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
					for (let i of e) t++, r = !0, n += X({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + X({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + X({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => X({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: () => i() + a() + X({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: { output_tokens: 0 }
				}) + X({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? X({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? X({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? X({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: rf(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => X({ error: { message: e } }),
			end: () => ""
		};
		case "cohere": return {
			text: (e) => e ? X({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => X({
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
			error: (e) => X({ error: { message: e } }),
			end: () => X({ type: "message-end" })
		};
		default: return {
			text: (e) => e ? X({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? X({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? X({ choices: [{
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
			error: (e) => X({ error: { message: e } }),
			end: () => X("[DONE]")
		};
	}
}
function rf(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function af(e, t) {
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
			input: rf(e.arguments)
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
					args: rf(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function of(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function sf(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function cf(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var lf = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = sf(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = cf(t);
			if (r) {
				let t = this.open.has(e) ? uf(this.value, n) : void 0;
				df(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function uf(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function df(e, t, n) {
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
var ff = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function pf(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var mf = class {
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
				args: new lf()
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
function hf(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function gf(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* _f(e, t) {
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
async function* vf(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = pf(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new ff(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new mf();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = pf(t);
		if (n) throw new ff(n);
		i.text = hf(t), i.reasoning = gf(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = t?.usage ?? t?.usageMetadata, yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of _f(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = pf(e);
		if (r) throw new ff(r);
		i.text += c(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s), (e?.usage || e?.usageMetadata) && (i.usage = e.usage ?? e.usageMetadata), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var yf = /* @__PURE__ */ en({ current: null });
function bf(e, t) {
	return yf.current = {
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
	}, yf.current;
}
function xf(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var Sf = "/api/backends/chat-completions/generate", Cf = { pending: null }, wf = (e) => e?.name === "AbortError";
function Tf(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Y("error.toolsUnsupported") : null;
}
async function Ef(e, t, n) {
	let r = tf(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = Tf(e);
	if (a) return f("error", a, "Advanced Preset"), of(a, 400);
	let o = e.origin === "task" ? Uu(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = bf(e, i);
	if (!i) try {
		let i = await kf(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(af(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return Of(c, e);
	}
	let l = nf(r), u = new TextEncoder(), d = new TransformStream(), p = d.writable.getWriter(), m = (e) => e ? p.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), h = "";
	return (async () => {
		try {
			let i = await kf(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(h) && e.length > h.length && (m(l.text(e.slice(h.length))), h = e);
			});
			i.content.startsWith(h) && await m(l.text(i.content.slice(h.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await m(l.reasoning(i.reasoning)), i.toolCalls?.length && await m(l.toolCalls(i.toolCalls)), await m(l.end());
		} catch (e) {
			wf(e) || (await m(l.error(Df(e))), Of(c, e));
		} finally {
			await p.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var Df = (e) => e instanceof Error ? e.message : String(e);
function Of(e, t) {
	return e.status = wf(t) ? "aborted" : "error", e.error = Df(t), t instanceof ff ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : of(Df(t));
}
async function kf(t, n, r, i, a, o) {
	let c = String(n.chat_completion_source ?? ""), l = ef({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: tf(c, n)
	}), u = Vs(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), m = t.origin === "story" && !r.schema && !f && d !== null, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, g = Date.now(), _ = "", v, y = 0, b = !1, x, S;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), c = Tu({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		y++;
		let u = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let t = await p(Sf, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), n = 0;
			for await (let e of vf(t, s(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - n < 50) continue;
				n = t;
				let r = l.progress(e, !1);
				if (xf(i, r, _ + e.reasoning), m && d) {
					let e = r.stages[d]?.text ?? "";
					e && o(e.slice(0, e.length - Os(e)).trimEnd());
				}
			}
			c.response = u.text || JSON.stringify(u.toolCalls), c.durationMs = Date.now() - c.at, c.usage = u.usage;
		} catch (e) {
			if (c.error = Df(e), wf(e) || a?.aborted) {
				b = !0, S = l.progress(u, !1);
				break;
			}
			throw e;
		}
		_ += u.reasoning, v = u.usage ?? v, l.progress(u, !0);
		let f = l.complete(u, n);
		if (f.callerToolCalls) {
			x = f.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (f.done) break;
	}
	let C = S ?? l.result();
	if (b) for (let e of Object.values(C.stages)) e.status === "streaming" && (e.status = "interrupted");
	xf(i, C, _);
	let ee = Af(t, C, l.rawText(), l.callerResult?.(), _, {
		usage: v,
		requests: y,
		durationMs: Date.now() - g,
		interrupted: b
	});
	return ee.toolCalls = x, x && (ee.content = ""), i.status = b ? "aborted" : "done", ee;
}
function Af(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = cc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = ks(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g = (e) => Object.values(s.structures).find((t) => t.kind === e), _ = g("reply"), v = _ ? n.structures[_.id] : void 0, y = g("impersonate"), b = g("recap"), x = g("memory"), S = t.meta.mixed ? "meta-mixed" : "story", C = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? C = i === void 0 ? u || ks(r).trim() : JSON.stringify(i) : u || (S = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", C = v ? Is(v) : "", !C && y && typeof n.structures[y.id] == "string" && (C = "…"), !C && b && n.structures[b.id] && (C = "…"))), !C && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let ee = [], w = t.interceptorRan && t.stType !== "quiet";
	if (w && x && Array.isArray(n.structures[x.id]) && ee.push(...eu(il(s), n.structures[x.id])), w && b && typeof n.structures[b.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ee.push({
			type: "recap.set",
			text: n.structures[b.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let T = t.stages.map((e) => {
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
	}), te = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: S,
		stages: T,
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
	}, ne = {
		content: C,
		reasoning: a,
		sidecar: te
	};
	return w ? Cf.pending = {
		ctx: t,
		outcome: ne,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: te
	}), yf.current?.genId === t.id && (yf.current.structures = n.structures), ne;
}
//#endregion
//#region src/core/fetch-gate.ts
var jf = "__ap_gen_id";
function Mf(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function Nf() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	m(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(Mf(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[jf], r = typeof t == "string" ? fu.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[jf], r.claimed = !0;
				try {
					return await Ef(r, e, n.signal);
				} finally {
					fu.release(t);
				}
			}
			e && (delete e[jf], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Pf(e) {
	let t = fu.takeArmed();
	t && (e[jf] = t.id);
}
//#endregion
//#region src/app/receive.ts
var Ff = 6e5, If = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Lf(t, n) {
	let r = Cf.pending;
	if (!r || Date.now() - r.at > Ff || If.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	Cf.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Bl(t, a.sidecar), yf.current?.genId === r.ctx.id && (yf.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/updater.ts
var Rf = "advancedPreset.reloadedFor";
async function zf() {
	try {
		let e = await p(`${o()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Bf(e) {
	sessionStorage.setItem(Rf, e), f("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Vf() {
	let e = await zf();
	e && e !== "f77547eb825425b6" && sessionStorage.getItem(Rf) !== e && Bf(e);
}
async function Hf() {
	await Vf();
}
async function Uf() {
	let e = a().replace(/^third-party\//, ""), t = await Wf(e, !1);
	if (t.status === 404 && (t = await Wf(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await zf();
	return r && r !== "f77547eb825425b6" ? (Bf(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var Wf = (t, n) => p("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Gf = /* @__PURE__ */ en({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), Kf = 1500, qf = null;
async function Jf() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await p(`${n}/`, { cache: "no-store" })).json();
		if (Gf.status = "online", Gf.error = e.ok === !1 ? "build failed" : "", Gf.at = Date.now(), !e.hash || e.hash === Gf.hash) return;
		let t = Jc(await (await p(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Gf.presetId && Gf.presetId !== t.id && nl(null, Gf.presetId), nl(t), Gf.presetId = t.id, Gf.hash = t.hash, _l(t), await Nl(t), wu("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Gf.status = "error", Gf.error = e instanceof Error ? e.message : String(e);
	}
}
function Yf() {
	if (qf && clearTimeout(qf), qf = null, !q().dev.enabled) {
		Gf.presetId && nl(null, Gf.presetId), Object.assign(Gf, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	Gf.status === "off" && (Gf.status = "connecting");
	let e = async () => {
		await Jf(), q().dev.enabled && (qf = setTimeout(e, Kf));
	};
	e();
}
function Xf() {
	ar(() => [q().dev.enabled, q().dev.url], () => {
		Gf.hash = "", Yf();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var Zf = "#option_impersonate, #mes_impersonate", Qf = () => document.querySelector("#send_textarea");
function $f(e, t = !1) {
	let n = Qf();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function ep() {
	if (!q().enabled) return null;
	let t = Ol(), n = t ? $c(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = sl(n), i = xs(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Oc(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function tp(e) {
	if (!e.target?.closest?.(Zf)) return;
	let t = ep();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Qf()?.value.trim();
	$f(n ? `${t}\n${n}` : t, !0);
}
function np() {
	window.addEventListener("click", tp, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var rp = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-shadow:0 8px 28px #00000073}", ip = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", ap = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}", op = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;background:var(--ap-panel-bg);color:var(--ap-text);-webkit-backdrop-filter:blur(var(--SmartThemeBlurStrength,10px));flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fill,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}}", Z = /* @__PURE__ */ en({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), sp = () => {
	Z.chatRev++;
}, cp = () => {
	Z.presetId = Ol();
}, lp = K(() => Z.presetId ? $c(Z.presetId) : void 0), up = K(() => {
	let e = lp.value;
	if (!e) return { config: "" };
	let t = il(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Sl(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function dp(t) {
	return Z.chatRev, e().chat[t];
}
function fp(e) {
	return zl(dp(e));
}
function pp(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/ui/theme.ts
var mp = /* @__PURE__ */ en({ mode: "light" }), hp = new CSSStyleSheet();
hp.replaceSync([
	rp,
	ip,
	ap,
	op
].join("\n"));
var gp = new CSSStyleSheet(), _p = [hp, gp], vp = [
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
function yp(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of vp) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function bp(e) {
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
function xp() {
	let e = bp(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var Sp = /* @__PURE__ */ new Set();
function Cp(e) {
	return Sp.add(e), e.dataset.apTheme = mp.mode, () => Sp.delete(e);
}
function wp() {
	let e = xp();
	if (e !== mp.mode) {
		mp.mode = e;
		for (let t of Sp) t.dataset.apTheme = e;
	}
}
function Tp() {
	mp.mode = xp();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(wp);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), rr(() => {
		let e = lp.value?.theme?.[mp.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(yp(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(yp("primary", t.primary)), t.accent && n.push(yp("accent", t.accent)), gp.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function Ep(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function Dp(e, t, n = []) {
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
			e.adoptedStyleSheets = _p, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = Cp(this), this.app = us(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/mounts.ts
var Op = "ap-hidden", kp = [
	"meta-pure",
	"impersonate",
	"summary"
];
function Ap(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function jp(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = zl(a), s = yf.current?.mesId === n, c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = Ap("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = Ap("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(Op, !!(!s && o && kp.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(Op));
}
function Mp(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) jp(t);
}
function Np() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var Pp = 0, Fp = /* @__PURE__ */ new Set(), Ip = !1;
function Lp(e) {
	e ? Fp.add(e) : Ip = !0, !Pp && (Pp = requestAnimationFrame(() => {
		if (Pp = 0, Ip) Mp();
		else for (let e of Fp) e.isConnected && jp(e);
		Fp.clear(), Ip = !1, Np();
	}));
}
function Rp() {
	sp(), Lp();
}
function zp() {
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
	]) e && t.on(e, Rp);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Lp(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Lp(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Lp();
	};
	r();
	let i;
	ar(() => yf.current && yf.current.status === "running" && yf.current.streaming && yf.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = yf.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Rp());
		}, 100));
	}), ar(() => yf.current?.status, () => Lp());
}
//#endregion
//#region src/ui/entry.ts
var Bp = "left-nav-panel", Vp = "ap-preset-button";
function Hp() {
	return document.getElementById(Bp);
}
function Up() {
	let e = Hp();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function Wp() {
	let e = document.querySelector("#settings_preset_openai")?.nextElementSibling;
	if (!e || e.querySelector(`#${Vp}`)) return;
	let t = document.createElement("div");
	t.id = Vp, t.className = "menu_button menu_button_icon", t.setAttribute("role", "button"), t.tabIndex = 0, t.title = Y("panel.open.title"), t.setAttribute("aria-label", Y("panel.open.title"));
	let n = document.createElement("i");
	n.className = "fa-fw fa-solid fa-layer-group", t.append(n);
	let r = () => {
		Z.panelOpen = !Z.panelOpen;
	};
	t.addEventListener("click", r), t.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), r());
	}), e.prepend(t), ar(() => Z.panelOpen, (e) => t.classList.toggle("active", e), { immediate: !0 });
}
function Gp() {
	let e = Hp();
	if (!e) {
		document.querySelector("ap-panel") || document.body.append(document.createElement("ap-panel"));
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function Kp() {
	Wp(), Gp(), ar(() => Z.panelOpen, (e) => {
		e && Up();
	});
	let e = Hp();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var qp = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Jp = (e) => e === "", Yp = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Xp = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Zp = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Qp = (e) => {
	let t = Zp(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, $p = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, em = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = $p.width, color: s = $p.stroke, ...c }, { slots: l }) => Fa("svg", {
	...$p,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Jp(n) || Jp(r) || n === !0 || r === !0 ? Number(i || a || $p["stroke-width"]) * 24 / Number(o) : i || a || $p["stroke-width"],
	class: Yp("lucide", c.class, ...e ? [`lucide-${Xp(Qp(e))}-icon`, `lucide-${Xp(e)}`] : ["lucide-icon"]),
	...!l.default && !qp(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Fa(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Fa(em, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), tm = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), nm = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), rm = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), im = Q("brain", [
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
]), am = Q("bug", [
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
]), om = Q("cable", [
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
]), sm = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), cm = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), lm = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), um = Q("circle-dashed", [
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
]), dm = Q("circle-question-mark", [
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
]), fm = Q("circle-slash", [["circle", {
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
}]]), pm = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), mm = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), hm = Q("coins", [
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
]), gm = Q("copy", [["rect", {
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
}]]), _m = Q("download", [
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
]), vm = Q("drama", [
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
]), ym = Q("feather", [
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
]), bm = Q("file-stack", [
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
]), xm = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Sm = Q("git-compare-arrows", [
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
]), Cm = Q("globe", [
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
]), wm = Q("info", [
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
]), Tm = Q("layers", [
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
]), Em = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Dm = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Om = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), km = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Am = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), jm = Q("notebook-pen", [
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
]), Mm = Q("package", [
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
]), Nm = Q("palette", [
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
]), Pm = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), Fm = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), Im = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Lm = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), Rm = Q("refresh-cw", [
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
]), zm = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), Bm = Q("save", [
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
]), Vm = Q("scroll-text", [
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
]), Hm = Q("server", [
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
]), Um = Q("shapes", [
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
]), Wm = Q("sliders-horizontal", [
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
]), Gm = Q("sliders-vertical", [
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
]), Km = Q("text-cursor-input", [
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
]), qm = Q("trash-2", [
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
]), Jm = Q("triangle-alert", [
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
]), Ym = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), Xm = Q("upload", [
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
]), Zm = Q("user-pen", [
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
]), Qm = Q("workflow", [
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
]), $m = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), eh = 6, th = 8;
function nh(e, t, n, r = "center", i = !1) {
	let a = e.top - eh - t.height >= th, o = e.bottom + eh + t.height <= n.height - th, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - eh - t.height : e.bottom + eh;
	c = Math.max(th, Math.min(c, n.height - th - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(th, Math.min(l, n.width - th - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function rh(e, t) {
	let n = /* @__PURE__ */ fn(!1), r = /* @__PURE__ */ fn(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = nh(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return ar(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Rn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), zr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/components/Tip.vue
var ih = /* @__PURE__ */ L({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ fn(null), { open: r, bubble: i } = rh(n, () => t);
		return (t, a) => (B(), V("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Gr(t.$slots, "default"), F(r) && e.text ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544));
	}
}), ah = ["disabled", "aria-label"], $ = /* @__PURE__ */ L({
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
		return (t, n) => (B(), H(ih, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: I(() => [U("button", {
				type: "button",
				class: A(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(B(), H(Hr(e.icon)))], 10, ah)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), oh = {
	key: 0,
	class: "patches"
}, sh = { class: "patch-old pre" }, ch = { class: "patch-new pre" }, lh = {
	key: 0,
	class: "patch-status xs"
}, uh = {
	key: 2,
	class: "faint small stage-empty"
}, dh = /* @__PURE__ */ L({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ fn(null);
		ar(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Rn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (B(), V("div", {
			class: "stage-body",
			style: Ee({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (B(), V("div", oh, [(B(!0), V(z, null, R(e.stage.patches, (e, t) => (B(), V("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			U("div", sh, j(e.old_string), 1),
			W(F(tm), { class: "patch-arrow" }),
			U("div", ch, j(e.new_string), 1),
			r(e.status) ? (B(), V("div", lh, [W(F(nm)), ca(j(F(Y)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (B(), V("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (B(), V("div", uh, j(F(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/message/model.ts
function fh(e, t, n, r) {
	return e && xl(e)?.workflows?.[t]?.stages?.[n] || r;
}
function ph(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return Ep(e?.actors[t]?.color, n);
}
function mh(e) {
	return K(() => {
		let t = e(), n = fp(t), r = yf.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = $c(r.presetId);
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
					label: fh(e, r.workflow, t.id, t.label),
					color: ph(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = $c(n.presetId);
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
				label: fh(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: ph(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/actions.ts
async function hh(t) {
	let n = e().chat[t], r = zl(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes), Bl(t, {
		...r,
		patchesApplied: i
	}), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), sp();
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var gh = { class: "stage-bar" }, _h = ["onClick"], vh = { class: "ellipsis" }, yh = {
	key: 0,
	class: "chip stage-chip error"
}, bh = { class: "ellipsis" }, xh = { class: "badge warn" }, Sh = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, Ch = /* @__PURE__ */ L({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = mh(() => t.mesid), r = /* @__PURE__ */ fn(null), i = /* @__PURE__ */ fn(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		ar(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: jm,
			content: ym,
			patch: Sm
		}, d = (e) => e.status === "streaming" ? Dm : e.status === "interrupted" ? fm : e.status === "missing" ? um : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => F(n) && (o.value.length || F(n).error) ? (B(), V("div", {
			key: 0,
			class: A(["stages", { live: F(n).running }])
		}, [U("div", gh, [
			(B(!0), V(z, null, R(o.value, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ee({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(B(), H(Hr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), U("span", vh, j(e.label), 1)], 14, _h))), 128)),
			F(n).error ? (B(), V("span", yh, [W(F(Jm)), U("span", bh, j(F(n).error), 1)])) : G("", !0),
			r[1] ||= U("span", { class: "grow" }, null, -1),
			f.value.length ? (B(), H(ih, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: I(() => [U("span", xh, [W(F(Jm)), ca(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (B(), H($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? F(Ym) : F(Lm),
				label: p.value.patchesApplied ? F(Y)("stages.revertDraft") : F(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => F(hh)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			F(n).running ? G("", !0) : (B(), H(ih, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: I(() => [U("span", Sh, [W(F(wm))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (B(), H(dh, {
			key: c.value.id,
			stage: c.value,
			follow: F(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), wh = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), Th = /* @__PURE__ */ new Set([
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
]), Eh = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function Dh(e) {
	return Eh(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function Oh(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${Dh(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${Dh(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${Dh(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function kh(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = kh(e, t);
			n && i.appendChild(n);
		}
	};
	if (!wh.has(r) && !Th.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = kh(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function Ah(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return Oh(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", Oh(e.textContent));
			continue;
		}
		let t = kh(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var jh = { class: "reply-name xs" }, Mh = ["innerHTML"], Nh = /* @__PURE__ */ L({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => Ah(t.text));
		return (t, r) => (B(), V("div", {
			class: "reply-card",
			style: Ee({ "--actor": e.color })
		}, [U("div", jh, j(e.name), 1), U("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, Mh)], 4));
	}
}), Ph = { class: "card mini-card" }, Fh = { class: "card-head" }, Ih = { class: "card-title" }, Lh = { class: "card-body pre" }, Rh = /* @__PURE__ */ L({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (B(), V("div", Ph, [U("header", Fh, [
			W(F(Zm), { class: "section-icon" }),
			U("span", Ih, j(F(Y)("cards.impersonate")), 1),
			U("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => F($f)(e.text)
			}, [W(F(Km)), ca(j(F(Y)("cards.fillInput")), 1)])
		]), U("div", Lh, j(e.text), 1)]));
	}
}), zh = ["aria-label"], Bh = ["title", "onClick"], Vh = { class: "option-label" }, Hh = { class: "option-content small muted" }, Uh = /* @__PURE__ */ L({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => $f(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (B(), V("div", {
			class: "options-grid",
			role: "list",
			"aria-label": F(Y)("cards.options")
		}, [(B(!0), V(z, null, R(e.options, (e, n) => (B(), V("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: F(Y)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [U("span", Vh, j(e.label), 1), U("span", Hh, j(e.content), 1)], 8, Bh))), 128))], 8, zh));
	}
}), Wh = {
	key: 0,
	class: "memory-ops"
}, Gh = { class: "ellipsis" }, Kh = ["aria-label", "onClick"], qh = /* @__PURE__ */ L({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = il(t.preset), n = e.globalMemory.log;
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
			e.index !== void 0 && $l(il(t.preset), e.index);
		}
		return (e, t) => n.value.length ? (B(), V("div", Wh, [(B(!0), V(z, null, R(n.value, (e, t) => (B(), H(ih, {
			key: t,
			text: e.op === "delete" ? F(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: I(() => [U("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(B(), H(Hr(e.scope === "global" ? F(Cm) : F(km)), { class: "faint" })),
				U("span", Gh, j(e.key), 1),
				(B(), H(Hr(e.op === "delete" ? F(qm) : F(Fm)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": F(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [W(F(Ym))], 8, Kh)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), Jh = ["aria-label"], Yh = /* @__PURE__ */ L({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ fn(null), { open: r, bubble: i } = rh(n, () => t);
		return (t, a) => e.text ? (B(), V("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onMouseenter: a[2] ||= (e) => r.value = !0,
			onMouseleave: a[3] ||= (e) => r.value = !1
		}, [U("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: a[0] ||= is((e) => r.value = !F(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [W(F(dm))], 40, Jh), F(r) ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), Xh = { class: "card-title" }, Zh = {
	key: 0,
	class: "card-body"
}, Qh = /* @__PURE__ */ L({
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
		let t = /* @__PURE__ */ fn(e.open ?? !0);
		return (n, r) => (B(), V("section", { class: A(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [U("header", {
			class: A(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (B(), H(Hr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			U("span", Xh, j(e.title), 1),
			W(Yh, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			U("span", {
				class: "row",
				onClick: r[0] ||= is(() => {}, ["stop"])
			}, [Gr(n.$slots, "actions")]),
			e.collapsible ? (B(), H(F(cm), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (B(), V("div", Zh, [Gr(n.$slots, "default")])) : G("", !0)], 2));
	}
}), $h = {
	key: 0,
	class: "badge neutral"
}, eg = { class: "pre small" }, tg = /* @__PURE__ */ L({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (B(), H(Qh, {
			title: F(Y)("cards.recap"),
			icon: F(Vm),
			collapsible: "",
			open: !1
		}, {
			actions: I(() => [e.coversUpTo === void 0 ? G("", !0) : (B(), V("span", $h, "#0–" + j(e.coversUpTo), 1))]),
			default: I(() => [U("div", eg, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), ng = { class: "synopsis-line small" }, rg = {
	key: 0,
	class: "row tight"
}, ig = {
	key: 1,
	class: "row tight"
}, ag = { class: "synopsis-event ellipsis" }, og = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, sg = /* @__PURE__ */ L({
	__name: "SynopsisCard",
	props: { synopsis: {} },
	setup(e) {
		let t = /* @__PURE__ */ fn(!1);
		return (n, r) => (B(), V("div", {
			class: A(["synopsis", { open: t.value }]),
			onClick: r[0] ||= (e) => t.value = !t.value
		}, [U("div", ng, [
			e.synopsis.time ? (B(), V("span", rg, [W(F(pm), { class: "faint" }), ca(j(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (B(), V("span", ig, [W(F(Om), { class: "faint" }), ca(j(e.synopsis.location), 1)])) : G("", !0),
			U("span", ag, j(e.synopsis.event), 1)
		]), t.value && e.synopsis.summary ? (B(), V("div", og, j(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), cg = ["innerHTML"], lg = {
	key: 1,
	class: "kv-list small"
}, ug = { class: "pre" }, dg = /* @__PURE__ */ L({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? Ah(t.value) : "");
		return (t, r) => (B(), H(Qh, {
			title: e.title,
			icon: F(Um),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [typeof e.value == "string" ? (B(), V("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, cg)) : (B(), V("dl", lg, [(B(!0), V(z, null, R(e.value, (e, t) => (B(), V(z, { key: t }, [U("dt", null, j(t), 1), U("dd", ug, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), fg = {
	key: 0,
	class: "cards"
}, pg = /* @__PURE__ */ L({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = mh(() => t.mesid), r = K(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Oc(r, sl(r), r.narrator),
				color: ph(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: o?.type === "recap.set" ? o : null,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: Sl(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (e, t) => r.value ? (B(), V("div", fg, [
			r.value.reply ? (B(), H(Nh, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : G("", !0),
			r.value.impersonate ? (B(), H(Rh, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : G("", !0),
			r.value.options.length ? (B(), H(Uh, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : G("", !0),
			r.value.synopsis ? (B(), H(sg, {
				key: 3,
				synopsis: r.value.synopsis
			}, null, 8, ["synopsis"])) : G("", !0),
			r.value.memory.length ? (B(), H(qh, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : G("", !0),
			r.value.recap ? (B(), H(tg, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : G("", !0),
			(B(!0), V(z, null, R(r.value.custom, (e) => (B(), H(dg, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : G("", !0);
	}
}), mg = {
	key: 0,
	class: "dock stages live"
}, hg = { class: "stage-bar" }, gg = { class: "ellipsis" }, _g = {
	key: 0,
	class: "small muted"
}, vg = /* @__PURE__ */ L({
	__name: "Dock",
	setup(e) {
		let t = K(() => yf.current && !yf.current.streaming && yf.current.status === "running" ? yf.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = $c(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: fh(n, e.workflow, t.id, t.label),
				color: ph(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (B(), V("div", mg, [U("div", hg, [
			W(F(Dm), { class: "spin faint" }),
			(B(!0), V(z, null, R(n.value, (e) => (B(), V("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ee({ "--actor": e.color })
			}, [U("span", gg, j(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (B(), V("span", _g, j(F(Y)("stages.waiting")), 1))
		]), r.value ? (B(), H(dh, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), yg = ["aria-label"], bg = ["disabled"], xg = /* @__PURE__ */ L({
	__name: "Switch",
	props: /*@__PURE__*/ Qr({
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
		let t = ri(e, "modelValue");
		return (n, r) => (B(), V("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			Qn(U("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, bg), [[Yo, t.value]]),
			r[1] ||= U("span", { class: "track" }, null, -1),
			r[2] ||= U("span", { class: "thumb" }, null, -1)
		], 8, yg));
	}
});
//#endregion
//#region src/app/install.ts
function Sg(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function Cg(e, t) {
	let n = Jc(e);
	if (!n) throw Error(Y("presets.invalid"));
	if (n.minAdvancedPreset && pc("1.1.0", n.minAdvancedPreset) < 0) throw Error(Y("presets.tooNew", { version: n.minAdvancedPreset }));
	el(n), t && (q().sources[n.id] = t), J();
	let r = $c(n.id) ?? n;
	return _l(r), await Nl(r), r;
}
async function wg(e) {
	let t = await p(Sg(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return Cg(await t.json(), e.trim());
}
async function Tg(e) {
	return Cg(JSON.parse(await e.text()));
}
async function Eg(t) {
	if (tl(t), delete q().sources[t], J(), rl(t)) {
		let e = $c(t);
		e && (_l(e), await Nl(e));
		return;
	}
	let n = jl(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/components/Field.vue?vue&type=script&setup=true&lang.ts
var Dg = { class: "field-label" }, Og = { class: "ellipsis" }, kg = {
	key: 0,
	class: "dot modified"
}, Ag = { class: "field-control" }, jg = /* @__PURE__ */ L({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (B(), V("div", { class: A(["field", { inline: e.inline }]) }, [U("div", Dg, [
			U("span", Og, j(e.label), 1),
			e.modified ? (B(), V("span", kg)) : G("", !0),
			W(Yh, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), U("div", Ag, [Gr(t.$slots, "default")])], 2));
	}
}), Mg = { class: "swatches" }, Ng = ["title"], Pg = ["title"], Fg = /* @__PURE__ */ L({
	__name: "Appearance",
	setup(e) {
		let t = q().ui, n = (e) => K({
			get: () => t[e] ?? "",
			set: (n) => {
				t[e] = n || void 0, J();
			}
		}), r = n("primary"), i = n("accent"), a = K({
			get: () => t.collapseStages,
			set: (e) => {
				t.collapseStages = e, J();
			}
		}), o = () => {
			t.primary = void 0, t.accent = void 0, J();
		};
		return (e, t) => (B(), H(Qh, {
			title: F(Y)("appearance.title"),
			icon: F(Nm),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [W(jg, {
				label: F(Y)("appearance.colors"),
				help: F(Y)("appearance.colors.hint"),
				inline: ""
			}, {
				default: I(() => [U("div", Mg, [
					U("label", {
						class: "swatch",
						style: Ee({ background: F(r) || "var(--ap-primary-500)" }),
						title: F(Y)("appearance.primary")
					}, [Qn(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ P(r) ? r.value = e : null,
						type: "color"
					}, null, 512), [[
						Jo,
						F(r),
						void 0,
						{ lazy: !0 }
					]])], 12, Ng),
					U("label", {
						class: "swatch",
						style: Ee({ background: F(i) || "var(--ap-accent-500)" }),
						title: F(Y)("appearance.accent")
					}, [Qn(U("input", {
						"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ P(i) ? i.value = e : null,
						type: "color"
					}, null, 512), [[
						Jo,
						F(i),
						void 0,
						{ lazy: !0 }
					]])], 12, Pg),
					W($, {
						icon: F(zm),
						label: F(Y)("common.reset"),
						small: "",
						align: "end",
						disabled: !F(r) && !F(i),
						onClick: o
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				])]),
				_: 1
			}, 8, ["label", "help"]), W(jg, {
				label: F(Y)("appearance.collapseStages"),
				inline: ""
			}, {
				default: I(() => [W(xg, {
					modelValue: a.value,
					"onUpdate:modelValue": t[2] ||= (e) => a.value = e
				}, null, 8, ["modelValue"])]),
				_: 1
			}, 8, ["label"])]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Ig = { class: "toolbar" }, Lg = ["disabled"], Rg = ["disabled"], zg = { class: "preset-list" }, Bg = ["onClick", "onKeydown"], Vg = { class: "preset-mark" }, Hg = { class: "grow col preset-info" }, Ug = { class: "row wrap preset-head" }, Wg = { class: "preset-name" }, Gg = { class: "badge neutral" }, Kg = {
	key: 0,
	class: "xs muted"
}, qg = {
	key: 1,
	class: "small muted preset-desc"
}, Jg = {
	key: 0,
	class: "empty"
}, Yg = /* @__PURE__ */ L({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => Yc()), n = /* @__PURE__ */ fn(null), r = /* @__PURE__ */ fn(!1), i = /* @__PURE__ */ fn(""), a = /* @__PURE__ */ fn(null);
		async function o(e, t, r) {
			n.value = e;
			try {
				await t(), r && f("success", r);
			} catch (e) {
				f("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				n.value = null;
			}
		}
		let s = (e) => o(`select:${e.preset.id}`, async () => {
			await Pl(e.preset), cp();
		}), c = () => o("url", async () => {
			let e = await wg(i.value);
			return i.value = "", r.value = !1, e;
		}, Y("presets.installed")), l = (e) => {
			let t = e.target.files?.[0];
			t && o("file", () => Tg(t), Y("presets.installed")), e.target.value = "";
		}, u = (e) => o(`update:${e.preset.id}`, () => wg(q().sources[e.preset.id]), Y("presets.updated")), d = (e) => o(`remove:${e.preset.id}`, () => Eg(e.preset.id)), p = () => o("ext", async () => f("info", await Uf() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, o) => (B(), V(z, null, [
			U("div", Ig, [
				U("button", {
					type: "button",
					class: "btn",
					disabled: n.value === "file",
					onClick: o[0] ||= (e) => a.value?.click()
				}, [W(F(Xm)), ca(j(F(Y)("presets.importFile")), 1)], 8, Lg),
				U("button", {
					type: "button",
					class: A(["btn", { primary: r.value }]),
					onClick: o[1] ||= (e) => r.value = !r.value
				}, [W(F(Em)), ca(j(F(Y)("presets.importUrl")), 1)], 2),
				o[4] ||= U("span", { class: "grow" }, null, -1),
				W($, {
					icon: n.value === "ext" ? F(Dm) : F(Rm),
					label: F(Y)("presets.checkUpdates"),
					align: "end",
					disabled: n.value === "ext",
					onClick: p
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				U("input", {
					ref_key: "fileInput",
					ref: a,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: l
				}, null, 544)
			]),
			r.value ? (B(), V("form", {
				key: 0,
				class: "row",
				onSubmit: is(c, ["prevent"])
			}, [Qn(U("input", {
				"onUpdate:modelValue": o[2] ||= (e) => i.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Jo, i.value]]), U("button", {
				type: "submit",
				class: "btn primary",
				disabled: n.value === "url"
			}, [n.value === "url" ? (B(), H(F(Dm), {
				key: 0,
				class: "spin"
			})) : (B(), H(F(_m), { key: 1 })), ca(j(F(Y)("common.install")), 1)], 8, Rg)], 32)) : G("", !0),
			U("div", zg, [(B(!0), V(z, null, R(t.value, (e) => (B(), V("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: F(lp)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => s(e),
				onKeydown: os((t) => s(e), ["enter"])
			}, [
				U("span", Vg, [n.value === `select:${e.preset.id}` ? (B(), H(F(Dm), {
					key: 0,
					class: "spin"
				})) : F(lp)?.id === e.preset.id ? (B(), H(F(sm), { key: 1 })) : G("", !0)]),
				U("div", Hg, [
					U("div", Ug, [
						U("span", Wg, j(e.preset.name), 1),
						U("span", Gg, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (B(), V("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(F(Y)(`presets.source.${e.source}`)), 3))
					]),
					e.preset.author ? (B(), V("span", Kg, j(e.preset.author), 1)) : G("", !0),
					e.preset.description ? (B(), V("span", qg, j(e.preset.description), 1)) : G("", !0)
				]),
				U("div", {
					class: "row preset-actions",
					onClick: o[3] ||= is(() => {}, ["stop"])
				}, [e.source === "installed" && F(q)().sources[e.preset.id] ? (B(), H($, {
					key: 0,
					icon: F(Rm),
					label: F(Y)("presets.update"),
					align: "end",
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : G("", !0), e.source === "installed" ? (B(), H($, {
					key: 1,
					icon: F(qm),
					label: F(Y)("common.delete"),
					align: "end",
					small: "",
					danger: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : G("", !0)])
			], 42, Bg))), 128)), t.value.length ? G("", !0) : (B(), V("div", Jg, j(F(Y)("presets.none")), 1))]),
			W(Fg)
		], 64));
	}
}), Xg;
function Zg() {
	let e = lp, t = K(() => e.value ? sl(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (ll(r, t), n.sampling && (clearTimeout(Xg), Xg = setTimeout(() => void Fl(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Qg = { class: "empty" }, $g = /* @__PURE__ */ L({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (B(), V("div", Qg, [
			W(F(Mm)),
			U("span", null, j(F(Y)("panel.noPreset")), 1),
			U("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => F(Z).tab = "presets"
			}, j(F(Y)("panel.choosePreset")), 1)
		]));
	}
}), e_ = [
	"aria-checked",
	"title",
	"onClick"
], t_ = { class: "ellipsis" }, n_ = /* @__PURE__ */ L({
	__name: "Segmented",
	props: /*@__PURE__*/ Qr({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ri(e, "modelValue");
		return (n, r) => (B(), V("div", {
			class: A(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(B(!0), V(z, null, R(e.options, (e) => (B(), V("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: A({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (B(), H(Hr(e.icon), { key: 0 })) : G("", !0), U("span", t_, j(e.label), 1)], 10, e_))), 128))], 2));
	}
}), r_ = { class: "col" }, i_ = { class: "row" }, a_ = ["aria-label"], o_ = ["label"], s_ = ["value"], c_ = ["label"], l_ = ["value"], u_ = ["placeholder"], d_ = {
	key: 1,
	class: "xs muted row tight"
}, f_ = { value: "" }, p_ = ["value"], m_ = ["value"], h_ = ["value"], g_ = { class: "slider" }, __ = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], v_ = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], y_ = { class: "field-grid" }, b_ = ["value", "onChange"], x_ = ["value"], S_ = ["value"], C_ = /* @__PURE__ */ L({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Zg(), i = K(() => t.value ? il(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				ul(n, {
					kind: r,
					id: i.join(":")
				}), Fl(n);
			}
		}), o = K(() => t.value ? dl(t.value) : !1), s = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ fn(null), l = /* @__PURE__ */ fn("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? pl(e, n) : s.value && hl(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (fl(t.value), Fl(t.value));
		}, p = () => {
			t.value && s.value && (gl(t.value, s.value), Fl(t.value));
		}, m = () => {
			t.value && s.value && ml(t.value, s.value);
		}, h = K(() => hs.map((e) => ({
			value: e,
			label: Y(`transport.${e}`),
			hint: Y(`transport.${e}.hint`)
		}))), g = K({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), _ = K(() => g.value === "tool-single" || g.value === "tool-multi"), v = K(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = K(() => v.value.map((e) => ({
			value: e.id,
			label: Sl(t.value, "workflows", e.id, "name", e.name),
			hint: Sl(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), b = K({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), x = K(() => y.value.find((e) => e.value === b.value)?.hint);
		function S(e) {
			return K({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let C = S("forceTool"), ee = S("parallelTools"), w = S("sendThoughtSignature"), T = S("streamToolArguments"), te = S("finalFallback"), ne = S("maxSteps"), re = K({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ie = [
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
		], E = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], D = ["stream_openai", "show_thoughts"], ae = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], O = K(() => n.value?.sampling ?? {}), oe = (e) => e in O.value, se = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), ce = (e) => Number(e.target.value);
		return (e, r) => !F(t) || !F(n) || !i.value ? (B(), H($g, { key: 0 })) : (B(), V(z, { key: 1 }, [
			U("div", r_, [
				U("div", i_, [
					Qn(U("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": F(Y)("config.configuration")
					}, [U("optgroup", { label: F(Y)("config.recommended") }, [(B(!0), V(z, null, R(F(t).configurations, (e) => (B(), V("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(F(Sl)(F(t), "configurations", e.id, "name", e.name)), 9, s_))), 128))], 8, o_), i.value.saved.length ? (B(), V("optgroup", {
						key: 0,
						label: F(Y)("config.saved")
					}, [(B(!0), V(z, null, R(i.value.saved, (e) => (B(), V("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, l_))), 128))], 8, c_)) : G("", !0)], 8, a_), [[Zo, a.value]]),
					s.value && o.value ? (B(), H($, {
						key: 0,
						icon: F(Bm),
						label: F(Y)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: F(Im),
						label: F(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (B(), H($, {
						key: 1,
						icon: F(Fm),
						label: F(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					s.value ? (B(), H($, {
						key: 2,
						icon: F(qm),
						label: F(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: F(zm),
						label: F(Y)("config.reset"),
						align: "end",
						disabled: !o.value,
						onClick: f
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				c.value ? (B(), V("form", {
					key: 0,
					class: "row",
					onSubmit: is(d, ["prevent"])
				}, [
					Qn(U("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: F(Y)("config.name"),
						autofocus: ""
					}, null, 8, u_), [[Jo, l.value]]),
					W($, {
						icon: F($m),
						label: F(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					W($, {
						icon: F(sm),
						label: F(Y)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				o.value ? (B(), V("span", d_, [r[15] ||= U("span", { class: "dot modified" }, null, -1), ca(j(F(Y)("config.modified")), 1)])) : G("", !0)
			]),
			W(Qh, {
				title: F(Y)("config.connection"),
				icon: F(om)
			}, {
				default: I(() => [
					W(jg, {
						label: F(Y)("config.transport"),
						help: F(Y)(`transport.${g.value}.hint`)
					}, {
						default: I(() => [W(n_, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (B(), V(z, { key: 0 }, [
						W(jg, {
							label: F(Y)("config.forceTool"),
							help: F(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: I(() => [W(xg, {
								modelValue: F(C),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ P(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(jg, {
							label: F(Y)("config.parallelTools"),
							help: F(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: I(() => [W(xg, {
								modelValue: F(ee),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ P(ee) ? ee.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(jg, {
							label: F(Y)("config.syntheticTurn"),
							help: F(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: I(() => [Qn(U("select", {
								"onUpdate:modelValue": r[8] ||= (e) => re.value = e,
								class: "input"
							}, [U("option", f_, j(F(Y)("common.none")), 1), (B(!0), V(z, null, R(F(t).syntheticTurns, (e) => (B(), V("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, p_))), 128))], 512), [[Zo, re.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						W(jg, {
							label: F(Y)("config.thoughtSignature"),
							help: F(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: I(() => [W(xg, {
								modelValue: F(w),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ P(w) ? w.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(jg, {
							label: F(Y)("config.streamToolArguments"),
							help: F(Y)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: I(() => [Qn(U("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ P(T) ? T.value = e : null,
								class: "input"
							}, [(B(!0), V(z, null, R(F(gs), (e) => (B(), V("option", {
								key: e,
								value: e
							}, j(F(Y)(`config.streamToolArguments.${e}`)), 9, m_))), 128))], 512), [[Zo, F(T)]])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (B(), H(jg, {
							key: 0,
							label: F(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: I(() => [U("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: F(ne),
								onChange: r[11] ||= (e) => ne.value = ce(e)
							}, null, 40, h_)]),
							_: 1
						}, 8, ["label"])) : G("", !0)
					], 64)) : G("", !0),
					W(jg, {
						label: F(Y)("config.finalFallback"),
						help: F(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: I(() => [W(xg, {
							modelValue: F(te),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ P(te) ? te.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (B(), H(Qh, {
				key: 0,
				title: F(Y)("config.workflow"),
				icon: F(Qm),
				help: x.value
			}, {
				default: I(() => [W(n_, {
					modelValue: b.value,
					"onUpdate:modelValue": r[13] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			W(Qh, {
				title: F(Y)("config.sampling"),
				icon: F(xm),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [
					(B(), V(z, null, R(ie, (e) => (B(), V(z, { key: e.key }, [oe(e.key) ? (B(), H(jg, {
						key: 0,
						label: F(Y)(`sampling.${e.key}`)
					}, {
						default: I(() => [U("div", g_, [U("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: O.value[e.key],
							onInput: (t) => se(e.key, ce(t))
						}, null, 40, __), U("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: O.value[e.key],
							onChange: (t) => se(e.key, ce(t))
						}, null, 40, v_)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					U("div", y_, [(B(), V(z, null, R(E, (e) => (B(), V(z, { key: e }, [oe(e) ? (B(), H(jg, {
						key: 0,
						label: F(Y)(`sampling.${e}`)
					}, {
						default: I(() => [U("input", {
							class: "input",
							type: "number",
							value: O.value[e],
							onChange: (t) => se(e, ce(t))
						}, null, 40, b_)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), oe("reasoning_effort") ? (B(), H(jg, {
						key: 0,
						label: F(Y)("sampling.reasoning_effort")
					}, {
						default: I(() => [U("select", {
							class: "input",
							value: O.value.reasoning_effort,
							onChange: r[14] ||= (e) => se("reasoning_effort", e.target.value)
						}, [(B(), V(z, null, R(ae, (e) => U("option", {
							key: e,
							value: e
						}, j(F(Y)(`effort.${e}`)), 9, S_)), 64))], 40, x_)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(B(), V(z, null, R(D, (e) => (B(), V(z, { key: e }, [oe(e) ? (B(), H(jg, {
						key: 0,
						label: F(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: I(() => [W(xg, {
							"model-value": !!O.value[e],
							"onUpdate:modelValue": (t) => se(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), w_ = ["aria-checked", "onClick"], T_ = { class: "grow" }, E_ = ["aria-checked", "onClick"], D_ = { class: "grow muted" }, O_ = { class: "grow" }, k_ = { class: "ellipsis" }, A_ = {
	key: 0,
	class: "empty"
}, j_ = /* @__PURE__ */ L({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Zg(), i = K(() => t.value && n.value ? Ec(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))];
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Sl(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && Sl(e, "groups", t, "description", r?.description ?? "") || void 0,
					allowNone: !!r?.allowNone,
					choices: a.map((e) => ({
						key: e,
						modules: i.filter((t) => t.exclusive === e)
					})),
					toggles: i.filter((e) => !e.exclusive)
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Sl(t.value, "modules", e.id, "name", e.name), s = (e) => Sl(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		return (e, r) => !F(t) || !F(n) ? (B(), H($g, { key: 0 })) : (B(), V(z, { key: 1 }, [(B(!0), V(z, null, R(a.value, (e) => (B(), H(Qh, {
			key: e.id,
			title: e.label,
			help: e.help
		}, {
			default: I(() => [(B(!0), V(z, null, R(e.choices, (t) => (B(), V("div", {
				key: t.key,
				class: "choice-list",
				role: "radiogroup"
			}, [(B(!0), V(z, null, R(t.modules, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				role: "radio",
				class: A(["choice", { on: c(t) === e.id }]),
				"aria-checked": c(t) === e.id,
				onClick: (n) => l(t, e.id)
			}, [
				r[0] ||= U("span", { class: "radio" }, null, -1),
				U("span", T_, j(o(e)), 1),
				W(Yh, {
					text: s(e),
					align: "end"
				}, null, 8, ["text"])
			], 10, w_))), 128)), e.allowNone ? (B(), V("button", {
				key: 0,
				type: "button",
				role: "radio",
				class: A(["choice", { on: c(t) === null }]),
				"aria-checked": c(t) === null,
				onClick: (e) => l(t, null)
			}, [r[1] ||= U("span", { class: "radio" }, null, -1), U("span", D_, j(F(Y)("common.none")), 1)], 10, E_)) : G("", !0)]))), 128)), (B(!0), V(z, null, R(e.toggles, (e) => (B(), V("div", {
				key: e.id,
				class: "module-row"
			}, [U("span", O_, [U("span", k_, j(o(e)), 1), W(Yh, {
				text: s(e),
				align: "start"
			}, null, 8, ["text"])]), W(xg, {
				"model-value": i.value[e.id],
				label: o(e),
				"onUpdate:modelValue": (t) => u(e, t)
			}, null, 8, [
				"model-value",
				"label",
				"onUpdate:modelValue"
			])]))), 128))]),
			_: 2
		}, 1032, ["title", "help"]))), 128)), a.value.length ? G("", !0) : (B(), V("div", A_, j(F(Y)("modules.none")), 1))], 64));
	}
}), M_ = ["value", "onChange"], N_ = ["value"], P_ = {
	key: 1,
	class: "unit"
}, F_ = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], I_ = {
	key: 0,
	class: "small muted"
}, L_ = [
	"list",
	"value",
	"placeholder",
	"onChange"
], R_ = ["id"], z_ = ["value"], B_ = [
	"value",
	"placeholder",
	"onChange"
], V_ = [
	"value",
	"placeholder",
	"onChange"
], H_ = {
	key: 0,
	class: "field-grid"
}, U_ = ["value"], W_ = ["value"], G_ = ["value"], K_ = /* @__PURE__ */ L({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Zg(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Sl(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && Sl(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Sl(t.value, "params", e.id, "label", e.label), o = (e) => Sl(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => xl(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => n.value?.params[e.id] ?? e.default, l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = K(() => Object.entries(t.value?.actors ?? {})), d = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), f = K({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), p = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), m = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), h = (e) => `ap-param-${e.id}`;
		return (e, r) => !F(t) || !F(n) ? (B(), H($g, { key: 0 })) : (B(), V(z, { key: 1 }, [
			(B(!0), V(z, null, R(i.value, (e) => (B(), H(Qh, {
				key: e.id,
				title: e.label,
				help: e.help,
				icon: F(Gm)
			}, {
				default: I(() => [(B(!0), V(z, null, R(e.params, (e) => (B(), H(jg, {
					key: e.id,
					label: a(e),
					help: o(e)
				}, {
					default: I(() => [e.type === "select" ? (B(), V("select", {
						key: 0,
						class: "input",
						value: c(e),
						onChange: (t) => l(e, t.target.value)
					}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
						key: String(t.value),
						value: t.value
					}, j(s(e, t.value, t.label)), 9, N_))), 128))], 40, M_)) : e.type === "number" ? (B(), V("div", P_, [U("input", {
						class: "input",
						type: "number",
						min: e.min,
						max: e.max,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, F_), e.unit ? (B(), V("span", I_, j(e.unit), 1)) : G("", !0)])) : (B(), V(z, { key: 2 }, [U("input", {
						class: "input",
						list: e.options?.length ? h(e) : void 0,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, L_), e.options?.length ? (B(), V("datalist", {
						key: 0,
						id: h(e)
					}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
						key: String(t.value),
						value: t.value
					}, j(s(e, t.value, t.label)), 9, z_))), 128))], 8, R_)) : G("", !0)], 64))]),
					_: 2
				}, 1032, ["label", "help"]))), 128))]),
				_: 2
			}, 1032, [
				"title",
				"help",
				"icon"
			]))), 128)),
			W(Qh, {
				title: F(Y)("writing.actors"),
				icon: F(vm),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [(B(!0), V(z, null, R(u.value, ([e, t]) => (B(), V("div", {
					key: e,
					class: "field-grid"
				}, [W(jg, { label: F(Y)("writing.actorName", { actor: e }) }, {
					default: I(() => [U("input", {
						class: "input",
						value: F(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => d("names", e, t.target.value)
					}, null, 40, B_)]),
					_: 2
				}, 1032, ["label"]), W(jg, { label: F(Y)("writing.actorPrefix") }, {
					default: I(() => [U("input", {
						class: "input",
						value: F(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => d("prefixes", e, t.target.value)
					}, null, 40, V_)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Qh, {
				title: F(Y)("writing.tokenSaving"),
				icon: F(hm),
				help: F(Y)("writing.tokenSaving.hint")
			}, {
				actions: I(() => [W(xg, {
					modelValue: f.value,
					"onUpdate:modelValue": r[0] ||= (e) => f.value = e,
					label: F(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: I(() => [f.value ? (B(), V("div", H_, [W(jg, {
					label: F(Y)("writing.keepFullTurns"),
					help: F(Y)("writing.keepFullTurns.hint")
				}, {
					default: I(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).tokenSaving.keepFullTurns,
						onChange: r[1] ||= (e) => p("keepFullTurns", e.target.value)
					}, null, 40, U_)]),
					_: 1
				}, 8, ["label", "help"]), W(jg, {
					label: F(Y)("writing.truncateUserAfter"),
					help: F(Y)("writing.truncateUserAfter.hint")
				}, {
					default: I(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).tokenSaving.truncateUserAfter,
						onChange: r[2] ||= (e) => p("truncateUserAfter", e.target.value)
					}, null, 40, W_)]),
					_: 1
				}, 8, ["label", "help"])])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Qh, {
				title: F(Y)("writing.meta"),
				icon: F(Am)
			}, {
				default: I(() => [W(jg, {
					label: F(Y)("writing.recentCount"),
					help: F(Y)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: I(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: F(n).meta.recentCount,
						onChange: r[3] ||= (e) => m(e.target.value)
					}, null, 40, G_)]),
					_: 1
				}, 8, ["label", "help"])]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), q_ = { class: "kv" }, J_ = {
	key: 0,
	class: "kv-row"
}, Y_ = { class: "kv-key ellipsis" }, X_ = { class: "kv-value pre small" }, Z_ = {
	key: 0,
	class: "kv-actions"
}, Q_ = {
	key: 1,
	class: "kv-edit col"
}, $_ = ["placeholder"], ev = ["placeholder"], tv = { class: "row end" }, nv = {
	key: 0,
	class: "kv-edit col"
}, rv = ["placeholder"], iv = ["placeholder"], av = { class: "row end" }, ov = {
	key: 1,
	class: "faint small kv-empty"
}, sv = /* @__PURE__ */ L({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ fn(null), a = /* @__PURE__ */ fn(""), o = /* @__PURE__ */ fn("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (B(), V("div", q_, [
			(B(!0), V(z, null, R(e.entries, (t, l) => (B(), V(z, { key: l }, [i.value === l ? (B(), V("div", Q_, [
				Qn(U("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Y)("memory.key")
				}, null, 8, $_), [[Jo, a.value]]),
				Qn(U("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Y)("memory.content")
				}, null, 8, ev), [[Jo, o.value]]),
				U("div", tv, [W($, {
					icon: F($m),
					label: F(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: F(sm),
					label: F(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (B(), V("div", J_, [
				U("div", Y_, j(l), 1),
				U("div", X_, j(t), 1),
				e.readonly ? G("", !0) : (B(), V("div", Z_, [W($, {
					icon: F(Fm),
					label: F(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), W($, {
					icon: F(qm),
					label: F(Y)("common.delete"),
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
			i.value === "" ? (B(), V("div", nv, [
				Qn(U("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Y)("memory.key")
				}, null, 8, rv), [[Jo, a.value]]),
				Qn(U("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Y)("memory.content")
				}, null, 8, iv), [[Jo, o.value]]),
				U("div", av, [W($, {
					icon: F($m),
					label: F(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: F(sm),
					label: F(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (B(), V("div", ov, j(F(Y)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (B(), V("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [W(F(Im)), ca(j(F(Y)("common.add")), 1)])) : G("", !0)
		]));
	}
}), cv = {
	key: 1,
	class: "faint small"
}, lv = {
	key: 0,
	class: "badge neutral"
}, uv = ["placeholder"], dv = {
	key: 1,
	class: "faint small"
}, fv = /* @__PURE__ */ L({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Zg(), r = K(() => n.value ? il(n.value) : null), i = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = K(() => (Z.chatRev, i.value ? Wl() : {})), o = K(() => r.value ? ql(r.value) : {}), s = K(() => (Z.chatRev, i.value ? Gl() : null));
		async function c(e, t) {
			await Kl({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), sp();
		}
		async function l(e) {
			await Kl({
				type: "memory.delete",
				key: e,
				source: "user"
			}), sp();
		}
		let u = (e, t) => r.value && Jl(r.value, "replace", e, t, "user"), d = (e) => r.value && Jl(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ fn("");
		ar(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = K(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Kl({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), sp();
		}
		return (e, t) => !F(n) || !r.value ? (B(), H($g, { key: 0 })) : (B(), V(z, { key: 1 }, [
			W(Qh, {
				title: F(Y)("memory.chat"),
				icon: F(km),
				help: F(Y)("memory.chat.hint")
			}, {
				default: I(() => [i.value ? (B(), H(sv, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (B(), V("div", cv, j(F(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Qh, {
				title: F(Y)("memory.global"),
				icon: F(Cm),
				help: F(Y)("memory.global.hint")
			}, {
				actions: I(() => [W($, {
					icon: F(Ym),
					label: F(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !F(Yl)(r.value),
					onClick: t[0] ||= (e) => F(Zl)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), W($, {
					icon: F(Lm),
					label: F(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !F(Xl)(r.value),
					onClick: t[1] ||= (e) => F(Ql)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: I(() => [W(sv, {
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
			W(Qh, {
				title: F(Y)("memory.recap"),
				icon: F(Vm),
				help: F(Y)("memory.recap.hint")
			}, {
				actions: I(() => [s.value ? (B(), V("span", lv, "#0–" + j(s.value.coversUpTo), 1)) : G("", !0), i.value ? (B(), H($, {
					key: 1,
					icon: F(sm),
					label: F(Y)("common.save"),
					small: "",
					align: "end",
					disabled: !p.value,
					active: "",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : G("", !0)]),
				default: I(() => [i.value ? Qn((B(), V("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: F(Y)("memory.recap.empty")
				}, null, 8, uv)), [[Jo, f.value]]) : (B(), V("div", dv, j(F(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), pv = { class: "row tight xs muted" }, mv = { class: "row" }, hv = {
	key: 0,
	class: "xs text-danger"
}, gv = { class: "row wrap xs muted" }, _v = { class: "badge neutral" }, vv = {
	key: 0,
	class: "badge neutral"
}, yv = { class: "badge neutral" }, bv = {
	key: 1,
	class: "badge warn"
}, xv = ["onClick"], Sv = { class: "grow mono" }, Cv = { class: "xs muted" }, wv = { class: "row xs muted" }, Tv = { class: "badge neutral" }, Ev = { class: "pre mono scroll" }, Dv = {
	key: 0,
	class: "xs faint region-msg"
}, Ov = {
	key: 0,
	class: "xs text-warning"
}, kv = {
	key: 1,
	class: "faint small"
}, Av = ["onClick"], jv = { class: "mono grow ellipsis" }, Mv = {
	key: 0,
	class: "badge warn"
}, Nv = { class: "xs muted" }, Pv = { class: "xs muted" }, Fv = { class: "row xs muted" }, Iv = { class: "grow" }, Lv = { class: "mono scroll" }, Rv = { class: "row xs muted" }, zv = { class: "grow" }, Bv = { class: "mono scroll" }, Vv = {
	key: 0,
	class: "faint small"
}, Hv = { class: "row xs" }, Uv = { class: "badge neutral" }, Wv = { class: "muted" }, Gv = { class: "mono scroll" }, Kv = {
	key: 0,
	class: "faint small"
}, qv = { class: "xs faint mono build" }, Jv = /* @__PURE__ */ L({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => Su.log.find((e) => e.kind === "assembly")?.data), r = /* @__PURE__ */ en(/* @__PURE__ */ new Set()), i = (e) => r.has(e) ? r.delete(e) : r.add(e), a = /* @__PURE__ */ en({});
		ar(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (a[i] === void 0 && r) try {
					a[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let o = /* @__PURE__ */ fn(null), s = (e) => typeof e == "string" ? c(e) : JSON.stringify(e, null, 2);
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
		}, f = K({
			get: () => q().dev.enabled,
			set: (e) => {
				q().dev.enabled = e, J();
			}
		}), p = K({
			get: () => q().dev.url,
			set: (e) => {
				q().dev.url = e.trim(), J();
			}
		}), m = K(() => Su.log.filter((e) => e.kind !== "assembly"));
		return (e, t) => (B(), V(z, null, [
			W(Qh, {
				title: F(Y)("debug.dev"),
				icon: F(Hm),
				help: F(Y)("debug.dev.hint")
			}, {
				actions: I(() => [U("span", pv, [U("span", { class: A(["dot status-dot", F(Gf).status]) }, null, 2), ca(j(F(Y)(`debug.dev.${F(Gf).status}`)), 1)])]),
				default: I(() => [W(jg, { label: F(Y)("debug.dev.url") }, {
					default: I(() => [U("div", mv, [Qn(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => p.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Jo,
						p.value,
						void 0,
						{ lazy: !0 }
					]]), W(xg, {
						modelValue: f.value,
						"onUpdate:modelValue": t[1] ||= (e) => f.value = e,
						label: F(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), F(Gf).error ? (B(), V("span", hv, j(F(Gf).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Qh, {
				title: F(Y)("debug.assembly"),
				icon: F(bm),
				collapsible: ""
			}, {
				default: I(() => [n.value ? (B(), V(z, { key: 0 }, [
					U("div", gv, [
						U("span", _v, j(F(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (B(), V("span", vv, j(n.value.workflow), 1)) : G("", !0),
						U("span", yv, j(n.value.origin), 1),
						n.value.dryRun ? (B(), V("span", bv, "dry run")) : G("", !0),
						t[3] ||= U("span", { class: "grow" }, null, -1),
						ca(j(l(n.value.at)), 1)
					]),
					U("div", null, [(B(!0), V(z, null, R(n.value.regions, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => i(e.id)
					}, [
						W(F(lm), { class: A(["faint caret", { open: r.has(e.id) }]) }, null, 8, ["class"]),
						U("span", Sv, j(e.id), 1),
						U("span", Cv, j(e.messages.length) + " · " + j(a[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(a[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, xv), r.has(e.id) ? (B(), V(z, { key: 0 }, [(B(!0), V(z, null, R(e.messages, (e, t) => (B(), V("div", {
						key: t,
						class: "region-msg"
					}, [U("div", wv, [U("span", Tv, j(e.role), 1), ca(j(e.chars) + " ch", 1)]), U("div", Ev, j(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (B(), V("div", Dv, j(F(Y)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.warnings.length ? (B(), V("div", Ov, j(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (B(), V("div", kv, j(F(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Qh, {
				title: F(Y)("debug.requests"),
				icon: F(mm),
				collapsible: ""
			}, {
				default: I(() => [(B(!0), V(z, null, R(F(Su).requests, (e, t) => (B(), V("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [U("div", {
					class: "row small clickable",
					onClick: (e) => o.value = o.value === t ? null : t
				}, [
					U("span", jv, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (B(), V("span", Mv, j(F(Y)("debug.error")), 1)) : G("", !0),
					U("span", Nv, j(d(e.usage)), 1),
					U("span", Pv, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, Av), o.value === t ? (B(), V(z, { key: 0 }, [
					U("div", Fv, [U("span", Iv, j(F(Y)("debug.request")), 1), W($, {
						icon: F(gm),
						label: F(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", Lv, j(s(e.request)), 1),
					U("div", Rv, [U("span", zv, j(F(Y)("debug.response")), 1), W($, {
						icon: F(gm),
						label: F(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", Bv, j(e.error ?? s(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), F(Su).requests.length ? G("", !0) : (B(), V("div", Vv, j(F(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Qh, {
				title: F(Y)("debug.log"),
				icon: F(Vm),
				collapsible: "",
				open: !1
			}, {
				actions: I(() => [W($, {
					icon: F(qm),
					label: F(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => F(Su).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: I(() => [(B(!0), V(z, null, R(m.value, (e, n) => (B(), V("div", {
					key: n,
					class: "req"
				}, [U("div", Hv, [
					U("span", Uv, j(e.kind), 1),
					t[4] ||= U("span", { class: "grow" }, null, -1),
					U("span", Wv, j(l(e.at)), 1)
				]), U("pre", Gv, j(s(e.data)), 1)]))), 128)), m.value.length ? G("", !0) : (B(), V("div", Kv, j(F(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U("div", qv, "Advanced Preset " + j(F("1.1.0")) + " · " + j(F("f77547eb825425b6")), 1)
		], 64));
	}
}), Yv = ["aria-label"], Xv = { class: "panel-head" }, Zv = { class: "panel-logo" }, Qv = { class: "grow" }, $v = { class: "panel-title ellipsis" }, ey = { class: "panel-sub ellipsis" }, ty = {
	class: "tabs",
	role: "tablist"
}, ny = [
	"title",
	"aria-selected",
	"onClick"
], ry = { class: "panel-body scroll" }, iy = /* @__PURE__ */ L({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Mm,
				view: Yg
			},
			{
				id: "config",
				icon: Wm,
				view: C_
			},
			{
				id: "modules",
				icon: rm,
				view: j_
			},
			{
				id: "writing",
				icon: Pm,
				view: K_
			},
			{
				id: "memory",
				icon: im,
				view: fv
			},
			{
				id: "debug",
				icon: am,
				view: Jv
			}
		], n = K(() => t.find((e) => e.id === Z.tab) ?? t[0]), r = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), i = K(() => {
			let e = lp.value;
			return e ? `v${e.version} · ${up.value.config}` : Y("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return Lr(() => document.addEventListener("keydown", a)), zr(() => document.removeEventListener("keydown", a)), (e, a) => (B(), H(Xa, { name: "panel" }, {
			default: I(() => [F(Z).panelOpen ? (B(), V("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": F(Y)("app.name")
			}, [
				U("header", Xv, [
					U("div", Zv, [W(F(Tm))]),
					U("div", Qv, [U("div", $v, j(F(lp)?.name ?? F(Y)("app.name")), 1), U("div", ey, j(i.value), 1)]),
					W(xg, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: F(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					W($, {
						icon: F($m),
						label: F(Y)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => F(Z).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				U("nav", ty, [(B(), V(z, null, R(t, (e) => U("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: A(["tab", { on: e.id === F(Z).tab }]),
					title: F(Y)(`tab.${e.id}`),
					"aria-selected": e.id === F(Z).tab,
					onClick: (t) => F(Z).tab = e.id
				}, [(B(), H(Hr(e.icon))), U("span", null, j(F(Y)(`tab.${e.id}`)), 1)], 10, ny)), 64))]),
				U("main", ry, [(B(), H(jr, null, [(B(), H(Hr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, Yv)) : G("", !0)]),
			_: 1
		}));
	}
}), ay = { class: "inline-drawer" }, oy = { class: "inline-drawer-toggle inline-drawer-header" }, sy = { class: "inline-drawer-content" }, cy = { class: "flex-container alignItemsCenter spaceBetween" }, ly = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, uy = { key: 0 }, dy = { class: "text_muted" }, fy = {
	key: 1,
	class: "text_muted"
}, py = /* @__PURE__ */ L({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (B(), V("div", ay, [U("div", oy, [U("b", null, j(F(Y)("app.name")), 1), n[3] ||= U("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), U("div", sy, [
			U("div", cy, [U("label", ly, [Qn(U("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Yo, t.value]]), U("span", null, j(F(Y)("settings.enable")), 1)]), U("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => F(pp)(),
				onKeydown: n[2] ||= os((e) => F(pp)(), ["enter"])
			}, [n[4] ||= U("i", { class: "fa-solid fa-layer-group" }, null, -1), U("span", null, j(F(Y)("panel.open")), 1)], 32)]),
			n[5] ||= U("hr", null, null, -1),
			U("h4", null, j(F(Y)("settings.preset")), 1),
			F(lp) ? (B(), V("div", uy, [ca(j(F(lp).name) + " ", 1), U("span", dy, "v" + j(F(lp).version) + " · " + j(F(up).config), 1)])) : (B(), V("i", fy, j(F(Y)("settings.inactive")), 1))
		])]));
	}
});
//#endregion
//#region src/ui/index.ts
function my() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), us(py).mount(t);
}
function hy() {
	Dp("ap-stages", Ch, ["mesid"]), Dp("ap-cards", pg, ["mesid"]), Dp("ap-dock", vg), Dp("ap-panel", iy), Tp(), cp();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, cp);
	Kp(), my(), zp();
}
//#endregion
//#region src/index.ts
var gy = {
	version: "1.1.0",
	buildId: "f77547eb825425b6",
	nextGeneration: (e) => nu(e),
	listPresets: () => Yc().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Ol(),
	update: Uf
};
globalThis.advancedPresetInterceptor = xu, window.AdvancedPreset = gy;
function _y(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function vy() {
	for (let { preset: e } of Yc()) try {
		await Nl(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function yy() {
	let { eventSource: t, eventTypes: n } = e();
	q(), Nf(), np(), await i(), await qc();
	for (let { preset: e } of Yc()) {
		let t = _l(e);
		t.length && wu("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Iu(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Pf(e)), t.on(n.MESSAGE_RECEIVED, (e, t) => Lf(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		fu.setPending(null), fu.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => fu.sweep());
	let r = _y(() => {
		let e = Ol(), t = e ? $c(e) : void 0;
		t && Ll(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await vy(), Xf(), Vf();
	};
	t.on(n.APP_READY, () => void a()), hy(), wu("init", {
		version: "1.1.0",
		build: "f77547eb825425b6",
		enabled: q().enabled
	});
}
var by = Hf;
yy().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { by as advancedPresetOnUpdate };

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
function o(e) {
	return {
		chatCompletionSource: String(e.chat_completion_source ?? ""),
		model: e.model ?? null,
		customApiFormat: e.custom_api_format ?? null,
		opencodeApiFormat: e.opencode_api_format ?? null
	};
}
function s(e, n, r) {
	let i = typeof r == "string" ? { chatCompletionSource: r } : r;
	if (t.getStreamingReply) return t.getStreamingReply(e, n, {
		...i,
		overrideShowThoughts: !0
	});
	switch (c(i)) {
		case "claude": return n.reasoning += e?.delta?.thinking ?? "", e?.delta?.text ?? "";
		case "gemini": {
			let t = e?.candidates?.[0]?.content?.parts ?? [];
			return n.reasoning += t.filter((e) => e.thought).map((e) => e.text).join(""), t.filter((e) => !e.thought).map((e) => e.text ?? "").join("");
		}
		case "cohere": return e?.delta?.message?.content?.text ?? "";
		default: {
			let t = e?.choices?.[0]?.delta;
			return n.reasoning += t?.reasoning_content ?? t?.reasoning ?? "", t?.content ?? e?.choices?.[0]?.message?.content ?? "";
		}
	}
}
function c(e) {
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
var l = [
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
function u(e) {
	let n = c(e), r = t.getStreamingReply;
	if (!r) return n;
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
	return [n, ...l.map(([e]) => e).filter((e) => e !== n)].find((e) => i(l.find(([t]) => t === e)[1])) ?? n;
}
function d(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var f = (...e) => globalThis.fetch(...e), p = (e) => {
	f = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function m(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var h = {}, g = [], _ = () => {}, v = () => !1, y = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), b = (e) => e.startsWith("onUpdate:"), x = Object.assign, S = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, C = Object.prototype.hasOwnProperty, w = (e, t) => C.call(e, t), T = Array.isArray, ee = (e) => oe(e) === "[object Map]", E = (e) => oe(e) === "[object Set]", te = (e) => oe(e) === "[object Date]", ne = (e) => oe(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", re = (e) => typeof e == "symbol", k = (e) => typeof e == "object" && !!e, ie = (e) => (k(e) || D(e)) && D(e.then) && D(e.catch), ae = Object.prototype.toString, oe = (e) => ae.call(e), se = (e) => oe(e).slice(8, -1), ce = (e) => oe(e) === "[object Object]", le = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ue = /* @__PURE__ */ m(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), de = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, fe = /-\w/g, pe = de((e) => e.replace(fe, (e) => e.slice(1).toUpperCase())), me = /\B([A-Z])/g, he = de((e) => e.replace(me, "-$1").toLowerCase()), ge = de((e) => e.charAt(0).toUpperCase() + e.slice(1)), _e = de((e) => e ? `on${ge(e)}` : ""), ve = (e, t) => !Object.is(e, t), ye = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, be = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, xe = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Se = (e) => {
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Ce, we = () => Ce ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Te(e) {
	if (T(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? ke(r) : Te(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (O(e) || k(e)) return e;
}
var Ee = /;(?![^(]*\))/g, De = /:([^]+)/, Oe = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function ke(e) {
	let t = {};
	return e.replace(Oe, (e) => e.startsWith("/*") ? "" : e).split(Ee).forEach((e) => {
		if (e) {
			let n = e.split(De);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function A(e) {
	let t = "";
	if (O(e)) t = e;
	else if (T(e)) for (let n = 0; n < e.length; n++) {
		let r = A(e[n]);
		r && (t += r + " ");
	}
	else if (k(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ae = /* @__PURE__ */ m("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function je(e) {
	return !!e || e === "";
}
function Me(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Ie(e[i], t[i], n);
	return r;
}
function Ne(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Ie(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Pe(e, t, n) {
	let r = ee(e), i = ee(t);
	if (r || i || (r = E(e), i = E(t), r || i)) return r && i ? Ne(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Ie(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Fe(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Ie(e, t, n) {
	if (e === t) return !0;
	let r = te(e), i = te(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = re(e), i = re(t), r || i ? e === t : (r = T(e), i = T(t), r || i ? r && i ? Fe(e, t, n, Me) : !1 : (r = k(e), i = k(t), r || i ? !r || !i ? !1 : Fe(e, t, n, Pe) : String(e) === String(t))));
}
function Le(e, t) {
	return e.findIndex((e) => Ie(e, t));
}
var Re = (e) => !!(e && e.__v_isRef === !0), j = (e) => O(e) ? e : e == null ? "" : T(e) || k(e) && (e.toString === ae || !D(e.toString)) ? Re(e) ? j(e.value) : JSON.stringify(e, ze, 2) : String(e), ze = (e, t) => Re(t) ? ze(e, t.value) : ee(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Be(t, r) + " =>"] = n, e), {}) } : E(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Be(e)) } : re(t) ? Be(t) : k(t) && !T(t) && !ce(t) ? String(t) : t, Be = (e, t = "") => re(e) ? `Symbol(${e.description ?? t})` : e, Ve, He = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Ve && (Ve.active ? (this.parent = Ve, this.index = (Ve.scopes || (Ve.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Ve;
			try {
				return Ve = this, e();
			} finally {
				Ve = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Ve, Ve = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Ve === this) Ve = this.prevScope;
			else {
				let e = Ve;
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
function Ue() {
	return Ve;
}
var M, We = /* @__PURE__ */ new WeakSet(), Ge = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ve && (Ve.active ? Ve.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, We.has(this) && (We.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ye(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, ct(this), Qe(this);
		let e = M, t = it;
		M = this, it = !0;
		try {
			return this.fn();
		} finally {
			$e(this), M = e, it = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) nt(e);
			this.deps = this.depsTail = void 0, ct(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? We.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		et(this) && this.run();
	}
	get dirty() {
		return et(this);
	}
}, Ke = 0, qe, Je;
function Ye(e, t = !1) {
	e.flags |= 8, t ? (e.next = Je, Je = e) : (e.next = qe, qe = e);
}
function Xe() {
	Ke++;
}
function Ze() {
	if (--Ke > 0) return;
	if (Je) {
		let e = Je;
		for (Je = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; qe;) {
		let t = qe;
		for (qe = void 0; t;) {
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
function Qe(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function $e(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), nt(r), rt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function et(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (tt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function tt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === lt) || (e.globalVersion = lt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !et(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = M, r = it;
	M = e, it = !0;
	try {
		Qe(e);
		let n = e.fn(e._value);
		(t.version === 0 || ve(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		M = n, it = r, $e(e), e.flags &= -3;
	}
}
function nt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) nt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function rt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var it = !0, at = [];
function ot() {
	at.push(it), it = !1;
}
function st() {
	let e = at.pop();
	it = e === void 0 || e;
}
function ct(e) {
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
var lt = 0, ut = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, dt = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!M || !it || M === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== M) t = this.activeLink = new ut(M, this), M.deps ? (t.prevDep = M.depsTail, M.depsTail.nextDep = t, M.depsTail = t) : M.deps = M.depsTail = t, ft(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = M.depsTail, t.nextDep = void 0, M.depsTail.nextDep = t, M.depsTail = t, M.deps === t && (M.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, lt++, this.notify(e);
	}
	notify(e) {
		Xe();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Ze();
		}
	}
};
function ft(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) ft(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var pt = /* @__PURE__ */ new WeakMap(), mt = /* @__PURE__ */ Symbol(""), ht = /* @__PURE__ */ Symbol(""), gt = /* @__PURE__ */ Symbol("");
function _t(e, t, n) {
	if (it && M) {
		let t = pt.get(e);
		t || pt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new dt()), r.map = t, r.key = n), r.track();
	}
}
function vt(e, t, n, r, i, a) {
	let o = pt.get(e);
	if (!o) {
		lt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Xe(), t === "clear") o.forEach(s);
	else {
		let i = T(e), a = i && le(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === gt || !re(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(gt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(mt)), ee(e) && s(o.get(ht)));
				break;
			case "delete":
				i || (s(o.get(mt)), ee(e) && s(o.get(ht)));
				break;
			case "set": ee(e) && s(o.get(mt));
		}
	}
	Ze();
}
function yt(e) {
	let t = /* @__PURE__ */ N(e);
	return t === e || (_t(t, "iterate", gt), /* @__PURE__ */ on(e)) ? t : /* @__PURE__ */ an(e) ? /* @__PURE__ */ rn(e) ? t.map((e) => un(ln(e))) : t.map(un) : t.map(ln);
}
function bt(e) {
	return _t(e = /* @__PURE__ */ N(e), "iterate", gt), e;
}
function xt(e, t) {
	return /* @__PURE__ */ an(e) ? un(/* @__PURE__ */ rn(e) ? ln(t) : t) : ln(t);
}
var St = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ct(this, Symbol.iterator, (e) => xt(this, e));
	},
	concat(...e) {
		return yt(this).concat(...e.map((e) => T(e) ? yt(e) : e));
	},
	entries() {
		return Ct(this, "entries", (e) => (e[1] = xt(this, e[1]), e));
	},
	every(e, t) {
		return Et(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Et(this, "filter", e, t, (e) => e.map((e) => xt(this, e)), arguments);
	},
	find(e, t) {
		return Et(this, "find", e, t, (e) => xt(this, e), arguments);
	},
	findIndex(e, t) {
		return Et(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Et(this, "findLast", e, t, (e) => xt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Et(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Et(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Ot(this, "includes", e);
	},
	indexOf(...e) {
		return Ot(this, "indexOf", e);
	},
	join(e) {
		return yt(this).join(e);
	},
	lastIndexOf(...e) {
		return Ot(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Et(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return kt(this, "pop");
	},
	push(...e) {
		return kt(this, "push", e);
	},
	reduce(e, ...t) {
		return Dt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Dt(this, "reduceRight", e, t);
	},
	shift() {
		return kt(this, "shift");
	},
	some(e, t) {
		return Et(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return kt(this, "splice", e);
	},
	toReversed() {
		return yt(this).toReversed();
	},
	toSorted(e) {
		return yt(this).toSorted(e);
	},
	toSpliced(...e) {
		return yt(this).toSpliced(...e);
	},
	unshift(...e) {
		return kt(this, "unshift", e);
	},
	values() {
		return Ct(this, "values", (e) => xt(this, e));
	}
};
function Ct(e, t, n) {
	let r = bt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ on(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => wt(a.next(), n), i !== Tt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => wt(a._next(), n);
	}
	return a;
}
function wt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Tt = Array.prototype;
function Et(e, t, n, r, i, a) {
	let o = bt(e), s = o !== e && !/* @__PURE__ */ on(e), c = o[t];
	if (c !== Tt[t]) {
		let t = c.apply(e, a);
		return s ? ln(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, xt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Dt(e, t, n, r) {
	let i = bt(e), a = i !== e && !/* @__PURE__ */ on(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = xt(e, t)), n.call(this, t, xt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? xt(e, c) : c;
}
function Ot(e, t, n) {
	let r = /* @__PURE__ */ N(e);
	_t(r, "iterate", gt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ sn(n[0]) ? (n[0] = /* @__PURE__ */ N(n[0]), r[t](...n)) : i;
}
function kt(e, t, n = []) {
	ot(), Xe();
	let r = (/* @__PURE__ */ N(e))[t].apply(e, n);
	return Ze(), st(), r;
}
var At = /* @__PURE__ */ m("__proto__,__v_isRef,__isVue"), jt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(re));
function Mt(e) {
	re(e) || (e = String(e));
	let t = /* @__PURE__ */ N(this);
	return _t(t, "has", e), t.hasOwnProperty(e);
}
var Nt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Zt : Xt : i ? Yt : Jt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = T(e);
		if (!r) {
			let e;
			if (a && (e = St[t])) return e;
			if (t === "hasOwnProperty") return Mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ P(e) ? e : n);
		if ((re(t) ? jt.has(t) : At(t)) || (r || _t(e, "get", t), i)) return o;
		if (/* @__PURE__ */ P(o)) {
			let e = a && le(t) ? o : o.value;
			return r && k(e) ? /* @__PURE__ */ tn(e) : e;
		}
		return k(o) ? r ? /* @__PURE__ */ tn(o) : /* @__PURE__ */ $t(o) : o;
	}
}, Pt = class extends Nt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = T(e) && le(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ an(i);
			if (!/* @__PURE__ */ on(n) && !/* @__PURE__ */ an(n) && (i = /* @__PURE__ */ N(i), n = /* @__PURE__ */ N(n)), !a && /* @__PURE__ */ P(i) && !/* @__PURE__ */ P(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : w(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ P(e) ? e : r);
		return e === /* @__PURE__ */ N(r) && s && (o ? ve(n, i) && vt(e, "set", t, n, i) : vt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = w(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && vt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!re(t) || !jt.has(t)) && _t(e, "has", t), n;
	}
	ownKeys(e) {
		return _t(e, "iterate", T(e) ? "length" : mt), Reflect.ownKeys(e);
	}
}, Ft = class extends Nt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, It = /* @__PURE__ */ new Pt(), Lt = /* @__PURE__ */ new Ft(), Rt = /* @__PURE__ */ new Pt(!0), zt = (e) => e, Bt = (e) => Reflect.getPrototypeOf(e);
function Vt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ N(i), o = ee(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? zt : t ? un : ln;
		return !t && _t(a, "iterate", c ? ht : mt), x(Object.create(l), { next() {
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
function Ht(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Ut(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ N(r), a = /* @__PURE__ */ N(n);
			e || (ve(n, a) && _t(i, "get", n), _t(i, "get", a));
			let { has: o } = Bt(i), s = t ? zt : e ? un : ln;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && _t(/* @__PURE__ */ N(t), "iterate", mt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ N(n), i = /* @__PURE__ */ N(t);
			return e || (ve(t, i) && _t(r, "has", t), _t(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ N(a), s = t ? zt : e ? un : ln;
			return !e && _t(o, "iterate", mt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return x(n, e ? {
		add: Ht("add"),
		set: Ht("set"),
		delete: Ht("delete"),
		clear: Ht("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ N(this), r = Bt(n), i = /* @__PURE__ */ N(e), a = !t && !/* @__PURE__ */ on(e) && !/* @__PURE__ */ an(e) ? i : e;
			return r.has.call(n, a) || ve(e, a) && r.has.call(n, e) || ve(i, a) && r.has.call(n, i) || (n.add(a), vt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ on(n) && !/* @__PURE__ */ an(n) && (n = /* @__PURE__ */ N(n));
			let r = /* @__PURE__ */ N(this), { has: i, get: a } = Bt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ N(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ve(n, s) && vt(r, "set", e, n, s) : vt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ N(this), { has: n, get: r } = Bt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ N(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && vt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ N(this), t = e.size !== 0, n = e.clear();
			return t && vt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Vt(r, e, t);
	}), n;
}
function Wt(e, t) {
	let n = Ut(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(w(n, i) && i in r ? n : r, i, a);
}
var Gt = { get: /* @__PURE__ */ Wt(!1, !1) }, Kt = { get: /* @__PURE__ */ Wt(!1, !0) }, qt = { get: /* @__PURE__ */ Wt(!0, !1) }, Jt = /* @__PURE__ */ new WeakMap(), Yt = /* @__PURE__ */ new WeakMap(), Xt = /* @__PURE__ */ new WeakMap(), Zt = /* @__PURE__ */ new WeakMap();
function Qt(e) {
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
function $t(e) {
	return /* @__PURE__ */ an(e) ? e : nn(e, !1, It, Gt, Jt);
}
// @__NO_SIDE_EFFECTS__
function en(e) {
	return nn(e, !1, Rt, Kt, Yt);
}
// @__NO_SIDE_EFFECTS__
function tn(e) {
	return nn(e, !0, Lt, qt, Xt);
}
function nn(e, t, n, r, i) {
	if (!k(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Qt(se(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function rn(e) {
	return /* @__PURE__ */ an(e) ? /* @__PURE__ */ rn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function an(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function on(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function sn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ N(t) : e;
}
function cn(e) {
	return !w(e, "__v_skip") && Object.isExtensible(e) && be(e, "__v_skip", !0), e;
}
var ln = (e) => k(e) ? /* @__PURE__ */ $t(e) : e, un = (e) => k(e) ? /* @__PURE__ */ tn(e) : e;
// @__NO_SIDE_EFFECTS__
function P(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return fn(e, !1);
}
function fn(e, t) {
	return /* @__PURE__ */ P(e) ? e : new pn(e, t);
}
var pn = class {
	constructor(e, t) {
		this.dep = new dt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ N(e), this._value = t ? e : ln(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ on(e) || /* @__PURE__ */ an(e);
		e = n ? e : /* @__PURE__ */ N(e), ve(e, t) && (this._rawValue = e, this._value = n ? e : ln(e), this.dep.trigger());
	}
};
function F(e) {
	return /* @__PURE__ */ P(e) ? e.value : e;
}
var mn = {
	get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ P(i) && !/* @__PURE__ */ P(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function hn(e) {
	return /* @__PURE__ */ rn(e) ? e : new Proxy(e, mn);
}
var gn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new dt(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function _n(e) {
	return new gn(e);
}
var vn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new dt(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = lt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && M !== this) return Ye(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return tt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function yn(e, t, n = !1) {
	let r, i;
	return D(e) ? r = e : (r = e.get, i = e.set), new vn(r, i, n);
}
var bn = {}, xn = /* @__PURE__ */ new WeakMap(), Sn = void 0;
function Cn(e, t = !1, n = Sn) {
	if (n) {
		let t = xn.get(n);
		t || xn.set(n, t = []), t.push(e);
	}
}
function wn(e, t, n = h) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ on(e) || i === !1 || i === 0 ? Tn(e, 1) : Tn(e), u, d, f, p, m = !1, g = !1;
	if (/* @__PURE__ */ P(e) ? (d = () => e.value, m = /* @__PURE__ */ on(e)) : /* @__PURE__ */ rn(e) ? (d = () => l(e), m = !0) : T(e) ? (g = !0, m = e.some((e) => /* @__PURE__ */ rn(e) || /* @__PURE__ */ on(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ P(e)) return e.value;
		if (/* @__PURE__ */ rn(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			ot();
			try {
				f();
			} finally {
				st();
			}
		}
		let t = Sn;
		Sn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Sn = t;
		}
	} : _, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Tn(e(), t);
	}
	let v = Ue(), y = () => {
		u.stop(), v && v.active && S(v.effects, u);
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
	let b = g ? Array(e.length).fill(bn) : bn, x = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (g ? n.some((e, t) => ve(e, b[t])) : ve(n, b))) {
					let e = Sn;
					ot();
					try {
						f && f(), Sn = u;
						let e = [
							n,
							b === bn ? void 0 : g && b[0] === bn ? [] : b,
							p
						];
						b = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Sn = e, st();
					}
				}
			} else u.run();
		}
	};
	return s && s(x), u = new Ge(d), u.scheduler = o ? () => o(x, !1) : x, p = (e) => Cn(e, !1, u), f = u.onStop = () => {
		let e = xn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			xn.delete(u);
		}
	}, t ? r ? x(!0) : b = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), y.pause = u.pause.bind(u), y.resume = u.resume.bind(u), y.stop = y, y;
}
function Tn(e, t = Infinity, n) {
	if (t <= 0 || !k(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ P(e)) Tn(e.value, t, n);
	else if (T(e)) for (let r = 0; r < e.length; r++) Tn(e[r], t, n);
	else if (E(e) || ee(e)) e.forEach((e) => {
		Tn(e, t, n);
	});
	else if (ce(e)) {
		for (let r in e) Tn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Tn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function En(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		On(e, t, n);
	}
}
function Dn(e, t, n, r) {
	if (D(e)) {
		let i = En(e, t, n, r);
		return i && ie(i) && i.catch((e) => {
			On(e, t, n);
		}), i;
	}
	if (T(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Dn(e[a], t, n, r));
		return i;
	}
}
function On(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || h;
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
			ot(), En(a, null, 10, [
				e,
				i,
				o
			]), st();
			return;
		}
	}
	kn(e, n, i, r, o);
}
function kn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var An = [], jn = -1, Mn = [], Nn = null, Pn = 0, Fn = /* @__PURE__ */ Promise.resolve(), In = null;
function Ln(e) {
	let t = In || Fn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Rn(e) {
	let t = jn + 1, n = An.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = An[r], a = Kn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function zn(e) {
	if (!(e.flags & 1)) {
		let t = Kn(e), n = An[An.length - 1];
		!n || !(e.flags & 2) && t >= Kn(n) ? An.push(e) : An.splice(Rn(t), 0, e), e.flags |= 1, Bn();
	}
}
function Bn() {
	In ||= Fn.then(qn);
}
function Vn(e) {
	if (!T(e)) Nn && e.id === -1 ? Nn.splice(Pn + 1, 0, e) : e.flags & 1 || (Mn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Mn.push(e[t]);
	Bn();
}
function Hn(e, t, n, r = jn + 1) {
	for (; r < An.length; r++) {
		let n = An[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			An.splice(r, 1), r = e ? r - 1 : jn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Un(e, t, n = 0) {
	if (Mn.length) {
		let e = Mn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Mn.length; i++) {
				let a = Mn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Mn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Kn(e) - Kn(t));
		if (Mn.length = r, Nn) {
			for (let e = 0; e < i.length; e++) Nn.push(i[e]);
			return;
		}
		for (Nn = i, Pn = 0; Pn < Nn.length; Pn++) {
			let e = Nn[Pn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Nn = null, Pn = 0;
	}
}
var Wn = !1;
function Gn(e, t) {
	if (Wn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Mn);
	e(), Wn = !0;
	try {
		Hn(void 0, t), Un(void 0, n, t);
	} finally {
		Wn = !1;
	}
}
var Kn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function qn(e) {
	try {
		for (jn = 0; jn < An.length; jn++) {
			let e = An[jn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), En(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; jn < An.length; jn++) {
			let e = An[jn];
			e && (e.flags &= -2);
		}
		jn = -1, An.length = 0, Un(e), In = null, (An.length || Mn.length) && qn(e);
	}
}
var Jn = null, Yn = null;
function Xn(e) {
	let t = Jn;
	return Jn = e, Yn = e && e.type.__scopeId || null, t;
}
function I(e, t = Jn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Qi(-1);
		let i = Xn(t), a = Ji.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ji.length; e > a; e--) Xi();
			Xn(i), r._d && Qi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function Zn(e, t) {
	if (Jn === null) return e;
	let n = ja(Jn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = h] = t[e];
		i && (D(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Tn(a), r.push({
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
function Qn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ot(), Dn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), st());
	}
}
function $n(e, t, n = !1) {
	let r = va();
	if (r || ti) {
		let i = ti ? ti._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var er = /* @__PURE__ */ Symbol.for("v-scx"), tr = () => $n(er);
function nr(e, t) {
	return ar(e, null, t);
}
function rr(e, t) {
	return ar(e, null, { flush: "sync" });
}
function ir(e, t, n) {
	return ar(e, t, n);
}
function ar(e, t, n = h) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = x({}, n), c = t && r || !t && a !== "post", l;
	if (wa) {
		if (a === "sync") {
			let e = tr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = _, e.resume = _, e.pause = _, e;
		}
	}
	let u = _a;
	s.call = (e, t, n) => Dn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Mi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : zn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = wn(e, t, s);
	return wa && (l ? l.push(f) : c && f()), f;
}
var or = /* @__PURE__ */ Symbol("_vte"), sr = (e) => e.__isTeleport, cr = /* @__PURE__ */ Symbol("_leaveCb"), lr = /* @__PURE__ */ Symbol("_enterCb");
function ur() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Ir(() => {
		e.isMounted = !0;
	}), Rr(() => {
		e.isUnmounting = !0;
	}), e;
}
var dr = [Function, Array], fr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: dr,
	onEnter: dr,
	onAfterEnter: dr,
	onEnterCancelled: dr,
	onBeforeLeave: dr,
	onLeave: dr,
	onAfterLeave: dr,
	onLeaveCancelled: dr,
	onBeforeAppear: dr,
	onAppear: dr,
	onAfterAppear: dr,
	onAppearCancelled: dr
}, pr = {
	name: "BaseTransition",
	props: fr,
	setup(e, { slots: t }) {
		let n = va(), r = ur();
		return () => {
			let i = t.default && xr(t.default(), !0), a = i && i.length ? mr(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ N(e), { mode: s } = o;
			if (r.isLeaving) return vr(a);
			let c = yr(a);
			if (!c) return vr(a);
			let l = _r(c, o, r, n, (e) => l = e);
			c.type !== Ki && br(c, l);
			let u = n.subTree && yr(n.subTree);
			if (u && u.type !== Ki && !ta(u, c) && Sr(n.subTree)) {
				let e = _r(u, o, r, n);
				if (br(u, e), s === "out-in" && c.type !== Ki) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, vr(a);
				s === "in-out" && c.type !== Ki ? e.delayLeave = (e, t, n) => {
					let i = gr(r, u);
					i[String(u.key)] = u, e[cr] = () => {
						t(), e[cr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function mr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Ki) {
			t = n;
			break;
		}
	}
	return t;
}
var hr = pr;
function gr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function _r(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = gr(n, e), S = (e, t) => {
		e && Dn(e, r, 9, t);
	}, C = (e, t) => {
		let n = t[1];
		S(e, t), T(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, w = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[cr] && t[cr](!0);
			let i = x[b];
			if (i && ta(e, i)) {
				let e = i.el[cr];
				if (!e) {
					let t = Sr(i);
					e = t && t.el[cr];
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
			t[lr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), w.delayedLeave && w.delayedLeave(), t[lr] = void 0);
			};
			let c = t[lr].bind(null, !1);
			r ? C(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[lr] && t[lr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[cr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[cr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[cr].bind(null, !1);
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = _r(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return w;
}
function vr(e) {
	if (kr(e)) return e = oa(e), e.children = null, e;
}
function yr(e) {
	if (!kr(e)) return sr(e.type) && e.children ? mr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function br(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		br(sr(n.type) && yr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === z && T(e.children)) {
		let n = ci(e.children, !1);
		n && br(n, t);
	}
}
function xr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === z ? (o.patchFlag & 128 && i++, r = r.concat(xr(o.children, t, s))) : (t || o.type !== Ki) && r.push(s == null ? o : oa(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Sr(e) {
	if (e.component) return Sr(e.component.subTree);
	if (e.type === z) {
		let t = T(e.children) && ci(e.children, !1);
		return t ? Sr(t) : void 0;
	}
	if (e.type !== Ki) return e;
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return D(e) ? /* @__PURE__ */ x({ name: e.name }, t, { setup: e }) : e;
}
function Cr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function wr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Tr = /* @__PURE__ */ new WeakMap();
function Er(e, t, n, r, i = !1) {
	if (T(e)) {
		e.forEach((e, a) => Er(e, t && (T(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Or(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Er(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? ja(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === h ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ N(d), p = d === h ? v : (e) => !wr(u, e) && w(f, e), m = (e, t) => !(t && wr(u, t));
	if (l != null && l !== c) {
		if (Dr(t), O(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ P(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) En(c, s, 12, [o, u]);
	else {
		let t = O(c), r = /* @__PURE__ */ P(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) T(n) && S(n, a);
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
					s(), Tr.delete(e);
				};
				t.id = -1, Tr.set(e, t), Mi(t, n);
			} else Dr(e), s();
		}
	}
}
function Dr(e) {
	let t = Tr.get(e);
	t && (t.flags |= 8, Tr.delete(e));
}
we().requestIdleCallback, we().cancelIdleCallback;
var Or = (e) => !!e.type.__asyncLoader, kr = (e) => e.type.__isKeepAlive, Ar = {
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
		let n = va(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Mi(() => {
				a.isDeactivated = !1, a.a && ye(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && fa(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Vi(t.m), Vi(t.a), l(e, f, null, 1, s), Mi(() => {
				t.da && ye(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && fa(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Mr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ma(Or(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ta(t, o)) ? p(t) : o && (Mr(o), t && Mr(t)), i.delete(e), a.delete(e);
		}
		ir(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => jr(e, t)), t && m((e) => !jr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (Ui(n.subTree.type) ? Mi(() => {
				let e = Nr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Nr(n.subTree)));
		};
		return Ir(_), Lr(_), Rr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Nr(t);
				if (e.type === i.type && e.key === i.key) {
					Mr(i);
					let e = i.component.da;
					e && Mi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ea(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Nr(r);
			if (s.type === Ki) return o = null, s;
			let c = s.type, l = Ma(Or(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !jr(u, l)) || d && l && jr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = oa(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && br(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, Ui(r.type) ? r : s;
		};
	}
};
function jr(e, t) {
	return T(e) ? e.some((e) => jr(e, t)) : O(e) ? e.split(",").includes(t) : ne(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Mr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Nr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Pr(e, t, n = _a, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ot();
			let i = xa(n), a = Dn(t, n, e, r);
			return i(), st(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Fr = (e) => (t, n = _a) => {
	(!wa || e === "sp") && Pr(e, (...e) => t(...e), n);
}, Ir = Fr("m"), Lr = Fr("u"), Rr = Fr("bum"), zr = "components", Br = /* @__PURE__ */ Symbol.for("v-ndc");
function Vr(e) {
	return O(e) ? Hr(zr, e, !1) || e : e || Br;
}
function Hr(e, t, n = !0, r = !1) {
	let i = Jn || _a;
	if (i) {
		let n = i.type;
		if (e === zr) {
			let e = Ma(n, !1);
			if (e && (e === t || e === pe(t) || e === ge(pe(t)))) return n;
		}
		let a = Ur(i[e] || n[e], t) || Ur(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Ur(e, t) {
	return e && (e[t] || e[pe(t)] || e[ge(pe(t))]);
}
function R(e, t, n, r) {
	let i, a = n && n[r], o = T(e);
	if (o || O(e)) {
		let n = o && /* @__PURE__ */ rn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ on(e), s = /* @__PURE__ */ an(e), e = bt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? un(ln(e[n])) : ln(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (k(e)) {
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
function Wr(e, t, n, r, i, a) {
	if (n ??= {}, Jn.ce || Jn.parent && Or(Jn.parent) && Jn.parent.ce) {
		let e = a != null && n.key == null ? x({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), B(), H(z, null, [W("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Ji.length;
	B();
	let c;
	try {
		let i = o && Gr(o(n)), s = n.key || a || i && i.key;
		c = H(z, { key: (s && !re(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Ji.length; e > s; e--) Xi();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Gr(e) {
	return e.some((e) => !ea(e) || !(e.type === Ki || e.type === z && !Gr(e.children))) ? e : null;
}
var Kr = (e) => e ? Ca(e) ? ja(e) : Kr(e.parent) : null, qr = /* @__PURE__ */ x(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Kr(e.parent),
	$root: (e) => Kr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		zn(e.update);
	},
	$nextTick: (e) => e.n ||= Ln.bind(e.proxy),
	$watch: (e) => _
}), Jr = (e, t) => e !== h && !e.__isScriptSetup && w(e, t), Yr = {
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
			else if (Jr(r, t)) return o[t] = 1, r[t];
			else if (w(a, t)) return o[t] = 3, a[t];
			else if (n !== h && w(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = qr[t], u, d;
		if (l) return t === "$attrs" && _t(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== h && w(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, w(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Jr(i, t) ? (i[t] = n, !0) : w(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Jr(t, s) || w(a, s) || w(r, s) || w(qr, s) || w(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? w(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function Xr(e) {
	return T(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function Zr(e, t) {
	return !e || !t ? e || t : T(e) && T(t) ? e.concat(t) : x({}, Xr(e), Xr(t));
}
function Qr() {
	return {
		app: null,
		config: {
			isNativeTag: v,
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
var $r = 0;
function ei(e, t) {
	return function(n, r = null) {
		D(n) || (n = x({}, n)), r != null && !k(r) && (r = null);
		let i = Qr(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: $r++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: Fa,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && D(e.install) ? (a.add(e), e.install(c, ...t)) : D(e) && (a.add(e), e(c, ...t))), c;
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
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, ja(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Dn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ti;
				ti = c;
				try {
					return e();
				} finally {
					ti = t;
				}
			}
		};
		return c;
	};
}
var ti = null;
function ni(e, t, n = h) {
	let r = va(), i = pe(t), a = he(t), o = ri(e, i), s = _n((o, s) => {
		let c, l = h, u;
		return rr(() => {
			let t = e[i];
			ve(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!ve(o, c) && !(l !== h && ve(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), ve(e, l) && (ve(e, o) && !ve(o, u) || f && l !== h && !ve(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || h : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var ri = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${pe(t)}Modifiers`] || e[`${he(t)}Modifiers`];
function ii(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || h, i = n, a = t.startsWith("update:"), o = a && ri(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = i.map(xe)));
	let s, c = r[s = _e(t)] || r[s = _e(pe(t))];
	!c && a && (c = r[s = _e(he(t))]), c && Dn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Dn(l, e, 6, i);
	}
}
function ai(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (T(a) ? a.forEach((e) => o[e] = null) : x(o, a), k(e) && r.set(e, o), o) : (k(e) && r.set(e, null), null);
}
function oi(e, t) {
	return !e || !y(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), w(e, t[0].toLowerCase() + t.slice(1)) || w(e, he(t)) || w(e, t));
}
function si(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = Xn(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ca(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = ca(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : li(s);
		}
	} catch (t) {
		Ji.length = 0, On(t, e, 1), _ = W(Ki);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(b) && (v = ui(v, a)), y = oa(y, v, !1, !0));
	}
	return n.dirs && (y = oa(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && br(sr(y.type) && yr(y) || y, n.transition), _ = y, Xn(g), _;
}
function ci(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ea(r)) {
			if (r.type !== Ki || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var li = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || y(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ui = (e, t) => {
	let n = {};
	for (let r in e) (!b(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function di(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? fi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (pi(o, r, n) && !oi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || fi(r, o, l) : !!o;
	return !1;
}
function fi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!w(e, a) || pi(t, e, a) && !oi(n, a)) return !0;
	}
	return !1;
}
function pi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && k(r) && k(i) ? !Ie(r, i) : r !== i;
}
function mi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var hi = {}, gi = () => Object.create(hi), _i = (e) => Object.getPrototypeOf(e) === hi;
function vi(e, t, n, r = !1) {
	let i = {}, a = gi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), bi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ en(i) : e.type.props ? i : a, e.attrs = a;
}
function yi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ N(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (oi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (w(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = pe(o);
						i[t] = xi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		bi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !w(t, a) && ((r = he(a)) === a || !w(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = xi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !w(t, e)) && (delete a[e], l = !0);
	}
	l && vt(e.attrs, "set", "");
}
function bi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ue(c)) continue;
		let l = t[c], u;
		i && w(i, u = pe(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : oi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ N(n), r = s || h;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = xi(i, t, s, r[s], e, !w(r, s));
		}
	}
	return o;
}
function xi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = w(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = xa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === he(n)) && (r = !0));
	}
	return r;
}
function Si(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return k(e) && r.set(e, g), g;
	if (T(a)) for (let e = 0; e < a.length; e++) {
		let t = pe(a[e]);
		Ci(t) && (o[t] = h);
	}
	else if (a) for (let e in a) {
		let t = pe(e);
		if (Ci(t)) {
			let n = a[e], r = o[t] = T(n) || D(n) ? { type: n } : x({}, n), i = r.type, c = !1, l = !0;
			if (T(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = D(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = D(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || w(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return k(e) && r.set(e, c), c;
}
function Ci(e) {
	return e[0] !== "$" && !ue(e);
}
var wi = (e) => e === "_" || e === "_ctx" || e === "$stable", Ti = (e) => T(e) ? e.map(ca) : [ca(e)], Ei = (e, t, n) => {
	if (t._n) return t;
	let r = I((...e) => Ti(t(...e)), n);
	return r._c = !1, r;
}, Di = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (wi(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = Ei(n, i, r);
		else if (i != null) {
			let e = Ti(i);
			t[n] = () => e;
		}
	}
}, Oi = (e, t) => {
	let n = Ti(t);
	e.slots.default = () => n;
}, ki = (e, t, n) => {
	for (let r in t) (n || !wi(r)) && (e[r] = t[r]);
}, Ai = (e, t, n) => {
	let r = e.slots = gi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ki(r, t, n), n && be(r, "_", e, !0)) : Di(t, r);
	} else t && Oi(e, t);
}, ji = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = h;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : ki(i, t, n) : (a = !t.$stable, Di(t, i)), o = t;
	} else t && (Oi(e, t), o = { default: 1 });
	if (a) for (let e in i) !wi(e) && o[e] == null && delete i[e];
}, Mi = Wi;
function Ni(e) {
	return Pi(e);
}
function Pi(e, t) {
	let n = we();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = _, insertStaticContent: m } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ta(e, t) && (r = _e(e), fe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === g && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Gi:
				y(e, t, n, r);
				break;
			case Ki:
				b(e, t, n, r);
				break;
			case qi:
				e ?? x(t, n, r, o);
				break;
			case z:
				O(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? re(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? Er(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Er(e.ref, null, a, e, !0);
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
	}, w = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) T(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), te(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && E(e.children, f, null, i, s, Fi(e, c), l, d), _ && Qn(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ue(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && fa(p, i, e);
		}
		_ && Qn(e, null, i, "beforeMount");
		let v = Li(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Mi(() => {
			try {
				p && fa(p, i, e), v && g.enter(f), _ && Qn(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ui(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, E = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? la(e[l]) : ca(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, te = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || h, m = t.props || h, g;
		if (n && Ii(n, !1), (g = m.onVnodeBeforeUpdate) && fa(g, n, t, e), f && Qn(t, e, n, "beforeUpdate"), n && Ii(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ne(e.dynamicChildren, d, c, n, r, Fi(t, i), o) : s || se(e, t, c, null, n, r, Fi(t, i), o, !1), l > 0) {
			if (l & 16) D(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && D(c, p, m, n, i);
		((g = m.onVnodeUpdated) || f) && Mi(() => {
			g && fa(g, n, t, e), f && Qn(t, e, n, "updated");
		}, r);
	}, ne = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Hi(c), f = u && (c.type === z || !ta(c, l) || c.shapeFlag & 198) ? d(u) : n;
			v(c, l, f, null, r, i, a, o, !0);
		}
	}, D = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== h) for (let o in t) !ue(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ue(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, O = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), E(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ne(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ri(e, t, !0)) : se(e, t, n, f, a, o, c, l, u);
	}, re = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : k(t, n, r, i, a, o, c) : ie(e, t, c);
	}, k = (e, t, n, r, i, a, o) => {
		let s = e.component = ga(e, r, i);
		if (kr(e) && (s.ctx.renderer = be), Ta(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ae, o, a), !e.el) {
				let r = s.subTree = W(Ki);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ae(s, e, t, n, i, a, o);
	}, ie = (e, t, n) => {
		let r = t.component = e.component;
		if (di(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, ae = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Bi(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							Mi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Ii(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && ye(n), (f = t.props && t.props.onVnodeBeforeUpdate) && fa(f, s, t, c), Ii(e, !0);
				let p = si(e), m = e.subTree;
				e.subTree = p, v(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && mi(e, p.el), r && Mi(r, i), (f = t.props && t.props.onVnodeUpdated) && Mi(() => fa(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Or(t);
				if (Ii(e, !1), l && ye(l), !m && (o = c && c.onVnodeBeforeMount) && fa(o, d, t), Ii(e, !0), s && Se) {
					let t = () => {
						e.subTree = si(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = si(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Mi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Mi(() => fa(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Or(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Mi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ge(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => zn(u), Ii(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, yi(e, t.props, r, n), ji(e, t.children, n), ot(), Hn(e), st();
	}, se = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				le(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				ce(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && ge(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? le(l, f, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && E(f, n, r, i, a, o, s, c));
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		e ||= g, t ||= g;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? la(t[f]) : ca(t[f]);
			v(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ge(e, i, a, !0, !1, d) : E(t, n, r, i, a, o, s, c, d);
	}, le = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? la(t[l]) : ca(t[l]);
			if (ta(r, u)) v(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? la(t[f]) : ca(t[f]);
			if (ta(r, l)) v(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) v(null, t[l] = c ? la(t[l]) : ca(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) fe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, h = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? la(t[l]) : ca(t[l]);
				e.key != null && h.set(e.key, l);
			}
			let _, y = 0, b = f - m + 1, x = !1, S = 0, C = Array(b);
			for (l = 0; l < b; l++) C[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (y >= b) {
					fe(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = h.get(r.key);
				else for (_ = m; _ <= f; _++) if (C[_ - m] === 0 && ta(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? fe(r, i, a, !0) : (C[u - m] = l + 1, u >= S ? S = u : x = !0, v(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let w = x ? zi(C) : g;
			for (_ = w.length - 1, l = b - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Hi(f) : r;
				C[l] === 0 ? v(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? de(d, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, be);
		else if (c === z) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === qi) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[cr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Mi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[cr];
					s._isLeaving && s[cr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (ot(), Er(s, null, n, e, !0), st()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Or(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && fa(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && Qn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Mi(() => {
			_ && fa(_, t, e), h && Qn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === z;
		if (o && !a) {
			me(n, r);
			return;
		}
		if (t === qi) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Sr(e) : e, c = () => {
			o ? d(n) && me(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, me = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Vi(c), Vi(l), r && ye(r), i.stop(), a ? (a.flags |= 8, fe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, fe(o, e, t, n)), s && Mi(s, t), Mi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[or];
		return n ? f(n) : t;
	}, ve = (e, t, n) => {
		Gn(() => {
			e == null ? t._vnode && fe(t._vnode, null, null, !0) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ha());
	}, be = {
		p: v,
		um: fe,
		m: de,
		r: pe,
		mt: k,
		mc: E,
		pc: se,
		pbc: ne,
		n: _e,
		o: e
	}, xe, Se;
	return t && ([xe, Se] = t(be)), {
		render: ve,
		hydrate: xe,
		createApp: ei(ve, xe)
	};
}
function Fi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Ii({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Li(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ri(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (T(r) && T(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = la(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ri(t, a)), a.type === Gi && (a.patchFlag === -1 && (a = i[e] = la(a)), a.el = t.el), a.type === Ki && !a.el && (a.el = t.el);
	}
}
function zi(e) {
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
function Bi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Bi(t);
}
function Vi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Hi(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Hi(t.subTree) : null;
}
var Ui = (e) => e.__isSuspense;
function Wi(e, t) {
	t && t.pendingBranch ? T(e) ? t.effects.push(...e) : t.effects.push(e) : Vn(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Gi = /* @__PURE__ */ Symbol.for("v-txt"), Ki = /* @__PURE__ */ Symbol.for("v-cmt"), qi = /* @__PURE__ */ Symbol.for("v-stc"), Ji = [], Yi = null;
function B(e = !1) {
	Ji.push(Yi = e ? null : []);
}
function Xi() {
	Ji.pop(), Yi = Ji[Ji.length - 1] || null;
}
var Zi = 1;
function Qi(e, t = !1) {
	Zi += e, e < 0 && Yi && t && (Yi.hasOnce = !0);
}
function $i(e) {
	return e.dynamicChildren = Zi > 0 ? Yi || g : null, Xi(), Zi > 0 && Yi && Yi.push(e), e;
}
function V(e, t, n, r, i, a) {
	return $i(U(e, t, n, r, i, a, !0));
}
function H(e, t, n, r, i) {
	return $i(W(e, t, n, r, i, !0));
}
function ea(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ta(e, t) {
	return e.type === t.type && e.key === t.key;
}
var na = ({ key: e }) => e ?? null, ra = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ P(e) || D(e) ? {
	i: Jn,
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
		key: t && na(t),
		ref: t && ra(t),
		scopeId: Yn,
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
		ctx: Jn
	};
	return s ? (ua(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), Zi > 0 && !o && Yi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Yi.push(c), c;
}
var W = ia;
function ia(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Br) && (e = Ki), ea(e)) {
		let r = oa(e, t, !0);
		return n && ua(r, n), Zi > 0 && !a && Yi && (r.shapeFlag & 6 ? Yi[Yi.indexOf(e)] = r : Yi.push(r)), r.patchFlag = -2, r;
	}
	if (Na(e) && (e = e.__vccOpts), t) {
		t = aa(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = A(e)), k(n) && (/* @__PURE__ */ sn(n) && !T(n) && (n = x({}, n)), t.style = Te(n));
	}
	let o = O(e) ? 1 : Ui(e) ? 128 : sr(e) ? 64 : k(e) ? 4 : D(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function aa(e) {
	return e ? /* @__PURE__ */ sn(e) || _i(e) ? x({}, e) : e : null;
}
function oa(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? da(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && na(l),
		ref: t && t.ref ? n && a ? T(a) ? a.concat(ra(t)) : [a, ra(t)] : ra(t) : a,
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
		ssContent: e.ssContent && oa(e.ssContent),
		ssFallback: e.ssFallback && oa(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && br(u, c.clone(u)), u;
}
function sa(e = " ", t = 0) {
	return W(Gi, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (B(), H(Ki, null, e)) : W(Ki, null, e);
}
function ca(e) {
	return e == null || typeof e == "boolean" ? W(Ki) : T(e) ? W(z, null, e.slice()) : ea(e) ? la(e) : W(Gi, null, String(e));
}
function la(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : oa(e);
}
function ua(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (T(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ua(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !_i(t) ? t._ctx = Jn : r === 3 && Jn && (Jn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			ua(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Jn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [sa(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function da(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = A([t.class, r.class]));
		else if (e === "style") t.style = Te([t.style, r.style]);
		else if (y(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(T(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !b(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function fa(e, t, n, r = null) {
	Dn(e, t, 7, [n, r]);
}
var pa = Qr(), ma = 0;
function ha() {
	return ma;
}
function ga(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || pa, a = {
		uid: ma++,
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
		scope: new He(!0),
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
		propsOptions: Si(r, i),
		emitsOptions: ai(r, i),
		emit: null,
		emitted: null,
		propsDefaults: h,
		inheritAttrs: r.inheritAttrs,
		ctx: h,
		data: h,
		props: h,
		attrs: h,
		slots: h,
		refs: h,
		setupState: h,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ii.bind(null, a), e.ce && e.ce(a), a;
}
var _a = null, va = () => _a || Jn, ya, ba;
{
	let e = we(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ya = t("__VUE_INSTANCE_SETTERS__", (e) => _a = e), ba = t("__VUE_SSR_SETTERS__", (e) => wa = e);
}
var xa = (e) => {
	let t = _a;
	return ya(e), e.scope.on(), () => {
		e.scope.off(), ya(t);
	};
}, Sa = () => {
	_a && _a.scope.off(), ya(null);
};
function Ca(e) {
	return e.vnode.shapeFlag & 4;
}
var wa = !1;
function Ta(e, t = !1, n = !1) {
	t && ba(t);
	let { props: r, children: i } = e.vnode, a = Ca(e);
	vi(e, r, a, t), Ai(e, i, n || t);
	let o = a ? Ea(e, t) : void 0;
	return t && ba(!1), o;
}
function Ea(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Yr);
	let { setup: r } = n;
	if (r) {
		ot();
		let n = e.setupContext = r.length > 1 ? Aa(e) : null, i = xa(e), a = En(r, e, 0, [e.props, n]), o = ie(a);
		if (st(), i(), (o || e.sp) && !Or(e) && Cr(e), o) {
			if (a.then(Sa, Sa), t) return a.then((n) => {
				ba(!0);
				try {
					Da(e, n, t);
				} finally {
					ba(!1);
				}
			}).catch((t) => {
				On(t, e, 0);
			});
			e.asyncDep = a;
		} else Da(e, a, t);
	} else Oa(e, t);
}
function Da(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : k(t) && (e.setupState = hn(t)), Oa(e, n);
}
function Oa(e, t, n) {
	let r = e.type;
	e.render ||= r.render || _;
}
var ka = { get(e, t) {
	return _t(e, "get", ""), e[t];
} };
function Aa(e) {
	return {
		attrs: new Proxy(e.attrs, ka),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function ja(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(hn(cn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in qr) return qr[n](e);
		},
		has(e, t) {
			return t in e || t in qr;
		}
	}) : e.proxy;
}
function Ma(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Na(e) {
	return D(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ yn(e, t, wa);
function Pa(e, t, n) {
	try {
		Qi(-1);
		let r = arguments.length;
		return r === 2 ? k(t) && !T(t) ? ea(t) ? W(e, null, [t]) : W(e, t) : W(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ea(n) && (n = [n]), W(e, t, n));
	} finally {
		Qi(1);
	}
}
var Fa = "3.5.44", Ia = void 0, La = typeof window < "u" && window.trustedTypes;
if (La) try {
	Ia = /* @__PURE__ */ La.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ra = Ia ? (e) => Ia.createHTML(e) : (e) => e, za = "http://www.w3.org/2000/svg", Ba = "http://www.w3.org/1998/Math/MathML", Va = typeof document < "u" ? document : null, Ha = Va && /* @__PURE__ */ Va.createElement("template"), Ua = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Va.createElementNS(za, e) : t === "mathml" ? Va.createElementNS(Ba, e) : n ? Va.createElement(e, { is: n }) : Va.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Va.createTextNode(e),
	createComment: (e) => Va.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Va.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ha.innerHTML = Ra(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ha.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Wa = "transition", Ga = "animation", Ka = /* @__PURE__ */ Symbol("_vtc"), qa = {
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
}, Ja = /* @__PURE__ */ x({}, fr, qa), Ya = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Ja, e))((e, { slots: t }) => Pa(hr, Qa(e), t)), Xa = (e, t = []) => {
	T(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, Za = (e) => e ? T(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function Qa(e) {
	let t = {};
	for (let n in e) n in qa || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = $a(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: S, onBeforeAppear: C = _, onAppear: w = v, onAppearCancelled: T = y } = t, ee = (e, t, n, r) => {
		e._enterCancelled = r, no(e, t ? u : s), no(e, t ? l : o), n && n();
	}, E = (e, t) => {
		e._isLeaving = !1, no(e, d), no(e, p), no(e, f), t && t();
	}, te = (e) => (t, n) => {
		let i = e ? w : v, o = () => ee(t, e, n);
		Xa(i, [t, o]), ro(() => {
			no(t, e ? c : a), to(t, e ? u : s), Za(i) || ao(t, r, h, o);
		});
	};
	return x(t, {
		onBeforeEnter(e) {
			Xa(_, [e]), to(e, a), to(e, o);
		},
		onBeforeAppear(e) {
			Xa(C, [e]), to(e, c), to(e, l);
		},
		onEnter: te(!1),
		onAppear: te(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => E(e, t);
			to(e, d), e._enterCancelled ? (to(e, f), lo(e)) : (lo(e), to(e, f)), ro(() => {
				e._isLeaving && (no(e, d), to(e, p), Za(b) || ao(e, r, g, n));
			}), Xa(b, [e, n]);
		},
		onEnterCancelled(e) {
			ee(e, !1, void 0, !0), Xa(y, [e]);
		},
		onAppearCancelled(e) {
			ee(e, !0, void 0, !0), Xa(T, [e]);
		},
		onLeaveCancelled(e) {
			E(e), Xa(S, [e]);
		}
	});
}
function $a(e) {
	if (e == null) return null;
	if (k(e)) return [eo(e.enter), eo(e.leave)];
	{
		let t = eo(e);
		return [t, t];
	}
}
function eo(e) {
	return Se(e);
}
function to(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Ka] || (e[Ka] = /* @__PURE__ */ new Set())).add(t);
}
function no(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Ka];
	n && (n.delete(t), n.size || (e[Ka] = void 0));
}
function ro(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var io = 0;
function ao(e, t, n, r) {
	let i = e._endId = ++io, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = oo(e, t);
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
function oo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Wa}Delay`), a = r(`${Wa}Duration`), o = so(i, a), s = r(`${Ga}Delay`), c = r(`${Ga}Duration`), l = so(s, c), u = null, d = 0, f = 0;
	t === Wa ? o > 0 && (u = Wa, d = o, f = a.length) : t === Ga ? l > 0 && (u = Ga, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Wa : Ga : null, f = u ? u === Wa ? a.length : c.length : 0);
	let p = u === Wa && /\b(?:transform|all)(?:,|$)/.test(r(`${Wa}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function so(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => co(t) + co(e[n])));
}
function co(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function lo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function uo(e, t, n) {
	let r = e[Ka];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var fo = /* @__PURE__ */ Symbol("_vod"), po = /* @__PURE__ */ Symbol("_vsh"), mo = /* @__PURE__ */ Symbol(""), ho = /(?:^|;)\s*display\s*:/;
function go(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? vo(r, t, "");
			}
			else for (let e in t) n[e] ?? vo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? vo(r, i, "") : So(e, i, !O(t) && t ? t[i] : void 0, o) || vo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[mo];
			e && (n += ";" + e), r.cssText = n, a = ho.test(n);
		}
	} else t && e.removeAttribute("style");
	fo in e && ((!i || t !== n) && (e[fo] = a ? r.display : ""), e[po] && (r.display = "none"));
}
var _o = /\s*!important$/;
function vo(e, t, n) {
	if (T(n)) n.forEach((n) => vo(e, t, n));
	else if (n ??= "", t.startsWith("--")) _o.test(n) ? e.setProperty(t, n.replace(_o, ""), "important") : e.setProperty(t, n);
	else {
		let r = xo(e, t);
		_o.test(n) ? e.setProperty(he(r), n.replace(_o, ""), "important") : e[r] = n;
	}
}
var yo = [
	"Webkit",
	"Moz",
	"ms"
], bo = {};
function xo(e, t) {
	let n = bo[t];
	if (n) return n;
	let r = pe(t);
	if (r !== "filter" && r in e) return bo[t] = r;
	r = ge(r);
	for (let n = 0; n < yo.length; n++) {
		let i = yo[n] + r;
		if (i in e) return bo[t] = i;
	}
	return t;
}
function So(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var Co = "http://www.w3.org/1999/xlink";
function wo(e, t, n, r, i, a = Ae(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Co, t.slice(6, t.length)) : e.setAttributeNS(Co, t, n) : n == null || a && !je(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : re(n) ? String(n) : n);
}
function To(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ra(n) : n);
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
		r === "boolean" ? n = je(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Eo(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Do(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Oo = /* @__PURE__ */ Symbol("_vei");
function ko(e, t, n, r, i = null) {
	let a = e[Oo] || (e[Oo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Mo(t);
		r ? Eo(e, n, a[t] = Io(r, i), s) : o && (Do(e, n, o, s), a[t] = void 0);
	}
}
var Ao = /(Once|Passive|Capture)$/, jo = /^on:?(?:Once|Passive|Capture)$/;
function Mo(e) {
	let t, n;
	for (; (n = e.match(Ao)) && !jo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : he(e.slice(2)), t];
}
var No = 0, Po = /* @__PURE__ */ Promise.resolve(), Fo = () => No ||= (Po.then(() => No = 0), Date.now());
function Io(e, t) {
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
				e && Dn(e, t, 5, a);
			}
		} else Dn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Fo(), n;
}
var Lo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ro = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? uo(e, r, o) : t === "style" ? go(e, n, r) : y(t) ? b(t) || ko(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : zo(e, t, r, o)) ? (To(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && wo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Bo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? To(e, pe(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), wo(e, t, r, o));
};
function zo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Lo(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Lo(t) && O(n) ? !1 : t in e;
}
function Bo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = pe(t);
	return Array.isArray(n) ? n.some((e) => pe(e) === r) : Object.keys(n).some((e) => pe(e) === r);
}
var Vo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return T(t) ? (e) => ye(t, e) : t;
};
function Ho(e) {
	e.target.composing = !0;
}
function Uo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Wo = /* @__PURE__ */ Symbol("_assign"), Go = /* @__PURE__ */ Symbol("_initialValue");
function Ko(e, t, n) {
	return t && (e = e.trim()), n && (e = xe(e)), e;
}
var qo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Go] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Go] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Wo] = Vo(i);
		let a = r || i.props && i.props.type === "number";
		Eo(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Wo](Ko(e.value, n, a));
		}), (n || a) && Eo(e, "change", () => {
			e.value = Ko(e.value, n, a);
		}), t || (Eo(e, "compositionstart", Ho), Eo(e, "compositionend", Uo), Eo(e, "change", Uo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Go];
		delete e[Go], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Wo](Ko(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Wo] = Vo(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? xe(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Jo = {
	deep: !0,
	created(e, t, n) {
		e[Wo] = Vo(n), Eo(e, "change", () => {
			let t = e._modelValue, n = $o(e), r = e.checked, i = e[Wo];
			if (T(t)) {
				let e = Le(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (E(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(es(e, r));
		});
	},
	mounted: Yo,
	beforeUpdate(e, t, n) {
		e[Wo] = Vo(n), Yo(e, t, n);
	}
};
function Yo(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (T(t)) i = Le(t, r.props.value) > -1;
	else if (E(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = Ie(t, es(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var Xo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Eo(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? xe($o(e)) : $o(e)), r = e.multiple, i = r ? E(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? T(i) ? t.slice() : t : i];
			try {
				e[Wo](i);
			} finally {
				Ln(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Wo] = Vo(r);
	},
	mounted(e, { value: t }) {
		Qo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Wo] = Vo(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !Zo(t, n[1], n[0])) && Qo(e, t);
	}
};
function Zo(e, t, n) {
	if (!n || T(e)) return Ie(e, t);
	if (E(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function Qo(e, t) {
	let n = e.multiple, r = T(t);
	if (!n || r || E(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = $o(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Le(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (Ie($o(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function $o(e) {
	return "_value" in e ? e._value : e.value;
}
function es(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ts = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ns = {
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
	exact: (e, t) => ts.some((n) => e[`${n}Key`] && !t.includes(n))
}, rs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ns[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, is = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, as = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = he(n.key);
		if (t.some((e) => e === r || is[e] === r)) return e(n);
	}));
}, os = /* @__PURE__ */ x({ patchProp: Ro }, Ua), ss;
function cs() {
	return ss ||= Ni(os);
}
var ls = ((...e) => {
	let t = cs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ds(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, us(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function us(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ds(e) {
	return O(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var fs = () => ({
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
}), ps = null;
function q() {
	if (ps) return ps;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = fs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return ps = /* @__PURE__ */ $t(n), ps;
}
var J = () => e().saveSettingsDebounced(), ms = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
];
//#endregion
//#region packages/protocol/src/expr.ts
function hs(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function gs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => gs(e, t));
		case "var": return t(e.path);
		case "not": return !gs(e.e, t);
		case "bin": {
			if (e.op === "&&") return !!gs(e.l, t) && !!gs(e.r, t);
			if (e.op === "||") return !!gs(e.l, t) || !!gs(e.r, t);
			let n = gs(e.l, t), r = gs(e.r, t);
			switch (e.op) {
				case "==": return hs(n, r);
				case "!=": return !hs(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => hs(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function _s(e, t) {
	return !e || !!gs(e, t);
}
//#endregion
//#region packages/protocol/src/macros.ts
var vs = /\{\{ap::([^{}]*?)\}\}/g;
function ys(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(vs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? ys(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function bs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function xs(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Ss(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = xs(n[3] ?? n[4] ?? "");
	return t;
}
function Cs(e, t) {
	let n = [], r = RegExp(`<${bs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Ss(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Ss(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function ws(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Ts(e, t) {
	let n = Cs(e, t)[0];
	return n ? xs(n.inner).trim() : void 0;
}
function Es(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Ds(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
function Os(e, t = (e) => e) {
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
function ks(e) {
	return e === "memory" || e === "recap";
}
var As = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function js(e, t, n) {
	if (t !== void 0) switch (e) {
		case "reply":
		case "impersonate": return As(t).trim() || void 0;
		case "recap": return t === null ? null : As(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = As(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : As(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: As(e.time),
				location: As(e.location),
				event: As(e.event),
				summary: As(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: As(e.label ?? e.title).trim(),
			content: As(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, As(t)]));
			}
			return As(t).trim() || void 0;
	}
}
function Ms(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "reply":
		case "impersonate": return js(e.kind, xs(n.inner));
		case "recap": return js("recap", xs(n.inner));
		case "memory": return js("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Ts(e.inner, "scope"),
			operation: Ts(e.inner, "operation"),
			key: Ts(e.inner, "key"),
			content: Ts(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Ts(n.inner, "time") ?? "",
			location: Ts(n.inner, "location") ?? "",
			event: Ts(n.inner, "event") ?? "",
			summary: Ts(n.inner, "summary") ?? ""
		};
		case "options": return Cs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: xs(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = xs(t[2]).trim();
				return e;
			}
			return js("custom", xs(n.inner), e);
	}
}
function Ns(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		let t = Cs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Ms(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: ws(e, i),
		values: n,
		open: r
	};
}
function Ps(e) {
	return xs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Fs = {
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
}, Is = (e) => e;
function Ls(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function Rs(e, t) {
	return e.stages.filter((e) => _s(e.when, t));
}
function zs(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function Bs(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = zs(t);
	return n >= 0 ? n : t.length - 1;
}
function Vs(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function Hs(e, t, n = Fs) {
	return Ls(t.field?.name ?? n.turn.field, Vs(e, t));
}
function Us(e, t, n = Fs) {
	return Ls(t.tool?.name ?? n.stage.name, Vs(e, t));
}
function Ws(e, t = Fs) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var Gs = (e, t) => t ? {
	...e,
	description: t
} : e;
function Ks(e = Fs, t = Is, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return Gs({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: Gs({ type: "string" }, i(r.old)),
				new_string: Gs({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function qs(e, t, n = Fs, r = Is) {
	return e.kind === "patch" ? Ks(n, r, t) : Gs({ type: "string" }, t);
}
function Js(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function Ys(e, t, n, r, i = Is) {
	let a = (e, t) => {
		if (e) return i(t ? Ls(e, Vs(n, t)) : e).trim() || void 0;
	}, o = Bs(t, n), s = (t) => Hs(n, t, e), c = (t) => Us(n, t, e), l = (t) => Ws(t, e).name, u = (e, t) => {
		for (let n of r) e[n.field] = Os(n, i), ks(n.kind) || t.push(n.field);
	}, d = () => {
		let t = {}, r = [];
		return n.forEach((n, c) => {
			let l = s(n);
			t[l] = qs(n, a(n.field?.description ?? e.turn.fieldDescription, n), e, i), n.optional || r.push(l), c === o && u(t, r);
		}), o < 0 && u(t, r), {
			type: "object",
			properties: t,
			required: r,
			additionalProperties: !1
		};
	}, f = () => n.map((t, n) => {
		let r = {}, s = [], l = Ws(t, e);
		return r[l.name] = qs(t, a(l.description, t), e, i), s.push(l.name), n === o && u(r, s), Js(c(t), a(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => Js(e.submit.name, a(e.submit.description), t ?? d()),
		stageTools: f,
		envelope: (t) => ({
			type: "object",
			properties: {
				[p.thinking]: Gs({ type: "string" }, a(e.envelope.thinking.description)),
				[p.result]: Gs(t, a(e.envelope.result.description) ?? t.description)
			},
			required: [p.thinking, p.result],
			additionalProperties: !1
		}),
		envelopeKeys: p,
		toolNames: () => [e.submit.name, ...n.map(c)]
	};
}
function Xs(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function Zs(e) {
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
function Qs(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Es(t.content)).trimEnd());
}
function $s(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function ec(e) {
	return e.map((e) => ({
		old_string: Ts(e, "old_string") ?? "",
		new_string: Ts(e, "new_string") ?? ""
	}));
}
function tc(e, t) {
	let n = Zs(t.stages), r = Ds(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${bs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Ns(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Cs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = ec(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = xs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = ws(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = zs(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: bs(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Qs(t.stages, n, t.final), $s(t.stages, n, t.final), n;
}
function nc(e, t) {
	let n = Zs(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => Hs(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (o = e.id, e.kind === "patch" ? n.stages[e.id].patches = rc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		let r = a(e.field), i = js(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let s = zs(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : o)), s >= 0 && n.stages[t.stages[s].id].text !== void 0 && (n.contentStarted = !0), Qs(t.stages, n, t.final), $s(t.stages, n, t.final), n;
}
function rc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function ic(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function ac(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = ic(e, n);
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
	let i = n.trim().split(/\s+/).map(bs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function oc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = ac(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function sc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(bs(t), "gi"), a = [], o;
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
function cc(e, t, n = (e) => e) {
	if (!e) return [];
	let r = [];
	for (let i of e) {
		let e = n(i.pieces.filter((e) => _s(e.when, t)).map((e) => e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && r.push(i.role ? {
			role: i.role,
			text: e
		} : { text: e });
	}
	return r;
}
//#endregion
//#region packages/protocol/src/clone.ts
function lc(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => lc(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = lc(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function uc(e) {
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
function dc(e, t) {
	let n = uc(e), r = uc(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function fc(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = uc(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = dc(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var pc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function mc(e, ...t) {
	let n = lc(e);
	for (let e of t) n = hc(n, e);
	return n;
}
function hc(e, t) {
	if (t === void 0) return e;
	if (!pc(e) || !pc(t)) return lc(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = hc(e[r], i);
	return n;
}
function gc(e, t) {
	if (pc(e) && pc(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = gc(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : lc(e);
}
function _c(e, t, n = "", r = [], i = vc) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? pc(e[a]) && pc(t[a]) && (_c(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var vc = /* @__PURE__ */ new Set(["sampling"]);
function yc(e, t, n) {
	let r = lc(e);
	for (let e of t) if (fc(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && pc(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function bc(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function xc(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Sc(e, t, n) {
	let r = /* @__PURE__ */ new Set(), i = [];
	for (let n of e.modules) if (n.toggle === "always" || t.modules[n.id] === !0) {
		if (n.exclusive) {
			if (r.has(n.exclusive)) continue;
			r.add(n.exclusive);
		}
		i.push(n);
	}
	return n ? i.filter((e) => _s(e.when, n)) : i;
}
function Cc(e, t) {
	let n = new Set(Sc(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function wc(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Tc(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Ec(e, t, n, r) {
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
			case "name": return Tc(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${Tc(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? d === "last" ? s.customLast?.[o] ?? "" : u === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : Xs(t, (e) => Tc(i, a, e));
			case "input": return s.metaText ?? "";
			case "memory": return JSON.stringify((o === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "questions": return l(o === "optional" ? "optional" : "mandatory");
			default: return;
		}
	};
	return (e) => ys(e, d);
}
function Dc(e, t) {
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
function Oc(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? Us(n, t, e.tools) : Hs(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Tc(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function kc(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = xc(i), s = a ? Rs(a, o) : [];
	i.features = {
		...i.features,
		questions: s.some((e) => e.questions === "ask")
	};
	let c = xc(i), l = Sc(n, r, c), u = wc(n, l), d = Ec({
		...e,
		vars: i
	}, s, a, l), f = new Set(l.map((e) => e.id)), p = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!f.has(e.module) || !_s(e.when, c)) continue;
		let t = p.get(e.region) ?? [];
		t.push(...cc(e.content, c, d)), p.set(e.region, t);
	}
	if (a) {
		let e = p.get(n.workflowRegion) ?? [];
		for (let t of cc(Oc(n, a, s, i.style, i.transport, r), c, d)) {
			let n = e[e.length - 1];
			!t.role && n && !n.role && n.workflow ? n.text += `\n\n${t.text}` : e.push({
				...t,
				workflow: !0
			});
		}
		p.set(n.workflowRegion, e);
	}
	let m = {};
	for (let e of n.regions) e.native || (m[e.id] = Dc(e, p.get(e.id) ?? []));
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
function Ac(e, t, n = {}) {
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
		modules: Cc(e, t),
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
var jc = /* @__PURE__ */ new Set([
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
]), Mc = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Nc = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Pc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Fc(e, t = {}) {
	let n = (e) => Fc(e, t);
	if (!Pc(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Pc(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Mc.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Pc), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Ic({
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
		return Ic({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && jc.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Pc(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Nc[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Pc(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Ic({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Ic(i, a);
}
function Ic(e, t) {
	return t && (e.nullable = !0), e;
}
function Lc(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Pc(n)) return e;
		let r = Pc(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Fc(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var Rc = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function zc(e) {
	let t = Rc(e) ? e : {}, n = (e, t) => typeof e == "string" ? e : t;
	return {
		...Fs,
		turn: { ...Fs.turn },
		submit: {
			name: "ap_submit_turn",
			description: n(t.submit, Fs.submit.description)
		},
		stage: {
			...Fs.stage,
			name: `${n(t.stagePrefix, "ap_stage_")}{{stage}}`
		},
		results: {
			...Fs.results,
			next: n(t.stageResult, Fs.results.next),
			nudge: n(t.nudge, Fs.results.nudge)
		}
	};
}
function Bc(e) {
	return !Rc(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 2 ? e : e.formatVersion === 1 ? {
		...e,
		formatVersion: 2,
		tools: zc(e.tools)
	} : null;
}
//#endregion
//#region src/store/presets.ts
var Vc = /* @__PURE__ */ $t(/* @__PURE__ */ new Map()), Hc = /* @__PURE__ */ $t(/* @__PURE__ */ new Map());
async function Uc() {
	try {
		let e = `${a()}dist/presets/`, t = await (await f(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = Bc(await (await f(e + n, { cache: "no-cache" })).json());
			t && Vc.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var Wc = (e) => Bc(e);
function Gc() {
	return [.../* @__PURE__ */ new Set([
		...Vc.keys(),
		...Object.keys(q().installed),
		...Hc.keys()
	])].map((e) => Kc(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Kc(e) {
	let t = Hc.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Jc(e), r = Vc.get(e);
	if (n && (!r || dc(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var qc = /* @__PURE__ */ new WeakMap();
function Jc(e) {
	let t = q().installed[e];
	if (t) return qc.has(t) || qc.set(t, Bc(t)), qc.get(t) ?? void 0;
}
var Yc = (e) => Kc(e)?.preset;
function Xc(e) {
	q().installed[e.id] = e, J();
}
function Zc(e) {
	delete q().installed[e], J();
}
function Qc(e, t) {
	e ? Hc.set(e.id, e) : t ? Hc.delete(t) : Hc.clear();
}
var $c = (e) => Vc.has(e);
//#endregion
//#region src/store/config.ts
function el(e) {
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
function tl(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : bc(e, n.id)?.diff;
}
function nl(e, t = el(e).active.ref) {
	return mc(e.configurationDefaults, tl(e, el(e), t));
}
function rl(e) {
	let t = el(e);
	return mc(nl(e, t.active.ref), t.active.diff);
}
function il(e, t) {
	let n = el(e);
	n.active.diff = gc(t, nl(e, n.active.ref)) ?? {}, J();
}
function al(e, t) {
	let n = rl(e);
	return t(n), il(e, n), n;
}
function ol(e, t) {
	let n = el(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var sl = (e) => Object.keys(el(e).active.diff ?? {}).length > 0;
function cl(e) {
	el(e).active.diff = {}, J();
}
function ll(e, t) {
	let n = el(e), r = rl(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: gc(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function ul(e, t) {
	let n = el(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = gc(rl(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function dl(e, t, n) {
	let r = el(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function fl(e, t) {
	let n = el(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function pl(e) {
	let t = el(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = [], i = e.configurationDefaults, a = (t) => {
		let a = dc(n, e.version) < 0 ? yc(t, e.migrations, n) : lc(t);
		r.push(..._c(a, i));
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
var ml = {
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
}, hl = {
	en: ml,
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
function gl() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((hl[gl()] ?? hl[gl().split("-")[0]])?.[e] ?? ml[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function _l(e) {
	return e.locales?.[gl()] ?? e.locales?.[gl().split("-")[0]];
}
function vl(e, t, n, r, i) {
	let a = _l(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
//#endregion
//#region src/store/carrier.ts
var yl = "advanced_preset", bl = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, xl = (e) => bl[e] ?? e, Sl = () => e().getPresetManager("openai"), Cl = (e) => `AP · ${e.name}`;
function wl() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function Tl(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function El(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...lc(t.sampling),
		prompts: lc(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: lc(n)
		})),
		extensions: { [yl]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function Dl(e) {
	let t = Sl();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Ol(e, t, n) {
	let r = Sl();
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
async function kl(e, t = {}) {
	let n = Sl(), r = el(e), i = Dl(e.id), a = i ?? Cl(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[yl];
	if (!o || t.force || s?.hash !== e.hash) {
		o && r.carrierHash && Tl(o) !== r.carrierHash && d("info", Y("carrier.reset", { name: a }));
		let n = El(e, rl(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = Tl(n), J(), await Ol(a, n, !!t.select);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function Al(e) {
	await kl(e, { select: !0 });
}
async function jl(e) {
	let t = Dl(e.id);
	if (!t) return;
	let n = Sl(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = rl(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...lc(i)
	}, o = n.getSelectedPresetName() === t;
	Ml = !0;
	try {
		await Ol(t, a, o);
	} finally {
		Ml = !1;
	}
}
var Ml = !1;
function Nl(t) {
	if (Ml || wl() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = rl(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[xl(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = lc(r));
	}
	return Object.keys(i).length ? (al(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/store/sidecar.ts
var Pl = "advanced_preset";
function Fl(e) {
	let t = e?.extra?.[Pl];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function Il(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Pl] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Pl] = lc(n));
}
//#endregion
//#region src/store/eventlog.ts
var Ll = "advanced_preset";
function Rl() {
	return e().chatMetadata?.[Ll]?.seedEvents ?? [];
}
function zl(t = Infinity) {
	let n = Rl().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of Fl(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function Bl(e = Infinity) {
	let t = {};
	for (let { event: n } of zl(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function Vl(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of zl(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function Hl(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Fl(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Ll] && (e.extra[Ll].events = lc(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Ll] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function Ul(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key];
	return t;
}
function Wl(e, t, n, r, i) {
	let a = e.globalMemory, o = Ul(e)[n] ?? null;
	return a.log.splice(a.cursor), a.log.push({
		op: t,
		key: n,
		content: r,
		prev: o,
		source: i,
		at: Date.now()
	}), a.cursor = a.log.length, J(), a.cursor - 1;
}
var Gl = (e) => e.globalMemory.cursor > 0, Kl = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function ql(e) {
	Gl(e) && (e.globalMemory.cursor--, J());
}
function Jl(e) {
	Kl(e) && (e.globalMemory.cursor++, J());
}
function Yl(e, t) {
	let n = e.globalMemory.log[t];
	n && (n.prev === null ? Wl(e, "delete", n.key, void 0, "undo") : Wl(e, "replace", n.key, n.prev, "undo"));
}
function Xl(e, t) {
	let n = [];
	for (let r of t) if (r.scope === "global_memory") {
		let t = Wl(e, r.operation, r.key, r.content ?? "", "model");
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
var Zl = null, Ql = (e) => {
	Zl = e;
}, $l = () => {
	let e = Zl;
	return Zl = null, e;
};
function eu(t, n) {
	let r = ys(t.meta.trigger, (e) => e[0] === "name" ? Tc(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function tu(e, t, n, r, i, a = [], o = !0) {
	let s = sc(n, eu(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = xc(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && _s(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && _s(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && _s(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? $l() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function nu(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var ru = 0, iu = () => `ap-${Date.now().toString(36)}-${(++ru).toString(36)}`, au = /* @__PURE__ */ new Map(), ou = null, su = null, cu = {
	setPending(e) {
		ou = e;
	},
	takePending() {
		let e = ou;
		return ou = null, e;
	},
	peekPending: () => ou,
	arm(e) {
		su = e, au.set(e.id, e);
	},
	takeArmed() {
		let e = su;
		return su = null, e;
	},
	get: (e) => au.get(e),
	release(e) {
		au.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of au) t - r.createdAt > e && au.delete(n);
	}
}, lu = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, uu = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function du(e, t) {
	return e.replace(/\{\{(time|location|event|summary)\}\}/g, (e, n) => t[n] ?? "");
}
function fu(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	if (n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = lu(e);
		if (a && uu.has(a.turn)) {
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
		let n = sc(e.item.mes, t.trigger, t.wrap);
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
			let r = t.synopsisId ? lu(e.item)?.structures?.[t.synopsisId] : void 0;
			return [r ? {
				...e,
				item: {
					...e.item,
					mes: du(t.synopsisTemplate, r)
				}
			} : e];
		});
	}
	return n.map((e) => e.item);
}
var pu = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function mu(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function hu(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = mu(e), r = mu(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function gu(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = pu(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = pu(l.text);
			if (c === u || c.includes(u) || hu(c, u) >= n) {
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
async function _u(t, n, r, i) {
	if (cu.setPending(null), !q().enabled) return;
	let a = wl(), o = a ? Yc(a) : void 0;
	if (!o) return;
	let s = rl(o), c = i || "normal", l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, { meta: d, flags: f, origin: p } = tu(o, s, u >= 0 ? t[u].mes : "", c, !0, t.slice(-6).map((e) => e.mes)), m = e().chat, h = t.map((e) => m.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), g = fu(t, {
		trigger: eu(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		synopsisTemplate: o.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(o.structures).find((e) => e.kind === "synopsis")?.id,
		recap: Vl(),
		realIndex: (e) => h[e] ?? -1,
		currentInput: u
	});
	t.splice(0, t.length, ...g);
	let _ = {
		id: iu(),
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
	cu.setPending(_);
}
//#endregion
//#region src/core/debug.ts
var vu = /* @__PURE__ */ $t({
	log: [],
	requests: []
}), yu = 50;
function bu(e, t) {
	vu.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), vu.log.length > yu && (vu.log.length = yu);
}
function xu(e) {
	return vu.requests.unshift(e), vu.requests.length > yu && (vu.requests.length = yu), vu.requests[0];
}
//#endregion
//#region src/core/assembler.ts
var Su = /⟦ap:region:([\w.-]+)⟧/g, Cu = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function wu(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(Su)) {
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
function Tu(t, n) {
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Tc(t, n, t.user), s = Tc(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Fl(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? Ps(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function Eu(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = Fl(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function Du(t, n) {
	let { preset: r, config: i } = t, a = Bl(), o = Ul(el(r)), s = Vl(), c = Tu(r, i), l = t.transport;
	return {
		vars: Ac(r, i, {
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
			customLast: Eu(r)
		}
	};
}
function Ou(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = gu(s.map(({ m: e }) => ({
		role: e.role,
		text: Cu(e.content)
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
			mes: Cu(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = fu(d, {
		trigger: eu(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		synopsisTemplate: r.tokenSaving.synopsisTemplate,
		synopsisId: Object.values(r.structures).find((e) => e.kind === "synopsis")?.id,
		recap: Vl(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1
	}), m = new Map(p.map((e) => [e.__h, e.mes])), h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function ku(t, n) {
	let r = n ? null : cu.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = rl(t), a = [...e().chat].reverse().find((e) => e.is_user && !e.is_system), { meta: o, flags: s, origin: c } = tu(t, i, n ? a?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: iu(),
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
var Au = Symbol("ap-region");
function ju(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => Cu(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Tc(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = Cu(t.content);
		if (t[Au] || t.role === "system") return n;
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
async function Mu(t) {
	let { chat: n, dryRun: r } = t;
	if (!q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		r || (cu.setPending(null), cu.takeArmed());
		return;
	}
	let i = wl(), a = i ? Yc(i) : void 0;
	if (!a) {
		let e = wu(n).filter((e) => !e.__anchor);
		n.splice(0, n.length, ...e);
		return;
	}
	let o = ku(a, r), s = wu(n);
	!o.interceptorRan && !r && Ou(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : nu(a, o.config, o.origin), { vars: u, data: d } = Du(o, l), f = kc({
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
			return Object.defineProperty(t, Au, { value: !0 }), t;
		}).filter((e) => Cu(e.content).trim());
		g.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: Cu(e.content).length,
				content: Cu(e.content)
			}))
		}), m.push(...n), t === a.anchors.historyStart && (h = m.length);
	}
	let _ = o.transport === "prefill" && !c && h >= 0 ? ju(o, m, h) : m;
	n.splice(0, n.length, ..._.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), bu("assembly", g), !r && !c && l && cu.arm(o);
}
//#endregion
//#region src/core/transports/base.ts
function Nu(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of Ys(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function Pu(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function Fu(e) {
	return Ys(e.preset.tools, e.workflow, e.stages, e.structures, Pu(e));
}
function Iu(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Tc(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function Lu(e, t, n) {
	let r = Ls(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return Pu(e)(r);
}
function Ru(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = Pu(r), u = l(o.tool.description);
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
				content: Lu(r, o.response[t], { first: n })
			}
		]
	};
}
function zu(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && Bu(n, e.ctx.preset.tools.jsonStringHint), n;
}
function Bu(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Lc(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Fc(e.json_schema.value, n)
	});
}
function Vu(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/transports/text.ts
function Hu(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = Iu(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => tc(e, {
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
			content: Ls(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), zu({
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
			let n = Vu(t, e.caller);
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
var Uu = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Wu = 32, Gu = 10, Ku = 9, qu = 13, Ju = 160, Yu = 6158, Xu = 8192, Zu = 8203, Qu = 8239, $u = 8287, ed = 12288, td = 65279;
function nd(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function rd(e) {
	return e >= "0" && e <= "9";
}
function id(e) {
	return e >= " ";
}
function ad(e) {
	return ",:[]/{}()\n+".includes(e);
}
function od(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function sd(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var cd = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, ld = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function ud(e) {
	return ",[]/{}\n+".includes(e);
}
function dd(e) {
	return _d(e) || fd.test(e);
}
var fd = /^[[{\w-]$/;
function pd(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function md(e, t) {
	let n = e.charCodeAt(t);
	return n === Wu || n === Gu || n === Ku || n === qu;
}
function hd(e, t) {
	let n = e.charCodeAt(t);
	return n === Wu || n === Ku || n === qu;
}
function gd(e, t) {
	let n = e.charCodeAt(t);
	return n === Ju || n === Yu || n >= Xu && n <= Zu || n === Qu || n === $u || n === ed || n === td;
}
function _d(e) {
	return vd(e) || bd(e);
}
function vd(e) {
	return e === "\"" || e === "“" || e === "”";
}
function yd(e) {
	return e === "\"";
}
function bd(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function xd(e) {
	return e === "'";
}
function Sd(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function Cd(e, t) {
	let n = e.length;
	if (!md(e, n - 1)) return e + t;
	for (; md(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function wd(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function Td(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var Ed = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function Dd(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = Ed[n];
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
function Od(e) {
	return e !== null && e.char === "\"";
}
function kd(e) {
	return e !== null && e.char === "'";
}
function Ad(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function jd(e, t) {
	switch (t) {
		case ")": return Ad(e, "(") > Ad(e, ")");
		case "]": return Ad(e, "[") > Ad(e, "]");
		case "}": return Ad(e, "{") > Ad(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Md = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Nd = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Pd(e) {
	let t = 0, n = "";
	c([
		"```",
		"[```",
		"{```"
	]), i() || ne(), c([
		"```",
		"```]",
		"```}"
	]);
	let r = u(",");
	for (r && a(), dd(e[t]) && Td(n) ? (r || (n = Cd(n, ",")), g()) : r && (n = Sd(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
	if (t >= e.length) return n;
	te();
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
		let i = r ? md : hd, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (gd(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Fd(e, t);) t++;
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
			if (od(e[t])) for (; t < e.length && sd(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = Cd(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = Sd(n, ",")) : D();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (dd(e[t]) || c ? n = Cd(n, ":") : O()), i() || (s || c ? n += "null" : O()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = Cd(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = Cd(n, ",")), p(), !i()) {
					r || (n = Sd(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = Cd(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = Cd(n, ",")), t = i();
		t || (n = Sd(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, _d(e[t]) || te());
		let s = e[t] === "&" ? Dd(e.slice(t, t + 12)) : null, c = Od(s) || kd(s);
		if (_d(e[t]) || c) {
			let l = yd(e[t]) ? yd : xd(e[t]) ? xd : bd(e[t]) ? bd : vd, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = w(t - 1);
					return !r && ad(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = Cd(p, "\""), n += p, !0);
				}
				if (t === i) return p = Cd(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? Dd(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || ad(e[t]) && !jd(p, e[t]) || _d(e[t]) && !T(t) || rd(e[t])) return v(), !0;
					e[t] === "\\" && te();
					let s = w(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (ad(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && ud(e[t])) {
					if (e[t - 1] === ":" && cd.test(e.substring(u + 1, t + 2))) for (; t < e.length && ld.test(e[t]);) p += e[t], t++;
					return p = Cd(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : pd(e) ? p += Md[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Nd[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && nd(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : re();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : pd(n) ? (p += Md[n], t++) : (id(n) || E(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = Sd(n, "\"", !0);
			let e = n.length;
			n = _() ? wd(n, e, 1) : Cd(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !rd(e[t]) && ee() && (i += "0")), e[t] === "0" && rd(e[t + 1]) && (a = !0); rd(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, rd(e[t]) || (i += "0"); rd(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), rd(e[t]) || (i += "0"); rd(e[t]);) i += e[t], t++;
			return ee() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !sd(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (od(e[t])) {
			for (; t < e.length && sd(e[t]);) t++;
			let n = t;
			for (; md(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !ud(e[t]) && !_d(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && cd.test(e.substring(a, t + 2))) for (; t < e.length && ld.test(e[t]);) t++;
		if (t > a) {
			for (; md(e, t - 1) && t > 0;) t--;
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
	function w(t) {
		let n = t;
		for (; n > 0 && md(e, n);) n--;
		return n;
	}
	function T(t) {
		let n = t + 1;
		for (; n < e.length && md(e, n);) n++;
		return n >= e.length || ad(e[n]);
	}
	function ee() {
		return t >= e.length || ad(e[t]) || md(e, t);
	}
	function E(e) {
		throw new Uu(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function te() {
		throw new Uu(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ne() {
		throw new Uu("Unexpected end of json string", e.length);
	}
	function D() {
		throw new Uu("Object key expected", t);
	}
	function O() {
		throw new Uu("Colon expected", t);
	}
	function re() {
		throw new Uu(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Fd(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Id(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Ld(e, t) {
	let n = Id(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Pd(n));
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
function Rd(e, t, n, r) {
	let i = Zs(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function zd(e) {
	let { ctx: t, caller: n } = e, r = Fu(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = Ld(c(e), i);
		return s = a.value, n.schema ? Rd(t, r, a.value, i) : nc(a.value, {
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
		body: () => zu(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Bd = (e, t) => ({
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
function Vd(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Hd(e) {
	let { ctx: t, caller: n } = e, r = Fu(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = Ru(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = Ld((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? Rd(t, r, o.value, i) : nc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => zu(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = Vu(e, n);
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
function Ud(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = Fu(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = Ru(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = Bs(t.workflow, r), m = new Map(r.map((e) => [s.toolOf(e), e])), h = {}, g = [], _ = !1, v = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, y = () => r.find((e) => !e.optional && h[s.fieldOf(e)] === void 0), b = () => {
		let e = y();
		return e ? s.toolOf(e) : "";
	}, x = (e, t, n) => {
		let a = m.get(t.name);
		if (!a) return;
		let o = Ld(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? Rd(t, s, e, a) : nc(e, {
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
			return zu({
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
			let i = Vd(e.toolCalls.filter((e) => e.name), r), o = Vu(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(Bd(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = Lu(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: Lu(t, a.tools.results.nudge, {
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
function Wd(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Hu(e);
		case "structured": return zd(e);
		case "tool-single": return Hd(e);
		case "tool-multi": return Ud(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Gd(e, t) {
	let n = t ? o({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? u(n) : c(n);
}
var X = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Kd(e) {
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
							args: qd(e.arguments)
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
function qd(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Jd(e, t) {
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
			input: qd(e.arguments)
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
					args: qd(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Yd(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/reader.ts
var Xd = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Zd(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Qd = class {
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
function $d(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function ef(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* tf(e, t) {
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
async function* nf(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Zd(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Xd(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Qd();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Zd(t);
		if (n) throw new Xd(n);
		i.text = $d(t), i.reasoning = ef(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = t?.usage ?? t?.usageMetadata, yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of tf(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Zd(e);
		if (r) throw new Xd(r);
		i.text += s(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let c = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		c && (i.finishReason = c), (e?.usage || e?.usageMetadata) && (i.usage = e.usage ?? e.usageMetadata), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var rf = /* @__PURE__ */ $t({ current: null });
function af(e, t) {
	return rf.current = {
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
	}, rf.current;
}
function of(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var sf = "/api/backends/chat-completions/generate", cf = { pending: null }, lf = (e) => e?.name === "AbortError";
function uf(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Y("error.toolsUnsupported") : null;
}
async function df(e, t, n) {
	let r = Gd(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = uf(e);
	if (a) return d("error", a, "Advanced Preset"), Yd(a, 400);
	let o = e.origin === "task" ? Nu(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = af(e, i);
	if (!i) try {
		let i = await mf(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(Jd(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return pf(c, e);
	}
	let l = Kd(r), u = new TextEncoder(), f = new TransformStream(), p = f.writable.getWriter(), m = (e) => e ? p.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), h = "";
	return (async () => {
		try {
			let i = await mf(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(h) && e.length > h.length && (m(l.text(e.slice(h.length))), h = e);
			});
			i.content.startsWith(h) && await m(l.text(i.content.slice(h.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await m(l.reasoning(i.reasoning)), i.toolCalls?.length && await m(l.toolCalls(i.toolCalls)), await m(l.end());
		} catch (e) {
			lf(e) || (await m(l.error(ff(e))), pf(c, e));
		} finally {
			await p.close().catch(() => void 0);
		}
	})(), new Response(f.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var ff = (e) => e instanceof Error ? e.message : String(e);
function pf(e, t) {
	return e.status = lf(t) ? "aborted" : "error", e.error = ff(t), t instanceof Xd ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Yd(ff(t));
}
async function mf(t, n, r, i, a, s) {
	let c = String(n.chat_completion_source ?? ""), l = Wd({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Gd(c, n)
	}), u = zs(t.stages), d = u >= 0 ? t.stages[u].id : null, p = t.stages.some((e) => e.kind === "patch"), m = t.origin === "story" && !r.schema && !p && d !== null, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, g = Date.now(), _ = "", v, y = 0, b = !1, x, S;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), c = xu({
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
			let t = await f(sf, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), n = 0;
			for await (let e of nf(t, o(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - n < 50) continue;
				n = t;
				let r = l.progress(e, !1);
				if (of(i, r, _ + e.reasoning), m && d) {
					let e = r.stages[d]?.text ?? "";
					e && s(e.slice(0, e.length - Es(e)).trimEnd());
				}
			}
			c.response = u.text || JSON.stringify(u.toolCalls), c.durationMs = Date.now() - c.at, c.usage = u.usage;
		} catch (e) {
			if (c.error = ff(e), lf(e) || a?.aborted) {
				b = !0, S = l.progress(u, !1);
				break;
			}
			throw e;
		}
		_ += u.reasoning, v = u.usage ?? v, l.progress(u, !0);
		let p = l.complete(u, n);
		if (p.callerToolCalls) {
			x = p.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (p.done) break;
	}
	let C = S ?? l.result();
	if (b) for (let e of Object.values(C.stages)) e.status === "streaming" && (e.status = "interrupted");
	of(i, C, _);
	let w = hf(t, C, l.rawText(), l.callerResult?.(), _, {
		usage: v,
		requests: y,
		durationMs: Date.now() - g,
		interrupted: b
	});
	return w.toolCalls = x, x && (w.content = ""), i.status = b ? "aborted" : "done", w;
}
function hf(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = oc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Ds(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g = (e) => Object.values(s.structures).find((t) => t.kind === e), _ = g("reply"), v = _ ? n.structures[_.id] : void 0, y = g("impersonate"), b = g("recap"), x = g("memory"), S = t.meta.mixed ? "meta-mixed" : "story", C = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? C = i === void 0 ? u || Ds(r).trim() : JSON.stringify(i) : u || (S = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", C = v ? Ps(v) : "", !C && y && typeof n.structures[y.id] == "string" && (C = "…"), !C && b && n.structures[b.id] && (C = "…"))), !C && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let w = [], T = t.interceptorRan && t.stType !== "quiet";
	if (T && x && Array.isArray(n.structures[x.id]) && w.push(...Xl(el(s), n.structures[x.id])), T && b && typeof n.structures[b.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		w.push({
			type: "recap.set",
			text: n.structures[b.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let ee = t.stages.map((e) => {
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
	}), E = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: S,
		stages: ee,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
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
	}, te = {
		content: C,
		reasoning: a,
		sidecar: E
	};
	return T ? cf.pending = {
		ctx: t,
		outcome: te,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: E
	}), rf.current?.genId === t.id && (rf.current.structures = n.structures), te;
}
//#endregion
//#region src/core/fetch-gate.ts
var gf = "__ap_gen_id";
function _f(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function vf() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	p(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(_f(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[gf], r = typeof t == "string" ? cu.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[gf], r.claimed = !0;
				try {
					return await df(r, e, n.signal);
				} finally {
					cu.release(t);
				}
			}
			e && (delete e[gf], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function yf(e) {
	let t = cu.takeArmed();
	t && (e[gf] = t.id);
}
//#endregion
//#region src/app/receive.ts
var bf = 6e5, xf = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Sf(t, n) {
	let r = cf.pending;
	if (!r || Date.now() - r.at > bf || xf.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	cf.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Il(t, a.sidecar), rf.current?.genId === r.ctx.id && (rf.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/updater.ts
var Cf = "advancedPreset.reloadedFor";
async function wf() {
	try {
		let e = await f(`${a()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Tf(e) {
	sessionStorage.setItem(Cf, e), d("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Ef() {
	let e = await wf();
	e && e !== "f7040f6cbf707ed5" && sessionStorage.getItem(Cf) !== e && Tf(e);
}
async function Df() {
	await Ef();
}
async function Of() {
	let e = i().replace(/^third-party\//, ""), t = await kf(e, !1);
	if (t.status === 404 && (t = await kf(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await wf();
	return r && r !== "f7040f6cbf707ed5" ? (Tf(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var kf = (t, n) => f("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Af = /* @__PURE__ */ $t({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), jf = 1500, Mf = null;
async function Nf() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await f(`${n}/`, { cache: "no-store" })).json();
		if (Af.status = "online", Af.error = e.ok === !1 ? "build failed" : "", Af.at = Date.now(), !e.hash || e.hash === Af.hash) return;
		let t = Wc(await (await f(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Af.presetId && Af.presetId !== t.id && Qc(null, Af.presetId), Qc(t), Af.presetId = t.id, Af.hash = t.hash, pl(t), await kl(t), bu("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Af.status = "error", Af.error = e instanceof Error ? e.message : String(e);
	}
}
function Pf() {
	if (Mf && clearTimeout(Mf), Mf = null, !q().dev.enabled) {
		Af.presetId && Qc(null, Af.presetId), Object.assign(Af, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	Af.status === "off" && (Af.status = "connecting");
	let e = async () => {
		await Nf(), q().dev.enabled && (Mf = setTimeout(e, jf));
	};
	e();
}
function Ff() {
	ir(() => [q().dev.enabled, q().dev.url], () => {
		Af.hash = "", Pf();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var If = "#option_impersonate, #mes_impersonate", Lf = () => document.querySelector("#send_textarea");
function Rf(e, t = !1) {
	let n = Lf();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function zf() {
	if (!q().enabled) return null;
	let t = wl(), n = t ? Yc(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = rl(n), i = ys(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Tc(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function Bf(e) {
	if (!e.target?.closest?.(If)) return;
	let t = zf();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = Lf()?.value.trim();
	Rf(n ? `${t}\n${n}` : t, !0);
}
function Vf() {
	window.addEventListener("click", Bf, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var Hf = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-shadow:0 8px 28px #00000073}", Uf = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", Wf = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}", Gf = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;background:var(--ap-panel-bg);color:var(--ap-text);-webkit-backdrop-filter:blur(var(--SmartThemeBlurStrength,10px));flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fill,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}}", Z = /* @__PURE__ */ $t({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), Kf = () => {
	Z.chatRev++;
}, qf = () => {
	Z.presetId = wl();
}, Jf = K(() => Z.presetId ? Yc(Z.presetId) : void 0), Yf = K(() => {
	let e = Jf.value;
	if (!e) return { config: "" };
	let t = el(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : vl(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function Xf(t) {
	return Z.chatRev, e().chat[t];
}
function Zf(e) {
	return Fl(Xf(e));
}
function Qf(e) {
	e && (Z.tab = e), Z.panelOpen = !0;
}
//#endregion
//#region src/ui/theme.ts
var $f = /* @__PURE__ */ $t({ mode: "light" }), ep = new CSSStyleSheet();
ep.replaceSync([
	Hf,
	Uf,
	Wf,
	Gf
].join("\n"));
var tp = new CSSStyleSheet(), np = [ep, tp], rp = [
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
function ip(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of rp) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function ap(e) {
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
function op() {
	let e = ap(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var sp = /* @__PURE__ */ new Set();
function cp(e) {
	return sp.add(e), e.dataset.apTheme = $f.mode, () => sp.delete(e);
}
function lp() {
	let e = op();
	if (e !== $f.mode) {
		$f.mode = e;
		for (let t of sp) t.dataset.apTheme = e;
	}
}
function up() {
	$f.mode = op();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(lp);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), nr(() => {
		let e = Jf.value?.theme?.[$f.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(ip(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(ip("primary", t.primary)), t.accent && n.push(ip("accent", t.accent)), tp.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function dp(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function fp(e, t, n = []) {
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
			e.adoptedStyleSheets = np, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = cp(this), this.app = ls(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/mounts.ts
var pp = "ap-hidden", mp = [
	"meta-pure",
	"impersonate",
	"summary"
];
function hp(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function gp(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Fl(a), s = rf.current?.mesId === n, c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = hp("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = hp("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(pp, !!(!s && o && mp.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(pp));
}
function _p(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) gp(t);
}
function vp() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var yp = 0, bp = /* @__PURE__ */ new Set(), xp = !1;
function Sp(e) {
	e ? bp.add(e) : xp = !0, !yp && (yp = requestAnimationFrame(() => {
		if (yp = 0, xp) _p();
		else for (let e of bp) e.isConnected && gp(e);
		bp.clear(), xp = !1, vp();
	}));
}
function Cp() {
	Kf(), Sp();
}
function wp() {
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
	]) e && t.on(e, Cp);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Sp(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Sp(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Sp();
	};
	r();
	let i;
	ir(() => rf.current && rf.current.status === "running" && rf.current.streaming && rf.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = rf.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Cp());
		}, 100));
	}), ir(() => rf.current?.status, () => Sp());
}
//#endregion
//#region src/ui/entry.ts
var Tp = "left-nav-panel", Ep = "ap-preset-button";
function Dp() {
	return document.getElementById(Tp);
}
function Op() {
	let e = Dp();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function kp() {
	let e = document.querySelector("#settings_preset_openai")?.nextElementSibling;
	if (!e || e.querySelector(`#${Ep}`)) return;
	let t = document.createElement("div");
	t.id = Ep, t.className = "menu_button menu_button_icon", t.setAttribute("role", "button"), t.tabIndex = 0, t.title = Y("panel.open.title"), t.setAttribute("aria-label", Y("panel.open.title"));
	let n = document.createElement("i");
	n.className = "fa-fw fa-solid fa-layer-group", t.append(n);
	let r = () => {
		Z.panelOpen = !Z.panelOpen;
	};
	t.addEventListener("click", r), t.addEventListener("keydown", (e) => {
		(e.key === "Enter" || e.key === " ") && (e.preventDefault(), r());
	}), e.prepend(t), ir(() => Z.panelOpen, (e) => t.classList.toggle("active", e), { immediate: !0 });
}
function Ap() {
	let e = Dp();
	if (!e) {
		document.querySelector("ap-panel") || document.body.append(document.createElement("ap-panel"));
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function jp() {
	kp(), Ap(), ir(() => Z.panelOpen, (e) => {
		e && Op();
	});
	let e = Dp();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (Z.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Mp = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Np = (e) => e === "", Pp = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Fp = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Ip = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Lp = (e) => {
	let t = Ip(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Rp = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, zp = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = Rp.width, color: s = Rp.stroke, ...c }, { slots: l }) => Pa("svg", {
	...Rp,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Np(n) || Np(r) || n === !0 || r === !0 ? Number(i || a || Rp["stroke-width"]) * 24 / Number(o) : i || a || Rp["stroke-width"],
	class: Pp("lucide", c.class, ...e ? [`lucide-${Fp(Lp(e))}-icon`, `lucide-${Fp(e)}`] : ["lucide-icon"]),
	...!l.default && !Mp(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Pa(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Pa(zp, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Bp = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), Vp = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), Hp = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), Up = Q("brain", [
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
]), Wp = Q("bug", [
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
]), Gp = Q("cable", [
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
]), Kp = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), qp = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Jp = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), Yp = Q("circle-dashed", [
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
]), Xp = Q("circle-question-mark", [
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
]), Zp = Q("circle-slash", [["circle", {
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
}]]), Qp = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), $p = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), em = Q("coins", [
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
]), tm = Q("copy", [["rect", {
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
}]]), nm = Q("download", [
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
]), rm = Q("drama", [
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
]), im = Q("feather", [
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
]), am = Q("file-stack", [
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
]), om = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), sm = Q("git-compare-arrows", [
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
]), cm = Q("globe", [
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
]), lm = Q("info", [
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
]), um = Q("layers", [
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
]), dm = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), fm = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), pm = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), mm = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), hm = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), gm = Q("notebook-pen", [
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
]), _m = Q("package", [
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
]), vm = Q("palette", [
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
]), ym = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), bm = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), xm = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Sm = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), Cm = Q("refresh-cw", [
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
]), wm = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), Tm = Q("save", [
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
]), Em = Q("scroll-text", [
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
]), Dm = Q("server", [
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
]), Om = Q("shapes", [
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
]), km = Q("sliders-horizontal", [
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
]), Am = Q("sliders-vertical", [
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
]), jm = Q("text-cursor-input", [
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
]), Mm = Q("trash-2", [
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
]), Nm = Q("triangle-alert", [
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
]), Pm = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), Fm = Q("upload", [
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
]), Im = Q("user-pen", [
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
]), Lm = Q("workflow", [
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
]), Rm = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), zm = 6, Bm = 8;
function Vm(e, t, n, r = "center", i = !1) {
	let a = e.top - zm - t.height >= Bm, o = e.bottom + zm + t.height <= n.height - Bm, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - zm - t.height : e.bottom + zm;
	c = Math.max(Bm, Math.min(c, n.height - Bm - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(Bm, Math.min(l, n.width - Bm - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Hm(e, t) {
	let n = /* @__PURE__ */ dn(!1), r = /* @__PURE__ */ dn(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Vm(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return ir(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Ln();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Rr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/components/Tip.vue
var Um = /* @__PURE__ */ L({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ dn(null), { open: r, bubble: i } = Hm(n, () => t);
		return (t, a) => (B(), V("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Wr(t.$slots, "default"), F(r) && e.text ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544));
	}
}), Wm = ["disabled", "aria-label"], $ = /* @__PURE__ */ L({
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
		return (t, n) => (B(), H(Um, {
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
			}, [(B(), H(Vr(e.icon)))], 10, Wm)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), Gm = {
	key: 0,
	class: "patches"
}, Km = { class: "patch-old pre" }, qm = { class: "patch-new pre" }, Jm = {
	key: 0,
	class: "patch-status xs"
}, Ym = {
	key: 2,
	class: "faint small stage-empty"
}, Xm = /* @__PURE__ */ L({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ dn(null);
		ir(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Ln();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (B(), V("div", {
			class: "stage-body",
			style: Te({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (B(), V("div", Gm, [(B(!0), V(z, null, R(e.stage.patches, (e, t) => (B(), V("div", {
			key: t,
			class: A(["patch", { failed: r(e.status) }])
		}, [
			U("div", Km, j(e.old_string), 1),
			W(F(Bp), { class: "patch-arrow" }),
			U("div", qm, j(e.new_string), 1),
			r(e.status) ? (B(), V("div", Jm, [W(F(Vp)), sa(j(F(Y)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (B(), V("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, j(e.stage.text), 513)) : (B(), V("div", Ym, j(F(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/message/model.ts
function Zm(e, t, n, r) {
	return e && _l(e)?.workflows?.[t]?.stages?.[n] || r;
}
function Qm(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return dp(e?.actors[t]?.color, n);
}
function $m(e) {
	return K(() => {
		let t = e(), n = Zf(t), r = rf.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Yc(r.presetId);
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
					label: Zm(e, r.workflow, t.id, t.label),
					color: Qm(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Yc(n.presetId);
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
				label: Zm(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: Qm(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/actions.ts
async function eh(t) {
	let n = e().chat[t], r = Fl(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes), Il(t, {
		...r,
		patchesApplied: i
	}), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), Kf();
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var th = { class: "stage-bar" }, nh = ["onClick"], rh = { class: "ellipsis" }, ih = {
	key: 0,
	class: "chip stage-chip error"
}, ah = { class: "ellipsis" }, oh = { class: "badge warn" }, sh = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, ch = /* @__PURE__ */ L({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = $m(() => t.mesid), r = /* @__PURE__ */ dn(null), i = /* @__PURE__ */ dn(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		ir(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: gm,
			content: im,
			patch: sm
		}, d = (e) => e.status === "streaming" ? fm : e.status === "interrupted" ? Zp : e.status === "missing" ? Yp : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => F(n) && (o.value.length || F(n).error) ? (B(), V("div", {
			key: 0,
			class: A(["stages", { live: F(n).running }])
		}, [U("div", th, [
			(B(!0), V(z, null, R(o.value, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				class: A(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Te({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(B(), H(Vr(d(e)), { class: A({ spin: e.status === "streaming" }) }, null, 8, ["class"])), U("span", rh, j(e.label), 1)], 14, nh))), 128)),
			F(n).error ? (B(), V("span", ih, [W(F(Nm)), U("span", ah, j(F(n).error), 1)])) : G("", !0),
			r[1] ||= U("span", { class: "grow" }, null, -1),
			f.value.length ? (B(), H(Um, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: I(() => [U("span", oh, [W(F(Nm)), sa(j(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (B(), H($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? F(Pm) : F(Sm),
				label: p.value.patchesApplied ? F(Y)("stages.revertDraft") : F(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => F(eh)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			F(n).running ? G("", !0) : (B(), H(Um, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: I(() => [U("span", sh, [W(F(lm))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (B(), H(Xm, {
			key: c.value.id,
			stage: c.value,
			follow: F(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), lh = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), uh = /* @__PURE__ */ new Set([
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
]), dh = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function fh(e) {
	return dh(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function ph(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${fh(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${fh(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${fh(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function mh(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = mh(e, t);
			n && i.appendChild(n);
		}
	};
	if (!lh.has(r) && !uh.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = mh(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function hh(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return ph(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", ph(e.textContent));
			continue;
		}
		let t = mh(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var gh = { class: "reply-name xs" }, _h = ["innerHTML"], vh = /* @__PURE__ */ L({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => hh(t.text));
		return (t, r) => (B(), V("div", {
			class: "reply-card",
			style: Te({ "--actor": e.color })
		}, [U("div", gh, j(e.name), 1), U("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, _h)], 4));
	}
}), yh = { class: "card mini-card" }, bh = { class: "card-head" }, xh = { class: "card-title" }, Sh = { class: "card-body pre" }, Ch = /* @__PURE__ */ L({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (B(), V("div", yh, [U("header", bh, [
			W(F(Im), { class: "section-icon" }),
			U("span", xh, j(F(Y)("cards.impersonate")), 1),
			U("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => F(Rf)(e.text)
			}, [W(F(jm)), sa(j(F(Y)("cards.fillInput")), 1)])
		]), U("div", Sh, j(e.text), 1)]));
	}
}), wh = ["aria-label"], Th = ["title", "onClick"], Eh = { class: "option-label" }, Dh = { class: "option-content small muted" }, Oh = /* @__PURE__ */ L({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => Rf(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
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
		}, [U("span", Eh, j(e.label), 1), U("span", Dh, j(e.content), 1)], 8, Th))), 128))], 8, wh));
	}
}), kh = {
	key: 0,
	class: "memory-ops"
}, Ah = { class: "ellipsis" }, jh = ["aria-label", "onClick"], Mh = /* @__PURE__ */ L({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = el(t.preset), n = e.globalMemory.log;
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
			e.index !== void 0 && Yl(el(t.preset), e.index);
		}
		return (e, t) => n.value.length ? (B(), V("div", kh, [(B(!0), V(z, null, R(n.value, (e, t) => (B(), H(Um, {
			key: t,
			text: e.op === "delete" ? F(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: I(() => [U("span", { class: A(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(B(), H(Vr(e.scope === "global" ? F(cm) : F(mm)), { class: "faint" })),
				U("span", Ah, j(e.key), 1),
				(B(), H(Vr(e.op === "delete" ? F(Mm) : F(bm)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": F(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [W(F(Pm))], 8, jh)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), Nh = ["aria-label"], Ph = /* @__PURE__ */ L({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ dn(null), { open: r, bubble: i } = Hm(n, () => t);
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
			onClick: a[0] ||= rs((e) => r.value = !F(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [W(F(Xp))], 40, Nh), F(r) ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, j(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), Fh = { class: "card-title" }, Ih = {
	key: 0,
	class: "card-body"
}, Lh = /* @__PURE__ */ L({
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
		let t = /* @__PURE__ */ dn(e.open ?? !0);
		return (n, r) => (B(), V("section", { class: A(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [U("header", {
			class: A(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (B(), H(Vr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			U("span", Fh, j(e.title), 1),
			W(Ph, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			U("span", {
				class: "row",
				onClick: r[0] ||= rs(() => {}, ["stop"])
			}, [Wr(n.$slots, "actions")]),
			e.collapsible ? (B(), H(F(qp), {
				key: 1,
				class: A(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (B(), V("div", Ih, [Wr(n.$slots, "default")])) : G("", !0)], 2));
	}
}), Rh = {
	key: 0,
	class: "badge neutral"
}, zh = { class: "pre small" }, Bh = /* @__PURE__ */ L({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (B(), H(Lh, {
			title: F(Y)("cards.recap"),
			icon: F(Em),
			collapsible: "",
			open: !1
		}, {
			actions: I(() => [e.coversUpTo === void 0 ? G("", !0) : (B(), V("span", Rh, "#0–" + j(e.coversUpTo), 1))]),
			default: I(() => [U("div", zh, j(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Vh = { class: "synopsis-line small" }, Hh = {
	key: 0,
	class: "row tight"
}, Uh = {
	key: 1,
	class: "row tight"
}, Wh = { class: "synopsis-event ellipsis" }, Gh = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, Kh = /* @__PURE__ */ L({
	__name: "SynopsisCard",
	props: { synopsis: {} },
	setup(e) {
		let t = /* @__PURE__ */ dn(!1);
		return (n, r) => (B(), V("div", {
			class: A(["synopsis", { open: t.value }]),
			onClick: r[0] ||= (e) => t.value = !t.value
		}, [U("div", Vh, [
			e.synopsis.time ? (B(), V("span", Hh, [W(F(Qp), { class: "faint" }), sa(j(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (B(), V("span", Uh, [W(F(pm), { class: "faint" }), sa(j(e.synopsis.location), 1)])) : G("", !0),
			U("span", Wh, j(e.synopsis.event), 1)
		]), t.value && e.synopsis.summary ? (B(), V("div", Gh, j(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), qh = ["innerHTML"], Jh = {
	key: 1,
	class: "kv-list small"
}, Yh = { class: "pre" }, Xh = /* @__PURE__ */ L({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? hh(t.value) : "");
		return (t, r) => (B(), H(Lh, {
			title: e.title,
			icon: F(Om),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [typeof e.value == "string" ? (B(), V("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, qh)) : (B(), V("dl", Jh, [(B(!0), V(z, null, R(e.value, (e, t) => (B(), V(z, { key: t }, [U("dt", null, j(t), 1), U("dd", Yh, j(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Zh = {
	key: 0,
	class: "cards"
}, Qh = /* @__PURE__ */ L({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = $m(() => t.mesid), r = K(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Tc(r, rl(r), r.narrator),
				color: Qm(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: o?.type === "recap.set" ? o : null,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: vl(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (e, t) => r.value ? (B(), V("div", Zh, [
			r.value.reply ? (B(), H(vh, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : G("", !0),
			r.value.impersonate ? (B(), H(Ch, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : G("", !0),
			r.value.options.length ? (B(), H(Oh, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : G("", !0),
			r.value.synopsis ? (B(), H(Kh, {
				key: 3,
				synopsis: r.value.synopsis
			}, null, 8, ["synopsis"])) : G("", !0),
			r.value.memory.length ? (B(), H(Mh, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : G("", !0),
			r.value.recap ? (B(), H(Bh, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : G("", !0),
			(B(!0), V(z, null, R(r.value.custom, (e) => (B(), H(Xh, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : G("", !0);
	}
}), $h = {
	key: 0,
	class: "dock stages live"
}, eg = { class: "stage-bar" }, tg = { class: "ellipsis" }, ng = {
	key: 0,
	class: "small muted"
}, rg = /* @__PURE__ */ L({
	__name: "Dock",
	setup(e) {
		let t = K(() => rf.current && !rf.current.streaming && rf.current.status === "running" ? rf.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = Yc(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: Zm(n, e.workflow, t.id, t.label),
				color: Qm(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (B(), V("div", $h, [U("div", eg, [
			W(F(fm), { class: "spin faint" }),
			(B(!0), V(z, null, R(n.value, (e) => (B(), V("span", {
				key: e.id,
				class: A(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Te({ "--actor": e.color })
			}, [U("span", tg, j(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (B(), V("span", ng, j(F(Y)("stages.waiting")), 1))
		]), r.value ? (B(), H(Xm, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), ig = ["aria-label"], ag = ["disabled"], og = /* @__PURE__ */ L({
	__name: "Switch",
	props: /*@__PURE__*/ Zr({
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
		let t = ni(e, "modelValue");
		return (n, r) => (B(), V("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			Zn(U("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, ag), [[Jo, t.value]]),
			r[1] ||= U("span", { class: "track" }, null, -1),
			r[2] ||= U("span", { class: "thumb" }, null, -1)
		], 8, ig));
	}
});
//#endregion
//#region src/app/install.ts
function sg(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function cg(e, t) {
	let n = Wc(e);
	if (!n) throw Error(Y("presets.invalid"));
	if (n.minAdvancedPreset && dc("1.1.0", n.minAdvancedPreset) < 0) throw Error(Y("presets.tooNew", { version: n.minAdvancedPreset }));
	Xc(n), t && (q().sources[n.id] = t), J();
	let r = Yc(n.id) ?? n;
	return pl(r), await kl(r), r;
}
async function lg(e) {
	let t = await f(sg(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return cg(await t.json(), e.trim());
}
async function ug(e) {
	return cg(JSON.parse(await e.text()));
}
async function dg(t) {
	if (Zc(t), delete q().sources[t], J(), $c(t)) {
		let e = Yc(t);
		e && (pl(e), await kl(e));
		return;
	}
	let n = Dl(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/components/Field.vue?vue&type=script&setup=true&lang.ts
var fg = { class: "field-label" }, pg = { class: "ellipsis" }, mg = {
	key: 0,
	class: "dot modified"
}, hg = { class: "field-control" }, gg = /* @__PURE__ */ L({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (B(), V("div", { class: A(["field", { inline: e.inline }]) }, [U("div", fg, [
			U("span", pg, j(e.label), 1),
			e.modified ? (B(), V("span", mg)) : G("", !0),
			W(Ph, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), U("div", hg, [Wr(t.$slots, "default")])], 2));
	}
}), _g = { class: "swatches" }, vg = ["title"], yg = ["title"], bg = /* @__PURE__ */ L({
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
		return (e, t) => (B(), H(Lh, {
			title: F(Y)("appearance.title"),
			icon: F(vm),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [W(gg, {
				label: F(Y)("appearance.colors"),
				help: F(Y)("appearance.colors.hint"),
				inline: ""
			}, {
				default: I(() => [U("div", _g, [
					U("label", {
						class: "swatch",
						style: Te({ background: F(r) || "var(--ap-primary-500)" }),
						title: F(Y)("appearance.primary")
					}, [Zn(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ P(r) ? r.value = e : null,
						type: "color"
					}, null, 512), [[
						qo,
						F(r),
						void 0,
						{ lazy: !0 }
					]])], 12, vg),
					U("label", {
						class: "swatch",
						style: Te({ background: F(i) || "var(--ap-accent-500)" }),
						title: F(Y)("appearance.accent")
					}, [Zn(U("input", {
						"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ P(i) ? i.value = e : null,
						type: "color"
					}, null, 512), [[
						qo,
						F(i),
						void 0,
						{ lazy: !0 }
					]])], 12, yg),
					W($, {
						icon: F(wm),
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
			}, 8, ["label", "help"]), W(gg, {
				label: F(Y)("appearance.collapseStages"),
				inline: ""
			}, {
				default: I(() => [W(og, {
					modelValue: a.value,
					"onUpdate:modelValue": t[2] ||= (e) => a.value = e
				}, null, 8, ["modelValue"])]),
				_: 1
			}, 8, ["label"])]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), xg = { class: "toolbar" }, Sg = ["disabled"], Cg = ["disabled"], wg = { class: "preset-list" }, Tg = ["onClick", "onKeydown"], Eg = { class: "preset-mark" }, Dg = { class: "grow col preset-info" }, Og = { class: "row wrap preset-head" }, kg = { class: "preset-name" }, Ag = { class: "badge neutral" }, jg = {
	key: 0,
	class: "xs muted"
}, Mg = {
	key: 1,
	class: "small muted preset-desc"
}, Ng = {
	key: 0,
	class: "empty"
}, Pg = /* @__PURE__ */ L({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => Gc()), n = /* @__PURE__ */ dn(null), r = /* @__PURE__ */ dn(!1), i = /* @__PURE__ */ dn(""), a = /* @__PURE__ */ dn(null);
		async function o(e, t, r) {
			n.value = e;
			try {
				await t(), r && d("success", r);
			} catch (e) {
				d("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				n.value = null;
			}
		}
		let s = (e) => o(`select:${e.preset.id}`, async () => {
			await Al(e.preset), qf();
		}), c = () => o("url", async () => {
			let e = await lg(i.value);
			return i.value = "", r.value = !1, e;
		}, Y("presets.installed")), l = (e) => {
			let t = e.target.files?.[0];
			t && o("file", () => ug(t), Y("presets.installed")), e.target.value = "";
		}, u = (e) => o(`update:${e.preset.id}`, () => lg(q().sources[e.preset.id]), Y("presets.updated")), f = (e) => o(`remove:${e.preset.id}`, () => dg(e.preset.id)), p = () => o("ext", async () => d("info", await Of() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, o) => (B(), V(z, null, [
			U("div", xg, [
				U("button", {
					type: "button",
					class: "btn",
					disabled: n.value === "file",
					onClick: o[0] ||= (e) => a.value?.click()
				}, [W(F(Fm)), sa(j(F(Y)("presets.importFile")), 1)], 8, Sg),
				U("button", {
					type: "button",
					class: A(["btn", { primary: r.value }]),
					onClick: o[1] ||= (e) => r.value = !r.value
				}, [W(F(dm)), sa(j(F(Y)("presets.importUrl")), 1)], 2),
				o[4] ||= U("span", { class: "grow" }, null, -1),
				W($, {
					icon: n.value === "ext" ? F(fm) : F(Cm),
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
				onSubmit: rs(c, ["prevent"])
			}, [Zn(U("input", {
				"onUpdate:modelValue": o[2] ||= (e) => i.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[qo, i.value]]), U("button", {
				type: "submit",
				class: "btn primary",
				disabled: n.value === "url"
			}, [n.value === "url" ? (B(), H(F(fm), {
				key: 0,
				class: "spin"
			})) : (B(), H(F(nm), { key: 1 })), sa(j(F(Y)("common.install")), 1)], 8, Cg)], 32)) : G("", !0),
			U("div", wg, [(B(!0), V(z, null, R(t.value, (e) => (B(), V("div", {
				key: e.preset.id,
				class: A(["preset-item", { on: F(Jf)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => s(e),
				onKeydown: as((t) => s(e), ["enter"])
			}, [
				U("span", Eg, [n.value === `select:${e.preset.id}` ? (B(), H(F(fm), {
					key: 0,
					class: "spin"
				})) : F(Jf)?.id === e.preset.id ? (B(), H(F(Kp), { key: 1 })) : G("", !0)]),
				U("div", Dg, [
					U("div", Og, [
						U("span", kg, j(e.preset.name), 1),
						U("span", Ag, "v" + j(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (B(), V("span", {
							key: 0,
							class: A(["badge", { warn: e.source === "dev" }])
						}, j(F(Y)(`presets.source.${e.source}`)), 3))
					]),
					e.preset.author ? (B(), V("span", jg, j(e.preset.author), 1)) : G("", !0),
					e.preset.description ? (B(), V("span", Mg, j(e.preset.description), 1)) : G("", !0)
				]),
				U("div", {
					class: "row preset-actions",
					onClick: o[3] ||= rs(() => {}, ["stop"])
				}, [e.source === "installed" && F(q)().sources[e.preset.id] ? (B(), H($, {
					key: 0,
					icon: F(Cm),
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
					icon: F(Mm),
					label: F(Y)("common.delete"),
					align: "end",
					small: "",
					danger: "",
					onClick: (t) => f(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : G("", !0)])
			], 42, Tg))), 128)), t.value.length ? G("", !0) : (B(), V("div", Ng, j(F(Y)("presets.none")), 1))]),
			W(bg)
		], 64));
	}
}), Fg;
function Ig() {
	let e = Jf, t = K(() => e.value ? rl(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (al(r, t), n.sampling && (clearTimeout(Fg), Fg = setTimeout(() => void jl(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Lg = { class: "empty" }, Rg = /* @__PURE__ */ L({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (B(), V("div", Lg, [
			W(F(_m)),
			U("span", null, j(F(Y)("panel.noPreset")), 1),
			U("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => F(Z).tab = "presets"
			}, j(F(Y)("panel.choosePreset")), 1)
		]));
	}
}), zg = [
	"aria-checked",
	"title",
	"onClick"
], Bg = { class: "ellipsis" }, Vg = /* @__PURE__ */ L({
	__name: "Segmented",
	props: /*@__PURE__*/ Zr({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ni(e, "modelValue");
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
		}, [e.icon ? (B(), H(Vr(e.icon), { key: 0 })) : G("", !0), U("span", Bg, j(e.label), 1)], 10, zg))), 128))], 2));
	}
}), Hg = { class: "col" }, Ug = { class: "row" }, Wg = ["aria-label"], Gg = ["label"], Kg = ["value"], qg = ["label"], Jg = ["value"], Yg = ["placeholder"], Xg = {
	key: 1,
	class: "xs muted row tight"
}, Zg = { value: "" }, Qg = ["value"], $g = ["value"], e_ = { class: "slider" }, t_ = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], n_ = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], r_ = { class: "field-grid" }, i_ = ["value", "onChange"], a_ = ["value"], o_ = ["value"], s_ = /* @__PURE__ */ L({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Ig(), i = K(() => t.value ? el(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				ol(n, {
					kind: r,
					id: i.join(":")
				}), jl(n);
			}
		}), o = K(() => t.value ? sl(t.value) : !1), s = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ dn(null), l = /* @__PURE__ */ dn("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? ll(e, n) : s.value && dl(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (cl(t.value), jl(t.value));
		}, p = () => {
			t.value && s.value && (fl(t.value, s.value), jl(t.value));
		}, m = () => {
			t.value && s.value && ul(t.value, s.value);
		}, h = K(() => ms.map((e) => ({
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
			label: vl(t.value, "workflows", e.id, "name", e.name),
			hint: vl(t.value, "workflows", e.id, "description", e.description ?? "")
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
		let C = S("forceTool"), w = S("parallelTools"), T = S("sendThoughtSignature"), ee = S("finalFallback"), E = S("maxSteps"), te = K({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ne = [
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
		], D = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], O = ["stream_openai", "show_thoughts"], re = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], k = K(() => n.value?.sampling ?? {}), ie = (e) => e in k.value, ae = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), oe = (e) => Number(e.target.value);
		return (e, r) => !F(t) || !F(n) || !i.value ? (B(), H(Rg, { key: 0 })) : (B(), V(z, { key: 1 }, [
			U("div", Hg, [
				U("div", Ug, [
					Zn(U("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": F(Y)("config.configuration")
					}, [U("optgroup", { label: F(Y)("config.recommended") }, [(B(!0), V(z, null, R(F(t).configurations, (e) => (B(), V("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, j(F(vl)(F(t), "configurations", e.id, "name", e.name)), 9, Kg))), 128))], 8, Gg), i.value.saved.length ? (B(), V("optgroup", {
						key: 0,
						label: F(Y)("config.saved")
					}, [(B(!0), V(z, null, R(i.value.saved, (e) => (B(), V("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, j(e.name), 9, Jg))), 128))], 8, qg)) : G("", !0)], 8, Wg), [[Xo, a.value]]),
					s.value && o.value ? (B(), H($, {
						key: 0,
						icon: F(Tm),
						label: F(Y)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: F(xm),
						label: F(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (B(), H($, {
						key: 1,
						icon: F(bm),
						label: F(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					s.value ? (B(), H($, {
						key: 2,
						icon: F(Mm),
						label: F(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: F(wm),
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
					onSubmit: rs(d, ["prevent"])
				}, [
					Zn(U("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: F(Y)("config.name"),
						autofocus: ""
					}, null, 8, Yg), [[qo, l.value]]),
					W($, {
						icon: F(Rm),
						label: F(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					W($, {
						icon: F(Kp),
						label: F(Y)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				o.value ? (B(), V("span", Xg, [r[14] ||= U("span", { class: "dot modified" }, null, -1), sa(j(F(Y)("config.modified")), 1)])) : G("", !0)
			]),
			W(Lh, {
				title: F(Y)("config.connection"),
				icon: F(Gp)
			}, {
				default: I(() => [
					W(gg, {
						label: F(Y)("config.transport"),
						help: F(Y)(`transport.${g.value}.hint`)
					}, {
						default: I(() => [W(Vg, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (B(), V(z, { key: 0 }, [
						W(gg, {
							label: F(Y)("config.forceTool"),
							help: F(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: I(() => [W(og, {
								modelValue: F(C),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ P(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(gg, {
							label: F(Y)("config.parallelTools"),
							help: F(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: I(() => [W(og, {
								modelValue: F(w),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ P(w) ? w.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(gg, {
							label: F(Y)("config.syntheticTurn"),
							help: F(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: I(() => [Zn(U("select", {
								"onUpdate:modelValue": r[8] ||= (e) => te.value = e,
								class: "input"
							}, [U("option", Zg, j(F(Y)("common.none")), 1), (B(!0), V(z, null, R(F(t).syntheticTurns, (e) => (B(), V("option", {
								key: e.id,
								value: e.id
							}, j(e.label), 9, Qg))), 128))], 512), [[Xo, te.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						W(gg, {
							label: F(Y)("config.thoughtSignature"),
							help: F(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: I(() => [W(og, {
								modelValue: F(T),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ P(T) ? T.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (B(), H(gg, {
							key: 0,
							label: F(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: I(() => [U("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: F(E),
								onChange: r[10] ||= (e) => E.value = oe(e)
							}, null, 40, $g)]),
							_: 1
						}, 8, ["label"])) : G("", !0)
					], 64)) : G("", !0),
					W(gg, {
						label: F(Y)("config.finalFallback"),
						help: F(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: I(() => [W(og, {
							modelValue: F(ee),
							"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ P(ee) ? ee.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (B(), H(Lh, {
				key: 0,
				title: F(Y)("config.workflow"),
				icon: F(Lm),
				help: x.value
			}, {
				default: I(() => [W(Vg, {
					modelValue: b.value,
					"onUpdate:modelValue": r[12] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : G("", !0),
			W(Lh, {
				title: F(Y)("config.sampling"),
				icon: F(om),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [
					(B(), V(z, null, R(ne, (e) => (B(), V(z, { key: e.key }, [ie(e.key) ? (B(), H(gg, {
						key: 0,
						label: F(Y)(`sampling.${e.key}`)
					}, {
						default: I(() => [U("div", e_, [U("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: k.value[e.key],
							onInput: (t) => ae(e.key, oe(t))
						}, null, 40, t_), U("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: k.value[e.key],
							onChange: (t) => ae(e.key, oe(t))
						}, null, 40, n_)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					U("div", r_, [(B(), V(z, null, R(D, (e) => (B(), V(z, { key: e }, [ie(e) ? (B(), H(gg, {
						key: 0,
						label: F(Y)(`sampling.${e}`)
					}, {
						default: I(() => [U("input", {
							class: "input",
							type: "number",
							value: k.value[e],
							onChange: (t) => ae(e, oe(t))
						}, null, 40, i_)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), ie("reasoning_effort") ? (B(), H(gg, {
						key: 0,
						label: F(Y)("sampling.reasoning_effort")
					}, {
						default: I(() => [U("select", {
							class: "input",
							value: k.value.reasoning_effort,
							onChange: r[13] ||= (e) => ae("reasoning_effort", e.target.value)
						}, [(B(), V(z, null, R(re, (e) => U("option", {
							key: e,
							value: e
						}, j(F(Y)(`effort.${e}`)), 9, o_)), 64))], 40, a_)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(B(), V(z, null, R(O, (e) => (B(), V(z, { key: e }, [ie(e) ? (B(), H(gg, {
						key: 0,
						label: F(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: I(() => [W(og, {
							"model-value": !!k.value[e],
							"onUpdate:modelValue": (t) => ae(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), c_ = ["aria-checked", "onClick"], l_ = { class: "grow" }, u_ = ["aria-checked", "onClick"], d_ = { class: "grow muted" }, f_ = { class: "grow" }, p_ = { class: "ellipsis" }, m_ = {
	key: 0,
	class: "empty"
}, h_ = /* @__PURE__ */ L({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Ig(), i = K(() => t.value && n.value ? Cc(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))];
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? vl(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && vl(e, "groups", t, "description", r?.description ?? "") || void 0,
					allowNone: !!r?.allowNone,
					choices: a.map((e) => ({
						key: e,
						modules: i.filter((t) => t.exclusive === e)
					})),
					toggles: i.filter((e) => !e.exclusive)
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => vl(t.value, "modules", e.id, "name", e.name), s = (e) => vl(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		return (e, r) => !F(t) || !F(n) ? (B(), H(Rg, { key: 0 })) : (B(), V(z, { key: 1 }, [(B(!0), V(z, null, R(a.value, (e) => (B(), H(Lh, {
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
				U("span", l_, j(o(e)), 1),
				W(Ph, {
					text: s(e),
					align: "end"
				}, null, 8, ["text"])
			], 10, c_))), 128)), e.allowNone ? (B(), V("button", {
				key: 0,
				type: "button",
				role: "radio",
				class: A(["choice", { on: c(t) === null }]),
				"aria-checked": c(t) === null,
				onClick: (e) => l(t, null)
			}, [r[1] ||= U("span", { class: "radio" }, null, -1), U("span", d_, j(F(Y)("common.none")), 1)], 10, u_)) : G("", !0)]))), 128)), (B(!0), V(z, null, R(e.toggles, (e) => (B(), V("div", {
				key: e.id,
				class: "module-row"
			}, [U("span", f_, [U("span", p_, j(o(e)), 1), W(Ph, {
				text: s(e),
				align: "start"
			}, null, 8, ["text"])]), W(og, {
				"model-value": i.value[e.id],
				label: o(e),
				"onUpdate:modelValue": (t) => u(e, t)
			}, null, 8, [
				"model-value",
				"label",
				"onUpdate:modelValue"
			])]))), 128))]),
			_: 2
		}, 1032, ["title", "help"]))), 128)), a.value.length ? G("", !0) : (B(), V("div", m_, j(F(Y)("modules.none")), 1))], 64));
	}
}), g_ = ["value", "onChange"], __ = ["value"], v_ = {
	key: 1,
	class: "unit"
}, y_ = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], b_ = {
	key: 0,
	class: "small muted"
}, x_ = [
	"list",
	"value",
	"placeholder",
	"onChange"
], S_ = ["id"], C_ = ["value"], w_ = [
	"value",
	"placeholder",
	"onChange"
], T_ = [
	"value",
	"placeholder",
	"onChange"
], E_ = {
	key: 0,
	class: "field-grid"
}, D_ = ["value"], O_ = ["value"], k_ = ["value"], A_ = /* @__PURE__ */ L({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Ig(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? vl(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && vl(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => vl(t.value, "params", e.id, "label", e.label), o = (e) => vl(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => _l(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => n.value?.params[e.id] ?? e.default, l = (e, t) => r((n) => {
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
		return (e, r) => !F(t) || !F(n) ? (B(), H(Rg, { key: 0 })) : (B(), V(z, { key: 1 }, [
			(B(!0), V(z, null, R(i.value, (e) => (B(), H(Lh, {
				key: e.id,
				title: e.label,
				help: e.help,
				icon: F(Am)
			}, {
				default: I(() => [(B(!0), V(z, null, R(e.params, (e) => (B(), H(gg, {
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
					}, j(s(e, t.value, t.label)), 9, __))), 128))], 40, g_)) : e.type === "number" ? (B(), V("div", v_, [U("input", {
						class: "input",
						type: "number",
						min: e.min,
						max: e.max,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, y_), e.unit ? (B(), V("span", b_, j(e.unit), 1)) : G("", !0)])) : (B(), V(z, { key: 2 }, [U("input", {
						class: "input",
						list: e.options?.length ? h(e) : void 0,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, x_), e.options?.length ? (B(), V("datalist", {
						key: 0,
						id: h(e)
					}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
						key: String(t.value),
						value: t.value
					}, j(s(e, t.value, t.label)), 9, C_))), 128))], 8, S_)) : G("", !0)], 64))]),
					_: 2
				}, 1032, ["label", "help"]))), 128))]),
				_: 2
			}, 1032, [
				"title",
				"help",
				"icon"
			]))), 128)),
			W(Lh, {
				title: F(Y)("writing.actors"),
				icon: F(rm),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [(B(!0), V(z, null, R(u.value, ([e, t]) => (B(), V("div", {
					key: e,
					class: "field-grid"
				}, [W(gg, { label: F(Y)("writing.actorName", { actor: e }) }, {
					default: I(() => [U("input", {
						class: "input",
						value: F(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => d("names", e, t.target.value)
					}, null, 40, w_)]),
					_: 2
				}, 1032, ["label"]), W(gg, { label: F(Y)("writing.actorPrefix") }, {
					default: I(() => [U("input", {
						class: "input",
						value: F(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => d("prefixes", e, t.target.value)
					}, null, 40, T_)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lh, {
				title: F(Y)("writing.tokenSaving"),
				icon: F(em),
				help: F(Y)("writing.tokenSaving.hint")
			}, {
				actions: I(() => [W(og, {
					modelValue: f.value,
					"onUpdate:modelValue": r[0] ||= (e) => f.value = e,
					label: F(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: I(() => [f.value ? (B(), V("div", E_, [W(gg, {
					label: F(Y)("writing.keepFullTurns"),
					help: F(Y)("writing.keepFullTurns.hint")
				}, {
					default: I(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).tokenSaving.keepFullTurns,
						onChange: r[1] ||= (e) => p("keepFullTurns", e.target.value)
					}, null, 40, D_)]),
					_: 1
				}, 8, ["label", "help"]), W(gg, {
					label: F(Y)("writing.truncateUserAfter"),
					help: F(Y)("writing.truncateUserAfter.hint")
				}, {
					default: I(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).tokenSaving.truncateUserAfter,
						onChange: r[2] ||= (e) => p("truncateUserAfter", e.target.value)
					}, null, 40, O_)]),
					_: 1
				}, 8, ["label", "help"])])) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lh, {
				title: F(Y)("writing.meta"),
				icon: F(hm)
			}, {
				default: I(() => [W(gg, {
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
					}, null, 40, k_)]),
					_: 1
				}, 8, ["label", "help"])]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), j_ = { class: "kv" }, M_ = {
	key: 0,
	class: "kv-row"
}, N_ = { class: "kv-key ellipsis" }, P_ = { class: "kv-value pre small" }, F_ = {
	key: 0,
	class: "kv-actions"
}, I_ = {
	key: 1,
	class: "kv-edit col"
}, L_ = ["placeholder"], R_ = ["placeholder"], z_ = { class: "row end" }, B_ = {
	key: 0,
	class: "kv-edit col"
}, V_ = ["placeholder"], H_ = ["placeholder"], U_ = { class: "row end" }, W_ = {
	key: 1,
	class: "faint small kv-empty"
}, G_ = /* @__PURE__ */ L({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ dn(null), a = /* @__PURE__ */ dn(""), o = /* @__PURE__ */ dn("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (B(), V("div", j_, [
			(B(!0), V(z, null, R(e.entries, (t, l) => (B(), V(z, { key: l }, [i.value === l ? (B(), V("div", I_, [
				Zn(U("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Y)("memory.key")
				}, null, 8, L_), [[qo, a.value]]),
				Zn(U("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Y)("memory.content")
				}, null, 8, R_), [[qo, o.value]]),
				U("div", z_, [W($, {
					icon: F(Rm),
					label: F(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: F(Kp),
					label: F(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (B(), V("div", M_, [
				U("div", N_, j(l), 1),
				U("div", P_, j(t), 1),
				e.readonly ? G("", !0) : (B(), V("div", F_, [W($, {
					icon: F(bm),
					label: F(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), W($, {
					icon: F(Mm),
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
			i.value === "" ? (B(), V("div", B_, [
				Zn(U("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Y)("memory.key")
				}, null, 8, V_), [[qo, a.value]]),
				Zn(U("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Y)("memory.content")
				}, null, 8, H_), [[qo, o.value]]),
				U("div", U_, [W($, {
					icon: F(Rm),
					label: F(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: F(Kp),
					label: F(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (B(), V("div", W_, j(F(Y)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (B(), V("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [W(F(xm)), sa(j(F(Y)("common.add")), 1)])) : G("", !0)
		]));
	}
}), K_ = {
	key: 1,
	class: "faint small"
}, q_ = {
	key: 0,
	class: "badge neutral"
}, J_ = ["placeholder"], Y_ = {
	key: 1,
	class: "faint small"
}, X_ = /* @__PURE__ */ L({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Ig(), r = K(() => n.value ? el(n.value) : null), i = K(() => (Z.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = K(() => (Z.chatRev, i.value ? Bl() : {})), o = K(() => r.value ? Ul(r.value) : {}), s = K(() => (Z.chatRev, i.value ? Vl() : null));
		async function c(e, t) {
			await Hl({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), Kf();
		}
		async function l(e) {
			await Hl({
				type: "memory.delete",
				key: e,
				source: "user"
			}), Kf();
		}
		let u = (e, t) => r.value && Wl(r.value, "replace", e, t, "user"), d = (e) => r.value && Wl(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ dn("");
		ir(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = K(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Hl({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), Kf();
		}
		return (e, t) => !F(n) || !r.value ? (B(), H(Rg, { key: 0 })) : (B(), V(z, { key: 1 }, [
			W(Lh, {
				title: F(Y)("memory.chat"),
				icon: F(mm),
				help: F(Y)("memory.chat.hint")
			}, {
				default: I(() => [i.value ? (B(), H(G_, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (B(), V("div", K_, j(F(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lh, {
				title: F(Y)("memory.global"),
				icon: F(cm),
				help: F(Y)("memory.global.hint")
			}, {
				actions: I(() => [W($, {
					icon: F(Pm),
					label: F(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !F(Gl)(r.value),
					onClick: t[0] ||= (e) => F(ql)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), W($, {
					icon: F(Sm),
					label: F(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !F(Kl)(r.value),
					onClick: t[1] ||= (e) => F(Jl)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: I(() => [W(G_, {
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
			W(Lh, {
				title: F(Y)("memory.recap"),
				icon: F(Em),
				help: F(Y)("memory.recap.hint")
			}, {
				actions: I(() => [s.value ? (B(), V("span", q_, "#0–" + j(s.value.coversUpTo), 1)) : G("", !0), i.value ? (B(), H($, {
					key: 1,
					icon: F(Kp),
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
				default: I(() => [i.value ? Zn((B(), V("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: F(Y)("memory.recap.empty")
				}, null, 8, J_)), [[qo, f.value]]) : (B(), V("div", Y_, j(F(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), Z_ = { class: "row tight xs muted" }, Q_ = { class: "row" }, $_ = {
	key: 0,
	class: "xs text-danger"
}, ev = { class: "row wrap xs muted" }, tv = { class: "badge neutral" }, nv = {
	key: 0,
	class: "badge neutral"
}, rv = { class: "badge neutral" }, iv = {
	key: 1,
	class: "badge warn"
}, av = ["onClick"], ov = { class: "grow mono" }, sv = { class: "xs muted" }, cv = { class: "row xs muted" }, lv = { class: "badge neutral" }, uv = { class: "pre mono scroll" }, dv = {
	key: 0,
	class: "xs faint region-msg"
}, fv = {
	key: 0,
	class: "xs text-warning"
}, pv = {
	key: 1,
	class: "faint small"
}, mv = ["onClick"], hv = { class: "mono grow ellipsis" }, gv = {
	key: 0,
	class: "badge warn"
}, _v = { class: "xs muted" }, vv = { class: "xs muted" }, yv = { class: "row xs muted" }, bv = { class: "grow" }, xv = { class: "mono scroll" }, Sv = { class: "row xs muted" }, Cv = { class: "grow" }, wv = { class: "mono scroll" }, Tv = {
	key: 0,
	class: "faint small"
}, Ev = { class: "row xs" }, Dv = { class: "badge neutral" }, Ov = { class: "muted" }, kv = { class: "mono scroll" }, Av = {
	key: 0,
	class: "faint small"
}, jv = { class: "xs faint mono build" }, Mv = /* @__PURE__ */ L({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => vu.log.find((e) => e.kind === "assembly")?.data), r = /* @__PURE__ */ $t(/* @__PURE__ */ new Set()), i = (e) => r.has(e) ? r.delete(e) : r.add(e), a = /* @__PURE__ */ $t({});
		ir(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (a[i] === void 0 && r) try {
					a[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let o = /* @__PURE__ */ dn(null), s = (e) => typeof e == "string" ? c(e) : JSON.stringify(e, null, 2);
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
		}), m = K(() => vu.log.filter((e) => e.kind !== "assembly"));
		return (e, t) => (B(), V(z, null, [
			W(Lh, {
				title: F(Y)("debug.dev"),
				icon: F(Dm),
				help: F(Y)("debug.dev.hint")
			}, {
				actions: I(() => [U("span", Z_, [U("span", { class: A(["dot status-dot", F(Af).status]) }, null, 2), sa(j(F(Y)(`debug.dev.${F(Af).status}`)), 1)])]),
				default: I(() => [W(gg, { label: F(Y)("debug.dev.url") }, {
					default: I(() => [U("div", Q_, [Zn(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => p.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						qo,
						p.value,
						void 0,
						{ lazy: !0 }
					]]), W(og, {
						modelValue: f.value,
						"onUpdate:modelValue": t[1] ||= (e) => f.value = e,
						label: F(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), F(Af).error ? (B(), V("span", $_, j(F(Af).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lh, {
				title: F(Y)("debug.assembly"),
				icon: F(am),
				collapsible: ""
			}, {
				default: I(() => [n.value ? (B(), V(z, { key: 0 }, [
					U("div", ev, [
						U("span", tv, j(F(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (B(), V("span", nv, j(n.value.workflow), 1)) : G("", !0),
						U("span", rv, j(n.value.origin), 1),
						n.value.dryRun ? (B(), V("span", iv, "dry run")) : G("", !0),
						t[3] ||= U("span", { class: "grow" }, null, -1),
						sa(j(l(n.value.at)), 1)
					]),
					U("div", null, [(B(!0), V(z, null, R(n.value.regions, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => i(e.id)
					}, [
						W(F(Jp), { class: A(["faint caret", { open: r.has(e.id) }]) }, null, 8, ["class"]),
						U("span", ov, j(e.id), 1),
						U("span", sv, j(e.messages.length) + " · " + j(a[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + j(a[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, av), r.has(e.id) ? (B(), V(z, { key: 0 }, [(B(!0), V(z, null, R(e.messages, (e, t) => (B(), V("div", {
						key: t,
						class: "region-msg"
					}, [U("div", cv, [U("span", lv, j(e.role), 1), sa(j(e.chars) + " ch", 1)]), U("div", uv, j(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (B(), V("div", dv, j(F(Y)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.warnings.length ? (B(), V("div", fv, j(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (B(), V("div", pv, j(F(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lh, {
				title: F(Y)("debug.requests"),
				icon: F($p),
				collapsible: ""
			}, {
				default: I(() => [(B(!0), V(z, null, R(F(vu).requests, (e, t) => (B(), V("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [U("div", {
					class: "row small clickable",
					onClick: (e) => o.value = o.value === t ? null : t
				}, [
					U("span", hv, j(e.genId) + " · #" + j(e.step), 1),
					e.error ? (B(), V("span", gv, j(F(Y)("debug.error")), 1)) : G("", !0),
					U("span", _v, j(d(e.usage)), 1),
					U("span", vv, j(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, mv), o.value === t ? (B(), V(z, { key: 0 }, [
					U("div", yv, [U("span", bv, j(F(Y)("debug.request")), 1), W($, {
						icon: F(tm),
						label: F(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", xv, j(s(e.request)), 1),
					U("div", Sv, [U("span", Cv, j(F(Y)("debug.response")), 1), W($, {
						icon: F(tm),
						label: F(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => u(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", wv, j(e.error ?? s(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), F(vu).requests.length ? G("", !0) : (B(), V("div", Tv, j(F(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lh, {
				title: F(Y)("debug.log"),
				icon: F(Em),
				collapsible: "",
				open: !1
			}, {
				actions: I(() => [W($, {
					icon: F(Mm),
					label: F(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => F(vu).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: I(() => [(B(!0), V(z, null, R(m.value, (e, n) => (B(), V("div", {
					key: n,
					class: "req"
				}, [U("div", Ev, [
					U("span", Dv, j(e.kind), 1),
					t[4] ||= U("span", { class: "grow" }, null, -1),
					U("span", Ov, j(l(e.at)), 1)
				]), U("pre", kv, j(s(e.data)), 1)]))), 128)), m.value.length ? G("", !0) : (B(), V("div", Av, j(F(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			U("div", jv, "Advanced Preset " + j(F("1.1.0")) + " · " + j(F("f7040f6cbf707ed5")), 1)
		], 64));
	}
}), Nv = ["aria-label"], Pv = { class: "panel-head" }, Fv = { class: "panel-logo" }, Iv = { class: "grow" }, Lv = { class: "panel-title ellipsis" }, Rv = { class: "panel-sub ellipsis" }, zv = {
	class: "tabs",
	role: "tablist"
}, Bv = [
	"title",
	"aria-selected",
	"onClick"
], Vv = { class: "panel-body scroll" }, Hv = /* @__PURE__ */ L({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: _m,
				view: Pg
			},
			{
				id: "config",
				icon: km,
				view: s_
			},
			{
				id: "modules",
				icon: Hp,
				view: h_
			},
			{
				id: "writing",
				icon: ym,
				view: A_
			},
			{
				id: "memory",
				icon: Up,
				view: X_
			},
			{
				id: "debug",
				icon: Wp,
				view: Mv
			}
		], n = K(() => t.find((e) => e.id === Z.tab) ?? t[0]), r = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), i = K(() => {
			let e = Jf.value;
			return e ? `v${e.version} · ${Yf.value.config}` : Y("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && Z.panelOpen && (Z.panelOpen = !1);
		};
		return Ir(() => document.addEventListener("keydown", a)), Rr(() => document.removeEventListener("keydown", a)), (e, a) => (B(), H(Ya, { name: "panel" }, {
			default: I(() => [F(Z).panelOpen ? (B(), V("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": F(Y)("app.name")
			}, [
				U("header", Pv, [
					U("div", Fv, [W(F(um))]),
					U("div", Iv, [U("div", Lv, j(F(Jf)?.name ?? F(Y)("app.name")), 1), U("div", Rv, j(i.value), 1)]),
					W(og, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: F(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					W($, {
						icon: F(Rm),
						label: F(Y)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => F(Z).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				U("nav", zv, [(B(), V(z, null, R(t, (e) => U("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: A(["tab", { on: e.id === F(Z).tab }]),
					title: F(Y)(`tab.${e.id}`),
					"aria-selected": e.id === F(Z).tab,
					onClick: (t) => F(Z).tab = e.id
				}, [(B(), H(Vr(e.icon))), U("span", null, j(F(Y)(`tab.${e.id}`)), 1)], 10, Bv)), 64))]),
				U("main", Vv, [(B(), H(Ar, null, [(B(), H(Vr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, Nv)) : G("", !0)]),
			_: 1
		}));
	}
}), Uv = { class: "inline-drawer" }, Wv = { class: "inline-drawer-toggle inline-drawer-header" }, Gv = { class: "inline-drawer-content" }, Kv = { class: "flex-container alignItemsCenter spaceBetween" }, qv = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, Jv = { key: 0 }, Yv = { class: "text_muted" }, Xv = {
	key: 1,
	class: "text_muted"
}, Zv = /* @__PURE__ */ L({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (B(), V("div", Uv, [U("div", Wv, [U("b", null, j(F(Y)("app.name")), 1), n[3] ||= U("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), U("div", Gv, [
			U("div", Kv, [U("label", qv, [Zn(U("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Jo, t.value]]), U("span", null, j(F(Y)("settings.enable")), 1)]), U("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => F(Qf)(),
				onKeydown: n[2] ||= as((e) => F(Qf)(), ["enter"])
			}, [n[4] ||= U("i", { class: "fa-solid fa-layer-group" }, null, -1), U("span", null, j(F(Y)("panel.open")), 1)], 32)]),
			n[5] ||= U("hr", null, null, -1),
			U("h4", null, j(F(Y)("settings.preset")), 1),
			F(Jf) ? (B(), V("div", Jv, [sa(j(F(Jf).name) + " ", 1), U("span", Yv, "v" + j(F(Jf).version) + " · " + j(F(Yf).config), 1)])) : (B(), V("i", Xv, j(F(Y)("settings.inactive")), 1))
		])]));
	}
});
//#endregion
//#region src/ui/index.ts
function Qv() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), ls(Zv).mount(t);
}
function $v() {
	fp("ap-stages", ch, ["mesid"]), fp("ap-cards", Qh, ["mesid"]), fp("ap-dock", rg), fp("ap-panel", Hv), up(), qf();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, qf);
	jp(), Qv(), wp();
}
//#endregion
//#region src/index.ts
var ey = {
	version: "1.1.0",
	buildId: "f7040f6cbf707ed5",
	nextGeneration: (e) => Ql(e),
	listPresets: () => Gc().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => wl(),
	update: Of
};
globalThis.advancedPresetInterceptor = _u, window.AdvancedPreset = ey;
function ty(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function ny() {
	for (let { preset: e } of Gc()) try {
		await kl(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function ry() {
	let { eventSource: t, eventTypes: n } = e();
	q(), vf(), Vf(), await r(), await Uc();
	for (let { preset: e } of Gc()) {
		let t = pl(e);
		t.length && bu("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Mu(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => yf(e)), t.on(n.MESSAGE_RECEIVED, (e, t) => Sf(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		cu.setPending(null), cu.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => cu.sweep());
	let i = ty(() => {
		let e = wl(), t = e ? Yc(e) : void 0;
		t && Nl(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, i), t.on(n.OAI_PRESET_CHANGED_AFTER, i);
	let a = async () => {
		await ny(), Ff(), Ef();
	};
	t.on(n.APP_READY, () => void a()), $v(), bu("init", {
		version: "1.1.0",
		build: "f7040f6cbf707ed5",
		enabled: q().enabled
	});
}
var iy = Df;
ry().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { iy as advancedPresetOnUpdate };

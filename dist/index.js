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
	let t = e().chatCompletionSettings ?? {}, r = String(t.chat_completion_source ?? ""), i = "";
	try {
		i = String(n.getChatCompletionModel?.() ?? "");
	} catch {
		i = "";
	}
	if (!i) {
		let e = {
			makersuite: "google_model",
			mistralai: "mistralai_model"
		}[r] ?? `${r}_model`;
		i = String(t[e] ?? "");
	}
	let a = String(r === "custom" ? t.custom_url ?? "" : t.reverse_proxy ?? "");
	return [
		r,
		i,
		a
	].join("|");
}
function o() {
	let e = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
	return e ? decodeURIComponent(e[1]) : "third-party/advanced-preset";
}
var s = () => r("../");
function c(e) {
	return {
		chatCompletionSource: String(e.chat_completion_source ?? ""),
		model: e.model ?? null,
		customApiFormat: e.custom_api_format ?? null,
		opencodeApiFormat: e.opencode_api_format ?? null
	};
}
function l(e, t, r) {
	let i = typeof r == "string" ? { chatCompletionSource: r } : r;
	if (n.getStreamingReply) return n.getStreamingReply(e, t, {
		...i,
		overrideShowThoughts: !0
	});
	switch (u(i)) {
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
function u(e) {
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
var d = [
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
function f(e) {
	let t = u(e), r = n.getStreamingReply;
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
	return [t, ...d.map(([e]) => e).filter((e) => e !== t)].find((e) => i(d.find(([t]) => t === e)[1])) ?? t;
}
function p(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var m = (...e) => globalThis.fetch(...e), h = (e) => {
	m = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function g(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var _ = {}, v = [], y = () => {}, b = () => !1, x = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), S = (e) => e.startsWith("onUpdate:"), C = Object.assign, ee = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, te = Object.prototype.hasOwnProperty, w = (e, t) => te.call(e, t), T = Array.isArray, ne = (e) => le(e) === "[object Map]", re = (e) => le(e) === "[object Set]", ie = (e) => le(e) === "[object Date]", ae = (e) => le(e) === "[object RegExp]", E = (e) => typeof e == "function", D = (e) => typeof e == "string", oe = (e) => typeof e == "symbol", O = (e) => typeof e == "object" && !!e, se = (e) => (O(e) || E(e)) && E(e.then) && E(e.catch), ce = Object.prototype.toString, le = (e) => ce.call(e), ue = (e) => le(e).slice(8, -1), de = (e) => le(e) === "[object Object]", fe = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, pe = /* @__PURE__ */ g(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), me = (e) => {
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
	let t = D(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Ee, De = () => Ee ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Oe(e) {
	if (T(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = D(r) ? Me(r) : Oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (D(e) || O(e)) return e;
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
function k(e) {
	let t = "";
	if (D(e)) t = e;
	else if (T(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (O(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ne = /* @__PURE__ */ g("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
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
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = oe(e), i = oe(t), r || i ? e === t : (r = T(e), i = T(t), r || i ? r && i ? Re(e, t, n, Fe) : !1 : (r = O(e), i = O(t), r || i ? !r || !i ? !1 : Re(e, t, n, Le) : String(e) === String(t))));
}
function Be(e, t) {
	return e.findIndex((e) => ze(e, t));
}
var Ve = (e) => !!(e && e.__v_isRef === !0), A = (e) => D(e) ? e : e == null ? "" : T(e) || O(e) && (e.toString === ce || !E(e.toString)) ? Ve(e) ? A(e.value) : JSON.stringify(e, He, 2) : String(e), He = (e, t) => Ve(t) ? He(e, t.value) : ne(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ue(t, r) + " =>"] = n, e), {}) } : re(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ue(e)) } : oe(t) ? Ue(t) : O(t) && !T(t) && !de(t) ? String(t) : t, Ue = (e, t = "") => oe(e) ? `Symbol(${e.description ?? t})` : e, We, Ge = class {
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
var j, qe = /* @__PURE__ */ new WeakSet(), Je = class {
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
		let e = j, t = st;
		j = this, st = !0;
		try {
			return this.fn();
		} finally {
			nt(this), j = e, st = t, this.flags &= -3;
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
	let t = e.dep, n = j, r = st;
	j = e, st = !0;
	try {
		tt(e);
		let n = e.fn(e._value);
		(t.version === 0 || xe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		j = n, st = r, nt(e), e.flags &= -3;
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
		let e = j;
		j = void 0;
		try {
			t();
		} finally {
			j = e;
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
		if (!j || !st || j === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== j) t = this.activeLink = new pt(j, this), j.deps ? (t.prevDep = j.depsTail, j.depsTail.nextDep = t, j.depsTail = t) : j.deps = j.depsTail = t, ht(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = j.depsTail, t.nextDep = void 0, j.depsTail.nextDep = t, j.depsTail = t, j.deps === t && (j.deps = e);
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
	if (st && j) {
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
		let i = T(e), a = i && fe(n);
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
	let t = /* @__PURE__ */ M(e);
	return t === e || (bt(t, "iterate", yt), /* @__PURE__ */ ln(e)) ? t : /* @__PURE__ */ cn(e) ? /* @__PURE__ */ sn(e) ? t.map((e) => pn(fn(e))) : t.map(pn) : t.map(fn);
}
function Ct(e) {
	return bt(e = /* @__PURE__ */ M(e), "iterate", yt), e;
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
		return St(this).concat(...e.map((e) => T(e) ? St(e) : e));
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
	let r = /* @__PURE__ */ M(e);
	bt(r, "iterate", yt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ un(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function Mt(e, t, n = []) {
	lt(), $e();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return et(), ut(), r;
}
var Nt = /* @__PURE__ */ g("__proto__,__v_isRef,__isVue"), Pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(oe));
function Ft(e) {
	oe(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
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
		let a = T(e);
		if (!r) {
			let e;
			if (a && (e = Tt[t])) return e;
			if (t === "hasOwnProperty") return Ft;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ mn(e) ? e : n);
		if ((oe(t) ? Pt.has(t) : Nt(t)) || (r || bt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ mn(o)) {
			let e = a && fe(t) ? o : o.value;
			return r && O(e) ? /* @__PURE__ */ an(e) : e;
		}
		return O(o) ? r ? /* @__PURE__ */ an(o) : /* @__PURE__ */ nn(o) : o;
	}
}, Lt = class extends It {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = T(e) && fe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ cn(i);
			if (!/* @__PURE__ */ ln(n) && !/* @__PURE__ */ cn(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ mn(i) && !/* @__PURE__ */ mn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : w(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ mn(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? xe(n, i) && xt(e, "set", t, n, i) : xt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = w(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && xt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!oe(t) || !Pt.has(t)) && bt(e, "has", t), n;
	}
	ownKeys(e) {
		return bt(e, "iterate", T(e) ? "length" : _t), Reflect.ownKeys(e);
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
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = ne(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ht : t ? pn : fn;
		return !t && bt(a, "iterate", c ? vt : _t), C(Object.create(l), { next() {
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
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (xe(n, a) && bt(i, "get", n), bt(i, "get", a));
			let { has: o } = Ut(i), s = t ? Ht : e ? pn : fn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && bt(/* @__PURE__ */ M(t), "iterate", _t), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (xe(t, i) && bt(r, "has", t), bt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? Ht : e ? pn : fn;
			return !e && bt(o, "iterate", _t), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return C(n, e ? {
		add: Gt("add"),
		set: Gt("set"),
		delete: Gt("delete"),
		clear: Gt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = Ut(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ ln(e) && !/* @__PURE__ */ cn(e) ? i : e;
			return r.has.call(n, a) || xe(e, a) && r.has.call(n, e) || xe(i, a) && r.has.call(n, i) || (n.add(a), xt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ ln(n) && !/* @__PURE__ */ cn(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = Ut(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? xe(n, s) && xt(r, "set", e, n, s) : xt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = Ut(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && xt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
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
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(w(n, i) && i in r ? n : r, i, a);
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
	if (!O(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
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
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function dn(e) {
	return !w(e, "__v_skip") && Object.isExtensible(e) && Ce(e, "__v_skip", !0), e;
}
var fn = (e) => O(e) ? /* @__PURE__ */ nn(e) : e, pn = (e) => O(e) ? /* @__PURE__ */ an(e) : e;
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	return hn(e, !1);
}
function hn(e, t) {
	return /* @__PURE__ */ mn(e) ? e : new gn(e, t);
}
var gn = class {
	constructor(e, t) {
		this.dep = new mt(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : fn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ ln(e) || /* @__PURE__ */ cn(e);
		e = n ? e : /* @__PURE__ */ M(e), xe(e, t) && (this._rawValue = e, this._value = n ? e : fn(e), this.dep.trigger());
	}
};
function P(e) {
	return /* @__PURE__ */ mn(e) ? e.value : e;
}
var _n = {
	get: (e, t, n) => t === "__v_raw" ? e : P(Reflect.get(e, t, n)),
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
		if (this.flags |= 16, !(this.flags & 8) && j !== this) return Qe(this, !0), !0;
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
	return E(e) ? r = e : (r = e.get, i = e.set), new xn(r, i, n);
}
var Cn = {}, wn = /* @__PURE__ */ new WeakMap(), Tn = void 0;
function En(e, t = !1, n = Tn) {
	if (n) {
		let t = wn.get(n);
		t || wn.set(n, t = []), t.push(e);
	}
}
function Dn(e, t, n = _) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ ln(e) || i === !1 || i === 0 ? On(e, 1) : On(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ mn(e) ? (d = () => e.value, m = /* @__PURE__ */ ln(e)) : /* @__PURE__ */ sn(e) ? (d = () => l(e), m = !0) : T(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ sn(e) || /* @__PURE__ */ ln(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ mn(e)) return e.value;
		if (/* @__PURE__ */ sn(e)) return l(e);
		if (E(e)) return c ? c(e, 2) : e();
	})) : d = E(e) ? t ? c ? () => c(e, 2) : e : () => {
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
	} : y, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => On(e(), t);
	}
	let g = Ke(), v = () => {
		u.stop(), g && g.active && ee(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				v();
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
	}, t ? r ? x(!0) : b = u.run() : o ? o(x.bind(null, !0), !0) : u.run(), v.pause = u.pause.bind(u), v.resume = u.resume.bind(u), v.stop = v, v;
}
function On(e, t = Infinity, n) {
	if (t <= 0 || !O(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ mn(e)) On(e.value, t, n);
	else if (T(e)) for (let r = 0; r < e.length; r++) On(e[r], t, n);
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
	if (E(e)) {
		let i = kn(e, t, n, r);
		return i && se(i) && i.catch((e) => {
			jn(e, t, n);
		}), i;
	}
	if (T(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(An(e[a], t, n, r));
		return i;
	}
}
function jn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || _;
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
	if (!T(e)) In && e.id === -1 ? In.splice(Ln + 1, 0, e) : e.flags & 1 || (Fn.push(e), e.flags |= 1);
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
function F(e, t = Zn, n) {
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
function I(e, t) {
	if (Zn === null) return e;
	let n = Pa(Zn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = _] = t[e];
		i && (E(i) && (i = {
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
		if (arguments.length > 1) return n && E(t) ? t.call(r && r.proxy) : t;
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
function sr(e, t, n = _) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = C({}, n), c = t && r || !t && a !== "post", l;
	if (Da) {
		if (a === "sync") {
			let e = rr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = y, e.resume = y, e.pause = y, e;
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
			let i = t.default && Cr(t.default(), !0), a = i && i.length ? gr(i) : n.subTree ? G() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ M(e), { mode: s } = o;
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
				s || (s = !0, S(e ? o : i, [t]), ee.delayedLeave && ee.delayedLeave(), t[dr] = void 0);
			};
			let c = t[dr].bind(null, !1);
			r ? C(r, [t, c]) : c();
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
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = yr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return ee;
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
		if (t & 32 && E(n.default)) return n.default();
	}
}
function Sr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Sr(lr(n.type) && xr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === z && T(e.children)) {
		let n = di(e.children, !1);
		n && Sr(n, t);
	}
}
function Cr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === z ? (o.patchFlag & 128 && i++, r = r.concat(Cr(o.children, t, s))) : (t || o.type !== Yi) && r.push(s == null ? o : la(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function wr(e) {
	if (e.component) return wr(e.component.subTree);
	if (e.type === z) {
		let t = T(e.children) && di(e.children, !1);
		return t ? wr(t) : void 0;
	}
	if (e.type !== Yi) return e;
}
// @__NO_SIDE_EFFECTS__
function L(e, t) {
	return E(e) ? /* @__PURE__ */ C({ name: e.name }, t, { setup: e }) : e;
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
	if (T(e)) {
		e.forEach((e, a) => Or(e, t && (T(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Ar(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Or(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Pa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === _ ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ M(d), p = d === _ ? b : (e) => !Er(u, e) && w(f, e), m = (e, t) => !(t && Er(u, t));
	if (l != null && l !== c) {
		if (kr(t), D(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ mn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (E(c)) kn(c, s, 12, [o, u]);
	else {
		let t = D(c), r = /* @__PURE__ */ mn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) T(n) && ee(n, a);
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
	return T(e) ? e.some((e) => Nr(e, t)) : D(e) ? e.split(",").includes(t) : ae(e) ? (e.lastIndex = 0, e.test(t)) : !1;
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
	return D(e) ? Wr(Vr, e, !1) || e : e || Hr;
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
function R(e, t, n, r) {
	let i, a = n && n[r], o = T(e);
	if (o || D(e)) {
		let n = o && /* @__PURE__ */ sn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ ln(e), s = /* @__PURE__ */ cn(e), e = Ct(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? pn(fn(e[n])) : fn(e[n]) : e[n], n, void 0, a && a[n]);
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
function Kr(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (T(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function qr(e, t, n, r, i, a) {
	if (n ??= {}, Zn.ce || Zn.parent && Ar(Zn.parent) && Zn.parent.ce) {
		let e = a != null && n.key == null ? C({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), B(), H(z, null, [W("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Zi.length;
	B();
	let c;
	try {
		let i = o && Jr(o(n)), s = n.key || a || i && i.key;
		c = H(z, { key: (s && !oe(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Zi.length; e > s; e--) $i();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Jr(e) {
	return e.some((e) => !ra(e) || !(e.type === Yi || e.type === z && !Jr(e.children))) ? e : null;
}
var Yr = (e) => e ? Ea(e) ? Pa(e) : Yr(e.parent) : null, Xr = /* @__PURE__ */ C(/* @__PURE__ */ Object.create(null), {
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
	$watch: (e) => y
}), Zr = (e, t) => e !== _ && !e.__isScriptSetup && w(e, t), Qr = {
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
			else if (w(a, t)) return o[t] = 3, a[t];
			else if (n !== _ && w(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Xr[t], u, d;
		if (l) return t === "$attrs" && bt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== _ && w(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, w(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Zr(i, t) ? (i[t] = n, !0) : w(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Zr(t, s) || w(a, s) || w(r, s) || w(Xr, s) || w(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? w(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function $r(e) {
	return T(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ei(e, t) {
	return !e || !t ? e || t : T(e) && T(t) ? e.concat(t) : C({}, $r(e), $r(t));
}
function ti() {
	return {
		app: null,
		config: {
			isNativeTag: b,
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
		E(n) || (n = C({}, n)), r != null && !O(r) && (r = null);
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
function ai(e, t, n = _) {
	let r = xa(), i = ge(t), a = ve(t), o = oi(e, i), s = bn((o, s) => {
		let c, l = _, u;
		return ar(() => {
			let t = e[i];
			xe(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!xe(o, c) && !(l !== _ && xe(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), xe(e, l) && (xe(e, o) && !xe(o, u) || f && l !== _ && !xe(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || _ : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var oi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ge(t)}Modifiers`] || e[`${ve(t)}Modifiers`];
function si(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || _, i = n, a = t.startsWith("update:"), o = a && oi(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => D(e) ? e.trim() : e)), o.number && (i = i.map(we)));
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
	return a ? (T(a) ? a.forEach((e) => o[e] = null) : C(o, a), O(e) && r.set(e, o), o) : (O(e) && r.set(e, null), null);
}
function li(e, t) {
	return !e || !x(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), w(e, t[0].toLowerCase() + t.slice(1)) || w(e, ve(t)) || w(e, t));
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
		Zi.length = 0, jn(t, e, 1), _ = W(Yi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(S) && (v = pi(v, a)), y = la(y, v, !1, !0));
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
	for (let n in e) (n === "class" || n === "style" || x(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, pi = (e, t) => {
	let n = {};
	for (let r in e) (!S(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
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
		if (!w(e, a) || gi(t, e, a) && !li(n, a)) return !0;
	}
	return !1;
}
function gi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && O(r) && O(i) ? !ze(r, i) : r !== i;
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
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (li(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (w(a, o)) u !== a[o] && (a[o] = u, l = !0);
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
		for (let a in s) (!t || !w(t, a) && ((r = ve(a)) === a || !w(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = wi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !w(t, e)) && (delete a[e], l = !0);
	}
	l && xt(e.attrs, "set", "");
}
function Ci(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (pe(c)) continue;
		let l = t[c], u;
		i && w(i, u = ge(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : li(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ M(n), r = s || _;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = wi(i, t, s, r[s], e, !w(r, s));
		}
	}
	return o;
}
function wi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = w(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && E(e)) {
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
	if (!a) return O(e) && r.set(e, v), v;
	if (T(a)) for (let e = 0; e < a.length; e++) {
		let t = ge(a[e]);
		Ei(t) && (o[t] = _);
	}
	else if (a) for (let e in a) {
		let t = ge(e);
		if (Ei(t)) {
			let n = a[e], r = o[t] = T(n) || E(n) ? { type: n } : C({}, n), i = r.type, c = !1, l = !0;
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
function Ei(e) {
	return e[0] !== "$" && !pe(e);
}
var Di = (e) => e === "_" || e === "_ctx" || e === "$stable", Oi = (e) => T(e) ? e.map(da) : [da(e)], ki = (e, t, n) => {
	if (t._n) return t;
	let r = F((...e) => Oi(t(...e)), n);
	return r._c = !1, r;
}, Ai = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Di(n)) continue;
		let i = e[n];
		if (E(i)) t[n] = ki(n, i, r);
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
	let { vnode: r, slots: i } = e, a = !0, o = _;
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
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = y, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ia(e, t) && (r = ve(e), fe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === v && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ji:
				g(e, t, n, r);
				break;
			case Yi:
				b(e, t, n, r);
				break;
			case Xi:
				e ?? x(t, n, r, o);
				break;
			case z:
				ae(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? ee(e, t, n, r, i, a, o, s, c) : d & 6 ? E(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, be);
		}
		u != null && i ? Or(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Or(e.ref, null, a, e, !0);
	}, g = (e, t, n, i) => {
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) te(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ne(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, te = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && T(e.children, f, null, i, s, Ri(e, c), l, d), _ && er(e, null, i, "created"), w(f, e, e.scopeId, l, i), m) {
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
	}, T = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? fa(e[l]) : da(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, ne = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || _, m = t.props || _, h;
		if (n && zi(n, !1), (h = m.onVnodeBeforeUpdate) && ha(h, n, t, e), f && er(t, e, n, "beforeUpdate"), n && zi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? re(e.dynamicChildren, d, c, n, r, Ri(t, i), o) : s || ce(e, t, c, null, n, r, Ri(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Fi(() => {
			h && ha(h, n, t, e), f && er(t, e, n, "updated");
		}, r);
	}, re = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Gi(c), f = u && (c.type === z || !ia(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ie = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== _) for (let o in t) !pe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (pe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ae = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), T(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (re(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Vi(e, t, !0)) : ce(e, t, n, f, a, o, c, l, u);
	}, E = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : D(t, n, r, i, a, o, c) : oe(e, t, c);
	}, D = (e, t, n, r, i, a, o) => {
		let s = e.component = ya(e, r, i);
		if (jr(e) && (s.ctx.renderer = be), Oa(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, O, o, a), !e.el) {
				let r = s.subTree = W(Yi);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else O(s, e, t, n, i, a, o);
	}, oe = (e, t, n) => {
		let r = t.component = e.component;
		if (mi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, se(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, O = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Ui(e);
					if (n) {
						t && (t.el = c.el, se(e, t, o)), n.asyncDep.then(() => {
							Fi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				zi(e, !1), t ? (t.el = c.el, se(e, t, o)) : t = c, n && Se(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ha(f, s, t, c), zi(e, !0);
				let p = ui(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ve(m), e, i, a), t.el = p.el, u === null && _i(e, p.el), r && Fi(r, i), (f = t.props && t.props.onVnodeUpdated) && Fi(() => ha(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Ar(t);
				if (zi(e, !1), l && Se(l), !m && (o = c && c.onVnodeBeforeMount) && ha(o, d, t), zi(e, !0), s && Ce) {
					let t = () => {
						e.subTree = ui(e), Ce(s, e.subTree, e, i, null);
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
	}, se = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Si(e, t.props, r, n), Pi(e, t.children, n), lt(), Gn(e), ut();
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
		m & 8 ? (d & 16 && _e(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ue(l, f, n, r, i, a, o, s, c) : _e(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && T(f, n, r, i, a, o, s, c));
	}, le = (e, t, n, r, i, a, o, s, c) => {
		e ||= v, t ||= v;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? fa(t[f]) : da(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? _e(e, i, a, !0, !1, d) : T(t, n, r, i, a, o, s, c, d);
	}, ue = (e, t, n, r, i, a, o, s, c) => {
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
		} else if (l > f) for (; l <= d;) fe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? fa(t[l]) : da(t[l]);
				e.key != null && g.set(e.key, l);
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
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (C[_ - m] === 0 && ia(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? fe(r, i, a, !0) : (C[u - m] = l + 1, u >= S ? S = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), y++);
			}
			let ee = x ? Hi(C) : v;
			for (_ = ee.length - 1, l = b - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Gi(f) : r;
				C[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== ee[_] ? de(d, n, p, 2) : _--);
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
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (lt(), Or(s, null, n, e, !0), ut()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Ar(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ha(_, t, e), u & 6) ge(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && er(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, be, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? _e(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && _e(c, t, n), r && me(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Fi(() => {
			_ && ha(_, t, e), h && er(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, me = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === z;
		if (o && !a) {
			he(n, r);
			return;
		}
		if (t === Xi) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? wr(e) : e, c = () => {
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
		Wi(c), Wi(l), r && Se(r), i.stop(), a ? (a.flags |= 8, fe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, fe(o, e, t, n)), s && Fi(s, t), Fi(() => {
			e.isUnmounted = !0;
		}, t);
	}, _e = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, ve = (e) => {
		if (e.shapeFlag & 6) return ve(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[cr];
		return n ? f(n) : t;
	}, ye = (e, t, n) => {
		Jn(() => {
			e == null ? t._vnode && fe(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : va());
	}, be = {
		p: h,
		um: fe,
		m: de,
		r: me,
		mt: D,
		mc: T,
		pc: ce,
		pbc: re,
		n: ve,
		o: e
	}, xe, Ce;
	return t && ([xe, Ce] = t(be)), {
		render: ye,
		hydrate: xe,
		createApp: ri(ye, xe)
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
	if (T(r) && T(i)) for (let e = 0; e < r.length; e++) {
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
	t && t.pendingBranch ? T(e) ? t.effects.push(...e) : t.effects.push(e) : Wn(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Ji = /* @__PURE__ */ Symbol.for("v-txt"), Yi = /* @__PURE__ */ Symbol.for("v-cmt"), Xi = /* @__PURE__ */ Symbol.for("v-stc"), Zi = [], Qi = null;
function B(e = !1) {
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
	return e.dynamicChildren = ea > 0 ? Qi || v : null, $i(), ea > 0 && Qi && Qi.push(e), e;
}
function V(e, t, n, r, i, a) {
	return na(U(e, t, n, r, i, a, !0));
}
function H(e, t, n, r, i) {
	return na(W(e, t, n, r, i, !0));
}
function ra(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ia(e, t) {
	return e.type === t.type && e.key === t.key;
}
var aa = ({ key: e }) => e ?? null, oa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : D(e) || /* @__PURE__ */ mn(e) || E(e) ? {
	i: Zn,
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
	return s ? (pa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= D(n) ? 8 : 16), ea > 0 && !o && Qi && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && Qi.push(c), c;
}
var W = sa;
function sa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Hr) && (e = Yi), ra(e)) {
		let r = la(e, t, !0);
		return n && pa(r, n), ea > 0 && !a && Qi && (r.shapeFlag & 6 ? Qi[Qi.indexOf(e)] = r : Qi.push(r)), r.patchFlag = -2, r;
	}
	if (Ia(e) && (e = e.__vccOpts), t) {
		t = ca(t);
		let { class: e, style: n } = t;
		e && !D(e) && (t.class = k(e)), O(n) && (/* @__PURE__ */ un(n) && !T(n) && (n = C({}, n)), t.style = Oe(n));
	}
	let o = D(e) ? 1 : Ki(e) ? 128 : lr(e) ? 64 : O(e) ? 4 : E(e) ? 2 : 0;
	return U(e, t, n, r, i, o, a, !0);
}
function ca(e) {
	return e ? /* @__PURE__ */ un(e) || bi(e) ? C({}, e) : e : null;
}
function la(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ma(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && aa(l),
		ref: t && t.ref ? n && a ? T(a) ? a.concat(oa(t)) : [a, oa(t)] : oa(t) : a,
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
	return W(Ji, null, e, t);
}
function G(e = "", t = !1) {
	return t ? (B(), H(Yi, null, e)) : W(Yi, null, e);
}
function da(e) {
	return e == null || typeof e == "boolean" ? W(Yi) : T(e) ? W(z, null, e.slice()) : ra(e) ? fa(e) : W(Ji, null, String(e));
}
function fa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : la(e);
}
function pa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (T(t)) n = 16;
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
	} else if (E(t)) {
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
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = Oe([t.style, r.style]);
		else if (x(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(T(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !S(e) && (t[e] = i);
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
		propsDefaults: _,
		inheritAttrs: r.inheritAttrs,
		ctx: _,
		data: _,
		props: _,
		attrs: _,
		slots: _,
		refs: _,
		setupState: _,
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
	E(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : O(t) && (e.setupState = vn(t)), ja(e, n);
}
function ja(e, t, n) {
	let r = e.type;
	e.render ||= r.render || y;
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
	return E(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ia(e) {
	return E(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ Sn(e, t, Da);
function La(e, t, n) {
	try {
		ta(-1);
		let r = arguments.length;
		return r === 2 ? O(t) && !T(t) ? ra(t) ? W(e, null, [t]) : W(e, t) : W(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ra(n) && (n = [n]), W(e, t, n));
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
}, Za = /* @__PURE__ */ C({}, mr, Xa), Qa = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Za, e))((e, { slots: t }) => La(_r, to(e), t)), $a = (e, t = []) => {
	T(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, eo = (e) => e ? T(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function to(e) {
	let t = {};
	for (let n in e) n in Xa || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = no(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: te = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, ao(e, t ? u : s), ao(e, t ? l : o), n && n();
	}, T = (e, t) => {
		e._isLeaving = !1, ao(e, d), ao(e, p), ao(e, f), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? ee : v, o = () => w(t, e, n);
		$a(i, [t, o]), oo(() => {
			ao(t, e ? c : a), io(t, e ? u : s), eo(i) || co(t, r, h, o);
		});
	};
	return C(t, {
		onBeforeEnter(e) {
			$a(_, [e]), io(e, a), io(e, o);
		},
		onBeforeAppear(e) {
			$a(S, [e]), io(e, c), io(e, l);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => T(e, t);
			io(e, d), e._enterCancelled ? (io(e, f), po(e)) : (po(e), io(e, f)), oo(() => {
				e._isLeaving && (ao(e, d), io(e, p), eo(b) || co(e, r, g, n));
			}), $a(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), $a(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), $a(te, [e]);
		},
		onLeaveCancelled(e) {
			T(e), $a(x, [e]);
		}
	});
}
function no(e) {
	if (e == null) return null;
	if (O(e)) return [ro(e.enter), ro(e.leave)];
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
	let r = e.style, i = D(n), a = !1;
	if (n && !i) {
		if (t) {
			if (D(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? xo(r, t, "");
			}
			else for (let e in t) n[e] ?? xo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? xo(r, i, "") : To(e, i, !D(t) && t ? t[i] : void 0, o) || xo(r, i, o);
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
	if (T(n)) n.forEach((n) => xo(e, t, n));
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
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && D(r) && n === r;
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
		if (T(r)) {
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
	t === "class" ? mo(e, r, o) : t === "style" ? yo(e, n, r) : x(t) ? S(t) || Mo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Ho(e, t, r, o)) ? (Oo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Do(e, t, r, o, a, t !== "value")) : e._isVueCE && (Uo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !D(r))) ? Oo(e, ge(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Do(e, t, r, o));
};
function Ho(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Bo(t) && E(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Bo(t) && D(n) ? !1 : t in e;
}
function Uo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ge(t);
	return Array.isArray(n) ? n.some((e) => ge(e) === r) : Object.keys(n).some((e) => ge(e) === r);
}
var Wo = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return T(t) ? (e) => Se(t, e) : t;
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
			if (T(t)) {
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
	if (T(t)) i = Be(t, r.props.value) > -1;
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
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? we(ns(e)) : ns(e)), r = e.multiple, i = r ? re(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? T(i) ? t.slice() : t : i];
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
	if (!n || T(e)) return ze(e, t);
	if (re(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ts(e, t) {
	let n = e.multiple, r = T(t);
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
}, ls = /* @__PURE__ */ C({ patchProp: Vo }, Ka), us;
function ds() {
	return us ||= Ii(ls);
}
var fs = ((...e) => {
	let t = ds().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ms(e);
		if (!r) return;
		let i = t._component;
		!E(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ps(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ps(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ms(e) {
	return D(e) ? document.querySelector(e) : e;
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
function q() {
	if (gs) return gs;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = hs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return gs = /* @__PURE__ */ nn(n), gs;
}
var J = () => e().saveSettingsDebounced(), _s = [
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
	structurePrefix: "z_",
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
}, Oc = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function kc(e, ...t) {
	let n = Sc(e);
	for (let e of t) n = Ac(n, e);
	return n;
}
function Ac(e, t) {
	if (t === void 0) return e;
	if (!Ec(e) || !Ec(t)) return Sc(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = Ac(e[r], i);
	return n;
}
function jc(e, t) {
	if (Ec(e) && Ec(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = jc(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : Sc(e);
}
function Mc(e, t, n = "", r = [], i = Nc) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? Ec(e[a]) && Ec(t[a]) && (Mc(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var Nc = /* @__PURE__ */ new Set(["sampling"]);
function Pc(e, t, n) {
	let r = Sc(e);
	for (let e of t) if (Tc(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && Ec(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Fc(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Ic(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Lc(e, t, n) {
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
function Rc(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Ic(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Lc(r[t.var], t, e));
	}
	return r;
}
var zc = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Bc(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !zc.test(e);
}
function Vc(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Bc(e) ? e : JSON.stringify(e);
}
var Hc = (e) => !e.includes("\n") && Bc(e) ? e : JSON.stringify(e);
function Uc(e) {
	return e.map((e) => `- ${Vc(e, "  ")}`).join("\n");
}
function Wc(e) {
	return [...e].map(([e, t]) => `${Hc(e)}: ${Vc(t, "  ")}`).join("\n");
}
function Gc(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Uc(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Wc(e) : t === "keys" ? Uc([...e.keys()]) : t === "values" ? Uc([...e.values()]) : e.get(t) ?? "";
}
//#endregion
//#region packages/protocol/src/assemble.ts
function Kc(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function qc(e, t) {
	return !!e.groups[t]?.allowNone;
}
function Jc(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || qc(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => ks(e.when, n)) : i;
}
function Yc(e, t) {
	let n = new Set(Jc(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Xc(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Zc(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Qc(e, t, n, r) {
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
			return Gc(typeof n == "string" ? u(n) : Array.isArray(n) ? n.map(u) : new Map([...n].map(([e, t]) => [e, u(t)])), t);
		} finally {
			l--;
		}
	}, f = o.style, p = (e) => {
		let [r, o, l] = e;
		switch (r) {
			case "name": return Zc(i, a, o);
			case "prefix": return a.identity.prefixes[o] || i.actors[o]?.prefix || `${Zc(i, a, o)}: `;
			case "param": return c(o);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[o];
				return e ? l === "last" ? s.customLast?.[o] ?? "" : f === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return o === "hint" ? n?.hint ?? "" : lc(t, (e) => Zc(i, a, e));
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
function $c(e, t) {
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
function el(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? nc(n, t, e.tools) : tc(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Zc(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function tl(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = Kc(i), s = a ? Zs(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = Kc(i), l = Jc(n, r, c), u = Xc(n, l), d = Rc(n.vars, l), f = Qc({
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
		for (let t of xc(el(n, a, s, i.style, i.transport, r), c, f)) {
			let n = e[e.length - 1];
			!t.role && n && !n.role && n.workflow ? n.text += `\n\n${t.text}` : e.push({
				...t,
				workflow: !0
			});
		}
		m.set(n.workflowRegion, e);
	}
	let h = {};
	for (let e of n.regions) e.native || (h[e.id] = $c(e, m.get(e.id) ?? []));
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
function nl(e, t, n = {}) {
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
		modules: Yc(e, t),
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
var rl = /* @__PURE__ */ new Set([
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
]), il = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), al = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, ol = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function sl(e, t = {}) {
	let n = (e) => sl(e, t);
	if (!ol(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && ol(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => il.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(ol), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return cl({
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
		return cl({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && rl.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			ol(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && al[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = ol(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return cl({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), cl(i, a);
}
function cl(e, t) {
	return t && (e.nullable = !0), e;
}
function ll(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!ol(n)) return e;
		let r = ol(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: sl(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var ul = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function dl(e) {
	let t = e.configurationDefaults?.connection;
	return !ul(t) || Object.keys(Dc).every((e) => e in t) ? e : {
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
function fl(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!ul(t) || "userInput" in t) && (!ul(n) || "userInput" in n)) return e;
	let r = ul(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: ul(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: ul(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function pl(e) {
	let t = e.configurationDefaults;
	if (!ul(t)) return e;
	let n = t.cache;
	return ul(n) && Object.keys(Oc).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...Oc,
				...ul(n) ? n : {}
			}
		}
	};
}
function ml(e) {
	let t = pl(fl(dl(e)));
	return Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
}
function hl(e) {
	return !ul(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? ml(e) : null;
}
//#endregion
//#region packages/protocol/src/directives.ts
var gl = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, _l = /^\s*(```|~~~)/;
function vl(e) {
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
function yl(e, t = [], n = 1) {
	let r = [{
		tokens: [],
		line: n
	}], i = (e) => {
		let t = r[r.length - 1].tokens, n = t[t.length - 1];
		e.kind === "text" && n?.kind === "text" ? n.text += e.text : t.push(e);
	}, a = e.replace(/\r\n?/g, "\n").split("\n"), o = !1;
	return a.forEach((e, s) => {
		let c = s < a.length - 1 ? "\n" : "", l = n + s;
		if (_l.test(e) && (o = !o), o || !e.includes("<!--")) return i({
			kind: "text",
			text: e + c
		});
		let u = [...e.matchAll(gl)];
		if (!u.length) return i({
			kind: "text",
			text: e + c
		});
		let d = e.replace(gl, "").trim() === "", f = 0;
		for (let n of u) {
			n.index > f && i({
				kind: "text",
				text: e.slice(f, n.index)
			});
			let a = n[2].trim(), o = {
				name: n[1],
				...vl(a),
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
var bl = [
	"system",
	"user",
	"assistant"
], xl = ["dialogue", "imperative"];
function Sl(e, t, n) {
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
				bl.includes(n) || t(`@as expects one of ${bl.join(" | ")}`, e.line), i.length && t("@as cannot be used inside @if / @style", e.line), r.push({
					role: bl.includes(n) ? n : void 0,
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
				if (!n || !xl.includes(n)) {
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
function Cl(e, t) {
	let n = [], [r] = yl(e), i = Sl(r.tokens, (e, t) => n.push({
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
var wl = "user-", Tl = "advanced-preset.user-modules", El = (e) => `${wl}${e}`;
function Dl() {
	return {
		match: "all",
		rules: []
	};
}
var Ol = ["on", "off"];
function kl(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? Ol.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function Al(e) {
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
function jl(e, t) {
	let n = Al(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var Ml = (e) => ({
	t: "lit",
	v: e
});
function Nl(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(Ml)
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
			r: Ml(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function Pl(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(kl).map((e) => {
		if (e.kind === "keyword") return Ml(jl(e, t));
		if (e.kind === "var") return Nl(e);
		try {
			return Es(e.source);
		} catch {
			return Ml(!1);
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
function Fl(e) {
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
function Il(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function Ll(e, t) {
	return t.entries.filter((t) => !Il(e, t.point));
}
function Rl(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function zl(e, t) {
	return (t.vars ?? []).filter((t) => Rl(e, t.var)?.type !== t.type);
}
function Bl(e, t) {
	return [.../* @__PURE__ */ new Set([...Ll(e, t).map((e) => e.point), ...zl(e, t).map((e) => e.var)])];
}
function Vl(e) {
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
function Hl(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Ul(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = El(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: Pl(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => Rl(e, t.var)?.type === t.type).map(Vl).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = Il(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Hl(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: Cl(n.text, n.role).content
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
function Wl(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Gl(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Kl(e, t, n) {
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
				path: Wl(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Gl(t.source, e)
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
var ql = (e) => !!e && typeof e == "object" && !Array.isArray(e), Jl = (e, t = "") => typeof e == "string" ? e : t, Yl = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), Xl = [
	"system",
	"user",
	"assistant"
], Zl = [
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
function Ql(e) {
	if (!ql(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Jl(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Zl.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Yl) : Yl(e.value) && (t.value = e.value), t;
	}
	return null;
}
function $l(e) {
	if (!ql(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Jl(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(ql).map((e) => ({
			key: Jl(e.key),
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
function eu(e) {
	if (!ql(e) || !Array.isArray(e.entries)) return null;
	let t = ql(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!ql(e)) return [];
		let n = {
			id: Jl(e.id) || `e${t + 1}`,
			point: Jl(e.point),
			text: Jl(e.text)
		};
		return Xl.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: Jl(e.id),
		name: Jl(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap($l) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Ql).filter((e) => !!e) : []
		}
	};
}
function tu(e, t) {
	return {
		format: Tl,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function nu(e) {
	if (ql(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(eu).filter((e) => !!e);
		return {
			preset: ql(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Jl(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = eu(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var ru = "{==", iu = "==}", au = "{>>", ou = "<<}", su = /\n[ \t]*\n/g;
function cu(e, t) {
	su.lastIndex = t;
	let n = su.exec(e);
	return n ? n.index : Infinity;
}
function lu(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function uu(e, t, n, r) {
	let i = cu(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function du(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(ru, o)) {
		let t = o + 3, s = uu(e, t, iu, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - lu(n, [iu]));
			break;
		}
		if (s < 0) {
			let n = Math.min(cu(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || au.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(au, l)) {
			let t = l + 3, s = uu(e, t, ou, n);
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
	} else if (e.startsWith(au, o)) {
		let t = o + 3, i = uu(e, t, ou, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += au, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (ru.startsWith(t) || au.startsWith(t))) break scan;
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
function fu(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function pu(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function mu(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = fu(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + pu(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function hu(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = mu(e, t);
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
function gu(e, t) {
	let n = hu(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${ru}${t.quote}${iu}${au}${t.comment}${ou}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region src/store/presets.ts
var _u = /* @__PURE__ */ nn(/* @__PURE__ */ new Map()), vu = /* @__PURE__ */ nn(/* @__PURE__ */ new Map());
async function yu() {
	try {
		let e = `${s()}dist/presets/`, t = await (await m(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = hl(await (await m(e + n, { cache: "no-cache" })).json());
			t && _u.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var bu = (e) => hl(e);
function xu() {
	return [.../* @__PURE__ */ new Set([
		..._u.keys(),
		...Object.keys(q().installed),
		...vu.keys()
	])].map((e) => Su(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function Su(e) {
	let t = vu.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = wu(e), r = _u.get(e);
	if (n && (!r || wc(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Cu = /* @__PURE__ */ new WeakMap();
function wu(e) {
	let t = q().installed[e];
	if (t) return Cu.has(t) || Cu.set(t, hl(t)), Cu.get(t) ?? void 0;
}
var Tu = (e) => Su(e)?.preset;
function Eu(e) {
	q().installed[e.id] = e, J();
}
function Du(e) {
	delete q().installed[e], J();
}
function Ou(e, t) {
	e ? vu.set(e.id, e) : t ? vu.delete(t) : vu.clear();
}
var ku = (e) => _u.has(e), Au = {
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
	"writing.cache": "Cache optimization",
	"writing.cache.hint": "Sticky rendering: while the prompt cache may still hit, every history message keeps the rendering of the previous request (full text / synopsis, user message handling, attached synopsis, annotations); only new messages follow the rules. Everything is applied at once when the cache TTL has passed, the model or source changes, tools or schema change, the prompt before the history changes (e.g. world info activation), or too many requests were postponed.",
	"writing.cacheTtl": "Cache TTL (minutes)",
	"writing.cacheTtl.hint": "Counted from the last successful request; after that the cache is assumed gone. Match your provider (Claude: 5 by default, 60 with the 1-hour cache); 0 = no limit.",
	"writing.cacheMaxDeferred": "Max cache-protected turns",
	"writing.cacheMaxDeferred.hint": "How many requests a rendering change may be postponed before everything is applied at once. Higher means more cache hits but more history rendered by older rules; 0 = never postpone.",
	"writing.meta": "Meta instructions",
	"writing.recentCount": "Recent meta kept",
	"writing.recentCount.hint": "How many earlier meta instructions stay visible to the model.",
	"memory.chat": "Chat memory",
	"memory.chat.hint": "Lives in this chat; rolls back with deletes, regenerations and swipes.",
	"memory.global": "Global memory",
	"memory.global.hint": "Shared by every chat using this preset. Entries written by a reply follow it: deleting, regenerating or swiping the reply away revokes them, selecting it again restores them.",
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
	"debug.cached": "{n} cached",
	"debug.cache.kept": "Cache: previous rendering kept",
	"debug.cache.flush.first": "Cache: first request",
	"debug.cache.flush.ttl": "Cache: expired, flushed",
	"debug.cache.flush.model": "Cache: model / source changed, flushed",
	"debug.cache.flush.tools": "Cache: tools / schema changed, flushed",
	"debug.cache.flush.prompt": "Cache: prompt before history changed, flushed",
	"debug.cache.flush.turns": "Cache: deferral limit reached, flushed",
	"debug.cache.stats": "{sticky} kept · {fresh} rendered by rules",
	"debug.cache.postponed": "{n} change(s) postponed (round {d}/{max})",
	"debug.cache.unmatched": "{n} not located",
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
}, ju = {
	en: Au,
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
		"writing.cache": "缓存优化",
		"writing.cache.hint": "粘性渲染：提示词缓存还可能命中时，每条历史消息保持上一次请求的渲染方式（原文 / 摘要、用户消息处理、附带摘要、批注），只有新消息按规则渲染。超过缓存有效期、更换模型或来源、工具或 Schema 变化、历史之前的提示词变化（如世界书激活），或推迟轮次超过上限时，一次性全部应用。",
		"writing.cacheTtl": "缓存有效期（分钟）",
		"writing.cacheTtl.hint": "从上次成功请求起算，超过后视为缓存已失效。与服务商的缓存时长一致（如 Claude 默认 5 分钟、开启 1 小时缓存后为 60）；0 为不限。",
		"writing.cacheMaxDeferred": "最大缓存保护轮次",
		"writing.cacheMaxDeferred.hint": "渲染变化最多推迟多少轮请求，超过后一次性全部应用。数值越大缓存命中越多，但历史中按旧规则渲染的消息也越多；0 为不推迟。",
		"writing.meta": "元指令",
		"writing.recentCount": "保留近期元指令",
		"writing.recentCount.hint": "模型可见的之前元指令条数。",
		"memory.chat": "聊天记忆",
		"memory.chat.hint": "属于当前聊天，随删除、重新生成与滑动回滚。",
		"memory.global": "全局记忆",
		"memory.global.hint": "使用该预设的所有聊天共享。回复写入的条目跟随该回复：删除、重新生成或滑走时撤销，切回该版本时恢复。",
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
		"debug.cached": "命中缓存 {n}",
		"debug.cache.kept": "缓存：沿用上次渲染",
		"debug.cache.flush.first": "缓存：首次请求",
		"debug.cache.flush.ttl": "缓存：已过期，全部刷新",
		"debug.cache.flush.model": "缓存：模型 / 来源变化，全部刷新",
		"debug.cache.flush.tools": "缓存：工具 / Schema 变化，全部刷新",
		"debug.cache.flush.prompt": "缓存：历史前提示词变化，全部刷新",
		"debug.cache.flush.turns": "缓存：推迟轮次达到上限，全部刷新",
		"debug.cache.stats": "{sticky} 条沿用 · {fresh} 条按规则渲染",
		"debug.cache.postponed": "{n} 条变更推迟（第 {d}/{max} 轮）",
		"debug.cache.unmatched": "{n} 条无法定位",
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
function Mu() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((ju[Mu()] ?? ju[Mu().split("-")[0]])?.[e] ?? Au[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Nu(e) {
	return e.locales?.[Mu()] ?? e.locales?.[Mu().split("-")[0]];
}
function Pu(e, t, n, r, i) {
	let a = Nu(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Fu(e) {
	let t = Nu(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Iu(e) {
	let t = Nu(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
//#endregion
//#region src/store/sidecar.ts
var Lu = "advanced_preset";
function Ru(e) {
	let t = e?.extra?.[Lu];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function zu(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: Sc(n)
		}
	};
}
function Bu(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Lu] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Lu] = Sc(n));
}
function Vu(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra?.advanced_preset) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] ? !1 : (delete n.extra[Lu], !0);
}
//#endregion
//#region src/store/eventlog.ts
function Hu() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var Uu = (e) => `legacy-${e}`;
function Wu(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = Uu(n), t = !0);
	}), t;
}
function Gu(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? Uu(e.index) : void 0);
}
var Ku = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), qu = "advanced_preset";
function Ju() {
	return e().chatMetadata?.[qu]?.seedEvents ?? [];
}
function Yu(t = Infinity) {
	let n = Ju().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of Ru(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function Xu(e = Infinity) {
	let t = {};
	for (let { event: n } of Yu(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function Zu(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of Yu(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function Qu(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Ru(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[qu] && (e.extra[qu].events = Sc(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[qu] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function $u(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function ed(e, t, n, r, i, a = Hu()) {
	let o = e.globalMemory;
	Wu(o.log);
	let s = $u(e)[n] ?? null;
	return o.log.splice(o.cursor), o.log.push({
		id: a,
		op: t,
		key: n,
		content: r,
		prev: s,
		source: i,
		at: Date.now()
	}), o.cursor = o.log.length, J(), o.cursor - 1;
}
var td = (e) => e.globalMemory.cursor > 0, nd = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function rd(e) {
	td(e) && (e.globalMemory.cursor--, J());
}
function id(e) {
	nd(e) && (e.globalMemory.cursor++, J());
}
function ad(e, t) {
	let n = e.globalMemory.log[Ku(e, t)];
	n && (n.prev === null ? ed(e, "delete", n.key, void 0, "undo") : ed(e, "replace", n.key, n.prev, "undo"));
}
function od(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = Hu();
		n.push({
			id: e,
			op: r.operation,
			key: r.key,
			...r.operation === "replace" ? { content: r.content ?? "" } : {}
		}), t.push({
			type: "global.ref",
			id: e
		});
	} else r.operation === "replace" ? t.push({
		type: "memory.replace",
		key: r.key,
		content: r.content ?? "",
		source: "model"
	}) : t.push({
		type: "memory.delete",
		key: r.key,
		source: "model"
	});
	return {
		events: t,
		global: n
	};
}
function sd(e, t) {
	for (let n of t) Ku(e, n.id) < 0 && ed(e, n.op, n.key, n.content, "model", n.id);
}
function cd(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[Ku(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function ld(e) {
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
	}, J()), Wu(n.globalMemory.log) && J(), n;
}
function ud(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Fc(e, n.id)?.diff;
}
function dd(e, t = ld(e).active.ref) {
	return kc(e.configurationDefaults, ud(e, ld(e), t));
}
function fd(e) {
	let t = ld(e);
	return kc(dd(e, t.active.ref), t.active.diff);
}
function pd(e, t) {
	let n = ld(e);
	n.active.diff = jc(t, dd(e, n.active.ref)) ?? {}, J();
}
function md(e, t) {
	let n = fd(e);
	return t(n), pd(e, n), n;
}
function hd(e, t) {
	let n = ld(e);
	n.active = {
		ref: t,
		diff: {}
	}, J();
}
var gd = (e) => Object.keys(ld(e).active.diff ?? {}).length > 0;
function _d(e) {
	ld(e).active.diff = {}, J();
}
function vd(e, t) {
	let n = ld(e), r = fd(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: jc(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, J(), i;
}
function yd(e, t) {
	let n = ld(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = jc(fd(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), J());
}
function bd(e, t, n) {
	let r = ld(e).saved.find((e) => e.id === t);
	r && (r.name = n, J());
}
function xd(e, t) {
	let n = ld(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), J();
}
function Sd(e) {
	let t = ld(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = wc(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Pc(t, e.migrations, n) : Sc(t);
		i.push(...Mc(o, a));
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
	}), t.userModules?.length && r && (t.userModules = Kl(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && Bl(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, J(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && p("warning", Y("um.lostAfterUpdate", { names: s.join(", ") }), Fu(e)), i;
}
//#endregion
//#region src/store/carrier.ts
var Cd = "advanced_preset", wd = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, Td = (e) => wd[e] ?? e, Ed = () => e().getPresetManager("openai"), Dd = (e) => `AP · ${e.name}`;
function Od() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function kd(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function Ad(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...Sc(t.sampling),
		prompts: Sc(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: Sc(n)
		})),
		extensions: { [Cd]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function jd(e) {
	let t = Ed();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Md(e, t, n) {
	let r = Ed();
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
async function Nd(e, t = {}) {
	let n = Ed(), r = ld(e), i = jd(e.id), a = i ?? Dd(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Cd];
	if (!o || t.force || s?.hash !== e.hash) {
		o && r.carrierHash && kd(o) !== r.carrierHash && p("info", Y("carrier.reset", { name: a }));
		let n = Ad(e, fd(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = kd(n), J(), await Md(a, n, !!t.select);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function Pd(e) {
	await Nd(e, { select: !0 });
}
async function Fd(e) {
	let t = jd(e.id);
	if (!t) return;
	let n = Ed(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = fd(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...Sc(i)
	}, o = n.getSelectedPresetName() === t;
	Id = !0;
	try {
		await Md(t, a, o);
	} finally {
		Id = !1;
	}
}
var Id = !1;
function Ld(t) {
	if (Id || Od() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = fd(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[Td(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = Sc(r));
	}
	return Object.keys(i).length ? (md(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var Rd = null, zd = (e) => {
	Rd = e;
}, Bd = () => {
	let e = Rd;
	return Rd = null, e;
};
function Vd(t, n) {
	let r = Ms(t.meta.trigger, (e) => e[0] === "name" ? Zc(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Hd(e, t, n, r, i, a = [], o = !0) {
	let s = bc(n, Vd(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = Kc(c);
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
	].includes(r) && !s.pure ? "story" : "task", f = o ? Bd() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Ud(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Wd = 0, Gd = () => `ap-${Date.now().toString(36)}-${(++Wd).toString(36)}`, Kd = /* @__PURE__ */ new Map(), qd = null, Jd = null, Yd = {
	setPending(e) {
		qd = e;
	},
	takePending() {
		let e = qd;
		return qd = null, e;
	},
	peekPending: () => qd,
	arm(e) {
		Jd = e, Kd.set(e.id, e);
	},
	takeArmed() {
		let e = Jd;
		return Jd = null, e;
	},
	get: (e) => Kd.get(e),
	release(e) {
		Kd.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of Kd) t - r.createdAt > e && Kd.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Xd(e) {
	return (e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`) + (e.body === "full" && e.synopsis ? "y" : "") + (e.body === "full" && e.annotations ? "a" : "");
}
function Zd(e) {
	let t = e ? /^(?:(f)(y?)(a?)|(s)|(x)|t(\d+))$/.exec(e) : null;
	if (t) return t[1] ? {
		body: "full",
		...t[2] ? { synopsis: !0 } : {},
		...t[3] ? { annotations: !0 } : {}
	} : t[4] ? { body: "synopsis" } : t[5] ? { body: "drop" } : {
		body: "truncate",
		max: Number(t[6])
	};
}
var Qd = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, $d = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function ef(e, t, n = "") {
	return e.replace(/\{\{(time|location|event|summary|content)\}\}/g, (e, r) => r === "content" ? n : t[r] ?? "");
}
var tf = (e, t) => t ? Qd(e)?.structures?.[t] : void 0;
function nf(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Qd(e);
		if (a && $d.has(a.turn)) {
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
	}).filter((e) => e.item.mes.trim() !== "" || !e.item.is_user);
	let i = n.map((e) => ({
		...e,
		fresh: e.item.is_system ? null : { body: "full" }
	}));
	if (t.tokenSaving.enabled) {
		let e = 0, n = Array(i.length).fill(0);
		for (let t = i.length - 1; t >= 0; t--) !i[t].item.is_user && !i[t].item.is_system && e++, n[t] = e;
		let r = Math.max(0, t.tokenSaving.keepFullTurns), a = (e) => n[e] <= r, o = t.recap?.coversUpTo ?? -1;
		i.forEach((e, n) => {
			if (e.fresh && !a(n) && e.index !== t.currentInput) {
				if (o >= 0 && t.realIndex(e.index) <= o) e.fresh = { body: "drop" }, e.forced = !0;
				else if (e.item.is_user) {
					let n = t.tokenSaving.userInput ?? "truncate", r = t.tokenSaving.truncateUserAfter;
					n === "remove" ? e.fresh = { body: "drop" } : n === "truncate" && r > 0 && e.item.mes.length > r && (e.fresh = {
						body: "truncate",
						max: r
					});
				} else tf(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
			}
		});
	}
	let a = (e) => {
		let t = [];
		for (let n = i.length - 1; n >= 0 && t.length < e; n--) {
			let e = i[n];
			e.fresh && !e.item.is_user && e.fresh.body !== "drop" && t.push(e);
		}
		return t;
	};
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && Qd(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	let o = t.synopsisHistory;
	if (o && t.synopsisId) for (let e of a(o.depth)) e.fresh.body === "full" && tf(e.item, t.synopsisId) && (e.fresh.synopsis = !0);
	return i;
}
function rf(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : tf(r, n.synopsisId);
			return e ? ef(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? Qd(r)?.annotations : void 0;
			i?.length && (e = gu(e, i));
			let a = t.synopsis ? tf(r, n.synopsisId) : void 0;
			return a && (e = ef(n.synopsisHistory?.template ?? n.synopsisHistoryTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}", a, e)), e;
		}
	}
}
function af(e, t) {
	let n = [];
	for (let r of nf(e, t)) {
		let e = rf(r, r.fresh, t);
		e !== null && n.push(e === r.item.mes ? r.item : {
			...r.item,
			mes: e
		});
	}
	return n;
}
function of(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations");
	if (n?.history) return Jc(e, t).some((e) => e.structures.includes(n.id)) ? { depth: n.history } : void 0;
}
function sf(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "synopsis"), r = {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: n?.id,
		synopsisHistoryTemplate: n?.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	};
	return n?.history && Jc(e, t).some((e) => e.structures.includes(n.id)) && (r.synopsisHistory = {
		depth: n.history,
		template: n.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	}), r;
}
var cf = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function lf(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function uf(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = lf(e), r = lf(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function df(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = cf(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = cf(l.text);
			if (c === u || c.includes(u) || uf(c, u) >= n) {
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
var ff = 50;
function pf(e) {
	let t = ld(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var mf = () => Math.random().toString(36).slice(2, 8);
function hf(e) {
	let t = new Set(e), n = mf();
	for (; t.has(n);) n = mf();
	return n;
}
function gf(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: hf(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function _f(e, t) {
	let n = pf(e), r = {
		id: hf(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: Dl()
	};
	return e.insertionPoints.length && r.entries.push(gf(e, r)), n.push(r), J(), n[n.length - 1];
}
function vf(e, t, n) {
	let r = pf(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...Sc(r[i]),
		id: hf(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), J(), r[i + 1];
}
function yf(e, t) {
	let n = ld(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), J();
}
function bf(e, t, n) {
	let r = pf(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), J();
}
function xf(e, t) {
	return tu(Sc(pf(e).filter((e) => !t || t.includes(e.id))), e);
}
function Sf(e, t) {
	let n = nu(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && wc(n.preset.version, e.version) < 0 && (r = Kl(r, e.migrations, n.preset.version));
	let i = pf(e), a = r.map((e) => {
		let t = {
			...e,
			id: hf(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return J(), {
		added: a,
		missing: a.filter((t) => Bl(e, t).length).length
	};
}
function Cf(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < ff; t--) {
		let r = e[t];
		!r.is_system && r.mes && n.push(r.mes);
	}
	return {
		input: t >= 0 ? e[t]?.mes ?? "" : "",
		recent: n
	};
}
//#endregion
//#region src/store/cache-state.ts
var wf = "advanced-preset.cache.v1", Tf = 864e5, Ef = 30, Df = null;
function Of() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function kf() {
	if (Df) return Df;
	try {
		let e = Of()?.getItem(wf), t = e ? JSON.parse(e) : {};
		Df = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		Df = {};
	}
	return Df;
}
function Af(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Tf).sort((e, t) => t[1].at - e[1].at).slice(0, Ef);
	Df = Object.fromEntries(n);
	try {
		Of()?.setItem(wf, JSON.stringify(Df));
	} catch {}
}
function jf() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
function Mf(e) {
	return kf()[e];
}
function Nf(e, t) {
	Af({
		...kf(),
		[e]: t
	}, t.at);
}
function Pf(e, t) {
	let n = kf()[e];
	n && Nf(e, {
		...n,
		at: t
	});
}
//#endregion
//#region src/core/cache.ts
function Ff(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function If(e, t) {
	return e.send_date ? Ff(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var Lf = 57344, Rf = /⟦([\uE000-\uF8FF])⟧/g, zf = (e) => `⟦${String.fromCharCode(Lf + e)}⟧`;
function Bf(e) {
	let t = [];
	return {
		text: e.replace(Rf, (e, n) => (t.push(n.charCodeAt(0) - Lf), "")),
		marks: t
	};
}
function Vf(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of nf(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Zd(n?.[e]), l = c ?? s.fresh, u = rf(s, s.fresh, t), d = c ? rf(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Xd(l) : a.length >= 6400 ? u !== null && i.push({
			item: {
				...s.item,
				mes: u
			},
			index: s.index
		}) : (i.push({
			item: {
				...s.item,
				mes: f
			},
			index: s.index,
			entry: a.length
		}), a.push({
			key: e,
			given: f,
			sticky: d,
			fresh: u,
			stickyMode: Xd(l),
			freshMode: Xd(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function Hf(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function Uf(e, t, n, r, i, a = {}) {
	let o = Hf(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && Ff(i) === n[r]) r++;
				else {
					s = t;
					break;
				}
			}
		}
		c = s === e.length && r === n.length;
	}
	let l = ((t) => e.slice(0, t).filter((e) => e.key !== void 0 && e.sticky !== e.fresh).length)(s), u = t?.deferred ?? 0, d = l ? c ? Math.max(u, 1) : u + 1 : 0;
	!o && l && d > r.maxDeferredTurns && (o = "turns", s = 0, l = 0, d = 0), o && (d = 0);
	let f = [], p = { ...a };
	return e.forEach((e, t) => {
		let n = t < s, r = n ? e.sticky : e.fresh;
		r !== null && f.push(Ff(r));
		let i = n ? e.stickyMode : e.freshMode;
		e.key !== void 0 && i && (p[e.key] = i);
	}), {
		from: s,
		reason: o,
		deferred: d,
		postponed: l,
		next: {
			v: 1,
			...n,
			seq: f,
			modes: p,
			deferred: d
		}
	};
}
function Wf(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/core/interceptor.ts
async function Gf(t, n, r, i) {
	if (Yd.setPending(null), !q().enabled) return;
	let a = Od(), o = a ? Tu(a) : void 0;
	if (!o) return;
	let s = fd(o), c = i || "normal";
	c === "swipe" && Vu(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = u >= 0 ? t[u].mes : "", f = t.slice(-6).map((e) => e.mes), p = Cf(t, u), { meta: m, flags: h, origin: g } = Hd(o, s, d, c, !0, f), _ = e().chat, v = t.map((e) => _.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), y = {
		trigger: Vd(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...sf(o, s),
		recap: Zu(),
		realIndex: (e) => v[e] ?? -1,
		currentInput: u,
		annotations: of(o, s)
	}, b;
	if (s.cache?.enabled) {
		let e = jf(), n = Vf(t, y, Mf(e)?.modes, (e) => If(t[e], v[e] ?? e));
		t.splice(0, t.length, ...n.out.map(({ item: e, entry: t }) => t === void 0 ? e : {
			...e,
			mes: e.mes + zf(t)
		})), b = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else t.splice(0, t.length, ...af(t, y));
	let x = {
		id: Gd(),
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
		sticky: b,
		createdAt: Date.now(),
		warnings: []
	};
	Yd.setPending(x);
}
//#endregion
//#region src/core/debug.ts
var Kf = /* @__PURE__ */ nn({
	log: [],
	requests: []
}), qf = 50;
function Jf(e, t) {
	Kf.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Kf.log.length > qf && (Kf.log.length = qf);
}
function Yf(e) {
	return Kf.requests.unshift(e), Kf.requests.length > qf && (Kf.requests.length = qf), Kf.requests[0];
}
//#endregion
//#region src/core/transports/tool-args.ts
var Xf = "stream_function_call_arguments";
function Zf(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function Qf(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function $f(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Xf] = !0, t() && ep(e));
}
function ep(e) {
	let t = tp(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Qf(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function tp(e) {
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
function np(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of cc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function rp(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function ip(e) {
	return cc(e.preset.tools, e.workflow, e.stages, e.structures, rp(e));
}
function ap(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Zc(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function op(e, t, n) {
	let r = Xs(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return rp(e)(r);
}
function sp(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = rp(r), u = l(o.tool.description);
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
				content: op(r, o.response[t], { first: n })
			}
		]
	};
}
function cp(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && lp(n, e.ctx.preset.tools.jsonStringHint), Zf(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && $f(n), n;
}
function lp(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = ll(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: sl(e.json_schema.value, n)
	});
}
function up(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var dp = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", fp = (e) => e === null ? null : typeof e == "string" ? e : JSON.stringify(e), pp = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(Rf.source).test(e);
function mp(e) {
	for (let t of e) if (typeof t.content == "string") pp(t.content) && (t.content = Bf(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && pp(e.text) && (e.text = Bf(e.text).text);
}
function hp(e) {
	if (typeof e.content == "string") {
		if (!pp(e.content)) return null;
		let { text: t, marks: n } = Bf(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => Wf(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !pp(e.text)) return;
		let i = Bf(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = Wf(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function gp(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = ip(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return Ff(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function _p(e) {
	return Ff(e.map((e) => `${e.role}\u0000${dp(e.content)}`).join(""));
}
function vp(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return mp(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = hp(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = fp(i.content);
				l.push({
					sticky: t,
					fresh: t
				}), c.push({
					index: e,
					sticky: i.content,
					fresh: i.content
				});
			}
			continue;
		}
		u.add(a.mark);
		let f = a.swap(s.given, s.sticky), p = a.swap(s.given, s.fresh);
		if (f === void 0 || p === void 0) {
			d++;
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = fp(i.content);
			l.push({
				key: s.key,
				sticky: n,
				fresh: n,
				stickyMode: t,
				freshMode: t
			}), c.push({
				index: e,
				sticky: i.content,
				fresh: i.content
			});
		} else l.push({
			key: s.key,
			sticky: fp(f),
			fresh: fp(p),
			stickyMode: s.stickyMode,
			freshMode: s.freshMode
		}), c.push({
			index: e,
			sticky: f,
			fresh: p
		});
	}
	let f = {
		model: a(),
		tools: gp(e),
		prompt: _p(t.slice(0, n))
	}, p = Uf(l, Mf(o.chat), f, s, i, o.omitted), m = 0, h = 0;
	for (let e = c.length - 1; e >= 0; e--) {
		let n = c[e], r = e < p.from, i = r ? n.sticky : n.fresh;
		l[e].key !== void 0 && i !== null && (r ? m++ : h++), i === null ? t.splice(n.index, 1) : t[n.index].content = i;
	}
	let g = e.origin === "story" && !e.dryRun, _ = e.dryRun ? "nothing" : g ? "state" : p.reason === null ? "time" : "nothing";
	return _ !== "nothing" && (e.cacheCommit = {
		chat: o.chat,
		next: p.next,
		touch: _ === "time"
	}), {
		at: i,
		reason: p.reason,
		deferred: p.deferred,
		maxDeferredTurns: s.maxDeferredTurns,
		postponed: p.postponed,
		sticky: m,
		fresh: h,
		unmatched: d,
		stores: _
	};
}
function yp(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Pf(n.chat, t) : Nf(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/core/assembler.ts
var bp = /⟦ap:region:([\w.-]+)⟧/g, xp = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function Sp(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(bp)) {
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
function Cp(t, n) {
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Zc(t, n, t.user), s = Zc(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Ru(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? qs(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function wp(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = Ru(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function Tp(t, n) {
	let { preset: r, config: i } = t, a = Xu(), o = $u(ld(r)), s = Zu(), c = Cp(r, i), l = t.transport;
	return {
		vars: nl(r, i, {
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
			customLast: wp(r)
		}
	};
}
function Ep(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = df(s.map(({ m: e }) => ({
		role: e.role,
		text: xp(e.content)
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
			mes: xp(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = {
		trigger: Vd(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		...sf(r, i),
		recap: Zu(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1,
		annotations: of(r, i)
	}, m = /* @__PURE__ */ new Map();
	if (i.cache?.enabled) {
		let e = jf(), n = Vf(d, p, Mf(e)?.modes, (e) => If(d[e], f[e] ?? e));
		for (let e of n.out) m.set(d[e.index].__h, e.entry === void 0 ? e.item.mes : e.item.mes + zf(e.entry));
		t.sticky = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else for (let e of af(d, p)) m.set(e.__h, e.mes);
	let h = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : h.add(t.i);
	});
	for (let e of [...h].sort((e, t) => t - e)) n.splice(e, 1);
}
function Dp(t, n) {
	let r = n ? null : Yd.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = fd(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = Hd(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: Gd(),
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
		keywords: Cf(a, n ? o : -1)
	};
}
var Op = Symbol("ap-region");
function kp(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => xp(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Zc(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = xp(t.content);
		if (t[Op] || t.role === "system") return n;
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
async function Ap(t) {
	let { chat: n, dryRun: r } = t;
	if (!q().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		mp(n), r || (Yd.setPending(null), Yd.takeArmed());
		return;
	}
	let i = Od(), a = i ? Tu(i) : void 0;
	if (!a) {
		let e = Sp(n).filter((e) => !e.__anchor);
		mp(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = Dp(a, r), s = Sp(n);
	!o.interceptorRan && !r && Ep(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : Ud(a, o.config, o.origin), { vars: u, data: d } = Tp(o, l), f = Ul(a, pf(a), o.keywords);
	for (let e of f.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let p = tl({
		preset: f.preset,
		config: o.config,
		vars: u,
		data: d
	}, l);
	o.workflow = l, o.assembly = p, o.stages = p.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : p.structures;
	let m = (t) => e().substituteParams(t), h = [], g = -1, _ = -1, v = {
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
			text: Gc(t)
		}))
	};
	for (let e of s) {
		if (!e.__anchor) {
			h.push(e);
			continue;
		}
		let t = e.__anchor;
		t === a.anchors.historyEnd && _ < 0 && (_ = h.length);
		let n = (p.regions[t] ?? []).map((e) => {
			let t = {
				role: e.role,
				content: m(e.content)
			};
			return Object.defineProperty(t, Op, { value: !0 }), t;
		}).filter((e) => xp(e.content).trim());
		v.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: xp(e.content).length,
				content: xp(e.content)
			}))
		}), h.push(...n), t === a.anchors.historyStart && (g = h.length);
	}
	v.cache = vp(o, h, g, _ < 0 ? h.length : _);
	let y = o.transport === "prefill" && !c && g >= 0 ? kp(o, h, g) : h;
	n.splice(0, n.length, ...y.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), Jf("assembly", v), !r && !c && l && Yd.arm(o);
}
//#endregion
//#region src/core/transports/text.ts
function jp(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = ap(t), i = {
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
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), cp({
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
			let n = up(t, e.caller);
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
var Mp = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Np = 32, Pp = 10, Fp = 9, Ip = 13, Lp = 160, Rp = 6158, zp = 8192, Bp = 8203, Vp = 8239, Hp = 8287, Up = 12288, Wp = 65279;
function Gp(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Kp(e) {
	return e >= "0" && e <= "9";
}
function qp(e) {
	return e >= " ";
}
function Jp(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Yp(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Xp(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var Zp = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, Qp = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function $p(e) {
	return ",[]/{}\n+".includes(e);
}
function em(e) {
	return om(e) || tm.test(e);
}
var tm = /^[[{\w-]$/;
function nm(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function rm(e, t) {
	let n = e.charCodeAt(t);
	return n === Np || n === Pp || n === Fp || n === Ip;
}
function im(e, t) {
	let n = e.charCodeAt(t);
	return n === Np || n === Fp || n === Ip;
}
function am(e, t) {
	let n = e.charCodeAt(t);
	return n === Lp || n === Rp || n >= zp && n <= Bp || n === Vp || n === Hp || n === Up || n === Wp;
}
function om(e) {
	return sm(e) || lm(e);
}
function sm(e) {
	return e === "\"" || e === "“" || e === "”";
}
function cm(e) {
	return e === "\"";
}
function lm(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function um(e) {
	return e === "'";
}
function dm(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function fm(e, t) {
	let n = e.length;
	if (!rm(e, n - 1)) return e + t;
	for (; rm(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function pm(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function mm(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var hm = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function gm(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = hm[n];
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
function _m(e) {
	return e !== null && e.char === "\"";
}
function vm(e) {
	return e !== null && e.char === "'";
}
function ym(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function bm(e, t) {
	switch (t) {
		case ")": return ym(e, "(") > ym(e, ")");
		case "]": return ym(e, "[") > ym(e, "]");
		case "}": return ym(e, "{") > ym(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var xm = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Sm = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Cm(e) {
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
	for (r && a(), em(e[t]) && mm(n) ? (r || (n = fm(n, ",")), g()) : r && (n = dm(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? rm : im, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (am(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !wm(e, t);) t++;
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
			if (Yp(e[t])) for (; t < e.length && Xp(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = fm(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = dm(n, ",")) : ie();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (em(e[t]) || c ? n = fm(n, ":") : ae()), i() || (s || c ? n += "null" : ae()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = fm(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = fm(n, ",")), p(), !i()) {
					r || (n = dm(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = fm(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = fm(n, ",")), t = i();
		t || (n = dm(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, om(e[t]) || ne());
		let s = e[t] === "&" ? gm(e.slice(t, t + 12)) : null, c = _m(s) || vm(s);
		if (om(e[t]) || c) {
			let l = cm(e[t]) ? cm : um(e[t]) ? um : lm(e[t]) ? lm : sm, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = ee(t - 1);
					return !r && Jp(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = fm(p, "\""), n += p, !0);
				}
				if (t === i) return p = fm(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? gm(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Jp(e[t]) && !bm(p, e[t]) || om(e[t]) && !te(t) || Kp(e[t])) return v(), !0;
					e[t] === "\\" && ne();
					let s = ee(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Jp(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && $p(e[t])) {
					if (e[t - 1] === ":" && Zp.test(e.substring(u + 1, t + 2))) for (; t < e.length && Qp.test(e[t]);) p += e[t], t++;
					return p = fm(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : nm(e) ? p += xm[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Sm[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Gp(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : E();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : nm(n) ? (p += xm[n], t++) : (qp(n) || T(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = dm(n, "\"", !0);
			let e = n.length;
			n = _() ? pm(n, e, 1) : fm(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Kp(e[t]) && w() && (i += "0")), e[t] === "0" && Kp(e[t + 1]) && (a = !0); Kp(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Kp(e[t]) || (i += "0"); Kp(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Kp(e[t]) || (i += "0"); Kp(e[t]);) i += e[t], t++;
			return w() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Xp(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (Yp(e[t])) {
			for (; t < e.length && Xp(e[t]);) t++;
			let n = t;
			for (; rm(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !$p(e[t]) && !om(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && Zp.test(e.substring(a, t + 2))) for (; t < e.length && Qp.test(e[t]);) t++;
		if (t > a) {
			for (; rm(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && rm(e, n);) n--;
		return n;
	}
	function te(t) {
		let n = t + 1;
		for (; n < e.length && rm(e, n);) n++;
		return n >= e.length || Jp(e[n]);
	}
	function w() {
		return t >= e.length || Jp(e[t]) || rm(e, t);
	}
	function T(e) {
		throw new Mp(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function ne() {
		throw new Mp(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function re() {
		throw new Mp("Unexpected end of json string", e.length);
	}
	function ie() {
		throw new Mp("Object key expected", t);
	}
	function ae() {
		throw new Mp("Colon expected", t);
	}
	function E() {
		throw new Mp(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function wm(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Tm(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Em(e, t) {
	let n = Tm(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Cm(n));
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
function Dm(e, t, n, r) {
	let i = uc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function Om(e) {
	let { ctx: t, caller: n } = e, r = ip(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = Em(c(e), i);
		return s = a.value, n.schema ? Dm(t, r, a.value, i) : hc(a.value, {
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
		body: () => cp(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var km = (e, t) => ({
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
function Am(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function jm(e) {
	let { ctx: t, caller: n } = e, r = ip(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = sp(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = Em((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? Dm(t, r, o.value, i) : hc(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => cp(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = up(e, n);
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
function Mm(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = ip(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = sp(e, o ? "parallel" : "multi", l), d = [
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
		let o = Em(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? Dm(t, s, e, a) : hc(e, {
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
			return cp({
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
			let i = Am(e.toolCalls.filter((e) => e.name), r), o = up(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(km(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = op(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: op(t, a.tools.results.nudge, {
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
function Nm(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return jp(e);
		case "structured": return Om(e);
		case "tool-single": return jm(e);
		case "tool-multi": return Mm(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Pm(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var X = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Fm(e) {
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
				end: (e) => i() + a() + X({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
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
							args: Im(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => X({ error: { message: e } }),
			end: (e) => e ? X({ usageMetadata: e }) : ""
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
			end: (e) => X({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
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
			end: (e) => (e ? X({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + X("[DONE]")
		};
	}
}
function Im(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Lm(e, t) {
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
	return t.usage && (r[e === "gemini" ? "usageMetadata" : "usage"] = t.usage), e === "claude" ? r.content = [
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
			input: Im(e.arguments)
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
					args: Im(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Rm(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function zm(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Bm(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Vm = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = zm(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Bm(t);
			if (r) {
				let t = this.open.has(e) ? Hm(this.value, n) : void 0;
				Um(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Hm(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Um(e, t, n) {
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
//#region src/core/usage.ts
var Wm = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Gm(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Wm(t) ? t : void 0;
}
function Km(e, t) {
	if (!Wm(t)) return Wm(e) ? e : void 0;
	if (!Wm(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Wm(r) && Wm(n[e]) ? Km(n[e], r) : r);
	return n;
}
function qm(e, t) {
	if (!Wm(t)) return Wm(e) ? e : void 0;
	if (!Wm(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Wm(r) && Wm(t) ? n[e] = qm(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var Jm = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function Ym(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var Xm = class {
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
				args: new Vm()
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
function Zm(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function Qm(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* $m(e, t) {
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
async function* eh(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = Ym(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Jm(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new Xm();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = Ym(t);
		if (n) throw new Jm(n);
		i.text = Zm(t), i.reasoning = Qm(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Gm(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of $m(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = Ym(e);
		if (r) throw new Jm(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Gm(e);
		c && (i.usage = Km(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var th = /* @__PURE__ */ nn({ current: null });
function nh(e, t) {
	return th.current = {
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
	}, th.current;
}
function rh(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var ih = "/api/backends/chat-completions/generate", ah = { pending: null }, oh = (e) => e?.name === "AbortError";
function sh(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Y("error.toolsUnsupported") : null;
}
async function ch(e, t, n) {
	let r = Pm(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = sh(e);
	if (a) return p("error", a, "Advanced Preset"), Rm(a, 400);
	let o = e.origin === "task" ? np(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = nh(e, i);
	if (!i) try {
		let i = await dh(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(Lm(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return uh(c, e);
	}
	let l = Fm(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), m = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), h = "";
	return (async () => {
		try {
			let i = await dh(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(h) && e.length > h.length && (m(l.text(e.slice(h.length))), h = e);
			});
			i.content.startsWith(h) && await m(l.text(i.content.slice(h.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await m(l.reasoning(i.reasoning)), i.toolCalls?.length && await m(l.toolCalls(i.toolCalls)), await m(l.end(i.usage));
		} catch (e) {
			oh(e) || (await m(l.error(lh(e))), uh(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var lh = (e) => e instanceof Error ? e.message : String(e);
function uh(e, t) {
	return e.status = oh(t) ? "aborted" : "error", e.error = lh(t), t instanceof Jm ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Rm(lh(t));
}
async function dh(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = Nm({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Pm(s, n)
	}), u = Qs(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, h = t.structures.some((e) => e.kind === "annotations") ? (e) => du(e, { final: !1 }).text : (e) => e, g = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, _ = Date.now(), v = "", y, b = 0, x = !1, S, C;
	for (let n = 0; n < g; n++) {
		i.step = n;
		let r = l.body(n), s = Yf({
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
			let n = await m(ih, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), f = 0;
			for await (let e of eh(n, c(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - f < 50) continue;
				f = t;
				let n = l.progress(e, !1);
				if (rh(i, n, v + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(h(e.slice(0, e.length - zs(e))).trimEnd());
				}
			}
			yp(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
		} catch (e) {
			if (s.error = lh(e), oh(e) || a?.aborted) {
				(u.text || u.reasoning || u.toolCalls.length) && yp(t), y = qm(y, u.usage), x = !0, C = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = qm(y, u.usage), l.progress(u, !0);
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
	let ee = C ?? l.result();
	if (x) for (let e of Object.values(ee.stages)) e.status === "streaming" && (e.status = "interrupted");
	rh(i, ee, v);
	let te = fh(t, ee, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: x
	});
	return te.toolCalls = S, te.usage = y, S && (te.content = ""), i.status = x ? "aborted" : "done", te;
}
function fh(t, n, r, i, a, o) {
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
			let t = du(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = du(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), C = v("memory"), ee = t.meta.mixed ? "meta-mixed" : "story", te = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? te = i === void 0 ? u || Bs(r).trim() : JSON.stringify(i) : u || (ee = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", te = b ? qs(b) : "", !te && x && typeof n.structures[x.id] == "string" && (te = "…"), !te && S && n.structures[S.id] && (te = "…"))), !te && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let w = [], T = [], ne = t.interceptorRan && t.stType !== "quiet";
	if (ne && C && Array.isArray(n.structures[C.id])) {
		let e = od(n.structures[C.id]);
		w.push(...e.events), T = e.global;
	}
	if (ne && S && typeof n.structures[S.id] == "string") {
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
		turn: ee,
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
		content: te,
		reasoning: a,
		sidecar: ie,
		...T.length ? { global: T } : {}
	};
	return ne ? ah.pending = {
		ctx: t,
		outcome: ae,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ie
	}), th.current?.genId === t.id && (th.current.structures = n.structures), ae;
}
//#endregion
//#region src/core/fetch-gate.ts
var ph = "__ap_gen_id";
function mh(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function hh() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	h(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(mh(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[ph], r = typeof t == "string" ? Yd.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[ph], r.claimed = !0;
				try {
					return await ch(r, e, n.signal);
				} finally {
					Yd.release(t);
				}
			}
			e && (delete e[ph], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function gh(e) {
	let t = Yd.takeArmed();
	t && (e[ph] = t.id);
}
//#endregion
//#region src/app/memory-sync.ts
var _h = "\0";
function vh(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = Gu(e);
		r && t.add(`${n.presetId}${_h}${r}`);
	}
}
function yh(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && vh(r.extra?.[Lu], t), r.swipe_info?.forEach((e, t) => {
			t !== i && vh(e?.extra?.[Lu], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var bh = null;
function xh(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = yh(n.chat ?? []), o = new Set(a);
	if (bh && !t.reload && bh.chatId === r) for (let e of bh.active) i.has(e) || o.add(e);
	bh = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(_h), i = s.get(n);
		i || s.set(n, i = {
			on: [],
			off: []
		}), (t ? i.on : i.off).push(r);
	};
	for (let e of o) c(e, !1);
	for (let e of i) c(e, !0);
	let l = !1, u = q().presets;
	for (let [e, t] of s) {
		let n = u[e];
		n?.globalMemory && (Wu(n.globalMemory.log) && (l = !0), cd(n, t.off, !1) && (l = !0), cd(n, t.on, !0) && (l = !0));
	}
	return l && J(), l;
}
function Sh(e) {
	Vu(e), xh();
}
function Ch() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => Sh(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => xh());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => xh({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var wh = 6e5, Th = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function Eh(t, n) {
	let r = ah.pending;
	if (!r || Date.now() - r.at > wh || Th.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	ah.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), Bu(t, a.sidecar), a.global?.length && sd(ld(r.ctx.preset), a.global), xh(), th.current?.genId === r.ctx.id && (th.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var Dh = /* @__PURE__ */ new Set();
function Oh(e) {
	for (let t of Dh) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function kh(t) {
	let n = e().chat[t], r = Ru(n)?.annotations;
	return !n || !r?.length ? [] : hu(n.mes, r).annotations;
}
function Ah(t) {
	let n = e().chat[t], r = Ru(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = hu(n.mes, r.annotations);
	return i.changed ? (Bu(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function jh() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Ah(n) && e().saveChat(), Oh(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Oh(Number(e)));
}
var Mh = {
	get: (e) => kh(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return Dh.add(t), () => Dh.delete(t);
	}
}, Nh = "advancedPreset.reloadedFor";
async function Ph() {
	try {
		let e = await m(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Fh(e) {
	sessionStorage.setItem(Nh, e), p("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Ih() {
	let e = await Ph();
	e && e !== "1f44c633fe72b4a6" && sessionStorage.getItem(Nh) !== e && Fh(e);
}
async function Lh() {
	await Ih();
}
async function Rh() {
	let e = o().replace(/^third-party\//, ""), t = await zh(e, !1);
	if (t.status === 404 && (t = await zh(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Ph();
	return r && r !== "1f44c633fe72b4a6" ? (Fh(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var zh = (t, n) => m("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Bh = /* @__PURE__ */ nn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), Vh = 1500, Hh = null;
async function Uh() {
	let { url: e, enabled: t } = q().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await m(`${n}/`, { cache: "no-store" })).json();
		if (Bh.status = "online", Bh.error = e.ok === !1 ? "build failed" : "", Bh.at = Date.now(), !e.hash || e.hash === Bh.hash) return;
		let t = bu(await (await m(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Bh.presetId && Bh.presetId !== t.id && Ou(null, Bh.presetId), Ou(t), Bh.presetId = t.id, Bh.hash = t.hash, Sd(t), await Nd(t), Jf("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Bh.status = "error", Bh.error = e instanceof Error ? e.message : String(e);
	}
}
function Wh() {
	if (Hh && clearTimeout(Hh), Hh = null, !q().dev.enabled) {
		Bh.presetId && Ou(null, Bh.presetId), Object.assign(Bh, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	Bh.status === "off" && (Bh.status = "connecting");
	let e = async () => {
		await Uh(), q().dev.enabled && (Hh = setTimeout(e, Vh));
	};
	e();
}
function Gh() {
	or(() => [q().dev.enabled, q().dev.url], () => {
		Bh.hash = "", Wh();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var Kh = "#option_impersonate, #mes_impersonate", qh = () => document.querySelector("#send_textarea");
function Jh(e, t = !1) {
	let n = qh();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function Yh() {
	if (!q().enabled) return null;
	let t = Od(), n = t ? Tu(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = fd(n), i = Ms(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Zc(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function Xh(e) {
	if (!e.target?.closest?.(Kh)) return;
	let t = Yh();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = qh()?.value.trim();
	Jh(n ? `${t}\n${n}` : t, !0);
}
function Zh() {
	window.addEventListener("click", Xh, !0);
}
//#endregion
//#region src/app/install.ts
function Qh(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function $h(e, t) {
	let n = bu(e);
	if (!n) throw Error(Y("presets.invalid"));
	if (n.minAdvancedPreset && wc("1.8.0", n.minAdvancedPreset) < 0) throw Error(Y("presets.tooNew", { version: n.minAdvancedPreset }));
	Eu(n), t && (q().sources[n.id] = t), J();
	let r = Tu(n.id) ?? n;
	return Sd(r), await Nd(r), r;
}
async function eg(e) {
	let t = await m(Qh(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return $h(await t.json(), e.trim());
}
async function tg(e) {
	return $h(JSON.parse(await e.text()));
}
async function ng(t) {
	if (Du(t), delete q().sources[t], J(), ku(t)) {
		let e = Tu(t);
		e && (Sd(e), await Nd(e));
		return;
	}
	let n = jd(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/download.ts
function rg(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var ig = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled", ag = /* @__PURE__ */ nn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), og = () => {
	ag.chatRev++;
}, sg = () => {
	ag.presetId = Od();
}, cg = K(() => ag.presetId ? Tu(ag.presetId) : void 0), lg = K(() => {
	let e = cg.value;
	if (!e) return { config: "" };
	let t = ld(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Pu(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function ug(t) {
	return ag.chatRev, e().chat[t];
}
function dg(e) {
	return Ru(ug(e));
}
function fg(e) {
	e && (ag.tab = e), ag.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var pg = "openai_preset_import_file", mg = "export_oai_preset";
function hg(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var gg = /* @__PURE__ */ new WeakSet();
async function _g(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (hg(n)) {
		e.value = "";
		try {
			let e = await $h(n);
			await Pd(e), sg(), p("success", Y("presets.installed"), Fu(e)), fg("presets");
		} catch (e) {
			p("error", e instanceof Error ? e.message : String(e), Y("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		gg.add(t), e.dispatchEvent(t);
	}
}
function vg() {
	let e = Od(), t = e ? Tu(e) : void 0;
	return t ? (rg(`${ig(t.id)}.apreset.json`, t), !0) : !1;
}
function yg() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== pg || gg.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), _g(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${mg}`) && vg() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var bg = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-shadow:0 8px 28px #00000073}", xg = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", Sg = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}", Cg = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;background:var(--ap-panel-bg);color:var(--ap-text);-webkit-backdrop-filter:blur(var(--SmartThemeBlurStrength,10px));flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}", wg = /* @__PURE__ */ nn({ mode: "light" }), Tg = new CSSStyleSheet();
Tg.replaceSync([
	bg,
	xg,
	Sg,
	Cg
].join("\n"));
var Eg = new CSSStyleSheet(), Dg = [Tg, Eg], Og = [
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
function kg(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of Og) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function Ag(e) {
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
function jg() {
	let e = Ag(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var Mg = /* @__PURE__ */ new Set();
function Ng(e) {
	return Mg.add(e), e.dataset.apTheme = wg.mode, () => Mg.delete(e);
}
function Pg() {
	let e = jg();
	if (e !== wg.mode) {
		wg.mode = e;
		for (let t of Mg) t.dataset.apTheme = e;
	}
}
function Fg() {
	wg.mode = jg();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(Pg);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), ir(() => {
		let e = cg.value?.theme?.[wg.mode] ?? {}, t = q().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(kg(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(kg("primary", t.primary)), t.accent && n.push(kg("accent", t.accent)), Eg.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function Ig(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function Lg(e, t, n = []) {
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
			e.adoptedStyleSheets = Dg, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = Ng(this), this.app = fs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var Rg = 6, zg = 8;
function Bg(e, t, n, r = "center", i = !1) {
	let a = e.top - Rg - t.height >= zg, o = e.bottom + Rg + t.height <= n.height - zg, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - Rg - t.height : e.bottom + Rg;
	c = Math.max(zg, Math.min(c, n.height - zg - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(zg, Math.min(l, n.width - zg - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function Vg(e, t) {
	let n = /* @__PURE__ */ N(!1), r = /* @__PURE__ */ N(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = Bg(n.getBoundingClientRect(), o, a, t().align, t().below);
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
var Hg = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), Ug = /* @__PURE__ */ new Set([
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
]), Wg = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function Gg(e) {
	return Wg(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function Kg(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${Gg(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${Gg(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${Gg(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function qg(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = qg(e, t);
			n && i.appendChild(n);
		}
	};
	if (!Hg.has(r) && !Ug.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = qg(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function Jg(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return Kg(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", Kg(e.textContent));
			continue;
		}
		let t = qg(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function Yg(e, t, n, r) {
	return e && Nu(e)?.workflows?.[t]?.stages?.[n] || r;
}
function Xg(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return Ig(e?.actors[t]?.color, n);
}
function Zg(e) {
	return K(() => {
		let t = e(), n = dg(t), r = th.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = Tu(r.presetId);
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
					label: Yg(e, r.workflow, t.id, t.label),
					color: Xg(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = Tu(n.presetId);
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
				label: Yg(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: Xg(i, e.actor)
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
}), Qg, $g, e_ = null;
function t_(t) {
	let n = Tu(Ru(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Zc(n, fd(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: Xg(n, n.narrator)
	};
}
function n_(e, t) {
	clearTimeout(Qg), clearTimeout($g), $g = void 0, e_ = null, Z.key !== e.key && Object.assign(Z, t_(e.mesId), { html: Jg(e.ann.comment) }), Object.assign(Z, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), Z.rev++;
}
function r_() {
	clearTimeout(Qg), clearTimeout($g), $g = void 0, e_ = null, Z.open && (Z.open = !1, Z.pinned = !1, Z.key = null);
}
function i_(e) {
	if (!Z.pinned) {
		if (e) {
			if (Z.open && Z.key === e.key) {
				clearTimeout($g), $g = void 0;
				return;
			}
			if (e_ === e.key) return;
			clearTimeout(Qg), e_ = e.key, Qg = setTimeout(() => n_(e, !1), 150);
		} else clearTimeout(Qg), e_ = null, s_();
	}
}
function a_(e) {
	e && !(Z.open && Z.key === e.key) ? n_(e, !0) : r_();
}
function o_() {
	clearTimeout($g), $g = void 0;
}
function s_() {
	!Z.open || Z.pinned || $g || ($g = setTimeout(r_, 200));
}
function c_(e) {
	Z.key && e.has(Z.key) && r_(), e_ && e.has(e_) && (clearTimeout(Qg), e_ = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var l_ = {
	key: 0,
	class: "anno-author"
}, u_ = ["innerHTML"], d_ = /* @__PURE__ */ L({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ N(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = Z.rect, a = Bg(DOMRect.fromRect({
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
		}), (e, n) => P(Z).open ? (B(), V("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Oe({ "--actor": P(Z).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => P(o_) && P(o_)(...e),
			onMouseleave: n[1] ||= (...e) => P(s_) && P(s_)(...e)
		}, [P(Z).author ? (B(), V("div", l_, A(P(Z).author), 1)) : G("", !0), U("div", {
			class: "rich anno-text",
			innerHTML: P(Z).html
		}, null, 8, u_)], 36)) : G("", !0);
	}
}), f_ = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, p_ = /\s/, m_ = /[“”„‟〝〞＂「」]/, h_ = /[‘’‚‛『』＇]/;
function g_(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!f_.test(i)) {
			if (p_.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else m_.test(i) ? i = "\"" : h_.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var __ = (e) => g_(e).text;
function v_(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function y_(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function b_(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function x_(e, t, n, r = g_(e)) {
	let i = __(n.quote).trim();
	if (!i) return null;
	let a = v_(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = __(n.prefix), s = __(n.suffix), c = 0, l = a.map((t) => {
			let n = y_(e, r.text.slice(Math.max(0, t - e.length), t)) + b_(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = v_(__(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function S_(e, t, n = !1) {
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
var C_ = /* @__PURE__ */ new Set([
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
function w_(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (C_.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = w_(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function T_(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? C_.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && w_(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function E_(e, t, n) {
	let r = T_(e), i = r.map((e) => e.data), a = i.join(""), o = g_(a), s = [];
	for (let e of n) {
		let n = x_(a, t, e, o);
		n && s.push({
			ann: e,
			start: S_(i, n[0]),
			end: S_(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function D_(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var O_ = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function k_(e, t) {
	let n = [...e.located].sort((e, t) => O_(e.start, t.start) ? 1 : O_(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && O_(r, i.end))) {
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
function A_(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var j_ = "ap-anno", M_ = "ap-anno-style", N_ = /* @__PURE__ */ new Map(), P_ = 0, F_ = "#a855f7", I_ = () => null;
function L_(e) {
	I_ = e;
}
function R_() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${F_}; }
::highlight(${j_}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function z_(e) {
	let t = e.getElementById(M_);
	t || (t = e.createElement("style"), t.id = M_, (e.head ?? e.documentElement).append(t)), t.textContent !== R_() && (t.textContent = R_());
}
function B_(e) {
	if (e !== F_) {
		F_ = e;
		for (let e of q_()) z_(e.doc);
	}
}
function V_(e, t) {
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
var H_ = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function U_(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => H_(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: V_(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (H_(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: V_(n, e.doc)
			};
		}
	}
	return null;
}
function W_(e) {
	let t = I_();
	return !!(t && e.composedPath().includes(t));
}
function G_(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !W_(r) && i_(U_(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (W_(t)) return;
		let n = U_(e, t);
		i === "mouse" ? n || r_() : a_(n);
	}, c = (e) => {
		W_(e) || r_();
	}, l = () => i_(null);
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
function K_(e) {
	let t = N_.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(j_) ?? new i(), r.set(j_, a)), z_(e), t = {
		doc: e,
		serial: ++P_,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = G_(t), N_.set(e, t), t;
}
function q_() {
	for (let [e, t] of N_) e.defaultView || (t.detach(), N_.delete(e));
	return [...N_.values()];
}
function J_(e) {
	K_(e);
}
function Y_(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function X_(e, t, n, r, i) {
	let a = Z_(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = K_(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = D_(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			k_(r, (t, r) => {
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
	a.size && c_(a);
}
function Z_(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [N_.get(t)].filter((e) => !!e) : q_()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && A_(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), N_.delete(i.doc));
		}
	}
	return r;
}
function Q_(e, t) {
	let n = Z_(e, t);
	n.size && c_(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var $_ = /* @__PURE__ */ new Set();
function ev(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var tv = () => q().ui.annotations?.show !== !1, nv = class {
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
		}), $_.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && Q_(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && Q_(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			Q_(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = th.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && tv() ? kh(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		X_(this, document, t, a.length ? E_(this.el, o, a) : null, !Y_(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (X_(this, n, t, a.length && !ev(n) ? E_(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), Q_(this), $_.delete(this);
		}
	}
};
function rv(e, t) {
	for (let n of $_) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function iv() {
	for (let e of $_) e.hasFrames && e.schedule(0);
}
function av() {
	for (let e of $_) e.el.isConnected || e.dispose();
}
var ov = /* @__PURE__ */ new WeakMap();
function sv(e) {
	let t = ov.get(e);
	(!t || t.disposed) && ov.set(e, new nv(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var cv = () => window.__TAURITAVERN__?.api?.chatSurface, lv = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return cv()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), uv = !1;
function dv() {
	let t = cv();
	!uv && t && lv() && (t.protocolVersion === 1 ? (uv = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new nv(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function fv(e, t) {
	t && !lv() && sv(e);
}
var pv = null;
function mv() {
	return (!pv || !pv.isConnected) && (pv = document.createElement("ap-anno-bubble"), document.body.append(pv)), pv;
}
function hv() {
	Lg("ap-anno-bubble", d_), mv(), L_(() => pv), J_(document), ir(() => {
		let e = q().ui, t = cg.value?.theme?.[wg.mode]?.accent;
		B_(e.annotations?.color || e.accent || t || (wg.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), or(tv, () => {
		r_(), rv(void 0, 0);
	}), or(() => th.current?.status, () => rv()), Mh.on("change", (e) => rv(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		r_(), av();
	});
	t.on("message_iframe_render_ended", () => iv()), addEventListener("resize", () => r_());
}
//#endregion
//#region src/ui/mounts.ts
var gv = "ap-hidden", _v = [
	"meta-pure",
	"impersonate",
	"summary"
];
function vv(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function yv(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Ru(a), s = th.current?.mesId === n;
	a && !a.is_user && fv(i, !!(o?.annotations?.length || s));
	let c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = vv("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = vv("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(gv, !!(!s && o && _v.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(gv));
}
function bv(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) yv(t);
}
function xv() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var Sv = 0, Cv = /* @__PURE__ */ new Set(), wv = !1;
function Tv(e) {
	e ? Cv.add(e) : wv = !0, !Sv && (Sv = requestAnimationFrame(() => {
		if (Sv = 0, wv) bv();
		else for (let e of Cv) e.isConnected && yv(e);
		Cv.clear(), wv = !1, xv(), av();
	}));
}
function Ev() {
	og(), Tv();
}
function Dv() {
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
	]) e && t.on(e, Ev);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Tv(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Tv(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Tv();
	};
	r();
	let i;
	or(() => th.current && th.current.status === "running" && th.current.streaming && th.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = th.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Ev());
		}, 100));
	}), or(() => th.current?.status, () => Tv());
}
//#endregion
//#region src/ui/entry.ts
var Ov = "left-nav-panel", kv = "ap-preset-banner";
function Av() {
	return document.getElementById(Ov);
}
function jv() {
	let e = Av();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function Mv() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== kv && e.after(document.createElement(kv));
}
var Nv = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function Pv() {
	or(() => ag.presetId, (e) => {
		for (let t of document.querySelectorAll(Nv.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function Fv() {
	let e = Av();
	if (!e) {
		document.querySelector("ap-panel") || document.body.append(document.createElement("ap-panel"));
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function Iv() {
	Mv(), Pv(), Fv(), or(() => ag.panelOpen, (e) => {
		e && jv();
	});
	let e = Av();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (ag.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var Lv = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, Rv = (e) => e === "", zv = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), Bv = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Vv = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), Hv = (e) => {
	let t = Vv(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, Uv = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, Wv = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = Uv.width, color: s = Uv.stroke, ...c }, { slots: l }) => La("svg", {
	...Uv,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": Rv(n) || Rv(r) || n === !0 || r === !0 ? Number(i || a || Uv["stroke-width"]) * 24 / Number(o) : i || a || Uv["stroke-width"],
	class: zv("lucide", c.class, ...e ? [`lucide-${Bv(Hv(e))}-icon`, `lucide-${Bv(e)}`] : ["lucide-icon"]),
	...!l.default && !Lv(c) && { "aria-hidden": "true" }
}, [...t.map((e) => La(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => La(Wv, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), Gv = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), Kv = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), qv = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), Jv = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), Yv = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), Xv = Q("brain", [
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
]), Zv = Q("bug", [
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
]), Qv = Q("cable", [
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
]), $v = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), ey = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), ty = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), ny = Q("circle-dashed", [
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
]), ry = Q("circle-question-mark", [
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
]), iy = Q("circle-slash", [["circle", {
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
}]]), ay = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), oy = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), sy = Q("coins", [
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
]), cy = Q("copy-plus", [
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
]), ly = Q("copy", [["rect", {
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
}]]), uy = Q("database-zap", [
	["ellipse", {
		cx: "12",
		cy: "5",
		rx: "9",
		ry: "3",
		key: "msslwz"
	}],
	["path", {
		d: "M3 5V19A9 3 0 0 0 15 21.84",
		key: "14ibmq"
	}],
	["path", {
		d: "M21 5V8",
		key: "1marbg"
	}],
	["path", {
		d: "M21 12L18 17H22L19 22",
		key: "zafso"
	}],
	["path", {
		d: "M3 12A9 3 0 0 0 14.59 14.87",
		key: "1y4wr8"
	}]
]), dy = Q("download", [
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
]), fy = Q("drama", [
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
]), py = Q("feather", [
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
]), my = Q("file-stack", [
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
]), hy = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), gy = Q("git-compare-arrows", [
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
]), _y = Q("globe", [
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
]), vy = Q("grip-vertical", [
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
]), yy = Q("info", [
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
]), by = Q("layers", [
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
]), xy = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Sy = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Cy = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), wy = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Ty = Q("message-square-dashed", [
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
]), Ey = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), Dy = Q("notebook-pen", [
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
]), Oy = Q("package", [
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
]), ky = Q("palette", [
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
]), Ay = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), jy = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), My = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Ny = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), Py = Q("refresh-cw", [
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
]), Fy = Q("regex", [
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
]), Iy = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), Ly = Q("save", [
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
]), Ry = Q("scroll-text", [
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
]), zy = Q("server", [
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
]), By = Q("shapes", [
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
]), Vy = Q("sliders-horizontal", [
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
]), Hy = Q("sliders-vertical", [
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
]), Uy = Q("text-cursor-input", [
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
]), Wy = Q("trash-2", [
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
]), Gy = Q("triangle-alert", [
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
]), Ky = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), qy = Q("upload", [
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
]), Jy = Q("user-pen", [
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
]), Yy = Q("workflow", [
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
]), Xy = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Zy = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), Qy = /* @__PURE__ */ L({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Vg(n, () => t);
		return (t, a) => (B(), V("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [qr(t.$slots, "default"), P(r) && e.text ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : G("", !0)], 544));
	}
}), $y = ["disabled", "aria-label"], $ = /* @__PURE__ */ L({
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
		return (t, n) => (B(), H(Qy, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: F(() => [U("button", {
				type: "button",
				class: k(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(B(), H(Ur(e.icon)))], 10, $y)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), eb = {
	key: 0,
	class: "patches"
}, tb = { class: "patch-old pre" }, nb = { class: "patch-new pre" }, rb = {
	key: 0,
	class: "patch-status xs"
}, ib = {
	key: 2,
	class: "faint small stage-empty"
}, ab = /* @__PURE__ */ L({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null);
		or(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Bn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (B(), V("div", {
			class: "stage-body",
			style: Oe({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (B(), V("div", eb, [(B(!0), V(z, null, R(e.stage.patches, (e, t) => (B(), V("div", {
			key: t,
			class: k(["patch", { failed: r(e.status) }])
		}, [
			U("div", tb, A(e.old_string), 1),
			W(P(Gv), { class: "patch-arrow" }),
			U("div", nb, A(e.new_string), 1),
			r(e.status) ? (B(), V("div", rb, [W(P(qv)), ua(A(P(Y)(`patch.${e.status}`)), 1)])) : G("", !0)
		], 2))), 128))])) : e.stage.text ? (B(), V("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, A(e.stage.text), 513)) : (B(), V("div", ib, A(P(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function ob(t) {
	let n = e().chat[t], r = Ru(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), Bu(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), og();
}
async function sb(t, n, r) {
	let i = e().chat[t], a = Ru(i);
	return !i || !a ? !1 : (Bu(t, zu(a, n, r)), og(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var cb = { class: "stage-bar" }, lb = ["onClick"], ub = { class: "ellipsis" }, db = {
	key: 0,
	class: "chip stage-chip error"
}, fb = { class: "ellipsis" }, pb = { class: "badge warn" }, mb = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, hb = /* @__PURE__ */ L({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Zg(() => t.mesid), r = /* @__PURE__ */ N(null), i = /* @__PURE__ */ N(!1), a = K(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = K(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = K(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = K(() => o.value.find((e) => e.id === s.value) ?? null);
		or(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = q().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Dy,
			content: py,
			patch: gy
		}, d = (e) => e.status === "streaming" ? Sy : e.status === "interrupted" ? iy : e.status === "missing" ? ny : u[e.kind], f = K(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = K(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = K(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => P(n) && (o.value.length || P(n).error) ? (B(), V("div", {
			key: 0,
			class: k(["stages", { live: P(n).running }])
		}, [U("div", cb, [
			(B(!0), V(z, null, R(o.value, (e) => (B(), V("button", {
				key: e.id,
				type: "button",
				class: k(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Oe({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(B(), H(Ur(d(e)), { class: k({ spin: e.status === "streaming" }) }, null, 8, ["class"])), U("span", ub, A(e.label), 1)], 14, lb))), 128)),
			P(n).error ? (B(), V("span", db, [W(P(Gy)), U("span", fb, A(P(n).error), 1)])) : G("", !0),
			r[1] ||= U("span", { class: "grow" }, null, -1),
			f.value.length ? (B(), H(Qy, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: F(() => [U("span", pb, [W(P(Gy)), ua(A(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : G("", !0),
			p.value ? (B(), H($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? P(Ky) : P(Ny),
				label: p.value.patchesApplied ? P(Y)("stages.revertDraft") : P(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => P(ob)(e.mesid)
			}, null, 8, ["icon", "label"])) : G("", !0),
			P(n).running ? G("", !0) : (B(), H(Qy, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: F(() => [U("span", mb, [W(P(yy))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (B(), H(ab, {
			key: c.value.id,
			stage: c.value,
			follow: P(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : G("", !0)], 2)) : G("", !0);
	}
}), gb = { class: "reply-name xs" }, _b = ["innerHTML"], vb = /* @__PURE__ */ L({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = K(() => Jg(t.text));
		return (t, r) => (B(), V("div", {
			class: "reply-card",
			style: Oe({ "--actor": e.color })
		}, [U("div", gb, A(e.name), 1), U("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, _b)], 4));
	}
}), yb = { class: "card mini-card" }, bb = { class: "card-head" }, xb = { class: "card-title" }, Sb = { class: "card-body pre" }, Cb = /* @__PURE__ */ L({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (B(), V("div", yb, [U("header", bb, [
			W(P(Jy), { class: "section-icon" }),
			U("span", xb, A(P(Y)("cards.impersonate")), 1),
			U("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => P(Jh)(e.text)
			}, [W(P(Uy)), ua(A(P(Y)("cards.fillInput")), 1)])
		]), U("div", Sb, A(e.text), 1)]));
	}
}), wb = ["aria-label"], Tb = ["title", "onClick"], Eb = { class: "option-label" }, Db = { class: "option-content small muted" }, Ob = /* @__PURE__ */ L({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => Jh(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (B(), V("div", {
			class: "options-grid",
			role: "list",
			"aria-label": P(Y)("cards.options")
		}, [(B(!0), V(z, null, R(e.options, (e, n) => (B(), V("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: P(Y)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [U("span", Eb, A(e.label), 1), U("span", Db, A(e.content), 1)], 8, Tb))), 128))], 8, wb));
	}
}), kb = {
	key: 0,
	class: "memory-ops"
}, Ab = { class: "ellipsis" }, jb = ["aria-label", "onClick"], Mb = /* @__PURE__ */ L({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = K(() => {
			let e = ld(t.preset), n = e.globalMemory.log;
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
					let r = Gu(t), i = r ? Ku(e, r) : -1, a = n[i];
					if (!a) return [];
					let o = !!a.inactive || i >= e.globalMemory.cursor || n.slice(i + 1, e.globalMemory.cursor).some((e) => e.key === a.key && e.source === "undo");
					return [{
						scope: "global",
						op: a.op,
						key: a.key,
						content: a.content,
						id: a.id,
						undone: o
					}];
				}
				return [];
			});
		});
		function r(e) {
			e.id !== void 0 && ad(ld(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (B(), V("div", kb, [(B(!0), V(z, null, R(n.value, (e, t) => (B(), H(Qy, {
			key: t,
			text: e.op === "delete" ? P(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: F(() => [U("span", { class: k(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(B(), H(Ur(e.scope === "global" ? P(_y) : P(wy)), { class: "faint" })),
				U("span", Ab, A(e.key), 1),
				(B(), H(Ur(e.op === "delete" ? P(Wy) : P(jy)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": P(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [W(P(Ky))], 8, jb)) : G("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : G("", !0);
	}
}), Nb = ["aria-label"], Pb = /* @__PURE__ */ L({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ N(null), { open: r, bubble: i } = Vg(n, () => t);
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
			onClick: a[0] ||= os((e) => r.value = !P(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [W(P(ry))], 40, Nb), P(r) ? (B(), V("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : G("", !0)], 544)) : G("", !0);
	}
}), Fb = { class: "card-title" }, Ib = {
	key: 0,
	class: "card-body"
}, Lb = /* @__PURE__ */ L({
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
		return (n, r) => (B(), V("section", { class: k(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [U("header", {
			class: k(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (B(), H(Ur(e.icon), {
				key: 0,
				class: "section-icon"
			})) : G("", !0),
			U("span", Fb, A(e.title), 1),
			W(Pb, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			U("span", {
				class: "row",
				onClick: r[0] ||= os(() => {}, ["stop"])
			}, [qr(n.$slots, "actions")]),
			e.collapsible ? (B(), H(P(ey), {
				key: 1,
				class: k(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : G("", !0)
		], 2), !e.collapsible || t.value ? (B(), V("div", Ib, [qr(n.$slots, "default")])) : G("", !0)], 2));
	}
}), Rb = {
	key: 0,
	class: "badge neutral"
}, zb = { class: "pre small" }, Bb = /* @__PURE__ */ L({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (B(), H(Lb, {
			title: P(Y)("cards.recap"),
			icon: P(Ry),
			collapsible: "",
			open: !1
		}, {
			actions: F(() => [e.coversUpTo === void 0 ? G("", !0) : (B(), V("span", Rb, "#0–" + A(e.coversUpTo), 1))]),
			default: F(() => [U("div", zb, A(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Vb = { class: "synopsis-fields" }, Hb = { class: "synopsis-field" }, Ub = ["placeholder", "aria-label"], Wb = { class: "synopsis-field" }, Gb = ["placeholder", "aria-label"], Kb = ["placeholder", "aria-label"], qb = ["placeholder", "aria-label"], Jb = { class: "synopsis-actions" }, Yb = { class: "xs faint grow synopsis-keys" }, Xb = {
	type: "submit",
	class: "btn primary sm-btn"
}, Zb = { class: "synopsis-head" }, Qb = { class: "synopsis-line small" }, $b = {
	key: 0,
	class: "row tight"
}, ex = {
	key: 1,
	class: "row tight"
}, tx = { class: "synopsis-event ellipsis" }, nx = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, rx = /* @__PURE__ */ L({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(!1), o = /* @__PURE__ */ nn({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ N(), c = /* @__PURE__ */ N(), l = [
			"time",
			"location",
			"event",
			"summary"
		], u = () => ({
			time: o.time.trim(),
			location: o.location.trim(),
			event: o.event.trim(),
			summary: o.summary.trim()
		}), d = K(() => l.some((e) => u()[e] !== (n.synopsis[e] ?? "")));
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
		return (t, n) => a.value ? (B(), V("form", {
			key: 0,
			class: "synopsis-editor",
			onSubmit: os(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= os(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= os(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= os(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= os(() => {}, ["stop"])
		}, [
			U("div", Vb, [U("label", Hb, [W(P(ay), { class: "faint" }), I(U("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: P(Y)("cards.synopsis.time"),
				"aria-label": P(Y)("cards.synopsis.time")
			}, null, 8, Ub), [[Xo, o.time]])]), U("label", Wb, [W(P(Cy), { class: "faint" }), I(U("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: P(Y)("cards.synopsis.location"),
				"aria-label": P(Y)("cards.synopsis.location")
			}, null, 8, Gb), [[Xo, o.location]])])]),
			I(U("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: P(Y)("cards.synopsis.event"),
				"aria-label": P(Y)("cards.synopsis.event")
			}, null, 8, Kb), [[Xo, o.event]]),
			I(U("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: P(Y)("cards.synopsis.summary"),
				"aria-label": P(Y)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, qb), [[Xo, o.summary]]),
			U("div", Jb, [
				U("span", Yb, A(P(Y)("cards.synopsis.keys")), 1),
				U("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, A(P(Y)("common.cancel")), 1),
				U("button", Xb, [W(P($v)), ua(A(P(Y)("common.save")), 1)])
			])
		], 32)) : (B(), V("div", {
			key: 1,
			class: k(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [U("div", Zb, [U("div", Qb, [
			e.synopsis.time ? (B(), V("span", $b, [W(P(ay), { class: "faint" }), ua(A(e.synopsis.time), 1)])) : G("", !0),
			e.synopsis.location ? (B(), V("span", ex, [W(P(Cy), { class: "faint" }), ua(A(e.synopsis.location), 1)])) : G("", !0),
			U("span", tx, A(e.synopsis.event), 1)
		]), e.editable ? (B(), V("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= os(() => {}, ["stop"])
		}, [W($, {
			icon: P(jy),
			label: P(Y)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : G("", !0)]), i.value && e.synopsis.summary ? (B(), V("div", nx, A(e.synopsis.summary), 1)) : G("", !0)], 2));
	}
}), ix = ["innerHTML"], ax = {
	key: 1,
	class: "kv-list small"
}, ox = { class: "pre" }, sx = /* @__PURE__ */ L({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = K(() => typeof t.value == "string" ? Jg(t.value) : "");
		return (t, r) => (B(), H(Lb, {
			title: e.title,
			icon: P(By),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [typeof e.value == "string" ? (B(), V("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, ix)) : (B(), V("dl", ax, [(B(!0), V(z, null, R(e.value, (e, t) => (B(), V(z, { key: t }, [U("dt", null, A(t), 1), U("dd", ox, A(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), cx = {
	key: 0,
	class: "cards"
}, lx = /* @__PURE__ */ L({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = Zg(() => t.mesid), r = K(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = i.find((e) => e.kind === "synopsis")?.id, s = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Zc(r, fd(r), r.narrator),
				color: Xg(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: s?.type === "recap.set" ? s : null,
				synopsisId: o,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: Pu(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (t, n) => r.value ? (B(), V("div", cx, [
			r.value.reply ? (B(), H(vb, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : G("", !0),
			r.value.impersonate ? (B(), H(Cb, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : G("", !0),
			r.value.options.length ? (B(), H(Ob, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : G("", !0),
			r.value.synopsis ? (B(), H(rx, {
				key: 3,
				synopsis: r.value.synopsis,
				editable: "",
				onSave: n[0] ||= (t) => r.value?.synopsisId && P(sb)(e.mesid, r.value.synopsisId, t)
			}, null, 8, ["synopsis"])) : G("", !0),
			r.value.memory.length ? (B(), H(Mb, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : G("", !0),
			r.value.recap ? (B(), H(Bb, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : G("", !0),
			(B(!0), V(z, null, R(r.value.custom, (e) => (B(), H(sx, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : G("", !0);
	}
}), ux = {
	key: 0,
	class: "dock stages live"
}, dx = { class: "stage-bar" }, fx = { class: "ellipsis" }, px = {
	key: 0,
	class: "small muted"
}, mx = /* @__PURE__ */ L({
	__name: "Dock",
	setup(e) {
		let t = K(() => th.current && !th.current.streaming && th.current.status === "running" ? th.current : null), n = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = Tu(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: Yg(n, e.workflow, t.id, t.label),
				color: Xg(n, t.actor)
			}));
		}), r = K(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (B(), V("div", ux, [U("div", dx, [
			W(P(Sy), { class: "spin faint" }),
			(B(!0), V(z, null, R(n.value, (e) => (B(), V("span", {
				key: e.id,
				class: k(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Oe({ "--actor": e.color })
			}, [U("span", fx, A(e.label), 1)], 6))), 128)),
			n.value.length ? G("", !0) : (B(), V("span", px, A(P(Y)("stages.waiting")), 1))
		]), r.value ? (B(), H(ab, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : G("", !0)])) : G("", !0);
	}
}), hx = ["aria-label"], gx = ["disabled"], _x = /* @__PURE__ */ L({
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
		return (n, r) => (B(), V("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			I(U("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, gx), [[Zo, t.value]]),
			r[1] ||= U("span", { class: "track" }, null, -1),
			r[2] ||= U("span", { class: "thumb" }, null, -1)
		], 8, hx));
	}
}), vx = { class: "field-label" }, yx = { class: "ellipsis" }, bx = {
	key: 0,
	class: "dot modified"
}, xx = { class: "field-control" }, Sx = /* @__PURE__ */ L({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (B(), V("div", { class: k(["field", { inline: e.inline }]) }, [U("div", vx, [
			U("span", yx, A(e.label), 1),
			e.modified ? (B(), V("span", bx)) : G("", !0),
			W(Pb, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), U("div", xx, [qr(t.$slots, "default")])], 2));
	}
}), Cx = { class: "swatches" }, wx = ["title"], Tx = ["title"], Ex = { class: "swatches" }, Dx = ["title"], Ox = /* @__PURE__ */ L({
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
		}, s = () => t.annotations ??= { show: !0 }, c = K({
			get: () => t.annotations?.show !== !1,
			set: (e) => {
				s().show = e, J();
			}
		}), l = K({
			get: () => t.annotations?.color ?? "",
			set: (e) => {
				s().color = e || void 0, J();
			}
		});
		return (e, t) => (B(), H(Lb, {
			title: P(Y)("appearance.title"),
			icon: P(ky),
			collapsible: "",
			open: !1
		}, {
			default: F(() => [
				W(Sx, {
					label: P(Y)("appearance.colors"),
					help: P(Y)("appearance.colors.hint"),
					inline: ""
				}, {
					default: F(() => [U("div", Cx, [
						U("label", {
							class: "swatch",
							style: Oe({ background: P(r) || "var(--ap-primary-500)" }),
							title: P(Y)("appearance.primary")
						}, [I(U("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ mn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							Xo,
							P(r),
							void 0,
							{ lazy: !0 }
						]])], 12, wx),
						U("label", {
							class: "swatch",
							style: Oe({ background: P(i) || "var(--ap-accent-500)" }),
							title: P(Y)("appearance.accent")
						}, [I(U("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ mn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							Xo,
							P(i),
							void 0,
							{ lazy: !0 }
						]])], 12, Tx),
						W($, {
							icon: P(Iy),
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
				}, 8, ["label", "help"]),
				W(Sx, {
					label: P(Y)("appearance.collapseStages"),
					inline: ""
				}, {
					default: F(() => [W(_x, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				W(Sx, {
					label: P(Y)("appearance.annotations"),
					help: P(Y)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: F(() => [W(_x, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (B(), H(Sx, {
					key: 0,
					label: P(Y)("appearance.annotationColor"),
					inline: ""
				}, {
					default: F(() => [U("div", Ex, [U("label", {
						class: "swatch",
						style: Oe({ background: l.value || "var(--ap-accent)" }),
						title: P(Y)("appearance.annotationColor")
					}, [I(U("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						Xo,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, Dx), W($, {
						icon: P(Iy),
						label: P(Y)("common.reset"),
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
				}, 8, ["label"])) : G("", !0)
			]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), kx = { class: "toolbar" }, Ax = ["disabled"], jx = ["disabled"], Mx = { class: "preset-list" }, Nx = ["onClick", "onKeydown"], Px = { class: "preset-mark" }, Fx = { class: "grow col preset-info" }, Ix = { class: "row wrap preset-head" }, Lx = { class: "preset-name" }, Rx = { class: "badge neutral" }, zx = {
	key: 0,
	class: "xs muted"
}, Bx = {
	key: 1,
	class: "small muted preset-desc"
}, Vx = {
	key: 0,
	class: "empty"
}, Hx = /* @__PURE__ */ L({
	__name: "PresetsTab",
	setup(e) {
		let t = K(() => xu()), n = /* @__PURE__ */ N(null), r = /* @__PURE__ */ N(!1), i = /* @__PURE__ */ N(""), a = /* @__PURE__ */ N(null);
		async function o(e, t, r) {
			n.value = e;
			try {
				await t(), r && p("success", r);
			} catch (e) {
				p("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				n.value = null;
			}
		}
		let s = (e) => o(`select:${e.preset.id}`, async () => {
			await Pd(e.preset), sg();
		}), c = () => o("url", async () => {
			let e = await eg(i.value);
			return i.value = "", r.value = !1, e;
		}, Y("presets.installed")), l = (e) => {
			let t = e.target.files?.[0];
			t && o("file", () => tg(t), Y("presets.installed")), e.target.value = "";
		}, u = (e) => o(`update:${e.preset.id}`, () => eg(q().sources[e.preset.id]), Y("presets.updated")), d = (e) => o(`remove:${e.preset.id}`, () => ng(e.preset.id)), f = () => o("ext", async () => p("info", await Rh() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, o) => (B(), V(z, null, [
			U("div", kx, [
				U("button", {
					type: "button",
					class: "btn",
					disabled: n.value === "file",
					onClick: o[0] ||= (e) => a.value?.click()
				}, [W(P(qy)), ua(A(P(Y)("presets.importFile")), 1)], 8, Ax),
				U("button", {
					type: "button",
					class: k(["btn", { primary: r.value }]),
					onClick: o[1] ||= (e) => r.value = !r.value
				}, [W(P(xy)), ua(A(P(Y)("presets.importUrl")), 1)], 2),
				o[4] ||= U("span", { class: "grow" }, null, -1),
				W($, {
					icon: n.value === "ext" ? P(Sy) : P(Py),
					label: P(Y)("presets.checkUpdates"),
					align: "end",
					disabled: n.value === "ext",
					onClick: f
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
				onSubmit: os(c, ["prevent"])
			}, [I(U("input", {
				"onUpdate:modelValue": o[2] ||= (e) => i.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Xo, i.value]]), U("button", {
				type: "submit",
				class: "btn primary",
				disabled: n.value === "url"
			}, [n.value === "url" ? (B(), H(P(Sy), {
				key: 0,
				class: "spin"
			})) : (B(), H(P(dy), { key: 1 })), ua(A(P(Y)("common.install")), 1)], 8, jx)], 32)) : G("", !0),
			U("div", Mx, [(B(!0), V(z, null, R(t.value, (e) => (B(), V("div", {
				key: e.preset.id,
				class: k(["preset-item", { on: P(cg)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => s(e),
				onKeydown: cs((t) => s(e), ["enter"])
			}, [
				U("span", Px, [n.value === `select:${e.preset.id}` ? (B(), H(P(Sy), {
					key: 0,
					class: "spin"
				})) : P(cg)?.id === e.preset.id ? (B(), H(P($v), { key: 1 })) : G("", !0)]),
				U("div", Fx, [
					U("div", Ix, [
						U("span", Lx, A(P(Fu)(e.preset)), 1),
						U("span", Rx, "v" + A(e.preset.version), 1),
						e.source === "builtin" ? G("", !0) : (B(), V("span", {
							key: 0,
							class: k(["badge", { warn: e.source === "dev" }])
						}, A(P(Y)(`presets.source.${e.source}`)), 3))
					]),
					e.preset.author ? (B(), V("span", zx, A(e.preset.author), 1)) : G("", !0),
					P(Iu)(e.preset) ? (B(), V("span", Bx, A(P(Iu)(e.preset)), 1)) : G("", !0)
				]),
				U("div", {
					class: "row preset-actions",
					onClick: o[3] ||= os(() => {}, ["stop"])
				}, [e.source === "installed" && P(q)().sources[e.preset.id] ? (B(), H($, {
					key: 0,
					icon: P(Py),
					label: P(Y)("presets.update"),
					align: "end",
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : G("", !0), e.source === "installed" ? (B(), H($, {
					key: 1,
					icon: P(Wy),
					label: P(Y)("common.delete"),
					align: "end",
					small: "",
					danger: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : G("", !0)])
			], 42, Nx))), 128)), t.value.length ? G("", !0) : (B(), V("div", Vx, A(P(Y)("presets.none")), 1))]),
			W(Ox)
		], 64));
	}
}), Ux;
function Wx() {
	let e = cg, t = K(() => e.value ? fd(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (md(r, t), n.sampling && (clearTimeout(Ux), Ux = setTimeout(() => void Fd(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var Gx = { class: "empty" }, Kx = /* @__PURE__ */ L({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (B(), V("div", Gx, [
			W(P(Oy)),
			U("span", null, A(P(Y)("panel.noPreset")), 1),
			U("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => P(ag).tab = "presets"
			}, A(P(Y)("panel.choosePreset")), 1)
		]));
	}
}), qx = [
	"aria-checked",
	"title",
	"onClick"
], Jx = { class: "ellipsis" }, Yx = /* @__PURE__ */ L({
	__name: "Segmented",
	props: /*@__PURE__*/ ei({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ai(e, "modelValue");
		return (n, r) => (B(), V("div", {
			class: k(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(B(!0), V(z, null, R(e.options, (e) => (B(), V("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: k({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (B(), H(Ur(e.icon), { key: 0 })) : G("", !0), U("span", Jx, A(e.label), 1)], 10, qx))), 128))], 2));
	}
}), Xx = { class: "col" }, Zx = { class: "row" }, Qx = ["aria-label"], $x = ["label"], eS = ["value"], tS = ["label"], nS = ["value"], rS = ["placeholder"], iS = {
	key: 1,
	class: "xs muted row tight"
}, aS = { value: "" }, oS = ["value"], sS = ["value"], cS = ["value"], lS = { class: "slider" }, uS = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], dS = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], fS = { class: "field-grid" }, pS = ["value", "onChange"], mS = ["value"], hS = ["value"], gS = /* @__PURE__ */ L({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Wx(), i = K(() => t.value ? ld(t.value) : null), a = K({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				hd(n, {
					kind: r,
					id: i.join(":")
				}), Fd(n);
			}
		}), o = K(() => t.value ? gd(t.value) : !1), s = K(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ N(null), l = /* @__PURE__ */ N("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? vd(e, n) : s.value && bd(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (_d(t.value), Fd(t.value));
		}, p = () => {
			t.value && s.value && (xd(t.value, s.value), Fd(t.value));
		}, m = () => {
			t.value && s.value && yd(t.value, s.value);
		}, h = K(() => _s.map((e) => ({
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
			label: Pu(t.value, "workflows", e.id, "name", e.name),
			hint: Pu(t.value, "workflows", e.id, "description", e.description ?? "")
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
		let C = S("forceTool"), ee = S("parallelTools"), te = S("sendThoughtSignature"), w = S("streamToolArguments"), T = S("finalFallback"), ne = S("maxSteps"), re = K({
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
		], ae = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], E = ["stream_openai", "show_thoughts"], D = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], oe = K(() => n.value?.sampling ?? {}), O = (e) => e in oe.value, se = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), ce = (e) => Number(e.target.value);
		return (e, r) => !P(t) || !P(n) || !i.value ? (B(), H(Kx, { key: 0 })) : (B(), V(z, { key: 1 }, [
			U("div", Xx, [
				U("div", Zx, [
					I(U("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": P(Y)("config.configuration")
					}, [U("optgroup", { label: P(Y)("config.recommended") }, [(B(!0), V(z, null, R(P(t).configurations, (e) => (B(), V("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, A(P(Pu)(P(t), "configurations", e.id, "name", e.name)), 9, eS))), 128))], 8, $x), i.value.saved.length ? (B(), V("optgroup", {
						key: 0,
						label: P(Y)("config.saved")
					}, [(B(!0), V(z, null, R(i.value.saved, (e) => (B(), V("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, A(e.name), 9, nS))), 128))], 8, tS)) : G("", !0)], 8, Qx), [[$o, a.value]]),
					s.value && o.value ? (B(), H($, {
						key: 0,
						icon: P(Ly),
						label: P(Y)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: P(My),
						label: P(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (B(), H($, {
						key: 1,
						icon: P(jy),
						label: P(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : G("", !0),
					s.value ? (B(), H($, {
						key: 2,
						icon: P(Wy),
						label: P(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : G("", !0),
					W($, {
						icon: P(Iy),
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
				c.value ? (B(), V("form", {
					key: 0,
					class: "row",
					onSubmit: os(d, ["prevent"])
				}, [
					I(U("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: P(Y)("config.name"),
						autofocus: ""
					}, null, 8, rS), [[Xo, l.value]]),
					W($, {
						icon: P(Xy),
						label: P(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					W($, {
						icon: P($v),
						label: P(Y)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : G("", !0),
				o.value ? (B(), V("span", iS, [r[15] ||= U("span", { class: "dot modified" }, null, -1), ua(A(P(Y)("config.modified")), 1)])) : G("", !0)
			]),
			W(Lb, {
				title: P(Y)("config.connection"),
				icon: P(Qv)
			}, {
				default: F(() => [
					W(Sx, {
						label: P(Y)("config.transport"),
						help: P(Y)(`transport.${g.value}.hint`)
					}, {
						default: F(() => [W(Yx, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (B(), V(z, { key: 0 }, [
						W(Sx, {
							label: P(Y)("config.forceTool"),
							help: P(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: F(() => [W(_x, {
								modelValue: P(C),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ mn(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(Sx, {
							label: P(Y)("config.parallelTools"),
							help: P(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: F(() => [W(_x, {
								modelValue: P(ee),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ mn(ee) ? ee.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(Sx, {
							label: P(Y)("config.syntheticTurn"),
							help: P(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: F(() => [I(U("select", {
								"onUpdate:modelValue": r[8] ||= (e) => re.value = e,
								class: "input"
							}, [U("option", aS, A(P(Y)("common.none")), 1), (B(!0), V(z, null, R(P(t).syntheticTurns, (e) => (B(), V("option", {
								key: e.id,
								value: e.id
							}, A(e.label), 9, oS))), 128))], 512), [[$o, re.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						W(Sx, {
							label: P(Y)("config.thoughtSignature"),
							help: P(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: F(() => [W(_x, {
								modelValue: P(te),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ mn(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						W(Sx, {
							label: P(Y)("config.streamToolArguments"),
							help: P(Y)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: F(() => [I(U("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ mn(w) ? w.value = e : null,
								class: "input"
							}, [(B(!0), V(z, null, R(P(vs), (e) => (B(), V("option", {
								key: e,
								value: e
							}, A(P(Y)(`config.streamToolArguments.${e}`)), 9, sS))), 128))], 512), [[$o, P(w)]])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (B(), H(Sx, {
							key: 0,
							label: P(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: F(() => [U("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: P(ne),
								onChange: r[11] ||= (e) => ne.value = ce(e)
							}, null, 40, cS)]),
							_: 1
						}, 8, ["label"])) : G("", !0)
					], 64)) : G("", !0),
					W(Sx, {
						label: P(Y)("config.finalFallback"),
						help: P(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: F(() => [W(_x, {
							modelValue: P(T),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ mn(T) ? T.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (B(), H(Lb, {
				key: 0,
				title: P(Y)("config.workflow"),
				icon: P(Yy),
				help: x.value
			}, {
				default: F(() => [W(Yx, {
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
			W(Lb, {
				title: P(Y)("config.sampling"),
				icon: P(hy),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [
					(B(), V(z, null, R(ie, (e) => (B(), V(z, { key: e.key }, [O(e.key) ? (B(), H(Sx, {
						key: 0,
						label: P(Y)(`sampling.${e.key}`)
					}, {
						default: F(() => [U("div", lS, [U("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: oe.value[e.key],
							onInput: (t) => se(e.key, ce(t))
						}, null, 40, uS), U("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: oe.value[e.key],
							onChange: (t) => se(e.key, ce(t))
						}, null, 40, dS)])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)),
					U("div", fS, [(B(), V(z, null, R(ae, (e) => (B(), V(z, { key: e }, [O(e) ? (B(), H(Sx, {
						key: 0,
						label: P(Y)(`sampling.${e}`)
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							value: oe.value[e],
							onChange: (t) => se(e, ce(t))
						}, null, 40, pS)]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64)), O("reasoning_effort") ? (B(), H(Sx, {
						key: 0,
						label: P(Y)("sampling.reasoning_effort")
					}, {
						default: F(() => [U("select", {
							class: "input",
							value: oe.value.reasoning_effort,
							onChange: r[14] ||= (e) => se("reasoning_effort", e.target.value)
						}, [(B(), V(z, null, R(D, (e) => U("option", {
							key: e,
							value: e
						}, A(P(Y)(`effort.${e}`)), 9, hS)), 64))], 40, mS)]),
						_: 1
					}, 8, ["label"])) : G("", !0)]),
					(B(), V(z, null, R(E, (e) => (B(), V(z, { key: e }, [O(e) ? (B(), H(Sx, {
						key: 0,
						label: P(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: F(() => [W(_x, {
							"model-value": !!oe.value[e],
							"onUpdate:modelValue": (t) => se(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : G("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), _S = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function vS(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: Y("config.transport"),
			options: t([..._s], (e) => Y(`transport.${e}`))
		},
		style: {
			kind: "enum",
			label: Y("um.var.style"),
			options: t(["dialogue", "imperative"], (e) => Y(`um.style.${e}`))
		},
		workflow: {
			kind: "enum",
			label: Y("config.workflow"),
			options: e.workflows.map((t) => ({
				value: t.id,
				label: Pu(e, "workflows", t.id, "name", t.name)
			}))
		},
		"gen.origin": {
			kind: "enum",
			label: Y("um.var.origin"),
			options: t(["story", "task"], (e) => Y(`um.origin.${e}`))
		},
		"gen.type": {
			kind: "enum",
			label: Y("um.var.genType"),
			options: t(_S, (e) => Y(`um.genType.${e}`))
		},
		"meta.present": {
			kind: "bool",
			label: Y("um.var.metaPresent")
		},
		"meta.pure": {
			kind: "bool",
			label: Y("um.var.metaPure")
		},
		"features.tokenSaving": {
			kind: "bool",
			label: Y("writing.tokenSaving")
		},
		"chat.group": {
			kind: "bool",
			label: Y("um.var.group")
		},
		"memory.hasChat": {
			kind: "bool",
			label: Y("um.var.hasChat")
		},
		"memory.hasGlobal": {
			kind: "bool",
			label: Y("um.var.hasGlobal")
		},
		"recap.present": {
			kind: "bool",
			label: Y("um.var.recap")
		}
	};
}
var yS = (e) => e.modules.filter((e) => e.toggle === "user");
function bS(e) {
	let t = vS(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return yS(e).length && r.push({
		id: "module",
		label: Y("um.var.module")
	}), e.params.length && r.push({
		id: "param",
		label: Y("um.var.param")
	}), [
		{
			label: Y("um.group.chat"),
			subjects: [{
				id: "keyword",
				label: Y("um.keyword")
			}, ...n([
				"chat.group",
				"memory.hasChat",
				"memory.hasGlobal",
				"recap.present"
			])]
		},
		{
			label: Y("um.group.generation"),
			subjects: n([
				"gen.type",
				"gen.origin",
				"meta.present",
				"meta.pure"
			])
		},
		{
			label: Y("um.group.preset"),
			subjects: [...r, ...n([
				"transport",
				"style",
				"workflow",
				"features.tokenSaving"
			])]
		},
		{
			label: Y("um.group.advanced"),
			subjects: [...e.regex.length ? [{
				id: "flag",
				label: Y("um.var.flag")
			}] : [], {
				id: "expr",
				label: Y("um.expr")
			}]
		}
	].filter((e) => e.subjects.length);
}
function xS(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function SS(e, t) {
	return t === "module" ? yS(e).map((t) => ({
		value: t.id,
		label: Pu(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Pu(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function CS(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: SS(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Pu(e, "params", t.id, "label", t.label) : r;
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
			label: wS(e, t.id, n.value, n.label)
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
	return vS(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var wS = (e, t, n, r) => Nu(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), TS = {
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
function ES(e, t) {
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
		let n = String(SS(e, t)[0]?.value ?? "");
		return DS(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return DS(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function DS(e, t, n) {
	let r = CS(e, n);
	return t.path && CS(e, t.path).kind === r.kind && TS[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function OS(e, t, n = "") {
	return e === "bool" ? Y(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "enum" ? Y(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var kS = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(Y("um.or")) : t === void 0 ? "" : n(t);
};
function AS(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? Y("um.kw.input") : Y("um.kw.recentN", { n: t.depth ?? 3 })} ${Y(`um.kw.${t.op}`)} ${t.words.join(Y("um.or"))}`;
	let n = CS(e, t.path);
	return n.kind === "bool" ? Y("um.boolDesc", {
		label: n.label,
		value: OS("bool", t.op, t.path)
	}) : `${n.label} ${OS(n.kind, t.op)} ${kS(n, t.value)}`;
}
function jS(e, t) {
	let n = t.rules.filter(kl);
	return n.length ? n.map((t) => AS(e, t)).join(t.match === "any" ? `\n${Y("um.match.anyJoin")} ` : `\n${Y("um.match.allJoin")} `) : Y("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var MS = ["data-id"], NS = ["aria-label", "onPointerdown"], PS = ["onClick"], FS = { class: "um-row-name ellipsis" }, IS = { class: "um-row-meta xs muted ellipsis" }, LS = {
	key: 2,
	class: "faint small"
}, RS = /* @__PURE__ */ L({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => pf(n.preset)), a = K(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Pu(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Pu(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => Bl(n.preset, e), u = (e) => Y("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(kl);
		function f(e, t) {
			e.enabled = t, J();
		}
		function m() {
			let e = _f(n.preset, Y("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		let h = /* @__PURE__ */ N(null);
		async function g(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let { added: e, missing: t } = Sf(n.preset, JSON.parse(await r.text()));
				p(t ? "warning" : "success", t ? Y("um.importedMissing", {
					n: e.length,
					missing: t
				}) : Y("um.imported", { n: e.length }));
			} catch (e) {
				p("error", Y("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let _ = () => rg(`${n.preset.id}.ap-modules.json`, xf(n.preset)), v = /* @__PURE__ */ N(null), y = /* @__PURE__ */ N(null);
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
			i.value[r]?.id !== t && bf(n.preset, t, r);
		}
		let S = () => {
			y.value = null;
		};
		return (t, n) => (B(), H(Lb, {
			title: P(Y)("um.title"),
			help: P(Y)("um.help")
		}, {
			actions: F(() => [
				a.value ? (B(), H($, {
					key: 0,
					icon: P(qy),
					label: P(Y)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => h.value?.click()
				}, null, 8, ["icon", "label"])) : G("", !0),
				i.value.length ? (B(), H($, {
					key: 1,
					icon: P(dy),
					label: P(Y)("um.exportAll"),
					small: "",
					align: "end",
					onClick: _
				}, null, 8, ["icon", "label"])) : G("", !0),
				a.value && i.value.length ? (B(), H($, {
					key: 2,
					icon: P(My),
					label: P(Y)("um.new"),
					small: "",
					align: "end",
					onClick: m
				}, null, 8, ["icon", "label"])) : G("", !0)
			]),
			default: F(() => [i.value.length ? (B(), V("div", {
				key: 0,
				ref_key: "listEl",
				ref: v,
				class: "um-list"
			}, [(B(!0), V(z, null, R(i.value, (t) => (B(), V("div", {
				key: t.id,
				class: k(["um-row", {
					off: !t.enabled,
					dragging: y.value === t.id
				}]),
				"data-id": t.id
			}, [
				i.value.length > 1 ? (B(), V("span", {
					key: 0,
					class: "um-grip",
					"aria-label": P(Y)("um.reorder"),
					onPointerdown: (e) => b(e, t.id),
					onPointermove: x,
					onPointerup: S,
					onPointercancel: S
				}, [W(P(vy))], 40, NS)) : G("", !0),
				U("button", {
					type: "button",
					class: "um-open",
					onClick: (e) => r("open", t.id)
				}, [U("span", FS, A(t.name || P(Y)("um.untitled")), 1), U("span", IS, A(c(t) || P(Y)("um.noEntries")), 1)], 8, PS),
				l(t).length ? (B(), H(Qy, {
					key: 1,
					text: u(t),
					align: "end"
				}, {
					default: F(() => [W(P(Gy), {
						class: "text-warning um-flag",
						tabindex: "0"
					})]),
					_: 1
				}, 8, ["text"])) : G("", !0),
				d(t) ? (B(), H(Qy, {
					key: 2,
					text: P(jS)(e.preset, t.trigger),
					align: "end"
				}, {
					default: F(() => [W(P(Zy), {
						class: "um-flag um-zap",
						tabindex: "0"
					})]),
					_: 1
				}, 8, ["text"])) : G("", !0),
				W(_x, {
					"model-value": t.enabled,
					label: t.name,
					"onUpdate:modelValue": (e) => f(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])
			], 10, MS))), 128))], 512)) : a.value ? (B(), V("button", {
				key: 1,
				type: "button",
				class: "um-new",
				onClick: m
			}, [W(P(My)), ua(A(P(Y)("um.new")), 1)])) : (B(), V("div", LS, A(P(Y)("um.noPoints")), 1)), U("input", {
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
}), zS = { class: "ellipsis" }, BS = ["aria-label", "onClick"], VS = ["placeholder"], HS = /* @__PURE__ */ L({
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
		let t = ai(e, "modelValue"), n = e, r = /* @__PURE__ */ N(""), i = /* @__PURE__ */ N(null);
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
		return (n, l) => (B(), V("div", {
			class: "chips-input input",
			onClick: l[2] ||= (e) => i.value?.focus()
		}, [(B(!0), V(z, null, R(t.value, (t, n) => (B(), V("span", {
			key: t,
			class: k(["chip", { mono: e.mono }])
		}, [U("span", zS, A(t), 1), U("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: os((e) => c(n), ["stop"])
		}, [W(P(Xy))], 8, BS)], 2))), 128)), I(U("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: k(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, VS), [[Xo, r.value]])]));
	}
}), US = { class: "rule" }, WS = { class: "rule-head" }, GS = ["value", "aria-label"], KS = ["label"], qS = ["value"], JS = ["value"], YS = ["value"], XS = ["value"], ZS = ["value"], QS = {
	key: 1,
	class: "grow"
}, $S = {
	key: 0,
	class: "rule-body"
}, eC = { class: "row wrap" }, tC = {
	key: 0,
	class: "unit small muted"
}, nC = ["value"], rC = ["value"], iC = { value: "any" }, aC = { value: "none" }, oC = { class: "row kw-words" }, sC = {
	key: 1,
	class: "rule-body"
}, cC = ["value"], lC = {
	key: 2,
	class: "rule-body"
}, uC = ["value"], dC = ["value"], fC = { class: "row wrap option-chips" }, pC = ["aria-pressed", "onClick"], mC = {
	key: 2,
	class: "row"
}, hC = ["value"], gC = ["value"], _C = ["value"], vC = ["list", "value"], yC = ["value"], bC = {
	key: 3,
	class: "rule-error xs"
}, xC = /* @__PURE__ */ L({
	__name: "RuleRow",
	props: /*@__PURE__*/ ei({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ei(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = ai(e, "modelValue"), r = K(() => bS(t.preset)), i = K(() => xS(n.value)), a = K(() => SS(t.preset, i.value)), o = K(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = K(() => n.value.kind === "var" ? CS(t.preset, n.value.path) : null), c = K(() => Fl(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = ES(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = DS(t.preset, r, `${i}.${e}`);
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
		}, m = K(() => {
			let e = n.value.value;
			return (Array.isArray(e) ? e : []).map(String);
		});
		function h(e) {
			let t = n.value.value, r = Array.isArray(t) ? [...t] : [], i = r.findIndex((t) => String(t) === String(e));
			i >= 0 ? r.splice(i, 1) : r.push(e), f({ value: r });
		}
		let g = K(() => TS.bool.map((e) => ({
			value: e,
			label: OS("bool", e, n.value.path)
		}))), _ = K(() => (s.value ? TS[s.value.kind] : []).map((e) => ({
			value: e,
			label: OS(s.value.kind, e)
		}))), v = K({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), y = K(() => [{
			value: "input",
			label: Y("um.kw.input")
		}, {
			value: "recent",
			label: Y("um.kw.recent")
		}]);
		return (e, t) => (B(), V("div", US, [
			U("div", WS, [
				U("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": P(Y)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(B(!0), V(z, null, R(r.value, (e) => (B(), V("optgroup", {
					key: e.label,
					label: e.label
				}, [(B(!0), V(z, null, R(e.subjects, (e) => (B(), V("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, qS))), 128))], 8, KS))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (B(), V("option", {
					key: 0,
					value: i.value
				}, A(n.value.path), 9, JS)) : G("", !0)], 40, GS),
				a.value.length ? (B(), V("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(B(!0), V(z, null, R(a.value, (e) => (B(), V("option", {
					key: String(e.value),
					value: e.value
				}, A(e.label), 9, XS))), 128)), a.value.some((e) => String(e.value) === o.value) ? G("", !0) : (B(), V("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, A(o.value), 9, ZS))], 40, YS)) : (B(), V("span", QS)),
				W($, {
					icon: P(Xy),
					label: P(Y)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (B(), V("div", $S, [U("div", eC, [
				W(Yx, {
					modelValue: v.value,
					"onUpdate:modelValue": t[3] ||= (e) => v.value = e,
					class: "rule-scope",
					options: y.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (B(), V("label", tC, [U("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? P(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, nC), ua(" " + A(P(Y)("um.kw.messages")), 1)])) : G("", !0),
				U("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [U("option", iC, A(P(Y)("um.kw.any")), 1), U("option", aC, A(P(Y)("um.kw.none")), 1)], 40, rC)
			]), U("div", oC, [W(HS, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": P(Y)("common.delete"),
				placeholder: n.value.regex ? P(Y)("um.kw.regexPlaceholder") : P(Y)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), W($, {
				icon: P(Fy),
				label: P(Y)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (B(), V("div", sC, [U("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, cC)])) : s.value ? (B(), V("div", lC, [s.value.kind === "bool" ? (B(), H(Yx, {
				key: 0,
				"model-value": n.value.op,
				options: g.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (B(), V(z, { key: 1 }, [U("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(B(!0), V(z, null, R(_.value, (e) => (B(), V("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, dC))), 128))], 40, uC), U("div", fC, [(B(!0), V(z, null, R(s.value.options, (e) => (B(), V("button", {
				key: String(e.value),
				type: "button",
				class: k(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, A(e.label), 11, pC))), 128))])], 64)) : (B(), V("div", mC, [U("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(B(!0), V(z, null, R(_.value, (e) => (B(), V("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, gC))), 128))], 40, hC), s.value.kind === "number" ? (B(), V("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, _C)) : (B(), V(z, { key: 1 }, [U("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, vC), s.value.suggestions?.length ? (B(), V("datalist", {
				key: 0,
				id: l
			}, [(B(!0), V(z, null, R(s.value.suggestions, (e) => (B(), V("option", {
				key: e,
				value: e
			}, null, 8, yC))), 128))])) : G("", !0)], 64))]))])) : G("", !0),
			c.value ? (B(), V("div", bC, A(c.value), 1)) : G("", !0)
		]));
	}
}), SC = { class: "trigger" }, CC = {
	key: 1,
	class: "always faint small"
}, wC = {
	key: 0,
	class: "rule-join xs faint"
}, TC = { class: "btn ghost add picker" }, EC = ["aria-label"], DC = ["label"], OC = ["value"], kC = /* @__PURE__ */ L({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ei({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = ai(e, "modelValue"), r = K(() => bS(t.preset)), i = /* @__PURE__ */ N(null), a = K(() => [{
			value: "all",
			label: Y("um.match.all")
		}, {
			value: "any",
			label: Y("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(ES(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (B(), V("div", SC, [
			n.value.rules.length > 1 ? (B(), H(Yx, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : G("", !0),
			n.value.rules.length ? G("", !0) : (B(), V("div", CC, A(P(Y)("um.always")), 1)),
			(B(!0), V(z, null, R(n.value.rules, (t, r) => (B(), V(z, { key: r }, [r > 0 ? (B(), V("div", wC, A(n.value.match === "any" ? P(Y)("um.match.anyJoin") : P(Y)("um.match.allJoin")), 1)) : G("", !0), W(xC, {
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
			U("label", TC, [
				W(P(My)),
				ua(A(P(Y)("um.addRule")) + " ", 1),
				U("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": P(Y)("um.addRule"),
					onChange: l[1] ||= (e) => o(e.target.value)
				}, [l[2] ||= U("option", {
					value: "",
					disabled: "",
					selected: "",
					hidden: ""
				}, null, -1), (B(!0), V(z, null, R(r.value, (e) => (B(), V("optgroup", {
					key: e.label,
					label: e.label
				}, [(B(!0), V(z, null, R(e.subjects, (e) => (B(), V("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, OC))), 128))], 8, DC))), 128))], 40, EC)
			])
		]));
	}
}), AC = { class: "um-entry-head" }, jC = { class: "um-var-label grow ellipsis" }, MC = {
	key: 0,
	class: "um-warn xs"
}, NC = ["placeholder"], PC = ["onUpdate:modelValue", "placeholder"], FC = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], IC = [
	"value",
	"placeholder",
	"onInput"
], LC = ["id"], RC = ["value"], zC = /* @__PURE__ */ L({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = K(() => Rl(n.preset, n.update.var)), a = K(() => i.value?.type !== n.update.type), o = K(() => i.value ? Pu(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = K(() => i.value && Pu(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = K(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = K(() => `ap-bv-${n.update.var}`);
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
		return (t, n) => (B(), V("div", { class: k(["um-entry", { lost: a.value }]) }, [
			U("div", AC, [
				W(P(Yv), { class: "faint" }),
				U("span", jC, A(o.value), 1),
				W(Pb, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				W($, {
					icon: P(Xy),
					label: P(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (B(), V("div", MC, [W(P(Gy)), ua(A(P(Y)("um.bv.lost")), 1)])) : G("", !0),
			e.update.type === "string" ? I((B(), V("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: P(Y)("um.bv.append")
			}, null, 8, NC)), [[Xo, e.update.text]]) : e.update.type === "list" ? (B(!0), V(z, { key: 2 }, R(e.update.items, (t, n) => (B(), V("div", {
				key: n,
				class: "um-var-row list"
			}, [I(U("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: P(Y)("um.bv.item")
			}, null, 8, PC), [[Xo, e.update.items[n]]]), W($, {
				icon: P(Xy),
				label: P(Y)("um.removeEntry"),
				small: "",
				align: "end",
				onClick: (t) => e.update.items.splice(n, 1)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])]))), 128)) : (B(), V(z, { key: 3 }, [(B(!0), V(z, null, R(e.update.items, (t, n) => (B(), V("div", {
				key: n,
				class: "um-var-row"
			}, [
				I(U("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: P(Y)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, FC), [[Xo, t.key]]),
				U("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? P(Y)("um.bv.removes") : P(Y)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, IC),
				W($, {
					icon: P(Xy),
					label: P(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]))), 128)), U("datalist", { id: l.value }, [(B(!0), V(z, null, R(c.value, ([e]) => (B(), V("option", {
				key: e,
				value: e
			}, null, 8, RC))), 128))], 8, LC)], 64)),
			e.update.type === "string" ? G("", !0) : (B(), V("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [W(P(My)), ua(A(e.update.type === "dict" ? P(Y)("um.bv.addKey") : P(Y)("um.bv.addItem")), 1)]))
		], 2));
	}
}), BC = { class: "um-editor" }, VC = { class: "um-head" }, HC = ["placeholder", "aria-label"], UC = { class: "um-entry-head" }, WC = ["onUpdate:modelValue", "aria-label"], GC = ["value"], KC = ["value"], qC = [
	"value",
	"aria-label",
	"onChange"
], JC = ["value"], YC = {
	key: 0,
	class: "um-warn xs"
}, XC = ["onUpdate:modelValue", "placeholder"], ZC = {
	key: 1,
	class: "rule-error xs pre"
}, QC = {
	key: 0,
	class: "btn ghost add picker"
}, $C = ["aria-label"], ew = ["value"], tw = { class: "um-foot" }, nw = ["title"], rw = ["title"], iw = ["title"], aw = /* @__PURE__ */ L({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		or(() => n.module, J, { deep: !0 });
		let i = /* @__PURE__ */ N(null);
		Rr(() => {
			n.module.entries.some((e) => e.text) || Bn(() => i.value?.select());
		});
		let a = K(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Pu(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Pu(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !Il(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => Cl(e.text).errors, d = (e) => u(e).map((e) => e.line ? Y("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = gf(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = K(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Pu(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = K(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ N(null);
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
		let v = /* @__PURE__ */ N(!1);
		function y() {
			v.value ? (yf(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = vf(n.preset, n.module.id, (e) => Y("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => rg(`${n.preset.id}.${ig(n.module.name)}.ap-modules.json`, xf(n.preset, [n.module.id]));
		return (t, n) => (B(), V("div", BC, [
			U("header", VC, [
				W($, {
					icon: P(Kv),
					label: P(Y)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				I(U("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: P(Y)("um.untitled"),
					"aria-label": P(Y)("um.name")
				}, null, 8, HC), [[Xo, e.module.name]]),
				W(_x, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: P(Y)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			W(Lb, {
				title: P(Y)("um.content"),
				help: P(Y)("um.content.help")
			}, {
				default: F(() => [(B(!0), V(z, null, R(e.module.entries, (t, n) => (B(), V("div", {
					key: t.id,
					class: k(["um-entry", { lost: s(t) }])
				}, [
					U("div", UC, [
						W(P(Cy), { class: "faint" }),
						I(U("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": P(Y)("um.point")
						}, [(B(!0), V(z, null, R(a.value, (e) => (B(), V("option", {
							key: e.id,
							value: e.id
						}, A(e.label), 9, GC))), 128)), s(t) ? (B(), V("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, A(P(Y)("um.pointMissing", { id: t.point })), 9, KC)) : G("", !0)], 8, WC), [[$o, t.point]]),
						W(Pb, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						U("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": P(Y)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(B(), V(z, null, R(c, (e) => U("option", {
							key: e,
							value: e
						}, A(P(Y)(`um.role.${e || "merge"}`)), 9, JC)), 64))], 40, qC),
						e.module.entries.length > 1 || e.module.vars.length ? (B(), H($, {
							key: 0,
							icon: P(Xy),
							label: P(Y)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : G("", !0)
					]),
					s(t) ? (B(), V("div", YC, [W(P(Gy)), ua(A(P(Y)("um.pointLost")), 1)])) : G("", !0),
					I(U("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: P(Y)("um.text.placeholder")
					}, null, 8, XC), [[Xo, t.text]]),
					u(t).length ? (B(), V("div", ZC, A(d(t)), 1)) : G("", !0)
				], 2))), 128)), a.value.length ? (B(), V("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [W(P(My)), ua(A(P(Y)("um.addEntry")), 1)])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (B(), H(Lb, {
				key: 0,
				title: P(Y)("um.bv"),
				help: P(Y)("um.bv.help")
			}, {
				default: F(() => [(B(!0), V(z, null, R(e.module.vars, (t, n) => (B(), H(zC, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (B(), V("label", QC, [
					W(P(My)),
					ua(A(P(Y)("um.bv.add")) + " ", 1),
					U("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": P(Y)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= U("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (B(!0), V(z, null, R(h.value, (e) => (B(), V("option", {
						key: e.id,
						value: e.id
					}, A(e.label), 9, ew))), 128))], 40, $C)
				])) : G("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : G("", !0),
			W(Lb, {
				title: P(Y)("um.trigger"),
				help: P(Y)("um.trigger.help")
			}, {
				default: F(() => [W(kC, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			U("footer", tw, [
				U("button", {
					type: "button",
					class: "btn ghost",
					title: P(Y)("um.export"),
					onClick: x
				}, [W(P(dy)), U("span", null, A(P(Y)("um.export")), 1)], 8, nw),
				U("button", {
					type: "button",
					class: "btn ghost",
					title: P(Y)("um.duplicate"),
					onClick: b
				}, [W(P(cy)), U("span", null, A(P(Y)("um.duplicate")), 1)], 8, rw),
				n[6] ||= U("span", { class: "grow" }, null, -1),
				U("button", {
					type: "button",
					class: k(["btn ghost danger", { armed: v.value }]),
					title: P(Y)("common.delete"),
					onClick: y
				}, [W(P(Wy)), U("span", null, A(v.value ? P(Y)("um.confirmDelete") : P(Y)("common.delete")), 1)], 10, iw)
			])
		]));
	}
}), ow = {
	key: 0,
	class: "module-row"
}, sw = { class: "grow" }, cw = { class: "ellipsis" }, lw = ["aria-label"], uw = ["aria-checked", "onClick"], dw = { class: "grow" }, fw = { class: "grow" }, pw = { class: "ellipsis" }, mw = {
	key: 0,
	class: "empty"
}, hw = /* @__PURE__ */ L({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Wx(), i = K(() => t.value && n.value ? Yc(t.value, n.value) : {}), a = K(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = qc(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Pu(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Pu(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Pu(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && Pu(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Pu(t.value, "modules", e.id, "name", e.name), s = (e) => Pu(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ N(null), g = /* @__PURE__ */ N(null), _ = K(() => t.value && h.value ? pf(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Bn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Bn(() => y()?.scrollTo({ top: v }));
		}
		return or(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !P(t) || !P(n) ? (B(), H(Kx, { key: 0 })) : _.value ? (B(), V("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(B(), H(aw, {
			key: _.value.id,
			preset: P(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (B(), V("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			W(RS, {
				preset: P(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(B(!0), V(z, null, R(a.value, (e) => (B(), H(Lb, {
				key: e.id,
				title: e.label,
				help: e.help
			}, Kr({
				default: F(() => [(B(!0), V(z, null, R(e.sets, (t) => (B(), V(z, { key: t.key }, [t.label ? (B(), V("div", ow, [U("span", sw, [U("span", cw, A(t.label), 1), W(Pb, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (B(), H(_x, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : G("", !0)])) : G("", !0), !t.optional || c(t) ? (B(), V("div", {
					key: 1,
					class: k(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(B(!0), V(z, null, R(t.modules, (e) => (B(), V("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: k(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= U("span", { class: "radio" }, null, -1),
					U("span", dw, A(o(e)), 1),
					W(Pb, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, uw))), 128))], 10, lw)) : G("", !0)], 64))), 128)), (B(!0), V(z, null, R(e.toggles, (e) => (B(), V("div", {
					key: e.id,
					class: "module-row"
				}, [U("span", fw, [U("span", pw, A(o(e)), 1), W(Pb, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), W(_x, {
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
				fn: F(() => [W(_x, {
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
			a.value.length ? G("", !0) : (B(), V("div", mw, A(P(Y)("modules.none")), 1))
		], 512));
	}
}), gw = ["value", "onChange"], _w = ["value"], vw = {
	key: 1,
	class: "unit"
}, yw = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], bw = {
	key: 0,
	class: "small muted"
}, xw = [
	"list",
	"value",
	"placeholder",
	"onChange"
], Sw = ["id"], Cw = ["value"], ww = [
	"value",
	"placeholder",
	"onChange"
], Tw = [
	"value",
	"placeholder",
	"onChange"
], Ew = ["value"], Dw = ["value"], Ow = ["value"], kw = ["value"], Aw = ["value"], jw = /* @__PURE__ */ L({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = Wx(), i = K(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Pu(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && Pu(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Pu(t.value, "params", e.id, "label", e.label), o = (e) => Pu(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Nu(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => n.value?.params[e.id] ?? e.default, l = (e, t) => r((n) => {
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
		}), m = K(() => xs.map((e) => ({
			value: e,
			label: Y(`writing.userInput.${e}`),
			hint: Y(`writing.userInput.${e}.hint`)
		}))), h = K({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), g = K({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), _ = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), v = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), y = (e) => `ap-param-${e.id}`;
		return (e, r) => !P(t) || !P(n) ? (B(), H(Kx, { key: 0 })) : (B(), V(z, { key: 1 }, [
			(B(!0), V(z, null, R(i.value, (e) => (B(), H(Lb, {
				key: e.id,
				title: e.label,
				help: e.help,
				icon: P(Hy)
			}, {
				default: F(() => [(B(!0), V(z, null, R(e.params, (e) => (B(), H(Sx, {
					key: e.id,
					label: a(e),
					help: o(e)
				}, {
					default: F(() => [e.type === "select" ? (B(), V("select", {
						key: 0,
						class: "input",
						value: c(e),
						onChange: (t) => l(e, t.target.value)
					}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
						key: String(t.value),
						value: t.value
					}, A(s(e, t.value, t.label)), 9, _w))), 128))], 40, gw)) : e.type === "number" ? (B(), V("div", vw, [U("input", {
						class: "input",
						type: "number",
						min: e.min,
						max: e.max,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, yw), e.unit ? (B(), V("span", bw, A(e.unit), 1)) : G("", !0)])) : (B(), V(z, { key: 2 }, [U("input", {
						class: "input",
						list: e.options?.length ? y(e) : void 0,
						value: c(e),
						placeholder: e.unset,
						onChange: (t) => l(e, t.target.value)
					}, null, 40, xw), e.options?.length ? (B(), V("datalist", {
						key: 0,
						id: y(e)
					}, [(B(!0), V(z, null, R(e.options, (t) => (B(), V("option", {
						key: String(t.value),
						value: t.value
					}, A(s(e, t.value, t.label)), 9, Cw))), 128))], 8, Sw)) : G("", !0)], 64))]),
					_: 2
				}, 1032, ["label", "help"]))), 128))]),
				_: 2
			}, 1032, [
				"title",
				"help",
				"icon"
			]))), 128)),
			W(Lb, {
				title: P(Y)("writing.actors"),
				icon: P(fy),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(B(!0), V(z, null, R(u.value, ([e, t]) => (B(), V("div", {
					key: e,
					class: "field-grid"
				}, [W(Sx, { label: P(Y)("writing.actorName", { actor: e }) }, {
					default: F(() => [U("input", {
						class: "input",
						value: P(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => d("names", e, t.target.value)
					}, null, 40, ww)]),
					_: 2
				}, 1032, ["label"]), W(Sx, { label: P(Y)("writing.actorPrefix") }, {
					default: F(() => [U("input", {
						class: "input",
						value: P(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => d("prefixes", e, t.target.value)
					}, null, 40, Tw)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lb, {
				title: P(Y)("writing.tokenSaving"),
				icon: P(sy),
				help: P(Y)("writing.tokenSaving.hint")
			}, {
				actions: F(() => [W(_x, {
					modelValue: f.value,
					"onUpdate:modelValue": r[0] ||= (e) => f.value = e,
					label: P(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [f.value ? (B(), V(z, { key: 0 }, [
					W(Sx, {
						label: P(Y)("writing.keepFullTurns"),
						help: P(Y)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.keepFullTurns,
							onChange: r[1] ||= (e) => p("keepFullTurns", e.target.value)
						}, null, 40, Ew)]),
						_: 1
					}, 8, ["label", "help"]),
					W(Sx, {
						label: P(Y)("writing.userInput"),
						help: P(Y)("writing.userInput.hint")
					}, {
						default: F(() => [W(Yx, {
							modelValue: h.value,
							"onUpdate:modelValue": r[2] ||= (e) => h.value = e,
							options: m.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					h.value === "truncate" ? (B(), H(Sx, {
						key: 0,
						label: P(Y)("writing.truncateUserAfter"),
						help: P(Y)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: F(() => [U("input", {
							class: "input",
							type: "number",
							min: "0",
							value: P(n).tokenSaving.truncateUserAfter,
							onChange: r[3] ||= (e) => p("truncateUserAfter", e.target.value)
						}, null, 40, Dw)]),
						_: 1
					}, 8, ["label", "help"])) : G("", !0)
				], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lb, {
				title: P(Y)("writing.cache"),
				icon: P(uy),
				help: P(Y)("writing.cache.hint")
			}, {
				actions: F(() => [W(_x, {
					modelValue: g.value,
					"onUpdate:modelValue": r[4] ||= (e) => g.value = e,
					label: P(Y)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: F(() => [g.value ? (B(), V(z, { key: 0 }, [W(Sx, {
					label: P(Y)("writing.cacheTtl"),
					help: P(Y)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.ttlMinutes,
						onChange: r[5] ||= (e) => _("ttlMinutes", e.target.value)
					}, null, 40, Ow)]),
					_: 1
				}, 8, ["label", "help"]), W(Sx, {
					label: P(Y)("writing.cacheMaxDeferred"),
					help: P(Y)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						value: P(n).cache.maxDeferredTurns,
						onChange: r[6] ||= (e) => _("maxDeferredTurns", e.target.value)
					}, null, 40, kw)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lb, {
				title: P(Y)("writing.meta"),
				icon: P(Ey)
			}, {
				default: F(() => [W(Sx, {
					label: P(Y)("writing.recentCount"),
					help: P(Y)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: F(() => [U("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: P(n).meta.recentCount,
						onChange: r[7] ||= (e) => v(e.target.value)
					}, null, 40, Aw)]),
					_: 1
				}, 8, ["label", "help"])]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), Mw = { class: "kv" }, Nw = {
	key: 0,
	class: "kv-row"
}, Pw = { class: "kv-key ellipsis" }, Fw = { class: "kv-value pre small" }, Iw = {
	key: 0,
	class: "kv-actions"
}, Lw = {
	key: 1,
	class: "kv-edit col"
}, Rw = ["placeholder"], zw = ["placeholder"], Bw = { class: "row end" }, Vw = {
	key: 0,
	class: "kv-edit col"
}, Hw = ["placeholder"], Uw = ["placeholder"], Ww = { class: "row end" }, Gw = {
	key: 1,
	class: "faint small kv-empty"
}, Kw = /* @__PURE__ */ L({
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
		return (t, n) => (B(), V("div", Mw, [
			(B(!0), V(z, null, R(e.entries, (t, l) => (B(), V(z, { key: l }, [i.value === l ? (B(), V("div", Lw, [
				I(U("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(Y)("memory.key")
				}, null, 8, Rw), [[Xo, a.value]]),
				I(U("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(Y)("memory.content")
				}, null, 8, zw), [[Xo, o.value]]),
				U("div", Bw, [W($, {
					icon: P(Xy),
					label: P(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: P($v),
					label: P(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (B(), V("div", Nw, [
				U("div", Pw, A(l), 1),
				U("div", Fw, A(t), 1),
				e.readonly ? G("", !0) : (B(), V("div", Iw, [W($, {
					icon: P(jy),
					label: P(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), W($, {
					icon: P(Wy),
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
			i.value === "" ? (B(), V("div", Vw, [
				I(U("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: P(Y)("memory.key")
				}, null, 8, Hw), [[Xo, a.value]]),
				I(U("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: P(Y)("memory.content")
				}, null, 8, Uw), [[Xo, o.value]]),
				U("div", Ww, [W($, {
					icon: P(Xy),
					label: P(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), W($, {
					icon: P($v),
					label: P(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : G("", !0),
			!Object.keys(e.entries).length && i.value === null ? (B(), V("div", Gw, A(P(Y)("memory.empty")), 1)) : G("", !0),
			!e.readonly && i.value === null ? (B(), V("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [W(P(My)), ua(A(P(Y)("common.add")), 1)])) : G("", !0)
		]));
	}
}), qw = {
	key: 1,
	class: "faint small"
}, Jw = {
	key: 0,
	class: "badge neutral"
}, Yw = ["placeholder"], Xw = {
	key: 1,
	class: "faint small"
}, Zw = /* @__PURE__ */ L({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = Wx(), r = K(() => n.value ? ld(n.value) : null), i = K(() => (ag.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = K(() => (ag.chatRev, i.value ? Xu() : {})), o = K(() => r.value ? $u(r.value) : {}), s = K(() => (ag.chatRev, i.value ? Zu() : null));
		async function c(e, t) {
			await Qu({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), og();
		}
		async function l(e) {
			await Qu({
				type: "memory.delete",
				key: e,
				source: "user"
			}), og();
		}
		let u = (e, t) => r.value && ed(r.value, "replace", e, t, "user"), d = (e) => r.value && ed(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ N("");
		or(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = K(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Qu({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), og();
		}
		return (e, t) => !P(n) || !r.value ? (B(), H(Kx, { key: 0 })) : (B(), V(z, { key: 1 }, [
			W(Lb, {
				title: P(Y)("memory.chat"),
				icon: P(wy),
				help: P(Y)("memory.chat.hint")
			}, {
				default: F(() => [i.value ? (B(), H(Kw, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (B(), V("div", qw, A(P(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lb, {
				title: P(Y)("memory.global"),
				icon: P(_y),
				help: P(Y)("memory.global.hint")
			}, {
				actions: F(() => [W($, {
					icon: P(Ky),
					label: P(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !P(td)(r.value),
					onClick: t[0] ||= (e) => P(rd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), W($, {
					icon: P(Ny),
					label: P(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !P(nd)(r.value),
					onClick: t[1] ||= (e) => P(id)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: F(() => [W(Kw, {
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
			W(Lb, {
				title: P(Y)("memory.recap"),
				icon: P(Ry),
				help: P(Y)("memory.recap.hint")
			}, {
				actions: F(() => [s.value ? (B(), V("span", Jw, "#0–" + A(s.value.coversUpTo), 1)) : G("", !0), i.value ? (B(), H($, {
					key: 1,
					icon: P($v),
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
				])) : G("", !0)]),
				default: F(() => [i.value ? I((B(), V("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: P(Y)("memory.recap.empty")
				}, null, 8, Yw)), [[Xo, f.value]]) : (B(), V("div", Xw, A(P(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), Qw = { class: "row tight xs muted" }, $w = { class: "row" }, eT = {
	key: 0,
	class: "xs text-danger"
}, tT = { class: "row wrap xs muted" }, nT = { class: "badge neutral" }, rT = {
	key: 0,
	class: "badge neutral"
}, iT = { class: "badge neutral" }, aT = {
	key: 1,
	class: "badge warn"
}, oT = {
	key: 0,
	class: "row wrap xs muted"
}, sT = { class: "grow" }, cT = { key: 0 }, lT = ["onClick"], uT = { class: "grow mono" }, dT = { class: "xs muted" }, fT = { class: "row xs muted" }, pT = { class: "badge neutral" }, mT = { class: "pre mono scroll" }, hT = {
	key: 0,
	class: "xs faint region-msg"
}, gT = { key: 1 }, _T = ["onClick"], vT = { class: "grow mono" }, yT = { class: "xs muted" }, bT = {
	key: 0,
	class: "region-msg"
}, xT = { class: "pre mono scroll" }, ST = {
	key: 0,
	class: "xs faint"
}, CT = {
	key: 2,
	class: "xs text-warning"
}, wT = {
	key: 1,
	class: "faint small"
}, TT = ["onClick"], ET = { class: "mono grow ellipsis" }, DT = {
	key: 0,
	class: "badge warn"
}, OT = { class: "xs muted" }, kT = { class: "xs muted" }, AT = { class: "row xs muted" }, jT = { class: "grow" }, MT = { class: "mono scroll" }, NT = { class: "row xs muted" }, PT = { class: "grow" }, FT = { class: "mono scroll" }, IT = {
	key: 0,
	class: "faint small"
}, LT = { class: "row xs" }, RT = { class: "badge neutral" }, zT = { class: "muted" }, BT = { class: "mono scroll" }, VT = {
	key: 0,
	class: "faint small"
}, HT = { class: "row xs" }, UT = { class: "badge neutral" }, WT = { class: "grow muted" }, GT = { class: "small" }, KT = {
	key: 0,
	class: "faint small"
}, qT = { class: "xs faint mono build" }, JT = /* @__PURE__ */ L({
	__name: "DebugTab",
	setup(t) {
		let n = K(() => Kf.log.find((e) => e.kind === "assembly")?.data), r = K(() => Kf.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ nn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ nn({});
		or(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (o[i] === void 0 && r) try {
					o[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let s = /* @__PURE__ */ N(null), c = (e) => typeof e == "string" ? l(e) : JSON.stringify(e, null, 2);
		function l(e) {
			try {
				return JSON.stringify(JSON.parse(e), null, 2);
			} catch {
				return e;
			}
		}
		let u = (e) => new Date(e).toLocaleTimeString(), d = (e) => navigator.clipboard?.writeText(c(e)), f = (e) => {
			let t = e;
			if (!t) return "";
			let n = t.prompt_tokens ?? t.input_tokens ?? t.promptTokenCount, r = t.completion_tokens ?? t.output_tokens ?? t.candidatesTokenCount;
			if (n === void 0 && r === void 0) return "";
			let i = e.prompt_tokens_details?.cached_tokens ?? t.prompt_cache_hit_tokens ?? t.cache_read_input_tokens ?? t.cachedContentTokenCount;
			return `${n ?? "?"} → ${r ?? "?"}` + (i ? ` · ${Y("debug.cached", { n: i })}` : "");
		}, p = (e) => [
			Y("debug.cache.stats", {
				sticky: e.sticky,
				fresh: e.fresh
			}),
			e.postponed ? Y("debug.cache.postponed", {
				n: e.postponed,
				d: e.deferred,
				max: e.maxDeferredTurns || "∞"
			}) : "",
			e.unmatched ? Y("debug.cache.unmatched", { n: e.unmatched }) : ""
		].filter(Boolean).join(" · "), m = K({
			get: () => q().dev.enabled,
			set: (e) => {
				q().dev.enabled = e, J();
			}
		}), h = K({
			get: () => q().dev.url,
			set: (e) => {
				q().dev.url = e.trim(), J();
			}
		}), g = K(() => Kf.log.filter((e) => e.kind !== "assembly")), _ = K(() => {
			ag.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of kh(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (B(), V(z, null, [
			W(Lb, {
				title: P(Y)("debug.dev"),
				icon: P(zy),
				help: P(Y)("debug.dev.hint")
			}, {
				actions: F(() => [U("span", Qw, [U("span", { class: k(["dot status-dot", P(Bh).status]) }, null, 2), ua(A(P(Y)(`debug.dev.${P(Bh).status}`)), 1)])]),
				default: F(() => [W(Sx, { label: P(Y)("debug.dev.url") }, {
					default: F(() => [U("div", $w, [I(U("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Xo,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), W(_x, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: P(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), P(Bh).error ? (B(), V("span", eT, A(P(Bh).error), 1)) : G("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W(Lb, {
				title: P(Y)("debug.assembly"),
				icon: P(my),
				collapsible: ""
			}, {
				default: F(() => [n.value ? (B(), V(z, { key: 0 }, [
					U("div", tT, [
						U("span", nT, A(P(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (B(), V("span", rT, A(n.value.workflow), 1)) : G("", !0),
						U("span", iT, A(n.value.origin), 1),
						n.value.dryRun ? (B(), V("span", aT, "dry run")) : G("", !0),
						t[3] ||= U("span", { class: "grow" }, null, -1),
						ua(A(u(n.value.at)), 1)
					]),
					r.value ? (B(), V("div", oT, [
						U("span", { class: k(["badge", r.value.reason ? "warn" : "neutral"]) }, A(r.value.reason ? P(Y)(`debug.cache.flush.${r.value.reason}`) : P(Y)("debug.cache.kept")), 3),
						U("span", sT, A(p(r.value)), 1),
						r.value === n.value.cache ? G("", !0) : (B(), V("span", cT, A(u(r.value.at)), 1))
					])) : G("", !0),
					U("div", null, [(B(!0), V(z, null, R(n.value.regions, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						W(P(ty), { class: k(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						U("span", uT, A(e.id), 1),
						U("span", dT, A(e.messages.length) + " · " + A(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + A(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, lT), i.has(e.id) ? (B(), V(z, { key: 0 }, [(B(!0), V(z, null, R(e.messages, (e, t) => (B(), V("div", {
						key: t,
						class: "region-msg"
					}, [U("div", fT, [U("span", pT, A(e.role), 1), ua(A(e.chars) + " ch", 1)]), U("div", mT, A(e.content), 1)]))), 128)), e.messages.length ? G("", !0) : (B(), V("div", hT, A(P(Y)("debug.emptyRegion")), 1))], 64)) : G("", !0)]))), 128))]),
					n.value.vars?.length ? (B(), V("div", gT, [(B(!0), V(z, null, R(n.value.vars, (e) => (B(), V("div", {
						key: e.id,
						class: "region"
					}, [U("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						W(P(ty), { class: k(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						U("span", vT, A(e.id), 1),
						U("span", yT, A(e.text.length) + " ch", 1)
					], 8, _T), i.has(`var:${e.id}`) ? (B(), V("div", bT, [U("div", xT, A(e.text), 1), e.text ? G("", !0) : (B(), V("div", ST, A(P(Y)("debug.emptyRegion")), 1))])) : G("", !0)]))), 128))])) : G("", !0),
					n.value.warnings.length ? (B(), V("div", CT, A(n.value.warnings.join(" · ")), 1)) : G("", !0)
				], 64)) : (B(), V("div", wT, A(P(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lb, {
				title: P(Y)("debug.requests"),
				icon: P(oy),
				collapsible: ""
			}, {
				default: F(() => [(B(!0), V(z, null, R(P(Kf).requests, (e, t) => (B(), V("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [U("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					U("span", ET, A(e.genId) + " · #" + A(e.step), 1),
					e.error ? (B(), V("span", DT, A(P(Y)("debug.error")), 1)) : G("", !0),
					U("span", OT, A(f(e.usage)), 1),
					U("span", kT, A(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, TT), s.value === t ? (B(), V(z, { key: 0 }, [
					U("div", AT, [U("span", jT, A(P(Y)("debug.request")), 1), W($, {
						icon: P(ly),
						label: P(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", MT, A(c(e.request)), 1),
					U("div", NT, [U("span", PT, A(P(Y)("debug.response")), 1), W($, {
						icon: P(ly),
						label: P(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					U("pre", FT, A(e.error ?? c(e.response ?? "")), 1)
				], 64)) : G("", !0)]))), 128)), P(Kf).requests.length ? G("", !0) : (B(), V("div", IT, A(P(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lb, {
				title: P(Y)("debug.log"),
				icon: P(Ry),
				collapsible: "",
				open: !1
			}, {
				actions: F(() => [W($, {
					icon: P(Wy),
					label: P(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => P(Kf).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: F(() => [(B(!0), V(z, null, R(g.value, (e, n) => (B(), V("div", {
					key: n,
					class: "req"
				}, [U("div", LT, [
					U("span", RT, A(e.kind), 1),
					t[4] ||= U("span", { class: "grow" }, null, -1),
					U("span", zT, A(u(e.at)), 1)
				]), U("pre", BT, A(c(e.data)), 1)]))), 128)), g.value.length ? G("", !0) : (B(), V("div", VT, A(P(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			W(Lb, {
				title: P(Y)("debug.annotations"),
				icon: P(Ty),
				help: P(Y)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: F(() => [(B(!0), V(z, null, R(_.value, (e, t) => (B(), V("div", {
					key: t,
					class: "req"
				}, [U("div", HT, [U("span", UT, "#" + A(e.mesId), 1), U("span", WT, "“" + A(e.quote) + "”", 1)]), U("div", GT, A(e.comment), 1)]))), 128)), _.value.length ? G("", !0) : (B(), V("div", KT, A(P(Y)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			U("div", qT, "Advanced Preset " + A(P("1.8.0")) + " · " + A(P("1f44c633fe72b4a6")), 1)
		], 64));
	}
}), YT = ["aria-label"], XT = { class: "panel-head" }, ZT = { class: "panel-logo" }, QT = { class: "grow" }, $T = { class: "panel-title ellipsis" }, eE = { class: "panel-sub ellipsis" }, tE = {
	class: "tabs",
	role: "tablist"
}, nE = [
	"title",
	"aria-selected",
	"onClick"
], rE = { class: "panel-body scroll" }, iE = /* @__PURE__ */ L({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Oy,
				view: Hx
			},
			{
				id: "config",
				icon: Vy,
				view: gS
			},
			{
				id: "modules",
				icon: Jv,
				view: hw
			},
			{
				id: "writing",
				icon: Ay,
				view: jw
			},
			{
				id: "memory",
				icon: Xv,
				view: Zw
			},
			{
				id: "debug",
				icon: Zv,
				view: JT
			}
		], n = K(() => t.find((e) => e.id === ag.tab) ?? t[0]), r = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		}), i = K(() => {
			let e = cg.value;
			return e ? `v${e.version} · ${lg.value.config}` : Y("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && ag.panelOpen && (ag.panelOpen = !1);
		};
		return Rr(() => document.addEventListener("keydown", a)), Br(() => document.removeEventListener("keydown", a)), (e, a) => (B(), H(Qa, { name: "panel" }, {
			default: F(() => [P(ag).panelOpen ? (B(), V("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": P(Y)("app.name")
			}, [
				U("header", XT, [
					U("div", ZT, [W(P(by))]),
					U("div", QT, [U("div", $T, A(P(cg) ? P(Fu)(P(cg)) : P(Y)("app.name")), 1), U("div", eE, A(i.value), 1)]),
					W(_x, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: P(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					W($, {
						icon: P(Xy),
						label: P(Y)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => P(ag).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				U("nav", tE, [(B(), V(z, null, R(t, (e) => U("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: k(["tab", { on: e.id === P(ag).tab }]),
					title: P(Y)(`tab.${e.id}`),
					"aria-selected": e.id === P(ag).tab,
					onClick: (t) => P(ag).tab = e.id
				}, [(B(), H(Ur(e.icon))), U("span", null, A(P(Y)(`tab.${e.id}`)), 1)], 10, nE)), 64))]),
				U("main", rE, [(B(), H(Mr, null, [(B(), H(Ur(n.value.view), { key: n.value.id }))], 1024))])
			], 8, YT)) : G("", !0)]),
			_: 1
		}));
	}
}), aE = { class: "inline-drawer" }, oE = { class: "inline-drawer-toggle inline-drawer-header" }, sE = { class: "inline-drawer-content" }, cE = { class: "flex-container alignItemsCenter spaceBetween" }, lE = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, uE = { key: 0 }, dE = { class: "text_muted" }, fE = {
	key: 1,
	class: "text_muted"
}, pE = /* @__PURE__ */ L({
	__name: "SettingsDrawer",
	setup(e) {
		let t = K({
			get: () => q().enabled,
			set: (e) => {
				q().enabled = e, J();
			}
		});
		return (e, n) => (B(), V("div", aE, [U("div", oE, [U("b", null, A(P(Y)("app.name")), 1), n[3] ||= U("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), U("div", sE, [
			U("div", cE, [U("label", lE, [I(U("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Zo, t.value]]), U("span", null, A(P(Y)("settings.enable")), 1)]), U("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => P(fg)(),
				onKeydown: n[2] ||= cs((e) => P(fg)(), ["enter"])
			}, [n[4] ||= U("i", { class: "fa-solid fa-layer-group" }, null, -1), U("span", null, A(P(Y)("panel.open")), 1)], 32)]),
			n[5] ||= U("hr", null, null, -1),
			U("h4", null, A(P(Y)("settings.preset")), 1),
			P(cg) ? (B(), V("div", uE, [ua(A(P(Fu)(P(cg))) + " ", 1), U("span", dE, "v" + A(P(cg).version) + " · " + A(P(lg).config), 1)])) : (B(), V("i", fE, A(P(Y)("settings.inactive")), 1))
		])]));
	}
}), mE = {
	key: 0,
	class: "preset-banner"
}, hE = { class: "preset-banner-text" }, gE = /* @__PURE__ */ L({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => P(cg) ? (B(), V("div", mE, [
			W(P(by), { class: "preset-banner-icon" }),
			U("span", hE, A(P(Y)("banner.usesAp")), 1),
			U("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => P(fg)()
			}, A(P(Y)("panel.open")), 1)
		])) : G("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function _E() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), fs(pE).mount(t);
}
function vE() {
	Lg("ap-stages", hb, ["mesid"]), Lg("ap-cards", lx, ["mesid"]), Lg("ap-dock", mx), Lg("ap-panel", iE), Lg("ap-preset-banner", gE), Fg(), sg();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, sg);
	Iv(), _E(), Dv(), hv();
}
//#endregion
//#region src/index.ts
var yE = {
	version: "1.8.0",
	buildId: "1f44c633fe72b4a6",
	nextGeneration: (e) => zd(e),
	listPresets: () => xu().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => Od(),
	update: Rh,
	togglePanel: (e) => {
		ag.panelOpen = e ?? !ag.panelOpen;
	},
	annotations: Mh
};
globalThis.advancedPresetInterceptor = Gf, window.AdvancedPreset = yE;
function bE(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function xE() {
	for (let { preset: e } of xu()) try {
		await Nd(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function SE() {
	let { eventSource: t, eventTypes: n } = e();
	q(), hh(), Zh(), yg(), jh(), await i(), await yu();
	for (let { preset: e } of xu()) {
		let t = Sd(e);
		t.length && Jf("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Ap(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => gh(e)), Ch(), t.on(n.MESSAGE_RECEIVED, (e, t) => Eh(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Yd.setPending(null), Yd.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Yd.sweep());
	let r = bE(() => {
		let e = Od(), t = e ? Tu(e) : void 0;
		t && Ld(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await xE(), xh({ reload: !0 }), Gh(), Ih();
	};
	t.on(n.APP_READY, () => void a()), vE(), Jf("init", {
		version: "1.8.0",
		build: "1f44c633fe72b4a6",
		enabled: q().enabled
	});
}
var CE = Lh, wE = dv;
SE().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { CE as advancedPresetOnUpdate, wE as advancedPresetRegisterChatSurface };

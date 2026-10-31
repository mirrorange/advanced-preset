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
var p = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
async function m(t, n, r) {
	let i = e();
	if (i.callGenericPopup && i.POPUP_TYPE && i.POPUP_RESULT) return await i.callGenericPopup(t, i.POPUP_TYPE.CONFIRM, "", {
		okButton: n,
		cancelButton: r,
		allowVerticalScrolling: !0
	}) === i.POPUP_RESULT.AFFIRMATIVE;
	let a = document.createElement("div");
	return typeof t == "string" ? a.innerHTML = t : a.append(t.cloneNode(!0)), window.confirm(a.innerText || a.textContent || "");
}
function h(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var g = (...e) => globalThis.fetch(...e), _ = (e) => {
	g = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function v(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var y = {}, b = [], x = () => {}, S = () => !1, C = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), w = (e) => e.startsWith("onUpdate:"), T = Object.assign, ee = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, te = Object.prototype.hasOwnProperty, E = (e, t) => te.call(e, t), D = Array.isArray, ne = (e) => le(e) === "[object Map]", re = (e) => le(e) === "[object Set]", ie = (e) => le(e) === "[object Date]", ae = (e) => le(e) === "[object RegExp]", O = (e) => typeof e == "function", k = (e) => typeof e == "string", oe = (e) => typeof e == "symbol", A = (e) => typeof e == "object" && !!e, se = (e) => (A(e) || O(e)) && O(e.then) && O(e.catch), ce = Object.prototype.toString, le = (e) => ce.call(e), ue = (e) => le(e).slice(8, -1), de = (e) => le(e) === "[object Object]", fe = (e) => k(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, pe = /* @__PURE__ */ v(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), me = (e) => {
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
	let t = k(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Ee, De = () => Ee ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Oe(e) {
	if (D(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = k(r) ? Me(r) : Oe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (k(e) || A(e)) return e;
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
function j(e) {
	let t = "";
	if (k(e)) t = e;
	else if (D(e)) for (let n = 0; n < e.length; n++) {
		let r = j(e[n]);
		r && (t += r + " ");
	}
	else if (A(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ne = /* @__PURE__ */ v("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
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
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = oe(e), i = oe(t), r || i ? e === t : (r = D(e), i = D(t), r || i ? r && i ? Re(e, t, n, Fe) : !1 : (r = A(e), i = A(t), r || i ? !r || !i ? !1 : Re(e, t, n, Le) : String(e) === String(t))));
}
function Be(e, t) {
	return e.findIndex((e) => ze(e, t));
}
var Ve = (e) => !!(e && e.__v_isRef === !0), M = (e) => k(e) ? e : e == null ? "" : D(e) || A(e) && (e.toString === ce || !O(e.toString)) ? Ve(e) ? M(e.value) : JSON.stringify(e, He, 2) : String(e), He = (e, t) => Ve(t) ? He(e, t.value) : ne(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ue(t, r) + " =>"] = n, e), {}) } : re(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ue(e)) } : oe(t) ? Ue(t) : A(t) && !D(t) && !de(t) ? String(t) : t, Ue = (e, t = "") => oe(e) ? `Symbol(${e.description ?? t})` : e, We, Ge = class {
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
var qe, Je = /* @__PURE__ */ new WeakSet(), Ye = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, We && (We.active ? We.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Je.has(this) && (Je.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || $e(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, ft(this), nt(this);
		let e = qe, t = ct;
		qe = this, ct = !0;
		try {
			return this.fn();
		} finally {
			rt(this), qe = e, ct = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) ot(e);
			this.deps = this.depsTail = void 0, ft(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Je.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		it(this) && this.run();
	}
	get dirty() {
		return it(this);
	}
}, Xe = 0, Ze, Qe;
function $e(e, t = !1) {
	e.flags |= 8, t ? (e.next = Qe, Qe = e) : (e.next = Ze, Ze = e);
}
function et() {
	Xe++;
}
function tt() {
	if (--Xe > 0) return;
	if (Qe) {
		let e = Qe;
		for (Qe = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Ze;) {
		let t = Ze;
		for (Ze = void 0; t;) {
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
function nt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function rt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), ot(r), st(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function it(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (at(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function at(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === pt) || (e.globalVersion = pt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !it(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = qe, r = ct;
	qe = e, ct = !0;
	try {
		nt(e);
		let n = e.fn(e._value);
		(t.version === 0 || xe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		qe = n, ct = r, rt(e), e.flags &= -3;
	}
}
function ot(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) ot(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function st(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var ct = !0, lt = [];
function ut() {
	lt.push(ct), ct = !1;
}
function dt() {
	let e = lt.pop();
	ct = e === void 0 || e;
}
function ft(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = qe;
		qe = void 0;
		try {
			t();
		} finally {
			qe = e;
		}
	}
}
var pt = 0, mt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, ht = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!qe || !ct || qe === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== qe) t = this.activeLink = new mt(qe, this), qe.deps ? (t.prevDep = qe.depsTail, qe.depsTail.nextDep = t, qe.depsTail = t) : qe.deps = qe.depsTail = t, gt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = qe.depsTail, t.nextDep = void 0, qe.depsTail.nextDep = t, qe.depsTail = t, qe.deps === t && (qe.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, pt++, this.notify(e);
	}
	notify(e) {
		et();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			tt();
		}
	}
};
function gt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) gt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var _t = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ Symbol(""), yt = /* @__PURE__ */ Symbol(""), bt = /* @__PURE__ */ Symbol("");
function xt(e, t, n) {
	if (ct && qe) {
		let t = _t.get(e);
		t || _t.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new ht()), r.map = t, r.key = n), r.track();
	}
}
function St(e, t, n, r, i, a) {
	let o = _t.get(e);
	if (!o) {
		pt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (et(), t === "clear") o.forEach(s);
	else {
		let i = D(e), a = i && fe(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === bt || !oe(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(bt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(vt)), ne(e) && s(o.get(yt)));
				break;
			case "delete":
				i || (s(o.get(vt)), ne(e) && s(o.get(yt)));
				break;
			case "set": ne(e) && s(o.get(vt));
		}
	}
	tt();
}
function Ct(e) {
	let t = /* @__PURE__ */ N(e);
	return t === e || (xt(t, "iterate", bt), /* @__PURE__ */ un(e)) ? t : /* @__PURE__ */ ln(e) ? /* @__PURE__ */ cn(e) ? t.map((e) => mn(pn(e))) : t.map(mn) : t.map(pn);
}
function wt(e) {
	return xt(e = /* @__PURE__ */ N(e), "iterate", bt), e;
}
function Tt(e, t) {
	return /* @__PURE__ */ ln(e) ? mn(/* @__PURE__ */ cn(e) ? pn(t) : t) : pn(t);
}
var Et = {
	__proto__: null,
	[Symbol.iterator]() {
		return Dt(this, Symbol.iterator, (e) => Tt(this, e));
	},
	concat(...e) {
		return Ct(this).concat(...e.map((e) => D(e) ? Ct(e) : e));
	},
	entries() {
		return Dt(this, "entries", (e) => (e[1] = Tt(this, e[1]), e));
	},
	every(e, t) {
		return At(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return At(this, "filter", e, t, (e) => e.map((e) => Tt(this, e)), arguments);
	},
	find(e, t) {
		return At(this, "find", e, t, (e) => Tt(this, e), arguments);
	},
	findIndex(e, t) {
		return At(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return At(this, "findLast", e, t, (e) => Tt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return At(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return At(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Mt(this, "includes", e);
	},
	indexOf(...e) {
		return Mt(this, "indexOf", e);
	},
	join(e) {
		return Ct(this).join(e);
	},
	lastIndexOf(...e) {
		return Mt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return At(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Nt(this, "pop");
	},
	push(...e) {
		return Nt(this, "push", e);
	},
	reduce(e, ...t) {
		return jt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return jt(this, "reduceRight", e, t);
	},
	shift() {
		return Nt(this, "shift");
	},
	some(e, t) {
		return At(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Nt(this, "splice", e);
	},
	toReversed() {
		return Ct(this).toReversed();
	},
	toSorted(e) {
		return Ct(this).toSorted(e);
	},
	toSpliced(...e) {
		return Ct(this).toSpliced(...e);
	},
	unshift(...e) {
		return Nt(this, "unshift", e);
	},
	values() {
		return Dt(this, "values", (e) => Tt(this, e));
	}
};
function Dt(e, t, n) {
	let r = wt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ un(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Ot(a.next(), n), i !== kt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => Ot(a._next(), n);
	}
	return a;
}
function Ot(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var kt = Array.prototype;
function At(e, t, n, r, i, a) {
	let o = wt(e), s = o !== e && !/* @__PURE__ */ un(e), c = o[t];
	if (c !== kt[t]) {
		let t = c.apply(e, a);
		return s ? pn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Tt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function jt(e, t, n, r) {
	let i = wt(e), a = i !== e && !/* @__PURE__ */ un(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Tt(e, t)), n.call(this, t, Tt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Tt(e, c) : c;
}
function Mt(e, t, n) {
	let r = /* @__PURE__ */ N(e);
	xt(r, "iterate", bt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ dn(n[0]) ? (n[0] = /* @__PURE__ */ N(n[0]), r[t](...n)) : i;
}
function Nt(e, t, n = []) {
	ut(), et();
	let r = (/* @__PURE__ */ N(e))[t].apply(e, n);
	return tt(), dt(), r;
}
var Pt = /* @__PURE__ */ v("__proto__,__v_isRef,__isVue"), Ft = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(oe));
function It(e) {
	oe(e) || (e = String(e));
	let t = /* @__PURE__ */ N(this);
	return xt(t, "has", e), t.hasOwnProperty(e);
}
var Lt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? tn : en : i ? $t : Qt).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = D(e);
		if (!r) {
			let e;
			if (a && (e = Et[t])) return e;
			if (t === "hasOwnProperty") return It;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ hn(e) ? e : n);
		if ((oe(t) ? Ft.has(t) : Pt(t)) || (r || xt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ hn(o)) {
			let e = a && fe(t) ? o : o.value;
			return r && A(e) ? /* @__PURE__ */ on(e) : e;
		}
		return A(o) ? r ? /* @__PURE__ */ on(o) : /* @__PURE__ */ rn(o) : o;
	}
}, Rt = class extends Lt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = D(e) && fe(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ ln(i);
			if (!/* @__PURE__ */ un(n) && !/* @__PURE__ */ ln(n) && (i = /* @__PURE__ */ N(i), n = /* @__PURE__ */ N(n)), !a && /* @__PURE__ */ hn(i) && !/* @__PURE__ */ hn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : E(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ hn(e) ? e : r);
		return e === /* @__PURE__ */ N(r) && s && (o ? xe(n, i) && St(e, "set", t, n, i) : St(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = E(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && St(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!oe(t) || !Ft.has(t)) && xt(e, "has", t), n;
	}
	ownKeys(e) {
		return xt(e, "iterate", D(e) ? "length" : vt), Reflect.ownKeys(e);
	}
}, zt = class extends Lt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Bt = /* @__PURE__ */ new Rt(), Vt = /* @__PURE__ */ new zt(), Ht = /* @__PURE__ */ new Rt(!0), Ut = (e) => e, Wt = (e) => Reflect.getPrototypeOf(e);
function Gt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ N(i), o = ne(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Ut : t ? mn : pn;
		return !t && xt(a, "iterate", c ? yt : vt), T(Object.create(l), { next() {
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
function Kt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function qt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ N(r), a = /* @__PURE__ */ N(n);
			e || (xe(n, a) && xt(i, "get", n), xt(i, "get", a));
			let { has: o } = Wt(i), s = t ? Ut : e ? mn : pn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && xt(/* @__PURE__ */ N(t), "iterate", vt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ N(n), i = /* @__PURE__ */ N(t);
			return e || (xe(t, i) && xt(r, "has", t), xt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ N(a), s = t ? Ut : e ? mn : pn;
			return !e && xt(o, "iterate", vt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return T(n, e ? {
		add: Kt("add"),
		set: Kt("set"),
		delete: Kt("delete"),
		clear: Kt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ N(this), r = Wt(n), i = /* @__PURE__ */ N(e), a = !t && !/* @__PURE__ */ un(e) && !/* @__PURE__ */ ln(e) ? i : e;
			return r.has.call(n, a) || xe(e, a) && r.has.call(n, e) || xe(i, a) && r.has.call(n, i) || (n.add(a), St(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ un(n) && !/* @__PURE__ */ ln(n) && (n = /* @__PURE__ */ N(n));
			let r = /* @__PURE__ */ N(this), { has: i, get: a } = Wt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ N(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? xe(n, s) && St(r, "set", e, n, s) : St(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ N(this), { has: n, get: r } = Wt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ N(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && St(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ N(this), t = e.size !== 0, n = e.clear();
			return t && St(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Gt(r, e, t);
	}), n;
}
function Jt(e, t) {
	let n = qt(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(E(n, i) && i in r ? n : r, i, a);
}
var Yt = { get: /* @__PURE__ */ Jt(!1, !1) }, Xt = { get: /* @__PURE__ */ Jt(!1, !0) }, Zt = { get: /* @__PURE__ */ Jt(!0, !1) }, Qt = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new WeakMap(), tn = /* @__PURE__ */ new WeakMap();
function nn(e) {
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
function rn(e) {
	return /* @__PURE__ */ ln(e) ? e : sn(e, !1, Bt, Yt, Qt);
}
// @__NO_SIDE_EFFECTS__
function an(e) {
	return sn(e, !1, Ht, Xt, $t);
}
// @__NO_SIDE_EFFECTS__
function on(e) {
	return sn(e, !0, Vt, Zt, en);
}
function sn(e, t, n, r, i) {
	if (!A(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = nn(ue(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function cn(e) {
	return /* @__PURE__ */ ln(e) ? /* @__PURE__ */ cn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function ln(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function un(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function N(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ N(t) : e;
}
function fn(e) {
	return !E(e, "__v_skip") && Object.isExtensible(e) && Ce(e, "__v_skip", !0), e;
}
var pn = (e) => A(e) ? /* @__PURE__ */ rn(e) : e, mn = (e) => A(e) ? /* @__PURE__ */ on(e) : e;
// @__NO_SIDE_EFFECTS__
function hn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return gn(e, !1);
}
function gn(e, t) {
	return /* @__PURE__ */ hn(e) ? e : new _n(e, t);
}
var _n = class {
	constructor(e, t) {
		this.dep = new ht(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ N(e), this._value = t ? e : pn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ un(e) || /* @__PURE__ */ ln(e);
		e = n ? e : /* @__PURE__ */ N(e), xe(e, t) && (this._rawValue = e, this._value = n ? e : pn(e), this.dep.trigger());
	}
};
function F(e) {
	return /* @__PURE__ */ hn(e) ? e.value : e;
}
var vn = {
	get: (e, t, n) => t === "__v_raw" ? e : F(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ hn(i) && !/* @__PURE__ */ hn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function yn(e) {
	return /* @__PURE__ */ cn(e) ? e : new Proxy(e, vn);
}
var bn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new ht(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function xn(e) {
	return new bn(e);
}
var Sn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new ht(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = pt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && qe !== this) return $e(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return at(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Cn(e, t, n = !1) {
	let r, i;
	return O(e) ? r = e : (r = e.get, i = e.set), new Sn(r, i, n);
}
var wn = {}, Tn = /* @__PURE__ */ new WeakMap(), En = void 0;
function Dn(e, t = !1, n = En) {
	if (n) {
		let t = Tn.get(n);
		t || Tn.set(n, t = []), t.push(e);
	}
}
function On(e, t, n = y) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ un(e) || i === !1 || i === 0 ? kn(e, 1) : kn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ hn(e) ? (d = () => e.value, m = /* @__PURE__ */ un(e)) : /* @__PURE__ */ cn(e) ? (d = () => l(e), m = !0) : D(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ cn(e) || /* @__PURE__ */ un(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ hn(e)) return e.value;
		if (/* @__PURE__ */ cn(e)) return l(e);
		if (O(e)) return c ? c(e, 2) : e();
	})) : d = O(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			ut();
			try {
				f();
			} finally {
				dt();
			}
		}
		let t = En;
		En = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			En = t;
		}
	} : x, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => kn(e(), t);
	}
	let g = Ke(), _ = () => {
		u.stop(), g && g.active && ee(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				_();
			}
		};
	}
	let v = h ? Array(e.length).fill(wn) : wn, b = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => xe(e, v[t])) : xe(n, v))) {
					let e = En;
					ut();
					try {
						f && f(), En = u;
						let e = [
							n,
							v === wn ? void 0 : h && v[0] === wn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						En = e, dt();
					}
				}
			} else u.run();
		}
	};
	return s && s(b), u = new Ye(d), u.scheduler = o ? () => o(b, !1) : b, p = (e) => Dn(e, !1, u), f = u.onStop = () => {
		let e = Tn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Tn.delete(u);
		}
	}, t ? r ? b(!0) : v = u.run() : o ? o(b.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function kn(e, t = Infinity, n) {
	if (t <= 0 || !A(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ hn(e)) kn(e.value, t, n);
	else if (D(e)) for (let r = 0; r < e.length; r++) kn(e[r], t, n);
	else if (re(e) || ne(e)) e.forEach((e) => {
		kn(e, t, n);
	});
	else if (de(e)) {
		for (let r in e) kn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && kn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function An(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Mn(e, t, n);
	}
}
function jn(e, t, n, r) {
	if (O(e)) {
		let i = An(e, t, n, r);
		return i && se(i) && i.catch((e) => {
			Mn(e, t, n);
		}), i;
	}
	if (D(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(jn(e[a], t, n, r));
		return i;
	}
}
function Mn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || y;
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
			ut(), An(a, null, 10, [
				e,
				i,
				o
			]), dt();
			return;
		}
	}
	Nn(e, n, i, r, o);
}
function Nn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Pn = [], Fn = -1, In = [], Ln = null, Rn = 0, zn = /* @__PURE__ */ Promise.resolve(), Bn = null;
function Vn(e) {
	let t = Bn || zn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Hn(e) {
	let t = Fn + 1, n = Pn.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Pn[r], a = Xn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Un(e) {
	if (!(e.flags & 1)) {
		let t = Xn(e), n = Pn[Pn.length - 1];
		!n || !(e.flags & 2) && t >= Xn(n) ? Pn.push(e) : Pn.splice(Hn(t), 0, e), e.flags |= 1, Wn();
	}
}
function Wn() {
	Bn ||= zn.then(Zn);
}
function Gn(e) {
	if (!D(e)) Ln && e.id === -1 ? Ln.splice(Rn + 1, 0, e) : e.flags & 1 || (In.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) In.push(e[t]);
	Wn();
}
function Kn(e, t, n, r = Fn + 1) {
	for (; r < Pn.length; r++) {
		let n = Pn[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Pn.splice(r, 1), r = e ? r - 1 : Fn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function qn(e, t, n = 0) {
	if (In.length) {
		let e = In, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < In.length; i++) {
				let a = In[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? In[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Xn(e) - Xn(t));
		if (In.length = r, Ln) {
			for (let e = 0; e < i.length; e++) Ln.push(i[e]);
			return;
		}
		for (Ln = i, Rn = 0; Rn < Ln.length; Rn++) {
			let e = Ln[Rn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Ln = null, Rn = 0;
	}
}
var Jn = !1;
function Yn(e, t) {
	if (Jn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(In);
	e(), Jn = !0;
	try {
		Kn(void 0, t), qn(void 0, n, t);
	} finally {
		Jn = !1;
	}
}
var Xn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Zn(e) {
	try {
		for (Fn = 0; Fn < Pn.length; Fn++) {
			let e = Pn[Fn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), An(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Fn < Pn.length; Fn++) {
			let e = Pn[Fn];
			e && (e.flags &= -2);
		}
		Fn = -1, Pn.length = 0, qn(e), Bn = null, (Pn.length || In.length) && Zn(e);
	}
}
var Qn = null, $n = null;
function er(e) {
	let t = Qn;
	return Qn = e, $n = e && e.type.__scopeId || null, t;
}
function I(e, t = Qn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && na(-1);
		let i = er(t), a = Qi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Qi.length; e > a; e--) ea();
			er(i), r._d && na(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function L(e, t) {
	if (Qn === null) return e;
	let n = Fa(Qn), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = y] = t[e];
		i && (O(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && kn(a), r.push({
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
function tr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (ut(), jn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), dt());
	}
}
function nr(e, t, n = !1) {
	let r = Sa();
	if (r || ai) {
		let i = ai ? ai._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && O(t) ? t.call(r && r.proxy) : t;
	}
}
var rr = /* @__PURE__ */ Symbol.for("v-scx"), ir = () => nr(rr);
function ar(e, t) {
	return cr(e, null, t);
}
function or(e, t) {
	return cr(e, null, { flush: "sync" });
}
function sr(e, t, n) {
	return cr(e, t, n);
}
function cr(e, t, n = y) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = T({}, n), c = t && r || !t && a !== "post", l;
	if (Oa) {
		if (a === "sync") {
			let e = ir();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = x, e.resume = x, e.pause = x, e;
		}
	}
	let u = xa;
	s.call = (e, t, n) => jn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Ii(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Un(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = On(e, t, s);
	return Oa && (l ? l.push(f) : c && f()), f;
}
var lr = /* @__PURE__ */ Symbol("_vte"), ur = (e) => e.__isTeleport, dr = /* @__PURE__ */ Symbol("_leaveCb"), fr = /* @__PURE__ */ Symbol("_enterCb");
function pr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return zr(() => {
		e.isMounted = !0;
	}), Vr(() => {
		e.isUnmounting = !0;
	}), e;
}
var mr = [Function, Array], hr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: mr,
	onEnter: mr,
	onAfterEnter: mr,
	onEnterCancelled: mr,
	onBeforeLeave: mr,
	onLeave: mr,
	onAfterLeave: mr,
	onLeaveCancelled: mr,
	onBeforeAppear: mr,
	onAppear: mr,
	onAfterAppear: mr,
	onAppearCancelled: mr
}, gr = {
	name: "BaseTransition",
	props: hr,
	setup(e, { slots: t }) {
		let n = Sa(), r = pr();
		return () => {
			let i = t.default && wr(t.default(), !0), a = i && i.length ? _r(i) : n.subTree ? K() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ N(e), { mode: s } = o;
			if (r.isLeaving) return xr(a);
			let c = Sr(a);
			if (!c) return xr(a);
			let l = br(c, o, r, n, (e) => l = e);
			c.type !== Xi && Cr(c, l);
			let u = n.subTree && Sr(n.subTree);
			if (u && u.type !== Xi && !aa(u, c) && Tr(n.subTree)) {
				let e = br(u, o, r, n);
				if (Cr(u, e), s === "out-in" && c.type !== Xi) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, xr(a);
				s === "in-out" && c.type !== Xi ? e.delayLeave = (e, t, n) => {
					let i = yr(r, u);
					i[String(u.key)] = u, e[dr] = () => {
						t(), e[dr] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function _r(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== Xi) {
			t = n;
			break;
		}
	}
	return t;
}
var vr = gr;
function yr(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function br(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = yr(n, e), S = (e, t) => {
		e && jn(e, r, 9, t);
	}, C = (e, t) => {
		let n = t[1];
		S(e, t), D(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, w = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[dr] && t[dr](!0);
			let i = x[b];
			if (i && aa(e, i)) {
				let e = i.el[dr];
				if (!e) {
					let t = Tr(i);
					e = t && t.el[dr];
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
			t[fr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), w.delayedLeave && w.delayedLeave(), t[fr] = void 0);
			};
			let c = t[fr].bind(null, !1);
			r ? C(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[fr] && t[fr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[dr] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[dr] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[dr].bind(null, !1);
			x[i] = e, p ? C(p, [t, o]) : o();
		},
		clone(e) {
			let a = br(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return w;
}
function xr(e) {
	if (Mr(e)) return e = ua(e), e.children = null, e;
}
function Sr(e) {
	if (!Mr(e)) return ur(e.type) && e.children ? _r(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && O(n.default)) return n.default();
	}
}
function Cr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Cr(ur(n.type) && Sr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === B && D(e.children)) {
		let n = fi(e.children, !1);
		n && Cr(n, t);
	}
}
function wr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === B ? (o.patchFlag & 128 && i++, r = r.concat(wr(o.children, t, s))) : (t || o.type !== Xi) && r.push(s == null ? o : ua(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Tr(e) {
	if (e.component) return Tr(e.component.subTree);
	if (e.type === B) {
		let t = D(e.children) && fi(e.children, !1);
		return t ? Tr(t) : void 0;
	}
	if (e.type !== Xi) return e;
}
// @__NO_SIDE_EFFECTS__
function R(e, t) {
	return O(e) ? /* @__PURE__ */ T({ name: e.name }, t, { setup: e }) : e;
}
function Er(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Dr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Or = /* @__PURE__ */ new WeakMap();
function kr(e, t, n, r, i = !1) {
	if (D(e)) {
		e.forEach((e, a) => kr(e, t && (D(t) ? t[a] : t), n, r, i));
		return;
	}
	if (jr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && kr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Fa(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === y ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ N(d), p = d === y ? S : (e) => !Dr(u, e) && E(f, e), m = (e, t) => !(t && Dr(u, t));
	if (l != null && l !== c) {
		if (Ar(t), k(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ hn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (O(c)) An(c, s, 12, [o, u]);
	else {
		let t = k(c), r = /* @__PURE__ */ hn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) D(n) && ee(n, a);
					else if (D(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Or.delete(e);
				};
				t.id = -1, Or.set(e, t), Ii(t, n);
			} else Ar(e), s();
		}
	}
}
function Ar(e) {
	let t = Or.get(e);
	t && (t.flags |= 8, Or.delete(e));
}
De().requestIdleCallback, De().cancelIdleCallback;
var jr = (e) => !!e.type.__asyncLoader, Mr = (e) => e.type.__isKeepAlive, Nr = {
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
		let n = Sa(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Ii(() => {
				a.isDeactivated = !1, a.a && Se(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && ga(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			Gi(t.m), Gi(t.a), l(e, f, null, 1, s), Ii(() => {
				t.da && Se(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && ga(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Fr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Ia(jr(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !aa(t, o)) ? p(t) : o && (Fr(o), t && Fr(t)), i.delete(e), a.delete(e);
		}
		sr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Pr(e, t)), t && m((e) => !Pr(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (qi(n.subTree.type) ? Ii(() => {
				let e = Ir(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Ir(n.subTree)));
		};
		return zr(_), Br(_), Vr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Ir(t);
				if (e.type === i.type && e.key === i.key) {
					Fr(i);
					let e = i.component.da;
					e && Ii(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!ia(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Ir(r);
			if (s.type === Xi) return o = null, s;
			let c = s.type, l = Ia(jr(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Pr(u, l)) || d && l && Pr(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = ua(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Cr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, qi(r.type) ? r : s;
		};
	}
};
function Pr(e, t) {
	return D(e) ? e.some((e) => Pr(e, t)) : k(e) ? e.split(",").includes(t) : ae(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Fr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Ir(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Lr(e, t, n = xa, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			ut();
			let i = Ta(n), a = jn(t, n, e, r);
			return i(), dt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Rr = (e) => (t, n = xa) => {
	(!Oa || e === "sp") && Lr(e, (...e) => t(...e), n);
}, zr = Rr("m"), Br = Rr("u"), Vr = Rr("bum"), Hr = "components", Ur = /* @__PURE__ */ Symbol.for("v-ndc");
function Wr(e) {
	return k(e) ? Gr(Hr, e, !1) || e : e || Ur;
}
function Gr(e, t, n = !0, r = !1) {
	let i = Qn || xa;
	if (i) {
		let n = i.type;
		if (e === Hr) {
			let e = Ia(n, !1);
			if (e && (e === t || e === ge(t) || e === ye(ge(t)))) return n;
		}
		let a = Kr(i[e] || n[e], t) || Kr(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function Kr(e, t) {
	return e && (e[t] || e[ge(t)] || e[ye(ge(t))]);
}
function z(e, t, n, r) {
	let i, a = n && n[r], o = D(e);
	if (o || k(e)) {
		let n = o && /* @__PURE__ */ cn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ un(e), s = /* @__PURE__ */ ln(e), e = wt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? mn(pn(e[n])) : pn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (A(e)) {
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
function qr(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (D(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function Jr(e, t, n, r, i, a) {
	if (n ??= {}, Qn.ce || Qn.parent && jr(Qn.parent) && Qn.parent.ce) {
		let e = a != null && n.key == null ? T({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), V(), U(B, null, [G("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = Qi.length;
	V();
	let c;
	try {
		let i = o && Yr(o(n)), s = n.key || a || i && i.key;
		c = U(B, { key: (s && !oe(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = Qi.length; e > s; e--) ea();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function Yr(e) {
	return e.some((e) => !ia(e) || !(e.type === Xi || e.type === B && !Yr(e.children))) ? e : null;
}
var Xr = (e) => e ? Da(e) ? Fa(e) : Xr(e.parent) : null, Zr = /* @__PURE__ */ T(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Xr(e.parent),
	$root: (e) => Xr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Un(e.update);
	},
	$nextTick: (e) => e.n ||= Vn.bind(e.proxy),
	$watch: (e) => x
}), Qr = (e, t) => e !== y && !e.__isScriptSetup && E(e, t), $r = {
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
			else if (Qr(r, t)) return o[t] = 1, r[t];
			else if (E(a, t)) return o[t] = 3, a[t];
			else if (n !== y && E(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = Zr[t], u, d;
		if (l) return t === "$attrs" && xt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== y && E(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, E(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Qr(i, t) ? (i[t] = n, !0) : E(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || Qr(t, s) || E(a, s) || E(r, s) || E(Zr, s) || E(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? E(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function ei(e) {
	return D(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ti(e, t) {
	return !e || !t ? e || t : D(e) && D(t) ? e.concat(t) : T({}, ei(e), ei(t));
}
function ni() {
	return {
		app: null,
		config: {
			isNativeTag: S,
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
var ri = 0;
function ii(e, t) {
	return function(n, r = null) {
		O(n) || (n = T({}, n)), r != null && !A(r) && (r = null);
		let i = ni(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: ri++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: za,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && O(e.install) ? (a.add(e), e.install(c, ...t)) : O(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || G(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Fa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (jn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ai;
				ai = c;
				try {
					return e();
				} finally {
					ai = t;
				}
			}
		};
		return c;
	};
}
var ai = null;
function oi(e, t, n = y) {
	let r = Sa(), i = ge(t), a = ve(t), o = si(e, i), s = xn((o, s) => {
		let c, l = y, u;
		return or(() => {
			let t = e[i];
			xe(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!xe(o, c) && !(l !== y && xe(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), xe(e, l) && (xe(e, o) && !xe(o, u) || f && l !== y && !xe(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || y : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var si = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${ge(t)}Modifiers`] || e[`${ve(t)}Modifiers`];
function ci(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || y, i = n, a = t.startsWith("update:"), o = a && si(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => k(e) ? e.trim() : e)), o.number && (i = i.map(we)));
	let s, c = r[s = be(t)] || r[s = be(ge(t))];
	!c && a && (c = r[s = be(ve(t))]), c && jn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, jn(l, e, 6, i);
	}
}
function li(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (D(a) ? a.forEach((e) => o[e] = null) : T(o, a), A(e) && r.set(e, o), o) : (A(e) && r.set(e, null), null);
}
function ui(e, t) {
	return !e || !C(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), E(e, t[0].toLowerCase() + t.slice(1)) || E(e, ve(t)) || E(e, t));
}
function di(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = er(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = fa(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = fa(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : pi(s);
		}
	} catch (t) {
		Qi.length = 0, Mn(t, e, 1), _ = G(Xi);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(w) && (v = mi(v, a)), y = ua(y, v, !1, !0));
	}
	return n.dirs && (y = ua(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Cr(ur(y.type) && Sr(y) || y, n.transition), _ = y, er(g), _;
}
function fi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (ia(r)) {
			if (r.type !== Xi || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var pi = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || C(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, mi = (e, t) => {
	let n = {};
	for (let r in e) (!w(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function hi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? gi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (_i(o, r, n) && !ui(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || gi(r, o, l) : !!o;
	return !1;
}
function gi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!E(e, a) || _i(t, e, a) && !ui(n, a)) return !0;
	}
	return !1;
}
function _i(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && A(r) && A(i) ? !ze(r, i) : r !== i;
}
function vi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var yi = {}, bi = () => Object.create(yi), xi = (e) => Object.getPrototypeOf(e) === yi;
function Si(e, t, n, r = !1) {
	let i = {}, a = bi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), wi(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ an(i) : e.type.props ? i : a, e.attrs = a;
}
function Ci(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ N(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ui(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (E(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = ge(o);
						i[t] = Ti(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		wi(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !E(t, a) && ((r = ve(a)) === a || !E(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Ti(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !E(t, e)) && (delete a[e], l = !0);
	}
	l && St(e.attrs, "set", "");
}
function wi(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (pe(c)) continue;
		let l = t[c], u;
		i && E(i, u = ge(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : ui(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ N(n), r = s || y;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Ti(i, t, s, r[s], e, !E(r, s));
		}
	}
	return o;
}
function Ti(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = E(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && O(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Ta(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === ve(n)) && (r = !0));
	}
	return r;
}
function Ei(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return A(e) && r.set(e, b), b;
	if (D(a)) for (let e = 0; e < a.length; e++) {
		let t = ge(a[e]);
		Di(t) && (o[t] = y);
	}
	else if (a) for (let e in a) {
		let t = ge(e);
		if (Di(t)) {
			let n = a[e], r = o[t] = D(n) || O(n) ? { type: n } : T({}, n), i = r.type, c = !1, l = !0;
			if (D(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = O(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = O(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || E(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return A(e) && r.set(e, c), c;
}
function Di(e) {
	return e[0] !== "$" && !pe(e);
}
var Oi = (e) => e === "_" || e === "_ctx" || e === "$stable", ki = (e) => D(e) ? e.map(fa) : [fa(e)], Ai = (e, t, n) => {
	if (t._n) return t;
	let r = I((...e) => ki(t(...e)), n);
	return r._c = !1, r;
}, ji = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Oi(n)) continue;
		let i = e[n];
		if (O(i)) t[n] = Ai(n, i, r);
		else if (i != null) {
			let e = ki(i);
			t[n] = () => e;
		}
	}
}, Mi = (e, t) => {
	let n = ki(t);
	e.slots.default = () => n;
}, Ni = (e, t, n) => {
	for (let r in t) (n || !Oi(r)) && (e[r] = t[r]);
}, Pi = (e, t, n) => {
	let r = e.slots = bi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ni(r, t, n), n && Ce(r, "_", e, !0)) : ji(t, r);
	} else t && Mi(e, t);
}, Fi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = y;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ni(i, t, n) : (a = !t.$stable, ji(t, i)), o = t;
	} else t && (Mi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Oi(e) && o[e] == null && delete i[e];
}, Ii = Ji;
function Li(e) {
	return Ri(e);
}
function Ri(e, t) {
	let n = De();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = x, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !aa(e, t) && (r = ge(e), ue(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === b && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Yi:
				g(e, t, n, r);
				break;
			case Xi:
				_(e, t, n, r);
				break;
			case Zi:
				e ?? v(t, n, r, o);
				break;
			case B:
				re(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? w(e, t, n, r, i, a, o, s, c) : d & 6 ? ie(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ve);
		}
		u != null && i ? kr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && kr(e.ref, null, a, e, !0);
	}, g = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, _ = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, v = (e, t, n, r) => {
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
				n && n._beginPatch(), E(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, T = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && te(e.children, f, null, i, s, zi(e, c), l, d), _ && tr(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !pe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && ga(p, i, e);
		}
		_ && tr(e, null, i, "beforeMount");
		let v = Vi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Ii(() => {
			try {
				p && ga(p, i, e), v && g.enter(f), _ && tr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || qi(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, te = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? pa(e[l]) : fa(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, E = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || y, m = t.props || y, h;
		if (n && Bi(n, !1), (h = m.onVnodeBeforeUpdate) && ga(h, n, t, e), f && tr(t, e, n, "beforeUpdate"), n && Bi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? D(e.dynamicChildren, d, c, n, r, zi(t, i), o) : s || A(e, t, c, null, n, r, zi(t, i), o, !1), l > 0) {
			if (l & 16) ne(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && ne(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Ii(() => {
			h && ga(h, n, t, e), f && tr(t, e, n, "updated");
		}, r);
	}, D = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || Ki(c), f = u && (c.type === B || !aa(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ne = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== y) for (let o in t) !pe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (pe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, re = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), te(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (D(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Hi(e, t, !0)) : A(e, t, n, f, a, o, c, l, u);
	}, ie = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ae(t, n, r, i, a, o, c) : O(e, t, c);
	}, ae = (e, t, n, r, i, a, o) => {
		let s = e.component = ba(e, r, i);
		if (Mr(e) && (s.ctx.renderer = ve), ka(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, k, o, a), !e.el) {
				let r = s.subTree = G(Xi);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else k(s, e, t, n, i, a, o);
	}, O = (e, t, n) => {
		let r = t.component = e.component;
		if (hi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, oe(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, k = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Wi(e);
					if (n) {
						t && (t.el = c.el, oe(e, t, o)), n.asyncDep.then(() => {
							Ii(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Bi(e, !1), t ? (t.el = c.el, oe(e, t, o)) : t = c, n && Se(n), (f = t.props && t.props.onVnodeBeforeUpdate) && ga(f, s, t, c), Bi(e, !0);
				let p = di(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ge(m), e, i, a), t.el = p.el, u === null && vi(e, p.el), r && Ii(r, i), (f = t.props && t.props.onVnodeUpdated) && Ii(() => ga(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = jr(t);
				if (Bi(e, !1), l && Se(l), !m && (o = c && c.onVnodeBeforeMount) && ga(o, d, t), Bi(e, !0), s && be) {
					let t = () => {
						e.subTree = di(e), be(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = di(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Ii(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Ii(() => ga(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && jr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Ii(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Ye(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Un(u), Bi(e, !0), l();
	}, oe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Ci(e, t.props, r, n), Fi(e, t.children, n), ut(), Kn(e), dt();
	}, A = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ce(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				se(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && he(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ce(l, f, n, r, i, a, o, s, c) : he(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && te(f, n, r, i, a, o, s, c));
	}, se = (e, t, n, r, i, a, o, s, c) => {
		e ||= b, t ||= b;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? pa(t[f]) : fa(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? he(e, i, a, !0, !1, d) : te(t, n, r, i, a, o, s, c, d);
	}, ce = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? pa(t[l]) : fa(t[l]);
			if (aa(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? pa(t[f]) : fa(t[f]);
			if (aa(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? pa(t[l]) : fa(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) ue(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? pa(t[l]) : fa(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, x = !1, S = 0, C = Array(y);
			for (l = 0; l < y; l++) C[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					ue(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (C[_ - m] === 0 && aa(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? ue(r, i, a, !0) : (C[u - m] = l + 1, u >= S ? S = u : x = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let w = x ? Ui(C) : b;
			for (_ = w.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || Ki(f) : r;
				C[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : x && (_ < 0 || l !== w[_] ? le(d, n, p, 2) : _--);
			}
		}
	}, le = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) le(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ve);
		else if (c === B) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) le(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Zi) S(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[dr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Ii(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[dr];
					s._isLeaving && s[dr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, ue = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (ut(), kr(s, null, n, e, !0), dt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !jr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && ga(_, t, e), u & 6) me(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && tr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== B || d > 0 && d & 64) ? he(l, t, n, !1, !0) : (a === B && d & 384 || !i && u & 16) && he(c, t, n), r && de(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Ii(() => {
			_ && ga(_, t, e), h && tr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, de = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === B;
		if (o && !a) {
			fe(n, r);
			return;
		}
		if (t === Zi) {
			C(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Tr(e) : e, c = () => {
			o ? d(n) && fe(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, fe = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, me = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Gi(c), Gi(l), r && Se(r), i.stop(), a ? (a.flags |= 8, ue(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, ue(o, e, t, n)), s && Ii(s, t), Ii(() => {
			e.isUnmounted = !0;
		}, t);
	}, he = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) ue(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[lr];
		return n ? f(n) : t;
	}, _e = (e, t, n) => {
		Yn(() => {
			e == null ? t._vnode && ue(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : ya());
	}, ve = {
		p: h,
		um: ue,
		m: le,
		r: de,
		mt: ae,
		mc: te,
		pc: A,
		pbc: D,
		n: ge,
		o: e
	}, ye, be;
	return t && ([ye, be] = t(ve)), {
		render: _e,
		hydrate: ye,
		createApp: ii(_e, ye)
	};
}
function zi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Bi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Vi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Hi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (D(r) && D(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = pa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Hi(t, a)), a.type === Yi && (a.patchFlag === -1 && (a = i[e] = pa(a)), a.el = t.el), a.type === Xi && !a.el && (a.el = t.el);
	}
}
function Ui(e) {
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
function Wi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Wi(t);
}
function Gi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Ki(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Ki(t.subTree) : null;
}
var qi = (e) => e.__isSuspense;
function Ji(e, t) {
	t && t.pendingBranch ? D(e) ? t.effects.push(...e) : t.effects.push(e) : Gn(e);
}
var B = /* @__PURE__ */ Symbol.for("v-fgt"), Yi = /* @__PURE__ */ Symbol.for("v-txt"), Xi = /* @__PURE__ */ Symbol.for("v-cmt"), Zi = /* @__PURE__ */ Symbol.for("v-stc"), Qi = [], $i = null;
function V(e = !1) {
	Qi.push($i = e ? null : []);
}
function ea() {
	Qi.pop(), $i = Qi[Qi.length - 1] || null;
}
var ta = 1;
function na(e, t = !1) {
	ta += e, e < 0 && $i && t && ($i.hasOnce = !0);
}
function ra(e) {
	return e.dynamicChildren = ta > 0 ? $i || b : null, ea(), ta > 0 && $i && $i.push(e), e;
}
function H(e, t, n, r, i, a) {
	return ra(W(e, t, n, r, i, a, !0));
}
function U(e, t, n, r, i) {
	return ra(G(e, t, n, r, i, !0));
}
function ia(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function aa(e, t) {
	return e.type === t.type && e.key === t.key;
}
var oa = ({ key: e }) => e ?? null, sa = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : k(e) || /* @__PURE__ */ hn(e) || O(e) ? {
	i: Qn,
	r: e,
	k: t,
	f: !!n
} : e);
function W(e, t = null, n = null, r = 0, i = null, a = e === B ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && oa(t),
		ref: t && sa(t),
		scopeId: $n,
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
		ctx: Qn
	};
	return s ? (ma(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= k(n) ? 8 : 16), ta > 0 && !o && $i && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && $i.push(c), c;
}
var G = ca;
function ca(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Ur) && (e = Xi), ia(e)) {
		let r = ua(e, t, !0);
		return n && ma(r, n), ta > 0 && !a && $i && (r.shapeFlag & 6 ? $i[$i.indexOf(e)] = r : $i.push(r)), r.patchFlag = -2, r;
	}
	if (La(e) && (e = e.__vccOpts), t) {
		t = la(t);
		let { class: e, style: n } = t;
		e && !k(e) && (t.class = j(e)), A(n) && (/* @__PURE__ */ dn(n) && !D(n) && (n = T({}, n)), t.style = Oe(n));
	}
	let o = k(e) ? 1 : qi(e) ? 128 : ur(e) ? 64 : A(e) ? 4 : O(e) ? 2 : 0;
	return W(e, t, n, r, i, o, a, !0);
}
function la(e) {
	return e ? /* @__PURE__ */ dn(e) || xi(e) ? T({}, e) : e : null;
}
function ua(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? ha(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && oa(l),
		ref: t && t.ref ? n && a ? D(a) ? a.concat(sa(t)) : [a, sa(t)] : sa(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== B ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ua(e.ssContent),
		ssFallback: e.ssFallback && ua(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Cr(u, c.clone(u)), u;
}
function da(e = " ", t = 0) {
	return G(Yi, null, e, t);
}
function K(e = "", t = !1) {
	return t ? (V(), U(Xi, null, e)) : G(Xi, null, e);
}
function fa(e) {
	return e == null || typeof e == "boolean" ? G(Xi) : D(e) ? G(B, null, e.slice()) : ia(e) ? pa(e) : G(Yi, null, String(e));
}
function pa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ua(e);
}
function ma(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (D(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), ma(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !xi(t) ? t._ctx = Qn : r === 3 && Qn && (Qn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (O(t)) {
		if (r & 65) {
			ma(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Qn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [da(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function ha(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = j([t.class, r.class]));
		else if (e === "style") t.style = Oe([t.style, r.style]);
		else if (C(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(D(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !w(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function ga(e, t, n, r = null) {
	jn(e, t, 7, [n, r]);
}
var _a = ni(), va = 0;
function ya() {
	return va;
}
function ba(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || _a, a = {
		uid: va++,
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
		propsOptions: Ei(r, i),
		emitsOptions: li(r, i),
		emit: null,
		emitted: null,
		propsDefaults: y,
		inheritAttrs: r.inheritAttrs,
		ctx: y,
		data: y,
		props: y,
		attrs: y,
		slots: y,
		refs: y,
		setupState: y,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ci.bind(null, a), e.ce && e.ce(a), a;
}
var xa = null, Sa = () => xa || Qn, Ca, wa;
{
	let e = De(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ca = t("__VUE_INSTANCE_SETTERS__", (e) => xa = e), wa = t("__VUE_SSR_SETTERS__", (e) => Oa = e);
}
var Ta = (e) => {
	let t = xa;
	return Ca(e), e.scope.on(), () => {
		e.scope.off(), Ca(t);
	};
}, Ea = () => {
	xa && xa.scope.off(), Ca(null);
};
function Da(e) {
	return e.vnode.shapeFlag & 4;
}
var Oa = !1;
function ka(e, t = !1, n = !1) {
	t && wa(t);
	let { props: r, children: i } = e.vnode, a = Da(e);
	Si(e, r, a, t), Pi(e, i, n || t);
	let o = a ? Aa(e, t) : void 0;
	return t && wa(!1), o;
}
function Aa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, $r);
	let { setup: r } = n;
	if (r) {
		ut();
		let n = e.setupContext = r.length > 1 ? Pa(e) : null, i = Ta(e), a = An(r, e, 0, [e.props, n]), o = se(a);
		if (dt(), i(), (o || e.sp) && !jr(e) && Er(e), o) {
			if (a.then(Ea, Ea), t) return a.then((n) => {
				wa(!0);
				try {
					ja(e, n, t);
				} finally {
					wa(!1);
				}
			}).catch((t) => {
				Mn(t, e, 0);
			});
			e.asyncDep = a;
		} else ja(e, a, t);
	} else Ma(e, t);
}
function ja(e, t, n) {
	O(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : A(t) && (e.setupState = yn(t)), Ma(e, n);
}
function Ma(e, t, n) {
	let r = e.type;
	e.render ||= r.render || x;
}
var Na = { get(e, t) {
	return xt(e, "get", ""), e[t];
} };
function Pa(e) {
	return {
		attrs: new Proxy(e.attrs, Na),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Fa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(yn(fn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Zr) return Zr[n](e);
		},
		has(e, t) {
			return t in e || t in Zr;
		}
	}) : e.proxy;
}
function Ia(e, t = !0) {
	return O(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function La(e) {
	return O(e) && "__vccOpts" in e;
}
var q = (e, t) => /* @__PURE__ */ Cn(e, t, Oa);
function Ra(e, t, n) {
	try {
		na(-1);
		let r = arguments.length;
		return r === 2 ? A(t) && !D(t) ? ia(t) ? G(e, null, [t]) : G(e, t) : G(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && ia(n) && (n = [n]), G(e, t, n));
	} finally {
		na(1);
	}
}
var za = "3.5.44", Ba = void 0, Va = typeof window < "u" && window.trustedTypes;
if (Va) try {
	Ba = /* @__PURE__ */ Va.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Ha = Ba ? (e) => Ba.createHTML(e) : (e) => e, Ua = "http://www.w3.org/2000/svg", Wa = "http://www.w3.org/1998/Math/MathML", Ga = typeof document < "u" ? document : null, Ka = Ga && /* @__PURE__ */ Ga.createElement("template"), qa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? Ga.createElementNS(Ua, e) : t === "mathml" ? Ga.createElementNS(Wa, e) : n ? Ga.createElement(e, { is: n }) : Ga.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => Ga.createTextNode(e),
	createComment: (e) => Ga.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => Ga.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			Ka.innerHTML = Ha(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = Ka.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ja = "transition", Ya = "animation", Xa = /* @__PURE__ */ Symbol("_vtc"), Za = {
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
}, Qa = /* @__PURE__ */ T({}, hr, Za), $a = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = Qa, e))((e, { slots: t }) => Ra(vr, no(e), t)), eo = (e, t = []) => {
	D(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, to = (e) => e ? D(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function no(e) {
	let t = {};
	for (let n in e) n in Za || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = ro(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: C = v, onAppearCancelled: w = y } = t, ee = (e, t, n, r) => {
		e._enterCancelled = r, oo(e, t ? u : s), oo(e, t ? l : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, oo(e, d), oo(e, p), oo(e, f), t && t();
	}, E = (e) => (t, n) => {
		let i = e ? C : v, o = () => ee(t, e, n);
		eo(i, [t, o]), so(() => {
			oo(t, e ? c : a), ao(t, e ? u : s), to(i) || lo(t, r, h, o);
		});
	};
	return T(t, {
		onBeforeEnter(e) {
			eo(_, [e]), ao(e, a), ao(e, o);
		},
		onBeforeAppear(e) {
			eo(S, [e]), ao(e, c), ao(e, l);
		},
		onEnter: E(!1),
		onAppear: E(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			ao(e, d), e._enterCancelled ? (ao(e, f), mo(e)) : (mo(e), ao(e, f)), so(() => {
				e._isLeaving && (oo(e, d), ao(e, p), to(b) || lo(e, r, g, n));
			}), eo(b, [e, n]);
		},
		onEnterCancelled(e) {
			ee(e, !1, void 0, !0), eo(y, [e]);
		},
		onAppearCancelled(e) {
			ee(e, !0, void 0, !0), eo(w, [e]);
		},
		onLeaveCancelled(e) {
			te(e), eo(x, [e]);
		}
	});
}
function ro(e) {
	if (e == null) return null;
	if (A(e)) return [io(e.enter), io(e.leave)];
	{
		let t = io(e);
		return [t, t];
	}
}
function io(e) {
	return Te(e);
}
function ao(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[Xa] || (e[Xa] = /* @__PURE__ */ new Set())).add(t);
}
function oo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[Xa];
	n && (n.delete(t), n.size || (e[Xa] = void 0));
}
function so(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var co = 0;
function lo(e, t, n, r) {
	let i = e._endId = ++co, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = uo(e, t);
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
function uo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${Ja}Delay`), a = r(`${Ja}Duration`), o = fo(i, a), s = r(`${Ya}Delay`), c = r(`${Ya}Duration`), l = fo(s, c), u = null, d = 0, f = 0;
	t === Ja ? o > 0 && (u = Ja, d = o, f = a.length) : t === Ya ? l > 0 && (u = Ya, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? Ja : Ya : null, f = u ? u === Ja ? a.length : c.length : 0);
	let p = u === Ja && /\b(?:transform|all)(?:,|$)/.test(r(`${Ja}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function fo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => po(t) + po(e[n])));
}
function po(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function mo(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function ho(e, t, n) {
	let r = e[Xa];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var go = /* @__PURE__ */ Symbol("_vod"), _o = /* @__PURE__ */ Symbol("_vsh"), vo = /* @__PURE__ */ Symbol(""), yo = /(?:^|;)\s*display\s*:/;
function bo(e, t, n) {
	let r = e.style, i = k(n), a = !1;
	if (n && !i) {
		if (t) {
			if (k(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? So(r, t, "");
			}
			else for (let e in t) n[e] ?? So(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? So(r, i, "") : Eo(e, i, !k(t) && t ? t[i] : void 0, o) || So(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[vo];
			e && (n += ";" + e), r.cssText = n, a = yo.test(n);
		}
	} else t && e.removeAttribute("style");
	go in e && ((!i || t !== n) && (e[go] = a ? r.display : ""), e[_o] && (r.display = "none"));
}
var xo = /\s*!important$/;
function So(e, t, n) {
	if (D(n)) n.forEach((n) => So(e, t, n));
	else if (n ??= "", t.startsWith("--")) xo.test(n) ? e.setProperty(t, n.replace(xo, ""), "important") : e.setProperty(t, n);
	else {
		let r = To(e, t);
		xo.test(n) ? e.setProperty(ve(r), n.replace(xo, ""), "important") : e[r] = n;
	}
}
var Co = [
	"Webkit",
	"Moz",
	"ms"
], wo = {};
function To(e, t) {
	let n = wo[t];
	if (n) return n;
	let r = ge(t);
	if (r !== "filter" && r in e) return wo[t] = r;
	r = ye(r);
	for (let n = 0; n < Co.length; n++) {
		let i = Co[n] + r;
		if (i in e) return wo[t] = i;
	}
	return t;
}
function Eo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && k(r) && n === r;
}
var Do = "http://www.w3.org/1999/xlink";
function Oo(e, t, n, r, i, a = Ne(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Do, t.slice(6, t.length)) : e.setAttributeNS(Do, t, n) : n == null || a && !Pe(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : oe(n) ? String(n) : n);
}
function ko(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Ha(n) : n);
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
function Ao(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function jo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Mo = /* @__PURE__ */ Symbol("_vei");
function No(e, t, n, r, i = null) {
	let a = e[Mo] || (e[Mo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Io(t);
		r ? Ao(e, n, a[t] = Bo(r, i), s) : o && (jo(e, n, o, s), a[t] = void 0);
	}
}
var Po = /(Once|Passive|Capture)$/, Fo = /^on:?(?:Once|Passive|Capture)$/;
function Io(e) {
	let t, n;
	for (; (n = e.match(Po)) && !Fo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : ve(e.slice(2)), t];
}
var Lo = 0, Ro = /* @__PURE__ */ Promise.resolve(), zo = () => Lo ||= (Ro.then(() => Lo = 0), Date.now());
function Bo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (D(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && jn(e, t, 5, a);
			}
		} else jn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = zo(), n;
}
var Vo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Ho = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? ho(e, r, o) : t === "style" ? bo(e, n, r) : C(t) ? w(t) || No(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Uo(e, t, r, o)) ? (ko(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Oo(e, t, r, o, a, t !== "value")) : e._isVueCE && (Wo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !k(r))) ? ko(e, ge(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Oo(e, t, r, o));
};
function Uo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Vo(t) && O(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Vo(t) && k(n) ? !1 : t in e;
}
function Wo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = ge(t);
	return Array.isArray(n) ? n.some((e) => ge(e) === r) : Object.keys(n).some((e) => ge(e) === r);
}
var Go = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return D(t) ? (e) => Se(t, e) : t;
};
function Ko(e) {
	e.target.composing = !0;
}
function qo(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var Jo = /* @__PURE__ */ Symbol("_assign"), Yo = /* @__PURE__ */ Symbol("_initialValue");
function Xo(e, t, n) {
	return t && (e = e.trim()), n && (e = we(e)), e;
}
var Zo = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[Yo] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[Yo] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[Jo] = Go(i);
		let a = r || i.props && i.props.type === "number";
		Ao(e, t ? "change" : "input", (t) => {
			t.target.composing || e[Jo](Xo(e.value, n, a));
		}), (n || a) && Ao(e, "change", () => {
			e.value = Xo(e.value, n, a);
		}), t || (Ao(e, "compositionstart", Ko), Ao(e, "compositionend", qo), Ao(e, "change", qo));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[Yo];
		delete e[Yo], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[Jo](Xo(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[Jo] = Go(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? we(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, Qo = {
	deep: !0,
	created(e, t, n) {
		e[Jo] = Go(n), Ao(e, "change", () => {
			let t = e._modelValue, n = rs(e), r = e.checked, i = e[Jo];
			if (D(t)) {
				let e = Be(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (re(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(is(e, r));
		});
	},
	mounted: $o,
	beforeUpdate(e, t, n) {
		e[Jo] = Go(n), $o(e, t, n);
	}
};
function $o(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (D(t)) i = Be(t, r.props.value) > -1;
	else if (re(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = ze(t, is(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var es = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ao(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? we(rs(e)) : rs(e)), r = e.multiple, i = r ? re(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? D(i) ? t.slice() : t : i];
			try {
				e[Jo](i);
			} finally {
				Vn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[Jo] = Go(r);
	},
	mounted(e, { value: t }) {
		ns(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[Jo] = Go(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !ts(t, n[1], n[0])) && ns(e, t);
	}
};
function ts(e, t, n) {
	if (!n || D(e)) return ze(e, t);
	if (re(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function ns(e, t) {
	let n = e.multiple, r = D(t);
	if (!n || r || re(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = rs(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Be(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (ze(rs(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function rs(e) {
	return "_value" in e ? e._value : e.value;
}
function is(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var as = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], os = {
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
	exact: (e, t) => as.some((n) => e[`${n}Key`] && !t.includes(n))
}, ss = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = os[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, cs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, ls = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = ve(n.key);
		if (t.some((e) => e === r || cs[e] === r)) return e(n);
	}));
}, us = /* @__PURE__ */ T({ patchProp: Ho }, qa), ds;
function fs() {
	return ds ||= Li(us);
}
var ps = ((...e) => {
	let t = fs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = hs(e);
		if (!r) return;
		let i = t._component;
		!O(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ms(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ms(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function hs(e) {
	return k(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var gs = () => ({
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
}), _s = null;
function J() {
	if (_s) return _s;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = gs();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return _s = /* @__PURE__ */ rn(n), _s;
}
var Y = () => e().saveSettingsDebounced(), vs = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], ys = [
	"auto",
	"on",
	"off"
], bs = ["annotations"], xs = (e) => bs.includes(e.kind), Ss = [
	"keep",
	"truncate",
	"remove"
], Cs = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, ws = [
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
function Ts(e) {
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
			if (i >= e.length) throw new Cs("Unterminated string", e, n);
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
		let i = ws.find((t) => e.startsWith(t, n));
		if (!i) throw new Cs(`Unexpected character '${r}'`, e, n);
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
var Es = {
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
function Ds(e) {
	let t = Ts(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Cs(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Es ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Cs(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Cs("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Es[n];
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
	if (u.k !== "end") throw new Cs("Unexpected token", e, u.pos);
	return l;
}
function Os(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function ks(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function As(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => As(e, t));
		case "var": return t(e.path);
		case "not": return !ks(As(e.e, t));
		case "bin": {
			if (e.op === "&&") return ks(As(e.l, t)) && ks(As(e.r, t));
			if (e.op === "||") return ks(As(e.l, t)) || ks(As(e.r, t));
			let n = As(e.l, t), r = As(e.r, t);
			switch (e.op) {
				case "==": return Os(n, r);
				case "!=": return !Os(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Os(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function js(e, t) {
	return !e || ks(As(e, t));
}
function Ms(...e) {
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
var Ns = /\{\{ap::([^{}]*?)\}\}/g;
function Ps(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Ns, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Ps(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Fs(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Is(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Ls(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Is(n[3] ?? n[4] ?? "");
	return t;
}
function Rs(e, t) {
	let n = [], r = RegExp(`<${Fs(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Ls(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Ls(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function zs(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Bs(e, t) {
	let n = Rs(e, t)[0];
	return n ? Is(n.inner).trim() : void 0;
}
function Vs(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Hs(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
//#endregion
//#region packages/protocol/src/structures.ts
function Us(e, t = (e) => e) {
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
function Ws(e) {
	return e === "memory" || e === "recap";
}
var Gs = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Ks(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Gs(t).trim() || void 0;
		case "recap": return t === null ? null : Gs(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = Gs(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : Gs(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: Gs(e.time),
				location: Gs(e.location),
				event: Gs(e.event),
				summary: Gs(e.summary)
			};
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: Gs(e.label ?? e.title).trim(),
			content: Gs(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, Gs(t)]));
			}
			return Gs(t).trim() || void 0;
	}
}
function qs(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations": return;
		case "reply":
		case "impersonate": return Ks(e.kind, Is(n.inner));
		case "recap": return Ks("recap", Is(n.inner));
		case "memory": return Ks("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Bs(e.inner, "scope"),
			operation: Bs(e.inner, "operation"),
			key: Bs(e.inner, "key"),
			content: Bs(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Bs(n.inner, "time") ?? "",
			location: Bs(n.inner, "location") ?? "",
			event: Bs(n.inner, "event") ?? "",
			summary: Bs(n.inner, "summary") ?? ""
		};
		case "options": return Rs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Is(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Is(t[2]).trim();
				return e;
			}
			return Ks("custom", Is(n.inner), e);
	}
}
function Js(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (xs(a)) continue;
		let t = Rs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = qs(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: zs(e, i),
		values: n,
		open: r
	};
}
function Ys(e) {
	return Is(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
//#endregion
//#region packages/protocol/src/workflow.ts
var Xs = {
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
}, Zs = (e) => e;
function Qs(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function $s(e, t) {
	return e.stages.filter((e) => js(e.when, t));
}
function ec(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function tc(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	let n = ec(t);
	return n >= 0 ? n : t.length - 1;
}
function nc(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function rc(e, t, n = Xs) {
	return Qs(t.field?.name ?? n.turn.field, nc(e, t));
}
function ic(e, t, n = Xs) {
	return Qs(t.tool?.name ?? n.stage.name, nc(e, t));
}
function ac(e, t = Xs) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var oc = (e, t) => t ? {
	...e,
	description: t
} : e;
function sc(e = Xs, t = Zs, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return oc({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: oc({ type: "string" }, i(r.old)),
				new_string: oc({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function cc(e, t, n = Xs, r = Zs) {
	return e.kind === "patch" ? sc(n, r, t) : oc({ type: "string" }, t);
}
function lc(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function uc(e, t, n, r, i = Zs) {
	let a = r.filter((e) => !xs(e)), o = (e, t) => {
		if (e) return i(t ? Qs(e, nc(n, t)) : e).trim() || void 0;
	}, s = tc(t, n), c = (t) => rc(n, t, e), l = (t) => ic(n, t, e), u = (t) => ac(t, e).name, d = (e, t) => {
		for (let n of a) e[n.field] = Us(n, i), Ws(n.kind) || t.push(n.field);
	}, f = () => {
		let t = {}, r = [];
		return n.forEach((n, a) => {
			let l = c(n);
			t[l] = cc(n, o(n.field?.description ?? e.turn.fieldDescription, n), e, i), n.optional || r.push(l), a === s && d(t, r);
		}), s < 0 && d(t, r), {
			type: "object",
			properties: t,
			required: r,
			additionalProperties: !1
		};
	}, p = () => n.map((t, n) => {
		let r = {}, a = [], c = ac(t, e);
		return r[c.name] = cc(t, o(c.description, t), e, i), a.push(c.name), n === s && d(r, a), lc(l(t), o(t.tool?.description ?? e.stage.description, t), {
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
		submitTool: (t) => lc(e.submit.name, o(e.submit.description), t ?? f()),
		stageTools: p,
		envelope: (t) => ({
			type: "object",
			properties: {
				[m.thinking]: oc({ type: "string" }, o(e.envelope.thinking.description)),
				[m.result]: oc(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [m.thinking, m.result],
			additionalProperties: !1
		}),
		envelopeKeys: m,
		toolNames: () => [e.submit.name, ...n.map(l)]
	};
}
function dc(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/turn.ts
function fc(e) {
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
function pc(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Vs(t.content)).trimEnd());
}
function mc(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function hc(e) {
	return e.map((e) => ({
		old_string: Bs(e, "old_string") ?? "",
		new_string: Bs(e, "new_string") ?? ""
	}));
}
function gc(e, t) {
	let n = fc(t.stages), r = Hs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Fs(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Js(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = Rs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = hc(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Is(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = zs(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = ec(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Fs(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), pc(t.stages, n, t.final), mc(t.stages, n, t.final), n;
}
function _c(e, t) {
	let n = fc(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => rc(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (o = e.id, e.kind === "patch" ? n.stages[e.id].patches = vc(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (xs(e)) continue;
		let r = a(e.field), i = Ks(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey === e.field && n.openStructures.push(e.id);
	}
	let s = ec(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : o)), s >= 0 && n.stages[t.stages[s].id].text !== void 0 && (n.contentStarted = !0), pc(t.stages, n, t.final), mc(t.stages, n, t.final), n;
}
function vc(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function yc(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function bc(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = yc(e, n);
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
	let i = n.trim().split(/\s+/).map(Fs), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function xc(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = bc(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Sc(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Fs(t), "gi"), a = [], o;
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
//#region packages/protocol/src/template.ts
var Cc = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, wc = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Tc = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Ec(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => Dc[e]);
}
var Dc = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Oc(e) {
	return e.split(wc).filter((e) => e !== "");
}
var kc = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Ac(e) {
	let t = Oc(kc(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Tc.has(n)) throw new Cc(`Could not find matching close tag for "${e}".`, a);
		}
		let l = e.split("\n").length - 1;
		switch (e) {
			case "<%":
			case "<%_":
				r = "eval";
				break;
			case "<%=":
				r = "escaped";
				break;
			case "<%-":
				r = "raw";
				break;
			case "<%#":
				r = "comment";
				break;
			case "<%%":
				r = "literal", n += "    ; __append(\"<%\")\n";
				break;
			case "%%>":
				r = "literal", n += "    ; __append(\"%>\")\n";
				break;
			case "%>":
			case "-%>":
			case "_%>":
				r === "literal" && o(e), r = null, i = e.startsWith("-") || e.startsWith("_");
				break;
			default: {
				let t = e;
				switch ((r === "eval" || r === "escaped" || r === "raw") && t.lastIndexOf("//") > t.lastIndexOf("\n") && (t += "\n"), r) {
					case "eval":
						n += `    ; ${t}\n`;
						break;
					case "escaped":
						n += `    ; __append(escapeFn(${s(t)}))\n`;
						break;
					case "raw":
						n += `    ; __append(${s(t)})\n`;
						break;
					case "comment": break;
					case "literal":
					case null: o(t);
				}
			}
		}
		l && (a += l, n += `    ; __line = ${a}\n`);
	}), [
		"var __line = 1;",
		"var __output = \"\";",
		"function __append(s) { if (s !== undefined && s !== null) __output += s }",
		"try {",
		"  with (locals || {}) {",
		n,
		"  }",
		"  return __output;",
		"} catch (e) { rethrow(e, __line); }"
	].join("\n");
}
var jc = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Mc = (e, t) => {
	throw new Cc(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Nc = /* @__PURE__ */ new Map(), Pc = 500;
function Fc(e) {
	let t = Nc.get(e);
	if (t) return t;
	let n = Ac(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Cc(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Ec, jc, Mc);
	return Nc.size >= Pc && Nc.clear(), Nc.set(e, i), i;
}
function Ic(e, t) {
	return Fc(e)(t);
}
function Lc(e) {
	try {
		return Fc(e), null;
	} catch (e) {
		return e instanceof Cc ? e : new Cc(String(e));
	}
}
function Rc(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) Rc(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var zc = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, Bc = /^\s*(```|~~~)/;
function Vc(e) {
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
var Hc = /<!--[ \t]*#/g, Uc = /<!--|-->/g;
function Wc(e, t, n) {
	Uc.lastIndex = t;
	for (let t = Uc.exec(e); t; t = Uc.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function Gc(e, t = [], n = 1, r) {
	let i = [{
		tokens: [],
		line: n
	}], a = (e) => {
		if (e.kind === "text" && !e.text) return;
		let t = i[i.length - 1].tokens, n = t[t.length - 1];
		e.kind === "text" && n?.kind === "text" ? n.text += e.text : t.push(e);
	}, o = (e, n, r, o = !1) => {
		if (!e.includes("<!--")) return a({
			kind: "text",
			text: e + n
		});
		let s = [...e.matchAll(zc)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(zc, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...Vc(o),
				raw: o,
				line: r,
				...c ? { alone: c } : {}
			};
			t.includes(s.name) ? i.push({
				head: s,
				tokens: [],
				line: r
			}) : a({
				kind: "directive",
				directive: s
			}), l = n.index + n[0].length;
		}
		c ? o && a({
			kind: "text",
			text: n
		}) : a({
			kind: "text",
			text: e.slice(l) + n
		});
	}, s = e.replace(/\r\n?/g, "\n").split("\n"), c = !1, l;
	return s.forEach((e, t) => {
		let r = t < s.length - 1 ? "\n" : "", i = n + t, u = 0, d = !0, f = !1;
		if (l) {
			let t = Wc(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? Kc(e, t) : t;
		} else if (Bc.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		Hc.lastIndex = u;
		for (let t = Hc.exec(e); t; t = Hc.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = Wc(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? Kc(e, r) : r, Hc.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function Kc(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var qc = [
	"system",
	"user",
	"assistant"
], Jc = ["dialogue", "imperative"];
function Yc(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Ms(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Lc(e.text);
		n && t(`template: ${n.message}`, n.line === void 0 ? e.open : e.line + n.line - 1);
		let a = {
			...r ? { file: r } : {},
			line: e.line
		};
		i[i.length - 1].pieces.push(e.when ? {
			text: e.text,
			when: e.when,
			template: a
		} : {
			text: e.text,
			template: a
		});
	};
	for (let r of e) {
		if (s) {
			r.kind === "text" ? s.text += r.text : r.directive.name === "end" ? c() : t(`@${r.directive.name} cannot be used inside @template (use EJS tags such as <% if (…) { %>)`, r.directive.line);
			continue;
		}
		if (r.kind === "text") {
			let e = o();
			i[i.length - 1].pieces.push(e ? {
				text: r.text,
				when: e
			} : { text: r.text });
			continue;
		}
		let e = r.directive;
		switch (e.name) {
			case "as": {
				let n = e.args[0];
				qc.includes(n) || t(`@as expects one of ${qc.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: qc.includes(n) ? n : void 0,
					pieces: []
				});
				break;
			}
			case "style": {
				let n = e.args[0];
				if (n === "end") {
					a.pop();
					break;
				}
				if (!n || !Jc.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: Ds(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Ds(e.raw);
					n?.(t, e.line), a.push({
						cond: t,
						line: e.line
					});
				} catch (n) {
					t(n.message, e.line), a.push({
						cond: {
							t: "lit",
							v: !1
						},
						line: e.line
					});
				}
				break;
			case "else": {
				let n = a[a.length - 1];
				!n || n.negated ? t("@else without matching @if", e.line) : n.negated = !0;
				break;
			}
			case "end":
				a.length || t("@end without matching @if / @style / @template", e.line), a.pop();
				break;
			case "template":
				(e.args.length || Object.keys(e.attrs).length) && t("@template takes no arguments", e.line), s = {
					text: "",
					line: e.alone ? e.line + 1 : e.line,
					open: e.line,
					when: o()
				};
				break;
			default: t(`unknown directive @${e.name}`, e.line);
		}
	}
	return s &&= (t(`unclosed @template (opened at line ${s.open})`, s.open), void 0), a.length && t(`unclosed @if / @style (opened at line ${a[a.length - 1].line})`), i.filter((e) => e.pieces.some((e) => e.text.trim()));
}
function Xc(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = Gc(e, [], 1, r), a = Yc(i.tokens, r);
	return t && a[0] && !a[0].role && (a[0] = {
		...a[0],
		role: t
	}), {
		content: a,
		errors: n
	};
}
//#endregion
//#region packages/protocol/src/content.ts
function Zc(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => js(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var Qc = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function $c(e) {
	let t = e.entries.flatMap((e) => Qc(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => Qc(e));
		t.push(...Qc(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...Qc(Xc(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function X(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => X(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = X(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function el(e) {
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
function tl(e, t) {
	let n = el(e), r = el(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function nl(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = el(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = tl(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var rl = (e) => !!e && typeof e == "object" && !Array.isArray(e), il = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0
}, al = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function ol(e, ...t) {
	let n = X(e);
	for (let e of t) n = sl(n, e);
	return n;
}
function sl(e, t) {
	if (t === void 0) return e;
	if (!rl(e) || !rl(t)) return X(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = sl(e[r], i);
	return n;
}
function cl(e, t) {
	if (rl(e) && rl(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = cl(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : X(e);
}
function ll(e, t, n = "", r = [], i = ul) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? rl(e[a]) && rl(t[a]) && (ll(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var ul = /* @__PURE__ */ new Set(["sampling"]);
function dl(e, t, n) {
	let r = X(e);
	for (let e of t) if (nl(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && rl(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function fl(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
//#endregion
//#region packages/protocol/src/params.ts
function pl(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function ml(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function hl(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? pl(n) : Array.isArray(e.default) ? pl(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function gl(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function _l(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, hl(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function vl(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function yl(e, t, n) {
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
function bl(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, vl(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = yl(r[t.var], t, e));
	}
	return r;
}
var xl = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Sl(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !xl.test(e);
}
function Cl(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Sl(e) ? e : JSON.stringify(e);
}
var wl = (e) => !e.includes("\n") && Sl(e) ? e : JSON.stringify(e);
function Tl(e) {
	return e.map((e) => `- ${Cl(e, "  ")}`).join("\n");
}
function El(e) {
	return [...e].map(([e, t]) => `${wl(e)}: ${Cl(t, "  ")}`).join("\n");
}
function Dl(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Tl(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? El(e) : t === "keys" ? Tl([...e.keys()]) : t === "values" ? Tl([...e.values()]) : e.get(t) ?? "";
}
function Ol(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/assemble.ts
function kl(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function Al(e, t) {
	return !!e.groups[t]?.allowNone;
}
function jl(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || Al(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => js(e.when, n)) : i;
}
function Ml(e, t) {
	let n = new Set(jl(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function Nl(e, t) {
	let n = new Set(t.flatMap((e) => e.structures));
	return Object.values(e.structures).filter((e) => n.has(e.id));
}
function Pl(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function Fl(e, t, n, r) {
	let { preset: i, config: a, vars: o, data: s = {} } = e, c = (e, t = 0) => {
		let n = i.params.find((t) => t.id === e);
		if (!n) return "";
		let r = hl(n, a.params[e]);
		if (gl(r)) {
			if (n.fallback && t < 4) {
				let e = c(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, l = 0, u = (e) => l > 4 ? e : Ps(e, p), d = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		l++;
		try {
			return Dl(typeof n == "string" ? u(n) : Array.isArray(n) ? n.map(u) : new Map([...n].map(([e, t]) => [e, u(t)])), t);
		} finally {
			l--;
		}
	}, f = o.style, p = (e) => {
		let [r, l, u] = e;
		switch (r) {
			case "name": return Pl(i, a, l);
			case "prefix": return a.identity.prefixes[l] || i.actors[l]?.prefix || `${Pl(i, a, l)}: `;
			case "param": return c(l);
			case "lang": return i.params.some((e) => e.id === "language") && c("language") || "the language used in the story so far";
			case "structure": {
				let e = i.structures[l];
				return e ? u === "last" ? s.customLast?.[l] ?? "" : f === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field : "";
			}
			case "workflow": return l === "hint" ? n?.hint ?? "" : dc(t, (e) => Pl(i, a, e));
			case "input": return l === "text" ? o.input?.shaped ? s.inputText ?? "" : "" : s.metaText ?? "";
			case "memory": return JSON.stringify((l === "global" ? s.memory?.global : s.memory?.chat) ?? {}, null, 2);
			case "recap": return s.recap ?? "";
			case "recent_meta": return s.recentMeta ?? "";
			case "var": return d(l, u);
			default: return;
		}
	};
	return p;
}
function Il(e, t, n, r, i) {
	return Rc({
		...X(e),
		vars: X(Ol(t)),
		sampling: X(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function Ll(e, t, n) {
	return (r) => {
		try {
			return Ic(r.text, e());
		} catch (e) {
			let i = e instanceof Cc ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function Rl(e, t) {
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
function zl(e, t, n, r, i, a) {
	let o = t.sections, s = [...o.preamble ?? [], ...o.intro[r] ?? []];
	return n.forEach((t, c) => {
		let l = o.stages[t.id]?.[r];
		if (l?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? ic(n, t, e.tools) : rc(n, t, e.tools), o = e.stageHeading.replaceAll("{{n}}", String(c + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", Pl(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [u, ...d] = l;
				s.push({
					...u,
					pieces: [{ text: `${o}\n\n` }, ...u.pieces]
				}, ...d);
			} else s.push(...l);
		}
	}), s.push(...o.outro[r] ?? []), s;
}
function Bl(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = kl(i), s = a ? $s(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = kl(i), l = jl(n, r, c), u = Nl(n, l), d = bl(n.vars, l), f = Fl({
		...e,
		vars: i
	}, s, a, d), p = (e) => Ps(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= Il(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !js(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...Zc(e.content, c, p, Ll(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = zl(n, a, s, i.style, i.transport, r);
		for (let n of Zc(t, c, p, Ll(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = Rl(e, v.get(e.id) ?? []));
	return {
		vars: i,
		resolve: c,
		modules: l,
		structures: u,
		buildVars: d,
		workflow: a,
		stages: s,
		regions: y,
		expand: p,
		warnings: h
	};
}
function Vl(e, t, n = {}) {
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
		modules: Ml(e, t),
		params: _l(e, t),
		flags: Object.fromEntries(e.regex.map((e) => [e.id, !1])),
		features: { tokenSaving: t.tokenSaving.enabled },
		stages: {},
		chat: { group: !1 },
		memory: {
			hasChat: !1,
			hasGlobal: !1
		},
		recap: { present: !1 },
		input: { shaped: !1 },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var Hl = /* @__PURE__ */ new Set([
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
]), Ul = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Wl = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Gl = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Kl(e, t = {}) {
	let n = (e) => Kl(e, t);
	if (!Gl(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Gl(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => Ul.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Gl), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return ql({
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
		return ql({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && Hl.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Gl(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Wl[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Gl(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return ql({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), ql(i, a);
}
function ql(e, t) {
	return t && (e.nullable = !0), e;
}
function Jl(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Gl(n)) return e;
		let r = Gl(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: Kl(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/artifact.ts
var Yl = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Xl(e) {
	let t = e.configurationDefaults?.connection;
	return !Yl(t) || Object.keys(il).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...il,
				...t
			}
		}
	};
}
function Zl(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Yl(t) || "userInput" in t) && (!Yl(n) || "userInput" in n)) return e;
	let r = Yl(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Yl(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Yl(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Ql(e) {
	let t = e.configurationDefaults;
	if (!Yl(t)) return e;
	let n = t.cache;
	return Yl(n) && Object.keys(al).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...al,
				...Yl(n) ? n : {}
			}
		}
	};
}
function $l(e) {
	let t = e.configurationDefaults;
	if (!Yl(t)) return e;
	let n = t.meta;
	return Yl(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Yl(n) ? n : {}
			}
		}
	};
}
function eu(e) {
	let t = $l(Ql(Zl(Xl(e)))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function tu(e) {
	return !Yl(e) || typeof e.id != "string" || !Array.isArray(e.entries) ? null : e.formatVersion === 3 ? eu(e) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var nu = "user-", ru = "advanced-preset.user-modules", iu = (e) => `${nu}${e}`;
function au() {
	return {
		match: "all",
		rules: []
	};
}
var ou = ["on", "off"];
function su(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? ou.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function cu(e) {
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
function lu(e, t) {
	let n = cu(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var uu = (e) => ({
	t: "lit",
	v: e
});
function du(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(uu)
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
			r: uu(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function fu(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(su).map((e) => {
		if (e.kind === "keyword") return uu(lu(e, t));
		if (e.kind === "var") return du(e);
		try {
			return Ds(e.source);
		} catch {
			return uu(!1);
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
function pu(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Ds(e.source), null;
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
function mu(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function hu(e, t) {
	return t.entries.filter((t) => !mu(e, t.point));
}
function gu(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function _u(e, t) {
	return (t.vars ?? []).filter((t) => gu(e, t.var)?.type !== t.type);
}
function vu(e, t) {
	return [.../* @__PURE__ */ new Set([...hu(e, t).map((e) => e.point), ..._u(e, t).map((e) => e.var)])];
}
function yu(e) {
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
function bu(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function xu(e, t, n) {
	let r = t.filter((e) => e.enabled && (e.entries.length || e.vars?.length));
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = iu(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: fu(t.trigger, n),
			structures: [],
			vars: (t.vars ?? []).filter((t) => gu(e, t.var)?.type === t.type).map(yu).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = mu(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && bu(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: Xc(n.text, n.role).content
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
function Su(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => Qc(Xc(e.text, e.role).content)));
}
function Cu(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function wu(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Tu(e, t, n) {
	let r = t.filter((e) => nl(n, e.from));
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
				path: Cu(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: wu(t.source, e)
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
var Eu = (e) => !!e && typeof e == "object" && !Array.isArray(e), Du = (e, t = "") => typeof e == "string" ? e : t, Ou = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), ku = [
	"system",
	"user",
	"assistant"
], Au = [
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
function ju(e) {
	if (!Eu(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: Du(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Au.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Ou) : Ou(e.value) && (t.value = e.value), t;
	}
	return null;
}
function Mu(e) {
	if (!Eu(e) || typeof e.var != "string") return [];
	let t = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: Du(e.text)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: t(e.items)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Eu).map((e) => ({
			key: Du(e.key),
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
function Nu(e) {
	if (!Eu(e) || !Array.isArray(e.entries)) return null;
	let t = Eu(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Eu(e)) return [];
		let n = {
			id: Du(e.id) || `e${t + 1}`,
			point: Du(e.point),
			text: Du(e.text)
		};
		return ku.includes(e.role) && (n.role = e.role), [n];
	});
	return {
		id: Du(e.id),
		name: Du(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(Mu) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(ju).filter((e) => !!e) : []
		}
	};
}
function Pu(e, t) {
	return {
		format: ru,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function Fu(e) {
	if (Eu(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Nu).filter((e) => !!e);
		return {
			preset: Eu(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: Du(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Nu(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
var Iu = "{==", Lu = "==}", Ru = "{>>", zu = "<<}", Bu = /\n[ \t]*\n/g;
function Vu(e, t) {
	Bu.lastIndex = t;
	let n = Bu.exec(e);
	return n ? n.index : Infinity;
}
function Hu(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Uu(e, t, n, r) {
	let i = Vu(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function Wu(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(Iu, o)) {
		let t = o + 3, s = Uu(e, t, Lu, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - Hu(n, [Lu]));
			break;
		}
		if (s < 0) {
			let n = Math.min(Vu(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || Ru.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(Ru, l)) {
			let t = l + 3, s = Uu(e, t, zu, n);
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
	} else if (e.startsWith(Ru, o)) {
		let t = o + 3, i = Uu(e, t, zu, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += Ru, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (Iu.startsWith(t) || Ru.startsWith(t))) break scan;
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
function Gu(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function Ku(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function qu(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = Gu(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + Ku(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function Ju(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = qu(e, t);
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
function Yu(e, t) {
	let n = Ju(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${Iu}${t.quote}${Lu}${Ru}${t.comment}${zu}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Xu(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Zu(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function Qu(e, t, n) {
	let r = t?.toLowerCase(), i = r && (e.locales?.[r] ?? e.locales?.[r.split("-")[0]]) || void 0;
	if (i) return i;
	let a = typeof n?.name == "string" && n.name ? n.name : e.name, o = typeof n?.description == "string" && n.description ? n.description : e.description;
	return {
		name: a,
		...o ? { description: o } : {},
		entries: e.entries,
		vars: e.vars,
		trigger: e.trigger
	};
}
function $u(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...X(e)
		})),
		vars: X(e.vars ?? []),
		trigger: e.trigger ? X(e.trigger) : au()
	};
}
function ed(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		entries: e.entries.map(({ point: e, role: t, text: n }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n
		})),
		vars: X(e.vars ?? []),
		trigger: X(e.trigger)
	};
}
function td(e) {
	if (Array.isArray(e)) return e.map(td);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = td(e[n]));
		return t;
	}
	return e;
}
function nd(e) {
	return JSON.stringify(td({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text
		})),
		vars: e.vars ?? [],
		trigger: e.trigger ?? au()
	}));
}
function rd(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, nd(e.locales[t])]);
	return JSON.stringify([
		nd(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function id(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region src/store/presets.ts
var ad = /* @__PURE__ */ rn(/* @__PURE__ */ new Map()), od = /* @__PURE__ */ rn(/* @__PURE__ */ new Map());
async function sd() {
	try {
		let e = `${s()}dist/presets/`, t = await (await g(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = tu(await (await g(e + n, { cache: "no-cache" })).json());
			t && ad.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var cd = (e) => tu(e);
function ld() {
	return [.../* @__PURE__ */ new Set([
		...ad.keys(),
		...Object.keys(J().installed),
		...od.keys()
	])].map((e) => ud(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function ud(e) {
	let t = od.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = fd(e), r = ad.get(e);
	if (n && (!r || tl(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var dd = /* @__PURE__ */ new WeakMap();
function fd(e) {
	let t = J().installed[e];
	if (t) return dd.has(t) || dd.set(t, tu(t)), dd.get(t) ?? void 0;
}
var pd = (e) => ud(e)?.preset;
function md(e) {
	J().installed[e.id] = e, Y();
}
function hd(e) {
	delete J().installed[e], Y();
}
function gd(e, t) {
	e ? od.set(e.id, e) : t ? od.delete(t) : od.clear();
}
var _d = (e) => ad.has(e), vd = {
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
	"presets.export": "Export preset",
	"presets.invalid": "Not an Advanced Preset artifact.",
	"presets.tooNew": "This preset needs Advanced Preset {version} or newer.",
	"presets.none": "No presets yet.",
	"presets.source.builtin": "Built-in",
	"presets.source.installed": "Installed",
	"presets.source.dev": "Dev",
	"presets.templates": "Code",
	"presets.templates.help": "This preset contains templates: JavaScript that runs in your browser on every generation.",
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
	"writing.listPlaceholder": "Type an item, press Enter to add",
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
	"writing.meta.hint": "Out-of-story instructions to the narrator, starting with the trigger (e.g. @Freesia). When off, they are sent as ordinary story input.",
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
	"debug.input.wrap": "Input wrapped",
	"debug.input.extract": "Input extracted",
	"debug.input.none": "Input not shaped",
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
	"um.help": "Add your own prompts at the insertion points this preset offers. They are stored locally and survive preset updates. When the preset offers templates, a new module can start from one. Presets may also ship modules; they are yours to edit like any other. When exporting a preset you can choose which modules go with it.",
	"um.noPoints": "This preset offers no insertion points.",
	"um.new": "New module",
	"um.newName": "My module {n}",
	"um.startFrom": "Start from",
	"um.blank": "Blank module",
	"um.blank.desc": "Write your own from scratch.",
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
	"um.bundled.conflictTitle": "Modules in the preset were updated",
	"um.bundled.conflictBody": "“{name}” updated these modules it ships, and your copies differ from the new versions. Checked modules are replaced with the preset's version (their on / off state is kept); unchecked ones keep your version.",
	"um.bundled.modified": "(edited by you)",
	"um.bundled.unmodified": "(not edited)",
	"um.bundled.apply": "Apply",
	"um.bundled.keepAll": "Keep all mine",
	"um.bundled.added": "Added {n} modules from the preset: {names}",
	"um.bundled.exportTitle": "Export “{name}”",
	"um.bundled.exportBody": "Choose which of your modules to export with the preset. Whoever installs it gets them in their “My modules”.",
	"um.bundled.disabled": "(off)",
	"um.bundled.export": "Export",
	"um.content": "Content",
	"um.content.help": "Pick an insertion point and write the prompt. {{ap::…}} macros and directives such as <!-- @if condition --> … <!-- @end -->, <!-- @as assistant --> or <!-- @template --> … <!-- @end --> (EJS templates: JavaScript that can read params, gen, vars and other variables) work here; <!--# … --> is a note that is never sent (it may span lines). The role follows the point's region unless set.",
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
	"um.op.list.on": "Has items",
	"um.op.list.off": "Empty",
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
	"um.var.inputShaped": "Input shaped",
	"um.var.module": "Module",
	"um.var.param": "Parameter",
	"um.var.flag": "Regex flag",
	"trust.presetTitle": "This preset contains executable code",
	"trust.modulesTitle": "These modules contain executable code",
	"trust.preset": "“{name}”",
	"trust.modules": "This file ({n} module(s))",
	"trust.body": "{what} contains {n} template(s). Templates are JavaScript that runs in your browser on every generation, with the same access to SillyTavern as an extension (your chats, settings and API connections).",
	"trust.risk": "Only continue if you trust where this file comes from. The code:",
	"trust.install": "Trust and install",
	"trust.import": "Trust and import",
	"trust.declined": "Cancelled: the code was not trusted.",
	"warn.template": "A template failed and was left out of the prompt: {error}"
}, yd = {
	en: vd,
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
		"presets.export": "导出预设",
		"presets.invalid": "不是 Advanced Preset 预设文件。",
		"presets.tooNew": "该预设需要 Advanced Preset {version} 或更高版本。",
		"presets.none": "暂无预设。",
		"presets.source.builtin": "内置",
		"presets.source.installed": "已安装",
		"presets.source.dev": "开发",
		"presets.templates": "代码",
		"presets.templates.help": "此预设包含模板：每次生成时会在浏览器中运行的 JavaScript 代码。",
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
		"writing.listPlaceholder": "输入一项，按 Enter 添加",
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
		"writing.meta.hint": "以触发词（如 @Freesia）开头、写给叙述者的故事外指令。关闭后不再识别，按普通故事输入发送。",
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
		"debug.input.wrap": "输入已包裹",
		"debug.input.extract": "输入已提取",
		"debug.input.none": "输入未整形",
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
		"um.help": "在预设开放的插入位置加入你自己的提示词。它们保存在本地，预设更新后仍会保留。预设提供模板时，新建模组可以从模板开始。预设也可以自带模组，它们和你自己的模组一样可以修改；导出预设时可以选择一起导出哪些模组。",
		"um.noPoints": "此预设没有开放插入位置。",
		"um.new": "新建模组",
		"um.newName": "我的模组 {n}",
		"um.startFrom": "从哪里开始",
		"um.blank": "空白模组",
		"um.blank.desc": "从零开始编写。",
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
		"um.bundled.conflictTitle": "预设中的模组有更新",
		"um.bundled.conflictBody": "「{name}」更新了以下随预设提供的模组，你的副本与新版本不同。勾选的模组将换成预设的新版本（保留开关状态），未勾选的保留你的版本。",
		"um.bundled.modified": "（你修改过）",
		"um.bundled.unmodified": "（未修改过）",
		"um.bundled.apply": "应用",
		"um.bundled.keepAll": "全部保留我的",
		"um.bundled.added": "已添加预设提供的 {n} 个模组：{names}",
		"um.bundled.exportTitle": "导出「{name}」",
		"um.bundled.exportBody": "选择要随预设一起导出的自定义模组。对方安装预设时，这些模组会加入他们的「我的模组」。",
		"um.bundled.disabled": "（已关闭）",
		"um.bundled.export": "导出",
		"um.content": "插入内容",
		"um.content.help": "选择预设开放的插入位置并写入提示词。支持 {{ap::…}} 宏，以及 <!-- @if 条件 --> … <!-- @end -->、<!-- @as assistant --> 等指令，以及 <!-- @template --> … <!-- @end --> 模板（EJS 语法的 JavaScript，可读取 params、gen、vars 等变量）；<!--# … --> 为注释（可跨行），不会发送给 AI。角色默认跟随插入位置所在的区域。",
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
		"um.op.list.on": "有内容",
		"um.op.list.off": "为空",
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
		"um.var.inputShaped": "输入已整形",
		"um.var.module": "模组",
		"um.var.param": "参数",
		"um.var.flag": "正则标记",
		"trust.presetTitle": "此预设包含可执行代码",
		"trust.modulesTitle": "这些模组包含可执行代码",
		"trust.preset": "「{name}」",
		"trust.modules": "此文件中的 {n} 个模组",
		"trust.body": "{what}包含 {n} 个模板。模板是 JavaScript 代码，每次生成时在浏览器中运行，拥有与扩展相同的权限（可以访问你的聊天、设置与 API 连接）。",
		"trust.risk": "仅在信任该文件的来源时继续。代码如下：",
		"trust.install": "信任并安装",
		"trust.import": "信任并导入",
		"trust.declined": "已取消：未信任其中的代码。",
		"warn.template": "模板运行出错，已从提示词中略去：{error}"
	}
};
function bd() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Z(e, t = {}) {
	return ((yd[bd()] ?? yd[bd().split("-")[0]])?.[e] ?? vd[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function xd(e) {
	return e.locales?.[bd()] ?? e.locales?.[bd().split("-")[0]];
}
function Sd(e, t, n, r, i) {
	let a = xd(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Cd(e) {
	let t = xd(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function wd(e) {
	let t = xd(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Td(e, t, n) {
	return Qu(t, bd(), xd(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/store/sidecar.ts
var Ed = "advanced_preset";
function Dd(e) {
	let t = e?.extra?.[Ed];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function Od(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: X(n)
		}
	};
}
function kd(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[Ed] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[Ed] = X(n));
}
function Ad(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra?.advanced_preset) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] ? !1 : (delete n.extra[Ed], !0);
}
//#endregion
//#region src/store/eventlog.ts
function jd() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var Md = (e) => `legacy-${e}`;
function Nd(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = Md(n), t = !0);
	}), t;
}
function Pd(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? Md(e.index) : void 0);
}
var Fd = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), Id = "advanced_preset";
function Ld() {
	return e().chatMetadata?.[Id]?.seedEvents ?? [];
}
function Rd(t = Infinity) {
	let n = Ld().map((e) => ({
		at: -1,
		event: e
	}));
	return e().chat.forEach((e, r) => {
		if (!(r > t)) for (let t of Dd(e)?.events ?? []) n.push({
			at: r,
			event: t
		});
	}), n;
}
function zd(e = Infinity) {
	let t = {};
	for (let { event: n } of Rd(e)) n.type === "memory.replace" ? t[n.key] = n.content : n.type === "memory.delete" && delete t[n.key];
	return t;
}
function Bd(e = Infinity) {
	let t = null;
	for (let { at: n, event: r } of Rd(e)) r.type === "recap.set" && (t = r.text ? {
		text: r.text,
		coversUpTo: r.coversUpTo,
		at: n
	} : null);
	return t;
}
async function Vd(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = Dd(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[Id] && (e.extra[Id].events = X(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[Id] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function Hd(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function Ud(e, t, n, r, i, a = jd()) {
	let o = e.globalMemory;
	Nd(o.log);
	let s = Hd(e)[n] ?? null;
	return o.log.splice(o.cursor), o.log.push({
		id: a,
		op: t,
		key: n,
		content: r,
		prev: s,
		source: i,
		at: Date.now()
	}), o.cursor = o.log.length, Y(), o.cursor - 1;
}
var Wd = (e) => e.globalMemory.cursor > 0, Gd = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Kd(e) {
	Wd(e) && (e.globalMemory.cursor--, Y());
}
function qd(e) {
	Gd(e) && (e.globalMemory.cursor++, Y());
}
function Jd(e, t) {
	let n = e.globalMemory.log[Fd(e, t)];
	n && (n.prev === null ? Ud(e, "delete", n.key, void 0, "undo") : Ud(e, "replace", n.key, n.prev, "undo"));
}
function Yd(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = jd();
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
function Xd(e, t) {
	for (let n of t) Fd(e, n.id) < 0 && Ud(e, n.op, n.key, n.content, "model", n.id);
}
function Zd(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[Fd(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Qd(e) {
	let t = J().presets, n = t[e.id];
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
	}, Y()), Nd(n.globalMemory.log) && Y(), n;
}
function $d(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : fl(e, n.id)?.diff;
}
function ef(e, t = Qd(e).active.ref) {
	return ol(e.configurationDefaults, $d(e, Qd(e), t));
}
function tf(e) {
	let t = Qd(e);
	return ol(ef(e, t.active.ref), t.active.diff);
}
function nf(e, t) {
	let n = Qd(e);
	n.active.diff = cl(t, ef(e, n.active.ref)) ?? {}, Y();
}
function rf(e, t) {
	let n = tf(e);
	return t(n), nf(e, n), n;
}
function af(e, t) {
	let n = Qd(e);
	n.active = {
		ref: t,
		diff: {}
	}, Y();
}
var of = (e) => Object.keys(Qd(e).active.diff ?? {}).length > 0;
function sf(e) {
	Qd(e).active.diff = {}, Y();
}
function cf(e, t) {
	let n = Qd(e), r = tf(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: cl(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, Y(), i;
}
function lf(e, t) {
	let n = Qd(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = cl(tf(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), Y());
}
function uf(e, t, n) {
	let r = Qd(e).saved.find((e) => e.id === t);
	r && (r.name = n, Y());
}
function df(e, t) {
	let n = Qd(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), Y();
}
function ff(e) {
	let t = Qd(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = tl(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? dl(t, e.migrations, n) : X(t);
		i.push(...ll(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !ml(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Tu(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && vu(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, Y(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && h("warning", Z("um.lostAfterUpdate", { names: s.join(", ") }), Cd(e)), i;
}
//#endregion
//#region src/store/carrier.ts
var pf = "advanced_preset", mf = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, hf = (e) => mf[e] ?? e, gf = () => e().getPresetManager("openai"), _f = (e) => `AP · ${e.name}`;
function vf() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function yf(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function bf(e, t) {
	let n = e.carrier.prompt_order.map((e) => ({ ...e }));
	return {
		...X(t.sampling),
		prompts: X(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: X(n)
		})),
		extensions: { [pf]: {
			presetId: e.id,
			version: e.version,
			hash: e.hash
		} }
	};
}
function xf(e) {
	let t = gf();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function Sf(e, t, n) {
	let r = gf();
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
async function Cf(e, t = {}) {
	let n = gf(), r = Qd(e), i = xf(e.id), a = i ?? _f(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[pf], c = !o || t.force || s?.hash !== e.hash, l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && yf(o) !== r.carrierHash && h("info", Z("carrier.reset", { name: a }));
		let n = bf(e, tf(e));
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = yf(n), Y(), await Sf(a, n, !!t.select || l);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
async function wf(e) {
	await Cf(e, { select: !0 });
}
async function Tf(e) {
	let t = xf(e.id);
	if (!t) return;
	let n = gf(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = tf(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...X(i)
	}, o = n.getSelectedPresetName() === t;
	Ef = !0;
	try {
		await Sf(t, a, o);
	} finally {
		Ef = !1;
	}
}
var Ef = !1;
function Df(t) {
	if (Ef || vf() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = tf(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[hf(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = X(r));
	}
	return Object.keys(i).length ? (rf(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var Of = null, kf = (e) => {
	Of = e;
}, Af = () => {
	let e = Of;
	return Of = null, e;
}, jf = (e) => e.meta?.enabled !== !1;
function Mf(t, n) {
	if (!jf(n)) return "";
	let r = Ps(t.meta.trigger, (e) => e[0] === "name" ? Pl(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function Nf(e, t, n, r, i, a = [], o = !0) {
	let s = Sc(n, Mf(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = kl(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && js(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && js(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && js(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? Af() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function Pf(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Ff = 0, If = () => `ap-${Date.now().toString(36)}-${(++Ff).toString(36)}`, Lf = /* @__PURE__ */ new Map(), Rf = null, zf = null, Bf = {
	setPending(e) {
		Rf = e;
	},
	takePending() {
		let e = Rf;
		return Rf = null, e;
	},
	peekPending: () => Rf,
	arm(e) {
		zf = e, Lf.set(e.id, e);
	},
	takeArmed() {
		let e = zf;
		return zf = null, e;
	},
	get: (e) => Lf.get(e),
	release(e) {
		Lf.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of Lf) t - r.createdAt > e && Lf.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Vf(e) {
	return (e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`) + (e.body === "full" && e.synopsis ? "y" : "") + (e.body === "full" && e.annotations ? "a" : "");
}
function Hf(e) {
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
var Uf = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, Wf = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]);
function Gf(e, t, n = "") {
	return e.replace(/\{\{(time|location|event|summary|content)\}\}/g, (e, r) => r === "content" ? n : t[r] ?? "");
}
var Kf = (e, t) => t ? Uf(e)?.structures?.[t] : void 0;
function qf(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Uf(e);
		if (a && Wf.has(a.turn)) {
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
		let n = Sc(e.item.mes, t.trigger, t.wrap);
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
				} else Kf(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && Uf(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	let o = t.synopsisHistory;
	if (o && t.synopsisId) for (let e of a(o.depth)) e.fresh.body === "full" && Kf(e.item, t.synopsisId) && (e.fresh.synopsis = !0);
	return i;
}
function Jf(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Kf(r, n.synopsisId);
			return e ? Gf(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? Uf(r)?.annotations : void 0;
			i?.length && (e = Yu(e, i));
			let a = t.synopsis ? Kf(r, n.synopsisId) : void 0;
			return a && (e = Gf(n.synopsisHistory?.template ?? n.synopsisHistoryTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}", a, e)), e;
		}
	}
}
function Yf(e, t) {
	let n = [];
	for (let r of qf(e, t)) {
		let e = Jf(r, r.fresh, t);
		e !== null && n.push(e === r.item.mes ? r.item : {
			...r.item,
			mes: e
		});
	}
	return n;
}
function Xf(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations");
	if (n?.history) return jl(e, t).some((e) => e.structures.includes(n.id)) ? { depth: n.history } : void 0;
}
function Zf(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "synopsis"), r = {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: n?.id,
		synopsisHistoryTemplate: n?.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	};
	return n?.history && jl(e, t).some((e) => e.structures.includes(n.id)) && (r.synopsisHistory = {
		depth: n.history,
		template: n.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}"
	}), r;
}
var Qf = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function $f(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function ep(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = $f(e), r = $f(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function tp(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Qf(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Qf(l.text);
			if (c === u || c.includes(u) || ep(c, u) >= n) {
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
var np = 50;
function rp(e) {
	let t = Qd(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var ip = () => Math.random().toString(36).slice(2, 8);
function ap(e) {
	let t = new Set(e), n = ip();
	for (; t.has(n);) n = ip();
	return n;
}
function op(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: ap(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function sp(e, t) {
	let n = rp(e), r = {
		id: ap(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: au()
	};
	return e.insertionPoints.length && r.entries.push(op(e, r)), n.push(r), Y(), n[n.length - 1];
}
function cp(e, t) {
	let n = rp(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push($u(t, ap(n.map((e) => e.id)), { name: i })), Y(), n[n.length - 1];
}
function lp(e, t, n) {
	let r = rp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...X(r[i]),
		id: ap(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), Y(), r[i + 1];
}
function up(e, t) {
	let n = Qd(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), Y();
}
function dp(e, t, n) {
	let r = rp(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), Y();
}
function fp(e, t) {
	return Pu(X(rp(e).filter((e) => !t || t.includes(e.id))), e);
}
function pp(e, t) {
	let n = Fu(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && tl(n.preset.version, e.version) < 0 && (r = Tu(r, e.migrations, n.preset.version));
	let i = rp(e), a = r.map((e) => {
		let t = {
			...e,
			id: ap(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return Y(), {
		added: a,
		missing: a.filter((t) => vu(e, t).length).length
	};
}
function mp(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < np; t--) {
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
var hp = "advanced-preset.cache.v1", gp = 864e5, _p = 30, vp = null;
function yp() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function bp() {
	if (vp) return vp;
	try {
		let e = yp()?.getItem(hp), t = e ? JSON.parse(e) : {};
		vp = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		vp = {};
	}
	return vp;
}
function xp(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= gp).sort((e, t) => t[1].at - e[1].at).slice(0, _p);
	vp = Object.fromEntries(n);
	try {
		yp()?.setItem(hp, JSON.stringify(vp));
	} catch {}
}
function Sp() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
function Cp(e) {
	return bp()[e];
}
function wp(e, t) {
	xp({
		...bp(),
		[e]: t
	}, t.at);
}
function Tp(e, t) {
	let n = bp()[e];
	n && wp(e, {
		...n,
		at: t
	});
}
//#endregion
//#region src/core/cache.ts
function Ep(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Dp(e, t) {
	return e.send_date ? Ep(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var Op = 57344, kp = /⟦([\uE000-\uF8FF])⟧/g, Ap = (e) => `⟦${String.fromCharCode(Op + e)}⟧`;
function jp(e) {
	let t = [];
	return {
		text: e.replace(kp, (e, n) => (t.push(n.charCodeAt(0) - Op), "")),
		marks: t
	};
}
function Mp(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of qf(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : Hf(n?.[e]), l = c ?? s.fresh, u = Jf(s, s.fresh, t), d = c ? Jf(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Vf(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: Vf(l),
			freshMode: Vf(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function Np(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function Pp(e, t, n, r, i, a = {}) {
	let o = Np(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && Ep(i) === n[r]) r++;
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
		r !== null && f.push(Ep(r));
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
function Fp(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/core/input-shaping.ts
var Ip = "⟦󰀀⟧", Lp = "⟦󰀁⟧", Rp = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function zp(e) {
	let t = e.match(Rp)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + Ip + t;
}
var Bp = (e) => e.replaceAll(Ip, "");
function Vp(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = Bp(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = Bp(e.text));
}
function Hp(e, t, n, r) {
	let i = [...new Set(r.map((e) => e.replace(/\r/g, "")))].filter((e) => e.trim()).sort((e, t) => t.length - e.length);
	for (let r = Math.min(n, e.length) - 1; r >= Math.max(0, t); r--) {
		let t = e[r].content, n = typeof t == "string" ? [{
			part: -1,
			text: t
		}] : Array.isArray(t) ? t.map((e, t) => ({
			part: t,
			text: e && typeof e == "object" && typeof e.text == "string" ? e.text : ""
		})) : [];
		for (let { part: e, text: t } of n) {
			let n = t.lastIndexOf(Ip);
			if (n < 0) continue;
			let a = Bp(t.slice(0, n)).replace(Rp, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: Bp(t.slice(n + 4))
			};
		}
	}
	return null;
}
var Up = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function Wp(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? id(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && Up(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (Up(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/interceptor.ts
async function Gp(t, n, r, i) {
	if (Bf.setPending(null), !J().enabled) return;
	let a = vf(), o = a ? pd(a) : void 0;
	if (!o) return;
	let s = tf(o), c = i || "normal";
	c === "swipe" && Ad(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = u >= 0 ? t[u].mes : "", f = t.slice(-6).map((e) => e.mes), p = mp(t, u), { meta: m, flags: h, origin: g } = Nf(o, s, d, c, !0, f), _ = e().chat, v = t.map((e) => _.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), y = {
		trigger: Mf(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Zf(o, s),
		recap: Bd(),
		realIndex: (e) => v[e] ?? -1,
		currentInput: u,
		annotations: Xf(o, s)
	}, b, x, S = -1, C = [];
	if (s.cache?.enabled) {
		let e = Sp(), n = Mp(t, y, Cp(e)?.modes, (e) => Dp(t[e], v[e] ?? e));
		if (x = n.out.map(({ item: e, entry: t }) => t === void 0 ? e : {
			...e,
			mes: e.mes + Ap(t)
		}), S = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, S >= 0) {
			let e = n.out[S], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			C = t ? [
				t.given,
				t.sticky,
				t.fresh
			].filter((e) => typeof e == "string") : [e.item.mes];
		}
		b = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else {
		x = Yf(t, y);
		let e = u >= 0 ? t[u] : void 0;
		S = e ? x.findLastIndex((t) => t === e || t.is_user && t.send_date === e.send_date && t.name === e.name) : -1, S >= 0 && (C = [x[S].mes]);
	}
	let w;
	o.inputShaping && S >= 0 && C.some((e) => e.trim()) && (x[S] = {
		...x[S],
		mes: zp(x[S].mes)
	}, w = { texts: C }), t.splice(0, t.length, ...x);
	let T = {
		id: If(),
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
		input: w,
		createdAt: Date.now(),
		warnings: []
	};
	Bf.setPending(T);
}
//#endregion
//#region src/core/debug.ts
var Kp = /* @__PURE__ */ rn({
	log: [],
	requests: []
}), qp = 50;
function Jp(e, t) {
	Kp.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), Kp.log.length > qp && (Kp.log.length = qp);
}
function Yp(e) {
	return Kp.requests.unshift(e), Kp.requests.length > qp && (Kp.requests.length = qp), Kp.requests[0];
}
//#endregion
//#region src/core/transports/tool-args.ts
var Xp = "stream_function_call_arguments";
function Zp(e, t, n) {
	return e === "off" || t !== "gemini" ? !1 : e === "on" || n === "vertexai";
}
function Qp(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function $p(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Xp] = !0, t() && em(e));
}
function em(e) {
	let t = tm(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Qp(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function tm(e) {
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
function nm(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of uc(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function rm(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function im(e) {
	return uc(e.preset.tools, e.workflow, e.stages, e.structures, rm(e));
}
function am(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${Pl(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function om(e, t, n) {
	let r = Qs(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return rm(e)(r);
}
function sm(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = r.config.connection.sendThoughtSignature && i === "gemini" ? o.thoughtSignature : void 0, l = rm(r), u = l(o.tool.description);
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
				content: om(r, o.response[t], { first: n })
			}
		]
	};
}
function cm(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	return delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t), e.family === "gemini" && lm(n, e.ctx.preset.tools.jsonStringHint), Zp(e.ctx.config.connection.streamToolArguments, e.family, String(n.chat_completion_source ?? "")) && $p(n), n;
}
function lm(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Jl(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: Kl(e.json_schema.value, n)
	});
}
function um(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var dm = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", fm = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(Ip, ""), pm = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(kp.source).test(e);
function mm(e) {
	for (let t of e) if (typeof t.content == "string") pm(t.content) && (t.content = jp(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && pm(e.text) && (e.text = jp(e.text).text);
}
function hm(e) {
	if (typeof e.content == "string") {
		if (!pm(e.content)) return null;
		let { text: t, marks: n } = jp(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => Fp(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !pm(e.text)) return;
		let i = jp(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = Fp(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function gm(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = im(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return Ep(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function _m(e) {
	return Ep(e.map((e) => `${e.role}\u0000${dm(e.content)}`).join(""));
}
function vm(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return mm(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = hm(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = fm(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = fm(i.content);
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
			sticky: fm(f),
			fresh: fm(p),
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
		tools: gm(e),
		prompt: _m(t.slice(0, n))
	}, p = Pp(l, Cp(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function ym(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Tp(n.chat, t) : wp(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/core/assembler.ts
var bm = /⟦ap:region:([\w.-]+)⟧/g, xm = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function Sm(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(bm)) {
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
function Cm(t, n) {
	if (!jf(n)) return "";
	let r = Object.values(t.structures).find((e) => e.kind === "reply")?.id, i = e().chat, a = [], o = Pl(t, n, t.user), s = Pl(t, n, t.narrator);
	for (let e = i.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = Dd(i[e]);
		if (!t?.metaInput?.length) continue;
		let n = r ? t.structures?.[r] : void 0, c = typeof n == "string" ? Ys(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function wm(t) {
	let n = {}, r = Object.values(t.structures).filter((e) => e.kind === "custom");
	if (!r.length) return n;
	for (let t of e().chat) {
		let e = Dd(t);
		for (let t of r) {
			let r = e?.structures?.[t.id];
			r != null && r !== "" && (n[t.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2));
		}
	}
	return n;
}
function Tm(t, n) {
	let { preset: r, config: i } = t, a = zd(), o = Hd(Qd(r)), s = Bd(), c = Cm(r, i), l = t.transport;
	return {
		vars: Vl(r, i, {
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
			recap: { present: !!s },
			input: { shaped: !!t.inputShaped }
		}),
		data: {
			metaText: t.meta.segments.join("\n\n"),
			memory: {
				chat: a,
				global: o
			},
			recap: s?.text ?? "",
			recentMeta: c,
			customLast: wm(r),
			inputText: t.inputShaped ? Lp : ""
		}
	};
}
function Em(t, n) {
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
	})).filter(({ m: e }) => !e.is_system), { map: l, rate: u } = tp(s.map(({ m: e }) => ({
		role: e.role,
		text: xm(e.content)
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
			mes: xm(s[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let f = d.map((e) => c[l[e.__h]].index), p = {
		trigger: Mf(r, i),
		wrap: r.meta.wrap,
		tokenSaving: i.tokenSaving,
		...Zf(r, i),
		recap: Bd(),
		realIndex: (e) => f[e] ?? -1,
		currentInput: -1,
		annotations: Xf(r, i)
	}, m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
	if (i.cache?.enabled) {
		let e = Sp(), n = Mp(d, p, Cp(e)?.modes, (e) => Dp(d[e], f[e] ?? e));
		for (let e of n.out) {
			let t = d[e.index].__h;
			m.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + Ap(e.entry));
			let r = e.entry === void 0 ? void 0 : n.entries[e.entry];
			h.set(t, r ? [
				r.given,
				r.sticky,
				r.fresh
			].filter((e) => typeof e == "string") : [e.item.mes]);
		}
		t.sticky = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else for (let e of Yf(d, p)) m.set(e.__h, e.mes), h.set(e.__h, [e.mes]);
	if (r.inputShaping && c.length && c[c.length - 1].m.is_user) {
		let e = l.indexOf(c.length - 1), n = h.get(e);
		e >= 0 && m.has(e) && n?.some((e) => e.trim()) && !s.slice(e + 1).some(({ m: e }) => e.role === "user") && (m.set(e, zp(m.get(e))), t.input = { texts: n });
	}
	let g = /* @__PURE__ */ new Set();
	d.forEach((e) => {
		let t = s[e.__h];
		m.has(e.__h) ? t.m.content = m.get(e.__h) : g.add(t.i);
	});
	for (let e of [...g].sort((e, t) => t - e)) n.splice(e, 1);
}
function Dm(t, n) {
	let r = n ? null : Bf.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = tf(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = Nf(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: If(),
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
		keywords: mp(a, n ? o : -1)
	};
}
var Om = Symbol("ap-region");
function km(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function Am(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? Hp(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (Vp(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(Lp) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		Wp(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(Lp, () => c) : e;
		for (let t of n) if (typeof t.content == "string") t.content = e(t.content);
		else if (Array.isArray(t.content)) for (let n of t.content) n && typeof n == "object" && typeof n.text == "string" && (n.text = e(n.text));
		for (let t of a.regions) for (let n of t.messages) n.content.includes("⟦󰀁⟧") && (n.content = e(n.content), n.chars = n.content.length);
		let r = t.assembly;
		if (r) {
			let t = r.expand;
			r.expand = (n) => e(t(n));
		}
	}
	return {
		mode: o.mode,
		shaped: !!(s && l),
		chars: c.length
	};
}
function jm(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => xm(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${Pl(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = xm(t.content);
		if (t[Om] || t.role === "system") return n;
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
var Mm = /* @__PURE__ */ new Set();
function Nm(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !Mm.has(n) && (Mm.add(n), h("warning", Z("warn.template", { error: n }), Z("app.name")));
}
async function Pm(t) {
	let { chat: n, dryRun: r } = t;
	if (!J().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		mm(n), Vp(n), r || (Bf.setPending(null), Bf.takeArmed());
		return;
	}
	let i = vf(), a = i ? pd(i) : void 0;
	if (!a) {
		let e = Sm(n).filter((e) => !e.__anchor);
		mm(e), Vp(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = Dm(a, r), s = Sm(n);
	!o.interceptorRan && !r && Em(o, s);
	let c = o.stType === "continue" || o.stType === "impersonate", l = c ? void 0 : Pf(a, o.config, o.origin), u = a.inputShaping, d = km(a, s), f = u && o.input ? Hp(s, d.from, d.to, o.input.texts) : null;
	u && o.input && !f && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!f;
	let { vars: p, data: m } = Tm(o, l), h = xu(a, rp(a), o.keywords);
	for (let e of h.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let g = Bl({
		preset: h.preset,
		config: o.config,
		vars: p,
		data: m
	}, l);
	g.warnings.length && Nm(g.warnings, o.warnings), o.workflow = l, o.assembly = g, o.stages = g.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : g.structures;
	let _ = (t) => e().substituteParams(t), v = [], y = -1, b = -1, x = {
		genId: o.id,
		at: Date.now(),
		dryRun: r,
		origin: o.origin,
		transport: o.transport,
		workflow: l?.id ?? "",
		modules: g.modules.map((e) => e.id),
		regions: [],
		warnings: o.warnings,
		vars: Object.entries(g.buildVars).map(([e, t]) => ({
			id: e,
			text: Dl(t)
		}))
	};
	for (let e of s) {
		if (!e.__anchor) {
			v.push(e);
			continue;
		}
		let t = e.__anchor;
		t === a.anchors.historyEnd && b < 0 && (b = v.length);
		let n = (g.regions[t] ?? []).map((e) => {
			let t = {
				role: e.role,
				content: _(e.content)
			};
			return Object.defineProperty(t, Om, { value: !0 }), t;
		}).filter((e) => xm(e.content).trim());
		x.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: xm(e.content).length,
				content: xm(e.content)
			}))
		}), v.push(...n), t === a.anchors.historyStart && (y = v.length);
	}
	let S = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(g.regions)) !S.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	x.cache = vm(o, v, y, b < 0 ? v.length : b), x.input = Am(o, v, y, b < 0 ? v.length : b, x);
	let C = o.transport === "prefill" && !c && y >= 0 ? jm(o, v, y) : v;
	n.splice(0, n.length, ...C.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), Jp("assembly", x), !r && !c && l && Bf.arm(o);
}
//#endregion
//#region src/core/transports/text.ts
function Fm(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = am(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => gc(e, {
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
			content: Qs(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), cm({
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
			let n = um(t, e.caller);
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
var Im = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Lm = 32, Rm = 10, zm = 9, Bm = 13, Vm = 160, Hm = 6158, Um = 8192, Wm = 8203, Gm = 8239, Km = 8287, qm = 12288, Jm = 65279;
function Ym(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Xm(e) {
	return e >= "0" && e <= "9";
}
function Zm(e) {
	return e >= " ";
}
function Qm(e) {
	return ",:[]/{}()\n+".includes(e);
}
function $m(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function eh(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var th = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, nh = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function rh(e) {
	return ",[]/{}\n+".includes(e);
}
function ih(e) {
	return uh(e) || ah.test(e);
}
var ah = /^[[{\w-]$/;
function oh(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function sh(e, t) {
	let n = e.charCodeAt(t);
	return n === Lm || n === Rm || n === zm || n === Bm;
}
function ch(e, t) {
	let n = e.charCodeAt(t);
	return n === Lm || n === zm || n === Bm;
}
function lh(e, t) {
	let n = e.charCodeAt(t);
	return n === Vm || n === Hm || n >= Um && n <= Wm || n === Gm || n === Km || n === qm || n === Jm;
}
function uh(e) {
	return dh(e) || ph(e);
}
function dh(e) {
	return e === "\"" || e === "“" || e === "”";
}
function fh(e) {
	return e === "\"";
}
function ph(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function mh(e) {
	return e === "'";
}
function hh(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function gh(e, t) {
	let n = e.length;
	if (!sh(e, n - 1)) return e + t;
	for (; sh(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function _h(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function vh(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var yh = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function bh(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = yh[n];
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
function xh(e) {
	return e !== null && e.char === "\"";
}
function Sh(e) {
	return e !== null && e.char === "'";
}
function Ch(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function wh(e, t) {
	switch (t) {
		case ")": return Ch(e, "(") > Ch(e, ")");
		case "]": return Ch(e, "[") > Ch(e, "]");
		case "}": return Ch(e, "{") > Ch(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Th = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, Eh = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Dh(e) {
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
	for (r && a(), ih(e[t]) && vh(n) ? (r || (n = gh(n, ",")), g()) : r && (n = hh(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? sh : ch, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (lh(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Oh(e, t);) t++;
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
			if ($m(e[t])) for (; t < e.length && eh(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = gh(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = hh(n, ",")) : ne();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (ih(e[t]) || c ? n = gh(n, ":") : re()), i() || (s || c ? n += "null" : re()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = gh(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = gh(n, ",")), p(), !i()) {
					r || (n = hh(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = gh(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = gh(n, ",")), t = i();
		t || (n = hh(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, uh(e[t]) || E());
		let s = e[t] === "&" ? bh(e.slice(t, t + 12)) : null, c = xh(s) || Sh(s);
		if (uh(e[t]) || c) {
			let l = fh(e[t]) ? fh : mh(e[t]) ? mh : ph(e[t]) ? ph : dh, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = w(t - 1);
					return !r && Qm(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = gh(p, "\""), n += p, !0);
				}
				if (t === i) return p = gh(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? bh(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Qm(e[t]) && !wh(p, e[t]) || uh(e[t]) && !T(t) || Xm(e[t])) return v(), !0;
					e[t] === "\\" && E();
					let s = w(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Qm(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && rh(e[t])) {
					if (e[t - 1] === ":" && th.test(e.substring(u + 1, t + 2))) for (; t < e.length && nh.test(e[t]);) p += e[t], t++;
					return p = gh(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : oh(e) ? p += Th[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (Eh[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && Ym(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : ie();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : oh(n) ? (p += Th[n], t++) : (Zm(n) || te(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = hh(n, "\"", !0);
			let e = n.length;
			n = _() ? _h(n, e, 1) : gh(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Xm(e[t]) && ee() && (i += "0")), e[t] === "0" && Xm(e[t + 1]) && (a = !0); Xm(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Xm(e[t]) || (i += "0"); Xm(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Xm(e[t]) || (i += "0"); Xm(e[t]);) i += e[t], t++;
			return ee() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !eh(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if ($m(e[t])) {
			for (; t < e.length && eh(e[t]);) t++;
			let n = t;
			for (; sh(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !rh(e[t]) && !uh(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && th.test(e.substring(a, t + 2))) for (; t < e.length && nh.test(e[t]);) t++;
		if (t > a) {
			for (; sh(e, t - 1) && t > 0;) t--;
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
		for (; n > 0 && sh(e, n);) n--;
		return n;
	}
	function T(t) {
		let n = t + 1;
		for (; n < e.length && sh(e, n);) n++;
		return n >= e.length || Qm(e[n]);
	}
	function ee() {
		return t >= e.length || Qm(e[t]) || sh(e, t);
	}
	function te(e) {
		throw new Im(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function E() {
		throw new Im(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function D() {
		throw new Im("Unexpected end of json string", e.length);
	}
	function ne() {
		throw new Im("Object key expected", t);
	}
	function re() {
		throw new Im("Colon expected", t);
	}
	function ie() {
		throw new Im(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Oh(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function kh(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Ah(e, t) {
	let n = kh(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Dh(n));
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
function jh(e, t, n, r) {
	let i = fc(e.stages), a = e.stages.find((e) => e.kind === "text"), o = n?.[t.envelopeKeys.thinking];
	a && typeof o == "string" && (i.stages[a.id] = {
		text: o,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && i.stages[t.id].status !== "done" && (i.stages[t.id].status = t.optional ? "pending" : "missing");
	return i.current = r ? null : a?.id ?? null, i;
}
function Mh(e) {
	let { ctx: t, caller: n } = e, r = im(t), i = r.schema(), a = n.schema ? r.envelope(n.schema.value) : i.value, o = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, s = null, c = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", l = (e, i) => {
		let a = Ah(c(e), i);
		return s = a.value, n.schema ? jh(t, r, a.value, i) : _c(a.value, {
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
		body: () => cm(e, { json_schema: u }),
		progress: (e, t) => (o = e, l(e, t)),
		complete: () => ({ done: !0 }),
		result: () => l(o, !0),
		rawText: () => o.text,
		callerResult: () => s?.[r.envelopeKeys.result]
	};
}
//#endregion
//#region src/core/transports/tools.ts
var Nh = (e, t) => ({
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
function Ph(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Fh(e) {
	let { ctx: t, caller: n } = e, r = im(t), i = r.submitTool(n.schema ? r.envelope(n.schema.value) : void 0), a = i.function.name, o = sm(e, "single", a), s = [
		...o ? [o.tool] : [],
		i,
		...n.tools
	], c = [...e.messages, ...o?.messages ?? []], l = t.config.connection.forceTool && !n.tools.length, u = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, d = null, f = (e, i) => {
		let o = Ah((e.toolCalls.find((e) => e.name === a) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", i);
		return d = o.value, n.schema ? jh(t, r, o.value, i) : _c(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf
		});
	};
	return {
		body: () => cm(e, {
			messages: c,
			tools: s,
			tool_choice: l ? {
				type: "function",
				function: { name: a }
			} : "auto"
		}),
		progress: (e, t) => (u = e, f(e, t)),
		complete: (e) => {
			let t = um(e, n);
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
function Ih(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = im(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = sm(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = tc(t.workflow, r), m = new Map(r.map((e) => [s.toolOf(e), e])), h = {}, g = [], _ = !1, v = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, y = () => r.find((e) => !e.optional && h[s.fieldOf(e)] === void 0), b = () => {
		let e = y();
		return e ? s.toolOf(e) : "";
	}, x = (e, t, n) => {
		let a = m.get(t.name);
		if (!a) return;
		let o = Ah(t.arguments, n).value ?? {}, c = s.fieldOf(a), l = o[s.paramOf(a)];
		if (l !== void 0 && (e[c] = l), r.indexOf(a) === p) for (let t of i) o[t.field] !== void 0 && (e[t.field] = o[t.field]);
		return c;
	}, S = (e, a, o) => n.schema ? jh(t, s, e, a) : _c(e, {
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
			return cm({
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
			let i = Ph(e.toolCalls.filter((e) => e.name), r), o = um(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && g.push(e.text.trim());
			let s = i.filter((e) => m.has(e.name));
			if (s.length) {
				f.push(Nh(e, i));
				for (let e of i) {
					x(h, e, !0);
					let n = m.has(e.name), r = b(), i = om(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
					content: om(t, a.tools.results.nudge, {
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
function Lh(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Fm(e);
		case "structured": return Mh(e);
		case "tool-single": return Fh(e);
		case "tool-multi": return Ih(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Rh(e, t) {
	let n = t ? c({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? f(n) : u(n);
}
var zh = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Bh(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, zh({
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
			})), a = () => n === null ? "" : (n = null, zh({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + zh({
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
				text: (e) => e ? o("text") + zh({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + zh({
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
					for (let i of e) t++, r = !0, n += zh({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + zh({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + zh({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => zh({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + zh({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + zh({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? zh({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? zh({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? zh({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: Vh(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => zh({ error: { message: e } }),
			end: (e) => e ? zh({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? zh({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => zh({
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
			error: (e) => zh({ error: { message: e } }),
			end: (e) => zh({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? zh({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? zh({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? zh({ choices: [{
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
			error: (e) => zh({ error: { message: e } }),
			end: (e) => (e ? zh({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + zh("[DONE]")
		};
	}
}
function Vh(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Hh(e, t) {
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
			input: Vh(e.arguments)
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
					args: Vh(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Uh(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function Wh(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Gh(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Kh = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = Wh(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Gh(t);
			if (r) {
				let t = this.open.has(e) ? qh(this.value, n) : void 0;
				Jh(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function qh(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function Jh(e, t, n) {
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
var Yh = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Xh(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Yh(t) ? t : void 0;
}
function Zh(e, t) {
	if (!Yh(t)) return Yh(e) ? e : void 0;
	if (!Yh(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Yh(r) && Yh(n[e]) ? Zh(n[e], r) : r);
	return n;
}
function Qh(e, t) {
	if (!Yh(t)) return Yh(e) ? e : void 0;
	if (!Yh(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Yh(r) && Yh(t) ? n[e] = Qh(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var $h = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function eg(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var tg = class {
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
				args: new Kh()
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
function ng(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function rg(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* ig(e, t) {
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
async function* ag(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = eg(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new $h(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new tg();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = eg(t);
		if (n) throw new $h(n);
		i.text = ng(t), i.reasoning = rg(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Xh(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of ig(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = eg(e);
		if (r) throw new $h(r);
		i.text += l(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Xh(e);
		c && (i.usage = Zh(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var og = /* @__PURE__ */ rn({ current: null });
function sg(e, t) {
	return og.current = {
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
	}, og.current;
}
function cg(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
//#endregion
//#region src/core/orchestrator.ts
var lg = "/api/backends/chat-completions/generate", ug = { pending: null }, dg = (e) => e?.name === "AbortError";
function fg(t) {
	return (t.transport === "tool-single" || t.transport === "tool-multi") && !e().isToolCallingSupported() ? Z("error.toolsUnsupported") : null;
}
async function pg(e, t, n) {
	let r = Rh(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = fg(e);
	if (a) return h("error", a, "Advanced Preset"), Uh(a, 400);
	let o = e.origin === "task" ? nm(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = sg(e, i);
	if (!i) try {
		let i = await gg(e, t, s, c, n ?? void 0, () => void 0);
		return new Response(JSON.stringify(Hh(r, i)), { headers: { "Content-Type": "application/json" } });
	} catch (e) {
		return hg(c, e);
	}
	let l = Bh(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await gg(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			dg(e) || (await p(l.error(mg(e))), hg(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var mg = (e) => e instanceof Error ? e.message : String(e);
function hg(e, t) {
	return e.status = dg(t) ? "aborted" : "error", e.error = mg(t), t instanceof $h ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Uh(mg(t));
}
async function gg(t, n, r, i, a, o) {
	let s = String(n.chat_completion_source ?? ""), l = Lh({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: Rh(s, n)
	}), u = ec(t.stages), d = u >= 0 ? t.stages[u].id : null, f = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !f && d !== null, m = t.structures.some((e) => e.kind === "annotations") ? (e) => Wu(e, { final: !1 }).text : (e) => e, h = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, _ = Date.now(), v = "", y, b = 0, x = !1, S, C;
	for (let n = 0; n < h; n++) {
		i.step = n;
		let r = l.body(n), s = Yp({
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
			let n = await g(lg, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), f = 0;
			for await (let e of ag(n, c(r), !!r.stream, a)) {
				u = e;
				let t = Date.now();
				if (t - f < 50) continue;
				f = t;
				let n = l.progress(e, !1);
				if (cg(i, n, v + e.reasoning), p && d) {
					let e = n.stages[d]?.text ?? "";
					e && o(m(e.slice(0, e.length - Vs(e))).trimEnd());
				}
			}
			ym(t), s.response = u.text || JSON.stringify(u.toolCalls), s.durationMs = Date.now() - s.at, s.usage = u.usage;
		} catch (e) {
			if (s.error = mg(e), dg(e) || a?.aborted) {
				(u.text || u.reasoning || u.toolCalls.length) && ym(t), y = Qh(y, u.usage), x = !0, C = l.progress(u, !1);
				break;
			}
			throw e;
		}
		v += u.reasoning, y = Qh(y, u.usage), l.progress(u, !0);
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
	let w = C ?? l.result();
	if (x) for (let e of Object.values(w.stages)) e.status === "streaming" && (e.status = "interrupted");
	cg(i, w, v);
	let T = _g(t, w, l.rawText(), l.callerResult?.(), v, {
		usage: y,
		requests: b,
		durationMs: Date.now() - _,
		interrupted: x
	});
	return T.toolCalls = S, T.usage = y, S && (T.content = ""), i.status = x ? "aborted" : "done", T;
}
function _g(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = xc(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Hs(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = Wu(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Wu(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v = (e) => Object.values(s.structures).find((t) => t.kind === e), y = v("reply"), b = y ? n.structures[y.id] : void 0, x = v("impersonate"), S = v("recap"), C = v("memory"), w = t.meta.mixed ? "meta-mixed" : "story", T = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? T = i === void 0 ? u || Hs(r).trim() : JSON.stringify(i) : u || (w = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", T = b ? Ys(b) : "", !T && x && typeof n.structures[x.id] == "string" && (T = "…"), !T && S && n.structures[S.id] && (T = "…"))), !T && !o.interrupted) throw Error(Z("error.emptyTurn"));
	let ee = [], te = [], E = t.interceptorRan && t.stType !== "quiet";
	if (E && C && Array.isArray(n.structures[C.id])) {
		let e = Yd(n.structures[C.id]);
		ee.push(...e.events), te = e.global;
	}
	if (E && S && typeof n.structures[S.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ee.push({
			type: "recap.set",
			text: n.structures[S.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let D = t.stages.map((e) => {
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
	}), ne = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: w,
		stages: D,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
		...g?.length ? { annotations: g } : {},
		..._ && (_.draft.length || _.patched.length) ? { annotationVersions: _ } : {},
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
	}, re = {
		content: T,
		reasoning: a,
		sidecar: ne,
		...te.length ? { global: te } : {}
	};
	return E ? ug.pending = {
		ctx: t,
		outcome: re,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ne
	}), og.current?.genId === t.id && (og.current.structures = n.structures), re;
}
//#endregion
//#region src/core/fetch-gate.ts
var vg = "__ap_gen_id";
function yg(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function bg() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	_(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(yg(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[vg], r = typeof t == "string" ? Bf.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[vg], r.claimed = !0;
				try {
					return await pg(r, e, n.signal);
				} finally {
					Bf.release(t);
				}
			}
			e && (delete e[vg], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		return e.call(globalThis, t, n);
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function xg(e) {
	let t = Bf.takeArmed();
	t && (e[vg] = t.id);
}
//#endregion
//#region src/app/memory-sync.ts
var Sg = "\0";
function Cg(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = Pd(e);
		r && t.add(`${n.presetId}${Sg}${r}`);
	}
}
function wg(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && Cg(r.extra?.[Ed], t), r.swipe_info?.forEach((e, t) => {
			t !== i && Cg(e?.extra?.[Ed], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var Tg = null;
function Eg(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = wg(n.chat ?? []), o = new Set(a);
	if (Tg && !t.reload && Tg.chatId === r) for (let e of Tg.active) i.has(e) || o.add(e);
	Tg = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Sg), i = s.get(n);
		i || s.set(n, i = {
			on: [],
			off: []
		}), (t ? i.on : i.off).push(r);
	};
	for (let e of o) c(e, !1);
	for (let e of i) c(e, !0);
	let l = !1, u = J().presets;
	for (let [e, t] of s) {
		let n = u[e];
		n?.globalMemory && (Nd(n.globalMemory.log) && (l = !0), Zd(n, t.off, !1) && (l = !0), Zd(n, t.on, !0) && (l = !0));
	}
	return l && Y(), l;
}
function Dg(e) {
	Ad(e), Eg();
}
function Og() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => Dg(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => Eg());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => Eg({ reload: !0 }));
}
//#endregion
//#region src/app/receive.ts
var kg = 6e5, Ag = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function jg(t, n) {
	let r = ug.pending;
	if (!r || Date.now() - r.at > kg || Ag.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	ug.pending = null;
	let { outcome: a } = r;
	a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), kd(t, a.sidecar), a.global?.length && Xd(Qd(r.ctx.preset), a.global), Eg(), og.current?.genId === r.ctx.id && (og.current.mesId = t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t);
}
//#endregion
//#region src/app/annotations.ts
var Mg = /* @__PURE__ */ new Set();
function Ng(e) {
	for (let t of Mg) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function Pg(t) {
	let n = e().chat[t], r = Dd(n)?.annotations;
	return !n || !r?.length ? [] : Ju(n.mes, r).annotations;
}
function Fg(t) {
	let n = e().chat[t], r = Dd(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = Ju(n.mes, r.annotations);
	return i.changed ? (kd(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function Ig() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (Fg(n) && e().saveChat(), Ng(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => Ng(Number(e)));
}
var Lg = {
	get: (e) => Pg(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return Mg.add(t), () => Mg.delete(t);
	}
}, Rg = "advancedPreset.reloadedFor";
async function zg() {
	try {
		let e = await g(`${s()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Bg(e) {
	sessionStorage.setItem(Rg, e), h("info", Z("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function Vg() {
	let e = await zg();
	e && e !== "13d23d3684ef7bcd" && sessionStorage.getItem(Rg) !== e && Bg(e);
}
async function Hg() {
	await Vg();
}
async function Ug() {
	let e = o().replace(/^third-party\//, ""), t = await Wg(e, !1);
	if (t.status === 404 && (t = await Wg(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await zg();
	return r && r !== "13d23d3684ef7bcd" ? (Bg(r), "updated") : n.isUpToDate ? "current" : "updated";
}
var Wg = (t, n) => g("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
});
//#endregion
//#region src/store/bundled-modules.ts
function Gg(e, t, n, r) {
	return Nu({
		...X(Qu(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function Kg(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of Xu(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = Gg(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = rd(o), u = nd(c), d = n?.[o.id];
		if (d?.source === l) {
			i.records[o.id] = d;
			continue;
		}
		if (!s) {
			d ? i.records[o.id] = {
				source: l,
				copy: d.copy
			} : (i.add.push(c), i.records[o.id] = {
				source: l,
				copy: u
			});
			continue;
		}
		let f = nd(s);
		f === u ? i.records[o.id] = {
			source: l,
			copy: u
		} : (i.conflicts.push({
			id: o.id,
			incoming: c,
			installed: s,
			modified: !d || f !== d.copy
		}), i.records[o.id] = {
			source: l,
			copy: d?.copy ?? ""
		}, i.incomingCopy[o.id] = u);
	}
	return i;
}
function qg(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function Jg(e, t, n = []) {
	let r = Qd(e), i = rp(e), a = { ...t.records };
	for (let e of n) {
		let n = t.conflicts.find((t) => t.id === e), r = i.findIndex((t) => t.id === e);
		!n || r < 0 || (i.splice(r, 1, {
			...n.incoming,
			enabled: i[r].enabled
		}), a[e] = {
			source: a[e].source,
			copy: t.incomingCopy[e]
		});
	}
	i.push(...t.add), r.bundledModules = a, Y();
}
function Yg(e, t, n) {
	let r = Xu(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && Gg(e, i, n, t.enabled);
		if (i && a && nd(a) === nd(t)) {
			let { enabled: e, ...n } = X(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return ed(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function Xg(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var Zg = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
//#endregion
//#region src/app/bundled-modules.ts
function Qg(e, t, n) {
	let r = document.createElement("div");
	r.style.textAlign = "start";
	let i = document.createElement("h3");
	i.textContent = e;
	let a = document.createElement("p");
	a.textContent = t;
	let o = document.createElement("div");
	o.style.cssText = "display:flex;flex-direction:column;gap:0.4em;max-height:50vh;overflow:auto";
	let s = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = document.createElement("label");
		t.className = "checkbox_label", t.dataset.apItem = e.id;
		let n = document.createElement("input");
		n.type = "checkbox", n.checked = e.checked;
		let r = document.createElement("span");
		if (r.textContent = e.label, t.append(n, r), e.note) {
			let n = document.createElement("small");
			n.className = "text_muted", n.textContent = e.note, t.append(" ", n);
		}
		s.set(e.id, n), o.append(t);
	}
	return r.append(i, a, o), {
		root: r,
		checked: () => [...s].filter(([, e]) => e.checked).map(([e]) => e)
	};
}
async function $g(e, t) {
	let { root: n, checked: r } = Qg(Z("um.bundled.conflictTitle"), Z("um.bundled.conflictBody", { name: Cd(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: Z(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await m(n, Z("um.bundled.apply"), Z("um.bundled.keepAll")) ? r() : [];
}
async function e_(e, t) {
	let n = Qd(e), r = Kg(e, rp(e), n.bundledModules, bd());
	if (qg(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await $g(e, a)), Jg(e, r, i), r.add.length && h("info", Z("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Cd(e));
}
var t_ = /* @__PURE__ */ new Map();
function n_(e, t = {}) {
	let n = e.id, r = (t_.get(n) ?? Promise.resolve()).then(() => e_(pd(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return t_.set(n, r), r;
}
async function r_(e) {
	let t = rp(e), n = [];
	if (t.length) {
		let { root: r, checked: i } = Qg(Z("um.bundled.exportTitle", { name: Cd(e) }), Z("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || Z("um.untitled"),
			...e.enabled ? {} : { note: Z("um.bundled.disabled") },
			checked: !0
		})));
		if (!await m(r, Z("um.bundled.export"), Z("common.cancel"))) return !1;
		let a = i();
		n = t.filter((e) => a.includes(e.id));
	}
	return Xg(`${Zg(e.id)}.apreset.json`, Yg(e, n, bd())), !0;
}
//#endregion
//#region src/app/dev-source.ts
var i_ = /* @__PURE__ */ rn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), a_ = 1500, o_ = null;
async function s_() {
	let { url: e, enabled: t } = J().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await g(`${n}/`, { cache: "no-store" })).json();
		if (i_.status = "online", i_.error = e.ok === !1 ? "build failed" : "", i_.at = Date.now(), !e.hash || e.hash === i_.hash) return;
		let t = cd(await (await g(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		i_.presetId && i_.presetId !== t.id && gd(null, i_.presetId), gd(t), i_.presetId = t.id, i_.hash = t.hash, ff(t), await Cf(t), n_(t, { auto: !0 }), Jp("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		i_.status = "error", i_.error = e instanceof Error ? e.message : String(e);
	}
}
function c_() {
	if (o_ && clearTimeout(o_), o_ = null, !J().dev.enabled) {
		i_.presetId && gd(null, i_.presetId), Object.assign(i_, {
			status: "off",
			presetId: "",
			hash: "",
			error: ""
		});
		return;
	}
	i_.status === "off" && (i_.status = "connecting");
	let e = async () => {
		await s_(), J().dev.enabled && (o_ = setTimeout(e, a_));
	};
	e();
}
function l_() {
	sr(() => [J().dev.enabled, J().dev.url], () => {
		i_.hash = "", c_();
	}, { immediate: !0 });
}
//#endregion
//#region src/app/impersonate.ts
var u_ = "#option_impersonate, #mes_impersonate", d_ = () => document.querySelector("#send_textarea");
function f_(e, t = !1) {
	let n = d_();
	n && (n.value = e, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.focus(), t && document.querySelector("#send_but")?.click());
}
function p_() {
	if (!J().enabled) return null;
	let t = vf(), n = t ? pd(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = tf(n);
	if (!jf(r)) return null;
	let i = Ps(n.meta.impersonatePrompt, (e) => e[0] === "name" ? Pl(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function m_(e) {
	if (!e.target?.closest?.(u_)) return;
	let t = p_();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = d_()?.value.trim();
	f_(n ? `${t}\n${n}` : t, !0);
}
function h_() {
	window.addEventListener("click", m_, !0);
}
//#endregion
//#region src/app/trust.ts
var g_ = class extends Error {
	constructor() {
		super(Z("trust.declined")), this.name = "TrustDeclined";
	}
}, __ = (e) => e instanceof g_, v_ = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function y_(e, t, n, r) {
	return [
		`<h3>${p(e)}</h3>`,
		`<p>${p(Z("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${p(Z("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${p(r)}</pre>`
	].join("");
}
var b_ = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function x_(e, t) {
	let n = $c(e);
	if (!n.length || t && v_(n, $c(t))) return;
	let r = Cd(e);
	if (!await m(y_(Z("trust.presetTitle"), Z("trust.preset", { name: r }), n.length, b_(n)), Z("trust.install"), Z("common.cancel"))) throw new g_();
}
async function S_(e) {
	let t = Su(e);
	if (t.length && !await m(y_(Z("trust.modulesTitle"), Z("trust.modules", { n: e.length }), t.length, b_(t)), Z("trust.import"), Z("common.cancel"))) throw new g_();
}
//#endregion
//#region src/app/install.ts
function C_(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
async function w_(e, t) {
	let n = cd(e);
	if (!n) throw Error(Z("presets.invalid"));
	if (n.minAdvancedPreset && tl("1.9.0", n.minAdvancedPreset) < 0) throw Error(Z("presets.tooNew", { version: n.minAdvancedPreset }));
	await x_(n, pd(n.id)), md(n), t && (J().sources[n.id] = t), Y();
	let r = pd(n.id) ?? n;
	return ff(r), await Cf(r), await n_(r), r;
}
async function T_(e) {
	let t = await g(C_(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return w_(await t.json(), e.trim());
}
async function E_(e) {
	return w_(JSON.parse(await e.text()));
}
async function D_(t) {
	if (hd(t), delete J().sources[t], Y(), _d(t)) {
		let e = pd(t);
		e && (ff(e), await Cf(e), await n_(e));
		return;
	}
	let n = xf(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/ui/state.ts
var O_ = /* @__PURE__ */ rn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets"
}), k_ = () => {
	O_.chatRev++;
}, A_ = () => {
	O_.presetId = vf();
}, j_ = q(() => O_.presetId ? pd(O_.presetId) : void 0), M_ = q(() => {
	let e = j_.value;
	if (!e) return { config: "" };
	let t = Qd(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Sd(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function N_(t) {
	return O_.chatRev, e().chat[t];
}
function P_(e) {
	return Dd(N_(e));
}
function F_(e) {
	e && (O_.tab = e), O_.panelOpen = !0;
}
//#endregion
//#region src/app/st-preset-io.ts
var I_ = "openai_preset_import_file", L_ = "export_oai_preset";
function R_(e) {
	return typeof e == "object" && !!e && typeof e.id == "string" && Array.isArray(e.entries);
}
var z_ = /* @__PURE__ */ new WeakSet();
async function B_(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (R_(n)) {
		e.value = "";
		try {
			let e = await w_(n);
			await wf(e), A_(), h("success", Z("presets.installed"), Cd(e)), F_("presets");
		} catch (e) {
			__(e) ? h("info", e.message, Z("app.name")) : h("error", e instanceof Error ? e.message : String(e), Z("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		z_.add(t), e.dispatchEvent(t);
	}
}
function V_() {
	let e = vf(), t = e ? pd(e) : void 0;
	return t ? (r_(t).catch((e) => h("error", e instanceof Error ? e.message : String(e), Z("app.name"))), !0) : !1;
}
function H_() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== I_ || z_.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), B_(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${L_}`) && V_() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var U_ = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", W_ = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", G_ = ":host(ap-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}", K_ = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>svg.lucide{width:1em;height:1em}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text{field-sizing:content;min-height:5.5em;max-height:24em;font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:minmax(5em,36%) 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row.list{grid-template-columns:1fr auto}.um-var-key{text-overflow:ellipsis;min-width:0;font-weight:600}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:1.15em}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}", q_ = /* @__PURE__ */ rn({ mode: "light" }), J_ = new CSSStyleSheet();
J_.replaceSync([
	U_,
	W_,
	G_,
	K_
].join("\n"));
var Y_ = new CSSStyleSheet(), X_ = [J_, Y_], Z_ = [
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
function Q_(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of Z_) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function $_(e) {
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
function ev() {
	let e = $_(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var tv = /* @__PURE__ */ new Set();
function nv(e) {
	return tv.add(e), e.dataset.apTheme = q_.mode, () => tv.delete(e);
}
function rv() {
	let e = ev();
	if (e !== q_.mode) {
		q_.mode = e;
		for (let t of tv) t.dataset.apTheme = e;
	}
}
function iv() {
	q_.mode = ev();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(rv);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), ar(() => {
		let e = j_.value?.theme?.[q_.mode] ?? {}, t = J().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(Q_(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(Q_("primary", t.primary)), t.accent && n.push(Q_("accent", t.accent)), Y_.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function av(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function ov(e, t, n = []) {
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
			e.adoptedStyleSheets = X_, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = nv(this), this.app = ps(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/components/bubble.ts
var sv = 6, cv = 8;
function lv(e, t, n, r = "center", i = !1) {
	let a = e.top - sv - t.height >= cv, o = e.bottom + sv + t.height <= n.height - cv, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - sv - t.height : e.bottom + sv;
	c = Math.max(cv, Math.min(c, n.height - cv - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(cv, Math.min(l, n.width - cv - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function uv(e, t) {
	let n = /* @__PURE__ */ P(!1), r = /* @__PURE__ */ P(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = lv(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return sr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Vn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Vr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/rich.ts
var dv = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), fv = /* @__PURE__ */ new Set([
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
]), pv = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function mv(e) {
	return pv(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function hv(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${mv(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${mv(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${mv(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function gv(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = gv(e, t);
			n && i.appendChild(n);
		}
	};
	if (!dv.has(r) && !fv.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = gv(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function _v(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return hv(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", hv(e.textContent));
			continue;
		}
		let t = gv(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function vv(e, t, n, r) {
	return e && xd(e)?.workflows?.[t]?.stages?.[n] || r;
}
function yv(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return av(e?.actors[t]?.color, n);
}
function bv(e) {
	return q(() => {
		let t = e(), n = P_(t), r = og.current;
		if (r && r.mesId === t && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = pd(r.presetId);
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
					label: vv(e, r.workflow, t.id, t.label),
					color: yv(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = pd(n.presetId);
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
				label: vv(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: yv(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var xv = /* @__PURE__ */ rn({
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
}), Sv, Cv, wv = null;
function Tv(t) {
	let n = pd(Dd(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = Pl(n, tf(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: yv(n, n.narrator)
	};
}
function Ev(e, t) {
	clearTimeout(Sv), clearTimeout(Cv), Cv = void 0, wv = null, xv.key !== e.key && Object.assign(xv, Tv(e.mesId), { html: _v(e.ann.comment) }), Object.assign(xv, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), xv.rev++;
}
function Dv() {
	clearTimeout(Sv), clearTimeout(Cv), Cv = void 0, wv = null, xv.open && (xv.open = !1, xv.pinned = !1, xv.key = null);
}
function Ov(e) {
	if (!xv.pinned) {
		if (e) {
			if (xv.open && xv.key === e.key) {
				clearTimeout(Cv), Cv = void 0;
				return;
			}
			if (wv === e.key) return;
			clearTimeout(Sv), wv = e.key, Sv = setTimeout(() => Ev(e, !1), 150);
		} else clearTimeout(Sv), wv = null, jv();
	}
}
function kv(e) {
	e && !(xv.open && xv.key === e.key) ? Ev(e, !0) : Dv();
}
function Av() {
	clearTimeout(Cv), Cv = void 0;
}
function jv() {
	!xv.open || xv.pinned || Cv || (Cv = setTimeout(Dv, 200));
}
function Mv(e) {
	xv.key && e.has(xv.key) && Dv(), wv && e.has(wv) && (clearTimeout(Sv), wv = null);
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var Nv = {
	key: 0,
	class: "anno-author"
}, Pv = ["innerHTML"], Fv = /* @__PURE__ */ R({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ P(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = xv.rect, a = lv(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return sr(() => xv.open && xv.rev, async (e) => {
			if (!e) return;
			await Vn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Vr(() => {
			xv.open = !1;
		}), (e, n) => F(xv).open ? (V(), H("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Oe({ "--actor": F(xv).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => F(Av) && F(Av)(...e),
			onMouseleave: n[1] ||= (...e) => F(jv) && F(jv)(...e)
		}, [F(xv).author ? (V(), H("div", Nv, M(F(xv).author), 1)) : K("", !0), W("div", {
			class: "rich anno-text",
			innerHTML: F(xv).html
		}, null, 8, Pv)], 36)) : K("", !0);
	}
}), Iv = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, Lv = /\s/, Rv = /[“”„‟〝〞＂「」]/, zv = /[‘’‚‛『』＇]/;
function Bv(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!Iv.test(i)) {
			if (Lv.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else Rv.test(i) ? i = "\"" : zv.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var Vv = (e) => Bv(e).text;
function Hv(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function Uv(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function Wv(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function Gv(e, t, n, r = Bv(e)) {
	let i = Vv(n.quote).trim();
	if (!i) return null;
	let a = Hv(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = Vv(n.prefix), s = Vv(n.suffix), c = 0, l = a.map((t) => {
			let n = Uv(e, r.text.slice(Math.max(0, t - e.length), t)) + Wv(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = Hv(Vv(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function Kv(e, t, n = !1) {
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
var qv = /* @__PURE__ */ new Set([
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
function Jv(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (qv.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = Jv(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function Yv(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? qv.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && Jv(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function Xv(e, t, n) {
	let r = Yv(e), i = r.map((e) => e.data), a = i.join(""), o = Bv(a), s = [];
	for (let e of n) {
		let n = Gv(a, t, e, o);
		n && s.push({
			ann: e,
			start: Kv(i, n[0]),
			end: Kv(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function Zv(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var Qv = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function $v(e, t) {
	let n = [...e.located].sort((e, t) => Qv(e.start, t.start) ? 1 : Qv(t.start, e.start) ? -1 : 0), r = null;
	for (let i of n) if (!(r && Qv(r, i.end))) {
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
function ey(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/paint.ts
var ty = "ap-anno", ny = "ap-anno-style", ry = /* @__PURE__ */ new Map(), iy = 0, ay = "#a855f7", oy = () => null;
function sy(e) {
	oy = e;
}
function cy() {
	let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
	return `:root { --ap-anno-color: ${ay}; }
::highlight(${ty}) { ${e} }
ap-anno { ${e} text-decoration-skip-ink: none; cursor: help; }`;
}
function ly(e) {
	let t = e.getElementById(ny);
	t || (t = e.createElement("style"), t.id = ny, (e.head ?? e.documentElement).append(t)), t.textContent !== cy() && (t.textContent = cy());
}
function uy(e) {
	if (e !== ay) {
		ay = e;
		for (let e of _y()) ly(e.doc);
	}
}
function dy(e, t) {
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
var fy = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function py(e, t) {
	let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
	if (!n) return null;
	let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest("ap-anno");
	if (r) {
		let n = e.byWrap.get(r);
		if (n) {
			let i = [...r.getClientRects()].find((e) => fy(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
			return {
				key: n.key,
				mesId: n.mesId,
				ann: n.ann,
				rect: dy(i, e.doc)
			};
		}
	}
	for (let r of e.owners.values()) for (let i of r) {
		let r = i.range;
		if (r && !r.collapsed && r.intersectsNode(n)) {
			for (let n of r.getClientRects()) if (fy(n, t.clientX, t.clientY)) return {
				key: i.key,
				mesId: i.mesId,
				ann: i.ann,
				rect: dy(n, e.doc)
			};
		}
	}
	return null;
}
function my(e) {
	let t = oy();
	return !!(t && e.composedPath().includes(t));
}
function hy(e) {
	let { doc: t } = e, n = 0, r = null, i = "mouse", a = (t) => {
		t.pointerType === "mouse" && (r = t, !n && (n = requestAnimationFrame(() => {
			n = 0, r && !my(r) && Ov(py(e, r));
		})));
	}, o = (e) => {
		i = e.pointerType || "mouse";
	}, s = (t) => {
		if (my(t)) return;
		let n = py(e, t);
		i === "mouse" ? n || Dv() : kv(n);
	}, c = (e) => {
		my(e) || Dv();
	}, l = () => Ov(null);
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
function gy(e) {
	let t = ry.get(e);
	if (t) return t;
	let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null;
	return r && i && (a = r.get(ty) ?? new i(), r.set(ty, a)), ly(e), t = {
		doc: e,
		serial: ++iy,
		highlight: a,
		owners: /* @__PURE__ */ new Map(),
		byWrap: /* @__PURE__ */ new WeakMap(),
		detach: () => {}
	}, t.detach = hy(t), ry.set(e, t), t;
}
function _y() {
	for (let [e, t] of ry) e.defaultView || (t.detach(), ry.delete(e));
	return [...ry.values()];
}
function vy(e) {
	gy(e);
}
function yy(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
function by(e, t, n, r, i) {
	let a = xy(e, t, !!r?.located.length);
	if (r?.located.length) {
		let o = gy(t), s = (e) => `${o.serial}:${n}:${e.id}`, c = [];
		if (o.highlight) for (let e of r.located) {
			let t = Zv(r, e);
			o.highlight.add(t), c.push({
				key: s(e.ann),
				mesId: n,
				ann: e.ann,
				range: t
			});
		}
		else if (i) {
			let e = /* @__PURE__ */ new Map();
			$v(r, (t, r) => {
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
	a.size && Mv(a);
}
function xy(e, t, n = !1) {
	let r = /* @__PURE__ */ new Set();
	for (let i of t ? [ry.get(t)].filter((e) => !!e) : _y()) {
		let t = i.owners.get(e);
		if (t) {
			i.owners.delete(e);
			for (let e of t) r.add(e.key), e.range && i.highlight?.delete(e.range), e.wraps && ey(e.wraps);
			!n && !i.owners.size && i.doc !== document && (i.detach(), ry.delete(i.doc));
		}
	}
	return r;
}
function Sy(e, t) {
	let n = xy(e, t);
	n.size && Mv(n);
}
//#endregion
//#region src/ui/annotations/view.ts
var Cy = /* @__PURE__ */ new Set();
function wy(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var Ty = () => J().ui.annotations?.show !== !1, Ey = class {
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
		}), Cy.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && Sy(this, n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && Sy(this, e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
			Sy(this);
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = og.current, i = r?.status === "running" && r.mesId === t, a = n && !n.is_user && !i && Ty() ? Pg(t).filter((e) => !e.orphan) : [], o = n?.mes ?? "";
		by(this, document, t, a.length ? Xv(this.el, o, a) : null, !yy(document));
		for (let e of this.frames.values()) {
			let n = e.doc;
			n?.body && n.defaultView && (by(this, n, t, a.length && !wy(n) ? Xv(n.body, o, a) : null, !1), e.observer?.takeRecords());
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), Sy(this), Cy.delete(this);
		}
	}
};
function Dy(e, t) {
	for (let n of Cy) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function Oy() {
	for (let e of Cy) e.hasFrames && e.schedule(0);
}
function ky() {
	for (let e of Cy) e.el.isConnected || e.dispose();
}
var Ay = /* @__PURE__ */ new WeakMap();
function jy(e) {
	let t = Ay.get(e);
	(!t || t.disposed) && Ay.set(e, new Ey(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var My = () => window.__TAURITAVERN__?.api?.chatSurface, Ny = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return My()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), Py = !1;
function Fy() {
	let t = My();
	!Py && t && Ny() && (t.protocolVersion === 1 ? (Py = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new Ey(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function Iy(e, t) {
	t && !Ny() && jy(e);
}
var Ly = null;
function Ry() {
	return (!Ly || !Ly.isConnected) && (Ly = document.createElement("ap-anno-bubble"), document.body.append(Ly)), Ly;
}
function zy() {
	ov("ap-anno-bubble", Fv), Ry(), sy(() => Ly), vy(document), ar(() => {
		let e = J().ui, t = j_.value?.theme?.[q_.mode]?.accent;
		uy(e.annotations?.color || e.accent || t || (q_.mode === "dark" ? "#c084fc" : "#9333ea"));
	}), sr(Ty, () => {
		Dv(), Dy(void 0, 0);
	}), sr(() => og.current?.status, () => Dy()), Lg.on("change", (e) => Dy(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		Dv(), ky();
	});
	t.on("message_iframe_render_ended", () => Oy()), addEventListener("resize", () => Dv());
}
//#endregion
//#region src/ui/mounts.ts
var By = "ap-hidden", Vy = [
	"meta-pure",
	"impersonate",
	"summary"
];
function Hy(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function Uy(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = Dd(a), s = og.current?.mesId === n;
	a && !a.is_user && Iy(i, !!(o?.annotations?.length || s));
	let c = !(!a || a.is_user || !o && !s), l = r.querySelector(":scope > ap-stages"), u = r.querySelector(":scope > ap-cards");
	c ? ((!l || l.nextElementSibling !== i) && (l?.remove(), l = Hy("ap-stages", n), i.before(l)), (!u || u.previousElementSibling !== i) && (u?.remove(), u = Hy("ap-cards", n), i.after(u)), l.getAttribute("mesid") !== String(n) && l.setAttribute("mesid", String(n)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), i.classList.toggle(By, !!(!s && o && Vy.includes(o.turn)))) : (l?.remove(), u?.remove(), i.classList.remove(By));
}
function Wy(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) Uy(t);
}
function Gy() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var Ky = 0, qy = /* @__PURE__ */ new Set(), Jy = !1;
function Yy(e) {
	e ? qy.add(e) : Jy = !0, !Ky && (Ky = requestAnimationFrame(() => {
		if (Ky = 0, Jy) Wy();
		else for (let e of qy) e.isConnected && Uy(e);
		qy.clear(), Jy = !1, Gy(), ky();
	}));
}
function Xy() {
	k_(), Yy();
}
function Zy() {
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
	]) e && t.on(e, Xy);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && Yy(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && Yy(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), Yy();
	};
	r();
	let i;
	sr(() => og.current && og.current.status === "running" && og.current.streaming && og.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = og.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (t.mesId = n, clearInterval(i), Xy());
		}, 100));
	}), sr(() => og.current?.status, () => Yy());
}
//#endregion
//#region src/ui/entry.ts
var Qy = "left-nav-panel", $y = "ap-preset-banner";
function eb() {
	return document.getElementById(Qy);
}
function tb() {
	let e = eb();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function nb() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== $y && e.after(document.createElement($y));
}
var rb = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function ib() {
	sr(() => O_.presetId, (e) => {
		for (let t of document.querySelectorAll(rb.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function ab(e) {
	let t = eb();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function ob() {
	let e = eb();
	if (!e) {
		if (!document.querySelector("ap-panel")) {
			let e = document.createElement("ap-panel");
			e.dataset.apStandalone = "", document.body.append(e);
		}
		return;
	}
	let t = document.querySelector("ap-panel");
	t?.parentElement !== e && (t?.remove(), e.append(document.createElement("ap-panel")));
}
function sb() {
	nb(), ib(), ob(), sr(() => O_.panelOpen, (e) => {
		e && tb();
	});
	let e = eb();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (O_.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var cb = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, lb = (e) => e === "", ub = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), db = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), fb = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), pb = (e) => {
	let t = fb(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, mb = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, hb = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = mb.width, color: s = mb.stroke, ...c }, { slots: l }) => Ra("svg", {
	...mb,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": lb(n) || lb(r) || n === !0 || r === !0 ? Number(i || a || mb["stroke-width"]) * 24 / Number(o) : i || a || mb["stroke-width"],
	class: ub("lucide", c.class, ...e ? [`lucide-${db(pb(e))}-icon`, `lucide-${db(e)}`] : ["lucide-icon"]),
	...!l.default && !cb(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ra(...e)), ...l.default ? [l.default()] : []]), Q = (e, t) => (n, { slots: r, attrs: i }) => Ra(hb, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), gb = Q("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), _b = Q("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), vb = Q("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), yb = Q("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), bb = Q("braces", [["path", {
	d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1",
	key: "ezmyqa"
}], ["path", {
	d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1",
	key: "e1hn23"
}]]), xb = Q("brain", [
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
]), Sb = Q("bug", [
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
]), Cb = Q("cable", [
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
]), wb = Q("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), Tb = Q("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), Eb = Q("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), Db = Q("circle-dashed", [
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
]), Ob = Q("circle-question-mark", [
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
]), kb = Q("circle-slash", [["circle", {
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
}]]), Ab = Q("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), jb = Q("code-xml", [
	["path", {
		d: "m18 16 4-4-4-4",
		key: "1inbqp"
	}],
	["path", {
		d: "m6 8-4 4 4 4",
		key: "15zrgr"
	}],
	["path", {
		d: "m14.5 4-5 16",
		key: "e7oirm"
	}]
]), Mb = Q("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), Nb = Q("coins", [
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
]), Pb = Q("copy-plus", [
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
]), Fb = Q("copy", [["rect", {
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
}]]), Ib = Q("database-zap", [
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
]), Lb = Q("download", [
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
]), Rb = Q("drama", [
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
]), zb = Q("feather", [
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
]), Bb = Q("file-down", [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M12 18v-6",
		key: "17g6i2"
	}],
	["path", {
		d: "m9 15 3 3 3-3",
		key: "1npd3o"
	}]
]), Vb = Q("file-plus", [
	["path", {
		d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
		key: "1oefj6"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M9 15h6",
		key: "cctwl0"
	}],
	["path", {
		d: "M12 18v-6",
		key: "17g6i2"
	}]
]), Hb = Q("file-stack", [
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
]), Ub = Q("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), Wb = Q("git-compare-arrows", [
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
]), Gb = Q("globe", [
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
]), Kb = Q("grip-vertical", [
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
]), qb = Q("info", [
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
]), Jb = Q("layers", [
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
]), Yb = Q("layout-template", [
	["rect", {
		width: "18",
		height: "7",
		x: "3",
		y: "3",
		rx: "1",
		key: "f1a2em"
	}],
	["rect", {
		width: "9",
		height: "7",
		x: "3",
		y: "14",
		rx: "1",
		key: "jqznyg"
	}],
	["rect", {
		width: "5",
		height: "7",
		x: "16",
		y: "14",
		rx: "1",
		key: "q5h2i8"
	}]
]), Xb = Q("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Zb = Q("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Qb = Q("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), $b = Q("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), ex = Q("message-square-dashed", [
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
]), tx = Q("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), nx = Q("notebook-pen", [
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
]), rx = Q("package", [
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
]), ix = Q("palette", [
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
]), ax = Q("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), ox = Q("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), sx = Q("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), cx = Q("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), lx = Q("refresh-cw", [
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
]), ux = Q("regex", [
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
]), dx = Q("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), fx = Q("save", [
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
]), px = Q("scroll-text", [
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
]), mx = Q("server", [
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
]), hx = Q("shapes", [
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
]), gx = Q("sliders-horizontal", [
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
]), _x = Q("sliders-vertical", [
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
]), vx = Q("text-cursor-input", [
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
]), yx = Q("trash-2", [
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
]), bx = Q("triangle-alert", [
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
]), xx = Q("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), Sx = Q("upload", [
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
]), Cx = Q("user-pen", [
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
]), wx = Q("workflow", [
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
]), Tx = Q("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), Ex = Q("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), Dx = /* @__PURE__ */ R({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ P(null), { open: r, bubble: i } = uv(n, () => t);
		return (t, a) => (V(), H("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [Jr(t.$slots, "default"), F(r) && e.text ? (V(), H("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, M(e.text), 513)) : K("", !0)], 544));
	}
}), Ox = ["disabled", "aria-label"], $ = /* @__PURE__ */ R({
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
		return (t, n) => (V(), U(Dx, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: I(() => [W("button", {
				type: "button",
				class: j(["icon-btn", {
					active: e.active,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(V(), U(Wr(e.icon)))], 10, Ox)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), kx = {
	key: 0,
	class: "patches"
}, Ax = { class: "patch-old pre" }, jx = { class: "patch-new pre" }, Mx = {
	key: 0,
	class: "patch-status xs"
}, Nx = {
	key: 2,
	class: "faint small stage-empty"
}, Px = /* @__PURE__ */ R({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ P(null);
		sr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Vn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (V(), H("div", {
			class: "stage-body",
			style: Oe({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (V(), H("div", kx, [(V(!0), H(B, null, z(e.stage.patches, (e, t) => (V(), H("div", {
			key: t,
			class: j(["patch", { failed: r(e.status) }])
		}, [
			W("div", Ax, M(e.old_string), 1),
			G(F(gb), { class: "patch-arrow" }),
			W("div", jx, M(e.new_string), 1),
			r(e.status) ? (V(), H("div", Mx, [G(F(vb)), da(M(F(Z)(`patch.${e.status}`)), 1)])) : K("", !0)
		], 2))), 128))])) : e.stage.text ? (V(), H("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, M(e.stage.text), 513)) : (V(), H("div", Nx, M(F(Z)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function Fx(t) {
	let n = e().chat[t], r = Dd(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), kd(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), k_();
}
async function Ix(t, n, r) {
	let i = e().chat[t], a = Dd(i);
	return !i || !a ? !1 : (kd(t, Od(a, n, r)), k_(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var Lx = { class: "stage-bar" }, Rx = ["onClick"], zx = { class: "ellipsis" }, Bx = {
	key: 0,
	class: "chip stage-chip error"
}, Vx = { class: "ellipsis" }, Hx = { class: "badge warn" }, Ux = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, Wx = /* @__PURE__ */ R({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = bv(() => t.mesid), r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P(!1), a = q(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = q(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = q(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = q(() => o.value.find((e) => e.id === s.value) ?? null);
		sr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = J().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: nx,
			content: zb,
			patch: Wb
		}, d = (e) => e.status === "streaming" ? Zb : e.status === "interrupted" ? kb : e.status === "missing" ? Db : u[e.kind], f = q(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = q(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = q(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Z(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Z("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => F(n) && (o.value.length || F(n).error) ? (V(), H("div", {
			key: 0,
			class: j(["stages", { live: F(n).running }])
		}, [W("div", Lx, [
			(V(!0), H(B, null, z(o.value, (e) => (V(), H("button", {
				key: e.id,
				type: "button",
				class: j(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Oe({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(V(), U(Wr(d(e)), { class: j({ spin: e.status === "streaming" }) }, null, 8, ["class"])), W("span", zx, M(e.label), 1)], 14, Rx))), 128)),
			F(n).error ? (V(), H("span", Bx, [G(F(bx)), W("span", Vx, M(F(n).error), 1)])) : K("", !0),
			r[1] ||= W("span", { class: "grow" }, null, -1),
			f.value.length ? (V(), U(Dx, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: I(() => [W("span", Hx, [G(F(bx)), da(M(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : K("", !0),
			p.value ? (V(), U($, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? F(xx) : F(cx),
				label: p.value.patchesApplied ? F(Z)("stages.revertDraft") : F(Z)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => F(Fx)(e.mesid)
			}, null, 8, ["icon", "label"])) : K("", !0),
			F(n).running ? K("", !0) : (V(), U(Dx, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: I(() => [W("span", Ux, [G(F(qb))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (V(), U(Px, {
			key: c.value.id,
			stage: c.value,
			follow: F(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : K("", !0)], 2)) : K("", !0);
	}
}), Gx = { class: "reply-name xs" }, Kx = ["innerHTML"], qx = /* @__PURE__ */ R({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = q(() => _v(t.text));
		return (t, r) => (V(), H("div", {
			class: "reply-card",
			style: Oe({ "--actor": e.color })
		}, [W("div", Gx, M(e.name), 1), W("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, Kx)], 4));
	}
}), Jx = { class: "card mini-card" }, Yx = { class: "card-head" }, Xx = { class: "card-title" }, Zx = { class: "card-body pre" }, Qx = /* @__PURE__ */ R({
	__name: "ImpersonateCard",
	props: { text: {} },
	setup(e) {
		return (t, n) => (V(), H("div", Jx, [W("header", Yx, [
			G(F(Cx), { class: "section-icon" }),
			W("span", Xx, M(F(Z)("cards.impersonate")), 1),
			W("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => F(f_)(e.text)
			}, [G(F(vx)), da(M(F(Z)("cards.fillInput")), 1)])
		]), W("div", Zx, M(e.text), 1)]));
	}
}), $x = ["aria-label"], eS = ["title", "onClick"], tS = { class: "option-label" }, nS = { class: "option-content small muted" }, rS = /* @__PURE__ */ R({
	__name: "OptionsCard",
	props: { options: {} },
	setup(e) {
		let t = (e, t) => f_(e.content, t.ctrlKey || t.metaKey || t.shiftKey || t.altKey);
		return (n, r) => (V(), H("div", {
			class: "options-grid",
			role: "list",
			"aria-label": F(Z)("cards.options")
		}, [(V(!0), H(B, null, z(e.options, (e, n) => (V(), H("button", {
			key: n,
			type: "button",
			role: "listitem",
			class: "option",
			title: F(Z)("cards.optionHint"),
			onClick: (n) => t(e, n)
		}, [W("span", tS, M(e.label), 1), W("span", nS, M(e.content), 1)], 8, eS))), 128))], 8, $x));
	}
}), iS = {
	key: 0,
	class: "memory-ops"
}, aS = { class: "ellipsis" }, oS = ["aria-label", "onClick"], sS = /* @__PURE__ */ R({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = q(() => {
			let e = Qd(t.preset), n = e.globalMemory.log;
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
					let r = Pd(t), i = r ? Fd(e, r) : -1, a = n[i];
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
			e.id !== void 0 && Jd(Qd(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (V(), H("div", iS, [(V(!0), H(B, null, z(n.value, (e, t) => (V(), U(Dx, {
			key: t,
			text: e.op === "delete" ? F(Z)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: I(() => [W("span", { class: j(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(V(), U(Wr(e.scope === "global" ? F(Gb) : F($b)), { class: "faint" })),
				W("span", aS, M(e.key), 1),
				(V(), U(Wr(e.op === "delete" ? F(yx) : F(ox)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (V(), H("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": F(Z)("common.undo"),
					onClick: (t) => r(e)
				}, [G(F(xx))], 8, oS)) : K("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : K("", !0);
	}
}), cS = ["aria-label"], lS = /* @__PURE__ */ R({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ P(null), { open: r, bubble: i } = uv(n, () => t);
		return (t, a) => e.text ? (V(), H("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onMouseenter: a[2] ||= (e) => r.value = !0,
			onMouseleave: a[3] ||= (e) => r.value = !1
		}, [W("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: a[0] ||= ss((e) => r.value = !F(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [G(F(Ob))], 40, cS), F(r) ? (V(), H("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, M(e.text), 513)) : K("", !0)], 544)) : K("", !0);
	}
}), uS = { class: "card-title" }, dS = {
	key: 0,
	class: "card-body"
}, fS = /* @__PURE__ */ R({
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
		let t = /* @__PURE__ */ P(e.open ?? !0);
		return (n, r) => (V(), H("section", { class: j(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [W("header", {
			class: j(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (V(), U(Wr(e.icon), {
				key: 0,
				class: "section-icon"
			})) : K("", !0),
			W("span", uS, M(e.title), 1),
			G(lS, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			W("span", {
				class: "row",
				onClick: r[0] ||= ss(() => {}, ["stop"])
			}, [Jr(n.$slots, "actions")]),
			e.collapsible ? (V(), U(F(Tb), {
				key: 1,
				class: j(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : K("", !0)
		], 2), !e.collapsible || t.value ? (V(), H("div", dS, [Jr(n.$slots, "default")])) : K("", !0)], 2));
	}
}), pS = {
	key: 0,
	class: "badge neutral"
}, mS = { class: "pre small" }, hS = /* @__PURE__ */ R({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (V(), U(fS, {
			title: F(Z)("cards.recap"),
			icon: F(px),
			collapsible: "",
			open: !1
		}, {
			actions: I(() => [e.coversUpTo === void 0 ? K("", !0) : (V(), H("span", pS, "#0–" + M(e.coversUpTo), 1))]),
			default: I(() => [W("div", mS, M(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), gS = { class: "synopsis-fields" }, _S = { class: "synopsis-field" }, vS = ["placeholder", "aria-label"], yS = { class: "synopsis-field" }, bS = ["placeholder", "aria-label"], xS = ["placeholder", "aria-label"], SS = ["placeholder", "aria-label"], CS = { class: "synopsis-actions" }, wS = { class: "xs faint grow synopsis-keys" }, TS = {
	type: "submit",
	class: "btn primary sm-btn"
}, ES = { class: "synopsis-head" }, DS = { class: "synopsis-line small" }, OS = {
	key: 0,
	class: "row tight"
}, kS = {
	key: 1,
	class: "row tight"
}, AS = { class: "synopsis-event ellipsis" }, jS = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, MS = /* @__PURE__ */ R({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ P(!1), a = /* @__PURE__ */ P(!1), o = /* @__PURE__ */ rn({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ P(), c = /* @__PURE__ */ P(), l = [
			"time",
			"location",
			"event",
			"summary"
		], u = () => ({
			time: o.time.trim(),
			location: o.location.trim(),
			event: o.event.trim(),
			summary: o.summary.trim()
		}), d = q(() => l.some((e) => u()[e] !== (n.synopsis[e] ?? "")));
		function f() {
			let e = c.value;
			e && (e.style.height = "auto", e.style.height = `${e.scrollHeight + 2}px`);
		}
		async function p() {
			for (let e of l) o[e] = n.synopsis[e] ?? "";
			a.value = !0, await Vn(), f(), s.value?.focus();
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
		return (t, n) => a.value ? (V(), H("form", {
			key: 0,
			class: "synopsis-editor",
			onSubmit: ss(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= ss(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= ss(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= ss(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= ss(() => {}, ["stop"])
		}, [
			W("div", gS, [W("label", _S, [G(F(Ab), { class: "faint" }), L(W("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: F(Z)("cards.synopsis.time"),
				"aria-label": F(Z)("cards.synopsis.time")
			}, null, 8, vS), [[Zo, o.time]])]), W("label", yS, [G(F(Qb), { class: "faint" }), L(W("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: F(Z)("cards.synopsis.location"),
				"aria-label": F(Z)("cards.synopsis.location")
			}, null, 8, bS), [[Zo, o.location]])])]),
			L(W("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: F(Z)("cards.synopsis.event"),
				"aria-label": F(Z)("cards.synopsis.event")
			}, null, 8, xS), [[Zo, o.event]]),
			L(W("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: F(Z)("cards.synopsis.summary"),
				"aria-label": F(Z)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, SS), [[Zo, o.summary]]),
			W("div", CS, [
				W("span", wS, M(F(Z)("cards.synopsis.keys")), 1),
				W("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, M(F(Z)("common.cancel")), 1),
				W("button", TS, [G(F(wb)), da(M(F(Z)("common.save")), 1)])
			])
		], 32)) : (V(), H("div", {
			key: 1,
			class: j(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [W("div", ES, [W("div", DS, [
			e.synopsis.time ? (V(), H("span", OS, [G(F(Ab), { class: "faint" }), da(M(e.synopsis.time), 1)])) : K("", !0),
			e.synopsis.location ? (V(), H("span", kS, [G(F(Qb), { class: "faint" }), da(M(e.synopsis.location), 1)])) : K("", !0),
			W("span", AS, M(e.synopsis.event), 1)
		]), e.editable ? (V(), H("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= ss(() => {}, ["stop"])
		}, [G($, {
			icon: F(ox),
			label: F(Z)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : K("", !0)]), i.value && e.synopsis.summary ? (V(), H("div", jS, M(e.synopsis.summary), 1)) : K("", !0)], 2));
	}
}), NS = ["innerHTML"], PS = {
	key: 1,
	class: "kv-list small"
}, FS = { class: "pre" }, IS = /* @__PURE__ */ R({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = q(() => typeof t.value == "string" ? _v(t.value) : "");
		return (t, r) => (V(), U(fS, {
			title: e.title,
			icon: F(hx),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [typeof e.value == "string" ? (V(), H("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, NS)) : (V(), H("dl", PS, [(V(!0), H(B, null, z(e.value, (e, t) => (V(), H(B, { key: t }, [W("dt", null, M(t), 1), W("dd", FS, M(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), LS = {
	key: 0,
	class: "cards"
}, RS = /* @__PURE__ */ R({
	__name: "Cards",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = bv(() => t.mesid), r = q(() => {
			let e = n.value, t = e?.sidecar, r = e?.preset;
			if (!t || !r || e.running) return null;
			let i = Object.values(r.structures), a = (e) => {
				let n = i.find((t) => t.kind === e);
				return n ? t.structures[n.id] : void 0;
			}, o = i.find((e) => e.kind === "synopsis")?.id, s = t.events.find((e) => e.type === "recap.set");
			return {
				preset: r,
				narrator: Pl(r, tf(r), r.narrator),
				color: yv(r, r.narrator),
				reply: typeof a("reply") == "string" ? a("reply") : "",
				impersonate: typeof a("impersonate") == "string" ? a("impersonate") : "",
				options: Array.isArray(a("options")) ? a("options") : [],
				memory: t.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref"),
				recap: s?.type === "recap.set" ? s : null,
				synopsisId: o,
				synopsis: a("synopsis") && typeof a("synopsis") == "object" ? a("synopsis") : null,
				custom: i.filter((e) => e.kind === "custom" && e.display !== "hidden" && t.structures[e.id] !== void 0).map((e) => ({
					id: e.id,
					title: Sd(r, "structures", e.id, "title", e.title || e.id),
					value: t.structures[e.id]
				}))
			};
		});
		return (t, n) => r.value ? (V(), H("div", LS, [
			r.value.reply ? (V(), U(qx, {
				key: 0,
				text: r.value.reply,
				name: r.value.narrator,
				color: r.value.color
			}, null, 8, [
				"text",
				"name",
				"color"
			])) : K("", !0),
			r.value.impersonate ? (V(), U(Qx, {
				key: 1,
				text: r.value.impersonate
			}, null, 8, ["text"])) : K("", !0),
			r.value.options.length ? (V(), U(rS, {
				key: 2,
				options: r.value.options
			}, null, 8, ["options"])) : K("", !0),
			r.value.synopsis ? (V(), U(MS, {
				key: 3,
				synopsis: r.value.synopsis,
				editable: "",
				onSave: n[0] ||= (t) => r.value?.synopsisId && F(Ix)(e.mesid, r.value.synopsisId, t)
			}, null, 8, ["synopsis"])) : K("", !0),
			r.value.memory.length ? (V(), U(sS, {
				key: 4,
				events: r.value.memory,
				preset: r.value.preset
			}, null, 8, ["events", "preset"])) : K("", !0),
			r.value.recap ? (V(), U(hS, {
				key: 5,
				text: r.value.recap.text,
				"covers-up-to": r.value.recap.coversUpTo
			}, null, 8, ["text", "covers-up-to"])) : K("", !0),
			(V(!0), H(B, null, z(r.value.custom, (e) => (V(), U(IS, {
				key: e.id,
				title: e.title,
				value: e.value
			}, null, 8, ["title", "value"]))), 128))
		])) : K("", !0);
	}
}), zS = {
	key: 0,
	class: "dock stages live"
}, BS = { class: "stage-bar" }, VS = { class: "ellipsis" }, HS = {
	key: 0,
	class: "small muted"
}, US = /* @__PURE__ */ R({
	__name: "Dock",
	setup(e) {
		let t = q(() => og.current && !og.current.streaming && og.current.status === "running" ? og.current : null), n = q(() => {
			let e = t.value;
			if (!e) return [];
			let n = pd(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: vv(n, e.workflow, t.id, t.label),
				color: yv(n, t.actor)
			}));
		}), r = q(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (V(), H("div", zS, [W("div", BS, [
			G(F(Zb), { class: "spin faint" }),
			(V(!0), H(B, null, z(n.value, (e) => (V(), H("span", {
				key: e.id,
				class: j(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Oe({ "--actor": e.color })
			}, [W("span", VS, M(e.label), 1)], 6))), 128)),
			n.value.length ? K("", !0) : (V(), H("span", HS, M(F(Z)("stages.waiting")), 1))
		]), r.value ? (V(), U(Px, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : K("", !0)])) : K("", !0);
	}
}), WS = ["aria-label"], GS = ["disabled"], KS = /* @__PURE__ */ R({
	__name: "Switch",
	props: /*@__PURE__*/ ti({
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
		let t = oi(e, "modelValue");
		return (n, r) => (V(), H("label", {
			class: "switch",
			"aria-label": e.label
		}, [
			L(W("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, GS), [[Qo, t.value]]),
			r[1] ||= W("span", { class: "track" }, null, -1),
			r[2] ||= W("span", { class: "thumb" }, null, -1)
		], 8, WS));
	}
}), qS = { class: "field-label" }, JS = { class: "ellipsis" }, YS = {
	key: 0,
	class: "dot modified"
}, XS = { class: "field-control" }, ZS = /* @__PURE__ */ R({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (V(), H("div", { class: j(["field", { inline: e.inline }]) }, [W("div", qS, [
			W("span", JS, M(e.label), 1),
			e.modified ? (V(), H("span", YS)) : K("", !0),
			G(lS, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), W("div", XS, [Jr(t.$slots, "default")])], 2));
	}
}), QS = { class: "swatches" }, $S = ["title"], eC = ["title"], tC = { class: "swatches" }, nC = ["title"], rC = /* @__PURE__ */ R({
	__name: "Appearance",
	setup(e) {
		let t = J().ui, n = (e) => q({
			get: () => t[e] ?? "",
			set: (n) => {
				t[e] = n || void 0, Y();
			}
		}), r = n("primary"), i = n("accent"), a = q({
			get: () => t.collapseStages,
			set: (e) => {
				t.collapseStages = e, Y();
			}
		}), o = () => {
			t.primary = void 0, t.accent = void 0, Y();
		}, s = () => t.annotations ??= { show: !0 }, c = q({
			get: () => t.annotations?.show !== !1,
			set: (e) => {
				s().show = e, Y();
			}
		}), l = q({
			get: () => t.annotations?.color ?? "",
			set: (e) => {
				s().color = e || void 0, Y();
			}
		});
		return (e, t) => (V(), U(fS, {
			title: F(Z)("appearance.title"),
			icon: F(ix),
			collapsible: "",
			open: !1
		}, {
			default: I(() => [
				G(ZS, {
					label: F(Z)("appearance.colors"),
					help: F(Z)("appearance.colors.hint"),
					inline: ""
				}, {
					default: I(() => [W("div", QS, [
						W("label", {
							class: "swatch",
							style: Oe({ background: F(r) || "var(--ap-primary-500)" }),
							title: F(Z)("appearance.primary")
						}, [L(W("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ hn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							Zo,
							F(r),
							void 0,
							{ lazy: !0 }
						]])], 12, $S),
						W("label", {
							class: "swatch",
							style: Oe({ background: F(i) || "var(--ap-accent-500)" }),
							title: F(Z)("appearance.accent")
						}, [L(W("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ hn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							Zo,
							F(i),
							void 0,
							{ lazy: !0 }
						]])], 12, eC),
						G($, {
							icon: F(dx),
							label: F(Z)("common.reset"),
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
				}, 8, ["label", "help"]),
				G(ZS, {
					label: F(Z)("appearance.collapseStages"),
					inline: ""
				}, {
					default: I(() => [G(KS, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				G(ZS, {
					label: F(Z)("appearance.annotations"),
					help: F(Z)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: I(() => [G(KS, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (V(), U(ZS, {
					key: 0,
					label: F(Z)("appearance.annotationColor"),
					inline: ""
				}, {
					default: I(() => [W("div", tC, [W("label", {
						class: "swatch",
						style: Oe({ background: l.value || "var(--ap-accent)" }),
						title: F(Z)("appearance.annotationColor")
					}, [L(W("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						Zo,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, nC), G($, {
						icon: F(dx),
						label: F(Z)("common.reset"),
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
				}, 8, ["label"])) : K("", !0)
			]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), iC = { class: "toolbar" }, aC = ["disabled"], oC = ["disabled"], sC = { class: "preset-list" }, cC = ["onClick", "onKeydown"], lC = { class: "preset-mark" }, uC = { class: "grow col preset-info" }, dC = { class: "row wrap preset-head" }, fC = { class: "preset-name" }, pC = { class: "badge neutral" }, mC = { class: "badge neutral icon-badge" }, hC = {
	key: 0,
	class: "xs muted"
}, gC = {
	key: 1,
	class: "small muted preset-desc"
}, _C = {
	key: 0,
	class: "empty"
}, vC = /* @__PURE__ */ R({
	__name: "PresetsTab",
	setup(e) {
		let t = q(() => ld()), n = (e) => $c(e.preset).length > 0, r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P(!1), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && h("success", n);
			} catch (e) {
				__(e) ? h("info", e.message) : h("error", e instanceof Error ? e.message : String(e), Z("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await wf(e.preset), A_();
		}), l = () => s("url", async () => {
			let e = await T_(a.value);
			return a.value = "", i.value = !1, e;
		}, Z("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => E_(t), Z("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => T_(J().sources[e.preset.id]), Z("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => r_(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => D_(e.preset.id)), m = () => s("ext", async () => h("info", await Ug() === "current" ? Z("update.none") : Z("update.reloading")));
		return (e, s) => (V(), H(B, null, [
			W("div", iC, [
				W("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [G(F(Sx)), da(M(F(Z)("presets.importFile")), 1)], 8, aC),
				W("button", {
					type: "button",
					class: j(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [G(F(Xb)), da(M(F(Z)("presets.importUrl")), 1)], 2),
				s[4] ||= W("span", { class: "grow" }, null, -1),
				G($, {
					icon: r.value === "ext" ? F(Zb) : F(lx),
					label: F(Z)("presets.checkUpdates"),
					align: "end",
					disabled: r.value === "ext",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				W("input", {
					ref_key: "fileInput",
					ref: o,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			i.value ? (V(), H("form", {
				key: 0,
				class: "row",
				onSubmit: ss(l, ["prevent"])
			}, [L(W("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[Zo, a.value]]), W("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (V(), U(F(Zb), {
				key: 0,
				class: "spin"
			})) : (V(), U(F(Lb), { key: 1 })), da(M(F(Z)("common.install")), 1)], 8, oC)], 32)) : K("", !0),
			W("div", sC, [(V(!0), H(B, null, z(t.value, (e) => (V(), H("div", {
				key: e.preset.id,
				class: j(["preset-item", { on: F(j_)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: ls((t) => c(e), ["enter"])
			}, [
				W("span", lC, [r.value === `select:${e.preset.id}` ? (V(), U(F(Zb), {
					key: 0,
					class: "spin"
				})) : F(j_)?.id === e.preset.id ? (V(), U(F(wb), { key: 1 })) : K("", !0)]),
				W("div", uC, [
					W("div", dC, [
						W("span", fC, M(F(Cd)(e.preset)), 1),
						W("span", pC, "v" + M(e.preset.version), 1),
						e.source === "builtin" ? K("", !0) : (V(), H("span", {
							key: 0,
							class: j(["badge", { warn: e.source === "dev" }])
						}, M(F(Z)(`presets.source.${e.source}`)), 3)),
						n(e) ? (V(), U(Dx, {
							key: 1,
							text: F(Z)("presets.templates.help")
						}, {
							default: I(() => [W("span", mC, [G(F(jb)), da(M(F(Z)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : K("", !0)
					]),
					e.preset.author ? (V(), H("span", hC, M(e.preset.author), 1)) : K("", !0),
					F(wd)(e.preset) ? (V(), H("span", gC, M(F(wd)(e.preset)), 1)) : K("", !0)
				]),
				W("div", {
					class: "row preset-actions",
					onClick: s[3] ||= ss(() => {}, ["stop"])
				}, [
					G($, {
						icon: F(Bb),
						label: F(Z)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					e.source === "installed" && F(J)().sources[e.preset.id] ? (V(), U($, {
						key: 0,
						icon: F(lx),
						label: F(Z)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : K("", !0),
					e.source === "installed" ? (V(), U($, {
						key: 1,
						icon: F(yx),
						label: F(Z)("common.delete"),
						align: "end",
						small: "",
						danger: "",
						onClick: (t) => p(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : K("", !0)
				])
			], 42, cC))), 128)), t.value.length ? K("", !0) : (V(), H("div", _C, M(F(Z)("presets.none")), 1))]),
			G(rC)
		], 64));
	}
}), yC;
function bC() {
	let e = j_, t = q(() => e.value ? tf(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (rf(r, t), n.sampling && (clearTimeout(yC), yC = setTimeout(() => void Tf(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var xC = { class: "empty" }, SC = /* @__PURE__ */ R({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (V(), H("div", xC, [
			G(F(rx)),
			W("span", null, M(F(Z)("panel.noPreset")), 1),
			W("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => F(O_).tab = "presets"
			}, M(F(Z)("panel.choosePreset")), 1)
		]));
	}
}), CC = [
	"aria-checked",
	"title",
	"onClick"
], wC = { class: "ellipsis" }, TC = /* @__PURE__ */ R({
	__name: "Segmented",
	props: /*@__PURE__*/ ti({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = oi(e, "modelValue");
		return (n, r) => (V(), H("div", {
			class: j(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(V(!0), H(B, null, z(e.options, (e) => (V(), H("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: j({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (V(), U(Wr(e.icon), { key: 0 })) : K("", !0), W("span", wC, M(e.label), 1)], 10, CC))), 128))], 2));
	}
}), EC = { class: "col" }, DC = { class: "row" }, OC = ["aria-label"], kC = ["label"], AC = ["value"], jC = ["label"], MC = ["value"], NC = ["placeholder"], PC = {
	key: 1,
	class: "xs muted row tight"
}, FC = { value: "" }, IC = ["value"], LC = ["value"], RC = ["value"], zC = [
	"value",
	"placeholder",
	"onChange"
], BC = [
	"value",
	"placeholder",
	"onChange"
], VC = ["value"], HC = ["value"], UC = ["value"], WC = ["value"], GC = ["value"], KC = { class: "slider" }, qC = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], JC = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], YC = { class: "field-grid" }, XC = ["value", "onChange"], ZC = ["value"], QC = ["value"], $C = /* @__PURE__ */ R({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bC(), i = q(() => t.value ? Qd(t.value) : null), a = q({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				af(n, {
					kind: r,
					id: i.join(":")
				}), Tf(n);
			}
		}), o = q(() => t.value ? of(t.value) : !1), s = q(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), c = /* @__PURE__ */ P(null), l = /* @__PURE__ */ P("");
		function u(e) {
			c.value = e, l.value = e === "rename" ? i.value?.saved.find((e) => e.id === s.value)?.name ?? "" : "";
		}
		function d() {
			let e = t.value, n = l.value.trim();
			e && n && (c.value === "new" ? cf(e, n) : s.value && uf(e, s.value, n), c.value = null);
		}
		let f = () => {
			t.value && (sf(t.value), Tf(t.value));
		}, p = () => {
			t.value && s.value && (df(t.value, s.value), Tf(t.value));
		}, m = () => {
			t.value && s.value && lf(t.value, s.value);
		}, h = q(() => vs.map((e) => ({
			value: e,
			label: Z(`transport.${e}`),
			hint: Z(`transport.${e}.hint`)
		}))), g = q({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), _ = q(() => g.value === "tool-single" || g.value === "tool-multi"), v = q(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), y = q(() => v.value.map((e) => ({
			value: e.id,
			label: Sd(t.value, "workflows", e.id, "name", e.name),
			hint: Sd(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), b = q({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), x = q(() => y.value.find((e) => e.value === b.value)?.hint);
		function S(e) {
			return q({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let C = S("forceTool"), w = S("parallelTools"), T = S("sendThoughtSignature"), ee = S("streamToolArguments"), te = S("finalFallback"), E = S("maxSteps"), D = q({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), ne = q(() => Object.entries(t.value?.actors ?? {})), re = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), ie = q({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), ae = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), O = q(() => Ss.map((e) => ({
			value: e,
			label: Z(`writing.userInput.${e}`),
			hint: Z(`writing.userInput.${e}.hint`)
		}))), k = q({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), oe = q({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), A = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), se = q({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), ce = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), le = [
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
		], ue = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], de = ["stream_openai", "show_thoughts"], fe = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], pe = q(() => n.value?.sampling ?? {}), me = (e) => e in pe.value, he = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), ge = (e) => Number(e.target.value);
		return (e, r) => !F(t) || !F(n) || !i.value ? (V(), U(SC, { key: 0 })) : (V(), H(B, { key: 1 }, [
			W("div", EC, [
				W("div", DC, [
					L(W("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": F(Z)("config.configuration")
					}, [W("optgroup", { label: F(Z)("config.recommended") }, [(V(!0), H(B, null, z(F(t).configurations, (e) => (V(), H("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, M(F(Sd)(F(t), "configurations", e.id, "name", e.name)), 9, AC))), 128))], 8, kC), i.value.saved.length ? (V(), H("optgroup", {
						key: 0,
						label: F(Z)("config.saved")
					}, [(V(!0), H(B, null, z(i.value.saved, (e) => (V(), H("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, M(e.name), 9, MC))), 128))], 8, jC)) : K("", !0)], 8, OC), [[es, a.value]]),
					s.value && o.value ? (V(), U($, {
						key: 0,
						icon: F(fx),
						label: F(Z)("config.overwrite"),
						align: "end",
						onClick: m
					}, null, 8, ["icon", "label"])) : K("", !0),
					G($, {
						icon: F(sx),
						label: F(Z)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => u("new")
					}, null, 8, ["icon", "label"]),
					s.value ? (V(), U($, {
						key: 1,
						icon: F(ox),
						label: F(Z)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => u("rename")
					}, null, 8, ["icon", "label"])) : K("", !0),
					s.value ? (V(), U($, {
						key: 2,
						icon: F(yx),
						label: F(Z)("common.delete"),
						align: "end",
						danger: "",
						onClick: p
					}, null, 8, ["icon", "label"])) : K("", !0),
					G($, {
						icon: F(dx),
						label: F(Z)("config.reset"),
						align: "end",
						disabled: !o.value,
						onClick: f
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				c.value ? (V(), H("form", {
					key: 0,
					class: "row",
					onSubmit: ss(d, ["prevent"])
				}, [
					L(W("input", {
						"onUpdate:modelValue": r[3] ||= (e) => l.value = e,
						class: "input grow",
						placeholder: F(Z)("config.name"),
						autofocus: ""
					}, null, 8, NC), [[Zo, l.value]]),
					G($, {
						icon: F(Tx),
						label: F(Z)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => c.value = null
					}, null, 8, ["icon", "label"]),
					G($, {
						icon: F(wb),
						label: F(Z)("common.save"),
						align: "end",
						active: "",
						onClick: d
					}, null, 8, ["icon", "label"])
				], 32)) : K("", !0),
				o.value ? (V(), H("span", PC, [r[24] ||= W("span", { class: "dot modified" }, null, -1), da(M(F(Z)("config.modified")), 1)])) : K("", !0)
			]),
			G(fS, {
				title: F(Z)("config.connection"),
				icon: F(Cb)
			}, {
				default: I(() => [
					G(ZS, {
						label: F(Z)("config.transport"),
						help: F(Z)(`transport.${g.value}.hint`)
					}, {
						default: I(() => [G(TC, {
							modelValue: g.value,
							"onUpdate:modelValue": r[5] ||= (e) => g.value = e,
							options: h.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					_.value ? (V(), H(B, { key: 0 }, [
						G(ZS, {
							label: F(Z)("config.forceTool"),
							help: F(Z)("config.forceTool.hint"),
							inline: ""
						}, {
							default: I(() => [G(KS, {
								modelValue: F(C),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ hn(C) ? C.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						G(ZS, {
							label: F(Z)("config.parallelTools"),
							help: F(Z)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: I(() => [G(KS, {
								modelValue: F(w),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ hn(w) ? w.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						G(ZS, {
							label: F(Z)("config.syntheticTurn"),
							help: F(Z)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: I(() => [L(W("select", {
								"onUpdate:modelValue": r[8] ||= (e) => D.value = e,
								class: "input"
							}, [W("option", FC, M(F(Z)("common.none")), 1), (V(!0), H(B, null, z(F(t).syntheticTurns, (e) => (V(), H("option", {
								key: e.id,
								value: e.id
							}, M(e.label), 9, IC))), 128))], 512), [[es, D.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						G(ZS, {
							label: F(Z)("config.thoughtSignature"),
							help: F(Z)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: I(() => [G(KS, {
								modelValue: F(T),
								"onUpdate:modelValue": r[9] ||= (e) => /* @__PURE__ */ hn(T) ? T.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						G(ZS, {
							label: F(Z)("config.streamToolArguments"),
							help: F(Z)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: I(() => [L(W("select", {
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ hn(ee) ? ee.value = e : null,
								class: "input"
							}, [(V(!0), H(B, null, z(F(ys), (e) => (V(), H("option", {
								key: e,
								value: e
							}, M(F(Z)(`config.streamToolArguments.${e}`)), 9, LC))), 128))], 512), [[es, F(ee)]])]),
							_: 1
						}, 8, ["label", "help"]),
						g.value === "tool-multi" ? (V(), U(ZS, {
							key: 0,
							label: F(Z)("config.maxSteps"),
							inline: ""
						}, {
							default: I(() => [W("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: F(E),
								onChange: r[11] ||= (e) => E.value = ge(e)
							}, null, 40, RC)]),
							_: 1
						}, 8, ["label"])) : K("", !0)
					], 64)) : K("", !0),
					G(ZS, {
						label: F(Z)("config.finalFallback"),
						help: F(Z)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: I(() => [G(KS, {
							modelValue: F(te),
							"onUpdate:modelValue": r[12] ||= (e) => /* @__PURE__ */ hn(te) ? te.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			y.value.length > 1 ? (V(), U(fS, {
				key: 0,
				title: F(Z)("config.workflow"),
				icon: F(wx),
				help: x.value
			}, {
				default: I(() => [G(TC, {
					modelValue: b.value,
					"onUpdate:modelValue": r[13] ||= (e) => b.value = e,
					options: y.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : K("", !0),
			G(fS, {
				title: F(Z)("writing.actors"),
				icon: F(Rb),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [(V(!0), H(B, null, z(ne.value, ([e, t]) => (V(), H("div", {
					key: e,
					class: "field-grid"
				}, [G(ZS, { label: F(Z)("writing.actorName", { actor: e }) }, {
					default: I(() => [W("input", {
						class: "input",
						value: F(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => re("names", e, t.target.value)
					}, null, 40, zC)]),
					_: 2
				}, 1032, ["label"]), G(ZS, { label: F(Z)("writing.actorPrefix") }, {
					default: I(() => [W("input", {
						class: "input",
						value: F(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => re("prefixes", e, t.target.value)
					}, null, 40, BC)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			G(fS, {
				title: F(Z)("writing.meta"),
				icon: F(tx),
				help: F(Z)("writing.meta.hint")
			}, {
				actions: I(() => [G(KS, {
					modelValue: oe.value,
					"onUpdate:modelValue": r[14] ||= (e) => oe.value = e,
					label: F(Z)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: I(() => [oe.value ? (V(), U(ZS, {
					key: 0,
					label: F(Z)("writing.recentCount"),
					help: F(Z)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: I(() => [W("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: F(n).meta.recentCount,
						onChange: r[15] ||= (e) => A(e.target.value)
					}, null, 40, VC)]),
					_: 1
				}, 8, ["label", "help"])) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			G(fS, {
				title: F(Z)("writing.tokenSaving"),
				icon: F(Nb),
				help: F(Z)("writing.tokenSaving.hint")
			}, {
				actions: I(() => [G(KS, {
					modelValue: ie.value,
					"onUpdate:modelValue": r[16] ||= (e) => ie.value = e,
					label: F(Z)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: I(() => [ie.value ? (V(), H(B, { key: 0 }, [
					G(ZS, {
						label: F(Z)("writing.keepFullTurns"),
						help: F(Z)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: I(() => [W("input", {
							class: "input",
							type: "number",
							min: "0",
							value: F(n).tokenSaving.keepFullTurns,
							onChange: r[17] ||= (e) => ae("keepFullTurns", e.target.value)
						}, null, 40, HC)]),
						_: 1
					}, 8, ["label", "help"]),
					G(ZS, {
						label: F(Z)("writing.userInput"),
						help: F(Z)("writing.userInput.hint")
					}, {
						default: I(() => [G(TC, {
							modelValue: k.value,
							"onUpdate:modelValue": r[18] ||= (e) => k.value = e,
							options: O.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					k.value === "truncate" ? (V(), U(ZS, {
						key: 0,
						label: F(Z)("writing.truncateUserAfter"),
						help: F(Z)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: I(() => [W("input", {
							class: "input",
							type: "number",
							min: "0",
							value: F(n).tokenSaving.truncateUserAfter,
							onChange: r[19] ||= (e) => ae("truncateUserAfter", e.target.value)
						}, null, 40, UC)]),
						_: 1
					}, 8, ["label", "help"])) : K("", !0)
				], 64)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			G(fS, {
				title: F(Z)("writing.cache"),
				icon: F(Ib),
				help: F(Z)("writing.cache.hint")
			}, {
				actions: I(() => [G(KS, {
					modelValue: se.value,
					"onUpdate:modelValue": r[20] ||= (e) => se.value = e,
					label: F(Z)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: I(() => [se.value ? (V(), H(B, { key: 0 }, [G(ZS, {
					label: F(Z)("writing.cacheTtl"),
					help: F(Z)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: I(() => [W("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).cache.ttlMinutes,
						onChange: r[21] ||= (e) => ce("ttlMinutes", e.target.value)
					}, null, 40, WC)]),
					_: 1
				}, 8, ["label", "help"]), G(ZS, {
					label: F(Z)("writing.cacheMaxDeferred"),
					help: F(Z)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: I(() => [W("input", {
						class: "input",
						type: "number",
						min: "0",
						value: F(n).cache.maxDeferredTurns,
						onChange: r[22] ||= (e) => ce("maxDeferredTurns", e.target.value)
					}, null, 40, GC)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			G(fS, {
				title: F(Z)("config.sampling"),
				icon: F(Ub),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [
					(V(), H(B, null, z(le, (e) => (V(), H(B, { key: e.key }, [me(e.key) ? (V(), U(ZS, {
						key: 0,
						label: F(Z)(`sampling.${e.key}`)
					}, {
						default: I(() => [W("div", KC, [W("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: pe.value[e.key],
							onInput: (t) => he(e.key, ge(t))
						}, null, 40, qC), W("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: pe.value[e.key],
							onChange: (t) => he(e.key, ge(t))
						}, null, 40, JC)])]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64)),
					W("div", YC, [(V(), H(B, null, z(ue, (e) => (V(), H(B, { key: e }, [me(e) ? (V(), U(ZS, {
						key: 0,
						label: F(Z)(`sampling.${e}`)
					}, {
						default: I(() => [W("input", {
							class: "input",
							type: "number",
							value: pe.value[e],
							onChange: (t) => he(e, ge(t))
						}, null, 40, XC)]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64)), me("reasoning_effort") ? (V(), U(ZS, {
						key: 0,
						label: F(Z)("sampling.reasoning_effort")
					}, {
						default: I(() => [W("select", {
							class: "input",
							value: pe.value.reasoning_effort,
							onChange: r[23] ||= (e) => he("reasoning_effort", e.target.value)
						}, [(V(), H(B, null, z(fe, (e) => W("option", {
							key: e,
							value: e
						}, M(F(Z)(`effort.${e}`)), 9, QC)), 64))], 40, ZC)]),
						_: 1
					}, 8, ["label"])) : K("", !0)]),
					(V(), H(B, null, z(de, (e) => (V(), H(B, { key: e }, [me(e) ? (V(), U(ZS, {
						key: 0,
						label: F(Z)(`sampling.${e}`),
						inline: ""
					}, {
						default: I(() => [G(KS, {
							"model-value": !!pe.value[e],
							"onUpdate:modelValue": (t) => he(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : K("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), ew = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function tw(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: Z("config.transport"),
			options: t([...vs], (e) => Z(`transport.${e}`))
		},
		style: {
			kind: "enum",
			label: Z("um.var.style"),
			options: t(["dialogue", "imperative"], (e) => Z(`um.style.${e}`))
		},
		workflow: {
			kind: "enum",
			label: Z("config.workflow"),
			options: e.workflows.map((t) => ({
				value: t.id,
				label: Sd(e, "workflows", t.id, "name", t.name)
			}))
		},
		"gen.origin": {
			kind: "enum",
			label: Z("um.var.origin"),
			options: t(["story", "task"], (e) => Z(`um.origin.${e}`))
		},
		"gen.type": {
			kind: "enum",
			label: Z("um.var.genType"),
			options: t(ew, (e) => Z(`um.genType.${e}`))
		},
		"meta.present": {
			kind: "bool",
			label: Z("um.var.metaPresent")
		},
		"meta.pure": {
			kind: "bool",
			label: Z("um.var.metaPure")
		},
		"features.tokenSaving": {
			kind: "bool",
			label: Z("writing.tokenSaving")
		},
		"chat.group": {
			kind: "bool",
			label: Z("um.var.group")
		},
		"memory.hasChat": {
			kind: "bool",
			label: Z("um.var.hasChat")
		},
		"memory.hasGlobal": {
			kind: "bool",
			label: Z("um.var.hasGlobal")
		},
		"recap.present": {
			kind: "bool",
			label: Z("um.var.recap")
		},
		...e.inputShaping ? { "input.shaped": {
			kind: "bool",
			label: Z("um.var.inputShaped")
		} } : {}
	};
}
var nw = (e) => e.modules.filter((e) => e.toggle === "user");
function rw(e) {
	let t = tw(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return nw(e).length && r.push({
		id: "module",
		label: Z("um.var.module")
	}), e.params.length && r.push({
		id: "param",
		label: Z("um.var.param")
	}), [
		{
			label: Z("um.group.chat"),
			subjects: [{
				id: "keyword",
				label: Z("um.keyword")
			}, ...n([
				"chat.group",
				"memory.hasChat",
				"memory.hasGlobal",
				"recap.present"
			])]
		},
		{
			label: Z("um.group.generation"),
			subjects: n([
				"gen.type",
				"gen.origin",
				"meta.present",
				"meta.pure",
				"input.shaped"
			])
		},
		{
			label: Z("um.group.preset"),
			subjects: [...r, ...n([
				"transport",
				"style",
				"workflow",
				"features.tokenSaving"
			])]
		},
		{
			label: Z("um.group.advanced"),
			subjects: [...e.regex.length ? [{
				id: "flag",
				label: Z("um.var.flag")
			}] : [], {
				id: "expr",
				label: Z("um.expr")
			}]
		}
	].filter((e) => e.subjects.length);
}
function iw(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function aw(e, t) {
	return t === "module" ? nw(e).map((t) => ({
		value: t.id,
		label: Sd(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Sd(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function ow(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: aw(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Sd(e, "params", t.id, "label", t.label) : r;
		if (!t) return {
			kind: "text",
			label: n
		};
		if (t.type === "number") return {
			kind: "number",
			label: n
		};
		if (t.type === "list") return {
			kind: "list",
			label: n
		};
		let i = (t.options ?? []).map((n) => ({
			value: n.value,
			label: sw(e, t.id, n.value, n.label)
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
	return tw(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var sw = (e, t, n, r) => xd(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), cw = {
	bool: ["on", "off"],
	list: ["on", "off"],
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
function lw(e, t) {
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
		let n = String(aw(e, t)[0]?.value ?? "");
		return uw(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return uw(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function uw(e, t, n) {
	let r = ow(e, n);
	return t.path && ow(e, t.path).kind === r.kind && cw[r.kind].includes(t.op) && r.kind !== "enum" ? {
		...t,
		path: n
	} : r.kind === "bool" || r.kind === "list" ? {
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
function dw(e, t, n = "") {
	return e === "bool" ? Z(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? Z(`um.op.list.${t}`) : e === "enum" ? Z(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var fw = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(Z("um.or")) : t === void 0 ? "" : n(t);
};
function pw(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? Z("um.kw.input") : Z("um.kw.recentN", { n: t.depth ?? 3 })} ${Z(`um.kw.${t.op}`)} ${t.words.join(Z("um.or"))}`;
	let n = ow(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? Z("um.boolDesc", {
		label: n.label,
		value: dw(n.kind, t.op, t.path)
	}) : `${n.label} ${dw(n.kind, t.op)} ${fw(n, t.value)}`;
}
function mw(e, t) {
	let n = t.rules.filter(su);
	return n.length ? n.map((t) => pw(e, t)).join(t.match === "any" ? `\n${Z("um.match.anyJoin")} ` : `\n${Z("um.match.allJoin")} `) : Z("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var hw = ["aria-label"], gw = { class: "um-picker-head" }, _w = { class: "small muted" }, vw = { class: "um-choice-text" }, yw = { class: "xs muted" }, bw = ["data-template", "onClick"], xw = { class: "um-choice-text" }, Sw = {
	key: 0,
	class: "xs muted um-choice-desc"
}, Cw = ["data-id"], ww = ["aria-label", "onPointerdown"], Tw = ["onClick"], Ew = { class: "um-row-name ellipsis" }, Dw = { class: "um-row-meta xs muted ellipsis" }, Ow = {
	key: 3,
	class: "faint small"
}, kw = /* @__PURE__ */ R({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => rp(n.preset)), a = q(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Sd(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Sd(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.map((e) => e.point))].map(o).concat(e.vars.map((e) => s(e.var))).join(" · "), l = (e) => vu(n.preset, e), u = (e) => Z("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(su);
		function f(e, t) {
			e.enabled = t, Y();
		}
		let p = q(() => Zu(n.preset).map((e) => ({
			tpl: e,
			body: Td(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ P(!1), g = /* @__PURE__ */ P(null);
		function _() {
			m.value = !1;
			let e = sp(n.preset, Z("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function v(e) {
			m.value = !1;
			let t = cp(n.preset, Td(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function y() {
			if (!p.value.length) return _();
			m.value = !m.value, m.value && (await Vn(), g.value?.querySelector(".um-choice")?.focus());
		}
		let b = /* @__PURE__ */ P(null);
		async function x(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await S_(Fu(e).modules);
				let { added: t, missing: i } = pp(n.preset, e);
				h(i ? "warning" : "success", i ? Z("um.importedMissing", {
					n: t.length,
					missing: i
				}) : Z("um.imported", { n: t.length }));
			} catch (e) {
				__(e) ? h("info", e.message) : h("error", Z("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => Xg(`${n.preset.id}.ap-modules.json`, fp(n.preset)), C = /* @__PURE__ */ P(null), w = /* @__PURE__ */ P(null);
		function T(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), w.value = t;
		}
		function ee(e) {
			let t = w.value;
			if (!t || !C.value) return;
			let r = [...C.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && dp(n.preset, t, r);
		}
		let te = () => {
			w.value = null;
		};
		return (t, n) => (V(), U(fS, {
			title: F(Z)("um.title"),
			help: F(Z)("um.help")
		}, {
			actions: I(() => [
				a.value ? (V(), U($, {
					key: 0,
					icon: F(Sx),
					label: F(Z)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : K("", !0),
				i.value.length ? (V(), U($, {
					key: 1,
					icon: F(Lb),
					label: F(Z)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : K("", !0),
				a.value && i.value.length ? (V(), U($, {
					key: 2,
					icon: F(sx),
					label: F(Z)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: y
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : K("", !0)
			]),
			default: I(() => [
				m.value ? (V(), H("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: g,
					class: "um-picker",
					role: "group",
					"aria-label": F(Z)("um.startFrom"),
					onKeydown: n[2] ||= ls(ss((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					W("div", gw, [W("span", _w, M(F(Z)("um.startFrom")), 1), G($, {
						icon: F(Tx),
						label: F(Z)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					W("button", {
						type: "button",
						class: "um-choice",
						onClick: _
					}, [G(F(Vb)), W("span", vw, [W("span", null, M(F(Z)("um.blank")), 1), W("span", yw, M(F(Z)("um.blank.desc")), 1)])]),
					(V(!0), H(B, null, z(p.value, (e) => (V(), H("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => v(e.tpl)
					}, [G(F(Yb)), W("span", xw, [W("span", null, M(e.body.name), 1), e.body.description ? (V(), H("span", Sw, M(e.body.description), 1)) : K("", !0)])], 8, bw))), 128))
				], 40, hw)) : K("", !0),
				i.value.length ? (V(), H("div", {
					key: 1,
					ref_key: "listEl",
					ref: C,
					class: "um-list"
				}, [(V(!0), H(B, null, z(i.value, (t) => (V(), H("div", {
					key: t.id,
					class: j(["um-row", {
						off: !t.enabled,
						dragging: w.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (V(), H("span", {
						key: 0,
						class: "um-grip",
						"aria-label": F(Z)("um.reorder"),
						onPointerdown: (e) => T(e, t.id),
						onPointermove: ee,
						onPointerup: te,
						onPointercancel: te
					}, [G(F(Kb))], 40, ww)) : K("", !0),
					W("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [W("span", Ew, M(t.name || F(Z)("um.untitled")), 1), W("span", Dw, M(c(t) || F(Z)("um.noEntries")), 1)], 8, Tw),
					l(t).length ? (V(), U(Dx, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: I(() => [G(F(bx), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : K("", !0),
					d(t) ? (V(), U(Dx, {
						key: 2,
						text: F(mw)(e.preset, t.trigger),
						align: "end"
					}, {
						default: I(() => [G(F(Ex), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : K("", !0),
					G(KS, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, Cw))), 128))], 512)) : a.value && !m.value ? (V(), H("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: y
				}, [G(F(sx)), da(M(F(Z)("um.new")), 1)])) : a.value ? K("", !0) : (V(), H("div", Ow, M(F(Z)("um.noPoints")), 1)),
				W("input", {
					ref_key: "fileInput",
					ref: b,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: x
				}, null, 544)
			]),
			_: 1
		}, 8, ["title", "help"]));
	}
}), Aw = ["title"], jw = ["aria-label", "onClick"], Mw = ["placeholder"], Nw = /* @__PURE__ */ R({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ti({
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
		let t = oi(e, "modelValue"), n = e, r = /* @__PURE__ */ P(""), i = /* @__PURE__ */ P(null);
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
		return (n, l) => (V(), H("div", {
			class: "chips-input input",
			onClick: l[2] ||= (e) => i.value?.focus()
		}, [(V(!0), H(B, null, z(t.value, (t, n) => (V(), H("span", {
			key: t,
			class: j(["chip", { mono: e.mono }])
		}, [W("span", {
			class: "ellipsis",
			title: t
		}, M(t), 9, Aw), W("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: ss((e) => c(n), ["stop"])
		}, [G(F(Tx))], 8, jw)], 2))), 128)), L(W("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: j(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, Mw), [[Zo, r.value]])]));
	}
}), Pw = { class: "rule" }, Fw = { class: "rule-head" }, Iw = ["value", "aria-label"], Lw = ["label"], Rw = ["value"], zw = ["value"], Bw = ["value"], Vw = ["value"], Hw = ["value"], Uw = {
	key: 1,
	class: "grow"
}, Ww = {
	key: 0,
	class: "rule-body"
}, Gw = { class: "row wrap" }, Kw = {
	key: 0,
	class: "unit small muted"
}, qw = ["value"], Jw = ["value"], Yw = { value: "any" }, Xw = { value: "none" }, Zw = { class: "row kw-words" }, Qw = {
	key: 1,
	class: "rule-body"
}, $w = ["value"], eT = {
	key: 2,
	class: "rule-body"
}, tT = ["value"], nT = ["value"], rT = { class: "row wrap option-chips" }, iT = ["aria-pressed", "onClick"], aT = {
	key: 2,
	class: "row"
}, oT = ["value"], sT = ["value"], cT = ["value"], lT = ["list", "value"], uT = ["value"], dT = {
	key: 3,
	class: "rule-error xs"
}, fT = /* @__PURE__ */ R({
	__name: "RuleRow",
	props: /*@__PURE__*/ ti({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ti(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = oi(e, "modelValue"), r = q(() => rw(t.preset)), i = q(() => iw(n.value)), a = q(() => aw(t.preset, i.value)), o = q(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = q(() => n.value.kind === "var" ? ow(t.preset, n.value.path) : null), c = q(() => pu(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = lw(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = uw(t.preset, r, `${i}.${e}`);
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
		}, m = q(() => {
			let e = n.value.value;
			return (Array.isArray(e) ? e : []).map(String);
		});
		function h(e) {
			let t = n.value.value, r = Array.isArray(t) ? [...t] : [], i = r.findIndex((t) => String(t) === String(e));
			i >= 0 ? r.splice(i, 1) : r.push(e), f({ value: r });
		}
		let g = q(() => s.value?.kind === "list" ? "list" : "bool"), _ = q(() => cw[g.value].map((e) => ({
			value: e,
			label: dw(g.value, e, n.value.path)
		}))), v = q(() => (s.value ? cw[s.value.kind] : []).map((e) => ({
			value: e,
			label: dw(s.value.kind, e)
		}))), y = q({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), b = q(() => [{
			value: "input",
			label: Z("um.kw.input")
		}, {
			value: "recent",
			label: Z("um.kw.recent")
		}]);
		return (e, t) => (V(), H("div", Pw, [
			W("div", Fw, [
				W("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": F(Z)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(V(!0), H(B, null, z(r.value, (e) => (V(), H("optgroup", {
					key: e.label,
					label: e.label
				}, [(V(!0), H(B, null, z(e.subjects, (e) => (V(), H("option", {
					key: e.id,
					value: e.id
				}, M(e.label), 9, Rw))), 128))], 8, Lw))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (V(), H("option", {
					key: 0,
					value: i.value
				}, M(n.value.path), 9, zw)) : K("", !0)], 40, Iw),
				a.value.length ? (V(), H("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(V(!0), H(B, null, z(a.value, (e) => (V(), H("option", {
					key: String(e.value),
					value: e.value
				}, M(e.label), 9, Vw))), 128)), a.value.some((e) => String(e.value) === o.value) ? K("", !0) : (V(), H("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, M(o.value), 9, Hw))], 40, Bw)) : (V(), H("span", Uw)),
				G($, {
					icon: F(Tx),
					label: F(Z)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (V(), H("div", Ww, [W("div", Gw, [
				G(TC, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (V(), H("label", Kw, [W("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? F(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, qw), da(" " + M(F(Z)("um.kw.messages")), 1)])) : K("", !0),
				W("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [W("option", Yw, M(F(Z)("um.kw.any")), 1), W("option", Xw, M(F(Z)("um.kw.none")), 1)], 40, Jw)
			]), W("div", Zw, [G(Nw, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": F(Z)("common.delete"),
				placeholder: n.value.regex ? F(Z)("um.kw.regexPlaceholder") : F(Z)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), G($, {
				icon: F(ux),
				label: F(Z)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (V(), H("div", Qw, [W("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, $w)])) : s.value ? (V(), H("div", eT, [s.value.kind === "bool" || s.value.kind === "list" ? (V(), U(TC, {
				key: 0,
				"model-value": n.value.op,
				options: _.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (V(), H(B, { key: 1 }, [W("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(V(!0), H(B, null, z(v.value, (e) => (V(), H("option", {
				key: e.value,
				value: e.value
			}, M(e.label), 9, nT))), 128))], 40, tT), W("div", rT, [(V(!0), H(B, null, z(s.value.options, (e) => (V(), H("button", {
				key: String(e.value),
				type: "button",
				class: j(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, M(e.label), 11, iT))), 128))])], 64)) : (V(), H("div", aT, [W("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(V(!0), H(B, null, z(v.value, (e) => (V(), H("option", {
				key: e.value,
				value: e.value
			}, M(e.label), 9, sT))), 128))], 40, oT), s.value.kind === "number" ? (V(), H("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, cT)) : (V(), H(B, { key: 1 }, [W("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, lT), s.value.suggestions?.length ? (V(), H("datalist", {
				key: 0,
				id: l
			}, [(V(!0), H(B, null, z(s.value.suggestions, (e) => (V(), H("option", {
				key: e,
				value: e
			}, null, 8, uT))), 128))])) : K("", !0)], 64))]))])) : K("", !0),
			c.value ? (V(), H("div", dT, M(c.value), 1)) : K("", !0)
		]));
	}
}), pT = { class: "trigger" }, mT = {
	key: 1,
	class: "always faint small"
}, hT = {
	key: 0,
	class: "rule-join xs faint"
}, gT = { class: "btn ghost add picker" }, _T = ["aria-label"], vT = ["label"], yT = ["value"], bT = /* @__PURE__ */ R({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ti({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = oi(e, "modelValue"), r = q(() => rw(t.preset)), i = /* @__PURE__ */ P(null), a = q(() => [{
			value: "all",
			label: Z("um.match.all")
		}, {
			value: "any",
			label: Z("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(lw(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (V(), H("div", pT, [
			n.value.rules.length > 1 ? (V(), U(TC, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : K("", !0),
			n.value.rules.length ? K("", !0) : (V(), H("div", mT, M(F(Z)("um.always")), 1)),
			(V(!0), H(B, null, z(n.value.rules, (t, r) => (V(), H(B, { key: r }, [r > 0 ? (V(), H("div", hT, M(n.value.match === "any" ? F(Z)("um.match.anyJoin") : F(Z)("um.match.allJoin")), 1)) : K("", !0), G(fT, {
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
			W("label", gT, [
				G(F(sx)),
				da(M(F(Z)("um.addRule")) + " ", 1),
				W("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": F(Z)("um.addRule"),
					onChange: l[1] ||= (e) => o(e.target.value)
				}, [l[2] ||= W("option", {
					value: "",
					disabled: "",
					selected: "",
					hidden: ""
				}, null, -1), (V(!0), H(B, null, z(r.value, (e) => (V(), H("optgroup", {
					key: e.label,
					label: e.label
				}, [(V(!0), H(B, null, z(e.subjects, (e) => (V(), H("option", {
					key: e.id,
					value: e.id
				}, M(e.label), 9, yT))), 128))], 8, vT))), 128))], 40, _T)
			])
		]));
	}
}), xT = { class: "um-entry-head" }, ST = { class: "um-var-label grow ellipsis" }, CT = {
	key: 0,
	class: "um-warn xs"
}, wT = ["placeholder"], TT = ["onUpdate:modelValue", "placeholder"], ET = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], DT = [
	"value",
	"placeholder",
	"onInput"
], OT = ["id"], kT = ["value"], AT = /* @__PURE__ */ R({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = q(() => gu(n.preset, n.update.var)), a = q(() => i.value?.type !== n.update.type), o = q(() => i.value ? Sd(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = q(() => i.value && Sd(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = q(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = q(() => `ap-bv-${n.update.var}`);
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
		return (t, n) => (V(), H("div", { class: j(["um-entry", { lost: a.value }]) }, [
			W("div", xT, [
				G(F(bb), { class: "faint" }),
				W("span", ST, M(o.value), 1),
				G(lS, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				G($, {
					icon: F(Tx),
					label: F(Z)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (V(), H("div", CT, [G(F(bx)), da(M(F(Z)("um.bv.lost")), 1)])) : K("", !0),
			e.update.type === "string" ? L((V(), H("textarea", {
				key: 1,
				"onUpdate:modelValue": n[1] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: F(Z)("um.bv.append")
			}, null, 8, wT)), [[Zo, e.update.text]]) : e.update.type === "list" ? (V(!0), H(B, { key: 2 }, z(e.update.items, (t, n) => (V(), H("div", {
				key: n,
				class: "um-var-row list"
			}, [L(W("textarea", {
				"onUpdate:modelValue": (t) => e.update.items[n] = t,
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: F(Z)("um.bv.item")
			}, null, 8, TT), [[Zo, e.update.items[n]]]), G($, {
				icon: F(Tx),
				label: F(Z)("um.removeEntry"),
				small: "",
				align: "end",
				onClick: (t) => e.update.items.splice(n, 1)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			])]))), 128)) : (V(), H(B, { key: 3 }, [(V(!0), H(B, null, z(e.update.items, (t, n) => (V(), H("div", {
				key: n,
				class: "um-var-row"
			}, [
				L(W("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: F(Z)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, ET), [[Zo, t.key]]),
				W("textarea", {
					value: t.value ?? "",
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: c.value.has(t.key.trim()) ? F(Z)("um.bv.removes") : F(Z)("um.bv.value"),
					onInput: (e) => t.value = e.target.value
				}, null, 40, DT),
				G($, {
					icon: F(Tx),
					label: F(Z)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]))), 128)), W("datalist", { id: l.value }, [(V(!0), H(B, null, z(c.value, ([e]) => (V(), H("option", {
				key: e,
				value: e
			}, null, 8, kT))), 128))], 8, OT)], 64)),
			e.update.type === "string" ? K("", !0) : (V(), H("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: d
			}, [G(F(sx)), da(M(e.update.type === "dict" ? F(Z)("um.bv.addKey") : F(Z)("um.bv.addItem")), 1)]))
		], 2));
	}
}), jT = { class: "um-editor" }, MT = { class: "um-head" }, NT = ["placeholder", "aria-label"], PT = { class: "um-entry-head" }, FT = ["onUpdate:modelValue", "aria-label"], IT = ["value"], LT = ["value"], RT = [
	"value",
	"aria-label",
	"onChange"
], zT = ["value"], BT = {
	key: 0,
	class: "um-warn xs"
}, VT = ["onUpdate:modelValue", "placeholder"], HT = {
	key: 1,
	class: "rule-error xs pre"
}, UT = {
	key: 0,
	class: "btn ghost add picker"
}, WT = ["aria-label"], GT = ["value"], KT = { class: "um-foot" }, qT = ["title"], JT = ["title"], YT = ["title"], XT = /* @__PURE__ */ R({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		sr(() => n.module, Y, { deep: !0 });
		let i = /* @__PURE__ */ P(null);
		zr(() => {
			n.module.entries.some((e) => e.text) || Vn(() => i.value?.select());
		});
		let a = q(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Sd(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Sd(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !mu(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => Xc(e.text).errors, d = (e) => u(e).map((e) => e.line ? Z("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = op(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = q(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Sd(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = q(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ P(null);
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
		let v = /* @__PURE__ */ P(!1);
		function y() {
			v.value ? (up(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = lp(n.preset, n.module.id, (e) => Z("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => Xg(`${n.preset.id}.${Zg(n.module.name)}.ap-modules.json`, fp(n.preset, [n.module.id]));
		return (t, n) => (V(), H("div", jT, [
			W("header", MT, [
				G($, {
					icon: F(_b),
					label: F(Z)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				L(W("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: F(Z)("um.untitled"),
					"aria-label": F(Z)("um.name")
				}, null, 8, NT), [[Zo, e.module.name]]),
				G(KS, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: F(Z)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			G(fS, {
				title: F(Z)("um.content"),
				help: F(Z)("um.content.help")
			}, {
				default: I(() => [(V(!0), H(B, null, z(e.module.entries, (t, n) => (V(), H("div", {
					key: t.id,
					class: j(["um-entry", { lost: s(t) }])
				}, [
					W("div", PT, [
						G(F(Qb), { class: "faint" }),
						L(W("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": F(Z)("um.point")
						}, [(V(!0), H(B, null, z(a.value, (e) => (V(), H("option", {
							key: e.id,
							value: e.id
						}, M(e.label), 9, IT))), 128)), s(t) ? (V(), H("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, M(F(Z)("um.pointMissing", { id: t.point })), 9, LT)) : K("", !0)], 8, FT), [[es, t.point]]),
						G(lS, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						W("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": F(Z)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(V(), H(B, null, z(c, (e) => W("option", {
							key: e,
							value: e
						}, M(F(Z)(`um.role.${e || "merge"}`)), 9, zT)), 64))], 40, RT),
						e.module.entries.length > 1 || e.module.vars.length ? (V(), U($, {
							key: 0,
							icon: F(Tx),
							label: F(Z)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : K("", !0)
					]),
					s(t) ? (V(), H("div", BT, [G(F(bx)), da(M(F(Z)("um.pointLost")), 1)])) : K("", !0),
					L(W("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: F(Z)("um.text.placeholder")
					}, null, 8, VT), [[Zo, t.text]]),
					u(t).length ? (V(), H("div", HT, M(d(t)), 1)) : K("", !0)
				], 2))), 128)), a.value.length ? (V(), H("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [G(F(sx)), da(M(F(Z)("um.addEntry")), 1)])) : K("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (V(), U(fS, {
				key: 0,
				title: F(Z)("um.bv"),
				help: F(Z)("um.bv.help")
			}, {
				default: I(() => [(V(!0), H(B, null, z(e.module.vars, (t, n) => (V(), U(AT, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (V(), H("label", UT, [
					G(F(sx)),
					da(M(F(Z)("um.bv.add")) + " ", 1),
					W("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": F(Z)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= W("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (V(!0), H(B, null, z(h.value, (e) => (V(), H("option", {
						key: e.id,
						value: e.id
					}, M(e.label), 9, GT))), 128))], 40, WT)
				])) : K("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : K("", !0),
			G(fS, {
				title: F(Z)("um.trigger"),
				help: F(Z)("um.trigger.help")
			}, {
				default: I(() => [G(bT, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			W("footer", KT, [
				W("button", {
					type: "button",
					class: "btn ghost",
					title: F(Z)("um.export"),
					onClick: x
				}, [G(F(Lb)), W("span", null, M(F(Z)("um.export")), 1)], 8, qT),
				W("button", {
					type: "button",
					class: "btn ghost",
					title: F(Z)("um.duplicate"),
					onClick: b
				}, [G(F(Pb)), W("span", null, M(F(Z)("um.duplicate")), 1)], 8, JT),
				n[6] ||= W("span", { class: "grow" }, null, -1),
				W("button", {
					type: "button",
					class: j(["btn ghost danger", { armed: v.value }]),
					title: F(Z)("common.delete"),
					onClick: y
				}, [G(F(yx)), W("span", null, M(v.value ? F(Z)("um.confirmDelete") : F(Z)("common.delete")), 1)], 10, YT)
			])
		]));
	}
}), ZT = {
	key: 0,
	class: "module-row"
}, QT = { class: "grow" }, $T = { class: "ellipsis" }, eE = ["aria-label"], tE = ["aria-checked", "onClick"], nE = { class: "grow" }, rE = { class: "grow" }, iE = { class: "ellipsis" }, aE = {
	key: 0,
	class: "empty"
}, oE = /* @__PURE__ */ R({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bC(), i = q(() => t.value && n.value ? Ml(t.value, n.value) : {}), a = q(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = Al(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Sd(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Sd(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Sd(e, "groups", t, "label", r?.label ?? t) : Z("modules.other"),
					help: t && Sd(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Sd(t.value, "modules", e.id, "name", e.name), s = (e) => Sd(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ P(null), g = /* @__PURE__ */ P(null), _ = q(() => t.value && h.value ? rp(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Vn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Vn(() => y()?.scrollTo({ top: v }));
		}
		return sr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !F(t) || !F(n) ? (V(), U(SC, { key: 0 })) : _.value ? (V(), H("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(V(), U(XT, {
			key: _.value.id,
			preset: F(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (V(), H("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			G(kw, {
				preset: F(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(V(!0), H(B, null, z(a.value, (e) => (V(), U(fS, {
				key: e.id,
				title: e.label,
				help: e.help
			}, qr({
				default: I(() => [(V(!0), H(B, null, z(e.sets, (t) => (V(), H(B, { key: t.key }, [t.label ? (V(), H("div", ZT, [W("span", QT, [W("span", $T, M(t.label), 1), G(lS, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (V(), U(KS, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : K("", !0)])) : K("", !0), !t.optional || c(t) ? (V(), H("div", {
					key: 1,
					class: j(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(V(!0), H(B, null, z(t.modules, (e) => (V(), H("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: j(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= W("span", { class: "radio" }, null, -1),
					W("span", nE, M(o(e)), 1),
					G(lS, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, tE))), 128))], 10, eE)) : K("", !0)], 64))), 128)), (V(!0), H(B, null, z(e.toggles, (e) => (V(), H("div", {
					key: e.id,
					class: "module-row"
				}, [W("span", rE, [W("span", iE, M(o(e)), 1), G(lS, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), G(KS, {
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
				fn: I(() => [G(KS, {
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
			a.value.length ? K("", !0) : (V(), H("div", aE, M(F(Z)("modules.none")), 1))
		], 512));
	}
}), sE = ["value", "onChange"], cE = ["value"], lE = {
	key: 2,
	class: "unit"
}, uE = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], dE = {
	key: 0,
	class: "small muted"
}, fE = [
	"list",
	"value",
	"placeholder",
	"onChange"
], pE = ["id"], mE = ["value"], hE = /* @__PURE__ */ R({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = bC(), i = q(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Sd(e, "groups", t, "label", e.groups[t]?.label ?? t) : Z("writing.params"),
				help: t && Sd(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Sd(t.value, "params", e.id, "label", e.label), o = (e) => Sd(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => xd(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => hl(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !F(t) || !F(n) ? (V(), U(SC, { key: 0 })) : (V(!0), H(B, { key: 1 }, z(i.value, (e) => (V(), U(fS, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: F(_x)
		}, {
			default: I(() => [(V(!0), H(B, null, z(e.params, (e) => (V(), U(ZS, {
				key: e.id,
				label: a(e),
				help: o(e)
			}, {
				default: I(() => [e.type === "select" ? (V(), H("select", {
					key: 0,
					class: "input",
					value: c(e),
					onChange: (t) => l(e, t.target.value)
				}, [(V(!0), H(B, null, z(e.options, (t) => (V(), H("option", {
					key: String(t.value),
					value: t.value
				}, M(s(e, t.value, t.label)), 9, cE))), 128))], 40, sE)) : e.type === "list" ? (V(), U(Nw, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": F(Z)("common.delete"),
					placeholder: F(Z)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (V(), H("div", lE, [W("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, uE), e.unit ? (V(), H("span", dE, M(e.unit), 1)) : K("", !0)])) : (V(), H(B, { key: 3 }, [W("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, fE), e.options?.length ? (V(), H("datalist", {
					key: 0,
					id: f(e)
				}, [(V(!0), H(B, null, z(e.options, (t) => (V(), H("option", {
					key: String(t.value),
					value: t.value
				}, M(s(e, t.value, t.label)), 9, mE))), 128))], 8, pE)) : K("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), gE = { class: "kv" }, _E = {
	key: 0,
	class: "kv-row"
}, vE = { class: "kv-key ellipsis" }, yE = { class: "kv-value pre small" }, bE = {
	key: 0,
	class: "kv-actions"
}, xE = {
	key: 1,
	class: "kv-edit col"
}, SE = ["placeholder"], CE = ["placeholder"], wE = { class: "row end" }, TE = {
	key: 0,
	class: "kv-edit col"
}, EE = ["placeholder"], DE = ["placeholder"], OE = { class: "row end" }, kE = {
	key: 1,
	class: "faint small kv-empty"
}, AE = /* @__PURE__ */ R({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean }
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ P(null), a = /* @__PURE__ */ P(""), o = /* @__PURE__ */ P("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (V(), H("div", gE, [
			(V(!0), H(B, null, z(e.entries, (t, l) => (V(), H(B, { key: l }, [i.value === l ? (V(), H("div", xE, [
				L(W("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Z)("memory.key")
				}, null, 8, SE), [[Zo, a.value]]),
				L(W("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Z)("memory.content")
				}, null, 8, CE), [[Zo, o.value]]),
				W("div", wE, [G($, {
					icon: F(Tx),
					label: F(Z)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), G($, {
					icon: F(wb),
					label: F(Z)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (V(), H("div", _E, [
				W("div", vE, M(l), 1),
				W("div", yE, M(t), 1),
				e.readonly ? K("", !0) : (V(), H("div", bE, [G($, {
					icon: F(ox),
					label: F(Z)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), G($, {
					icon: F(yx),
					label: F(Z)("common.delete"),
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
			i.value === "" ? (V(), H("div", TE, [
				L(W("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: F(Z)("memory.key")
				}, null, 8, EE), [[Zo, a.value]]),
				L(W("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: F(Z)("memory.content")
				}, null, 8, DE), [[Zo, o.value]]),
				W("div", OE, [G($, {
					icon: F(Tx),
					label: F(Z)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), G($, {
					icon: F(wb),
					label: F(Z)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : K("", !0),
			!Object.keys(e.entries).length && i.value === null ? (V(), H("div", kE, M(F(Z)("memory.empty")), 1)) : K("", !0),
			!e.readonly && i.value === null ? (V(), H("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [G(F(sx)), da(M(F(Z)("common.add")), 1)])) : K("", !0)
		]));
	}
}), jE = {
	key: 1,
	class: "faint small"
}, ME = {
	key: 0,
	class: "badge neutral"
}, NE = ["placeholder"], PE = {
	key: 1,
	class: "faint small"
}, FE = /* @__PURE__ */ R({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = bC(), r = q(() => n.value ? Qd(n.value) : null), i = q(() => (O_.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = q(() => (O_.chatRev, i.value ? zd() : {})), o = q(() => r.value ? Hd(r.value) : {}), s = q(() => (O_.chatRev, i.value ? Bd() : null));
		async function c(e, t) {
			await Vd({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), k_();
		}
		async function l(e) {
			await Vd({
				type: "memory.delete",
				key: e,
				source: "user"
			}), k_();
		}
		let u = (e, t) => r.value && Ud(r.value, "replace", e, t, "user"), d = (e) => r.value && Ud(r.value, "delete", e, void 0, "user"), f = /* @__PURE__ */ P("");
		sr(s, (e) => {
			f.value = e?.text ?? "";
		}, { immediate: !0 });
		let p = q(() => f.value !== (s.value?.text ?? ""));
		async function m() {
			await Vd({
				type: "recap.set",
				text: f.value,
				coversUpTo: s.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), k_();
		}
		return (e, t) => !F(n) || !r.value ? (V(), U(SC, { key: 0 })) : (V(), H(B, { key: 1 }, [
			G(fS, {
				title: F(Z)("memory.chat"),
				icon: F($b),
				help: F(Z)("memory.chat.hint")
			}, {
				default: I(() => [i.value ? (V(), U(AE, {
					key: 0,
					entries: a.value,
					onSet: c,
					onRemove: l
				}, null, 8, ["entries"])) : (V(), H("div", jE, M(F(Z)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			G(fS, {
				title: F(Z)("memory.global"),
				icon: F(Gb),
				help: F(Z)("memory.global.hint")
			}, {
				actions: I(() => [G($, {
					icon: F(xx),
					label: F(Z)("common.undo"),
					small: "",
					align: "end",
					disabled: !F(Wd)(r.value),
					onClick: t[0] ||= (e) => F(Kd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), G($, {
					icon: F(cx),
					label: F(Z)("common.redo"),
					small: "",
					align: "end",
					disabled: !F(Gd)(r.value),
					onClick: t[1] ||= (e) => F(qd)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: I(() => [G(AE, {
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
			G(fS, {
				title: F(Z)("memory.recap"),
				icon: F(px),
				help: F(Z)("memory.recap.hint")
			}, {
				actions: I(() => [s.value ? (V(), H("span", ME, "#0–" + M(s.value.coversUpTo), 1)) : K("", !0), i.value ? (V(), U($, {
					key: 1,
					icon: F(wb),
					label: F(Z)("common.save"),
					small: "",
					align: "end",
					disabled: !p.value,
					active: "",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : K("", !0)]),
				default: I(() => [i.value ? L((V(), H("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => f.value = e,
					class: "input",
					rows: "6",
					placeholder: F(Z)("memory.recap.empty")
				}, null, 8, NE)), [[Zo, f.value]]) : (V(), H("div", PE, M(F(Z)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), IE = { class: "row tight xs muted" }, LE = { class: "row" }, RE = {
	key: 0,
	class: "xs text-danger"
}, zE = { class: "row wrap xs muted" }, BE = { class: "badge neutral" }, VE = {
	key: 0,
	class: "badge neutral"
}, HE = { class: "badge neutral" }, UE = {
	key: 1,
	class: "badge warn"
}, WE = ["title"], GE = {
	key: 0,
	class: "row wrap xs muted"
}, KE = { class: "grow" }, qE = { key: 0 }, JE = ["onClick"], YE = { class: "grow mono" }, XE = { class: "xs muted" }, ZE = { class: "row xs muted" }, QE = { class: "badge neutral" }, $E = { class: "pre mono scroll" }, eD = {
	key: 0,
	class: "xs faint region-msg"
}, tD = { key: 1 }, nD = ["onClick"], rD = { class: "grow mono" }, iD = { class: "xs muted" }, aD = {
	key: 0,
	class: "region-msg"
}, oD = { class: "pre mono scroll" }, sD = {
	key: 0,
	class: "xs faint"
}, cD = {
	key: 2,
	class: "xs text-warning"
}, lD = {
	key: 1,
	class: "faint small"
}, uD = ["onClick"], dD = { class: "mono grow ellipsis" }, fD = {
	key: 0,
	class: "badge warn"
}, pD = { class: "xs muted" }, mD = { class: "xs muted" }, hD = { class: "row xs muted" }, gD = { class: "grow" }, _D = { class: "mono scroll" }, vD = { class: "row xs muted" }, yD = { class: "grow" }, bD = { class: "mono scroll" }, xD = {
	key: 0,
	class: "faint small"
}, SD = { class: "row xs" }, CD = { class: "badge neutral" }, wD = { class: "muted" }, TD = { class: "mono scroll" }, ED = {
	key: 0,
	class: "faint small"
}, DD = { class: "row xs" }, OD = { class: "badge neutral" }, kD = { class: "grow muted" }, AD = { class: "small" }, jD = {
	key: 0,
	class: "faint small"
}, MD = { class: "xs faint mono build" }, ND = /* @__PURE__ */ R({
	__name: "DebugTab",
	setup(t) {
		let n = q(() => Kp.log.find((e) => e.kind === "assembly")?.data), r = q(() => Kp.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ rn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ rn({});
		sr(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (o[i] === void 0 && r) try {
					o[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let s = /* @__PURE__ */ P(null), c = (e) => typeof e == "string" ? l(e) : JSON.stringify(e, null, 2);
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
			return `${n ?? "?"} → ${r ?? "?"}` + (i ? ` · ${Z("debug.cached", { n: i })}` : "");
		}, p = (e) => [
			Z("debug.cache.stats", {
				sticky: e.sticky,
				fresh: e.fresh
			}),
			e.postponed ? Z("debug.cache.postponed", {
				n: e.postponed,
				d: e.deferred,
				max: e.maxDeferredTurns || "∞"
			}) : "",
			e.unmatched ? Z("debug.cache.unmatched", { n: e.unmatched }) : ""
		].filter(Boolean).join(" · "), m = q({
			get: () => J().dev.enabled,
			set: (e) => {
				J().dev.enabled = e, Y();
			}
		}), h = q({
			get: () => J().dev.url,
			set: (e) => {
				J().dev.url = e.trim(), Y();
			}
		}), g = q(() => Kp.log.filter((e) => e.kind !== "assembly")), _ = q(() => {
			O_.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) for (let n of Pg(e)) n.orphan && t.push({
				mesId: e,
				quote: n.quote,
				comment: n.comment
			});
			return t;
		});
		return (e, t) => (V(), H(B, null, [
			G(fS, {
				title: F(Z)("debug.dev"),
				icon: F(mx),
				help: F(Z)("debug.dev.hint")
			}, {
				actions: I(() => [W("span", IE, [W("span", { class: j(["dot status-dot", F(i_).status]) }, null, 2), da(M(F(Z)(`debug.dev.${F(i_).status}`)), 1)])]),
				default: I(() => [G(ZS, { label: F(Z)("debug.dev.url") }, {
					default: I(() => [W("div", LE, [L(W("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						Zo,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), G(KS, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: F(Z)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), F(i_).error ? (V(), H("span", RE, M(F(i_).error), 1)) : K("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			G(fS, {
				title: F(Z)("debug.assembly"),
				icon: F(Hb),
				collapsible: ""
			}, {
				default: I(() => [n.value ? (V(), H(B, { key: 0 }, [
					W("div", zE, [
						W("span", BE, M(F(Z)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (V(), H("span", VE, M(n.value.workflow), 1)) : K("", !0),
						W("span", HE, M(n.value.origin), 1),
						n.value.dryRun ? (V(), H("span", UE, "dry run")) : K("", !0),
						n.value.input ? (V(), H("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, M(F(Z)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, WE)) : K("", !0),
						t[3] ||= W("span", { class: "grow" }, null, -1),
						da(M(u(n.value.at)), 1)
					]),
					r.value ? (V(), H("div", GE, [
						W("span", { class: j(["badge", r.value.reason ? "warn" : "neutral"]) }, M(r.value.reason ? F(Z)(`debug.cache.flush.${r.value.reason}`) : F(Z)("debug.cache.kept")), 3),
						W("span", KE, M(p(r.value)), 1),
						r.value === n.value.cache ? K("", !0) : (V(), H("span", qE, M(u(r.value.at)), 1))
					])) : K("", !0),
					W("div", null, [(V(!0), H(B, null, z(n.value.regions, (e) => (V(), H("div", {
						key: e.id,
						class: "region"
					}, [W("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						G(F(Eb), { class: j(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						W("span", YE, M(e.id), 1),
						W("span", XE, M(e.messages.length) + " · " + M(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + M(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, JE), i.has(e.id) ? (V(), H(B, { key: 0 }, [(V(!0), H(B, null, z(e.messages, (e, t) => (V(), H("div", {
						key: t,
						class: "region-msg"
					}, [W("div", ZE, [W("span", QE, M(e.role), 1), da(M(e.chars) + " ch", 1)]), W("div", $E, M(e.content), 1)]))), 128)), e.messages.length ? K("", !0) : (V(), H("div", eD, M(F(Z)("debug.emptyRegion")), 1))], 64)) : K("", !0)]))), 128))]),
					n.value.vars?.length ? (V(), H("div", tD, [(V(!0), H(B, null, z(n.value.vars, (e) => (V(), H("div", {
						key: e.id,
						class: "region"
					}, [W("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						G(F(Eb), { class: j(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						W("span", rD, M(e.id), 1),
						W("span", iD, M(e.text.length) + " ch", 1)
					], 8, nD), i.has(`var:${e.id}`) ? (V(), H("div", aD, [W("div", oD, M(e.text), 1), e.text ? K("", !0) : (V(), H("div", sD, M(F(Z)("debug.emptyRegion")), 1))])) : K("", !0)]))), 128))])) : K("", !0),
					n.value.warnings.length ? (V(), H("div", cD, M(n.value.warnings.join(" · ")), 1)) : K("", !0)
				], 64)) : (V(), H("div", lD, M(F(Z)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			G(fS, {
				title: F(Z)("debug.requests"),
				icon: F(Mb),
				collapsible: ""
			}, {
				default: I(() => [(V(!0), H(B, null, z(F(Kp).requests, (e, t) => (V(), H("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [W("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					W("span", dD, M(e.genId) + " · #" + M(e.step), 1),
					e.error ? (V(), H("span", fD, M(F(Z)("debug.error")), 1)) : K("", !0),
					W("span", pD, M(f(e.usage)), 1),
					W("span", mD, M(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, uD), s.value === t ? (V(), H(B, { key: 0 }, [
					W("div", hD, [W("span", gD, M(F(Z)("debug.request")), 1), G($, {
						icon: F(Fb),
						label: F(Z)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					W("pre", _D, M(c(e.request)), 1),
					W("div", vD, [W("span", yD, M(F(Z)("debug.response")), 1), G($, {
						icon: F(Fb),
						label: F(Z)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					W("pre", bD, M(e.error ?? c(e.response ?? "")), 1)
				], 64)) : K("", !0)]))), 128)), F(Kp).requests.length ? K("", !0) : (V(), H("div", xD, M(F(Z)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			G(fS, {
				title: F(Z)("debug.log"),
				icon: F(px),
				collapsible: "",
				open: !1
			}, {
				actions: I(() => [G($, {
					icon: F(yx),
					label: F(Z)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => F(Kp).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: I(() => [(V(!0), H(B, null, z(g.value, (e, n) => (V(), H("div", {
					key: n,
					class: "req"
				}, [W("div", SD, [
					W("span", CD, M(e.kind), 1),
					t[4] ||= W("span", { class: "grow" }, null, -1),
					W("span", wD, M(u(e.at)), 1)
				]), W("pre", TD, M(c(e.data)), 1)]))), 128)), g.value.length ? K("", !0) : (V(), H("div", ED, M(F(Z)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			G(fS, {
				title: F(Z)("debug.annotations"),
				icon: F(ex),
				help: F(Z)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: I(() => [(V(!0), H(B, null, z(_.value, (e, t) => (V(), H("div", {
					key: t,
					class: "req"
				}, [W("div", DD, [W("span", OD, "#" + M(e.mesId), 1), W("span", kD, "“" + M(e.quote) + "”", 1)]), W("div", AD, M(e.comment), 1)]))), 128)), _.value.length ? K("", !0) : (V(), H("div", jD, M(F(Z)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			W("div", MD, "Advanced Preset " + M(F("1.9.0")) + " · " + M(F("13d23d3684ef7bcd")), 1)
		], 64));
	}
}), PD = ["aria-label"], FD = { class: "panel-head" }, ID = { class: "panel-logo" }, LD = { class: "grow" }, RD = { class: "panel-title ellipsis" }, zD = { class: "panel-sub ellipsis" }, BD = {
	class: "tabs",
	role: "tablist"
}, VD = [
	"title",
	"aria-selected",
	"onClick"
], HD = { class: "panel-body scroll" }, UD = /* @__PURE__ */ R({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: rx,
				view: vC
			},
			{
				id: "config",
				icon: gx,
				view: $C
			},
			{
				id: "modules",
				icon: yb,
				view: oE
			},
			{
				id: "writing",
				icon: ax,
				view: hE
			},
			{
				id: "memory",
				icon: xb,
				view: FE
			},
			{
				id: "debug",
				icon: Sb,
				view: ND
			}
		], n = q(() => t.find((e) => e.id === O_.tab) ?? t[0]), r = q({
			get: () => J().enabled,
			set: (e) => {
				J().enabled = e, Y();
			}
		}), i = q(() => {
			let e = j_.value;
			return e ? `v${e.version} · ${M_.value.config}` : Z("panel.noPreset");
		}), a = (e) => {
			e.key === "Escape" && O_.panelOpen && (O_.panelOpen = !1);
		};
		return zr(() => document.addEventListener("keydown", a)), Vr(() => {
			document.removeEventListener("keydown", a), ab(!1);
		}), sr(() => O_.panelOpen, (e) => {
			e && ab(!0);
		}, { immediate: !0 }), (e, a) => (V(), U($a, {
			name: "panel",
			onAfterLeave: a[2] ||= (e) => F(ab)(!1)
		}, {
			default: I(() => [F(O_).panelOpen ? (V(), H("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": F(Z)("app.name")
			}, [
				W("header", FD, [
					W("div", ID, [G(F(Jb))]),
					W("div", LD, [W("div", RD, M(F(j_) ? F(Cd)(F(j_)) : F(Z)("app.name")), 1), W("div", zD, M(i.value), 1)]),
					G(KS, {
						modelValue: r.value,
						"onUpdate:modelValue": a[0] ||= (e) => r.value = e,
						label: F(Z)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					G($, {
						icon: F(Tx),
						label: F(Z)("common.close"),
						align: "end",
						below: "",
						onClick: a[1] ||= (e) => F(O_).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				W("nav", BD, [(V(), H(B, null, z(t, (e) => W("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: j(["tab", { on: e.id === F(O_).tab }]),
					title: F(Z)(`tab.${e.id}`),
					"aria-selected": e.id === F(O_).tab,
					onClick: (t) => F(O_).tab = e.id
				}, [(V(), U(Wr(e.icon))), W("span", null, M(F(Z)(`tab.${e.id}`)), 1)], 10, VD)), 64))]),
				W("main", HD, [(V(), U(Nr, null, [(V(), U(Wr(n.value.view), { key: n.value.id }))], 1024))])
			], 8, PD)) : K("", !0)]),
			_: 1
		}));
	}
}), WD = { class: "inline-drawer" }, GD = { class: "inline-drawer-toggle inline-drawer-header" }, KD = { class: "inline-drawer-content" }, qD = { class: "flex-container alignItemsCenter spaceBetween" }, JD = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, YD = { key: 0 }, XD = { class: "text_muted" }, ZD = {
	key: 1,
	class: "text_muted"
}, QD = /* @__PURE__ */ R({
	__name: "SettingsDrawer",
	setup(e) {
		let t = q({
			get: () => J().enabled,
			set: (e) => {
				J().enabled = e, Y();
			}
		});
		return (e, n) => (V(), H("div", WD, [W("div", GD, [W("b", null, M(F(Z)("app.name")), 1), n[3] ||= W("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), W("div", KD, [
			W("div", qD, [W("label", JD, [L(W("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[Qo, t.value]]), W("span", null, M(F(Z)("settings.enable")), 1)]), W("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => F(F_)(),
				onKeydown: n[2] ||= ls((e) => F(F_)(), ["enter"])
			}, [n[4] ||= W("i", { class: "fa-solid fa-layer-group" }, null, -1), W("span", null, M(F(Z)("panel.open")), 1)], 32)]),
			n[5] ||= W("hr", null, null, -1),
			W("h4", null, M(F(Z)("settings.preset")), 1),
			F(j_) ? (V(), H("div", YD, [da(M(F(Cd)(F(j_))) + " ", 1), W("span", XD, "v" + M(F(j_).version) + " · " + M(F(M_).config), 1)])) : (V(), H("i", ZD, M(F(Z)("settings.inactive")), 1))
		])]));
	}
}), $D = {
	key: 0,
	class: "preset-banner"
}, eO = { class: "preset-banner-text" }, tO = /* @__PURE__ */ R({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => F(j_) ? (V(), H("div", $D, [
			G(F(Jb), { class: "preset-banner-icon" }),
			W("span", eO, M(F(Z)("banner.usesAp")), 1),
			W("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => F(F_)()
			}, M(F(Z)("panel.open")), 1)
		])) : K("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function nO() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), ps(QD).mount(t);
}
function rO() {
	ov("ap-stages", Wx, ["mesid"]), ov("ap-cards", RS, ["mesid"]), ov("ap-dock", US), ov("ap-panel", UD), ov("ap-preset-banner", tO), iv(), A_();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, A_);
	sb(), nO(), Zy(), zy();
}
//#endregion
//#region src/index.ts
var iO = {
	version: "1.9.0",
	buildId: "13d23d3684ef7bcd",
	nextGeneration: (e) => kf(e),
	listPresets: () => ld().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => vf(),
	update: Ug,
	togglePanel: (e) => {
		O_.panelOpen = e ?? !O_.panelOpen;
	},
	annotations: Lg
};
globalThis.advancedPresetInterceptor = Gp, window.AdvancedPreset = iO;
function aO(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function oO() {
	for (let { preset: e } of ld()) try {
		await Cf(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function sO() {
	let { eventSource: t, eventTypes: n } = e();
	J(), bg(), h_(), H_(), Ig(), await i(), await sd();
	for (let { preset: e } of ld()) {
		let t = ff(e);
		t.length && Jp("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => Pm(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => xg(e)), Og(), t.on(n.MESSAGE_RECEIVED, (e, t) => jg(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Bf.setPending(null), Bf.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Bf.sweep());
	let r = aO(() => {
		let e = vf(), t = e ? pd(e) : void 0;
		t && Df(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, r), t.on(n.OAI_PRESET_CHANGED_AFTER, r);
	let a = async () => {
		await oO(), (async () => {
			for (let { preset: e } of ld()) await n_(e);
		})(), Eg({ reload: !0 }), l_(), Vg();
	};
	t.on(n.APP_READY, () => void a()), rO(), Jp("init", {
		version: "1.9.0",
		build: "13d23d3684ef7bcd",
		enabled: J().enabled
	});
}
var cO = Hg, lO = Fy;
sO().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { cO as advancedPresetOnUpdate, lO as advancedPresetRegisterChatSurface };

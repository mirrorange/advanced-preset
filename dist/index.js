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
	let t = e().chatCompletionSettings ?? {}, n = String(t.chat_completion_source ?? ""), r = String(n === "custom" ? t.custom_url ?? "" : t.reverse_proxy ?? "");
	return [
		n,
		o(t),
		r
	].join("|");
}
function o(e) {
	let t = String(e.chat_completion_source ?? ""), r = "";
	try {
		r = String(n.getChatCompletionModel?.() ?? "");
	} catch {
		r = "";
	}
	if (!r) {
		let n = {
			makersuite: "google_model",
			mistralai: "mistralai_model"
		}[t] ?? `${t}_model`;
		r = String(e[n] ?? "");
	}
	return r;
}
var s = [
	"",
	"merge_tools",
	"semi_tools",
	"strict_tools"
];
function c(t = !1) {
	let n = e(), r = n.chatCompletionSettings ?? {};
	if (n.mainApi !== "openai") return { reason: "mainApi" };
	let i = String(r.custom_prompt_post_processing ?? "");
	return s.includes(i) ? t || n.isToolCallingSupported({
		...r,
		function_calling: !0
	}) ? null : r.function_calling ? {
		reason: "model",
		source: String(r.chat_completion_source ?? ""),
		model: o(r)
	} : { reason: "functionCalling" } : {
		reason: "postProcessing",
		label: l(i)
	};
}
function l(e) {
	return typeof document > "u" ? e : Array.from(document.querySelectorAll("#custom_prompt_post_processing option")).find((t) => t.value === e)?.textContent?.trim() || e;
}
function u() {
	let e = /\/scripts\/extensions\/(.+?)\/dist\//.exec(new URL(import.meta.url).pathname);
	return e ? decodeURIComponent(e[1]) : "third-party/advanced-preset";
}
var d = () => r("../");
function f(e) {
	return {
		chatCompletionSource: String(e.chat_completion_source ?? ""),
		model: e.model ?? null,
		customApiFormat: e.custom_api_format ?? null,
		opencodeApiFormat: e.opencode_api_format ?? null
	};
}
function p(e, t, r) {
	let i = typeof r == "string" ? { chatCompletionSource: r } : r;
	if (n.getStreamingReply) return n.getStreamingReply(e, t, {
		...i,
		overrideShowThoughts: !0
	});
	switch (m(i)) {
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
function m(e) {
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
var h = [
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
function g(e) {
	let t = m(e), r = n.getStreamingReply;
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
	return [t, ...h.map(([e]) => e).filter((e) => e !== t)].find((e) => i(h.find(([t]) => t === e)[1])) ?? t;
}
var _ = () => globalThis.quickReplyApi ?? void 0, v = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
async function y(t, n, r) {
	let i = e();
	if (i.callGenericPopup && i.POPUP_TYPE && i.POPUP_RESULT) return await i.callGenericPopup(t, i.POPUP_TYPE.CONFIRM, "", {
		okButton: n,
		cancelButton: r,
		allowVerticalScrolling: !0
	}) === i.POPUP_RESULT.AFFIRMATIVE;
	let a = document.createElement("div");
	return typeof t == "string" ? a.innerHTML = t : a.append(t.cloneNode(!0)), window.confirm(a.innerText || a.textContent || "");
}
async function b(t, n, r, i) {
	let a = e();
	if (a.callGenericPopup && a.POPUP_TYPE?.INPUT !== void 0) {
		let e = await a.callGenericPopup(t, a.POPUP_TYPE.INPUT, n, {
			okButton: r,
			cancelButton: i
		});
		return typeof e == "string" ? e : null;
	}
	let o = document.createElement("div");
	return o.innerHTML = t, window.prompt(o.innerText || o.textContent || "", n);
}
function x(e, t, n) {
	let r = globalThis.toastr;
	r?.[e] ? r[e](t, n) : console[e === "error" ? "error" : "log"](`[AP] ${n ?? ""} ${t}`);
}
var S = (...e) => globalThis.fetch(...e), ee = (e) => {
	S = e;
};
//#endregion
//#region node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function C(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var w = {}, te = [], ne = () => {}, re = () => !1, ie = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), ae = (e) => e.startsWith("onUpdate:"), oe = Object.assign, se = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, ce = Object.prototype.hasOwnProperty, T = (e, t) => ce.call(e, t), E = Array.isArray, le = (e) => _e(e) === "[object Map]", ue = (e) => _e(e) === "[object Set]", de = (e) => _e(e) === "[object Date]", fe = (e) => _e(e) === "[object RegExp]", D = (e) => typeof e == "function", O = (e) => typeof e == "string", pe = (e) => typeof e == "symbol", me = (e) => typeof e == "object" && !!e, he = (e) => (me(e) || D(e)) && D(e.then) && D(e.catch), ge = Object.prototype.toString, _e = (e) => ge.call(e), ve = (e) => _e(e).slice(8, -1), ye = (e) => _e(e) === "[object Object]", be = (e) => O(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, xe = /* @__PURE__ */ C(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), Se = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, Ce = /-\w/g, we = Se((e) => e.replace(Ce, (e) => e.slice(1).toUpperCase())), Te = /\B([A-Z])/g, Ee = Se((e) => e.replace(Te, "-$1").toLowerCase()), De = Se((e) => e.charAt(0).toUpperCase() + e.slice(1)), Oe = Se((e) => e ? `on${De(e)}` : ""), ke = (e, t) => !Object.is(e, t), Ae = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, je = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Me = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, Ne = (e) => {
	let t = O(e) ? Number(e) : NaN;
	return isNaN(t) ? e : t;
}, Pe, Fe = () => Pe ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ie(e) {
	if (E(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = O(r) ? Be(r) : Ie(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (O(e) || me(e)) return e;
}
var Le = /;(?![^(]*\))/g, Re = /:([^]+)/, ze = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Be(e) {
	let t = {};
	return e.replace(ze, (e) => e.startsWith("/*") ? "" : e).split(Le).forEach((e) => {
		if (e) {
			let n = e.split(Re);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function k(e) {
	let t = "";
	if (O(e)) t = e;
	else if (E(e)) for (let n = 0; n < e.length; n++) {
		let r = k(e[n]);
		r && (t += r + " ");
	}
	else if (me(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ve = /* @__PURE__ */ C("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function He(e) {
	return !!e || e === "";
}
function Ue(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = qe(e[i], t[i], n);
	return r;
}
function We(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && qe(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Ge(e, t, n) {
	let r = le(e), i = le(t);
	if (r || i || (r = ue(e), i = ue(t), r || i)) return r && i ? We(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !qe(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Ke(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function qe(e, t, n) {
	if (e === t) return !0;
	let r = de(e), i = de(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = pe(e), i = pe(t), r || i ? e === t : (r = E(e), i = E(t), r || i ? r && i ? Ke(e, t, n, Ue) : !1 : (r = me(e), i = me(t), r || i ? !r || !i ? !1 : Ke(e, t, n, Ge) : String(e) === String(t))));
}
function Je(e, t) {
	return e.findIndex((e) => qe(e, t));
}
var Ye = (e) => !!(e && e.__v_isRef === !0), A = (e) => O(e) ? e : e == null ? "" : E(e) || me(e) && (e.toString === ge || !D(e.toString)) ? Ye(e) ? A(e.value) : JSON.stringify(e, Xe, 2) : String(e), Xe = (e, t) => Ye(t) ? Xe(e, t.value) : le(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Ze(t, r) + " =>"] = n, e), {}) } : ue(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Ze(e)) } : pe(t) ? Ze(t) : me(t) && !E(t) && !ye(t) ? String(t) : t, Ze = (e, t = "") => pe(e) ? `Symbol(${e.description ?? t})` : e, Qe, $e = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && Qe && (Qe.active ? (this.parent = Qe, this.index = (Qe.scopes || (Qe.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = Qe;
			try {
				return Qe = this, e();
			} finally {
				Qe = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = Qe, Qe = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (Qe === this) Qe = this.prevScope;
			else {
				let e = Qe;
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
function et() {
	return Qe;
}
var tt, nt = /* @__PURE__ */ new WeakSet(), rt = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Qe && (Qe.active ? Qe.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, nt.has(this) && (nt.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || st(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, bt(this), ut(this);
		let e = tt, t = gt;
		tt = this, gt = !0;
		try {
			return this.fn();
		} finally {
			dt(this), tt = e, gt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) mt(e);
			this.deps = this.depsTail = void 0, bt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? nt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ft(this) && this.run();
	}
	get dirty() {
		return ft(this);
	}
}, it = 0, at, ot;
function st(e, t = !1) {
	e.flags |= 8, t ? (e.next = ot, ot = e) : (e.next = at, at = e);
}
function ct() {
	it++;
}
function lt() {
	if (--it > 0) return;
	if (ot) {
		let e = ot;
		for (ot = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; at;) {
		let t = at;
		for (at = void 0; t;) {
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
function ut(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function dt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), mt(r), ht(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ft(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (pt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function pt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === xt) || (e.globalVersion = xt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ft(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = tt, r = gt;
	tt = e, gt = !0;
	try {
		ut(e);
		let n = e.fn(e._value);
		(t.version === 0 || ke(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		tt = n, gt = r, dt(e), e.flags &= -3;
	}
}
function mt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) mt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ht(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var gt = !0, _t = [];
function vt() {
	_t.push(gt), gt = !1;
}
function yt() {
	let e = _t.pop();
	gt = e === void 0 || e;
}
function bt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = tt;
		tt = void 0;
		try {
			t();
		} finally {
			tt = e;
		}
	}
}
var xt = 0, St = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ct = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!tt || !gt || tt === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== tt) t = this.activeLink = new St(tt, this), tt.deps ? (t.prevDep = tt.depsTail, tt.depsTail.nextDep = t, tt.depsTail = t) : tt.deps = tt.depsTail = t, wt(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = tt.depsTail, t.nextDep = void 0, tt.depsTail.nextDep = t, tt.depsTail = t, tt.deps === t && (tt.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, xt++, this.notify(e);
	}
	notify(e) {
		ct();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			lt();
		}
	}
};
function wt(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) wt(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Tt = /* @__PURE__ */ new WeakMap(), Et = /* @__PURE__ */ Symbol(""), Dt = /* @__PURE__ */ Symbol(""), Ot = /* @__PURE__ */ Symbol("");
function kt(e, t, n) {
	if (gt && tt) {
		let t = Tt.get(e);
		t || Tt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ct()), r.map = t, r.key = n), r.track();
	}
}
function At(e, t, n, r, i, a) {
	let o = Tt.get(e);
	if (!o) {
		xt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ct(), t === "clear") o.forEach(s);
	else {
		let i = E(e), a = i && be(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Ot || !pe(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Ot)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Et)), le(e) && s(o.get(Dt)));
				break;
			case "delete":
				i || (s(o.get(Et)), le(e) && s(o.get(Dt)));
				break;
			case "set": le(e) && s(o.get(Et));
		}
	}
	lt();
}
function jt(e) {
	let t = /* @__PURE__ */ bn(e);
	return t === e || (kt(t, "iterate", Ot), /* @__PURE__ */ vn(e)) ? t : /* @__PURE__ */ _n(e) ? /* @__PURE__ */ gn(e) ? t.map((e) => Cn(Sn(e))) : t.map(Cn) : t.map(Sn);
}
function Mt(e) {
	return kt(e = /* @__PURE__ */ bn(e), "iterate", Ot), e;
}
function Nt(e, t) {
	return /* @__PURE__ */ _n(e) ? Cn(/* @__PURE__ */ gn(e) ? Sn(t) : t) : Sn(t);
}
var Pt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Ft(this, Symbol.iterator, (e) => Nt(this, e));
	},
	concat(...e) {
		return jt(this).concat(...e.map((e) => E(e) ? jt(e) : e));
	},
	entries() {
		return Ft(this, "entries", (e) => (e[1] = Nt(this, e[1]), e));
	},
	every(e, t) {
		return Rt(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return Rt(this, "filter", e, t, (e) => e.map((e) => Nt(this, e)), arguments);
	},
	find(e, t) {
		return Rt(this, "find", e, t, (e) => Nt(this, e), arguments);
	},
	findIndex(e, t) {
		return Rt(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return Rt(this, "findLast", e, t, (e) => Nt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return Rt(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return Rt(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Bt(this, "includes", e);
	},
	indexOf(...e) {
		return Bt(this, "indexOf", e);
	},
	join(e) {
		return jt(this).join(e);
	},
	lastIndexOf(...e) {
		return Bt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return Rt(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Vt(this, "pop");
	},
	push(...e) {
		return Vt(this, "push", e);
	},
	reduce(e, ...t) {
		return zt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return zt(this, "reduceRight", e, t);
	},
	shift() {
		return Vt(this, "shift");
	},
	some(e, t) {
		return Rt(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Vt(this, "splice", e);
	},
	toReversed() {
		return jt(this).toReversed();
	},
	toSorted(e) {
		return jt(this).toSorted(e);
	},
	toSpliced(...e) {
		return jt(this).toSpliced(...e);
	},
	unshift(...e) {
		return Vt(this, "unshift", e);
	},
	values() {
		return Ft(this, "values", (e) => Nt(this, e));
	}
};
function Ft(e, t, n) {
	let r = Mt(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ vn(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => It(a.next(), n), i !== Lt[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => It(a._next(), n);
	}
	return a;
}
function It(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Lt = Array.prototype;
function Rt(e, t, n, r, i, a) {
	let o = Mt(e), s = o !== e && !/* @__PURE__ */ vn(e), c = o[t];
	if (c !== Lt[t]) {
		let t = c.apply(e, a);
		return s ? Sn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, Nt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function zt(e, t, n, r) {
	let i = Mt(e), a = i !== e && !/* @__PURE__ */ vn(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = Nt(e, t)), n.call(this, t, Nt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? Nt(e, c) : c;
}
function Bt(e, t, n) {
	let r = /* @__PURE__ */ bn(e);
	kt(r, "iterate", Ot);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ yn(n[0]) ? (n[0] = /* @__PURE__ */ bn(n[0]), r[t](...n)) : i;
}
function Vt(e, t, n = []) {
	vt(), ct();
	let r = (/* @__PURE__ */ bn(e))[t].apply(e, n);
	return lt(), yt(), r;
}
var Ht = /* @__PURE__ */ C("__proto__,__v_isRef,__isVue"), Ut = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(pe));
function Wt(e) {
	pe(e) || (e = String(e));
	let t = /* @__PURE__ */ bn(this);
	return kt(t, "has", e), t.hasOwnProperty(e);
}
var Gt = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? un : ln : i ? cn : sn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = E(e);
		if (!r) {
			let e;
			if (a && (e = Pt[t])) return e;
			if (t === "hasOwnProperty") return Wt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ wn(e) ? e : n);
		if ((pe(t) ? Ut.has(t) : Ht(t)) || (r || kt(e, "get", t), i)) return o;
		if (/* @__PURE__ */ wn(o)) {
			let e = a && be(t) ? o : o.value;
			return r && me(e) ? /* @__PURE__ */ mn(e) : e;
		}
		return me(o) ? r ? /* @__PURE__ */ mn(o) : /* @__PURE__ */ fn(o) : o;
	}
}, Kt = class extends Gt {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = E(e) && be(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ _n(i);
			if (!/* @__PURE__ */ vn(n) && !/* @__PURE__ */ _n(n) && (i = /* @__PURE__ */ bn(i), n = /* @__PURE__ */ bn(n)), !a && /* @__PURE__ */ wn(i) && !/* @__PURE__ */ wn(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : T(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ wn(e) ? e : r);
		return e === /* @__PURE__ */ bn(r) && s && (o ? ke(n, i) && At(e, "set", t, n, i) : At(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = T(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && At(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!pe(t) || !Ut.has(t)) && kt(e, "has", t), n;
	}
	ownKeys(e) {
		return kt(e, "iterate", E(e) ? "length" : Et), Reflect.ownKeys(e);
	}
}, qt = class extends Gt {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Jt = /* @__PURE__ */ new Kt(), Yt = /* @__PURE__ */ new qt(), Xt = /* @__PURE__ */ new Kt(!0), Zt = (e) => e, Qt = (e) => Reflect.getPrototypeOf(e);
function $t(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ bn(i), o = le(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Zt : t ? Cn : Sn;
		return !t && kt(a, "iterate", c ? Dt : Et), oe(Object.create(l), { next() {
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
function en(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function tn(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ bn(r), a = /* @__PURE__ */ bn(n);
			e || (ke(n, a) && kt(i, "get", n), kt(i, "get", a));
			let { has: o } = Qt(i), s = t ? Zt : e ? Cn : Sn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && kt(/* @__PURE__ */ bn(t), "iterate", Et), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ bn(n), i = /* @__PURE__ */ bn(t);
			return e || (ke(t, i) && kt(r, "has", t), kt(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ bn(a), s = t ? Zt : e ? Cn : Sn;
			return !e && kt(o, "iterate", Et), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return oe(n, e ? {
		add: en("add"),
		set: en("set"),
		delete: en("delete"),
		clear: en("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ bn(this), r = Qt(n), i = /* @__PURE__ */ bn(e), a = !t && !/* @__PURE__ */ vn(e) && !/* @__PURE__ */ _n(e) ? i : e;
			return r.has.call(n, a) || ke(e, a) && r.has.call(n, e) || ke(i, a) && r.has.call(n, i) || (n.add(a), At(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ vn(n) && !/* @__PURE__ */ _n(n) && (n = /* @__PURE__ */ bn(n));
			let r = /* @__PURE__ */ bn(this), { has: i, get: a } = Qt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ bn(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? ke(n, s) && At(r, "set", e, n, s) : At(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ bn(this), { has: n, get: r } = Qt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ bn(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && At(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ bn(this), t = e.size !== 0, n = e.clear();
			return t && At(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = $t(r, e, t);
	}), n;
}
function nn(e, t) {
	let n = tn(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(T(n, i) && i in r ? n : r, i, a);
}
var rn = { get: /* @__PURE__ */ nn(!1, !1) }, an = { get: /* @__PURE__ */ nn(!1, !0) }, on = { get: /* @__PURE__ */ nn(!0, !1) }, sn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ new WeakMap();
function dn(e) {
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
function fn(e) {
	return /* @__PURE__ */ _n(e) ? e : hn(e, !1, Jt, rn, sn);
}
// @__NO_SIDE_EFFECTS__
function pn(e) {
	return hn(e, !1, Xt, an, cn);
}
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return hn(e, !0, Yt, on, ln);
}
function hn(e, t, n, r, i) {
	if (!me(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = dn(ve(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function gn(e) {
	return /* @__PURE__ */ _n(e) ? /* @__PURE__ */ gn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function _n(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function vn(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function yn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function bn(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ bn(t) : e;
}
function xn(e) {
	return !T(e, "__v_skip") && Object.isExtensible(e) && je(e, "__v_skip", !0), e;
}
var Sn = (e) => me(e) ? /* @__PURE__ */ fn(e) : e, Cn = (e) => me(e) ? /* @__PURE__ */ mn(e) : e;
// @__NO_SIDE_EFFECTS__
function wn(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function j(e) {
	return Tn(e, !1);
}
function Tn(e, t) {
	return /* @__PURE__ */ wn(e) ? e : new En(e, t);
}
var En = class {
	constructor(e, t) {
		this.dep = new Ct(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ bn(e), this._value = t ? e : Sn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ vn(e) || /* @__PURE__ */ _n(e);
		e = n ? e : /* @__PURE__ */ bn(e), ke(e, t) && (this._rawValue = e, this._value = n ? e : Sn(e), this.dep.trigger());
	}
};
function M(e) {
	return /* @__PURE__ */ wn(e) ? e.value : e;
}
var Dn = {
	get: (e, t, n) => t === "__v_raw" ? e : M(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ wn(i) && !/* @__PURE__ */ wn(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function On(e) {
	return /* @__PURE__ */ gn(e) ? e : new Proxy(e, Dn);
}
var kn = class {
	constructor(e) {
		this.__v_isRef = !0, this._value = void 0;
		let t = this.dep = new Ct(), { get: n, set: r } = e(t.track.bind(t), t.trigger.bind(t));
		this._get = n, this._set = r;
	}
	get value() {
		return this._value = this._get();
	}
	set value(e) {
		this._set(e);
	}
};
function An(e) {
	return new kn(e);
}
var jn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ct(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = xt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && tt !== this) return st(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return pt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Mn(e, t, n = !1) {
	let r, i;
	return D(e) ? r = e : (r = e.get, i = e.set), new jn(r, i, n);
}
var Nn = {}, Pn = /* @__PURE__ */ new WeakMap(), Fn = void 0;
function In(e, t = !1, n = Fn) {
	if (n) {
		let t = Pn.get(n);
		t || Pn.set(n, t = []), t.push(e);
	}
}
function Ln(e, t, n = w) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ vn(e) || i === !1 || i === 0 ? Rn(e, 1) : Rn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ wn(e) ? (d = () => e.value, m = /* @__PURE__ */ vn(e)) : /* @__PURE__ */ gn(e) ? (d = () => l(e), m = !0) : E(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ gn(e) || /* @__PURE__ */ vn(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ wn(e)) return e.value;
		if (/* @__PURE__ */ gn(e)) return l(e);
		if (D(e)) return c ? c(e, 2) : e();
	})) : d = D(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			vt();
			try {
				f();
			} finally {
				yt();
			}
		}
		let t = Fn;
		Fn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			Fn = t;
		}
	} : ne, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Rn(e(), t);
	}
	let g = et(), _ = () => {
		u.stop(), g && g.active && se(g.effects, u);
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
	let v = h ? Array(e.length).fill(Nn) : Nn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => ke(e, v[t])) : ke(n, v))) {
					let e = Fn;
					vt();
					try {
						f && f(), Fn = u;
						let e = [
							n,
							v === Nn ? void 0 : h && v[0] === Nn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						Fn = e, yt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new rt(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => In(e, !1, u), f = u.onStop = () => {
		let e = Pn.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			Pn.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function Rn(e, t = Infinity, n) {
	if (t <= 0 || !me(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ wn(e)) Rn(e.value, t, n);
	else if (E(e)) for (let r = 0; r < e.length; r++) Rn(e[r], t, n);
	else if (ue(e) || le(e)) e.forEach((e) => {
		Rn(e, t, n);
	});
	else if (ye(e)) {
		for (let r in e) Rn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Rn(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function zn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Vn(e, t, n);
	}
}
function Bn(e, t, n, r) {
	if (D(e)) {
		let i = zn(e, t, n, r);
		return i && he(i) && i.catch((e) => {
			Vn(e, t, n);
		}), i;
	}
	if (E(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(Bn(e[a], t, n, r));
		return i;
	}
}
function Vn(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || w;
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
			vt(), zn(a, null, 10, [
				e,
				i,
				o
			]), yt();
			return;
		}
	}
	Hn(e, n, i, r, o);
}
function Hn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var Un = [], Wn = -1, Gn = [], Kn = null, qn = 0, Jn = /* @__PURE__ */ Promise.resolve(), Yn = null;
function Xn(e) {
	let t = Yn || Jn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Zn(e) {
	let t = Wn + 1, n = Un.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = Un[r], a = ar(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function Qn(e) {
	if (!(e.flags & 1)) {
		let t = ar(e), n = Un[Un.length - 1];
		!n || !(e.flags & 2) && t >= ar(n) ? Un.push(e) : Un.splice(Zn(t), 0, e), e.flags |= 1, $n();
	}
}
function $n() {
	Yn ||= Jn.then(or);
}
function er(e) {
	if (!E(e)) Kn && e.id === -1 ? Kn.splice(qn + 1, 0, e) : e.flags & 1 || (Gn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Gn.push(e[t]);
	$n();
}
function tr(e, t, n, r = Wn + 1) {
	for (; r < Un.length; r++) {
		let n = Un[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			Un.splice(r, 1), r = e ? r - 1 : Wn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function nr(e, t, n = 0) {
	if (Gn.length) {
		let e = Gn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Gn.length; i++) {
				let a = Gn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Gn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => ar(e) - ar(t));
		if (Gn.length = r, Kn) {
			for (let e = 0; e < i.length; e++) Kn.push(i[e]);
			return;
		}
		for (Kn = i, qn = 0; qn < Kn.length; qn++) {
			let e = Kn[qn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Kn = null, qn = 0;
	}
}
var rr = !1;
function ir(e, t) {
	if (rr) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Gn);
	e(), rr = !0;
	try {
		tr(void 0, t), nr(void 0, n, t);
	} finally {
		rr = !1;
	}
}
var ar = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function or(e) {
	try {
		for (Wn = 0; Wn < Un.length; Wn++) {
			let e = Un[Wn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), zn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; Wn < Un.length; Wn++) {
			let e = Un[Wn];
			e && (e.flags &= -2);
		}
		Wn = -1, Un.length = 0, nr(e), Yn = null, (Un.length || Gn.length) && or(e);
	}
}
var sr = null, cr = null;
function lr(e) {
	let t = sr;
	return sr = e, cr = e && e.type.__scopeId || null, t;
}
function N(e, t = sr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && da(-1);
		let i = lr(t), a = sa.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = sa.length; e > a; e--) la();
			lr(i), r._d && da(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function P(e, t) {
	if (sr === null) return e;
	let n = Ua(sr), r = e.dirs ||= [];
	for (let e = 0; e < t.length; e++) {
		let [i, a, o, s = w] = t[e];
		i && (D(i) && (i = {
			mounted: i,
			updated: i
		}), i.deep && Rn(a), r.push({
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
function ur(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (vt(), Bn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), yt());
	}
}
function dr(e, t, n = !1) {
	let r = Aa();
	if (r || mi) {
		let i = mi ? mi._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && D(t) ? t.call(r && r.proxy) : t;
	}
}
var fr = /* @__PURE__ */ Symbol.for("v-scx"), pr = () => dr(fr);
function mr(e, t) {
	return _r(e, null, t);
}
function hr(e, t) {
	return _r(e, null, { flush: "sync" });
}
function gr(e, t, n) {
	return _r(e, t, n);
}
function _r(e, t, n = w) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = oe({}, n), c = t && r || !t && a !== "post", l;
	if (Ia) {
		if (a === "sync") {
			let e = pr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = ne, e.resume = ne, e.pause = ne, e;
		}
	}
	let u = ka;
	s.call = (e, t, n) => Bn(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Gi(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : Qn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Ln(e, t, s);
	return Ia && (l ? l.push(f) : c && f()), f;
}
var vr = /* @__PURE__ */ Symbol("_vte"), yr = (e) => e.__isTeleport, br = /* @__PURE__ */ Symbol("_leaveCb"), xr = /* @__PURE__ */ Symbol("_enterCb");
function Sr() {
	let e = {
		isMounted: !1,
		isLeaving: !1,
		isUnmounting: !1,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	return Jr(() => {
		e.isMounted = !0;
	}), Xr(() => {
		e.isUnmounting = !0;
	}), e;
}
var Cr = [Function, Array], wr = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: Cr,
	onEnter: Cr,
	onAfterEnter: Cr,
	onEnterCancelled: Cr,
	onBeforeLeave: Cr,
	onLeave: Cr,
	onAfterLeave: Cr,
	onLeaveCancelled: Cr,
	onBeforeAppear: Cr,
	onAppear: Cr,
	onAfterAppear: Cr,
	onAppearCancelled: Cr
}, Tr = {
	name: "BaseTransition",
	props: wr,
	setup(e, { slots: t }) {
		let n = Aa(), r = Sr();
		return () => {
			let i = t.default && Nr(t.default(), !0), a = i && i.length ? Er(i) : n.subTree ? W() : void 0;
			if (!a) return;
			let o = /* @__PURE__ */ bn(e), { mode: s } = o;
			if (r.isLeaving) return Ar(a);
			let c = jr(a);
			if (!c) return Ar(a);
			let l = kr(c, o, r, n, (e) => l = e);
			c.type !== aa && Mr(c, l);
			let u = n.subTree && jr(n.subTree);
			if (u && u.type !== aa && !ma(u, c) && Pr(n.subTree)) {
				let e = kr(u, o, r, n);
				if (Mr(u, e), s === "out-in" && c.type !== aa) return r.isLeaving = !0, e.afterLeave = () => {
					r.isLeaving = !1, n.job.flags & 8 || n.update(), delete e.afterLeave, u = void 0;
				}, Ar(a);
				s === "in-out" && c.type !== aa ? e.delayLeave = (e, t, n) => {
					let i = Or(r, u);
					i[String(u.key)] = u, e[br] = () => {
						t(), e[br] = void 0, delete l.delayedLeave, u = void 0;
					}, l.delayedLeave = () => {
						n(), delete l.delayedLeave, u = void 0;
					};
				} : u = void 0;
			} else u &&= void 0;
			return a;
		};
	}
};
function Er(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== aa) {
			t = n;
			break;
		}
	}
	return t;
}
var Dr = Tr;
function Or(e, t) {
	let { leavingVNodes: n } = e, r = n.get(t.type);
	return r || (r = /* @__PURE__ */ Object.create(null), n.set(t.type, r)), r;
}
function kr(e, t, n, r, i) {
	let { appear: a, mode: o, persisted: s = !1, onBeforeEnter: c, onEnter: l, onAfterEnter: u, onEnterCancelled: d, onBeforeLeave: f, onLeave: p, onAfterLeave: m, onLeaveCancelled: h, onBeforeAppear: g, onAppear: _, onAfterAppear: v, onAppearCancelled: y } = t, b = String(e.key), x = Or(n, e), S = (e, t) => {
		e && Bn(e, r, 9, t);
	}, ee = (e, t) => {
		let n = t[1];
		S(e, t), E(e) ? e.every((e) => e.length <= 1) && n() : e.length <= 1 && n();
	}, C = {
		mode: o,
		persisted: s,
		beforeEnter(t) {
			let r = c;
			if (!n.isMounted) {
				if (a) r = g || c;
				else return;
			}
			t[br] && t[br](!0);
			let i = x[b];
			if (i && ma(e, i)) {
				let e = i.el[br];
				if (!e) {
					let t = Pr(i);
					e = t && t.el[br];
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
			t[xr] = (e) => {
				s || (s = !0, S(e ? o : i, [t]), C.delayedLeave && C.delayedLeave(), t[xr] = void 0);
			};
			let c = t[xr].bind(null, !1);
			r ? ee(r, [t, c]) : c();
		},
		leave(t, r) {
			let i = String(e.key);
			if (t[xr] && t[xr](!0), n.isUnmounting) return r();
			S(f, [t]);
			let a = !1;
			t[br] = (n) => {
				a || (a = !0, r(), S(n ? h : m, [t]), t[br] = void 0, x[i] === e && delete x[i]);
			};
			let o = t[br].bind(null, !1);
			x[i] = e, p ? ee(p, [t, o]) : o();
		},
		clone(e) {
			let a = kr(e, t, n, r, i);
			return i && i(a), a;
		}
	};
	return C;
}
function Ar(e) {
	if (Vr(e)) return e = ya(e), e.children = null, e;
}
function jr(e) {
	if (!Vr(e)) return yr(e.type) && e.children ? Er(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && D(n.default)) return n.default();
	}
}
function Mr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Mr(yr(n.type) && jr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === L && E(e.children)) {
		let n = xi(e.children, !1);
		n && Mr(n, t);
	}
}
function Nr(e, t = !1, n) {
	let r = [], i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a], s = n == null ? o.key : String(n) + String(o.key == null ? a : o.key);
		o.type === L ? (o.patchFlag & 128 && i++, r = r.concat(Nr(o.children, t, s))) : (t || o.type !== aa) && r.push(s == null ? o : ya(o, { key: s }));
	}
	if (i > 1) for (let e = 0; e < r.length; e++) r[e].patchFlag = -2;
	return r;
}
function Pr(e) {
	if (e.component) return Pr(e.component.subTree);
	if (e.type === L) {
		let t = E(e.children) && xi(e.children, !1);
		return t ? Pr(t) : void 0;
	}
	if (e.type !== aa) return e;
}
// @__NO_SIDE_EFFECTS__
function F(e, t) {
	return D(e) ? /* @__PURE__ */ oe({ name: e.name }, t, { setup: e }) : e;
}
function Fr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Ir(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Lr = /* @__PURE__ */ new WeakMap();
function Rr(e, t, n, r, i = !1) {
	if (E(e)) {
		e.forEach((e, a) => Rr(e, t && (E(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Br(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Rr(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Ua(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === w ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ bn(d), p = d === w ? re : (e) => !Ir(u, e) && T(f, e), m = (e, t) => !(t && Ir(u, t));
	if (l != null && l !== c) {
		if (zr(t), O(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ wn(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (D(c)) zn(c, s, 12, [o, u]);
	else {
		let t = O(c), r = /* @__PURE__ */ wn(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) E(n) && se(n, a);
					else if (E(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), Lr.delete(e);
				};
				t.id = -1, Lr.set(e, t), Gi(t, n);
			} else zr(e), s();
		}
	}
}
function zr(e) {
	let t = Lr.get(e);
	t && (t.flags |= 8, Lr.delete(e));
}
Fe().requestIdleCallback, Fe().cancelIdleCallback;
var Br = (e) => !!e.type.__asyncLoader, Vr = (e) => e.type.__isKeepAlive, Hr = {
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
		let n = Aa(), r = n.ctx;
		if (!r.renderer) return () => {
			let e = t.default && t.default();
			return e && e.length === 1 ? e[0] : e;
		};
		let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), o = null, s = n.suspense, { renderer: { p: c, m: l, um: u, o: { createElement: d } } } = r, f = d("div");
		r.activate = (e, t, n, r, i) => {
			let a = e.component;
			l(e, t, n, 0, s), c(a.vnode, e, t, n, a, s, r, e.slotScopeIds, i), Gi(() => {
				a.isDeactivated = !1, a.a && Ae(a.a);
				let t = e.props && e.props.onVnodeMounted;
				t && wa(t, a.parent, e);
			}, s);
		}, r.deactivate = (e) => {
			let t = e.component;
			ea(t.m), ea(t.a), l(e, f, null, 1, s), Gi(() => {
				t.da && Ae(t.da);
				let n = e.props && e.props.onVnodeUnmounted;
				n && wa(n, t.parent, e), t.isDeactivated = !0;
			}, s);
		};
		function p(e) {
			Wr(e), u(e, n, s, !0);
		}
		function m(e) {
			i.forEach((t, n) => {
				let r = Wa(Br(t) ? t.type.__asyncResolved || {} : t.type);
				r && !e(r) && h(n);
			});
		}
		function h(e) {
			let t = i.get(e);
			t && (!o || !ma(t, o)) ? p(t) : o && (Wr(o), t && Wr(t)), i.delete(e), a.delete(e);
		}
		gr(() => [e.include, e.exclude], ([e, t]) => {
			e && m((t) => Ur(e, t)), t && m((e) => !Ur(t, e));
		}, {
			flush: "post",
			deep: !0
		});
		let g = null, _ = () => {
			g != null && (na(n.subTree.type) ? Gi(() => {
				let e = Gr(n.subTree);
				e.component && i.set(g, e);
			}, n.subTree.suspense) : i.set(g, Gr(n.subTree)));
		};
		return Jr(_), Yr(_), Xr(() => {
			i.forEach((e) => {
				let { subTree: t, suspense: r } = n, i = Gr(t);
				if (e.type === i.type && e.key === i.key) {
					Wr(i);
					let e = i.component.da;
					e && Gi(e, r);
				} else p(e);
			});
		}), () => {
			if (g = null, !t.default) return o = null;
			let n = t.default(), r = n[0];
			if (n.length > 1) return o = null, n;
			if (!pa(r) || !(r.shapeFlag & 4) && !(r.shapeFlag & 128)) return o = null, r;
			let s = Gr(r);
			if (s.type === aa) return o = null, s;
			let c = s.type, l = Wa(Br(s) ? s.type.__asyncResolved || {} : c), { include: u, exclude: d, max: f } = e;
			if (u && (!l || !Ur(u, l)) || d && l && Ur(d, l)) return s.shapeFlag &= -257, o = s, r;
			let p = s.key == null ? c : s.key, m = i.get(p);
			return s.el && (s = ya(s), r.shapeFlag & 128 && (r.ssContent = s)), g = p, m ? (s.el = m.el, s.component = m.component, s.transition && Mr(s, s.transition), s.shapeFlag |= 512, a.delete(p), a.add(p)) : (a.add(p), f && a.size > parseInt(f, 10) && h(a.values().next().value)), s.shapeFlag |= 256, o = s, na(r.type) ? r : s;
		};
	}
};
function Ur(e, t) {
	return E(e) ? e.some((e) => Ur(e, t)) : O(e) ? e.split(",").includes(t) : fe(e) ? (e.lastIndex = 0, e.test(t)) : !1;
}
function Wr(e) {
	e.shapeFlag &= -257, e.shapeFlag &= -513;
}
function Gr(e) {
	return e.shapeFlag & 128 ? e.ssContent : e;
}
function Kr(e, t, n = ka, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			vt();
			let i = Na(n), a = Bn(t, n, e, r);
			return i(), yt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var qr = (e) => (t, n = ka) => {
	(!Ia || e === "sp") && Kr(e, (...e) => t(...e), n);
}, Jr = qr("m"), Yr = qr("u"), Xr = qr("bum"), Zr = "components", Qr = /* @__PURE__ */ Symbol.for("v-ndc");
function $r(e) {
	return O(e) ? ei(Zr, e, !1) || e : e || Qr;
}
function ei(e, t, n = !0, r = !1) {
	let i = sr || ka;
	if (i) {
		let n = i.type;
		if (e === Zr) {
			let e = Wa(n, !1);
			if (e && (e === t || e === we(t) || e === De(we(t)))) return n;
		}
		let a = ti(i[e] || n[e], t) || ti(i.appContext[e], t);
		return !a && r ? n : a;
	}
}
function ti(e, t) {
	return e && (e[t] || e[we(t)] || e[De(we(t))]);
}
function I(e, t, n, r) {
	let i, a = n && n[r], o = E(e);
	if (o || O(e)) {
		let n = o && /* @__PURE__ */ gn(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ vn(e), s = /* @__PURE__ */ _n(e), e = Mt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Cn(Sn(e[n])) : Sn(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		if (!Number.isInteger(e) || e < 0) i = [];
		else {
			i = Array(e);
			for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
		}
	} else if (me(e)) {
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
function ni(e, t) {
	for (let n = 0; n < t.length; n++) {
		let r = t[n];
		if (E(r)) for (let t = 0; t < r.length; t++) e[r[t].name] = r[t].fn;
		else r && (e[r.name] = r.key ? (...e) => {
			let t = r.fn(...e);
			return t && (t.key = r.key), t;
		} : r.fn);
	}
	return e;
}
function ri(e, t, n, r, i, a) {
	if (n ??= {}, sr.ce || sr.parent && Br(sr.parent) && sr.parent.ce) {
		let e = a != null && n.key == null ? oe({}, n, { key: a }) : n, i = Object.keys(e).length > 0;
		return t !== "default" && (e.name = t), R(), B(L, null, [H("slot", e, r && r())], i ? -2 : 64);
	}
	let o = e[t];
	o && o._c && (o._d = !1);
	let s = sa.length;
	R();
	let c;
	try {
		let i = o && ii(o(n)), s = n.key || a || i && i.key;
		c = B(L, { key: (s && !pe(s) ? s : `_${t}`) + (!i && r ? "_fb" : "") }, i || (r ? r() : []), i && e._ === 1 ? 64 : -2);
	} catch (e) {
		for (let e = sa.length; e > s; e--) la();
		throw e;
	} finally {
		o && o._c && (o._d = !0);
	}
	return !i && c.scopeId && (c.slotScopeIds = [c.scopeId + "-s"]), c;
}
function ii(e) {
	return e.some((e) => !pa(e) || !(e.type === aa || e.type === L && !ii(e.children))) ? e : null;
}
var ai = (e) => e ? Fa(e) ? Ua(e) : ai(e.parent) : null, oi = /* @__PURE__ */ oe(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => ai(e.parent),
	$root: (e) => ai(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => e.type,
	$forceUpdate: (e) => e.f ||= () => {
		Qn(e.update);
	},
	$nextTick: (e) => e.n ||= Xn.bind(e.proxy),
	$watch: (e) => ne
}), si = (e, t) => e !== w && !e.__isScriptSetup && T(e, t), ci = {
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
			else if (si(r, t)) return o[t] = 1, r[t];
			else if (T(a, t)) return o[t] = 3, a[t];
			else if (n !== w && T(n, t)) return o[t] = 4, n[t];
			else o[t] = 0;
		}
		let l = oi[t], u, d;
		if (l) return t === "$attrs" && kt(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== w && T(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, T(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return si(i, t) ? (i[t] = n, !0) : T(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || si(t, s) || T(a, s) || T(r, s) || T(oi, s) || T(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? T(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function li(e) {
	return E(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
function ui(e, t) {
	return !e || !t ? e || t : E(e) && E(t) ? e.concat(t) : oe({}, li(e), li(t));
}
function di() {
	return {
		app: null,
		config: {
			isNativeTag: re,
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
var fi = 0;
function pi(e, t) {
	return function(n, r = null) {
		D(n) || (n = oe({}, n)), r != null && !me(r) && (r = null);
		let i = di(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: fi++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: qa,
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
					let u = c._ceVNode || H(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, Ua(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (Bn(o, c._instance, 16), e(null, c._container), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = mi;
				mi = c;
				try {
					return e();
				} finally {
					mi = t;
				}
			}
		};
		return c;
	};
}
var mi = null;
function hi(e, t, n = w) {
	let r = Aa(), i = we(t), a = Ee(t), o = gi(e, i), s = An((o, s) => {
		let c, l = w, u;
		return hr(() => {
			let t = e[i];
			ke(c, t) && (c = t, s());
		}), {
			get() {
				return o(), n.get ? n.get(c) : c;
			},
			set(e) {
				let o = n.set ? n.set(e) : e;
				if (!ke(o, c) && !(l !== w && ke(e, l))) return;
				let d = r.vnode.props, f = !!(d && (t in d || i in d || a in d) && (`onUpdate:${t}` in d || `onUpdate:${i}` in d || `onUpdate:${a}` in d));
				f || (c = e, s()), r.emit(`update:${t}`, o), ke(e, l) && (ke(e, o) && !ke(o, u) || f && l !== w && !ke(o, c)) && s(), l = e, u = o;
			}
		};
	});
	return s[Symbol.iterator] = () => {
		let e = 0;
		return { next() {
			return e < 2 ? {
				value: e++ ? o || w : s,
				done: !1
			} : { done: !0 };
		} };
	}, s;
}
var gi = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${we(t)}Modifiers`] || e[`${Ee(t)}Modifiers`];
function _i(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || w, i = n, a = t.startsWith("update:"), o = a && gi(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => O(e) ? e.trim() : e)), o.number && (i = i.map(Me)));
	let s, c = r[s = Oe(t)] || r[s = Oe(we(t))];
	!c && a && (c = r[s = Oe(Ee(t))]), c && Bn(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, Bn(l, e, 6, i);
	}
}
function vi(e, t, n = !1) {
	let r = t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {};
	return a ? (E(a) ? a.forEach((e) => o[e] = null) : oe(o, a), me(e) && r.set(e, o), o) : (me(e) && r.set(e, null), null);
}
function yi(e, t) {
	return !e || !ie(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), T(e, t[0].toLowerCase() + t.slice(1)) || T(e, Ee(t)) || T(e, t));
}
function bi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = lr(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = ba(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = ba(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : Si(s);
		}
	} catch (t) {
		sa.length = 0, Vn(t, e, 1), _ = H(aa);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(ae) && (v = Ci(v, a)), y = ya(y, v, !1, !0));
	}
	return n.dirs && (y = ya(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Mr(yr(y.type) && jr(y) || y, n.transition), _ = y, lr(g), _;
}
function xi(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (pa(r)) {
			if (r.type !== aa || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Si = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || ie(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Ci = (e, t) => {
	let n = {};
	for (let r in e) (!ae(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function wi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Ti(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ei(o, r, n) && !yi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Ti(r, o, l) : !!o;
	return !1;
}
function Ti(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!T(e, a) || Ei(t, e, a) && !yi(n, a)) return !0;
	}
	return !1;
}
function Ei(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && me(r) && me(i) ? !qe(r, i) : r !== i;
}
function Di({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Oi = {}, ki = () => Object.create(Oi), Ai = (e) => Object.getPrototypeOf(e) === Oi;
function ji(e, t, n, r = !1) {
	let i = {}, a = ki();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ni(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ pn(i) : e.type.props ? i : a, e.attrs = a;
}
function Mi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ bn(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (yi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (T(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = we(o);
						i[t] = Pi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ni(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !T(t, a) && ((r = Ee(a)) === a || !T(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Pi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !T(t, e)) && (delete a[e], l = !0);
	}
	l && At(e.attrs, "set", "");
}
function Ni(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (xe(c)) continue;
		let l = t[c], u;
		i && T(i, u = we(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : yi(e.emitsOptions, c) || (!(c in r) || l !== r[c]) && (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ bn(n), r = s || w;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Pi(i, t, s, r[s], e, !T(r, s));
		}
	}
	return o;
}
function Pi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = T(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && D(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Na(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === Ee(n)) && (r = !0));
	}
	return r;
}
function Fi(e, t, n = !1) {
	let r = t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [];
	if (!a) return me(e) && r.set(e, te), te;
	if (E(a)) for (let e = 0; e < a.length; e++) {
		let t = we(a[e]);
		Ii(t) && (o[t] = w);
	}
	else if (a) for (let e in a) {
		let t = we(e);
		if (Ii(t)) {
			let n = a[e], r = o[t] = E(n) || D(n) ? { type: n } : oe({}, n), i = r.type, c = !1, l = !0;
			if (E(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = D(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = D(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || T(r, "default")) && s.push(t);
		}
	}
	let c = [o, s];
	return me(e) && r.set(e, c), c;
}
function Ii(e) {
	return e[0] !== "$" && !xe(e);
}
var Li = (e) => e === "_" || e === "_ctx" || e === "$stable", Ri = (e) => E(e) ? e.map(ba) : [ba(e)], zi = (e, t, n) => {
	if (t._n) return t;
	let r = N((...e) => Ri(t(...e)), n);
	return r._c = !1, r;
}, Bi = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Li(n)) continue;
		let i = e[n];
		if (D(i)) t[n] = zi(n, i, r);
		else if (i != null) {
			let e = Ri(i);
			t[n] = () => e;
		}
	}
}, Vi = (e, t) => {
	let n = Ri(t);
	e.slots.default = () => n;
}, Hi = (e, t, n) => {
	for (let r in t) (n || !Li(r)) && (e[r] = t[r]);
}, Ui = (e, t, n) => {
	let r = e.slots = ki();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Hi(r, t, n), n && je(r, "_", e, !0)) : Bi(t, r);
	} else t && Vi(e, t);
}, Wi = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = w;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Hi(i, t, n) : (a = !t.$stable, Bi(t, i)), o = t;
	} else t && (Vi(e, t), o = { default: 1 });
	if (a) for (let e in i) !Li(e) && o[e] == null && delete i[e];
}, Gi = ra;
function Ki(e) {
	return qi(e);
}
function qi(e, t) {
	let n = Fe();
	n.__VUE__ = !0;
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = ne, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ma(e, t) && (r = _e(e), O(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === te && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case ia:
				g(e, t, n, r);
				break;
			case aa:
				_(e, t, n, r);
				break;
			case oa:
				e ?? v(t, n, r, o);
				break;
			case L:
				oe(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? se(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ye);
		}
		u != null && i ? Rr(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Rr(e.ref, null, a, e, !0);
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
	}, y = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, b = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, x = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) S(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), re(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && C(e.children, f, null, i, s, Ji(e, c), l, d), _ && ur(e, null, i, "created"), ee(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !xe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && wa(p, i, e);
		}
		_ && ur(e, null, i, "beforeMount");
		let v = Xi(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Gi(() => {
			try {
				p && wa(p, i, e), v && g.enter(f), _ && ur(e, null, i, "mounted");
			} finally {}
		}, s);
	}, ee = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || na(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				ee(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, C = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? xa(e[l]) : ba(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, re = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el, { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || w, m = t.props || w, h;
		if (n && Yi(n, !1), (h = m.onVnodeBeforeUpdate) && wa(h, n, t, e), f && ur(t, e, n, "beforeUpdate"), n && Yi(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ie(e.dynamicChildren, d, c, n, r, Ji(t, i), o) : s || ue(e, t, c, null, n, r, Ji(t, i), o, !1), l > 0) {
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
		((h = m.onVnodeUpdated) || f) && Gi(() => {
			h && wa(h, n, t, e), f && ur(t, e, n, "updated");
		}, r);
	}, ie = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || ta(c), f = u && (c.type === L || !ma(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, ae = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== w) for (let o in t) !xe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (xe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, oe = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), C(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ie(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Zi(e, t, !0)) : ue(e, t, n, f, a, o, c, l, u);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ce(t, n, r, i, a, o, c) : T(e, t, c);
	}, ce = (e, t, n, r, i, a, o) => {
		let s = e.component = Oa(e, r, i);
		if (Vr(e) && (s.ctx.renderer = ye), La(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, E, o, a), !e.el) {
				let r = s.subTree = H(aa);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else E(s, e, t, n, i, a, o);
	}, T = (e, t, n) => {
		let r = t.component = e.component;
		if (wi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, le(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, E = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = $i(e);
					if (n) {
						t && (t.el = c.el, le(e, t, o)), n.asyncDep.then(() => {
							Gi(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				Yi(e, !1), t ? (t.el = c.el, le(e, t, o)) : t = c, n && Ae(n), (f = t.props && t.props.onVnodeBeforeUpdate) && wa(f, s, t, c), Yi(e, !0);
				let p = bi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), _e(m), e, i, a), t.el = p.el, u === null && Di(e, p.el), r && Gi(r, i), (f = t.props && t.props.onVnodeUpdated) && Gi(() => wa(f, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Br(t);
				if (Yi(e, !1), l && Ae(l), !m && (o = c && c.onVnodeBeforeMount) && wa(o, d, t), Yi(e, !0), s && Se) {
					let t = () => {
						e.subTree = bi(e), Se(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = bi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Gi(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Gi(() => wa(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Br(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Gi(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new rt(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => Qn(u), Yi(e, !0), l();
	}, le = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, Mi(e, t.props, r, n), Wi(e, t.children, n), vt(), tr(e), yt();
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
		m & 8 ? (d & 16 && ge(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? fe(l, f, n, r, i, a, o, s, c) : ge(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && C(f, n, r, i, a, o, s, c));
	}, de = (e, t, n, r, i, a, o, s, c) => {
		e ||= te, t ||= te;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? xa(t[f]) : ba(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? ge(e, i, a, !0, !1, d) : C(t, n, r, i, a, o, s, c, d);
	}, fe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? xa(t[l]) : ba(t[l]);
			if (ma(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? xa(t[f]) : ba(t[f]);
			if (ma(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? xa(t[l]) : ba(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) O(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? xa(t[l]) : ba(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					O(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && ma(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? O(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let ee = b ? Qi(S) : te;
			for (_ = ee.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || ta(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== ee[_] ? D(d, n, p, 2) : _--);
			}
		}
	}, D = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) D(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ye);
		else if (c === L) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) D(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === oa) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[br] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Gi(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[br];
					s._isLeaving && s[br](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, O = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (vt(), Rr(s, null, n, e, !0), yt()), p != null && (!e.ctx || e.ctx === t) && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Br(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && wa(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && ur(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ye, r) : l && !l.hasOnce && (a !== L || d > 0 && d & 64) ? ge(l, t, n, !1, !0) : (a === L && d & 384 || !i && u & 16) && ge(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Gi(() => {
			_ && wa(_, t, e), h && ur(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === L;
		if (o && !a) {
			me(n, r);
			return;
		}
		if (t === oa) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Pr(e) : e, c = () => {
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
		ea(c), ea(l), r && Ae(r), i.stop(), a ? (a.flags |= 8, O(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, O(o, e, t, n)), s && Gi(s, t), Gi(() => {
			e.isUnmounted = !0;
		}, t);
	}, ge = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) O(e[o], t, n, r, i);
	}, _e = (e) => {
		if (e.shapeFlag & 6) return _e(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[vr];
		return n ? f(n) : t;
	}, ve = (e, t, n) => {
		ir(() => {
			e == null ? t._vnode && O(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Da());
	}, ye = {
		p: h,
		um: O,
		m: D,
		r: pe,
		mt: ce,
		mc: C,
		pc: ue,
		pbc: ie,
		n: _e,
		o: e
	}, be, Se;
	return t && ([be, Se] = t(ye)), {
		render: ve,
		hydrate: be,
		createApp: pi(ve, be)
	};
}
function Ji({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function Yi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Xi(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Zi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (E(r) && E(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = xa(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Zi(t, a)), a.type === ia && (a.patchFlag === -1 && (a = i[e] = xa(a)), a.el = t.el), a.type === aa && !a.el && (a.el = t.el);
	}
}
function Qi(e) {
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
function $i(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : $i(t);
}
function ea(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function ta(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? ta(t.subTree) : null;
}
var na = (e) => e.__isSuspense;
function ra(e, t) {
	t && t.pendingBranch ? E(e) ? t.effects.push(...e) : t.effects.push(e) : er(e);
}
var L = /* @__PURE__ */ Symbol.for("v-fgt"), ia = /* @__PURE__ */ Symbol.for("v-txt"), aa = /* @__PURE__ */ Symbol.for("v-cmt"), oa = /* @__PURE__ */ Symbol.for("v-stc"), sa = [], ca = null;
function R(e = !1) {
	sa.push(ca = e ? null : []);
}
function la() {
	sa.pop(), ca = sa[sa.length - 1] || null;
}
var ua = 1;
function da(e, t = !1) {
	ua += e, e < 0 && ca && t && (ca.hasOnce = !0);
}
function fa(e) {
	return e.dynamicChildren = ua > 0 ? ca || te : null, la(), ua > 0 && ca && ca.push(e), e;
}
function z(e, t, n, r, i, a) {
	return fa(V(e, t, n, r, i, a, !0));
}
function B(e, t, n, r, i) {
	return fa(H(e, t, n, r, i, !0));
}
function pa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ma(e, t) {
	return e.type === t.type && e.key === t.key;
}
var ha = ({ key: e }) => e ?? null, ga = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : O(e) || /* @__PURE__ */ wn(e) || D(e) ? {
	i: sr,
	r: e,
	k: t,
	f: !!n
} : e);
function V(e, t = null, n = null, r = 0, i = null, a = e === L ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && ha(t),
		ref: t && ga(t),
		scopeId: cr,
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
		ctx: sr
	};
	return s ? (Sa(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= O(n) ? 8 : 16), ua > 0 && !o && ca && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ca.push(c), c;
}
var H = _a;
function _a(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === Qr) && (e = aa), pa(e)) {
		let r = ya(e, t, !0);
		return n && Sa(r, n), ua > 0 && !a && ca && (r.shapeFlag & 6 ? ca[ca.indexOf(e)] = r : ca.push(r)), r.patchFlag = -2, r;
	}
	if (Ga(e) && (e = e.__vccOpts), t) {
		t = va(t);
		let { class: e, style: n } = t;
		e && !O(e) && (t.class = k(e)), me(n) && (/* @__PURE__ */ yn(n) && !E(n) && (n = oe({}, n)), t.style = Ie(n));
	}
	let o = O(e) ? 1 : na(e) ? 128 : yr(e) ? 64 : me(e) ? 4 : D(e) ? 2 : 0;
	return V(e, t, n, r, i, o, a, !0);
}
function va(e) {
	return e ? /* @__PURE__ */ yn(e) || Ai(e) ? oe({}, e) : e : null;
}
function ya(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ca(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && ha(l),
		ref: t && t.ref ? n && a ? E(a) ? a.concat(ga(t)) : [a, ga(t)] : ga(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== L ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && ya(e.ssContent),
		ssFallback: e.ssFallback && ya(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Mr(u, c.clone(u)), u;
}
function U(e = " ", t = 0) {
	return H(ia, null, e, t);
}
function W(e = "", t = !1) {
	return t ? (R(), B(aa, null, e)) : H(aa, null, e);
}
function ba(e) {
	return e == null || typeof e == "boolean" ? H(aa) : E(e) ? H(L, null, e.slice()) : pa(e) ? xa(e) : H(ia, null, String(e));
}
function xa(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : ya(e);
}
function Sa(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (E(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Sa(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Ai(t) ? t._ctx = sr : r === 3 && sr && (sr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (D(t)) {
		if (r & 65) {
			Sa(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: sr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [U(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ca(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = k([t.class, r.class]));
		else if (e === "style") t.style = Ie([t.style, r.style]);
		else if (ie(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(E(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !ae(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function wa(e, t, n, r = null) {
	Bn(e, t, 7, [n, r]);
}
var Ta = di(), Ea = 0;
function Da() {
	return Ea;
}
function Oa(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Ta, a = {
		uid: Ea++,
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
		scope: new $e(!0),
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
		propsOptions: Fi(r, i),
		emitsOptions: vi(r, i),
		emit: null,
		emitted: null,
		propsDefaults: w,
		inheritAttrs: r.inheritAttrs,
		ctx: w,
		data: w,
		props: w,
		attrs: w,
		slots: w,
		refs: w,
		setupState: w,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = _i.bind(null, a), e.ce && e.ce(a), a;
}
var ka = null, Aa = () => ka || sr, ja, Ma;
{
	let e = Fe(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	ja = t("__VUE_INSTANCE_SETTERS__", (e) => ka = e), Ma = t("__VUE_SSR_SETTERS__", (e) => Ia = e);
}
var Na = (e) => {
	let t = ka;
	return ja(e), e.scope.on(), () => {
		e.scope.off(), ja(t);
	};
}, Pa = () => {
	ka && ka.scope.off(), ja(null);
};
function Fa(e) {
	return e.vnode.shapeFlag & 4;
}
var Ia = !1;
function La(e, t = !1, n = !1) {
	t && Ma(t);
	let { props: r, children: i } = e.vnode, a = Fa(e);
	ji(e, r, a, t), Ui(e, i, n || t);
	let o = a ? Ra(e, t) : void 0;
	return t && Ma(!1), o;
}
function Ra(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ci);
	let { setup: r } = n;
	if (r) {
		vt();
		let n = e.setupContext = r.length > 1 ? Ha(e) : null, i = Na(e), a = zn(r, e, 0, [e.props, n]), o = he(a);
		if (yt(), i(), (o || e.sp) && !Br(e) && Fr(e), o) {
			if (a.then(Pa, Pa), t) return a.then((n) => {
				Ma(!0);
				try {
					za(e, n, t);
				} finally {
					Ma(!1);
				}
			}).catch((t) => {
				Vn(t, e, 0);
			});
			e.asyncDep = a;
		} else za(e, a, t);
	} else Ba(e, t);
}
function za(e, t, n) {
	D(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : me(t) && (e.setupState = On(t)), Ba(e, n);
}
function Ba(e, t, n) {
	let r = e.type;
	e.render ||= r.render || ne;
}
var Va = { get(e, t) {
	return kt(e, "get", ""), e[t];
} };
function Ha(e) {
	return {
		attrs: new Proxy(e.attrs, Va),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Ua(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(On(xn(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in oi) return oi[n](e);
		},
		has(e, t) {
			return t in e || t in oi;
		}
	}) : e.proxy;
}
function Wa(e, t = !0) {
	return D(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function Ga(e) {
	return D(e) && "__vccOpts" in e;
}
var G = (e, t) => /* @__PURE__ */ Mn(e, t, Ia);
function Ka(e, t, n) {
	try {
		da(-1);
		let r = arguments.length;
		return r === 2 ? me(t) && !E(t) ? pa(t) ? H(e, null, [t]) : H(e, t) : H(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && pa(n) && (n = [n]), H(e, t, n));
	} finally {
		da(1);
	}
}
var qa = "3.5.44", Ja = void 0, Ya = typeof window < "u" && window.trustedTypes;
if (Ya) try {
	Ja = /* @__PURE__ */ Ya.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Xa = Ja ? (e) => Ja.createHTML(e) : (e) => e, Za = "http://www.w3.org/2000/svg", Qa = "http://www.w3.org/1998/Math/MathML", $a = typeof document < "u" ? document : null, eo = $a && /* @__PURE__ */ $a.createElement("template"), to = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? $a.createElementNS(Za, e) : t === "mathml" ? $a.createElementNS(Qa, e) : n ? $a.createElement(e, { is: n }) : $a.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => $a.createTextNode(e),
	createComment: (e) => $a.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => $a.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			eo.innerHTML = Xa(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = eo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, no = "transition", ro = "animation", io = /* @__PURE__ */ Symbol("_vtc"), ao = {
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
}, oo = /* @__PURE__ */ oe({}, wr, ao), so = /* @__PURE__ */ ((e) => (e.displayName = "Transition", e.props = oo, e))((e, { slots: t }) => Ka(Dr, uo(e), t)), co = (e, t = []) => {
	E(e) ? e.forEach((e) => e(...t)) : e && e(...t);
}, lo = (e) => e ? E(e) ? e.some((e) => e.length > 1) : e.length > 1 : !1;
function uo(e) {
	let t = {};
	for (let n in e) n in ao || (t[n] = e[n]);
	if (e.css === !1) return t;
	let { name: n = "v", type: r, duration: i, enterFromClass: a = `${n}-enter-from`, enterActiveClass: o = `${n}-enter-active`, enterToClass: s = `${n}-enter-to`, appearFromClass: c = a, appearActiveClass: l = o, appearToClass: u = s, leaveFromClass: d = `${n}-leave-from`, leaveActiveClass: f = `${n}-leave-active`, leaveToClass: p = `${n}-leave-to` } = e, m = fo(i), h = m && m[0], g = m && m[1], { onBeforeEnter: _, onEnter: v, onEnterCancelled: y, onLeave: b, onLeaveCancelled: x, onBeforeAppear: S = _, onAppear: ee = v, onAppearCancelled: C = y } = t, w = (e, t, n, r) => {
		e._enterCancelled = r, ho(e, t ? u : s), ho(e, t ? l : o), n && n();
	}, te = (e, t) => {
		e._isLeaving = !1, ho(e, d), ho(e, p), ho(e, f), t && t();
	}, ne = (e) => (t, n) => {
		let i = e ? ee : v, o = () => w(t, e, n);
		co(i, [t, o]), go(() => {
			ho(t, e ? c : a), mo(t, e ? u : s), lo(i) || vo(t, r, h, o);
		});
	};
	return oe(t, {
		onBeforeEnter(e) {
			co(_, [e]), mo(e, a), mo(e, o);
		},
		onBeforeAppear(e) {
			co(S, [e]), mo(e, c), mo(e, l);
		},
		onEnter: ne(!1),
		onAppear: ne(!0),
		onLeave(e, t) {
			e._isLeaving = !0;
			let n = () => te(e, t);
			mo(e, d), e._enterCancelled ? (mo(e, f), So(e)) : (So(e), mo(e, f)), go(() => {
				e._isLeaving && (ho(e, d), mo(e, p), lo(b) || vo(e, r, g, n));
			}), co(b, [e, n]);
		},
		onEnterCancelled(e) {
			w(e, !1, void 0, !0), co(y, [e]);
		},
		onAppearCancelled(e) {
			w(e, !0, void 0, !0), co(C, [e]);
		},
		onLeaveCancelled(e) {
			te(e), co(x, [e]);
		}
	});
}
function fo(e) {
	if (e == null) return null;
	if (me(e)) return [po(e.enter), po(e.leave)];
	{
		let t = po(e);
		return [t, t];
	}
}
function po(e) {
	return Ne(e);
}
function mo(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.add(t)), (e[io] || (e[io] = /* @__PURE__ */ new Set())).add(t);
}
function ho(e, t) {
	t.split(/\s+/).forEach((t) => t && e.classList.remove(t));
	let n = e[io];
	n && (n.delete(t), n.size || (e[io] = void 0));
}
function go(e) {
	requestAnimationFrame(() => {
		requestAnimationFrame(e);
	});
}
var _o = 0;
function vo(e, t, n, r) {
	let i = e._endId = ++_o, a = () => {
		i === e._endId && r();
	};
	if (n != null) return setTimeout(a, n);
	let { type: o, timeout: s, propCount: c } = yo(e, t);
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
function yo(e, t) {
	let n = window.getComputedStyle(e), r = (e) => (n[e] || "").split(", "), i = r(`${no}Delay`), a = r(`${no}Duration`), o = bo(i, a), s = r(`${ro}Delay`), c = r(`${ro}Duration`), l = bo(s, c), u = null, d = 0, f = 0;
	t === no ? o > 0 && (u = no, d = o, f = a.length) : t === ro ? l > 0 && (u = ro, d = l, f = c.length) : (d = Math.max(o, l), u = d > 0 ? o > l ? no : ro : null, f = u ? u === no ? a.length : c.length : 0);
	let p = u === no && /\b(?:transform|all)(?:,|$)/.test(r(`${no}Property`).toString());
	return {
		type: u,
		timeout: d,
		propCount: f,
		hasTransform: p
	};
}
function bo(e, t) {
	for (; e.length < t.length;) e = e.concat(e);
	return Math.max(...t.map((t, n) => xo(t) + xo(e[n])));
}
function xo(e) {
	return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function So(e) {
	return (e ? e.ownerDocument : document).body.offsetHeight;
}
function Co(e, t, n) {
	let r = e[io];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var wo = /* @__PURE__ */ Symbol("_vod"), To = /* @__PURE__ */ Symbol("_vsh"), Eo = /* @__PURE__ */ Symbol(""), Do = /(?:^|;)\s*display\s*:/;
function Oo(e, t, n) {
	let r = e.style, i = O(n), a = !1;
	if (n && !i) {
		if (t) {
			if (O(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Ao(r, t, "");
			}
			else for (let e in t) n[e] ?? Ao(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Ao(r, i, "") : Po(e, i, !O(t) && t ? t[i] : void 0, o) || Ao(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[Eo];
			e && (n += ";" + e), r.cssText = n, a = Do.test(n);
		}
	} else t && e.removeAttribute("style");
	wo in e && ((!i || t !== n) && (e[wo] = a ? r.display : ""), e[To] && (r.display = "none"));
}
var ko = /\s*!important$/;
function Ao(e, t, n) {
	if (E(n)) n.forEach((n) => Ao(e, t, n));
	else if (n ??= "", t.startsWith("--")) ko.test(n) ? e.setProperty(t, n.replace(ko, ""), "important") : e.setProperty(t, n);
	else {
		let r = No(e, t);
		ko.test(n) ? e.setProperty(Ee(r), n.replace(ko, ""), "important") : e[r] = n;
	}
}
var jo = [
	"Webkit",
	"Moz",
	"ms"
], Mo = {};
function No(e, t) {
	let n = Mo[t];
	if (n) return n;
	let r = we(t);
	if (r !== "filter" && r in e) return Mo[t] = r;
	r = De(r);
	for (let n = 0; n < jo.length; n++) {
		let i = jo[n] + r;
		if (i in e) return Mo[t] = i;
	}
	return t;
}
function Po(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && O(r) && n === r;
}
var Fo = "http://www.w3.org/1999/xlink";
function Io(e, t, n, r, i, a = Ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Fo, t.slice(6, t.length)) : e.setAttributeNS(Fo, t, n) : n == null || a && !He(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : pe(n) ? String(n) : n);
}
function Lo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Xa(n) : n);
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
		r === "boolean" ? n = He(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Ro(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function zo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Bo = /* @__PURE__ */ Symbol("_vei");
function Vo(e, t, n, r, i = null) {
	let a = e[Bo] || (e[Bo] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Wo(t);
		r ? Ro(e, n, a[t] = Jo(r, i), s) : o && (zo(e, n, o, s), a[t] = void 0);
	}
}
var Ho = /(Once|Passive|Capture)$/, Uo = /^on:?(?:Once|Passive|Capture)$/;
function Wo(e) {
	let t, n;
	for (; (n = e.match(Ho)) && !Uo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : Ee(e.slice(2)), t];
}
var Go = 0, Ko = /* @__PURE__ */ Promise.resolve(), qo = () => Go ||= (Ko.then(() => Go = 0), Date.now());
function Jo(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (E(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && Bn(e, t, 5, a);
			}
		} else Bn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = qo(), n;
}
var Yo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Xo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? Co(e, r, o) : t === "style" ? Oo(e, n, r) : ie(t) ? ae(t) || Vo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Zo(e, t, r, o)) ? (Lo(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && Io(e, t, r, o, a, t !== "value")) : e._isVueCE && (Qo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !O(r))) ? Lo(e, we(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Io(e, t, r, o));
};
function Zo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Yo(t) && D(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Yo(t) && O(n) ? !1 : t in e;
}
function Qo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = we(t);
	return Array.isArray(n) ? n.some((e) => we(e) === r) : Object.keys(n).some((e) => we(e) === r);
}
var $o = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return E(t) ? (e) => Ae(t, e) : t;
};
function es(e) {
	e.target.composing = !0;
}
function ts(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ns = /* @__PURE__ */ Symbol("_assign"), rs = /* @__PURE__ */ Symbol("_initialValue");
function is(e, t, n) {
	return t && (e = e.trim()), n && (e = Me(e)), e;
}
var as = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e.parentNode && (e.type === "text" ? e[rs] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[rs] = e.defaultValue.replace(/\r\n?/g, "\n"))), e[ns] = $o(i);
		let a = r || i.props && i.props.type === "number";
		Ro(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ns](is(e.value, n, a));
		}), (n || a) && Ro(e, "change", () => {
			e.value = is(e.value, n, a);
		}), t || (Ro(e, "compositionstart", es), Ro(e, "compositionend", ts), Ro(e, "change", ts));
	},
	mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
		let i = t ?? "", a = e[rs];
		delete e[rs], a !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== a ? e[ns](is(e.value, n, r)) : e.value = i;
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ns] = $o(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? Me(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, os = {
	deep: !0,
	created(e, t, n) {
		e[ns] = $o(n), Ro(e, "change", () => {
			let t = e._modelValue, n = ds(e), r = e.checked, i = e[ns];
			if (E(t)) {
				let e = Je(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (ue(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(fs(e, r));
		});
	},
	mounted: ss,
	beforeUpdate(e, t, n) {
		e[ns] = $o(n), ss(e, t, n);
	}
};
function ss(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (E(t)) i = Je(t, r.props.value) > -1;
	else if (ue(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = qe(t, fs(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var cs = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Ro(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? Me(ds(e)) : ds(e)), r = e.multiple, i = r ? ue(e._modelValue) ? new Set(t) : t : t[0], a = e._pendingValue = [r, r ? E(i) ? t.slice() : t : i];
			try {
				e[ns](i);
			} finally {
				Xn(() => {
					e._pendingValue === a && (e._pendingValue = void 0);
				});
			}
		}), e[ns] = $o(r);
	},
	mounted(e, { value: t }) {
		us(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ns] = $o(n);
	},
	updated(e, { value: t }) {
		let n = e._pendingValue;
		e._pendingValue = void 0, (!n || n[0] !== e.multiple || !ls(t, n[1], n[0])) && us(e, t);
	}
};
function ls(e, t, n) {
	if (!n || E(e)) return qe(e, t);
	if (ue(e)) {
		if (e.size !== t.length) return !1;
		for (let n of t) if (!e.has(n)) return !1;
		return !0;
	}
	return !1;
}
function us(e, t) {
	let n = e.multiple, r = E(t);
	if (!n || r || ue(t)) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = ds(a);
			if (n) {
				if (r) {
					let e = typeof o;
					a.selected = e === "string" || e === "number" ? t.some((e) => String(e) === String(o)) : Je(t, o) > -1;
				} else a.selected = t.has(o);
			} else if (qe(ds(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function ds(e) {
	return "_value" in e ? e._value : e.value;
}
function fs(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var ps = [
	"ctrl",
	"shift",
	"alt",
	"meta"
], ms = {
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
	exact: (e, t) => ps.some((n) => e[`${n}Key`] && !t.includes(n))
}, hs = (e, t) => {
	if (!e) return e;
	let n = e._withMods ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n, ...r) => {
		for (let e = 0; e < t.length; e++) {
			let r = ms[t[e]];
			if (r && r(n, t)) return;
		}
		return e(n, ...r);
	}));
}, gs = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
}, _s = (e, t) => {
	let n = e._withKeys ||= {}, r = t.join(".");
	return n[r] || (n[r] = ((n) => {
		if (!("key" in n)) return;
		let r = Ee(n.key);
		if (t.some((e) => e === r || gs[e] === r)) return e(n);
	}));
}, vs = /* @__PURE__ */ oe({ patchProp: Xo }, to), ys;
function bs() {
	return ys ||= Ki(vs);
}
var xs = ((...e) => {
	let t = bs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Cs(e);
		if (!r) return;
		let i = t._component;
		!D(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ss(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ss(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Cs(e) {
	return O(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/store/settings.ts
var ws = () => ({
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
}), Ts = null;
function K() {
	if (Ts) return Ts;
	let t = e().extensionSettings, n = t.advancedPreset ??= {}, r = ws();
	for (let [e, t] of Object.entries(r)) n[e] === void 0 ? n[e] = t : t && typeof t == "object" && !Array.isArray(t) && (n[e] = {
		...t,
		...n[e]
	});
	return Ts = /* @__PURE__ */ fn(n), Ts;
}
var q = () => e().saveSettingsDebounced(), Es = [
	"prefill",
	"plaintext",
	"structured",
	"tool-single",
	"tool-multi"
], Ds = [
	"auto",
	"on",
	"off"
], Os = [
	"off",
	"vertex",
	"aistudio"
], ks = ["annotations", "speech"], As = (e) => ks.includes(e.kind), js = [
	"keep",
	"truncate",
	"remove"
], Ms = class extends Error {
	source;
	pos;
	constructor(e, t, n) {
		super(`${e} at ${n} in \`${t}\``), this.source = t, this.pos = n;
	}
}, Ns = [
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
function Ps(e) {
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
			if (i >= e.length) throw new Ms("Unterminated string", e, n);
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
		let i = Ns.find((t) => e.startsWith(t, n));
		if (!i) throw new Ms(`Unexpected character '${r}'`, e, n);
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
var Fs = {
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
function Is(e) {
	let t = Ps(e), n = 0, r = () => t[n], i = () => t[n++], a = (t) => {
		let n = i();
		if (n.k !== "op" || n.v !== t) throw new Ms(`Expected '${t}'`, e, n.pos);
	}, o = (e) => e.k === "op" && e.v in Fs ? e.v : e.k === "id" && e.v === "in" ? "in" : null;
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
				throw new Ms(`Unexpected '${t.v}'`, e, t.pos);
			default: throw new Ms("Unexpected end of expression", e, t.pos);
		}
	}
	function c(e) {
		let t = s();
		for (;;) {
			let n = o(r());
			if (!n) break;
			let a = Fs[n];
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
	if (u.k !== "end") throw new Ms("Unexpected token", e, u.pos);
	return l;
}
function Ls(e, t) {
	return e === t || e == null && t == null ? !0 : typeof e == "number" && typeof t == "string" ? String(e) === t : typeof e == "string" && typeof t == "number" && e === String(t);
}
function Rs(e) {
	return Array.isArray(e) ? e.length > 0 : !!e;
}
function zs(e, t) {
	switch (e.t) {
		case "lit": return e.v;
		case "arr": return e.items.map((e) => zs(e, t));
		case "var": return t(e.path);
		case "not": return !Rs(zs(e.e, t));
		case "bin": {
			if (e.op === "&&") return Rs(zs(e.l, t)) && Rs(zs(e.r, t));
			if (e.op === "||") return Rs(zs(e.l, t)) || Rs(zs(e.r, t));
			let n = zs(e.l, t), r = zs(e.r, t);
			switch (e.op) {
				case "==": return Ls(n, r);
				case "!=": return !Ls(n, r);
				case "in": return Array.isArray(r) ? r.some((e) => Ls(n, e)) : typeof r == "string" && typeof n == "string" && r.includes(n);
				default: {
					let t = Number(n ?? 0), i = Number(r ?? 0);
					return e.op === "<" ? t < i : e.op === "<=" ? t <= i : e.op === ">" ? t > i : t >= i;
				}
			}
		}
	}
}
function Bs(e, t) {
	return !e || Rs(zs(e, t));
}
function Vs(...e) {
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
var Hs = /\{\{ap::([^{}]*?)\}\}/g;
function Us(e, t, n = 0) {
	if (n > 8 || !e.includes("{{ap::")) return e;
	let r = !1, i = e.replace(Hs, (e, n) => {
		let i = t(n.split("::").map((e) => e.trim()));
		return i === void 0 ? e : (r = !0, i);
	});
	return r ? Us(i, t, n + 1) : i;
}
//#endregion
//#region packages/protocol/src/tags.ts
function Ws(e) {
	return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Gs(e) {
	return e.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function Ks(e) {
	let t = {};
	for (let n of e.matchAll(/([A-Za-z_][\w-]*)\s*=\s*("([^"]*)"|'([^']*)')/g)) t[n[1]] = Gs(n[3] ?? n[4] ?? "");
	return t;
}
function qs(e, t) {
	let n = [], r = RegExp(`<${Ws(t)}(\\s[^<>]*)?>`, "g"), i = `</${t}>`, a;
	for (; a = r.exec(e);) {
		let t = a.index + a[0].length, o = e.indexOf(i, t);
		if (o < 0) {
			n.push({
				inner: e.slice(t),
				attrs: Ks(a[1] ?? ""),
				open: !0,
				start: a.index,
				end: e.length
			});
			break;
		}
		n.push({
			inner: e.slice(t, o),
			attrs: Ks(a[1] ?? ""),
			open: !1,
			start: a.index,
			end: o + i.length
		}), r.lastIndex = o + i.length;
	}
	return n;
}
function Js(e, t) {
	if (!t.length) return e;
	let n = [...t].sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += e.slice(i, t.start), i = t.end);
	return r + e.slice(i);
}
function Ys(e, t) {
	let n = qs(e, t)[0];
	return n ? Gs(n.inner).trim() : void 0;
}
function Xs(e) {
	let t = e.lastIndexOf("<");
	if (t < 0) return 0;
	let n = e.slice(t);
	return n.includes(">") ? 0 : n === "<" || n === "</" || /^<\/?[A-Za-z_!][^\s<>]*(\s[^<>]*)?$/.test(n) ? n.length : 0;
}
function Zs(e) {
	return e.replace(/<!--[\s\S]*?-->/g, "").replace(/<!--[\s\S]*$/, "");
}
var Qs = "{==", $s = "==}", ec = "{>>", tc = "<<}", nc = /\n[ \t]*\n/g;
function rc(e, t) {
	nc.lastIndex = t;
	let n = nc.exec(e);
	return n ? n.index : Infinity;
}
function ic(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function ac(e, t, n, r) {
	let i = rc(e, t), a = e.indexOf(n, t);
	return a >= 0 && a < i ? a : i !== Infinity || r ? -1 : null;
}
function oc(e, t = {}) {
	let n = t.final ?? !0, r = [], i = [], a = "", o = 0;
	scan: for (; o < e.length;) if (e.startsWith(Qs, o)) {
		let t = o + 3, s = ac(e, t, $s, n);
		if (s === null) {
			let n = e.slice(t);
			a += n.slice(0, n.length - ic(n, [$s]));
			break;
		}
		if (s < 0) {
			let n = Math.min(rc(e, t), e.length);
			a += e.slice(t, n), r.push("annotations: unterminated `{==` dropped"), o = n;
			continue;
		}
		let c = e.slice(t, s), l = s + 3;
		for (; l < e.length && (e[l] === " " || e[l] === "	");) l++;
		let u = a.length;
		if (a += c, !n && (l >= e.length || ec.startsWith(e.slice(l, l + 3)) && l + 3 > e.length)) break;
		if (e.startsWith(ec, l)) {
			let t = l + 3, s = ac(e, t, tc, n);
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
	} else if (e.startsWith(ec, o)) {
		let t = o + 3, i = ac(e, t, tc, n);
		if (i === null) break;
		if (i >= 0) {
			r.push("annotations: comment without highlight removed"), o = i + 3;
			continue;
		}
		a += ec, o = t;
	} else {
		if (!n && e[o] === "{") {
			let t = e.slice(o);
			if (t.length < 3 && (Qs.startsWith(t) || ec.startsWith(t))) break scan;
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
function sc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function cc(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function lc(e, t) {
	if (!t.quote) return -1;
	let n = -1, r = -1, i = Infinity;
	for (let a = e.indexOf(t.quote); a >= 0; a = e.indexOf(t.quote, a + 1)) {
		let o = sc(t.prefix, e.slice(Math.max(0, a - t.prefix.length), a)) + cc(t.suffix, e.slice(a + t.quote.length, a + t.quote.length + t.suffix.length)), s = Math.abs(a - t.start);
		(o > r || o === r && s < i) && (n = a, r = o, i = s);
	}
	return n;
}
function uc(e, t) {
	let n = !1;
	return {
		annotations: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = lc(e, t);
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
function dc(e, t) {
	let n = uc(e, t).annotations.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), r = "", i = 0;
	for (let t of n) t.start < i || (r += `${e.slice(i, t.start)}${Qs}${t.quote}${$s}${ec}${t.comment}${tc}`, i = t.end);
	return r + e.slice(i);
}
//#endregion
//#region packages/protocol/src/media.ts
var fc = [
	"openai",
	"gemini",
	"novelai"
], pc = [
	"fish",
	"elevenlabs",
	"minimax",
	"gemini",
	"openai",
	"deepseek"
], mc = {
	on: !1,
	auto: !1,
	api: "",
	style: !1,
	sfw: !1,
	refs: !1
}, hc = {
	on: !1,
	auto: !1,
	api: "",
	narrator: !1,
	characters: !1
}, gc = (e) => (e ?? []).map((e) => `- ${e.id}: ${e.description}`.trimEnd()).join("\n"), _c = [
	"1:1",
	"3:4",
	"4:3",
	"9:16",
	"16:9"
], vc = [
	"prompt",
	"refs",
	"ratio",
	"caption"
], yc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function bc(e) {
	let t = Array.isArray(e) ? e.map(yc) : typeof e == "string" ? e.split(/[,，、\n]/) : [];
	return [...new Set(t.map((e) => e.trim()).filter(Boolean))];
}
function xc(e) {
	let t = yc(e).trim().replace(/[：xX×/]/g, ":").replace(/\s+/g, "");
	return _c.includes(t) ? t : void 0;
}
function Sc(e) {
	let t = yc(e.prompt ?? e.description ?? e.text).trim();
	if (!t) return;
	let n = { prompt: t }, r = bc(e.refs ?? e.references);
	r.length && (n.refs = r);
	let i = xc(e.ratio ?? e.aspect_ratio ?? e.aspectRatio);
	i && (n.ratio = i);
	let a = yc(e.caption ?? e.title).trim();
	return a && (n.caption = a), n;
}
function Cc(e, t) {
	if (typeof e == "string") {
		let t = e.trim();
		if (t.startsWith("[") || t.startsWith("{")) try {
			e = JSON.parse(t);
		} catch {}
		typeof e == "string" && (e = t ? [{ prompt: t }] : []);
	}
	e && typeof e == "object" && !Array.isArray(e) && Array.isArray(e.images) && (e = e.images);
	let n = (Array.isArray(e) ? e : e && typeof e == "object" ? [e] : []).map((e) => Sc(e && typeof e == "object" ? e : { prompt: e })).filter((e) => !!e), r = t && t > 0 ? n.slice(0, t) : n;
	return r.length ? { images: r } : void 0;
}
var wc = "speech", Tc = "character", Ec = (e) => e.text ?? e.quote, Dc = /<\/?[A-Za-z][\w-]*(?:\s[^<>]*)?\/?>|\[[^\[\]\n]{1,40}\]/g;
function Oc(e, t = Dc) {
	if (typeof t == "function") return t(e);
	let n = t.global ? t : new RegExp(t.source, `${t.flags}g`);
	n.lastIndex = 0;
	let r = e.replace(n, "");
	if (r === e) return e;
	let i = r.replace(/([ \t])[ \t]+/g, "$1");
	return /^\s/.test(e) || (i = i.replace(/^\s+/, "")), /\s$/.test(e) || (i = i.replace(/\s+$/, "")), i;
}
function kc(e, t) {
	let n = 0;
	for (let r of t) for (let t = Math.min(r.length - 1, e.length); t > n; t--) if (e.endsWith(r.slice(0, t))) {
		n = t;
		break;
	}
	return n;
}
function Ac(e) {
	let t = e.lastIndexOf("<"), n = e.lastIndexOf("["), r = e.length;
	return t >= 0 && !e.includes(">", t) && (r = Math.min(r, t)), n >= 0 && !e.includes("]", n) && e.length - n <= 41 && (r = Math.min(r, n)), e.slice(0, r);
}
function jc(e, t = {}) {
	let n = t.tag || "speech", r = t.final ?? !0, i = t.cleaner ?? Dc, a = [], o = RegExp(`<${n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s[^<>]*)?>`, "g"), s = `</${n}>`, c = `<${n}`, l = [], u = [], d = [], f = "", p = 0, m = (t, n) => {
		n <= t || (l.push({
			in: t,
			out: f.length,
			len: n - t
		}), f += e.slice(t, n));
	};
	for (; p < e.length;) {
		o.lastIndex = p;
		let t = o.exec(e), l = e.indexOf(s, p);
		if (l >= 0 && (!t || l < t.index)) {
			m(p, l), a.push(`speech: </${n}> without <${n}> removed`), p = l + s.length;
			continue;
		}
		if (!t) {
			let t = e.length;
			if (!r) {
				t -= kc(e.slice(p), [c, s]);
				let n = e.lastIndexOf(c);
				if (n >= p && !e.includes(">", n)) {
					let r = e[n + c.length];
					(r === void 0 || /\s/.test(r)) && (t = Math.min(t, n));
				}
			}
			m(p, t);
			break;
		}
		m(p, t.index);
		let h = t[1] ?? "", g = Gs(/\bcharacter\s*=\s*(?:"([^"]*)"|'([^']*)')/.exec(h)?.slice(1).find((e) => e !== void 0) ?? "").trim(), _ = t.index + t[0].length, v = e.indexOf(s, _);
		o.lastIndex = _;
		let y = o.exec(e);
		if (v < 0) {
			let t = e.slice(_);
			if (!r) {
				let e = Oc(Ac(t.slice(0, t.length - kc(t, [s]))), i);
				f += e;
				break;
			}
			a.push(`speech: unterminated <${n}> dropped`), p = _;
			continue;
		}
		let b = e.slice(_, v);
		y && y.index < v && (a.push(`speech: nested <${n}> dropped`), b = b.replace(new RegExp(o.source, "g"), ""));
		let x = Oc(b, i), S = f.length;
		f += x, u.push({
			inStart: t.index,
			inEnd: v + s.length,
			outStart: S,
			outEnd: f.length
		}), x.trim() ? d.push({
			start: S,
			end: f.length,
			quote: x,
			text: b,
			character: g
		}) : a.push("speech: empty line ignored"), g || a.push("speech: line without a character"), p = v + s.length;
	}
	let h = d.map((e, t) => ({
		id: `s${t + 1}`,
		start: e.start,
		end: e.end,
		quote: e.quote,
		prefix: f.slice(Math.max(0, e.start - 32), e.start),
		suffix: f.slice(e.end, e.end + 32),
		character: e.character,
		...e.text === e.quote ? {} : { text: e.text }
	}));
	return {
		text: f,
		spans: h,
		warnings: a,
		map: (e) => {
			for (let t of l) if (e >= t.in && e <= t.in + t.len) return t.out + (e - t.in);
			for (let t of u) if (e >= t.inStart && e <= t.inEnd) return Math.min(t.outEnd, t.outStart + Math.max(0, e - t.inStart));
			let t = l.filter((t) => t.in + t.len <= e).at(-1);
			return t ? t.out + t.len : 0;
		}
	};
}
function Mc(e, t) {
	let n = !1;
	return {
		spans: t.map((t) => {
			if (e.slice(t.start, t.end) === t.quote && !t.orphan) return t;
			let r = lc(e, t);
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
var Nc = (e) => e.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
function Pc(e, t, n = wc) {
	let r = Mc(e, t).spans.filter((e) => !e.orphan).sort((e, t) => e.start - t.start), i = "", a = 0;
	for (let t of r) t.start < a || (i += `${e.slice(a, t.start)}<${n} ${Tc}="${Nc(t.character)}">${Ec(t)}</${n}>`, a = t.end);
	return i + e.slice(a);
}
function Fc(e, t, n, r) {
	return t.map((t) => {
		let i = n.map(t.start);
		for (let n of r) {
			let r = n(t.quote), a = r ? lc(e, {
				quote: r,
				prefix: n(t.prefix),
				suffix: n(t.suffix),
				start: i
			}) : -1;
			if (a < 0) continue;
			let o = a + r.length, { orphan: s, ...c } = t;
			return {
				...c,
				start: a,
				end: o,
				quote: r,
				prefix: e.slice(Math.max(0, a - 32), a),
				suffix: e.slice(o, o + 32)
			};
		}
		return {
			...t,
			orphan: !0
		};
	});
}
function Ic(e, t, n = {}) {
	let r = jc(e, n);
	if (!t?.length) return {
		text: r.text,
		spans: r.spans,
		anchors: t,
		warnings: r.warnings
	};
	let i = (e) => jc(e, n).text;
	return {
		text: r.text,
		spans: r.spans,
		anchors: Fc(r.text, t, r, [i, (e) => Oc(i(e), n.cleaner)]),
		warnings: r.warnings
	};
}
//#endregion
//#region packages/protocol/src/structures.ts
var Lc = [
	"date",
	"weekday",
	"time",
	"location",
	"weather"
], Rc = {
	date: ["date", "day"],
	weekday: [
		"weekday",
		"week",
		"dayOfWeek",
		"day_of_week"
	],
	time: ["time", "clock"],
	location: ["location", "place"],
	weather: ["weather"]
}, zc = ["name", "previous_main"], Bc = {
	name: [
		"name",
		"storyline",
		"title"
	],
	previous_main: [
		"previous_main",
		"previousMain",
		"old_main",
		"oldMain",
		"main"
	]
}, Vc = {
	reply: [],
	impersonate: [],
	recap: [],
	memory: [
		"scope",
		"operation",
		"key",
		"content"
	],
	synopsis: [
		"time",
		"location",
		"event",
		"summary"
	],
	options: ["label", "content"],
	status: Lc,
	storyline: zc,
	custom: [],
	annotations: [],
	image: vc,
	speech: []
};
function Hc(e, t = (e) => e) {
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
		case "status": return a({
			type: "object",
			properties: Object.fromEntries(Lc.map((e) => [e, i(e)])),
			required: [...Lc],
			additionalProperties: !1
		});
		case "storyline": {
			let t = (e.requested ?? zc).filter((e) => zc.includes(e));
			return a({
				type: "object",
				properties: Object.fromEntries(t.map((e) => [e, i(e)])),
				required: t,
				additionalProperties: !1
			});
		}
		case "annotations":
		case "speech": return a({ type: "string" });
		case "image": {
			let t = vc.filter((t) => !e.requested || e.requested.includes(t)), n = {
				prompt: { type: "string" },
				refs: {
					type: "array",
					items: { type: "string" }
				},
				ratio: {
					type: "string",
					enum: [..._c]
				},
				caption: { type: "string" }
			};
			return a({
				type: "array",
				items: {
					type: "object",
					properties: Object.fromEntries(t.map((e) => [e, i(e, n[e])])),
					required: t,
					additionalProperties: !1
				},
				maxItems: e.count && e.count > 0 ? e.count : 1
			});
		}
		case "custom": return e.shape === "kv" ? a({
			type: "object",
			additionalProperties: { type: "string" }
		}) : a({ type: "string" });
	}
}
function Uc(e) {
	return e === "memory" || e === "recap";
}
function Wc(e) {
	let t = {};
	for (let n of Lc) t[n] = qc(Rc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Gc(e) {
	let t = {};
	for (let n of zc) t[n] = qc(Bc[n].map(e).find((e) => e != null)).trim();
	return t;
}
function Kc(e) {
	return e ? [
		[
			e.date,
			e.weekday,
			e.time
		].map((e) => (e ?? "").trim()).filter(Boolean).join(" "),
		e.location?.trim(),
		e.weather?.trim()
	].filter(Boolean).join(" | ") : "";
}
var qc = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function Jc(e, t, n) {
	if (t !== void 0) switch (e) {
		case "annotations":
		case "speech": return;
		case "image": return Cc(t, n?.count ?? 1);
		case "reply":
		case "impersonate": return qc(t).trim() || void 0;
		case "recap": return t === null ? null : qc(t).trim() || null;
		case "memory": {
			let e = Array.isArray(t) ? t : t && typeof t == "object" ? [t] : [], n = [];
			for (let t of e) {
				if (!t || typeof t != "object") continue;
				let e = t, r = qc(e.key ?? e.title).trim();
				if (!r) continue;
				let i = e.operation === "delete" ? "delete" : "replace", a = e.scope === "global_memory" || e.scope === "global" ? "global_memory" : "memory";
				n.push({
					scope: a,
					operation: i,
					key: r,
					content: i === "delete" ? null : qc(e.content)
				});
			}
			return n;
		}
		case "synopsis": {
			if (!t || typeof t != "object") return;
			let e = t;
			return {
				time: qc(e.time),
				location: qc(e.location),
				event: qc(e.event),
				summary: qc(e.summary)
			};
		}
		case "status":
			if (typeof t == "string") try {
				t = JSON.parse(t);
			} catch {
				return;
			}
			return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Wc((e) => t[e]);
		case "storyline": {
			if (typeof t == "string") {
				let e = t.trim();
				if (e.startsWith("{")) try {
					t = JSON.parse(e);
				} catch {}
				if (typeof t == "string") return e ? {
					name: e,
					previous_main: ""
				} : void 0;
			}
			if (!t || typeof t != "object" || Array.isArray(t)) return;
			let e = Gc((e) => t[e]);
			return e.name || e.previous_main ? e : void 0;
		}
		case "options": return Array.isArray(t) ? t.map((e) => e && typeof e == "object" ? e : { content: e }).map((e) => ({
			label: qc(e.label ?? e.title).trim(),
			content: qc(e.content ?? e.text).trim()
		})).filter((e) => e.content || e.label) : void 0;
		case "custom":
			if (n?.shape === "kv") {
				if (typeof t == "string") try {
					t = JSON.parse(t);
				} catch {
					return;
				}
				return !t || typeof t != "object" || Array.isArray(t) ? void 0 : Object.fromEntries(Object.entries(t).map(([e, t]) => [e, qc(t)]));
			}
			return qc(t).trim() || void 0;
	}
}
function Yc(e, t) {
	let n = t[t.length - 1];
	if (n) switch (e.kind) {
		case "annotations":
		case "speech": return;
		case "image": return Cc(t.filter((e) => !e.open).map((e) => /<[A-Za-z_]/.test(e.inner) ? {
			prompt: Ys(e.inner, "prompt"),
			refs: Ys(e.inner, "refs"),
			ratio: Ys(e.inner, "ratio"),
			caption: Ys(e.inner, "caption")
		} : Gs(e.inner).trim()), e.count ?? 1);
		case "reply":
		case "impersonate": return Jc(e.kind, Gs(n.inner));
		case "recap": return Jc("recap", Gs(n.inner));
		case "memory": return Jc("memory", t.filter((e) => !e.open).map((e) => ({
			scope: Ys(e.inner, "scope"),
			operation: Ys(e.inner, "operation"),
			key: Ys(e.inner, "key"),
			content: Ys(e.inner, "content") ?? null
		})));
		case "synopsis": return {
			time: Ys(n.inner, "time") ?? "",
			location: Ys(n.inner, "location") ?? "",
			event: Ys(n.inner, "event") ?? "",
			summary: Ys(n.inner, "summary") ?? ""
		};
		case "status": return Wc((e) => Ys(n.inner, e));
		case "storyline": {
			let e = Gc((e) => Ys(n.inner, e));
			return !e.name && !e.previous_main && !/<[A-Za-z_]/.test(n.inner) && (e.name = Gs(n.inner).trim()), e.name || e.previous_main ? e : void 0;
		}
		case "options": return qs(n.inner, "option").map((e) => ({
			label: (e.attrs.title ?? e.attrs.label ?? "").trim(),
			content: Gs(e.inner).trim()
		})).filter((e) => e.content || e.label);
		case "custom":
			if (e.shape === "kv") {
				let e = {};
				for (let t of n.inner.matchAll(/<([A-Za-z_][\w-]*)(?:\s[^<>]*)?>([\s\S]*?)<\/\1>/g)) e[t[1]] = Gs(t[2]).trim();
				return e;
			}
			return Jc("custom", Gs(n.inner), e);
	}
}
function Xc(e, t) {
	let n = {}, r = [], i = [];
	for (let a of t) {
		if (As(a)) continue;
		let t = qs(e, a.tag);
		if (!t.length) continue;
		i.push(...t), t.some((e) => e.open) && r.push(a.id);
		let o = Yc(a, t);
		o !== void 0 && (n[a.id] = o);
	}
	return {
		text: Js(e, i),
		values: n,
		open: r
	};
}
function Zc(e) {
	return Gs(e.replace(/<\/(p|blockquote)>\s*/gi, "\n\n").replace(/<(p|blockquote)(\s[^>]*)?>/gi, "").replace(/<[^>]+>/g, "")).replace(/\n{3,}/g, "\n\n").trim();
}
var Qc = (e, t) => {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
};
function $c(e, t) {
	if (typeof t.order == "number") return t.order;
	let n = e.stages.findIndex((e) => e.id === t.id);
	return (n >= 0 ? n + 1 : e.stages.length + 1) * 100;
}
function el(e, t) {
	return e.structureOrder?.[t.id] ?? t.order ?? { after: e.structuresAfter ?? "@content" };
}
function tl(e, t) {
	if (e.structuresAfter) {
		let n = t.findIndex((t) => t.id === e.structuresAfter);
		if (n >= 0) return n;
	}
	for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return e;
	return t.length - 1;
}
function nl(e, t, n, r) {
	let i = String(Math.max(n, 1)).length;
	return Qc(e, { n: String(t).padStart(i, "0") }) + r;
}
function rl(e, t, n, r, i) {
	let a = n.filter((e) => !As(e)), o = t.map((t, n) => ({
		item: {
			type: "stage",
			stage: t,
			key: $c(e, t)
		},
		rank: 0,
		index: n
	})), s = tl(e, t), c = s >= 0 ? o[s].item.key : Infinity, l = (e) => {
		if (e === "@content") {
			for (let e = t.length - 1; e >= 0; e--) if (t[e].kind === "content") return o[e].item.key;
			return;
		}
		let n = t.findIndex((t) => t.id === e);
		return n >= 0 ? o[n].item.key : void 0;
	};
	a.forEach((t, n) => {
		let r = el(e, t), i, a = 1;
		if (typeof r == "number") i = r;
		else if ("before" in r) {
			let e = l(r.before);
			e === void 0 ? i = c : (i = e, a = -1);
		} else i = l(r.after) ?? c;
		o.push({
			item: {
				type: "structure",
				structure: t,
				key: i
			},
			rank: a,
			index: n
		});
	}), o.sort((e, t) => e.item.key - t.item.key || e.rank - t.rank || e.index - t.index);
	let u = r.orderPrefix || "", d = o.length, f = o.map(({ item: e }, t) => {
		let n = e.type === "stage" ? i(e.stage) : e.structure.field, r = u ? nl(u, t + 1, d, n) : n;
		return {
			...e,
			position: t + 1,
			name: r
		};
	}), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map();
	for (let e of f) e.type === "stage" ? p.set(e.stage, e) : m.set(e.structure.id, e);
	let h = /* @__PURE__ */ new Map();
	f.forEach((e, t) => {
		if (e.type !== "structure") return;
		let n;
		for (let e = t - 1; e >= 0 && !n; e--) {
			let t = f[e];
			t.type === "stage" && (n = t.stage);
		}
		for (let e = t + 1; e < f.length && !n; e++) {
			let t = f[e];
			t.type === "stage" && (n = t.stage);
		}
		n && h.set(e.structure.id, n);
	});
	let g = (e) => f.flatMap((t) => t.type === "structure" && h.get(t.structure.id) === e ? [t.structure] : []);
	return {
		items: f,
		prefixed: !!u,
		stageField: (e) => p.get(e)?.name ?? i(e),
		structureField: (e) => m.get(e.id)?.name ?? e.field,
		hostOf: (e) => h.get(e.id),
		carriedBy: g,
		stageParam: (e, t) => {
			let n = p.get(e);
			return u && n && g(e).length ? nl(u, n.position, d, t) : t;
		}
	};
}
function il(e, t) {
	let n = (e) => e.replaceAll("{{field}}", t);
	return [
		e.description,
		e.formatPrompt.field,
		...Object.values(e.properties ?? {})
	].some((e) => e?.includes("{{field}}")) ? {
		...e,
		...e.description === void 0 ? {} : { description: n(e.description) },
		...e.properties ? { properties: Object.fromEntries(Object.entries(e.properties).map(([e, t]) => [e, n(t)])) } : {},
		formatPrompt: {
			...e.formatPrompt,
			field: n(e.formatPrompt.field)
		}
	} : e;
}
//#endregion
//#region packages/protocol/src/workflow.ts
var al = {
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
}, ol = (e) => e;
function sl(e, t) {
	let n = e;
	for (let [e, r] of Object.entries(t)) n = n.replaceAll(`{{${e}}}`, String(r));
	return n;
}
function cl(e, t) {
	return e.stages.filter((e) => Bs(e.when, t));
}
function ll(e) {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
}
function ul(e, t) {
	return {
		n: e.indexOf(t) + 1,
		stage: t.id,
		actor: t.actor,
		label: t.label
	};
}
function dl(e, t, n = al) {
	return sl(t.field?.name ?? n.turn.field, ul(e, t));
}
function fl(e, t, n = al) {
	return sl(t.tool?.name ?? n.stage.name, ul(e, t));
}
function pl(e, t = al) {
	let n = e.kind === "patch" ? t.stage.patchParam : t.stage.param, r = e.tool?.param, i = r?.description ?? n.description;
	return {
		name: r?.name ?? n.name,
		...i ? { description: i } : {}
	};
}
var ml = (e, t) => t ? {
	...e,
	description: t
} : e;
function hl(e = al, t = ol, n) {
	let r = e.patch, i = (e) => e ? t(e) : void 0;
	return ml({
		type: "array",
		items: {
			type: "object",
			properties: {
				old_string: ml({ type: "string" }, i(r.old)),
				new_string: ml({ type: "string" }, i(r.new))
			},
			required: ["old_string", "new_string"],
			additionalProperties: !1
		}
	}, n ?? i(r.description));
}
function gl(e, t, n = al, r = ol) {
	return e.kind === "patch" ? hl(n, r, t) : ml({ type: "string" }, t);
}
function _l(e, t, n) {
	return {
		type: "function",
		function: {
			name: e,
			...t ? { description: t } : {},
			parameters: n
		}
	};
}
function vl(e, t, n, r, i = ol) {
	let a = r.filter((e) => !As(e)), o = (e, t) => {
		if (e) return i(t ? sl(e, ul(n, t)) : e).trim() || void 0;
	}, s = rl(t, n, a, e, (t) => dl(n, t, e)), c = (e) => s.stageField(e), l = (e) => s.structureField(e), u = (t) => fl(n, t, e), d = (t) => s.stageParam(t, pl(t, e).name), f = (e, t, n) => {
		let r = l(n);
		e[r] = Hc(il(n, r), i), Uc(n.kind) || t.push(r);
	}, p = () => {
		let t = {}, n = [];
		for (let r of s.items) {
			if (r.type === "structure") {
				f(t, n, r.structure);
				continue;
			}
			let a = r.stage;
			t[r.name] = gl(a, o(a.field?.description ?? e.turn.fieldDescription, a), e, i), a.optional || n.push(r.name);
		}
		return {
			type: "object",
			properties: t,
			required: n,
			additionalProperties: !1
		};
	}, m = () => n.map((t) => {
		let n = {}, r = [], a = pl(t, e), c = s.carriedBy(t), l = s.items.find((e) => e.type === "stage" && e.stage === t), p = () => {
			let s = d(t);
			n[s] = gl(t, o(a.description, t), e, i), r.push(s);
		}, m = !1;
		for (let e of c) {
			let t = s.items.findIndex((t) => t.type === "structure" && t.structure === e);
			!m && t > l.position - 1 && (p(), m = !0), f(n, r, e);
		}
		return m || p(), _l(u(t), o(t.tool?.description ?? e.stage.description, t), {
			type: "object",
			properties: n,
			required: r,
			additionalProperties: !1
		});
	}), h = {
		thinking: e.envelope.thinking.name,
		result: e.envelope.result.name
	};
	return {
		layout: s,
		fieldOf: c,
		structureFieldOf: l,
		toolOf: u,
		paramOf: d,
		stageOfTool: (e) => n.find((t) => u(t) === e),
		schema: () => {
			let t = o(e.turn.description);
			return {
				name: e.turn.name,
				...t ? { description: t } : {},
				value: p()
			};
		},
		turnSchema: p,
		submitTool: (t) => _l(e.submit.name, o(e.submit.description), t ?? p()),
		stageTools: m,
		envelope: (t) => ({
			type: "object",
			properties: {
				[h.thinking]: ml({ type: "string" }, o(e.envelope.thinking.description)),
				[h.result]: ml(t, o(e.envelope.result.description) ?? t.description)
			},
			required: [h.thinking, h.result],
			additionalProperties: !1
		}),
		envelopeKeys: h,
		toolNames: () => [e.submit.name, ...n.map(u)]
	};
}
function yl(e, t, n = (e) => e.label) {
	return [
		"Start",
		...e.map((e) => `${n(e)} (${t(e.actor)})${e.optional ? " [optional]" : ""}`),
		"(End)"
	].join(" -> ");
}
//#endregion
//#region packages/protocol/src/structure-ui.ts
function bl(e) {
	let t = e.ui;
	if (e.kind === "custom" && t) {
		if (t.module !== void 0) return {
			id: e.id,
			mode: "module",
			code: t.module,
			...t.style === void 0 ? {} : { style: t.style }
		};
		if (t.template !== void 0) return {
			id: e.id,
			mode: "template",
			code: t.template,
			...t.style === void 0 ? {} : { style: t.style }
		};
	}
}
function xl(e) {
	return Object.values(e.structures ?? {}).flatMap((e) => {
		let t = bl(e);
		return t ? [t] : [];
	});
}
function Sl(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function Cl(e) {
	let t = xl(e);
	return t.length ? Sl(JSON.stringify(t.map((e) => [
		e.id,
		e.mode,
		e.code,
		e.style ?? ""
	]))) : "";
}
//#endregion
//#region packages/protocol/src/turn.ts
function wl(e) {
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
function Tl(e, t, n = !0) {
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
	!n && t.content && (t.content = t.content.slice(0, t.content.length - Xs(t.content)).trimEnd());
}
function El(e, t, n) {
	for (let r of e) {
		let e = t.stages[r.id], i = e.text !== void 0 && e.text.trim() !== "" || e.patches !== void 0;
		e.status = n ? i ? "done" : "missing" : r.id === t.current ? "streaming" : i ? "done" : "pending";
	}
}
function Dl(e) {
	return e.map((e) => ({
		old_string: Ys(e, "old_string") ?? "",
		new_string: Ys(e, "new_string") ?? ""
	}));
}
function Ol(e, t) {
	let n = wl(t.stages), r = Zs(e), i = t.prefixes[t.user]?.trimEnd();
	if (i) {
		let e = RegExp(`(^|\\n)[ \\t]*${Ws(i)}`).exec(r);
		e && (r = r.slice(0, e.index));
	}
	let a = Xc(r, t.structures);
	n.structures = a.values, n.openStructures = a.open, r = a.text;
	let o = (e) => e.tag ?? (t.format === "tag" ? e.id : void 0), s = /* @__PURE__ */ new Set(), c = null;
	for (let e of t.stages) {
		let i = o(e);
		if (!i) continue;
		let a = qs(r, i);
		e.kind === "content" && t.format, s.add(e.id), a.length && (e.kind === "patch" ? n.stages[e.id].patches = Dl(a.filter((e) => !e.open).map((e) => e.inner)) : n.stages[e.id].text = Gs(a.map((e) => e.inner).join("\n\n")).trim(), a.some((e) => e.open) && (c = e.id), r = Js(r, a));
	}
	let l = t.stages.filter((e) => !s.has(e.id)), u = ll(t.stages), d = u >= 0 ? t.stages[u] : void 0;
	if (l.length) {
		let e = Object.entries(t.prefixes).filter(([e]) => e !== t.user).map(([e, t]) => ({
			id: e,
			re: Ws(t.trimEnd())
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
	return c && !t.final && (n.current = c), d && n.stages[d.id].text && (n.contentStarted = !0), Tl(t.stages, n, t.final), El(t.stages, n, t.final), n;
}
function kl(e, t) {
	let n = wl(t.stages), r = e ?? {}, i = t.fieldOf ?? ((e) => dl(t.stages, e)), a = (e, t) => {
		if (e in r) return r[e];
		if (t) {
			let e = Object.keys(r).find((e) => e === t.id || e.endsWith(`_${t.id}`));
			return e ? r[e] : void 0;
		}
	}, o = t.structureFieldOf ?? ((e) => e.field), s = new Set(t.stages.map(i)), c = (e) => {
		let t = o(e);
		if (t in r) return r[t];
		if (e.field in r) return r[e.field];
		let n = Object.keys(r).find((t) => !s.has(t) && t.endsWith(`_${e.field}`));
		return n ? r[n] : void 0;
	}, l = null;
	for (let e of t.stages) {
		let t = a(i(e), e);
		t !== void 0 && (l = e.id, e.kind === "patch" ? n.stages[e.id].patches = Al(t) : n.stages[e.id].text = typeof t == "string" ? t : JSON.stringify(t));
	}
	for (let e of t.structures) {
		if (As(e)) continue;
		let r = c(e), i = Jc(e.kind, r, e);
		i !== void 0 && (n.structures[e.id] = i), !t.final && t.openKey !== void 0 && (t.openKey === o(e) || t.openKey === e.field) && n.openStructures.push(e.id);
	}
	let u = ll(t.stages);
	return t.final || (n.current = t.stages.find((e) => i(e) === t.openKey || e.id === t.openKey)?.id ?? (t.openKey ? null : l)), u >= 0 && n.stages[t.stages[u].id].text !== void 0 && (n.contentStarted = !0), Tl(t.stages, n, t.final), El(t.stages, n, t.final), n;
}
function Al(e) {
	return (Array.isArray(e) ? e : e && typeof e == "object" && Array.isArray(e.edits) ? e.edits : []).filter((e) => !!e && typeof e == "object").map((e) => ({
		old_string: String(e.old_string ?? e.old ?? ""),
		new_string: String(e.new_string ?? e.new ?? "")
	}));
}
//#endregion
//#region packages/protocol/src/patch.ts
function jl(e, t) {
	let n = 0;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + t.length)) n++;
	return n;
}
function Ml(e, t) {
	let n = t.old_string ?? "";
	if (!n.trim()) return {
		text: e,
		result: {
			...t,
			status: "empty"
		}
	};
	let r = jl(e, n);
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
	let i = n.trim().split(/\s+/).map(Ws), a = new RegExp(i.join("\\s+"), "g"), o = [...e.matchAll(a)];
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
function Nl(e, t) {
	let n = [], r = e;
	for (let e of t) {
		let t = Ml(r, e);
		r = t.text, n.push(t.result);
	}
	return {
		text: r,
		results: n
	};
}
//#endregion
//#region packages/protocol/src/meta.ts
function Pl(e, t, n = !0) {
	let r = {
		present: !1,
		pure: !1,
		mixed: !1,
		segments: [],
		stripped: e
	};
	if (!t || !e) return r;
	let i = new RegExp(Ws(t), "gi"), a = [], o;
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
var Fl = class extends Error {
	line;
	constructor(e, t) {
		super(e), this.name = "TemplateError", this.line = t;
	}
}, Il = /(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)/, Ll = /* @__PURE__ */ new Set([
	"%>",
	"-%>",
	"_%>"
]);
function Rl(e) {
	return e == null ? "" : String(e).replace(/[&<>'"]/g, (e) => zl[e]);
}
var zl = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&#34;",
	"'": "&#39;"
};
function Bl(e) {
	return e.split(Il).filter((e) => e !== "");
}
var Vl = (e) => e.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
function Hl(e) {
	let t = Bl(Vl(e)), n = "", r = null, i = !1, a = 1, o = (e) => {
		i &&= (e = e.replace(/^(?:\r\n|\r|\n)/, ""), !1), e && (n += `    ; __append(${JSON.stringify(e)})\n`);
	}, s = (e) => e.replace(/;(\s*$)/, "$1");
	return t.forEach((e, c) => {
		if (e.startsWith("<%") && !e.startsWith("<%%")) {
			let n = t[c + 2];
			if (!n || !Ll.has(n)) throw new Fl(`Could not find matching close tag for "${e}".`, a);
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
var Ul = () => {
	throw Error("include() is not supported in Advanced Preset templates");
}, Wl = (e, t) => {
	throw new Fl(e instanceof Error ? `${e.name === "Error" ? "" : `${e.name}: `}${e.message}` : String(e), t);
}, Gl = /* @__PURE__ */ new Map(), Kl = 500;
function ql(e) {
	let t = Gl.get(e);
	if (t) return t;
	let n = Hl(e), r;
	try {
		r = Function("locals, escapeFn, include, rethrow", n);
	} catch (e) {
		throw new Fl(`${e instanceof Error ? e.message : String(e)} (while compiling the template)`);
	}
	let i = (e) => r(e, Rl, Ul, Wl);
	return Gl.size >= Kl && Gl.clear(), Gl.set(e, i), i;
}
function Jl(e, t) {
	return ql(e)(t);
}
function Yl(e) {
	try {
		return ql(e), null;
	} catch (e) {
		return e instanceof Fl ? e : new Fl(String(e));
	}
}
function Xl(e) {
	if (e && typeof e == "object" && !Object.isFrozen(e)) {
		Object.freeze(e);
		for (let t of Object.values(e)) Xl(t);
	}
	return e;
}
//#endregion
//#region packages/protocol/src/directives.ts
var Zl = /<!--\s*@([a-z][\w-]*)\b([\s\S]*?)-->/g, Ql = /^\s*(```|~~~)/;
function $l(e) {
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
var eu = /<!--[ \t]*#/g, tu = /<!--|-->/g;
function nu(e, t, n) {
	tu.lastIndex = t;
	for (let t = tu.exec(e); t; t = tu.exec(e)) if (n.depth += t[0] === "<!--" ? 1 : -1, n.depth === 0) return t.index + t[0].length;
	return -1;
}
function ru(e, t = [], n = 1, r) {
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
		let s = [...e.matchAll(Zl)];
		if (!s.length) return a({
			kind: "text",
			text: e + n
		});
		let c = e.replace(Zl, "").trim() === "", l = 0;
		for (let n of s) {
			n.index > l && a({
				kind: "text",
				text: e.slice(l, n.index)
			});
			let o = n[2].trim(), s = {
				name: n[1],
				...$l(o),
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
			let t = nu(e, 0, l);
			if (t < 0) return;
			d = l.blankBefore, l = void 0, f = !0, u = d ? iu(e, t) : t;
		} else if (Ql.test(e) && (c = !c), c || !e.includes("<!--")) return a({
			kind: "text",
			text: e + r
		});
		let p = "";
		eu.lastIndex = u;
		for (let t = eu.exec(e); t; t = eu.exec(e)) {
			if (t.index < u) continue;
			p += e.slice(u, t.index), f = !0;
			let n = {
				depth: 1,
				line: i,
				blankBefore: d && !p.trim()
			}, r = nu(e, t.index + t[0].length, n);
			if (r < 0) {
				l = n, u = e.length;
				break;
			}
			u = !p || /\s$/.test(p) ? iu(e, r) : r, eu.lastIndex = u;
		}
		if (!f) return o(e, r, i);
		p += e.slice(u), (l || !e.slice(u).trim()) && (p = p.replace(/[ \t]+$/, "")), l ? p.trim() && o(p, "", i) : p.trim() ? o(p, r, i, !d) : d || a({
			kind: "text",
			text: r
		});
	}), l && r?.(`unclosed comment <!--# (opened at line ${l.line})`, l.line), i;
}
function iu(e, t) {
	for (; t < e.length && (e[t] === " " || e[t] === "	");) t++;
	return t;
}
var au = [
	"system",
	"user",
	"assistant"
], ou = ["dialogue", "imperative"];
function su(e, t, n, r) {
	let i = [{ pieces: [] }], a = [], o = () => Vs(...a.map((e) => e.negated ? {
		t: "not",
		e: e.cond
	} : e.cond)), s, c = () => {
		let e = s;
		s = void 0;
		let n = Yl(e.text);
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
				au.includes(n) || t(`@as expects one of ${au.join(" | ")}`, e.line), a.length && t("@as cannot be used inside @if / @style", e.line), i.push({
					role: au.includes(n) ? n : void 0,
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
				if (!n || !ou.includes(n)) {
					t("@style expects dialogue | imperative", e.line);
					break;
				}
				a.length && a[a.length - 1].style && a.pop(), a.push({
					cond: Is(`style == "${n}"`),
					style: !0,
					line: e.line
				});
				break;
			}
			case "if":
				try {
					let t = Is(e.raw);
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
function cu(e, t) {
	let n = [], r = (e, t) => n.push({
		message: e,
		line: t
	}), [i] = ru(e, [], 1, r), a = su(i.tokens, r);
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
function lu(e, t, n = (e) => e, r) {
	if (!e) return [];
	let i = [];
	for (let a of e) {
		let e = n(a.pieces.filter((e) => Bs(e.when, t)).map((e) => e.template ? r?.(e) ?? "" : e.text).join("")).replace(/\n{3,}/g, "\n\n").trim();
		e && i.push(a.role ? {
			role: a.role,
			text: e
		} : { text: e });
	}
	return i;
}
var uu = (e) => (e ?? []).flatMap((e) => e.pieces.filter((e) => e.template).map((e) => e.text));
function du(e) {
	let t = e.entries.flatMap((e) => uu(e.content));
	for (let n of e.workflows ?? []) {
		let e = n.sections, r = (e) => Object.values(e ?? {}).flatMap((e) => uu(e));
		t.push(...uu(e?.preamble), ...r(e?.intro), ...Object.values(e?.stages ?? {}).flatMap(r), ...r(e?.outro));
	}
	let n = [...e.userModules ?? [], ...e.userModuleTemplates ?? []].flatMap((e) => [e, ...Object.values(e.locales ?? {})]);
	for (let e of n) for (let n of e.entries) t.push(...uu(cu(n.text, n.role).content));
	return t;
}
//#endregion
//#region packages/protocol/src/clone.ts
function J(e) {
	if (typeof e != "object" || !e) return e;
	if (Array.isArray(e)) return e.map((e) => J(e));
	let t = {};
	for (let [n, r] of Object.entries(e)) r !== void 0 && (t[n] = J(r));
	return t;
}
//#endregion
//#region packages/protocol/src/semver.ts
function fu(e) {
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
function pu(e, t) {
	let n = fu(e), r = fu(t);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] - r[e];
	return n[3] === r[3] ? 0 : n[3] ? r[3] ? n[3] < r[3] ? -1 : 1 : -1 : 1;
}
function mu(e, t) {
	return t.trim().split(/\s+/).every((t) => {
		let n = /^(<=|>=|<|>|=)?(.+)$/.exec(t);
		if (!n) return !1;
		let r = n[1] ?? "=", i = n[2];
		if (r === "=" && /x|\*/.test(i)) {
			let t = i.split("."), n = fu(e);
			return t.every((e, t) => e === "x" || e === "*" || Number(e) === n[t]);
		}
		let a = pu(e, i);
		return r === "<" ? a < 0 : r === "<=" ? a <= 0 : r === ">" ? a > 0 : r === ">=" ? a >= 0 : a === 0;
	});
}
//#endregion
//#region packages/protocol/src/config.ts
var hu = (e) => !!e && typeof e == "object" && !Array.isArray(e), gu = {
	transport: "structured",
	forceTool: !0,
	parallelTools: !1,
	sendThoughtSignature: !1,
	openAiSignatures: !1,
	streamToolArguments: "auto",
	maxSteps: 6,
	finalFallback: !0,
	assumeToolSupport: !1
};
function _u(e) {
	let t = e.sendThoughtSignature;
	return t === !0 ? "vertex" : typeof t == "string" && Os.includes(t) ? t : "off";
}
function vu(e, t) {
	let n = e.thoughtSignature;
	if (t !== "off" && n) return typeof n == "string" ? t === "vertex" ? n : void 0 : n[t] || void 0;
}
var yu = {
	enabled: !1,
	ttlMinutes: 5,
	maxDeferredTurns: 6
};
function bu(e, ...t) {
	let n = J(e);
	for (let e of t) n = xu(n, e);
	return n;
}
function xu(e, t) {
	if (t === void 0) return e;
	if (!hu(e) || !hu(t)) return J(t);
	let n = { ...e };
	for (let [r, i] of Object.entries(t)) n[r] = xu(e[r], i);
	return n;
}
function Su(e, t) {
	if (hu(e) && hu(t)) {
		let n = {};
		for (let [r, i] of Object.entries(e)) {
			let e = Su(i, t[r]);
			e !== void 0 && (n[r] = e);
		}
		return Object.keys(n).length ? n : void 0;
	}
	return JSON.stringify(e) === JSON.stringify(t) ? void 0 : J(e);
}
function Cu(e, t, n = "", r = [], i = wu) {
	for (let a of Object.keys(e)) {
		let o = n ? `${n}.${a}` : a;
		i.has(n) || (a in t ? hu(e[a]) && hu(t[a]) && (Cu(e[a], t[a], o, r, i), Object.keys(e[a]).length || delete e[a]) : (delete e[a], r.push(o)));
	}
	return r;
}
var wu = /* @__PURE__ */ new Set(["sampling"]);
function Tu(e, t, n) {
	let r = J(e);
	for (let e of t) if (mu(n, e.from)) for (let t of ["modules", "params"]) {
		let n = e.rename[t], i = r[t];
		if (n && hu(i)) for (let [e, t] of Object.entries(n)) e in i && (i[t] = i[e], delete i[e]);
	}
	return r;
}
function Eu(e, t) {
	return e.configurations.find((e) => e.id === t) ?? e.configurations.find((t) => t.id === e.defaultConfiguration);
}
function Du(e, t, n) {
	return bu(e.configurationDefaults, Eu(e, t)?.diff, n);
}
//#endregion
//#region packages/protocol/src/params.ts
function Ou(e) {
	let t = [];
	for (let n of e) {
		if (typeof n != "string" && typeof n != "number") continue;
		let e = String(n).trim();
		e && !t.includes(e) && t.push(e);
	}
	return t;
}
function ku(e, t) {
	return e.type === "list" ? Array.isArray(t) && t.every((e) => typeof e == "string") : e.type === "number" ? typeof t == "number" && Number.isFinite(t) : typeof t == "string" || typeof t == "number";
}
function Au(e, t) {
	let n = t === void 0 ? e.default : t;
	if (e.type === "list") return Array.isArray(n) ? Ou(n) : Array.isArray(e.default) ? Ou(e.default) : [];
	if (e.type === "number") {
		let t = typeof n == "number" ? n : typeof n == "string" && n.trim() !== "" ? Number(n) : NaN;
		return Number.isFinite(t) ? t : typeof e.default == "number" ? e.default : 0;
	}
	return typeof n == "string" || typeof n == "number" ? n : typeof e.default == "string" || typeof e.default == "number" ? e.default : "";
}
function ju(e) {
	return e === void 0 || e === "" || e === 0 || Array.isArray(e) && e.length === 0;
}
function Mu(e, t) {
	return Object.fromEntries(e.params.map((e) => [e.id, Au(e, t.params?.[e.id])]));
}
//#endregion
//#region packages/protocol/src/build-vars.ts
function Nu(e) {
	return e.type === "string" ? "" : e.type === "list" ? [] : /* @__PURE__ */ new Map();
}
function Pu(e, t, n) {
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
function Fu(e, t) {
	let n = new Map(e.map((e) => [e.id, e])), r = Object.fromEntries(e.map((e) => [e.id, Nu(e)]));
	for (let e of t) for (let t of e.vars ?? []) {
		let e = n.get(t.var);
		e && (r[t.var] = Pu(r[t.var], t, e));
	}
	return r;
}
var Iu = /^(?:true|false|yes|no|on|off|null|~|[-+]?(?:\d[\d_]*(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?|\.inf|\.nan)$/i;
function Lu(e) {
	return !e || e !== e.trim() || /^[?:,[\]{}#&*!|>'"%@`]/.test(e) || /^-(?:\s|$)/.test(e) || /:(?:\s|$)|\s#|\t/.test(e) ? !1 : !Iu.test(e);
}
function Ru(e, t) {
	if (e.includes("\n")) {
		let n = e.replace(/\s+$/, "");
		return /^\s/.test(n) ? JSON.stringify(e) : `|\n${n.split("\n").map((e) => e ? t + e : "").join("\n")}`;
	}
	return Lu(e) ? e : JSON.stringify(e);
}
var zu = (e) => !e.includes("\n") && Lu(e) ? e : JSON.stringify(e);
function Bu(e) {
	return e.map((e) => `- ${Ru(e, "  ")}`).join("\n");
}
function Vu(e) {
	return [...e].map(([e, t]) => `${zu(e)}: ${Ru(t, "  ")}`).join("\n");
}
function Hu(e, t) {
	if (e === void 0) return "";
	if (typeof e == "string") return t === void 0 ? e : "";
	if (Array.isArray(e)) {
		if (t === void 0) return Bu(e);
		if (!/^-?\d+$/.test(t)) return "";
		let n = Number(t);
		return e[n < 0 ? e.length + n : n] ?? "";
	}
	return t === void 0 ? Vu(e) : t === "keys" ? Bu([...e.keys()]) : t === "values" ? Bu([...e.values()]) : e.get(t) ?? "";
}
function Uu(e) {
	return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, t instanceof Map ? Object.fromEntries(t) : t]));
}
//#endregion
//#region packages/protocol/src/storylines.ts
var Wu = [
	"all",
	"if",
	"off"
], Gu = {
	enabled: !0,
	freezeVariables: "all"
}, Ku = (e) => Wu.includes(e?.freezeVariables) ? e.freezeVariables : Gu.freezeVariables, qu = (e, t) => e === "all" ? !t.main : e === "if" && t.if, Ju = {
	name: "",
	main: !0,
	if: !1,
	new: !1,
	grouped: !1,
	naming: !1,
	namingMain: !1,
	switching: !1,
	frozen: !1
}, Yu = /(?<![A-Za-z0-9_#&/=])#([!@]?)([^\s#]*)\s*$/u, Xu = (e) => /^[^\s#!?@][^\s#]*$/u.test(e) && !/^if\?$/iu.test(e) && [...e].length <= 64;
function Zu(e) {
	let t = Yu.exec(e);
	if (!t) return null;
	let n = t[2], r = /^if\?$/iu.test(n), i = n === "" ? "recent" : n === "?" || r ? "new" : "name";
	if (i === "name" && !Xu(n)) return null;
	let a = t[1] === "!";
	if (a && r) return null;
	let o = t.index;
	return {
		form: i,
		name: i === "name" ? n : "",
		switchMain: a,
		hide: t[1] === "@",
		ifLine: r,
		at: o,
		text: e.slice(0, o).trimEnd()
	};
}
function Qu(e) {
	return Zu(e)?.text ?? e;
}
function $u(e, t, n = !1) {
	let r = Qu(e);
	return t ? `${r}${r ? " " : ""}#${n ? "!" : ""}${t}` : r;
}
function ed(e, t, n) {
	return n ? `${e.slice(0, t.at)}#${t.switchMain ? "!" : t.hide ? "@" : ""}${n}` : t.text;
}
function td(e) {
	if (typeof e != "string") return "";
	let t = e.trim().replace(/^["'`“”‘’「」『』《》]+|["'`“”‘’「」『』《》]+$/gu, "").trim();
	t = t.replace(/^[#!?@\s]+/u, "").replace(/#/g, "").replace(/\s+/gu, "_").replace(/_+$/u, "");
	let n = [...t].slice(0, 64).join("");
	return Xu(n) ? n : "";
}
function nd(e, t) {
	if (!t.has(e)) return e;
	for (let n = 2;; n++) {
		let r = `-${n}`, i = [...e].slice(0, 64 - r.length).join("");
		if (!t.has(i + r)) return i + r;
	}
}
function rd(e) {
	return e ? [...e.naming ? ["name"] : [], ...e.namingMain ? ["previous_main"] : []] : [];
}
var id = (e) => /^if/i.test(e);
function ad(e, t, n = (e) => e) {
	let r = "\0ap-storyline\0";
	return n(e.replaceAll("{{storyline}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/assemble.ts
function od(e) {
	return (t) => {
		let n = e;
		for (let e of t.split(".")) {
			if (typeof n != "object" || !n) return;
			n = n[e];
		}
		return n;
	};
}
function sd(e, t) {
	return !!e.groups[t]?.allowNone;
}
function cd(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let n of e.modules) n.exclusive && n.toggle === "user" && t.modules[n.id] === !0 && !r.has(n.exclusive) && r.set(n.exclusive, n.id);
	for (let t of e.modules) {
		let n = t.exclusive;
		if (!n || r.has(n) || sd(e, n)) continue;
		let i = e.modules.filter((e) => e.exclusive === n && e.toggle === "user"), a = i.find((e) => e.default) ?? i[0];
		a && r.set(n, a.id);
	}
	let i = e.modules.filter((e) => e.toggle === "always" ? !0 : e.exclusive ? r.get(e.exclusive) === e.id : t.modules[e.id] === !0);
	return n ? i.filter((e) => Bs(e.when, n)) : i;
}
function ld(e, t) {
	let n = new Set(cd(e, t).map((e) => e.id));
	return Object.fromEntries(e.modules.map((e) => [e.id, n.has(e.id)]));
}
function ud(e, t, n) {
	let r = new Set(t.flatMap((e) => e.structures)), i = rd(n?.storyline);
	return Object.values(e.structures).filter((e) => r.has(e.id)).flatMap((e) => {
		switch (e.kind) {
			case "storyline": return i.length ? [{
				...e,
				requested: i
			}] : [];
			case "image": return n?.image?.on ? [{
				...e,
				requested: vc.filter((e) => e !== "refs" || n.image.refs)
			}] : [];
			case "speech": return n?.speech?.on ? [e] : [];
			default: return [e];
		}
	});
}
function dd(e, t, n) {
	return t.identity.names[n] || e.actors[n]?.name || n;
}
function fd(e, t, n, r) {
	return t && e.tools ? rl(t, n, r, e.tools, (t) => dl(n, t, e.tools)) : void 0;
}
function pd(e, t, n, r, i) {
	let { preset: a, config: o, vars: s, data: c = {} } = e, l = null, u = (e) => (l === null && (l = i ? fd(a, n, t, i) : void 0), l?.structureField(e) ?? e.field), d = (e, t = 0) => {
		let n = a.params.find((t) => t.id === e);
		if (!n) return "";
		let r = Au(n, o.params[e]);
		if (ju(r)) {
			if (n.fallback && t < 4) {
				let e = d(n.fallback, t + 1);
				if (e) return e;
			}
			return n.unset ?? "";
		}
		return Array.isArray(r) ? r.join(n.separator ?? ", ") : n.options?.find((e) => String(e.value) === String(r))?.text ?? String(r);
	}, f = 0, p = (e) => f > 4 ? e : Us(e, g), m = (e, t) => {
		let n = r[e];
		if (n === void 0) return "";
		f++;
		try {
			return Hu(typeof n == "string" ? p(n) : Array.isArray(n) ? n.map(p) : new Map([...n].map(([e, t]) => [e, p(t)])), t);
		} finally {
			f--;
		}
	}, h = s.style, g = (e) => {
		let [r, i, l] = e;
		switch (r) {
			case "name": return dd(a, o, i);
			case "prefix": return o.identity.prefixes[i] || a.actors[i]?.prefix || `${dd(a, o, i)}: `;
			case "param": return d(i);
			case "lang": return a.params.some((e) => e.id === "language") && d("language") || "the language used in the story so far";
			case "structure": {
				let e = a.structures[i];
				return e ? l === "last" ? c.customLast?.[i] ?? "" : h === "dialogue" ? e.formatPrompt.tag : e.formatPrompt.field.replaceAll("{{field}}", u(e)) : "";
			}
			case "workflow": return i === "hint" ? n?.hint ?? "" : yl(t, (e) => dd(a, o, e));
			case "input": return i === "text" ? s.input?.shaped ? c.inputText ?? "" : "" : c.metaText ?? "";
			case "memory": return JSON.stringify((i === "global" ? c.memory?.global : c.memory?.chat) ?? {}, null, 2);
			case "recap": return c.recap ?? "";
			case "recent_meta": return c.recentMeta ?? "";
			case "var": return m(i, l);
			case "storyline": return i === "main" ? c.storyline?.main ?? "" : c.storyline?.name ?? s.storyline?.name ?? "";
			case "image": return i === "refs" && s.image?.on ? gc(c.image?.refs) : "";
			case "speech": return s.speech?.on ? i === "format" ? c.speech?.format ?? "" : i === "characters" ? (c.speech?.characters ?? []).join(", ") : "" : "";
			default: return;
		}
	};
	return g;
}
function md(e, t, n, r, i) {
	return Xl({
		...J(e),
		vars: J(Uu(t)),
		sampling: J(n.sampling ?? {}),
		macro: (...e) => {
			let t = r(e.map((e) => String(e).trim()));
			return t === void 0 ? "" : i(t);
		}
	});
}
function hd(e, t, n) {
	return (r) => {
		try {
			return Jl(r.text, e());
		} catch (e) {
			let i = e instanceof Fl ? e.line : void 0, a = r.template?.line !== void 0 && i !== void 0 ? r.template.line + i - 1 : r.template?.line, o = [r.template?.file, a].filter((e) => e !== void 0).join(":");
			return t.push(`template in ${n}${o ? ` (${o})` : ""}: ${e instanceof Error ? e.message : String(e)}`), "";
		}
	};
}
function gd(e, t) {
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
function _d(e, t, n, r, i, a, o = []) {
	let s = t.sections, c = e.tools?.orderPrefix ? fd(e, t, n, o) : void 0, l = [...s.preamble ?? [], ...s.intro[r] ?? []];
	return n.forEach((t, o) => {
		let u = s.stages[t.id]?.[r];
		if (u?.length) {
			if (r === "imperative" && e.stageHeading) {
				let r = i === "tool-multi" ? fl(n, t, e.tools) : c?.stageField(t) ?? dl(n, t, e.tools), s = e.stageHeading.replaceAll("{{n}}", String(o + 1)).replaceAll("{{label}}", t.label).replaceAll("{{actor}}", dd(e, a, t.actor)).replaceAll("{{target}}", r).replaceAll("{{optional}}", t.optional ? " (optional)" : ""), [d, ...f] = u;
				l.push({
					...d,
					pieces: [{ text: `${s}\n\n` }, ...d.pieces]
				}, ...f);
			} else l.push(...u);
		}
	}), l.push(...s.outro[r] ?? []), l;
}
function vd(e, t) {
	let { preset: n, config: r } = e, i = { ...e.vars }, a = t ?? n.workflows.find((e) => e.id === i.workflow), o = od(i), s = a ? cl(a, o) : [];
	i.stages = Object.fromEntries(s.map((e) => [e.id, !0]));
	let c = od(i), l = cd(n, r, c), u = ud(n, l, i), d = Fu(n.vars, l), f = pd({
		...e,
		vars: i
	}, s, a, d, u), p = (e) => Us(e, f), m = new Set(l.map((e) => e.id)), h = [], g, _ = () => g ??= md(i, d, r, f, p), v = /* @__PURE__ */ new Map();
	for (let e of n.entries) {
		if (!m.has(e.module) || !Bs(e.when, c)) continue;
		let t = v.get(e.region) ?? [];
		t.push(...lu(e.content, c, p, hd(_, h, `entry ${e.id}`))), v.set(e.region, t);
	}
	if (a) {
		let e = v.get(n.workflowRegion) ?? [], t = _d(n, a, s, i.style, i.transport, r, u);
		for (let n of lu(t, c, p, hd(_, h, `workflow ${a.id}`))) {
			let t = e[e.length - 1];
			!n.role && t && !t.role && t.workflow ? t.text += `\n\n${n.text}` : e.push({
				...n,
				workflow: !0
			});
		}
		v.set(n.workflowRegion, e);
	}
	let y = {};
	for (let e of n.regions) e.native || (y[e.id] = gd(e, v.get(e.id) ?? []));
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
function yd(e, t, n = {}) {
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
		modules: ld(e, t),
		params: Mu(e, t),
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
		last: {},
		storyline: { ...Ju },
		image: { ...mc },
		speech: { ...hc },
		...n
	};
}
//#endregion
//#region packages/protocol/src/gemini.ts
var bd = /* @__PURE__ */ new Set([
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
]), xd = /* @__PURE__ */ new Set([
	"string",
	"number",
	"integer",
	"boolean",
	"array",
	"object"
]), Sd = {
	string: ["enum", "date-time"],
	number: ["float", "double"],
	integer: ["int32", "int64"]
}, Cd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function wd(e, t = {}) {
	let n = (e) => wd(e, t);
	if (!Cd(e)) return { type: "string" };
	let r = { ...e };
	if (Array.isArray(r.allOf) && r.allOf.length === 1 && Cd(r.allOf[0])) {
		let { allOf: e, ...t } = r;
		return n({
			...r.allOf[0],
			...t
		});
	}
	Array.isArray(r.oneOf) && !r.anyOf && (r.anyOf = r.oneOf), r.const !== void 0 && r.enum === void 0 && (r.enum = [r.const]);
	let i = {}, a = r.nullable === !0, o = (Array.isArray(r.type) ? r.type : r.type === void 0 ? [] : [r.type]).map(String);
	if (o.includes("null") && (a = !0, o = o.filter((e) => e !== "null")), o = o.filter((e) => xd.has(e)), Array.isArray(r.anyOf)) {
		let e = r.anyOf.filter(Cd), t = e.filter((e) => e.type !== "null");
		if (t.length < e.length && (a = !0), t.length === 1 && !o.length) return Td({
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
		return Td({
			anyOf: o.map((t) => n({
				...e,
				type: t
			})),
			...typeof r.description == "string" ? { description: r.description } : {}
		}, a);
	}
	let s = o[0];
	s && (i.type = s);
	for (let [e, t] of Object.entries(r)) if (t !== void 0 && bd.has(e) && e !== "type" && e !== "anyOf" && e !== "nullable") switch (e) {
		case "properties":
			Cd(t) && (i.properties = Object.fromEntries(Object.entries(t).map(([e, t]) => [e, n(t)])));
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
			s && Sd[s]?.includes(String(t)) && (i.format = t);
			break;
		case "required":
			Array.isArray(t) && (i.required = t.map(String));
			break;
		default: i[e] = t;
	}
	if (i.type === "object" || !i.type && i.properties) {
		let e = Cd(i.properties) ? i.properties : {}, n = Object.keys(e);
		if (!n.length) {
			let e = [i.description, t.jsonStringHint].filter((e) => typeof e == "string" && e).join(" ");
			return Td({
				type: "string",
				...e ? { description: e } : {}
			}, a);
		}
		i.type = "object", Array.isArray(i.required) && (i.required = i.required.filter((e) => n.includes(e))), i.propertyOrdering = n;
	}
	return i.type === "array" && !i.items && (i.items = { type: "string" }), Td(i, a);
}
function Td(e, t) {
	return t && (e.nullable = !0), e;
}
function Ed(e, t = {}) {
	return e.map((e) => {
		let n = e?.function?.parameters;
		if (!Cd(n)) return e;
		let r = Cd(n.properties) ? n.properties : {};
		return Object.keys(r).length ? {
			...e,
			function: {
				...e.function,
				parameters: wd(n, t)
			}
		} : e;
	});
}
//#endregion
//#region packages/protocol/src/tavern-helper.ts
var Dd = "tavern_helper";
function Od(e) {
	return e.flatMap((e) => e.type === "folder" ? [e.id, ...e.scripts.map((e) => e.id)] : [e.id]);
}
//#endregion
//#region packages/protocol/src/preset-file.ts
var kd = "1.10.0", Ad = "advanced_preset_file", jd = [
	"https://github.com/mirrorange/advanced-preset",
	"https://gitlab.com/mirrorange/advanced-preset",
	"https://codeberg.org/mirrorange/advanced-preset"
], Md = (e) => typeof e == "string" && /^https?:\/\/[^\s/?#]+[^\s]*$/i.test(e.trim()), Nd = "ap_install_notice", Pd = "⟦ap:install-notice⟧", Fd = "6f1d6c2e-5a4b-4c3e-9a7d-a9e5c0f1b2d3", Id = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Ld(e) {
	let t = Id(e) && Id(e.extensions) ? e.extensions[Ad] : void 0;
	return Id(t) && Id(t.artifact) ? {
		format: t.format,
		artifact: t.artifact
	} : void 0;
}
function Rd(e) {
	return Ld(e)?.artifact ?? e;
}
function zd(e) {
	let t = e.minAdvancedPreset;
	return t && pu(t, "1.10.0") > 0 ? t : kd;
}
var Bd = (e) => typeof e == "string" && e.includes("⟦ap:region:");
function Vd(e) {
	return `${Pd}
[Notice from the preset file — not part of the story]
The selected Chat Completion preset, "${e.name}" ${e.version}, is an Advanced Preset preset. It only works with the Advanced Preset extension for SillyTavern, which is not installed or not enabled here, so none of the preset's prompts were loaded.

Do not continue the story or the roleplay in this reply. Instead, tell the user in their own language, briefly and kindly, that this preset needs the Advanced Preset extension, and guide them to install it:
1. Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".
2. Paste one of these addresses and install (if one fails, try the next):
${jd.map((e) => `   - ${e}`).join("\n")}
3. Reload the page. Advanced Preset then sets up this preset by itself.
If the Tavern Helper extension is installed, the preset's installer script can do this automatically: enable the preset's scripts when Tavern Helper asks (or in Tavern Helper → Scripts → Preset scripts).
If Advanced Preset is installed but disabled, enable it in Extensions → Manage extensions and reload.`;
}
function Hd(e) {
	return {
		type: "script",
		enabled: !0,
		name: "Advanced Preset Installer",
		id: Fd,
		content: Wd(e.name, zd(e)),
		info: `This preset ("${e.name}") needs the Advanced Preset extension. The script offers to install it (or to update or enable it) from:\n${jd.join("\n")}\nIt does nothing once Advanced Preset ${zd(e)} or newer is running; Advanced Preset then replaces this preset with its own copy, without this script.\n\n此预设需要 Advanced Preset 插件。脚本会询问是否从以上地址安装（或更新、启用）它；Advanced Preset ${zd(e)} 及以上版本运行后脚本不做任何事，插件会用自己的副本替换此预设（不含此脚本）。`,
		button: {
			enabled: !1,
			buttons: []
		},
		data: {},
		export_with: {
			data: !0,
			button: !0
		}
	};
}
function Ud(e, t = {}) {
	let n = e.carrier.prompts.map((e) => ({ ...e })), r = new Set(n.filter((e) => Bd(e.content)).map((e) => e.identifier));
	n.push({
		identifier: Nd,
		name: "Advanced Preset · install notice",
		role: "system",
		content: Vd(e),
		system_prompt: !1,
		marker: !1,
		injection_position: 0,
		injection_depth: 4,
		forbid_overrides: !0
	});
	let i = [...e.carrier.prompt_order.map((e) => ({
		...e,
		enabled: e.enabled && !r.has(e.identifier)
	})), {
		identifier: Nd,
		enabled: !0
	}], a = {
		format: 1,
		artifact: e
	};
	return {
		...t.sampling ?? {},
		prompts: n,
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: i.map((e) => ({ ...e }))
		})),
		extensions: {
			...t.installer === !1 ? {} : { [Dd]: {
				scripts: [Hd(e)],
				variables: {}
			} },
			[Ad]: a
		}
	};
}
function Wd(e, t) {
	let n = (e) => JSON.stringify(e).replace(/</g, "\\u003c");
	return `// Advanced Preset installer, written into the preset file by Advanced Preset.
// It installs, updates or enables the Advanced Preset extension; it does nothing once
// Advanced Preset ${t} or newer is running.
const PRESET = ${n(e)};
const REQUIRED = ${n(t)};
const MIRRORS = ${n(jd)};
const FOLDER = 'advanced-preset';
const EXTENSION = 'third-party/' + FOLDER;
const LATER_KEY = 'advancedPreset.installer.later';
const host = window.parent && window.parent.SillyTavern ? window.parent : window;
const ctx = () => host.SillyTavern.getContext();

const locale = String((ctx().getCurrentLocale && ctx().getCurrentLocale()) || host.localStorage.getItem('language') || host.navigator.language || '').toLowerCase();
const zh = locale.startsWith('zh');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const list = '<ul style="text-align:start;word-break:break-all">' + MIRRORS.map((u) => '<li><code>' + esc(u) + '</code></li>').join('') + '</ul>';
const T = zh ? {
  title: 'Advanced Preset',
  install: '<h3>需要 Advanced Preset 插件</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset 插件才能使用，当前尚未安装。</p><p>是否现在安装？将依次尝试以下地址：</p>' + list,
  update: (v) => '<h3>需要更新 Advanced Preset</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset ' + esc(REQUIRED) + ' 或更新版本' + (v ? '（当前为 ' + esc(v) + '）' : '') + '。</p><p>是否现在更新？</p>',
  enable: '<h3>Advanced Preset 已停用</h3><p>预设「' + esc(PRESET) + '」需要 Advanced Preset 插件，它已安装但处于停用状态。</p><p>是否启用并重新加载页面？</p>',
  installOk: '安装', updateOk: '更新', enableOk: '启用并重新加载', later: '稍后',
  trying: (u) => '正在从 ' + u + ' 安装 Advanced Preset……',
  updating: '正在更新 Advanced Preset……',
  done: '<h3>Advanced Preset 已就绪</h3><p>重新加载页面后插件即会生效，并自动接管预设「' + esc(PRESET) + '」。</p><p>是否现在重新加载？</p>',
  reloadOk: '重新加载',
  stillOld: (v) => '已是可获取的最新版本（' + esc(v) + '），但预设需要 ' + esc(REQUIRED) + ' 或更新版本。请稍后再试，或手动更新 Advanced Preset。',
  failed: '<h3>无法安装 Advanced Preset</h3><p>所有地址都安装失败。请检查网络连接后重新加载页面重试，或尝试手动安装 Advanced Preset 插件：</p><ol style="text-align:start"><li>打开「扩展」面板（顶栏的积木图标），点击「安装扩展」；</li><li>粘贴以下任一地址并安装：' + list + '</li><li>重新加载页面。</li></ol>',
} : {
  title: 'Advanced Preset',
  install: '<h3>Advanced Preset is required</h3><p>The preset "' + esc(PRESET) + '" needs the Advanced Preset extension, which is not installed.</p><p>Install it now? These addresses are tried in turn:</p>' + list,
  update: (v) => '<h3>Advanced Preset needs an update</h3><p>The preset "' + esc(PRESET) + '" needs Advanced Preset ' + esc(REQUIRED) + ' or newer' + (v ? ' (installed: ' + esc(v) + ')' : '') + '.</p><p>Update it now?</p>',
  enable: '<h3>Advanced Preset is disabled</h3><p>The preset "' + esc(PRESET) + '" needs the Advanced Preset extension, which is installed but disabled.</p><p>Enable it and reload the page?</p>',
  installOk: 'Install', updateOk: 'Update', enableOk: 'Enable and reload', later: 'Later',
  trying: (u) => 'Installing Advanced Preset from ' + u + '…',
  updating: 'Updating Advanced Preset…',
  done: '<h3>Advanced Preset is ready</h3><p>It starts once the page is reloaded and then sets up the preset "' + esc(PRESET) + '" by itself.</p><p>Reload now?</p>',
  reloadOk: 'Reload',
  stillOld: (v) => 'This is the newest version available (' + esc(v) + '), but the preset needs ' + esc(REQUIRED) + ' or newer. Try again later, or update Advanced Preset by hand.',
  failed: '<h3>Could not install Advanced Preset</h3><p>Installing failed from every address. Check your network connection and reload the page to try again, or install the Advanced Preset extension by hand:</p><ol style="text-align:start"><li>Open the Extensions panel (the stacked-blocks icon in the top bar) and click "Install extension".</li><li>Paste one of these addresses and install:' + list + '</li><li>Reload the page.</li></ol>',
};

const toast = (kind, message) => (host.toastr || window.toastr)[kind](message, T.title);
const parse = (v) => String(v).split('-')[0].split('.').map((n) => parseInt(n, 10) || 0);
const atLeast = (v, min) => {
  const a = parse(v), b = parse(min);
  for (let i = 0; i < 3; i++) if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0);
  return true;
};
const sleep = (ms) => new Promise((r) => host.setTimeout(r, ms));
async function confirm(html, ok) {
  const c = ctx();
  return (await c.callGenericPopup(html, c.POPUP_TYPE.CONFIRM, '', { okButton: ok, cancelButton: T.later })) === c.POPUP_RESULT.AFFIRMATIVE;
}
const showFailure = () => ctx().callGenericPopup(T.failed, ctx().POPUP_TYPE.TEXT);
const post = (url, body) => host.fetch(url, { method: 'POST', headers: ctx().getRequestHeaders(), body: JSON.stringify(body) });
async function offerReload() {
  if (await confirm(T.done, T.reloadOk)) host.location.reload();
}

async function installFromMirrors() {
  for (const url of MIRRORS) {
    toast('info', T.trying(url));
    try {
      const r = await post('/api/extensions/install', { url, global: false });
      // 409: the folder exists (installed meanwhile, e.g. by another tab).
      if (r.ok || r.status === 409) return true;
      console.warn('[Advanced Preset installer]', url, r.status, await r.text().catch(() => ''));
    } catch (e) {
      console.warn('[Advanced Preset installer]', url, e);
    }
  }
  return false;
}

async function updateFolder() {
  toast('info', T.updating);
  for (const global of [false, true]) {
    try {
      const r = await post('/api/extensions/update', { extensionName: FOLDER, global });
      if (r.ok) return true;
    } catch (e) {
      console.warn('[Advanced Preset installer]', e);
    }
  }
  return false;
}

async function installedFolder() {
  try {
    const r = await host.fetch('/api/extensions/discover', { headers: ctx().getRequestHeaders() });
    const all = r.ok ? await r.json() : [];
    return Array.isArray(all) && all.some((e) => e && e.name === EXTENSION);
  } catch {
    return false;
  }
}

async function main() {
  // AP loads with the other extensions, before Tavern Helper runs scripts; wait a little anyway.
  for (let i = 0; i < 20 && !host.AdvancedPreset; i++) await sleep(250);
  const ap = host.AdvancedPreset;
  if (ap && atLeast(ap.version, REQUIRED)) return;
  if (host.sessionStorage.getItem(LATER_KEY) || host.__advancedPresetInstaller) return;
  host.__advancedPresetInstaller = true;
  const later = () => host.sessionStorage.setItem(LATER_KEY, '1');

  if (ap) {
    if (!(await confirm(T.update(ap.version), T.updateOk))) return later();
    toast('info', T.updating);
    try {
      // Reloads the page by itself when the extension changed.
      if ((await ap.update()) === 'current') toast('warning', T.stillOld(ap.version));
    } catch (e) {
      console.warn('[Advanced Preset installer]', e);
      await showFailure();
    }
    return;
  }

  if (await installedFolder()) {
    const disabled = ctx().extensionSettings && ctx().extensionSettings.disabledExtensions;
    if (Array.isArray(disabled) && disabled.includes(EXTENSION)) {
      if (!(await confirm(T.enable, T.enableOk))) return later();
      disabled.splice(disabled.indexOf(EXTENSION), 1);
      ctx().saveSettingsDebounced();
      await sleep(2000);
      host.location.reload();
      return;
    }
    // Installed but not running (too old for this SillyTavern, or broken): update it.
    if (!(await confirm(T.update(''), T.updateOk))) return later();
    if (await updateFolder()) return offerReload();
    await showFailure();
    return;
  }

  if (!(await confirm(T.install, T.installOk))) return later();
  if (await installFromMirrors()) return offerReload();
  await showFailure();
}

main().catch((e) => console.error('[Advanced Preset installer]', e));
`;
}
//#endregion
//#region packages/protocol/src/artifact.ts
var Gd = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Kd(e) {
	let t = e.configurationDefaults?.connection;
	return !Gd(t) || Object.keys(gu).every((e) => e in t) ? e : {
		...e,
		configurationDefaults: {
			...e.configurationDefaults,
			connection: {
				...gu,
				...t
			}
		}
	};
}
function qd(e) {
	let t = e.tokenSaving, n = e.configurationDefaults?.tokenSaving;
	if ((!Gd(t) || "userInput" in t) && (!Gd(n) || "userInput" in n)) return e;
	let r = Gd(t) && t.userInput || "truncate";
	return {
		...e,
		tokenSaving: Gd(t) ? {
			...t,
			userInput: r
		} : t,
		configurationDefaults: Gd(n) ? {
			...e.configurationDefaults,
			tokenSaving: {
				...n,
				userInput: "userInput" in n ? n.userInput : r
			}
		} : e.configurationDefaults
	};
}
function Jd(e) {
	let t = e.configurationDefaults;
	if (!Gd(t)) return e;
	let n = t.cache;
	return Gd(n) && Object.keys(yu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			cache: {
				...yu,
				...Gd(n) ? n : {}
			}
		}
	};
}
function Yd(e) {
	let t = e.configurationDefaults;
	if (!Gd(t)) return e;
	let n = t.meta;
	return Gd(n) && "enabled" in n ? e : {
		...e,
		configurationDefaults: {
			...t,
			meta: {
				enabled: !0,
				...Gd(n) ? n : {}
			}
		}
	};
}
function Xd(e) {
	let t = e.configurationDefaults;
	if (!Gd(e.storylines) || !Gd(t)) return e;
	let n = t.storylines;
	return Gd(n) && Object.keys(Gu).every((e) => e in n) ? e : {
		...e,
		configurationDefaults: {
			...t,
			storylines: {
				...Gu,
				...Gd(n) ? n : {}
			}
		}
	};
}
function Zd(e) {
	let t = Xd(Yd(Jd(qd(Kd(e))))), n = Array.isArray(t.insertionPoints) ? t : {
		...t,
		insertionPoints: []
	};
	return {
		...n,
		userModules: Array.isArray(n.userModules) ? n.userModules : [],
		userModuleTemplates: Array.isArray(n.userModuleTemplates) ? n.userModuleTemplates : []
	};
}
function Qd(e) {
	let t = Rd(e);
	return !Gd(t) || typeof t.id != "string" || !Array.isArray(t.entries) ? null : t.formatVersion === 3 ? Zd(t) : null;
}
//#endregion
//#region packages/protocol/src/user-modules.ts
var $d = (e) => typeof e == "string" || e.enabled !== !1, ef = (e) => typeof e == "string" ? e : e.text;
function tf(e, t) {
	t ? delete e.enabled : e.enabled = !1;
}
function nf(e, t) {
	return t ? e : {
		text: e,
		enabled: !1
	};
}
var rf = "user-", af = "advanced-preset.user-modules", of = (e) => `${rf}${e}`;
function sf() {
	return {
		match: "all",
		rules: []
	};
}
var cf = ["on", "off"];
function lf(e) {
	switch (e.kind) {
		case "keyword": return e.words.some((e) => e.trim());
		case "expr": return !!e.source.trim();
		case "var": return e.path ? cf.includes(e.op) ? !0 : e.op === "in" || e.op === "notIn" ? Array.isArray(e.value) && e.value.length > 0 : e.value !== void 0 && e.value !== "" : !1;
	}
}
function uf(e) {
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
function df(e, t) {
	let n = uf(e);
	if (!n) return e.op === "none";
	let r = (e.target === "input" ? [t.input] : t.recent.slice(0, Math.max(1, e.depth ?? 3))).some((e) => e && n(e));
	return e.op === "any" ? r : !r;
}
var ff = (e) => ({
	t: "lit",
	v: e
});
function pf(e) {
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
					items: (Array.isArray(e.value) ? e.value : [e.value ?? null]).map(ff)
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
			r: ff(Array.isArray(e.value) ? e.value[0] ?? null : e.value ?? null)
		};
	}
}
function mf(e, t = {
	input: "",
	recent: []
}) {
	let n = e.rules.filter(lf).map((e) => {
		if (e.kind === "keyword") return ff(df(e, t));
		if (e.kind === "var") return pf(e);
		try {
			return Is(e.source);
		} catch {
			return ff(!1);
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
function hf(e) {
	if (e.kind === "expr") {
		if (!e.source.trim()) return null;
		try {
			return Is(e.source), null;
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
function gf(e, t) {
	return (e.insertionPoints ?? []).find((e) => e.id === t);
}
function _f(e, t) {
	return t.entries.filter((t) => !gf(e, t.point));
}
function vf(e, t) {
	return (e.vars ?? []).find((e) => e.id === t);
}
function yf(e, t) {
	return (t.vars ?? []).filter((t) => vf(e, t.var)?.type !== t.type);
}
function bf(e, t) {
	return [.../* @__PURE__ */ new Set([..._f(e, t).map((e) => e.point), ...yf(e, t).map((e) => e.var)])];
}
function xf(e) {
	if (!$d(e)) return null;
	switch (e.type) {
		case "string": return e.text.trim() ? {
			var: e.var,
			type: "string",
			text: e.text
		} : null;
		case "list": {
			let t = e.items.filter($d).map(ef).filter((e) => e.trim());
			return t.length ? {
				var: e.var,
				type: "list",
				items: t
			} : null;
		}
		case "dict": {
			let t = e.items.filter((e) => $d(e) && e.key.trim()).map((e) => ({
				key: e.key.trim(),
				value: e.value?.trim() ? e.value : null
			}));
			return t.length ? {
				var: e.var,
				type: "dict",
				items: t
			} : null;
		}
	}
}
function Sf(e, t) {
	let n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		i.region === t.region && (i.order <= t.order ? n = r + 1 : n < 0 && (n = r));
	}
	n < 0 ? e.push(t) : e.splice(n, 0, t);
}
function Cf(e, t, n) {
	let r = t.filter((e) => e.enabled).map((e) => ({
		...e,
		entries: e.entries.filter($d),
		vars: (e.vars ?? []).filter($d)
	})).filter((e) => e.entries.length || e.vars.length);
	if (!r.length) return {
		preset: e,
		skipped: []
	};
	let i = [], a = [], o = [...e.entries], s = new Map(e.regions.map((e) => [e.id, e]));
	for (let t of r) {
		let r = of(t.id);
		a.push({
			id: r,
			name: t.name,
			toggle: "always",
			default: !0,
			when: mf(t.trigger, n),
			structures: [],
			vars: t.vars.filter((t) => vf(e, t.var)?.type === t.type).map(xf).filter((e) => !!e)
		});
		for (let n of t.entries) {
			let a = gf(e, n.point), c = a && s.get(a.region);
			!a || !c || c.native ? i.push({
				module: t.id,
				entry: n.id,
				point: n.point
			}) : n.text.trim() && Sf(o, {
				id: `${r}/${n.id}`,
				module: r,
				region: a.region,
				order: a.order,
				content: cu(n.text, n.role).content
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
function wf(e) {
	return e.flatMap((e) => e.entries.flatMap((e) => uu(cu(e.text, e.role).content)));
}
function Tf(e, t) {
	let [n, r, ...i] = e.split("."), a = n === "modules" ? t.modules : n === "params" ? t.params : void 0, o = r === void 0 ? void 0 : a?.[r];
	return o ? [
		n,
		o,
		...i
	].join(".") : e;
}
function Ef(e, t) {
	return e.replace(/(?<![\w.-])(modules|params)\.([A-Za-z_][\w-]*)/g, (e, n, r) => {
		let i = (n === "modules" ? t.modules : t.params)?.[r];
		return i ? `${n}.${i}` : e;
	});
}
function Df(e, t, n) {
	let r = t.filter((e) => mu(n, e.from));
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
				path: Tf(t.path, e)
			} : t.kind === "expr" ? {
				...t,
				source: Ef(t.source, e)
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
var Of = (e) => !!e && typeof e == "object" && !Array.isArray(e), kf = (e, t = "") => typeof e == "string" ? e : t, Af = (e) => e === null || [
	"string",
	"number",
	"boolean"
].includes(typeof e), jf = [
	"system",
	"user",
	"assistant"
], Mf = [
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
function Nf(e) {
	if (!Of(e)) return null;
	if (e.kind === "expr") return {
		kind: "expr",
		source: kf(e.source)
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
	if (e.kind === "var" && typeof e.path == "string" && Mf.includes(e.op)) {
		let t = {
			kind: "var",
			path: e.path,
			op: e.op
		};
		return Array.isArray(e.value) ? t.value = e.value.filter(Af) : Af(e.value) && (t.value = e.value), t;
	}
	return null;
}
var Pf = (e) => e.enabled === !1 ? { enabled: !1 } : {};
function Ff(e) {
	return typeof e == "string" ? [e] : Of(e) && typeof e.text == "string" ? [e.enabled === !1 ? {
		text: e.text,
		enabled: !1
	} : e.text] : [];
}
function If(e) {
	if (!Of(e) || typeof e.var != "string") return [];
	if (e.type === "string") return [{
		var: e.var,
		type: "string",
		text: kf(e.text),
		...Pf(e)
	}];
	if (e.type === "list") return [{
		var: e.var,
		type: "list",
		items: Array.isArray(e.items) ? e.items.flatMap(Ff) : [],
		...Pf(e)
	}];
	if (e.type === "dict" && Array.isArray(e.items)) {
		let t = e.items.filter(Of).map((e) => ({
			key: kf(e.key),
			value: typeof e.value == "string" ? e.value : null,
			...Pf(e)
		}));
		return [{
			var: e.var,
			type: "dict",
			items: t,
			...Pf(e)
		}];
	}
	return [];
}
function Lf(e) {
	if (!Of(e) || !Array.isArray(e.entries)) return null;
	let t = Of(e.trigger) ? e.trigger : {}, n = e.entries.flatMap((e, t) => {
		if (!Of(e)) return [];
		let n = {
			id: kf(e.id) || `e${t + 1}`,
			point: kf(e.point),
			text: kf(e.text)
		};
		return jf.includes(e.role) && (n.role = e.role), e.enabled === !1 && (n.enabled = !1), [n];
	});
	return {
		id: kf(e.id),
		name: kf(e.name),
		enabled: e.enabled !== !1,
		entries: n,
		vars: Array.isArray(e.vars) ? e.vars.flatMap(If) : [],
		trigger: {
			match: t.match === "any" ? "any" : "all",
			rules: Array.isArray(t.rules) ? t.rules.map(Nf).filter((e) => !!e) : []
		}
	};
}
function Rf(e, t) {
	return {
		format: af,
		version: 1,
		...t ? { preset: {
			id: t.id,
			version: t.version
		} } : {},
		modules: e
	};
}
function zf(e) {
	if (Of(e) && e.format === "advanced-preset.user-modules") {
		if (e.version !== 1) throw Error(`unsupported user module file version ${String(e.version)}`);
		let t = (Array.isArray(e.modules) ? e.modules : []).map(Lf).filter((e) => !!e);
		return {
			preset: Of(e.preset) && typeof e.preset.id == "string" ? {
				id: e.preset.id,
				version: kf(e.preset.version)
			} : void 0,
			modules: t
		};
	}
	let t = Lf(e);
	if (t) return { modules: [t] };
	throw Error("not a user module file");
}
//#endregion
//#region packages/protocol/src/preset-user-modules.ts
function Bf(e) {
	return Array.isArray(e.userModules) ? e.userModules : [];
}
function Vf(e) {
	return Array.isArray(e.userModuleTemplates) ? e.userModuleTemplates : [];
}
function Hf(e, t, n) {
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
function Uf(e, t, n = {}) {
	return {
		id: t,
		name: n.name ?? e.name,
		enabled: n.enabled ?? !0,
		entries: e.entries.map((e, t) => ({
			id: `e${t + 1}`,
			...J(e)
		})),
		vars: J(e.vars ?? []),
		trigger: e.trigger ? J(e.trigger) : sf()
	};
}
function Wf(e) {
	return {
		id: e.id,
		name: e.name,
		...e.enabled ? {} : { enabled: !1 },
		entries: e.entries.map(({ point: e, role: t, text: n, enabled: r }) => ({
			point: e,
			...t ? { role: t } : {},
			text: n,
			...r === !1 ? { enabled: r } : {}
		})),
		vars: J(e.vars ?? []),
		trigger: J(e.trigger)
	};
}
function Gf(e) {
	if (Array.isArray(e)) return e.map(Gf);
	if (e && typeof e == "object") {
		let t = {};
		for (let n of Object.keys(e).sort()) e[n] !== void 0 && (t[n] = Gf(e[n]));
		return t;
	}
	return e;
}
function Kf(e) {
	return JSON.stringify(Gf({
		name: e.name,
		entries: e.entries.map((e) => ({
			point: e.point,
			role: e.role ?? null,
			text: e.text,
			...e.enabled === !1 ? { enabled: !1 } : {}
		})),
		vars: (e.vars ?? []).flatMap(If),
		trigger: e.trigger ?? sf()
	}));
}
function qf(e) {
	let t = Object.keys(e.locales ?? {}).sort().map((t) => [t, Kf(e.locales[t])]);
	return JSON.stringify([
		Kf(e),
		e.description ?? null,
		t
	]);
}
//#endregion
//#region packages/protocol/src/input-shaping.ts
function Jf(e, t, n = (e) => e) {
	let r = "\0ap-input\0";
	return n(e.replaceAll("{{content}}", r)).replaceAll(r, () => t);
}
//#endregion
//#region packages/protocol/src/history-echo.ts
var Yf = "[{{time}} · {{location}}] {{event}}: {{summary}}", Xf = (e) => e === "synopsis" ? Yf : "{{value}}", Zf = "{{content}}";
function Qf(e) {
	let t = e.indexOf(Zf);
	if (t < 0) return [{
		template: e,
		position: "after"
	}];
	let n = e.slice(0, t), r = e.slice(t + 11).replaceAll(Zf, "");
	return [...n ? [{
		template: n,
		position: "before",
		raw: !0
	}] : [], ...r ? [{
		template: r,
		position: "after",
		raw: !0
	}] : []];
}
function $f(e) {
	let t = e.history;
	if (t === void 0 || As(e)) return;
	if (typeof t == "number") return e.kind !== "synopsis" || !(t > 0) ? void 0 : {
		depth: t,
		pieces: Qf(e.historyTemplate ?? "{{content}}\n\n[{{time}} · {{location}}] {{event}}: {{summary}}")
	};
	if (!t || typeof t != "object" || !(t.depth > 0)) return;
	let n = t;
	return {
		depth: n.depth,
		...n.when ? { when: n.when } : {},
		pieces: [{
			template: n.template ?? Xf(e.kind),
			...n.position === void 0 ? {} : { position: n.position }
		}]
	};
}
var ep = (e) => e.kind === "annotations" && typeof e.history == "number" ? e.history : 0, tp = (e) => e.kind === "speech" && typeof e.history == "number" ? e.history : 0, np = (e) => {
	for (let t = e.length - 1; t >= 0; t--) if (e[t].kind === "content") return t;
	return -1;
};
function rp(e) {
	let t = e?.stages ?? [], n = np(t);
	return n >= 0 ? $c(e, t[n]) : 0;
}
function ip(e, t, n) {
	let r = e?.stages ?? [], i = (t) => $c(e, t), a = np(r), o = rp(e);
	if (n === "before") return {
		key: o,
		rank: -1
	};
	if (n === "after") return {
		key: o,
		rank: 1
	};
	if (typeof n == "number") return {
		key: n,
		rank: 1
	};
	if (!e) {
		let e = t.order;
		return {
			key: o,
			rank: e && typeof e == "object" && "before" in e ? -1 : 1
		};
	}
	let s = (e) => {
		if (e === "@content") return a >= 0 ? o : void 0;
		let t = r.find((t) => t.id === e);
		return t ? i(t) : void 0;
	}, c = (e.structuresAfter ? s(e.structuresAfter) : void 0) ?? o, l = el(e, t);
	if (typeof l == "number") return {
		key: l,
		rank: 1
	};
	if ("before" in l) {
		let e = s(l.before);
		return e === void 0 ? {
			key: c,
			rank: 1
		} : {
			key: e,
			rank: -1
		};
	}
	return {
		key: s(l.after) ?? c,
		rank: 1
	};
}
var ap = (e) => typeof e == "string" ? e : e == null ? "" : typeof e == "object" ? JSON.stringify(e) : String(e);
function op(e) {
	return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.length > 0 : typeof e != "object" || Object.values(e).some((e) => ap(e).trim() !== "");
}
function sp(e, t) {
	if (typeof t == "string") return t;
	if (t == null) return "";
	switch (e) {
		case "synopsis": return cp(Yf, e, t, !1);
		case "status": return Kc(t);
		case "storyline": return t?.name ?? "";
		case "options": return Array.isArray(t) ? t.map((e) => `- ${e?.label ? `${e.label}: ` : ""}${e?.content ?? ""}`).join("\n") : ap(t);
		case "image": {
			let e = t?.images;
			return Array.isArray(e) ? e.map((e) => `- ${e?.caption ? `${e.caption}: ` : ""}${e?.prompt ?? ""}`).join("\n") : ap(t);
		}
		default: return !Array.isArray(t) && typeof t == "object" ? Object.entries(t).map(([e, t]) => `${e}: ${ap(t)}`).join("\n") : JSON.stringify(t, null, 2);
	}
}
function cp(e, t, n, r = !0) {
	let i = n && typeof n == "object" && !Array.isArray(n) ? n : void 0, a = new Set(Vc[t] ?? []);
	return e.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (e, o) => o === "value" && r ? sp(t, n) : i && (a.has(o) || t === "custom" && o in i) ? ap(i[o]) : a.has(o) ? "" : e);
}
var lp = (e, t) => cp(e, "synopsis", t, !1);
function up(e, t, n) {
	let r = (e, t) => e.key - t.key || e.rank - t.rank || e.order - t.order, i = {
		key: t,
		rank: 0,
		order: 0
	}, a = n.filter((e) => e.text !== "").sort(r), o = a.filter((e) => r(e, i) < 0), s = a.filter((e) => r(e, i) > 0), c = e;
	for (let e = o.length - 1; e >= 0; e--) {
		let t = o[e];
		c = t.raw ? t.text + c : `${t.text}\n\n${c}`;
	}
	for (let e of s) c = e.raw ? c + e.text : `${c}\n\n${e.text}`;
	return c;
}
//#endregion
//#region packages/protocol/src/quick-replies.ts
var dp = [
	"executeOnStartup",
	"executeOnUser",
	"executeOnAi",
	"executeOnChatChange",
	"executeOnGroupMemberDraft",
	"executeOnNewChat",
	"executeBeforeGeneration"
], fp = [
	"label",
	"title",
	"message"
];
function pp(e, t, n) {
	let r = (e) => Us(e, (e) => e[0] === "name" && e.length === 2 ? t(e[1]) : void 0), i = e.qrList.map(({ id: e, ...t }, i) => {
		let a = n?.qrList?.[e], o = {
			...t,
			contextList: t.contextList.map((e) => ({ ...e })),
			id: i + 1
		};
		for (let e of fp) {
			let n = a?.[e];
			o[e] = r(typeof n == "string" && n ? n : t[e]);
		}
		return o;
	});
	return {
		version: 2,
		name: e.name,
		disableSend: e.disableSend,
		placeBeforeInput: e.placeBeforeInput,
		injectInput: e.injectInput,
		color: e.color,
		onlyBorderColor: e.onlyBorderColor,
		qrList: i,
		idIndex: i.length
	};
}
var mp = (e) => dp.some((t) => e[t]) || !!e.automationId;
function hp(e) {
	return (e.quickReplySets ?? []).flatMap((e) => e.qrList.filter(mp).map((t) => `${e.name} · ${t.label || t.id}: ${t.message}`));
}
//#endregion
//#region src/store/presets.ts
var gp = /* @__PURE__ */ fn(/* @__PURE__ */ new Map()), _p = /* @__PURE__ */ fn(/* @__PURE__ */ new Map());
async function vp() {
	try {
		let e = `${d()}dist/presets/`, t = await (await S(`${e}index.json`, { cache: "no-cache" })).json();
		for (let { file: n } of t) {
			let t = Qd(await (await S(e + n, { cache: "no-cache" })).json());
			t && gp.set(t.id, t);
		}
	} catch (e) {
		console.error("[AP] failed to load built-in presets", e);
	}
}
var yp = (e) => Qd(e);
function bp() {
	return [.../* @__PURE__ */ new Set([
		...gp.keys(),
		...Object.keys(K().installed),
		..._p.keys()
	])].map((e) => xp(e)).filter(Boolean).sort((e, t) => e.preset.name.localeCompare(t.preset.name));
}
function xp(e) {
	let t = _p.get(e);
	if (t) return {
		preset: t,
		source: "dev"
	};
	let n = Cp(e), r = gp.get(e);
	if (n && (!r || pu(n.version, r.version) >= 0)) return {
		preset: n,
		source: "installed"
	};
	if (r) return {
		preset: r,
		source: "builtin"
	};
}
var Sp = /* @__PURE__ */ new WeakMap();
function Cp(e) {
	let t = K().installed[e];
	if (t) return Sp.has(t) || Sp.set(t, Qd(t)), Sp.get(t) ?? void 0;
}
var wp = (e) => xp(e)?.preset;
function Tp(e) {
	K().installed[e.id] = e, q();
}
function Ep(e) {
	delete K().installed[e], q();
}
function Dp(e, t) {
	e ? _p.set(e.id, e) : t ? _p.delete(t) : _p.clear();
}
var Op = (e) => gp.has(e), kp = (e) => gp.get(e), Ap = {
	"app.name": "Advanced Preset",
	"carrier.reset": "The preset was updated; manual edits in “{name}” were reset.",
	"carrier.tavernHelper.reload": "Tavern Helper scripts of “{name}” were updated. Tavern Helper loads them after the page is reloaded; until then it keeps the previous scripts.",
	"carrier.tavernHelper.reloadNow": "Reload now",
	"quickReplies.conflict": "A Quick Reply set named “{name}” already exists and was not made by Advanced Preset, so the preset’s set of that name is not installed. Rename your set to use it.",
	"error.toolsUnsupported.mainApi": "Tool calling needs a Chat Completion API. Switch the API type, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.postProcessing": "Prompt post-processing “{value}” removes tool calls from the prompt. In API Connections, set Prompt Post-Processing to None or an option “with tools”, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.functionCalling": "This SillyTavern version only allows tool calling with “Enable function calling” on. Turn it on in AI Response Configuration, or pick a recommended configuration that does not use tool calling.",
	"error.toolsUnsupported.model": "SillyTavern reports that {target} does not support tool calling. If the model does support it, turn on “Assume tool support” in the connection settings; otherwise switch the transport or pick a recommended configuration that does not use tool calling.",
	"error.emptyTurn": "The model returned no story content.",
	"error.signatureFallback": "The current channel does not accept the selected thought signature, so the request was retried without it. Switch the thought signature channel in the configuration, or turn thought signatures off.",
	"update.reloading": "Advanced Preset was updated. Reloading…",
	"update.none": "Already up to date.",
	"update.forPreset": "“{name}” needs Advanced Preset {version} or newer. Updating Advanced Preset…",
	"update.failed": "Update failed: {error}",
	"common.add": "Add",
	"common.later": "Later",
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
	"tab.storylines": "Storylines",
	"tab.debug": "Debug",
	"presets.importFile": "File",
	"presets.importUrl": "URL",
	"presets.checkUpdates": "Check for extension updates",
	"presets.installed": "Preset installed.",
	"presets.updated": "Preset updated.",
	"presets.update": "Update from source",
	"presets.export": "Export preset",
	"presets.invalid": "Not an Advanced Preset artifact.",
	"presets.tooNew": "This preset needs Advanced Preset {version} or newer, and Advanced Preset could not update itself to it. Update it in the Extensions panel and try again.",
	"presets.apUpdating": "Advanced Preset is updating itself for “{name}”; the preset is installed after the page reloads.",
	"presets.autoUpdated": "Updated to {version}.",
	"presets.backToBuiltin": "The extension now ships version {version} of this preset, newer than the copy you installed, so the built-in preset is used again.",
	"presets.noSource": "This preset has no update source.",
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
	"config.thoughtSignature.hint": "Gemini: the thought signature attached to the synthetic turn. A signature only works on the backend that issued it, so pick where your requests really end up — whatever SillyTavern's connection or proxy says. Off sends skip_thought_signature_validator instead.",
	"config.openAiSignatures": "OR/CPA signatures",
	"config.openAiSignatures.hint": "Also send thought signatures on OpenAI-compatible connections: OpenRouter's reasoning_details and CLIProxyAPI's (Google's) extra_content. Only turn this on when such a connection really ends at Gemini — other endpoints may reject the extra fields.",
	"config.thoughtSignature.off": "Off",
	"config.thoughtSignature.vertex": "Vertex AI",
	"config.thoughtSignature.aistudio": "AI Studio",
	"config.streamToolArguments": "Stream tool arguments",
	"config.streamToolArguments.hint": "Gemini's generateContent API returns tool calls whole unless asked to stream their arguments; only Vertex AI (Gemini 3+) honours the request, AI Studio quietly ignores it. Auto asks on Vertex AI, custom generateContent endpoints and the Gemini API behind a reverse proxy; On asks on every Gemini-format connection.",
	"config.streamToolArguments.auto": "Auto",
	"config.streamToolArguments.on": "On",
	"config.streamToolArguments.off": "Off",
	"config.maxSteps": "Max steps",
	"config.assumeToolSupport": "Assume tool support",
	"config.assumeToolSupport.hint": "Skip SillyTavern’s check of the API source and model, which relies on the model list’s metadata and can miss models that do support tool calling. Only turn this on when the model really supports it; otherwise the request fails at the provider.",
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
	"writing.cache.hint": "Sticky rendering: while the prompt cache may still hit, every history message keeps the rendering of the previous request (full text / synopsis, user message handling, structures carried in history, annotations); only new messages follow the rules. Everything is applied at once when the cache TTL has passed, the model or source changes, tools or schema change, the prompt before the history changes (e.g. world info activation), or too many requests were postponed.",
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
	"cards.status.edit": "Edit status bar",
	"cards.status.date": "Date",
	"cards.status.weekday": "Weekday",
	"cards.status.time": "Time",
	"cards.status.location": "Location",
	"cards.status.weather": "Weather",
	"cards.status.keys": "Enter to save · Esc to cancel",
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
	"debug.annotations": "Orphaned annotations and speech lines",
	"debug.annotations.hint": "Annotations and speech lines whose text can no longer be found in the message (after edits). They are kept but not shown.",
	"debug.noOrphans": "None in this chat.",
	"debug.orphanSpeech": "Speech",
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
	"um.var.imageOn": "Image generation on",
	"um.var.speechOn": "Speech synthesis on",
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
	"warn.template": "A template failed and was left out of the prompt: {error}",
	"common.listSeparator": ", ",
	"trust.qrTitle": "This preset runs quick replies by itself",
	"trust.qrBody": "“{name}” brings {n} quick reply(ies) that run without a click (on startup, on new messages, from world info …). Their commands (STscript) can send messages and change your chats and settings like any Quick Reply.",
	"trust.uiTitle": "This preset brings custom UI components",
	"trust.uiBody": "“{name}” brings its own card components for {n} structure(s) ({list}), shown in chat messages. Components are code shipped with the preset (EJS templates or JavaScript modules); they run in your browser with the same permissions as the extension (your chats, settings and API connections).",
	"trust.uiRisk": "Only enable them if you trust where the preset comes from. Without enabling, the components stay hidden; you can turn them on later under Config → Custom UI. The code:",
	"trust.enableUi": "Trust and enable",
	"trust.notNow": "Not now",
	"config.customUi": "Custom UI",
	"config.customUi.hint": "The preset brings its own card components for these structures. Components are code shipped with the preset and only show once enabled; an update that changes their code asks again.",
	"config.customUi.enable": "Enable custom UI",
	"config.customUi.template": "Template",
	"config.customUi.module": "Module",
	"config.customUi.top": "Message top",
	"config.customUi.bottom": "Message bottom",
	"config.customUi.changed": "The component code changed; enable it again.",
	"cards.custom.error": "Component error: {error}",
	"storylines.help": "#name — write the side story “name” (no tag: the main storyline)\n# — continue the most recent side story\n#? — a new side story the AI names\n#ifName, #if? — an if-line, an alternate “what if” (hidden from the others by default)\n#@name, #@, #@? — hide the storyline from the others\n#!name, #!, #!? — make it the main storyline once the reply arrives\n\nNo space is needed before #, except after a Latin letter or digit. Expand a storyline for its toolbar; click a message to jump to it.",
	"storylines.count": "{n} storylines",
	"storylines.enabled": "Storylines",
	"storylines.config.hint": "When off, #tags are sent as plain text and the history keeps its order.",
	"storylines.freezeVariables": "Block side-story variable updates",
	"storylines.freezeVariables.hint": "On blocked turns MVU does not run update commands, and Tavern Helper chat variables and the variables of the turn's messages are restored to the state the turn started from, so side stories never change the main storyline's state. Presets read this as storyline.frozen and tell the AI not to update state.",
	"storylines.freeze.all": "All",
	"storylines.freeze.all.hint": "Every storyline other than the main one",
	"storylines.freeze.if": "If-lines",
	"storylines.freeze.if.hint": "Only if-lines",
	"storylines.freeze.off": "Off",
	"storylines.freeze.off.hint": "Variables update on every storyline",
	"storylines.main": "Main storyline",
	"storylines.mainNamed": "Main · {name}",
	"storylines.current": "Current",
	"storylines.ifLine": "if-line",
	"storylines.ifLine.toggle": "If-line",
	"storylines.visible.toggle": "Visible to other storylines",
	"storylines.hidden": "Hidden",
	"storylines.floors": "{n} messages",
	"storylines.empty": "No messages yet.",
	"storylines.jump": "Jump to this message",
	"storylines.user": "Input",
	"storylines.narrator": "Reply",
	"storylines.makeMain": "Make main",
	"storylines.renameTitle": "Rename “{name}”",
	"storylines.nameMain": "Name the main storyline",
	"storylines.nameMain.hint": "When another storyline becomes the main one, the current main storyline stays as a side story with this name.",
	"storylines.openTab": "Open the storylines panel",
	"storylines.switch": "Switch",
	"storylines.switchTitle": "Make “{name}” the main storyline",
	"storylines.askOldMain": "The current main storyline has no name yet. Name it; it stays as a side story with this name:",
	"storylines.switched": "The main storyline is now “{name}”.",
	"storylines.nameTaken": "A storyline named “{name}” already exists.",
	"storylines.invalidName": "Storyline names can't be empty, contain spaces or #, start with ! or ?, or be longer than 64 characters.",
	"storylines.noRecent": "There is no other storyline before this input: it continues the main storyline.",
	"storylines.fallback.side": "Side-story",
	"storylines.fallback.if": "If-line",
	"storylines.fallback.main": "Previous-main",
	"storylines.switchFailed": "Could not make “{name}” the main storyline; the reply stays on that storyline.",
	"storylines.unnamed": "Unnamed",
	"presetFile.installer": "Include the Advanced Preset installer",
	"presetFile.installerHint": "The file can be imported as an ordinary SillyTavern preset. Without Advanced Preset, the installer offers to install it.",
	"presetFile.adopted": "Set up from the imported preset “{file}”: now “{carrier}”.",
	"tab.media": "Media",
	"media.cors": "CORS proxy",
	"media.cors.auto": "Auto",
	"media.cors.auto.hint": "Direct first; through the proxy when the browser blocks the request",
	"media.cors.on": "Always",
	"media.cors.on.hint": "Every request goes through the proxy",
	"media.cors.off": "Off",
	"media.cors.off.hint": "Direct requests only",
	"media.proxy": "Proxy",
	"media.proxy.host.st": "SillyTavern’s /proxy (needs enableCorsProxy: true in config.yaml)",
	"media.proxy.host.tt": "TauriTavern’s /proxy (dev builds)",
	"media.proxy.custom": "Custom",
	"media.proxy.custom.hint": "A compatible public CORS proxy",
	"media.proxy.url": "Proxy URL",
	"media.connection": "Connection",
	"media.noConnection": "No connection yet.",
	"media.addConnection": "Add connection",
	"media.connection.default": "Connection {n}",
	"media.connection.copyName": "{name} (copy)",
	"media.advanced": "Advanced",
	"media.headers": "Request headers",
	"media.headers.hint": "Added to or overriding the built-in headers. An empty value removes a header.",
	"media.headers.name": "Header",
	"media.headers.value": "Value",
	"media.body": "Request body",
	"media.body.hint": "JSON object merged into the built-in request body; null removes a field.",
	"media.auto": "Generate automatically",
	"media.baseUrl": "Base URL",
	"media.apiKey": "API key",
	"media.model": "Model",
	"media.api.openai": "OpenAI",
	"media.api.gemini": "Gemini",
	"media.api.novelai": "NovelAI",
	"media.api.fish": "Fish Audio",
	"media.api.elevenlabs": "ElevenLabs",
	"media.api.minimax": "MiniMax",
	"media.api.deepseek": "DeepSeek",
	"media.image": "Image generation",
	"media.image.auto.hint": "Off: images are generated when you click Generate.",
	"media.image.style": "Style prompt",
	"media.image.style.hint": "Appended to every image prompt. The preset is told a style is set, so the AI leaves style out.",
	"media.image.style.nl": "e.g. Soft watercolor illustration, muted palette",
	"media.image.style.tags": "e.g. watercolor, pastel colors, soft lighting",
	"media.image.negative": "Negative prompt",
	"media.image.negative.placeholder": "e.g. lowres, bad anatomy, watermark",
	"media.image.nsfwBlock": "Block NSFW",
	"media.image.nsfwBlock.hint": "The AI writes no image prompts for NSFW scenes.",
	"media.image.refs": "Reference images",
	"media.image.refs.hint": "The AI can pick these by id to keep characters and style consistent.",
	"media.image.refs.description": "What it shows",
	"media.image.refs.add": "Add images",
	"media.image.geminiEndpoint": "API",
	"media.speech": "Speech synthesis",
	"media.speech.narrator": "Voice narration",
	"media.speech.narrator.hint": "Text outside character lines is read by the narrator voice.",
	"media.speech.auto.hint": "Off: audio is generated when you play it.",
	"media.speech.api": "API",
	"media.speech.voice": "Default voice",
	"media.speech.voice.hint": "For characters without a voice of their own.",
	"media.speech.narratorVoice": "Narrator voice",
	"media.speech.sameAsDefault": "Same as the default voice",
	"media.speech.bindings": "Character voices",
	"media.speech.bindings.hint": "Story characters and their voices. The AI is given these names.",
	"media.speech.character": "Character",
	"media.speech.addBinding": "Add character",
	"media.speech.voiceId": "Voice ID",
	"media.speech.search": "Search voices",
	"media.speech.search.placeholder": "Name or keyword",
	"media.speech.search.none": "No voices found.",
	"media.speech.clone": "Reference audio",
	"media.speech.clone.text": "Transcript of the reference audio",
	"media.speech.clone.consent": "Add consent recording",
	"media.speech.clone.consentSet": "Consent recording added",
	"media.speech.test": "Listen",
	"media.speech.sample": "Hello! This is how I sound.",
	"media.speech.narration": "Narration",
	"media.speech.lines": "Lines",
	"media.speech.play": "Play",
	"media.speech.pause": "Pause",
	"media.speech.stop": "Stop",
	"media.speech.generateAll": "Generate all",
	"media.speech.download": "Download audio",
	"media.image.view": "View full size",
	"media.image.generating": "Generating…",
	"media.image.previous": "Previous",
	"media.image.next": "Next",
	"media.image.prompt": "Image prompt",
	"media.image.generate": "Generate",
	"media.image.retry": "Retry",
	"media.image.regenerate": "Regenerate",
	"media.image.editPrompt": "Edit prompt",
	"media.image.download": "Download",
	"media.error.proxy.disabled": "SillyTavern’s CORS proxy is off. Set enableCorsProxy: true in config.yaml and restart, or use a custom proxy.",
	"media.error.proxy.unsupported": "This TauriTavern version has no CORS proxy. Update TauriTavern or use a custom proxy.",
	"media.error.proxy.body": "SillyTavern’s CORS proxy only forwards JSON requests. Turn the proxy off for this API or use a custom proxy.",
	"media.error.proxy.noCustomUrl": "Enter the custom proxy URL in the Media tab.",
	"media.error.noConnection": "No image connection. Add one in the Media tab.",
	"media.error.network": "The request was blocked or the server could not be reached. Check the Base URL, or set the CORS proxy to Auto or Always.",
	"media.error.body": "Invalid request body override: {error}",
	"debug.images": "Generated images",
	"debug.images.hint": "Deletes stored images that no chat uses any more (deleted messages, swipes or chats). Every chat is scanned first.",
	"debug.images.clean": "Clean up unused images",
	"debug.images.confirm": "Scan all chats and delete generated images none of them uses? This cannot be undone.",
	"debug.images.scanning": "Scanning chats {done} / {total}",
	"debug.images.done": "Removed {removed} images; {kept} kept.",
	"debug.images.failed": "Nothing was deleted: {error}",
	"media.image.missing": "Image not found on this device"
}, jp = {
	en: Ap,
	"zh-cn": {
		"app.name": "Advanced Preset",
		"carrier.reset": "预设已更新，「{name}」中的手动修改已被重置。",
		"carrier.tavernHelper.reload": "「{name}」的酒馆助手脚本已更新。刷新页面后酒馆助手才会载入新脚本，在此之前仍使用旧脚本。",
		"carrier.tavernHelper.reloadNow": "立即刷新",
		"quickReplies.conflict": "已存在名为「{name}」的快速回复集且不是由 Advanced Preset 创建的，因此未安装预设中的同名快速回复集。将你的快速回复集改名后即可使用。",
		"error.toolsUnsupported.mainApi": "工具调用需要使用 Chat Completion API。请切换 API 类型，或选择不使用工具调用的推荐配置。",
		"error.toolsUnsupported.postProcessing": "提示词后处理「{value}」会从提示词中移除工具调用。请在 API 连接设置中把「提示词后处理」改为「未选择」或带「（含工具）」的选项，或选择不使用工具调用的推荐配置。",
		"error.toolsUnsupported.functionCalling": "当前版本的 SillyTavern 只在开启「启用函数调用」时允许工具调用。请在 AI 回复配置中开启它，或选择不使用工具调用的推荐配置。",
		"error.toolsUnsupported.model": "SillyTavern 判断 {target} 不支持工具调用。如果该模型确实支持，请在连接设置中开启「假定支持工具」；否则请切换传输模式，或选择不使用工具调用的推荐配置。",
		"error.emptyTurn": "模型没有返回正文。",
		"error.signatureFallback": "当前渠道不支持所选的思维签名，已改为不发送思维签名重试。请在配置中切换思维签名渠道，或关闭思维签名。",
		"update.reloading": "Advanced Preset 已更新，正在重新加载…",
		"update.none": "已是最新版本。",
		"update.forPreset": "「{name}」需要 Advanced Preset {version} 或更高版本，正在更新 Advanced Preset…",
		"update.failed": "更新失败：{error}",
		"common.add": "添加",
		"common.later": "稍后",
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
		"tab.storylines": "故事线",
		"tab.debug": "调试",
		"presets.importFile": "文件",
		"presets.importUrl": "链接",
		"presets.checkUpdates": "检查扩展更新",
		"presets.installed": "预设已安装。",
		"presets.updated": "预设已更新。",
		"presets.update": "从来源更新",
		"presets.export": "导出预设",
		"presets.invalid": "不是 Advanced Preset 预设文件。",
		"presets.tooNew": "该预设需要 Advanced Preset {version} 或更高版本，且 Advanced Preset 未能自动更新到该版本。请在扩展面板中更新后重试。",
		"presets.apUpdating": "Advanced Preset 正在为「{name}」更新自身，页面重新加载后会继续安装该预设。",
		"presets.autoUpdated": "已更新到 {version}。",
		"presets.backToBuiltin": "插件自带的此预设已更新到 {version}，比你手动安装的版本更新，已改用内置版本。",
		"presets.noSource": "此预设没有更新来源。",
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
		"config.thoughtSignature.hint": "Gemini：示范轮次附带的思维签名。签名只在签发它的后端有效，请按请求实际到达的上游选择，与 SillyTavern 的 API 连接或反向代理无关。关闭时改为发送 skip_thought_signature_validator。",
		"config.openAiSignatures": "OR/CPA 签名",
		"config.openAiSignatures.hint": "在 OpenAI 兼容的连接上也发送思维签名：OpenRouter 的 reasoning_details 与 CLIProxyAPI（Google 格式）的 extra_content。仅在这类连接确实通向 Gemini 时开启，其他端点可能拒绝这些额外字段。",
		"config.thoughtSignature.off": "关闭",
		"config.thoughtSignature.vertex": "Vertex AI",
		"config.thoughtSignature.aistudio": "AI Studio",
		"config.streamToolArguments": "流式工具参数",
		"config.streamToolArguments.hint": "Gemini 的 generateContent 接口默认一次性返回完整的工具调用，需要显式请求才会流式输出参数；只有 Vertex AI（Gemini 3+）支持该请求，AI Studio 会静默忽略。自动：在 Vertex AI、自定义 generateContent 端点与使用反向代理的 Gemini API 上请求；开启：在所有 Gemini 格式的连接上请求。",
		"config.streamToolArguments.auto": "自动",
		"config.streamToolArguments.on": "开启",
		"config.streamToolArguments.off": "关闭",
		"config.maxSteps": "最大步数",
		"config.assumeToolSupport": "假定支持工具",
		"config.assumeToolSupport.hint": "跳过 SillyTavern 对 API 源和模型的检查。该检查依据模型列表中的元数据，可能把实际支持工具调用的模型判为不支持。仅在确认模型支持时开启，否则请求会被服务商拒绝。",
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
		"writing.cache.hint": "粘性渲染：提示词缓存还可能命中时，每条历史消息保持上一次请求的渲染方式（原文 / 摘要、用户消息处理、历史中附带的结构、批注），只有新消息按规则渲染。超过缓存有效期、更换模型或来源、工具或 Schema 变化、历史之前的提示词变化（如世界书激活），或推迟轮次超过上限时，一次性全部应用。",
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
		"cards.status.edit": "编辑状态栏",
		"cards.status.date": "日期",
		"cards.status.weekday": "星期",
		"cards.status.time": "时间",
		"cards.status.location": "地点",
		"cards.status.weather": "天气",
		"cards.status.keys": "Enter 保存 · Esc 取消",
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
		"debug.annotations": "孤立批注与台词",
		"debug.annotations.hint": "原文被编辑后已找不到对应文字的批注与台词。它们会被保留，但不会显示。",
		"debug.noOrphans": "当前聊天没有。",
		"debug.orphanSpeech": "台词",
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
		"um.var.imageOn": "图像生成已开启",
		"um.var.speechOn": "语音合成已开启",
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
		"warn.template": "模板运行出错，已从提示词中略去：{error}",
		"common.listSeparator": "、",
		"trust.qrTitle": "此预设包含自动执行的快速回复",
		"trust.qrBody": "「{name}」带有 {n} 个无需点击即会执行的快速回复（启动时、收到消息时、由世界书触发……）。其中的命令（STscript）与任何快速回复一样，可以发送消息、修改你的聊天与设置。",
		"trust.uiTitle": "此预设包含自定义界面组件",
		"trust.uiBody": "「{name}」为 {n} 个结构提供了自己的卡片组件（{list}），会显示在聊天消息中。组件是预设附带的代码（EJS 模板或 JavaScript 模块），在浏览器中运行，拥有与扩展相同的权限（可以访问你的聊天、设置与 API 连接）。",
		"trust.uiRisk": "仅在信任该预设的来源时启用。不启用时这些组件不会显示，之后可在「配置 → 自定义 UI」中开启。代码如下：",
		"trust.enableUi": "信任并启用",
		"trust.notNow": "暂不启用",
		"config.customUi": "自定义 UI",
		"config.customUi.hint": "预设为下列结构提供了自己的卡片组件。组件是预设附带的代码，只在启用后显示；预设更新改动了组件代码时需要重新确认。",
		"config.customUi.enable": "启用自定义 UI",
		"config.customUi.template": "模板",
		"config.customUi.module": "模块",
		"config.customUi.top": "消息顶部",
		"config.customUi.bottom": "消息底部",
		"config.customUi.changed": "组件代码已更新，需要重新启用。",
		"cards.custom.error": "组件出错：{error}",
		"storylines.help": "#名称 — 写支线「名称」（不加标签即为主线）\n# — 继续最近的支线\n#? — 由 AI 命名的新支线\n#if名称、#if? — if 线，故事的另一种可能（默认对其他线不可见）\n#@名称、#@、#@? — 让这条线对其他线不可见\n#!名称、#!、#!? — 收到回复后设为主线\n\n# 前可以不加空格（紧跟英文字母或数字时除外）。展开故事线可使用工具栏，点击楼层可跳转。",
		"storylines.count": "{n} 条故事线",
		"storylines.enabled": "故事线",
		"storylines.config.hint": "关闭后 #标签 按普通文字发送，历史按原顺序发送。",
		"storylines.freezeVariables": "阻止支线变量更新",
		"storylines.freezeVariables.hint": "被阻止的轮次中，MVU 不执行变量更新命令；酒馆助手的聊天变量与本轮消息变量恢复为本轮开始时的状态，支线的状态不会带回主线。预设通过 storyline.frozen 读取，并提示 AI 不要更新状态。",
		"storylines.freeze.all": "全部",
		"storylines.freeze.all.hint": "主线以外的所有故事线",
		"storylines.freeze.if": "仅 if 线",
		"storylines.freeze.if.hint": "只有 if 线",
		"storylines.freeze.off": "禁用",
		"storylines.freeze.off.hint": "所有故事线都正常更新变量",
		"storylines.main": "主线",
		"storylines.mainNamed": "主线 · {name}",
		"storylines.current": "当前",
		"storylines.ifLine": "if 线",
		"storylines.ifLine.toggle": "if 线",
		"storylines.visible.toggle": "对其他故事线可见",
		"storylines.hidden": "不可见",
		"storylines.floors": "{n} 层",
		"storylines.empty": "还没有消息。",
		"storylines.jump": "跳转到这条消息",
		"storylines.user": "输入",
		"storylines.narrator": "回复",
		"storylines.makeMain": "设为主线",
		"storylines.renameTitle": "重命名「{name}」",
		"storylines.nameMain": "命名主线",
		"storylines.nameMain.hint": "主线的名称：切换主线后，原主线以这个名称保留为支线。",
		"storylines.openTab": "打开故事线面板",
		"storylines.switch": "切换主线",
		"storylines.switchTitle": "将「{name}」设为主线",
		"storylines.askOldMain": "当前主线还没有名称。请为它命名，切换后它将以这个名称保留为一条支线：",
		"storylines.switched": "主线已切换为「{name}」。",
		"storylines.nameTaken": "已有名为「{name}」的故事线。",
		"storylines.invalidName": "故事线名称不能为空，不能包含空格或 #，不能以 ! 或 ? 开头，且不超过 64 个字符。",
		"storylines.noRecent": "这条输入之前没有其他故事线，按主线继续。",
		"storylines.fallback.side": "支线",
		"storylines.fallback.if": "if线",
		"storylines.fallback.main": "原主线",
		"storylines.switchFailed": "未能将「{name}」设为主线，这条回复保留在该故事线上。",
		"storylines.unnamed": "未命名",
		"presetFile.installer": "附带 Advanced Preset 安装脚本",
		"presetFile.installerHint": "导出的文件可作为普通的酒馆预设导入。未安装 Advanced Preset 时，安装脚本会提示安装插件。",
		"presetFile.adopted": "已根据导入的预设「{file}」完成设置，现为「{carrier}」。",
		"tab.media": "多模态",
		"media.cors": "CORS 代理",
		"media.cors.auto": "自动",
		"media.cors.auto.hint": "先直连；浏览器拦截时改走代理",
		"media.cors.on": "始终",
		"media.cors.on.hint": "所有请求都走代理",
		"media.cors.off": "关闭",
		"media.cors.off.hint": "只直连",
		"media.proxy": "代理",
		"media.proxy.host.st": "SillyTavern 的 /proxy（需在 config.yaml 中设置 enableCorsProxy: true）",
		"media.proxy.host.tt": "TauriTavern 的 /proxy（dev 版本）",
		"media.proxy.custom": "自定义",
		"media.proxy.custom.hint": "兼容的公共 CORS 代理",
		"media.proxy.url": "代理地址",
		"media.connection": "连接",
		"media.noConnection": "还没有连接。",
		"media.addConnection": "新增连接",
		"media.connection.default": "连接 {n}",
		"media.connection.copyName": "{name}（副本）",
		"media.advanced": "高级",
		"media.headers": "请求头",
		"media.headers.hint": "添加或覆盖内置请求头；值留空则删除该请求头。",
		"media.headers.name": "名称",
		"media.headers.value": "值",
		"media.body": "请求体",
		"media.body.hint": "JSON 对象，深度合并进内置请求体；null 删除字段。",
		"media.auto": "自动生成",
		"media.baseUrl": "Base URL",
		"media.apiKey": "API Key",
		"media.model": "模型",
		"media.api.openai": "OpenAI",
		"media.api.gemini": "Gemini",
		"media.api.novelai": "NovelAI",
		"media.api.fish": "Fish Audio",
		"media.api.elevenlabs": "ElevenLabs",
		"media.api.minimax": "MiniMax",
		"media.api.deepseek": "DeepSeek",
		"media.image": "图像生成",
		"media.image.auto.hint": "关闭时，点击“生成”后才生成图像。",
		"media.image.style": "风格提示词",
		"media.image.style.hint": "附加到每条图像提示词后。预设会知道已设置风格，AI 不再写风格。",
		"media.image.style.nl": "例如：柔和的水彩插画，低饱和配色",
		"media.image.style.tags": "例如：watercolor, pastel colors, soft lighting",
		"media.image.negative": "负面提示词",
		"media.image.negative.placeholder": "例如：lowres, bad anatomy, watermark",
		"media.image.nsfwBlock": "屏蔽 NSFW",
		"media.image.nsfwBlock.hint": "AI 不为 NSFW 场景写图像提示词。",
		"media.image.refs": "参考图",
		"media.image.refs.hint": "AI 可按 id 选用，保持角色与风格一致。",
		"media.image.refs.description": "图中内容",
		"media.image.refs.add": "添加图片",
		"media.image.geminiEndpoint": "API",
		"media.speech": "语音合成",
		"media.speech.narrator": "旁白语音",
		"media.speech.narrator.hint": "角色台词以外的文字由旁白声音朗读。",
		"media.speech.auto.hint": "关闭时，播放时才生成语音。",
		"media.speech.api": "接口",
		"media.speech.voice": "默认声音",
		"media.speech.voice.hint": "用于没有单独绑定声音的角色。",
		"media.speech.narratorVoice": "旁白声音",
		"media.speech.sameAsDefault": "与默认声音相同",
		"media.speech.bindings": "角色声音",
		"media.speech.bindings.hint": "故事角色与对应的声音；AI 会得到这些角色名。",
		"media.speech.character": "角色",
		"media.speech.addBinding": "添加角色",
		"media.speech.voiceId": "声音 ID",
		"media.speech.search": "搜索声音",
		"media.speech.search.placeholder": "名称或关键词",
		"media.speech.search.none": "没有找到声音。",
		"media.speech.clone": "参考音频",
		"media.speech.clone.text": "参考音频的文字内容",
		"media.speech.clone.consent": "添加授权录音",
		"media.speech.clone.consentSet": "已添加授权录音",
		"media.speech.test": "试听",
		"media.speech.sample": "你好，这是我的声音。",
		"media.speech.narration": "旁白",
		"media.speech.lines": "台词",
		"media.speech.play": "播放",
		"media.speech.pause": "暂停",
		"media.speech.stop": "停止",
		"media.speech.generateAll": "全部生成",
		"media.speech.download": "下载音频",
		"media.image.view": "查看大图",
		"media.image.generating": "生成中…",
		"media.image.previous": "上一张",
		"media.image.next": "下一张",
		"media.image.prompt": "图像提示词",
		"media.image.generate": "生成",
		"media.image.retry": "重试",
		"media.image.regenerate": "重新生成",
		"media.image.editPrompt": "编辑提示词",
		"media.image.download": "下载",
		"media.error.proxy.disabled": "SillyTavern 的 CORS 代理未开启。请在 config.yaml 中设置 enableCorsProxy: true 并重启，或改用自定义代理。",
		"media.error.proxy.unsupported": "当前 TauriTavern 版本没有 CORS 代理。请更新 TauriTavern，或改用自定义代理。",
		"media.error.proxy.body": "SillyTavern 的 CORS 代理只转发 JSON 请求。请对此 API 关闭代理，或改用自定义代理。",
		"media.error.proxy.noCustomUrl": "请在多模态标签页填写自定义代理地址。",
		"media.error.noConnection": "没有图像连接。请在多模态标签页添加。",
		"media.error.network": "请求被拦截或无法连接服务器。请检查 Base URL，或把 CORS 代理设为自动 / 始终。",
		"media.error.body": "请求体覆盖无效：{error}",
		"debug.images": "生成的图像",
		"debug.images.hint": "删除已没有任何聊天使用的图像（已删除的消息、swipe 或聊天）。会先扫描所有聊天。",
		"debug.images.clean": "清理未使用的图像",
		"debug.images.confirm": "扫描所有聊天，并删除没有任何聊天使用的生成图像？此操作无法撤销。",
		"debug.images.scanning": "正在扫描聊天 {done} / {total}",
		"debug.images.done": "已删除 {removed} 张，保留 {kept} 张。",
		"debug.images.failed": "未删除任何图像：{error}",
		"media.image.missing": "此设备上找不到该图像"
	}
};
function Mp() {
	let e = (localStorage.getItem("language") || navigator.language || "en").toLowerCase();
	return e.startsWith("zh") ? e.includes("tw") || e.includes("hk") ? "zh-tw" : "zh-cn" : e.split("-")[0];
}
function Y(e, t = {}) {
	return ((jp[Mp()] ?? jp[Mp().split("-")[0]])?.[e] ?? Ap[e] ?? e).replace(/\{(\w+)\}/g, (e, n) => String(t[n] ?? `{${n}}`));
}
function Np(e) {
	return e.locales?.[Mp()] ?? e.locales?.[Mp().split("-")[0]];
}
function Pp(e, t, n, r, i) {
	let a = Np(e)?.[t]?.[n]?.[r];
	return typeof a == "string" && a ? a : i;
}
function Fp(e) {
	let t = Np(e)?.name;
	return typeof t == "string" && t ? t : e.name;
}
function Ip(e) {
	let t = Np(e)?.description;
	return typeof t == "string" && t ? t : e.description;
}
function Lp(e, t, n) {
	return Hf(t, Mp(), Np(e)?.[n]?.[t.id]);
}
//#endregion
//#region src/core/storylines.ts
var Rp = "advanced_preset_storyline", zp = "advanced_preset_storyline_switched", Bp = "?new", Vp = (e) => e.startsWith("?"), Hp = (e) => {
	let t = e && !e.is_user ? e.extra?.[Rp] : void 0;
	return typeof t == "string" ? t : void 0;
};
function Up(e, t = {}) {
	let n = [], r = "", i = "";
	return e.forEach((a, o) => {
		let s = r;
		if (a.is_user) {
			let t = Zu(a.mes);
			s = t ? t.form === "name" ? t.name : t.form === "recent" ? i : Hp(e[o + 1]) ?? "?" : "";
		} else {
			let e = Hp(a);
			e !== void 0 && (s = e);
		}
		n.push(s), r = s, s !== "" && s !== t.main && !Vp(s) && (i = s);
	}), n;
}
var Wp = (e, t) => e === "" || e === t.main ? "" : e;
function Gp(e, t) {
	return e === "" ? !1 : t.if?.[e] ?? id(e);
}
function Kp(e, t) {
	return e === "" ? !1 : t.hidden?.[e] ?? Gp(e, t);
}
var qp = (e, t) => e === "" ? t.main ?? "" : Vp(e) ? "" : e;
function Jp(e, t, n, r = -1) {
	let i = [];
	for (let n of e) n !== "" && n !== t && !i.includes(n) && i.push(n);
	let a = [
		...i.filter((e) => e === "" || e === t || !Kp(e, n)),
		"",
		...t === "" ? [] : [t]
	], o = a.map((e) => ({
		key: e,
		name: qp(e, n),
		main: e === "",
		if: Gp(e, n),
		hidden: Kp(e, n)
	})), s = new Map(a.map((e, t) => [e, t])), c = [], l = [], u = 0;
	for (let t = 0; t < a.length; t++) e.forEach((e, n) => {
		s.get(e) === t && (c.push(n), l.push(t));
	});
	e.forEach((e) => {
		s.has(e) || u++;
	});
	let d = new Set(c.map((t) => e[t])), f = a.filter((e) => d.has(e)).length > 1, p = !e.some((e, n) => e === t && n !== r);
	return {
		current: t,
		groups: o,
		order: c,
		groupOf: l,
		hidden: u,
		grouped: f,
		isNew: p
	};
}
var Yp = {
	naming: !1,
	namingMain: !1,
	switching: !1
};
function Xp(e, t, n, r = !1, i = Yp, a = "off") {
	let o = {
		main: e === "",
		if: Gp(e, t)
	};
	return {
		name: i.naming ? "" : qp(e, t),
		...o,
		new: n,
		grouped: r,
		naming: i.naming,
		namingMain: i.namingMain,
		switching: i.switching,
		frozen: qu(a, o)
	};
}
function Zp(e, t, n) {
	let r = Up(e, n).map((e) => Wp(e, n)), i = (e, i = n) => ({
		keys: r,
		meta: i,
		current: e,
		input: t,
		...Yp
	}), a = t >= 0 ? e[t] : void 0;
	if (!a) return i(r.at(-1) ?? "");
	let o = a.is_user ? Zu(a.mes) : null;
	if (!o) return i(r[t] ?? "");
	let s = (e) => {
		for (let n = t; n < r.length; n++) r[n] = e;
	}, c, l = !1;
	if (o.form === "recent") {
		let e = "";
		for (let n = t - 1; n >= 0 && !e; n--) r[n] !== "" && !Vp(r[n]) && (e = r[n]);
		if (c = ed(a.mes, o, e), l = !e, s(e), !e) return {
			...i(""),
			rewrite: c,
			noRecent: l
		};
		o = {
			...o,
			form: "name",
			name: e
		};
	}
	let u = c === void 0 ? {} : { rewrite: c };
	if (!o.switchMain) {
		let e = o.hide ? { hide: !0 } : {};
		if (o.form === "new") return s(Bp), o.ifLine ? {
			...i(Bp, {
				...n,
				if: {
					...n.if ?? {},
					[Bp]: !0
				}
			}),
			naming: !0,
			ifLine: !0,
			...e
		} : {
			...i(Bp),
			naming: !0,
			...e
		};
		let a = r[t];
		return {
			...i(a),
			...u,
			...a === "" ? {} : e
		};
	}
	if (o.form === "name" && Wp(o.name, n) === "") return s(""), {
		...i(""),
		...u
	};
	if (o.form === "new" && a.extra?.advanced_preset_storyline_switched) return s(""), {
		...i(""),
		naming: !0,
		renameMain: !0
	};
	let d = o.form === "name" ? o.name : "", f = n.main ?? "", p = r.some((n, r) => n === "" && r < t && !e[r].is_system), m = f || "?main";
	for (let e = 0; e < r.length; e++) r[e] = e >= t ? "" : r[e] === "" ? m : r[e] === d ? "" : r[e];
	let h = {
		...n.if ?? {},
		[m]: !1
	};
	delete h[d];
	let g = { ...n.hidden ?? {} };
	return delete g[m], delete g[d], {
		keys: r,
		meta: {
			...d ? { main: d } : {},
			if: h,
			hidden: g
		},
		current: "",
		input: t,
		...u,
		naming: o.form === "new",
		namingMain: !f && p,
		switching: !0,
		...d ? { target: d } : {},
		...f ? { oldName: f } : {}
	};
}
var Qp = (e) => e.is_user ? Qu(e.mes) : e.mes, $p = 983296, em = /⟦\uDB80([\uDD00-\uDDFF])⟧/g, tm = (e) => `⟦${String.fromCodePoint($p + Math.min(e, 255))}⟧`;
function nm(e) {
	if (!e.includes("⟦")) return {
		text: e,
		group: -1
	};
	let t = -1;
	return {
		text: e.replace(em, (e, n) => (t < 0 && (t = n.charCodeAt(0) - 56576), "")),
		group: t
	};
}
function rm(e, t, n, r) {
	let i = e.slice(t, n), a = i.length;
	for (; a > 0 && r.groupOf(i[a - 1]) < 0 && r.isNudge(i[a - 1]);) a--;
	let o = i.findIndex((e, t) => t < a && r.groupOf(e) >= 0);
	if (o < 0) return n;
	let s = [], c = [], l = Array(a + 1).fill(0);
	for (let e = a - 1; e >= 0; e--) l[e] = l[e + 1] + +(r.groupOf(i[e]) >= 0);
	for (let e = o; e < a; e++) {
		let t = i[e], n = r.groupOf(t);
		n >= 0 ? s.push({
			m: t,
			g: n,
			followers: [],
			before: []
		}) : t.role === "tool" || Array.isArray(t.tool_calls) && t.tool_calls.length ? s[s.length - 1].followers.push(t) : c.push({
			m: t,
			depth: l[e + 1]
		});
	}
	let u = [...s].sort((e, t) => e.g - t.g), d = r.current === r.main ? u : u.filter((e) => e.g !== r.current), f = [];
	for (let e of c) {
		let t = Math.max(0, d.length - e.depth);
		t >= d.length ? f.push(e.m) : d[t].before.push(e.m);
	}
	let p = i.slice(0, o), m = -1, h = !1;
	for (let e of u) {
		if (e.g !== m) {
			m = e.g, m === r.current && r.current !== r.main && (p.push(...f), h = !0);
			let t = r.separator(m);
			t && p.push(t);
		}
		p.push(...e.before, e.m, ...e.followers);
	}
	return h || p.push(...f), p.push(...i.slice(a)), e.splice(t, n - t, ...p), t + p.length;
}
function im(e, t, n, r, i = "off") {
	let { meta: a, current: o } = n, s = Up(e, a).map((e) => Wp(e, a)), c = Jp(e.map((e, i) => {
		let a = t[i] ?? -1;
		return a >= 0 && a < n.keys.length ? n.keys[a] : i === r ? o : s[i];
	}), o, a, r), l = {
		naming: n.naming,
		namingMain: n.namingMain,
		switching: n.switching,
		...n.target ? { target: n.target } : {},
		...n.oldName ? { oldName: n.oldName } : {},
		...n.renameMain ? { renameMain: !0 } : {},
		...n.hide ? { hide: !0 } : {},
		...n.ifLine ? { ifLine: !0 } : {}
	}, u = c.order.map((t) => {
		let n = e[t], r = Qp(n);
		return r === n.mes ? n : {
			...n,
			mes: r
		};
	}), d = {
		current: o,
		naming: l,
		input: n.input,
		view: Jp(n.keys, o, a).order,
		vars: Xp(o, a, c.isNew, c.grouped, l, i),
		mainName: a.main ?? "",
		groups: c.groups,
		currentGroup: c.groups.findIndex((e) => e.key === o),
		mainGroup: c.groups.findIndex((e) => e.main),
		grouped: c.grouped,
		hidden: c.hidden
	};
	return {
		items: u,
		realIndex: c.order.map((e) => t[e] ?? -1),
		groups: c.groupOf,
		currentInput: r >= 0 ? c.order.indexOf(r) : -1,
		turn: d
	};
}
var am = (e, t) => t !== void 0 && t !== e.currentGroup && t !== e.mainGroup;
function om(e, t = /* @__PURE__ */ new WeakMap()) {
	for (let n of e) if (typeof n.content == "string") {
		let e = nm(n.content);
		e.group >= 0 && (n.content = e.text, t.has(n) || t.set(n, e.group));
	} else if (Array.isArray(n.content)) for (let e of n.content) {
		if (!e || typeof e != "object" || typeof e.text != "string") continue;
		let r = nm(e.text);
		r.group >= 0 && (e.text = r.text, t.has(n) || t.set(n, r.group));
	}
	return t;
}
//#endregion
//#region src/store/sidecar.ts
var sm = "advanced_preset";
function cm(e) {
	let t = e?.extra?.[sm];
	return t && typeof t == "object" && t.v === 1 ? t : void 0;
}
function lm(e, t, n) {
	return {
		...e,
		structures: {
			...e.structures,
			[t]: J(n)
		}
	};
}
function um(t, n) {
	let r = e().chat[t];
	if (!r) return;
	r.extra ??= {}, r.extra[sm] = n;
	let i = r.swipe_id ?? 0, a = r.swipe_info?.[i];
	a && (a.extra ??= {}, a.extra[sm] = J(n));
}
function dm(t) {
	let n = e().chat[t];
	if (!n || n.is_user || !Array.isArray(n.swipes) || !n.extra) return !1;
	let r = n.swipe_id ?? 0;
	return r < n.swipes.length && n.swipe_info?.[r] || (delete n.extra[Rp], !n.extra.advanced_preset) ? !1 : (delete n.extra[sm], !0);
}
//#endregion
//#region src/store/eventlog.ts
function fm() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
var pm = (e) => `legacy-${e}`;
function mm(e) {
	let t = !1;
	return e.forEach((e, n) => {
		e.id || (e.id = pm(n), t = !0);
	}), t;
}
function hm(e) {
	if (e.type === "global.ref") return e.id ?? (typeof e.index == "number" ? pm(e.index) : void 0);
}
var gm = (e, t) => e.globalMemory.log.findIndex((e) => e.id === t), _m = "advanced_preset";
function vm() {
	return e().chatMetadata?.[_m]?.seedEvents ?? [];
}
function ym(t = Infinity, n) {
	let r = vm().map((e) => ({
		at: -1,
		event: e
	})), i = e().chat;
	for (let e of n ?? i.keys()) if (!(e > t)) for (let t of cm(i[e])?.events ?? []) r.push({
		at: e,
		event: t
	});
	return r;
}
function bm(e = Infinity, t) {
	let n = {};
	for (let { event: r } of ym(e, t)) r.type === "memory.replace" ? n[r.key] = r.content : r.type === "memory.delete" && delete n[r.key];
	return n;
}
function xm(e = Infinity, t) {
	let n = null;
	for (let { at: r, event: i } of ym(e, t)) i.type === "recap.set" && (n = i.text ? {
		text: i.text,
		coversUpTo: i.coversUpTo,
		at: r
	} : null);
	return n;
}
async function Sm(t) {
	let n = e(), r = n.chat.length - 1, i = n.chat[r], a = cm(i);
	if (i && a) {
		a.events.push(t);
		let e = i.swipe_info?.[i.swipe_id ?? 0];
		e?.extra?.[_m] && (e.extra[_m].events = J(a.events)), await n.saveChat();
	} else {
		let e = n.chatMetadata[_m] ??= {};
		(e.seedEvents ??= []).push(t), await n.saveMetadata();
	}
}
function Cm(e) {
	let t = {};
	for (let n of e.globalMemory.log.slice(0, e.globalMemory.cursor)) n.inactive || (n.op === "replace" ? t[n.key] = n.content ?? "" : delete t[n.key]);
	return t;
}
function wm(e, t, n, r, i, a = fm()) {
	let o = e.globalMemory;
	mm(o.log);
	let s = Cm(e)[n] ?? null;
	return o.log.splice(o.cursor), o.log.push({
		id: a,
		op: t,
		key: n,
		content: r,
		prev: s,
		source: i,
		at: Date.now()
	}), o.cursor = o.log.length, q(), o.cursor - 1;
}
var Tm = (e) => e.globalMemory.cursor > 0, Em = (e) => e.globalMemory.cursor < e.globalMemory.log.length;
function Dm(e) {
	Tm(e) && (e.globalMemory.cursor--, q());
}
function Om(e) {
	Em(e) && (e.globalMemory.cursor++, q());
}
function km(e, t) {
	let n = e.globalMemory.log[gm(e, t)];
	n && (n.prev === null ? wm(e, "delete", n.key, void 0, "undo") : wm(e, "replace", n.key, n.prev, "undo"));
}
function Am(e) {
	let t = [], n = [];
	for (let r of e) if (r.scope === "global_memory") {
		let e = fm();
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
function jm(e, t) {
	for (let n of t) gm(e, n.id) < 0 && wm(e, n.op, n.key, n.content, "model", n.id);
}
function Mm(e, t, n) {
	let r = !1;
	for (let i of t) {
		let t = e.globalMemory.log[gm(e, i)];
		t && !t.inactive !== n && (n ? delete t.inactive : t.inactive = !0, r = !0);
	}
	return r;
}
//#endregion
//#region src/store/config.ts
function Nm(e) {
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
	}, q()), mm(n.globalMemory.log) && q(), n;
}
function Pm(e, t, n) {
	return n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.diff : Eu(e, n.id)?.diff;
}
function Fm(e, t = Nm(e).active.ref) {
	return bu(e.configurationDefaults, Pm(e, Nm(e), t));
}
function Im(e) {
	let t = Nm(e);
	return bu(Fm(e, t.active.ref), t.active.diff);
}
function Lm(e, t) {
	let n = Nm(e);
	n.active.diff = Su(t, Fm(e, n.active.ref)) ?? {}, q();
}
function Rm(e, t) {
	let n = Im(e);
	return t(n), Lm(e, n), n;
}
function zm(e, t) {
	let n = Nm(e);
	n.active = {
		ref: t,
		diff: {}
	}, q();
}
var Bm = (e) => Object.keys(Nm(e).active.diff ?? {}).length > 0;
function Vm(e) {
	Nm(e).active.diff = {}, q();
}
function Hm(e, t) {
	let n = Nm(e), r = Im(e), i = {
		id: `u${Date.now().toString(36)}`,
		name: t,
		diff: Su(r, e.configurationDefaults) ?? {}
	};
	return n.saved.push(i), n.active = {
		ref: {
			kind: "saved",
			id: i.id
		},
		diff: {}
	}, q(), i;
}
function Um(e, t) {
	let n = Nm(e), r = n.saved.find((e) => e.id === t);
	r && (r.diff = Su(Im(e), e.configurationDefaults) ?? {}, n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active.diff = {}), q());
}
function Wm(e, t, n) {
	let r = Nm(e).saved.find((e) => e.id === t);
	r && (r.name = n, q());
}
function Gm(e, t) {
	let n = Nm(e);
	n.saved = n.saved.filter((e) => e.id !== t), n.active.ref.kind === "saved" && n.active.ref.id === t && (n.active = {
		ref: {
			kind: "recommended",
			id: e.defaultConfiguration
		},
		diff: n.active.diff
	}), q();
}
function Km(e) {
	let t = Nm(e);
	if (t.version === e.version && t.hash === e.hash) return [];
	let n = t.version ?? "0.0.0", r = pu(n, e.version) < 0, i = [], a = e.configurationDefaults, o = (t) => {
		let o = r ? Tu(t, e.migrations, n) : J(t);
		i.push(...Cu(o, a));
		let s = o.modules;
		if (s) for (let t of Object.keys(s)) e.modules.some((e) => e.id === t) || (delete s[t], i.push(`modules.${t}`));
		let c = o.params;
		if (c) for (let t of Object.keys(c)) {
			let n = e.params.find((e) => e.id === t);
			(!n || !ku(n, c[t])) && (delete c[t], i.push(`params.${t}`));
		}
		return o;
	};
	t.active.diff = o(t.active.diff ?? {});
	for (let e of t.saved) e.diff = o(e.diff);
	t.active.ref.kind === "recommended" && !e.configurations.some((e) => e.id === t.active.ref.id) && (t.active.ref = {
		kind: "recommended",
		id: e.defaultConfiguration
	}), t.userModules?.length && r && (t.userModules = Df(t.userModules, e.migrations, n));
	let s = (t.userModules ?? []).filter((t) => t.enabled && bf(e, t).length).map((e) => e.name), c = t.version !== void 0;
	return t.version = e.version, t.hash = e.hash, q(), i.length && console.warn(`[AP] ${e.id}: dropped obsolete configuration keys`, i), s.length && c && t.version !== n && x("warning", Y("um.lostAfterUpdate", { names: s.join(", ") }), Fp(e)), i;
}
//#endregion
//#region src/store/tavern-helper.ts
var qm = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Jm(e, t, n = []) {
	let r = qm(t) ? t : {}, i = (e) => e.id !== Fd, a = (Array.isArray(r.scripts) ? r.scripts : []).filter(qm).filter(i).map((e) => Array.isArray(e.scripts) ? {
		...e,
		scripts: e.scripts.filter((e) => !qm(e) || i(e))
	} : e), o = J(e ?? []), s = Od(o), c = /* @__PURE__ */ new Set([...s, ...n]), l = (e) => typeof e.id != "string" || !c.has(e.id), u = /* @__PURE__ */ new Map();
	for (let e of a) {
		typeof e.id == "string" && u.set(e.id, e);
		for (let t of Array.isArray(e.scripts) ? e.scripts.filter(qm) : []) typeof t.id == "string" && u.set(t.id, t);
	}
	let d = (e) => {
		let t = u.get(e.id);
		t && t.type === e.type && (typeof t.enabled == "boolean" && (e.enabled = t.enabled), e.data && qm(t.data) && (e.data = {
			...e.data,
			...J(t.data)
		}));
	};
	for (let e of o) {
		if (d(e), e.type !== "folder") continue;
		for (let t of e.scripts) d(t);
		let t = u.get(e.id), n = qm(t) && Array.isArray(t.scripts) ? t.scripts.filter(qm).filter(l) : [];
		e.scripts.push(...J(n));
	}
	let f = [...o, ...J(a.filter(l))], p = qm(r.variables) ? J(r.variables) : {}, m = Object.keys(r).some((e) => e !== "scripts" && e !== "variables");
	return !f.length && !Object.keys(p).length && !m ? { owned: s } : {
		data: {
			...J(r),
			scripts: f,
			variables: p
		},
		owned: s
	};
}
function Ym(e, t) {
	let n = (e) => JSON.stringify(qm(e) && Array.isArray(e.scripts) ? e.scripts.map((e) => qm(e) ? {
		...e,
		data: void 0,
		scripts: Array.isArray(e.scripts) ? e.scripts.map((e) => qm(e) ? {
			...e,
			data: void 0
		} : e) : void 0
	} : e) : []);
	return n(e) !== n(t);
}
function Xm(e, t) {
	let n = /* @__PURE__ */ new Map();
	for (let t of qm(e) && Array.isArray(e.scripts) ? e.scripts.filter(qm) : []) {
		n.set(String(t.id), t.content ?? null);
		for (let e of Array.isArray(t.scripts) ? t.scripts.filter(qm) : []) n.set(String(e.id), e.content ?? null);
	}
	let r = JSON.stringify(t.map((e) => n.get(e) ?? null)), i = 2166136261;
	for (let e = 0; e < r.length; e++) i = Math.imul(i ^ r.charCodeAt(e), 16777619) >>> 0;
	return i.toString(16);
}
//#endregion
//#region src/store/carrier.ts
var Zm = "advanced_preset";
function Qm(e) {
	let t = e?.extensions?.[Zm];
	if (!t?.tavernHelperPrevious || !t.tavernHelperScripts) return !1;
	let n = Xm(e.extensions[Dd], t.tavernHelperScripts);
	return n === t.tavernHelperPrevious && n !== t.tavernHelperCode;
}
var $m = {
	temperature: "temp_openai",
	frequency_penalty: "freq_pen_openai",
	presence_penalty: "pres_pen_openai",
	top_p: "top_p_openai",
	top_k: "top_k_openai",
	top_a: "top_a_openai",
	min_p: "min_p_openai",
	repetition_penalty: "repetition_penalty_openai"
}, eh = (e) => $m[e] ?? e, th = () => e().getPresetManager("openai"), nh = (e) => `AP · ${e.name}`;
function rh() {
	return e().chatCompletionSettings?.extensions?.advanced_preset?.presetId ?? null;
}
function ih(e) {
	let t = JSON.stringify([e.prompts ?? null, e.prompt_order ?? null]), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function ah(e, t, n) {
	let r = e.carrier.prompt_order.map((e) => ({ ...e })), i = n?.extensions?.[Zm], a = Jm(e.tavernHelperScripts, n?.extensions?.[Dd], i?.presetId === e.id ? i.tavernHelperScripts : void 0), o = {
		presetId: e.id,
		version: e.version,
		hash: e.hash
	};
	if (a.owned.length) {
		let t = Xm(a.data, a.owned), n = i?.presetId === e.id ? i : void 0, r = n?.tavernHelperCode !== void 0 && n.tavernHelperCode !== t ? n.tavernHelperCode : n?.tavernHelperPrevious;
		Object.assign(o, {
			tavernHelperScripts: a.owned,
			tavernHelperCode: t
		}, r ? { tavernHelperPrevious: r } : {});
	}
	return {
		...J(t.sampling),
		prompts: J(e.carrier.prompts),
		prompt_order: [1e5, 100001].map((e) => ({
			character_id: e,
			order: J(r)
		})),
		extensions: {
			[Zm]: o,
			...e.regexScripts?.length ? { regex_scripts: J(e.regexScripts) } : {},
			...a.data ? { [Dd]: a.data } : {}
		}
	};
}
function oh(e) {
	let t = th();
	if (!t) return null;
	let { presets: n, preset_names: r } = t.getPresetList();
	for (let [t, i] of Object.entries(r)) if (n[i]?.extensions?.advanced_preset?.presetId === e) return t;
	return null;
}
async function sh(e, t, n) {
	let r = th();
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
async function ch(e, t = {}) {
	let n = th(), r = Nm(e), i = oh(e.id), a = i ?? nh(e), o = i ? n.getCompletionPresetByName(i) : void 0, s = o?.extensions?.[Zm], c = !o || t.force || s?.hash !== e.hash || Qm(o), l = !!i && n.getSelectedPresetName() === i;
	if (c) {
		o && r.carrierHash && ih(o) !== r.carrierHash && x("info", Y("carrier.reset", { name: a }));
		let n = ah(e, Im(e), o);
		if (o) for (let e of [
			"chat_completion_source",
			"reverse_proxy",
			"proxy_password"
		]) o[e] !== void 0 && (n[e] = o[e]);
		r.carrierHash = ih(n), q(), await sh(a, n, !!t.select || l);
		let i = n.extensions[Dd];
		l && Ym(o?.extensions?.tavern_helper, i) && uh(a);
	} else if (t.select && n.getSelectedPresetName() !== a) {
		let e = n.findPreset(a);
		e !== void 0 && await n.selectPreset(e);
	}
	return a;
}
var lh = !1;
function uh(e) {
	"TavernHelper" in globalThis && !lh && (lh = !0, y(`<p>${v(Y("carrier.tavernHelper.reload", { name: e }))}</p>`, Y("carrier.tavernHelper.reloadNow"), Y("common.later")).then((e) => {
		lh = !1, e && location.reload();
	}));
}
async function dh(e) {
	await ch(e, { select: !0 });
}
async function fh(e) {
	let t = oh(e.id);
	if (!t) return;
	let n = th(), r = n.getCompletionPresetByName(t);
	if (!r) return;
	let i = Im(e).sampling;
	if (Object.entries(i).every(([e, t]) => JSON.stringify(r[e]) === JSON.stringify(t))) return;
	let a = {
		...r,
		...J(i)
	}, o = n.getSelectedPresetName() === t;
	ph = !0;
	try {
		await sh(t, a, o);
	} finally {
		ph = !1;
	}
}
var ph = !1;
function mh(t) {
	if (ph || rh() !== t.id) return !1;
	let n = e().chatCompletionSettings, r = Im(t), i = {};
	for (let [e, t] of Object.entries(r.sampling)) {
		let r = n[eh(e)];
		r !== void 0 && JSON.stringify(r) !== JSON.stringify(t) && (i[e] = J(r));
	}
	return Object.keys(i).length ? (Rm(t, (e) => Object.assign(e.sampling, i)), !0) : !1;
}
//#endregion
//#region src/core/classify.ts
var hh = null, gh = (e) => {
	hh = e;
}, _h = () => {
	let e = hh;
	return hh = null, e;
}, vh = (e) => e.meta?.enabled !== !1;
function yh(t, n) {
	if (!vh(n)) return "";
	let r = Us(t.meta.trigger, (e) => e[0] === "name" ? dd(t, n, e[1]) : void 0);
	try {
		return e().substituteParams(r);
	} catch {
		return r;
	}
}
function bh(e, t, n, r, i, a = [], o = !0) {
	let s = Pl(n, yh(e, t), e.meta.wrap), c = {
		meta: {
			...s,
			task: null,
			recent: !1
		},
		flags: {}
	}, l = od(c);
	for (let t of e.regex) {
		let e = n;
		t.target === "meta" ? e = s.segments.join("\n\n") : t.target.startsWith("recent:") && (e = a.slice(-Number(t.target.slice(7))).join("\n\n"));
		let r = !1;
		try {
			r = new RegExp(t.pattern, t.flags).test(e);
		} catch {
			r = !1;
		}
		c.flags[t.id] = r && Bs(t.requires, l);
	}
	let u = null;
	s.pure && (e.meta.tasks.summary && Bs(e.meta.tasks.summary, l) ? u = "summary" : e.meta.tasks.impersonate && Bs(e.meta.tasks.impersonate, l) && (u = "impersonate"));
	let d = i && [
		"normal",
		"regenerate",
		"swipe",
		"continue"
	].includes(r) && !s.pure ? "story" : "task", f = o ? _h() : null;
	return f?.origin && (d = f.origin), {
		meta: {
			...s,
			task: u
		},
		flags: c.flags,
		origin: d
	};
}
function xh(e, t, n) {
	return n === "task" ? e.workflows.find((e) => e.kind === "task") ?? e.workflows.find((e) => e.id === "task") : e.workflows.find((e) => e.id === t.connection.workflow) ?? e.workflows.find((e) => e.kind === "story");
}
//#endregion
//#region src/core/context.ts
var Sh = 0, Ch = () => `ap-${Date.now().toString(36)}-${(++Sh).toString(36)}`, wh = /* @__PURE__ */ new Map(), Th = null, Eh = null, Dh = {
	setPending(e) {
		Th = e;
	},
	takePending() {
		let e = Th;
		return Th = null, e;
	},
	peekPending: () => Th,
	arm(e) {
		Eh = e, wh.set(e.id, e);
	},
	takeArmed() {
		let e = Eh;
		return Eh = null, e;
	},
	get: (e) => wh.get(e),
	release(e) {
		wh.delete(e);
	},
	sweep(e = 6e5) {
		let t = Date.now();
		for (let [n, r] of wh) t - r.createdAt > e && wh.delete(n);
	}
};
//#endregion
//#region src/core/history.ts
function Oh(e) {
	let t = e.body === "full" ? "f" : e.body === "synopsis" ? "s" : e.body === "drop" ? "x" : `t${e.max ?? 0}`;
	return e.body === "full" ? t + (e.annotations ? "a" : "") + (e.speech ? "v" : "") + (e.echo ?? []).map((e) => `+${e}`).join("") : t;
}
function kh(e, t) {
	let n = e ? /^(?:(f)(y?)(a?)(v?)((?:\+[^+]+)*)|(s)|(x)|t(\d+))$/.exec(e) : null;
	if (n) {
		if (n[1]) {
			let e = [...n[2] && t ? [t] : [], ...n[5] ? n[5].slice(1).split("+") : []];
			return {
				body: "full",
				...n[3] ? { annotations: !0 } : {},
				...n[4] ? { speech: !0 } : {},
				...e.length ? { echo: e } : {}
			};
		}
		return n[6] ? { body: "synopsis" } : n[7] ? { body: "drop" } : {
			body: "truncate",
			max: Number(n[8])
		};
	}
}
var Ah = (e) => {
	let t = e.extra?.advanced_preset;
	return t && t.v === 1 ? t : void 0;
}, jh = /* @__PURE__ */ new Set([
	"meta-pure",
	"summary",
	"impersonate"
]), Mh = (e, t) => lp(e, t), Nh = (e, t) => t ? Ah(e)?.structures?.[t] : void 0, Ph = (e, t) => Ah(e)?.structures?.[t];
function Fh(e, t) {
	let n = e.map((e, t) => ({
		item: e,
		index: t
	})), r = /* @__PURE__ */ new Set();
	n.forEach(({ item: e }, i) => {
		if (e.is_user || e.is_system) return;
		let a = Ah(e);
		if (a && jh.has(a.turn)) {
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
		let n = Pl(e.item.mes, t.trigger, t.wrap);
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
			if (e.fresh && e.index !== t.currentInput && (!a(n) || t.synopsisId && t.background?.(e.index))) {
				if (o >= 0 && t.realIndex(e.index) <= o) e.fresh = { body: "drop" }, e.forced = !0;
				else if (e.item.is_user) {
					let n = t.tokenSaving.userInput ?? "truncate", r = t.tokenSaving.truncateUserAfter;
					n === "remove" ? e.fresh = { body: "drop" } : n === "truncate" && r > 0 && e.item.mes.length > r && (e.fresh = {
						body: "truncate",
						max: r
					});
				} else Nh(e.item, t.synopsisId) && (e.fresh = { body: "synopsis" });
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
	for (let e of a(t.annotations?.depth ?? 0)) e.fresh.body === "full" && Ah(e.item)?.annotations?.length && (e.fresh.annotations = !0);
	for (let e of a(t.speech?.depth ?? 0)) e.fresh.body === "full" && e.index !== t.continuing && Ah(e.item)?.speech?.length && (e.fresh.speech = !0);
	for (let e of t.echoes?.rules ?? []) if (e.active) for (let n of a(e.depth)) n.fresh.body === "full" && n.index !== t.continuing && op(Ph(n.item, e.id)) && (n.fresh.echo = [...n.fresh.echo ?? [], e.id]);
	return i;
}
function Ih(e, t, n) {
	let { item: r } = e;
	if (!t || r.is_system) return r.mes;
	switch (t.body) {
		case "drop": return null;
		case "truncate": {
			let e = t.max ?? 0;
			return e > 0 && r.mes.length > e ? `${r.mes.slice(0, e)}…` : r.mes;
		}
		case "synopsis": {
			let e = r.is_user ? void 0 : Nh(r, n.synopsisId);
			return e ? Mh(n.synopsisTemplate, e) : r.mes;
		}
		default: {
			let e = r.mes;
			if (r.is_user) return e;
			let i = t.annotations ? Ah(r)?.annotations : void 0, a = t.speech ? Ah(r)?.speech : void 0;
			return a?.length && (e = Pc(e, a, n.speech?.tag)), i?.length && (e = dc(e, i)), t.echo?.length && n.echoes && (e = Lh(e, r, t.echo, n.echoes)), e;
		}
	}
}
function Lh(e, t, n, r) {
	let i = [];
	return r.rules.forEach((e, r) => {
		if (!n.includes(e.id)) return;
		let a = Ph(t, e.id);
		op(a) && e.pieces.forEach((t, n) => i.push({
			text: cp(t.template, e.kind, a),
			key: t.key,
			rank: t.rank,
			order: r * 16 + n,
			...t.raw ? { raw: !0 } : {}
		}));
	}), i.length ? up(e, r.contentKey, i) : e;
}
function Rh(e, t) {
	let n = [];
	for (let r of Fh(e, t)) {
		let e = Ih(r, r.fresh, t);
		e !== null && n.push({
			item: e === r.item.mes ? r.item : {
				...r.item,
				mes: e
			},
			index: r.index
		});
	}
	return n;
}
function zh(e, t) {
	return Rh(e, t).map((e) => e.item);
}
function Bh(e, t) {
	let n = Object.values(e.structures).find((e) => e.kind === "annotations"), r = n ? ep(n) : 0;
	if (r) return cd(e, t).some((e) => e.structures.includes(n.id)) ? { depth: r } : void 0;
}
function Vh(e, t, n) {
	let r = Object.values(e.structures).find((e) => e.kind === "speech"), i = r ? tp(r) : 0;
	if (i && e.speech && n?.speech?.on) return cd(e, t).some((e) => e.structures.includes(r.id)) ? {
		depth: i,
		tag: r.tag
	} : void 0;
}
function Hh(e) {
	let t = Object.values(e.structures).find((e) => e.kind === "synopsis");
	return {
		synopsisTemplate: e.tokenSaving.synopsisTemplate,
		synopsisId: t?.id
	};
}
function Uh(e, t, n, r) {
	let i = new Set(cd(e, t).flatMap((e) => e.structures)), a = n ? od(n) : void 0, o = [];
	for (let t of Object.values(e.structures)) {
		let e = $f(t);
		if (!e) continue;
		let n = i.has(t.id) && (!e.when || (a ? Bs(e.when, a) : !1));
		o.push({
			id: t.id,
			kind: t.kind,
			depth: e.depth,
			active: n,
			pieces: e.pieces.map((e) => ({
				template: e.template,
				...ip(r, t, e.position),
				...e.raw ? { raw: !0 } : {}
			}))
		});
	}
	return o.length ? {
		rules: o,
		contentKey: rp(r)
	} : void 0;
}
var Wh = (e) => e.replace(/\{\{[^{}]*\}\}/g, "").replace(/\s+/g, "");
function Gh(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length - 1; n++) {
		let r = e.slice(n, n + 2);
		t.set(r, (t.get(r) ?? 0) + 1);
	}
	return t;
}
function Kh(e, t) {
	if (e === t) return 1;
	if (e.length < 2 || t.length < 2) return 0;
	let n = Gh(e), r = Gh(t), i = 0;
	for (let [e, t] of n) i += Math.min(t, r.get(e) ?? 0);
	return 2 * i / (e.length - 1 + (t.length - 1));
}
function qh(e, t, n = .9) {
	let r = Array(e.length).fill(-1), i = t.length - 1, a = 0;
	for (let o = e.length - 1; o >= 0 && i >= 0; o--) {
		let s = e[o], c = Wh(s.text);
		for (let e = i; e >= Math.max(0, i - 3); e--) {
			let l = t[e];
			if (l.role !== s.role) continue;
			let u = Wh(l.text);
			if (c === u || c.includes(u) || Kh(c, u) >= n) {
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
var Jh = 50;
function Yh(e) {
	let t = Nm(e), n = t.userModules ??= [];
	for (let e of n) e.vars ??= [];
	return n;
}
var Xh = () => Math.random().toString(36).slice(2, 8);
function Zh(e) {
	let t = new Set(e), n = Xh();
	for (; t.has(n);) n = Xh();
	return n;
}
function Qh(e, t) {
	let n = e.insertionPoints[0]?.id ?? "";
	return {
		id: Zh(t?.entries.map((e) => e.id) ?? []),
		point: n,
		text: ""
	};
}
function $h(e, t) {
	let n = Yh(e), r = {
		id: Zh(n.map((e) => e.id)),
		name: t,
		enabled: !0,
		entries: [],
		vars: [],
		trigger: sf()
	};
	return e.insertionPoints.length && r.entries.push(Qh(e, r)), n.push(r), q(), n[n.length - 1];
}
function eg(e, t) {
	let n = Yh(e), r = new Set(n.map((e) => e.name)), i = t.name;
	for (let e = 2; r.has(i); e++) i = `${t.name} ${e}`;
	return n.push(Uf(t, Zh(n.map((e) => e.id)), { name: i })), q(), n[n.length - 1];
}
function tg(e, t, n) {
	let r = Yh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0) return;
	let a = {
		...J(r[i]),
		id: Zh(r.map((e) => e.id)),
		name: n(r[i].name)
	};
	return r.splice(i + 1, 0, a), q(), r[i + 1];
}
function ng(e, t) {
	let n = Nm(e);
	n.userModules = (n.userModules ?? []).filter((e) => e.id !== t), q();
}
function rg(e, t, n) {
	let r = Yh(e), i = r.findIndex((e) => e.id === t);
	if (i < 0 || n < 0 || n >= r.length || i === n) return;
	let [a] = r.splice(i, 1);
	r.splice(n, 0, a), q();
}
function ig(e, t) {
	return Rf(J(Yh(e).filter((e) => !t || t.includes(e.id))), e);
}
function ag(e, t) {
	let n = zf(t), r = n.modules;
	n.preset?.id === e.id && n.preset.version && pu(n.preset.version, e.version) < 0 && (r = Df(r, e.migrations, n.preset.version));
	let i = Yh(e), a = r.map((e) => {
		let t = {
			...e,
			id: Zh(i.map((e) => e.id))
		};
		return i.push(t), t;
	});
	return q(), {
		added: a,
		missing: a.filter((t) => bf(e, t).length).length
	};
}
function og(e, t) {
	let n = [];
	for (let t = e.length - 1; t >= 0 && n.length < Jh; t--) {
		let r = e[t];
		!r.is_system && r.mes && n.push(r.mes);
	}
	return {
		input: t >= 0 ? e[t]?.mes ?? "" : "",
		recent: n
	};
}
//#endregion
//#region src/core/debug.ts
var sg = /* @__PURE__ */ fn({
	log: [],
	requests: []
}), cg = 50;
function lg(e, t) {
	sg.log.unshift({
		kind: e,
		at: Date.now(),
		data: t
	}), sg.log.length > cg && (sg.log.length = cg);
}
function ug(e) {
	return sg.requests.unshift(e), sg.requests.length > cg && (sg.requests.length = cg), sg.requests[0];
}
//#endregion
//#region src/core/cache.ts
function dg(e, t = 0) {
	let n = 3735928559 ^ t, r = 1103547991 ^ t;
	for (let t = 0; t < e.length; t++) {
		let i = e.charCodeAt(t);
		n = Math.imul(n ^ i, 2654435761), r = Math.imul(r ^ i, 1597334677);
	}
	return n = Math.imul(n ^ n >>> 16, 2246822507) ^ Math.imul(r ^ r >>> 13, 3266489909), r = Math.imul(r ^ r >>> 16, 2246822507) ^ Math.imul(n ^ n >>> 13, 3266489909), (4294967296 * (2097151 & r) + (n >>> 0)).toString(36);
}
function fg(e, t) {
	return e.send_date ? dg(`${e.send_date}|${e.is_user ? "u" : "a"}|${e.name ?? ""}`) : `#${t}`;
}
var pg = 57344, mg = /⟦([\uE000-\uF8FF])⟧/g, hg = (e) => `⟦${String.fromCharCode(pg + e)}⟧`;
function gg(e) {
	let t = [];
	return {
		text: e.replace(mg, (e, n) => (t.push(n.charCodeAt(0) - pg), "")),
		marks: t
	};
}
function _g(e, t, n, r) {
	let i = [], a = [], o = {};
	for (let s of Fh(e, t)) {
		if (!s.fresh) {
			i.push({
				item: s.item,
				index: s.index
			});
			continue;
		}
		let e = r(s.index), c = s.forced ? void 0 : kh(n?.[e], t.synopsisId), l = c ?? s.fresh, u = Ih(s, s.fresh, t), d = c ? Ih(s, l, t) : u, f = d ?? u;
		f === null ? o[e] = Oh(l) : a.length >= 6400 ? u !== null && i.push({
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
			stickyMode: Oh(l),
			freshMode: Oh(s.fresh)
		}));
	}
	return {
		out: i,
		entries: a,
		omitted: o
	};
}
function vg(e, t, n, r) {
	return !e || e.v !== 1 ? "first" : n.ttlMinutes > 0 && r - e.at > n.ttlMinutes * 6e4 ? "ttl" : e.model === t.model ? e.tools === t.tools ? e.prompt === t.prompt ? null : "prompt" : "tools" : "model";
}
function yg(e, t, n, r, i, a = {}) {
	let o = vg(t, n, r, i), s = 0, c = !1;
	if (!o) {
		let n = t.seq, r = 0;
		s = e.length;
		for (let t = 0; t < e.length; t++) {
			let i = e[t].sticky;
			if (i !== null) {
				if (r < n.length && dg(i) === n[r]) r++;
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
		r !== null && f.push(dg(r));
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
function bg(e, t, n) {
	if (n === null) return null;
	let r = t.replace(/\r/g, ""), i = n.replace(/\r/g, "");
	if (e === r) return i;
	let a = e.endsWith(r) ? e.length - r.length : e.lastIndexOf(r);
	if (!(a < 0)) return e.slice(0, a) + i + e.slice(a + r.length);
}
//#endregion
//#region src/store/cache-state.ts
var xg = "advanced-preset.cache.v1", Sg = 864e5, Cg = 30, wg = null;
function Tg() {
	try {
		return globalThis.localStorage ?? null;
	} catch {
		return null;
	}
}
function Eg() {
	if (wg) return wg;
	try {
		let e = Tg()?.getItem(xg), t = e ? JSON.parse(e) : {};
		wg = t && typeof t == "object" && !Array.isArray(t) ? t : {};
	} catch {
		wg = {};
	}
	return wg;
}
function Dg(e, t) {
	let n = Object.entries(e).filter(([, e]) => e && t - e.at <= Sg).sort((e, t) => t[1].at - e[1].at).slice(0, Cg);
	wg = Object.fromEntries(n);
	try {
		Tg()?.setItem(xg, JSON.stringify(wg));
	} catch {}
}
function Og() {
	let t = e();
	return String(t.getCurrentChatId?.() || `${t.characterId ?? ""}|${t.groupId ?? ""}`);
}
var kg = (e, t) => t ? `${e}\u0001${t}` : e;
function Ag(e) {
	return Eg()[e];
}
function jg(e, t) {
	Dg({
		...Eg(),
		[e]: t
	}, t.at);
}
function Mg(e, t) {
	let n = Eg()[e];
	n && jg(e, {
		...n,
		at: t
	});
}
function Ng(e, t) {
	let n = Eg(), r = (t) => kg(e, t);
	if (!t.some(([e, t]) => r(e) in n || r(t) in n)) return;
	let i = { ...n };
	for (let [e, n] of t) delete i[r(e)], delete i[r(n)];
	for (let [e, a] of t) n[r(e)] && (i[r(a)] = n[r(e)]);
	Dg(i, Date.now());
}
//#endregion
//#region src/core/input-shaping.ts
var Pg = "⟦󰀀⟧", Fg = "⟦󰀁⟧", Ig = /(?:⟦[\uE000-\uF8FF]⟧)+$/;
function Lg(e) {
	let t = e.match(Ig)?.[0] ?? "";
	return e.slice(0, e.length - t.length) + Pg + t;
}
var Rg = (e) => e.replaceAll(Pg, "");
function zg(e) {
	for (let t of e) if (typeof t.content == "string") t.content.includes("⟦󰀀⟧") && (t.content = Rg(t.content));
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && typeof e.text == "string" && e.text.includes("⟦󰀀⟧") && (e.text = Rg(e.text));
}
function Bg(e, t, n, r) {
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
			let n = t.lastIndexOf(Pg);
			if (n < 0) continue;
			let a = Rg(t.slice(0, n)).replace(Ig, ""), o = i.find((e) => a.endsWith(e));
			return o === void 0 ? null : {
				index: r,
				part: e,
				before: a.slice(0, a.length - o.length),
				text: o,
				after: Rg(t.slice(n + 4))
			};
		}
	}
	return null;
}
var Vg = (e, t) => {
	let n = e.trim();
	return !t.trim() && (!n || /^[^\n]*:$/.test(n));
};
function Hg(e, t, n, r) {
	let i = e[t.index], a = n.mode === "wrap" ? Jf(n.template, t.text, r) : "";
	if (t.part < 0) {
		if (n.mode === "extract" && Vg(t.before, t.after)) {
			e.splice(t.index, 1);
			return;
		}
		i.content = n.mode === "extract" ? (t.before.trimEnd() + t.after).trim() : t.before + a + t.after;
		return;
	}
	let o = i.content.map((e) => e && typeof e == "object" ? { ...e } : e);
	if (n.mode === "wrap") o[t.part].text = t.before + a + t.after;
	else if (Vg(t.before, t.after)) {
		if (o.splice(t.part, 1), !o.filter((e) => !(e && typeof e == "object" && e.type === "text" && !String(e.text ?? "").trim())).length) {
			e.splice(t.index, 1);
			return;
		}
	} else o[t.part].text = (t.before.trimEnd() + t.after).trim();
	i.content = o;
}
//#endregion
//#region src/core/transports/tool-args.ts
var Ug = "stream_function_call_arguments";
function Wg(e, t, n) {
	if (e === "off" || t !== "gemini") return !1;
	if (e === "on") return !0;
	let r = String(n.chat_completion_source ?? "");
	return r === "vertexai" || r === "custom" || r === "makersuite" && !!String(n.reverse_proxy ?? "").trim();
}
function Gg(e) {
	if (e === "none") return { mode: "NONE" };
	if (e === "required") return { mode: "ANY" };
	let t = e?.function?.name;
	return typeof t == "string" && t ? {
		mode: "ANY",
		allowedFunctionNames: [t]
	} : { mode: "AUTO" };
}
function Kg(e) {
	e.stream && Array.isArray(e.tools) && e.tools.length && (e[Ug] = !0, t() && qg(e));
}
function qg(e) {
	let t = Jg(e.custom_include_body);
	t ? "toolConfig" in t || (t.toolConfig = { functionCallingConfig: {
		...Gg(e.tool_choice),
		streamFunctionCallArguments: !0
	} }, e.custom_include_body = JSON.stringify(t)) : console.info("[AP] Additional Parameters are not a JSON object; Gemini tool arguments will not stream");
}
function Jg(e) {
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
var Yg = "google-gemini-v1", Xg = /* @__PURE__ */ new WeakSet(), Zg = /* @__PURE__ */ new WeakSet();
function Qg(e) {
	return Xg.add(e), e;
}
function $g(e, t) {
	if (t !== "gemini" && !(t === "openai" && e.config.connection.openAiSignatures)) return;
	let n = e.config.connection.syntheticTurn, r = n ? e.preset.syntheticTurns.find((e) => e.id === n) : void 0;
	return r ? vu(r, _u(e.config.connection)) : void 0;
}
function e_(e) {
	return Zg.add(e), e;
}
function t_(e, t) {
	return !e.signatureFallback && (e.transport === "tool-single" || e.transport === "tool-multi") && !!$g(e, t);
}
function n_(e) {
	let { message: t = "", body: n = "" } = e ?? {};
	return /thought[\s_-]?signature/i.test(`${t}\n${n}`);
}
function r_(e, t, n = {}) {
	return t !== "gemini" && !(t === "openai" && n.openAi) ? e : e.map((e) => e.role !== "assistant" || !Array.isArray(e.tool_calls) || !e.tool_calls.length ? e : t === "gemini" ? a_(e, !!n.fallback) : Xg.has(e) ? o_(e, !!n.fallback, n.source === "openrouter") : e);
}
var i_ = (e, t) => t && Zg.has(e) || typeof e.signature != "string" || !e.signature ? void 0 : e.signature;
function a_(e, t) {
	let n = e.tool_calls;
	return n.every((e) => i_(e, t)) ? e : {
		...e,
		tool_calls: n.map((e) => ({
			...e,
			signature: i_(e, t) ?? "skip_thought_signature_validator"
		}))
	};
}
function o_(e, t, n) {
	let r = Array.isArray(e.reasoning_details) ? [...e.reasoning_details] : [], i = e.tool_calls.map((e) => {
		let i = i_(e, t), { signature: a, ...o } = e;
		return i ? (r.push({
			type: "reasoning.encrypted",
			data: i,
			id: e.id,
			format: Yg,
			index: r.length
		}), n ? o : {
			...o,
			extra_content: {
				...o.extra_content,
				google: {
					...o.extra_content?.google,
					thought_signature: i
				}
			}
		}) : o;
	});
	return {
		...e,
		tool_calls: i,
		...r.length ? { reasoning_details: r } : {}
	};
}
//#endregion
//#region src/core/transports/base.ts
function s_(e) {
	let t = /* @__PURE__ */ new Set([e.tools.submit.name, ...e.syntheticTurns.map((e) => e.tool.name)]);
	for (let n of e.workflows) {
		let r = [n.stages, n.stages.filter((e) => !e.when)];
		for (let i of r) for (let r of vl(e.tools, n, i, []).toolNames()) t.add(r);
	}
	return t;
}
function c_(t) {
	return (n) => {
		let r = t.assembly ? t.assembly.expand(n) : n;
		try {
			return e().substituteParams(r);
		} catch {
			return r;
		}
	};
}
function l_(e) {
	return vl(e.preset.tools, e.workflow, e.stages, e.structures, c_(e));
}
function u_(e) {
	let t = e.preset.tools.envelope.when;
	return !t || !e.assembly || Bs(t, e.assembly.resolve);
}
function d_(e) {
	let { preset: t, config: n, assembly: r } = e, i = {};
	for (let [e, a] of Object.entries(t.actors)) {
		let o = n.identity.prefixes[e] || a.prefix || `${dd(t, n, e)}: `;
		i[e] = r ? r.expand(o) : o;
	}
	return i;
}
function f_(e, t, n) {
	let r = sl(t, {
		submit: e.preset.tools.submit.name,
		next: n.next ?? "",
		first: n.first ?? "",
		name: n.name ?? ""
	});
	return c_(e)(r);
}
function p_(e, t, n) {
	let { ctx: r, family: i } = e, a = r.config.connection.syntheticTurn, o = a ? r.preset.syntheticTurns.find((e) => e.id === a) : void 0;
	if (!o) return null;
	let s = `call_${o.id}_init`, c = $g(r, i), l = {
		id: s,
		type: "function",
		function: {
			name: o.tool.name,
			arguments: "{}"
		},
		...c ? { signature: c } : {}
	};
	c && e_(l);
	let u = c_(r), d = u(o.tool.description);
	return {
		tool: {
			type: "function",
			function: {
				name: o.tool.name,
				...d ? { description: d } : {},
				parameters: {
					type: "object",
					properties: {}
				}
			}
		},
		messages: [
			{
				role: "user",
				content: u(o.user)
			},
			Qg({
				role: "assistant",
				content: "",
				tool_calls: [l]
			}),
			{
				role: "tool",
				tool_call_id: s,
				content: f_(r, o.response[t], { first: n })
			}
		]
	};
}
function m_(e, t = {}) {
	let n = {
		...e.base,
		messages: e.messages
	};
	delete n.tools, delete n.tool_choice, delete n.json_schema, e.caller.tools.length && (n.tools = e.caller.tools, n.tool_choice = e.caller.toolChoice ?? "auto"), Object.assign(n, t);
	let r = String(n.chat_completion_source ?? "");
	return Array.isArray(n.messages) && (n.messages = r_(n.messages, e.family, {
		fallback: e.ctx.signatureFallback,
		source: r,
		openAi: e.ctx.config.connection.openAiSignatures
	})), e.family === "gemini" && h_(n, e.ctx.preset.tools.jsonStringHint), Wg(e.ctx.config.connection.streamToolArguments, e.family, n) && Kg(n), n;
}
function h_(e, t) {
	let n = { jsonStringHint: t };
	Array.isArray(e.tools) && (e.tools = Ed(e.tools, n)), e.json_schema?.value && (e.json_schema = {
		...e.json_schema,
		value: wd(e.json_schema.value, n)
	});
}
function g_(e, t) {
	if (!t.tools.length) return [];
	let n = new Set(t.tools.map((e) => e?.function?.name));
	return e.toolCalls.filter((e) => e.name && n.has(e.name));
}
//#endregion
//#region src/core/sticky.ts
var __ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "", v_ = (e) => e === null ? null : (typeof e == "string" ? e : JSON.stringify(e)).replaceAll(Pg, ""), y_ = (e) => typeof e == "string" && e.includes("⟦") && new RegExp(mg.source).test(e);
function b_(e) {
	for (let t of e) if (typeof t.content == "string") y_(t.content) && (t.content = gg(t.content).text);
	else if (Array.isArray(t.content)) for (let e of t.content) e && typeof e == "object" && y_(e.text) && (e.text = gg(e.text).text);
}
function x_(e) {
	if (typeof e.content == "string") {
		if (!y_(e.content)) return null;
		let { text: t, marks: n } = gg(e.content);
		return {
			mark: n[0],
			clean: t,
			swap: (e, n) => bg(t, e, n)
		};
	}
	if (!Array.isArray(e.content)) return null;
	let t = e.content.map((e) => e && typeof e == "object" ? { ...e } : e), n = -1, r = -1;
	return t.forEach((e, t) => {
		if (!e || typeof e != "object" || !y_(e.text)) return;
		let i = gg(e.text);
		e.text = i.text, n < 0 && (n = i.marks[0], r = t);
	}), n < 0 ? null : {
		mark: n,
		clean: t,
		swap: (e, n) => {
			let i = bg(t[r].text, e, n);
			return i == null ? i : t.map((e, t) => t === r ? {
				...e,
				text: i
			} : e);
		}
	};
}
function S_(e) {
	if (!e.workflow) return "";
	let t = e.config.connection, n = null;
	try {
		let t = l_(e);
		n = e.transport === "structured" ? t.schema() : e.transport === "tool-single" ? t.submitTool() : e.transport === "tool-multi" ? t.stageTools() : null;
	} catch {
		n = null;
	}
	let r = e.transport === "tool-single" || e.transport === "tool-multi";
	return dg(JSON.stringify({
		transport: e.transport,
		shape: n,
		...r ? {
			force: t.forceTool,
			parallel: t.parallelTools,
			synthetic: t.syntheticTurn
		} : {}
	}));
}
function C_(e) {
	return dg(e.map((e) => `${e.role}\u0000${__(e.content)}`).join(""));
}
function w_(e, t, n, r, i = Date.now()) {
	let o = e.sticky;
	if (e.sticky = void 0, !o || n < 0) return b_(t), null;
	let s = e.config.cache, c = [], l = [], u = /* @__PURE__ */ new Set(), d = 0;
	for (let e = 0; e < t.length; e++) {
		let i = t[e], a = x_(i);
		if (a && (i.content = a.clean), e < n || e >= r) continue;
		let s = a && !u.has(a.mark) ? o.entries[a.mark] : void 0;
		if (!a || !s) {
			if (i.role === "user" || i.role === "assistant" || i.role === "system" || i.role === "tool") {
				let t = v_(i.content);
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
			let t = s.sticky === s.given ? s.stickyMode : s.freshMode, n = v_(i.content);
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
			sticky: v_(f),
			fresh: v_(p),
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
		tools: S_(e),
		prompt: C_(t.slice(0, n))
	}, p = yg(l, Ag(o.chat), f, s, i, o.omitted), m = 0, h = 0;
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
function T_(e, t = Date.now()) {
	let n = e.cacheCommit;
	n && (e.cacheCommit = void 0, n.touch ? Mg(n.chat, t) : jg(n.chat, {
		...n.next,
		at: t
	}));
}
//#endregion
//#region src/store/storylines.ts
var E_ = "advanced_preset", D_ = (e, t) => !!e?.storylines && t?.storylines?.enabled !== !1;
function O_() {
	let t = e().chatMetadata?.[E_]?.storylines;
	return t && typeof t == "object" ? t : {};
}
function k_(t) {
	let n = e().chatMetadata;
	if (!n) return;
	let r = n[E_] ??= {};
	r.storylines = t;
}
function A_(t = e().chat, n = O_()) {
	return Up(t, n).map((e) => Wp(e, n));
}
function j_(t = e().chat, n = O_()) {
	let r = new Set(A_(t, n).filter((e) => e !== "" && !Vp(e)));
	n.main && r.add(n.main);
	for (let e of [...Object.keys(n.if ?? {}), ...Object.keys(n.hidden ?? {})]) r.add(e);
	return r;
}
function M_(t, n = e().chat, r = O_()) {
	let i = A_(n, r);
	return Jp(i, t ?? i.at(-1) ?? "", r).order;
}
function N_(t, n) {
	let r = e().chat[t];
	r?.is_user && r.mes !== n && (r.mes = n, e().updateMessageBlock(t, r));
}
function P_(t, n) {
	let r = e().chat[t];
	if (!r || r.is_user) return;
	r.extra ??= {}, r.extra[Rp] = n;
	let i = r.swipe_info?.[r.swipe_id ?? 0];
	i && (i.extra ??= {}, i.extra[Rp] = n);
}
async function F_(t, n) {
	if (!t) return;
	let r = O_();
	k_({
		...r,
		if: {
			...r.if ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
async function I_(t) {
	let n = O_();
	return !Xu(t) || A_(e().chat, n).includes(t) ? !1 : (k_({
		...n,
		main: t
	}), await e().saveMetadata(), !0);
}
async function L_(t, n) {
	if (!t) return await I_(n) ? "renamed" : Xu(n) ? "taken" : "invalid";
	if (!Xu(n)) return "invalid";
	if (n === t) return "unchanged";
	let r = O_();
	if (n === r.main || A_(e().chat, r).includes(n)) return "taken";
	let i = e().chat, a = [];
	i.forEach((e, r) => {
		if (e.is_user) {
			let i = Zu(e.mes);
			if (i?.form !== "name" || i.name !== t) return;
			e.mes = ed(e.mes, i, n), a.push(r);
		} else e.swipe_info?.forEach((e) => {
			e?.extra?.advanced_preset_storyline === t && (e.extra[Rp] = n);
		}), e.extra?.advanced_preset_storyline === t && (e.extra[Rp] = n);
	});
	let o = Gp(t, r), s = Kp(t, r), c = { ...r.if ?? {} }, l = { ...r.hidden ?? {} };
	delete c[t], delete l[t], o === id(n) ? delete c[n] : c[n] = o, s === o ? delete l[n] : l[n] = s;
	let u = {
		...r,
		if: c,
		hidden: l
	};
	Object.keys(c).length || delete u.if, Object.keys(l).length || delete u.hidden, k_(u), Ng(Og(), [[t, n]]);
	for (let t of a) e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "renamed";
}
async function R_(t, n) {
	if (!t) return;
	let r = O_();
	k_({
		...r,
		hidden: {
			...r.hidden ?? {},
			[t]: n
		}
	}), await e().saveMetadata();
}
function z_(e, t) {
	if (!e) return;
	let n = O_(), r = { ...n };
	t.ifLine !== void 0 && (t.ifLine || id(e)) && (r.if = {
		...n.if ?? {},
		[e]: t.ifLine
	}), t.hide && (r.hidden = {
		...n.hidden ?? {},
		[e]: !0
	}), k_(r);
}
function B_(t) {
	let n = e().chat[t];
	n?.is_user && (n.extra ??= {}, n.extra[zp] = !0);
}
async function V_(t, n) {
	let r = O_();
	if (!Xu(t)) return "invalid";
	if (Wp(t, r) === "") return "unchanged";
	let i = e().chat, a = Up(i, r).map((e) => Wp(e, r)), o = n ?? r.main ?? "";
	if (a.some((e, t) => e === "" && !i[t].is_system) && !o) return "needs-name";
	if (o && (!Xu(o) || o === t)) return "invalid";
	if (o && o !== r.main && a.includes(o)) return "taken";
	let s = [];
	o && i.forEach((e, t) => {
		if (e.is_user) {
			if (a[t] !== "") return;
			e.mes = $u(e.mes, o), s.push(t);
			return;
		}
		if (e.is_system && !(e.extra && "advanced_preset_storyline" in e.extra)) return;
		let n = t > 0 ? a[t - 1] : "", i = (e) => (typeof e == "string" ? Wp(e, r) : n) === "", c = !1;
		e.swipe_info?.forEach((e) => {
			e && i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Rp] = o, c = !0);
		}), i(e.extra?.advanced_preset_storyline) && (e.extra ??= {}, e.extra[Rp] = o, c = !0), c && s.push(t);
	});
	let c = { ...r.if ?? {} };
	o && Gp(o, {
		...r,
		if: c
	}) && (c[o] = !1), delete c[t];
	let l = { ...r.hidden ?? {} };
	o && delete l[o], delete l[t], k_({
		...r,
		main: t,
		if: c,
		...Object.keys(l).length || r.hidden ? { hidden: l } : {}
	}), Ng(Og(), o ? [["", o], [t, ""]] : [[t, ""]]);
	for (let t of s) i[t].is_user && e().updateMessageBlock(t, i[t]);
	return await e().saveChat(), "switched";
}
//#endregion
//#region src/core/media-vars.ts
var H_ = {
	image: () => ({
		vars: { ...mc },
		refs: []
	}),
	speech: () => ({
		vars: { ...hc },
		format: "",
		characters: []
	})
}, U_ = {};
function W_(e) {
	U_ = {
		...U_,
		...e
	};
}
function G_() {
	return {
		image: U_.image ?? H_.image,
		speech: U_.speech ?? H_.speech
	};
}
var K_ = (e, t, n) => {
	try {
		return e();
	} catch (e) {
		return console.error(`[AP] ${n} runtime failed`, e), t();
	}
};
function q_(e) {
	if (!e.image) return H_.image();
	let t = K_(() => G_().image(), H_.image, "image");
	if (!t.vars.on) return {
		vars: { ...mc },
		refs: []
	};
	let n = t.vars.api === "novelai" ? [] : t.refs;
	return {
		vars: {
			...t.vars,
			refs: n.length > 0
		},
		refs: n
	};
}
function J_(e) {
	if (!e.speech) return H_.speech();
	let t = K_(() => G_().speech(), H_.speech, "speech");
	if (!t.vars.on) return {
		vars: { ...hc },
		format: "",
		characters: []
	};
	let n = [...new Set(t.characters.map((e) => e.trim()).filter(Boolean))];
	return {
		...t,
		characters: n,
		vars: {
			...t.vars,
			characters: n.length > 0
		}
	};
}
//#endregion
//#region src/core/assembler.ts
var Y_ = /⟦ap:region:([\w.-]+)⟧/g, X_ = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map((e) => typeof e == "string" ? e : e?.text ?? "").join("") : "";
function Z_(e) {
	let t = [];
	for (let n of e) {
		let e = typeof n.content == "string" ? n.content : "";
		if (!e.includes("⟦ap:region:")) {
			t.push(n);
			continue;
		}
		let r = 0;
		for (let i of e.matchAll(Y_)) {
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
function Q_(t, n, r) {
	if (!vh(n)) return "";
	let i = Object.values(t.structures).find((e) => e.kind === "reply")?.id, a = [], o = dd(t, n, t.user), s = dd(t, n, t.narrator);
	for (let e = r.length - 1; e >= 0 && a.length < n.meta.recentCount; e--) {
		let t = cm(r[e]);
		if (!t?.metaInput?.length) continue;
		let n = i ? t.structures?.[i] : void 0, c = typeof n == "string" ? Zc(n) : "";
		a.push(`${o}: ${t.metaInput.join("\n")}${c ? `\n${s}: ${c}` : ""}`);
	}
	return e().substituteParams(a.reverse().join("\n\n"));
}
function $_(e, t) {
	let n = {}, r = Object.values(e.structures).filter((e) => e.kind === "custom" || e.kind === "status");
	if (!r.length) return n;
	for (let e of t) {
		let t = cm(e);
		for (let e of r) {
			let r = t?.structures?.[e.id];
			if (r != null && r !== "") {
				if (e.kind === "status") {
					let t = typeof r == "string" ? r : Kc(r);
					t && (n[e.id] = t);
				} else n[e.id] = typeof r == "string" ? r : JSON.stringify(r, null, 2);
			}
		}
	}
	return n;
}
var ev = (e) => e?.view;
function tv(t, n) {
	let { preset: r, config: i } = t, a = ev(t.storylines), o = e().chat, s = a ? a.map((e) => o[e]) : o, c = $_(r, s), l = bm(Infinity, a), u = Cm(Nm(r)), d = xm(Infinity, a), f = Q_(r, i, s), p = D_(r, i) ? O_().main ?? "" : "", m = t.transport, h = t.origin === "story", g = q_(h ? r : {}), _ = J_(h ? r : {});
	return {
		vars: yd(r, i, {
			transport: m,
			style: r.styles[m],
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
				recent: !!f
			},
			flags: {
				...Object.fromEntries(r.regex.map((e) => [e.id, !1])),
				...t.flags
			},
			chat: { group: !!e().groupId },
			memory: {
				hasChat: Object.keys(l).length > 0,
				hasGlobal: Object.keys(u).length > 0
			},
			recap: { present: !!d },
			input: { shaped: !!t.inputShaped },
			last: Object.fromEntries(Object.values(r.structures).filter((e) => e.kind === "custom" || e.kind === "status").map((e) => [e.id, e.id in c])),
			storyline: t.storylines?.vars ?? {
				...Ju,
				name: p
			},
			image: g.vars,
			speech: _.vars
		}),
		data: {
			metaText: t.meta.segments.join("\n\n"),
			memory: {
				chat: l,
				global: u
			},
			recap: d?.text ?? "",
			recentMeta: f,
			customLast: c,
			inputText: t.inputShaped ? Fg : "",
			storyline: {
				name: t.storylines?.vars.name ?? p,
				main: t.storylines?.mainName ?? p
			},
			image: { refs: g.refs },
			speech: {
				format: _.format,
				characters: _.characters
			}
		}
	};
}
function nv(t, n, r) {
	let { preset: i, config: a } = t, o = n.findIndex((e) => e.__anchor === i.anchors.historyStart), s = n.findIndex((e) => e.__anchor === i.anchors.historyEnd);
	if (o < 0 || s < 0 || s <= o) {
		t.warnings.push("backfill: semantic anchors missing");
		return;
	}
	let c = n.slice(o + 1, s).map((e, t) => ({
		m: e,
		i: o + 1 + t
	})).filter(({ m: e }) => e.role === "user" || e.role === "assistant"), l = e().chat, u = l.map((e, t) => ({
		m: e,
		index: t
	})).filter(({ m: e }) => !e.is_system), { map: d, rate: f } = qh(c.map(({ m: e }) => ({
		role: e.role,
		text: X_(e.content)
	})), u.map(({ m: e }) => ({
		role: e.is_user ? "user" : "assistant",
		text: e.mes
	})));
	if (f < .9) {
		t.warnings.push(`backfill: alignment ${Math.round(f * 100)}% < 90%, history left as is`);
		return;
	}
	let p = [];
	d.forEach((e, t) => {
		if (e < 0) return;
		let n = u[e];
		p.push({
			is_user: n.m.is_user,
			mes: X_(c[t].m.content),
			extra: n.m.extra,
			name: n.m.name,
			send_date: n.m.send_date,
			__h: t
		});
	});
	let m = p.map((e) => u[d[e.__h]].index), h = [];
	if (D_(i, a)) {
		let e = im(p, m, Zp(l, -1, O_()), -1, Ku(a.storylines));
		p = e.items, m = e.realIndex, h = e.groups, t.storylines = e.turn;
	}
	let g = t.storylines, _ = tv(t, xh(i, a, t.origin)).vars, v = {
		trigger: yh(i, a),
		wrap: i.meta.wrap,
		tokenSaving: a.tokenSaving,
		...Hh(i),
		echoes: Uh(i, a, _, xh(i, a, "story")),
		recap: xm(Infinity, ev(g)),
		realIndex: (e) => m[e] ?? -1,
		currentInput: -1,
		annotations: Bh(i, a),
		speech: Vh(i, a, _),
		...g ? { background: (e) => am(g, h[e]) } : {}
	}, y = /* @__PURE__ */ new Map(), b = /* @__PURE__ */ new Map();
	if (a.cache?.enabled) {
		let e = kg(Og(), g?.current), n = _g(p, v, Ag(e)?.modes, (e) => fg(p[e], m[e] ?? e));
		for (let e of n.out) {
			let t = p[e.index].__h;
			y.set(t, e.entry === void 0 ? e.item.mes : e.item.mes + hg(e.entry));
			let r = e.entry === void 0 ? void 0 : n.entries[e.entry];
			b.set(t, r ? [
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
	} else for (let e of zh(p, v)) y.set(e.__h, e.mes), b.set(e.__h, [e.mes]);
	if (i.inputShaping && u.length && u[u.length - 1].m.is_user) {
		let e = d.indexOf(u.length - 1), n = b.get(e);
		e >= 0 && y.has(e) && n?.some((e) => e.trim()) && !c.slice(e + 1).some(({ m: e }) => e.role === "user") && (y.set(e, Lg(y.get(e))), t.input = { texts: n });
	}
	let x = /* @__PURE__ */ new Set(), S = new Set(p.map((e) => e.__h));
	d.forEach((e, t) => {
		e >= 0 && !S.has(t) && x.add(c[t].i);
	}), p.forEach((e, t) => {
		let n = c[e.__h];
		y.has(e.__h) ? (n.m.content = y.get(e.__h), g?.grouped && h[t] !== void 0 && r.set(n.m, h[t])) : x.add(n.i);
	});
	for (let e of [...x].sort((e, t) => t - e)) n.splice(e, 1);
}
function rv(t, n) {
	let r = n ? null : Dh.takePending();
	if (r && r.preset.id === t.id) return r;
	let i = Im(t), a = e().chat, o = a.findLastIndex((e) => e.is_user && !e.is_system), s = a[o], { meta: c, flags: l, origin: u } = bh(t, i, n ? s?.mes ?? "" : "", n ? "normal" : "script", n, [], !n);
	return {
		id: Ch(),
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
		keywords: og(a, n ? o : -1)
	};
}
var iv = Symbol("ap-region");
function av(e, t) {
	let n = t.findIndex((t) => t.__anchor === e.anchors.historyStart), r = t.findIndex((t) => t.__anchor === e.anchors.historyEnd);
	return {
		from: n < 0 ? 0 : n + 1,
		to: r < 0 || r <= n ? t.length : r
	};
}
function ov(t, n, r, i, a) {
	let o = t.preset.inputShaping, s = o && t.inputShaped && t.input ? Bg(n, r < 0 ? 0 : r, i, t.input.texts) : null;
	if (zg(n), !o) return;
	let c = s?.text ?? "";
	t.inputShaped && !s && t.warnings.push("input shaping: the input message changed after the cache step, sent as is");
	let l = o.mode !== "extract" || n.some((e) => typeof e.content == "string" ? e.content.includes(Fg) : Array.isArray(e.content) && e.content.some((e) => typeof e?.text == "string" && e.text.includes("⟦󰀁⟧")));
	if (s && !l && t.warnings.push("input shaping: {{ap::input::text}} is not in the prompt, the input was left in the history"), s && l) {
		let r = t.assembly;
		Hg(n, s, o, (t) => e().substituteParams(r ? r.expand(t) : t));
	}
	if (t.inputShaped) {
		let e = (e) => e.includes("⟦󰀁⟧") ? e.replaceAll(Fg, () => c) : e;
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
function sv(t, n, r, i, a) {
	let o = t.preset.storylines, s = t.assembly, c = (t) => e().substituteParams(s ? s.expand(t) : t), l = String(e().chatCompletionSettings?.send_if_empty ?? "").trim(), u = r[a - 1], d = !!e().groupId;
	return rm(r, i, a, {
		groupOf: (e) => n.marks?.get(e) ?? -1,
		current: n.currentGroup,
		main: n.mainGroup,
		separator: (e) => {
			let t = n.groups[e];
			if (!o || !t) return null;
			let r = ad(t.main ? o.mainSeparator : o.separator, t.name || (t.main ? "" : "?"), c);
			if (!r.trim()) return null;
			let i = {
				role: "system",
				content: r
			};
			return Object.defineProperty(i, iv, { value: !0 }), i;
		},
		isNudge: (e) => e.role === "user" && l !== "" && X_(e.content).trim() === l || d && e.role === "system" && e === u
	});
}
function cv(t, n, r) {
	let { preset: i, config: a } = t, o = (t) => e().substituteParams(t), s = n.slice(0, r).map((e) => X_(e.content)).filter(Boolean).join("\n\n"), c = a.identity.prefixes[i.user] || i.actors[i.user]?.prefix || `${dd(i, a, i.user)}: `, l = o(t.assembly ? t.assembly.expand(c) : c), u = n.slice(r).map((t) => {
		let n = X_(t.content);
		if (t[iv] || t.role === "system") return n;
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
var lv = /* @__PURE__ */ new Set();
function uv(e, t) {
	for (let n of e) t.push(n), console.warn("[AP]", n), !lv.has(n) && (lv.add(n), x("warning", Y("warn.template", { error: n }), Y("app.name")));
}
function dv(e) {
	let t = (e) => (typeof e.content == "string" ? e.content : JSON.stringify(e.content ?? "")).includes(Pd);
	for (let n = e.length - 1; n >= 0; n--) t(e[n]) && e.splice(n, 1);
}
async function fv(t) {
	let { chat: n, dryRun: r } = t;
	if (dv(n), !K().enabled || !n.some((e) => typeof e.content == "string" && e.content.includes("⟦ap:region:"))) {
		b_(n), zg(n), om(n), r || (Dh.setPending(null), Dh.takeArmed());
		return;
	}
	let i = rh(), a = i ? wp(i) : void 0;
	if (!a) {
		let e = Z_(n).filter((e) => !e.__anchor);
		b_(e), zg(e), om(e), n.splice(0, n.length, ...e);
		return;
	}
	let o = rv(a, r), s = Z_(n), c = om(s);
	!o.interceptorRan && !r && nv(o, s, c), o.storylines && (o.storylines.marks = c);
	let l = o.stType === "continue" || o.stType === "impersonate", u = l ? void 0 : xh(a, o.config, o.origin), d = a.inputShaping, f = av(a, s), p = d && o.input ? Bg(s, f.from, f.to, o.input.texts) : null;
	d && o.input && !p && o.warnings.push("input shaping: the input message was not found in the history, sent as is"), o.inputShaped = !!p;
	let { vars: m, data: h } = tv(o, u), g = Cf(a, Yh(a), o.keywords);
	for (let e of g.skipped) o.warnings.push(`user module ${e.module}: insertion point \`${e.point}\` is missing, entry ${e.entry} skipped`);
	let _ = vd({
		preset: g.preset,
		config: o.config,
		vars: m,
		data: h
	}, u);
	_.warnings.length && uv(_.warnings, o.warnings), o.workflow = u, o.assembly = _, o.stages = _.stages, o.structures = o.origin === "task" && o.stType === "script" ? [] : _.structures;
	let v = (t) => e().substituteParams(t), y = [], b = -1, x = -1, S = {
		genId: o.id,
		at: Date.now(),
		dryRun: r,
		origin: o.origin,
		transport: o.transport,
		workflow: u?.id ?? "",
		modules: _.modules.map((e) => e.id),
		regions: [],
		warnings: o.warnings,
		vars: Object.entries(_.buildVars).map(([e, t]) => ({
			id: e,
			text: Hu(t)
		}))
	};
	for (let e of s) {
		if (!e.__anchor) {
			y.push(e);
			continue;
		}
		let t = e.__anchor;
		t === a.anchors.historyEnd && x < 0 && (x = y.length);
		let n = (_.regions[t] ?? []).map((e) => {
			let t = {
				role: e.role,
				content: v(e.content)
			};
			return Object.defineProperty(t, iv, { value: !0 }), t;
		}).filter((e) => X_(e.content).trim());
		S.regions.push({
			id: t,
			messages: n.map((e) => ({
				role: e.role,
				chars: X_(e.content).length,
				content: X_(e.content)
			}))
		}), y.push(...n), t === a.anchors.historyStart && (b = y.length);
	}
	let ee = new Set(s.map((e) => e.__anchor).filter(Boolean));
	for (let [e, t] of Object.entries(_.regions)) !ee.has(e) && t.some((e) => e.content.trim()) && o.warnings.push(`region ${e}: its anchor is not in the prompt (Carrier outdated or prompt disabled?), content dropped`);
	let C = x < 0 ? y.length : x, w = o.storylines;
	w && (S.storyline = {
		...w.vars,
		groups: w.groups.map((e) => e.main ? `(main) ${e.name}` : `${e.if ? "(if) " : ""}${e.hidden ? "(hidden) " : ""}${e.name || "?"}`),
		hidden: w.hidden,
		grouped: w.grouped
	}, w.grouped && b >= 0 && (C = sv(o, w, y, b, C))), S.cache = w_(o, y, b, C), S.input = ov(o, y, b, C, S);
	let te = o.transport === "prefill" && !l && b >= 0 ? cv(o, y, b) : y;
	n.splice(0, n.length, ...te.map((e) => {
		let { __anchor: t, ...n } = e;
		return n;
	})), lg("assembly", S), !r && !l && u && Dh.arm(o);
}
//#endregion
//#region src/app/variable-guard.ts
var pv = {
	commandParsed: "mag_command_parsed",
	updateEnded: "mag_variable_update_ended"
}, mv = (e) => typeof e == "object" && !!e && !Array.isArray(e), hv = (e, t) => D_(e, t) ? Ku(t?.storylines) : "off";
function gv() {
	let e = rh(), t = e ? wp(e) : void 0;
	return t ? hv(t, Im(t)) : "off";
}
function _v(e, t) {
	if (typeof e != "string" || !e) return -1;
	for (let n = t.length - 1; n >= 0; n--) if (t[n].mes === e) return n;
	if (e.length >= 40) {
		for (let n = t.length - 1; n >= 0; n--) if (t[n].mes.includes(e)) return n;
	}
	return -1;
}
var vv = (e) => !!(wv?.open && e >= wv.from);
function yv(t, n = e().chat) {
	let r = _v(t, n);
	return r < 0 ? null : vv(r) ? wv.line : A_(n)[r];
}
function bv(t, n, r = e().chat) {
	if (n === "off") return !1;
	let i = _v(t, r);
	if (i < 0 || vv(i)) return !!(wv?.open && wv.frozen);
	let a = A_(r)[i];
	return qu(n, {
		main: a === "",
		if: Gp(a, O_())
	});
}
var xv = /* @__PURE__ */ new WeakSet();
function Sv(e, t, n) {
	mv(e) && Array.isArray(t) && bv(n, gv()) && (t.length && lg("variables", {
		frozen: "mvu",
		storyline: yv(n) ?? wv?.line,
		commands: t.length
	}), t.splice(0, t.length), xv.add(e));
}
function Cv(e, t) {
	mv(e) && xv.has(e) && (xv.delete(e), mv(t) && "stat_data" in t && (e.stat_data = J(t.stat_data)), e.delta_data = {});
}
var wv = null;
function Tv(e) {
	let t = e?.variables;
	if (!t || typeof t != "object") return;
	let n = t[e.swipe_id ?? 0];
	return mv(n) ? n : void 0;
}
var Ev = /* @__PURE__ */ new Set(["display_data", "delta_data"]), Dv = (e, t) => {
	let n = (e) => JSON.stringify(Object.fromEntries(Object.entries(e ?? {}).filter(([e]) => !Ev.has(e)).sort(([e], [t]) => e < t ? -1 : 1)));
	return n(e) === n(t);
};
function Ov(t) {
	wv = null, t.line !== void 0 && (wv = {
		chatId: String(e().getCurrentChatId?.() ?? ""),
		line: t.line,
		frozen: t.frozen,
		from: Math.max(0, t.from),
		chatVars: t.frozen ? J(e().chatMetadata?.variables) : void 0,
		open: !0
	});
}
async function kv() {
	let t = wv;
	if (!t?.frozen) return !1;
	let n = e();
	if (String(n.getCurrentChatId?.() ?? "") !== t.chatId) return wv = null, !1;
	let r = !1, i = !1, a = n.chatMetadata;
	a && JSON.stringify(a.variables) !== JSON.stringify(t.chatVars) && (t.chatVars === void 0 ? delete a.variables : a.variables = J(t.chatVars), r = !0);
	let o = n.chat, s = A_(o);
	for (let e = t.from; e < o.length; e++) {
		let t = o[e];
		if (s[e] === "") continue;
		let n = Tv(t);
		if (!n) continue;
		let r;
		for (let t = e - 1; t >= 0 && !r; t--) r = Tv(o[t]);
		Dv(n, r) || (t.variables[t.swipe_id ?? 0] = r ? J(r) : {}, i = !0);
	}
	return (r || i) && lg("variables", {
		frozen: "chat",
		storyline: t.line,
		chatVariables: r,
		messages: i
	}), r && await n.saveMetadata(), i && await n.saveChat(), r || i;
}
var Av = () => {
	wv = null;
};
function jv() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => {
		let r = t;
		r.makeLast ? r.makeLast(e, n) : r.on(e, n);
	};
	t.on(pv.commandParsed, (e, t, n) => Sv(e, t, n)), r(pv.updateEnded, (e, t) => Cv(e, t));
	let i = (e) => () => {
		wv && (e && (wv.open = !1), setTimeout(() => void kv().catch((e) => console.error("[AP] variables", e)), 0));
	};
	for (let e of [n.MESSAGE_RECEIVED, n.GENERATION_ENDED]) e && r(e, i(!1));
	for (let e of [n.CHARACTER_MESSAGE_RENDERED, n.GENERATION_STOPPED]) e && r(e, i(!0));
	n.GENERATION_STARTED && t.on(n.GENERATION_STARTED, (e, t, n) => {
		n || Av();
	}), n.CHAT_CHANGED && t.on(n.CHAT_CHANGED, Av);
}
//#endregion
//#region src/core/interceptor.ts
async function Mv(t, n, r, i) {
	if (Dh.setPending(null), !K().enabled) return;
	let a = rh(), o = a ? wp(a) : void 0;
	if (!o) return;
	let s = Im(o), c = i || "normal";
	c === "swipe" && dm(e().chat.length - 1);
	let l = t.length - 1, u = c !== "continue" && t[l]?.is_user ? l : -1, d = e().chat, f = t.map((e) => d.findIndex((t) => t.send_date === e.send_date && t.is_user === e.is_user && t.name === e.name)), p, m = [];
	if (D_(o, s)) {
		let e = O_(), n = u >= 0 ? f[u] ?? -1 : -1, r = u >= 0 && n < 0, i = Zp(r ? t : d, r ? u : n, e);
		i.rewrite !== void 0 && u >= 0 && (t[u] = {
			...t[u],
			mes: i.rewrite
		}, r || N_(n, i.rewrite), i.noRecent && x("info", Y("storylines.noRecent"), Y("app.name")));
		let a = im(t, r ? t.map((e, t) => t) : f, i, u, Ku(s.storylines));
		t.splice(0, t.length, ...a.items);
		let o = f;
		f = r ? a.realIndex.map((e) => o[e] ?? -1) : a.realIndex, r && (a.turn.input = -1), m = a.groups, u = a.currentInput, l = t.length - 1, p = a.turn;
	}
	let h = u >= 0 ? t[u].mes : "", g = t.slice(-6).map((e) => e.mes), _ = og(t, u), { meta: v, flags: y, origin: b } = bh(o, s, h, c, !0, g), S = s.connection.transport, { vars: ee } = tv({
		preset: o,
		config: s,
		transport: S,
		origin: b,
		stType: c,
		meta: v,
		flags: y,
		storylines: p
	}, xh(o, s, b)), C = {
		trigger: yh(o, s),
		wrap: o.meta.wrap,
		tokenSaving: s.tokenSaving,
		...Hh(o),
		echoes: Uh(o, s, ee, xh(o, s, "story")),
		recap: xm(Infinity, ev(p)),
		realIndex: (e) => f[e] ?? -1,
		currentInput: u,
		annotations: Bh(o, s),
		speech: Vh(o, s, ee),
		continuing: c === "continue" && t[l] && !t[l].is_user ? l : void 0,
		...p ? { background: (e) => am(p, m[e]) } : {}
	}, w = (e, t) => p?.grouped && m[e] !== void 0 ? tm(m[e]) + t : t, te, ne, re = -1, ie = [];
	if (s.cache?.enabled) {
		let e = kg(Og(), p?.current), n = _g(t, C, Ag(e)?.modes, (e) => fg(t[e], f[e] ?? e));
		if (ne = n.out.map(({ item: e, entry: t, index: n }) => ({
			...e,
			mes: w(n, t === void 0 ? e.mes : e.mes + hg(t))
		})), re = u >= 0 ? n.out.findIndex((e) => e.index === u) : -1, re >= 0) {
			let e = n.out[re], t = e.entry === void 0 ? void 0 : n.entries[e.entry];
			ie = t ? [
				t.given,
				t.sticky,
				t.fresh
			].filter((e) => typeof e == "string") : [e.item.mes];
		}
		te = {
			chat: e,
			entries: n.entries,
			omitted: n.omitted
		};
	} else {
		let e = Rh(t, C);
		ne = e.map(({ item: e, index: t }) => p?.grouped ? {
			...e,
			mes: w(t, e.mes)
		} : e), re = u >= 0 ? e.findIndex((e) => e.index === u) : -1, re >= 0 && (ie = [e[re].item.mes]);
	}
	let ae;
	o.inputShaping && re >= 0 && ie.some((e) => e.trim()) && (ne[re] = {
		...ne[re],
		mes: Lg(ne[re].mes)
	}, ae = { texts: ie }), t.splice(0, t.length, ...ne);
	let oe = {
		id: Ch(),
		preset: o,
		config: s,
		origin: b,
		stType: c,
		interceptorRan: !0,
		dryRun: !1,
		meta: v,
		flags: y,
		transport: S,
		stages: [],
		structures: [],
		inputIndex: u >= 0 ? f[u] ?? d.length - 1 : -1,
		continueFrom: c === "continue" ? t[l]?.mes : void 0,
		keywords: _,
		sticky: te,
		input: ae,
		storylines: p,
		createdAt: Date.now(),
		warnings: []
	};
	Ov({
		line: p?.current,
		frozen: !!p?.vars.frozen,
		from: oe.inputIndex >= 0 ? oe.inputIndex : d.length - 1
	}), Dh.setPending(oe);
}
//#endregion
//#region src/core/transports/text.ts
function Nv(e) {
	let { ctx: t } = e, n = t.transport === "prefill", r = d_(t), i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = null, o = (e, i) => Ol(e, {
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
			content: sl(t.preset.tools.callerSchemaHint, { schema: JSON.stringify(e.caller.schema.value, null, 2) })
		};
		s[s.length - 1]?.role === "assistant" ? s.splice(s.length - 1, 0, n) : s.push(n);
	}
	return {
		body: () => {
			let r = {};
			return n && t.preset.stop.length && (r.stop = [.../* @__PURE__ */ new Set([...e.base.stop ?? [], ...t.preset.stop])]), m_({
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
			let n = g_(t, e.caller);
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
var Pv = class extends Error {
	constructor(e, t) {
		super(`${e} at position ${t}`), this.position = t;
	}
}, Fv = 32, Iv = 10, Lv = 9, Rv = 13, zv = 160, Bv = 6158, Vv = 8192, Hv = 8203, Uv = 8239, Wv = 8287, Gv = 12288, Kv = 65279;
function qv(e) {
	return /^[0-9A-Fa-f]$/.test(e);
}
function Jv(e) {
	return e >= "0" && e <= "9";
}
function Yv(e) {
	return e >= " ";
}
function Xv(e) {
	return ",:[]/{}()\n+".includes(e);
}
function Zv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$";
}
function Qv(e) {
	return e >= "a" && e <= "z" || e >= "A" && e <= "Z" || e === "_" || e === "$" || e >= "0" && e <= "9";
}
var $v = /^(http|https|ftp|mailto|file|data|irc):\/\/$/, ey = /^[A-Za-z0-9-._~:/?#@!$&'()*+;=]$/;
function ty(e) {
	return ",[]/{}\n+".includes(e);
}
function ny(e) {
	return cy(e) || ry.test(e);
}
var ry = /^[[{\w-]$/;
function iy(e) {
	return e === "\n" || e === "\r" || e === "	" || e === "\b" || e === "\f";
}
function ay(e, t) {
	let n = e.charCodeAt(t);
	return n === Fv || n === Iv || n === Lv || n === Rv;
}
function oy(e, t) {
	let n = e.charCodeAt(t);
	return n === Fv || n === Lv || n === Rv;
}
function sy(e, t) {
	let n = e.charCodeAt(t);
	return n === zv || n === Bv || n >= Vv && n <= Hv || n === Uv || n === Wv || n === Gv || n === Kv;
}
function cy(e) {
	return ly(e) || dy(e);
}
function ly(e) {
	return e === "\"" || e === "“" || e === "”";
}
function uy(e) {
	return e === "\"";
}
function dy(e) {
	return e === "'" || e === "‘" || e === "’" || e === "`" || e === "´";
}
function fy(e) {
	return e === "'";
}
function py(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = e.lastIndexOf(t);
	return r === -1 ? e : e.substring(0, r) + (n ? "" : e.substring(r + 1));
}
function my(e, t) {
	let n = e.length;
	if (!ay(e, n - 1)) return e + t;
	for (; ay(e, n - 1);) n--;
	return e.substring(0, n) + t + e.substring(n);
}
function hy(e, t, n) {
	return e.substring(0, t) + e.substring(t + n);
}
function gy(e) {
	return /[,\n][ \t\r]*$/.test(e);
}
var _y = {
	"&quot;": "\"",
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&apos;": "'"
};
function vy(e) {
	if (e.charAt(0) !== "&") return null;
	let t = e.indexOf(";");
	if (t === -1) return null;
	let n = e.substring(0, t + 1), r = _y[n];
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
function yy(e) {
	return e !== null && e.char === "\"";
}
function by(e) {
	return e !== null && e.char === "'";
}
function xy(e, t) {
	let n = 0;
	for (let r = 0; r < e.length; r++) e.charAt(r) === t && n++;
	return n;
}
function Sy(e, t) {
	switch (t) {
		case ")": return xy(e, "(") > xy(e, ")");
		case "]": return xy(e, "[") > xy(e, "]");
		case "}": return xy(e, "{") > xy(e, "}");
		default: return !1;
	}
}
//#endregion
//#region node_modules/.pnpm/jsonrepair@3.15.0/node_modules/jsonrepair/lib/esm/regular/jsonrepair.js
var Cy = {
	"\b": "\\b",
	"\f": "\\f",
	"\n": "\\n",
	"\r": "\\r",
	"	": "\\t"
}, wy = {
	"\"": "\"",
	"\\": "\\",
	"/": "/",
	b: "\b",
	f: "\f",
	n: "\n",
	r: "\r",
	t: "	"
};
function Ty(e) {
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
	for (r && a(), ny(e[t]) && gy(n) ? (r || (n = my(n, ",")), g()) : r && (n = py(n, ",")); e[t] === "}" || e[t] === "]";) t++, a();
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
		let i = r ? ay : oy, a = "";
		for (;;) if (i(e, t)) a += e[t], t++;
		else if (sy(e, t)) a += " ", t++;
		else break;
		return a.length > 0 && (n += a, !0);
	}
	function s() {
		if (e[t] === "/" && e[t + 1] === "*") {
			for (; t < e.length && !Ey(e, t);) t++;
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
			if (Zv(e[t])) for (; t < e.length && Qv(e[t]);) t++;
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
				if (r ? o = !0 : (o = u(","), o || (n = my(n, ",")), a()), p(), !(_() || S(!0))) {
					e[t] === "}" || e[t] === "{" || e[t] === "]" || e[t] === "[" || e[t] === void 0 ? r || (n = py(n, ",")) : ae();
					break;
				}
				a();
				let s = u(":"), c = t >= e.length;
				s || (ny(e[t]) || c ? n = my(n, ":") : oe()), i() || (s || c ? n += "null" : oe()), r = !1;
			}
			return e[t] === "}" ? (n += "}", t++) : n = my(n, "}"), !0;
		}
		return !1;
	}
	function h() {
		if (e[t] === "[") {
			n += "[", t++, a(), d(",") && a();
			let r = !0;
			for (; t < e.length && e[t] !== "]";) {
				if (r || u(",") || (n = my(n, ",")), p(), !i()) {
					r || (n = py(n, ","));
					break;
				}
				r = !1;
			}
			return e[t] === "]" ? (n += "]", t++) : n = my(n, "]"), !0;
		}
		return !1;
	}
	function g() {
		let e = !0, t = !0;
		for (; t;) e ? e = !1 : u(",") || (n = my(n, ",")), t = i();
		t || (n = py(n, ",")), n = `[\n${n}\n]`;
	}
	function _() {
		let r = arguments.length > 0 && arguments[0] !== void 0 && arguments[0], i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = e[t] === "\\";
		o && (t++, cy(e[t]) || re());
		let s = e[t] === "&" ? vy(e.slice(t, t + 12)) : null, c = yy(s) || by(s);
		if (cy(e[t]) || c) {
			let l = uy(e[t]) ? uy : fy(e[t]) ? fy : dy(e[t]) ? dy : ly, u = t, d = n.length, p = "\"";
			for (t += c && s ? s.length : 1;;) {
				if (t >= e.length) {
					let i = C(t - 1);
					return !r && Xv(e.charAt(i)) ? (t = u, n = n.substring(0, d), _(!0)) : (p = my(p, "\""), n += p, !0);
				}
				if (t === i) return p = my(p, "\""), n += p, !0;
				let m = c && e[t] === "&" ? vy(e.slice(t, t + 12)) : null;
				if (m && s ? m.char === s.char : l(e[t])) {
					let i = t, o = p.length;
					if (p += "\"", t += m ? m.length : 1, n += p, a(!1), r || t >= e.length || Xv(e[t]) && !Sy(p, e[t]) || cy(e[t]) && !w(t) || Jv(e[t])) return v(), !0;
					e[t] === "\\" && re();
					let s = C(i - 1), c = e.charAt(s);
					if (c === ",") return t = u, n = n.substring(0, d), _(!1, s);
					if (Xv(c)) return t = u, n = n.substring(0, d), _(!0);
					n = n.substring(0, d), t = i + (m ? m.length : 1), p = `${p.substring(0, o)}\\${p.substring(o)}`;
				} else if (r && ty(e[t])) {
					if (e[t - 1] === ":" && $v.test(e.substring(u + 1, t + 2))) for (; t < e.length && ey.test(e[t]);) p += e[t], t++;
					return p = my(p, "\""), n += p, v(), !0;
				} else if (m) {
					let e = m.char;
					e === "\"" ? p += "\\\"" : iy(e) ? p += Cy[e] : p += e, t += m.length;
				} else if (e[t] === "\\") {
					let n = e.charAt(t + 1);
					if (wy[n] !== void 0) p += e.slice(t, t + 2), t += 2;
					else if (n === "u") {
						let n = 2;
						for (; n < 6 && qv(e[t + n]);) n++;
						n === 6 ? (p += e.slice(t, t + 6), t += 6) : t + n >= e.length ? t = e.length : se();
					} else n === "\n" ? (p += "\\n", t += 2) : (p += n, t += 2);
				} else {
					let n = e.charAt(t);
					n === "\"" && e[t - 1] !== "\\" ? (p += `\\${n}`, t++) : iy(n) ? (p += Cy[n], t++) : (Yv(n) || ne(n), p += n, t++);
				}
				o && f();
			}
		}
		return !1;
	}
	function v() {
		let r = !1;
		for (a(); e[t] === "+";) {
			r = !0, t++, a(), n = py(n, "\"", !0);
			let e = n.length;
			n = _() ? hy(n, e, 1) : my(n, "\"");
		}
		return r;
	}
	function y() {
		let r = t, i = "", a = !1;
		for (e[t] === "-" && (i += e[t], t++, !Jv(e[t]) && te() && (i += "0")), e[t] === "0" && Jv(e[t + 1]) && (a = !0); Jv(e[t]);) i += e[t], t++;
		if (e[t] === ".") for ((i === "" || i === "-") && (i += "0"), i += e[t], t++, Jv(e[t]) || (i += "0"); Jv(e[t]);) i += e[t], t++;
		if (t > r) {
			if (e[t] === "e" || e[t] === "E") for (i === "-" && (a = !0), i += e[t], t++, (e[t] === "-" || e[t] === "+") && (i += e[t], t++), Jv(e[t]) || (i += "0"); Jv(e[t]);) i += e[t], t++;
			return te() ? (n += a ? `"${e.substring(r, t)}"` : i, !0) : (t = r, !1);
		}
		return !1;
	}
	function b() {
		return x("true", "true") || x("false", "false") || x("null", "null") || x("True", "true") || x("False", "false") || x("None", "null");
	}
	function x(r, i) {
		return e.slice(t, t + r.length) === r && !Qv(e[t + r.length]) && (n += i, t += r.length, !0);
	}
	function S(r) {
		let a = t;
		if (Zv(e[t])) {
			for (; t < e.length && Qv(e[t]);) t++;
			let n = t;
			for (; ay(e, n);) n++;
			if (e[n] === "(") return t = n + 1, i(), e[t] === ")" && (t++, e[t] === ";" && t++), !0;
		}
		for (; t < e.length && !ty(e[t]) && !cy(e[t]) && (!r || e[t] !== ":");) t++;
		if (e[t - 1] === ":" && $v.test(e.substring(a, t + 2))) for (; t < e.length && ey.test(e[t]);) t++;
		if (t > a) {
			for (; ay(e, t - 1) && t > 0;) t--;
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
	function C(t) {
		let n = t;
		for (; n > 0 && ay(e, n);) n--;
		return n;
	}
	function w(t) {
		let n = t + 1;
		for (; n < e.length && ay(e, n);) n++;
		return n >= e.length || Xv(e[n]);
	}
	function te() {
		return t >= e.length || Xv(e[t]) || ay(e, t);
	}
	function ne(e) {
		throw new Pv(`Invalid character ${JSON.stringify(e)}`, t);
	}
	function re() {
		throw new Pv(`Unexpected character ${JSON.stringify(e[t])}`, t);
	}
	function ie() {
		throw new Pv("Unexpected end of json string", e.length);
	}
	function ae() {
		throw new Pv("Object key expected", t);
	}
	function oe() {
		throw new Pv("Colon expected", t);
	}
	function se() {
		throw new Pv(`Invalid unicode character "${e.slice(t, t + 6)}"`, t);
	}
}
function Ey(e, t) {
	return e[t] === "*" && e[t + 1] === "/";
}
//#endregion
//#region src/core/partial-json.ts
function Dy(e) {
	let t = e.trim(), n = /```(?:json)?\s*([\s\S]*?)(?:```|$)/i.exec(t);
	n && !t.startsWith("{") && (t = n[1].trim());
	let r = t.indexOf("{");
	return r >= 0 ? t.slice(r) : "";
}
function Oy(e, t) {
	let n = Dy(e);
	if (!n) return { value: null };
	let r = null;
	try {
		r = JSON.parse(n);
	} catch {
		try {
			r = JSON.parse(Ty(n));
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
function ky(e, t, n, r, i = !0) {
	let a = wl(e.stages), o = e.stages.find((e) => e.kind === "text"), s = i ? n?.[t.envelopeKeys.thinking] : void 0;
	o && typeof s == "string" && (a.stages[o.id] = {
		text: s,
		status: r ? "done" : "streaming"
	});
	for (let t of e.stages) r && a.stages[t.id].status !== "done" && (a.stages[t.id].status = t.optional ? "pending" : "missing");
	return a.current = r ? null : o?.id ?? null, a;
}
function Ay(e) {
	let { ctx: t, caller: n } = e, r = l_(t), i = r.schema(), a = u_(t), o = n.schema ? a ? r.envelope(n.schema.value) : n.schema.value : i.value, s = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, c = null, l = (e) => e.text.trim() || e.toolCalls[0]?.arguments || "", u = (e, i) => {
		let o = Oy(l(e), i);
		return c = o.value, n.schema ? ky(t, r, o.value, i, a) : kl(o.value, {
			stages: t.stages,
			structures: t.structures,
			final: i,
			openKey: o.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	}, d = n.schema ? {
		name: n.schema.name ?? i.name,
		value: o,
		strict: !1
	} : {
		name: i.name,
		...i.description ? { description: i.description } : {},
		value: o,
		strict: !1
	};
	return {
		body: () => m_(e, { json_schema: d }),
		progress: (e, t) => (s = e, u(e, t)),
		complete: () => ({ done: !0 }),
		result: () => u(s, !0),
		rawText: () => s.text,
		callerResult: () => a ? c?.[r.envelopeKeys.result] : c ?? void 0
	};
}
//#endregion
//#region src/core/transports/tools.ts
var jy = (e, t) => Qg({
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
function My(e, t) {
	return e.forEach((e, n) => {
		e.id ||= `call_${t}_${n}`;
	}), e;
}
function Ny(e) {
	let { ctx: t, caller: n } = e, r = l_(t), i = u_(t), a = r.submitTool(n.schema ? i ? r.envelope(n.schema.value) : n.schema.value : void 0), o = a.function.name, s = p_(e, "single", o), c = [
		...s ? [s.tool] : [],
		a,
		...n.tools
	], l = [...e.messages, ...s?.messages ?? []], u = t.config.connection.forceTool && !n.tools.length, d = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, f = null, p = (e, a) => {
		let s = Oy((e.toolCalls.find((e) => e.name === o) ?? (e.toolCalls.length === 1 && !e.toolCalls[0].name ? e.toolCalls[0] : void 0))?.arguments ?? "", a);
		return f = s.value, n.schema ? ky(t, r, s.value, a, i) : kl(s.value, {
			stages: t.stages,
			structures: t.structures,
			final: a,
			openKey: s.openKey,
			fieldOf: r.fieldOf,
			structureFieldOf: r.structureFieldOf
		});
	};
	return {
		body: () => m_(e, {
			messages: l,
			tools: c,
			tool_choice: u ? {
				type: "function",
				function: { name: o }
			} : "auto"
		}),
		progress: (e, t) => (d = e, p(e, t)),
		complete: (e) => {
			let t = g_(e, n);
			return {
				done: !0,
				callerToolCalls: t.length ? t : void 0
			};
		},
		result: () => p(d, !0),
		rawText: () => d.text,
		callerResult: () => i ? f?.[r.envelopeKeys.result] : f ?? void 0
	};
}
function Py(e) {
	let { ctx: t, caller: n } = e, { stages: r, structures: i, preset: a } = t, o = t.config.connection.parallelTools, s = l_(t), c = s.stageTools(), l = c[0]?.function.name ?? "", u = p_(e, o ? "parallel" : "multi", l), d = [
		...u ? [u.tool] : [],
		...c,
		...n.tools
	], f = [...e.messages, ...u?.messages ?? []], p = new Map(r.map((e) => [s.toolOf(e), e])), m = {}, h = [], g = !1, _ = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, v = () => r.find((e) => !e.optional && m[s.fieldOf(e)] === void 0), y = () => {
		let e = v();
		return e ? s.toolOf(e) : "";
	}, b = (e, t, n) => {
		let r = p.get(t.name);
		if (!r) return;
		let i = Oy(t.arguments, n).value ?? {}, a = s.fieldOf(r), o = i[s.paramOf(r)];
		o !== void 0 && (e[a] = o);
		for (let t of s.layout.carriedBy(r)) {
			let n = s.structureFieldOf(t);
			i[n] !== void 0 && (e[n] = i[n]);
		}
		return a;
	}, x = (e, a, o) => n.schema ? ky(t, s, e, a) : kl(e, {
		stages: r,
		structures: i,
		final: a,
		openKey: o,
		fieldOf: s.fieldOf,
		structureFieldOf: s.structureFieldOf
	});
	return {
		body: () => {
			let r = !t.config.connection.forceTool || n.tools.length ? "auto" : o ? "required" : {
				type: "function",
				function: { name: y() || l }
			};
			return m_({
				...e,
				messages: f
			}, {
				messages: [...f],
				tools: d,
				tool_choice: r
			});
		},
		progress: (e, t) => {
			_ = e;
			let n = { ...m }, r;
			for (let i of e.toolCalls) r = b(n, i, t) ?? r;
			return x(n, t, t ? void 0 : r);
		},
		complete: (e, r) => {
			let i = My(e.toolCalls.filter((e) => e.name), r), o = g_(e, n);
			if (o.length) return {
				done: !0,
				callerToolCalls: o
			};
			e.text.trim() && h.push(e.text.trim());
			let s = i.filter((e) => p.has(e.name));
			if (s.length) {
				f.push(jy(e, i));
				for (let e of i) {
					b(m, e, !0);
					let n = p.has(e.name), r = y(), i = f_(t, n ? r ? a.tools.results.next : a.tools.results.done : a.tools.results.unknown, {
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
			if (!v()) return { done: !0 };
			if (!s.length) {
				if (g) return { done: !0 };
				g = !0, e.text.trim() && f.push({
					role: "assistant",
					content: e.text
				}), f.push({
					role: "user",
					content: f_(t, a.tools.results.nudge, {
						next: y(),
						first: l
					})
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
function Fy(e) {
	switch (e.ctx.transport) {
		case "prefill":
		case "plaintext": return Nv(e);
		case "structured": return Ay(e);
		case "tool-single": return Ny(e);
		case "tool-multi": return Py(e);
	}
}
//#endregion
//#region src/core/encoder.ts
function Iy(e, t) {
	let n = t ? f({
		...t,
		chat_completion_source: e ?? t.chat_completion_source
	}) : { chatCompletionSource: String(e ?? "") };
	return t ? g(n) : m(n);
}
var Ly = (e) => `data: ${typeof e == "string" ? e : JSON.stringify(e)}\n\n`;
function Ry(e) {
	switch (e) {
		case "claude": {
			let e = !1, t = -1, n = null, r = !1, i = () => e ? "" : (e = !0, Ly({
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
			})), a = () => n === null ? "" : (n = null, Ly({
				type: "content_block_stop",
				index: t
			})), o = (e) => {
				if (n === e) return i();
				let r = i() + a();
				return t++, n = e, r + Ly({
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
				text: (e) => e ? o("text") + Ly({
					type: "content_block_delta",
					index: t,
					delta: {
						type: "text_delta",
						text: e
					}
				}) : "",
				reasoning: (e) => e ? o("thinking") + Ly({
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
					for (let i of e) t++, r = !0, n += Ly({
						type: "content_block_start",
						index: t,
						content_block: {
							type: "tool_use",
							id: i.id,
							name: i.name,
							input: {}
						}
					}) + Ly({
						type: "content_block_delta",
						index: t,
						delta: {
							type: "input_json_delta",
							partial_json: i.arguments || "{}"
						}
					}) + Ly({
						type: "content_block_stop",
						index: t
					});
					return n;
				},
				error: (e) => Ly({
					type: "error",
					error: {
						type: "api_error",
						message: e
					}
				}),
				end: (e) => i() + a() + Ly({
					type: "message_delta",
					delta: {
						stop_reason: r ? "tool_use" : "end_turn",
						stop_sequence: null
					},
					usage: {
						output_tokens: 0,
						...e
					}
				}) + Ly({ type: "message_stop" })
			};
		}
		case "gemini": return {
			text: (e) => e ? Ly({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{ text: e }]
				}
			}] }) : "",
			reasoning: (e) => e ? Ly({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: [{
						text: e,
						thought: !0
					}]
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ly({ candidates: [{
				index: 0,
				content: {
					role: "model",
					parts: e.map((e) => ({
						functionCall: {
							name: e.name,
							args: By(e.arguments)
						},
						...e.signature ? { thoughtSignature: e.signature } : {}
					}))
				}
			}] }) : "",
			error: (e) => Ly({ error: { message: e } }),
			end: (e) => e ? Ly({ usageMetadata: e }) : ""
		};
		case "cohere": return {
			text: (e) => e ? Ly({
				type: "content-delta",
				index: 0,
				delta: { message: { content: { text: e } } }
			}) : "",
			reasoning: () => "",
			toolCalls: (e) => e.map((e, t) => Ly({
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
			error: (e) => Ly({ error: { message: e } }),
			end: (e) => Ly({
				type: "message-end",
				...e ? {
					delta: { usage: e },
					usage: e
				} : {}
			})
		};
		default: return {
			text: (e) => e ? Ly({ choices: [{
				index: 0,
				delta: { content: e }
			}] }) : "",
			reasoning: (e) => e ? Ly({ choices: [{
				index: 0,
				delta: {
					reasoning_content: e,
					reasoning: e
				}
			}] }) : "",
			toolCalls: (e) => e.length ? Ly({ choices: [{
				index: 0,
				delta: {
					tool_calls: e.map((e, t) => ({
						index: t,
						id: e.id,
						type: "function",
						function: {
							name: e.name,
							arguments: e.arguments
						}
					})),
					...zy(e)
				}
			}] }) : "",
			error: (e) => Ly({ error: { message: e } }),
			end: (e) => (e ? Ly({
				object: "chat.completion.chunk",
				choices: [],
				usage: e
			}) : "") + Ly("[DONE]")
		};
	}
}
function zy(e) {
	let t = e.filter((e) => e.signature).map((e, t) => ({
		type: "reasoning.encrypted",
		data: e.signature,
		id: e.id,
		format: "google-gemini-v1",
		index: t
	}));
	return t.length ? { reasoning_details: t } : {};
}
function By(e) {
	try {
		return JSON.parse(e || "{}");
	} catch {
		return {};
	}
}
function Vy(e, t) {
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
			...n ? {
				tool_calls: n,
				...zy(t.toolCalls)
			} : {}
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
			input: By(e.arguments)
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
					args: By(e.arguments)
				},
				...e.signature ? { thoughtSignature: e.signature } : {}
			}))
		]
	}), r;
}
function Hy(e, t = 502) {
	return new Response(JSON.stringify({ error: { message: e } }), {
		status: t,
		statusText: e.slice(0, 100),
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region src/core/partial-args.ts
function Uy(e) {
	if (!e.startsWith("$")) return null;
	let t = [], n = /\.([^.[\]]+)|\[(\d+)\]|\[(['"])((?:\\.|(?!\3).)*)\3\]/gy;
	for (n.lastIndex = 1; n.lastIndex < e.length;) {
		let r = n.exec(e);
		if (!r) return null;
		r[1] === void 0 ? r[2] === void 0 ? t.push(r[4].replace(/\\(.)/g, "$1")) : t.push(Number(r[2])) : t.push(r[1]);
	}
	return t.length ? t : null;
}
function Wy(e) {
	return e.stringValue === void 0 ? e.numberValue === void 0 ? e.boolValue === void 0 ? "nullValue" in e ? { value: null } : null : { value: e.boolValue } : { value: e.numberValue } : { value: e.stringValue };
}
var Gy = class {
	value = {};
	open = /* @__PURE__ */ new Set();
	apply(e) {
		for (let t of e) {
			let e = t.jsonPath ?? "", n = Uy(e);
			if (!n) {
				console.warn("[AP] ignoring a function-call fragment with an unsupported JSONPath", e);
				continue;
			}
			let r = Wy(t);
			if (r) {
				let t = this.open.has(e) ? Ky(this.value, n) : void 0;
				qy(this.value, n, typeof t == "string" && typeof r.value == "string" ? t + r.value : r.value);
			}
			t.willContinue ? this.open.add(e) : this.open.delete(e);
		}
	}
};
function Ky(e, t) {
	let n = e;
	for (let e of t) {
		if (!n || typeof n != "object") return;
		n = n[e];
	}
	return n;
}
function qy(e, t, n) {
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
var Jy = (e) => typeof e == "object" && !!e && !Array.isArray(e);
function Yy(e) {
	let t = e?.usage ?? e?.usageMetadata ?? e?.usage_metadata ?? e?.message?.usage;
	return Jy(t) ? t : void 0;
}
function Xy(e, t) {
	if (!Jy(t)) return Jy(e) ? e : void 0;
	if (!Jy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r != null && (n[e] = Jy(r) && Jy(n[e]) ? Xy(n[e], r) : r);
	return n;
}
function Zy(e, t) {
	if (!Jy(t)) return Jy(e) ? e : void 0;
	if (!Jy(e)) return { ...t };
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		typeof r == "number" && typeof t == "number" ? n[e] = t + r : Jy(r) && Jy(t) ? n[e] = Zy(t, r) : r != null && (n[e] = r);
	}
	return n;
}
//#endregion
//#region src/core/reader.ts
var Qy = class extends Error {
	status;
	body;
	constructor(e, t = 502, n) {
		super(e), this.status = t, this.body = n;
	}
};
function $y(e) {
	let t = e?.error ?? e?.detail?.error;
	return t ? typeof t == "string" ? t : String(t.message || t.code || t.type || "Unknown error") : null;
}
var eb = class {
	calls = [];
	claudeIndex = /* @__PURE__ */ new Map();
	geminiOpen = null;
	signatures = /* @__PURE__ */ new Map();
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
		for (let t of Array.isArray(e?.choices) ? e.choices : []) if ((t?.index ?? 0) === 0) {
			for (let [e, n] of (t?.delta?.tool_calls ?? t?.message?.tool_calls ?? []).entries()) {
				let t = this.at(typeof n?.index == "number" ? n.index : e);
				n?.id && !t.id && (t.id = n.id), n?.function?.name && !t.name && (t.name = n.function.name);
				let r = n?.function?.arguments;
				typeof r == "string" ? t.arguments += r : r && typeof r == "object" && (t.arguments = JSON.stringify(r));
				let i = tb(n);
				i && (t.signature = i);
			}
			this.reasoningDetails(t?.delta?.reasoning_details ?? t?.message?.reasoning_details);
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
				args: new Gy()
			};
		}
		let n = this.geminiOpen;
		n && (e.thoughtSignature && (n.call.signature = e.thoughtSignature), Array.isArray(t.partialArgs) && t.partialArgs.length && (n.args.apply(t.partialArgs), n.call.arguments = JSON.stringify(n.args.value)), t.willContinue || (this.geminiOpen = null));
	}
	reasoningDetails(e) {
		if (Array.isArray(e)) for (let t of e) t?.type === "reasoning.encrypted" && typeof t.id == "string" && t.id && typeof t.data == "string" && t.data && this.signatures.set(t.id, t.data);
		if (this.signatures.size) for (let e of this.calls) !e.signature && e.id && this.signatures.has(e.id) && (e.signature = this.signatures.get(e.id));
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
			n.arguments = typeof r == "string" ? r : JSON.stringify(r ?? {});
			let i = typeof e.signature == "string" && e.signature ? e.signature : tb(e);
			i && (n.signature = i);
		}), this.reasoningDetails(n.reasoning_details);
		else if (Array.isArray(e?.content)) {
			for (let t of e.content) if (t?.type === "tool_use") {
				let e = this.at(this.calls.length);
				e.id = t.id, e.name = t.name, e.arguments = JSON.stringify(t.input ?? {});
			}
		}
	}
};
function tb(e) {
	let t = e?.extra_content?.google?.thought_signature ?? e?.function?.extra_content?.google?.thought_signature;
	return typeof t == "string" && t ? t : void 0;
}
function nb(e) {
	if (typeof e == "string") return e;
	let t = (Array.isArray(e?.content) ? e.content.filter((e) => e?.type === "text").map((e) => e.text).join("\n\n") : void 0) || e?.choices?.[0]?.message?.content || e?.choices?.[0]?.text || e?.text || e?.message?.content?.[0]?.text || "";
	return Array.isArray(t) ? t.map((e) => e?.text ?? "").join("") : String(t ?? "");
}
function rb(e) {
	let t = e?.choices?.[0]?.message;
	return t?.reasoning_content || t?.reasoning ? String(t.reasoning_content ?? t.reasoning) : Array.isArray(e?.responseContent?.parts) ? e.responseContent.parts.filter((e) => e.thought).map((e) => e.text).join("\n\n") : Array.isArray(e?.content) ? e.content.filter((e) => e.type === "thinking").map((e) => e.thinking).join("\n\n") : "";
}
async function* ib(e, t) {
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
async function* ab(e, t, n, r) {
	if (!e.ok) {
		let t = await e.text().catch(() => ""), n = `HTTP ${e.status}`;
		try {
			n = $y(JSON.parse(t)) ?? n;
		} catch {
			t && (n = t.slice(0, 500));
		}
		throw new Qy(n, e.status, t);
	}
	let i = {
		text: "",
		reasoning: "",
		toolCalls: []
	}, a = new eb();
	if (!(n && e.body && !(e.headers.get("content-type") ?? "").includes("application/json")) || !e.body) {
		let t = await e.json(), n = $y(t);
		if (n) throw new Qy(n);
		i.text = nb(t), i.reasoning = rb(t), a.fromBody(t), i.toolCalls = a.list, i.finishReason = t?.choices?.[0]?.finish_reason ?? t?.stop_reason, i.usage = Yy(t), yield i;
		return;
	}
	let o = {
		reasoning: "",
		images: [],
		signature: "",
		toolSignatures: {}
	};
	for await (let n of ib(e.body, r)) {
		if (n === "[DONE]") break;
		let e;
		try {
			e = JSON.parse(n);
		} catch {
			continue;
		}
		let r = $y(e);
		if (r) throw new Qy(r);
		i.text += p(e, o, t), i.reasoning = o.reasoning, a.push(e), i.toolCalls = a.list, o.signature && (i.signature = o.signature);
		let s = e?.choices?.[0]?.finish_reason ?? e?.delta?.stop_reason ?? e?.candidates?.[0]?.finishReason;
		s && (i.finishReason = s);
		let c = Yy(e);
		c && (i.usage = Xy(i.usage, c)), yield i;
	}
}
//#endregion
//#region src/core/live.ts
var ob = /* @__PURE__ */ fn({ current: null });
function sb(e, t) {
	return ob.current = {
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
		mesId: null,
		swipeId: null
	}, ob.current;
}
function cb(e, t, n) {
	for (let n of e.stages) {
		let e = t.stages[n.id];
		e && (n.text = e.text ?? "", e.patches && (n.patches = e.patches), n.status = e.status);
	}
	e.structures = t.structures, e.reasoning = n;
}
function lb(t, n) {
	t.mesId = n, t.swipeId = e().chat[n]?.swipe_id ?? 0;
}
function ub(t, n = e().chat[t]) {
	let r = ob.current;
	return !r || r.mesId !== t || r.swipeId !== null && (n?.swipe_id ?? 0) !== r.swipeId ? null : r;
}
//#endregion
//#region src/core/orchestrator.ts
function db(e) {
	let t = e.structures.find((e) => e.kind === "speech");
	if (t) return e.speechCleaner ??= J_(e.preset).cleaner ?? null, {
		tag: t.tag,
		...e.speechCleaner ? { cleaner: e.speechCleaner } : {}
	};
}
var fb = "/api/backends/chat-completions/generate", pb = { pending: null }, mb = (e) => e?.name === "AbortError";
function hb(e) {
	if (e.transport !== "tool-single" && e.transport !== "tool-multi") return null;
	let t = c(e.config.connection.assumeToolSupport);
	if (!t) return null;
	switch (t.reason) {
		case "postProcessing": return Y("error.toolsUnsupported.postProcessing", { value: t.label });
		case "model": return Y("error.toolsUnsupported.model", { target: t.model ? `${t.source} / ${t.model}` : t.source });
		default: return Y(`error.toolsUnsupported.${t.reason}`);
	}
}
async function gb(e, t, n) {
	let r = Iy(String(t.chat_completion_source ?? ""), t), i = !!t.stream, a = hb(e);
	if (a) return x("error", a, "Advanced Preset"), Hy(a, 400);
	let o = e.origin === "task" ? s_(e.preset) : /* @__PURE__ */ new Set(), s = e.origin === "task" ? {
		tools: (t.tools ?? []).filter((e) => !o.has(e?.function?.name ?? "")),
		toolChoice: t.tool_choice,
		schema: t.json_schema ?? void 0
	} : { tools: [] }, c = sb(e, i);
	if (!i) {
		let i;
		try {
			i = await yb(e, t, s, c, n ?? void 0, () => void 0);
		} catch (e) {
			return vb(c, e);
		}
		if (n?.aborted) throw pb.pending?.ctx === e && (pb.pending = null), n.reason;
		return new Response(JSON.stringify(Vy(r, i)), { headers: { "Content-Type": "application/json" } });
	}
	let l = Ry(r), u = new TextEncoder(), d = new TransformStream(), f = d.writable.getWriter(), p = (e) => e ? f.write(u.encode(e)).catch(() => void 0) : Promise.resolve(), m = "";
	return (async () => {
		try {
			let i = await yb(e, t, s, c, n ?? void 0, (e) => {
				e.startsWith(m) && e.length > m.length && (p(l.text(e.slice(m.length))), m = e);
			});
			i.content.startsWith(m) && await p(l.text(i.content.slice(m.length))), i.reasoning && !(r === "claude" && i.toolCalls?.length) && await p(l.reasoning(i.reasoning)), i.toolCalls?.length && await p(l.toolCalls(i.toolCalls)), await p(l.end(i.usage));
		} catch (e) {
			mb(e) || (await p(l.error(_b(e))), vb(c, e));
		} finally {
			await f.close().catch(() => void 0);
		}
	})(), new Response(d.readable, { headers: { "Content-Type": "text/event-stream; charset=utf-8" } });
}
var _b = (e) => e instanceof Error ? e.message : String(e);
function vb(e, t) {
	return e.status = mb(t) ? "aborted" : "error", e.error = _b(t), t instanceof Qy ? new Response(t.body || JSON.stringify({ error: { message: t.message } }), {
		status: t.status,
		headers: { "Content-Type": "application/json" }
	}) : Hy(_b(t));
}
async function yb(t, n, r, i, a, o) {
	let s = Iy(String(n.chat_completion_source ?? ""), n), c = Fy({
		ctx: t,
		base: n,
		messages: n.messages ?? [],
		caller: r,
		family: s
	}), l = ll(t.stages), u = l >= 0 ? t.stages[l].id : null, d = t.stages.some((e) => e.kind === "patch"), p = t.origin === "story" && !r.schema && !d && u !== null, m = t.structures.some((e) => e.kind === "annotations"), h = db(t), g = m ? (e) => oc(e, { final: !1 }).text : (e) => e, _ = h ? (e) => jc(g(e), {
		...h,
		final: !1
	}).text : g, v = t.transport === "tool-multi" ? Math.max(1, t.config.connection.maxSteps) : 1, y = Date.now(), b = "", ee, C = 0, w = !1, te, ne;
	for (let n = 0; n < v; n++) {
		i.step = n;
		let r = c.body(n), l = ug({
			genId: t.id,
			step: n,
			at: Date.now(),
			request: r
		});
		C++;
		let d = {
			text: "",
			reasoning: "",
			toolCalls: []
		};
		try {
			let n = await S(fb, {
				method: "POST",
				headers: e().getRequestHeaders(),
				body: JSON.stringify(r),
				signal: a
			}), s = 0;
			for await (let e of ab(n, f(r), !!r.stream, a)) {
				d = e;
				let t = Date.now();
				if (t - s < 50) continue;
				s = t;
				let n = c.progress(e, !1);
				if (cb(i, n, b + e.reasoning), p && u) {
					let e = n.stages[u]?.text ?? "";
					e && o(_(e.slice(0, e.length - Xs(e))).trimEnd());
				}
			}
			T_(t), l.response = d.text || JSON.stringify(d.toolCalls), l.durationMs = Date.now() - l.at, l.usage = d.usage;
		} catch (e) {
			if (l.error = _b(e), mb(e) || a?.aborted) {
				(d.text || d.reasoning || d.toolCalls.length) && T_(t), ee = Zy(ee, d.usage), w = !0, ne = c.progress(d, !1);
				break;
			}
			if (!d.text && !d.toolCalls.length && n_(e) && t_(t, s)) {
				t.signatureFallback = !0, t.warnings.push("thought signature rejected: retried without the built-in signature"), x("warning", Y("error.signatureFallback"), Y("app.name")), n--;
				continue;
			}
			throw e;
		}
		b += d.reasoning, ee = Zy(ee, d.usage), c.progress(d, !0);
		let m = c.complete(d, n);
		if (m.callerToolCalls) {
			te = m.callerToolCalls.map((e) => ({
				id: e.id || `call_${n}`,
				name: e.name,
				arguments: e.arguments || "{}",
				signature: e.signature
			}));
			break;
		}
		if (m.done) break;
	}
	let re = ne ?? c.result();
	if (w) for (let e of Object.values(re.stages)) e.status === "streaming" && (e.status = "interrupted");
	cb(i, re, b);
	let ie = bb(t, re, c.rawText(), c.callerResult?.(), b, {
		usage: ee,
		requests: C,
		durationMs: Date.now() - y,
		interrupted: w
	});
	return ie.toolCalls = te, ie.usage = ee, te && (ie.content = ""), i.status = w ? "aborted" : "done", ie;
}
function bb(t, n, r, i, a, o) {
	let { preset: s, config: c } = t, l = [...t.warnings, ...n.warnings], u = n.content, d, f, p, m = t.stages.find((e) => e.kind === "patch"), h = m ? n.stages[m.id]?.patches : void 0;
	if (m && h?.length && u && !o.interrupted) {
		let e = Nl(u, h);
		d = u, f = e.text, p = e.results, u = e.text;
		let t = e.results.filter((e) => e.status !== "applied").length;
		t && l.push(`patches: ${t}/${e.results.length} skipped`);
	}
	if (!u && t.origin === "story" && c.connection.finalFallback) {
		let e = Zs(r).trim();
		e && !r.trim().startsWith("{") && (u = e, l.push("fallback: plain text used as content"));
	}
	let g, _;
	if (t.structures.some((e) => e.kind === "annotations")) {
		let e = (e) => {
			let t = oc(e);
			return l.push(...t.warnings), t;
		};
		if (u) {
			let t = e(u);
			u = t.text, g = t.annotations;
		}
		if (d !== void 0 && f !== void 0) {
			let e = oc(d);
			d = e.text, f = u, _ = {
				draft: e.annotations,
				patched: g ?? []
			};
		}
	}
	let v, y, b = db(t);
	if (b) {
		if (u) {
			let e = Ic(u, g, b);
			l.push(...e.warnings), u = e.text, v = e.spans, g = e.anchors;
		}
		if (d !== void 0 && f !== void 0) {
			let e = Ic(d, _?.draft, b);
			d = e.text, f = u, y = {
				draft: e.spans,
				patched: v ?? []
			}, _ &&= {
				draft: e.anchors ?? [],
				patched: g ?? []
			};
		}
	}
	let x = (e) => Object.values(s.structures).find((t) => t.kind === e), S = x("reply"), ee = S ? n.structures[S.id] : void 0, C = x("impersonate"), w = x("recap"), te = x("memory"), ne = t.meta.mixed ? "meta-mixed" : "story", re = u;
	if (t.origin === "task" && (t.stType === "script" || t.stType === "quiet" ? re = i === void 0 ? u || Zs(r).trim() : JSON.stringify(i) : u || (ne = t.meta.task === "summary" ? "summary" : t.meta.task === "impersonate" ? "impersonate" : "meta-pure", re = ee ? Zc(ee) : "", !re && C && typeof n.structures[C.id] == "string" && (re = "…"), !re && w && n.structures[w.id] && (re = "…"))), !re && !o.interrupted) throw Error(Y("error.emptyTurn"));
	let ie = [], ae = [], oe = t.interceptorRan && t.stType !== "quiet";
	if (oe && te && Array.isArray(n.structures[te.id])) {
		let e = Am(n.structures[te.id]);
		ie.push(...e.events), ae = e.global;
	}
	if (oe && w && typeof n.structures[w.id] == "string") {
		let r = t.inputIndex >= 0 ? t.inputIndex : e().chat.length - 1;
		ie.push({
			type: "recap.set",
			text: n.structures[w.id],
			coversUpTo: r - 1,
			source: "model"
		});
	}
	let se = t.stages.map((e) => {
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
	}), ce = {
		v: 1,
		presetId: s.id,
		presetVersion: s.version,
		genId: t.id,
		origin: t.origin,
		transport: t.transport,
		workflow: t.workflow?.id ?? "",
		turn: ne,
		stages: se,
		...d === void 0 ? {} : {
			draft: d,
			patched: f
		},
		...g?.length ? { annotations: g } : {},
		..._ && (_.draft.length || _.patched.length) ? { annotationVersions: _ } : {},
		...v?.length ? { speech: v } : {},
		...y && (y.draft.length || y.patched.length) ? { speechVersions: y } : {},
		patchesApplied: d !== void 0,
		structures: n.structures,
		events: ie,
		...t.meta.segments.length ? { metaInput: t.meta.segments } : {},
		...a ? { reasoning: a } : {},
		diagnostics: {
			warnings: l,
			requests: o.requests,
			usage: o.usage,
			durationMs: o.durationMs
		}
	}, T = {
		content: re,
		reasoning: a,
		sidecar: ce,
		...ae.length ? { global: ae } : {}
	};
	return oe ? pb.pending = {
		ctx: t,
		outcome: T,
		at: Date.now()
	} : e().eventSource.emit("advanced_preset_generation_completed", {
		genId: t.id,
		sidecar: ce
	}), ob.current?.genId === t.id && (ob.current.structures = n.structures), T;
}
//#endregion
//#region src/app/updater.ts
var xb = "advancedPreset.reloadedFor";
async function Sb() {
	try {
		let e = await S(`${d()}dist/build.json?t=${Date.now()}`, { cache: "no-store" });
		return e.ok ? (await e.json()).id ?? null : null;
	} catch {
		return null;
	}
}
function Cb(e) {
	sessionStorage.setItem(xb, e), x("info", Y("update.reloading")), setTimeout(() => location.reload(), 3e3);
}
async function wb() {
	let e = await Sb();
	e && e !== "2d6e0f3a54c3de27" && sessionStorage.getItem(xb) !== e && Cb(e);
}
async function Tb() {
	await wb();
}
var Eb = "/api/extensions/switch", Db = (e) => e.replace(/^third-party/, "").replace(/^\/+|\/+$/g, "");
function Ob(e, t, n) {
	if (!n.ok || typeof t.body != "string") return;
	let r;
	try {
		if (new URL(e, location.href).pathname !== Eb) return;
		r = JSON.parse(t.body).extensionName;
	} catch {
		return;
	}
	typeof r == "string" && Db(r) === Db(u()) && wb();
}
async function kb() {
	let e = u().replace(/^third-party\//, ""), t = await Nb(e, !1);
	if (t.status === 404 && (t = await Nb(e, !0)), !t.ok) throw Error(await t.text() || t.statusText);
	let n = await t.json(), r = await Sb();
	return r && r !== "2d6e0f3a54c3de27" ? (Cb(r), {
		upToDate: !1,
		reloading: !0
	}) : {
		upToDate: !!n.isUpToDate,
		reloading: !1
	};
}
async function Ab() {
	let e = await kb();
	return e.reloading || !e.upToDate ? "updated" : "current";
}
var jb = "advancedPreset.selfUpdateFor";
async function Mb(e, t) {
	let n = `1.12.0>${e}`;
	if (sessionStorage.getItem(jb) === n) return !1;
	sessionStorage.setItem(jb, n), x("info", Y("update.forPreset", {
		name: t,
		version: e
	}));
	try {
		return (await kb()).reloading;
	} catch (e) {
		return console.warn("[AP] self-update failed", e), !1;
	}
}
var Nb = (t, n) => S("/api/extensions/update", {
	method: "POST",
	headers: e().getRequestHeaders(),
	body: JSON.stringify({
		extensionName: t,
		global: n
	})
}), Pb = "__ap_gen_id";
function Fb(e) {
	return typeof e == "string" ? e : e instanceof URL ? e.href : e.url;
}
function Ib() {
	let e = globalThis.fetch;
	if (e.__apGate) return;
	ee(e.bind(globalThis));
	let t = async function(t, n) {
		if (n?.method === "POST" && typeof n.body == "string" && n.body.includes("__ap_gen_id") && new URL(Fb(t), location.href).pathname === "/api/backends/chat-completions/generate") {
			let e = null;
			try {
				e = JSON.parse(n.body);
			} catch {
				e = null;
			}
			let t = e?.[Pb], r = typeof t == "string" ? Dh.get(t) : void 0;
			if (e && r && !r.claimed) {
				delete e[Pb], r.claimed = !0;
				try {
					return n.signal?.throwIfAborted(), await gb(r, e, n.signal);
				} finally {
					Dh.release(t);
				}
			}
			e && (delete e[Pb], n = {
				...n,
				body: JSON.stringify(e)
			});
		}
		let r = await e.call(globalThis, t, n);
		return n?.method === "POST" && Ob(Fb(t), n, r), r;
	};
	t.__apGate = !0, globalThis.fetch = t;
}
function Lb(e) {
	let t = Dh.takeArmed();
	t && (e[Pb] = t.id);
}
//#endregion
//#region src/app/storylines.ts
async function Rb(e) {
	let t = await V_(e);
	if (t === "invalid") return x("warning", Y("storylines.invalidName"), Y("app.name")), !1;
	let n = "";
	for (; t === "needs-name" || t === "taken" || t === "invalid";) {
		t === "taken" && x("warning", Y("storylines.nameTaken", { name: n }), Y("app.name")), t === "invalid" && x("warning", Y("storylines.invalidName"), Y("app.name"));
		let r = await b(`<h3>${v(Y("storylines.switchTitle", { name: e }))}</h3><p>${v(Y("storylines.askOldMain"))}</p>`, n, Y("storylines.switch"), Y("common.cancel"));
		if (r === null) return !1;
		n = r.trim(), t = Xu(n) ? await V_(e, n) : "invalid";
	}
	return t === "switched" && x("success", Y("storylines.switched", { name: e }), Y("app.name")), !0;
}
async function zb(t, n, r) {
	let i = n.naming;
	if (!i.naming && !i.switching) {
		P_(t, n.current), i.hide && (z_(n.current, { hide: !0 }), await e().saveMetadata());
		return;
	}
	let a = r && typeof r == "object" ? r : {}, o = j_(), s = (e, t) => {
		let n = nd(td(e) || t, o);
		return o.add(n), n;
	};
	if (i.renameMain) {
		o.delete(O_().main ?? "");
		let e = s(a.name, Y("storylines.fallback.side"));
		return e !== O_().main && !await I_(e) && console.warn("[AP] storylines: could not rename the main storyline to", e), P_(t, "");
	}
	if (!i.switching) {
		let n = s(a.name, Y(i.ifLine ? "storylines.fallback.if" : "storylines.fallback.side"));
		z_(n, {
			ifLine: !!i.ifLine,
			hide: i.hide
		}), P_(t, n), await e().saveMetadata();
		return;
	}
	let c = i.target ?? s(a.name, Y("storylines.fallback.side")), l = i.oldName ?? (i.namingMain ? s(a.previous_main, Y("storylines.fallback.main")) : void 0), u = await V_(c, l);
	if (u !== "switched" && u !== "unchanged") return console.warn("[AP] storylines: main storyline not switched", u, {
		target: c,
		old: l
	}), x("warning", Y("storylines.switchFailed", { name: c }), Y("app.name")), P_(t, c);
	i.naming && n.input >= 0 && B_(n.input), P_(t, ""), u === "switched" && x("success", Y("storylines.switched", { name: c }), Y("app.name"));
}
function Bb(e, t) {
	if (!K().enabled) return e;
	let n = rh(), r = n ? wp(n) : void 0;
	if (!r || !D_(r, Im(r)) || Zu(e)) return e;
	let i = A_(), a = i[t ?? i.length - 1];
	return !a || Vp(a) ? e : $u(e.trimEnd(), a);
}
//#endregion
//#region src/app/memory-sync.ts
var Vb = "\0";
function Hb(e, t) {
	let n = e;
	if (n && typeof n == "object" && n.v === 1 && Array.isArray(n.events)) for (let e of n.events) {
		let r = hm(e);
		r && t.add(`${n.presetId}${Vb}${r}`);
	}
}
function Ub(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	for (let r of e) {
		if (!r || r.is_user) continue;
		let e = Array.isArray(r.swipes) ? r.swipes.length : 0, i = r.swipe_id ?? 0;
		(!e || i < e) && Hb(r.extra?.[sm], t), r.swipe_info?.forEach((e, t) => {
			t !== i && Hb(e?.extra?.[sm], n);
		});
	}
	for (let e of t) n.delete(e);
	return {
		active: t,
		inactive: n
	};
}
var Wb = null;
function Gb(t = {}) {
	let n = e(), r = String(n.getCurrentChatId?.() ?? ""), { active: i, inactive: a } = Ub(n.chat ?? []), o = new Set(a);
	if (Wb && !t.reload && Wb.chatId === r) for (let e of Wb.active) i.has(e) || o.add(e);
	Wb = {
		chatId: r,
		active: i
	};
	let s = /* @__PURE__ */ new Map(), c = (e, t) => {
		let [n, r] = e.split(Vb), i = s.get(n);
		i || s.set(n, i = {
			on: [],
			off: []
		}), (t ? i.on : i.off).push(r);
	};
	for (let e of o) c(e, !1);
	for (let e of i) c(e, !0);
	let l = !1, u = K().presets;
	for (let [e, t] of s) {
		let n = u[e];
		n?.globalMemory && (mm(n.globalMemory.log) && (l = !0), Mm(n, t.off, !1) && (l = !0), Mm(n, t.on, !0) && (l = !0));
	}
	return l && q(), l;
}
function Kb(e) {
	dm(e), Gb();
}
function qb() {
	let { eventSource: t, eventTypes: n } = e(), r = (e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n);
	n.MESSAGE_SWIPED && r(n.MESSAGE_SWIPED, (e) => Kb(Number(e)));
	for (let e of [n.MESSAGE_DELETED, n.MESSAGE_SWIPE_DELETED]) e && r(e, () => Gb());
	n.CHAT_CHANGED && r(n.CHAT_CHANGED, () => Gb({ reload: !0 }));
}
//#endregion
//#region src/store/media.ts
var Jb = {
	openai: {
		baseUrl: "https://api.openai.com/v1",
		model: "gpt-image-2.6-flare",
		nsfwBlock: !0
	},
	gemini: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-nano-banana-2.1",
		nsfwBlock: !0
	},
	novelai: {
		baseUrl: "https://image.novelai.net",
		model: "nai-diffusion-4-5-full",
		nsfwBlock: !1
	}
}, Yb = (e) => e === "openai" || e === "gemini", Xb = () => ({
	cors: {
		mode: "auto",
		proxy: "host",
		customUrl: ""
	},
	image: {
		enabled: !1,
		auto: !0,
		active: null,
		connections: []
	},
	speech: {
		enabled: !1,
		auto: !1,
		narrator: !1,
		active: null,
		connections: []
	}
});
function Zb() {
	let e = K(), t = Xb();
	(!e.media || typeof e.media != "object") && (e.media = t);
	let n = e.media;
	for (let [e, r] of Object.entries(t)) {
		let t = n[e];
		if (!t || typeof t != "object" || Array.isArray(t)) n[e] = r;
		else for (let [e, n] of Object.entries(r)) e in t || (t[e] = n);
	}
	return e.media;
}
var Qb = q, $b = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
function ex(e, t) {
	let n = Jb[e];
	return {
		id: $b(),
		name: t,
		api: e,
		baseUrl: n.baseUrl,
		apiKey: "",
		model: n.model,
		headers: {},
		body: "",
		style: "",
		negative: "",
		nsfwBlock: n.nsfwBlock,
		refs: []
	};
}
function tx(e, t) {
	if (e.api === t) return;
	let n = Jb[e.api], r = Jb[t];
	(!e.baseUrl || e.baseUrl === n.baseUrl) && (e.baseUrl = r.baseUrl), (!e.model || e.model === n.model) && (e.model = r.model), e.nsfwBlock === n.nsfwBlock && (e.nsfwBlock = r.nsfwBlock), e.api = t;
}
function nx(e) {
	return e.connections.find((t) => t.id === e.active) ?? e.connections[0];
}
function rx(e, t) {
	return {
		...JSON.parse(JSON.stringify(e)),
		id: $b(),
		name: t
	};
}
//#endregion
//#region src/store/media-db.ts
var ix = "advanced-preset-media", ax = "blobs", ox = null;
function sx() {
	return ox || (ox = new Promise((e, t) => {
		let n = indexedDB.open(ix, 1);
		n.onupgradeneeded = () => {
			n.result.objectStoreNames.contains(ax) || n.result.createObjectStore(ax);
		}, n.onsuccess = () => e(n.result), n.onerror = () => t(n.error);
	}), ox.catch(() => {
		ox = null;
	}), ox);
}
function cx(e, t) {
	return sx().then((n) => new Promise((r, i) => {
		let a = n.transaction(ax, e), o = t(a.objectStore(ax));
		a.oncomplete = () => r(o ? o.result : void 0), a.onerror = () => i(a.error), a.onabort = () => i(a.error);
	}));
}
async function lx(e, t = {}) {
	let n = t.key ?? `${t.prefix ?? ""}${$b()}`;
	return await cx("readwrite", (t) => t.put({
		blob: e,
		at: Date.now()
	}, n)), n;
}
async function ux(e) {
	return (await cx("readonly", (t) => t.get(e)))?.blob;
}
async function dx(e) {
	return !!await cx("readonly", (t) => t.count(e));
}
async function fx(e) {
	_x(e), await cx("readwrite", (t) => t.delete(e));
}
async function px(e = "") {
	let t = e ? IDBKeyRange.bound(e, `${e}\uffff`) : void 0;
	return (await cx("readonly", (e) => e.getAllKeys(t)) ?? []).map(String);
}
async function mx(e, t, n = 0) {
	let r = Date.now() - n, i = 0;
	for (let a of await px(e)) if (!t.has(a)) {
		if (n) {
			let e = await cx("readonly", (e) => e.get(a));
			if (e && e.at > r) continue;
		}
		await fx(a), i++;
	}
	return i;
}
var hx = /* @__PURE__ */ new Map();
async function gx(e) {
	let t = hx.get(e);
	if (t) return t;
	let n = await ux(e);
	if (!n) return;
	let r = URL.createObjectURL(n);
	return hx.set(e, r), r;
}
function _x(e) {
	let t = hx.get(e);
	t && (URL.revokeObjectURL(t), hx.delete(e));
}
async function vx(e) {
	let t = new Uint8Array(await e.arrayBuffer()), n = "";
	for (let e = 0; e < t.length; e += 32768) n += String.fromCharCode(...t.subarray(e, e + 32768));
	return btoa(n);
}
function yx(e, t) {
	let n = atob(e), r = new Uint8Array(n.length);
	for (let e = 0; e < n.length; e++) r[e] = n.charCodeAt(e);
	return new Blob([r], { type: t });
}
//#endregion
//#region src/media/net.ts
var bx = class extends Error {
	issue;
	constructor(e, t = `CORS proxy: ${e}`) {
		super(t), this.issue = e, this.name = "ProxyError";
	}
}, xx = class extends Error {
	status;
	body;
	constructor(e, t, n = "") {
		super(t), this.status = e, this.body = n, this.name = "MediaHttpError";
	}
}, Sx = /* @__PURE__ */ new Set(), Cx = (e) => {
	try {
		return new URL(e).origin;
	} catch {
		return e;
	}
};
function wx(e, t) {
	if (t.proxy === "custom") {
		let n = t.customUrl.trim();
		if (!n) throw new bx("noCustomUrl");
		return n.includes("{url}") ? n.replace("{url}", encodeURIComponent(e)) : n + e;
	}
	return `/proxy/${encodeURIComponent(e)}`;
}
function Tx(e = Zb().cors) {
	return { multipart: e.proxy === "custom" || t() };
}
var Ex = (e) => e == null || typeof e == "string";
async function Dx(n, r, i) {
	let a = wx(n, i);
	if (i.proxy === "custom") return S(a, r);
	let o = t();
	if (!Tx(i).multipart && !Ex(r.body)) throw new bx("body");
	let s = new Headers(r.headers), c = e().getRequestHeaders?.()["X-CSRF-Token"];
	c && !s.has("X-CSRF-Token") && s.set("X-CSRF-Token", c);
	let l = await S(a, {
		...r,
		headers: s
	});
	if (l.status === 404) {
		let e = l.headers.get("content-type") ?? "", t = e.includes("json") ? "" : await l.clone().text().catch(() => "");
		if (/CORS proxy is disabled/i.test(t)) throw new bx("disabled");
		if (o && (e.includes("html") || !t)) throw new bx("unsupported");
	}
	return l;
}
var Ox = (e) => e instanceof DOMException && e.name === "AbortError";
async function kx(e, t = {}, n = Zb().cors) {
	if (n.mode === "on") return Dx(e, t, n);
	if (n.mode === "off") return S(e, t);
	let r = Cx(e);
	if (Sx.has(r)) return Dx(e, t, n);
	try {
		return await S(e, t);
	} catch (i) {
		if (Ox(i) || !(i instanceof TypeError)) throw i;
		Sx.add(r);
		try {
			return await Dx(e, t, n);
		} catch (e) {
			throw e instanceof bx && Sx.delete(r), e;
		}
	}
}
function Ax(e, t) {
	let n = "";
	try {
		let e = JSON.parse(t), r = e?.error ?? e;
		n = typeof r == "string" ? r : String(r?.message ?? e?.message ?? e?.detail?.message ?? e?.detail ?? "");
	} catch {
		n = t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300);
	}
	return n ? `HTTP ${e}: ${n}` : `HTTP ${e}`;
}
async function jx(e) {
	if (e.ok) return e;
	let t = await e.text().catch(() => "");
	throw new xx(e.status, Ax(e.status, t), t);
}
//#endregion
//#region src/media/request.ts
var Mx = (e) => !!e && typeof e == "object" && !Array.isArray(e);
function Nx(e, t) {
	let n = { ...e };
	for (let [e, r] of Object.entries(t)) r === null ? delete n[e] : n[e] = Mx(r) && Mx(n[e]) ? Nx(n[e], r) : r;
	return n;
}
var Px = class extends Error {
	constructor(e) {
		super(e), this.name = "BodyOverrideError";
	}
};
function Fx(e) {
	let t = e.body.trim();
	if (!t) return {};
	let n;
	try {
		n = JSON.parse(t);
	} catch (e) {
		throw new Px(e instanceof Error ? e.message : String(e));
	}
	if (!Mx(n)) throw new Px("Not a JSON object");
	return n;
}
function Ix(e) {
	try {
		return Fx({ body: e }), "";
	} catch (e) {
		return e instanceof Error ? e.message : String(e);
	}
}
function Lx(e, t) {
	let n = new Headers(e);
	for (let [e, r] of Object.entries(t.headers ?? {})) e.trim() && (r === "" ? n.delete(e) : n.set(e, r));
	return n;
}
var Rx = (e, t) => `${e.replace(/\/+$/, "")}/${t.replace(/^\/+/, "")}`, zx = (e, t) => e.getUint16(t, !0), Bx = (e, t) => e.getUint32(t, !0);
async function Vx(e) {
	let t = new Blob([e]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
	return new Uint8Array(await new Response(t).arrayBuffer());
}
async function Hx(e) {
	let t = new DataView(e.buffer, e.byteOffset, e.byteLength), n = -1;
	for (let r = e.length - 22; r >= Math.max(0, e.length - 22 - 65535); r--) if (Bx(t, r) === 101010256) {
		n = r;
		break;
	}
	if (n < 0) throw Error("Not a ZIP archive");
	let r = zx(t, n + 10), i = Bx(t, n + 16), a = [], o = new TextDecoder();
	for (let n = 0; n < r; n++) {
		if (Bx(t, i) !== 33639248) throw Error("Broken ZIP directory");
		let n = zx(t, i + 10), r = Bx(t, i + 20), s = zx(t, i + 28), c = zx(t, i + 30), l = zx(t, i + 32), u = Bx(t, i + 42), d = o.decode(e.subarray(i + 46, i + 46 + s));
		if (i += 46 + s + c + l, d.endsWith("/")) continue;
		let f = u + 30 + zx(t, u + 26) + zx(t, u + 28), p = e.subarray(f, f + r);
		if (n === 0) a.push({
			name: d,
			data: p
		});
		else if (n === 8) a.push({
			name: d,
			data: await Vx(p)
		});
		else throw Error(`Unsupported ZIP compression ${n}`);
	}
	return a;
}
function Ux(e) {
	if (e[0] === 137 && e[1] === 80 && e[2] === 78 && e[3] === 71) return "image/png";
	if (e[0] === 255 && e[1] === 216 && e[2] === 255) return "image/jpeg";
	if (e[0] === 82 && e[1] === 73 && e[2] === 70 && e[3] === 70 && e[8] === 87 && e[9] === 69 && e[10] === 66 && e[11] === 80) return "image/webp";
	if (e[0] === 71 && e[1] === 73 && e[2] === 70) return "image/gif";
	let t = new TextDecoder().decode(e.subarray(0, 256)).trimStart();
	if (t.startsWith("<svg") || t.startsWith("<?xml") && t.includes("<svg")) return "image/svg+xml";
}
//#endregion
//#region src/media/image/providers.ts
function Wx(e, t) {
	let n = t.trim(), r = e.style.trim();
	return r ? e.api === "novelai" ? `${n.replace(/[,\s]+$/, "")}, ${r.replace(/^[,\s]+/, "")}` : `${n}\n\n${r}` : n;
}
var Gx = {
	"1:1": "1024x1024",
	"3:4": "1024x1536",
	"9:16": "1024x1536",
	"4:3": "1536x1024",
	"16:9": "1536x1024"
}, Kx = {
	"1:1": [1024, 1024],
	"3:4": [832, 1216],
	"9:16": [832, 1216],
	"4:3": [1216, 832],
	"16:9": [1216, 832]
}, qx = async (e) => `data:${e.type || "image/png"};base64,${await vx(e)}`, Jx = (e) => e.baseUrl.trim() || Jb[e.api].baseUrl, Yx = (e) => e.model.trim() || Jb[e.api].model, Xx = (e, t) => ({
	method: "POST",
	headers: e,
	body: JSON.stringify(t)
});
async function Zx(e, t) {
	let n = Wx(e, t.prompt), r = {
		model: Yx(e),
		prompt: n,
		n: 1,
		size: t.ratio ? Gx[t.ratio] : "auto"
	};
	t.refs.length && (r.images = await Promise.all(t.refs.map(async (e) => ({ image_url: await qx(e.blob) }))));
	let i = Lx({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e);
	return {
		url: Rx(Jx(e), t.refs.length ? "images/edits" : "images/generations"),
		init: Xx(i, Nx(r, Fx(e)))
	};
}
var Qx = (e) => e.description ? `Reference image ${e.id}: ${e.description}` : `Reference image ${e.id}`;
async function $x(e, t) {
	let n = Wx(e, t.prompt), r = await Promise.all(t.refs.map(async (e) => ({
		ref: e,
		mime: e.blob.type || "image/png",
		data: await vx(e.blob)
	}))), i = e.apiKey ? { "x-goog-api-key": e.apiKey } : {};
	if (e.endpoint === "generateContent") {
		let a = [];
		for (let e of r) a.push({ text: Qx(e.ref) }, { inline_data: {
			mime_type: e.mime,
			data: e.data
		} });
		a.push({ text: n });
		let o = { responseModalities: ["IMAGE"] };
		t.ratio && (o.imageConfig = { aspectRatio: t.ratio });
		let s = Lx({
			"Content-Type": "application/json",
			...i
		}, e), c = Nx({
			contents: [{
				role: "user",
				parts: a
			}],
			generationConfig: o
		}, Fx(e));
		return {
			url: Rx(Jx(e), `models/${encodeURIComponent(Yx(e))}:generateContent`),
			init: Xx(s, c)
		};
	}
	let a = [];
	for (let e of r) a.push({
		type: "text",
		text: Qx(e.ref)
	}, {
		type: "image",
		mime_type: e.mime,
		data: e.data
	});
	a.push({
		type: "text",
		text: n
	});
	let o = { type: "image" };
	t.ratio && (o.aspect_ratio = t.ratio);
	let s = Lx({
		"Content-Type": "application/json",
		"Api-Revision": "2026-05-20",
		...i
	}, e), c = Nx({
		model: Yx(e),
		input: a,
		response_format: o
	}, Fx(e));
	return {
		url: Rx(Jx(e), "interactions"),
		init: Xx(s, c)
	};
}
function eS(e, t) {
	let n = Wx(e, t.prompt), r = (e.negative ?? "").trim(), [i, a] = Kx[t.ratio ?? "3:4"], o = {
		params_version: 3,
		width: i,
		height: a,
		scale: 5,
		sampler: "k_euler_ancestral",
		steps: 28,
		n_samples: 1,
		ucPreset: 0,
		qualityToggle: !0,
		sm: !1,
		sm_dyn: !1,
		dynamic_thresholding: !1,
		cfg_rescale: 0,
		noise_schedule: "karras",
		legacy: !1,
		legacy_v3_extend: !1,
		add_original_image: !0,
		use_coords: !1,
		seed: Math.floor(Math.random() * 4294967295),
		characterPrompts: [],
		v4_prompt: {
			caption: {
				base_caption: n,
				char_captions: []
			},
			use_coords: !1,
			use_order: !0
		},
		v4_negative_prompt: {
			caption: {
				base_caption: r,
				char_captions: []
			},
			legacy_uc: !1
		},
		negative_prompt: r,
		deliberate_euler_ancestral_bug: !1,
		prefer_brownian: !0
	}, s = Lx({
		"Content-Type": "application/json",
		...e.apiKey ? { Authorization: `Bearer ${e.apiKey}` } : {}
	}, e), c = Nx({
		input: n,
		model: Yx(e),
		action: "generate",
		parameters: o
	}, Fx(e));
	return {
		url: Rx(Jx(e), "ai/generate-image"),
		init: Xx(s, c)
	};
}
async function tS(e, t) {
	switch (e.api) {
		case "openai": return Zx(e, t);
		case "gemini": return $x(e, t);
		case "novelai": return eS(e, {
			...t,
			refs: []
		});
	}
}
function nS(e) {
	let t = [], n = (e, r = "") => {
		if (!e || typeof e != "object" || r === "input" || r === "contents") return;
		if (Array.isArray(e)) {
			e.forEach((e) => n(e));
			return;
		}
		let i = e, a = i.inlineData ?? i.inline_data;
		if (a && typeof a.data == "string") t.push({
			mime: String(a.mimeType ?? a.mime_type ?? "image/png"),
			data: a.data
		});
		else if (i.type === "image" && typeof i.data == "string") t.push({
			mime: String(i.mime_type ?? i.mimeType ?? "image/png"),
			data: i.data
		});
		else for (let [e, t] of Object.entries(i)) n(t, e);
	}, r = e?.steps;
	Array.isArray(r) && r.filter((e) => e.type === "model_output").forEach((e) => n(e.content)), t.length || n(e);
	let i = /* @__PURE__ */ new Set();
	return t.filter((e) => !i.has(e.data) && (i.add(e.data), !0));
}
function rS(e) {
	let t = [], n = (e, r = "") => {
		if (!e || typeof e != "object" || r === "input" || r === "contents") return;
		if (Array.isArray(e)) {
			e.forEach((e) => n(e));
			return;
		}
		let i = e;
		typeof i.text == "string" && !i.thought && t.push(i.text);
		for (let [e, t] of Object.entries(i)) e !== "text" && n(t, e);
	};
	n(e);
	let r = e?.promptFeedback?.blockReason ?? e?.candidates?.[0]?.finishReason;
	return [t.join(" ").trim(), r && r !== "STOP" ? r : ""].filter(Boolean).join(" · ");
}
var iS = (e, t = "image/png") => new Blob([e], { type: Ux(e) ?? t });
async function aS(e, t, n) {
	if (e.api === "novelai") {
		let e = new Uint8Array(await t.arrayBuffer());
		return Ux(e) ? [iS(e)] : (await Hx(e)).filter((e) => Ux(e.data)).map((e) => iS(e.data));
	}
	let r = await t.json();
	if (e.api === "gemini") {
		let e = nS(r).map((e) => yx(e.data, e.mime));
		if (!e.length) throw Error(rS(r) || "No image in the response");
		return e;
	}
	let i = r?.data ?? [], a = [];
	for (let e of i) if (e.b64_json) {
		let t = yx(e.b64_json, "image/png");
		a.push(iS(new Uint8Array(await t.arrayBuffer())));
	} else e.url && a.push(await (await jx(await kx(e.url, { signal: n }))).blob());
	if (!a.length) throw Error("No image in the response");
	return a;
}
async function oS(e, t, n) {
	let { url: r, init: i } = await tS(e, t);
	return aS(e, await jx(await kx(r, {
		...i,
		signal: n
	})), n);
}
//#endregion
//#region src/ui/state.ts
var X = /* @__PURE__ */ fn({
	chatRev: 0,
	presetId: null,
	panelOpen: !1,
	tab: "presets",
	storylineFocus: null
}), sS = () => {
	X.chatRev++;
}, cS = () => {
	X.presetId = rh();
}, lS = G(() => X.presetId ? wp(X.presetId) : void 0), uS = G(() => {
	let e = lS.value;
	if (!e) return { config: "" };
	let t = Nm(e), n = t.active.ref;
	return { config: n.kind === "saved" ? t.saved.find((e) => e.id === n.id)?.name ?? "" : Pp(e, "configurations", n.id, "name", e.configurations.find((e) => e.id === n.id)?.name ?? n.id) };
});
function dS(t) {
	return X.chatRev, e().chat[t];
}
function fS(e) {
	return cm(dS(e));
}
function pS(e) {
	X.storylineFocus = e, mS("storylines");
}
function mS(e) {
	e && (X.tab = e), X.panelOpen = !0;
}
//#endregion
//#region src/app/images.ts
var hS = /* @__PURE__ */ fn(/* @__PURE__ */ new Map()), gS = (e, t, n) => `${e}:${t}:${n}`;
function _S() {
	let e = Zb().image;
	return e.enabled ? nx(e) : void 0;
}
function vS() {
	let e = Zb().image, t = _S();
	if (!t) return {
		vars: { ...mc },
		refs: []
	};
	let n = Yb(t.api) ? t.refs.map((e) => ({
		id: e.id,
		description: e.description
	})) : [];
	return {
		vars: {
			on: !0,
			auto: e.auto,
			api: t.api,
			style: !!t.style.trim(),
			sfw: t.nsfwBlock,
			refs: n.length > 0
		},
		refs: n
	};
}
var yS = (e) => e?.image ? Object.values(e.structures).filter((e) => e.kind === "image") : [], bS = (e, t) => Cc(e?.structures?.[t])?.images ?? [], xS = (e, t, n) => e?.images?.[t]?.[n]?.prompt ?? bS(e, t)[n]?.prompt ?? "";
function SS(t, n) {
	let r = e().chat, i = (e) => {
		let n = r[e];
		if (!n || n.is_user) return null;
		if (cm(n)?.genId === t) return {
			mesId: e,
			swipe: null
		};
		let i = n.swipe_info?.findIndex((e) => e?.extra?.advanced_preset?.genId === t) ?? -1;
		return i >= 0 && i !== (n.swipe_id ?? 0) ? {
			mesId: e,
			swipe: i
		} : null;
	}, a = i(n);
	if (a) return a;
	for (let e = r.length - 1; e >= 0; e--) {
		let t = i(e);
		if (t) return t;
	}
	return null;
}
async function CS(t, n, r) {
	let i = SS(t, n);
	if (!i) return !1;
	let a = e().chat[i.mesId];
	if (i.swipe === null) {
		let e = cm(a), t = structuredClone(e.images ?? {});
		r(t), um(i.mesId, {
			...e,
			images: t
		});
	} else {
		let e = a.swipe_info[i.swipe].extra[sm], t = structuredClone(e.images ?? {});
		r(t), e.images = t;
	}
	return sS(), await e().saveChat(), !0;
}
var wS = (e, t, n) => {
	let r = e[t] ??= [];
	for (let e = r.length; e <= n; e++) r[e] = { keys: [] };
	return r[n];
};
async function TS(e, t) {
	if (!Yb(e.api) || !t?.length) return [];
	let n = [];
	for (let r of t) {
		let t = e.refs.find((e) => e.id === r), i = t && await ux(t.blob);
		t && i && n.push({
			id: t.id,
			description: t.description,
			blob: i
		});
	}
	return n;
}
var ES = class extends Error {
	constructor() {
		super("No image connection"), this.name = "NoImageConnection";
	}
};
async function DS(t, n, r) {
	let i = cm(e().chat[t]);
	if (!i) return;
	let a = gS(i.genId, n, r);
	if (hS.get(a)?.status === "running") return;
	let o = new AbortController();
	hS.set(a, {
		status: "running",
		abort: o
	});
	try {
		let e = _S();
		if (!e) throw new ES();
		let s = bS(i, n)[r], c = xS(i, n, r);
		if (!s || !c.trim()) return;
		let l = await oS(e, {
			prompt: c,
			ratio: s.ratio,
			refs: await TS(e, s.refs)
		}, o.signal), u = [];
		for (let e of l) u.push(await lx(e, { prefix: "img:" }));
		if (!await CS(i.genId, t, (e) => {
			let t = wS(e, n, r);
			t.keys.push(...u), t.shown = t.keys.length - 1;
		})) for (let e of u) fx(e);
		hS.delete(a);
	} catch (e) {
		o.signal.aborted ? hS.delete(a) : (hS.set(a, {
			status: "error",
			error: e
		}), console.warn("[AP] image generation failed", e));
	} finally {
		hS.get(a)?.status === "running" && hS.delete(a);
	}
}
function OS(e, t, n) {
	let r = hS.get(gS(e, t, n));
	r?.status === "running" ? r.abort.abort() : hS.delete(gS(e, t, n));
}
async function kS(t, n, r, i) {
	let a = cm(e().chat[t]);
	if (!a) return;
	let o = bS(a, n)[r]?.prompt ?? "";
	await CS(a.genId, t, (e) => {
		let t = wS(e, n, r);
		!i.trim() || i === o ? delete t.prompt : t.prompt = i;
	});
}
async function AS(t, n, r, i) {
	let a = cm(e().chat[t]);
	a && await CS(a.genId, t, (e) => {
		wS(e, n, r).shown = i;
	});
}
async function jS(t, n, r, i) {
	let a = cm(e().chat[t]);
	a && (await CS(a.genId, t, (e) => {
		let t = wS(e, n, r), a = t.keys.indexOf(i);
		a < 0 || (t.keys.splice(a, 1), t.shown !== void 0 && t.shown >= a && (t.shown = Math.max(0, t.shown - 1)));
	}), await fx(i));
}
async function MS(t) {
	let n = Zb().image;
	if (!n.enabled || !n.auto || !_S()) return;
	let r = cm(e().chat[t]);
	if (r && r.origin === "story") for (let e of yS(wp(r.presetId))) {
		let n = bS(r, e.id);
		for (let i = 0; i < n.length; i++) {
			if (r.images?.[e.id]?.[i]?.keys.length) continue;
			let n = SS(r.genId, t);
			if (!n || n.swipe !== null) return;
			await DS(n.mesId, e.id, i);
		}
	}
}
function NS() {
	W_({ image: vS });
}
//#endregion
//#region src/app/receive.ts
var PS = 6e5, FS = /* @__PURE__ */ new Set(["impersonate", "quiet"]);
async function IS(t, n) {
	let r = pb.pending;
	if (!r || Date.now() - r.at > PS || FS.has(n ?? "")) return;
	let i = e().chat[t];
	if (!i || i.is_user) return;
	pb.pending = null;
	let { outcome: a } = r;
	if (a.content && i.mes !== a.content && (i.mes = a.content, Array.isArray(i.swipes) && (i.swipes[i.swipe_id ?? 0] = a.content)), um(t, a.sidecar), r.ctx.storylines) {
		let e = r.ctx.structures.find((e) => e.kind === "storyline");
		await zb(t, r.ctx.storylines, e ? a.sidecar.structures?.[e.id] : void 0);
	}
	a.global?.length && jm(Nm(r.ctx.preset), a.global), Gb(), ob.current?.genId === r.ctx.id && lb(ob.current, t), e().updateMessageBlock(t, i), await e().saveChat(), await e().eventSource.emit("advanced_preset_message_updated", t), MS(t);
}
//#endregion
//#region src/app/annotations.ts
var LS = /* @__PURE__ */ new Set();
function RS(e) {
	for (let t of LS) try {
		t(e);
	} catch (e) {
		console.error("[AP] annotations listener failed", e);
	}
}
function zS(t) {
	let n = e().chat[t], r = cm(n)?.annotations;
	return !n || !r?.length ? [] : uc(n.mes, r).annotations;
}
function BS(t) {
	let n = e().chat[t], r = cm(n);
	if (!n || !r?.annotations?.length) return !1;
	let i = uc(n.mes, r.annotations);
	return i.changed ? (um(t, {
		...r,
		annotations: i.annotations
	}), !0) : !1;
}
function VS() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (BS(n) && e().saveChat(), RS(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => RS(Number(e)));
}
var HS = {
	get: (e) => zS(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return LS.add(t), () => LS.delete(t);
	}
}, US = /* @__PURE__ */ new Set();
function WS(e) {
	for (let t of US) try {
		t(e);
	} catch (e) {
		console.error("[AP] speech listener failed", e);
	}
}
function GS(t) {
	let n = e().chat[t], r = cm(n)?.speech;
	return !n || !r?.length ? [] : Mc(n.mes, r).spans;
}
function KS(t) {
	let n = e().chat[t], r = cm(n);
	if (!n || !r?.speech?.length) return !1;
	let i = Mc(n.mes, r.speech);
	return i.changed ? (um(t, {
		...r,
		speech: i.spans
	}), !0) : !1;
}
function qS() {
	let { eventSource: t, eventTypes: n } = e(), r = (t) => {
		let n = Number(t);
		Number.isNaN(n) || (KS(n) && e().saveChat(), WS(n));
	};
	for (let e of [n.MESSAGE_EDITED, n.MESSAGE_UPDATED]) e && t.on(e, r);
	for (let e of [n.MESSAGE_SWIPED, "advanced_preset_message_updated"]) e && t.on(e, (e) => WS(Number(e)));
}
var JS = {
	get: (e) => GS(e).filter((e) => !e.orphan).map((e) => ({ ...e })),
	on(e, t) {
		if (e !== "change") throw Error(`unknown event ${String(e)}`);
		return US.add(t), () => US.delete(t);
	}
}, YS = (e) => !!e?.image, XS = (e) => !!e?.speech, ZS = (e) => YS(e) || XS(e);
//#endregion
//#region src/ui/media/errors.ts
function QS(e) {
	return e instanceof bx ? Y(`media.error.proxy.${e.issue}`) : e instanceof xx ? e.message : e instanceof Error && e.name === "NoImageConnection" ? Y("media.error.noConnection") : e instanceof TypeError ? Y("media.error.network") : e instanceof Px ? Y("media.error.body", { error: e.message }) : e instanceof Error ? e.message : String(e);
}
//#endregion
//#region src/media/speech/clip.ts
var $S = class e {
	chunks = [];
	state = "loading";
	error = null;
	sampleRate = 24e3;
	waiters = [];
	ctrl = new AbortController();
	done;
	constructor(e, t) {
		this.done = (async () => {
			try {
				let t = await e(this.ctrl.signal);
				this.sampleRate = t.sampleRate;
				for await (let e of t.chunks) this.chunks.push(e), this.wake();
				if (!this.bytes()) throw Error("The provider returned no audio.");
				this.state = "ready";
			} catch (e) {
				this.state = "error", this.error = e;
			}
			this.wake(), t?.(this);
		})();
	}
	static of(t, n) {
		return new e(async () => ({
			sampleRate: n,
			chunks: (async function* () {
				yield t;
			})()
		}));
	}
	wake() {
		let e = this.waiters;
		this.waiters = [];
		for (let t of e) t();
	}
	bytes() {
		return this.chunks.reduce((e, t) => e + t.length, 0);
	}
	pcm() {
		let e = new Uint8Array(this.bytes()), t = 0;
		for (let n of this.chunks) e.set(n, t), t += n.length;
		return e;
	}
	async *read() {
		let e = 0;
		for (;;) {
			for (; e < this.chunks.length;) yield this.chunks[e++];
			if (this.state === "error") throw this.error;
			if (this.state === "ready") return;
			await new Promise((e) => this.waiters.push(e));
		}
	}
	abort() {
		this.state === "loading" && this.ctrl.abort();
	}
}, eC = null;
function tC() {
	return (!eC || eC.state === "closed") && (eC = new AudioContext()), eC;
}
var nC = class {
	carry = null;
	push(e) {
		let t = this.carry === null ? 0 : 1, n = e.length + t >> 1, r = new Float32Array(n), i = 0, a = 0;
		for (this.carry !== null && e.length && (r[a++] = rC(this.carry | e[0] << 8), i = 1, this.carry = null); i + 1 < e.length; i += 2) r[a++] = rC(e[i] | e[i + 1] << 8);
		return i < e.length && (this.carry = e[i]), a === n ? r : r.subarray(0, a);
	}
}, rC = (e) => (e & 32768 ? e - 65536 : e) / 32768, iC = .15, aC = 1.2, oC = class {
	clip;
	sources = /* @__PURE__ */ new Set();
	stopped = !1;
	scheduled = 0;
	constructor(e) {
		this.clip = e;
	}
	async run() {
		let e = tC();
		e.state === "suspended" && await e.resume().catch(() => void 0);
		let t = this.clip.sampleRate, n = new nC(), r = [], i = 0, a = 0, o = iC, s = !1, c = null, l = () => {
			if (!i || this.stopped) return;
			let n = e.createBuffer(1, i, t), l = n.getChannelData(0), u = 0;
			for (let e of r) l.set(e, u), u += e.length;
			r = [], i = 0;
			let d = e.createBufferSource();
			d.buffer = n, d.connect(e.destination), s && a < e.currentTime && (o = Math.min(o * 2, aC)), s = !0, a = Math.max(a, e.currentTime + .05), d.start(a), a += n.duration, this.scheduled += n.duration, this.sources.add(d), d.onended = () => this.sources.delete(d), c = d;
		};
		for await (let e of this.clip.read()) {
			if (this.stopped) return;
			let a = n.push(e);
			a.length && (r.push(a), i += a.length, i >= t * o && l());
		}
		l();
		let u = c;
		u && !this.stopped && await new Promise((e) => {
			let t = () => e();
			if (!this.sources.has(u)) return t();
			u.addEventListener("ended", t, { once: !0 }), this.onStop = t;
		});
	}
	onStop = null;
	stop() {
		this.stopped = !0;
		for (let e of this.sources) try {
			e.stop();
		} catch {}
		this.sources.clear(), this.onStop?.();
	}
};
async function sC() {
	eC?.state === "running" && await eC.suspend();
}
async function cC() {
	eC?.state === "suspended" && await eC.resume();
}
//#endregion
//#region src/media/speech/util.ts
var lC = class extends Error {
	status;
	constructor(e, t) {
		super(e), this.status = t, this.name = "SpeechError";
	}
}, uC = (e, t) => e.baseUrl.trim() || t, dC = (e, t) => Nx(t, Fx(e));
function fC(e, t) {
	let n = {}, r = (e, t) => {
		for (let t of Object.keys(n)) t.toLowerCase() === e.toLowerCase() && delete n[t];
		t !== "" && (n[e] = t);
	};
	for (let [e, n] of Object.entries(t)) r(e, n);
	for (let [t, n] of Object.entries(e.headers ?? {})) t.trim() && r(t.trim(), n);
	return n;
}
async function* pC(e, t) {
	if (!e.body) {
		yield new Uint8Array(await e.arrayBuffer());
		return;
	}
	let n = e.body.getReader(), r = () => n.cancel().catch(() => void 0);
	t?.addEventListener("abort", r, { once: !0 });
	try {
		for (;;) {
			let { done: e, value: r } = await n.read();
			if (t?.aborted) throw new DOMException("Aborted", "AbortError");
			if (e) break;
			r?.length && (yield r);
		}
	} finally {
		t?.removeEventListener("abort", r);
	}
}
function mC(e, t) {
	if (!e.body) throw new lC("Empty response.");
	return ib(e.body, t);
}
function hC(e) {
	let t = atob(e), n = new Uint8Array(t.length);
	for (let e = 0; e < t.length; e++) n[e] = t.charCodeAt(e);
	return n;
}
function gC(e) {
	let t = e.length >> 1, n = new Uint8Array(t);
	for (let r = 0; r < t; r++) n[r] = parseInt(e.substr(r * 2, 2), 16);
	return n;
}
async function* _C(e) {
	let t = /* @__PURE__ */ new Uint8Array(), n = !1;
	for await (let r of e) {
		if (n) {
			yield r;
			continue;
		}
		let e = new Uint8Array(t.length + r.length);
		if (e.set(t), e.set(r, t.length), t = e, t.length < 12) continue;
		let i = String.fromCharCode(...t.subarray(0, 4)) + String.fromCharCode(...t.subarray(8, 12)) === "RIFFWAVE" ? vC(t) : 0;
		i < 0 || (n = !0, t.length > i && (yield t.subarray(i)));
	}
	!n && t.length && (yield t);
}
function vC(e) {
	let t = 12;
	for (; t + 8 <= e.length;) {
		let n = String.fromCharCode(...e.subarray(t, t + 4)), r = e[t + 4] | e[t + 5] << 8 | e[t + 6] << 16 | e[t + 7] << 24;
		if (n === "data") return t + 8;
		t += 8 + r + (r & 1);
	}
	return -1;
}
//#endregion
//#region src/media/speech/providers/deepseek.ts
var yC = {
	api: "deepseek",
	defaults: {
		baseUrl: "https://api.deepseek.com/v1",
		model: ""
	},
	models: [],
	voices: [{
		id: "stella",
		name: "Stella",
		description: "海星"
	}, {
		id: "tide",
		name: "Tide",
		description: "暗潮"
	}],
	format: "",
	tags: null,
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		if (r?.kind === "clone") throw new lC("DeepSeek does not support voice cloning.");
		let a = dC(t, {
			text: n,
			voice_id: r?.id ?? this.voices[0].id,
			format: "pcm"
		});
		return {
			sampleRate: 24e3,
			chunks: _C(pC(await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "tools/tts"), {
				method: "POST",
				headers: fC(t, {
					"Content-Type": "application/json",
					Authorization: `Bearer ${t.apiKey}`
				}),
				body: JSON.stringify(a),
				signal: i
			})), i))
		};
	}
}, bC = 24e3, xC = [
	["JBFqnCBsd6RMkjVDRZzb", "George"],
	["21m00Tcm4TlvDq8ikWAM", "Rachel"],
	["EXAVITQu4vr4xnSDxMaL", "Sarah"],
	["pNInz6obpgDQGcFmaJgB", "Adam"],
	["nPczCjzI2devNBz1zQrb", "Brian"],
	["pFZP5JQG7iQjIQuC4Bku", "Lily"],
	["IKne3meq5aSn9XLyUdCD", "Charlie"],
	["XB0fDUnXU5powFXDhCwa", "Charlotte"]
], SC = (e) => ({ "xi-api-key": e }), CC = {
	api: "elevenlabs",
	defaults: {
		baseUrl: "https://api.elevenlabs.io",
		model: "eleven_v3"
	},
	models: [
		"eleven_v3",
		"eleven_v4",
		"eleven_v4_turbo",
		"eleven_multilingual_v2",
		"eleven_flash_v2_5"
	],
	voices: xC.map(([e, t]) => ({
		id: e,
		name: t
	})),
	format: "Inside a speech tag you may add ElevenLabs audio tags in square brackets right before the words they affect: emotions such as [excited] [sad] [angry] [nervous] [sarcastic] [curious], delivery such as [whispers] [shouts] [softly], and sounds such as [laughs] [sighs] [gasps] [crying] [clears throat]; use [pause] or an ellipsis for a pause. Example: <speech character=\"Mia\">[whispers] Don't move. [pause] Something is out there.</speech>",
	tags: /\[[^[\]\n]{1,60}\]/g,
	clone: { text: "none" },
	async search(e, t, n, r) {
		let i = uC(t, this.defaults.baseUrl), a = fC(t, SC(t.apiKey)), o = n.trim(), s = new URL(Rx(i, "v2/voices"));
		s.searchParams.set("page_size", "30"), o && s.searchParams.set("search", o);
		let c = new URL(Rx(i, "v1/shared-voices"));
		c.searchParams.set("page_size", "30"), o && c.searchParams.set("search", o);
		let l = async (t) => (await (await jx(await e.fetch(t.toString(), {
			headers: a,
			signal: r
		}))).json()).voices ?? [], [u, d] = await Promise.all([l(s), l(c).catch(() => [])]), f = new Set(u.map((e) => e.voice_id));
		return [...u, ...d.filter((e) => !f.has(e.voice_id))].map((e) => ({
			id: e.voice_id,
			name: e.name || e.voice_id,
			description: e.description || void 0,
			preview: e.preview_url || void 0,
			owner: e.public_owner_id || void 0
		}));
	},
	async adopt(e, t, n, r) {
		if (!n.owner) return n.id;
		let i = Rx(uC(t, this.defaults.baseUrl), `v1/voices/add/${encodeURIComponent(n.owner)}/${encodeURIComponent(n.id)}`), a = await e.fetch(i, {
			method: "POST",
			headers: fC(t, {
				...SC(t.apiKey),
				"Content-Type": "application/json"
			}),
			body: JSON.stringify({ new_name: n.name }),
			signal: r
		});
		return a.status === 400 || a.status === 409 ? n.id : (await (await jx(a)).json()).voice_id || n.id;
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new lC("Reference audio is missing.");
		let a = new FormData();
		a.append("name", `AP ${n.audio.slice(-8)}`), a.append("files", i, "reference");
		let o = (await (await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "v1/voices/add"), {
			method: "POST",
			headers: fC(t, SC(t.apiKey)),
			body: a,
			signal: r
		}))).json()).voice_id;
		if (!o) throw new lC("No voice id returned.");
		return o;
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = r?.kind === "voice" ? r.id : r?.id;
		if (r?.kind === "clone" && !a) throw new lC("The cloned voice has not been created.");
		let o = new URL(Rx(uC(t, this.defaults.baseUrl), `v1/text-to-speech/${encodeURIComponent(a || xC[0][0])}/stream`));
		o.searchParams.set("output_format", `pcm_${bC}`);
		let s = dC(t, {
			text: n,
			model_id: t.model || this.defaults.model
		});
		return {
			sampleRate: bC,
			chunks: pC(await jx(await e.fetch(o.toString(), {
				method: "POST",
				headers: fC(t, {
					...SC(t.apiKey),
					"Content-Type": "application/json"
				}),
				body: JSON.stringify(s),
				signal: i
			})), i)
		};
	}
};
//#endregion
//#region src/media/speech/msgpack.ts
function wC(e) {
	let t = [], n = (e) => {
		t.push(e & 255);
	}, r = (e) => {
		n(e >> 8), n(e);
	}, i = (e) => {
		n(e >>> 24), n(e >>> 16), n(e >>> 8), n(e);
	}, a = (e) => {
		for (let n = 0; n < e.length; n++) t.push(e[n]);
	}, o = (e) => {
		if (e == null) return n(192);
		if (e === !1) return n(194);
		if (e === !0) return n(195);
		if (typeof e == "number") {
			if (Number.isInteger(e) && e >= 0 && e < 2 ** 32) return e < 128 ? n(e) : e < 256 ? (n(204), n(e)) : e < 65536 ? (n(205), r(e)) : (n(206), i(e));
			if (Number.isInteger(e) && e < 0 && e >= -(2 ** 31)) return e >= -32 ? n(e) : (n(210), i(e));
			let t = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
			return t.setFloat64(0, e), n(203), a(new Uint8Array(t.buffer));
		}
		if (typeof e == "string") {
			let t = new TextEncoder().encode(e);
			return t.length < 32 ? n(160 | t.length) : t.length < 256 ? (n(217), n(t.length)) : t.length < 65536 ? (n(218), r(t.length)) : (n(219), i(t.length)), a(t);
		}
		if (e instanceof Uint8Array) return e.length < 256 ? (n(196), n(e.length)) : e.length < 65536 ? (n(197), r(e.length)) : (n(198), i(e.length)), a(e);
		if (Array.isArray(e)) {
			e.length < 16 ? n(144 | e.length) : e.length < 65536 ? (n(220), r(e.length)) : (n(221), i(e.length));
			for (let t of e) o(t);
			return;
		}
		let t = Object.entries(e).filter(([, e]) => e !== void 0);
		t.length < 16 ? n(128 | t.length) : t.length < 65536 ? (n(222), r(t.length)) : (n(223), i(t.length));
		for (let [e, n] of t) o(e), o(n);
	};
	return o(e), new Uint8Array(t);
}
//#endregion
//#region src/media/speech/providers/fish.ts
var TC = 24e3, EC = {
	api: "fish",
	defaults: {
		baseUrl: "https://api.fish.audio",
		model: "s2.1-pro"
	},
	models: [
		"s2.1-pro",
		"s2.1-pro-free",
		"s2-pro",
		"drama-3",
		"s3-pro"
	],
	voices: [],
	format: "Inside a speech tag you may add Fish Audio delivery cues in square brackets right before the words they affect: emotions such as [happy] [sad] [angry] [nervous] [sarcastic], tones such as [whispering] [shouting] [soft tone], sounds such as [laughing] [sighing] [gasping] [sobbing], pauses [break] [long-break], or a short free-form direction like [quietly, voice trembling]. Example: <speech character=\"Mia\">[whispering] Don't move. [break] Something is out there.</speech>",
	tags: /\[[^[\]\n]{1,60}\]/g,
	clone: { text: "optional" },
	async search(e, t, n, r) {
		let i = new URL(Rx(uC(t, this.defaults.baseUrl), "model"));
		return i.searchParams.set("page_size", "20"), n.trim() && i.searchParams.set("title", n.trim()), ((await (await jx(await e.fetch(i.toString(), {
			headers: fC(t, t.apiKey ? { Authorization: `Bearer ${t.apiKey}` } : {}),
			signal: r
		}))).json()).items ?? []).map((e) => ({
			id: e._id,
			name: e.title?.trim() || e._id,
			description: e.description || void 0,
			preview: e.samples?.[0]?.audio || void 0
		}));
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = {
			text: n,
			format: "pcm",
			sample_rate: TC,
			latency: "balanced"
		};
		r?.kind === "voice" && (a.reference_id = r.id);
		let o = dC(t, a), s = {
			Authorization: `Bearer ${t.apiKey}`,
			model: t.model || this.defaults.model
		}, c;
		if (r?.kind === "clone") {
			let t = await e.blob(r.audio);
			if (!t) throw new lC("Reference audio is missing.");
			let n = {
				audio: new Uint8Array(await t.arrayBuffer()),
				text: r.text ?? ""
			};
			c = wC({
				...o,
				references: [n]
			}), s["Content-Type"] = "application/msgpack";
		} else c = JSON.stringify(o), s["Content-Type"] = "application/json";
		let l = await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "v1/tts"), {
			method: "POST",
			headers: fC(t, s),
			body: c,
			signal: i
		}));
		return {
			sampleRate: Number(o.sample_rate) || TC,
			chunks: pC(l, i)
		};
	}
}, DC = [
	["Kore", "Firm"],
	["Puck", "Upbeat"],
	["Zephyr", "Bright"],
	["Charon", "Informative"],
	["Fenrir", "Excitable"],
	["Leda", "Youthful"],
	["Orus", "Firm"],
	["Aoede", "Breezy"],
	["Callirrhoe", "Easy-going"],
	["Autonoe", "Bright"],
	["Enceladus", "Breathy"],
	["Iapetus", "Clear"],
	["Umbriel", "Easy-going"],
	["Algieba", "Smooth"],
	["Despina", "Smooth"],
	["Erinome", "Clear"],
	["Algenib", "Gravelly"],
	["Rasalgethi", "Informative"],
	["Laomedeia", "Upbeat"],
	["Achernar", "Soft"],
	["Alnilam", "Firm"],
	["Schedar", "Even"],
	["Gacrux", "Mature"],
	["Pulcherrima", "Forward"],
	["Achird", "Friendly"],
	["Zubenelgenubi", "Casual"],
	["Vindemiatrix", "Gentle"],
	["Sadachbia", "Lively"],
	["Sadaltager", "Knowledgeable"],
	["Sulafat", "Warm"]
], OC = /* @__PURE__ */ "argh.breath.heavy breath.exhales.cackle.cheer.chuckle.chuckles.cough.cry.gasp.giggle.groan.growl.grunt.grr.hiss.laugh.laughter.moan.pant.pff.phew.scream.shout.shriek.sigh.sighs.sneeze.snicker.snort.sob.throat-clearing.tsk.whimper.whispers.whispering.yawn.short pause.long pause".split("."), kC = (e) => fC(e, {
	"Content-Type": "application/json",
	"x-goog-api-key": e.apiKey
});
function AC(e) {
	if (!e) return DC[0][0];
	if (e.kind === "voice" || e.id) return e.id;
	throw new lC("The replicated voice has not been created yet.");
}
var jC = {
	api: "gemini",
	defaults: {
		baseUrl: "https://generativelanguage.googleapis.com/v1beta",
		model: "gemini-3.8-flash-tts"
	},
	models: ["gemini-3.8-flash-tts", "gemini-3.8-flash-lite-tts"],
	voices: DC.map(([e, t]) => ({
		id: e,
		name: e,
		description: t
	})),
	format: "Inside a speech tag you may add vocal sounds and pauses in angle brackets exactly where they happen: <sigh> <laugh> <chuckle> <giggle> <gasp> <cough> <breath> <sob> <yawn> <whispering> <short pause> <long pause>. Use these English tags in any language. Example: Wait... <short pause> did you hear that? <gasp>",
	tags: RegExp(`<(?:${OC.join("|")})>`, "gi"),
	clone: {
		text: "none",
		consent: !0
	},
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = dC(t, {
			model: t.model || this.defaults.model,
			input: [{
				type: "user_input",
				content: [{
					type: "text",
					text: n
				}]
			}],
			response_format: {
				type: "audio",
				mime_type: "audio/l16",
				sample_rate: 24e3
			},
			generation_config: { speech_config: [{ voice: AC(r) }] },
			stream: !0
		}), o = await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "interactions"), {
			method: "POST",
			headers: kC(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.response_format?.sample_rate) || 24e3,
			chunks: _C(MC(o, i))
		};
	},
	async createClone(e, t, n, r) {
		let [i, a] = await Promise.all([e.blob(n.audio), n.consent ? e.blob(n.consent) : void 0]);
		if (!i) throw new lC("Reference audio not found.");
		if (!a) throw new lC("Gemini voice replication needs a consent recording.");
		let o = async (e) => ({
			mime_type: e.type.split(";")[0].trim() || "audio/wav",
			data: await vx(e)
		}), s = await (await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "voices"), {
			method: "POST",
			headers: kC(t),
			body: JSON.stringify({
				store: !0,
				voice: {
					model: t.model || this.defaults.model,
					type: "replicated",
					display_name: `Advanced Preset ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}`,
					replicated: {
						source_audio: await o(i),
						consent_audio: await o(a)
					}
				}
			}),
			signal: r
		}))).json(), c = s.id ?? s.voice?.id ?? s.key ?? s.voice?.key ?? s.name?.replace(/^voices\//, "");
		if (!c) throw new lC("Gemini did not return a voice id.");
		return c;
	},
	async search(e, t, n, r) {
		let i = new URL(Rx(uC(t, this.defaults.baseUrl), "voices"));
		return n.trim() && i.searchParams.set("search", n.trim()), i.searchParams.set("page_size", "100"), ((await (await jx(await e.fetch(i.toString(), {
			method: "GET",
			headers: fC(t, { "x-goog-api-key": t.apiKey }),
			signal: r
		}))).json()).voices ?? []).flatMap((e) => {
			let t = e.id ?? e.name?.replace(/^voices\//, "");
			if (!t) return [];
			let n = [e.language_code, e.accent].filter(Boolean).join(", ");
			return [{
				id: t,
				name: e.display_name || t,
				description: [n && `(${n})`, e.description].filter(Boolean).join(" ") || void 0
			}];
		});
	}
};
async function* MC(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = ((await e.json()).steps ?? []).flatMap((e) => e.content ?? []).filter((e) => e.type === "audio" && e.data);
		if (!t.length) throw new lC("Gemini returned no audio.");
		yield hC(t[t.length - 1].data);
		return;
	}
	let n = !1;
	for await (let r of mC(e, t)) {
		if (r === "[DONE]") break;
		let e = JSON.parse(r);
		if (e.event_type === "error" || e.error) throw new lC(`Gemini: ${e.error?.message ?? "stream error"}`);
		e.event_type === "step.delta" && e.delta?.type === "audio" && e.delta.data && (n = !0, yield hC(e.delta.data));
	}
	if (!n) throw new lC("Gemini returned no audio.");
}
//#endregion
//#region src/media/speech/providers/minimax.ts
var NC = [
	"laughs",
	"chuckle",
	"coughs",
	"clear-throat",
	"groans",
	"breath",
	"pant",
	"inhale",
	"exhale",
	"gasps",
	"sniffs",
	"sighs",
	"snorts",
	"burps",
	"lip-smacking",
	"humming",
	"hissing",
	"emm",
	"sneezes"
], PC = [
	{
		id: "English_expressive_narrator",
		name: "Expressive Narrator"
	},
	{
		id: "English_Graceful_Lady",
		name: "Graceful Lady"
	},
	{
		id: "English_Insightful_Speaker",
		name: "Insightful Speaker"
	},
	{
		id: "English_radiant_girl",
		name: "Radiant Girl"
	},
	{
		id: "English_Persuasive_Man",
		name: "Persuasive Man"
	},
	{
		id: "English_Lucky_Robot",
		name: "Lucky Robot"
	},
	{
		id: "Chinese (Mandarin)_Lyrical_Voice",
		name: "Lyrical Voice (Mandarin)"
	},
	{
		id: "Chinese (Mandarin)_Reliable_Executive",
		name: "Reliable Executive (Mandarin)"
	},
	{
		id: "Chinese (Mandarin)_News_Anchor",
		name: "News Anchor (Mandarin)"
	},
	{
		id: "Chinese (Mandarin)_HK_Flight_Attendant",
		name: "HK Flight Attendant (Mandarin)"
	},
	{
		id: "Japanese_Whisper_Belle",
		name: "Whisper Belle (Japanese)"
	},
	{
		id: "Cantonese_GentleLady",
		name: "Gentle Lady (Cantonese)"
	}
];
function FC(e) {
	let t = e?.base_resp?.status_code;
	if (t) throw new lC(`MiniMax ${t}: ${e.base_resp?.status_msg || "error"}`);
	return e;
}
var IC = (e, t = !0) => fC(e, {
	...t ? { "Content-Type": "application/json" } : {},
	Authorization: `Bearer ${e.apiKey}`
});
function LC(e) {
	if (!e) return PC[0].id;
	if (e.kind === "voice" || e.id) return e.id;
	throw new lC("The cloned voice has not been created yet.");
}
function RC() {
	return `AP${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
var zC = {
	"audio/mpeg": "mp3",
	"audio/mp3": "mp3",
	"audio/mp4": "m4a",
	"audio/x-m4a": "m4a",
	"audio/m4a": "m4a",
	"audio/wav": "wav",
	"audio/x-wav": "wav",
	"audio/wave": "wav"
}, BC = {
	api: "minimax",
	defaults: {
		baseUrl: "https://api.minimax.io/v1",
		model: "speech-2.8-hd"
	},
	models: [
		"speech-2.8-hd",
		"speech-2.8-turbo",
		"speech-2.6-hd",
		"speech-2.6-turbo",
		"speech-02-hd",
		"speech-02-turbo"
	],
	voices: PC,
	format: `Inside a speech tag you may add MiniMax voice tags: a pause as <#seconds#> between words (e.g. <#0.5#>), and interjections in parentheses: ${NC.map((e) => `(${e})`).join(" ")}. Example: (sighs) Fine.<#0.4#> Let's go.`,
	tags: RegExp(`<#\\d+(?:\\.\\d+)?#>|\\((?:${NC.join("|")})\\)`, "g"),
	clone: { text: "none" },
	async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
		let a = dC(t, {
			model: t.model || this.defaults.model,
			text: n,
			stream: !0,
			stream_options: { exclude_aggregated_audio: !0 },
			language_boost: "auto",
			voice_setting: { voice_id: LC(r) },
			audio_setting: {
				format: "pcm",
				sample_rate: 24e3,
				channel: 1
			}
		}), o = await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "t2a_v2"), {
			method: "POST",
			headers: IC(t),
			body: JSON.stringify(a),
			signal: i
		}));
		return {
			sampleRate: Number(a.audio_setting?.sample_rate) || 24e3,
			chunks: VC(o, i)
		};
	},
	async createClone(e, t, n, r) {
		let i = await e.blob(n.audio);
		if (!i) throw new lC("Reference audio not found.");
		let a = uC(t, this.defaults.baseUrl), o = new FormData();
		o.append("purpose", "voice_clone"), o.append("file", i, `reference.${zC[i.type.split(";")[0].trim()] ?? "wav"}`);
		let s = await (await jx(await e.fetch(Rx(a, "files/upload"), {
			method: "POST",
			headers: IC(t, !1),
			body: o,
			signal: r
		}))).text();
		FC(JSON.parse(s));
		let c = /"file_id"\s*:\s*"?(\d+)/.exec(s)?.[1];
		if (!c) throw new lC("MiniMax did not return a file id.");
		let l = RC(), u = JSON.stringify({
			file_id: 0,
			voice_id: l
		}).replace("\"file_id\":0", `"file_id":${c}`);
		return FC(await (await jx(await e.fetch(Rx(a, "voice_clone"), {
			method: "POST",
			headers: IC(t),
			body: u,
			signal: r
		}))).json()), l;
	},
	async search(e, t, n, r) {
		let i = FC(await (await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "get_voice"), {
			method: "POST",
			headers: IC(t),
			body: JSON.stringify({ voice_type: "all" }),
			signal: r
		}))).json()), a = n.trim().toLowerCase();
		return [
			...i.voice_cloning ?? [],
			...i.voice_generation ?? [],
			...i.system_voice ?? []
		].filter((e) => !!e.voice_id).map((e) => ({
			id: e.voice_id,
			name: e.voice_name || e.voice_id,
			description: e.description?.filter(Boolean).join(" ") || void 0
		})).filter((e) => !a || `${e.id} ${e.name} ${e.description ?? ""}`.toLowerCase().includes(a));
	}
};
async function* VC(e, t) {
	if (/json/i.test(e.headers.get("content-type") ?? "")) {
		let t = FC(await e.json());
		t.data?.audio && (yield gC(t.data.audio));
		return;
	}
	let n = !1;
	for await (let r of mC(e, t)) {
		let e = FC(JSON.parse(r)), t = e.data?.audio;
		t && (e.data?.status === 2 && n || (n = !0, yield gC(t)));
	}
}
//#endregion
//#region src/media/speech/providers/openai.ts
var HC = [
	"marin",
	"cedar",
	"alloy",
	"ash",
	"ballad",
	"coral",
	"echo",
	"fable",
	"nova",
	"onyx",
	"sage",
	"shimmer",
	"verse"
], UC = {
	fish: EC,
	elevenlabs: CC,
	minimax: BC,
	gemini: jC,
	openai: {
		api: "openai",
		defaults: {
			baseUrl: "https://api.openai.com/v1",
			model: "gpt-4o-mini-tts"
		},
		models: [
			"gpt-4o-mini-tts",
			"tts-1-hd",
			"tts-1"
		],
		voices: HC.map((e) => ({
			id: e,
			name: e[0].toUpperCase() + e.slice(1)
		})),
		format: "",
		tags: null,
		async synthesize(e, { conn: t, text: n, voice: r, signal: i }) {
			let a = r?.kind === "voice" ? r.id : HC[0], o = dC(t, {
				model: t.model || this.defaults.model,
				input: n,
				voice: a.startsWith("voice_") ? { id: a } : a,
				response_format: "pcm"
			});
			return {
				sampleRate: 24e3,
				chunks: pC(await jx(await e.fetch(Rx(uC(t, this.defaults.baseUrl), "audio/speech"), {
					method: "POST",
					headers: fC(t, {
						"Content-Type": "application/json",
						Authorization: `Bearer ${t.apiKey}`
					}),
					body: JSON.stringify(o),
					signal: i
				})), i)
			};
		}
	},
	deepseek: yC
};
function WC(e) {
	return UC[e];
}
var GC = (e) => e && UC[e]?.format || "", KC = (e) => e && UC[e]?.tags || null, qC = (e) => e.global ? e : new RegExp(e.source, `${e.flags}g`);
function JC(e, t, n) {
	let r = KC(e);
	if (!r || t === n) return r ? t : n;
	let i = RegExp(`^(?:${r.source})$`, r.flags.replace("g", "")), a = t;
	for (let e of [Dc, ...Object.values(UC).map((e) => e.tags)]) e && e !== r && (a = a.replace(qC(e), (e) => i.test(e) ? e : ""));
	return a === t ? t : a.replace(/[ \t]{2,}/g, " ").trim();
}
//#endregion
//#region src/media/speech/segments.ts
function YC(e) {
	let t = e.replace(/<[^>]*>/g, " ").replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_~`#>|]+/g, "").replace(/\s+/g, " ").trim();
	return /[\p{L}\p{N}]/u.test(t) ? t : "";
}
function XC(e, t, n, r = (e) => e) {
	let i = t.filter((e) => !e.orphan && e.end > e.start).sort((e, t) => e.start - t.start), a = [], o = 0, s = (t, r) => {
		if (!n || r <= t) return;
		let i = t;
		for (let n of e.slice(t, r).split(/(\n\s*\n)/)) {
			let e = YC(n);
			e && a.push({
				id: `n${i}`,
				kind: "narration",
				character: "",
				text: e,
				display: e,
				start: i,
				end: i + n.length
			}), i += n.length;
		}
	};
	for (let e of i) {
		if (e.start < o) continue;
		s(o, e.start);
		let t = r(e.text ?? e.quote, e.quote).trim();
		t && a.push({
			id: e.id,
			kind: "speech",
			character: e.character,
			text: t,
			display: e.quote,
			start: e.start,
			end: e.end
		}), o = e.end;
	}
	return s(o, e.length), a;
}
var ZC = (e) => e.normalize("NFKC").trim().toLowerCase();
function QC(e, t) {
	if (t.kind === "narration") return e.narrator ?? e.voice;
	let n = ZC(t.character);
	return e.bindings.find((e) => ZC(e.character) === n)?.voice ?? e.voice;
}
function $C(e) {
	return e ? e.kind === "voice" ? `v:${e.id}` : `c:${e.audio}:${e.text ?? ""}` : "-";
}
function ew(e) {
	let t = 14695981039346656037n, n = new TextEncoder().encode(e);
	for (let e of n) t = BigInt.asUintN(64, (t ^ BigInt(e)) * 1099511628211n);
	return t.toString(16).padStart(16, "0");
}
function tw(e, t, n) {
	return `tts:${ew(JSON.stringify([
		e.api,
		e.baseUrl.trim(),
		e.model,
		e.body.trim(),
		$C(t),
		n
	]))}`;
}
//#endregion
//#region src/media/speech/wav.ts
function nw(e, t) {
	let n = e.length & -2, r = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(44)), i = (e, t) => {
		for (let n = 0; n < t.length; n++) r.setUint8(e + n, t.charCodeAt(n));
	};
	return i(0, "RIFF"), r.setUint32(4, 36 + n, !0), i(8, "WAVE"), i(12, "fmt "), r.setUint32(16, 16, !0), r.setUint16(20, 1, !0), r.setUint16(22, 1, !0), r.setUint32(24, t, !0), r.setUint32(28, t * 2, !0), r.setUint16(32, 2, !0), r.setUint16(34, 16, !0), i(36, "data"), r.setUint32(40, n, !0), new Blob([r.buffer, e.slice(0, n)], { type: "audio/wav" });
}
function rw(e) {
	let t = new DataView(e);
	if (e.byteLength < 44) return null;
	let n = (e) => String.fromCharCode(t.getUint8(e), t.getUint8(e + 1), t.getUint8(e + 2), t.getUint8(e + 3));
	if (n(0) !== "RIFF" || n(8) !== "WAVE") return null;
	let r = 12, i = 0;
	for (; r + 8 <= e.byteLength;) {
		let a = n(r), o = t.getUint32(r + 4, !0);
		if (a === "fmt ") {
			if (t.getUint16(r + 8, !0) !== 1 || t.getUint16(r + 10, !0) !== 1 || t.getUint16(r + 22, !0) !== 16) return null;
			i = t.getUint32(r + 12, !0);
		} else if (a === "data") return i ? {
			sampleRate: i,
			pcm: new Uint8Array(e, r + 8, Math.min(o, e.byteLength - r - 8))
		} : null;
		r += 8 + o + (o & 1);
	}
	return null;
}
//#endregion
//#region src/media/speech/service.ts
var iw = {
	fetch: (e, t) => kx(e, t),
	blob: ux
}, aw = /* @__PURE__ */ fn({
	clips: {},
	playing: null,
	paused: !1,
	generating: {}
});
function ow() {
	let e = Zb().speech;
	return e.enabled ? nx(e) : void 0;
}
function sw(t) {
	let n = e().chat[t], r = ow();
	if (!n || n.is_user || !r) return [];
	let i = cm(n);
	return !i || !XS(wp(i.presetId)) ? [] : XC(n.mes, GS(t), Zb().speech.narrator, (e, t) => JC(r.api, e, t));
}
var cw = /* @__PURE__ */ new Map();
async function lw(e, t, n) {
	if (t?.kind !== "clone" || t.id) return t;
	let r = WC(e.api);
	if (!r?.createClone) return t;
	let i = `${e.id}:${t.audio}:${t.consent ?? ""}`, a = cw.get(i);
	return a || (a = r.createClone(iw, e, t, n), cw.set(i, a), a.catch(() => cw.delete(i))), t.id = await a, Qb(), t;
}
var uw = 48, dw = /* @__PURE__ */ new Map();
function fw(e, t) {
	dw.delete(e), dw.set(e, t);
	for (let e of dw.keys()) {
		if (dw.size <= uw) break;
		if (dw.get(e).state !== "loading") dw.delete(e);
		else break;
	}
	return t;
}
var pw = (e, t) => tw(e, QC(e, t), t.text), mw = (e, t) => hw(e, QC(e, t), t.text);
async function hw(e, t, n) {
	let r = tw(e, t, n), i = dw.get(r);
	if (i && i.state !== "error") return fw(r, i);
	let a = await ux(r).catch(() => void 0), o = a ? rw(await a.arrayBuffer()) : null;
	if (o) return aw.clips[r] = "ready", fw(r, $S.of(o.pcm, o.sampleRate));
	let s = WC(e.api);
	if (!s) throw Error(`Unknown speech API ${e.api}`);
	return aw.clips[r] = "loading", fw(r, new $S(async (r) => {
		let i = await lw(e, t, r);
		return s.synthesize(iw, {
			conn: e,
			text: n,
			voice: i,
			signal: r
		});
	}, (e) => {
		aw.clips[r] = e.state, e.state === "ready" && lx(nw(e.pcm(), e.sampleRate), { key: r }).catch((e) => console.warn("[AP] speech cache write failed", e));
	}));
}
function gw(e) {
	let t = ow();
	return t ? aw.clips[pw(t, e)] : void 0;
}
async function _w(e) {
	let t = ow();
	if (t) for (let n of e) {
		let e = pw(t, n);
		aw.clips[e] || await dx(e).catch(() => !1) && (aw.clips[e] ??= "ready");
	}
}
function vw(e) {
	e instanceof DOMException && e.name === "AbortError" || (console.error("[AP] speech synthesis failed", e), x("error", QS(e), Y("media.speech")));
}
var yw = null;
function bw() {
	yw && (yw.cancelled = !0, yw.playback?.stop()), yw = null, aw.playing = null, aw.paused = !1, cC();
}
async function xw() {
	aw.playing && (aw.paused ? (await cC(), aw.paused = !1) : (await sC(), aw.paused = !0));
}
async function Sw(e, t, n, r) {
	bw();
	let i = ow();
	if (!i || !t[n]) return;
	let a = {
		playback: null,
		cancelled: !1
	};
	yw = a;
	let o = r ? t.length - 1 : n;
	try {
		let s = mw(i, t[n]);
		for (let c = n; c <= o && !a.cancelled; c++) {
			let n = await s;
			if (s = c < o ? mw(i, t[c + 1]) : null, a.cancelled) break;
			aw.playing = {
				mesId: e,
				segId: t[c].id,
				all: r
			}, a.playback = new oC(n), await a.playback.run();
		}
	} catch (e) {
		a.cancelled || vw(e);
	} finally {
		yw === a && (yw = null, aw.playing = null, aw.paused = !1);
	}
}
function Cw(e, t) {
	let n = aw.playing;
	if (n && n.mesId === e && n.segId === t) {
		xw();
		return;
	}
	let r = sw(e), i = r.findIndex((e) => e.id === t);
	i >= 0 && Sw(e, r, i, !1);
}
function ww(e, t) {
	let n = sw(e);
	Sw(e, n, t ? Math.max(0, n.findIndex((e) => e.id === t)) : 0, !0);
}
async function Tw(e, t) {
	bw();
	let n = {
		playback: null,
		cancelled: !1
	};
	yw = n;
	try {
		let r = await hw(e, t, Y("media.speech.sample"));
		if (n.cancelled) return;
		n.playback = new oC(r), await n.playback.run();
	} catch (e) {
		n.cancelled || vw(e);
	} finally {
		yw === n && (yw = null);
	}
}
async function Ew() {
	let e = /* @__PURE__ */ new Set();
	for (let t of Zb().speech.connections) for (let n of [
		t.voice,
		t.narrator,
		...t.bindings.map((e) => e.voice)
	]) n?.kind === "clone" && (e.add(n.audio), n.consent && e.add(n.consent));
	await mx("voice:", e).catch(() => void 0);
}
async function Dw(e) {
	let t = ow();
	if (!t || aw.generating[e]) return;
	let n = sw(e);
	if (n.length) {
		aw.generating[e] = !0;
		try {
			for (let e of n) {
				let n = await mw(t, e);
				if (await n.done, n.state === "error") throw n.error;
			}
		} catch (e) {
			vw(e);
		} finally {
			delete aw.generating[e];
		}
	}
}
async function Ow(e) {
	let t = ow();
	if (!t) return null;
	let n = [], r = 0;
	for (let i of sw(e)) {
		let e = await mw(t, i);
		await e.done, e.state === "ready" && (r && e.sampleRate !== r || (r = e.sampleRate, n.push(e.pcm())));
	}
	if (!r) return null;
	let i = new Uint8Array(n.reduce((e, t) => e + t.length, 0)), a = 0;
	for (let e of n) i.set(e, a), a += e.length;
	return nw(i, r);
}
function kw() {
	let e = Zb().speech, t = ow(), n = t?.api ?? "", r = KC(n);
	return {
		vars: {
			on: !!t,
			auto: e.auto,
			api: n,
			narrator: e.narrator,
			characters: !1
		},
		format: GC(n),
		characters: t?.bindings.filter((e) => e.voice).map((e) => e.character) ?? [],
		...r ? { cleaner: r } : {}
	};
}
var Aw = 30;
function jw() {
	W_({ speech: kw }), mx("tts:", /* @__PURE__ */ new Set(), Aw * 864e5).catch(() => void 0);
	let { eventSource: t, eventTypes: n } = e();
	t.on("advanced_preset_message_updated", (e) => {
		let t = Number(e);
		!Number.isNaN(t) && Zb().speech.auto && Dw(t);
	});
	for (let e of [n.CHAT_CHANGED]) e && t.on(e, bw);
}
//#endregion
//#region src/store/bundled-modules.ts
function Mw(e, t, n, r) {
	return Lf({
		...J(Hf(t, n, (n ? e.locales?.[n] ?? e.locales?.[n.split("-")[0]] : void 0)?.userModules?.[t.id])),
		id: t.id,
		enabled: r
	});
}
function Nw(e, t, n, r) {
	let i = {
		add: [],
		conflicts: [],
		records: {},
		incomingCopy: {}
	}, a = /* @__PURE__ */ new Set();
	for (let o of Bf(e)) {
		if (!o || typeof o.id != "string" || !o.id || a.has(o.id)) continue;
		a.add(o.id);
		let s = t.find((e) => e.id === o.id), c = Mw(e, o, r, s?.enabled ?? o.enabled !== !1);
		if (!c) continue;
		let l = qf(o), u = Kf(c), d = n?.[o.id];
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
		let f = Kf(s);
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
function Pw(e, t) {
	if (e.add.length || e.conflicts.length) return !1;
	let n = t ?? {};
	return [.../* @__PURE__ */ new Set([...Object.keys(n), ...Object.keys(e.records)])].every((t) => n[t]?.source === e.records[t]?.source && n[t]?.copy === e.records[t]?.copy);
}
function Fw(e, t, n = []) {
	let r = Nm(e), i = Yh(e), a = { ...t.records };
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
	i.push(...t.add), r.bundledModules = a, q();
}
function Iw(e, t, n) {
	let r = Bf(e), i = t.map((t) => {
		let i = r.find((e) => e.id === t.id), a = i && Mw(e, i, n, t.enabled);
		if (i && a && Kf(a) === Kf(t)) {
			let { enabled: e, ...n } = J(i);
			return {
				...n,
				...t.enabled ? {} : { enabled: !1 }
			};
		}
		return Wf(t);
	});
	return {
		...e,
		userModules: i
	};
}
//#endregion
//#region src/ui/download.ts
function Lw(e, t) {
	let n = URL.createObjectURL(new Blob([`${JSON.stringify(t, null, 2)}\n`], { type: "application/json" })), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function Rw(e, t) {
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
var zw = (e) => e.trim().replace(/[\\/:*?"<>|\s]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "untitled";
function Bw(e, t) {
	let n = URL.createObjectURL(t), r = document.createElement("a");
	r.href = n, r.download = e, document.body.append(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
//#endregion
//#region src/app/bundled-modules.ts
function Vw(e, t, n) {
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
async function Hw(e, t) {
	let { root: n, checked: r } = Vw(Y("um.bundled.conflictTitle"), Y("um.bundled.conflictBody", { name: Fp(e) }), t.map((e) => ({
		id: e.id,
		label: e.installed.name || e.incoming.name || e.id,
		note: Y(e.modified ? "um.bundled.modified" : "um.bundled.unmodified"),
		checked: !e.modified
	})));
	return await y(n, Y("um.bundled.apply"), Y("um.bundled.keepAll")) ? r() : [];
}
async function Uw(e, t) {
	let n = Nm(e), r = Nw(e, Yh(e), n.bundledModules, Mp());
	if (Pw(r, n.bundledModules)) return;
	let i = t.auto ? r.conflicts.filter((e) => !e.modified).map((e) => e.id) : [], a = r.conflicts.filter((e) => !i.includes(e.id));
	a.length && i.push(...await Hw(e, a)), Fw(e, r, i), r.add.length && x("info", Y("um.bundled.added", {
		n: r.add.length,
		names: r.add.map((e) => e.name).join(", ")
	}), Fp(e));
}
var Ww = /* @__PURE__ */ new Map();
function Gw(e, t = {}) {
	let n = e.id, r = (Ww.get(n) ?? Promise.resolve()).then(() => Uw(wp(n) ?? e, t)).catch((e) => console.error("[AP] bundled module sync failed", n, e));
	return Ww.set(n, r), r;
}
function Kw(e, t, n) {
	let r = document.createElement("label");
	r.className = "checkbox_label", r.dataset.apOption = "installer", r.style.marginTop = "0.8em";
	let i = document.createElement("input");
	i.type = "checkbox", i.checked = n;
	let a = document.createElement("span");
	a.textContent = e, r.append(i, a);
	let o = document.createElement("small");
	o.className = "text_muted", o.style.display = "block", o.textContent = t;
	let s = document.createElement("div");
	return s.style.textAlign = "start", s.append(r, o), {
		root: s,
		box: i
	};
}
async function qw(e) {
	let t = Yh(e), n = Kw(Y("presetFile.installer"), Y("presetFile.installerHint"), !0), r, i = () => [];
	if (t.length) {
		let a = Vw(Y("um.bundled.exportTitle", { name: Fp(e) }), Y("um.bundled.exportBody"), t.map((e) => ({
			id: e.id,
			label: e.name || Y("um.untitled"),
			...e.enabled ? {} : { note: Y("um.bundled.disabled") },
			checked: !0
		})));
		a.root.append(n.root), r = a.root, i = a.checked;
	} else {
		r = document.createElement("div"), r.style.textAlign = "start";
		let t = document.createElement("h3");
		t.textContent = Y("um.bundled.exportTitle", { name: Fp(e) }), r.append(t, n.root);
	}
	if (!await y(r, Y("um.bundled.export"), Y("common.cancel"))) return !1;
	let a = i(), o = Iw(e, t.filter((e) => a.includes(e.id)), Mp()), s = Du(o, o.defaultConfiguration, void 0).sampling;
	return Lw(`${zw(e.id)}.apreset.json`, Ud(o, {
		installer: n.box.checked,
		sampling: s
	})), !0;
}
//#endregion
//#region src/app/dev-source.ts
var Jw = /* @__PURE__ */ fn({
	status: "off",
	presetId: "",
	hash: "",
	error: "",
	at: 0
}), Yw = 1500, Xw = null;
async function Zw() {
	let { url: e, enabled: t } = K().dev;
	if (!t || !e) return;
	let n = e.replace(/\/+$/, "");
	try {
		let e = await (await S(`${n}/`, { cache: "no-store" })).json();
		if (Jw.status = "online", Jw.error = e.ok === !1 ? "build failed" : "", Jw.at = Date.now(), !e.hash || e.hash === Jw.hash) return;
		let t = yp(await (await S(`${n}/preset`, { cache: "no-store" })).json());
		if (!t) throw Error("not an Advanced Preset artifact");
		Jw.presetId && Jw.presetId !== t.id && Dp(null, Jw.presetId), Dp(t), Jw.presetId = t.id, Jw.hash = t.hash, Km(t), await ch(t), Gw(t, { auto: !0 }), lg("dev", {
			id: t.id,
			version: t.version,
			hash: t.hash
		});
	} catch (e) {
		Jw.status = "error", Jw.error = e instanceof Error ? e.message : String(e);
	}
}
function Qw() {
	if (Xw && clearTimeout(Xw), Xw = null, !K().dev.enabled) return Jw.presetId && Dp(null, Jw.presetId), Object.assign(Jw, {
		status: "off",
		presetId: "",
		hash: "",
		error: ""
	}), Promise.resolve();
	Jw.status === "off" && (Jw.status = "connecting");
	let e = async () => {
		await Zw(), K().dev.enabled && (Xw = setTimeout(e, Yw));
	};
	return e();
}
function $w() {
	let e = Promise.resolve();
	return gr(() => [K().dev.enabled, K().dev.url], () => {
		Jw.hash = "", e = Qw();
	}, { immediate: !0 }), e;
}
//#endregion
//#region src/app/impersonate.ts
var eT = "#option_impersonate, #mes_impersonate", tT = () => document.querySelector("#send_textarea");
function nT(e, t = !1, n) {
	let r = tT();
	r && (r.value = n === void 0 ? e : Bb(e, n), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.focus(), t && document.querySelector("#send_but")?.click());
}
function rT() {
	if (!K().enabled) return null;
	let t = rh(), n = t ? wp(t) : void 0;
	if (!n?.meta.impersonatePrompt) return null;
	let r = Im(n);
	if (!vh(r)) return null;
	let i = Us(n.meta.impersonatePrompt, (e) => e[0] === "name" ? dd(n, r, e[1]) : void 0);
	try {
		return e().substituteParams(i);
	} catch {
		return i;
	}
}
function iT(e) {
	if (!e.target?.closest?.(eT)) return;
	let t = rT();
	if (!t) return;
	e.preventDefault(), e.stopImmediatePropagation(), document.querySelector("#options")?.style.setProperty("display", "none");
	let n = tT()?.value.trim();
	nT(Bb(n ? `${t}\n${n}` : t), !0);
}
function aT() {
	window.addEventListener("click", iT, !0);
}
//#endregion
//#region src/store/custom-ui.ts
function oT(e) {
	let t = Cl(e);
	if (!t) return !1;
	let n = K().presets[e.id]?.customUi, r = xp(e.id)?.source;
	return r === "builtin" || r === "dev" ? n && n.hash === t ? n.enabled : !0 : !!(n?.enabled && n.hash === t);
}
function sT(e) {
	let t = K().presets[e.id]?.customUi;
	return !!(t && t.hash === Cl(e));
}
function cT(e, t) {
	Nm(e).customUi = {
		enabled: t,
		hash: Cl(e)
	}, q();
}
//#endregion
//#region src/app/trust.ts
var lT = class extends Error {
	constructor() {
		super(Y("trust.declined")), this.name = "TrustDeclined";
	}
}, uT = (e) => e instanceof lT, dT = (e, t) => e.length === t.length && e.every((e, n) => e === t[n]);
function fT(e, t, n, r) {
	return [
		`<h3>${v(e)}</h3>`,
		`<p>${v(Y("trust.body", {
			what: t,
			n
		}))}</p>`,
		`<p>${v(Y("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(r)}</pre>`
	].join("");
}
var pT = (e) => {
	let t = e.join("\n\n────────\n\n");
	return t.length > 1200 ? `${t.slice(0, 1200)}\n…` : t;
};
async function mT(e, t) {
	let n = du(e);
	if (!n.length || t && dT(n, du(t))) return;
	let r = Fp(e);
	if (!await y(fT(Y("trust.presetTitle"), Y("trust.preset", { name: r }), n.length, pT(n)), Y("trust.install"), Y("common.cancel"))) throw new lT();
}
async function hT(e, t) {
	let n = hp(e);
	if (!(!n.length || t && dT(n, hp(t))) && !await y([
		`<h3>${v(Y("trust.qrTitle"))}</h3>`,
		`<p>${v(Y("trust.qrBody", {
			name: Fp(e),
			n: n.length
		}))}</p>`,
		`<p>${v(Y("trust.risk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(pT(n))}</pre>`
	].join(""), Y("trust.install"), Y("common.cancel"))) throw new lT();
}
async function gT(e) {
	let t = wf(e);
	if (t.length && !await y(fT(Y("trust.modulesTitle"), Y("trust.modules", { n: e.length }), t.length, pT(t)), Y("trust.import"), Y("common.cancel"))) throw new lT();
}
async function _T(e) {
	let t = xl(e);
	if (!t.length) return !1;
	let n = t.map((t) => Pp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id)).join(Y("common.listSeparator")), r = await y([
		`<h3>${v(Y("trust.uiTitle"))}</h3>`,
		`<p>${v(Y("trust.uiBody", {
			name: Fp(e),
			n: t.length,
			list: n
		}))}</p>`,
		`<p>${v(Y("trust.uiRisk"))}</p>`,
		`<pre style="text-align:start;max-height:12em;overflow:auto;white-space:pre-wrap;font-size:0.85em">${v(pT(t.map((e) => [e.code, e.style ?? ""].filter(Boolean).join("\n\n"))))}</pre>`
	].join(""), Y("trust.enableUi"), Y("trust.notNow"));
	return cT(e, r), r;
}
async function vT(e) {
	xl(e).length && !sT(e) && await _T(e);
}
//#endregion
//#region src/app/install.ts
var yT = class extends Error {
	constructor(e) {
		super(Y("presets.apUpdating", { name: Fp(e) })), this.name = "ApUpdating";
	}
}, bT = (e) => e instanceof yT;
function xT(e) {
	let t = /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/.exec(e.trim());
	return t ? `https://raw.githubusercontent.com/${t[1]}/${t[2]}/${t[3]}` : e.trim();
}
var ST = "advancedPreset.pendingInstall";
function CT(e, t) {
	try {
		sessionStorage.setItem(ST, JSON.stringify({
			artifact: e,
			...t ? { source: t } : {}
		}));
	} catch (e) {
		console.warn("[AP] could not keep the preset for after the update", e);
	}
}
async function wT(e, t) {
	let n = yp(e);
	if (!n) throw Error(Y("presets.invalid"));
	if (n.minAdvancedPreset && pu("1.12.0", n.minAdvancedPreset) < 0) throw await Mb(n.minAdvancedPreset, Fp(n)) ? (CT(n, t), new yT(n)) : Error(Y("presets.tooNew", { version: n.minAdvancedPreset }));
	await mT(n, wp(n.id)), await hT(n, wp(n.id)), Tp(n), t && (K().sources[n.id] = t), K().declinedUpdates?.[n.id] && delete K().declinedUpdates[n.id], q();
	let r = wp(n.id) ?? n;
	return Km(r), xp(r.id)?.source === "installed" && await vT(r), await ch(r), await Gw(r), r;
}
async function TT(e) {
	let t = await S(xT(e), { cache: "no-store" });
	if (!t.ok) throw Error(`${t.status} ${t.statusText}`);
	return t.json();
}
async function ET(e, t = !0) {
	return wT(await TT(e), t ? e.trim() : void 0);
}
async function DT(e) {
	return wT(JSON.parse(await e.text()));
}
function OT(e) {
	if (xp(e)?.source !== "installed") return;
	let t = K().sources[e];
	if (t) return {
		url: t,
		remembered: !0
	};
	let n = wp(e)?.updateUrl;
	return Md(n) ? {
		url: n.trim(),
		remembered: !1
	} : void 0;
}
async function kT(e) {
	let t = OT(e);
	if (!t) throw Error(Y("presets.noSource"));
	return ET(t.url, t.remembered);
}
async function AT() {
	for (let { preset: e } of bp()) {
		let t = OT(e.id);
		if (!t) continue;
		let n;
		try {
			n = yp(await TT(t.url));
		} catch (n) {
			console.warn("[AP] preset update check failed", e.id, t.url, n);
			continue;
		}
		if (!n || n.id !== e.id) console.warn("[AP] the update source does not hold this preset", e.id, t.url);
		else if (!(pu(n.version, e.version) <= 0 || K().declinedUpdates?.[n.id] === n.hash)) try {
			let e = await wT(n, t.remembered ? t.url : void 0);
			x("success", Y("presets.autoUpdated", { version: e.version }), Fp(e));
		} catch (t) {
			if (bT(t)) return;
			uT(t) ? (K().declinedUpdates = {
				...K().declinedUpdates,
				[n.id]: n.hash
			}, q(), x("info", t.message, Fp(n))) : console.warn("[AP] preset update failed", e.id, t);
		}
	}
}
async function jT() {
	let e = sessionStorage.getItem(ST);
	if (!e) return;
	sessionStorage.removeItem(ST);
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return;
	}
	try {
		let e = await wT(t.artifact, t.source);
		x("success", Y("presets.installed"), Fp(e));
	} catch (e) {
		if (bT(e)) return;
		uT(e) ? x("info", e.message, Y("app.name")) : x("error", e instanceof Error ? e.message : String(e), Y("app.name"));
	}
}
function MT() {
	let e = [];
	for (let [t, n] of Object.entries(K().installed)) {
		let r = kp(t), i = yp(n);
		!r || !i || pu(r.version, i.version) <= 0 || (Ep(t), delete K().sources[t], K().declinedUpdates?.[t] && delete K().declinedUpdates[t], e.push(r));
	}
	return e;
}
async function NT(t) {
	if (Ep(t), delete K().sources[t], K().declinedUpdates?.[t] && delete K().declinedUpdates[t], q(), Op(t)) {
		let e = wp(t);
		e && (Km(e), await ch(e), await Gw(e));
		return;
	}
	let n = oh(t);
	n && await e().getPresetManager("openai")?.deletePreset(n);
}
//#endregion
//#region src/app/st-preset-io.ts
var PT = "openai_preset_import_file", FT = "export_oai_preset";
function IT(e) {
	let t = Rd(e);
	return typeof t == "object" && !!t && typeof t.id == "string" && Array.isArray(t.entries);
}
var LT = /* @__PURE__ */ new WeakSet();
async function RT(e, t) {
	let n;
	try {
		n = JSON.parse(await t.text());
	} catch {
		n = void 0;
	}
	if (IT(n)) {
		e.value = "";
		try {
			let e = await wT(n);
			await dh(e), cS(), x("success", Y("presets.installed"), Fp(e)), mS("presets");
		} catch (e) {
			uT(e) || bT(e) ? x("info", e.message, Y("app.name")) : x("error", e instanceof Error ? e.message : String(e), Y("app.name"));
		}
	} else {
		let t = new Event("input", { bubbles: !0 });
		LT.add(t), e.dispatchEvent(t);
	}
}
function zT() {
	let e = rh(), t = e ? wp(e) : void 0;
	return t ? (qw(t).catch((e) => x("error", e instanceof Error ? e.message : String(e), Y("app.name"))), !0) : !1;
}
function BT() {
	window.addEventListener("input", (e) => {
		let t = e.target;
		if (!(t instanceof HTMLInputElement) || t.id !== PT || LT.has(e)) return;
		let n = t.files?.[0];
		n && (e.stopImmediatePropagation(), RT(t, n));
	}, !0), window.addEventListener("click", (e) => {
		e.target instanceof Element && e.target.closest(`#${FT}`) && zT() && (e.stopImmediatePropagation(), e.preventDefault());
	}, !0);
}
//#endregion
//#region src/app/preset-files.ts
var VT = () => e().getPresetManager("openai");
function HT() {
	let e = VT()?.getPresetList();
	return e ? Object.entries(e.preset_names).flatMap(([t, n]) => {
		let r = Ld(e.presets[n]);
		return r ? [{
			name: t,
			artifact: r.artifact
		}] : [];
	}) : [];
}
async function UT(e, t) {
	let n = Qd(t);
	if (!n) {
		console.warn("[AP] preset file in an unsupported format", e);
		return;
	}
	if (n.minAdvancedPreset && pu("1.12.0", n.minAdvancedPreset) < 0) {
		await Mb(n.minAdvancedPreset, Fp(n)) || console.warn("[AP] preset file needs a newer Advanced Preset", e, n.minAdvancedPreset);
		return;
	}
	let r = K().declinedPresetFiles ?? {};
	if (r[e] === n.hash) return;
	let i = wp(n.id);
	if (!i || i.hash !== n.hash && pu(n.version, i.version) >= 0) try {
		await wT(n);
	} catch (t) {
		uT(t) ? (K().declinedPresetFiles = {
			...r,
			[e]: n.hash
		}, q(), x("info", t.message, Fp(n))) : x("error", t instanceof Error ? t.message : String(t), e);
		return;
	}
	let a = wp(n.id), o = VT();
	if (!a || !o) return;
	let s = await ch(a, { select: o.getSelectedPresetName() === e });
	if (s !== e && await o.deletePreset(e), r[e]) {
		let { [e]: t, ...n } = r;
		K().declinedPresetFiles = n, q();
	}
	cS(), x("success", Y("presetFile.adopted", {
		file: e,
		carrier: s
	}), Fp(a));
}
var WT = Promise.resolve();
function GT(e) {
	return WT = WT.then(async () => {
		for (let { name: t, artifact: n } of HT()) if (e === void 0 || t === e) try {
			await UT(t, n);
		} catch (e) {
			console.error("[AP] preset file adoption failed", t, e);
		}
	}), WT;
}
function KT() {
	let e = VT()?.getSelectedPresetName();
	e && HT().some((t) => t.name === e) && GT(e);
}
//#endregion
//#region src/app/quick-replies.ts
function qT(e) {
	let t = Im(e), n = (n) => e.actors[n] ? dd(e, t, n) : void 0, r = Np(e)?.quickReplySets;
	return (e.quickReplySets ?? []).map((e) => ({
		decl: e,
		st: pp(e, n, r?.[e.id])
	}));
}
function JT(e) {
	let t = JSON.stringify(e), n = 2166136261;
	for (let e = 0; e < t.length; e++) n = Math.imul(n ^ t.charCodeAt(e), 16777619) >>> 0;
	return n.toString(16);
}
function YT(e, t) {
	let n = e.getSetByName(t.name);
	if (n) {
		n.disableSend = t.disableSend, n.placeBeforeInput = t.placeBeforeInput, n.injectInput = t.injectInput, n.color = t.color, n.onlyBorderColor = t.onlyBorderColor;
		for (let e of n.qrList) e.unrender?.(), e.unrenderSettings?.();
		n.qrList.splice(0);
		for (let e of t.qrList) n.addQuickReply(J(e));
		n.updateColor?.(), n.rerender?.(), n.save();
	}
}
var XT = /* @__PURE__ */ new Set();
async function ZT(e, t, n) {
	let r = K().quickReplies ??= {}, i = (t) => e.listGlobalSets().includes(t), a = (t) => {
		try {
			i(t) && e.removeGlobalSet(t);
		} catch {}
	}, o = !1;
	for (let [t, i] of Object.entries(r)) if (!n.find((e) => e.id === i.presetId)?.quickReplySets?.some((e) => e.name === t)) {
		if (e.getSetByName(t)) {
			a(t);
			try {
				await e.deleteSet(t);
			} catch (e) {
				console.warn("[AP] could not delete Quick Reply set", t, e);
			}
		}
		delete r[t], o = !0;
	}
	for (let [e, n] of Object.entries(r)) n.presetId !== t?.presetId && a(e);
	if (t) {
		let n = t.sets.filter(({ st: t }) => !e.getSetByName(t.name) || r[t.name] ? !0 : (XT.has(t.name) || (XT.add(t.name), x("warning", Y("quickReplies.conflict", { name: t.name }), Y("app.name"))), !1)), a = /* @__PURE__ */ new Set();
		for (let { st: t } of n) e.getSetByName(t.name) || (await e.createSet(t.name, {
			disableSend: t.disableSend,
			placeBeforeInput: t.placeBeforeInput,
			injectInput: t.injectInput
		}), a.add(t.name));
		for (let { st: i } of n) {
			let n = JT(i);
			(a.has(i.name) || r[i.name]?.hash !== n) && (YT(e, i), r[i.name] = {
				presetId: t.presetId,
				hash: n
			}, o = !0);
		}
		for (let { decl: t, st: r } of n) t.global && !i(r.name) && e.addGlobalSet(r.name, t.visible);
	}
	o && q();
}
function QT() {
	let e = G(() => {
		let e = K().enabled ? lS.value : void 0, t = e ? qT(e) : [], n = bp().map((e) => e.preset);
		return {
			active: e ? {
				presetId: e.id,
				sets: t
			} : null,
			known: n,
			key: JSON.stringify([
				e?.id ?? null,
				t.map((e) => e.st),
				n.map((e) => [e.id, (e.quickReplySets ?? []).map((e) => e.name)])
			])
		};
	}), t = Promise.resolve();
	gr(() => e.value.key, () => {
		let n = _();
		if (!n) return;
		let { active: r, known: i } = e.value;
		t = t.then(() => ZT(n, r, i)).catch((e) => console.error("[AP] Quick Reply sync failed", e));
	}, { immediate: !0 });
}
//#endregion
//#region src/ui/styles/tokens.css?inline
var $T = ":host{--ap-primary-50:#fdf4ff;--ap-primary-100:#fae8ff;--ap-primary-200:#f5d0fe;--ap-primary-300:#f0abfc;--ap-primary-400:#e879f9;--ap-primary-500:#d946ef;--ap-primary-600:#c026d3;--ap-primary-700:#a21caf;--ap-primary-800:#86198f;--ap-primary-900:#701a75;--ap-accent-50:#faf5ff;--ap-accent-100:#f3e8ff;--ap-accent-200:#e9d5ff;--ap-accent-300:#d8b4fe;--ap-accent-400:#c084fc;--ap-accent-500:#a855f7;--ap-accent-600:#9333ea;--ap-accent-700:#7e22ce;--ap-accent-800:#6b21a8;--ap-accent-900:#581c87;--ap-radius-sm:6px;--ap-radius-md:10px;--ap-radius-lg:14px;--ap-radius-pill:999px;--ap-space-1:4px;--ap-space-2:8px;--ap-space-3:12px;--ap-space-4:16px;--ap-space-5:24px;--ap-font-size-xs:.75em;--ap-font-size-sm:.875em;--ap-font-size-md:1em;--ap-font-size-lg:1.125em;--ap-text:var(--SmartThemeBodyColor,#1f1724);--ap-muted:color-mix(in srgb, var(--ap-text) 58%, transparent);--ap-faint:color-mix(in srgb, var(--ap-text) 36%, transparent);--ap-border:color-mix(in srgb, var(--ap-text) 14%, transparent);--ap-surface:color-mix(in srgb, var(--ap-text) 4%, transparent);--ap-surface-2:color-mix(in srgb, var(--ap-text) 8%, transparent);--ap-primary:var(--ap-primary-600);--ap-accent:var(--ap-accent-600);--ap-on-primary:#fff;--ap-tint:color-mix(in srgb, var(--ap-primary-500) 10%, transparent);--ap-danger:#dc2626;--ap-success:#16a34a;--ap-warning:#d97706;--ap-panel-bg:var(--SmartThemeBlurTintColor,#faf5fceb);--ap-panel-bg-solid:#faf5fc;--ap-shadow:0 8px 28px #0f05142e;--ap-ring:0 0 0 2px color-mix(in srgb, var(--ap-primary-500) 45%, transparent);color:var(--ap-text);font:inherit;line-height:1.5}:host([data-ap-theme=dark]){--ap-text:var(--SmartThemeBodyColor,#f3eaf6);--ap-primary:var(--ap-primary-400);--ap-accent:var(--ap-accent-400);--ap-on-primary:#1a0b1f;--ap-tint:color-mix(in srgb, var(--ap-primary-400) 14%, transparent);--ap-danger:#f87171;--ap-success:#4ade80;--ap-warning:#fbbf24;--ap-panel-bg:var(--SmartThemeBlurTintColor,#1c1420eb);--ap-panel-bg-solid:#1c1420;--ap-shadow:0 8px 28px #00000073}@supports (color:rgb(from red r g b)){:host,:host([data-ap-theme=dark]){--ap-panel-bg-solid:rgb(from var(--ap-panel-bg) r g b)}}", eE = "*,:before,:after{box-sizing:border-box}:host{display:block}:host([hidden]){display:none}svg.lucide{stroke-width:2px;flex:none;width:1.1em;height:1.1em}button,input,select,textarea{font:inherit;color:inherit}p{margin:0}.muted{color:var(--ap-muted)}.faint{color:var(--ap-faint)}.row{align-items:center;gap:var(--ap-space-2);display:flex}.col{gap:var(--ap-space-2);flex-direction:column;display:flex}.grow{flex:auto;min-width:0}.wrap{flex-wrap:wrap}.ellipsis{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-xs)}.pre{white-space:pre-wrap;word-break:break-word}.small{font-size:var(--ap-font-size-sm)}.xs{font-size:var(--ap-font-size-xs)}.btn{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);cursor:pointer;white-space:nowrap;justify-content:center;align-items:center;gap:6px;min-height:2em;padding:0 .8em;transition:background .15s,border-color .15s,color .15s;display:inline-flex}.btn:hover:not(:disabled){background:var(--ap-surface-2);border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.btn:focus-visible,.icon-btn:focus-visible,.input:focus-visible{box-shadow:var(--ap-ring);outline:none}.btn:disabled,.icon-btn:disabled{opacity:.45;cursor:default}.btn.primary{background:var(--ap-primary);color:var(--ap-on-primary);border-color:#0000}.btn.primary:hover:not(:disabled){background:color-mix(in srgb, var(--ap-primary) 88%, var(--ap-text))}.btn.ghost{background:0 0;border-color:#0000}.btn.danger:hover:not(:disabled){color:var(--ap-danger);border-color:color-mix(in srgb, var(--ap-danger) 50%, transparent)}.icon-btn{border-radius:var(--ap-radius-sm);width:2em;height:2em;color:var(--ap-muted);cursor:pointer;background:0 0;border:0;flex:none;justify-content:center;align-items:center;transition:background .15s,color .15s;display:inline-flex}.icon-btn:hover:not(:disabled){background:var(--ap-surface-2);color:var(--ap-text)}.icon-btn.active{color:var(--ap-primary)}.icon-btn.danger:hover:not(:disabled){color:var(--ap-danger)}.icon-btn.sm{width:1.6em;height:1.6em}.input{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);outline:none;width:100%;min-height:2em;padding:.3em .6em;transition:border-color .15s}.input:hover{border-color:color-mix(in srgb, var(--ap-text) 24%, transparent)}.input:focus{border-color:var(--ap-primary)}textarea.input{resize:vertical;min-height:4.5em;line-height:1.45}select.input{appearance:none;cursor:pointer;background-image:linear-gradient(45deg,#0000 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,#0000 50%);background-position:calc(100% - 13px) 55%,calc(100% - 8px) 55%;background-repeat:no-repeat;background-size:5px 5px;padding-right:1.8em}select.input option{background:var(--ap-panel-bg-solid);color:var(--ap-text)}input[type=number].input{font-variant-numeric:tabular-nums}input[type=range]{width:100%;accent-color:var(--ap-primary)}.switch{cursor:pointer;flex:none;width:2.2em;height:1.25em;display:inline-flex;position:relative}.switch input{opacity:0;cursor:pointer;margin:0;position:absolute;inset:0}.switch .track{border-radius:var(--ap-radius-pill);background:var(--ap-surface-2);border:1px solid var(--ap-border);width:100%;height:100%;transition:background .15s}.switch .thumb{background:var(--ap-muted);border-radius:50%;width:.9em;height:.9em;transition:transform .18s,background .15s;position:absolute;top:.18em;left:.18em}.switch input:checked+.track{background:var(--ap-primary);border-color:#0000}.switch input:checked~.thumb{background:var(--ap-on-primary);transform:translate(.95em)}.switch input:focus-visible+.track{box-shadow:var(--ap-ring)}.switch.sm{width:1.8em;height:1.05em}.switch.sm .thumb{width:.75em;height:.75em;top:.15em;left:.15em}.switch.sm input:checked~.thumb{transform:translate(.75em)}.segmented{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);grid-auto-columns:minmax(0,1fr);grid-auto-flow:column;gap:2px;padding:2px;display:grid}.segmented button{border-radius:calc(var(--ap-radius-md) - 2px);min-width:0;min-height:1.9em;color:var(--ap-muted);cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background:0 0;border:0;justify-content:center;align-items:center;gap:6px;padding:0 .4em;display:inline-flex;overflow:hidden}.segmented.dense button{font-size:var(--ap-font-size-sm);padding:0 2px}.segmented button:hover{color:var(--ap-text)}.segmented button.on{background:var(--ap-panel-bg);color:var(--ap-primary);font-weight:600;box-shadow:0 1px 3px #0000001f}.card{border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface)}.card-head{align-items:center;gap:var(--ap-space-2);min-height:2.25em;padding:0 var(--ap-space-2) 0 var(--ap-space-3);display:flex}.card-head.clickable{cursor:pointer;-webkit-user-select:none;user-select:none}.card-title{text-overflow:ellipsis;white-space:nowrap;flex:auto;min-width:0;font-weight:600;overflow:hidden}.card-body{padding:0 var(--ap-space-3) var(--ap-space-3)}.card>.card-body:empty{display:none}.chip{border:1px solid var(--ap-border);border-radius:var(--ap-radius-pill);background:var(--ap-surface);max-width:100%;min-height:1.75em;font-size:var(--ap-font-size-sm);white-space:nowrap;cursor:default;align-items:center;gap:5px;padding:0 .65em;display:inline-flex}button.chip{cursor:pointer}.chip:is(button):hover{background:var(--ap-surface-2)}.badge{border-radius:var(--ap-radius-pill);min-height:1.45em;font-size:var(--ap-font-size-xs);background:var(--ap-tint);color:var(--ap-primary);white-space:nowrap;align-items:center;padding:0 .5em;font-weight:600;display:inline-flex}.badge.neutral{background:var(--ap-surface-2);color:var(--ap-muted)}.badge.icon-badge{gap:.3em}.badge.icon-badge svg{width:1.1em;height:1.1em}.badge.warn{background:color-mix(in srgb, var(--ap-warning) 16%, transparent);color:var(--ap-warning)}.dot{background:currentColor;border-radius:50%;flex:none;width:.5em;height:.5em}.divider{background:var(--ap-border);height:1px;margin:var(--ap-space-2) 0}.empty{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-5) var(--ap-space-3);color:var(--ap-faint);text-align:center;flex-direction:column;display:flex}.empty svg.lucide{width:1.8em;height:1.8em}.tip{display:inline-flex;position:relative}.tip-bubble{z-index:2147483000;border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-text) 92%, transparent);width:max-content;max-width:min(280px,100vw - 16px);color:var(--ap-panel-bg-solid,#fff);font-size:var(--ap-font-size-xs);white-space:pre-line;overflow-wrap:anywhere;text-align:left;pointer-events:none;box-shadow:var(--ap-shadow);border:0;margin:0;padding:.45em .7em;font-weight:400;line-height:1.45;position:fixed;inset:0 auto auto 0;overflow:visible}:host([data-ap-theme=dark]) .tip-bubble{color:#160d1a}@keyframes ap-spin{to{transform:rotate(360deg)}}@keyframes ap-pulse{50%{opacity:.45}}.spin{animation:1s linear infinite ap-spin}.pulse{animation:1.4s ease-in-out infinite ap-pulse}@media (prefers-reduced-motion:reduce){.spin,.pulse{animation:none}}.scroll{scrollbar-width:thin;scrollbar-color:var(--ap-border) transparent;overflow:auto}", tE = ":host(ap-cards),:host(ap-top-cards),:host(ap-stages){padding-right:var(--mes-right-spacing,30px)}.stages{--actor:var(--ap-primary);gap:var(--ap-space-2);margin:2px 0 var(--ap-space-2);flex-direction:column;display:flex}.stage-bar{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.stage-chip{--c:var(--actor);max-width:16em;color:var(--ap-muted);border-color:color-mix(in srgb, var(--c) 28%, var(--ap-border))}.stage-chip svg.lucide{color:var(--c)}.stage-chip:hover{color:var(--ap-text)}.stage-chip.open{color:var(--ap-text);background:color-mix(in srgb, var(--c) 14%, transparent);border-color:color-mix(in srgb, var(--c) 55%, transparent)}.stage-chip.pending{opacity:.5}.stage-chip.streaming{color:var(--ap-text)}.stage-chip.missing{opacity:.55;border-style:dashed}.stage-chip.interrupted{border-style:dashed}.stage-chip.error{--c:var(--ap-danger);color:var(--ap-danger);max-width:100%}.stage-body{border-left:2px solid color-mix(in srgb, var(--actor) 65%, transparent);padding:2px 0 2px var(--ap-space-3);background:linear-gradient(90deg, color-mix(in srgb, var(--actor) 7%, transparent), transparent 70%);border-radius:0 var(--ap-radius-sm) var(--ap-radius-sm) 0}.stage-text{max-height:18em;font-size:var(--ap-font-size-sm);color:color-mix(in srgb, var(--ap-text) 86%, transparent);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0}.stage-empty{padding:var(--ap-space-1) 0}.patches{gap:var(--ap-space-2);padding:var(--ap-space-1) var(--ap-space-2) var(--ap-space-1) 0;flex-direction:column;display:flex}.patch{font-size:var(--ap-font-size-sm);gap:2px;display:grid}.patch-old{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-danger) 10%, transparent);text-decoration:line-through;-webkit-text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);text-decoration-color:color-mix(in srgb, var(--ap-danger) 60%, transparent);padding:2px 6px}.patch-new{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-success) 11%, transparent);padding:2px 6px}.patch-arrow{width:.9em;height:.9em;color:var(--ap-faint);margin-left:6px}.patch.failed{opacity:.5}.patch.failed .patch-old,.patch.failed .patch-new{background:var(--ap-surface-2);text-decoration:none}.patch-status{color:var(--ap-muted);align-items:center;gap:4px;display:inline-flex}.cards{gap:var(--ap-space-2);margin:var(--ap-space-2) 0 2px;flex-direction:column;display:flex}.cards.cards-top{margin:0 0 var(--ap-space-2);gap:4px}.section-icon{color:var(--ap-primary)}.chevron{color:var(--ap-faint);transition:transform .18s}.chevron.flipped{transform:rotate(180deg)}.mini-card .card-body{font-size:var(--ap-font-size-sm)}.sm-btn{min-height:1.8em;font-size:var(--ap-font-size-sm);padding:0 .65em}.reply-card{--actor:var(--ap-primary);padding:var(--ap-space-2) var(--ap-space-3) var(--ap-space-2) calc(var(--ap-space-3) + 4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--actor) 7%, transparent);position:relative}.reply-card:before{content:\"\";background:var(--actor);border-radius:3px;width:3px;position:absolute;top:8px;bottom:8px;left:0}.reply-name{color:var(--actor);letter-spacing:.02em;margin-bottom:2px;font-weight:700}.rich p{margin:0 0 .6em}.rich p:last-child{margin-bottom:0}.rich p.special{border-radius:var(--ap-radius-sm);background:color-mix(in srgb, var(--ap-accent) 12%, transparent);color:var(--ap-text);padding:.35em .7em}.rich blockquote{border-left:2px solid var(--ap-border);color:var(--ap-muted);margin:0 0 .6em;padding:.1em 0 .1em .8em}.rich ul,.rich ol{margin:0 0 .6em;padding-left:1.3em}.rich code{font-family:var(--monoFontFamily,ui-monospace, monospace);background:var(--ap-surface-2);border-radius:4px;padding:0 .3em;font-size:.9em}.options-grid{gap:var(--ap-space-2);grid-template-columns:repeat(2,minmax(0,1fr));display:grid}@media (max-width:560px){.options-grid{grid-template-columns:1fr}}.option{padding:var(--ap-space-2) var(--ap-space-3);text-align:left;cursor:pointer;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:2px;transition:border-color .15s,background .15s;display:flex}.option:hover{border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.option-label{font-weight:600}.option-content{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.memory-ops{flex-wrap:wrap;gap:6px;display:flex}.memory-chip{max-width:20em;padding-right:.3em}.memory-chip .op-icon{width:.9em;height:.9em;color:var(--ap-primary)}.memory-chip.delete .op-icon{color:var(--ap-danger)}.memory-chip.undone{opacity:.45;text-decoration:line-through}.memory-chip .icon-btn.sm{width:1.4em;height:1.4em}.synopsis{padding:4px var(--ap-space-3);border-radius:var(--ap-radius-sm);cursor:pointer;color:var(--ap-muted)}.synopsis:hover{background:var(--ap-surface)}.synopsis-head{align-items:flex-start;gap:var(--ap-space-2);display:flex}.synopsis-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.synopsis-line>.row{text-overflow:ellipsis;max-width:100%;overflow:hidden}.synopsis-event{color:var(--ap-text)}.synopsis-summary{margin-top:4px}.synopsis-edit{opacity:0;flex:none;margin:-2px -6px -4px 0;transition:opacity .15s;display:inline-flex}.synopsis:hover .synopsis-edit,.synopsis-edit:focus-within{opacity:1}@media (hover:none){.synopsis-edit{opacity:.7}}.synopsis-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.synopsis-fields{grid-template-columns:repeat(auto-fit,minmax(10em,1fr));gap:6px;display:grid}.synopsis-field{min-width:0;display:block;position:relative}.synopsis-field svg.lucide{pointer-events:none;width:1em;height:1em;position:absolute;top:50%;left:.6em;transform:translateY(-50%)}.synopsis-field .input{padding-left:2em}.synopsis-event-input{font-weight:600}.synopsis-editor textarea.input{resize:none;min-height:3.4em;max-height:18em;overflow-y:auto}.synopsis-actions{align-items:center;gap:6px;margin-top:2px;display:flex}.synopsis-actions .btn svg.lucide{width:1em;height:1em}@media (hover:none){.synopsis-keys{visibility:hidden}}.row.tight{white-space:nowrap;gap:4px}.structure-component{flex-direction:column;gap:2px;display:flex}.structure-component .xs{color:var(--ap-danger)}.status-bar{align-items:flex-start;gap:var(--ap-space-2);padding:3px var(--ap-space-3);color:var(--ap-muted);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);display:flex}.status-line{align-items:center;gap:2px var(--ap-space-3);flex-wrap:wrap;flex:auto;min-width:0;display:flex}.status-line>.row{max-width:100%}.status-location{min-width:0;overflow:hidden}.status-bar:hover .synopsis-edit{opacity:1}.status-editor{padding:var(--ap-space-2) var(--ap-space-3);font-size:var(--ap-font-size-sm);border:1px solid color-mix(in srgb, var(--ap-primary) 32%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.status-fields{grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;display:grid}.status-fields>:nth-child(-n+3),.status-fields>:nth-child(5){grid-column:span 2}.status-fields>:nth-child(4){grid-column:span 4}@media (max-width:480px){.status-fields>*{grid-column:span 3!important}.status-fields>:nth-child(4){grid-column:span 6!important}}.row.end{justify-content:flex-end}.kv-list{gap:4px var(--ap-space-3);grid-template-columns:max-content 1fr;margin:0;display:grid}.kv-list dt{color:var(--ap-muted)}.kv-list dd{margin:0}.dock{margin:var(--ap-space-2) var(--ap-space-3);padding:var(--ap-space-2) var(--ap-space-3);border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);border:1px solid var(--ap-border);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px)}.anno-bubble{--actor:var(--ap-primary);z-index:2147483000;width:max-content;max-width:min(320px,100vw - 16px);max-height:min(50vh,24em);padding:var(--ap-space-2) var(--ap-space-3);border:1px solid color-mix(in srgb, var(--actor) 30%, var(--ap-border));border-radius:var(--ap-radius-md);background:var(--ap-panel-bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);color:var(--ap-text);box-shadow:var(--ap-shadow);font-size:var(--ap-font-size-sm);text-align:left;overflow-wrap:anywhere;margin:0;line-height:1.55;position:fixed;inset:0 auto auto 0;overflow:auto}.anno-author{font-weight:700;font-size:var(--ap-font-size-xs);color:var(--actor);letter-spacing:.02em;margin-bottom:2px}:host(ap-storyline){padding-right:var(--mes-right-spacing,30px);display:block}.storyline-badge{border:1px solid color-mix(in srgb, var(--ap-primary) 30%, var(--ap-border));border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-primary) 8%, transparent);max-width:100%;min-height:1.6em;color:var(--ap-muted);font-size:var(--ap-font-size-xs);cursor:pointer;align-items:center;gap:4px;margin:2px 0 4px;padding:1px 8px;display:inline-flex}.storyline-badge:hover{color:var(--ap-text);border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent)}.storyline-badge svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none}.storyline-badge .storyline-name{text-overflow:ellipsis;white-space:nowrap;font-weight:600;overflow:hidden}.storyline-badge .storyline-if{border-radius:var(--ap-radius-pill);background:color-mix(in srgb, var(--ap-warning) 18%, transparent);color:var(--ap-warning);padding:0 5px;font-weight:600}.storyline-badge.if-line{border-style:dashed}.storyline-badge svg.lucide.storyline-hidden{color:var(--ap-muted)}", nE = ":host(ap-panel){border-radius:inherit}.panel{z-index:100;border-radius:inherit;color:var(--ap-text);background:0 0;flex-direction:column;display:flex;position:absolute;inset:0;overflow:hidden;container:ap-panel/inline-size}:host(ap-panel[data-ap-standalone]) .panel{--ap-blur:blur(var(--SmartThemeBlurStrength,10px));background:var(--ap-panel-bg-solid);-webkit-backdrop-filter:var(--ap-blur);backdrop-filter:var(--ap-blur)}.panel-enter-active,.panel-leave-active{transition:transform .2s,opacity .2s}.panel-enter-from,.panel-leave-to{opacity:0;transform:translateY(8px)}.panel-head{align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3) var(--ap-space-3) var(--ap-space-2) var(--ap-space-4);flex:none;display:flex}.panel-logo{border-radius:var(--ap-radius-md);background:linear-gradient(135deg, var(--ap-primary-500), var(--ap-accent-500));color:#fff;flex:none;place-items:center;width:2.1em;height:2.1em;display:grid}.panel-title{font-weight:700;font-size:var(--ap-font-size-lg);line-height:1.2}.panel-sub{font-size:var(--ap-font-size-xs);color:var(--ap-muted)}.tabs{padding:0 var(--ap-space-3);border-bottom:1px solid var(--ap-border);scrollbar-width:none;flex:none;gap:2px;display:flex;overflow-x:auto}.tab{min-width:3.6em;padding:var(--ap-space-2) 4px;color:var(--ap-muted);cursor:pointer;font-size:var(--ap-font-size-xs);background:0 0;border:0;flex-direction:column;flex:1 1 0;align-items:center;gap:2px;display:flex;position:relative}.tab:hover{color:var(--ap-text)}.tab.on{color:var(--ap-primary);font-weight:600}.tab.on:after{content:\"\";background:var(--ap-primary);border-radius:2px;height:2px;position:absolute;bottom:-1px;left:20%;right:20%}.tab svg.lucide{width:1.25em;height:1.25em}.tab span{text-overflow:ellipsis;white-space:nowrap;max-width:100%;overflow:hidden}.panel-body{min-height:0;padding:var(--ap-space-3) var(--ap-space-4) var(--ap-space-5);gap:var(--ap-space-3);flex-direction:column;flex:auto;display:flex}.section .card-body{gap:var(--ap-space-3);flex-direction:column;display:flex}.toolbar{align-items:center;gap:var(--ap-space-2);flex-wrap:wrap;display:flex}.field{flex-direction:column;gap:4px;min-width:0;display:flex}.field.inline{justify-content:space-between;align-items:center;gap:var(--ap-space-3);flex-direction:row}.field.inline .field-control{flex:none;justify-content:flex-end;display:flex}.field.inline .field-control .input{width:8em}.field-label{min-width:0;font-size:var(--ap-font-size-sm);color:var(--ap-muted);align-items:center;gap:4px;display:flex}.field.inline .field-label{color:var(--ap-text);font-size:var(--ap-font-size-md)}.field-label .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.dot.modified{color:var(--ap-primary)}.field-grid{gap:var(--ap-space-3);grid-template-columns:repeat(auto-fill,minmax(150px,1fr));display:grid}.slider{align-items:center;gap:var(--ap-space-2);grid-template-columns:1fr 5.2em;display:grid}.slider .input{text-align:right;padding:.2em .4em}.unit{align-items:center;gap:6px;display:flex}.preset-list{gap:var(--ap-space-2);flex-direction:column;display:flex}.preset-item{gap:var(--ap-space-3);padding:var(--ap-space-3);text-align:left;border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface);cursor:pointer;align-items:flex-start;width:100%;transition:border-color .15s,background .15s;display:flex}.preset-item:hover{border-color:color-mix(in srgb, var(--ap-primary) 40%, var(--ap-border))}.preset-item.on{border-color:var(--ap-primary);background:var(--ap-tint)}.preset-mark{border:1.5px solid var(--ap-border);width:1.3em;height:1.3em;color:var(--ap-on-primary);border-radius:50%;flex:none;place-items:center;margin-top:2px;display:grid}.preset-item.on .preset-mark{background:var(--ap-primary);border-color:var(--ap-primary)}.preset-mark svg.lucide{stroke-width:3px;width:.85em;height:.85em}.preset-name{font-weight:600}.preset-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.module-row{align-items:center;gap:var(--ap-space-2);min-height:2em;display:flex}.module-row .grow{align-items:center;gap:4px;display:flex}.module-row .icon-btn.sm{width:1.4em;height:1.4em;color:var(--ap-faint)}.choice-list{flex-direction:column;gap:4px;display:flex}.choice-list.nested{padding-left:var(--ap-space-2);border-left:1px solid var(--ap-border);margin-left:.5em}.choice{align-items:center;gap:var(--ap-space-2);padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);text-align:left;cursor:pointer;background:0 0;border:1px solid #0000;width:100%;display:flex}.choice:hover{background:var(--ap-surface-2)}.choice.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint)}.choice .radio{border:1.5px solid var(--ap-faint);border-radius:50%;flex:none;place-items:center;width:1em;height:1em;display:grid}.choice.on .radio{border-color:var(--ap-primary)}.choice.on .radio:after{content:\"\";background:var(--ap-primary);border-radius:50%;width:.5em;height:.5em}.kv{flex-direction:column;gap:2px;display:flex}.kv-row{gap:var(--ap-space-2);border-bottom:1px solid var(--ap-border);grid-template-columns:minmax(5em,32%) 1fr auto;align-items:start;padding:6px 0;display:grid}.kv-row:last-of-type{border-bottom:0}.kv-key{font-weight:600;font-size:var(--ap-font-size-sm);padding-top:2px}.kv-actions{opacity:.4;transition:opacity .15s;display:flex}.kv-row:hover .kv-actions,.kv-row:focus-within .kv-actions{opacity:1}.kv-edit,.kv-empty{padding:var(--ap-space-2) 0}.btn.add{color:var(--ap-primary);align-self:flex-start;padding-left:.3em}.region{border-bottom:1px solid var(--ap-border)}.region:last-child{border-bottom:0}.region-head{align-items:center;gap:var(--ap-space-2);cursor:pointer;padding:6px 0;display:flex}.region-msg{padding:4px 0 8px}.region-msg .pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:14em;padding:6px 8px}.req{border-bottom:1px solid var(--ap-border);padding:6px 0}.req:last-child{border-bottom:0}.req pre{border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);max-height:18em;margin:6px 0 0;padding:6px 8px}.status-dot.online{color:var(--ap-success)}.status-dot.error{color:var(--ap-danger)}.status-dot.connecting{color:var(--ap-warning)}.status-dot.off{color:var(--ap-faint)}.swatches{align-items:center;gap:6px;display:flex}.swatch{border:2px solid var(--ap-border);cursor:pointer;border-radius:50%;width:1.6em;height:1.6em;padding:0;overflow:hidden}.swatch input{opacity:0;cursor:pointer;width:100%;height:100%}.preset-info{gap:2px}.preset-head{gap:6px}.preset-actions{gap:0}.text-danger{color:var(--ap-danger)}.text-warning{color:var(--ap-warning)}.clickable{cursor:pointer}.caret{transition:transform .15s}.caret.open{transform:rotate(90deg)}.build{text-align:center;padding-top:var(--ap-space-2)}.tab-col{gap:var(--ap-space-3)}.input.bare{background-color:#0000;border-color:#0000;width:auto;min-width:0;padding-left:.35em}.input.bare:hover{border-color:var(--ap-border)}.input.bare:focus{border-color:var(--ap-primary)}.chip.on{border-color:color-mix(in srgb, var(--ap-primary) 55%, transparent);background:var(--ap-tint);color:var(--ap-primary)}.um-list{margin:0 calc(-1 * var(--ap-space-2));flex-direction:column;gap:2px;display:flex}.um-row{min-height:2.6em;padding:0 var(--ap-space-2);border-radius:var(--ap-radius-sm);align-items:center;gap:4px;transition:background .15s,opacity .15s;display:flex}.um-row:hover{background:var(--ap-surface-2)}.um-row.dragging{background:var(--ap-tint)}.um-row.off .um-open{opacity:.55}.um-grip{color:var(--ap-faint);cursor:grab;touch-action:none;margin-left:-4px;display:inline-flex}.um-row.dragging .um-grip{cursor:grabbing;color:var(--ap-primary)}.um-open{text-align:left;cursor:pointer;background:0 0;border:0;flex-direction:column;flex:auto;align-items:flex-start;gap:0;min-width:0;padding:4px 0;display:flex}.um-row-name{max-width:100%}.um-row-meta{max-width:100%;line-height:1.3}.um-flag{width:1em;height:1em;margin:0 2px}.um-zap{color:var(--ap-primary)}.um-new{border:1px dashed var(--ap-border);border-radius:var(--ap-radius-md);width:100%;min-height:2.6em;color:var(--ap-muted);cursor:pointer;background:0 0;justify-content:center;align-items:center;gap:6px;transition:color .15s,border-color .15s,background .15s;display:flex}.um-picker{margin-bottom:var(--ap-space-2);padding:4px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-md);background:var(--ap-surface-2);flex-direction:column;gap:2px;display:flex}.um-picker-head{justify-content:space-between;align-items:center;gap:var(--ap-space-2);display:flex}.um-choice{align-items:flex-start;gap:var(--ap-space-2);width:100%;padding:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;transition:background .15s;display:flex}.um-choice:hover,.um-choice:focus-visible{background:var(--ap-tint)}.um-choice>svg.lucide{width:1.1em;height:1.1em;color:var(--ap-primary);flex:none;margin-top:.15em}.um-choice-text{flex-direction:column;min-width:0;line-height:1.35;display:flex}.um-choice-desc{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.um-new:hover{color:var(--ap-primary);border-color:color-mix(in srgb, var(--ap-primary) 50%, transparent);background:var(--ap-tint)}.um-editor{gap:var(--ap-space-3);flex-direction:column;display:flex}.um-head{align-items:center;gap:var(--ap-space-2);margin-left:-6px;display:flex}.um-name{font-size:var(--ap-font-size-lg);flex:auto;font-weight:600}.um-entry{flex-direction:column;gap:6px;display:flex}.um-entry>*,.um-entry-head>*{transition:opacity .15s}.um-entry+.um-entry{padding-top:var(--ap-space-3);border-top:1px solid var(--ap-border)}.um-entry-head{flex-wrap:wrap;align-items:center;gap:2px;min-width:0;display:flex}.um-entry-head>.switch{margin-right:6px}.um-entry.off .um-entry-head>:not(.switch),.um-entry.off>:not(.um-entry-head){opacity:.55}.um-entry-head select.grow{text-overflow:ellipsis;flex:8em;min-width:0;font-weight:600}.um-entry.lost .um-entry-head select.grow{color:var(--ap-warning)}.um-role{field-sizing:content;text-overflow:ellipsis;min-width:0;color:var(--ap-muted);font-size:var(--ap-font-size-sm);flex:none}.um-text,.um-var-key,.um-var-value{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace);font-size:var(--ap-font-size-sm)}.um-text{field-sizing:content;min-height:5.5em;max-height:24em}.um-warn{color:var(--ap-warning);align-items:center;gap:6px;display:flex}.um-warn svg.lucide{width:1.1em;height:1.1em}.um-var-label{flex:8em;min-width:0;padding:0 .35em;font-weight:600}.um-entry.lost .um-var-label{color:var(--ap-warning)}.um-var-row{grid-template-columns:auto 1fr auto;align-items:start;gap:4px;display:grid}.um-var-row>.switch{margin:calc(.375em + 1px) 4px 0 0}.um-var-pair{padding:2px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:2px;display:flex}.um-var-pair-head{align-items:center;gap:2px;margin-right:-6px;display:flex}.um-var-key{text-overflow:ellipsis;flex:auto;min-width:0;font-weight:600}.um-var-row>*,.um-var-pair>*,.um-var-pair-head>*{transition:opacity .15s}.um-var-row.off>:not(.switch),.um-var-pair.off>:not(.um-var-pair-head),.um-var-pair.off .um-var-pair-head>:not(.switch){opacity:.55}.um-var-key::-webkit-calendar-picker-indicator{display:none!important}textarea.input.um-var-value{field-sizing:content;resize:none;min-width:0;min-height:0;max-height:12em}.um-var-add{align-self:flex-start}.um-foot{flex-wrap:wrap;align-items:center;gap:2px;margin:0 -.5em;display:flex}.um-foot .btn{color:var(--ap-muted)}.um-foot .btn:hover:not(:disabled){color:var(--ap-text);background:var(--ap-surface-2)}.um-foot .btn.danger:hover:not(:disabled),.um-foot .btn.armed{color:var(--ap-danger)}.um-foot .btn.armed{background:color-mix(in srgb, var(--ap-danger) 10%, transparent)}.trigger{gap:var(--ap-space-2);flex-direction:column;display:flex}.always{padding:2px 0}.rule{padding:6px var(--ap-space-2) var(--ap-space-2);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface);flex-direction:column;gap:6px;display:flex}.rule-head{align-items:center;gap:2px;min-width:0;margin-left:-.35em;display:flex}.rule-subject{field-sizing:content;text-overflow:ellipsis;flex:none;min-width:0;max-width:60%;font-weight:600}.rule-target{text-overflow:ellipsis;flex:auto;min-width:0}.rule-body{flex-direction:column;gap:6px;display:flex}.rule-op{color:var(--ap-muted);align-self:flex-start;margin-left:-.35em}.rule-cmp{flex:none;width:4.2em}.rule-scope{flex:10em}.rule-join{text-transform:uppercase;letter-spacing:.04em;align-self:center;margin:-4px 0}.rule-error{color:var(--ap-danger)}.option-chips{gap:4px}.option-chips .chip{cursor:pointer}.depth{width:3.6em;padding-right:.2em}.kw-words{align-items:flex-start;gap:4px}.chips-input{cursor:text;flex-wrap:wrap;align-items:center;gap:4px;min-height:2.1em;padding:3px 4px;display:flex}.chips-input .chip{background:var(--ap-tint);color:var(--ap-primary);border-color:#0000;gap:2px;padding-right:2px}.chips-input .chip.mono{font-family:var(--monoFontFamily,ui-monospace, SFMono-Regular, Menlo, monospace)}.chip-x{width:1.3em;height:1.3em;color:inherit;cursor:pointer;opacity:.7;background:0 0;border:0;border-radius:50%;place-items:center;padding:0;display:inline-grid}.chip-x:hover{opacity:1;background:color-mix(in srgb, var(--ap-primary) 16%, transparent)}.chip-x svg.lucide{width:.85em;height:.85em}.chips-draft{background:0 0;border:0;outline:none;flex:5em;min-width:5em;padding:2px 4px}.btn.add.picker{position:relative;overflow:hidden}.btn.add.picker select{opacity:0;cursor:pointer;width:100%;position:absolute;inset:0}@container ap-panel (width<=420px){.tabs.many .tab span{display:none}.tabs.many .tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tabs.many .tab svg.lucide{width:1.35em;height:1.35em}}@container ap-panel (width<=340px){.tab span{display:none}.tab{min-width:2.4em;padding:var(--ap-space-2) 2px}.tab svg.lucide{width:1.35em;height:1.35em}.panel-head{padding-left:var(--ap-space-3)}.panel-body{padding-left:var(--ap-space-3);padding-right:var(--ap-space-3)}.segmented{grid-template-columns:repeat(auto-fit,minmax(4.6em,1fr));grid-auto-flow:row}.segmented.dense button{padding:0 .4em}.um-foot .btn:not(.armed)>span{display:none}.um-role{order:1;margin-left:calc(2.51429em + 8px)}}.preset-banner{align-items:center;gap:6px var(--ap-space-2);border-radius:var(--ap-radius-sm);background:var(--ap-tint);border:1px solid color-mix(in srgb, var(--ap-primary) 28%, transparent);font-size:var(--ap-font-size-sm);flex-wrap:wrap;margin-top:6px;margin-bottom:4px;padding:5px 5px 5px 10px;line-height:1.35;display:flex}.preset-banner-icon{color:var(--ap-primary)}.preset-banner-text{flex:11em;min-width:0}.preset-banner .btn{min-height:1.8em;margin-left:auto;padding:0 .7em}.custom-ui-list{flex-direction:column;gap:4px;margin:0;padding:0;list-style:none;display:flex}.custom-ui-list .grow{flex:auto;min-width:0}.storylines-head{gap:var(--ap-space-2);min-height:1.6em;padding:0 var(--ap-space-1) 0 var(--ap-space-3)}.storyline-card.current{border-color:color-mix(in srgb, var(--ap-primary) 45%, var(--ap-border))}.storyline-card.hidden .card-title{color:var(--ap-muted)}.storyline-dot{background:var(--ap-primary);border-radius:50%;flex:none;width:.5em;height:.5em}.storyline-flag{width:1.05em;height:1.05em;color:var(--ap-faint);flex:none}.storyline-toolbar{margin-bottom:var(--ap-space-1);border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);align-self:flex-start;align-items:center;gap:2px;padding:2px;display:flex}.storyline-toolbar .icon-btn[aria-pressed=true]{background:var(--ap-tint)}.storyline-toolbar.solo{padding:0}.storyline-toolbar.solo .icon-btn.sm{width:calc(1.6em - 2px);height:calc(1.6em - 2px)}.storyline-toolbar-sep{background:var(--ap-border);align-self:stretch;width:1px;margin:3px 2px}.storyline-floors{flex-direction:column;gap:2px;max-height:22em;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.storyline-floors li{border-radius:var(--ap-radius-sm);padding:2px 4px}.storyline-floors li:hover{background:var(--ap-surface-2)}", rE = ".media-conn{gap:var(--ap-space-3)}.media-advanced{gap:var(--ap-space-3);flex-direction:column;display:flex}.media-advanced-toggle{color:var(--ap-muted);align-self:flex-start;gap:4px}.media-refs{gap:var(--ap-space-2)}.media-ref{align-items:center;gap:var(--ap-space-2);min-width:0;display:flex}.media-ref-thumb{object-fit:cover;border-radius:var(--ap-radius-sm);background:var(--ap-surface-2);flex:none;width:2.6em;height:2.6em}.blob-placeholder{background:var(--ap-surface-2);display:inline-block}.image-card{gap:var(--ap-space-2);display:grid}.image-card.multi{grid-template-columns:repeat(auto-fill,minmax(min(100%,14em),1fr))}.image-figure{flex-direction:column;gap:4px;min-width:0;margin:0;display:flex}.image-frame{border-radius:var(--ap-radius-md);background:var(--ap-surface-2);position:relative;overflow:hidden}.image-frame.empty{border:1px dashed var(--ap-border);background:0 0;max-height:22em}.image-open{cursor:zoom-in;background:0 0;border:0;width:100%;padding:0;display:block}.image-open img{object-fit:contain;width:100%;height:auto;max-height:70vh;display:block}.image-empty{justify-content:center;align-items:center;gap:var(--ap-space-2);padding:var(--ap-space-3);text-align:center;flex-direction:column;display:flex;position:absolute;inset:0}.image-empty>svg.lucide{width:1.6em;height:1.6em}.image-prompt{-webkit-line-clamp:6;white-space:pre-wrap;-webkit-box-orient:vertical;max-height:100%;margin:0;display:-webkit-box;overflow:hidden}.image-busy{justify-content:center;align-items:center;gap:var(--ap-space-2);color:var(--ap-text);background:color-mix(in srgb, var(--ap-panel-bg-solid) 70%, transparent);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);display:flex;position:absolute;inset:0}.image-pager{border-radius:var(--ap-radius-pill);color:#fff;background:#00000073;align-items:center;gap:2px;padding:0 4px;display:flex;position:absolute;bottom:6px;right:6px}.image-pager .icon-btn{color:inherit}.image-foot{align-items:center;gap:var(--ap-space-2);min-height:1.9em;display:flex}.image-error{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.image-tools{flex:none}.image-edit textarea{resize:vertical}.image-viewer{color:#fff;background:0 0;border:0;flex-direction:column;justify-content:center;align-items:center;width:100vw;max-width:100vw;height:100vh;max-height:100vh;margin:0;padding:0;display:flex}.image-viewer:not([open]){display:none}.image-viewer::backdrop{background:#000000d1}.image-viewer-img{object-fit:contain;-webkit-user-select:none;user-select:none;max-width:96vw;max-height:calc(100vh - 4.5em)}.image-viewer-bar{align-items:center;gap:var(--ap-space-2);width:min(96vw,60em);padding:var(--ap-space-2);display:flex}.image-viewer-bar .icon-btn{color:#fff}.image-viewer-caption{opacity:.85}.speech-card{align-items:center;gap:var(--ap-space-2);min-height:2em;padding:0 var(--ap-space-1,4px);border-radius:var(--ap-radius-md);background:color-mix(in srgb, var(--ap-primary) 5%, transparent);display:flex}.speech-track{flex:auto;align-items:center;gap:2px;min-width:3em;height:1.4em;display:flex}.speech-seg{background:var(--ap-border);cursor:pointer;border:0;border-radius:2px;flex:1 1 0;min-width:3px;height:4px;padding:0;transition:height .12s,background .12s}.speech-seg.narration{opacity:.6}.speech-seg.ready{background:color-mix(in srgb, var(--ap-primary) 45%, transparent)}.speech-seg.loading{background:color-mix(in srgb, var(--ap-primary) 30%, transparent);animation:1.2s ease-in-out infinite ap-pulse}.speech-seg.error{background:var(--ap-danger)}.speech-seg.on{background:var(--ap-primary);opacity:1;height:8px}.speech-seg:hover{height:8px}.speech-who{flex:0 auto;max-width:8em}.speech-binding{align-items:flex-start;gap:var(--ap-space-2);min-width:0;display:flex}.speech-binding>.input:first-child{flex:0 9em;min-width:5em}.speech-voice{flex:auto;align-items:center;gap:4px;min-width:0;display:flex}.speech-voice>.input{flex:auto;min-width:0}.speech-results{border:1px solid var(--ap-border);border-radius:var(--ap-radius-sm);flex-direction:column;max-height:14em;display:flex;overflow:auto}.speech-result{align-items:center;gap:var(--ap-space-2);padding:4px var(--ap-space-2);color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;display:flex}.speech-result:hover{background:var(--ap-surface-2)}.speech-result .grow{min-width:0}.image-open .blob-placeholder{width:100%;min-height:8em;display:block}", iE = /* @__PURE__ */ fn({ mode: "light" }), aE = new CSSStyleSheet();
aE.replaceSync([
	$T,
	eE,
	tE,
	nE,
	rE
].join("\n"));
var oE = new CSSStyleSheet(), sE = [aE, oE], cE = [
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
function lE(e, t) {
	let n = [`--ap-${e}-500: ${t};`];
	for (let [r, i] of cE) n.push(`--ap-${e}-${r}: color-mix(in oklab, ${t}, ${i});`);
	return n.join(" ");
}
function uE(e) {
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
function dE() {
	let e = uE(getComputedStyle(document.documentElement).getPropertyValue("--SmartThemeBodyColor") || getComputedStyle(document.body).color);
	if (!e) return "dark";
	let [t, n, r] = e.map((e) => e / 255);
	return .2126 * t + .7152 * n + .0722 * r > .5 ? "dark" : "light";
}
var fE = /* @__PURE__ */ new Set();
function pE(e) {
	return fE.add(e), e.dataset.apTheme = iE.mode, () => fE.delete(e);
}
function mE() {
	let e = dE();
	if (e !== iE.mode) {
		iE.mode = e;
		for (let t of fE) t.dataset.apTheme = e;
	}
}
function hE() {
	iE.mode = dE();
	let e, t = () => {
		cancelAnimationFrame(e), e = requestAnimationFrame(mE);
	};
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), new MutationObserver(t).observe(document.body, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), document.addEventListener("visibilitychange", t), mr(() => {
		let e = lS.value?.theme?.[iE.mode] ?? {}, t = K().ui, n = [];
		for (let [t, r] of Object.entries(e)) t === "primary" || t === "accent" ? n.push(lE(t, r)) : n.push(`--ap-${t}: ${r};`);
		t.primary && n.push(lE("primary", t.primary)), t.accent && n.push(lE("accent", t.accent)), oE.replaceSync(`:host { ${n.join(" ")} }`);
	});
}
function gE(e, t = "accent") {
	let n = e || t;
	return n === "primary" || n === "accent" ? `var(--ap-${n})` : n;
}
//#endregion
//#region src/ui/host.ts
function _E(e, t, n = []) {
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
			e.adoptedStyleSheets = sE, e.replaceChildren();
			let r = document.createElement("div");
			r.className = "ap-root", e.append(r);
			let i = {};
			for (let e of n) {
				let t = this.getAttribute(e);
				i[e] = t !== null && /^-?\d+$/.test(t) ? Number(t) : t;
			}
			this.unregister = pE(this), this.app = xs(t, i), this.app.mount(r);
		}
		unmount() {
			this.app?.unmount(), this.app = null, this.unregister?.(), this.unregister = null;
		}
	}
	customElements.define(e, r);
}
//#endregion
//#region src/ui/annotations/match.ts
var vE = /[\u200B-\u200D\u2060\uFEFF\u00AD*_~`]/, yE = /\s/, bE = /[“”„‟〝〞＂「」]/, xE = /[‘’‚‛『』＇]/;
function SE(e) {
	let t = "", n = [];
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		if (!vE.test(i)) {
			if (yE.test(i)) {
				if (t.endsWith(" ")) continue;
				i = " ";
			} else bE.test(i) ? i = "\"" : xE.test(i) && (i = "'");
			t += i, n.push(r);
		}
	}
	return {
		text: t,
		map: n
	};
}
var CE = (e) => SE(e).text;
function wE(e, t) {
	let n = [];
	if (!t) return n;
	for (let r = e.indexOf(t); r >= 0; r = e.indexOf(t, r + 1)) n.push(r);
	return n;
}
function TE(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[e.length - 1 - n] === t[t.length - 1 - n];) n++;
	return n;
}
function EE(e, t) {
	let n = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	return n;
}
function DE(e, t, n, r = SE(e)) {
	let i = CE(n.quote).trim();
	if (!i) return null;
	let a = wE(r.text, i);
	if (!a.length) return null;
	let o;
	if (a.length === 1) o = a[0];
	else {
		let e = CE(n.prefix), s = CE(n.suffix), c = 0, l = a.map((t) => {
			let n = TE(e, r.text.slice(Math.max(0, t - e.length), t)) + EE(s, r.text.slice(t + i.length, t + i.length + s.length));
			return c = Math.max(c, n), {
				at: t,
				score: n
			};
		}), u = wE(CE(t.slice(0, n.start)), i).length;
		if (c > 0) {
			let e = l.filter((e) => e.score === c);
			o = (e.length > 1 ? e[Math.min(u, e.length - 1)] : e[0]).at;
		} else i.length >= 4 && a[u] !== void 0 && (o = a[u]);
	}
	return o === void 0 ? null : [r.map[o], r.map[o + i.length - 1] + 1];
}
function OE(e, t, n = !1) {
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
var kE = /* @__PURE__ */ new Set([
	"SCRIPT",
	"STYLE",
	"TEMPLATE",
	"TEXTAREA",
	"NOSCRIPT",
	"IFRAME",
	"OBJECT",
	"AP-STAGES",
	"AP-CARDS",
	"AP-TOP-CARDS",
	"AP-ANNO-BUBBLE"
]);
function AE(e, t) {
	let n = t.get(e);
	if (n !== void 0) return n;
	if (kE.has(e.tagName.toUpperCase())) n = !1;
	else if (typeof e.checkVisibility == "function") n = e.checkVisibility();
	else {
		let r = e.ownerDocument.defaultView;
		n = !e.hidden && (!r || r.getComputedStyle(e).display !== "none"), n && e.parentElement && (n = AE(e.parentElement, t));
	}
	return t.set(e, n), n;
}
function jE(e) {
	let t = e.ownerDocument, n = /* @__PURE__ */ new Map(), r = [], i = t.createTreeWalker(e, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, { acceptNode(e) {
		return e.nodeType === Node.ELEMENT_NODE ? kE.has(e.tagName.toUpperCase()) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP : e.data && e.parentElement && AE(e.parentElement, n) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	for (let e = i.nextNode(); e; e = i.nextNode()) r.push(e);
	return r;
}
function ME(e, t, n, r = jE(e)) {
	let i = r.map((e) => e.data), a = i.join(""), o = SE(a), s = [];
	for (let e of n) {
		let n = DE(a, t, e, o);
		n && s.push({
			item: e,
			start: OE(i, n[0]),
			end: OE(i, n[1], !0)
		});
	}
	return {
		nodes: r,
		located: s
	};
}
function NE(e, t) {
	let n = e.nodes[0].ownerDocument.createRange();
	return n.setStart(e.nodes[t.start[0]], t.start[1]), n.setEnd(e.nodes[t.end[0]], t.end[1]), n;
}
var PE = (e, t) => e[0] < t[0] || e[0] === t[0] && e[1] < t[1];
function FE(e, t, n) {
	let r = [...e.located].sort((e, t) => PE(e.start, t.start) ? 1 : PE(t.start, e.start) ? -1 : 0), i = null;
	for (let a of r) if (!(i && PE(i, a.end))) {
		i = a.start;
		for (let r = a.end[0]; r >= a.start[0]; r--) {
			let i = e.nodes[r], o = r === a.start[0] ? a.start[1] : 0, s = r === a.end[0] ? a.end[1] : i.length;
			if (o >= s || !i.parentNode || i.parentElement?.namespaceURI !== "http://www.w3.org/1999/xhtml") continue;
			s < i.length && i.splitText(s);
			let c = o > 0 ? i.splitText(o) : i, l = i.ownerDocument.createElement(t);
			c.parentNode.insertBefore(l, c), l.append(c), n(l, a);
		}
	}
}
function IE(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) n.parentNode && (t.add(n.parentNode), n.replaceWith(...n.childNodes));
	for (let e of t) e.normalize();
}
//#endregion
//#region src/ui/annotations/layer.ts
var LE = 0;
function RE(e, t) {
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
var zE = (e, t, n) => t >= e.left - 1 && t <= e.right + 1 && n >= e.top - 1 && n <= e.bottom + 1;
function BE(e) {
	let t = e.defaultView;
	return !!(t?.CSS?.highlights && t.Highlight);
}
var VE = class {
	spec;
	states = /* @__PURE__ */ new Map();
	marked = null;
	constructor(e) {
		this.spec = e;
	}
	get styleId() {
		return `${this.spec.name}-style`;
	}
	injectStyle(e) {
		let t = e.getElementById(this.styleId);
		t || (t = e.createElement("style"), t.id = this.styleId, (e.head ?? e.documentElement).append(t));
		let n = this.spec.css();
		t.textContent !== n && (t.textContent = n);
	}
	restyle() {
		for (let e of this.live()) this.injectStyle(e.doc);
	}
	hitTest(e, t) {
		let n = t.target instanceof e.doc.defaultView.Node ? t.target : null;
		if (!n) return null;
		let r = (n.nodeType === Node.ELEMENT_NODE ? n : n.parentElement)?.closest(this.spec.name);
		if (r) {
			let n = e.byWrap.get(r);
			if (n) {
				let i = [...r.getClientRects()].find((e) => zE(e, t.clientX, t.clientY)) ?? r.getBoundingClientRect();
				return {
					key: n.key,
					mesId: n.mesId,
					item: n.item,
					rect: RE(i, e.doc),
					doc: e.doc
				};
			}
		}
		for (let r of e.owners.values()) for (let i of r) {
			let r = i.range;
			if (r && !r.collapsed && r.intersectsNode(n)) {
				for (let n of r.getClientRects()) if (zE(n, t.clientX, t.clientY)) return {
					key: i.key,
					mesId: i.mesId,
					item: i.item,
					rect: RE(n, e.doc),
					doc: e.doc
				};
			}
		}
		return null;
	}
	attach(e) {
		let { doc: t } = e, n = this.spec, r = (e) => !!n.ignore?.(e), i = 0, a = null, o = "mouse", s = (o) => {
			o.pointerType === "mouse" && (a = o, !i && (i = requestAnimationFrame(() => {
				i = 0, a && !r(a) && n.move?.(this.hitTest(e, a), t);
			})));
		}, c = (e) => {
			o = e.pointerType || "mouse";
		}, l = (t) => {
			r(t) || n.click?.(this.hitTest(e, t), o, t);
		}, u = (e) => {
			r(e) || n.scroll?.();
		}, d = () => n.leave?.();
		return n.move && t.addEventListener("pointermove", s, { passive: !0 }), t.addEventListener("pointerdown", c, {
			passive: !0,
			capture: !0
		}), n.click && t.addEventListener("click", l, !0), n.scroll && t.addEventListener("scroll", u, {
			passive: !0,
			capture: !0
		}), n.leave && t.documentElement.addEventListener("mouseleave", d), () => {
			cancelAnimationFrame(i), t.removeEventListener("pointermove", s), t.removeEventListener("pointerdown", c, !0), t.removeEventListener("click", l, !0), t.removeEventListener("scroll", u, !0), t.documentElement?.removeEventListener("mouseleave", d);
		};
	}
	stateOf(e) {
		let t = this.states.get(e);
		if (t) return t;
		let n = e.defaultView, r = n?.CSS?.highlights, i = n?.Highlight, a = null, o = null;
		if (r && i) {
			let e = (e) => {
				let t = r.get(e) ?? new i();
				return this.spec.priority !== void 0 && (t.priority = this.spec.priority), r.set(e, t), t;
			};
			a = e(this.spec.name), o = e(`${this.spec.name}-on`);
		}
		return this.injectStyle(e), t = {
			doc: e,
			serial: ++LE,
			highlight: a,
			on: o,
			owners: /* @__PURE__ */ new Map(),
			byWrap: /* @__PURE__ */ new WeakMap(),
			detach: () => {}
		}, t.detach = this.attach(t), this.states.set(e, t), t;
	}
	live() {
		for (let [e, t] of this.states) e.defaultView || (t.detach(), this.states.delete(e));
		return [...this.states.values()];
	}
	watch(e) {
		this.stateOf(e);
	}
	paint(e, t, n, r, i) {
		let a = this.drop(e, t, !!r), o = r?.() ?? null;
		if (!o?.located.length) this.release(t);
		else {
			let r = this.stateOf(t), s = (e) => `${r.serial}:${n}:${this.spec.id(e)}`, c = [];
			if (r.highlight) for (let e of o.located) {
				let t = NE(o, e);
				r.highlight.add(t), c.push({
					key: s(e.item),
					mesId: n,
					item: e.item,
					range: t
				});
			}
			else if (i) {
				let e = /* @__PURE__ */ new Map();
				FE(o, this.spec.name, (t, i) => {
					let a = e.get(i);
					a || (a = {
						key: s(i.item),
						mesId: n,
						item: i.item,
						wraps: []
					}, e.set(i, a), c.push(a)), a.wraps.push(t), r.byWrap.set(t, a);
				});
			}
			c.length && r.owners.set(e, c);
			for (let e of c) a.delete(e.key);
			if (this.marked) for (let e of c) this.emphasise(r, e, this.marked(e.mesId, e.item));
		}
		a.size && this.spec.forget?.(a);
	}
	emphasise(e, t, n) {
		t.range && e.on && (n ? e.on.add(t.range) : e.on.delete(t.range));
		for (let e of t.wraps ?? []) e.toggleAttribute("data-on", n);
	}
	mark(e) {
		this.marked = e;
		for (let t of this.live()) for (let n of t.owners.values()) for (let r of n) this.emphasise(t, r, !!e?.(r.mesId, r.item));
	}
	drop(e, t, n = !1) {
		let r = /* @__PURE__ */ new Set();
		for (let i of t ? [this.states.get(t)].filter((e) => !!e) : this.live()) {
			let t = i.owners.get(e);
			if (t) {
				i.owners.delete(e);
				for (let e of t) r.add(e.key), e.range && (i.highlight?.delete(e.range), i.on?.delete(e.range)), e.wraps && IE(e.wraps);
				!n && !i.owners.size && i.doc !== document && (i.detach(), this.states.delete(i.doc));
			}
		}
		return r;
	}
	release(e) {
		let t = this.states.get(e);
		t && !t.owners.size && e !== document && (t.detach(), this.states.delete(e));
	}
	clear(e, t) {
		let n = this.drop(e, t);
		n.size && this.spec.forget?.(n);
	}
}, HE = /* @__PURE__ */ new Set([
	"P",
	"BLOCKQUOTE",
	"UL",
	"OL",
	"LI",
	"BR",
	"HR"
]), UE = /* @__PURE__ */ new Set([
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
]), WE = (e) => e.replace(/[&<>"']/g, (e) => ({
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
})[e]);
function GE(e) {
	return WE(e).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
}
function KE(e) {
	return e.trim().split(/\n{2,}/).map((e) => /^>\s?/.test(e) ? `<blockquote>${GE(e.replace(/^>\s?/gm, "")).replace(/\n/g, "<br>")}</blockquote>` : /^[-*]\s/.test(e) ? `<ul>${e.split(/\n/).map((e) => `<li>${GE(e.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>` : `<p>${GE(e).replace(/\n/g, "<br>")}</p>`).join("");
}
function qE(e, t) {
	if (e.nodeType === Node.TEXT_NODE) return t.createTextNode(e.textContent ?? "");
	if (e.nodeType !== Node.ELEMENT_NODE) return null;
	let n = e, r = n.tagName, i = t.createDocumentFragment(), a = () => {
		for (let e of [...n.childNodes]) {
			let n = qE(e, t);
			n && i.appendChild(n);
		}
	};
	if (!HE.has(r) && !UE.has(r)) return a(), i;
	let o = t.createElement(r.toLowerCase());
	r === "P" && n.hasAttribute("special") && (o.className = "special");
	for (let e of [...n.childNodes]) {
		let n = qE(e, t);
		n && o.appendChild(n);
	}
	return o;
}
function JE(e) {
	if (!e) return "";
	if (!/<\/?[a-z][^>]*>/i.test(e)) return KE(e);
	let t = new DOMParser().parseFromString(`<body>${e}</body>`, "text/html"), n = document.implementation.createHTMLDocument(""), r = n.createElement("div");
	for (let e of [...t.body.childNodes]) {
		if (e.nodeType === Node.TEXT_NODE && e.textContent?.trim()) {
			r.insertAdjacentHTML("beforeend", KE(e.textContent));
			continue;
		}
		let t = qE(e, n);
		t && r.appendChild(t);
	}
	return r.innerHTML;
}
//#endregion
//#region src/ui/message/model.ts
function YE(e, t, n, r) {
	return e && Np(e)?.workflows?.[t]?.stages?.[n] || r;
}
function XE(e, t) {
	let n = e && t === e.narrator ? "primary" : "accent";
	return gE(e?.actors[t]?.color, n);
}
function ZE(e) {
	return G(() => {
		let t = e(), n = fS(t), r = ub(t, dS(t));
		if (r && (r.status === "running" || !n || n.genId !== r.genId)) {
			let e = wp(r.presetId);
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
					label: YE(e, r.workflow, t.id, t.label),
					color: XE(e, t.actor)
				}))
			};
		}
		if (!n) return null;
		let i = wp(n.presetId);
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
				label: YE(i, n.workflow, e.id, e.label),
				text: e.text ?? "",
				status: e.status,
				patches: e.patches,
				color: XE(i, e.actor)
			}))
		};
	});
}
//#endregion
//#region src/ui/annotations/bubble.ts
var QE = /* @__PURE__ */ fn({
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
}), $E, eD, tD = null;
function nD(t) {
	let n = wp(cm(e().chat[t])?.presetId ?? "");
	if (!n) return {
		author: "",
		color: ""
	};
	let r = dd(n, Im(n), n.narrator);
	try {
		r = e().substituteParams(r);
	} catch {}
	return {
		author: r,
		color: XE(n, n.narrator)
	};
}
function rD(e, t) {
	clearTimeout($E), clearTimeout(eD), eD = void 0, tD = null, QE.key !== e.key && Object.assign(QE, nD(e.mesId), { html: JE(e.ann.comment) }), Object.assign(QE, {
		open: !0,
		pinned: t,
		key: e.key,
		rect: e.rect
	}), QE.rev++;
}
function iD() {
	clearTimeout($E), clearTimeout(eD), eD = void 0, tD = null, QE.open && (QE.open = !1, QE.pinned = !1, QE.key = null);
}
function aD(e) {
	if (!QE.pinned) {
		if (e) {
			if (QE.open && QE.key === e.key) {
				clearTimeout(eD), eD = void 0;
				return;
			}
			if (tD === e.key) return;
			clearTimeout($E), tD = e.key, $E = setTimeout(() => rD(e, !1), 150);
		} else clearTimeout($E), tD = null, cD();
	}
}
function oD(e) {
	e && !(QE.open && QE.key === e.key) ? rD(e, !0) : iD();
}
function sD() {
	clearTimeout(eD), eD = void 0;
}
function cD() {
	!QE.open || QE.pinned || eD || (eD = setTimeout(iD, 200));
}
function lD(e) {
	QE.key && e.has(QE.key) && iD(), tD && e.has(tD) && (clearTimeout($E), tD = null);
}
//#endregion
//#region src/ui/annotations/paint.ts
var uD = "#a855f7", dD = () => null;
function fD(e) {
	dD = e;
}
function pD(e) {
	let t = dD();
	return !!(t && e.composedPath().includes(t));
}
var mD = "ap-anno", hD = new VE({
	name: mD,
	priority: 1,
	css() {
		let e = "text-decoration-line: underline; text-decoration-style: dashed; text-decoration-color: var(--ap-anno-color); text-decoration-thickness: max(1px, 0.08em); text-underline-offset: 0.25em;";
		return `:root { --ap-anno-color: ${uD}; }
::highlight(${mD}) { ${e} }
${mD} { ${e} text-decoration-skip-ink: none; cursor: help; }`;
	},
	id: (e) => e.id,
	move: (e) => aD(e && {
		key: e.key,
		mesId: e.mesId,
		ann: e.item,
		rect: e.rect
	}),
	click(e, t) {
		t === "mouse" ? e || iD() : oD(e && {
			key: e.key,
			mesId: e.mesId,
			ann: e.item,
			rect: e.rect
		});
	},
	scroll: iD,
	leave: () => aD(null),
	ignore: pD,
	forget: lD
});
function gD(e) {
	e !== uD && (uD = e, hD.restyle());
}
var _D = () => uD, vD = (e) => hD.watch(e), yD = "ap-speech", bD = "data-ap-speech-hover", xD = new VE({
	name: yD,
	priority: 0,
	css() {
		let e = _D(), t = `text-decoration-line: underline; text-decoration-style: solid; text-decoration-color: color-mix(in srgb, ${e} 60%, transparent); text-decoration-thickness: max(1px, 0.07em); text-underline-offset: 0.3em;`, n = `background-color: color-mix(in srgb, ${e} 16%, transparent);`;
		return `::highlight(${yD}) { ${t} }
::highlight(${yD}-on) { ${n} }
${yD} { ${t} text-decoration-skip-ink: none; cursor: pointer; }
${yD}[data-on] { ${n} }
html[${bD}], html[${bD}] * { cursor: pointer !important; }`;
	},
	id: (e) => e.id,
	move(e, t) {
		t.documentElement.toggleAttribute(bD, !!e);
	},
	leave() {
		document.documentElement.removeAttribute(bD);
	},
	click(e, t, n) {
		e && (e.doc.getSelection()?.toString() || (n.preventDefault(), Cw(e.mesId, e.item.id)));
	}
}), SD = 6, CD = 8;
function wD(e, t, n, r = "center", i = !1) {
	let a = e.top - SD - t.height >= CD, o = e.bottom + SD + t.height <= n.height - CD, s = i ? "bottom" : "top";
	s === "top" && !a && (o || e.top < n.height - e.bottom) ? s = "bottom" : s === "bottom" && !o && (a || e.top > n.height - e.bottom) && (s = "top");
	let c = s === "top" ? e.top - SD - t.height : e.bottom + SD;
	c = Math.max(CD, Math.min(c, n.height - CD - t.height));
	let l = r === "start" ? e.left : r === "end" ? e.right - t.width : e.left + e.width / 2 - t.width / 2;
	return l = Math.max(CD, Math.min(l, n.width - CD - t.width)), {
		left: Math.round(l),
		top: Math.round(c),
		side: s
	};
}
function TD(e, t) {
	let n = /* @__PURE__ */ j(!1), r = /* @__PURE__ */ j(null);
	function i() {
		let n = e.value, i = r.value;
		if (!n || !i) return;
		let a = {
			width: document.documentElement.clientWidth || innerWidth,
			height: innerHeight
		};
		i.style.maxWidth = `${Math.min(280, a.width - 16)}px`, i.style.left = "0px", i.style.top = "0px";
		let o = i.getBoundingClientRect(), s = wD(n.getBoundingClientRect(), o, a, t().align, t().below);
		i.style.left = `${s.left - o.left}px`, i.style.top = `${s.top - o.top}px`, i.dataset.side = s.side;
	}
	let a = () => {
		n.value && i();
	};
	return gr(n, async (e) => {
		if (!e) {
			removeEventListener("scroll", a, !0), removeEventListener("resize", a);
			return;
		}
		await Xn();
		let t = r.value;
		if (t) {
			try {
				t.matches(":popover-open") || t.showPopover?.();
			} catch {}
			i(), addEventListener("scroll", a, !0), addEventListener("resize", a);
		}
	}), Xr(() => {
		n.value = !1, removeEventListener("scroll", a, !0), removeEventListener("resize", a);
	}), {
		open: n,
		bubble: r
	};
}
//#endregion
//#region src/ui/annotations/AnnoBubble.vue?vue&type=script&setup=true&lang.ts
var ED = {
	key: 0,
	class: "anno-author"
}, DD = ["innerHTML"], OD = /* @__PURE__ */ F({
	__name: "AnnoBubble",
	setup(e) {
		let t = /* @__PURE__ */ j(null);
		function n() {
			let e = t.value;
			if (!e) return;
			let n = {
				width: document.documentElement.clientWidth || innerWidth,
				height: innerHeight
			};
			e.style.maxWidth = `${Math.min(320, n.width - 16)}px`, e.style.left = "0px", e.style.top = "0px";
			let r = e.getBoundingClientRect(), i = QE.rect, a = wD(DOMRect.fromRect({
				x: i.left,
				y: i.top,
				width: i.width,
				height: i.height
			}), r, n, "center");
			e.style.left = `${a.left - r.left}px`, e.style.top = `${a.top - r.top}px`, e.dataset.side = a.side;
		}
		return gr(() => QE.open && QE.rev, async (e) => {
			if (!e) return;
			await Xn();
			let r = t.value;
			if (r) {
				try {
					r.matches(":popover-open") || r.showPopover?.();
				} catch {}
				n();
			}
		}), Xr(() => {
			QE.open = !1;
		}), (e, n) => M(QE).open ? (R(), z("div", {
			key: 0,
			ref_key: "el",
			ref: t,
			class: "anno-bubble",
			popover: "manual",
			role: "tooltip",
			style: Ie({ "--actor": M(QE).color || "var(--ap-primary)" }),
			onMouseenter: n[0] ||= (...e) => M(sD) && M(sD)(...e),
			onMouseleave: n[1] ||= (...e) => M(cD) && M(cD)(...e)
		}, [M(QE).author ? (R(), z("div", ED, A(M(QE).author), 1)) : W("", !0), V("div", {
			class: "rich anno-text",
			innerHTML: M(QE).html
		}, null, 8, DD)], 36)) : W("", !0);
	}
}), kD = /* @__PURE__ */ new Set();
function AD(e) {
	return sw(e).length ? GS(e).filter((e) => !e.orphan) : [];
}
function jD(e) {
	let t = e.documentElement?.dataset.apAnnotations ?? e.body?.dataset.apAnnotations;
	return t === "off" || t === "manual";
}
var MD = () => K().ui.annotations?.show !== !1, ND = class {
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
		}), kD.add(this), this.schedule(0);
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
		for (let [t, n] of this.frames) e.has(t) || (t.removeEventListener("load", n.onLoad), n.observer?.disconnect(), n.doc && this.clear(n.doc), this.frames.delete(t));
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
			n !== e.doc && (e.observer?.disconnect(), e.doc && this.clear(e.doc), e.doc = n, e.observer = null, n?.documentElement && (e.observer = new MutationObserver(() => this.schedule(120)), e.observer.observe(n.documentElement, {
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
	clear(e) {
		hD.clear(this, e), xD.clear(this, e);
	}
	refresh() {
		if (this.disposed) return;
		if (!this.el.isConnected) {
			this.clear();
			return;
		}
		this.syncFrames();
		let t = this.mesId, n = e().chat[t], r = ob.current, i = r?.status === "running" && r.mesId === t, a = !(!n || n.is_user || i), o = a && MD() ? zS(t).filter((e) => !e.orphan) : [], s = a ? AD(t) : [], c = n?.mes ?? "", l = (e, n, r, i, a) => e.paint(this, r, t, n.length ? () => ME(i, c, n) : null, a);
		l(hD, o, document, this.el, !BE(document)), l(xD, s, document, this.el, !BE(document));
		for (let e of this.frames.values()) {
			let t = e.doc;
			if (!t?.body || !t.defaultView) continue;
			let n = jD(t);
			l(hD, n ? [] : o, t, t.body, !1), l(xD, n ? [] : s, t, t.body, !1), e.observer?.takeRecords();
		}
		this.observer.takeRecords();
	}
	dispose() {
		if (!this.disposed) {
			this.disposed = !0, clearTimeout(this.timer), this.observer.disconnect();
			for (let [e, t] of this.frames) e.removeEventListener("load", t.onLoad), t.observer?.disconnect();
			this.frames.clear(), this.clear(), kD.delete(this);
		}
	}
};
function PD(e, t) {
	for (let n of kD) (e === void 0 || n.mesId === e) && n.schedule(t);
}
function FD() {
	for (let e of kD) e.hasFrames && e.schedule(0);
}
function ID() {
	for (let e of kD) e.el.isConnected || e.dispose();
}
var LD = /* @__PURE__ */ new WeakMap();
function RD(e) {
	let t = LD.get(e);
	(!t || t.disposed) && LD.set(e, new ND(e));
}
//#endregion
//#region src/ui/annotations/index.ts
var zD = () => window.__TAURITAVERN__?.api?.chatSurface, BD = (() => {
	let e;
	return () => e ??= (() => {
		try {
			return zD()?.isManagedOwnershipRequired?.() === !0;
		} catch {
			return !1;
		}
	})();
})(), VD = !1;
function HD() {
	let t = zD();
	!VD && t && BD() && (t.protocolVersion === 1 ? (VD = !0, t.registerParticipant({
		id: "advanced-preset/annotations",
		protocolVersion: 1,
		didCommitContent({ mesid: t, content: n }) {
			let r = Number(t);
			if (e().chat[r]?.is_user) return;
			let i = new ND(n, r);
			return () => i.dispose();
		}
	})) : console.warn("[AP] unsupported ChatSurface protocol", t.protocolVersion));
}
function UD(e, t) {
	t && !BD() && RD(e);
}
var WD = null;
function GD() {
	return (!WD || !WD.isConnected) && (WD = document.createElement("ap-anno-bubble"), document.body.append(WD)), WD;
}
function KD() {
	_E("ap-anno-bubble", OD), GD(), fD(() => WD), vD(document), mr(() => {
		let e = K().ui, t = lS.value?.theme?.[iE.mode]?.accent;
		gD(e.annotations?.color || e.accent || t || (iE.mode === "dark" ? "#c084fc" : "#9333ea")), xD.restyle();
	}), gr(() => {
		let e = Zb().speech;
		return [
			e.enabled,
			e.active,
			e.narrator,
			e.connections.length
		];
	}, () => PD(void 0, 0)), gr(() => aw.playing && `${aw.playing.mesId}:${aw.playing.segId}`, () => {
		let e = aw.playing;
		xD.mark(e ? (t, n) => t === e.mesId && n.id === e.segId : null);
	}), JS.on("change", (e) => PD(e)), gr(MD, () => {
		iD(), PD(void 0, 0);
	}), gr(() => ob.current?.status, () => PD()), HS.on("change", (e) => PD(e));
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [n.CHAT_CHANGED, n.MORE_MESSAGES_LOADED]) e && t.on(e, () => {
		iD(), ID();
	});
	t.on("message_iframe_render_ended", () => FD()), addEventListener("resize", () => iD());
}
//#endregion
//#region src/ui/storylines.ts
var qD = G(() => {
	X.chatRev;
	let e = lS.value;
	return !!(e && D_(e, Im(e)));
}), JD = null;
function YD() {
	let t = e().chat ?? [];
	return (!JD || JD.rev !== X.chatRev || JD.chat !== t || JD.len !== t.length) && (JD = {
		rev: X.chatRev,
		chat: t,
		len: t.length,
		keys: A_(t)
	}), JD.keys;
}
var XD = () => {
	JD = null;
}, ZD = 60, QD = (e) => {
	let t = e.replace(/\s+/g, " ").trim();
	return t.length > ZD ? `${t.slice(0, ZD)}…` : t;
};
function $D(t) {
	X.chatRev;
	let n = e().chat ?? [], r = YD(), i = O_(), a = ["", ...r.filter((e, t) => e && r.indexOf(e) === t)], o = r.length ? r[r.length - 1] : "";
	return a.map((e) => {
		let a = [];
		return r.forEach((r, i) => {
			let o = n[i];
			if (r !== e || o.is_system && !o.is_user) return;
			let s = t && !o.is_user ? cm(o)?.structures?.[t] : void 0;
			a.push({
				index: i,
				user: o.is_user,
				title: QD(s?.event || Qp(o))
			});
		}), {
			key: e,
			name: qp(e, i),
			main: e === "",
			if: Gp(e, i),
			hidden: Kp(e, i),
			pending: Vp(e),
			current: e === o,
			floors: a
		};
	}).filter((e) => e.main || e.floors.length);
}
async function eO(t) {
	let n = e(), r = document.querySelector(`#chat > .mes[mesid="${t}"]`);
	r ? r.scrollIntoView({
		behavior: "smooth",
		block: "start"
	}) : n.executeSlashCommandsWithOptions && await n.executeSlashCommandsWithOptions(`/chat-jump ${t}`, { handleExecutionErrors: !0 });
}
//#endregion
//#region src/ui/storyline-tag.ts
var tO = "data-ap-storyline-tag", nO = "ap-storyline-tag-hidden";
function rO(e, t, n) {
	let r = e.querySelectorAll(`[${tO}]`);
	if (r.length) {
		for (let e of r) e.classList.toggle(nO, n);
		return;
	}
	if (!n || !t?.is_user) return;
	let i = Zu(t.mes);
	if (!i) return;
	let a = t.mes.slice(i.at).trim(), o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = null;
	for (; o.nextNode();) o.currentNode.textContent?.trim() && (s = o.currentNode);
	if (!s) return;
	let c = s.parentElement, l = s.textContent ?? "", u = a.slice(1);
	if (c && c !== e && /^H[1-6]$/.test(c.tagName) && c.textContent?.trim() === u) {
		c.setAttribute(tO, ""), c.classList.add(nO);
		return;
	}
	let d = l.trimEnd();
	if (!d.endsWith(a)) return;
	let f = d.length - a.length, p = s.splitText(f), m = document.createElement("span");
	m.setAttribute(tO, ""), m.className = nO, p.replaceWith(m), m.append(p);
}
//#endregion
//#region src/ui/mounts.ts
var iO = "ap-hidden", aO = [
	"meta-pure",
	"impersonate",
	"summary"
];
function oO(e, t) {
	let n = document.createElement(e);
	return n.setAttribute("mesid", String(t)), n;
}
function sO(t) {
	let n = Number(t.getAttribute("mesid")), r = t.querySelector(":scope > .mes_block"), i = r?.querySelector(":scope > .mes_text");
	if (!r || !i || Number.isNaN(n)) return;
	let a = e().chat[n], o = cm(a), s = !!ub(n, a);
	a && !a.is_user && UD(i, !!(o?.annotations?.length || o?.speech?.length || s));
	let c = qD.value;
	rO(i, a, c);
	let l = !(!a || a.is_user || !o && !s), u = r.querySelector(":scope > ap-stages"), d = r.querySelector(":scope > ap-top-cards"), f = r.querySelector(":scope > ap-cards");
	l ? ((!d || d.nextElementSibling !== i) && (d?.remove(), d = oO("ap-top-cards", n), d.setAttribute("position", "top"), i.before(d)), (!u || u.nextElementSibling !== d) && (u?.remove(), u = oO("ap-stages", n), d.before(u)), (!f || f.previousElementSibling !== i) && (f?.remove(), f = oO("ap-cards", n), i.after(f)), u.getAttribute("mesid") !== String(n) && u.setAttribute("mesid", String(n)), d.getAttribute("mesid") !== String(n) && d.setAttribute("mesid", String(n)), f.getAttribute("mesid") !== String(n) && f.setAttribute("mesid", String(n)), i.classList.toggle(iO, !!(!s && o && aO.includes(o.turn))), cO(r, i, n, c)) : (u?.remove(), d?.remove(), f?.remove(), i.classList.remove(iO), cO(r, i, n, c));
}
function cO(e, t, n, r) {
	let i = e.querySelector(":scope > ap-storyline");
	if (!r || !YD()[n]) {
		i?.remove();
		return;
	}
	let a = e.querySelector(":scope > ap-stages") ?? e.querySelector(":scope > ap-top-cards") ?? t;
	i ||= oO("ap-storyline", n), i.nextElementSibling !== a && a.before(i), i.getAttribute("mesid") !== String(n) && i.setAttribute("mesid", String(n));
}
function lO(e = document) {
	for (let t of e.querySelectorAll("#chat > .mes[mesid]")) sO(t);
}
function uO() {
	let e = document.getElementById("chat");
	if (!e) return;
	let t = e.querySelector(":scope > ap-dock");
	t ? t.nextElementSibling && e.append(t) : (t = document.createElement("ap-dock"), e.append(t));
}
var dO = 0, fO = /* @__PURE__ */ new Set(), pO = !1;
function mO(e) {
	e ? fO.add(e) : pO = !0, !dO && (dO = requestAnimationFrame(() => {
		if (dO = 0, XD(), pO) lO();
		else for (let e of fO) e.isConnected && sO(e);
		fO.clear(), pO = !1, uO(), ID();
	}));
}
function hO() {
	sS(), mO();
}
function gO() {
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.CHAT_CHANGED,
		n.MORE_MESSAGES_LOADED,
		n.MESSAGE_UPDATED,
		n.MESSAGE_EDITED,
		n.MESSAGE_SWIPED,
		n.MESSAGE_DELETED,
		n.CHARACTER_MESSAGE_RENDERED,
		n.USER_MESSAGE_RENDERED,
		"advanced_preset_message_updated"
	]) e && t.on(e, hO);
	let r = () => {
		let e = document.getElementById("chat");
		if (!e) return void setTimeout(r, 500);
		new MutationObserver((t) => {
			for (let n of t) {
				if (n.target === e) {
					for (let e of n.addedNodes) e instanceof Element && e.matches(".mes[mesid]") && mO(e);
					continue;
				}
				let t = n.target.closest?.("#chat > .mes[mesid]");
				t && n.target === t.querySelector(":scope > .mes_block") && mO(t);
			}
		}).observe(e, {
			childList: !0,
			subtree: !0
		}), mO();
	};
	r(), gr(() => qD.value, () => hO());
	let i;
	gr(() => ob.current && ob.current.status === "running" && ob.current.streaming && ob.current.mesId === null, (t) => {
		clearInterval(i), t && (i = setInterval(() => {
			let t = ob.current, n = e().streamingProcessor?.messageId;
			if (!t || t.status !== "running") return clearInterval(i);
			typeof n == "number" && n >= 0 && (lb(t, n), clearInterval(i), hO());
		}, 100));
	}), gr(() => ob.current?.status, () => mO());
}
//#endregion
//#region src/ui/entry.ts
var _O = "left-nav-panel", vO = "ap-preset-banner";
function yO() {
	return document.getElementById(_O);
}
function bO() {
	let e = yO();
	e && !e.classList.contains("openDrawer") && (e.parentElement?.querySelector(":scope > .drawer-toggle"))?.click();
}
function xO() {
	let e = document.getElementById("settings_preset_openai")?.parentElement;
	e && e.nextElementSibling?.localName !== vO && e.after(document.createElement(vO));
}
var SO = ["[data-preset-manager-rename=\"openai\"]", "#new_oai_preset"];
function CO() {
	gr(() => X.presetId, (e) => {
		for (let t of document.querySelectorAll(SO.join(","))) t.classList.toggle("ap-carrier-hidden", !!e);
	}, { immediate: !0 });
}
function wO(e) {
	let t = yO();
	t && t.querySelector(":scope > ap-panel") && t.classList.toggle("ap-panel-covering", e);
}
function TO() {
	let e = yO();
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
function EO() {
	xO(), CO(), TO(), gr(() => X.panelOpen, (e) => {
		e && bO();
	});
	let e = yO();
	e && new MutationObserver(() => {
		e.classList.contains("openDrawer") || (X.panelOpen = !1);
	}).observe(e, {
		attributes: !0,
		attributeFilter: ["class"]
	});
}
//#endregion
//#region node_modules/.pnpm/lucide-vue-next@1.0.0_vue@3.5.44_typescript@5.9.3_/node_modules/lucide-vue-next/dist/esm/shared/src/utils/hasA11yProp.js
var DO = (e) => {
	for (let t in e) if (t.startsWith("aria-") || t === "role" || t === "title") return !0;
	return !1;
}, OO = (e) => e === "", kO = (...e) => e.filter((e, t, n) => !!e && e.trim() !== "" && n.indexOf(e) === t).join(" ").trim(), AO = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), jO = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, n) => n ? n.toUpperCase() : t.toLowerCase()), MO = (e) => {
	let t = jO(e);
	return t.charAt(0).toUpperCase() + t.slice(1);
}, NO = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": 2,
	"stroke-linecap": "round",
	"stroke-linejoin": "round"
}, PO = ({ name: e, iconNode: t, absoluteStrokeWidth: n, "absolute-stroke-width": r, strokeWidth: i, "stroke-width": a, size: o = NO.width, color: s = NO.stroke, ...c }, { slots: l }) => Ka("svg", {
	...NO,
	...c,
	width: o,
	height: o,
	stroke: s,
	"stroke-width": OO(n) || OO(r) || n === !0 || r === !0 ? Number(i || a || NO["stroke-width"]) * 24 / Number(o) : i || a || NO["stroke-width"],
	class: kO("lucide", c.class, ...e ? [`lucide-${AO(MO(e))}-icon`, `lucide-${AO(e)}`] : ["lucide-icon"]),
	...!l.default && !DO(c) && { "aria-hidden": "true" }
}, [...t.map((e) => Ka(...e)), ...l.default ? [l.default()] : []]), Z = (e, t) => (n, { slots: r, attrs: i }) => Ka(PO, {
	...i,
	...n,
	iconNode: t,
	name: e
}, r), FO = Z("arrow-down", [["path", {
	d: "M12 5v14",
	key: "s699le"
}], ["path", {
	d: "m19 12-7 7-7-7",
	key: "1idqje"
}]]), IO = Z("arrow-left", [["path", {
	d: "m12 19-7-7 7-7",
	key: "1l729n"
}], ["path", {
	d: "M19 12H5",
	key: "x3x0zl"
}]]), LO = Z("audio-lines", [
	["path", {
		d: "M2 10v3",
		key: "1fnikh"
	}],
	["path", {
		d: "M6 6v11",
		key: "11sgs0"
	}],
	["path", {
		d: "M10 3v18",
		key: "yhl04a"
	}],
	["path", {
		d: "M14 8v7",
		key: "3a1oy3"
	}],
	["path", {
		d: "M18 5v13",
		key: "123xd1"
	}],
	["path", {
		d: "M22 10v3",
		key: "154ddg"
	}]
]), RO = Z("ban", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M4.929 4.929 19.07 19.071",
	key: "196cmz"
}]]), zO = Z("blocks", [["path", {
	d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2",
	key: "1ah6g2"
}], ["rect", {
	x: "14",
	y: "2",
	width: "8",
	height: "8",
	rx: "1",
	key: "88lufb"
}]]), BO = Z("brain", [
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
]), VO = Z("bug", [
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
]), HO = Z("cable", [
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
]), UO = Z("calendar-days", [
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 14h.01",
		key: "6423bh"
	}],
	["path", {
		d: "M12 14h.01",
		key: "1etili"
	}],
	["path", {
		d: "M16 14h.01",
		key: "1gbofw"
	}],
	["path", {
		d: "M8 18h.01",
		key: "lrp35t"
	}],
	["path", {
		d: "M12 18h.01",
		key: "mhygvu"
	}],
	["path", {
		d: "M16 18h.01",
		key: "kzsmim"
	}]
]), WO = Z("check", [["path", {
	d: "M20 6 9 17l-5-5",
	key: "1gmf2c"
}]]), GO = Z("chevron-down", [["path", {
	d: "m6 9 6 6 6-6",
	key: "qrunsl"
}]]), KO = Z("chevron-left", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]), qO = Z("chevron-right", [["path", {
	d: "m9 18 6-6-6-6",
	key: "mthhwq"
}]]), JO = Z("circle-dashed", [
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
]), YO = Z("circle-question-mark", [
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
]), XO = Z("circle-slash", [["circle", {
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
}]]), ZO = Z("clapperboard", [
	["path", {
		d: "m12.296 3.464 3.02 3.956",
		key: "qash78"
	}],
	["path", {
		d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z",
		key: "1h7j8b"
	}],
	["path", {
		d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
		key: "4lm6w1"
	}],
	["path", {
		d: "m6.18 5.276 3.1 3.899",
		key: "zjj9t3"
	}]
]), QO = Z("clock", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "M12 6v6l4 2",
	key: "mmk7yg"
}]]), $O = Z("cloud-fog", [
	["path", {
		d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
		key: "1pljnt"
	}],
	["path", {
		d: "M16 17H7",
		key: "pygtm1"
	}],
	["path", {
		d: "M17 21H9",
		key: "1u2q02"
	}]
]), ek = Z("cloud-lightning", [["path", {
	d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973",
	key: "1cez44"
}], ["path", {
	d: "m13 12-3 5h4l-3 5",
	key: "1t22er"
}]]), tk = Z("cloud-rain", [
	["path", {
		d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
		key: "1pljnt"
	}],
	["path", {
		d: "M16 14v6",
		key: "1j4efv"
	}],
	["path", {
		d: "M8 14v6",
		key: "17c4r9"
	}],
	["path", {
		d: "M12 16v6",
		key: "c8a4gj"
	}]
]), nk = Z("cloud-sun", [
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}],
	["path", {
		d: "M15.947 12.65a4 4 0 0 0-5.925-4.128",
		key: "dpwdj0"
	}],
	["path", {
		d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z",
		key: "s09mg5"
	}]
]), rk = Z("cloud", [["path", {
	d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z",
	key: "p7xjir"
}]]), ik = Z("code-xml", [
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
]), ak = Z("code", [["path", {
	d: "m16 18 6-6-6-6",
	key: "eg8j8"
}], ["path", {
	d: "m8 6-6 6 6 6",
	key: "ppft3o"
}]]), ok = Z("coins", [
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
]), sk = Z("copy-plus", [
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
]), ck = Z("copy", [["rect", {
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
}]]), lk = Z("crown", [["path", {
	d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
	key: "1vdc57"
}], ["path", {
	d: "M5 21h14",
	key: "11awu3"
}]]), uk = Z("database-zap", [
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
]), dk = Z("download", [
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
]), fk = Z("drama", [
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
]), pk = Z("eye-off", [
	["path", {
		d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
		key: "ct8e1f"
	}],
	["path", {
		d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
		key: "151rxh"
	}],
	["path", {
		d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
		key: "13bj9a"
	}],
	["path", {
		d: "m2 2 20 20",
		key: "1ooewy"
	}]
]), mk = Z("eye", [["path", {
	d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
	key: "1nclc0"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]), hk = Z("feather", [
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
]), gk = Z("file-down", [
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
]), _k = Z("file-headphone", [
	["path", {
		d: "M4 6.835V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-.343",
		key: "1vfytu"
	}],
	["path", {
		d: "M14 2v5a1 1 0 0 0 1 1h5",
		key: "wfsgrz"
	}],
	["path", {
		d: "M2 19a2 2 0 0 1 4 0v1a2 2 0 0 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 0 1-4 0v-1a2 2 0 0 1 4 0",
		key: "1etmh7"
	}]
]), vk = Z("file-plus", [
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
]), yk = Z("file-stack", [
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
]), bk = Z("gauge", [["path", {
	d: "m12 14 4-4",
	key: "9kzdfg"
}], ["path", {
	d: "M3.34 19a10 10 0 1 1 17.32 0",
	key: "19p75a"
}]]), xk = Z("git-branch", [
	["path", {
		d: "M15 6a9 9 0 0 0-9 9V3",
		key: "1cii5b"
	}],
	["circle", {
		cx: "18",
		cy: "6",
		r: "3",
		key: "1h7g24"
	}],
	["circle", {
		cx: "6",
		cy: "18",
		r: "3",
		key: "fqmcym"
	}]
]), Sk = Z("git-compare-arrows", [
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
]), Ck = Z("globe", [
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
]), wk = Z("grip-vertical", [
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
]), Tk = Z("hard-drive", [
	["path", {
		d: "M10 16h.01",
		key: "1bzywj"
	}],
	["path", {
		d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
		key: "18tbho"
	}],
	["path", {
		d: "M21.946 12.013H2.054",
		key: "zqlbp7"
	}],
	["path", {
		d: "M6 16h.01",
		key: "1pmjb7"
	}]
]), Ek = Z("image-off", [
	["line", {
		x1: "2",
		x2: "22",
		y1: "2",
		y2: "22",
		key: "a6p6uj"
	}],
	["path", {
		d: "M10.41 10.41a2 2 0 1 1-2.83-2.83",
		key: "1bzlo9"
	}],
	["line", {
		x1: "13.5",
		x2: "6",
		y1: "13.5",
		y2: "21",
		key: "1q0aeu"
	}],
	["line", {
		x1: "18",
		x2: "21",
		y1: "12",
		y2: "15",
		key: "5mozeu"
	}],
	["path", {
		d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59",
		key: "mmje98"
	}],
	["path", {
		d: "M21 15V5a2 2 0 0 0-2-2H9",
		key: "43el77"
	}]
]), Dk = Z("image-plus", [
	["path", {
		d: "M16 5h6",
		key: "1vod17"
	}],
	["path", {
		d: "M19 2v6",
		key: "4bpg5p"
	}],
	["path", {
		d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
		key: "1ue2ih"
	}],
	["path", {
		d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
		key: "1xmnt7"
	}],
	["circle", {
		cx: "9",
		cy: "9",
		r: "2",
		key: "af1f0g"
	}]
]), Ok = Z("images", [
	["path", {
		d: "m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16",
		key: "9kzy35"
	}],
	["path", {
		d: "M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2",
		key: "1t0f0t"
	}],
	["circle", {
		cx: "13",
		cy: "7",
		r: "1",
		fill: "currentColor",
		key: "1obus6"
	}],
	["rect", {
		x: "8",
		y: "2",
		width: "14",
		height: "14",
		rx: "2",
		key: "1gvhby"
	}]
]), kk = Z("info", [
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
]), Ak = Z("layers", [
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
]), jk = Z("layout-template", [
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
]), Mk = Z("link", [["path", {
	d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
	key: "1cjeqo"
}], ["path", {
	d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
	key: "19qd67"
}]]), Nk = Z("loader-circle", [["path", {
	d: "M21 12a9 9 0 1 1-6.219-8.56",
	key: "13zald"
}]]), Pk = Z("map-pin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]), Fk = Z("message-circle", [["path", {
	d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
	key: "1sd12s"
}]]), Ik = Z("message-square-dashed", [
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
]), Lk = Z("messages-square", [["path", {
	d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	key: "1n2ejm"
}], ["path", {
	d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
	key: "1qfcsi"
}]]), Rk = Z("moon", [["path", {
	d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
	key: "kfwtm"
}]]), zk = Z("network", [
	["rect", {
		x: "16",
		y: "16",
		width: "6",
		height: "6",
		rx: "1",
		key: "4q2zg0"
	}],
	["rect", {
		x: "2",
		y: "16",
		width: "6",
		height: "6",
		rx: "1",
		key: "8cvhb9"
	}],
	["rect", {
		x: "9",
		y: "2",
		width: "6",
		height: "6",
		rx: "1",
		key: "1egb70"
	}],
	["path", {
		d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",
		key: "1jsf9p"
	}],
	["path", {
		d: "M12 12V8",
		key: "2874zd"
	}]
]), Bk = Z("notebook-pen", [
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
]), Vk = Z("package", [
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
]), Hk = Z("palette", [
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
]), Uk = Z("pause", [["rect", {
	x: "14",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "kaeet6"
}], ["rect", {
	x: "5",
	y: "3",
	width: "5",
	height: "18",
	rx: "1",
	key: "1wsw3u"
}]]), Wk = Z("pen-line", [["path", {
	d: "M13 21h8",
	key: "1jsn5i"
}], ["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}]]), Gk = Z("pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]), Kk = Z("play", [["path", {
	d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
	key: "10ikf1"
}]]), qk = Z("plus", [["path", {
	d: "M5 12h14",
	key: "1ays0h"
}], ["path", {
	d: "M12 5v14",
	key: "s699le"
}]]), Jk = Z("puzzle", [["path", {
	d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
	key: "w46dr5"
}]]), Yk = Z("redo-2", [["path", {
	d: "m15 14 5-5-5-5",
	key: "12vg1m"
}], ["path", {
	d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
	key: "6uklza"
}]]), Xk = Z("refresh-cw", [
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
]), Zk = Z("regex", [
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
]), Qk = Z("rotate-ccw", [["path", {
	d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
	key: "1357e3"
}], ["path", {
	d: "M3 3v5h5",
	key: "1xhq8a"
}]]), $k = Z("save", [
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
]), eA = Z("scroll-text", [
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
]), tA = Z("search", [["path", {
	d: "m21 21-4.34-4.34",
	key: "14j7rj"
}], ["circle", {
	cx: "11",
	cy: "11",
	r: "8",
	key: "4ej97u"
}]]), nA = Z("server", [
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
]), rA = Z("shapes", [
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
]), iA = Z("sliders-horizontal", [
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
]), aA = Z("sliders-vertical", [
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
]), oA = Z("snowflake", [
	["path", {
		d: "m10 20-1.25-2.5L6 18",
		key: "18frcb"
	}],
	["path", {
		d: "M10 4 8.75 6.5 6 6",
		key: "7mghy3"
	}],
	["path", {
		d: "m14 20 1.25-2.5L18 18",
		key: "1chtki"
	}],
	["path", {
		d: "m14 4 1.25 2.5L18 6",
		key: "1b4wsy"
	}],
	["path", {
		d: "m17 21-3-6h-4",
		key: "15hhxa"
	}],
	["path", {
		d: "m17 3-3 6 1.5 3",
		key: "11697g"
	}],
	["path", {
		d: "M2 12h6.5L10 9",
		key: "kv9z4n"
	}],
	["path", {
		d: "m20 10-1.5 2 1.5 2",
		key: "1swlpi"
	}],
	["path", {
		d: "M22 12h-6.5L14 15",
		key: "1mxi28"
	}],
	["path", {
		d: "m4 10 1.5 2L4 14",
		key: "k9enpj"
	}],
	["path", {
		d: "m7 21 3-6-1.5-3",
		key: "j8hb9u"
	}],
	["path", {
		d: "m7 3 3 6h4",
		key: "1otusx"
	}]
]), sA = Z("sparkles", [
	["path", {
		d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
		key: "1s2grr"
	}],
	["path", {
		d: "M20 2v4",
		key: "1rf3ol"
	}],
	["path", {
		d: "M22 4h-4",
		key: "gwowj6"
	}],
	["circle", {
		cx: "4",
		cy: "20",
		r: "2",
		key: "6kqj1y"
	}]
]), cA = Z("split", [
	["path", {
		d: "M16 3h5v5",
		key: "1806ms"
	}],
	["path", {
		d: "M8 3H3v5",
		key: "15dfkv"
	}],
	["path", {
		d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3",
		key: "1qrqzj"
	}],
	["path", {
		d: "m15 9 6-6",
		key: "ko1vev"
	}]
]), lA = Z("square", [["rect", {
	width: "18",
	height: "18",
	x: "3",
	y: "3",
	rx: "2",
	key: "afitv7"
}]]), uA = Z("sun", [
	["circle", {
		cx: "12",
		cy: "12",
		r: "4",
		key: "4exip2"
	}],
	["path", {
		d: "M12 2v2",
		key: "tus03m"
	}],
	["path", {
		d: "M12 20v2",
		key: "1lh1kg"
	}],
	["path", {
		d: "m4.93 4.93 1.41 1.41",
		key: "149t6j"
	}],
	["path", {
		d: "m17.66 17.66 1.41 1.41",
		key: "ptbguv"
	}],
	["path", {
		d: "M2 12h2",
		key: "1t8f8n"
	}],
	["path", {
		d: "M20 12h2",
		key: "1q8mjw"
	}],
	["path", {
		d: "m6.34 17.66-1.41 1.41",
		key: "1m8zz5"
	}],
	["path", {
		d: "m19.07 4.93-1.41 1.41",
		key: "1shlcs"
	}]
]), dA = Z("text-cursor-input", [
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
]), fA = Z("trash-2", [
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
]), pA = Z("triangle-alert", [
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
]), mA = Z("undo-2", [["path", {
	d: "M9 14 4 9l5-5",
	key: "102s5s"
}], ["path", {
	d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
	key: "f3b9sd"
}]]), hA = Z("upload", [
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
]), gA = Z("user-pen", [
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
]), _A = Z("volume-2", [
	["path", {
		d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
		key: "uqj9uw"
	}],
	["path", {
		d: "M16 9a5 5 0 0 1 0 6",
		key: "1q6k2b"
	}],
	["path", {
		d: "M19.364 18.364a9 9 0 0 0 0-12.728",
		key: "ijwkga"
	}]
]), vA = Z("wand-sparkles", [
	["path", {
		d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
		key: "ul74o6"
	}],
	["path", {
		d: "m14 7 3 3",
		key: "1r5n42"
	}],
	["path", {
		d: "M5 6v4",
		key: "ilb8ba"
	}],
	["path", {
		d: "M19 14v4",
		key: "blhpug"
	}],
	["path", {
		d: "M10 2v2",
		key: "7u0qdc"
	}],
	["path", {
		d: "M7 8H3",
		key: "zfb6yr"
	}],
	["path", {
		d: "M21 16h-4",
		key: "1cnmox"
	}],
	["path", {
		d: "M11 3H9",
		key: "1obp7u"
	}]
]), yA = Z("wind", [
	["path", {
		d: "M12.8 19.6A2 2 0 1 0 14 16H2",
		key: "148xed"
	}],
	["path", {
		d: "M17.5 8a2.5 2.5 0 1 1 2 4H2",
		key: "1u4tom"
	}],
	["path", {
		d: "M9.8 4.4A2 2 0 1 1 11 8H2",
		key: "75valh"
	}]
]), bA = Z("workflow", [
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
]), xA = Z("x", [["path", {
	d: "M18 6 6 18",
	key: "1bl5f8"
}], ["path", {
	d: "m6 6 12 12",
	key: "d8bk6v"
}]]), SA = Z("zap", [["path", {
	d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
	key: "1xq2db"
}]]), CA = /* @__PURE__ */ F({
	__name: "Tip",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null), { open: r, bubble: i } = TD(n, () => t);
		return (t, a) => (R(), z("span", {
			ref_key: "anchor",
			ref: n,
			class: "tip",
			onMouseenter: a[0] ||= (e) => r.value = !0,
			onMouseleave: a[1] ||= (e) => r.value = !1,
			onFocusin: a[2] ||= (e) => r.value = !0,
			onFocusout: a[3] ||= (e) => r.value = !1
		}, [ri(t.$slots, "default"), M(r) && e.text ? (R(), z("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : W("", !0)], 544));
	}
}), wA = [
	"disabled",
	"aria-label",
	"aria-pressed"
], Q = /* @__PURE__ */ F({
	__name: "IconButton",
	props: {
		icon: {},
		label: {},
		active: { type: Boolean },
		pressed: { type: Boolean },
		danger: { type: Boolean },
		disabled: { type: Boolean },
		small: { type: Boolean },
		align: {},
		below: { type: Boolean }
	},
	emits: ["click"],
	setup(e) {
		return (t, n) => (R(), B(CA, {
			text: e.label,
			align: e.align,
			below: e.below
		}, {
			default: N(() => [V("button", {
				type: "button",
				class: k(["icon-btn", {
					active: e.active || e.pressed,
					danger: e.danger,
					sm: e.small
				}]),
				disabled: e.disabled,
				"aria-label": e.label,
				"aria-pressed": e.pressed === void 0 ? void 0 : e.pressed,
				onClick: n[0] ||= (e) => t.$emit("click", e)
			}, [(R(), B($r(e.icon)))], 10, wA)]),
			_: 1
		}, 8, [
			"text",
			"align",
			"below"
		]));
	}
}), TA = {
	key: 0,
	class: "patches"
}, EA = { class: "patch-old pre" }, DA = { class: "patch-new pre" }, OA = {
	key: 0,
	class: "patch-status xs"
}, kA = {
	key: 2,
	class: "faint small stage-empty"
}, AA = /* @__PURE__ */ F({
	__name: "StageBody",
	props: {
		stage: {},
		follow: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null);
		gr(() => t.stage.text, async () => {
			if (!t.follow) return;
			await Xn();
			let e = n.value;
			e && (e.scrollTop = e.scrollHeight);
		});
		let r = (e) => e !== void 0 && e !== "applied";
		return (t, i) => (R(), z("div", {
			class: "stage-body",
			style: Ie({ "--actor": e.stage.color })
		}, [e.stage.kind === "patch" && e.stage.patches?.length ? (R(), z("div", TA, [(R(!0), z(L, null, I(e.stage.patches, (e, t) => (R(), z("div", {
			key: t,
			class: k(["patch", { failed: r(e.status) }])
		}, [
			V("div", EA, A(e.old_string), 1),
			H(M(FO), { class: "patch-arrow" }),
			V("div", DA, A(e.new_string), 1),
			r(e.status) ? (R(), z("div", OA, [H(M(RO)), U(A(M(Y)(`patch.${e.status}`)), 1)])) : W("", !0)
		], 2))), 128))])) : e.stage.text ? (R(), z("div", {
			key: 1,
			ref_key: "box",
			ref: n,
			class: "stage-text pre scroll"
		}, A(e.stage.text), 513)) : (R(), z("div", kA, A(M(Y)(`stage.${e.stage.status}`)), 1))], 4));
	}
});
//#endregion
//#region src/ui/actions.ts
async function jA(t) {
	let n = e().chat[t], r = cm(n);
	if (!n || !r || r.draft === void 0 || r.patched === void 0) return;
	let i = !r.patchesApplied;
	n.mes = i ? r.patched : r.draft, Array.isArray(n.swipes) && (n.swipes[n.swipe_id ?? 0] = n.mes);
	let a = {
		...r,
		patchesApplied: i
	};
	r.annotationVersions && (a.annotations = i ? r.annotationVersions.patched : r.annotationVersions.draft), r.speechVersions && (a.speech = i ? r.speechVersions.patched : r.speechVersions.draft), um(t, a), e().updateMessageBlock(t, n), await e().saveChat(), await e().eventSource.emit(e().eventTypes.MESSAGE_EDITED, t), sS();
}
async function MA(t, n, r) {
	let i = e().chat[t], a = cm(i);
	return !i || !a ? !1 : (um(t, lm(a, n, r)), sS(), await e().saveChat(), !0);
}
//#endregion
//#region src/ui/message/Stages.vue?vue&type=script&setup=true&lang.ts
var NA = { class: "stage-bar" }, PA = ["onClick"], FA = { class: "ellipsis" }, IA = {
	key: 0,
	class: "chip stage-chip error"
}, LA = { class: "ellipsis" }, RA = { class: "badge warn" }, zA = {
	class: "icon-btn sm faint",
	tabindex: "0"
}, BA = /* @__PURE__ */ F({
	__name: "Stages",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = ZE(() => t.mesid), r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(!1), a = G(() => {
			let e = n.value;
			if (!e?.running) return null;
			let t = e.stages.find((e) => e.status === "streaming");
			return t ? t.id : [...e.stages].reverse().find((e) => e.status === "done")?.id ?? null;
		}), o = G(() => (n.value?.stages ?? []).filter((e) => e.kind !== "content" || e.status === "interrupted" || n.value?.running)), s = G(() => i.value || !n.value?.running ? r.value : o.value.find((e) => e.id === a.value && e.kind !== "content")?.id ?? null), c = G(() => o.value.find((e) => e.id === s.value) ?? null);
		gr(() => n.value?.running, (e, t) => {
			t && !e && (i.value = !1, r.value = K().ui.collapseStages ? null : r.value);
		});
		function l(e) {
			i.value = !0, r.value = s.value === e.id ? null : e.id;
		}
		let u = {
			text: Bk,
			content: hk,
			patch: Sk
		}, d = (e) => e.status === "streaming" ? Nk : e.status === "interrupted" ? XO : e.status === "missing" ? JO : u[e.kind], f = G(() => n.value?.sidecar?.diagnostics?.warnings ?? []), p = G(() => n.value?.sidecar?.draft === void 0 ? null : n.value.sidecar), m = G(() => {
			let e = n.value;
			if (!e) return "";
			let t = e.sidecar?.diagnostics, r = [`${Y(`transport.${e.transport}`)} · ${e.workflow}`];
			return t && r.push(Y("stages.requests", { n: t.requests }) + (t.durationMs ? ` · ${(t.durationMs / 1e3).toFixed(1)}s` : "")), r.join("\n");
		});
		return (t, r) => M(n) && (o.value.length || M(n).error) ? (R(), z("div", {
			key: 0,
			class: k(["stages", { live: M(n).running }])
		}, [V("div", NA, [
			(R(!0), z(L, null, I(o.value, (e) => (R(), z("button", {
				key: e.id,
				type: "button",
				class: k(["chip stage-chip", [e.status, { open: s.value === e.id }]]),
				style: Ie({ "--actor": e.color }),
				onClick: (t) => l(e)
			}, [(R(), B($r(d(e)), { class: k({ spin: e.status === "streaming" }) }, null, 8, ["class"])), V("span", FA, A(e.label), 1)], 14, PA))), 128)),
			M(n).error ? (R(), z("span", IA, [H(M(pA)), V("span", LA, A(M(n).error), 1)])) : W("", !0),
			r[1] ||= V("span", { class: "grow" }, null, -1),
			f.value.length ? (R(), B(CA, {
				key: 1,
				text: f.value.join("\n"),
				align: "end"
			}, {
				default: N(() => [V("span", RA, [H(M(pA)), U(A(f.value.length), 1)])]),
				_: 1
			}, 8, ["text"])) : W("", !0),
			p.value ? (R(), B(Q, {
				key: 2,
				small: "",
				align: "end",
				icon: p.value.patchesApplied ? M(mA) : M(Yk),
				label: p.value.patchesApplied ? M(Y)("stages.revertDraft") : M(Y)("stages.reapplyPatches"),
				onClick: r[0] ||= (t) => M(jA)(e.mesid)
			}, null, 8, ["icon", "label"])) : W("", !0),
			M(n).running ? W("", !0) : (R(), B(CA, {
				key: 3,
				text: m.value,
				align: "end"
			}, {
				default: N(() => [V("span", zA, [H(M(kk))])]),
				_: 1
			}, 8, ["text"]))
		]), c.value ? (R(), B(AA, {
			key: c.value.id,
			stage: c.value,
			follow: M(n).running && !i.value
		}, null, 8, ["stage", "follow"])) : W("", !0)], 2)) : W("", !0);
	}
}), VA = {
	status: {
		position: "top",
		order: 100
	},
	reply: {
		position: "bottom",
		order: 100
	},
	impersonate: {
		position: "bottom",
		order: 200
	},
	options: {
		position: "bottom",
		order: 300
	},
	synopsis: {
		position: "bottom",
		order: 400
	},
	memory: {
		position: "bottom",
		order: 500
	},
	recap: {
		position: "bottom",
		order: 600
	},
	custom: {
		position: "bottom",
		order: 700
	},
	storyline: null,
	annotations: null,
	image: {
		position: "bottom",
		order: 50
	},
	speech: null
};
function HA(e) {
	let t = VA[e.kind];
	return t ? {
		position: e.ui?.position ?? t.position,
		order: e.ui?.order ?? t.order
	} : null;
}
function UA(e, t) {
	return e.flatMap((e, n) => {
		let r = HA(e);
		return r && r.position === t ? [{
			decl: e,
			...r,
			index: n
		}] : [];
	}).sort((e, t) => e.order - t.order || e.index - t.index);
}
//#endregion
//#region src/ui/message/cards/ReplyCard.vue?vue&type=script&setup=true&lang.ts
var WA = { class: "reply-name xs" }, GA = ["innerHTML"], KA = /* @__PURE__ */ F({
	__name: "ReplyCard",
	props: {
		text: {},
		name: {},
		color: {}
	},
	setup(e) {
		let t = e, n = G(() => JE(t.text));
		return (t, r) => (R(), z("div", {
			class: "reply-card",
			style: Ie({ "--actor": e.color })
		}, [V("div", WA, A(e.name), 1), V("div", {
			class: "rich",
			innerHTML: n.value
		}, null, 8, GA)], 4));
	}
}), qA = { class: "card mini-card" }, JA = { class: "card-head" }, YA = { class: "card-title" }, XA = { class: "card-body pre" }, ZA = /* @__PURE__ */ F({
	__name: "ImpersonateCard",
	props: {
		text: {},
		mesid: {}
	},
	setup(e) {
		return (t, n) => (R(), z("div", qA, [V("header", JA, [
			H(M(gA), { class: "section-icon" }),
			V("span", YA, A(M(Y)("cards.impersonate")), 1),
			V("button", {
				type: "button",
				class: "btn primary sm-btn",
				onClick: n[0] ||= (t) => M(nT)(e.text, !1, e.mesid)
			}, [H(M(dA)), U(A(M(Y)("cards.fillInput")), 1)])
		]), V("div", XA, A(e.text), 1)]));
	}
}), QA = ["aria-label"], $A = ["title", "onClick"], ej = { class: "option-label" }, tj = { class: "option-content small muted" }, nj = /* @__PURE__ */ F({
	__name: "OptionsCard",
	props: {
		options: {},
		mesid: {}
	},
	setup(e) {
		let t = e, n = (e, n) => nT(e.content, n.ctrlKey || n.metaKey || n.shiftKey || n.altKey, t.mesid);
		return (t, r) => (R(), z("div", {
			class: "options-grid",
			role: "list",
			"aria-label": M(Y)("cards.options")
		}, [(R(!0), z(L, null, I(e.options, (e, t) => (R(), z("button", {
			key: t,
			type: "button",
			role: "listitem",
			class: "option",
			title: M(Y)("cards.optionHint"),
			onClick: (t) => n(e, t)
		}, [V("span", ej, A(e.label), 1), V("span", tj, A(e.content), 1)], 8, $A))), 128))], 8, QA));
	}
}), rj = {
	key: 0,
	class: "memory-ops"
}, ij = { class: "ellipsis" }, aj = ["aria-label", "onClick"], oj = /* @__PURE__ */ F({
	__name: "MemoryCard",
	props: {
		events: {},
		preset: {}
	},
	setup(e) {
		let t = e, n = G(() => {
			let e = Nm(t.preset), n = e.globalMemory.log;
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
					let r = hm(t), i = r ? gm(e, r) : -1, a = n[i];
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
			e.id !== void 0 && km(Nm(t.preset), e.id);
		}
		return (e, t) => n.value.length ? (R(), z("div", rj, [(R(!0), z(L, null, I(n.value, (e, t) => (R(), B(CA, {
			key: t,
			text: e.op === "delete" ? M(Y)("memory.deleted") : e.content,
			align: "start"
		}, {
			default: N(() => [V("span", { class: k(["chip memory-chip", [e.op, { undone: e.undone }]]) }, [
				(R(), B($r(e.scope === "global" ? M(Ck) : M(Fk)), { class: "faint" })),
				V("span", ij, A(e.key), 1),
				(R(), B($r(e.op === "delete" ? M(fA) : M(Gk)), { class: "op-icon" })),
				e.scope === "global" && !e.undone ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "icon-btn sm",
					"aria-label": M(Y)("common.undo"),
					onClick: (t) => r(e)
				}, [H(M(mA))], 8, aj)) : W("", !0)
			], 2)]),
			_: 2
		}, 1032, ["text"]))), 128))])) : W("", !0);
	}
}), sj = ["aria-label"], cj = /* @__PURE__ */ F({
	__name: "Help",
	props: {
		text: {},
		align: {},
		below: { type: Boolean }
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(null), { open: r, bubble: i } = TD(n, () => t);
		return (t, a) => e.text ? (R(), z("span", {
			key: 0,
			ref_key: "anchor",
			ref: n,
			class: "tip help",
			onMouseenter: a[2] ||= (e) => r.value = !0,
			onMouseleave: a[3] ||= (e) => r.value = !1
		}, [V("button", {
			type: "button",
			class: "icon-btn sm",
			"aria-label": e.text,
			onClick: a[0] ||= hs((e) => r.value = !M(r), ["stop"]),
			onBlur: a[1] ||= (e) => r.value = !1
		}, [H(M(YO))], 40, sj), M(r) ? (R(), z("span", {
			key: 0,
			ref_key: "bubble",
			ref: i,
			class: "tip-bubble",
			popover: "manual",
			role: "tooltip"
		}, A(e.text), 513)) : W("", !0)], 544)) : W("", !0);
	}
}), lj = { class: "card-title" }, uj = {
	key: 0,
	class: "card-body"
}, dj = /* @__PURE__ */ F({
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
		let t = /* @__PURE__ */ j(e.open ?? !0);
		return (n, r) => (R(), z("section", { class: k(["card section", [e.tone, { closed: e.collapsible && !t.value }]]) }, [V("header", {
			class: k(["card-head", { clickable: e.collapsible }]),
			onClick: r[1] ||= (n) => e.collapsible && (t.value = !t.value)
		}, [
			e.icon ? (R(), B($r(e.icon), {
				key: 0,
				class: "section-icon"
			})) : W("", !0),
			V("span", lj, A(e.title), 1),
			H(cj, {
				text: e.help,
				align: "end"
			}, null, 8, ["text"]),
			V("span", {
				class: "row",
				onClick: r[0] ||= hs(() => {}, ["stop"])
			}, [ri(n.$slots, "actions")]),
			e.collapsible ? (R(), B(M(GO), {
				key: 1,
				class: k(["chevron", { flipped: t.value }])
			}, null, 8, ["class"])) : W("", !0)
		], 2), !e.collapsible || t.value ? (R(), z("div", uj, [ri(n.$slots, "default")])) : W("", !0)], 2));
	}
}), fj = {
	key: 0,
	class: "badge neutral"
}, pj = { class: "pre small" }, mj = /* @__PURE__ */ F({
	__name: "RecapCard",
	props: {
		text: {},
		coversUpTo: {}
	},
	setup(e) {
		return (t, n) => (R(), B(dj, {
			title: M(Y)("cards.recap"),
			icon: M(eA),
			collapsible: "",
			open: !1
		}, {
			actions: N(() => [e.coversUpTo === void 0 ? W("", !0) : (R(), z("span", fj, "#0–" + A(e.coversUpTo), 1))]),
			default: N(() => [V("div", pj, A(e.text), 1)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), hj = { class: "synopsis-fields" }, gj = { class: "synopsis-field" }, _j = ["placeholder", "aria-label"], vj = { class: "synopsis-field" }, yj = ["placeholder", "aria-label"], bj = ["placeholder", "aria-label"], xj = ["placeholder", "aria-label"], Sj = { class: "synopsis-actions" }, Cj = { class: "xs faint grow synopsis-keys" }, wj = {
	type: "submit",
	class: "btn primary sm-btn"
}, Tj = { class: "synopsis-head" }, Ej = { class: "synopsis-line small" }, Dj = {
	key: 0,
	class: "row tight"
}, Oj = {
	key: 1,
	class: "row tight"
}, kj = { class: "synopsis-event ellipsis" }, Aj = {
	key: 0,
	class: "small muted pre synopsis-summary"
}, jj = /* @__PURE__ */ F({
	__name: "SynopsisCard",
	props: {
		synopsis: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(!1), o = /* @__PURE__ */ fn({
			time: "",
			location: "",
			event: "",
			summary: ""
		}), s = /* @__PURE__ */ j(), c = /* @__PURE__ */ j(), l = [
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
			a.value = !0, await Xn(), f(), s.value?.focus();
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
		return (t, n) => a.value ? (R(), z("form", {
			key: 0,
			class: "synopsis-editor",
			onSubmit: hs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[4] ||= hs(() => {}, ["stop"]),
			onTouchstartPassive: n[5] ||= hs(() => {}, ["stop"]),
			onTouchmovePassive: n[6] ||= hs(() => {}, ["stop"]),
			onTouchendPassive: n[7] ||= hs(() => {}, ["stop"])
		}, [
			V("div", hj, [V("label", gj, [H(M(QO), { class: "faint" }), P(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.time = e,
				class: "input",
				placeholder: M(Y)("cards.synopsis.time"),
				"aria-label": M(Y)("cards.synopsis.time")
			}, null, 8, _j), [[as, o.time]])]), V("label", vj, [H(M(Pk), { class: "faint" }), P(V("input", {
				"onUpdate:modelValue": n[1] ||= (e) => o.location = e,
				class: "input",
				placeholder: M(Y)("cards.synopsis.location"),
				"aria-label": M(Y)("cards.synopsis.location")
			}, null, 8, yj), [[as, o.location]])])]),
			P(V("input", {
				ref_key: "eventInput",
				ref: s,
				"onUpdate:modelValue": n[2] ||= (e) => o.event = e,
				class: "input synopsis-event-input",
				placeholder: M(Y)("cards.synopsis.event"),
				"aria-label": M(Y)("cards.synopsis.event")
			}, null, 8, bj), [[as, o.event]]),
			P(V("textarea", {
				ref_key: "summaryInput",
				ref: c,
				"onUpdate:modelValue": n[3] ||= (e) => o.summary = e,
				class: "input",
				rows: "2",
				placeholder: M(Y)("cards.synopsis.summary"),
				"aria-label": M(Y)("cards.synopsis.summary"),
				onInput: f
			}, null, 40, xj), [[as, o.summary]]),
			V("div", Sj, [
				V("span", Cj, A(M(Y)("cards.synopsis.keys")), 1),
				V("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: m
				}, A(M(Y)("common.cancel")), 1),
				V("button", wj, [H(M(WO)), U(A(M(Y)("common.save")), 1)])
			])
		], 32)) : (R(), z("div", {
			key: 1,
			class: k(["synopsis", { open: i.value }]),
			onClick: n[9] ||= (e) => i.value = !i.value
		}, [V("div", Tj, [V("div", Ej, [
			e.synopsis.time ? (R(), z("span", Dj, [H(M(QO), { class: "faint" }), U(A(e.synopsis.time), 1)])) : W("", !0),
			e.synopsis.location ? (R(), z("span", Oj, [H(M(Pk), { class: "faint" }), U(A(e.synopsis.location), 1)])) : W("", !0),
			V("span", kj, A(e.synopsis.event), 1)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[8] ||= hs(() => {}, ["stop"])
		}, [H(Q, {
			icon: M(Gk),
			label: M(Y)("cards.synopsis.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : W("", !0)]), i.value && e.synopsis.summary ? (R(), z("div", Aj, A(e.synopsis.summary), 1)) : W("", !0)], 2));
	}
}), Mj = { class: "status-fields" }, Nj = [
	"onUpdate:modelValue",
	"placeholder",
	"aria-label"
], Pj = { class: "synopsis-actions" }, Fj = { class: "xs faint grow synopsis-keys" }, Ij = {
	type: "submit",
	class: "btn primary sm-btn"
}, Lj = {
	key: 1,
	class: "status-bar small",
	role: "status"
}, Rj = { class: "status-line" }, zj = {
	key: 0,
	class: "row tight"
}, Bj = {
	key: 1,
	class: "row tight"
}, Vj = {
	key: 2,
	class: "row tight status-location"
}, Hj = { class: "ellipsis" }, Uj = {
	key: 3,
	class: "row tight"
}, Wj = /* @__PURE__ */ F({
	__name: "StatusCard",
	props: {
		status: {},
		editable: { type: Boolean }
	},
	emits: ["save"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ fn({
			date: "",
			weekday: "",
			time: "",
			location: "",
			weather: ""
		}), o = /* @__PURE__ */ j(), s = (e) => (n.status[e] ?? "").trim(), c = G(() => [s("date"), s("weekday")].filter(Boolean).join(" ")), l = [
			[/雷|thunder|storm|lightning/i, ek],
			[/雪|snow|sleet|blizzard/i, oA],
			[/雨|rain|drizzle|shower/i, tk],
			[/雾|霾|fog|mist|haze|smog/i, $O],
			[/风|wind|gale|breez/i, yA],
			[/阴|云|cloud|overcast/i, rk],
			[/夜|月|night|moon/i, Rk],
			[/晴|sun|clear|fair/i, uA]
		], u = G(() => l.find(([e]) => e.test(s("weather")))?.[1] ?? nk), d = () => Object.fromEntries(Lc.map((e) => [e, a[e].trim()])), f = G(() => Lc.some((e) => d()[e] !== s(e)));
		async function p() {
			for (let e of Lc) a[e] = n.status[e] ?? "";
			i.value = !0, await Xn(), o.value?.querySelector("input")?.focus();
		}
		function m() {
			i.value = !1;
		}
		function h() {
			f.value && r("save", d()), i.value = !1;
		}
		function g(e) {
			e.stopPropagation(), !e.isComposing && (e.key === "Escape" ? (e.preventDefault(), m()) : e.key === "Enter" && (e.preventDefault(), h()));
		}
		let _ = {
			date: UO,
			weekday: UO,
			time: QO,
			location: Pk,
			weather: nk
		};
		return (t, n) => i.value ? (R(), z("form", {
			key: 0,
			ref_key: "form",
			ref: o,
			class: "status-editor",
			onSubmit: hs(h, ["prevent"]),
			onKeydown: g,
			onClick: n[0] ||= hs(() => {}, ["stop"]),
			onTouchstartPassive: n[1] ||= hs(() => {}, ["stop"]),
			onTouchmovePassive: n[2] ||= hs(() => {}, ["stop"]),
			onTouchendPassive: n[3] ||= hs(() => {}, ["stop"])
		}, [V("div", Mj, [(R(!0), z(L, null, I(M(Lc), (e) => (R(), z("label", {
			key: e,
			class: "synopsis-field"
		}, [(R(), B($r(_[e]), { class: "faint" })), P(V("input", {
			"onUpdate:modelValue": (t) => a[e] = t,
			class: "input",
			placeholder: M(Y)(`cards.status.${e}`),
			"aria-label": M(Y)(`cards.status.${e}`)
		}, null, 8, Nj), [[as, a[e]]])]))), 128))]), V("div", Pj, [
			V("span", Fj, A(M(Y)("cards.status.keys")), 1),
			V("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: m
			}, A(M(Y)("common.cancel")), 1),
			V("button", Ij, [H(M(WO)), U(A(M(Y)("common.save")), 1)])
		])], 544)) : (R(), z("div", Lj, [V("div", Rj, [
			c.value ? (R(), z("span", zj, [H(M(UO), { class: "faint" }), U(A(c.value), 1)])) : W("", !0),
			s("time") ? (R(), z("span", Bj, [H(M(QO), { class: "faint" }), U(A(s("time")), 1)])) : W("", !0),
			s("location") ? (R(), z("span", Vj, [H(M(Pk), { class: "faint" }), V("span", Hj, A(s("location")), 1)])) : W("", !0),
			s("weather") ? (R(), z("span", Uj, [(R(), B($r(u.value), { class: "faint" })), U(A(s("weather")), 1)])) : W("", !0)
		]), e.editable ? (R(), z("span", {
			key: 0,
			class: "synopsis-edit",
			onClick: n[4] ||= hs(() => {}, ["stop"])
		}, [H(Q, {
			icon: M(Gk),
			label: M(Y)("cards.status.edit"),
			small: "",
			align: "end",
			onClick: p
		}, null, 8, ["icon", "label"])])) : W("", !0)]));
	}
}), Gj = ["innerHTML"], Kj = {
	key: 1,
	class: "kv-list small"
}, qj = { class: "pre" }, Jj = /* @__PURE__ */ F({
	__name: "CustomCard",
	props: {
		title: {},
		value: {}
	},
	setup(e) {
		let t = e, n = G(() => typeof t.value == "string" ? JE(t.value) : "");
		return (t, r) => (R(), B(dj, {
			title: e.title,
			icon: M(rA),
			collapsible: "",
			open: !1
		}, {
			default: N(() => [typeof e.value == "string" ? (R(), z("div", {
				key: 0,
				class: "rich small",
				innerHTML: n.value
			}, null, 8, Gj)) : (R(), z("dl", Kj, [(R(!0), z(L, null, I(e.value, (e, t) => (R(), z(L, { key: t }, [V("dt", null, A(t), 1), V("dd", qj, A(e), 1)], 64))), 128))]))]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), Yj = /* @__PURE__ */ new Map();
function Xj(e) {
	let t = Yj.get(e);
	if (!t) {
		let n = URL.createObjectURL(new Blob([e], { type: "text/javascript" }));
		t = import(
			/* @vite-ignore */
			n
).finally(() => URL.revokeObjectURL(n)), t.catch(() => Yj.delete(e)), Yj.set(e, t);
	}
	return t;
}
function Zj(e) {
	let t = e.default;
	if (typeof e.mount == "function") return e.mount;
	if (typeof t == "function") return t;
	if (t && typeof t == "object" && typeof t.mount == "function") return t.mount.bind(t);
}
function Qj(e) {
	if (!e) return null;
	let t = document.createElement("style");
	return t.textContent = e, t;
}
var $j = (e) => ({
	value: e.value,
	structure: e.structure,
	structures: e.structures,
	message: e.message,
	preset: e.preset,
	lang: e.lang
});
async function eM(e, t, n) {
	let r = n;
	if (e.mode === "template") {
		let n = () => {
			let n = Jl(e.code, $j(r));
			t.replaceChildren(...[Qj(e.style)].filter((e) => !!e));
			let i = document.createElement("div");
			i.className = "ap-component", i.innerHTML = n, t.append(i);
		}, i = (e) => {
			let t = e.target?.closest?.("[data-ap-fill]");
			if (!t) return;
			let n = e;
			r.fillInput(t.getAttribute("data-ap-fill") ?? "", n.ctrlKey || n.metaKey || n.shiftKey || n.altKey);
		};
		return t.addEventListener("click", i), n(), {
			update: async (e) => {
				r = e, n();
			},
			unmount: () => {
				t.removeEventListener("click", i), t.replaceChildren();
			}
		};
	}
	let i = Zj(await Xj(e.code));
	if (!i) throw Error("the module exports no mount(root, context)");
	let a, o = async () => {
		t.replaceChildren(...[Qj(e.style)].filter((e) => !!e)), a = await i(t, r);
	}, s = () => {
		try {
			typeof a == "function" ? a() : a?.unmount?.();
		} finally {
			a = void 0;
		}
	};
	return await o(), {
		update: async (e) => {
			if (r = e, a && typeof a == "object" && typeof a.update == "function") return void a.update(r);
			s(), await o();
		},
		unmount: () => {
			s(), t.replaceChildren();
		}
	};
}
//#endregion
//#region src/ui/message/cards/ComponentCard.vue?vue&type=script&setup=true&lang.ts
var tM = { class: "structure-component" }, nM = ["data-structure"], rM = {
	key: 0,
	class: "xs"
}, iM = /* @__PURE__ */ F({
	__name: "ComponentCard",
	props: {
		component: {},
		context: {}
	},
	setup(e) {
		let t = e, n = /* @__PURE__ */ j(), r = /* @__PURE__ */ j(""), i = null, a = Promise.resolve(), o = !0, s = (e) => {
			a = a.then(async () => {
				if (o) try {
					await e(), r.value = "";
				} catch (e) {
					r.value = e instanceof Error ? e.message : String(e), console.error("[Advanced Preset] structure component", t.component.id, e);
				}
			});
		};
		return Jr(() => {
			let e = n.value;
			if (!e) return;
			let r = e.shadowRoot ?? e.attachShadow({ mode: "open" });
			s(async () => {
				i = await eM(t.component, r, t.context);
			});
		}), gr(() => t.context, (e) => s(async () => {
			await i?.update(e);
		})), gr(() => t.component, (e) => s(async () => {
			i?.unmount(), i = null;
			let r = n.value?.shadowRoot;
			r && (i = await eM(e, r, t.context));
		})), Xr(() => {
			o = !1;
			try {
				i?.unmount();
			} catch (e) {
				console.error("[Advanced Preset] structure component", t.component.id, e);
			}
			i = null;
		}), (t, i) => (R(), z("div", tM, [V("div", {
			ref_key: "host",
			ref: n,
			class: "structure-component-host",
			"data-structure": e.component.id
		}, null, 8, nM), r.value ? (R(), z("div", rM, A(M(Y)("cards.custom.error", { error: r.value })), 1)) : W("", !0)]));
	}
}), aM = { class: "speech-card" }, oM = ["aria-label"], sM = [
	"aria-label",
	"title",
	"onClick"
], cM = {
	key: 0,
	class: "speech-who xs muted ellipsis"
}, lM = /* @__PURE__ */ F({
	__name: "SpeechCard",
	props: {
		mesid: {},
		segments: {}
	},
	setup(e) {
		let t = e, n = G(() => aw.playing?.mesId === t.mesid && aw.playing.all ? aw.playing : null), r = G(() => aw.playing?.mesId === t.mesid ? aw.playing.segId : null), i = G(() => t.segments.map((e) => gw(e))), a = G(() => i.value.every((e) => e === "ready")), o = G(() => !!aw.generating[t.mesid]), s = G(() => t.segments.find((e) => e.id === r.value)), c = G(() => s.value ? s.value.character || Y("media.speech.narration") : "");
		gr(() => t.segments.map((e) => e.id + e.text).join("\n"), () => {
			_w(t.segments);
		}, { immediate: !0 });
		function l() {
			n.value ? xw() : ww(t.mesid);
		}
		async function u() {
			let e = await Ow(t.mesid);
			e && Rw(e, `speech-${t.mesid}.wav`);
		}
		return (t, s) => (R(), z("div", aM, [
			H(Q, {
				icon: n.value && !M(aw).paused ? M(Uk) : M(Kk),
				label: n.value && !M(aw).paused ? M(Y)("media.speech.pause") : M(Y)("media.speech.play"),
				active: !!n.value,
				onClick: l
			}, null, 8, [
				"icon",
				"label",
				"active"
			]),
			V("div", {
				class: "speech-track",
				role: "group",
				"aria-label": M(Y)("media.speech.lines")
			}, [(R(!0), z(L, null, I(e.segments, (t, n) => (R(), z("button", {
				key: t.id,
				type: "button",
				class: k(["speech-seg", [
					i.value[n],
					t.kind,
					{ on: t.id === r.value }
				]]),
				style: Ie({ flexGrow: Math.max(4, Math.min(t.display.length, 160)) }),
				"aria-label": `${t.character || M(Y)("media.speech.narration")}: ${t.display}`,
				title: `${t.character || M(Y)("media.speech.narration")}: ${t.display}`,
				onClick: (n) => M(ww)(e.mesid, t.id)
			}, null, 14, sM))), 128))], 8, oM),
			c.value ? (R(), z("span", cM, A(c.value), 1)) : W("", !0),
			M(aw).playing?.mesId === e.mesid ? (R(), B(Q, {
				key: 1,
				icon: M(lA),
				label: M(Y)("media.speech.stop"),
				small: "",
				onClick: s[0] ||= (e) => M(bw)()
			}, null, 8, ["icon", "label"])) : a.value ? (R(), B(Q, {
				key: 3,
				icon: M(dk),
				label: M(Y)("media.speech.download"),
				small: "",
				align: "end",
				onClick: u
			}, null, 8, ["icon", "label"])) : (R(), B(Q, {
				key: 2,
				icon: o.value ? M(Nk) : M(sA),
				class: k({ spin: o.value }),
				label: M(Y)("media.speech.generateAll"),
				disabled: o.value,
				small: "",
				onClick: s[1] ||= (t) => M(Dw)(e.mesid)
			}, null, 8, [
				"icon",
				"class",
				"label",
				"disabled"
			]))
		]));
	}
}), uM = ["src", "alt"], dM = {
	key: 1,
	class: "blob-placeholder",
	"aria-hidden": "true"
}, fM = /* @__PURE__ */ F({
	__name: "BlobImage",
	props: {
		blobKey: {},
		alt: {}
	},
	emits: ["missing"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j();
		return gr(() => n.blobKey, async (e) => {
			i.value = void 0;
			let t = await gx(e).catch(() => void 0);
			e === n.blobKey && (i.value = t, t || r("missing"));
		}, { immediate: !0 }), (t, n) => i.value ? (R(), z("img", {
			key: 0,
			src: i.value,
			alt: e.alt ?? "",
			draggable: "false"
		}, null, 8, uM)) : (R(), z("span", dM));
	}
}), pM = ["aria-label"], mM = { class: "image-viewer-bar" }, hM = { class: "small" }, gM = {
	key: 1,
	class: "small grow ellipsis image-viewer-caption"
}, _M = /* @__PURE__ */ F({
	__name: "ImageViewer",
	props: {
		keys: {},
		start: {},
		caption: {}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(), a = /* @__PURE__ */ j(n.start), o = (e) => {
			let t = n.keys.length;
			a.value = (a.value + e + t) % t;
		};
		Jr(() => i.value?.showModal());
		function s(e) {
			e.stopPropagation(), e.key === "ArrowLeft" ? o(-1) : e.key === "ArrowRight" && o(1);
		}
		let c = null, l = (e) => {
			let t = e.changedTouches[0]?.clientX;
			c !== null && t !== void 0 && Math.abs(t - c) > 40 && n.keys.length > 1 && o(t < c ? 1 : -1), c = null;
		};
		return (t, n) => (R(), z("dialog", {
			ref_key: "dialog",
			ref: i,
			class: "image-viewer",
			"aria-label": e.caption,
			onClose: n[3] ||= (e) => r("close"),
			onClick: n[4] ||= hs((e) => i.value?.close(), ["self"]),
			onKeydown: s,
			onTouchstartPassive: n[5] ||= (e) => /* @__PURE__ */ wn(c) ? c.value = e.touches[0]?.clientX ?? null : c = e.touches[0]?.clientX ?? null,
			onTouchend: l
		}, [H(fM, {
			"blob-key": e.keys[a.value],
			alt: e.caption,
			class: "image-viewer-img"
		}, null, 8, ["blob-key", "alt"]), V("div", mM, [
			e.keys.length > 1 ? (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: M(KO),
					label: M(Y)("media.image.previous"),
					onClick: n[0] ||= (e) => o(-1)
				}, null, 8, ["icon", "label"]),
				V("span", hM, A(a.value + 1) + " / " + A(e.keys.length), 1),
				H(Q, {
					icon: M(qO),
					label: M(Y)("media.image.next"),
					onClick: n[1] ||= (e) => o(1)
				}, null, 8, ["icon", "label"])
			], 64)) : W("", !0),
			e.caption ? (R(), z("span", gM, A(e.caption), 1)) : W("", !0),
			H(Q, {
				icon: M(xA),
				label: M(Y)("common.close"),
				align: "end",
				onClick: n[2] ||= (e) => i.value?.close()
			}, null, 8, ["icon", "label"])
		])], 40, pM));
	}
}), vM = { class: "image-figure" }, yM = ["aria-label"], bM = {
	key: 1,
	class: "image-empty"
}, xM = {
	key: 1,
	class: "xs faint"
}, SM = {
	key: 2,
	class: "image-prompt small muted"
}, CM = {
	key: 2,
	class: "image-busy",
	role: "status"
}, wM = { class: "small" }, TM = {
	key: 3,
	class: "image-pager"
}, EM = { class: "xs" }, DM = ["aria-label"], OM = { class: "row end tight" }, kM = {
	type: "submit",
	class: "btn sm-btn"
}, AM = {
	key: 1,
	class: "image-foot"
}, jM = ["title"], MM = {
	key: 1,
	class: "xs muted grow ellipsis"
}, NM = { class: "row tight image-tools" }, PM = /* @__PURE__ */ F({
	__name: "ImageFigure",
	props: {
		mesid: {},
		genId: {},
		structure: {},
		index: {},
		prompt: {},
		record: {},
		editable: { type: Boolean }
	},
	setup(e) {
		let t = e, n = G(() => t.record?.keys ?? []), r = /* @__PURE__ */ fn(/* @__PURE__ */ new Set());
		gr(n, async (e) => {
			for (let t of e) !r.has(t) && !await dx(t).catch(() => !0) && r.add(t);
		}, { immediate: !0 });
		let i = G(() => n.value.filter((e) => !r.has(e))), a = G(() => {
			let e = n.value[t.record?.shown ?? -1], r = e ? i.value.indexOf(e) : -1;
			return r >= 0 ? r : i.value.length - 1;
		}), o = G(() => i.value[a.value]), s = G(() => !i.value.length && n.value.length > 0), c = G(() => t.record?.prompt ?? t.prompt.prompt), l = G(() => hS.get(gS(t.genId, t.structure, t.index))), u = G(() => l.value?.status === "running"), d = G(() => l.value?.status === "error" ? QS(l.value.error) : ""), f = G(() => (t.prompt.ratio ?? "3:4").replace(":", " / ")), p = () => DS(t.mesid, t.structure, t.index), m = () => OS(t.genId, t.structure, t.index), h = (e) => {
			let r = i.value.length;
			r > 1 && AS(t.mesid, t.structure, t.index, n.value.indexOf(i.value[(a.value + e + r) % r]));
		}, g = () => {
			o.value && jS(t.mesid, t.structure, t.index, o.value);
		};
		async function _() {
			let e = o.value, n = e ? await ux(e) : void 0;
			if (!n) return;
			let r = (n.type.split("/")[1] ?? "png").replace("jpeg", "jpg").replace("svg+xml", "svg");
			Bw(`image-${t.mesid}-${t.index + 1}-${a.value + 1}.${r}`, n);
		}
		let v = /* @__PURE__ */ j(!1), y = /* @__PURE__ */ j(""), b = /* @__PURE__ */ j();
		async function x() {
			y.value = c.value, v.value = !0, await Xn(), b.value?.focus();
		}
		async function S(e) {
			v.value = !1, y.value.trim() !== c.value.trim() && await kS(t.mesid, t.structure, t.index, y.value.trim()), e && p();
		}
		function ee(e) {
			e.stopPropagation(), !e.isComposing && (e.key === "Escape" ? (e.preventDefault(), v.value = !1) : e.key === "Enter" && (e.ctrlKey || e.metaKey) && (e.preventDefault(), S(!0)));
		}
		let C = /* @__PURE__ */ j(!1);
		return (t, n) => (R(), z("figure", vM, [
			V("div", {
				class: k(["image-frame", { empty: !o.value }]),
				style: Ie(o.value ? void 0 : { aspectRatio: f.value })
			}, [
				o.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "image-open",
					"aria-label": M(Y)("media.image.view"),
					onClick: n[1] ||= (e) => C.value = !0
				}, [H(fM, {
					"blob-key": o.value,
					alt: e.prompt.caption ?? c.value,
					onMissing: n[0] ||= (e) => r.add(o.value)
				}, null, 8, ["blob-key", "alt"])], 8, yM)) : (R(), z("div", bM, [
					!u.value && !d.value ? (R(), B(M(Ek), {
						key: 0,
						class: "faint",
						"aria-hidden": "true"
					})) : W("", !0),
					s.value && !u.value ? (R(), z("span", xM, A(M(Y)("media.image.missing")), 1)) : W("", !0),
					v.value ? W("", !0) : (R(), z("p", SM, A(c.value), 1))
				])),
				u.value ? (R(), z("div", CM, [
					H(M(Nk), {
						class: "spin",
						"aria-hidden": "true"
					}),
					V("span", wM, A(M(Y)("media.image.generating")), 1),
					H(Q, {
						icon: M(xA),
						label: M(Y)("common.cancel"),
						small: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				])) : W("", !0),
				o.value && i.value.length > 1 && !u.value ? (R(), z("div", TM, [
					H(Q, {
						icon: M(KO),
						label: M(Y)("media.image.previous"),
						small: "",
						onClick: n[2] ||= (e) => h(-1)
					}, null, 8, ["icon", "label"]),
					V("span", EM, A(a.value + 1) + " / " + A(i.value.length), 1),
					H(Q, {
						icon: M(qO),
						label: M(Y)("media.image.next"),
						small: "",
						onClick: n[3] ||= (e) => h(1)
					}, null, 8, ["icon", "label"])
				])) : W("", !0)
			], 6),
			v.value ? (R(), z("form", {
				key: 0,
				class: "image-edit col",
				onSubmit: n[7] ||= hs((e) => S(!1), ["prevent"]),
				onKeydown: ee,
				onClick: n[8] ||= hs(() => {}, ["stop"])
			}, [P(V("textarea", {
				ref_key: "input",
				ref: b,
				"onUpdate:modelValue": n[4] ||= (e) => y.value = e,
				class: "input small",
				rows: "4",
				"aria-label": M(Y)("media.image.prompt")
			}, null, 8, DM), [[as, y.value]]), V("div", OM, [
				V("button", {
					type: "button",
					class: "btn ghost sm-btn",
					onClick: n[5] ||= (e) => v.value = !1
				}, A(M(Y)("common.cancel")), 1),
				V("button", kM, A(M(Y)("common.save")), 1),
				V("button", {
					type: "button",
					class: "btn primary sm-btn",
					onClick: n[6] ||= (e) => S(!0)
				}, [H(M(vA)), U(A(M(Y)("media.image.generate")), 1)])
			])], 32)) : (R(), z("figcaption", AM, [d.value ? (R(), z("span", {
				key: 0,
				class: "xs text-danger grow image-error",
				title: d.value
			}, A(d.value), 9, jM)) : (R(), z("span", MM, A(e.prompt.caption ?? ""), 1)), V("div", NM, [
				!o.value && !u.value ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn sm-btn",
					onClick: p
				}, [H(M(vA)), U(A(M(Y)(d.value ? "media.image.retry" : "media.image.generate")), 1)])) : W("", !0),
				o.value && !u.value ? (R(), B(Q, {
					key: 1,
					icon: M(Xk),
					label: M(Y)("media.image.regenerate"),
					small: "",
					onClick: p
				}, null, 8, ["icon", "label"])) : W("", !0),
				e.editable && !u.value ? (R(), B(Q, {
					key: 2,
					icon: M(Gk),
					label: M(Y)("media.image.editPrompt"),
					small: "",
					onClick: x
				}, null, 8, ["icon", "label"])) : W("", !0),
				o.value ? (R(), B(Q, {
					key: 3,
					icon: M(dk),
					label: M(Y)("media.image.download"),
					small: "",
					onClick: _
				}, null, 8, ["icon", "label"])) : W("", !0),
				o.value && e.editable && !u.value ? (R(), B(Q, {
					key: 4,
					icon: M(fA),
					label: M(Y)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: g
				}, null, 8, ["icon", "label"])) : W("", !0)
			])])),
			C.value && o.value ? (R(), B(_M, {
				key: 2,
				keys: i.value,
				start: a.value,
				caption: e.prompt.caption ?? c.value,
				onClose: n[9] ||= (e) => C.value = !1
			}, null, 8, [
				"keys",
				"start",
				"caption"
			])) : W("", !0)
		]));
	}
}), FM = /* @__PURE__ */ F({
	__name: "ImageCard",
	props: {
		mesid: {},
		genId: {},
		structure: {},
		prompts: {},
		records: {},
		editable: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (R(), z("div", { class: k(["image-card", { multi: e.prompts.length > 1 }]) }, [(R(!0), z(L, null, I(e.prompts, (t, n) => (R(), B(PM, {
			key: n,
			mesid: e.mesid,
			"gen-id": e.genId,
			structure: e.structure,
			index: n,
			prompt: t,
			record: e.records[n],
			editable: e.editable
		}, null, 8, [
			"mesid",
			"gen-id",
			"structure",
			"index",
			"prompt",
			"record",
			"editable"
		]))), 128))], 2));
	}
}), IM = /* @__PURE__ */ F({
	__name: "Cards",
	props: {
		mesid: {},
		position: { default: "bottom" }
	},
	setup(e) {
		let t = e, n = ZE(() => t.mesid), r = G(() => {
			let e = n.value, r = e?.preset;
			if (!e || !r) return null;
			let i = e.sidecar, a = e.live && ob.current?.genId === e.genId ? ob.current.structures : void 0, o = i && !e.live ? i.structures : t.position === "top" ? a : void 0;
			if (!o) return null;
			let s = Object.values(r.structures);
			for (let e of ["memory", "recap"]) s.some((t) => t.kind === e) || s.push({
				id: `__${e}`,
				kind: e,
				tag: e,
				field: e,
				formatPrompt: {
					tag: "",
					field: ""
				}
			});
			let c = [], l = oT(r), u = !(!i || e.live), d = J(o);
			for (let { decl: n } of UA(s, t.position)) {
				let a = o[n.id];
				switch (n.kind) {
					case "reply":
					case "impersonate":
						typeof a == "string" && a && c.push({
							type: n.kind,
							id: n.id,
							text: a
						});
						break;
					case "options":
						Array.isArray(a) && a.length && c.push({
							type: "options",
							id: n.id,
							options: a
						});
						break;
					case "synopsis":
						a && typeof a == "object" && c.push({
							type: "synopsis",
							id: n.id,
							synopsis: a
						});
						break;
					case "status":
						a && typeof a == "object" && Object.values(a).some((e) => typeof e == "string" && e.trim()) && c.push({
							type: "status",
							id: n.id,
							status: a
						});
						break;
					case "memory": {
						let t = i && !e.live ? i.events.filter((e) => e.type === "memory.replace" || e.type === "memory.delete" || e.type === "global.ref") : [];
						t.length && c.push({
							type: "memory",
							id: n.id,
							events: t
						});
						break;
					}
					case "recap": {
						let t = i && !e.live ? i.events.find((e) => e.type === "recap.set") : void 0;
						t?.type === "recap.set" && c.push({
							type: "recap",
							id: n.id,
							text: t.text,
							coversUpTo: t.coversUpTo
						});
						break;
					}
					case "image": {
						let t = i && !e.live && r.image ? Cc(a)?.images : void 0;
						t?.length && c.push({
							type: "image",
							id: n.id,
							prompts: t,
							records: i.images?.[n.id] ?? []
						});
						break;
					}
					case "custom": {
						if (n.display === "hidden" || a === void 0) break;
						let i = Pp(r, "structures", n.id, "title", n.title || n.id), o = bl(n);
						if (!o) {
							c.push({
								type: "custom",
								id: n.id,
								title: i,
								value: a
							});
							break;
						}
						if (!l) break;
						let s = n.id, f = t.mesid;
						c.push({
							type: "component",
							id: s,
							component: o,
							context: {
								value: d[s],
								structure: {
									id: s,
									kind: n.kind,
									title: i
								},
								structures: d,
								message: {
									id: f,
									streaming: e.running,
									editable: u
								},
								preset: {
									id: r.id,
									name: Fp(r),
									version: r.version
								},
								lang: Mp(),
								setValue: async (e) => u ? MA(f, s, e) : !1,
								fillInput: (e, t) => nT(String(e ?? ""), !!t, f)
							}
						});
						break;
					}
				}
			}
			return {
				preset: r,
				genId: e.genId,
				editable: u,
				narrator: dd(r, Im(r), r.narrator),
				color: XE(r, r.narrator),
				items: c
			};
		}), i = G(() => t.position === "top" && n.value && !n.value.live ? sw(t.mesid) : []);
		return (t, n) => r.value?.items.length || i.value.length ? (R(), z("div", {
			key: 0,
			class: k(["cards", `cards-${e.position}`])
		}, [i.value.length ? (R(), B(lM, {
			key: 0,
			mesid: e.mesid,
			segments: i.value
		}, null, 8, ["mesid", "segments"])) : W("", !0), (R(!0), z(L, null, I(r.value ? r.value.items : [], (t) => (R(), z(L, { key: t.id }, [t.type === "reply" ? (R(), B(KA, {
			key: 0,
			text: t.text,
			name: r.value.narrator,
			color: r.value.color
		}, null, 8, [
			"text",
			"name",
			"color"
		])) : t.type === "impersonate" ? (R(), B(ZA, {
			key: 1,
			text: t.text,
			mesid: e.mesid
		}, null, 8, ["text", "mesid"])) : t.type === "options" ? (R(), B(nj, {
			key: 2,
			options: t.options,
			mesid: e.mesid
		}, null, 8, ["options", "mesid"])) : t.type === "synopsis" ? (R(), B(jj, {
			key: 3,
			synopsis: t.synopsis,
			editable: r.value.editable,
			onSave: (n) => M(MA)(e.mesid, t.id, n)
		}, null, 8, [
			"synopsis",
			"editable",
			"onSave"
		])) : t.type === "status" ? (R(), B(Wj, {
			key: 4,
			status: t.status,
			editable: r.value.editable,
			onSave: (n) => M(MA)(e.mesid, t.id, n)
		}, null, 8, [
			"status",
			"editable",
			"onSave"
		])) : t.type === "memory" ? (R(), B(oj, {
			key: 5,
			events: t.events,
			preset: r.value.preset
		}, null, 8, ["events", "preset"])) : t.type === "recap" ? (R(), B(mj, {
			key: 6,
			text: t.text,
			"covers-up-to": t.coversUpTo
		}, null, 8, ["text", "covers-up-to"])) : t.type === "custom" ? (R(), B(Jj, {
			key: 7,
			title: t.title,
			value: t.value
		}, null, 8, ["title", "value"])) : t.type === "component" ? (R(), B(iM, {
			key: 8,
			component: t.component,
			context: t.context
		}, null, 8, ["component", "context"])) : t.type === "image" ? (R(), B(FM, {
			key: 9,
			mesid: e.mesid,
			"gen-id": r.value.genId,
			structure: t.id,
			prompts: t.prompts,
			records: t.records,
			editable: r.value.editable
		}, null, 8, [
			"mesid",
			"gen-id",
			"structure",
			"prompts",
			"records",
			"editable"
		])) : W("", !0)], 64))), 128))], 2)) : W("", !0);
	}
}), LM = {
	key: 0,
	class: "dock stages live"
}, RM = { class: "stage-bar" }, zM = { class: "ellipsis" }, BM = {
	key: 0,
	class: "small muted"
}, VM = /* @__PURE__ */ F({
	__name: "Dock",
	setup(e) {
		let t = G(() => ob.current && !ob.current.streaming && ob.current.status === "running" ? ob.current : null), n = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = wp(e.presetId);
			return e.stages.map((t) => ({
				...t,
				label: YE(n, e.workflow, t.id, t.label),
				color: XE(n, t.actor)
			}));
		}), r = G(() => n.value.find((e) => e.status === "streaming") ?? [...n.value].reverse().find((e) => e.text));
		return (e, i) => t.value ? (R(), z("div", LM, [V("div", RM, [
			H(M(Nk), { class: "spin faint" }),
			(R(!0), z(L, null, I(n.value, (e) => (R(), z("span", {
				key: e.id,
				class: k(["chip stage-chip", [e.status, { open: r.value?.id === e.id }]]),
				style: Ie({ "--actor": e.color })
			}, [V("span", zM, A(e.label), 1)], 6))), 128)),
			n.value.length ? W("", !0) : (R(), z("span", BM, A(M(Y)("stages.waiting")), 1))
		]), r.value ? (R(), B(AA, {
			key: 0,
			stage: r.value,
			follow: ""
		}, null, 8, ["stage"])) : W("", !0)])) : W("", !0);
	}
}), HM = ["title"], UM = { class: "storyline-name" }, WM = {
	key: 0,
	class: "storyline-if"
}, GM = /* @__PURE__ */ F({
	__name: "StorylineBadge",
	props: { mesid: {} },
	setup(e) {
		let t = e, n = G(() => {
			if (X.chatRev, !qD.value) return null;
			let e = YD()[t.mesid];
			if (!e) return null;
			let n = O_();
			return {
				key: e,
				name: qp(e, n) || Y("storylines.unnamed"),
				if: Gp(e, n),
				hidden: Kp(e, n)
			};
		});
		return (e, t) => n.value ? (R(), z("button", {
			key: 0,
			type: "button",
			class: k(["storyline-badge", { "if-line": n.value.if }]),
			title: M(Y)("storylines.openTab"),
			onClick: t[0] ||= (e) => M(pS)(n.value.key)
		}, [
			H(M(xk), {
				class: "lucide",
				"aria-hidden": "true"
			}),
			V("span", UM, A(n.value.name), 1),
			n.value.if ? (R(), z("span", WM, A(M(Y)("storylines.ifLine")), 1)) : W("", !0),
			n.value.hidden ? (R(), B(M(pk), {
				key: 1,
				class: "lucide storyline-hidden",
				"aria-label": M(Y)("storylines.hidden")
			}, null, 8, ["aria-label"])) : W("", !0)
		], 10, HM)) : W("", !0);
	}
}), KM = ["aria-label"], qM = ["disabled"], JM = /* @__PURE__ */ F({
	__name: "Switch",
	props: /*@__PURE__*/ ui({
		label: {},
		disabled: { type: Boolean },
		small: { type: Boolean }
	}, {
		modelValue: {
			type: Boolean,
			default: !1
		},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = hi(e, "modelValue");
		return (n, r) => (R(), z("label", {
			class: k(["switch", { sm: e.small }]),
			"aria-label": e.label
		}, [
			P(V("input", {
				"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
				type: "checkbox",
				role: "switch",
				disabled: e.disabled
			}, null, 8, qM), [[os, t.value]]),
			r[1] ||= V("span", { class: "track" }, null, -1),
			r[2] ||= V("span", { class: "thumb" }, null, -1)
		], 10, KM));
	}
}), YM = { class: "field-label" }, XM = { class: "ellipsis" }, ZM = {
	key: 0,
	class: "dot modified"
}, QM = { class: "field-control" }, $ = /* @__PURE__ */ F({
	__name: "Field",
	props: {
		label: {},
		help: {},
		inline: { type: Boolean },
		modified: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (R(), z("div", { class: k(["field", { inline: e.inline }]) }, [V("div", YM, [
			V("span", XM, A(e.label), 1),
			e.modified ? (R(), z("span", ZM)) : W("", !0),
			H(cj, {
				text: e.help,
				align: "start"
			}, null, 8, ["text"])
		]), V("div", QM, [ri(t.$slots, "default")])], 2));
	}
}), $M = { class: "swatches" }, eN = ["title"], tN = ["title"], nN = { class: "swatches" }, rN = ["title"], iN = /* @__PURE__ */ F({
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
		return (e, t) => (R(), B(dj, {
			title: M(Y)("appearance.title"),
			icon: M(Hk),
			collapsible: "",
			open: !1
		}, {
			default: N(() => [
				H($, {
					label: M(Y)("appearance.colors"),
					help: M(Y)("appearance.colors.hint"),
					inline: ""
				}, {
					default: N(() => [V("div", $M, [
						V("label", {
							class: "swatch",
							style: Ie({ background: M(r) || "var(--ap-primary-500)" }),
							title: M(Y)("appearance.primary")
						}, [P(V("input", {
							"onUpdate:modelValue": t[0] ||= (e) => /* @__PURE__ */ wn(r) ? r.value = e : null,
							type: "color"
						}, null, 512), [[
							as,
							M(r),
							void 0,
							{ lazy: !0 }
						]])], 12, eN),
						V("label", {
							class: "swatch",
							style: Ie({ background: M(i) || "var(--ap-accent-500)" }),
							title: M(Y)("appearance.accent")
						}, [P(V("input", {
							"onUpdate:modelValue": t[1] ||= (e) => /* @__PURE__ */ wn(i) ? i.value = e : null,
							type: "color"
						}, null, 512), [[
							as,
							M(i),
							void 0,
							{ lazy: !0 }
						]])], 12, tN),
						H(Q, {
							icon: M(Qk),
							label: M(Y)("common.reset"),
							small: "",
							align: "end",
							disabled: !M(r) && !M(i),
							onClick: o
						}, null, 8, [
							"icon",
							"label",
							"disabled"
						])
					])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: M(Y)("appearance.collapseStages"),
					inline: ""
				}, {
					default: N(() => [H(JM, {
						modelValue: a.value,
						"onUpdate:modelValue": t[2] ||= (e) => a.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label"]),
				H($, {
					label: M(Y)("appearance.annotations"),
					help: M(Y)("appearance.annotations.hint"),
					inline: ""
				}, {
					default: N(() => [H(JM, {
						modelValue: c.value,
						"onUpdate:modelValue": t[3] ||= (e) => c.value = e
					}, null, 8, ["modelValue"])]),
					_: 1
				}, 8, ["label", "help"]),
				c.value ? (R(), B($, {
					key: 0,
					label: M(Y)("appearance.annotationColor"),
					inline: ""
				}, {
					default: N(() => [V("div", nN, [V("label", {
						class: "swatch",
						style: Ie({ background: l.value || "var(--ap-accent)" }),
						title: M(Y)("appearance.annotationColor")
					}, [P(V("input", {
						"onUpdate:modelValue": t[4] ||= (e) => l.value = e,
						type: "color"
					}, null, 512), [[
						as,
						l.value,
						void 0,
						{ lazy: !0 }
					]])], 12, rN), H(Q, {
						icon: M(Qk),
						label: M(Y)("common.reset"),
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
}), aN = { class: "toolbar" }, oN = ["disabled"], sN = ["disabled"], cN = { class: "preset-list" }, lN = ["onClick", "onKeydown"], uN = { class: "preset-mark" }, dN = { class: "grow col preset-info" }, fN = { class: "row wrap preset-head" }, pN = { class: "preset-name" }, mN = { class: "badge neutral" }, hN = { class: "badge neutral icon-badge" }, gN = {
	key: 0,
	class: "xs muted"
}, _N = {
	key: 1,
	class: "small muted preset-desc"
}, vN = {
	key: 0,
	class: "empty"
}, yN = /* @__PURE__ */ F({
	__name: "PresetsTab",
	setup(e) {
		let t = G(() => bp()), n = (e) => du(e.preset).length > 0, r = /* @__PURE__ */ j(null), i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ j(null);
		async function s(e, t, n) {
			r.value = e;
			try {
				await t(), n && x("success", n);
			} catch (e) {
				uT(e) || bT(e) ? x("info", e.message) : x("error", e instanceof Error ? e.message : String(e), Y("app.name"));
			} finally {
				r.value = null;
			}
		}
		let c = (e) => s(`select:${e.preset.id}`, async () => {
			await dh(e.preset), cS();
		}), l = () => s("url", async () => {
			let e = await ET(a.value);
			return a.value = "", i.value = !1, e;
		}, Y("presets.installed")), u = (e) => {
			let t = e.target.files?.[0];
			t && s("file", () => DT(t), Y("presets.installed")), e.target.value = "";
		}, d = (e) => s(`update:${e.preset.id}`, () => kT(e.preset.id), Y("presets.updated")), f = (e) => s(`export:${e.preset.id}`, () => qw(e.preset)), p = (e) => s(`remove:${e.preset.id}`, () => NT(e.preset.id)), m = () => s("ext", async () => x("info", await Ab() === "current" ? Y("update.none") : Y("update.reloading")));
		return (e, s) => (R(), z(L, null, [
			V("div", aN, [
				V("button", {
					type: "button",
					class: "btn",
					disabled: r.value === "file",
					onClick: s[0] ||= (e) => o.value?.click()
				}, [H(M(hA)), U(A(M(Y)("presets.importFile")), 1)], 8, oN),
				V("button", {
					type: "button",
					class: k(["btn", { primary: i.value }]),
					onClick: s[1] ||= (e) => i.value = !i.value
				}, [H(M(Mk)), U(A(M(Y)("presets.importUrl")), 1)], 2),
				s[4] ||= V("span", { class: "grow" }, null, -1),
				H(Q, {
					icon: r.value === "ext" ? M(Nk) : M(Xk),
					label: M(Y)("presets.checkUpdates"),
					align: "end",
					disabled: r.value === "ext",
					onClick: m
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]),
				V("input", {
					ref_key: "fileInput",
					ref: o,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: u
				}, null, 544)
			]),
			i.value ? (R(), z("form", {
				key: 0,
				class: "row",
				onSubmit: hs(l, ["prevent"])
			}, [P(V("input", {
				"onUpdate:modelValue": s[2] ||= (e) => a.value = e,
				class: "input grow",
				type: "url",
				placeholder: "https://…/preset.apreset.json",
				required: ""
			}, null, 512), [[as, a.value]]), V("button", {
				type: "submit",
				class: "btn primary",
				disabled: r.value === "url"
			}, [r.value === "url" ? (R(), B(M(Nk), {
				key: 0,
				class: "spin"
			})) : (R(), B(M(dk), { key: 1 })), U(A(M(Y)("common.install")), 1)], 8, sN)], 32)) : W("", !0),
			V("div", cN, [(R(!0), z(L, null, I(t.value, (e) => (R(), z("div", {
				key: e.preset.id,
				class: k(["preset-item", { on: M(lS)?.id === e.preset.id }]),
				role: "button",
				tabindex: "0",
				onClick: (t) => c(e),
				onKeydown: _s((t) => c(e), ["enter"])
			}, [
				V("span", uN, [r.value === `select:${e.preset.id}` ? (R(), B(M(Nk), {
					key: 0,
					class: "spin"
				})) : M(lS)?.id === e.preset.id ? (R(), B(M(WO), { key: 1 })) : W("", !0)]),
				V("div", dN, [
					V("div", fN, [
						V("span", pN, A(M(Fp)(e.preset)), 1),
						V("span", mN, "v" + A(e.preset.version), 1),
						e.source === "builtin" ? W("", !0) : (R(), z("span", {
							key: 0,
							class: k(["badge", { warn: e.source === "dev" }])
						}, A(M(Y)(`presets.source.${e.source}`)), 3)),
						n(e) ? (R(), B(CA, {
							key: 1,
							text: M(Y)("presets.templates.help")
						}, {
							default: N(() => [V("span", hN, [H(M(ik)), U(A(M(Y)("presets.templates")), 1)])]),
							_: 1
						}, 8, ["text"])) : W("", !0)
					]),
					e.preset.author ? (R(), z("span", gN, A(e.preset.author), 1)) : W("", !0),
					M(Ip)(e.preset) ? (R(), z("span", _N, A(M(Ip)(e.preset)), 1)) : W("", !0)
				]),
				V("div", {
					class: "row preset-actions",
					onClick: s[3] ||= hs(() => {}, ["stop"])
				}, [
					H(Q, {
						icon: M(gk),
						label: M(Y)("presets.export"),
						align: "end",
						small: "",
						onClick: (t) => f(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					]),
					M(OT)(e.preset.id) ? (R(), B(Q, {
						key: 0,
						icon: M(Xk),
						label: M(Y)("presets.update"),
						align: "end",
						small: "",
						onClick: (t) => d(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : W("", !0),
					e.source === "installed" ? (R(), B(Q, {
						key: 1,
						icon: M(fA),
						label: M(Y)("common.delete"),
						align: "end",
						small: "",
						danger: "",
						onClick: (t) => p(e)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])) : W("", !0)
				])
			], 42, lN))), 128)), t.value.length ? W("", !0) : (R(), z("div", vN, A(M(Y)("presets.none")), 1))]),
			H(iN)
		], 64));
	}
}), bN;
function xN() {
	let e = lS, t = G(() => e.value ? Im(e.value) : null);
	function n(t, n = {}) {
		let r = e.value;
		r && (Rm(r, t), n.sampling && (clearTimeout(bN), bN = setTimeout(() => void fh(r), 400)));
	}
	return {
		preset: e,
		config: t,
		update: n
	};
}
//#endregion
//#region src/ui/panel/NoPreset.vue?vue&type=script&setup=true&lang.ts
var SN = { class: "empty" }, CN = /* @__PURE__ */ F({
	__name: "NoPreset",
	setup(e) {
		return (e, t) => (R(), z("div", SN, [
			H(M(Vk)),
			V("span", null, A(M(Y)("panel.noPreset")), 1),
			V("button", {
				type: "button",
				class: "btn",
				onClick: t[0] ||= (e) => M(X).tab = "presets"
			}, A(M(Y)("panel.choosePreset")), 1)
		]));
	}
}), wN = [
	"aria-checked",
	"title",
	"onClick"
], TN = { class: "ellipsis" }, EN = /* @__PURE__ */ F({
	__name: "Segmented",
	props: /*@__PURE__*/ ui({ options: {} }, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = hi(e, "modelValue");
		return (n, r) => (R(), z("div", {
			class: k(["segmented", { dense: e.options.length > 4 }]),
			role: "radiogroup"
		}, [(R(!0), z(L, null, I(e.options, (e) => (R(), z("button", {
			key: String(e.value),
			type: "button",
			role: "radio",
			"aria-checked": t.value === e.value,
			class: k({ on: t.value === e.value }),
			title: e.hint,
			onClick: (n) => t.value = e.value
		}, [e.icon ? (R(), B($r(e.icon), { key: 0 })) : W("", !0), V("span", TN, A(e.label), 1)], 10, wN))), 128))], 2));
	}
}), DN = { class: "col" }, ON = { class: "row" }, kN = ["aria-label"], AN = ["label"], jN = ["value"], MN = ["label"], NN = ["value"], PN = ["placeholder"], FN = {
	key: 1,
	class: "xs muted row tight"
}, IN = { value: "" }, LN = ["value"], RN = ["value"], zN = ["value"], BN = ["value"], VN = [
	"value",
	"placeholder",
	"onChange"
], HN = [
	"value",
	"placeholder",
	"onChange"
], UN = ["value"], WN = ["value"], GN = ["value"], KN = ["value"], qN = ["value"], JN = {
	key: 0,
	class: "xs muted"
}, YN = { class: "custom-ui-list small" }, XN = { class: "grow ellipsis" }, ZN = { class: "xs faint" }, QN = { class: "slider" }, $N = [
	"min",
	"max",
	"step",
	"value",
	"onInput"
], eP = [
	"min",
	"max",
	"step",
	"value",
	"onChange"
], tP = { class: "field-grid" }, nP = ["value", "onChange"], rP = ["value"], iP = ["value"], aP = /* @__PURE__ */ F({
	__name: "ConfigTab",
	setup(e) {
		let { preset: t, config: n, update: r } = xN(), i = G(() => t.value ? Nm(t.value) : null), a = G({
			get: () => i.value ? `${i.value.active.ref.kind}:${i.value.active.ref.id}` : "",
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let [r, ...i] = e.split(":");
				zm(n, {
					kind: r,
					id: i.join(":")
				}), fh(n);
			}
		}), o = G(() => {
			let e = t.value;
			return e ? xl(e).map((t) => ({
				id: t.id,
				title: Pp(e, "structures", t.id, "title", e.structures[t.id]?.title || t.id),
				mode: t.mode,
				position: e.structures[t.id]?.ui?.position ?? "bottom"
			})) : [];
		}), s = G({
			get: () => t.value ? oT(t.value) : !1,
			set: (e) => {
				let n = t.value;
				if (!n) return;
				let r = xp(n.id)?.source;
				!e || r === "builtin" || r === "dev" ? cT(n, e) : _T(n);
			}
		}), c = G(() => {
			let e = i.value?.customUi;
			return !!(t.value && e?.enabled && e.hash !== Cl(t.value));
		}), l = G(() => t.value ? Bm(t.value) : !1), u = G(() => i.value?.active.ref.kind === "saved" ? i.value.active.ref.id : null), d = /* @__PURE__ */ j(null), f = /* @__PURE__ */ j("");
		function p(e) {
			d.value = e, f.value = e === "rename" ? i.value?.saved.find((e) => e.id === u.value)?.name ?? "" : "";
		}
		function m() {
			let e = t.value, n = f.value.trim();
			e && n && (d.value === "new" ? Hm(e, n) : u.value && Wm(e, u.value, n), d.value = null);
		}
		let h = () => {
			t.value && (Vm(t.value), fh(t.value));
		}, g = () => {
			t.value && u.value && (Gm(t.value, u.value), fh(t.value));
		}, _ = () => {
			t.value && u.value && Um(t.value, u.value);
		}, v = G(() => Es.map((e) => ({
			value: e,
			label: Y(`transport.${e}`),
			hint: Y(`transport.${e}.hint`)
		}))), y = G({
			get: () => n.value?.connection.transport ?? "prefill",
			set: (e) => r((t) => {
				t.connection.transport = e;
			})
		}), b = G(() => y.value === "tool-single" || y.value === "tool-multi"), x = G(() => (t.value?.workflows ?? []).filter((e) => e.kind === "story")), S = G(() => x.value.map((e) => ({
			value: e.id,
			label: Pp(t.value, "workflows", e.id, "name", e.name),
			hint: Pp(t.value, "workflows", e.id, "description", e.description ?? "")
		}))), ee = G({
			get: () => n.value?.connection.workflow ?? "",
			set: (e) => r((t) => {
				t.connection.workflow = e;
			})
		}), C = G(() => S.value.find((e) => e.value === ee.value)?.hint);
		function w(e) {
			return G({
				get: () => n.value.connection[e],
				set: (t) => r((n) => {
					n.connection[e] = t;
				})
			});
		}
		let te = w("forceTool"), ne = w("parallelTools"), re = G({
			get: () => n.value ? _u(n.value.connection) : "off",
			set: (e) => r((t) => {
				t.connection.sendThoughtSignature = e !== "off" && e;
			})
		}), ie = w("openAiSignatures"), ae = w("streamToolArguments"), oe = w("finalFallback"), se = w("maxSteps"), ce = w("assumeToolSupport"), T = G({
			get: () => n.value?.connection.syntheticTurn ?? "",
			set: (e) => r((t) => {
				t.connection.syntheticTurn = e || null;
			})
		}), E = G(() => Object.entries(t.value?.actors ?? {})), le = (e, t, n) => r((r) => {
			r.identity[e][t] = n;
		}), ue = G({
			get: () => n.value?.tokenSaving.enabled ?? !1,
			set: (e) => r((t) => {
				t.tokenSaving.enabled = e;
			})
		}), de = (e, t) => r((n) => {
			n.tokenSaving[e] = Math.max(0, Number(t) || 0);
		}), fe = G(() => js.map((e) => ({
			value: e,
			label: Y(`writing.userInput.${e}`),
			hint: Y(`writing.userInput.${e}.hint`)
		}))), D = G({
			get: () => n.value?.tokenSaving.userInput ?? "truncate",
			set: (e) => r((t) => {
				t.tokenSaving.userInput = e;
			})
		}), O = G({
			get: () => n.value?.meta?.enabled !== !1,
			set: (e) => r((t) => {
				t.meta.enabled = e;
			})
		}), pe = G({
			get: () => n.value?.storylines?.enabled !== !1,
			set: (e) => r((t) => {
				t.storylines = {
					...Gu,
					...t.storylines,
					enabled: e
				};
			})
		}), me = G(() => Wu.map((e) => ({
			value: e,
			label: Y(`storylines.freeze.${e}`),
			hint: Y(`storylines.freeze.${e}.hint`)
		}))), he = G({
			get: () => Ku(n.value?.storylines),
			set: (e) => r((t) => {
				t.storylines = {
					...Gu,
					...t.storylines,
					freezeVariables: e
				};
			})
		}), ge = (e) => r((t) => {
			t.meta.recentCount = Math.max(0, Number(e) || 0);
		}), _e = G({
			get: () => n.value?.cache?.enabled ?? !1,
			set: (e) => r((t) => {
				t.cache.enabled = e;
			})
		}), ve = (e, t) => r((n) => {
			n.cache[e] = Math.max(0, Math.round(Number(t) || 0));
		}), ye = [
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
		], be = [
			"openai_max_context",
			"openai_max_tokens",
			"seed"
		], xe = ["stream_openai", "show_thoughts"], Se = [
			"auto",
			"min",
			"low",
			"medium",
			"high",
			"max"
		], Ce = G(() => n.value?.sampling ?? {}), we = (e) => e in Ce.value, Te = (e, t) => r((n) => {
			n.sampling[e] = t;
		}, { sampling: !0 }), Ee = (e) => Number(e.target.value);
		return (e, r) => !M(t) || !M(n) || !i.value ? (R(), B(CN, { key: 0 })) : (R(), z(L, { key: 1 }, [
			V("div", DN, [
				V("div", ON, [
					P(V("select", {
						"onUpdate:modelValue": r[0] ||= (e) => a.value = e,
						class: "input grow",
						"aria-label": M(Y)("config.configuration")
					}, [V("optgroup", { label: M(Y)("config.recommended") }, [(R(!0), z(L, null, I(M(t).configurations, (e) => (R(), z("option", {
						key: e.id,
						value: `recommended:${e.id}`
					}, A(M(Pp)(M(t), "configurations", e.id, "name", e.name)), 9, jN))), 128))], 8, AN), i.value.saved.length ? (R(), z("optgroup", {
						key: 0,
						label: M(Y)("config.saved")
					}, [(R(!0), z(L, null, I(i.value.saved, (e) => (R(), z("option", {
						key: e.id,
						value: `saved:${e.id}`
					}, A(e.name), 9, NN))), 128))], 8, MN)) : W("", !0)], 8, kN), [[cs, a.value]]),
					u.value && l.value ? (R(), B(Q, {
						key: 0,
						icon: M($k),
						label: M(Y)("config.overwrite"),
						align: "end",
						onClick: _
					}, null, 8, ["icon", "label"])) : W("", !0),
					H(Q, {
						icon: M(qk),
						label: M(Y)("config.saveAs"),
						align: "end",
						onClick: r[1] ||= (e) => p("new")
					}, null, 8, ["icon", "label"]),
					u.value ? (R(), B(Q, {
						key: 1,
						icon: M(Gk),
						label: M(Y)("common.rename"),
						align: "end",
						onClick: r[2] ||= (e) => p("rename")
					}, null, 8, ["icon", "label"])) : W("", !0),
					u.value ? (R(), B(Q, {
						key: 2,
						icon: M(fA),
						label: M(Y)("common.delete"),
						align: "end",
						danger: "",
						onClick: g
					}, null, 8, ["icon", "label"])) : W("", !0),
					H(Q, {
						icon: M(Qk),
						label: M(Y)("config.reset"),
						align: "end",
						disabled: !l.value,
						onClick: h
					}, null, 8, [
						"icon",
						"label",
						"disabled"
					])
				]),
				d.value ? (R(), z("form", {
					key: 0,
					class: "row",
					onSubmit: hs(m, ["prevent"])
				}, [
					P(V("input", {
						"onUpdate:modelValue": r[3] ||= (e) => f.value = e,
						class: "input grow",
						placeholder: M(Y)("config.name"),
						autofocus: ""
					}, null, 8, PN), [[as, f.value]]),
					H(Q, {
						icon: M(xA),
						label: M(Y)("common.cancel"),
						align: "end",
						onClick: r[4] ||= (e) => d.value = null
					}, null, 8, ["icon", "label"]),
					H(Q, {
						icon: M(WO),
						label: M(Y)("common.save"),
						align: "end",
						active: "",
						onClick: m
					}, null, 8, ["icon", "label"])
				], 32)) : W("", !0),
				l.value ? (R(), z("span", FN, [r[29] ||= V("span", { class: "dot modified" }, null, -1), U(A(M(Y)("config.modified")), 1)])) : W("", !0)
			]),
			H(dj, {
				title: M(Y)("config.connection"),
				icon: M(HO)
			}, {
				default: N(() => [
					H($, {
						label: M(Y)("config.transport"),
						help: M(Y)(`transport.${y.value}.hint`)
					}, {
						default: N(() => [H(EN, {
							modelValue: y.value,
							"onUpdate:modelValue": r[5] ||= (e) => y.value = e,
							options: v.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					b.value ? (R(), z(L, { key: 0 }, [
						H($, {
							label: M(Y)("config.forceTool"),
							help: M(Y)("config.forceTool.hint"),
							inline: ""
						}, {
							default: N(() => [H(JM, {
								modelValue: M(te),
								"onUpdate:modelValue": r[6] ||= (e) => /* @__PURE__ */ wn(te) ? te.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(Y)("config.parallelTools"),
							help: M(Y)("config.parallelTools.hint"),
							inline: ""
						}, {
							default: N(() => [H(JM, {
								modelValue: M(ne),
								"onUpdate:modelValue": r[7] ||= (e) => /* @__PURE__ */ wn(ne) ? ne.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(Y)("config.syntheticTurn"),
							help: M(Y)("config.syntheticTurn.hint"),
							inline: ""
						}, {
							default: N(() => [P(V("select", {
								"onUpdate:modelValue": r[8] ||= (e) => T.value = e,
								class: "input"
							}, [V("option", IN, A(M(Y)("common.none")), 1), (R(!0), z(L, null, I(M(t).syntheticTurns, (e) => (R(), z("option", {
								key: e.id,
								value: e.id
							}, A(e.label), 9, LN))), 128))], 512), [[cs, T.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(Y)("config.thoughtSignature"),
							help: M(Y)("config.thoughtSignature.hint"),
							inline: ""
						}, {
							default: N(() => [P(V("select", {
								"onUpdate:modelValue": r[9] ||= (e) => re.value = e,
								class: "input"
							}, [(R(!0), z(L, null, I(M(Os), (e) => (R(), z("option", {
								key: e,
								value: e
							}, A(M(Y)(`config.thoughtSignature.${e}`)), 9, RN))), 128))], 512), [[cs, re.value]])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(Y)("config.openAiSignatures"),
							help: M(Y)("config.openAiSignatures.hint"),
							inline: ""
						}, {
							default: N(() => [H(JM, {
								modelValue: M(ie),
								"onUpdate:modelValue": r[10] ||= (e) => /* @__PURE__ */ wn(ie) ? ie.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"]),
						H($, {
							label: M(Y)("config.streamToolArguments"),
							help: M(Y)("config.streamToolArguments.hint"),
							inline: ""
						}, {
							default: N(() => [P(V("select", {
								"onUpdate:modelValue": r[11] ||= (e) => /* @__PURE__ */ wn(ae) ? ae.value = e : null,
								class: "input"
							}, [(R(!0), z(L, null, I(M(Ds), (e) => (R(), z("option", {
								key: e,
								value: e
							}, A(M(Y)(`config.streamToolArguments.${e}`)), 9, zN))), 128))], 512), [[cs, M(ae)]])]),
							_: 1
						}, 8, ["label", "help"]),
						y.value === "tool-multi" ? (R(), B($, {
							key: 0,
							label: M(Y)("config.maxSteps"),
							inline: ""
						}, {
							default: N(() => [V("input", {
								class: "input",
								type: "number",
								min: "1",
								max: "20",
								value: M(se),
								onChange: r[12] ||= (e) => se.value = Ee(e)
							}, null, 40, BN)]),
							_: 1
						}, 8, ["label"])) : W("", !0),
						H($, {
							label: M(Y)("config.assumeToolSupport"),
							help: M(Y)("config.assumeToolSupport.hint"),
							inline: ""
						}, {
							default: N(() => [H(JM, {
								modelValue: M(ce),
								"onUpdate:modelValue": r[13] ||= (e) => /* @__PURE__ */ wn(ce) ? ce.value = e : null
							}, null, 8, ["modelValue"])]),
							_: 1
						}, 8, ["label", "help"])
					], 64)) : W("", !0),
					H($, {
						label: M(Y)("config.finalFallback"),
						help: M(Y)("config.finalFallback.hint"),
						inline: ""
					}, {
						default: N(() => [H(JM, {
							modelValue: M(oe),
							"onUpdate:modelValue": r[14] ||= (e) => /* @__PURE__ */ wn(oe) ? oe.value = e : null
						}, null, 8, ["modelValue"])]),
						_: 1
					}, 8, ["label", "help"])
				]),
				_: 1
			}, 8, ["title", "icon"]),
			S.value.length > 1 ? (R(), B(dj, {
				key: 0,
				title: M(Y)("config.workflow"),
				icon: M(bA),
				help: C.value
			}, {
				default: N(() => [H(EN, {
					modelValue: ee.value,
					"onUpdate:modelValue": r[15] ||= (e) => ee.value = e,
					options: S.value
				}, null, 8, ["modelValue", "options"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			H(dj, {
				title: M(Y)("writing.actors"),
				icon: M(fk),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [(R(!0), z(L, null, I(E.value, ([e, t]) => (R(), z("div", {
					key: e,
					class: "field-grid"
				}, [H($, { label: M(Y)("writing.actorName", { actor: e }) }, {
					default: N(() => [V("input", {
						class: "input",
						value: M(n).identity.names[e] ?? "",
						placeholder: t.name,
						onChange: (t) => le("names", e, t.target.value)
					}, null, 40, VN)]),
					_: 2
				}, 1032, ["label"]), H($, { label: M(Y)("writing.actorPrefix") }, {
					default: N(() => [V("input", {
						class: "input",
						value: M(n).identity.prefixes[e] ?? "",
						placeholder: t.prefix,
						onChange: (t) => le("prefixes", e, t.target.value)
					}, null, 40, HN)]),
					_: 2
				}, 1032, ["label"])]))), 128))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dj, {
				title: M(Y)("writing.meta"),
				icon: M(Lk),
				help: M(Y)("writing.meta.hint")
			}, {
				actions: N(() => [H(JM, {
					modelValue: O.value,
					"onUpdate:modelValue": r[16] ||= (e) => O.value = e,
					label: M(Y)("writing.meta")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [O.value ? (R(), B($, {
					key: 0,
					label: M(Y)("writing.recentCount"),
					help: M(Y)("writing.recentCount.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						max: "20",
						value: M(n).meta.recentCount,
						onChange: r[17] ||= (e) => ge(e.target.value)
					}, null, 40, UN)]),
					_: 1
				}, 8, ["label", "help"])) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			M(t).storylines ? (R(), B(dj, {
				key: 1,
				title: M(Y)("storylines.enabled"),
				icon: M(xk),
				help: M(Y)("storylines.config.hint")
			}, {
				actions: N(() => [H(JM, {
					modelValue: pe.value,
					"onUpdate:modelValue": r[18] ||= (e) => pe.value = e,
					label: M(Y)("storylines.enabled")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [pe.value ? (R(), B($, {
					key: 0,
					label: M(Y)("storylines.freezeVariables"),
					help: M(Y)("storylines.freezeVariables.hint")
				}, {
					default: N(() => [H(EN, {
						modelValue: he.value,
						"onUpdate:modelValue": r[19] ||= (e) => he.value = e,
						options: me.value
					}, null, 8, ["modelValue", "options"])]),
					_: 1
				}, 8, ["label", "help"])) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			H(dj, {
				title: M(Y)("writing.tokenSaving"),
				icon: M(ok),
				help: M(Y)("writing.tokenSaving.hint")
			}, {
				actions: N(() => [H(JM, {
					modelValue: ue.value,
					"onUpdate:modelValue": r[20] ||= (e) => ue.value = e,
					label: M(Y)("writing.tokenSaving")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [ue.value ? (R(), z(L, { key: 0 }, [
					H($, {
						label: M(Y)("writing.keepFullTurns"),
						help: M(Y)("writing.keepFullTurns.hint"),
						inline: ""
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: M(n).tokenSaving.keepFullTurns,
							onChange: r[21] ||= (e) => de("keepFullTurns", e.target.value)
						}, null, 40, WN)]),
						_: 1
					}, 8, ["label", "help"]),
					H($, {
						label: M(Y)("writing.userInput"),
						help: M(Y)("writing.userInput.hint")
					}, {
						default: N(() => [H(EN, {
							modelValue: D.value,
							"onUpdate:modelValue": r[22] ||= (e) => D.value = e,
							options: fe.value
						}, null, 8, ["modelValue", "options"])]),
						_: 1
					}, 8, ["label", "help"]),
					D.value === "truncate" ? (R(), B($, {
						key: 0,
						label: M(Y)("writing.truncateUserAfter"),
						help: M(Y)("writing.truncateUserAfter.hint"),
						inline: ""
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							min: "0",
							value: M(n).tokenSaving.truncateUserAfter,
							onChange: r[23] ||= (e) => de("truncateUserAfter", e.target.value)
						}, null, 40, GN)]),
						_: 1
					}, 8, ["label", "help"])) : W("", !0)
				], 64)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dj, {
				title: M(Y)("writing.cache"),
				icon: M(uk),
				help: M(Y)("writing.cache.hint")
			}, {
				actions: N(() => [H(JM, {
					modelValue: _e.value,
					"onUpdate:modelValue": r[24] ||= (e) => _e.value = e,
					label: M(Y)("writing.cache")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [_e.value ? (R(), z(L, { key: 0 }, [H($, {
					label: M(Y)("writing.cacheTtl"),
					help: M(Y)("writing.cacheTtl.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: M(n).cache.ttlMinutes,
						onChange: r[25] ||= (e) => ve("ttlMinutes", e.target.value)
					}, null, 40, KN)]),
					_: 1
				}, 8, ["label", "help"]), H($, {
					label: M(Y)("writing.cacheMaxDeferred"),
					help: M(Y)("writing.cacheMaxDeferred.hint"),
					inline: ""
				}, {
					default: N(() => [V("input", {
						class: "input",
						type: "number",
						min: "0",
						value: M(n).cache.maxDeferredTurns,
						onChange: r[26] ||= (e) => ve("maxDeferredTurns", e.target.value)
					}, null, 40, qN)]),
					_: 1
				}, 8, ["label", "help"])], 64)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			o.value.length ? (R(), B(dj, {
				key: 2,
				title: M(Y)("config.customUi"),
				icon: M(Jk),
				help: M(Y)("config.customUi.hint")
			}, {
				actions: N(() => [H(JM, {
					modelValue: s.value,
					"onUpdate:modelValue": r[27] ||= (e) => s.value = e,
					label: M(Y)("config.customUi.enable")
				}, null, 8, ["modelValue", "label"])]),
				default: N(() => [c.value && !s.value ? (R(), z("p", JN, A(M(Y)("config.customUi.changed")), 1)) : W("", !0), V("ul", YN, [(R(!0), z(L, null, I(o.value, (e) => (R(), z("li", {
					key: e.id,
					class: "row tight"
				}, [V("span", XN, A(e.title), 1), V("span", ZN, A(M(Y)(`config.customUi.${e.mode}`)) + " · " + A(M(Y)(`config.customUi.${e.position}`)), 1)]))), 128))])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			H(dj, {
				title: M(Y)("config.sampling"),
				icon: M(bk),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [
					(R(), z(L, null, I(ye, (e) => (R(), z(L, { key: e.key }, [we(e.key) ? (R(), B($, {
						key: 0,
						label: M(Y)(`sampling.${e.key}`)
					}, {
						default: N(() => [V("div", QN, [V("input", {
							type: "range",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Ce.value[e.key],
							onInput: (t) => Te(e.key, Ee(t))
						}, null, 40, $N), V("input", {
							class: "input",
							type: "number",
							min: e.min,
							max: e.max,
							step: e.step,
							value: Ce.value[e.key],
							onChange: (t) => Te(e.key, Ee(t))
						}, null, 40, eP)])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)),
					V("div", tP, [(R(), z(L, null, I(be, (e) => (R(), z(L, { key: e }, [we(e) ? (R(), B($, {
						key: 0,
						label: M(Y)(`sampling.${e}`)
					}, {
						default: N(() => [V("input", {
							class: "input",
							type: "number",
							value: Ce.value[e],
							onChange: (t) => Te(e, Ee(t))
						}, null, 40, nP)]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64)), we("reasoning_effort") ? (R(), B($, {
						key: 0,
						label: M(Y)("sampling.reasoning_effort")
					}, {
						default: N(() => [V("select", {
							class: "input",
							value: Ce.value.reasoning_effort,
							onChange: r[28] ||= (e) => Te("reasoning_effort", e.target.value)
						}, [(R(), z(L, null, I(Se, (e) => V("option", {
							key: e,
							value: e
						}, A(M(Y)(`effort.${e}`)), 9, iP)), 64))], 40, rP)]),
						_: 1
					}, 8, ["label"])) : W("", !0)]),
					(R(), z(L, null, I(xe, (e) => (R(), z(L, { key: e }, [we(e) ? (R(), B($, {
						key: 0,
						label: M(Y)(`sampling.${e}`),
						inline: ""
					}, {
						default: N(() => [H(JM, {
							"model-value": !!Ce.value[e],
							"onUpdate:modelValue": (t) => Te(e, t)
						}, null, 8, ["model-value", "onUpdate:modelValue"])]),
						_: 2
					}, 1032, ["label"])) : W("", !0)], 64))), 64))
				]),
				_: 1
			}, 8, ["title", "icon"])
		], 64));
	}
}), oP = [
	"normal",
	"regenerate",
	"swipe",
	"continue",
	"quiet",
	"impersonate"
];
function sP(e) {
	let t = (e, t) => e.map((e) => ({
		value: e,
		label: t(String(e))
	}));
	return {
		transport: {
			kind: "enum",
			label: Y("config.transport"),
			options: t([...Es], (e) => Y(`transport.${e}`))
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
				label: Pp(e, "workflows", t.id, "name", t.name)
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
			options: t(oP, (e) => Y(`um.genType.${e}`))
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
		},
		...e.inputShaping ? { "input.shaped": {
			kind: "bool",
			label: Y("um.var.inputShaped")
		} } : {},
		...e.image ? { "image.on": {
			kind: "bool",
			label: Y("um.var.imageOn")
		} } : {},
		...e.speech ? { "speech.on": {
			kind: "bool",
			label: Y("um.var.speechOn")
		} } : {}
	};
}
var cP = (e) => e.modules.filter((e) => e.toggle === "user");
function lP(e) {
	let t = sP(e), n = (e) => e.filter((e) => t[e]).map((e) => ({
		id: e,
		label: t[e].label
	})), r = [];
	return cP(e).length && r.push({
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
				"meta.pure",
				"input.shaped",
				"image.on",
				"speech.on"
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
function uP(e) {
	if (e.kind !== "var") return e.kind;
	let t = e.path.split(".")[0];
	return t === "modules" ? "module" : t === "params" ? "param" : t === "flags" ? "flag" : e.path;
}
function dP(e, t) {
	return t === "module" ? cP(e).map((t) => ({
		value: t.id,
		label: Pp(e, "modules", t.id, "name", t.name)
	})) : t === "param" ? e.params.map((t) => ({
		value: t.id,
		label: Pp(e, "params", t.id, "label", t.label)
	})) : t === "flag" ? e.regex.map((e) => ({
		value: e.id,
		label: e.id
	})) : [];
}
function fP(e, t) {
	let [n, r = ""] = t.split(".", 2);
	if (n === "modules") return {
		kind: "bool",
		label: dP(e, "module").find((e) => e.value === r)?.label ?? r
	};
	if (n === "flags") return {
		kind: "bool",
		label: r
	};
	if (n === "params") {
		let t = e.params.find((e) => e.id === r), n = t ? Pp(e, "params", t.id, "label", t.label) : r;
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
			label: pP(e, t.id, n.value, n.label)
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
	return sP(e)[t] ?? {
		kind: "text",
		label: t
	};
}
var pP = (e, t, n, r) => Np(e)?.params?.[t]?.options?.[String(n)] ?? r ?? String(n), mP = {
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
function hP(e, t) {
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
		let n = String(dP(e, t)[0]?.value ?? "");
		return gP(e, {
			kind: "var",
			path: "",
			op: "on"
		}, `${{
			module: "modules",
			param: "params",
			flag: "flags"
		}[t]}.${n}`);
	}
	return gP(e, {
		kind: "var",
		path: "",
		op: "on"
	}, t);
}
function gP(e, t, n) {
	let r = fP(e, n);
	return t.path && fP(e, t.path).kind === r.kind && mP[r.kind].includes(t.op) && r.kind !== "enum" ? {
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
function _P(e, t, n = "") {
	return e === "bool" ? Y(n.startsWith("modules.") ? `um.op.module.${t}` : `um.op.${t}`) : e === "list" ? Y(`um.op.list.${t}`) : e === "enum" ? Y(`um.op.${t}`) : t === "==" ? "=" : t === "!=" ? "≠" : t === ">=" ? "≥" : t === "<=" ? "≤" : t;
}
var vP = (e, t) => {
	let n = (t) => e.options?.find((e) => String(e.value) === String(t))?.label ?? String(t);
	return Array.isArray(t) ? t.map(n).join(Y("um.or")) : t === void 0 ? "" : n(t);
};
function yP(e, t) {
	if (t.kind === "expr") return t.source;
	if (t.kind === "keyword") return `${t.target === "input" ? Y("um.kw.input") : Y("um.kw.recentN", { n: t.depth ?? 3 })} ${Y(`um.kw.${t.op}`)} ${t.words.join(Y("um.or"))}`;
	let n = fP(e, t.path);
	return n.kind === "bool" || n.kind === "list" ? Y("um.boolDesc", {
		label: n.label,
		value: _P(n.kind, t.op, t.path)
	}) : `${n.label} ${_P(n.kind, t.op)} ${vP(n, t.value)}`;
}
function bP(e, t) {
	let n = t.rules.filter(lf);
	return n.length ? n.map((t) => yP(e, t)).join(t.match === "any" ? `\n${Y("um.match.anyJoin")} ` : `\n${Y("um.match.allJoin")} `) : Y("um.always");
}
//#endregion
//#region src/ui/panel/user-modules/UserModulesSection.vue?vue&type=script&setup=true&lang.ts
var xP = ["aria-label"], SP = { class: "um-picker-head" }, CP = { class: "small muted" }, wP = { class: "um-choice-text" }, TP = { class: "xs muted" }, EP = ["data-template", "onClick"], DP = { class: "um-choice-text" }, OP = {
	key: 0,
	class: "xs muted um-choice-desc"
}, kP = ["data-id"], AP = ["aria-label", "onPointerdown"], jP = ["onClick"], MP = { class: "um-row-name ellipsis" }, NP = { class: "um-row-meta xs muted ellipsis" }, PP = {
	key: 3,
	class: "faint small"
}, FP = /* @__PURE__ */ F({
	__name: "UserModulesSection",
	props: { preset: {} },
	emits: ["open"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => Yh(n.preset)), a = G(() => n.preset.insertionPoints.length > 0 || n.preset.vars.length > 0), o = (e) => {
			let t = n.preset.insertionPoints.find((t) => t.id === e);
			return t ? Pp(n.preset, "insertionPoints", e, "label", t.label) : e;
		}, s = (e) => {
			let t = n.preset.vars.find((t) => t.id === e);
			return t ? Pp(n.preset, "vars", e, "label", t.label ?? e) : e;
		}, c = (e) => [...new Set(e.entries.filter($d).map((e) => e.point))].map(o).concat(e.vars.filter($d).map((e) => s(e.var))).join(" · "), l = (e) => bf(n.preset, e), u = (e) => Y("um.lostHint", { points: l(e).join(", ") }), d = (e) => e.trigger.rules.some(lf);
		function f(e, t) {
			e.enabled = t, q();
		}
		let p = G(() => Vf(n.preset).map((e) => ({
			tpl: e,
			body: Lp(n.preset, e, "userModuleTemplates")
		}))), m = /* @__PURE__ */ j(!1), h = /* @__PURE__ */ j(null);
		function g() {
			m.value = !1;
			let e = $h(n.preset, Y("um.newName", { n: i.value.length + 1 }));
			r("open", e.id);
		}
		function _(e) {
			m.value = !1;
			let t = eg(n.preset, Lp(n.preset, e, "userModuleTemplates"));
			r("open", t.id);
		}
		async function v() {
			if (!p.value.length) return g();
			m.value = !m.value, m.value && (await Xn(), h.value?.querySelector(".um-choice")?.focus());
		}
		let y = /* @__PURE__ */ j(null);
		async function b(e) {
			let t = e.target, r = t.files?.[0];
			if (t.value = "", r) try {
				let e = JSON.parse(await r.text());
				await gT(zf(e).modules);
				let { added: t, missing: i } = ag(n.preset, e);
				x(i ? "warning" : "success", i ? Y("um.importedMissing", {
					n: t.length,
					missing: i
				}) : Y("um.imported", { n: t.length }));
			} catch (e) {
				uT(e) ? x("info", e.message) : x("error", Y("um.importFailed", { error: e instanceof Error ? e.message : String(e) }));
			}
		}
		let S = () => Lw(`${n.preset.id}.ap-modules.json`, ig(n.preset)), ee = /* @__PURE__ */ j(null), C = /* @__PURE__ */ j(null);
		function w(e, t) {
			e.preventDefault(), e.currentTarget.setPointerCapture(e.pointerId), C.value = t;
		}
		function te(e) {
			let t = C.value;
			if (!t || !ee.value) return;
			let r = [...ee.value.querySelectorAll(".um-row")].filter((e) => e.dataset.id !== t).filter((t) => {
				let n = t.getBoundingClientRect();
				return n.top + n.height / 2 < e.clientY;
			}).length;
			i.value[r]?.id !== t && rg(n.preset, t, r);
		}
		let ne = () => {
			C.value = null;
		};
		return (t, n) => (R(), B(dj, {
			title: M(Y)("um.title"),
			help: M(Y)("um.help")
		}, {
			actions: N(() => [
				a.value ? (R(), B(Q, {
					key: 0,
					icon: M(hA),
					label: M(Y)("um.import"),
					small: "",
					align: "end",
					onClick: n[0] ||= (e) => y.value?.click()
				}, null, 8, ["icon", "label"])) : W("", !0),
				i.value.length ? (R(), B(Q, {
					key: 1,
					icon: M(dk),
					label: M(Y)("um.exportAll"),
					small: "",
					align: "end",
					onClick: S
				}, null, 8, ["icon", "label"])) : W("", !0),
				a.value && i.value.length ? (R(), B(Q, {
					key: 2,
					icon: M(qk),
					label: M(Y)("um.new"),
					active: m.value,
					small: "",
					align: "end",
					onClick: v
				}, null, 8, [
					"icon",
					"label",
					"active"
				])) : W("", !0)
			]),
			default: N(() => [
				m.value ? (R(), z("div", {
					key: 0,
					ref_key: "pickerEl",
					ref: h,
					class: "um-picker",
					role: "group",
					"aria-label": M(Y)("um.startFrom"),
					onKeydown: n[2] ||= _s(hs((e) => m.value = !1, ["stop"]), ["esc"])
				}, [
					V("div", SP, [V("span", CP, A(M(Y)("um.startFrom")), 1), H(Q, {
						icon: M(xA),
						label: M(Y)("common.cancel"),
						small: "",
						align: "end",
						onClick: n[1] ||= (e) => m.value = !1
					}, null, 8, ["icon", "label"])]),
					V("button", {
						type: "button",
						class: "um-choice",
						onClick: g
					}, [H(M(vk)), V("span", wP, [V("span", null, A(M(Y)("um.blank")), 1), V("span", TP, A(M(Y)("um.blank.desc")), 1)])]),
					(R(!0), z(L, null, I(p.value, (e) => (R(), z("button", {
						key: e.tpl.id,
						type: "button",
						class: "um-choice",
						"data-template": e.tpl.id,
						onClick: (t) => _(e.tpl)
					}, [H(M(jk)), V("span", DP, [V("span", null, A(e.body.name), 1), e.body.description ? (R(), z("span", OP, A(e.body.description), 1)) : W("", !0)])], 8, EP))), 128))
				], 40, xP)) : W("", !0),
				i.value.length ? (R(), z("div", {
					key: 1,
					ref_key: "listEl",
					ref: ee,
					class: "um-list"
				}, [(R(!0), z(L, null, I(i.value, (t) => (R(), z("div", {
					key: t.id,
					class: k(["um-row", {
						off: !t.enabled,
						dragging: C.value === t.id
					}]),
					"data-id": t.id
				}, [
					i.value.length > 1 ? (R(), z("span", {
						key: 0,
						class: "um-grip",
						"aria-label": M(Y)("um.reorder"),
						onPointerdown: (e) => w(e, t.id),
						onPointermove: te,
						onPointerup: ne,
						onPointercancel: ne
					}, [H(M(wk))], 40, AP)) : W("", !0),
					V("button", {
						type: "button",
						class: "um-open",
						onClick: (e) => r("open", t.id)
					}, [V("span", MP, A(t.name || M(Y)("um.untitled")), 1), V("span", NP, A(c(t) || M(Y)("um.noEntries")), 1)], 8, jP),
					l(t).length ? (R(), B(CA, {
						key: 1,
						text: u(t),
						align: "end"
					}, {
						default: N(() => [H(M(pA), {
							class: "text-warning um-flag",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : W("", !0),
					d(t) ? (R(), B(CA, {
						key: 2,
						text: M(bP)(e.preset, t.trigger),
						align: "end"
					}, {
						default: N(() => [H(M(SA), {
							class: "um-flag um-zap",
							tabindex: "0"
						})]),
						_: 1
					}, 8, ["text"])) : W("", !0),
					H(JM, {
						"model-value": t.enabled,
						label: t.name,
						"onUpdate:modelValue": (e) => f(t, e)
					}, null, 8, [
						"model-value",
						"label",
						"onUpdate:modelValue"
					])
				], 10, kP))), 128))], 512)) : a.value && !m.value ? (R(), z("button", {
					key: 2,
					type: "button",
					class: "um-new",
					onClick: v
				}, [H(M(qk)), U(A(M(Y)("um.new")), 1)])) : a.value ? W("", !0) : (R(), z("div", PP, A(M(Y)("um.noPoints")), 1)),
				V("input", {
					ref_key: "fileInput",
					ref: y,
					type: "file",
					accept: ".json,application/json",
					hidden: "",
					onChange: b
				}, null, 544)
			]),
			_: 1
		}, 8, ["title", "help"]));
	}
}), IP = ["title"], LP = ["aria-label", "onClick"], RP = ["placeholder"], zP = /* @__PURE__ */ F({
	__name: "ChipsInput",
	props: /*@__PURE__*/ ui({
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
		let t = hi(e, "modelValue"), n = e, r = /* @__PURE__ */ j(""), i = /* @__PURE__ */ j(null);
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
		return (n, l) => (R(), z("div", {
			class: "chips-input input",
			onClick: l[2] ||= (e) => i.value?.focus()
		}, [(R(!0), z(L, null, I(t.value, (t, n) => (R(), z("span", {
			key: t,
			class: k(["chip", { mono: e.mono }])
		}, [V("span", {
			class: "ellipsis",
			title: t
		}, A(t), 9, IP), V("button", {
			type: "button",
			class: "chip-x",
			"aria-label": e.removeLabel,
			onClick: hs((e) => c(n), ["stop"])
		}, [H(M(xA))], 8, LP)], 2))), 128)), P(V("input", {
			ref_key: "input",
			ref: i,
			"onUpdate:modelValue": l[0] ||= (e) => r.value = e,
			class: k(["chips-draft", { mono: e.mono }]),
			placeholder: t.value.length ? "" : e.placeholder,
			onKeydown: o,
			onBlur: l[1] ||= (e) => a(),
			onPaste: s
		}, null, 42, RP), [[as, r.value]])]));
	}
}), BP = { class: "rule" }, VP = { class: "rule-head" }, HP = ["value", "aria-label"], UP = ["label"], WP = ["value"], GP = ["value"], KP = ["value"], qP = ["value"], JP = ["value"], YP = {
	key: 1,
	class: "grow"
}, XP = {
	key: 0,
	class: "rule-body"
}, ZP = { class: "row wrap" }, QP = {
	key: 0,
	class: "unit small muted"
}, $P = ["value"], eF = ["value"], tF = { value: "any" }, nF = { value: "none" }, rF = { class: "row kw-words" }, iF = {
	key: 1,
	class: "rule-body"
}, aF = ["value"], oF = {
	key: 2,
	class: "rule-body"
}, sF = ["value"], cF = ["value"], lF = { class: "row wrap option-chips" }, uF = ["aria-pressed", "onClick"], dF = {
	key: 2,
	class: "row"
}, fF = ["value"], pF = ["value"], mF = ["value"], hF = ["list", "value"], gF = ["value"], _F = {
	key: 3,
	class: "rule-error xs"
}, vF = /* @__PURE__ */ F({
	__name: "RuleRow",
	props: /*@__PURE__*/ ui({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ ui(["remove"], ["update:modelValue"]),
	setup(e) {
		let t = e, n = hi(e, "modelValue"), r = G(() => lP(t.preset)), i = G(() => uP(n.value)), a = G(() => dP(t.preset, i.value)), o = G(() => n.value.kind === "var" ? n.value.path.split(".").slice(1).join(".") : ""), s = G(() => n.value.kind === "var" ? fP(t.preset, n.value.path) : null), c = G(() => hf(n.value)), l = `ap-um-${Math.random().toString(36).slice(2, 8)}`;
		function u(e) {
			e !== i.value && (n.value = hP(t.preset, e));
		}
		function d(e) {
			let r = n.value, i = r.path.split(".")[0];
			n.value = gP(t.preset, r, `${i}.${e}`);
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
		let g = G(() => s.value?.kind === "list" ? "list" : "bool"), _ = G(() => mP[g.value].map((e) => ({
			value: e,
			label: _P(g.value, e, n.value.path)
		}))), v = G(() => (s.value ? mP[s.value.kind] : []).map((e) => ({
			value: e,
			label: _P(s.value.kind, e)
		}))), y = G({
			get: () => n.value.target,
			set: (e) => p(e === "recent" ? {
				target: e,
				depth: n.value.depth ?? 3
			} : {
				target: e,
				depth: void 0
			})
		}), b = G(() => [{
			value: "input",
			label: Y("um.kw.input")
		}, {
			value: "recent",
			label: Y("um.kw.recent")
		}]);
		return (e, t) => (R(), z("div", BP, [
			V("div", VP, [
				V("select", {
					class: "input bare rule-subject",
					value: i.value,
					"aria-label": M(Y)("um.subject"),
					onChange: t[0] ||= (e) => u(e.target.value)
				}, [(R(!0), z(L, null, I(r.value, (e) => (R(), z("optgroup", {
					key: e.label,
					label: e.label
				}, [(R(!0), z(L, null, I(e.subjects, (e) => (R(), z("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, WP))), 128))], 8, UP))), 128)), n.value.kind === "var" && !r.value.some((e) => e.subjects.some((e) => e.id === i.value)) ? (R(), z("option", {
					key: 0,
					value: i.value
				}, A(n.value.path), 9, GP)) : W("", !0)], 40, HP),
				a.value.length ? (R(), z("select", {
					key: 0,
					class: "input bare rule-target grow",
					value: o.value,
					onChange: t[1] ||= (e) => d(e.target.value)
				}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
					key: String(e.value),
					value: e.value
				}, A(e.label), 9, qP))), 128)), a.value.some((e) => String(e.value) === o.value) ? W("", !0) : (R(), z("option", {
					key: 0,
					value: o.value,
					disabled: ""
				}, A(o.value), 9, JP))], 40, KP)) : (R(), z("span", YP)),
				H(Q, {
					icon: M(xA),
					label: M(Y)("um.removeRule"),
					small: "",
					align: "end",
					onClick: t[2] ||= (t) => e.$emit("remove")
				}, null, 8, ["icon", "label"])
			]),
			n.value.kind === "keyword" ? (R(), z("div", XP, [V("div", ZP, [
				H(EN, {
					modelValue: y.value,
					"onUpdate:modelValue": t[3] ||= (e) => y.value = e,
					class: "rule-scope",
					options: b.value
				}, null, 8, ["modelValue", "options"]),
				n.value.target === "recent" ? (R(), z("label", QP, [V("input", {
					class: "input depth",
					type: "number",
					min: "1",
					max: "50",
					value: n.value.depth ?? M(3),
					onChange: t[4] ||= (e) => p({ depth: Math.max(1, Math.min(50, Number(e.target.value) || 1)) })
				}, null, 40, $P), U(" " + A(M(Y)("um.kw.messages")), 1)])) : W("", !0),
				V("select", {
					class: "input bare rule-op",
					value: n.value.op,
					onChange: t[5] ||= (e) => p({ op: e.target.value })
				}, [V("option", tF, A(M(Y)("um.kw.any")), 1), V("option", nF, A(M(Y)("um.kw.none")), 1)], 40, eF)
			]), V("div", rF, [H(zP, {
				class: "grow",
				"model-value": n.value.words,
				literal: n.value.regex,
				mono: n.value.regex,
				"remove-label": M(Y)("common.delete"),
				placeholder: n.value.regex ? M(Y)("um.kw.regexPlaceholder") : M(Y)("um.kw.placeholder"),
				"onUpdate:modelValue": t[6] ||= (e) => p({ words: e })
			}, null, 8, [
				"model-value",
				"literal",
				"mono",
				"remove-label",
				"placeholder"
			]), H(Q, {
				icon: M(Zk),
				label: M(Y)("um.kw.regex"),
				active: n.value.regex,
				align: "end",
				onClick: t[7] ||= (e) => p({ regex: !n.value.regex || void 0 })
			}, null, 8, [
				"icon",
				"label",
				"active"
			])])])) : n.value.kind === "expr" ? (R(), z("div", iF, [V("input", {
				class: "input mono",
				value: n.value.source,
				spellcheck: "false",
				placeholder: "params.language == \"English\"",
				onInput: t[8] ||= (e) => n.value = {
					kind: "expr",
					source: e.target.value
				}
			}, null, 40, aF)])) : s.value ? (R(), z("div", oF, [s.value.kind === "bool" || s.value.kind === "list" ? (R(), B(EN, {
				key: 0,
				"model-value": n.value.op,
				options: _.value,
				"onUpdate:modelValue": t[9] ||= (e) => f({ op: e })
			}, null, 8, ["model-value", "options"])) : s.value.kind === "enum" ? (R(), z(L, { key: 1 }, [V("select", {
				class: "input bare rule-op",
				value: n.value.op,
				onChange: t[10] ||= (e) => f({ op: e.target.value })
			}, [(R(!0), z(L, null, I(v.value, (e) => (R(), z("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, cF))), 128))], 40, sF), V("div", lF, [(R(!0), z(L, null, I(s.value.options, (e) => (R(), z("button", {
				key: String(e.value),
				type: "button",
				class: k(["chip", { on: m.value.includes(String(e.value)) }]),
				"aria-pressed": m.value.includes(String(e.value)),
				onClick: (t) => h(e.value)
			}, A(e.label), 11, uF))), 128))])], 64)) : (R(), z("div", dF, [V("select", {
				class: "input rule-cmp",
				value: n.value.op,
				onChange: t[11] ||= (e) => f({ op: e.target.value })
			}, [(R(!0), z(L, null, I(v.value, (e) => (R(), z("option", {
				key: e.value,
				value: e.value
			}, A(e.label), 9, pF))), 128))], 40, fF), s.value.kind === "number" ? (R(), z("input", {
				key: 0,
				class: "input grow",
				type: "number",
				value: n.value.value,
				onChange: t[12] ||= (e) => f({ value: Number(e.target.value) })
			}, null, 40, mF)) : (R(), z(L, { key: 1 }, [V("input", {
				class: "input grow",
				list: s.value.suggestions?.length ? l : void 0,
				value: n.value.value,
				onInput: t[13] ||= (e) => f({ value: e.target.value })
			}, null, 40, hF), s.value.suggestions?.length ? (R(), z("datalist", {
				key: 0,
				id: l
			}, [(R(!0), z(L, null, I(s.value.suggestions, (e) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, gF))), 128))])) : W("", !0)], 64))]))])) : W("", !0),
			c.value ? (R(), z("div", _F, A(c.value), 1)) : W("", !0)
		]));
	}
}), yF = { class: "trigger" }, bF = {
	key: 1,
	class: "always faint small"
}, xF = {
	key: 0,
	class: "rule-join xs faint"
}, SF = { class: "btn ghost add picker" }, CF = ["aria-label"], wF = ["label"], TF = ["value"], EF = /* @__PURE__ */ F({
	__name: "TriggerEditor",
	props: /*@__PURE__*/ ui({ preset: {} }, {
		modelValue: { required: !0 },
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = e, n = hi(e, "modelValue"), r = G(() => lP(t.preset)), i = /* @__PURE__ */ j(null), a = G(() => [{
			value: "all",
			label: Y("um.match.all")
		}, {
			value: "any",
			label: Y("um.match.any")
		}]);
		function o(e) {
			e && (n.value.rules.push(hP(t.preset, e)), i.value && (i.value.value = ""));
		}
		let s = (e, t) => {
			n.value.rules.splice(e, 1, t);
		}, c = (e) => {
			n.value.rules.splice(e, 1);
		};
		return (t, l) => (R(), z("div", yF, [
			n.value.rules.length > 1 ? (R(), B(EN, {
				key: 0,
				modelValue: n.value.match,
				"onUpdate:modelValue": l[0] ||= (e) => n.value.match = e,
				options: a.value
			}, null, 8, ["modelValue", "options"])) : W("", !0),
			n.value.rules.length ? W("", !0) : (R(), z("div", bF, A(M(Y)("um.always")), 1)),
			(R(!0), z(L, null, I(n.value.rules, (t, r) => (R(), z(L, { key: r }, [r > 0 ? (R(), z("div", xF, A(n.value.match === "any" ? M(Y)("um.match.anyJoin") : M(Y)("um.match.allJoin")), 1)) : W("", !0), H(vF, {
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
			V("label", SF, [
				H(M(qk)),
				U(A(M(Y)("um.addRule")) + " ", 1),
				V("select", {
					ref_key: "picker",
					ref: i,
					"aria-label": M(Y)("um.addRule"),
					onChange: l[1] ||= (e) => o(e.target.value)
				}, [l[2] ||= V("option", {
					value: "",
					disabled: "",
					selected: "",
					hidden: ""
				}, null, -1), (R(!0), z(L, null, I(r.value, (e) => (R(), z("optgroup", {
					key: e.label,
					label: e.label
				}, [(R(!0), z(L, null, I(e.subjects, (e) => (R(), z("option", {
					key: e.id,
					value: e.id
				}, A(e.label), 9, TF))), 128))], 8, wF))), 128))], 40, CF)
			])
		]));
	}
}), DF = { class: "um-entry-head" }, OF = { class: "um-var-label grow ellipsis" }, kF = {
	key: 0,
	class: "um-warn xs"
}, AF = ["placeholder"], jF = [
	"value",
	"placeholder",
	"onInput"
], MF = { class: "um-var-pair-head" }, NF = [
	"onUpdate:modelValue",
	"list",
	"placeholder",
	"onChange"
], PF = [
	"value",
	"placeholder",
	"onInput"
], FF = ["id"], IF = ["value"], LF = /* @__PURE__ */ F({
	__name: "VarUpdateEditor",
	props: {
		preset: {},
		update: {}
	},
	emits: ["remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => vf(n.preset, n.update.var)), a = G(() => i.value?.type !== n.update.type), o = G(() => i.value ? Pp(n.preset, "vars", i.value.id, "label", i.value.label ?? i.value.id) : n.update.var), s = G(() => i.value && Pp(n.preset, "vars", i.value.id, "description", i.value.description ?? "") || void 0), c = G(() => {
			let e = /* @__PURE__ */ new Map();
			for (let t of n.preset.modules) for (let r of t.vars ?? []) if (r.var === n.update.var && r.type === "dict") for (let t of r.items) t.value !== null && !e.has(t.key) && e.set(t.key, t.value);
			return e;
		}), l = G(() => `ap-bv-${n.update.var}`);
		function u(e) {
			e.key = e.key.trim();
			let t = c.value.get(e.key);
			t !== void 0 && !e.value && (e.value = t);
		}
		function d(e, t, r) {
			n.update.type === "list" && (n.update.items[e] = nf(t, r));
		}
		function f() {
			let e = n.update;
			e.type === "list" ? e.items.push("") : e.type === "dict" && e.items.push({
				key: "",
				value: ""
			});
		}
		return (t, n) => (R(), z("div", { class: k(["um-entry", {
			lost: a.value,
			off: !M($d)(e.update)
		}]) }, [
			V("div", DF, [
				H(JM, {
					"model-value": M($d)(e.update),
					label: M(Y)("panel.enabled"),
					"onUpdate:modelValue": n[0] ||= (t) => M(tf)(e.update, t)
				}, null, 8, ["model-value", "label"]),
				V("span", OF, A(o.value), 1),
				H(cj, {
					text: s.value,
					align: "end"
				}, null, 8, ["text"]),
				H(Q, {
					icon: M(xA),
					label: M(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: n[1] ||= (e) => r("remove")
				}, null, 8, ["icon", "label"])
			]),
			a.value ? (R(), z("div", kF, [H(M(pA)), U(A(M(Y)("um.bv.lost")), 1)])) : W("", !0),
			e.update.type === "string" ? P((R(), z("textarea", {
				key: 1,
				"onUpdate:modelValue": n[2] ||= (t) => e.update.text = t,
				class: "input um-text",
				rows: "3",
				spellcheck: "false",
				placeholder: M(Y)("um.bv.append")
			}, null, 8, AF)), [[as, e.update.text]]) : e.update.type === "list" ? (R(!0), z(L, { key: 2 }, I(e.update.items, (t, n) => (R(), z("div", {
				key: n,
				class: k(["um-var-row", { off: !M($d)(t) }])
			}, [
				H(JM, {
					"model-value": M($d)(t),
					label: M(Y)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => d(n, M(ef)(t), e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				V("textarea", {
					value: M(ef)(t),
					class: "input um-var-value",
					rows: "1",
					spellcheck: "false",
					placeholder: M(Y)("um.bv.item"),
					onInput: (e) => d(n, e.target.value, M($d)(t))
				}, null, 40, jF),
				H(Q, {
					icon: M(xA),
					label: M(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			], 2))), 128)) : (R(), z(L, { key: 3 }, [(R(!0), z(L, null, I(e.update.items, (t, n) => (R(), z("div", {
				key: n,
				class: k(["um-var-pair", { off: !M($d)(t) }])
			}, [V("div", MF, [
				H(JM, {
					"model-value": M($d)(t),
					label: M(Y)("panel.enabled"),
					small: "",
					"onUpdate:modelValue": (e) => M(tf)(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				]),
				P(V("input", {
					"onUpdate:modelValue": (e) => t.key = e,
					class: "input bare um-var-key",
					list: l.value,
					spellcheck: "false",
					placeholder: M(Y)("um.bv.key"),
					onChange: (e) => u(t)
				}, null, 40, NF), [[as, t.key]]),
				H(Q, {
					icon: M(xA),
					label: M(Y)("um.removeEntry"),
					small: "",
					align: "end",
					onClick: (t) => e.update.items.splice(n, 1)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])
			]), V("textarea", {
				value: t.value ?? "",
				class: "input um-var-value",
				rows: "1",
				spellcheck: "false",
				placeholder: c.value.has(t.key.trim()) ? M(Y)("um.bv.removes") : M(Y)("um.bv.value"),
				onInput: (e) => t.value = e.target.value
			}, null, 40, PF)], 2))), 128)), V("datalist", { id: l.value }, [(R(!0), z(L, null, I(c.value, ([e]) => (R(), z("option", {
				key: e,
				value: e
			}, null, 8, IF))), 128))], 8, FF)], 64)),
			e.update.type === "string" ? W("", !0) : (R(), z("button", {
				key: 4,
				type: "button",
				class: "btn ghost add um-var-add",
				onClick: f
			}, [H(M(qk)), U(A(e.update.type === "dict" ? M(Y)("um.bv.addKey") : M(Y)("um.bv.addItem")), 1)]))
		], 2));
	}
}), RF = { class: "um-editor" }, zF = { class: "um-head" }, BF = ["placeholder", "aria-label"], VF = { class: "um-entry-head" }, HF = ["onUpdate:modelValue", "aria-label"], UF = ["value"], WF = ["value"], GF = [
	"value",
	"aria-label",
	"onChange"
], KF = ["value"], qF = {
	key: 0,
	class: "um-warn xs"
}, JF = ["onUpdate:modelValue", "placeholder"], YF = {
	key: 1,
	class: "rule-error xs pre"
}, XF = {
	key: 0,
	class: "btn ghost add picker"
}, ZF = ["aria-label"], QF = ["value"], $F = { class: "um-foot" }, eI = ["title"], tI = ["title"], nI = ["title"], rI = /* @__PURE__ */ F({
	__name: "UserModuleEditor",
	props: {
		preset: {},
		module: {}
	},
	emits: ["close", "open"],
	setup(e, { emit: t }) {
		let n = e, r = t;
		gr(() => n.module, q, { deep: !0 });
		let i = /* @__PURE__ */ j(null);
		Jr(() => {
			n.module.entries.some((e) => e.text) || Xn(() => i.value?.select());
		});
		let a = G(() => n.preset.insertionPoints.map((e) => ({
			id: e.id,
			label: Pp(n.preset, "insertionPoints", e.id, "label", e.label),
			description: Pp(n.preset, "insertionPoints", e.id, "description", e.description ?? "") || void 0
		}))), o = (e) => a.value.find((t) => t.id === e.point), s = (e) => !gf(n.preset, e.point), c = [
			"",
			"system",
			"user",
			"assistant"
		];
		function l(e, t) {
			t ? e.role = t : delete e.role;
		}
		let u = (e) => cu(e.text).errors, d = (e) => u(e).map((e) => e.line ? Y("um.lineError", {
			line: e.line,
			message: e.message
		}) : e.message).join("\n");
		function f() {
			let e = new Set(n.module.entries.map((e) => e.point)), t = Qh(n.preset, n.module);
			t.point = n.preset.insertionPoints.find((t) => !e.has(t.id))?.id ?? t.point, n.module.entries.push(t);
		}
		let p = (e) => n.module.entries.splice(e, 1), m = G(() => n.preset.vars.map((e) => ({
			id: e.id,
			label: Pp(n.preset, "vars", e.id, "label", e.label ?? e.id)
		}))), h = G(() => m.value.filter((e) => !n.module.vars.some((t) => t.var === e.id))), g = /* @__PURE__ */ j(null);
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
		let v = /* @__PURE__ */ j(!1);
		function y() {
			v.value ? (ng(n.preset, n.module.id), r("close")) : (v.value = !0, setTimeout(() => v.value = !1, 3e3));
		}
		function b() {
			let e = tg(n.preset, n.module.id, (e) => Y("um.copyName", { name: e }));
			e && r("open", e.id);
		}
		let x = () => Lw(`${n.preset.id}.${zw(n.module.name)}.ap-modules.json`, ig(n.preset, [n.module.id]));
		return (t, n) => (R(), z("div", RF, [
			V("header", zF, [
				H(Q, {
					icon: M(IO),
					label: M(Y)("um.back"),
					align: "start",
					onClick: n[0] ||= (e) => r("close")
				}, null, 8, ["icon", "label"]),
				P(V("input", {
					ref_key: "nameInput",
					ref: i,
					"onUpdate:modelValue": n[1] ||= (t) => e.module.name = t,
					class: "input bare um-name grow",
					placeholder: M(Y)("um.untitled"),
					"aria-label": M(Y)("um.name")
				}, null, 8, BF), [[as, e.module.name]]),
				H(JM, {
					modelValue: e.module.enabled,
					"onUpdate:modelValue": n[2] ||= (t) => e.module.enabled = t,
					label: M(Y)("panel.enabled")
				}, null, 8, ["modelValue", "label"])
			]),
			H(dj, {
				title: M(Y)("um.content"),
				help: M(Y)("um.content.help")
			}, {
				default: N(() => [(R(!0), z(L, null, I(e.module.entries, (t, n) => (R(), z("div", {
					key: t.id,
					class: k(["um-entry", {
						lost: s(t),
						off: !M($d)(t)
					}])
				}, [
					V("div", VF, [
						H(JM, {
							"model-value": M($d)(t),
							label: M(Y)("panel.enabled"),
							"onUpdate:modelValue": (e) => M(tf)(t, e)
						}, null, 8, [
							"model-value",
							"label",
							"onUpdate:modelValue"
						]),
						P(V("select", {
							"onUpdate:modelValue": (e) => t.point = e,
							class: "input bare grow",
							"aria-label": M(Y)("um.point")
						}, [(R(!0), z(L, null, I(a.value, (e) => (R(), z("option", {
							key: e.id,
							value: e.id
						}, A(e.label), 9, UF))), 128)), s(t) ? (R(), z("option", {
							key: 0,
							value: t.point,
							disabled: ""
						}, A(M(Y)("um.pointMissing", { id: t.point })), 9, WF)) : W("", !0)], 8, HF), [[cs, t.point]]),
						H(cj, {
							text: o(t)?.description,
							align: "end"
						}, null, 8, ["text"]),
						V("select", {
							class: "input bare um-role",
							value: t.role ?? "",
							"aria-label": M(Y)("um.role"),
							onChange: (e) => l(t, e.target.value)
						}, [(R(), z(L, null, I(c, (e) => V("option", {
							key: e,
							value: e
						}, A(M(Y)(`um.role.${e || "merge"}`)), 9, KF)), 64))], 40, GF),
						e.module.entries.length > 1 || e.module.vars.length ? (R(), B(Q, {
							key: 0,
							icon: M(xA),
							label: M(Y)("um.removeEntry"),
							small: "",
							align: "end",
							onClick: (e) => p(n)
						}, null, 8, [
							"icon",
							"label",
							"onClick"
						])) : W("", !0)
					]),
					s(t) ? (R(), z("div", qF, [H(M(pA)), U(A(M(Y)("um.pointLost")), 1)])) : W("", !0),
					P(V("textarea", {
						"onUpdate:modelValue": (e) => t.text = e,
						class: "input um-text",
						rows: "4",
						spellcheck: "false",
						placeholder: M(Y)("um.text.placeholder")
					}, null, 8, JF), [[as, t.text]]),
					u(t).length ? (R(), z("div", YF, A(d(t)), 1)) : W("", !0)
				], 2))), 128)), a.value.length ? (R(), z("button", {
					key: 0,
					type: "button",
					class: "btn ghost add",
					onClick: f
				}, [H(M(qk)), U(A(M(Y)("um.addEntry")), 1)])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"]),
			m.value.length || e.module.vars.length ? (R(), B(dj, {
				key: 0,
				title: M(Y)("um.bv"),
				help: M(Y)("um.bv.help")
			}, {
				default: N(() => [(R(!0), z(L, null, I(e.module.vars, (t, n) => (R(), B(LF, {
					key: t.var,
					preset: e.preset,
					update: t,
					onRemove: (t) => e.module.vars.splice(n, 1)
				}, null, 8, [
					"preset",
					"update",
					"onRemove"
				]))), 128)), h.value.length ? (R(), z("label", XF, [
					H(M(qk)),
					U(A(M(Y)("um.bv.add")) + " ", 1),
					V("select", {
						ref_key: "varPicker",
						ref: g,
						"aria-label": M(Y)("um.bv.add"),
						onChange: n[3] ||= (e) => _(e.target.value)
					}, [n[5] ||= V("option", {
						value: "",
						disabled: "",
						selected: "",
						hidden: ""
					}, null, -1), (R(!0), z(L, null, I(h.value, (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, A(e.label), 9, QF))), 128))], 40, ZF)
				])) : W("", !0)]),
				_: 1
			}, 8, ["title", "help"])) : W("", !0),
			H(dj, {
				title: M(Y)("um.trigger"),
				help: M(Y)("um.trigger.help")
			}, {
				default: N(() => [H(EF, {
					modelValue: e.module.trigger,
					"onUpdate:modelValue": n[4] ||= (t) => e.module.trigger = t,
					preset: e.preset
				}, null, 8, ["modelValue", "preset"])]),
				_: 1
			}, 8, ["title", "help"]),
			V("footer", $F, [
				V("button", {
					type: "button",
					class: "btn ghost",
					title: M(Y)("um.export"),
					onClick: x
				}, [H(M(dk)), V("span", null, A(M(Y)("um.export")), 1)], 8, eI),
				V("button", {
					type: "button",
					class: "btn ghost",
					title: M(Y)("um.duplicate"),
					onClick: b
				}, [H(M(sk)), V("span", null, A(M(Y)("um.duplicate")), 1)], 8, tI),
				n[6] ||= V("span", { class: "grow" }, null, -1),
				V("button", {
					type: "button",
					class: k(["btn ghost danger", { armed: v.value }]),
					title: M(Y)("common.delete"),
					onClick: y
				}, [H(M(fA)), V("span", null, A(v.value ? M(Y)("um.confirmDelete") : M(Y)("common.delete")), 1)], 10, nI)
			])
		]));
	}
}), iI = {
	key: 0,
	class: "module-row"
}, aI = { class: "grow" }, oI = { class: "ellipsis" }, sI = ["aria-label"], cI = ["aria-checked", "onClick"], lI = { class: "grow" }, uI = { class: "grow" }, dI = { class: "ellipsis" }, fI = {
	key: 0,
	class: "empty"
}, pI = /* @__PURE__ */ F({
	__name: "ModulesTab",
	setup(e) {
		let { preset: t, config: n, update: r } = xN(), i = G(() => t.value && n.value ? ld(t.value, n.value) : {}), a = G(() => {
			let e = t.value;
			if (!e) return [];
			let n = e.modules.filter((e) => e.toggle === "user");
			return [...new Set(n.map((e) => e.group ?? ""))].filter((t) => (e.groups[t]?.tab ?? "modules") === "modules").map((t) => {
				let r = e.groups[t], i = n.filter((e) => (e.group ?? "") === t), a = [...new Set(i.filter((e) => e.exclusive).map((e) => e.exclusive))], o = i.filter((e) => !e.exclusive), s = a.length === 1 && !o.length, c = a.map((n) => {
					let r = sd(e, n), a = n === t && (!r || s);
					return {
						key: n,
						label: a ? void 0 : Pp(e, "groups", n, "label", e.groups[n]?.label ?? n),
						help: a || n === t ? void 0 : Pp(e, "groups", n, "description", e.groups[n]?.description ?? "") || void 0,
						optional: r,
						modules: i.filter((e) => e.exclusive === n)
					};
				});
				return {
					id: t,
					order: r?.order ?? 999,
					label: t ? Pp(e, "groups", t, "label", r?.label ?? t) : Y("modules.other"),
					help: t && Pp(e, "groups", t, "description", r?.description ?? "") || void 0,
					header: c.find((e) => !e.label && e.optional),
					sets: c,
					toggles: o
				};
			}).sort((e, t) => e.order - t.order);
		}), o = (e) => Pp(t.value, "modules", e.id, "name", e.name), s = (e) => Pp(t.value, "modules", e.id, "description", e.description ?? "") || void 0, c = (e) => e.modules.find((e) => i.value[e.id])?.id ?? null;
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
		let h = /* @__PURE__ */ j(null), g = /* @__PURE__ */ j(null), _ = G(() => t.value && h.value ? Yh(t.value).find((e) => e.id === h.value) : void 0), v = 0, y = () => g.value?.closest(".panel-body");
		function b(e) {
			h.value || (v = y()?.scrollTop ?? 0), h.value = e, Xn(() => y()?.scrollTo({ top: 0 }));
		}
		function x() {
			h.value = null, Xn(() => y()?.scrollTo({ top: v }));
		}
		return gr(() => t.value?.id, () => {
			h.value = null;
		}), (e, r) => !M(t) || !M(n) ? (R(), B(CN, { key: 0 })) : _.value ? (R(), z("div", {
			key: 1,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [(R(), B(rI, {
			key: _.value.id,
			preset: M(t),
			module: _.value,
			onClose: x,
			onOpen: b
		}, null, 8, ["preset", "module"]))], 512)) : (R(), z("div", {
			key: 2,
			ref_key: "root",
			ref: g,
			class: "col tab-col"
		}, [
			H(FP, {
				preset: M(t),
				onOpen: b
			}, null, 8, ["preset"]),
			(R(!0), z(L, null, I(a.value, (e) => (R(), B(dj, {
				key: e.id,
				title: e.label,
				help: e.help
			}, ni({
				default: N(() => [(R(!0), z(L, null, I(e.sets, (t) => (R(), z(L, { key: t.key }, [t.label ? (R(), z("div", iI, [V("span", aI, [V("span", oI, A(t.label), 1), H(cj, {
					text: t.help,
					align: "start"
				}, null, 8, ["text"])]), t.optional ? (R(), B(JM, {
					key: 0,
					"model-value": c(t) !== null,
					label: t.label,
					"onUpdate:modelValue": (e) => m(t, e)
				}, null, 8, [
					"model-value",
					"label",
					"onUpdate:modelValue"
				])) : W("", !0)])) : W("", !0), !t.optional || c(t) ? (R(), z("div", {
					key: 1,
					class: k(["choice-list", { nested: t.label }]),
					role: "radiogroup",
					"aria-label": t.label ?? e.label
				}, [(R(!0), z(L, null, I(t.modules, (e) => (R(), z("button", {
					key: e.id,
					type: "button",
					role: "radio",
					class: k(["choice", { on: c(t) === e.id }]),
					"aria-checked": c(t) === e.id,
					onClick: (n) => p(t, e.id)
				}, [
					r[0] ||= V("span", { class: "radio" }, null, -1),
					V("span", lI, A(o(e)), 1),
					H(cj, {
						text: s(e),
						align: "end"
					}, null, 8, ["text"])
				], 10, cI))), 128))], 10, sI)) : W("", !0)], 64))), 128)), (R(!0), z(L, null, I(e.toggles, (e) => (R(), z("div", {
					key: e.id,
					class: "module-row"
				}, [V("span", uI, [V("span", dI, A(o(e)), 1), H(cj, {
					text: s(e),
					align: "start"
				}, null, 8, ["text"])]), H(JM, {
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
				fn: N(() => [H(JM, {
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
			a.value.length ? W("", !0) : (R(), z("div", fI, A(M(Y)("modules.none")), 1))
		], 512));
	}
}), mI = ["value", "onChange"], hI = ["value"], gI = {
	key: 2,
	class: "unit"
}, _I = [
	"min",
	"max",
	"value",
	"placeholder",
	"onChange"
], vI = {
	key: 0,
	class: "small muted"
}, yI = [
	"list",
	"value",
	"placeholder",
	"onChange"
], bI = ["id"], xI = ["value"], SI = /* @__PURE__ */ F({
	__name: "WritingTab",
	setup(e) {
		let { preset: t, config: n, update: r } = xN(), i = G(() => {
			let e = t.value;
			return e ? [...new Set(e.params.map((e) => e.group ?? ""))].map((t) => ({
				id: t,
				order: e.groups[t]?.order ?? 999,
				label: t ? Pp(e, "groups", t, "label", e.groups[t]?.label ?? t) : Y("writing.params"),
				help: t && Pp(e, "groups", t, "description", e.groups[t]?.description ?? "") || void 0,
				params: e.params.filter((e) => (e.group ?? "") === t)
			})).sort((e, t) => e.order - t.order) : [];
		}), a = (e) => Pp(t.value, "params", e.id, "label", e.label), o = (e) => Pp(t.value, "params", e.id, "description", e.description ?? "") || void 0, s = (e, n, r) => Np(t.value)?.params?.[e.id]?.options?.[String(n)] ?? r ?? String(n), c = (e) => Au(e, n.value?.params[e.id]), l = (e, t) => r((n) => {
			n.params[e.id] = e.type === "number" ? Number(t) || 0 : t;
		}), u = (e) => c(e), d = (e, t) => r((n) => {
			n.params[e.id] = [...t];
		}), f = (e) => `ap-param-${e.id}`;
		return (e, r) => !M(t) || !M(n) ? (R(), B(CN, { key: 0 })) : (R(!0), z(L, { key: 1 }, I(i.value, (e) => (R(), B(dj, {
			key: e.id,
			title: e.label,
			help: e.help,
			icon: M(aA)
		}, {
			default: N(() => [(R(!0), z(L, null, I(e.params, (e) => (R(), B($, {
				key: e.id,
				label: a(e),
				help: o(e)
			}, {
				default: N(() => [e.type === "select" ? (R(), z("select", {
					key: 0,
					class: "input",
					value: c(e),
					onChange: (t) => l(e, t.target.value)
				}, [(R(!0), z(L, null, I(e.options, (t) => (R(), z("option", {
					key: String(t.value),
					value: t.value
				}, A(s(e, t.value, t.label)), 9, hI))), 128))], 40, mI)) : e.type === "list" ? (R(), B(zP, {
					key: 1,
					literal: "",
					"model-value": u(e),
					"remove-label": M(Y)("common.delete"),
					placeholder: M(Y)("writing.listPlaceholder"),
					"onUpdate:modelValue": (t) => d(e, t)
				}, null, 8, [
					"model-value",
					"remove-label",
					"placeholder",
					"onUpdate:modelValue"
				])) : e.type === "number" ? (R(), z("div", gI, [V("input", {
					class: "input",
					type: "number",
					min: e.min,
					max: e.max,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, _I), e.unit ? (R(), z("span", vI, A(e.unit), 1)) : W("", !0)])) : (R(), z(L, { key: 3 }, [V("input", {
					class: "input",
					list: e.options?.length ? f(e) : void 0,
					value: c(e),
					placeholder: e.unset,
					onChange: (t) => l(e, t.target.value)
				}, null, 40, yI), e.options?.length ? (R(), z("datalist", {
					key: 0,
					id: f(e)
				}, [(R(!0), z(L, null, I(e.options, (t) => (R(), z("option", {
					key: String(t.value),
					value: t.value
				}, A(s(e, t.value, t.label)), 9, xI))), 128))], 8, bI)) : W("", !0)], 64))]),
				_: 2
			}, 1032, ["label", "help"]))), 128))]),
			_: 2
		}, 1032, [
			"title",
			"help",
			"icon"
		]))), 128));
	}
}), CI = { class: "kv" }, wI = {
	key: 0,
	class: "kv-row"
}, TI = { class: "kv-key ellipsis" }, EI = { class: "kv-value pre small" }, DI = {
	key: 0,
	class: "kv-actions"
}, OI = {
	key: 1,
	class: "kv-edit col"
}, kI = ["placeholder"], AI = ["placeholder"], jI = { class: "row end" }, MI = {
	key: 0,
	class: "kv-edit col"
}, NI = ["placeholder"], PI = ["placeholder"], FI = { class: "row end" }, II = {
	key: 1,
	class: "faint small kv-empty"
}, LI = /* @__PURE__ */ F({
	__name: "KvEditor",
	props: {
		entries: {},
		readonly: { type: Boolean },
		keyPlaceholder: {},
		valuePlaceholder: {}
	},
	emits: ["set", "remove"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(null), a = /* @__PURE__ */ j(""), o = /* @__PURE__ */ j("");
		function s(e) {
			i.value = e ?? "", a.value = e ?? "", o.value = e ? n.entries[e] ?? "" : "";
		}
		function c() {
			let e = a.value.trim();
			e && (i.value && i.value !== e && r("remove", i.value), r("set", e, o.value), i.value = null);
		}
		return (t, n) => (R(), z("div", CI, [
			(R(!0), z(L, null, I(e.entries, (t, l) => (R(), z(L, { key: l }, [i.value === l ? (R(), z("div", OI, [
				P(V("input", {
					"onUpdate:modelValue": n[0] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? M(Y)("memory.key")
				}, null, 8, kI), [[as, a.value]]),
				P(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? M(Y)("memory.content")
				}, null, 8, AI), [[as, o.value]]),
				V("div", jI, [H(Q, {
					icon: M(xA),
					label: M(Y)("common.cancel"),
					onClick: n[2] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: M(WO),
					label: M(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : (R(), z("div", wI, [
				V("div", TI, A(l), 1),
				V("div", EI, A(t), 1),
				e.readonly ? W("", !0) : (R(), z("div", DI, [H(Q, {
					icon: M(Gk),
					label: M(Y)("common.edit"),
					small: "",
					align: "end",
					onClick: (e) => s(String(l))
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				]), H(Q, {
					icon: M(fA),
					label: M(Y)("common.delete"),
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
			i.value === "" ? (R(), z("div", MI, [
				P(V("input", {
					"onUpdate:modelValue": n[3] ||= (e) => a.value = e,
					class: "input",
					placeholder: e.keyPlaceholder ?? M(Y)("memory.key")
				}, null, 8, NI), [[as, a.value]]),
				P(V("textarea", {
					"onUpdate:modelValue": n[4] ||= (e) => o.value = e,
					class: "input",
					rows: "3",
					placeholder: e.valuePlaceholder ?? M(Y)("memory.content")
				}, null, 8, PI), [[as, o.value]]),
				V("div", FI, [H(Q, {
					icon: M(xA),
					label: M(Y)("common.cancel"),
					onClick: n[5] ||= (e) => i.value = null
				}, null, 8, ["icon", "label"]), H(Q, {
					icon: M(WO),
					label: M(Y)("common.save"),
					active: "",
					onClick: c
				}, null, 8, ["icon", "label"])])
			])) : W("", !0),
			!Object.keys(e.entries).length && i.value === null ? (R(), z("div", II, A(M(Y)("memory.empty")), 1)) : W("", !0),
			!e.readonly && i.value === null ? (R(), z("button", {
				key: 2,
				type: "button",
				class: "btn ghost add",
				onClick: n[6] ||= (e) => s(null)
			}, [H(M(qk)), U(A(M(Y)("common.add")), 1)])) : W("", !0)
		]));
	}
}), RI = {
	key: 1,
	class: "faint small"
}, zI = {
	key: 0,
	class: "badge neutral"
}, BI = ["placeholder"], VI = {
	key: 1,
	class: "faint small"
}, HI = /* @__PURE__ */ F({
	__name: "MemoryTab",
	setup(t) {
		let { preset: n } = xN(), r = G(() => n.value ? Nm(n.value) : null), i = G(() => (X.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), a = () => qD.value ? M_() : void 0, o = G(() => (X.chatRev, i.value ? bm(Infinity, a()) : {})), s = G(() => r.value ? Cm(r.value) : {}), c = G(() => (X.chatRev, i.value ? xm(Infinity, a()) : null));
		async function l(e, t) {
			await Sm({
				type: "memory.replace",
				key: e,
				content: t,
				source: "user"
			}), sS();
		}
		async function u(e) {
			await Sm({
				type: "memory.delete",
				key: e,
				source: "user"
			}), sS();
		}
		let d = (e, t) => r.value && wm(r.value, "replace", e, t, "user"), f = (e) => r.value && wm(r.value, "delete", e, void 0, "user"), p = /* @__PURE__ */ j("");
		gr(c, (e) => {
			p.value = e?.text ?? "";
		}, { immediate: !0 });
		let m = G(() => p.value !== (c.value?.text ?? ""));
		async function h() {
			await Sm({
				type: "recap.set",
				text: p.value,
				coversUpTo: c.value?.coversUpTo ?? e().chat.length - 1,
				source: "user"
			}), sS();
		}
		return (e, t) => !M(n) || !r.value ? (R(), B(CN, { key: 0 })) : (R(), z(L, { key: 1 }, [
			H(dj, {
				title: M(Y)("memory.chat"),
				icon: M(Fk),
				help: M(Y)("memory.chat.hint")
			}, {
				default: N(() => [i.value ? (R(), B(LI, {
					key: 0,
					entries: o.value,
					onSet: l,
					onRemove: u
				}, null, 8, ["entries"])) : (R(), z("div", RI, A(M(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dj, {
				title: M(Y)("memory.global"),
				icon: M(Ck),
				help: M(Y)("memory.global.hint")
			}, {
				actions: N(() => [H(Q, {
					icon: M(mA),
					label: M(Y)("common.undo"),
					small: "",
					align: "end",
					disabled: !M(Tm)(r.value),
					onClick: t[0] ||= (e) => M(Dm)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				]), H(Q, {
					icon: M(Yk),
					label: M(Y)("common.redo"),
					small: "",
					align: "end",
					disabled: !M(Em)(r.value),
					onClick: t[1] ||= (e) => M(Om)(r.value)
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])]),
				default: N(() => [H(LI, {
					entries: s.value,
					onSet: d,
					onRemove: f
				}, null, 8, ["entries"])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dj, {
				title: M(Y)("memory.recap"),
				icon: M(eA),
				help: M(Y)("memory.recap.hint")
			}, {
				actions: N(() => [c.value ? (R(), z("span", zI, "#0–" + A(c.value.coversUpTo), 1)) : W("", !0), i.value ? (R(), B(Q, {
					key: 1,
					icon: M(WO),
					label: M(Y)("common.save"),
					small: "",
					align: "end",
					disabled: !m.value,
					active: "",
					onClick: h
				}, null, 8, [
					"icon",
					"label",
					"disabled"
				])) : W("", !0)]),
				default: N(() => [i.value ? P((R(), z("textarea", {
					key: 0,
					"onUpdate:modelValue": t[2] ||= (e) => p.value = e,
					class: "input",
					rows: "6",
					placeholder: M(Y)("memory.recap.empty")
				}, null, 8, BI)), [[as, p.value]]) : (R(), z("div", VI, A(M(Y)("memory.noChat")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])
		], 64));
	}
}), UI = /img:[A-Za-z0-9-]+/g, WI = 6e5;
async function GI(t, n) {
	let r = await S(t, {
		method: "POST",
		headers: e().getRequestHeaders(),
		body: JSON.stringify(n)
	});
	if (!r.ok) throw Error(`${t}: HTTP ${r.status}`);
	return r.text();
}
var KI = (e, t) => {
	for (let n of e.matchAll(UI)) t.add(n[0]);
};
function qI(e, t) {
	let n = JSON.parse(e);
	if (!Array.isArray(n)) throw Error(`${t}: unreadable chat`);
	return e;
}
async function JI(t) {
	let n = /* @__PURE__ */ new Set();
	KI(JSON.stringify(e().chat ?? []), n);
	let r = [], i = JSON.parse(await GI("/api/characters/all", {}));
	for (let e of i) {
		if (!e.avatar) continue;
		let t = JSON.parse(await GI("/api/characters/chats", {
			avatar_url: e.avatar,
			simple: !0
		}));
		if (Array.isArray(t)) for (let i of t) {
			let t = String(i.file_name ?? "").replace(/\.jsonl$/, "");
			t && r.push(async () => KI(qI(await GI("/api/chats/get", {
				ch_name: e.name,
				file_name: t,
				avatar_url: e.avatar
			}), t), n));
		}
	}
	let a = JSON.parse(await GI("/api/groups/all", {}));
	for (let e of a) for (let t of e.chats ?? []) r.push(async () => KI(qI(await GI("/api/chats/group/get", { id: t }), t), n));
	let o = 0;
	t?.({
		done: o,
		total: r.length
	});
	for (let e of r) await e(), t?.({
		done: ++o,
		total: r.length
	});
	return n;
}
async function YI(e) {
	let t = await JI(e), n = (await px("img:")).length, r = await mx("img:", t, WI);
	return {
		removed: r,
		kept: n - r
	};
}
//#endregion
//#region src/ui/panel/tabs/DebugTab.vue?vue&type=script&setup=true&lang.ts
var XI = { class: "row tight xs muted" }, ZI = { class: "row" }, QI = {
	key: 0,
	class: "xs text-danger"
}, $I = { class: "row wrap xs muted" }, eL = { class: "badge neutral" }, tL = {
	key: 0,
	class: "badge neutral"
}, nL = { class: "badge neutral" }, rL = {
	key: 1,
	class: "badge warn"
}, iL = ["title"], aL = ["title"], oL = {
	key: 0,
	class: "row wrap xs muted"
}, sL = { class: "grow" }, cL = { key: 0 }, lL = ["onClick"], uL = { class: "grow mono" }, dL = { class: "xs muted" }, fL = { class: "row xs muted" }, pL = { class: "badge neutral" }, mL = { class: "pre mono scroll" }, hL = {
	key: 0,
	class: "xs faint region-msg"
}, gL = { key: 1 }, _L = ["onClick"], vL = { class: "grow mono" }, yL = { class: "xs muted" }, bL = {
	key: 0,
	class: "region-msg"
}, xL = { class: "pre mono scroll" }, SL = {
	key: 0,
	class: "xs faint"
}, CL = {
	key: 2,
	class: "xs text-warning"
}, wL = {
	key: 1,
	class: "faint small"
}, TL = ["onClick"], EL = { class: "mono grow ellipsis" }, DL = {
	key: 0,
	class: "badge warn"
}, OL = { class: "xs muted" }, kL = { class: "xs muted" }, AL = { class: "row xs muted" }, jL = { class: "grow" }, ML = { class: "mono scroll" }, NL = { class: "row xs muted" }, PL = { class: "grow" }, FL = { class: "mono scroll" }, IL = {
	key: 0,
	class: "faint small"
}, LL = { class: "row xs" }, RL = { class: "badge neutral" }, zL = { class: "muted" }, BL = { class: "mono scroll" }, VL = {
	key: 0,
	class: "faint small"
}, HL = { class: "row" }, UL = ["disabled"], WL = {
	key: 0,
	class: "xs muted"
}, GL = {
	key: 1,
	class: "xs muted"
}, KL = {
	key: 2,
	class: "xs text-danger"
}, qL = { class: "row xs" }, JL = { class: "badge neutral" }, YL = {
	key: 0,
	class: "badge neutral"
}, XL = { class: "grow muted" }, ZL = { class: "small" }, QL = {
	key: 0,
	class: "faint small"
}, $L = { class: "xs faint mono build" }, eR = /* @__PURE__ */ F({
	__name: "DebugTab",
	setup(t) {
		let n = G(() => sg.log.find((e) => e.kind === "assembly")?.data), r = G(() => sg.log.find((e) => e.kind === "assembly" && e.data.cache)?.data?.cache ?? void 0), i = /* @__PURE__ */ fn(/* @__PURE__ */ new Set()), a = (e) => i.has(e) ? i.delete(e) : i.add(e), o = /* @__PURE__ */ fn({});
		gr(n, async (t) => {
			if (t) for (let n of t.regions) {
				let r = n.messages.map((e) => e.content).join("\n"), i = `${t.genId}:${n.id}`;
				if (o[i] === void 0 && r) try {
					o[i] = await e().getTokenCountAsync(r);
				} catch {}
			}
		}, { immediate: !0 });
		let s = /* @__PURE__ */ j(null), c = (e) => typeof e == "string" ? l(e) : JSON.stringify(e, null, 2);
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
		].filter(Boolean).join(" · "), m = G({
			get: () => K().dev.enabled,
			set: (e) => {
				K().dev.enabled = e, q();
			}
		}), h = G({
			get: () => K().dev.url,
			set: (e) => {
				K().dev.url = e.trim(), q();
			}
		}), g = G(() => sg.log.filter((e) => e.kind !== "assembly")), _ = G(() => {
			X.chatRev;
			let t = [], n = e().chat ?? [];
			for (let e = 0; e < n.length; e++) {
				for (let n of zS(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.comment
				});
				for (let n of GS(e)) n.orphan && t.push({
					mesId: e,
					quote: n.quote,
					comment: n.character,
					speech: !0
				});
			}
			return t;
		}), b = G(() => !!(lS.value?.image || Zb().image.connections.length)), x = /* @__PURE__ */ j({ running: !1 });
		async function S() {
			if (!x.value.running && await y(`<p>${v(Y("debug.images.confirm"))}</p>`, Y("common.delete"), Y("common.cancel"))) {
				x.value = { running: !0 };
				try {
					let e = await YI((e) => {
						x.value = {
							running: !0,
							progress: e
						};
					});
					x.value = {
						running: !1,
						result: Y("debug.images.done", {
							removed: e.removed,
							kept: e.kept
						})
					};
				} catch (e) {
					x.value = {
						running: !1,
						error: Y("debug.images.failed", { error: e instanceof Error ? e.message : String(e) })
					};
				}
			}
		}
		return (e, t) => (R(), z(L, null, [
			H(dj, {
				title: M(Y)("debug.dev"),
				icon: M(nA),
				help: M(Y)("debug.dev.hint")
			}, {
				actions: N(() => [V("span", XI, [V("span", { class: k(["dot status-dot", M(Jw).status]) }, null, 2), U(A(M(Y)(`debug.dev.${M(Jw).status}`)), 1)])]),
				default: N(() => [H($, { label: M(Y)("debug.dev.url") }, {
					default: N(() => [V("div", ZI, [P(V("input", {
						"onUpdate:modelValue": t[0] ||= (e) => h.value = e,
						class: "input grow",
						type: "url",
						placeholder: "http://localhost:4747"
					}, null, 512), [[
						as,
						h.value,
						void 0,
						{ lazy: !0 }
					]]), H(JM, {
						modelValue: m.value,
						"onUpdate:modelValue": t[1] ||= (e) => m.value = e,
						label: M(Y)("debug.dev")
					}, null, 8, ["modelValue", "label"])])]),
					_: 1
				}, 8, ["label"]), M(Jw).error ? (R(), z("span", QI, A(M(Jw).error), 1)) : W("", !0)]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			H(dj, {
				title: M(Y)("debug.assembly"),
				icon: M(yk),
				collapsible: ""
			}, {
				default: N(() => [n.value ? (R(), z(L, { key: 0 }, [
					V("div", $I, [
						V("span", eL, A(M(Y)(`transport.${n.value.transport}`)), 1),
						n.value.workflow ? (R(), z("span", tL, A(n.value.workflow), 1)) : W("", !0),
						V("span", nL, A(n.value.origin), 1),
						n.value.dryRun ? (R(), z("span", rL, "dry run")) : W("", !0),
						n.value.input ? (R(), z("span", {
							key: 2,
							class: "badge neutral",
							title: n.value.input.shaped ? `${n.value.input.chars} ch` : void 0
						}, A(M(Y)(n.value.input.shaped ? `debug.input.${n.value.input.mode}` : "debug.input.none")), 9, iL)) : W("", !0),
						n.value.storyline ? (R(), z("span", {
							key: 3,
							class: "badge neutral",
							title: n.value.storyline.groups.join(" → ") + (n.value.storyline.hidden ? ` · −${n.value.storyline.hidden}` : "")
						}, A(n.value.storyline.main ? M(Y)("storylines.main") : n.value.storyline.name) + A(n.value.storyline.if ? " · if" : "") + A(n.value.storyline.new ? " · new" : "") + A(n.value.storyline.frozen ? " · frozen" : ""), 9, aL)) : W("", !0),
						t[3] ||= V("span", { class: "grow" }, null, -1),
						U(A(u(n.value.at)), 1)
					]),
					r.value ? (R(), z("div", oL, [
						V("span", { class: k(["badge", r.value.reason ? "warn" : "neutral"]) }, A(r.value.reason ? M(Y)(`debug.cache.flush.${r.value.reason}`) : M(Y)("debug.cache.kept")), 3),
						V("span", sL, A(p(r.value)), 1),
						r.value === n.value.cache ? W("", !0) : (R(), z("span", cL, A(u(r.value.at)), 1))
					])) : W("", !0),
					V("div", null, [(R(!0), z(L, null, I(n.value.regions, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(e.id)
					}, [
						H(M(qO), { class: k(["faint caret", { open: i.has(e.id) }]) }, null, 8, ["class"]),
						V("span", uL, A(e.id), 1),
						V("span", dL, A(e.messages.length) + " · " + A(o[`${n.value.genId}:${e.id}`] ?? e.messages.reduce((e, t) => e + t.chars, 0)) + A(o[`${n.value.genId}:${e.id}`] === void 0 ? " ch" : " tok"), 1)
					], 8, lL), i.has(e.id) ? (R(), z(L, { key: 0 }, [(R(!0), z(L, null, I(e.messages, (e, t) => (R(), z("div", {
						key: t,
						class: "region-msg"
					}, [V("div", fL, [V("span", pL, A(e.role), 1), U(A(e.chars) + " ch", 1)]), V("div", mL, A(e.content), 1)]))), 128)), e.messages.length ? W("", !0) : (R(), z("div", hL, A(M(Y)("debug.emptyRegion")), 1))], 64)) : W("", !0)]))), 128))]),
					n.value.vars?.length ? (R(), z("div", gL, [(R(!0), z(L, null, I(n.value.vars, (e) => (R(), z("div", {
						key: e.id,
						class: "region"
					}, [V("div", {
						class: "region-head",
						onClick: (t) => a(`var:${e.id}`)
					}, [
						H(M(qO), { class: k(["faint caret", { open: i.has(`var:${e.id}`) }]) }, null, 8, ["class"]),
						V("span", vL, A(e.id), 1),
						V("span", yL, A(e.text.length) + " ch", 1)
					], 8, _L), i.has(`var:${e.id}`) ? (R(), z("div", bL, [V("div", xL, A(e.text), 1), e.text ? W("", !0) : (R(), z("div", SL, A(M(Y)("debug.emptyRegion")), 1))])) : W("", !0)]))), 128))])) : W("", !0),
					n.value.warnings.length ? (R(), z("div", CL, A(n.value.warnings.join(" · ")), 1)) : W("", !0)
				], 64)) : (R(), z("div", wL, A(M(Y)("debug.noAssembly")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dj, {
				title: M(Y)("debug.requests"),
				icon: M(ak),
				collapsible: ""
			}, {
				default: N(() => [(R(!0), z(L, null, I(M(sg).requests, (e, t) => (R(), z("div", {
					key: `${e.genId}:${e.step}:${e.at}`,
					class: "req"
				}, [V("div", {
					class: "row small clickable",
					onClick: (e) => s.value = s.value === t ? null : t
				}, [
					V("span", EL, A(e.genId) + " · #" + A(e.step), 1),
					e.error ? (R(), z("span", DL, A(M(Y)("debug.error")), 1)) : W("", !0),
					V("span", OL, A(f(e.usage)), 1),
					V("span", kL, A(e.durationMs === void 0 ? "…" : `${(e.durationMs / 1e3).toFixed(1)}s`), 1)
				], 8, TL), s.value === t ? (R(), z(L, { key: 0 }, [
					V("div", AL, [V("span", jL, A(M(Y)("debug.request")), 1), H(Q, {
						icon: M(ck),
						label: M(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.request)
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", ML, A(c(e.request)), 1),
					V("div", NL, [V("span", PL, A(M(Y)("debug.response")), 1), H(Q, {
						icon: M(ck),
						label: M(Y)("common.copy"),
						small: "",
						align: "end",
						onClick: (t) => d(e.response ?? e.error ?? "")
					}, null, 8, [
						"icon",
						"label",
						"onClick"
					])]),
					V("pre", FL, A(e.error ?? c(e.response ?? "")), 1)
				], 64)) : W("", !0)]))), 128)), M(sg).requests.length ? W("", !0) : (R(), z("div", IL, A(M(Y)("debug.noRequests")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			H(dj, {
				title: M(Y)("debug.log"),
				icon: M(eA),
				collapsible: "",
				open: !1
			}, {
				actions: N(() => [H(Q, {
					icon: M(fA),
					label: M(Y)("common.clear"),
					small: "",
					align: "end",
					onClick: t[2] ||= (e) => M(sg).log.splice(0)
				}, null, 8, ["icon", "label"])]),
				default: N(() => [(R(!0), z(L, null, I(g.value, (e, n) => (R(), z("div", {
					key: n,
					class: "req"
				}, [V("div", LL, [
					V("span", RL, A(e.kind), 1),
					t[4] ||= V("span", { class: "grow" }, null, -1),
					V("span", zL, A(u(e.at)), 1)
				]), V("pre", BL, A(c(e.data)), 1)]))), 128)), g.value.length ? W("", !0) : (R(), z("div", VL, A(M(Y)("debug.noLog")), 1))]),
				_: 1
			}, 8, ["title", "icon"]),
			b.value ? (R(), B(dj, {
				key: 0,
				title: M(Y)("debug.images"),
				icon: M(Tk),
				help: M(Y)("debug.images.hint"),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [V("div", HL, [V("button", {
					type: "button",
					class: "btn",
					disabled: x.value.running,
					onClick: S
				}, [H(M(fA)), U(A(M(Y)("debug.images.clean")), 1)], 8, UL), x.value.running ? (R(), z("span", WL, A(x.value.progress ? M(Y)("debug.images.scanning", {
					done: x.value.progress.done,
					total: x.value.progress.total
				}) : "…"), 1)) : x.value.result ? (R(), z("span", GL, A(x.value.result), 1)) : x.value.error ? (R(), z("span", KL, A(x.value.error), 1)) : W("", !0)])]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			])) : W("", !0),
			H(dj, {
				title: M(Y)("debug.annotations"),
				icon: M(Ik),
				help: M(Y)("debug.annotations.hint"),
				collapsible: "",
				open: !1
			}, {
				default: N(() => [(R(!0), z(L, null, I(_.value, (e, t) => (R(), z("div", {
					key: t,
					class: "req"
				}, [V("div", qL, [
					V("span", JL, "#" + A(e.mesId), 1),
					e.speech ? (R(), z("span", YL, A(M(Y)("debug.orphanSpeech")), 1)) : W("", !0),
					V("span", XL, "“" + A(e.quote) + "”", 1)
				]), V("div", ZL, A(e.comment), 1)]))), 128)), _.value.length ? W("", !0) : (R(), z("div", QL, A(M(Y)("debug.noOrphans")), 1))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"help"
			]),
			V("div", $L, "Advanced Preset " + A(M("1.12.0")) + " · " + A(M("2d6e0f3a54c3de27")), 1)
		], 64));
	}
}), tR = {
	key: 1,
	class: "empty"
}, nR = { class: "row storylines-head" }, rR = { class: "xs muted grow" }, iR = ["aria-expanded", "onClick"], aR = { class: "card-title grow ellipsis" }, oR = ["title", "aria-label"], sR = {
	key: 1,
	class: "badge warn"
}, cR = { class: "xs faint" }, lR = {
	key: 0,
	class: "card-body col"
}, uR = ["aria-label"], dR = {
	key: 1,
	class: "faint small"
}, fR = {
	key: 2,
	class: "storyline-floors"
}, pR = ["title", "onClick"], mR = { class: "badge neutral mono" }, hR = { class: "xs muted" }, gR = { class: "grow ellipsis" }, _R = /* @__PURE__ */ F({
	__name: "StorylinesTab",
	setup(t) {
		let { preset: n } = xN(), r = G(() => (X.chatRev, !(!e().chatMetadata || e().characterId === void 0 && !e().groupId))), i = G(() => Object.values(n.value?.structures ?? {}).find((e) => e.kind === "synopsis")?.id), a = G(() => r.value && n.value?.storylines ? $D(i.value) : []), o = /* @__PURE__ */ j(/* @__PURE__ */ new Set()), s = (e) => {
			let t = new Set(o.value);
			t.has(e) ? t.delete(e) : t.add(e), o.value = t;
		};
		gr(() => X.storylineFocus, (e) => {
			e !== null && (o.value = /* @__PURE__ */ new Set([...o.value, e]), X.storylineFocus = null);
		}, { immediate: !0 });
		let c = (e) => e.main ? e.name ? Y("storylines.mainNamed", { name: e.name }) : Y("storylines.main") : e.name || Y("storylines.unnamed"), l = () => {
			sS(), hO();
		};
		async function u(e) {
			await F_(e.key, !e.if), l();
		}
		async function d(e) {
			await R_(e.key, !e.hidden), l();
		}
		async function f(e) {
			await Rb(e.key) && l();
		}
		async function p(e) {
			let t = await b(`<h3>${v(e.main && !e.name ? Y("storylines.nameMain") : Y("storylines.renameTitle", { name: c(e) }))}</h3>${e.main ? `<p>${v(Y("storylines.nameMain.hint"))}</p>` : ""}`, e.name, Y("common.save"), Y("common.cancel"));
			if (t === null) return;
			let n = t.trim();
			if (!Xu(n)) return x("warning", Y("storylines.invalidName"), Y("app.name"));
			let r = await L_(e.key, n);
			if (r === "taken") return x("warning", Y("storylines.nameTaken", { name: n }), Y("app.name"));
			if (r === "invalid") return x("warning", Y("storylines.invalidName"), Y("app.name"));
			r !== "unchanged" && (!e.main && o.value.has(e.key) && (o.value = new Set([...o.value].map((t) => t === e.key ? n : t))), l());
		}
		return (e, t) => M(n) ? r.value ? (R(), z(L, { key: 2 }, [V("div", nR, [V("span", rR, A(M(Y)("storylines.count", { n: a.value.length })), 1), H(cj, {
			text: M(Y)("storylines.help"),
			align: "end"
		}, null, 8, ["text"])]), (R(!0), z(L, null, I(a.value, (e) => (R(), z("section", {
			key: e.key,
			class: k(["card storyline-card", {
				current: e.current,
				hidden: e.hidden
			}])
		}, [V("header", {
			class: "card-head clickable",
			"aria-expanded": o.value.has(e.key),
			onClick: (t) => s(e.key)
		}, [
			(R(), B($r(e.main ? M(lk) : e.if ? M(cA) : M(xk)), {
				class: "section-icon",
				"aria-hidden": "true"
			})),
			V("span", aR, A(c(e)), 1),
			e.current ? (R(), z("span", {
				key: 0,
				class: "storyline-dot",
				title: M(Y)("storylines.current"),
				"aria-label": M(Y)("storylines.current")
			}, null, 8, oR)) : W("", !0),
			e.if ? (R(), z("span", sR, "if")) : W("", !0),
			e.hidden ? (R(), B(M(pk), {
				key: 2,
				class: "storyline-flag",
				"aria-label": M(Y)("storylines.hidden")
			}, null, 8, ["aria-label"])) : W("", !0),
			V("span", cR, A(M(Y)("storylines.floors", { n: e.floors.length })), 1),
			H(M(GO), {
				class: k(["chevron", { flipped: o.value.has(e.key) }]),
				"aria-hidden": "true"
			}, null, 8, ["class"])
		], 8, iR), o.value.has(e.key) ? (R(), z("div", lR, [e.pending ? W("", !0) : (R(), z("div", {
			key: 0,
			class: k(["storyline-toolbar", { solo: e.main }]),
			role: "toolbar",
			"aria-label": c(e)
		}, [
			e.main ? W("", !0) : (R(), z(L, { key: 0 }, [
				H(Q, {
					icon: M(cA),
					label: M(Y)("storylines.ifLine.toggle"),
					pressed: e.if,
					small: "",
					onClick: (t) => u(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				H(Q, {
					icon: e.hidden ? M(pk) : M(mk),
					label: M(Y)("storylines.visible.toggle"),
					pressed: !e.hidden,
					small: "",
					onClick: (t) => d(e)
				}, null, 8, [
					"icon",
					"label",
					"pressed",
					"onClick"
				]),
				t[0] ||= V("span", {
					class: "storyline-toolbar-sep",
					"aria-hidden": "true"
				}, null, -1)
			], 64)),
			H(Q, {
				icon: M(Wk),
				label: e.main && !e.name ? M(Y)("storylines.nameMain") : M(Y)("common.rename"),
				small: "",
				onClick: (t) => p(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]),
			e.main ? W("", !0) : (R(), B(Q, {
				key: 1,
				icon: M(lk),
				label: M(Y)("storylines.makeMain"),
				small: "",
				onClick: (t) => f(e)
			}, null, 8, [
				"icon",
				"label",
				"onClick"
			]))
		], 10, uR)), e.floors.length ? (R(), z("ul", fR, [(R(!0), z(L, null, I(e.floors, (e) => (R(), z("li", {
			key: e.index,
			class: "row tight small clickable",
			title: M(Y)("storylines.jump"),
			onClick: (t) => M(eO)(e.index)
		}, [
			V("span", mR, "#" + A(e.index), 1),
			V("span", hR, A(e.user ? M(Y)("storylines.user") : M(Y)("storylines.narrator")), 1),
			V("span", gR, A(e.title || "…"), 1)
		], 8, pR))), 128))])) : (R(), z("div", dR, A(M(Y)("storylines.empty")), 1))])) : W("", !0)], 2))), 128))], 64)) : (R(), z("div", tR, [H(M(xk), { "aria-hidden": "true" }), V("span", null, A(M(Y)("memory.noChat")), 1)])) : (R(), B(CN, { key: 0 }));
	}
});
//#endregion
//#region src/media/image/refs.ts
function vR(e) {
	let t = new Set(e.map((e) => e.id)), n = 1;
	for (; t.has(`ref${n}`);) n++;
	return `ref${n}`;
}
async function yR() {
	await mx("ref:", new Set(Zb().image.connections.flatMap((e) => e.refs.map((e) => e.blob)))).catch((e) => console.warn("[AP] media gc failed", e));
}
//#endregion
//#region src/ui/panel/media/ConnectionBar.vue?vue&type=script&setup=true&lang.ts
var bR = {
	key: 0,
	class: "row tight"
}, xR = ["aria-label"], SR = {
	key: 1,
	class: "row tight"
}, CR = ["value", "aria-label"], wR = ["label"], TR = ["value"], ER = {
	key: 1,
	class: "grow faint small"
}, DR = /* @__PURE__ */ F({
	__name: "ConnectionBar",
	props: {
		connections: {},
		active: {},
		apiLabel: { type: Function }
	},
	emits: [
		"select",
		"add",
		"copy",
		"remove",
		"rename"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => {
			let e = [];
			for (let t of n.connections) {
				let n = e.find((e) => e.api === t.api);
				n ? n.items.push(t) : e.push({
					api: t.api,
					items: [t]
				});
			}
			return e;
		}), a = /* @__PURE__ */ j(!1), o = /* @__PURE__ */ j("");
		function s() {
			n.active && (o.value = n.active.name, a.value = !0);
		}
		function c() {
			let e = o.value.trim();
			e && n.active && r("rename", n.active, e), a.value = !1;
		}
		return (t, n) => a.value ? (R(), z("div", bR, [
			P(V("input", {
				"onUpdate:modelValue": n[0] ||= (e) => o.value = e,
				class: "input grow",
				"aria-label": M(Y)("common.rename"),
				onKeydown: [_s(c, ["enter"]), n[1] ||= _s((e) => a.value = !1, ["esc"])]
			}, null, 40, xR), [[as, o.value]]),
			H(Q, {
				icon: M(xA),
				label: M(Y)("common.cancel"),
				onClick: n[2] ||= (e) => a.value = !1
			}, null, 8, ["icon", "label"]),
			H(Q, {
				icon: M(WO),
				label: M(Y)("common.save"),
				active: "",
				onClick: c
			}, null, 8, ["icon", "label"])
		])) : (R(), z("div", SR, [
			e.connections.length ? (R(), z("select", {
				key: 0,
				class: "input grow",
				value: e.active?.id,
				"aria-label": M(Y)("media.connection"),
				onChange: n[3] ||= (e) => r("select", e.target.value)
			}, [(R(!0), z(L, null, I(i.value, (t) => (R(), z("optgroup", {
				key: t.api,
				label: e.apiLabel(t.api)
			}, [(R(!0), z(L, null, I(t.items, (e) => (R(), z("option", {
				key: e.id,
				value: e.id
			}, A(e.name), 9, TR))), 128))], 8, wR))), 128))], 40, CR)) : (R(), z("span", ER, A(M(Y)("media.noConnection")), 1)),
			H(Q, {
				icon: M(qk),
				label: M(Y)("media.addConnection"),
				small: "",
				onClick: n[4] ||= (e) => r("add")
			}, null, 8, ["icon", "label"]),
			e.active ? (R(), z(L, { key: 2 }, [
				H(Q, {
					icon: M(ck),
					label: M(Y)("common.copy"),
					small: "",
					onClick: n[5] ||= (t) => r("copy", e.active)
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: M(Gk),
					label: M(Y)("common.rename"),
					small: "",
					onClick: s
				}, null, 8, ["icon", "label"]),
				H(Q, {
					icon: M(fA),
					label: M(Y)("common.delete"),
					small: "",
					danger: "",
					align: "end",
					onClick: n[6] ||= (t) => r("remove", e.active)
				}, null, 8, ["icon", "label"])
			], 64)) : W("", !0)
		]));
	}
}), OR = { class: "media-advanced" }, kR = ["aria-expanded"], AR = {
	key: 0,
	class: "col"
}, jR = ["placeholder"], MR = {
	key: 0,
	class: "xs text-danger"
}, NR = /* @__PURE__ */ F({
	__name: "AdvancedRequest",
	props: {
		connection: {},
		bodyPlaceholder: {}
	},
	emits: ["changed"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = /* @__PURE__ */ j(!1), a = /* @__PURE__ */ j(n.connection.body);
		gr(() => n.connection.id, () => {
			a.value = n.connection.body;
		});
		let o = G(() => Ix(a.value));
		function s(e, t) {
			n.connection.headers = {
				...n.connection.headers,
				[e]: t
			}, r("changed");
		}
		function c(e) {
			let t = { ...n.connection.headers };
			delete t[e], n.connection.headers = t, r("changed");
		}
		function l() {
			o.value || (n.connection.body = a.value, r("changed"));
		}
		return (t, n) => (R(), z("div", OR, [V("button", {
			type: "button",
			class: "btn ghost sm-btn media-advanced-toggle",
			"aria-expanded": i.value,
			onClick: n[0] ||= (e) => i.value = !i.value
		}, [V("span", null, A(M(Y)("media.advanced")), 1), H(M(GO), { class: k(["chevron", { flipped: i.value }]) }, null, 8, ["class"])], 8, kR), i.value ? (R(), z("div", AR, [
			ri(t.$slots, "default"),
			H($, {
				label: M(Y)("media.headers"),
				help: M(Y)("media.headers.hint")
			}, {
				default: N(() => [H(LI, {
					entries: e.connection.headers,
					"key-placeholder": M(Y)("media.headers.name"),
					"value-placeholder": M(Y)("media.headers.value"),
					onSet: s,
					onRemove: c
				}, null, 8, [
					"entries",
					"key-placeholder",
					"value-placeholder"
				])]),
				_: 1
			}, 8, ["label", "help"]),
			H($, {
				label: M(Y)("media.body"),
				help: M(Y)("media.body.hint")
			}, {
				default: N(() => [P(V("textarea", {
					"onUpdate:modelValue": n[1] ||= (e) => a.value = e,
					class: "input mono",
					rows: "4",
					spellcheck: "false",
					placeholder: e.bodyPlaceholder ?? "{ }",
					onChange: l
				}, null, 40, jR), [[as, a.value]]), o.value ? (R(), z("span", MR, A(o.value), 1)) : W("", !0)]),
				_: 1
			}, 8, ["label", "help"])
		])) : W("", !0)]));
	}
}), PR = ["value", "placeholder"], FR = ["value"], IR = [
	"list",
	"value",
	"placeholder"
], LR = ["id"], RR = ["value"], zR = ["value", "placeholder"], BR = ["value", "placeholder"], VR = { class: "col media-refs" }, HR = { class: "badge neutral mono" }, UR = [
	"value",
	"placeholder",
	"onChange"
], WR = ["value"], GR = /* @__PURE__ */ F({
	__name: "ImageSettings",
	setup(e) {
		let t = G(() => Zb().image), n = G(() => nx(t.value)), r = {
			openai: [
				"gpt-image-2.6-flare",
				"gpt-image-2.6-sunburst",
				"gpt-image-2.5-flare",
				"gpt-image-2.5-sunburst",
				"gpt-image-1"
			],
			gemini: [
				"gemini-nano-banana-2.1",
				"gemini-3.1-flash-image",
				"gemini-3-pro-image",
				"gemini-2.5-flash-image"
			],
			novelai: [
				"nai-diffusion-4-5-full",
				"nai-diffusion-4-5-curated",
				"nai-diffusion-4-full"
			]
		}, i = (e) => Y(`media.api.${e}`), a = fc.map((e) => ({
			value: e,
			label: i(e)
		})), o = (e, n) => {
			t.value[e] = n, Qb();
		};
		function s(e, t) {
			let r = n.value;
			r && (r[e] = t, Qb());
		}
		function c() {
			let e = ex("openai", Y("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, Qb();
		}
		function l(e) {
			let n = rx(e, Y("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, Qb();
		}
		function u(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), Qb(), yR();
		}
		let d = (e) => {
			t.value.active = e, Qb();
		}, f = (e, t) => {
			e.name = t, Qb();
		}, p = (e) => {
			n.value && (tx(n.value, e), Qb());
		}, m = /* @__PURE__ */ j(null);
		async function h(e) {
			let t = n.value, r = [...e.target.files ?? []];
			if (e.target.value = "", t) {
				for (let e of r) {
					if (!e.type.startsWith("image/")) continue;
					let n = await lx(e, { prefix: "ref:" });
					t.refs.push({
						id: vR(t.refs),
						description: e.name.replace(/\.[^.]+$/, ""),
						blob: n
					});
				}
				Qb();
			}
		}
		function g(e) {
			let r = n.value;
			if (!r) return;
			let [i] = r.refs.splice(e, 1);
			Qb(), i && !t.value.connections.some((e) => e.refs.some((e) => e.blob === i.blob)) && fx(i.blob);
		}
		return (e, _) => (R(), B(dj, {
			title: M(Y)("media.image"),
			icon: M(Ok)
		}, {
			actions: N(() => [H(JM, {
				"model-value": t.value.enabled,
				label: M(Y)("media.image"),
				"onUpdate:modelValue": _[0] ||= (e) => o("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: N(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: M(Y)("media.auto"),
					help: M(Y)("media.image.auto.hint"),
					inline: ""
				}, {
					default: N(() => [H(JM, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": _[1] ||= (e) => o("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(DR, {
					connections: t.value.connections,
					active: n.value,
					"api-label": i,
					onSelect: d,
					onAdd: c,
					onCopy: l,
					onRemove: u,
					onRename: f
				}, null, 8, ["connections", "active"]),
				n.value ? (R(), z("div", {
					key: n.value.id,
					class: "col media-conn"
				}, [
					H(EN, {
						"model-value": n.value.api,
						options: M(a),
						"onUpdate:modelValue": _[2] ||= (e) => p(e)
					}, null, 8, ["model-value", "options"]),
					H($, { label: M(Y)("media.baseUrl") }, {
						default: N(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: M(Jb)[n.value.api].baseUrl,
							spellcheck: "false",
							onChange: _[3] ||= (e) => s("baseUrl", e.target.value.trim())
						}, null, 40, PR)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(Y)("media.apiKey") }, {
						default: N(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: _[4] ||= (e) => s("apiKey", e.target.value.trim())
						}, null, 40, FR)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(Y)("media.model") }, {
						default: N(() => [V("input", {
							class: "input",
							list: `ap-image-models-${n.value.api}`,
							value: n.value.model,
							placeholder: M(Jb)[n.value.api].model,
							spellcheck: "false",
							onChange: _[5] ||= (e) => s("model", e.target.value.trim())
						}, null, 40, IR), V("datalist", { id: `ap-image-models-${n.value.api}` }, [(R(!0), z(L, null, I(r[n.value.api], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, RR))), 128))], 8, LR)]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: M(Y)("media.image.style"),
						help: M(Y)("media.image.style.hint")
					}, {
						default: N(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.style,
							placeholder: M(Y)(n.value.api === "novelai" ? "media.image.style.tags" : "media.image.style.nl"),
							onChange: _[6] ||= (e) => s("style", e.target.value)
						}, null, 40, zR)]),
						_: 1
					}, 8, ["label", "help"]),
					n.value.api === "novelai" ? (R(), B($, {
						key: 0,
						label: M(Y)("media.image.negative")
					}, {
						default: N(() => [V("textarea", {
							class: "input",
							rows: "2",
							value: n.value.negative ?? "",
							placeholder: M(Y)("media.image.negative.placeholder"),
							onChange: _[7] ||= (e) => s("negative", e.target.value)
						}, null, 40, BR)]),
						_: 1
					}, 8, ["label"])) : W("", !0),
					H($, {
						label: M(Y)("media.image.nsfwBlock"),
						help: M(Y)("media.image.nsfwBlock.hint"),
						inline: ""
					}, {
						default: N(() => [H(JM, {
							"model-value": n.value.nsfwBlock,
							"onUpdate:modelValue": _[8] ||= (e) => s("nsfwBlock", e)
						}, null, 8, ["model-value"])]),
						_: 1
					}, 8, ["label", "help"]),
					M(Yb)(n.value.api) ? (R(), B($, {
						key: 1,
						label: M(Y)("media.image.refs"),
						help: M(Y)("media.image.refs.hint")
					}, {
						default: N(() => [V("div", VR, [
							(R(!0), z(L, null, I(n.value.refs, (e, t) => (R(), z("div", {
								key: e.blob,
								class: "media-ref"
							}, [
								H(fM, {
									"blob-key": e.blob,
									class: "media-ref-thumb",
									alt: e.description
								}, null, 8, ["blob-key", "alt"]),
								V("span", HR, A(e.id), 1),
								V("input", {
									class: "input grow",
									value: e.description,
									placeholder: M(Y)("media.image.refs.description"),
									onChange: (t) => {
										e.description = t.target.value, M(Qb)();
									}
								}, null, 40, UR),
								H(Q, {
									icon: M(fA),
									label: M(Y)("common.delete"),
									small: "",
									danger: "",
									align: "end",
									onClick: (e) => g(t)
								}, null, 8, [
									"icon",
									"label",
									"onClick"
								])
							]))), 128)),
							V("button", {
								type: "button",
								class: "btn ghost add",
								onClick: _[9] ||= (e) => m.value?.click()
							}, [H(M(Dk)), U(A(M(Y)("media.image.refs.add")), 1)]),
							V("input", {
								ref_key: "fileInput",
								ref: m,
								type: "file",
								accept: "image/*",
								multiple: "",
								hidden: "",
								onChange: h
							}, null, 544)
						])]),
						_: 1
					}, 8, ["label", "help"])) : W("", !0),
					H(NR, {
						connection: n.value,
						onChanged: _[11] ||= (e) => M(Qb)()
					}, {
						default: N(() => [n.value.api === "gemini" ? (R(), B($, {
							key: 0,
							label: M(Y)("media.image.geminiEndpoint")
						}, {
							default: N(() => [V("select", {
								class: "input",
								value: n.value.endpoint ?? "interactions",
								onChange: _[10] ||= (e) => s("endpoint", e.target.value)
							}, [..._[12] ||= [V("option", { value: "interactions" }, "Interactions", -1), V("option", { value: "generateContent" }, "generateContent", -1)]], 40, WR)]),
							_: 1
						}, 8, ["label"])) : W("", !0)]),
						_: 1
					}, 8, ["connection"])
				])) : W("", !0)
			], 64)) : W("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
});
//#endregion
//#region src/media/speech/connections.ts
function KR(e, t) {
	let n = WC(e)?.defaults;
	return {
		id: $b(),
		name: t,
		api: e,
		baseUrl: n?.baseUrl ?? "",
		apiKey: "",
		model: n?.model ?? "",
		headers: {},
		body: "",
		voice: null,
		narrator: null,
		bindings: []
	};
}
function qR(e, t) {
	if (e.api === t) return;
	let n = WC(e.api)?.defaults, r = WC(t)?.defaults;
	(!e.baseUrl || e.baseUrl === n?.baseUrl) && (e.baseUrl = r?.baseUrl ?? ""), (!e.model || e.model === n?.model) && (e.model = r?.model ?? ""), e.api = t, e.voice = null, e.narrator = null, e.bindings = e.bindings.map((e) => ({
		character: e.character,
		voice: null
	}));
}
//#endregion
//#region src/ui/panel/media/VoicePicker.vue?vue&type=script&setup=true&lang.ts
var JR = { class: "col tight" }, YR = { class: "speech-voice" }, XR = ["title"], ZR = { class: "ellipsis" }, QR = [
	"list",
	"value",
	"placeholder",
	"aria-label"
], $R = ["id"], ez = ["value"], tz = ["value", "placeholder"], nz = {
	key: 1,
	class: "speech-voice"
}, rz = {
	key: 1,
	class: "col tight"
}, iz = ["placeholder", "onKeydown"], az = {
	key: 0,
	class: "xs text-danger"
}, oz = {
	key: 1,
	class: "row tight faint small"
}, sz = {
	key: 2,
	class: "speech-results"
}, cz = {
	key: 0,
	class: "faint small speech-result"
}, lz = ["onClick"], uz = { class: "col grow" }, dz = { class: "ellipsis" }, fz = {
	key: 0,
	class: "xs faint ellipsis"
}, pz = /* @__PURE__ */ F({
	__name: "VoicePicker",
	props: {
		connection: {},
		modelValue: {},
		placeholder: {},
		label: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = G(() => WC(n.connection.api)), a = G(() => n.modelValue), o = G(() => `ap-voices-${n.connection.api}`), s = G(() => a.value?.kind === "voice" ? a.value.name || i.value?.voices.find((e) => e.id === a.value.id)?.name || a.value.id : "");
		function c(e) {
			let t = e.trim();
			if (!t) return r("update:modelValue", null);
			let n = i.value?.voices.find((e) => e.id === t || e.name.toLowerCase() === t.toLowerCase());
			(a.value?.kind !== "voice" || t !== s.value) && r("update:modelValue", {
				kind: "voice",
				id: n?.id ?? t
			});
		}
		let l = /* @__PURE__ */ j(!1), u = /* @__PURE__ */ j(""), d = /* @__PURE__ */ j(!1), f = /* @__PURE__ */ j(null), p = /* @__PURE__ */ j(""), m = null;
		async function h() {
			let e = i.value;
			if (e?.search) {
				m?.abort(), m = new AbortController(), d.value = !0, p.value = "";
				try {
					f.value = await e.search(iw, n.connection, u.value, m.signal);
				} catch (e) {
					e instanceof DOMException && e.name === "AbortError" || (p.value = QS(e));
				} finally {
					d.value = !1;
				}
			}
		}
		function g() {
			l.value = !l.value, l.value && !f.value && h();
		}
		async function _(e) {
			let t = e.id, a = i.value;
			if (e.owner && a?.adopt) {
				d.value = !0;
				try {
					t = await a.adopt(iw, n.connection, e);
				} catch (e) {
					p.value = QS(e);
					return;
				} finally {
					d.value = !1;
				}
			}
			r("update:modelValue", {
				kind: "voice",
				id: t,
				name: e.name
			}), l.value = !1;
		}
		let v = null;
		function y(e) {
			v?.pause(), e.preview && (v = new Audio(e.preview), v.play().catch(() => void 0));
		}
		let b = /* @__PURE__ */ j(null), x = /* @__PURE__ */ j(null);
		async function S(e, t) {
			let n = e.target, i = n.files?.[0];
			if (n.value = "", !i) return;
			let o = await lx(i, { prefix: "voice:" }), s = a.value?.kind === "clone" ? a.value : null;
			if (t === "consent" && !s) return;
			let c = t === "audio" || !s ? {
				kind: "clone",
				audio: o,
				name: i.name,
				...s?.text ? { text: s.text } : {},
				...s?.consent ? { consent: s.consent } : {}
			} : {
				...s,
				consent: o,
				id: void 0
			};
			r("update:modelValue", c), Ew();
		}
		function ee(e) {
			if (a.value?.kind !== "clone") return;
			let { id: t, ...n } = a.value;
			r("update:modelValue", {
				...n,
				text: e.trim() || void 0
			});
		}
		function C() {
			r("update:modelValue", null), Ew();
		}
		return (t, n) => (R(), z("div", JR, [
			V("div", YR, [
				a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [V("span", {
					class: "chip grow",
					title: a.value.audio
				}, [H(M(_k), { class: "faint" }), V("span", ZR, A(a.value.name || M(Y)("media.speech.clone")), 1)], 8, XR), H(Q, {
					icon: M(xA),
					label: M(Y)("common.delete"),
					small: "",
					onClick: C
				}, null, 8, ["icon", "label"])], 64)) : (R(), z(L, { key: 1 }, [
					V("input", {
						class: "input",
						list: o.value,
						value: s.value,
						placeholder: e.placeholder ?? (i.value?.voices[0]?.name || M(Y)("media.speech.voiceId")),
						"aria-label": e.label,
						spellcheck: "false",
						onChange: n[0] ||= (e) => c(e.target.value)
					}, null, 40, QR),
					V("datalist", { id: o.value }, [(R(!0), z(L, null, I(i.value?.voices ?? [], (e) => (R(), z("option", {
						key: e.id,
						value: e.id
					}, A(e.name), 9, ez))), 128))], 8, $R),
					i.value?.search ? (R(), B(Q, {
						key: 0,
						icon: M(tA),
						label: M(Y)("media.speech.search"),
						small: "",
						pressed: l.value,
						onClick: g
					}, null, 8, [
						"icon",
						"label",
						"pressed"
					])) : W("", !0)
				], 64)),
				i.value?.clone && a.value?.kind !== "clone" ? (R(), B(Q, {
					key: 2,
					icon: M(LO),
					label: M(Y)("media.speech.clone"),
					small: "",
					onClick: n[1] ||= (e) => b.value?.click()
				}, null, 8, ["icon", "label"])) : W("", !0),
				H(Q, {
					icon: M(_A),
					label: M(Y)("media.speech.test"),
					small: "",
					align: "end",
					onClick: n[2] ||= (t) => M(Tw)(e.connection, e.modelValue)
				}, null, 8, ["icon", "label"]),
				V("input", {
					ref_key: "audioInput",
					ref: b,
					type: "file",
					accept: "audio/*",
					hidden: "",
					onChange: n[3] ||= (e) => S(e, "audio")
				}, null, 544)
			]),
			a.value?.kind === "clone" ? (R(), z(L, { key: 0 }, [i.value?.clone?.text === "none" ? W("", !0) : (R(), z("input", {
				key: 0,
				class: "input",
				value: a.value.text ?? "",
				placeholder: M(Y)("media.speech.clone.text"),
				onChange: n[4] ||= (e) => ee(e.target.value)
			}, null, 40, tz)), i.value?.clone?.consent ? (R(), z("div", nz, [V("button", {
				type: "button",
				class: "btn ghost sm-btn",
				onClick: n[5] ||= (e) => x.value?.click()
			}, [H(M(_k)), U(A(a.value.consent ? M(Y)("media.speech.clone.consentSet") : M(Y)("media.speech.clone.consent")), 1)]), V("input", {
				ref_key: "consentInput",
				ref: x,
				type: "file",
				accept: "audio/*",
				hidden: "",
				onChange: n[6] ||= (e) => S(e, "consent")
			}, null, 544)])) : W("", !0)], 64)) : W("", !0),
			l.value ? (R(), z("div", rz, [
				P(V("input", {
					"onUpdate:modelValue": n[7] ||= (e) => u.value = e,
					class: "input",
					placeholder: M(Y)("media.speech.search.placeholder"),
					onKeydown: _s(hs(h, ["prevent"]), ["enter"])
				}, null, 40, iz), [[as, u.value]]),
				p.value ? (R(), z("span", az, A(p.value), 1)) : W("", !0),
				d.value && !f.value ? (R(), z("div", oz, [H(M(Nk), { class: "spin" })])) : f.value ? (R(), z("div", sz, [f.value.length ? W("", !0) : (R(), z("span", cz, A(M(Y)("media.speech.search.none")), 1)), (R(!0), z(L, null, I(f.value, (e) => (R(), z("div", {
					key: e.id,
					class: "speech-result"
				}, [V("button", {
					type: "button",
					class: "speech-result grow",
					onClick: (t) => _(e)
				}, [V("span", uz, [V("span", dz, A(e.name), 1), e.description ? (R(), z("span", fz, A(e.description), 1)) : W("", !0)])], 8, lz), e.preview ? (R(), B(Q, {
					key: 0,
					icon: M(_A),
					label: M(Y)("media.speech.test"),
					small: "",
					align: "end",
					onClick: (t) => y(e)
				}, null, 8, [
					"icon",
					"label",
					"onClick"
				])) : W("", !0)]))), 128))])) : W("", !0)
			])) : W("", !0)
		]));
	}
}), mz = ["value"], hz = ["value"], gz = ["value", "placeholder"], _z = ["value"], vz = [
	"list",
	"value",
	"placeholder"
], yz = ["id"], bz = ["value"], xz = { class: "col" }, Sz = [
	"value",
	"placeholder",
	"onChange"
], Cz = /* @__PURE__ */ F({
	__name: "SpeechSettings",
	setup(e) {
		let t = G(() => Zb().speech), n = G(() => nx(t.value)), r = G(() => n.value ? WC(n.value.api) : void 0), i = (e) => Y(`media.api.${e}`), a = (e, n) => {
			t.value[e] = n, Qb();
		};
		function o(e, t) {
			let r = n.value;
			r && (r[e] = t, Qb());
		}
		function s() {
			let e = KR("fish", Y("media.connection.default", { n: t.value.connections.length + 1 }));
			t.value.connections.push(e), t.value.active = e.id, Qb();
		}
		function c(e) {
			let n = rx(e, Y("media.connection.copyName", { name: e.name }));
			t.value.connections.push(n), t.value.active = n.id, Qb();
		}
		function l(e) {
			t.value.connections = t.value.connections.filter((t) => t.id !== e.id), t.value.active === e.id && (t.value.active = t.value.connections[0]?.id ?? null), Qb(), Ew();
		}
		let u = (e) => {
			t.value.active = e, Qb();
		}, d = (e, t) => {
			e.name = t, Qb();
		}, f = (e) => {
			n.value && (qR(n.value, e), Qb(), Ew());
		};
		function p() {
			n.value?.bindings.push({
				character: "",
				voice: null
			}), Qb();
		}
		function m(e, t) {
			let r = n.value?.bindings[e];
			r && (Object.assign(r, t), Qb());
		}
		function h(e) {
			n.value?.bindings.splice(e, 1), Qb(), Ew();
		}
		return (e, g) => (R(), B(dj, {
			title: M(Y)("media.speech"),
			icon: M(LO)
		}, {
			actions: N(() => [H(JM, {
				"model-value": t.value.enabled,
				label: M(Y)("media.speech"),
				"onUpdate:modelValue": g[0] ||= (e) => a("enabled", e)
			}, null, 8, ["model-value", "label"])]),
			default: N(() => [t.value.enabled ? (R(), z(L, { key: 0 }, [
				H($, {
					label: M(Y)("media.auto"),
					help: M(Y)("media.speech.auto.hint"),
					inline: ""
				}, {
					default: N(() => [H(JM, {
						"model-value": t.value.auto,
						"onUpdate:modelValue": g[1] ||= (e) => a("auto", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H($, {
					label: M(Y)("media.speech.narrator"),
					help: M(Y)("media.speech.narrator.hint"),
					inline: ""
				}, {
					default: N(() => [H(JM, {
						"model-value": t.value.narrator,
						"onUpdate:modelValue": g[2] ||= (e) => a("narrator", e)
					}, null, 8, ["model-value"])]),
					_: 1
				}, 8, ["label", "help"]),
				H(DR, {
					connections: t.value.connections,
					active: n.value,
					"api-label": i,
					onSelect: u,
					onAdd: s,
					onCopy: c,
					onRemove: l,
					onRename: d
				}, null, 8, ["connections", "active"]),
				n.value ? (R(), z("div", {
					key: n.value.id,
					class: "col media-conn"
				}, [
					H($, { label: M(Y)("media.speech.api") }, {
						default: N(() => [V("select", {
							class: "input",
							value: n.value.api,
							onChange: g[3] ||= (e) => f(e.target.value)
						}, [(R(!0), z(L, null, I(M(pc), (e) => (R(), z("option", {
							key: e,
							value: e
						}, A(i(e)), 9, hz))), 128))], 40, mz)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(Y)("media.baseUrl") }, {
						default: N(() => [V("input", {
							class: "input",
							value: n.value.baseUrl,
							placeholder: r.value?.defaults.baseUrl,
							spellcheck: "false",
							onChange: g[4] ||= (e) => o("baseUrl", e.target.value.trim())
						}, null, 40, gz)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(Y)("media.apiKey") }, {
						default: N(() => [V("input", {
							class: "input",
							type: "password",
							autocomplete: "off",
							value: n.value.apiKey,
							onChange: g[5] ||= (e) => o("apiKey", e.target.value.trim())
						}, null, 40, _z)]),
						_: 1
					}, 8, ["label"]),
					H($, { label: M(Y)("media.model") }, {
						default: N(() => [V("input", {
							class: "input",
							list: `ap-speech-models-${n.value.api}`,
							value: n.value.model,
							placeholder: r.value?.defaults.model,
							spellcheck: "false",
							onChange: g[6] ||= (e) => o("model", e.target.value.trim())
						}, null, 40, vz), V("datalist", { id: `ap-speech-models-${n.value.api}` }, [(R(!0), z(L, null, I(r.value?.models ?? [], (e) => (R(), z("option", {
							key: e,
							value: e
						}, null, 8, bz))), 128))], 8, yz)]),
						_: 1
					}, 8, ["label"]),
					H($, {
						label: M(Y)("media.speech.voice"),
						help: M(Y)("media.speech.voice.hint")
					}, {
						default: N(() => [H(pz, {
							connection: n.value,
							"model-value": n.value.voice,
							label: M(Y)("media.speech.voice"),
							"onUpdate:modelValue": g[7] ||= (e) => o("voice", e)
						}, null, 8, [
							"connection",
							"model-value",
							"label"
						])]),
						_: 1
					}, 8, ["label", "help"]),
					t.value.narrator ? (R(), B($, {
						key: 0,
						label: M(Y)("media.speech.narratorVoice")
					}, {
						default: N(() => [H(pz, {
							connection: n.value,
							"model-value": n.value.narrator,
							label: M(Y)("media.speech.narratorVoice"),
							placeholder: M(Y)("media.speech.sameAsDefault"),
							"onUpdate:modelValue": g[8] ||= (e) => o("narrator", e)
						}, null, 8, [
							"connection",
							"model-value",
							"label",
							"placeholder"
						])]),
						_: 1
					}, 8, ["label"])) : W("", !0),
					H($, {
						label: M(Y)("media.speech.bindings"),
						help: M(Y)("media.speech.bindings.hint")
					}, {
						default: N(() => [V("div", xz, [(R(!0), z(L, null, I(n.value.bindings, (e, t) => (R(), z("div", {
							key: t,
							class: "speech-binding"
						}, [
							V("input", {
								class: "input",
								value: e.character,
								placeholder: M(Y)("media.speech.character"),
								onChange: (e) => m(t, { character: e.target.value.trim() })
							}, null, 40, Sz),
							H(pz, {
								class: "grow",
								connection: n.value,
								"model-value": e.voice,
								label: e.character || M(Y)("media.speech.character"),
								"onUpdate:modelValue": (e) => m(t, { voice: e })
							}, null, 8, [
								"connection",
								"model-value",
								"label",
								"onUpdate:modelValue"
							]),
							H(Q, {
								icon: M(fA),
								label: M(Y)("common.delete"),
								small: "",
								danger: "",
								align: "end",
								onClick: (e) => h(t)
							}, null, 8, [
								"icon",
								"label",
								"onClick"
							])
						]))), 128)), V("button", {
							type: "button",
							class: "btn ghost add",
							onClick: p
						}, [H(M(qk)), U(A(M(Y)("media.speech.addBinding")), 1)])])]),
						_: 1
					}, 8, ["label", "help"]),
					H(NR, {
						connection: n.value,
						onChanged: g[9] ||= (e) => M(Qb)()
					}, null, 8, ["connection"])
				])) : W("", !0)
			], 64)) : W("", !0)]),
			_: 1
		}, 8, ["title", "icon"]));
	}
}), wz = ["value"], Tz = /* @__PURE__ */ F({
	__name: "MediaTab",
	setup(e) {
		let { preset: n } = xN(), r = G(() => Zb().cors), i = [
			"auto",
			"on",
			"off"
		].map((e) => ({
			value: e,
			label: Y(`media.cors.${e}`),
			hint: Y(`media.cors.${e}.hint`)
		})), a = G(() => [{
			value: "host",
			label: t() ? "TauriTavern" : "SillyTavern",
			hint: Y(t() ? "media.proxy.host.tt" : "media.proxy.host.st")
		}, {
			value: "custom",
			label: Y("media.proxy.custom"),
			hint: Y("media.proxy.custom.hint")
		}]);
		function o(e, t) {
			r.value[e] = t, Qb();
		}
		return (e, t) => M(n) ? (R(), z(L, { key: 1 }, [
			H(dj, {
				title: M(Y)("media.cors"),
				icon: M(zk),
				collapsible: "",
				open: r.value.mode !== "auto" || r.value.proxy !== "host"
			}, {
				default: N(() => [H(EN, {
					"model-value": r.value.mode,
					options: M(i),
					"onUpdate:modelValue": t[0] ||= (e) => o("mode", e)
				}, null, 8, ["model-value", "options"]), r.value.mode === "off" ? W("", !0) : (R(), z(L, { key: 0 }, [H($, { label: M(Y)("media.proxy") }, {
					default: N(() => [H(EN, {
						"model-value": r.value.proxy,
						options: a.value,
						"onUpdate:modelValue": t[1] ||= (e) => o("proxy", e)
					}, null, 8, ["model-value", "options"])]),
					_: 1
				}, 8, ["label"]), r.value.proxy === "custom" ? (R(), B($, {
					key: 0,
					label: M(Y)("media.proxy.url")
				}, {
					default: N(() => [V("input", {
						class: "input mono",
						value: r.value.customUrl,
						placeholder: "https://proxy.example/?url={url}",
						spellcheck: "false",
						onChange: t[2] ||= (e) => o("customUrl", e.target.value.trim())
					}, null, 40, wz)]),
					_: 1
				}, 8, ["label"])) : W("", !0)], 64))]),
				_: 1
			}, 8, [
				"title",
				"icon",
				"open"
			]),
			M(YS)(M(n)) ? (R(), B(GR, { key: 0 })) : W("", !0),
			M(XS)(M(n)) ? (R(), B(Cz, { key: 1 })) : W("", !0)
		], 64)) : (R(), B(CN, { key: 0 }));
	}
}), Ez = ["aria-label"], Dz = { class: "panel-head" }, Oz = { class: "panel-logo" }, kz = { class: "grow" }, Az = { class: "panel-title ellipsis" }, jz = { class: "panel-sub ellipsis" }, Mz = [
	"title",
	"aria-selected",
	"onClick"
], Nz = { class: "panel-body scroll" }, Pz = /* @__PURE__ */ F({
	__name: "Panel",
	setup(e) {
		let t = [
			{
				id: "presets",
				icon: Vk,
				view: yN
			},
			{
				id: "config",
				icon: iA,
				view: aP
			},
			{
				id: "modules",
				icon: zO,
				view: pI
			},
			{
				id: "writing",
				icon: Wk,
				view: SI
			},
			{
				id: "memory",
				icon: BO,
				view: HI
			},
			{
				id: "storylines",
				icon: xk,
				view: _R
			},
			{
				id: "media",
				icon: ZO,
				view: Tz
			},
			{
				id: "debug",
				icon: VO,
				view: eR
			}
		], n = G(() => t.filter((e) => (e.id !== "storylines" || qD.value) && (e.id !== "media" || ZS(lS.value)))), r = G(() => n.value.find((e) => e.id === X.tab) ?? n.value[0]), i = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		}), a = G(() => {
			let e = lS.value;
			return e ? `v${e.version} · ${uS.value.config}` : Y("panel.noPreset");
		}), o = (e) => {
			e.key === "Escape" && X.panelOpen && (X.panelOpen = !1);
		};
		return Jr(() => document.addEventListener("keydown", o)), Xr(() => {
			document.removeEventListener("keydown", o), wO(!1);
		}), gr(() => X.panelOpen, (e) => {
			e && wO(!0);
		}, { immediate: !0 }), (e, t) => (R(), B(so, {
			name: "panel",
			onAfterLeave: t[2] ||= (e) => M(wO)(!1)
		}, {
			default: N(() => [M(X).panelOpen ? (R(), z("aside", {
				key: 0,
				class: "panel",
				role: "dialog",
				"aria-label": M(Y)("app.name")
			}, [
				V("header", Dz, [
					V("div", Oz, [H(M(Ak))]),
					V("div", kz, [V("div", Az, A(M(lS) ? M(Fp)(M(lS)) : M(Y)("app.name")), 1), V("div", jz, A(a.value), 1)]),
					H(JM, {
						modelValue: i.value,
						"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
						label: M(Y)("panel.enabled")
					}, null, 8, ["modelValue", "label"]),
					H(Q, {
						icon: M(xA),
						label: M(Y)("common.close"),
						align: "end",
						below: "",
						onClick: t[1] ||= (e) => M(X).panelOpen = !1
					}, null, 8, ["icon", "label"])
				]),
				V("nav", {
					class: k(["tabs", { many: n.value.length > 6 }]),
					role: "tablist"
				}, [(R(!0), z(L, null, I(n.value, (e) => (R(), z("button", {
					key: e.id,
					type: "button",
					role: "tab",
					class: k(["tab", { on: e.id === M(X).tab }]),
					title: M(Y)(`tab.${e.id}`),
					"aria-selected": e.id === M(X).tab,
					onClick: (t) => M(X).tab = e.id
				}, [(R(), B($r(e.icon))), V("span", null, A(M(Y)(`tab.${e.id}`)), 1)], 10, Mz))), 128))], 2),
				V("main", Nz, [(R(), B(Hr, null, [(R(), B($r(r.value.view), { key: r.value.id }))], 1024))])
			], 8, Ez)) : W("", !0)]),
			_: 1
		}));
	}
}), Fz = { class: "inline-drawer" }, Iz = { class: "inline-drawer-toggle inline-drawer-header" }, Lz = { class: "inline-drawer-content" }, Rz = { class: "flex-container alignItemsCenter spaceBetween" }, zz = {
	class: "checkbox_label flex1",
	for: "ap_settings_enabled"
}, Bz = { key: 0 }, Vz = { class: "text_muted" }, Hz = {
	key: 1,
	class: "text_muted"
}, Uz = /* @__PURE__ */ F({
	__name: "SettingsDrawer",
	setup(e) {
		let t = G({
			get: () => K().enabled,
			set: (e) => {
				K().enabled = e, q();
			}
		});
		return (e, n) => (R(), z("div", Fz, [V("div", Iz, [V("b", null, A(M(Y)("app.name")), 1), n[3] ||= V("div", { class: "inline-drawer-icon fa-solid fa-circle-chevron-down down" }, null, -1)]), V("div", Lz, [
			V("div", Rz, [V("label", zz, [P(V("input", {
				id: "ap_settings_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => t.value = e,
				type: "checkbox"
			}, null, 512), [[os, t.value]]), V("span", null, A(M(Y)("settings.enable")), 1)]), V("div", {
				class: "menu_button menu_button_icon",
				role: "button",
				tabindex: "0",
				onClick: n[1] ||= (e) => M(mS)(),
				onKeydown: n[2] ||= _s((e) => M(mS)(), ["enter"])
			}, [n[4] ||= V("i", { class: "fa-solid fa-layer-group" }, null, -1), V("span", null, A(M(Y)("panel.open")), 1)], 32)]),
			n[5] ||= V("hr", null, null, -1),
			V("h4", null, A(M(Y)("settings.preset")), 1),
			M(lS) ? (R(), z("div", Bz, [U(A(M(Fp)(M(lS))) + " ", 1), V("span", Vz, "v" + A(M(lS).version) + " · " + A(M(uS).config), 1)])) : (R(), z("i", Hz, A(M(Y)("settings.inactive")), 1))
		])]));
	}
}), Wz = {
	key: 0,
	class: "preset-banner"
}, Gz = { class: "preset-banner-text" }, Kz = /* @__PURE__ */ F({
	__name: "PresetBanner",
	setup(e) {
		return (e, t) => M(lS) ? (R(), z("div", Wz, [
			H(M(Ak), { class: "preset-banner-icon" }),
			V("span", Gz, A(M(Y)("banner.usesAp")), 1),
			V("button", {
				type: "button",
				class: "btn primary",
				onClick: t[0] ||= (e) => M(mS)()
			}, A(M(Y)("panel.open")), 1)
		])) : W("", !0);
	}
});
//#endregion
//#region src/ui/index.ts
function qz() {
	let e = document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
	if (!e || e.querySelector("#advanced_preset_settings")) return;
	let t = document.createElement("div");
	t.id = "advanced_preset_settings", e.append(t), xs(Uz).mount(t);
}
function Jz() {
	_E("ap-stages", BA, ["mesid"]), _E("ap-cards", IM, ["mesid"]), _E("ap-top-cards", IM, ["mesid", "position"]), _E("ap-dock", VM), _E("ap-storyline", GM, ["mesid"]), _E("ap-panel", Pz), _E("ap-preset-banner", Kz), hE(), cS();
	let { eventSource: t, eventTypes: n } = e();
	for (let e of [
		n.OAI_PRESET_CHANGED_AFTER,
		n.SETTINGS_UPDATED,
		n.APP_READY,
		n.SETTINGS_LOADED_AFTER
	]) e && t.on(e, cS);
	EO(), qz(), gO(), KD();
}
//#endregion
//#region src/index.ts
var Yz = {
	version: "1.12.0",
	buildId: "2d6e0f3a54c3de27",
	nextGeneration: (e) => gh(e),
	listPresets: () => bp().map(({ preset: e, source: t }) => ({
		id: e.id,
		name: e.name,
		version: e.version,
		source: t
	})),
	activePresetId: () => rh(),
	update: Ab,
	togglePanel: (e) => {
		X.panelOpen = e ?? !X.panelOpen;
	},
	annotations: HS,
	speech: JS
};
globalThis.advancedPresetInterceptor = Mv, window.AdvancedPreset = Yz;
function Xz(e, t) {
	let n;
	return (...r) => {
		clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
async function Zz() {
	for (let { preset: e } of bp()) try {
		await ch(e);
	} catch (t) {
		console.error("[AP] carrier sync failed", e.id, t);
	}
}
async function Qz() {
	let { eventSource: t, eventTypes: n } = e();
	K(), Ib(), aT(), BT(), VS(), qS(), jw(), NS(), await i(), await vp();
	let r = MT();
	for (let { preset: e } of bp()) {
		let t = Km(e);
		t.length && lg("migrate", {
			id: e.id,
			notes: t
		});
	}
	((e, n) => t.makeFirst ? t.makeFirst(e, n) : t.on(e, n))(n.CHAT_COMPLETION_PROMPT_READY, (e) => fv(e)), t.on(n.CHAT_COMPLETION_SETTINGS_READY, (e) => Lb(e)), qb(), jv(), t.on(n.MESSAGE_RECEIVED, (e, t) => IS(Number(e), t)), t.on(n.GENERATION_STOPPED, () => {
		Dh.setPending(null), Dh.takeArmed();
	}), t.on(n.GENERATION_ENDED, () => Dh.sweep());
	let a = Xz(() => {
		let e = rh(), t = e ? wp(e) : void 0;
		t && mh(t);
	}, 300);
	t.on(n.SETTINGS_UPDATED, a), t.on(n.OAI_PRESET_CHANGED_AFTER, a), t.on(n.OAI_PRESET_CHANGED_AFTER, KT);
	let o = async () => {
		await Promise.race([$w(), new Promise((e) => setTimeout(e, 3e3))]), await Zz();
		for (let e of r) x("info", Y("presets.backToBuiltin", { version: e.version }), Fp(e));
		(async () => {
			await jT();
			for (let { preset: e } of bp()) await Gw(e);
			await GT(), await AT();
		})(), Gb({ reload: !0 }), QT(), wb();
	};
	t.on(n.APP_READY, () => void o()), Jz(), lg("init", {
		version: "1.12.0",
		build: "2d6e0f3a54c3de27",
		enabled: K().enabled
	});
}
var $z = Tb, eB = HD;
Qz().catch((e) => console.error("[AP] init failed", e));
//#endregion
export { $z as advancedPresetOnUpdate, eB as advancedPresetRegisterChatSurface };
